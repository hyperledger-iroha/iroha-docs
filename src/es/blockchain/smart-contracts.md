---
translation_locale: es
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Contratos Inteligentes {#smart-contracts}

Iroha las transacciones ejecutan `Executable` cargas útiles. El modelo de datos actual soporta:

- `Executable::Instructions`: un conjunto ordenado de operaciones de instrucción Iroha
- `Executable::ContractCall`: una llamada por referencia a una instancia de contrato implementada
- `Executable::Ivm`: Iroha VM código byte
- `Executable::IvmProved`: Iroha VM código byte con una superposición de instrucciones precomputada y compromisos de prueba

Kotodama es el lenguaje de contratos inteligentes de alto nivel de Iroha. Un archivo fuente `.ko` se compila en bytecode IVM determinista, almacenado convencionalmente como un artefacto `.to` para su implementación. Kotodama tiene como objetivo únicamente IVM. No tiene como objetivo RISC-V ni WebAssembly.

La primera versión solo admite la versión 1 de ABI. La política de syscall y puntero-ABI es un contrato V1 incondicional aplicado por admisión y ejecución; no existe un modo alternativo de ejecución de software.

## Cuándo usar contratos inteligentes {#when-to-use-smart-contracts}

Utilice instrucciones normales cuando la transacción pueda expresarse directamente:

- registrar o cancelar el registro de objetos
- emitir, quemar o transferir activos
- actualizar metadatos
- conceder o revocar permisos
- ejecutar un desencadenador
- establecer parámetros en cadena

Usa un contrato inteligente cuando la transacción necesite lógica empaquetada que sea difícil de expresar como una secuencia de instrucciones estáticas, o cuando deba llamarse por referencia a una instancia de contrato desplegada.

## IVM Ejecutables {#ivm-executables}

`Executable::Ivm` contiene bytecode crudo IVM. Los nodos ejecutan ese bytecode dentro de los límites del tiempo de ejecución de software configurados para la cadena. Mantenga el bytecode pequeño y determinista; los contratos son parte de la ejecución de transacciones y, por lo tanto, afectan al consenso.

`Executable::IvmProved` está destinado a flujos que llevan prueba. Transporta:

- IVM código byte
- una superposición de instrucciones determinista
- un compromiso de eventos de ejecución
- un compromiso de política de gas

La prueba vincula la superposición con el bytecode ejecutado. Dependiendo de la política de la cadena de procesamiento, los validadores pueden verificar la prueba y reproducir la ejecución como una verificación de seguridad adicional.

## Llamadas a Contratos Desplegados {#deployed-contract-calls}

`Executable::ContractCall` invoca una instancia de contrato desplegado por dirección. Úselo cuando el código del contrato esté registrado por separado y las transacciones deban llamarlo por referencia en lugar de llevar el bytecode cada vez.

## Ciclo de vida y propiedad del contrato {#contract-lifecycle-and-ownership}

Cada dirección desplegada conserva un registro `ContractLifecycleControlV1`, incluso mientras el contrato está inactivo. El registro contiene la procedencia inmutable del primer despliegue, el propietario actual y pendiente, cualquier delegación revocable del Parlamento, el hash criptográfico del código activo, una revisión de comparar y cambiar distinta de cero, y cualquier retención de emergencia mantenida. Un despliegue directo registra la cuenta que realiza el despliegue. Un despliegue del Parlamento registra su proponente, la ID del contenido de la propuesta y la ID del intento de gobernanza exitoso.

El propietario del ciclo de vida es una cuenta o el Parlamento. Los cambios de propiedad de la cuenta utilizan una oferta y aceptación separadas; aceptar una oferta elimina cualquier delegación del Parlamento. Un titular de cuenta puede permitir que el Parlamento active o desactive el contrato, luego revocar esa delegación, pero la delegación nunca permite que el Parlamento transfiera la propiedad. Los cambios propiedad del Parlamento y la aceptación del Parlamento se llevan a cabo a través de efectos de gobernanza certificados.

Las instrucciones en bruto `ActivateContractInstance` y `DeactivateContractInstance` están disponibles solo para el propietario actual de la cuenta. Deben contener el `expected_revision` exacto del registro; las revisiones obsoletas o nulas fallan al cerrarse. La activación en bruto no puede crear un registro de ciclo de vida y valida el artefacto registrado, el manifiesto técnico y ABI antes de cambiar `active_code_hash`. La desactivación borra el hash criptográfico del código activo pero conserva la propiedad y la procedencia. Cada transición de ciclo de vida exitosa avanza la revisión y emite el estado completo posterior.

La activación también puede preparar un hook de ciclo de vida declarado en el manifiesto de la etapa uno. Una primera activación cuyo manifiesto técnico contiene un entrypoint `EntryPointKind::Hajimari` (`hajimari`/`始まり`) prepara `Hajimari`. Reasignar una dirección activa a un código cuyo manifiesto técnico contiene un punto de entrada `EntryPointKind::Kaizen` (`kaizen`/`改善`) etapas `Kaizen`. La asignación cambia inmediatamente, pero el contrato no está listo: cada llamada `Kotoage` y `View` es rechazada hasta que el hook en etapa exacta tenga éxito. Otra activación también es rechazada mientras un hook está pendiente.

Invoca el hook en etapa con `Executable::ContractCall` en la misma dirección de contrato y nuevo hash criptográfico de código, usando exactamente el punto de entrada `hajimari` o `kaizen` y los argumentos declarados por su manifiesto técnico. El tiempo de ejecución del software proporciona el permiso con alcance de dirección y selector `CanInvokeContractEntrypoint`; los llamadores no deben crear ni otorgar ese permiso. El marcador pendiente contiene un `transition_id` determinista generado por tiempo de ejecución y el nuevo `code_hash`; un marcador `Kaizen` también contiene `previous_code_hash`. Los clientes ni calculan ni envían `transition_id`. Un hook exitoso consume el marcador de forma atómica, mientras que un hook fallido lo deja pendiente para un reintento posterior.

Una propuesta del Parlamento de nivel de emergencia puede imponer una retención por un máximo de 3,600 bloques cuando vincula la revisión actual, el hash criptográfico del código y un valor de resumen criptográfico de incidente distinto de cero. Las llamadas están bloqueadas desde la altura de imposición hasta, pero sin incluir, la altura de expiración. La expiración restaura la ejecución pero no borra la retención. Una acción certificada `CompleteEmergencyHoldRetrospective` debe posteriormente vincular los ID de retención exactos y el valor del resumen criptográfico más una raíz de hallazgo distinta de cero antes de que se borre el registro; no se puede imponer otra retención mientras esa retrospectiva siga pendiente.

Cuando la aplicación API está habilitada, lea el estado retenido con `GET /v1/gov/contracts/{contract_address}`. Su campo `found` significa que existe un registro de ciclo de vida, no que la dirección tenga actualmente código activo.

## Guía Operativa {#operational-guidance}

- Mantenga los contratos deterministas. El comportamiento del contrato no debe depender del tiempo local del reloj, del estado del sistema de archivos del host, de llamadas de red u otras entradas locales de pares.
- Mantenga los payloads compactos. Un bytecode grande aumenta el tamaño de la transacción y el costo de propagación del bloque.
- Prefiera instrucciones escritas para cambios simples en el libro mayor de la blockchain. Son más fáciles de auditar y más baratas de ejecutar.
- Trate las autorizaciones de actualización de contratos y registro como controles operativos de alto riesgo.

Véase también:

- [Instrucciones](/es/blockchain/instructions.md)
- [Desencadenantes](/es/blockchain/triggers.md)
- [Permisos](/es/blockchain/permissions.md)
- [Esquema del modelo de datos](/es/reference/data-model-schema.md)
