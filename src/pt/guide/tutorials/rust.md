---
translation_locale: pt
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

A implementação Rust reside no espaço de trabalho principal e continua sendo a forma mais direta de trabalhar com a base de código Iroha 3.

## O Que Você Recebe {#what-you-get}

O repositório upstream atualmente expõe:

- o pacote de software cliente `iroha` Rust
- o `iroha` CLI como o cliente de referência mais completo
- modelo de dados compartilhado, cripto e pacotes de software Norito usados pela camada SDK

## Ponto de Partida Recomendado {#recommended-starting-point}

Para o estado atual do projeto, comece com a referência CLI e o próprio espaço de trabalho:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Execute o cliente de referência com a configuração de cliente padrão registrada:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Tentar Taira Somente Leitura {#try-taira-read-only}

A partir do mesmo checkout do workspace, tente o assistente de diagnósticos público Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Para verificações em nível de rota, use diretamente Torii JSON API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Depois que você criar `taira.client.toml`, o mesmo binário pode executar comandos canário assinados contra Taira. Mantenha-os separados dos testes unitários comuns, pois eles exigem uma conta financiada na testnet e disponibilidade da testnet ao vivo.

## Usando o pacote de software do Cliente Rust {#using-the-rust-client-crate}

Fixe a revisão Git Iroha usada pela sua rede:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Se você precisar dos exemplos mais completos de como as superfícies Rust são usadas na prática, inspecione:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Para fluxos de trabalho de escrow gerenciados em razão, veja [Custódia de Ativo Nativo](/pt/blockchain/escrow.md#rust-sdk). O modelo de dados Rust atualmente possui a cobertura tipada mais completa para escrow em marketplaces, bloqueios genéricos de ativos, escrow anônimo, consultas e eventos.

Você pode regenerar uma captura local da ajuda da CLI com:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notas {#notes}

- O CLI atualmente fornece melhor cobertura do que os documentos do pacote de software independente.
- Para fluxos no estilo operador, a documentação CLI é a fonte mais atual.
