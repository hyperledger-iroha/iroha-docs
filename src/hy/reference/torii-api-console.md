---
translation_locale: hy
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Կոնսուլ {#torii-api-console}

Օգտագործեք OpenAPI կենդանի փաստաթուղթը վազող Torii վերջային կետից ուղիները ստուգելու, փորձարկման պահանջներ ուղարկելու, curl հրամանները կրկնօրինակելու եւ հաճախորդի կոդ ստեղծելու համար:

<ToriiApiConsole />

## Պահանջները {#requirements}

- Torii վերջային կետը պետք է բացահայտի `/openapi.json`։
- Բրաուզերային փորձարկումները պահանջում են CORS ՝ թույլ տալով այս փաստաթղթերի ծագումը:
- Բրաուզերը պետք է կարողանա ուղղակիորեն հասնել վերջային կետին:
- Քոդի արտադրությունը պահանջում է Node.js, pnpm, եւ Java- ի գործարկման ժամանակը OpenAPI Generator- ին:

Կոնսոլը նախանշված է `https://taira.sora.org`: Տեղական մշակումը սովորաբար աշխատում է `http://127.0.0.1:8080`-ի հետ, երբ դուք գործադրում եք Torii ձեր մեքենայում:

## Փորձեք Taira Նախ {#try-taira-first}

Նախքան հաճախորդի ստեղծումը, ստուգեք, որ ձեր համակարգիչից հասանելի է հանրային OpenAPI փաստաթուղթը.

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Այնուհետեւ սեղմեք `https://taira.sora.org/openapi.json` կոնսոլում եւ փորձեք միայն ընթերցվող երթուղի, ինչպիսիք են `GET /status`, `GET /v1/domains` կամ `GET /v1/assets/definitions`: Պահպանեք ստորագրված գործարքը եւ գաղտնի բանալիների հոսքերը ՝ ձեր վազման միջավայրից գաղտնիքներ բեռնող SDK կամ CLI հաճախորդի համար:

## Ստեղծված հաճախորդներ {#generated-clients}

Գեներատորի հրամանը օգտագործում է նույն կենդանի OpenAPI փաստաթուղթը, որը բեռնում է կոնսոլը: Սա օգտակար է JSON օպերատորների, Explorer- ի, հավելվածների եւ հեռաչափման ուղիների համար:

ստորագրված գրասենյակային գործարքների, ստորագրված հարցումների եւ Norito ներկառուցված օգտակար բեռների համար նախընտրեք պաշտոնական Iroha SDKs: OpenAPI հաճախորդները ձեզ համար չեն հավաքում ստորագրություններ, կառավարում են հաշիվի բանալիները կամ կոդավորում Norito գործարքի մարմինները:

OpenAPI գեներատորի կողմից աջակցվող յուրաքանչյուր գեերատորին ստուգելու համար գործարկեք:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
