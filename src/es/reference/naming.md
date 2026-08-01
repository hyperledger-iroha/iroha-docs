---
translation_locale: es
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# El nombre de las convenciones {#naming-conventions}

Al nombrar cuentas, dominios o activos, debe tener en cuenta las siguientes convenciones utilizadas en Iroha:

1. Hay una serie de separadores reservados que se utilizan para tipos específicos de construcciones:

   - `@` se reserva a los alias de las cuentas y a los formularios de cuentas/claves públicas con alcance
   - `#` se reserva a los alias de definición de activos y a las letras de balance de activos
   - `::` se reserva para los alias contractuales
   - `.` se reserva para la calificación de dominio y espacio de datos
   - `$` se reserva a los formularios textuales con escopo de activación
   - `%` se reserva a los formularios de texto validados por el validador

2. El número máximo de caracteres (incluidos los caracteres UTF-8) que puede tener un nombre está limitado por dos factores: `[0, u32::MAX]` y el espacio en la pila asignado actualmente.

## Pruébalo en Taira {#try-it-on-taira}

Resolver un alias de activo público en su definición canónica del activo ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Compare eso con la lista de definiciones de activos:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

El carácter `#` separa un alias de activo del contexto del dominio. Manténgalo fuera de los nombres comunes a menos que esté escribiendo intencionalmente un alias o balance literal de activos.
