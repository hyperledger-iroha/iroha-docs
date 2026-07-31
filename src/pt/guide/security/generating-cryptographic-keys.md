---
translation_locale: pt
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Geração de chaves criptográficas {#generating-cryptographic-keys}

Utilize `kagami keys` para gerar o material de chave do cliente, do peer e do validador para Iroha 3.

## Utilização básica {#basic-usage}

A partir do pagamento da fonte Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

A saída JSON é geralmente mais fácil de copiar para a TOML ou automatizar:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

O comando imprime uma chave pública e uma chave privada. Tratar a chave privada como material secreto; não comprometer as chaves de produção geradas.

## Algoritmos {#algorithms}

Algoritmos comuns são:

- `ed25519` para contas de clientes, identidades de streaming e a maioria das redes de desenvolvimento.
- `secp256k1` quando precisares de uma identidade de conta secp256k1.
- `bls_normal` para chaves de consenso do validador quando a construção possibilitar o suporte BLS.

Verifique os algoritmos exatos suportados pela sua construção com:

```bash
cargo run --bin kagami -- keys --help
```

## Chaves de Desenvolvimento Determinista {#deterministic-development-keys}

Para os aparelhos reprodutíveis, passar uma semente:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

As sementes são materiais de chave privada, usá-las apenas para desenvolvimento e testes locais.

## BLS Proveituras de posse {#bls-proofs-of-possession}

Os perfis de validador NPoS e Nexus exigem que as chaves de validador BLS e PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

O JSON inclui o `pop_hex` quando o `--pop` é utilizado. Use esse valor com a topologia gerada ou as entradas `trusted_peers_pop` exigidas pelo perfil.

## Formatos de saída {#output-formats}

Usar a saída padrão para a inspeção do terminal, `--json` para automação e `--compact` quando outro script precisar de valores orientados em linha simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Para a ajuda Kagami gerada na totalidade:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
