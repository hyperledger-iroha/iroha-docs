---
translation_locale: ka
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3: Taira და Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 არის აპლიკაციების მიმართულებით შექმნილი საჯარო განთავსების გზა Iroha 3 და SORA Nexus. ააშენეთ და რეპეტირდით Taira ჯერ, შემდეგ გადაიტანეთ იგივე კლიენტის ფორმაში Minamoto მხოლოდ მაშინ, როდესაც თქვენ გაქვთ ცალკე mainnet გასაღები, ნამდვილი XOR გადასახადებისა და წარმოების დამტკიცებისათვის.

აღნიშნული სახელმძღვანელო აჩვენებს, თუ როგორ უნდა კონფიგურდეს Iroha კლიენტი საზოგადოებისთვის SORA 3 ქსელი:

- Taira საგამოცდო ქსელი `https://taira.sora.org`
- Minamoto ძირითადი ქსელი: `https://minamoto.sora.org`

გამოიყენეთ Taira ინტეგრაციის ტესტებისთვის, საფანჯრის მიერ დაფინანსებული წერის კანარიებისა და განთავსების რეპეტიციებისთვის. გამოიყენეთ Minamoto მხოლოდ წარმოებისათვის მზად მყოფი ძირითადი ქსელის საქმიანობისთვის. ორივე ქსელი აგებს გადასახადებს XOR:

- Taira იყენებს საჯარო ონკანის ტესტის ქსელს XOR.
- Minamoto იყენებს რეალურ XOR. არ არსებობს Minamoto ნაღები.

## მშენებლობის გზა {#builder-path}

|ნაბიჯი |Taira ტესტის ქსელი |Minamoto მაინეთ |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|დაიწყეთ წაკითხვა ქსელის მდგომარეობა |გამოკითხვა `/status` გარეშე გასაღები |გამოკითხვა `/status` გარეშე გასაღები |
|აირჩიეთ მონაცემთა სივრცე |გამოიყენეთ საჯარო `universal` თუ თქვენს აპლიკაციას არ სჭირდება მართული ბილიკი |გამოიყენეთ იგივე მონაცემთა სივრცე მხოლოდ მას შემდეგ, რაც მთავარმა ქსელმა დაამტკიცა|
|მიიღეთ საფასური აქტივი.|გამოიყენეთ საყოველთაო Taira ნაღდი |მიიღეთ XOR დაფინანსებული Minamoto ანგარიშიდან ან დამტკიცებული სახაზინო ნაკადისგან |
|ტესტი წერს |გამოიყენეთ საბანქის მიერ დაფინანსებული ტესტი XOR |არ გამოიყენოთ ტესტი ინსტრუმენტები; წერა ხარჯავს რეალური XOR |
|გააქტიურეთ |კვლავ შეეცადეთ ლოგიკა, მონიტორინგი და ხელმოწერა |გამოიყენეთ ცალკე გასაღები, დაფინანსება და გათავისუფლების კონტროლი |

პრაქტიკული ნაკადი არის:

1. შექმნათ კლიენტი Taira-ის წინააღმდეგ და გამოიყენეთ საჯარო `universal` მონაცემთა სივრცე.
2. დაამატეთ ხელმოწერილი და დააფინანსეთ იგი Taira ნაქსით.
3. გამოიყენეთ თქვენი აპლიკაციის ლოგიკა Taira -ის წინააღმდეგ, სანამ შეცდომები მოსაწყენი და საყურადღებოა.
4. შეიქმნას ცალკე Minamoto ხელმოწერილი, დაფინანსოს იგი რეალური XOR და გადაიყვანოს მხოლოდ იგივე დამტკიცებული ოპერაციები mainnet.

## განაგრძეთ კულინარიის გამოყენება {#continue-with-the-cookbook}

გამოიყენეთ ეს სახელმძღვანელო ქსელის შესარჩევად, ხელმოწერის კონფიგურაციისთვის და საფონდო გადასახადებისთვის. შემდეგ გააგრძელეთ რეცეპტი, რომელიც შეესაბამება აპლიკაციის ქცევას, რომელსაც გსურთ შექმნათ:

|მიზანი |რეცეპტი |
| --- | --- |
|შეამოწმეთ Taira და დააყენეთ კლიენტი | [გაერთიანება Taira](/ka/cookbook/connect-to-taira.md) |
|გამოგვიგზავნეთ პირველი წერა და შეამოწმეთ მისი შედეგი | [ტრანზაქციების წარდგენა და გადამოწმება](/ka/cookbook/submit-and-verify-transactions.md) |
|რეგისტრაცია, მონეტა და გადაადგილება | [ფუნქციური აქტივები](/ka/cookbook/fungible-assets.md) |
|წაკითხვა ფილტრირებული განაცხადის მდგომარეობა | [გამოკითხვა Ledger State](/ka/cookbook/query-ledger-state.md) |
|რეაგირება ვალდებულ ცვლილებებზე | [ღონისძიებები](/ka/cookbook/stream-events.md) |

სამზარეულოს წიგნი ინარჩუნებს თითოეულ სამუშაო პროცესზე კონცენტრირებას და აქ უკავშირდება მას, როდესაც მას სჭირდება Taira დაფინანსება ან SORA Nexus ქსელის კონტექსტი.

## 1. გაიგე, თუ რას აპირებ {#_1-understand-what-you-are-setting-up}

SORA Nexus-ში, მონაცემთა სივრცე არის ქსელის ზოლისა და მარშრუტის კატალოგის ნაწილი. კლიენტი არ ქმნის ახალ საჯარო მონაცემთა სიფერს მხოლოდ იმით, რომ შეცვლის `client.toml`. კლიენტის კონფიგურაცია აკეთებს ორ რამეს:

1. მიუთითებს კლიენტს მარჯვენა Torii საწინააღმდეგო წერტილში
2. ირჩევს დომენის და მონაცემთა სივრცის მარშრუტის კონტექსტს თავისი კანონიკური ანგარიშისთვის

`AccountId` ყოველთვის კანონიკური და დომენის გარეშეა. `[account].domain` მნიშვნელობა `client.toml`-ში უზრუნველყოფს მარშრუტირებასა და საგნებით კონტექსტს; ის არ ხდება ანგარიშის იდენტობის ნაწილი. უმეტეს აპლიკაციებში, დაიწყეთ საჯარო `universal` მონაცემთა სივრცედან. დომენის კონტექსტი იყენებს ფორმას `domain.dataspace`, მაგალითად:

```text
wonderland.universal
```

თუ თქვენ გჭირდებათ ახალი საორგანიზაციო მონაცემთა სივრცე, შეადგინეთ კატალოგი და მარშრუტის წინადადება ჩვეულებრივი კლიენტის ანგარიშიდან რეგისტრაციის ნაცვლად. იხილეთ [Provision a New Dataspace](#_8-provision-a-new-dataspace) ქვემოთ.

## 2. შეამოწმეთ საჯარო Torii საბოლოო წერტილი {#_2-check-the-public-torii-endpoint}

შეამოწმეთ, რომ სამიზნე საწინააღმდეგო წერტილი ცოცხალია სანამ კონფიგურირებას ხელმომწერის.

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

შეამოწმეთ მონაცემთა სივრცე და ბილიკის ხედი, რომელიც გამოფენილია კვანძის მიერ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

გამოიყენეთ იგივე ბრძანება `https://minamoto.sora.org/status` ძირითადი ქსელისათვის.

## Taira MCP აგენტებისთვის {#taira-mcp-for-agents}

Taira ასევე გამოყოფს Torii-ის მშობლიურ მოდელის კონტექსტის პროტოკოლს (MCP) აგენტის გამართვის დროს. გამოიყენეთ მას მაშინ, როდესაც აგენტს სჭირდება ცოცხალი ტესტნეტის კითხვა, სკრიპტით დიაგნოსტიკა ან მჭიდრო რევიზირებული წერის რეპეტიციები, ჯერ არ შექმენით მორგებული Torii კლიენტი.

|დაყენება |ღირებულება |
| --- | --- |
|MCP ბოლო წერტილი |`https://taira.sora.org/v1/mcp` |
|ქსელის root |`https://taira.sora.org` |
|განზრახ გამოყენება |Taira ტესტნეტის წაკითხვა და საფანჯრის მიერ დაფინანსებული წერა რეპეტიციები |
|წარმოების ეკვივალენტი |არ მიუთითოთ ეს მითითება Minamoto, თუ ძირითადი ქსელის MCP საბოლოო წერტილი და გამონაბოლქვის კონტროლი არ არის გამოკვეთილი |

შეამოწმეთ ხიდის მეტა მონაცემები ხელმოწერის მასალის დამატებამდე:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

კონფიგურირება URL როგორც მომხმარებლის ადგილობრივი MCP სერვერი აგენტის runtime. არ ჩაბაროს აგენტი MCP კონფიგურირება, API ტოქენები, გადამისამართებული ავტ სათაურები, `authority`, ან `private_key` ღირებულებები ამ დოკუმენტების repo ან აპლიკაციის repo .

სააგენტო მოთხოვნის წესები, რომლებიც კარგად მუშაობს Taira:

- აღმოაჩინეთ ინსტრუმენტები MCP სერვერზე მათ დარეკვის წინ; კვლავ აღმოაჩინოთ, თუ სერვერი ანგარიშებს `listChanged` ავრცელებს.
- უპირატესობა აქვს კურირებულ `iroha.` ინსტრუმენტებს ნედლეულის `torii.` ინსტრუმენტით.
- დაიწყეთ მხოლოდ წაკითხვა: შეამოწმეთ სტატუსი, ანგარიშები, აქტივები, საიდუმლოები, ბლოკები, მმართველობის მდგომარეობა და ტრანზაქციის სტატუსი წინადადებების წერამდე.
- მოითხოვეთ მკაფიო ადამიანის ინსტრუქცია ცოცხალი ტესტნეტის მუტაციების წინ. წინასწარ ხელმოწერილი ტრანზაქციის კონვერტებისათვის გამოიყენეთ `iroha.transactions.submit_and_wait`, რათა აგენტი მხოლოდ წარდგენის ნაცვლად, შედეგს ელოდოს.
- შეაჯამეთ ტრანზაქციის ჰაშები, საბოლოო მდგომარეობა და სერვერის ვალიდააციის შეცდომები აგენტის პასუხში.

### განვითარების სამუშაო პროცესები აგენტებთან ერთად {#development-workflow-with-agents}

გამოიყენეთ აგენტები, როგორც განვითარების დამხმარეები Iroha კლიენტებისთვის, ტრანზაქციების შემქმნელებისთვის, დიაგნოსტიკური სკრიპტებისა და ტესტნეტის რუნბუქებისათვის. შეინარჩუნეთ აგენტის უფლებამოსილება: მას შეუძლია შეამოწმოს კოდი, წაიკითხოს Taira მდგომარეობა, შესთავაზოს ცვლილებები და განახორციელოს ადგილობრივი ტესტები, მაგრამ ის არ უნდა შეცვალოს ცოცხალი ქსელი სანამ ადამიანი არ დაამტკიცებს ზუსტ ოპერაციას.

პრაქტიკული სამუშაო მიმდინარეობაა:

1. სთხოვეთ აგენტს, შეამოწმოს შესაბამისი დოკუმენტები, SDK კოდი, CLI ბრძანება ან MCP ინსტრუმენტის სქემა სანამ კოდის დაწერა.
2. ეწვიეთ აგენტს დაწეროს ყველაზე პატარა კლიენტის გზა ჯერ: სტატუსის შემოწმება, ანგარიშის ძებნა, ანალოგიური რეზოლუცია, ან ბალანსი ძებნა.
3. შემატეთ ტრანზაქციების შექმნის კოდი მხოლოდ მას შემდეგ, რაც მხოლოდ წაკითხვის ზარები მუშაობს Taira.
4. შეინახეთ ცოცხალი ქსელის ტესტების opt-in, მაგალითად `TAIRA_LIVE=1` უკან, ასე რომ ნორმალური ერთეულის ტესტირების run არასდროს ხარჯავს testnet ფონდები ან დამოკიდებულია ქსელის ხელმისაწვდომობა.
5. მოითხოვეთ, რომ აგენტმა ანგარიშზე წარადგინოს ქსელის ფესვი, ჯაჭვი, ავტორიტეტის ანგარიში, ინსტრუქციის შეჯამება, საფასური აქტივი და მოსალოდნელი მდგომარეობის ცვლილება ნებისმიერი ტრანზაქციის წარდგენის წინ.
6. შეამოწმეთ გენერირებული კოდი საიდუმლო მოხმარების, განმეორებითი მცდელობის ქცევის, idempotency- ის და უარყოფის მოხმარებისათვის, სანამ იგი CI ან ძირითადი ქსელის სამუშაო პროცესებში გადაიყვანთ.

სასარგებლო მხოლოდ წაკითხული MCP ინსტრუმენტები შემუშავებისთვის მოიცავს ანგარიშის აქტივების ძებნას, alias რეზოლუციას, ბლოკის ძებნას, ტრანზაქციის ძიებას, ტრანზაქციების სიებს და მილსადენის სტატუსის შემოწმებას. გამოიყენეთ ეს ნდობის შესაქმნელად ნებისმიერი ხელმოწერილი სასარგებლო ტვირთის წარდგენამდე.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ტრანზაქციული სამუშაო პროცესები აგენტების მეშვეობით {#transaction-workflow-through-agents}

MCP ხიდს შეუძლია წარადგინოს ხელმოწერილი Iroha ტრანზაქცია, მაგრამ ეს არ აშორებს ჩვეულებრივ სატრანზაქციო მოთხოვნებს. გარიგებას მაინც სჭირდება სწორი ავტორიტეტი, ნებართვები, მოსაკრებელი დაფინანსება, ჯაჭვი ID, მეტადატანი და ხელმოწერა.

ნედლეულისათვის Iroha ტრანზაქციები, შექმნა და ხელი მოაწეროს ტრანზაკციის კონვერტზე SDK ან CLI პირველ რიგში, შემდეგ აძლევთ აგენტს მხოლოდ კანონიკური ხელმოწერილი ტრანზაქციის ბაიტები კოდირებული როგორც `body_base64`. სააგენტოს შეუძლია წარადგინოს კონვერტი: `iroha.transactions.submit_and_wait`, ან წარადგინოს `iroha.transactions.submit` და გამოკითხვა `iroha.transactions.wait`.

არ ჩასვით პირადი გასაღები აგენტის მოთხოვნა. თუ აგენტს უნდა შექმნას ტრანზაქცია, მიუთითეთ იგი ადგილობრივ კოდზე, რომელიც ატვირთავს საიდუმლოებებს მომხმარებლის runtime გარემო, საკვანძო ჯაჭვი, აპარატურის ხელმოწერა ან იგნორირებული testnet კონფიგურაციის ფაილი. აგენტი არასდროს უნდა დაწეროს საკვანძიო მასალა Markdown- ში, ჩართულობებში, ლოგებს ან კომიტეტებში.

გარიგების წარდგენის წინ, აგენტს მოუწოდეთ შეადგინოს მოკლე გარიგებების გეგმა:

- `network`: Taira სატესტო ქსელის ფესვი და ჯაჭვი ID
- `authority`: ანგარიში, რომელიც ხელს უწერს და გადაიხდის საფასურებს
- `instructions`: რეგისტრაცია, მონტაჟი, დამწვრობა, გადაცემა, მეტადატანი, ნებართვა ან ხელშეკრულების მოწოდების შეჯამება
- `fee asset`: აქტივი, რომელიც გადაიხადება Taira
- `preflight reads`: უკვე განხორციელებული ანგარიშის, აქტივების ბალანსის, ნებართვების, ანალიზის ან ბლოკის შემოწმება
- `expected result`: მდგომარეობა, რომელიც უნდა იყოს ხილული დადასტურების შემდეგ
- `idempotency`: რა მოხდება იმ შემთხვევაში, თუ იგივე მოთხოვნა განმეორებით განიხილება

წარდგენის შემდეგ, აგენტს უნდა დაელოდოს ტერმინალური სტატუსის მოლოდინში, შემდეგ შეამოწმეთ მდგომარეობის ცვლილება კითხვის გამოკითხვით. სასარგებლო დასრულების ანგარიში შეიცავს:

- ტრანზაქციის ჰეში
- ტერმინალის სტატუსი, როგორიცაა `Committed`, `Applied`, `Rejected` ან `Expired`
- ბლოკის ან ექსპლუატორის დეტალები, როდესაც ხელმისაწვდომია
- შემოწმების შედეგები
- უარყოფის შეტყობინება და გამოიყურება თუ არა ჩავარდნა ნებართვებთან, საფასურებთან, ვალიდაციასთან, მოძველებულ მდგომარეობაში ან საბოლოო პუნქტის ხელმისაწვდომობასთან

მაგალითი დაცული მოწოდება:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

როდესაც ხელმოწერილი კონვერტი უკვე მომზადებულია:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP საჯარო სატესტო ქსელის მართვის ზედაპირად უნდა იქნეს განკუთვნილი. Taira გასაღები, სატესტო ჯიხა XOR, საბანქის ანგარიშები და კანარიური ხელმოწერები ერთჯერადად გამოიყენება და უნდა დარჩეს ცალკე Minamoto გასაღებებისა და წარმოების გათავისუფლების სამუშაო პროცესებისგან .

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

ჩამოთვალეთ საჯარო მონაცემთა სივრცის ბილიკები, რომლებიც Taira -ის მიერ გამოფენილია:

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

პირველი სათამაშო უნდა იყოს Taira სარქველის პრეტენზია. იგი იყენებს ტესტის ქსელს XOR და არასდროს უნდა მიუთითოს Minamoto.

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

უმაღლესი დონეზე `chain` არის ზუსტი Taira ტრანზაქციების ქსელი ID. სააგენტო `[account].profile = "taira"` დაყენება დამოუკიდებლად ირჩევს Taira I105 ჯაჭვური დისკრიმინანტი. ID არ შეარჩიოს ანგარიშის პროფილი.

შეამოწმეთ მხოლოდ წაკითხვისთვის:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

ჩატარდეს საჯარო Taira დიაგნოსტიკა, სანამ წერილობითი ტესტები:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira ანგარიშის დაფინანსება სარქველის მეშვეობით, სანამ გადაიხდით საფასურის გადახდის წერილებს. პირდაპირი სარქველი ნაკადი არის [Get Testnet XOR ზე Taira](#_4-get-testnet-xor-on-taira).

მას შემდეგ, რაც საბანქის მოთხოვნა მიიღება და ანგარიში დაფინანსდება, Taira კანარი არის სავალდებულო წაკითხვის სიგარეტის გამოცდა:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

კანარი წარუდგენს ხელმოწერილი პინგს, ელოდება დადასტურებას და წერს runtime signer კონფიგურაციას, როდესაც `--write-config` მიწოდებულია. Taira არის საჯარო ტესტნეტი, თუ `taira doctor` აცხადებს დატენილ რიგს ან კანარი ბრუნდება `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, დაელოდეთ და კიდევ ერთხელ სცადეთ, სანამ მას კლიენტის კონფიგურაციის შეცდომად შეექმნით.

უპატრონოდ მოწევის გამოცდებისათვის, კანარის შეფუთვა დაზღვეული საცდელი ბოჭკით:

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

## შეიქმნას SORA Nexus ანგარიში ID {#generate-a-sora-nexus-account-id}

SORA Nexus ანგარიში ID არის კანონიკური I105 მისამართი, რომელიც გამომდინარეობს ანგარიშის საჯარო გასაღებიდან და სამიზნე ქსელის პრეფექსიდან. ეს არ არის `[account].domain` ღირებულება კლიენტში TOML. ამავე საჯარო გასაღების კოდები სხვადასხვა IDs ზე Taira და Minamoto, ხოლო წარმოების მომხმარებლებმა უნდა შექმნან ცალკე გასაღების წყვილი Minamoto.

გენერირება ან დატვირთვა Ed25519 საკვანძო წყვილი, რომელიც მართავს ანგარიში:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

საჯარო გასაღები Taira ანგარიშში ID გადაიყვანოს:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

კონვერტირება Minamoto საჯარო გასაღები ძირითადი ქსელის პრეფიქსით:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

გამოიყენეთ შედეგად მიღებული ანგარიში ID იქ, სადაც ბრძანება Nexus API ან CLI ითხოვს კანონიკურ ანგარიშს ID, მაგალითად, Taira საბაგირო `account_id`, დაბალანსების გამოკითხვები, მკაცრი ანგარიშის ველები ან საიდუმლო პირობები. შეინახეთ შესაბამისი კერძო გასაღები თქვენი კლიენტის კონფიგურაციაში და აირჩიეთ იგივე საჯარო ქსელი `[account].profile = "taira"` ან `[account].profile = "minamoto"`.

ID-ის გენერირება თავისთავად არ ქმნის დაფინანსებულ ქსელურ ანგარიშს. Taira -ზე, წყალარინს შეუძლია შექმნას და დაფინანსოს ანგარიში testnet წერს. Minamoto -ზე, გამოიყენეთ დამტკიცებული mainnet onboarding ან საგანგებო ნაკადი.

### საკვანძოების შენახვა და რეგისტრაცია {#key-storage-and-backup}

ანგარიში ID და საჯარო გასაღები შეიძლება გაზიარდეს. შესაბამისი პირადი გასაღები, ფრაზა, თესლი და აღდგენის მასალა უნდა იყოს საიდუმლო.

გამოიყენეთ ეს პრაქტიკა SORA Nexus ანგარიშებისთვის:

- ინახეთ კერძო გასაღები დაშიფრულ პაროლი მენეჯერში, აპარატურული მხარდაჭერით უზრუნველყოფილ საკვანძო მაღაზიაში ან სპეციალურ ხელმოწერის სერვისში. არ ჩავაბაროთ გასაღები წყარო კონტროლისთვის ან არ დატოვოთ წარმოების გასაღები ქელის ისტორიაში, ლოგებში, ჩატში, ბილეთებში ან გაუმშიფრულ ცემონტებში.
- გამოიყენეთ უნიკალური მაღალი ენტროპული პაროლი თითოეული საფონდის ან წარმოების ხელმოწერისთვის. პაროლები შეინახეთ პაროლის მენეჯერში ან გაყოფილი შენახვის პროცესში, არა იმავე ფაილში ან სარეზერვო ბუნდელში, როგორც დაშიფვრილი პირადი გასაღები.
- შეინახეთ Taira და Minamoto გასაღები ცალკე. განიხილეთ Taira გასაღები, როგორც ერთჯერადი საცდელი ქსელის მასალა, ხოლო Minamoto გასაღებები, როგორც წარმოების ფონდის ორგანო.
- ბაკურინგი პირადი გასაღები, საჯარო გასაღება, ანგარიში ID, ანგარიშის პროფილი და ნებისმიერი ანგარიშის აღდგენის ან შენახვის შენიშვნები, რომელიც საჭიროა ხელმოწერის აღსადგენად. ქსელის კონტექსტის გარეშე კერძო გასაღება ადვილია ბოროტად გამოყენების დროს აღდგენისას.
- შეინარჩუნეთ მინიმუმ ერთი დაშიფრული ოფლაინის სარეზერვო მონაცემები და ერთი გეოგრაფიულად ცალკე დაშიფრებული სარეზერივო მონაცემების საწარმოო ხელმოწერებისთვის. ტესტით აღდგენა მხოლოდ წაკითხვის ოპერაციით ადრე, რაც დამოკიდებულია სარეზორვო მონაცემებზე.
- შეცვალეთ ან ჩაანაცვლეთ ხელმოწერა, თუ შეიძლება გამოავლინეს პირადი გასაღები, პაროლი, სარეზერვო მედია ან ხელმოწერის მასპინძელი.

დამატებითი დეტალებისთვის იხილეთ [კრიპტოგრაფიული გასაღების შენახვა](/ka/guide/security/storing-cryptographic-keys.md) და [ფარულის უსაფრთხოება](/ka/guide/security/password-security.md).

## 4. მიიღეთ ტესტნეტი XOR Taira {#_4-get-testnet-xor-on-taira}

ოპვრთნარალთ ჟაჟრაჲ ეპსდ-ს.

1. გენერირება ან დატვირთვა ხელმოწერის და გამოითვალოს მისი კანონიკური Taira ანგარიში ID;
2. ეჲბპვ ოპვჟრთნარა პაჟლარა.
3. დარეგულირება, თუ `difficulty_bits` აღემატება `0`.
4. გადმოაგზავნეთ სარქველით მოთხოვნა.
5. დაველოდოთ ანგარიშის ან აქტივების ბალანსის ხილვას, სანამ გადასახადის გადახდის წერილებს გაგზავნით.

საჯარო გასაღები Taira I105 ანგარიშზე ID გადაიყვანოს, რომელიც მოსალოდნელია წყალბადის მიერ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ეჲბპთ პაჟლარა:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

საბაგირო არის საჯარო ტესტნეტის სერვისი. თუ თავსატეხი ან მოთხოვნის ბოლო წერტილი ბრუნდება `502`, დროის გაჩერება, ან სხვა კარიბჭე დონეზე შეცდომა, დაელოდეთ და კიდევ ერთხელ სცადეთ სანამ შეცვლით თქვენი გასაღები ან კლიენტის კონფიგურაცია.

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

როდესაც `difficulty_bits` არის `0`, წარუდგინეთ მხოლოდ ანგარიში ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

როდესაც `difficulty_bits` აღემატება `0`-ს, მოაგვარეთ თავსატეხი და შეიყვანეთ ანკრის სიმაღლე პლუს nonce:

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
   - UTF-8 ანგარიში ID
   - `anchor_height` როგორც დიდი-endian `u64`
   - `anchor_block_hash_hex` დეკოდირებულია ბაიტებად
   - `challenge_salt_hex` დეკოდირებულია ბაიტებად, როდესაც არსებობს
2. სცადეთ `u64` nonces კოდირებული როგორც big-endian 8-byte ღირებულებები.
3. თითოეული ნონსისთვის, გაუშვით scrypt:
   - პაროლი: 8-ბაიტიანი nonce
   - მარილი: 32-ბაიტიანი გამოწვევა
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - გამოშვების სიგრძე: 32 ბაიტი
4. გამარჯვებული nonce არის პირველი digest, რომ მინიმუმ `difficulty_bits` წინ ნულოვანი ბიტები.

ფანჯრის რეაგირება მოიცავს დაფინანსებულ აქტივს და რიგითი ტრანზაქციის ჰეშს:

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

ამჟამად პასუხის გაცემა ხდება HTTP `202 Accepted`. მისი `asset_definition_id` არის მიმდინარე Taira საფასურის აქტივი, რომელიც დაფინანსებულია საჯარო ონკანით; მიიღეთ ის პასუხიდან იმის მაგივრად, რომ ასახელოთ მაგალითი ID. ონკანმა მიიღო თხოვნა, როდესაც იგი დაბრუნებს `tx_hash_hex` და `status: "QUEUED"`.

შემდეგ გამოკითხეთ დაფინანსებული აქტივი, სანამ წარადგინებთ საკუთარ საფასურის გადახდის ოპერაციებს:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

თუ სარქვლის მოთხოვნა მიიღეს, მაგრამ ანგარიში ან აქტივი ჯერ არ ჩანს, ტრანზაქცია კვლავ არის საჯარო testnet რიგის დამუშავების მიღმა. დაელოდეთ და შეეცადეთ წაკითხვა, სანამ გაგზავნის წერა .

მზა პირდაპირი API შემოწმებისათვის, შეინახეთ ეს როგორც `taira_faucet_claim.py` და გადადით Taira I105 ანგარიშზე ID:

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

საპირფარეშო მხოლოდ Taira ტესტნეტის ფონდებისთვისაა განკუთვნილი. არ გამოიყენოთ testnet XOR, საპირფრეშო ანგარიშები ან Taira კანარიური ხელმოწერები Minamoto ნაკადებში.

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

უმაღლესი დონეზე `chain` არის მიმდინარე Nexus მთავარი ქსელის ჯაჭვი ID. `[account].profile = "minamoto"` აირჩევს Minamoto I105 ჯაჭვური დისკრიმინანტი; საბოლოო წერტილის მასპინძელი და ჯაჭვი ID არ შეარჩიოთ იგი ზეპირად.

კონვერტირება Minamoto საჯარო გასაღები მისი კანონიკური I105 ანგარიშზე ID მთავარი ქსელის პრეფისით:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

განახორციელეთ მხოლოდ წაკითხული გვერდითი შემოწმებები, სანამ ანგარიში არ იქნება უზრუნველყოფილი და დაფინანსებული მთავარ ქსელში ჩართვის ან მმართველობის ნაკადის მეშვეობით:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

არ გამოიყენოთ Taira ქვაბის ან წერის კანარის დამხმარე Minamoto-ზე.

## 6. დაფინანსება Minamoto ანგარიშზე XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto გადასახადები გადაიხდის წარმოებით XOR, და Minamoto არ აქვს საჯარო ნაღდი. ფინანსდება კონფიგურირებული ანგარიში დამტკიცებული მთავარი ქსელის ჩართვის ან სახაზინო გადარიცხვის მეშვეობით, ან მიიღება XOR არსებული დაფინანსებული Minamoto ანგარიშისგან.

შეამოწმეთ კანონიკური ანგარიში ID და დაფინანსება მხოლოდ წაკითხვითი შემოწმებით, სანამ წარადგინებთ წერილს. განიხილეთ Minamoto XOR როგორც წარმოების თანხები: პირველ რიგში გაეცანით იმავე ოპერაციას Taira-ზე, ინახეთ ცალკე წარმოების გასაღებები და არ ითქვას, რომ ძირითადი ქსელის ტრანზაქცია შეიძლება განახლდეს .

Taira XOR არ შეუძლია გადაიხადოს Minamoto საფასურები. ტესტნეტის ბალანსი და საბაგირო მოთხოვნები არ გადარიცხება Minamoto.

## 7. მუშაობა არსებული მონაცემთა სივრცეში {#_7-work-inside-an-existing-dataspace}

გამოიყენეთ სრულად კვალიფიცირებული დომენის სახელები მონაცემთა სივრცეში მცხოვრებ საბიუჯეტო ობიექტებისთვის. მაგალითად, საჯარო მონაცემთა სიბანეში პროექტის დომენმა უნდა გამოვიყენოს:

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

Minamoto -ისათვის უნდა შეიქმნას და დაამტკიცოს ცალკე ძირითადი ქსელის განზრახვა და გეგმა. გეგმები დაკავშირებულია მათ ჯაჭვზე, ავტორიტეტზე, რეალურ მდგომარეობასთან და ვადაზე, ამიტომ Taira გეგმის პოპულარიზაცია ან გათამაშება არ შეიძლება:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

ანგარიშის საიდუმლოები იყენებენ იმავე მონაცემთა სივრცის ზედმეტს:

```text
alice@apps.universal
alice@universal
```

მკაცრი ანგარიშის ველები კვლავ იყენებენ კანონიკურ I105 ანგარიშს IDs. განიხილეთ სათაურები, როგორც ადამიანის მიერ წაკითხული კავშირები, რომლებიც გადაწყდება კანონიკურ ანგარიშზე IDs.

## 8. ახალი მონაცემთა სივრცის შექმნა {#_8-provision-a-new-dataspace}

ახალი მონაცემთა სივრცე არის ოპერატორის და მმართველობის ცვლილება. საჯარო Torii საბოლოო წერტილს შეუძლია ტრანსპორტის მიმართულება კონფიგურირებულ მონაცემთა სიბნელეებზე, მაგრამ იგი უარყოფს უცნობ მონაცემთა სიის საიდუმლოებებს.

სანამ შეცვლას მოამზადებთ, დაიჭირეთ მიმდინარე ცოცხალი კატალოგი:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ოპერატორის ანგარიშისთვის, ასევე შეამოწმეთ მარშრუტის მანიფესტური მდგომარეობა:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

არ გაავრცელოთ ახალი საიდუმლო სახელი, თუ ბილიკი ID, მონაცემთა სივრცე ID, ვალიდატორის პარამეტრი, ხარვეზების ტოლერანტობა, მანიფესტი, მარშრუტის წესები და ოპერაციული მფლობელი ერთად გადამოწმებული არ არის. ჩვეულებრივ მომხმარებელ ანგარიშს საჭირო ნებართვებით შეუძლია შეიძინოს დომენი და მისი SNS გაქირავება არსებული მონაცემთა სივრცეში alias-planner-ის მეშვეობით; მას არ შეუძლია უსაფრთხოდ დაამატოს ახალი საჯარო მონაცემები.

კერძო ან ორგანიზაციული მონაცემთა სივრცისათვის, შეადგინეთ კატალოგიური ცვლილება:

- მონაცემთა სივრცის უნიკალური ანალიზი და ციფრული `id`
- შესაბამისი მარშრუტის შესასვლელი ან არსებული მარშრუტი
- მონაცემთა სივრცე `fault_tolerance`
- ინსტრუქციების ან ანგარიშის ფარგლებში მარშრუტის წესები, რომლებიც იქ უნდა ჩამოვარდეს
- სივრცის დირექტორის მანიფესტი ან შესაბამისი დანერგვის მტკიცებულება, როდესაც მონაცემთა სივრცე UAID შესაძლებლობებს ასახავს.
- მმართველობის დამტკიცება ვალდიტორის, შესაბამისობის, ანგარიშსწორებისა და მონიტორინგის პოლიტიკისთვის;

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
- გენერირებული ან გადამოწმებული მანიფესტი არქივდება ჰეშებითა და ხელმოწერებით
- სიგარეტის ტესტირება Taira გაიმართება ნებისმიერი Minamoto აქციის წინ.
- ცვლილების შემდგომ `/status` კატალოგში მოცემულია განკუთვნილი ზოლი და მონაცემთა სივრცე.
- `iroha app nexus lane-report --summary` არ აცხადებს მოთხოვნილი მანიფესტების დაკარგვას;

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ამავე მონაცემთა სივრცის Minamoto განახლება მხოლოდ Taira-ის შემდეგ. განთავსება, სიგარეტის ტესტები, მონიტორინგი და მმართველობის მტკიცებულებები დასრულებულია.

## დაკავშირებული გვერდები {#related-pages}

- [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
- [ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md)
- [საპონსორო გადასახადები კერძო მონაცემთა სივრცეში](/ka/get-started/private-dataspace-fee-sponsor.md)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md)
- [გენეზიის მითითება](/ka/reference/genesis.md)
