---
translation_locale: pt
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de Problemas de Configuração {#troubleshooting-configuration-issues}

Esta seção oferece dicas para resolver problemas de configuração do Iroha 3. Primeiro, [verifique as chaves](./overview.md#check-the-keys), pois elas são a causa mais comum de problemas no Iroha.

Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## Gênese desatualizada em uma configuração do Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Ao usar o Iroha com Docker Compose, um dos contêineres dos pares pode falhar com o erro `Failed to deserialize raw genesis block`. Isso geralmente significa que o par, a transação de gênese assinada e a configuração gerada vieram de revisões ou perfis diferentes do Iroha.

No diretório do kit, execute `python3 poc.py logs` para consultar os logs dos validadores. Siga o guia [Iniciar Iroha 3](/pt/get-started/launch-iroha.md) para compilar e executar quatro validadores no Docker com binários da mesma revisão.

Use `python3 poc.py down` e `python3 poc.py up` para reiniciar a mesma rede. Mantenha `state/` junto aos quatro volumes do Docker.

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
