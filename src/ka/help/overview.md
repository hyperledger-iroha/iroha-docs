---
translation_locale: ka
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# პრობლემების აღმოფხვრა {#troubleshooting}

ეს მონაკვეთი განკუთვნილია იმისათვის, რომ დაგეხმაროთ, თუ Iroha-თან მუშაობისას პრობლემები შეგექმნებათ. თუ რამე არასწორია, გთხოვთ, პირველ რიგში [შეამოწმეთ გასაღები](#check-the-keys). თუ ეს არ დაგეხმარებათ, შეამოწმეთ თითოეული ეტაპის პრობლემების მოგვარების ინსტრუქცია:

- [დამონტაჟების პრობლემები](./installation-issues.md)
- [კონფიგურაციის საკითხები](./configuration-issues.md)
- [განთავსების საკითხები](./deployment-issues.md)
- [ინტეგრაციის საკითხები](./integration-issues.md)

თუ თქვენთან არსებული პრობლემა აქ არ არის აღწერილი, დაგვიკავშირდით [ტელეგრამი](https://t.me/hyperledgeriroha).

## შეამოწმეთ გასაღები. {#check-the-keys}

უმრავლესობა პრობლემები წარმოიქმნება შეუდარებელი გასაღების შედეგად. ამიტომაც გირჩევთ დაიცვათ ეს წესი: თუ რამე არასწორია, პირველ რიგში გადაამოწმეთ გასაღებები.

აქ არის სწრაფი განმარტება: შეუძლებელია შეცდომათა შეტყობინებების დიფერენცირება, რომლებიც წარმოიქმნება მაშინ, როდესაც ქსელის კვანძების გასაღები არ არის შეესაბამება საიმედო ქსელის კვანძების არეალში არსებულ გასაღებს, რადგან ეს გამოავლინებდა ქსელური თანატოლთა საჯარო გასაღებს. როგორც ასეთი, თუ თქვენ გაქვთ Helm გრაფიკები ან Kubernetes განთავსებები გასაღები განსაზღვრული გარემოს ცვლადებით, შეადარეთ კონფიგურებული [`public_key`](/ka/reference/peer-config/params.md#param-public-key), [`private_key`](/ka/reference/peer-config/params.md#param-private-key), და [`trusted_peers`](/ka/reference/peer-config/params.md#param-trusted-peers) უფრო მაღალ დონეზე ჩავარდნის გამოკვლევის წინ.

ეჭვის შემთხვევაში, [შექმნას ახალი პარტიის გასაღები](/ka/guide/security/generating-cryptographic-keys.md).
