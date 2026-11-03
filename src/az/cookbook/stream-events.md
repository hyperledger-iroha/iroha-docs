---
translation_locale: az
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Axın Hadisələri {#stream-events}

## Nəticə {#outcome}

Server tərəfindən göndərilən hadisələr (SSE) üzərindən canlı Taira proqram təminatı işləmə iş axını hadisələrini istehlak edin, məhdud geri çəkilmə ilə yenidən qoşulun və davamlı vəziyyəti yeniləyin dəyişdirilmə axını açıq olduqdan sonra. Çünki API son nöqtənin təkrar oynatma göstəricisi yoxdur, hadisələri tam tarixçə kimi deyil, bildirişlər kimi qəbul edin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl` ictimai test üçün.
- Node.js JavaScript istehlakçı üçün 24.
- Heç bir kriptoqrafik imzalayıcı tələb olunmur. `https://taira.sora.org/v1/events/sse` ictimai, yalnız oxunan bir axındır; bu resept heç bir Minamoto və ya Taira yazısı icra etmir.

## Addımlar {#steps}

### 1. SSE cavabı təsdiqləyin {#_1-confirm-the-sse-response}

Hadisə axınını JSON ehtiyat variantı ilə sorğulayın: Torii axını `text/event-stream` formatında ötürür, rədd edilmiş sorğunu isə, məsələn, etibarsız filtri, JSON xətası kimi bildirir. curl buferləşdirməsini söndürün. Əmr 20 saniyədən sonra bitir. Torii 15 saniyəlik boş dayanmadan sonra heartbeat şərhi göndərir, buna görə sakit dövrdə yalnız heartbeat şərhlərinin alınması normaldır.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

`Last-Event-ID` göndərməyin. Torii-in SSE API ucu canlı fan-out axınıdır, yenidən oynatma qeydi deyil və yenidən oynatma sorğularını rədd edir.

### 2. Filtrlənmiş JavaScript istehlakçını əlavə edin {#_2-add-a-filtered-javascript-consumer}

Aşağıdakını `stream-taira.mjs` kimi yadda saxlayın. O, ötürmə formatını göstərmək üçün birbaşa Fetch istifadə edir. `filter` sorğu parametri təsdiqlənmiş əməliyyat hadisələrini seçmək üçün Torii-nin mətn filtri qrammatikasından istifadə edir, analizator isə SSE çərçivələrini təkrar oxutma kursoru olmadan emal edir.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = 'tx_status = "Approved"'

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?limit=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', filter)
  const response = await fetch(url, {
    headers: { Accept: 'text/event-stream, application/json' },
    signal: shutdown.signal,
  })
  if (!response.ok) {
    throw new Error(
      `SSE request failed: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  if (
    !response.headers.get('content-type')?.startsWith('text/event-stream')
  ) {
    throw new Error('Taira did not negotiate an event-stream response')
  }
  if (!response.body) throw new Error('SSE response has no body')

  // Establish the replacement stream first. Events that arrive while the
  // durable-state query runs remain buffered on this live response.
  try {
    await reconcile()
  } catch (error) {
    console.error(error)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (!shutdown.signal.aborted) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    for (;;) {
      const boundary = buffer.match(/\r?\n\r?\n/)
      if (!boundary || boundary.index === undefined) break
      const block = buffer.slice(0, boundary.index)
      buffer = buffer.slice(boundary.index + boundary[0].length)

      let event = 'message'
      const dataLines = []
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith(':')) continue
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (line.startsWith('data:'))
          dataLines.push(line.slice(5).trimStart())
      }
      if (dataLines.length === 0) continue
      const rawData = dataLines.join('\n')
      let data
      try {
        data = JSON.parse(rawData)
      } catch {
        data = rawData
      }
      yield { event, data }
    }
  }
}

async function follow() {
  let backoffMs = 250

  while (!shutdown.signal.aborted) {
    try {
      for await (const event of streamOnce()) {
        if (event.event === 'stream_error') {
          throw new Error(
            `server closed stream: ${JSON.stringify(event.data)}`,
          )
        }

        console.log(event)
        backoffMs = 250
      }
    } catch (error) {
      if (shutdown.signal.aborted) break
      console.error(error)
    }

    // The disconnected interval cannot be replayed. Back off, then establish
    // a new stream; streamOnce refreshes state after the response is open.
    await delay(backoffMs)
    backoffMs = Math.min(backoffMs * 2, 10_000)
  }
}

await follow()
```

Bunu ən azı bir əməliyyat Taira-də `Approved`-a çatana qədər işlədin:

```bash
node ./stream-taira.mjs
```

SSE ürək döyüntüsü şərhləri boş bağlantıları aktiv saxlayır, lakin blokçeyn dəftər sifarişini qurmaz. Sıra və ya tamlıq əhəmiyyətli olduqda blok hündürlüklərindən, əməliyyat kriptoqrafik xəşlərindən və blokçeyn dəftər sorğularından istifadə edin.

Son-25 tədqiqat tələbi yalnız ictimai diaqnostikadır. İstehsal istehlakçısı `reconcile()`-ı onun davamlı tətbiq resursları üçün sorğularla və yoxlama nöqtəsi üçün kifayət qədər böyük bir bərpa sərhədi ilə əvəz etməli və ya genişləndirməlidir. Yalnız məhdudlaşdırılmış zaman nöqtəsində olan məlumat görünüşü heç bir hadisənin qaçırılmadığını sübut edə bilməz.

`@iroha/iroha-js` paketindəki `ToriiClient.streamEvents({ filter })` eyni axını oxuyur: `field('tx_status').eq('Approved')` və ya yuxarıdakı mətn filtrini ötürün. Axın bitməzdən əvvəl o, yekun `stream_error` çərçivəsini qaytarır, buna görə yuxarıdakı yenidən qoşulma və uzlaşdırma qaydaları yenə də tətbiq olunur.

## Yoxla {#verify}

Bir terminalda JavaScript istehlakçısını işə salın. Başqa bir terminalda isə ictimai əməliyyat nöqtəsində vaxt məlumat baxışını oxuyun:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Diqqət etdiyiniz hər bir əməliyyat hadisəsi üçün onun kriptoqrafik xəşini zaman nöqtəsi məlumat baxışında tapın və ya birbaşa sorğu edin. Məhdud səhifə köhnə əməliyyatları buraxa bilər. Sonra dayandırın və istehlakçını yenidən başladın: o, hadisə ID-si təqdim etmədən yenidən qoşulmalı və əvəzləmə axını açıldıqdan sonra yeni bir diaqnostik çap etməlidir.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Yalnız ürək döyüntüsü şərhləri olan, amma məlumat hadisələri olmayan bir əlaqə sağlamdır; seçilmiş proqram təminatı işləmə iş axını vəziyyəti sadəcə səssiz ola bilər.
- `invalid_filter` kodlu `400` o deməkdir ki, `filter` Torii-nin mətn qrammatikasına uyğun deyil və ya hadisə axınlarının dəstəkləmədiyi sahəni göstərir. Hadisə axınları `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` və `proof_envelope_hash` sahələri üzrə filtrlənir.
- `stream_error` hadisəsi serverin gecikmə və ya axının başqa yekun vəziyyətini aşkar etdiyini göstərir. Torii bu hadisəni bir dəfə göndərir və axını bağlayır; əvəzedici axın açın, sonra uzlaşdırma aparın.
- Bir proksi, Torii etmədikdə belə SSE-ni tamponlaya bilər. Proksidə cavab tamponlamasını və sıxılmanı deaktiv edin və `curl -N`-ı diaqnostikada saxlayın.
- Heç vaxt ayrılmış boşluğu növbəti hadisənin əvvəlkindən sonra gələcəyini fərz edərək doldurmayın. API son nöqtənin təkrar oynatma göstəricisi yoxdur; bunun əvəzinə mövcud blokçeyn dəftər vəziyyətini sorğu edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [JavaScript pinlənmiş mənbə kodu reviziyasında axın resepti](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE pin edilmiş mənbə kodu reviziyasında inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Sabitlənmiş mənbə kodu reviziyasında Torii filtrinin mətn qrammatikası](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii hadisə marşrutlaşdırılması təyin olunmuş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Tədbirlər](/az/blockchain/events.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [Blokçeyn dəftər vəziyyətini sorğu et](./query-ledger-state.md)
