---
translation_locale: pt
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de Problemas de Configuração {#troubleshooting-configuration-issues}

Esta seção oferece dicas para resolver problemas de configuração do Iroha 3. Primeiro, [verifique as chaves](./overview.md#check-the-keys), pois elas são a causa mais comum de problemas no Iroha.

Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## Gênese desatualizada em uma configuração do Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Ao usar o Iroha com Docker Compose, um dos contêineres dos pares pode falhar com o erro `Failed to deserialize raw genesis block`. Isso geralmente significa que o par, a transação de gênese assinada e a configuração gerada vieram de revisões ou perfis diferentes do Iroha.

Verifique a falha com estes passos:

1. Use `docker ps` para verificar os contêineres atuais. Conforme o perfil gerado, você normalmente verá contêineres `hyperledger/iroha:dev`. O perfil padrão do Docker Compose contém quatro contêineres de pares, embora o `docker-compose.yml` gerado possa ser diferente.

2. Verifique os logs e procure pelo erro `Failed to deserialize raw genesis block`. Se você iniciou seu Iroha no modo daemon com `docker compose up -d`, use o comando `docker compose logs`.

A maneira de solucionar esse problema depende do uso de Iroha. Se isso for uma demonstração básica e você não precisar preservar os dados de pares da rede, regenere um localnet correspondente ou um pacote Docker Compose com Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Depois, remova o estado antigo dos contêineres e reinicie usando os arquivos regenerados `genesis.signed.nrt`, os arquivos `config.toml` dos pares e `client.toml`.

Se você precisar restaurar os dados da instância Iroha, faça o seguinte:

1. Conecte um segundo par do Iroha para copiar os dados do primeiro par, o que falhou.
2. Aguarde até que o novo par sincronize os dados com o primeiro.
3. Mantenha o novo par ativo.
4. Atualize os arquivos de gênese e configuração do primeiro par somente como parte de uma migração coordenada.

::: info

Não há um mecanismo automático geral para substituir a gênese de uma rede ativa. Trate a mudança como uma migração coordenada: preserve o estado anterior, inicie pares compatíveis e passe os validadores à nova configuração somente após os operadores concordarem com o plano.

:::

## Formato Multihash de Chaves Privadas e Públicas {#multihash-format-of-private-and-public-keys}

Na [configuração do cliente](/pt/guide/configure/client-configuration.md), as chaves são fornecidas em [formato multihash](https://github.com/multiformats/multihash).

Se você nunca trabalhou com multi-hash antes, é natural supor que o lado direito não seja uma representação hexadecimal dos bytes da chave (dois símbolos por byte), mas sim os bytes codificados como ASCII (ou UTF-8), e chamar `from_hex` no literal de string tanto na instanciação `public_key` quanto na `private_key`.

Também é natural supor que chamar `PrivateKey::try_from_str` na literal de string resultaria apenas na chave correta. Portanto, se você errar o número de bits na chave, por exemplo, 32 bytes em vez de 64, isso geraria uma mensagem de erro.

Ambas essas suposições estão erradas. Infelizmente, as mensagens de erro não ajudam a depurar esse tipo particular de falha.

Como consertar: use `hex_literal`. Isso também transformará uma string feia de caracteres em uma pequena tabela de números obviamente hexadecimais.

::: warning

Mesmo a implementação `try_from_str` não pode verificar se uma determinada string é um `PrivateKey` válido e avisá-lo caso não seja.

Ele vai pegar alguns erros óbvios, por exemplo, se a string contiver um símbolo inválido. No entanto, como visamos suportar muitos formatos de chave, não pode fazer muito mais. Também não pode dizer se a chave é a chave privada correta para a conta fornecida, a menos que você envie uma instrução.

:::

Esse tipo de erro sutil pode ser evitado, por exemplo, desserializando diretamente de literais de string, ou gerando um par de chaves novo em lugares onde faz sentido.
