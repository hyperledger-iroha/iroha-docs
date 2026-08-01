---
translation_locale: kk
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3: Taira және Minamoto бойынша құрылыс {#build-on-sora-3-taira-and-minamoto}

SORA 3 - Iroha 3 және SORA Nexus негізінде салынған қолданбаға қарасты қоғамдық іске қосу трассасы. Алдымен Taira арқылы жасаңыз, содан кейін бірдей клиент пішінінді Minamoto-ге көшіріңіз, тек егер сізде жеке негізгі желі кілттері бар болса, ақы үшін нақты XOR және өндіріс бетімі.

Бұл оқу құралы Iroha клиентін қоғамдық SORA 3 желі үшін қалай баптау керектігін көрсетеді:

- Taira сынақ желісі `https://taira.sora.org`
- Minamoto бас желісі `https://minamoto.sora.org`

Пайдалану Taira Интеграциялық сынақтар, краннан қаржыландырылған жазу канариялары және іске қосу репетициялары үшін. Minamoto Тек өндіріске дайын негізгі желілер үшін ғана. XOR:

- Taira мемлекеттік краннан сынақ желісі XOR пайдаланады.
- Minamoto шынайы пайдалану XOR. Ол жоқ Minamoto кран.

## Құрылысшы жолы {#builder-path}

|Қадам |Taira Тестнет |Minamoto Негізгі |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Желідегі жағдайды оқуды бастаңыз |Кілтсіз сұраныс `/status` |Кілтсіз сұраныс `/status` |
|Деректер кеңістігін таңдаңыз|Қолданбаңызға басқарушы жол қажет болмаса, қоғамдық `universal` пайдалану |Майннеттің рұқсатын алғаннан кейін ғана бірдей деректер кеңістігін пайдалануға болады |
|Төлемақыны алыңыз .|Қоғамдық Taira кранды пайдалану |XOR қаржыландырылған Minamoto шоттан немесе бекітілген қазынашылық ағымнан алыңыз |
|Тест жазған |Фаннеттен қаржыландырылған сынақтан пайдалану XOR |Сынақ құралын пайдаланбаңыз; нақты шығындарды жазады XOR |
|Даму |Логиканы, мониторингті және қолтаңбалаушыларды қайта сынаңыз. |Бөлек кілттерді, қаржыландыруды және босатуды басқаруды қолдану |

Практикалық ағым:

1. Клиентті Taira-ға қарсы құру және қоғамдық `universal` деректер кеңістігін пайдалану.
2. Қолтаңбалаушы қосылып, Taira кранмен қаржыландырыңыз.
3. Қолданбаңыздың логикасын Taira -ға қарсы жаттығуға тырысыңыз, сәтсіздіктер кішіпейіл және байқалады.
4. Жеке Minamoto қолтаңбалаушы жасаңыз, оны нақты XOR арқылы қаржыландырыңыз және тек дәлелденген операциялар ғана негізгі желіге көшірілсін.

## 1. Қандай мақсатқа қол жеткізетіндігіңді түсін {#_1-understand-what-you-are-setting-up}

SORA Nexus-де деректер кеңістігі желілік лента мен маршруттау каталогының бір бөлігі болып табылады. Клиент жаңа қоғамдық деректер кеңістігін `client.toml` өзгертіп ғана құруға мүмкіндік бермейді. Клиенттің орнатуы екі нәрсе жасайды:

1. клиентті оң жақ Torii аяқтық нүктесіне көрсетеді
2. өзінің каноникалық тіркелгісі үшін домен мен деректер кеңістігінің бағыт беру контекстін таңдайды

`AccountId` әрдайым каноникалық және доменсіз. `client.toml`-дегі `[account].domain` мәні маршруттандыру мен псевдоним контекстін береді; ол тіркелгі сәйкестігінің бөлігі болмайды. Көптеген қолданбалар үшін мемлекеттік `universal` деректер кеңістігінен бастаңыз. Домен контексі `domain.dataspace` нысанын пайдаланады, мысалы:

```text
wonderland.universal
```

Егер сізге жаңа ұйымдық деректер кеңістігі қажет болса, оны әдеттегі клиент шотынан тіркеуге тырысудың орнына каталог және бағыт беру ұсынысын дайындаңыз. [Жаңа деректер кеңістігін ](#_8-provision-a-new-dataspace) қамтамасыз етуді төменде қараңыз.

## 2. Қоғамдық Torii қорытынды нүктесін тексеріңіз {#_2-check-the-public-torii-endpoint}

Қолтаңбалаушыны баптаудан бұрын мақсатты аяқталу нүктесінің белсенді екендігін тексеріңіз.

Taira үшін:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto үшін:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Ұяшықта көрсетілген деректер кеңістігі мен жолақты қарауды тексеру:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Негізгі желі үшін `https://minamoto.sora.org/status` командасымен бірдей команданы пайдаланыңыз.

## Taira MCP агенттер үшін {#taira-mcp-for-agents}

Taira сонымен қатар агенттің орындалу уақыттары үшін Torii-тамырланған Модель Контекст Протоколы (MCP) көпірін ашады. Агентті тікелей тестнет оқулары, скрипттік диагностикалар немесе қатаң тексерілген жазу репетициялары қажет болған кезде оны бірінші кезекте жеке Torii клиент құрусыз қолданыңыз.

|Орнату |Бағасы |
| --- | --- |
|MCP аяқталу нүктесі |`https://taira.sora.org/v1/mcp` |
|Желі тамырлары |`https://taira.sora.org` |
|Мақсатты пайдалану |Taira тест-нет оқулары және краннан қаржыландырылған жазу репетициялары |
|Өндіріс эквиваленті |Бұл жазбаны Minamoto дегенге жатқызбаңыз, егер негізгі желілік MCP аяқ нүктесі мен босату бақылаулары айқын түрде бекітілген болмаса |

Қолтаңбалау материалдарын қосудан бұрын көпірдің метамәдени деректерін тексеріңіз:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Конфигурациялау URL пайдаланушы-орындар ретінде MCP Серверді агенттің жұмыс уақытында орындау. MCP конфигурация, API Токендер, жіберілген авторлық тақырыптар, `authority`, немесе `private_key` Бұл құжат репосына немесе қолданба репосына құндар.

Taira пен жақсы жұмыс істейтін агенттік жедел ережелері:

- MCP серверінен құралдарды шақырудан бұрын ашу; егер сервер `listChanged` туралы хабарласа, қайта табу.
- Өрі `torii.` құралдарға қарағанда, іріктелген `iroha.` құралдарды артық көреміз.
- Тек оқуды бастаңыз: есептерді, активтерді, псевдонимдерді, блоктарды, басқару жағдайын және хаттарды ұсынудан бұрын транзакция жағдайын тексеріңіз.
- Тірі тест желісі мутацияларына дейін адамның нақты нұсқауларын талап ету. Алдын ала қол қойылған транзакция конверттері үшін `iroha.transactions.submit_and_wait` қолданыңыз, сондықтан агент тек тапсырудың орнына нәтижеді күтеді.
- Агенттің жауапта транзакция хэштегін, соңғы жай-күйін және серверді растау қателерін қорытындылау.

### Агенттермен жұмыс істеу процесін дамыту {#development-workflow-with-agents}

Iroha клиенттеріне, транзакция жасаушыларға, диагностикалық скрипттерге және тест-нет орындалатын кітапшаларға агенттерді әзірлеудің көмекшілері ретінде қолдану. Агенттің өкілеттігін тар ұстаңыз: ол кодты тексеріп, Taira күйін оқи алады, өзгерістерді ұсынады және жергілікті сынақтарды орындайды, бірақ адам нақты операцияны мақұлдамайынша тірі желіге мутация жасау керек емес.

Қолданбалы жұмыс барысы:

1. Агентті код жазудан бұрын тиісті құжаттарын, SDK кодын, CLI командасын немесе MCP құралдың схемасын тексеруді сұраңыз.
2. Агентті ең кішкентай клиент жолын алдымен жазуға шақырыңыз: жай-күйін тексеру, шотты іздеу, псевдонимді шешу немесе балансты іздеу.
3. Тек оқуға арналған шақырулар Taira бойынша жұмыс істегеннен кейін ғана транзакция жасау кодын қосу.
4. Тікелей желілік тестілеулерді таңдаңыз, мысалы `TAIRA_LIVE=1` артында сақтаңыз, сондықтан қалыпты бірліктегі сынақ жүрісі ешқашан тест-нет қаражатын жұмсай алмайды немесе желіге қолжетімділікке байланысты болады.
5. Агентті кез-келген транзакцияны ұсынғанға дейін желі тамырын, тізбекті, өкілеттілік есебін, нұсқаулардың жиынтығын, алым активтерін және күтілетін мемлекеттің өзгеруін мәлімдеуді талап етеді.
6. CI немесе магистральдық жұмыс ағынына жылжытудан бұрын құпия басқару, қайта сынау мінез-құлқы, idempotency және бас тартуды басқару үшін құрылған кодты тексеріңіз.

Даму үшін пайдалы тек оқуға арналған MCP құралдарға шот активтерін іздеу, псевдонимді шешу, блоктарды іздеу, транзакцияларды іздеу, мәмілелер тізімдері және құбырдың жай-күйін тексеру жатады.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Транзакциялар агенттер арқылы жұмыс барысы {#transaction-workflow-through-agents}

Қауымдастық MCP bridge қол қойылған құжатты тапсыра алады Iroha транзакция, бірақ бұл қалыпты транзакциялық талаптарды алып тастамайды. Транзакцияға әлі де дұрыс өкілеттік қажет, рұқсаттар, алымдарды қаржыландыру, тізбек ID, Метамәліметтер және қолтаңба.

Түйме Iroha операциялары үшін алдымен транзакция конвертін SDK немесе CLI белгісімен жасаңыз және қолтаңбалаңыз, содан кейін агентке тек `body_base64` ретінде кодталған каноникалық қол қойылған транзакциялық байттарды ғана беріңіз. Агенттік конвертті `iroha.transactions.submit_and_wait`, немесе `iroha.transactions.submit` және сауалнаманы `iroha.transactions.wait` арқылы тапсыра алады.

Жеке кілттерді агенттiк өтiнiшке орналастыруға болмайды. Егер агентке транзакцияны құру қажет болса, оны пайдаланушының жұмыс уақытындағы ортасының құпияларын жүктейтiн жергiлiктi кодқа бағыттаңыз, кілттер тізбегі, аппараттық қолтаңбалаушы немесе тестнет конфигурация файлын елемеген. Агенттің кілт материалдарын ешқашан Markdown, фиксаторлар, журналдарына жазуы керек емес.

Транзакцияны тапсырудан бұрын агентті қысқаша транзакция жоспарын жасауға мәжбүрлеу:

- `network`: Taira тестілеу желісінің тамырлары мен тізбектері ID
- `authority`: қол қоятын және алым төлейтін есепшот
- `instructions`: реестр, минда, күйдіру, беру, метамәліметтер, рұқсат немесе келісімшарт шақыруының қорытындысы
- `fee asset`: Taira бойынша алынатын активтер
- `preflight reads`: есептік жазба, активтердің балансы, рұқсаттар, аты-жөндер немесе блок тексерулері
- `expected result`: расталғаннан кейін көрінетін жай-күй
- `idempotency`: егер сол өтінішті қайта қараса, не болады?

Ұсынылғаннан кейін, агентті терминалдық жай-күйді күтуге мәжбүрлеңіз, содан кейін оқу сұрауымен мемлекеттің өзгергенін тексеріңіз. Пайдалы аяқталу есебіне:

- транзакция хэшігі
- `Committed`, `Applied`, `Rejected` немесе `Expired` сияқты терминалдық жағдай
- Блок немесе зерттеуші деталдар, егер қол жетімді болса
- тексерудің оқу нәтижелері
- бас тарту хабарламасы және қате рұқсаттар, алымдар, растау, бос күй немесе соңғы нүктелердің қолжетімділігі сияқты көріне ме?

Үлгі сақтандырылған жедел:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Қол қойылған конверт әзірленген кезде:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ді мемлекеттік сынақ желісінің бақылау беті ретінде қараңыз. Taira кілттер, сынақ желісі XOR, кран шоттары және канарлық қолтаңбалар біржола пайдаланылады және олар Minamoto кілттерден және өндірісті босату жұмыс барысынан бөлек болуға тиіс.

## Енді сынап көргің келетін ойыншықтар {#toy-examples-you-can-try-now}

Бұл мысалдар, егер ескерілмеген болса, тек оқуға арналған. Олар кілттерді өндіруден бұрын жұмыс істейді және екі қоғамдық желіге қарсы қауіпсіз.

Taira сынақ желісінің және Minamoto негізгі желілердің денсаулығын салыстыру:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira ашық деректер кеңістігінің жолдарын келтіріңіз:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Негізгі желі көрінісі қажет болған кезде Minamoto командасына қарсы осыны орындаңыз:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Дашборда, ботта немесе орналасуын тексеру үшін кішкентай Node.js жай-күй зондін құру:

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

Алғашқы жазу жағындағы ойыншық Taira кранды талап етуі тиіс. Ол сынақ желісін XOR пайдаланады және ешқашан Minamoto дегенге сілтеме жасауы керек.

## 3. Taira Клиенттің баптауын құру {#_3-create-a-taira-client-config}

Егер сізде әлі жоқ болса , кілті жұп жасаңыз:

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` құру:

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

Жоғарғы деңгейдегі `chain` нақты Taira транзакциялық тізбекті ID. `[account].profile = "taira"` параметрі Taira I105 тізбектің айырмашылығын дербес таңдайды. ID тізбегі шот профилін таңдай алмайды.

Тек оқуға арналған тексеруді жүргізу:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Жазбаларды жазудан бұрын қоғамдық Taira диагностикасын жүргізу:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Қаржыландыру Taira Төлемақы төлеуді орындаудан бұрын кран арқылы есеп айырысу. тікелей кран ағыны [Тестнет-ті алу XOR бойынша Taira](#_4-get-testnet-xor-on-taira).

Кранның талаптары қабылданғаннан кейін және шот қаржыландырылғаннан кейін, Taira канарды жазу дымы сынағы болып табылады:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Канарь қолтаңбаланған ping тапсырады, растауды күтеді және `--write-config` ұсынылған кезде орындалу уақыты қолтаңбалаушы конфигурациясын жазады. Taira қоғамдық тест желісі болып табылады, сондықтан кезек қанағаттандыруы кранның өзі жұмыс істегенде де қолтаңбаланган ping сәтсіздікке ұшырауы мүмкін. Егер `taira doctor` толы кезекті немесе канарлық `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` қайтарса, оны клиент конфигурациясының қатесі ретінде қараудан бұрын күтіңіз және қайталап көріңіз.

Бақыланбайтын түтін сынақтары үшін канарийді шектелген қайта сынау циклінде ораңыз:

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

Егер `iroha taira doctor` ауыр сәтсіздіктер көрсеткенде, қайтадан сынақтан өтуді тоқтатыңыз. Кезектің толысуы және алым қабылдауды бас тарту - қоғамдық тест желісінің өткінші жағдайлары; DNS, TLS немесе `status = "fail"` диагностикасы жоқ.

## SORA Nexus тіркелгісін құру ID {#generate-a-sora-nexus-account-id}

SORA Nexus шоты ID - шоттың қоғамдық кілті мен нысаналы желі префиксінен алынған каноникалық I105 мекенжайы. Бұл клиенттегі `[account].domain` мәні емес TOML. Сонымен қатар, Taira және Minamoto жүйелерінде бірдей мемлекеттік кілті әртүрлі IDs кодтары бар, ал өндірістік пайдаланушылар Minamoto үшін бөлек кілті жұп жасауы керек.

Эд25519 қойындысын құру немесе жүктеу тіркелгіні басқару үшін:

```bash
kagami keys --algorithm ed25519 --json
```

Қоғамдық кілтті Taira тіркелгісіне ID ауыстыру:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto мемлекеттік кілтті негізгі желі префиксімен ауыстырыңыз:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Нәтижесінде есептен пайдалан ID кез келген жерде Nexus API немесе CLI командасы каноникалық есеп сұрайды ID, мысалы, Taira кран `account_id`, Баланс сұраныстары, қатаң тіркелгі өрістері немесе аты-жөнді байланыстар. Келесі жеке кілт клиент конфигурацияңызда сақтаңыз, және бірдей қоғамдық желіді таңдаңыз `[account].profile = "taira"` немесе `[account].profile = "minamoto"`.

ID генерациялау өздігінен қаржыландырылатын тізбектегі шотты құруға мүмкіндік бермейді. Taira -да кран тестнет жазулары үшін шотты құруы және қаржыландыруы мүмкін. Minamoto -де бекітілген негізгі желіге қосылу немесе қазынашылық ағынды пайдалану.

### Кілттерді сақтау және сақтап қалу {#key-storage-and-backup}

Тіркелгі ID және мемлекеттік кілті бөлінеді. Келесі жеке кілті, пароль, тұқым және қалпына келтіру материалдары құпия сақталуы керек.

SORA Nexus шоттары үшін осы әдістерді қолдану:

- Жеке кілттерді шифрланған пароль менеджерінде, аппараттық қамтамасыз етілген кілт-шоуда немесе арнайы қолтаңбалау қызметінде сақтау. Кілттерді бастапқы басқаруға жүктемеңіз және өндіріс кілттерін шель тарихында, журналдарында, чатта, билеттерде немесе шифрланбаған резервті көшірмелерде қалдырмаңыз.
- Әрбір қоршау немесе өндірістік қолтаңбалаушы үшін бірегей жоғары энтропиялы парольді қолданыңыз. Парольдерді шифрланған жеке кілттің файлында емес, пароль менеджерінде немесе бөлек сақтау процесінде сақтаңыз.
- Taira және Minamoto кілттерін бөлек ұстаңыз. Taira кілттерді біржолғы сынақ желісінің материалы ретінде, Minamoto кілттерді өндірістік қорлар органы ретінде қарастырыңыз.
- Қолтаңбалаушыны қалпына келтіру үшін қажетті жеке кілтті, қоғамдық кілті, есептік жазба ID, шот профилін және кез келген есептік жазбаны қалпына келтіру немесе сақтау жазбаларын қолға түсіру.
- Өндірістік қолтаңбалар үшін кем дегенде бір шифрланған офлайн резервті және географиялық жағынан бөлек бір шифрланган резервті сақтау. Қосалқыға байланысты, тек оқуға арналған шағын операциямен қалпына келтіру сынағы.
- Жеке кілті, пароль, қосалқы медиа немесе қолтаңбалаушы хост ашылған болса, қолтаңбаны айналдыру немесе ауыстыру.

Толығырақ мәлімет үшін [Криптографиялық кілттерді сақтау](/kk/guide/security/storing-cryptographic-keys.md) және [Шафшылдық қауіпсіздігі](/kk/guide/security/password-security.md) дегенді қараңыз.

## 4. Тестнетке XOR қосылыңыз Taira {#_4-get-testnet-xor-on-taira}

Қоғамдық кранды тікелей пайдалану.

1. Қолтаңбалаушыны генерациялау немесе жүктеу және оның каноникалық Taira шотын есептеу ID.
2. Заманауи құмыраны алып келіңіз.
3. Егер `difficulty_bits` `0`-дан үлкен болса, жұмбақты шешу.
4. Кранды талап етуді тапсырыңыз.
5. Есепшоттың немесе активтердің балансының көрінетінінін күтіңіз, ақы төлеу туралы хаттарды жібермес бұрын.

Қоғамдық кілтті Taira I105 есеп ID краннан күтiлетiн:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Ілмекті әкеліңіз:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Фаннет - бұл қоғамдық тест-нейт қызметі. Егер жұмбақ немесе талап ету аяқтық нүктесі `502`, уақыт үзілісі немесе басқа шлюз деңгейіндегі қате қайтарса, кілттеріңізді немесе клиент конфигурацияңызды өзгерту алдында күтіңіз және қайталап көріңіз.

Жауаптың түрі мынау:

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

Қашан `difficulty_bits` болып табылады `0`, есептерді ғана тапсыру ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Егер `difficulty_bits` `0`-дан асқан болса, түймелерді шешіп, якорь биіктігін қосу және нонс:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

Алгоритм мынау:

1. Таңдауды SHA-256 ретінде салыңыз:
   - `iroha:accounts:faucet:pow:v2` байттарының
   - UTF-8 шоты ID
   - `anchor_height` үлкен енділік `u64`
   - `anchor_block_hash_hex` байт ретінде шифрлансын
   - `challenge_salt_hex` болса байт түрінде декодтанған
2. `u64` нонселерді үлкен ендиан 8 байт мәндері ретінде кодтауға тырысыңыз.
3. Әрбір нонс үшін скриптпен орындаңыз:
   - Пароль: 8-байттық нонс
   - тұз: 32-байтқа арналған қиындық
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - шығыс ұзындығы: 32 байт
4. Жеңімпаз нонс - ең болмағанда `difficulty_bits` нөлдік биттерді бастайтын алғашқы дигест.

Фаннетке жауап қаржыландырылған активті және кезекші транзакция хэшін қамтиды:

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

Жауап қазіргі уақытта HTTP `202 Accepted` ретінде қайтарылады. Жоғарыда келтірілген активтің анықтамасы ID - мемлекеттік краннан қаржыландырылатын Taira алым активтері. Кран қайтару кезінде өтінішті қабылдады `tx_hash_hex` және `status: "QUEUED"`.

Одан кейін қаржыландырылатын активтерді өздеріңіздің алым төлейтін транзакцияларыңызды ұсынғанға дейін сауалнама:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Егер кранды талап ету қабылданса, бірақ шот немесе актив әлі көрінбесе, транзакция әлі күнге дейін testnet кезегін өңдеудің артында тұр. Жазуды жібергенге дейін қайталап оқып көріңіз.

Қолданысқа дайын тікелей API тексеру үшін осыны `taira_faucet_claim.py` деп сақтаңыз және Taira I105 шотына ID қойыңыз:

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

Кран тек Taira тест-нет қаражаты үшін қолданылады. XOR тестілеу желісін, кран шоттарын немесе Taira канарлық қолтаңбалаушыларды Minamoto ағындарында қолданбаңыз.

## 5. Minamoto клиентін баптауды құру {#_5-create-a-minamoto-client-config}

Алу үшін бөлек кілті жұп қолданылсын Minamoto. Қайта қолданбау Taira негізгі желіге кілттер.

`minamoto.client.toml` құру:

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

Жоғарғы деңгейдегі `chain` ағымды Nexus майннет тізбектері ID. `[account].profile = "minamoto"` сайлайды Minamoto I105 тізбектің айырмашылығы; соңғы нүктедегі қоректендіруші және тізбек ID оны жасырын түрде таңдамаңыз.

Minamoto мемлекеттік кілтін негізгі желі префиксімен I105 каноникалық ID тіркелгісіне ауыстыру:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Есепшоттың негізгі желіге қосылу немесе басқару ағыны арқылы қамтамасыз етілетін және қаржыландырылатын уақытқа дейін тек оқу жағындағы тексерулерді орындаңыз:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira кранды немесе жазу қосалқысын Minamoto қарсы қозғалтпаңыз.

## 6. Minamoto шотты XOR қаржыландырыңыз {#_6-fund-a-minamoto-account-with-xor}

Minamoto алымдары өндіріспен XOR төленеді, ал Minamoto-де мемлекеттік құбыр жоқ. Конфигурацияланған шотты бекітілген негізгі желіге қосылу немесе қазыналық аударым арқылы қаржыландырыңыз немесе қолданыстағы қаржыландырылған Minamoto шоттан XOR алыңыз.

ID каноникалық шотын және қаржыландыруды тек оқуға арналған тексерулермен тексеріңіз. Жазуды тапсырғанға дейін Minamoto XOR -ді өндірістік қаражат ретінде қараңыз: бірінші кезекте Taira -де бірдей операцияны қайталап көріңіз, өндіріс кілттерін бөлек сақтаңыз және негізгі желі транзакциясын қалпына келтіруге болады деп болжамаңыз.

Taira XOR Minamoto алымдарын төлей алмайды. Тестнет қалдықтары мен кранның талаптары Minamoto-ге аударылмайды.

## 7. Қолданыстағы деректер кеңістігінде жұмыс істеу {#_7-work-inside-an-existing-dataspace}

Деректер кеңістігінің ішінде тұратын бухгалтерлік кітапша объектілері үшін толық білікті домен атауларын қолдану. Мысалы, қоғамдық деректер кеңістігіндегі жобалық домен:

```text
apps.universal
```

Тіркелгіңізге қажетті рұқсаттар берілгеннен кейін, домен үшін құпиясыз `AliasSetupPlanRequestV1` ниеті жасаңыз және декларациялық жоспарлаушыны пайдаланыңыз:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto үшін бөлек негізгі желі ниеті мен жоспарын құру және бекіту. Жоспарлар олардың тізбектеріне, өкілеттігіне, тіршілік жағдайындағы якорьіне және мерзіміне байланысты, сондықтан Taira жоспарын көтермелеу немесе қайта ойнату мүмкін емес:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Тіркелгілердің аты-жөні бірдей деректер кеңістігінің жұрнағын пайдаланады:

```text
alice@apps.universal
alice@universal
```

Қатаң есеп өрістерінде әлі де каноникалық қолданылады I105 есеп IDs. Киелі кітапқа сәйкес келетін , адам оқи алатын байланыстар ретінде қолданбалы атауларды қарастыру IDs.

## 8. Жаңа деректер кеңістігін қамтамасыз ету {#_8-provision-a-new-dataspace}

Жаңа деректер кеңістігі оператор мен басқаруды өзгерту болып табылады. Қоғамдық Torii аяқтық нүкте трафикті конфигурацияланған деректер кеңістігіне бағыттауы мүмкін, бірақ ол беймәлім деректер кеңістігінің атауын бас тартады.

Өзгерістерді дайындамас бұрын, қазіргі терезелік каталогты түсіріңіз:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Оператордың тіркелгісі үшін жол картасының күйін де тексеріңіз:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ID, деректер кеңістігі ID, растаушы жиынтығы, қате төзімділігі, манифесті, бағытлау ережесі және пайдаланушы иесі бірге тексерілмесе, жаңа аты-жөнін ұсынбаңыз. Қажетті рұқсаттары бар әдеттегі пайдаланушы тіркелгісі SNS доменді және оның қолданыстағы деректер кеңістігінің ішінде жалға алуын псевдопланер арқылы сатып ала алады; ол жаңа қоғамдық деректер кеңістігін қауіпсіз қосу мүмкін емес.

Жеке немесе ұйымдық деректер кеңістігі үшін каталогты өзгертуді дайындаңыз:

- бірегей деректер кеңістігінің аты-жөні және сандық `id`
- сәйкес келетін жолақ кіруі немесе қолданыстағы жолақ тапсырмасы
- деректер кеңістігі `fault_tolerance`
- Осында жетуі тиіс нұсқаулар немесе шоттар ауқымы үшін бағыт ережелері
- деректер кеңістігі UAID мүмкіндіктерін ашқан жағдайда, Space Directory manifest немесе оған теңестірілген іске қосу дәлелі;
- Бағалаушы, сәйкестік, есеп айырысу және мониторинг саясаты үшін басқаруды бекіту

Тексеруге болатын конфигурация фрагменті былай көрінеді:

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

Оператордың қабылдауында мынадай қақпалар болуы тиіс:

- `irohad --sora --config <config.toml> --trace-config` шешілген түйін конфигурациясын береді
- Жаратылған немесе тексерілген манифест хештармен және қолтаңбалармен мұрағатталады
- Minamoto көтермелеуден бұрын түтін сынақтары Taira тапсырылады.
- өзгергеннен кейінгі `/status` каталогы жоспарланған жолақ пен деректер кеңістігін көрсетеді.
- `iroha app nexus lane-report --summary` талап етілген манифесттердің жоғалғанын хабарламайды

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira іске қосылғаннан кейін ғана сол деректер кеңістігін Minamoto -ға жылжыту, түтін сынақтары, мониторинг және басқару дәлелдемелері толық болғаннан кейін.

## Қосылған беттер {#related-pages}

- [Iroha 3](/kk/get-started/install-iroha.md) орнату
- [Iroha 3 арқылы CLI](/kk/get-started/operate-iroha-via-cli.md) пайдалану
- [Жеке деректер кеңістігі үшін спонсорлық алымдар](/kk/get-started/private-dataspace-fee-sponsor.md)
- [Torii аяқтық нүктелері](/kk/reference/torii-endpoints.md)
- [Жаратылыс сілтемесі](/kk/reference/genesis.md)
