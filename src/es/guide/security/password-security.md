---
translation_locale: es
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Seguridad de contraseñas {#password-security}

Las contraseñas pueden proteger las consolas del operador, almacenes secretos, copias de seguridad y archivos de llaves locales. Una contraseña es sólo un control. Utilice junto con la custodia segura de claves, controles de acceso y autenticación multifactor cuando esté disponible.

## Usar contraseñas únicas y generadas {#use-unique-generated-passwords}

- Generar una contraseña diferente para cada cuenta y entorno.
- Use un administrador de contraseñas para crear y almacenar contraseñas largas al azar.
- Utilizar una frase de contraseña de varias palabras solo cuando sus palabras se seleccionan al azar de una lista suficientemente grande.
- Mantenga nombres, fechas, direcciones, citas, patrones de teclado y fragmentos reutilizados fuera de las contraseñas.
- Utilice un token generado por el servicio o una clave criptográfica en lugar de una contraseña introducida por el hombre cuando el servicio admita ese método.

La longitud y la imprevisibilidad son más importantes que las sustituciones decorativas. Añadir un símbolo a una palabra predecible no hace que el resultado sea seguro.

## Proteja las cuentas basadas en contraseñas {#protect-password-based-accounts}

- Habilitar la autenticación multifactorial resistente al phishing cuando esté disponible.
- Aplicar límites de tarifas, política de bloqueo y alertas para fallas repetidas en la autenticación.
- Envíe contraseñas sólo a través de canales autenticados y cifrados.
- Mantenga contraseñas y códigos de recuperación fuera de registros, líneas de comandos, repositorios de origen, archivos de configuración, boletos y chat.
- Almacenar los verificadores de contraseñas del lado del servidor con una función de hashing de contraseña salgada y dura en memoria y parámetros apropiados para la implementación.

## Almacenamiento, recuperación y sustitución {#storage-recovery-and-replacement}

- Utilizar un administrador de contraseñas auditado con copias de seguridad cifradas y probadas.
- Almacenar los códigos de recuperación por separado del dispositivo que recuperen. Una copia protegida en papel fuera de línea puede ser adecuada para el material de recuperación.
- Limitar el acceso a las exportaciones del gestor de contraseñas y a los medios de copia de seguridad.
- Sustituye una contraseña después de la sospecha de exposición, reutilización no autorizada o un evento de política que requiera reemplazo.
- Prueba de los procedimientos de recuperación de cuentas antes del lanzamiento de producción.

::: warning

Una contraseña que desbloquea una clave privada no puede hacer una copia expuesta de esa llave segura. En caso de sospecha de exposición a una clave privada, siga el procedimiento de reemplazo o revocación de la llave del despliegue.

:::

Véase [Seguridad operativa](./operational-security.md) y [Cleves criptográficas de almacenamiento ](./storing-cryptographic-keys.md).
