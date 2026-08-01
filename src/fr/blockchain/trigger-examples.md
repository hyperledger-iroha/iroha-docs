---
translation_locale: fr
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Exemple de déclencheur d'événement {#event-trigger-example}

Cet exemple utilise le compte sans domaine canonique IDs et les définitions d'actifs projetées dans le modèle de données Iroha 3.

Supposons qu'un réseau ait:

- Un compte canonique contrôlé par la clé d'Alice.
- Un compte canonique contrôlé par la clé du Chapelier Fou.
- Une définition d'actif projetée comme `tea` dans le cadre de `wonderland.universal`
- un solde de cet actif détenu par chaque compte

L'objectif est d'enregistrer un déclencheur qui observe le solde du thé d'Alice et soumet un transfert depuis le compte Mad Hatter lorsque l'événement de données correspondante est émis.

## 1. Préparer des comptes et des actifs {#_1-prepare-accounts-and-assets}

Enregistrer d'abord les comptes participants et la définition des actifs. Dans le Iroha courant, le compte IDs provient des responsables du contrôle des comptes, tandis que les domaines projetés utilisent le formulaire `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

La définition d'actif a toujours une adresse opaque canonique. stocker ou demander cette adresse après l'enregistrement et l'utiliser dans l'action déclenchante.

## 2. Choisir l'autorité de déclenchement {#_2-choose-the-trigger-authority}

Définir le compte technique du déclencheur sur un compte dédié lorsque cela est possible. Un compte dédié indique clairement quelles autorisations sont requises pour l' exécution du déclencheur et évite d' accrocher le déclencheurs à un la clé de signature personnelle de l'opérateur.

Le compte technique doit déjà exister et avoir l'autorisation de soumettre les instructions dans le déclencheur exécutable.

## 3. Définir l'exécutable {#_3-define-the-executable}

L'exécutable est la séquence d'instructions que le déclencheur envoie lorsque le filtre à événements correspond.

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Utilisez les constructeurs de type actuels du SDK pour la charge utile finale de transaction. Évitez le codage dur d'ancien texte IDs dans le code déclencheur; analyse ou requête canonique IDs avant de créer l'exécutable.

## 4. Définir le filtre de l'événement {#_4-define-the-event-filter}

Utilisez un filtre d'événements de données qui restreint les événements à l'objet qui vous intéresse:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Gardez les filtres aussi spécifiques que pratiques. Un filtre `AcceptAll` est utile pour le débogage, mais il fait payer chaque événement correspondant le coût de l'évaluation du déclencheur.

## 5. Enregistrez le déclencheur {#_5-register-the-trigger}

Enregistrer le déclencheur avec:

- un stable `TriggerId`
- la séquence d'instructions exécutables
- `Repeats::Indefinitely` ou `Repeats::Exactly(n)`
- le compte technique
- le filtre de l'événement
- les métadonnées facultatives

L'enregistrement du déclencheur lui-même est une transaction normale, de sorte que le compte d'enregistreur a besoin d'une autorisation pour enregistrer les déclencheurs.

## Ordre d'exécution {#execution-order}

Quand un bloc est exécuté:

1. Les instructions de transaction normales fonctionnent d'abord.
2. Les données sur les événements produits par ces instructions sont collectées.
3. Les déclencheurs dont les filtres correspondent à ces événements sont programmés.
4. Les effets générés par le déclencheur sont traités dans le pipeline d'exécution du bloc sans permettre l'exécution de déclencheurs récursifs illimitées.

Si un déclencheur utilise `Repeats::Exactly(n)`, enregistrez un nouveau déclencheurs lorsque le nombre est épuisé et que le même comportement est à nouveau nécessaire.
