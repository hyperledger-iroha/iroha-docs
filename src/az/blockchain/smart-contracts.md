---
translation_locale: az
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ağıllı müqavilələr {#smart-contracts}

Iroha əməliyyatları `Executable` faydalı yükləri həyata keçirir.

- `Executable::Instructions`: Iroha Xüsusi Təlimatların sıralanmış bir dəstidir.
- `Executable::ContractCall`: tətbiq olunan bir müqavilə nümunəsinə istinadla müraciət
- `Executable::Ivm`: Iroha VM byte kodu
- `Executable::IvmProved`: əvvəlcədən hesablanmış təlimat örtüyü və sübut öhdəlikləri olan Iroha VM byt kodu

Kotodama Iroha-nın yüksək səviyyəli ağıllı müqavilə dilidir. `.ko` mənbə faylı deterministik IVM bayt-koduna kompilyasiya olunur və yerləşdirmə üçün adətən `.to` artefaktı kimi saxlanılır. Kotodama yalnız IVM-i hədəfləyir. O, RISC-V-ni və ya WebAssembly-ni hədəfləmir.

İlk buraxılış yalnız ABI versiya 1-i dəstəkləyir. syscall və pointer-ABI siyasəti müqavilənin qəbulu və icrası zamanı şərtsiz tətbiq olunur; işləmə vaxtı uyğunluğu üçün keçid yoxdur.

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

Hər bir yerləşdirilən ünvan `ContractLifecycleControlV1` qeydini saxlayır, o cümlədən müqavilə qeyri-aktiv olduğu müddətdə. Bu qeyddə ilk yerləşdirilmə mənşəliyinin dəyişməzliyi, mövcud və davam edən sahibinin, istisna edilə biləcək Parlament nümayəndə heyətinin, aktiv kod hashının, sıfır olmayan bir müqayisə və dəyişiklik reviziyası vardır; İstifadəçi hesabı birbaşa icra olunur və onun sahibi kimi qeyd edilir. Parlament icra olunması Parlamentin sahibini təyin edir və onun təklifçisi, təklif məzmununu ID qeyd edir; və uğurla idarəetmə cəhdləri ID yalnız mənşəli olaraq.

Konfiqurasiya edilmiş qorunan ad sahələri Parlamentin istifadəsi üçün ayrılmışdır. `CanRegisterSmartContractCode` əşyaların qeydiyyatına icazə verir, lakin qorunan ad məkanında birbaşa yerləşdirilməsinə və ya xam aktivləşməyə icazə vermir; Orada ilkin həyat dövrü qeydləri Parlament tərəfindən təsdiqlənmiş istismara verilən yolla yaradılmalıdır.

Həyat dövrü sahibi ya bir hesabdır, ya da Parlamentdir. Hesabın mülkiyyətində dəyişikliklər istifadə `OfferContractOwnership` və sonra gözlənilir sahibinin `AcceptContractOwnership`; cari sahib bir pul geri ala bilər `CancelContractOwnershipOffer` ilə qəbul edilməmiş təklif. Qəbul etmək Parlamentin hər hansı bir nümayəndə heyətini ləğv edir. Hesabın müqaviləyə sahib olduğu və ya açıq olmayan təklifdə olan sahibi olduğu müddətdə hesabı çıxarmaq rədd edilir.

Hesab sahibi Parlamentə müqavilənin təkmilləşdirilməsinə, aktivləşdirilməsinə və ya deaktiv edilməsinə icazə verə bilər və sonra bu səlahiyyətləri ləğv edə bilər. Parlamentin mülkiyyətində olan dəyişikliklər və parlament tərəfindən qəbul edilməsi sertifikatlaşdırılmış idarəetmə təsirləri ilə həyata keçirilir.

Qırmızı `ActivateContractInstance` və `DeactivateContractInstance` təlimatları yalnız cari hesabın sahibi üçün mövcuddur. Onlar qeydin dəqiq `expected_revision` olması lazımdır; köhnə və ya sıfır dəyişikliklər bağlanmır. Çörək aktivləşdirilməsi həyat dövrü qeydini yarada bilməz və `active_code_hash` dəyişdirmədən əvvəl qeydiyyatdan keçmiş əşya, manifest və ABI təsdiqləyir. Deaktivasiya Hər müvəffəqiyyətli həyat dövrü keçid yenidənqurmanı irəli sürür və tam post-dövləti buraxır.

Fövqəladə səviyyəli Parlament təklifi yalnız parlamentin tam boru xəttinin vasitəsilə və Siyasət Yuryunun orijinal yerlərinin ən azı üçdə iki hissəsinin "Yay" səsləri ilə pozulma tətbiq edə bilər. Yalnız çağırışları dayandırmaq və icra edilməsini başlatmaq olar: kodunu, mülkiyyəti və ya səlahiyyətini uzatmaq və dəyişdirmək mümkün deyil. Çağırışlar və uyğunlaşdırılmış icra edilənlər tətbiq hündürlüyündən etibarən müddətinin bitməsi hündürlüsünə qədər bloklanır. Expiry avtomatik olaraq icra olunmasını bərpa edir, lakin saxlama silmir. Sertifikatlı `CompleteEmergencyHoldRetrospective` hərəkəti daha sonra dəqiq saxlama IDs-ni bağlamaq və qeyd təmizlənmədən əvvəl sıfır olmayan bir tapma kökünü həzm etmək lazımdır; bu geri baxış tamamlanana qədər başqa bir saxlanma tətbiq edilə bilməz.

Tətbiq API aktivləşdirildikdə, saxlanılan vəziyyəti `GET /v1/gov/contracts/{contract_address}` ilə oxuyun. Onun `found` sahəsi həyat dövrü qeydinin mövcud olduğunu və ünvanın hazırda aktiv koduna malik olmadığını göstərir.

## Əməliyyat istiqamətləri {#operational-guidance}

- Müqavilələri təyinatlı saxlayın. Müqavilə davranışı yerli divar saatına, host fayl sistemi vəziyyətinə, şəbəkə zənglərinə və ya digər peer-lokal girişlərə bağlı olmamalıdır.
- Faydalı yükləri kompakt saxlayın. Böyük baytkod əməliyyatın ölçüsünü və blokların yayılması xərclərini artırır.
- Sadə kitabxana dəyişiklikləri üçün yazılmış təlimatları üstün tutun. Onları yoxlamaq daha asandır və icra etmək daha ucuz.
- Müqavilənin təkmilləşdirilməsi və qeydiyyat icazələri yüksək riskli əməliyyat nəzarətləri kimi qəbul edilir.

Həmçinin bax:

- [Təlimatlar](/az/blockchain/instructions.md)
- [Triggerlər](/az/blockchain/triggers.md)
- [İzinlər](/az/blockchain/permissions.md)
- [Məlumat modelləri sxemi](/az/reference/data-model-schema.md)
