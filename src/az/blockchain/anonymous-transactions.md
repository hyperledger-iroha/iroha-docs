---
translation_locale: az
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Anonim Əməliyyatlar {#anonymous-transactions}

Iroha-də anonim əməliyyatlar məxfi aktiv əməliyyatlarından ibarətdir. İctimai məbləğlərlə açıq hesabdan-hesaba köçürmələr yazmaq əvəzinə, bir cüzdan dəyəri qorunan blokçeyn dəftərinə köçürür və sonra sıfır-bilik sübutları ilə qeyri-şəffaf qeydləri xərcləyir.

İctimai blokçeyn dəftəri hələ də məxfi əməliyyatın baş verdiyini qeyd edir. O, kriptoqrafik öhdəlik dəyərlərini, nullifierləri, sübut kriptoqrafik xəşləri və hadisələri qeyd edir, lakin qorunan-dan-qorunana hərəkət üçün qeyd sahiblərini, alıcıları və məbləği qeyd etmir. Normal əməliyyat məlumat konteyneri hələ də göndərən hesabı göstərə bilər, beləliklə burada “anonim” sözü anonim aktiv hərəkətini, avtomatik şəbəkə səviyyəsində və ya hesab səviyyəsində anonimliyi deyil.

## Tikinti Blokları {#building-blocks}

|Konsept|blokçeyn dəftərxana təmsili|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Qorunmuş qeyd|Bir aktiv, məbləğ, sahib məlumatları və təsadüfilik ehtiva edən şəxsi cüzdan qeydi.|
|kriptovalyuta öhdəlik dəyəri|Bir qeydın sahələrini açıqlamadan ona kriptoqrafik olaraq bağlanan 32 baytlıq ictimai dəyər.|
|Ləğv edən|Qeyd xərclənərkən əldə edilən 32 baytlıq ictimai dəyər. Iroha təkrar nullifierləri rədd edərək iki dəfə xərcləmənin qarşısını alır.|
|Merkle kökü|Aktivin kriptoqrafik öhdəlik dəyər ağacının sonuncu kökü. Sübutlar xərclənmiş qeydlərin mövcud olduğunu göstərmək üçün bunu istifadə edir.|
|Sənəd əlavə|A `ProofAttachment` sübut baytlarını və təsdiq açarı istinadı və ya xətti təsdiq açarını ehtiva edir.|
|Gizli tədbir| `ConfidentialEvent::Shielded`, `Transferred` və ya `Unshielded` kimi bir blok zənciri dəftərçi hadisəsi.|

Əsas təlimatlar bunlardır:

- `RegisterZkAsset`: bir əmlakı ZK-qabiliyyətli olaraq qeydiyyata alır və transfer, qoruma və qoruma açarlarını bağlayır.
- `Shield`: bir ictimai balansı debet edir və qorunan qeyd kriptoqrafik öhdəlik dəyərini əlavə edir.
- `ZkTransfer`: qorunan qeydləri yeni qorunan qeyd kriptoqrafik öhdəlik dəyərlərinə xərcləyir.
- `Unshield`: qorunan qeydləri xərcləyir və ictimai hesab balansını kreditləşdirir.
- `ScheduleConfidentialPolicyTransition` və `CancelConfidentialPolicyTransition`: bir aktivin məxfi siyasətini idarəetmə vasitəsilə dəyişdirin.

Aktiv tərifi həm də bir şeyi daşıyır [`AssetConfidentialPolicy`](/az/reference/data-model-schema.md). Siyasət rejimi hansı axınların etibarlı olduğunu idarə edir:

|Rejim|Mənası|
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` |Yalnız normal ictimai balanslar və köçürmələr qəbul olunur.|
| `Convertible`     |İstifadəçilər dəyəri ictimai balanslar ilə qorunan qeydlər arasında köçürə bilərlər.|
| `ShieldedOnly`    |Əmlakın buraxılması və köçürmələri qorunan blokçeyn dəftərində qalmalıdır.|

## Onlardan Necə İstifadə Etmək Olar {#how-to-use-them}

1. Təsdiqləyici düyünlərdə gizli dəstəyi aktiv edin. Təsdiqləyicilər yoxlayıcı arxa planı, aktiv təsdiqləmə açarları, Poseidon/Pedersen parametr identifikatorları və gizli qaydalar versiyası barədə razılığa gəlməlidirlər. Düyünlər uyğun gəlməyən gizli xüsusiyyət kriptoqrafik xülasələri olan şəbəkə yoldaşlarını və ya blokları rədd edir.
2. Dairələr tərəfindən istifadə olunan doğrulama açarlarını və parametr dəstlərini dərc edin və ya qeydiyyatdan keçirin. Pulqabılar və operatorlar açarlara `VerifyingKeyId` ilə istinad etməlidir, məsələn `halo2/ipa:vk_transfer`.
3. Əmlakı `RegisterZkAsset` ilə ZK-qabiliyyətli kimi qeyd edin, ya da siyasətin keçidini `TransparentOnly`-dən `Convertible` və ya `ShieldedOnly`-ə mərhələləndirin.
4. Ümumi vəsaitləri `Shield` ilə qoruyun. Cüzdan əməliyyatı təqdim etməzdən əvvəl alıcı üçün bir qeyd kriptoqrafik öhdəlik dəyəri və şifrəli məlumat yaradır.
5. Şəxsi şəkildə `ZkTransfer` ilə köçürün. Cüzdan, giriş qeydlərinə sahib olduğunu, giriş və çıxış dəyərlərinin balansda olduğunu və hər xərclənmiş qeydın son kriptoqrafik öhdəlik dəyəri ağacında yerləşdirildiyini sübut edən bir sübut yaradır.
6. Varlıq siyasəti icazə verdikdə yalnız qorunmasız edin. `Unshield` ictimai məbləği və alıcının hesabını açır, şəxsi qeydlərin ləğv edicisini xərcləyir və şəxsi dəyişiklik çıxışları yarada bilər.
7. Məxfi hadisələri, sübut qeydlərini, ləğv vəziyyətini və anonim əmanət qeydlərini yazılı sorğular və Torii API son nöqtələri vasitəsilə oxumaqla audit.

## CLI Nümunələr {#cli-examples}

ZK CLI əmrləri operator və test axınları üçün nəzərdə tutulub. İstehsalat cüzdanları nəticə əmrlərini təqdim etməzdən əvvəl kriptoqrafik öhdəlik dəyərləri, şifrələnmiş yükləmələr və sübutları bir cüzdan/sübutçu kitabxanası ilə yaratmalıdır.

Hibrid ZK-qabiliyyətli aktiv qeydiyyatdan keçirin:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Qorunan qeydlər üçün versiyalaşdırılmış şifrələnmiş məlumat konteyneri yaradın:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

CLI aktiv siyasətini, yoxlayıcı açar istinadlarını və şifrəli qeyd məlumat konteynerini hazırlayır. O, `shield` və ya `unshield` əməliyyat alt komandalarını ifşa etmir. Bu təlimatları SDK ilə qurun və onları adi imzalanmış əməliyyat kimi, ödəniş qiymət təxmini ilə göndərin.

Qorunmasız sübut əlavəsinin bu forması var:

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

## SDK Nümunə {#sdk-example}

Dəqiq sübut baytları təyin edilmiş sübut arxa ucundan gəlir. Əməliyyat yükləməsi yalnız ictimai girişləri və sübut əlavə faylını tələb edir:

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

## Anonim Aktiv Depoziti {#anonymous-asset-escrow}

Anonim aktiv eskrovu, eskrova qoyulmuş dəyər üçün eyni qorunan köçürmə mexanizmini istifadə edir. Tərəflər və eskro vəziyyəti hələ də eskro qeydinə yazılır, lakin maliyyələşdirmə, buraxılış, ləğv, və maliyyə köçürmələrinin hissələrinin həlli qorunan nullifierlərdən və çıxış kriptoqrafik öhdəlik dəyərlərindən istifadə edir.

Ətraflı depozit ISI davranışı və nümunələr üçün baxın [Yerli Aktiv Depoziti](/az/blockchain/escrow.md#anonymous-escrow).

Həyat dövrü belədir:

1. `OpenAnonymousAssetEscrow` qorunan maliyyələşdirmə qeydlərini xərcləyir və bir vasitə kriptoqrafik öhdəlik dəyəri yaradır.
2. `AcceptAnonymousAssetEscrow` alıcını qeyd edir.
3. `MarkAnonymousEscrowPaymentSent` qeydləri göstərir ki, alıcı ödənişi zəncir xaricində göndərib.
4. `ReleaseAnonymousAssetEscrow` depozit kriptoqrafik öhdəlik dəyərini alıcı çıxış kriptoqrafik öhdəlik dəyərlərinə xərcləyir.
5. `CancelAnonymousAssetEscrow` ödəniş işarələnmədikdə, satıcı çıxışının kriptoqrafik öhdəlik dəyərlərinə kirayə saxlanan kriptoqrafik öhdəlik dəyərini geri göndərir.
6. `OpenAnonymousEscrowDispute` və `ResolveAnonymousEscrowDispute` mübahisəli əmanətləri sübut kriptoqrafik xeşlər və həlledicinin idarə etdiyi paylama ilə idarə edir.

[Sorğular](/az/reference/queries.md#escrow-and-proof-records) ünvanında siyahıya alınmış anonim əmanət sorğularından istifadə edərək əmanət qeydlərini və vəziyyətlərini yoxlayın.

## Riyaziyyat {#math}

Aşağıdakı qeyd gizli aktiv axınını təsvir edir. Tətbiqlər aktiv siyasətindən və yoxlayıcı qeydindən aktiv dövrə və parametr ID-lərindən istifadə edir, buna görə müştərilər kriptoqrafik öhdəlik dəyərlərini, nullifier-ləri və sübut baytlarını cüzdan/prover tərəfindən yaranan qeyri-şəffaf nəticələr kimi qəbul etməlidir.

Qorunmuş qeydi belə təsvir etmək olar:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

burada `owner` alıcının baxış və ya xərcləmə materialından əldə edilir və `rho` təsadüfi qeyddir.

Qeyd kriptoqrafik öhdəlik dəyəri bir gizlədici kriptoqrafik öhdəlik dəyəridir:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Cari məxfi köçürmə sxemləri üçün ictimai girişlərə qeydlərin kriptoqrafik öhdəlik dəyərləri, nullifier-lər, Merkle kökü, aktiv etiketi və zəncir etiketi daxildir. Sxem bu formada bir kriptoqrafik öhdəlik dəyəri əlaqəsini tətbiq edir:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Bir qeyd istifadə edildikdə, cüzdan bir nullifier əldə edir:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` ictimailəşdirilib. Bu qeydi aşkar etmir, amma həmin qeyd və zəncir üçün sabitdir, ona görə də Iroha eyni nullifier ilə ikinci xərcləməni rədd edə bilər.

Kriptovalyuta bağlılıq dəyər ağacı qeyd mövcudluğunu sübut edir. Əgər bir cüzdan kriptovalyuta bağlılıq dəyərini `C_i` xərcləyirsə, sübut `C_i`-dən son ictimai kökə qədər xüsusi Merkle yolunu əhatə edir:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Qalxana-qalxana köçürmə üçün, sübut həmçinin dəyərin qorunmasını təmin edir:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Qorunmasız üçün, ümumi məbləğ daxil edilir:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

Təqdim olunmuş sübut aşağıdakı kimi ümumiləşdirilə bilər:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

burada `public_inputs` kriptoqrafik öhdəlik dəyərləri, nullifierlər, kök, aktiv etiketi, zəncir etiketi və hər hansı bir açıq gizlədilməmiş məbləğdir. Şahid isə qeyd məbləğlərini, təsadüfi dəyərləri, xərcləmə materialını və Merkle yollarını ehtiva edir. Təsdiqləyicilər sübutu yoxlayır və sonra çıxış kriptoqrafik öhdəlik dəyərlərini əlavə etməklə və giriş nullifikatorlarını xərclənmiş kimi işarələməklə blokçeyn dəftəri vəziyyətini dəyişdirirlər.

## İctimai Nədir {#what-is-public}

Anonim əməliyyatlar hər müşahidə oluna bilən faktı gizli etmir. Aşağıdakı məlumatlar hələ də ictimai ola bilər:

- əməliyyatın kriptoqrafik xəşi, blok hündürlüyü və sifarişləşdirilməsi
- müraciət şəxsi giriş nöqtəsi və ya vasitəçi nümunəsi istifadə etmədiyi halda təqdim edən əməliyyat icazəsi prinsipi
- istifadə olunan aktiv tərifi
- ləğv edicilər və çıxış kriptoqrafik öhdəlik dəyərləri
- sübut kriptoqrafik xeşlər, yoxlama açarı istinadları və isteğe bağlı məlumat konteyneri kriptoqrafik xeşlər
- `Unshield` üçün ictimai məbləğ və alıcı hesabı
- anonim depozit satıcısı, alıcı, vəziyyət, zaman möhürləri və sübut kriptoqrafik həşlər

Tətbiqləri belə dizayn edin ki, bu ümumi metadatalar qorumağa çalışdığınız biznes əlaqəsini açıqlamasın.

## Əlaqəli İstinad {#related-reference}

- [`AssetConfidentialPolicy`](/az/reference/data-model-schema.md)
- [`ConfidentialEvent`](/az/reference/data-model-schema.md)
- [`ProofAttachment`](/az/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/az/reference/data-model-schema.md)
- [Etibarnamə və sübut sorğuları](/az/reference/queries.md#escrow-and-proof-records)
