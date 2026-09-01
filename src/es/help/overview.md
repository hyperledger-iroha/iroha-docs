---
translation_locale: es
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solución de problemas {#troubleshooting}

Esta sección le ayudará a resolver problemas al trabajar con Iroha. Si algo falla, [revise primero las claves](#check-the-keys). Si eso no basta, consulte las instrucciones correspondientes a cada etapa:

- [Problemas de instalación](./installation-issues.md)
- [Problemas de configuración](./configuration-issues.md)
- [Problemas de implementación](./deployment-issues.md)
- [Problemas de integración](./integration-issues.md)

Si el problema que está experimentando no se describe aquí, contáctenos a través de [Telegram](https://t.me/hyperledgeriroha).

## Revise las claves {#check-the-keys}

La mayoría de los problemas se deben a claves que no coinciden. Por eso recomendamos esta regla: **si algo falla, revise primero las claves**.

La razón es sencilla: no se pueden distinguir los mensajes de error causados por claves de pares que no coinciden con las del conjunto de pares de confianza, pues hacerlo expondría la clave pública del par. Si usa gráficos de Helm o despliegues de Kubernetes cuyas claves proceden de variables de entorno, compare los valores configurados de [`public_key`](/es/reference/peer-config/params.md#param-public-key), [`private_key`](/es/reference/peer-config/params.md#param-private-key) y [`trusted_peers`](/es/reference/peer-config/params.md#param-trusted-peers) antes de investigar fallos de nivel superior.

Si tiene dudas, [genere un nuevo par de claves](/es/guide/security/generating-cryptographic-keys.md).
