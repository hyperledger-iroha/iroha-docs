---
translation_locale: es
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ejemplo de desencadenante del evento {#event-trigger-example}

En este ejemplo se utilizan cuentas canónicas sin dominios IDs y definiciones de activos proyectadas en el modelo de datos Iroha 3.

Supongamos que una red tiene:

- Una cuenta canónica controlada por la llave de Alice.
- Una cuenta canónica controlada por la llave del Sombrero Loco.
- Una definición de activo proyectada como `tea` bajo `wonderland.universal`
- un saldo de ese activo en cada cuenta

El objetivo es registrar un gatillo que observe el saldo de té de Alice y envíe una transferencia desde la cuenta Mad Hatter cuando se emita el evento de datos correspondientes.

## 1. Preparar cuentas y activos {#_1-prepare-accounts-and-assets}

Registrar primero las cuentas participantes y la definición de activos. En el Iroha actual, la cuenta IDs proviene de los controladores de cuentas, mientras que los dominios proyectados utilizan el formulario `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

La definición de activo todavía tiene una dirección opaca canónica. Almacenar o consultar esa dirección después del registro y usarla en la acción de activación.

## 2. Elegir la autoridad de activación {#_2-choose-the-trigger-authority}

Configurar la cuenta técnica del gatillo a una cuenta dedicada cuando sea posible. Una cuenta dedicada deja claro qué permisos se requieren para la ejecución del gatillo y evita acoplar el gatillo a la clave de firma personal de un operador.

La cuenta técnica debe ya existir y tener permiso para presentar las instrucciones en el ejecutable del activador.

## 3. Definir el ejecutable {#_3-define-the-executable}

El ejecutable es la secuencia de instrucciones que el gatillo envía cuando el filtro de eventos coincide. Para este ejemplo, contiene una transferencia:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Utilice los constructores de tipografía actual del SDK para la carga útil final de la transacción. Evite codificar en formato duro el viejo texto IDs en código desencadenante; analizar o consultar canónico IDs antes de construir el ejecutable.

## 4. Definir el filtro de eventos {#_4-define-the-event-filter}

Utilice un filtro de eventos de datos que restringe los eventos al objeto que le importa:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Mantenga los filtros tan específicos como prácticos. Un filtro `AcceptAll` es útil para la depuración, pero hace que cada evento de coincidencia pague el costo de la evaluación del desencadenante.

## 5. Registrar el gatillo {#_5-register-the-trigger}

Registre el gatillo con:

- un establo `TriggerId`
- la secuencia de instrucciones ejecutables
- `Repeats::Indefinitely` o `Repeats::Exactly(n)`
- la cuenta técnica
- el filtro de eventos
- metadatos opcionales

El registro del desencadenante en sí es una transacción normal, por lo que la cuenta de registro necesita permiso para registrar los desencadenantes.

## Orden de ejecución {#execution-order}

Cuando se ejecuta un bloque:

1. Las instrucciones normales de la transacción se ejecutan primero.
2. Se recopilan los datos de eventos producidos por dichas instrucciones.
3. Los desencadenantes cuyos filtros coinciden con esos eventos están programados.
4. Los efectos producidos por el gatillo se manejan en la tubería de ejecución del bloque sin permitir una ejecución sin límites del gatillo recursivo.

Si un gatillo utiliza `Repeats::Exactly(n)`, registre un nuevo gatillo cuando el recuento esté agotado y se requiere el mismo comportamiento.
