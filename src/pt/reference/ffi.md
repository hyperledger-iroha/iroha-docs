---
translation_locale: pt
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Interfaces de Funções Estrangeiras (FFI) {#foreign-function-interfaces-ffi}

O pacote de software `iroha_ffi` fornece macros e traits para gerar bindings C ABI a partir de Rust APIs. Ele é usado quando tipos Iroha precisam atravessar uma fronteira FFI, por exemplo, por meio de bindings SDK ou integrações com o host.

## Por que FFI {#why-ffi}

Uma função é uma entidade bastante abstrata e, embora a maioria das linguagens concorde sobre o que uma função deve fazer, a forma como as funções são representadas é muito diferente. Além disso, em algumas línguas, como Rust, as consequências de chamar uma função e as coisas que ela é permitida fazer também são diferentes. Quando Rust APIs precisa ser chamado de outra linguagem ou de um ambiente host diferente, Iroha usa uma interface de função estrangeira (FFI) para nivelar o campo de atuação.

O principal padrão usado hoje é a interface binária de aplicativos em C. É simples, amplamente disponível e estável. Em princípio, você poderia fazer tudo manualmente, mas Iroha fornece o pacote de software `iroha_ffi` para gerar funções compatíveis com FFI a partir de um Rust API existente.

Você pode, é claro, fazer isso do seu jeito. O pacote de software `iroha_ffi` simplesmente gera o código que você precisaria gerar de qualquer forma. Escrever o código de modelo repetitivo necessário exige bastante diligência e disciplina. Cada chamada de função sobre a fronteira FFI é `unsafe` com potencial para causar comportamento indefinido. O método pelo qual conseguimos resolver isso gira em torno do uso de tipos `repr(C)` robustos.

::: info

A única exceção são os ponteiros. A verificação de nulidade e a validade não podem ser impostas globalmente, então ponteiros crus (como sempre) são usados apenas em casos excepcionais. Dado que fornecemos adaptadores de software em quase toda instância de um objeto no modelo de dados Iroha, você não deveria precisar usar ponteiros brutos de forma alguma.

:::

## Exemplo {#example}

Aqui está um exemplo de como gerar uma ligação:

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

O exemplo acima gerará a seguinte vinculação com `DaysSinceEquinox` representado como um ponteiro opaco:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Geração de Vinculação {#ffi-binding-generation}

O pacote de software `iroha_ffi` é usado para gerar funções que podem ser chamadas via FFI. Dadas as estruturas `Rust` e métodos, ele gera o código `unsafe` que você precisaria para cruzar a fronteira de vinculação.

Um tipo Rust é convertido em um tipo `repr(C)` robusto que pode atravessar a fronteira FFI com `FfiType::into_ffi`. Isso funciona no sentido inverso também: o tipo FFI `ReprC` é convertido em um tipo `Rust` via `FfiType::try_from_ffi`.

::: warning

Observe que a conversão oposta é falível e pode causar comportamento indefinido. Embora possamos fazer o máximo esforço para evitar os erros mais óbvios, você deve garantir a correção do programa por sua parte.

:::

As principais características que permitem a geração de vínculos são `ReprC`, `FfiType` e `FfiConvert`.

|Traço|Descrição|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |Este traço representa um tipo robusto que está em conformidade com C ABI. O tipo pode ser compartilhado com segurança através de fronteiras FFI.|
| `FfiType`    |Este traço define um tipo `ReprC` correspondente para um dado tipo `Rust`. O tipo `ReprC` definido é usado no lugar do tipo `Rust` no API da função FFI gerada.|
| `FfiConvert` |Este trait define dois métodos `into_ffi` e `try_from_ffi` que são usados para realizar a conversão do tipo `Rust` para ou a partir do tipo `ReprC`.|

Observe que não há transferência de propriedade sobre FFI, exceto para tipos de ponteiro opaco. Todos os outros tipos que carregam propriedade, como `Vec<T>`, são clonados.

### Confusão de Nomes {#name-mangling}

Observe o uso de sublinhados duplos nos nomes gerados de objetos FFI:

- Para o método `inherent_fn` definido na struct `StructName`, o nome FFI seria `StructName__inherent_fn`.
- Para o método `MethodName` do trait `TraitName` na struct `StructName`, o nome FFI seria `StructName__TraitName__MethodName`.
- Para definir o campo `field_name` na struct `StructName`, o nome da função FFI seria `StructName__set_field_name`.
- Para obter o campo `field_name` na struct `StructName`, o nome da função FFI seria `StructName__field_name`.
- Para obter o campo mutável `field_name` na struct `StructName`, o nome da função FFI seria `StrucuName__field_name_mut`.
- Para o `module_name::fn_name` independente, o nome FFI seria `module_name::__fn_name`.
- Para os traits que não são genéricos e permitem compartilhar sua implementação no FFI (veja `Clone` abaixo), o nome FFI seria `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
