---
translation_locale: az
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Konfiqurasiya Problemlərinin Həlli {#troubleshooting-configuration-issues}

Bu bölmə Iroha 3 konfiqurasiyası üçün problemlərin həlli tövsiyələrini təqdim edir. Əvvəlcə [açarları yoxladı](./overview.md#check-the-keys) olduğunuzdan əmin olun, çünki bu, Iroha dakı problemlərin ən yayılmış mənbəyidir.

Əgər qarşılaşdığınız problem burada təsvir edilməyibsə, bizimlə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə əlaqə saxlayın.

## Köhnəlmiş blockchain genesis Docker Compose qurğusunda {#outdated-genesis-on-a-docker-compose-setup}

Iroha proqramının Docker Compose versiyasından istifadə edərkən, şəbəkə həmkarı konteynerlərindən birinin `Failed to deserialize raw genesis block` xətası ilə uğursuz olma problemi ilə qarşılaşa bilərsiniz. Bu adətən şəbəkə tərəfdaşı, imzalanmış blokçeyn başlanğıc əməliyyatı və yaradılmış konfiqurasiyanın fərqli Iroha versiyaları və ya profilləri tərəfindən istehsal edildiyi deməkdir.

Uğursuzluğu bu addımlarla yoxlayın:

1. `docker ps` istifadə edərək mövcud konteynerləri yoxlayın. Yaradılmış profilə görə adətən `hyperledger/iroha:dev` konteynerləri görəcəksiniz. Standart Docker Compose profili dörd şəbəkə həmkarı konteynerini ehtiva edir, baxmayaraq ki, sizin yaradılmış `docker-compose.yml` fərqli ola bilər.

2. Jurnalları yoxlayın və `Failed to deserialize raw genesis block` xətasını axtarın. Əgər `docker compose up -d` ilə Iroha-inizi daemon rejimində başladırsınızsa, `docker compose logs` əmrdən istifadə edin.

Belə bir problemi aradan qaldırmağın yolu Iroha istifadəsindən asılıdır. Əgər bu sadə bir demo-dursa və şəbəkə həmkarı məlumatlarını saxlamağa ehtiyacınız yoxdursa, uyğun bir localnet və ya Docker Compose paketini Kagami ilə yenidən yaradın:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Sonra köhnə konteyner vəziyyətini silin və yenidən yaradılmış `genesis.signed.nrt`, şəbəkə həmkarı `config.toml` faylları və `client.toml`-dən yenidən başlayın.

Əgər sizə Iroha nümunə məlumatlarını bərpa etmək lazım olsa, aşağıdakıları edin:

1. Birinci (işləməyən) şəbəkə həmkarından məlumatı kopyalayacaq ikinci Iroha şəbəkə həmkarını qoşun.
2. Yeni şəbəkə iştirakçısının məlumatları ilk şəbəkə iştirakçısı ilə sinxronlaşdırmasını gözləyin.
3. Yeni şəbəkə həmkarını aktiv saxlayın.
4. Koordinasiyalı miqrasiya çərçivəsində yalnız birinci şəbəkə həmkarının blokçeyn başlanğıc və konfiqurasiya fayllarını yeniləyin.

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
