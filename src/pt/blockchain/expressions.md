---
translation_locale: pt
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Expressões, Condicionais, Lógica {#expressions-conditionals-logic}

Todos os [Iroha Operações de instrução](./instructions.md) operam sobre expressões. Cada expressão possui um `EvaluatesTo`, que é usado na execução da instrução. Embora você possa especificar o nome da conta diretamente, você também poderia especificar o ID da conta por meio de alguma operação matemática ou de cadeia de caracteres. Você também pode verificar se uma conta está registrada na blockchain.

Usando expressões que implementam `EvaluatesTo<bool>`, você pode configurar lógica condicional e executar operações mais sofisticadas na cadeia. Por exemplo, você pode enviar uma instrução `Mint` apenas se uma conta específica estiver registrada.

Lembre-se de que você pode combinar isso com consultas e, como tal, pode programar a blockchain para fazer algumas coisas incríveis. É isso que chamamos de contratos inteligentes, a característica definidora do uso avançado da tecnologia blockchain.
