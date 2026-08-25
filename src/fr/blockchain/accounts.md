---
translation_locale: fr
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Comptes {#accounts}

Un compte est une autorité qui peut signer des transactions et son propre état de registre. Dans le modèle de données actuel Iroha 3, `AccountId` est canonique et sans domaine: il est dérivé du contrôleur du compte et codé canoniquement comme [I105](/fr/reference/i105.md). Le contexte du domaine et de l'espace de données lisibles par l'homme appartient à des liaisons séparées sous le nom d'alias compte.

## La structure {#structure}

Un `Account` enregistré contient:

- `id`: le texte canonique `AccountId`
- `metadata`: métadonnées de comptes arbitraires
- `label`: un nom de famille stable facultatif
- `uaid`: compte universel optionnel ID utilisé par les flux Nexus
- `opaque_ids`: identifiants opaques liés au UAID du compte.

La charge utile de transaction utilisée pour créer un compte est `NewAccount`. Elle contient les mêmes champs d'identité, de métadonnées, d'étiquette, UAID et opaques ID utilisés par le compte enregistré.

`uaid` complète le canonique `AccountId`; il ne le remplace pas. Utilisez-le lorsque les services Nexus ont besoin d'un gestionnaire stable de l'utilisateur ou de l'organisation sur des espaces de données, d'une inscription préservant la vie privée ou d'une recherche de capacités de service. Le temps d'exécution maintient un indice UAID à compte, exige que des identifiants opaques soient attachés via un UAID, et rejette les identifiants opacs dupliqués ou en collision. Voir [FHE et UAID](/fr/blockchain/sora-nexus-services.md#fhe-and-uaid) pour le flux de couche de service Nexus .

## Responsables du contrôle des comptes {#account-controllers}

Le contrôleur définit la façon dont le compte autorise les actions. Le flux client par défaut utilise une paire de clés Ed25519, mais le modèle de données prend également en charge des contrôleurs plus riches tels que les contrôleurs de politique multisignatures.

La configuration du client stocke l'autorité de signature séparément de la configuration des pairs:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Vous voyez ? [configuration du client](/fr/guide/configure/client-configuration.md) et [génération clé](/fr/guide/security/generating-cryptographic-keys.md) pour les formats clés actuels.

## Essayez le sur Taira {#try-it-on-taira}

Listez quelques comptes canoniques IDs du réseau de test public Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Pour vérifier les actifs du compte, copier un compte ID à partir du premier appel et URL- le code avant de le mettre dans le chemin. Python snippet le fait pour le premier compte inscrit:

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

Il s'agit de lectures publiques. La création ou la mise à jour d'un compte est une transaction signée et nécessite la configuration Taira financée par robinet décrite dans [Connectez-vous aux bases de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md). "

## Enregistrement et autorisations {#registration-and-permissions}

Les comptes sont enregistrés et non enregistrés avec les instructions génériques [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register). Le validateur de temps d'exécution actif décide qui peut créer des comptes et quels jetons ou rôles d'autorisation sont requis.

Une fois enregistré, un compte peut:

- signer les transactions
- détenir des actifs
- propriété de domaine
- recevoir des rôles et des jetons d'autorisation
- stockage de métadonnées
- participer à des flux d'alias, de rekey, de récupération et d'identité Nexus lorsque ces caractéristiques sont activées

## Résolution des problèmes d'identité {#troubleshooting-identity-issues}

Si une transaction est rejetée de manière inattendue, vérifiez que:

- la clé publique du client correspond à la clé privée utilisée pour signer
- le compte a été enregistré à l'origine ou par une transaction engagée
- l'autorité dispose des autorisations requises par l'instruction
- Les champs de compte strict utilisent le compte canonique I105 ID, tandis que les noms lisibles sont résolus par un alias de compte actif liant.

Voir aussi:

- [Autorisations ](/fr/blockchain/permissions.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Configuration du client ](/fr/guide/configure/client-configuration.md)
- [SORA Nexus espaces de données](/fr/get-started/sora-nexus-dataspaces.md)
