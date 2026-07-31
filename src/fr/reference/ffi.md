---
translation_locale: fr
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Interfaces de fonctions étrangères (FFI) {#foreign-function-interfaces-ffi}

Les `iroha_ffi` la boîte fournit des macros et des caractéristiques pour générer C ABI
des obligations de Rust APIs. Il est utilisé lorsque Iroha les types doivent traverser un FFI
limite, par exemple par SDK les liaisons ou les intégrations d'hôte.

## Pourquoi ? FFI {#why-ffi}

Une fonction est une entité plutôt abstraite, et alors que la plupart des langues sont d'accord sur
ce qu'une fonction devrait faire, la façon dont les fonctions sont représentées est
En outre, dans certaines langues, telles que Rust, les conséquences
d'appeler une fonction et les choses qu'elle est autorisée à faire sont aussi
différent. Rust APIs doivent être appelés d'une autre langue ou
un environnement hôte différent, Iroha utilise une interface de fonction étrangère (FFI)
pour équilibrer les conditions de jeu.

La principale norme utilisée aujourd'hui est l'interface binaire d'application C.
Il s'agit d'une méthode simple, largement disponible et stable.
tout manuellement, mais Iroha Il prévoit `iroha_ffi` boîte à générer
FFI- des fonctions conformes à une fonction existante Rust API.

Vous pouvez, bien sûr, le faire à votre façon. `iroha_ffi` caisse seulement
génère le code que vous auriez besoin de générer de toute façon.
La chaudière nécessaire nécessite un peu de diligence et de discipline.
Chaque appel de fonction sur le FFI la limite est `unsafe` avec le potentiel de
La méthode par laquelle nous avons réussi à le résoudre,
tourne autour de l'utilisation **robuste** `repr(C)` Les types.

::: info

La seule exception sont les pointeurs.
Les indicateurs bruts (comme toujours) ne sont donc utilisés que dans des cas exceptionnels.
En effet, nous fournissons des enveloppes à presque toutes les instances d'une
l'objet dans le Iroha modèle de données, vous ne devriez pas avoir à utiliser des pointeurs bruts
Tout le monde.

:::

## Exemple {#example}

Voici un exemple de génération d'une liaison:

```rust
#[derive(FfiType)]
struct DaysSinceEquinox(u32);

#[ffi_export]
impl DaysSinceEquinox {
    pub fn update_value(&mut self, a: &u8) {
        self.0 = *a as u32;
    }
}
```

L'exemple ci-dessus générera le lien suivant avec
`DaysSinceEquinox` présenté sous forme d'indicateur opaque:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Une génération liée {#ffi-binding-generation}

Les `iroha_ffi` la boîte est utilisée pour générer des fonctions qui peuvent être appelées via
FFI. Il est donné `Rust` les structures et méthodes, ils génèrent la `unsafe` code qui
Vous auriez besoin pour franchir la frontière de liaison.

Une Rust le type est converti en un robuste `repr(C)` type qui peut traverser le
FFI frontière avec `FfiType::into_ffi`. C'est le contraire.
- Je sais. FFI `ReprC` le type est converti en un `Rust` type via
`FfiType::try_from_ffi`.

::: warning

Remarquez que la conversion opposée est faillible et peut entraîner une indéfinition
Nous pouvons faire tout notre possible pour éviter les choses les plus évidentes.
Si vous faites des erreurs, vous devez assurer la correction du programme.

:::

The Les principales caractéristiques qui permettent la génération de liaison sont `ReprC`, `FfiType`, et
`FfiConvert`.

| Traits de caractère        | Définition                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | Ce trait représente un type robuste qui se conforme à C ABI. Le type peut être partagé entre FFI les limites.                                                                |
| `FfiType`    | Cette caractéristique définit une correspondance `ReprC` type pour une donnée `Rust` type. le défini `ReprC` le type est utilisé à la place du `Rust` type dans le API du produit généré FFI fonction. |
| `FfiConvert` | Ce trait définit deux méthodes `into_ffi` et `try_from_ffi` qui sont utilisées pour effectuer la conversion des `Rust` type vers ou depuis `ReprC` type.                                |

Notez qu'il n'y a pas de transfert de propriété sur FFI à l'exception du pointeur opaque
Tous les autres types qui portent la propriété, tels que `Vec<T>`, sont clonés.

### Nom Mangling {#name-mangling}

Notez l'utilisation de deux sous-titres dans les noms générés de FFI les objets:

- Pour le `inherent_fn` méthode définie sur le `StructName` Les États membres FFI
  le nom serait `StructName__inherent_fn`.
- Pour le `MethodName` méthode de la `TraitName` caractéristique dans le
  `StructName` Les États membres FFI le nom serait
  `StructName__TraitName__MethodName`.
- Pour régler le `field_name` dans le champ `StructName` Les États membres FFI
  le nom de la fonction serait `StructName__set_field_name`.
- Pour obtenir le `field_name` dans le champ `StructName` Les États membres FFI
  le nom de la fonction serait `StructName__field_name`.
- Pour obtenir le mutable `field_name` dans le champ `StructName` Les États membres FFI
  le nom de la fonction serait `StrucuName__field_name_mut`.
- Pour les indépendants `module_name::fn_name`, le FFI le nom serait
  `module_name::__fn_name`.
- Pour les traits qui ne sont pas génériques et permettent de partager leurs
  mise en œuvre dans le FFI (voir aussi: `Clone` les points suivants: FFI le nom serait
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
