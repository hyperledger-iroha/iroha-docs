---
translation_locale: es
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Seguridad {#security}

Asegure un despliegue de Iroha como lo haría con cualquier sistema que maneje datos y valores sensibles. Proteja las claves de firma, el acceso a la red, las operaciones de los nodos, la supervisión y la respuesta a incidentes. Un libro mayor de blockchain no elimina la necesidad de estos controles.

### Navegación {#navigation}

En esta sección puedes aprender sobre varios aspectos de la seguridad de tu red Iroha. Para obtener más información, elige uno de los siguientes temas:

- [Principios de seguridad](./security-principles):

Principios básicos para proteger los datos y reducir el riesgo de infracciones.

- [Redes Privadas Virtuales](./vpn.md):

Cómo usar un VPN para restringir el acceso entre pares, Torii y el acceso de operadores en implementaciones privadas o de consorcio.

- [Seguridad Operativa](./operational-security.md):

Controles diarios para el acceso, la supervisión, la respuesta a incidentes y las estaciones de trabajo de los operadores.

- [Monitoreo de fraudes](./fraud-monitoring.md):

Cómo usar eventos del libro mayor blockchain, consultas, permisos y señales operativas para detectar actividad sospechosa y preservar evidencia de respuesta.

- [Seguridad de la contraseña](./password-security.md):

Entropía de contraseñas, construcción de contraseñas fuertes y modos de falla comunes.

- [Criptografía de clave pública](./public-key-cryptography.md):

Cifrado de clave pública, firmas y comunicación autenticada.

  - [Generando Claves Criptográficas](./generating-cryptographic-keys.md):

Generar claves criptográficas compatibles con `kagami`.

  - [Almacenamiento de Claves Criptográficas](./storing-cryptographic-keys.md):

Almacene las claves criptográficas utilizando controles en capas apropiados para el despliegue.
