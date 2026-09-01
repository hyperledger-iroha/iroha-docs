---
translation_locale: fr
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Exemple de déclencheur d'événement {#event-trigger-example}

Cet exemple utilise des identifiants de compte sans domaine canoniques et des définitions d'actifs projetées dans le modèle de données Iroha 3.

Supposons qu'un réseau ait :

- un compte canonique contrôlé par la clé de Alice
- un compte canonique contrôlé par la clé de Mad Hatter
- une définition d'actif projetée comme `tea` sous `wonderland.universal`
- un solde de cet actif détenu par chaque compte

L'objectif est d'enregistrer un déclencheur qui observe le solde de thé de Alice et soumet un transfert depuis le compte Mad Hatter lorsque l'événement de données correspondant est émis.

## 1. Préparer les comptes et les actifs {#_1-prepare-accounts-and-assets}

Enregistrez d'abord les comptes participants et la définition de l'actif. Dans le Iroha actuel, les identifiants de compte proviennent des contrôleurs de compte, tandis que les domaines projetés utilisent le formulaire `domain.dataspace` :

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

La définition de l'actif a toujours une adresse opaque canonique. Stockez ou interrogez cette adresse après l'enregistrement et utilisez-la dans l'action de déclenchement.

## 2. Choisissez le principal d'autorisation du déclencheur {#_2-choose-the-trigger-authority}

Attribuez le compte technique du déclencheur à un compte dédié lorsque cela est possible. Un compte dédié permet de clarifier les autorisations nécessaires pour l'exécution du déclencheur et évite de l'associer à la clé de signature personnelle d'un opérateur.

Le compte technique doit déjà exister et doit avoir l'autorisation de soumettre les instructions dans le programme déclencheur exécutable.

## 3. Définir l'exécutable {#_3-define-the-executable}

L’exécutable est la séquence d’instructions que le déclencheur soumet lorsque le filtre d’événement correspond. Pour cet exemple, il contient un transfert :

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Utilisez les constructeurs typés actuels de SDK pour la charge utile finale de la transaction. Évitez de coder en dur de anciens identifiants textuels dans le code du déclencheur ; analysez ou interrogez les identifiants canoniques avant de construire l'exécutable.

## 4. Définir le filtre d'événement {#_4-define-the-event-filter}

Utilisez un filtre data-event qui limite les événements à l'objet qui vous intéresse :

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Gardez les filtres aussi spécifiques que possible. Un filtre `AcceptAll` est utile pour le débogage, mais il fait que chaque événement correspondant paie le coût de l’évaluation du déclencheur.

## 5. Enregistrer le déclencheur {#_5-register-the-trigger}

Enregistrez le déclencheur avec :

- une écurie `TriggerId`
- la séquence d'instructions exécutable
- `Repeats::Indefinitely` ou `Repeats::Exactly(n)`
- le compte technique
- le filtre d'événement
- métadonnées optionnelles

L'enregistrement d'un déclencheur est en soi une transaction normale, donc le compte enregistrant doit avoir l'autorisation d'enregistrer des déclencheurs. Le compte technique a besoin des autorisations requises par le programme exécutable du déclencheur.

## Ordre d'exécution {#execution-order}

Quand un bloc s'exécute :

1. Les instructions de transaction normales s'exécutent en premier.
2. Les événements de données produits par ces instructions sont collectés.
3. Les déclencheurs dont les filtres correspondent à ces événements sont programmés.
4. Les effets produits par les déclencheurs sont gérés dans le pipeline de traitement de l'exécution des blocs sans permettre une exécution récursive illimitée des déclencheurs.

Si un déclencheur utilise `Repeats::Exactly(n)`, enregistrez un nouveau déclencheur lorsque le nombre est épuisé et que le même comportement est de nouveau nécessaire.
