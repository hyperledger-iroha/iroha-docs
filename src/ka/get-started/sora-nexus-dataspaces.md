---
translation_locale: ka
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3: Taira და Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 არის აპლიკაციების მიმართულებით შექმნილი საჯარო განთავსების გზა Iroha 3 და SORA Nexus. ააშენეთ და რეპეტირდით Taira ჯერ, შემდეგ გადაიტანეთ იგივე კლიენტის ფორმაში Minamoto მხოლოდ მაშინ, როდესაც თქვენ გაქვთ ცალკე ძირითადი ქსელი გასაღები, ნამდვილი XOR გადასახადებისა და წარმოების დამტკიცებისათვის.

აღნიშნული სახელმძღვანელო აჩვენებს, თუ როგორ უნდა კონფიგურდეს Iroha კლიენტი საზოგადოებისთვის SORA 3 ქსელი:

- Taira საგამოცდო ქსელი `https://taira.sora.org`
- Minamoto ძირითადი ქსელი: `https://minamoto.sora.org`

გამოიყენეთ Taira ინტეგრაციის ტესტებისთვის, სატესტო ქსელი-ის მიერ დაფინანსებული წერის კანარიებისა და განთავსების რეპეტიციებისათვის. გამოიყენოთ Minamoto მხოლოდ წარმოებისთვის მზად მყოფი ძირითადი ქსელის აქტივობისთვის. ორივე ქსელი აგებს გადასახადებს XOR:

- Taira იყენებს საჯარო სატესტო ქსელის დაფინანსების სამსახურის ტესტნეტს XOR.
- Minamoto იყენებს რეალურ XOR. არ არსებობს ტესტნეტების დაფინანსების სერვისი Minamoto.

## მშენებლობის გზა {#builder-path}

|ნაბიჯი |Taira ტესტის ქსელი |Minamoto მაინეთ |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|დაიწყეთ წაკითხვა ქსელის მდგომარეობა |მოთხოვნა `/status` გარეშე გასაღები |მოთხოვნა `/status` გარეშე გასაღები |
|აირჩიეთ მონაცემთა სივრცე |გამოიყენეთ საჯარო `universal` თუ თქვენს აპლიკაციას არ სჭირდება მართული აღსრულების ზოლი |გამოიყენეთ იგივე მონაცემთა სივრცე მხოლოდ მას შემდეგ, რაც მთავარმა ქსელმა დაამტკიცა|
|მიიღეთ საფასური აქტივი.|გამოიყენეთ საჯარო Taira სატესტო ქსელი-ის დაფინანსების სერვისი |მიიღეთ XOR დაფინანსებული Minamoto ანგარიშიდან ან დამტკიცებული სახაზინო ნაკადისგან |
|ტესტი წერს |გამოყენება ტესტის ქსელის მიერ დაფინანსებული ტესტი XOR |არ გამოიყენოთ ტესტი ინსტრუმენტები; წერა ხარჯავს რეალური XOR |
|გააქტიურეთ |კვლავ შეეცადეთ ლოგიკა, მონიტორინგი და კრიპტოგრაფიული ხელმოწერა |გამოიყენეთ ცალკე გასაღები, დაფინანსება და გათავისუფლების კონტროლი |

პრაქტიკული ნაკადი არის:

1. შექმნათ კლიენტი Taira-ის წინააღმდეგ და გამოიყენეთ საჯარო `universal` მონაცემთა სივრცე.
2. დამატება კრიპტოგრაფიული ხელმოწერა და მისი დაფინანსება Taira ტესტური მონეტების გამცემით.
3. გამოიყენეთ თქვენი აპლიკაციის ლოგიკა Taira -ის წინააღმდეგ, სანამ შეცდომები მოსაწყენი და საყურადღებოა.
4. შეიქმნას ცალკე Minamoto კრიპტოგრაფიული ხელმოწერა, დააფინანსოს იგი რეალური XOR და გადაიყვანოს მხოლოდ იგივე დამტკიცებული ოპერაციები ძირითადი ქსელი.

## განაგრძეთ კულინარიის გამოყენება {#continue-with-the-cookbook}

გამოიყენეთ ეს სახელმძღვანელო ქსელის შესარჩევად, კრიპტოგრაფიული ხელმოწერის კონფიგურაციისთვის და ფონდების გადასახდელებისთვის. შემდეგ გააგრძელეთ რეცეპტი, რომელიც შეესაბამება აპლიკაციის ქცევას, რომელსაც გსურთ შექმნათ:

|მიზანი |რეცეპტი |
| --- | --- |
|შეამოწმეთ Taira და დააყენეთ კლიენტი |[გაერთიანება Taira](/ka/cookbook/connect-to-taira.md) |
|გამოგზავნეთ პირველი წერა და შეამოწმეთ მისი შედეგი |[ტრანზაქციების წარდგენა და შემოწმება](/ka/cookbook/submit-and-verify-transactions.md) |
|რეგისტრაცია, გამოცემა და გადაადგილება |[ფუნქციური აქტივები](/ka/cookbook/fungible-assets.md) |
|წაკითხვა ფილტრირებული განაცხადის მდგომარეობა |[საკვანძო ბლოკჩეინის რეესტრი სახელმწიფო](/ka/cookbook/query-ledger-state.md) |
|რეაგირება საბოლოო ცვლილებებზე |[მოვლენების გადაცემა](/ka/cookbook/stream-events.md) |

სამზარეულოს წიგნი ინარჩუნებს თითოეულ სამუშაო პროცესზე კონცენტრირებას და აქ უკავშირდება მას, როდესაც მას სჭირდება Taira დაფინანსება ან SORA Nexus ქსელის კონტექსტი.

## 1. გაიგე, თუ რას აპირებ {#_1-understand-what-you-are-setting-up}

SORA Nexus-ში, მონაცემთა სივრცე შედის ქსელის შესრულების ბილიკისა და მარშრუტის კატალოგის ნაწილად. კლიენტი არ ქმნის ახალ საჯარო მონაცემთა სიფერს მხოლოდ იმით, რომ შეცვლის `client.toml`. კლიენტის კონფიგურაცია აკეთებს ორ რამეს:

1. მიუთითებს კლიენტს მარჯვენა Torii API ბოლო წერტილში.
2. აირჩევს დომენის და მონაცემთა სივრცის მარშრუტის კონტექსტს მისი კანონიკური ანგარიშისთვის

`AccountId` ყოველთვის არის კანონიკური და დომენების გარეშე. `[account].domain` მნიშვნელობა `client.toml` უზრუნველყოფს მარშრუტის კონტექსტს და საგნელს; ის არ ხდება ანგარიშის იდენტობის ნაწილი. უმეტეს აპლიკაციებში, დაიწყეთ საჯარო `universal` მონაცემთა სივრცით. დომენის კონტექსტი იყენებს ფორმას `domain.dataspace`, მაგალითად:

```text
wonderland.universal
```

თუ თქვენ გჭირდებათ ახალი საორგანიზაციო მონაცემთა სივრცე, შეადგინეთ კატალოგი და მარშრუტის წინადადება ჩვეულებრივი კლიენტის ანგარიშით რეგისტრაციის ნაცვლად. იხილეთ [ახალი მონაცემთა სივრცის უზრუნველყოფა](#_8-provision-a-new-dataspace) ქვემოთ.

## 2. შეამოწმეთ საჯარო Torii API საბოლოო წერტილი {#_2-check-the-public-torii-endpoint}

შეამოწმეთ, რომ მიზნობრივი API საბოლოო წერტილი ცოცხალია კრიპტოგრაფიული ხელმოწერის კონფიგურაციამდე.

Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

შეამოწმეთ მონაცემთა სივრცე და განხორციელების ბილიკის ხედი, რომელიც აღმოაჩინეს კვანძით:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

გამოიყენეთ იგივე ბრძანება `https://minamoto.sora.org/status` ძირითადი ქსელისათვის.

## Taira MCP აგენტებისთვის {#taira-mcp-for-agents}

Taira ასევე გამოხატავს Torii-მდევრული მოდელის კონტექსტის პროტოკოლის (MCP) ხიდს აგენტის შესრულების გარემოსთვის. გამოიყენეთ მას მაშინ, როდესაც აგენტს სჭირდება ცოცხალი ტესტნეტის წაკითხვა, სკრიპტირებული დიაგნოზი ან მჭიდრო რევიზირებული წერის რეპეტიციები, ჯერ არ შექმნას მორგებული Torii კლიენტი.

|დაყენება |ღირებულება |
| --- | --- |
|MCP API ბოლო პუნქტი |`https://taira.sora.org/v1/mcp` |
|ქსელის ფესვი |`https://taira.sora.org` |
|განზრახ გამოყენება |Taira სატესტო ქსელი წაკითხვა და სატესტო ქსელი-ფინანსირებული წერა რეპეტიციები |
|წარმოების ეკვივალენტი |არ მიუთითოთ ეს მითითება Minamoto, თუ ძირითადი ქსელის MCP API საბოლოო წერტილი და გამონაბოლქვის კონტროლები ოდნავ არ არის დამტკიცებული.|

შეამოწმეთ ხიდის მეტამონაცემები ხელმოწერის მასალის დამატებამდე:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

კონფიგურირება URL როგორც მომხმარებლის ადგილობრივი MCP სერვერი აგენტის შესრულების გარემოში. არ შეინახოთ საწყისი კონტროლში აგენტის MCP კონფიგურა, API ტოქნები, გადამისამართებული ავტთაღელვები, `authority`, ან `private_key` ღირებულებები ამ დოკუმენტების რეპოში ან აპლიკაციის რეპოში.

სააგენტო მოთხოვნის წესები, რომლებიც კარგად მუშაობს Taira:

- აღმოაჩინეთ ინსტრუმენტები MCP სერვერზე მათ დარეკვის წინ; კვლავ აღმოაჩინოთ, თუ სერვერი ანგარიშებს `listChanged` ავრცელებს.
- უპირატესობა აქვს კურირებულ `iroha.*` ინსტრუმენტებს ნედლეულის `torii.*` ინსტრუმენტით.
- დაიწყეთ მხოლოდ წაკითხვა: შეამოწმეთ სტატუსი, ანგარიშები, აქტივები, ალიასები, ბლოკები, მმართველობის მდგომარეობა და ტრანზაქციის სტატუსი წინადადებების წერამდე.
- მოითხოვეთ ადამიანის მკაფიო ინსტრუქცია ცოცხალი ტესტნეტის მუტაციების წინ. წინასწარ ხელმოწერილი ტრანზაქციის მონაცემთა კონტეინერებისთვის გამოიყენეთ `iroha.transactions.submit_and_wait`, ასე რომ აგენტი ელოდება შედეგს, ნაცვლად იმისა, რომ მხოლოდ წარადგინოს.
- შეაჯამეთ ტრანზაქციის კრიპტოგრაფიული ჰეშები, საბოლოო მდგომარეობა და სერვერის ვალიდააციის შეცდომები აგენტის პასუხში.

### განვითარების სამუშაო პროცესები აგენტებთან ერთად {#development-workflow-with-agents}

გამოიყენეთ აგენტები როგორც განვითარების დამხმარეები Iroha კლიენტებისთვის, ტრანზაქციის შემქმნელებისთვის, დიაგნოსტიკური სკრიპტების და სატესტო ქსელი საოპერაციო ინსტრუქციები. შეინახეთ აგენტის ავტორიზაციის პრინციპი ვიწრო: მას შეუძლია შეამოწმოს კოდი, წაიკითხოს Taira მდგომარეობა, შესთავაზოს ცვლილებები და განახორციელოს ადგილობრივი ტესტები, მაგრამ ის არ უნდა შეცვალოს ცოცხალი ქსელი სანამ ადამიანი არ დაამტკიცებს ზუსტ ოპერაციას.

პრაქტიკული სამუშაო მიმდინარეობაა:

1. სთხოვეთ აგენტს, შეამოწმოს შესაბამისი დოკუმენტები, SDK კოდი, CLI ბრძანება ან MCP ინსტრუმენტის სქემა სანამ კოდის დაწერა.
2. ეწვიეთ აგენტს დაწეროს ყველაზე პატარა კლიენტის გზა ჯერ: სტატუსის შემოწმება, ანგარიშის ძებნა, ანალოგიური რეზოლუცია, ან ბალანსი ძებნა.
3. დამატება ტრანზაქციების შექმნის კოდი მხოლოდ მას შემდეგ, რაც API მხოლოდ წაკითხვის მოთხოვნა მუშაობს Taira წინააღმდეგ.
4. ცოცხალ ქსელზე ტესტები მხოლოდ აშკარა ჩართვით გაუშვით, მაგალითად `TAIRA_LIVE=1`-ის დაყენებისას, რათა ჩვეულებრივი ერთეულის ტესტის გაშვებამ სატესტო ქსელის სახსრები არასოდეს დახარჯოს და ქსელის ხელმისაწვდომობაზე არ იყოს დამოკიდებული.
5. მოითხოვეთ აგენტს, შეატყობინოს ქსელის ფესვი, ჯაჭვი, ავტორიზაციის ძირითადი ანგარიში, ინსტრუქციის შეჯამება, საფასურის აქტივი და მოსალოდნელი მდგომარეობის ცვლილება ნებისმიერი ტრანზაქციის წარდგენის წინ.
6. შეამოწმეთ გენერირებული კოდი საიდუმლო მოხმარების, განმეორებითი მცდელობის ქცევის, idempotency- ის და უარყოფის მოხმარებისათვის, სანამ იგი CI ან ძირითადი ქსელის სამუშაო პროცესებში გადაიყვანთ.

სასარგებლო მხოლოდ წაკითხული MCP ინსტრუმენტები განვითარებისთვის მოიცავს ანგარიშის აქტივების ძებნას, ალიასი რეზოლუციას, ბლოკების ძებნას, ტრანზაქციის ძიებას, ტრანზაქციულ სიებს და დამუშავების კონვეიერის სტატუსის შემოწმებას. გამოიყენეთ ეს ნდობის შესაქმნელად ნებისმიერი ხელმოწერილი დატვირთვის წარდგენამდე.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ტრანზაქციული სამუშაო პროცესები აგენტების მეშვეობით {#transaction-workflow-through-agents}

MCP ხიდს შეუძლია წარადგინოს ხელმოწერილი Iroha ტრანზაქცია, მაგრამ ეს არ აშორებს ჩვეულებრივ ტრანზაკციის მოთხოვნებს. ტრანზიციას ჯერ კიდევ სჭირდება სწორი ავტორიზაციის პრინციპალი, ნებართვები, საფასურის დაფინანსება, ჯაჭვის ID, მეტადატატი და ხელმოწერა.

ნედლეული Iroha ტრანზაქციებისათვის, შექმენით და ხელი მოაწერეთ ტრანზაკციის მონაცემთა კონტეინერზე პირველ რიგში SDK ან CLI ფუნქციებით, შემდეგ კი აგენტს მხოლოდ კანონიკურად ხელმოწერილი ტრანზაქციის ბიტები, კოდირებული `body_base64`. აგენტს შეუძლია წარადგინოს მონაცემთა კონტეინერი `iroha.transactions.submit_and_wait`-ზე ან წარადგინონ `iroha.transactions.submit`-ზე და გამოკითხვა `iroha.transactions.wait`.

არ ჩასვათ პირადი გასაღები აგენტის შეტყობინებაში. თუ აგენტს უნდა შექმნას ტრანზაქცია, მიმართეთ მას ადგილობრივ კოდზე, რომელიც ატვირთავს საიდუმლოებებს მომხმარებლის შესრულების გარემოში გარემო, საკვანძო ჯაჭვი, აპარატური კრიპტოგრაფიული ხელმოწერა ან იგნორირებული სატესტო ქსელი კონფიგურაციის ფაილი. აგენტი არასდროს უნდა დაწეროს საკვანძიო მასალა Markdown- ში, ტესტის არტეფაქტები, ლოგები ან საბოლოო შეასრულებს.

გარიგების წარდგენის წინ, აგენტს მოუწოდეთ შეადგინოს მოკლე გარიგებების გეგმა:

- `network`: Taira ტესტნეტის ფესვის და ჯაჭვის ID
- `authority`: ანგარიში, რომელიც ხელს უწერს და გადაიხდის საფასურებს
- `instructions`: რეგისტრაცია, გაცემა, განადგურება, გადაცემა, მეტადიტები, ნებართვა ან ხელშეკრულების ტექნიკური მოწოდების შეჯამება
- `fee asset`: აქტივი, რომელიც გადაიხადება Taira
- `preflight reads`: უკვე განხორციელებული ანგარიშის, აქტივების ბალანსის, ნებართვების, ალიასის ან ბლოკის შემოწმება
- `expected result`: მდგომარეობა, რომელიც უნდა იყოს ხილული დადასტურების შემდეგ.
- `idempotency`: რა მოხდება იმ შემთხვევაში, თუ იგივე მოთხოვნა განმეორებით განიხილება

წარდგენის შემდეგ, აგენტს უნდა დაელოდოს ტერმინალური სტატუსის მოლოდინში, შემდეგ შეამოწმეთ მდგომარეობის ცვლილება კითხვის მოთხოვნით. სასარგებლო დასრულების ანგარიში შეიცავს:

- ტრანზაქციის კრიპტოგრაფიული ჰეში
- ტერმინალის სტატუსი, როგორიცაა `Committed`, `Applied`, `Rejected` ან `Expired`
- ბლოკის ან ექსპლუატორის დეტალები, როდესაც ხელმისაწვდომია
- შემოწმების შედეგები
- უარყოფის შეტყობინება და გამოიყურება თუ არა ჩავარდნა ნებართვებთან, საფასურებთან, ვალიდაციასთან, მოძველებულ მდგომარეობაში ან API-ის საბოლოო წერტილის ხელმისაწვდომობასთან.

მაგალითი დაცული მოწოდება:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

როდესაც ხელმოწერილი მონაცემთა კონტეინერი უკვე მომზადებულია:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP საჯარო ტესტნეტის მართვის ზედაპირად უნდა იყოს განკუთვნილი. Taira გასაღები, სატესტო ქსელი XOR, სატესტო ქსელი-ის დაფინანსების მომსახურების ანგარიშები და კანარიული კრიპტოგრაფიული ხელმოწერები ერთჯერადი გამოსაყენებელია და უნდა დარჩეს ცალკე Minamoto გასაღებებისაგან და წარმოების გათავისუფლების სამუშაო პროცესებიდან.

## სათამაშოების მაგალითები, რომელთა გამოცდა შეგიძლიათ ახლა {#toy-examples-you-can-try-now}

ეს მაგალითები არის მხოლოდ წაკითხვა, თუ არ აღინიშნება. ისინი მუშაობენ სანამ თქვენ გენერირებთ გასაღებს და უსაფრთხოა ორივე საჯარო ქსელის წინააღმდეგ.

შედარება Taira სატესტო ქსელისა და Minamoto ძირითადი ქსელის ჯანმრთელობის შესახებ:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

ჩამოთვალეთ საჯარო მონაცემთა სივრცის განხორციელების ზოლები, რომლებიც Taira -ის მიერ არის გამოფენილი:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

განახორციელეთ იგივე ბრძანება Minamoto -ის წინააღმდეგ, როდესაც საჭიროა ძირითადი ქსელის ხედი:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

შეიქმნას პატარა Node.js სტატუსის ძებნა დაშბორდის, ბოტის ან განთავსების შემოწმებისთვის:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

პირველი წერის გვერდითი სათამაშო უნდა იყოს Taira ტესტური მონეტების გამცემის მოთხოვნა. იგი იყენებს ტესტნირს XOR და არასოდეს უნდა მიუთითოს Minamoto.

## 3. შექმენით Taira კლიენტის კონფიგურაცია {#_3-create-a-taira-client-config}

გენერირება საკვანძო წყვილი, თუ თქვენ ჯერ არ გაქვთ ერთი:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

შეიქმნას `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

უმაღლესი დონე `chain` არის ზუსტი Taira ტრანზაქციის ჯაჭვის ID. `[account].profile = "taira"` პარამეტრი დამოუკიდებლად ირჩევს ჯაჭვური დისკრიმინანტი Taira I105. ჯაჭვიანი ID არ ირჩევს ანგარიშის პროფილს.

შეამოწმეთ მხოლოდ წაკითხვისთვის:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

ჩატარდეს საჯარო Taira დიაგნოსტიკა, სანამ წერილობითი ტესტები:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

საკომისიოს გადამხდელი ჩაწერის ოპერაციების გაშვებამდე Taira-ს ანგარიში გამცემის მეშვეობით დააფინანსეთ. გამცემის პირდაპირი ნაკადი აღწერილია სექციაში [Taira-ზე სატესტო XOR-ის მიღება](#_4-get-testnet-xor-on-taira).

მას შემდეგ, რაც ტესტური მონეტების გამცემის მოთხოვნა მიიღება და ანგარიში დაფინანსდება, Taira კანარი არის სავალდებულო წერითი სიგარეტის გამოცდა:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

კანარი წარადგენს ხელმოწერილი პინგს, ელოდება დადასტურებას და წერს შესრულების გარემოს კრიპტოგრაფიული ხელმომწერის კონფიგურაციას, როდესაც `--write-config` მოწოდებულია. Taira არის საჯარო ტესტის ქსელი, ასე რომ რიგის გაჯერება შეიძლება გამოიწვიოს ხელმოწერილი პინგის წარუმატებლობა მაშინაც კი, როდესაც თვითონ მუშაობს ტესტური მონეტების გამცემი. თუ `taira doctor` იუწყება გაჯერებულ რიგს ან კანარი უბრუნებს `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` , დაელოდეთ და კიდევ ერთხელ სცადეთ, სანამ ამას კლიენტის კონფიგურაციის შეცდომად მიექცევით.

უპატრონოდ მოწევის გამოცდებისათვის, კანარის შეფუთვისას საზღვრული საცდელი წრეში მოათავსეთ:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

შეწყვიტეთ განმეორებითი მცდელობა, თუ `iroha taira doctor` აჩვენებს მძიმე წარუმატებლობებს. რიგის გაჯერება და საფასურის მიღების უარყოფა არის გარდამავალი საზოგადოებრივი ტესტის ქსელის პირობები; DNS, TLS ან `status = "fail"` დიაგნოსტიკები არ არის.

## შეიქმნას SORA Nexus ანგარიშის ID {#generate-a-sora-nexus-account-id}

SORA Nexus ანგარიშის ID არის კანონიკური I105 მისამართი, რომელიც გამომდინარეობს ანგარიშის საჯარო გასაღებიდან და სამიზნე ქსელის პრეფიქსიდან. ეს არ არის `[account].domain` ღირებულება კლიენტში TOML. ერთი და იგივე საჯარო გასაღები კოდირებს სხვადასხვა ID-ებს Taira და Minamoto, ხოლო წარმოების მომხმარებლებმა უნდა შექმნან ცალკე გასაღები წყვილი Minamoto.

გენერირება ან დატვირთვა Ed25519 საკვანძო წყვილი, რომელიც მართავს ანგარიში:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

კონვერტირება საჯარო გასაღები Taira ანგარიშის ID-ში:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

კონვერტირება Minamoto საჯარო გასაღები ძირითადი ქსელის პრეფიქსით:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

გამოიყენეთ მიღებული ანგარიშის ID, სადაც Nexus API ან CLI ბრძანება მოითხოვს კანონიკური ანგარიშის იდენტიფიკაციას, მაგალითად, ტესტური მონეტების გამცემი Taira `account_id`, ბალანსი მოთხოვნები, მკაცრი ანგარიშის ველები ან ალიასი ვალდებულებები. შეინახეთ შესაბამისი კერძო გასაღები კლიენტის კონფიგურაციაში და აირჩიეთ იგივე საჯარო ქსელი `[account].profile = "taira"` ან `[account].profile = "minamoto"`.

ID-ის გენერირება თავისთავად არ ქმნის ფინანსურ ქსელზე ანგარიშს. Taira -ზე, სატესტო ქსელი-ის დაფინანსების სამსახურს შეუძლია შექმნას და დაფინანსოს ანგარიში სატესტო ქსელი წერისათვის. Minamoto -ზე, გამოიყენეთ დამტკიცებული ძირითადი ქსელი-ის ჩართვა ან საგანგებო ნაკადი.

### საკვანძოების შენახვა და რეგისტრაცია {#key-storage-and-backup}

ანგარიშის იდენტიფიკაცია და საჯარო გასაღები შეიძლება გაზიარდეს. შესაბამისი კერძო გასაღები, პაროლი ფრაზა, თესლი და აღდგენის მასალა უნდა იყოს საიდუმლო.

გამოიყენეთ ეს პრაქტიკა SORA Nexus ანგარიშებისთვის:

- ინახეთ კერძო გასაღები დაშიფრულ პაროლი მენეჯერში, აპარატურული მხარდაჭერით უზრუნველყოფილი საკვანძო მაღაზიაში ან სპეციალურ ხელმოწერის სერვისში. არ დატოვოთ პროტოკოლის განხორციელების გასაღები წყარო კონტროლისთვის ან პროდუქციის გასაღები ქელის ისტორიაში, ლოგებში, ჩატში, ბილეთებში ან გაუმშიფრებულ სარეზერვო ასორტიმენტებში.
- გამოიყენეთ უნიკალური მაღალი ენტროპული პაროლი თითოეული საფონდის ან წარმოების კრიპტოგრაფიული ხელმოწერისთვის. პაროლები ინახეთ პაროლის მენეჯერში ან გაყოფილი შენახვის პროცესში, და არა იმავე ფაილში ან სარეზერვო ბუნდელში, როგორც ჩიფრებული პირადი გასაღები.
- შეინახეთ Taira და Minamoto გასაღები ცალკე. განიხილეთ Taira გასაღები როგორც ერთჯერადი საცდელი ქსელის მასალა და Minamoto გასაღები, როგორც წარმოების ფონდების ავტორიზაციის პრინციპი.
- კერძო გასაღები, საჯარო გასაღები , ანგარიშის ID, ანგარიშის პროფილი და ნებისმიერი ანგარიშის აღდგენის ან შენახვის ჩანაწერები, რომლებიც საჭიროა კრიპტოგრაფიული ხელმოწერილის აღსადგენად. ქსელის კონტექსტის გარეშე პირადი გასაღები ადვილია ბოროტად გამოყენების დროს აღდგენისას .
- შეინარჩუნეთ მინიმუმ ერთი დაშიფვრილი ოფლაინ სარეზერვო სათადარიგო სისტემა და ერთი გეოგრაფიულად ცალკე დაშიფრებული სარეზერივო სისტემა წარმოების კრიპტოგრაფიული ხელმოწერებისთვის. ტესტით აღდგენა მხოლოდ წაკითხვის მცირე ოპერაციით ადრე, რაც დამოკიდებულია სარეზორვო სისტემაზე.
- გააქტიურეთ ან შეცვალეთ კრიპტოგრაფიული ხელმოწერა, თუ შეიძლება გამოავლინეს პირადი გასაღები, პაროლი, სარეზერვო მედია ან ხელმოწერის ჰოსტერი.

დეტალური ინფორმაცია იხილეთ [კრიპტოგრაფიული გასაღების შენახვა](/ka/guide/security/storing-cryptographic-keys.md) და [პაროლის დაცვა](/ka/guide/security/password-security.md).

## 4. მიიღეთ ტესტნეტი XOR Taira {#_4-get-testnet-xor-on-taira}

გამოიყენეთ პირდაპირ საჯარო ტესტური მონეტების გამცემი. ნაკადი:

1. გენერირება ან დატვირთვა კრიპტოგრაფიული ხელმომწერის და გამოითვალოს მისი კანონიკური Taira ანგარიშის ID.
2. მიიღეთ ტესტური მონეტების გამცემის მიმდინარე თავსატეხი.
3. დარეგულირება, თუ `difficulty_bits` აღემატება `0`.
4. წარადგინეთ ტესტური მონეტების გამცემის მოთხოვნა.
5. დაველოდოთ ანგარიშის ან აქტივების ბალანსის ხილვას, სანამ გადასახადის გადახდის წერილებს გაგზავნით.

კონვერტირება საჯარო გასაღები Taira I105 ანგარიშის ID-ში, რომელიც მოსალოდნელია ტესტური მონეტების გამცემის მიერ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

მიიღეთ თავსატეხი:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

სატესტო ქსელი-ის დაფინანსების სერვისი არის საჯარო სატესტო ქსელი-ის სერვისი. თუ თავსატეხი ან პრეტენზია API საბოლოო წერტილი ბრუნდება `502`, დროგამოშვება ან სხვა გეტვეის დონეზე შეცდომა, დაელოდეთ და კიდევ ერთხელ სცადეთ სანამ შეცვლით თქვენს გასაღებს ან კლიენტის კონფიგურაციას .

პასუხს აქვს შემდეგი ფორმა:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

როდესაც `difficulty_bits` არის `0`, წარადგინეთ მხოლოდ ანგარიშის ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

როდესაც `difficulty_bits` აღემატება `0`-ს, მოაგვარეთ თავსატეხი და შეიყვანეთ ანკერის სიმაღლე პლუს კრიპტოგრაფიული ნონსის მნიშვნელობა:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

აალგორითმაა:

1. გამოწვევის შექმნა როგორც SHA-256:
   - `iroha:accounts:faucet:pow:v2` ბაიტების
   - ანგარიშის ID UTF-8
   - `anchor_height` როგორც დიდი-endian `u64`
   - `anchor_block_hash_hex` დეკოდირებულია ბაიტებად
   - `challenge_salt_hex` დეკოდირებულია ბაიტებად, როდესაც არსებობს
2. სცადეთ `u64` ნონსები, რომლებიც დიდბოლოიან 8-ბაიტიან მნიშვნელობებად არის კოდირებული.
3. თითოეული კრიპტოგრაფიული nonce ღირებულებისათვის, გაუშვით scrypt შემდეგით:
   - პაროლი: 8-ბაიტიანი კრიპტოგრაფიული ნონსის მნიშვნელობა
   - მარილი: 32-ბაიტიანი გამოწვევა
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - გამოშვების სიგრძე: 32 ბაიტი
4. გამარჯვებული კრიპტოგრაფიული ნონცის ღირებულება არის პირველი კრიპტგრაფიული დიჟესტის ღირებულება, რომელსაც მინიმუმ `difficulty_bits` უპირატესობა აქვს ნულოვანი ბიტების.

გამცემის პასუხი შეიცავს დაფინანსებულ აქტივსა და რიგში ჩასმული ტრანზაქციის ჰეშს:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

რეაგირება ამჟამად აღინიშნება HTTP `202 Accepted`. მისი `asset_definition_id` არის მიმდინარე საფასური აქტივი Taira, რომელიც ფინანსდება საჯარო ტესტური მონეტების გამცემით; შეამოწმეთ პასუხი, ნაცვლად იმისა, რომ ასახელოთ მაგალითის ID. ტესტური მონეტების გამცემმა მიიღო მოთხოვნა, როდესაც ის დაბრუნებს `tx_hash_hex` და `status: "QUEUED"`.

შემდეგ გამოკითხეთ დაფინანსებული აქტივი, სანამ წარადგინებთ საკუთარ საფასურის გადახდის ოპერაციებს:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

თუ სატესტო ქსელი-ის დაფინანსების სერვისის მოთხოვნა მიიღეს, მაგრამ ანგარიში ან აქტივი ჯერ კიდევ არ არის ხილული, ტრანზაქცია კვლავ საჯარო სატესტო ქსელი რიგის დამუშავების მიღმაა. ელოდეთ და შეეცადეთ წაკითხვა, სანამ გაგზავნით წერას.

მზა პირდაპირი API შემოწმებისათვის, შეინახეთ ეს როგორც `taira_faucet_claim.py` და გადაიტანეთ Taira I105 ანგარიშის ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

გამცემი მხოლოდ Taira-ს სატესტო ქსელის სახსრებისთვისაა განკუთვნილი. Minamoto-ს ნაკადებში არ გამოიყენოთ სატესტო ქსელის XOR, გამცემის ანგარიშები ან Taira-ს საკონტროლო ხელმომწერები.

## 5. შექმნათ Minamoto კლიენტის კონფიგურაცია. {#_5-create-a-minamoto-client-config}

გამოიყენეთ ცალკე საკვანძო წყვილი Minamoto. არ გამოვიყენოთ Taira საკვები ძირითადი ქსელისათვის.

შეიქმნას `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ზედა დონის `chain` არის Nexus-ის მიმდინარე ძირითადი ქსელის ჯაჭვის ID. `[account].profile = "minamoto"` ირჩევს Minamoto I105-ის ჯაჭვის დისკრიმინანტს; API-ის საბოლოო წერტილის ჰოსტის სახელი და ჯაჭვის ID მას ავტომატურად არ ირჩევს.

კონვერტირება Minamoto საჯარო გასაღები მისი ერთიანი პროტოკოლური სტანდარტის I105 ანგარიშის ID- ში ძირითადი ქსელის პრეფექსით:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

განახორციელეთ მხოლოდ წაკითხული გვერდითი შემოწმებები, სანამ ანგარიში არ იქნება უზრუნველყოფილი და დაფინანსებული მთავარ ქსელში ჩართვის ან მმართველობის ნაკადის მეშვეობით:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

არ გამოიყენოთ Taira ტესტური მონეტების გამცემი ან წერის კანარიური დამხმარე საშუალება Minamoto-ზე.

## 6. დაფინანსება Minamoto ანგარიშზე XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto საფასურები გადაიხადება წარმოებით XOR, ხოლო Minamoto არ გააჩნია საჯარო ტესტური მონეტების გამცემი. დაფინანსეთ კონფიგურირებული ანგარიში მთავარ ქსელზე დამტკიცებული ჩართვით ან საკანონმდებლო გადარიცხვით, ან მიიღეთ XOR არსებული დაფინანსებული Minamoto ანგარიშიდან.

შეამოწმეთ კანონიკური ანგარიშის ID და დაფინანსება მხოლოდ წაკითხვითი შემოწმებით, სანამ წარადგინებთ წერას. განიხილეთ Minamoto XOR როგორც წარმოების ფონდი: პირველ რიგში გაეცადეთ იგივე ოპერაცია Taira-ზე, ინახეთ ცალკე წარმოების გასაღები და არ ჩათვალოთ, რომ ძირითადი ქსელის ტრანზაქცია შეიძლება განახლდეს.

Taira XOR არ შეუძლია გადაიხადოს Minamoto საფასურები. სატესტო ქსელი-ის ბალანსი და სატესტო ქსელი-ის ფინანსური მომსახურების მოთხოვნები არ გადაეცემა Minamoto.

## 7. მუშაობა არსებული მონაცემთა სივრცეში {#_7-work-inside-an-existing-dataspace}

გამოიყენეთ სრულად კვალიფიცირებული დომენის სახელები ბლოკჩეინის რეესტრის ობიექტებისთვის, რომლებიც ცხოვრობენ მონაცემთა სივრცეში. მაგალითად, საჯარო მონაცემთა სიბანეში პროექტის დომენმა უნდა გამოიყენოს:

```text
apps.universal
```

მას შემდეგ, რაც თქვენს ანგარიშს აქვს საჭირო ნებართვები, შექმენით საიდუმლოების გარეშე `AliasSetupPlanRequestV1` განზრახვა დომენისათვის და გამოიყენეთ დეკლარაციური დაგეგმველი:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto -ისათვის უნდა შეიქმნას და დაამტკიცოს ცალკე ძირითადი ქსელის განზრახვა და გეგმა. გეგმები არის დაკავშირებული მათი ჯაჭვი, ავტორიზაციის პრინციპალი, რეალური მდგომარეობის ანქირა და ვადით, ასე რომ Taira გეგმის არ შეიძლება ხელშეწყობა ან გადახდა:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

ანგარიშის ალიასები იყენებენ იმავე მონაცემთა სივრცის ზედმეტს:

```text
alice@apps.universal
alice@universal
```

მკაცრი ანგარიშის ველები კვლავ კანონიკურ I105 ანგარიშის ID-ებს იყენებს. ალიასები აღიქვით ადამიანის მიერ წაკითხვად ბმებად, რომლებიც კანონიკურ ანგარიშის ID-ებად ამოიხსნება.

## 8. ახალი მონაცემთა სივრცის შექმნა {#_8-provision-a-new-dataspace}

ახალი მონაცემთა სივრცე არის ოპერატორის და მმართველობის ცვლილება. საჯარო Torii API საბოლოო წერტილს შეუძლია ავტოტრანსპორტის მიმართულება კონფიგურირებულ მონაცემთა სიბაზეებზე, მაგრამ იგი უარყოფს უცნობი მონაცემთა სიის ალიასებს.

სანამ შეცვლას მოამზადებთ, დაიჭირეთ მიმდინარე ცოცხალი კატალოგი:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ოპერატორის ანგარიშზე, ასევე შეამოწმეთ შესრულების ზოლის ტექნიკური მანიფესტის პოზიცია:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

არ გაავრცელოთ ახალი ალიასი, თუ განხორციელების ზოლის ID, მონაცემთა სივრცის ID, ვალიდატორის კომპლექტი, ხარვეზების ტოლერანტობა, ტექნიკური მანიფესტი, მარშრუტის წესები და ოპერატიული მფლობელი ერთად არ გადამოწმებულა. ჩვეულებრივ მომხმარებელ ანგარიშს საჭირო ნებართვებით შეუძლია შეიძინოს დომენი და მისი SNS გაქირავება არსებული მონაცემთა სივრცეში ალიასი-დამგეგმავი-ის მეშვეობით; მას არ შეუძლია უსაფრთხოდ დაამატოს ახალი საჯარო მონაცემები სივრცე.

კერძო ან ორგანიზაციული მონაცემთა სივრცისათვის, შეადგინეთ კატალოგიური ცვლილება:

- მონაცემთა სივრცის უნიკალური ალიასი და ციფრული `id`
- შესაბამისი შესრულების ზოლის შესვლა ან არსებული შესრულების ზოლის დავალება
- მონაცემთა სივრცე `fault_tolerance`
- ინსტრუქციების ან ანგარიშის ფარგლებში მარშრუტის წესები, რომლებიც იქ უნდა ჩამოვარდეს
- სივრცის კატალოგის მანიფესტი ან დანერგვის ეკვივალენტური მტკიცებულება, როდესაც მონაცემთა სივრცე UAID შესაძლებლობებს ამჟღავნებს
- მმართველობის დამტკიცება ვალიდატორისთვის, შესაბამისობა, ფინანსური ოპერაციების ანგარიშსწორება და მონიტორინგის პოლიტიკა

კონფიგურაციის შესამოწმებადი ფრაგმენტი გამოიყურება ასე:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

ოპერატორის მიღება უნდა მოიცავდეს შემდეგ კარიბჭეებს:

- `iroha3d --sora --config <config.toml> --trace-config` გადადის გადაწყვეტილი კვანძის კონფიგურაცია
- გენერირებული ან გადამოწმებული ტექნიკური მანიფესტი არქივდება კრიპტოგრაფიული ჰეშებითა და ხელმოწერებით.
- სიგარეტის ტესტირება Taira გაიმართება ნებისმიერი Minamoto აქციის წინ.
- ცვლილების შემდეგ `/status` კატალოგში მოცემულია განზრახ შესრულების ზოლი და მონაცემთა სივრცე.
- `iroha app nexus lane-report --summary` არ ირიცხავს საჭირო ტექნიკური მანიფესტების დაკარგვის შესახებ

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ამავე მონაცემთა სივრცის Minamoto განახლება მხოლოდ Taira დანერგვის შემდეგ. სიგარეტის ტესტები, მონიტორინგი, და მმართველობის მტკიცებულებები მთლიანია.

## დაკავშირებული გვერდები {#related-pages}

- [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
- [ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md)
- [კერძო მონაცემთა სივრცეზე მხარდამჭერების გადასახადები](/ka/get-started/private-dataspace-fee-sponsor.md)
- [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md)
- [ბლოკჩეინის გენეზისი რეფერენცია](/ka/reference/genesis.md)
