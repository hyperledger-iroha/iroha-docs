---
translation_locale: zh-hans
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 连接到 Taira {#connect-to-taira}

## 结果 {#outcome}

确认 Taira 是可访问的,从本地客户端配置中提取正规 I105 帐户 ID,用测试网 XOR 资助签署者,并提交一笔费率上报价的加拿大货币交易.该配方永远不会向 Minamoto 发送信件.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或后期,以及当前的 `iroha`和 `kagami`二进制.
- 使用 Taira 链,终端点,账户配置文件和专门的测试网键创建`taira.client.toml`. 按照 [创建一个 Taira 客户端配置](/zh-hans/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)并保持文件不受源控制.
- 准备运行的 `taira_faucet_claim.py` 来自 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), 保存在客户端配置旁边.

## 步骤 {#steps}

### 1. 活力与准备的分离 {#_1-separate-liveness-from-readiness}

`/livez` 是一个简体文本过程寿命探测器. `/status`, `/health`和 `/readyz`返回 JSON.当需要的子系统被封锁时,运行节点可以合法地从准备探测器中返回 `503`.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

只需使用 `/livez`来决定该过程是否响应. 使用 `/readyz`进行交通入口,并检查其 JSON 阻塞器细节,然后将 `503`视为停机.

### 2. 开展公共诊断 {#_2-run-the-public-diagnostics}

此检查仅可阅读,不加载签字器配置:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

当医生报告一个硬 DNS, TLS,链或终点失败时,不要继续写信.一个和的公众队列是过渡性的;等待再尝试一个有限的政策.

### 3. 在不打印密码的情况下取出 Taira 账户 ID {#_3-derive-the-taira-account-id-without-printing-a-secret}

仅从配置中阅读公钥,然后用 Taira I105 配置文件编码它. `[account].domain`值提供路由文本;它不是账户 ID 的一部分.

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

输出是一个无域名的正规地址 I105.像 `wallet@payments.universal`这样的名称是称,必须在严格账户领域使用之前解决.

### 4. 索赔当前费用资产 Taira {#_4-claim-the-current-taira-fee-asset}

收费资产定义的真相来源是龙头响应.保留返回 Base58 ID 而不是从另一个网络或旧运行中复制 ID.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

最多一个分钟的余额查询. 在融资交易可见之前,龙头可以返回 `202 Accepted`.

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

`gas_asset_id`是交易元数据.明确的 `--fee-payer authority`选项是签名约束的,并且在签署之前,CLI 获得了准确的费用报价.

## 验证 {#verify}

提交日志说明,保存 JSON 收据,并等待应用终结. 排放 `--no-wait` 也使初始提交等待确认;明确的状态读取证明了最终管道状态.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最后命令只有交易达到默认状态之后才能成功 `Applied` 在测试证据中保存哈希,永远不要存储私钥或完整的客户端配置.

## 解决问题 {#troubleshooting}

- `/livez`在要求 JSON 时返回`406`,因为该终端点是 `text/plain`.如上所示,发送 `Accept: text/plain`.
- `/health`或`/readyz`可以用机器可读的阻塞器返回 `503`,即使在 `/livez`和 `/status`工作期间. 固定或等待该阻塞器;再生键不会改变节点准备性.
- 一个水龙头 `502`,时间休息,或过时的证明工作是公共服务失败.
- 一个 I105 前置错误意味着公钥被错误的配置文件编码. 再运行 `iroha tools address convert --profile taira`.
- 收费率的拒绝通常意味着该机构没有获得资金,收费资产元数据已经过时,或者没有明确的收费者被选中.
- 在这个鱼成功后,还可以拒绝注册,造或命名空间管理. 这些操作需要单独的运行时间许可; 练习它们.如果没有授予 Taira 访问,则生成的本地网络.

## 来源及相关文件 {#source-and-related-docs}

- [Taira CLI 诊断和鱼源在固定提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [显而易见的费用选择和提交源 CLI 在固定承诺](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira 账户和水龙头指南](/zh-hans/get-started/sora-nexus-dataspaces.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [交易](/zh-hans/blockchain/transactions.md)
