---
translation_locale: az
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Anonim əməliyyatlar {#anonymous-transactions}

Iroha ilə anonim əməliyyatlar məxfi aktiv əməliyyatlarından qurulur. Cümi məbləğlərlə ictimai hesabdan hesaba köçürmələrin yazılması əvəzinə bir cüzdan dəyərini qorunan bir kitabxanaya köçürür və sonra sıfır bilik sübutları olan qeyri-şəffaf qeydləri xərcləyir.

İctimai nəşr hələ də gizli əməliyyatın baş verdiyini qeyd edir. O, öhdəlikləri, ləğv edənlər, sübut hashləri və hadisələri qeyd edir, lakin not sahibini, alıcını və ya qoruqdan qorunmuş hərəkət üçün məbləği qeyd etmir. Normal əməliyyat qovşağı hələ də təqdim edən hesabı aşkar edə bilər, buna görə burada "anonim" şəbəkə səviyyəsində və ya hesab səviyyəsində avtomatik anonimlik deyil, anonim aktivlərin hərəkəti deməkdir.

## İnşaat blokları {#building-blocks}

|Konsepsiya |Ledger təmsilçisi |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Mühafizə olunmuş qeyd|Bir aktiv, məbləğ, sahibinin məlumatları və təsadüfilik olan şəxsi cüzdan qeydləri. |
|Məsuliyyət |32 baytlıq ictimai qiymət, onun sahələrini açıqlamadan bir qeydə sadiqdir. |
|Qeyri-hüquqlu |Iroha ikili xərclərin qarşısını almaq üçün təkrarlanan ləğv edənləri rədd edir. |
|Merkle kökü |Bu, aktivin öhdəlik ağacının yeni bir köküdür və sübutlar onu xərclənmiş notların mövcud olduğunu göstərmək üçün istifadə edir.|
|Dayanıq əlavəsi |`ProofAttachment` əhatə edən sübut baytları və bir yoxlama açarı istinadı və ya inline yoxlama açar. |
|Gizli hadisə |`ConfidentialEvent::Shielded`, `Transferred` və ya `Unshielded` kimi böyük kitabda baş verən hadisə. |

Əsas təlimatlar aşağıdakılardır:

- `RegisterZkAsset`: bir aktivin ZK -ə malik olduğunu qeydiyyatdan keçirir və transfer, qalxan və qalxan olmayan yoxlama açarlarını bağlayır.
- `Shield`: ictimaiyyət balansını debit edir və bir qoruyucu not öhdəliyini əlavə edir.
- `ZkTransfer`: mühafizə olunmuş əmanətləri yeni mühafizəsi olan əmanətlərə xərcləyir.
- `Unshield`: qoruyucu banknote xərcləyir və dövlət hesabının balansını kreditləşdirir.
- `ScheduleConfidentialPolicyTransition` və `CancelConfidentialPolicyTransition`: bir aktivin məxfilik siyasətini idarəetmə yolu ilə dəyişdirmək.

Bir aktiv tərifində həmçinin [`AssetConfidentialPolicy`](/az/reference/data-model-schema.md) adı da vardır.

|Modu |Məna|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Yalnız normal ictimai balanslar və köçürmələr qəbul edilir. |
|`Convertible` |İstifadəçilər qiyməti ictimai balanslar və qoruyucu qeydlər arasında köçürə bilərlər. |
|`ShieldedOnly` |Əşyaların buraxılışı və köçürülməsi qoruyan kitabda qalmalıdır. |

## Onları necə istifadə etmək olar {#how-to-use-them}

1. Validator qovşaqlarında məxfilik dəstəyini təmin edin. Validatorlar təsdiqləyici arxası, aktiv yoxlama açarları, Poseidon/Pedersen parametrləri IDs və məxfi qaydalar versiyası haqqında razılığa gəlməlidirlər. Qovşaqlar eşidilməyən məxfi xüsusiyyətlər ilə həmyaşıllı və ya blokları rədd edirlər.
2. Çərçivələrdə istifadə olunan yoxlama açarları və parametrlər dəstlərini nəşr etmək və ya qeyd etmək. Cüzdanlar və operatorlar `VerifyingKeyId`, məsələn, `halo2/ipa:vk_transfer` ilə açarlara müraciət etməlidirlər.
3. Əməliyyat vasitəsi ZK-ə görə `RegisterZkAsset` ilə qeydiyyatdan keçin və ya `TransparentOnly`-dən `Convertible` və ya `ShieldedOnly`-ə siyasət keçidinin həyata keçirilməsi.
4. Dövlət vəsaitini `Shield` ilə qoruyun. Cüzdan, əməliyyatı təqdim etməzdən əvvəl alıcı üçün bir qeyd öhdəliyi və şifrəli pay yükü yaradır.
5. `ZkTransfer` ilə şəxsi köçürülməsi. Cüzdan giriş qeydlərinə sahib olduğunu, giriş və çıxış dəyərlərinin balanslandığını və hər xərclənmiş notun son bir öhdəlik ağacına bağlandığını göstərir.
6. `Unshield` ictimai məbləği və alıcı hesabını açıqlayır, özəl not ləğvçisini xərcləyir və özəl dəyişiklik çıxışı yarada bilər.
7. Gizli hadisələri, sübut sənədlərini, ləğvçi statusunu və naməlum əmanət sənədlərini Torii son nöqtələrindən istifadə edərək oxumaqla audit.

## CLI nümunələr {#cli-examples}

ZK CLI əmrləri operator və test axınları üçün nəzərdə tutulmuşdur. İstehsalat cüzdanları nəticələnən təlimatların təqdim edilməsindən əvvəl cüzdan/prover kitabxanası ilə öhdəliklər, şifrəli pay yükləri və sübutlar yaratmalıdırlar.

HİBRID ZK məbləğində olan aktivin qeydiyyatına alınması:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Mühafizə olunmuş qeyd üçün versiyalı şifrələnmiş payload zarfını qurun:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Dövlət vəsaitlərini aktivin qoruyucu kitabına daxil etmək:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Dayanıqlı bir əlavə JSON ilə qoruyan qalxan:

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

## SDK Misal {#sdk-example}

Əməliyyat paylı yükü yalnız ictimai girişlərə və sübut əlavəinə ehtiyac duyur:

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

## Anonim varlıqların əmanət alınması {#anonymous-asset-escrow}

Anonim aktivlər vəsiqəsi vəsiqəli dəyər üçün eyni qorunan köçürmə maşınından istifadə edir. tərəflər və vəsiqəli vəziyyət hələ də vəsiqəli qeydə alınır, lakin maliyyələşdirmə, buraxılış, ləğv və həlli ayaqları korlanmış ləğvçilərdən və çıxış öhdəliklərindən istifadə edirlər.

ISI əxlaq davranışının və nümunələrinin ətraflı məlumatı üçün [ Yerli aktivlərin əxlaqını ](/az/blockchain/escrow.md#anonymous-escrow) baxın.

Həyat dövrü:

1. `OpenAnonymousAssetEscrow` mühafizə edilmiş maliyyələşdirmə notlarını xərcləyir və bir depozit öhdəliyi yaratır.
2. `AcceptAnonymousAssetEscrow` alıcı qeyd edir.
3. `MarkAnonymousEscrowPaymentSent` alıcının ödənişləri zəncirdən kənarda göndərdiyini qeyd edir.
4. `ReleaseAnonymousAssetEscrow` əmanət borcunu alıcı istehsalı öhdəliklərinə xərcləyir.
5. `CancelAnonymousAssetEscrow` ödəniş işarə olunmadıqda satıcının çıxışı öhdəliklərinə geri götürülən vəsiqəni xərcləyir.
6. `OpenAnonymousEscrowDispute` və `ResolveAnonymousEscrowDispute` mübahisəli əmanətləri sübut hashləri və həlli ilə idarə olunan bölünmə ilə həll edirlər.

[Soruşmalar](/az/reference/queries.md#escrow-and-proof-records)-da göstərilən anonim depozit sorğularından istifadə edərək depozit qeydlərini və statuslarını yoxlayın.

## Riyaziyyat {#math}

Aşağıdakı qeyd məxfi aktiv axını təsvir edir. Tədbirlər aktiv siyasətindən və yoxlayıcı qeydiyyatından olan aktiv dövrə və parametrdən IDs istifadə edirlər, buna görə müştərilər öhdəlikləri, ləğv edənləri və sübut baytlarını cüzdanın / proverin qeyri-aşkar çıxışları kimi qəbul etməlidirlər.

Qoruyucu qeyd aşağıdakı kimi təsvir edilə bilər:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

`owner` alıcının baxdığı və ya xərclədiyi materialdan alınmış və `rho` qeyd olunan təsadüfilikdir.

Qeydlərin öhdəliyi gizli bir öhdəlikdir:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Hal-hazırda məxfi ötürmə dairələri üçün ictimai girişlər qeyd öhdəlikləri, ləğv edənlər, Merkle kökü, aktiv etiket və bir zəncir etiketidir.

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Bir not xərcləndikdə, cüzdan bir nullifier əldə edir:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ictimaiyyətdir. Not açıqlamır, lakin bu not və zəncir üçün sabitdir, buna görə Iroha eyni ləğv edən ikinci bir xərcləməni rədd edə bilər.

Əməkdarlıq ağacı qeydlərin mövcudluğunu sübut edir. Əgər bir cüzdan `C_i` ödənirsə, sübutda `C_i`-dən son bir ictimai kökə qədər xüsusi Merkle yolu var:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Qapalı-qapalı köçürülmə üçün sübut həmçinin dəyər qorunmasını tələb edir:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Qapalı olmayan bir şəxs üçün ictimai məbləğ aşağıdakılara aiddir:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

təqdim olunan sübut aşağıdakı kimi ümumiləşdirilə bilər:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

burada `public_inputs` öhdəliklər, ləğv edənlər, kök, aktiv etiketləri, silsilə etiketləri və hər hansı ictimaiyyət qarşısı alınmayan məbləğdir. Şahid qeydlərin miqdarını, təsadüfiliyini, xərc materialını və Merkle yollarını ehtiva edir. Validatorlar sübutları yoxlayır və sonra çıxış öhdəliklərini əlavə edərək və giriş ləğvçilərini sərf edildiyi kimi qeyd edərək kitabın vəziyyətini dəyişir.

## İctimaiyyətə nələr aiddir? {#what-is-public}

Anonim əməliyyatlar hər müşahidə olunan faktı gizliləşdirmir.

- əməliyyat hash, blok hündürlüyü və sifariş
- təqdim edən əməliyyat orqanı, əgər müraciət xüsusi giriş nöqtəsi və ya relay modelindən istifadə etməyibsə;
- istifadə olunan aktiv tərifi
- ləğv edənlər və çıxış öhdəlikləri
- sübut hashləri, yoxlama açarı istinadları və seçməli qablaşdırma hashləri
- `Unshield` üçün ictimai məbləğ və alıcı hesabı
- Anonim əmanət satıcısı, alıcı, status, vaxt möhtəşəmliyi və sübutlar

Tətbiqlər dizayn edin ki, bu ictimai meta məlumatlar qorumağa çalışdığınız iş əlaqələrini aşkar etməsin.

## Əlaqəli istinad {#related-reference}

- [`AssetConfidentialPolicy`](/az/reference/data-model-schema.md)
- [`ConfidentialEvent`](/az/reference/data-model-schema.md)
- [`ProofAttachment`](/az/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/az/reference/data-model-schema.md)
- [Əmanət və sübut sorğuları](/az/reference/queries.md#escrow-and-proof-records)
