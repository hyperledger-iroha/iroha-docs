---
translation_locale: az
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Hesablar {#accounts}

Hesab, əməliyyatları imzalaya bilən və blokçeyn reyestrindəki vəziyyətə sahib ola bilən səlahiyyət sahibidir. Mövcud Iroha 3 məlumat modelində `AccountId` kanonikdir və domen daşımır: o, hesab nəzarətçisindən törədilir və [I105](/az/reference/i105.md) kimi kanonik kodlanır. İnsan tərəfindən oxuna bilən domen və məlumat məkanı konteksti ayrıca hesab ləqəbi bağlamalarına aiddir.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Account` aşağıdakıları ehtiva edir:

- `id`: tək protokol-standart `AccountId`
- `metadata`: ixtiyari hesab metadatası
- `label`: isteğe bağlı sabit ləqəb
- `uaid`: Nexus axınları tərəfindən istifadə edilən seçimli Universal Hesab ID-si
- `opaque_ids`: hesabın UAID ilə bağlı şəffaf olmayan identifikatorlar

Hesab yaratmaq üçün istifadə olunan əməliyyat yükü `NewAccount` şəklindədir. O, qeydiyyatdan keçmiş hesab tərəfindən istifadə olunan eyni şəxsiyyət, metaveri, etiket, UAID və qeyri-şəffaf ID sahələrini daşıyır.

`uaid` kanonik `AccountId`-ni tamamlayır, onu əvəz etmir. Nexus xidmətlərində məlumat məkanları arasında sabit istifadəçi və ya təşkilat identifikatoru, məxfiliyi qoruyan qeydiyyat və ya xidmət imkanlarının axtarışı tələb olunduqda ondan istifadə edin. İcra mühiti UAID ilə hesab arasında bir-bir uyğunluqlu indeks saxlayır, qeyri-şəffaf identifikatorların UAID vasitəsilə qoşulmasını tələb edir və təkrarlanan və ya toqquşan qeyri-şəffaf identifikatorları rədd edir. Nexus xidmət səviyyəsi axını üçün [FHE və UAID](/az/blockchain/sora-nexus-services.md#fhe-and-uaid) bölməsinə baxın.

## Hesab nəzarətçiləri {#account-controllers}

Kontroller hesabın hərəkətləri necə təsdiqləyəcəyini müəyyən edir. Əsas müştəri axını Ed25519 açar cütündən istifadə edir, lakin məlumat modeli həmçinin çox imzalı siyasət kontrollerləri kimi daha zəngin kontrollerləri də dəstəkləyir.

Müştəri konfiqurasiyası imzalama səlahiyyətini şəbəkə yoldaşı konfiqurasiyasından ayrıca saxlayır:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Cari açar formatları üçün [müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md) və [açarin yaradılması](/az/guide/security/generating-cryptographic-keys.md)-ə baxın.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai Taira testnet-dən bir neçə tək protokol-standart hesab ID-lərini siyahıya alın:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
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

Bunlar ictimai oxumalardır. Hesab yaratmaq və ya yeniləmək imzalanmış əməliyyatdır və [SORA Nexus Məlumat Məkanlarına qoşulun](/az/get-started/sora-nexus-dataspaces.md)-da təsvir olunan testnet tərəfindən maliyyələşdirilmiş Taira qurğusunu tələb edir.

## Qeydiyyat və icazələr {#registration-and-permissions}

Hesablar ümumi ilə qeydiyyatdan keçirilir və qeydə alınmır [`Register` və `Unregister`](/az/blockchain/instructions.md#un-register) təlimatlar. Aktiv proqram təminatının icra mühiti yoxlayıcısı qərar verir hesabları kim yarada bilər və hansı icazə tokenləri və ya rollar tələb olunur.

Qeydiyyatdan sonra hesab edə bilər:

- əməliyyatları imzalamaq
- aktivləri saxlamaq
- öz domenlər
- rol və icazə tokenlərini almaq
- metadataları saxlamaq
- bu xüsusiyyətlər aktiv olduqda alias, rekey, bərpa və Nexus kimlik axınlarında iştirak edin

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
