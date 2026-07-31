---
translation_locale: uz
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Anonim bitimlar {#anonymous-transactions}

O ' zbekiston Respublikasining Iroha maxfiy aktivdan qurilgan
Operatsiyalar. O'rniga davlat hisobidan hisob raqamiga o'tkaziladigan transferlar
davlat summasi, pulka qiymati shieldli kitobga o'tadi va keyin sarflaydi
nol bilimni isbotlaydigan shaffof notlar.

Umumiy kitobda hali ham maxfiy operatsiya sodir bo'lganligi qayd etilgan.
majburiyatlarni, bekor qiluvchilarni, dalillar hashlarini va hodisalarni qayd etadi, ammo u
nota egasi, oluvchisi yoki to'liq to'lovlar uchun miqdorni yozib olish
O ' zgarishi. Odatiy tranzaksiya zarfida hali ham taqdim etilgan
hisob, shuning uchun "anonim" bu yerda anonim aktivlar harakatini anglatadi, avtomatik emas
tarmoq yoki hisob darajasida anonimlik.

## Qurilish bloklari {#building-blocks}

| Konsepsiya            | Ledgerning ifodalash usuli                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Qadoqlangan not      | Asosiy aktiv, miqdor, egasining ma'lumotlari va tasodifiylikni o'z ichiga olgan xususiy hamyon.                                   |
| Bandlik         | 32-baytlik ommaviy qiymat, uning maydonlarini oshkor qilmasdan notaga bog'liq.                                        |
| Nullatgich          | Notani sarflash paytida olinadigan 32 baytlik ommaviy qiymat. Iroha ikki marta sarflanishni oldini olish uchun takrorlangan bekor qiluvchilarni rad etadi. |
| Merkle ildizlari        | Asosiy aktivlarning majburiyat daraxtining yaqindagi ildizidir.                        |
| Ishonchli qo'shimcha   | A `ProofAttachment` tasdiqlash byetlari va tekshirish kalitining ma'lumotnomasi yoki o'z ichiga oluvchi tekshiruv kaliti mavjud.                 |
| Maxfiy tadbir | Katta hisobda sodir bo ' lgan voqealar: `ConfidentialEvent::Shielded`, `Transferred`, yoki `Unshielded`.                              |

Asosiy ko'rsatmalar quyidagicha:

- `RegisterZkAsset`: aktivni ZK-qudratli va bog'liq o'tkazish,
  shield va shieldsiz tekshirish kalitlari.
- `Shield`: davlat balansini debitatsiya qiladi va himoyalangan nota majburiyatlarini qo'shib beradi.
- `ZkTransfer`: qadoqlangan qog'ozlarni yangi qadoqlanadigan qog'ozlarga sarflaydi.
- `Unshield`: saqlangan qog'ozlarni sarflaydi va davlat hisobidan balansni kreditlaydi.
- `ScheduleConfidentialPolicyTransition` va
  `CancelConfidentialPolicyTransition`: aktivning maxfiyligini o'zgartirish
  siyosat boshqaruvi orqali amalga oshiriladi.

Asset ta'rifida shuningdek
[`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md).
To'sishlarni nazorat qiluvchi siyosat usuli:

| Modus              | Ma'nosi                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | Faqatgina odatiy davlat balanslari va o'tkazmalar qabul qilinadi.          |
| `Convertible`     | Foydalanuvchilar qiymatni davlat balanslari va qo'riqlangan notlar o'rtasida harakatlashi mumkin. |
| `ShieldedOnly`    | Assetlarni chiqarish va o'tkazmalar himoyalangan katta kitobda saqlanishi kerak.   |

## Ulardan qanday foydalanish mumkin {#how-to-use-them}

1. Validator nodlarida maxfiylikni qo'llab-quvvatlash imkonini beradi.
   tekshiruvchining orqa tomoni, faol tekshirish kalitlari, Poseidon/Pedersen parametrlari
   IDs, va maxfiy qoidalar versiyasi.
   maxfiy xususiyatlarning to'g'ri yo'qlangan taomlari.
2. Oʻz ichiga olgan maʼlumotlar va parametrlar toʻplamlarini nashr etish yoki qayd etish
   Kiritlar va operatorlar kalitlarga murojaat qilishlari kerak
   `VerifyingKeyId`, misol uchun `halo2/ipa:vk_transfer`.
3. Aktivni quyidagicha qayd etish ZK- qobiliyatli `RegisterZkAsset`, yoki a bosqichida
   siyosatdan o'tish `TransparentOnly` to `Convertible` yoki
   `ShieldedOnly`.
4. Davlat mablag'larini himoya qilish `Shield`. Pulka qogʻoz bilan bogʻliq .
   va qabul qiluvchi uchun kodlangan foydali yukni taqdim etmasdan oldin
   muomala.
5. Xususiy ravishda o ' tkazish `ZkTransfer`. Pul pulchasi bu borada dalillar yaratadi .
   kirish yozuvlariga egalik qiladi, kirish va chiqish qiymatlari muvozanatga ega bo'ladi va
   har bir sarflangan notani yaqindagi majburiyat daraxtiga bog'lab qo'yilgan.
6. Agar aktivlar siyosati ruxsat bersa, faqat qo'lga kiritiladi. `Unshield` ta'kidlaydi
   davlat summasi va oluvchi hisobvarag'i, xususiy notalarni bekor qiluvchi mablag'ni sarflaydi;
   va xususiy o'zgarish mahsulotlarini yaratishi mumkin.
7. Maxfiy hodisalarni o'qish, dalillar to'g'risidagi hujjatlar, bekor qiluvchi statusni o'qib audit qilish;
   va anonim depozitlar to ' g'risidagi yozuvlar tizilgan so ' rovlar orqali; Torii yakuniy nuqtalar.

## CLI Misollar {#cli-examples}

O ' zbekiston Respublikasi ZK CLI Qo'riqchi Minorasi Jamiyati tomonidan ko'rsatilayotgan ma'lumotlar
pulparchalar majburiyatlarni, shifrlangan foydali yuklarni va
hosil bo'lgan ko'rsatmalarni taqdim etishdan oldin portfel/prover kutubxonasi.

Hibridni ro'yxatdan o'tkazish ZK-qudratli aktiv:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Qadoqlangan not uchun shriftli shifrlangan fayzli yuk zarfini yaratish:

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

Dastlabki bog'liq bo'lgan shieldsiz JSON:

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

To'g'ri dalil baytlari konfiguratsiyalangan dalil orqa tomondan keladi.
Transaksiya fayzli yuk faqat ommaviy ma'lumotlarni va dalillar ilovalarini talab qiladi:

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

Anonim aktivlar garovida o'sha himoyalashtirilgan transfer mashinalari ishlatiladi
Partiyalar va depozit holati hali ham
kredit hisobini saqlab qolish, ammo moliyalashtirish, ozod qilish, bekor qilish va hal etish to'g'risidagi
qo'llash shieldlangan bekor qilish vositalarini va chiqish majburiyatlarini.

Ma'lumot uchun depozit ISI xulq-atvor va misollar, qarang
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#anonymous-escrow).

Hayot davri:

1. `OpenAnonymousAssetEscrow` qo'riqlangan mablag'lar bilan ta'minlanadi va bir
   garovga olish majburiyati.
2. `AcceptAnonymousAssetEscrow` xaridorni qayd etadi.
3. `MarkAnonymousEscrowPaymentSent` xaridorning to'lovni yuborganligi haqidagi hujjatlar
   zanjirdan tashqarida.
4. `ReleaseAnonymousAssetEscrow` xaridorga qarzdorlik majburiyatini sarflaydi
   ishlab chiqarish majburiyatlari.
5. `CancelAnonymousAssetEscrow` garov majburiyatini sotuvchisiga qaytaradi
   to'lov belgilab qo'yilmagan bo'lsa ishlab chiqarish majburiyatlari.
6. `OpenAnonymousEscrowDispute` va `ResolveAnonymousEscrowDispute` qo'llanma
   dalillar hashs va resolver tomonidan nazorat qilinadigan bo'linish bilan nizoli depozitlar.

Ushbu maʼlumotlar bilan bogʻliq boʻlgan anonim eskor savollaridan foydalaning .
[Savollar](/uz/reference/queries.md#escrow-and-proof-records) depozitni tekshirish
yozuvlar va statuslar.

## Matematika {#math}

Quyidagi belgilar maxfiy aktivlar oqimini tasvirlaydi.
faol aylanmani va parametrni ishlatish IDs aktiv siyosati va tekshiruvdan
reyestr, shuning uchun mijozlar majburiyatlarni, bekor qiluvchilarni va dalil baytlarini ko'rib chiqishlari kerak
pulmonaning/proverning shaffof bo'lmagan chiqindilari sifatida.

Qadoqlangan yozuv quyidagicha tasvirlanishi mumkin:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

qaerda `owner` qabul qiluvchi tomonidan ko'rilgan yoki sarflangan materialdan kelib chiqadi va
`rho` shuni ta'kidlash kerakki, tasodifiylik.

Yozuv majburiyati yashirin majburiyatdir:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Joriy maxfiy uzatish maydonlari uchun jamoatchilik kirish qismlari
qo'shimcha majburiyatlarni, bekor qiluvchilarni, Merkle ildizini, aktivni va zanjirni belgilash.
Duruvda bunday shakldagi majburiyat munosabatlari ta'minlanadi:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Xatcho'p sarflanganida, pulka bekor qiluvchi belgini oladi:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` Bu notani oshkor qilmaydi, lekin bu not uchun barqaror
va zanjir, shuning uchun Iroha bir xil bekor qiluvchi bilan ikkinchi xarajatni rad etish mumkin.

Bog'liqlik daraxti notalar mavjudligini isbotlaydi. Agar pulparast majburiyatni sarflasa
`C_i`, dalilda Merkle yo'nalishidagi xususiy `C_i` so ' nggi
ommaviy ildiz:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Qutqaruvdan to'siqsiz o'tkazish uchun dalil qiymatni ham tasdiqlaydi
saqlanishi:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Qo'riqlanmagan mablag' uchun davlat summasi:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

Taqdim etilgan dalilni quyidagicha qisqartirish mumkin:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

qaerda `public_inputs` majburiyatlar, bekor qiluvchilar, ildiz, aktiv belgisi,
Chain tag, va har qanday ommaviy qo'riqlanmagan miqdor. Shohid notani o'z ichiga oladi
miqdori, tasodifiylik, sarflash materiallari va Merkle yo'nalishlari.
ko'rsatkichlar va keyinchalik mutatsiyalar bo'yicha hisob qaydnomasini ishlab chiqarish majburiyatlarini qo'shish orqali;
kiritishlarni bekor qiluvchilarni sarflangan deb belgilash.

## Nima ommaviy bo'ladi {#what-is-public}

Anonim bitimlar har bir kuzatilishi mumkin bo'lgan faktni maxfiylashtirmaydi.
quyidagi ma'lumotlar hali ham ommaviy bo'lishi mumkin:

- Transaksiya hash, blok balandligi va buyurtma berish
- taqdim etuvchi bitim hokimiyati, agar arizada
  xususiy kirish punkti yoki relayer namunasi
- ishlatilayotgan aktiv ta'rifini
- bekor qiluvchi va chiqindi majburiyatlari
- isbot hashlari, tasdiqlash kalitining ma'lumotlari va ixtiyoriy paket hashlari
- davlat miqdori va oluvchi hisob raqami `Unshield`
- anonim depozit sotuvchi, xaridor, status, vaqt belgilari va dalillar hash

Ushbu ommaviy metadatalar biznesni oshkor qilmasligi uchun ilovalarni loyihalashtirish
Siz himoya qilishga harakat qilayotgan munosabat.

## Tegishli ma'lumot {#related-reference}

- [`AssetConfidentialPolicy`](/uz/reference/data-model-schema.md)
- [`ConfidentialEvent`](/uz/reference/data-model-schema.md)
- [`ProofAttachment`](/uz/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/uz/reference/data-model-schema.md)
- [Qimmatli qog'ozlarni saqlash va tasdiqlash so'rovlari](/uz/reference/queries.md#escrow-and-proof-records)
