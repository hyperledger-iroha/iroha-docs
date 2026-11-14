---
translation_locale: fr
translation_source: /blockchain/accounts.md
translation_source_hash: adc98cbf1fcadae4415d03dcc262eb03f8c95b429527e403d230934ae2f3243c
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Comptes {#accounts}

Un compte est une autorité capable de signer des transactions et de détenir un état du registre. Dans le modèle de données actuel d’Iroha 3, `AccountId` est l’identité canonique, sans domaine : il est dérivé du contrôleur du compte et encodé sous la forme canonique [I105](/fr/reference/i105.md). Le contexte de domaine et d’espace de données lisible par l’humain appartient à des liaisons d’alias de compte distinctes.

## Structure {#structure}

Un `Account` enregistré contient :

- `id` : le `AccountId` canonique
- `metadata` : métadonnées arbitraires du compte
- `label` : un alias stable optionnel
- `uaid` : un identifiant de compte universel optionnel utilisé par les flux SORA Nexus
- `opaque_ids` : identifiants opaques liés au UAID du compte

La charge utile de la transaction utilisée pour créer un compte est `NewAccount`. Elle comporte les mêmes champs d'identité, métadonnées, étiquette, UAID et ID opaque utilisés par le compte enregistré.

`uaid` complète l’`AccountId` canonique ; il ne le remplace pas. Utilisez-le lorsque les services SORA Nexus ont besoin d’un identifiant stable d’utilisateur ou d’organisation entre espaces de données, d’une inscription préservant la confidentialité ou d’une recherche de capacités de service. L’environnement d’exécution maintient un index bijectif entre UAID et comptes, exige que les identifiants opaques soient rattachés par un UAID et rejette les identifiants opaques dupliqués ou en collision. Consultez [FHE et UAID](/fr/blockchain/sora-nexus-services.md#fhe-and-uaid) pour le fonctionnement de la couche de services SORA Nexus.

## Contrôleurs de comptes {#account-controllers}

Le contrôleur définit la manière dont le compte autorise les actions. Le flux client par défaut utilise une paire de clés Ed25519, mais le modèle de données prend également en charge des contrôleurs plus riches tels que les contrôleurs de politique multisignature.

La configuration du client stocke le principal d'autorisation de signature séparément de la configuration des pairs réseau :

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

Voir [configuration du client](/fr/guide/configure/client-configuration.md) et [génération de clé](/fr/guide/security/generating-cryptographic-keys.md) pour les formats de clés actuels.

## Essayez-le sur Taira {#try-it-on-taira}

Listez quelques identifiants de compte canoniques du testnet public Taira :

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Pour inspecter les actifs d'un compte, copiez un identifiant de compte depuis le premier appel et codez-le en URL avant de le placer dans le chemin. Cet extrait Python le fait pour le premier compte listé :

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

Il s’agit d’opérations de lecture publiques. Créer ou modifier un compte nécessite une transaction signée et la configuration Taira alimentée par le faucet, décrite dans [Se connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md).

## Enregistrement et autorisations {#registration-and-permissions}

Les comptes sont enregistrés et non enregistrés avec le générique [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register) instructions. Le validateur d'exécution logiciel actif décide qui peut créer des comptes et quels jetons ou rôles de permission sont nécessaires.

Après l'inscription, un compte peut :

- signer des transactions
- détenir des actifs
- domaines propres
- recevoir des rôles et des jetons de permission
- stocker les métadonnées
- participer aux opérations d’alias, de remplacement de clés, de récupération et d’identité SORA Nexus lorsque ces fonctionnalités sont activées

## Résolution des problèmes d'identité {#troubleshooting-identity-issues}

Si une transaction est refusée de manière inattendue, vérifiez que :

- la clé publique du client correspond à la clé privée utilisée pour la signature
- le compte a été enregistré dans la genèse de la blockchain ou par une transaction engagée
- le mandataire d'autorisation possède les permissions requises par l'instruction
- les champs de compte stricts utilisent l'ID de compte canonique I105, tandis que les noms lisibles sont résolus via une liaison d'alias de compte active

Voir aussi :

- [Autorisations](/fr/blockchain/permissions.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [Espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md)
