---
translation_locale: he
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# אינטרפייסי פונקציות זרות (FFI) {#foreign-function-interfaces-ffi}

ה- `iroha_ffi` הקופסה מספקת מקורות ותכונות לייצר C ABI
מחייבויות Rust APIs. הוא משמש כאשר Iroha סוגים צריכים לחצות FFI
גבול, למשל על ידי SDK חיבורים או אינטגרציות מארח.

## למה? FFI {#why-ffi}

פונקציה היא יחידה די מופשטת, ואילו רוב השפות מסכימות על
מה תפקוד צריך לעשות, הדרך בה תפקודים מוצגים היא
בנוסף, בשפות מסוימות, כגון Rust, ההשלכות
של לקרוא לתפקיד ודברים שהוא מותר לעשות הם גם
שונה. Rust APIs יש צורך להתקשר משפה אחרת או
סביבה מארחת שונה, Iroha משתמש במערכת פונקציה זרה (FFI)
כדי לשוויון את השדה המשחק.

הסטנדרט העיקרי שימש היום הוא האינטרס בינארי של יישום C.
פשוט, זמין באופן נרחב, ויציב.
הכל ידוע, אבל Iroha מספקת את `iroha_ffi` קופסה לייצר
FFI-פונקציות תואמות מתוך מערכת קיימת Rust API.

אתה יכול, כמובן, לעשות את זה בדרך שלך. `iroha_ffi` קופסה בלבד
הוא מייצר את הקוד שאתה צריך לייצר בכל מקרה.
רצועת כביסה נחוצה דורשת קצת קשפוח ותשמעת.
כל קריאה לתפקיד על FFI הגבול הוא `unsafe` עם פוטנציאל
התנהגות לא מוגדרת. השיטה שבה הצלחנו לפתור אותה,
מסתובב סביב שימוש **חזקה** `repr(C)` סוגים.

::: info

ההחלה היחידה היא כיוון.
אימץ גלובלי, כך שמרכיבים חומריים (כרגיל)
נושאים. בהתחשב בכך שאנו מספקים עגילים סביב כמעט כל מקרה של
אובייקט ב Iroha מודל נתונים, אתה לא צריך להשתמש בנקודות רות
כל זה.

:::

## דוגמה {#example}

הנה דוגמא לייצר חיבור:

```rust
#[derive(FfiType)]
struct DaysSinceEquinox(u32);

#[ffi_export]
impl DaysSinceEquinox {
    pub fn update_value(&mut self, a: &u8) {
        self.0 = *a as u32;
    }
}
```

הדוגמא לעיל יגרום לקשור הבא עם
`DaysSinceEquinox` מוצג כמרכיב חיוור:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI דור מחייב {#ffi-binding-generation}

ה- `iroha_ffi` קופסה משמשת לייצר פונקציות שניתן להתקשר אליה באמצעות
FFI. נתון `Rust` מבנים ושיטות, הם מייצרים את `unsafe` קוד זה
היית צריך כדי לחצות את הגבול הקשור.

א Rust סוג הופך להיות חזק `repr(C)` סוג שיכול לחצות את
FFI גבול עם `FfiType::into_ffi`. זה הולך בדרך ההפוכה כ
טוב, זה בסדר. FFI `ReprC` סוג הופך ל `Rust` סוג דרך
`FfiType::try_from_ffi`.

::: warning

שים לב כי ההפוך הפוך הוא טועה וניתן לגרום לא מוגדר
התנהגות. בעוד שאנחנו יכולים לעשות את כל המאמצים שלנו כדי למנוע
אם אתה עושה טעויות, עליך להבטיח את נכונות התוכנית שלך.

:::

The המאפיינים העיקריים שמאפשרים יצירת חיבור הם: `ReprC`, `FfiType`, ו
`FfiConvert`.

| תכונה        | תיאור                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | המאפיין הזה מייצג סוג חזקה שמתאימה ל- C ABI. סוג זה ניתן לחלוק בבטחה בין FFI גבולות.                                                                |
| `FfiType`    | תכונה זו מגדירה `ReprC` סוג עבור נתון `Rust` סוג. `ReprC` סוג זה משמש במקום `Rust` סוג ב API של המוצר FFI תפקוד. |
| `FfiConvert` | תכונה זו מגדירה שתי שיטות `into_ffi` ו `try_from_ffi` אשר משמשים לבצע את ההפוך של `Rust` סוג ל- או מ- `ReprC` סוג.                                |

שימו לב שאין העברה של הבעלות על FFI למעט קישור לא ברור
סוגים. כל סוגים אחרים שובילים בבעלות, כגון `Vec<T>`, הם מקלונים.

### שם: מאנגלינג {#name-mangling}

שימו לב לשימוש בסימנים כפולים בשמות שנוצרו של FFI חפצים:

- עבור `inherent_fn` שיטה מוגדרת ב `StructName` מבנה, FFI
  השם יהיה `StructName__inherent_fn`.
- עבור `MethodName` שיטה מה `TraitName` תכונה ב
  `StructName` מבנה, FFI השם יהיה
  `StructName__TraitName__MethodName`.
- כדי להגדיר את `field_name` שדה ב `StructName` מבנה, FFI
  שם פונקציה יהיה `StructName__set_field_name`.
- כדי לקבל את `field_name` שדה ב `StructName` מבנה, FFI
  שם פונקציה יהיה `StructName__field_name`.
- כדי לקבל את המשתנה `field_name` שדה ב `StructName` מבנה, FFI
  שם פונקציה יהיה `StrucuName__field_name_mut`.
- עבור החופשי `module_name::fn_name`, ה- FFI השם יהיה
  `module_name::__fn_name`.
- עבור המאפיינים שאינם גנטיים ומאפשרים לחלוק את
  יישום FFI (ראה `Clone` בהמשך) FFI השם יהיה
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
