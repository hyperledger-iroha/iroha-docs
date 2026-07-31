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

გამოიყენეთ ცოცხალი OpenAPI დოკუმენტი მიმდინარე Torii საბოლოო პუნქტიდან, რომ შეამოწმოთ მარშრუტები, გაგზავნოთ ტესტის მოთხოვნები, გააკოპიროთ ბრძანებები curl და შექმნათ კლიენტის კოდი.

<ToriiApiConsole />

## მოთხოვნები {#requirements}

- Torii საბოლოო წერტილი უნდა გამოავლინოს `/openapi.json`.
- ბრაუზერის ტესტირება საჭიროებს CORS ამ დოკუმენტების წარმოშობის დასაშვებად.
- ბრაუზერმა უნდა შეძლოს უშუალოდ მიაღწიოს საბოლოო წერტილს.
- კოდის გენერირება მოითხოვს Node.js, pnpm და Java runtime for OpenAPI Generator.

კონსოლი დეფოლუტურად `https://taira.sora.org`. ადგილობრივი განვითარება ჩვეულებრივ მუშაობს `http://127.0.0.1:8080`, როდესაც თქვენ აწარმოებთ Torii თქვენს მანქანაში.

## სცადე Taira ჯერ {#try-taira-first}

კლიენტის გენერირებამდე შეამოწმეთ, არის თუ არა ხელმისაწვდომი საჯარო OpenAPI დოკუმენტი თქვენი აპარატისგან:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

შემდეგ დააჭირეთ `https://taira.sora.org/openapi.json` კონსოლში და სცადეთ მხოლოდ წაკითხვის მარშრუტი, როგორიცაა `GET /status`, `GET /v1/domains` ან `GET /v1/assets/definitions`. შეინახეთ ხელმოწერილი ტრანზაქცია და კერძო გასაღების ნაკადი SDK ან CLI კლიენტისთვის, რომელიც ატვირთავს საიდუმლოებებს თქვენი runtime გარემოსგან.

## შექმნილი კლიენტები {#generated-clients}

გენერატორის ბრძანება იყენებს იმავე ცოცხალ OpenAPI დოკუმენტს, რომელიც დატვირთულია კონსოლზე. ეს სასარგებლოა JSON ოპერატორისთვის, ექსპლუზერისთვის, აპლიკაციისთვის და ტელემეტრიის მარშრუტებისთვის.

ხელმოწერილი ლიდერული ტრანზაქციების, ხელმოწერილ გამოკითხვების და Norito-მშობელი სასარგებლო ტვირთებისათვის, უპირატესობა აქვს ოფიციალურ Iroha SDKs. OpenAPI კლიენტები არ შეაგროვებენ ხელმოწერებს, მართავენ ანგარიშის გასაღებს ან კოდირებენ Norito სატრანზაქციის ორგანოებს თქვენთვის.

ყველა OpenAPI გენერატორის მიერ მხარდაჭერილი გენერაციის ინსპექტირებისათვის, გაუშვით:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
