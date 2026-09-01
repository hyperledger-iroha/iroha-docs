---
translation_locale: am
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የክስተት ቀስቅሴ ምሳሌ {#event-trigger-example}

ይህ ምሳሌ በ Iroha 3 የውሂብ ሞዴል ውስጥ ነጠላ ፕሮቶኮል-መደበኛ ጎራ አልባ መለያ መታወቂያዎችን እና የታቀዱ የንብረት ፍቺዎችን ይጠቀማል።

አንድ አውታረ መረብ አለው እንበል -

- በ Alice ቁልፍ ቁጥጥር የሚደረግበት ነጠላ ፕሮቶኮል-መደበኛ መለያ
- በ Mad Hatter ቁልፍ ቁጥጥር ስር ያለ አንድ ፕሮቶኮል-መደበኛ መለያ
- በ `wonderland.universal` ስር እንደ `tea` የታቀደ የንብረት ፍቺ
- በእያንዳንዱ መለያ የተያዘው የዚያ ንብረት ቀሪ ሂሳብ

ግቡ የ Alice የሻይ ቀሪ ሒሳብን የሚመለከት እና ተዛማጅ የውሂብ ክስተት ሲወጣ ከ Mad Hatter መለያ ዝውውርን የሚያቀርብ ቀስቅሴ መመዝገብ ነው።

## 1. ሂሳቦችን እና ንብረቶችን ያዘጋጁ {#_1-prepare-accounts-and-assets}

መጀመሪያ የተሳታፊ መለያዎችን እና የንብረት ፍቺን ያስመዝግቡ። አሁን ባለው Iroha የመለያ መታወቂያዎች ከመለያ ተቆጣጣሪዎች ይመጣሉ፣ የታቀዱ ጎራዎች ደግሞ የ`domain.dataspace` ቅጹን ይጠቀማሉ -

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

የንብረት ፍቺው አሁንም ካኖኒካል እና ግልጽ ያልሆነ አድራሻ አለው። ከምዝገባ በኋላ ያንን አድራሻ ያከማቹ ወይም ይጠይቁ እና በቀስቅሴው እርምጃ ውስጥ ይጠቀሙበት።

## 2. ቀስቅሴውን ይምረጡ ፈቃድ ዋና {#_2-choose-the-trigger-authority}

በሚቻልበት ጊዜ የቀስቅሴውን ቴክኒካዊ መለያ ወደ ተለየ መለያ ያዘጋጁ። ተለየ መለያ ለቀስቅሴ አፈጻጸም የሚያስፈልጉትን ፈቃዶች ግልጽ ያደርጋል እና ቀስቅሴውን ከኦፕሬተር የግል ፊርማ ቁልፍ ጋር ከማጣመር ይከላከላል።

የቴክኒክ መለያው አስቀድሞ መኖር አለበት እና መመሪያዎችን በ ውስጥ ለማስገባት ፈቃድ ሊኖረው ይገባል ቀስቅሴ ተፈጻሚ.

## 3. ተፈፃሚውን ይግለጹ {#_3-define-the-executable}

ተፈጻሚው የክስተት ማጣሪያው ሲዛመድ ቀስቅሴው የሚያቀርበው የመመሪያ ቅደም ተከተል ነው። ለዚህ የቀደመው ምሳሌ, አንድ ማስተላለፍ ይዟል -

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

ለመጨረሻው የግብይት ጭነት የ SDK የአሁኑን የተተየቡ ግንበኞችን ይጠቀሙ። ቀስቅሴ ኮድ ውስጥ የቆዩ የጽሑፍ መታወቂያዎችን ሃርድ ኮድ ማድረግ ያስወግዱ; ተፈጻሚውን ከመገንባትዎ በፊት ነጠላ ፕሮቶኮል-መደበኛ መታወቂያዎችን ይተንትኑ ወይም ይጠይቁ።

## 4. የክስተት ማጣሪያውን ይግለጹ {#_4-define-the-event-filter}

ክስተቶችን ወደሚያስቡት ነገር የሚያጠብ የውሂብ-ክስተት ማጣሪያ ይጠቀሙ -

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

ማጣሪያዎችን እንደ ተግባራዊ አድርገው ያስቀምጡ። የ`AcceptAll` ማጣሪያ ለማረም ጠቃሚ ነው፣ ነገር ግን እያንዳንዱ ተዛማጅ ክስተት የመቀስቀሻ ግምገማ ወጪን እንዲከፍል ያደርገዋል።

## 5. ቀስቅሴውን ይመዝገቡ {#_5-register-the-trigger}

ቀስቅሴውን በ

- የተረጋጋ `TriggerId`
- ሊተገበር የሚችል መመሪያ ቅደም ተከተል
- `Repeats::Indefinitely` ወይም `Repeats::Exactly(n)`
- የቴክኒክ መለያው
- የክስተት ማጣሪያው
- አማራጭ ሜታዳታ

ቀስቅሴን መመዝገብ ራሱ መደበኛ ግብይት ስለሆነ፣ መዝጋቢው መለያ ቀስቅሴዎችን የመመዝገብ ፈቃድ ያስፈልገዋል። ቴክኒካዊው መለያ ደግሞ የቀስቅሴው ፈጻሚ የሚፈልጋቸውን ፈቃዶች ያስፈልገዋል።

## የማስፈጸሚያ ትዕዛዝ {#execution-order}

ብሎክ ሲፈፀም -

1. መደበኛ የግብይት መመሪያዎች መጀመሪያ ይሰራሉ።
2. በእነዚያ መመሪያዎች የተዘጋጁ የውሂብ ክስተቶች ይሰበሰባሉ።
3. ማጣሪያዎቻቸው ከእነዚህ ኩነቶች ጋር የሚዛመዱ ቀስቅሴዎች የታቀዱ ናቸው።
4. ቀስቅሴ የሚመነጩ ውጤቶች ያልተገደበ ተደጋጋሚ ቀስቅሴ አፈፃፀምን ሳይፈቅዱ በብሎክ ማስፈጸሚያ ሶፍትዌር ማቀነባበሪያ የስራ ሂደት ውስጥ ይያዛሉ።

ቀስቅሴው `Repeats::Exactly(n)` የሚጠቀም ከሆነ፣ ቆጠራው ሲሟጠጥ እና ተመሳሳይ ባህሪ እንደገና ሲያስፈልግ አዲስ ቀስቅሴ ይመዝገቡ።
