---
translation_locale: zh-hans
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 启动 Iroha 3 {#launch-iroha-3}

在一台 Linux 虚拟机 (VM)上运行四个 Iroha 3 验证节点，测试私有环境中的系统集成。先提交一笔已签名的交易，再停止一个验证节点，检查其余三个节点能否确认第二笔交易。这个环境使用独立的许可型账本。若要将该账本作为受治理的数据空间接入 SORA Nexus，还需单独配置。

## 准备 VM {#prepare-the-vm}

使用 Linux x86_64，安装 Docker Engine、Buildx、Compose v2、Python 3.8 或更高版本，以及 `unzip`。当前账户需要有使用 Docker 的权限。首次构建时，虚拟机需要通过 HTTPS 访问 GitHub、Docker Hub、Debian 软件包镜像站和 crates.io。

我们在配备 6 个 vCPU 和 32 GiB RAM 内存的 VM 上构建了套件，并用少量模拟交易进行了测试。请根据工作负载和数据保留期限确定存储容量。每个 Docker Engine 实例只使用一份套件，并确保回环接口上的 18080–18083 端口可用。

[下载四节点验证套件](/downloads/iroha-trade-poc.zip)。套件包含启动脚本、锁定版本的依赖项清单，以及从同一固定版本的 Iroha 源代码构建验证节点和客户端所用的补丁。在下载目录中校验压缩包，然后解压。

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## 启动并验证四个节点 {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

首次启动时，脚本会构建容器镜像，并在 VM 上生成链 ID、密钥和已签名的创世区块。每个验证节点都有独立的持久化存储卷。验证脚本会对测试交易签名，并等待四个验证节点各自报告已连接三个对等节点，且新区块的哈希值一致。创世区块含有示例账户。请使用模拟数据，并仅通过回环接口开放 APIs。

在 VM 内查询第一个验证节点的状态时，请明确指定返回 JSON 格式。

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## 测试单个验证节点故障 {#test-a-validator-failure}

```sh
python3 poc.py failover
```

测试会停止一个验证节点，提交一笔新交易，并检查其余三个节点所确认区块的哈希值。随后，脚本重启第四个验证节点，等待它同步到同一个区块。如果 VM 发生故障，四个验证节点都会停止。要测试任意一台物理主机发生故障的情况，请使用四台独立主机，每台部署一个验证节点。

## 停止和恢复运行 {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

在解压套件的同一目录下运行这两条命令。请一并保留 `state/` 目录和四个 Docker 存储卷，以便验证节点重启后能够打开同一账本。如果启动过程停滞，请在该目录下运行 `python3 poc.py logs`。

## 试用公共 API 端点 {#try-the-public-endpoint}

应用程序可以通过 Taira 读取 SORA Nexus 的通用数据空间，无需运行自己的账本 VM。在装有 `curl` 和 `jq` 的工作站上，向测试网发送以下只读请求。

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

响应会给出被查询节点连接的对等节点数、已确认的区块数、已批准的交易数和排队中的交易数。有关部署规划，请参阅[网络部署](/zh-hans/guide/best-practices/network-deployment.md)。
