---
translation_locale: es
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Construir y desplegar un contrato inteligente {#build-and-deploy-a-smart-contract}

## Resultado {#outcome}

Verificar y compilar un contrato Kotodama V1, ejecutar localmente su vista pública, desplegar el artefacto IVM verificado con tarifas pagadas por la autoridad y seleccionadas explícitamente, y leer la vista desplegada a través de Torii.

## Requisitos previos {#prerequisites}

- Una copia de trabajo del código fuente Iroha en el commit `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust, y Cargo.
- El `iroha` CLI actual y `musubi` (ejecutado como `cargo run -p musubi --` en la copia de trabajo) más un cliente Taira financiado de [Conectar a Taira](./connect-to-taira.md).
- Una ruta absoluta en `IROHA_CONFIG`. La vinculación de red de Musubi almacena una referencia a este archivo de cliente y firma el despliegue con su clave de cuenta.
- Autoridad sobre el alias. El ejecutor requiere `CanManageAccountAlias` para el alias exacto del contrato o para su ámbito superior: el dominio propietario en `name::domain.dataspace`, o el espacio de datos en `name::dataspace`. Las cuentas registradas no necesitan un permiso aparte para registrar código, y los espacios de nombres protegidos también requieren el flujo de gobernanza de la red. Los ejemplos usan `cookbook_tuple::universal`; en Taira, reemplácelo por un alias en un dominio que le pertenezca, o despliegue en una red local generada cuyo génesis conceda el ámbito del alias.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Pasos {#steps}

### 1. Copiar un contrato Kotodama V1 conocido como bueno {#_1-copy-a-known-good-kotodama-v1-contract}

Trabaja dentro del Iroha de pago fijado y copia el ejemplo de retorno de tupla del compilador para que la fuente y la cadena de herramientas permanezcan en el mismo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

El código fuente completo es pequeño: una función auxiliar privada `fn` y una `view fn` pública de solo lectura que permite explícitamente a cualquier llamador:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama apunta a la Máquina Virtual Iroha y su ABI actual. No es un lenguaje fuente WASM ni EVM.

### 2. Verificar, construir y comprobar el artefacto {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

La primera compilación publica el artefacto y los sidecars autenticados. La segunda se ejecuta en modo de solo lectura `--verify` y falla si cualquier salida existente no coincide exactamente con la fuente actual. Trate el archivo `.to` y su manifiesto técnico como una salida de compilación revisada única.

### 3. Ejecuta el bytecode localmente {#_3-run-the-bytecode-locally}

`compute` es una `view fn` pública de solo lectura. Ejecútela con `debug-view`, que ejecuta localmente el bytecode compilado contra datos de prueba opcionales sin enviar ni pagar por una transacción.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama los enteros se representan como JSON cadenas, por lo que la tupla decodificada es `["3", "5"]`.

### 4. Desplegar el artefacto verificado con Musubi {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` inspecciona contratos, ejecuta sus vistas y los depura, pero no los despliega, por lo que los despliegues en Taira se realizan con Musubi. Su servicio de despliegue sube los fragmentos de bytecode, registra el manifiesto técnico verificado y envía una operación `CommitContractDeployment`. Cotiza cada transacción, rechaza una cotización que cambie el pagador seleccionado, la revisión del patrocinador o el límite de gas, y despliega el artefacto precompilado solo después de que la compilación del paquete con dependencias bloqueadas reproduzca sus hashes de código y de ABI. En una red local gestionada por Kagami, `kagami contract deploy` despliega en su lugar `./build/tuple_return_demo.to` con `--alias cookbook_tuple::universal --json`; su comprobante está en `.receipt`, y `kagami context show` imprime la configuración de cliente que debe usarse como `IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

La vinculación usa `--fee-payer authority`; Musubi cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar. Compare el activo cobrado que devuelve con el que publica la política actual del dispensador. Las llamadas al contrato solo aceptan la selección de tarifas mediante la cotización activa tipada; los metadatos de transacción `gas_asset_id` no forman parte del contrato de primera versión.

### 5. Leer la vista desplegada {#_5-read-the-deployed-view}

`contract view` ejecuta el punto de entrada de solo lectura en Torii sin transacción ni tarifa. Una vista no tiene forma de transacción: Torii rechaza un selector de vista en sus rutas de llamada.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Verificar {#verify}

Resuelva el alias, obtenga el manifiesto técnico en cadena mediante el hash criptográfico del código que Torii informa para la vista desplegada y ejecute la misma vista mediante la dirección canónica:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

La implementación se considera completa solo cuando el comprobante de despliegue indica que el artefacto almacenado está verificado, el alias se resuelve a la dirección devuelta, el manifiesto técnico es legible bajo el mismo hash criptográfico del código, y las vistas local y de Torii devuelven `["3", "5"]`.

## Solución de problemas {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, o el mensaje del ejecutor `authority is not permitted to manage contract alias`, significa que la cuenta no puede vincular ese alias. Use un alias en un dominio que le pertenezca, u obtenga del propietario de ese ámbito la concesión exacta del alias o la de su dominio o espacio de datos; en una red local, concédala en el génesis.
- Un rechazo por espacio de nombres protegido significa que el espacio de nombres del alias está sujeto a gobernanza. Enumerar IDs de cuentas aprobadoras no constituye prueba de aprobación; use el flujo de gobernanza de la red (`iroha app gov deploy propose`) para ese espacio de nombres, o elija un alias fuera de él.
- Un desajuste del manifiesto técnico o de la ABI significa que el bytecode, el manifiesto técnico y el tiempo de ejecución del software del nodo no describen el mismo artefacto. Reconstruya en el commit fijado y luego vuelva a ejecutar la compilación con `--verify`.
- `fee quote changed ... gas bound` significa que la intención escrita solicitada y la cotización en vivo no coinciden. Vuelva a realizar la verificación previa en lugar de modificar una transacción firmada.
- Un despliegue interrumpido conserva su plan firmado en un diario. Recupérelo con `musubi deploy --resume <JOURNAL>` en lugar de firmar un plan nuevo.
- `is read-only and cannot be invoked as a transaction` o `is not a kotoage or lifecycle entrypoint` significa que `compute` se envió a un comando de llamada. Esta muestra declara `view fn`, por lo que use `debug-view` localmente y `view` en Torii.
- Las llamadas de contrato requieren un límite de gas tipado y positivo. El contrato de llamada de la primera versión rechaza el gas de nivel superior y los metadatos del activo de tarifa.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación del comando Kotodama V1 en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Ejemplo de fuente de retorno de tupla en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Comando de despliegue de Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) y el [servicio nativo de despliegue de contratos](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) en el commit fijado
- [Pruebas de integración de contratos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Contratos inteligentes](/es/blockchain/smart-contracts.md)
- [CLI referencia](/es/get-started/operate-iroha-via-cli.md)
