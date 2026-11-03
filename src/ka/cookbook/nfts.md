---
translation_locale: ka
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## შედეგები {#outcome}

ინსპექტირება Taira NFT დაფიქსირება, შემდეგ რეგისტრაცია, განახლება, გადაცემა და მოთხოვნა უნიკალური NFT გენერირებულ ადგილობრივ ქსელში. სამუშაო მიმდინარეობა იყენებს სრულად კვალიფიციურ `name$domain.dataspace` NFT იდენტიფიკაცია და კანონიკური I105 მფლობელის პირადობის მოწმობა.

## წინაპირობები {#prerequisites}

- `curl`, `jq`, Python 3.11 ან უფრო გვიან და მიმდინარე `iroha` CLI.
- მხოლოდ წაკითხვის საშუალებით Taira.
- ჩაწერისთვის: ლოკალური ქსელი ბრძანებით `kagami localnet generate --peers 4 --out-dir ./localnet`, როგორც გვერდზე [Iroha-ს გაშვება](/ka/get-started/launch-iroha.md), `./localnet/client.toml`-ითა და Torii-ით მისამართზე `http://127.0.0.1:8080`, ასევე NFT დომენი, რომელსაც მისი ხელმომწერი ფლობს (იხილეთ მე-2 ნაბიჯი).

## ნაბიჯები {#steps}

### 1. შეამოწმეთ საზოგადოებრივი Taira კოლექცია. {#_1-inspect-the-public-taira-collection}

ცარიელი გვერდი წარმატებული წაკითხვაა: ეს ნიშნავს, რომ მოთხოვნილ გვერდზე NFTs ხილული არ არის.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs უნიკალური ჩანაწერებია და არა რიცხვითი ბალანსები. მათ აქვთ ID, ერთი მფლობელი და კომპაქტური შიგთავსის რუკა, რომელსაც Torii-ის კოლექციის მწკრივები აბრუნებს როგორც `metadata`, ხოლო `ledger nft get` — როგორც `content`.

### 2. მომზადეთ ადგილობრივი მფლობელის პირადობის მოწმობა {#_2-prepare-local-owner-ids}

ჩაწერის მაგალითს სჭირდება დომენი, რომელსაც ხელმომწერი ანგარიში ფლობს, ან მასზე `CanRegisterNft` ნებართვის მინიჭება. გენერირებული ლოკალური ქსელი თავისი კლიენტისთვის აპლიკაციის დომენს არ არეგისტრირებს, ხოლო დომენის პირდაპირი რეგისტრაცია გენეზისისთვისაა დაცული, ამიტომ `NFT_DOMAIN`-ს მიანიჭეთ `name.dataspace` დომენი, რომელსაც თქვენი ხელმომწერი მართავს. გამოიყვანეთ კონფიგურირებული უფლებამოსილი ანგარიში მისი პირადი გასაღების გამჟღავნების გარეშე, შემდეგ კი გადაცემის დანიშნულებად აირჩიეთ სხვა რეგისტრირებული ანგარიში.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` გამყოფი NFT-ის ტექსტური ფორმის ნაწილია. ID-ში შეინარჩუნეთ სრული `name.dataspace` დომენი.

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

Taira-ზე ყოველი ჩაწერა იყენებს `--fee-payer authority`-ს; CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში. რეგისტრაციას, გადაცემას, წაშლასა და მეტამონაცემების განახლებას ამოწმებს აქტიური შესრულების გარემო (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` და `CanModifyNftMetadata` ნაგულისხმევი ნებართვების ზედაპირში). გამოიყენეთ დომენი, რომელსაც თქვენი ანგარიში ფლობს, ან დომენი, რომლისთვისაც მას ეს ნებართვები აქვს მინიჭებული.

:::

ხელშეკრულების საკუთრებაში არსებული სამუშაო პროცესებისთვის, Kotodama გამოხატავს NFT ტიპირებულ ჰოსტი ფუნქციის მოწოდებებს. შემდეგი არის ზუსტი სიცოცხლის ციკლის ტესტის არტეფაქტი, რომელიც შედგენილია და შესრულებულია ჩაკეტილი IVM დოკუმენტაციის ტესტით:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI თავად NFT-ის ჩანაწერს ბეჭდავს. გადამწყვეტი ინვარიანტებია `id`, `owned_by` და `content`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `name$domain` ზოგიერთ პარსერში შეიძლება გათვალისწინებული იყოს საყოველთაო მონაცემთა სივრცეში, მაგრამ სამზარეულოს წიგნებისა და აპლიკაციების ID-ებს უნდა გამოიყენონ ნიშანი `name$domain.dataspace`.
- იგივე NFT ID-ის განმეორებითი რეგისტრაცია უარყოფითია. გამოიყენეთ ახალი ლოკალური ქსელი ან აირჩიეთ სტაბილური ახალი ID განსხვავებული ჩანაწერისთვის.
- მეტამონაცემები შეღება უნდა იყოს მოქმედი JSON სტანდარტული შეღება. გარსი სტრიქონი გარეშე JSON ციტირება არ არის მეტამონაცემები მნიშვნელობა.
- გადაცემას, რომელსაც ხელს აწერს მიმდინარე მფლობელისგან განსხვავებული ანგარიში, სჭირდება NFT-ის დომენის ფლობა ან ზუსტი `CanTransferNft` ნებართვის მინიჭება; `--from`-ის შეცვლა ხელმომწერს არ ცვლის.
- გადაცემა მხოლოდ `owned_by`-ს ცვლის. მეტამონაცემების განახლება და რეგისტრაციის გაუქმება რჩება დომენის მფლობელთან ან ანგარიშთან, რომელსაც ამ NFT-ისთვის აქვს `CanModifyNftMetadata` ან `CanUnregisterNft`; ახალ მფლობელს შეუძლია მისი შემდგომი გადაცემა.
- Taira შეიძლება დაბრუნდეს ცარიელი NFT კოლექცია. არ განიხილოს `items: []` როგორც მტკიცებულება, რომ NFT ინსტრუქციები არ არის ხელმისაწვდომი.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [NFT ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT მასპინძლის ტექნიკური მოწოდების ტესტები ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ზუსტი Kotodama NFT სიცოცხლის ციკლის გამოცდის არტეფაქტი ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Kotodama-ს დოკუმენტაციის მაგალითების ტესტები დამაგრებული წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ka/blockchain/nfts.md)
- [მეტამონაცემები](/ka/blockchain/metadata.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [ნებართვის ტოკენები](/ka/reference/permissions.md)
