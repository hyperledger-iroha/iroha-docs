---
translation_locale: hy
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ-ը Iroha-ի կողմից ընտրված կատարման ազդեցությունների համար STARK ապացուցող ուղին է: Այն չի փոխարինում գործարքի սովորական կատարումը կամ համաձայնությունը: Գործարքները դեռ շարունակվում են ISI, IVM, եւ Sumeragi-ով, ինչպես միշտ; FastPQ սպառում է դետերմինիստական կատարման վկան եւ վերածում աջակցվող ազդեցությունները ապացույցների խմբերի:

Հոսթի ներկայիս ինտեգրումն ունի երկու հիմնական ուղի.

- բլոկի կատարման ընթացքում գրանցված թվային ակտիվների թափանցիկ փոխանցումները
- SORA Nexus AXT ապացույցի ծրարներ, որոնց `fastpq_binding`-ը կրում է FastPQ կապ

## Վկաների երթուղին փոխանցելը {#transfer-witness-path}

Թվային փոխանցումները ստեղծում են կառուցվածքային փոխանցման տրանսկրիպտ, երբ հրահանգը փոխակերպում է մնացորդները:

- աղբյուրի հաշվին, նպատակային հաշվին, ակտիվների սահմանմանը եւ գումարը
- ուղարկողի եւ ստացողի մնացորդը փոխանցումից առաջ եւ հետո
- գործարքի մուտքային կետի հեշը, որն օգտագործվում է որպես խմբաքանակի հեշ
- ներկայացնող հաշվետվությունից ստացված լիազոր հաշվի ցուցակը
- Պոզեյդոնի դիժեսը մեկ դելտային տրանսկրիպտի համար

Բաժանային փոխանցումներում օգտագործվում է մի քանի դելտա պարունակող տեքստ, այդ դեպքում բացակայում է մեկ դելտայի Պոզեյդոնի թեստը:

Բլոկի վերջնականացման ժամանակ Iroha խմբավորում է այս տրանսկրիպտերը մուտքային կետի հեշի համաձայն: Գործադրման վկանը ապա տեղափոխում է ինչպես սկզբնական տրանսկրիտների փաթեթները, այնպես էլ FastPQ անցումային խմբաքանակները, որոնք պատրաստված են պրոֆերի համար:

Յուրաքանչյուր տրանսֆերային դելտա դառնում է երկու անցումային շարքեր.

|Սարք |Գլխավոր ձեւ |Նախագծային արժեք|Հետագա արժեք |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Հեռորդի դեբետ |`asset/<asset-definition>/<source-account>` |նախորդ ուղարկողի մնացորդը |ուղարկողի մնացորդը |
|Ստացողի կրեդիտը|`asset/<asset-definition>/<destination-account>` |ստացողի հաշվեկշիռը՝ առաջ |ստացողի հաշվեկշիռը՝ հետո |

Թվային արժեքները նորմալացվում են ամբողջական թվերի վկայական միավորներով: FastPQ խմբավորման համար մի արժեք մերժվում է, եթե այն չի կարող ներկայացվել որպես ոչ բացասական `u64` ընտրված տասնամյակային մասշտաբում:

## Հանրային ներդրումներ {#public-inputs}

Յուրաքանչյուր FastPQ անցումային խմբաքանակ ունի հանրային մուտքագրություններ, որոնք ապացույցը կապում են բլոկի եւ կատարման համատեքստին.

|Ներմուծում |Նշում |
| ------------- | --------------------------------------------------------------- |
| `dsid` | Փոքր բայթը սկզբում հերթականությամբ կոդավորված տվյալների տարածքի նույնացուցիչ |
|`slot` |Բլոկի ստեղծման ժամանակը վերածվել է նանոսեկունդ: |
|`old_root` |Կատարման վկայից ստացված սկզբնական վիճակի արմատ |
|`new_root` |Կատարումից հետո վիճակի արմատը՝ ստացված կատարման վկայից |
|`perm_root` |Պոզեյդոնի պարտավորությունը ակտիվ դերային թույլտվությունների նկատմամբ |
|`tx_set_hash` |Հաշիվը վերապատրաստված գործարքի եւ ժամանակային դրդող մուտքային կետի հաշիվները |

Հոսթն այս խմբաքանակների համար օգտագործում է առաջին թողարկման միակ պարամետրերի հավաքածուն՝ `fastpq-state-transition-stark-v1`։

## Ապացույցի արձանագրություն {#proof-protocol}

Կանոնական փոխանցման արտեֆակտները քողարկված DEEP ապացույցներ են Goldilocks դաշտի վրա՝ 4-րդ աստիճանի ընդլայնմամբ։ Դրանց ճշգրիտ առնչությունը, տրանսկրիպտը և հարցումների երկրաչափությունը սահմանված են ամրագրված [FastPQ DEEP արձանագրության պայմանագրում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)։

## Այն, ինչ ստուգում է առակ {#what-the-prover-checks}

Նախքան հետագա կառուցումը, FastPQ պրովերը կանոնիկացնում է խմբաքանակի կարգը անցումային բանալինով, գործողության դասակարգմամբ եւ տեղադրման կարգով: Տրանսֆերային տողերը նույնպես պահանջում են վերագրված մետադատա: Տարածված խմբաքանակը, որն ունի փոխանցման տողեր, բայց ոչ մի փոխանցման վերագրություն անվավեր է:

Տրանսֆերային արձանագրությունների համար ստուգումները ներառում են՝

- ուղարկողի մնացորդը չպետք է նվազի
- `sender_after` պետք է հավասար լինի `sender_before - amount`
- `receiver_after` պետք է հավասար լինի `receiver_before + amount`
- վերագրը պետք է ընդգրկի խմբաքանակում գտնվող յուրաքանչյուր փոխանցման տող
- Պոզեյդոնի մեկ դելտա պարունակող դիժեսը, երբ ներկա է, պետք է համապատասխանի տրանսկրիպտի նախանկարի պատկերին
- տրամադրված sparse-Merkle ապացույցները պետք է վերծանվեն որպես 1-ին տարբերակ. բացակայող ուղիները լրացվում են դետերմինիստական սինթետիկ ապացույցներով

Հետեւանքը պարունակում է ընտրող սյունակներ փոխանցման, մինետի, այրման, դերի տրամադրման, դերակատարության հետաձգման, մետադատա հավաքածու եւ թույլտվությունների որոնման շարքերի համար: Թվային գործառույթների շարքերը նաեւ կրում են ստորագրված դելտաներ, գործում են յուրաքանչյուր ակտիվի դելթաններ եւ մատակարարման հաշվիչներ:

## Պրոբեր Լեյն {#prover-lane}

`iroha3d` սկսում է FastPQ պրովեր լեյնը մեկնարկելիս, եթե պրովերի հետագա վերջը կարող է նախաձեռնվել: Լեյնը ֆոնային գործ է սահմանված հերթով: Երբ բլոկը արտադրում է կատարման վկան, commit ուղին ներկայացնում է պրովոր աշխատանք, որը պարունակում է բլոկի շաշը, բարձրությունը, տեսքը եւ վկանը:

Եթե lane-ը չի աշխատում կամ հերթը լիքն է, աշխատանքը բաց է թողնվում, իսկ բլոկի սովորական մշակումը շարունակվում է։ Այսինքն՝ ֆոնային prover lane-ը գործարքների ընդունման կամ consensus-ի դարպաս չէ։ Այն արդեն կատարված վիճակի համար ապացույց արտադրող ուղի է։

Դարպասը կառուցում է պրովեր, որն ունի

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Երկու կարգավորումները նախանշվում են `cpu`։ Ընտրելով `gpu`-ը բացասական, անջատված խնդրանք է. եթե GPU-ի աջակցությունը չի կազմվել կամ պահանջված GPU backend- ը ձախողվում է թռիչքից առաջ, prover lane- ն անջատված է մնում: Առաջին թողարկումը չունի `auto` արժեք եւ չի ընկնում պահանջվող GPU ռեժիմից դեպի CPU

## Փորձարկում {#verification}

FastPQ ապացույցի ստուգումը վերակառուցում է քանոնիկ խմբաքանակի պարտավորությունը եւ փոխարինում է հանրային տրանսկրիպտը: Վավերացնողը ստուգում է արձանագրության տարբերակը, պարամետրերի սահմանված տարբերակը, կրկնօրինակման սահմանափակումները, հետեւողական պարտավորությունները, հանրային մուտքերը, նմուշավորված Merkle բացումները, AIR բացումները եւ FRI հարցման շղթան:

Նախադրյալ կրկնօրինակման սահմանները ներառում են.

|Սահմանափակ |Նախադրյալ |
| ------------------ | ------: |
|անցումային շարքեր |     256 |
|Բարշային բեռի չափը |256 KiB |
|FRI շերտեր |      16 |
|Հարցումներ |     128 |

## SORA Nexus AXT ապացույցի ծրարներ {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT ապացույցի ծրարները կարող են ներառել `AxtFastpqBinding`։ AXT ծրարների բլոկային վավերացումը, IVM հոսթի AXT ծրարի ստուգումները և `RegisterVerifiedFeeSponsorVaultAllocation`-ը պահանջում են ծրարի `fastpq_binding`-ը, այն ստուգում են ակնկալվող պնդման համեմատ և կանչում են FastPQ ստուգիչը ծրարի և դրանում ներդրված ապացույցի վրա։ Կապի բացակայությունը կամ ձախողված ստուգումը մերժում է գործողությունը։

### AXT Մաթեմատիկա {#axt-binding-math}

SORA Nexus AXT ծրարներում `AxtFastpqBinding`-ը բերվում է կանոնական ձևի մինչև ապացույցի կրկնակի ստուգումը։ Դատարկ `parameter`, `verifier_id` կամ `verifier_version` արժեքները մերժվում են. ստուգիչի ID-ն պետք է լինի `fastpq`, իսկ տարբերակը՝ `v1`, և սպասարկվող AXT հոսքերն օգտագործում են `fastpq-state-transition-stark-v1`։ Պնդման տեսակի եզրային բացատները հեռացվում են, իսկ տառերը՝ փոքրատառացվում։

AXT FastPQ հանրային մուտքերը դետերմինիստիկ բայթային շիշներ են.

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT անցումային բանալիները'

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` պահանջի մեջ տեղադրվում է դերակատարման համար նախատեսված տող.

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

և լիազորման քաղաքականությունը կապող մետատվյալների տող։ `compliance` պնդումն ավելացնում է երկու մետատվյալների տող՝ մեկը քաղաքականության, մյուսը՝ թիրախ տվյալների տարածքների համար։

`tx_predicate` եւ `value_conservation` համար օգտագործվում է բացարձակ ազդեցության ծավալ, երբ կապը պարունակում է դրական աղբյուրի կամ նպատակային ծավալ: Այլ դեպքում կոդը բխում է սահմանված որոշման քանակից.

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Այնուհետեւ օգտագործվում են նույն փոխանցման հավասարումները.

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Սինթետիկ ուղարկողի եւ ստացողի հաշիվի ID-ները ստեղծվում են առանցքային սերմերից.

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Տրանսֆերային խմբաքանակի շիշը հետեւյալն է.

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT խմբաքանակի manifest digest-ը կազմում է SHA-256՝ քանոնիկ կապի Norito կոդավորման վրա.

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## պարամետրերի հավաքածուներ {#parameter-sets}

Առաջին թողարկումն ունի ճիշտ մեկ կանոնական պարամետրերի հավաքածու՝ `fastpq-state-transition-stark-v1`։ Այն նախատեսված է 128-բիթանոց անվտանգության համար Goldilocks դաշտի վրա՝ 4-րդ աստիճանի ընդլայնմամբ (`X^4 - 7`), և օգտագործում է `2^16` հետքի չափ, `2^19` LDE չափ, FRI-ի 2 արիտետ, 8 ընդլայնման գործակից, առավելագույնը 17 կրճատում և 136 հարցում։

## Կազմակերպություն {#configuration}

FastPQ կարգավորումը տեղադրված է `zk.fastpq` ներքեւում:

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

Նույն կատարման եւ հեռաչափության տեքստերը կարող են վերածվել `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Շրջակա միջավայրի փոփոխականները աջակցվում են նաեւ կոնֆիգուրացիոն դաշտերի համար: FastPQ- ի հատուկ փոփոխականները ներառում են՝

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Մետրիկներ {#metrics}

Երբ հեռաչափությունը միացված է, FastPQ-ն արտահանում է չափումներ, որոնք ցույց են տալիս հաշվարկային մեխանիզմի ընտրությունը և Metal-ի կատարման միջավայրի աշխատանքը։

|Մետրիկ |Նշում |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Պահանջված եւ լուծված կատարման ռեժիմը ՝ ըստ backend- ի եւ սարքի տեքստերի |
|`fastpq_poseidon_pipeline_total` |Պահանջված եւ լուծված Պոզեյդոնի գազատարի ուղին |
|`fastpq_metal_queue_depth` |Մետաղական հերթի սահմանը, թռիչքի ընթացքում առավելագույն թիվը, առաքման թիվը եւ նմուշների հավաքման պատուհանը |
|`fastpq_metal_queue_ratio` |Մետաղական հերթը զբաղված է եւ փոխկապակցում հարաբերությունները |
|`fastpq_zero_fill_duration_ms` |Հյուրընկալող զրոյական լցման տեւողությունը մետաղի համար: |
|`fastpq_zero_fill_bandwidth_gbps` |Պահանջված զրոյական լրիվության թողունակություն |

Գլխավոր կատարողականի դասակարգման համար օգտագործեք դրանք [ կատարողականի եւ չափանիշների](/hy/guide/advanced/metrics.md) ցուցակում նշված կոնսենսուսի եւ հերթի ազդանշաններով:

## Կապակցված հղում {#related-reference}

- [Տվյալների մոդելային սխեման](/hy/reference/data-model-schema.md) բջիջային հավատարիմության տիպի արձանագրության համար
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ տարբերակներ](/hy/reference/iroha3d-cli.md#fastpq-overrides)
