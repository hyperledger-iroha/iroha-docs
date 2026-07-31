---
translation_locale: uz
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Anonim bitimlar {#anonymous-transactions}

Iroha da anonim tranzaksiyalar maxfiy aktivlar operatsiyalaridan tashkil etiladi. Ochiq miqdordagi hisobvaraqdan hisobvaraqqa o'tkaziladigan transferlarni yozishning o'rniga, pulka qiymati himoyalangan katta kitobga o'tadi va so'ngra nol bilimli dalillar bilan shaffof notlarni sarflaydi.

Umumiy kitobda hali ham maxfiy operatsiya sodir bo'lganini qayd etadi. U majburiyatlarni, bekor qiluvchilarni, dalillar hashlarini va hodisalarni qayd qiladi, ammo notaning egasi, qabul qiluvchisi yoki shield-to-shield harakatlari uchun miqdorni qayd qilmaydi. Oddiy tranzaksiya qadoqchasi hali ham taqdim etuvchi hisobotni oshkor qilishi mumkin, shuning uchun "anonim" bu yerda anonim aktivlar harakatini anglatadi va tarmoq darajasidagi yoki hisob darajasidagi avtomatik anonimlikni anglatmaydi.

## Qurilish bloklari {#building-blocks}

|Konsepsiya |Ledgerning koʻrsatkichi |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Qadoqlangan notasi|Muruvni, miqdorni, egasining ma'lumotlarini va tasodifiylikni o'z ichiga olgan xususiy hamyon yozuvi.|
|Bagʻishlanish |32 baytli umumiy qiymat, uning maydonlarini oshkor qilmasdan notaga bog'liq. |
|Nulllashtiruvchi |Iroha ikki marta sarflanmaslikni oldini olish uchun takrorlangan bekor qiluvchilarni rad etadi. |
|Merkle ildizlari |Asosiy aktivlarning majburiyat daraxtining yaqindagi ildizidir.|
|Ishonchli qoʻshish |`ProofAttachment`da dalil baytlari va tasdiqlash kalitining ma'lumotnomasi yoki chiziqdagi tekshirish kalitini o'z ichiga olgan. |
|Maxfiy voqea |`ConfidentialEvent::Shielded`, `Transferred` yoki `Unshielded` kabi katta daftardagi hodisa. |

Asosiy ko'rsatmalar quyidagicha:

- `RegisterZkAsset`: aktivni ZK qobiliyatiga ega sifatida ro'yxatdan o'tkazadi va transfer, shield va shieldsiz tekshirish kalitlarini bog'laydi.
- `Shield`: davlat balansini debitatsiya qiladi va himoyalangan nota majburiyatlarini qo'shib beradi.
- `ZkTransfer`: qo'lga kiritilgan qog'ozlarni yangi qo'lga olingan qog'ozlarga sarflaydi.
- `Unshield`: himoyalangan qog'ozlarni sarflaydi va davlat hisobidan qoldiqni kreditlaydi.
- `ScheduleConfidentialPolicyTransition` va `CancelConfidentialPolicyTransition`: aktivning maxfiylik siyosatini boshqaruv orqali o'zgartirish.

Asset ta'rifida shuningdek: [`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md). To'sishlarni nazorat qiluvchi siyosat usuli haqiqiy:

|Modus |Maʼnosi |
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Faqatgina oddiy davlat balanslari va o'tkazmalar qabul qilinadi. |
|`Convertible` |Foydalanuvchilar qiymatni ommaviy balanslar va qo'riqlangan qog'ozlar o'rtasida o'tkazishi mumkin. |
|`ShieldedOnly` |Assetlarni chiqarish va o'tkazmalar himoyalangan kitobda qolishi kerak. |

## Ulardan qanday foydalanish mumkin {#how-to-use-them}

1. Validator nodlarda maxfiylikni qo'llab-quvvatlashni o'zlashtiring. Validatorlar tekshiruvchining orqa tomoni, faol tekshirish kalitlari, Poseidon/Pedersen parametrlari IDs va maxfiy qoidalar versiyasi bo'yicha kelishuvga erishishlari kerak.
2. Circuitlarda ishlatiladigan tekshirish kalitlari va parametrlar to'plamlarini e'lon qilish yoki qayd etish. `VerifyingKeyId`, misol uchun `halo2/ipa:vk_transfer`.
3. Aktivni ZK-qudratli sifatida `RegisterZkAsset` bilan ro'yxatdan o'tkazing yoki `TransparentOnly` dan `Convertible` yoki `ShieldedOnly` ga siyosat o'tishining bosqichini ko'rsating.
4. Umumiy mablag'larni `Shield` bilan himoya qiling. Pulchka tranzaksiyani taqdim etishdan oldin oluvchi uchun nota majburiyatini va shifrlangan foydali yukni yaratadi.
5. `ZkTransfer` bilan xususiy ravishda o'tkazib yuborish. Pulka kirish yozuvlariga egaligi, kirish va chiqish qiymatlari muvozanati va har bir sarflangan yozuv so'nggi majburiyat daraxtiga asoslanganligini isbotlaydi.
6. `Unshield` ommaviy miqdorni va oluvchi hisobini oshkor qiladi, xususiy notalarni bekor qiluvchi mablag'ni sarflaydi va xususiy o'zgarishlarni yaratishi mumkin.
7. Maxfiy hodisalarni, dalillar yozuvlarini, bekor qiluvchi statusini va anonim depozit yozuvlarini Torii oxirgi nuqtalari orqali o'qish orqali audit qilish.

## CLI Misollar {#cli-examples}

ZK CLI buyruqlari operator va sinov oqimlari uchun mo'ljallangan. Ishlab chiqarish hamyonlari natijada ko'rsatmalarni taqdim etishdan oldin majburiyatlarni, shifrlangan faydali yuklarni va sertifikatlarni hammon/prover kutubxonasi bilan hosil qilishlari kerak.

Hybrid ZK -ga ega bo'lgan aktivni ro'yxatdan o'tkazish:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Qadoqlangan nota uchun shriftli shifrlangan fayzli yuk zarfini yaratish:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Davlat mablag'larini aktivning himoya qilingan katta kitobiga qo'yish:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Qutqaruvli qo'llanma JSON:

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

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK Misol {#sdk-example}

To'g'ri dalil bytlari konfiguratsiyalangan dalil orqa tomondan keladi. Transaksiya faydali yuk faqat ommaviy kirish va dalil ilovalariga ega:

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

## Anonim aktivlar depozitasi {#anonymous-asset-escrow}

Anonim aktivlar garovida saqlangan qiymat uchun bir xil himoyalangan o'tkazib berish mashinasi ishlatiladi. Tomonlar va garov holatlari hali ham garovda qayd etiladi, ammo moliyalashtirish, ozod qilish, bekor qilish va hal etish yo'nalishlarida himoya qilingan nullifierlar va ishlab chiqarish majburiyatlaridan foydalanadi.

ISI eskorning xatti-harakati va misollar haqida batafsil ma'lumot olish uchun [ Native Asset Escrow](/uz/blockchain/escrow.md#anonymous-escrow) ni ko'ring.

Hayot davri quyidagicha:

1. `OpenAnonymousAssetEscrow` himoyalangan moliyalashtirish notlarini sarflaydi va bir depozit majburiyatini yaratadi.
2. `AcceptAnonymousAssetEscrow` xaridorni qayd etadi.
3. `MarkAnonymousEscrowPaymentSent` xaridorning to'lovni zanjirdan tashqarida yuborganini qayd etadi.
4. `ReleaseAnonymousAssetEscrow` garov majburiyatlarini xaridor ishlab chiqarish majburiyatlar uchun sarflaydi.
5. `CancelAnonymousAssetEscrow` to'lov belgilab qo'yilmagan bo'lsa, depozit majburiyatini sotuvchining ishlab chiqarish majburiyatiga qaytaradi.
6. `OpenAnonymousEscrowDispute` va `ResolveAnonymousEscrowDispute` nizoli garovlarni dalillar hashlari va hal qiluvchining nazoratida bo'lgan ajratish bilan boshqarish.

[Savollar ](/uz/reference/queries.md#escrow-and-proof-records)-da ko'rsatilgan anonim depozit so'rovlaridan foydalanib, depozit yozuvlari va statuslarini tekshiring.

## Matematika {#math}

Quyidagi notatsiya maxfiy aktiv oqimini tasvirlaydi. Amalga oshirishlar aktiv siyosati va tasdiqlovchi ro'yxatidan IDs faol aylanmasi va parametridan foydalanadi, shuning uchun mijozlar majburiyatlarni, bekor qiluvchilarni va dalil baytlarini qopchiq / provatorning shaffof chiqindilari sifatida ko'rib chiqishlari kerak.

Qadoqlangan notani quyidagicha tasvirlash mumkin:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` oluvchining ko'rish yoki sarflash materialidan kelib chiqqan bo'lsa, `rho` esa tasodifiylik deb ta'kidlanadi.

Yozuv majburiyati - bu yashirin majburiyat:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Joriy maxfiy uzatish maydonlari uchun ommaviy kirishlar nota majburiyatlari, bekor qiluvchi, Merkle ildiz, aktiv belgisi va zanjir belgisini o'z ichiga oladi. Maydon bunday shakldagi majburiyat munosabatini qo'llaydi:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Xatcho'p sarflanganida, pulka bekor qiluvchi belgini oladi:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ommaviy. U notani oshkor qilmaydi, lekin bu nota va zanjir uchun barqaror, shuning uchun Iroha bir xil bekor qiluvchi bilan ikkinchi sarfni rad qilishi mumkin.

Bag'ishlov daraxti not mavjudligini isbotlaydi. Agar pulka `C_i` bag'ishlovni sarflasa, dalil `C_i` dan so'nggi ommaviy ildizgacha bo'lgan xususiy Merkle yo'lini o'z ichiga oladi:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Qo'riqlangan to'siqdan qo'riqlangan o'tkazuv uchun dalil qiymatni saqlab qolishni ham ta'minlaydi:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Qo'llanma bo'lmagan sumka uchun:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

Taqdim etilgan dalillarni quyidagicha qisqartirish mumkin:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

`public_inputs` bo'lgan majburiyatlar, nullifikatorlar, ildiz, aktiv belgisi, zanjir belgisi va har qanday ommaviy qo'riqlanmagan summani ko'rsatadi. Shahodat not miqdorlarini, tasodifiylikni, xarajat materialini va Merkle yo'llarini o'z ichiga oladi. Validatorlar dalilni tasdiqlaydilar, so'ngra chiqish majburiyatlarini qo'shish va kirish bekor qiluvchilarni sarflangan sifatida belgilash orqali kitob holatini o'zgartiradilar.

## Hammaga ma'lum narsa {#what-is-public}

Anonim bitimlar har bir kuzatuvli faktni maxfiylashtirmaydi. Quyidagi ma'lumotlar hali ham ommaviy bo'lishi mumkin:

- Transaksiya hash, blok balandligi va buyurtma berish
- taqdim etuvchi bitim hokimiyati, agar ariza xususiy kirish punkti yoki relayer namunasiga ega bo'lmasa;
- qo'llanilayotgan aktiv ta'rifi
- nullifiers va ishlab chiqarish majburiyatlari
- tasdiqlovchi hashlar, tasdiqlash kalitlari bo'yicha ma'lumotlar va ixtiyoriy xashlar
- `Unshield` uchun davlat summasi va oluvchi hisob raqami
- Anonim garov sotuvchi, xaridor, holati, vaqt belgilari va dalillar hash

Ilovalarni loyihalashtirish, shunda ushbu ommaviy metadata siz himoya qilmoqchi bo'lgan ishbilarmonlik munosabatlarini oshkor etmaydi.

## Bog'liq ma'lumot {#related-reference}

- [`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md)
- [`ConfidentialEvent`](/uz/reference/data-model-schema.md)
- [`ProofAttachment`](/uz/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/uz/reference/data-model-schema.md)
- [Garov va dalillar so'rovlari](/uz/reference/queries.md#escrow-and-proof-records)
