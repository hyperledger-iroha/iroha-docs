---
translation_locale: ka
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

სააგენტო Iroha NFT არის უნიკალური ლიდერის ობიექტი ერთი მფლობელის. გამოიყენეთ NFTs როდესაც ჩანაწერს სჭირდება საკუთარი იდენტობა, მეტა მონაცემები, სიცოცხლის ციკლის მოვლენები და საკუთრების გადაცემის სემანტიკა, მაგრამ არ საჭიროებს რიცხვობრივ ბალანსს.

განსხვავებით რიცხვებისაგან. [აქტივი](/ka/blockchain/assets.md), დასახელება NFT არ აქვს სიზუსტე, მძლავრობა ან რაოდენობა ერთ ანგარიშზე. NFT არსებობს, როგორც ერთი რეგისტრირებული ობიექტი და საკუთრებაში შედის პირდაპირ ამ ობიექტზე.

## სტრუქტურა {#structure}

რეგისტრირებული `Nft` შეიცავს:

- `id`: ან `NftId`
- `content`: მეტაანახები, რომლებიც აღწერენ NFT
- `owned_by`: ანგარიში, რომელიც ფლობს NFT

სააგენტო `content` ველი არის a `Metadata` რუკა. შეინახეთ იგი კომპაქტური: შენახვა აღწერადი ველები, სტაბილური რეფერენციები, hashes, URIs, ან SoraFS შეინახეთ დიდი დოკუმენტები, მედია ან მაღალი მოცულობის აპლიკაციების სახელმწიფო off-chain და ინახება მხოლოდ შემოწმებადი მინიშნება NFT.

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

ცარიელი. `items` მაჟორიტარი არის საჯარო ტესტის ქსელში მოქმედი პასუხი. ეს ნიშნავს, რომ არ არსებობს NFTs ამჟამინდელ გვერდზე, არა რომ NFT მითითებები არ არის ხელმისაწვდომი.

## NFT IDs {#nft-ids}

`NftId` იყენებს ამ ტექსტის ფორმას:

```text
name$domain
name$domain.dataspace
```

მაგალითად, `badge$docs.universal` იდენტიფიცირებს `badge` NFT დაწვრილებით `docs.universal` დომენი. თუ მონაცემთა სივრცე გამორიცხულია, ამჟამინდელი პარსერი იყენებს `universal` მონაცემთა სივრცე, ასე რომ `badge$docs` განსაზღვრავს `badge$docs.universal`.

გამოიყენეთ სტაბილური სახელები NFT IDs. სააგენტო ID არის საგნის იდენტობა, რომელიც გამოიყენება ინსტრუქციებით, გამოკითხვებით, ნებართვებით, მოვლენების ფილტრებით და აპლიკაციის რეფერენციებით.

## სიცოცხლის ციკლი {#lifecycle}

NFT სიცოცხლის ციკლის ოპერაციების გამოყენება Iroha სპეციალური ინსტრუქციები:

- [`Register`](/ka/blockchain/instructions.md#un-register) ქმნის NFT საწყისი `content`.
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

გენერირებული ადგილობრივი ქსელი უკვე შედგება `wonderland.universal` და მისი SNS გაქირავება. სხვა დომენის გამოყენებისათვის, ჯერ შეიქმნას იგი დეკლარატული `app alias setup plan` და `app alias setup apply` სამუშაო მიმდინარეობა, რომელიც აღწერილია [დომენები](/ka/blockchain/domains.md#registration).

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

ვარიანტით გადაიტანეთ NFT. გამოყენება `ledger nft get` ამჟამინდელი მფლობელის წაკითხვა `owned_by`, და გამოყენება `ledger account list all` დანიშნულების ანგარიშის მოძიება ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

გაწმენდით, როდესაც დასრულდება. თუ გადაიტანეთ NFT, განახორციელეთ ეს ბრძანება მიმდინარე მფლობელის ანგარიშის კონფიგურაციით ან გადაიტანოთ NFT ჯერ ისევ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## კითხვები და მოვლენები {#queries-and-events}

გამოყენება [`FindNfts`](/ka/reference/queries.md#assets-nfts-and-rwas) ჩამოთვლილი NFTs და [`FindNftsByAccountId`](/ka/reference/queries.md#assets-nfts-and-rwas) ჩამოთვლილი NFTs ანგარიშის მფლობელი.

NFT რეგისტრაციის, წაშლის, გადაცემის და მეტა მონაცემების განახლებების გამოშვება NFT მონაცემთა მოვლენები. გამოიყენეთ `Nft` მონაცემთა მოვლენების ფილტრი, როდესაც რეგისტრაციაში ცვლილებები ან შენობა-ნაგებობები, რომლებიც რეაგირებენ NFT სიცოცხლის ციკლის მოვლენები.

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
