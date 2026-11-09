---
translation_locale: es
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solución de problemas de configuración {#troubleshooting-configuration-issues}

Esta sección ofrece consejos para resolver problemas de configuración de Iroha 3. Asegúrese de [revisar primero las claves](./overview.md#check-the-keys), pues son la causa más habitual de problemas en Iroha.

Si el problema que está experimentando no se describe aquí, contáctenos a través de [Telegram](https://t.me/hyperledgeriroha).

## Génesis desactualizado en una configuración de Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Al usar Iroha con Docker Compose, uno de los contenedores de los pares puede fallar con el error `Failed to deserialize raw genesis block`. Suele significar que el par, la transacción de génesis firmada y la configuración generada proceden de revisiones o perfiles distintos de Iroha.

Desde el directorio del kit, ejecuta `python3 poc.py logs` para consultar los registros de los validadores. Sigue la guía [Lanzar Iroha 3](/es/get-started/launch-iroha.md) para compilar y ejecutar cuatro validadores en Docker con binarios de la misma revisión.

Usa `python3 poc.py down` y `python3 poc.py up` para reiniciar la misma red. Conserva `state/` junto con sus cuatro volúmenes de Docker.

::: info

No existe un mecanismo automático general para sustituir el génesis de una red activa. Trátelo como una migración coordinada: conserve el estado anterior, inicie pares compatibles y traslade los validadores a la nueva configuración solo cuando los operadores hayan acordado el plan.

:::

## Formato Multihash de Claves Privadas y Públicas {#multihash-format-of-private-and-public-keys}

En la [configuración del cliente](/es/guide/configure/client-configuration.md), las claves se expresan en [formato multihash](https://github.com/multiformats/multihash).

Si nunca has trabajado con multi-hash antes, es natural asumir que el lado derecho no es una representación hexadecimal de los bytes de la clave (dos símbolos por byte), sino los bytes codificados como ASCII (o UTF-8), y llamar a `from_hex` en el literal de cadena tanto en la instanciación de `public_key` como en `private_key`.

También es natural asumir que llamar a `PrivateKey::try_from_str` sobre el literal de cadena solo produciría la clave correcta. Así que si obtienes el número de bits en la clave incorrecto, por ejemplo 32 bytes en lugar de 64, eso generaría un mensaje de error.

Ambas suposiciones son incorrectas. Desafortunadamente, los mensajes de error no ayudan a depurar este tipo particular de falla.

Cómo arreglarlo: use `hex_literal`. Esto también convertirá una fea cadena de caracteres en una pequeña tabla de números obviamente hexadecimales.

::: warning

Incluso la implementación de `try_from_str` no puede verificar si una cadena dada es un `PrivateKey` válido y avisarte si no lo es.

Detectará algunos errores obvios, por ejemplo, si la cadena contiene un símbolo inválido. Sin embargo, dado que nuestro objetivo es soportar muchos formatos de clave, no puede hacer mucho más. Tampoco puede decir si la clave es la clave privada correcta para la cuenta dada, a menos que envíe una instrucción.

:::

Este tipo de errores sutiles se pueden evitar, por ejemplo, deserializando directamente desde literales de cadena, o generando un par de claves nuevo en lugares donde tenga sentido.
