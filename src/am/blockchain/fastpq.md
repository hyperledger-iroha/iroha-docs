---
translation_locale: am
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ ለተመረጡት የማስፈጸሚያ ውጤቶች የ Iroha STARK ማረጋገጫ መንገድ ነው። መደበኛውን የግብይት አፈፃፀም ወይም መግባባትን አይተካም። ግብይቶች አሁንም እንደተለመደው በ ISI፣ IVM እና Sumeragi ውስጥ መሮጥ; FastPQ ዲተርሚኒስቲክ የማስፈጸሚያ ምስክርን ይጠቀማል እና የሚደገፉ ውጤቶችን ወደ ማስረጃ ስብስቦች ይለውጠዋል።

የአሁኑ የአስተናጋጅ ውህደት ሁለት ዋና መንገዶች አሉት፦

- በብሎክ አፈፃፀም ወቅት የተመዘገቡ ግልጽ የቁጥር ንብረት ዝውውሮች
- `fastpq_binding` መስካቸው FastPQ ማሰሪያ የያዘ የSORA Nexus AXT ማስረጃ ኤንቨሎፖች

## የዝውውር ምስክር መንገድ {#transfer-witness-path}

መመሪያው ቀሪ ሒሳቦችን ሲቀይር፣ ግልጽ የቁጥር ዝውውሮች የተዋቀረ የዝውውር መዝገብ ይፈጥራሉ። መዝገቡ የሚከተሉትን ይመዘግባል፦

- የምንጭ መለያ፣ የመድረሻ መለያ፣ የንብረት ፍቺ እና መጠን
- ከዝውውሩ በፊት እና በኋላ የላኪ እና ተቀባይ ቀሪ ሂሳቦች
- የግብይት መግቢያ ነጥብ ምስጠራ ሃሽ እንደ ባች ክሪፕቶግራፊክ ሃሽ ጥቅም ላይ ይውላል
- UNE ፈቃድ ከማስረከቢያ መለያ የተገኘ ዋና ምስጠራ ዳይጀስት እሴት
- ለነጠላ-ዴልታ ግልባጮች የፖሲዶን ምስጠራ ዳይጄስት እሴት

የባች ዝውውሮች ከበርካታ ዴልታዎች ጋር አንድ ግልባጭ ይጠቀማሉ። እንደዚያ ከሆነ፣ ነጠላ-ዴልታ ፖሲዶን ክሪፕቶግራፊያዊ ዳይጀስት የለም።

በብሎክ ማጠናቀቂያ ላይ፣ Iroha እነዚህን ግልባጮች በመግቢያ ነጥብ ምስጠራ ሃሽ ይመድባል። የማስፈጸሚያ ምስክሩ ሁለቱንም የመጀመሪያውን የግልባጭ ጥቅሎች እና ለአረጋጋሪው የተዘጋጁትን FastPQ የሽግግር ስብስቦችን ይይዛል።

እያንዳንዱ የማስተላለፊያ ዴልታ ሁለት የሽግግር ረድፎች ይሆናል -

|ረድፍ|ቁልፍ ቅርጽ|ቅድመ-ዋጋ|ድህረ-እሴት|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|ላኪ ዴቢት|`asset/<asset-definition>/<source-account>`|የላኪ ቀሪ ሂሳብ በፊት|የላኪ ቀሪ ሂሳብ በኋላ|
|ተቀባይ ክሬዲት|`asset/<asset-definition>/<destination-account>`|ተቀባይ ቀሪ ሂሳብ በፊት|ተቀባይ ቀሪ ሂሳብ በኋላ|

የቁጥር እሴቶች ወደ ኢንቲጀር ምስክርነት አሃዶች መደበኛ ናቸው። በተመረጠው የአስርዮሽ ሚዛን እንደ አሉታዊ ያልሆነ `u64` ሊወከል የማይችል ከሆነ እሴት ለ FastPQ ባች ውድቅ ይደረጋል።

## የህዝብ ግብዓቶች {#public-inputs}

እያንዳንዱ FastPQ የሽግግር ስብስብ ማረጋገጫውን ከብሎኩ እና ከማስፈጸሚያ አውድ ጋር የሚያገናኙ የህዝብ ግብዓቶችን ይይዛል -

|ግቤት|ትርጉም|
| ------------- | --------------------------------------------------------------- |
| `dsid` | በlittle-endian ባይቶች የተቀየረ የውሂብ ቦታ መለያ |
|`slot`|የብሎክ የመፍጠሪያ ጊዜ ወደ ናኖሰከንዶች ተቀይሯል|
|`old_root`|የወላጅ ሁኔታ ሥር ከአፈጻጸም ምስክርነት የተገኘ|
|`new_root`|የድህረ-ሁኔታ ሥር የተገኘ ከአፈጻጸሙ ምስክርነት|
|`perm_root`|በንቃት ሚና ፈቃዶች ላይ የPoseidon ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ|
|`tx_set_hash`|በተደረደሩ ግብይቶች እና በጊዜ-ቀስቅሴ የመግቢያ ነጥብ ምስጠራ ሃሽ ላይ ምስጠራ ሃሽ|

አስተናጋጁ ለእነዚህ ስብስቦች ብቸኛውን የመጀመሪያ ልቀት የመለኪያ ስብስብ `fastpq-state-transition-stark-v1` ይጠቀማል።

## የማረጋገጫ ፕሮቶኮል {#proof-protocol}

ቀኖናዊ የዝውውር አርቲፋክቶች በGoldilocks መስክ ላይ ከደረጃ-4 ማራዘሚያ ጋር የተሸፈኑ DEEP ማረጋገጫዎች ናቸው። ትክክለኛ ዝምድናቸው፣ የግልባጭ መዝገባቸው እና የመጠይቅ ጂኦሜትሪያቸው በተሰካው [FastPQ DEEP የፕሮቶኮል ውል](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) ውስጥ ተገልጸዋል።

## ፕሮቨሩ ምን ያረጋግጣል {#what-the-prover-checks}

ዱካውን ከመገንባቱ በፊት፣ FastPQ አረጋግጣው የቡድን ቅደም ተከተሉን በሽግግር ቁልፍ፣ በኦፕሬሽን ደረጃ እና በማስገባት ቅደም ተከተል ቀኖናዊ ያደርገዋል። የዝውውር ረድፎች እንዲሁ የግልባጭ ሜታዳታ ያስፈልጋቸዋል። የማስተላለፊያ ረድፎች ያሉት ነገር ግን ምንም የዝውውር ግልባጮች የሉም ባች ልክ ያልሆነ ነው።

ለዝውውር ግልባጮች፣ የፕሮቨር-ጎን ቼኮች የሚከተሉትን ያካትታሉ

- የላኪው ቀሪ ሂሳብ መፍሰስ የለበትም
- `sender_after` እኩል መሆን አለበት `sender_before - amount`
- `receiver_after` እኩል መሆን አለበት `receiver_before + amount`
- ግልባጩ በቡድኑ ውስጥ ያለውን እያንዳንዱን የማስተላለፊያ ረድፍ መሸፈን አለበት
- ነጠላ-ዴልታ ፖሲዶን ክሪፕቶግራፊያዊ ዳይጀስት፣ በሚኖርበት ጊዜ፣ ከትራንስክሪፕት ቅድመ ዝግጅት ጋር መዛመድ አለበት።
- የቀረበ አልሙ-ሜርክል ማረጋገጫዎች እንደ ስሪት 1 መፍታት አለባቸው; የጎደሉ መንገዶች በዲተርሚኒስቲክ ሰው ሠራሽ ማረጋገጫዎች ተሞልተዋል

ዱካው ለማስተላለፍ፣ ለማውጣት፣ ለማጥፋት፣ ለሚና ስጦታ፣ ሚና መሻር፣ ሜታዳታ ስብስብ እና የፍቃድ ፍለጋ ረድፎችን የመራጭ አምዶችን ይዟል። የቁጥር ኦፕሬሽን ረድፎች የተፈረሙ ዴልታዎችን፣ በንብረት ዴልታዎችን እና የአቅርቦት ቆጣሪዎችን ይይዛሉ።

## የማስፈጸሚያ መስመር {#prover-lane}

`iroha3d` የፕሮቨር ጀርባው መጀመር ከቻለ FastPQ የፕሮቨር ማስፈጸሚያ መስመርን ሲጀምር ይጀምራል።. የማስፈጸሚያ መስመሩ የታሰረ ወረፋ ያለው የጀርባ ተግባር ነው።. አንድ ብሎክ የማስፈጸሚያ ምስክርነት ካወጣ በኋላ፣ የጋራ መግባባት የማጠናቀቂያ መንገድ የብሎክ ምስጠራ ሃሽ፣ ቁመት፣ እይታ እና ምስክርነት የያዘ የማረጋገጫ ስራ ያቀርባል።

የማስፈጸሚያ መስመሩ የማይሰራ ከሆነ ወይም ወረፋው ከሞላ, ስራው ተዘልሏል እና መደበኛ የብሎክ ሂደት ይቀጥላል. ይህ ማለት የጀርባ ማረጋገጫ ማስፈጸሚያ መስመር የግብይት መግቢያ ወይም የጋራ መግባባት በር አይደለም። አስቀድሞ የተፈፀመ በስቴት ላይ የማረጋገጫ ምርት መንገድ ነው።

የማስፈጸሚያ መስመሩ ከሚከተሉት ጋር ማረጋገጫ ይገነባል -

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

ሁለቱም ቅንብሮች በነባሪነት ወደ `cpu` ናቸው። `gpu`ን መምረጥ ግልጽ፣ ያልተሳካ የተዘጋ ጥያቄ ነው የ GPU ድጋፍ ካልተጠናቀረ ወይም የተጠየቀ GPU ጀርባ ቅድመ በረራ አልተሳካም፣ የፕሮቨር ማስፈጸሚያ መስመር ተሰናክሏል። የመጀመሪያው ልቀት ምንም `auto` እሴት የለውም እና ከተጠየቀው GPU ሁነታ ወደ CPU አይወድቅም።

## ማረጋገጫ {#verification}

FastPQ የማረጋገጫ ማረጋገጫ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ ባች ክሪፕቶግራፊያዊ ኮሚትመንትን እንደገና ይገነባል እና የህዝብ ግልባጩን ይደግማል። አረጋጋጩ ፕሮቶኮሉን ይፈትሻል ስሪት፣ በመለኪያ የተቀመጠ ስሪት፣ የድጋሚ አጫውት ገደቦች፣ የምስጢር ኮሚትመንትን ይከታተሉ፣ የህዝብ ግብዓቶች፣ ናሙና የመርክሌ ክፍተቶች፣ AIR ክፍት ቦታዎች እና FRI የመጠይቅ ሰንሰለት።

ነባሪ የመልሶ ማጫወት ገደቦች የሚከተሉትን ያካትታሉ

|ገደብ|ነባር|
| ------------------ | ------: |
|የ መሸጋገሪያ ረድፎች|     256 |
|የባች ጭነት መጠን|256 KiB|
|FRI ንብርብሮች|      16 |
|የመጠይቅ ክፍት ቦታዎች|     128 |

## SORA Nexus AXT ማስረጃ ኤንቨሎፖች {#sora-nexus-axt-proof-envelopes}

የSORA Nexus AXT ማስረጃ ኤንቨሎፖች `AxtFastpqBinding` ሊያካትቱ ይችላሉ። የAXT ኤንቨሎፖች የብሎክ ማረጋገጫ፣ የIVM አስተናጋጁ የAXT ኤንቨሎፕ ፍተሻዎች እና `RegisterVerifiedFeeSponsorVaultAllocation` የኤንቨሎፑን `fastpq_binding` ይፈልጋሉ፣ ከሚጠበቀው የይገባኛል ጥያቄ ጋር ያነጻጽሩታል፣ እንዲሁም የFastPQ አረጋጋጩን በኤንቨሎፑ እና በውስጡ በተካተተው ማስረጃ ላይ ይጠራሉ። የጎደለ ማሰሪያ ወይም ያልተሳካ ማረጋገጫ ክዋኔውን ውድቅ ያደርጋል።

### AXT ሂሳብ አስገዳጅ {#axt-binding-math}

ለSORA Nexus AXT ኤንቨሎፖች ማስረጃው እንደገና ከመፈጸሙ በፊት `AxtFastpqBinding` ቀኖናዊ ቅርጽ ይሰጠዋል። ባዶ `parameter`፣ `verifier_id` ወይም `verifier_version` እሴቶች ውድቅ ይደረጋሉ፤ የአረጋጋጩ መታወቂያ `fastpq`፣ ስሪቱም `v1` መሆን አለባቸው፣ በጥገና ላይ ያሉ የAXT ሂደቶችም `fastpq-state-transition-stark-v1` ይጠቀማሉ። የይገባኛል ጥያቄው አይነት ዙሪያ ያለ ክፍተት ተወግዶ ወደ ትንንሽ ፊደሎች ይቀየራል።

የ AXT FastPQ የህዝብ ግብዓቶች ዲተርሚኒስቲክ ባይት ምስጠራ ሃሽዎች ናቸው -

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

AXT የሽግግር ቁልፎች የሚከተሉት ናቸው

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

የ`authorization` የይገባኛል ጥያቄ የሚና-ስጦታ ረድፍ ያስገባል -

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

እና የፈቃድ ፖሊሲውን የሚያስር የሜታዳታ ረድፍ። የ`compliance` ጥያቄ ሁለት የሜታዳታ ረድፎችን ይጨምራል፤ አንዱ ለፖሊሲ፣ ሌላው ለታለሙ የውሂብ ቦታዎች።

ለ `tx_predicate` እና `value_conservation` ግልጽ የሆነ የውጤት መጠን ጥቅም ላይ ይውላል ማሰሪያው አዎንታዊ ምንጭ ወይንም የመድረሻ መጠን ሲይዝ አለበለዚያ ኮዱ የወሰነ የተወሰነ መጠን ያመጣል

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

ከዚያ ተመሳሳይ የማስተላለፊያ እኩልታዎች ጥቅም ላይ ይውላሉ-

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

ሰው ሰራሽ ላኪ እና ተቀባይ መለያ መታወቂያዎች የሚመነጩት ከቁልፍ ዘሮች ነው -

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

የዝውውር ባች ምስጠራ ሃሽ -

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

የ AXT ባች ቴክኒካል አንጸባራቂ ምስጠራ ዳይጀስት እሴት SHA-256 በነጠላ ፕሮቶኮል-ስታንዳርድ ማሰሪያ Norito ኢንኮዲንግ ላይ ነው።

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## የመለኪያ ስብስቦች {#parameter-sets}

የመጀመሪያው ልቀት በትክክል አንድ ቀኖናዊ የመለኪያ ስብስብ አለው፤ እሱም `fastpq-state-transition-stark-v1` ነው። ከደረጃ-4 ማራዘሚያ (`X^4 - 7`) ጋር በGoldilocks መስክ ላይ የ128-ቢት ደህንነትን ያለመ ሲሆን፣ የዱካ መጠን `2^16`፣ የLDE መጠን `2^19`፣ የFRI ቅርንጫፍ ብዛት 2፣ የማስፋፊያ መጠን 8፣ ቢበዛ 17 ቅነሳዎች እና 136 መጠይቆች ይጠቀማል።

## ውቅር {#configuration}

FastPQ ውቅር በ `zk.fastpq` ስር ተቀምጧል.

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

ተመሳሳይ የማስፈጸሚያ እና የቴሌሜትሪ መለያዎች ከ `iroha3d` ሊሻሩ ይችላሉ -

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

የአካባቢ ተለዋዋጮች ለማዋቀሪያ መስኮችም ይደገፋሉ። የ FastPQ-ተኮር ተለዋዋጮች የሚከተሉትን ያካትታሉ

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

## መለኪያዎች {#metrics}

ቴሌሜትሪ ሲነቃ FastPQ ለጀርባ ምርጫ እና ለብረታ ብረት ሶፍትዌር ማስፈጸሚያ አካባቢ ባህሪ መለኪያዎችን ወደ ውጭ ይልካል -

|ሜትሪክ|ትርጉም|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|የተጠየቀ እና የተፈታ የማስፈጸሚያ ሁነታ በጀርባ እና በመሣሪያ መለያዎች|
|`fastpq_poseidon_pipeline_total`|የተጠየቀ እና የተፈታ የፖሲዶን ሶፍትዌር ማቀነባበሪያ የስራ ፍሰት መንገድ|
|`fastpq_metal_queue_depth`|የብረት ወረፋ ገደብ፣ ከፍተኛው የበረራ ብዛት፣ የመላኪያ ብዛት እና የናሙና መስኮት|
|`fastpq_metal_queue_ratio`|የብረት ወረፋ ስራ በዝቶበታል እና ተደራራቢ ሬሾዎች|
|`fastpq_zero_fill_duration_ms`|ለብረታ ብረት ሩጫዎች ዜሮ-ሙሌት ቆይታ ያስተናግዱ|
|`fastpq_zero_fill_bandwidth_gbps`|የተገኘ ዜሮ-ሙላ የመተላለፊያ ይዘት|

ለአጠቃላይ የአፈጻጸም መለየት፣ እነዚህን በ[አፈጻጸም እና መለኪያዎች](/am/guide/advanced/metrics.md) ውስጥ ከተዘረዘሩት የጋራ መግባባት እና ወረፋ ምልክቶች ጋር ይጠቀሙ።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [የውሂብ ሞዴል ንድፍ](/am/reference/data-model-schema.md) የጊዜ ገደብ
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ አማራጮች](/am/reference/iroha3d-cli.md#fastpq-overrides)
