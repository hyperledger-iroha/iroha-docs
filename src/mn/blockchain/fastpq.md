---
translation_locale: mn
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ нь сонгогдсон гүйцэтгэлийн үр нөлөөнд зориулсан Iroha-ийн STARK нотолгооны зам юм. Энэ нь хэвийн гүйлгээний гүйцэтгэл эсвэл зөвшилцлийг орлож чадахгүй. Гүйлгээ нь одоо ч ердийнх шиг ISI, IVM, ба Sumeragi-ыг гүйцэтгэ; FastPQ нь тодорхой гүйцэтгэлийн гэрчийг ашиглаж, дэмжигдсэн үр нөлөөг баталгааны багцад хувиргадаг.

Одоогийн хостын интеграц хоёр үндсэн замтай:

- тогтолцоо гүйцэтгэгдэх явцад бүртгэгдсэн ил тунгалаг тоон хөрөнгийн шилжүүлэг
- `fastpq_binding` нь FastPQ холболт агуулдаг SORA Nexus AXT нотолгооны бүрхүүлүүд

## Шалгагч дамжуулах зам {#transfer-witness-path}

Ил тод тоон шилжүүлэг нь заавар үлдэгдлийг өөрчлөхөд бүтэцтэй шилжүүлгийн бичлэг үүсгэнэ. Бичлэгт дараах мэдээлэл орно:

- эх данс, зорилтот данс, хөрөнгийн тодорхойлолт, мөнгөн дүн
- илгэгч ба хүлээн авагчийн үлдэгдэл шилжүүлэхээс өмнө ба дараа
- гүйлгээний орц цуулагдсан криптографийн хэшийг багцын криптографийн хэшээр ашигласан
- илгээж буй дансаар үүссэн эрх олгох үндсэн криптографийн хураангуй утга
- Нэг дельта бичлэгүүдэд зориулсан Poseidon криптографийн хураангуй утга

Багц шилжүүлгүүд нь олон дельтатай нэг транскриптийг ашигладаг. Энэ тохиолдолд ганц дельта Poseidon криптографийн дижест утга байхгүй болно.

Блокыг эцэслэхэд, Iroha эдгээр транскриптийг entrypoint криптографийн хэшээр бүлэглэдэг. Гүйцэтгэх гэрч нь анхны транскрипт багцууд болон нотлогчийн бэлдсэн FastPQ шилжилтийн багцуудыг авч явдаг.

Тус бүр шилжүүлэх дельта хоёр шилжилтийн мөр болж хувирдаг:

|Мөр|Түлхүүрний хэлбэр|Өмнөх утга|Шуудангийн үнэ|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Илгээгчийн дебит| `asset/<asset-definition>/<source-account>`      |илгээмжийн үлдэгдэл өмнө|илгээмжийн үлдэгдэл дараа|
|Хүлээн авагчийн зээл| `asset/<asset-definition>/<destination-account>` |хүлээн авагчийн үлдэгдэл өмнө|хуулга авах балансын дараа|

Тоо хэмжээ нь бүхэл тоон гэрч нэгжүүдэд хэвийн бологддог. Сонгосон арвантын масштабад эерэг бус `u64`-аар илэрхийлж чадахгүй бол FastPQ багцлахад утгыг татгалздаг.

## Олон нийтийн оруулга {#public-inputs}

Бүх FastPQ шилжилтийн багууд нь нотолгоог блок болон гүйцэтгэлийн орчинд холбодог олон нийтийн оролцоог агуулдаг:

|Оролт|Өгүүлэмж|
| ------------- | --------------------------------------------------------------- |
| `dsid` | Бага байт түрүүлсэн дарааллаар кодлосон өгөгдлийн орон зайн танигч |
| `slot`        |Блок үүсгэсэн цагийг наносекунд руу хөрвүүлсэн|
| `old_root`    |Гүйцэтгэлийн гэрчээс гаралтай эцэг төрлийн үндэс|
| `new_root`    |Гүйцэтгэлийн гэрчээс гаралтай улсын дараах үндэс|
| `perm_root`   |Poseidon криптографын амлалтын утга идэвхтэй үүргийн зөвшөөрөл дээр|
| `tx_set_hash` |эрэмбэлэгдсэн гүйлгээ ба цагийн үүдэлд орох криптографийн хэшүүд дээрх криптографийн хэш|

Хост эдгээр багцад анхны хувилбарын цорын ганц параметрийн багц болох `fastpq-state-transition-stark-v1`-ийг ашиглана.

## Нотолгооны протокол {#proof-protocol}

Каноник шилжүүлгийн артефактууд нь 4-р зэргийн өргөтгөлтэй Goldilocks талбар дээрх маскласан DEEP нотолгоо юм. Тэдгээрийн яг хамаарал, транскрипт болон асуулгын геометрийг тогтоосон хувилбарын [FastPQ DEEP протоколын гэрээ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md)-нд тодорхойлсон.

## Шалгагч юу шалгадаг вэ {#what-the-prover-checks}

Зам мөрийг байгуулахаас өмнө, FastPQ баталгаажуулагч нь багцыг шилжилтийн түлхүүр, үйлдлийн зэрэг, оруулсан дарааллаар стандарт хэлбэрт оруулдаг. Шилжүүлгийн мөрөнд мөн бичлэгийн мета өгөгдөл шаардлагатай. Шилжүүлгийн мөртэй боловч шилжүүлгийн бичлэггүй багц хүчин төгөлдөр бус байна.

Шилжүүлэх дэвтэрийн хувьд шалгаж үзэх зүйлс нь дараах байдалтай байна:

- илгээгчийн үлдэгдэл хэтрэлт үүсгэж болохгүй
- `sender_after` нь `sender_before - amount`-тай тэнцүү байх ёстой
- `receiver_after` нь `receiver_before + amount`-тай тэнцүү байх ёстой
- төлбөрийн багцын бүх шилжүүлгийн мөрийг бичлэгт оруулах ёстой
- нэгэн дельта Poseidon криптографийн хураангуй утга байх тохиолдолд бичвэрийн өмнөх дүрсийг таарч байх ёстой
- хангалттай sparse-Merkle баталгаануудыг хувилбар 1 гэж задалж унших ёстой; алга болсон замуудыг тодорхойлогдсон нийлэг баталгаагаар бөглөнө

Трэйс нь шилжүүлэх, гаргах, устгах, үүрэг олгох, үүрэг хасах, метадата тохируулах, эрх харах мөрүүдийн селектор багануудыг агуулдаг. Тоон үйлдлийн мөрүүд мөн гарын үсэгтэй ялгаа, эд хөрөнгийн тус бүрт хэрэгжих ялгаа, нийлүүлэлтийн тоолууруудыг агуулдаг.

## Шалгагчийн гүйцэтгэлийн эгнэ {#prover-lane}

`iroha3d` нь FastPQ баталгаажуулагчийн гүйцэтгэлтийн замыг эхлүүлэхдээ баталгаажуулагчийн арын хэсгийг эхлүүлж чадвал ажиллуулдаг. Гүйцэтгэлтийн зам нь хязгаарлагдмал дараалалтай арын даалгавар юм. Блок гүйцэтгэлийн гэрчийг гаргасны дараа, консенсусын эцсийн баталгаажуулалтын зам блокын криптографийн хэш, өндрөөр, харагдац, гэрч агуулсан нотлогчийн ажлыг илгээнэ.

Хэрвээ гүйцэтгэх эгнээ ажиллахгүй эсвэл дарааллын эгнээ дүүрсэн бол ажлыг алгасч, энгийн блок боловсруулалт үргэлжилнэ. Энэ нь арын програмчлагдсан баталгаажаагчийн гүйцэтгэх эгнээ нь гүйлгээ зөвшөөрөх эсвэл консенсусын хаалга биш гэсэн үг юм. Энэ нь аль хэдийн гүйцэтгэсэн төлөвийн дээр баталгаа үйлдвэрлэх зам юм.

Гүйцэтгэлийн зурвас нь дараах зүйлсээр батлагчийг бүтээдэг:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Хоёр тохиргоо аль аль нь `cpu`-д анхдагчаар тохируулагдсан. `gpu`-г сонгох нь ил тод, хаагдсан хүсэлт юм: хэрэв GPU дэмжлэгийг компайллаагүй эсвэл хүссэн GPU арын систем байхгүй бол урьдчилсан шалгалтад унадаг, нотлогчийн гүйцэтгэлийн суваг идэвхгүй хэвээр байна. Эхний хувилбарт `auto` утга байхгүй бөгөөд хүссэн GPU горимоос CPU руу буцаахгүй.

## Баталгаажуулалт {#verification}

FastPQ нотолгооны шалгалт нь протоколын стандарт багцын амлалтыг дахин бүтээж, нийтийн transcript-ийг давтан ажиллуулна. Баталгаажуулагч протоколын хувилбар, параметрийн багцын хувилбар, replay хязгаар, trace амлалт, нийтийн оролт, түүвэрлэсэн Merkle нээлт, AIR нээлт болон FRI query chain-ийг шалгана.

Өгөгдсөн хариулах хязгаарууд нь үүнд орно:

|Хязгаар|Анхдагч|
| ------------------ | ------: |
|Шилжилтийн мөрүүд|     256 |
|Багцын өгөгдлийн хэмжээ|256 KiB|
| FRI давхаргууд |      16 |
|Асуулгын нээлтүүд|     128 |

## SORA Nexus AXT нотолгооны бүрхүүлүүд {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT нотолгооны бүрхүүлүүд `AxtFastpqBinding` агуулж болно. AXT бүрхүүлийн блокийн шалгалт, IVM хостын AXT бүрхүүлийн шалгалтууд болон `RegisterVerifiedFeeSponsorVaultAllocation` нь бүрхүүлийн `fastpq_binding`-ийг шаардаж, түүнийг хүлээгдэж буй мэдэгдэлтэй тулган шалгаад, бүрхүүл болон түүнд шигтгэсэн нотолгоон дээр FastPQ шалгагчийг дуудна. Холболт байхгүй эсвэл шалгалт амжилтгүй бол үйлдлийг татгалзана.

### AXT Математик холболт {#axt-binding-math}

SORA Nexus AXT бүрхүүлийн хувьд нотолгоог дахин тоглуулахаас өмнө `AxtFastpqBinding`-ийг каноник хэлбэрт оруулна. Хоосон `parameter`, `verifier_id` эсвэл `verifier_version` утгуудыг татгалзана; шалгагчийн ID нь `fastpq`, хувилбар нь `v1` байх ёстой бөгөөд дэмжигдэж буй AXT урсгалууд `fastpq-state-transition-stark-v1`-ийг ашиглана. Мэдэгдлийн төрлийн захын хоосон зайг арилгаж, жижиг үсэгт шилжүүлнэ.

AXT FastPQ олон нийтийн оролтууд нь тодорхойлогдсон байт криптографийн хэшейүүд болно:

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

AXT шилжих түлхүүрүүд нь:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

Төрөлжүүлсэн `authorization` нэхэмжлэл үүрэг олгох мөр оруулна:

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

мөн эрх олгох бодлогыг холбосон метадатагийн мөр. `compliance` мэдэгдэл хоёр метадатагийн мөр оруулна: нэг нь бодлогын, нөгөө нь зорилтот өгөгдлийн орон зайнуудынх.

`tx_predicate` ба `value_conservation` хувьд, холболт нь эерэг эх сурвалж эсвэл очих хэмжээ агуулсан үед ил тод нөлөөний хэмжээг ашиглана. Үгүй бол код нь хязгаарлагдмал тодорхой хэмжээ гарган авдаг:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Дараа нь ижил шилжүүлэх тэгшитгэлүүдийг ашиглана:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетик илгээгч ба хүлээн авагчийн дансны дугаарууд нь түлхүүрийн үрээр үүсгэгддэг:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Шилжүүлгийн багийн криптографийн хэш нь:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT batch манифестын хураангуй нь каноник холболтын Norito кодлол дээрх SHA-256 байна:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Параметрийн багц {#parameter-sets}

Анхны хувилбарт яг нэг каноник параметрийн багц буюу `fastpq-state-transition-stark-v1` байдаг. Энэ нь 4-р зэргийн өргөтгөлтэй (`X^4 - 7`) Goldilocks талбар дээр 128 битийн аюулгүй байдлыг зорьж, мөрдлөгийн хэмжээ `2^16`, LDE-ийн хэмжээ `2^19`, FRI-ийн салаалалт 2, өргөсгөлийн коэффициент 8, хамгийн ихдээ 17 бууралт болон 136 асуулгыг ашиглана.

## Тохиргоо {#configuration}

FastPQ тохиргоо нь `zk.fastpq`-ийн доор ороод байна.

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

Ижил гүйцэтгэл ба телеметри шошгуудыг `iroha3d`-аас давхарлах боломжтой:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Төлөвлөлтийн талбаруудын хувьд орчны хувьсагчид бас дэмжигддэг. FastPQ-д тодорхой хувьсагчид нь дараахь зүйлсийг агуулна:

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

## Хэмжилтүүд {#metrics}

Телеметрийг идэвхжүүлсэн үед, FastPQ арын сонголт болон Metal програм хангамжийн гүйцэтгэл орчны зан байдалд зориулсан хэмжүүрүүдийг экспортолдог:

|Метрик|Өгүүлэмж|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Сэргээсэн ба шийдсэн гүйцэтгэлийн горимыг арын болон төхөөрөмжийн шошгоор|
| `fastpq_poseidon_pipeline_total`  |Хүсэлт гаргасан ба шийдсэн Poseidon програм хангамжийн боловсруулах ажлын урсгалын зам|
| `fastpq_metal_queue_depth`        |Метал хоолойн хязгаар, нисэж буй хамгийн их тоо, илгээх тоо, болон дээж авах цонх|
| `fastpq_metal_queue_ratio`        |Металлын дараалал ачаалалтай ба давхцлын харьцаа|
| `fastpq_zero_fill_duration_ms`    |Metal-ийн гүйцэтгэлд зориулсан Host тэглэх хугацаа|
| `fastpq_zero_fill_bandwidth_gbps` |Гаралтай тэгээр дүүргэсэн зурвасын өргөн|

Ерөнхий гүйцэтгэлийн анхан шатны үнэлгээнд зориулж, эдгээрийг [Гүйцэтгэл ба үзүүлэлтүүд](/mn/guide/advanced/metrics.md)-д жагсаасан санал нэгдэл болон дарааллын дохиотой хамт ашиглана уу.

## Холбогдох лавлагаа {#related-reference}

- [Өгөгдлийн загварын схем](/mn/reference/data-model-schema.md) зангилаа-эрх бүхий төрөл цэгийн цагийн өгөгдлийн үзэлт
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ сонголтууд](/mn/reference/iroha3d-cli.md#fastpq-overrides)
