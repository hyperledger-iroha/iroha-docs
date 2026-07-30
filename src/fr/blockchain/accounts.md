---
translation_locale: fr
translation_source: /blockchain/accounts.md
translation_source_hash: 0eeefc77cc0d4ef047eb0b5ff94e48113a5b54c34e206e1b6f7de483d7389d59
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Comptes

Un compte est une autorité qui peut signer des transactions et enregistrer son propre registre.
Dans le courant Iroha 3 modèle de données, `AccountId` est canonique et sans domaine:
Il est dérivé du contrôleur du compte plutôt que d'un `account@domain`
Une corde.

## La structure

Un enregistré `Account` contient:

- `id`: le canonique `AccountId`
- `metadata`: métadonnées arbitraires des comptes
- `label`: un alias stable facultatif
- `uaid`: une identification de compte universelle facultative utilisée par les flux Nexus
- `opaque_ids`: identifiants opaques liés à l'UID du compte

La charge utile de transaction utilisée pour créer un compte est `NewAccount`- Elle porte .
les mêmes champs d'identité, de métadonnées, d'étiquettes, d'identifiants uniques et d'identifiants opaques utilisés par le
compte enregistré.

`uaid` complète le canonique `AccountId`; il ne le remplace pas.
lorsque les services Nexus ont besoin d'un gestionnaire stable de l'utilisateur ou de l'organisation
Les données de base, les inscriptions à la protection de la vie privée ou la recherche des capacités de service.
le temps de fonctionnement maintient un indice UAID-compte unique, nécessite des identifiants opaques
à fixer par un UAID et rejette les copies ou les collisions opaques
les identifiants. voir
[FHE et UAID](/blockchain/sora-nexus-services.md#fhe-and-uaid) pour le Nexus
débit de la couche de service.

## Contrôleurs de comptes

Le contrôleur définit comment le compte autorise les actions.
le flux utilise une paire de clés Ed25519, mais le modèle de données prend également en charge une plus riche
contrôleur tel que le contrôleur de la politique de signatures multiples.

La configuration du client stocke l'autorité de signature séparément de l'autorité de signature
la configuration:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Vous voyez ? [configuration du client](/guide/configure/client-configuration.md) et
[génération clé](/guide/security/generating-cryptographic-keys.md) pour le
les formats clés actuels.

## Essayez sur Taira.

Lisez quelques identifiants de compte canoniques du réseau public de test Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Pour inspecter les actifs du compte, copier un identifiant du compte à partir du premier appel et le code URL
Ce snippet Python le fait pour la première fois.
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
et nécessite l'installation de Taira financée par les robinets décrite dans
[Connectez-vous SORA Les espaces de données Nexus](/get-started/sora-nexus-dataspaces.md)- Je ne sais pas .

## Enregistrement et autorisations

Les comptes sont enregistrés et non enregistrés avec le générique
[`Register` et `Unregister`](/blockchain/instructions.md#un-register)
Le validateur d'exécution active décide qui peut créer des comptes
et quels jetons ou rôles d'autorisation sont requis.

Après enregistrement, un compte peut:

- signer les transactions
- détenir des actifs
- domaines propres
- recevoir des rôles et des jetons d'autorisation
- stockage de métadonnées
- participer à des flux d'alias, de rekey, de récupération et d'identité Nexus lorsque ces
  Les fonctionnalités sont activées

## Résolution des problèmes d'identité

Si une transaction est rejetée de manière inattendue, vérifiez que:

- la clé publique client correspond à la clé privée utilisée pour la signature
- le compte a été enregistré en génèse ou par une transaction engagée
- l'autorité dispose des autorisations requises par l'instruction
- les scripts ne sont pas utilisés anciennes `account@domain` littéraux où un canonique
  l'adresse du compte est requise

Voir aussi:

- [Autorisations](/blockchain/permissions.md)
- [Les métadonnées](/blockchain/metadata.md)
- [Configuration du client](/guide/configure/client-configuration.md)
- [SORA Les espaces de données Nexus](/get-started/sora-nexus-dataspaces.md)
