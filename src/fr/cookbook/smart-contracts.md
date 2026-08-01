---
translation_locale: fr
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Construisez et mettez en œuvre un contrat intelligent {#build-and-deploy-a-smart-contract}

## Le résultat {#outcome}

Vérifiez et compilez un contrat Kotodama V1, exécutez son point d'entrée public localement, déployez l'artefact IVM vérifié, simulons le point d'accès déployé et soumettez-le avec une redevance explicitement cité payée par l'autorité.

## Conditions préalables {#prerequisites}

- Une facturation à la source Iroha à l'adresse de commande `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust et Cargo.
- Le client actuel `iroha` CLI ainsi qu'un client financé Taira de [Connectez-vous à Taira ](./connect-to-taira.md).
- Les chemins absolus dans `IROHA_CONFIG` et `IROHA_PRIVATE_KEY_FILE`. Le fichier clé doit être un fichier régulier à lien unique avec le mode `0600`; l'assistant de déploiement n'a intentionnellement pas d'argument de clé privée interne.
- Approbation de l'opérateur Taira. L'enregistrement du code de contrat nécessite `CanRegisterSmartContractCode`, et les déploiements protégés peuvent nécessiter l'attribution et la promulgation de la gouvernance. Si Taira n'a pas accordé cet accès, effectuer le déploiement sur un réseau local généré dont la génèse accorde l'autorisation.

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

## Les étapes {#steps}

### 1. Une copie d'un contrat bien connu Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

Travaillez à l'intérieur de la caisse fichée Iroha et copiez l'échantillon tuple-retour du compilateur afin que la chaîne source et les outils restent sur le même commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

La source complète est petite et utilise la syntaxe `seiyaku`/`kotoage` courante:

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

Kotodama cible la machine virtuelle Iroha et son courant ABI. Il ne s'agit pas d'un langage source WASM ou EVM.

### 2. Vérifiez, construisez et vérifiez l'artefact. {#_2-check-build-and-verify-the-artifact}

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

La première version publie l'artefact et les sidecars authentifiés. La seconde fonctionne en mode lecture seulement `--verify` et échoue si une sortie existante ne correspond pas exactement à la source actuelle. Traitez le fichier `.to` et son manifeste comme une sortie de version révisée.

### 3. Exécutez le code octal localement {#_3-run-the-bytecode-locally}

`compute` est un point d'entrée public `kotoage`. Exécutez-le avec `debug-call`, qui s'exécute contre des appareils locaux sans soumettre ni payer une transaction.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Les nombres entiers Kotodama sont rendus comme des chaînes JSON, de sorte que le tuple décodé est `["3", "5"]`.

### 4. Le déploiement par l'intermédiaire de l'assistant natif {#_4-deploy-through-the-native-helper}

L'assistant télécharge des morceaux de code octal, enregistre le manifeste signé et soumet une opération `CommitContractDeployment`. Il cite les frais de chaque transaction et refuse un devis qui modifie le payeur ou la liaison au gaz sélectionné.

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

La demande vide `charge_limits` n'est pas un identifiant d'actif copié: l'assistant accepte le devis en direct exact avant de signer. Comparer l'actif de charge retourné avec la réponse du robinet actuelle. Ne joignez pas les métadonnées héritées `gas_asset_id` aux appels à contrat.

### 5. Simuler et appeler le point d'entrée déployé. {#_5-simulate-and-call-the-deployed-entrypoint}

La simulation exécute le point d'entrée public sur Torii sans soumission. L'appel suivant est une transaction et sélectionne donc explicitement le payeur de la taxe d'autorité.

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

## Vérifiez {#verify}

Résolvez l'alias, récupérez le manifeste en chaîne par le hash du code retourné, et simulons le même point d'entrée public par adresse canonique:

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

Le déploiement n'est terminé que lorsque l'alias se résolve à l'adresse retournée, le manifeste est lisible sous le même code hash, les simulations locales et Torii retournent `["3", "5"]`, et l'appel soumis atteint `Applied`.

## Résolution des problèmes {#troubleshooting}

- Les défaillances `CanRegisterSmartContractCode` nécessitent une subvention de l'opérateur Taira ou un changement de génèse/bootstrap sur le localnet.
- La gouvernance ou le rejet de la voie protégée signifie que le déploiement nécessite l'attribution exacte d'approbation requise par ce réseau. Coordonner la liste des approuvés; ne pas inventer le compte IDs.
- Un manifest ou ABI déséquilibre signifie que le code par octets, le manifeste et la durée d'exécution du nœud ne décrivent pas le même artefact. Reconstruire à l'engagement fiché avec `--verify`.
- `fee quote changed ... gas bound` désigne le désaccord entre l'intention typée demandée et la citation en direct. Retour au lieu de modifier une transaction signée.
- L'assistant de déploiement rejette les clés en ligne, les modes permissifs de fichiers clés, les liens symboliques et le multiplication des fichiers liés avant la soumission du réseau.
- Une erreur de point d'entrée à vue seulement signifie que `compute` a été routé par la mauvaise famille de commandes. Cet échantillon déclare `kotoage`, utilisez donc une simulation d'appel ou une soumission.
- Les appels contractuels nécessitent une limite de gaz typée positive.Les métadonnées liées au gaz ou aux actifs sont rejetées.

## Sources et documents connexes {#source-and-related-docs}

- [La mise en œuvre de la commande Kotodama V1 à l'appui fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [L'échantillon de source de retour duple à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [L'assistant de déploiement natif à l'appel fixé ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Tests d'intégration des contrats à l'obligation fixée ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Contrats intelligents ](/fr/blockchain/smart-contracts.md)
- [référence CLI ](/fr/get-started/operate-iroha-via-cli.md)
