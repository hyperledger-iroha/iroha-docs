---
translation_locale: ka
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## შედეგები {#outcome}

ინსპექტირება Taira NFT დაფიქსირება, შემდეგ რეგისტრაცია, განახლება, გადაცემა და გამოკითხვა უნიკალური NFT გენერირებულ ადგილობრივ ქსელში. სამუშაო მიმდინარეობა იყენებს სრულად კვალიფიციურ `name$domain.dataspace` NFT ID და კანონიკური I105 მფლობელი IDs.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- წერილებისათვის, [დან გენერირებული ადგილობრივი ქსელი ამოქმედდეს Iroha](/ka/get-started/launch-iroha.md), `./localnet/client.toml` და Torii `http://127.0.0.1:8080`ზე.

## ნაბიჯები {#steps}

### 1. შეამოწმეთ საზოგადოებრივი Taira კოლექცია. {#_1-inspect-the-public-taira-collection}

ცარიელი გვერდი წარმატებული წაკითხვაა: ეს ნიშნავს, რომ მოთხოვნილ გვერდზე NFTs ხილული არ არის.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs არის უნიკალური ჩანაწერები, არა ციფრული ბალანსი. მათ აქვთ ID, ერთი მფლობელი და კომპაქტური `content` მეტა მონაცემების რუკა.

### 2. მოამზადეთ ადგილობრივი მფლობელი IDs {#_2-prepare-local-owner-ids}

წერის მაგალითში გამოიყენება ჩანახული `wonderland.universal` დომენი. ამოიღეთ კონფიგურირებული ავტორიტეტი მისი კერძო გასაღების გაშუქების გარეშე, შემდეგ აირჩიეთ სხვა რეგისტრირებული ანგარიში როგორც გადაცემის მიმართულება.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` სეპარატორი ეკუთვნის NFT ტექსტის ფორმას. შეინარჩუნეთ სრულად `wonderland.universal` დომენი და მონაცემთა სივრცე.

### 3. რეგისტრაცია NFT საწყისი შინაარსის {#_3-register-the-nft-with-initial-content}

CLI იკითხავს საწყის JSON ობიექტს სტანდარტული შეყვანიდან. მიმდინარე ავტორიტეტი ხდება მფლობელი.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. განახლება შინაარსის რუკა {#_4-update-the-content-map}

მეტა მონაცემების ღირებულებები არის JSON. საკვანძო ჩასმის დაყენება ან ამ ერთი მითითების შეცვლა; ეს არ შეიცავს მთლიანად NFT რეკორდს.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. საკუთრების გადაცემა {#_5-transfer-ownership}

მიაწოდეთ ორივე კანონიკური I105 ანგარიში IDs. საიდუმლო სახელი უნდა გადაწყდეს, სანამ ის გამოიყენება როგორც `--from` ან `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning ნებართვის საზღვარი

Taira ყველა დაწერას ასევე სჭირდება `--metadata ./taira.tx-metadata.json` და მკაფიო საფასურის გადამხდელის. რეგისტრაცია, გადაცემა, ამოღება და მეტადიტების განახლება შემოწმდება აქტიური runtime  (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` და `CanModifyNftMetadata` გათვალისწინებული ნებართვის ზედაპირში). გამოიყენეთ თქვენი აპლიკაციისათვის მინიჭებული დომენი ან შეინახეთ ეს სიარული localnet- ზე.

:::

ხელშეკრულების საკუთრებაში არსებული სამუშაო პროცესებისთვის Kotodama გამოხატავს NFT მასპინძელი ზარების ტიპირებას. შემდეგი არის ზუსტი სიცოცხლის ციკლის პარამეტრი, რომელიც შედგენილია და შესრულებულია ჩაკეტილი IVM დოკუმენტაციის ტესტით:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

ორი ფიქსირებული I105 მნიშვნელობა არის წინსავალი საცდელი მოწყობილობები; სარტყელი რეგისტრირებს დანიშნულების ადგილს განხორციელებამდე. ისინი არ არიან `CURRENT_OWNER` და `NEW_OWNER` CLI გასვლისგან. აპლიკაციის ხელშეკრულებისათვის, მიაწოდეთ მისი ფაქტობრივი კანონიკური ანგარიშები, შემდეგ შეადგინეთ, ტესტირდით, განახორციელეთ და გამოვიძახოთ იგი [ ჭკვიანი კონტრაქტების მეშვეობით](./smart-contracts.md). არ წარუდგინოთ არარევიზირებული ბაიტო კოდი Taira და გახსოვდეთ, რომ ხელშეკარგვის შესრულება მაინც გადის გამშვებ დროის ავტორიზაციას .

## შემოწმება {#verify}

წაიკითხეთ NFT უშუალოდ და ადასტურეთ, რომ მისი მფლობელი შეიცვალა, სანამ მისი შინაარსი დარჩებოდა მიბმული:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

იმ შემთხვევაში, თუ CLI ჩანაწერს გამოსასვლელ ფურცელში ამოტრიალებს, ერთხელ შეამოწმეთ JSON და გამოიყენეთ განცხადება შემავალი NFT ობიექტზე. ავტორიტეტული ინვარაციები არის `id`, `owned_by` და `content`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `name$domain` ზოგიერთ პარსერში ზოგადი მონაცემთა სივრცეზე შეიძლება გათვალისწინებული იყოს, მაგრამ სამზარეულო წიგნი და აპლიკაცია IDs უნდა გამოიყენოს ნიშანდობრივად `name$domain.dataspace` ფორმა.
- იგივე NFT ID-ის განმეორებითი რეგისტრაცია უარყოფა. გამოიყენეთ ახალი ადგილობრივი ქსელი ან აირჩიეთ სტაბილური ახალი ID ცალკე ჩანაწერისთვის.
- Metadata შეღება უნდა იყოს მოქმედი JSON სტანდარტული შეღება. shell string გარეშე JSON ციტირება არ არის metadata მნიშვნელობა.
- გადარიცხვა, რომელსაც ხელი მოაწერა მიმდინარე მფლობელისგან განსხვავებულმა ანგარიშმა, საჭიროებს ზუსტ ნებართვას; `--from`-ის შეცვლა არ შეიცავს ხელმომწერს.
- გადაცემის შემდეგ, თავდაპირველ კლიენტს NFT მუტაციის ან რეგისტრაციის გაუქმების უფლება აღარ შეიძლება ჰქონდეს. გამოიყენეთ ახალი მფლობელის ხელმოწერა ან ავტორიზებული კონტროლერი.
- Taira შეიძლება დაბრუნდეს ცარიელი NFT კოლექცია. არ განიხილოს `items: []` როგორც მტკიცებულება, რომ NFT ინსტრუქციები არ არის ხელმისაწვდომი.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [NFT ინტეგრაციის ტესტები ჩაკეტილი კომპიუტერზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT მასპინძლის ზარის ტესტები ჩაკეტილი კომიტეტზე ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ზუსტი Kotodama NFT სიცოცხლის ციკლის ჩანართი ჩაკეტილი კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ka/blockchain/nfts.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ქაღალდები](/ka/reference/permissions.md)
