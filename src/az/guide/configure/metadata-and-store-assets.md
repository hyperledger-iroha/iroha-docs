---
translation_locale: az
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatalar və Ledger saxlama seçimləri {#metadata-and-ledger-storage-choices}

Iroha 3 məlumat modeli key-value məlumatları üçün ayrı bir `Store` aktiv növünə malik deyil. Aşağıdakı saxlama seçimlərindən istifadə edin.

## Metadatalar {#metadata}

Lider obyektinə aid olan kiçik JSON sahələr üçün [metadata](/az/blockchain/metadata.md) istifadə edin:

- adları və etiketləri göstərmək
- inteqrasiya IDs
- Kiçik siyasət bayraqları
- URIs, CIDs və ya SoraFS yolları daha böyük faydalı yüklərə yönləndirən hashlər

Metadata dünya vəziyyətinin bir hissəsidir və sahib olduğu obyektlə qaytarılır. Anahtarları sabit saxlayın, dəyərlər kompakt olsun və icazələr açıq olsun. Böyük sənədləri, jurnalları və ya yüksək sürətli tətbiqetmə dövlətlərini birbaşa metadata saxlamayın.

## Saylı vəsaitlər və NFTs {#numeric-assets-and-nfts}

İstifadə [aktivlər](/az/blockchain/assets.md) və [NFTs](/az/blockchain/nfts.md) Dövlət dəyərləndirici olduqda:

- Fungible balanslar üçün rəqəmli aktivlər
- NFTs yalnız mülkiyyətdə olan qeydlər üçün
- [RWAs](/az/blockchain/rwas.md) və aktiv məlumat modeli onları aşkar edərkən digər domenə aid obyektlər

Varlıqlar və NFTs öz IDs, həyat dövrü hadisələri, köçürmə davranışları və icazə yoxlamalarına malikdir. Mülkiyyət, çatışmazlıq və ya köçürmə tarixi məsələlərində meta məlumatlardan daha yaxşıdırlar.

## Zəngindən kənar məlumatlar {#off-chain-data}

Böyük və ya dəyişə bilən paylı yüklər üçün zəncirdən kənarda saxlanılmalıdır.

- məzmun hashı
- a URI
- bir SoraFS yol və ya manifest istinad
- Ərizə sübutuna əsaslanan kompakt öhdəlik

Bu, WSV kiçik saxlayır və eyni zamanda tətbiqlərə zəncirdən kənar pay yükünün zəncirlə bağlı istinadla uyğun olub olmadığını yoxlamağa imkan verir.

## Yer seçmək {#choosing-a-location}

Bu qaydalardan istifadə edin:

- Əgər bu bir kitab obyektinin kompakt xüsusiyyətidirsə, meta məlumatlardan istifadə edin.
- Qiymətli və ya ötürülə bilən bir obyektdirsə, onu aktiv, NFT və ya domen xüsusi obyekti kimi modelləşdirin.
- Böyük, yüksək həcmli və ya tətbiqi xüsusi olan varsa WSV xaricində saxlayın və yoxlana bilən bir istinad silsiləsinə qoyun.

Metadata icazələri üçün [Mətn vəsiqələri ](/az/reference/permissions.md) baxın.
