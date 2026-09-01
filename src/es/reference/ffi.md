---
translation_locale: es
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Interfaces de Funciones Extranjeras (FFI) {#foreign-function-interfaces-ffi}

El paquete de software `iroha_ffi` proporciona macros y traits para generar enlaces C ABI a partir de Rust APIs. Se utiliza cuando los tipos Iroha necesitan cruzar una frontera FFI, por ejemplo, mediante enlaces SDK o integraciones de host.

## Por qué FFI {#why-ffi}

Una función es una entidad bastante abstracta, y aunque la mayoría de los lenguajes coinciden en lo que una función debería hacer, la forma en que se representan las funciones es muy diferente. Además, en algunos idiomas, como Rust, las consecuencias de llamar a una función y las cosas que se le permite hacer también son diferentes. Cuando Rust APIs necesita ser llamado desde otro lenguaje o un entorno anfitrión diferente, Iroha utiliza una interfaz de función extranjera (FFI) para nivelar el campo de juego.

El estándar principal utilizado hoy en día es la interfaz binaria de aplicación C. Es simple, ampliamente disponible y estable. En principio, podrías hacer todo manualmente, pero Iroha proporciona el paquete de software `iroha_ffi` para generar funciones conformes con FFI a partir de un Rust API existente.

Por supuesto, puedes hacer esto a tu manera. El paquete de software `iroha_ffi` simplemente genera el código que de todos modos necesitarías generar. Escribir el código de plantilla repetitivo necesario requiere bastante diligencia y disciplina. Cada llamada a función a través del límite FFI es `unsafe` con un potencial de causar un comportamiento indefinido. El método mediante el cual logramos resolverlo, gira en torno a usar tipos robustos `repr(C)`.

::: info

La única excepción son los punteros. La verificación de nulos y la validez no se pueden aplicar globalmente, por lo que los punteros sin procesar (como siempre) solo se utilizan en casos excepcionales. Dado que proporcionamos adaptadores de software alrededor de casi cada instancia de un objeto en el modelo de datos Iroha, no deberías tener que usar punteros sin procesar en absoluto.

:::

## Ejemplo {#example}

Aquí hay un ejemplo de cómo generar un enlace:

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

El ejemplo anterior generará la siguiente vinculación con `DaysSinceEquinox` representado como un puntero opaco:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Generación de Enlaces {#ffi-binding-generation}

El paquete de software `iroha_ffi` se utiliza para generar funciones que se pueden llamar a través de FFI. Dadas las estructuras y métodos `Rust`, generan el código `unsafe` que necesitarías para cruzar la frontera de enlace.

Un tipo Rust se convierte en un tipo `repr(C)` robusto que puede cruzar la frontera FFI con `FfiType::into_ffi`. Esto también funciona al revés: el tipo `ReprC` FFI se convierte en un tipo `Rust` a través de `FfiType::try_from_ffi`.

::: warning

Tenga en cuenta que la conversión opuesta es falible y puede causar un comportamiento indefinido. Aunque podemos hacer el mayor esfuerzo para evitar los errores más evidentes, usted debe asegurarse de la corrección del programa por su parte.

:::

Los principales rasgos que permiten la generación de enlaces son `ReprC`, `FfiType` y `FfiConvert`.

|Rasgo|Descripción|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |Este rasgo representa un tipo robusto que cumple con C ABI. El tipo puede compartirse de manera segura a través de los límites de FFI.|
| `FfiType`    |Este rasgo define un tipo `ReprC` correspondiente para un tipo `Rust` dado. El tipo `ReprC` definido se usa en lugar del tipo `Rust` en el API de la función FFI generada.|
| `FfiConvert` |Este rasgo define dos métodos `into_ffi` y `try_from_ffi` que se utilizan para realizar la conversión del tipo `Rust` hacia o desde el tipo `ReprC`.|

Tenga en cuenta que no hay transferencia de propiedad sobre FFI excepto para tipos de punteros opacos. Todos los demás tipos que llevan propiedad, como `Vec<T>`, se clonan.

### Confusión de nombres {#name-mangling}

Observe el uso de guiones bajos dobles en los nombres generados de los objetos FFI:

- Para el método `inherent_fn` definido en la estructura `StructName`, el nombre FFI sería `StructName__inherent_fn`.
- Para el método `MethodName` del trait `TraitName` en la estructura `StructName`, el nombre FFI sería `StructName__TraitName__MethodName`.
- Para establecer el campo `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StructName__set_field_name`.
- Para obtener el campo `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StructName__field_name`.
- Para obtener el campo mutable `field_name` en la estructura `StructName`, el nombre de la función FFI sería `StrucuName__field_name_mut`.
- Para el `module_name::fn_name` independiente, el nombre FFI sería `module_name::__fn_name`.
- Para los rasgos que no son genéricos y permiten compartir su implementación en el FFI (ver `Clone` a continuación), el nombre FFI sería `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
