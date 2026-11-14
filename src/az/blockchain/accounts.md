---
translation_locale: az
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Hesablar {#accounts}

Hesab əməliyyatları imzalaya və reyestr vəziyyətinə sahib ola bilən səlahiyyət sahibidir. Hazırkı Iroha 3 məlumat modelində `AccountId` kanonikdir və domen daşımır: hesabın nəzarətçisindən törədilir və [I105](/az/reference/i105.md) kimi kanonik şəkildə kodlanır. İnsanların oxuya bildiyi domen və məlumat məkanı konteksti ayrıca hesab ləqəbi bağlamalarına aiddir.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Account` aşağıdakıları ehtiva edir:

- `id`: tək protokol-standart `AccountId`
- `metadata`: ixtiyari hesab metadatası
- `label`: isteğe bağlı sabit ləqəb
- `uaid`: SORA Nexus axınlarında istifadə olunan, məcburi olmayan Universal Hesab ID-si
- `opaque_ids`: hesabın UAID ilə bağlı şəffaf olmayan identifikatorlar

Hesab yaratmaq üçün istifadə olunan əməliyyat yükü `NewAccount` şəklindədir. O, qeydiyyatdan keçmiş hesab tərəfindən istifadə olunan eyni şəxsiyyət, metaveri, etiket, UAID və qeyri-şəffaf ID sahələrini daşıyır.

`uaid` kanonik `AccountId`-ni tamamlayır, onu əvəz etmir. SORA Nexus xidmətlərinə məlumat məkanları arasında sabit istifadəçi və ya təşkilat identifikatoru, məxfiliyi qoruyan qeydiyyat və ya xidmət imkanlarının axtarışı lazım olduqda ondan istifadə edin. İcra mühiti UAID ilə hesab arasında birə-bir uyğunluq indeksini saxlayır, qeyri-şəffaf identifikatorların UAID vasitəsilə bağlanmasını tələb edir və təkrarlanan və ya toqquşan qeyri-şəffaf identifikatorları rədd edir. SORA Nexus xidmət səviyyəsinin axını üçün [FHE və UAID](/az/blockchain/sora-nexus-services.md#fhe-and-uaid) bölməsinə baxın.

## Hesab nəzarətçiləri {#account-controllers}

Kontroller hesabın hərəkətləri necə təsdiqləyəcəyini müəyyən edir. Əsas müştəri axını Ed25519 açar cütündən istifadə edir, lakin məlumat modeli həmçinin çox imzalı siyasət kontrollerləri kimi daha zəngin kontrollerləri də dəstəkləyir.

Müştəri konfiqurasiyası imzalama səlahiyyətini şəbəkə yoldaşı konfiqurasiyasından ayrıca saxlayır:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

Cari açar formatları üçün [müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md) və [açarin yaradılması](/az/guide/security/generating-cryptographic-keys.md)-ə baxın.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai Taira testnet-dən bir neçə tək protokol-standart hesab ID-lərini siyahıya alın:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

Hesab aktivlərini yoxlamaq üçün, ilk texniki çağırışdan bir hesab ID-sini kopyalayın və yolu daxil etməzdən əvvəl onu URL-kodlayın. Bu Python parçası siyahıda ilk olan hesab üçün bunu edir:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Bunlar açıq oxuma əməliyyatlarıdır. Hesabın yaradılması və ya yenilənməsi imzalanmış əməliyyatdır və [Taira və Minamoto ilə SORA Nexus üzərində tətbiq hazırlamaq](/az/get-started/sora-nexus-dataspaces.md) bölməsində təsvir olunan, test vəsaiti paylama xidməti vasitəsilə maliyyələşdirilmiş Taira quruluşunu tələb edir.

## Qeydiyyat və icazələr {#registration-and-permissions}

Hesablar ümumi ilə qeydiyyatdan keçirilir və qeydə alınmır [`Register` və `Unregister`](/az/blockchain/instructions.md#un-register) təlimatlar. Aktiv proqram təminatının icra mühiti yoxlayıcısı qərar verir hesabları kim yarada bilər və hansı icazə tokenləri və ya rollar tələb olunur.

Qeydiyyatdan sonra hesab edə bilər:

- əməliyyatları imzalamaq
- aktivləri saxlamaq
- öz domenlər
- rol və icazə tokenlərini almaq
- metadataları saxlamaq
- müvafiq funksiyalar aktiv olduqda ləqəb, açarın dəyişdirilməsi, bərpa və SORA Nexus identifikasiya axınlarında iştirak etmək

## Şəxsiyyət problemlərinin aradan qaldırılması {#troubleshooting-identity-issues}

Əgər əməliyyat gözlənilmədən rədd olunarsa, yoxlayın ki:

- müştərinin açıq açarı imzalamaq üçün istifadə olunan şəxsi açarla uyğundur
- hesab blockchain başlanğıcında və ya yekunlaşdırılmış əməliyyatla qeydiyyatdan keçib
- avtorizasiya prinsipi təlimatın tələb etdiyi icazələrə malikdir
- sıx hesab sahələri tək protokol-standart I105 hesab ID-sindən istifadə edir, oxunaqlı adlar isə aktiv hesab-əlavə bağlaması vasitəsilə həll olunur

Bax həmçinin:

- [İcazələr](/az/blockchain/permissions.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [SORA Nexus məlumat məkanları](/az/get-started/sora-nexus-dataspaces.md)
