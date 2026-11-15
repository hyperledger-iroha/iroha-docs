---
translation_locale: ka
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# დომენები {#domains}

დომენები `World`-ში რეგისტრირებული სახელდებული სივრცეებია. Iroha 3-ის მიმდინარე მონაცემთა მოდელში დომენი მშობელი მონაცემთა სივრცით ზუსტდება, ამიტომ კანონიკური იდენტიფიკატორია:

```text
domain.dataspace
```

მაგალითად, `payments.universal` აღნიშნავს `payments` დომენს `universal` მონაცემთა სივრცეში.

## სტრუქტურა {#structure}

რეგისტრირებული `Domain` შეიცავს:

- `id`: მონაცემთა სივრცით დაზუსტებული `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

განზრახვა განსაზღვრავს `payments.universal`-ს, მის რიცხვით მონაცემთა სივრცეს, კანონიკურ I105 მფლობელს, იჯარის შეძენის ვადას და მიმდინარე პოლიტიკის/გადახდის ფასის შემოწმების პირობას. დამგეგმავის ბოლო წერტილია `POST /v1/aliases/setup/plan`; დაბრუნებული გეგმა მიბმულია ჯაჭვზე, უფლებამოსილ სუბიექტზე, მდგომარეობასა და ბოლო ვადაზე. დომენის წასაშლელად კვლავ გამოიყენება [`Unregister`](/ka/blockchain/instructions.md#un-register).

დომენის შექმნა ან ამოღება საჭიროებს სათანადო დომენის მართვის ნებართვას აქტიური შესრულების გარემოს ვალიდატორი. დომენის მეტამონაცემები შეიძლება განახლდეს: [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) როდესაც ავტორიზაციის ხელმძღვანელს აქვს ნებართვა შეცვალოს ეს დომენი.

## განახორციელეთ ეს სამუშაო პროცესი Taira {#try-it-on-taira}

ჩამოთვალეთ დომინები, რომლებიც ამჟამად საჯარო Taira ტესტნეტზე ჩანს:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

შეუსაბამეთ საჯარო არხების კატალოგი მონაცემთა სივრცეების ფსევდონიმებს:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

პირველი ბრძანება გამოიყენეთ, როცა აპლიკაციას დომენის არსებობის შემოწმება სჭირდება. არხების კატალოგით შეამოწმეთ მონაცემთა სივრცესთან დაკავშირებული არხები, მათ შორის თითოეულის საჯარო ან შეზღუდული ხილვადობა და ძირითად არხთან მიმართებით სინქრონიზაციის მდგომარეობა.

დომენის გამართვა საკომისიოს მქონე ჩაწერაა. Taira-ზე ცდამდე დააფინანსეთ ხელმომწერი გვერდზე [სატესტო XOR-ის მიღება Taira-ზე](/ka/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) აღწერილი მომზადების ეტაპიანი პროცესით, შემდეგ გამოიყენეთ გეგმა საკომისიოს გადამხდელის აშკარა მითითებით. CLI ხელმოწერამდე ზუსტ საკომისიოს ითვლის:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
