---
translation_locale: az
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Özəl məlumat sahəsi üçün sponsor haqqı {#sponsor-fees-for-a-private-dataspace}

Ödəniş sponsorluğu istifadəçilərə XOR saxlamadan şəxsi məlumat məkanı əməliyyatlarını təqdim etməyə imkan verir. İstifadəçi hələ də əməliyyatı imzalayır. Əməliyyat metadataları sponsor hesabına vurulur və icra vaxtı şəbəkə haqqı üçün sponsorun XOR balansını ödəyir.

İnteqrasiya üç hərəkətli hissədən ibarətdir:

1. qovşaq ödəniş sponsorluğunu təmin edir
2. sponsor hesabı mövcuddur və XOR
3. Hər bir istifadəçi üçün bu sponsor üçün `CanUseFeeSponsor`

Bundan sonra, hər sponsorlaşdırılmış istifadəçi əməliyyatı yalnız bu metadata ehtiyac duyur:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Bu səhifədə iki ümumi nümunə göstərilir:

- Pulsuz istifadəçi yazır: sponsor XOR ödəyir və istifadəçi heç bir şey ödəmir.
- Yerli token ödənişləri: istifadəçi sponsorunu bir tətbiq tokenində, sponsor isə şəbəkəni XOR ilə ödəyir.

Əvvəlcə Taira və ya özəl test şəbəkəsindən istifadə edin. Yeni özəl məlumat sahəsi operator və idarəetmə dəyişikliyidir; müştəri konfigurasiyası ilə yaradılmır.

## Misal dəyərləri {#example-values}

Aşağıda göstərilən əmrlərdə bu yer sahibləri istifadə olunur:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

I105 hesabı IDs istifadə edin, əgər sizin yerləşdirməniz eyni hesablar üçün aktiv hesab adları yoxdursa.

## 1. Məlumat sahəsini hazırlayın. {#_1-prepare-the-dataspace}

[da təsvir olunan xüsusi məlumat məkanı kataloqundan və yönümləmə işindən başlayın SORA Nexus Veri məkanlarına bağlanın](/az/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Operatorla üzləşən bir fragment belə görünür:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

İstifadəçi əməliyyatlarına keçməzdən əvvəl yoxlayın ki:

- Xüsusi zolaq `/status` cavabında görünür
- istifadəçi hesabları şəxsi yükləmə axını ilə qəbul edilir
- sponsor hesabı mövcuddur
- XOR ödəniş aktivinin və ödəniş yuvası hesabının şəbəkədə etibarlı olması

## 2. Məlumat sahəsində aktivlərin qeydiyyatına alınması {#_2-register-assets-in-the-dataspace}

Xüsusi məlumat məkanında istifadəçilərin saxlayacaqları aktiv təriflərini tətbiq məntiqinə daxil etməzdən əvvəl qeyd edin. Yerli nömrə haqqı nümunəsi üçün dərslik `usage#billing.team` istifadə edir:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Əvvəlcə aktiv ad sahəsinə sahib olan domen və SNS icarəsini qurun. `$BILLING_DOMAIN` üçün nömrəli `team` məlumat sahəsi ID, kanonik sahibi, icarənin müddəti və cari sitat qoruyucusu daxil olmaqla gizli olmayan `AliasSetupPlanRequestV1` niyyətini yaratın:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Sonra aktiv tərifini qeyd edin. Kanonik `--id` şəbəkə səviyyəli aktiv tərifidir ID. Təsvir edənlər və son istifadəçilər məlumat sahəsi kodunda istifadə etməlidir:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

İstifadəçiyə daxil olunarkən yerli tokenı mint və ya istifadəçiyə ötür:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

İstifadəçinin balansını yoxlayın:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Məlumat sahəsində tətbiq aktivləri üçün eyni nümunədən istifadə edin. Hər bir token üçün bir aktiv tərifini qeyd edin, hər birinə məlumat sahəsi alias verin və sərt kodlaşdırılmış kanonik aktiv tərifinin IDs əvəzinə SDK kodundan olan aliaya müraciət edin.

## 3. İstifadəçi adlarını qeyd edin. {#_3-register-user-aliases}

Hesablar hələ də kanonik I105 hesabı IDs dir. İstifadəçi üzü görən adlar hesab əlifbalarıdır və əlifbalar `alice@team` və ya `alice@members.team` kimi həssas olmayan əl olmalıdır. Telefon nömrələrindən və e-poçt ünvanlarından əlifba olaraq istifadə etməyin. Bunlar növbəti hissədəki şəxsi identifikator axınına aiddirlər.

Alias quruluşu domen quruluşu ilə eyni deklarativ planlaşdırıcıdan istifadə edir. SDK və ya onboarding xidməti hesabı alias giriş hədəfləri `$USER` olan gizli olmayan `AliasSetupPlanRequestV1` niyyətini yaratın, əsas rol seçin, rəqəmsal məlumat boşluğu ID pin edin və cari kirayə quote qoruyucusunu aparın. Sonra onu bir atom əməliyyatı kimi planlaşdırın və tətbiq edin:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

İstifadəçi XOR ödəməməlidirsə, quraşdırma əməliyyatının qurulması və təqdim edilməsi üçün təsdiq edilmiş sponsor məlumatlı onboarding xidmətindən istifadə edin.

Əksi adı bağlandıqdan sonra CLI vasitəsilə yoxlayın:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Yeni hesab yaratmaq üçün `NewAccount` sabit `uaid` və lazım gələrsə, ilkin `label` ilə quraşdırılan bir onboarding xidməti üstün tutun. Sadə `ledger account register --id` komandanı yalnız kanonik hesabı qeyd edir ID.

## 4. Telefonu və e-poçtunu FHE ünvanında gizli olaraq qeyd edin. {#_4-register-phone-and-email-privately-with-fhe}

Telefon nömrələrindən və e-poçt ünvanlarından ictimaiyyət əlifbası deyil, şəxsi identifikator iddiaları kimi istifadə edin. FHE tərəfindən dəstəklənən axın hesab əlifbasından, əməliyyat metadatalarından və dünya vəziyyətindən xam identifikatorlar saxlayır:

1. operator telefon və e-poçt üçün [RAM-LFE/FHE proqram siyasətini ](/az/blockchain/ram-lfe.md) qeydiyyatdan keçirir
2. Operator `phone#team` və `email#team` kimi aktiv identifikator siyasətlərini qeyd edir.
3. cüzdan telefon və ya e-poçtunu yerli olaraq normallaşdırır.
4. cüzdan şifrələnmiş dəyərini həllçiyə göndərir.
5. həllçi bir `IdentifierResolutionReceipt` qaytarır.
6. istifadəçi qəbulu ilə birlikdə `ClaimIdentifier` təqdim edir.
7. zəncir, xam telefon və ya e-poçt dəyərini yox, qeyri-şəffaf bir identifikator və qəbulu hash saxlayır;

Operator tərəfindəki siyasət quruluşu SDK və ya xidmət vəzifəsidir. Hər bir identifikator tipli üçün bu təlimat cütlərini hazırlayın və təqdim edin:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

E-poçt üçün təkrarlayın:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Onboarding zamanı cüzdan və ya arxa hissə yerli olaraq normallaşdırılmalıdır:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Sponsor metadata dosyası 8-ci addımda yaradıldıqdan sonra həmin metadata daxil olmaqla istifadəçinin imzalanmış iddia təlimatı təqdim edin:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

Hələlik CLI bu kimlik təlimatları üçün tiplənmiş əmrləri açıqlamır. SDK ilə seriallaşdırılmış `InstructionBox` dəyərlərini yaratın və onları `ledger transaction stdin` vasitəsilə göndərin:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Bu qoruyucuları yükləmə xidmətində saxlayın:

- Hesab aliasları yalnız insan tərəfindən oxuna bilən əlimlərdir.
- xam telefon və e-poçt qiymətləri heç vaxt aliaslarda, meta məlumatlarda, qeydlərdə və ya əməliyyat payloadlarında görünmür.
- Hesabın özəl identifikatorları iddia etmədən əvvəl `uaid` hesabı var
- Qiymətlərin bağlanması `policy_id`, `opaque_id`, `uaid`, `account_id` və müddəti bitəcək.
- həllçi açarları və gizli proqram öhdəlikləri idarəetmə ilə nəzarət olunur

## 5. Qeydiyyatda sponsorluğu təmin edin {#_5-enable-sponsorship-on-the-node}

Ödəniş sponsorluğu node / runtime siyasətidir. Nexus ödəniş konfigurasında aktivləşdirin:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` şəbəkə haqqı aktividir. SORA Nexus üçün bu, XOR dir. Şəbəkənizin açıqladığı aktiv XOR ya da kanonik XOR aktiv tərifindən istifadə edin ID .

`sponsor_max_fee = "0"` deməkdir ki, hər bir əməliyyat üçün sponsor həddi yoxdur. İstehsalat üçün məlumat məkanının əməliyyatlarının normal ölçüsünü və qaz profilinə sahib olduqdan sonra sıfır olmayan həddini təyin edin.

Bu təyinatı normal operator prosesi ilə yenidən başlatın və ya oynatın.

## 6. Sponsoru yaratmaq və maliyyələşdirmək {#_6-create-and-fund-the-sponsor}

Lazım gələrsə, sponsor açar cütü yaratın:

```bash
kagami keys --algorithm ed25519 --json
```

İctimai açarı şəbəkə üçün hesab formatına çevirin:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Sponsor hesabını öz şəxsi daxilolma axınınız vasitəsilə qeyd edin:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Təsərrüfatdan və ya digər maliyyələşdirilmiş hesabdan sponsorunu XOR ilə təminatlandırın:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira təcrübələri üçün faucet köməkçisini [-dən saxlayın Testnet XOR alın Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-də `taira_faucet_claim.py`, sonra sponsorun maliyyə köçürülməsinin əvəzinə ictimai faucetlə maliyyələşdirilməsi:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Sponsorun XOR balansını yoxlayın:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. İstifadəçiyə Sponsoru tapmaq imkanı verin. {#_7-grant-a-user-access-to-the-sponsor}

Sponsor hər istifadəçiyə ödəniş tələb etmək üçün icazə verməlidir. Xüsusi sponsor hesablarının adlandırılmasının qarşısını verən yardımdır.

Bunu sponsor hesabı kimi və ya iş vaxtı siyasətinə görə icazə verilən əməliyyat hesabı olaraq icra edin:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Onboarding xidmətləri üçün bunu normal hesab təminatı addımına çevirin və qeyd edin:

- istifadəçi hesabı
- sponsor hesabı
- məlumat sahəsi və ya tətbiqi
- təsdiq biletləri və ya idarəetmə qərarı

İstifadəçinin təqaüdlərinin yoxlanması üçün:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Sponsor Metadataları əlavə edin {#_8-attach-sponsor-metadata}

Yenidən istifadə edilə bilən metadata faylını yaratmaq:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Bu meta məlumatlarla təqdim olunan hər hansı bir yazı sponsordan ödənilir:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs üçün imzalanan əməliyyatla eyni əməliyyat metadata obyektini əlavə edin. İstifadəçi əməliyyatı istifadəçinin açarı ilə imzalayır. Sponsor hər bir istifadəçi əməliyyatını imzalamır, çünki əvvəlki `CanUseFeeSponsor` təminat icazədir.

## Şəkil 1: İstifadəçilər pul ödəmirlər {#pattern-1-users-pay-no-fees}

Tətbiq və ya operator bütün şəbəkə ödənişlərini əhatə etdikdə bu istifadə edin.

İnşaatçıların yoxlama siyahısı:

1. İstifadəçinin normal əməliyyat yükünü dəyişmədən saxlayın.
2. `fee_sponsor` ilə əməliyyatın metadatalarını əlavə edin.
3. İstifadəçi kimi imza atın.
4. Xüsusi məlumat məkanı yolu ilə göndərin.

İstifadəçi hesabı XOR balansına ehtiyac duymur. Sponsor hesabı konfigüratsiya edilmiş Nexus ödənişlərini ödəmək üçün kifayət qədər XOR saxlamalıdır.

## Şəkil 2: İstifadəçilər yerli simvol ödəyirlər {#pattern-2-users-pay-a-local-token}

İstifadəçilərin XOR saxlamaması lazım olduğu zaman bunu istifadə edin, lakin məlumat sahəsi hələ də daxili tətbiq haqqı, kredit xərcləri və ya kvot tokenini istəyir.

Bu modeldə yerli token tətbiq ödənişidir. Şəbəkə haqqı aktiv deyil. Sponsor hələ də şəbəkə haqını ödəyir XOR.

Məsələn, özəl məlumat məkanında yerli bir token istifadə edin:

```text
usage#billing.team
```

`usage#billing.team` ilə fond istifadəçiləri onboarding, abunə yeniləməsi və ya kvotanın ayrılması zamanı. Sonra istifadəçi əməliyyat atom:

1. yerli tokenları istifadəçidən sponsoruna köçürmək
2. tələb olunan tətbiq əməliyyatını yerinə yetirmək
3. `fee_sponsor` metadata daxildir ki, sponsor XOR ödəsin.

Minimal CLI duman testi yalnız XOR tərəfindən sponsorlaşdırılan yerli nömrə köçürülməsi:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Real bir tətbiq üçün yerli token ödənişini ayrı ən yaxşı səy əməliyyatı kimi təqdim etməyin. Həm ödənişi, həm də iş təlimatını ehtiva edən imzalanmış bir əməliyyat qurun və ya iş əməliyyatını tətbiq etməzdən əvvəl yerli token toplayan müqavilə giriş nöqtəsini açıqlayın .

Tətbiqinizdə və ya müqavilənizdə dönüşüm siyasəti saxlayın:

- hansı əməliyyat nə qədər yerli token vahidləri xərcləyir
- XOR top-up sponsorluğu üçün yerli token axın xəritələrinin necə aparılması
- istifadəçi balansı çox aşağı olduqda nə olur?
- sponsor XOR balansının çox aşağı olduğu zaman nə olur?

::: xəbərdarlıq

İstifadə etməyin `gas_asset_id` Bu qaz aktivində sponsorun da ödəniş edilməsini istəmirsinizsə, "lokal token haqqı" modelinə görə. `fee_sponsor` Həmçinin sponsor qaz boru kəmərindəki aktivlərin məbləği üçün ödəyicisi hesab olunur. Yerli token istifadəçi ödənişləri üçün, transfer və ya müqavilə qaydaları ilə token açıq şəkildə toplayın.

:::

## İstifadə edilməmiş əməliyyatları düzəltmək {#debug-failed-sponsored-transactions}

Ümumilikdə rədd edilmə səbəbləri ümumiyyətlə bir quraşdırma mərhələsinin çatışmadığını göstərir:

|Xəta mətni |Nəyi yoxlamaq lazımdır?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` hələ də `false` dənədədir. |
|`fee sponsor is not authorized` |İstifadəçinin bu sponsor üçün `CanUseFeeSponsor` pulu yoxdur. |
|`fee asset ... is missing` |Sponsor XOR ödəniş aktivinə sahib deyil. |
|`fee balance ... is insufficient` | Sponsorun pulunu toplayın. XOR bərabərlik. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` artırmaq və ya əməliyyatın ölçüsünü / qazını azaltmaq. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` və ya XOR aktivləri. |

Debugging model 2, hər iki balansları yoxlayın:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Sponsoru idarə edin {#operate-the-sponsor}

Sponsoru xəzinə hesabı kimi qəbul edin:

- testnet, stajlaşdırma və əsas şəbəkə üçün ayrı-ayrı sponsor açarlarını saxlamaq
- sponsorun XOR balansının qəbul mərtəbəsinə çatmasından əvvəl xəbərdarlıq
- Trafik xarakterizə edildikdən sonra sıfırdan kənar `sponsor_max_fee` həddini təyin edin
- Rate-limit sponsorlaşdırılmış yazılar tətbiq və ya girişdə
- istifadəçilər məlumat sahəsindən çıxarkən `CanUseFeeSponsor` ləğv edilir.
- istifadəçi əməliyyatlarının hashlərini, yerli token ödənişlərini və sponsor XOR debitlərini uyğunlaşdırmaq;

İstifadəçi üçün sponsorluğu ləğv etmək:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Əlaqəli səhifələr {#related-pages}

- [SORA Nexus Database](/az/get-started/sora-nexus-dataspaces.md) ilə əlaqə saxlayın.
- [Iroha 3 vasitəsilə CLI](/az/get-started/operate-iroha-via-cli.md) istifadə etmək
- [Əmlaklar](/az/blockchain/assets.md)
- [İzinlər](/az/blockchain/permissions.md)
- [İzin Tokeni](/az/reference/permissions.md)
