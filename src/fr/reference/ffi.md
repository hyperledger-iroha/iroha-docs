---
translation_locale: fr
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Interfaces de fonction étrangère (FFI) {#foreign-function-interfaces-ffi}

Le package logiciel `iroha_ffi` fournit des macros et des traits pour générer des liaisons C ABI à partir de Rust APIs. Il est utilisé lorsque les types Iroha doivent franchir une frontière FFI, par exemple via des liaisons SDK ou des intégrations hôtes.

## Pourquoi FFI {#why-ffi}

Une fonction est une entité assez abstraite, et bien que la plupart des langages s'accordent sur ce qu'une fonction devrait faire, la manière dont les fonctions sont représentées est très différente. De plus, dans certaines langues, telles que Rust, les conséquences d'appeler une fonction et les choses qu'elle est autorisée à faire sont également différentes. Lorsque Rust APIs doit être appelé depuis un autre langage ou un environnement hôte différent, Iroha utilise une interface de fonction étrangère (FFI) pour égaliser les chances.

La principale norme utilisée aujourd'hui est l'interface binaire d'application C. Elle est simple, largement disponible et stable. En principe, vous pourriez tout faire manuellement, mais Iroha fournit le package logiciel `iroha_ffi` pour générer des fonctions conformes à FFI à partir d'un(e) Rust API existant(e).

Vous pouvez, bien sûr, faire cela à votre manière. Le paquet logiciel `iroha_ffi` se contente de générer le code que vous auriez de toute façon besoin de générer. Écrire le code de modèle répétitif nécessaire demande beaucoup de diligence et de discipline. Chaque appel de fonction au-delà de la frontière FFI est `unsafe` avec un potentiel de provoquer un comportement indéfini. La méthode par laquelle nous avons réussi à le résoudre tourne autour de l'utilisation de types `repr(C)` robustes.

::: info

La seule exception concerne les pointeurs. La vérification de nullité et la validité ne peuvent pas être appliquées globalement, donc les pointeurs bruts (comme toujours) ne sont utilisés que dans des cas exceptionnels. Étant donné que nous fournissons des adaptateurs logiciels autour de presque chaque instance d’un objet dans le modèle de données Iroha, vous ne devriez pas avoir à utiliser des pointeurs bruts du tout.

:::

## Exemple {#example}

Voici un exemple de génération d'une liaison :

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

L'exemple ci-dessus générera la liaison suivante avec `DaysSinceEquinox` représenté comme un pointeur opaque :

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Génération de liaison {#ffi-binding-generation}

Le package logiciel `iroha_ffi` est utilisé pour générer des fonctions qui peuvent être appelées via FFI. Étant donné les structures et méthodes `Rust`, ils génèrent le code `unsafe` dont vous auriez besoin pour franchir la limite de liaison.

Un type Rust est converti en un type robuste `repr(C)` qui peut traverser la frontière FFI avec `FfiType::into_ffi`. Cela fonctionne aussi dans l'autre sens : le type FFI `ReprC` est converti en un type `Rust` via `FfiType::try_from_ffi`.

::: warning

Notez que la conversion inverse est faillible et peut provoquer un comportement indéfini. Bien que nous puissions faire de notre mieux pour éviter les erreurs les plus évidentes, vous devez assurer la correction du programme de votre côté.

:::

Les principaux traits qui permettent la génération de liaisons sont `ReprC`, `FfiType` et `FfiConvert`.

|Trait|Description|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |Cette caractéristique représente un type robuste qui est conforme à C ABI. Le type peut être partagé en toute sécurité à travers les frontières FFI.|
| `FfiType`    |Ce trait définit un type `ReprC` correspondant pour un type `Rust` donné. Le type `ReprC` défini est utilisé à la place du type `Rust` dans le API de la fonction FFI générée.|
| `FfiConvert` |Ce trait définit deux méthodes `into_ffi` et `try_from_ffi` qui sont utilisées pour effectuer la conversion du type `Rust` vers ou depuis le type `ReprC`.|

Notez qu'il n'y a pas de transfert de propriété sur FFI sauf pour les types de pointeurs opaques. Tous les autres types qui impliquent la propriété, comme `Vec<T>`, sont clonés.

### Broyage de noms {#name-mangling}

Remarquez l'utilisation de doubles underscores dans les noms générés des objets FFI :

- Pour la méthode `inherent_fn` définie sur la structure `StructName`, le nom FFI serait `StructName__inherent_fn`.
- Pour la méthode `MethodName` du trait `TraitName` dans la structure `StructName`, le nom FFI serait `StructName__TraitName__MethodName`.
- Pour définir le champ `field_name` dans la structure `StructName`, le nom de la fonction FFI serait `StructName__set_field_name`.
- Pour obtenir le champ `field_name` dans la structure `StructName`, le nom de la fonction FFI serait `StructName__field_name`.
- Pour obtenir le champ mutable `field_name` dans la structure `StructName`, le nom de la fonction FFI serait `StrucuName__field_name_mut`.
- Pour le `module_name::fn_name` autonome, le nom FFI serait `module_name::__fn_name`.
- Pour les traits qui ne sont pas génériques et permettent de partager leur implémentation dans le FFI (voir `Clone` ci-dessous), le nom FFI serait `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
