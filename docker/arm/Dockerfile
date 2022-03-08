FROM debian:stable-slim AS builder

WORKDIR /tmp/install
RUN apt-get update && apt-get install -yq wget
RUN wget -O confluent-community.tar.gz https://packages.confluent.io/archive/7.0/confluent-7.0.1.tar.gz

RUN tar -xzf confluent-community.tar.gz

FROM openjdk:11 AS runner

COPY --from=builder /tmp/install/confluent-7.0.1 /opt/confluent/platform

WORKDIR /opt/confluent/platform

COPY bin_broker bin/broker
COPY bin_schema-registry bin/schema-registry

RUN chmod +x bin/*
