---
translation_locale: es
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolución de problemas en la configuración {#troubleshooting-configuration-issues}

Esta sección ofrece consejos de resolución de problemas para la configuración Iroha 3. Asegúrese de que [ compruebe primero las teclas ](./overview.md#check-the-keys), ya que es la fuente más común de problemas en Iroha.

Si el problema que experimenta no está descrito aquí, póngase en contacto con nosotros a través de [Telegrafo](https://t.me/hyperledgeriroha).

## Génesis obsoleta de una configuración Docker Compose {#outdated-genesis-on-a-docker-compose-setup}

Cuando se utiliza la versión Docker Compose de Iroha, es posible que se encuentre con el problema de que uno de los contenedores de pares falla con el error `Failed to deserialize raw genesis block`. Esto generalmente significa que las revisiones o perfiles Iroha diferentes han producido la transacción de génesis firmada y la configuración generada.

Verifique la falla con estos pasos:

1. Utilice `docker ps` para comprobar los contenedores actuales. Dependiendo del perfil generado, por lo general verá los contenedores `hyperledger/iroha:dev`. El perfil predeterminado Docker Compose contiene cuatro contenedores pares, aunque el `docker-compose.yml` generado puede diferir.

2. Compruebe los registros y busque el error `Failed to deserialize raw genesis block`. Si comenzó su Iroha en modo daemon con `docker compose up -d`, utilice el comando `docker compose logs`.

La forma de solucionar este problema depende del uso de Iroha. Si se trata de una demostración básica y no es necesario conservar los datos de pares, regenera un localnet o paquete Docker Compose correspondiente con Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Luego, elimine el estado antiguo del contenedor y reinicie los archivos regenerados `genesis.signed.nrt`, peer `config.toml` y `client.toml`.

Si desea restaurar los datos de la instancia Iroha, haga lo siguiente:

1. Conecte el segundo par Iroha que copiará los datos del primer (fallido) par.
2. Espera hasta que el nuevo par sincronice los datos con el primer par.
3. Deje activo al nuevo compañero.
4. Actualizar los archivos de génesis y configuración del primer par solo como parte de una migración coordinada.

::: info

No existe un camino de reescritura automática general para reemplazar la génesis en una red en vivo. Trata esto como una migración coordinada: preserva el estado antiguo, trae pares compatibles y solo mueva a los validadores a la nueva configuración después de que los operadores acuerden el plan de migración.

:::

## El formato multi-hash de las claves privadas y públicas {#multihash-format-of-private-and-public-keys}

Si miras la configuración del cliente [ ](/es/guide/configure/client-configuration.md), notarás que las claves allí se dan en formato multi-hash [ ](https://github.com/multiformats/multihash).

Si nunca has trabajado con multi-hash antes, es natural suponer que el lado derecho no es una representación hexadecimal de los bytes clave (dos símbolos por byte), sino más bien los bytes codificados como ASCII (o UTF-8), y llamar a `from_hex` en la cadena literal tanto en la instanciación `public_key` como en la `private_key`.

También es natural suponer que llamar `PrivateKey::try_from_str` en el literal de cadena daría sólo la clave correcta. Así que si obtienes el número de bits en la clave incorrecto, por ejemplo 32 bytes vs 64, que se elevaría un mensaje de error.

Ambas suposiciones son erróneas. Desafortunadamente, los mensajes de error no ayudan a desarmar este tipo de fallas en particular.

Cómo arreglar: usar `hex_literal`. Esto también transformará una fea cadena de caracteres en una bonita tabla pequeña de números obviamente hexadecimais.

::: warning

Incluso la implementación de `try_from_str` no puede verificar si una cadena dada es válida `PrivateKey` y advertirle si no lo es.

Se detectará algunos errores obvios, por ejemplo, si la cadena contiene un símbolo inválido. Sin embargo, ya que pretendemos apoyar muchos formatos de claves, no puede hacer mucho más. No puede saber si la clave es la clave privada correcta para la cuenta dada tampoco, a menos que envíe una instrucción.

:::

Este tipo de errores sutiles se pueden evitar, por ejemplo, deserializando directamente a partir de letras de cuerda, o generando un nuevo par de teclas en lugares donde tiene sentido.
