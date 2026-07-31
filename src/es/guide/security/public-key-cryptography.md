---
translation_locale: es
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La criptografía de la clave pública {#public-key-cryptography}

La criptografía de la clave pública proporciona los medios para una comunicación segura y protección de datos, permitiendo actividades como las transacciones en línea seguras, las comunicaciones por correo electrónico cifradas, etc.

La criptografía de claves públicas emplea un par de llaves criptográficas, una clave pública y una clave privada, para crear un método altamente seguro de transmisión de información a través de redes en línea.

Es fácil hacer una clave pública a partir de una clave privada, pero lo contrario es bastante difícil, si no imposible. Esto mantiene las cosas seguras. Puedes compartir libremente tu llave pública sin arriesgarte a tu llave privada, que sigue siendo segura

## El cifrado y las firmas {#encryption-and-signatures}

La criptografía de llave pública permite a los individuos enviar mensajes y datos cifrados que solo pueden ser descifrados por el destinatario previsto que posee su clave privada correspondiente. En otras palabras, la clave pública funciona como una cerradura, y la clave privada sirve como una llave única que desbloquea los datos cifrados.

Este proceso de cifrado no sólo garantiza la privacidad y confidencialidad de la información sensible, sino que también establece la autenticidad del remitente. Esta firma sirve como sello digital de aprobación, verificando la identidad del remitente y la validez de los datos transferidos. Cualquier persona con su clave pública puede verificar que la persona que inició la transacción usó su clave privada.

## Las llaves en el lado del cliente {#keys-on-the-client-side}

Cada transacción debe ser firmada por una autoridad de cuenta. La clave privada o el material controlador para esa autoridad deben mantenerse en secreto, por lo que el software cliente es responsable del almacenamiento y la firma seguros.

::: advertencia

Todos los clientes son diferentes, pero la configuración del cliente de texto plano sólo es adecuada para el desarrollo y las redes de prueba controlada. Las integraciones de producción deben utilizar un gestor secreto, almacenamiento de llaves respaldado por hardware o otro límite de firma auditado.

:::

El registro de una nueva cuenta implica la generación de material del controlador, como un par de teclas Ed25519, y el envío de la parte pública a la red. Las transacciones posteriores desde esa cuenta deben firmarse con la clave privada correspondiente o por la política de controller de cuenta configurada.

Para que la criptografía de clave pública funcione eficazmente, evite volver a usar claves cuando necesite especificar una nueva llave. Aunque no hay nada que lo impida hacer eso, las claves públicas son públicas, lo que significa que si un atacante ve la misma llave pública que se utiliza, sabrán que las llaves privadas también son idénticas.

A pesar de que las claves privadas funcionan con principios ligeramente diferentes a los contraseñas, se aplica el consejo de hacerlas lo más aleatorias posible, nunca almacenarlas sin cifrar y nunca compartirlas con nadie en ninguna circunstancia.
