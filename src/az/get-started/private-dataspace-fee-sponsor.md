---
translation_locale: az
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 2ca4fc00709839879fe9cb7ea5e5f697505e5e25d4e5a6cd0bd18d406f6e2846
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Özəl məlumat məkanı üçün haqlara sponsorluq edin {#sponsor-fees-for-a-private-data-space}

SORA Nexus haqq sponsorluğu proqramı özəl məlumat məkanına yönləndirilmiş uyğun əməliyyatların qlobal icra haqlarını ödəyə bilər. İstifadəçi yenə də tam əməliyyatı imzalayır. Onun tipləşdirilmiş `FeePaymentIntent` dəyəri dəqiq sponsor proqramını və dəyişməz versiyanı, tələb olunduqda qaz həddini və maksimum tutulmaları seçir.

Məlumat məkanı kataloqundakı qeyd müstəqil imzalanmış kök yaratmır. Müstəqil məlumat məkanı kökünün öz təsdiqlənmiş haqq valyutası və siyasəti var; açıq sponsor anbarları onun özəl kök haqlarına səlahiyyət verə bilməz. Sponsorluğu layihələndirməzdən əvvəl icra kökünü müəyyən edin.

## 1. Təsdiqlənmiş haqq siyasətini müəyyən edin {#_1-establish-the-committed-fee-policy}

İmzalanmış genezis `RootFeePolicy` ehtiva edən bir `root_fees_v1` xüsusi parametri yaradır. O, haqq valyutasını, haqq qəbul edən hesabı, sponsorun mühafizə hesabını, tələb istisnalarını və tarifləri bağlayır. Hər adi blok və qiymət təklifi özünün qeydə aldığı təsdiqlənmiş siyasətdən istifadə edir. Tariflərə, haqq qəbul edən hesaba və tələb istisnalarına edilən səlahiyyətli dəyişikliklər növbəti blokdan qüvvəyə minir; haqq valyutası və sponsorun mühafizə hesabı ilk blokdan sonra dəyişdirilə bilməz.

Qlobal icrada protokol haqqı imzalanmış şəbəkənin dəqiq XOR valyutasını yandırır. Sponsorun proqram anbarı bu valyutanı təmin edir. Qovşaq parametrləri və əməliyyat metaməlumatı ödəyici seçmir və sponsorluğu aktivləşdirmir.

Şəbəkənin kanonik valyuta və hesab kimliklərindən istifadə edin. Ləqəbin həlli təsdiqlənmiş valyuta, mühafizə və haqq qəbul edən hesab kimliklərini başqa istiqamətə yönəltməməlidir.

## 2. Sponsor proqramı yaradın və maliyyələşdirin {#_2-create-and-fund-a-sponsor-program}

Proqram ID-si `<canonical-sponsor-account>/<program-name>` formasındadır. Onu hazırkı SDK və məlumat modelinin təqdim etdiyi tipləşdirilmiş təlimatlarla qurun:

| Təlimat | Məqsəd |
| --- | --- |
| `CreateFeeSponsorProgram` | Məcburi ödəniş hesabı ilə hazırlanma mərhələsində olan proqram yaratmaq. |
| `StageFeeSponsorProgramRevision` | Bir dəyişməz uyğunluq, əməliyyat və büdcə siyasəti müəyyən etmək. |
| `EnrollFeeSponsorBeneficiary` | Uyğun faydalananı zəncirdə qeyd etmək. |
| `FundFeeSponsorProgram` | Aktivləri mühafizəyə köçürmək və dəqiq proqram anbarına kredit yazmaq. |
| `ActivateFeeSponsorProgramRevision` | Hazırlanmış versiyanın ən erkən aktivləşmə hündürlüyünü planlaşdırmaq. |

Proqramın idarə edilməsinə sponsor və ya dəqiq səlahiyyət verilmiş idarəçi icazə verir. Vəsait çıxarılması sponsorun özünü tələb edir və yalnız proqram dayandırıldıqda və ya bağlanmaqda olduqda vəsaiti proqramın qeyd edilmiş ödəniş hesabına qaytarır.

Hər versiya bunları müəyyən edir:

- açıq qeydiyyat və ya qeydiyyatla birlikdə icazə verilən standart marşrut uyğunluğu;
- protokolun öz təlimatlarının dəqiq ötürmə ID-ləri və ya müqavilə ünvanları, kod həşləri və giriş nöqtələri üzrə icazə və qadağa qaydaları;
- hər aktiv üçün əməliyyat, blok, proqram epoxası və faydalanan epoxası hədləri;
- minimum ehtiyat və deterministik epoxa uzunluğu.

Qadağa qaydası icazə qaydasından üstündür. Məlumat məkanının `fee_sponsor_program_id` sahəsi yalnız aktiv versiya buna icazə verirsə standart marşrut uyğunluğu yaradır; əməliyyat yenə də öz dəqiq proqramını və versiyasını göstərməlidir. Əvvəlki versiyanın açıq ayırmalarının vaxtı bitənədək aktivləşmə təxirə salına bilər.

Sponsor anbarının aktivləri `Global` balans siyasətindən istifadə etməlidir. Təkcə sponsorun adi hesabını maliyyələşdirmək ayrılmış proqram anbarını maliyyələşdirmir və bir proqram başqa proqramın balansını istifadə edə bilməz.

## 3. Dəqiq əməliyyat üçün qiymət təklifi alın, imzalayın və göndərin {#_3-quote-sign-and-submit-the-exact-transaction}

SDK inteqrasiyası bu addımları yerinə yetirir:

1. Səlahiyyət sahibi, icra olunan məzmun, vaxt nişanları, nonce, metaməlumat, dəqiq sponsor proqramı versiyası və tələb olunan qaz həddi ilə imzalanmamış `TransactionPayload` qurun. Maksimum tutulma qiymətləri əvvəlcə boş ola bilər.
2. `{"payload": <payload>}` ilə `POST /v1/fees/quote` sorğusunu hesab açarı ilə imzalayın. Sorğunu imzalayan əməliyyatın səlahiyyət sahibi olmalıdır.
3. Müşahidə edilən hündürlüyü, həll olunmuş məlumat məkanı marşrutunu, haqq komponentlərini, vəsaitin çıxılma mənbəyini və sponsor tutumunu yoxlayın. Cavabın seçilmiş ödəyicini, versiyanı və qaz həddini qoruduğunu təsdiqləyin.
4. Yalnız `payload.fee_payment` sahəsini tövsiyə edilən niyyətlə əvəz edin, sonra məhz həmin yükü imzalayıb göndərin.
5. Əməliyyatı vəziyyətdən müəyyən edilən `Applied` yekunluğuna qədər izləyin və faktiki sponsor proqramı, versiya və tutulma daxil olmaqla qəbzini saxlayın.

Qiymət təklifi reyestri müşahidə edir; tutum ayırmır. Növbəyə qəbul uyğunluğu yenidən yoxlayır və imzalanmış maksimum məbləğləri ayırır. Sponsorun imtinası əməliyyatı rədd edir və istifadəçidən haqq tutulmasına keçmir.

CLI eyni haqq mənbəyini açıq şəkildə göstərir. Məsələn, proqram məhz bu aktiv köçürməsinə icazə verdikdən və hesab uyğun olduqdan sonra:

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Öz şəbəkənizin aktiv versiyasından və dəqiq identifikatorlarından istifadə edin. İstifadəçi konfiqurasiyası yalnız həmin istifadəçinin imzalayan açarını ehtiva edir; uyğun sponsorlu əməliyyat göndərmək üçün sponsorun şəxsi açarı lazım deyil.

## 4. İstifadəçinin tətbiq haqqı ödəyib-ödəməyəcəyini müəyyən edin {#_4-decide-whether-the-user-pays-an-application-fee}

Tətbiq istifadəçidən heç nə tutmadığı halda sponsor qlobal haqları ödəyə bilər. Tətbiq yerli token toplayırsa, həmin köçürməni və ya müqavilə qaydasını istifadəçinin imzaladığı icra olunan məzmunda açıq şəkildə yazın. Hər əməliyyatı sponsor versiyasının siyasətinə daxil edin və tam yük üçün qiymət təklifini yoxlayın. Şəbəkə haqqı niyyətindən tətbiq tokeninin köçürülməsini çıxarmayın.

## İmtinanı diaqnostika edin {#diagnose-a-refusal}

Qovşağın qaytardığı sabit haqq kodundan və düzəliş təfərrüatlarından istifadə edin:

| Kod | Yoxlanmalı məqam |
| --- | --- |
| `program_not_found` | Dəqiq kanonik proqram kimliyi. |
| `revision_not_active`, `program_not_active` | Versiyanın aktivləşməsi və proqramın həyat dövrü. |
| `beneficiary_not_eligible` | Qeydiyyat və ya icazə verilən standart marşrut uyğunluğu. |
| `operation_not_allowed`, `operation_denied` | Hər dəqiq imzalanmış əməliyyat və qadağa qaydası. |
| `invalid_gas_limit`, `signed_limit_exceeded` | Yeni qiymət təklifinə qarşı qaz həddi və imzalanmış maksimumlar. |
| `vault_insufficient` | Bu proqramın dəqiq valyuta anbarının maliyyələşdirilmiş balansı. |
| Büdcənin tükənməsi kodları | Əməliyyat, blok, proqram epoxası və faydalanan epoxası tutumu. |

Nəticəsi qeyri-müəyyən göndərişi araşdırarkən ilkin əməliyyat həşini və haqqın rədd edilmə detallarını saxlayın. Əvəzedici əməliyyat qurmadan əvvəl onun vəziyyətini təsdiqləyin.

## Sabitlənmiş mənbələr {#pinned-sources}

- [Haqq siyasəti, proqramın həyat dövrü və qiymət təklifi protokolu](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Tipləşdirilmiş sponsor proqramı təlimatları](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [CLI haqq mənbəyi bayraqları və aktiv köçürməsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Məlumat məkanının qurulması](/az/get-started/sora-nexus-dataspaces.md)
