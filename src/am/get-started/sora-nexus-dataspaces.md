---
translation_locale: am
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# አቋራጭ ሁን SORA 3: Taira እና Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 በመተግበሪያው ላይ የተገነባ የህዝብ ማሰማራት ትራክ ነው Iroha 3 እና SORA
Nexus. ላይ መገንባት እና ለመለማመድ Taira በመጀመሪያ, ከዚያም ተመሳሳይ ደንበኛ ቅርጽ ይንቀሳቀሱ
ወደ Minamoto አንተ ብቻ የተለየ የማይንኔት ቁልፎች ሲኖሩ, እውነተኛ XOR ለክፍያ፣
እና የምርት ማረጋገጫ.

ይህ አጋዥ መመሪያ አንድን Iroha ለሕዝብ ደንበኛ SORA 3
አውታረ መረቦች

- Taira የሙከራ ኔት `https://taira.sora.org`
- Minamoto በ `https://minamoto.sora.org`

አጠቃቀም Taira ለኢንቴግሬሽን ሙከራዎች፣ በፋይሌት የሚደገፉ የጽሑፍ ካናሪዎችን እና
የመልቀቂያ ልምምድ። Minamoto ለምርቱ ዝግጁ የሆነ ማይንኔት ብቻ
ሁለቱም አውታረመረቦች በ XOR:

- Taira የሙከራ አውታረመረብ ይጠቀማል XOR ከሕዝብ ቧንቧ።
- Minamoto እውነተኛ ይጠቀማል XOR. የለም Minamoto ቧንቧ።

## የግንባታ መንገድ {#builder-path}

| ደረጃ                        | Taira የሙከራ አውታር                                                | Minamoto ዋናው                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| የአውታረ መረብ ሁኔታን ማንበብ ይጀምሩ | ጥያቄ `/status` ቁልፎች የላቸውም                                 | ጥያቄ `/status` ቁልፎች የላቸውም                       |
| የመረጃ ቦታ ይምረጡ            | የህዝብ አጠቃቀም `universal` መተግበሪያዎ የሚመራበት መንገድ ካልሆነ በስተቀር | ተመሳሳይ የመረጃ ቦታን መጠቀም የሚቻለው ከዋና አውታረመረብ ማጽደቅ በኋላ ብቻ ነው። |
| የክፍያ አክሲዮን ያግኙ               | የሕዝብን አጠቃቀም Taira የቧንቧ                                  | ተቀበል XOR ከገንዘብ የተደገፈ Minamoto የሂሳብ ወይም የተረጋገጠ የግምጃ ቤት ፍሰት |
| ሙከራ ይጽፋል                 | በፋይፕ የተደገፈ ሙከራን ይጠቀሙ XOR                                   | የሙከራ መሳሪያ አይጠቀሙ; ይጽፋል እውነተኛ ወጪ XOR     |
| ማስተዋወቅ                     | ዳግመኛ አመክንዮ, ክትትል እና ፊርማ አያያዝ ይሞክሩ            | የተለያዩ ቁልፎችን፣ የገንዘብ ድጋፍና የመልቀቂያ መቆጣጠሪያዎችን መጠቀም   |

ተግባራዊ ፍሰት:

1. ደንበኛው ላይ መገንባት Taira እና የህዝብን ጥቅም `universal` የመረጃ ቦታ።
2. አንድ ፊርማ ያክሉ እና በ Taira ቧንቧ።
3. በመተግበሪያዎ ላይ ያለውን አመክንዮ Taira ውድቀቶች አሰልቺ እና
   የሚታይ ነው።
4. የተለየ ይፍጠሩ Minamoto ፊርማው፣ በእውነተኛ ገንዘብ ይደገፍ XOR, እና መንቀሳቀስ ብቻ
   ተመሳሳይ የተረጋገጡ ሥራዎች ወደ ማይንኔት.

## 1. የምታስቀመጡትን ነገር መረዳት {#_1-understand-what-you-are-setting-up}

ውስጥ SORA Nexus, የውሂብ ቦታ የኔትወርክ ጎዳና እና የመመሪያ ካታሎግ አካል ነው።
አንድ ደንበኛ አዲስ የህዝብ የመረጃ ቦታን በመቀየር ብቻ አይፈጥርም
`client.toml`. የደንበኞችን ማዋቀር ሁለት ነገሮችን ያደርጋል:

1. ደንበኛው ወደ ቀኝ ያመለክታል Torii የመጨረሻ ነጥብ
2. ለካኖኒካል መለያው የጎራ እና የመረጃ ቦታን የማዞሪያ አውድ ይመርጣል

`AccountId` ሁሌም የካኖኒክ እና ጎራ የሌለው ነው. `[account].domain` ውስጥ ዋጋ
`client.toml` የጉዞ እና የአጠራር አውድ ያቀርባል; ይህ አካል አይሆንም
ለአብዛኞቹ ማመልከቻዎች ከህዝብ ጋር ይጀምሩ
`universal` የውሂብ ቦታ። የጎራ አውድ አጠቃቀሞች `domain.dataspace` ቅጽ
ምሳሌ፦

```text
wonderland.universal
```

አዲስ የድርጅት የመረጃ ቦታ ከፈለጉ ካታሎግ እና መስመሩን ያዘጋጁ
ከትክክለኛ የደንበኛ ሂሳብ ለመመዝገብ ከመሞከር ይልቅ ሀሳብ።
ተመልከት [አዲስ የውሂብ ቦታ ማቅረብ](#_8-provision-a-new-dataspace) ከዚህ በታች.

## 2. የሕዝብ ማኅበራዊ ድረ ገጽን ይመልከቱ Torii የመጨረሻ ነጥብ {#_2-check-the-public-torii-endpoint}

ፊርማውን ከማዋቀርዎ በፊት የዒላማው መጨረሻ ነጥብ ቀጥተኛ መሆኑን ያረጋግጡ።

ለ Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

ለ Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

በቆንጆው የተጋለጠውን የውሂብ ቦታ እና የመንገድ እይታ ይፈትሹ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ተመሳሳይ ትእዛዝ ይጠቀሙ `https://minamoto.sora.org/status` ለሜይኔት።

## Taira MCP ለወኪሎች {#taira-mcp-for-agents}

Taira በተጨማሪም አንድ Torii-የአገር ውስጥ ሞዴል አውድ ፕሮቶኮል (MCP) ድልድይ
አንድ ወኪል የቀጥታ የሙከራ አውታረ መረብ ማንበብ ሲያስፈልግበት ይጠቀሙት, ስክሪፕት
ለይቶ ማወቅ ወይም በጥብቅ የተከለከሉ የጽሑፍ ልምዶች ያለ ልማድ
Torii በመጀመሪያ ደንበኛ።

| ማዘጋጀት | ዋጋ |
| --- | --- |
| MCP የመጨረሻ ነጥብ | `https://taira.sora.org/v1/mcp` |
| የአውታረ መረብ ሥር | `https://taira.sora.org` |
| የታሰበበት አጠቃቀም | Taira የሙከራ ኔት አንብቦች እና በፋይኔት የተደገፉ የጽሑፍ ልምምዶች |
| የምርት እኩልነት | ይህንን ጽሑፍ ወደ Minamoto ከዋና መረብ በስተቀር MCP የፍፃሜ ነጥብ እና የመልቀቂያ ቁጥጥር በግልጽ የተረጋገጠ ነው |

ፊርማውን ከመጨመርዎ በፊት የድልድዩ ሜታዳታዎችን ያረጋግጡ

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

አወቃቀር URL እንደ ተጠቃሚ-አካባቢያዊ MCP አገልጋይ በወኪል አሂድ ሰዓት ውስጥ.
የኮሚቲንግ ወኪል MCP መቆጣጠሪያ፣ API መለያዎች፣ የተላለፉ የደራሲ ራስጌዎች፣ `authority`, ወይም
`private_key` በዚህ ሰነድ ሪፖ ወይም በመተግበሪያ ሪፖ ውስጥ ያሉ እሴቶች።

ወኪል ፈጣን ደንቦች ጋር በደንብ ይሰራሉ Taira:

- የ መሣሪያዎችን ያግኙ MCP እነሱን ከመጥራትዎ በፊት አገልጋይ; እንደገና ያግኙ
  የአገልጋይ ሪፖርቶች `listChanged`.
- የተመረጡትን ይመርጣሉ `iroha.*` መሳሪያዎች ከቀይ `torii.*` መሳሪያዎች።
- ማንበብ ብቻ ይጀምሩ: የሂሳብ ሁኔታ, ሂሳቦች, ንብረቶች, ቅጽል ስሞች, ብሎኮች,
  የመስተዳደር ሁኔታ እና ግብይቱ ከቀረበው በፊት የጽሁፍ ሁኔታ.
- የቀጥታ የሙከራ አውታረመረብ ለውጦች ከመከሰታቸው በፊት በግልጽ የሰውን መመሪያ ይጠይቃሉ።
  አስቀድሞ የተፈረሙ የግብይት ፖስታዎች፣ አጠቃቀም `iroha.transactions.submit_and_wait`
  ስለዚህ ወኪሉ ከመስጠት ይልቅ ውጤቱን ይጠብቃል።
- የግብይት ሃሽዎችን፣ የመጨረሻውን ሁኔታ እና የአገልጋይ ማረጋገጫ ስህተቶችን በ
  የኤጀንቱ ምላሽ።

### ከወኪሎች ጋር የልማት የሥራ ፍሰት {#development-workflow-with-agents}

እንደ ልማት ረዳቶች ወኪሎችን ይጠቀሙ Iroha ደንበኞች፣ የግብይት ገንቢዎች፣
የኤጀንቱን ሥልጣን ውስን ያድርጉ:
ኮዱን መመርመር፣ ማንበብ ይችላል። Taira የአገሪቱ ሁኔታ፣ ለውጦችን ማቀናበር እና አካባቢያዊ ምርመራዎችን ማካሄድ
ነገር ግን አንድ ሰው ትክክለኛውን ማረጋገጫ እስኪያገኝ ድረስ የቀጥታ አውታረመረብን መቀየር የለበትም
ሥራ።

ተግባራዊ የስራ ፍሰት:

1. ወኪሉ ተገቢውን ዶክመንት እንዲመረምር ጠይቅ፣ SDK ኮድ፣ CLI ትዕዛዝ ወይም MCP
   ኮድ ከመጻፉ በፊት የመሳሪያ መርሃግብር።
2. ወኪሉ በመጀመሪያ አነስተኛውን የደንበኛ መንገድ ይጻፉ: ሁኔታ ማረጋገጫ, መለያ
   ፍለጋ፣ የቅደም ተከተል ጥራት ወይም ሚዛን ፍለጋ።
3. የግብይት ግንባታ ኮድ ብቻ ያክሉ በኋላ-ብቻ ማንበብ ጥሪዎች ላይ ሥራ
   Taira.
4. የቀጥታ አውታረመረብ ሙከራዎችን opt-in አድርግ, ለምሳሌ ከኋላ `TAIRA_LIVE=1`, ስለዚህ አንድ
   የተለመደው የአሃድ ሙከራ ሩጫ በጭራሽ የሙከራ አውታረመረብ ገንዘብ አያወጣም ወይም በኔትወርክ ላይ የተመሠረተ አይደለም
   ተደራሽነት።
5. ወኪሉ የአውታረ መረብ ሥር, ሰንሰለት, ባለስልጣን ሂሳብ ሪፖርት እንዲያደርግ ይጠይቁ,
   መመሪያ ማጠቃለያ, የክፍያ ንብረቶች እና የሚጠበቀው ሁኔታ ለውጥ ከማቅረባቸው በፊት
   ማንኛውም ግብይት።
6. በድብቅ አያያዝ, እንደገና ለመሞከር ባህሪ, ነፃነት እና
   ከማስተዋወቅ በፊት ውድቅ ማድረጉ CI ወይም የማይንት የስራ ፍሰቶች.

ለንባብ ብቻ የሚጠቅም MCP ለልማት የሚረዱ መሳሪያዎች የሂሳብ ንብረቶች ፍለጋን ያካትታሉ ፣
የስም መፍታት፣ የመደብሮች ፍለጋ፣ የግብይት ፍለጋ ፣ የግብይት ዝርዝሮች እና
የቧንቧ መስመር ሁኔታ ምርመራዎች
የተፈረመ የጉልበት ጭነት።

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### የግብይት የሥራ ፍሰት በወኪሎች በኩል {#transaction-workflow-through-agents}

የ MCP ድልድይ ፊርማ ማቅረብ ይችላል Iroha ግብይት, ነገር ግን ማስወገድ አይደለም
አንድ ግብይት አሁንም ትክክለኛ
ሥልጣን፣ ፈቃዶች፣ የክፍያ ድጋፍ፣ ሰንሰለት ID, ሜታዳታ እና ፊርማ።

ጥሬ Iroha ግብይቶች፣ የግብይት ፖስታን በመገንባት እና በ
SDK ወይም CLI በመጀመሪያ፣ ከዚያም ለወኪሉ የቃል ኪዳኑን ስምምነት ብቻ መስጠት
ባይት እንደ `body_base64`. ወኪሉ ፖስታውን በ
`iroha.transactions.submit_and_wait`, ወይም
`iroha.transactions.submit` እና የሕዝብ አስተያየት ከ `iroha.transactions.wait`.

የግል ቁልፎችን ወደ አንድ ወኪል ግብረመልስ አይጣበቁ።
ግብይቱ፣ የተጠቃሚውን የስራ ሰዓት ሚስጥር በሚጭነው አካባቢያዊ ኮድ ላይ አመልክት።
የአካባቢ, ቁልፍ ሰንሰለት, ሃርድዌር ፊርማ, ወይም ታይነትኔት ውቅር ፋይል ችላ.
ወኪል ቁልፍ ቁሳቁሶችን በጭራሽ ወደ ማርክዳውን ፣ ማያ ገጾች ፣ መዝገቦች ወይም
ተሳትፎ ያደርጋል።

ግብይት ከማቅረብዎ በፊት ወኪሉ አጭር ግብይት እንዲያደርግ ያድርጉት
ዕቅድ:

- `network`: Taira የሙከራ አውታረመረብ ሥር እና ሰንሰለት ID
- `authority`: ፊርማውን የሚፈጽምና ክፍያዎችን የሚከፍል ሂሳብ
- `instructions`: መዝገብ፣ ማጣሪያ፣ ማቃጠል፣ ማስተላለፍ፣ ሜታዳታ፣ ፈቃድ ወይም
  የውል ጥሪ ማጠቃለያ
- `fee asset`: የሚከፈልበት ንብረት Taira
- `preflight reads`: ሂሳብ፣ የንብረት ቀሪ ገንዘብ፣ ፍቃዶች፣ ስያሜዎች ወይም ብሎኮች
  ቀድሞውኑ የተከናወኑ ምርመራዎች
- `expected result`: ከተረጋገጠ በኋላ የሚታየው ሁኔታ
- `idempotency`: ተመሳሳይ ጥያቄ እንደገና ከተፈተነ ምን ይከሰታል

ከቀረበ በኋላ ወኪሉ የጨረታ ሁኔታን እስኪጠብቅ ያድርጉ፣ ከዚያም
አንድ ጠቃሚ የማጠናቀቂያ ሪፖርት የሚከተሉትን ያካትታል:

- የግብይት ሃሽ
- የደረጃ ሁኔታ `Committed`, `Applied`, `Rejected`, ወይም `Expired`
- የብሎክ ወይም የአሰሳ ዝርዝሮች ሲገኙ
- የማረጋገጫ ውጤቶች
- ውድቀት መልዕክት እና አለመሳካቱ እንደ ፍቃዶች, ክፍያዎች,
  ማረጋገጫ፣ የቆየ ሁኔታ ወይም የፍጻሜ ነጥብ ተደራሽነት

ምሳሌ የተጠበቀው ቅጽበት:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

የተፈረመው ፖስታ ቀድሞውኑ ሲዘጋጅ:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

ሕክምና Taira MCP የሕዝብ የሙከራ መረብ ቁጥጥር ገጽ ሆኖ። Taira ቁልፎች፣ የሙከራ መርጃ XOR,
የቧንቧ ሂሳቦች እና የካናሪ ፊርማዎች ለአንድ ጊዜ ሊጠቀሙባቸው የሚችሉት እና ከ
Minamoto ቁልፎች እና የምርት ፍሰት የስራ ፍሰቶች።

## አሁን መሞከር የምትችሉት የመጫወቻ ምሳሌዎች {#toy-examples-you-can-try-now}

እነዚህ ምሳሌዎች አንብበው ብቻ ናቸው ካልተጠቀሱ በስተቀር.
ቁልፎች እና ሁለቱም የህዝብ አውታረ መረቦች ላይ ለመሮጥ ደህንነቱ የተጠበቀ ናቸው.

አወዳድር Taira የሙከራ አውታረመረብ እና Minamoto ዋናው ጤና:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

የህዝብ የመረጃ ክልል ጎዳናዎች ዝርዝር Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

ተመሳሳይ ትዕዛዝ ይሂዱ Minamoto የዋና አውታረ መረብ እይታ ሲያስፈልግዎት:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

አንድ ትንሽ ይገንቡ Node.js ለዳሽቦርድ፣ ለቦት ወይም ለማሰማራት የደረጃ ምርመራ
ማረጋገጥ:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

የመጀመሪያው የጽሑፍ ጎን መጫወቻ Taira የቧንቧ ማረጋገጫ።
XOR እና መቼም ቢሆን ወደ Minamoto.

## 3. አንድ Taira የደንበኛው ውቅር {#_3-create-a-taira-client-config}

ቀድሞውኑ ከሌለዎት ቁልፍ ጥንድ ያመነጩ:

```bash
kagami keys --algorithm ed25519 --json
```

መፍጠር `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ከፍተኛው ደረጃ `chain` ትክክለኛ ነው Taira የግብይት ሰንሰለት ID. የ
`[account].profile = "taira"` ቅንብር በራስ-ሰር ይምረጣል Taira I105
ሰንሰለት ልዩነት. ID የሂሳብ መገለጫውን አይመርጥም።

ለንባብ ብቻ የሚሆን ቼክ አሂድ:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

የሕዝቡን አመራር Taira ከጽሑፍ ምርመራዎች በፊት የምርመራ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

የገንዘብ Taira የክፍያ ክፍያዎችን ከመጫንዎ በፊት በቧንቧው በኩል ሂሳብ ያስገቡ።
በቀጥታ የቧንቧ ፍሰት ውስጥ ነው
[ቴስትኔት ያግኙ XOR ላይ Taira](#_4-get-testnet-xor-on-taira).

የቧንቧ ጥያቄ ከተቀበለ በኋላ እና ሂሳቡ ከተከፈለ በኋላ Taira
ካናሪ አማራጭ የጽሑፍ ጭስ ፈተና ነው:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

ካናሪው የተፈረመ ፒንግ ያቀርባል፣ ማረጋገጫን ይጠብቃል
የሂደት ጊዜ ፊርማ አውድ መቼ `--write-config` የተሰጠ ነው። Taira ህዝባዊ ነው
የተረጋገጠ ፒንግ ሳይሳካ ሊመጣ ይችላል
የቧንቧ ራሱ ይሰራል. `taira doctor` የተሟላ ረድፍ ወይም
የካናሪ ተመላሾች `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, መጠበቅ እና እንደገና ለመሞከር
የደንበኛው ውቅር ስህተት እንደሆነ አድርገው ይመለከቱታል።

ያለመከታተል የጭስ ሙከራዎች ላይ ካናሪውን በተወሰነ ዳግም ሙከራ ሉፕ ውስጥ ይሸፍኑ

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

እንደገና መሞከርዎን ያቁሙ `iroha taira doctor` ከባድ ውድቀቶችን ያሳያል
እና የክፍያ ተቀባይነት ውድቅ ጊዜያዊ የመንግስት የሙከራ አውታረመረብ ሁኔታዎች ናቸው; DNS,
TLS, ወይም `status = "fail"` ለምርመራዎች ግን አይሆንም.

## አንድ ማመንጨት SORA Nexus ሂሳብ ID {#generate-a-sora-nexus-account-id}

ሀ SORA Nexus መለያ ID የክኖኒካል ነው I105 አድራሻ
የሂሳብ አጠቃላይ ቁልፍ እና የዒላማው አውታረመረብ ቅድመ ማስረጃ።
`[account].domain` በደንበኛ ውስጥ ዋጋ TOML. ተመሳሳይ የህዝብ ቁልፍ ኮዶች
የተለያዩ IDs ላይ Taira እና Minamoto, እና ምርት ተጠቃሚዎች ማመንጨት አለባቸው
ለየብቻ ቁልፍ ሰሌዳ Minamoto.

ሂሳቡን የሚቆጣጠር Ed25519 ቁልፍ ጥንድ ያመነጩ ወይም ይጫኑ:

```bash
kagami keys --algorithm ed25519 --json
```

የሕዝብ ቁልፍን ወደ Taira መለያ ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

አንድ ቀይር Minamoto በዋና አውታረ መረብ ቅድመ-ጽሑፍ የተጠቀሰው የህዝብ ቁልፍ:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

የተገኘውን መለያ ይጠቀሙ ID በየትኛውም ቦታ Nexus API ወይም CLI ትዕዛዙ አንድ
የካኖኒክ ዘገባ ID, ለምሳሌ Taira የቧንቧ `account_id`, ሚዛን
መጠይቆች, ጥብቅ የሂሳብ መስኮች, ወይም ቅጽል ስም ግዴታዎች.
የደንበኛዎ ውቅር ውስጥ የግል ቁልፍ, እና ጋር ተመሳሳይ የህዝብ አውታረ መረብ ይምረጡ
`[account].profile = "taira"` ወይም `[account].profile = "minamoto"`.

ማመንጨት ID በራሱ የገንዘብ ድጋፍ የሚደረግበት የመስመር ላይ ሂሳብ አይፈጥርም።
Taira, የፋይኔት ፈተለ እና ለ testnet ይጽፋል ሂሳብ መፍጠር ይችላሉ.
Minamoto, ተቀባይነት ያለው የዋና አውታረ መረብ ማሰስ ወይም የግምጃ ቤት ፍሰት ይጠቀሙ።

### ቁልፍ ማከማቻ እና ምትኬ {#key-storage-and-backup}

ሂሳቡ ID እና የህዝብ ቁልፍ ሊጋራ ይችላል.
የይለፍ ቃል፣ ዘር እና የማገገም ቁሳቁስ ምስጢራዊ መሆን አለባቸው።

እነዚህን ልምዶች ለ SORA Nexus ሂሳቦች

- የግል ቁልፎችን በሃርድዌር በተደገፈ የተመሰጠረ የይለፍ ቃል አስተዳዳሪ ውስጥ ያስቀምጡ
  ቁልፍ ማከማቻ ወይም የተወሰነ ፊርማ አገልግሎት።
  የማምረቻ ቁልፎችን በሻል ታሪክ ፣ መዝገቦች ፣ ውይይት ፣ ትኬቶች ውስጥ መቆጣጠር ወይም መተው
  ወይም ያልተመሰጠረ የመጠባበቂያ ቅጂ።
- ለእያንዳንዱ ዋልት ወይም ለምርቱ ፊርማ ልዩ የሆነ ከፍተኛ ኤንትሮፒ የይለፍ ቃል ይጠቀሙ።
  የይለፍ ቃላትን በፓስዎርድ አስተዳዳሪ ወይም በተከፋፈለ የጥበቃ ሂደት ውስጥ ማስቀመጥ፣
  ተመሳሳይ ፋይል ወይም የመጠባበቂያ ክምችት ከተመሰጠረ የግል ቁልፍ ጋር።
- ይቀጥሉ Taira እና Minamoto ቁልፎቹ ተለይተው. Taira ቁልፎች ለአንድ ጊዜ አገልግሎት
  የሙከራ መርጃ ቁሳቁስ እና Minamoto ቁልፎች እንደ የምርት ገንዘብ ባለስልጣን።
- የግል ቁልፍ፣ የህዝብ ቁልፍ፣ መለያ ID, የሂሳብ መገለጫ እና ማንኛውም
  ፊርማውን ለማስመለስ የሚያስፈልጉ የሂሳብ ማግኛ ወይም የጥበቃ ማስታወሻዎች።
  የኔትወርክ አውድ ያለ ቁልፍ በማገገም ወቅት አላግባብ መጠቀም ቀላል ነው.
- ቢያንስ አንድ የተመሰጠረ የኦፍላይን ምትኬ እና አንድ ጂኦግራፊያዊ
  ለምርቱ ፊርማዎች የተለየ የተመሰጠረ ምትኬ።
  ከመጠባበቂያው ላይ በመመርኮዝ አነስተኛ የንባብ-ብቻ ሥራ.
- የግል ቁልፍ፣ የይለፍ ቃል፣ የመጠባበቂያ ሚዲያ፣
  ወይም ፊርማውን የያዘው አስተናጋጅ ሊጋለጥ ይችላል።

ተጨማሪ ዝርዝሮችን ለማግኘት ተመልከት
[የምስጠራ ቁልፎችን ማከማቻ](/am/guide/security/storing-cryptographic-keys.md)
እና [የይለፍ ቃል ደህንነት](/am/guide/security/password-security.md).

## 4. Testnet ን ያግኙ። XOR ላይ Taira {#_4-get-testnet-xor-on-taira}

የሕዝብ ቧንቧ በቀጥታ ይጠቀሙ.

1. አንድ ፊርማ ማመንጨት ወይም መጫን እና የካኖኒካል ማስላት Taira መለያ ID.
2. የአሁኑን የቧንቧ እንቆቅልሽ አምጣ.
3. እንቆቅልሹን ለመፍታት `difficulty_bits` ከ `0`.
4. የቧንቧ ማመልከቻውን ያቅርቡ.
5. ከመላክህ በፊት ሂሳቡ ወይም የንብረቱ ቀሪ ሚዛን የሚታይ እስኪሆን መጠበቅ
   የክፍያ ክፍያ የሚጻፈው።

የሕዝብ ቁልፍ ወደ Taira I105 መለያ ID በቧንቧው የሚጠበቀው:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

እንቆቅልሹን አምጣ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

ቧንቧው የህዝብ የሙከራ አውታረመረብ አገልግሎት ነው።
ተመላሾች `502`, የጊዜ ገደብ ወይም ሌላ የመግቢያው ደረጃ ስህተት፣ መጠበቅ እና እንደገና መሞከር
ቁልፎችዎን ወይም የደንበኞችን ውቅር ከመቀየርዎ በፊት።

መልሱ የሚከተለው መልክ አለው።

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

መቼ `difficulty_bits` ነው `0`, ሂሳቡን ብቻ ያቅርቡ ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

መቼ `difficulty_bits` ከ `0`, እንቆቅልሹን ለመፍታት እና
የአንከር ቁመት እና የኖንስ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

የእንቆቅልሽ ስልተ ቀመር:

1. ፈተናውን እንደ SHA-256 ከ:
   - የ `iroha:accounts:faucet:pow:v2`
   - የ UTF-8 መለያ ID
   - `anchor_height` እንደ ትልቅ ጤፍ `u64`
   - `anchor_block_hash_hex` እንደ ባይት የተገለጸ
   - `challenge_salt_hex` ባይቶች ሆነው ሲገለጹ
2. ይሞክሩ `u64` nonces እንደ ትልቅ ኢንዲያን 8-ባይት እሴቶች የተከፈቱ.
3. ለእያንዳንዱ nonce, ስክሪፕት ጋር ይሂዱ:
   - የይለፍ ቃል: 8-ባይት nonce
   - ጨው: የ 32-ባይት ፈተና
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - የውጤት ርዝመት: 32 ባይት
4. አሸናፊው nonce ቢያንስ `difficulty_bits`
   ወደ ዜሮ ቢት ይመራል።

የፋውንት ምላሽ የሚከፈለው ንብረት እና በዝርዝሩ የተቀመጡ ግብይቶች ሃሽ ያካትታል-

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

መልሱ በአሁኑ ጊዜ በ HTTP `202 Accepted`. አክሲዮኑ
ትርጉም ID ከላይ ያለው Taira በሕዝብ ማሰሮ የሚደገፈው የክፍያ ንብረት።
ማሰሮው ጥያቄውን ሲመልስ ተቀብሏል `tx_hash_hex` እና
`status: "QUEUED"`.

ከዚያም የክፍያ ክፍያዎን ከማቅረብዎ በፊት ለገንዘብ የተደገፈ ንብረትን ይመርምሩ
ግብይቶች

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

የቧንቧ ጥያቄ ተቀባይነት ካገኘ ግን ሂሳቡ ወይም ንብረቱ አይታይም
ሆኖም፣ ግብይቱ አሁንም ከሕዝብ የተገኘ የቴስትኔት ረድፍ ሂደት በስተጀርባ ነው።
ደብዳቤ ከመላክህ በፊት እንደገና ማንበብህን ሞክር።

ለመሮጥ ዝግጁ የሆነ ቀጥተኛ API ቼክ, ይህን እንደ አስቀምጥ `taira_faucet_claim.py`
እና ማለፍ Taira I105 መለያ ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

የቧንቧው ለ ብቻ ነው Taira የቴስትኔት ገንዘብ። XOR, ቧንቧ
ሂሳቦች ወይም Taira የካናሪ ፊርማዎች Minamoto ፍሰቶች።

## 5. አንድ Minamoto የደንበኛው ውቅር {#_5-create-a-minamoto-client-config}

ለ Minamoto. ዳግም አይጠቀሙ Taira ለዋናው ኔትወርክ ቁልፎች።

መፍጠር `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

ከፍተኛው ደረጃ `chain` የአሁኑ ነው Nexus ዋናው የኔት ሰንሰለት ID.
`[account].profile = "minamoto"` የሚመረጠው Minamoto I105 ሰንሰለት
ልዩነት ያለው; የመጨረሻው ነጥብ አስተናጋጅ ስም እና ሰንሰለት ID በተዘዋዋሪነት አይምረጡት።

አንድ ቀይር Minamoto የሕዝብ ቁልፍ ወደ ካኖኒካዊ I105 መለያ ID ጋር
ዋናው የቅድመ-ተጠቃሚ:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

ሂሳቡ እስከሚዘጋጅበትና እስከሚገንዘብበት ጊዜ ድረስ የንባብ ጎን ምርመራዎችን ብቻ ያካሂዱ
በዋና አውታረ መረብ ላይ በመጫን ወይም በአስተዳደር ፍሰት በኩል:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

አሂድ አይደለም Taira የቧንቧ ወይም የመጻፍ ካናሪ ረዳት Minamoto.

## 6. ገንዘብ ሀ Minamoto ሂሳብ XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto ክፍያዎች ከምርቱ ጋር ይከፈላሉ XOR, እና Minamoto የሕዝብ ቁጥር የለውም
የተዋቀረውን ሂሳብ በፈቃደኝነት በተረጋገጠ ዋና አውታረመረብ ውስጥ በማስገባት ያካሂዱ
ወይም የግምጃ ቤት ማስተላለፍ፣ ወይም መቀበል XOR አሁን ካለው የገንዘብ ድጋፍ Minamoto
ሂሳብ።

የካኖኒክ ሂሳቡን ያረጋግጡ ID እና ቀደም ሲል በንባብ-ብቻ ቁጥሮች የሚደገፉ
ደብዳቤ ማቅረብ። Minamoto XOR እንደ ምርት ገንዘብ:
ተመሳሳይ ተግባር ላይ Taira በመጀመሪያ ፣ የተለያዩ የምርት ቁልፎችን ይያዙ እና አይ
ዋናው የኔትወርክ ግብይት ዳግም ሊጀመር ይችላል ብለን እንገምታለን።

Taira XOR መክፈል አይችሉም Minamoto ክፍያዎች: የቴስትኔት ቀሪዎች እና የቧንቧ ግዴታዎች
ወደ Minamoto.

## 7. አሁን ባለው የውሂብ ክልል ውስጥ መሥራት {#_7-work-inside-an-existing-dataspace}

በአንድ መለያ ውስጥ ለሚኖሩ የመረጃ ቋት ዕቃዎች ሙሉ በሙሉ ብቁ የጎራ ስሞችን ይጠቀሙ
ለምሳሌ፣ በአደባባይ የውሂብ ክልል ውስጥ ያለው የፕሮጀክት ጎራ
አጠቃቀም:

```text
apps.universal
```

መለያዎ የሚያስፈልጉትን ፍቃዶች ካገኘ በኋላ፣ ሚስጥር የሌለበት
`AliasSetupPlanRequestV1` ለጎራው ዓላማ እና የዲክላረቲቭ ፕላነርን ይጠቀሙ:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

ለ Minamoto, አንድ የተለየ ዋነኛ ዓላማ እና ዕቅድ ማመንጨት እና ማጽደቅ.
ሰንሰለት, ሥልጣን, የቀጥታ ሁኔታ አናከር, እና ጊዜ ገደብ ጋር የተያያዙ ናቸው, ስለዚህ አንድ
Taira ዕቅድ ማስተዋወቅ ወይም እንደገና መጫወት አይቻልም።

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

የሂሳብ ስያሜዎች ተመሳሳይ የመረጃ ቋት ቅደም ተከተል ይጠቀማሉ:

```text
alice@apps.universal
alice@universal
```

ጥብቅ የሂሳብ መስኮች አሁንም ካኖኒካል ይጠቀማሉ I105 መለያ IDs. ስያሜዎችን ይያዙ
በሰው ዘንድ ሊነበብ የሚችልና ለካኖኒክ ዘገባ የሚፈታ ውህደት IDs.

## 8. አዲስ የመረጃ ቦታ ማቅረብ {#_8-provision-a-new-dataspace}

አዲስ የውሂብ ቦታ አስተናጋጅ እና የአስተዳደር ለውጥ ነው Torii
መጨረሻ ነጥብ ትራፊክን ወደ የተዋቀሩ የውሂብ ጎታዎች ሊያመራ ይችላል ፣ ግን ውድቅ ያደርጋል
የማይታወቁ የውሂብ ቦታ ቅጽል ስሞች።

ለውጥ ከማዘጋጀትዎ በፊት የአሁኑን የቀጥታ ካታሎግ ይያዙ

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

ለኦፕሬተር መለያ ደግሞ የመንገድ ማሳያ አቀማመጥ ይመልከቱ:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ከመንገዱ በስተቀር አዲስ ቅጽል ስም አያስተዋውቁ ID, የመረጃ ቦታ ID, የማረጋገጫ ስብስብ፣
ስህተት መቻቻል, ማሳያ, የመንገድ ደንቦች, እና የአሠራር ባለቤት
አንድ የተለመደ የተጠቃሚ መለያ የሚጠይቁ ፍቃዶችን ጋር
አንድ ጎራ ማግኘት እና SNS በመረጃ ቦታው ውስጥ የሚገኝ ውርርድ
የአስማት ፕላነር፤ አዲስ የህዝብ የመረጃ ቦታን በአስተማማኝ ሁኔታ ማከል አይችልም።

ለግል ወይም ለድርጅት የውሂብ ቦታ የሚከተሉትን ካታሎግ ለውጦች ያዘጋጁ

- ልዩ የውሂብ ቦታ ስያሜ እና ቁጥራዊ `id`
- የሚመሳሰል የመንገድ መግቢያ ወይም ነባር የመንገድ አሰጣጥ
- የመረጃ ቦታ `fault_tolerance`
- ለመድረስ የሚገቡ መመሪያዎችን ወይም የሂሳብ ስኮፖዶችን ለማስተላለፍ የሚያስችሉ የመንገድ ደንቦች
  እዚያ
- አንድ የቦታ ማውጫ ማኒፌስት ወይም ተመጣጣኝ ማስቀመጫ ማስረጃ,
  የመረጃ ቋት መረጃዎች UAID አቅም
- ለትዕግስት ማረጋገጫ፣ ተገዢነት፣ መፈፀም እና ክትትል የሚሆን የአስተዳደር ፈቃድ
  ፖሊሲ

ሊታተም የሚችል የኮንፊግሽን ክፍል እንደዚህ ይመስላል:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

የኦፕሬተር ተቀባይነት የሚከተሉትን በሮች ሊያካትት ይገባል-

- `irohad --sora --config <config.toml> --trace-config` በ
  የተቋረጠ የአገናኝ ውቅር
- የተፈጠረው ወይም የተመለሰው ማኒፌስት በሃሽ እና ፊርማዎች የታሸገ ነው
- የጭስ ሙከራዎች አልፈዋል Taira ከማንኛውም በፊት Minamoto ማስተዋወቅ
- ከለውጥ በኋላ `/status` ካታሎግ የታሰበውን ጎዳና እና የመረጃ ቦታ ያሳያል
- `iroha app nexus lane-report --summary` የጠፋውን ሪፖርት አያደርግም
  መገለጫዎች

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

ተመሳሳይ የመረጃ ቦታ ለማስተዋወቅ Minamoto ብቻ በኋላ Taira ማሰማራት፣
የጭስ ሙከራዎች፣ ክትትል እና የአስተዳደር ማስረጃዎች የተጠናቀቁ ናቸው።

## ተዛማጅ ገጾች {#related-pages}

- [መጫን Iroha 3](/am/get-started/install-iroha.md)
- [ይሠራል Iroha 3 በኩል CLI](/am/get-started/operate-iroha-via-cli.md)
- [ለግል የመረጃ ቦታ የሚከፈልባቸው የስፖንሰር ክፍያዎች](/am/get-started/private-dataspace-fee-sponsor.md)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [የዘፍጥረት ዘገባ](/am/reference/genesis.md)
