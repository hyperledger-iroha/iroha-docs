---
translation_locale: az
translation_source: /blockchain/expressions.md
translation_source_hash: 8ad29a13df0efcc68b21323a48cfbcd71ab25b97c063709c827b08422cd9aad0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İfadələr, Şərtlər, Məntiq {#expressions-conditionals-logic}

Bütün [Iroha Təlimat əməliyyatları](./instructions.md) ifadələr üzərində işləyir. Hər ifadənin icra təlimatında istifadə olunan bir `EvaluatesTo` var. Hesab adını müəyyən edə bilsən də birbaşa, həmçinin hesab ID-sini bəzi riyazi və ya mətn əməliyyatı ilə göstərə bilərsiniz. Həmçinin bir hesabın blokçeyndə qeydiyyatdan keçib-keçmədiyini yoxlaya bilərsiniz.

`EvaluatesTo<bool>` ifadələrindən istifadə edərək, şəbəkə üzərində şərti məntiq qura bilərsiniz və daha mürəkkəb əməliyyatlar apara bilərsiniz. Məsələn, yalnız müəyyən bir hesab qeydiyyatdan keçibsə, `Mint` əmri təqdim edə bilərsiniz.

Yadda saxlayın ki, bunu sorğularla birləşdirə bilərsiniz və beləliklə blokçeynə möhtəşəm işlər görmək üçün proqram qura bilərsiniz. Biz bunu ağıllı müqavilələr adlandırırıq, bu da blokçeyn texnologiyasının inkişaf etmiş istifadəsinin müəyyənedici xüsusiyyətidir.
