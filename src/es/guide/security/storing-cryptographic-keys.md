---
translation_locale: es
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Almacenamiento de Claves Criptográficas {#storing-cryptographic-keys}

Una clave privada puede autorizar cada acción permitida a su principal de autorización. Nunca comparta una clave privada. Proteja el material de la semilla, los secretos de recuperación, los tokens de portador y los archivos de claves exportadas con el mismo cuidado.

Elige el diseño de custodia antes del lanzamiento de producción. El diseño debe coincidir con el valor en riesgo, la política del controlador de cuentas y el proceso de recuperación del despliegue.

## Definir el Límite de Custodia {#define-the-custody-boundary}

- Mantenga un inventario de cada principal de autorización, clave pública, algoritmo, entorno, propósito, custodio, ubicación de almacenamiento, copia de seguridad y procedimiento de reemplazo.
- Use llaves separadas para desarrollo, prueba, producción, transacciones rutinarias, gobernanza, despliegue y recuperación.
- Da a las personas y a los procesos acceso solo a las claves requeridas por su rol.
- Requerir aprobación independiente para la firma de alto valor o de gobernanza cuando el modelo de riesgo lo exija.
- Registre qué red y principal de autorización puede usar un firmante criptográfico. Un servicio de firma debe rechazar las solicitudes fuera de ese alcance.

## Elige un método de almacenamiento adecuado {#choose-an-appropriate-storage-method}

Para el desarrollo local, pruebas controladas o una entrega de custodia segura, una clave puede ser exportada a un archivo con permisos restringidos. En una plataforma Unix compatible, genere un nuevo directorio de claves con `kagami`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

El directorio principal debe existir. El destino debe ser nuevo o ya pertenecer al usuario actual, modo `0700`, libre de enlaces simbólicos y vacío. Kagami escribe `public.key` y `private.key` con modo `0600`; `--pop` también escribe `pop.hex`. El comando falla en las plataformas donde Kagami no puede hacer cumplir las reglas del sistema de archivos solo para el propietario.

El archivo de clave privada es una exportación sin cifrar. Manténgalo fuera del control de versiones, carpetas compartidas, registros, tickets, chat y artefactos de compilación. Importe una clave de producción en su límite de custodia aprobado, luego elimine la exportación según el procedimiento de despliegue. No reutilice una clave de desarrollo en producción.

Para producción, prefiera un límite de custodia auditado como:

- un módulo de seguridad de hardware o un almacén de claves respaldado por hardware
- un almacén de claves de sistema operativo o móvil
- un servicio de firma aislado
- un gestor de secretos que libera una clave solo a una carga de trabajo autorizada

Mantenga el material clave no exportable cuando la integración seleccionada admita esa propiedad. Confirme que el sistema de custodia admite el algoritmo y la operación de firma requeridos por el principal de autorización Iroha.

El cifrado en reposo protege una copia almacenada. No protege una clave después de que un proceso no autorizado o un operador obtiene los bytes descifrados. Endurezca el host, restrinja el acceso en tiempo de ejecución del software y supervise la actividad de firma.

## Proteger los flujos de trabajo de firma {#protect-signing-workflows}

- Utilice identidades de operadores nombradas, autenticación fuerte y acceso auditado a los sistemas de firma.
- Mantenga las claves sin procesar fuera de los argumentos de la línea de comandos, el historial del shell, los volcado de entorno, los listados de procesos, los informes de fallos y los registros de aplicaciones.
- Desbloquee un firmante criptográfico solo para la operación requerida. Cierre o expire la sesión después de usarla.
- Muestre el principal de autorización, la red, las instrucciones, los activos y las tarifas antes de la aprobación.
- Requerir confirmación explícita para transacciones privilegiadas o de alto valor.
- Mantenga las claves privadas en bruto fuera de las páginas del navegador y de los procesos de aplicaciones de propósito general cuando una integración de cliente personalizada pueda delegar la firma.

La configuración del cliente en texto plano es adecuada solo para el desarrollo local y pruebas controladas. Una integración en producción debería obtener firmas a través de su límite de custodia aprobado. La acción Iroha CLI lee una clave privada de la configuración del cliente y no proporciona un adaptador genérico de firmante externo. Los clientes personalizados pueden construir el hash criptográfico de la carga útil de la transacción y adjuntar una firma producida por un firmante criptográfico externo.

## Respaldar y Recuperar Llaves {#back-up-and-recover-keys}

- Haga una copia de seguridad solo de las claves cuya política de recuperación requiera una copia de seguridad.
- Cifre las copias de seguridad y manténgalas separadas del firmador criptográfico en vivo.
- Aplica los mismos controles de acceso y aprobación a una copia de seguridad que a la clave en uso.
- Mantenga las credenciales de recuperación bajo custodia independiente cuando se requiera separación de funciones.
- Prueba de restauración sin exponer el material clave de producción.
- Registrar y revisar cada creación, acceso, restauración y destrucción de copias de seguridad.

No asuma que un formato de mnemónico de billetera no relacionado puede representar una clave privada Iroha. Use únicamente un formato de recuperación compatible y probado por el sistema de custodia seleccionado.

## Reemplazar Llaves Expuestas o Retiradas de Servicio {#replace-exposed-or-retired-keys}

Prepare el reemplazo antes de un incidente. El procedimiento debe identificar:

1. quién puede declarar una clave expuesta o fuera de servicio
2. cómo se aísla el firmante criptográfico afectado
3. cómo se genera una nueva clave y se coloca en custodia aprobada
4. para una cuenta, cómo la sustitución autorizada del controlador o la recuperación social crea el `AccountId` canónico de reemplazo y migra el estado vinculado
5. para un nodo o par de red, cómo se coordina una rotación o desactivación autorizada de la clave de consenso en cadena con el BLS PoP, la política de activación y superposición, la configuración de clave local, `trusted_peers_pop` y la topología de despliegue
6. cómo las configuraciones, aplicaciones y operadores dependientes adoptan la nueva `AccountId`, clave pública o identidad de par de red
7. cómo se elimina el principal de autorización de la clave antigua y se archivan o destruyen sus copias
8. cómo se verifica la red y las aplicaciones dependientes posteriormente

::: warning

La encriptación o una nueva contraseña no pueden hacer que una clave privada copiada vuelva a ser segura. Cuando se sospeche de una exposición, deje de usar la clave y siga el procedimiento aprobado de reemplazo o revocación.

:::

Vea [Generando Claves Criptográficas](./generating-cryptographic-keys.md), [Seguridad Operativa](./operational-security.md) y [Principios de seguridad](./security-principles.md).
