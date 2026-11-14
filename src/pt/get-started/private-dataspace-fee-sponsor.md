---
translation_locale: pt
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 79410ebb9d0a18072d5ae2288348082390b622ed81225de79dcbd4000e268e51
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Patrocinar taxas de um espaço de dados privado {#sponsor-fees-for-a-private-data-space}

Um programa de patrocínio de taxas do SORA Nexus pode pagar as taxas de execução global das transações elegíveis roteadas para um espaço de dados privado. O usuário continua assinando a transação completa. Seu `FeePaymentIntent` tipado seleciona um programa de patrocínio exato e uma revisão imutável, um limite de gas quando exigido e os valores máximos de cobrança.

Uma entrada no catálogo de espaços de dados não cria uma raiz com assinatura independente. Uma raiz independente de espaço de dados tem sua própria moeda de taxas e política confirmadas; os cofres públicos de patrocínio não podem autorizar as taxas dessa raiz privada. Estabeleça a raiz de execução antes de projetar o patrocínio.

## 1. Estabelecer a política de taxas confirmada {#_1-establish-the-committed-fee-policy}

A gênese assinada define um parâmetro personalizado `root_fees_v1` que contém a `RootFeePolicy`. Ele vincula a moeda de taxas, o destino das taxas, a conta de custódia do patrocinador, as isenções de solicitações e as tarifas. Cada bloco comum e cada cotação usam a política confirmada capturada para eles. Atualizações autorizadas da política passam a valer a partir do próximo bloco.

Na execução global, a taxa nativa queima a moeda XOR exata da rede assinada. O cofre do programa de patrocínio fornece essa moeda. As configurações do nó e os metadados da transação não selecionam um pagador nem ativam o patrocínio.

Use as identidades canônicas de moeda e de conta da rede. A resolução de aliases não deve redirecionar as identidades confirmadas da moeda, da custódia ou do destino das taxas.

## 2. Criar e Financiar um Programa de Patrocínio {#_2-create-and-fund-a-sponsor-program}

O ID do programa tem a forma `<canonical-sponsor-account>/<program-name>`. Provisione-o por meio das instruções tipadas expostas pelo SDK e pelo modelo de dados atuais:

|Instrução|Propósito|
| --- | --- |
| `CreateFeeSponsorProgram` | Criar o programa em preparação com sua conta de pagamento obrigatória. |
| `StageFeeSponsorProgramRevision` | Definir uma política imutável de elegibilidade, operações e orçamento. |
| `EnrollFeeSponsorBeneficiary` |Registrar um beneficiário elegível na blockchain.|
| `FundFeeSponsorProgram` | Transferir ativos para a custódia e creditar o cofre exato do programa. |
| `ActivateFeeSponsorProgramRevision` | Agendar a altura mínima de ativação da revisão em preparação. |

O patrocinador ou um gestor delegado específico autoriza a administração do programa. Saques exigem o próprio patrocinador e devolvem os fundos somente à conta de pagamento registrada do programa, enquanto ele estiver pausado ou em encerramento.

Cada revisão especifica:

- inscrição explícita, ou inscrição somada à elegibilidade permitida por padrão de rota;
- regras de permissão e negação sobre IDs exatos de instruções nativas na codificação de transmissão ou sobre endereços de contratos, hashes de código e pontos de entrada;
- limites por ativo para transação, bloco, época do programa e época do beneficiário;
- um piso de reserva e uma duração determinística de época.

Uma regra de negação prevalece sobre uma regra de permissão. O `fee_sponsor_program_id` de um espaço de dados concede elegibilidade por padrão de rota somente se a revisão ativa permitir; a transação ainda precisa identificar o programa e a revisão exatos. A ativação pode ser adiada até expirarem as alocações pendentes da revisão anterior.

Os ativos do cofre do patrocinador devem usar a política de saldo `Global`. Financiar apenas a conta comum do patrocinador não financia o cofre isolado do programa, e um programa não pode consumir o saldo de outro programa.

## 3. Cotar, Assinar e Enviar a Transação Exata {#_3-quote-sign-and-submit-the-exact-transaction}

Uma integração SDK executa estas etapas:

1. Construa o `TransactionPayload` sem assinatura, incluindo a autoridade, o executável, os carimbos de tempo, o nonce, os metadados, a revisão exata do programa de patrocínio e qualquer limite de gas exigido. Os valores máximos de cobrança podem ficar vazios inicialmente.
2. Assine com a conta a requisição `POST /v1/fees/quote` com `{"payload": <payload>}`. O signatário da requisição deve ser a autoridade da transação.
3. Inspecione a altura observada, a rota de espaço de dados resolvida, os componentes da taxa, a origem do débito e a capacidade do patrocinador. Verifique se a resposta preserva o pagador, a revisão e o limite de gas selecionados.
4. Substitua somente `payload.fee_payment` pela intenção recomendada; depois, assine e envie essa carga útil exata.
5. Acompanhe a transação até a finalização `Applied` resolvida pelo estado e guarde seu recibo, incluindo o programa de patrocínio, a revisão e a cobrança efetivamente usados.

Uma cotação observa o livro-razão; ela não reserva capacidade. A admissão na fila verifica novamente a elegibilidade e reserva os valores máximos assinados. Uma recusa do patrocinador rejeita a transação sem recorrer à cobrança do usuário.

A CLI identifica explicitamente a mesma origem das taxas. Por exemplo, depois que o programa permitir esta transferência exata de ativo e a conta estiver elegível:

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

Use a revisão ativa e os identificadores exatos da sua rede. A configuração do usuário contém apenas seu próprio signatário; a chave privada do patrocinador não é necessária para enviar uma transação patrocinada elegível.

## 4. Decidir se o usuário paga uma taxa do aplicativo {#_4-decide-whether-the-user-pays-an-application-fee}

Um patrocinador pode cobrir as taxas globais enquanto o aplicativo não cobra nada do usuário. Se o aplicativo cobrar um token local, defina essa transferência ou regra de contrato explicitamente no executável assinado pelo usuário. Inclua todas as operações na política da revisão do patrocinador e inspecione a cotação da carga útil completa. Não deduza uma transferência de token do aplicativo a partir da intenção de pagamento da taxa de rede.

## Diagnosticar uma Recusa {#diagnose-a-refusal}

Use o código estável da taxa e as instruções de correção retornados pelo nó:

|Código|Verificar|
| --- | --- |
| `program_not_found` | Identidade canônica exata do programa. |
| `revision_not_active`, `program_not_active` |Ativação de revisão e ciclo de vida do programa.|
| `beneficiary_not_eligible` | Inscrição ou elegibilidade permitida por padrão de rota. |
| `operation_not_allowed`, `operation_denied` |Toda operação exata assinada e regra de negação.|
| `invalid_gas_limit`, `signed_limit_exceeded` | Limite de gas e valores máximos assinados, comparados com uma nova cotação. |
| `vault_insufficient` | Saldo financiado do cofre da moeda exata deste programa. |
|Códigos de esgotamento de orçamento|Capacidade de transação, bloco, época do programa e época do beneficiário.|

Guarde o hash da transação original e os detalhes da rejeição de taxas ao investigar um envio de resultado ambíguo. Confirme o status antes de criar uma transação substituta.

## Fontes Fixadas {#pinned-sources}

- [Política de taxas, ciclo de vida do programa e protocolo de cotação](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [Instruções tipadas do programa de patrocínio](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [Flags da CLI para a origem das taxas e transferência de ativos](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [Configuração do espaço de dados](/pt/get-started/sora-nexus-dataspaces.md)
