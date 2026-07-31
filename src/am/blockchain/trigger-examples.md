---
translation_locale: am
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክስተት ማስነሳት ምሳሌ {#event-trigger-example}

ይህ ምሳሌ ካኖኒካል ጎራ የሌለው መለያ ይጠቀማል IDs እና የታቀደው ንብረት
በ Iroha 3 የውሂብ ሞዴል.

አንድ አውታረ መረብ የሚከተሉትን ይኑራቸው:

- የአሊስ ቁልፍ የሚቆጣጠረው የካኖኒክ መለያ
- ከብዶው ካፒታል ቁልፍ የሚቆጣጠረው የካኖኒክ መለያ
- እንደታሰበው የንብረት ትርጉም `tea` ስር `wonderland.universal`
- በእያንዳንዱ ሂሳብ የተያዘው የዚያ ንብረት ቀሪ ገንዘብ

ዓላማው የአሊስ ሻይ ሚዛን እና
የሚመሳሰል መረጃ ክስተት በሚከሰትበት ጊዜ ከ Mad Hatter መለያ የዝውውር ማስተላለፍን ያቀርባል
የተለቀቀው።

## 1. ሂሳቦችንና ንብረቶችን ማዘጋጀት {#_1-prepare-accounts-and-assets}

በመጀመሪያ ተሳታፊ ሂሳቦችን እና የንብረት ማብራሪያዎችን መመዝገብ።
የአሁኑ Iroha, ሂሳብ IDs ከሂሳብ ተቆጣጣሪዎች የሚመጡ ሲሆን
የጎራ አጠቃቀም `domain.dataspace` ቅጽ:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

የንብረት ትርጉም አሁንም ቀኖናዊ ግልጽ ያልሆነ አድራሻ አለው.
ከመመዝገብ በኋላ አድራሻውን በመጠቀም አስነሳሽ እርምጃን ይጠቀሙበት።

## 2. የማስነሳት ሥልጣን ይምረጡ {#_2-choose-the-trigger-authority}

የሚቻል ከሆነ የጅምላውን ቴክኒካዊ ሂሳብ ወደ ተለይቶ የተዘጋጀ መለያ ያዘጋጁ።
የተወሰነ መለያ የትኞቹን ፍቃዶች እንደሚያስፈልግ ግልጽ ያደርገዋል
አፈፃፀም እና ነጂውን ከኦፕሬተሩ የግል ፊርማ ጋር ከማገናኘት ይርቃል።
ቁልፍ.

ቴክኒካዊ ሂሳቡ ቀድሞውኑ ሊኖር ይገባል እና
በትሪገር ውስጥ መመሪያዎችን ማስኬድ።

## 3. የሚፈፀመውን ይግለጹ {#_3-define-the-executable}

ሊፈፀም የሚችለው ትዕዛዙ ክስተቱ ሲከሰት አስነሳው የሚያቀርበው የትእዛዝ ቅደም ተከተል ነው
በዚህ ምሳሌ ውስጥ አንድ ማስተላለፍ ይዟል:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

ይጠቀሙ SDK የመጨረሻው ግብይት ጥቅማጥቅሞች ለማግኘት የአሁኑ የተጻፉ ገንቢዎች.
ጠንካራ ኮድ አሮጌ ጽሑፍ IDs በማስነሳት ኮድ ውስጥ; አጣራ ወይም መጠይቅ ቀኖናዊ IDs
አስፈጻሚውን ከመገንባቱ በፊት።

## 4. የክስተት ማጣሪያውን ይግለጹ {#_4-define-the-event-filter}

ክስተቶችን ከሚያስቡት ነገር ጋር የሚቀንስ የውሂብ ክስተቶች ማጣሪያ ይጠቀሙ:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

ማጣሪያዎችን በተግባር ላይ የሚውሉትን ያህል ዝርዝር ያድርጉ። `AcceptAll` ማጣሪያ ለ
debugging, ነገር ግን እያንዳንዱ ተዛማጅ ክስተት ማስነሳት ወጪ ይከፍላል ያደርጋል
ግምገማ።

## 5. ማስነሻውን አስመዝግቡ {#_5-register-the-trigger}

መቆጣጠሪያውን በ:

- አንድ መቀመጫ `TriggerId`
- የሚተገበር የትእዛዝ ቅደም ተከተል
- `Repeats::Indefinitely` ወይም `Repeats::Exactly(n)`
- የቴክኒክ ሂሳብ
- ክስተት ማጣሪያ
- አማራጭ ሜታዳታ

አስነሳሽነት ምዝገባ ራሱ መደበኛ ግብይት ነው, ስለዚህ ምዝገባ
ቴክኒካዊ ሂሳቡ ማስነሻዎችን ለመመዝገብ ፈቃድ ይፈልጋል።
ማስነሻው ሊፈፀም የሚችል መሆኑን የሚጠይቁ ፍቃዶች።

## የፍርድ ትዕዛዝ {#execution-order}

አንድ ብሎክ ሲፈፀም:

1. የተለመዱ የግብይት መመሪያዎች በመጀመሪያ ይሂዳሉ።
2. በእነዚህ መመሪያዎች የተፈጠሩ መረጃዎች ይሰበሰባሉ።
3. ማጣሪያዎቻቸው ከነዚህ ክስተቶች ጋር የሚዛመዱባቸው አስነሳሾች መርሐግብር ተይዘዋል።
4. በብሎክ አፈፃፀም መስመር ውስጥ ሳያደርጉ በማስነሳት የተፈጠሩ ውጤቶች ይስተናገዳሉ
   ያልተገደበ የሽግግር ማስነሻ አፈፃፀም የሚፈቅድ።

አንድ አስነሳሽ የሚጠቀም ከሆነ `Repeats::Exactly(n)`, ቁጥሩ ሲጨርስ አዲስ ማስነሻ ይመዝገቡ
ድካም ሲደርስበት እንደገና ተመሳሳይ ባህሪ ያስፈልጋል።
