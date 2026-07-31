---
translation_locale: kk
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Қалған Iroha NFT - бір меншік иесі бар бірегей кітапша объектісі. NFTs мұнда тіркелгі өзінің жеке басын, метамәліметтерін, өмірлік цикл оқиғаларын және иелікті беру семантикасын қажет етеді, бірақ сандық тепе-теңдік қажет емес.

Сандық айырмашылығы [активтер](/kk/blockchain/assets.md), бір NFT нақтылығы, сыйымдылығы немесе есебіне шаққандағы мөлшері жоқ. NFT бір тіркелген нысан ретінде бар, ал меншік тікелей осы объектіге байқалған.

## Құрылымы {#structure}

Тіркелген `Nft` құрамында:

- `id`: бір `NftId`
- `content`: NFT параметрлерін сипаттайтын метабағалар
- `owned_by`: NFT қолына ие болған шот

Қауымдастық `content` өрісі `Metadata` Картаны жинақтап ұстаңыз: сипаттамалық өрістерді сақтау, тұрақты сілтемелер, хештер, URIs, немесе SoraFS Үлкен құжаттарды, медианы немесе жоғары шығынды қолданбаларды тізбектен тыс сақтаңыз және тек тексеруге болатын сілтемелерді сақтау NFT.

## Taira арқылы сынап көріңіз. {#try-it-on-taira}

Қоғамдық Taira тестілеу желісінің қазіргі уақытта NFT жазбалары бар-жоғын тексеріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Тікелей OpenAPI құжатын түйіннің NFT жолдарына тексеру:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Бос орын `items` массив - қоғамдық тесттік желіде жарамды жауап. NFTs ағымдағы бетте, бұл емес NFT нұсқаулар жоқ.

## NFT IDs {#nft-ids}

`NftId` мынадай мәтінді пайдаланады:

```text
name$domain
name$domain.dataspace
```

Мысалы, `badge$docs.universal` белгілейді `badge` NFT және `docs.universal` Егер деректер кеңістігі қалдырылса, ағымдағы талдаушы `universal` деректер кеңістігі, сондықтан `badge$docs` шешіледі `badge$docs.universal`.

Тұрақты атаулар қолданылсын NFT IDs. Қауымдастық ID нұсқаулар, сұрау салулар, рұқсаттар, оқиға сүзгілері және қолданба сілтемелерімен қолданылатын нысандық сәйкестік.

## Өмір циклі {#lifecycle}

NFT өмірлік циклді пайдалану Iroha Арнайы нұсқаулар:

- [`Register`](/kk/blockchain/instructions.md#un-register) құрылады NFT бастапқы `content`.
- [`Unregister`](/kk/blockchain/instructions.md#un-register) NFT дегенді алып тастайды.
- [`Transfer`](/kk/blockchain/instructions.md#transfer) өзгерістері `owned_by`.
- [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) жаңарту NFT метамәдени деректер.

## Жергілікті деңгейде сынап көріңіз {#try-it-locally}

Бұл мысалдар сіз жергілікті желіді іске қосқаныңызды және [CLI нұсқаулықтан ](/kk/get-started/operate-iroha-via-cli.md) клиент конфигурациясын пайда еткеніңізді болжайды:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Жаратылған локальдік желі қазірдің өзінде орнатылады `wonderland.universal` және оның SNS басқа да доменді пайдалану үшін алдымен декларативті `app alias setup plan` және `app alias setup apply` жұмыс ағыны [Домендер](/kk/blockchain/domains.md#registration).

NFT тіркелу стандартты кірістен бастапқы мазмұны JSON оқылады:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Тікелей NFT тексеріңіз, содан кейін барлық NFTs тізімдерін толық жазумен келтіріңіз:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Метамәліметтер кілтісін қосып, NFT дегенді қайта оқыңыз:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Метадеректер кілтісін алып тастаңыз:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Мүмкіндігінше көшіру NFT. Пайдалану `ledger nft get` қазіргі иесін оқу үшін `owned_by`, және пайдалану `ledger account list all` мақсаттағы шотты табу ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Егер сіз NFT көшірген болсаңыз, осы команданы ағымдағы меншік иесінің есептік жазбасының конфигурациясымен орындаңыз немесе NFT қайта көшіріңіз.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Сұрақтар мен оқиғалар {#queries-and-events}

Пайдалану [`FindNfts`](/kk/reference/queries.md#assets-nfts-and-rwas) тізімдеу NFTs және [`FindNftsByAccountId`](/kk/reference/queries.md#assets-nfts-and-rwas) тізімдеу NFTs Есепшоттың иелігінде.

NFT Тіркеу, өшіру, көшіру және метамәдени мәліметтерді жаңарту NFT деректер оқиғалары. `Nft` деректер оқиғасы сүзгісі тіркелгінің өзгерістеріне абонамент берген кезде немесе реакция жасайтын құрылғыларды NFT өмірлік цикл оқиғалары.

## Рұқсаттар {#permissions}

Әдеттегі рұқсат бетіне NFT -ға арналған белгілер кіреді:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Рұқсаттарды тексеруді белсенді орындау уақытын растаушы жүзеге асырады, сондықтан желі орындаушыны жаңарту арқылы рұқсатты баптай алады. [Рұқсат белгілері](/kk/reference/permissions.md) ағымдағы әдеттегі белгілер тізімі үшін.

## NFTs таңдау {#choosing-nfts}

Ерекшелігі мен меншік мәні бар жазбалар үшін NFT белгісін пайдалан:

- сертификаттар, белгілер, лицензиялар және куәліктер
- мүшелік немесе қолжетімділік жазбалары
- сәйкестікке байланысты немесе шотқа тиесілі өтініштердің жазбалары
- тізбектен тыс ақпарат құралдарына, құжаттарға немесе манифесттерге сілтемелер

Фунгибельді баланстар үшін сандық активті пайдаланыңыз, ал деректер бар кітапша объектісінің тек компакт-аттрибуты болған кезде жай [ метамәдени деректерді](/kk/blockchain/metadata.md) қолданыңыз.

Сондай-ақ қараңыз:

- [Активтер](/kk/blockchain/assets.md)
- [Метамәліметтер](/kk/blockchain/metadata.md)
- [Нұсқаулықтар](/kk/blockchain/instructions.md)
- [Сұрақтар](/kk/blockchain/queries.md)
