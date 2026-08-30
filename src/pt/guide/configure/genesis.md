---
translation_locale: pt
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Gênese {#genesis}

Genesis define o estado inicial da cadeia.A fonte editável é um JSON manifesto,
e um Iroha 3 nó consome um sinal Norito arquivo de transação.

::: details Manifesto de gênese padrão

<<< @/snippets/genesis.json

:::

## Arquivos {#files}

O repositório upstream envia um manifesto padrão em `defaults/genesis.json`.
Kagami redes geradas escrevem seu próprio manifesto e transação assinada em
o diretório de saída:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

O gerado `README.md` nesse diretório registra os arquivos exatos e inicia
comandos para o perfil selecionado.

## Configuração de pares {#peer-configuration}

Os pares apontam para a transação genesis assinada no `[genesis]` seção de
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Todos os pares na rede devem concordar com a transação de gênese assinada e o
chave pública de gênese.

## Assinando Gênesis {#signing-genesis}

Se você editar um manifesto manualmente, valide-o e assine-o antes de iniciar os pares:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` deve ser um modo mantido pelo proprietário`0600`, link único
arquivo regular contendo um multihash de chave privada canônica e um final
nova linha. Kagami rejeita ligações simbólicas e nunca aceita uma génese privada crua
chave na linha de comando.

Para NPoS ou Nexus perfis, incluem a topologia e BLS Provas de Posse
exigido pelo perfil gerado. Kagami `localnet`, `wizard`, e perfil
comandos de geração tratam desses detalhes automaticamente.

## Recomprometendo Gênesis {#recommitting-genesis}

Um peer só confirma o genesis quando seu armazenamento está vazio.Para testar uma nova gênese em
uma rede local descartável, pare os pares, remova o diretório de estado gerado,
e partir da nova gênese assinada.Não substitua o genesis em uma corrida
rede, a menos que cada validador esteja coordenando a mesma migração.
