---
translation_locale: es
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 79410ebb9d0a18072d5ae2288348082390b622ed81225de79dcbd4000e268e51
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Patrocinar comisiones de un espacio de datos privado {#sponsor-fees-for-a-private-data-space}

Un programa de patrocinio de comisiones de SORA Nexus puede pagar las comisiones de ejecución global de las transacciones elegibles que se enruten a un espacio de datos privado. El usuario sigue firmando la transacción completa. Su `FeePaymentIntent` tipado selecciona un programa de patrocinio exacto y una revisión inmutable, un límite de gas cuando sea necesario y los cargos máximos.

Una entrada del catálogo de espacios de datos no crea una raíz firmada de forma independiente. Una raíz independiente de espacio de datos tiene su propia moneda de comisiones y política confirmadas en el estado; las bóvedas de patrocinio públicas no pueden autorizar las comisiones de esa raíz privada. Determine la raíz de ejecución antes de diseñar el patrocinio.

## 1. Establecer la política de comisiones confirmada en el estado {#_1-establish-the-committed-fee-policy}

El génesis firmado define un único parámetro personalizado `root_fees_v1` que contiene `RootFeePolicy`. Vincula la moneda de comisiones, su destino, la cuenta de custodia del patrocinador, las exenciones de reclamaciones y las tarifas. Cada bloque ordinario y cada cotización utilizan la política confirmada capturada para ellos. Las actualizaciones autorizadas de la política se aplican a partir del siguiente bloque.

Para la ejecución global, la comisión nativa quema la moneda XOR exacta de la red firmada. La bóveda del programa del patrocinador suministra esa moneda. Los ajustes del nodo y los metadatos de la transacción no seleccionan un pagador ni activan el patrocinio.

Utilice las identidades canónicas de moneda y cuentas de la red. La resolución de alias no debe redirigir las identidades de moneda, custodia o destino de comisiones confirmadas en el estado.

## 2. Crear un programa de patrocinio y dotarlo de fondos {#_2-create-and-fund-a-sponsor-program}

El ID del programa tiene la forma `<canonical-sponsor-account>/<program-name>`. Créelo mediante las instrucciones tipadas que exponen el SDK y el modelo de datos actuales:

|Instrucción|Propósito|
| --- | --- |
| `CreateFeeSponsorProgram` | Crear el programa en preparación con su cuenta de desembolso obligatoria. |
| `StageFeeSponsorProgramRevision` | Definir una política inmutable de elegibilidad, operaciones y presupuesto. |
| `EnrollFeeSponsorBeneficiary` | Registrar en cadena un beneficiario elegible. |
| `FundFeeSponsorProgram` | Transferir activos a custodia y abonar la bóveda exacta del programa. |
| `ActivateFeeSponsorProgramRevision` | Programar la primera altura de activación posible de la revisión preparada. |

El patrocinador o un administrador delegado concreto autoriza la administración del programa. Las retiradas requieren al propio patrocinador y devuelven fondos únicamente a la cuenta de desembolso registrada del programa, mientras este está en pausa o en proceso de cierre.

Cada revisión especifica:

- inscripción explícita, o inscripción junto con la elegibilidad predeterminada de ruta permitida;
- reglas de autorización y denegación sobre los IDs exactos del formato de transmisión de instrucciones nativas, o sobre direcciones de contrato, hashes de código y puntos de entrada;
- límites por activo para cada transacción, bloque, época del programa y época del beneficiario;
- un mínimo de reserva y una duración determinista de las épocas.

Una regla de denegación prevalece sobre una de autorización. El `fee_sponsor_program_id` de un espacio de datos otorga elegibilidad predeterminada de ruta solo si la revisión activa lo permite; la transacción debe seguir indicando el programa y la revisión exactos. La activación puede posponerse hasta que caduquen las asignaciones pendientes de la revisión anterior.

Los activos de la bóveda del patrocinador deben utilizar la política de saldo `Global`. Ingresar fondos únicamente en la cuenta ordinaria del patrocinador no dota de fondos a la bóveda aislada del programa, y un programa no puede consumir el saldo de otro.

## 3. Cotizar, firmar y enviar la transacción exacta {#_3-quote-sign-and-submit-the-exact-transaction}

Una integración con el SDK realiza estos pasos:

1. Construya el `TransactionPayload` sin firmar con la autoridad, el ejecutable, las marcas de tiempo, el nonce, los metadatos, la revisión exacta del programa de patrocinio y cualquier límite de gas necesario. Los cargos máximos pueden estar vacíos inicialmente.
2. Firme con la cuenta la solicitud `POST /v1/fees/quote` con `{"payload": <payload>}`. El firmante de la solicitud debe ser la autoridad de la transacción.
3. Inspeccione la altura observada, la ruta resuelta del espacio de datos, los componentes de la comisión, el origen del débito y la capacidad del patrocinador. Verifique que la respuesta conserve el pagador, la revisión y el límite de gas seleccionados.
4. Sustituya únicamente `payload.fee_payment` por la intención recomendada; después, firme y envíe esa carga útil exacta.
5. Siga la transacción hasta alcanzar la finalidad `Applied` resuelta por el estado y conserve su recibo, incluidos el programa de patrocinio, la revisión y el cargo efectivamente utilizados.

Una cotización observa el libro mayor; no reserva capacidad. La admisión en cola vuelve a comprobar la elegibilidad y reserva los máximos firmados. Un rechazo del patrocinador rechaza la transacción sin recurrir a cobrar al usuario.

La CLI indica explícitamente la misma fuente de comisiones. Por ejemplo, una vez que el programa permita esta transferencia exacta de activos y que la cuenta sea elegible:

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Utilice la revisión activa y los identificadores exactos de su red. La configuración del usuario contiene únicamente el firmante de ese usuario; no se necesita la clave privada del patrocinador para enviar una transacción patrocinada elegible.

## 4. Decidir si el usuario paga una comisión de la aplicación {#_4-decide-whether-the-user-pays-an-application-fee}

Un patrocinador puede cubrir las comisiones globales mientras la aplicación no cobra nada al usuario. Si la aplicación cobra un token local, defina explícitamente esa transferencia o regla de contrato en el ejecutable firmado del usuario. Incluya cada operación en la política de la revisión del patrocinador e inspeccione la cotización de la carga útil completa. No deduzca una transferencia de tokens de la aplicación a partir de la intención de comisión de red.

## Diagnosticar un rechazo {#diagnose-a-refusal}

Utilice el código estable de comisiones y los detalles de corrección devueltos por el nodo:

|Código|Revisar|
| --- | --- |
| `program_not_found` | Identidad canónica exacta del programa. |
| `revision_not_active`, `program_not_active` | Activación de la revisión y ciclo de vida del programa. |
| `beneficiary_not_eligible` | Inscripción o elegibilidad predeterminada de ruta permitida. |
| `operation_not_allowed`, `operation_denied` | Cada operación firmada exacta y cada regla de denegación. |
| `invalid_gas_limit`, `signed_limit_exceeded` | Límite de gas y máximos firmados frente a una cotización reciente. |
| `vault_insufficient` | Saldo disponible en la bóveda de la moneda exacta de este programa. |
| Códigos de agotamiento del presupuesto | Capacidad de transacción, bloque, época del programa y época del beneficiario. |

Conserve el hash original de la transacción y los detalles del rechazo de comisiones al investigar un envío ambiguo. Confirme su estado antes de preparar una transacción de reemplazo.

## Fuentes fijadas {#pinned-sources}

- [Política de comisiones, ciclo de vida del programa y protocolo de cotización](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Instrucciones tipadas de los programas de patrocinio](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [Indicadores de fuente de comisiones de la CLI y transferencia de activos](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Configuración del espacio de datos](/es/get-started/sora-nexus-dataspaces.md)
