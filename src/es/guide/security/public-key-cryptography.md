---
translation_locale: es
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# La criptografía de la clave pública {#public-key-cryptography}

La criptografía de llaves públicas utiliza una clave pública relacionada y la clave privada. La clave pública se puede compartir. La clave privada debe permanecer bajo el control de la autoridad. La seguridad depende del uso de un algoritmo soportado, la generación de claves con aleatoriedad segura y la protección de la clave privada

## Las firmas digitales {#digital-signatures}

Un firmante crea una firma digital con una clave privada y un verificador verifica la firma con la clave pública correspondiente.

Una firma válida muestra que los bytes firmados no fueron cambiados y que el titular de la clave privada los aprobó. No identifica a una persona por sí misma. La identidad depende de cómo se registró y administró la clave pública o el controlador de cuenta.

Las firmas proporcionan evidencia de integridad y autorización, no cifran el contenido firmado.

## El cifrado de la clave pública {#public-key-encryption}

Algunos esquemas de llave pública cifran los datos para la clave pública de un destinatario. El receptor descifra esos datos con la clave privada correspondiente. El cifrado y las firmas son operaciones separadas y pueden utilizar diferentes claves o algoritmos.

La firma de transacciones Iroha no hace que los datos del libro mayor público sean confidenciales. Utilice el mecanismo aprobado de confidencialidad de la implementación cuando el contenido de la carga útil debe permanecer privado.

## Las llaves en el lado del cliente {#keys-on-the-client-side}

Cada transacción debe cumplir con la política de controlador de cuentas configurada. Una cuenta simple puede usar una clave de firma. Una cuenta controlada puede utilizar una política de controlador más compleja.

El software del cliente debe proteger las claves privadas y otros materiales de control. La configuración del cliente en texto plano solo es adecuada para el desarrollo local y las pruebas controladas. Las integraciones de producción deben utilizar un gestor de secretos, almacenamiento de claves respaldado por hardware, un servicio de firma aislado u otro límite de firma auditado.

Use llaves separadas para entornos y propósitos separados. El reutilización de una clave vincula esos usos y aumenta el impacto de la exposición.

Véase [Generación de claves criptográficas](./generating-cryptographic-keys.md), [almacenamiento de claves cryptográficas ](./storing-cryptographic-keys.md) y [Seguridad operativa ](./operational-security.md).
