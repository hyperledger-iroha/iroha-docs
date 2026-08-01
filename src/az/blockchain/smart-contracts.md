---
translation_locale: az
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 7c35c609442df65328fa619b6673be76f801cfc2abc28afd853d7fe61e439e9c
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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
