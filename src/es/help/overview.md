---
translation_locale: es
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Solución de problemas {#troubleshooting}

Esta sección está destinada a ayudarle en caso de que encuentre problemas durante el trabajo con Iroha. Si algo sale mal, por favor. [Compruebe las llaves](#check-the-keys) Si eso no ayuda, revisa las instrucciones de resolución de problemas para cada etapa:

- [Problemas de instalación](./installation-issues.md)
- [Cuestiones de configuración ](./configuration-issues.md)
- [Cuestiones de despliegue](./deployment-issues.md)
- [Cuestiones de integración ](./integration-issues.md)

Si el problema que experimenta no está descrito aquí, póngase en contacto con nosotros a través de [Telegrafo](https://t.me/hyperledgeriroha).

## Compruebe las llaves . {#check-the-keys}

La mayoría de los problemas surgen como resultado de teclas incomparables. Es por eso que recomendamos seguir esta regla: Si algo sale mal, comprueba primero las teclas.

Aquí hay una explicación rápida: No es posible diferenciar los mensajes de error que surgen cuando las claves de pares no coinciden con las claves en la matriz de compañeros de confianza porque expondría la clave pública de los compañeros. Como tal, si tiene gráficos de Helm o implementaciones de Kubernetes con claves definidas a través de variables ambientales, compare los valores configurados [`public_key`](/es/reference/peer-config/params.md#param-public-key), [`private_key`](/es/reference/peer-config/params.md#param-private-key), y [`trusted_peers`](/es/reference/peer-config/params.md#param-trusted-peers) antes de investigar fallos de nivel superior.

En caso de duda, [ genera un nuevo par de llaves ](/es/guide/security/generating-cryptographic-keys.md).
