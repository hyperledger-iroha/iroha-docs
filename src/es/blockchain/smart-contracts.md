---
translation_locale: es
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los contratos inteligentes {#smart-contracts}

Las transacciones Iroha ejecutan cargas útiles `Executable`. El modelo de datos actual soporta:

- `Executable::Instructions`: un conjunto ordenado de instrucciones especiales de Iroha
- `Executable::ContractCall`: una llamada de referencia indirecta a una instancia de contrato desplegada
- `Executable::Ivm`: Código de byte Iroha VM
- `Executable::IvmProved`: Código de byte Iroha VM con una superposición precomputada de instrucciones y compromisos de prueba

Kotodama es Iroha Es el lenguaje de alto nivel del contrato inteligente. `.ko` el archivo de origen compila a determinista IVM el código byte, almacenado convencionalmente como un `.to` artefacto para su despliegue. Kotodama objetivos IVM; No es independiente. RISC-V o WebAssembly El objetivo.

La primera versión sólo admite la versión ABI. La política de syscall y pointer-ABI se aplica incondicionalmente mediante la admisión y ejecución del contrato; no hay interrupción de compatibilidad con el tiempo de ejecución.

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
