---
translation_locale: az
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ağıllı Müqavilələr {#smart-contracts}

Iroha əməliyyatları `Executable` yükləri icra edir. Mövcud məlumat modeli dəstəkləyir:

- `Executable::Instructions`: Iroha Təlimat əməliyyatlarının sifarişli dəsti
- `Executable::ContractCall`: yerləşdirilmiş müqavilə nümunəsinə istinadla texniki çağırış
- `Executable::Ivm`: Iroha VM baytkod
- `Executable::IvmProved`: Iroha VM öncə hesablanmış təlimat örtüyü və sübut kriptoqrafik öhdəlik dəyərləri ilə baytkod

Kotodama Iroha-ün yüksək səviyyəli ağıllı müqavilə dilidir. Bir `.ko` mənbə faylı deterministik IVM baytkoduna tərtib olunur və ənənəvi olaraq yerləşdirmə üçün `.to` artefaktı kimi saxlanılır. Kotodama yalnız IVM-ə yönəlib. O, RISC-V və ya WebAssembly-ə yönəlmir.

İlk buraxılış yalnız ABI versiya 1-i dəstəkləyir. Syscall və pointer-ABI siyasəti qəbul və icra tərəfindən tətbiq olunan bir şərtsiz V1 müqaviləsidir; alternativ proqram icra mühiti rejimi yoxdur.

## Ağıllı Müqavilələrdən Nə Zaman İstifadə Etməli {#when-to-use-smart-contracts}

Əməliyyat birbaşa ifadə oluna biləndə adi təlimatlardan istifadə edin:

- obyektləri qeydiyyata almaq və ya qeydiyyatdan silmək
- məsələ, məhv etmək və ya əmlakı köçürmək
- metadatanı yeniləyin
- icazələri vermək və ya ləğv etmək
- triggeri icra et
- zəncirdə parametrləri təyin etmək

Əgər əməliyyatın statik təlimat ardıcıllığı kimi ifadə etmək çətin olan qablaşdırılmış məntiqə ehtiyacı varsa, ya da yerləşdirilmiş müqavilə nümunəsinə istinadla müraciət edilməlidirsə, ağıllı müqavilədən istifadə edin.

## IVM İcra edilə bilən fayllar {#ivm-executables}

`Executable::Ivm` xam IVM baytkodunu daşıyır. Nodelar həmin baytkodu zəncir üçün konfiqurasiya olunmuş proqram icra mühiti sərhədləri daxilində icra edir. Baytkodu kiçik və deterministik saxlayın; müqavilələr əməliyyat icrasının bir hissəsidir və buna görə də konsensusa təsir göstərir.

`Executable::IvmProved` sübut daşıyan axınlar üçün nəzərdə tutulub. O, daşıyır:

- IVM baytkod
- deterministik təlimat örtüyü
- icra hadisələri kriptoqrafik öhdəlik dəyəri
- qaz-siyası kriptoqrafik öhdəlik dəyəri

Sübut örtüyü icra edilmiş baytkodla bağlayır. Proqram təminatı işləmə iş axını siyasətindən asılı olaraq, yoxlayıcılar sübutu təsdiqləyə və əlavə təhlükəsizlik yoxlaması kimi icranı yenidən işlədə bilərlər.

## Yerinə yetirilmiş müqavilə çağırışları {#deployed-contract-calls}

`Executable::ContractCall` ünvan vasitəsilə yerləşdirilmiş kontrakt nümunəsini çağırır. Bu, kontrakt kodu ayrıca qeydiyyatdan keçdikdə və əməliyyatların hər dəfə bayt kodunu daşımaq əvəzinə ona istinadla çağırması lazım olduqda istifadə edilir.

## Müqavilə Həyat Dövrü və Sahiblik {#contract-lifecycle-and-ownership}

Hər yerləşdirilmiş ünvan `ContractLifecycleControlV1` qeydi saxlayır, hətta müqavilə aktiv olmadıqda da. Qeyd dəyişməz ilk yerləşdirmə mənşəyini, hazırkı və gözləyən sahibini, istənilən ləğv edilə bilən Parlament təyinini, aktiv kodun kriptoqrafik yoxlama məxrişini, sıfır olmayan müqayisə-və-əvəzləmə reviziyasını ehtiva edir. və hər hansı saxlanılan təcili saxlanma. Birbaşa yerləşdirmə yerləşdirən hesabı qeyd edir. Parlament yerləşdirməsi isə təklif edən şəxsini, təklif-məzmun ID-sini və uğurlu idarəetmə cəhdinin ID-sini qeyd edir.

Həyat dövrünün sahibi ya bir hesab, ya da Parlamentdir. Hesab sahibliyi dəyişiklikləri üçün ayrıca təklif və qəbul istifadə olunur; təklifi qəbul etmək hər hansı bir Parlament səlahiyyətini ləğv edir. Hesab sahibi Parlamentin müqaviləni aktivləşdirməsinə və ya deaktiv etməsinə icazə verə bilər, sonra isə həmin səlahiyyətin verilməsini ləğv edə bilər, lakin səlahiyyətin verilməsi heç vaxt Parlamentin mülkiyyəti köçürməsinə imkan vermir. Parlamentin mülkiyyətində olan dəyişikliklər və Parlamentin qəbul edilməsilə bağlı qərarlar sertifikatlaşdırılmış idarəetmə təsirləri vasitəsilə həyata keçirilir.

Xam `ActivateContractInstance` və `DeactivateContractInstance` təlimatlar yalnız cari hesab sahibinə mövcuddur. Onlar qeydiyyatın dəqiq `expected_revision`-ni daşımalıdır; köhnəlmiş və ya sıfır dəyişikliklər bağlanır. Xam aktivləşdirmə həyat dövrü qeydiyyatı yarada bilməz və `active_code_hash`-ü dəyişmədən əvvəl qeydiyyatdan keçmiş artefaktı, texniki manifesti və ABI-ü təsdiqləyir. Deaktivasiya aktiv kod kriptoqrafik xəşini təmizləyir, lakin sahibliyi və mənşəyi saxlayır. Hər uğurlu həyat dövrü keçidi yeniləməni irəli aparır və tam son vəziyyəti yayımlayır.

Aktivasiya həmçinin birinci mərhələdə manifestdə elan edilmiş həyat dövrü kirayəçisini mərhələləndirə bilər. Texniki manifesti `EntryPointKind::Hajimari` giriş nöqtəsi (`hajimari`/`始まり`) olan birinci aktivasiya `Hajimari`-ü mərhələləndirir. Aktiv ünvanın texniki manifestində `EntryPointKind::Kaizen` giriş nöqtəsi (`kaizen`/`改善`) olan koda yenidən bağlanması `Kaizen` mərhələlərini əhatə edir. Bağlama dərhal dəyişir, amma müqavilə hazır deyil: Hər bir `Kotoage` və `View` texniki çağırış, dəqiq mərhələli tutacaq uğur qazanana qədər rədd edilir. Tutacaq gözləyərkən başqa bir aktivləşdirmə də rədd edilir.

Eyni müqavilə ünvanında və yeni kod kriptoqrafik xəşi ilə mərhələli hook-u `Executable::ContractCall` ilə çağırın, dəqiq `hajimari` və ya `kaizen` giriş nöqtəsini və onun texniki manifestində bəyan edilmiş arqumentləri istifadə edərək. Proqram təminatı icra mühiti ünvan və seçici ilə məhdudlaşdırılmış `CanInvokeContractEntrypoint` icazəni təmin edir; icazəni tələb edən müştərilər həmin icazəni yaratmamalı və verməməlidir. Gözləmə markerində işləmə vaxtında yaradılan, deterministik `transition_id` və yeni `code_hash` var; `Kaizen` markerində də `previous_code_hash` var. Müştərilər `transition_id`-i hesablamır və göndərmir. Uğurlu bir hook markeri atomik şəkildə istehlak edir, uğursuz hook isə onu daha sonra yenidən cəhd üçün gözləmə vəziyyətində saxlayır.

Təcili səviyyəli Parlament təklifi, cari reviziya, kod kriptoqrafik xəş və sıfır olmayan hadisə kriptoqrafik xülasə dəyərini bağladıqda ən çox 3,600 blok müddətinə bir dayandırma tətbiq edə bilər. Texniki çağırışlar, tətbiq hündürlüyündən etibarən, lakin sona çatma hündürlüyü daxil edilmədən bloklanır. Müddət başa çatması icranı bərpa edir, lakin saxlanmanı silmir. Sertifikatlaşdırılmış `CompleteEmergencyHoldRetrospective` əməliyyatı daha sonra dəqiq saxlanma ID-lərini və kriptoqrafik xülasə dəyərini eləcə də qeydin ləğv edilməsindən əvvəl sıfır olmayan bir tapıntı kökünü bağlamalıdır; həmin retrospektiv hələ də tamamlanmamış qalarkən başqa bir saxlanma tətbiq oluna bilməz.

Tətbiq API aktiv olduqda, saxlanılmış vəziyyəti `GET /v1/gov/contracts/{contract_address}` ilə oxuyun. Onun `found` sahəsi bir həyat dövrü qeydinin mövcud olduğunu göstərir, cari ünvanın aktiv kodu olduğu anlamına gəlmir.

## Əməliyyat Təlimatı {#operational-guidance}

- Müqavilələri deterministik saxlayın. Müqavilənin davranışı lokal sistem saatı zamanı, host fayl sistemi vəziyyəti, şəbəkə sorğuları və ya digər həmkar-lokal məlumatlardan asılı olmamalıdır.
- Yükləri kompakt saxlayın. Böyük baytkod əməliyyatın ölçüsünü və blok ötürmə xərclərini artırır.
- Sadə blokçeyn dəftəri dəyişiklikləri üçün yazılı təlimatları üstün tutun. Onları yoxlamaq daha asandır və icrası daha ucuzdur.
- Müqavilə yeniləməsi və qeydiyyat icazələrini yüksək riskli əməliyyat nəzarətləri kimi qiymətləndirin.

Bax həmçinin:

- [Təlimatlar](/az/blockchain/instructions.md)
- [Səbəblər](/az/blockchain/triggers.md)
- [İcazələr](/az/blockchain/permissions.md)
- [Məlumat modeli sxemi](/az/reference/data-model-schema.md)
