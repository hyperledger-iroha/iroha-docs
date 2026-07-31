---
translation_locale: ka
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# აგრეთვე დაიწყე SORA 3: Taira და Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 არის აპლიკაციების მიმართულებით შექმნილი საჯარო განთავსების გზა Iroha 3 და SORA
Nexus. ააშენეთ და რეპეტირდით Taira პირველი, შემდეგ გადაიტანეთ იგივე კლიენტის ფორმა
დაწვრილებით Minamoto მხოლოდ მაშინ, როდესაც თქვენ გაქვთ ცალკე mainnet გასაღები, ნამდვილი XOR საფასურებისათვის,
და წარმოების დამტკიცება.

ეს სახელმძღვანელო გვიჩვენებს, თუ როგორ უნდა შევაყენოთ Iroha მომხმარებელი საზოგადოებისთვის SORA 3
ქსელები:

- Taira საგამოცდო ქსელი `https://taira.sora.org`
- Minamoto მთავარი `https://minamoto.sora.org`

გამოყენება Taira ინტეგრაციის ტესტებისთვის, საბანქის მიერ დაფინანსებული წერის კანარიებისათვის;
განთავსების რეპეტიციები. Minamoto მხოლოდ წარმოებისთვის მზად მყოფი მაგინეტისთვის
ორივე ქსელი აიღებს გადასახადებს XOR:

- Taira გამოიყენება testnet XOR საყოველთაო ქვაბიდან.
- Minamoto გამოიყენება რეალური XOR. არ არსებობს Minamoto ფანჯარა.

## მშენებლობის გზა {#builder-path}

| ნაბიჯი                        | Taira სატესტო ქსელი                                                | Minamoto მთავარი                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| დაიწყეთ ქსელის მდგომარეობის კითხვა | კითხვები `/status` გასაღები არ აქვს                                 | კითხვები `/status` გასაღები არ აქვს                       |
| აირჩიეთ მონაცემთა სივრცე            | საჯარო გამოყენება `universal` თუ თქვენს აპლიკაციას არ სჭირდება მართული ზოლი | გამოიყენეთ იგივე მონაცემთა სივრცე მხოლოდ ძირითადი ქსელის დამტკიცების შემდეგ |
| მიიღეთ საფასური აქტივი               | გამოიყენეთ საზოგადოება Taira ქვაბები                                  | მიიღეთ XOR დაფინანსებული Minamoto ანგარიშის ან დამტკიცებული საფინანსო ნაკადის |
| ტესტი წერს                 | გამოიყენეთ საბანქის მიერ დაფინანსებული ტესტი XOR                                   | არ გამოიყენოთ ტესტი ინსტრუმენტები; წერა ხარჯავს რეალური XOR     |
| ხელს შეუწყობს                     | კვლავ შეეცადეთ ლოგიკა, მონიტორინგი და ხელმოწერის მართვა            | გამოიყენეთ ცალკე გასაღები, დაფინანსება და გათავისუფლების კონტროლი   |

პრაქტიკული ნაკადი არის:

1. ააშენეთ კლიენტი წინააღმდეგ Taira და გამოიყენოს საზოგადოება `universal` მონაცემთა სივრცე.
2. დაამატეთ ხელმოწერა და დააფინანსოთ იგი Taira ფანჯარა.
3. გამოიყენეთ თქვენი აპლიკაციის ლოგიკა Taira სანამ წარუმატებლობები მოსაწყენი არ გახდება და
   აღსანიშნავია.
4. შეიქმნას ცალკე Minamoto მწერალი, დაფინანსეთ იგი რეალური XOR, და მხოლოდ მოძრაობა
   იგივე დადასტურებული ოპერაციები mainnet.

## 1. გაიგე, რას აპირებ {#_1-understand-what-you-are-setting-up}

დაწვრილებით SORA Nexus, მონაცემთა სივრცე არის ქსელის ზოლისა და მარშრუტის კატალოგი.
კლიენტი არ ქმნის ახალ საჯარო მონაცემთა სივრცეს მხოლოდ შეცვლით
`client.toml`. კლიენტების დაყენება ორ რამეს აკეთებს:

1. მიმართავს კლიენტს მარჯვნივ Torii საბოლოო წერტილი
2. აირჩევს დომენის და მონაცემთა სივრცის მარშრუტის კონტექსტს მისი კანონიკური ანგარიში

`AccountId` ყოველთვის კანონიკური და დომენების გარეშე. `[account].domain` ღირებულება
`client.toml` უზრუნველყოფს მარშრუტის და alias კონტექსტი; იგი არ ხდება ნაწილი
ანგარიშის იდენტობა. უმეტეს აპლიკაციებში, დაიწყეთ საზოგადოებრივ
`universal` მონაცემთა სივრცე. დომენის კონტექსტი იყენებს `domain.dataspace` ფორმა,
მაგალითი:

```text
wonderland.universal
```

თუ თქვენ გჭირდებათ ახალი საორგანიზაციო მონაცემთა სივრცე, მომზადეთ კატალოგი და მარშრუტი
წინადადება იმის ნაცვლად, რომ ჩვეულებრივი კლიენტის ანგარიშზე ჩაირიცხოს.
იხილეთ [ახალი მონაცემთა სივრცის შექმნა](#_8-provision-a-new-dataspace) ქვემოთ.

## 2. შეამოწმეთ საზოგადოება Torii საბოლოო წერტილი {#_2-check-the-public-torii-endpoint}

გაამოწმეთ, რომ მიზნობრივი საწინააღმდეგო წერტილი ცოცხალია, სანამ კონფიგურირებთ ხელმოწერას.

სამედიცინო Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

სამედიცინო Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

შეამოწმეთ მონაცემთა სივრცე და ზოლის ხედი, რომელიც გამოფენილია კვანძის მიერ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

გამოიყენეთ იგივე ბრძანება `https://minamoto.sora.org/status` მაინნეტისთვის.

## Taira MCP აგენტებისთვის {#taira-mcp-for-agents}

Taira აგრეთვე გამოფენს Torii-მასახლე კონტექსტური პროტოკოლი (MCP) ხიდი
გამოიყენეთ, როდესაც აგენტს სჭირდება ცოცხალი ტესტნეტის წაკითხვა, სკრიპტი
დიაგნოსტიკა, ან მკაცრად გადამოწმებული წერის რეპეტიციები
Torii ოპვრთმჲ.

| დაყენება | ღირებულება |
| --- | --- |
| MCP საბოლოო წერტილი | `https://taira.sora.org/v1/mcp` |
| ქსელის ფესვი | `https://taira.sora.org` |
| განზრახ გამოყენება | Taira ტესტნეტის კითხვები და საფანჯრის მიერ დაფინანსებული წერის რეპეტიციები |
| წარმოების ეკვივალენტი | არ მიუთითოთ ეს მითითება Minamoto თუ არ არის მთავარი ქსელი MCP საბოლოო წერტილის და გათავისუფლების კონტროლი ხაზგასმით არის დამტკიცებული |

შეამოწმეთ ხიდის მეტა მონაცემები ხელმოწერის მასალის დამატებამდე:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

კონფიგურაცია URL როგორც მომხმარებლის ადგილობრივი MCP სერვერს აგენტის გაშვების დროს.
კომიტეტის აგენტი MCP კონფიგურაცია, API ტოქნები, გადაგზავნილი ავტორის სათაურები, `authority`, ან
`private_key` ამ დოკუმენტების რეპოში ან აპლიკაციის რეპოში შეტანილი მნიშვნელობები.

აჟენტს ეწვიოს წესები, რომლებიც კარგად მუშაობს Taira:

- აღმოაჩინეთ ინსტრუმენტები MCP სერვერი მათ დარეკვის წინ; აღმოაჩინეთ, თუ
  სერვერის ანგარიშები `listChanged`.
- უპირატესობა კურირებული `iroha.*` ინსტრუმენტები ნედლეული `torii.*` ინსტრუმენტები.
- დაიწყეთ მხოლოდ წაკითხვის საშუალებით: შეამოწმეთ სტატუსი, ანგარიშები, აქტივები, ბლოკები,
  მმართველობის მდგომარეობა და ტრანზაქციის სტატუსი წინადადებების წერის წინ.
- საჭიროა ადამიანის მკაფიო ინსტრუქცია ცოცხალი ტესტნეტის მუტაციების წინ.
  წინასწარი ხელმოწერილი ტრანზაქციის კონვერტები, გამოყენება `iroha.transactions.submit_and_wait`
  აჟანტმა შედეგს ელოდება იმის მაგივრად, რომ მხოლოდ წარუდგინოს.
- შეაჯამეთ ტრანზაქციის ჰეშები, საბოლოო სტატუსი და სერვერის ვალიდააციის შეცდომები
  აჟანტის რეაგირება.

### განვითარების სამუშაო პროცესები აგენტებთან ერთად {#development-workflow-with-agents}

გამოიყენეთ აგენტები როგორც განვითარების დამხმარეები Iroha კლიენტები, ტრანზაქციების შემქმნელები,
დიაგნოსტიკური სკრიპტები და ტესტნეტის ჩატარების წიგნები. შეინარჩუნეთ აგენტის უფლებამოსილება:
მას შეუძლია შეამოწმოს კოდი, წაიკითხოს Taira სახელმწიფო, ცვლილებების შემოთავაზება და ადგილობრივი ტესტების ჩატარება,
მაგრამ მან არ უნდა მოუტაცია ცოცხალი ქსელი სანამ ადამიანი დაამტკიცებს ზუსტი
ოპერაცია.

პრაქტიკული სამუშაო პროცესია:

1. სთხოვეთ აგენტს, შეამოწმოს შესაბამისი დოკუმენტები. SDK კოდი, CLI ბრძანება ან MCP
   ინსტრუმენტის სქემა, სანამ კოდი დაწერს.
2. ეა დჲ ნაოპაგთ ოპაგენტმა ოჲეაპაჲრთნა ჟლვე პაეჟა: სტატუსის შემოწმება, ანგარიში
   შეძენა, ანალოგიური რეზოლუცია ან ბალანსის შესწავლა.
3. დამატება ტრანზაქციების მშენებლობის კოდი მხოლოდ მას შემდეგ, რაც მხოლოდ კითხვა ზარები მუშაობენ წინააღმდეგ
   Taira.
4. შეინახეთ ცოცხალი ქსელის ტესტები opt-in, მაგალითად უკან `TAIRA_LIVE=1`, ასე რომ a
   ნორმალური ერთეულის ტესტირება არასდროს ხარჯავს ტესტის ქსელის თანხებს ან დამოკიდებულია ქსელზე
   ხელმისაწვდომობა.
5. ჟაჟრაჲ ეა ჟვ ოპვრთმვნ გ ბპაეთგარა ნა რსთჟკა, კაეანთრწ,
   ინსტრუქციის შეჯამება, საფასურის აქტივი და მოსალოდნელი სახელმწიფო ცვლილება მანამდე, სანამ ის წარადგენს
   ნებისმიერი ოპერაცია.
6. შეამოწმეთ წარმოქმნილი კოდი საიდუმლო მოხმარების, განმეორებითი მცდელობის ქცევა, უძლურობა და
   უარყოფითი მოქმედება, სანამ ის ხელშეწყობილი იქნება CI ან ძირითადი სამუშაო პროცესები.

სასარგებლო მხოლოდ წაკითხვისთვის MCP განვითარების ინსტრუმენტები მოიცავს ანგარიშის აქტივების შესწავლას,
ანალოგიური რეზოლუცია, ბლოკების ძებნა, ტრანზაქციის ძებნა და
მილსადენის სტატუსის შემოწმება. გამოიყენეთ ეს, რათა გაიზარდოს ნდობა
დადებული სასარგებლო ტვირთი.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### ტრანზაქციული სამუშაო პროცესები აგენტების საშუალებით {#transaction-workflow-through-agents}

სააგენტო MCP bridge შეუძლია წარადგინოს ხელმოწერილი Iroha ტრანზაქცია, მაგრამ არ ამოიღებს
ტრანზაქციის ჩვეულებრივი მოთხოვნები.
უფლებამოსილება, ნებართვები, საფასურის დაფინანსება, ჯაჭვი ID, მეტა მონაცემები და ხელმოწერა.

ნედლეულისათვის Iroha ტრანზაქციები, შექმნა და ხელი მოაწეროს ტრანზუქციის კონვერტი
SDK ან CLI პირველ რიგში, შემდეგ აგენტს მხოლოდ კანონიკური ხელმოწერილი ტრანზაქცია უნდა მისცეს.
ბაიტები კოდირებული როგორც `body_base64`. აგენტს შეუძლია წარადგინოს კონვერტი
`iroha.transactions.submit_and_wait`, ან წარადგინოს
`iroha.transactions.submit` და გამოკითხვა `iroha.transactions.wait`.

არ ჩასვათ პირადი გასაღები აგენტის შეტყობინებაში. თუ აგენტს უნდა შექმნას
ოპერაცია, მიუთითეთ ის ადგილობრივ კოდზე რომელიც ატვირთავს საიდუმლოებებს მომხმარებლის runtime
გარემო, საკვანძო ჯაჭვი, აპარატურის ხელმოწერა ან უგულებელყოფილი testnet კონფიგურაციის ფაილი.
აგენტმა არასოდეს უნდა დაწეროს საკვანძო მასალა Markdown, მობილურები, ლოგები, ან
ადაპტირება.

ოპერაციის წარდგენის წინ, აგენტს მოუწოდეთ მოკლე ოპერაცია გააკეთოს
გეგმა:

- `network`: Taira სატესტო ქსელის ფესვი და ჯაჭვი ID
- `authority`: ანგარიში, რომელიც ხელს უწერს და გადაიხდის საფასურს
- `instructions`: რეგისტრაცია, მონტაჟი, დამწვრობა, გადაცემა, მეტადატანი, ნებართვა ან
  ხელშეკრულების მოწოდების შეჯამება
- `fee asset`: აქტივი, რომელსაც დააკისრებენ Taira
- `preflight reads`: ანგარიში, აქტივების ბალანსი, ნებართვები, alias ან ბლოკი
  უკვე ჩატარებული შემოწმებები
- `expected result`: მდგომარეობა, რომელიც უნდა იყოს ხილული დადასტურების შემდეგ
- `idempotency`: რა მოხდება, თუ იგივე თხოვნა განმეორდება

სააგენტო უნდა დაელოდოს ტერმინალური სტატუსის დასადგენად, შემდეგ გადაამოწმოს
სტატის ცვლილება კითხვის გამოკითხვით. სასარგებლო დასრულების ანგარიში მოიცავს:

- ტრანზაქციის ჰეში
- ტერმინალური სტატუსი, როგორიცაა: `Committed`, `Applied`, `Rejected`, ან `Expired`
- ბლოკის ან ექსპლუატორის დეტალები, როდესაც ხელმისაწვდომია
- შემოწმების შედეგები
- უარყოფის შეტყობინება და აქვს თუ არა წარუმატებლობა ნებართვებს, გადასახადებს,
  დამტკიცება, მოძველებული მდგომარეობა ან საბოლოო წერტილის ხელმისაწვდომობა

მაგალითი დაცული prompt:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

როდესაც ხელმოწერილი კონვერტი უკვე დამზადებულია:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

მკურნალობა Taira MCP როგორც საჯარო სატესტო ქსელის მართვის ზედაპირი. Taira გასაღები, სატესტო ქსელი XOR,
საბანქისები და კანარიური ხელმოწერები ერთჯერადი და უნდა დარჩეს ცალკე
Minamoto საკვანძოები და წარმოების გათავისუფლების სამუშაო პროცესები.

## სათამაშოების მაგალითები, რომელთა გამოცდა შეგიძლიათ ახლა {#toy-examples-you-can-try-now}

ეს მაგალითები არის მხოლოდ წაკითხვის გარდა, თუ აღნიშნული. ისინი მუშაობენ სანამ თქვენ გენერირება
გასაღები და უსაფრთხოა ორივე საჯარო ქსელის წინააღმდეგ.

შედარება Taira სატესტო ქსელი და Minamoto ძირითადი ჯანდაცვა:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

განსაზღვრული მონაცემთა სივრცის ბილიკები Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ატარეთ იგივე ბრძანება წინააღმდეგ Minamoto როდესაც საჭიროა მთავარი ქსელის ხედი:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ააშენეთ პატარა Node.js დეშბორდის, ბოტის ან განთავსების სტატუსის კვლევა
შეამოწმეთ:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

პირველი სათამაშო უნდა იყოს Taira ტესტნეტს იყენებს.
XOR და არასოდეს უნდა იყოს მითითებული Minamoto.

## 3. შეიქმნას a Taira კლიენტის კონფიგურაცია {#_3-create-a-taira-client-config}

გააჩინეთ საკვანძო წყვილი, თუ ჯერ არ გაქვთ:

```bash
kagami keys --algorithm ed25519 --json
```

შექმნა `taira.client.toml`:

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

უმაღლესი დონეზე `chain` არის ზუსტი Taira ტრანზაქციების ჯაჭვი ID. სააგენტო
`[account].profile = "taira"` დაყენება დამოუკიდებლად ირჩევს Taira I105
ჯაჭვის დისკრიმინანტი. ID არ შეარჩიოს ანგარიშის პროფილი.

გატარეთ მხოლოდ წაკითხვის ჩექი:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

აწარმოე საზოგადოება Taira დიაგნოსტიკა წერილობითი ტესტების წინ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

დაფინანსება Taira გაითვალეთ ფანჯარა, სანამ საფასურის გადახდას დაიწყებთ.
პირდაპირი მილის ნაკადი შედის
[მიიღეთ Testnet XOR დაწვრილებით Taira](#_4-get-testnet-xor-on-taira).

მას შემდეგ, რაც საბანქის მოთხოვნა მიიღეს და ანგარიში დაფინანსდა, Taira
კანარი არის ვარიანტული დაწერის ტესტი:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

კანაირი წარუდგენს ხელმოწერილ პინგს, ელოდება დადასტურებას და წერს:
runtime ხელმომწერის კონფიგურაცია, როდესაც `--write-config` გათვალისწინებულია. Taira არის საჯარო
testnet, ასე რომ რიგის saturation შეიძლება გააკეთოს ხელმოწერილი ping არასწორი მაშინაც კი, როდესაც
თვითონ კვანძი მუშაობს. თუ `taira doctor` აცხადებს შეჯერებულ რიგს ან
კანარიის შემოსავალი `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, დაველოდოთ და კიდევ ერთხელ შეეცადეთ
მკურნალობა როგორც კლიენტის კონფიგურაციის შეცდომა.

უპატრონოდ მოწევის გამოცდებისათვის, კანარის შეფუთვისას საზღვრული რეტერიზაციის ბოქში ჩაიხურეთ:

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

შეწყვიტეთ განმეორებითი მცდელობა, თუ `iroha taira doctor` აჩვენებს მძიმე ჩავარდნას.
და საფასურის მიღების უარი გარდამავალი საჯარო ტესტნეტის პირობებია; DNS,
TLS, ან `status = "fail"` დიაგნოსტიკა არ არის.

## წარმოქმნა a SORA Nexus ანგარიში ID {#generate-a-sora-nexus-account-id}

ა SORA Nexus ანგარიში ID არის კანონიკური I105 მისამართი, რომელიც მოდის
ანგარიშის საჯარო გასაღები და მიზნობრივი ქსელის პრეფექსი.
`[account].domain` ღირებულება კლიენტში TOML. ამავე საჯარო გასაღების კოდები
განსხვავებული IDs დაწვრილებით Taira და Minamoto, და წარმოების მომხმარებლებმა უნდა გამოიმუშაონ
ცალკე საკვანძო წყვილი Minamoto.

გენერირეთ ან დატვირთეთ Ed25519 საკვანძო წყვილი, რომელიც აკონტროლებს ანგარიშს:

```bash
kagami keys --algorithm ed25519 --json
```

გადააქციეთ საჯარო გასაღები Taira ანგარიში ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

კონვერტირება a Minamoto საჯარო გასაღები ძირითადი ქსელის პრეფისით:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

გამოიყენეთ მიღებული ანგარიში ID სადაც Nexus API ან CLI ბრძანება ითხოვს
კანონიკური ანგარიში ID, მაგალითად, Taira ქვაბები `account_id`, ბალანსი
შეკითხვები, მკაცრი ანგარიშის ველები, ან alias bindings. Keep the matching
თქვენი კლიენტის კონფიგურაციაში პირადი გასაღები და აირჩიეთ იგივე საჯარო ქსელი
`[account].profile = "taira"` ან `[account].profile = "minamoto"`.

წარმოქმნა ID არ ქმნის თავისთავად დაფინანსებულ ქსელურ ანგარიშს.
Taira, ტესტნეტს შეუძლია შექმნას და დააფინანსოს ანგარიში.
Minamoto, გამოიყენეთ დამტკიცებული მთავარი ქსელის ჩართვა ან საფინანსო ნაკადი.

### საკვანძოების შენახვა და რეგისტრაცია {#key-storage-and-backup}

ანგარიში ID და საჯარო გასაღები შეიძლება გაზიარდეს. შეესაბამებელი პირადი გასაღები,
საიდუმლო ფრაზა, თესლი და აღდგენითი მასალა უნდა იყოს დაცული.

გამოიყენეთ ეს პრაქტიკა SORA Nexus ანგარიშები:

- ინახეთ კერძო გასაღები დაშიფრებულ პაროლი მენეჯერში, რომელიც უზრუნველყოფილია აპარატურით
  საკვანძო შენახვა, ან სპეციალური ხელმოწერის სერვისი. არ დაუთმეთ გასაღები წყაროზე
  აკონტროლეთ ან დატოვეთ საწარმოო გასაღები ფარდების ისტორიაში, ლოგები, ჩატები, ბილეთები,
  ან გაუმშიფრებელი ბაკუპი.
- გამოიყენეთ უნიკალური მაღალი ენტროპული პაროლი თითოეულ საფონდში ან წარმოების ხელმოწერისთვის.
  პაროლების შენახვა პაროლის მენეჯერში ან გაყოფილი დაცვის პროცესში, არა
  იგივე ფაილი ან სათადარიგო ბუნდი, როგორც კოდირებული პირადი გასაღები.
- შენარჩუნება Taira და Minamoto გასაღები ცალკე. Taira გასაღები ერთჯერადი
  საცდელი ქსელის მასალა და Minamoto საკვანძოები, როგორც საწარმოო ფონდების ორგანო.
- კერძო გასაღები, საჯარო გასაღები და ანგარიში. ID, ანგარიშის პროფილი და ნებისმიერი
  ანგარიშის აღდგენის ან მფარველობის ნოტები, რომლებიც საჭიროა ხელმოწერისთვის.
  ღილაკი ქსელის კონტექსტის გარეშე ადვილია ბოროტად გამოყენება აღდგენის დროს.
- ინახეთ მინიმუმ ერთი დაშიფრული ოფლაინ ბაკაუპი და ერთი გეოგრაფიულად
  საწარმოო ხელმოწერების ცალკე დაშიფრული ჩანახატები.
  მცირე წაკითხვის მხოლოდ ოპერაცია, სანამ დამოკიდებულია backup.
- გადატრიალება ან ხელმოწერის შეცვლა, თუ კერძო გასაღები, პაროლი, სათადარიგო მედია,
  ან შეიძლება იყოს გამოხატული ხელმომწერი მასპინძელი.

უფრო დეტალურად იხილეთ
[კრიპტოგრაფიული გასაღების შენახვა](/ka/guide/security/storing-cryptographic-keys.md)
და [პაროლის დაცვა](/ka/guide/security/password-security.md).

## 4. მიიღეთ Testnet XOR დაწვრილებით Taira {#_4-get-testnet-xor-on-taira}

ოპვრთნარჲრჲ ვ ჟრანთმ.

1. გენერირება ან დატვირთვა ხელმოწერის და გამოითვალოს მისი კანონიკური Taira ანგარიში ID.
2. ეჲბპვ ოპვჟრთნარა პაჟლარა.
3. გადაწყვიტეთ თავსატეხი, თუ `difficulty_bits` უფრო დიდია, ვიდრე `0`.
4. ოჲეაპაჟეთ თმამ.
5. ელოდე ანგარიშის ან აქტივების ბალანსის ხილვადობა გამოგზავნამდე
   საფასურის გადახდა წერია.

კონვერტირება საჯარო გასაღები Taira I105 ანგარიში ID სასაწყობი:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

ეა, ეჲბპვ პაჟლ.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

საბაჟო არის საჯარო ტესტნეტის სერვისი.
დაბრუნება `502`, დროის შეწყვეტა, ან სხვა საგარეჯო დონეზე შეცდომა, დაველოდოთ და კიდევ ერთხელ სცადეთ
სანამ შეცვლით თქვენს გასაღებს ან კლიენტის კონფიგურაციას.

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

როდესაც `difficulty_bits` არის `0`, წარადგინოს მხოლოდ ანგარიში ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

როდესაც `difficulty_bits` უფრო დიდია, ვიდრე `0`, გადაჭრას თავსატეხი და მოიცავს
ანკრის სიმაღლე და ნონსი:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

ალგორითმები ასეა:

1. შექმენით გამოწვევა, როგორც SHA-256 დაწყებული:
   - ბაიტების `iroha:accounts:faucet:pow:v2`
   - დასახელება UTF-8 ანგარიში ID
   - `anchor_height` როგორც დიდი ენდია `u64`
   - `anchor_block_hash_hex` დეკოდირებული როგორც ბაიტები
   - `challenge_salt_hex` დეკოდირებული როგორც ბაიტები, როდესაც არსებობს
2. სცადე. `u64` ნონსი კოდირებულია როგორც დიდი ენდიანული 8-ბაიტიანი მნიშვნელობები.
3. თითოეულ ნონსზე, გაუშვით scrypt:
   - პაროლი: 8-ბაიტიანი nonce
   - მარილი: 32-ბაიტიანი გამოწვევა
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - გამოდის სიგრძე: 32 ბაიტი
4. გამარჯვებული ნონსი არის პირველი დიჟესი, რომელშიც მინიმუმ `difficulty_bits`
   ნულოვანი ბიტების წინ.

ფანჯრის რეაგირება მოიცავს დაფინანსებული აქტივისა და რიგითი ტრანზაქციის ჰეშს:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

ამჟამად პასუხის გაცემა HTTP `202 Accepted`. ქონება
განსაზღვრა ID ზემოთ არის Taira საჯარო ქვაბის მიერ დაფინანსებული საფასური აქტივი.
საფანელომ მიიღო თხოვნა, როდესაც ის დაბრუნდება `tx_hash_hex` და
`status: "QUEUED"`.

შემდეგ გამოკითხეთ დაფინანსებული აქტივი, სანამ წარადგინებთ საკუთარ გადასახადს.
ოპერაციები:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

თუ საბანქის მოთხოვნა მიიღეს, მაგრამ ანგარიში ან აქტივი არ ჩანს
თუმცა, ტრანზაქცია ჯერ კიდევ საჯარო ტესტნეტის რიგების გადამუშავების უკან დგას.
და კიდევ ერთხელ შეეცადეთ წაკითხვა წერილების გაგზავნამდე.

მზადაა გაშვებისთვის პირდაპირი API შეამოწმეთ, დაინახეთ ეს როგორც `taira_faucet_claim.py`
და გადასცეს Taira I105 ანგარიში ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

ფანჯარა მხოლოდ მისთვისაა Taira ტესტნეტის ფონდები. არ გამოიყენოთ ტესტნიტი XOR, ქვაბები
ანგარიშები ან Taira კანარიური ხელმოწერები Minamoto მდინარეები.

## 5. შეიქმნას a Minamoto კლიენტის კონფიგურაცია {#_5-create-a-minamoto-client-config}

გამოიყენეთ ცალკე გასაღები Minamoto. არ გამოიყენოთ განმეორებით Taira ფირმის გასაღები.

შექმნა `minamoto.client.toml`:

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

უმაღლესი დონეზე `chain` არის მიმდინარე Nexus მთავარი ქსელის ქსელი ID.
`[account].profile = "minamoto"` აირჩევს Minamoto I105 ჯაჭვი
დისკრიმინანტი; საბოლოო წერტილის მასპინძელი და ჯაჭვი ID არ შეარჩიოთ იგი ზეპირად.

კონვერტირება a Minamoto საჯარო გასაღები მისი კანონიკური I105 ანგარიში ID და
მაინნეტის პრეფისი:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ჩატარდეს მხოლოდ წაკითხვის გვერდითი შემოწმებები, სანამ ანგარიში არ დაფინანსდება
ძირითადი ქსელის ჩართვის ან მმართველობის ნაკადის საშუალებით:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

არ გაუშვათ Taira საწინააღმდეგო ქვაბის ან წერილ-კანარის დამხმარე Minamoto.

## 6. ფონდი ა Minamoto ანგარიში XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto საფასურები გადაიხდის წარმოების დროს XOR, და Minamoto არ აქვს საზოგადოება
ფანჯარი. კონფიგურირებული ანგარიშის დაფინანსება დამტკიცებული ძირითადი ქსელის ჩართვის საშუალებით
ან საფინანსო გადარიცხვა, ან მიღება XOR არსებული დაფინანსებული Minamoto
ანგარიში.

შეამოწმეთ კანონიკური ანგარიში ID დაფინანსება მხოლოდ წაკითხვითი შემოწმებით
წარსადგენ წერილს. Minamoto XOR საწარმოო ფონდებში: რეპეტიცია
იგივე ოპერაცია Taira პირველ რიგში, შეინახეთ ცალკე საწარმოო გასაღები და არ
წარმოიდგინეთ, რომ მაინეტ-ტრანზაქცია შეიძლება განახლდეს.

Taira XOR ვერ გადაიხდის Minamoto ტესტნეტის ბალანსები და საბანკო მოთხოვნები
არ გადაეცემა Minamoto.

## 7. მუშაობა არსებულ მონაცემთა სივრცეში {#_7-work-inside-an-existing-dataspace}

გამოიყენეთ სრულად კვალიფიციური დომენის სახელები წიგნის ობიექტებისთვის, რომლებიც ცხოვრობენ
მაგალითად, საჯარო მონაცემთა სივრცეში პროექტის დომენი უნდა იყოს
გამოყენება:

```text
apps.universal
```

მას შემდეგ, რაც თქვენს ანგარიშს აქვს საჭირო ნებართვები, შექმენით საიდუმლოების გარეშე
`AliasSetupPlanRequestV1` დომენის განზრახვა და დეკლარაციული დაგეგმვის გამოყენება:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

სამედიცინო Minamoto, შექმნას და დაამტკიცოს ცალკე მთავარი ქსელის განზრახვა და გეგმა.
არიან დაკავშირებული მათი ჯაჭვი, უფლებამოსილება, ცოცხალი სახელმწიფოს ანკერი და deadline, ასე რომ
Taira გეგმა არ შეიძლება იყოს ხელშეწყობილი ან განმეორებით შესრულებული:

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

მკაცრი ანგარიშის ველები კვლავ იყენებენ კანონიკურ I105 ანგარიში IDs. საიდუმლოების გამოყენება
როგორც ადამიანისთვის გასაკითხი კავშირები, რომლებიც კანონიკური ანგარიშის შესაბამისად გადაწყდება IDs.

## 8. ახალი მონაცემთა სივრცის შექმნა {#_8-provision-a-new-dataspace}

ახალი მონაცემთა სივრცე არის ოპერატორის და მმართველობის ცვლილება. Torii
endpoint შეუძლია ავტოტრანსპორტის მიმართულება კონფიგურირებულ მონაცემთა პალატებზე, მაგრამ ის უარყოფს
უცნობი მონაცემთა სივრცეების საიდუმლოები.

სანამ ცვლილებას მოამზადებთ, დაიჭირეთ მიმდინარე ცოცხალი კატალოგი:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ოპერატორის ანგარიშისთვის, ასევე შეამოწმეთ სარაკლისის მანიფესტის პოზიცია:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ნუ გააქტიურებთ ახალ საიდუმლოს, თუ არ არის ზოლი ID, მონაცემთა სივრცე ID, დამტკიცების კომპლექტი,
შეცდომების ტოლერანტობა, მანიფესტი, მარშრუტის წესები და ოპერაციული მფლობელი
ჩვეულებრივი მომხმარებლის ანგარიში საჭირო ნებართვებით შეიძლება
შეიძინოს დომენი და მისი SNS დაქირავება არსებულ მონაცემთა სივრცეში
alias Planner; ის არ შეიძლება უსაფრთხოდ დაამატოს ახალი საჯარო მონაცემთა სივრცე.

კერძო ან ორგანიზაციული მონაცემთა სივრცისათვის, შეადგინეთ კატალოგური ცვლილება:

- უნიკალური მონაცემთა სივრცის საიდუმლო და ციფრული `id`
- შეესაბამებელი ზოლის შესასვლელი ან არსებული ზოლის დავალება
- მონაცემთა სივრცე `fault_tolerance`
- ინსტრუქციების ან ანგარიშის ფარგლებში, რომლებიც უნდა დაეშვა, მარშრუტის წესები
  იქ
- კოსმოსური დირექტორიის მანიფესტი ან მასთან შედარებული განთავსების მტკიცებულება, როდესაც
  მონაცემთა სივრცის გამოხატვა UAID შესაძლებლობები
- მმართველობის დამტკიცება მოწმის, შესაბამისობის, ანგარიშსწორებისა და მონიტორინგისთვის
  პოლიტიკა

კონფიგურაციის შესამოწმებადი ფრაგმენტი ასე გამოიყურება:

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

ოპერატორის მიღებისას უნდა შედგეს შემდეგი კარიბჭეები:

- `irohad --sora --config <config.toml> --trace-config` გადაცემა
  გადაჭრილი კვანძის კონფიგურაცია
- გენერირებული ან გადამოწმებული მანიფესტი არქივდება ჰეშებითა და ხელმოწერებით
- სიგარეტის ტესტები გაივლის Taira ნებისმიერი Minamoto ხელშეწყობა
- ცვლილების შემდგომ `/status` კატალოგი აჩვენებს განზრახ მარშრუტს და მონაცემთა სივრცეს
- `iroha app nexus lane-report --summary` არ აცხადებს დაკარგვის მოთხოვნილებას
  მანიფესტები

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ამავე მონაცემთა სივრცის პოპულარიზაცია Minamoto მხოლოდ მას შემდეგ, რაც Taira განთავსება,
მოწევის ტესტები, მონიტორინგი და მმართველობის მტკიცებულებები დასრულებულია.

## დაკავშირებული გვერდები {#related-pages}

- [დამონტაჟება Iroha 3](/ka/get-started/install-iroha.md)
- [ოპერირება Iroha 3 მეშვეობით CLI](/ka/get-started/operate-iroha-via-cli.md)
- [კერძო მონაცემთა სივრცის საფონზორო გადასახადები](/ka/get-started/private-dataspace-fee-sponsor.md)
- [Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md)
- [იანესის რეფერენცია](/ka/reference/genesis.md)
