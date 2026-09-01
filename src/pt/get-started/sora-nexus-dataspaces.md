---
translation_locale: pt
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Construir sobre SORA 3: Taira e Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 é a faixa de implantação pública voltada para o aplicativo construída sobre Iroha 3 e SORA Nexus. Construa e ensaie primeiro em Taira, depois mova a mesma configuração de cliente para Minamoto somente quando você tiver chaves mainnet separadas, XOR reais para taxas e aprovação de produção.

Este tutorial mostra como configurar um cliente Iroha para as redes públicas SORA 3:

- Taira testnet em `https://taira.sora.org`
- Minamoto mainnet em `https://minamoto.sora.org`

Use Taira para testes de integração, canários de escrita financiados por testnet e ensaios de implantação. Use Minamoto apenas para atividade pronta para produção na mainnet. Ambas as redes cobram taxas em XOR:

- Taira usa a testnet XOR do serviço público de financiamento da testnet.
- Minamoto usa XOR real. Não existe serviço de financiamento de testnet Minamoto.

## Caminho do Construtor {#builder-path}

|Passo                        | Taira Testnet                                                | Minamoto Mainnet                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Comece a ler o estado da rede|Consulta `/status` sem chaves|Consulta `/status` sem chaves                       |
|Escolha um espaço de dados|Use o `universal` público, salvo se a aplicação precisar de uma via governada|Use o mesmo espaço de dados somente após a aprovação da rede principal|
|Obter ativo de taxa|Use o serviço público de financiamento da testnet Taira|Receber XOR de uma conta Minamoto financiada ou fluxo de tesouraria aprovado|
| Teste escreve                 |Use teste financiado pela testnet XOR|Não use ferramentas de teste; gastos escrevem XOR reais|
|Promover|Mantenha a lógica de novas tentativas, o monitoramento e a gestão de signatários|Use chaves, fundos e controles de lançamento separados|

O fluxo prático é:

1. Compile o cliente contra Taira e use o espaço de dados público `universal`.
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

Em SORA Nexus, um espaço de dados faz parte da pista de execução da rede e do catálogo de roteamento. Um cliente não cria um novo espaço de dados público apenas alterando `client.toml`. A configuração do cliente faz duas coisas:

1. aponta o cliente para o endpoint Torii API correto
2. seleciona o domínio e o contexto de roteamento do espaço de dados para sua conta canônica

`AccountId` é sempre canônico e sem domínio. O valor `[account].domain` em `client.toml` fornece contexto de roteamento e alias; ele não se torna parte da identidade da conta. Para a maioria das aplicações, comece com o dataspace público `universal`. O contexto de domínio usa o formato `domain.dataspace`, por exemplo:

```text
wonderland.universal
```

Se você precisar de um novo espaço de dados organizacional, prepare um catálogo e uma proposta de roteamento em vez de tentar registrá-lo a partir de uma conta de cliente comum. Veja [Provisionar um Novo Espaço de Dados](#_8-provision-a-new-dataspace) abaixo.

## 2. Verifique o endpoint Público Torii API {#_2-check-the-public-torii-endpoint}

Verifique se o endpoint de destino API está ativo antes de configurar um signatário criptográfico.

Para Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Para Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspecione o espaço de dados e a visualização da linha de execução exposta pelo nó:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Use o mesmo comando com `https://minamoto.sora.org/status` para a mainnet.

## Taira MCP para Agentes {#taira-mcp-for-agents}

Taira também expõe uma ponte de Protocolo de Contexto de Modelo nativo Torii (MCP) para tempos de execução de software de agentes. Use-a quando um agente precisar de leituras ao vivo na testnet, diagnósticos scriptados ou ensaios de escrita cuidadosamente revisados, sem precisar construir um cliente Torii personalizado primeiro.

|Configuração|Valor|
| --- | --- |
| MCP API ponto de extremidade | `https://taira.sora.org/v1/mcp` |
|Raiz da rede| `https://taira.sora.org` |
|Uso pretendido|Taira leituras na testnet e ensaios de escrita financiados pela testnet|
|Equivalente de produção|Não aponte esta entrada para Minamoto a menos que um endpoint e controles de lançamento de MCP API da mainnet estejam explicitamente aprovados|

Verifique os metadados da ponte antes de adicionar o material de assinatura:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
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
- mensagem de rejeição e se a falha parece ser relacionada a permissões, taxas, validação, estado obsoleto ou disponibilidade do endpoint API

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

Estes exemplos são somente leitura, a menos que indicado. Eles funcionam antes de você gerar chaves e são seguros para executar em redes públicas.

Compare a saúde da testnet Taira com a mainnet Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Liste os corredores de execução de dataspace públicos expostos por Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Execute o mesmo comando contra Minamoto quando você precisar da visualização da mainnet:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construa uma pequena sonda de status Node.js para um painel, bot ou verificação de implantação:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
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
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

O `chain` de nível superior é o ID exato da cadeia de transação Taira. A configuração `[account].profile = "taira"` seleciona de forma independente o discriminante da cadeia Taira I105. O ID da cadeia não seleciona o perfil da conta.

Execute uma verificação apenas leitura:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Execute os diagnósticos públicos Taira antes de escrever os testes:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financie a conta da Taira pelo dispensador antes de executar gravações sujeitas a taxas. O fluxo direto está em [Obter XOR de teste na Taira](#_4-get-testnet-xor-on-taira).

Após a reivindicação do serviço de financiamento da testnet ser aceita e a conta ser financiada, o canário Taira é um teste de escrita opcional:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

O canário envia um ping assinado, aguarda a confirmação e escreve a configuração do signatário criptográfico do tempo de execução do software quando `--write-config` é fornecido. Taira é uma testnet pública, Assim, a saturação da fila pode fazer com que o ping assinado falhe mesmo quando o serviço de financiamento da testnet em si funciona. Se `taira doctor` relatar uma fila saturada ou o canário retornar `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, aguarde e tente novamente antes de tratar como um erro de configuração do cliente.

Para testes de fumaça não supervisionados, envolva o canário em um loop de repetição limitado:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Pare de tentar novamente se `iroha taira doctor` mostrar falhas críticas. Saturação da fila e rejeições por taxa de admissão são condições transitórias da rede pública de teste; os diagnósticos DNS, TLS ou `status = "fail"` não são.

## Gerar um ID de Conta SORA Nexus {#generate-a-sora-nexus-account-id}

Um ID de conta SORA Nexus é um endereço canônico I105 derivado da chave pública da conta e do prefixo da rede alvo. Não é o valor `[account].domain` em cliente TOML. A mesma chave pública codifica para IDs diferentes em Taira e Minamoto, e os usuários de produção devem gerar um par de chaves separado para Minamoto.

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

Use o ID da conta resultante sempre que um comando Nexus, API ou CLI solicitar um ID de conta canônico, por exemplo, o serviço de financiamento de testnet Taira `account_id` consultas de saldo, campos de conta rígidos ou associações de alias. Mantenha a chave privada correspondente na configuração do seu cliente e selecione a mesma rede pública com `[account].profile = "taira"` ou `[account].profile = "minamoto"`.

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

Use o serviço de financiamento da testnet pública diretamente. O fluxo é:

1. Gere ou carregue um signatário criptográfico e calcule seu ID de conta canônico Taira.
2. Busque o quebra-cabeça do serviço de financiamento atual da testnet.
3. Resolva o quebra-cabeça se `difficulty_bits` for maior que `0`.
4. Envie a solicitação de serviço de financiamento testnet.
5. Espere que o saldo da conta ou do ativo se torne visível antes de enviar gravações que pagam taxas.

Converta uma chave pública no ID de conta Taira I105 esperado pelo serviço de financiamento da testnet:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Busque o quebra-cabeça:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

O serviço de financiamento é público e exclusivo da testnet. Se o endpoint de desafio ou solicitação da API retornar `502`, expirar ou produzir outro erro de gateway, aguarde e tente novamente antes de alterar as chaves ou a configuração do cliente.

A resposta tem esta forma:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

Quando `difficulty_bits` estiver `0`, envie apenas o ID da conta:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Quando `difficulty_bits` for maior que `0`, resolva o quebra-cabeça e inclua a altura da âncora mais o valor nonce criptográfico:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

O algoritmo do quebra-cabeça é:

1. Construa o desafio como SHA-256 sobre:
   - os bytes de `iroha:accounts:faucet:pow:v2`
   - o ID da conta UTF-8
   - `anchor_height` como big-endian `u64`
   - `anchor_block_hash_hex` decodificado como bytes
   - `challenge_salt_hex` decodificado como bytes, quando presente
2. Tente valores de nonce criptográficos `u64` codificados como valores de 8 bytes em big-endian.
3. Para cada valor de nonce criptográfico, execute scrypt com:
   - senha: o valor nonce criptográfico de 8 bytes
   - sal: o desafio de 32 bytes
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - tamanho da saída: 32 bytes
4. O valor de nonce criptográfico vencedor é o primeiro valor de digest criptográfico com pelo menos `difficulty_bits` bits zero iniciais.

A resposta do dispensador inclui o ativo financiado e o hash da transação enfileirada:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

A resposta atualmente é retornada com HTTP `202 Accepted`. Seu `asset_definition_id` é o atual ativo de taxa Taira financiado pelo serviço público de financiamento da testnet; derive isso da resposta em vez de copiar um ID de exemplo. O serviço de financiamento da testnet aceitou a solicitação quando ele retorna `tx_hash_hex` e `status: "QUEUED"`.

Então verifique o ativo financiado antes de enviar suas próprias transações pagas:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Se a reivindicação do serviço de financiamento da testnet foi aceita, mas a conta ou o ativo ainda não está visível, a transação ainda está na fila de processamento público da testnet. Aguarde e tente ler novamente antes de enviar gravações.

Para uma verificação direta API pronta para uso, salve isto como `taira_faucet_claim.py` e informe o ID da conta Taira I105:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

O dispensador fornece fundos somente para a rede de testes Taira. Não use XOR de teste, contas do dispensador nem signatários canários da Taira em fluxos da Minamoto.

## 5. Criar uma Configuração de Cliente Minamoto {#_5-create-a-minamoto-client-config}

Use um par de chaves separado para Minamoto. Não reutilize as chaves Taira para a mainnet.

Criar `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

O nível superior `chain` é o ID da cadeia principal (Nexus) atual. `[account].profile = "minamoto"` seleciona o discriminante de cadeia I105 Minamoto; o nome do host do endpoint API e o ID da cadeia não o selecionam implicitamente.

Converta uma chave pública Minamoto em seu ID de conta I105 canônico com o prefixo da mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Execute apenas verificações do lado de leitura até que a conta seja provisionada e financiada através do fluxo de integração ou governança da mainnet:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Não execute o serviço de financiamento de testnet Taira ou o assistente write-canary contra Minamoto.

## 6. Financiar uma Conta Minamoto com XOR {#_6-fund-a-minamoto-account-with-xor}

As taxas Minamoto são pagas com produção XOR, e Minamoto não possui serviço público de financiamento em testnet. Financie a conta configurada através de um onboarding aprovado na mainnet ou transferência do tesouro, ou receba XOR de uma conta Minamoto já financiada.

Verifique o ID de conta canônico e o financiamento com verificações somente leitura antes de enviar uma gravação. Trate Minamoto XOR como fundos de produção: ensaie a mesma operação em Taira primeiro, mantenha chaves de produção separadas e não presuma que uma transação na mainnet possa ser reiniciada.

O XOR da Taira não pode pagar taxas da Minamoto. Saldos e solicitações de fundos da rede de testes não são transferidos para a Minamoto.

## 7. Trabalhar dentro de um Dataspace existente {#_7-work-inside-an-existing-dataspace}

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

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Para Minamoto, gere e aprove uma intenção e plano de mainnet separados. Os planos estão vinculados à sua cadeia, ao principal de autorização, à âncora de estado ativo e ao prazo, portanto, um plano Taira não pode ser promovido ou reproduzido:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Aliases de conta usam o mesmo sufixo de espaço de dados:

```text
alice@apps.universal
alice@universal
```

Campos de conta estritos ainda usam IDs de conta canônicos I105. Trate alias como ligações legíveis por humanos que se resolvem em IDs de conta canônicos.

## 8. Provisionar um Novo Espaço de Dados {#_8-provision-a-new-dataspace}

Um novo dataspace é uma mudança de operador e governança. O endpoint público Torii API pode direcionar o tráfego para dataspaces configurados, mas rejeitará aliases de dataspace desconhecidos.

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

Não promova um novo alias a menos que o ID da linha de execução, o ID do espaço de dados, o conjunto de validadores, a tolerância a falhas, o manifesto técnico, as regras de roteamento e o proprietário operacional tenham sido revisados juntos. Uma conta de usuário normal com as permissões necessárias pode adquirir um domínio e seu SNS contrato dentro de um dataspace existente através do planejador de alias; ela não pode adicionar com segurança um novo dataspace público.

Para um espaço de dados privado ou organizacional, prepare uma alteração de catálogo com:

- um alias de espaço de dados único e numérico `id`
- uma entrada de linha de execução correspondente ou uma atribuição de linha de execução existente
- o espaço de dados `fault_tolerance`
- regras de roteamento para as instruções ou escopos de conta que devem chegar lá
- um manifesto técnico do Diretório Espacial ou evidência equivalente de implantação, quando o espaço de dados expõe capacidades UAID
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
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

A aceitação pelo operador deve incluir estes portões:

- `iroha3d --sora --config <config.toml> --trace-config` transmite a configuração do nó resolvido
- o manifesto técnico gerado ou revisado é arquivado com hashes e assinaturas criptográficas
- os testes de fumaça passam em Taira antes de qualquer promoção de Minamoto
- o catálogo `/status` pós-mudança mostra a pista de execução e o espaço de dados pretendidos
- `iroha app nexus lane-report --summary` não relata manifestos técnicos obrigatórios ausentes

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promova o mesmo espaço de dados para Minamoto somente após a conclusão da implantação de Taira, testes de fumaça, monitoramento e evidências de governança.

## Páginas Relacionadas {#related-pages}

- [Instalar Iroha 3](/pt/get-started/install-iroha.md)
- [Operar Iroha 3 via CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Taxas de patrocínio para um espaço de dados privado](/pt/get-started/private-dataspace-fee-sponsor.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [referência de gênese da blockchain](/pt/reference/genesis.md)
