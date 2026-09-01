---
translation_locale: az
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: bing-translator-llm
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Sorğular {#queries}

Hadisə abunəçiləri və filtrler blokçeyn vəziyyətində baş verən dəyişiklikləri izləyə bilər. Cari vəziyyətə birbaşa baxış lazım olduğunda sorğu istifadə edin.

Sorğular kiçik, təlimat kimi obyektlərdir. Cari dünya vəziyyəti baxışından məlumat almaq üçün birini Iroha şəbəkə tərəfdaşına göndərin.

Şəbəkə digər məlumatları ortaya çıxara bilər. Sorğulana bilən dünya vəziyyəti məlumatı, hər Iroha şəbəkəsində mövcud olacağı qarantiyalı yeganə məlumat növüdür.

Iroha hər yerləşdirmə üçün digər əlçatan məlumatlar ola bilər. Məsələn, telemetriya məlumatlarının əlçatanlığı şəbəkə inzibatçılarına bağlıdır. Onların işi izləmək üçün hesablama gücünü ayırmaq istəyib-istəməmələri tamamilə onların qərarına bağlıdır, əksinə onu faktiki işi görmək üçün istifadə edə bilərlər. Qarşılaşdırma üçün, bəzi funksiyalar həmişə tələb olunur, məsələn, hesab balansınıza çıxışın olması.

Sorğuların nəticələri eyni anda həmçinin [sıralanmış](#sorting), [səhifələnmiş](#pagination) və [süzülmüş](#filters) tərəfdaş tərəfindən ola bilər. Sıralama metadatanın açarları üzrə leksikoqrafik şəkildə aparılır. Filtrləmə edilə bilər müxtəlif prinsiplərə əsaslanaraq, domenə xas olan (fərdi IP ünvan filtrləmə maskaları) metodlardan `begins_with` kimi məntiqi əməliyyatlarla birləşdirilən alt-sətir metodlarına qədər.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

Taira ümumi resurslar üçün JSON üzərində yalnız oxumaq üçün sorğu köməkçiləri təqdim edir. Bir SDK qoşmazdan əvvəl səhifələmə və cavab idarəsini təcrübə etmək üçün onlardan istifadə edin:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Tətbiq diaqnostikası üçün bu ilkin yoxlamaları imzalanmış əməliyyat testlərindən ayrı saxlayın. Yalnız oxuma sorğusunun uğursuzluğu adətən kriptoqrafik imzalayıcı qurulumuna işarə etməzdən əvvəl API son nöqtəsinin mövcudluğunu, şəbəkə əlçatanlığını və ya marşrut uyğunluğunu göstərir.

## Sorğu yaradın {#create-a-query}

SDK və ya CLI-dən tipli sorğu qurucularından istifadə edin. Məsələn, mövcud məlumat modeli hesabları siyahıya salmaq üçün `FindAccounts`-ı təqdim edir:

```rust
let query = FindAccounts;
```

Budur Alice-ın aktivlərini tapan sorğunun bir nümunəsi:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Səhifələmə {#pagination}

Tək sorğular və kiçik təkrar olunan sorğular üçün, sorğunu təqdim etmək və nəticəni birbaşa əldə etmək üçün `client.request` istifadə edə bilərsiniz.

Bununla belə, `FindAccounts`, `FindAssets` və ya `FindBlocks` kimi geniş təkrarlana bilən sorğular böyük nəticə dəstləri qaytara bilər. Şəbəkə tərəfdaşında və müştəridə yüklənməni azaltmaq üçün səhifələmədən istifadə edin.

`Pagination` qurmaq üçün, `client.request_with_pagination(query, pagination)`-i çağırmalısınız, burada `pagination` aşağıdakı kimi qurulur:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtrlər {#filters}

Sorğu yaratdığınız zaman yalnız müəyyən edilmiş filtrə uyğun nəticələri qaytarmaq üçün filtrdən istifadə edə bilərsiniz.

Filtrlər sorğuya xasdır. Məsələn, hesab sorğuları hesab şəxsiyyəti və ya metadatalar vasitəsilə daraldıla bilər, aktiv sorğuları isə aktiv tərəfindən daraldıla bilər. tərif, hesab sahibi və ya domen proyeksiyası. Filtr növünün sorğu çıxışı növü ilə uyğun olması üçün mümkün olduqda SDK tipli sorğu qurucularından istifadə edin.

## Sıralama {#sorting}

Iroha elementləri [metaməlumat](/az/blockchain/metadata.md) ilə leksikoqrafik qaydada sıraya sala bilər, əgər sorğunu qurarkən sıralanacaq açarı göstərsəniz. Tipik bir istifadə vəziyyəti odur ki, hesabların `registered-on` metadatası olsun, bu, sıraya alındığında hesab qeydiyyat tarixçəsini görməyə imkan verir.

Sıralama yalnız [metaməlumat](/az/blockchain/metadata.md) olan qurumlara tətbiq olunur, çünki metadata açarı sorğu nəticələrini sıralamaq üçün istifadə olunur.

Siz sıralamanı səhifələmə və filtrlərlə birləşdirə bilərsiniz. Qeyd edin ki, sıralama opsional bir xüsusiyyətdir, səhifələmə ilə olan əksər sorğulara buna ehtiyac olmayacaq.

## İstinad {#reference}

Onlar haqqında ətraflı məlumat üçün [mövcud sorğuların siyahısı](/az/reference/queries.md)-i yoxlayın.
