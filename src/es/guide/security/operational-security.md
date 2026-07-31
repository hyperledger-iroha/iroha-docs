---
translation_locale: es
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Seguridad operativa {#operational-security}

La seguridad operativa (OPSEC) es un enfoque sistemático de la gestión de la seguridad y los riesgos, que consiste esencialmente en una colección de estrategias y asesoramiento adoptados para casos de uso específicos con el objetivo de prevenir el acceso no autorizado y las fugas de datos.

<abbr title="Operational Security">OPSEC </abbr> es la práctica estándar para la mayoría de las empresas para garantizar la disponibilidad y estabilidad de sus activos. Esto incluye considerar factores como la seguridad física (por ejemplo, asegurarse de que los billetes post-it no contengan datos confidenciales), protocolos de comunicación seguros (por ejemplo, no enviar datos sensibles a través de SMS sin cifrar), análisis de amenazas (por ejemplo: determinar posibles partes maliciosas, conocer los últimos métodos de ataque), capacitación del personal (p. ej., sin que los empleados sigan las medidas <abbr title="Operational Security">OPSEC</abbr>), que, tarde o temprano, resultarán ineficaces), y la mitigación de riesgos (por ejemplo, cifrar sus discos duros y dispositivos USB.

Desde entonces Iroha es probable que se utilice como un libro mayor financiero, <abbr title="Operational Security">OPSEC</abbr> En este tema se describen las estrategias y los enfoques que los individuos y las empresas deben adoptar en su conjunto. las organizaciones que utilizan Iroha en sus operaciones deben considerarse como parte de su amplio protocolo de seguridad.

Seguir y adoptar las directrices de este tema es un paso necesario para lograr una seguridad total, sin embargo, por sí solo no es suficiente. Para mejorar aún más su seguridad, aprenda más en el resto de la sección [Seguridad](./index.md) y específicamente los siguientes temas:

- [Principios de seguridad](./security-principles.md)
- [Seguridad de contraseñas ](./password-security.md)

## Las medidas recomendadas OPSEC {#recommended-opsec-measures}

- Manténgase alerta. [lo más probable](https://arxiv.org/pdf/2209.08356.pdf) La forma en la que uno puede perder sus activos en una cadena de bloques es dando sus datos sensibles.

- Cifrar los dispositivos de arranque les permite proteger sus datos incluso si un atacante ha obtenido acceso al hardware.

- Utilice un software de confianza. El software que se envía a través de construcciones binarias reproducibles, y que se construye desde la fuente, es el más confiable. Software propietario o de código abierto que no ha sido auditado es un riesgo potencial que debe ser tomado en serio.

- Nunca dejes sin vigilancia los dispositivos portátiles con datos sensibles. Una fracción de segundo es suficiente para robarte el dispositivo.

- Verifique las firmas en los paquetes binarios. Esto no es muy diferente de la criptografía con clave pública utilizada dentro de Iroha.

- Para evitar el acceso no autorizado, siempre asegúrese de su computadora portátil o personal cuando la deje sin vigilancia. Use contraseñas fuertes, bloquee la pantalla y siga las mejores prácticas para proteger sus dispositivos.

- Establecer un seguro [con huecos en el aire](https://en.wikipedia.org/wiki/Air_gap_(networking)En primer lugar, cifrar las llaves y luego almacenarlas en un dispositivo solo fuera de línea. Idealmente con escudo electromagnético instalado. [Las llaves de hardware](./storing-cryptographic-keys.md#using-a-hardware-key) se han diseñado específicamente para este fin.

- Mantenga siempre el software actualizado a su última versión en todos los dispositivos, incluidos los ordenadores y teléfonos.

- Desarrollar una rutina para actualizar periódicamente las contraseñas y las claves criptográficas.Este enfoque proactivo contribuye significativamente a mejorar la postura general de seguridad, ya que es mucho más difícil alcanzar un objetivo móvil.

## El uso de los navegadores {#using-browsers}

Si una aplicación conectada a Iroha tiene una web UI, su navegador puede ayudar a la seguridad o representar una amenaza potencial. Es esencial tener cuidado, especialmente cuando se trata de los plugins que elija instalar.

Considere las siguientes medidas para mejorar la seguridad de su navegación:

- Evite usar navegadores que son conocidos por tener malos modelos de seguridad y por filtración de datos de sus usuarios. Puede buscar violaciones de privacidad y problemas de seguridad para cualquier navegador. Por ejemplo, [Este artículo sobre privacidad del navegador ](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) discute una variedad de navegadores y lo seguros que son . Tenga en cuenta que los navegadores propietarios (como Chrome, Safari, Opera, Vivaldi, Edge y otros) son generalmente tremendamente más difíciles de auditar debido a que su código está oculto del público, lo que significa que no se puede estar seguro de cuán seguros son.

- Dar preferencia a los navegadores con un sólido historial de valoración y protección de la privacidad y seguridad de sus usuarios:
  - [Librewolf](https://librewolf.net/), [Icecat](https://www.gnu.org/software/gnuzilla/), [Firedragon](https://github.com/dr460nf1r3/firedragon-browser), etc.  bifurcados bien establecidos de Mozilla Firefox con características de seguridad añadidas.
  - [Unoogled chromium ](https://github.com/ungoogled-software/ungoogled-chromium)  una versión de código abierto altamente auditada de Google Chrome que se ha mejorado con medidas de seguridad adicionales y ha eliminado todos los servicios web relacionados con Google.
  - [Qué valiente .](https://brave.com/)  una versión de código abierto altamente auditada de [Google Chromium](https://www.chromium.org/Home/) que se refuerza con medidas de seguridad adicionales; tiene un sistema integrado <abbr title="Virtual Private Network">VPN</abbr> y la funcionalidad de bloqueo de anuncios.
  - [Falcon](https://www.falkon.org/)  un navegador web basado en Qt de código abierto (construido en `QtWebEngine`, un envase para [Google Chromium](https://www.chromium.org/Home/)) con un historial conocido de seguridad; tiene una serie de extensiones disponibles para su descarga en [KDE página de la tienda](https://store.falkon.org/browse/).
  - [Qutebrowser ](https://qutebrowser.org/)  un navegador web basado en Qt de código abierto (construido en `QtWebEngine`, una envoltura para [Google Chromium](https://www.chromium.org/Home/)) con un historial conocido de seguridad; tiene un enfoque único centrado en el teclado con minimalista GUI; es considerado como el navegador de elección para muchos especialistas en seguridad.

- Evitar la activación `JavaScript` a menos que sea necesario.

- Utilice el mecanismo de confinamiento integrado del navegador para los plugins para restringir los derechos de acceso que tienen los plugins instalados.

- Elimine las cookies antes y después de operaciones importantes. Tenga cuidado de no habilitar la función Manténgame conectado o Recuerda-me. Ten en cuenta que algunos sitios web tienen esta función activada por defecto.

- Utilice un bloqueador de anuncios. Estos no solo bloquean los anuncios, sino que también deshabilitan las funciones de seguimiento del sitio. Dependiendo del navegador que utilice, puede que el bloqueador de anuncios no sea una función integrada.

- Tenga en cuenta a los personajes similares (por ejemplo, `0`, `θ`, `O`, `О`, `ዐ` y `߀` Si prestas atención a detalles como este, puedes evitar un ataque de phishing.

- Evite los clientes de correo electrónico web UI a favor de los clientes de escritorio. Antes de utilizarlo, configure su cliente de correo electrónico de escritorio para firmar y verificar las firmas clave GPG.

- Evite usar servicios de mensajería basados en la web. Por ejemplo, Discord (construido con el infame `electron` framework) es susceptible a muchos de los mismos ataques que una ventana de Google Chromium con la versión web de Discord abierta.

- Actualizar su navegador a la última versión siempre que sea posible. Las actualizaciones a menudo incluyen parches críticos de seguridad que abordan las vulnerabilidades.

- Tenga cuidado con las extensiones de navegador que instale. Solo use extensiones conocidas y confiables de fuentes de buena reputación. Las extensiones infames pueden comprometer sus datos y privacidad.

- Crear perfiles de navegador separados para varias tareas. Utilice un perfil para la navegación cotidiana y otro para actividades que implican una alta seguridad y datos sensibles. De esta manera, las extensiones instaladas en el perfil para la navegar diaria no pueden acceder a los datos sensibles desde el seguro.

- Utilice una versión portátil de su navegador copiada a una unidad flash USB. Este método asegura que incluso si un error de seguridad otorga acceso a datos entre los perfiles a uno de los plugins instalados, su perfil relacionado con la seguridad permanece en un dispositivo separado y extraíble.

- Elimine periódicamente la caché y las cookies de su navegador para eliminar los datos potencialmente sensibles que pueden ser almacenados accidentalmente en su dispositivo.

## Plan de recuperación {#recovery-plan}

En caso de emergencia, como la pérdida de una llave o una violación de seguridad, un plan de recuperación bien estructurado y preparado con anticipación es una salvavidas esencial.

Las organizaciones deben tener en cuenta los siguientes aspectos clave al elaborar su plan de recuperación:

- Describir los procedimientos pasos a seguir en caso de pérdida de claves u otros incidentes de seguridad, y garantizar que estos pasos sean fácilmente accesibles y comprensibles para los usuarios y/o empleados.

- Establecer un canal de comunicación que pueda ser utilizado para informar rápidamente sobre infracciones a la seguridad y amenazas potenciales, como claves y contraseñas criptográficas filtradas o perdidas.

- Si utiliza claves de hardware (por ejemplo, [YubiKey](https://www.yubico.com/products/) o [ SoloKeys Solo](https://solokeys.com/collections/all)) como medida de seguridad, considere adoptar una estrategia de redundancia. Guarde dos llaves: una para uso diario y otra almacenada en un lugar seguro. Esta medida de precaución garantiza el acceso incluso si la clave primaria se ve comprometida o perdida.

- Cuando se informen de violaciones o filtraciones de seguridad, reaccione rápidamente reemplazando o desactivando las claves y contraseñas afectadas.

- Revisar y actualizar periódicamente su plan de recuperación, lo que garantiza que el plan siga siendo relevante y efectivo a medida que evoluciona su panorama de seguridad.

::: advertencia

Recuerde que un plan de recuperación no es sólo otro documento, sino más bien una línea de vida que ayuda a navegar por desafíos inesperados. reforzará su seguridad operativa y mejorará su preparación para responder eficazmente a cualquier incidente de seguridad.

:::
