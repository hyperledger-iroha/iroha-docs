---
translation_locale: zh-hant
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

目前的對等節點配置是 TOML.將生成的 `config.toml`, `genesis.signed.nrt` 和相關關鍵檔案繫結或複製到預期的容器路徑中.將生成的檔案放在一起;從不同的 Kagami 執行中混合檔案可能會導致消產或共識失敗.
