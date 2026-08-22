---
translation_locale: zh-hans
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# 与...一起工作 Iroha 二进制文件 {#working-with-iroha-binaries}

这 Iroha 3 操作员工作流程围绕三个主要二进制文件：

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) 用于运行对等守护进程
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) 为了 CLI 和操作员命令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) 用于密钥、创世、本地网络和配置文件

## 从源代码构建 {#build-from-source}

从上游工作区根目录：

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

然后可以使用发布二进制文件 `target/release/`.

要检查命令表面：

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接从存储库运行 {#run-directly-from-the-repository}

如果您不想全局安装任何东西，请使用 `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 图像 {#docker-image}

上游工作区使用 `kagami localnet` 和 `kagami docker` 生成
Docker Compose 与签出代码匹配的文件。这 `hyperledger/iroha:dev`
图像可以与这些生成的文件一起使用。

运行 CLI 在容器中：

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

跑步 Kagami 在容器中：

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

对于对等启​​动，首先生成 localnet 和 Compose 文件：

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## 我应该使用哪个二进制文件？ {#which-binary-should-i-use}

- 使用 `irohad` 当你开始或经营同行时。
- 使用 `iroha` 当您需要查询账本、提交交易或检查操作员端点时。
- 使用 `kagami` 当您需要密钥、创世清单、配置文件包或本地网络资产时。

## 影武者发布、发布和推出 {#kagemusha-release-publication-and-rollout}

影武者 V4 发布和激活跨越单独的受保护边界：

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` 是
  仅限 macOS、仅限 root 的发布者。它验证固定的 Kagami 二进制和
  确切的十六档候选人，公布缺席
  `promotion-record-v4.norito` 无需更换，仅报告成功
  在确切的十七个文件升级版本验证之后。
- `iroha offline kagemusha rollout-v4 create-expectations` 验证签名的
  预订，四个订购的验证者资格印章，准确
  已经授权的交易电汇，以及之前可信的最终锚定
  出版签署期望无需更换。
- `iroha offline kagemusha rollout-v4 submit` 需要明确的
  `--write-authorized` 同意。它持久地记录并重新验证确切的
  网络写入或重试之前的期望。一个 `Applied` 状态不是
  足够了：该命令还验证已提交的块、最终性后继者
  链，以及完整的授权交易线路。
- `iroha offline kagemusha rollout-v4 finalize-receipt` 仅在精确的提交日志
  重新验证后，收集相同的证明锚定证据，由独立收据签发者签署，并在不替换
  现有文件的情况下发布规范收据。

签入的 Kagemusha 生产准备工作流程仅用于验证。
它不会调用经过认证的发布者，发布验证者资格
密封、提交激活或创建最终收据。成功的工作流程
因此，run 既不能证明促销，也不能证明实时部署。

这些命令是本地原语，不能替代现场证据。一个
如果没有真正的物理应用程序证明，生产部署仍然受阻
候选工件、所有四个受保护的主机密封、运行时治理和
签名输入、实时四验证者提交和最终性证据，以及
规范有效构型投影。保留私钥，
受保护的身份验证材料和促销特定标识符
运行时托管；不要将它们复制到源代码控制文档中或
操作员票。
