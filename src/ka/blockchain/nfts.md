---
translation_locale: ka
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT არის უნიკალური წიგნის ობიექტი, რომელსაც აქვს ერთი მფლობელი. გამოიყენეთ NFTs როდესაც ჩანაწერი სჭირდება საკუთარი იდენტობა, მეტა მონაცემები, ცხოვრების ციკლის მოვლენები და საკუთრების გადაცემის სემანტიკა, მაგრამ არ საჭიროებს რიცხვობრივ ბალანსს.

განსხვავებით რიცხვებისაგან. [აქტივი](/ka/blockchain/assets.md), დასახელება NFT არ აქვს სიზუსტე, მძლავრობა ან რაოდენობა ერთ ანგარიშზე. NFT არსებობს, როგორც ერთი რეგისტრირებული ობიექტი და საკუთრებაში შედის პირდაპირ ამ ობიექტზე.

## სტრუქტურა {#structure}

რეგისტრირებული `Nft` შეიცავს:

- `id`: ან `NftId`
- `content`: მეტაანახები, რომლებიც აღწერენ NFT
- `owned_by`: ანგარიში, რომელიც ფლობს NFT

`content` ველი არის `Metadata` რუკა. შეინახეთ იგი კომპაქტურად: შეინახეთ აღწერილ ველები, სტაბილური რეფერენციები, ჰაშები, URIs ან SoraFS გზები იქ. შეინახე დიდი დოკუმენტები, მედია ან მაღალი მოცულობის აპლიკაციის სახელმწიფო off-chain და შეინახე მხოლოდ შემოწმებადი რეფერენცია NFT.

## სცადეთ Taira {#try-it-on-taira}

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

## NFT IDs {#nft-ids}

`NftId` იყენებს ამ ტექსტის ფორმას:

```text
name$domain
name$domain.dataspace
```

მაგალითად, `badge$docs.universal` იდენტიფიცირებს `badge` NFT დომენში `docs.universal`. თუ მონაცემთა სივრცე გამორიცხულია, მიმდინარე პარსერი იყენებს `universal` მონაცემთა სიფართოს, ასე რომ `badge$docs` გადაწყდება `badge$docs.universal`.

გამოიყენეთ სტაბილური სახელები NFT IDs. ID არის ობიექტის იდენტობა, რომელსაც იყენებენ ინსტრუქციები, გამოკითხვები, ნებართვები, მოვლენების ფილტრები და აპლიკაციის რეფერენციები.

## სიცოცხლის ციკლი {#lifecycle}

NFT სიცოცხლის ციკლის ოპერაციების გამოყენება Iroha სპეციალური ინსტრუქციები:

- [`Register`](/ka/blockchain/instructions.md#un-register) ქმნის NFT ინიციალურით `content`.
- [`Unregister`](/ka/blockchain/instructions.md#un-register) ამოიღებს NFT.
- [`Transfer`](/ka/blockchain/instructions.md#transfer) ცვლილებები `owned_by`.
- [`SetKeyValue` და `RemoveKeyValue`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) განახლება NFT მეტა მონაცემები.

## შეეცადეთ ადგილობრივად {#try-it-locally}

ეს მაგალითები ითვალისწინებს, რომ თქვენ გაუშვით ადგილობრივი ქსელი და გენერირებული აქვს კლიენტის კონფიგურაცია [CLI სახელმძღვანელო](/ka/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

გენერირებული ლოკალურმა ქსელმა უკვე დააყენა `wonderland.universal` და მისი SNS იჯარითი ხელშეკრულება. სხვა დომენის გამოყენების მიზნით, შეიქმნას იგი ჯერ დეკლარაციური `app alias setup plan` და `app alias setup apply` სამუშაო ნაკადი, რომელიც აღწერილია [დომენებში](/ka/blockchain/domains.md#registration).

დარეგისტრირება NFT. რეგისტრაციაში იკითხება სტანდარტული შესასვლელიდან საწყისი შინაარსი JSON:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

შეამოწმეთ NFT პირდაპირ და შემდეგ ჩამოთვალეთ ყველა NFTs სრული მითითებით:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

დაამატეთ მეტა მონაცემების გასაღები და წაიკითხეთ NFT კიდევ ერთხელ:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

ამოიღეთ მეტა მონაცემების გასაღები:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

NFT ვარიანტულად გადაიტანეთ. გამოიყენეთ `ledger nft get` იმისთვის, რომ წაიკითხოთ მიმდინარე მფლობელი `owned_by`-დან და გამოიყენეთ `ledger account list all` მიზნობრივი ანგარიშის მოსაძებნად ID.

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

გამოიყენეთ [`FindNfts`](/ka/reference/queries.md#assets-nfts-and-rwas), რომ ჩამოთვალოთ NFTs და [`FindNftsByAccountId`](/ka/reference/queries.md#assets-nfts-and-rwas) ანგარიშის საკუთრებაში არსებული NFTs.

NFT რეგისტრაციის, წაშლის, გადაცემის და მეტა მონაცემების განახლებები გამოიყოფენ NFT მონაცემთა მოვლენებს. გამოიყენეთ `Nft` მონაცემთა მოვლენის ფილტრი, როდესაც გამოითვალისწინებთ ბუღალტრში ცვლილებებს ან აშენებთ გამომწვევ ფაქტორებს, რომლებიც რეაგირებენ NFT ცხოვრების ციკლის მოვლენებზე.

## ნებართვები {#permissions}

გათვალისწინებული ნებართვის ზედაპირი შეიცავს NFT-ს სპეციფიკურ ტოქნებს:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ნებართვის შემოწმებას ახორციელებს აქტიური გამშვები დროის ვალიდატორი, ასე რომ ქსელს შეუძლია განახორციელოს ნებართვა აღმასრულებლის განახლებით. იხილეთ [ ნებართვების ტოქნები](/ka/reference/permissions.md) ამჟამინდელი გათვალისწინებული ტოქნების ჩამონათვალისთვის.

## არჩევანი NFTs {#choosing-nfts}

გამოიყენეთ NFT იმ ჩანაწერებისათვის, სადაც მნიშვნელობა აქვს უნიკალურობასა და საკუთრებას:

- სერტიფიკატები, ბეჯები, ლიცენზიები და ატესტაციები
- წევრობის ან წვდომის ჩანაწერები
- პირადობის დამაკავშირებელი ან ანგარიშის საკუთრებაში არსებული განაცხადის ჩანაწერები
- მითითებები არაჩაერთმეტი მედიის, დოკუმენტების ან მანიფესტების შესახებ.

გამოიყენეთ ციფრული აქტივი ფუნქციონირებადი ბალანდებისთვის და გამოიყენეთ უბრალო [ მეტა მონაცემები](/ka/blockchain/metadata.md), როდესაც მონაცემები მხოლოდ არსებული ლიდერის ობიექტის კომპაქტური ატრიბუტია.

იხილეთ ასევე:

- [აქტივები](/ka/blockchain/assets.md)
- [მეტა მონაცემები](/ka/blockchain/metadata.md)
- [ინსტრუქციები](/ka/blockchain/instructions.md)
- [შეკითხვები](/ka/blockchain/queries.md)
