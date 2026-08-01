---
translation_locale: az
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ifadələr, şərtlər, məntiq {#expressions-conditionals-logic}

Bütün [Iroha Xüsusi Təlimatlar ](./instructions.md) ifadələr üzərində işləyir. Hər bir ifadədə təlimat icrasında istifadə olunan `EvaluatesTo` var. Hesabın adını birbaşa təyin edə bilsəniz də, bəzi riyazi və ya silsilə əməliyyatları vasitəsilə ID hesabı da təyin edə bilərsiniz. Bir hesabın blok zincirdə qeydiyyatdan keçdiyini yoxlaya bilərsiniz.

`EvaluatesTo<bool>` tətbiq edən ifadələrdən istifadə edərək şərti məntiq qura bilərsiniz və daha mürəkkəb əməliyyatları zəncirdə icra edə bilərsiniz. Məsələn, yalnız müəyyən bir hesab qeydiyyatdan keçərkən `Mint` təlimatını təqdim edə bilərsiniz.

Xatırladaq ki, bunu sorğularla birləşdirə bilərsiniz və beləliklə blok zincirini heyrətamiz şeylər etmək üçün proqramlaşdıra bilərsiniz. Biz bunu ağıllı müqavilələr olaraq adlandırırıq, bu da blok zincir texnologiyasının qabaqcıl istifadəsinin müəyyən xüsusiyyətidir.
