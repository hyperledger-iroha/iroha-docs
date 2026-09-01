---
translation_locale: fr
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Comptes {#accounts}

Un compte est un principal d'autorisation qui peut signer des transactions et posséder l'état du registre blockchain. Dans le modèle de données actuel Iroha 3, `AccountId` est canonique et sans domaine : il est dérivé du contrôleur de compte et encodé de manière canonique comme [I105](/fr/reference/i105.md). Le domaine lisible par l'homme et le contexte de l'espace de données appartiennent à des liaisons séparées d'alias de compte.

## Structure {#structure}

Un `Account` enregistré contient :

- `id` : le `AccountId` canonique
- `metadata` : métadonnées arbitraires du compte
- `label` : un alias stable optionnel
- `uaid` : un identifiant de compte universel optionnel utilisé par les flux Nexus
- `opaque_ids` : identifiants opaques liés au UAID du compte

La charge utile de la transaction utilisée pour créer un compte est `NewAccount`. Elle comporte les mêmes champs d'identité, métadonnées, étiquette, UAID et ID opaque utilisés par le compte enregistré.

`uaid` complète le `AccountId` canonique ; il ne le remplace pas. Utilisez-le lorsque les services Nexus ont besoin d’un identifiant stable d’utilisateur ou d’organisation entre plusieurs espaces de données, d’une inscription respectueuse de la vie privée ou d’une recherche de capacités de service. L’environnement d’exécution maintient un index bijectif entre UAID et compte, exige que les identifiants opaques soient rattachés au moyen d’un UAID et rejette les doublons ou collisions. Voir [FHE et UAID](/fr/blockchain/sora-nexus-services.md#fhe-and-uaid) pour le flux de la couche de services Nexus.

## Contrôleurs de comptes {#account-controllers}

Le contrôleur définit la manière dont le compte autorise les actions. Le flux client par défaut utilise une paire de clés Ed25519, mais le modèle de données prend également en charge des contrôleurs plus riches tels que les contrôleurs de politique multisignature.

La configuration du client stocke le principal d'autorisation de signature séparément de la configuration des pairs réseau :

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
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

Ce sont des lectures publiques. La création ou la mise à jour d'un compte est une transaction signée et nécessite la configuration Taira financée par le testnet décrite dans [Connecter à SORA Nexus Espaces de données](/fr/get-started/sora-nexus-dataspaces.md).

## Enregistrement et autorisations {#registration-and-permissions}

Les comptes sont enregistrés et non enregistrés avec le générique [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register) instructions. Le validateur d'exécution logiciel actif décide qui peut créer des comptes et quels jetons ou rôles de permission sont nécessaires.

Après l'inscription, un compte peut :

- signer des transactions
- détenir des actifs
- domaines propres
- recevoir des rôles et des jetons de permission
- stocker les métadonnées
- participer aux flux d'identité alias, rekey, récupération et Nexus lorsque ces fonctionnalités sont activées

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
- [SORA Nexus espaces de données](/fr/get-started/sora-nexus-dataspaces.md)
