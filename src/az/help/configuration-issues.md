---
translation_locale: az
translation_source: /help/configuration-issues.md
translation_source_hash: 9d153d9cb8ce0341b35ba5a7e3823198e58464768e2a9a92ff8a5723f85e9351
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Konfiqurasiya Problemlərinin Həlli {#troubleshooting-configuration-issues}

Bu bölmə Iroha 3 konfiqurasiyası üçün problemlərin həlli tövsiyələrini təqdim edir. Əvvəlcə [açarları yoxladı](./overview.md#check-the-keys) olduğunuzdan əmin olun, çünki bu, Iroha dakı problemlərin ən yayılmış mənbəyidir.

Əgər qarşılaşdığınız problem burada təsvir edilməyibsə, bizimlə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə əlaqə saxlayın.

## Köhnəlmiş blockchain genesis Docker Compose qurğusunda {#outdated-genesis-on-a-docker-compose-setup}

Iroha proqramının Docker Compose versiyasından istifadə edərkən, şəbəkə həmkarı konteynerlərindən birinin `Failed to deserialize raw genesis block` xətası ilə uğursuz olma problemi ilə qarşılaşa bilərsiniz. Bu adətən şəbəkə tərəfdaşı, imzalanmış blokçeyn başlanğıc əməliyyatı və yaradılmış konfiqurasiyanın fərqli Iroha versiyaları və ya profilləri tərəfindən istehsal edildiyi deməkdir.

Təsdiqləyici qovşaqların jurnallarına baxmaq üçün dəstin qovluğunda `python3 poc.py logs` əmrini işlədin. Docker-də eyni reviziyadan yığılmış icra faylları ilə dörd təsdiqləyici qovşaq qurub işə salmaq üçün [Iroha 3-i işə sal](/az/get-started/launch-iroha.md) təlimatına əməl edin.

Eyni şəbəkəni yenidən işə salmaq üçün əvvəl `python3 poc.py down`, sonra `python3 poc.py up` əmrlərini işlədin. `state/` qovluğunu şəbəkənin dörd Docker yaddaş bölməsi ilə birlikdə saxlayın.

::: info

Canlı şəbəkədə blokçeyn genesis-ini əvəz etmək üçün ümumi avtomatik yenidən yazma yolu yoxdur. Bunu koordinasiyalı bir miqrasiya kimi qəbul edin: köhnə vəziyyəti qoruyun, uyğun şəbəkə iştirakçılarını işə salın və yalnız operatorlar miqrasiya planı ilə razılaşdıqdan sonra doğrulayıcıları yeni konfiqurasiyaya köçürün.

:::

## Şəxsi və İctimai Açarların Multihash Formatı {#multihash-format-of-private-and-public-keys}

Əgər siz [müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)-a baxsanız, oradakı düymələrin [çoxlu-həş formatı](https://github.com/multiformats/multihash) şəklində verildiyini görəcəksiniz.

Əgər əvvəllər çoxlu hash ilə işləməyibsinizsə, sağ tərəfin açar baytlarının onaltılıq təmsili olmadığı qənaətinə gəlmək təbii olar (hər biri iki simvol) bayt), lakin ASCII (və ya UTF-8) kimi kodlanmış baytlardır və həm `public_key`, həm də `private_key` instansiyalaşdırmasında string literal üzərində `from_hex`-ı çağırın.

Eyni zamanda, sətir ədədində `PrivateKey::try_from_str` çağırmağın yalnız düzgün açarı verəcəyini fərz etmək təbii olar. Beləliklə, əgər açarın bit sayını yanlış təyin etsəniz, məsələn, 32 bayt əvəzinə 64, bu, səhv mesajı verər.

Hər iki bu fərziyyə yanlışdır. Təəssüf ki, səhv mesajları bu xüsusi növ uğursuzluğu düzəltməkdə kömək etmir.

Düzəltmək üçün: `hex_literal` istifadə edin. Bu həm də çirkin simvollar ardıcıllığını aydın şəkildə onaltılıq rəqəmlərdən ibarət kiçik bir cədvələ çevirəcək.

::: warning

Hətta `try_from_str` tətbiqi də verilmiş stringin etibarlı `PrivateKey` olub olmadığını yoxlaya bilməz və əgər yoxdursa, sizi xəbərdar edə bilməz.

O, bəzi açıq səhvləri aşkar edəcək, məsələn, əgər sətir etibarsız simvol ehtiva edirsə. Lakin, çoxlu açar formatlarını dəstəkləməyi nəzərdə tutduğumuz üçün, o, başqa çox bir şey edə bilmir. O, həmçinin açarın verilmiş hesab üçün düzgün şəxsi açar olub-olmadığını deyə bilməz, əgər siz göstəriş göndərməsəniz.

:::

Belə incə səhvlər, məsələn, birbaşa sətir literallarından deserializasiya etməklə və ya məntiqli olduğu yerlərdə yeni açar cütü yaratmaqla qarşısı alına bilər.
