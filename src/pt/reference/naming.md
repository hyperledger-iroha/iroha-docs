---
translation_locale: pt
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Convenções de Nomenclatura {#naming-conventions}

Ao nomear contas, domínios ou ativos, você deve ter em mente as seguintes convenções usadas em Iroha:

1. Existe um número de separadores reservados que são usados para tipos específicos de construções:

   - `@` é reservado para aliases de conta e formas de conta/chave pública específicas
   - `#` é reservado para aliases de definição de ativos e literais de saldo de ativos
   - `::` é reservado para apelidos de contrato
   - `.` é reservado para qualificação de domínio e espaço de dados
   - `$` é reservado para identificadores de NFT como `name$domain.dataspace`

2. Um nome não pode ser vazio, deve estar na forma Unicode NFC, ter no máximo 255 bytes UTF-8 e não conter espaços em branco, caracteres de controle nem caracteres de controle bidirecional.

## Experimente em Taira {#try-it-on-taira}

Resolve um alias de ativo público em seu ID de definição de ativo canônico:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Compare isso com a lista de definição de ativos:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

O caractere `#` separa um alias de ativo do contexto do domínio. Mantenha-o fora de nomes comuns, a menos que você esteja intencionalmente escrevendo um alias de ativo ou um literal de saldo de ativo.
