---
translation_locale: mn
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Сүлжээний ашиглалтын ач холбогдол {#keys-for-network-deployment}

Бүх сүлжээ нь үйлчлүүлэгчид, хамтын ажилтнууд, генезисийн гарын үсэг зурагч болон NPoS эсвэл Nexus профилийн хувьд BLS баталгаажуулагчийн тодруулгыг тодорхойлох ач холбогдолтой материалыг шаардаж байна.

## Хэрэглэгдэх түлхүүр {#where-keys-are-used}

- Хэрэглэгчийн гарын үсэг зурах түлхүүр `client.toml` -ийн `[account]` дэргэд хадгалагдаж байна.
- Хөдөлмөрийн хэрэгслийн `public_key` болон `private_key` зэрэглэлийн `config.toml` хоолонд ижил хүйстний тодруулгыг хадгалж байна.
- "Peer discovery" нь `trusted_peers`-д аль нэг өрсөлдөгчдийн олон нийтийн ач холбогдолтой.
- BLS баталгаажуулагч НПОС-ийн хувилбарын эзэмшилийн гэрчилгээг `trusted_peers_pop` -д хадгалах.
- Женезисийн гарын үсэг зурахад `[genesis].public_key` нь ижил төстэй конфигурацынд болон хамааралтай хувийн товчлоор гарын үсгийн гарын үүнд ашигладаг.

Орон нутгийн болон туршилтын хэрэглээний хувьд Kagami нь эдгээр файлуудыг нэгтгэн бүтээх болно:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Орчин үеийн сүлжээ эсвэл хувилбарын хувьд заасан урсгалыг ашиглах:

```bash
cargo run --bin kagami -- wizard
```

## Тус дуудлаганы хосууд {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Эрдэмтдийн хамтын ажиллагаа {#peer-consistency}

Бүх баталгаажуулагчид ижил үүсэл бүтээн байгуулалтын, топологийн, итгэхэд зориулсан олон нийтийн түлхүүр болон баталгаажуулагч PoPs талаар тохиролцох ёстой. Ганц алдаатай эсвэл ижил төстэй ач холбогдолгүй нь сүлжээг эхлүүлж, тохиролцоонд хүрэхээс сэргийлж болно.

Бизантийн гэмт хэргээс урьдчилан сэргийлэх хамгийн бага хэрэглээнд дор хаяж дөрвөн өрсөлдөгч ашиглах хэрэгтэй. Нөхөрч бүрийн өөрийн гэсэн хувийн түлхүүр байх ёстой, гэхдээ ижил итгэмжлэгдсэн өрсөлдөгчийн багц нь бүх өрсөлдөөнт хэрэгтэй.

## Хэрэглэгчдийн данс {#client-accounts}

`client.toml`-ийн үйлчлүүлэгчдийн данс аль хэдийн сүлжээ дээр байх ёстой. Энэ нь генезисийн манифестээр эсвэл дараагийн гүйлгээгээр бүртгэгдэж болно. Генезисийн гарын үсэг зурах тавиланг удаан хугацааны хэрэглээний данс болгон ашиглахаас зайлсхийх; Женезис хувилбарыг зөвхөн Женезисийн шатны үеэр ашигладаг бөгөөд үйлдвэрлэлийн үйлчлүүлэгчид өөрийн бүртгэл, үүргийг ашиглах ёстой.
