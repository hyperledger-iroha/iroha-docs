---
translation_locale: am
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ክስተት አስነሳሽነት ምሳሌ {#event-trigger-example}

ይህ ምሳሌ በ Iroha 3 የውሂብ ሞዴል ውስጥ ካኖኒካዊ የጎራ የሌለው ሂሳብ IDs እና የታቀዱ የንብረት ትርጉሞችን ይጠቀማል.

አንድ አውታረ መረብ የሚከተሉትን ይኑራቸው:

- በአሊስ ቁልፍ ቁጥጥር የሚደረግበት የካኖኒክ መለያ
- በተቆጣጣሪው ቁልፍ ቁጥጥር የሚደረግበት የካኖኒክ መለያ
- በ `wonderland.universal` ስር `tea` ተብሎ የሚተነብይ የንብረት ትርጉም
- በእያንዳንዱ ሂሳብ የተያዘው የዚያ ንብረት ቀሪ ገንዘብ

ግቡ የአሊስ የሻይ ሚዛን የሚከታተል እና ተዛማጅ መረጃ ክስተት በሚወጣበት ጊዜ ከ ‹Mad Hatter› መለያ ላይ ማስተላለፍን የሚያቀርብ ማስነቃቂያ መመዝገብ ነው ።

## 1. ሂሳቦችንና ንብረቶችን ማዘጋጀት {#_1-prepare-accounts-and-assets}

በመጀመሪያ ተሳታፊ ሂሳቦችን እና የንብረት ውስንነትን ይመዝገቡ። በአሁኑ Iroha ውስጥ ፣ ሂሳቡ IDs ከሂሳብ ተቆጣጣሪዎች የሚመጣ ሲሆን የታቀዱት ጎራዎች `domain.dataspace` ቅጹን ይጠቀማሉ-

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

የንብረቱ ትርጉም አሁንም ቀኖናዊ ያልታየ አድራሻ አለው ። ያንን አድራሻ ከመዝገብ በኋላ ያከማቹ ወይም ይጠይቁ እና በሚያስነሳው እርምጃ ውስጥ ይጠቀሙበት።

## 2. የማስነሳት ስልጣንን ይምረጡ {#_2-choose-the-trigger-authority}

በተቻለ መጠን የመነቃቂያውን ቴክኒካዊ መለያ ለልዩ መለያ ያዘጋጁ። አንድ የተወሰነ መለያ ለመነቃቂያው አፈፃፀም የትኞቹ ፈቃዶች እንደሚያስፈልጉ ግልፅ ያደርገዋል እንዲሁም የመነቃቂውን ከኦፕሬተሩ የግል ፊርማ ቁልፍ ጋር ከማያያዝ ይርቃል ።

የቴክኒካዊ ሂሳቡ ቀድሞውኑ መኖር አለበት እና መመሪያዎቹን በማስፈፀም ላይ ለማቅረብ ፈቃድ ሊኖረው ይገባል.

## 3. አስፈፃሚውን መወሰን {#_3-define-the-executable}

ሊፈፀም የሚችለው የዝግጅት ማጣሪያ በሚስማማበት ጊዜ አስነሳው የሚያስተላልፈው የትእዛዝ ቅደም ተከተል ነው። ለዚህ ምሳሌ አንድ ማስተላለፍ ይ containsል:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

የመጨረሻውን የግብይት ጥቅማጥቅሞች ለመገንባት SDK የአሁኑን የተጻፉ ገንቢዎችን ይጠቀሙ። አስጀማሪ ኮድ ውስጥ አሮጌውን ጽሑፋዊ IDs በሃርድ-ኮድ ከመገንባቱ በፊት ያስወግዱ; ማጣሪያ ወይም መጠይቅ ቀኖናዊ IDs ።

## 4. የክስተት ማጣሪያውን ይግለጹ {#_4-define-the-event-filter}

ክስተቶችን ከሚያስቡት ነገር ጋር የሚቀንስ የውሂብ ክስተቶች ማጣሪያ ይጠቀሙ:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

አንድ `AcceptAll` ማጣሪያ ለ debugging ጠቃሚ ነው, ነገር ግን እያንዳንዱ ተዛማጅ ክስተት የማስነሳት ግምገማ ወጪ እንዲከፍል ያደርጋል.

## 5. መቆጣጠሪያውን ያስገቡ። {#_5-register-the-trigger}

መቆጣጠሪያውን በ:

- አንድ ቋሚ `TriggerId`
- ሊፈፀም የሚችል የትእዛዝ ቅደም ተከተል
- `Repeats::Indefinitely` ወይም `Repeats::Exactly(n)`
- የቴክኒክ ሂሳብ
- የዝግጅት ማጣሪያ
- አማራጭ ሜታዳታ

አስጀማሪ ምዝገባ በራሱ መደበኛ ግብይት ነው ፣ ስለሆነም የመመዝገብ ሂሳቡ አስጀማሪዎችን ለመመዝገብ ፈቃድ ይፈልጋል ። ቴክኒካዊው ሂሳብ አስጀማሪውን ለማስፈፀም የሚያስፈልጉትን ፈቃዶች ይፈልጋል።

## የፍርድ ትዕዛዝ {#execution-order}

አንድ ብሎክ ሲፈፀም:

1. መደበኛ የግብይት መመሪያዎች በመጀመሪያ ይሰራሉ.
2. በእነዚህ መመሪያዎች የተፈጠሩ መረጃ ክስተቶች ይሰበሰባሉ።
3. ማጣሪያዎቻቸው ከነዚህ ክስተቶች ጋር የሚዛመዱባቸው አስነሳሾች መርሐግብር ተይዘዋል ።
4. ተነሳሽነት የሚመነጩ ውጤቶች በብሎክ አፈፃፀም ቧንቧ ውስጥ ያልተገደበ ሪኩረሲቭ ተነሳሽነትን ይፈጽማሉ.

አንድ አስነሳሽ `Repeats::Exactly(n)` የሚጠቀም ከሆነ, መቁጠሪያው ሲጨርስ እና ተመሳሳይ ባህሪ እንደገና አስፈላጊ በሚሆንበት ጊዜ አዲስ አስነሳሽነት ይመዝገቡ.
