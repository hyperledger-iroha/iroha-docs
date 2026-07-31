---
translation_locale: fr
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les opérations anonymes {#anonymous-transactions}

Les transactions anonymes en Iroha sont construites à partir d'opérations d'actifs confidentiels. Au lieu d'écrire des transferts de compte à compte public avec des montants publics, un portefeuille transfère la valeur dans un registre protégé et dépense ensuite des billets opaques avec des preuves de connaissance zéro.

Le registre public enregistre toujours qu'une opération confidentielle s'est produite. Il enregistre les engagements, les annulateurs, les hachages de preuve et les événements, mais il n'enregistre pas le propriétaire de la note, le destinataire ou le montant pour le mouvement protégé vers l'autre. L'enveloppe de transaction normale peut toujours révéler le compte soumis, de sorte que "anonymat" signifie ici le mouvement anonyme des actifs et non l'anonymat automatique au niveau du réseau ou du compte.

## Les blocs de construction {#building-blocks}

|Le concept |La représentation du registre |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Note protégée |Un enregistrement de portefeuille privé contenant un actif, le montant, les données du propriétaire et le hasard. |
|Engagement |Une valeur publique de 32 bytes qui s'engage à une note sans révéler ses champs. |
|Nullificateur |Une valeur publique de 32 bytes dérivée lorsqu'une note est dépensée. Iroha rejette les annulateurs répétés pour éviter la double dépense. |
|La racine de mercule|Une racine récente de l'arbre d'engagement des actifs. Les preuves l'utilisent pour montrer que les billets dépensés existent. |
|L' annexe à la preuve |Une `ProofAttachment` contenant des octets de preuve plus une référence à la clé de vérification ou une clé de verification en ligne. |
|Un événement confidentiel .|Un événement de registre tel que `ConfidentialEvent::Shielded`, `Transferred`, ou `Unshielded`. |

Les instructions principales sont les suivantes:

- `RegisterZkAsset`: enregistre un actif comme ayant la capacité de ZK et lie les clés de vérification des transferts, du bouclier et du non-bouclier.
- `Shield`: débite un solde public et ajoute une obligation de billet protégé.
- `ZkTransfer`: dépense des billets protégés dans de nouveaux engagements en billets protégeants.
- `Unshield`: dépense des billets protégés et accorde un solde de compte public.
- `ScheduleConfidentialPolicyTransition` et `CancelConfidentialPolicyTransition`: modifier la politique de confidentialité d'un actif grâce à la gouvernance.

Une définition d'actif comporte également un [`AssetConfidentialPolicy`](/fr/reference/data-model-schema.md). Les contrôles en mode politique qui contrôlent les flux sont valides:

|Mode |Le sens .|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Seuls les soldes et les transferts publics normaux sont acceptés. |
|`Convertible` |Les utilisateurs peuvent déplacer la valeur entre les soldes publics et les billets protégés. |
|`ShieldedOnly` |L'émission et les transferts d'actifs doivent rester dans le registre protégé. |

## Comment les utiliser {#how-to-use-them}

1. Activer le support confidentiel sur les nœuds de validation. Les validateurs doivent s'entendre sur l'arrière-plan du vérificateur, les touches actives de vérification, le paramètre Poseidon/Pedersen IDs, et la version des règles confidentielles.
2. Publier ou enregistrer les clés de vérification et les ensembles de paramètres utilisés par les circuits. Les portefeuilles et les opérateurs doivent se référer aux clés par `VerifyingKeyId`, par exemple `halo2/ipa:vk_transfer`.
3. Enregistrer l'actif en tant que ZK-capable auprès de `RegisterZkAsset`, ou effectuer une transition de politique de `TransparentOnly` à `Convertible` ou `ShieldedOnly`.
4. Gardez les fonds publics avec `Shield`. Le portefeuille crée un engagement de billets et une charge utile cryptée pour le destinataire avant qu'il ne soumette la transaction.
5. Transférer en privé avec `ZkTransfer`. Le portefeuille construit une preuve qu'il possède les billets d'entrée, que les valeurs de saisie et de sortie sont équilibrées et que chaque billet dépensé est ancré dans un arbre d'engagement récent.
6. Ne retirez le bouclier que lorsque la politique d'actifs le permet `Unshield` révèle le montant public et le compte du destinataire, dépense l'annulateur de la note privée, et peut créer des sorties de changement privées.
7. Audit en lisant les événements confidentiels, les dossiers de preuve, l'état d'annulateur et les enregistrements de dépôt anonyme par le biais de requêtes typées et des points d'expiration Torii.

## CLI Exemples {#cli-examples}

Les commandes ZK CLI sont destinées aux flux d'opérateur et de test. Les portefeuilles de production devraient générer des engagements, des charges utiles cryptées, et des preuves avec une bibliothèque de portefeuille/préciseurs avant de soumettre les instructions qui en découlent.

Enregistrez un actif hybride à capacité ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construire une enveloppe de charge utile cryptée pour la note protégée:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

La protection des fonds publics dans le registre protégé de l'actif:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Un bouclier déshydraté avec une fixation à l'épreuve JSON:

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

## SDK Exemple {#sdk-example}

Les octets de preuve exacts proviennent de l'arrière-plan de preuve configuré. La charge utile de la transaction ne nécessite que les entrées publiques et l'annexe de preuve:

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

## Réserve d'actifs anonymes {#anonymous-asset-escrow}

Les parties et l'état de la fiducie sont toujours enregistrés dans le dossier de fiducie, mais les étapes de financement, de libération, d'annulation et de résolution utilisent des annulateurs protégés et des engagements de sortie.

Pour les dépôts détaillés ISI comportement et exemples, voir [Réservation des actifs natifs](/fr/blockchain/escrow.md#anonymous-escrow).

Le cycle de vie est le suivant:

1. `OpenAnonymousAssetEscrow` dépense des notes de financement protégées et crée un engagement de garantie.
2. `AcceptAnonymousAssetEscrow` enregistrer l'acheteur.
3. `MarkAnonymousEscrowPaymentSent` indique que l'acheteur a envoyé le paiement hors chaîne.
4. `ReleaseAnonymousAssetEscrow` dépense l'engagement en caution pour les engagements de sortie de l'acheteur.
5. `CancelAnonymousAssetEscrow` dépense l'engagement de garantie en retour aux engagements de sortie du vendeur lorsqu'il n'a pas été marqué.
6. `OpenAnonymousEscrowDispute` et `ResolveAnonymousEscrowDispute` gèrent des garanties litigieuses avec des hachages de preuves et une fraction contrôlée par le résolveur.

Utilisez les requêtes de fiducie anonymes énumérées dans [Questions](/fr/reference/queries.md#escrow-and-proof-records) pour inspecter les dossiers et les statuts des fiducieux.

## Mathématiques {#math}

La notation ci-dessous décrit le flux d'actifs confidentiels. Les mises en œuvre utilisent le circuit actif et le paramètre IDs de la politique des actifs et du registre des vérificateurs, de sorte que les clients doivent traiter les engagements, les annulateurs et les octets de preuve comme des sorties opaques du portefeuille / proverbe.

Une note protégée peut être décrite comme suit:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

où `owner` est dérivé du matériel d'affichage ou de dépenses du destinataire et `rho` est une note aléatoire.

L'engagement de la note est un engagement caché:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Pour les circuits de transfert confidentiel actuels, les entrées publiques comprennent des engagements de notes, des annulateurs, une racine Merkle, une étiquette d'actif et une chaîne. Le circuit impose un rapport d'engagement de cette forme:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Lorsqu'un billet est dépensé, le portefeuille obtient un annulateur:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` est public. Il ne révèle pas la note, mais il est stable pour cette note et la chaîne, de sorte que Iroha peut refuser une deuxième dépense avec le même annulateur.

L'arbre d'engagement prouve l'existence de la note. Si un portefeuille dépense un engagement `C_i`, la preuve comprend un chemin Merkle privé de `C_i` à une racine publique récente:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Dans le cas d'un transfert protégé, la preuve impose également la conservation de la valeur:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Pour une somme non protégée, le montant public est inclus:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

La preuve présentée peut être résumée comme suit:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

où `public_inputs` sont les engagements, les annulateurs, la racine, l'étiquette d'actif, l'etiquette de chaîne et tout montant public non protégé. Les validateurs vérifient la preuve, puis modifient l'état du registre en ajoutant des engagements de sortie et en marquant les annulateurs d'entrée comme dépensés.

## Ce qui est public {#what-is-public}

Les transactions anonymes ne rendent pas tous les faits observables privés. Les données suivantes peuvent toujours être publiques:

- le hash de la transaction, la hauteur du bloc et l'ordre
- l'autorité de transaction soumettante, sauf si la demande utilise un modèle d'entrée privée ou de relieu
- la définition d'actif utilisée
- annulateurs et engagements de sortie
- les hashs de preuve, les références à la clé de vérification et les hashs d'enveloppe facultatives
- montant public et compte des bénéficiaires pour `Unshield`
- Vendeur, acheteur, statut, timestamps et hashes de preuve anonymes

Concevez des applications pour que ces métadonnées publiques ne révèlent pas la relation commerciale que vous essayez de protéger.

## Références connexes {#related-reference}

- [`AssetConfidentialPolicy`](/fr/reference/data-model-schema.md)
- [`ConfidentialEvent`](/fr/reference/data-model-schema.md)
- [`ProofAttachment`](/fr/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/fr/reference/data-model-schema.md)
- [Demande de garantie et de preuve ](/fr/reference/queries.md#escrow-and-proof-records)
