---
translation_locale: pt
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

A implementação Rust ocorre no principal espaço de trabalho e continua a ser a forma mais direta de trabalhar com o código base Iroha 3.

## O que você obtém {#what-you-get}

O repositório upstream expõe atualmente:

- a caixa do cliente `iroha` Rust
- o `iroha` CLI como cliente de referência mais completo;
- Modelo de dados compartilhado, criptografia e caixas Norito utilizadas pela camada SDK

## ponto de partida recomendado {#recommended-starting-point}

Para o estado atual do projeto, inicie com a referência CLI e o próprio espaço de trabalho:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Execute o cliente de referência com a configuração do cliente padrão verificada:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Tente Taira Apenas leitura {#try-taira-read-only}

A partir da mesma caixa do espaço de trabalho, tente o assistente de diagnóstico público Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Para os controlos a nível da rota, utilize diretamente o JSON API do Torii:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Depois de criar `taira.client.toml`, o mesmo binário pode executar comandos canários assinados contra Taira. Mantenha esses separados dos testes unitários comuns porque eles exigem uma conta financiada pela torneira e disponibilidade da rede de teste ao vivo.

## Utilização da caixa do cliente Rust {#using-the-rust-client-crate}

Aplique a revisão Iroha Git usada pela sua rede:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Se precisar dos exemplos mais completos de como as superfícies Rust são utilizadas na prática, verifique:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Para os fluxos de trabalho em depósito administrados por contabilidade, ver: [Escrow de ativos nativos](/pt/blockchain/escrow.md#rust-sdk). A Comissão Rust O modelo de dados dispõe atualmente da cobertura tipográfica mais completa para a garantia no mercado, os bloqueios genéricos dos activos, a garantia anônima, as consultas, e eventos.

Você pode regenerar um local CLI instantâneo de ajuda com:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notas {#notes}

- O CLI oferece atualmente uma melhor cobertura do que os documentos de caixa autónomos.
- Para os fluxos em estilo de operador, a documentação CLI é a fonte mais atual.
