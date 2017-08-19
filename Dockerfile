FROM node

MAINTAINER Dan Power
ENV RABBITMQ=rabbitmq
ENV WATCH_PATH="/mnt/media"

LABEL project="au.id.danpower.transcoder"
LABEL version=1.0

VOLUME $WATCH_PATH

RUN add-apt-repository --yes ppa:stebbins/handbrake-releases && \
    apt-get update && \
    apt-get install -y git && \
    apt-get install -qq handbrake-cli && \
    git clone https://github.com/dan-power/transcoder-worker.git /var/transcoder-worker
WORKDIR /var/transcoder-worker
RUN npm install

CMD ["node", "/var/transcoder-worker/worker.js"]
