---
translation_locale: az
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# SORA Nexus üzərində qurun: Taira və Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus Iroha 3 əsasında açıq yerləşdirmə mühitləri təqdim edir. Əvvəlcə Taira üzərində qurun və məşq edin; yalnız ayrıca əsas şəbəkə açarlarınız, haqlar üçün həqiqi XOR və istehsal icazəniz olduqda eyni müştəri quruluşunu Minamoto-ya keçirin.

Bu təlimat açıq SORA Nexus şəbəkələri üçün Iroha müştərisinin necə konfiqurasiya edildiyini göstərir:

- Taira testnet `https://taira.sora.org` ünvanında
- Minamoto əsas şəbəkə `https://minamoto.sora.org` ünvanında

İnteqrasiya testləri, testnet-də maliyyələşdirilmiş yazma kanariləri və yerləşdirmə məşqləri üçün Taira-dən istifadə edin. Sadəcə istehsalata hazır mainnet fəaliyyətləri üçün Minamoto-dən istifadə edin. Hər iki şəbəkə XOR-də ödəniş alır:

- Taira ictimai testnet maliyyələşdirmə xidmətindən testnet XOR istifadə edir.
- Minamoto həqiqi XOR istifadə edir. Minamoto üçün testnet maliyyələşdirmə xidməti yoxdur.

## Tikinti Yolu {#builder-path}

|Addım| Taira Testnet | Minamoto Əsas şəbəkə |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Şəbəkə vəziyyətini oxumağa başlayın|Açarlar olmadan Sorğu `/status`|Açarlar olmadan Sorğu `/status`|
| Məlumat məkanı seçin | Tətbiqinizə idarə olunan zolaq lazım deyilsə, açıq `universal` istifadə edin | Yalnız əsas şəbəkə icazəsindən sonra eyni məlumat məkanını istifadə edin |
|Ödəniş aktivini əldə et|İctimai Taira testnet maliyyələşdirmə xidmətindən istifadə edin|Minamoto maliyyələşdirilmiş hesabdan və ya təsdiqlənmiş xəzinədarlıq axınından XOR alın|
|Test yazır|Testnet-dən maliyyələşdirilmiş testi istifadə edin XOR|Test alətlərindən istifadə etməyin; yazılar həqiqi XOR xərcləyir|
| İstehsala keçid | Təkrar cəhd məntiqini, monitorinqi və kriptoqrafik imzalayıcı idarəsini saxlayın | Ayrı açarlardan, maliyyələşdirmədən və buraxılış nəzarətlərindən istifadə edin |

Praktik axın belədir:

1. Müştərini Taira üçün hazırlayın və açıq `universal` məlumat məkanından istifadə edin.
2. Kriptoqrafik imzalayıcı əlavə edin və onu Taira testnet maliyyələşdirmə xidməti ilə maliyyələşdirin.
3. Tətbiq məntiqinizi Taira-a qarşı məşq edin, ta ki uğursuzluqlar darıxdırıcı və müşahidə oluna bilən olana qədər.
4. Ayrıca Minamoto kriptoqrafik imzalayıcısı yaradın, onu həqiqi XOR ilə maliyyələşdirin və yalnız sınaqdan keçmiş eyni əməliyyatları mainnet-ə köçürün.

## Mətbəx kitabı ilə davam et {#continue-with-the-cookbook}

Bu təlimatdan istifadə edərək şəbəkəni seçin, kriptoqrafik imzalayıcıyı konfiqurasiya edin və ödənişləri maliyyələşdirin. Sonra yaratmaq istədiyiniz tətbiq davranışına uyğun reseptlə davam edin:

|Məqsəd|Resept|
| --- | --- |
| Taira-i yoxlayın və müştəriyi konfiqurasiya edin | [Taira-ə qoşul](/az/cookbook/connect-to-taira.md) |
|Birinci yazını göndərin və nəticəsini yoxlayın| [Əməliyyatları təqdim et və təsdiqlə](/az/cookbook/submit-and-verify-transactions.md) |
|Qeydiyyatdan keçirin, verin və dəyəri hərəkət etdirin| [Mübadilə Olunan Aktivlər](/az/cookbook/fungible-assets.md) |
|Filtrlənmiş tətbiq vəziyyətini oxu| [Blokçeyn dəftər vəziyyətini sorğula](/az/cookbook/query-ledger-state.md) |
|Son dəyişikliklərə reaksiya verin| [Axın Hadisələri](/az/cookbook/stream-events.md) |

Resept kitabı hər iş axınını mərkəzləşdirilmiş halda saxlayır və Taira maliyyələşdirməyə və ya SORA Nexus şəbəkə kontekstinə ehtiyac duyduqda buraya geri bağlantı verir.

## 1. Quraşdırdığınız şeyi anlayın {#_1-understand-what-you-are-setting-up}

SORA Nexus daxilində məlumat məkanı kataloqu məlumat məkanlarını müəyyən edir. Zolaq kataloqu zolaqları ayrıca müəyyən edir: hər zolaq bir məlumat məkanına istinad edir və bir məlumat məkanında bir neçə zolaq ola bilər. Müştəri yalnız `client.toml` dəyişməklə yeni açıq məlumat məkanı yaratmır. Müştəri qurulması iki iş görür:

1. müştərini düzgün Torii son nöqtəsinə yönəldir
2. kanonik hesabı üçün şəbəkə kontekstini və imzalama açarını seçir

`AccountId` həmişə kanonikdir və domen daşımır; `client.toml` daxilində domen parametri yoxdur: `[account].profile` yalnız şəbəkənin I105 prefiksini seçir. Domen konteksti ləqəblərə və domenin sahib olduğu obyektlərə aiddir. Əksər tətbiqlər üçün açıq `universal` məlumat məkanından başlayın. Domen konteksti `domain.dataspace` formasından istifadə edir, məsələn:

```text
wonderland.universal
```

Yeni təşkilati məlumat məkanı lazımdırsa, onu adi müştəri hesabından qeydiyyata almağa çalışmaq əvəzinə kataloq və marşrutlaşdırma təklifi hazırlayın. Aşağıdakı [Yeni məlumat məkanı qurun](#_8-provision-a-new-data-space) bölməsinə baxın.

## 2. Açıq Torii son nöqtəsini yoxlayın {#_2-check-the-public-torii-endpoint}

İmzalayan hesabı konfiqurasiya etməzdən əvvəl hədəf son nöqtənin işlədiyini yoxlayın.

Taira üçün:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto üçün:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Qovşağın təqdim etdiyi məlumat məkanı və zolaq görünüşünü yoxlayın:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Əsas şəbəkə üçün `https://minamoto.sora.org/status` ilə eyni əmrdən istifadə edin.

## Taira MCP agentlər üçün {#taira-mcp-for-agents}

Taira həmçinin agent proqram təminatı icra mühitləri üçün Torii-yerli Model Kontekst Protokolu (MCP) körpüsünü təqdim edir. Agent canlı testnet oxumalarına, skriptləşdirilmiş diaqnostikalara və ya diqqətlə gözdən keçirilmiş yazı məşqlərinə ehtiyac duyduqda, əvvəlcə xüsusi Torii müştəri yaratmadan istifadə edin.

|Quraşdırma|Dəyər|
| --- | --- |
| MCP son nöqtəsi | `https://taira.sora.org/v1/mcp` |
|Şəbəkə kökü| `https://taira.sora.org` |
|Niyyət edilən istifadə| Taira testnet oxumaları və testnet tərəfindən maliyyələşdirilən yazı məşqləri|
| İstehsal mühiti qarşılığı | Əsas şəbəkə MCP son nöqtəsi və buraxılış nəzarətləri açıq şəkildə təsdiqlənməyibsə, bu qeydi Minamoto-ya yönəltməyin |

Körpü yalnız vəziyyətsiz JSON-RPC `POST` sorğularını qəbul edir. İmzalama materialı əlavə etməzdən əvvəl onun kəşf metaməlumatını yoxlayın:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

URL agent proqram təminatı icra mühitində istifadəçi-yerli MCP server olaraq konfiqurasiya edin. Agent MCP konfiqurasiyasını, API tokenlərini, ötürülmüş auth header-ları, `authority` və ya `private_key` dəyərlərini bu sənəd repo-suna və ya tətbiq repo-suna saxlamayın.

Taira ilə yaxşı işləyən agent sorğu qaydaları:

- Onları çağırmazdan əvvəl MCP serverindən alətləri kəşf edin; əgər server `listChanged` bildirirsə, yenidən kəşf edin.
- Xam `torii.*` alətlərdən daha çox seçilmiş `iroha.*` alətləri üstün tutun.
- Yalnız oxumağa başla: yazılar təklif etməzdən əvvəl vəziyyəti, hesabları, aktivləri, ləqəbləri, blokları, idarəetmə vəziyyətini və əməliyyat vəziyyətini yoxla.
- Canlı testnet dəyişikliklərindən əvvəl açıq insan göstərişi tələb olunur. Əvvəlcədən imzalanmış əməliyyat məlumat konteynerləri üçün `iroha.transactions.submit_and_wait`-dən istifadə edin ki, agent yalnız təqdim etməklə kifayətlənməyib nəticəni gözləsin.
- Agentin cavabında əməliyyat kriptoqrafik xəşləri, son vəziyyəti və server doğrulama səhvlərini yekunlaşdırın.

### Agentlər ilə İnkişaf İş Axını {#development-workflow-with-agents}

Iroha müştərilər, əməliyyat qurucuları, diaqnostik skriptlər və testnet iş kitabları üçün inkişaf köməkçiləri kimi agentlərdən istifadə edin. Agentin səlahiyyət əsasını dar saxlayın: O kodu yoxlaya, Taira vəziyyətini oxuya, dəyişikliklər təklif edə və yerli testləri keçirə bilər, amma insan dəqiq əməliyyatı təsdiqləməyincə canlı şəbəkəni dəyişdirməməlidir.

Praktik iş axını belədir:

1. Agentdən kod yazmazdan əvvəl müvafiq sənədləri, SDK kodunu, CLI əmri və ya MCP alət sxemini yoxlamağı xahiş edin.
2. Agentdən xahiş edin ki, ən kiçik müştəri yolunu əvvəl yazsın: vəziyyət yoxlaması, hesab axtarışı, təxəllüs həlli və ya balans yoxlaması.
3. Yalnız oxuma çağırışları Taira üzərində işlədikdən sonra əməliyyat qurma kodunu əlavə edin.
4. Canlı şəbəkə testlərini könüllü saxlayın, məsələn `TAIRA_LIVE=1` arxasında, belə ki, normal bir vahid test çalışması heç vaxt testnet vəsaitlərini xərcləməsin və ya şəbəkə mövcudluğuna bağlı olmasın.
5. Hər hansı bir əməliyyatı göndərmədən əvvəl agentdən şəbəkə kökü, zəncir, səlahiyyət verilən əsas hesab, təlimat xülasəsi, ödəniş aktivləri və gözlənilən vəziyyət dəyişikliyi barədə hesabat verməsini tələb edin.
6. Yaradılmış kodu gizli məlumatların idarəsi, yenidən cəhd davranışı, idempotentlik və rədd etmə idarəsi baxımından nəzərdən keçirin, sonra onu CI və ya əsas şəbəkə iş axınlarına göndərin.

İnkişaf üçün faydalı yalnız oxumaq üçün MCP alətlərinə hesab aktivlərinin yoxlanması, ləqəb həlli, blok axtarışı, əməliyyat axtarışı, əməliyyat siyahıları və proqram təminatı emal iş axını vəziyyəti yoxlamaları daxildir. İstənilən imzalanmış yükü təqdim etmədən əvvəl əminliyi artırmaq üçün bunlardan istifadə edin.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Agentlər vasitəsilə əməliyyat iş prosesi {#transaction-workflow-through-agents}

MCP körpüsü imzalanmış Iroha əməliyyatını təqdim edə bilər, lakin bu, normal əməliyyat tələblərini aradan qaldırmır. Əməliyyat hələ də düzgün avtorizasiya prinsipi, icazələr, ödəniş fondları, zəncir ID-si, metadatalar və imza tələb edir.

Xam Iroha əməliyyatlar üçün əvvəlcə əməliyyat məlumatları konteynerini SDK və ya CLI ilə qurun və imzalayın, sonra agentə yalnız təkini verin protokol-standartlı imzalanmış əməliyyat baytları `body_base64` kimi kodlanıb. Agent məlumat konteynerini `iroha.transactions.submit_and_wait` ilə təqdim edə bilər, və ya `iroha.transactions.submit` ilə təqdim edib `iroha.transactions.wait` ilə sorğulaya bilər.

Açarları agent istəyi pəncərəsinə yapışdırmayın. Əgər agent əməliyyat qurmalıdırsa, onu istifadəçinin proqram icra mühitindən sirləri yükləyən yerli koda yönəldin mühit, açar zənciri, aparat kriptoqrafik imzalayıcı, və ya nəzərə alınmayan testnet konfiqurasiya faylı. Agent açar materialını heç vaxt Markdown-a, test artefaktlarına, qeydlərə və ya yekunlaşdırmalara yazmamalıdır.

Əməliyyatı təqdim etməzdən əvvəl, agentin qısa bir əməliyyat planı hazırlamasını təmin edin:

- `network`: Taira testnet əsas və zəncir ID
- `authority`: hesab ki, ödənişləri imzalayır və ödəyir
- `instructions`: qeydiyyat, buraxılış, məhv, köçürmə, metadatası, icazə, və ya müqavilə texniki çağırış xülasəsi
- `fee asset`: Taira tarixində tutulacaq əmlak
- `preflight reads`: hesab, aktiv balansı, icazələr, təxəllüs və ya blok yoxlamaları artıq aparılıb
- `expected result`: təsdiq edildikdən sonra görünməli olan vəziyyət
- `idempotency`: eyni sorğu təkrar olunarsa nə baş verir

Göndərdikdən sonra, agentin son vəziyyəti gözləməsini təmin edin, sonra vəziyyət dəyişməsini oxu sorğusu ilə yoxlayın. Faydalı tamamlanma hesabatı aşağıdakılardan ibarətdir:

- əməliyyat kriptoqrafik xəş
- terminal vəziyyəti kimi `Committed`, `Applied`, `Rejected` və ya `Expired`
- mövcud olduqda blok və ya araşdırıcı detalları
- təsdiq oxuma nəticələri
- rədd mesajı və xətanın icazələr, haqlar, validasiya, köhnəlmiş vəziyyət və ya son nöqtənin əlçatanlığı ilə əlaqəli görünüb-görünməməsi

Nümunə qorunan sorğu:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

İmzalanmış məlumat konteyneri artıq hazır olduqda:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ü ictimai testnet idarəetmə səthi kimi qəbul edin. Taira açarları, testnet XOR, testnet maliyyələşdirmə xidməti hesabları və kanarya kriptoqrafik imzalayıcılar istifadədən sonra atıla biləndir və Minamoto açarları ilə istehsal buraxılış iş axınlarından ayrı saxlanmalıdır.

## İndi Sınaqdan Keçirə Biləcəyiniz Toy Nümunələri {#toy-examples-you-can-try-now}

Bu nümunələr qeyd olunmadığı təqdirdə yalnız oxunmaq üçündür. Onlar açarları yaratmadan əvvəl işləyir və həm ictimai şəbəkələrdə test etmək üçün təhlükəsizdir.

Taira testnet və Minamoto mainnet sağlamlığını müqayisə et:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira-nın təqdim etdiyi açıq məlumat məkanı zolaqlarını sadalayın:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Əsas şəbəkə görünüşünə ehtiyacınız olduqda eyni əmri Minamoto qarşı işlədin:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Bir tablosu, botu və ya yerləşdirmə yoxlaması üçün kiçik bir Node.js vəziyyət probe-u qurun:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

İlk yazma tərəfi oyuncağı Taira testnet maliyyələşdirmə xidməti tələbiyyatı olmalıdır. O, testnet XOR-dən istifadə edir və heç vaxt Minamoto-ə yönəldilməməlidir.

## 3. Taira Müştəri Konfiqurasiyasını yaradın {#_3-create-a-taira-client-config}

Əgər artıq bir cüt açarınız yoxdursa, bir cüt açar yaradın:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` yarat

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Yuxarı səviyyəli `chain` dəqiq Taira əməliyyat zənciri ID-sidir; `network_id` isə hər imzanın bağlandığı dəqiq şəbəkə kimliyidir. `network_id` və ya `network_id_file` seçimlərindən dəqiq birini konfiqurasiya edin. `[account].profile = "taira"` parametri Taira I105 zəncir ayırdedicisini müstəqil seçir. Zəncir ID-si hesab profilini seçmir.

Yalnız oxumaq üçün yoxlamanı işə salın:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Yazma testlərindən əvvəl ictimai Taira diaqnostikalarını işə salın:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Haqq tələb edən yazmalar işlətməzdən əvvəl Taira hesabını test vəsaiti paylama xidməti ilə maliyyələşdirin. Əvvəlcədən hazırlanan vəsait alma axını [Taira üzərində testnet XOR əldə etmək](#_4-get-testnet-xor-on-taira) bölməsindədir.

Hesab maliyyələşdirildikdən sonra imzalanmış jurnal təlimatı ilə ilkin yazma sınağı keçirmək olar. Hər göndərilən əməliyyat haqq ödəyicisini göstərir və CLI imzalamadan əvvəl dəqiq haqqı hesablayıb göstərir:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

Əmr təsdiqi gözləyir. Taira açıq testnetdir, buna görə vəsait paylama xidməti işləsə belə növbənin dolması ping-in uğursuz olmasına səbəb ola bilər. `taira doctor` dolmuş növbə bildirirsə və ya ping `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` qaytarırsa, bunu müştəri konfiqurasiya xətası saymazdan əvvəl gözləyin və yenidən cəhd edin.

Nəzarətsiz ilkin işləkliyə dair sınaqlar üçün ping-i cəhd sayı məhdud dövrə daxil edin:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Əgər `iroha taira doctor` ciddi xətalar göstərirsə, yenidən cəhd etməyi dayandırın. Növbə tıxanması və ödəniş qəbul edilməməsi müvəqqəti ictimai testnet şəraitləridir; DNS, TLS və ya `status = "fail"` diaqnostikaları isə belə deyil.

## SORA Nexus Hesab İD-si Yarat {#generate-a-sora-nexus-account-id}

SORA Nexus hesab ID-si hesabın açıq açarından və hədəf şəbəkə prefiksindən törəyən kanonik I105 ünvanıdır. Eyni açıq açar Taira və Minamoto üzərində fərqli ID-lərə kodlanır; istehsal istifadəçiləri Minamoto üçün ayrıca açar cütü yaratmalıdır.

Hesaba nəzarət edəcək Ed25519 açar cütününü yaradın və ya yükləyin:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

İctimai açarı Taira hesab ID-sinə çevirin:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Əsas şəbəkə prefiksi ilə Minamoto açıq açarı çevirin:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

SORA Nexus API və ya CLI əmri kanonik hesab ID-si tələb etdikdə, məsələn balans sorğularında, ciddi hesab sahələrində və ya ləqəb bağlamalarında, alınmış hesab ID-sini istifadə edin. Uyğun şəxsi açarı müştəri konfiqurasiyasında saxlayın və `[account].profile = "taira"` və ya `[account].profile = "minamoto"` ilə eyni açıq şəbəkəni seçin.

ID yaratmaq özü-özlüyündə maliyyələşdirilmiş zəncir üzərində hesab yaratmır. Taira üzərində testnet maliyyələşdirmə xidməti testnet yazıları üçün hesab yaradıb maliyyələşdirə bilər. Minamoto üzərində isə təsdiqlənmiş mainnet qeydiyyat və ya xəzinə axınından istifadə edin.

### Açar Saxlama və Ehtiyat Nüsxə {#key-storage-and-backup}

Hesab ID-si və açıq açıq açarı paylaşmaq olar. Uyğun şəxsi açar, şifrə, toxum və bərpa materialı isə gizli saxlanılmalıdır.

Bu təcrübələrdən SORA Nexus hesablar üçün istifadə edin:

- Şəxsi açarları şifrələnmiş parol menecerində, aparat dəstəkləyən açar anbarında və ya xüsusi imzalama xidmətində saxlayın. Protokol yekunlaşdırma açarlarını mənbə idarəetməsinə yerləşdirməyin və ya istehsal açarlarını shell tarixçəsində, qeydlərdə, çatlarda, biletlərdə və ya şifrələnməmiş ehtiyat nüsxələrdə qoymayın.
- Hər bir anbar və ya istehsal kriptoqrafik imzalayıcı üçün unikal yüksək entropiyalı şifrə ifadəsindən istifadə edin. Şifrə ifadələrini parol meneceri və ya bölünmüş etibarlılıq prosesi ilə saxlayın, onları şifrələnmiş şəxsi açarla eyni faylda və ya ehtiyat nüsxə paketində saxlamayın.
- Taira və Minamoto açarları ayrı saxlayın. Taira açarlarını atılabilir testnet materialı kimi, Minamoto açarlarını isə istehsal fondu səlahiyyət prinsipi kimi qəbul edin.
- Kriptoqrafik imzalama cihazını bərpa etmək üçün lazım olan xüsusi açarı, açıq açarı, hesab ID-sini, hesab profilini və hər hansı bir hesab bərpa və ya saxlama qeydlərini ehtiyat nüsxəsini çıxarın. Şəbəkə konteksti olmayan xüsusi açar bərpa zamanı asanlıqla yanlış istifadə edilə bilər.
- İstehsal kriptoqrafik imzalayıcıları üçün ən azı bir şifrələnmiş oflayn ehtiyat nüsxə və bir coğrafi cəhətdən ayrı şifrələnmiş ehtiyat nüsxə saxlayın. Ehtiyat nüsxəyə güvənmədən əvvəl kiçik oxumaq üçün əməliyyat ilə bərpa prosesini test edin.
- Əgər şəxsi açar, şifrələmə sözü, ehtiyat vasitəsi və ya imzalama hostu ifşa olunmuş ola bilərsə, kriptoqrafik imzalayıcıyı döndərin və ya əvəz edin.

Daha ətraflı məlumat üçün [Kriptoqrafik Açarların Saxlanması](/az/guide/security/storing-cryptographic-keys.md) və [Şifrə Təhlükəsizliyi](/az/guide/security/password-security.md)-ə baxın.

## 4. Taira üzərində XOR Testnet əldə edin {#_4-get-testnet-xor-on-taira}

CLI-nin əvvəlcədən hazırlanan vəsait alma axını ilə testnet XOR tələb edin. Xidmət `taira.client.toml` daxilində konfiqurasiya edilmiş hesabı maliyyələşdirir və hesab hələ yoxdursa, əvvəlcə onu qeydiyyatdan keçirir. Axın belədir:

1. Açıq vəsait paylama siyasətini oxuyun: xidmətin səlahiyyət sahibi, haqq aktivi və məbləğ.
2. Vəsait alma tələbini hazırlayın. CLI iş sübutunu həll edir, Torii-nin hazırlayıb imzaladığı dəqiq əməliyyatı yoxlayır və göndərmədən özəl jurnal qovluğunda saxlayır.
3. Saxlanılan əməliyyatı bir dəfə göndərin.
4. Haqq tələb edən yazmalar göndərməzdən əvvəl aktiv balansının görünməsini gözləyin.

Siyasəti oxuyun:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

Cavabın bu şəklidir:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

Siyasət imzalanmamış kəşf məlumatıdır. Avtomatlaşdırma hər cavaba etibar etmək əvəzinə gözlədiyi səlahiyyət sahibini, aktiv tərifini və məbləği sabitləməlidir. `prepare` ötürdüyünüz qiymətlərdən fərqlənən hazırlanmış əməliyyatı rədd edir.

Vəsait alma tələbini hazırlayın və göndərin:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` jurnal qovluğunu özəl giriş hüquqları ilə yaradır və mövcud qovluğu əvəz etməkdən imtina edir; buna görə hər tələb üçün yeni qovluq istifadə edin. Vəsait paylama xidməti açıq testnet xidmətidir. `submit` `Pending` bildirirsə, vaxt aşımına uğrayırsa və ya `502` alırsa, başqa tələb hazırlamaq əvəzinə eyni konfiqurasiya və jurnalla `taira account faucet resume` işlədin. Köhnəlmiş iş sübutu dayaq nöqtəsi `prepare` əməliyyatını uğursuz edir; yeni jurnal qovluğunda yenidən hazırlayın.

Sonra öz ödənişli əməliyyatlarınızı təqdim etməzdən əvvəl maliyyələşdirilmiş aktiv üçün sorğu aparın:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Tələb tətbiq olunub, lakin aktiv hələ görünmürsə, yazma göndərməzdən əvvəl gözləyin və oxumanı yenidən sınayın.

Test vəsaiti paylama xidməti yalnız Taira test şəbəkəsinin vəsaitləri üçündür. Test şəbəkəsi XOR-unu, həmin xidmətin hesablarını və ya Taira yoxlama tranzaksiyalarının imzalayıcılarını Minamoto əməliyyatlarında istifadə etməyin.

## 5. Minamoto Müştəri Konfiqurasiyasını yaradın {#_5-create-a-minamoto-client-config}

Minamoto üçün ayrı bir açar cütündən istifadə edin. Taira açarlarını mainnet üçün təkrar istifadə etməyin.

`minamoto.client.toml` yarat

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Yuxarı səviyyəli `chain` cari SORA Nexus əsas şəbəkəsinin zəncir ID-sidir; `network_id` isə Minamoto-nun dəqiq şəbəkə kimliyidir. Onu ilk imzalanmış əməliyyatdan əvvəl imkanlar marşrutundan oxuyun. `[account].profile = "minamoto"` Minamoto I105 zəncir ayırdedicisini seçir; son nöqtənin host adı və zəncir ID-si bunu dolayı yolla seçmir.

Minamoto açıq açarını əsas şəbəkə prefiksi ilə onun tək protokol-standart I105 hesab ID-sinə çevirin:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hesab əsas şəbəkə qoşulması və ya idarəetmə prosesi vasitəsilə təmin olunana və maliyyələşdirilənə qədər yalnız oxuma tərəfi yoxlamalarını aparın:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira vəsait paylama və ya ilkin işləkliyə dair sınaq əmrlərini Minamoto üzərində işlətməyin.

## 6. XOR ilə Minamoto Hesabına vəsait qoyun {#_6-fund-a-minamoto-account-with-xor}

Minamoto ödənişləri XOR istehsalı ilə ödənilir və Minamoto açıq testnet maliyyələşdirmə xidmətinə malik deyil. Konfiqurasiya edilmiş hesabı təsdiqlənmiş mainnet qeydiyyatı və ya xəzinə köçürməsi vasitəsilə maliyyələşdirin, və ya mövcud maliyyələşdirilmiş Minamoto hesabından XOR alın.

Yazma əməliyyatını təqdim etməzdən əvvəl oxumaq üçün yoxlamalarla tək protokol-standart hesab ID-sini və maliyyələşməni təsdiqləyin. Minamoto XOR-ni istehsal vəsaiti kimi qəbul edin: eyni əməliyyatı əvvəlcə Taira-də məşq edin, istehsal açarlarını ayrı saxlayın və əsas şəbəkə əməliyyatının sıfırlana biləcəyini fərz etməyin.

Taira XOR Minamoto ödənişlərini ödəyə bilmir. Testnet balansları və testnet maliyyələşdirmə xidməti tələbləri Minamoto-yə köçürülmür.

## 7. Mövcud məlumat məkanı daxilində işləyin {#_7-work-inside-an-existing-data-space}

Məlumat məkanında yerləşən reyestr obyektləri üçün tam müəyyənləşdirilmiş domen adlarından istifadə edin. Məsələn, açıq məlumat məkanındakı layihə domeni belə olmalıdır:

```text
apps.universal
```

Hesabınız lazım olan icazələrə malik olduqdan sonra, domen üçün gizlisiz `AliasSetupPlanRequestV1` niyyət yaradın və deklarativ planlaşdırıcıdan istifadə edin:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto üçün ayrıca əsas şəbəkə niyyəti və planı yaradın və təsdiqləyin. Planlar zəncirlərinə, səlahiyyət prinsiplərinə, canlı vəziyyət bağlantısına və son tarixə bağlıdır, buna görə Taira planını irəli çəkmək və ya təkrar oynatmaq olmaz:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hesab ləqəbləri eyni məlumat məkanı sonluğundan istifadə edir:

```text
alice@apps.universal
alice@universal
```

Sərt hesab sahələri hələ də tək protokol-standart I105 hesab identifikatorlarından istifadə edir. Əlavələri tək protokol-standart hesab identifikatorlarına həll edən insan oxunaqlı əlaqələr kimi qəbul edin.

## 8. Yeni məlumat məkanı qurun {#_8-provision-a-new-data-space}

Yeni məlumat məkanı operator və idarəetmə dəyişikliyidir. Açıq Torii son nöqtəsi trafiki konfiqurasiya edilmiş məlumat məkanlarına yönləndirə bilər, lakin naməlum məlumat məkanı ləqəblərini rədd edəcək.

Dəyişikliyi hazırlamadan əvvəl mövcud canlı kataloqu qeyd edin:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Operator hesabı üçün icra zolağı texniki manifesto vəziyyətini də yoxlayın:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Zolaq ID-si, məlumat məkanı ID-si, təsdiqləyicilər dəsti, nasazlığa dözümlülük, manifest, marşrutlaşdırma qaydaları və istismar üzrə məsul tərəf birlikdə nəzərdən keçirilməyibsə, yeni ləqəbi istifadəyə verməyin. Lazımi icazələri olan adi istifadəçi hesabı ləqəb planlayıcısı vasitəsilə mövcud məlumat məkanı daxilində domen və onun SNS icarəsini əldə edə bilər; həmin hesab təhlükəsiz şəkildə yeni açıq məlumat məkanı əlavə edə bilməz.

Özəl və ya təşkilati məlumat məkanı üçün aşağıdakıları ehtiva edən kataloq dəyişikliyi hazırlayın:

- unikal məlumat məkanı ləqəbi və ədədi `id`
- uyğun icra yol giriş və ya mövcud icra yolu təyini
- məlumat məkanının `fault_tolerance` qiyməti
- orada yerləşməli təlimatlar və ya hesab sahələri üçün yönləndirmə qaydaları
- məlumat məkanı UAID imkanları təqdim edirsə, Məkan Kataloqu manifesti və ya bərabər səviyyəli yerləşdirmə sübutu
- təsdiqçi üçün idarəetmə təsdiqi, uyğunluq, maliyyə əməliyyatlarının həlli və izləmə siyasəti

İcmal edilə bilən konfiqurasiya fraqmenti belə görünür:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

Operatorun qəbulu bu qapıları əhatə etməlidir:

- `iroha3d --sora --config <config.toml> --trace-config` həll edilmiş düyün konfiqurasiyasını ötürür
- yaradılmış və ya nəzərdən keçirilmiş texniki manifesto kriptoqrafik xəş və imzalar ilə arxivləşdirilir
- təqdim olunmadan əvvəl Taira-da sınaq yanğınları Minamoto təbliğindən əvvəl uğurla keçdi
- dəyişiklikdən sonrakı `/status` kataloqu nəzərdə tutulan zolağı və məlumat məkanını göstərir
- `iroha app nexus lane-report --summary` tələb olunan texniki manifeslərin çatışmadığını bildirmir

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Eyni məlumat məkanını Minamoto-ya yalnız Taira yerləşdirməsi, ilkin işləkliyə dair sınaqlar, monitorinq və idarəetmə sübutları tamamlandıqdan sonra keçirin.

## Əlaqəli Səhifələr {#related-pages}

- [Iroha 3 Quraşdır](/az/get-started/install-iroha.md)
- [Iroha 3-i CLI vasitəsilə işlədin](/az/get-started/operate-iroha-via-cli.md)
- [Özəl məlumat məkanı üçün haqlara sponsorluq edin](/az/get-started/private-dataspace-fee-sponsor.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
- [blokçeyn başlanğıc istinadı](/az/reference/genesis.md)
