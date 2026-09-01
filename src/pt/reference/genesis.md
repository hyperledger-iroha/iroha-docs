---
translation_locale: pt
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Referência do gênesis da blockchain {#genesis-reference}

No fluxo de trabalho atual Iroha 3, um manifesto técnico `genesis.json` descreve as primeiras transações e parâmetros que serão aplicados quando a rede iniciar.

O artefato assinado distribuído aos pares da rede é um arquivo `.nrt` codificado em Norito produzido por `kagami genesis sign`.

## Campos Principais {#main-fields}

Um manifesto técnico de gênese de blockchain pode definir:

- `chain` para o identificador da cadeia
- `executor` para um caminho de bytecode de atualização de executor opcional
- `ivm_dir` para IVM bibliotecas usadas por gatilhos e atualizações
- `consensus_mode` para o modo inicial anunciado pelo manifesto técnico
- `transactions` para atualizações de parâmetros ordenadas, instruções, gatilhos e topologia
- `crypto` para a visualização inicial dos dados de criptomoeda em um ponto no tempo

Dentro de `transactions`, as entradas de topologia emparelham os IDs de pares de rede e PoPs juntos:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Gerar um manifesto técnico {#generate-a-manifest}

Use Kagami para gerar um modelo:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Para o espaço de dados público SORA Nexus, `npos` é o modo de consenso esperado. Outras implantações Iroha 3 podem usar permissionado ou NPoS dependendo do perfil alvo.

## Assine o manifesto técnico {#sign-the-manifest}

Após editar e validar o JSON, assine-o em um bloco `.nrt` implantável:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lê a chave pública gênese da blockchain do manifesto técnico e usa a chave privada de um arquivo regular de link único mantido pelo proprietário para produzir o bloco assinado implantável. O arquivo deve conter um multihash de chave privada canônica seguido por uma nova linha; Kagami rejeita links simbólicos e modos diferentes de `0600`. Chaves privadas em formato bruto não são aceitas na linha de comando. O resultado é o arquivo que os pares da rede devem referenciar em sua configuração.

## Configurar `iroha3d` {#configure-iroha3d}

Aponte o daemon para o bloco gênese assinado da blockchain:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Ferramentas Relacionadas {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Para a implementação do gerador e detalhes do comando, consulte o [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
