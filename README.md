# transcoder-worker

Working with RabbitMQ/Kubernetes and Docker to create an automated transcoding solution at home.

This is the worker component, the sole purpose of this is grab a message from RabbitMQ, process it and submit output..

    npm install
    node sender.js

Still work in progress, not production ready.

K8s
[N deployments]                [   AUTO SCALE   ]
SENDER N --------> RABBITMQ ---+---> WORKER 1 --+--> LOGGER
                               |                |
                               +---> WORKER 2 --+
                               |                |
                               +---> WORKER N --+
