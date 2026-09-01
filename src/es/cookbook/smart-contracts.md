---
translation_locale: es
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Construir y desplegar un contrato inteligente {#build-and-deploy-a-smart-contract}

## Resultado {#outcome}

Verificar y compilar un contrato Kotodama V1, ejecutar su punto de entrada público localmente, desplegar el artefacto IVM verificado, simular el punto de entrada desplegado y enviarlo con una tarifa pagada por la autoridad y cotizada explícitamente.

## Requisitos previos {#prerequisites}

- Una copia de trabajo del código fuente Iroha en el commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, y Cargo.
- El `iroha` CLI actual más un cliente Taira financiado de [Conectar a Taira](./connect-to-taira.md).
- Rutas absolutas en `IROHA_CONFIG` y `IROHA_PRIVATE_KEY_FILE`. El archivo clave debe ser un archivo regular de enlace único propiedad del propietario con modo `0600`; el asistente de despliegue intencionalmente no tiene un argumento de clave privada en línea.
- Taira aprobación del operador. El registro del código del contrato requiere `CanRegisterSmartContractCode`, y los despliegues protegidos pueden requerir atribución y ejecución de gobernanza. Si Taira no ha concedido ese acceso, realice el despliegue en una red local generada cuyo génesis de blockchain otorgue el permiso.

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

## Pasos {#steps}

### 1. Copiar un contrato Kotodama V1 conocido como bueno {#_1-copy-a-known-good-kotodama-v1-contract}

Trabaja dentro del Iroha de pago fijado y copia el ejemplo de retorno de tupla del compilador para que la fuente y la cadena de herramientas permanezcan en el mismo commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

El código fuente completo es pequeño y utiliza la sintaxis actual `seiyaku`/`kotoage`:

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

Kotodama apunta a la Máquina Virtual Iroha y su ABI actual. No es un lenguaje fuente WASM ni EVM.

### 2. Verificar, construir y comprobar el artefacto {#_2-check-build-and-verify-the-artifact}

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

La primera compilación publica el artefacto y los sidecars autenticados. La segunda se ejecuta en modo de solo lectura `--verify` y falla si cualquier salida existente no coincide exactamente con la fuente actual. Trate el archivo `.to` y su manifiesto técnico como una salida de compilación revisada única.

### 3. Ejecuta el bytecode localmente {#_3-run-the-bytecode-locally}

`compute` es un punto de entrada público de `kotoage`. Ejecútalo con `debug-call`, que se ejecuta contra artefactos de prueba locales sin enviar ni pagar por una transacción.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama los enteros se representan como JSON cadenas, por lo que la tupla decodificada es `["3", "5"]`.

### 4. Implementar a través del asistente nativo {#_4-deploy-through-the-native-helper}

El asistente sube fragmentos de bytecode, registra el manifiesto técnico firmado y envía una operación `CommitContractDeployment`. Cotiza las tarifas de cada transacción y rechaza una cotización que cambie el pagador seleccionado o el límite de costo de ejecución de la transacción.

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

La solicitud con `charge_limits` vacío no contiene un identificador de activo copiado: el auxiliar acepta la cotización activa exacta antes de firmar. Compare el activo cobrado que devuelve con la respuesta actual del dispensador. Las llamadas al contrato solo aceptan la selección de tarifas mediante la cotización activa tipada; los metadatos de transacción `gas_asset_id` no forman parte del contrato de primera versión.

### 5. Simular y llamar al punto de entrada desplegado {#_5-simulate-and-call-the-deployed-entrypoint}

La simulación ejecuta el punto de entrada público en Torii sin enviarlo. La llamada siguiente es una transacción y, por tanto, selecciona explícitamente a la autoridad como pagadora de la tarifa. Ambos comandos fijan el límite de gas en 1.500.000.

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

Resuelve el alias, obtén el manifiesto técnico en cadena mediante el hash criptográfico del código devuelto y simula el mismo punto de entrada público mediante la dirección canónica:

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

La implementación se considera completa solo cuando el alias se resuelve a la dirección devuelta, el manifiesto técnico es legible bajo el mismo hash criptográfico del código, las simulaciones locales y Torii devuelven `["3", "5"]`, y la llamada enviada llega a `Applied`.

## Solución de problemas {#troubleshooting}

- `CanRegisterSmartContractCode` los fallos requieren una concesión de operador Taira o un cambio de génesis/bootstrap en la red local. Una cuenta normal no puede otorgarse este permiso por sí misma después del hecho.
- El rechazo por gobernanza o carril protegido significa que el despliegue necesita la atribución exacta del aprobador requerida por esa red. Coordine la lista de aprobadores; no invente IDs de cuentas.
- Un manifiesto técnico o un desajuste ABI significa que el bytecode, el manifiesto técnico y el tiempo de ejecución del software del nodo no describen el mismo artefacto. Reconstruya en el commit fijado con `--verify`.
- `fee quote changed ... gas bound` significa que la intención escrita solicitada y la cotización en vivo no coinciden. Vuelva a realizar la verificación previa en lugar de modificar una transacción firmada.
- El asistente de despliegue rechaza las claves en línea, los modos de archivo de claves permisivos, los enlaces simbólicos y los archivos con múltiples enlaces antes de la entrega a la red.
- Un error de punto de entrada de solo vista significa que `compute` fue dirigido a través de la familia de comandos incorrecta. Esta muestra declara `kotoage`, por lo que use simulación de llamadas o envío.
- Las llamadas de contrato requieren un límite de gas tipado y positivo. El contrato de llamada de la primera versión rechaza el gas de nivel superior y los metadatos del activo de tarifa.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Kotodama V1 implementación del comando en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Ejemplo de fuente de retorno de tupla en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Asistente de despliegue nativo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Pruebas de integración de contratos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Contratos inteligentes](/es/blockchain/smart-contracts.md)
- [CLI referencia](/es/get-started/operate-iroha-via-cli.md)
