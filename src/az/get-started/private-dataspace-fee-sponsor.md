---
translation_locale: az
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Şəxsi Verilənlər Məkanı üçün Sponsor Haqları {#sponsor-fees-for-a-private-dataspace}

Ödəniş sponsorluğu istifadəçilərə XOR saxlamadan özəl məlumat-məkan əməliyyatlarını təqdim etməyə imkan verir. İstifadəçi hələ də əməliyyatı imzalayır. Əməliyyatın metadatası sponsor hesabına işarə edir və proqram təminatı icra mühiti şəbəkə ödənişi üçün sponsorun XOR balansından məbləği çıxır.

İnteqrasiya üç hərəkətli hissədən ibarətdir:

1. düyün ödəniş sponsorluğuna imkan verir
2. sponsor hesabı mövcuddur və XOR-a malikdir
3. hər istifadəçinin həmin sponsor üçün `CanUseFeeSponsor` var

Bundan sonra, hər bir sponsorlu istifadəçi əməliyyatı yalnız bu metadata məlumatlarını tələb edir:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Bu səhifə iki ümumi nümunəni göstərir:

- Pulsuz istifadəçi yazır: sponsor XOR ödəyir və istifadəçi heç nə ödəmir.
- Yerel-token ödənişləri: istifadəçi sponsoru bir tətbiq tokenində ödəyir və sponsor şəbəkəyə XOR ilə ödəyir.

Əvvəlcə Taira və ya xüsusi test şəbəkəsindən istifadə edin. Yeni xüsusi verilənlər sahəsi operator və idarəetmə dəyişiklikləridir; müştəri konfiqurasiyası ilə yaradılmır.

## Nümunə Dəyərlər {#example-values}

Aşağıdakı əmrlər bu yer tutuculardan istifadə edir:

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

Eyni hesablar üçün aktiv hesab ləqəbləriniz yoxdursa, tək protokol-standart I105 hesab ID-lərindən istifadə edin.

## 1. Verilənlər məkanını hazırlayın {#_1-prepare-the-dataspace}

Təsvir olunan şəxsi məlumat məkanları kataloqu və yönləndirmə işindən başlayın [Qoşul SORA Nexus Məlumat məkanları](/az/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Operatora yönəlmiş fraqment bu cür görünür:

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

- şəxsi icra zolağı `/status` düyünü cavabında görünür
- İstifadəçi hesabları sizin şəxsi onboarding prosessiniz tərəfindən qəbul edilir
- sponsor hesabı mövcuddur
- XOR ödəniş aktivi və ödəniş boşaldıcı hesab şəbəkədə etibarlıdır

## 2. Məlumat məkanında aktivləri qeydiyyatdan keçirin {#_2-register-assets-in-the-dataspace}

İstifadəçilərin xüsusi məlumat sahəsində saxlayacağı aktiv təriflərini onları tətbiq məntiqinə qoşmazdan əvvəl qeyd edin. Yerli-token ödəniş nümunəsi üçün dərslik `usage#billing.team` istifadə edir:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Əvvəlcə domeni və aktiv ad məkanına sahib olan SNS icarəni qurun. `$BILLING_DOMAIN` üçün gizlisiz `AliasSetupPlanRequestV1` niyyət yaradın, bura rəqəmsal `team` məlumat sahəsi ID-si, tək protokol-standart sahibi, icarə müddəti və cari təklif qoruyucu daxildir:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Sonra aktiv təyinatını qeydiyyatdan keçirin. Tək protokol-standart `--id` şəbəkə səviyyəsində aktiv təyinatı ID-sidir. Ləqəb isə inkişaf etdiricilər və son istifadəçilərin dataspace kodunda istifadə etməli olduğu şeydir:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

yerli tokeni istifadəçiyə qeydiyyat zamanı vermək və ya keçirmək:

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

Dataspace-də tətbiq aktivləri üçün eyni naxışdan istifadə edin. Hər token üçün bir aktiv tərifi qeydiyyatdan keçirin, hər birinə dataspace ləqəbi verin və SDK kodundan birmənalı protokol-standart aktiv tərifi ID-lərini sərt kodlaşdırmaq əvəzinə ləqəbə istinad edin.

## 3. İstifadəçi Ləqəblərini Qeydiyyatdan Keçirmək {#_3-register-user-aliases}

Hesablar hələ də tək protokol-standart I105 hesab identifikatorlarıdır. İstifadəçi qarşılıqlı adlar hesab ləqəbləridir və ləqəblər həssas olmayan idarələr olmalıdır. məsələn, `alice@team` və ya `alice@members.team`. Telefon nömrələrini və ya e-poçt ünvanlarını ləqəb kimi istifadə etməyin. Bunlar növbəti bölmədəki şəxsi tanımlayıcı axınında aiddir.

Alias qurulumu, domen qurulması ilə eyni bəyanedici planlayıcıdan istifadə edir. SDK və ya onboarding xidməti, hesab-alias girişi hədəfləyən gizli olmayan `AliasSetupPlanRequestV1` niyyəti yaratmalıdır `$USER`, əsas rolu seçir, rəqəmsal məlumat sahəsi ID-sini pinləyir və cari icarə haqqı-qiymət yoxlama qoruyucusunu daşıyır. Sonra onu bir atomik əməliyyat kimi planlaşdırın və tətbiq edin:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Əgər istifadəçi XOR-ı ödəməməlidirsə, təsdiqlənmiş sponsor-məlumatlı qeydiyyat xidmətindən istifadə edərək quraşdırma əməliyyatını hazırlayıb təqdim edin. İcarə götürmə və alias bağlama əməliyyatlarını müstəqil tətbiq əməliyyatlarına bölməyin.

Ləqəb bağlandıqdan sonra onu CLI vasitəsilə yoxlayın:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Yeni hesab yaradılması üçün, sabit `uaid` ilə `NewAccount` yaradan və lazım olduqda ilkin `label` təmin edən onboarding xidmətini seçin. Sadə `ledger account register --id` əmri yalnız tək protokol-standart hesab ID-ni qeyd edir.

## 4. Telefon və E-poçtu FHE ilə Şəxsi Qeydiyyatdan Keçirin {#_4-register-phone-and-email-privately-with-fhe}

Telefon nömrələrini və elektron poçt ünvanlarını ictimai təxəllüslər deyil, şəxsi tanıtıcı iddialar kimi istifadə edin. FHE-dəstəklənmiş axın xam tanıtıcıları hesab təxəllüslərindən, əməliyyat metadata-sından və dünya vəziyyətindən kənarda saxlayır:

1. operator telefon və e-poçt üçün [RAM-LFE/FHE proqram siyasəti](/az/blockchain/ram-lfe.md) qeyd edir
2. operator `phone#team` və `email#team` kimi aktiv identifikator siyasətləri qeyd edir
3. pulqabı telefonu və ya e-poçtu yerli olaraq normallaşdırır
4. pul kisəsi şifrələnmiş dəyəri həll ediciyə göndərir
5. resolver `IdentifierResolutionReceipt` qaytarır
6. istifadəçi protokol nəticəsi qeydi ilə `ClaimIdentifier`-ı təqdim edir
7. zəncir xam telefon və ya e-poçt dəyəri deyil, qeyri-şəffaf identifikator və protokol nəticəsi qeydi kriptoqrafik xəşini saxlayır

Operator tərəfi siyasət qurğusu SDK və ya xidmət tapşıırığıdır. Hər identifikator növü üçün bu təlimat cütlərini hazırlayın və təqdim edin:

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

E-poçt üçün bunu təkrarla:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Əməkdaşlıq prosesində, cüzdan və ya backend yerli səviyyədə normalizasiya etməlidir:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8-ci addımda sponsor metadata faylı yaradıldıqdan sonra, həmin metadata ilə istifadəçi tərəfindən imzalanmış iddia təlimatını təqdim edin:

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

Cari CLI bu şəxsiyyət təlimatları üçün tipli əmrləri açmır. SDK ilə ardıcıl `InstructionBox` dəyərləri yaradın və onları `ledger transaction stdin` vasitəsilə təqdim edin:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Onboarding xidmətində bu qoruyucu çəpərləri qoruyun:

- hesab ləqəbləri yalnız insan tərəfindən oxuna bilən ünvanlardır
- xam telefon və e-poçt dəyərləri heç vaxt təxəllüslərdə, metadatalarda, jurnallarda və ya əməliyyat yükündə görünmür
- hesabın özəl identifikatorlar tələb etməzdən əvvəl `uaid` var
- protokol nəticə qeydləri `policy_id`, `opaque_id`, `uaid`, `account_id` və son istifadə tarixi ilə bağlanır
- resolver açarları və gizli-proqram kriptoqrafik öhdəlik dəyərləri idarəetmə tərəfindən nəzarət olunur

## 5. Nodda Sponsorluğu Aktivləşdirin {#_5-enable-sponsorship-on-the-node}

Ödəniş sponsorluğu bir şəbəkə qovşağı/proqram icra mühiti siyasətidir. Bunu Nexus ödəniş konfiqurasiyasında aktiv edin:

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

`fee_asset_id` şəbəkə ödənişi aktividir. SORA Nexus üçün bu XOR-dir. Şəbəkəniz tərəfindən göstərilən aktiv XOR ləqəbindən və ya tək protokol-standart XOR aktiv tərifi ID-sindən istifadə edin.

`sponsor_max_fee = "0"` hər bir əməliyyat üzrə sponsor limitinin olmadığını bildirir. İstehsalda, dataspace əməliyyatlarınızın normal ölçüsünü və əməliyyat icra xərci profilini bildikdən sonra sıfır olmayan bir limit təyin edin.

Bu konfiqurasiyanı yenidən başladın və ya adi operator prosesiniz vasitəsilə tətbiq edin.

## 6. Sponsoru Yarat və Maliyyələşdir {#_6-create-and-fund-the-sponsor}

Əgər ehtiyac varsa, sponsor açar cütlüyünü yaradın:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

İctimai açarı şəbəkəniz üçün hesab formatına çevirin:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Sponsor hesabını şəxsi qeydiyyat prosesiniz vasitəsilə qeydiyyatdan keçirin:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Sponsoru xəzinə, tələb hesabı və ya digər maliyyələşdirilmiş hesabdan XOR ilə maliyyələşdirin:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira məşqləri üçün, testnet maliyyələşdirmə xidmət köməkçisini [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən `taira_faucet_claim.py` kimi yadda saxlayın, sonra sponsorunu xəzinə köçürməsi əvəzinə ictimai testnet maliyyələşdirmə xidməti ilə maliyyələşdirin:

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

## 7. İstifadəçiyə Sponsor-a Giriş İcazəsi Verin {#_7-grant-a-user-access-to-the-sponsor}

Sponsor hər bir istifadəçiyə ona ödəniş etmək icazəsini verməlidir. Bu icazə istifadəçilərin təsadüfi sponsor hesablarını adlandırmasının qarşısını alır.

Bunu sponsor hesabı kimi və ya proqram icra mühiti siyasətiniz tərəfindən icazə verilən əməliyyat hesabı kimi işlədin:

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

Xidmətlərə qoşulma üçün bunu normal bir hesab təmin etmə addımı kimi edin və qeyd edin:

- istifadəçi hesabı
- sponsor hesabı
- məlumat sahəsi və ya tətbiq
- təsdiq bileti və ya idarəetmə qərarı

İstifadəçinin icazələrini yoxlamaq üçün:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Sponsor Metadatasını əlavə edin {#_8-attach-sponsor-metadata}

Yenidən istifadə oluna bilən metadata faylı yaradın:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Bu metadatanın daxil edildiyi hər hansı bir yazı sponsor tərəfindən ödənilir:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs üçün imzalanmış əməliyyata eyni əməliyyat metadata obyektini əlavə edin. İstifadəçi əməliyyatı istifadəçinin açarı ilə imzalayır. Sponsor hər istifadəçi əməliyyatını imzalamır, çünki əvvəlki `CanUseFeeSponsor` qrantı icazədir.

## Nümunə 1: İstifadəçilər Heç Bir Ödəniş Etmir {#pattern-1-users-pay-no-fees}

Tətbiq və ya operator bütün şəbəkə ödənişlərini əvəz etdikdə bunu istifadə edin.

Tərtibatçı yoxlama siyahısı:

1. İstifadəçinin normal əməliyyat məlumat yükünü dəyişmədən saxlayın.
2. `fee_sponsor` ilə əməliyyat metadatasını əlavə edin.
3. İstifadəçi olaraq daxil olun.
4. Məxfi məlumat sahəsi marşrutu vasitəsilə təqdim edin.

İstifadəçi hesabının XOR balansına ehtiyacı yoxdur. Sponsor hesabı, konfiqurasiya edilmiş Nexus ödənişlərini ödəmək üçün kifayət qədər XOR saxlamalıdır.

## Nümunə 2: İstifadəçilər Yerli Token ilə Ödəyir {#pattern-2-users-pay-a-local-token}

Bunu istifadə edin, istifadəçilər XOR saxlamamalıdır, amma məlumat sahəsi hələ də daxili tətbiq haqqı, kredit xərci və ya kvota tokeni istəyir.

Bu nümunədə yerli token tətbiq ödənişidir. Bu, şəbəkə ödəniş aktivləri deyil. Sponsor hələ də şəbəkə ödənişini XOR ilə ödəyir.

Məsələn, xüsusi məlumat sahəsində yerli token istifadə edin:

```text
usage#billing.team
```

İstifadəçiləri onboarding, abunəliyin yenilənməsi və ya kvota ayrılması zamanı `usage#billing.team` ilə təmin edin. Sonra istifadəçi əməliyyatını atomik edin:

1. yerli tokenləri istifadəçidən sponsorə köçürmək
2. tələb olunan tətbiq əməliyyatını yerinə yetirin
3. `fee_sponsor` metadatasını daxil edin ki, sponsor XOR ödəsin

Minimal CLI tüstü testi sadəcə XOR tərəfindən sponsorluq edilən lokal-token köçürməsidir:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Həqiqi bir tətbiq üçün, yerli-jeton ödənişini ayrı bir ən yaxşı səy cəhdi olaraq təqdim etməyin. Həm ödənişi, həm də biznes təlimatını ehtiva edən bir imzalı əməliyyat yaradın və ya biznes əməliyyatını tətbiq etmədən əvvəl yerli jetonu toplayan bir müqavilə giriş nöqtəsini təqdim edin.

Çevirim siyasətini tətbiqinizdə və ya müqavilənizdə saxlayın:

- hansı əməliyyat neçə yerli token vahiti başa gəlir
- yerli token axını sponsor XOR yükləmələrinə necə xəritələşdirilir
- istifadəçi balansı çox aşağı olduqda nə baş verir
- sponsor XOR balansı çox aşağı olduqda nə baş verir

::: warning

Sponsorun həmin gas aktivində də ödəniş etməsini istəmirsinizsə, “yerli token haqqı” nümunəsi üçün `gas_asset_id` istifadə etməyin. Cari icra mühitində `fee_sponsor` sponsoru konfiqurasiya edilmiş icra xəttinin gas aktivi üzrə debetlərin də ödəyicisi edir. Yerli tokenlə istifadəçi haqqı toplamaq üçün tokeni köçürmə və ya müqavilə qaydası ilə açıq şəkildə alın.

:::

## Sponsorlu Əməliyyatları Sınaqdan Keçirmək Uğursuz Oldu {#debug-failed-sponsored-transactions}

Ümumi rədd səbəbləri adətən bir çatışmayan quraşdırma addımına işarə edir:

|Səhv mətn|Nəyə baxmalı|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` hələ də nodda `false` vəziyyətindədir. |
| `fee sponsor is not authorized` |İstifadəçinin bu sponsor üçün `CanUseFeeSponsor` yoxdur.|
| `fee asset ... is missing` |Sponsor təyin olunmuş XOR ödəniş aktivinə sahib deyil.|
| `fee balance ... is insufficient` |Sponsorun XOR balansını artırın.|
| `fee exceeds sponsor_max_fee` |Əməliyyat ölçüsünü/qazı artırın `sponsor_max_fee` və ya azaldın.|
| `invalid nexus fee asset id` |`nexus.fees.fee_asset_id` və ya XOR aktiv ləqəbini düzəldin.|

Nümunə 2-ni ayıklayarkən hər iki balansı yoxlayın:

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

## Sponsoru işlədin {#operate-the-sponsor}

Sponsoru xəzinədarlıq hesabı kimi müalicə edin:

- testnet, staging və mainnet üçün ayrı sponsor açarlarını saxlayın
- sponsor XOR balansı qəbul minimal səviyyəsinə çatmazdan əvvəl xəbərdarlıq
- trafik xarakterizə edildikdən sonra sıfırdan fərqli `sponsor_max_fee` limit təyin edin
- tətbiqinizdə və ya keçidinizdə sponsorlu yazılara sürət məhdudiyyəti qoyun
- istifadəçilər dataspaceni tərk etdikdə `CanUseFeeSponsor`-ı ləğv et
- istifadəçi əməliyyatı kriptoqrafik xəşləri, yerli-token ödənişləri və sponsor XOR debetlərini uzlaşdırmaq

İstifadəçi üçün sponsorluğu ləğv et:

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

## Əlaqəli Səhifələr {#related-pages}

- [SORA Nexus Məlumat Məkanlarına qoşul](/az/get-started/sora-nexus-dataspaces.md)
- [Iroha 3-i CLI vasitəsilə işlədin](/az/get-started/operate-iroha-via-cli.md)
- [Aktivlər](/az/blockchain/assets.md)
- [İcazələr](/az/blockchain/permissions.md)
- [İcazə Jetonları](/az/reference/permissions.md)
