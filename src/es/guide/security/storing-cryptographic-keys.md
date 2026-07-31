---
translation_locale: es
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# El almacenamiento de las claves criptográficas {#storing-cryptographic-keys}

Sus datos confidenciales solo permanecen privados si adopta prácticas <abbr title="Operational Security">OPSEC</abbr> para proteger las claves criptográficas. Las amenazas de ingeniería social, donde alguien que se hace pasar por una figura con autoridad intenta manipularlo para que le dé su clave criptográfica privada, son reales. Siempre tenga cuidado y evite compartir su llave privada, tratándola como si las llaves de su apartamento fueran reservadas sólo para personas de confianza.

Para obtener más información sobre <abbr title="Operational Security">OPSEC</abbr> y sus mejores prácticas, véase [Seguridad operativa ](./operational-security).

## El almacenamiento digital de las claves criptográficas {#storing-cryptographic-keys-digitally}

Cuando se trata de proteger las claves criptográficas digitalmente, principalmente solo hay dos enfoques disponibles: [SSH](https://www.ssh.com/) y [GPG](https://www.gnupg.org/). Estos métodos proporcionan capas de seguridad para evitar el acceso no autorizado a sus llaves criptografías.

Muchas de las decisiones arquitectónicas Iroha han sido influenciadas por los principios del protocolo Secure Shell (`SSH`, por lo que esta sección se centra principalmente en el enfoque `SSH`. ofrecer instrucciones sobre cómo implementar de manera efectiva el protocolo para almacenar sus claves criptográficas dentro del ecosistema Iroha.

### Utilizando el agente SSH y SSH {#using-ssh-and-ssh-agent}

Secure Shell Protocol (`SSH`) es un protocolo de red criptográfica que sirve como una puerta de enlace virtual, permitiendo el acceso seguro a máquinas remotas a través de redes potencialmente no tan seguras mediante la utilización de claves SSH credenciales de acceso. Proporciona una forma eficiente de interactuar de forma remota con los sistemas sin la necesidad de presencia física. En este contexto, `SSH` ofrece dos mecanismos primarios de autenticación: el enfoque convencional basado en contraseñas y el método más seguro del par de llaves público-privado.

Para obtener más información sobre `SSH`, véase [el asunto relacionado de la Academia SSH ](https://www.ssh.com/academy/ssh).

Para agilizar el proceso de inicio de sesión y evitar la necesidad de introducción repetitiva, es posible emparejar las teclas `SSH` con el agente SSH (`ssh-agent`) el programa asistente que recuerda sus teclas y/o contraseña `SSH` durante toda la duración de una reunión. Esta configuración permite que la puerta de entrada `SSH` acceda sin esfuerzo a las claves siempre que se conecte a otras máquinas.

El flujo de trabajo aquí es el siguiente: usted tiene su clave pública almacenada en un sistema remoto y mantiene su llave privada segura. Cada vez que quieras acceder a un sistema remoto, el `ssh-agent` El sistema remoto luego envía de nuevo una clave pública a la que se accede. [desafío](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) que sólo su llave privada puede responder adecuadamente. `ssh-agent` maneja este desafío usando su clave privada y envía la respuesta correcta de nuevo al sistema remoto. Si la respuesta coincide con lo que el sistema esperaba, se le otorga acceso.

La belleza del `ssh-agent` es que se mantiene en su clave privada durante su sesión, por lo que no hay necesidad de seguir ingresando su contraseña o frase de clave privada cada vez que se conecta a un sistema remoto.

Para obtener más información sobre el `ssh-agent`, véase [el tema relacionado de la Academia SSH](https://www.ssh.com/academy/ssh/agent).

::: info Nota

Para obtener una descripción detallada del protocolo `SSH` y de la herramienta `ssh-agent`, véase los siguientes temas [SSH Academia ](https://www.ssh.com/academy):

  - [¿Qué es ? SSH ¿Security Shell?](https://www.ssh.com/academy/ssh)
  - [ssh-agente: Cómo configurar ssh-agent, envío de agentes y protocolo del agente](https://www.ssh.com/academy/ssh/agent)

:::

### Añadiendo un programa de gestión de contraseñas {#adding-a-password-manager-program}

Se recomienda mejorar la seguridad de sus claves `SSH` protegiéndolas con una contraseña, que actúa como un obstáculo adicional para las partes maliciosas que buscan obtener su información sensible.

Se pueden utilizar una variedad de administradores de contraseñas para almacenar las contraseñas del usuario y `SSH` Las llaves temporalmente. Para ser claros, [KeePass](https://keepass.info/) Se utiliza como un ejemplo de gerente de contraseñas, específicamente, el [KeePassXC](https://keepassxc.org/) puerto en funcionamiento en sistemas operativos basados en Linux.

Para obtener instrucciones sobre cómo configurar KeePassXC, véase la sección [Configurando KeePassXC](#configuring-keepassxc) a continuación.

![KeePassXC: pantalla `Main` UI](../../../img/KeePassXC.png)

KeePassXC ofrece una mayor seguridad, flexibilidad y control. No solo almacena las contraseñas sino también las claves de `SSH`. Cuando se utiliza para el almacenamiento de llaves, este administrador de contraseñas proporciona a la `ssh-agent` las claves almacenadas, que luego se eliminan rápidamente de su memoria una vez cerrada la ventana KeePassXC.

::: propina

En teoría, cualquiera de los KeePass puertos [que figuran en el sitio web oficial](https://keepass.info/download.html) Se recomienda que se utilice para almacenamiento clave: [KeePassX](https://www.keepassx.org/) o [KeePassXC](https://keepassxc.org/).

:::

#### Configuración de KeePassXC {#configuring-keepassxc}

Para configurar KeePassXC, realice los siguientes pasos:

1. Inicie KeePassXC, luego vaya a Herramientas > Configuraciones, o seleccione el botón Gear desde el panel superior UI.

2. En la pestaña Configuración de aplicaciones que aparece, seleccione SSH Agente desde el menú izquierdo y luego seleccione la casilla de verificación Habilitar SSH Integración de Agente.

   ::: info Muestre una captura de pantalla de referencia

   ![La pestaña KeePassXC `SSH Agent`: Habilitar el SSH Agente ](../../../img/keepassxc_ssh_agent.png)

   :::

3. Crear una nueva base de datos KeePassXC. Para obtener instrucciones, consulte la guía de usuario [KeePassXC > Creación de su primera base de datos](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Para cada clave que desee almacenar en la base de datos KeePassXC que haya creado, realice los siguientes pasos:

   - Añadir una nueva entrada en la base de datos. Para obtener instrucciones, consulte [KeePassXC Guía de usuario > Creando su primera base de datos ](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Al agregar una nueva entrada, adjunta el archivo que contiene la clave haciendo lo siguiente: seleccione Avanzado del menú izquierdo, luego seleccione Añadir en la sección Anexos, elige el archivo requerido en la ventana Seleccionar archivos que aparece.

   - Al agregar una nueva entrada, seleccione SSH Agente del menú izquierdo, luego seleccione el archivo de clave que agregó en el menú Anexo en la sección Clave privada; entonces seleccione las siguientes casillas de verificación:

      - Añadir clave al agente cuando la base de datos se abre/desbloquea

      - Eliminar la clave del agente cuando la base de datos está cerrada/bloqueada.

      - Requerir la confirmación del usuario cuando se utiliza esta clave

   - Si es necesario, haga otros cambios en la entrada.

   - Cuando esté listo, seleccione OK para guardar la entrada.

   ::: details Muestre capturas de pantalla de referencia

   ![La pestaña KeePassXC `Advanced`: Añadir un anexo de clave privada ](../../../img/keepassxc_private_key.png)

   ![La pestaña KeePassXC `SSH Agent`: Añadir un anexo de clave privada ](../../../img/keepassxc_pk_agent.png)

   :::

##### Los resultados esperados {#expected-results}

- Las claves criptográficas y `shh` se almacenan como entradas en una base de datos KeePassXC a la que se puede acceder mientras esté abierta la ventana KeePassXC.

- Las claves criptográficas almacenadas y `ssh` se pueden utilizar siempre que se requieran para la autorización.

- Las claves criptográficas y `ssh` almacenadas se eliminan de la `ssh-agent` una vez que se cierra la ventana KeePassXC.

::: info Nota

Sin habilitar la opción Requerir confirmación de usuario cuando se utiliza esta clave, el `ssh-agent` puede no monitorear el proceso que le proporcionó una clave. En caso de que el proceso del administrador de contraseñas sea terminado por un malware o un servicio del sistema a través de una señal `SIGKILL`, Es probable que la clave permanezca en el `ssh-agent`, ya que los programas del sistema Unix no pueden interceptar `SIGKILL`.

:::

## El almacenamiento físico de las claves criptográficas {#storing-cryptographic-keys-physically}

Para aquellos que buscan el más alto nivel de seguridad fuera de línea, la opción de almacenar claves criptográficas asegura físicamente que las llaves permanezcan completamente desconectadas de las redes digitales, minimizando así el riesgo de acceso no autorizado. El reconocimiento de la opción física subraya nuestro compromiso de satisfacer las diversas necesidades de seguridad.

### El uso de una llave de hardware {#using-a-hardware-key}

Nuestro equipo considera que las claves de hardware son una de las mejores medidas de seguridad. Una llave de hardware es un dispositivo compacto que se conecta a través de un puerto USB y tiene el tamaño de una unidad flash típica, solo procesa eventos relacionados con la seguridad cuando está conectado a una máquina. Esto le permite desconectar fácilmente el dispositivo en caso de una brecha de seguridad, o simplemente reconectarlo a otra máquina siempre que sea necesario.

Sin embargo, dado que hay muchas marcas de llaves de hardware, cada una con su único APIs, es importante investigar el mercado para encontrar la clave que mejor se adapte a sus necesidades.

Hasta ahora, nuestro equipo ha probado internamente la clave de hardware [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) que demostró tener muchas características positivas, incluida la funcionalidad versátil API.

Sin embargo, hay un inconveniente potencial que tener en cuenta. [HMAC Autenticación de desafío y respuesta](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) Y almacenar una clave privada correspondiente para esta respuesta podría crear una vulnerabilidad. Esta configuración podría permitir inadvertidamente a los atacantes hacer conjeturas informadas sobre la información almacenada dentro del YubiKey La memoria de 5C, comprometiendo así la seguridad general.

Afortunadamente, esta vulnerabilidad puede mitigarse mediante la adopción de un enfoque alternativo para utilizar el YubiKey 5C. La idea es usar YubiKey 5C para acceder de forma segura a una base de datos KeePassXC que almacena sus claves criptográficas y `SSH`. Este método puede incluso considerarse beneficioso, ya que supera la seguridad de la mayoría de las contraseñas y hace necesario que la parte maliciosa esté en posesión de su clave de hardware en caso de fuga de la base de datos KeePassXC.

::: Información

Para obtener más información sobre el método anterior, consulte la respuesta de uno de los desarrolladores KeePassXC[Janek Bevendorff](https://github.com/phoerious)a la siguiente pregunta StackExchange:

[¿Es razonable utilizar KeePassXC con YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### El uso de una frase mnemónica {#using-a-mnemonic-phrase}

Alternativamente, se puede memorizar una clave privada como una serie de palabras, conocida como frase mnemónica. Este método, utilizado en muchas billeteras, requiere recordar alrededor de 25 palabras específicas. La mayoría de los administradores de contraseñas, incluido el mencionado anteriormente KeePassXC, ofrecen generación de contraseña mnemónica .
