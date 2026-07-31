---
translation_locale: es
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Seguridad de contraseñas {#password-security}

En el ámbito de la seguridad blockchain, proteger las contraseñas es primordial. Para asegurar que sus datos y todo lo que representan permanezcan impermeables a acceso no autorizado, profundicemos en los matices de la seguridad de contraseñas.

## La fuerza de las contraseñas {#password-strength}

Es muy probable que haya encontrado previamente recomendaciones sobre cómo crear una contraseña fuerte. Estas pueden implicar consejos tales como la longitud mínima de la contraseña, adición de caracteres especiales, etc. Tales recomendaciones tienen por objeto aumentar la fuerza de su contraseña que depende de la entropía, es decir, al azar de la contraseña.

Una contraseña fuerte es una contraseña con alta entropía.

Para calcular la entropía de una contraseña, podemos seguir la fórmula Entropy:

::: tip Fórmula de entropía

$L$  Duración de contraseña; número de símbolos en la contraseña.\ $S$  Conjunto de caracteres; tamaño del grupo de símbolos únicos posibles.\ $S^L$  Número de combinaciones posibles.

$$Entropy=log_2(S^L)$$

El número resultante es la cantidad de bits de entropía en una contraseña. Cuanto mayor sea el número, más difícil será romperla.

Conociendo el valor de entropía, se puede derivar la cantidad de intentos necesarios para forzar una contraseña con dicha entropía utilizando la siguiente fórmula:

$$S^L=2^Entropy$$

Para las organizaciones financieras, se aconseja mantener la entropía de sus contraseñas en el rango de `64` a `127` bits (`128` bits o más generalmente se considera un exceso). Sin embargo, tenga en cuenta que los <abbr title="Graphics Processing Unit">GPU</abbr> continúan evolucionando constantemente, y el tiempo requerido para la fisura de contraseñas sigue disminuyendo con el tiempo.

:::

Siguiendo la fórmula de entropía, comparemos los siguientes dos ejemplos:

  1. Una contraseña de 16 caracteres con el conjunto de caracteres utilizando solo letras pequeñas del alfabeto inglés moderno (26 caracteres) da aproximadamente 43 sextillion ($43*10^21$) combinaciones posibles.

$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. Una contraseña de 16 caracteres con el conjunto de caracteres ampliado a 96, incluidas las letras mayúsculas y los símbolos especiales, infla el número de combinaciones posibles a un asombroso 52 no millones ($52*10^30$), mejorando significativamente la entropía.

$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Como se puede ver, incluso ampliando sólo el conjunto de caracteres de 26 a 96 símbolos, el número de combinaciones posibles que una parte maliciosa necesitaría para bruteforce se ha expandido en $1.1933*10^9$ veces.

Además de aumentar la longitud de la contraseña, aumentará aún más el número de combinaciones posibles, mejorando por lo tanto la entropía  fuerza de la contraseñas.

Sin embargo, en lugar de luchar con las complejidades, recomendamos usar un programa de gestión de contraseñas como [KeePassXC](https://keepassxc.org/) (para más detalles, vea [ Agregar un Programa de Gestión de Contraseñas ](./storing-cryptographic-keys.md#adding-a-password-manager-program) y [Configurar KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc))  para generar y almacenar sus contraseñas de manera segura.

::: propina

Algunos sitios web limitan la entropía máxima posible de las contraseñas, es decir, o bien limitan la longitud máxima de la contraseña o el conjunto de caracteres aceptados, o ambas.

Tenga esto en cuenta cuando utilice estos sitios web y tenga como objetivo actualizar periódicamente sus contraseñas.

:::

## Las vulnerabilidades de las contraseñas {#password-vulnerabilities}

Las contraseñas pueden ser víctimas de ataques de fuerza bruta, por lo general ejecutados usando poderosos GPUs en conjunto con diccionarios o una iteración exhaustiva a través de todas las posibilidades. Para evitar tales intentos, crea una contraseña única sin información personal como cumpleaños, direcciones, números de teléfono o números de seguridad social.

¿Qué tan difícil es descifrar una contraseña moderna? Depende de a quién le preguntes.

Con una configuración como [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)¿ Qué es ? [configuración del grupo](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) alojamiento 24 NVIDIA® GeForce RTX 4090 y 6 NVIDIA® GeForce RTX 2080s, todos ellos corriendo [Hachtopolis](https://github.com/hashtopolis) software, solía descifrar contraseñas que debían tomar un año en tan sólo medio mes.

Sin embargo, ahora comparémoslo con un solo RTX 4090, capaz de procesar a través de 300 <abbr title="Hashes per second">H/s</abbr> usando [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) y 200 <abbr title="Hashes per second">H/s </abbr> utilizando [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), como se describe en [ este tuit ](https://twitter.com/Chick3nman512/status/1580712040179826688)

Como una extensión de nuestros cálculos anteriores de entropía, examinemos ahora los siguientes tiempos de craqueo proyectados:

  1. Hay $31,540,000$ segundos en un año ordinario no bisiesto. Suponiendo que el peor escenario con `NTLM`, a la velocidad de $300*10^9$ <abbr title="Hashes per second">H/s </abbr>, Se necesitaría un solo RTX 4090 aproximadamente $4,608.83$ años para descifrar una contraseña de 16 caracteres con un conjunto de 26 letras del alfabeto inglés moderno.

  2. Si en lugar de `NTLM` usamos `bcrypt`, reduciendo por lo tanto la velocidad de iteración a $200*10^3$ <abbr title="Hashes per second">H/s</abbr>, al mismo tiempo que ampliamos el conjunto de caracteres a 96, incluidas las letras mayúsculas y los símbolos especiales, el tiempo para romper se eleva a aproximadamente $8,249,887,835,549,662,270.456$ años. superando con creces la edad del universo.

Por lo tanto, simplemente seleccionando una entropía más alta aumentó el tiempo que se tarda en descifrar una contraseña a números insondables. Sí, el proceso puede acelerarse mediante el uso de múltiples GPUs, sin embargo este método palidece en comparación con el enfoque [XKCD](https://xkcd.com/538/).

Es importante tener en cuenta que un conjunto extenso de caracteres no siempre es necesario para alcanzar una alta entropía. Se puede obtener mediante el uso de contraseñas de varias palabras, o frases largas en particular. El clásico [XKCD cómic ](https://xkcd.com/936/) ilustra este concepto elocuentemente.

::: advertencia

Evite escribir su contraseña en cualquier lugar. Guarde su frase de recuperación de contraseñas de forma segura. Si la frase es demasiado larga, puede escribirla, asegurándose de que pueda leerla y escribirla más tarde. Guarde la copia física de la frase en un lugar seguro y/o contenedor.

:::
