---
translation_locale: az
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kaigi JavaScript Tətbiqində yerləşdirin {#embed-kaigi-in-a-javascript-app}

Kaigi Iroha üzərində bir iclasın həyat dövrünü qeyd edir, eyni zamanda brauzer WebRTC üzərindən audio və video göndərir. Blokçeyn dəftəri zəngi, iştirakçı siyahısındakı dəyişiklikləri, şifrələnmiş siqnalizasiya metadata-sını və yekun vəziyyəti saxlayır; bu, media ötürücüsü deyil.

Bu dərs hazırkı [Iroha JavaScript demosunu](https://github.com/soramitsu/iroha-demo-javascript) izləyir. Demo ilk buraxılış üçün bir tətbiq profilini həyata keçirir:

- bir ev sahibi və bir qonaq
- `transparent` Kaigi məxfilik rejimi
- `authenticated` otaq siyasəti
- `RevealAfterJoin` şəbəkə həmkarı şəxsiyyət davranışı
- zəng metadatasında şifrələnmiş təklif və yekunlaşdırılmış əməliyyat metadatasında şifrələnmiş cavab

Kaigi protokolu həmçinin `zk-roster-v1` təyin edir, lakin mövcud demo həmin sübut axını yaratmır və ya təqdim etmir. Əgər körpünüz mövcud sübut müqaviləsini tam həyata keçirmirsə, şəxsi rejim nəzarətini təqdim etməyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

Sizə lazım olacaq:

- Node.js 20 və ya daha yeni və Rust alət dəsti
- bir Kaigi-göstərici Torii API son nöqtə
- ayrı maliyyələşdirilmiş ev sahibi və qonaq hesabları
- hər bir hesabın imza açarı imtiyazlı cüzdanda və ya tətbiq körpüsündə
- hər iki brauzer kontekstində kamera və mikrofon icazəsi

Demo `file:../iroha/javascript/iroha_js` qardaş asılılıq vasitəsilə `@iroha/iroha-js` istifadə edir. Demo quraşdırmadan əvvəl Iroha mənbə yoxlamasından SDK-ü qurun:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Təmiz SDK paket tələb olunan Cargo iş sahəsini içermir `npm run build:native`, ona görə onu yenidən inşa et Iroha mənbə kodunun işlək nüsxəsi sonra SDK dəyişikliklər. Sənədləşdirilmiş SDK mənbə bərkidilib [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## API son nöqtəni yoxlayın {#check-the-endpoint}

İctimai Taira test şəbəkəsi üçün əvvəlcə Torii əlçatarlığını yoxlayın:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Bu sorğular yalnız onu sübut edir ki, Torii və onun reklam olunan API sənədi əlçatandır. Onlar müəyyən bir Kaigi çağırışının mövcud olduğunu və ya cüzdanınızın əməliyyatlar təqdim edə biləcəyini sübut etmir.

İmzalanmamış `curl` sorğularla `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` və ya `/v1/kaigi/relays/health`-ni yoxlamayın. Bu üç marşrut icazə verilmiş operator imzası tələb edir. Röle hadisə axını bir protokol-standartı dəqiq-şəbəkə hesab imzası tələb edir.

Demo versiyada, Parametrləri açın, Torii URL daxil edin və API son nöqtə kəşfiyyatının UUID zəncirini, dəqiq `NetworkId` və şəbəkə prefiksini yükləməsinə icazə verin. Yazma körpüsü seçilmiş API son nöqtəsinə bütün üç dəyəri bağlamalıdır; heç vaxt zəncirdən UUID və ya prefiksdən `NetworkId` yaratmayın.

## Marşrut və Avtorizasiya Modeli {#route-and-authentication-model}

Kaigi yazıları ödənişi hesablanmış və imzalanmış adi əməliyyatların daxilindəki təlimatlardır. Onları `POST /v1/pipeline/transactions` vasitəsilə təqdim edin və yekunlaşmış blok sübutunu gözləyin.

Tətbiqin oxumaları bunlardır:

|Marşrut|Təsdiqləmə|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |ictimai|
| `/v1/kaigi/calls/{call_id}/signals` |tək protokol-standart dəqiq-şəbəkə hesab sorğusu|
| `/v1/kaigi/calls/{call_id}/events` |tək protokol-standart dəqiq-şəbəkə hesab sorğusu|

JavaScript SDK bunları `getKaigiCall` və `listKaigiCallSignals` kimi göstərir. Siqnal siyahısı dəqiq kursor səhifələməsindən istifadə edir. Qaytarılmış kursoru dəyişmədən yenidən istifadə edin; onu ofsetlə və ya yalnız zaman damğası ilə davam etmə ilə əvəz etməyin.

## Rendererin Xaricində İmzalamağa Davam Edin {#keep-signing-outside-the-renderer}

İnteqrasiyanı üç sərhədə bölün:

|Hüdud|Məsuliyyət|
| ----------------- | -------------------------------------------------------------------- |
|Renderləyici|görüş forması, dəvət linki, media nəzarətləri, WebRTC təkliflər və cavablar|
|Üstünlük verilmiş körpü|açar girişi, ödəniş qiyməti təxmini, təlimat qurmaq, imzalamaq, yekun gözləmələr|
| Torii             |zəng qeydi, yekunlaşdırılmış siqnal oxumaları, əməliyyat təqdimatı|

Renderer-ə yönəlmiş körpü API son nöqtə şəxsiyyətini açıq şəkildə qəbul etməli və şəxsi açar materialını sərhəddin arxasında saxlamalıdır. Mövcud demo səthi bu sadələşdirilmiş müqaviləyə bərabərdir:

```ts
type ConnectionIdentity = {
  toriiUrl: string
  chainId: string
  networkId: string
  networkPrefix: number
}

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string
  privateKeyBase64Url: string
}

type KaigiMeeting = {
  callId: string
  meetingCode: string
  hostAccountId?: string
  hostKaigiPublicKeyBase64Url: string
  scheduledStartMs: number
  expiresAtMs: number
  createdAtMs: number
  live: boolean
  ended: boolean
  privacyMode: 'transparent'
  peerIdentityReveal: 'RevealAfterJoin'
  offerDescription: { type: 'offer'; sdp: string }
}

type KaigiSignalPage = {
  items: Array<{
    entrypointHash: string
    callId: string
    participantId: string
    participantName: string
    createdAtMs: number
    answerDescription: { type: 'answer'; sdp: string }
  }>
  nextCursor?: string
}

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair

  createKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      title?: string
      scheduledStartMs: number
      meetingCode: string
      inviteSecretBase64Url: string
      hostDisplayName: string
      hostParticipantId: string
      hostKaigiPublicKeyBase64Url: string
      offerDescription: { type: 'offer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  getKaigiCall(input: {
    toriiUrl: string
    callId: string
    inviteSecretBase64Url: string
  }): Promise<KaigiMeeting>

  joinKaigiMeeting(
    input: ConnectionIdentity & {
      participantAccountId: string
      callId: string
      inviteSecretBase64Url: string
      participantId: string
      participantName: string
      answerDescription: { type: 'answer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  pollKaigiMeetingSignals(input: {
    toriiUrl: string
    networkId: string
    networkPrefix: number
    accountId: string
    callId: string
    hostKaigiKeys: KaigiSignalKeyPair
    limit?: number
    cursor?: string
  }): Promise<KaigiSignalPage>

  endKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      endedAtMs?: number
    },
  ): Promise<{ hash: string }>
}
```

Həqiqi demo nəticəsi yekunlaşdırılmış blok sübutunu və hesablanmış hər hansı ödənişi də ehtiva edir. Yalnız əməliyyat heşini uğur hesab etməyin.

## Dəvət Müqaviləsi {#invite-contract}

Dəqiq `domain.dataspace:meeting` formasında bir zəng identifikatorundan istifadə edin. Demo `kaigi.universal` altında zənglər yaradır və 32 çılpaq olmayan base64url xarakterləri kimi kodlanmış 24 baytlıq kriptoqrafik olaraq təsadüfi dəvət gizliliyindən istifadə edir.

Tək bir protokol-standart dəvət tam olaraq bir `call` və bir `secret` parametrini ehtiva edir:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Tətbiq daxilindəki ehtiyat variant eyni dəqiq sorğudur `#/kaigi`-də. Dublikat, naməlum, boş, doldurulmuş və ya tək protokol-standart olmayan parametrləri rədd edin. Demo görüşün sona çatma müddətini `scheduledStartMs`-dən 24 saat sonra təyin edir.

Dəvət sirri ev sahibinin təklif metadatasını deşifrə edir. Bu, daşınan bir sirrdir: onu qeydə almayın, analitikada istifadə etməyin və ya blokçeyn jurnal metadatasında saxlamayın. Ev sahibinin ayrı X25519 açar cütü qonağın cavab siqnallarını deşifrə edir və yalnız ev sahibi sessiyasında yerli qalmalıdır.

## Görüşün Həyat Sikli {#meeting-lifecycle}

### Ev sahibi {#host}

1. Seçilmiş pul kisəsi şəxsiyyətinin API son nöqtəsinin zəncirinə UUID, dəqiq `NetworkId` və prefiksinə uyğun olduğunu təsdiqləyin.
2. Yerel medianı açın və bir `RTCPeerConnection` yaradın.
3. SDP təklifi yaradın və ICE yığımının bitməsini gözləyin.
4. Dəvətnamə gizliliyini və host Kaigi siqnal açar cütlüyünü yarat.
5. Təklifinizi dəvət sirri ilə şifrələyin.
6. Ödəniş qiymət təxminini əldə edin və şəffaf, təsdiqlənmiş rejimdə `CreateKaigi` olan bir əməliyyatı imzalayın.
7. Dəvəti canlı göstərmədən əvvəl yekunlaşdırılmış blok sübutunu gözləyin.

Host sessiyasını açıq saxlayın. Signal marşrutunu host hesabının tək protokol-standart sorğu imzası ilə sorğu edin, ilk keçərli cavabı host signal açarı ilə deşifrə edin və onu `setRemoteDescription` ilə tətbiq edin. Daha çox səhifə mövcud olduqda `nextCursor`-i dəqiq olaraq irəli aparın.

### Qonaq {#guest}

1. Dəqiq dəvəti bölüşdürün və yoxlayın.
2. İctimai zəng qeydlərini əldə edin və onun təklifini dəvət gizli açarı ilə deşifr edin.
3. Bitmiş, vaxtı keçmiş, canlı olmayan və ya şəffaf olmayan görüşü rədd et.
4. Yerel medianı açın, təklifi tətbiq edin, bir SDP cavab yaradın və ICE toplamanı tamamlayın.
5. Cavabı hostun Kaigi açıq açarı ilə şifrələ.
6. Haqq qiymət təxminini əldə edin və `JoinKaigi` ilə birlikdə tək protokol-standart cavab metadatasını ehtiva edən əməliyyatı imzalayın.
7. Qonağı qoşulmuş kimi göstərmədən əvvəl yekun blok sübutunu gözləyin.

### Son {#end}

Yalnız host `EndKaigi`-i təqdim edə bilər. Şəbəkə şəbəkə həmkarı bağlantısını və media izləmələrini bağlayın, imzalanmış təlimatı təqdim edin və yekunlaşmanı gözləyin. Şəffaf iştirakçı `LeaveKaigi`-dən istifadə edə bilər; bir `zk-roster-v1` ayrılma ilkin buraxılış protokolunda off-chain olur və yerli təlimat məxfilik-tərk artefaktlarını rədd edir.

## Əl ilə WebRTC Ehtiyat {#manual-webrtc-fallback}

Demo yerli inkişaf üçün İrəliləmiş siqnal yolu saxlayır. Bu, hosta və qonağa avtomatik olaraq blokçeyn jurnal siqnalı mövcud olmadıqda xam WebRTC təklif və cavab paketlərini kopyalamağa imkan verir.

Bunu fərqli bir rejim kimi qəbul edin. Bu, Kaigi qeydini yaratmır, qoşulmur və ya bitirmir, əməliyyatın yekunluğunu təmin etmir və blok zənciri axını ilə eyni kimi təqdim edilməməlidir.

## İnteqrasiyanı sınayın {#test-the-integration}

Cari diqqət mərkəzində olan demo test paketlərini işlədin:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Testlər mövcud şəffaf profili, ciddi dəvət təhlilini, şifrlənmiş siqnallaşmanı, yerli sessiyanın davamlılığını və əl ilə ehtiyat keçidi əhatə edir. Həqiqi media sınağı üçün yenə də maliyyələşdirilmiş iki pulqabı və iki pəncərə və ya cihaz lazımdır; imitasiya edilmiş WebRTC və renderer testləri kamera, mikrofon, NAT keçidi, kanonik sorğu autentifikasiyası və ya canlı əməliyyatın yekunlaşmasını sübut etmir.

Tam API son nöqtə matrisini və CLI həyat dövrünü görmək üçün [Torii API uç nöqtələr: Kaigi sessiyalar](/az/reference/torii-endpoints.md#kaigi-sessions)-ə baxın.
