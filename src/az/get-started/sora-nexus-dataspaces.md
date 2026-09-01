---
translation_locale: az
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SORA 3 üzərində qur: Taira və Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3, Iroha 3 və SORA Nexus üzərində qurulan, tətbiqlərə yönəlmiş ictimai yerləşdirmə xəttidir. Əvvəlcə Taira üzərində hazırlayın və məşq edin; yalnız ayrıca mainnet açarları, ödənişlər üçün həqiqi XOR və istehsal təsdiqi olduqda eyni müştəri quruluşunu Minamoto-ya köçürün.

Bu dərslik göstərişləri verir necə Iroha müştərisini ictimai SORA 3 şəbəkələr üçün konfiqurasiya etməyə:

- Taira testnet `https://taira.sora.org` ünvanında
- Minamoto əsas şəbəkə `https://minamoto.sora.org` ünvanında

İnteqrasiya testləri, testnet-də maliyyələşdirilmiş yazma kanariləri və yerləşdirmə məşqləri üçün Taira-dən istifadə edin. Sadəcə istehsalata hazır mainnet fəaliyyətləri üçün Minamoto-dən istifadə edin. Hər iki şəbəkə XOR-də ödəniş alır:

- Taira ictimai testnet maliyyələşdirmə xidmətindən testnet XOR istifadə edir.
- Minamoto həqiqi XOR istifadə edir. Minamoto üçün testnet maliyyələşdirmə xidməti yoxdur.

## Tikinti Yolu {#builder-path}

|Addım| Taira Testnet | Minamoto Əsas şəbəkə |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Şəbəkə vəziyyətini oxumağa başlayın|Açarlar olmadan Sorğu `/status`|Açarlar olmadan Sorğu `/status`|
|Bir məlumat sahəsi seçin|Tətbiqinizə idarə olunan icra xətti lazım olmadıqca ictimai `universal`-dən istifadə edin|Yalnız əsas şəbəkə təsdiqindən sonra eyni məlumat sahəsindən istifadə edin|
|Ödəniş aktivini əldə et|İctimai Taira testnet maliyyələşdirmə xidmətindən istifadə edin|Minamoto maliyyələşdirilmiş hesabdan və ya təsdiqlənmiş xəzinədarlıq axınından XOR alın|
|Test yazır|Testnet-dən maliyyələşdirilmiş testi istifadə edin XOR|Test alətlərindən istifadə etməyin; yazılar həqiqi XOR xərcləyir|
| İstehsala keçid | Təkrar cəhd məntiqini, monitorinqi və kriptoqrafik imzalayıcı idarəsini saxlayın | Ayrı açarlardan, maliyyələşdirmədən və buraxılış nəzarətlərindən istifadə edin |

Praktik axın belədir:

1. Müştərini Taira əsasında qurun və ictimai `universal` verilənlər məkanından istifadə edin.
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

SORA Nexus-də, məlumat sahəsi şəbəkə icra zolağının və marşrutlaşdırma kataloqunun bir hissəsidir. Müştəri sadəcə `client.toml`-i dəyişməklə yeni ictimai məlumat sahəsi yaratmır. Müştəri quraşdırması iki iş görür:

1. müştərini düzgün Torii API son nöqtəyə yönəldir
2. özünün tək protokol-standart hesabı üçün domen və məlumat sahəsi marşrutlaşdırma kontekstini seçir

`AccountId` hər zaman tək protokol-standart və domensizdir. `[account].domain` dəyəri `client.toml` içində yönləndirmə və təxəllüs kontekstini təmin edir; o, hesab şəxsiyyətinin bir hissəsi olmur. Əksər tətbiqlər üçün, ictimai `universal` məlumat sahəsindən başlamaq lazımdır. Domen konteksti `domain.dataspace` formasını istifadə edir, məsələn:

```text
wonderland.universal
```

Əgər yeni bir təşkilati məlumat sahəsinə ehtiyacınız varsa, onu adi müştəri hesabından qeydiyyatdan keçirməyə çalışmaq əvəzinə, kataloq və yönləndirmə təklifi hazırlayın. Aşağıdakı [Yeni Məlumat Məkanını Təmin Et](#_8-provision-a-new-dataspace)-ə baxın.

## 2. İctimai Torii API nöqtəsini yoxlayın {#_2-check-the-public-torii-endpoint}

Kriptoqrafik imzalayıcıyı konfiqurasiya etməzdən əvvəl təyinat API nöqtəsinin işlək olduğunu yoxlayın.

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

Nod tərəfindən təqdim olunan məlumat məkanı və icra zolağı görünüşünü yoxlayın:

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
| MCP API son nöqtə | `https://taira.sora.org/v1/mcp` |
|Şəbəkə kökü| `https://taira.sora.org` |
|Niyyət edilən istifadə| Taira testnet oxumaları və testnet tərəfindən maliyyələşdirilən yazı məşqləri|
|İstehsal ekvivalenti|Bu yazını Minamoto üzərinə yönəltməyin, əgər əsas şəbəkə MCP API son nöqtəsi və buraxılış nəzarətləri açıq şəkildə təsdiqlənməyibsə|

İmzalama materialını əlavə etməzdən əvvəl körpü metadatasını yoxlayın:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
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
3. Yalnız oxumaq üçün API sorğularının Taira qarşı işləməsindən sonra əməliyyat qurma kodunu əlavə edin.
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
- rədd mesajı və uğursuzluğun icazələr, ödənişlər, doğrulama, köhnəlmiş vəziyyət və ya API son nöqtənin mövcudluğu kimi görünüb-görünmədiyi

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

Taira tərəfindən göstərilən ictimai məlumat sahəsi icra zolaqlarını siyahıya alın:

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
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Ən yüksək səviyyəli `chain` dəqiq Taira əməliyyat zənciri ID-sidir. `[account].profile = "taira"` parametri müstəqil olaraq Taira I105 zəncir fərqləndiricisindən seçim edir. Zəncir ID-si hesab profilini seçmir.

Yalnız oxumaq üçün yoxlamanı işə salın:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Yazma testlərindən əvvəl ictimai Taira diaqnostikalarını işə salın:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Xərci ödəyən yazıları işlətmədən əvvəl Taira hesabını testnet maliyyələşdirmə xidməti vasitəsilə maliyyələşdirin. Birbaşa testnet maliyyələşdirmə xidməti axını [Taira üzərində Testnet XOR əldə edin](#_4-get-testnet-xor-on-taira)-dədir.

Testnet maliyyələşdirmə xidməti iddiası qəbul edildikdən və hesab maliyyələşdirildikdən sonra, Taira kanaryası isteğe bağlı yazı tətqiqat testidir:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Kanarya imzalanmış ping göndərir, təsdiq gözləyir və `--write-config` təqdim olunduqda proqramın icra mühiti kriptoqrafik imzalayıcı konfiqurasiyasını yazır. Taira ictimai testnetdir, ona görə də növbənin dolması imzalanmış ping-in çatışmazlığına səbəb ola bilər, hətta testnet maliyyələşdirmə xidməti işləyərkən belə. Əgər `taira doctor` dolu növbə barədə hesabat verirsə və ya kanar `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` qaytarırsa, bunu müştəri konfiqurasiya səhvi kimi qəbul etməzdən əvvəl gözləyin və yenidən cəhd edin.

Nəzarətsiz tüstü testləri üçün kanarini məhdud təkrar dövrəsində sarın:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Əgər `iroha taira doctor` ciddi xətalar göstərirsə, yenidən cəhd etməyi dayandırın. Növbə tıxanması və ödəniş qəbul edilməməsi müvəqqəti ictimai testnet şəraitləridir; DNS, TLS və ya `status = "fail"` diaqnostikaları isə belə deyil.

## SORA Nexus Hesab İD-si Yarat {#generate-a-sora-nexus-account-id}

Bir SORA Nexus hesab ID-si, hesabın açıq açarından və hədəf şəbəkə prefiksindən törədilmiş tək bir protokol-standart I105 ünvanıdır. Bu, `[account].domain` dəyər deyil müştəridə TOML. Eyni açıq açar Taira və Minamoto üzərində fərqli ID-lərə kodlanır və istehsal istifadəçiləri Minamoto üçün ayrıca açar cütlüyü yaratmalıdır.

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

Alınan hesab ID-sindən hər yerdə istifadə edin, harada ki, Nexus, API və ya CLI əmri tək bir protokol-standart hesab ID-si tələb edir, məsələn, Taira testnet maliyyələşdirmə xidməti `account_id`, balans sorğuları, ciddi hesab sahələri və ya ləqəb bağlamaları. Uyğun olan şəxsi açarı müştəri konfiqurasiyanızda saxlayın və `[account].profile = "taira"` və ya `[account].profile = "minamoto"` ilə eyni ictimai şəbəkəni seçin.

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

İctimai testnet maliyyələşdirmə xidmətindən birbaşa istifadə edin. Axın belədir:

1. Kriptoqrafik imzalayan yaradın və ya yükləyin və onun tək protokol-standart Taira hesab ID-sini hesablayın.
2. Cari testnet maliyyələşdirmə xidməti tapmacaını gətirin.
3. Əgər `difficulty_bits` `0`-dən böyükdürsə, tapmacanı həll edin.
4. Testnet maliyyələşdirmə xidməti iddiasını təqdim edin.
5. Ödənişli yazıları göndərmədən əvvəl hesabın və ya aktiv balansının görünməsini gözləyin.

Bir ictimai açarı testnet maliyyələşdirmə xidməti tərəfindən gözlənilən Taira I105 hesab identifikatoruna çevirin:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Tapmacanı gətir:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Testnet maliyyələşdirmə xidməti ictimai testnet xidmətidir. Əgər puzzle və ya claim API son nöqtəsi `502`, zaman aşımı və ya başqa bir gateway səviyyəli xəta qaytarırsa, açarlarınızı və ya müştəri konfiqurasiyanızı dəyişməzdən əvvəl gözləyin və təkrar cəhd edin.

Cavabın bu şəklidir:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

`difficulty_bits` `0` olanda yalnız hesab ID-sini təqdim edin:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

`difficulty_bits` `0`-dən böyük olduqda, tapmacanı həll edin və ankora hündürlüyünü kriptoqrafik nonce dəyəri ilə birlikdə daxil edin:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Tapmaca alqoritmi belədir:

1. Çağırışı SHA-256 kimi qurun:
   - `iroha:accounts:faucet:pow:v2` baytları
   - UTF-8 hesab ID-si
   - `anchor_height` böyük-endian kimi `u64`
   - `anchor_block_hash_hex` bayt kimi deşifr edildi
   - `challenge_salt_hex` mövcud olduqda baytlar kimi deşifr edildi
2. Böyük-endian 8 baytlıq dəyərlər kimi kodlanmış `u64` kriptoqrafik nonce dəyərlərini sınayın.
3. Hər kriptoqrafik nonce dəyəri üçün scrypt-i işlədin:
   - şifrə: 8 baytlıq kriptoqrafik nonce dəyəri
   - duz: 32 baytlıq çağırış
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - çıxış uzunluğu: 32 bayt
4. Qalib kriptoqrafik nonce dəyəri ən azı `difficulty_bits` ön sıfır biti olan ilk kriptoqrafik qarışdırma dəyəridir.

Testnet maliyyələşdirmə xidməti cavabı maliyyələşdirilmiş aktiv və növbəyə alınmış əməliyyatın kriptoqrafik xəşini əhatə edir:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

Cavab hazırda HTTP `202 Accepted` ilə qaytarılır. Onun `asset_definition_id`-i ictimai testnet maliyyələşdirmə xidməti tərəfindən təmin edilmiş mövcud Taira ödəniş aktividir; Bunu nümunə ID-ni kopyalamaq əvəzinə cavabdan çıxarın. Testnet maliyyələşdirmə xidməti `tx_hash_hex` və `status: "QUEUED"` cavabını qaytardıqda sorğunu qəbul etmiş olur.

Sonra öz ödənişli əməliyyatlarınızı təqdim etməzdən əvvəl maliyyələşdirilmiş aktiv üçün sorğu aparın:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Əgər testnet maliyyələşdirmə xidməti iddiası qəbul edilibsə, lakin hesab və ya aktiv hələ görünmürsə, əməliyyat hələ də ictimai testnet növbəsinin emalındadır. Yazıları göndərmədən əvvəl oxumağı gözləyin və yenidən cəhd edin.

İşə hazır bir birbaşa API yoxlaması üçün bunu `taira_faucet_claim.py` kimi yadda saxlayın və Taira I105 hesab ID-sini göndərin:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Testnet maliyyələşdirmə xidməti yalnız Taira testnet vəsaitləri üçün nəzərdə tutulmuşdur. Testnet XOR, testnet maliyyələşdirmə xidməti hesabları və ya Taira kanarya kriptoqrafik imzalayanları Minamoto axınlarında istifadə etməyin.

## 5. Minamoto Müştəri Konfiqurasiyasını yaradın {#_5-create-a-minamoto-client-config}

Minamoto üçün ayrı bir açar cütündən istifadə edin. Taira açarlarını mainnet üçün təkrar istifadə etməyin.

`minamoto.client.toml` yarat

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Ən üst səviyyəli `chain` cari Nexus əsasnet zəncir ID-sidir. `[account].profile = "minamoto"` Minamoto I105 zəncir fərqləndiricisini seçir; API son nöqtə host adı və zəncir ID-si onu dolayı yolla seçmir.

Minamoto açıq açarını əsas şəbəkə prefiksi ilə onun tək protokol-standart I105 hesab ID-sinə çevirin:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hesab əsas şəbəkə qoşulması və ya idarəetmə prosesi vasitəsilə təmin olunana və maliyyələşdirilənə qədər yalnız oxuma tərəfi yoxlamalarını aparın:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Minamoto-ə qarşı Taira testnet maliyyələşdirmə servisini və ya write-canary köməkçisini işə salmayın.

## 6. XOR ilə Minamoto Hesabına vəsait qoyun {#_6-fund-a-minamoto-account-with-xor}

Minamoto ödənişləri XOR istehsalı ilə ödənilir və Minamoto açıq testnet maliyyələşdirmə xidmətinə malik deyil. Konfiqurasiya edilmiş hesabı təsdiqlənmiş mainnet qeydiyyatı və ya xəzinə köçürməsi vasitəsilə maliyyələşdirin, və ya mövcud maliyyələşdirilmiş Minamoto hesabından XOR alın.

Yazma əməliyyatını təqdim etməzdən əvvəl oxumaq üçün yoxlamalarla tək protokol-standart hesab ID-sini və maliyyələşməni təsdiqləyin. Minamoto XOR-ni istehsal vəsaiti kimi qəbul edin: eyni əməliyyatı əvvəlcə Taira-də məşq edin, istehsal açarlarını ayrı saxlayın və əsas şəbəkə əməliyyatının sıfırlana biləcəyini fərz etməyin.

Taira XOR Minamoto ödənişlərini ödəyə bilmir. Testnet balansları və testnet maliyyələşdirmə xidməti tələbləri Minamoto-yə köçürülmür.

## 7. Mövcud Məlumat Sahəsində İşləmək {#_7-work-inside-an-existing-dataspace}

Məlumat sahəsində yaşayan blokçeyn dəftər obyektləri üçün tam təyin olunmuş domen adlarından istifadə edin. Məsələn, ictimai məlumat sahəsindəki bir layihə domeni aşağıdakı kimi istifadə olunmalıdır:

```text
apps.universal
```

Hesabınız lazım olan icazələrə malik olduqdan sonra, domen üçün gizlisiz `AliasSetupPlanRequestV1` niyyət yaradın və deklarativ planlaşdırıcıdan istifadə edin:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto üçün ayrıca əsas şəbəkə niyyəti və planı yaradın və təsdiqləyin. Planlar zəncirlərinə, səlahiyyət prinsiplərinə, canlı vəziyyət bağlantısına və son tarixə bağlıdır, buna görə Taira planını irəli çəkmək və ya təkrar oynatmaq olmaz:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hesab ləqəbləri eyni verilənlər məkanının postfixindən istifadə edir:

```text
alice@apps.universal
alice@universal
```

Sərt hesab sahələri hələ də tək protokol-standart I105 hesab identifikatorlarından istifadə edir. Əlavələri tək protokol-standart hesab identifikatorlarına həll edən insan oxunaqlı əlaqələr kimi qəbul edin.

## 8. Yeni Məlumat Məkanının Təmin Edilməsi {#_8-provision-a-new-dataspace}

Yeni məlumat sahəsi operator və idarəetmə dəyişikliyidir. İctimai Torii API son nöqtəsi trafiki konfiqurasiya edilmiş məlumat sahələrinə yönləndirə bilər, lakin naməlum məlumat sahəsi təxəllüslərini rədd edəcək.

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

Yerinə yetirmə xətti ID-si, məlumat məkanı ID-si, doğrulayıcı dəsti, nasazlığa dözümlülük, texniki manifesto, marşrutlaşdırma qaydaları və əməliyyat sahibi birlikdə nəzərdən keçirilmədikcə yeni takma adı təşviq etməyin. Lazımi icazələrə malik normal istifadəçi hesabı, mövcud dataspace daxilində alias planner vasitəsilə bir domen və onun SNS icarəsini əldə edə bilər; təhlükəsiz şəkildə yeni bir ictimai dataspace əlavə edə bilməz.

Şəxsi və ya təşkilati məlumatlar sahəsi üçün aşağıdakılarla kataloq dəyişikliyi hazırlayın:

- unikal məlumat sahəsi ləqəbi və ədədi `id`
- uyğun icra yol giriş və ya mövcud icra yolu təyini
- dataspace `fault_tolerance`
- orada yerləşməli təlimatlar və ya hesab sahələri üçün yönləndirmə qaydaları
- məlumat sahəsi UAID imkanlarını ortaya qoyduqda, Kosmik Qovluq texniki manifesti və ya ekvivalent yayım sübutu
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
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

Operatorun qəbulu bu qapıları əhatə etməlidir:

- `iroha3d --sora --config <config.toml> --trace-config` həll edilmiş düyün konfiqurasiyasını ötürür
- yaradılmış və ya nəzərdən keçirilmiş texniki manifesto kriptoqrafik xəş və imzalar ilə arxivləşdirilir
- təqdim olunmadan əvvəl Taira-da sınaq yanğınları Minamoto təbliğindən əvvəl uğurla keçdi
- dəyişiklikdən sonra `/status` kataloqu nəzərdə tutulan icra zolağını və verilənlər məkanını göstərir
- `iroha app nexus lane-report --summary` tələb olunan texniki manifeslərin çatışmadığını bildirmir

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Eyni məlumat sahəsini yalnız Taira yerləşdirməsi, ilkin testlər, monitorinq və idarəetmə sənədləri tamamlandıqdan sonra Minamoto-a təşviq edin.

## Əlaqəli Səhifələr {#related-pages}

- [Iroha 3 Quraşdır](/az/get-started/install-iroha.md)
- [Iroha 3-i CLI vasitəsilə işlədin](/az/get-started/operate-iroha-via-cli.md)
- [Şəxsi məlumat sahəsi üçün sponsor haqları](/az/get-started/private-dataspace-fee-sponsor.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [blokçeyn başlanğıc istinadı](/az/reference/genesis.md)
