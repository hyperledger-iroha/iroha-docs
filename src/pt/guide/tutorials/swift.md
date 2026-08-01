---
translation_locale: pt
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift e iOS {#swift-and-ios}

O Swift SDK enviado pelo espaço de trabalho upstream é o pacote `IrohaSwift` Swift sob `IrohaSwift/`. Seu manifesto de pacote define três produtos da biblioteca`IrohaSwift`, `IrohaSwiftMobileTransports` e `IrohaSwiftTransferUI`e visa iOS 15+ e macOS 12+ com as ferramentas Swift 5.9.

O pacote depende do alvo binário nativo `NoritoBridge`. A resolução do pacote valida `../dist/NoritoBridge.xcframework` antes da construção, e os caminhos de transação ou criptomoeda Connect lançam erros não disponíveis quando os símbolos nativos não são carregados.

## Swift Gestor de embalagens {#swift-package-manager}

Quando se desenvolve contra um espaço de trabalho chequeado, apontar SwiftPM no diretório local de pacotes `IrohaSwift/`. A identidade do pacote utilizada por `Package.swift` é `IrohaSwift`:

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

Ajuste o caminho para o seu aplicativo. Não copie o caminho atual `examples/ios/ConnectMinimalApp` como está; esse manifesto resolve `../../IrohaSwift` para `examples/IrohaSwift`.

Antes de resolver o pacote, verifique se a ponte existe na raiz do espaço de trabalho:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Isto produz `dist/NoritoBridge.xcframework`; o `IrohaSwift/Package.swift` refere-se a ele como `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

A base de código também contém `IrohaSwift/IrohaSwift.podspec`. Ela declara o pod `IrohaSwift`, Swift 5.9, e iOS 15. O podspec tira fontes Swift do repositório principal; a ponte nativa ainda tem que estar presente e ligada para codificação de transações, assinatura não-Ed25519 e criptografia Connect.

## Rapido arranque {#quickstart}

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

## Tente Taira Apenas leitura {#try-taira-read-only}

Comece com uma sonda HTTP simples para confirmar que o dispositivo ou simulador pode atingir o ponto final público Taira:

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

Use o mesmo cheque de `URLSession` para `https://taira.sora.org/v1/assets/definitions?limit=5` enquanto você está construindo UI e tente novamente o comportamento. Passe para `IrohaSDK` enviar auxiliares somente depois que o aplicativo carregue material de assinatura do armazenamento seguro e a conta é financiada em Taira.

Para criar e enviar uma transação, use os auxiliares `IrohaSDK`. Estes chamam o codificador de transação nativo apoiado por ponte:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, e `UnshieldRequest` validação da conta canônica IDs e definição de ativo base58 canónica sem prefixo IDs Antes de assinar.

## Empréstimo de crédito nativo {#native-escrow}

Swift constrói instruções de mercado e garantia anônima como cargas úteis de Norito JSON através de `NativeEscrowInstructionBuilders` ou auxiliares equivalentes `IrohaSDK.build*Escrow*`. Veja [ Native Asset Escrow](/pt/blockchain/escrow.md#swift-and-ios) para exemplos, campos de prova anônimos e o token de permissão para resolver disputas.

## Assinatura {#signing}

`Keypair` é a conveniência Ed25519 API. Para outros algoritmos, construa um `IrohaSDK` com `defaultSigningAlgorithm` e use `generateSigningKey()` ou `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

A Comissão `SigningAlgorithm` Enum inclui atualmente a Ed25519, secp256k1, BLS Normal e variantes pequenas, ML-DSA, GOST R 34.10-2012 conjuntos de parâmetros, e SM2. É necessário o apoio da ponte nativa fora do caminho de conveniência Ed25519.

## Conectar {#connect}

O cliente Connect é implementado na fonte Swift, com codecs criptográficos e de quadros suportados por `NoritoBridge`:

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

`ConnectSession` manuseia controles de abertura e fechamento, leitura criptografada do envelope, teclas de direcção, controle de fluxo, fluxos de eventos, fluxos equilíbrio e diários de diagnóstico.

## Cobertura atual {#current-coverage}

A fonte Swift inclui atualmente:

- `ToriiClient` HTTP auxiliares para contas, ativos, pseudónimos, páginas de exploradores, RWA, contratos, multisig, governança, subscrições, disponibilidade de dados, ativos confidenciais, estado do nó/tipo de execução, saúde, métricas e fluxos SSE.
- Construtores de transacções `IrohaSDK` e submetedores/assistentes de votação para transferência, moeda, queima, escudo, não escudo, transferência ZK, registo de ativos ZK, metadados, reivindicações de identificação, registo multisig e instruções de governança.
- Apoio à fila de transações pendente através de `PendingTransactionQueue` e `FilePendingTransactionQueue`
- Endereço de conta e auxiliares I105 através do `AccountAddress` e do `AccountId`
- Superfícies de assinatura Ed25519, secp256k1, ML-DSA, BLS, GOST e SM2, com suporte ponteiro nativo quando necessário.
- Construtores de cargas úteis de instruções nativas em custódia para mercado e custódia anônima
- Conectar WebSocket, quadro, cripto, sessão, fila, repetição e auxiliares de diagnóstico.
- Preparação Kagemusha, reabastecimento e resgate digitado, estado de operação, nota, pacote entre pares, recibo e modelos de fluxo QR
- SoraFS, auxiliares para a disponibilidade de dados e para a correcção da ligação

## API exemplos {#api-examples}

Usar `IrohaSwift/Sources/IrohaSwift` para a implementação pública e `IrohaSwift/Tests/IrohaSwiftTests` para os exemplos de utilização testados da mesma revisão da fonte.

## Referências de fontes {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
