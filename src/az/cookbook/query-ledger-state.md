---
translation_locale: az
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 68ef931f3d37b9bd40fcf61c9a77313539ca0bd648405834d161a018debb491a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Blokçeyn dəftərçəsinin vəziyyətini sorğulamaq {#query-ledger-state}

## Nəticə {#outcome}

Oxuyun və Taira JSON resurslarını layihələndirin, sonra isə süzgəclər, məntiqi səhifələmə, sıralama, alma ölçüləri və yalnız irəli göstərici kursor davamlılığı ilə yazılmış Iroha sorğularından istifadə edin. Siz həmçinin yönləndirilmiş `--select` tuple server tərəfindən qiymətləndiriləndən əvvəl seçici layihələndirməyə güvənməkdən çəkinəcəksiniz.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Node.js 24 və indiki `iroha` CLI.
- Yalnız oxumaq üçün Taira girişi.
- İmzalı yazılı sorğu nümunələri üçün, Taira və ya yaradılmış lokal şəbəkə üçün bir müştəri konfiqurasiyası.
- Rust nümunəsi üçün, hədəf şəbəkə ilə eyni Iroha mənbə reviziyasına bərkidilmiş bir layihə.

## Addımlar {#steps}

### 1. Ümumi Taira resursda səhifələyin {#_1-page-through-a-public-taira-resource}

Resurs yolları dashboardlar və qısa yoxlamalar üçün faydalıdır. JSON üçün soruşun, hər səhifəyə bağlayın və cavabı yoxladıqdan sonra tətbiqin ehtiyacı olan sahələri layihələndirin.

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

Bu HTTP səth `limit` və `offset` istifadə edir. Əgər marşrut daha ucuz sayma rejimi istifadə edirsə, buraxılmış və ya məhdudlaşdırılmış `total` normal kimi qəbul olunmalıdır.

### 2. Yığılmış CLI sorğunu süzün və partiyalara ayırın {#_2-filter-and-batch-a-typed-cli-query}

CLI tipli təkrarlana bilən sorğunu ardıcıllıqla saxlayır və daxili olaraq serverin davamlı göstəricilərini izləyir. Burada məntiqi nəticə bir sətr ilə məhdudlaşdırılır, `--fetch-size 1` isə hər gediş-gəlişdə götürülən maksimum partiyanı idarə edir.

```bash
DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'

iroha --config ./localnet/client.toml \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 \
  --offset 0 \
  --fetch-size 1
```

Filtrləmə səhifələnmədən əvvəl baş verir. Sorğuya xas tipli predikatlardan istifadə edin; bir hesab və ya aktiv üçün predikat təhlükəsiz şəkildə bir domen üçün yenidən istifadə oluna bilməz.

### 3. Sabit metadata açarına görə sıralayın {#_3-sort-by-a-stable-metadata-key}

Daxil edilmiş sorğunun sıralaması bir metadata açarı üzrə leksioqrafikdir. O açara sahib olmayan elementlər proqram təminatı icra mühitinin müəyyən etdiyi qaydada sıralanır, buna görə bütün kolleksiya üzrə eyni şəkildə doldurulmuş açardan istifadə edin.

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

Qeydiyyatdan keçmiş CLI `--select` JSON analiz edir və seçici tuple-ni yönləndirir, lakin hazırkı yüngül sorğu DSL həmin seçicini serverdə qiymətləndirmir. Hələ bunun ətrafında bir proyeksiya müqaviləsi qurmayın. Yalnız hədəf proqram təminatı icra mühiti bunu dəstəklədikdən sonra yazılı SDK proyeksiyasından istifadə edin, ya da təsdiqlənmiş nəticəni yuxarıdakı kimi `jq` və ya JavaScript ilə müştəri tərəfdə proyeksiya edin.

### 4. Rust iterator-a qeyri-şəffaf kursorları izləməyə icazə verin {#_4-let-the-rust-iterator-follow-opaque-cursors}

`Pagination` məntiqi nəticə dəstini məhdudlaşdırır. `FetchSize` hər bir server partiyasını idarə edir. Qaytarılan iterator server tərəfindən yaradılan kursoru istifadə edərək davametmə sorğularını şəffaf şəkildə göndərir.

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

Bir `ForwardCursor` səlahiyyətlə bağlıdır, prosesə məxsusdur və yalnız irəli yönlüdür. Onu heç vaxt təhlil etməyin, sintetikləşdirməyin, avtorizasiya əsasları arasında paylaşmayın və ya onu Torii nümunələri arasında daşına bilən CV tokeni kimi saxlamayın. Əgər müddəti bitirsə, ilkin sorğunu qəsdən tətbiq səviyyəsində yoxlama nöqtəsi ilə yenidən başlayın.

## Yoxla {#verify}

Dəqiq domen filtri yalnız `wonderland.universal`-ı qaytarmalıdır. Yalnız uğurlu CLI çıxışı saymaqla yox, nəticəni yoxlayın:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list filter "$DOMAIN_PREDICATE" \
  --limit 1 --offset 0 --fetch-size 1 \
  | jq -e 'length == 1 and .[0] == "wonderland.universal"'
```

Səhifələnmiş tətbiq sorğuları üçün, həmçinin test edin ki, ID-lər səhifələrdə təkrarlanmır, tələb olunan məntiqi limit heç vaxt aşılmır və başa çatmış kursorun ardından təkrar cəhd etmə sənədləşdirilmiş yoxlama nöqtəsindən başlayır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Tək sorğu təkrarlana bilən filter, sıralama, səhifələmə və ya əldə etmə parametrlərini qəbul etmir. Bu nəzarətlər lazım olduqda müvafiq siyahı sorğusundan istifadə edin.
- `fetch_size` sıfır olmayan toplu göstəricidir, total nəticə limiti deyil. Hazırkı standart `100`-dir və proqram təminatı işləmə mühiti maksimum dəyərdən yuxarı olan qiymətləri rədd edir.
- Naməlum, müddəti bitmiş və ya xarici kursor qəsdən yenidən istifadə edilə bilməz. Sorğunu yenidən başladın; şəffaf olmayan dəyəri təmir etməyə cəhd etməyin.
- Metadatanın sıralanması ümumi sahə sıralaması deyil. Əgər hər bir element seçilmiş açarı daşımırsa, açarı çatmayanların sırasını sənədləşdirin və ya başqa bir strategiya seçin.
- CLI `--select` analiz edir və ötürür, lakin mövcud server yüngül çəkili seçici tuplonu qiymətləndirmir. İstifadəçi tərəfi layihəsi tətbiq edin, əgər server tərəfi seçici dəstəyi yerləşdirilmiş proqram icra mühiti üçün təsdiqlənməyibsə.
- Geniş və məhdudiyyəti olmayan sorğular şəbəkə yoldaşı işini, müştəri yaddaşını və kursorun ömrü riskini artırır. Məntiqi bir limit və istehlakçıya uyğun bir götürmə ölçüsü təyin edin.
- İctimai JSON resurs parametrləri və imzalanmış tipli sorğu parametrləri əlaqəlidir, lakin əvəz edilə bilən seriyalaşdırma formatları deyildir. Tipli sorğu verilənləri konteynerləri üçün SDK və ya CLI-dən istifadə edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Pinned mənbə kodu reviziyasında kursora əsaslanan səhifələmə inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/pagination.rs)
- [Möhkəmlənmiş mənbə kodu reviziyasında sorğu qurucusu və seçici davranışı](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/builder/mod.rs)
- [Sorğu parametrləri və pinlənmiş mənbə kodu reviziyasında kursor modeli](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/query/parameters.rs)
- [Sorğular](/az/blockchain/queries.md)
- [Sorğu istinadı](/az/reference/queries.md)
- [JavaScript və TypeScript](/az/guide/tutorials/javascript.md)
