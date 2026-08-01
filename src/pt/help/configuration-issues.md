---
translation_locale: pt
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolução de problemas de configuração {#troubleshooting-configuration-issues}

Esta seção oferece dicas de solução de problemas para a configuração Iroha 3. Certifique-se de que você [ verificou as chaves ](./overview.md#check-the-keys) primeiro, pois é a fonte mais comum de problemas em Iroha.

Se o problema que está a experimentar não for descrito aqui, entre em contato conosco através do [Telegrafo ](https://t.me/hyperledgeriroha).

## Gênese obsoleta em uma configuração Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Quando você está usando a versão Docker Compose de Iroha, pode encontrar o problema de um dos contêineres peer falhar com o erro `Failed to deserialize raw genesis block`. Isso geralmente significa que o peer, a transação genesis assinada e a configuração gerada foram produzidas por diferentes revisões ou perfis Iroha.

Verifique a falha com estes passos:

1. Use `docker ps` para verificar os recipientes atuais. Dependendo do perfil gerado, você geralmente verá os recipientes `hyperledger/iroha:dev`. O perfil padrão Docker Compose contém quatro recipientes de pares, embora o seu generado `docker-compose.yml` possa diferir.

2. Verifique os registos e procure o erro `Failed to deserialize raw genesis block`. Se você iniciou seu Iroha no modo daemon com `docker compose up -d`, use o comando `docker compose logs`.

A maneira de solucionar esse problema depende do uso de Iroha. Se se trata de uma demonstração básica e você não precisa preservar dados de pares, regenerar um localnet correspondente ou Docker Compose pacote com Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Em seguida, remover o antigo estado do recipiente e reiniciar os arquivos regenerados `genesis.signed.nrt`, peer `config.toml` e `client.toml`.

Se for necessário restaurar os dados da instância Iroha, faça o seguinte:

1. Conecte o segundo Iroha peer que copiará os dados do primeiro (falhado) peer.
2. Espere até que o novo peer sincronize os dados com o primeiro.
3. Deixe o novo colega ativo.
4. Atualizar os arquivos de gênese e configuração do primeiro peer apenas como parte de uma migração coordenada.

::: info

Não existe um caminho de reescritura automática geral para substituir a gênese em uma rede ao vivo. Trate-o como uma migração coordenada: preservar o antigo estado, criar pares compatíveis e apenas mover os validadores para a nova configuração depois que os operadores concordarem no plano de migração.

:::

## Formatos multihash de chaves públicas e privadas {#multihash-format-of-private-and-public-keys}

Se você olhar para a configuração do cliente [ ](/pt/guide/configure/client-configuration.md), verá que as chaves ali são dadas em formato multi-hash [ ](https://github.com/multiformats/multihash).

Se você nunca trabalhou com multi-hash antes, é natural supor que o lado direito não é uma representação hexadecimal dos bytes de chave (dois símbolos por byte), mas sim os bytes codificados como ASCII (ou UTF-8), e chamar `from_hex` no literal de cadeia, tanto na instância `public_key` como na `private_key`.

Também é natural supor que chamar `PrivateKey::try_from_str` no literal de cadeia produziria apenas a chave correta. Então, se você tiver o número de bits na chave errado, por exemplo, 32 bytes vs 64, isso geraria uma mensagem de erro.

Ambas as suposições são erradas. Infelizmente, as mensagens de erro não ajudam a resolver este tipo particular de falha.

Como corrigir: usar `hex_literal`. Isto também transformará uma feio cadeia de caracteres em uma pequena tabela agradável de números obviamente hexadecimais.

::: warning

Mesmo a implementação `try_from_str` não pode verificar se uma determinada cadeia é um `PrivateKey` válido e avisar você se não for.

Ele captará alguns erros óbvios, por exemplo, se a cadeia contém um símbolo inválido. No entanto, como pretendemos suportar muitos formatos de chave, não pode fazer muito mais. Não pode dizer se a chave é a chave privada correta para a conta dada também, a menos que você envie uma instrução.

:::

Esses tipos de erros sutis podem ser evitados, por exemplo, deserializando diretamente a partir de letras de corda, ou gerando um novo par de chaves em lugares onde faz sentido.
