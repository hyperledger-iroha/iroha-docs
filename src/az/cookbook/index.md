---
translation_locale: az
translation_source: /cookbook/index.md
translation_source_hash: aceef9f4e42462614a5cdf41a89f55e26e0399503a48d4b50c08359e7bd7532e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 Ərizə mətbəxi {#iroha-3-application-cookbook}

Taira test şəbəkəsindən başlayan kiçik, yoxlana bilən reseptlərlə Iroha 3 qarşı qurun və Minamoto əsas şəbəkəsini yalnız oxumaq üçün saxlayın. Hər bir resept bunun ictimai oxunması, normal maliyyələşdirilmiş hesab yazılması və ya icazə qapalı əməliyyat olub olmadığını göstərir. Komandalar mövcud I105 hesabı IDs, açıq ödəniş seçimi və Iroha ünvanında yoxlanılan davranışdan istifadə edir [ `0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

[ ilə başlayın Taira](./connect-to-taira.md). O, müştərinin konfigurasiyasını və ödəniş metadatalarını yaratır. Komand xətti reseptləri tərəfindən yenidən istifadə olunur. Bu sənəddən heç vaxt bir ödəniş aktivini ID kopyalamayın: onu cari Taira faucet cavabından çıxarın.

## Giriş səviyyələri {#access-levels}

- İctimaiyyət  İmzaçı və ya şəbəkə icazəsi tələb olunmur.
- Yazı hazırlığı  maliyyələşdirilmiş Taira sınaq hesabından, açıq bir ödəniş haqqından və faucet tərəfindən qaytarılan cari ödəniş aktivindən istifadə edin.
- İzin tələb olunur  Taira adı verilən icra müddəti icazəsi və ya idarə olunan ad məkanı verməlidir. Bu yardım mövcud olmadıqda yaradılmış yerli şəbəkədən istifadə edin; lokal uğur Taira səlahiyyətini vermir.

Heç bir mətbəx kitabı resepti Minamoto ünvanına yazılma göndərmir.

## Başlamaq və təqdim etmək {#start-and-submit}

|Resept |Taira giriş |Nə ilə bitirirsən?|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Taira](./connect-to-taira.md) ilə əlaqə saxlayın. |Yazı hazırdır.|Maliyyələşdirilmiş I105 imzaçı, canlı ödəniş aktivləri və tətbiq edilmiş kanar əməliyyatı |
| [Əməliyyatların təqdim edilməsi və yoxlanması ](./submit-and-verify-transactions.md) |Yazı hazırdır.|Qiymətləndirilmiş əməliyyat, terminal boru kəmərinin nəticəsi və saxlanan qəbulu |

## Ledger vəziyyəti {#ledger-state}

|Resept|Taira giriş |Nə ilə bitirirsən?|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Hesablar və ləqəblər](./accounts-and-aliases.md) |İzin tələb olunur |I105 hesabı və həll edilə bilən, insan tərəfindən oxuna bilən bir alias |
| [Fungible assets](./fungible-assets.md) |İzin tələb olunur |Qeydiyyatda qeydə alınmış bir tərif, hesablanmış balans və təsdiq edilmiş köçürmə |
| [NFTs](./nfts.md) |İzin tələb olunur |qeydiyyatdan keçmiş NFT, mülkiyyətin ötürülməsi və dövlətdən sonrakı sorğu |
| [Metadata](./metadata.md) |Mülki obyektlər üçün hazır yazılır; başqa cür icazə tələb olunur |Metadata yazılması və sonra dəqiq oxunması.|
| [Sorğu kitabının vəziyyəti](./query-ledger-state.md) |İctimai dövlət üçün ictimai |Saytlaşdırılmış və sifariş edilmiş nəticələr yazılmadan |

## Giriş və avtomatlaşdırma {#access-and-automation}

|Resept|Taira giriş |Nə ilə bitirirsən?|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [İzinlər və rollar](./permissions-and-roles.md) |İzin tələb olunur |Yenidən istifadə edilə bilən bir rolda toplanan həcmli icazə |
| [Axın hadisələri](./stream-events.md) |İctimai |Yenidən bağlanan SSE istehlakçı , bağlantı kəsildikdən sonra birləşir |
| [Triggerlər](./triggers.md) |İzin tələb olunur |Qeydiyyat çağırışının başlatılması, icraatın alınması və yekunlaşdırma hadisəsi |
| [Multisig](./multisig.md) |Yazı hazırdır.|Əsas hesabı və quorumla təsdiq edilmiş təklif |

## Tətbiq nümunələri {#application-patterns}

|Resept|Taira giriş |Nə ilə bitirirsən?|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Ağıllı müqavilələr](./smart-contracts.md) |İzin tələb olunur |Kotodama bayt kodu, yerləşdirmə artefaktları və müqavilə çağırışı yoxlanıldı |
| [Wallet Connect](./wallet-connect.md) |Connect aktivləşdirildiyi zaman yazmağa hazırdır |Cüzdanın təsdiqlənmiş aktiv köçürülməsi və uyğunlaşdırılmış əməliyyat hashı |
| [Vətəndaş vəsiqəsi ](./native-escrow.md) |Əmlak sahibləri üçün yazılı hazırdır; mübahisənin həlli icazə tələb edir |İstənilən son vəziyyətə malik olan yerli kilid və ya bazar əmanəti |

## Verifikasiya edilmiş nümunə səthləri {#verified-example-surfaces}

Aşağıdakı markalar hər reseptdə işləyə bilən nümunələri təsvir edir, xüsusiyyətə daxil ola bilən hər SDK deyil.

|Resept|HTTP / curl |CLI |Rust |JavaScript |Python |Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Taira ilə əlaqə saxlayın. |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Göndərmək və yoxlamaq |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Hesablar və ləqəblər |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Fungible aktivlər |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
|NFTs |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadata |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Məlumat kitabının vəziyyəti |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|icazələr və rollar |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Tədbirlər axını |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Triggerlər |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Ağıllı müqavilələr|      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Cüzdan Bağlantısı |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Native escrow |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Hər resept istehsal arxitekturasına, əməliyyatlara, SDK və API təlimatlarına keçid verir. Reseptin özü uğurlu bir yol göstərir. Bu, nəticəni sübut etmək üçün lazım olan yoxlamaları da əhatə edir.
