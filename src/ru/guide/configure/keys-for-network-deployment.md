---
translation_locale: ru
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Ключи к развертыванию сети {#keys-for-network-deployment}

Каждая сеть нуждается в отдельном ключевом материале для клиентов, сверстников, подписания генезиса и, для профилей NPoS или Nexus, идентификаторов подтвердителя BLS.

## Где используются ключи {#where-keys-are-used}

- Ключи для подписания клиента хранятся в `client.toml` под `[account]`.
- Ключи для идентификации сверстников хранятся в каждом сверстнике `config.toml` как `public_key` и `private_key`.
- Peer discovery использует общественный ключ каждого из них в `trusted_peers`.
- Validator BLS Доказательства владения хранятся в `trusted_peers_pop` для профилей NPoS.
- При подписании манифеста используется `[genesis].public_key` в конфигурации сверстника и соответствующий частный ключ.

Для локальных или тестовых развертываний, позвольте Kagami создать все эти файлы вместе:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Для существующей сети или профиля используйте управляемый поток:

```bash
cargo run --bin kagami -- wizard
```

## Создать отдельные пары ключей {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Совместимость с другими людьми {#peer-consistency}

Все валидаторы должны согласиться на одну и ту же генезисную транзакцию, топологию, надежные общедоступные ключи и валидатор PoPs. Один отсутствующий или несовместимый ключ может помешать сети запускать или достичь консенсуса.

Для минимального развертывания византийской терпимости к ошибкам, используйте не менее четырех сверстников. Каждый сверстник должен иметь свой собственный частный ключ, но каждая конфигурация сверстников нуждается в одном и том же надежном наборе сверстника.

## Счета клиентов {#client-accounts}

учетная запись клиента в `client.toml` должна уже существовать на цепочке. Она может быть зарегистрирована через манифест генезиса или последующей транзакцией. Избегайте использования идентификации подписи генезиса в качестве долгосрочной учетной записи приложения; Преимущества генезиса применяются только во время раунда генезиса, и производственные клиенты должны использовать свои собственные счета и роли.
