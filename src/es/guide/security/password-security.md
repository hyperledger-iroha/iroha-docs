---
translation_locale: es
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Seguridad de la contraseña {#password-security}

Las contraseñas pueden proteger las consolas de operador, los almacenes secretos, las copias de seguridad y los archivos de claves locales. Una contraseña es solo un control. Úsela junto con la custodia segura de claves, los controles de acceso y la autenticación multifactor donde esté disponible.

## Usa contraseñas únicas y generadas {#use-unique-generated-passwords}

- Genera una contraseña diferente para cada cuenta y entorno.
- Usa un gestor de contraseñas para crear y almacenar contraseñas largas y aleatorias.
- Usa una frase de contraseña de varias palabras solo cuando sus palabras sean seleccionadas al azar de una lista lo suficientemente grande.
- Mantén los nombres, fechas, direcciones, citas, patrones de teclado y fragmentos reutilizados fuera de las contraseñas.
- Utilice un token generado por el servicio o una clave criptográfica en lugar de una contraseña introducida por un humano cuando el servicio admita ese método.

La longitud e imprevisibilidad importan más que las sustituciones decorativas. Agregar un símbolo a una palabra predecible no hace que el resultado sea seguro.

## Proteger cuentas basadas en contraseña {#protect-password-based-accounts}

- Habilite la autenticación multifactor resistente al phishing donde esté disponible.
- Aplicar límites de velocidad, política de bloqueo y alertas a los fallos de autenticación repetidos.
- Envía contraseñas solo a través de canales autenticados y encriptados.
- Mantenga las contraseñas y los códigos de recuperación fuera de los registros, líneas de comando, repositorios de código, archivos de configuración, tickets y chats.
- Almacene los verificadores de contraseña del lado del servidor con una función de hash de contraseñas con sal y de difícil memoria, y con parámetros apropiados para la implementación.

## Almacenamiento, Recuperación y Reemplazo {#storage-recovery-and-replacement}

- Utiliza un gestor de contraseñas auditado con copias de seguridad encriptadas y verificadas.
- Almacene los códigos de recuperación por separado del dispositivo que recuperan. Una copia en papel protegida y fuera de línea puede ser adecuada como material de recuperación.
- Limite el acceso a las exportaciones del administrador de contraseñas y a los medios de respaldo.
- Reemplace una contraseña después de una exposición sospechada, reutilización no autorizada o un evento de política que requiera su reemplazo.
- Pruebe los procedimientos de recuperación de cuentas antes del lanzamiento en producción.

::: warning

Una contraseña que desbloquea una clave privada no puede hacer que una copia expuesta de esa clave sea segura. Si se sospecha exposición de la clave privada, siga el procedimiento de reemplazo o revocación de claves del despliegue.

:::

Vea [Seguridad Operativa](./operational-security.md) y [Almacenamiento de Claves Criptográficas](./storing-cryptographic-keys.md).
