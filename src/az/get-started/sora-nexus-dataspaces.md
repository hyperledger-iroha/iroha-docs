---
translation_locale: az
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3: Taira və Minamoto üzərində qurun {#build-on-sora-3-taira-and-minamoto}

SORA 3. tətbiqetməyə yönəlmiş ictimaiyyət tətbiqi Iroha 3 və SORA Nexus. İnşaat və təcrübə Taira əvvəlcə, sonra eyni müştəri forma köçürmək Minamoto Yalnız fərdi əsas açarınız varsa, real. XOR ödənişlər və istehsalın təsdiqlənməsi üçün.

Bu təlimat Iroha müştərisini ictimai SORA 3 şəbəkə üçün necə konfiqurasiya etmək lazım olduğunu göstərir:

- Taira test şəbəkəsi `https://taira.sora.org`
- Minamoto `https://minamoto.sora.org` ünvanında əsas şəbəkə

Taira -dən inteqrasiya testləri, faucet maliyyələşdirilən yazma kanarları və tətbiq təcrübələri üçün istifadə edin. Minamoto -dan yalnız istehsal hazırlıqlı əsas şəbəkə fəaliyyəti üçün istifadə edin . Hər iki şəbəkənin ödənişi XOR:

- Taira ictimaiyyət kranından testnet XOR istifadə edir.
- Minamoto real XOR istifadə edir. Minamoto kran yoxdur.

## İnşaatçı yolu {#builder-path}

|Addım | Taira Test torları                                                |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Şəbəkənin vəziyyətini oxumağa başlayın |`/status` açarı olmayan sorğu |`/status` açarı olmayan sorğu |
|Məlumat sahəsi seçin |İctimai istifadə `universal` tətbiqiniz idarə olunan zolağa ehtiyacı yoxdursa |Eyni məlumat məkanını yalnız əsas şəbəkənin təsdiqindən sonra istifadə edin |
|Ödəniş haqqı alın.|İctimai Taira kranı istifadə edin |XOR maliyyələşdirilmiş Minamoto hesabından və ya təsdiqlənmiş xəzinə axınından alın |
|Test yazır.|Kökdən maliyyələşdirilmiş sınaqdan istifadə edin XOR |Test vasitələri istifadə etməyin; real xərcləyir yazır XOR |
|Təbliğat etmək|Logikaya, monitorinqə və imzalama işinə yenidən cəhd edin |Ayrı açarlardan, maliyyələşdirmə və buraxılış nəzarətlərindən istifadə edin |

Praktiki axın:

1. Müştəri Taira ilə müqayisədə qurun və ictimai `universal` məlumat məkanından istifadə edin.
2. İmzaçı əlavə edin və onu Taira faucetlə maliyyələşdirin.
3. Taira əleyhinə tətbiq məntiqinizi səhvlər darıxdırıcı və müşahidə edilənə qədər təcrübə edin.
4. Ayrı bir Minamoto imzaçı yaratın, onu real XOR ilə maliyyələşdirin və yalnız eyni sübut edilmiş əməliyyatları mainnet-ə köçürün.

## 1. Nələr qurduğunuzu başa düşün {#_1-understand-what-you-are-setting-up}

SORA Nexus-də məlumat boşluğu şəbəkə zolağı və marşrut kataloqunun bir hissəsidir. Bir müştəri yalnız `client.toml` -i dəyişdirərək yeni ictimai məlumat boşluğu yaratmır. Müştəri quruluşu iki şeyi edir:

1. müştəriyi sağ Torii uç nöqtəsinə doğru göstərir.
2. kanonik hesabı üçün domen və məlumat məkanının yönümləmə kontekstini seçir

`AccountId` hər zaman kanonik və domensizdir. `client.toml`-dəki `[account].domain` dəyəri yönləndirmə və alias kontekstini təmin edir; hesab kimliyinin bir hissəsi deyil. Əksər tətbiqlər üçün ictimai `universal` məlumat boşluğu ilə başlayın. Domen kontekstindən istifadə olunur `domain.dataspace` forması, məsələn:

```text
wonderland.universal
```

Yeni bir təşkilati məlumat sahəsinə ehtiyacınız varsa, sıradan müştəri hesabından qeydiyyatdan keçirməyə çalışmaq əvəzinə kataloq və marşrut təklifləri hazırlayın. [Yeni məlumat sahəsi təmin edin ](#_8-provision-a-new-dataspace) aşağıda baxın.

## 2. İctimai Torii Son nöqtəsini yoxlayın. {#_2-check-the-public-torii-endpoint}

İmzalayıcını qurmadan əvvəl hədəf son nöqtəsinin canlı olduğunu yoxlayın.

Taira üçün:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto üçün:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Nodu tərəfindən aşkar edilmiş məlumat sahəsi və yol görünüşünü yoxlayın:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Mainnet üçün `https://minamoto.sora.org/status` ilə eyni əmrdən istifadə edin.

## Taira MCP agentlər üçün {#taira-mcp-for-agents}

Taira həmçinin agentlərin işləmə vaxtları üçün Torii-native Model Context Protocol (MCP) köprüni aşkar edir. Bir agentə əvvəlcə xüsusi bir Torii müştəri qurmadan canlı testnet oxumağa, skriptli diaqnostikaya və ya sıx nəzərdən keçirilmiş yazma təcrübələrinə ehtiyac duyulduqda istifadə edin.

|Qeydiyyat |Qiymət |
| --- | --- |
|MCP son nöqtəsi |`https://taira.sora.org/v1/mcp` |
|Şəbəkə kök |`https://taira.sora.org` |
|Məqsədli istifadə |Taira testnet oxumaq və faucet maliyyələşdirilmiş yazma təcrübələri |
|İstehsal ekvivalenti |Bu giriş Minamoto ünvanına göstərilməsin, əgər əsas şəbəkə MCP son nöqtəsi və buraxılış nəzarətləri açıq şəkildə təsdiqlənməsə |

İmzalanma materialını əlavə etmədən əvvəl körpü metadatalarını yoxlayın:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL agent çalışdırma vaxtında istifadəçi lokal bir MCP server kimi konfiqurasiya edin. bu sənəd repo və ya tətbiqetmə repo üçün agent MCP konfigurasını, API nömrələrini, ötürülmüş müəllif başlıqlarını və `authority` və ya `private_key` dəyərlərini təyin etməyin.

Taira ilə yaxşı işləyən agent tələbi qaydaları:

- MCP serverindən zəng etməzdən əvvəl vasitələri kəşf edin; əgər server `listChanged` hesabatı verirsə, yenidən tapın.
- Qırmızı `torii.` vasitələrdən seçilmiş `iroha.` alətləri üstün tuturlar.
- Yalnız oxumağa başlayın: yazı təklif etməzdən əvvəl statusunu, hesabları, aktivləri, aliasları, blokları, idarəetmə vəziyyətini və əməliyyatın statusunu yoxlayın.
- Əvvəlcədən imzalanmış əməliyyat zarfları üçün `iroha.transactions.submit_and_wait` istifadə edin ki, agent yalnız təqdim etmək əvəzinə nəticəni gözləsin.
- Agent cavabında əməliyyat həşlərini, yekun vəziyyətini və server təsdiqləmə səhvlərini qısalaşdırın.

### Agentlərlə inkişaf iş axını {#development-workflow-with-agents}

Iroha müştərilərinin, əməliyyat qurucularının, diaqnostik skriptlərin və testnet işləyən kitabların inkişaf köməkçisi kimi agentlərdən istifadə edin. Agentin səlahiyyətini dar tutun: kodu yoxlaya bilər, Taira vəziyyətini oxuya bilər, dəyişikliklər təklif edə və yerli testləri həyata keçirə bilər, lakin bir insan dəqiq əməliyyatı təsdiqləməyənədək canlı şəbəkəni mutasiya etməməlidir.

Praktiki iş axını:

1. Agentdən kod yazmadan əvvəl müvafiq sənədləri, SDK kodunu, CLI komandanını və ya MCP vasitə sxemasını yoxlamalarını xahiş edin.
2. Əvvəlcə agentdən ən kiçik müştəri yolunu yazın: status yoxlaması, hesab axtarışı, alias həll və ya balans axtarışı.
3. Yalnız oxunma zəngləri Taira ilə işlədikdən sonra əməliyyatın qurulması kodunu əlavə edin
4. Canlı şəbəkə testlərini `TAIRA_LIVE=1` arxasında saxlayın, məsələn, normal birləşmiş sınaq çalışması heç vaxt testnet vəsaitini xərcləmir və ya şəbəkənin mövcudluğuna bağlıdır.
5. Agentdən hər hansı bir əməliyyat təqdim etməzdən əvvəl şəbəkə kökünü, zəncirini, səlahiyyətli hesabını, təlimatların ümumiləşdirilməsini, ödəniş aktivini və gözlənilən vəziyyət dəyişikliyini bildirməyi tələb etmək.
6. CI və ya əsas şəbəkə iş axınlarına yüksəltmədən əvvəl gizli idarəetmə, yenidən təcrübə davranışı, idempotency və rədd idarəetməsi üçün yaradılmış kodun nəzərdən keçirilməsi.

İnkişaf üçün faydalı yalnız oxunma MCP alətləri hesab aktivlərinin axtarışları, alias həlli, blok axtarışı, əməliyyat axtarışı, transaksiya siyahıları və boru xəttinin vəziyyətini yoxlamaqdır.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Agentlər vasitəsilə əməliyyat iş axını {#transaction-workflow-through-agents}

İndiki MCP bridge imzalanmış bir sənəd təqdim edə bilər Iroha əməliyyat, lakin bu, normal əməliyyat tələblərini aradan qaldırmır. Bir əməliyyat hələ də düzgün bir səlahiyyətə, icazələrə, ödəniş maliyyələşdirilməsinə, zəncirə ehtiyac duyur. ID, Metadata və imzalanma.

Qırmızı Iroha əməliyyatları üçün əvvəlcə SDK və ya CLI ilə əməliyyat qovşusunu qurun və imzalayın, sonra agentə yalnız `body_base64` kimi kodlanmış kanonik imzalanmış əməliyyat baytlarını verin. Agent müqaviləni `iroha.transactions.submit_and_wait` ilə təqdim edə bilər, ya da `iroha.transactions.submit` və `iroha.transactions.wait` ilə sorğuya müraciət edə bilər.

Xüsusi açarları agent çağırışına yapıştırmayın. Bir agent bir əməliyyat qurmaq istəyirsə, istifadəçinin icra dövrü mühitindən, açar zəncirindən, aparat imzaçısından və ya testnet konfig faylından məxfilikləri yükləyən yerli koduna yönəltmək lazımdır. Agent heç vaxt əsas materialları Markdown, fixtures, logs və ya komitlərə yazmamalıdır.

Bir əməliyyat təqdim etməzdən əvvəl agentə qısa bir əməliyyat planı hazırlamaq lazımdır:

- `network`: Taira testnet kök və zəncirləri ID
- `authority`: imzalayan və ödəyən hesab
- `instructions`: qeydiyyat, manat, yandırma, köçürmə, metadata, icazə və ya müqavilə çağırışının ümumiləşdirilməsi
- `fee asset`: Taira üzrə ödəniş olunacaq aktiv
- `preflight reads`: artıq həyata keçirilmiş hesab, aktiv balansı, icazələr, alias və ya blok yoxlamaları
- `expected result`: təsdiqdən sonra görünməlidir ki, vəziyyət
- `idempotency`: eyni müraciətin yenidən araşdırılması halında nə baş verir?

Göndərdikdən sonra agent terminal statusunu gözləsin, sonra vəziyyət dəyişikliyinin oxunma sorğusu ilə yoxlanılsın.

- əməliyyat hash
- `Committed`, `Applied`, `Rejected` və ya `Expired` kimi terminal statusu
- Blok və ya kəşfçi detalları mövcud olduqda
- yoxlama oxunuşunun nəticələri
- rədd mesajı və uğursuzluq icazələrə, ödənişlərə, təsdiqləməyə, köhnə vəziyyətə və ya son nöqtənin mövcudluğuna bənzəyirmi

Qeyd olunmuş sürət nümunəsi:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

İmzalanmış qabıq hazırlandığı zaman:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP ictimai test şəbəkəsinin nəzarət sahəsi kimi müalicə olun. Taira açarları, test şəbәкəsi XOR, kran hesabları və kanary imzalanıcıları birbaşa istifadə edilə bilər və Minamoto açarlarından və istehsal buraxılış iş axınlarından ayrı qalmalıdırlar.

## İndi sınaya biləcəyiniz oyuncaq nümunələri {#toy-examples-you-can-try-now}

Bu nümunələr qeyd edilmədiyi təqdirdə yalnız oxunur, açarları istehsal etməzdən əvvəl işləyir və hər iki ictimai şəbəkəyə qarşı qaçmaq təhlükəsizdir.

Taira test şəbəkəsinin və Minamoto əsas şəbəkənin sağlamlığını müqayisə edin:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira tərəfindən açıqlanan ictimai məlumat məkanı zolaqlarını göstərin:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Əsas şəbəkə görünüşünə ehtiyac duyduğunuzda Minamoto ilə eyni əmrini icra edin:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Dashboard, bot və ya yerləşdirmə yoxlama üçün kiçik bir Node.js status sondası qurun:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

Birinci yazma oyuncağı bir Taira Bu, testnetdən istifadə edir. XOR və heç vaxt göstərilməməlidir Minamoto.

## 3. Taira Müştəri Konfigurasiyasını yaratın. {#_3-create-a-taira-client-config}

Əvvəlcədən yoxdursa bir açar cütü yaratın:

```bash
kagami keys --algorithm ed25519 --json
```

`taira.client.toml` yaratmaq:

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

Ən yüksək səviyyəli `chain` dəqiq Taira əməliyyat zənciridir ID. `[account].profile = "taira"` parametrində Taira I105 zəncir ayırdçısı müstəqil olaraq seçilir. ID zənciri hesab profilini seçmir.

Yalnız oxunma üçün yoxlama apar:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Yazı testlərindən əvvəl ictimai Taira diaqnostikası aparın:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Fondun Taira ödəniş ödəmədən əvvəl kran vasitəsilə hesabı yazır. [Testnet əldə edin XOR haqqında Taira](#_4-get-testnet-xor-on-taira).

Qovşaq tələbi qəbul edildikdən sonra və hesabın maliyyələşdirilməsindən sonra Taira kanary seçkin bir yazma duman testidir:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Kanary imzalanmış bir ping göndərir, təsdiqlənməsini gözləyir və `--write-config` təqdim edildikdə icra vaxtı imzalanıcısı konfiqurasiyasını yazır. Taira ictimai test şəbəkəsidir, buna görə də növbə saturasiyası tapınmanın özü işləyəndə də imzalanan pingin uğursuz olmasına səbəb ola bilər. Əgər `taira doctor` doymuş bir sıra bildirirsə və ya kanary `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` qaytarırsa, onu müştəri konfigurasiyasında səhv kimi qəbul etmədən əvvəl gözləyin və yenidən cəhd edin.

Təzyiqsiz duman sınaqları üçün kanariyanı sərhədli bir yenidən təcrübə döngüsündə qovun:

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

`iroha taira doctor` ağır uğursuzluqlar göstərirsə, yenidən cəhd etməyi dayandırın. Səyahət doymuşluğu və ödəniş qəbulunun rədd edilməsi keçidli ictimai test şəbəkəsi şərtləridir; DNS, TLS və ya `status = "fail"` diaqnozları yoxdur.

## SORA Nexus Hesabı ID yaratmaq {#generate-a-sora-nexus-account-id}

A SORA Nexus hesab ID Kanonikdir. I105 Hesabın ictimai açarından və hədəf şəbəkə prefiksindən alınan ünvan. `[account].domain` müştəridə qiyməti TOML. Eyni ictimai açar müxtəlif kodlara aiddir. IDs haqqında Taira və Minamoto, və istehsal istifadəçiləri üçün ayrı bir açar cütü yaratmaq lazımdır Minamoto.

Hesabı idarə edəcək Ed25519 açar cütlüyünü yaratın və ya yükləyin:

```bash
kagami keys --algorithm ed25519 --json
```

İctimai açar Taira hesabına ID çevirin:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto ictimai açarı əsas şəbəkə prefiksi ilə çevirin:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Nexus API və ya CLI komandanın kanonik hesab ID istədiyi hər yerdə nəticələnən hesabı ID istifadə edin, məsələn, Taira faucet `account_id`, balans sorğuları, sərt hesab sahələri və ya alias bağlamalar. Müvafiq xüsusi açarı müştəri konfigurasında saxlayın və eyni ictimai şəbəkəni `[account].profile = "taira"` və ya `[account].profile = "minamoto"` ilə seçin.

ID istehsal etmək öz-özlüyündə maliyyələşdirilmiş bir zəncir hesabı yaratmır. Taira üzərində kran testnet yazıları üçün hesab yarada və maliyyələştirip bilər. Minamoto üzərində təsdiqlənmiş əsas şəbəkə onboardinqindən və ya xəzinə axınından istifadə edin.

### Anahtarların saxlanılması və yedeklənməsi {#key-storage-and-backup}

Hesab ID və ictimai açar paylana bilər. Uyğun xüsusi açar, şifrə, toxum və bərpa materialı gizli saxlanılmalıdır.

SORA Nexus hesabları üçün bu təcrübələrdən istifadə edin:

- Xüsusi açarları şifrələnmiş şifrə idarəçisində, hardverlə dəstəklənmiş kiystore və ya xüsusi imza xidmətinə saxlayın.Çapıları mənbə nəzarətinə qoymayın və ya istehsal açarlarını qabıq tarixində, jurnallarda, söhbətlərdə, biletlərdə və ya şifreli olmayan yedekliklərdə buraxmayın.
- Hər bir xəzinə və ya istehsal imzaçısı üçün bənzərsiz yüksək entropiyalı şifrələrdən istifadə edin. Şifrələri şifreli özəl açar ilə eyni fayl və ya ehtiyat paketində deyil, şifrələnmiş şifrəli bir şifrə idarəçisi və ya bölünmüş saxlama prosesində saxlayın.
- Taira və Minamoto açarlarını ayrı saxlayın. Taira açarları birbaşa istifadə edilə bilən test şəbəkəsi materialı kimi, Minamoto açarları isə istehsal fondlarının səlahiyyətli olduğu kimi qəbul edin.
- Xüsusi açar, ictimai açar, hesab ID, hesab profilini və imzalayıcını bərpa etmək üçün lazım olan hər hansı bir hesabın bərpası və ya saxlama qeydlərini yedekləyin. Şəbəkə kontekstindən asılı olmayan xüsusi açar bərpa zamanı sui-istifadəsi asanlıqla mümkündür.
- İstehsalat imzaları üçün ən azı bir şifrələnmiş offline yedekləmə və bir coğrafi cəhətdən ayrı şifreli yedekləməyə davam edin.
- Gizli açar, şifrə, yedek media və ya imzalanma host aşkar edilmiş ola bilərsə, bir imzaçını fırlatın və ya dəyişdirin.

Daha ətraflı məlumat üçün bax: [Storing Cryptographic Keys](/az/guide/security/storing-cryptographic-keys.md) və [Password Security](/az/guide/security/password-security.md).

## 4. Testnet-i XOR Taira -ə göndərin. {#_4-get-testnet-xor-on-taira}

İctimaiyyət kranından birbaşa istifadə edin.

1. İmzaçı yaratmaq və ya yükləmək və onun kanonik Taira hesabını ID hesablamaq.
2. Hələki faucet puzzlesini gətir.
3. `difficulty_bits` həcmi `0`-dən böyükdürsə, puzzle həll edilsin.
4. Faucet tələbini təqdim edin.
5. Hesabın və ya aktivlərin balansının görünməsini gözləyin, ödənişli yazılar göndərmədən əvvəl.

İctimai açarı Taira I105 hesabına ID çevirin.

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Qəbulunu gətir:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Faucet ictimai testnet xidmətidir. Qəbul və ya tələb son nöqtəsi `502`, vaxt məhdudluğu və ya başqa bir qapı səviyyəsində səhv qaytarırsa, açarlarınızı və ya müştəri konfigurasını dəyişdirmədən əvvəl gözləyin və yenidən cəhd edin.

Cavabın forması belədir:

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

`difficulty_bits` `0` olduğu təqdirdə, yalnız ID hesabını təqdim edin:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

`difficulty_bits` `0`-dən böyük olduqda, puzzle-ni həll edin və demir hündürlüyü əlavə olun:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

Puzzle alqoritmi:

1. Təhdid SHA-256 kimi qurun:
   - `iroha:accounts:faucet:pow:v2` baytları
   - UTF-8 hesabı ID
   - `anchor_height` big-endian `u64` kimi
   - `anchor_block_hash_hex` bayt kimi kəşf edilmişdir
   - `challenge_salt_hex` mövcud olduqda bayt kimi kəşf edilmişdir
2. `u64` nonces kodlaşdırılmış big-endian 8-bayt dəyərləri ilə sınayın.
3. Hər bir nonce üçün skript işlətmək:
   - şifrə: 8 baytlı nonce
   - duz: 32-bayt çətinliyi
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - Çıxış uzunluğu: 32 bayt
4. Qalib olan nonce, ən azı `difficulty_bits` sıfır bitlərin öhdəsindən gələn ilk digestdir.

Faucet cavabı maliyyələşdirilmiş aktiv və növbəli əməliyyat hashini əhatə edir:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

Hal-hazırda cavab HTTP `202 Accepted` ilə qaytarılır. Yuxarıda göstərilən aktiv tərifi ID ictimai kran tərəfindən maliyyələşdirilən Taira ödənişli aktivdir. kran `tx_hash_hex` və `status: "QUEUED"` qaytarıldıqdan sonra tələbi qəbul edib.

Sonra öz ödəniş əməliyyatlarınızı təqdim etməzdən əvvəl maliyyələşdirilən aktiv üçün sorğular aparın:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Faucet tələbi qəbul edildi, lakin hesab və ya aktiv hələ görünmürsə, əməliyyat hələ də ictimai testnet növbənin işlənməsindədir.

İşə hazır birbaşa API yoxlama üçün bunu `taira_faucet_claim.py` olaraq saxlayın və Taira I105 hesabını ID keçin:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Faucet yalnız Taira testnet fondları üçün nəzərdə tutulur. Testnet XOR, faucet hesabları və ya Taira kanary imzalayıcılarından Minamoto axınlarında istifadə etməyin.

## 5. Minamoto Müştəri Konfigurasiyasını yaratın. {#_5-create-a-minamoto-client-config}

Ayrı bir düymə parası istifadə edin Minamoto. Yenidən istifadə etməyin Taira əsas şəbəkə açarları.

`minamoto.client.toml` yaratmaq:

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

Ən yüksək səviyyədə `chain` mövcuddur. Nexus əsas şəbəkə zəncirləri ID. `[account].profile = "minamoto"` seçir Minamoto I105 silsilə ayırdçısı; son nöqtəsinin ev sahibi adı və silsilə ID onu təsadüfən seçməyin.

Minamoto ictimai açarını əsas şəbəkə prefiksi ilə I105 kanonik hesabına ID çevirin:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Hesabın əsas şəbəkəyə daxil edilməsi və ya idarəetmə axını vasitəsilə təmin olunana qədər yalnız oxunma tərəfi yoxlamaları aparın:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet və ya yazıçının köməkçisi ilə Minamoto mübarizə aparmayın.

## 6. Minamoto Hesabını XOR ilə maliyyələşdirin. {#_6-fund-a-minamoto-account-with-xor}

Minamoto ödənişləri XOR istehsalı ilə ödənilir və Minamoto heç bir ictimai faucetə malik deyil. Konfiqurasiya edilmiş hesabı təsdiqlənmiş əsas şəbəkə yükləməsi və ya xəzinə köçürməsi vasitəsilə maliyyələşdirin və ya mövcud maliyyələşdirilmiş Minamoto hesabından XOR alın.

ID qanuni hesabı və maliyyələşdirməni yalnız oxunma yoxlamaları ilə qeyd etmədən əvvəl təsdiqləyin. Minamoto XOR-i istehsal fondları kimi qəbul edin: əvvəlcə eyni əməliyyatı Taira -da təcrübə edin, ayrı istehsal açarlarını saxlayın və əsas şəbəkə əməliyyatının yenidən qurula biləcəyini düşünməyin.

Taira XOR Minamoto ödənişlərini ödəyə bilməz. Testnet balansları və faucet iddiaları Minamoto-ə köçürülmür.

## 7. Mövcud məlumat məkanında işləyin {#_7-work-inside-an-existing-dataspace}

Məlumat sahəsi daxilində yaşayan nəşriyyat obyektləri üçün tam təsdiqlənmiş domen adlarından istifadə edin. Məsələn, ictimai məlumat sahəsindəki layihə domenindən istifadə etmək lazımdır:

```text
apps.universal
```

Hesabınız tələb olunan icazələrə sahib olduqda, domen üçün gizli olmayan `AliasSetupPlanRequestV1` niyyətini yaratın və bəyanatlı planlaşdırıcıdan istifadə edin:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto üçün ayrı bir əsas şəbəkə niyyətini və planını istehsal edin və təsdiqləyin. Planlar zəncirinə, səlahiyyətlərinə, canlı dövlət ancoruna və müddətinə bağlıdır, buna görə Taira planı təbliğ etmək və ya yenidən oynamaq mümkün deyil:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Hesab aliasları eyni məlumat sahəsi sufiksindən istifadə edir:

```text
alice@apps.universal
alice@universal
```

Məhdud hesab sahələrində hələ də kanonik istifadə olunur I105 hesab IDs. Əksi adları insan oxuduğu və qanuni hesablara uyğun olan bağlar kimi qəbul edin. IDs.

## 8. Yeni bir məlumat məkanı təmin etmək {#_8-provision-a-new-dataspace}

Yeni bir məlumat sahəsi operator və idarəetmə dəyişikliyidir. ictimai Torii son nöqtəsi trafikin konfiqurasiyalı məlumat sahələrinə yönləndirə bilər, lakin bilinməyən məlumat sahəsi əlifbalarını rədd edəcəkdir.

Dəyişiklik hazırlamazdan əvvəl, mövcud canlı kataloq tutun:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

İşləyicinin hesabı üçün də yol manifesti mövqeyini yoxlayın:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

ID, məlumat boşluğu ID, təsdiqçi dəstləri, səhv tolerantlığı, manifest, marşrut qaydaları və əməliyyat sahibinin birlikdə nəzərdən keçirilmədiyi təqdirdə yeni bir alimi təbliğ etməyin. Lazım olan icazələrə malik normal istifadəçi hesabı mövcud məlumat sahəsi daxilində bir domen əldə edə və SNS icarəsini ala bilər; o, yeni ictimai məlumat sahəsini təhlükəsiz əlavə edə bilməz.

Xüsusi və ya təşkilati məlumat sahəsi üçün kataloq dəyişikliyi hazırlayın:

- unikal məlumat sahə alias və rəqəmsal `id`
- Müvafiq zolaq giriş və ya mövcud zolaq təyinatı
- məlumat sahəsi `fault_tolerance`
- Orada yerləşdirilməsi lazım olan təlimat və ya hesab sahələri üçün marşrut qaydaları
- Məlumat sahəsi UAID imkanlarını aşkar edərkən, Space Directory manifestı və ya müvafiq tətbiq sübutları.
- Validator, müvafiqlik, hesablama və monitorinq siyasəti üçün idarəetmə təsdiqlənməsi

Yenidən nəzərdən keçirilə bilən konfiqurasiya parçaları belə görünür:

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

Operatorun qəbuluna aşağıdakı qapılar daxildir:

- `irohad --sora --config <config.toml> --trace-config` həll olunmuş düyün konfigurasiyasını keçirir.
- Yaradılan və ya nəzərdən keçirilən manifest hash və imzalarla arxivlənir.
- Hər hansı bir Minamoto təşviqatdan əvvəl duman sınaqları Taira keçirilir.
- dəyişiklikdən sonra `/status` kataloq planlaşdırılan zolağı və məlumat sahəsini göstərir.
- `iroha app nexus lane-report --summary` tələb olunan sənədlərin yox olduğunu bildirmir.

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Eyni məlumat məkanını inkişaf etdirmək Minamoto yalnız Taira İstifadə, duman sınaqları, monitorinq və idarəetmə sübutları tamamlanmışdır.

## Əlaqəli səhifələr {#related-pages}

- [Iroha 3](/az/get-started/install-iroha.md) quraşdırmaq
- [Iroha 3 vasitəsilə CLI](/az/get-started/operate-iroha-via-cli.md) istifadə etmək
- [Xüsusi məlumat sahəsi üçün sponsor ödənişləri](/az/get-started/private-dataspace-fee-sponsor.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
- [Genesis istinadı](/az/reference/genesis.md)
