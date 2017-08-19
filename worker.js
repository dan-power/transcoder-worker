// Process tasks from the work queue
var amqp = require('amqplib');
var Duration = require('duration')
var hbjs = require('handbrake-js')

amqp.connect('amqp://'+process.env.RABBITMQ).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    var ok = ch.assertQueue('task_queue', {durable: true});
    ok = ok.then(function() { ch.prefetch(1); });
    ok = ok.then(function() {
      ch.consume('task_queue', doWork, {noAck: false});
      console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
    return ok;

    function doWork(msg) {
      var body = msg.content.toString();
      console.log(" [x] Received '%s'", body.filename);

      // { filename: file, options: options }
      const fnLen = body.filename.length;

      // Dont like this, but it will do for now.
      const fnExt = body.filename.substr(fnLen - 3,3);
      const output = body.filename.replace(fnExt, 'mp4');
      const start = new Date();

      body.options.input = body.filename;
      body.options.output = output;

      hbjs.spawn(body.options)
      .on('error', function(err){
        // invalid user input, no video found etc
        console.error("%s: %s", err.errno, err.message);
      })
      .on('progress', function(progress){
        console.log('Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta);
      })
      .on('end', function() {
        const finish = new Date();
        var duration = new Duration(start, finish);

        console.log(" [x] Converted to %s in %s", output, duration.toString("H: %Hs m: %M"));
        ch.ack(msg);
      });
    }
  });
}).catch(console.warn);
