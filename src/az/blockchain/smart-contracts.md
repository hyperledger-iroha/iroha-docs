---
translation_locale: az
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ağıllı müqavilələr {#smart-contracts}


Iroha əməliyyatları `Executable` faydalı yükləri həyata keçirir.

- `Executable::Instructions`: Iroha Xüsusi Təlimatların sıralanmış bir dəstidir.
- `Executable::ContractCall`: tətbiq olunan bir müqavilə nümunəsinə istinadla müraciət
- `Executable::Ivm`: Iroha VM byte kodu
- `Executable::IvmProved`: əvvəlcədən hesablanmış təlimat örtüyü və sübut öhdəlikləri olan Iroha VM byt kodu

Kotodama olan Iroha Bu yüksək səviyyəli ağıllı müqavilə dilidir. `.ko` mənbə faylları deterministik tərtib edir IVM bytecode, ənənəvi olaraq `.to` yerləşdirilməsi üçün artefakt. Kotodama hədəflər IVM Yalnız hədəf deyil. RISC-V və ya WebAssembly.

İlk buraxılış yalnız ABI versiyasını dəstəkləyir 1. Syscall və pointer-ABI siyasəti qəbul və icra yolu ilə qüvvəyə minən şərtsiz bir V1 müqavilədir; alternativ idman vaxtı rejimi yoxdur.

## Ağıllı müqavilələrdən nə vaxt istifadə etmək olar? {#when-to-use-smart-contracts}

Əməliyyatın birbaşa ifadə edilə biləcəyi zaman normal təlimatlardan istifadə edin:

- qeydiyyatdan keçən və ya qeydiyyata alınmayan obyektlər
- Əmlaklar vəsait
- Yeniləmə metadataları
- icazələrin verilməsi və ya ləğv edilməsi
- bir tetikçi icra
- zəncirlə bağlı parametrlərin müəyyən edilməsi

Transaksiya üçün statik təlimat ardıcıllığı kimi ifadə etmək çətindir və ya tətbiq edilmiş bir müqavilə nümunəsi istinadən çağırılmalıdırsa, ağıllı müqaviləni istifadə edin.

## IVM İcra olunanlar {#ivm-executables}

`Executable::Ivm` xam IVM byte kodunu daşıyır. Nodular bu byte kodu zəncir üçün qurulmuş icra müddətləri daxilində icra edirlər. Byte kodunu kiçik və təyinatlı saxlayın; müqavilələr əməliyyatın icrasının bir hissəsidir və buna görə konsensusə təsir edir.

`Executable::IvmProved` sübut daşıyan axınlar üçün nəzərdə tutulmuşdur.

- IVM byte kodu
- Deterministik təlimat üst-üstə düşməsi
- icra hadisələri ilə bağlı öhdəlik
- qaz siyasəti ilə bağlı öhdəlik

Bu sübut, üst örtüyü icra edilmiş bayt koduna bağlayır. Pipeline siyasətindən asılı olaraq, təsdiqləyicilər sübutunu yoxlaya və əlavə təhlükəsizlik yoxlaması kimi yenidən oynaya bilərlər.

## İstifadə olunmuş müqavilə zəngləri {#deployed-contract-calls}

`Executable::ContractCall` tətbiq edilmiş bir müqavilə nümunəsini ünvanla çağırır. Müqavilə kodu ayrı-ayrı qeydiyyatda olunduqda və əməliyyatlar hər dəfə bayt kodunu daşımaq əvəzinə onu istinadən çağırmalıdırlar.

## Müqavilənin həyat dövrü və mülkiyyət {#contract-lifecycle-and-ownership}

Hər bir yerləşdirilən ünvan `ContractLifecycleControlV1` qeydini saxlayır, o cümlədən müqavilə qeyri-aktiv olduğu müddətdə. Bu qeyddə ilk yerləşdirilmə mənşəliyinin dəyişməzliyi, mövcud və davam edən sahibinin, istisna edilə biləcək Parlament nümayəndə heyətinin, aktiv kod hashının, sıfır olmayan bir müqayisə və dəyişiklik reviziyası vardır; İstifadəçi hesabı birbaşa yerləşdirilir. Parlamentin yerləşdirilməsi təklifini, təklif məzmununu ID və uğurlu idarəetmə cəhdini ID qeyd edir.

Ömr dövrünün sahibi ya bir hesabdır, ya da Parlament. Hesabın mülkiyyətinin dəyişdirilməsi ayrı təklif və qəbuldan istifadə edir; təklifi qəbul etmək hər hansı parlament nümayəndəliyini təmizləyir. Hesabın sahibi Parlamentə müqaviləni aktivləşdirməyə və ya deaktiv etməyə icazə verə bilər, sonra isə bu səlahiyyətləri ləğv edə bilər, lakin səlahiyyət heç vaxt Parlamentin mülkiyyəti ötürməsinə imkan vermir.

Qırmızı `ActivateContractInstance` və `DeactivateContractInstance` təlimatları yalnız cari hesab sahibinin əlindədir. Onlar qeydin dəqiq `expected_revision` olması lazımdır; İdarə vaxtı köhnəlmiş və ya sıfır dəyişiklikləri rədd edir. Çörək aktivləşdirilməsi həyat dövrü qeydini yarada bilməz və `active_code_hash` dəyişdirmədən əvvəl qeydiyyatdan keçmiş əşya, manifest və ABI təsdiqləyir. Deaktivasiya Hər müvəffəqiyyətli həyat dövrü keçid yenidənqurmanı irəli sürür və tam post-dövləti buraxır.

Aktivləşdirmə eyni zamanda bir manifest elan edilmiş həyat dövrü qabığı da təşkil edə bilər. `EntryPointKind::Hajimari` giriş nöqtəsi (`hajimari`/`始まり`) mərhələləri `Hajimari`. Bir aktiv ünvanı bir manifestini ehtiva edən kodla yenidən bağlamaq `EntryPointKind::Kaizen` giriş nöqtəsi (`kaizen`/`改善`) mərhələləri `Kaizen`. Əlaqədarlıq dərhal dəyişir, lakin müqavilə hazır deyil: hər bir `Kotoage` və `View` çağırış, dəqiq mərhələli qabı uğurlu olana qədər rədd edilir. Bir qabın gözlədiyi müddətdə başqa bir aktivləşdirmə də rədd edilir

`Executable::ContractCall` ilə mərhələli qabı eyni müqavilə ünvanında və yeni kod hashini istifadə edərək, dəqiq `hajimari` və ya `kaizen` giriş nöqtəsini və manifestində bəyan edilən argumentləri istifadə edin. İdarə vaxtı `CanInvokeContractEntrypoint` ünvan və seçicisi ilə ölçülmüş icazəni təmin edir; zəng edənlər bu icazəni yaratmamalı və ya verməməlidirlər. Gözlənilən işarə bir işarəni ehtiva edir, işarə zamanı yaradılmış, müəyyənləşdirilmiş `transition_id` və yeni `code_hash`; bir `Kaizen` işarəsi də `previous_code_hash` ehtiva edir. Müştərilər nə hesablayırlar, nə də təqdim edirlər `transition_id`. Uğurlu bir qabıq göstəricini atom olaraq istehlak edir.

Parlamentin fövqəladə səviyyəli təklifində mövcud yenidənqurma, kod hash və sıfır olmayan hadisə həndəsi bağlandıqda ən çox 3600 blok üçün təxirə salınması tətbiq edilə bilər. Expiry icra edilməsini bərpa edir, lakin saxlamaları silmir. təsdiqlənmiş `CompleteEmergencyHoldRetrospective` hərəkəti daha sonra dəqiq saxlamaları IDs bağlamaq və qeydin təmizlənməsindən əvvəl sıfır olmayan bir tapma kökünü həzm etmək lazımdır; geriyə baxış davam edərkən başqa bir saxlanma tətbiq edilə bilməz.

Tətbiq API aktivləşdirildikdə, saxlanılan vəziyyəti `GET /v1/gov/contracts/{contract_address}` ilə oxuyun. Onun `found` sahəsi həyat dövrü qeydinin mövcud olduğunu və ünvanın hazırda aktiv koduna malik olmadığını göstərir.

## Əməliyyat istiqamətləri {#operational-guidance}

- Müqavilələri təyinatlı saxlayın. Müqavilə davranışı yerli divar saatına, host fayl sistemi vəziyyətinə, şəbəkə çağırışlarına və ya digər peer-lokal girişlərə bağlı olmamalıdır.
- Faydalı yükləri kompakt saxlayın. Böyük baytkod əməliyyatın ölçüsünü və blokların yayılması xərclərini artırır.
- Sadə kitabxana dəyişiklikləri üçün yazılmış təlimatları üstün tutun. Onları yoxlamaq daha asandır və icra etmək daha ucuz.
- Müqavilənin təkmilləşdirilməsi və qeydiyyat icazələri yüksək riskli əməliyyat nəzarətləri kimi qəbul edilir.

Həmçinin bax:

- [Təlimatlar](/az/blockchain/instructions.md)
- [Triggerlər](/az/blockchain/triggers.md)
- [İzinlər](/az/blockchain/permissions.md)
- [Məlumat modelləri sxemi](/az/reference/data-model-schema.md)
