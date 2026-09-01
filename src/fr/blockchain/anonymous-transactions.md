---
translation_locale: fr
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Transactions anonymes {#anonymous-transactions}

Les transactions anonymes dans Iroha sont construites à partir d'opérations d'actifs confidentielles. Au lieu d'écrire des transferts publics de compte à compte avec des montants publics, un portefeuille déplace la valeur dans un grand livre blockchain protégé, puis dépense des notes opaques avec des preuves à divulgation nulle de connaissance.

Le grand livre public de la blockchain enregistre toujours qu'une opération confidentielle a eu lieu. Il enregistre les engagements, les nullificateurs, les hachages cryptographiques de preuve et les événements, mais il n'enregistre pas le propriétaire de la note, le destinataire ou le montant pour un mouvement de protégé à protégé. Le conteneur de données de transaction normal peut encore révéler le compte soumetteur, donc « anonyme » ici signifie un mouvement d'actifs anonyme, et non une anonymité automatique au niveau du réseau ou du compte.

## Blocs de construction {#building-blocks}

|Concept|représentation du grand livre blockchain|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Note protégée|Un enregistrement de portefeuille privé contenant un actif, une quantité, des données sur le propriétaire et de l'aléatoire.|
|Engagement|Une valeur publique de 32 octets qui s'engage sur une note sans révéler ses champs.|
|Annulateur|Une valeur publique de 32 octets dérivée lorsqu'une note est dépensée. Iroha rejette les nullificateurs répétés pour empêcher la double dépense.|
|Racine de Merkle|Une racine récente de l'arbre d'engagement de l'actif. Les preuves l'utilisent pour montrer que les notes dépensées existent.|
|Pièce jointe de preuve|Un `ProofAttachment` contenant des octets de preuve ainsi qu'une référence à une clé de vérification ou une clé de vérification intégrée.|
|Événement confidentiel|Un événement de registre blockchain tel que `ConfidentialEvent::Shielded`, `Transferred` ou `Unshielded`.|

Les instructions principales sont :

- `RegisterZkAsset` : enregistre un actif comme capable de ZK et lie les clés de vérification de transfert, de protection et de déprotection.
- `Shield` : débite un solde public et ajoute un engagement de note protégé.
- `ZkTransfer` : dépense des notes protégées en de nouveaux engagements de notes protégées.
- `Unshield` : dépense des notes protégées et crédite un solde de compte public.
- `ScheduleConfidentialPolicyTransition` et `CancelConfidentialPolicyTransition` : modifier la politique de confidentialité d'un actif via la gouvernance.

Une définition d'actif comporte également un [`AssetConfidentialPolicy`](/fr/reference/data-model-schema.md). Le mode de politique contrôle quels flux sont valides :

|Mode|Sens|
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` |Seuls les soldes et transferts publics normaux sont acceptés.|
| `Convertible`     |Les utilisateurs peuvent transférer des valeurs entre les soldes publics et les notes protégées.|
| `ShieldedOnly`    |L'émission et les transferts d'actifs doivent rester dans le registre blockchain protégé.|

## Comment les utiliser {#how-to-use-them}

1. Activer le support confidentiel sur les nœuds validateurs. Les validateurs doivent se mettre d'accord sur le backend du vérificateur, les clés de vérification actives, les identifiants de paramètres Poseidon/Pedersen, et la version des règles confidentielles. Les nœuds rejettent les pairs du réseau ou les blocs dont les condensés cryptographiques des fonctionnalités confidentielles ne correspondent pas.
2. Publiez ou enregistrez les clés de vérification et les ensembles de paramètres utilisés par les circuits. Les portefeuilles et les opérateurs doivent se référer aux clés par `VerifyingKeyId`, par exemple `halo2/ipa:vk_transfer`.
3. Enregistrez l'actif comme étant compatible ZK avec `RegisterZkAsset`, ou mettez en place une transition de politique de `TransparentOnly` vers `Convertible` ou `ShieldedOnly`.
4. Protégez les fonds publics avec `Shield`. Le portefeuille crée un engagement de note et une charge utile chiffrée pour le destinataire avant de soumettre la transaction.
5. Transférez en privé avec `ZkTransfer`. Le portefeuille crée une preuve qu'il possède les notes d'entrée, que les valeurs d'entrée et de sortie sont équilibrées, et que chaque note dépensée est ancrée dans un arbre d'engagement récent.
6. Déprotéger uniquement lorsque la politique d'actifs le permet. `Unshield` révèle le montant public et le compte du destinataire, dépense le nullificateur de note privée et peut créer des sorties de change privées.
7. Audit en lisant des événements confidentiels, des enregistrements de preuve, l'état du neutralisateur et des enregistrements de séquestre anonymes via des requêtes tapées et les points de terminaison Torii API.

## CLI Exemples {#cli-examples}

Les commandes ZK CLI sont destinées aux flux pour opérateur et aux tests. Les portefeuilles de production doivent générer des engagements, des charges utiles chiffrées et des preuves avec une bibliothèque de portefeuille/proof avant de soumettre les instructions résultantes.

Enregistrez un actif compatible ZK :

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construisez un conteneur de données de charge utile chiffré et versionné pour la note protégée :

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Le CLI prépare la politique d'actifs, les références de clé de vérification et le conteneur de données de notes chiffrées. Il n'expose pas les sous-commandes de transaction `shield` ou `unshield`. Construisez ces instructions avec un SDK et soumettez-les en tant que transaction ordinaire citée et signée.

Une pièce jointe de preuve non protégée a cette forme :

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
```

## SDK Exemple {#sdk-example}

Les octets de preuve exacts proviennent du backend de preuve configuré. La charge utile de la transaction ne nécessite que les entrées publiques et la pièce jointe de la preuve :

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

## Compte séquestre d'actifs anonyme {#anonymous-asset-escrow}

L'entiercement d'actifs anonyme utilise le même mécanisme de transfert protégé pour la valeur en dépôt. Les parties et l'état de l'entiercement sont toujours enregistrés dans l'acte d'entiercement, mais les étapes de financement, de libération, d'annulation et de résolution utilisent des nullificateurs protégés et des engagements de sortie.

Pour le comportement détaillé de l'entiercement ISI et des exemples, voir [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#anonymous-escrow).

Le cycle de vie est :

1. `OpenAnonymousAssetEscrow` dépense des notes de financement protégées et crée un engagement en séquestre.
2. `AcceptAnonymousAssetEscrow` enregistre l'acheteur.
3. `MarkAnonymousEscrowPaymentSent` enregistre que l'acheteur a envoyé le paiement hors chaîne.
4. `ReleaseAnonymousAssetEscrow` utilise l'engagement de séquestre pour les engagements de sortie de l'acheteur.
5. `CancelAnonymousAssetEscrow` renvoie l'engagement de séquestre vers les engagements de sortie du vendeur lorsque le paiement n'a pas été marqué.
6. `OpenAnonymousEscrowDispute` et `ResolveAnonymousEscrowDispute` gèrent les dépôts contestés avec des hachages cryptographiques comme preuves et un partage contrôlé par un résolveur.

Utilisez les requêtes d'entiercement anonymes listées dans [Requêtes](/fr/reference/queries.md#escrow-and-proof-records) pour inspecter les dossiers et les statuts d'entiercement.

## Mathématiques {#math}

La notation ci-dessous décrit le flux d'actifs confidentiels. Les implémentations utilisent le circuit actif et les identifiants de paramètres provenant de la politique d'actifs et du registre des vérificateurs, de sorte que les clients doivent considérer les engagements, les nullificateurs et les octets de preuve comme des sorties opaques du portefeuille/proveur.

Une note protégée peut être décrite comme :

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

où `owner` est dérivé du visionnage ou du matériel de dépense du destinataire et `rho` est aléatoire de note.

L'engagement de billet est un engagement caché :

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Pour les circuits de transfert confidentiels actuels, les entrées publiques comprennent les engagements de note, les nullificateurs, une racine de Merkle, une étiquette d'actif et une étiquette de chaîne. Le circuit impose une relation d'engagement de cette forme :

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Lorsqu'une note est dépensée, le portefeuille dérive un nullifier :

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` est public. Il ne révèle pas la note, mais il est stable pour cette note et cette chaîne, donc Iroha peut rejeter une seconde dépense avec le même nullificateur.

L'arbre d'engagement prouve l'existence de la note. Si un portefeuille dépense l'engagement `C_i`, la preuve inclut un chemin Merkle privé de `C_i` à une racine publique récente :

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Pour un transfert de blindé à blindé, la preuve impose également la conservation de la valeur :

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Pour un non-protégé, le montant public est inclus :

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

La preuve soumise peut être résumée comme suit :

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

où `public_inputs` sont les engagements, les nullificateurs, la racine, l'étiquette d'actif, l'étiquette de chaîne et tout montant public non masqué. Le témoin contient les montants des notes, l'aléa, dépenser le matériel, et les chemins de Merkle. Les validateurs vérifient la preuve puis modifient l'état du registre de la blockchain en ajoutant des engagements de sortie et en marquant les nullificateurs d'entrée comme dépensés.

## Qu'est-ce que le public {#what-is-public}

Les transactions anonymes ne rendent pas chaque fait observable privé. Les données suivantes peuvent encore être publiques :

- le hachage cryptographique de la transaction, la hauteur du bloc et l'ordre
- le principe d'autorisation de transaction soumise sauf si l'application utilise un point d'entrée privé ou un modèle de relais
- la définition de l'actif utilisée
- annulateurs et engagements de sortie
- preuves des hachages cryptographiques, références de clés de vérification, et hachages cryptographiques facultatifs des conteneurs de données
- montant public et compte du bénéficiaire pour `Unshield`
- vendeur en séquestre anonyme, acheteur, statut, horodatages et hachages cryptographiques des preuves

Concevez des applications de manière à ce que ces métadonnées publiques ne révèlent pas la relation commerciale que vous essayez de protéger.

## Référence Connexe {#related-reference}

- [`AssetConfidentialPolicy`](/fr/reference/data-model-schema.md)
- [`ConfidentialEvent`](/fr/reference/data-model-schema.md)
- [`ProofAttachment`](/fr/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/fr/reference/data-model-schema.md)
- [Dépôt fiduciaire et requêtes de preuve](/fr/reference/queries.md#escrow-and-proof-records)
