---
translation_locale: az
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfigurasiya problemlərinin həlli {#troubleshooting-configuration-issues}

Bu bölmə Iroha 3 konfigurasiyası üçün problemlərin aradan qaldırılması məsləhətlərini təqdim edir. Əvvəlcə [ düymələrini ](./overview.md#check-the-keys) yoxladığınızdan əmin olun, çünki bu ən çox rast gəlinən problem mənbəyidir Iroha.

Əgər yaşadığınız problem burada təsvir olunmursa, [Teleqram ](https://t.me/hyperledgeriroha) vasitəsilə bizimlə əlaqə saxlayın.

## Docker Compose quruluşunda köhnə genesis {#outdated-genesis-on-a-docker-compose-setup}

İstifadə edərkən Docker Compose versiyası Iroha, bir qabın problemi ilə rast gəlinə bilər `Failed to deserialize raw genesis block` Bu adətən o deməkdir ki, həmyaşıdlar, imzalanmış genesis əməliyyatı və istehsal olunmuş konfiqurasiya müxtəlif Iroha Dəyişikliklər və ya profillər.

Bu addımlarla uğursuzluğu yoxlayın:

1. Hazırda olan konteynerləri yoxlamaq üçün `docker ps` istifadə edin. Yaradılan profildən asılı olaraq, ümumiyyətlə `hyperledger/iroha:dev` konteynerlərini görəcəksiniz. Standart Docker Compose profili dörd həmyaşıd konteynerini ehtiva edir, baxmayaraq ki, yaradılmış `docker-compose.yml` fərqli ola bilər.

2. Logları yoxlayın və `Failed to deserialize raw genesis block` səhvini axtarın. Iroha daemon rejimində `docker compose up -d` ilə başladığınızda, `docker compose logs` əmri istifadə edin.

Belə bir problemin həllinin yolu Iroha istifadəsinə bağlıdır. Bu əsas demo olsa və həmyaşıd məlumatlarını qorumağa ehtiyacınız yoxdursa, uyğun localnet və ya Docker Compose paketini Kagami ilə bərpa edin:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

Sonra köhnə konteyner vəziyyətini çıxarın və bərpa olunan `genesis.signed.nrt`, peer `config.toml` və `client.toml` fayllarından yenidən başlayın.

Iroha instansiyası məlumatlarını bərpa etmək lazımdırsa, aşağıdakıları edin:

1. İkinci Iroha rəqəmini bağlayın ki, bu da ilk (fallast) rəqəmdən məlumatları kopyalayacaqdır.
2. Yeni rəqibin məlumatları ilk rəqiblə sinxronizasiya etməsini gözləyin.
3. Yeni qohumunu aktiv buraxın.
4. Yalnız koordinasiyalı miqrasiyanın bir hissəsi olaraq ilk həmyaşıdın mənşəyi və konfigurasiya fayllarını yeniləyin.

::: məlumat

Canlı şəbəkədə genesi əvəz etmək üçün ümumi avtomatik yenidən yazma yolu yoxdur. Bunu koordinasiya edilmiş bir köçürmə kimi qəbul edin: köhnə vəziyyəti qoruyun, uyğun həmyaşıdları gətirin və təsdiqləyiciləri yalnız operatorlar köçürmə planı barədə razılığa gəldikdən sonra yeni konfigurasiyaya keçirin.

:::

## Xüsusi və ictimai açarların çoxlu-hash formatı {#multihash-format-of-private-and-public-keys}

Əgər baxsanız, [müştərinin konfigurasiyası](/az/guide/configure/client-configuration.md), baxırsınız ki, orada açarlar verilmişdir [Multi-hash formatı](https://github.com/multiformats/multihash).

Əvvəllər multi-hash ilə işləməmisinizsə, sağ tərəfdəki açar baytlarının (bayt başına iki simvol) hexadecimal təmsil edilməsi deyil, daha çox ASCII (və ya UTF-8) kimi kodlanmış baytlar olduğunu qəbul etmək normaldır; Və `public_key` və `private_key` nümunələrində hər iki silsilə əslində `from_hex` çağırın.

Bir də təbiidir ki, `PrivateKey::try_from_str` çağırmaq yalnız düzgün açar verəcəkdir.

Təəssüflər olsun ki, səhv mesajları bu cür uğursuzluqların aradan qaldırılmasına kömək etmir.

Bunu necə düzəltmək olar: `hex_literal` istifadə edin. Bu da çirkin bir simvol silsiləni açıq-aşkar hexadecimal saylardan ibarət gözəl kiçik bir cədvələ çevirəcəkdir.

::: xəbərdarlıq

Hətta `try_from_str` tətbiqi verilən bir silsiləyin etibarlı `PrivateKey` olub olmadığını yoxlaya bilməz və əgər yoxdursa sizi xəbərdar edə bilməz.

Bu, bəzi açıq səhvləri ələ keçirəcəkdir, məsələn, əgər silsilədə etibarsız bir simvol varsa. Bununla birlikdə, bir çox açar formatını dəstəkləməyi hədəf qoyduğumuz üçün başqa heç bir şey edə bilməz.

:::

Bu cür incə səhvlərin qarşısını almaq olar, məsələn, birbaşa string literallarından deseriallaşdırmaqla və ya mənalı olduğu yerlərdə yeni bir açar cütü yaratmaqla.
