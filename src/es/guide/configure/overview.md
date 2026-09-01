---
translation_locale: es
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuración y Gestión {#configuration-and-management}

La configuración Iroha tiene dos capas autorizadas:

- Configuración de cliente y par de red local, almacenada en archivos TOML y leída al inicio del proceso
- configuración en cadena, cambiada por transacciones a través de [`SetParameter`](/es/blockchain/instructions.md#setparameter)

Use la configuración local para la identidad del nodo, direcciones, registro, almacenamiento y claves de firma del cliente. Use la configuración en cadena para valores que deben ser acordados por la red y reproducidos de manera determinista.

El comportamiento de producción debe provenir de estas capas de configuración. Las variables de entorno pueden ser convenientes para suministrar entradas de prueba a herramientas locales, pero no son puertas de funciones de producción y no reemplazan la configuración comprometida.

Los principales puntos de entrada de configuración son:

- [génesis de la blockchain](/es/guide/configure/genesis.md)
- [Configuración del cliente](/es/guide/configure/client-configuration.md)
- [Claves para el despliegue de la red](/es/guide/configure/keys-for-network-deployment.md)
- [Ejecutándose en metal desnudo](/es/guide/advanced/running-iroha-on-bare-metal.md)
- [referencia de configuración de par de red](/es/reference/peer-config/index.md)
