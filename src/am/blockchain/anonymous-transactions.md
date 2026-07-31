---
translation_locale: am
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ስም አልባ ግብይቶች {#anonymous-transactions}

ስም አልባ ግብይቶች Iroha ከመደበኛው ንብረት የተገነቡ ናቸው
ከሕዝብ ወደ ገቢ የሚደረጉ የሂሳብ ማስተላለፊያዎችን ከመጻፍ ይልቅ
አንድ የኪስ ቦርሳ ዋጋውን ወደ የተከማቸ መቁጠሪያ ውስጥ በማስገባት ከዚያም ያወጣል
ከዜሮ እውቀት ማስረጃ ጋር ግልጽ ያልሆኑ ማስታወሻዎች።

የሕዝብ መለያዎች አሁንም ቢሆን አንድ ምስጢራዊ ክወና እንደተከናወነ ይመዝገቡ።
ግዴታዎችን፣ አሻራዎችን፣ የዳሰሳ ጥናቶችን እና ክስተቶችን ይመዝግባል፤ ነገር ግን አይ
የክፍያ ባለቤት ፣ ተቀባዩ ወይም ከክፍያ ወደ ክፍያ የሚሆን መጠን ይመዝገቡ
የተለመደው የግብይት ፖስታ አሁንም ማቅረቢያውን ሊገልጽ ይችላል
ሂሳብ፣ ስለዚህ "አልታወቀ" እዚህ ላይ ማለት ነው አልታወቀ ንብረት እንቅስቃሴ እንጂ ራስ-ሰር አይደለም
የአውታረ መረብ ወይም የሂሳብ ደረጃ ማንነት።

## የግንባታ ዕቃዎች {#building-blocks}

| ጽንሰ ሐሳብ            | የመቁጠሪያ ማስያዣ                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| የተጠበቀው ማስታወሻ      | አንድ ንብረት, መጠን, ባለቤት ውሂብ, እና የዘፈቀደነት የያዘ የግል ቦርሳ መዝገብ.                                   |
| ቁርጠኝነት         | መስኮቱን ሳያጋልጥ ለዜና የተሰጠ የ32 ባይት የህዝብ ዋጋ።                                        |
| አሻሽል          | ማስታወሻ ሲወጣ የሚመነጨው የ32 ባይት የህዝብ ዋጋ። Iroha ድርብ ወጪዎችን ለመከላከል ተደጋጋሚ ነባሪዎችን ውድቅ ያደርጋል። |
| የሜርክል ሥር        | የአክሲዮኑ ቁርጠኝነት ዛፍ በቅርብ ጊዜ የተገኘ ሥር፣ ማስረጃዎች ያገለገሉትን ማስታወሻዎች መኖራቸውን ለማሳየት ይጠቀማሉ።                        |
| የማረጋገጫ ማያዣ   | ሀ `ProofAttachment` የመረጃ ባይቶችን እና የማረጋገጫ ቁልፍ ማጣቀሻ ወይም የመስመር ላይ የማረጋገጫውን ቁልፍ ይ containsል።                 |
| ሚስጥራዊ ክስተት | እንደ መቁጠሪያ ክስተት `ConfidentialEvent::Shielded`, `Transferred`, ወይም `Unshielded`.                              |

ዋናዎቹ መመሪያዎች የሚከተሉት ናቸው:

- `RegisterZkAsset`: ንብረትን እንደ ZK-አቅም ያለው እና የሚጣበቅ ዝውውር፣
  መከላከያ እና ያልተጠበቁ የማረጋገጫ ቁልፎች።
- `Shield`: የሕዝብ ሚዛን ይከፈላል እንዲሁም የተጠበቀ ማስታወሻ ግዴታ ይጨምራል።
- `ZkTransfer`: የተጠበቁ ማስታወሻዎችን ወደ አዲስ የተጠበቁ የክፍያ ማስታወሻዎች ግዴታዎች ያወጣል.
- `Unshield`: የተጠበቁ ማስታወሻዎችን ያወጣል እንዲሁም የህዝብ ሂሳብ ቀሪ ገንዘብን ይሰጣል ።
- `ScheduleConfidentialPolicyTransition` እና
  `CancelConfidentialPolicyTransition`: የአንድ ንብረት ምስጢራዊነት መቀየር
  ፖሊሲው በመንግሥት አስተዳደር በኩል ነው።

የንብረት ማረጋገጫ
[`AssetConfidentialPolicy`](/am/reference/data-model-schema.md).
የፖሊሲ ሁነታ ፍሰቶችን የሚቆጣጠረው:

| ሁነታ              | ትርጉም                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` | የተለመዱ የሕዝብ ሂሳቦችና ዝውውሮች ብቻ ተቀባይነት አላቸው።          |
| `Convertible`     | ተጠቃሚዎች ዋጋውን በሕዝብ ሚዛኖች እና በተጠበቁ ማስታወሻዎች መካከል ማንቀሳቀስ ይችላሉ። |
| `ShieldedOnly`    | የንብረት ልውውጥ እና ማስተላለፍ በተከማቸ መለያ ውስጥ መቆየት አለባቸው።   |

## እንዴት መጠቀም እንደሚቻል {#how-to-use-them}

1. በማረጋገጫ አንቀጾች ላይ ምስጢራዊ ድጋፍን ያግኙ።
   የማረጋገጫ ዳግም ማስያዣ፣ ንቁ የማረጋገጫ ቁልፎች፣ Poseidon/Pedersen መለኪያ
   IDs, እና ምስጢራዊ ደንቦች ስሪት.
   የተዛመዱ ምስጢራዊ ባህሪያት።
2. የኤሌክትሮኒክ ማረጋገጫ ቁልፎችን እና በፓራሜትር ስብስቦችን ይፋ ያድርጉ ወይም ያስገቡ
   ቦርሳዎች እና ኦፕሬተሮች ቁልፎችን በ
   `VerifyingKeyId`, ለምሳሌ `halo2/ipa:vk_transfer`.
3. ንብረቱን እንደ ZK- ጋር ችሎታ ያለው `RegisterZkAsset`, ወይም ደረጃ ሀ
   የፖሊሲ ሽግግር `TransparentOnly` ወደ `Convertible` ወይም
   `ShieldedOnly`.
4. የህዝብ ገንዘብን በመከላከል `Shield`. የኪስ ቦርሳው ማስታወሻን ያደራጃል
   እና ተቀባዩ የሽያጭ አቅርቦቱን ከማቅረባቸው በፊት ለተቀባዩ የተመሰጠረ ጥቅማጥቅም ጭነት
   ግብይት.
5. የግል ማስተላለፍ `ZkTransfer`. የኪስ ቦርሳው ማስረጃ ይገነባል
   የመግቢያ ማስታወሻዎችን ባለቤት ነው ፣ የመግቢያ እና የውጤት እሴቶች ሚዛናዊ ናቸው ፣ እናም
   እያንዳንዱ የተነጠቀ ማስታወሻ በቅርብ ጊዜ በገባው ቃል ላይ የተመሠረተ ነው።
6. የንብረት ፖሊሲው ሲፈቅድ ብቻ ይለቅቃል። `Unshield` የሚገልጸው
   የህዝብ መጠን እና ተቀባዩ ሂሳብ፣ የግል ማስታወሻውን ያጠፋል ፣
   እና የግል ለውጥ ውፅዓት መፍጠር ይችላሉ.
7. ምስጢራዊ ክስተቶችን፣ የምስክር ወረቀቶችን፣ የማያሻሽል ሁኔታን በማንበብ ኦዲት ማድረግ፣
   እና በታይፕ መጠይቆች በኩል ስም አልባ የኤስሮ መዝገቦች እና Torii የመጨረሻ ነጥቦች.

## CLI ምሳሌዎች {#cli-examples}

የ ZK CLI ትዕዛዞቹ ለኦፕሬተር እና ለሙከራ ፍሰቶች የታሰቡ ናቸው ።
የኪስ ቦርሳዎች ግዴታዎች, የተመሰጠረ ጥቅማጥቅሞች, እና ማስረጃ ጋር ማመንጨት አለባቸው
የተገኙትን መመሪያዎች ከማቅረባቸው በፊት የቦርሳ/ፕሮጀክት ቤተ-መጽሐፍት።

የሃይብሪድ ምዝገባ ZK- አቅም ያለው ንብረት:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

የተከማቸ ማስታወሻ ለማግኘት አንድ ስሪት የተደበቀ ጥቅል ጭነት ፖስታ ይገንቡ:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

የሕዝብ ገንዘብን ወደ ንብረቱ የተከማቸ መለያ ማስገባት:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

የመከላከያ ማያዣ ያለው መከላከያ JSON:

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

## SDK ምሳሌ {#sdk-example}

ትክክለኛው ማስረጃ ባይት ከተዋቀረው ማስረጃ ዳግመኛ ይመጣል።
የግብይት ጥቅማጥቅሞች ለሕዝብ ግብዓቶች እና ለማረጋገጫ ማያዣ ብቻ ያስፈልጋሉ-

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

## የማይታወቁ ንብረቶች ማስከበሪያ {#anonymous-asset-escrow}

የማይታወቁ ንብረቶች ኤስሮ ተመሳሳይ የተከማቸ ማስተላለፊያ ማሽን ይጠቀማል
የፓርቲዎች እና ኤስሮ ሁኔታ አሁንም በ
የኤስኮር መዝገብ፣ ነገር ግን የገንዘብ ድጋፍ፣ መልቀቅ፣ መሰረዝ እና የማስተካከያ እግሮች
የተከላከሉ ማጣሪያዎችን እና የውጤት ግዴታዎች ይጠቀሙ።

ለዝርዝራዊ ማስከበሪያ ISI ባህሪ እና ምሳሌዎች, ተመልከት
[የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#anonymous-escrow).

የሕይወት ዑደት:

1. `OpenAnonymousAssetEscrow` የተጠበቁ የገንዘብ ማስታወሻዎችን ያወጣል እና አንድ ይፈጥራል
   የዋስትና ቃል ኪዳን።
2. `AcceptAnonymousAssetEscrow` ገዢውን መዝገብ።
3. `MarkAnonymousEscrowPaymentSent` ገዢው ክፍያውን እንደላከ መዝገቦች
   ከሰንሰለት ውጭ።
4. `ReleaseAnonymousAssetEscrow` የኤስሮው ግዴታውን ለገዢ ያወጣል
   የውጤት ግዴታዎች።
5. `CancelAnonymousAssetEscrow` የኤስሮው ግዴታውን ወደ ሻጩ ይመልሳል
   ክፍያ ካልተመዘገበ በኋላ የውጤት ግዴታዎች።
6. `OpenAnonymousEscrowDispute` እና `ResolveAnonymousEscrowDispute` መያዣ
   የተከራከሩ ማስረጃዎች እና መፍትሄ-የተቆጣጠረው ክፍፍል ያላቸው የዋስትና ወረቀቶች።

በ ውስጥ የተዘረዘሩትን የማይታወቁ የኤስሮ ጥያቄዎች ይጠቀሙ
[ጥያቄዎች](/am/reference/queries.md#escrow-and-proof-records) የኤስኮር ምርመራ ማድረግ
መዝገቦች እና ሁኔታዎች።

## የሂሳብ {#math}

ከዚህ በታች ያለው ማስታወሻ ሚስጥራዊ ንብረቶችን ፍሰት ይገልጻል.
ንቁ መስመሩን እና መለኪያውን ይጠቀሙ IDs ከንብረት ፖሊሲ እና ከተረጋገጠ
መዝገብ, ስለዚህ ደንበኞች ግዴታዎች, መሰረዝ እና ማስረጃ ባይት መያዝ አለባቸው
የኪስ ቦርሳ / ፕሮፖዛል ግልጽ ያልሆኑ የውጤቶች።

የተጠበቀ ማስታወሻ እንደሚከተለው ሊገለጽ ይችላል:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

የት `owner` ከተቀባዩ የዕይታ ወይም ወጪ ቁሳቁስ የተገኘ ሲሆን
`rho` የዘፈቀደነት ማስታወሻ ነው.

የክፍያ ቃል ኪዳን የተደበቀ ቃል ኪዳን ነው

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

ለአሁኑ ምስጢራዊ የማስተላለፊያ መስመሮች የህዝብ ግብዓቶች የሚከተሉትን ያካትታሉ
ማስታወሻ ግዴታዎች, ሰረዛዎች, አንድ Merkle ሥር, ንብረት መለያ, እና ሰንሰለት መለያ.
ሰርኩቱ እንዲህ ዓይነት የግንኙነት ግንኙነት ያስከትላል-

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

አንድ ማስታወሻ ሲወጣ የኪስ ቦርሳው አሻራ ይሰጠዋል

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ማስታወሻውን አይገልጽም, ነገር ግን ለዚያ ማስታወሻ የተረጋጋ ነው
እና ሰንሰለት, ስለዚህ Iroha ተመሳሳይ ነባሪ ጋር ሁለተኛ ወጪ ውድቅ ማድረግ ይችላሉ.

የቃል ኪዳኑ ዛፍ ማስታወሻውን መኖሩን ያረጋግጣል
`C_i`, ማስረጃው የግል ሜርክል መንገድን ያካትታል `C_i` በቅርቡ
የሕዝብ ሥር:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

ከተከላከለው ወደ ተከላከለው ዝውውር፣ ማስረጃው ዋጋውንም ያስገድዳል
ጥበቃ:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

ለማይከፈለው ገንዘብ የሕዝብ መጠን ይካተታል-

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

የቀረበው ማስረጃ እንደሚከተለው ሊጠቃለል ይችላል-

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

የት `public_inputs` ግዴታዎች፣ አሻራዎች፣ ሥር፣ ንብረት መለያ፣
የሥርዓቱ መለያ፣ እና ማንኛውም የሕዝብ ያልተጠበቀ መጠን።
ማረጋገጫዎች ያረጋግጣሉ
የ ማስረጃ እና ከዚያም የውጤት ግዴታዎች በመጨመር የመጽሐፉ ሁኔታን ይቀይሩ
የመግቢያ ማስያዣዎችን እንደ ወጪ ምልክት ማድረግ።

## በይፋ የሚታየው ነገር {#what-is-public}

ስም አልባ ግብይቶች የሚታዩትን ሁሉንም እውነታዎች የግል አያደርጉም።
የሚከተሉት መረጃዎች አሁንም በይፋ ሊገኙ ይችላሉ-

- የግብይት ሃሽ፣ የእንቁላል ቁመት እና ትዕዛዝ
- ማመልከቻው የግብይት ባለሥልጣኑን የሚያቀርብ ከሆነ
  የግል የመግቢያ ነጥብ ወይም ተለጣፊ ንድፍ
- ጥቅም ላይ የዋለው የአክሲዮን ትርጉም
- የሽያጭ ማስወገጃዎች እና የውጤት ግዴታዎች
- የማረጋገጫ ሃሽዎች፣ የማረጋገጫ ቁልፍ ማጣቀሻዎች እና አማራጭ የ envelope ሃሽዎች
- የሕዝብ መጠን እና ተቀባይነት ያለው ሂሳብ `Unshield`
- ስም አልባ የዋስትና ሻጭ ፣ ገዢ ፣ ሁኔታ ፣ የጊዜ ማህተሞች እና የምስክር ወረቀት ሃሽ

ይህ የህዝብ ሜታዳታ የንግድ ሥራን እንዳያጋልጥ መተግበሪያዎችን ዲዛይን
ለመጠበቅ የምትሞክሩት ግንኙነት።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [`AssetConfidentialPolicy`](/am/reference/data-model-schema.md)
- [`ConfidentialEvent`](/am/reference/data-model-schema.md)
- [`ProofAttachment`](/am/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/am/reference/data-model-schema.md)
- [የዋስትና እና ማስረጃ ጥያቄዎች](/am/reference/queries.md#escrow-and-proof-records)
