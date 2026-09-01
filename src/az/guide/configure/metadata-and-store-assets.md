---
translation_locale: az
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Meta məlumatlar və blokçeyn dəftərxanası Saxlama Seçimləri {#metadata-and-ledger-storage-choices}

Iroha 3 məlumat modeli ixtiyari açar-dəyər məlumatları üçün ayrıca `Store` aktiv növü yoxdur. Aşağıdakı saxlama seçimlərindən istifadə edin.

## Metaməlumat {#metadata}

Blokçeyn dəftər obyektinə aid kiçik JSON sahələr üçün [metaməlumat](/az/blockchain/metadata.md) -dan istifadə edin:

- göstərilən adlar və etiketlər
- inteqrasiya identifikatorları
- kiçik siyasət bayraqları
- kriptoloji xəşlər, URIs, CIDs və ya SoraFS yolları ki, daha böyük yükə işarə edir

Metaməlumat dünya vəziyyətinin bir hissəsidir və ona sahib olan obyektlə birlikdə qaytarılır. Açarları sabit saxlayın, dəyərləri sıxlaşdırın və icazələri açıq şəkildə göstərin. Böyük sənədləri, qeydləri və ya yüksək dəyişkən tətbiq vəziyyətini birbaşa metaməlumatda saxlamayın.

## Rəqəmsal Aktivlər və NFTs {#numeric-assets-and-nfts}

Dövlət dəyər daşıdıqda [aktivlər](/az/blockchain/assets.md) və [NFTs](/az/blockchain/nfts.md)-dən istifadə edin:

- dəyişdirilə bilən balanslar üçün rəqəmsal aktivlər
- NFTs unikal olaraq sahib olunan qeydlər üçün
- [RWAs](/az/blockchain/rwas.md) və digər domenə xas obyektlər aktiv məlumat modeli onları göstərdikdə

Aktivlər və NFTs öz şəxsiyyət nömrələrinə, həyat dövrü hadisələrinə, ötürülmə davranışına və icazə yoxlamalarına malikdirlər. Sahibliyin, çatışmazlığın və ya ötürmə tarixçəsinin vacib olduğu hallarda onlar metadan daha yaxşıdır.

## Zəncirdənkənar Məlumat {#off-chain-data}

Böyük və ya dəyişkən məlumatlar üçün off-chain yaddaşdan istifadə edin. Yalnız stabil bir istinadı on-chain yadda saxlayın, məsələn:

- məzmun kriptoqrafik xeş
- a URI
- bir SoraFS yol və ya texniki manifest istinadı
- tətbiq sübutu tərəfindən istifadə olunan kompakt kriptoqrafik öhdəlik dəyəri

Bu, WSV-i kiçik saxlayır və eyni zamanda tətbiqlərin zəncirdənkənar məlumatın zəncirdəki istinada uyğun olduğunu yoxlamağa imkan verir.

## Yerləşməyi Seçmək {#choosing-a-location}

Bu qaydaya əməl edin:

- Əgər bu, blokçeyn jurnal obyektinin kompakt atributudursa, metadatalardan istifadə edin.
- Əgər onun dəyəri varsa və ya ötürülə bilirsə, onu aktiv, NFT və ya domen-özəl obyekt kimi modelləşdirin.
- Əgər o, böyükdürsə, yüksək dövriyyəlidirsə və ya tətbiq-özəlidisə, onu WSV-dən kənarda saxlayın və zəncirdə yoxlanıla bilən bir istinad qoyun.

Metaməlumat icazələri üçün baxın [İcazə Jetonları](/az/reference/permissions.md).
