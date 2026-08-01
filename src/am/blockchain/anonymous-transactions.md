---
translation_locale: am
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የማይታወቁ ግብይቶች {#anonymous-transactions}

በ Iroha ውስጥ ስም አልባ ግብይቶች ከመደበኛው የንብረት ኦፕሬሽኖች የተገነቡ ናቸው ። አንድ ቦርሳ ከህዝብ ሂሳብ ወደ ሂሳብ ማስተላለፎችን ከሕዝባዊ መጠን ጋር ከመጻፍ ይልቅ ዋጋውን ወደ ተከላካይ መቁጠሪያ ያስገባል እና ከዚያ ደግሞ ግልጽ ያልሆኑ ማስታወሻዎችን ከዜሮ ዕውቀት ማስረጃዎች ጋር ያወጣል ።

የሕዝብ መቁጠሪያ አሁንም ቢሆን ምስጢራዊ ክወና እንደተከናወነ ይመዝግባል። ግዴታዎች ፣ መሰረዞች ፣ የማረጋገጫ ሃሽዎች እና ክስተቶች ይመዘገባል ፣ ነገር ግን ማስታወሻውን ባለቤት ፣ ተቀባዩ ወይም ከተከላከለው ወደ የተከላከለው እንቅስቃሴ መጠን አይመዘገብም ። የተለመደው የግብይት ፖስታ አሁንም የሚያቀርበውን አካውንት ሊገልጥ ይችላል ፣ ስለሆነም እዚህ ላይ "አልታወቀ" ማለት የአውቶማቲክ አውታረመረብ ወይም የመለያ ደረጃ የማይታወቅነት ሳይሆን ማንነቱ ያልታወቀ ንብረት እንቅስቃሴን ያመለክታል ።

## የግንባታ ዕቃዎች {#building-blocks}

|ጽንሰ ሐሳብ|የመቁጠሪያ ማስያዣ |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|የተጠበቀ ማስታወሻ |የግል የኪስ ቦርሳ መዝገብ አንድ ንብረት, መጠን, ባለቤት መረጃ, እና የዘፈቀደነት ይዟል. |
|ቁርጠኝነት |የ 32 ባይት የሕዝብ ዋጋ አንድን ማስታወሻ ሳያሳዩ መስኮቱን ይፋ ያደርገዋል.|
|ማባከን |ማስታወሻ ሲወጣ የሚመነጨው የ32 ባይት የህዝብ ዋጋ። Iroha ድርብ ወጪን ለመከላከል ተደጋጋሚ ነባሪዎችን ውድቅ ያደርጋል.|
|የሜርክል ሥር |የአክሲዮኑ የዋጋ ግዴታ ዛፍ የቅርብ ጊዜ ሥር ነው። ማስረጃዎች ያገለገሉትን ማስታወሻዎች መኖርን ለማሳየት ይጠቀማሉ። |
|የመረጃ ማያዣ |አንድ `ProofAttachment` የዳሰሳ ጥቆማ ባይት እና የማረጋገጫ ቁልፍ ማጣቀሻ ወይም የመስመር ላይ የማረጋገጫ አዝራር ያለው። |
|ሚስጥራዊ ክስተት |እንደ `ConfidentialEvent::Shielded` ፣ `Transferred` ወይም `Unshielded` የመሳሰሉ ዋና ክስተቶች።|

ዋናዎቹ መመሪያዎች የሚከተሉት ናቸው-

- `RegisterZkAsset`: ንብረትን እንደ ZK-አቅም ያለው መዝገብ ያስገባል እንዲሁም የማስተላለፍ ፣ የመከላከያ እና ያልተከላከሉ የማረጋገጫ ቁልፎችን ይይዛል።
- `Shield`: የሕዝብ ሚዛን ይከፈላል እና የተጠበቀ ማስታወሻ ግዴታ ይጨምራል.
- `ZkTransfer`: የተከማቹ ማስታወሻዎችን ወደ አዲስ የተከማቸ ማስታወሻ ግዴታዎች ያወጣል.
- `Unshield`: የተጠበቁ ማስታወሻዎችን ያወጣል እንዲሁም የህዝብ ሂሳብ ቀሪ ገንዘብን ይሰጣል.
- `ScheduleConfidentialPolicyTransition` እና `CancelConfidentialPolicyTransition`: በአስተዳደር አማካኝነት የንብረት ምስጢራዊነት ፖሊሲን ይለውጡ.

አንድ የንብረት ትርጉም ደግሞ [`AssetConfidentialPolicy`](/am/reference/data-model-schema.md) ይይዛል.

|ሁነታ|ትርጉም|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |የሚቀበሉት መደበኛ የሕዝብ ሂሳቦችና ማስተላለፎች ብቻ ናቸው። |
|`Convertible` |ተጠቃሚዎች ዋጋውን በሕዝብ ሚዛን እና በተጠበቁ ማስታወሻዎች መካከል ማንቀሳቀስ ይችላሉ ። |
|`ShieldedOnly` |የንብረት ልውውጥ እና ማስተላለፍ በተከማቸ መለያ ውስጥ መቆየት አለባቸው። |

## እንዴት መጠቀም እንደሚቻል {#how-to-use-them}

1. በማረጋገጫ አንጓዎች ላይ ምስጢራዊ ድጋፍን ያግኙ። ማረጋገጫ ሰጪዎች ስለ ተረጋግጣቢው የጀርባ አወጣጥ ፣ ስለ ንቁ የማረጋገጫ ቁልፎች ፣ ስለ ፖሲዶን / ፔድሰን መለኪያ IDs እና ስለ ምስጢራዊ ደንቦች ስሪት መግባባት አለባቸው ። አንጓዎች ባልተመሳሰሉ ምስጢራዊ ባህሪያት ዲጄስት ያላቸው እኩዮችን ወይም ብሎኮችን ውድቅ ያደርጋሉ.
2. የወረዳዎች የሚጠቀሙባቸውን የማረጋገጫ ቁልፎች እና መለኪያ ስብስቦችን ያትሙ ወይም ይመዝገቡ። ቦርሳዎች እና ኦፕሬተሮች ቁልፎችን በ `VerifyingKeyId` ፣ ለምሳሌ `halo2/ipa:vk_transfer` ማመልከት አለባቸው ።
3. ንብረቱን ZK-አቅም ያለው ሆኖ በ `RegisterZkAsset` ውስጥ ይመዝገቡ ወይም ከ `TransparentOnly` ወደ `Convertible` ወይም `ShieldedOnly` የፖሊሲ ሽግግር ያድርጉ።
4. የህዝብ ገንዘብን በ `Shield` ይከላከላል ። ቦርሳው ግብይቱን ከማቅረብዎ በፊት ለተቀባዩ ማስታወሻ ግዴታ እና የተመሰጠረ ጥቅማጥቅሞች ይፈጥራል ።
5. `ZkTransfer` ጋር በግል ማስተላለፍ. የኪስ ቦርሳው የመግቢያ ማስታወሻዎችን ባለቤት መሆኑን የሚያረጋግጥ ማስረጃ ይገነባል, የመግቢያ እና የውጤት እሴቶች ሚዛናዊ መሆናቸውን, እና እያንዳንዱ የተጠቀመ ማስታወሻ በቅርብ ጊዜ ውስጥ በተቀማጭ ዛፍ ላይ የተመሠረተ መሆኑን ያረጋግጣል
6. የንብረት ፖሊሲው ሲፈቅድ ብቻ ይከፍት። `Unshield` የሕዝብ መጠን እና ተቀባዩ ሂሳብ ይገልጻል, የግል ማስታወሻ አናሳ ያወጣል, እና የግል ለውጥ ውፅዓት መፍጠር ይችላሉ.
7. ምስጢራዊ ክስተቶችን ፣ የምስክር ወረቀቶችን ፣ የማያሻሽል ሁኔታን እና ማንነት የሌላቸውን የዋስትና መዝገቦችን በታይፕ መጠይቆች እና በ Torii መጨረሻ ነጥቦች በማንበብ ኦዲት ማድረግ።

## CLI ምሳሌዎች {#cli-examples}

የ ZK CLI ትዕዛዞች ለኦፕሬተር እና ለሙከራ ፍሰቶች የታሰቡ ናቸው ። የምርት ቦርሳዎች የተገኙትን መመሪያዎች ከማቅረባቸው በፊት ግዴታዎችን ፣ የተመሰጠረ ጥቅማጥቅሞችን እና ማስረጃዎችን በቦርሳ / የሙከራ ቤተ-መፃህፍት ማመንጨት አለባቸው።

ለ ZK የሃይብሪድ አቅም ያለው ንብረት መመዝገብ

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

ለታሸገው ማስታወሻ አንድ ስሪት የተመሰጠረ ጥቅል ጭነት envelope ይገንቡ:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

የሕዝብ ገንዘብን ወደ ንብረቱ የተጠበቀ መለያ ማስገባት:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

የመከላከያ ማሰሪያ JSON ያለው መከላከያ:

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

ትክክለኛው የማረጋገጫ ባይት ከተዋቀረው የማረጋገጫ ዳራ ይመጣል። የግብይት ጥቅማጥቅሙ የህዝብ ግብዓቶችን እና የማረጋገጫ ማያዣን ብቻ ይፈልጋል-

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

የማይታወቁ ንብረቶች ኤስሮው ለተከፈለበት ዋጋ ተመሳሳይ የተጠበቀ ማስተላለፊያ ማሽን ይጠቀማል ። ፓርቲዎች እና የኤስሮው ሁኔታ አሁንም በኤስሮ መዝገብ ውስጥ ተመዝግበው ይገኛሉ ፣ ግን የገንዘብ ድጋፍ ፣ መለቀቅ ፣ መሰረዝ እና የውሳኔ አሰጣጥ እግሮች የተከፈሉ ነባሪዎችን እና የውጤት ግዴታዎችን ይጠቀማሉ።

ለ ISI የኤስኮር ባህሪ እና ምሳሌዎች ዝርዝር መረጃ ለማግኘት [የአገር ውስጥ ሀብት ኤስኮር ](/am/blockchain/escrow.md#anonymous-escrow) ን ይመልከቱ ።

የሕይወት ዑደት:

1. `OpenAnonymousAssetEscrow` የተጠበቁ የገንዘብ ማስታወሻዎችን ያወጣል እና አንድ የዋስትና ቃልኪዳን ይፈጥራል ።
2. `AcceptAnonymousAssetEscrow` ገዢውን መዝገብ.
3. `MarkAnonymousEscrowPaymentSent` ገዢው ክፍያውን ከሰንሰለት ውጭ እንደላከ ይመዝግባል።
4. `ReleaseAnonymousAssetEscrow` የኤስሮው ግዴታውን ለገዢው የውጤት ግዴታዎች ያወጣል።
5. `CancelAnonymousAssetEscrow` የዋጋ ማስከበሪያ ግዴታውን ለሻጩ የውጤት ግዴታዎች መልሶ የሚወጣው ክፍያ ምልክት ባልተደረገበት ጊዜ ነው።
6. `OpenAnonymousEscrowDispute` እና `ResolveAnonymousEscrowDispute` በተከራከሩ ማስረጃዎች ሃሽስ እና በፈጣሪ ቁጥጥር የተደረገባቸው ክፍተቶችን ያካሂዳሉ.

በ [Queries ](/am/reference/queries.md#escrow-and-proof-records) ውስጥ የተዘረዘሩትን የማይታወቁ የኤስኮር መዝገቦችን እና ሁኔታዎችን ለመፈተሽ ይጠቀሙ።

## የሂሳብ {#math}

ከዚህ በታች ያለው ማስታወሻ ምስጢራዊ የንብረት ፍሰትን ይገልጻል። ትግበራዎች ከንብረት ፖሊሲ እና ከተረጋገጫ መዝገብ ውስጥ ንቁ መስመሩን እና መለኪያውን IDs ይጠቀማሉ ፣ ስለሆነም ደንበኞች ግዴታዎችን ፣ መሰረዞችን እና የማረጋገጫ ባይቶችን እንደ ቦርሳ / ፕሮፌሰር ግልፅ ያልሆኑ የውጤቶች መያዝ አለባቸው ።

የተጠበቀ ማስታወሻ እንደሚከተለው ሊገለጽ ይችላል:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` ከተቀባዩ ዕይታ ወይም ወጪ ቁሳቁስ የተገኘ ሲሆን `rho` ደግሞ የዘፈቀደነት ማስታወሻ ነው።

የምዝገባው ግዴታ የተደበቀ ግዴታ ነው።

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

ለአሁኑ ምስጢራዊ ማስተላለፊያ ወረዳዎች የህዝብ ግብዓቶች ማስታወሻ ግዴታዎችን ፣ ነባሪዎችን ፣ ሜርክል ሥርን ያካትታሉ ። የዋጋ መለያ፣ እና ሰንሰለት መለያ። የወረዳው ሥርዓት እንዲህ ዓይነቱን የግንኙነት ግንኙነት ያስፈጽማል-

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

አንድ ማስታወሻ ሲወጣ የኪስ ቦርሳው አሻራውን ያገኛል-

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ይፋዊ ነው። ማስታወሻውን አያሳይም ፣ ግን ለዚያ ማስታወሻ እና ሰንሰለት የተረጋጋ ነው ፣ ስለሆነም Iroha ተመሳሳይ ነባሪ ጋር ሁለተኛ ወጪን ውድቅ ማድረግ ይችላል።

የቃል ኪዳኑ ዛፍ ማስታወሻ መኖሩን ያረጋግጣል ። አንድ ቦርሳ ቃልኪዳን `C_i` የሚያወጣ ከሆነ ፣ ማስረጃው ከ `C_i` ጀምሮ እስከ ቅርብ የሆነ የህዝብ ስርጭት የግል ሜርክል መንገድን ያካትታል-

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

ከተከላከለው ወደ ተከላከለው ዝውውር፣ ማስረጃው የዋጋን መጠበቅንም ያስገድዳል፦

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

ለደህንነት ያልተጠበቀ ገንዘብ የሕዝብ መጠን ይካተታል-

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

የቀረበው ማስረጃ እንደሚከተለው ሊጠቃለል ይችላል፦

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

የት `public_inputs` ግዴታዎች, መሰረቶች, የንብረት መለያዎች, ሰንሰለት መለያዎች እና ማንኛውም ህዝባዊ ያልተጠበቀ መጠን ናቸው. ማረጋገጫ ሰጪዎች ማስረጃውን ያረጋግጣሉ ከዚያም የውጤት ግዴታዎችን በማከል እና የመግቢያ አሻራዎችን እንደ ወጪ በመለየት ዋና መቁጠሪያውን ሁኔታ ይለውጣሉ።

## በይፋ የሚታየው ነገር {#what-is-public}

የማይታወቁ ግብይቶች የሚታዩትን ሁሉንም እውነታዎች የግል አያደርጉም። የሚከተሉት መረጃዎች አሁንም በይፋ ሊገኙ ይችላሉ:

- የግብይት ሃሽ፣ የብሎክ ቁመት እና ትዕዛዝ
- ማመልከቻው የግል የመግቢያ ነጥብ ወይም ዳግም ማስቀመጫ ንድፍ የሚጠቀምበት ካልሆነ በስተቀር ላቀረበው የግብይት ባለስልጣን
- ጥቅም ላይ የዋለው የአክሲዮን ትርጉም
- የሽያጭ ማስወገጃዎች እና የውጤት ግዴታዎች
- የማረጋገጫ ሃሽዎች ፣ የማረጋገጫ ቁልፍ ማጣቀሻዎች እና አማራጭ የ envelope ሀሽዎች
- ለ `Unshield` የህዝብ መጠን እና ተቀባይነት ያለው ሂሳብ
- ስም አልባ የኤስሮው ሻጭ ፣ ገዢ ፣ ሁኔታ ፣ የጊዜ ማህተሞች እና የምስክር ወረቀት ሃሽ

አፕሊኬሽኖችን ዲዛይን ያድርጉ ስለዚህ ይህ የህዝብ ሜታዳታ እርስዎ ለመጠበቅ እየሞከሩ ያለውን የንግድ ግንኙነት አያሳይም።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [`AssetConfidentialPolicy`](/am/reference/data-model-schema.md)
- [`ConfidentialEvent`](/am/reference/data-model-schema.md)
- [`ProofAttachment`](/am/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/am/reference/data-model-schema.md)
- [የመጠባበቂያ እና የማረጋገጫ መጠይቆች ](/am/reference/queries.md#escrow-and-proof-records)
