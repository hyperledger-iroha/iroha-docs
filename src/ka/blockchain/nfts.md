---
translation_locale: ka
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT არის უნიკალური ბლოკჩეინის რეესტრის ობიექტი, რომელსაც აქვს ერთი მფლობელი. გამოიყენეთ NFTs როდესაც ჩანაწერს სჭირდება საკუთარი იდენტობა, მეტამონაცემები, სიცოცხლის ციკლის მოვლენები და საკუთრების გადაცემის სემანიტიკა, მაგრამ არ საჭიროებს რიცხვობრივ ბალანსს.

ციფრული [აქტივი](/ka/blockchain/assets.md) -ისგან განსხვავებით, NFT-ს არ აქვს სიზუსტე, აქტივების გამოშვების პოლიტიკა ან ანგარიშზე არსებული რაოდენობა. NFT არსებობს როგორც ერთი რეგისტრირებული ობიექტი და საკუთრებაში შედის პირდაპირ ამ ობიექტში.

## სტრუქტურა {#structure}

რეგისტრირებული `Nft` შეიცავს:

- `id`: ან `NftId`
- `content`: მეტაანახები, რომლებიც აღწერენ NFT
- `owned_by`: ანგარიში, რომელიც ფლობს NFT

`content` ველი არის `Metadata` რუკა. შეინახეთ იგი კომპაქტურად: ინახეთ დისკრიპტიური ველები, სტაბილური რეფერენციები, კრიფტოგრაფიული ჰეშები, URIs ან SoraFS გზები იქ. ინახეთ დიდი დოკუმენტები, მედია ან მაღალი მოცულობის აპლიკაციების მდგომარეობა ქსელის გარეთ და ინახეთ მხოლოდ შემოწმებადი რეფერენცია NFT.

## განახორციელეთ ეს სამუშაო პროცესი Taira {#try-it-on-taira}

შეამოწმეთ, აქვს თუ არა საჯარო Taira ტესტნეტში ამჟამად NFT ჩანაწერები:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

შეამოწმეთ ცოცხალი OpenAPI დოკუმენტი NFT მარშრუტებისათვის, რომლებიც კვანძის მიერ გამოფენილია:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

ცარიელი `items` მასაჟი არის ვალიდური პასუხი საჯარო ტესტნეტზე. ეს ნიშნავს, რომ არ არსებობს NFTs მიმდინარე გვერდზე, არა ის, რომ NFT ინსტრუქციები არ არის ხელმისაწვდომი .

## NFT იდენტიფიკაციები {#nft-ids}

`NftId` იყენებს ამ ტექსტის ფორმას:

```text
name$domain
name$domain.dataspace
```

მაგალითად, `badge$docs.universal` იდენტიფიცირებს `badge` NFT დომენში `docs.universal`. თუ მონაცემთა სივრცე გამორიცხულია, მიმდინარე პარსერი იყენებს `universal` მონაცემთა სიფართოს, ასე რომ `badge$docs` გადაწყდება `badge$docs.universal`.

გამოიყენეთ სტაბილური სახელები NFT ID-ებისთვის. ID არის ობიექტის იდენტობა, რომელსაც იყენებენ ინსტრუქციები, კითხვები, ნებართვები, მოვლენების ფილტრები და აპლიკაციების რეფერენციები.

## სიცოცხლის ციკლი {#lifecycle}

NFT სიცოცხლის ციკლის ოპერაციების გამოყენება Iroha ინსტრუქციის ოპერაციები:

- [`Register`](/ka/blockchain/instructions.md#un-register) ქმნის NFT საწყისი `content`.
- [`Unregister`](/ka/blockchain/instructions.md#un-register) ამოიღებს NFT.
- [`Transfer`](/ka/blockchain/instructions.md#transfer) ცვლილებები `owned_by`.
- [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) განახლება NFT მეტამონაცემები.

## შეეცადეთ ადგილობრივად {#try-it-locally}

აღნიშნული მაგალითები ითვალისწინებს, რომ თქვენ განახორციელეთ ადგილობრივი ქსელი და გენერირებული გაქვთ კლიენტის კონფიგურაცია [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

გენერირებული ლოკალურმა ქსელმა უკვე დააყენა `wonderland.universal` და მისი SNS იჯარის ხელშეკრულება. სხვა დომენის გამოყენების მიზნით, შეიქმნას ის ჯერ დეკლარაციური `app alias setup plan` და `app alias setup apply` სამუშაო პროცესით, რომელიც აღწერილია [დომენები](/ka/blockchain/domains.md#registration).

დარეგისტრირება NFT. რეგისტრაციაში იკითხება სტანდარტული შესასვლელიდან საწყისი შინაარსი JSON:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

შეამოწმეთ NFT უშუალოდ და შემდეგ ჩამოთვალეთ ყველა NFTs სრული მითითებით:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

დაამატეთ მეტამონაცემების გასაღები და წაიკითხეთ NFT კიდევ ერთხელ:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

ამოიღეთ მეტამონაცემების გასაღები:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

ვარიანტით გადაიტანეთ NFT. გამოიყენეთ `ledger nft get` იმისთვის, რომ წაიკითხოთ მიმდინარე მფლობელი `owned_by`-დან და გამოიყენეთ `ledger account list all` მიზნობრივი ანგარიშის ID-ის მოსაძებნად.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

ამოიღეთ მაგალითი NFT გასვლის შემდეგ. თუ გადაიტანა, ან გადაიტანეთ იგი უკან ან წარუდგინეთ არარეგისტრირების ბრძანება მიმდინარე მფლობელის ანგარიშის კონფიგურაციით.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## კითხვები და მოვლენები {#queries-and-events}

გამოყენება [`FindNfts`](/ka/reference/queries.md#assets-nfts-and-rwas) ჩამოთვლილი NFTs და [`FindNftsByAccountId`](/ka/reference/queries.md#assets-nfts-and-rwas) ჩამოთვლილი NFTs ანგარიშის მფლობელი.

NFT რეგისტრაციის, წაშლის, გადაცემის და მეტამონაცემების განახლებები გამოიყოფენ NFT მონაცემთა მოვლენებს. გამოიყენეთ `Nft` მონაცემთა მოვლენის ფილტრი, როდესაც აბონენტობთ ბლოკჩეინის რეესტრის ცვლილებებზე ან აგებთ ტრიგერ ფაქტორებს, რომლებიც რეაგირებენ NFT ცხოვრების ციკლის მოვლენებს .

## ნებართვები {#permissions}

გათვალისწინებული ნებართვის ზედაპირი შეიცავს NFT-ს სპეციფიკურ ტოქნებს:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ნებართვის შემოწმებას ახორციელებს აქტიური შესრულების გარემოს ვალიდატორი, ასე რომ ქსელს შეუძლია განახორციელოს ავტორიზაცია აღმასრულებლის განახლებით. იხილეთ [ნებართვის ტოკენები](/ka/reference/permissions.md) მიმდინარე გათვალისწინებული ტოქნების ჩამონათვალისთვის.

## არჩევანი NFTs {#choosing-nfts}

გამოიყენეთ NFT იმ ჩანაწერებისათვის, სადაც მნიშვნელობა აქვს უნიკალურობასა და საკუთრებას:

- სერტიფიკატები, ბეჯები, ლიცენზიები და ატესტაციები
- წევრობის ან წვდომის ჩანაწერები
- პირადობის დამაკავშირებელი ან ანგარიშის საკუთრებაში არსებული განაცხადის ჩანაწერები
- მიმოხილვა არაფხისოვანი მედია, დოკუმენტების ან ტექნიკური მანიფესტების შესახებ

გამოიყენეთ ციფრული აქტივი ფუნქციონირებადი ბალანდებისთვის და გამოიყენეთ უბრალო [მეტამონაცემები](/ka/blockchain/metadata.md), როდესაც მონაცემები მხოლოდ არსებული ბლოკჩეინის რეესტრის ობიექტის კომპაქტური ატრიბუტია.

იხილეთ ასევე:

- [აქტივები](/ka/blockchain/assets.md)
- [მეტამონაცემები](/ka/blockchain/metadata.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [კითხვები](/ka/blockchain/queries.md)
