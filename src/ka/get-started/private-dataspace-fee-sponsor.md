---
translation_locale: ka
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# სპონსორის გადასახადები კერძო მონაცემთა სივრცეზე {#sponsor-fees-for-a-private-dataspace}

საფასურიანი სპონსორობა მომხმარებლებს საშუალებას აძლევს შეაგზავნონ კერძო მონაცემთა სივრცეში განხორციელებული ოპერაციები
მეურნეობა XOR. მომხმარებელი ჯერ კიდევ ხელს აწერს ტრანზაქციას.
წერტილები სპონსორის ანგარიშზე, ხოლო გამშვები ვადა სავალდებულოა სპონსორის XOR ბალანსი
ქსელის საფასურისათვის.

ინტეგრაციის სამი მოძრავი ნაწილია:

1. კვანძი იძლევა საფასურის მხარდაჭერას
2. სპონსორის ანგარიში არსებობს და აქვს XOR
3. თითოეულ მომხმარებელმა `CanUseFeeSponsor` ამ მხარდამჭერისათვის

ამის შემდეგ, ყველა სპონსორირებული მომხმარებლის ტრანზაქციას მხოლოდ ეს მეტა მონაცემები სჭირდება:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ამ გვერდზე მოცემულია ორი გავრცელებული ნიმუში:

- **უფასო მომხმარებელი წერს**: მხარდამჭერი იხდის XOR და მომხმარებელი არაფერს იხდის.
- **ადგილობრივი ტოკენების გადასახადები**: მომხმარებელი გადაიხდის სპონსორს აპლიკაციის ტოქნში და
  სპონსორი გადაიხდის ქსელს XOR.

გამოყენება Taira ან კერძო ტესტის ქსელი. ახალი კერძო მონაცემთა სივრცე არის
ოპერატორის და მმართველობის ცვლილება; ის არ არის შექმნილი კლიენტის კონფიგურაციით.

## მაგალითის ღირებულებები {#example-values}

ქვემოთ მოცემული ბრძანებები იყენებს ამ ადგილის მფლობელებს:

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

გამოყენება კანონიკური I105 ანგარიში IDs თუ თქვენს განთავსებას აქტიური ანგარიში არ აქვს
იგივე ანგარიშების საიდუმლოები.

## 1. მოამზადეთ მონაცემთა სივრცე {#_1-prepare-the-dataspace}

დაიწყეთ კერძო მონაცემთა სივრცის კატალოგისა და მარშრუტირების მუშაობა, რომელიც აღწერილია
[შეხება SORA Nexus მონაცემთა ბაზები](/ka/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
ოპერატორისკენ მიმართული ფრაგმენტი ასე გამოიყურება:

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

მომხმარებელთა ტრანზაქციებზე გადასვლამდე შეამოწმეთ, რომ:

- კერძო ბილიკი გამოჩნდება კვანძში `/status` რეაგირება
- მომხმარებელთა ანგარიშები მიიღება თქვენი პირადი ჩართვის ნაკადით
- სპონსორის ანგარიში არსებობს
- დასახელება XOR საფასურის აქტივი და საფასურის გადახდის ანგარიში ქსელში მოქმედებს

## 2. მონაცემთა სივრცეში აქტივების რეგისტრაცია {#_2-register-assets-in-the-dataspace}

დარეგისტრირეთ აქტივების განსაზღვრები, რომლებსაც მომხმარებლები ინახებენ კერძო ფონდში
მონაცემთა სივრცე, სანამ ისინი მიაყვანთ პროგრამის ლოგიკაში. ადგილობრივი ტოქნის საფასური
ნიმუში, მასწავლებელი იყენებს `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

პირველად დააყენეთ დომენი და SNS ქირავდება, რომელიც ფლობს აქტივების სახელის სივრცეს. შექმენით
საიდუმლოების გარეშე `AliasSetupPlanRequestV1` განზრახვა `$BILLING_DOMAIN`, მათ შორის
ციფრული `team` მონაცემთა სივრცე ID, კანონიკური მფლობელი, იჯარის ვადა და მიმდინარე კოტირება
დაცვა:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

მაშინ დაარეგისტრირეთ აქტივის განსაზღვრა. კანონიკური `--id` არის ქსელის დონე
აქტივების განსაზღვრა ID. ანალიზი არის ის, რასაც დეველოპერებმა და საბოლოო მომხმარებლებმა უნდა გამოიყენონ
მონაცემთა სივრცის კოდი:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

ბარათის ან ადგილობრივი ტოქენის გადაცემა მომხმარებლისთვის ჩართვის დროს:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

შეამოწმეთ მომხმარებლის ბალანსი:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

გამოიყენეთ იგივე ნიმუში აპლიკაციის აქტივებისთვის მონაცემთა სივრცეში.
ქონების განსაზღვრა თითოეული ტოქნის მიხედვით, მიეცით თითოეულს მონაცემთა სივრცის ალიას და მიმართეთ
ბმულიდან SDK კოდის ნაცვლად მყარი კოდირების კანონიკური აქტივის განსაზღვრა IDs.

## 3. დარეგისტრირეთ მომხმარებლის ანალიზი {#_3-register-user-aliases}

ანგარიშები კვლავ კანონიურია I105 ანგარიში IDs. მომხმარებლის სახელები ანგარიში
ანალიზი და ანალიზი უნდა იყოს არამგრძნობიარე სახელები, როგორიცაა: `alice@team` ან
`alice@members.team`. არ გამოიყენოთ ტელეფონის ნომრები ან ელ.ფოსტის მისამართები საიდუმლოების სახით.
ეს ფუნქციები კერძო იდენტიფიკატორის ნაკადშია შემდეგი განყოფილების.

ალიასის დაყენება იყენებს იმავე დეკლარაციულ დაგეგმვას, როგორც დომენის დაყენება. SDK ან
გაერთიანების სერვისი შექმნას საიდუმლო-სასარგებლო `AliasSetupPlanRequestV1` რომლის განზრახვა
ანგარიშზე შესვლის მიზნები `$USER`, აირჩევს პირველ როლს, აწევს ნომერი
მონაცემთა სივრცე ID, და ატარებს მიმდინარე იჯარის შეთავაზების დაცვას. შემდეგ დაგეგმეთ და გამოიყენოთ იგი
ერთი ატომური ტრანზაქციის სახით:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

თუ მომხმარებელს არ უნდა გადაიხადოს XOR, გამოიყენეთ დამტკიცებული მხარდამჭერის ინფორმირებული ჩართვა
მომსახურება კონსტრუქციის შესაქმნელად. არ გაიყოთ იჯარის გარიგება
შეძენა და ანალიზი, რომელიც აკავშირებს დამოუკიდებელი განაცხადის ტრანზაქციებში.

მას შემდეგ, რაც საიდუმლო სახელია დაკავებული, შეამოწმეთ იგი CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

ახალი ანგარიშის შექმნისთვის, უპირატესობა მიენიჭოს ინბორდინგ სერვისს, რომელიც ქმნის
`NewAccount` სათავსო `uaid` და, თუ საჭიროა, საწყისი `label`. სააგენტო
მარტივი `ledger account register --id` ბრძანება რეგისტრირებს მხოლოდ კანონიკურ
ანგარიში ID.

## 4. დარეგისტრირეთ ტელეფონი და ელ.ფოსტი პირად FHE {#_4-register-phone-and-email-privately-with-fhe}

გამოიყენეთ ტელეფონის ნომრები და ელ.ფოსტის მისამართები, როგორც პირადი იდენტიფიკაციის მოთხოვნები, არა საჯარო
ალიასები. FHE-გამოჭრილმა ნაკადებმა არ შეაჩერა ნედლეული იდენტიფიკატორები ანგარიშის საიდუმლოებისგან,
ტრანზაქციის მეტა მონაცემები და მსოფლიო მდგომარეობა:

1. ოპერატორი რეგისტრირებს
   [RAM-LFE/FHE პროგრამის პოლიტიკა](/ka/blockchain/ram-lfe.md) სატელეფონო და ელექტრონული ფოსტისათვის
2. ოპერატორი რეგისტრირებს აქტიურ იდენტიფიცირების პოლიტიკას, როგორიცაა: `phone#team` და
   `email#team`
3. საფულე ნორმალიზებს ტელეფონს ან ელ.ფოსტს ადგილობრივად
4. საფულე გზავნის დაშიფრებულ ღირებულებას გადამწყვეტზე
5. გადამწყვეტი ბრუნდება `IdentifierResolutionReceipt`
6. მომხმარებელი წარადგენს `ClaimIdentifier` ქვითრის თანხა
7. ქსელი ინახავს არაგამჭვირვალე იდენტიფიკატორის და ქვითრის ჰაშს, არ არის ნედლეულის ტელეფონი ან
   ელ.ფოსტის ღირებულება

ოპერატორის მხრიდან პოლიტიკის განსაზღვრა SDK ან მომსახურების ამოცანა. შექმნა და წარდგენა
ამ ინსტრუქციის წყვილები თითოეული იდენტიფიკატორის ტიპისათვის:

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

გაიმეორეთ ელ.ფოსტის მისაღებად:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

ჩართვის დროს, საფულე ან უკანა მხარე უნდა ნორმალიზდეს ადგილობრივად:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

მას შემდეგ, რაც მხარდამჭერი მეტა მონაცემების ფაილი შეიქმნება ნაბიჯში 8, წარადგინეთ მომხმარებლის მიერ ხელმოწერილი
მოთხოვნის ინსტრუქცია ამ მეტა მონაცემებით:

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

მიმდინარე CLI არ ასახავს ამ იდენტობისთვის დაწერილი ბრძანებები
ინსტრუქციები. გენერირება სერიული `InstructionBox` ღირებულებები SDK და
წარუდგინოს ისინი `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

ამ საფარის დაცვა შეინახეთ ჩასვლის სერვისში:

- ანგარიშის საიდუმლოები არის მხოლოდ ადამიანის მიერ წაკითხული სახელები
- ნედლეული ტელეფონის და ელ.ფოსტის ღირებულებები არასოდეს გამოჩნდება aliases, metadata, logs, ან
  ტრანზაქციების სასარგებლო ტვირთები
- ანგარიშს აქვს `uaid` სანამ კერძო იდენტიფიკატორების მოთხოვნა
- ქირავდება კრედიტები `policy_id`, `opaque_id`, `uaid`, `account_id`, და ვადის ამოწურვა
- მრეზოლერების გასაღები და დამალული პროგრამის ვალდებულებები კონტროლდება მმართველობით

## 5. ჩართეთ სპონსორობა კვანძზე {#_5-enable-sponsorship-on-the-node}

საფასურის მხარდაჭერა არის კვანძის/სამუშაო დროის პოლიტიკა. Nexus საფასურის კონფიგურაცია:

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

`fee_asset_id` არის ქსელის საფასურის აქტივი. SORA Nexus ეს არის XOR. გამოიყენეთ
აქტიური XOR ანალოგიური ან კანონიკური XOR აქტივების განსაზღვრა ID ჟაჟრთნარაჲრჲ გთ.

`sponsor_max_fee = "0"` ნიშნავს, რომ არ არსებობს საპროცენტო მხარდაჭერის ლიმიტი ტრანზაქციის ერთ-ერთ შემთხვევაში.
წარმოება, დააყენეთ ნულოვანი ზღვარი მას შემდეგ, რაც იცით ნორმალური ზომა და გაზის პროფილი
თქვენი მონაცემთა სივრცის ტრანზაქციების.

აჟრთვნეთ ან შეამოწმე ეს კონფიგურაცია თქვენი ჩვეულებრივი ოპერატორის პროცესის საშუალებით.

## 6. შექმენით და დააფინანსეთ დამფინანსებელი {#_6-create-and-fund-the-sponsor}

საჭიროების შემთხვევაში, შექმენით სპონსორის საკვანძო წყვილი:

```bash
kagami keys --algorithm ed25519 --json
```

კონვერტირება საჯარო გასაღები ფორმატი ანგარიში თქვენი ქსელი:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

დარეგისტრირდით სპონსორის ანგარიშს თქვენი პირადი ჩართვის ფლოტის მეშვეობით:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

დაფინანსება სპონსორს XOR საფინანსო ან სხვა დაფინანსებული ანგარიშიდან
ანგარიში:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

სამედიცინო Taira რეპეტიციები, Save the faucet დამხმარე
[მიიღეთ Testnet XOR დაწვრილებით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
როგორც `taira_faucet_claim.py`, შემდეგ საფინანსო მხარდამჭერი საჯარო ქვაბით
საფინანსო გადარიცხვის ნაცვლად:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

შეამოწმეთ სპონსორი. XOR ბალანსი:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. მომხმარებელს მიეცეთ Sponsor-ის საშუალება {#_7-grant-a-user-access-to-the-sponsor}

სპონსორმა უნდა მისცეს თითოეულ მომხმარებელს ნებართვა, რომ მას გადასახადები დაეკისროს.
რა ხელს უშლის მომხმარებლებს სახელების არაკეთილსინდისიერი სპონსორული ანგარიშების დასახელება.

გაუშვით ეს როგორც სპონსორის ანგარიში, ან როგორც ოპერატიული ანგარიში ნებადართულია თქვენი
გაშვების დროის პოლიტიკა:

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

ჩართვის სერვისებისათვის, ეს უნდა იყოს ჩვეულებრივი ანგარიშის უზრუნველყოფის ნაბიჯი და რეგისტრაცია:

- მომხმარებლის ანგარიში
- სპონსორის ანგარიში
- მონაცემთა სივრცე ან აპლიკაცია
- დამტკიცების ბილეთი ან მმართველობის გადაწყვეტილება

მომხმარებლის გრანტების შემოწმებისთვის:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. მიაერთეთ სპონსორის მეტადატები {#_8-attach-sponsor-metadata}

შეიქმნას განმეორებითი გამოყენების მეტა მონაცემთა ფაილი:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ამ მეტა მონაცემებით წარდგენილი ნებისმიერი წერილი დაჯარიმდება სპონსორს:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

სამედიცინო SDKs, დააკავშიროთ იგივე ოპერაციის მეტა მონაცემთა ობიექტი ხელმოწერილი
ტრანზაქცია. მომხმარებელი ტრეანსაქციას ხელს უწერს მომხმარებლის გასაღებით.
არ ხელს უწერს ყველა მომხმარებლის ტრანზაქცია, რადგან წინა `CanUseFeeSponsor`
გრანტი არის ავტორიზაცია.

## მოდელი 1: მომხმარებლები უფასოდ იხდიან {#pattern-1-users-pay-no-fees}

გამოიყენეთ ეს, როდესაც აპლიკაცია ან ოპერატორი იღებს ყველა ქსელის საფასურს.

დეველოპერის შეამოწმებელი სია:

1. შეინარჩუნეთ მომხმარებლის ჩვეულებრივი ტრანზაქციის სასარგებლო ტვირთი უცვლელი.
2. შემატეთ ტრანზაქციის მეტა მონაცემები `fee_sponsor`.
3. ოჲეაპაჟნარ ჟჲ ოპვჟრგჲრ.
4. ოჲეაპაჟნთ ჟჲ პვრთნთკა ოპვჟრგჲრწ.

მომხმარებლის ანგარიშს არ სჭირდება XOR ბალანსი. სპონსორის ანგარიში უნდა შეინარჩუნოს
საკმარისი XOR კონფიგურირებული Nexus საფასურები.

## 2. მოდელი: მომხმარებლები გადაიხდიან ადგილობრივ ტოკონს {#pattern-2-users-pay-a-local-token}

გამოიყენეთ ეს მაშინ, როდესაც მომხმარებელმა არ უნდა დაიჭიროს XOR, მაგრამ მონაცემთა სივრცეში მაინც სურს
შიდა აპლიკაციის საფასური, საკრედიტო ხარჯები ან კვოტის ტოქენი.

ამ ნიმუშში, ადგილობრივი ტოქენი არის განაცხადის გადახდა. ეს არ არის
ქსელის გადასახადის აქტივი. სპონსორი კვლავ იხდის ქსელის გადახდას XOR.

მაგალითად, გამოიყენეთ ადგილობრივი ტოკი პირადი მონაცემთა სივრცეში:

```text
usage#billing.team
```

ფონდის მომხმარებლები `usage#billing.team` ჩართვისას, აბონენტების განახლებისას;
ან კვოტის განაწილება. შემდეგ მომხმარებლის ტრანზაქცია ატომური:

1. მომხმარებლისგან სპონსორს ადგილობრივი ტოქენების გადაცემა
2. განახორციელოს მოთხოვნილი აპლიკაციის ოპერაცია
3. მოიცავს `fee_sponsor` მეტა მონაცემები, რათა სპონსორი გადაიხადოს XOR

მინიმალური CLI ტესტი მხოლოდ ადგილობრივი ტოქენის გადაცემაა, რომელსაც სპონსორობს XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

რეალური აპლიკაციისათვის, არ წარადგინოთ ადგილობრივი ტოქნის გადახდა ცალკე
საუკეთესო ძალისხმევის ოპერაცია. შეიქმნას ერთი ხელმოწერილი ოპერაცია, რომელიც შეიცავს ორივე
გადახდა და ბიზნეს ინსტრუქცია, ან გამოავლინოს ხელშეკრულების შესასვლელი პუნქტი, რომელიც
შეაგროვებს ადგილობრივ ტოქონს ბიზნეს ოპერაციის განხორციელებამდე.

შეინახეთ კონვერტაციის პოლიტიკა თქვენს აპლიკაციაში ან ხელშეკრულებაში:

- რა ოპერაცია ღირს რამდენი ადგილობრივი ტოქენის ერთეული
- როგორ ადგილობრივი token შემოსავლების რუკები სპონსორი XOR დამატება
- რა ხდება, როდესაც მომხმარებლის ბალანსი ძალიან დაბალია
- რა ხდება, როდესაც სპონსორი XOR ბალანსი ზედმეტად დაბალია

::: warning

არ გამოიყენოთ `gas_asset_id` "ლოკალური ტოქნის საფასურის" ნიმუშით, თუ არ გსურთ
ამჟამინდელი გაზის დროს,
`fee_sponsor` აგრეთვე ხდება სპონსორი გადამხდელის კონფიგურირებული მილსადენი-გაზისათვის
ადგილობრივი ტოკენების მომხმარებელთა გადასახადებისთვის, ამოიღეთ ტოქენი მკაფიოდ
გადაცემის ან ხელშეკრულების წესი.

:::

## გამოასწორეთ არასწორი სპონსორული ოპერაციები {#debug-failed-sponsored-transactions}

ჩვეულებრივი უარყოფის მიზეზები, როგორც წესი, მიუთითებს ერთი დაკარგული ინსტალაციის ეტაპზე:

| შეცდომის ტექსტი | რა უნდა შეამოწმოთ |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` ჯერ კიდევ არის `false` კვანძზე. |
| `fee sponsor is not authorized` | მომხმარებელს არ აქვს `CanUseFeeSponsor` ამ სპონსორისთვის. |
| `fee asset ... is missing` | სპონსორს არ აქვს კონფიგურებული XOR საფასურის აქტივი. |
| `fee balance ... is insufficient` | ოჲეაპვჟრთნა ჟლსპჲნჲრს. XOR ბალანსი. |
| `fee exceeds sponsor_max_fee` | გაზრდა `sponsor_max_fee` ან შეამციროს ტრანზაქციის ზომა/გაზი. |
| `invalid nexus fee asset id` | შეკეთება `nexus.fees.fee_asset_id` ან XOR აჟრთვნ ჟლვეა. |

როდესაც დებეგირება ნიმუში 2, შეამოწმეთ ორივე ბალანსი:

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

## სპონსორის მოქმედება {#operate-the-sponsor}

საფინანსო ანგარიშად მოექცევით სპონსორს:

- ტესტის ქსელის, სტეჟირებისა და ძირითადი ქსელისათვის ცალკეული სპონსორის გასაღები უნდა ინახოს.
- საგანგებო განცხადება მხარდამჭერის წინაშე XOR ბალანსი მიაღწევს შესასვლელ სართულზე
- დააყენეთ არა ნულოვანი `sponsor_max_fee` საზღვარი, როდესაც მოძრაობა ხასიათდება
- ფასიანი ლიმიტის მხარდაჭერილი წერილები თქვენს განაცხადში ან გეტვეიში
- გაუქმება `CanUseFeeSponsor` როდესაც მომხმარებელი დატოვებს მონაცემთა სივრცეს
- მომხმარებლის ტრანზაქციების ჰეშის, ადგილობრივი ტოქენებით გადახდებისა და სპონსორების შეთანხმება XOR
  საფინანსო დავალიანებები

მომხმარებლის მხარდაჭერის გაუქმება:

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

## დაკავშირებული გვერდები {#related-pages}

- [შეხება SORA Nexus მონაცემთა ბაზები](/ka/get-started/sora-nexus-dataspaces.md)
- [ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md)
- [აქტივები](/ka/blockchain/assets.md)
- [ნებართვები](/ka/blockchain/permissions.md)
- [ნებართვის ტოქნები](/ka/reference/permissions.md)
