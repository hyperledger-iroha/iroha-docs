---
translation_locale: es
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Criptografía de clave pública {#public-key-cryptography}

La criptografía de clave pública utiliza una clave pública y una clave privada relacionadas. La clave pública se puede compartir. La clave privada debe permanecer bajo el control del titular autorizado. La seguridad depende del uso de un algoritmo compatible, de generar claves con aleatoriedad segura y de proteger la clave privada.

## Firmas digitales {#digital-signatures}

Un firmante criptográfico crea una firma digital con una clave privada. Un verificador comprueba la firma con la clave pública correspondiente.

Una firma válida muestra que los bytes firmados no fueron modificados y que el titular de la clave privada los aprobó. No identifica a una persona por sí sola. La identidad depende de cómo se registró y gobernó la clave pública o el controlador de la cuenta.

Las firmas proporcionan evidencia de integridad y autorización. No cifran el contenido firmado.

## Cifrado de clave pública {#public-key-encryption}

Algunos esquemas de clave pública cifran datos para la clave pública de un destinatario. El destinatario descifra esos datos con la clave privada correspondiente. El cifrado y las firmas son operaciones separadas y pueden usar claves o algoritmos diferentes.

Iroha la firma de transacciones no hace que los datos del libro mayor de la blockchain pública sean confidenciales. Utilice el mecanismo de confidencialidad aprobado por el despliegue cuando el contenido de la carga útil deba permanecer privado.

## Claves en el lado del cliente {#keys-on-the-client-side}

Cada transacción debe cumplir con la política del controlador de cuenta configurada. Una cuenta simple puede usar una clave de firma. Una cuenta gobernada puede usar una política de controlador más compleja.

El software cliente debe proteger las claves privadas y otro material del controlador. La configuración del cliente en texto plano es adecuada solo para desarrollo local y pruebas controladas. Las integraciones de producción deben usar un gestor de secretos, almacenamiento de claves respaldado por hardware, un servicio de firmas aislado u otro límite de firmas auditado.

Utilice claves separadas para entornos y propósitos distintos. Reutilizar una clave enlaza esos usos y aumenta el impacto de la exposición.

Vea [Generando Claves Criptográficas](./generating-cryptographic-keys.md), [Almacenamiento de Claves Criptográficas](./storing-cryptographic-keys.md) y [Seguridad Operativa](./operational-security.md).
