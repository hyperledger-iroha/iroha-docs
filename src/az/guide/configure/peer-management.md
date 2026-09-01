---
translation_locale: az
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# şəbəkə tərəfdaşının idarə edilməsi {#peer-management}

Əgər siz hər hansı bir dilə xas təlimatı izləmisinizsə, indi insanların qoşulmaq istədiyi yaxşı işləyən bir şəbəkəniz var.

## İctimai Blokçeyn {#public-blockchain}

Açıq şəbəkədə, şəbəkə həmkarının qəbul edilməsi hələ də zəncir siyasəti qərarıdır. Bir düyün düzgün proqram təminatını işlədə və Torii ilə bağlantı qura bilər, lakin yalnız şəbəkə onun şəbəkə həmkarı şəxsiyyətini qəbul etdikdən sonra razılaşmaya qatılır.

## Şəxsi Blokçeyn {#private-blockchain}

Bank mühitində hər kəsin istədiyi vaxt qoşulmasına icazə vermək təhlükəsizlik risqidir. Təhlükəsizlik üçün, şəxsi Iroha yerləşdirmələri adətən şəbəkə həmkarı topologiyasını açıq aşkarlara güvənmək əvəzinə konfiqurasiyada və blokçeyn genesisində sabitləyir.

### Şəbəkə həmkarlarını qeydiyyatdan keçirmək {#registering-peers}

Şəbəkəyə bir şəbəkə iştirakçısını əlavə etmək üçün onu əl ilə qeydiyyatdan keçirmək lazımdır. Bu prosesi tamamlamaq üçün atılmalı olan addımları müzakirə edək.

#### 1. İstifadəçiyə icazə verin {#_1-grant-the-user-permissions}

Şəbəkə yoldaşını qeydiyyatdan keçirən hesabın uyğun `Permission` olmalıdır. Bu, `Role` vasitəsilə və ya birbaşa icazə verilməsi şəklində təmin edilə bilər.

Hesab zamanla şəbəkə yoldaşlarını idarə edəcəkdə bir rol verin. Əks halda şəbəkə yoldaşlarını idarə etməyən hesab tərəfindən bir dəfəlik qeydiyyat üçün birbaşa icazə verin.

::: info

Səhv etməyən icraçı şəbəkə yoldaşlarını qeydiyyatdan keçirmək və qeydiyyatdan silmək üçün `CanManagePeers` icazə tokenindən istifadə edir.

:::

Biz icazələr və rolları daha ətraflı şəkildə [ayrı fəsil](/az/blockchain/permissions.md)də müzakirə edirik.

#### 2. Şəbəkə qoşulması qurun {#_2-set-up-a-peer}

Yeni bir şəbəkə iştirakçısına icazələr verildikdən sonra, onun qurulması lazımdır.

Bir node-u qəbul etməzdən əvvəl mövcud şəbəkə həmkarı konfiqurasiyasını tələb edin. Torii bu məqsəd üçün node parametrləri və imkanları API son nöqtələrini açır. Şəbəkə tərəfdaşının başlanğıc əlaqəsi bu dəyərləri avtomatik olaraq müzakirə etmir: operatorlar vaxt aşımı, toplu ölçülər və digər konsensusla əlaqəli parametrlərin şəbəkə ilə uyğunluğunu təsdiqləməlidirlər.

Prosesi sadələşdirmək üçün, şəbəkə administratorundan `config.toml`-ın redaktə edilmiş versiyasını istəyə bilərsiniz, bu versiya şəbəkə bərabəri şəxsi açarları kimi xüsusi məlumatları istisna edir.

#### 3. Təlimatı təqdim edin {#_3-submit-the-instruction}

Şəbəkə yoldaşınız işlədikdən sonra, qeydiyyat yoldaşı təlimatını təqdim etməlisiniz. Şəbəkə yoldaşı əl sıxma prosesindən keçəcək və şəbəkə ilə ünsiyyətə başlayacaq.

::: tip

Şəbəkə tərəfdaşının qeydiyyat təlimatını təqdim etmək yeni bir şəbəkə tərəfdaş prosesi yaratmır (və yarada bilməz).

:::

### Şəbəkə həmkarlarının qeydiyyatdan silinməsi {#unregistering-peers}

Şəbəkə iştirakçılarının qeydiyyatının silinməsi nə olacaq? Təhlükəsizlik səbəblərinə görə bu proses bir tərəfli olur. Şəbəkə, bir şəbəkə iştirakçısını çıxarmaq istədiyi barədə konsensus əldə edir, amma şəbəkə iştirakçısı özü niyə heç kim onunla danışmadığını çox bilmir.

Çox şəraitdə, əgər siz bir şəbəkə həmkarını qeydiyyatdan çıxarmaq istəyirsinizsə, bunu etmək istəməyinizin səbəbi onun Bizans xətası olmasıdır. Sadəcə olaraq bu şəbəkə həmkarını “gözdən itirmək” şəbəkədəki zərərli aktorun həyatını çətinləşdirir.
