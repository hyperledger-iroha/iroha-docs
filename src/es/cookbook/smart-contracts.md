---
translation_locale: es
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Construir y implementar un contrato inteligente {#build-and-deploy-a-smart-contract}

## El resultado {#outcome}

Verificar y compilar un contrato Kotodama V1, ejecutar su punto de entrada público localmente, desplegar el artefacto verificado IVM, simular el punto de entrada desplegado y presentarlo con una cuota explicitamente cotizada pagada por las autoridades.

## Los requisitos previos {#prerequisites}

- Un chequeo de fuente Iroha en el punto de entrega `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust y Cargo.
- El cliente actual `iroha` CLI más un cliente financiado Taira de [ se conecta con Taira](./connect-to-taira.md).
- Caminos absolutos en `IROHA_CONFIG` y `IROHA_PRIVATE_KEY_FILE`. El archivo clave debe ser un archivo regular de un solo enlace con el modo `0600`; el ayudante de implementación intencionalmente no tiene ningún argumento de llave privada en línea.
- Aprobación del operador Taira. El registro del código de contrato requiere `CanRegisterSmartContractCode`, y las implementaciones protegidas pueden requerir atribución y promulgación de gobernanza. Si Taira no ha concedido ese acceso, realice la implementación en una red local generada cuya genesis otorga el permiso.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## Los pasos {#steps}

### 1. Copiar un contrato de bien conocido Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

Trabaje dentro del chequeo fijado Iroha y copie la muestra tuple-retorno del compilador para que la fuente y la cadena de herramientas permanezcan en el mismo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

La fuente completa es pequeña y utiliza la sintaxis actual `seiyaku`/`kotoage`:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama se dirige a la Máquina Virtual Iroha y su corriente ABI. No es un lenguaje fuente WASM o EVM.

### 2. Comprobar, construir y verificar el artefacto. {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

La primera construcción publica el artefacto y los sidecars autenticados. La segunda se ejecuta en modo de sólo lectura `--verify` y falla si cualquier salida existente no coincide exactamente con la fuente actual. Trata el archivo `.to` y su manifiesto como una salida revisada de la construcción.

### 3. Ejecutar el código de byte localmente {#_3-run-the-bytecode-locally}

`compute` es un punto de entrada público `kotoage`. ejecutarlo con `debug-call`, que se ejecuta contra dispositivos locales sin enviar ni pagar por una transacción.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Los números enteros Kotodama se traducen en cadenas JSON, por lo que el tuple decodificado es `["3", "5"]`.

### 4. Despliegue a través del ayudante nativo. {#_4-deploy-through-the-native-helper}

El ayudante carga trozos de código de byte, registra el manifiesto firmado y presenta una operación `CommitContractDeployment`. Citación de tarifas para cada transacción y rechaza una cotización que cambie el pagador seleccionado o la vinculación al gas.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

La solicitud vacía `charge_limits` no es un identificador de activo copiado: el ayudante acepta la cotización en vivo exacta antes de firmar. Compara el activo de carga devuelto con la respuesta actual del grifo. No adjunta metadatos heredados `gas_asset_id` a las llamadas de contrato.

### 5. Simula y llama al punto de entrada desplegado. {#_5-simulate-and-call-the-deployed-entrypoint}

La simulación ejecuta el punto de entrada público en Torii sin presentar. La siguiente llamada es una transacción y, por lo tanto, selecciona explícitamente al pagador de las tarifas de autoridad. Ambos comandos vinculan el límite de 1,500,000 gas.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## Verificar {#verify}

Resolver el alias, buscar el manifiesto en la cadena con el hash de código devuelto y simular el mismo punto de entrada público por dirección canónica:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

El despliegue es completo solo cuando el alias se resuelve a la dirección devuelta, el manifiesto es legible bajo el mismo código hash, las simulaciones locales y Torii retornan `["3", "5"]`, y la llamada enviada llega a `Applied`.

## Solución de problemas {#troubleshooting}

- Las fallas `CanRegisterSmartContractCode` requieren una concesión del operador Taira o un cambio de génesis/bootstrap en localnet. Una cuenta normal no puede otorgar este permiso después del hecho.
- Gobernanza o rechazo de carril protegido significa que la implementación necesita la atribución exacta de aprobación requerida por esa red. Coordinar la lista de aprobadores; no inventar cuenta IDs.
- Un manifiesto o ABI desajuste significa que el código de byte, manifiesto y el tiempo de ejecución del nodo no describen el mismo artefacto. `--verify`.
- `fee quote changed ... gas bound` significa el desacuerdo entre la intención tipografiada solicitada y la cotización en vivo.
- El ayudante de implementación rechaza las claves en línea, los modos permisivos de archivos clave, los vínculos simétricos y multiplica los archivos vinculados antes de la presentación de la red.
- Un error de punto de entrada solo para visualización significa que `compute` fue enrutado a través de la familia de comandos incorrecta. Esta muestra declara `kotoage`, así que use simulación de llamada o presentación.
- Las llamadas contractuales requieren un límite de gas de tipo positivo. Se rechazan los metadatos de gas heredado o del activo de honorarios de alto nivel.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Kotodama V1 Implementación del comando en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Muestra de fuente de retorno dupla en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Asistente de despliegue nativo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Pruebas de integración del contrato en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Los contratos inteligentes ](/es/blockchain/smart-contracts.md)
- [Referencia CLI](/es/get-started/operate-iroha-via-cli.md)
