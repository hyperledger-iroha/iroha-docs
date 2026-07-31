---
translation_locale: pt
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Expressões, Condições, Lógica {#expressions-conditionals-logic}

Todos eles . [Iroha Instruções especiais](./instructions.md) Cada expressão tem um `EvaluatesTo`, Enquanto você pode especificar o nome da conta diretamente, você também poderia especificar a conta ID Você pode verificar se uma conta está registrada no blockchain também.

Usando expressões que implementam `EvaluatesTo<bool>`, você pode configurar lógica condicional e executar operações mais sofisticadas na cadeia. Por exemplo, você só pode enviar uma instrução `Mint` se uma conta específica estiver registrada.

Lembre-se de que você pode combinar isso com consultas, e como tal pode programar o blockchain para fazer algumas coisas incríveis. Isto é o que chamamos de contratos inteligentes, a característica definidora do uso avançado da tecnologia blockchain.
