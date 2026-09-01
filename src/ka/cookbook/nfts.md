---
translation_locale: ka
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## შედეგები {#outcome}

ინსპექტირება Taira NFT დაფიქსირება, შემდეგ რეგისტრაცია, განახლება, გადაცემა და მოთხოვნა უნიკალური NFT გენერირებულ ადგილობრივ ქსელში. სამუშაო მიმდინარეობა იყენებს სრულად კვალიფიციურ `name$domain.dataspace` NFT იდენტიფიკაცია და კანონიკური I105 მფლობელის პირადობის მოწმობა.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- ლოკალური ქსელი, რომელიც შექმნილია [გაშვება Iroha](/ka/get-started/launch-iroha.md), მქონე `./localnet/client.toml` და Torii დაწყება `http://127.0.0.1:8080`.

## ნაბიჯები {#steps}

### 1. შეამოწმეთ საზოგადოებრივი Taira კოლექცია. {#_1-inspect-the-public-taira-collection}

ცარიელი გვერდი წარმატებული წაკითხვაა: ეს ნიშნავს, რომ მოთხოვნილ გვერდზე NFTs ხილული არ არის.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs არის უნიკალური ჩანაწერები, არა ციფრული ბალანსი. მათ აქვთ ID, ერთი მფლობელი და კომპაქტური `content` მეტამონაცემები რუკა.

### 2. მომზადეთ ადგილობრივი მფლობელის პირადობის მოწმობა {#_2-prepare-local-owner-ids}

დაწერის მაგალითში გამოიყენება ჩანახული `wonderland.universal` დომენი. გამოიყვანეთ კონფიგურირებული ავტორიზაციის პრინციპალი, მისი პირადი გასაღების გაშუქების გარეშე, შემდეგ აირჩიეთ სხვა რეგისტრირებული ანგარიში გადაცემის მიმართულებად.

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

CLI კითხულობს საწყის JSON ობიექტს სტანდარტული შესასვლელიდან. მიმდინარე ნებართვის პრინციპული ხდება მფლობელი.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. განახლება შინაარსის რუკა {#_4-update-the-content-map}

მეტამონაცემების ღირებულებები არის JSON. საკვანძო ჩასმის დაყენება ან ამ ერთი მითითების შეცვლა; ეს არ შეიცავს მთლიანად NFT რეკორდს.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. საკუთრების გადაცემა {#_5-transfer-ownership}

მიაწოდეთ ორივე კანონიკური I105 ანგარიშის ID. ალიასი სახელი უნდა გადაწყდეს, სანამ ის გამოიყენება როგორც `--from` ან `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning ნებართვის საზღვარი

Taira-ზე, თითოეულ წერას ასევე სჭირდება `--metadata ./taira.tx-metadata.json` და მკაფიო გადასახადის გადამხდელი. რეგისტრაცია, გადაცემა, ამოღება და მეტამონაცემების განახლება შემოწმდება პროგრამული უზრუნველყოფის აქტიური შესრულებით გარემო (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` და `CanModifyNftMetadata` გათვალისწინებული ნებართვის ზედაპირში). გამოიყენეთ თქვენი აპლიკაციისათვის მინიჭებული დომენი ან შეინახეთ ეს სიარული localnet- ზე.

:::

ხელშეკრულების საკუთრებაში არსებული სამუშაო პროცესებისთვის, Kotodama გამოხატავს NFT ტიპირებულ ჰოსტი ფუნქციის მოწოდებებს. შემდეგი არის ზუსტი სიცოცხლის ციკლის ტესტის არტეფაქტი, რომელიც შედგენილია და შესრულებულია ჩაკეტილი IVM დოკუმენტაციის ტესტით:

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

ორი ფიქსირებული I105 ღირებულება არის წინსასვლელი საცდელი არტეფაქტები; საცდელმა მგზავრმა რეგისტრაციაში ჩაიდინა დანიშნულების ადგილი შესრულებამდე. ისინი არ არიან `CURRENT_OWNER` და `NEW_OWNER` CLI გადაადგილების შემდეგ. აპლიკაციის ხელშეკრულებისათვის, მიაწოდეთ მისი ფაქტობრივი კანონიკური ანგარიშები, შემდეგ შეადგინეთ, ტესტირდით, განახორციელეთ და მოითხოვეთ იგი [ჭკვიანი ხელშეკრულებები](./smart-contracts.md)-ის მეშვეობით. არ წარუდგინოთ გადაუმოწმებელი ბაიტების კოდი Taira-ზე და გახსოვდეთ, რომ ხელშეკარგვის შესრულება ჯერ კიდევ გადის პროგრამული უზრუნველყოფის გარემოს ავტორიზაციას.

## შემოწმება {#verify}

წაიკითხეთ NFT უშუალოდ და ადასტურეთ, რომ მისი მფლობელი შეიცვალა, სანამ მისი შინაარსი დარჩებოდა მიბმული:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

თუ CLI ჩანაწერს გამოსასვლელი მონაცემების კონტეინერში ამოტვირთავს, ერთხელ შეამოწმეთ JSON და მოიცადეთ განცხადება NFT ობიექტზე. ავტორიტეტული ინვარაციები არის `id`, `owned_by` და `content`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `name$domain` ზოგიერთ პარსერში შეიძლება გათვალისწინებული იყოს საყოველთაო მონაცემთა სივრცეში, მაგრამ სამზარეულოს წიგნებისა და აპლიკაციების ID-ებს უნდა გამოიყენონ ნიშანი `name$domain.dataspace`.
- იგივე NFT ID-ის განმეორებითი რეგისტრაცია უარყოფითია. გამოიყენეთ ახალი ლოკალური ქსელი ან აირჩიეთ სტაბილური ახალი ID განსხვავებული ჩანაწერისთვის.
- მეტამონაცემები შეღება უნდა იყოს მოქმედი JSON სტანდარტული შეღება. გარსი სტრიქონი გარეშე JSON ციტირება არ არის მეტამონაცემები მნიშვნელობა.
- გადარიცხვა, რომელსაც ხელი მოაწერა მიმდინარე მფლობელისგან განსხვავებულმა ანგარიშმა, საჭიროებს ზუსტ ნებართვას; `--from` შეცვლა არ შეიცავს კრიპტოგრაფიული ხელმომწერს.
- გადაცემის შემდეგ, თავდაპირველ კლიენტს NFT ვეღარ შეეძლება მოუტაცია ან რეგისტრაციის გაუქმება. გამოიყენეთ ახალი მფლობელის კრიპტოგრაფიული ხელმოწერა ან ავტორიზებული კონტროლერი.
- Taira შეიძლება დაბრუნდეს ცარიელი NFT კოლექცია. არ განიხილოს `items: []` როგორც მტკიცებულება, რომ NFT ინსტრუქციები არ არის ხელმისაწვდომი.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [NFT ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT მასპინძლის ტექნიკური მოწოდების ტესტები ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ზუსტი Kotodama NFT სიცოცხლის ციკლის გამოცდის არტეფაქტი ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ka/blockchain/nfts.md)
- [მეტამონაცემები](/ka/blockchain/metadata.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
