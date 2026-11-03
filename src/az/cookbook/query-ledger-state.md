---
translation_locale: az
translation_source: /cookbook/query-ledger-state.md
translation_source_hash: 866b7d3ca37be67878f6f319ce0b0e27eac52c581decad1f46096ef75ad1b10f
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Blokçeyn dəftərçəsinin vəziyyətini sorğulamaq {#query-ledger-state}

## Nəticə {#outcome}

Taira JSON resurslarını oxuyun və proyeksiya edin, sonra CLI və Rust SDK vasitəsilə filtrlər, sıralama, server tərəfli proyeksiya, səhifə limitləri və qeyri-şəffaf `next_cursor` davamı ilə Torii kolleksiya sorğularından istifadə edin. Siz həmçinin siyahılar üçün imzalı tipli sorğulardan istifadə etməyəcəksiniz, çünki onlar siyahıları filtrləmir, sıralamır və proyeksiya etmir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Node.js 24 və indiki `iroha` CLI.
- Yalnız oxumaq üçün Taira girişi.
- CLI nümunələri üçün Taira və ya yaradılmış lokal şəbəkə üçün müştəri konfiqurasiyası.
- Rust nümunəsi üçün, hədəf şəbəkə ilə eyni Iroha mənbə reviziyasına bərkidilmiş bir layihə.

## Addımlar {#steps}

### 1. Ümumi Taira resursda səhifələyin {#_1-page-through-a-public-taira-resource}

Resurs yolları dashboardlar və qısa yoxlamalar üçün faydalıdır. JSON üçün soruşun, hər səhifəyə bağlayın və cavabı yoxladıqdan sonra tətbiqin ehtiyacı olan sahələri layihələndirin.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' --get \
  https://taira.sora.org/v1/domains \
  --data-urlencode 'sort=id' \
  --data-urlencode 'limit=5' \
  --data-urlencode 'include_total=true' \
  | jq '{total, next_cursor, ids: [.items[].id]}'
```

```js [Node.js]
const root = 'https://taira.sora.org'
const seen = new Set()
let cursor = null

do {
  const url = new URL('/v1/domains', root)
  url.search = new URLSearchParams({
    sort: 'id',
    limit: '5',
    ...(cursor ? { cursor } : {}),
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
  cursor = page.next_cursor
} while (cursor)
```

:::

Bu HTTP səthi `limit` və qeyri-şəffaf `next_cursor` ilə səhifələnir; o `null` olana qədər onu dəyişmədən `cursor` kimi geri göndərin. `total` yalnız `include_total=true` tələb etdikdə görünür və bu, tam skan tələb edir.

### 2. Kolleksiyanı CLI ilə filtrləyin {#_2-filter-a-collection-with-the-cli}

CLI filtri, proyeksiyanı və səhifə ölçüsünü kolleksiya son nöqtəsinə göndərir və bir səhifə, `{items, next_cursor}`, çap edir. `next_cursor` `null` olana qədər onu izləmək üçün `--all` əlavə edin.

```bash
DOMAIN_FILTER='id = "universal.universal"'

iroha --config ./localnet/client.toml \
  ledger domain list \
  --filter "$DOMAIN_FILTER" \
  --select id \
  --limit 1
```

Filtrləmə səhifələmədən əvvəl baş verir. Hər kolleksiya yalnız öz sahələrini qəbul edir; naməlum sahə heç nəyə uyğun gəlməmək əvəzinə `invalid_filter` qaytarır.

### 3. Sabit metadata açarına görə sıralayın {#_3-sort-by-a-stable-metadata-key}

Kolleksiya sıralama açarları elan edilmiş sahələri və `metadata.<key>` formasını qəbul edir; azalan sıra üçün açarın əvvəlinə `-` əlavə edin. Açarı olmayan sətirlər artan sırada birinci düzülür, bərabər dəyərlər isə sətir identikliyinə görə sıralanır, buna görə bütün kolleksiyada ardıcıl doldurulmuş açardan istifadə edin.

```bash
iroha --config ./localnet/client.toml \
  --machine \
  account list \
  --sort metadata.key \
  --limit 10 \
  | jq '[.items[] | {id, metadata}]'
```

`--select` server tərəfli proyeksiyadır: `--select id,metadata` yalnız həmin sahələri qaytarır, naməlum sahə isə `invalid_select` qaytarır. İmzalı tipli sorğular həmişə tam elementləri qaytarır, buna görə onların nəticələrini yuxarıdakı kimi `jq` və ya JavaScript ilə müştəri tərəfində proyeksiya edin.

### 4. Rust iterator-a qeyri-şəffaf kursorları izləməyə icazə verin {#_4-let-the-rust-iterator-follow-opaque-cursors}

`limit` səhifə ölçüsünü təyin edir. `list` tərəfindən qaytarılan iterator növbəti səhifəni serverin `next_cursor` dəyəri ilə yalnız cari səhifə tükəndikdən sonra sorğulayır, `take` isə məntiqi nəticəni məhdudlaşdırır. Burada `client` `iroha::blocking::Client` obyektidir.

```rust
use iroha::collections::{Collection, ListQuery, SortKey};

let query = ListQuery::new().sort_by(SortKey::asc("id")).limit(5);

for definition in client.list(Collection::AssetDefinitions, query).take(25) {
    let definition = definition?;
    println!("{:?} {:?}", definition.get("id"), definition.get("name"));
}
```

`next_cursor` kolleksiyasına, yoluna, filtrinə və sıralamasına bağlı qeyri-şəffaf açar dəsti mövqeyidir. Onu heç vaxt təhlil etməyin və ya süni yaratmayın, həmçinin onu fərqli filtr və ya sıralama ilə təkrar istifadə etməyin; Torii bunu `invalid_cursor` ilə rədd edir. Səhifələr arasında əlavə edilən və ya silinən sətirlər heç vaxt sonrakı səhifədə əlaqəsiz sətirlərin təkrarlanmasına və ya buraxılmasına səbəb olmur.

## Yoxla {#verify}

Dəqiq domen filtri yalnız `universal.universal`-ı qaytarmalıdır. Yalnız uğurlu CLI çıxışı saymaqla yox, nəticəni yoxlayın:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  ledger domain list --filter "$DOMAIN_FILTER" --select id --limit 1 \
  | jq -e '[.items[].id] == ["universal.universal"]'
```

Səhifələnmiş tətbiq sorğuları üçün həmçinin ID-lərin səhifələr arasında təkrarlanmadığını, tələb olunan məntiqi limitin heç vaxt aşılmadığını və rədd edilmiş kursordan sonra sorğunun sənədləşdirilmiş yoxlama nöqtəsindən yenidən başladığını sınayın.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Tək sorğu təkrarlana bilən filter, sıralama, səhifələmə və ya əldə etmə parametrlərini qəbul etmir. Bu nəzarətlər lazım olduqda müvafiq siyahı sorğusundan istifadə edin.
- `limit` ümumi nəticə deyil, səhifə ölçüsüdür: ən azı 1 və ən çoxu qovşağın `torii.app_api_max_list_limit` dəyəri (standart olaraq 500); Torii-nin standart dəyəri 100-dür. Daha çox oxumaq üçün `next_cursor`, `--all` və ya SDK iteratorundan istifadə edin.
- `invalid_cursor` kursorun səhv formalaşdığını və ya başqa kolleksiyaya, yola, filtrə və ya sıralamaya aid olduğunu bildirir. Sorğunu yenidən başladın; qeyri-şəffaf dəyəri düzəltməyə cəhd etməyin.
- Seçici filtr boş olmayan `next_cursor` ilə qısa və ya boş səhifə qaytara bilər. O `null` olana qədər onu izləməyə davam edin.
- `--filter` və HTTP `filter` parametri Torii-nin mətn qrammatikasını qəbul edir, məsələn, `id = "universal.universal"` və ya `exists(metadata.tier)`. JSON predikat obyekti filtr mətni deyil və etibarsız `filter` kimi uğursuz olur.
- Geniş, məhdudiyyətsiz sorğular şəbəkə həmkarlarının işini və müştərinin yaddaş istifadəsini artırır. İstehlakçıya uyğun məntiqi limit və səhifə ölçüsü təyin edin.
- İmzalı `/v1/query` siyahı API-si deyil. O, tək nəticəli sorğuları və filtrsiz iterasiya olunan bir neçə sorğu başlanğıcını qəbul edir, digərlərini isə, məsələn, `FindDomains` və ya `FindAssetDefinitions` sorğularını, `signed_query_shape_not_admitted` ilə rədd edir. Kolleksiya son nöqtələri, CLI `list` əmrləri və SDK kolleksiya oxuyucuları vahid filtr, sıralama və kursor qrammatikasından istifadə edir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu reviziyasında Torii kolleksiya sorğuları müqaviləsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/torii/collection_queries.md)
- [Sabitlənmiş mənbə kodu reviziyasında Rust kolleksiya oxunuşları və kursor iteratoru](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/collections.rs)
- [Sabitlənmiş mənbə kodu reviziyasında imzalı sorğuların qəbulu](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/query_json.md)
- [Sorğular](/az/blockchain/queries.md)
- [Sorğu istinadı](/az/reference/queries.md)
- [JavaScript və TypeScript](/az/guide/tutorials/javascript.md)
