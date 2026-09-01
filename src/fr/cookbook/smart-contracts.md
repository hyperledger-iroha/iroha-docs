---
translation_locale: fr
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Créer et déployer un contrat intelligent {#build-and-deploy-a-smart-contract}

## Résultat {#outcome}

Vérifiez et compilez un contrat Kotodama V1, exécutez son point d'entrée public localement, déployez l'artéfact IVM vérifié, simulez le point d'entrée déployé, et soumettez-le avec des frais payés par l'autorité explicitement cités.

## Prérequis {#prerequisites}

- Une copie opérationnelle du code source Iroha au commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust, et Cargo.
- Le `iroha` CLI actuel plus un client Taira financé de [Connectez-vous à Taira](./connect-to-taira.md).
- Chemins absolus dans `IROHA_CONFIG` et `IROHA_PRIVATE_KEY_FILE`. Le fichier clé doit être un fichier régulier à lien unique détenu par le propriétaire avec le mode `0600` ; l'assistant de déploiement n'a intentionnellement aucun argument de clé privée en ligne.
- Taira approbation de l'opérateur. L'enregistrement du code de contrat nécessite `CanRegisterSmartContractCode`, et les déploiements protégés peuvent nécessiter une attribution et une mise en œuvre de la gouvernance. Si Taira n'a pas accordé cet accès, effectuer le déploiement sur un réseau local généré dont le génesis de la blockchain accorde la permission.

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

## Étapes {#steps}

### 1. Copier un contrat Kotodama V1 connu pour être bon {#_1-copy-a-known-good-kotodama-v1-contract}

Travaillez à l'intérieur du Iroha checkout épinglé et copiez l'exemple de retour de tuple du compilateur afin que la source et la chaîne d'outils restent sur le même commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Le code source complet est petit et utilise la syntaxe actuelle `seiyaku`/`kotoage` :

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

Kotodama cible la Machine Virtuelle Iroha et son ABI actuel. Ce n'est pas un langage source WASM ou EVM.

### 2. Vérifier, construire et valider l'artéfact {#_2-check-build-and-verify-the-artifact}

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

La première compilation publie l'artifact et les sidecars authentifiés. La deuxième s'exécute en mode lecture seule `--verify` et échoue si toute sortie existante ne correspond pas exactement à la source actuelle. Traitez le fichier `.to` et son manifeste technique comme une seule sortie de compilation révisée.

### 3. Exécutez le bytecode localement {#_3-run-the-bytecode-locally}

`compute` est un point d'entrée public `kotoage`. Exécutez-le avec `debug-call`, qui s'exécute contre des artefacts de test locaux sans soumettre ni payer pour une transaction.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama les entiers sont rendus comme des chaînes JSON, donc le tuple décodé est `["3", "5"]`.

### 4. Déployer via l'assistant natif {#_4-deploy-through-the-native-helper}

L'assistant télécharge des morceaux de bytecode, enregistre le manifeste technique signé et soumet une opération `CommitContractDeployment`. Il propose un tarif pour chaque transaction et refuse un devis qui modifie le payeur sélectionné ou la limite de coût d'exécution de la transaction.

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

La demande dont `charge_limits` est vide ne contient pas d’identifiant d’actif copié : l’outil accepte le devis actif exact avant de signer. Comparez l’actif facturé renvoyé avec la réponse actuelle du distributeur. Les appels de contrat n’acceptent la sélection des frais qu’au moyen du devis actif typé ; les métadonnées de transaction `gas_asset_id` ne font pas partie du contrat de première version.

### 5. Simuler et appeler le point d'entrée déployé {#_5-simulate-and-call-the-deployed-entrypoint}

La simulation exécute le point d’entrée public sur Torii sans le soumettre. L’appel suivant est une transaction et sélectionne donc explicitement l’autorité comme payeur des frais. Les deux commandes fixent la limite de gas à 1 500 000.

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

## Vérifier {#verify}

Résolvez l'alias, récupérez le manifeste technique sur la chaîne via le hachage cryptographique du code retourné, et simulez la même entrée publique par adresse canonique :

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

Le déploiement est terminé uniquement lorsque l'alias se résout à l'adresse renvoyée, que le manifeste technique est lisible sous le même hachage cryptographique du code, que les simulations locales et Torii renvoient `["3", "5"]`, et que l'appel soumis atteint `Applied`.

## Dépannage {#troubleshooting}

- `CanRegisterSmartContractCode` les échecs nécessitent une autorisation d'opérateur Taira ou un changement de genèse/bootstrap sur le réseau local. Un compte normal ne peut pas s'accorder cette permission après coup.
- Le rejet dû à la gouvernance ou à la voie protégée signifie que le déploiement nécessite l'attribution exacte de l'approbateur requise par ce réseau. Coordonnez la liste des approbateurs ; n'inventez pas d'identifiants de compte.
- Une incompatibilité du manifeste ou de l’ABI signifie que le bytecode, le manifeste et l’environnement d’exécution du nœud ne décrivent pas le même artefact. Reconstruisez au commit épinglé avec `--verify`.
- `fee quote changed ... gas bound` signifie que l'intention tapée demandée et le devis en direct ne sont pas d'accord. Re-vérifiez plutôt que de modifier une transaction signée.
- L'assistant de déploiement rejette les clés en ligne, les modes de fichier clé permissifs, les liens symboliques et les fichiers à liens multiples avant la soumission sur le réseau.
- Une erreur de point d'entrée en lecture seule signifie que `compute` a été acheminé via la mauvaise famille de commandes. Cet exemple déclare `kotoage`, donc utilisez la simulation d'appel ou la soumission.
- Les appels de contrat exigent une limite de gas typée et positive. Le contrat d’appel de la première version rejette le gas de niveau supérieur et les métadonnées de l’actif de frais.

## Source et documents connexes {#source-and-related-docs}

- [Kotodama V1 implémentation de la commande au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Exemple de source retournant un tuple au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Assistant de déploiement natif au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Tests d'intégration de contrat au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Contrats intelligents](/fr/blockchain/smart-contracts.md)
- [CLI référence](/fr/get-started/operate-iroha-via-cli.md)
