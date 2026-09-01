---
translation_locale: es
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Expresiones, Condicionales, Lógica {#expressions-conditionals-logic}

Todos los [Iroha Operaciones de instrucción](./instructions.md) operan sobre expresiones. Cada expresión tiene un `EvaluatesTo`, que se utiliza en la ejecución de instrucciones. Aunque podrías especificar el nombre de la cuenta Directamente, también podrías especificar el ID de la cuenta mediante alguna operación matemática o de cadena. También puedes comprobar si una cuenta está registrada en la cadena de bloques.

Usando expresiones que implementan `EvaluatesTo<bool>`, puedes configurar lógica condicional y ejecutar operaciones más sofisticadas en la cadena. Por ejemplo, puedes enviar una instrucción `Mint` solo si una cuenta específica está registrada.

Recuerda que puedes combinar esto con consultas, y como tal puedes programar la cadena de bloques para hacer cosas asombrosas. Esto es lo que llamamos contratos inteligentes, la característica definitoria del uso avanzado de la tecnología blockchain.
