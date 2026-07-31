---
translation_locale: az
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tərəflər arasında idarəetmə {#peer-management}

Əgər dilə aid təlimatlardan birini izləmisinizsə, indi insanların qoşulmaq istədikləri yaxşı işləyən bir şəbəkəniz var.

## İctimai Blockchain {#public-blockchain}

Açıq şəbəkədə həmkarların qəbul edilməsi hələ də bir zəncir siyasəti qərarıdır. Bir nod düzgün proqramı icra edə bilər və Torii ilə qoşula bilər, lakin şəbəkə öz həmkarlarının kimliyini etiraf etdikdən sonra yalnız razılaşmada iştirak edir.

## Xüsusi Blockchain {#private-blockchain}

Bank şəraitində hər kəsin boş vaxtlarında qoşulmasına icazə vermək təhlükəsizlik riski təşkil edir. Təhlükəsizlik üçün xüsusi Iroha yerləşdirmələr ümumiyyətlə açıq kəşflərə güvənmək əvəzinə həmyaşıd topologiyasını konfigüratsiyaya və mənbəyə bağlayırlar.

### Tərəfdaşların qeydiyyata alınması {#registering-peers}

Şəbəkəyə həmyaşıd əlavə etmək üçün əl ilə qeydiyyatdan keçmək lazımdır. Gəlin bu prosesi başa çatdırmaq üçün nə addımlar atılmalı olduğunu müzakirə edək

#### 1. İstifadəçiyə icazə verin. {#_1-grant-the-user-permissions}

Tərəfdaşları qeydiyyatdan keçirən hesabda müvafiq `Permission` olmalıdır və bu, `Role` vasitəsilə və ya birbaşa icazə verilməsi şəklində verilir.

Bir rol verməyə ehtiyacınız olub olmadığını necə qərar verməlisiniz? Bir istifadəçinin bir növ administrator kimi xidmət etməsi üçün rolların verilməsi mənalıdır, burada şəbəkədəki həmyaşıdları uzunmüddətli saxlamaq onların məsuliyyətidir. Birdəfəlik icazə verilməsi, həmyaşıdları qeydiyyatdan keçirən tərəf ümumiyyətlə həmyaşıdaların qeydiyyatından məsuliyyət daşımırsa, faydalıdır, lakin şəbəkə idarəçisinin yeni bir həmyaşıdı qurmaq üçün vaxt sərf etməsinə (və ya istəməsinə) ehtiyac yoxdur.

::: məlumat

Standart icraçı `CanManagePeers` icazə nişanını qeydiyyatdan keçmək və qeydiyyata alınmamaq üçün istifadə edir.

:::

[ ayrı bir fəsildə ](/az/blockchain/permissions.md) icazələri və rolları daha ətraflı müzakirə edirik.

#### 2. Bir həmyaşıd qurun {#_2-set-up-a-peer}

Yeni bir həmyaşıdın icazəsi verildikdən sonra, qurulmalıdır.

Torii bu məqsədlə node parametrini və qabiliyyət son nöqtələrini açıqlayır. Peer bootstrap bu dəyərləri avtomatik olaraq danışa bilməz: operatorlar vaxtların, partiya ölçülərinin və konsensusla əlaqəli digər parametrlərin şəbəkəyə uyğun olduğunu yoxlamalıdırlar.

Prosesi sadələşdirmək üçün şəbəkə idarəçisindən `config.toml` -nin redaksiyalı versiyasını xahiş edə bilərsiniz ki, bu da peer private key kimi xüsusi məlumatları istisna edir.

#### 3. Təlimatı təqdim edin {#_3-submit-the-instruction}

Tərəfdaşınız işlədikdən sonra, tərəfdaş təlimatını təqdim etməlisiniz. Tərəfdaşlar əl çəkmə prosesindən keçəcəklər və şəbəkə ilə söhbət etməyə başlayacaqlar.

::: xəsarət

Tərəfdaş qeydiyyatı təlimatının təqdim edilməsi yeni bir tərəfdaş prosesi təşkil etmir (və edə bilməz).

:::

### qeydiyyatdan keçməyən yaşıtlar {#unregistering-peers}

Bəs qeydiyyatdan keçməyən yaşıtlar? Təhlükəsizlik səbəbləri ilə bu proses birmənalıdır. Şəbəkə həmyaşıdını aradan qaldırmaq istədikləri barədə razılığa gəlir, lakin həmyaşıda heç kimin niyə danışmadığı haqqında çox şey bilmir. Ona görə.

Əksər hallarda, bir həmyaşıdın qeydiyyatını ləğv etmək istəyirsinizsə, bunu etmək istəyirsiniz, çünki bu Bizanslı səhvdir. Bu həmyaşıdın "axtarılması" şəbəkədəki zərərli aktyorun həyatını daha da çətinləşdirir.
