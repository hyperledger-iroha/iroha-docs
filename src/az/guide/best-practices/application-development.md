---
translation_locale: az
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tətbiq İnkişafı {#application-development}

Iroha tətbiqləri əməliyyat davranışını açıq şəkildə göstərməli, imzalama vəziyyətini daxildə saxlamalı və sorğularla hadisələrdən istehsalda müşahidə etmək asan olan yollarla istifadə etməlidir.

## Müştəri Quraşdırması {#client-setup}

- Müştəri konfiqurasiyasını tətbiq mənbə kodundan kənarda saxlayın. Zəncir ID-sini, Torii URL, imzalama hesabını və əməliyyat parametrlərini mühitə xüsusi konfiqurasiyadan yükləyin.
- Yerəl şəbəkə, Taira, Minamoto və özəl şəbəkələr üçün `client.toml` fayllarını ayrı saxlayın. Kopyalanmış testnet kriptoqrafik imzalayıcı heç vaxt mainnet kriptoqrafik imzalayıcı olmamalıdır.
- Əməliyyatın ömür müddətlərini və vəziyyət zaman aşımını diqqətlə təyin edin. Çox qısa ömür müddəti normal şəbəkə tələskənliyində bitə bilər, çox uzun ömür müddəti isə təkrar göndərişləri başa düşməyi çətinləşdirə bilər.
- `nonce = true`-dan yalnız təkrarlanan əməliyyatların fərqli kriptoqrafik xeshlərə malik olması lazım olduqda istifadə edin. İdempotent biznes əməliyyatları üçün, yenidən cəhdlərin izlənə bilməsi üçün tətbiq sorğu ID-sini saxlayın və təkrar istifadə edin.

Cari TOML sahələri üçün [Müştəri Konfiqurasiyası](/az/guide/configure/client-configuration.md)-a baxın.

## Əməliyyatlar {#transactions}

- Xam JSON və ya sətir yığılmış yükləmələr əvəzinə, mümkün olduqda yazılmış SDK təlimatlardan əməliyyatlar qurun.
- Oxunmağı yalnız sorğularla edilən preflight önəmli yazılar: hesabın mövcudluğu, aktiv balansları, icazə vəziyyəti, ödəniş aktivinin mövcudluğu və hədəf obyektinin vəziyyəti.
- Əməliyyatı təqdim etməzdən əvvəl kriptoqrafik hash-i, səlahiyyətli əsas hesabı, təlimat xülasəsini və gözlənilən vəziyyət dəyişikliklərini qeyd edin.
- `Rejected`, `Expired` və vaxt aşımı nəticələrini fərqli şəkildə müalicə edin. Vaxt aşımı o deməkdir ki, müştəri son statusu müşahidə etməyib; bu isə şəbəkənin əməliyyatı görməməzlikdən gəldiyini sübut etmir.
- Uğurlu yazmadan sonra, əməliyyatın nəticəsini biznes əməliyyatına uyğun bir sorğu və ya hadisə yoxlama nöqtəsi ilə təsdiqləyin.

Əməliyyat mexanikası üçün baxın [Əməliyyatlar](/az/blockchain/transactions.md).

## Sorğular və Tədbirlər {#queries-and-events}

- Cari vəziyyət üçün sorğulardan və dəyişiklik bildirişləri üçün hadisə axınlarından istifadə edin. Hadisə idarəsini təkrarlanan geniş sorğularla əvəz etməkdən çəkinin.
- Hesab, aktiv və blok siyahıları kimi geniş təkrarlana bilən sorğuları səhifələyin.
- Abunəliklər və tetikleyicilər üçün dar süzgəcləri seçin. Geniş süzgəclər diaqnostika üçün faydalıdır, lakin əlavə icra və müştəri tərəfi emalına səbəb ola bilər.
- Yalnız oxumaq üçün tüstü yoxlamalarını imzalanmış əməliyyat testlərindən ayrı saxlayın ki, API son nöqtəsinin mövcudluğunu diaqnoz etmək daha asan olsun.

Baxın [Sorğular](/az/blockchain/queries.md), [Tədbirlər](/az/blockchain/events.md) və [Filtrlər](/az/blockchain/filters.md).

## Agent Dəstəyi ilə İnkişaf {#agent-assisted-development}

- Agentlərdən əməliyyat kodunu yazmağı xahiş etməzdən əvvəl sənədləri, SDK kodunu və yalnız oxuma rejimli şəbəkə vəziyyətini yoxlamasına icazə verin.
- Canlı şəbəkə testlərini `TAIRA_LIVE=1` kimi bir mühit bayrağı arxasında könüllü olaraq saxlayın.
- Xahiş edirəm göstərişlərə şəxsi açarları, hesab bərpa materiallarını, API tokenlərini və ya ötürülmüş avtorizasiya başlıqlarını yapışdırmayın.
- Hər hansı bir agent canlı testnet əməliyyatı göndərmədən əvvəl əməliyyat planı tələb edin. Plan şəbəkəni, səlahiyyət prinsipi, təlimatları, ödəniş aktivini, əvvəlcədən oxumaları, gözlənilən nəticəni və təkrar davranışı göstərməlidir.

Taira MCP iş axını üçün [SORA 3 üzərində qurun: Taira və Minamoto](/az/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents)-a baxın.

## SDK Gigiyena {#sdk-hygiene}

- Pin SDK və ikili versiyaları birlikdə [Uyğunluq Matrisi](/az/reference/compatibility-matrix.md) istifadə edərək.
- Yaradılmış müştəri kodunu, parçaları və nümunələri sabitləşdirilmiş yuxarı axın iş sahəsinin versiyası ilə sinxron saxlayın.
- Əməliyyat qurumu kodu üçün vahid testləri və tətbiqinizin asılı olduğu ən kiçik oxuma və yazma yolları üçün inteqrasiya testləri əlavə edin.
