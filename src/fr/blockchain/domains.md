---
translation_locale: fr
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domaines {#domains}

Les domaines sont nommés espaces de noms enregistrés dans le `World`. Dans le modèle de données actuel Iroha 3 un domaine est qualifié par son espace de données principal, donc l'identificateur canonique est:

```text
domain.dataspace
```

Par exemple, `payments.universal` nomme le domaine `payments` à l'intérieur de l'espace de données `universal`.

## La structure {#structure}

Un `Domain` enregistré contient:

- `id`: l'espace de données qualifié `DomainId`
- `logo`: optionnel pour un logo de domaine `SoraFS` URI
- `metadata`: métadonnées de valeur clé arbitraire
- `owned_by`: le compte qui détient le domaine, généralement le compte qui l'a enregistré

La charge utile du démarrage utilisée pour matérialiser un domaine est `NewDomain`. Elle porte la charge utile `id`, optionnelle `logo` et initiale `metadata`. Le temps d'exécution remplit `owned_by` de l'autorité.

## L'enregistrement {#registration}

La création de domaine ordinaire utilise le flux de configuration d'alias déclaratif. Cela maintient le bail SNS, les capacités du propriétaire, la garde des devis et la ligne de domaine dans une seule transaction atomique `EnsureAlias`. `Register::Domain` reste une surface génèse/bootstrap, et la commande `ledger domain` n'a pas de sous-commande `register`.

Créer une intention `AliasSetupPlanRequestV1` sans secret avec un SDK ou un service d'intégration, puis faire en sorte que le CLI la planifie par rapport à l'état en direct et soumettre ce plan précis:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

L'intention identifie `payments.universal`, son espace de données numérique, canonique I105 le propriétaire, la durée de l'acquisition du bail et la garantie actuelle des cotes de paiement. `POST /v1/aliases/setup/plan`; le plan retourné est lié à la chaîne, l'autorité, l'État et les délais. [`Unregister`](/fr/blockchain/instructions.md#un-register).

La création ou la suppression d'un domaine nécessite l'autorisation de gestion du domaine appropriée sous le validateur active runtime. Les métadonnées du domaine peuvent être mises à jour avec [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue) lorsque l'autorité a l'autoriété de modifier ce domaine.

## Essayez le sur Taira {#try-it-on-taira}

Liste des domaines actuellement visibles sur le réseau de test public Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Mettez le catalogue des voies publiques dans les aliases de l'espace de données:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilisez la première commande lorsqu'une application doit vérifier l'existence d'un domaine.Utilisez le catalogue de faisceaux lorsque vous devez confirmer si un espace de données est public, restreint ou en retard derrière la voie principale.

La configuration de domaine est une écriture payante. Avant de l'essayer sur Taira, enregistrez l'assistant du robinet à partir de [ Obtenez Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) comme `taira_faucet_claim.py`, financer le signataire via le robinet public et joindre les métadonnées des frais:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construire l'intention d'un nom de domaine unique sur les tests répétés, et utiliser Taira Ne réutilisez pas un plan produit pour le localnet ou Minamoto.

## Relations avec d'autres entités {#relationship-to-other-entities}

Les domaines regroupent les objets et fournissent un espace de noms pour les données à portée de domaine. Les comptes eux-mêmes sont sans domaine dans le modèle de données actuel, mais les comptes peuvent posséder des domaines et détenir des actifs dont la définition vit sous des domaines.

Voir aussi:

- [Le monde](/fr/blockchain/world.md)
- [Les actifs ](/fr/blockchain/assets.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Règles de dénomination](/fr/reference/naming.md)
