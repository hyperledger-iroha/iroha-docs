---
translation_locale: pt
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Referência do gênesis da blockchain {#genesis-reference}

No fluxo de trabalho atual Iroha 3, um manifesto técnico `genesis.json` descreve as primeiras transações e parâmetros que serão aplicados quando a rede iniciar.

O artefato assinado distribuído aos pares da rede é um arquivo `.nrt` codificado em Norito produzido por `kagami genesis sign`.

## Campos Principais {#main-fields}

Um manifesto técnico de gênese de blockchain pode definir:

- `chain` para o identificador da cadeia
- `chain_discriminant` para o prefixo de rede I105 usado na codificação dos literais de conta no manifesto
- `executor` para um caminho de bytecode de atualização de executor opcional
- `ivm_dir` para IVM bibliotecas usadas por gatilhos e atualizações
- `consensus_mode` para o modo inicial anunciado pelo manifesto técnico
- `transactions` para atualizações de parâmetros ordenadas, instruções, gatilhos e topologia
- `sumeragi_context` para os parâmetros assinados do contexto de altura de Sumeragi
- `crypto_admission_policy` para os algoritmos exatos de assinatura e de controlador admitidos pela cadeia, listados em `allowed_algorithms`

Dentro de `transactions`, as entradas de topologia emparelham os IDs de pares de rede e PoPs juntos:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Gerar um manifesto técnico {#generate-a-manifest}

Use Kagami para gerar um modelo. Repita `--allowed-signing` para cada algoritmo admitido, em ordem canônica crescente; Kagami não preenche os algoritmos omitidos:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

Para o espaço de dados público do SORA Nexus, `npos` é o modo de consenso esperado. Outras implantações do Iroha 3 podem usar o modo permissionado ou NPoS, conforme o perfil de destino.

## Assine o manifesto técnico {#sign-the-manifest}

Após editar e validar o JSON, assine-o em um bloco `.nrt` implantável:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lê a chave pública gênese da blockchain do manifesto técnico e usa a chave privada de um arquivo regular de link único mantido pelo proprietário para produzir o bloco assinado implantável. O arquivo deve conter um multihash de chave privada canônica seguido por uma nova linha; Kagami rejeita links simbólicos e modos diferentes de `0600`. Chaves privadas em formato bruto não são aceitas na linha de comando. O resultado é o arquivo que os pares da rede devem referenciar em sua configuração.

## Configurar `iroha3d` {#configure-iroha3d}

Aponte o daemon para o bloco de gênese assinado e para o arquivo que fixa seu hash esperado. `kagami genesis sign --expected-hash-out` grava esse arquivo, e o nó o exige nas novas inicializações e nas reinicializações:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Ferramentas Relacionadas {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Para a implementação do gerador e detalhes do comando, consulte o [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
