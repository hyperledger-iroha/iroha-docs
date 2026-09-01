---
translation_locale: az
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Hadisə Tətikləyici Nümunəsi {#event-trigger-example}

Bu nümunə Iroha 3 məlumat modeli üzrə tək protokol-standart domen olmayan hesab identifikatorlarından və proqnozlaşdırılmış aktiv təriflərindən istifadə edir.

Tutaq ki, bir şəbəkədə var:

- Alice açarı tərəfindən idarə olunan tək bir protokol-standart hesab
- bir protokol-standart hesab Mad Hatter-ın açarı tərəfindən idarə olunur
- bir aktivin tərifi `wonderland.universal` altında `tea` kimi proqnozlaşdırılmış
- hər hesabda saxlanılan həmin aktivin balansı

Məqsəd, Alice-ın çay balansını izləyən və uyğun məlumat hadisəsi baş verildikdə Mad Hatter hesabından köçürməni təqdim edən bir tetikleyici qeydiyyatdan keçirməkdir.

## 1. Hesabları və aktivləri hazırlayın {#_1-prepare-accounts-and-assets}

Əvvəlcə iştirak edən hesabları və aktiv təsvirini qeyd edin. Cari Iroha-də hesab identifikatorları hesab nəzarətçilərindən gəlir, projelənmiş domenlər isə `domain.dataspace` formasından istifadə edir:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

Aktivin tərifi hələ də tək protokol-standartlı şəffaf olmayan ünvana malikdir. Qeydiyyatdan sonra həmin ünvani saxlayın və ya soruşun və onu tetikleyici hərəkətdə istifadə edin.

## 2. Tətik icazəsi əsasını seçin {#_2-choose-the-trigger-authority}

Mümkün olduqda triggerin texniki hesabını xüsusi hesaba təyin edin. Xüsusi hesab triggerin icrası üçün hansı icazələrin tələb olunduğunu aydın şəkildə göstərir və triggeri operatorun şəxsi imza açarı ilə əlaqələndirməməyə imkan verir.

Texniki hesab artıq mövcud olmalıdır və trigger icra faylında göstərişləri təqdim etmək icazəsinə malik olmalıdır.

## 3. İcra edilə biləni təyin edin {#_3-define-the-executable}

İcra edilə bilən fayl, hadisə filtiri uyğun gəldikdə tetikleyicinin təqdim etdiyi təlimat ardıcıllığıdır. Bu nümunə üçün, o, bir köçürməni ehtiva edir:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Son əməliyyat faylı üçün SDK-ın mövcud yazılmış qurucularından istifadə edin. Sürətli kodda köhnə mətn ID-lərini sərt şəkildə yazmaqdan çəkinin; icra edilə bilən faylı yaratmazdan əvvəl tək protokol-standart ID-ləri ayırın və ya sorğu edin.

## 4. Hadisə filtrini təyin edin {#_4-define-the-event-filter}

Diqqət etdiyiniz obyektə aid hadisələri daraldan data-event filtrindən istifadə edin:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Filtrləri mümkün qədər konkret saxlayın. `AcceptAll` filtri səhvləri tapmaq üçün faydalıdır, lakin bu, hər uyğun gələn hadisəyə tetikleyici qiymətləndirilməsi xərci ödətir.

## 5. Tetikleyiciyi qeydiyyatdan keçirin {#_5-register-the-trigger}

Trigleri ilə qeydiyyatdan keçin:

- sabit `TriggerId`
- icra edilə bilən təlimat ardıcıllığı
- `Repeats::Indefinitely` və ya `Repeats::Exactly(n)`
- texniki hesab
- hadisə filtri
- seçimli metadatalar

Trigər qeydiyyatı özü normal bir əməliyyatdır, buna görə də trigərləri qeydiyyatdan keçirən hesabın trigərləri qeydiyyatdan keçirmək üçün icazəsi olmalıdır. Texniki hesab trigər icra faylı üçün tələb olunan icazələrə malik olmalıdır.

## İcra qaydası {#execution-order}

Bir blok icra edilərkən:

1. Normal əməliyyat təlimatları əvvəl həyata keçirilir.
2. Həmin təlimatlar tərəfindən yaradılan məlumat hadisələri toplanır.
3. Filtrləri həmin hadisələrlə uyğun gələn tetikleyicilər planlaşdırılır.
4. Tetikləyici tərəfindən yaradılan effektlər, blok icra proqram təminatı işləmə iş axışında, qeyri-məhdud təkrarlanan tetikləyici icrasına imkan verilmədən idarə olunur.

Əgər bir tetikleyici `Repeats::Exactly(n)` istifadə edirsə, say bitdikdə və eyni davranış yenidən lazım olduqda yeni bir tetikleyici qeyd edin.
