---
translation_locale: ba
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Аноним транзакциялар {#anonymous-transactions}

Iroha менән аноним транзакциялар конфиденциаль актив операцияларынан төҙөлә. Йәмәғәт суммалары менән иҫәп-хисаптан-хисапҡа күсереүҙәр яҙыу урынына, аҡса янсығы ҡиммәтен һаҡланған китапҡа күсерә һәм һуңынан нуль белемле иҫбатлауҙар менән үтә күренмәгән банкноталарҙы тотона.

Йәмәғәт кенәгәһе әле лә конфиденциаль операцияның булғанын теркәп тора. Ул йөкләмәләрҙе, юҡҡа сығарыусыларҙы, иҫбатлау хэштегтарын һәм ваҡиғаларҙы теркәп бара, әммә банкнота хужаһын, алыусыны йәки һаҡланған күләмдәге хәрәкәт өсөн сумманы яҙмай. Ғәҙәттәгесә, транзакция конвертында тапшырыусы иҫәб әле лә асыла ала, шуға күрә "аноним" бында аноним активтар хәрәкәте тигәнде аңлата, ә селтәр кимәлендәге йәки иҫәп-хисап кимәлендәге анонимлыҡ түгел.

## Төҙөлөш блоктары {#building-blocks}

|Концепция |Леджерҙағы сағыштырыу |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Ҡулланма кәгазь |Аҡса, сумма, хужаһы мәғлүмәттәрен һәм осраҡлылыҡты үҙ эсенә алған шәхси аҡса янсығы яҙмаһы. |
|Вазифалар |32 байтлы йәмәғәт ҡиммәте, уның майҙансыҡтарын асып тормайынса нотаға йөкмәтелә. |
|Тейешһеҙләндереүсе |Iroha икеләтә тотоноуҙы иҫкәртеү өсөн ҡабатланған юҡҡа сығарыусыларҙы кире ҡаға. |
|Меркл тамырҙары |Аҡсаның йөкләмә ағасының яңы тамырҙары. иҫбатлауҙар уны тотонолған аҡсаларҙың булыуын күрһәтеү өсөн ҡуллана. |
|Дәлилдәрҙе ҡушыу |`ProofAttachment` иҫбатлау байты һәм тикшереү асҡысы менән һылтанма йәки һыҙыҡлы тикшереү асҡысы булған. |
|Серле ваҡиға | Бухгалтер ваҡиғаһы кеүек `ConfidentialEvent::Shielded`, `Transferred`, йәки `Unshielded`.                              |

Төп күрһәтмәләр:

- `RegisterZkAsset`: активты ZK-ҡа һәләтле тип теркәй һәм күсермә, ҡалҡан һәм ҡалҡанһыҙ раҫлау сымдарын бәйләй.
- `Shield`: дәүләт балансын түләтә һәм һаҡланған банкнота йөкләмәһен ҡушып ҡуя.
- `ZkTransfer`: һаҡланған банкноталарҙы яңы һаҡланған банкнот йөкләмәләренә тотона.
- `Unshield`: һаҡланған банкноталарҙы сарыф итә һәм дәүләт иҫәбенә баланс бирә.
- `ScheduleConfidentialPolicyTransition` һәм `CancelConfidentialPolicyTransition`: идара итеү аша активтың конфиденциальлыҡ сәйәсәтен үҙгәртеү.

Активтар билдәләмәһе шулай уҡ [`AssetConfidentialPolicy`](/ba/reference/data-model-schema.md). Политика режимында ағымдарҙы контролдә тотоу хоҡуҡлы:

|Режим |Мәғәнәһе |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Ғәҙәттәгесә, дәүләт баланстары һәм күсереүҙәр генә ҡабул ителә. |
|`Convertible` |Ҡулланыусылар дөйөм баланстар һәм һаҡланған банкноталар араһында ҡиммәтте күсерергә мөмкин. |
|`ShieldedOnly` |Активтарҙың сығарылыуы һәм күсерелеүе һаҡланған иҫәптә булырға тейеш. |

## Уларҙы нисек ҡулланырға {#how-to-use-them}

1. Валидатор узелдарында конфиденциаль ярҙам ҡулайлаштырыу.Валидаторҙар раҫлаусы арҡыры, актив тикшереү төймәләре, Посейдон/Педерсен параметры IDs һәм конфиденциялы ҡағиҙәләр версияһы буйынса килешеү төҙөргә тейеш.
2. Публикация йәки теркәү верификация асҡыстары һәм схемалар ҡулланылған параметрҙар йыйылмалары. `VerifyingKeyId`, мәҫәлән: `halo2/ipa:vk_transfer`.
3. Активты теркәү ZK- менән һәләтле `RegisterZkAsset`, йәки сәйәсәт күсеү `TransparentOnly` өсөн `Convertible` йәки `ShieldedOnly`.
4. Йәмәғәт аҡсаларын `Shield` менән һаҡлағыҙ. Бухгалтерлыҡ кошелькаһы транзакцияны тапшырғанға тиклем ҡабул итеүсе өсөн банкнота йөкләмәһе һәм шифрланған файҙалы йөкләмәне булдыра.
5. `ZkTransfer` менән шәхси рәүештә күсереү. Бухгалтерлыҡ аҡса янсығы инеү кәгазьләренә эйә булыуын иҫбатлай, кертеү һәм сығарыу ҡиммәттәренең баланслы булыуын һәм тотонолған һәр кәгазьҙең яңы йөкләмә ағасҡа нығыныуын раҫлай.
6. `Unshield` асыҡ сумманы һәм алыусының иҫәбен аса, шәхси банкноталарҙы юҡҡа сығара, һәм шәхси үҙгәрештәр сығанаҡтарын булдыра ала.
7. Конфиденциаль ваҡиғаларҙы, иҫбатлау яҙмаларын, юҡҡа сығарыусының статусын һәм аноним ышаныслылыҡ тураһында мәғлүмәттәрҙе Torii һуңғы пункттары аша уҡып тикшереү.

## CLI Миҫалдар {#cli-examples}

ZK CLI командалары операторҙар һәм һынау ағымдары өсөн тәғәйенләнгән. етештереү портфелдәрендә йөкләмәләр, шифрланған файҙалы йөкләмәләр һәм иҫбатлауҙар булырға тейеш, улар килеп сыҡҡан күрһәтмәләрҙе тапшырыуҙан алда портфель/проверкалар китапханаһы менән.

ZK-ҡа һәләтле гибрид активты теркәгеҙ:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Һаҡланған иҫкәрмә өсөн версиялы шифрланған файҙалы йөк конвертын төҙөргә:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Дөйөм аҡсаны активтың һаҡланған иҫәп-хисап китабына индереү:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

JSON иҫбатлау ҡушымтаһы менән ҡапланмаған:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK Миҫал {#sdk-example}

Дөрөҫ иҫбатлау байттары конфигурацияланған иҫбатлау арттанан килә. Транзакция файҙалы йөкләмәһе бары тик йәмәғәт инеүҙәр һәм иҫбатлау ҡушымтаһы кәрәк:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## Аноним активтар иҫәбенә депозит {#anonymous-asset-escrow}

Аноним активтар иҫәбенә һаҡланған күсермә машинаһы ҡулланыла. Бәғзеләр һәм һаҡланған дәүләттәр әле дә һаҡланған иҫәптә теркәлгән, әммә финанслау, иреккә сығарыу, бөтөрөү һәм хәл итеү аяҡтары һаҡланған юҡҡа сығарыусыларҙы һәм сығанаҡ йөкләмәләрен ҡуллана.

ISI тәртибен һәм миҫалдарын ентекләп белер өсөн, ҡарағыҙ [Башҡорт активтары Escrow](/ba/blockchain/escrow.md#anonymous-escrow).

Тормош циклы:

1. `OpenAnonymousAssetEscrow` һаҡланған финанслау ҡағыҙҙарын сарыф итә һәм бер депозит йөкләмәһе булдыра.
2. `AcceptAnonymousAssetEscrow` һатып алыусыны яҙҙыра.
3. `MarkAnonymousEscrowPaymentSent` һатып алыусы түләүҙе селтәрҙән ситтә ебәргәнен яҙҙыра.
4. `ReleaseAnonymousAssetEscrow` депозит йөкләмәһен һатып алыусының продукцияһы йөкләмәләренә тотона.
5. `CancelAnonymousAssetEscrow` депозит йөкләмәһен түләү билдәләнмәгән осраҡта һатыусының сығыу йөкләмәләренә ҡайтарып түләй.
6. `OpenAnonymousEscrowDispute` һәм `ResolveAnonymousEscrowDispute` бәхәсле депозиттар менән дәлилдәр һәм хәл итеүсе менән идара ителгән бүленеш менән шөғөлләнәләр.

[Queries](/ba/reference/queries.md#escrow-and-proof-records) иҫәбендә күрһәтелгән аноним конфискация һорауҙарын ҡулланып, конфискацион яҙмаларҙы һәм статустарҙы тикшерергә.

## Математика {#math}

Түбәндәге билдәләү конфиденциаль активтар ағымын һүрәтләй. Ҡулланыусылар актив сәйәсәтенән һәм верификаторҙар реестрынан IDs актив схемаһын һәм параметрҙы ҡуллана, шуға күрә клиенттар йөкләмәләрҙе, юҡҡа сығарыусыларҙы һәм иҫбатлау байттарын аҡса янсығы/проверканың үтә күренмәле сығанаҡтары тип ҡарарға тейеш .

Яҡшы билдәләрҙе түбәндәгесә һүрәтләргә мөмкин:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

унда `owner` алыусының ҡарау йәки тотоноу материалдарынан алынған һәм `rho` иҫкәртеү осраҡлылығы.

Нотаның йөкләмәһе - йәшерен йөкләмә:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Хәҙерге конфиденциаль тапшырыу схемалары өсөн, йәмәғәт инеүҙәренә нота йөкләмәләре, юҡҡа сығарыусылар, Merkle тамырҙары, актив билдәһе һәм сылбыр билдәһе инә.

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Банкнот тотонолғас, аҡса янсығы юҡҡа сығарыу билдәһен ала:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` асыҡ. Ул банкнота асылмай, әммә ул был банкнота һәм сылбыр өсөн тотороҡло, шуға күрә Iroha шул уҡ юҡҡа сығарыусы менән икенсе сығымды кире ҡағырға мөмкин.

Әгәр ҙә аҡса янсығы `C_i` аҡса тотона икән, иҫбатлауҙа `C_i` шәхси Merkle юлынан һуңғы асыҡ тамырға тиклемге юл бар:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Шулай уҡ ҡиммәттең һаҡланыуын раҫлаусы дәлил:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Яҡшы яҡтыртылмаған өсөн, йәмәғәт суммаһы индерелгән:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

Ҡабул ителгән иҫбатлауҙы түбәндәгесә йомғаҡларға мөмкин:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

унда `public_inputs` - йөкләмәләр, юҡҡа сығарыусылар, тамыр, активтар билдәһе, сылбыр билдәһе һәм һәр асыҡ һаҡланмаған сумма. шаһитта банкнота күләме, осраҡлылыҡ, сығым материалдары һәм Merkle юлдар бар. Валидаторҙар иҫбатлауҙы раҫлай, һуңынан сығарыу йөкләмәләрен өҫтәп һәм инеүҙең юҡҡа сығарыусыларын тотонолған тип билдәләп, иҫәп-хисап ҡағиҙәләрен үҙгәртә.

## Нимә асыҡ? {#what-is-public}

Аноним операциялар һәр күҙәтелә торған фактты йәшереп ҡалмай.

- транзакция хеш, блок бейеклеге һәм заказ биреү
- ебәреүсе транзакция органы, әгәр ғариза шәхси инеү пункты йәки релейер моделен ҡулланмаһа,
- ҡулланылған активтар билдәләмәһе
- Һандуғас һәм сығыу йөкләмәләре
- иҫбатлау хэштегтары, тикшереү серле һылтанмалар һәм факультатив конверт хэштектары
- `Unshield` өсөн асыҡ сумма һәм түләүселәр иҫәбенә
- аноним конфиденциаль һатыусы, һатып алыусы, статусы, ваҡыт тамғалары һәм иҫбатлау һешы

Ҡулланыусыларҙы булдырығыҙ, шуға күрә был асыҡ метамәғлүмәт һеҙ һаҡларға теләгән бизнес мөнәсәбәттәрен аса алмай.

## Үзара бәйләнешле һылтанма {#related-reference}

- [`AssetConfidentialPolicy`](/ba/reference/data-model-schema.md)
- [`ConfidentialEvent`](/ba/reference/data-model-schema.md)
- [`ProofAttachment`](/ba/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/ba/reference/data-model-schema.md)
- [Эскиз һәм иҫбатлау һорауҙары](/ba/reference/queries.md#escrow-and-proof-records)
