---
translation_locale: pt
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Referência de Gênesis {#genesis-reference}

No fluxo de trabalho Iroha 3 atual, um manifesto `genesis.json` descreve as primeiras transações e os parâmetros que serão aplicados quando a rede for iniciada.

O artefato assinado distribuído entre pares é um arquivo `.nrt` codificado em Norito produzido por `kagami genesis sign`.

## Principais campos {#main-fields}

Um manifesto de gênese pode definir:

- `chain` para o identificador da cadeia
- `executor` para um percurso de código por byte de atualização opcional do executor
- `ivm_dir` para as bibliotecas IVM utilizadas por gatilhos e atualizações.
- `consensus_mode` para o modo inicial anunciado no manifesto
- `transactions` para atualizações de parâmetros, instruções, gatilhos e topologia ordenadas
- `crypto` para o instantâneo inicial de criptografia

Dentro de `transactions`, as entradas de topologia associam identidades de pares e PoPs:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Crie um Manifesto {#generate-a-manifest}

Utilize Kagami para gerar um modelo:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Para o espaço de dados público SORA Nexus, `npos` é o modo de consenso esperado. Outras implantações Iroha 3 podem usar permisos ou NPoS dependendo do perfil-alvo.

## Assine o Manifesto {#sign-the-manifest}

Após a edição e validação do JSON, assine-o num bloco implementável de `.nrt`:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

O `kagami genesis sign` lê a chave pública genesis do manifesto e usa a chave privada fornecida, semente e algoritmo para produzir o bloco assinado implementável.

## Configuração `irohad` {#configure-irohad}

Apontem o demônio para o bloco de Gênesis assinado:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Ferramentas relacionadas {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Para obter os detalhes da implementação do gerador e dos comandos, consulte o [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
