---
translation_locale: az
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Yerləşdirmə Problemlərinin Həlli {#troubleshooting-deployment-issues}

Bu bölmə Iroha 3 yerləşdirmələri üçün problem həll etmə məsləhətləri təklif edir. Əgər yaşadığınız problem burada təsvir edilməyibsə, bizə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə müraciət edin.

## Yaradılmış artefaktlarla başlayın {#start-with-generated-artifacts}

Yerli və test yerləşdirmələri üçün, əl ilə yazılmış şəbəkə həmkarı faylları əvəzinə Kagami tərəfindən yaradılan artefaktları üstün tutun:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaradılan kataloq şəbəkə həmkarı konfiqurasiyalarını, blockchain başlanğıc materiallarını, başlanğıc skriptlərini və Iroha 3 quruluş xətti üçün README-i ehtiva edir.

## şəbəkə bərabəri başlamır {#peer-does-not-start}

Əvvəlcə bu əşyaları yoxlayın:

- `iroha3d --config <path>` şəbəkə qonşusunun öz TOML faylına işarə edir.
- `public_key` və `private_key` şəbəkə həmkarı konfiqurasiyasında eyni açar cütünə aiddir.
- `genesis.public_key` blokçeyn başlanğıc əməliyyatını imzalamaq üçün istifadə olunan açara uyğundur.
- Təsdiqləyici şəbəkəsi iştirakçı identifikatorları BLS-Normal açarlardan istifadə edir və `trusted_peers_pop` yerli açar və etibarlı şəbəkə iştirakçıları üçün mülkiyyət sübutu daxilolmalarını ehtiva edir.
-  Torii və P2P üçün portlar artıq başqa bir proses tərəfindən tutulmayıb.
- Kura mağaza kataloqu eyni zəncərə aiddir və fərqli şəbəkə profilindən kopyalanmayıb.

Daemon bir TOML qatından çox oxuyanda konfiqurasiya izləməsindən istifadə edin:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker və Yarat {#docker-and-compose}

Cari Kagami localnet çıxışından Compose yaradın ki, əmr sətiri arqumentləri və konfiqurasiya faylları çıxarılmış kod ilə uyğun olsun:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Əgər bir compose yerləşdirilməsi başlayır və sonra dayanırsa, daemon qeydlərini yoxlayın:

- uyğunsuz `chain`
- fərqli bir blokçeyn əsas əməliyyatı və ya texniki manifesto istifadə edən bir şəbəkə həmkarı
- reklamı verilmiş P2P ünvanlar yalnız konteyner şəbəkəsi daxilində işləyir
- blokçeyn başlanğıcını yenidən yaratdıqdan sonra yerli həcm təkrar istifadəsi

Yeni bir blockchain genesisini sınaqdan keçirərkən, yığın yenidən başlamazdan əvvəl köhnə Kura həcmləri silin. Köhnə blok saxlamağı yeni blockchain genesis ilə saxlamaq təkrar oynatma uğursuz olacaq.

## Kubernetes {#kubernetes}

Kubernetes üçün hər bir doğrulayıcıya vəziyyətli infrastruktur kimi yanaşın:

- hər bir şəbəkə iştirakçısına sabit identifikasiya açarı və sabit davamlı həcm verin
- klaster daxilindən digər şəbəkə həmkarlarının həll edə biləcəyi P2P ünvanlarını açmaq
- Rolauta üçün dəyişdirilməz konfiqurasiya kimi montaj konfiqurasiyası və blokçeyn genesis faylları
- bütün blokçeyn başlanğıc və ya topologiya dəyişikliklərini avtomatik konfiqurasiya xəritəsi yeniləməsi kimi deyil, qəsdən tətbiq edin

Əgər pod təkrar-təkrar yenidən başlasa, poddakı yaradılmış konfiqurasiyanı gözlənilənlə müqayisə edin [`peer.template.toml`](/az/reference/peer-config/index.md#template) və şəbəkə iştirakçısının köhnə məlumatları təkrar oynadığını yoxlayın Kura məlumat.

## Sora profili {#sora-profile}

Şəxsi və ya yerli Iroha 3 yerləşdirmələrində Nexus, SoraFS və ya çox zolaqlı axınlardan istifadə edildikdə, standart daemon Sora profili aktivləşdirilmiş şəkildə başlamalıdır:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Eyni şəbəkədəki doğrulayıcılar arasında eyni profildən ardıcıl istifadə edin.

İctimai Taira doğrulayıcılar xüsusi işə salıcını istifadə edirlər, bu da Taira-in dəqiq zənciri, siyahısı, deaktiv edilmiş daxili-SoraFS yaddaşı və işləmə vaxtı imzalayıcı profilini tətbiq edir. Başlamazdan əvvəl işlənmiş Taira konfiqurasiyanı doğrulayın:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

İctimaiyyəti başlamayın Taira ümumi tipli doğrulayıcı `iroha3d`; görmək [`iroha3d` CLI istinad](/az/reference/iroha3d-cli.md) tələb olunan profil üçün.
