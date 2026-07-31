---
translation_locale: pt
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Interfaces de funções estrangeiras (FFI) {#foreign-function-interfaces-ffi}

A caixa `iroha_ffi` fornece macros e características para gerar ligações C ABI a partir de Rust APIs. É usada quando os tipos Iroha precisam cruzar um limite FFI, por exemplo, por ligações SDK ou integrações host.

## Por que FFI {#why-ffi}

Uma função é uma entidade bastante abstrata, e enquanto a maioria das línguas concorda sobre o que uma função deve fazer, a maneira como as funções são representadas é muito diferente. Além disso, em algumas línguas, como Rust, as consequências de chamar uma função e as coisas que ela é autorizada a fazer também são diferentes. Quando Rust APIs precisa ser chamado de outra língua ou um ambiente host diferente, O Iroha utiliza uma interface de função estrangeira (FFI) para igualar o campo de jogo.

O principal padrão usado hoje é a interface binária de aplicativos C. É simples, amplamente disponível e estável. Em princípio, você poderia fazer tudo manualmente, mas Iroha fornece o caixote `iroha_ffi` para gerar funções compatíveis com FFI a partir de uma existente Rust API.

A caixa `iroha_ffi` apenas gera o código que você precisaria gerar de qualquer forma. Escrever a placa de caldeira necessária requer um pouco de diligência e disciplina. Cada chamada de função sobre o limite FFI é `unsafe` com potencial para causar um comportamento indefinido. O método pelo qual conseguimos resolvê-lo, gira em torno do uso de robustos tipos `repr(C)`.

::: Informações

A verificação de nulo e a validade não podem ser aplicadas globalmente, por isso os indicadores brutos (como sempre) são utilizados apenas em casos excepcionais. Dado que fornecemos envolventes em torno de quase todas as instâncias de um objeto no modelo de dados Iroha, você não deve ter que usar ponteiros brutos.

:::

## Exemplo {#example}

Aqui está um exemplo de gerar uma ligação:

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

O exemplo acima irá gerar a seguinte ligação com `DaysSinceEquinox` representado como um ponteiro opaco:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Geração vinculativa {#ffi-binding-generation}

A caixa `iroha_ffi` é usada para gerar funções que são chamáveis através de FFI. Dadas estruturas e métodos `Rust`, eles geram o código `unsafe` que você precisaria para atravessar o limite de ligação.

A. Rust O tipo é convertido em um robusto `repr(C)` tipo que pode atravessar o FFI fronteira com `FfiType::into_ffi`. Isto também vai pelo contrário: FFI `ReprC` O tipo é convertido em um `Rust` tipo via `FfiType::try_from_ffi`.

::: Aviso

Observe que a conversão oposta é falível e pode causar um comportamento indefinido. Embora possamos fazer o melhor esforço para evitar os erros mais óbvios, você deve garantir a correcção do programa em seu lado.

:::

As principais características que permitem a geração de ligações são `ReprC`, `FfiType` e `FfiConvert`.

|Características|Descrição |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` |Este traço representa um tipo robusto que está em conformidade com o C ABI. O tipo pode ser compartilhado de forma segura através dos limites FFI. |
|`FfiType` |Este traço define um tipo `ReprC` correspondente para um determinado tipo `Rust`. O tipo definido `ReprC` é usado no lugar do tipo `Rust` na função API da função gerada FFI. |
|`FfiConvert` |Esta característica define dois métodos `into_ffi` e `try_from_ffi` que são utilizados para realizar a conversão do tipo `Rust` para ou a partir do tipo `ReprC`. |

Observe-se que não há transferência de propriedade sobre FFI exceto para os tipos de indicadores opacos. Todos os outros tipos com propriedade, como `Vec<T>`, são clonados.

### Nome Mangling {#name-mangling}

Observe o uso de dois subtítulos em nomes gerados de objetos FFI:

- Para o método `inherent_fn` definido na estrutura `StructName`, a designação FFI seria `StructName__inherent_fn`.
- Para o método `MethodName` do traço `TraitName` na estrutura `StructName`, o nome FFI seria `StructNameTraitNameMethodName`.
- Para definir o campo `field_name` na estrutura `StructName`, o nome da função FFI seria `StructName__set_field_name`.
- Para obter o campo `field_name` na estrutura `StructName`, o nome da função FFI seria `StructName__field_name`.
- Para obter o campo mutável `field_name` na estrutura `StructName`, o nome da função FFI seria `StrucuName__field_name_mut`.
- Para o `module_name::fn_name` independente, a designação FFI seria `module_name::__fn_name`.
- Para os traços que não são genéricos e permitem compartilhar a sua implementação no FFI (ver `Clone` abaixo), o nome do FFI seria `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
