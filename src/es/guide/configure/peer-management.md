---
translation_locale: es
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Gestión entre pares {#peer-management}

Si has seguido cualquiera de las guías específicas del idioma, ahora tienes una red que funciona bien y a la que la gente querrá unirse.

## Blockchain pública {#public-blockchain}

En una red abierta, la admisión de pares sigue siendo una decisión de política de cadena. Un nodo puede ejecutar el software correcto y conectarse a Torii, pero sólo participa en el consenso después de que la red admita su identidad de pares.

## Blockchain privada {#private-blockchain}

En un entorno bancario, permitir que todos se unan a su tiempo libre es un riesgo de seguridad. Iroha Los despliegues suelen fijar la topología de pares en configuración y génesis en lugar de confiar en el descubrimiento abierto.

### Registro de pares {#registering-peers}

Para agregar un peer a la red, debe registrarse manualmente. Discutamos los pasos que se deben tomar para completar este proceso.

#### 1. Conceder a los usuarios permisos {#_1-grant-the-user-permissions}

La cuenta que registre a los pares debe tener el correspondiente `Permission`. Esto puede concederse mediante un `Role` o como una concesión directa de permiso.

Conceda un papel cuando una cuenta administrará a los pares con el tiempo. Utilice un permiso directo para un registro único por parte de una cuenta que no gestiona a los compañeros de otro modo.

::: info

El ejecutor predeterminado utiliza el token de permisos `CanManagePeers` para registrar y no registrar pares.

:::

Discutiremos los permisos y roles con más detalle en un capítulo separado [ ](/es/blockchain/permissions.md).

#### 2. Establecer una pareja {#_2-set-up-a-peer}

Una vez que se haya otorgado permisos a un nuevo compañero, debe establecerse.

Requerir la configuración de pares actual antes de admitir un nodo. Torii expone el parámetro del nodo y los puntos finales de capacidad para este propósito. Peer bootstrap no negocian estos valores automáticamente: los operadores deberán verificar que las temporadas, los tamaños de lotes y otros ajustes pertinentes para el consenso coinciden con la red.

Para simplificar el proceso, puede pedirle al administrador de la red una versión editada de `config.toml`, que excluye información privilegiada, como las claves privadas de pares.

#### 3. Presentar la instrucción {#_3-submit-the-instruction}

Después de que su compañero esté ejecutando, debe enviar la instrucción para registrar. El compañero pasará por el proceso de apretón de manos y comenzará a charlar con la red.

::: tip

El envío de una instrucción de registro entre pares no (y no puede) iniciar un nuevo proceso entre pares.

:::

### Los pares no registrados {#unregistering-peers}

Por razones de seguridad, este proceso es unilateral. La red llega al consenso de que quiere eliminar a un compañero, pero el mismo compañero no sabe mucho sobre por qué nadie está hablando con él.

En la mayoría de las circunstancias, si quieres cancelar el registro de una pareja, debes hacerlo porque es un error bizantino. Simplemente "fantasmas" de este compañero hace la vida del actor malicioso en la red más difícil.
