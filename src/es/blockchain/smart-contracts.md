---
translation_locale: es
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los contratos inteligentes {#smart-contracts}


Las transacciones Iroha ejecutan cargas útiles `Executable`. El modelo de datos actual soporta:

- `Executable::Instructions`: un conjunto ordenado de instrucciones especiales de Iroha
- `Executable::ContractCall`: una llamada de referencia indirecta a una instancia de contrato desplegada
- `Executable::Ivm`: Código de byte Iroha VM
- `Executable::IvmProved`: Código de byte Iroha VM con una superposición precomputada de instrucciones y compromisos de prueba

Kotodama es Iroha Es el lenguaje de alto nivel del contrato inteligente. `.ko` el archivo de origen compila a determinista IVM el código byte, almacenado convencionalmente como un `.to` artefacto para su despliegue. Kotodama objetivos IVM No tiene como objetivo: RISC-V o WebAssembly.

El primer lanzamiento sólo admite la versión ABI. La política de syscall y pointer-ABI es un contrato V1 incondicional ejecutado por admisión y ejecución; no hay modo de tiempo de ejecución alternativo.

## Cuándo usar los contratos inteligentes {#when-to-use-smart-contracts}

Utilice las instrucciones normales cuando la transacción pueda expresarse directamente:

- objetos de registro o no registrados
- activos de menta, quemadura o transferencia
- actualización de metadatos
- otorgar o revocar permisos
- ejecutar un gatillo
- fija los parámetros en la cadena

Utilizar un contrato inteligente cuando la transacción necesita lógica empaquetada que es incómodo expresar como una secuencia de instrucciones estática, o cuando se debe llamar por referencia a una instancia de contrato desplegado.

## IVM Ejecutables {#ivm-executables}

`Executable::Ivm` lleva crudo IVM Los nodos ejecutan ese código en el interior de los límites de tiempo de ejecución configurados para la cadena. Mantenga el código de byte pequeño y determinista; los contratos son parte de la ejecución de las transacciones y, por lo tanto, afectan al consenso.

`Executable::IvmProved` está destinado a los flujos de prueba que transportan:

- Código de byte IVM
- una superposición de instrucciones deterministas
- un compromiso de ejecución-eventos
- un compromiso en materia de política energética

La prueba une la superposición al bytecode ejecutado. Dependiendo de la política de tubería, los validadores pueden verificar la ejecución de la prueba y reproducirla como una verificación adicional de seguridad.

## Llamadas de contrato desplegadas {#deployed-contract-calls}

`Executable::ContractCall` invoca una instancia de contrato desplegada por dirección. Utilice esto cuando el código del contrato está registrado por separado y las transacciones deben llamarlo por referencia en lugar de llevar el código byte cada vez.

## Ciclo de vida y propiedad del contrato {#contract-lifecycle-and-ownership}

Cada dirección desplegada conserva un registro `ContractLifecycleControlV1`, incluso mientras el contrato esté inactivo. El registro contiene la procedencia inmutable del primer despliegue, el propietario actual y pendiente, cualquier delegación del Parlamento que pueda ser revocada, el hash de código activo, una revisión de comparación y intercambio no cero, Un despliegue directo registra la cuenta de implementación. Un despliego del Parlamento registra su proponente, contenido de propuesta ID y intento exitoso de gobernanza ID.

El titular del ciclo de vida es una cuenta o el Parlamento.Los cambios en la propiedad de la cuenta utilizan una oferta y aceptación separadas; la aceptación de una oferta libera a cualquier delegación parlamentaria. Un titular de cuenta puede permitir al Parlamento activar o desactivar el contrato, y luego revocar esa delegación, pero la delegación nunca permite que el Parlamento transfiera la propiedad.

Las instrucciones en bruto `ActivateContractInstance` y `DeactivateContractInstance` solo están disponibles para el titular de la cuenta corriente. Deben llevar el registro exacto `expected_revision`; El tiempo de ejecución rechaza las revisiones obsoletas o cero. La activación en bruto no puede crear un registro del ciclo de vida, y valida el artefacto registrado, el manifiesto y ABI antes de cambiar `active_code_hash`. Desactivación Cada transición exitosa del ciclo de vida avanza en la revisión y emite el estado post completo.

La activación también puede realizarse en un gancho del ciclo de vida declarado por el manifiesto. Una primera activación cuyo manifiesto contiene un punto de entrada `EntryPointKind::Hajimari` (`hajimari`/`始まり`) etapas `Hajimari`. Reincorporar una dirección activa a un código cuyo manifiesto contiene un punto de entrada `EntryPointKind::Kaizen` (`kaizen`/`改善`) etapas `Kaizen`. El vínculo cambia inmediatamente, Pero el contrato no está listo: todas las llamadas `Kotoage` y `View` son rechazadas hasta que el gancho en etapa exacta tenga éxito.

Invocar el gancho en escena con `Executable::ContractCall` en la misma dirección del contrato y el nuevo código hash, utilizando la exacta `hajimari` o `kaizen` El punto de entrada y los argumentos declarados en su manifiesto. `CanInvokeContractEntrypoint` El marcador pendiente contiene un marcador determinista generado por el tiempo de ejecución `transition_id` y el nuevo `code_hash`; de un `Kaizen` el marcador también contiene `previous_code_hash`. Los clientes no calculan ni envían `transition_id`. Un gancho exitoso consume el marcador de forma atómica, mientras que un gancho fallido lo deja pendiente para un retraso posterior.

Una propuesta del Parlamento de nivel de emergencia puede imponer una retención para un máximo de 3.600 bloques cuando se une a la revisión actual, el hash de código y un índice de incidentes no cero. Una acción certificada `CompleteEmergencyHoldRetrospective` debe vincular posteriormente la retención exacta IDs y digerir más una raíz de hallazgo no cero antes de que se elimine el registro; no puede imponerse otra retención mientras ese retrospectivo permanezca pendiente.

Cuando la aplicación API esté habilitada, lea el estado retenido con `GET /v1/gov/contracts/{contract_address}`. Su campo `found` significa que existe un registro del ciclo de vida, no que la dirección tenga actualmente código activo.

## Orientación de las operaciones {#operational-guidance}

- Mantenga los contratos deterministas. El comportamiento de los contratos no debe depender del tiempo local del reloj de la pared, el estado del sistema de archivos host, las llamadas a la red u otras entradas peer-local.
- Mantener las cargas útiles compactas. Un código de byte grande aumenta el tamaño de la transacción y el costo de propagación del bloque.
- Prefieren las instrucciones mecanografiadas para cambios simples en el libro mayor. Son más fáciles de auditar y más baratos de ejecutar.
- Tratar la actualización de contratos y los permisos de registro como controles operativos de alto riesgo.

Véase también:

- [Las instrucciones ](/es/blockchain/instructions.md)
- [Los desencadenantes ](/es/blockchain/triggers.md)
- [Las autorizaciones ](/es/blockchain/permissions.md)
- [Esquema de modelo de datos ](/es/reference/data-model-schema.md)
