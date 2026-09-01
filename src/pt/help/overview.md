---
translation_locale: pt
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de problemas {#troubleshooting}

Esta seção ajuda a resolver problemas durante o uso do Iroha. Se algo der errado, [verifique primeiro as chaves](#check-the-keys). Se isso não bastar, consulte as instruções de cada etapa:

- [Problemas de instalação](./installation-issues.md)
- [Problemas de configuração](./configuration-issues.md)
- [Problemas de implantação](./deployment-issues.md)
- [Problemas de integração](./integration-issues.md)

Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## Verifique as chaves {#check-the-keys}

A maioria dos problemas é causada por chaves incompatíveis. Por isso, recomendamos esta regra: **se algo der errado, verifique primeiro as chaves**.

O motivo é simples: não é possível diferenciar as mensagens de erro causadas por chaves de pares que não correspondem às do conjunto de pares confiáveis, pois isso exporia a chave pública do par. Se você usa gráficos Helm ou implantações Kubernetes com chaves definidas por variáveis de ambiente, compare os valores configurados de [`public_key`](/pt/reference/peer-config/params.md#param-public-key), [`private_key`](/pt/reference/peer-config/params.md#param-private-key) e [`trusted_peers`](/pt/reference/peer-config/params.md#param-trusted-peers) antes de investigar falhas de nível superior.

Em caso de dúvida, [gere um novo par de chaves](/pt/guide/security/generating-cryptographic-keys.md).
