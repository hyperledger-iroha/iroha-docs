---
translation_locale: pt
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

A Python SDK no espaço de trabalho upstream é `iroha-python`. A primeira versão Iroha 3 visa as superfícies atuais Torii e Norito. Pin a versão do pacote ou a revisão da fonte usada pela sua integração para que o SDK e o nó permaneçam na mesma revisão em formato de fio.

Os exemplos de leitura apenas abaixo foram verificados em relação ao público Taira em `https://taira.sora.org`. Exemplos de mutação são modelos de transacção: eles requerem um real Taira Autoridade, chave privada, metadados de gás e quaisquer tokens do operador exigidos pela rota-alvo antes de poderem ser submetidos.

Usar os exemplos nesta ordem:

|Estágio .|Correr contra público Taira?|O que você precisa .|
| --- | --- | --- |
|Chamadas de clientes só para leitura |Sim , sim .|Python pacote mais acesso à rede |
|Construtores locais de assinaturas e instruções |Nenhuma ligação à rede até `submit()` |Extensão nativa e o seu material chave |
|Transações de mutação e chamadas de serviço |Só com a sua própria conta financiada .|Conta da autoridade, chave privada, cadeia ID, metadados de taxas, saldo dos ativos de taxas e tokens de rota |
|Conecte codecs de quadros, criptografia e GPU auxiliares |Apenas local .|Extensão nativa; os auxiliares GPU também precisam de um backend com capacidade para o CUDA |

## Instalação {#install}

O nome do pacote de metadados é `iroha-python`. Não suponha que uma instalação não fixada PyPI coincida com a rede Taira ao vivo. Instale uma roda ou caixa fonte que foi construída a partir da mesma revisão upstream, seus objetivos de integração:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Se o seu projeto consome diretamente o espaço de trabalho upstream, instale as dependências Python e construa a extensão nativa antes de executar exemplos que usam `Instruction`, `TransactionDraft`, assinatura, criptografia, SoraFS auxiliares nativos, GPU auxiliares ou codecs de quadro Connect. Utilize o comando de construção a partir do fluxo ascendente `python/iroha_python/README.md`, e verifique se a carga das exportações nativas:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Caso as importações `create_torii_client` mas `Instruction` ou `generate_ed25519_keypair` falhem, o pacote puro Python está disponível, mas a extensão nativa não.

## Rapido arranque {#quickstart}

Iniciar com pontos finais Taira públicos, somente de leitura:

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

## Configuração compartilhada {#shared-setup}

Use esta configuração para os modelos de mutação. Substitua cada titular de lugar com uma autoridade Taira, chave privada, token e ativo/conto IDs da sua implantação antes de enviar.

`authority` é a conta que assina a transacção. `private_key` deve corresponder a essa conta, `CHAIN_ID` deve corresponsar à rede-alvo e `TX_METADATA` deve incluir os campos de taxas esperados pela rede. Os titulares de lugares abaixo são intencionalmente inválidos, por isso não são apresentados por acidente.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    TransactionConfig,
    TransactionDraft,
    create_torii_client,
)

TORII_URL = "https://taira.sora.org"
CHAIN_ID = "fc56984b-2be7-431d-840e-21514d1883f0"
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

TX_METADATA = {
    # Public Taira fee asset. Use the configured XOR asset on your network.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

client = create_torii_client(TORII_URL, auth_token=AUTH_TOKEN)


def submit(*instructions):
    # This is the network boundary: build, sign, submit, and wait for status.
    return client.build_and_submit_transaction(
        chain_id=CHAIN_ID,
        authority=alice,
        private_key=alice_pair.private_key,
        instructions=list(instructions),
        metadata=TX_METADATA,
        wait=True,
    )
```

`Instruction.*` chama apenas cargas úteis de instruções de construção. `submit()` é o ponto em que o SDK assina a transação, envia-a para Torii e espera um status.

## Tarifas e gás {#fees-and-gas}

As transacções de escritura necessitam de metadados de taxas e um saldo de activos de taxas financiadas. Taira, O activo de taxa é financiado pelo torneio público e os metadados da transacção devem incluir: `gas_asset_id`. - Não . Minamoto, As taxas são pagas em reais. XOR e o ativo ID vem da configuração dessa rede.

Os metadados de taxas pertencem à transação, e não às instruções individuais. O auxiliar `submit()` acima anexa `TX_METADATA` a cada transacção que constrói:

```python
TX_METADATA = {
    # Taira expects the fee asset definition in transaction metadata.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

envelope, status = client.build_and_submit_transaction(
    chain_id=CHAIN_ID,
    authority=alice,
    private_key=alice_pair.private_key,
    # Fee metadata is attached to the transaction, not the instruction.
    instructions=[
        Instruction.set_account_key_value(
            alice,
            "python_fee_example",
            "ready",
        )
    ],
    metadata=TX_METADATA,
    wait=True,
)
```

Antes de enviar cartas, certifique-se de que a conta da autoridade possui o suficiente do ativo da taxa. A torneira exata e o ativo ID são específicos para a rede; esta é a forma Taira:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"
TX_METADATA = {"gas_asset_id": FEE_ASSET_DEFINITION}

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

A torneira retorna o concreto `asset_id` para uso na verificação do saldo. O campo de metadados `gas_asset_id` utiliza a definição de ativo de taxa ID.

Mantenha os metadados dos aplicativos separados dos metadados de taxas, combinando os mapas quando você constrói uma transação:

```python
APP_METADATA = {"source": "python-docs"}
# Merge app metadata with required fee metadata before building the draft.
metadata = {**TX_METADATA, **APP_METADATA}

draft = TransactionDraft(
    TransactionConfig(
        chain_id=CHAIN_ID,
        authority=alice,
        metadata=metadata,
    )
)
```

Se omitir metadados de taxas, usar o ativo de taxas errado ou assinar com uma conta não financiada, uma rede real deve rejeitar a transação mesmo que a carga útil das instruções seja válida.

## Taira - Chamadas de leitura só verificadas {#taira-checked-read-only-calls}

Estas chamadas retornaram com sucesso contra o público Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.query_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
sumeragi = client.get_sumeragi_status_typed()
connect = client.get_connect_status_typed()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_time_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms, len(time_status.samples), sumeragi.leader_index)
print(connect.enabled, connect.sessions_active)
```

Rutas como: `/v1/status`, inventário público de pares, Sumeragi RBC amostragem, snapshots do administrador de nós e administração do registo do aplicativo Connect não estavam disponíveis ao público no Taira durante a verificação. `request_json("GET", "/status")` para a carga útil de status do nó público no Taira.

## Instruções para os construtores {#instruction-builders}

O SDK expõe construtores de tipo para as famílias de instruções mais comuns e uma escotilha de escape JSON para variantes que ainda não são métodos de primeira classe Python. Os snippets seguintes são modelos de transação mutantes e não foram submetidos ao público Taira sem uma conta de assinatura.

Preferem auxiliares digitalizados quando existem: eles normalizam os valores Python e falham no início em formas inválidas. Use `Instruction.from_json` apenas quando você precisar de uma variante de instrução que ainda não tenha um auxiliar Python.

|Família de instrução |Python superfície |
| --- | --- |
|Registo .| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` É reservado para ferramentas de genesis/bootstrap |
|Desinscrição .|`unregister_trigger`; utilização de `Instruction.from_json` para outras variantes |
|Mint/Burn |`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Transferência | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Metadados e controles | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA ciclo de vida | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Extensões de repo/desenvolvimento | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Localizações de activos nativos |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, mais os auxiliares do cliente `*_and_wait` |
|Subsídio/Revocação, SetParameter, Registo, Custom, Upgrade e variantes menos comuns de registo/non-registro |`Instruction.from_json` ou `TransactionBuilder.add_instruction_json` com canônico `InstructionBox` JSON |

Para os pagamentos condicionais em forma de garantia, ver [Escrow de ativos nativos](/pt/blockchain/escrow.md#python-asset-locks). Python atualmente expõe auxiliares de primeira classe para bloqueios genéricos de ativos; mercado e auxiliares anônimos de garantia não são de primeira classe Python métodos ainda.

### Configurar domínios, depois registrar contas e ativos {#set-up-domains-then-register-accounts-and-assets}

A criação de domínio comum passa pelo planejador do alias declarativo para que o contrato de arrendamento SNS, as capacidades do proprietário, a guarda das cotações e o estado do domínio sejam verificados juntos. Crie uma intenção livre de segredo `AliasSetupPlanRequestV1` com seu SDK ou serviço de onboarding, em seguida use `iroha app alias setup plan` e `iroha app alias setup apply`. Não submeter `Instruction.register_domain` a partir de uma transação de aplicação; esse construtor permanece para genesis/bootstrap tooling.

Após o plano de configuração do domínio se comprometer, registre objetos de propriedade do domínio. Em uma rede compartilhada como Taira, use um espaço de nomes de domínio e conta atribuído a você.

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

`mintable` aceita `Infinitely`, `Once`, `Not`, ou `Limited(n)` Valores aceitos pelo modelo de dados. `scale` para um ativo numérico sem restrições.

### Minas, queimaduras e transferências de bens {#mint-burn-and-transfer-assets}

Estas chamadas utilizam um ativo existente ID. Registre primeiro a definição de ativo e, em seguida, construa o ativo concreto ID para a conta que possui o ativo.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Transferência de propriedade {#transfer-ownership}

Transferências de propriedade mudança de quem controla o domínio, definição do ativo ou NFT. Usar o proprietário atual como autoridade de transacção.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Configuração e eliminação de metadados {#set-and-remove-metadata}

Os valores de metadados devem ser JSON - serializable. Quando você usa `TransactionDraft`, a autoridade em `TransactionConfig` se torna a conta-alvo padrão.

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

O projecto de assistente de alto nível destina-se, por defeito, à autoridade de transacção:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Ativos do mundo real {#real-world-assets}

Os auxiliares RWA utilizam cargas úteis serializáveis de JSON para metadados específicos do ativo, proveniência e política do controlador. `register_rwa` não aceita um `id` ou `owner`: o tempo de execução gera o `RwaId`, e a autoridade da transação torna-se o proprietário inicial.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Após os compromissos da transação de registo, utilize `FindRwas`, `/v1/rwas`, um evento RWA ou a rota exploradora definida para descobrir o ID gerado:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

As operações subsequentes utilizam o `hash$domain` gerado ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

As transferências completas podem ser alteradas em `owned_by` no lote existente As transferências e fusões parciais criam lotes de filhos gerados.

### Trigas {#triggers}

Usar auxiliares de registro do gatilho quando o executável é outra sequência de instruções:

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

O Torii também expõe os auxiliares REST para o inventário do gatilho:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

As chamadas de inventário do gatilho são apenas leituras ou inspecção dos registos do gatilha. Registro, execução, mudanças de repetição e não registo são operações mutantes.

### Instruções de depósito e liquidação {#repo-and-settlement-instructions}

Repo e auxiliares de liquidação bilateral adicionam variantes de instruções específicas do domínio sem cargas úteis Norito de fabricação manual:

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
    chain_id=CHAIN_ID,
    authority=alice,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=TX_METADATA,
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
draft.repo_unwind(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    settlement_timestamp_ms=1_704_086_400_000,
)

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

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Escape Hatch {#json-escape-hatch}

Quando um Python auxiliar ainda não está disponível, alimentação modelo de dados canônicos `InstructionBox` JSON em `Instruction.from_json` ou directamente em `TransactionBuilder.add_instruction_json`. Este é o caminho recomendado para `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, Peer/role NFT Registro, e não-trigger desregistre variantes até que esses auxiliares são digitalizados.

```python
from iroha_python import Instruction, TransactionBuilder

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

# Use TransactionBuilder when you need lower-level control than TransactionDraft.
builder = TransactionBuilder(CHAIN_ID, alice)
builder.set_metadata(TX_METADATA)
builder.add_instruction_json(instruction_box_json)
envelope = builder.sign(alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

Para instruções geradas ou opacas, viagem de ida e volta através de JSON antes do armazenamento dos aparelhos:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Fluxos de trabalho das transacções {#transaction-workflows}

Use `TransactionDraft` para aplicativos que constroem várias instruções antes de assinar. Um esboço permite manter configurações de nível de transação, como `ttl_ms`, `nonce` e metadados em um só lugar, e depois assinar uma vez:

```python
config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata={**TX_METADATA, "source": "python-docs"},
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition_numeric(
    ROSE_DEFINITION,
    owner=alice,
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_numeric(ROSE_ASSET, "100")
draft.transfer_asset_numeric(ROSE_ASSET, "25", destination=bob)

# Signing freezes the draft into an envelope ready for Torii.
envelope = draft.sign_with_keypair(alice_pair)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Exportar um manifesto determinista para revisão, auditoria ou transferência de carteira:

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

Aplicar uma prova de privacidade da faixa antes de assinar, quando a faixa-alvo exigir:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), None, bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_bytes=b"...verifying key bytes...",
)
envelope = draft.sign_with_keypair(alice_pair)
```

## Questões {#queries}

Os auxiliares de consulta tipografados retornam classes de dados em vez de dicionários JSON brutos. São a maneira mais fácil de começar porque o SDK analisa a paginação e os campos comuns de registro para você:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Usar os auxiliares de solicitação genéricos quando um ponto final Torii ainda não tiver uma embalagem digitalizada:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Os auxiliares de inventário de contas exigem um identificador de conta aceito pela SDK É um normalizador , usa canônico . I105 Conta IDs ou alias em cadeia; se um explorador de blocos ou ponto final bruto retornar uma ID que o SDK Rejeita, resolve-o a um relato canônico ID Antes de chamar estes ajudantes:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Eventos {#events}

Os auxiliares de streaming decodificam as cargas úteis JSON por padrão. Passe o `with_metadata=True` quando você precisar do nome do evento SSE, id, sugerência e carga útil crua. Combine os streams com `EventCursor` para manter o último ID do evento. Estes exemplos aguardam eventos ao vivo, então executá-los contra um nó onde o fluxo de eventos correspondente está ativado e ativo.

```python
from iroha_python import DataEventFilter, EventCursor

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

# Persist the latest SSE id so a reconnect can resume from the same point.
cursor = EventCursor()
for event in client.stream_events(
    filter=proof_filter,
    cursor=cursor,
    resume=True,
    with_metadata=True,
):
    print(event.id, event.event, event.data)
    break

for event in client.stream_trigger_events(trigger_id="hourly_reward", resume=True):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Chaves e endereços {#keys-and-addresses}

O SDK expõe os auxiliares de assinatura locais para cada algoritmo de assinatura compilado na extensão nativa. Estes auxiliares não chamam a Taira, mas eles precisam da extensão nativa:

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

Use `supported_crypto_algorithms()` para ver o que a sua roda suporta. Os auxiliares genéricos usam rótulos de algoritmos canônicos e trabalham para Ed25519, secp256k1, ML-DSA, GOST, BLS e SM2 quando esses algoritmos são compilados em:

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

### Criptografia chinesa SM {#chinese-sm-cryptography}

O Python SDK expõe os auxiliares genéricos SM2 e os auxiliares de conveniência específicos SM2. Use o anúncio de capacidade do nó para escolher o identificador distintivo SM2 esperado pela rede-alvo:

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

capabilities = client.get_node_capabilities_typed()
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

`crypto.sm.enabled` diz-lhe se o nó aceita os algoritmos da família SM em sua política atual. O mesmo anúncio inclui a política de hash e o status de aceleração SM, que é útil para decidir se deve ativar fluxos específicos SM2:

```python
capabilities = client.get_node_capabilities_typed()

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

O público Taira expôs o anúncio de capacidade SM durante a verificação, mas a assinatura SM foi desativada lá. Os algoritmos de assinatura anunciados foram `ed25519`, `secp256k1` e `bls_normal`, Por conseguinte, não submeter transações assinadas com SM2 a essa implantação, a menos que a carga útil da capacidade mude.

### GOST e Chaves Pós-Quânticas {#gost-and-post-quantum-keys}

Usar a criptografia genérica API para GOST R 34.10-2012 conjuntos de parâmetros e ML-DSA (`ml-dsa`O mesmo objeto de par de chaves lida com a assinatura, a verificação e a exportação multi-hash:

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

Porta GOST e fluxos post-quânticos nos algoritmos de assinatura anunciados do nó. Use a carga útil da capacidade crua para nomes de algoritmo compatíveis com o futuro:

```python
capabilities = client.request_json(
    "GET",
    "/v1/node/capabilities",
    expected_status=(200,),
)
crypto = capabilities.get("crypto", {})
sm = crypto.get("sm", {})
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.get("allowed_signing", []))

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
supports_sm2 = "sm2" in allowed and bool(sm.get("enabled", False))

print(supports_gost, supports_post_quantum, supports_sm2)
```

Se um nó não anunciar o algoritmo que você precisa, use a chave apenas para fluxos de trabalho locais ou offline. Não envie transações assinadas com esse algoritmo para esse nó. Durante a verificação pública Taira, GOST e ML-DSA estavam disponíveis como criptoassistentes SDK na biblioteca upstream Python, mas não foram anunciados pelo nó para assinatura de transações.

## Criação de Clientes Config-Aware {#config-aware-client-creation}

Use `resolve_torii_client_config` quando o seu aplicativo lê as configurações de nós a partir de um arquivo, mas ainda precisa de overrides específicos do ambiente ou teste:

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

## Preparação de Kagemusha {#kagemusha-readiness}

O Python SDK pode consultar a rota de prontidão corrente JSON através do seu auxiliar genérico de solicitação Torii:

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

Python não expõe os construtores de arquivos de reposição ou resgate da Kagemusha. Use uma carteira Swift ou JVM para construir os arquivos canônicos V4, e depois enviá-los e pesquisá-los através de um cliente de Kagemusha Torii suportado.

## Subscrições {#subscriptions}

Os assistentes de assinatura são chamadas de serviço mutantes herdadas do cliente compartilhado Torii usado por `iroha_python.ToriiClient`. Use IDs e ativos que existem na rede que você destina.

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

# The provider signs plan creation.
client.create_subscription_plan(
    authority=alice,
    private_key=alice_pair.private_key_hex,
    plan_id="compute#wonderland",
    plan=usage_plan,
)

# The subscriber signs subscription creation.
client.create_subscription(
    authority=bob,
    private_key=bob_pair.private_key_hex,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
)

# Usage is recorded by the provider and then charged on demand.
client.record_subscription_usage(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
    unit_key="compute_ms",
    delta="3600000",
)
client.charge_subscription_now(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
)
```

## Conectar {#connect}

Construir e analisar o Connect URIs, e ler o status público do Connect exposto pelo Taira:

```python
from iroha_python.connect import ConnectUri, build_connect_uri, parse_connect_uri

# Connect URIs are what an app hands to a wallet to start a session.
uri = build_connect_uri(
    ConnectUri(
        sid="base64url-session-id",
        chain_id=CHAIN_ID,
        node="taira.sora.org",
    )
)
parsed = parse_connect_uri(uri)
# Status tells you whether the node currently exposes Connect.
status = client.get_connect_status_typed()

assert parsed.chain_id == CHAIN_ID
print(status.enabled, status.sessions_active)
```

Os codecs de quadro, a derivação da chave de sessão e a criação de sessões exigem a extensão nativa e uma rota de sessão Connect habilitada:

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    decode_connect_frame,
    encode_connect_frame,
    generate_connect_keypair,
)

# The app keypair is separate from the account key used for transactions.
connect_pair = generate_connect_keypair()
info = client.create_connect_session_info(
    {"role": "app", "sid": connect_pair.public_key.hex()}
)
print(info.app_uri, info.wallet_token, info.expires_at)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bytes.fromhex("01" * 32),
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=connect_pair.public_key,
        chain_id=CHAIN_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and carries a reason code.
client.send_connect_control_frame(
    "base64url-session-id",
    ConnectControlClose(role="App", code=4100, reason="finished", retryable=False),
)
```

Criptografar as mensagens após a aprovação com uma sessão de estado:

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

## Governança, tempo de execução e superfícies de administração {#governance-runtime-and-admin-surfaces}

Estas chamadas de somente leitura foram devolvidas com êxito contra o público Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces()
referendum = client.get_governance_referendum_typed("ref-1")
tally = client.get_governance_tally_typed("ref-1")
locks = client.get_governance_locks_typed("ref-1")
unlock_stats = client.get_governance_unlock_stats_typed()

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Runtime reads expose the active ABI and any pending upgrade records.
abi = client.get_runtime_abi_active_typed()
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed()
upgrades = client.list_runtime_upgrades_typed()
capabilities = client.get_node_capabilities_typed()

print(abi, abi_hash, runtime_metrics)
print(upgrades.total, capabilities.abi_version)
```

Os auxiliares de atualização de tempo de execução aceitam a forma do manifesto usada pela atualização do tempo de execução API. São ações do operador, por isso use-as apenas contra um nó onde sua conta e token estão autorizados:

```python
admin = create_torii_client(
    TORII_URL,
    auth_token="admin-token",
api_token="torii-token",
)

# Propose creates the upgrade instructions; activation/cancel are operator actions.
upgrade = admin.propose_runtime_upgrade(
    {
        "name": "Refresh runtime provenance",
        "description": "Schedules a no-ABI-change runtime rollout.",
        "abi_version": 1,
        "abi_hash": "00" * 32,
        "added_syscalls": [],
        "added_pointer_types": [],
        "start_height": 1_500_000,
        "end_height": 1_500_256,
    }
)
print(upgrade["tx_instructions"])

admin.activate_runtime_upgrade("deadbeef" * 4)
admin.cancel_runtime_upgrade("feedface" * 4)
```

## Estatuto, consenso e telemetria de rede {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time endpoints expose consensus and clock diagnostics.
sumeragi = client.get_sumeragi_status_typed()
print(sumeragi.highest_qc.height, sumeragi.tx_queue.saturated)

time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)
```

## SoraFS, UAID e Kaigi Auxiliares {#sorafs-uaid-and-kaigi-helpers}

Estes auxiliares estão disponíveis quando o nó-alvo expõe os pontos finais Nexus/SORA correspondentes. Trate as listas vazias como uma resposta válida: o público Taira pode ter a rota ativada sem dados para o manifesto de amostra ou UAID.

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

# Kaigi health summarizes relay availability when the route is enabled.
health = client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC e GPU Auxiliares {#norito-rpc-and-gpu-helpers}

Use `NoritoRpcClient` quando você já tem bytes Norito e precisa ligar a um endpoint binário Torii. O exemplo requer um envelope assinado de um modelo anterior de transação:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

Os auxiliares CUDA retornam `None` quando o backend não está disponível, de modo que as aplicações podem voltar a ser implementadas em escala:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Cobertura atual {#current-coverage}

O Python SDK já inclui auxiliares para:

- Torii fluxos de submissão, status, consulta e administração
- Construtores de instruções tipográficas para extensões comuns ISI e específicas de domínio
- Esboços de transações, manifestos, assinaturas e fluxos de trabalho de envelopes de transações assinadas
- Eventos de streaming, filtros e cursores reiniciáveis
- acessos de prontidão genéricos Kagemusha e auxiliares de assinatura Torii; não são expostos os construtores de reabastecimento e resgate digitados
- Endereço da conta, auxiliares de assinatura de todos os algoritmos, viagens de ida e volta multihash, SM2, GOST, ML-DSA, BLS e manipulação confidencial de chaves.
- Conectar URIs, sessões, quadros, auxiliares de criptografia e administrador do registro.
- governança, atualização do tempo de execução, Sumeragi, endpoint wrappers node-admin, SoraFS, UAID e Kaigi onde o nó expõe essas características

## Referências a montante {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Esses arquivos são a fonte de verdade para a superfície Python na revisão do espaço de trabalho fixado.
