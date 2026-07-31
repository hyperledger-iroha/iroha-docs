---
translation_locale: am
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ብልህ ኮንትራት {#smart-contracts}

Iroha ግብይቶች ይፈጸማሉ `Executable` የአሁኑ የውሂብ ሞዴል
የሚደግፍ:

- `Executable::Instructions`: የተደራጀ ስብስብ Iroha ልዩ መመሪያዎች
- `Executable::ContractCall`: ለተሰማራ ውል የሚደረገውን የማጣቀሻ ጥሪ
  ምሳሌ
- `Executable::Ivm`: Iroha VM ባይት ኮድ
- `Executable::IvmProved`: Iroha VM ከቅድመ ማስላት መመሪያ ጋር ባይት ኮድ
  የሽፋን እና የማረጋገጫ ግዴታዎች

Kotodama ነው Iroha የከፍተኛ ደረጃ ስማርት ኮንትራት ቋንቋ ነው። `.ko` ምንጭ ፋይል
ወደ ተወስኖ ያጠናቅቃል IVM ባይት ኮድ፣ በተለምዶ እንደ `.to`
ለመተግበር የሚውል ጥንታዊ ዕቃ። Kotodama ግቦች IVM; እሱ ብቻውን አይደለም RISC-V
ወይም WebAssembly ዒላማ።

የመጀመሪያው ስሪት ብቻ ይደግፋል ABI ስሪት 1. syscall እና ጠቋሚ ABI
ፖሊሲው በውል መቀበል እና አፈፃፀም በኩል ያለ ቅድመ ሁኔታ ይተገበራል።
የስራ ሰዓት ተኳሃኝነት መቀየሪያ የለም።

## ስማርት ኮንትራቶችን መቼ መጠቀም እንደሚቻል {#when-to-use-smart-contracts}

ግብይቱ በቀጥታ ሊገለጽ በሚችልበት ጊዜ መደበኛ መመሪያዎችን ይጠቀሙ:

- የመመዝገብ ወይም የማስወገድ ዕቃዎች
- የግብይት፣ የማቃጠል ወይም የመተላለፊያ ንብረት
- የዘመነ ሜታዳታ
- ፈቃድ መስጠት ወይም መሰረዝ
- አስነሳ
- በሰንሰለት ላይ ያሉ መለኪያዎች ተዘጋጅተዋል

ግብይቱ የታሸገ አመክንዮ የሚፈልግበት ጊዜ ብልህ ውል ይጠቀሙ
አንድ ቋሚ መመሪያ ቅደም ተከተል ሆኖ ለመግለጽ አስቸጋሪ ነው, ወይም
የስምምነት ጉዳይ በመጥቀስ መጠየቅ አለበት።

## IVM ተጨባጭ {#ivm-executables}

`Executable::Ivm` ጥሬ ይዘዋል IVM ኖዶች በውስጣቸው ያለውን ባይት ኮድ ይሰራሉ
ለሰንሰለት የተቀየሱት የስራ ሰዓት ገደቦች።
ውሎች የግብይት አፈፃፀም አካል ናቸው እናም ስለሆነም ተጽዕኖ ያሳድራሉ
ስምምነት።

`Executable::IvmProved` ለሙከራ ተሸካሚ ፍሰቶች የታሰበ ነው።

- IVM ባይት ኮድ
- የመወሰኛ መመሪያ ሽፋን
- የአፈፃፀም-ክስተቶች ቃል ኪዳን
- የጋዝ ፖሊሲ ግዴታ

ማስረጃው ሽፋን የተፈፀመውን ባይት ኮድ ያገናኛል
ፖሊሲ, ማረጋገጫዎች ማስረጃውን ማረጋገጥ ይችላሉ እና ተጨማሪ እንደ ዳግም አፈጻጸም
የደህንነት ምርመራ።

## የተሰማሩ የውል ጥሪዎች {#deployed-contract-calls}

`Executable::ContractCall` የተተገበረ የውል ምሳሌን በአድራሻ ይጠቀማል።
የውል ኮድ በተናጠል ሲመዘገብ ይህ ይጠቀሙ እና ግብይቶች
በየጊዜው የባይት ኮዱን ይዘህ ከመሄድ ይልቅ በማጣቀሻ ይደውሉ.

## የአሠራር መመሪያ {#operational-guidance}

- የውል ባህሪ በአካባቢው ላይ የተመሠረተ መሆን የለበትም
  የግድግዳ ሰዓት ጊዜ, አስተናጋጅ ፋይሎች ስርዓት ሁኔታ, የአውታረ መረብ ጥሪዎች, ወይም ሌሎች peer-local
  ግብዓቶች።
- ትልቅ ባይት ኮድ የግብይት መጠን እና ብሎክ ይጨምራል
  የማስፋፋት ወጪ።
- ለቀላል መቁጠሪያ ለውጦች የተጻፉ መመሪያዎችን ይመርጣሉ።
  ኦዲት እና ለመፈፀም ርካሽ.
- የውል ማሻሻያ እና የምዝገባ ፈቃዶች ከፍተኛ አደጋ እንደሆኑ ይያዙ
  የአሠራር ቁጥጥር።

በተጨማሪም ተመልከት:

- [መመሪያ](/am/blockchain/instructions.md)
- [ተነሳሽነት](/am/blockchain/triggers.md)
- [ፍቃዶች](/am/blockchain/permissions.md)
- [የመረጃ ሞዴል መርሃግብር](/am/reference/data-model-schema.md)
