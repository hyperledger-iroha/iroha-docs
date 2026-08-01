---
translation_locale: kk
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT - бұл бір меншік иесі бар бірегей кітапша объектісі. Тіркемеге өзінің жеке сәйкестігі, метамәліметтері, өмірлік цикл оқиғалары және иелікті беру семантикасы қажет болса, бірақ сандық тепе-теңдікке мұқтаж болмаған кезде NFTs қолданылсын.

Сандық [ активтерден ](/kk/blockchain/assets.md) айырмашылығы, NFT -де нақтылық, миндабильность немесе есептік сандар жоқ. NFT - бір тіркелген нысан ретінде бар, ал меншік тікелей сол объектке тіркеледі.

## Құрылымы {#structure}

Тіркелген `Nft` құрамында:

- `id`: бір `NftId`
- `content`: NFT параметрлерін сипаттайтын метабағалар
- `owned_by`: NFT қолына ие болған шот

`content` өрісі - `Metadata` картасы. Оны тығыз сақтаңыз: сипаттамалық өрістерді, тұрақты сілтемелерді, хештарды, URIs немесе SoraFS жолдарын сақтаңыз. Үлкен құжаттарды, медианы немесе жоғары қимыллы қолданбаларды тізбектен тыс сақтау және тек тексерілетін сілтемені ғана NFT.

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

Бос `items` массиві - қоғамдық тестілеу желісінде жарамды жауап. Бұл ағымдағы бетте NFTs жоқ дегенді білдірмейді, бірақ NFT нұсқаулары қолжетімді емес.

## NFT IDs {#nft-ids}

`NftId` мынадай мәтінді пайдаланады:

```text
name$domain
name$domain.dataspace
```

Мысалы, `badge$docs.universal` белгілейді `badge` NFT және `docs.universal` Егер деректер кеңістігі қалдырылса, ағымдағы талдаушы `universal` деректер кеңістігі, сондықтан `badge$docs` шешіледі `badge$docs.universal`.

NFT IDs үшін тұрақты атауларды пайдаланыңыз. ID нұсқаулар, сұраулар, рұқсаттар, оқиға сүзгілері және қолданба сілтемелерінде қолданылатын нысандық идентификация болып табылады.

## Өмір циклі {#lifecycle}

NFT өмірлік циклді пайдалану Iroha Арнайы нұсқаулар:

- [`Register`](/kk/blockchain/instructions.md#un-register) бастапқы `content` арқылы NFT құрылады.
- [`Unregister`](/kk/blockchain/instructions.md#un-register) NFT дегенді алып тастайды.
- [`Transfer`](/kk/blockchain/instructions.md#transfer) өзгерістері `owned_by`.
- [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) жаңартылған NFT метамәліметтері.

## Жергілікті деңгейде сынап көріңіз {#try-it-locally}

Бұл мысалдар сіз жергілікті желіді іске қосқаныңызды және [CLI нұсқаулықтан ](/kk/get-started/operate-iroha-via-cli.md) клиент конфигурациясын пайда еткеніңізді болжайды:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Жаратылған локальдік желі қазірдің өзінде `wonderland.universal` және оның SNS жалғасын береді. Басқа доменді пайдалану үшін алдымен оны `app alias setup plan` және `app alias setup apply` декларативтік жұмыс барысымен құрыңыз, бұл [ Домендер](/kk/blockchain/domains.md#registration).

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

NFT мысалын басып өткеннен кейін алып тастаңыз. Егер сіз оны көшірсеңіз, оны қайта көшіріңіз немесе ағымдағы иесінің тіркелгісінің конфигурациясымен тіркеуден шығу командасын тапсырыңыз.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Сұрақтар мен оқиғалар {#queries-and-events}

[`FindNfts`](/kk/reference/queries.md#assets-nfts-and-rwas)-ді пайдалану арқылы NFTs және [`FindNftsByAccountId`](/kk/reference/queries.md#assets-nfts-and-rwas)-ті пайдалану арқылы NFTs тіркелгінің меншігі болып табылады.

NFT тіркелу, өшіру, беру және метамәліметтерді жаңартулар NFT деректер оқиғаларын шығарады. `Nft` дерек оқиғалары сүзгісін NFT өмірлік циклдегі оқиғаларға реакция жасайтын кітапша өзгерістеріне абонамент берген кезде немесе триггерлерді құру кезінде қолданыңыз.

## Рұқсаттар {#permissions}

Әдеттегі рұқсат бетіне NFT -ға арналған белгілер кіреді:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Рұқсаттарды тексеруді белсенді орындау уақытын растаушы жүзеге асырады, сондықтан желі орындаушысын жаңарту арқылы рұқсаттарды баптай алады. [Рұқсат белгілері](/kk/reference/permissions.md) ағымдағы әдеттегі белгілер тізімі үшін.

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
