---
translation_locale: es
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Interfaces de funciones extranjeras (FFI) {#foreign-function-interfaces-ffi}

La caja `iroha_ffi` proporciona macros y rasgos para generar enlaces C ABI a partir de Rust APIs. Se utiliza cuando los tipos Iroha necesitan cruzar un límite FFI, por ejemplo mediante enlaces SDK o integraciones hostes.

## ¿Por qué FFI {#why-ffi}

Una función es una entidad bastante abstracta, y mientras que la mayoría de los idiomas están de acuerdo en lo que debe hacer una función, la forma en que se representan las funciones es muy diferente. Además, en algunos idiomas, como Rust, las consecuencias de llamar a una función y las cosas que se le permite hacer también son diferentes. Cuando Rust APIs debe ser llamado desde otro idioma o un entorno host diferente, Iroha utiliza una interfaz de función extranjera (FFI) para nivelar el campo de juego.

El estándar principal utilizado hoy en día es la interfaz binaria de aplicaciones C. Es simple, ampliamente disponible y estable. En principio, se podría hacer todo manualmente, pero Iroha proporciona el cajón `iroha_ffi` para generar funciones compatibles con FFI a partir de una existente Rust API

Por supuesto, puedes hacer esto a tu manera. La caja `iroha_ffi` simplemente genera el código que necesitarías generar de todos modos. Escribir la placa necesaria requiere un poco de diligencia y disciplina. Cada llamada de función sobre el límite FFI es `unsafe` con el potencial de causar un comportamiento no definido. El método por el que hemos logrado resolverlo, gira en torno al uso de robustos tipos `repr(C)`.

::: info

El control de nulo y la validez no pueden ser aplicados a nivel mundial, por lo que los indicadores en bruto (como siempre) solo se utilizan en casos excepcionales. Dado que proporcionamos envolturas alrededor de casi todas las instancias de un objeto en el modelo de datos Iroha, no debería tener que usar punteros crudos en absoluto.

:::

## Ejemplo {#example}

Aquí hay un ejemplo de generación de una unión:

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

El ejemplo anterior generará la siguiente unión con `DaysSinceEquinox` representado como un puntero opaco:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Generación vinculada {#ffi-binding-generation}

La caja `iroha_ffi` se utiliza para generar funciones que se pueden llamar a través de FFI. Dadas las estructuras y los métodos `Rust`, generan el código `unsafe` que necesitaría para cruzar el límite de enlace.

En el caso A Rust el tipo se convierte en un robusto `repr(C)` tipo que puede cruzar el FFI el límite con `FfiType::into_ffi`. Esto va al revés también: FFI `ReprC` el tipo se convierte en un `Rust` tipo a través de `FfiType::try_from_ffi`.

::: warning

Tenga en cuenta que la conversión opuesta es fallible y puede causar un comportamiento indefinido. Aunque podemos hacer todo lo posible para evitar los errores más obvios, usted debe asegurarse de la corrección del programa en su parte.

:::

Los principales rasgos que permiten la generación de enlaces son `ReprC`, `FfiType` y `FfiConvert`.

|Un rasgo .|Descripción |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` |Este rasgo representa un tipo robusto que se ajusta a C ABI. El tipo puede ser compartido de forma segura a través de los límites FFI. |
|`FfiType` | Este rasgo define un correspondiente `ReprC` tipo para un dato `Rust` El tipo definido `ReprC` el tipo se utiliza en lugar de la `Rust` tipo en el API de los productos generados FFI la función. |
|`FfiConvert` |Esta característica define dos métodos `into_ffi` y `try_from_ffi` que se utilizan para realizar la conversión del tipo `Rust` a o desde el tipo `ReprC`. |

Tenga en cuenta que no hay transferencia de propiedad sobre FFI excepto para los tipos opacos de punteros. Todos los otros tipos que llevan la propiedad, como `Vec<T>`, son clonados.

### Nombre Mangling {#name-mangling}

Tenga en cuenta el uso de dos subtítulos en los nombres generados de los objetos FFI:

- Para el método `inherent_fn` definido en la estructura `StructName`, el nombre de FFI sería `StructName__inherent_fn`.
- Para el método `MethodName` derivado del rasgo `TraitName` de la estructura `StructName`, el nombre FFI sería `StructNameTraitNameMethodName`.
- Para establecer el campo `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StructName__set_field_name`.
- Para obtener el campo `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StructName__field_name`.
- Para obtener el campo mutable `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StrucuName__field_name_mut`.
- Para el `module_name::fn_name` independiente, la denominación de FFI sería `module_name::__fn_name`.
- Para los rasgos que no sean genéricos y permitan compartir su implementación en la FFI (véase `Clone` a continuación), el nombre de FFI sería `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
