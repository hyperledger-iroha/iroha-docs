---
translation_locale: fr
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transactions anonymes

Transactions anonymes en Iroha sont constitués d'actifs confidentiels
Les transferts de comptes à comptes publiques
les montants publics, un portefeuille déplace la valeur dans un registre protégé et dépense ensuite
des notes opaques avec des preuves de connaissance zéro.

Le registre public indique toujours qu'une opération confidentielle s'est produite.
enregistrent des engagements, des annulateurs, des hashes de preuve et des événements, mais il ne
enregistrer le propriétaire, le destinataire ou le montant de la note pour les billets protégés
Le chiffre d'affaires normal peut encore révéler la soumission
compte, donc "anonyme" ici signifie mouvement anonyme d'actifs, pas automatique
l'anonymat au niveau du réseau ou du compte.

## Blocs de construction

| Concept            | Représentation du registre                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Note protégée      | Un enregistrement de portefeuille privé contenant un actif, un montant, des données de propriétaire et un hasard.                                   |
| L'engagement         | Une valeur publique de 32 bytes qui s'engage sur une note sans révéler ses champs.                                        |
| Nullificateur          | Une valeur publique de 32 bytes dérivée lorsqu'une note est dépensée. Iroha rejette les annulations répétées pour éviter les doubles dépenses. |
| Racine de mercule        | Une racine récente de l'arbre d'engagement de l'actif.                        |
| Appareil d'étanchéité   | Une `ProofAttachment` contenant des octets de preuve plus une référence à la clé de vérification ou une clé de vérification en ligne.                 |
| Un événement confidentiel | Un événement de registre tel que `ConfidentialEvent::Shielded`Il y en a . `Transferred`ou `Unshielded`- Je ne sais pas .                              |

Les principales instructions sont les suivantes:

- `RegisterZkAsset`: enregistre un actif en tant qu'actif ZK et oblige le transfert,
  le bouclier et les clés de vérification non bouclées.
- `Shield`: débite un solde public et ajoute un engagement en billets protégés.
- `ZkTransfer`: dépense des billets protégés dans de nouveaux engagements en billets protégés.
- `Unshield`: dépense des billets protégés et crédite un solde de compte public.
- `ScheduleConfidentialPolicyTransition` et
  `CancelConfidentialPolicyTransition`: modifier la confidentialité d'un actif
  la politique par la gouvernance.

Une définition d'actif comporte également un
[`AssetConfidentialPolicy`](/reference/data-model-schema.md)- Je ne sais pas .
Les contrôles de mode de politique qui permettent de contrôler les flux sont valables:

| Mode de fonctionnement              | La signification                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | Seuls les soldes et les transferts publics normaux sont acceptés.          |
| `Convertible`     | Les utilisateurs peuvent déplacer la valeur entre les soldes publics et les billets protégés. |
| `ShieldedOnly`    | L'émission et les transferts d'actifs doivent rester dans le registre protégé.   |

## Comment les utiliser

1. Activer le support confidentiel sur les nœuds de validateur.
   l'arrière-plan du vérificateur, les clés de vérification actives, paramètre Poseidon/Pedersen
   Les nœuds rejettent les pairs ou les blocs avec
   des extraits de caractéristiques confidentielles non correspondants.
2. Publier ou enregistrer les clés de vérification et les ensembles de paramètres utilisés par le
   Les portefeuilles et les opérateurs doivent se référer aux clés par
   `VerifyingKeyId`Par exemple , `halo2/ipa:vk_transfer`- Je ne sais pas .
3. Enregistrer l'actif en tant que titulaire de ZK auprès de `RegisterZkAsset`, ou à l'étape a
   transition de la politique à `TransparentOnly` à `Convertible` ou
   `ShieldedOnly`- Je ne sais pas .
4. Les fonds publics sont protégés par `Shield`Le portefeuille crée un engagement .
   et la charge utile cryptée pour le destinataire avant qu'il ne soumette le
   une transaction.
5. Transfert privé avec `ZkTransfer`Le portefeuille prouve que
   possède les notes d'entrée, que les valeurs d'entrée et de sortie sont équilibrées et que
   Chaque billet dépensé est ancré dans un arbre d'engagement récent.
6. Il ne peut être débloqué que si la politique d'actifs le permet. `Unshield` révèle le
   montant public et compte du destinataire, dépense l'annulateur de billets privés,
   et peut créer des sorties de changement privées.
7. Audit en lisant les événements confidentiels, les dossiers de preuve, l'état d'annulateur,
   et des enregistrements de dépôt anonymes par le biais de requêtes typées et Torii les points de fin.

## Exemples de CLI

Les commandes ZK CLI sont destinées aux flux d'opérateur et d'essai.
Les portefeuilles devraient générer des engagements, des charges utiles cryptées et des preuves avec un
la bibliothèque de portefeuille/préciseur avant de soumettre les instructions qui en découlent.

Enregistrer un actif hybride à capacité ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construisez une enveloppe de charge utile chiffrée pour la note protégée:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Les fonds publics protégés dans le registre protégé des actifs:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Déverrouillé avec une pièce jointe JSON:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## Exemple du SDK

Les octets de preuve exacts proviennent de l'arrière-plan de la preuve configurée.
la charge utile de la transaction ne nécessite que les entrées publiques et l'annexe de preuve:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## Réservation des actifs anonymes

Les garanties d'actifs anonymes utilisent la même machine de transfert protégée pour:
Les parties et l'état de l'escroquerie sont toujours enregistrés dans le
enregistrement de garantie, mais les lignes de financement, de libération, d'annulation et de résolution
utiliser des annulateurs protégés et des engagements de sortie.

Pour un comportement et des exemples détaillés des ISI de dépôt, voir
[Réservation des actifs natifs](/blockchain/escrow.md#anonymous-escrow)- Je ne sais pas .

Le cycle de vie est:

1. `OpenAnonymousAssetEscrow` dépense des billets de financement protégés et crée un
   l'engagement de dépôt de garantie.
2. `AcceptAnonymousAssetEscrow` enregistrement de l'acheteur.
3. `MarkAnonymousEscrowPaymentSent` enregistrements indiquant que l'acheteur a envoyé le paiement
   hors chaîne.
4. `ReleaseAnonymousAssetEscrow` dépense l'engagement de garantie à l'acheteur
   engagements de production.
5. `CancelAnonymousAssetEscrow` dépense l'engagement de garantie au vendeur
   les engagements de sortie lorsque le paiement n'a pas été marqué.
6. `OpenAnonymousEscrowDispute` et `ResolveAnonymousEscrowDispute` manette
   Les escrocs contestés avec des hachages de preuves et une fraction contrôlée par le résolveur.

Utilisez les requêtes de garantie anonymes énumérées dans
[Les questions](/reference/queries.md#escrow-and-proof-records) pour inspecter les dépôts
les dossiers et les statuts.

## Les maths

La notation ci-dessous décrit le flux d'actifs confidentiels.
utiliser les identifiants de circuit actif et de paramètre de la politique d'actif et du vérificateur
le registre, de sorte que les clients doivent traiter les engagements, annulateurs, et les octets de preuve
en tant que sorties opaques du portefeuille/préciseur.

Une note protégée peut être décrite comme suit:

$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$

où `owner` est dérivé du matériel vu ou dépensé par le destinataire et
`rho` est la note aléatoire.

L'engagement de la note est un engagement caché:

$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$

Pour les circuits de transfert confidentiels actuels, les entrées publiques comprennent:
les engagements, les annulateurs, une racine Merkle, un label d'actif et un label de chaîne.
Le circuit impose une relation d'engagement de cette forme:

$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$

Lorsqu'une note est dépensée, le portefeuille obtient un annulateur:

$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$

`N` Il ne révèle pas la note, mais il est stable pour cette note.
et la chaîne, donc Iroha peut rejeter une deuxième dépense avec le même annulateur.

L'arbre de l'engagement prouve l'existence des notes.
`C_i`, la preuve inclut un chemin de Merkle privé de `C_i` à une récente
racine publique:

$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$

Pour un transfert protégé vers un transfert protégé, la preuve impose également la valeur
la conservation:

$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$

Pour une somme non protégée, le montant public est inclus:

$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$

La preuve présentée peut être résumée comme suit:

$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$

où `public_inputs` sont les engagements, les annulateurs, la racine, l'étiquette de l'actif,
le témoin contient la note
les quantités, le hasard, le matériel de dépense et les chemins de Merkle.
l'état de preuve puis de mutation du registre en ajoutant des engagements de sortie et
marquer les annulateurs d'entrée comme dépensés.

## Ce qui est public

Les transactions anonymes ne rendent pas chaque fait observable privé.
les données suivantes peuvent toujours être publiques:

- le hash de la transaction, la hauteur du bloc et la commande
- l'autorité de transaction soumettante, sauf si la demande utilise un
  point d'entrée privé ou modèle de relieu
- la définition d'actif utilisée
- annulateurs et engagements de sortie
- les hashs de preuve, les références de clé de vérification et les hashs d'enveloppe facultatives
- montant public et compte du bénéficiaire pour `Unshield`
- Vendeur, acheteur, statut, timestamps et hashes de preuve anonymes

Applications de conception de sorte que ces métadonnées publiques ne révèlent pas l'entreprise
la relation que vous essayez de protéger.

## Références connexes

- [`AssetConfidentialPolicy`](/reference/data-model-schema.md)
- [`ConfidentialEvent`](/reference/data-model-schema.md)
- [`ProofAttachment`](/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/reference/data-model-schema.md)
- [Enquêtes sur les dépôts et les preuves](/reference/queries.md#escrow-and-proof-records)
