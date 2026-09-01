---
translation_locale: ka
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# დომენები {#domains}

დომენები არის დასახელებული სახელის სივრცეები რეგისტრირებულია `World`. მიმდინარე Iroha 3 მონაცემთა მოდელში დომენი კვალიფიცირებულია მისი მშობლიური მონაცემთა სივრცით, ასე რომ კანონიკური იდენტიფიკატორია:

```text
domain.dataspace
```

მაგალითად, `payments.universal` დაასახელებს `payments` დომენს `universal` მონაცემთა სივრცეში.

## სტრუქტურა {#structure}

რეგისტრირებული `Domain` შეიცავს:

- `id`: მონაცემთა სივრცე-კვალიფიცირებული `DomainId`
- `logo`: დომენის ლოგოს ვარიანტი `SoraFS` URI
- `metadata`: საკვანძო მნიშვნელობის თვითნებური მეტამონაცემები.
- `owned_by`: ანგარიში, რომელიც ფლობს დომენს, ჩვეულებრივ ის ანგარიში, რომელმაც იგი დაარეგისტრირა

ბოტსტრაპის დატვირთვა, რომელიც გამოიყენება დომენის მატერიალიზაციისთვის, არის `NewDomain`. იგი ატარებს `id`, ვარიანტული `logo` და პირველადი `metadata`. შესრულების გარემო ივსება `owned_by` ავტორიზაციის პრინციპიდან. ჩვეულებრივი კლიენტები ამ სასარგებლოს ტვირთას პირდაპირ არ წარუდგენენ.

## რეგისტრაცია {#registration}

ჩვეულებრივი დომენის შექმნა იყენებს დეკლარაციურ ალიასის გამართვის ნაკადს. ეს ინარჩუნებს SNS იჯარის ხელშეკრულებას, მფლობელის შესაძლებლობებს, საფასურის ფასის ვალიდაციის დაცვას და დომენის რიგს ერთ ატომურ `EnsureAlias` ტრანზაქციაში . `Register::Domain` რჩება გენეზისი / საწყისი გამართვა ზედაპირი, და `ledger domain` ბრძანებას არ აქვს `register` ქვებრძანება.

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

განზრახვა იდენტიფიცირებს `payments.universal`, მისი ციფრული მონაცემთა სივრცე, კანონიკური I105 მფლობელი, იჯარის შეძენის ვადები და მიმდინარე პოლიტიკა / გადახდის საფასური-ფასის ვალიდაციის დაცვა. API საბოლოო წერტილი არის `POST /v1/aliases/setup/plan`; მისი დაბრუნებული გეგმა არის დაკავშირებული ჯაჭვის, ტრანზაქციის ნებართვა იდენტობა, ბლოკჩეინის რეესტრი მდგომარეობა და საბოლოო ვადა. დომენის მოხსნა კვლავ იყენებს [`Unregister`](/ka/blockchain/instructions.md#un-register).

დომენის შექმნა ან ამოღება საჭიროებს სათანადო დომენის მართვის ნებართვას აქტიური შესრულების გარემოს ვალიდატორი. დომენის მეტამონაცემები შეიძლება განახლდეს: [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) როდესაც ავტორიზაციის ხელმძღვანელს აქვს ნებართვა შეცვალოს ეს დომენი.

## განახორციელეთ ეს სამუშაო პროცესი Taira {#try-it-on-taira}

ჩამოთვალეთ დომინები, რომლებიც ამჟამად საჯარო Taira ტესტნეტზე ჩანს:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

გადარიცხეთ საჯარო განხორციელების ბილიკის კატალოგი მონაცემთა სივრცის ალიასებზე:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

გამოიყენეთ პირველი ბრძანება, როდესაც აპლიკაციამ უნდა შეამოწმოს არსებობს თუ არა დომენი. გამოიყენეთ განხორციელების ზოლის კატალოგი, როდესაც თქვენ უნდა დაადასტუროთ არის თუ არა მონაცემთა სივრცე საჯარო, შეზღუდული ან ჩამორჩენილი ძირითადი შესრულების ზოლზე.

დომენის დაყენება არის საფასურის გადახდის წერილი. სანამ შეეცდებით Taira, შეინახეთ ტესტნეტის ფინანსირების სერვისის დამხმარე [ტესტნეტს XOR დაუკავშირდით Taira](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) როგორც `taira_faucet_claim.py`, დააფასეთ კრიპტოგრაფიული ხელმოწერა საჯარო ტესტნეტით დაფინანსების სერვისით და დაამატეთ საფასურის მეტამონაცემები:

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

შექმენით განზრახვა უნიკალური დომენის სახელის შესახებ განმეორებითი ტესტნეტების გაშვებებზე და გამოიყენეთ Taira - ის მიმდინარე პოლიტიკა და საფასური აქტივის საფასურის ფასის ვალიდაციის დაცვა. არ გამოვიყენოთ ლოკალურ ქსელზე ან Minamoto წარმოებული გეგმა.

## სხვა სუბიექტებთან ურთიერთობა {#relationship-to-other-entities}

დომენები ჯგუფობენ ბლოკჩეინის რეესტრის ობიექტებს და უზრუნველყოფენ სახელის სივრცეს დომენის მონაცემებისთვის. აქტივების განმარტებები იყენებენ დომენის კვალიფიციურ იდენტიფიკატორებს, ხოლო მოთხოვნებს შეუძლიათ ჩამოთვალონ დომენების ან დომენისათვის მიკუთვნებული ობიექტების პოვნა. ანგარიშები თავად არ არის დომენური მიმდინარე მონაცემთა მოდელში, მაგრამ ანგარიშებს შეუძლიათ ჰქონდეთ დომენები და ინახონ აქტივები, რომელთა განსაზღვრებაც დომენებში ცხოვრობს.

იხილეთ ასევე:

- [მსოფლიო](/ka/blockchain/world.md)
- [აქტივები](/ka/blockchain/assets.md)
- [მეტამონაცემები](/ka/blockchain/metadata.md)
- [დასახელების წესები](/ka/reference/naming.md)
