---
translation_locale: hy
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Խնդիրների լուծում {#troubleshooting}

Այս բաժինը նախատեսված է օգնել, եթե դուք հանդիպում եք խնդիրների, երբ աշխատում եք Iroha: Եթե ինչ-որ բան սխալ է կատարվում, խնդրում ենք նախ ստուգել [ կաբույժները](#check-the-keys): Եթե դա չի օգնում, ստուգեք յուրաքանչյուր փուլի խնդրի լուծման հրահանգները.

- [Մուտքագրման խնդիրներ](./installation-issues.md)
- [Ստեղծման խնդիրներ](./configuration-issues.md)
- [Բնակչության տեղակայման հարցեր](./deployment-issues.md)
- [Ինտգրացիոն հարցեր](./integration-issues.md)

Եթե ձեր խնդիրն այստեղ չի նկարագրվել, կապվեք մեզ հետ [Telegram](https://t.me/hyperledgeriroha) միջոցով:

## Փորձեք բանալիները {#check-the-keys}

Խնդիրների մեծ մասը առաջանում է անհամեմատելի բանալիների արդյունքում: Հետեւաբար, խորհուրդ ենք տալիս հետեւել այս կանոնին.

Ահա մի կարճ բացատրություն. հնարավոր չէ տարբերել սխալների հաղորդագրությունները, որոնք առաջանում են, երբ զուգընկերների բանալիները չեն համապատասխանում վստահելի զուգընկերի շարքում գտնվող բանալիներին, քանի որ դա կբացահայտի զուգընթացների հանրային բանալի: Հետեւաբար, եթե դուք ունեք Helm քարտեզներ կամ Kubernetes տեղակայումները միջավայրի փոփոխականների միջոցով սահմանված բանալիների հետ, նախքան ավելի բարձր մակարդակի ձախողումների ուսումնասիրումը համեմատեք կազմավորված [`public_key`](/hy/reference/peer-config/params.md#param-public-key), [`private_key`](/hy/reference/peer-config/params.md#param-private-key), եւ [`trusted_peers`](/hy/reference/peer-config/params.md#param-trusted-peers) արժեքները:

Եթե կասկածի տակ եք, [ ստեղծեք նոր զույգ բանալիներ ](/hy/guide/security/generating-cryptographic-keys.md).
