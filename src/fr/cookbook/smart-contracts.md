---
translation_locale: fr
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Créer et déployer un contrat intelligent {#build-and-deploy-a-smart-contract}

## Résultat {#outcome}

Vérifiez et compilez un contrat Kotodama V1, exécutez localement sa vue publique, déployez l'artéfact IVM vérifié avec des frais payés par l'autorité et sélectionnés explicitement, puis lisez la vue déployée via Torii.

## Prérequis {#prerequisites}

- Une copie opérationnelle du code source Iroha au commit `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust, et Cargo.
- Le `iroha` CLI actuel et `musubi` (exécuté avec `cargo run -p musubi --` dans la copie de travail) plus un client Taira financé de [Connectez-vous à Taira](./connect-to-taira.md).
- Un chemin absolu dans `IROHA_CONFIG`. La liaison réseau de Musubi stocke une référence à ce fichier client et signe le déploiement avec sa clé de compte.
- Autorité sur l'alias. L'exécuteur exige `CanManageAccountAlias` pour l'alias exact du contrat ou pour sa portée parente : le domaine propriétaire pour `name::domain.dataspace`, ou l'espace de données pour `name::dataspace`. Les comptes enregistrés n'ont besoin d'aucune autorisation distincte d'enregistrement de code, et les espaces de noms protégés exigent aussi le processus de gouvernance du réseau. Les exemples utilisent `cookbook_tuple::universal` ; sur Taira, remplacez-le par un alias dans un domaine que vous possédez, ou déployez sur un réseau local généré dont la genèse accorde la portée de l'alias.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Étapes {#steps}

### 1. Copier un contrat Kotodama V1 connu pour être bon {#_1-copy-a-known-good-kotodama-v1-contract}

Travaillez à l'intérieur du Iroha checkout épinglé et copiez l'exemple de retour de tuple du compilateur afin que la source et la chaîne d'outils restent sur le même commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Le code source complet est petit : une fonction d'assistance privée `fn` et une `view fn` publique en lecture seule qui autorise explicitement tout appelant :

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

Kotodama cible la Machine Virtuelle Iroha et son ABI actuel. Ce n'est pas un langage source WASM ou EVM.

### 2. Vérifier, construire et valider l'artéfact {#_2-check-build-and-verify-the-artifact}

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

La première compilation publie l'artifact et les sidecars authentifiés. La deuxième s'exécute en mode lecture seule `--verify` et échoue si toute sortie existante ne correspond pas exactement à la source actuelle. Traitez le fichier `.to` et son manifeste technique comme une seule sortie de compilation révisée.

### 3. Exécutez le bytecode localement {#_3-run-the-bytecode-locally}

`compute` est une `view fn` publique en lecture seule. Exécutez-la avec `debug-view`, qui exécute localement le bytecode compilé sur des données de test facultatives sans soumettre ni payer de transaction.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama les entiers sont rendus comme des chaînes JSON, donc le tuple décodé est `["3", "5"]`.

### 4. Déployer l'artéfact vérifié avec Musubi {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` inspecte les contrats, exécute leurs vues et les débogue, mais ne les déploie pas ; les déploiements sur Taira passent donc par Musubi. Son service de déploiement téléverse les fragments de bytecode, enregistre le manifeste technique vérifié et soumet une opération `CommitContractDeployment`. Il obtient un devis pour chaque transaction, refuse un devis qui modifie le payeur sélectionné, la révision du sponsor ou la limite de gas, et ne déploie l'artéfact précompilé qu'après que la compilation du paquet aux dépendances verrouillées a reproduit ses hachages de code et d'ABI. Sur un réseau local géré par Kagami, `kagami contract deploy` déploie à la place `./build/tuple_return_demo.to` avec `--alias cookbook_tuple::universal --json` ; son reçu se trouve sous `.receipt`, et `kagami context show` affiche la configuration client à utiliser comme `IROHA_CONFIG`.

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

La liaison utilise `--fee-payer authority` ; Musubi établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer. Comparez l’actif facturé renvoyé avec celui que publie la politique actuelle du distributeur. Les appels de contrat n’acceptent la sélection des frais qu’au moyen du devis actif typé ; les métadonnées de transaction `gas_asset_id` ne font pas partie du contrat de première version.

### 5. Lire la vue déployée {#_5-read-the-deployed-view}

`contract view` exécute le point d'entrée en lecture seule sur Torii sans transaction ni frais. Une vue n'a pas de forme transactionnelle : Torii rejette un sélecteur de vue sur ses routes d'appel.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Vérifier {#verify}

Résolvez l'alias, récupérez le manifeste technique sur la chaîne via le hachage cryptographique du code que Torii indique pour la vue déployée, et exécutez la même vue par adresse canonique :

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

Le déploiement n'est terminé que lorsque le reçu de déploiement indique que l'artéfact stocké est vérifié, que l'alias se résout à l'adresse renvoyée, que le manifeste technique est lisible sous le même hachage cryptographique du code, et que les vues locale et Torii renvoient `["3", "5"]`.

## Dépannage {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`, ou le message de l'exécuteur `authority is not permitted to manage contract alias`, signifie que le compte ne peut pas lier cet alias. Utilisez un alias dans un domaine que vous possédez, ou obtenez du propriétaire de cette portée l'octroi exact de l'alias ou celui de son domaine ou espace de données ; sur un réseau local, accordez-le dans la genèse.
- Un rejet lié à un espace de noms protégé signifie que l'espace de noms de l'alias est soumis à la gouvernance. Lister des identifiants de comptes approbateurs ne constitue pas une preuve d'approbation ; utilisez le processus de gouvernance du réseau (`iroha app gov deploy propose`) pour cet espace de noms, ou choisissez un alias en dehors de celui-ci.
- Une incompatibilité du manifeste ou de l’ABI signifie que le bytecode, le manifeste et l’environnement d’exécution du nœud ne décrivent pas le même artefact. Reconstruisez au commit épinglé, puis relancez la compilation avec `--verify`.
- `fee quote changed ... gas bound` signifie que l'intention tapée demandée et le devis en direct ne sont pas d'accord. Re-vérifiez plutôt que de modifier une transaction signée.
- Un déploiement interrompu conserve son plan signé dans un journal. Reprenez-le avec `musubi deploy --resume <JOURNAL>` au lieu de signer un nouveau plan.
- `is read-only and cannot be invoked as a transaction` ou `is not a kotoage or lifecycle entrypoint` signifie que `compute` a été envoyé à une commande d'appel. Cet exemple déclare `view fn` ; utilisez donc `debug-view` localement et `view` sur Torii.
- Les appels de contrat exigent une limite de gas typée et positive. Le contrat d’appel de la première version rejette le gas de niveau supérieur et les métadonnées de l’actif de frais.

## Source et documents connexes {#source-and-related-docs}

- [Implémentation de la commande Kotodama V1 au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Exemple de source retournant un tuple au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Commande de déploiement Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) et le [service natif de déploiement de contrats](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) au commit épinglé
- [Tests d'intégration de contrat au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Contrats intelligents](/fr/blockchain/smart-contracts.md)
- [CLI référence](/fr/get-started/operate-iroha-via-cli.md)
