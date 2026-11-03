---
translation_locale: zh-hans
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 连接到 Taira {#connect-to-taira}

## 结果 {#outcome}

确认 Taira 可访问，从本地客户端配置中提取规范 I105 账户 ID，用测试网 XOR 为签名者注资，并提交一笔带费用报价的 canary 交易。此操作指南绝不会向 Minamoto 发送写入。

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或后期,以及当前的 `iroha`和 `kagami`二进制.
- 一个以 Taira 链、确切的 `network_id`、端点、账户配置文件和专用测试网密钥创建的 `taira.client.toml`。请按照 [创建一个 Taira 客户端配置](/zh-hans/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) 操作，并将该文件排除在源代码版本控制之外。
- 一个用于水龙头日志的可写工作目录：`iroha taira account faucet prepare` 会以私有权限创建 `./taira-faucet`，并拒绝替换已存在的目录。

## 步骤 {#steps}

### 1. 活力与准备的分离 {#_1-separate-liveness-from-readiness}

`/livez`、`/health` 和 `/readyz` 是纯文本探测端点；`/status` 返回 JSON。当共识准入或其他必要的子系统不可用时，正在运行的节点可以合法地从 `/readyz` 返回 `503`。

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

仅使用 `/livez` 判断进程是否有响应。使用 `/readyz` 进行流量准入。它的 `503` 是一个不含阻塞原因详细信息的 `service_unavailable` 错误封装，因此在将其视为服务中断之前，请先运行下面的诊断。

### 2. 开展公共诊断 {#_2-run-the-public-diagnostics}

此检查仅可阅读,不加载签字器配置:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

当医生报告一个硬 DNS, TLS,链或端点失败时,不要继续执行写入操作.一个和的公众队列是过渡性的;等待再尝试一个有限的政策.

### 3. 在不打印密码的情况下取出 Taira 账户 ID {#_3-derive-the-taira-account-id-without-printing-a-secret}

仅从配置中读取公钥，然后以 Taira I105 配置文件对其编码。账户 ID 不包含域名；`[account].profile` 只选择其网络前缀。

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

输出是一个无域名的规范地址 I105.像 `wallet@payments.universal`这样的名称是称,必须在严格账户领域使用之前解决.

### 4. 索赔当前费用资产 Taira {#_4-claim-the-current-taira-fee-asset}

水龙头政策会指明当前的费用资产定义。请保留其 Base58 ID，而不是从其他网络或旧的运行中复制 ID。该政策是未签名的发现数据，因此自动化流程应固定其预期的发行者、资产定义和金额，而不是信任每次的响应。

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` 会求解工作量证明并保存确切的已签名交易；`submit` 只发送一次，并在交易应用后返回。如果 `submit` 报告 `Pending` 或超时，请使用相同的配置和日志运行 `taira account faucet resume`，而不是准备另一个申领。之后最多轮询余额一分钟。

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

每次 Taira 写入都使用 `--fee-payer authority`。此选择与签名绑定，CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。

## 验证 {#verify}

提交日志说明,保存 JSON 收据,并等待应用终结. 排放 `--no-wait` 也使初始提交等待确认;明确的状态读取证明了最终管道状态.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最后一个命令只有在确切的全局状态报告经状态解析的 `Applied` 最终性之后才会成功。请将哈希保存在测试证据中；切勿将私钥或完整的客户端配置与其一起存储。

## 解决问题 {#troubleshooting}

- 只请求 JSON 时，`/livez`、`/health` 和 `/readyz` 会返回 `406`，因为它们以 `text/plain` 响应。请发送上面所示的 `Accept` 标头。
- 即使 `/livez` 和 `/status` 正常工作，`/readyz` 仍可能返回带有 `service_unavailable` 错误封装的 `503`。请等待节点就绪或运行 `iroha taira doctor`；重新生成密钥不会改变节点的就绪状态。
- `submit` 期间出现水龙头 `502` 或超时，会使申领结果未知：请使用相同的配置和日志运行 `taira account faucet resume`，而不是准备另一个申领。过时的工作量证明锚点会使 `prepare` 失败；请在新的日志目录中重新准备。
- 一个 I105 前置错误意味着公钥被错误的配置文件编码. 再运行 `iroha tools address convert --profile taira`.
- 费用报价被拒绝通常表示授权主体尚未注资，或配置的 `network_id` 不是 Taira 的。缺少 `--fee-payer`，或在 `--metadata` 中放入 `gas_asset_id` 之类的费用键，会在报价之前于本地失败。
- 即使此金丝雀测试成功，注册、铸造或命名空间管理操作仍可能被拒绝。这些操作需要各自的运行时权限；如果尚未获得 Taira 访问权限，请在生成的本地网络上演练。

## 来源及相关文件 {#source-and-related-docs}

- 固定提交中的 [Taira CLI 诊断和 canary 源代码](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) 与[水龙头命令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [显而易见的费用选择和提交源 CLI 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira 账户和水龙头指南](/zh-hans/get-started/sora-nexus-dataspaces.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [交易](/zh-hans/blockchain/transactions.md)
