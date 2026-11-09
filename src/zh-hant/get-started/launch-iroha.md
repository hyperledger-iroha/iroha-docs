---
translation_locale: zh-hant
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 啟動 Iroha 3 {#launch-iroha-3}

在一台 Linux 虛擬機器 (VM)上執行四個 Iroha 3 驗證節點，以測試私有環境中的系統整合。先提交一筆已簽署的交易，再停止一個驗證節點，確認其餘三個節點能否確認第二筆交易。這個環境使用獨立的許可型帳本。若要將此帳本作為受治理的資料空間接入 SORA Nexus，還須另外配置。

## 準備 VM {#prepare-the-vm}

使用 Linux x86_64，並安裝 Docker Engine、Buildx、Compose v2、Python 3.8 或更新版本，以及 `unzip`。目前的帳號必須有使用 Docker 的權限。首次建置時，虛擬機器必須能透過 HTTPS 連線至 GitHub、Docker Hub、Debian 套件鏡像站和 crates.io。

我們在配有 6 個 vCPU 和 32 GiB RAM 記憶體的 VM 上建置套件，並用少量模擬交易完成測試。請根據工作負載及資料保留期限決定儲存容量。每個 Docker Engine 執行個體只使用一份套件，並保持回送介面上的 18080–18083 連接埠可用。

[下載四節點驗證套件](/downloads/iroha-trade-poc.zip)。套件內含啟動指令碼、鎖定版本的相依套件清單，以及從同一固定版本的 Iroha 原始碼建置驗證節點和用戶端所使用的修補檔。在下載目錄中驗證壓縮檔的校驗碼，然後解壓縮。

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## 啟動並驗證四個節點 {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

首次啟動時，指令碼會建置容器映像檔，並在 VM 上產生鏈 ID、金鑰和已簽署的創世區塊。每個驗證節點都有獨立的持久化儲存卷。驗證指令碼會簽署一筆測試交易，再等待四個驗證節點各自回報已連線至三個對等節點，且新區塊的雜湊值一致。創世區塊含有範例帳號。請使用模擬資料，並僅透過回送介面開放 APIs。

從 VM 查詢第一個驗證節點的狀態時，請明確指定以 JSON 格式回應。

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## 測試單一驗證節點故障 {#test-a-validator-failure}

```sh
python3 poc.py failover
```

測試會停止一個驗證節點、提交一筆新交易，並檢查其餘三個節點所確認區塊的雜湊值。接著指令碼會重新啟動第四個節點，等待它同步到同一個區塊。 VM 若故障，四個驗證節點都會停止。若要測試任一台實體主機故障的情況，請使用四台獨立主機，每台部署一個驗證節點。

## 停止及恢復執行 {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

在解壓縮套件的同一個目錄執行這兩個指令。請一併保留 `state/` 目錄及四個 Docker 儲存卷，以便驗證節點重新啟動後能開啟同一份帳本。若啟動程序停滯，請在該目錄執行 `python3 poc.py logs`。

## 試用公開 API 端點 {#try-the-public-endpoint}

應用程式可透過 Taira 讀取 SORA Nexus 的通用資料空間，無須執行自己的帳本 VM。在裝有 `curl` 和 `jq` 的工作站上，向測試網路傳送以下唯讀請求。

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

回應會列出受查詢節點連線的對等節點數、已確認的區塊數、已核准的交易數，以及佇列中的交易數。關於部署規劃，請參閱[網路部署](/zh-hant/guide/best-practices/network-deployment.md)。
