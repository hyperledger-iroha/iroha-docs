---
translation_locale: es
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuración y gestión {#configuration-and-management}

La configuración Iroha tiene dos capas autorizadas:

- Configuración local de pares y clientes, almacenada en archivos TOML y leída al iniciar el proceso
- Configuración en cadena, modificada por transacciones a través de [`SetParameter`](/es/blockchain/instructions.md#setparameter).

Utilice la configuración local para identidad de nodo, direcciones, registro, almacenamiento y claves de firma del cliente.

El comportamiento de producción debe provenir de estas capas de configuración. Las variables ambientales pueden ser convenientes para suministrar entradas de prueba a las herramientas locales, pero no son puertas de características de producción y no reemplazan la configuración comprometida.

Los principales puntos de entrada de la configuración son:

- [Génesis ](/es/guide/configure/genesis.md)
- [Configuración del cliente ](/es/guide/configure/client-configuration.md)
- [Las claves para el despliegue de la red ](/es/guide/configure/keys-for-network-deployment.md)
- [Corriendo con metal desnudo ](/es/guide/advanced/running-iroha-on-bare-metal.md)
- [Referencia de configuración entre pares ](/es/reference/peer-config/index.md)
