---
translation_locale: kk
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Оқулықтар {#sdk-tutorials}

Бұл парақтар негізгі жұмыс кеңістігінен жіберілген Iroha 3 клиент кіру нүктелерін, оның ішінде каноникалық пакет атауларын, орнату жолдарын және минималды бастапқы нүктелерді қорытындылайды.

## Ұсынылған бұйрық {#recommended-order}

1. [Iroha 3](/kk/get-started/install-iroha.md) орнату
2. [Ұшыру Iroha 3](/kk/get-started/launch-iroha.md)
3. SDK дегенді таңдаңыз:
   - [Rust](/kk/guide/tutorials/rust.md)
   - [Python](/kk/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/kk/guide/tutorials/javascript.md)
   - [Kotlin, Android, және Java](/kk/guide/tutorials/kotlin-java.md)
   - [Swift және iOS](/kk/guide/tutorials/swift.md)
4. Клиенттік қосымшаның толық анықтамасын сұрағанда [ үлгілік қолданбаларды](/kk/guide/tutorials/sample-apps.md) қараңыз.
5. [Embed Kaigi](/kk/guide/tutorials/kaigi.md)-ді өзіңіздің қолданбаңызға қолма-қол ақшамен қамтамасыз етілген аудио / бейне кездесулерді қосу үшін қолданыңыз.
6. Пайдалану [Musubi таңбалар](/kk/guide/tutorials/musubi.md) қайтадан пайдаланылуы қажет болған кезде Kotodama тізбектегі тіркелімге тәуелділіктері бар бастапқы кітапханалар.

## Үлгілер {#samples}

Жоғары ағымындағы жұмыс кеңістігінде JavaScript рецепттер және Swift/iOS үлгі жобалары. Android, бастау Kotlin SDK модульдер мен олардың сынақтары.

- [Қолданбалардың үлгілерінің шолу](/kk/guide/tutorials/sample-apps.md)
- [Қосылған Kaigi а) JavaScript қолданба](/kk/guide/tutorials/kaigi.md)

## Шындықтың қайнар көзі {#source-of-truth}

Бұл жердегі барлық SDK беттер ағымдағы жоғары ағымындағы жұмыс кеңістігінен алынған:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java зеркалы Kotlin- Біріншісі Android беті)
- `IrohaSwift`
- `crates/musubi`

Күмәнданған жағдайда, осы каталогтардағы README және топтаманың метамағлұматтарын таңдаңыз; олар сіз құрастырып жатқан бастапқы қайта қарауды сипаттайды.
