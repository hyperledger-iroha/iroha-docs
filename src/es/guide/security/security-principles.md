---
translation_locale: es
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Principios de seguridad {#security-principles}

Las organizaciones y los usuarios individuales deben trabajar juntos para garantizar las interacciones seguras con las instalaciones Iroha.

## Principios generales de seguridad {#general-security-principles}

1. Utilizar una red privada virtual [ ](./vpn.md) (VPN):

    - Cuando acceda a datos o recursos sensibles, especialmente a través de redes públicas, utilice una <abbr title="Virtual Private Network">VPN</abbr> para establecer una conexión segura que proteja su información.

2. Utilizar un firewall para proteger la red:

    - Fortalecer las redes domésticas y/o de oficinas mediante la instalación de un firewall que ayuda a contrarrestar el acceso no autorizado y proteger los dispositivos conectados contra virus y malware.

3. Seguridad de la información física y digital:

    - Proteger los documentos físicos que contengan información sensible en una ubicación segura y garantizar que los documentos digitales estén cifrados y almacenados en carpetas protegidas por contraseñas.

4. Mantener una copia de seguridad regular de los datos:

    - Siempre tenga copias de su información importante guardadas en un lugar seguro. De esta manera, si pierde sus datos o algo sale mal, puede volver rápidamente a poner todo en marcha. Guarde estas copias de seguridad en un lugar diferente del que normalmente guarda sus datos.

## Principios de seguridad para usuarios individuales {#security-principles-for-individual-users}

1. Adoptar reglas de autenticación sólidas:

    - Utiliza contraseñas sólidas y únicas para todas las cuentas.

    - Nunca vuelva a usar las contraseñas.

    - Configure <abbr title="Two-Factor Authentication">2FA</abbr> siempre que sea posible. <abbr title="Two-Factor Authentication">2FA</abbr> mejora la seguridad general no solo al requerir una contraseña, sino también un factor adicional como un <abbr title="One-Time Password"> OTP </abbr>, huella digital o una autenticación basada en aplicaciones de terceros (por ejemplo, Google Authenticator).

    - Evite utilizar la autenticación SMS como segundo factor. No hay garantía de que el software malicioso no esté monitoreando todos sus mensajes SMS. Por ejemplo, las aplicaciones Android no pueden limitarse a acceder solo a los mensajes destinados específicamente para ellas.

2. - Configurar un cliente de correo electrónico para firmar y verificar las firmas de todos los correos electrónicos recibidos. Si bien es posible imitar la dirección del remitente e incluso hacerse pasar por un banco, no es posible falsificar una firma. - Deshabilitar los mensajes HTML y la carga de recursos externos a partir de direcciones desconocidas o no verificadas.

    - Conozca las técnicas de phishing comunes para reconocer y evitar correos electrónicos sospechosos, enlaces y solicitudes de información personal.

    - Configure un cliente de correo electrónico para firmar y verificar las firmas de todos los correos electrónicos recibidos. Aunque es posible fingir la dirección del remitente e incluso hacerse pasar por un banco, no es posible falsificar una firma.

3. La protección de la información personal:

    - Cuando hables con personas que no conoces, especialmente por teléfono o en Internet, ten cuidado de compartir información privada.

    - Considera investigar de forma independiente a las personas o organizaciones con las que te comunicas para confirmar la legitimidad de su identidad.

    - Tenga en cuenta la información personal que comparte en las redes sociales, ya que las partes maliciosas pueden explotar esta información.

## Principios de seguridad para las organizaciones {#security-principles-for-organisations}

1. Establecer políticas y procedimientos de seguridad claros:

    - Desarrollar políticas y protocolos de seguridad bien definidos para todos los empleados que tratan con datos sensibles, capacitar a los empleados para que se adhieran a estas directrices y mitigar el riesgo de acciones negligentes.

    - Asegurar que las políticas de seguridad sean accesibles para todos los empleados y se revisen y actualicen periódicamente para reflejar los cambios en el panorama de la seguridad.

    - Proporcionar a las políticas de seguridad ejemplos y escenarios para que sean más comprensibles y accesibles para los empleados.

2. Cultivar la conciencia de los empleados:

    - Educar a los empleados sobre la seguridad de datos y las medidas operativas.La mayor concienciación y una formación integral son fundamentales para fortalecer la seguridad organizacional.

    - Alentar a los empleados a denunciar sin demora cualquier actividad sospechosa o preocupación por la seguridad.

3. Proteger la infraestructura física:

    - Restringir el acceso físico a los servidores e infraestructuras. Establecer controles de acceso que permitan solo al personal autorizado entrar en áreas restringidas.

    - Asegurar que las medidas de control del acceso sean revisadas y actualizadas periódicamente para adaptarse a las necesidades de seguridad en constante evolución.

    - Considere la posibilidad de implementar controles de acceso biométricos para zonas sensibles con el fin de mejorar la seguridad física

4. Implementar el seguimiento de la seguridad:

    - Implementar un sistema integral de monitoreo de seguridad que examine las actividades e identifique posibles infracciones a la seguridad.

    - Implementar alertas automatizadas para notificar rápidamente al personal de seguridad sobre cualquier actividad inusual o no autorizada.

    - Considere utilizar algoritmos de aprendizaje automático para mejorar la capacidad del sistema para detectar anomalías y posibles amenazas.

    - Emplear personal o designar personal para supervisar la seguridad de la base de datos, identificar, rastrear y abordar las vulnerabilidades del software y realizar controles regulares en máquinas críticas para detectar la presencia de software no autorizado que no esté incluido en la lista aprobada.

5. Realizar auditorías de seguridad recurrentes:

    - Realizar auditorías de seguridad rutinarias para evaluar las vulnerabilidades y confirmar que las medidas de seguridad establecidas se ajustan a las normas y reglamentos comúnmente aceptados.

    - Considere contratar a expertos externos en seguridad para que realicen evaluaciones periódicas para obtener una evaluación imparcial de la condición de seguridad de su organización.

6. Implementar un sistema de control de acceso:

    - Establecer un sistema de control de acceso basado en el rol para garantizar que los empleados solo tengan acceso a los recursos e información necesarios para sus funciones.

7. Adopte la mejora continua:

    - Reconocer que la seguridad es un proceso continuo. Mantener una evaluación continua de las medidas de seguridad y mejorarlas proactivamente para hacer frente a las amenazas y desafíos emergentes.

    - Considere establecer un bucle de retroalimentación que aliente a los empleados a contribuir con sugerencias para mejorar la seguridad, fomentando la cultura del mejoramiento continuo.
