---
translation_locale: az
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hesablar {#accounts}

Hesab, əməliyyatları imzalaya bilən və öz kitabının dövlətinin sahibi olan bir orqandır. Hal-hazırda Iroha 3 məlumat modelində `AccountId` kanonik və domensizdir: hesab nəzarətçisindən alınır və kanonik olaraq I105 kimi kodlanır. İnsan oxuya bilən domen və məlumat məkanı kontekstinin ayrı hesab-alias bağlamalara aiddir.

## Struktura {#structure}

qeydiyyatdan keçmiş `Account` əlamətləri aşağıdakılardır:

- `id`: kanonik `AccountId`
- `metadata`: keyfiyyətli hesab metadataları
- `label`: seçməli sabit əlifba
- `uaid`: Nexus axınlarında istifadə olunan fakultativ Universal Hesabı ID
- `opaque_ids`: Hesabın UAID hesabına bağlanmış qeyri-şəffaf identifikatorlar

Hesabın yaradılması üçün istifadə olunan əməliyyat pay yükü `NewAccount`dir. O, qeydiyyatdan keçmiş hesabda istifadə edilən eyni şəxsiyyət, meta məlumatlar, etiket, UAID və qeyri-aşkar ID sahələrini daşıyır.

`uaid` Kanoniki əlavə edir `AccountId`; Bu, əvəz etmir. Nexus xidmətin verilənlər sahələrində sabit bir istifadəçi və ya təşkilat idarəçiliyinə, məxfiliyini qorumağa ehtiyacı var. İndirmə vaxtı bir-birlə əlaqə saxlayır UAID- hesabla indeks, qeyri-aşkar identifikatorların bir vasitə ilə əlavə edilməsi tələb olunur UAID, və ikili və ya toqquşma qeyri-şəffaf identifikatorları rədd edir. [FHE və UAID](/az/blockchain/sora-nexus-services.md#fhe-and-uaid) üçün Nexus xidmət qatı axını.

## Hesab nəzarətçiləri {#account-controllers}

Controller hesabın hərəkətlərə necə icazə verdiyini təyin edir. Varsayılan müştəri axını bir Ed25519 açar cütündən istifadə edir, lakin məlumat modeli həmçinin çox imza siyasət nəzarətçiləri kimi daha zəngin nəzarətçiləri dəstəkləyir.

Müştəri konfigurasiyası imzalanma səlahiyyətini həmkar konfigurasiyasından ayrı saxlayır:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Mövcud açar formatları üçün [client konfigurasiyasına](/az/guide/configure/client-configuration.md) və [key generation](/az/guide/security/generating-cryptographic-keys.md) baxın.

## Taira üzərində sınayın. {#try-it-on-taira}

İctimai Taira testnetdən bir neçə kanonik hesabı IDs göstərin:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Hesab aktivlərini yoxlamaq üçün hesabı kopyalayın. ID ilk zəngdən və URL- Yolda yerləşdirmədən əvvəl kodlaşdırın. Python snippet ilk siyahıya alınmış hesab üçün belə edir:

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

Hesabın yaradılması və ya yenilənməsi imzalanmış bir əməliyyatdır və faucet maliyyələşdirilməsi tələb olunur Taira təsvir edilən quruluş [Bağlantı SORA Nexus Məlumat sahələri](/az/get-started/sora-nexus-dataspaces.md).

## qeydiyyat və icazələr {#registration-and-permissions}

Hesablar ümumi [`Register` və `Unregister`](/az/blockchain/instructions.md#un-register) təlimatları ilə qeydiyyatdan keçirilir və qeydiyyata alınmır. Aktiv icra vaxtının təsdiqçisi hesabları kimin yarada biləcəyini və hansı icazə simvollarının və ya rolların tələb olunduğunu müəyyənləşdirir.

Hesab qeydiyyatdan sonra aşağıdakıları edə bilər:

- əməliyyatları imzalamaq
- aktivləri saxlamaq
- öz domenləri
- rolları və icazə simvollarını qəbul etmək
- Metadata saxlamaq
- Bu xüsusiyyətləri aktivləşdirildikdə, alias, rekey, bərpa və Nexus kimlik axınlarında iştirak edin.

## Kimlik problemlərinin həlli {#troubleshooting-identity-issues}

Əgər bir əməliyyat gözlənilməz olaraq rədd edilirsə, yoxlayın ki:

- Müştəri ictimai açarı imzalanmaq üçün istifadə olunan özəl açarına uyğun gəlir.
- Hesabın başlanğıcda və ya öhdəlik götürülmüş bir əməliyyatla qeydiyyatdan keçirilməsi
- orqanın təlimatda tələb olunan icazələri var
- sərt hesab sahələrində kanonik I105 hesabı ID istifadə olunur, oxuna bilən adlar isə aktiv hesab-alias bağlayıcı vasitəsilə həll edilir.

Həmçinin bax:

- [İzinlər](/az/blockchain/permissions.md)
- [Metadata](/az/blockchain/metadata.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [SORA Nexus məlumat sahələri](/az/get-started/sora-nexus-dataspaces.md)
