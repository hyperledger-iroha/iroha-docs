---
translation_locale: az
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# Suallar {#queries}

Blockchain-in vəziyyəti haqqında çox məlumat əldə edilə bilsə də, daha əvvəl göstərdiyimiz kimi, tədbir abunəçisi və bir filtrdən istifadə edərək tədbirlərin sahəsini maraqlı olanlara məhdudlaşdırmaq üçün bəzən daha birbaşa yanaşmanıza ehtiyacınız olur. Sual daxil edin.

Suallar kiçik bir təlimat kimi obyektlərdir ki, Iroha həmyaşıllısına göndərildikdə, hazırkı dünya vəziyyətinə dair baxışdan ətraflı məlumatlarla cavab verməyə səbəb olur.

Bu, mütləq şəbəkədə mövcud olan yeganə informasiya növü deyil, lakin bütün şəbəkələrdə əlçatan olacağı təmin edilən yeganə məlumat növüdür.

Iroha tətbiqi üçün digər məlumatlar da ola bilər. məsələn, telemetriya məlumatlarının mövcudluğu şəbəkə idarəçilərinə aiddir. Əksinə, bəzi funksiyalar həmişə tələb olunur, məsələn hesabınızın balansına giriş etmək.

Sualların nəticələri [sifariş edilmiş](#sorting), [səhifələri](#pagination) və [filtrlənmiş](#filters) Metadata açarları üzrə leksikografik olaraq sıralama aparılır. Filtrləmə müxtəlif prinsiplər əsasında həyata keçirilə bilər. IP adres filtr maskaları) kimi sub-satır üsullarına `begins_with` məntiqi əməliyyatlardan istifadə edərək birləşdirilmişdir.

## Taira üzərində sınayın. {#try-it-on-taira}

Taira ümumi resurslar üçün JSON üzərində yalnız oxunmuş sorğu köməkçilərini aşkar edir. SDK birinin kabllaşdırılmasından əvvəl səhifələşdirmə və cavab idarəetməsi təcrübəsi üçün istifadə edin:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

Tətbiq diaqnostikası üçün bu tüstü yoxlamaları imzalanmış əməliyyat testlərindən ayrı saxlayın. Yalnız oxunma sorğusunun uğursuzluğu adətən imzalayıcının quraşdırılmasına göstərmədən əvvəl son nöqtələrin mövcudluğuna, şəbəkənin əlçatmazlığına və ya marşrut uyğunluğuna işarədir.

## Bir sual yaratmaq {#create-a-query}

SDK və ya CLI-dən tiplənmiş sorğu qurucularından istifadə edin. Məsələn, mövcud məlumat modeli `FindAccounts` siyahıyaalma hesabları üçün açıqlayır:

```rust
let query = FindAccounts;
```

Burada Alice'in aktivlərini tapa bilən bir sorğunun nümunəsi var:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## Səhifələr {#pagination}

Singular sualları və kiçik təkrarlana bilən suallar üçün `client.request` istifadə edərək bir sorğu göndərmək və nəticəni bir dəfə əldə etmək olar.

Bununla birlikdə, `FindAccounts`, `FindAssets` və ya `FindBlocks` kimi geniş təkrarlana bilən sorğular böyük nəticə dəstlərini verə bilər. Peer və müştəri yükünü azaltmaq üçün səhifələşdirmədən istifadə edin.

Bir `Pagination` qurmaq üçün `client.request_with_pagination(query, pagination)` çağırmalısınız, burada `pagination` aşağıdakı kimi qurulur:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## Filtrlər {#filters}

Bir sorğu yaratarkən, yalnız müəyyən edilmiş filtrə uyğun olan nəticələri qaytarmaq üçün bir filterdən istifadə edə bilərsiniz.

Filterlər sorğu-specifikdir. Məsələn, hesab sorğuları hesab kimliyi və ya metadata ilə daraldıla bilər, aktiv sorğuları isə aktiv təyinatı, sahibinin hesabı və ya domen proqnozu ilə daralına bilər. Mümkün olduqda SDK'nin tapılan sorğu qurucularından istifadə edin ki, filtr tipi sorğunun çıxışı tipinə uyğun olsun.

## Sortlaşdırma {#sorting}

Iroha sualın qurulması zamanı sıralamaq üçün bir açar təqdim etsəniz, [ metadata](/az/blockchain/metadata.md) ilə elementləri leksikoqrafik olaraq sıralaya bilər. Tipik istifadə halı hesabların `registered-on` metadata girişinə malik olmasıdır.

Sortlaşdırma yalnız [ metadata](/az/blockchain/metadata.md) olan subyektlərə tətbiq olunur, çünki meta məlumat açarı sorğu nəticələrini sıralamaq üçün istifadə olunur.

Səhifə sıralama və filtrləri birləşdirə bilərsiniz. Qeyd edək ki, sıralama seçim xüsusiyyətidir, səhifə sıralaması ilə əlaqədar əksər sorğularda buna ehtiyac yoxdur.

## Referensiya {#reference}

Bu barədə ətraflı məlumat almaq üçün [ mövcud sorğuların siyahısını ](/az/reference/queries.md) yoxlayın.
