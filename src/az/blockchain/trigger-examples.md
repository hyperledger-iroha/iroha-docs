---
translation_locale: az
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hadisə Trigger nümunəsi {#event-trigger-example}

Bu nümunədə Iroha 3 məlumat modelində kanonik domensiz hesab IDs və proqnozlaşdırılmış aktiv təriflərindən istifadə olunur.

Tutaq ki, bir şəbəkədə:

- Alice'in açarı ilə idarə olunan kanonik bir hesab
- Çılğın Şapkaçının açarı ilə idarə olunan kanonik bir hesab.
- `wonderland.universal` bölməsində `tea` olaraq proqnozlaşdırılan aktiv təyinatı.
- Hər bir hesabda saxlanılan həmin aktivin balansı

Məqsəd, Alice-in çay balansını müşahidə edən və uyğun məlumat hadisəsi yayıldıqda Mad Hatter hesabından köçürmə göndərən bir tetikçi qeyd etməkdir.

## 1. Hesablar və aktivlər hazırlayın {#_1-prepare-accounts-and-assets}

Əvvəlcə iştirakçı hesabları və aktiv tərifini qeyd edin. cari Iroha-də, IDs hesabı hesab nəzarətçilərindən gəlir, proqnozlaşdırılmış domenlər isə `domain.dataspace` formasını istifadə edir:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

Mülkiyyət tərifində hələ də kanonik qeyri-aşkar bir ünvan var. Bu ünvanı qeydiyyatdan sonra saxlayın və ya sorğu edin və onu tetikləyici hərəkətdə istifadə edin.

## 2. Başlatıcı səlahiyyətini seçin {#_2-choose-the-trigger-authority}

Mümkün olduqda tetikçinin texniki hesabını xüsusi bir hesabla təyin edin. Təyinatlı hesab, tetikçini icra etmək üçün hansı icazələrin tələb olunduğunu aydınlaşdırır və tetikçini operatorun şəxsi imza açarı ilə bağlamadan çəkinir.

Texniki hesab artıq mövcud olmalıdır və təlimatların icra edilə bilən tetikləyiciyə təqdim edilməsi üçün icazə verilməlidir.

## 3. İcra olunanı təyin edin. {#_3-define-the-executable}

Fəaliyyət filtrinin uyğunlaşdığı zaman tetikleyici tərəfindən göndərilən təlimat ardıcıllığı icra oluna bilər. Bu nümunədə bir köçürmə var:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Son əməliyyat pay yükü üçün SDK'nin hazırda yazdırılmış qurucularından istifadə edin. İcra edilə bilən qurulmadan əvvəl həddindən artıq köhnə mətni IDs-dən çəkinin. Parse və ya sorğu kanoniki IDs

## 4. Hadisə filtrini təyin edin. {#_4-define-the-event-filter}

Tədbirləri maraqlandığınız obyektə məhdudlaşdıran bir məlumat hadisələri filtrindən istifadə edin:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Filtrləri praktik kimi xüsusi saxlayın. `AcceptAll` filtr debugging üçün faydalıdır, lakin hər uyğunlaşma hadisəsi tetikləyici qiymətləndirmə xərclərini ödəyir.

## 5. Çıxışını qeyd edin. {#_5-register-the-trigger}

Çıxartıcıyı qeyd edin:

- bir stəbil `TriggerId`
- icra edilə bilən təlimat ardıcıllığı
- `Repeats::Indefinitely` və ya `Repeats::Exactly(n)`
- texniki hesab
- hadisələr filtrini
- Seçilmiş metadatalar

Trigger qeydiyyatı özü normal bir əməliyyatdır, buna görə qeydiyyata alma hesabına triggerləri qeyd etmək üçün icazə lazımdır. Texniki hesabın trigger icra edilməsi üçün tələb olunan icazələrə ehtiyacı var.

## Döyüş əmri {#execution-order}

Bir blok icra edildikdə:

1. Əvvəlcə normal əməliyyat təlimatları işləyir.
2. Bu göstərişlər nəticəsində meydana gələn hadisələr haqqında məlumatlar toplanır.
3. Filtrləri bu hadisələrə uyğun olan tetikləyicilər planlaşdırılır.
4. Trigger tərəfindən istehsal olunan təsirlər blok icra edilməsi kəmərində sərhədsiz rekursiv icra edilməsinə icazə vermədən idarə olunur.

Bir tetikçi `Repeats::Exactly(n)` istifadə edərsə, sayın tükəndikdə və eyni davranışı yenidən tələb etdikdə yeni bir tetikçi qeyd edin.
