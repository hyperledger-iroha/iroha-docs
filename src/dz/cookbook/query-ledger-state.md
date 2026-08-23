---
translation_locale: dz
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: a81f6cc04befb0b92a0a01c2cb3c1ecbbc631ce1f2a923cb046241c295db7806
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# གནད་དོན་ཁག་གི་ཐོ་ཡིག་ {#query-ledger-state}

## གྲུབ་འབྲས་ {#outcome}

Taira JSON ཐོན་ཁུངས་ཚུ་ ཀློག་སྟེ་ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ཨེབ་གཏང་འབད་ཡོད་མི་ Iroha འདྲི་དཔྱད་འདི་ ཕི་ལཱཊར་ཚུ་དང་ མནོ་བསམ་བཏང་ཐངས་ཀྱི་ pagination, sorting, fetch size དང་ forward-only cursor continuation ཚུ་དང་གཅིག་ཁར་ལག་ལེན་འཐབ་ཨིན། ཁྱོད་ཀྱིས་ཡང་ ཕབ་ལེན་འབད་ཡོད་པའི་ `--select` tuple བརྩིས་མ་ཚར་བའི་ཧེ་མར་ སེལ་འཐུ་སྣུམ་གྱི་འཆར་སྣང་ལུ་བློ་གཏད་ནི་ལས་སྤར།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `curl`, `jq`, Node.js 24,དང་ current `iroha` CLI འདི་ཚུ་ཨིན།
- ཀློག་ཐངས་རྐྱངམ་ཅིག་ Taira ཐོབ་ཚུགསཔ་ཨིན།
- ཐོ་བཀོད་ཅན་གྱི་དྲི་བ་དཔེར་ན་ Taira གི་དོན་ལུ་ client config ཡང་ན་ local network generated ཀྱི་དོན་ལུ་
- Rust གི་དཔེ་མཚོན་ནང་ལུ་ ལས་འགུལ་ཅིག་གིས་ དམིགས་གཏད་ཐོ་བཀོད་འབད་ཡོད་པའི་དྲ་ལམ་དང་འདྲཝ་སྦེ་ Iroha གི་འབྱུང་ཁུངས་བསྐྱར་བཅོས་འབད་ཡོདཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### Taira ཐོན་ཁུངས་ནང་ལས་ ཤོག་ལེབ་ཅིག་བཏོན་གནང་། {#_1-page-through-a-public-taira-resource}

ལས་ཁུངས་ཀྱི་ལམ་ལུགས་འདི་ ཌེཤི་བཱོར་དང་ དུ་པ་བརྟག་དཔྱད་འབད་ནིའི་དོན་ལུ་ ཕན་ཐོགས་ཅན་ཨིན། ཁྱོད་ཀྱིས་ JSON འཚོལ་ཞིནམ་ལས་ གྲལ་ཐིག་རེ་རེ་ལུ་བསྡམས་ཏེ་ བཏོན་དགོ་པའི་ ས་ཁོངས་ཚུ་རྐྱངམ་གཅིག་ བཏོན་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ལན་འཚོལ་ཚར་བའི་ཤུལ་ལས་

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id:asc' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'offset=0' \
  --data-urlencode 'count_mode=exact' \
  | jq '{total, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const limit = 5
const seen = new Set()

for (let offset = 0; ; offset += limit) {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id:asc',
    limit: String(limit),
    offset: String(offset),
    count_mode: 'exact',
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok)
    throw new Error(`Taira returned HTTP ${response.status}`)

  const page = await response.json()
  for (const domain of page.items) {
    if (seen.has(domain.id)) throw new Error(`duplicate ${domain.id}`)
    seen.add(domain.id)
    console.log(domain.id)
  }
  if (page.items.length < limit || seen.size >= page.total) break
}
```

:::

HTTP ས་ཐུག་ལུ་ `limit` དང་ `offset` ལག་ལེན་འཐབ་དོ་ཡོདཔ་ཨིན། རྒྱུན་འགྲུལ་ལམ་དེ་ རིན་བསྡུར་འབད་ནིའི་གནས་སྟངས་འཇམ་ཏོང་ཏོ་ཅིག་ལག་ལེན་འཐབ་པའི་སྐབས་ ལམ་སེལ་མེད་མི་ ཡང་ན་ མཐའ་ཟུར་ལུ་ཡོད་མི་ `total` འདི་ཡང་ སྤྱིར་བཏང་བཟུམ་སྦེ་ལག་ལེན་འཐབ་དགོ།

### CLI ཐོ་བཀོད་འབད་ཡོད་པའི་དྲི་བ་འདི་སེལ་འཐུ་དང་ བཏོན་གཏང་། {#_2-filter-and-batch-a-typed-cli-query}

CLI གིས་ ཐོ་བཀོད་འབད་བཏུབ་པའི་ འདྲི་དཔྱད་འདི་རིམ་སྒྲིག་སྦེ་བཟོ་སྟེ་ ཞབས་ཏོག་གི་མུ་མཐུད་ཚད་འཛིན་ཚུ་ནང་འཁོད་ལུ་ ལྟ་རྟོག་འབདཝ་ཨིན། འདི་ནང་ལུ་ མནོ་བསམ་གྱི་གྲུབ་འབྲས་དེ་ གྲལ་ཐིག་གཅིག་ལས་བརྒལ་མེད་དོ་ཡོདཔ་ད་ `--fetch-size 1` གིས་ ཕར་དང་ཚུར་ འགྲོ་འགྲུལ་ཐེངས་རེ་ལུ་ བསྡུ་ལེན་འབད་མི་ ཨང་ཆེ་ཤོས་ཀྱི་ཨང་གྲངས་ཚུ་ བཏོན་དོ་ཡོདཔ་ཨིན།

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

ཐིག་ཁྲམ་འདི་ ཤོག་ལེབ་བཟོ་བཀོད་འབད་བའི་ཧེ་མར་ བསྒྲགས་འབདཝ་ཨིན། དྲི་བཀོད་ལུ་དམིགས་ཏེ་ ཨེབ་གཏང་ཅན་གྱི་ སྔོན་བཤད་ཚུ་ལག་ལེན་འཐབ་ཨིན། རྩིས་སྤྲོད་ ཡང་ན་ རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ སྔོན་བཤད་ཚུ་ ས་ཁོངས་ཅིག་གི་དོན་ལུ་ ཉེན་སྲུང་ལྡན་པའི་ཐོག་ལས་ ལོག་ལག་ལེན་འཐབ་མི་ཚུགས་ཡོདཔ་ཨིན།

### 3. གནས་བརྟན་ metadata key གི་ཐོག་ལས་དབྱེ་ཞིབ་འབདཝ་ཨིན། {#_3-sort-by-a-stable-metadata-key}

typeed query sorting འདི་ metadata key ཅིག་གི་ནང་ལུ་ lexicographicཨིན་ Key མེད་པར་ཡོད་པའི་ items གིས་ runtime གི་ defined ordering བརྟན་སྦེ་འབད་དོ་ཡོདཔ་ལས་ key ཚུ་ collection ནང་རྒྱུན་མ་ཆད་པར་ཁྱབ་སྟེ་ཡོདཔ་ཨིན།

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger account list all \
  --verbose \
  --sort-by-metadata-key key \
  --order asc \
  --limit 10 \
  --offset 0 \
  --fetch-size 2 \
  | jq '[.[] | {id, metadata}]'
```

ཐོ་བཀོད་འབད་མི་ CLI སྣུམ་འཁོར་ཚུ་ `--select` JSON དེ་ལས་ སེལ་འཐུ་འབད་ཐངས་ tuple ཕར་བཏང་། ཨིན་རུང་རང་ ད་ལྟོ་གི་དྲི་བ་ lightweight DSL སེལ་འཐུ་འབགཔ་དེ་ ཌའི་ལོག་ནང་ལུ་ བསྐྱར་ཞིབ་མ་འབད་བར་ཡོདཔ་ཨིན། འདི་ཚུ་གི་མཐའ་འཁོར་ལུ་ གློག་བརྙན་བཟོ་སྐྲུན་མ་འཐབ་པར་སྡོད་དགོ། SDK དམིགས་གཏད་ཅན་གྱི་ དུས་ཡུན་དེ་ རྒྱབ་སྐྱོར་འབད་ཚར་བའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ བརྟག་དཔྱད་འབད་ནི་དང་ ཡང་ན་ བརྟག་ཞིབ་འབད་མི་ གྲུབ་འབྲས་ client-side འདི་དང་གཅིག་ཁར་ `jq` ཡང་ན་ JavaScript འདི་བཟུམ་སྦེ་ཁ་ཐུག་ལུ་ཡང་ཨིན།

### 4. Rust iterator གིས་ དྭངས་གསལ་མེད་པའི་ ཀེར་སོར་ཚུ་རྟིང་བདའ་དགོ། {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` གིས་ མནོ་བསམ་གྱི་གྲུབ་འབྲས་ གཞི་སྒྲིག་འབད་ཡོདཔ་ཨིན། `FetchSize` གིས་ ཞབས་ཏོག་གི་སྡེ་ཚན་སོ་སོ་ཚུ་འཛིན་བཟུང་འབདཝ་ཨིན། བསྒྱུར་བཅོས་འབད་མི་དེ་ ཞབས་ཏོག་གིས་བཟོ་མི་ ཀུར་སོར་ལག་ལེན་འཐབ་ཐོག་ལས་ འཕྲལ་མཐུད་ཀྱི་ཞུ་ཡིག་ཚུ་ གསལ་ཏོག་ཏོ་སྦེ་བཏང་ཨིན།

```rust
use std::num::NonZeroU64;

use iroha::data_model::{
    prelude::FindAssetsDefinitions,
    query::{
        builder::QueryBuilderExt as _,
        parameters::{FetchSize, Pagination},
    },
};

let definitions = client
    .query(FindAssetsDefinitions::new())
    .with_pagination(Pagination::new(NonZeroU64::new(25), 0))
    .with_fetch_size(FetchSize::new(NonZeroU64::new(5)))
    .execute_all()?;

for definition in definitions {
    println!("{} {}", definition.id(), definition.name());
}
```

`ForwardCursor` འདི་དབང་འཛིན་ལུ་བཅའ་མར་གཏོགསཔ་ཨིན། བྱ་རིམ་གྱི་གནས་སྟངས་དང་ ཕར་འགྱོ་སའི་རྐྱངམ་ཅིག་ཨིན། འདི་ནམ་ཡང་ བརྟག་ཞིབ་མ་འབད། དེ་རྩ་སྒྲིག་མ་འབད། ཡང་ན་ དབང་འཛིན་ཚུ་གི་བར་ན་བགོ་བཤའ་མ་རྐྱབས། ཡང་ན་ Torii གི་ནང་ལུ་ རྒྱུན་འགྲུལ་འཐབ་ཚུགས་པའི་བསྐྱར་གསོ་འབད་ནིའི་རྟགས་མཚན་སྦེ་བཞག་ནི་མི་འོང་། གལ་སྲིད་འདི་མཇུག་བསྡུ་བ་ཅིན་ ངོ་མའི་དྲི་བ་དེ་ ཐབས་ཤེས་ཀྱིས་ལག་ལེན་གི་གནས་ཚད་ཀྱི་བརྟག་དཔྱད་སྒོ་ཁར་ ལོག་འགོ་བཙུགས་དགོ།

## བརྟག་དཔྱད་འབད་ {#verify}

དྭངས་གསལ་ domain filter གིས་ `wonderland.universal`རྐྱངམ་ཅིག་ལོག་གཏང་དགོ། གྲུབ་འབྲས་འདི་ཨེབ་གཏང་འབད་ནི་མེན་པར་ CLI exit ལུ་རྐྱངམ་གཅིག་ countའབད་:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

ཤོག་ལེབ་ཅན་ལག་ལེན་གྱི་དྲི་བ་གི་དོན་ལུ་ཡང་ IDs ཤོག་ལེབ་ཚུ་ནང་ལོག་མ་རྐྱབ་པར་ བརྟག་དཔྱད་འབད་དགོ་ དེ་ལས་ དགོས་མཁོ་ཅན་གྱི་ logic limit འདི་ནམ་ཡང་བརྒལ་ཏེ་མིན་འདུག་ཟེར་ བརྟག་དཔྱད་འབད་ནི་དང་ དུས་ཡུན་ཚང་བའི་ཤུལ་ལུ་ ཀེར་སོརདེ་ཡིག་ཐོག་གི་ བརྟག་ཞིབ་སྒོ་ནང་ལས་ ལོག་འགོ་བཙུགས་དགོ།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- ཨང་གཅིག་གི་དྲི་བཀོད་འདི་ བསྐྱར་ཞིབ་འབད་ཚུགས་མི་ ཕུལ་ཊར་, དབྱེ་རིམ་སྒྲིག་འབད་ནི་, ཤོག་ལེབ་བཟོ་ནི་ ཡང་ན་ ཕབ་ལེན་འབད་བཏུབ་པའི་ གནས་ཚད་ཚུ་ཆ་མ་བཞགཔ་ཨིན། འདི་ཚུ་གི་དོན་ལུ་ དགོས་མཁོ་ཡོད་པའི་སྐབས་ལུ་ འོས་འབབ་ཅན་གྱི་ཐོ་ཡིག་གི་དྲི་བཀོད་ལག་ལེན་འཐབ་དགོ།
- `fetch_size` འདི་ བཀྲམ་སྤེལ་འབད་ནིའི་དོན་ལས་ ཚད་འཛིན་གྲུབ་འབྲས་ཡོངས་བསྡོམས་མེན། ད་ལྟོའི་གནས་གོང་འདི་ `100`ཨིན། དེ་ལས་ runtime གིས་ གནས་གོང་དེ་ མཐོ་ཤོས་ཅིག་ལུ་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན།
- ཀེར་སོར་མ་ཤེསཔ་དང་ དུས་ཡུན་ཆད་སོང་མི་ ཡང་ན་ ཕྱི་རྒྱལ་ལུ་ཡོད་མི་འདི་ ལོག་སྟེ་ར་ལག་ལེན་འཐབ་མི་ཚུགས་ནི་ཨིན་པས། བལྟ་བ་འདི་ སླར་ལོག་འབད་ནི་; དྭངས་གསལ་མེད་པའི་གོང་ཚད་དེ་ ཉམས་བཅོས་འབད་ནིའི་ དཔའ་བཅམ་ནི་མི་འོང་།
- metadata sorting འདི་ field sorting སྤྱིར་བཏང་མེདཔ། གལ་སྲིད་ element ཆ་མཉམ་ནང་ key བཙག་འཐུ་མ་འབད་བ་ཅིན་ key ཤུལ་མ་མེད་མི་དེ་ ཡིག་སྣོད་འབད་ ཡང་ན་ ཐབས་ལམ་གཞན་ཅིག་ གདམ་ཁ་རྐྱབས།
- CLI གིས་ `--select` བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ ཕར་འཕུལ་དོ་ཡོདཔ་ཨིན་རུང་ ད་ལྟོའི་ ཞབས་ཏོག་གིས་ འོད་ཐུང་སེལ་འཐུ་འབད་ནིའི་ ཐུབ་པ་དེ་ བསྐྱར་ཞིབ་མ་འབད་བར་ བཞག་དོ་ཡོདཔ་ཨིན། སེལ་འཐུ་འབད་ནིའི་དུས་ཚོད་ལུ་ ཌའི་ལོག་གི་རྒྱབ་སྐྱོར་མ་ཐོབ་པ་ཅིན་ མགྲོན་པོ་གི་ཁ་ཐུག་ལས་ གྲུབ་འབྲས་བཏོན་ནི་ལག་ལེན་འཐབ་དགོ།
- གནས་ཚད་མ་ཚང་བའི་དྲིས་ལོར་ཚུ་གིས་ དོ་འགྲན་འབད་མི་གི་ལཱ་དང་ མགྲོན་པོ་ཚུ་གི་ དྲན་ཐོ། དེ་ལས་ ཀེར་སུར་གྱི་ཚེ་རིང་གི་ ཉེན་ཁ་ཚུ་ ཡར་སེང་འབད་དོ་ཡོདཔ་ཨིན། ཉུང་མཁོ་འདོད་ཅན་ལུ་ ཕན་ཐོགས་སྦོམ་སྦེ་ར་ འབག་འོང་ནིའི་ཚད་གཞི་ཅིག་ གཞི་བཙུགས་རྐྱབས་ཚུགས།
- མི་མང་གི་ JSON ཐོན་ཁུངས་ཀྱི་བརྡ་དོན་དང་ ཐོ་བཀོད་ཅན་གྱི་ ཐོ་བཀོད་ཀྱི་བརྡ་དོན་ཚུ་ འབྲེལ་བ་ཡོདཔ་ཨིན་རུང་ བསྒྱུར་བཅོས་འབད་ཚུགས་པའི་ བརྡ་བཀོད་བཟོ་རྣམ་མེདཔ། ཐོ་བཀུད་ཅན་གྱི་བརྡ་དོན་ནང་ SDK ཡང་ན་ CLI གདམ་ཁ་རྐྱབ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [Cursor-རྒྱབ་སྐྱོར་འབད་མི་ pagination integrated testingཚུ་ pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/pagination.rs) ལུ་འབདཝ་ཨིན།
- [སླར་ལོག་བཟོ་སྐྲུན་འབད་མི་དང་ བཙག་འཐུ་འབད་མི་ཚུ་གི་ སྤྱོད་ལམ་ཚུ་ ཕིན་ཌ་ commit ལུ་](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/builder/mod.rs)
- [སླར་བསྡུར་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/query/parameters.rs) ལུ་དྲི་བ་གི་ཚད་གཞི་དང་ cursor model
- [དྲི་བཀོད་ཚུ་](/dz/blockchain/queries.md)
- [དྲི་བཀོད་གི་ཁ་བྱང་](/dz/reference/queries.md)
- [JavaScript དང་ TypeScript](/dz/guide/tutorials/javascript.md)
