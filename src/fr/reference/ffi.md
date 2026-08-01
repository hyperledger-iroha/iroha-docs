---
translation_locale: fr
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Interfaces de fonction extérieures (FFI) {#foreign-function-interfaces-ffi}

Les États membres `iroha_ffi` la caisse fournit des macros et des traits pour générer C ABI des obligations de Rust APIs. Elle est utilisée lorsque: Iroha les types doivent traverser un FFI limite, par exemple par SDK les liaisons ou les intégrations d'hôte.

## Pourquoi FFI {#why-ffi}

Une fonction est une entité plutôt abstraite, et alors que la plupart des langues sont d'accord sur ce qu'une fonction devrait faire, la façon dont les fonctions sont représentées est très différente. En outre, dans certaines langues, comme Rust, les conséquences d'appeler une fonction et les choses qu'elle est autorisée à faire sont également différentes. Lorsque Rust APIs doit être appelé depuis une autre langue ou un environnement hôte différent, Iroha utilise une interface de fonction étrangère (FFI) pour équilibrer les conditions de jeu.

La principale norme utilisée aujourd'hui est l'interface binaire d'application C. Elle est simple, largement disponible et stable. En principe, vous pouvez tout faire manuellement, mais Iroha fournit la boîte `iroha_ffi` pour générer des fonctions conformes à FFI à partir d'une fonction existante Rust API.

Vous pouvez, bien sûr, le faire à votre guise. La boîte `iroha_ffi` génère simplement le code que vous auriez besoin de générer de toute façon. Chaque appel de fonction au-delà de la limite FFI est `unsafe` avec le potentiel de causer un comportement indéfini. La méthode par laquelle nous avons réussi à le résoudre, tourne autour de l'utilisation de robustes types `repr(C)`.

::: info

La vérification de nullité et la validité ne peuvent être appliquées à l'échelle mondiale, de sorte que les pointeurs bruts (comme toujours) ne sont utilisés que dans des cas exceptionnels. Étant donné que nous fournissons des enveloppes autour de presque toutes les instances d'un objet dans le modèle de données Iroha, vous ne devriez pas avoir à utiliser des pointeurs bruts du tout.

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

L'exemple ci-dessus génère la liaison suivante avec `DaysSinceEquinox` représentée comme un pointeur opaque:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Génération obligatoire {#ffi-binding-generation}

La boîte `iroha_ffi` est utilisée pour générer des fonctions qui peuvent être appelées par l'intermédiaire de FFI. Compte tenu des structures et méthodes `Rust`, elles génèrent le code `unsafe` dont vous auriez besoin pour franchir la limite de liaison.

Une Rust le type est converti en un robuste `repr(C)` type qui peut traverser le FFI la frontière avec `FfiType::into_ffi`. C'est aussi le contraire: FFI `ReprC` le type est converti en un `Rust` type via `FfiType::try_from_ffi`.

::: warning

Notez que la conversion opposée est faillible et peut entraîner un comportement indéfini. Bien que nous puissions faire de notre mieux pour éviter les erreurs les plus évidentes, vous devez veiller à l'exactitude du programme sur votre part.

:::

Les principales caractéristiques qui permettent la génération de liaison sont `ReprC`, `FfiType` et `FfiConvert`.

|Un trait .|La description |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` |Ce trait représente un type robuste qui se conforme à C ABI. Le type peut être partagé en toute sécurité sur les frontières de FFI. |
|`FfiType` | Ce trait définit une correspondance `ReprC` type pour une donnée `Rust` type. le défini `ReprC` le type est utilisé à la place du `Rust` type dans le API du produit généré FFI fonction. |
|`FfiConvert` |Cette caractéristique définit deux méthodes `into_ffi` et `try_from_ffi` qui sont utilisées pour effectuer la conversion du type `Rust` en ou à partir du type `ReprC`. |

Notez qu'il n'y a pas de transfert de propriété sur FFI à l'exception des types de pointeurs opaques. Tous les autres types portant la propriété, tels que `Vec<T>`, sont clonés.

### Nom Mangling {#name-mangling}

Notez l'utilisation de deux sous-titres dans les noms générés d'objets FFI:

- Pour la méthode `inherent_fn` définie sur la structure `StructName`, le nom de FFI serait `StructName__inherent_fn`.
- Pour la méthode `MethodName` à partir de la caractéristique `TraitName` dans l'structure `StructName`, le nom de FFI serait `StructNameTraitNameMethodName`.
- Pour définir le champ `field_name` dans la structure `StructName`, le nom de la fonction FFI serait `StructName__set_field_name`.
- Pour obtenir le champ `field_name` dans la structure `StructName`, le nom de la fonction FFI serait `StructName__field_name`.
- Pour obtenir le champ `field_name` mutable dans la structure `StructName`, le nom de la fonction FFI serait `StrucuName__field_name_mut`.
- Pour le `module_name::fn_name` indépendant, la dénomination de FFI serait `module_name::__fn_name`.
- Pour les caractéristiques qui ne sont pas génériques et permettent de partager leur mise en œuvre dans le FFI (voir `Clone` ci-dessous), la dénomination FFI serait `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
