FROM node

ENV RABBITMQ=rabbitmq

LABEL project="au.id.danpower.transcoder"
LABEL version=1.0


RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/dan-power/transcoder-worker.git
RUN node transcoder-worker/worker.js
