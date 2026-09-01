---
translation_locale: kk
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Шоттар және Болжамдар {#accounts-and-aliases}

## Нәтиже {#outcome}

Доменсіз бір хаттама стандартты I105 есептік жазба идентификаторларымен және `treasury@payments.universal` сияқты жеке байланған адамға түсінікті лақап аттармен қауіпсіз жұмыс істеңіз. Сіз Taira есептік жазбаларды тексеріп, өзіңіздің бір хаттама стандартты идентификаторыңызды шығарып, маршруттау контекстін жеке сәйкестендірумен шатастырмай лақап аттарды шешесіз.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқасы, және қазіргі `iroha` CLI.
- [Taira құрылғысына қосылу](./connect-to-taira.md) сайтындағы өз есепшотыңызды тексергенде `taira.client.toml` пайда болады.
- Taira тест желісі қаржыландыру қызметі немесе желінің басқарылатын тіркелу жолы арқылы есептік жазба дайындалып, есептік жазбаға қатысты оқу әрекетінің сәтті болуын күту керек.

## Қадамдар {#steps}

### 1. Taira жүйесінде бір протокол-стандарт есепшоттарын тексеру {#_1-inspect-canonical-accounts-on-taira}

Қоғамдық есептік жазба тізімі әрқашан бір протокол-стандартты I105 идентификаторларын қайтарады. Негізгі алиас таңдамалы болып табылады және жеке есеп беріледі.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id`-ден алынған ID қатаң есептік жазба өрістері үшін жарамды. Оған домен қоспаңыз. `.primary_alias`-ден алынғанл есімшеше пайдаланушыға көрінетін іздеу кілті болып табылады, басқа бір протокол-стандартталған идентификатор емес.

### 2. Сіздің Taira I105 ID-ні шығарыңыз және қалыпқа келтіріңіз {#_2-derive-and-normalize-your-taira-i105-id}

Жергілікті конфигурациядан тек ашық кілтті оқыңыз. Бірдей ашық кілт әртүрлі ашық блокчейн желі профильдері үшін әртүрлі кодталады, сол себепті `taira` мәнін нақты таңдаңыз.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Қалыпты мән `TAIRA_ACCOUNT_ID` мәніне бірдей болу керек. TOML файлындағы `[account].domain` баптауы `wonderland.universal` болуы мүмкін, бірақ бұл мән тек маршрутизация мен алиас контекстіне әсер етеді.

### 3. Есепшотты және оның активтерін оқыңыз {#_3-read-the-account-and-its-assets}

Есептік жазба дайын болғаннан кейін, оны тікелей сұраңыз және шектелген активтер бетін тізімдеңіз. URL-мәнін жолда қолданбас бұрын I105 мәнін кодтаңыз.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Есептік жазбаға тіркелген лақап аттарды қараңыз {#_4-look-up-aliases-bound-to-the-account}

Кері шешуші бір дәл бір протокол-стандартты есептік жазба идентификаторын қабылдайды. Қоғамдық деректер кеңістігінің жолдарын сұраныс-қолтаңба тақырыптарысыз оқу мүмкін; шектеулі деректер кеңістіктері рұқсат етілген қол қойылған сұранысты талап етеді.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` жарамды: есептік жазбаға лақап ат қажет емес. Байланыс бар болса, оның дәл толық білікті лақап атын анықтап, қайтарылған есептік жазба идентификаторымен салыстырыңыз:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Рұқсат шегі

Taira тест желісін қаржыландыру қызметі өзінің талапкер шотын қамтамасыз ете алады, бірақ бұл жалпы шот тіркеу немесе лақап атты басқару уәкілетті субъектіні бермейді. Басқа шотты тіркеу үшін белсенді валидатордың астында `CanRegisterAccount` қажет. Есептік жазба лақап аттары әдетте белсенді SNS жалға алу мен тиісті лақап ат құқықтарын талап етеді. Басқарылатын тіркеу/лақап ат жоспарлаушысын пайдаланыңыз немесе жасалған жергілікті желінің тіркелуін жаттығыңыз.

:::

Жергілікті желіде, қауіпсіз криптографиялық қолтаңба кілтін қамтамасыз ету кезеңі жаңа бір протокол стандартты `NEW_ACCOUNT_ID` экспорттағаннан кейін, тіркеу беті мынадай болады:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Сәйкес жеке кілтті құжаттама немесе қосымша репозиторийінен тыс жерде жасаңыз және сақтаңыз. Басқару кілті ұрылған немесе жойылған ID тіркелгенде, қолданылмайтын есептік жазба пайда болады.

## Растау {#verify}

Конфигурациялық ашық кілттің, I105 кодтаудың және лақап аттың байланысының барлығы бір ғана протокол-стандартты есептік жазба идентификаторы бойынша біріктелетінін дәлелдеңіз:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Бір протокол-стандартты есеп шот идентификаторларын сақтау. Қолтаңбалар, рұқсаттар және транзакция нұсқауларында бір протокол-стандартты идентификаторларды пайдалану. Қосымша шекарасында лақап атын шешу. Операцияда қолданылған бір протокол-стандартты есеп шот идентификаторын сақтау.

## Ақауларды жою {#troubleshooting}

- Парс немесе префикс қатесі әдетте мекенжай басқа желі профилі үшін кодталғанын білдіреді. `--profile taira` арқылы қалыпқа келтіріп, сәйкессіздіктерді қабылдамаңыз.
- Тесті желідегі қаржыландыру қызметінен `202` кейін есепшот `404` тарату кешігуі мүмкін. Жазуды жібермес бұрын есепшотты немесе қаржыландырылған активті тексеріңіз.
- `total: 0` кері шешушіден көрінетін лақап атауы жоқ дегенді білдіреді; бұл есептік жазба іздеу қатесі емес.
- `401` немесе `403` жалған ат бағытынан шектеулі деректер кеңістігін немесе жеткілікті дәл шешім рұқсаттарының болмауын көрсетеді. Альтернативті ретінде кең префиксті іздеуді қолданбаңыз.
- Оқыуға болатын `name@domain.dataspace` мәні бір протокол-стандартты I105 идентификаторы қажет болатын барлық жерде қабылданбайды. Алдымен оны шешіңіз.
- Егер жергілікті есептік жазбаны тіркеу сәтті болса, бірақ Taira оны қабылдамаса, айырмашылық – авторизацияда. `CanRegisterAccount` алыңыз; тексеруден өту үшін есептік жазба идентификаторын өзгертпеңіз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [бекітілген көз-код нұсқасындағы бір протокол-стандарт аккаунт мекенжайын іске асыру](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Есептік жазба және лақап атау Torii бекітілген бастапқы кодтың нұсқасында тестілеу](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Шоттар](/kk/blockchain/accounts.md)
- [Деректер үлгісінің ауыстырымдары](/kk/blockchain/data-model.md#aliases)
- [Атаулау дәстүрлері](/kk/reference/naming.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
