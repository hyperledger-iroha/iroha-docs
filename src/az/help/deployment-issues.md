---
translation_locale: az
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İstifadəçi problemlərinin həlli {#troubleshooting-deployment-issues}

Bu bölmədə Iroha 3 tətbiqləri üçün problemlərin aradan qaldırılması məsləhətləri təqdim olunur. Başınıza gələn problem burada təsvir edilmirsə, [Telegram](https://t.me/hyperledgeriroha) vasitəsilə bizə müraciət edin.

## Yaradılmış əşyalarla başlayın. {#start-with-generated-artifacts}

Yerli və sınaq tətbiqləri üçün Kagami tərəfindən istehsal olunan sənədləri əl yazılı dosyalar əvəzinə üstün tutun:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

İstehsal edilən dizayn həmyaşıd konfiqurasiyaları, genesis materialı, başlanğıc skriptləri və README üçün bir Iroha 3 tikinti xəttini ehtiva edir.

## Tərəfdaş başlamır {#peer-does-not-start}

Əvvəlcə bu maddələri yoxlayın:

- `irohad --config <path>` tərəfdaşın özünün TOML sənədindəki nöqtələr.
- `public_key` və `private_key` eyni düymədəki açar cütlüyünə aiddir.
- `genesis.public_key` genesis əməliyyatının imzalanması üçün istifadə olunan açığa uyğun gəlir.
- Validator həmyaşıllı kimlikləri BLS-Normal açarlardan istifadə edir və `trusted_peers_pop` yerli açar və etibarlı həmyaşıllar üçün mülkiyyət sübutunu göstərən girişlər ehtiva edir.
- Torii və P2P üçün limanlar artıq başqa bir proseslə bağlanılmır.
- Kura mağaza direktoru eyni zəncirə aiddir və fərqli bir şəbəkə profilindən kopiyalanmayıb.

Daemon birdən çox TOML təbəqə oxuduqda konfig tracing istifadə edin:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker və Compose {#docker-and-compose}

Yaradın Hələlik Kagami localnet çıxışı ilə tərtib edin ki, əmr xətti argumentləri və konfiqurasiya faylları yoxlanılan kodla uyğunlaşsın:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Əgər kompost tətbiqi başlayırsa və sonra dayandırılırsa, daemon loglarını yoxlayın:

- uyğunsuz `chain`
- fərqli bir genesis əməliyyatını və ya manifestini istifadə edən bir həmyaşıd
- Yalnız konteyner şəbəkəsi daxilində işləyən P2P ünvanları reklam olunur
- Yerli həcmin bərpa edilmədən sonra təkrar istifadəsi

Yeni bir genesis sınaqdan keçirərkən, yığın yenidən başlamadan əvvəl köhnə Kura həcmləri çıxarın. Köhnə blokların saxlanılması yeni bir cinslə oynamağın uğursuzluğuna səbəb olacaq.

## Kubernetlər {#kubernetes}

Kubernetes üçün hər bir təsdiqləyici dövlətli infrastruktur kimi qəbul edin:

- Hər bir rəqibə sabit kimlik açarı və sabit davamlı həcmi verin.
- P2P ünvanlarını açıqlayın ki, digər həmyaşıdlar qrupun daxilində həll edə bilərlər.
- Yükləmə üçün dəyişməz yığma kimi konfig və genesis fayllarını quraşdırın.
- Bütün genesis və ya topoloji dəyişiklikləri avtomatik bir quruluş xəritəsinin yeniləməsi kimi yox, bilə-bilə həyata keçirmək

Əgər bir pod dəfələrlə yenidən başlanırsa, modeldə göstərilən konfiqurasiyanı gözlənilən [`peer.template.toml`](/az/reference/peer-config/index.md#template) ilə müqayisə edin və həmyaşıdların köhnə Kura məlumatları oynadıqlarını yoxlayın.

## Sora profili {#sora-profile}

Nexus, SoraFS və ya çox yollu axınlardan istifadə edən Iroha 3 yerləşdirmələr Sora profilinin aktivləşdirilməsi ilə daemonı başlatmalıdır:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Eyni şəbəkədəki təsdiqləyicilər arasında ardıcıl olaraq eyni profildən istifadə edin.
