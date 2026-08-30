---
translation_locale: pt
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarifas de patrocínio para um espaço privado de dados {#sponsor-fees-for-a-private-dataspace}

O patrocínio de taxas permite que os usuários enviem transações no espaço de dados privado sem manter XOR. O usuário ainda assina a transação. Os metadados da transação apontam para uma conta do patrocinador, e o runtime débite o saldo do patrocinado XOR pela taxa da rede.

A integração compõe-se de três partes móveis:

1. O nó permite o patrocínio de taxas
2. a conta do patrocinador existe e possui XOR
3. Cada utilizador tem `CanUseFeeSponsor` para esse patrocinador.

Depois disso, cada transação de usuário patrocinado só precisa dos metadados:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Esta página mostra dois padrões comuns:

- O usuário livre escreve: o patrocinador paga XOR e o usuário não paga nada.
- Taxas de tokens locais: o utilizador paga ao patrocinador em token de aplicativo e o patrocinador paga à rede em XOR.

Usar Taira ou uma rede de teste privada primeiro. Um novo espaço de dados privado é um operador e mudança de governança; não é criado por configuração do cliente.

## Valores de exemplo {#example-values}

Os comandos a seguir utilizam estes posicionadores:

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

Use a conta canônica I105 IDs, a menos que a sua implantação tenha pseudónimos de conta ativa para as mesmas contas.

## 1. Preparar o espaço de dados {#_1-prepare-the-dataspace}

Comece com o catálogo do espaço de dados privado e o trabalho de roteamento descrito em [Conect to SORA Nexus Dataspaces](/pt/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Um fragmento orientado para o operador parece assim:

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

Antes de passar para as transacções do utilizador, verifique se:

- A faixa privada aparece na resposta do nó `/status`
- As contas de usuários são admitidas pelo seu fluxo privado de onboarding
- existe a conta do patrocinador
- O activo de taxa XOR e a conta de depósito de taxas são válidos na rede.

## 2. Registrar ativos no espaço de dados {#_2-register-assets-in-the-dataspace}

Registre as definições de ativos que os usuários manterão dentro do espaço de dados privado antes de enviá-las para a lógica da aplicação. Para o padrão de taxa local, o tutorial usa `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Primeiro configure o domínio e SNS arrendamento que possuem o espaço de nomes do ativo. Crie uma intenção livre de segredos `AliasSetupPlanRequestV1` para `$BILLING_DOMAIN`, incluindo o espaço de dados `team` numérico ID, proprietário canônico, prazo de arrendamento e guardador de citações atuais:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

O `--id` canônico é a definição de ativo de nível de rede ID. O alias é o que os desenvolvedores e os usuários finais devem usar no código do espaço de dados:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

A moeda ou transferir o token local para um usuário durante a onboarding:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Verificar o saldo do utilizador:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Use o mesmo padrão para ativos de aplicativos no espaço de dados. Registre uma definição de ativo por token, dê a cada um um um alias de espaço de dados e faça referência ao alias do código SDK em vez da definição canônica de ativo IDs com codificação dura.

## 3. Registrar os pseudónimos de utilizador {#_3-register-user-aliases}

As contas ainda são canônicas I105 conta IDs. Os nomes de usuários são pseudónimos de conta, e os pseudônimos devem ser manuais não sensíveis como `alice@team` ou `alice@members.team`. Não use números de telefone ou endereços de e-mail como pseudônimos.

A configuração do alias usa o mesmo planejador declarativo que a configuração de domínio. Faça com que o SDK ou serviço de onboarding criem uma intenção livre de segredos `AliasSetupPlanRequestV1` cujas metas de entrada do alias da conta `$USER`, selecione o papel primário, pinhe o espaço de dados numérico ID e carregue o guardador atual de citações de arrendamento. Então planeie e aplique-a como uma transação atômica:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Se o utilizador não pagar XOR, utilize o serviço de embarque aprovado e consciente do patrocinador para construir e enviar a instalação Transacção. Não dividir a aquisição de arrendamento e os alias vinculativos em operações de aplicação independentes.

Após a ligação do alias, verifique-o com o CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Para a criação de uma nova conta, prefira um serviço de onboarding que construa `NewAccount` com um estável `uaid` e, se necessário, um inicial `label`. O comando simples `ledger account register --id` apenas registra a conta canônica ID.

## 4. Registar telefone e e-mail em privado com FHE {#_4-register-phone-and-email-privately-with-fhe}

Use números de telefone e endereços de e-mail como reivindicações de identificadores privados, não pseudônimos públicos. O fluxo apoiado por FHE mantém os identificadores brutos fora dos pseudônimos da conta, dos metadados das transações e do estado mundial:

1. O operador registra uma política de programa [RAM-LFE/FHE ](/pt/blockchain/ram-lfe.md) para telefone e correio electrónico
2. O operador registra políticas de identificação ativa, tais como `phone#team` e `email#team`
3. A carteira normaliza o telefone ou e-mail localmente
4. A carteira envia o valor criptografado para o resolutor
5. O resolvedor retorna um `IdentifierResolutionReceipt`
6. O utilizador apresenta `ClaimIdentifier` juntamente com o recibo.
7. A cadeia armazena um hash opaco de identificação e recibo, não o valor do telefone bruto ou do email

A configuração da política do operador é uma tarefa de SDK ou serviço. Construir e apresentar os seguintes pares de instruções para cada tipo de identificador:

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

Repita para o e-mail com:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Durante o onboarding, a carteira ou backend devem normalizar-se localmente:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Após o arquivo de metadados do patrocinador ser criado na etapa 8, apresentar uma instrução de reivindicação assinada pelo usuário com esses metadados:

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

A corrente CLI não expõe comandos digitalizados para estas instruções de identidade. Gerar valores serializados `InstructionBox` com a SDK e enviá-los através da `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Mantenha estes barris no serviço de embarque:

- Os pseudónimos das contas são apenas manuais legíveis por humanos.
- valores de telefone bruto e email nunca aparecem em alias, metadados, registros ou cargas úteis de transações
- A conta tem um `uaid` antes de reclamar identificadores privados.
- Receitas vinculadas `policy_id`, `opaque_id`, `uaid` e `account_id` e expiração
- as chaves de resolução e os compromissos ocultos dos programas são controlados pela governança

## 5. Habilitar o patrocínio no nó {#_5-enable-sponsorship-on-the-node}

O patrocínio por taxa é uma política de ponto/tempo de execução. Nexus Configuração de taxas:

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

`fee_asset_id` é o ativo da taxa de rede. Para SORA Nexus este é XOR. Use o alias ativo XOR ou a definição canônica de ativo XOR ID exposta pela sua rede.

`sponsor_max_fee = "0"` significa que não há limite de patrocinador por transacção. Para produção, defina um limite não zero depois de conhecer o tamanho normal e o perfil de gás das suas transações do espaço de dados.

Reinicie ou rode esta configuração através do seu processo normal de operador.

## 6. Criar e financiar o patrocinador {#_6-create-and-fund-the-sponsor}

Gerar um par de chaves do patrocinador, se necessário:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Converte a chave pública no formato da conta para a sua rede:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Registre a conta do patrocinador através do seu fluxo privado de onboarding:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Financiar o patrocinador com XOR a partir de uma conta do tesouro, da conta de crédito ou de outra conta financiada:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Para os ensaios Taira, salve o auxiliar da torneira a partir de [Obter Testnet XOR em Taira](/pt/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, e então financiar o patrocinador com a torneira pública em vez de uma transferência do tesouro:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Verificar o saldo do patrocinador XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Dar acesso a um usuário ao patrocinador {#_7-grant-a-user-access-to-the-sponsor}

O patrocinador deve conceder a cada utilizador permissão para cobrar taxas, o que impede os utilizadores de nomear contas arbitrárias do patrocinador.

Executa isto como a conta do patrocinador, ou como uma conta operacional permitida pela sua política de tempo de execução:

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

Para os serviços de embarque, faça disso um passo normal de fornecimento da conta e registar:

- Conta de utilizador
- Conta do patrocinador
- Espaço de dados ou aplicação
- bilhete de aprovação ou decisão de governança

Para inspecionar os subsídios de um utilizador:

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

Qualquer inscrição apresentada com estes metadados é cobrada ao patrocinador:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Para SDKs, anexe o mesmo objeto de metadados da transação à transação assinada. O usuário assina a transação com a chave do usuário. O patrocinador não assina todas as transações do usuário porque a concessão anterior `CanUseFeeSponsor` é a autorização.

## Modelo 1: Os utilizadores pagam sem taxas {#pattern-1-users-pay-no-fees}

Utilizá-lo quando o aplicativo ou operador absorver todas as taxas de rede.

Lista de verificação dos desenvolvedores:

1. Mantenha inalterada a carga útil normal das transações do utilizador.
2. Adicionar os metadados de transação com `fee_sponsor`.
3. Assine como usuário.
4. Enviar através da rota do espaço de dados privado.

A conta de utilizador não precisa de um saldo XOR; a conta do patrocinador deve manter o suficiente XOR para cobrir as taxas configuradas Nexus.

## Modelo 2: Os usuários pagam um token local {#pattern-2-users-pay-a-local-token}

Use isso quando os usuários não devem ter XOR, mas o espaço de dados ainda quer uma taxa interna do aplicativo, gastos de crédito ou token de quota.

Neste padrão, o token local é um pagamento de aplicativo. Não é o activo da taxa de rede. O patrocinador ainda paga a taxa de rede em XOR.

Por exemplo, use um token local no espaço de dados privado:

```text
usage#billing.team
```

Os utilizadores de fundos com `usage#billing.team` durante a incorporação, renovação da assinatura ou atribuição de quotas.

1. Transferência de tokens locais do utilizador para o patrocinador
2. Realizar a operação da aplicação solicitada
3. incluir metadados `fee_sponsor` para que o patrocinador pague XOR;

Uma prova mínima de fumo CLI é apenas a transferência local-token patrocinada por XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Para um aplicativo real, não envie o pagamento com token local como uma transação separada de melhor esforço. Construa uma transação assinada contendo tanto o pagamento quanto as instruções de negócio, ou expõe um ponto de entrada do contrato que coleta o token local antes de aplicar a operação comercial.

Mantenha a política de conversão no seu aplicativo ou contrato:

- que operação custa quantas unidades de tokens locais
- como os mapas de entrada de tokens locais para patrocinar XOR top-ups
- O que acontece quando o equilíbrio do usuário é muito baixo
- O que acontece quando o saldo do patrocinador XOR é muito baixo

::: warning

Não utilize `gas_asset_id` para o padrão de "taxa local-token", a menos que você queira que o patrocinador também seja cobrado nesse ativo de gás. No tempo de execução atual, `fee_sponsor` também faz do patrocinador o pagador dos débitos configurados em activos de gasodutos. Para as taxas de utilizador de tokens locais, recolha o token explicitamente com uma regra de transferência ou contrato.

:::

## Debug de transações patrocinadas falhadas {#debug-failed-sponsored-transactions}

As razões comuns de rejeição geralmente apontam para uma etapa de configuração ausente:

|Texto de erro |O que verificar ?|
| --- | --- |
|`fee sponsorship is disabled` |O `nexus.fees.sponsorship_enabled` ainda está no `false`. |
|`fee sponsor is not authorized` |O utilizador não dispõe de `CanUseFeeSponsor` para este patrocinador. |
|`fee asset ... is missing` |O patrocinador não detém o ativo de taxas XOR configurado. |
|`fee balance ... is insufficient` | Aponte o patrocinador. XOR equilíbrio. |
|`fee exceeds sponsor_max_fee` |Aumentar `sponsor_max_fee` ou reduzir o tamanho/gás da transacção. |
|`invalid nexus fee asset id` |Fix `nexus.fees.fee_asset_id` ou o alias de ativo XOR. |

Ao depurar o padrão 2, verifique ambos os equilíbrios:

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

## Otimizar o Patrocinador {#operate-the-sponsor}

Tratar o patrocinador como uma conta do tesouro:

- manter chaves de patrocínio separadas para testnet, stage e mainnet;
- Alerta antes que o saldo do patrocinador XOR atinja o nível de admissão
- Estabelecer um limite não-zero `sponsor_max_fee` uma vez que o tráfego é caracterizado
- taxa-limite patrocinado escreve no seu pedido ou gateway
- Revocar `CanUseFeeSponsor` quando os utilizadores deixarem o espaço de dados
- reconciliar hashes de transações de usuários, pagamentos com tokens locais e débitos do patrocinador XOR

Revocar o patrocínio para um utilizador:

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

## Páginas relacionadas {#related-pages}

- [Conectar-se a SORA Nexus Centros de dados](/pt/get-started/sora-nexus-dataspaces.md)
- [Operar Iroha 3 através de CLI](/pt/get-started/operate-iroha-via-cli.md)
- [Ativos](/pt/blockchain/assets.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Tokens de autorização ](/pt/reference/permissions.md)
