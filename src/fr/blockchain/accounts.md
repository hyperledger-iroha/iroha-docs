---
translation_locale: fr
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Comptes {#accounts}

Un compte est une autorité capable de signer des transactions et d'établir son propre registre.
Dans le courant Iroha 3 modèle de données, `AccountId` est canonique et sans domaine:
Il est dérivé du contrôleur de compte et codé canoniquement comme I105.
Le contexte du domaine et de l'espace de données lisibles par l'homme appartient à des alias de compte séparés
les liaisons.

## La structure {#structure}

Un enregistré `Account` contient:

- `id`: le canonique `AccountId`
- `metadata`: métadonnées arbitraires des comptes
- `label`: un alias stable facultatif
- `uaid`: un compte universel facultatif ID utilisé par Nexus les flux
- `opaque_ids`: identifiants opaques liés aux données du compte UAID

La charge utile de transaction utilisée pour créer un compte est `NewAccount`. Elle porte
la même identité, les mêmes métadonnées, l'étiquette; UAID, et opaque ID champs utilisés par les
compte enregistré.

`uaid` complète le canonique `AccountId`; Il ne la remplace pas.
lorsque Nexus les services ont besoin d'un gestionnaire stable de l'utilisateur ou de l'organisation
Les données de base, les inscriptions à la protection de la vie privée ou la recherche des capacités de service.
Le temps de fonctionnement maintient un 1 à 1 UAID- à l'indice de compte, nécessite des identifiants opaques
à fixer par un UAID, et rejette le double ou l'opacité de collision
les identifiants. voir
[FHE et UAID](/fr/blockchain/sora-nexus-services.md#fhe-and-uaid) pour le Nexus
débit de la couche de service.

## Contrôleurs de comptes {#account-controllers}

Le contrôleur définit comment le compte autorise les actions.
le flux utilise une paire de clés Ed25519, mais le modèle de données prend également en charge un plus riche
contrôleur tel que le contrôleur de politique multisignature.

La configuration du client stocke l'autorité de signature séparément des pairs
la configuration:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Vous voyez ? [configuration du client](/fr/guide/configure/client-configuration.md) et
[génération clé](/fr/guide/security/generating-cryptographic-keys.md) pour le
les formats clés actuels.

## Essayez-le . Taira {#try-it-on-taira}

Faites une liste de quelques récits canoniques IDs du public Taira réseau de test:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Pour inspecter les actifs du compte, copier un compte ID depuis le premier appel et URL- le code
avant de le mettre dans le chemin. Python snippet fait ça pour la première fois
compte coté:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Créer ou mettre à jour un compte est une transaction signée
et nécessite le financement du robinet Taira configuration décrite dans
[Connectez-vous SORA Nexus Les bases de données](/fr/get-started/sora-nexus-dataspaces.md).

## Enregistrement et autorisations {#registration-and-permissions}

Les comptes sont enregistrés et non enregistrés avec le générique
[`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register)
Le validateur d'exécution active décide qui peut créer des comptes
et quels jetons ou rôles d'autorisation sont requis.

Après enregistrement, un compte peut:

- signer les transactions
- détenir des actifs
- domaines propres
- recevoir des rôles et des jetons d'autorisation
- stockage de métadonnées
- participer à des alias, à des recours, à des récupérations et Nexus l'identité s'écoule lorsque ces
  Les fonctionnalités sont activées

## Résolution des problèmes d'identité {#troubleshooting-identity-issues}

Si une transaction est rejetée de manière inattendue, vérifiez que:

- la clé publique du client correspond à la clé privée utilisée pour signer
- le compte a été enregistré en génèse ou par une transaction engagée
- l'autorité dispose des autorisations requises par les instructions
- les champs de compte strict utilisent le canonique I105 compte ID, tout en étant lisible
  les noms sont résolus par un alias de compte actif liant

Voir aussi:

- [Autorisations](/fr/blockchain/permissions.md)
- [Les métadonnées](/fr/blockchain/metadata.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [SORA Nexus espaces de données](/fr/get-started/sora-nexus-dataspaces.md)
