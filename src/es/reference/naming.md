---
translation_locale: es
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Convenciones de nomenclatura {#naming-conventions}

Cuando estés nombrando cuentas, dominios o activos, debes tener en cuenta las siguientes convenciones utilizadas en Iroha:

1. Hay una serie de separadores reservados que se utilizan para tipos específicos de construcciones:

   - `@` está reservado para alias de cuentas y formas de cuenta/clave pública con alcance
   - `#` está reservado para alias de definición de activos y literales de saldo de activos
   - `::` está reservado para alias de contrato
   - `.` está reservado para la calificación de dominio y espacio de datos
   - `$` está reservado para formas textuales con alcance de disparador
   - `%` está reservado para formas textuales con alcance del validador

2. El número máximo de caracteres (incluyendo los caracteres UTF-8) que un nombre puede tener está limitado por dos factores: `[0, u32::MAX]` y el espacio de pila actualmente asignado.

## Pruébalo en Taira {#try-it-on-taira}

Resuelve un alias de activo público en su ID de definición de activo canónico:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Compárelo con la lista de definición de activos:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

El carácter `#` separa un alias de activo del contexto del dominio. Manténgalo fuera de los nombres simples a menos que esté escribiendo intencionalmente un alias de activo o un literal de saldo de activo.
