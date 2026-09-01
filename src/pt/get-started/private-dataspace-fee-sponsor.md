---
translation_locale: pt
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Taxas de Patrocinador para um Espaço de Dados Privado {#sponsor-fees-for-a-private-dataspace}

O patrocínio de taxas permite que os usuários enviem transações de espaço de dados privado sem possuir XOR. O usuário ainda assina a transação. Os metadados da transação apontam para uma conta patrocinadora, e o tempo de execução do software debita o saldo de XOR do patrocinador pela taxa de rede.

A integração tem três partes móveis:

1. o nó permite patrocínio de taxas
2. a conta patrocinadora existe e possui XOR
3. cada usuário tem `CanUseFeeSponsor` para esse patrocinador

Depois disso, cada transação de usuário patrocinado precisa apenas destes metadados:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Esta página mostra dois padrões comuns:

- Usuário gratuito escreve: o patrocinador paga XOR e o usuário não paga nada.
- Taxas de token local: o usuário paga o patrocinador com um token do aplicativo, e o patrocinador paga a rede em XOR.

Use Taira ou uma rede de teste privada primeiro. Um novo espaço de dados privado é uma mudança de operador e governança; ele não é criado pela configuração do cliente.

## Valores de Exemplo {#example-values}

Os comandos abaixo usam estes espaços reservados:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

Use IDs de conta canônicos I105 a menos que sua implantação tenha apelidos de conta ativos para as mesmas contas.

## 1. Prepare o Espaço de Dados {#_1-prepare-the-dataspace}

Comece pelo catálogo de espaço de dados privado e pelo trabalho de roteamento descrito em [Conectar-se aos Dataspaces SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Um fragmento voltado para o operador se parece com isto:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Antes de passar para as transações do usuário, verifique se:

- a via de execução privada aparece na resposta do nó `/status`
- contas de usuário são admitidas pelo seu fluxo privado de integração
- a conta do patrocinador existe
- o ativo de taxa XOR e a conta de absorção de taxa são válidos na rede

## 2. Registrar Ativos no Espaço de Dados {#_2-register-assets-in-the-dataspace}

Registre as definições de ativos que os usuários terão dentro do espaço de dados privado antes de conectá-las à lógica do aplicativo. Para o padrão de taxa de token local, o tutorial usa `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Primeiro configure o domínio e SNS arrendamento que possui o namespace do ativo. Crie uma intenção `AliasSetupPlanRequestV1` sem segredo para `$BILLING_DOMAIN`, incluindo o ID do espaço de dados numérico `team`, proprietário canônico, prazo do arrendamento e o guardião de cotação atual:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Então registre a definição do ativo. O canônico `--id` é o ID da definição de ativo a nível de rede. O alias é o que desenvolvedores e usuários finais devem usar no código do dataspace:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

emitir ou transferir o token local para um usuário durante a integração:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Verifique o saldo do usuário:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Use o mesmo padrão para os ativos de aplicativo no espaço de dados. Registre uma definição de ativo por token, dê a cada uma um alias de espaço de dados e faça referência ao alias a partir do código SDK em vez de codificar os IDs das definições de ativos canônicos.

## 3. Registrar Apelidos de Usuário {#_3-register-user-aliases}

As contas ainda são IDs de conta canônicos I105. Nomes voltados para o usuário são apelidos de conta, e os apelidos devem ser identificadores não sensíveis, como `alice@team` ou `alice@members.team`. Não use números de telefone ou endereços de e-mail como apelidos. Eles pertencem ao fluxo de identificadores privados na próxima seção.

A configuração de alias usa o mesmo planejador declarativo que a configuração de domínio. Faça com que o serviço SDK ou de onboarding crie uma intenção `AliasSetupPlanRequestV1` sem segredo cujo registro de alias de conta alvo `$USER`, seleciona o papel principal, fixa o ID do espaço de dados numérico e mantém a proteção da cotação de leasing atual. Em seguida, planeje e aplique como uma única transação atômica:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Se o usuário não deve pagar XOR, use o serviço de integração aprovado ciente do patrocinador para construir e enviar a transação de configuração. Não divida a aquisição de aluguel e a vinculação de alias em transações de aplicação independentes.

Depois que o alias for vinculado, verifique-o a partir do CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Para a criação de uma nova conta, prefira um serviço de integração que construa `NewAccount` com um `uaid` estável e, se necessário, um `label` inicial. O simples comando `ledger account register --id` apenas registra o ID da conta canônica.

## 4. Registrar telefone e e-mail de forma privada com FHE {#_4-register-phone-and-email-privately-with-fhe}

Use números de telefone e endereços de e-mail como reivindicações de identificador privado, não como apelidos públicos. O fluxo suportado pelo FHE mantém os identificadores brutos fora dos apelidos de conta, metadados de transação e estado global:

1. o operador registra um [RAM-LFE/FHE política do programa](/pt/blockchain/ram-lfe.md) para telefone e e-mail
2. o operador registra políticas de identificador ativo, como `phone#team` e `email#team`
3. a carteira normaliza o telefone ou e-mail localmente
4. a carteira envia o valor criptografado para o resolvedor
5. o resolvedor retorna um `IdentifierResolutionReceipt`
6. o usuário envia `ClaimIdentifier` com o registro do resultado do protocolo
7. a cadeia armazena um identificador opaco e o hash do recibo, não o telefone nem o e-mail sem processamento

A configuração de política do lado do operador é uma tarefa SDK ou de serviço. Construa e envie esses pares de instruções para cada tipo de identificador:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Repita isso para e-mail com:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Durante a integração, a carteira ou o backend deve normalizar localmente:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Após o arquivo de metadados do patrocinador ser criado na etapa 8, envie uma instrução de reivindicação assinada pelo usuário com esses metadados:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

O atual CLI não expõe comandos tipados para essas instruções de identidade. Gere valores serializados `InstructionBox` com o SDK e envie-os através do `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Mantenha essas diretrizes no serviço de integração:

- apelidos de conta são apenas identificadores legíveis por humanos
- valores brutos de telefone e e-mail nunca aparecem em apelidos, metadados, registros ou cargas de transações
- a conta tem um `uaid` antes de reivindicar identificadores privados
- protocolo resultados registros vincular `policy_id`, `opaque_id`, `uaid`, `account_id` e expiração
- as chaves do resolvedor e os compromissos de programas ocultos são controlados pela governança

## 5. Ativar Patrocínio no Nó {#_5-enable-sponsorship-on-the-node}

O patrocínio de taxas é uma política de nó/tempo de execução. Habilite-o na configuração de taxas Nexus:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` é o ativo de taxa de rede. Para SORA Nexus, isso é XOR. Use o alias ativo XOR ou o ID de definição de ativo canônico XOR exposto pela sua rede.

`sponsor_max_fee = "0"` significa que não há limite do patrocinador por transação. Em produção, defina um limite diferente de zero depois de conhecer o tamanho normal e o perfil de gas das transações do espaço de dados.

Reinicie ou aplique esta configuração através do seu processo normal de operação.

## 6. Criar e Financiar o Patrocinador {#_6-create-and-fund-the-sponsor}

Gere um par de chaves de patrocinador se necessário:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Converta a chave pública para o formato de conta da sua rede:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Registre a conta do patrocinador através do seu fluxo de integração privado:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Financie o patrocinador com XOR de um tesouro, conta de reivindicação ou outra conta financiada:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Para os ensaios na Taira, salve o auxiliar de [Obter XOR de teste na Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py` e financie o patrocinador pelo dispensador público, em vez de fazer uma transferência do tesouro:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Verifique o saldo do patrocinador XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Conceder Acesso de um Usuário ao Patrocinador {#_7-grant-a-user-access-to-the-sponsor}

O patrocinador deve conceder a cada usuário permissão para cobrar taxas dele. A concessão é o que impede os usuários de nomearem contas de patrocinador arbitrárias.

Execute isso como a conta patrocinadora, ou como uma conta operacional permitida pela política de tempo de execução do seu software:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Para serviços de integração, faça disso uma etapa normal de provisionamento de conta e registre:

- conta de usuário
- conta patrocinadora
- espaço de dados ou aplicativo
- ticket de aprovação ou decisão de governança

Para inspecionar as permissões de um usuário:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Anexar Metadados do Patrocinador {#_8-attach-sponsor-metadata}

Crie um arquivo de metadados reutilizável:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Qualquer escrita enviada com esses metadados será cobrada ao patrocinador:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Para SDKs, anexe o mesmo objeto de metadados da transação à transação assinada. O usuário assina a transação com a chave do usuário. O patrocinador não assina cada transação do usuário porque a concessão anterior `CanUseFeeSponsor` é a autorização.

## Padrão 1: Usuários Não Pagam Taxas {#pattern-1-users-pay-no-fees}

Use isto quando o aplicativo ou operador absorver todas as taxas de rede.

Lista de verificação do desenvolvedor:

1. Mantenha a carga útil normal de transação do usuário inalterada.
2. Adicionar metadados da transação com `fee_sponsor`.
3. Assine como o usuário.
4. Envie através da rota de espaço de dados privada.

A conta do usuário não precisa de saldo XOR. A conta patrocinadora deve manter saldo suficiente de XOR para cobrir as taxas configuradas de Nexus.

## Padrão 2: Usuários Pagam com um Token Local {#pattern-2-users-pay-a-local-token}

Use isto quando os usuários não devem manter XOR, mas o espaço de dados ainda deseja uma taxa de aplicativo interna, gasto de crédito ou token de cota.

Neste padrão, o token local é um pagamento de aplicativo. Ele não é o ativo da taxa de rede. O patrocinador ainda paga a taxa de rede em XOR.

Por exemplo, use um token local no espaço de dados privado:

```text
usage#billing.team
```

Financie os usuários com `usage#billing.team` durante o onboarding, renovação de assinatura ou alocação de cota. Em seguida, torne a transação do usuário atômica:

1. transferir tokens locais do usuário para o patrocinador
2. executar a operação de aplicativo solicitada
3. incluir metadados `fee_sponsor` para que o patrocinador pague XOR

Um teste de fumaça mínimo CLI é apenas a transferência de token local patrocinada por XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Para um aplicativo real, não envie o pagamento com token local como uma transação separada de melhor esforço. Construa uma única transação assinada contendo tanto o pagamento quanto a instrução comercial, ou exponha um ponto de entrada de contrato que colete o token local antes de aplicar a operação comercial.

Mantenha a política de conversão no seu aplicativo ou contrato:

- qual operação custa quantas unidades de token local
- como o fluxo de tokens local se relaciona com os recarregamentos do patrocinador XOR
- o que acontece quando o saldo do usuário está muito baixo
- o que acontece quando o saldo do patrocinador XOR está muito baixo

::: warning

Não use `gas_asset_id` no padrão de "taxa em token local", a menos que queira cobrar do patrocinador também esse ativo de gas. No ambiente de execução atual, `fee_sponsor` também torna o patrocinador responsável pelos débitos configurados do ativo de gas do pipeline. Para cobrar as taxas do usuário em token local, recolha o token explicitamente com uma transferência ou regra de contrato.

:::

## Falha na Depuração de Transações Patrocinadas {#debug-failed-sponsored-transactions}

Motivos comuns de rejeição geralmente apontam para uma etapa de configuração ausente:

| Texto de erro |O que verificar|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` ainda está `false` no nó. |
| `fee sponsor is not authorized` |O usuário não possui `CanUseFeeSponsor` para este patrocinador.|
| `fee asset ... is missing` |O patrocinador não possui o ativo de taxa configurado XOR.|
| `fee balance ... is insufficient` |Recarregue o saldo do patrocinador XOR.|
| `fee exceeds sponsor_max_fee` |Aumente `sponsor_max_fee` ou reduza o tamanho/gás da transação.|
| `invalid nexus fee asset id` |Corrija `nexus.fees.fee_asset_id` ou o alias do ativo XOR.|

Ao depurar o padrão 2, verifique ambos os saldos:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Operar o Patrocinador {#operate-the-sponsor}

Trate o patrocinador como uma conta do tesouro:

- mantenha chaves de patrocinador separadas para testnet, staging e mainnet
- alertar antes que o saldo do patrocinador XOR atinja o limite mínimo de admissão
- defina um limite `sponsor_max_fee` diferente de zero uma vez que o tráfego seja caracterizado
- limite a taxa de gravações patrocinadas em sua aplicação ou gateway
- revogar `CanUseFeeSponsor` quando os usuários saírem do espaço de dados
- reconciliar hashes das transações dos usuários, pagamentos com tokens locais e débitos de XOR do patrocinador

Revogar patrocínio de um usuário:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Páginas Relacionadas {#related-pages}

- [Conectar-se aos Dataspaces SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md)
- [Operar Iroha 3 via CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Ativos](/pt/blockchain/assets.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Tokens de Permissão](/pt/reference/permissions.md)
