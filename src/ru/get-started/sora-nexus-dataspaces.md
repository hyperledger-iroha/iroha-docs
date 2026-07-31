---
translation_locale: ru
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Построение на SORA 3: Taira и Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 - это трасса общественного развертывания, ориентированная на приложение, построенная на Iroha 3 и SORA Nexus. Сначала построить и репетировать на Taira, а затем переместить ту же форму клиента в Minamoto только тогда, когда у вас есть отдельные ключи магистральной сети, реальные XOR за сборы и разрешение на производство.

В этом руководстве показано, как настроить клиент Iroha для общественных сетей SORA 3:

- Пробная сетка Taira на `https://taira.sora.org`
- Minamoto основная сеть на `https://minamoto.sora.org`

Использование Taira для тестов интеграции, пишущих канарей, финансируемых из трубки, и репетиций по развертыванию. Minamoto В связи с тем, что в настоящее время существуют новые технологии, они могут быть использованы только для работы в производственной сети. XOR:

- Taira использует испытательную сеть XOR из общего крана.
- Minamoto использует реальный XOR. Нет крана Minamoto.

## Путь строителя {#builder-path}

|Шаг |Taira Тест-нет |Minamoto Майннет|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Начните с чтения состояния сети |Запрос `/status` без ключей |Запрос `/status` без ключей |
|Выберите пространство данных |Используйте общественный `universal`, если только ваше приложение не нуждается в управляемом полосе |Использовать одно и то же пространство данных только после одобрения mainnet |
|Получить доход .|Используйте общественный Taira трубку |Получить XOR с финансируемого счета Minamoto или утвержденного потока казначейства |
|Тест пишет |Использование испытания, финансируемого из крана XOR |Не используйте тестовые инструменты; пишет расходы на реальные XOR |
|Продвинуть |Постарайтесь перепробовать логику, мониторинг и обработку подписи |Используйте отдельные ключи, управление финансированием и выпусками |

Практический поток:

1. Создать клиент против Taira и использовать общественное пространство данных `universal`.
2. Добавьте подпись и финансируйте ее на кране Taira.
3. Используйте свою логику приложения против Taira до тех пор, пока ошибки не будут скучными и наблюдаемыми.
4. Создайте отдельный Minamoto подписитель, финансируйте его с реальным XOR и переместите только те же проверенные операции в mainnet.

## 1. Подумайте о том, что вы делаете. {#_1-understand-what-you-are-setting-up}

В SORA Nexus пространство данных является частью каталога сетевой полосы и маршрутизации. Клиент не создает новое общественное пространство данных, просто изменив `client.toml`.

1. указывает клиента на правой конечной точке Torii
2. подбирает контекст маршрутизации домена и пространства данных для своего канонического учета

`AccountId` всегда является каноническим и бездоменным. Значение `[account].domain` в `client.toml` обеспечивает контекст маршрутизации и псевдонима; оно не становится частью идентификации учетной записи. Для большинства приложений, начинайте с общественного пространства данных `universal`. Контекст домена использует форму `domain.dataspace`, например:

```text
wonderland.universal
```

Если вам нужен новый организационный пространство данных, приготовьте каталог и предложение маршрутизации вместо того, чтобы пытаться зарегистрировать его из обычной учетной записи клиента. см. [Provision a New Dataspace](#_8-provision-a-new-dataspace) ниже.

## 2. Проверьте конечный пункт общественности Torii {#_2-check-the-public-torii-endpoint}

Проверьте, что целевая конечная точка включена перед конфигурацией подписи.

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

Используйте ту же команду, что и `https://minamoto.sora.org/status` для основной сети.

## Taira MCP для агентов {#taira-mcp-for-agents}

Taira также раскрывает Torii-нативный Модель Контекст Протокол (MCP) мост для агентов запуска. Используйте его, когда агент нуждается в живых чтениях тестовой сети, скриптовая диагностика или тщательно пересмотренные репетиции письма без создания настраиваемого клиента Torii сначала.

|Настройка |Значение |
| --- | --- |
|MCP конечный пункт |`https://taira.sora.org/v1/mcp` |
|Корень сети |`https://taira.sora.org` |
|Целевое применение |Taira тестирование чтения сети и репетиции письма, финансируемые из крана |
|Эквивалент производства |Не указывайте данную запись на Minamoto, если не было явно утверждены конечная точка основного сети MCP и контроль выпуска. |

Проверяйте метаданные моста перед добавлением подписи:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Конфигурировать URL в качестве локального сервера MCP для пользователя во время запуска агента. Не включайте значения конфигурации агента MCP, токенов API, переданных заголовков авторов, `authority` или `private_key` в данный реподокументальный документ или репо приложений.

Правилы агента, которые хорошо работают с Taira:

- Открыть инструменты с сервера MCP перед вызовом их; повторно обнаружить, если сервер сообщает `listChanged`.
- Предпочтительнее сортированные `iroha.` инструменты, чем сырые `torii.` инструменты.
- Начните с чтения только: проверьте статус, аккаунты, активы, псевдонимы, блоки, состояние управления и состояние транзакции перед предложением записей.
- Для предварительно подписанных конвертов транзакций используйте `iroha.transactions.submit_and_wait`, чтобы агент ждал результата, а не только подавал.
- Подводите итоги хеш-транзакций, окончательного состояния и ошибок в проверке сервера в ответе агента.

### Процесс разработки с агентами {#development-workflow-with-agents}

Используйте агентов в качестве помощников по разработке для клиентов Iroha, создателей транзакций, диагностических скриптов и тестовых сетей. Сохраняйте ограниченный авторитет агента: Он может проверять код, читать состояние Taira, предлагать изменения и выполнять локальные тесты, но он не должен мутировать живую сеть до тех пор, пока человек не одобрит точную операцию.

Практический рабочий процесс заключается в:

1. Просите агента осмотреть соответствующие документы, код SDK, команду CLI или схему инструмента MCP до написания кода.
2. Сначала попросите агента написать самый маленький путь клиента: проверка состояния, поиск учетной записи, разрешение псевдонима или поиск баланса.
3. Добавьте код по созданию транзакций только после того, как звонки для чтения будут работать против Taira.
4. Сохраняйте опт-ин на тесты в живой сети, например за `TAIRA_LIVE=1`, так что обычная единичная проверка никогда не тратит средства для тестирования сети или зависит от доступности сети.
5. Требуйте от агента сообщить о корне сети, цепочке, учетной записи органа, резюме инструкций, активе сборов и ожидаемом изменении состояния до представления сделки.
6. Проверьте генерируемый код для секретного обработки, повторного поведения, идемпотенции и обработки отказов перед продвижением его в CI или основные рабочие процессы сети.

Полезные инструменты для разработки MCP включают поиск активов учетной записи, разрешение псевдонимов, поиск блоков, поиск транзакций, списки транзакций и проверки состояния трубопровода. Используйте их для создания доверия перед отправкой подписанной полезной нагрузки.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Рабочий поток транзакций через агентов {#transaction-workflow-through-agents}

В настоящее время MCP bridge может представить подписанный документ Iroha сделки, но это не исключает нормальных требований к сделке. Транзакции все еще нужны правильный авторитет, разрешения, финансирование сборов, цепочка ID, метаданные, и подпись.

Для сырья Iroha транзакции, создать и подписывать конверт с SDK или CLI Сначала, затем дайте агенту только канонические подписанные биты транзакции кодируются как: `body_base64`. Агент может представить конверт с `iroha.transactions.submit_and_wait`, или представить с `iroha.transactions.submit` и опроса с `iroha.transactions.wait`.

Не вставляйте частные ключи в запрос агента. Если агент должен создать транзакцию, укажите ее на локальный код, который загружает секреты из среды работы пользователя, цепочки ключей, аппаратного подписи или проигнорированный файл конфигурации тестирования сети. Агент никогда не должен записывать ключевой материал в Markdown, фиксации, журналы, или обязательства.

Прежде чем подать транзакцию, попросите агента составить короткий план транзакции:

- `network`: Taira корень и цепочка тестовых сетей ID
- `authority`: учетная запись, подписывающая и уплачивающая сборы
- `instructions`: реестр, банкнота, сжигание, передача, метаданные, разрешение или краткое описание вызова контракта
- `fee asset`: актив, который будет взиматься с Taira
- `preflight reads`: уже проведенные счета, баланс активов, разрешения, псевдоним или блок-контроли
- `expected result`: состояние, которое должно быть видно после подтверждения
- `idempotency`: что произойдёт, если одно и то же запрос будет рассмотрен повторно

После подачи, заставить агента ждать состояния терминала, а затем проверить изменение состояния с помощью запроса чтения.

- транзакционный хэш
- статус терминала, такой как `Committed`, `Applied`, `Rejected` или `Expired`
- детали блока или исследователя, когда они доступны
- результаты прочтения проверки
- сообщение об отказе и выглядит ли ошибка как разрешения, сборы, проверка, устаревшее состояние или доступность конечных пунктов

Пример охраняемой пропорции:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Когда подписанный конверт уже подготовлен:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

С Taira MCP следует относиться как к общественной контрольной поверхности тестируемой сети. Ключи Taira, тест-сеть XOR, учетные записи на кране и канарические сигналы являются одноразовыми и должны оставаться отдельными от ключей Minamoto и рабочих процессов выпуска продукции.

## Примеры игрушек, которые вы можете попробовать {#toy-examples-you-can-try-now}

Эти примеры доступны только для чтения, если не указано. Они работают до того, как вы генерируете ключи и безопасны для использования в обеих общественных сетях.

Сравните состояние тестовой сети Taira и основных сетей Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Перечислить полосы общедоступного пространства данных, выявленные в Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Используйте такую же команду против Minamoto, когда вам нужен просмотр основного сети:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Создайте крошечный Node.js зонд состояния для панели управления, бота или проверки развертывания:

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

Первой игрушкой с письменной стороны должна быть Taira Запрос на кране. XOR и никогда не следует указывать на Minamoto.

## 3. Создать конфигурацию клиента Taira {#_3-create-a-taira-client-config}

Создать пара ключей, если у вас уже нет:

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

На самом высоком уровне `chain` Это точно. Taira цепочка сделок ID. В настоящее время `[account].profile = "taira"` настройка самостоятельно выбирает Taira I105 Дискриминатор цепочки. ID не выбирает профиль счета.

Провести проверку только для чтения:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Провести публичную диагностику Taira до написания тестов:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Финансирование Taira Прямой поток крана находится в строке [Получить тестнет XOR на Taira](#_4-get-testnet-xor-on-taira).

После того, как заявление на трубку будет принято и счет будет финансирован, канар Taira является дополнительным испытанием дыма для записи:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Канар отправляет подписанный пинг, ожидает подтверждения и записывает конфигурацию подписчика при запуске. `--write-config` предоставляется. Taira является публичной тестовой сетью, так что насыщение очереди может заставить подписанный пинг потерпеть неудачу даже когда трубка сама работает. Если `taira doctor` сообщает о насыщенной очереди или канарных доходах `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, подождите и попробуйте еще раз, прежде чем рассматривать его как ошибку в конфигурации клиента.

Для неконтролируемых испытаний дыма, завязать канарию в ограниченной петле повторного испытания:

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

Прекратите повторные попытки, если `iroha taira doctor` показывает тяжелые неудачи. Насыщение очереди и отказ от ввода платы являются переходными условиями для общественных тестовых сетей; диагностики DNS, TLS или `status = "fail"` не являются.

## Создать учетную запись SORA Nexus ID {#generate-a-sora-nexus-account-id}

А . SORA Nexus счета ID является каноническим I105 Адрес, полученный из публичного ключа счета и префикса целевой сети. `[account].domain` стоимость в клиенте TOML. Один и тот же код общего ключа для разных IDs на Taira и Minamoto, и пользователи производства должны создать отдельную клавишу для Minamoto.

Создать или загрузить клавишу Ed25519 , которая будет управлять аккаунтом:

```bash
kagami keys --algorithm ed25519 --json
```

Преобразовать государственный ключ на счет Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Преобразовать общественный ключ Minamoto с предварительным префиксом "mainnet":

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Используйте полученную учетную запись ID всякий раз, когда команда Nexus API или CLI требует канонической учетной записи ID, например, крана Taira `account_id`, запросов на баланс, строгих полей учетной записи или обязательств под псевдонимом . Сохраняйте соответствующий частный ключ в конфигурации клиента и выберите такую же общественную сеть с `[account].profile = "taira"` или `[account].profile = "minamoto"`.

Создание ID не создает само по себе финансируемого счета на цепочке. Taira, в кране может создать и финансировать счет для testnet пишет. на Minamoto, использовать одобренное включение в основную сеть или поток казначейства.

### Сохранение ключей и резервное копирование {#key-storage-and-backup}

Расчет ID Соответствующий частный ключ, пароль, семена и восстановительный материал должны храниться в секрете.

Используйте эти методы для счетов SORA Nexus:

- Сохраняйте частные ключи в зашифрованном менеджере паролей, аппаратно поддерживаемом клавиатуре или специальном сервисе подписания.
- Используйте уникальную пароль высокой энтропии для каждого хранилища или подписывающегося продукта.
- Следует держать ключи Taira и Minamoto отдельно, а ключи Taira рассматривать как одноразовый материал для испытательных сетей и ключи Minamoto - как орган по производству средств.
- Запись частного ключа, публичного ключа, учетной записи ID, профиля счета и любых записей о восстановлении или хранении счета, необходимых для восстановления подписителя.
- Сохраняйте, по крайней мере, одну зашифрованную резервную копию в автоном режиме и одну географически отдельную зашифренную резервную копию для подписи для производства.
- Переключите или замените подписи, если был обнаружен личный ключ, пароль, резервный медиа или подпися хостинг.

Более подробно см. [Сохранение криптографических ключей](/ru/guide/security/storing-cryptographic-keys.md) и [Подтверждение безопасности паролей](/ru/guide/security/password-security.md).

## 4. Получить Testnet XOR на Taira {#_4-get-testnet-xor-on-taira}

Используйте общественный кранок прямо.

1. Создание или загрузка подписи и расчет ее канонической учетной записи Taira ID.
2. Приведи нынешнюю трубку.
3. Решение головоломки, если `difficulty_bits` больше `0`.
4. Подайте заявку на трубку.
5. Подождите, пока баланс счета или активов станет видимым, прежде чем отправить платное письмо.

Перевести общественный ключ на счет Taira I105 ID, ожидаемый краном:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Принеси мне головоломку:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Если головоломка или конечная точка претензии возвращает `502`, перерыв времени или другую ошибку на уровне шлюза, подождите и попробуйте снова, прежде чем изменить ключи или конфигурацию клиента.

Ответ имеет следующую форму:

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

Если `difficulty_bits` является `0`, представьте только счет ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Если `difficulty_bits` превышает `0`, решить головоломку и включить высоту якоря плюс нонс:

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

1. Создать задачу как SHA-256 над:
   - байты `iroha:accounts:faucet:pow:v2`
   - счет UTF-8 ID
   - `anchor_height` как большая эндия `u64`
   - `anchor_block_hash_hex` расшифрованные в байтах
   - `challenge_salt_hex` декодируются в байтах, если они присутствуют
2. Попробуйте `u64` nonces кодируются как величайшие 8-байтные значения.
3. Для каждой нонси, выполните скрипт с:
   - пароль: 8-байтный нонс
   - соль: 32-байтовая задача
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - длина выхода: 32 байта
4. Преимущественный нонс - это первый дигест с по меньшей мере `difficulty_bits` ведущим нулевым битом.

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

Ответ в настоящее время возвращается с HTTP `202 Accepted`. Определение активов ID Выше - Taira Файловый актив, финансируемый общественным краном. `tx_hash_hex` и `status: "QUEUED"`.

Затем проанализируйте финансируемые активы перед тем, как представить свои собственные платежные операции:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Если требование к крану было принято, но учетная запись или актив еще не видны, транзакция по-прежнему находится за обработкой очереди в публичной тестовой сети. Подождите и попробуйте прочитать до отправки писем.

Для готовой к запуску прямой проверки API запишите ее в `taira_faucet_claim.py` и передайте на счет Taira I105 ID:

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

Кран предназначен только для средств тестовой сети Taira. Не используйте тестную сеть XOR, счета кран или канарные сигналы Taira в потоках Minamoto.

## 5. Создать конфигурацию клиента Minamoto {#_5-create-a-minamoto-client-config}

Используйте отдельную клавишу для Minamoto. Не используйте клавиши Taira в основной сети.

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

На самом высоком уровне `chain` является точным Nexus цепь майннет ID. `[account].profile = "minamoto"` выбирает Minamoto I105 Дискриминатор цепи; имя хостинга конечного пункта и цепь ID Не выбирайте его подразумеваемо.

Преобразовать общественный ключ Minamoto в его канонический счет I105 ID с префиксом "mainnet":

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Используйте только проверки с точки зрения чтения до тех пор, пока счет не будет обеспечен и профинансирован через потоки включения в сеть или управления:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Не используйте Taira кран или помощник для записывания с помощью Minamoto.

## 6. Финансирование счета Minamoto на XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto Плата оплачивается с производством XOR, и Minamoto Фонд конфигурированного счета через одобренный майннет-онбординг или казначейский перевод, либо получать XOR из существующего финансируемого Minamoto счета.

Проверяйте канонический отчет ID и финансирование с помощью чеков только для чтения перед подачей письма. Minamoto XOR в качестве средств производства: репетировать ту же операцию на Taira Во-первых, сохраняйте отдельные производственные ключи и не предполагайте, что транзакция с магистральной сетью может быть перезагружена.

Taira XOR не может заплатить Minamoto сборы: балансы тестовой сети и требования к крану не перечисляются на Minamoto.

## 7. Работа внутри существующего пространства данных {#_7-work-inside-an-existing-dataspace}

Используйте полностью квалифицированные доменные имена для объектов реестра, которые живут внутри пространства данных. Например, домен проекта в публичном пространстве данных должен использовать:

```text
apps.universal
```

После того, как ваша учетная запись получит необходимые разрешения, создавайте секретное намерение `AliasSetupPlanRequestV1` для домена и используйте декларативный планировщик:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Для Minamoto создать и утвердить отдельный план и намерение основной сети. Планы связаны с их цепочкой, полномочиями, якорным режимом жизни и сроком действия, поэтому план Taira не может быть продвинут или воспроизведен:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Идентификаторы учетных записей используют один и тот же суфикс пространства данных:

```text
alice@apps.universal
alice@universal
```

В строгих учетных полях все еще используются канонические I105 счета IDs. Обращайтесь с псевдонимами как с человекочитаемыми связями, которые решаются в каноническом отношении. IDs.

## 8. Предоставление нового пространства данных {#_8-provision-a-new-dataspace}

Новое пространство данных - это изменение оператора и управления. общественный конечный пункт Torii может направить трафик на конфигурированные пространства данных, но он отвергнет неизвестные прозвища пространства данных.

Прежде чем подготовить изменение, запишите текущий живой каталог:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Для аккаунта оператора также проверьте положение проездной полосы:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Не продвигайте новые псевдонимы, если полоса ID, пространство данных ID, набор валидатора, допустимость ошибок, манифест, правила маршрутизации и эксплуатационный владелец не были пересмотрены вместе. Нормальная учетная запись пользователя с необходимыми разрешениями может приобрести домен и арендовать его SNS внутри существующего пространства данных через псевдопланировщик; она не может безопасно добавлять новый общественный пространство данных.

Для частного или организационного пространства данных подготовить изменение каталога с:

- уникальный псевдоним пространства данных и цифровая `id`
- соответствующий вход в полосу или существующее присвоение полосы;
- пространство данных `fault_tolerance`
- правила маршрутизации для инструкций или объемов учетной записи, которые должны приземлиться там
- манифест Space Directory или эквивалентные доказательства запуска, когда пространство данных раскрывает возможности UAID
- одобрение управленческого характера для политики проверки, соответствия, расчетов и мониторинга;

Пересматриваемый фрагмент конфигурации выглядит так:

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

- `irohad --sora --config <config.toml> --trace-config` передает конфигурацию решенного узла.
- генерируемый или пересмотренный манифест архивируется хэшами и подписями.
- прохождение испытаний дыма на Taira до любого продвижения Minamoto
- каталог `/status` после изменения показывает предполагаемую полосу и пространство данных
- `iroha app nexus lane-report --summary` не сообщает о отсутствии требуемых манифестов.

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Продвижение одного и того же пространства данных до Minamoto только после завершения развертывания Taira, испытаний дыма, мониторинга и доказательств управления.

## Сюжетные страницы {#related-pages}

- [установка Iroha 3](/ru/get-started/install-iroha.md)
- [Управление Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Сборы по спонсорству для частного пространства данных](/ru/get-started/private-dataspace-fee-sponsor.md)
- [Конечные точки Torii](/ru/reference/torii-endpoints.md)
- [Ссылка на Бытие](/ru/reference/genesis.md)
