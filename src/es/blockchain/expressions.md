---
translation_locale: es
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Expresiones, condiciones y lógica. {#expressions-conditionals-logic}

Todo el mundo [Iroha Instrucciones especiales](./instructions.md) Cada expresión tiene una `EvaluatesTo`, Si bien se puede especificar el nombre de la cuenta directamente, también se puede especifica la cuenta ID Puede comprobar si una cuenta está registrada en la cadena de bloques también.

Usando expresiones que implementan `EvaluatesTo<bool>`, se puede configurar la lógica condicional y ejecutar operaciones más sofisticadas en cadena. Por ejemplo, se puede enviar una instrucción `Mint` sólo si se registra una cuenta específica.

Recuerde que se puede combinar esto con consultas, y como tal puede programar la cadena de bloques para hacer algunas cosas increíbles. Esto es lo que llamamos contratos inteligentes, la característica definidora del uso avanzado de la tecnología blockchain.
