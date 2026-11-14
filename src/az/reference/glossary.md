---
translation_locale: az
translation_source: /reference/glossary.md
translation_source_hash: 4d3a8e3aa88291edbaac5b52039d2aad160d89fb83c085c21030a531c93258f4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# Lüğət <!-- omit in toc --> {#glossary}

Burada siz bütün Iroha-ilə əlaqəli obyektlərin təriflərini tapa bilərsiniz.

- [şəbəkə əlaqəsi](#peer)
- [Əmlak](#asset)
- [Bizans səhv-dözümlülüyü (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Komponentlər](#iroha-components)
  - [Sumeragi (İmperator)](#sumeragi-emperor)
  - [Torii (Qapı)](#torii-gate)
  - [Kura (Anbar)](#kura-warehouse)
  - [Kagami(Müəllim və Nümunə və/və ya güzgü)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle ağacı (kriptoqrafik hash ağacı)](#merkle-tree-hash-tree)
  - [Ağıllı müqavilələr](#smart-contracts)
  - [Səbəblər](#triggers)
  - [Versiyalaşdırma](#versioning)
  - [Hijiri (şəbəkə həmkarının nüfuz sistemi)](#hijiri-peer-reputation-system)
- [Iroha Modullar](#iroha-modules)
- [Iroha Təlimat əməliyyatları (ISI)](#iroha-special-instructions-isi)
  - [Kommunal Iroha Təlimat əməliyyatları](#utility-iroha-special-instructions)
  - [Əsas Iroha Təlimat əməliyyatları](#core-iroha-special-instructions)
  - [Sahə-spesifik Iroha Təlim əməliyyatları](#domain-specific-iroha-special-instructions)
  - [Xüsusi Iroha Xüsusi Təlimat](#custom-iroha-special-instruction)
- [Iroha Sorğu](#iroha-query)
- [Baxış dəyişdir](#view-change)
- [Dünya dövlət baxışı (WSV)](#world-state-view-wsv)
- [Lider](#leader)

## Blokçeyn dəftərləri {#blockchain-ledgers}

Blockchain dəftərləri maliyyə qeydlərini saxlamaq üçün blockchain texnologiyasından istifadə edən rəqəmsal qeyd sistemi kimi fəaliyyət göstərir. Bunlar qiymətlər, xəbərlər və əməliyyat məlumatları kimi maliyyə qeydləri üçün istifadə olunan qədim kitabların adını daşıyır.

Orta əsrlərdə mühasibat dəftərləri ictimai baxış və dəqiqlik yoxlaması üçün açıq idi. Bu fikir saxlanmış məlumatların etibarlılığını yoxlaya bilən blokçeyn əsaslı sistemlərdə də əks olunur.

## şəbəkə əlaqəsi {#peer}

Qovşaq digər qovşaqlardan və müştəri tətbiqlərindən bağlantıları qəbul edən Iroha qovşaq prosesidir. Bir maşında ayrı konfiqurasiya və yaddaşa malik bir neçə qovşaq işləyə bilər. Boş vəziyyətdən konsensusa başlayan hər qovşaq şəbəkənin imzalanmış başlanğıc blokunun həqiqiliyini yoxlayır və onu tətbiq edir; həqiqiliyi yoxlanmış vəziyyət görüntülərindən bərpa olunan qovşaqlar həmin vəziyyətdən davam edir.

Digər blok zəncirləri eyni anlayışı bir node və ya təsdiqçi kimi istinad edə bilər.

Şəbəkə tərəfdaşı onun host sistemində olan bir proses ola bilər. O həmçinin Docker konteynerində və Kubernetes podunda saxlanıla bilər.

## Əmlak {#asset}

Blokçeyn kontekstində aktiv, dəyərli bir obyektin blokçeyndə təmsil olunmasıdır.

Əlavə məlumat aktivlər haqqında mövcuddur [burada](/az/blockchain/assets.md).

### Mübadilə edilə bilən aktivlər {#fungible-assets}

Belə aktivlər eyni tip digər aktivlərlə asanlıqla dəyişdirilə bilər, çünki onlar bir-birinin əvəzidir.

Məsələn, eyni valyutanın bütün vahidləri dəyər baxımından bərabərdir və malların alınmasında istifadə oluna bilər. Adətən, dəyişdirilə bilən aktivlər görünüşcə eynidir, banknot və sikkələrin aşınması istisna olmaqla.

### Fungible olmayan aktivlər {#non-fungible-assets}

Fərqlənməyən aktivlər özünəməxsus xüsusiyyətlərinə və nadirliyinə görə unikal və qiymətlidir; onların dəyəri digər aktivlərlə müqayisə edilə bilməz.

- Bir rəsm əsərinin dəyəri, rəssamdan, rəsm edildiyi dövrdən və ictimaiyyətin ona olan marağından asılı olaraq dəyişə bilər.
- Eyni küçədəki iki ev fərqli baxım səviyyələrinə sahib ola bilər.
- Zinət əşyaları istehsalçıları adətən müxtəlif dizayn çeşidləri təklif edirlər.

### Yaradılabilən aktivlər {#mintable-assets}

Bir əmlak daha eyni növdən buraxıla bilirsə, o, çap edilə biləndir.

### Çap edilə bilməyən aktivlər {#non-mintable-assets}

Əgər bir aktivin ilkin məbləği bir dəfə göstərilib və dəyişmirsə, bu, qeyri-mintable hesab olunur.

[blokçeyn başlanğıc bloku](/az/guide/configure/genesis.md) bu məlumatı Iroha konfiqurasiyası üçün təyin edir.

## Bizans səhv-dözümlülüyü (BFT) {#byzantine-fault-tolerance-bft}

Şəbəkədə müəyyən faizdə zərərli iştirakçılar olsa belə düzgün işləyə bilmə xüsusiyyəti. Sumeragi komitəsində dəqiq `3f + 1` təsdiqləyici olur və o, komitənin üçdə birindən az olan `f` sayda Bizans təsdiqləyicisinə qədər dözür.

## Iroha Komponentlər {#iroha-components}

Rust modulları Iroha funksionallığını ehtiva edir.

### Sumeragi (İmperator) {#sumeragi-emperor}

Iroha konsensusdan məsul modul.

### Torii (Darvaza) {#torii-gate}

[Həmyaşıd qovşağa](#peer) daxil olan sorğuların emalı məntiqini ehtiva edən modul. Daxil olan təlimatları, HTTP sorğularını və operatorun konfiqurasiya yoxlamalarını almaq, qəbul etmək və yönləndirmək üçün istifadə olunur.

### Kura (Anbar) {#kura-warehouse}

Davamlı blok yaddaşı. Kura imzalanmış blokları, blok kriptoqrafik hash-larını, hündürlük indekslərini, bərpa köməkçi qeydlərini və blokun yekunlaşdırılması roster metadatasını disklərdə saxlayır. Əgər bir vəziyyət nöqtəsi-vaxt məlumat baxışı mövcud deyilsə və ya yerli blok mağazasından geri qalırsa, [Dünya Dövlət Görünüşü](#world-state-view-wsv) Kura bloklarından yenidən qurulur. Baxa bilərsiniz [Kura saxlama](/az/blockchain/world.md#kura-storage).

### Kagami(Müəllim və Nümunə və/və ya güzgü) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Tez-tez istifadə olunan məlumatlar üçün generator. O, kriptoqrafik açar cütlərini, blokçeyn başlanğıc bloklarını, sənədləri və s. yarada bilər.

### Merkle ağacı (kriptoqrafik hash ağacı) {#merkle-tree-hash-tree}

Hər blok hündürlüyündə vəziyyəti yoxlamaq və təsdiqləmək üçün istifadə olunan verilənlər strukturu. Iroha-in hazırkı tətbiqi ikili ağacdır. Daha ətraflı məlumat üçün [Vikipediya](https://en.wikipedia.org/wiki/Merkle_tree)-a baxın.

### Ağıllı müqavilələr {#smart-contracts}

Ağıllı müqavilələr müəyyən bir şərtlər dəsti yerinə yetirildikdə işləyən blokçeyn əsaslı proqramlardır. Iroha 3-də ağıllı müqavilələr Kotodama dilində yazılır və IVM bayt koduna (`.to`) kompilyasiya edilir; müqavilə vəziyyəti host çağırışları vasitəsilə [Iroha xüsusi təlimatları](#core-iroha-special-instructions) verməklə dəyişdirir.

### Səbəblər {#triggers}

Spesifik blokun başa çatdırılmasında, vaxtında (bəzi məhdudiyyətlərlə) və s. Iroha xüsusi təlimatı çağırmağa imkan verən bir hadisə növü. Aktivləşdiricilər haqqında daha ətraflı [burada](/az/blockchain/triggers.md).

### Versiyalaşdırma {#versioning}

Iroha 3-ün ilk buraxılışı blokların ötürülməsi üçün yalnız bir kanonik format versiyasını dəstəkləyir. Başlanğıc bloku tətbiq edildikdən sonra `/v1/api/version` son nöqtəsi `SignedBlock::WIRE_VERSION` dəyərini bildirir, bundan əvvəl isə əlçatmazlıq cavabı qaytarır. Bu məlumat dəstəklənən ötürmə formatını göstərir; müxtəlif protokol düzülüşləri arasında uyğunluğu razılaşdırmır və şəbəkə yeniləməsinə icazə vermir.

### Hijiri (şəbəkə həmkarının nüfuz sistemi) {#hijiri-peer-reputation-system}

Iroha-nın həmyaşıd qovşaq və hesab reputasiya sistemi. Onun konsensusa məxsus parametrləri Hijiri haqq siyasətini və hesab risk qeydlərini saxlayır, idarə olunan müşahidəçi reyestrləri isə hesabın risk balını tənzimləyən hesab attestasiyaları verir.

## Iroha Modullar {#iroha-modules}

Iroha üçün xüsusi funksionallıq təmin edən üçüncü tərəf əlavələri.

## Iroha Təlimat əməliyyatları (ISI) {#iroha-special-instructions-isi}

Iroha ilə təmin edilmiş ağıllı müqavilələr kitabxanası. Bunlar ya əməliyyatlar vasitəsilə, ya da qeydiyyatdan keçmiş hadisə dinləyiciləri vasitəsilə çağırıla bilər. Daha çox məlumat üçün ISI [burada](/az/blockchain/instructions.md).

#### Kommunal Iroha Təlimat əməliyyatları {#utility-iroha-special-instructions}

Bu [isi](#iroha-special-instructions-isi) dəsti `Log`, `ExecuteTrigger`, `SetParameter` və `Upgrade` kimi domenə xas obyekti dəyişdirməyən təlimatları ehtiva edir. Iroha 3-də `If`, `Notify` və ya `Sequence` təlimatları yoxdur.

### Əsas Iroha Təlim əməliyyatları {#core-iroha-special-instructions}

[Xüsusi təlimatlar](#iroha-special-instructions-isi) hər Iroha yerləşdirilməsi ilə təmin edilir. Bunlara bəzi [domenə xas](#domain-specific-iroha-special-instructions) və həmçinin [kommunal təlimatlar](#utility-iroha-special-instructions) daxildir.

### Sahə-spesifik Iroha Təlim əməliyyatları {#domain-specific-iroha-special-instructions}

Domenə xas fəaliyyətlərlə əlaqəli təlimatlar: aktivlər, hesablar, domenlər, şəbəkə bərabər idarəsi). Bunlar [Dünya Dövlət Görünüşü](#world-state-view-wsv)-də dəyişikliklər etmək üçün lazım olan alətləri təhlükəsiz və etibarlı şəkildə təmin edir.

### Xüsusi Iroha Xüsusi Təlimat {#custom-iroha-special-instruction}

[Iroha Modullar](#iroha-modules)-da verilmiş təlimatlar, müştərilər və ya üçüncü şəxslər tərəfindən. Bunlar yalnız [Əsas Təlimatlar](#core-iroha-special-instructions) istifadə edilərək yaradıla bilər. Iroha mənbə kodunu forkladmaq və dəyişdirmək tövsiyə edilmir, Təlimat əməliyyatları Iroha yerləşdirməsində [şəbəkə əlaqəliləri](#peer) tərəfindən razılaşdırılmamış kimi hesab ediləcək və səhv kimi qiymətləndiriləcək, beləliklə [şəbəkə əlaqəliləri](#peer) dəyişdirilmiş nümunəni işlədərkən onların girişi ləğv ediləcək.

## Iroha Sorğu {#iroha-query}

Dünya Dövlət Baxışını dəyişdirmədən oxumaq üçün sorğu. Sorğular haqqında daha çox [burada](/az/blockchain/queries.md).

## Baxış dəyişdir {#view-change}

Razılığın əldə olunmaması halında baş verən proses. Adətən bu, yeni [Lider](#leader)-in seçilməsini nəzərdə tutur.

## Dünya dövlət baxışı (WSV) {#world-state-view-wsv}

Cari blokçeyn vəziyyətinin yaddaşdakı təmsil olunması. WSV `World`, yekunlaşdırılmış blok kriptoqrafik xəşləri, əməliyyat indekslərini ehtiva edir, razılaşma topologiyası və sorğular tərəfindən istifadə olunan törədilmiş indekslər. O yalnız yekunlaşdırılmış bloklar vasitəsilə yenilənir və [Kura](#kura-warehouse)-dən bərpa edilə bilər. Bax [Dünya Dövlət Görünüşü](/az/blockchain/world.md#world-state-view-wsv).

## Lider {#leader}

Hər hündürlük və görünüş üçün Sumeragi təklif edəni komitə, həqiqiliyi yoxlanmış lider toxumu və ötürülmüş liderlərin təsdiqlənmiş tarixçəsi əsasında deterministik şəkildə müəyyən edir. [Görünüş dəyişikliyi](#view-change) eyni [Bizans xətalarına dözümlülük](#byzantine-fault-tolerance-bft) qaydaları ilə növbəni komitənin növbəti uyğun üzvünə keçirir.
