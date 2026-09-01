---
translation_locale: es
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ejemplo de activador de evento {#event-trigger-example}

Este ejemplo utiliza identificadores de cuenta canónicos sin dominio y definiciones de activos proyectadas en el modelo de datos Iroha 3.

Supongamos que una red tiene:

- un registro canónico controlado por la clave de Alice
- una cuenta canónica controlada por la clave de Mad Hatter
- una definición de activo proyectada como `tea` bajo `wonderland.universal`
- un saldo de ese activo mantenido por cada cuenta

El objetivo es registrar un disparador que observe el saldo de té de Alice y envíe una transferencia desde la cuenta Mad Hatter cuando se emita el evento de datos correspondiente.

## 1. Preparar cuentas y activos {#_1-prepare-accounts-and-assets}

Registre primero las cuentas participantes y la definición del activo. En el actual Iroha, los IDs de cuenta provienen de los controladores de cuenta, mientras que los dominios proyectados usan el formulario `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

La definición del activo todavía tiene una dirección opaca canónica. Almacene o consulte esa dirección después del registro y úsela en la acción del disparador.

## 2. Elija el principal de autorización del desencadenador {#_2-choose-the-trigger-authority}

Configure la cuenta técnica del desencadenador en una cuenta dedicada cuando sea posible. Una cuenta dedicada deja claro qué permisos se requieren para la ejecución del desencadenador y evita acoplar el desencadenador a la clave de firma personal de un operador.

La cuenta técnica ya debe existir y debe tener permiso para enviar las instrucciones en el ejecutable del disparador.

## 3. Define el ejecutable {#_3-define-the-executable}

El ejecutable es la secuencia de instrucciones que el activador envía cuando el filtro de eventos coincide. Para este ejemplo, contiene una transferencia:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Utilice los constructores tipados actuales de SDK para la carga útil final de la transacción. Evite codificar manualmente IDs textuales antiguos en el código del disparador; analice o consulte los IDs canónicos antes de construir el ejecutable.

## 4. Definir el filtro de eventos {#_4-define-the-event-filter}

Utiliza un filtro de data-event que limite los eventos al objeto que te interesa:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Mantenga los filtros tan específicos como sea práctico. Un filtro `AcceptAll` es útil para depuración, pero hace que cada evento que coincida pague el costo de la evaluación del disparador.

## 5. Registrar el disparador {#_5-register-the-trigger}

Registre el disparador con:

- un establo `TriggerId`
- la secuencia de instrucciones ejecutables
- `Repeats::Indefinitely` o `Repeats::Exactly(n)`
- la cuenta técnica
- el filtro de eventos
- metadatos opcionales

El registro de disparadores en sí es una transacción normal, por lo que la cuenta que registra necesita permiso para registrar disparadores. La cuenta técnica necesita los permisos requeridos por el ejecutable del disparador.

## Orden de ejecución {#execution-order}

Cuando un bloque se ejecuta:

1. Las instrucciones de transacción normales se ejecutan primero.
2. Los eventos de datos producidos por esas instrucciones son recopilados.
3. Se programan los desencadenadores cuyos filtros coinciden con esos eventos.
4. Los efectos producidos por triggers se manejan en la canalización de procesamiento de ejecución de bloques sin permitir una ejecución recursiva ilimitada de triggers.

Si un disparador usa `Repeats::Exactly(n)`, registre un nuevo disparador cuando se agote el conteo y se necesite el mismo comportamiento nuevamente.
