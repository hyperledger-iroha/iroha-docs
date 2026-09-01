---
translation_locale: es
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Incrustar Kaigi en una aplicación JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi registra el ciclo de vida de una reunión en Iroha mientras el navegador transmite audio y video a través de WebRTC. El libro mayor de la cadena de bloques almacena la llamada, las mutaciones de la lista de participantes, los metadatos de señalización encriptados y el estado final; no es un relé de medios.

Este tutorial sigue el actual [Iroha JavaScript demostración](https://github.com/soramitsu/iroha-demo-javascript). La demostración implementa un perfil de aplicación de primera versión:

- un anfitrión y un invitado
- `transparent` Kaigi modo de privacidad
- `authenticated` política de la habitación
- `RevealAfterJoin` comportamiento de la identidad del par de la red
- una oferta encriptada en los metadatos de la llamada y una respuesta encriptada en los metadatos de la transacción comprometida

El protocolo Kaigi también define `zk-roster-v1`, pero la demostración actual no genera ni envía ese flujo de prueba. No presente un control en modo privado a menos que su puente implemente el contrato completo de prueba actual.

## Requisitos previos {#prerequisites}

Necesitas:

- Node.js 20 o más reciente y una cadena de herramientas Rust
- un endpoint API Torii capaz de Kaigi
- separar cuentas financiadas de anfitrión e invitado
- la clave de firma de cada cuenta en una billetera privilegiada o en un puente de aplicación
- permiso de cámara y micrófono en ambos contextos del navegador

La demostración consume `@iroha/iroha-js` a través de la dependencia hermana `file:../iroha/javascript/iroha_js`. Compile el SDK desde la revisión de código fuente Iroha antes de instalar la demostración:

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

El limpio SDK el paquete no contiene el espacio de trabajo Cargo requerido por `npm run build:native`, así que reconstruyelo en el Iroha copia de trabajo del código fuente después SDK cambios. Lo documentado SDK la fuente está fijada en [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Verifica el endpoint API {#check-the-endpoint}

Para la testnet pública Taira, primero verifique la accesibilidad de Torii:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Estas solicitudes solo prueban que Torii y el documento de API que anuncia son accesibles. No prueban que exista una llamada Kaigi concreta ni que su billetera pueda enviar transacciones.

No sondee `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` o `/v1/kaigi/relays/health` con solicitudes `curl` no firmadas. Esas tres rutas requieren una firma de operador en la lista de permitidos. La secuencia de eventos de retransmisión requiere una firma de cuenta de red exacta y canónica.

En la demostración, abra **Configuración**, introduzca la URL de Torii y deje que el descubrimiento de endpoints cargue el UUID de la cadena, el `NetworkId` exacto y el prefijo de red. Un puente de escritura debe vincular los tres valores al endpoint seleccionado; nunca construya un `NetworkId` a partir del UUID de la cadena ni del prefijo.

## Modelo de Ruta y Autenticación {#route-and-authentication-model}

Kaigi escribe instrucciones dentro de transacciones ordinarias con comisión cotizada y firmadas. Envíelas a través de `POST /v1/pipeline/transactions` y espere la evidencia del bloque finalizado.

Las lecturas de la aplicación son:

|Ruta|Autenticación|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}`|pública|
| `/v1/kaigi/calls/{call_id}/signals` |solicitud de cuenta de red exacta canónica|
|`/v1/kaigi/calls/{call_id}/events`|solicitud de cuenta de red exacta canónica|

El JavaScript SDK expone estos como `getKaigiCall` y `listKaigiCallSignals`. La lista de señales utiliza paginación exacta con cursor. Reutilice el cursor devuelto sin cambios; no lo reemplace por un desplazamiento ni por una continuación basada solo en una marca de tiempo.

## Sigue firmando fuera del renderizador {#keep-signing-outside-the-renderer}

Divide la integración en tres límites:

|Límite|Responsabilidad|
| ----------------- | -------------------------------------------------------------------- |
|Renderizador|formulario de reunión, enlace de invitación, controles de medios, WebRTC ofertas y respuestas|
|Puente privilegiado|acceso clave, estimación del precio de la tarifa, construcción de instrucciones, firma, esperas de finalización|
| Torii             |registro de llamadas, lecturas de señales comprometidas, envío de transacciones|

El puente dirigido al renderizador debe aceptar la identidad del endpoint API explícitamente y mantener el material de la clave privada detrás del límite. La superficie de demostración actual es equivalente a este contrato reducido:

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

El resultado real de la demostración también incluye evidencia del bloque finalizado y cualquier tarifa cotizada. No trate un hash criptográfico de la transacción por sí solo como un éxito.

## Contrato de invitación {#invite-contract}

Use un ID de llamada en la forma exacta `domain.dataspace:meeting`. La demostración genera llamadas bajo `kaigi.universal` y utiliza un secreto de invitación criptográficamente aleatorio de 24 bytes codificado como 32 caracteres base64url sin relleno.

Una invitación canónica contiene exactamente un parámetro `call` y un parámetro `secret`:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

La solución de respaldo en la aplicación es la misma consulta exacta en `#/kaigi`. Rechazar parámetros duplicados, desconocidos, vacíos, rellenos o no canónicos. La demostración establece la caducidad de la reunión a 24 horas después de `scheduledStartMs`.

El secreto de invitación descifra los metadatos de la oferta del anfitrión. Es un secreto portador: no lo registres, no lo pongas en análisis ni lo almacenes en los metadatos del libro mayor de blockchain. El par de claves separado X25519 del anfitrión descifra las señales de respuesta del invitado y debe permanecer local a la sesión del anfitrión.

## Ciclo de vida de la reunión {#meeting-lifecycle}

### anfitriona {#host}

1. Verifique que la identidad de la billetera seleccionada coincida con la cadena UUID del endpoint API, exacta `NetworkId` y el prefijo.
2. Abre los medios locales y crea un `RTCPeerConnection`.
3. Crea una oferta SDP y espera a que termine la recopilación de ICE.
4. Genera el secreto de invitación y el par de claves de señal del host Kaigi.
5. Encripta la oferta con el secreto de la invitación.
6. Cotiza y firma una transacción que contenga `CreateKaigi` en modo transparente y autenticado.
7. Espera la evidencia del bloque finalizado antes de mostrar la invitación como activa.

Mantenga la sesión del anfitrión abierta. Sondee la ruta de señal con la firma de solicitud canónica de la cuenta del anfitrión, descifre la primera respuesta válida con la clave de señal del anfitrión y aplíquela con `setRemoteDescription`. Lleve `nextCursor` hacia adelante exactamente cuando haya más páginas disponibles.

### Invitado {#guest}

1. Analiza y valida la invitación exacta.
2. Obtén el registro de llamadas públicas y descifra su oferta con el secreto de invitación.
3. Rechazar una reunión finalizada, caducada, no activa o no transparente.
4. Abre medios locales, aplica la oferta, crea una respuesta SDP y termina la recopilación ICE.
5. Cifra la respuesta con la clave pública Kaigi del anfitrión.
6. Cotiza y firma una transacción que contenga `JoinKaigi` más los metadatos de la respuesta canónica.
7. Espera la evidencia del bloque finalizado antes de mostrar que el invitado se ha unido.

### Fin {#end}

Solo el anfitrión puede enviar `EndKaigi`. Cierre la conexión de igual a igual de la red y las pistas de medios, envíe la instrucción firmada y espere la finalización. Un transparente el participante puede usar `LeaveKaigi`; una salida `zk-roster-v1` es fuera de la cadena en el protocolo de primera versión y la instrucción nativa rechaza los artefactos de salida privada.

## Manual WebRTC de reserva {#manual-webrtc-fallback}

La demostración mantiene una ruta de señalización avanzada para el desarrollo local. Permite que el anfitrión y el invitado copien paquetes de oferta y respuesta en bruto WebRTC cuando la señalización automática respaldada por el libro mayor no está disponible.

Trata esto como un modo diferente. No crea, une ni finaliza un registro Kaigi, no proporciona finalización de transacciones y no debe presentarse como equivalente al flujo en cadena.

## Probar la integración {#test-the-integration}

Ejecuta las suites de demostración enfocadas actuales:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Las pruebas cubren el perfil transparente actual, el análisis estricto de invitaciones, la señalización cifrada, la persistencia de la sesión local y la recuperación manual. Una prueba de medios real todavía requiere dos billeteras financiadas y dos ventanas o dispositivos; Las pruebas simuladas WebRTC y del renderizador no demuestran la cámara, el micrófono, la travesía de NAT, la autenticación de solicitudes canónicas ni la finalización de transacciones en vivo.

Para la matriz completa de puntos finales API y el ciclo de vida de CLI, consulte [Torii API puntos finales: Kaigi sesiones](/es/reference/torii-endpoints.md#kaigi-sessions).
