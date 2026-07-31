---
translation_locale: pt
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolução de problemas {#troubleshooting}

Esta secção destina-se a ajudar se tiver problemas ao trabalhar com Iroha. Se algo correr mal, por favor. [Verifique as chaves .](#check-the-keys) Se isso não ajudar, verifique as instruções de solução de problemas para cada fase:

- [Problemas de instalação](./installation-issues.md)
- [Questões de configuração](./configuration-issues.md)
- [Problemas de implantação ](./deployment-issues.md)
- [Questões de integração](./integration-issues.md)

Se o problema que está a experimentar não for descrito aqui, entre em contato conosco através do [Telegrafo ](https://t.me/hyperledgeriroha).

## Verifica as chaves . {#check-the-keys}

A maioria dos problemas surgem como resultado de chaves incomparáveis. É por isso que recomendamos seguir esta regra: se algo der errado, verifique primeiro as chaves.

Aqui está uma rápida explicação: Não é possível diferenciar as mensagens de erro que surgem quando as chaves dos pares não coincidem com as chaves na matriz de colegas confiáveis porque exporia a chave pública dos colegas. Como tal, se você tiver gráficos Helm ou implantações Kubernetes com chaves definidas através de variáveis ambientais, compare os valores configurados [`public_key`](/pt/reference/peer-config/params.md#param-public-key), [`private_key`](/pt/reference/peer-config/params.md#param-private-key), e [`trusted_peers`](/pt/reference/peer-config/params.md#param-trusted-peers) antes de investigar falhas de nível superior.

Em caso de dúvida, [ gera um novo par de chaves ](/pt/guide/security/generating-cryptographic-keys.md).
