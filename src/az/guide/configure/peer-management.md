---
translation_locale: az
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
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

Bir hesabın vaxt keçdikcə həmyaşıdları idarə edəcəyi zaman rol ver. Digər tərəfdən həmyaşıdları idarə etməyən hesab tərəfindən bir dəfə qeydiyyatdan keçmək üçün birbaşa icazə verildiyi istifadə edin.

::: info

Standart icraçı `CanManagePeers` icazə nişanını qeydiyyatdan keçmək və qeydiyyata alınmamaq üçün istifadə edir.

:::

[ ayrı bir fəsildə ](/az/blockchain/permissions.md) icazələri və rolları daha ətraflı müzakirə edirik.

#### 2. Bir həmyaşıd qurun {#_2-set-up-a-peer}

Yeni bir həmyaşıdın icazəsi verildikdən sonra, qurulmalıdır.

Torii bu məqsədlə node parametrini və imkan son nöqtələrini aşkar edir. Peer bootstrap bu dəyərləri avtomatik olaraq danışıqlar aparmır: operatorlar vaxtların, partiya ölçülərinin və konsensusla əlaqəli digər parametrlərin şəbəkə ilə uyğun olduğunu yoxlamalıdırlar.

Prosesi sadələşdirmək üçün şəbəkə idarəçisindən `config.toml` -nin redaksiyalı versiyasını xahiş edə bilərsiniz ki, bu da peer private key kimi xüsusi məlumatları istisna edir.

#### 3. Təlimatı təqdim edin {#_3-submit-the-instruction}

Tərəfdaşınız işlədikdən sonra, tərəfdaş təlimatını təqdim etməlisiniz. Tərəfdaşlar əl çəkmə prosesindən keçəcəklər və şəbəkə ilə söhbət etməyə başlayacaqlar.

::: tip

Tərəfdaş qeydiyyatı təlimatının təqdim edilməsi yeni bir tərəfdaş prosesi təşkil etmir (və edə bilməz).

:::

### qeydiyyatdan keçməyən yaşıtlar {#unregistering-peers}

Bəs qeydiyyatdan keçməyən yaşıtlar? Təhlükəsizlik səbəbləri ilə bu proses birmənalıdır. Şəbəkə həmyaşıdını çıxarmaq istədiyi barədə razılığa gəlir, amma Tərəfdaşın özü niyə heç kim onunla danışmadığını çox bilmir.

Əksər hallarda, bir həmyaşıdın qeydiyyatını ləğv etmək istəyirsinizsə, bunu etmək istəyirsiniz, çünki bu Bizanslı səhvdir. Bu həmyaşıdın "axtarılması" şəbəkədəki zərərli aktyorun həyatını daha da çətinləşdirir.
