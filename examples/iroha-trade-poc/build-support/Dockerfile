FROM rust:1.93.1-bookworm@sha256:1d33950f982ca6411f5e0ee4850be46e03f066f1a9efaeb41922a0e59497c9c2 AS build

RUN apt-get update && apt-get install -y --no-install-recommends cmake clang libssl-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /src
RUN git init -q \
    && git remote add origin https://github.com/hyperledger-iroha/iroha.git \
    && git fetch --quiet --depth 1 origin dc7fdbcbbe0d0d86977bf16f8b4e0af0225acccb \
    && git checkout --quiet --detach FETCH_HEAD \
    && test "$(git rev-parse HEAD)" = dc7fdbcbbe0d0d86977bf16f8b4e0af0225acccb

COPY Cargo.lock ./Cargo.lock
COPY fresh-client.patch lane-preimages.patch /tmp/patches/
RUN git apply /tmp/patches/fresh-client.patch /tmp/patches/lane-preimages.patch
ENV CARGO_INCREMENTAL=0 CARGO_PROFILE_DEV_DEBUG=0
ARG BUILD_JOBS=4
RUN --mount=type=cache,id=iroha-trade-poc-registry,target=/usr/local/cargo/registry \
    --mount=type=cache,id=iroha-trade-poc-target,target=/src/target \
    cargo build --locked --jobs "$BUILD_JOBS" \
      -p irohad -p iroha_kagami -p iroha_cli --bin irohad --bin kagami --bin iroha \
    && mkdir /out \
    && strip -o /out/irohad target/debug/irohad \
    && strip -o /out/kagami target/debug/kagami \
    && strip -o /out/iroha target/debug/iroha

FROM hyperledger/iroha@sha256:8823ecbccc14eec9c685d6bc17a007340a7c296afce363d0eba6b96e60bd047c
COPY --from=build /out/ /usr/local/bin/
ENTRYPOINT ["/usr/local/bin/kagami"]
