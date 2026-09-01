---
translation_locale: uz
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Anonim bitimlar {#anonymous-transactions}

Iroha-da anonim tranzaksiyalar maxfiy aktiv amallariga asoslanadi. Hisobdan hisobga ochiq miqdordagi o‘tkazmani yozish o‘rniga, hamyon qiymatni himoyalangan reyestrga o‘tkazadi va keyin maxfiy notalarni nol bilim isboti bilan sarflaydi.

Ommaviy reyestr maxfiy amal sodir bo‘lganini baribir qayd etadi. Unda majburiyatlar, nullifikatorlar, isbot xeshlari va hodisalar yoziladi, biroq himoyalangan qiymatning boshqa himoyalangan manzilga ko‘chishida nota egasi, oluvchi yoki miqdor qayd etilmaydi. Oddiy tranzaksiya konverti yuboruvchi hisobni baribir oshkor qilishi mumkin; shu sababli bu yerda “anonim” so‘zi tarmoq yoki hisob darajasidagi avtomatik anonimlikni emas, aktivning anonim ko‘chishini anglatadi.

## Qurilish bloklari {#building-blocks}

|Tushuncha |Reyestrdagi ko‘rinishi |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Himoyalangan nota |Aktiv, miqdor, egaga oid ma’lumot va tasodifiylikni o‘z ichiga olgan xususiy hamyon yozuvi.|
|Majburiyat |Nota maydonlarini oshkor qilmasdan unga bog‘lanadigan 32 baytli ochiq qiymat. |
|Nullifikator |Qayd sarflanganda hosil qilinadigan 32 baytli ochiq qiymat. Iroha ikki marta sarflashning oldini olish uchun takroriy nullifikatorlarni rad etadi. |
|Merkle ildizi |Aktiv majburiyatlari daraxtining yaqindagi ildizi. Isbotlar undan sarflangan notalar mavjudligini ko‘rsatish uchun foydalanadi. |
|Isbot ilovasi |Isbot baytlari hamda tekshirish kalitiga havola yoki ichki tekshirish kalitini o‘z ichiga olgan `ProofAttachment`. |
|Maxfiy hodisa |`ConfidentialEvent::Shielded`, `Transferred` yoki `Unshielded` kabi reyestr hodisasi. |

Asosiy ko‘rsatmalar quyidagilar:

- `RegisterZkAsset`: aktivni ZK imkoniyatiga ega sifatida ro‘yxatdan o‘tkazadi va o‘tkazish, himoyalash hamda himoyani olib tashlash kalitlarini bog‘laydi.
- `Shield`: ochiq balansdan mablag‘ni ayiradi va himoyalangan nota majburiyatini qo‘shadi.
- `ZkTransfer`: himoyalangan notalarni yangi himoyalangan nota majburiyatlariga sarflaydi.
- `Unshield`: himoyalangan notalarni sarflaydi va ochiq hisob balansini to‘ldiradi.
- `ScheduleConfidentialPolicyTransition` va `CancelConfidentialPolicyTransition`: aktivning maxfiylik siyosatini boshqaruv orqali o‘zgartiradi.

Aktiv ta’rifi [`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md) ni ham o‘z ichiga oladi. Siyosat rejimi qaysi jarayonlar yaroqli ekanini belgilaydi:

|Rejim |Ma’nosi |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Faqat odatiy ochiq balanslar va o‘tkazmalar qabul qilinadi. |
|`Convertible` |Foydalanuvchilar qiymatni ochiq balanslar va himoyalangan notalar o‘rtasida ko‘chirishi mumkin. |
|`ShieldedOnly` |Aktiv chiqarish va o‘tkazish amallari himoyalangan reyestrda qolishi shart. |

## Ulardan qanday foydalanish mumkin {#how-to-use-them}

1. Tasdiqlovchi tugunlarda maxfiylikni qo‘llab-quvvatlashni yoqing. Tasdiqlovchilar tekshiruvchi ichki tizim, faol tekshirish kalitlari, Poseidon/Pedersen parametrlari identifikatorlari va maxfiylik qoidalari versiyasi bo‘yicha kelishishi shart. Maxfiylik imkoniyatlari dayjesti mos kelmagan tugunlar yoki bloklar rad etiladi.
2. Sxemalarda ishlatiladigan tekshirish kalitlari va parametrlar majmualarini e’lon qiling yoki ro‘yxatdan o‘tkazing. Hamyonlar va operatorlar kalitga `VerifyingKeyId`, masalan `halo2/ipa:vk_transfer`, orqali murojaat qilishi kerak.
3. Aktivni `RegisterZkAsset` bilan ZK aktiv sifatida ro‘yxatdan o‘tkazing yoki siyosatni `TransparentOnly` dan `Convertible` yoxud `ShieldedOnly` ga bosqichli o‘tkazing.
4. Ochiq mablag‘larni `Shield` bilan himoyalang. Hamyon tranzaksiyani yuborishdan oldin oluvchi uchun nota majburiyati va shifrlangan foydali yukni yaratadi.
5. `ZkTransfer` bilan maxfiy o‘tkazma bajaring. Hamyon kirish notalariga egaligini, kirish va chiqish qiymatlari tengligini hamda har bir sarflangan nota yaqindagi majburiyatlar daraxtiga bog‘langanini isbotlaydi.
6. Aktiv siyosati ruxsat bergandagina himoyani olib tashlang. `Unshield` ochiq miqdor va oluvchi hisobni oshkor qiladi, xususiy nota nullifikatorini sarflaydi va xususiy qaytim majburiyatlarini yaratishi mumkin.
7. Tiplashtirilgan so‘rovlar va Torii yo‘nalishlari orqali maxfiy hodisalar, isbot yozuvlari, nullifikator holati hamda anonim eskrou yozuvlarini o‘qib tekshiring.

## CLI misollari {#cli-examples}

ZK CLI buyruqlari operator va sinov jarayonlari uchun mo‘ljallangan. Ishlab chiqarish hamyonlari hosil bo‘lgan ko‘rsatmalarni yuborishdan oldin majburiyatlar, shifrlangan foydali yuklar va isbotlarni hamyon/isbotlovchi kutubxonasi yordamida yaratishi kerak.

Gibrid ZK imkoniyatiga ega aktivni ro‘yxatdan o‘tkazing:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Himoyalangan nota uchun versiyalangan shifrlangan foydali yuk konvertini yarating:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI aktiv siyosati, tekshirish kalitlari metama’lumotlari va shifrlangan nota konvertini tayyorlaydi. Unda `shield` yoki `unshield` tranzaksiya quyi buyruqlari yo‘q. Bu ko‘rsatmalarni SDK yordamida tuzing va odatdagi narxi aniqlangan, imzolangan tranzaksiyalar sifatida yuboring.

Himoyani olib tashlash isbot ilovasi quyidagi ko‘rinishga ega:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON
```

## SDK misoli {#sdk-example}

Aniq isbot baytlari sozlangan isbot ichki tizimida yaratiladi. Tranzaksiya foydali yuki faqat ochiq kirishlar va isbot ilovasini o‘z ichiga olishi kerak:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## Anonim aktiv eskrousi {#anonymous-asset-escrow}

Anonim aktiv eskrousi eskrouga qo‘yilgan qiymat uchun ayni himoyalangan o‘tkazma mexanizmidan foydalanadi. Tomonlar va eskrou holati eskrou yozuvida baribir qayd etiladi, ammo mablag‘ kiritish, chiqarish, bekor qilish va nizoni hal qilish bosqichlarida himoyalangan nullifikatorlar hamda chiqish majburiyatlari ishlatiladi.

Eskrou ISI ko‘rsatmalarining ishlashi va misollari haqida batafsil ma’lumot uchun [Mahalliy aktiv eskrousi](/uz/blockchain/escrow.md#anonymous-escrow) bo‘limiga qarang.

Hayot davri quyidagicha:

1. `OpenAnonymousAssetEscrow` himoyalangan moliyalashtirish notalarini sarflaydi va bitta eskrou majburiyatini yaratadi.
2. `AcceptAnonymousAssetEscrow` xaridorni qayd etadi.
3. `MarkAnonymousEscrowPaymentSent` xaridor to‘lovni zanjirdan tashqarida yuborganini qayd etadi.
4. `ReleaseAnonymousAssetEscrow` eskrou majburiyatini xaridorning chiqish majburiyatlariga sarflaydi.
5. To‘lov yuborilgani belgilanmagan bo‘lsa, `CancelAnonymousAssetEscrow` eskrou majburiyatini sotuvchining chiqish majburiyatlariga qaytaradi.
6. `OpenAnonymousEscrowDispute` va `ResolveAnonymousEscrowDispute` dalil xeshlari hamda nizoni hal qiluvchi nazoratidagi taqsimot yordamida bahsli eskroularni boshqaradi.

[So‘rovlar](/uz/reference/queries.md#escrow-and-proof-records) bo‘limida keltirilgan anonim eskrou so‘rovlari orqali eskrou yozuvlari va holatlarini tekshiring.

## Matematika {#math}

Quyidagi belgilashlar maxfiy aktiv oqimini tasvirlaydi. Amalga oshirish aktiv siyosati va tekshiruvchilar reyestrida ko‘rsatilgan faol sxema hamda parametr identifikatorlaridan foydalanadi. Shu sababli mijozlar majburiyatlar, nullifikatorlar va isbot baytlarini hamyon/isbotlovchi yaratadigan shaffof bo‘lmagan natijalar deb qabul qilishi kerak.

Himoyalangan notani quyidagicha ifodalash mumkin:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Bu yerda `owner` oluvchining ko‘rish yoki sarflash ma’lumotidan hosil qilinadi, `rho` esa nota tasodifiyligidir.

Nota majburiyati qiymatni yashiruvchi majburiyatdir:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Joriy maxfiy o‘tkazma sxemalarining ochiq kirishlari nota majburiyatlari, nullifikatorlar, Merkle ildizi, aktiv tegi va zanjir tegini o‘z ichiga oladi. Sxema quyidagi ko‘rinishdagi majburiyat munosabatini ta’minlaydi:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Nota sarflanganda hamyon nullifikatorni hosil qiladi:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ommaviy. U notani oshkor qilmaydi, lekin bu nota va zanjir uchun barqaror, shuning uchun Iroha bir xil bekor qiluvchi bilan ikkinchi sarfni rad qilishi mumkin.

Majburiyatlar daraxti nota mavjudligini isbotlaydi. Hamyon `C_i` majburiyatini sarflasa, isbot `C_i` dan yaqindagi ochiq ildizgacha bo‘lgan maxfiy Merkle yo‘lini o‘z ichiga oladi:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Himoyalangan manzildan boshqa himoyalangan manzilga o‘tkazmada isbot qiymatning saqlanishini ham ta’minlaydi:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Himoyani olib tashlashda ochiq miqdor ham hisobga olinadi:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

Yuborilgan isbotni quyidagicha umumlashtirish mumkin:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

`public_inputs` tarkibiga majburiyatlar, nullifikatorlar, ildiz, aktiv tegi, zanjir tegi va himoyasi olib tashlanadigan har qanday ochiq miqdor kiradi. Guvoh nota miqdorlari, tasodifiylik, sarflash materiali va Merkle yo‘llarini o‘z ichiga oladi. Validatorlar isbotni tekshiradi, so‘ng chiqish majburiyatlarini qo‘shib va kirish nullifikatorlarini sarflangan deb belgilab reyestr holatini o‘zgartiradi.

## Qaysi ma’lumotlar ochiq {#what-is-public}

Anonim tranzaksiyalar kuzatiladigan barcha ma’lumotlarni maxfiy qilmaydi. Quyidagilar baribir ochiq bo‘lishi mumkin:

- tranzaksiya xeshi, blok balandligi va tartibi;
- ilova maxfiy kirish nuqtasi yoki retranslyator andozasidan foydalanmasa, tranzaksiyani yuboruvchi vakolat;
- ishlatilayotgan aktiv ta’rifi;
- nullifikatorlar va chiqish majburiyatlari;
- isbot xeshlari, tekshirish kalitlariga havolalar va ixtiyoriy konvert xeshlari;
- `Unshield` uchun ochiq miqdor va oluvchi hisob;
- anonim eskrou sotuvchisi, xaridori, holati, vaqt tamg‘alari va dalil xeshlari.

Ilovalarni shunday loyihalangki, bu ochiq metama’lumotlar siz himoya qilmoqchi bo‘lgan biznes munosabatlarini oshkor etmasin.

## Tegishli ma’lumotnomalar {#related-reference}

- [`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md)
- [`ConfidentialEvent`](/uz/reference/data-model-schema.md)
- [`ProofAttachment`](/uz/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/uz/reference/data-model-schema.md)
- [Eskrou va isbot so‘rovlari](/uz/reference/queries.md#escrow-and-proof-records)
