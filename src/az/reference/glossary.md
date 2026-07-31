---
translation_locale: az
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glosary <!-- omit in toc --> {#glossary}

Burada Iroha ilə bağlı bütün subyektlərin təriflərini tapa bilərsiniz.

- [Peer](#peer)
- [Əməl](#asset)
- [Bizans səhv tolerantlığı (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha Komponentlər](#iroha-components)
  - [Sumeragi ( İmperator)](#sumeragi-emperor)
  - [Torii (Gate)](#torii-gate)
  - [Kura (Gömrük) ](#kura-warehouse)
  - [Kagami(Müəllim və nümunə və/və ya ayna) ](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle ağacı (hash ağac) ](#merkle-tree-hash-tree)
  - [Ağıllı müqavilələr](#smart-contracts)
  - [Triggerlər](#triggers)
  - [Versiyalaşdırma](#versioning)
  - [Hijiri (tərəfdaş nüfuz sistemi) ](#hijiri-peer-reputation-system)
- [Iroha Modullar](#iroha-modules)
- [Iroha Xüsusi təlimatlar (ISI) ](#iroha-special-instructions-isi)
  - [İstifadə Iroha Xüsusi təlimatlar](#utility-iroha-special-instructions)
  - [Əsas Iroha Xüsusi təlimatlar](#core-iroha-special-instructions)
  - [Döminə aid Iroha Xüsusi Təlimatlar](#domain-specific-iroha-special-instructions)
  - [Gömrük Iroha Xüsusi təlimat](#custom-iroha-special-instruction)
- [Iroha Sual](#iroha-query)
- [Görüş dəyişikliyi](#view-change)
- [Dünya vəziyyətinə baxış (WSV) ](#world-state-view-wsv)
- [Lider](#leader)

## Blockchain kitabları {#blockchain-ledgers}

Blockchain kitabları maliyyə qeydlərini saxlamaq üçün blockchain texnologiyasından istifadə edən rəqəmsal rekord saxlama sistemidir. Bunlar qiymətlər, xəbərlər və əməliyyat məlumatları kimi maliyyə qeydləri üçün istifadə olunan qədim kitablardan sonra adlandırılır.

Orta əsrlərdə kütləvi kitablar ictimaiyyətə baxmaq və dəqiqliyi yoxlamaq üçün açıq idi. Bu fikir saxlanılan məlumatların etibarlılığını yoxlaya bilən blok zincirə əsaslanan sistemlərdə əksini tapır.

## Tərəfdaşlar {#peer}

Bir qohum Iroha deməkdir: Iroha proses nümunəsi, digər Iroha Proseslər və müştəri tətbiqləri birləşdirilə bilər. Iroha Tərəfdaşlar öz resursları və imkanları baxımından bərabərdirlər, mühüm istisna ilə: yalnız həmyaşıdlardan biri genesis blokunu idarə edir bootstrapping mərhələsi Iroha şəbəkə.

Digər blok zincirləri bir düyün və ya təsdiqçi kimi eyni konsepsiyaya istinad edə bilər.

Peer öz ev sahibi sistemində bir proses ola bilər. O, həmçinin Docker konteyner və Kubernetes podda saxlana bilər.

## Əmlaklar {#asset}

Blokçeyn kontekstində bir aktiv blokçeyndə dəyərli bir obyektin təmsilçiliyidir.

Əmlaklar haqqında əlavə məlumat [burda ](/az/blockchain/assets.md) mövcuddur.

### Fungible aktivlər {#fungible-assets}

Belə aktivlər bir-biri ilə əvəz edilə biləcəyi üçün eyni növ digər aktivlərə asanlıqla dəyişdirilə bilər.

Məsələn, eyni valyutanın bütün vahidləri dəyəri ilə bərabərdir və mallar almaq üçün istifadə edilə bilər.

### Fungible olmayan aktivlər {#non-fungible-assets}

Fungible olmayan aktivlər öz xüsusiyyətləri və nadirliyi səbəbindən bənzərsizdir və dəyərlidir; onların dəyəri digər aktivlərlə müqayisə edilə bilməz.

- Bir rəsmin dəyəri sənətkarın, onun çəkildiyi dövrün və ictimaiyyətin ona marağına görə dəyişə bilər.
- Eyni küçədəki iki evin təmiri müxtəlif səviyyədə ola bilər.
- Ziyarətçi istehsalçıları ümumiyyətlə müxtəlif dizaynlar təklif edirlər.

### Qalan vəsaitlər {#mintable-assets}

Bir aktiv eyni növdən daha çox nəşr edilə bilsə, istehsal oluna bilər.

### Qeyri-qəsd edilən aktivlər {#non-mintable-assets}

Əgər bir aktivin ilkin məbləği bir dəfə təyin edilmişdir və dəyişmirsə, o, hesab edilə bilməyəcəkdir.

[Genesis blok ](/az/guide/configure/genesis.md) bu məlumatı Iroha konfigurasiyası üçün təyin edir.

## Bizanslı səhv tolerantlığı (BFT) {#byzantine-fault-tolerance-bft}

Iroha öz peer-to-peer şəbəkəsində 33% -ə qədər zərərli aktyorlarla işləyə bilən bir şəbəkədə düzgün işləmək qabiliyyəti.

## Iroha Komponentlər {#iroha-components}

Rust funksiyasını ehtiva edən Iroha modulları.

### Sumeragi (İmperator) {#sumeragi-emperor}

Konsensus üçün məsul olan Iroha modul.

### Torii (Gate) {#torii-gate}

[ peer](#peer) üçün daxil olan müraciətlərin idarə edilməsi məntiqinə malik modul. Gələn təlimatları və HTTP sorğularını qəbul etmək, qəbul etmək və yönləndirmək üçün, eləcə də icra vaxtı konfigüratsiyasının yeniləmələri üçün istifadə olunur.

### Kura (Gömrükxanada) {#kura-warehouse}

Daimi blok saxlama. Kura diskdə imzalanmış blokları, blok həşləri, hündürlük indeksləri, bərpa kənar maşınları və komit-roster metadatalarını saxlayır. [World State View](#world-state-view-wsv) bir dövlət sürətnaməsi mövcud olmadıqda və ya yerli blok mağazasının arxasında Kura bloklardan yenidən qurulur. Bax [Kura saxlama](/az/blockchain/world.md#kura-storage).

### Kagami(Müəllim və nümunə və/və ya güzgü) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Ümumiyyətlə istifadə olunan məlumatlar üçün generator. Kriptografik açar cütləri, genesis blokları, sənədlər və s.

### Merkle ağacı (has ağacı) {#merkle-tree-hash-tree}

Hər blok hündürlüyündə vəziyyətin təsdiqlənməsi və yoxlanılması üçün istifadə edilən məlumat quruluşu. Iroha-nin hazırda tətbiqi ikili ağacdır. Daha ətraflı məlumat üçün [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)-yə baxın.

### Akıllı müqavilələr {#smart-contracts}

Ağıllı müqavilələr müəyyən şərtlərin yerinə yetirilməsində işləyən blok zincirə əsaslanan proqramlardır. Iroha ağıllı kontraktlar [core Iroha xüsusi təlimatları istifadə edərək həyata keçirilir](#core-iroha-special-instructions).

### Triggerlər {#triggers}

Tədbir növü bir Iroha Müəyyən blok təyinatında xüsusi təlimatlar, vaxt (bəzi ehtiyatlarla) və s. Daha çox tetikləyici haqqında [Burada.](/az/blockchain/triggers.md).

### Versiyalaşdırma {#versioning}

Hər bir tələb API versiyası ilə etiketlənir. Bu, Iroha müştəri / həmyaşıd proqramının müxtəlif ikili versiyalarının birləşməsinin qarşılıqlı fəaliyyət göstərməsinə imkan verir ki, bu da Iroha şəbəkəsində proqram təkmilləşdirilməsini təmin edir.

### Hijiri (tərəfdaş nüfuz sistemi) {#hijiri-peer-reputation-system}

Iroha Bu, ünsiyyətin prioritetləşdirilməsinə imkan verir. [həmyaşıdlar](#peer) yaxşı bir rekord olan və zərərli səbəb ola biləcək zərərin azaldılması üçün [həmyaşıdlar](#peer).

## Iroha Modullar {#iroha-modules}

Iroha üçün xüsusi funksiyanı təmin edən üçüncü tərəf uzantıları.

## Iroha Xüsusi təlimatlar (ISI) {#iroha-special-instructions-isi}

Ağıllı müqavilələrin kitabxanası Iroha. Bu, həm əməliyyatlar vasitəsilə, həm də qeydə alınmış tədbir dinləyiciləri vasitəsilə istinad edilə bilər. ISI [Burada.](/az/blockchain/instructions.md).

#### İstifadə Iroha Xüsusi təlimatlar {#utility-iroha-special-instructions}

Bu set [İsi](#iroha-special-instructions-isi) kimi məntiqi göstərişləri ehtiva edir `If`, I/O ilə əlaqəli `Notify` və kimi kompozisiyalar `Sequence`. Onlar əsasən istifadə olunur [xüsusi təlimatlar](#custom-iroha-special-instruction).

### Əsas Iroha Xüsusi təlimatlar {#core-iroha-special-instructions}

[Xüsusi təlimatlar](#iroha-special-instructions-isi) hər bir Iroha Bu, bəzi [domen xüsusiyyəti](#domain-specific-iroha-special-instructions) və [İstifadə qaydaları](#utility-iroha-special-instructions).

### Döminə aid xüsusi təlimatlar Iroha {#domain-specific-iroha-special-instructions}

[World State View](#world-state-view-wsv)-də təhlükəsiz və etibarlı şəkildə dəyişikliklər etmək üçün lazımi vasitələri təmin edən domen xüsusi fəaliyyətləri ilə bağlı təlimatlar: aktivlər, hesablar, domenlər, həmkarların idarə edilməsi.

### Gömrük Iroha Xüsusi təlimat {#custom-iroha-special-instruction}

Müqavilədə göstərilən təlimatlar [Iroha Modullar](#iroha-modules), Müştərilər tərəfindən və ya üçüncü tərəflər tərəfindən qurula bilər. [Əsas təlimatlar](#core-iroha-special-instructions). Forking və modifikasiya Iroha Mənbə kodu tövsiyə edilmir, çünki xüsusi təlimatlar [həmyaşıdlar](#peer) bir Iroha tətbiqi səhv kimi qəbul ediləcək, belə ki, [həmyaşıdlar](#peer) Dəyişdirilmiş nümunəni icra etməklə onların girişinin ləğv edilməsi təmin edilir.

## Iroha Sual {#iroha-query}

Dünya vəziyyətinə baxışını dəyişdirmədən oxumağı xahiş etmək. [Burada.](/az/blockchain/queries.md).

## Görünüş dəyişikliyi {#view-change}

Bu, ümumiyyətlə yeni [Liderin seçilməsini tələb edir ](#leader).

## Dünya vəziyyətinə baxış (WSV) {#world-state-view-wsv}

WSV -da `World`, bağlı blok həşləri, əməliyyat indeksləri, konsensus topologiyası və sorğularda istifadə olunan mənşəli indekslər var. Bu, yalnız bağlı bloklar vasitəsilə yenilənir və [Kura](#kura-warehouse) [World State View](/az/blockchain/world.md#world-state-view-wsv)-dən yenidən qurula bilər.

## Lider {#leader}

Bir iroha şəbəkəsində bir həmyaşıd təsadüfi olaraq seçilir və növbəti blokun formalaşdırılması xüsusi imtiyazına malikdir. Bu imtiyaz [Byzantine səhv torelance ](#byzantine-fault-tolerance-bft) vasitəsilə əldə edən şəbəkələrdə ləğv edilə bilər [view change](#view-change).
