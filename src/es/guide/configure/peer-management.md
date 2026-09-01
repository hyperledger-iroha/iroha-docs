---
translation_locale: es
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Gestión de pares de red {#peer-management}

Si seguiste alguna de las guías específicas de cada idioma, ahora tienes una red bien funcional a la que la gente querrá unirse.

## Cadena de bloques pública {#public-blockchain}

En una red abierta, la admisión de pares de red sigue siendo una decisión de la política de la cadena. Un nodo puede ejecutar el software correcto y conectarse a Torii, pero solo participa en el consenso después de que la red admita su identidad de par de red.

## Blockchain Privada {#private-blockchain}

En un entorno bancario, permitir que todos se unan a su antojo es un riesgo de seguridad. Por seguridad, las implementaciones privadas de Iroha suelen fijar la topología de los pares de la red en la configuración y en el génesis de la blockchain en lugar de depender del descubrimiento abierto.

### Registrando pares de red {#registering-peers}

Para agregar un par de red a la red, debe registrarse manualmente. Discutamos los pasos que se deben seguir para completar este proceso.

#### 1. Conceder permisos al usuario {#_1-grant-the-user-permissions}

La cuenta que registra el par de la red debe tener el `Permission` apropiado. Esto se puede otorgar a través de un `Role` o como una concesión de permiso directa.

Otorgue un rol cuando una cuenta administrará pares de red con el tiempo. Use una concesión de permiso directa para un registro único por parte de una cuenta que de otro modo no administra pares de red.

::: info

El ejecutor predeterminado utiliza el token de permiso `CanManagePeers` para registrar y cancelar el registro de los pares de red.

:::

Discutimos permisos y roles con más detalle en un [capítulo separado](/es/blockchain/permissions.md).

#### 2. Configurar un par de red {#_2-set-up-a-peer}

Después de que a un nuevo par de red se le concedieron permisos, debe ser configurado.

Solicite la configuración actual de los pares de red antes de admitir un nodo. Torii expone el parámetro del nodo y la capacidad API de los puntos de enlace con este propósito. El arranque de pares de la red no negocia automáticamente estos valores: los operadores deben verificar que los tiempos de espera, los tamaños de lote y otros ajustes relevantes para el consenso coincidan con la red.

Para simplificar el proceso, puedes pedirle al administrador de la red una versión redactada de `config.toml`, que excluye información privilegiada, como las claves privadas de los pares de la red.

#### 3. Enviar la instrucción {#_3-submit-the-instruction}

Después de que su par de red esté en funcionamiento, debe enviar la instrucción de registrar par. El par de red pasará por el proceso de saludo y comenzará a comunicarse con la red.

::: tip

Enviar una instrucción de registro de un par de red no (y no puede) instanciar un nuevo proceso de par de red.

:::

### Anulando el registro de los pares de red {#unregistering-peers}

¿Qué pasa con la anulación del registro de los pares de red? Por razones de seguridad, este proceso es unilateral. La red llega a un consenso de que quiere eliminar a un par de red, pero el propio par de red no sabe mucho sobre por qué nadie le está hablando.

En la mayoría de las circunstancias, si quieres cancelar el registro de un par de red, deseas hacerlo porque es una falla bizantina. Simplemente "ignorar" a este par de red hace la vida del actor malicioso en la red más difícil.
