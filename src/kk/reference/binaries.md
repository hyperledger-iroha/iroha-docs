---
translation_locale: kk
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# -мен жұмыс істеу Iroha Екілік {#working-with-iroha-binaries}

The Iroha 3 оператордың жұмыс процесі үш негізгі екілік файлдың айналасында айналады:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) тең демонды басқару үшін
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) үшін CLI және оператор командалары
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) кілттерге, генезиске, жергілікті желілерге және профильдерге арналған

## Дереккөзден құрастыру {#build-from-source}

Жоғарғы жұмыс кеңістігінің түбірінен:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Шығарылым екілік файлдары содан кейін қол жетімді болады `target/release/`.

Пәрмен бетін тексеру үшін:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Репозиторийден тікелей іске қосыңыз {#run-directly-from-the-repository}

Егер сіз ғаламдық деңгейде ештеңе орнатқыңыз келмесе, пайдаланыңыз `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Кескін {#docker-image}

Жоғарғы жұмыс кеңістігі пайдаланады `kagami localnet` және `kagami docker` жасау
Docker Compose тексерілген кодқа сәйкес келетін файлдар.The `hyperledger/iroha:dev`
кескінді сол жасалған файлдармен пайдалануға болады.

іске қосыңыз CLI контейнерде:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Жүгіру Kagami контейнерде:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Бірдей іске қосу үшін алдымен жергілікті желіні жасаңыз және файлды құрастырыңыз:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Қандай екілік пәрменді қолдануым керек? {#which-binary-should-i-use}

- Қолдану `irohad` Сіз құрдастарды бастағанда немесе жұмыс істеп жатқанда.
- Қолдану `iroha` бухгалтерлік кітапты сұрау, транзакцияларды жіберу немесе оператордың соңғы нүктелерін тексеру қажет болғанда.
- Қолдану `kagami` кілттер, генезис манифесттері, профиль жинақтары немесе жергілікті желі активтері қажет болғанда.

## Kagemusha шығарылымы және шығарылымы {#kagemusha-release-publication-and-rollout}

Қагемуша V4 жариялау және белсендіру жекелеген қорғалатын шекараларды кесіп өтеді:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` болып табылады
  тек macOS, тек түбірлік баспагер.Ол бекітілгеннің түпнұсқалығын растайды Kagami екілік және
  нақты он алты файл кандидат, жоқ жариялайды
  `promotion-record-v4.norito` ауыстырусыз және тек табыс туралы хабарлайды
  нақты он жеті файлдан кейін шығарылымды растайды.
- `iroha offline kagemusha rollout-v4 create-expectations` қол қойылғанын тексереді
  брондау, төрт реттелген валидатор біліктілік мөрі, дәл
  бұрыннан рұқсат етілген транзакция сымы және бұрын сенімді аяқталатын якорь
  қол қойылған күтулерді ауыстырусыз жариялау.
- `iroha offline kagemusha rollout-v4 submit` айқын талап етеді
  `--write-authorized` келісім.Ол тұрақты түрде журналға жазып, дәлдігін қайта тексереді
  желіні жазу немесе қайталау алдында күту.Ан `Applied` күй емес
  жеткілікті: пәрмен сонымен қатар бекітілген блокты, түпкілікті мұрагерді тексереді
  тізбегі және толық авторизациялық транзакция сымы.
- `iroha offline kagemusha rollout-v4 finalize-receipt` дәл сол дәлелге
  бекітілген айғақты нақты жіберу журналы қайта тексерілгеннен кейін ғана
  жинайды, оған тәуелсіз түбіртек шығарушысымен қол қояды және канондық
  түбіртекті алмастырмай жариялайды.

Тексерілген Kagemusha өндірісіне дайындық жұмыс процесі тек тексеруге арналған.
Ол аутентификацияланған баспагерді шақырмайды, валидатор біліктілігін жариялайды
пломбалау, белсендіруді жіберу немесе түпкілікті түбіртек жасау.Сәтті жұмыс процесі
сондықтан жүгіру жарнаманы да, тікелей таратуды да дәлелдемейді.

Бұл пәрмендер тірі дәлелдерді алмастырмайды, жергілікті примитивтер.А
нақты физикалық қолданба аттестаттаусыз өндірісті шығару блокталған күйінде қалады
кандидат артефактілері, барлық төрт қорғалған хост мөрлері, орындау уақытын басқару және
кірістерге қол қою, тірі төрт тексеруші жіберу және түпкілікті дәлелдеу, және
канондық тиімді конфигурация проекциясы.Жеке кілттерді сақтаңыз,
аутентификация материалы және қорғалғандағы жарнамаға қатысты идентификаторлар
орындау уақытын сақтау;оларды көзден басқарылатын құжаттамаға көшірмеңіз немесе
оператор билеттері.
