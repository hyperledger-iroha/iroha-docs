---
translation_locale: az
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tətbiqi inkişafı {#application-development}

Iroha tətbiqləri əməliyyat davranışını açıq şəkildə göstərməlidir, imzalanma vəziyyətini saxlamalı və sorğu və hadisələrdən istehsalda müşahidə edilməsi asan olan yollarla istifadə etməlidir.

## Müştəri quruluşu {#client-setup}

- Tətbiq mənbə kodundan kənarda müştəri konfigurasiyasını saxlayın. Zəngini yükləyin ID, Torii URL, imza hesabı və əməliyyat parametrləri ətraf mühitə aid quruluşdan.
- `client.toml` fayllarını localnet, Taira, Minamoto və özəl şəbəkələr üçün ayrı saxlayın.
- Çox qısa bir ömrü normal şəbəkə narahatlığı altında sona çata bilər, lakin çox uzun biri ikiqat təqdimatları əsaslandırmaq daha çətin edə bilər.
- `nonce = true` yalnız təkrarlanan əməliyyatların ayrı-ayrı hashləri olması lazım olduqda istifadə edin. İdempotent iş əməliyyatları üçün bir tətbiq tələbini saxlayın və yenidən istifadə edin ID belə ki, yenidən cəhdlər izləyə bilər.

Mövcud TOML sahələri üçün [Müxfilik Konfigurasiyası](/az/guide/configure/client-configuration.md)-ə baxın.

## Əməliyyatlar {#transactions}

- Mümkün olduğu təqdirdə xam JSON və ya silsilə ilə yığılmış pay yükləri əvəzinə SDK tiplənmiş təlimatlardan əməliyyatları qur.
- Preflight vacib yalnız oxunma sualları ilə yazır: hesabın mövcudluğu, aktiv balansları, icazə statusu, ödəniş aktivlərinin mövcudluğu və hədəf obyektinin statusu.
- Ödəniş hashini, səlahiyyətli hesabı, təlimatların ümumiləşdirilməsini və təqdim etməzdən əvvəl gözlənilən vəziyyət dəyişikliyini qeyd edin.
- `Rejected`, `Expired` ilə müalicə olun və vaxt təxirə salınması nəticələri fərqli olur.
- Müvəffəqiyyətlə yazıldıqdan sonra, nəticədə olan vəziyyəti iş əməliyyatına uyğun bir sorğu və ya hadisə yoxlama nöqtəsi ilə təsdiqləyin.

Əməliyyat mexanikası üçün [Əməliyyatları ](/az/blockchain/transactions.md) baxın.

## Suallar və hadisələr {#queries-and-events}

- Dəyişiklik bildirişləri üçün mövcud vəziyyət və hadisə axınları ilə bağlı sorğulardan istifadə edin.
- Hesab, aktiv və blok siyahıları kimi geniş təkrarlana bilən sorğuların səhifələrini açın.
- Təsdiqlər və tetikçilər üçün dar filtrləri üstün tuturlar. Geniş filterlər diaqnozlaşdırma üçün faydalıdır, lakin lazımsız icra və müştəri tərəfi işlənməsini əlavə edə bilər.
- Yalnız oxumaq üçün tütün yoxlamalarını imzalanmış əməliyyat testlərindən ayırın ki, son nöqtələrin mövcudluğu daha asan diaqnozlaşdırılsın.

Bax [Soruşmalar](/az/blockchain/queries.md), [Hələliklər](/az/blockchain/events.md) və [Filterlər](/az/blockchain/filters.md).

## Agentlərin köməyi ilə inkişaf {#agent-assisted-development}

- Agentlərdən əməliyyat kodunu yazmalarını istəmədən əvvəl sənədləri, SDK kodu və yalnız oxuma şəbəkə vəziyyətini yoxlamalarına icazə verin.
- `TAIRA_LIVE=1` kimi bir ətraf mühit bayrağı arxasında canlı şəbəkə sınaqları aparmaq üçün seçin.
- Xüsusi açarları, hesabın bərpası materialını, API nömrələrini və ya ötürülmüş müəllif başlıqlarını istəklərə qoyma.
- Hər hansı bir agent canlı testnet əməliyyatını təqdim etməzdən əvvəl bir əməliyyat planı tələb edin. Plan şəbəkənin, səlahiyyətlilərin, təlimatların, ödəniş aktivlərinin, uçuşdan əvvəl oxumalarının, gözlənilən nəticənin və yenidən cəhd davranışının adını verməlidir.

İcra Hakimiyyəti Taira MCP iş axını, bax [Üstəlik, SORA 3: Taira və Minamoto](/az/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Higiena {#sdk-hygiene}

- Pin SDK və ikili versiyalar birlikdə [ uyğunluq matrisindən istifadə edərək](/az/reference/compatibility-matrix.md).
- Yaradılan müştəri kodunu, hissələri və nümunələrini yuxarı axın iş məkanının tənzimlənməsi ilə sinxronlaşdırın.
- Tətbiqinizdən asılı olan ən kiçik oxumaq və yazmaq yolları üçün əməliyyat qurma kodu və inteqrasiya testləri üçün vahid sınaqlar əlavə edin.
