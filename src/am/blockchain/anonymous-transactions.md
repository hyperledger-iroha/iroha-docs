---
translation_locale: am
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ስም-አልባ ግብይቶች {#anonymous-transactions}

በ Iroha ውስጥ ማንነታቸው ያልታወቁ ግብይቶች የሚገነቡት ከሚስጥር የንብረት ስራዎች ነው። የኪስ ቦርሳ ከህዝብ ወደ መለያ የሚደረጉ ዝውውሮችን በህዝብ መጠን ከመመዝገብ ይልቅ ዋጋውን ወደ የተከለለ የብሎክቼይን መዝገብ ያስተላልፋል እና ከዚያም ዜሮ የእውቀት ማረጋገጫዎችን በመጠቀም ግልጽ ያልሆኑ ማስታወሻዎችን ያጠፋል።

የህዝብ blockchain መዝገብ አሁንም ሚስጥራዊ ክዋኔ መከናወኑን ይመዘግባል። የክሪፕቶግራፊያዊ ኮሚትመንቶችን፣ ናሊፋየሮችን፣ የማረጋገጫ ምስጠራ ሃሽዎችን እና ክስተቶችን ይመዘግባል፣ ነገር ግን የማስታወሻ ባለቤቱን፣ ተቀባዩን ወይም ከተከለለ-ወደ-መከላከያ ግብይቶች መጠን አይመዘግብም። የተለመደው የግብይት ዳታ ኮንቴይነር አሁንም የሚያስገባውን መለያ ሊያሳይ ይችላል፣ ስለዚህ እዚህ 'ስም-አልባ' ማለት ማንነቱ ያልታወቀ የንብረት እንቅስቃሴ እንጂ አውቶማቲክ የአውታረ መረብ ደረጃ ወይም የመለያ ደረጃ ማንነትን መደበቅ አይደለም።

## የግንባታ ብሎኮች {#building-blocks}

|ጽንሰ-ሐሳብ|የብሎክቼይን መዝገብ ውክልና|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|የተከለለ ማስታወሻ|ንብረት፣ መጠን፣ የባለቤት ውሂብ እና የዘፈቀደ የያዘ የግል የኪስ ቦርሳ መዝገብ።|
|ክሪፕቶግራፊያዊ ኮሚትመንት|መስኮቹን ሳይገልጥ በምስጠራ ከማስታወሻ ጋር የሚገናኝ ባለ 32 ባይት የህዝብ እሴት።|
|መሻር|ማስታወሻ ሲወጣ የሚገኝ ባለ 32-ባይት የህዝብ እሴት። Iroha ድርብ ወጪን ለመከላከል ተደጋጋሚ ናሊፋየሮችን ውድቅ ያደርጋል።|
|የመርክል ሥር|የንብረቱ ክሪፕቶግራፊያዊ ኮሚትመንት ዛፍ የቅርብ ጊዜ ስር። የወጡ ማስታወሻዎች መኖራቸውን ለማሳየት ማስረጃዎች ይጠቀሙበታል።|
|የማረጋገጫ አባሪ|የማረጋገጫ ባይት እና የማረጋገጫ-ቁልፍ ማመሳከሪያ ወይም የመስመር ውስጥ ማረጋገጫ ቁልፍ የያዘ `ProofAttachment`|
|ሚስጥራዊ ክስተት|እንደ `ConfidentialEvent::Shielded`፣ `Transferred` ወይም `Unshielded` ያሉ የብሎክቼይን መዝገብ ክስተት።|

ዋናዎቹ መመሪያዎች የሚከተሉት ናቸው

- `RegisterZkAsset` ንብረቱን እንደ ZK አቅም ይመዘግባል እና ማስተላለፍን፣ ጋሻን እና የማረጋገጫ ቁልፎችን ያስራል።
- `Shield` የህዝብ ቀሪ ሂሳብን ያስከፍላል እና የተከለለ ማስታወሻ ክሪፕቶግራፊያዊ ኮሚትመንትን ይጨምራል።
- `ZkTransfer` የተከለሉ ማስታወሻዎችን ወደ አዲስ የተከለለ ማስታወሻ ክሪፕቶግራፊያዊ ኮሚትመንቶች ያጠፋል።
- `Unshield` የተከለሉ ማስታወሻዎችን ያወጣል እና የህዝብ መለያ ቀሪ ሂሳብን ያሰድራል።
- `ScheduleConfidentialPolicyTransition` እና `CancelConfidentialPolicyTransition` የንብረቱን ሚስጥራዊ ፖሊሲ በአስተዳደር ይለውጡ።

የንብረት ፍቺም ይይዛል [`AssetConfidentialPolicy`](/am/reference/data-model-schema.md). የፖሊሲው ሁነታ የትኞቹ ፍሰቶች ትክክለኛ እንደሆኑ ይቆጣጠራል -

|ሞድ|ትርጉም|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly`|የተለመዱ የህዝብ ቀሪ ሒሳቦች እና ዝውውሮች ብቻ ይቀበላሉ።|
|`Convertible`|ተጠቃሚዎች በሕዝብ ቀሪ ሒሳቦች እና በተከለሉ ማስታወሻዎች መካከል እሴትን ሊያንቀሳቅሱ ይችላሉ።|
|`ShieldedOnly`|የንብረት አሰጣጥ እና ማስተላለፎች በተከለለው የብሎክቼይን መዝገብ ውስጥ መቆየት አለባቸው።|

## እነሱን እንዴት መጠቀም እንደሚቻል {#how-to-use-them}

1. በአረጋጋጭ አንጓዎች ላይ ሚስጥራዊ ድጋፍን አንቃ። አረጋጋጮች በአረጋጋጩ ጀርባ፣ በንቁ የማረጋገጫ ቁልፎች፣ በPoseidon/Pedersen መለኪያ መታወቂያዎች እና በሚስጥር ህጎች ስሪት ላይ መስማማት አለባቸው። አንጓዎች የአውታረ መረብ እኩዮችን ወይም የማይዛመድ ሚስጥራዊ ባህሪ ምስጠራ ዳይፈስት ያላቸውን ብሎኮች ውድቅ ያደርጋሉ።
2. በወረዳዎቹ የሚጠቀሙባቸውን የማረጋገጫ ቁልፎችን እና የመለኪያ ስብስቦችን ያትሙ ወይም ይመዝገቡ። የኪስ ቦርሳዎች እና ኦፕሬተሮች ቁልፎችን በ `VerifyingKeyId` ማመልከት አለባቸው፣ ለምሳሌ `halo2/ipa:vk_transfer`።
3. ንብረቱን እንደ ZK አቅም በ`RegisterZkAsset` ያስመዝግቡ ወይም ከ`TransparentOnly` ወደ `Convertible` ወይም `ShieldedOnly` የፖሊሲ ሽግግር ያድርጉ።
4. የህዝብ ገንዘቦችን በ`Shield` ይከላከሉ። የኪስ ቦርሳው ግብይቱን ከማቅረቡ በፊት ለተቀባዩ ማስታወሻ ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋ እና የተመሰጠረ ጭነት ይፈጥራል።
5. በ`ZkTransfer` በግል ያስተላልፉ። የኪስ ቦርሳው የግቤት ማስታወሻዎች ባለቤት መሆኑን፣ የግብአት እና የውጤት እሴቶቹ የቀሪ ሒሳብ መሆናቸውን እና እያንዳንዱ የወጪ ማስታወሻ በቅርብ ጊዜ ክሪፕቶግራፊያዊ ኮሚትመንት ዛፍ ላይ እንደተጣበቀ ማረጋገጫ ይፈጥራል።
6. የንብረት ፖሊሲው ሲፈቅድ ብቻ መከላከያን ያንቀሳቅሱ። `Unshield` የህዝብ መጠን እና የተቀባዩ ሂሳብን ያሳያል፣ የግል ማስታወሻውን ያጠፋል እና የግል ለውጥ ውጤቶችን መፍጠር ይችላል።.
7. ሚስጥራዊ ክስተቶችን፣ የማረጋገጫ መዝገቦችን፣ የዋጋ ሁኔታን እና ማንነታቸው ያልታወቁ የዋስትና መዝገቦችን በተተየቡ መጠይቆች እና Torii API የመጨረሻ ነጥቦችን በማንበብ ኦዲት ያድርጉ።

## CLI ምሳሌዎች {#cli-examples}

የ ZK CLI ትዕዛዞች ለኦፕሬተር እና ለሙከራ ፍሰቶች የታሰቡ ናቸው። የማምረቻ ቦርሳዎች የተገኙትን መመሪያዎች ከማስገባትዎ በፊት ክሪፕቶግራፊያዊ ኮሚትመንቶችን፣ የተመሰጠሩ ጭነቶችን እና ማረጋገጫዎችን ከኪስ ቦርሳ/ፕሮቨር ቤተ-መጽሐፍት ጋር ማመንጨት አለባቸው።

ድብልቅ ZK አቅም ያለው ንብረት ይመዝገቡ -

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

ለተከለለው ማስታወሻ የተመሰጠረ የተመሰጠረ ጭነት ውሂብ መያዣ ይገንቡ -

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI የንብረት ፖሊሲውን፣ የማረጋገጫ-ቁልፍ ማጣቀሻዎችን እና የተመሰጠረ የማስታወሻ ውሂብ መያዣን ያዘጋጃል። `shield` ወይም `unshield` የግብይት ንዑስ ትዕዛዞችን አያጋልጥም። እነዚያን መመሪያዎች በ SDK ይገንቡ እና እንደ ተራ የተፈረመ ግብይት ከክፍያ ዋጋ ግምት ጋር ያቅርቡ።

ያልተሸፈነ የማረጋገጫ አባሪ ይህ ቅርጽ አለው -

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

## SDK ምሳሌ {#sdk-example}

ትክክለኛው የማረጋገጫ ባይት የሚመጣው ከተዋቀረው የማረጋገጫ ጀርባ ነው። የግብይቱ ጭነት የህዝብ ግብዓቶችን እና የማረጋገጫ አባሪውን ብቻ ይፈልጋል -

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

## ስም-አልባ የንብረት Escrow {#anonymous-asset-escrow}

ስም-አልባ የንብረት escrow ተመሳሳይ የተከለለ የማስተላለፊያ ማሽነሪዎችን ለተቀመጠ እሴት ይጠቀማል። ተዋዋይ ወገኖች እና የ escrow ሁኔታ አሁንም በ escrow መዝገብ ውስጥ ተመዝግበዋል, ነገር ግን የገንዘብ ድጋፍ, መለቀቅ, መሰረዝ, እና የመፍትሄ የፋይናንሺያል ማስተላለፊያ ክፍሎች የተከለሉ ኑሊፋየሮችን እና የውጤት ክሪፕቶግራፊያዊ ኮሚትመንቶችን ይጠቀማሉ።

ለዝርዝር escrow ISI ባህሪ እና ምሳሌዎች፣ [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#anonymous-escrow) ይመልከቱ።

የሕይወት ዑደቱ የሚከተለው ነው-

1. `OpenAnonymousAssetEscrow` የተከለሉ የገንዘብ ማስታወሻዎችን ያጠፋል እና አንድ የማስያዣ ክሪፕቶግራፊያዊ ኮሚትመንት ይፈጥራል።
2. `AcceptAnonymousAssetEscrow` ገዢውን ይመዘግባል።
3. `MarkAnonymousEscrowPaymentSent` ገዢው ክፍያ ከሰንሰለት ውጪ እንደላከ ይመዘግባል።
4. `ReleaseAnonymousAssetEscrow` የ escrow ክሪፕቶግራፊያዊ ኮሚትመንት ዋጋን ለገዢ ውፅዓት ክሪፕቶግራፊያዊ ኮሚትመንቶችን ያጠፋል።
5. `CancelAnonymousAssetEscrow` ክፍያው ምልክት በማይደረግበት ጊዜ የ escrow ክሪፕቶግራፊያዊ ኮሚትመንትን ወደ ሻጩ የውጤት ክሪፕቶግራፊያዊ ኮሚትመንቶች ይመልሳል።
6. `OpenAnonymousEscrowDispute` እና `ResolveAnonymousEscrowDispute` አከራካሪ የሆኑ ማስያዣዎችን በማስረጃ ምስጠራ ሃሽ እና በመፍቺ ቁጥጥር ስር ያለ ክፍፍል ይያዛሉ።

የ escrow መዝገቦችን እና ሁኔታዎችን ለመመርመር በ[መጠይቆች](/am/reference/queries.md#escrow-and-proof-records) ውስጥ የተዘረዘሩትን ማንነታቸው ያልታወቁ የዋስትና መጠይቆችን ይጠቀሙ።

## ሒሳብ {#math}

ከታች ያለው ማስታወሻ ሚስጥራዊ የንብረት ፍሰትን ይገልጻል። ትግበራዎች ከንብረቱ ፖሊሲ እና አረጋጋጭ መዝገብ ቤት የነቃ ወረዳ እና መለኪያ መታወቂያዎችን ይጠቀማሉ፣ ስለዚህ ደንበኞች የክሪፕቶግራፊያዊ ኮሚትመንቶችን፣ ናሊፋየሮችን እና የማረጋገጫ ባይቶችን እንደ የኪስ ቦርሳ/አረጋጋጭ ግልጽ ያልሆኑ ውጤቶች አድርገው መያዝ አለባቸው።

የተከለለ ማስታወሻ እንደሚከተለው ሊገለጽ ይችላል-

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` ከተቀባዩ እይታ ወይም ወጪ ቁሳቁስ የተገኘ ሲሆን `rho` ማስታወሻ የዘፈቀደ ነው።

የማስታወሻው ክሪፕቶግራፊያዊ ኮሚትመንት የተደበቀ ክሪፕቶግራፊያዊ ኮሚትመንት ነው -

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

ለአሁኑ ሚስጥራዊ የዝውውር ወረዳዎች፣ የህዝብ ግብዓቶች የማስታወሻ ክሪፕቶግራፊያዊ ኮሚትመንቶች፣ ኑሊፋየሮች፣ የመርክል ሥር፣ የንብረት መለያ እና የሰንሰለት መለያን ያካትታሉ። ወረዳው የዚህን ቅርጽ ክሪፕቶግራፊያዊ ኮሚትመንት ግንኙነት ያስፈጽማል -

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

ማስታወሻ ሲጠፋ የኪስ ቦርሳው ናሊፋየር ያገኛል -

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ይፋዊ ነው።. ማስታወሻውን አይገልጽም, ነገር ግን ለዚያ ማስታወሻ እና ሰንሰለት የተረጋጋ ነው, ስለዚህ Iroha በተመሳሳዩ ናሊፋየር ጋር ሁለተኛ ወጪን ውድቅ ማድረግ ይችላል.

የክሪፕቶግራፊያዊ ኮሚትመንት ዛፍ የማስታወሻ መኖሩን ያረጋግጣል። የኪስ ቦርሳ ክሪፕቶግራፊያዊ ኮሚትመንት `C_i` ካጠፋ፣ ማረጋገጫው ከ`C_i` ወደ የቅርብ ጊዜ የህዝብ ሥር የግል የሜርክል መንገድን ያካትታል።

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

ከተከለለ ወደ ተከለለ ዝውውር፣ ማረጋገጫው የእሴት መጠን እንዲጠበቅም ያስገድዳል፦

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

ላልተከላከለ፣ የህዝብ መጠን የሚከተሉትን ያካትታል -

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

የቀረበው ማስረጃ እንደሚከተለው ሊጠቃለል ይችላል-

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

`public_inputs` የክሪፕቶግራፊያዊ ኮሚትመንቶች፣ ናሊፋየሮች፣ ሥር፣ የንብረት መለያ፣ የሰንሰለት መለያ እና ማንኛውም የህዝብ መከላከያ መጠን ያሉበት። ምስክሩ የማስታወሻ መጠኖችን፣ የዘፈቀደነትን፣ የወጪ ቁሳቁስን እና የሜርክል መንገዶችን ይዟል። አረጋጋጮች ማረጋገጫውን ያረጋግጣሉ እና የውጤት ክሪፕቶግራፊያዊ ኮሚትመንቶችን በመጨመር እና የግቤት ናሊፋየሮችን እንደወጡ ምልክት በማድረግ የብሎክቼይን መዝገብ ሁኔታን ይለውጣሉ።

## ይፋዊ ምንድን ነው {#what-is-public}

ማንነታቸው ያልታወቁ ግብይቶች እያንዳንዱን የሚታይ እውነታ የግል አያደርጉም። የሚከተለው ውሂብ አሁንም ይፋዊ ሊሆን ይችላል።

- የግብይቱ ምስጠራ ሃሽ፣ የብሎክ ቁመት እና ማዘዣ
- አፕሊኬሽኑ የግል የመግቢያ ነጥብ ወይም የመልሶ ማቋቋም ስርዓተ-ጥለት ካልተጠቀመ በስተቀር የማስረከቢያ ግብይት ፈቃድ ባለቤት
- ጥቅም ላይ የዋለው የንብረት ፍቺ
- ቅጣቶች እና የውጤት ክሪፕቶግራፊያዊ ኮሚትመንቶች
- የምስጠራ ማስታወሻዎች፣ የማረጋገጫ-ቁልፍ ማጣቀሻዎች እና አማራጭ የውሂብ መያዣ ምስጠራ ሃሽ
- የህዝብ መጠን እና ተቀባይ መለያ ለ `Unshield`
- ስም-አልባ የዋስትና ሻጭ፣ ገዢ፣ ሁኔታ፣ የጊዜ ማህተሞች እና ማስረጃ ምስጠራ ሃሽዎች

ይህ ይፋዊ ሜታዳታ እርስዎ ለመጠበቅ እየሞከሩ ያለውን የንግድ ግንኙነት እንዳያሳይ አፕሊኬሽኖችን ይንደፉ።

## ተዛማጅ ማጣቀሻ {#related-reference}

- [`AssetConfidentialPolicy`](/am/reference/data-model-schema.md)
- [`ConfidentialEvent`](/am/reference/data-model-schema.md)
- [`ProofAttachment`](/am/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/am/reference/data-model-schema.md)
- [የማስረጃ እና የማረጋገጫ መጠይቆች](/am/reference/queries.md#escrow-and-proof-records)
