---
translation_locale: kk
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Код үзінділері {#code-snippets}

Жасалған үзінділер мысалдарды оларды жасаған Iroha ревизиясындағы кодқа, конфигурацияға және схемаларға байланысты сақтайды.

## Жаңарту Iroha Артефакттары {#refreshing-iroha-artifacts}

Iroha-негізделген үзінділер енгізілген, сондықтан қарапайым сайт жинақтары желіге қосылуды немесе туыс репозиториге қол жеткізуді қажет етпейді. Оларды айқын түрде жаңартыңыз:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Тіркелген `etc/refresh-iroha.ts` жұмыс процесі таза бастапқы кодты `provenance/iroha.json` бойынша тексереді, `/src/snippets` және Torii OpenAPI уақыт бойынша мәліметтер көрінісін қайта жасау үшін, және жаңартулар SHA-256 криптографиялық хэштерін. Мазмұн мен шығу тегінің өзгерістерін бірге қараңыз. Қалыпты тәуелділікті орнату және VitePress құрастырулар өзгермелі тармақты жүктемей, тіркелген файлдарды пайдаланады.

## Фрагменттерді қосу {#including-snippets}

[VitePress код үзіндісінің синтаксисі](https://vitepress.dev/guide/markdown#import-code-snippets) тіркелген немесе жергілікті көзді қосу үшін пайдаланыңыз:

```md
<<< @/snippets/client.template.toml
```

Атау берілген код аймағын оның аймақ атауын қосу арқылы қосуға болады:

```md
<<< @/example_code/lorem.rs#ipsum
```

Қолмен жазылған мысалдарды шағын етіп ұстаңыз. Қоғамдық интерфейстер, конфигурация шаблондары, жасалған схемалар және команда шығысы үшін жаңартылған бастапқы артефактілерді таңдаңыз.
