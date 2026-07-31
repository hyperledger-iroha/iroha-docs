---
translation_locale: ka
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# პრობლემების აღმოფხვრა {#troubleshooting}

ეს განყოფილება გაძლევთ დახმარებას, თუ თქვენ მუშაობის დროს პრობლემებს შეხვდებით.
Iroha. თუ რამე არასწორია, გთხოვთ. [შეამოწმეთ გასაღები](#check-the-keys)
თუ ეს არ დაგეხმარებათ, შეამოწმეთ პრობლემების აღმოფხვრის ინსტრუქციები
თითოეული ეტაპი:

- [დამონტაჟების პრობლემები](./installation-issues.md)
- [კონფიგურაციის საკითხები](./configuration-issues.md)
- [განლაგების საკითხები](./deployment-issues.md)
- [ინტეგრაციის საკითხები](./integration-issues.md)

თუ პრობლემა, რომელსაც განიცდი, აქ არ არის აღწერილი, დაგვიკავშირდით
[ტელეგრამი](https://t.me/hyperledgeriroha).

## შეამოწმეთ გასაღები. {#check-the-keys}

უმრავლესობა პრობლემები წარმოიქმნება შეუთავსებელი გასაღების შედეგად. სწორედ ამიტომ ჩვენ გირჩევთ
დაიცვას ეს წესი: **თუ რამე არასწორია, შეამოწმეთ გასაღები.
პირველი**.

აქ არის სწრაფი განმარტება: არ შეიძლება შეცდომის დიფერენცირება
შეტყობინებები, რომლებიც წარმოიქმნება მაშინ, როდესაც თანატოლების გასაღები არ ემთხვევა მასაჟის გასაღებს
სანდო თანატოლები, რადგან ეს გამოავლინებდა თანატოლების საჯარო გასაღებს.
ჰელმების რუკები ან Kubernetes განთავსებები გარემოს მეშვეობით განსაზღვრული გასაღებით
ცვლადი, შეადარეთ კონფიგურებული
[`public_key`](/ka/reference/peer-config/params.md#param-public-key),
[`private_key`](/ka/reference/peer-config/params.md#param-private-key), და
[`trusted_peers`](/ka/reference/peer-config/params.md#param-trusted-peers)
უფრო მაღალი დონის ჩავარდნის გამოკვლევის წინ.

თუ ეჭვი გაქვს, [შექმნას ახალი პარტიის გასაღები](/ka/guide/security/generating-cryptographic-keys.md).
