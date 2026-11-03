---
translation_locale: az
translation_source: /cookbook/index.md
translation_source_hash: 9e13bcd28ad8ae356314041828f73af0ed25636af82ff4ea2948268b47dd73e6
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Iroha 3 Tətbiq Resept Kitabı {#iroha-3-application-cookbook}

Əleyhinə qurmaq Iroha 3 kiçik, təsdiqlənə bilən reseptlərlə başlayır Taira testnet və saxlamaq Minamoto əsas şəbəkə yalnız-oxu. Hər bir resept onun ictimai oxu olub-olmadığını bildirir, normal maliyyələşdirilmiş hesab yazısı və ya icazə ilə məhdudlaşdırılmış əməliyyat. Əmrlər cari vəziyyəti istifadə edir I105 hesab identifikatorları, açıq rüsum seçimi və daxil edilmiş davranış Iroha protokolun yekunlaşdırılması [`c8c872461e92f04325c350cdd952f4276e96f9dc`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc).

[Taira-ya qoşulun](./connect-to-taira.md) bələdçisi ilə başlayın. O, imzalayanı maliyyələşdirir və əmr sətri reseptlərinin təkrar istifadə etdiyi ödəniş aktivini qeyd edir. Ödəniş aktivi ID-sini heç vaxt bu sənədlərdən kopyalamayın: onu cari Taira testnet maliyyələşdirmə xidmətinin siyasətindən oxuyun.

## Giriş səviyyələri {#access-levels}

- İctimai — heç bir kriptoqrafik imzalayan və ya şəbəkə icazəsi tələb edilmir.
- **Yazmağa hazır** — maliyyələşdirilmiş Taira test hesabından, açıq şəkildə seçilmiş ödəyicidən və testnet maliyyələşdirmə xidməti siyasətinin dərc etdiyi cari ödəniş aktivindən istifadə edin.
- İcazə tələb olunur — Taira adlı proqram icra mühitinə və ya idarə olunan ad məkanına icazə verməlidir. Bu icazə mövcud olmadıqda yaradılmış yerli şəbəkədən istifadə edin; yerli uğur Taira avtorizasiya əsasını təmin etmir.

Heç bir aşpaz kitabı resepti Minamoto ünvanına yazı göndərmir.

## Başla və təqdim et {#start-and-submit}

|Resept|Taira giriş|Sən nə ilə bitirirsən|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Taira-ə qoşul](./connect-to-taira.md)                             |Yazmağa hazır|Maliyyələşdirilmiş I105 kriptoqrafik imzalayıcı, canlı ödəniş aktivləri və tətbiq edilmiş kanare əməliyyatı|
| [Əməliyyatları göndərin və təsdiqləyin](./submit-and-verify-transactions.md) |Yazmağa hazır|Ödəniş qiyməti təxmininə, terminal proqram təminatı işləmə iş axışı nəticəsinə və saxlanmış protokol nəticə qeydinə malik əməliyyat|

## blokçeyn dəftər vəziyyəti {#ledger-state}

|Resept| Taira giriş|Sən nə ilə bitirirsən|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Hesablar və təxəllüslər](./accounts-and-aliases.md) |İcazə tələb olunur| Bir I105 hesabı və həll edilə bilən insan tərəfindən oxuna bilən ləqəb |
| [Mübadilə edilə bilən aktivlər](./fungible-assets.md)           |İcazə tələb olunur|Qeydiyyatdan keçmiş təyinat, verilmiş balans və təsdiqlənmiş köçürmə|
| [NFTs](./nfts.md)                                 |İcazə tələb olunur|Qeydiyyatdan keçmiş NFT, mülkiyyət ötürülüb və dövlət sonrası sorğu|
| [Metaməlumat](./metadata.md)                         |Sahib olduğunuz obyektlər üçün yazmağa hazır; əks halda icazə tələb olunur|Dəqiq oxumağı izləyən metadata yazısı|
| [Blokçeyn dəftər vəziyyətini sorğu et](./query-ledger-state.md)     |İctimai dövlət üçün ictimai|Səhifələnmiş və yazı olmadan süzülmüş nəticələr|

## Giriş və avtomatlaşdırma {#access-and-automation}

|Resept| Taira giriş        |Sən nə ilə bitirirsən|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [İcazələr və rollar](./permissions-and-roles.md) |İcazə tələb olunur|Təkrar istifadə oluna bilən rolda toplanmış məhdudlaşdırılmış icazə|
| [Axın hadisələri](./stream-events.md)                 |İctimai|Kəsilmədən sonra uzlaşan təkrar qoşulan SSE istifadəçi|
| [Səbəblər](./triggers.md)                           |İcazə tələb olunur|Texniki çağırış tetikleyicisi, icra protokolu nəticəsi qeydi və tamamlanma hadisəsi|
| [Çoximzalı](./multisig.md)                           |Yazmağa hazır|Çəkiyə əsaslanan çox imzalı hesab və kvorum tərəfindən təsdiqlənmiş təklif|

## Tətbiq nümunələri {#application-patterns}

|Resept| Taira giriş|Sən nə ilə bitirirsən|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Ağıllı müqavilələr](./smart-contracts.md) |İcazə tələb olunur|Yoxlanıldı Kotodama batkod, yerləşdirmə artefaktları və müqavilənin texniki çağırışı|
| [Wallet Connect](./wallet-connect.md) |Bağlantı aktiv olduqda yazmağa hazır|Cüzdan tərəfindən təsdiqlənmiş aktiv köçürməsi və uzlaşdırılmış əməliyyat kriptoqrafik xəşi|
| [Yerli depozit](./native-escrow.md)     |Əmlak sahibləri üçün yazmağa hazır; mübahisələrin həlli icazə tələb edir|Sorğulanan son vəziyyətlə yerli blok və ya bazar yeri depoziti|

## Yoxlanılmış nümunə səthləri {#verified-example-surfaces}

Aşağıdakı işarələr hər bir reseptdə icra edilə bilən nümunələri təsvir edir, xüsusiyyəti əldə edə biləcək hər SDK deyil.

|Resept| HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Taira ilə əlaqə qurun|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Təqdim et və təsdiqlə|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Hesablar və ləqəblər|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Mübadilə edilə bilən aktivlər|      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
| NFTs                  |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metaməlumat|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Blok zənciri dəftər vəziyyətini sorğulamaq|      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|İcazələr və rollar|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Hadisələri yayımla|      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Tətiklər|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Çox imzalı|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Ağıllı müqavilələr|      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Cüzdan əlaqəsi|      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Yerli depozit|      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Hər resept istehsal memarlığına, əməliyyatlara, SDK və API təlimatlarına bağlantı verir. Resept özü bir uğurlu yolu göstərir. Həmçinin nəticəni sübut etmək üçün lazım olan yoxlamaları da ehtiva edir.
