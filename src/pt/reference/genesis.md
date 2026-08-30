---
translation_locale: pt
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Referência de Gênesis {#genesis-reference}

No atual Iroha 3 fluxo de trabalho, um `genesis.json` manifesto descreve o primeiro
transações e parâmetros que serão aplicados quando a rede for iniciada.

O artefato assinado distribuído aos pares é um Norito-codificado `.nrt` arquivo
produzido por `kagami genesis sign`.

## Campos Principais {#main-fields}

Um manifesto de gênese pode definir:

- `chain` para o identificador da cadeia
- `executor` para um caminho de bytecode de atualização do executor opcional
- `ivm_dir` para IVM bibliotecas usadas por gatilhos e atualizações
- `consensus_mode` para o modo inicial anunciado pelo manifesto
- `transactions` para atualizações ordenadas de parâmetros, instruções, gatilhos e topologia
- `crypto` para o instantâneo criptográfico inicial

Dentro de `transactions`, entradas de topologia emparelham IDs de pares e PoPs junto:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Gerar um manifesto {#generate-a-manifest}

Usar Kagami para gerar um modelo:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Para o público SORA Nexus espaço de dados, `npos` é o modo de consenso esperado.
Outro Iroha 3 as implantações podem usar permissão ou NPoS dependendo do destino
perfil.

## Assine o Manifesto {#sign-the-manifest}

Depois de editar e validar o JSON, assine-o em um implantável `.nrt` bloquear:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lê a chave pública do genesis do manifesto e usa
a chave privada de um arquivo regular de link único mantido pelo proprietário para produzir o
bloco assinado implantável.O arquivo deve conter uma chave privada canônica
multihash seguido por uma nova linha; Kagami rejeita links simbólicos e modos outros
que `0600`. Chaves privadas brutas não são aceitas na linha de comando.O resultado
é o arquivo que os pares devem referenciar em sua configuração.

## Configurar `iroha3d` {#configure-iroha3d}

Aponte o daemon para o bloco genesis assinado:

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

Para a implementação do gerador e detalhes do comando, consulte o
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
