---
translation_locale: pt
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 96ca67b9bbf9d743de2f640e09487176f62a8a31052e4f1e15e15a771e985c48
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Desenvolver na SORA Nexus com Taira e Minamoto {#build-on-sora-3-taira-and-minamoto}

A SORA Nexus funciona sobre o Iroha 3. Desenvolva e teste sua aplicação primeiro na Taira. Use a mesma configuração de cliente na Minamoto somente quando tiver chaves separadas para a rede principal, XOR real para as taxas e autorização para operar em produção.

Este guia mostra como configurar um cliente Iroha para as duas redes públicas da SORA Nexus.

- Taira testnet em `https://taira.sora.org`
- Minamoto mainnet em `https://minamoto.sora.org`

Use Taira para testes de integração, canários de escrita financiados por testnet e ensaios de implantação. Use Minamoto apenas para atividade pronta para produção na mainnet. Ambas as redes cobram taxas em XOR:

- Taira usa a testnet XOR do serviço público de financiamento da testnet.
- Minamoto usa XOR real. Não existe serviço de financiamento de testnet Minamoto.

## Caminho do Construtor {#builder-path}

|Passo                        | Taira Testnet                                                | Minamoto Mainnet                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Comece a ler o estado da rede|Consulta `/status` sem chaves| Confirme primeiro o endereço do serviço e seu certificado TLS |
|Escolha um espaço de dados|Use o `universal` público, salvo se a aplicação precisar de seu próprio espaço de dados governado|Use o mesmo espaço de dados somente após a aprovação da rede principal|
|Obter ativo de taxa|Use o serviço público de financiamento da testnet Taira|Receber XOR de uma conta Minamoto financiada ou fluxo de tesouraria aprovado|
| Teste escreve                 |Use teste financiado pela testnet XOR|Não use ferramentas de teste; gastos escrevem XOR reais|
|Promover|Mantenha a lógica de novas tentativas, o monitoramento e a gestão de signatários|Use chaves, fundos e controles de lançamento separados|

O fluxo prático é:

1. Desenvolva o cliente usando o Taira e o espaço de dados público `universal`.
2. Adicione um signatário criptográfico e financie-o com o serviço de financiamento de testnet Taira.
3. Exercite a lógica do seu aplicativo contra Taira até que as falhas se tornem enfadonhas e observáveis.
4. Crie um signatário criptográfico separado Minamoto, financie-o com XOR real e mova apenas as mesmas operações comprovadas para a mainnet.

## Continue com o Livro de Receitas {#continue-with-the-cookbook}

Use este guia para escolher uma rede, configurar um signatário criptográfico e financiar taxas. Então continue com a receita que corresponde ao comportamento do aplicativo que você deseja criar:

|Objetivo|Receita|
| --- | --- |
|Verifique Taira e configure um cliente| [Conectar-se a Taira](/pt/cookbook/connect-to-taira.md) |
|Envie uma primeira escrita e verifique seu resultado| [Enviar e Verificar Transações](/pt/cookbook/submit-and-verify-transactions.md) |
|Registrar, emitir e movimentar valor| [Ativos Fungíveis](/pt/cookbook/fungible-assets.md) |
|Ler estado de aplicação filtrado| [Consultar o estado do livro-razão da blockchain](/pt/cookbook/query-ledger-state.md) |
|Reagir às alterações confirmadas| [Eventos de Transmissão](/pt/cookbook/stream-events.md) |

O livro de receitas mantém cada fluxo de trabalho focado e retorna aqui quando precisa de financiamento Taira ou de contexto de rede SORA Nexus.

## 1. Entenda o que você está configurando {#_1-understand-what-you-are-setting-up}

No SORA Nexus, o catálogo de espaços de dados define os espaços de dados. O catálogo de faixas de execução define as faixas separadamente: cada faixa referencia um espaço de dados, e um espaço de dados pode ter várias faixas. Um cliente não cria um novo espaço de dados público apenas alterando `client.toml`. A configuração do cliente faz duas coisas:

1. aponta o cliente para o endpoint correto do Torii
2. seleciona o contexto de rede e a chave de assinatura de sua conta canônica

`AccountId` é sempre canônico e não contém domínio, e `client.toml` não tem configuração de domínio: `[account].profile` seleciona apenas o prefixo I105 da rede. O contexto de domínio pertence aos aliases e aos objetos pertencentes ao domínio. Para a maioria dos aplicativos, comece pelo espaço de dados público `universal`. O contexto de domínio usa a forma `domain.dataspace`, por exemplo:

```text
wonderland.universal
```

Se você precisar de um novo espaço de dados organizacional, prepare um catálogo e uma proposta de roteamento em vez de tentar registrá-lo a partir de uma conta de cliente comum. Veja [Provisionar um Novo Espaço de Dados](#_8-provision-a-new-dataspace) abaixo.

## 2. Verificar o endpoint público do Torii {#_2-check-the-public-torii-endpoint}

Consulte o estado da rede de testes Taira com `curl` e `jq`. A consulta dispensa chaves e um nó local.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspecione a visão dos espaços de dados e das faixas de execução exposta pelo nó:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Antes de usar Minamoto, confirme com o operador o endereço do serviço da rede principal e verifique se o certificado TLS corresponde ao nome do servidor.

## Taira MCP para Agentes {#taira-mcp-for-agents}

Taira também expõe uma ponte de Protocolo de Contexto de Modelo nativo Torii (MCP) para tempos de execução de software de agentes. Use-a quando um agente precisar de leituras ao vivo na testnet, diagnósticos scriptados ou ensaios de escrita cuidadosamente revisados, sem precisar construir um cliente Torii personalizado primeiro.

|Configuração|Valor|
| --- | --- |
| Endpoint MCP | `https://taira.sora.org/v1/mcp` |
|Raiz da rede| `https://taira.sora.org` |
|Uso pretendido|Taira leituras na testnet e ensaios de escrita financiados pela testnet|
| Equivalente em produção | Não aponte esta entrada para o Minamoto sem aprovação explícita de um endpoint MCP da mainnet e dos controles de lançamento |

A ponte aceita somente requisições JSON-RPC `POST` sem estado. Verifique seus metadados de descoberta antes de adicionar material de assinatura:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

Configure a URL como servidor MCP local do usuário no ambiente de execução do agente. Não registre neste repositório nem no da aplicação a configuração MCP do agente, tokens de API, cabeçalhos de autenticação encaminhados ou valores de `authority` e `private_key`.

Regras de prompt do agente que funcionam bem com Taira:

- Descubra ferramentas do servidor MCP antes de chamá-las; redescubra se o servidor relatar `listChanged`.
- Prefira as ferramentas `iroha.*` selecionadas em vez das ferramentas `torii.*` brutas.
- Iniciar apenas leitura: inspecione status, contas, ativos, aliases, blocos, estado de governança e status de transações antes de propor gravações.
- Exija uma instrução humana explícita antes de mutações na testnet ao vivo. Para contêineres de dados de transações pré-assinadas, use `iroha.transactions.submit_and_wait` para que o agente aguarde o resultado em vez de apenas enviar.
- Resuma os hashes criptográficos da transação, o status final e os erros de validação do servidor na resposta do agente.

### Fluxo de Trabalho de Desenvolvimento com Agentes {#development-workflow-with-agents}

Use agentes como auxiliares de desenvolvimento para clientes Iroha, construtores de transações, scripts de diagnóstico e runbooks de testnet. Mantenha o principal de autorização do agente restrito: ele pode inspecionar o código, ler o estado Taira, propor alterações e executar testes locais, mas não deve modificar uma rede ao vivo até que um humano aprove a operação exata.

Um fluxo de trabalho prático é:

1. Peça ao agente para inspecionar os documentos relevantes, o código SDK, o comando CLI ou o esquema da ferramenta MCP antes de escrever o código.
2. Peça ao agente para escrever primeiro o caminho do cliente mais curto: verificação de status, consulta de conta, resolução de alias ou consulta de saldo.
3. Adicione código para construir transações somente depois que as chamadas de leitura funcionarem na Taira.
4. Mantenha os testes em rede ao vivo como opt-in, por exemplo atrás de `TAIRA_LIVE=1`, para que uma execução normal de teste unitário nunca gaste fundos de testnet ou dependa da disponibilidade da rede.
5. Exigir que o agente relate a raiz da rede, cadeia, conta principal de autorização, resumo da instrução, ativo de taxa e mudança de estado esperada antes de enviar qualquer transação.
6. Revise o código gerado quanto ao manuseio de segredos, comportamento de repetição, idempotência e tratamento de rejeições antes de promovê-lo para CI ou fluxos de trabalho mainnet.

Ferramentas úteis de somente leitura MCP para desenvolvimento incluem consultas de ativos de conta, resolução de alias, consulta de blocos, consulta de transações, listas de transações e verificações de status do pipeline de processamento. Use estas para construir confiança antes de enviar qualquer payload assinado.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Fluxo de Trabalho de Transação Através de Agentes {#transaction-workflow-through-agents}

A ponte MCP pode enviar uma transação Iroha assinada, mas ela não elimina os requisitos normais da transação. Uma transação ainda precisa de um principal de autorização correto, permissões, financiamento de taxa, ID da cadeia, metadados e assinatura.

Para transações brutas do Iroha, primeiro construa e assine o envelope da transação com um SDK ou a CLI. Forneça ao agente somente os bytes canônicos da transação assinada, codificados como `body_base64`. O agente pode enviar o envelope com `iroha.transactions.submit_and_wait` ou usar `iroha.transactions.submit` e consultar o estado com `iroha.transactions.wait`.

Não cole chaves privadas no prompt de um agente. Se ele precisar construir uma transação, indique código local que carregue os segredos do ambiente de execução do usuário, do chaveiro, de um signatário de hardware ou de um arquivo ignorado de configuração da rede de testes. O agente nunca deve gravar as chaves em Markdown, artefatos de teste, logs ou commits.

Antes de enviar uma transação, faça o agente produzir um breve plano de transação:

- `network`: raiz da rede de testes Taira e ID da cadeia
- `authority`: conta que assina e paga taxas
- `instructions`: resumo de registro, emissão, queima, transferência, metadados, permissão ou chamada de contrato
- `fee asset`: ativo que será cobrado em Taira
- `preflight reads`: conta, saldo de ativos, permissões, alias ou verificações de bloqueio já realizadas
- `expected result`: o estado que deve estar visível após a confirmação
- `idempotency`: o que acontece se a mesma solicitação for tentada novamente

Após a submissão, faça o agente aguardar um status terminal e, em seguida, verifique a mudança de estado com uma consulta de leitura. Um relatório de conclusão útil inclui:

- hash criptográfico de transação
- status do terminal como `Committed`, `Applied`, `Rejected` ou `Expired`
- bloco ou detalhes do explorador quando disponíveis
- resultados da leitura de verificação
- mensagem de rejeição e indicação de que a falha parece estar relacionada a permissões, taxas, validação, estado desatualizado ou disponibilidade do endpoint

Exemplo de prompt protegido:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Quando o contêiner de dados assinado já está preparado:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Trate o Taira MCP como uma superfície de controle da rede de testes pública. Chaves da Taira, XOR de teste, contas do dispensador e signatários canários são descartáveis e devem permanecer separados das chaves da Minamoto e dos fluxos de lançamento em produção.

## Exemplos de Brinquedo Que Você Pode Experimentar Agora {#toy-examples-you-can-try-now}

Estes exemplos de leitura consultam a Taira sem chaves de conta.

Liste todas as faixas de execução do Taira com seu espaço de dados e sua visibilidade:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construa uma pequena sonda de status Node.js para um painel, bot ou verificação de implantação:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

O primeiro exemplo de escrita deve ser uma solicitação ao serviço de financiamento da Taira. Ele usa XOR de testnet e nunca deve apontar para Minamoto.

## 3. Criar uma Configuração de Cliente Taira {#_3-create-a-taira-client-config}

Gere um par de chaves se você ainda não tiver um:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Criar `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

O `chain` de nível superior é o ID exato da cadeia de transações Taira, e `network_id` é a identidade exata da rede à qual cada assinatura se vincula. Configure exatamente um de `network_id` ou `network_id_file`. A configuração `[account].profile = "taira"` seleciona independentemente o discriminante da cadeia Taira I105. O ID da cadeia não seleciona o perfil da conta.

Execute uma verificação apenas leitura:

```bash
iroha --config ./taira.client.toml ledger domain list --limit 5
```

Execute os diagnósticos públicos Taira antes de escrever os testes:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financie a conta do Taira pelo faucet antes de executar escritas que pagam taxas. O fluxo preparado do faucet está em [Obter XOR de testnet no Taira](#_4-get-testnet-xor-on-taira).

Depois que a conta estiver financiada, uma instrução de log assinada serve como teste básico opcional de escrita. Toda transação enviada identifica seu pagador de taxas, e a CLI fornece a cotação exata da taxa antes de assinar:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

O comando aguarda confirmação. O Taira é uma testnet pública, portanto a saturação da fila pode fazer o ping falhar mesmo quando o faucet funciona. Se `taira doctor` informar uma fila saturada ou o ping retornar `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, aguarde e tente novamente antes de tratar isso como um erro de configuração do cliente.

Para testes básicos sem supervisão, execute o ping em um laço com número limitado de tentativas:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Pare de tentar novamente se `iroha taira doctor` mostrar falhas críticas. Saturação da fila e rejeições por taxa de admissão são condições transitórias da rede pública de teste; os diagnósticos DNS, TLS ou `status = "fail"` não são.

## Gerar um ID de Conta SORA Nexus {#generate-a-sora-nexus-account-id}

Um ID de conta do SORA Nexus é um endereço I105 canônico derivado da chave pública da conta e do prefixo da rede de destino. A mesma chave pública é codificada em IDs diferentes no Taira e no Minamoto, e os usuários de produção devem gerar um par de chaves separado para o Minamoto.

Gere ou carregue o par de chaves Ed25519 que controlará a conta:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Converta a chave pública em um ID de conta Taira:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Converter uma chave pública Minamoto com o prefixo da mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Use o ID de conta resultante sempre que uma API ou um comando da CLI do SORA Nexus solicitar um ID de conta canônico, por exemplo em consultas de saldo, campos de conta estritos ou vinculações de aliases. Mantenha a chave privada correspondente na configuração do cliente e selecione a mesma rede pública com `[account].profile = "taira"` ou `[account].profile = "minamoto"`.

Gerar o ID por si só não cria uma conta on-chain financiada. Em Taira, o serviço de financiamento da testnet pode criar e financiar a conta para gravações na testnet. Em Minamoto, use um processo de integração ou tesouraria aprovado na mainnet.

### Armazenamento e Backup de Chaves {#key-storage-and-backup}

O ID da conta e a chave pública podem ser compartilhados. A chave privada correspondente, a senha, a semente e o material de recuperação devem ser tratados como secretos.

Use estas práticas para contas SORA Nexus:

- Armazene chaves privadas em um gerenciador de senhas criptografado, repositório de chaves com suporte de hardware ou serviço de assinatura dedicado. Não faça commit das chaves no controle de versão nem deixe chaves de produção no histórico do shell, logs, chats, tickets ou backups não criptografados.
- Use uma senha de alta entropia única para cada cofre ou signatário criptográfico de produção. Armazene as senhas em um gerenciador de senhas ou em um processo de custódia dividida, não no mesmo arquivo ou pacote de backup da chave privada criptografada.
- Mantenha as chaves Taira e Minamoto separadas. Trate as chaves Taira como material descartável de testnet e as chaves Minamoto como o principal de autorização de fundos de produção.
- Faça backup da chave privada, chave pública, ID da conta, perfil da conta e quaisquer notas de recuperação ou custódia da conta necessárias para restaurar o signatário criptográfico. Uma chave privada sem o contexto da rede é fácil de ser usada incorretamente durante a recuperação.
- Mantenha pelo menos um backup offline criptografado e um backup criptografado geograficamente separado para assinadores criptográficos de produção. Teste a recuperação com uma pequena operação somente leitura antes de depender do backup.
- Gire ou substitua um signatário criptográfico se a chave privada, a frase secreta, o meio de backup ou o host de assinatura puderam ter sido expostos.

Para mais detalhes, veja [Armazenando Chaves Criptográficas](/pt/guide/security/storing-cryptographic-keys.md) e [Segurança de Senha](/pt/guide/security/password-security.md).

## 4. Obtenha Testnet XOR em Taira {#_4-get-testnet-xor-on-taira}

Solicite XOR de testnet com o fluxo preparado do faucet da CLI. O faucet financia a conta configurada em `taira.client.toml` e a registra primeiro caso ela ainda não exista. O fluxo é:

1. Leia a política pública do faucet: sua autoridade, o ativo de taxas e o valor.
2. Prepare a solicitação. A CLI resolve a prova de trabalho, verifica a transação exata que o Torii prepara e assina e a salva em um diretório privado de diário sem enviá-la.
3. Envie a transação salva uma vez.
4. Aguarde até que o saldo do ativo fique visível antes de enviar escritas que pagam taxas.

Leia a política:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

A resposta tem esta forma:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

A política consiste em dados de descoberta não assinados. A automação deve fixar a autoridade, a definição de ativo e o valor esperados, em vez de confiar em cada resposta. `prepare` recusa uma transação preparada que difira dos valores fornecidos.

Prepare e envie a solicitação:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` cria o diretório do diário de forma privada e se recusa a substituir um diretório existente; portanto, use um diretório novo para cada solicitação. O faucet é um serviço público de testnet. Se `submit` informar `Pending`, exceder o tempo limite ou receber `502`, execute `taira account faucet resume` com a mesma configuração e o mesmo diário, em vez de preparar outra solicitação. Uma âncora de prova de trabalho desatualizada faz `prepare` falhar; nesse caso, prepare novamente em um novo diretório de diário.

Então verifique o ativo financiado antes de enviar suas próprias transações pagas:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Se a solicitação tiver sido aplicada, mas o ativo ainda não estiver visível, aguarde e repita a leitura antes de enviar escritas.

O dispensador fornece fundos somente para a rede de testes Taira. Não use XOR de teste, contas do dispensador nem signatários canários da Taira em fluxos da Minamoto.

## 5. Criar uma Configuração de Cliente Minamoto {#_5-create-a-minamoto-client-config}

Antes de usar Minamoto, confirme com o operador o endereço do serviço da rede principal e verifique se o certificado TLS corresponde ao nome do servidor.

Use um par de chaves separado para Minamoto. Não reutilize as chaves Taira para a mainnet.

Criar `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

O `chain` de nível superior é o ID atual da cadeia da mainnet do SORA Nexus, e `network_id` é a identidade exata da rede Minamoto; leia-a na rota de capacidades antes da primeira operação assinada. `[account].profile = "minamoto"` seleciona o discriminante de cadeia I105 do Minamoto; o nome de host do endpoint e o ID da cadeia não o selecionam implicitamente.

Converta uma chave pública Minamoto em seu ID de conta I105 canônico com o prefixo da mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Execute apenas verificações do lado de leitura até que a conta seja provisionada e financiada através do fluxo de integração ou governança da mainnet:

```bash
iroha --config ./minamoto.client.toml ledger domain list --limit 5
```

Não execute os comandos do faucet ou dos testes básicos do Taira no Minamoto.

## 6. Financiar uma Conta Minamoto com XOR {#_6-fund-a-minamoto-account-with-xor}

As taxas Minamoto são pagas com produção XOR, e Minamoto não possui serviço público de financiamento em testnet. Financie a conta configurada através de um onboarding aprovado na mainnet ou transferência do tesouro, ou receba XOR de uma conta Minamoto já financiada.

Verifique o ID de conta canônico e o financiamento com verificações somente leitura antes de enviar uma gravação. Trate Minamoto XOR como fundos de produção: ensaie a mesma operação em Taira primeiro, mantenha chaves de produção separadas e não presuma que uma transação na mainnet possa ser reiniciada.

O XOR da Taira não pode pagar taxas da Minamoto. Saldos e solicitações de fundos da rede de testes não são transferidos para a Minamoto.

## 7. Trabalhar dentro de um espaço de dados existente {#_7-work-inside-an-existing-dataspace}

Use nomes de domínio totalmente qualificados para objetos do livro-razão da blockchain que residem dentro de um espaço de dados. Por exemplo, um domínio de projeto no espaço de dados público deve usar:

```text
apps.universal
```

Depois que sua conta tiver as permissões necessárias, crie uma intenção `AliasSetupPlanRequestV1` sem segredo para o domínio e use o planejador declarativo:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Para Minamoto, gere e aprove uma intenção e plano de mainnet separados. Os planos estão vinculados à sua cadeia, ao principal de autorização, à âncora de estado ativo e ao prazo, portanto, um plano Taira não pode ser promovido ou reproduzido:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Aliases de conta usam o mesmo sufixo de espaço de dados:

```text
alice@apps.universal
alice@universal
```

Campos de conta estritos ainda usam IDs de conta canônicos I105. Trate alias como ligações legíveis por humanos que se resolvem em IDs de conta canônicos.

## 8. Provisionar um Novo Espaço de Dados {#_8-provision-a-new-dataspace}

Um novo espaço de dados exige uma mudança de operação e governança. O endpoint público do Torii pode rotear tráfego para espaços de dados configurados, mas rejeita aliases de espaços de dados desconhecidos.

Antes de preparar uma alteração, capture o catálogo atual em tempo real:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Para uma conta de operador, verifique também a postura do manifesto técnico da pista de execução:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Não promova um novo alias sem que o ID da faixa de execução, o ID do espaço de dados, o conjunto de validadores, a tolerância a falhas, o manifesto, as regras de roteamento e o responsável operacional tenham sido revisados em conjunto. Uma conta de usuário comum com as permissões necessárias pode adquirir um domínio e sua locação SNS dentro de um espaço de dados existente por meio do planejador de aliases; ela não pode adicionar com segurança um novo espaço de dados público.

Para um espaço de dados privado ou organizacional, prepare uma alteração de catálogo com:

- um alias exclusivo do espaço de dados e um `id` numérico
- uma entrada de linha de execução correspondente ou uma atribuição de linha de execução existente
- o `fault_tolerance` do espaço de dados
- regras de roteamento para as instruções ou escopos de conta que devem chegar lá
- um manifesto do Diretório de Espaços ou evidência de implantação equivalente, quando o espaço de dados expõe capacidades UAID
- aprovação de governança para política de validador, conformidade, liquidação e monitoramento

Um fragmento de configuração revisável se parece com isto:

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
description = "Payments data space"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments data space"
```

A aceitação pelo operador deve incluir estes portões:

- `iroha3d --sora --config <config.toml> --check-config` transmite a configuração do nó resolvido
- o manifesto técnico gerado ou revisado é arquivado com hashes e assinaturas criptográficas
- os testes de fumaça passam em Taira antes de qualquer promoção de Minamoto
- o catálogo de `/status` após a mudança mostra a faixa de execução e o espaço de dados pretendidos
- `iroha app nexus lane-report --summary` não relata manifestos técnicos obrigatórios ausentes

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promova o mesmo espaço de dados para o Minamoto somente depois de concluir a implantação no Taira, os testes básicos, o monitoramento e as evidências de governança.

## Páginas Relacionadas {#related-pages}

- [Instalar Iroha 3](/pt/get-started/install-iroha.md)
- [Operar Iroha 3 via CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Patrocinar taxas de um espaço de dados privado](/pt/get-started/private-dataspace-fee-sponsor.md)
- [Endpoints do Torii](/pt/reference/torii-endpoints.md)
- [referência de gênese da blockchain](/pt/reference/genesis.md)
