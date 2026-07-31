---
translation_locale: fr
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Exemple de déclencheur d'événement {#event-trigger-example}

Cet exemple utilise un compte sans domaine canonique IDs et l'actif prévu
définitions dans le Iroha 3 modèle de données.

Supposons qu'un réseau ait:

- un compte canonique contrôlé par la clé d'Alice
- Un compte canonique contrôlé par la clé du Chapelier Fou.
- une définition d'actif projetée comme `tea` sous `wonderland.universal`
- un solde de cet actif détenu par chaque compte

L'objectif est d'enregistrer un déclencheur qui observe l'équilibre de thé d'Alice et
soumet un transfert depuis le compte Mad Hatter lorsque l'événement de correspondance des données est
émis.

## 1. préparer des comptes et des actifs {#_1-prepare-accounts-and-assets}

Enregistrez d'abord les comptes participants et la définition des actifs.
courant Iroha, compte IDs provenant des contrôleurs de comptes, alors que les projections
utilisation des domaines `domain.dataspace` formule:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

La définition d'actif a toujours une adresse opaque canonique.
adresse après enregistrement et l'utiliser dans l'action déclenchante.

## 2. Choisir l'autorité de déclenchement {#_2-choose-the-trigger-authority}

S'il est possible, définissez le compte technique du déclencheur sur un compte dédié.
compte dédié indique clairement quelles autorisations sont requises pour déclencher
l'exécution et évite de relier le déclencheur à la signature personnelle d'un opérateur
La clé.

Le compte technique doit déjà exister et avoir l'autorisation de soumettre le
les instructions de l'exécutable du déclencheur.

## 3. Définir l'exécutable {#_3-define-the-executable}

L'exécutable est la séquence d'instructions que le déclencheur envoie lorsque l'événement
Pour cet exemple, il contient un transfert:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Utilisez le SDK Les constructeurs actuels sont typés pour la charge utile de transaction finale.
code dur de texte ancien IDs dans le code déclencheur; analyse ou requête canonique IDs
avant de construire l'exécutable.

## 4. Définir le filtre d'événement {#_4-define-the-event-filter}

Utilisez un filtre d'événements de données qui restreint les événements à l'objet qui vous intéresse:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Gardez les filtres aussi précis que pratiques. `AcceptAll` le filtre est utile pour
débogage, mais il fait chaque événement correspondant payer le coût du déclencheur
l'évaluation.

## 5. Enregistrer le déclencheur {#_5-register-the-trigger}

Enregistrez le déclencheur avec:

- une étable `TriggerId`
- la séquence d'instructions exécutables
- `Repeats::Indefinitely` ou `Repeats::Exactly(n)`
- le compte technique
- le filtre d'événement
- métadonnées facultatives

L'enregistrement du déclencheur lui-même est une transaction normale, de sorte que l'enregistration
Le compte technique a besoin de l'autorisation pour enregistrer les déclencheurs.
les autorisations requises par le déclencheur exécutable.

## Ordre d'exécution {#execution-order}

Lorsque un bloc est exécuté:

1. Les instructions de transaction normales fonctionnent d'abord.
2. Les données sur les événements produits par ces instructions sont collectées.
3. Les déclencheurs dont les filtres correspondent à ces événements sont programmés.
4. Les effets générés par le déclencheur sont traités dans le pipeline d'exécution du bloc sans
   permettant l'exécution de déclencheurs récursifs illimités.

Si un déclencheur utilise `Repeats::Exactly(n)`, enregistrer un nouveau déclencheur lorsque le compte
est épuisé et le même comportement est nécessaire à nouveau.
