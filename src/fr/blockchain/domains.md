---
translation_locale: fr
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Domaines {#domains}

Les domaines sont des espaces de noms nommés enregistrés dans le `World`. Dans le modèle de données actuel Iroha 3, un domaine est qualifié par son espace de données parent, donc l'identifiant canonique est :

```text
domain.dataspace
```

Par exemple, `payments.universal` nomme le domaine `payments` à l'intérieur de l'espace de données `universal`.

## Structure {#structure}

Un `Domain` enregistré contient :

- `id` : le `DomainId` qualifié par l'espace de données
- `logo` : un `SoraFS` URI facultatif pour un logo de domaine
- `metadata` : métadonnées clé-valeur arbitraires
- `owned_by` : le compte qui possède le domaine, normalement le compte qui l'a enregistré

La charge utile d’amorçage utilisée pour matérialiser un domaine est `NewDomain`. Elle contient le `id`, le `logo` facultatif et le `metadata` initial. L’environnement d’exécution renseigne `owned_by` à partir de l’autorité. Les clients ordinaires ne soumettent pas directement cette charge utile.

## Inscription {#registration}

La création de domaine ordinaire utilise le flux de configuration d'alias déclaratif. Cela maintient le bail SNS, les capacités du propriétaire, le protection de cotation et la ligne de domaine dans une seule transaction atomique `EnsureAlias`. `Register::Domain` reste une surface de genèse/bootstrap, et la commande `ledger domain` n'a pas de sous-commande `register`.

Créez une intention `AliasSetupPlanRequestV1` sans secret avec un SDK ou un service d'intégration, puis faites planifier cela par le CLI par rapport à l'état en direct et soumettez ce plan exact :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

L’intention identifie `payments.universal`, son espace de données numérique, son propriétaire au format canonique I105, la durée d’acquisition du bail et les contrôles du devis courant de politique et de paiement. Le point de terminaison du planificateur est `POST /v1/aliases/setup/plan` ; le plan renvoyé est lié à la chaîne, à l’autorité, à l’état et à l’échéance. La suppression du domaine utilise toujours [`Unregister`](/fr/blockchain/instructions.md#un-register).

Créer ou supprimer un domaine nécessite la gestion appropriée du domaine autorisation sous le validateur d'exécution logicielle actif. Les métadonnées de domaine peuvent être mises à jour avec [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue) lorsque le principal d'autorisation a la permission de modifier ce domaine.

## Essayez-le sur Taira {#try-it-on-taira}

Listez les domaines actuellement visibles sur le testnet public Taira :

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Associez les voies du catalogue public aux alias d’espaces de données :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilisez la première commande lorsqu’une application doit vérifier l’existence d’un domaine. Utilisez le catalogue des voies pour inspecter celles qui sont associées à un espace de données, notamment la visibilité publique ou restreinte de chaque voie et son état de synchronisation par rapport à la voie principale.

La configuration d’un domaine est une écriture soumise à des frais. Avant de l’essayer sur Taira, alimentez le compte signataire avec la procédure de faucet préparée dans [Obtenir des XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), puis appliquez le plan en précisant le payeur des frais. La CLI calcule les frais exacts avant la signature :

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construisez l'intention pour un nom de domaine unique lors des exécutions répétées sur le testnet, et utilisez la politique actuelle de Taira et le garde-cotation des frais en actifs. Ne réutilisez pas un plan produit pour le localnet ou Minamoto.

## Relation avec d'autres entités {#relationship-to-other-entities}

Les domaines regroupent les objets du grand livre de la blockchain et fournissent un espace de noms pour les données à l'échelle du domaine. Les définitions d'actifs utilisent des identifiants qualifiés par le domaine, et les requêtes peuvent lister les domaines ou trouver des objets limités à un domaine. Les comptes eux-mêmes n'ont pas de domaine dans le modèle de données actuel, mais les comptes peuvent posséder des domaines et détenir des actifs dont les définitions se trouvent sous des domaines.

Voir aussi :

- [Monde](/fr/blockchain/world.md)
- [Actifs](/fr/blockchain/assets.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Règles de dénomination](/fr/reference/naming.md)
