---
translation_locale: ka
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# სპონსორის საფასურები კერძო მონაცემთა სივრცეზე {#sponsor-fees-for-a-private-dataspace}

საფასურის სპონსორობა მომხმარებლებს საშუალებას აძლევს შეაგზავნონ კერძო მონაცემთა სივრცეში ტრანზაქციები XOR. მომხმარებელი ჯერ კიდევ ხელს უწერს ტრანზაკციას. ტრანზუქციის მეტადატალი მიუთითებს სპონსორის ანგარიშზე, ხოლო შესრულების გარემო სავალდებულოა სპონსორის ბალანსის XOR ქსელის გადასახადისთვის.

ინტეგრაციის სამი მოძრავი ნაწილია:

1. კვანძი აძლევს საფასურის მხარდაჭერას
2. ესქრო არსებობს და აქვს XOR
3. თითოეულ მომხმარებელს აქვს `CanUseFeeSponsor` ამ მხარდამჭერისათვის

ამის შემდეგ, ყველა მხარდაჭერილი მომხმარებლის ტრანზაქციაში მხოლოდ ეს მეტადატატია საჭირო:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ამ გვერდზე ნაჩვენებია ორი საერთო ნიმუში:

- უფასო მომხმარებელი წერს: მხარდამჭერი იხდის XOR და მომხმარებელი არაფერს იხდის.
- ადგილობრივი ტოქნების გადასახადები: მომხმარებელი იხდის სპონსორს აპლიკაციის ტოქნში, ხოლო სპონსორი იხდის ქსელს XOR.

გამოიყენეთ Taira ან კერძო სატესტო ქსელი პირველ რიგში. ახალი კერძო მონაცემთა სივრცე არის ოპერატორის და მმართველობის ცვლილება; ის არ იქმნება კლიენტის კონფიგურაციით.

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

გამოიყენეთ კანონიკური I105 ანგარიშის ID-ები, თუ თქვენს განთავსებაში არ არის აქტიური ანგარიშის ალიასიებები იმავე ანგარიშებისთვის.

## 1. მომზადება მონაცემთა სივრცე {#_1-prepare-the-dataspace}

დაიწყეთ კერძო მონაცემთა სივრცის კატალოგიდან და [დაკავშირება SORA Nexus მონაცემთა სივრცეებთან](/ka/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) -ში აღწერილი როუტირების სამუშაოებიდან. ოპერატორს მიმართული ფრაგმენტი ასე გამოიყურება:

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

- კერძო განხორციელების ზოლი გამოჩნდება `/status` საპასუხო კუთხეში.
- მომხმარებელთა ანგარიშები მიიღება თქვენი პირადი ჩართვის ნაკადით
- მხარდამჭერი ანგარიში არსებობს
- XOR საფასურის აქტივი და საფასურის გადახდის ანგარიში ქსელში მოქმედებს.

## 2. მონაცემთა სივრცეში აქტივების რეგისტრაცია. {#_2-register-assets-in-the-dataspace}

დარეგისტრირეთ აქტივების განსაზღვრები, რომლებიც მომხმარებლებს ინახებათ კერძო მონაცემთა სივრცეში, სანამ მათ აპლიკაციის ლოგიკაში ჩააბრუნებთ. ადგილობრივი ტოკენების საფასურის ნიმუშისთვის, მასწავლებელი იყენებს `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

ჯერ დააყენეთ დომენი და SNS იჯარით, რომლებიც ფლობენ აქტივის სახელების სივრცეს. შეიქმნას საიდუმლოებრი თავისუფალი `AliasSetupPlanRequestV1` განზრახვა `$BILLING_DOMAIN`, მათ შორის ციფრული `team` მონაცემთა სივრცის ID, კანონიკური მფლობელი, იჯარის ვადები და მიმდინარე საფასურის შეფასების დაცვა:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

შემდეგ დაარეგისტრირეთ აქტივების განსაზღვრა. ერთიანი პროტოკოლური სტანდარტი `--id` არის ქსელის დონეზე აქტივების განმარტების ID. საყურადღებოა ის, რაც დეველოპერებმა და საბოლოო მომხმარებლებმა უნდა გამოიყენონ მონაცემთა სივრცეში კოდში:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

მომხმარებლისთვის ადგილობრივი ტოქენის გაცემა ან გადაცემა ჩართვისას:

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

გამოიყენეთ იგივე ნიმუში აპლიკაციის აქტივებისთვის მონაცემთა სივრცეში. დაარეგისტრირეთ ერთი აქტივის განსაზღვრა თითოეული ტოქნისთვის, მიეცით თითოეულს მონაცემთა სიბნის ალტერნატივა და მიმართეთ SDK კოდის ალტერნატიკას მყარი კოდირების ნაცვლად კანონიკური აქტივების განსაზღვრის ID-ებს.

## 3. დარეგისტრირეთ მომხმარებლის ალიასი {#_3-register-user-aliases}

ანგარიშები კვლავ კანონიკური I105 ანგარიშის ID- ს წარმოადგენს. მომხმარებლის წინაშე მდგარი სახელები არის ანგარიშის ალიასი, ხოლო ალიასი უნდა იყოს არამგრძნობიარე სახელები მაგალითად `alice@team` ან `alice@members.team`. არ გამოიყენოთ სატელეფონო ნომრები ან ელ.ფოსტის მისამართები, როგორც ალიასები. ისინი შედიან კერძო იდენტიფიკატორების ნაკადში შემდეგ განყოფილებაში:

ალიასის გამართვის იყენებს იმავე დეკლარაციურ დაგეგმვას, როგორც დომენის დაყენება. ჰქონდეთ SDK ან ჩართვის სერვისი შექმნას ალიასების გარეშე `AliasSetupPlanRequestV1` განზრახვა, რომლის ანგარიშის ალიასი შესვლის მიზნები  `$USER`, აირჩევს ძირითად როლს, ამაგრებს ციფრული მონაცემთა სივრცე ID და ატარებს მიმდინარე იჯარის საფასურის ფასი დამტკიცების დაცვა. შემდეგ დაგეგმილი და გამოყენებული როგორც ერთი ატომური ტრანზაქცია:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

თუ მომხმარებელმა არ უნდა გადაიხადოს XOR, გამოიყენეთ დამტკიცებული სპონსორ-ცნობილი ინბორდინგის სერვისი კონსტრუქციის შესაქმნელ და წარდგენის მიზნით. არ გაიყოთ იჯარის შეძენა და ბინდური ალიასი დამოუკიდებელი განაცხადის ტრანზაქციებად.

მას შემდეგ, რაც ალიასი სახელია დაკავებული, შეამოწმეთ იგი CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

ახალი ანგარიშის შექმნისათვის სასურველია ჩართვის სერვისი, რომელიც აშენებს `NewAccount` სტაბილური `uaid` და საჭიროების შემთხვევაში საწყისი `label`. მარტივი ბრძანება `ledger account register --id` რეგისტრირებს მხოლოდ კანონიკური ანგარიშის ID- ს.

## 4. დარეგისტრირეთ ტელეფონი და ელექტრონული ფოსტა პირადად FHE-ზე {#_4-register-phone-and-email-privately-with-fhe}

გამოიყენეთ ტელეფონის ნომრები და ელექტრონული ფოსტის მისამართები როგორც პირადი იდენტიფიკატორის მოთხოვნები, არა საჯარო ალიასები. FHE მხარდაჭერილი ნაკადი ინარჩუნებს ნედლეულის იდენტიფექციების ანგარიშის ალიასები, ტრანზაქციის მეტამონაცემები, და მსოფლიო მდგომარეობა:

1. ოპერატორი რეგისტრირებს [პროგრამის პოლიტიკა RAM-LFE/FHE](/ka/blockchain/ram-lfe.md) სატელეფონო და ელ.ფოსტისათვის
2. ოპერატორი რეგისტრირებს აქტიურ იდენტიფიცირების პოლიტიკას, როგორიცაა `phone#team` და `email#team`
3. საფულე ნორმალიზებს ტელეფონს ან ელ.ფოსტს ადგილობრივად
4. საფულე გზავნის დაშიფრებულ ღირებულებას გადამწყვეტზე
5. რეზოლუციონერი აბრუნებს `IdentifierResolutionReceipt`
6. მომხმარებელი წარადგენს `ClaimIdentifier` ქვითრთან ერთად.
7. ჯაჭვი ინახავს გაუმჭვირვალე იდენტიფიკატორსა და ქვითრის ჰეშს და არა ტელეფონის ნომრის ან ელფოსტის ნედლ მნიშვნელობას

ოპერატორის მხრიდან პოლიტიკის დაყენება არის SDK ან მომსახურების ამოცანა. შეიქმნას და წარადგინოს ეს ინსტრუქციული წყვილი თითოეული იდენტიფიკატორის ტიპისათვის:

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

გაიმეორეთ ეს ელ.ფოსტის მისაღებად:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

ჩართვის დროს, საფულე ან უკანა მხარეს უნდა ნორმალიზდეს ადგილობრივად:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

მას შემდეგ, რაც მხარდამჭერი მეტამონაცემების ფაილი შეიქმნება მე-8 ნაბიჯში, წარადგინეთ მომხმარებლის მიერ ხელმოწერილი მოთხოვნის ინსტრუქცია ამ მეტამონაცემებთან ერთად:

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

მიმდინარე CLI არ ასახავს ამ იდენტობის ინსტრუქციების ტიპირებულ ბრძანებებს. გენერირეთ სერიალიზებული `InstructionBox` მნიშვნელობები SDK და წარუდგინეთ ისინი `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

ამ საფარის დაცვა შეინახეთ ბორდინგის სამსახურში:

- ანგარიშის ალიასები არის მხოლოდ ადამიანის მიერ წაკითხული სახელები
- ტელეფონის ნომრებისა და ელფოსტის ნედლი მნიშვნელობები არასოდეს ჩნდება ალიასებში, მეტამონაცემებში, ჟურნალებში ან ტრანზაქციის დატვირთვებში
- ანგარიშს აქვს `uaid` მანამდე, სანამ კერძო იდენტიფიკატორებს მოითხოვს
- ქვითრები აკავშირებს `policy_id`, `opaque_id`, `uaid`, `account_id` და ვადის ამოწურვას;
- გადამწყვეტი გასაღები და დამალული პროგრამის კრიპტოგრაფიული ვალდებულება კონტროლდება მმართველობის მიერ

## 5. ჩართეთ სპონსორობა კვანძზე {#_5-enable-sponsorship-on-the-node}

საფასურის მხარდაჭერა არის კვანძის / გამშვები დროის პოლიტიკა. ჩართეთ იგი Nexus საფასურის კონფიგურაციაში:

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

`fee_asset_id` არის ქსელის საფასურის აქტივი. SORA Nexus-ისთვის ეს არის XOR. გამოიყენეთ აქტიური XOR ალიასი ან კანონიკური XOR აქტივის განსაზღვრის ID, რომელიც თქვენს ქსელში გამოჩნდება.

`sponsor_max_fee = "0"` ნიშნავს, რომ არ არსებობს ყოველ ტრანზაქციაზე სპონსორის საზღვარი. წარმოებისათვის, დააყენეთ ნულოვანი ზღვარი მას შემდეგ, რაც თქვენ იცით თქვენი მონაცემთა სივრცის ოპერაციების ნორმალური ზომა და ტრანზაკციის შესრულების ხარჯების პროფილი.

ოპერატორის ჩვეულებრივი პროცესის დროს ამ კონფიგურაციის განახლება ან გადატანა.

## 6. შექმენით და დააფინანსეთ მხარდამჭერი {#_6-create-and-fund-the-sponsor}

თუ საჭიროა, შექმენით სპონსორის საკვანძო წყვილი:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

კონვერტირება საჯარო გასაღები ფორმატი ანგარიში თქვენი ქსელი:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

დარეგისტრირდით სპონსორის ანგარიშს თქვენი კერძო ჩართულობის ფლოტით:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

დაფინანსება სპონსორს XOR სახაზინო, სარჩელის ანგარიშიდან ან სხვა დაფინანსებული ანგარიშიდან:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira რეპეტიციებისათვის, ტესტური მონეტების გამცემის დამხმარე პირი [ტესტნეტს XOR დაუკავშირდით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-დან `taira_faucet_claim.py` შეინახეთ, შემდეგ კი სპონსორს საფინანსო გადარიცხვის ნაცვლად საჯარო ტესტნიტურ ქსელის დაფინანსებათა სერვისით დააფინანსეთ:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

შეამოწმეთ სპონსორის ბალანსი XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. მიეცით მომხმარებელს სპონსორი-თან წვდომა {#_7-grant-a-user-access-to-the-sponsor}

სპონსორმა თითოეულ მომხმარებელს უნდა მისცეს ნებართვა, რომ მას გადასახადები დაეკისროს. დახმარება არის ის, რაც ხელს უშლის მომხმარებლებს არაკეთილსინდისიერი სპონსორის ანგარიშების დასახელებას.

აწარმოე ეს როგორც სპონსორის ანგარიში ან ოპერატიული ანგარიში, რომელიც ნებადართულია შესრულების გარემოს პოლიტიკით:

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

## 8. მიაერთეთ სპონსორის მეტამონაცემები {#_8-attach-sponsor-metadata}

შექმნას განმეორებითი გამოყენების მეტამონაცემები ფაილი:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ამ მეტამონაცემებით წარდგენილი ნებისმიერი წერილი დაჯარიმდება სპონსორს:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs-ისათვის, დაუმატეთ იგივე ტრანზაქციის მეტამონაცემების ობიექტი ხელმოწერილი ტრანზაკციაზე. მომხმარებელი ხელს აწერს ტრანზუქციას მომხმარებლის გასაღებით. სპონსორი არ ხელს აძლევს ყველა მომხმარებლის ტრანსაქციას, რადგან წინა `CanUseFeeSponsor` დაფინანსება არის ავტორიზაცია.

## მოდელი 1: მომხმარებლები იხდიან უფასოდ {#pattern-1-users-pay-no-fees}

გამოიყენეთ ეს, როდესაც აპლიკაცია ან ოპერატორი იღებს ქსელის ყველა საფასურს.

დეველოპერის შეამოწმებელი სია:

1. შეინარჩუნეთ მომხმარებლის ჩვეულებრივი ტრანზაქციის დატვირთვა უცვლელი.
2. შემატეთ ტრანზაქციის მეტამონაცემები `fee_sponsor`.
3. ხელი მოაწერეთ მომხმარებლის სახელით.
4. გადმოაგზავნეთ კერძო მონაცემთა სივრცის მარშრუტით.

მომხმარებლის ანგარიშს არ სჭირდება XOR ბალანსი. სპონსორის ანგარიშმა უნდა ინახოს საკმარისი რაოდენობა XOR კონფიგურირებული Nexus გადასახადების დასაფარავად.

## მოდელი 2: მომხმარებლები გადაიხდიან ადგილობრივ ნიშნებს {#pattern-2-users-pay-a-local-token}

გამოიყენეთ ეს მაშინ, როდესაც მომხმარებელს არ უნდა ჰქონდეს XOR, მაგრამ მონაცემთა სივრცეში მაინც სურს შიდა აპლიკაციის საფასური, საკრედიტო ხარჯები ან კვოტის ტოქენი.

ამ ნიმუშიში, ადგილობრივი ტოქენი არის განაცხადის გადახდა. ეს არ არის ქსელის საფასურის აქტივი. სპონსორი კვლავ იხდის ქსელის საფულს XOR.

მაგალითად, გამოიყენეთ ადგილობრივი ტოკი პირადი მონაცემთა სივრცეში:

```text
usage#billing.team
```

ფონდის მომხმარებლები `usage#billing.team` ინბორდინგის, აბონენტების განახლების ან კვოტების განაწილების დროს. შემდეგ გააკეთეთ მომხმარებლის ტრანზაქცია ატომური:

1. ადგილობრივი ტოქენების გადაცემა მომხმარებლისგან სპონსორს
2. განახორციელოს აპლიკაციის მოთხოვნილი ოპერაცია
3. მოიცავს `fee_sponsor` მეტამონაცემებს, რის გამოც სპონსორი იხდის XOR;

მინიმალური CLI სიგარეტის გამოცდა არის მხოლოდ ადგილობრივი ტოქენის გადაცემა, რომელსაც XOR იფინანსებს:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

რეალური აპლიკაციისთვის, არ წარადგინოთ ადგილობრივი ტოქენის გადახდა ცალკე საუკეთესო ძალისხმევის ოპერაციის სახით. შეიქმნათ ერთი ხელმოწერილი ტრანზაქცია, რომელიც შეიცავს როგორც გადახდას, ასევე ბიზნეს ინსტრუქციას, ან გამოავლინეთ კონტრაქტის შესასვლელი პუნქტი, რომელიც მოაგროვებს ადგილობრივ ტოქენს სანამ გამოიყენებთ ბიზნეს ოპერაციას.

შეინახეთ კონვერტაციის პოლიტიკა თქვენს აპლიკაციაში ან ხელშეკრულებაში:

- რა ოპერაცია ღირს რამდენი ადგილობრივი ტოკენი ერთეული
- როგორ მოახდინონ ადგილობრივი ტოქნების შემოსავლების რუკები XOR დამატებების სპონსორობისთვის
- რა მოხდება, როდესაც მომხმარებლის ბალანსი ძალიან დაბალია
- რა მოხდება, როდესაც სპონსორის XOR წონასწორობა ძალიან დაბალია

::: warning

არ გამოიყენოთ `gas_asset_id` „ლოკალური ტოკენის საფასურის“ ნიმუშისთვის, თუ არ გსურთ, რომ სპონსორს ამ გაზის აქტივშიც დაეკისროს საფასური. მიმდინარე შესრულების გარემოში `fee_sponsor` სპონსორს კონფიგურირებული დამუშავების ნაკადის გაზის აქტივიდან ჩამოჭრის გადამხდელადაც აქცევს. ლოკალური ტოკენით მომხმარებლის საფასურის მისაღებად ტოკენი პირდაპირ, გადარიცხვით ან კონტრაქტის წესით შეაგროვეთ.

:::

## არასწორი სპონსორული ტრანზაქციების დებეგირება {#debug-failed-sponsored-transactions}

ჩვეულებრივი უარყოფის მიზეზები, როგორც წესი, მიუთითებს ერთი დაკარგული ინსტალაციის ეტაპზე:

|შეცდომის ტექსტი |რა უნდა შეამოწმოთ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` ჯერ კიდევ არის `false` კვანძზე. |
|`fee sponsor is not authorized` |მომხმარებელს არ აქვს `CanUseFeeSponsor` ამ მხარდამჭერისათვის. |
|`fee asset ... is missing` |სპონსორი არ ფლობს კონფიგურირებულ XOR საფასურის აქტივს. |
|`fee balance ... is insufficient` |შეავსეთ სპონსორის XOR-ის ბალანსი.|
|`fee exceeds sponsor_max_fee` |გაზარდოს `sponsor_max_fee` ან შეამციროს გარიგების ზომა/გაზი. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` ან XOR აქტივის სათაური. |

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

ესქროდ მოექცევით სპონსორს:

- ინახება ცალკე სპონსორების გასაღები ტესტნეტისთვის, სტენინგისა და ძირითადი ქსელისათვის
- გაფრთხილება, სანამ სპონსორის ბალანსი XOR მიაღწევს მიღების სართულზე
- განისაზღვროს `sponsor_max_fee` ნულოვანი საზღვარი, როდესაც ტრანსპორტის მოძრაობა ხასიათდება
- საფასურის ლიმიტის მხარდაჭერილი წერილები თქვენს განაცხადში ან კარიბჭეზე
- გაუქმდეს `CanUseFeeSponsor`, როდესაც მომხმარებლები დატოვებენ მონაცემთა სივრცეს;
- მომხმარებლის ტრანზაქციის კრიპტოგრაფიული ჰეშების, ადგილობრივი ტოკენებით გადახდებისა და სპონსორის XOR დებიტების შეთანხმება;

მომხმარებლისთვის მხარდაჭერის გაუქმება:

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

- [დაკავშირება SORA Nexus მონაცემთა სივრცეებთან](/ka/get-started/sora-nexus-dataspaces.md)
- [ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md)
- [აქტივები](/ka/blockchain/assets.md)
- [ნებართვები](/ka/blockchain/permissions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
