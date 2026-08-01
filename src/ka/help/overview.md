---
translation_locale: ka
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# პრობლემების აღმოფხვრა {#troubleshooting}

ეს მონაკვეთი განკუთვნილია იმისათვის, რომ დაგეხმაროთ, თუ Iroha-თან მუშაობისას პრობლემები შეგექმნებათ. თუ რამე არასწორია, გთხოვთ [ ჯერ შეამოწმოთ გასაღებები](#check-the-keys). თუ ეს არ დაგეხმარებათ, შეამოწმეთ თითოეული ეტაპის პრობლემების მოგვარების ინსტრუქციები:

- [დამონტაჟების პრობლემები](./installation-issues.md)
- [კონფიგურაციის საკითხები](./configuration-issues.md)
- [განთავსების საკითხები](./deployment-issues.md)
- [ინტეგრაციის საკითხები](./integration-issues.md)

თუ თქვენს პრობლემას აქ აღწერილი არ აქვს, დაგვიკავშირდით [ტელეგრამზე ](https://t.me/hyperledgeriroha).

## შეამოწმეთ გასაღები. {#check-the-keys}

უმრავლესობა პრობლემები წარმოიქმნება შეუდარებელი გასაღების შედეგად. ამიტომაც გირჩევთ დაიცვათ ეს წესი: თუ რამე არასწორია, პირველ რიგში გადაამოწმეთ გასაღებები.

აქ არის სწრაფი განმარტება: შეუძლებელია შეცდომათა შეტყობინებების დიფერენცირება, რომლებიც წარმოიქმნება მაშინ, როდესაც თანატოლების გასაღები არ ემთხვევა სანდო თანატოლთა რიგში არსებულ გასაღებს, რადგან ეს გამოავლინებდა თანატოლებს საჯარო გასაღებს. როგორც ასეთი, თუ თქვენ გაქვთ ჰელმის რუკები ან Kubernetes განთავსებები გასაღებებით გარემოს ცვლადების მეშვეობით განსაზღვრული, შეადარეთ კონფიგურებული [`public_key`](/ka/reference/peer-config/params.md#param-public-key), [`private_key`](/ka/reference/peer-config/params.md#param-private-key), და [`trusted_peers`](/ka/reference/peer-config/params.md#param-trusted-peers) ღირებულებები უფრო მაღალი დონის ხარვეზების გამოკვლევის წინ.

ეჭვის შემთხვევაში, [ წარმოქმნას ახალი პარტიის გასაღები ](/ka/guide/security/generating-cryptographic-keys.md).
