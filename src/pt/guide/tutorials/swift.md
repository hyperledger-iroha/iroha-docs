---
translation_locale: pt
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift e iOS {#swift-and-ios}

O Swift SDK enviado pelo espaço de trabalho a montante é o pacote `IrohaSwift` Swift sob `IrohaSwift/`. Seu manifesto técnico de pacote define três produtos de biblioteca—`IrohaSwift`, `IrohaSwiftMobileTransports` e `IrohaSwiftTransferUI`—e tem como alvo iOS 15+ e macOS 12+ com ferramentas Swift 5.9.

O pacote depende do alvo binário nativo `NoritoBridge`. A resolução do pacote valida `../dist/NoritoBridge.xcframework` antes da construção, e os caminhos de transação ou criptografia do Connect lançam erros de ponte indisponível quando os símbolos nativos não estão carregados.

## Swift Gerenciador de Pacotes {#swift-package-manager}

Ao desenvolver em um workspace retirado, aponte SwiftPM para o diretório local do pacote `IrohaSwift/`. A identidade do pacote usada por `Package.swift` é `IrohaSwift`:

```swift
dependencies: [
    .package(name: "IrohaSwift", path: "/path/to/iroha/IrohaSwift")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            .product(name: "IrohaSwift", package: "IrohaSwift")
        ]
    )
]
```

Ajuste o caminho para o seu aplicativo. Não copie o caminho atual `examples/ios/ConnectMinimalApp` como está; esse manifesto técnico resolve `../../IrohaSwift` para `examples/IrohaSwift`.

Antes de resolver o pacote, certifique-se de que a ponte exista na raiz do espaço de trabalho:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Isto produz `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` o referencia como `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

O código-fonte também contém `IrohaSwift/IrohaSwift.podspec`. Ele declara o pod `IrohaSwift`, Swift 5.9 e iOS 15. O podspec busca os fontes de Swift do repositório principal; a ponte nativa ainda precisa estar presente e vinculada para codificação de transações, assinatura não-Ed25519 e criptografia Connect.

## Início Rápido {#quickstart}

```swift
import Foundation
import IrohaSwift

let torii = ToriiClient(baseURL: URL(string: "http://127.0.0.1:8080")!)
let sdk = IrohaSDK(toriiClient: torii)

let keypair = try Keypair.generate()
let accountId = try keypair.accountId()

if #available(iOS 15.0, macOS 12.0, *) {
    let balances = try await torii.getAssets(accountId: accountId)
    print("balances:", balances)
}
```

## Tentar Taira Somente Leitura {#try-taira-read-only}

Comece com uma sonda simples HTTP para confirmar que o dispositivo ou simulador pode alcançar o endpoint público Taira API:

```swift
import Foundation

if #available(iOS 15.0, macOS 12.0, *) {
    let url = URL(string: "https://taira.sora.org/status")!
    var request = URLRequest(url: url)
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    let (data, response) = try await URLSession.shared.data(for: request)

    if let http = response as? HTTPURLResponse {
        print("status:", http.statusCode)
    }
    print(String(decoding: data, as: UTF8.self))
}
```

Use a mesma verificação com `URLSession` para `https://taira.sora.org/v1/assets/definitions?limit=5` enquanto desenvolve a UI e as novas tentativas. Passe aos auxiliares de envio do `IrohaSDK` somente depois que a aplicação carregar com segurança os dados do signatário e a conta estiver financiada na Taira.

Para construir e enviar uma transação, use os helpers `IrohaSDK`. Eles chamam o codificador de transações nativo baseado em ponte:

```swift
let transfer = TransferRequest(
    chainId: "00000000-0000-0000-0000-000000000000",
    authority: accountId,
    assetDefinitionId: "66owaQmAQMuHxPzxUN3bqZ6FJfDa",
    quantity: "1",
    destination: accountId,
    description: "demo",
    feePayment: .authority(chargeLimits: [], gasLimit: nil)
)

if #available(iOS 15.0, macOS 12.0, *) {
    let status = try await sdk.submitAndWait(
        transfer: transfer,
        keypair: keypair
    )
    print(status.content.status.kind)
}
```

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` e `UnshieldRequest` validam IDs de conta canônicos e IDs de definição de ativo Base58 sem prefixo canônicos antes de assinar.

## Depósito em garantia nativo {#native-escrow}

Swift constrói instruções de marketplace e escrow anônimas como cargas úteis Norito JSON através de `NativeEscrowInstructionBuilders` ou os auxiliares equivalentes `IrohaSDK.build*Escrow*`. Veja [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#swift-and-ios) para exemplos, campos de prova anônimos e o token de permissão do resolvedor de disputas.

## Assinatura {#signing}

`Keypair` é a conveniência Ed25519 API. Para outros algoritmos, construa um `IrohaSDK` com `defaultSigningAlgorithm` e use `generateSigningKey()` ou `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

O enum `SigningAlgorithm` atualmente inclui Ed25519, secp256k1, variantes normais e pequenas BLS, ML-DSA, conjuntos de parâmetros R 34.10-2012 GOST e SM2. Suporte nativo a bridge é necessário fora do caminho de conveniência Ed25519.

## Conectar {#connect}

O cliente Connect é implementado no código-fonte Swift, com criptografia e codecs de quadro suportados por `NoritoBridge`:

```swift
let sessionID = Data(repeating: 0, count: 32) // replace with the session bytes
let sid = "<session-id-from-/v1/connect/session>"
let request = try ConnectClient.makeWebSocketRequest(
    baseURL: URL(string: "https://node.example")!,
    sid: sid,
    role: .app,
    token: "<token>"
)

let client = ConnectClient(request: request)
await client.start()

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` gerencia os controles de abertura e fechamento, a leitura de envelopes criptografados, as chaves de direção, o controle de fluxo, os fluxos de eventos e saldos e os diários de diagnóstico.

## Cobertura Atual {#current-coverage}

A fonte Swift atualmente inclui:

- auxiliares HTTP de `ToriiClient` para contas, ativos, aliases, páginas do explorador, RWA, contratos, multisig, governança, assinaturas, disponibilidade de dados, ativos confidenciais, estado do nó e do ambiente de execução, integridade, métricas e fluxos SSE
- `IrohaSDK` construtores de transações e auxiliares de envio/consulta para transferência, emissão, queima, blindagem, desblindagem, ZK transferência, ZK registro de ativos, metadados, reivindicações de identificador, registro de multisig e instruções de governança
- suporte a fila de transações pendentes através de `PendingTransactionQueue` e `FilePendingTransactionQueue`
- endereço da conta e auxiliares I105 através de `AccountAddress` e `AccountId`
- Superfícies de assinatura Ed25519, secp256k1, ML-DSA, BLS, GOST e SM2, com suporte nativo de ponte onde necessário
- construtores de payload de instrução de escrow nativos para mercado e escrow anônimo
- Conecte WebSocket, estrutura, cripto, sessão, fila, reprodução e auxiliares de diagnóstico
- Prontidão Kagemusha, recarga e resgate digitados, status da operação, observação, pacote de pares de rede, registro de resultado do protocolo e modelos de fluxo QR
- SoraFS, disponibilidade de dados e auxiliares de anexos de prova

## API Exemplos {#api-examples}

Use `IrohaSwift/Sources/IrohaSwift` para a implementação pública e `IrohaSwift/Tests/IrohaSwiftTests` para exemplos de uso testados da mesma revisão da fonte.

## Referências de Fonte {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
