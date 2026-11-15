---
translation_locale: zh-hant
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 熱的過載 Iroha 在一個 Docker 集裝箱 {#hot-reload-iroha-in-a-docker-container}

熱重載僅適用於本機除錯。 請參閱 [啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md)，使用同一版本的執行檔，在 Docker 中建置並啟動四個驗證節點。

## 取代對等節點二進位制 {#replace-the-peer-binary}

從上游工作空間構建一個與Linux相容的 daemon二進位制:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

複製到執行的對等節點容器中,然後重新啟動該容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

使用 `docker ps` 找出容器，並在替換常駐程式前確認它在映像檔中的路徑。

## 在一次性網路中重複創世紀 {#recommit-genesis-in-a-disposable-network}

使用新的創世區塊時，節點的儲存空間必須是空的。 依序執行 `python3 poc.py down` 和 `python3 poc.py up` 以重新啟動同一個網路。請將 `state/` 與其四個 Docker 儲存卷一併保留。

## 使用定製配置 {#use-custom-configuration}

目前的對等節點設定採用 TOML 格式。Kagami 會為每個驗證者寫入一個 `peerN.toml`，並附帶 `genesis.signed.nrt`、`genesis.public_key` 與 `genesis.expected_hash`；由 `kagami docker` 產生的 Compose 檔案會將它們掛載到容器中。請重新產生，而不要手動複製檔案，然後重新啟動對等節點。請將產生的檔案放在一起；混用不同 Kagami 執行所產生的檔案，可能導致還原序列化或共識失敗。
