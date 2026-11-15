---
translation_locale: fr
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 2ca4fc00709839879fe9cb7ea5e5f697505e5e25d4e5a6cd0bd18d406f6e2846
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Prendre en charge les frais d’un espace de données privé {#sponsor-fees-for-a-private-data-space}

Un programme de prise en charge des frais SORA Nexus peut payer les frais d'exécution globale des transactions admissibles acheminées vers un espace de données privé. L'utilisateur signe toujours la transaction complète. Son intention typée `FeePaymentIntent` sélectionne un programme sponsor précis et une révision immuable, une limite de gas lorsqu'elle est requise et des montants maximaux de frais.

Une entrée de catalogue d'espaces de données ne crée pas de racine signée indépendamment. Une racine indépendante d'espace de données possède sa propre devise et sa propre politique de frais inscrites dans l'état validé ; les coffres des sponsors publics ne peuvent pas autoriser les frais de cette racine privée. Définissez la racine d'exécution avant de concevoir la prise en charge des frais.

## 1. Établir la politique de frais inscrite dans l’état validé {#_1-establish-the-committed-fee-policy}

La genèse signée définit un paramètre personnalisé `root_fees_v1` contenant la `RootFeePolicy`. Il fixe la devise des frais, leur destination, le compte de garde des sponsors, les exemptions de demandes et les taux. Chaque bloc ordinaire et chaque devis utilisent la politique validée capturée pour eux. Les modifications autorisées des taux, de la destination des frais et des exemptions de demandes s'appliquent à partir du bloc suivant ; la devise des frais et le compte de garde des sponsors ne peuvent plus changer après le premier bloc.

Pour l'exécution globale, les frais natifs détruisent exactement la devise XOR du réseau signé. Le coffre du programme sponsor fournit cette devise. Les paramètres du nœud et les métadonnées des transactions ne sélectionnent pas de payeur et n'activent pas la prise en charge des frais.

Utilisez les identités canoniques des devises et des comptes du réseau. La résolution d'alias ne doit pas rediriger les identités de devise, de garde ou de destination des frais inscrites dans l'état validé.

## 2. Créer et alimenter un programme sponsor {#_2-create-and-fund-a-sponsor-program}

L'identifiant du programme prend la forme `<canonical-sponsor-account>/<program-name>`. Créez-le au moyen des instructions typées exposées par le SDK et le modèle de données actuels :

| Instruction | Objectif |
| --- | --- |
| `CreateFeeSponsorProgram` | Créer le programme en préparation avec son compte de versement obligatoire. |
| `StageFeeSponsorProgramRevision` | Définir une politique immuable d'admissibilité, d'opérations et de budget. |
| `EnrollFeeSponsorBeneficiary` | Inscrire un bénéficiaire admissible sur la chaîne. |
| `FundFeeSponsorProgram` | Transférer les actifs sous garde et créditer le coffre exact du programme. |
| `ActivateFeeSponsorProgramRevision` | Planifier la première hauteur d'activation possible de la révision préparée. |

Le sponsor ou un gestionnaire précisément délégué autorise l'administration du programme. Les retraits exigent le sponsor lui-même et ne renvoient les fonds qu'au compte de versement enregistré du programme, lorsque celui-ci est suspendu ou en cours de clôture.

Chaque révision spécifie :

- une inscription explicite, ou une inscription accompagnée de l'admissibilité par défaut de la route lorsque celle-ci est permise ;
- des règles d'autorisation et de refus portant sur les identifiants exacts du format binaire des instructions natives, ou sur les adresses de contrats, les empreintes du code et les points d'entrée ;
- pour chaque actif, des limites par transaction, par bloc, par époque du programme et par époque du bénéficiaire ;
- un seuil minimal de réserve et une durée d’époque déterministe.

Une règle de refus prime sur une règle d'autorisation. Le `fee_sponsor_program_id` d'un espace de données n'accorde l'admissibilité par défaut de la route que si la révision active le permet ; la transaction doit toujours nommer le programme et la révision exacts. L'activation peut être reportée jusqu'à l'expiration des allocations encore en cours de la révision précédente.

Les actifs du coffre du sponsor doivent utiliser la politique de solde `Global`. Alimenter uniquement le compte ordinaire du sponsor n'alimente pas le coffre isolé du programme ; un programme ne peut pas consommer le solde d'un autre.

## 3. Obtenir un devis, signer et soumettre la transaction exacte {#_3-quote-sign-and-submit-the-exact-transaction}

Une intégration au SDK effectue les étapes suivantes :

1. Construisez le `TransactionPayload` non signé avec l'autorité, l'exécutable, les horodatages, le nonce, les métadonnées, la révision exacte du programme sponsor et toute limite de gas requise. Les plafonds de frais peuvent initialement être vides.
2. Signez avec le compte la requête `POST /v1/fees/quote` contenant `{"payload": <payload>}`. Le signataire de la requête doit être l'autorité de la transaction.
3. Inspectez la hauteur observée, la route résolue de l'espace de données, les composantes des frais, la source du débit et la capacité du sponsor. Vérifiez que la réponse conserve le payeur sélectionné, la révision et la limite de gas.
4. Remplacez uniquement `payload.fee_payment` par l'intention recommandée, puis signez et soumettez exactement cette charge utile.
5. Suivez la transaction jusqu'à la finalité `Applied` résolue dans l'état et conservez son reçu, y compris le programme sponsor, la révision et les frais réellement appliqués.

Un devis observe le registre ; il ne réserve aucune capacité. L'admission dans la file vérifie de nouveau l'admissibilité et réserve les plafonds signés. Un refus du sponsor rejette la transaction sans se rabattre sur une facturation à l'utilisateur.

La CLI nomme explicitement la même source de frais. Par exemple, une fois que le programme autorise ce transfert d'actif précis et que le compte est admissible :

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Utilisez la révision active et les identifiants exacts de votre réseau. La configuration de l'utilisateur ne contient que son propre signataire ; la clé privée du sponsor n'est pas nécessaire pour soumettre une transaction admissible dont les frais sont pris en charge.

## 4. Décider si l’utilisateur paie des frais applicatifs {#_4-decide-whether-the-user-pays-an-application-fee}

Un sponsor peut couvrir les frais globaux tandis que l'application ne facture rien à l'utilisateur. Si l'application prélève un jeton local, définissez explicitement ce transfert ou cette règle de contrat dans l'exécutable signé par l'utilisateur. Incluez chaque opération dans la politique de la révision du sponsor et examinez le devis de la charge utile complète. Ne déduisez pas un transfert de jetons applicatifs de l'intention de frais réseau.

## Diagnostiquer un refus {#diagnose-a-refusal}

Utilisez le code de frais stable et les détails de résolution renvoyés par le nœud :

| Code | Vérification |
| --- | --- |
| `program_not_found` | Identité canonique exacte du programme. |
| `revision_not_active`, `program_not_active` | Activation de la révision et cycle de vie du programme. |
| `beneficiary_not_eligible` | Inscription ou admissibilité par défaut de la route lorsqu'elle est permise. |
| `operation_not_allowed`, `operation_denied` | Chaque opération signée exacte et chaque règle de refus. |
| `invalid_gas_limit`, `signed_limit_exceeded` | Limite de gas et plafonds signés, comparés à un nouveau devis. |
| `vault_insufficient` | Solde alimenté du coffre de ce programme dans la devise exacte. |
| Codes d’épuisement du budget | Capacité par transaction, par bloc, par époque du programme et par époque du bénéficiaire. |

Conservez l'empreinte de la transaction initiale et les détails du rejet des frais lorsque vous examinez une soumission ambiguë. Confirmez son état avant de construire une transaction de remplacement.

## Sources à la révision fixée {#pinned-sources}

- [Politique de frais, cycle de vie des programmes et protocole de devis](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Instructions typées des programmes sponsors](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [Options CLI de source des frais et transfert d’actifs](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Configuration d’un espace de données](/fr/get-started/sora-nexus-dataspaces.md)
