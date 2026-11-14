---
translation_locale: pt
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Ajuste o caminho para o seu aplicativo. `examples/ios/ConnectMinimalApp/Package.swift` mostra a mesma dependência com o caminho relativo `../../../IrohaSwift`.

Antes de resolver o pacote, compile a ponte nativa atual. Para desenvolvimento local e testes, execute isto a partir da raiz do espaço de trabalho:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

As compilações de lançamento produzem `dist/NoritoBridge.xcframework` com `make bridge-xcframework`, que requer `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` e `MOBILE_SDK_CARGO_LOCKFILE`. `IrohaSwift/Package.swift` referencia a ponte como `../dist/NoritoBridge.xcframework`.

## Início Rápido {#quickstart}

```swift
import Foundation
import IrohaSwift

let torii = ToriiClient(baseURL: URL(string: "http://127.0.0.1:8080")!)
let sdk = IrohaSDK(baseURL: torii.baseURL)

let keypair = try Keypair.generate()
let accountId = try keypair.accountId()

if #available(iOS 15.0, macOS 12.0, *) {
    let balances = try await torii.accountAssets(of: accountId).page()
    print("balances:", balances)
}
```

## Tentar Taira Somente Leitura {#try-taira-read-only}

Comece com uma sondagem HTTP simples para confirmar que o dispositivo ou simulador consegue alcançar o endpoint público do Taira:

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
    networkId: try NetworkId(literal: "<exact-network-id>"),
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
    print(status.status.kind)
}
```

`TransferRequest`, `MintRequest` e `BurnRequest` validam IDs de conta canônicos e IDs de definição de ativo Base58 sem prefixo canônicos antes de assinar.

## Depósito em garantia nativo {#native-escrow}

Swift constrói instruções de escrow de marketplace como cargas úteis Norito JSON através de `NativeEscrowInstructionBuilders` ou dos auxiliares equivalentes `IrohaSDK.build*Escrow*`. Veja [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#swift-and-ios) para exemplos e o token de permissão do resolvedor de disputas.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` gerencia os controles de abertura e fechamento, a leitura de envelopes criptografados, as chaves de direção, o controle de fluxo, os fluxos de eventos e saldos e os diários de diagnóstico.

## Cobertura Atual {#current-coverage}

A fonte Swift atualmente inclui:

- auxiliares HTTP de `ToriiClient` para contas, ativos, aliases, páginas do explorador, RWA, contratos, multisig, governança, assinaturas, disponibilidade de dados, ativos confidenciais, estado do nó e do ambiente de execução, integridade, métricas e fluxos SSE
- Construtores de transações `IrohaSDK` e auxiliares de envio/consulta para transferência, emissão, queima, registro de ativos ZK, metadados, reivindicações de identificador, registro de multisig, implantação de contratos e cédulas de governança
- suporte a fila de transações pendentes através de `PendingTransactionQueue` e `FilePendingTransactionQueue`
- endereço da conta e auxiliares I105 através de `AccountAddress` e `AccountId`
- Superfícies de assinatura Ed25519, secp256k1, ML-DSA, BLS, GOST e SM2, com suporte nativo de ponte onde necessário
- construtores de payload de instrução de escrow nativos para mercado e escrow anônimo
- Conecte WebSocket, estrutura, cripto, sessão, fila, reprodução e auxiliares de diagnóstico
- auxiliares do formato de transmissão KAGEMUSHA V1 e o adaptador da plataforma iPhone para o provedor nativo de Advance da carteira, cadastro, recuperação e chamadas admitidas de troca
- SoraFS, disponibilidade de dados e auxiliares de anexos de prova

## API Exemplos {#api-examples}

Use `IrohaSwift/Sources/IrohaSwift` para a implementação pública e `IrohaSwift/Tests/IrohaSwiftTests` para exemplos de uso testados da mesma revisão da fonte.

## Referências de Fonte {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
