---
translation_locale: ru
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Построиться на SORA 3: Taira и Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 - это общественная трасса развертывания, ориентированная на приложение, построенная Iroha 3 и SORA
Nexus. Постройте и репетируйте на Taira Сначала, затем переместить форму клиента
к Minamoto только если у вас есть отдельные ключи, реальные XOR в отношении сборов,
и утверждение производства.

В этом руководстве показано, как настроить Iroha клиент для общественности SORA 3
сети:

- Taira испытательная сеть на `https://taira.sora.org`
- Minamoto в основном `https://minamoto.sora.org`

Использование Taira для тестов интеграции, пишущих канарей, финансируемых из крана, и
Репетиции по развертыванию. Minamoto только для готовой к производству магистральной сети
В связи с этим, как и в других случаях. XOR:

- Taira использует тестовую сеть XOR из общественного крана.
- Minamoto использует реальные XOR. Нет. Minamoto крана.

## Путь строителя {#builder-path}

| Шаг                        | Taira Тестная сеть                                                | Minamoto Майннет                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Начните с чтения состояния сети | Вопрос `/status` без ключей                                 | Вопрос `/status` без ключей                       |
| Выберите пространство данных            | Публичное использование `universal` Если только ваше приложение не нуждается в управляемой полосе | Используйте тот же пространство данных только после одобрения майннета |
| Получить доход по счетам               | Используйте общественность Taira крана                                  | Прием XOR от финансируемого Minamoto расчетный или утвержденный казначейский поток |
| Тест пишет                 | Использование испытаний, финансируемых из крана XOR                                   | Не используйте тестовые инструменты; пишет расходуют реальные XOR     |
| Продвижение                     | Пробуйте снова логику, наблюдение и обработку подписи            | Используйте отдельные клавиши, управление финансированием и освобождением   |

Практический поток:

1. Постройте клиента против Taira и использовать общественность `universal` пространство данных.
2. Добавьте подписи и финансируйте ее Taira крана.
3. Используйте логику приложения против Taira пока не станут скучны провалы и
   наблюдаемое.
4. Создать отдельный Minamoto Подписчик, финансируйте его с реальными XOR, и двигаться только
   те же проверенные операции, что и Mainnet.

## 1. Понимайте, что вы делаете {#_1-understand-what-you-are-setting-up}

В SORA Nexus, пространство данных является частью сетевой полосы и каталога маршрутизации.
Клиент не создает новый общедоступный пространство данных только путем изменения
`client.toml`. Настройка клиента делает две вещи:

1. указывает клиента справа Torii конечная точка
2. выбирает контекст маршрутизации домена и пространства данных для своего канонического учета

`AccountId` всегда каноническая и бездоменная. `[account].domain` стоимость в
`client.toml` предоставляет контекст маршрутизации и псевдоним; он не становится частью
Для большинства заявок, начинайте с общественности
`universal` пространство данных. Контекст домена использует `domain.dataspace` формы, для
Пример:

```text
wonderland.universal
```

Если вам нужен новый пространство данных организации, подготовьте каталог и маршрутизацию
Предложение вместо того, чтобы пытаться зарегистрировать его с обычного клиента.
Посмотрите. [Создание нового пространства данных](#_8-provision-a-new-dataspace) Ниже.

## 2. Проверяйте общественность Torii Окончательный пункт {#_2-check-the-public-torii-endpoint}

Проверьте, что целевая конечная точка работает до конфигурации подписи.

Для Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Для Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Проверьте пространство данных и вид полосы, выявленные узлом:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Используйте ту же команду с `https://minamoto.sora.org/status` для Mainnet.

## Taira MCP для агентов {#taira-mcp-for-agents}

Taira также выявляет Torii- нативный Контекстный протокол (MCP) моста для
Используйте его, когда агент нуждается в живых чтениях тестовой сети.
диагностики, или тщательно пересмотренные репетиции письма без создания привычки
Torii Клиент первым.

| Настройка | Значение |
| --- | --- |
| MCP конечная точка | `https://taira.sora.org/v1/mcp` |
| Корень сети | `https://taira.sora.org` |
| Целевое применение | Taira чтения на тестовых сетях и репетиции по написанию, финансируемые из крана |
| Эквивалент производства | Не указывайте эту запись на Minamoto если нет основной сети MCP контроль конечных пунктов и выпускных пусков явно одобрены |

Проверьте метаданные моста перед добавлением подписи:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Конфигурировать URL как пользователь-местный MCP сервер в рабочее время агента.
агент обязательства MCP конфигурация, API токены, переданные заголовки авторов, `authority`, или
`private_key` ценности в данном репо документа или репо приложения.

Агент просит правила, которые хорошо работают с Taira:

- Откройте инструменты из MCP сервер, прежде чем позвонить им; повторно обнаружить, если
  отчеты сервера `listChanged`.
- Предпочтительнее - выбранные . `iroha.*` инструменты в сырье `torii.*` инструменты.
- Начните читать только: проверять статус, счета, активы, псевдонимы, блоки,
  состояние управления, а также состояние транзакции до предложения письма.
- Требуется четкое человеческое обучение перед живыми мутациями сети тестирования.
  предварительно подписанные конверты сделок, использование `iroha.transactions.submit_and_wait`
  так что агент ждет результата вместо того, чтобы просто подавать.
- Подводя итоги хэши транзакции, окончательного состояния и ошибок в проверке сервера
  Ответ агента.

### Развитие рабочего процесса с агентами {#development-workflow-with-agents}

Используйте агентов в качестве помощников в развитии Iroha клиенты, строители транзакций,
Диагностические скрипты и тест-сети.
он может проверять код, читать Taira государство, предлагают изменения и проводят местные испытания;
Но он не должен мутировать живую сеть, пока человек не одобрит точную
Операция.

Практический рабочий процесс:

1. Попроси агента проверить соответствующие документы. SDK код, CLI командование, или MCP
   схема инструмента до написания кода.
2. Попросите агента написать самый маленький клиентский путь сначала: проверка состояния, учетная запись
   поиск, или разрешение, или поиск баланса.
3. Добавьте код для создания транзакций только после того, как звонки для чтения работают против
   Taira.
4. Не допускать тестов в живых сетях, например, за спиной `TAIRA_LIVE=1`, так что
   обычный единичный тест-пробег никогда не тратит средства на тестирование сети или зависит от сети
   доступность.
5. Требуйте от агента сообщения о сетевом корне, цепочке, учетной записи органа,
   резюме инструкции, актив сбора и ожидаемые изменения состояния до подачи
   любую транзакцию.
6. Проверьте генерируемый код для тайного обращения, повторной попытки поведения, бессильности и
   обращение с отказом до продвижения его на CI или постоянные рабочие процессы.

Полезный только для чтения MCP инструменты для разработки включают поиск активов счета,
alias разрешение, поиск блоков, поиск транзакций, списки транзакций и
Проверка состояния трубопровода.
подписанный полезный груз.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Транзакционный рабочий процесс через агентов {#transaction-workflow-through-agents}

Сборник MCP bridge может представить подписанный документ Iroha сделки, но она не устраняет
нормальных требований к сделке.
полномочия, разрешения, финансирование сборов, цепочка ID, метаданные и подпись.

Для сырья Iroha сделки, создать и подписывать конверт с
SDK или CLI Сначала, затем дайте агенту только каноническую подписанную транзакцию
байты, кодируемые как `body_base64`. Агент может представить конверт с
`iroha.transactions.submit_and_wait`, или подать с
`iroha.transactions.submit` и опроса с `iroha.transactions.wait`.

Не вставляйте частные ключи в запрос агента.
транзакция, укажите на местный код, который загружает секреты из пользовательского времени запуска
Относительно окружающей среды, цепочки ключей, аппаратного подписителя или проигнорированной конфигурации тестовых сетей.
Агент никогда не должен записывать ключевой материал в Markdown, приспособления, журналы, или
Принимает участие.

Перед тем как подать транзакцию, заставить агента произвести короткую транзакцию
План:

- `network`: Taira корень и цепочка тестовых сетей ID
- `authority`: счета, которое подписывает и оплачивает сборы
- `instructions`: регистрация, печать, сжигание, передача, метаданные, разрешение или
  обобщение приглашения на заключение контракта
- `fee asset`: актив, который будет взиматься с него Taira
- `preflight reads`: счет, баланс активов, разрешения, псевдоним или блок
  проведенные проверки
- `expected result`: состояние, которое должно быть видно после подтверждения
- `idempotency`: что произойдет, если одно и то же запрос будет опробован

После подачи, заставить агента ждать терминального состояния, затем проверить
изменение состояния с прочитанным запросом.

- транзакционный хэш
- терминальный статус, например: `Committed`, `Applied`, `Rejected`, или `Expired`
- детали блока или исследователя, когда они доступны
- результаты прочтения проверки
- сообщение об отказе и если неудача выглядит как разрешения, сборы,
  валидация, устаревшее состояние или доступность конечных пунктов

Пример охраняемой пропорции:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Когда подписанная конверт уже подготовлена:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Лечить Taira MCP как общественная контрольная поверхность испытательной сети. Taira ключи, тест-сеть XOR,
банковские счета, а также канарные подписи являются одноразовыми и должны оставаться отдельными от
Minamoto ключи и рабочие процессы выпуска продукции.

## Примеры игрушек, которые можно попробовать {#toy-examples-you-can-try-now}

Эти примеры для чтения только, если не указано.
Ключи и безопасно работать против обеих общественных сетей.

Сравните Taira тестовая сеть и Minamoto здоровье основного сети:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Перечислить полосы публичного пространства данных, которые были обнаружены Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Используйте то же самое командование против Minamoto при необходимости просмотра основной сети:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Сделайте маленькую Node.js Проверка состояния приборной панели, бота или развертывания
проверка:

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

Первой игрушкой для записи должна быть Taira Запрос на кране.
XOR и никогда не следует указывать на Minamoto.

## 3. Создать Taira Конфигурация клиента {#_3-create-a-taira-client-config}

Создать пара клавиш , если у вас уже нет:

```bash
kagami keys --algorithm ed25519 --json
```

Создать `taira.client.toml`:

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

Высочайший уровень `chain` Это точно. Taira цепочка транзакций ID. Сборник
`[account].profile = "taira"` настройка самостоятельно выбирает Taira I105
цепь-дискриминатор. ID не выбирает профиль счета.

Проверяйте проверку только для чтения:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Руководя общественностью Taira диагностика перед записанными тестами:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Финансирование Taira Считать через кранок, прежде чем вы запустите платное письмо.
Прямой поток крана в
[Получить тестнет XOR на Taira](#_4-get-testnet-xor-on-taira).

После принятия заявки на трубку и финансирования счета Taira
Канарный - это выборный тест на дым:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Канар отправляет подписанный пинг, ждет подтверждения и пишет:
конфигурация сигнала запуска `--write-config` предоставляется. Taira является общественным
testnet, так что насыщение очереди может сделать подписанный пинг неудачно даже когда
В самом деле крана работает. `taira doctor` сообщает о насыщенной очереди или
Канарные доходы `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, подождать и попробовать еще раз
рассматривать его как ошибку в конфигурации клиента.

Для испытаний без наблюдения для дыма, упаковать канар в ограниченную петлю повторного испытания:

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

Прекратите попытаться снова, если `iroha taira doctor` показывает тяжелые неудачи.
и отказы в приеме платы являются переходными условиями для публичной тестовой сети; DNS,
TLS, или `status = "fail"` Диагностики не так.

## Создать SORA Nexus Счет ID {#generate-a-sora-nexus-account-id}

А SORA Nexus счета ID является каноническим I105 адрес, полученный из
публичный ключ счета и префикс целевой сети.
`[account].domain` стоимость в клиенте TOML. Тот же код общественного ключа
различные IDs на Taira и Minamoto, и производители должны генерировать
отдельная клавиатура для Minamoto.

Создать или загрузить клавишу Ed25519 , которая будет управлять аккаунтом:

```bash
kagami keys --algorithm ed25519 --json
```

Преобразовать общественный ключ в Taira счета ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Преобразовать Minamoto общественный ключ с префиксом mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Используйте полученный счет ID где Nexus API или CLI Командование просит
канонический отчет ID, Например, Taira крана `account_id`, баланс
Запросы, строгие учетные поля или псевдонимы.
частный ключ в конфигурации клиента, и выберите ту же публичную сеть с
`[account].profile = "taira"` или `[account].profile = "minamoto"`.

Создание ID не создает само по себе финансируемого счета в цепочке.
Taira, Находясь на кране, вы можете создать и финансировать учетную запись для testnet.
Minamoto, использовать одобренный набор основных сетей или поток казначейства.

### Сохранение ключей и резервные копии {#key-storage-and-backup}

Расчет ID Соответствующий частный ключ,
пароль, семена и восстановительный материал должны храниться в секрете.

Используйте эти методы для SORA Nexus счета:

- Сохранить частные ключи в зашифрованном менеджере паролей, поддерживаемом оборудованием
  Ключевое хранилище или специальный сервис подписания.
  контролировать или оставлять производственные ключи в истории оболочки, журналах, чатах, билетах,
  или незашифрованные резервные копии.
- Используйте уникальную пароль высокой энтропии для каждого хранилища или подписи производства.
  Сохранить пароли в менеджере паролей или процессе раздельного хранения, а не в
  тот же файл или резервный пакет, что и зашифрованный частный ключ.
- Держи . Taira и Minamoto Ключи разделены. Taira ключи как одноразовые
  материалы для испытательных сетей и Minamoto ключи в качестве органа по производственным фондам.
- Запись частного ключа, публичного ключа, счета ID, профиль счета и любые
  Примечания о восстановлении или хранении счета, необходимые для восстановления подписанта.
  Ключ без сетевого контекста легко злоупотреблять во время восстановления.
- Сохраняйте по крайней мере одну зашифрованную резервную копию вне интернета и одну географически
  Отдельная зашифрованная резервная запись для производственных сигналов.
  небольшая работа только для чтения до загрузки, в зависимости от резерва.
- Переключивать или заменять подписи, если частный ключ, пароль, резервные средства,
  или подписывающийся хозяин может быть подвергнут опасности.

Подробнее см.
[Сохранение криптографических ключей](/ru/guide/security/storing-cryptographic-keys.md)
и [Безопасность паролей](/ru/guide/security/password-security.md).

## 4. Получить тестнет XOR на Taira {#_4-get-testnet-xor-on-taira}

Используйте общественный кранок прямо.

1. Создать или загрузить подпись и вычислить ее каноническую Taira счета ID.
2. Приведи нынешнюю трубку.
3. Раскройте головоломку, если `difficulty_bits` больше `0`.
4. Подайте заявку на кранок.
5. Ждите, пока баланс счета или активов станет видимым перед отправкой
   платное письмо.

Преобразовать общественный ключ в Taira I105 счета ID ожидается от крана:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Принеси мне головоломку:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Наводка является общественным сервисом тестирования сети.
возвращения `502`, время, или другая ошибка на уровне шлюза, подождите и попробуйте снова
перед тем, как изменить ключи или конфигурацию клиента.

Ответ выглядит так:

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

Когда `difficulty_bits` является `0`, представлять только отчет ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Когда `difficulty_bits` больше `0`, решить головоломку и включить
высота якоря плюс нонсе:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

Алгоритм головоломки:

1. Создайте вызов как SHA-256 сверху:
   - байты `iroha:accounts:faucet:pow:v2`
   - в соответствии с UTF-8 счета ID
   - `anchor_height` как большая эндия `u64`
   - `anchor_block_hash_hex` декодируются в байтах
   - `challenge_salt_hex` декодируются как байты, при наличии
2. Попробуйте . `u64` ненси кодируются как величественные значения 8 байтов.
3. Для каждого нонса, выполните скрипт с:
   - пароль: 8-байтный нонс
   - Соль: 32-байтная задача
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - длина выхода: 32 байта
4. Победительский нонс - это первый перевал с по крайней мере `difficulty_bits`
   ведущие к нулю битов.

Ответ на трубку включает в себя финансируемый актив и хэширование транзакций в очереди:

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

Ответ в настоящее время возвращается с HTTP `202 Accepted`. Актив
определение ID Выше - Taira Начиная с 1 января 2004 г.
кран принял запрос, когда он возвращается `tx_hash_hex` и
`status: "QUEUED"`.

Затем опрос за финансируемый актив, прежде чем подать свой собственный платеж
транзакции:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Если требование к крану было принято, но счет или актив не видны
Тем не менее, транзакция все еще стоит за публичной проверкой очереди.
и перепробуйте читать, прежде чем отправлять письма.

Для прямого, готового к запуску API проверьте, сохраните это как `taira_faucet_claim.py`
и пройти Taira I105 счета ID:

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

Насос предназначен только для Taira Testnet средства. Не используйте testnet XOR, крана
счета, или Taira Канарные подписи Minamoto Поток.

## 5. Создать Minamoto Конфигурация клиента {#_5-create-a-minamoto-client-config}

Используйте отдельную клавишу для Minamoto. Не используйте повторно Taira Ключи для майннета.

Создать `minamoto.client.toml`:

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

Высочайший уровень `chain` является точным Nexus цепь майннет ID.
`[account].profile = "minamoto"` выбирает Minamoto I105 цепь
Дискриминатор; конечный пункт хостинга и цепочка ID Не подбирайте его косвенно.

Преобразовать Minamoto общественный ключ в его каноническом I105 счета ID с
префикс mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Проводить проверки только с учетом чтения, пока счет не будет обеспечен и финансирован
через потоки включения в сеть или управления:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Не используйте Taira крана или помощник для записи на каноне против Minamoto.

## 6. Фонд "А" Minamoto Счет с XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto с производством оплачиваются сборы XOR, и Minamoto не имеет общественности
Фонд конфигурированного счета через одобренное включение в основной сеть
или денежные переводы, или получение XOR из существующего финансируемого Minamoto
счета.

Проверьте канонический отчет ID и финансирование с проверками только для чтения
Подача письма. Minamoto XOR в качестве средств производства: репетировать
одна и та же операция на Taira в первую очередь, держать отдельные производственные ключи и не
Предположим, что транзакция в основной сети может быть восстановлена.

Taira XOR не может заплатить Minamoto счета.
не передается в Minamoto.

## 7. Работа в существующем пространстве данных {#_7-work-inside-an-existing-dataspace}

Используйте полностью квалифицированные доменные имена для объектов реестра , которые живут внутри
Например, домен проекта в публичном пространстве данных должен
использование:

```text
apps.universal
```

После того, как ваш аккаунт получит необходимые разрешения, создайте бесплатный секрет
`AliasSetupPlanRequestV1` намерение для домена и использование декларативного планировщика:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Для Minamoto, создать и утвердить отдельный план и намерение основной сети.
Они связаны с их цепочкой, властью, якорь живого государства и сроком, так что
Taira план не может быть продвинут или воспроизведен:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Идентификаторы учетных записей используют один и тот же суффикс пространства данных:

```text
alice@apps.universal
alice@universal
```

Строгие учетные поля по-прежнему используют канонические I105 счета IDs. Противопоказания
как человекочитаемые обязательства, которые решаются на канонический счет IDs.

## 8. Обеспечение нового пространства данных {#_8-provision-a-new-dataspace}

Новое пространство данных - это оператор и изменение управления. Torii
конечный пункт может направить трафик в конфигурированные пространства данных, но он будет отвергать
Неизвестные псевдонимы пространства данных.

Прежде чем подготовить изменение, запишите текущий живой каталог:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Для учетной записи оператора также проверьте положение проездной полосы:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Не продвигайте новый псевдоним , если не проходит полоса . ID, пространство данных ID, набор валидаторов,
пропускная способность, манифест, правила маршрутизации и эксплуатационный владелец
Обычный пользовательский аккаунт с необходимыми разрешениями может
приобрести домен и его SNS аренду внутри существующего пространства данных через
alias Planner; он не может безопасно добавить новый публичный пространство данных.

Для частного или организационного пространства данных подготовить изменение каталога с:

- уникальный псевдоним пространства данных и цифровой `id`
- соответствующий вход в полосу или существующее назначение полосы
- пространство данных `fault_tolerance`
- Правила маршрутизации для инструкций или объемов учетной записи, которые должны приземлиться
  Там
- манифест космического каталога или эквивалентные доказательства развертывания, когда
  выявления пространства данных UAID возможности
- одобрение управленческого характера для проверки, соответствия, урегулирования и мониторинга
  Политика

Проверяемый фрагмент конфигурации выглядит так:

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

Прием оператора должен включать в себя следующие ворота:

- `irohad --sora --config <config.toml> --trace-config` Передается на
  конфигурация узла решена
- генерируемый или пересмотренный манифест архивируется хэшами и подписями
- Проходят испытания дыма Taira прежде чем Minamoto продвижение
- после изменения `/status` каталог показывает предполагаемую полосу и пространство данных
- `iroha app nexus lane-report --summary` не сообщает о отсутствии, требуется
  проявления

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Продвигать одно и то же пространство данных к Minamoto только после Taira развертывание,
В результате испытаний дыма, мониторинга и доказательства управления завершены.

## Схожие страницы {#related-pages}

- [Установка Iroha 3](/ru/get-started/install-iroha.md)
- [Работать Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Стоимость спонсоров для частного пространства данных](/ru/get-started/private-dataspace-fee-sponsor.md)
- [Torii конечные точки](/ru/reference/torii-endpoints.md)
- [Ссылка на Бытие](/ru/reference/genesis.md)
