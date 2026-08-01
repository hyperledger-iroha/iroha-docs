---
translation_locale: pt
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Basear-se em SORA 3: Taira e Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 é a faixa de implantação pública voltada para o aplicativo construída em Iroha 3 e SORA Nexus. Construir e ensaiar em Taira primeiro, depois mover a mesma forma do cliente para Minamoto somente quando você tiver chaves mainnet separadas, reais XOR por taxas e aprovação da produção.

Este tutorial mostra como configurar um cliente Iroha para as redes públicas SORA 3:

- Rede de ensaio Taira em `https://taira.sora.org`
- Minamoto rede principal em `https://minamoto.sora.org`

Use Taira para testes de integração, canais de escrita financiados por torneiras e ensaios de implantação. Use Minamoto apenas para atividades da rede principal prontas para produção. Ambas as redes cobram taxas em XOR:

- O Taira utiliza a rede de ensaio XOR da torneira pública.
- Minamoto utiliza real XOR. Não há torneira Minamoto.

## Caminho do Construtor {#builder-path}

|Passo .| Taira Testnet                                                |Minamoto Mainet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Comece a ler o estado da rede |Questão `/status` sem chaves |Questão `/status` sem chaves |
|Escolher um espaço de dados .|Use público `universal` a menos que o seu aplicativo precise de uma faixa regida |Use o mesmo espaço de dados somente após a aprovação da rede principal |
|Obtenha um activo de taxa .|Usar o torneiro público Taira |Receber XOR de uma conta financiada Minamoto ou um fluxo aprovado do tesouro |
|Test escreve |Utilizar o ensaio financiado por torneira XOR |Não use ferramentas de teste; escreve gastar real XOR |
|Promover|Mantenha a lógica, o monitoramento e a manipulação de assinantes.|Usar chaves separadas, fundos e controles de liberação |

O fluxo prático é:

1. Construir o cliente contra Taira e utilizar o espaço público de dados `universal`.
2. Adicionar um assinante e financiá-lo com o robô Taira.
3. Exerça a sua lógica do aplicativo contra Taira até que as falhas sejam entediantes e observáveis.
4. Criar um assinante separado Minamoto, financiá-lo com real XOR, e mover apenas as mesmas operações comprovadas para a mainet.

## 1. Entender o que você está estabelecendo {#_1-understand-what-you-are-setting-up}

Em SORA Nexus, um espaço de dados faz parte do catálogo de faixa de rede e roteamento. Um cliente não cria um novo espaço de dados público apenas mudando o `client.toml`.

1. Indica o cliente no ponto final direito Torii
2. seleciona o contexto de roteamento do domínio e espaço de dados para a sua conta canônica

`AccountId` É sempre canônico e não tem domínio. `[account].domain` valor em `client.toml` fornece contexto de roteamento e alias; não se torna parte da identidade da conta. Para a maioria das aplicações, comece com o público `universal` Espaço de dados. Uso do contexto do domínio `domain.dataspace` formulário, por exemplo:

```text
wonderland.universal
```

Se você precisar de um novo espaço de dados organizacional, prepare um catálogo e uma proposta de roteamento em vez de tentar registrá-lo a partir de uma conta do cliente comum. Veja [Provision a New Dataspace](#_8-provision-a-new-dataspace) abaixo.

## Verificar o ponto final público Torii {#_2-check-the-public-torii-endpoint}

Verifique se o endpoint-alvo está ao vivo antes de configurar um assinante.

Para Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Para Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inscrever o espaço de dados e a visão de faixa exposta pelo nó:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Use o mesmo comando com `https://minamoto.sora.org/status` para a rede principal.

## Taira MCP para Agentes {#taira-mcp-for-agents}

Taira também expõe um Torii-nativo Modelo Context Protocol (MCP) ponte para agentes runtimes. Usá-lo quando um agente precisa de testnet leituras ao vivo, diagnóstico scripted, ou estritamente revisado ensaio de escrita sem construir um cliente personalizado Torii primeiro.

|Configuração .|Valor |
| --- | --- |
|MCP ponto final |`https://taira.sora.org/v1/mcp` |
|Raiz de rede |`https://taira.sora.org` |
|Utilização prevista |Taira leituras de testnet e ensaios de escrita financiados por torneiras |
|Equivalente de produção |Não aponte esta entrada para Minamoto a menos que um ponto final da rede principal MCP e os controlos de liberação sejam expressamente aprovados |

Verifique os metadados da ponte antes de adicionar o material de assinatura:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Configure o URL como um servidor MCP local do usuário no tempo de execução do agente. Não comprometa os valores de configuração do agente MCP, tokens API, cabeçalhos de autor encaminhados, `authority` ou `private_key` neste repo de documentos ou em um repo de aplicativos.

Regras de urgência do agente que funcionam bem com Taira:

- Descobrir as ferramentas do servidor MCP antes de chamá-las; redescobrir se o servidor relatar `listChanged`.
- Preferir as ferramentas `iroha.` seleccionadas sobre as ferramentas brutas `torii.`.
- Comece a ler somente: inspecione o status, contas, ativos, pseudônimos, blocos, estado de governança e status de transação antes de propor escritos.
- Requer uma instrução humana explícita antes das mutações da rede de testes ao vivo. Para envelopes de transacção pré-assinadas, use `iroha.transactions.submit_and_wait` para que o agente espere pelo resultado em vez de apenas enviar.
- Resumir hashes de transação, estado final e erros de validação do servidor na resposta do agente.

### Fluxo de trabalho de desenvolvimento com agentes {#development-workflow-with-agents}

Usar agentes como ajudantes de desenvolvimento para clientes Iroha, construtores de transações, scripts de diagnóstico e testnet runbooks. Pode inspecionar o código, ler o estado Taira, propor alterações e executar testes locais, mas não deve mutar uma rede ao vivo até que um ser humano aprove a operação exata.

Um fluxo de trabalho prático é:

1. Peça ao agente para inspecionar os documentos relevantes, código SDK, comando CLI ou esquema de ferramentas MCP antes de escrever o código.
2. Faça com que o agente escreva primeiro o menor caminho do cliente: verificação de status, pesquisa de conta, resolução alias ou pesquisa de saldo.
3. Adicionar código de construção de transações apenas depois que as chamadas somente para leitura funcionem contra Taira.
4. Manter os testes em rede ao vivo opt-in, por exemplo, atrás de `TAIRA_LIVE=1`, para que uma unidade normal de teste nunca gaste fundos da rede ou dependa da disponibilidade da rede.
5. Exigir que o agente informe a raiz de rede, a cadeia, a conta da autoridade, o resumo das instruções, o ativo de taxa e as alterações esperadas no estado antes de apresentar qualquer transação.
6. Revisar o código gerado para a manipulação secreta, comportamento de retesting, idempotency e rejeição antes de promovê-lo para CI ou fluxos de trabalho da rede principal.

Ferramentas úteis MCP para desenvolvimento incluem pesquisas de ativos da conta, resolução de alias, pesquisa de blocos, pesquisa das transações, listas de transações e verificações do estado do pipeline.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Fluxo de trabalho das transacções através dos agentes {#transaction-workflow-through-agents}

A ponte MCP pode apresentar uma transação assinada Iroha, mas não elimina os requisitos normais de transação. Uma transação ainda precisa de autoridade correta, permissões, financiamento de taxas, cadeia ID, metadados e assinatura.

Para produtos crus Iroha transações, elaborar e assinar o envelope de transação com um SDK ou CLI Primeiro, então dê ao agente apenas os bytes de transação assinados canônicos codificados como `body_base64`. O agente pode enviar o envelope com: `iroha.transactions.submit_and_wait`, ou apresentar com `iroha.transactions.submit` e pesquisas com `iroha.transactions.wait`.

Se um agente precisa criar uma transação, aponte-a para o código local que carrega segredos do ambiente de execução do usuário, cadeia de chaves, assinador de hardware ou arquivo de configuração da testnet ignorado. O agente nunca deve escrever o material-chave para Markdown, fixtures, registos ou compromissos.

Antes de apresentar uma transacção, faça com que o agente elabore um plano curto de transação:

- `network`: Taira raiz e cadeia da rede de teste ID.
- `authority`: conta de assinatura e pagamento de taxas
- `instructions`: registro, moeda, queima, transferência, metadados, permissão ou resumo da chamada de contrato.
- `fee asset`: ativo que será cobrado em Taira
- `preflight reads`: contas, saldo de ativos, autorizações, alias ou verificações de blocos já realizadas
- `expected result`: o estado que deve ser visível após a confirmação
- `idempotency`: o que acontece se o mesmo pedido for reexaminado

Após a submissão, faça com que o agente espere um status terminal e verifique a alteração de estado com uma consulta de leitura. Um relatório útil de conclusão inclui:

- hash de transação
- Estatuto do terminal, como `Committed`, `Applied`, `Rejected` ou `Expired`
- Detalhes de bloco ou explorador, quando disponíveis
- Resultados da leitura de verificação
- mensagem de rejeição e se a falha parece com permissões, taxas, validação, estado obsoleto ou disponibilidade do endpoint

Exemplo de proteção imediata:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Quando o envelope assinado já estiver preparado:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Tratar Taira MCP como uma superfície de controlo pública da rede de ensaio. As chaves Taira, a rede de ensaico XOR, as contas das torneiras e os sinais canários são descartáveis e devem permanecer separadas das chaves Minamoto e dos fluxos de trabalho de liberação da produção.

## Exemplos de brinquedos que você pode tentar agora {#toy-examples-you-can-try-now}

Estes exemplos são somente de leitura, a menos que se indique. Funcionam antes de você gerar chaves e são seguros para ser executados contra ambas as redes públicas.

Compare a saúde da rede de ensaio Taira e da rede principal Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Lista das vias de espaço de dados público expostas por Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Execute o mesmo comando contra Minamoto quando precisar da visualização da rede principal:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construa uma pequena sonda de estado Node.js para um painel, bot ou verificação de implantação:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

O primeiro brinquedo de escritura deve ser um Taira Ele usa a rede de teste. XOR e nunca deve ser apontado para Minamoto.

## 3. Crie uma configuração de cliente Taira {#_3-create-a-taira-client-config}

Gerar um par de teclas se você não já tem um:

```bash
kagami keys --algorithm ed25519 --json
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

O nível superior `chain` É o exato Taira cadeia de transações ID. A Comissão `[account].profile = "taira"` a configuração seleciona de forma independente o Taira I105 Discriminante de cadeia. ID Não seleciona o perfil da conta.

Exercer uma verificação apenas para leitura:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Realizar o diagnóstico público Taira antes de escrever os testes:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financie a conta Taira através da torneira antes de executar as inscrições de pagamento. O fluxo direto da torneira é em [Get Testnet XOR em Taira](#_4-get-testnet-xor-on-taira).

Após a aceitação do pedido de torneio e o financiamento da conta, o canário Taira é um ensaio opcional de fumaça de escrita:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

O canário envia um ping assinado, aguarda a confirmação e escreve a configuração de assinatura do runtime quando `--write-config` Fornecido. Taira é uma rede de teste pública, por isso a saturação da fila pode fazer o ping assinado falhar mesmo quando a própria torneira funciona. `taira doctor` Indica uma fila saturada ou os resultados dos canários. `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, Esperar e tentar novamente antes de tratá-lo como um erro de configuração do cliente.

Para os ensaios de fumo sem supervisão, envolver o canário em um ciclo de ensaio limitado:

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

Pare de retomar as tentativas se `iroha taira doctor` mostrar falhas severas. Saturação da fila e rejeição da admissão de taxas são condições transitórias na rede pública de testes; diagnósticos DNS, TLS ou `status = "fail"` não são.

## Criação de uma conta SORA Nexus ID {#generate-a-sora-nexus-account-id}

Uma conta SORA Nexus ID é um endereço canônico I105 derivado da chave pública da conta e do prefixo de rede-alvo. Não é o valor `[account].domain` no cliente TOML. As mesmas chaves públicas codificam diferentes IDs em Taira e Minamoto, e os utilizadores de produção devem gerar um par de chaves separado para Minamoto.

Gerar ou carregar o par de teclas Ed25519 que irá controlar a conta:

```bash
kagami keys --algorithm ed25519 --json
```

Converter a chave pública em uma conta Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Converter uma chave pública Minamoto com o prefixo da rede principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilize a conta resultante ID sempre que um comando Nexus API ou CLI solicite uma conta canônica ID, por exemplo, o torneio Taira `account_id`, consultas de balanço, campos rígidos da conta ou alias vinculações. Mantenha a chave privada correspondente na configuração do cliente, e selecione a mesma rede pública com `[account].profile = "taira"` ou `[account].profile = "minamoto"`.

A geração do ID não cria por si só uma conta financiada na cadeia. Em Taira, o torneiro pode criar e financiar a conta para testnet escreve. Em Minamoto, use um onboarding da rede principal aprovado ou fluxo de tesouro.

### Armazenamento de chaves e respaldo {#key-storage-and-backup}

A conta ID e a chave pública podem ser compartilhadas. A chave privada correspondente, frase de senha, semente e material de recuperação devem ser tratados como secretos.

Utilize estas práticas para as contas SORA Nexus:

- Armazenar chaves privadas em um gerenciador de senhas criptografado, hardware-backed keystore ou serviço de assinatura dedicado. Não comprometa chaves para controle de fonte ou deixar chaves de produção no histórico do shell, registros, chat, bilhetes ou backups não criptografados.
- Use uma senha única de alta entropia para cada cofre ou assinante de produção. Armazenar senhas em um gerenciador de senhas ou processo de custódia dividida, não no mesmo arquivo ou pacote de backup que a chave privada criptografada.
- Mantenham Taira e Minamoto As chaves separadas. Taira Chaves como material de rede de ensaio descartável e Minamoto As chaves como autoridade de fundos de produção.
- Faça backup da chave privada, da chave pública, da conta ID, do perfil da conta e de quaisquer notas de recuperação ou custódia necessárias para restaurar o assinante. Uma chave privada sem o contexto da rede é fácil de usar mal durante a recuperação.
- Mantenha pelo menos um backup criptografado offline e um backup cripto geográficamente separado para assinantes de produção. Teste a recuperação com uma pequena operação somente leitura antes de depender do backup.
- Rotear ou substituir um assinante se a chave privada, frase de senha, mídia de backup ou hospedeiro de assinatura podem ter sido expostos.

Para mais detalhes, veja [ armazenamento de chaves criptográficas](/pt/guide/security/storing-cryptographic-keys.md) e [ Segurança de senha ](/pt/guide/security/password-security.md).

## 4. Obtenha o Testnet XOR em Taira {#_4-get-testnet-xor-on-taira}

Usa a torneira pública diretamente.

1. Gerar ou carregar um signatário e calcular a sua conta canónica Taira ID.
2. Traz o quebra-cabeça do torneiro.
3. Resolver o quebra-cabeça se `difficulty_bits` for maior do que `0`.
4. Envie o pedido da torneira.
5. Espere até que o saldo da conta ou dos ativos se torne visível antes de enviar uma nota de pagamento.

Converter uma chave pública na conta Taira I105 ID esperada pelo torneiro:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Traz o quebra-cabeça:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

O robô é um serviço público de testnet. Se o quebra-cabeça ou o ponto final da reivindicação retornar `502`, um timeout ou outro erro de nível do gateway, espere e tente novamente antes de alterar suas chaves ou configuração do cliente.

A resposta tem a seguinte forma:

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

Quando `difficulty_bits` for `0`, apresentar apenas a conta ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Quando `difficulty_bits` for maior que `0`, resolver o quebra-cabeça e incluir a altura da âncora mais nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

O algoritmo do quebra-cabeça é:

1. Construir o desafio como SHA-256 sobre:
   - Os bytes de `iroha:accounts:faucet:pow:v2`
   - a conta UTF-8 ID
   - `anchor_height` como um grande endio `u64`
   - `anchor_block_hash_hex` decodificado em bytes
   - `challenge_salt_hex` decodificado em bytes, quando presente
2. Tente `u64` nãoces codificados como valores de 8 bytes big-endian.
3. Para cada nonce, executar scrypt com:
   - senha: o nonce de 8 bytes
   - Sal: o desafio de 32 bytes
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - comprimento de saída: 32 bytes
4. A nonce vencedora é a primeira digestão com pelo menos `difficulty_bits` na frente de bits zero.

A resposta à torneira inclui o ativo financiado e o hash das transações em fila:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

A resposta é atualmente devolvida com HTTP `202 Accepted`. A definição de ativo ID acima é o Taira Assinatura de um recurso financeiro financiado pela torneira pública. `tx_hash_hex` e `status: "QUEUED"`.

Então pesquise o ativo financiado antes de enviar as suas próprias transações com pagamento de taxas:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Se a reivindicação da torneira for aceita, mas a conta ou o ativo ainda não estiver visível, a transação ainda está por trás do processamento público de fila da rede de testes.

Para uma verificação direta API pronta a ser executada, salve-a como `taira_faucet_claim.py` e passe a conta Taira I105 ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

O torneiro é apenas para fundos da rede de teste Taira. Não utilize testnet XOR, contas de torneiro ou sinais canários Taira nos fluxos Minamoto.

## 5. Crie uma configuração de cliente Minamoto {#_5-create-a-minamoto-client-config}

Usar um par de teclas separado para Minamoto. Não reutilize as chaves Taira para a rede principal.

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

O nível superior `chain` é a corrente Nexus Cadeia de rede principal ID. `[account].profile = "minamoto"` seleciona o Minamoto I105 Discriminante de cadeia; nome de hospedeiro e cadeia do ponto final ID Não o selecione implícitamente.

Converter uma chave pública Minamoto em sua conta canônica I105 ID com o prefixo da rede principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Exercer apenas verificações do lado de leitura até que a conta seja provisionada e financiada através do fluxo de integração ou governança da rede principal:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Não coloque a torneira Taira ou o auxiliar de escrita em contacto com a Minamoto.

## 6. Financiar uma conta Minamoto com XOR {#_6-fund-a-minamoto-account-with-xor}

As taxas Minamoto são pagas com a produção XOR, e Minamoto não tem torneira pública. Financie a conta configurada através de uma transferência de caixa aprovada ou receba XOR de uma conta existente financiada Minamoto.

Verifique a conta canônica ID e o financiamento com verificações somente de leitura antes de enviar uma inscrição. Trate Minamoto XOR como fundos de produção: ensine a mesma operação em Taira primeiro, mantenha chaves de produção separadas e não presuma que uma transação da rede principal possa ser reiniciada.

Taira XOR não pode pagar comissões Minamoto. Os saldos da rede de ensaio e os créditos do torneiro não são transferidos para Minamoto.

## 7. Trabalhar dentro de um espaço de dados existente {#_7-work-inside-an-existing-dataspace}

Use nomes de domínio totalmente qualificados para objetos do livro-razão que vivem dentro de um espaço de dados. Por exemplo, um domínio de projeto no espaço de dados público deve usar:

```text
apps.universal
```

Depois que a sua conta tiver as permissões necessárias, crie uma intenção `AliasSetupPlanRequestV1` livre de segredos para o domínio e use o planejador declarativo:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Para Minamoto, gerar e aprovar uma intenção e plano da rede principal separados. Os planos estão vinculados à sua cadeia, autoridade, âncora do estado vivo e prazo, de modo que um plano Taira não pode ser promovido ou reproduzido:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Os pseudónimos de conta utilizam o mesmo sufixo de espaço de dados:

```text
alice@apps.universal
alice@universal
```

Os campos de conta rigorosa ainda utilizam a conta canônica I105 IDs. Trate os pseudónimos como vinculações legíveis ao ser humano que resolvem-se à conta canôónica IDs.

## 8. Providenciar um novo espaço de dados {#_8-provision-a-new-dataspace}

Um novo espaço de dados é uma mudança de operador e governança. O endpoint público Torii pode encaminhar o tráfego para espaços de dados configurados, mas rejeitará alias desconhecidos do espaço de dados.

Antes de preparar uma alteração, capture o catálogo ao vivo atual:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Para uma conta de operador, verifique também a postura do manifesto da faixa:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Não promover um novo alias, a menos que a faixa ID, o espaço de dados ID, o conjunto de validador, a tolerância à falha, o manifesto, as regras de encaminhamento e o proprietário operacional tenham sido revisados juntos. Uma conta de usuário normal com as permissões exigidas pode adquirir um domínio e o seu SNS arrendamento dentro de um espaço de dados existente através do alias planner; ela não pode adicionar com segurança um novo espaço de dados público.

Para um espaço de dados privado ou organizacional, prepare uma alteração do catálogo com:

- Um alias e um número únicos de espaço de dados `id`
- uma entrada de faixa correspondente ou uma atribuição de faixa existente
- o espaço de dados `fault_tolerance`
- Regras de encaminhamento para as instruções ou os escopo da conta que devem aterrar lá
- Um manifesto do Directório Espacial ou evidências equivalentes de implantação, quando o espaço de dados expõe capacidades UAID
- aprovação de governança para a política de validador, conformidade, liquidação e monitoramento;

Um fragmento de configuração revisavelmente parece assim:

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

A aceitação do operador deve incluir as seguintes portas:

- `irohad --sora --config <config.toml> --trace-config` transmite a configuração do nó resolvido
- O manifesto gerado ou revisto é arquivado com hashes e assinaturas
- Os ensaios de fumo são realizados em Taira antes de qualquer promoção Minamoto
- O catálogo pós-mudança `/status` mostra a faixa e o espaço de dados previstos.
- O `iroha app nexus lane-report --summary` não informa a falta de manifestos exigidos

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promover o mesmo espaço de dados para Minamoto somente após a implantação do Taira, os testes de fumaça, monitoramento e evidências de governança estarem completas.

## Páginas relacionadas {#related-pages}

- [Instalação Iroha 3](/pt/get-started/install-iroha.md)
- [Operar Iroha 3 através de CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Taxas de patrocínio para um espaço privado de dados](/pt/get-started/private-dataspace-fee-sponsor.md)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
- [Referência de Gênesis](/pt/reference/genesis.md)
