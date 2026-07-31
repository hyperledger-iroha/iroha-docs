---
translation_locale: ka
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დომენები {#domains}

დომენების დასახელება არის სახელის სივრცეები რეგისტრირებული `World`. ამჟამად Iroha
3 მონაცემთა მოდელი დომენი კვალიფიცირებულია მისი მშობლიური მონაცემთა სივრცე, ასე რომ კანონიკური
იდენტიფიკატორი არის:

```text
domain.dataspace
```

მაგალითად, `payments.universal` სახელები `payments` დომენი შიგნით
`universal` მონაცემთა სივრცე.

## სტრუქტურა {#structure}

დარეგისტრირებული `Domain` შეიცავს:

- `id`: მონაცემთა სივრცე-კვალიფიცირებული `DomainId`
- `logo`: ვარიანტი `SoraFS` URI დომენის ლოგოსთვის
- `metadata`: ნებაყოფლობითი საკვანძო ღირებულების მეტა მონაცემები
- `owned_by`: ანგარიში, რომელიც ფლობს დომენს, ჩვეულებრივ ანგარიში, რომელსაც
  დარეგისტრირდა

ბოტსტერაპის სასარგებლო ტვირთი, რომელიც გამოიყენება დომენის მატერიალიზაციისთვის არის `NewDomain`. ატარებს
დასახელება `id`, ნებაყოფლობით `logo`, და საწყისი `metadata`. ჟამი სავსეა
`owned_by` ორგანოდან. ჩვეულებრივი კლიენტები ამ სასარგებლო ტვირთას არ წარუდგენენ
პირდაპირ.

## რეგისტრაცია {#registration}

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციურ alias setup flow. ეს ინარჩუნებს
SNS ქირავდება, მფლობელის შესაძლებლობები, ციტატის დაცვა და დომენის რიგები ერთ ატომურში
`EnsureAlias` ოპერაცია. `Register::Domain` რჩება გენეზი/ბოტსტრაპი
ზედაპირისა და `ledger domain` ბრძანება არ აქვს `register` ქვეპაპარაკე.

შექმენით საიდუმლოების გარეშე `AliasSetupPlanRequestV1` განზრახვა SDK ან ჩართვა
მომსახურება, მაშინ მიიღოს CLI გეგმავს მას ცოცხალი მდგომარეობის წინააღმდეგ და წარუდგენს ზუსტი
გეგმა:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

განზრახვა იდენტიფიცირებს `payments.universal`, მისი ციფრული მონაცემთა სივრცე, კანონიკური
I105 მფლობელი, იჯარის შეძენის ვადა და მიმდინარე პოლიტიკა / გადახდის კოტირების დაცვა.
დამგეგმლის საწინააღმდეგო წერტილი `POST /v1/aliases/setup/plan`; მისი დაბრუნების გეგმა არის
ჯაჭვის, უფლებამოსილების, სახელმწიფოს და ვადით შეზღუდული. დომენის მოხსნა კვლავ გამოიყენება
[`Unregister`](/ka/blockchain/instructions.md#un-register).

დომენის შექმნა ან ამოღება საჭიროებს შესაბამისი დომენის მართვას
ნებართვა აქტიური runtime validator ქვეშ. დომენის მეტა მონაცემები შეიძლება განახლდეს
[`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue)
როდესაც ორგანოს აქვს ნებართვა შეცვალოს ეს დომენი.

## სცადე. Taira {#try-it-on-taira}

ჩამოთვალეთ დომენები, რომლებიც ამჟამად საჯაროდ ჩანს Taira სატესტო ქსელი:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

საჯარო ბილიკების კატალოგი გადაიტანეთ მონაცემთა სივრცის ალტერნატივებზე:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

გამოიყენეთ პირველი ბრძანება, როდესაც აპლიკაციამ უნდა შეამოწმოს არსებობს თუ არა დომენი.
ბილიკების კატალოგი, როდესაც თქვენ უნდა დაადასტუროთ არის თუ არა მონაცემთა სივრცე საჯარო,
შეზღუდული ან ძირითადი ზოლის უკან ჩამორჩენილი.

დომენის დაყენება არის საფასური გადახდის წერა. სანამ ცდილობენ Taira, შეინახეთ
ქვაბის დამხმარე
[მიიღეთ Testnet XOR დაწვრილებით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
როგორც `taira_faucet_claim.py`, ფინანსდება ხელმოწერილის მიერ საჯარო სარქველის მეშვეობით და
თანდართული გადასახადის მეტა მონაცემები:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

შეიქმნას განზრახვა უნიკალური დომენის სახელის განმეორებითი ტესტნეტის run, და გამოიყენოს
Taira ამჟამინდელი პოლიტიკა და საფასური აქტივების კოტირების დაცვა. არ გამოიყენოთ ხელახლა გეგმა წარმოებული
ადგილობრივი ქსელისათვის ან Minamoto.

## სხვა სუბიექტებთან ურთიერთობა {#relationship-to-other-entities}

დომენების ჯგუფის ლეჯერი ობიექტები და უზრუნველყოფს სახელების სივრცე დომენის-შკოპ მონაცემებისთვის.
ქონების განსაზღვრები იყენებს დომენის კვალიფიციურ იდენტიფიკატორებს, ხოლო გამოკითხვებს შეუძლია ჩამოთვალოს
დომენები ან მოძებნეთ ობიექტები, რომლებიც დომენზე მიმოქცეულია.
დომენის გარეშე მიმდინარე მონაცემთა მოდელის, მაგრამ ანგარიშები შეიძლება ფლობდეს დომენები და ინახება
აქტივები, რომელთა განსაზღვრები დომენების ქვეშ ცხოვრობს.

იხილეთ ასევე:

- [მსოფლიო](/ka/blockchain/world.md)
- [აქტივები](/ka/blockchain/assets.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [დასახელების წესები](/ka/reference/naming.md)
