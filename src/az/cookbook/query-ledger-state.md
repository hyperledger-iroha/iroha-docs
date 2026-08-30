---
translation_locale: az
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: ca76923f5ae35b96c52a6a4c23c5d9e69549d1ca91d6d1507e7b9a1aee1f1676
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Query Ledger Dövlət {#query-ledger-state}

## Nəticə {#outcome}

Taira JSON resurslarını oxuyun və layihələndirin, sonra filterlər, məntiqi səhifələşdirmə, sıralama, alınma ölçüləri və yalnız irəliləyən kursor davamçılığı ilə tiplənmiş Iroha sorğularından istifadə edin. Server ötürülmüş `--select` tuple-ni qiymətləndirmədən əvvəl seçicilərin proyeksiyasına da güvənməkdən qaçınırsınız.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Node.js 24 və axın `iroha` CLI.
- Yalnız oxumaq üçün Taira giriş.
- İmzalanmış tapılan sorğu nümunələri üçün Taira üçün müştəri konfiqurasiyası və ya istehsal edilmiş yerli şəbəkə.
- Rust nümunəsi üçün, hədəf şəbəkə ilə eyni Iroha mənbə tənzimlənməsinə bağlanmış layihə.

## Dərslər {#steps}

### 1. Taira ictimai mənbədən səhifə keçin {#_1-page-through-a-public-taira-resource}

Mənbə yolları idarəetmə paneli və duman yoxlamaları üçün faydalıdır. JSON tələb edin, hər səhifəni bağlayın və cavabı yoxladıqdan sonra yalnız tətbiqə lazım olan sahələri proqnozlaşdırın.

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

Bu HTTP səthdə `limit` və `offset` istifadə olunur. Marşrutda daha ucuz hesablama rejimi tətbiq edildikdə buraxılmış və ya məhdudlaşdırılmış `total` normal olaraq qəbul edin.

### 2. CLI sorğusunu filtrləyin və toplayın. {#_2-filter-and-batch-a-typed-cli-query}

CLI tiplənmiş təkrarlana bilən sorğu seriallaşdırır və server davamlılığı kursorlarını daxili olaraq izləyir. Burada məntiqi nəticə bir sıra ilə məhdudlaşır, `--fetch-size 1` isə hər gəzintiyə ən çox toplanılan partiyanı idarə edir.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtrləmə səhifələşdirilmədən əvvəl baş verir. Sorğuda xüsusi tiplənmiş predikatlardan istifadə edin; bir hesab və ya aktiv üçün bir predikat təhlükəsiz şəkildə bir domen üçün yenidən istifadə edilə bilməz.

### 3. Dayanıqlı metadata açarı ilə sıralama {#_3-sort-by-a-stable-metadata-key}

Tiplənmiş sorğu sıralaması bir metadata açarı üzərində leksikografikdir. Bu açarı olmayan maddələr icra vaxtının müəyyən edilmiş sıralamasını izləyir, buna görə də kolleksiya boyunca ardıcıl olaraq doldurulmuş bir açardan istifadə edin.

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

Çeklənmiş CLI `--select` JSON parses və seçicisi tuple ötürür, lakin hazırkı yüngül sual DSL serverdə bu seçicini qiymətləndirmir. Onun ətrafında proqnoz müqaviləsi hələ qurmayın. SDK proyeksiyasını yalnız hədəf iş vaxtı dəstəklədikdən sonra istifadə edin və ya yuxarıdakı kimi təsdiqlənmiş nəticə müştəri tərəfini `jq` və ya JavaScript ilə proqnozlaşdırın.

### 4. Rust təkrarlatıcısının qeyri-aşkar kursorları izləməsinə icazə verin. {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` məntiqi nəticə dəstini məhdudlaşdırır. `FetchSize` hər bir server partiyasını idarə edir. Geri qaytarılan iterator server tərəfindən istehsal olunan kursordan istifadə edərək davamlılıq tələblərini şəffaf şəkildə göndərir.

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

`ForwardCursor` səlahiyyətli, proses yerli və yalnız irəliləyişlidir. Onu heç vaxt təhlil etməyin, sintez edin, idarəetmə orqanları arasında bölüşün və ya Torii nümunələrində portativ bir resume token kimi davam etdirin. Əgər sona çatırsa, orijinal sorğu məqsədyönlü bir tətbiq səviyyəsində yoxlama nöqtəsi ilə yenidən başlatın.

## Tətbiq edin {#verify}

Tam domen filtrini yalnız `wonderland.universal` qaytarmaq lazımdır. Yalnız uğurlu CLI çıxışı saymaqdansa nəticəni yoxlayın:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Səhifələşdirilmiş tətbiq sorğuları üçün IDs səhifələr arasında təkrarlanmamasını, tələb olunan məntiqi həddin heç vaxt aşılmamasını və keçmiş bir kursordan sonra yenidən çalışmanın sənədli bir yoxlama nöqtəsindən bərpa edilməsini yoxlayın.

## Problemlərin həlli {#troubleshooting}

- Yalnız bir sorğu təkrarlanan filtr, sıralama, səhifələşdirmə və ya alınma parametrlərini qəbul etmir. Bu nəzarətlərə ehtiyac duyulduqda müvafiq siyahı sorğusundan istifadə edin.
- `fetch_size` ümumi nəticə məhdudluğu deyil, sıfır olmayan bir partiya göstəricisidir. Hazırdaki standart `100`dir və icra vaxtı maksimumdan yuxarı dəyərləri rədd edir.
- Bilinməyən, keçmiş və ya xarici bir kursor məqsədyönlü olaraq yenidən istifadə edilə bilməz. Sualı yenidən başlatın; qeyri-şəffaf dəyərini təmir etməyə çalışmayın.
- Metadata sıralama ümumi sahə sıralaması deyil. Hər bir maddə seçilmiş açarı daşıymazsa, yox olan açar sırasını sənədləşdirin və ya başqa strategiya seçin.
- CLI proqnozlaşdırır və ötürür `--select`, lakin cari server yüngül seçicisi tuplunu qiymətləndirmir. Server tərəfində seçicinin dəstəyi tətbiq olunan iş vaxtı üçün yoxlanılmadığı təqdirdə müştəri tərəfi proyeksiyası tətbiq edin.
- Geniş sərhədsiz sorğular həmkar işləri, müştəri yaddaşı və kursorun ömür boyu riskini artırır. İstehlakçıya uyğun bir məntiqi məhdudluq və əlavənin ölçüsünü müəyyənləşdirin.
- İctimai JSON mənbə parametrləri və imzalanmış tiplənmiş sorğu parametrləri əlaqəli, lakin mübadiləsiz tel formatları deyil. Tiplənmiş sual pultları üçün SDK və ya CLI üçün üstünlük verin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Kursor dəstəkləyən səhifələşmə inteqrasiyası testləri bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Soruşma qurucusu və seçicisi davranışı bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Qeydiyyat parametrləri və bağlanmış commit-də kursor modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Suallar](/az/blockchain/queries.md)
- [Məlumat istintaq](/az/reference/queries.md)
- [JavaScript və TypeScript ](/az/guide/tutorials/javascript.md)
