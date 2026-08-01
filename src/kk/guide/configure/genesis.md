---
translation_locale: kk
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жаратылыс {#genesis}

Жаратылыс бастапқы тізбек күйін анықтайды. редакцияланатын көз JSON манифесті болып табылады, ал Iroha 3 түйіні қолтаңбаланған Norito транзакция файлын пайдаланады.

::: details Әдеттегі генезистік манифест

<<< @/snippets/genesis.json

:::

## Файлдар {#files}

`defaults/genesis.json`. Kagami-дан құрылған желілер шығыс каталогына өздерінің манифестерін және қол қойылған транзакцияларын жазады:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Аталған каталогта пайда болған `README.md` таңдалған профиль үшін нақты файлдарды және іске қосу командаларын тіркейді.

## Жастар арасындағы бейімделу {#peer-configuration}

`config.toml` `[genesis]` бөлімінде қол қойылған генезис операциясы бойынша әріптестер:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Желідегі барлық әріптестер қол қойылған генезис транзакциясы мен генезистің қоғамдық кілті туралы келісуі тиіс.

## Жаратылыс жазбасына қол қою {#signing-genesis}

Егер сіз манифестті қолмен өңдесеңіз, оны қолтаңбалап, қолтаңбалауды бастаңыз:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPoS немесе Nexus профильдері үшін тупология мен BLS генерируші профил талап ететін иелік дәлелдемелерін келтіріңіз. Kagami `localnet`, `wizard` және профильді құру командалары осы деректерді автоматты түрде өңдейді.

## Жаратылыс тармағын қайта бастау {#recommitting-genesis}

Бір жақтас тек оның сақталуы бос болған кезде генезиске қол қояды. Жаңа генезисті біржолғы локалнетке сынау үшін, теңдестерді тоқтатып, олардың пайдаланған мемлекеттік каталогын алып тастаңыз және жаңа қол қойылған генезистен бастаңыз. Әр растаушы бірдей көші-қонды үйлестірмеген жағдайда жұмыс істеп тұрған желідегі генезисті алмастыруға болмайды.
