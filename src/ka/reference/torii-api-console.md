---
translation_locale: ka
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API კონსოლი {#torii-api-console}

გამოიყენეთ ცოცხალი OpenAPI დოკუმენტი მოქმედიდან Torii საინსპექციო მარშრუტების საბოლოო წერტილი;
გამოგზავნეთ სატესტო მოთხოვნები, გადაწერეთ curl ბრძანებები და კლიენტის კოდი გენერირება.

<ToriiApiConsole />

## მოთხოვნები {#requirements}

- სააგენტო Torii საბოლოო წერტილი უნდა გამოავლინოს `/openapi.json`.
- ბრაუზერის ტესტირება საჭიროა CORS ამ დოკუმენტების წარმოშობის დასაშვებად.
- ბრაუზერმა უნდა შეძლოს უშუალოდ მიაღწიოს საბოლოო წერტილს.
- კოდის წარმოება საჭიროებს Node.js, pnpm, და Java runtime OpenAPI
  გენერატორი.

კონსოლა დეფალტულად `https://taira.sora.org`. ადგილობრივი განვითარება, როგორც წესი
სამუშაოები `http://127.0.0.1:8080` როცა გაიქცევი Torii ოპვჟრთნარაჲ.

## სცადე. Taira პირველი {#try-taira-first}

სანამ კლიენტს შექმნით, შეამოწმეთ თუ არა საზოგადოება OpenAPI დოკუმენტი ხელმისაწვდომია
თქვენი აპარატიდან:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

შემდეგ დაფით `https://taira.sora.org/openapi.json` კონსოლაში და სცადე
მხოლოდ წაკითხვის მარშრუტი, როგორიცაა: `GET /status`, `GET /v1/domains`, ან
`GET /v1/assets/definitions`. შეინახეთ ხელმოწერილი ოპერაციები და კერძო გასაღების ნაკადები
დასახელება SDK ან CLI კლიენტი, რომელიც ატვირთავს საიდუმლოებებს თქვენს გარემოსგან.

## მომხმარებლის შექმნა {#generated-clients}

გენერატორის ბრძანება იყენებს იგივე პირდაპირი OpenAPI დოკუმენტი, რომ კონსოლი
ტვირთები. ეს სასარგებლოა JSON ოპერატორი, მკვლევარი, აპლიკაცია და ტელემეტრიული მარშრუტები.

ხელმოწერილი ლიდერული ტრანზაქციებისათვის, ხელმოწერილ გამოკითხვებზე და Norito-შემშობლული სასარგებლო ტვირთები,
უპირატესობა აქვს ოფიციალურ Iroha SDKs. OpenAPI კლიენტები არ შეაგროვებენ ხელმოწერებს,
ანგარიშის გასაღების მართვა ან კოდირება Norito ოპერაციული ორგანოები თქვენთვის.

ყველა გენერატორის ინსპექტირება, რომელსაც მხარს უჭერს OpenAPI გენერატორი, გაშვება:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
