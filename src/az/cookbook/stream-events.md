---
translation_locale: az
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hadisələr axını {#stream-events}

## Nəticə {#outcome}

Server tərəfindən göndərilən hadisələr (SSE) üzərində canlı Taira boru xətti hadisələrini istehlak edin, sərhədli backoff ilə yenidən qoşulun və əvəz axını açıldıqdan sonra davamlı vəziyyətə yeniləyin. Son nöqtədə təkrarlama kursoruna malik olmadığı üçün hadisələri tam tarix deyil, bildirişlər kimi qəbul edin.

## Əvvəlki şərtlər {#prerequisites}

- `curl` ictimai tüstü testinə görə.
- Node.js 24 istehlakçı üçün JavaScript.
- İmzaçı tələb olunmur. `https://taira.sora.org/v1/events/sse` ictimai, yalnız oxunma axınıdır; bu resept heç bir Minamoto və ya Taira yazısını yerinə yetirmir.

## Dərslər {#steps}

### 1. SSE cavabını təsdiqləyin {#_1-confirm-the-sse-response}

Taira hal-hazırda bu marşrutdan yalnız `Accept` başlığı seçilən hadisə axını və JSON geri çəkilməsini əhatə edərkən danışır. curl tamponu söndürün. Komanda 15 saniyədən sonra başa çatır; sakit bir dövrdə yalnız ürək döyüşləri şərhlərini qəbul etmək etibarlıdır.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Göndərməyin `Last-Event-ID`. Torii Bu ... SSE Son nöqtəsi canlı fan-out axınıdır, yenidən oynamaq logu deyil və yenidən oynatma istəklərini rədd edir.

### 2. Filtrlənmiş JavaScript istehlakçı əlavə edin. {#_2-add-a-filtered-javascript-consumer}

Aşağıdakıları qeyd edin: `stream-taira.mjs`. Bu birbaşa Fetch istifadə edir ki, müraciət göndərə bilər Taira məmulat tələb olunur . `Accept` Başlıq. `FilterExpr` təsdiq edilmiş əməliyyat hadisələrini seçir və analizçi istehlak edir. SSE Yenidən oynatma kursoruna sahib olmayan kadrlar.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = {
  op: 'eq',
  args: ['tx_status', 'Approved'],
}

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?page=1&per_page=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', JSON.stringify(filter))
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

Taira-də ən azı bir əməliyyat `Approved`ə çatana qədər icra edin:

```bash
node ./stream-taira.mjs
```

SSE ürək döyüntüsü şərhləri boş əlaqələri canlı saxlayır, lakin kitabın sifarişini təsis etmirlər. Sifariş və ya tamlıq məsələlərində blok hündürlüyü, əməliyyat həşləri və kitabın sorğularından istifadə edin.

Son 25 kəşfçi tələbi yalnız ictimai diaqnozdur. İstehsalat istehlakçısı `reconcile()` -ni davamlı tətbiq resursları və yoxlama nöqtəsi üçün kifayət qədər böyük bir bərpa bağı ilə əvəz etməlidir və ya uzatmalıdır. Yalnız məhdud sürət görüntüsü heç bir hadisənin qaçırılmadığını sübut edə bilməz.

Qeyri-hüquqlu bir işdə, `ToriiClient.streamEvents()` yalnız göndərir `Accept: text/event-stream`; canlı Taira bu dar başlığı rədd edir `406`. Yuxarıda göstərilən xam Fetch formasını istifadə edin SDK və ictimai son nöqtələr eyni media növləri danışıqlar aparır.

## Tətbiq edin {#verify}

Bir terminalda JavaScript istehlakçını çalışdırın, digərində isə ictimaiyyət əməliyyatının sürətli görünüşünü oxuyun:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Hər bir əməliyyat hadisəsi üçün maraqlanırsınız, onun hashini sürətli görüntülərdə tapın və ya doğrudan sorğu verin. Sərhədli səhifə köhnə əməliyyatlar istisna edə bilər. və istehlakçını yenidən başlatmaq: o, hadisə ID təqdim etmədən yenidən bağlanmalıdır və əvəz axını açıldıqdan sonra yeni bir diaqnostik çap etməlidir.

## Problemlərin həlli {#troubleshooting}

- Ürək döyüntüsü şərhləri ilə əlaqə, lakin heç bir məlumat hadisələri sağlamdır; seçilmiş boru xəttinin statusu sadəcə sakit ola bilər.
- `406 Not Acceptable` canlı yayında Taira adətən yalnız reklam edilən tələb deməkdir `text/event-stream`. Göndər `text/event-stream, application/json` yuxarıda göstərildiyi kimi.
- `stream_error` hadisəsi, serverin gecikmə və ya digər terminal axını vəziyyətini aşkar etdiyini göstərir. Torii bu hadisəni bir dəfə göndərir və axını bağlayır; yenidən qoşulmadan əvvəl uyğunlaşdırın.
- Bir proxy SSE buffer edə bilər, hətta Torii olmasa da. Proxy-də cavab buffering və sıxılma söndürün və diaqnostikada `curl -N` saxlayın.
- Sonrakı hadisənin əvvəlki hadisədən sonra baş verəcəyini güman edərək heç vaxt bağlanmadan boşluğu doldurmayın. Son nöqtədə yenidən oynatma kursoru yoxdur; bunun əvəzinə cari kitabın vəziyyətini soruşun.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [JavaScript pinning commit-də axın resepti](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [SSE bağlanmış komitdə inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Torii FilterExpr parser at pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii bağlanmış komitdə hadisə yönümləməsi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [Hadisələr](/az/blockchain/events.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
- [Ərizə kitabının vəziyyəti](./query-ledger-state.md)
