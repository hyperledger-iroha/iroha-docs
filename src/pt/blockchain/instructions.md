---
translation_locale: pt
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Instruções especiais Iroha {#iroha-special-instructions}

Quando falamos sobre [Como Iroha operação](/pt/blockchain/iroha-explained), Nós dissemos que Iroha As instruções especiais são a única maneira de modificar o estado mundial. Que tipo de instruções especiais temos? Se tiverem lido os guias específicos da língua neste tutorial, Você já viu algumas instruções: `Register<Account>` e `Mint<Numeric>`.

Esta é a lista completa das instruções especiais Iroha:

|Instrução |Descrições |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registo/Desregistro](#un-register) |Dê um ID para uma nova entidade no blockchain. |
| [Mint/Burn](#mint-burn) |Ativos numéricos de moeda/queima ou repetições de desencadeamento. |
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |Atualize os metadados de objetos da blockchain. |
| [SetParameter](#setparameter)|Defina um parâmetro de largura da cadeia. |
| [Subsídio/Revocação ](#grant-revoke) |Dar ou remover permissões e papéis. |
| [Transferência](#transfer) |Transferência de propriedade ou valor do ativo. |
| [Localizações de garantia e activos nativos ](#native-escrow-and-asset-locks) |Bloquear ativos numéricos na custódia do protocolo. |
| [ExecuteTrigger](#executetrigger)|Execução de gatilhos. |
| [Log/Custom/Upgrade](#other-instructions) |Registrar, estender ou atualizar o comportamento do tempo de execução. |

Vamos começar com um resumo de Iroha Instruções Especiais; quais objetos cada instrução pode ser chamada para e que instruções estão disponíveis para cada objeto.

## Resumo {#summary}

Para cada instrução, há uma lista de objetos sobre os quais esta instrução pode ser executada. Por exemplo, as variantes de transferência cobrem objetos do livro-razão e ativos numéricos possíveis, enquanto o minting cobre ativos numéreos e desencadeia repetições.

Algumas instruções exigem que se especifique um destino. Por exemplo, se transferir activos, é sempre necessário especificar em que conta os está a transferir. Por outro lado, quando você está registrando algo, tudo o que você precisa é do objeto que deseja registrar.

|Instrução |Objetos|Destino |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)|domínio ordinário, alias de espaço de dados e alias de conta |                      |
| [Registo/Desregistro](#un-register) |contas, definições de activos, NFTs, funções, desencadeadores, pares; remoção do domínio |                      |
| [Mint/Burn](#mint-burn) |Ativos numéricos, repetições de desencadeamento |Contas ou desencadeadores |
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |Objetos que possuem [metadados](./metadata.md): domínios, contas, definições de ativos, NFTs, RWAs, gatilhos |                      |
| [SetParameter](#setparameter)|Parâmetros da cadeia |                      |
| [Subsídio/Revocação ](#grant-revoke) | [funções, tokens de permissão](/pt/blockchain/permissions.md) |Contas ou funções |
| [Transferência](#transfer) |Domínios, definições de activos, ativos numéricos, NFTs |contas |
| [Localizações de garantia e activos nativos ](#native-escrow-and-asset-locks) |Ativos numéricos em garantia, bloqueio de activos, compromissos anônimos em garantia |compradores, destinos ou divisões de litígios |
| [ExecuteTrigger](#executetrigger)|gatilhos .|                      |
| [Log/Custom/Upgrade](#other-instructions) |registos, cargas úteis específicas para executores, atualizações do executor |                      |

Há também uma outra maneira de ver ISI, em termos do objeto do livro-razão que eles tocam:

|Alvo .|Instruções |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Conta |registar/desinscrever contas, receber ativos, atualizar metadados da conta, conceder ou revogar as permissões e funções |
|Domínio .|garantir a configuração de domínios, desinscrever domínios, transferir a propriedade do domínio, atualizar os metadados do domínio |
|Definição de activos |definições de registo/desregistro, transferência de propriedade, atualização dos metadados |
|Ativos |quantidade numérica da menta/queimadura, quantidade numerica de transferência |
|Escrow |Abrir, aceitar, marcar o pagamento enviado, liberar, cancelar, disputar, resolver, retirar ou expirar registos nativos de custódia.|
|NFT |Registo/desregistro NFTs, transferência de propriedade, atualização de metadados |
|RWA |registar lotes, quantidade de transferência, manter/libertar, congelar/descongelar, resgatar, fundir, atualizar metadados e controlos |
|Trigger .|registar/desinscrever, repetições do gatilho de moeda/queimação, executar o gatilho, atualizar os metadados do gatilha |
|Mundo |registar/desregistrar pares e papéis, definir parâmetros, atualizar o executor |

## CLI exemplos {#cli-examples}

Os exemplos desta página supõem que você está executando comandos do espaço de trabalho Iroha upstream contra a configuração local padrão do cliente:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Se você instalou o binário `iroha`, use `iroha --config ./defaults/client.toml` em vez disso. Substitua os titulares de lugar abaixo com valores da sua rede:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Ao atingir o público Taira Testnet, usar um Taira Configuração do cliente. Antes de executar exemplos de pagamento, salvar o auxiliar da torneira de [Obtenha o Testnet XOR sobre Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, em seguida, a rede de teste da reivindicação XOR a partir da torneira:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Após a visualização do ativo financiado pela torneira, anexar os metadados necessários dos activos de gás para escrever as transações:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` é o caminho comum de primeira versão para a criação de domínios e seus SNS arrendamentos. Ele vincula declarativamente o espaço de dados exato, proprietário, prazo de arrendamento e guarda de citação, então cria ou repara todos os estados necessários atomicamente. Utilize o ponto final autenticado `POST /v1/aliases/setup/plan` ou o fluxo de trabalho correspondente CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

A intenção e o plano são livres de segredos, mas aplicam sinais de passo e enviam uma transação comum com a conta configurada. Um plano está vinculado à sua cadeia, autoridade, âncora do estado vivo e prazo; nunca reutilize um em outra rede.

## (Un) Registo {#un-register}

Registro e não registo são as instruções utilizadas para dar uma ID a uma nova entidade no blockchain.

Tudo o que pode ser registrado é tanto `Registrable` como `Identifiable`, mas nem tudo o que é `Identifiable` é `Registrable`. A maioria das coisas são registradas diretamente, mas em alguns casos a representação na blockchain tem consideravelmente mais dados. Por razões de segurança e desempenho, usamos construtores para tais estruturas de dados (por exemplo `NewAccount`), e o registro de pares tem uma instrução dedicada de prova de posse.

Você pode registrar contas, definições de ativos, NFTs, pares, funções e gatilhos. Configuração de domínio utiliza `EnsureAlias`; o crudo `Register::Domain` a carga útil é reservada para genesis/bootstrap. `RegisterPeerWithPop`, que carrega uma prova de posse para a chave. [Convenções de nomeamento](/pt/reference/naming.md) Para saber sobre as restrições impostas aos nomes das entidades.

Os lotes RWA são criados através da instrução específica `RegisterRwa`. O código atual não expõe uma instrução `UnregisterRwa`; use `RedeemRwa` para retirar a quantidade representada.

::: Informações

Observe que, dependendo da forma como você decidir configurar o seu [Bloco de Gênesis](/pt/guide/configure/genesis.md) em `genesis.json` (especificamente, se incluir ou não o registo de tokens de permissão), O processo de registo de uma conta pode ser muito diferente. Em geral, podemos resumir isto assim:

- Em um blockchain público, qualquer pessoa deve ser capaz de registrar uma conta.
- Em um blockchain privado, pode haver um processo único para o registro de contas. em um blockchain privado típico, ou seja, um blockchain sem quaisquer processos únicos para o registo de contas, você precisa de uma conta para registrar outra conta.

Discutiremos estas diferenças em grande detalhe quando [Comparar cadeias de blocos públicas e privadas](/pt/guide/configure/modes.md).

:::

::: Informações

O registo de um peer é atualmente a única maneira de adicionar pares que não faziam parte do original peer confiável definido para a rede.

:::

Referir-se a um dos guias específicos da língua para acompanhá-lo no processo de registro de objetos em uma blockchain:

|Linguagem |Guia |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Use o [Iroha CLI](/pt/get-started/operate-iroha-via-cli.md) para criar domínios e registrar contas e ativos. |
|Rust |Use o tutorial [Rust ](/pt/guide/tutorials/rust.md). |
|Kotlin/Java |Use o [Kotlin/Java tutorial](/pt/guide/tutorials/kotlin-java.md). |
|Python |Use o tutorial [Python ](/pt/guide/tutorials/python.md). |
|JavaScript/TypeScript |Use o tutorial [JavaScript/TypeScript ](/pt/guide/tutorials/javascript.md). |

Planejar e aplicar configuração de domínio comum, em seguida, desinscrever o domínio quando não for mais necessário:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Contas registadas e não registradas:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Definições de activos para registo e não registo:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Registro e desregisto NFTs. O registo NFT lê o seu conteúdo JSON a partir da entrada padrão:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Funções de registo e não de registo:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Registre e desregistre os gatilhos. O registro do gatilho precisa de um código IVM compilado ou uma lista de instruções serializada. Este exemplo constrói uma instrução `Log` com o CLI e a envia para o registo do gatilhos:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Registre e desregistre os pares. Gerencie a chave BLS e PoP com `kagami`, se ainda não tiverem:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Menta/Burn {#mint-burn}

A moagem e a queima podem referir-se a activos numéricos e desencadeios com um número limitado de repetições. Alguns activos podem ser declarados como não moáveis, o que significa que só podem ser moídos uma vez após o registro.

Os ativos são montados em uma conta específica, geralmente aquela que registrou o ativo em primeiro lugar. As quantidades de ativos não são negativas, então você nunca pode ter um `$-1.0` de um ativo ou queimar uma quantidade negativa e obter uma moeda.

Referir-se a um dos guias específicos da linguagem para acompanhá-lo através do processo de mineração de ativos em uma blockchain:

- [CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Rust](/pt/guide/tutorials/rust.md)
- [Kotlin/Java](/pt/guide/tutorials/kotlin-java.md)
- [Python](/pt/guide/tutorials/python.md)
- [JavaScript/TypeScript](/pt/guide/tutorials/javascript.md)

Aqui estão exemplos de ativos queimados:

- [CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Rust](/pt/guide/tutorials/rust.md)

Ativos numéricos de moeda e de queima:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Repetições do gatilho de hortelã e da queima:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transferência {#transfer}

Transferências transferem a propriedade ou o valor entre contas. As variantes genéricas de transferência abrangem domínios, definições de ativos, ativos numéricos e NFTs. RWA O movimento de quantidade utiliza o `TransferRwa` e `ForceTransferRwa` instruções descritas em [O mundo real Ativos ](/pt/blockchain/rwas.md).

Para este efeito, é necessário conceder uma conta à [Permissão para a transferência de activos](/pt/reference/permissions.md). Referir-se a um exemplo de como transferir activos com: [CLI](/pt/get-started/operate-iroha-via-cli.md) ou [Rust](/pt/guide/tutorials/rust.md).

Transferência de activos numéricos:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transferência de domínio, definição de ativo e propriedade NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Localizações de empréstimos e ativos nativos {#native-escrow-and-asset-locks}

As instruções de custódia nativa bloqueiam os ativos numéricos na custódia do protocolo gerenciado por um livro-razão. Eles são usados para liquidação ao estilo de mercado, bloqueios genéricos de ativos e fluxos anônimos de custódie protegidos.

Utilizações de empréstimos no mercado `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, e `ResolveEscrowDispute`. Utilização de bloqueios genéricos de activos `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, e `ExpireAssetLock`. O escrow anônimo reflete o ciclo de vida do mercado com `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, e `ResolveAnonymousEscrowDispute`.

Estes ISIs atualmente não possuem comandos de primeira classe CLI. Use construtores de instruções SDK tipografados ou cargas de instrução serializadas, e veja [Native Asset Escrow](/pt/blockchain/escrow.md) para detalhes do ciclo de vida, permissões, consultas, eventos e exemplos de Rust.

## Subvenção/Revocação {#grant-revoke}

As instruções de concessão e revogação são utilizadas para as autorizações e funções da conta [ ](permissions.md).

`Grant` é utilizado para conceder permanentemente a um utilizador uma única permissão ou um grupo de permissões (uma "função"). As funções e as permissões concedidas só podem ser removidas através da `Revoke` Como tal, essas instruções devem ser utilizadas com cuidado.

Conceder e revogar um papel em uma conta:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Conceder e revogar os tokens de permissão. Os comandos de permissões lêem um objeto de permisso da entrada padrão:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Conceder e revogar as permissões de um papel:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Estas instruções atualizam os metadados objeto [](/pt/blockchain/metadata.md). Use `SetKeyValue` para inserir ou substituir uma entrada de metadados e `RemoveKeyValue` para excluir um.

Os comandos de metadados `set` lêem o valor JSON a partir da entrada padrão:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

O mesmo padrão está disponível para contas, definições de ativos, NFTs, RWAs, e desencadeadores:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` altera os parâmetros em toda a cadeia expostos pelo modelo de dados ativo e pelo executor.

Estabelecer um parâmetro através da passagem de um único objeto JSON em entrada padrão:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Esta instrução é utilizada para executar os gatilhos [ ](./triggers.md).

O CLI pode registrar gatilhos e subscrever os eventos de execução do gatilho diretamente. Não fornece um comando `execute trigger` digitado, por isso enviar uma instrução manual `ExecuteTrigger` gerar uma série `InstructionBox` com uma ferramenta SDK ou executor e passar a matriz resultante JSON através de `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Outras instruções {#other-instructions}

Iroha expõe também instruções de nível inferior para a integração do tempo de execução e do executor:

- `Log`: emitir uma entrada no registro durante a execução
- `CustomInstruction`: transporte de cargas úteis específicas do executor JSON
- `Upgrade`: ativar uma atualização do executor

Enviar uma instrução `Log` com o assistente de ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Envie uma instrução de executor personalizada como um `InstructionBox` serializado. A forma da carga útil é específica para o executor, então gerar a instrução com a combinação SDK ou ferramenta executor:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Atualizar o executor a partir de um arquivo compilado IVM código de byte:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
