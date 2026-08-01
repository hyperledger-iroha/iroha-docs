---
translation_locale: es
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Almacenamiento de claves criptográficas {#storing-cryptographic-keys}

Una clave privada puede autorizar todas las acciones permitidas a la autoridad correspondiente. Nunca comparta una clave privada. Proteja con el mismo cuidado el material de generación, los secretos de recuperación, los tokens al portador y los archivos de claves exportados.

Elija el diseño de custodia antes de la puesta en producción. El diseño debe ser acorde con el valor en riesgo, la política de control de la cuenta y el proceso de recuperación del despliegue.

## Definir el límite de custodia {#define-the-custody-boundary}

- Mantenga un inventario de cada autoridad, clave pública, algoritmo, entorno, finalidad, custodio, ubicación de almacenamiento, copia de seguridad y procedimiento de reemplazo.
- Utilice claves distintas para desarrollo, pruebas, producción, transacciones rutinarias, gobernanza, despliegue y recuperación.
- Conceda a las personas y los procesos acceso únicamente a las claves que requiera su función.
- Exija una aprobación independiente para firmas de alto valor o de gobernanza cuando así lo requiera el modelo de riesgo.
- Registre qué red y qué autoridad puede usar cada firmante. Un servicio de firma debe rechazar las solicitudes que queden fuera de ese ámbito.

## Elija un método de almacenamiento adecuado {#choose-an-appropriate-storage-method}

Para el desarrollo local, las pruebas controladas o una transferencia segura a custodia, se puede exportar una clave a un archivo con permisos restringidos. En una plataforma Unix compatible, genere un nuevo directorio de claves con `kagami`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

El directorio padre debe existir. El directorio de destino debe ser nuevo o pertenecer ya al usuario actual, tener el modo `0700`, no contener enlaces simbólicos y estar vacío. Kagami escribe `public.key` y `private.key` con el modo `0600`; `--pop` también escribe `pop.hex`. El comando falla en las plataformas donde Kagami no puede aplicar las reglas del sistema de archivos que limitan el acceso al propietario.

El archivo de clave privada es una exportación sin cifrar. Manténgalo fuera del control de versiones, las carpetas compartidas, los registros, los sistemas de incidencias, los chats y los artefactos de compilación. Importe las claves de producción en su entorno de custodia aprobado y, a continuación, elimine la exportación conforme al procedimiento de despliegue. No reutilice en producción una clave de desarrollo.

Para producción, prefiera un entorno de custodia auditado, como:

- un módulo de seguridad de hardware o un almacén de claves respaldado por hardware
- un almacén de claves del sistema operativo o de un dispositivo móvil
- un servicio de firma aislado
- un gestor de secretos que entregue una clave únicamente a una carga de trabajo autorizada

Mantenga el material de las claves como no exportable cuando la integración elegida admita esa propiedad. Confirme que el sistema de custodia admite el algoritmo y la operación de firma que requiere la autoridad de Iroha.

El cifrado en reposo protege una copia almacenada. No protege una clave una vez que un proceso u operador no autorizado obtiene los bytes descifrados. Refuerce la seguridad del host, restrinja el acceso en tiempo de ejecución y supervise la actividad de firma.

## Proteja los flujos de trabajo de firma {#protect-signing-workflows}

- Utilice identidades de operador nominales, autenticación robusta y acceso auditado a los sistemas de firma.
- Mantenga las claves sin procesar fuera de los argumentos de línea de comandos, el historial del shell, los volcados del entorno, las listas de procesos, los informes de fallos y los registros de las aplicaciones.
- Desbloquee un firmante únicamente para la operación requerida. Cierre la sesión o deje que caduque después de usarla.
- Muestre la autoridad, la red, las instrucciones, los activos y las comisiones antes de la aprobación.
- Exija confirmación explícita para las transacciones privilegiadas o de alto valor.
- Mantenga las claves privadas en bruto fuera de las páginas del navegador y los procesos de aplicaciones de propósito general cuando una integración de cliente personalizada puede delegar la firma.

La configuración del cliente en texto plano solo es adecuada para el desarrollo local y las pruebas controladas. Una integración de producción debe obtener las firmas a través de su entorno de custodia aprobado. La CLI estándar de Iroha lee una clave privada de la configuración del cliente y no proporciona un adaptador genérico para firmantes externos. Los clientes personalizados pueden construir el hash de la carga útil de la transacción y adjuntar una firma producida por un firmante externo.

## Haga copias de seguridad y recupere las claves {#back-up-and-recover-keys}

- Haga copias de seguridad únicamente de las claves cuya política de recuperación lo requiera.
- Cifre las copias de seguridad y manténgalas separadas del firmante activo.
- Aplique a las copias de seguridad los mismos controles de acceso y aprobación que a la clave activa.
- Mantenga las credenciales de recuperación bajo custodia independiente cuando se requiera la separación de funciones.
- Pruebe la restauración sin exponer el material de las claves de producción.
- Registre y revise cada creación, acceso, restauración y destrucción de copias de seguridad.

No dé por supuesto que el formato mnemónico de una cartera no relacionada pueda representar una clave privada de Iroha. Utilice únicamente un formato de recuperación que el sistema de custodia elegido admita y haya probado.

## Reemplazar las claves expuestas o retiradas {#replace-exposed-or-retired-keys}

Prepare el reemplazo antes de que ocurra un incidente. El procedimiento debe identificar:

1. quién puede declarar que una clave ha quedado expuesta o se ha retirado
2. cómo se aísla al firmante afectado
3. cómo se genera una clave nueva y se deposita en una custodia aprobada
4. para una cuenta, cómo el reemplazo autorizado del controlador o la recuperación social crea el `AccountId` canónico de reemplazo y migra el estado vinculado
5. para un nodo o par, cómo se coordina una rotación o desactivación autorizada en la cadena de la clave de consenso con la BLS PoP, la política de activación y solapamiento, la configuración de la clave local, `trusted_peers_pop` y la topología de despliegue
6. cómo las configuraciones, las aplicaciones y los operadores dependientes adoptan el nuevo `AccountId`, la clave pública o la identidad del par
7. cómo se elimina la autoridad de la clave antigua y se archivan o destruyen sus copias
8. cómo se verifican después la red y las aplicaciones dependientes

::: warning

El cifrado o una nueva contraseña no pueden hacer que una clave privada copiada vuelva a ser segura. Cuando se sospeche de exposición, deje de usar la clave y siga el procedimiento aprobado de reemplazo o revocación.

:::

Véase [Generación de claves criptográficas](./generating-cryptographic-keys.md), [Seguridad operativa](./operational-security.md) y [Principios de seguridad](./security-principles.md).
