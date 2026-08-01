---
translation_locale: pt
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Nomear as convenções {#naming-conventions}

Ao nomear contas, domínios ou ativos, é necessário ter em mente as seguintes convenções utilizadas no Iroha:

1. Existem uma série de separadores reservados que são utilizados para tipos específicos de construções:

   - `@` É reservado para os pseudónimos de conta e formulários de conta/chave pública com escopo
   - `#` Reservado para alias de definição de ativos e literais de saldo de ativos
   - `::` é reservado para alias contratuais
   - `.` é reservado para a qualificação de domínio e espaço de dados
   - `$` É reservado a formulários textuais com escopo de desencadeamento
   - `%` é reservado a formulários de texto validados por um validador

2. O número máximo de caracteres (incluindo os caracteres UTF-8) que um nome pode ter é limitado por dois fatores: `[0, u32::MAX]` e o espaço de pilha atualmente atribuído.

## Tente em Taira {#try-it-on-taira}

Resolver um alias de ativo público na sua definição canônica de ativo ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Compare isso com a lista de definições de activos:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

O caráter `#` separa um alias de ativo do contexto do domínio. Mantenha-o fora dos nomes comuns, a menos que você esteja intencionalmente escrevendo um alias ou saldo de ativo literal.
