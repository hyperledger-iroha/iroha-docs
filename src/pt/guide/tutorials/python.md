---
translation_locale: pt
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

O Python SDK no espaço de trabalho upstream é `iroha-python`. O primeiro lançamento de Iroha 3 tem como alvo as superfícies atuais Torii e Norito. Fixe a versão do pacote ou a revisão da fonte usada pela sua integração para que o SDK e o nó permaneçam na mesma revisão de formato de serialização.

Os exemplos de leitura anônima abaixo usam a Taira pública em `https://taira.sora.org`. Uma rota pode ser somente leitura e, ainda assim, exigir uma assinatura de conta canônica ou uma assinatura exata do operador da rede; esses exemplos são marcados separadamente. Os exemplos que alteram o estado são modelos de transação e exigem uma autoridade real da Taira, uma chave privada, uma intenção tipada de pagamento de taxa, saldo suficiente de XOR da testnet e a autenticação exigida pela rota de destino antes do envio.

Use os exemplos nesta ordem:

|Palco|Concorrer contra o público Taira?            |O que você precisa|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Chamadas de leitura anônimas|Sim|Python pacote mais acesso à rede|
|Leituras autenticadas por conta ou operador|Apenas com sua própria identidade admitida|Exato Taira `NetworkId` e a conta correspondente ou chave do operador|
|Construtores locais de assinatura e instruções|Nenhuma chamada de rede até `submit()`|Extensão nativa e seu material de chave|
|Transações de mutação e chamadas de serviço|Apenas com sua própria conta financiada|conta principal de autorização, chave privada, exato Taira `NetworkId`, intenção de taxa digitada, saldo do ativo de taxa e tokens de rota|
|Conectar codecs de quadros, criptografia e auxiliares GPU|Apenas local|Extensão nativa; os auxiliares GPU também precisam de um backend capaz de CUDA|

## Instalar {#install}

O nome dos metadados do pacote é `iroha-python`. Não presuma que uma instalação não fixada de PyPI corresponda à rede ativa Taira. Instale uma cópia funcional em wheel ou do código-fonte que tenha sido construída a partir da mesma revisão upstream que seus alvos de integração:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Se o projeto usar diretamente o espaço de trabalho de origem, instale as dependências de Python e compile a extensão nativa antes de executar exemplos que usem `Instruction`, `TransactionDraft`, assinatura, criptografia, auxiliares nativos do SoraFS, auxiliares de GPU ou codecs de quadros do Connect. Use o comando de compilação descrito no `python/iroha_python/README.md` de origem e verifique se as exportações nativas são carregadas:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Se `create_torii_client` for importado, mas `Instruction` ou `generate_ed25519_keypair` falhar, o pacote puro Python está disponível, mas a extensão nativa não está.

## Início Rápido {#quickstart}

Comece com endpoints públicos e somente leitura Taira API:

```python
from iroha_python import (
    create_torii_client,
)

client = create_torii_client("https://taira.sora.org")

# Public reads do not need an authority or private key.
status = client.request_json("GET", "/status", expected_status=(200,))
accounts = client.list_accounts_typed(limit=5)

print(status["build"]["version"])
for account in accounts.items:
    print(account.id)
```

## Configuração Compartilhada {#shared-setup}

Use esta configuração para os modelos mutantes. Substitua cada espaço reservado por um principal de autorização Taira, chave privada, token e IDs de ativos/contas do seu ambiente antes de enviar.

`authority` é a conta que assina a transação e `private_key` deve corresponder a ela. As transações se vinculam ao `NetworkId` derivado do gênesis exato de Taira; a cadeia UUID é um rótulo de implantação, não uma identidade de transação. As taxas usam uma intenção de pagamento digitada e uma cotação ao vivo exata, independentemente dos metadados do aplicativo. Os espaços reservados para conta e chave abaixo são intencionalmente inválidos para que não sejam enviados por engano.

O literal abaixo é a identidade gênesis atual fixada na blockchain Taira. Um reset da testnet pode alterá-la, portanto, atualize-a a partir do perfil de implantação assinado e nunca a deduza a partir da cadeia UUID.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    LocalSigningContext,
    NetworkId,
    ToriiClient,
    ToriiCanonicalRequestAuth,
    TransactionConfig,
    TransactionDraft,
    authority_fee_payment,
)

TORII_URL = "https://taira.sora.org"
TAIRA_NETWORK_ID = NetworkId.parse(
    "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
)
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=alice,
    signer=alice_pair.sign,
)

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

APP_METADATA = {"source": "python-docs"}
# Torii replaces the empty maxima with an exact, validated live fee quote before
# anything is signed. The payer remains the transaction authority.
BASE_FEE_PAYMENT = authority_fee_payment(charge_limits=[])

client = ToriiClient(
    TORII_URL,
    local_signing_context=LocalSigningContext(TAIRA_NETWORK_ID),
    canonical_request_auth=canonical_auth,
    auth_token=AUTH_TOKEN,
)


def submit(*instructions):
    draft = TransactionDraft(
        TransactionConfig(
            network_id=TAIRA_NETWORK_ID,
            authority=alice,
            fee_payment=BASE_FEE_PAYMENT,
            metadata=APP_METADATA,
        )
    )
    draft.extend_instructions(instructions)

    # Freeze one payload, obtain its exact fee limits, and sign that same payload.
    envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
    status = client.submit_transaction_envelope_and_wait(envelope)
    return envelope, fee_quote, status
```

`Instruction.*` chama apenas cargas úteis de instrução de construção. `submit()` é o ponto onde o SDK obtém a estimativa de preço da taxa ao vivo, assina a carga útil exatamente cotada, envia para Torii e aguarda um status.

## Taxas e custo de execução de transação {#fees-and-gas}

As transações de escrita precisam de um `FeePaymentIntent` digitado e de um saldo de ativo de taxa financiado. Em Taira, o serviço público de financiamento da testnet financia a testnet XOR. O Python SDK envia o valor fixo não assinado carga útil para Torii para uma estimativa de preço de taxa exata, valida que a cotação não substituiu o pagador ou a carga útil, e assina a intenção cotada. Não coloque a seleção de taxa nos metadados da transação.

O ajudante `submit()` acima começa com uma intenção paga pela autoridade cujos limites de cobrança estão intencionalmente vazios. `quote_and_sign()` os preenche a partir da cotação ao vivo antes de assinar:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=authority_fee_payment(charge_limits=[]),
        metadata={"source": "python-fee-example"},
    )
)
draft.add_instruction(
    Instruction.set_account_key_value(
        alice,
        "python_fee_example",
        "ready",
    )
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
status = client.submit_transaction_envelope_and_wait(envelope)

for limit in fee_quote["intent"]["value"]["charge_limits"]:
    print(limit["asset_definition_id"], limit["max_amount"])
```

Antes de enviar gravações, certifique-se de que a conta principal de autorização possui ativos suficientes para a taxa. O serviço de financiamento de testnet exato e o ID do ativo são específicos da rede; este é o formato Taira:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

O serviço de financiamento da testnet retorna o `asset_id` concreto para usar na verificação do saldo. Verifique se a cotação ativa cobra `FEE_ASSET_DEFINITION`; a transação não seleciona esse ativo através dos metadados.

Os metadados do aplicativo são opcionais e não têm semântica de taxa:

```python
APP_METADATA = {"source": "python-docs"}

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
```

Se você omitir a intenção de taxa, aceitar uma cotação para um ativo inesperado, alterar o payload após a cotação ou assinar com uma conta sem fundos, a transação não deve ser enviada.

## Anônimo Taira Lê {#anonymous-taira-reads}

Essas chamadas usam rotas Taira cujo limite do catálogo permite leituras anônimas:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.list_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_cadence_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms)
```

`/v1/time/status` e cada visualização de dados pontual do operador `/v1/sumeragi/*` requer uma assinatura de operador de rede exata, mesmo que não modifiquem o estado. Use `request_json("GET", "/status")` para o nó anônimo carga de status e a configuração do operador abaixo para diagnóstico de consenso ou relógio local do nó. O status da sessão de conexão é uma rota de protocolo separada e requer o token de gerenciamento dessa sessão.

## Construtores de Instruções {#instruction-builders}

O SDK expõe construtores tipados para as famílias de instruções mais comuns e um JSON caminho de escape para variantes que ainda não são métodos Python de primeira classe. Os trechos a seguir são templates de transação mutáveis e não foram enviados para o Taira público sem uma conta de assinatura.

Prefira auxiliares tipados quando eles existirem: eles normalizam valores Python e falham rapidamente em formas inválidas. Use `Instruction.from_json` apenas quando você precisar de uma variante de instrução que ainda não tenha um auxiliar Python.

|Família de instruções| Python superfície|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Registrar| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` é reservado para ferramentas de gênese/bootstrap |
|Cancelar registro| `unregister_trigger`; use `Instruction.from_json` para outras variantes |
| Cunhar/Queimar | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Transferir| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|Metadados e controles| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA ciclo de vida| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
|Extensões de recompra/liquidação| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`|
|Bloqueios de ativos nativos|`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, mais os auxiliares do cliente `*_and_wait`|
|Conceder/Revogar, SetParameter, Log, Personalizado, Atualizar, e variantes menos comuns de registrar/cancelar registro| `Instruction.from_json` ou `TransactionBuilder.add_instruction_json` com canônico `InstructionBox` JSON|

Para pagamentos condicionais no estilo escrow, veja [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#python-asset-locks). Python atualmente expõe auxiliares de primeira classe para bloqueios genéricos de ativos; auxiliares de marketplace e escrow anônimo ainda não são métodos de primeira classe Python.

### Configure Domínios, Depois Registre Contas e Ativos {#set-up-domains-then-register-accounts-and-assets}

A criação de domínio comum passa pelo planejador de alias declarativo, de modo que o contrato de arrendamento SNS, as capacidades do proprietário, a proteção de cota e o estado do domínio são verificados juntos. Crie uma intenção `AliasSetupPlanRequestV1` sem segredo com seu SDK ou serviço de integração, depois use `iroha app alias setup plan` e `iroha app alias setup apply`. Não envie `Instruction.register_domain` a partir de uma transação de aplicativo; esse construtor permanece para ferramentas de gênese/bootstrap.

Após o plano de configuração do domínio ser confirmado, registre os objetos pertencentes ao domínio. Em uma rede compartilhada, como Taira, use um domínio e um espaço de nomes de conta atribuídos a você.

```python
# The domain and its SNS lease already exist before this transaction.
submit(
    Instruction.register_account(alice, {"display_name": "Alice"}),
    Instruction.register_account(bob, {"display_name": "Bob"}),
    Instruction.register_asset_definition_numeric(
        ROSE_DEFINITION,
        owner=alice,
        scale=2,
        mintable="Infinitely",
        confidential_policy="TransparentOnly",
        metadata={"symbol": "ROS"},
    ),
)
```

`mintable` aceita valores `Infinitely`, `Once`, `Not` ou `Limited(n)` aceitos pelo modelo de dados. Omitir `scale` para um ativo numérico sem restrições.

### emitir, Queimar e Transferir Ativos {#mint-burn-and-transfer-assets}

Essas chamadas usam um ID de ativo existente. Primeiro registre a definição do ativo e, em seguida, crie o ID de ativo concreto para a conta que possui o ativo.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Transferir Propriedade {#transfer-ownership}

As transferências de propriedade mudam quem controla o domínio, a definição do ativo ou NFT. Use o proprietário atual como o principal de autorização da transação.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Definir e Remover Metadados {#set-and-remove-metadata}

Os valores de metadados devem ser serializáveis ​​JSON. Quando você usa `TransactionDraft`, o principal de autorização em `TransactionConfig` se torna a conta-alvo padrão.

```python
# Values are encoded as JSON metadata under the target account.
submit(
    Instruction.set_account_key_value(
        alice,
        "profile",
        {"display_name": "Alice", "tier": "operator"},
    )
)

# Removing the key deletes the metadata entry from the account.
submit(Instruction.remove_account_key_value(alice, "profile"))
```

O assistente de rascunho de alto nível aponta para o principal de autorização de transação por padrão:

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Ativos do Mundo Real {#real-world-assets}

RWA auxiliares usam cargas úteis serializáveis JSON para metadados específicos de ativos, proveniência e política do controlador. `register_rwa` não aceita um `id` ou `owner`: o tempo de execução do software gera o `RwaId`, e o principal de autorização da transação se torna o proprietário inicial.

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Register the lot in a domain. Store business identifiers in primary_reference
# or metadata, then query the generated RWA ID after the transaction commits.
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "commodity": "copper",
            "warehouse": "DXB-01",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": True,
            "redeem_enabled": True,
        },
    }
)
```

Após a transação de registro ser confirmada, use `FindRwas`, `/v1/rwas`, um evento RWA ou a rota do explorador definida para descobrir o ID gerado:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Operações subsequentes usam o ID `hash$domain` gerado:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Transfer, hold, release, freeze, and redeem model the lot lifecycle.
draft.transfer_rwa(
    registered_rwa_id,
    quantity="10",
    destination=bob,
)
draft.hold_rwa(registered_rwa_id, quantity="5")
draft.release_rwa(registered_rwa_id, quantity="5")
draft.freeze_rwa(registered_rwa_id)
draft.unfreeze_rwa(registered_rwa_id)
draft.redeem_rwa(registered_rwa_id, quantity="1")

# RWA metadata and controls are separate from account metadata.
draft.set_rwa_key_value(registered_rwa_id, "auditor", "alice")
draft.remove_rwa_key_value(registered_rwa_id, "auditor")
draft.set_rwa_controls(
    registered_rwa_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)

# Merge consumes quantities from parent lots with the same domain and spec. The
# child lot gets a generated ID.
draft.merge_rwas(
    {
        "parents": [
            {"rwa": registered_rwa_id, "quantity": "40"},
            {
                "rwa": "fedcba9876543210fedcba9876543210"
                "fedcba9876543210fedcba9876543210$commodities.universal",
                "quantity": "60",
            },
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {"merge_reason": "same custodian and quality grade"},
    }
)

# Force transfer requires a configured controller and force_transfer_enabled.
draft.force_transfer_rwa(
    registered_rwa_id,
    quantity="1",
    destination=bob,
)
```

Transferências completas podem alterar `owned_by` no lote existente. Transferências parciais e fusões criam lotes-filho gerados.

### Gatilhos {#triggers}

Use os auxiliares de registro de gatilho quando o executável for outra sequência de instruções:

```python
# The trigger executable is just another instruction payload.
reward = Instruction.mint_asset_numeric(ROSE_ASSET, "1")

# Time triggers run on a schedule once registered.
register_hourly = Instruction.register_time_trigger(
    "hourly_reward",
    alice,
    [reward],
    start_ms=1_800_000_000_000,
    period_ms=3_600_000,
    repeats=24,
    metadata={"purpose": "docs"},
)
submit(register_hourly)

# Precommit triggers run during the transaction pipeline.
register_precommit = Instruction.register_precommit_trigger(
    "precommit_reward",
    alice,
    [reward],
    repeats=10,
    metadata={"purpose": "pipeline test"},
)
submit(register_precommit)

# Trigger execution and repetition changes are also transactions.
submit(Instruction.execute_trigger("hourly_reward", args={"reason": "manual"}))
submit(Instruction.mint_trigger_repetitions("hourly_reward", 5))
submit(Instruction.burn_trigger_repetitions("hourly_reward", 1))
submit(Instruction.unregister_trigger("hourly_reward"))
```

Torii também expõe os ajudantes REST para acionar o inventário:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Chamadas de inventário de gatilho apenas lêem ou inspecionam registros de gatilho. Registro, execução, alterações de repetição e cancelamento de registro são operações mutantes.

### Instruções de Recompra e Liquidação {#repo-and-settlement-instructions}

Os assistentes de repositório e de liquidação bilateral acrescentam variantes de instrução específicas do domínio sem criar manualmente os payloads Norito:

```python
from iroha_python import (
    RepoCashLeg,
    RepoCollateralLeg,
    RepoGovernance,
    SettlementAtomicity,
    SettlementExecutionOrder,
    SettlementLeg,
    SettlementPlan,
)

config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=APP_METADATA,
)
draft = TransactionDraft(config)

# Each repo leg describes one side of the financing agreement.
cash = RepoCashLeg(asset_definition_id="usd#wonderland", quantity="1000")
collateral = RepoCollateralLeg(
    asset_definition_id="bond#wonderland",
    quantity="1050",
    metadata={"isin": "ABC123"},
)
governance = RepoGovernance(haircut_bps=1500, margin_frequency_secs=86_400)

# Domain-specific draft methods append the corresponding instructions.
draft.repo_initiate(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    rate_bps=250,
    maturity_timestamp_ms=1_704_000_000_000,
    governance=governance,
)
draft.repo_margin_call("daily_repo")
# Unwind uses the immutable counterparties, legs, and maturity stored on-chain.
draft.repo_unwind("daily_repo")

# DVP/PVP settlement plans encode ordering and atomicity for both legs.
delivery = SettlementLeg(
    asset_definition_id="bond#wonderland",
    quantity="10",
    from_account=alice,
    to_account=bob,
    metadata={"isin": "ABC123"},
)
payment = SettlementLeg(
    asset_definition_id="usd#wonderland",
    quantity="1000",
    from_account=bob,
    to_account=alice,
)
plan = SettlementPlan(
    order=SettlementExecutionOrder.PAYMENT_THEN_DELIVERY,
    atomicity=SettlementAtomicity.ALL_OR_NOTHING,
)

draft.settlement_dvp(
    settlement_id="trade_dvp",
    delivery_leg=delivery,
    payment_leg=payment,
    plan=plan,
    metadata={"desk": "rates"},
)
draft.settlement_pvp(
    settlement_id="trade_pvp",
    primary_leg=payment,
    counter_leg=delivery,
)

envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Escotilha de Emergência {#json-escape-hatch}

Quando não houver um auxiliar de Python, forneça o JSON canônico `InstructionBox` do modelo de dados a `Instruction.from_json`. Esse é o caminho recomendado para `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, registro de par, função ou NFT e variantes de cancelamento de registro sem gatilho, até que esses auxiliares tenham tipos próprios.

```python
from iroha_python import Instruction

# Copy this payload from Rust/CLI tooling or from a pinned data-model schema.
instruction_box_json = """
{
  "<InstructionVariant>": {
    "...": "..."
  }
}
"""

instruction = Instruction.from_json(instruction_box_json)
submit(instruction)
```

Mantenha o caminho do rascunho digitado na fronteira da transação: ele preserva o exato `NetworkId`, a intenção de pagamento de taxas e a invariante de cotação antes da assinatura. O uso direto de `TransactionBuilder` requer os mesmos valores, além da validação explícita de uma cotação ativa, portanto, não é um atalho para o código do aplicativo.

Para instruções geradas ou opacas, faça um ciclo de ida e volta através de JSON antes de armazenar artefatos de teste:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Fluxos de Trabalho de Transação {#transaction-workflows}

Use `TransactionDraft` para aplicativos que constroem múltiplas instruções antes de assinar. Um rascunho permite que você mantenha configurações em nível de transação, como `ttl_ms`, `nonce` e metadados em um só lugar, e então assine uma vez:

```python
config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata=APP_METADATA,
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition(
    ROSE_DEFINITION,
    owning_domain=None,
    balance_scope_policy="Global",
    name="Rose",
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_quantity(ROSE_ASSET, "100")
draft.transfer_asset_quantity(ROSE_ASSET, "25", bob)

# Quoting freezes the draft, validates exact fee limits, and signs that payload.
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Exporte um manifesto técnico determinístico para revisão, auditoria ou transferência de carteira:

```python
import json
from pathlib import Path

# Manifests are review artifacts; they are not submitted by themselves.
manifest = draft.to_manifest_dict(include_creation_time=True)
print(json.dumps(manifest, indent=2))

Path("transaction_manifest.json").write_text(
    draft.to_manifest_json(indent=2, include_creation_time=True),
    encoding="utf-8",
)
```

Anexe uma prova de privacidade da via antes de assinar quando a via de destino a exigir:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_name="lane_privacy_vk",
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
```

## Consultas {#queries}

Os auxiliares de consulta digitada retornam dataclasses em vez de dicionários brutos JSON. Eles são a maneira mais fácil de começar porque o SDK analisa a paginação e os campos comuns de registro para você:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Use os auxiliares de solicitação genéricos quando um endpoint Torii API ainda não tiver um adaptador de software tipado:

```python
from urllib.request import Request, urlopen

# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Prometheus exposition is served at `/metrics` when telemetry is `extended`
# or `full`; it is text, not a `/v1` JSON resource.
request = Request(f"{TORII_URL}/metrics", headers={"Accept": "text/plain"})
with urlopen(request, timeout=5) as response:
    metrics = response.read().decode("utf-8")
```

Os auxiliares de inventário de contas requerem um identificador de conta aceito pelo normalizador do SDK. Use IDs de conta I105 canônicos ou aliases on-chain; se um explorador de blocos ou endpoint bruto API retornar um ID que o SDK rejeita, resolva-o para um ID de conta canônico antes de chamar esses helpers:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Eventos {#events}

Os assistentes de streaming decodificam cargas JSON por padrão. Passe `with_metadata=True` quando precisar do nome do evento SSE, id, dica de retry e carga bruta. O feed canônico `/v1/events/sse` é apenas ao vivo: não emite IDs de replay e não mantém log de replay, portanto, esses assistentes não expõem argumento de cursor ou retomada. Um reconectar inicia uma nova assinatura e pode ter uma lacuna; use `/v1/blocks/stream` a partir de uma altura conhecida quando o histórico completo do livro-razão da blockchain for necessário. Estes exemplos aguardam eventos ao vivo, então execute-os em um nó onde a transmissão esteja habilitada e ativa.

```python
from iroha_python import DataEventFilter, SseStreamError

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

try:
    for event in client.stream_events(filter=proof_filter, with_metadata=True):
        print(event.id, event.event, event.data)
        break
except SseStreamError as error:
    print(error.code, error.dropped_messages, error.replay_available)

for event in client.stream_trigger_events(trigger_id="hourly_reward"):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Chaves e Endereços {#keys-and-addresses}

O SDK expõe auxiliares de assinatura locais para cada algoritmo de assinatura compilado na extensão nativa. Esses auxiliares não chamam Taira, mas eles exigem a extensão nativa:

```python
from iroha_python import (
    ED25519_ALGORITHM,
    derive_confidential_keyset_from_hex,
    derive_keypair_from_seed,
    hash_blake2b_32,
    verify,
)
from iroha_python.address import AccountAddress

# Key derivation and signing are local; no network call is made here.
ed_pair = derive_keypair_from_seed(b"alice", ED25519_ALGORITHM)
signature = ed_pair.sign(b"payload")
assert verify(ED25519_ALGORITHM, ed_pair.public_key, b"payload", signature)

# Canonical AccountId/I105 identity is derived only from the controller key.
# This constructor currently requires `domain`; canonical identity ignores it
# and AccountAddress.from_account emits a domainless address.
address = AccountAddress.from_account(domain="wonderland", public_key=ed_pair.public_key)
print(address.canonical_hex())
print(address.to_i105(0x02F1))

# Confidential key helpers derive local viewing/spending material.
confidential = derive_confidential_keyset_from_hex("01" * 32)
print(confidential.as_hex())
print(hash_blake2b_32(b"payload").hex())
```

Use `supported_crypto_algorithms()` para ver o que sua roda suporta. Os auxiliares genéricos usam rótulos de algoritmo canônicos e funcionam para Ed25519, secp256k1, ML-DSA, GOST, BLS e SM2 quando esses algoritmos são compilados:

```python
from iroha_python import (
    CryptoKeyPair,
    derive_keypair_from_seed,
    load_keypair,
    parse_private_key_multihash,
    parse_public_key_multihash,
    private_key_multihash,
    public_key_multihash,
    sign,
    supported_crypto_algorithms,
    verify,
)

message = b"iroha multi-algorithm signing"

# Iterate the algorithms compiled into the installed native extension.
for algorithm in supported_crypto_algorithms():
    keypair = derive_keypair_from_seed(f"docs:{algorithm}".encode(), algorithm)
    signature = keypair.sign(message)

    # Both the object method and the generic helper verify the same signature.
    assert keypair.verify(message, signature)
    assert verify(algorithm, keypair.public_key, message, signature)

    # Loading a private key should reconstruct the same public key.
    loaded = load_keypair(keypair.private_key, algorithm)
    assert loaded.public_key == keypair.public_key
    assert sign(algorithm, loaded.private_key, message) != b""

    # Prefixed multihashes carry the algorithm label with the key bytes.
    public_multihash = public_key_multihash(
        algorithm,
        keypair.public_key,
        prefixed=True,
    )
    private_multihash = private_key_multihash(
        algorithm,
        keypair.private_key,
        prefixed=True,
    )

    public_algorithm, public_key = parse_public_key_multihash(public_multihash)
    private_algorithm, private_key = parse_private_key_multihash(private_multihash)
    restored = CryptoKeyPair.from_private_key_multihash(private_multihash)

    # Round-trip checks catch mismatched algorithm labels or key encodings.
    assert public_algorithm == algorithm
    assert public_key == keypair.public_key
    assert private_algorithm == algorithm
    assert private_key == keypair.private_key
    assert restored == keypair
```

### Criptografia Chinesa SM {#chinese-sm-cryptography}

O Python SDK expõe tanto os auxiliares genéricos SM2 quanto os auxiliares de conveniência específicos de SM2. Use o anúncio de capacidade do nó para escolher o identificador distintivo SM2 esperado pela rede de destino:

```python
from iroha_python import (
    SM2_ALGORITHM,
    SM2_DEFAULT_DISTINGUISHED_ID,
    derive_keypair_from_seed,
    derive_sm2_keypair_from_seed,
    sign,
    sign_sm2,
    verify,
    verify_sm2,
)

capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Use the node's default SM2 distinguishing ID when the node advertises one.
distid = sm.sm2_distid_default if sm else SM2_DEFAULT_DISTINGUISHED_ID

# The SM2-specific helper accepts the distinguishing ID explicitly.
pair = derive_sm2_keypair_from_seed(bytes.fromhex("11" * 32), distid=distid)
message = b"iroha-sm2-example"
signature = pair.sign(message)

assert pair.verify(message, signature)
assert verify_sm2(pair.public_key, message, signature, distid=distid)
assert sign_sm2(pair.private_key, message, distid=distid) != b""

# The generic API works when you only need the canonical `sm2` label.
generic_pair = derive_keypair_from_seed(bytes.fromhex("22" * 32), SM2_ALGORITHM)
generic_signature = sign(SM2_ALGORITHM, generic_pair.private_key, message)
assert verify(SM2_ALGORITHM, generic_pair.public_key, message, generic_signature)

print(pair.public_key_sec1_hex)
print(pair.public_key_multihash)
```

`crypto.sm.enabled` informa se o nó aceita algoritmos da família SM em sua política atual. O mesmo anúncio inclui a política de hash criptográfico SM e o status de aceleração, o que é útil ao decidir se deve ativar fluxos específicos de SM2:

```python
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Trate o payload de capacidade autenticado como autoritativo para o nó implantado. Não envie uma transação assinada por SM2 a menos que `crypto.sm.enabled` seja verdadeiro e a política de assinatura anunciada o permita.

### GOST e Chaves Pós-Quânticas {#gost-and-post-quantum-keys}

Use a criptografia genérica API para conjuntos de parâmetros GOST R 34.10-2012 e ML-DSA (`ml-dsa`) de assinaturas pós-quânticas. O mesmo objeto de par de chaves lida com assinatura, verificação e exportação multihash:

```python
from iroha_python import (
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM,
    ML_DSA_ALGORITHM,
    derive_keypair_from_seed,
    verify,
)
from iroha_python.address import AccountAddress

CHAIN_DISCRIMINANT = 0x02F1
message = b"iroha gost and post-quantum example"

# Crypto helpers use canonical labels; account addresses use compact aliases.
# Every `domain=` argument below is ignored when the canonical AccountId/I105
# address is encoded.
GOST_ADDRESS_ALIASES = {
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM: "gost-256-a",
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM: "gost-256-b",
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM: "gost-256-c",
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM: "gost-512-a",
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM: "gost-512-b",
}

# Derive and verify one local keypair for every GOST parameter set.
for crypto_algorithm, address_algorithm in GOST_ADDRESS_ALIASES.items():
    keypair = derive_keypair_from_seed(
        f"docs:{crypto_algorithm}".encode(),
        crypto_algorithm,
    )
    signature = keypair.sign(message)

    assert verify(crypto_algorithm, keypair.public_key, message, signature)

    address = AccountAddress.from_account(
        domain="wonderland",
        public_key=keypair.public_key,
        # Account addresses use compact curve aliases for GOST parameter sets.
        algorithm=address_algorithm,
    )
    print(crypto_algorithm)
    print(address.canonical_hex())
    print(address.to_i105(CHAIN_DISCRIMINANT))
    print(keypair.prefixed_public_key_multihash)

# ML-DSA follows the same generic signing and address flow.
mldsa_keypair = derive_keypair_from_seed(b"docs:ml-dsa", ML_DSA_ALGORITHM)
mldsa_signature = mldsa_keypair.sign(message)
assert verify(ML_DSA_ALGORITHM, mldsa_keypair.public_key, message, mldsa_signature)
post_quantum_address = AccountAddress.from_account(
    domain="wonderland",
    public_key=mldsa_keypair.public_key,
    algorithm="ml-dsa",
)
print(post_quantum_address.canonical_hex())
print(post_quantum_address.to_i105(CHAIN_DISCRIMINANT))
print(mldsa_keypair.prefixed_public_key_multihash)
```

Portão GOST e fluxos pós-quânticos no anúncio de capacidade autenticada e tipada do nó:

```python
capabilities = client.get_node_capabilities_typed(
    canonical_auth=canonical_auth,
)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.allowed_signing if sm else ())

GOST_ALGORITHMS = {
    "gost3410-2012-256-paramset-a",
    "gost3410-2012-256-paramset-b",
    "gost3410-2012-256-paramset-c",
    "gost3410-2012-512-paramset-a",
    "gost3410-2012-512-paramset-b",
}

# Local support is not enough; submit only when the node advertises support.
supports_gost = bool(allowed & GOST_ALGORITHMS)
supports_post_quantum = "ml-dsa" in allowed
supports_sm2 = "sm2" in allowed and bool(sm and sm.enabled)

print(supports_gost, supports_post_quantum, supports_sm2)
```

Se um nó não anunciar o algoritmo que você precisa, use a chave apenas para fluxos de trabalho locais ou offline. Não envie transações assinadas com esse algoritmo para esse nó. Durante a verificação pública Taira, GOST e ML-DSA estavam disponíveis como ajudantes de criptografia SDK na biblioteca upstream Python, mas não foram anunciados pelo nó para assinatura de transações.

## Criação de Cliente Consciente de Configuração {#config-aware-client-creation}

Use `resolve_torii_client_config` quando sua aplicação lê as configurações do nó a partir de um arquivo, mas ainda precisa de substituições específicas de ambiente ou de teste:

```python
import json
from iroha_python import create_torii_client, resolve_torii_client_config

with open("iroha_config.json", "r", encoding="utf-8") as handle:
    raw_config = json.load(handle)

# Override only the fields that vary by environment.
resolved = resolve_torii_client_config(
    config=raw_config,
    overrides={"timeout_ms": 2_000, "max_retries": 5},
)

# Pass the resolved config into the same client constructor used elsewhere.
client = create_torii_client(
    raw_config.get("torii", {}).get("address", TORII_URL),
    resolved_config=resolved,
)
```

## Prontidão Kagemusha {#kagemusha-readiness}

O Python SDK pode consultar a rota de prontidão atual do JSON através de seu auxiliar de requisição genérico Torii:

```python
ASSET_DEFINITION_ID = "<canonical_asset_definition_id>"

readiness = client.request_json(
    "GET",
    "/v1/offline/readiness",
    params={"asset_definition_id": ASSET_DEFINITION_ID},
    headers={"Accept": "application/json"},
    expected_status=(200,),
)
print(readiness["ready"])
print(readiness["blockers"])
```

Python não expõe construtores de arquivos de recarga ou resgate Kagemusha tipados. Use uma carteira tipada Swift ou JVM para construir os arquivos V4 canônicos, depois envie-os e faça polling através de um cliente Torii Kagemusha suportado.

## Assinaturas {#subscriptions}

Leituras de assinatura e construtores de rascunho são herdados do cliente compartilhado Torii usado por `iroha_python.ToriiClient`. Cada mutação é admitida com uma assinatura de conta canônica vinculada ao corpo e retorna um rascunho de transação não assinado. Torii nunca aceita uma chave privada e não envia o rascunho para você.

```python
# The plan defines billing cadence, retry policy, and usage pricing.
usage_plan = {
    "provider": alice,
    "billing": {
        "cadence": {
            "kind": "monthly_calendar",
            "detail": {"anchor_day": 1, "anchor_time_ms": 0},
        },
        "bill_for": {"period": "previous_period", "value": None},
        "retry_backoff_ms": 86_400_000,
        "max_failures": 3,
        "grace_ms": 604_800_000,
    },
    "pricing": {
        "kind": "usage",
        "detail": {
            "unit_price": "0.024",
            "unit_key": "compute_ms",
            "asset_definition": "usd#wonderland",
        },
    },
}

# The provider authorizes preparation of a plan-registration draft.
plan_draft = client.create_subscription_plan(
    authority=alice,
    plan_id="compute#wonderland",
    plan=usage_plan,
    canonical_auth=canonical_auth,
)

bob_canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=bob,
    signer=bob_pair.sign,
)

# The subscriber authorizes preparation of a subscription-creation draft.
subscription_draft = client.create_subscription(
    authority=bob,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
    canonical_auth=bob_canonical_auth,
)

# Usage and charge-now operations also return unsigned transaction drafts.
usage_draft = client.record_subscription_usage(
    "sub-001",
    authority=alice,
    unit_key="compute_ms",
    delta="3600000",
    canonical_auth=canonical_auth,
)
charge_draft = client.charge_subscription_now(
    "sub-001",
    authority=alice,
    canonical_auth=canonical_auth,
)

for draft in (plan_draft, subscription_draft, usage_draft, charge_draft):
    assert draft.submitted is False
    print(draft.transaction_payload_b64, draft.signing_message_b64)
```

Dê cada carga útil exata e mensagem de assinatura para a carteira local da conta correspondente, verifique a operação solicitada lá, monte a transação assinada e envie-a através do pipeline normal de processamento de transações. O Python SDK valida que a mensagem de assinatura é o hash criptográfico canônico do payload retornado, mas a carteira continua sendo responsável por decodificar e aprovar a transação antes de assinar.

## Conectar {#connect}

Construa e analise o Connect URIs localmente. Uma identidade Connect vincula o SID ao exato `NetworkId`, à chave pública do aplicativo e ao valor nonce criptográfico:

```python
from iroha_python.connect import create_connect_session_preview, parse_connect_uri

# Generate consistent SID, key, nonce, and URI values as one bundle.
preview = create_connect_session_preview(
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
parsed = parse_connect_uri(preview.wallet_uri)

assert parsed.sid == preview.sid_base64url
assert parsed.network_id.literal == TAIRA_NETWORK_ID.literal
assert parsed.app_public_key == preview.app_key_pair.public_key
```

Registre essa pré-visualização exata apenas quando o nó de destino expuser o Connect. A criação da sessão retorna quatro tokens de portador específicos para cada função. A rota de status por sessão requer o token de gerenciamento; o status agregado é uma rota de operador.

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    bootstrap_connect_preview_session,
    decode_connect_frame,
    encode_connect_frame,
)

bootstrap = bootstrap_connect_preview_session(
    client,
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
info = bootstrap.session
tokens = bootstrap.tokens
assert info is not None and tokens is not None

session_status = client.request_json(
    "GET",
    "/v1/connect/status",
    params={"sid": info.sid},
    headers={"Authorization": f"Bearer {tokens.management}"},
    expected_status=(200,),
)
print(info.app_uri, session_status)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=bootstrap.preview.app_key_pair.public_key,
        network_id=TAIRA_NETWORK_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and also travels as a frame.
close_frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=2,
    control=ConnectControlClose(
        role="App", code=4100, reason="finished", retryable=False
    ),
)
close_payload = encode_connect_frame(close_frame)
```

Criptografe mensagens pós-aprovação com uma sessão com estado:

```python
from iroha_python import (
    ConnectDirection,
    ConnectSession,
    ConnectSessionKeys,
    ConnectSignRequestRawPayload,
)

# Derive symmetric session keys from both parties' keys and the session ID.
keys = ConnectSessionKeys.derive(
    local_private_key=bytes.fromhex("11" * 32),
    peer_public_key=bytes.fromhex("22" * 32),
    sid=bytes.fromhex("33" * 32),
)
session = ConnectSession(
    sid=bytes.fromhex("33" * 32),
    keys=keys,
)
# Encrypt application payloads after the session is approved.
encrypted = session.encrypt_app_to_wallet(
    ConnectSignRequestRawPayload(domain_tag="SIGN", payload=b"hash")
)
state = session.snapshot_state().to_dict()
print(encrypted.sequence, state)
```

## Governança, tempo de execução de software e Superfícies de Administração {#governance-runtime-and-admin-surfaces}

Leituras de governança são autenticadas por conta. Usando o principal de autorização e o par de chaves de [Configuração Compartilhada](#shared-setup), vincule cada chamada de ajudante ao `NetworkId` derivado da gênese exata de Taira:

```python
# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces(canonical_auth=canonical_auth)
referendum = client.get_governance_referendum_typed(
    "ref-1", canonical_auth=canonical_auth
)
tally = client.get_governance_tally_typed("ref-1", canonical_auth=canonical_auth)
locks = client.get_governance_locks_typed("ref-1", canonical_auth=canonical_auth)
unlock_stats = client.get_governance_unlock_stats_typed(
    canonical_auth=canonical_auth
)

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Account-authenticated runtime reads use the same canonical request proof.
abi = client.get_runtime_abi_active_typed(canonical_auth=canonical_auth)
# The ABI hash itself is a public read.
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed(canonical_auth=canonical_auth)
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

print(abi, abi_hash, runtime_metrics)
print(capabilities.abi_version)
```

Crie um cliente separado para leituras do operador. Carregue a chave do operador na lista de permitidos em tempo de execução do software e vincule-a ao Taira exato `NetworkId`; tokens de portador e `x-api-token` não substituem esta assinatura:

```python
import os

from iroha_python import Ed25519KeyPair, NetworkId, OperatorSigningContext

operator_pair = Ed25519KeyPair.from_private_key(
    bytes.fromhex(os.environ["IROHA_OPERATOR_PRIVATE_KEY_HEX"])
)
operator_client = create_torii_client(
    TORII_URL,
    operator_signing_context=OperatorSigningContext(
        TAIRA_NETWORK_ID,
        operator_pair,
    ),
)
```

Rotas de atualização em tempo de execução são construtores de instruções autenticados pelo operador. Uma resposta bem-sucedida de propor, ativar ou cancelar retorna `tx_instructions`; ela não realiza a atualização. Envie esse pacote pelo caminho normal de transação assinada e governança. Os métodos fixados Python `propose_runtime_upgrade`, `activate_runtime_upgrade` e `cancel_runtime_upgrade` atualmente emitem solicitações simples em vez de aplicar o `OperatorSigningContext` do cliente, portanto este tutorial não os apresenta como um fluxo de operador funcional.

## Status, Consenso e Telemetria de Rede {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time-status endpoints use the operator client configured above.
sumeragi = operator_client.get_sumeragi_status_typed()
diagnostics = operator_client.get_sumeragi_diagnostics_typed()
print(sumeragi.last_committed_height, diagnostics.tx_queue_saturated)

time_now = client.get_time_now()
time_status = operator_client.get_time_status()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)

# Connect aggregate status is operator-authenticated. Individual sessions use
# `/v1/connect/status?sid=...` with their management bearer token instead.
connect_status = operator_client.get_connect_status_typed()
if connect_status is not None:
    print(connect_status.enabled, connect_status.sessions_active)
```

## SoraFS, UAID e Kaigi Ajudantes {#sorafs-uaid-and-kaigi-helpers}

Esses auxiliares estão disponíveis quando o nó de destino expõe os endpoints correspondentes Nexus/SORA API. Trate listas vazias como uma resposta válida: Taira público pode ter a rota habilitada sem dados para o manifesto técnico de amostra ou UAID.

```python
# SoraFS status queries are reads scoped by manifest and status.
por_status = client.get_sorafs_por_status(manifest_hex="ab" * 32, status="verified")
print(len(por_status))

# UAID helpers inspect wallet/data-space bindings for one identifier.
uaid = "aabb" * 16
bindings = client.get_uaid_bindings_typed(uaid)
manifests = client.list_space_directory_manifests_typed(
    uaid,
    dataspace=11,
    status="active",
)
print(len(bindings.dataspaces), len(manifests.manifests))

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC e GPU Ajudantes {#norito-rpc-and-gpu-helpers}

Use `NoritoRpcClient` quando você já tiver Norito bytes e precisar chamar um endpoint binário Torii API. O exemplo requer um contêiner de dados assinado de um modelo de transação anterior:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call(
        "/v1/pipeline/transactions",
        envelope.signed_transaction_versioned,
    )
    print(len(response_bytes))
```

CUDA helpers retornam `None` quando o backend não está disponível, para que os aplicativos possam recorrer a implementações escalares:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Cobertura Atual {#current-coverage}

O Python SDK já inclui auxiliares para:

- Torii fluxos de envio, status, consulta e administração
- construtores de instruções digitadas para extensões comuns ISI e específicas de domínio
- rascunhos de transações, manifestos, assinatura e fluxos de envelopes de transações assinadas
- streams de eventos ao vivo e filtros digitados; streams de blocos comprometidos fornecem histórico completo
- prontidão de Kagemusha genérica, acesso e ajudantes de assinatura Torii; construtores tipados de recarga e resgate não são expostos
- endereço da conta, auxiliares de assinatura para todos os algoritmos, viagens de ida e volta de multihash, SM2, GOST, ML-DSA, BLS, e manuseio de chaves confidenciais
- Conectar URIs, sessões, quadros, auxiliares de criptografia e administrador de registro
- adaptadores de endpoint para governança, atualização do ambiente de execução, Sumeragi, administração do nó, SoraFS, UAID e Kaigi, quando o nó expõe esses recursos

## Referências a Montante {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Esses arquivos são a fonte de verdade para a superfície Python na revisão do espaço de trabalho fixado.
