---
translation_locale: ka
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დომენები {#domains}

დომენები არის დასახელებული სახელების სივრცეები რეგისტრირებულია `World`. მიმდინარე Iroha 3 მონაცემთა მოდელში დომენი კვალიფიცირებულია მისი მშობლიური მონაცემთა სივრცით, ასე რომ კანონიკური იდენტიფიკატორი არის:

```text
domain.dataspace
```

მაგალითად, `payments.universal` დაასახელებს `payments` დომენს `universal` მონაცემთა სივრცეში.

## სტრუქტურა {#structure}

რეგისტრირებული `Domain` შეიცავს:

- `id`: მონაცემთა სივრცე-კვალიფიცირებული `DomainId`
- `logo`: დომენის ლოგოს ვარიანტი `SoraFS` URI
- `metadata`: საკვანძო მნიშვნელობის თვითნებური მეტა მონაცემები.
- `owned_by`: ანგარიში, რომელიც ფლობს დომენს, ჩვეულებრივ ის ანგარიში, რომელმაც იგი დაარეგისტრირა

ბოტსტრაპის სასარგებლო ტვირთი, რომელიც გამოიყენება დომენის მატერიალიზაციისთვის, არის `NewDomain`. იგი ატარებს `id`, ვარიანტული `logo` და ინიციალური `metadata`. გამშვები დრო აღავსებს `owned_by` ხელისუფლებისგან. ჩვეულებრივი კლიენტები ამ სასარგებლო სატვირთოს პირდაპირ არ წარუდგენენ.

## რეგისტრაცია {#registration}

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციურ alias setup ნაკადს. ეს ინარჩუნებს SNS იჯარის ხელშეკრულებას, მფლობელის შესაძლებლობებს, ციტატის დაცვას და დომენის რიგს ერთ ატომურ `EnsureAlias` ტრანზაქციაში. `Register::Domain` რჩება გენეზი / bootstrap ზედაპირი, ხოლო `ledger domain` ბრძანებაში არ არის `register` ქვებრძანება.

შეიქმნას საიდუმლო თავისუფალი `AliasSetupPlanRequestV1` განზრახვა SDK ან ჩართვის სერვისით, შემდეგ ჰქონდეს CLI გეგმა იგი ცოცხალი მდგომარეობის წინააღმდეგ და წარუდგინოს ზუსტი გეგმის:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

განზრახვა იდენტიფიცირებს `payments.universal`, მისი ციფრული მონაცემთა სივრცე, კანონიკური I105 მფლობელი, იჯარის შეძენის ვადა და მიმდინარე პოლიტიკა / გადახდის კოტირების დაცვა. planner-ის საბოლოო წერტილი არის `POST /v1/aliases/setup/plan`; მისი დაბრუნებული გეგმაა ჯაჭვის, უფლებამოსილების, სახელმწიფოს და ვადის შეზღუდული. დომენის მოხსნა კვლავ იყენებს [`Unregister`](/ka/blockchain/instructions.md#un-register).

დომენის შექმნა ან ამოღება მოითხოვს შესაბამისი დომენის მართვის ნებართვას აქტიური გამშვები დროის ვალიდატორის ქვეშ. დომენის მეტა მონაცემები შეიძლება განახლდეს [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue), როდესაც ორგანოს აქვს ნებართვა ამ დომენის შეცვლისთვის.

## სცადეთ Taira {#try-it-on-taira}

ჩამოთვალეთ დომინები, რომლებიც ამჟამად საჯარო Taira ტესტნეტზე ჩანს:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

საჯარო ბილიკების კატალოგი გადაიტანეთ მონაცემთა სივრცის ანალიზებზე:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

გამოიყენეთ პირველი ბრძანება, როდესაც აპლიკაციამ უნდა შეამოწმოს არსებობს თუ არა დომენი. გამოიყენეთ ბილიკის კატალოგი, როდესაც თქვენ უნდა დაადასტუროთ არის თუ არა მონაცემთა სივრცე საჯარო, შეზღუდული ან ჩამორჩენილი ძირითადი ბილიკის უკან.

დომენის დაყენება არის საფასურის გადახდის წერილი. სანამ შეეცდებით Taira-ზე, შეინახეთ საბანკო ჯიშის დამხმარე [Get Testnet XOR on Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, დააფინანსეთ ხელმოწერილი საჯარო ჯიშით და დაამატეთ საფასური მეტადატატი:

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

შექმენით განზრახვა უნიკალური დომენის სახელის შესახებ განმეორებით ტესტნეტზე და გამოიყენეთ Taira - ის მოქმედი პოლიტიკა და საფასური აქტივების კოტირების დაცვა. არ გამოვიყენოთ ლოკალურ ქსელზე ან Minamoto წარმოებული გეგმა.

## სხვა სუბიექტებთან ურთიერთობა {#relationship-to-other-entities}

დომენების ჯგუფი რეგისტრირებული ობიექტები და უზრუნველყოფს სახელის სივრცე დომენის სკანდირებული მონაცემებისთვის. აქტივების განსაზღვრა იყენებს დომენის კვალიფიციურ იდენტიფიკატორებს, ხოლო შეკითხვებს შეუძლია ჩამოთვალოს დომენები ან მოძებნოს. დომენზე განსაზღვრული ობიექტები. თვითონ ანგარიშები დომენის გარეშეა მიმდინარე მონაცემთა მოდელში, მაგრამ ანგარიშებს შეუძლიათ ჰქონდეთ დომენები და ინახონ აქტივები, რომელთა განმარტებებიც დომენების ქვეშ ცხოვრობს.

იხილეთ ასევე:

- [მსოფლიო](/ka/blockchain/world.md)
- [აქტივები](/ka/blockchain/assets.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [დასახელების წესები](/ka/reference/naming.md)
