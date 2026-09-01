---
translation_locale: pt
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Operações de instrução {#iroha-special-instructions}

Quando falamos sobre [como Iroha opera](/pt/blockchain/iroha-explained), dissemos que as operações de Instrução Iroha são a única maneira de modificar o estado do mundo. Então, que tipo de instrução quais operações temos? Se você leu os guias específicos de linguagem neste tutorial, já viu algumas instruções: `Register<Account>` e `Mint<Numeric>`.

Aqui está a lista completa de operações de instrução Iroha:

|Instrução|Descrições|
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registrar/Cancelar registro](#un-register)                       |Atribua um ID a uma nova entidade na blockchain.|
| [Mint/Burn](#mint-burn)                                   |Criar/queimar ativos numéricos ou acionar repetições.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Atualizar metadados do objeto blockchain.|
| [SetParameter](#setparameter)                             |Defina um parâmetro em toda a cadeia.|
| [Grant/Revoke](#grant-revoke)                             |Conceda ou remova permissões e funções.|
| [Transferir](#transfer)                                     |Transferir propriedade ou valor do ativo.|
| [Escrow nativo e bloqueios de ativos](#native-escrow-and-asset-locks) |Bloqueie ativos numéricos na custódia do protocolo.|
| [Liquidação privada atômica](#atomic-private-settlement)   |Governar conjuntos confidenciais e pacotes atômicos.|
| [ExecuteTrigger](#executetrigger)                         |Executar gatilhos.|
| [Log/Custom/Upgrade](#other-instructions)                 |Registrar, estender ou atualizar o comportamento de execução do software.|

Vamos começar com um resumo das operações da Instrução Iroha; para quais objetos cada instrução pode ser chamada e quais instruções estão disponíveis para cada objeto.

## Resumo {#summary}

Para cada instrução, há uma lista de objetos nos quais essa instrução pode ser executada. Por exemplo, variantes de transferência abrangem objetos de registro blockchain que podem ser possuídos e ativos numéricos, enquanto emissão abrange ativos numéricos e repetições de gatilho.

Algumas instruções exigem que um destino seja especificado. Por exemplo, se você transferir ativos, sempre precisará especificar para qual conta está transferindo-os. Por outro lado, quando você está registrando algo, tudo o que você precisa é do objeto que deseja registrar.

|Instrução|Objetos|Destino          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |configuração de domínio comum, alias de espaço de dados e alias de conta|                      |
| [Registrar/Cancelar registro](#un-register)                       |contas, definições de ativos, NFTs, funções, gatilhos, pares de rede; remoção de domínio|                      |
| [Mint/Burn](#mint-burn)                                   |ativos numéricos, acionar repetições|contas ou gatilhos|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |objetos que têm [metadados](./metadata.md): domínios, contas, definições de ativos, NFTs, RWAs, gatilhos|                      |
| [SetParameter](#setparameter)                             |parâmetros da cadeia|                      |
| [Grant/Revoke](#grant-revoke)                             | [funções, tokens de permissão](/pt/blockchain/permissions.md)                                                  |contas ou funções|
| [Transferir](#transfer)                                     |domínios, definições de ativos, ativos numéricos, NFTs|contas|
| [Escrow nativo e bloqueios de ativos](#native-escrow-and-asset-locks) |depósitos vinculados de ativos numéricos, bloqueios de ativos, compromissos de depósito anonimamente|compradores, destinos ou divisões de disputas|
| [Liquidação privada atômica](#atomic-private-settlement)   |pools confidenciais de escopo de rota, rotações de políticas, pacotes finalizados e marcadores de aborto|                      |
| [ExecuteTrigger](#executetrigger)                         |gatilhos|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |logs, payloads específicos do executor, atualizações do executor|                      |

Existe também outra forma de olhar para ISI, em termos do objeto do livro-razão da blockchain que eles tocam:

|Alvo|Instruções|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Conta|registrar/cancelar registro de contas, receber ativos, atualizar metadados da conta, conceder/revogar permissões e funções|
|Domínio|configurar e dar baixa em domínios, transferir sua propriedade e atualizar seus metadados|
|Definição de ativo|registrar/cancelar registro de definições, transferir propriedade, atualizar metadados|
|Ativo|cunhar/queimar quantidade numérica, transferir quantidade numérica|
|Depósito em garantia|abrir, aceitar, marcar pagamento enviado, liberar, cancelar, disputar, resolver, sacar ou expirar registros de custódia nativos|
| NFT              |registrar/cancelar registro NFTs, transferir propriedade, atualizar metadata|
| RWA              |registrar lotes, transferir quantidade, reter/liberar, congelar/descongelar, resgatar, mesclar, atualizar metadados e controles|
|Gatilho|registrar/cancelar registro, repetição de gatilho de mint/queima, executar gatilho, atualizar metadados do gatilho|
|Mundo|registrar/cancelar o registro de pares e funções de rede, definir parâmetros, atualizar o executor|

## CLI Exemplos {#cli-examples}

Os exemplos nesta página assumem que você está executando comandos do workspace upstream Iroha contra a configuração padrão do cliente local:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Se você instalou o binário `iroha`, use `iroha --config ./defaults/client.toml` em vez disso. Substitua os espaços reservados abaixo pelos valores da sua rede:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Ao usar a rede de testes pública Taira, adote uma configuração de cliente Taira. Antes de executar exemplos sujeitos a taxas, salve o auxiliar de [Obter XOR de teste na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py` e solicite XOR de teste ao dispensador:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Quando o ativo financiado pelo dispensador aparecer, anexe às transações de escrita os metadados exigidos do ativo de gas:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` é o caminho habitual de primeira liberação para criar domínios e seus contratos de SNS. Ele vincula de forma declarativa o espaço de dados exato, o proprietário, o prazo do contrato, e cota de proteção, então cria ou repara todo o estado necessário de forma atômica. Use o endpoint autenticado `POST /v1/aliases/setup/plan` API ou o fluxo de trabalho correspondente CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

A intenção e o plano são livres de segredos, mas a etapa de aplicação assina e envia uma transação comum com a conta configurada. Um plano está vinculado à sua cadeia, ao principal de autorização, ao âncora de estado ao vivo e ao prazo; nunca reutilize um em outra rede.

## (Des)Registrar {#un-register}

Registrar e cancelar o registro são as instruções usadas para dar um ID a uma nova entidade na blockchain.

Tudo o que pode ser registrado é tanto `Registrable` quanto `Identifiable`, mas nem tudo que é `Identifiable` é `Registrable`. A maioria das coisas é registrada diretamente, mas em alguns casos a representação na blockchain possui consideravelmente mais dados. Por motivos de segurança e desempenho, usamos construtores para tais estruturas de dados (por exemplo, `NewAccount`), e o registro de pares na rede possui uma instrução dedicada de prova de posse. Como regra, tudo o que pode ser registrado também pode ser cancelado, mas isso não é uma regra absoluta.

Você pode registrar contas, definições de ativos, NFTs, nós da rede, funções e gatilhos. A configuração de domínio usa `EnsureAlias`; o payload bruto `Register::Domain` é reservado para genesis/bootstrap. O registro de pares da rede usa `RegisterPeerWithPop`, que contém uma prova de posse da chave do par da rede. Confira nosso [convenções de nomenclatura](/pt/reference/naming.md) para saber sobre as restrições aplicadas aos nomes de entidades.

RWA lotes são criados por meio da instrução dedicada `RegisterRwa`. O código atual não expõe uma instrução `UnregisterRwa`; use `RedeemRwa` para descomissionar a quantidade representada.

::: info

Observe que, dependendo de como você decidir configurar seu [bloco gênese da blockchain](/pt/guide/configure/genesis.md) em `genesis.json` (especificamente, se você incluir ou não o registro de tokens de permissão), o processo para registrar uma conta pode ser muito diferente. Em geral, podemos resumir assim:

- Em uma blockchain pública, qualquer pessoa deve ser capaz de registrar uma conta.
- Em uma blockchain privada, pode haver um processo único para registrar contas. Em uma blockchain privada típica, ou seja, uma blockchain sem quaisquer processos únicos para registrar contas, você precisa de uma conta para registrar outra conta.

Discutimos essas diferenças em grande detalhe quando nós [comparar blockchains privadas e públicas](/pt/guide/configure/modes.md).

:::

::: info

Registrar um par de rede é atualmente a única maneira de adicionar pares de rede que não faziam parte do conjunto original de pares de rede confiáveis à rede.

:::

Use um guia específico de linguagem para registrar objetos de blockchain:

|Idioma|Guia|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Use o [Iroha CLI](/pt/get-started/operate-iroha-via-cli.md) para configurar domínios e registrar contas e ativos.|
| Rust                  |Use o [tutorial de Rust](/pt/guide/tutorials/rust.md).|
| Kotlin/Java           |Use o [Kotlin/Java](/pt/guide/tutorials/kotlin-java.md).|
| Python                |Use o [tutorial de Python](/pt/guide/tutorials/python.md).|
| JavaScript/TypeScript |Use o [JavaScript/TypeScript](/pt/guide/tutorials/javascript.md).|

Planeje e aplique a configuração comum do domínio, depois cancele o registro do domínio quando ele não for mais necessário:

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

Registrar e cancelar o registro de contas:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Registrar e cancelar o registro de definições de ativos:

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

Registrar e cancelar o registro de NFTs. O registro de NFT lê seu conteúdo JSON da entrada padrão:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Registrar e cancelar o registro de funções:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Registrar e cancelar o registro de gatilhos. O registro de gatilhos precisa de bytecode compilado IVM ou de uma lista de instruções serializada. Este exemplo cria uma instrução `Log` com o CLI e a envia para o registro do gatilho:

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

Registrar e cancelar o registro de pares de rede. Gere a chave BLS e PoP com `kagami` se você ainda não as tiver:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Gerar/Queimar {#mint-burn}

Emitir e queimar podem se referir a ativos numéricos e gatilhos com um número limitado de repetições. Alguns ativos podem ser declarados como não cunháveis, o que significa que só podem ser emitidos uma vez após o registro.

Os ativos são emitidos para uma conta específica, geralmente aquela que registrou o ativo em primeiro lugar. As quantidades de ativos são não negativas, portanto, você nunca pode ter `$-1.0` de um ativo ou queimar uma quantidade negativa e receber uma emissão.

Use um guia específico de linguagem para emitir ativos de blockchain:

- [CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Rust](/pt/guide/tutorials/rust.md)
- [Kotlin/Java](/pt/guide/tutorials/kotlin-java.md)
- [Python](/pt/guide/tutorials/python.md)
- [JavaScript/TypeScript](/pt/guide/tutorials/javascript.md)

Aqui estão exemplos de ativos em queima:

- [CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Rust](/pt/guide/tutorials/rust.md)

emitir e queimar ativos numéricos:

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

emitir e queimar repetições de gatilho:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transferir {#transfer}

Transferências movem a propriedade ou valor entre contas. Variantes genéricas de transferência abrangem domínios, definições de ativos, ativos numéricos e NFTs. O movimento de quantidade RWA usa as instruções dedicadas `TransferRwa` e `ForceTransferRwa` descritas em [Ativos do Mundo Real](/pt/blockchain/rwas.md).

Para fazer isso, uma conta precisa receber o [permissão para transferir ativos](/pt/reference/permissions.md). Consulte um exemplo de como transferir ativos com [CLI](/pt/get-started/operate-iroha-via-cli.md) ou [Rust](/pt/guide/tutorials/rust.md).

Transferir ativos numéricos:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transferir domínio, definição de ativo e propriedade NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Escrow Nativo e Bloqueios de Ativos {#native-escrow-and-asset-locks}

Instruções de custódia nativas bloqueiam ativos numéricos na custódia do protocolo gerenciado pelo livro contábil. Elas são usadas para liquidação no estilo de mercado, bloqueios genéricos de ativos e fluxos de custódia anônimos protegidos.

O depósito em garantia do marketplace usa `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` e `ResolveEscrowDispute`. Bloqueios de ativos genéricos usam `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` e `ExpireAssetLock`. O escrow anônimo espelha o ciclo de vida do mercado com `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` e `ResolveAnonymousEscrowDispute`.

Estes ISIs atualmente não possuem comandos de CLI de primeira classe. Use construtores de SDK tipados ou cargas de instrução serializadas, e veja [Escrow de Ativo Nativo](/pt/blockchain/escrow.md) para detalhes do ciclo de vida, permissões, consultas, eventos e exemplos de Rust.

## Liquidação Privada Atômica {#atomic-private-settlement}

A família de instruções de liquidação privada atômica governada é separada do Native transparente AMX. `ActivatePrivateSettlementPoolV1` estabelece um pool confidencial com escopo de rota a partir de uma projeção de governança redigida e compromissos de origem canônica. `FinalizeAtomicPrivateSettlementV1` aplica um pacote completo certificado pelo comitê de forma atômica, enquanto `AbortAtomicPrivateSettlementV1` publica apenas o marcador de terminal público autorizado pelo patrocinador.

`RotatePrivateSettlementPoolPolicyV1` é restrito à governança de privacidade. Ele requer o valor exato do resumo criptográfico da governança atual, preserva a rota, o conjunto, o compromisso de vinculação de ativos, a fronteira de estado, os conjuntos de repetição e os registros de resultados do protocolo finalizados, avança a revisão pública em um, e usa uma época de chave de auditor mais recente. A rotação é ativada na sua altura de inclusão e não pode compartilhar essa altura com um registro de resultado de protocolo para a mesma rota/conjunto. A linhagem de revisão pública mantém os registros de resultados do protocolo finalizados antes da reinicialização da rotação válidos e a reprodução exata idempotente; pacotes antigos de políticas em trânsito falham fechados. Os operadores devem reter as chaves de descriptografia antigas para cápsulas armazenadas ou gerenciar e testar a reembalagem de cápsulas antes de destruí-las.

O caminho permanece desativado por padrão e não é qualificado para produção. Veja [Executar Liquidação Atômica Privada entre Espaços de Dados](/pt/get-started/atomic-private-settlement) para requisitos de configuração, principal de autorização, auditoria, recuperação e liberação.

## Conceder/Revogar {#grant-revoke}

Instruções de concessão e revogação são usadas para a conta [permissões e funções](permissions.md).

`Grant` é usado para conceder permanentemente a um usuário uma única permissão ou um grupo de permissões (uma "função"). Funções e permissões concedidas só podem ser removidas através da instrução `Revoke`. Portanto, essas instruções devem ser usadas com cuidado.

Conceder e revogar um papel em uma conta:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Conceda e revogue tokens de permissão. Os comandos de permissão leem um objeto de permissão da entrada padrão:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Conceder e revogar permissões em um cargo:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Estas instruções atualizam o objeto [metadados](/pt/blockchain/metadata.md). Use `SetKeyValue` para inserir ou substituir uma entrada de metadados e `RemoveKeyValue` para excluir uma.

Metadados `set` comandos leem o valor JSON da entrada padrão:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

O mesmo padrão está disponível para contas, definições de ativos, NFTs, RWAs e gatilhos:

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

`SetParameter` altera parâmetros em toda a cadeia expostos pelo modelo de dados ativo e executor.

Defina um parâmetro passando um único objeto de parâmetro JSON na entrada padrão:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Esta instrução é usada para executar [gatilhos](./triggers.md).

O CLI pode registrar gatilhos e se inscrever em eventos de execução de gatilho diretamente. Ele não fornece um comando `execute trigger` tipado, então para enviar um manual `ExecuteTrigger` instrução, gere um `InstructionBox` serializado com uma SDK ou ferramenta executora e passe o array resultante JSON através de `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Outras instruções {#other-instructions}

Iroha também expõe instruções de nível inferior para integração de tempo de execução de software e executor:

- `Log`: emitir uma entrada de log durante a execução
- `CustomInstruction`: transportar cargas úteis JSON específicas do executor
- `Upgrade`: ativar uma atualização de executor

Envie uma instrução `Log` com o assistente de ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Envie uma instrução de executor personalizada como um `InstructionBox` serializado. O formato da carga útil é específico do executor, então gere a instrução com o SDK correspondente ou ferramentas do executor:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Atualize o executor a partir de um arquivo de bytecode compilado IVM:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
