---
translation_locale: pt
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ativos do mundo real {#real-world-assets}

Ativos do mundo real (RWAs) modelo de ativos fora da cadeia cuja propriedade ou controle é rastreado na cadeia. Em Iroha, um RWA é um lote registrado no livro maior com um identificador gerado, uma conta do proprietário, uma quantidade, metadados comerciais, proveniência e controles opcionais do ciclo de vida.

Os RWAs são diferentes dos saldos numéricos de activos:

- Um activo numérico é um saldo fungível detido por uma conta.
- Um NFT é um registro único na cadeia com um só proprietário.
- Um RWA é um lote que pode conter metadados comerciais, quantidade, reservas, congelamento, estado de resgate, proveniência e política do controlador.

Usar RWAs quando o livro de conta precisar representar um lote específico fora da cadeia em vez de apenas um saldo fungível.

## Lot RWA {#rwa-lot}

Um lote de RWA contém:

- `id`: o identificador canônico RWA gerado, indicado como `<hash>$<domain>`;
- `owned_by`: a conta que detém atualmente o lote;
- `quantity`: a quantidade pendente representada pelo lote;
- `spec`: especificação de quantidade, tal como escala decimal
- `primary_reference`: o principal recibo, certificado, fatura ou referência de registro fora da cadeia;
- `status`: texto opcional sobre o estado da empresa
- `metadata`: campos compactos JSON utilizados para o contexto empresarial e a indexação
- `parents`: lotes de origem utilizados para a obtenção deste lote
- `controls`: contas do controlador, funções do controlador e operações de controlo habilitadas.
- `is_frozen` e `held_quantity`: estado do ciclo de vida aplicado pelo tempo de execução.

Mantenha a carga útil na cadeia compacta. Armazenar grandes documentos legais, relatórios de inspeção e pacotes de auditoria fora do WSV, em seguida, coloque um digest, URI, SoraFS caminho, ou referência manifesto nos metadados RWA.

## Identificadores {#identifiers}

O `RegisterRwa` não aceita uma chamada escolhida pelo chamador `id` e não aceita um campo `owner`. A autoridade de transacção torna-se a conta inicial `owned_by`, e o runtime gera o `RwaId` no domínio alvo.

A forma textual de um RWA ID é:

```text
<generated-hash>$<domain>
```

Por exemplo:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Os aplicativos devem armazenar o seu identificador de negócio em `primary_reference` ou `metadata`, e depois descobrir a `RwaId` gerada a partir de `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ou da rota exploradora definida após as autorizações da transação.

## Ciclo de vida {#lifecycle}

Os fluxos de trabalho comuns RWA incluem:

|Operação |Comportamento implementado |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Crie um lote gerado- ID em um domínio; a autoridade de transação torna-se `owned_by`. |
|`TransferRwa` |Transferir a quantidade para outra conta. Uma transferência completa pode alterar `owned_by`; uma transferência parcial cria um lote de filhos gerado. |
|`HoldRwa` |Quantidade de reserva: requer um controlador configurado e `hold_enabled`. |
|`ReleaseRwa` |Remover a quantidade mantida. Requer um controlador configurado e `hold_enabled`. |
|`FreezeRwa` |Bloquear operações do proprietário comum. Requer um controlador configurado e `freeze_enabled`. |
|`UnfreezeRwa` |Reactiva as operações de proprietário comum. Requer um controlador configurado e `freeze_enabled`. |
|`RedeemRwa` |Requer que o proprietário ou um controlador e `redeem_enabled` .|
|`MergeRwas` |Combinar quantidades de lotes parentais com o mesmo domínio e especificação em um lote infantil gerado. |
|`ForceTransferRwa` |Movimento de quantidade através de um fluxo de controlador. Requer um controlador configurado e `force_transfer_enabled`. |
|`SetRwaControls` |Requer o proprietário ou um controlador. |
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Actualizar os metadados do lote. Requer o proprietário ou um controlador; lotes congelados exigem um controlador. |

Não há instrução `UnregisterRwa` no código atual. Retirar um lote fora da cadeia com `RedeemRwa` quando a quantidade representada for entregue, consumida, liquidada ou removida de qualquer outra forma da circulação.

## Metadados e controles {#metadata-and-controls}

Usar metadados para fatos compactos que ajudem as aplicações a identificar e verificar o lote:

- Referência de classe de ativos, emissor, custodiador ou registro
- Identificadores de armazenamento, cofre, ISIN, fatura ou certificado
- Hashes de conteúdo para atestados e documentos legais
- SoraFS caminhos ou referências de manifesto para agrupamentos maiores de evidências
- Marcas de vencimento, jurisdição ou conformidade usadas por serviços fora da cadeia

O `RwaControlPolicy` implementado possui os seguintes campos:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

As contas e funções do controlador são permitidas para executar apenas as operações do controlador habilitadas pela bandeira booleana correspondente. A carga útil de controle atual não é uma política de transferência da lista de permisos e não contém regras `transfers` aninhadas.

## Perguntas, Eventos e APIs {#queries-events-and-apis}

Utilização [`FindRwas`](/pt/reference/queries.md#assets-nfts-and-rwas) para a lista registada RWA As aplicações que necessitam de actualizações ao vivo podem subscrever-se a [`Rwa` Eventos de dados](/pt/blockchain/filters.md#data-event-filters) para criação, mudança de proprietário, divisão, fusão, resgate, congelamento, descongelamento, detenção, libertação, transferência forçada, alterações de controlo, e eventos de metadados.

Torii expõe rotas de estado de cadeia como `/v1/rwas` e `/v1/rwas/query`, além de rotas exploradoras como `/v1/explorer/rwas` e `/v1/explorer/rwas/{rwa_id}` quando essa família de rotas está habilitada. Os clientes gerados devem preferir o documento ao vivo [`/openapi`](/pt/reference/torii-endpoints.md#common-endpoints) para a forma exata da resposta exposta por um nó.

### Tente em Taira {#try-it-on-taira}

Verifique se o Taira público já registrou lotes RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Listar as rotas RWA expostas no documento Taira OpenAPI em directo:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

A saída vazia `items` é esperada quando ainda não foram registados lotes públicos.

## Tenta. {#try-it}

Os exemplos a seguir usam o Python SDK superfícies de [Configuração compartilhada](/pt/guide/tutorials/python.md#shared-setup). Substituir a conta IDs, Chaves privadas, e lote gerado IDs com valores da sua própria rede antes de apresentar uma transacção.

### Descubra as rotas RWA API {#discover-rwa-api-routes}

Este exemplo de somente leitura pede a um nó Torii em execução que as rotas RWA voltadas para o aplicativo são habilitadas:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Se a lista estiver vazia, o nó pode ainda suportar instruções e consultas RWA através de outras Torii APIs, mas não está expondo a família de rotas opcionais JSON.

### Registre um recibo de armazém {#register-a-warehouse-receipt}

Usar um esboço quando uma ação comercial deve se tornar uma transacção assinada. O número do recibo de negócios entra em `primary_reference`; o livro-razão ID é gerado após a transacção comprometer-se.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Após os compromissos da transação, a lista é gerada RWA IDs. As rotas de estado de cadeia expõem o canônico IDs; use eventos ou explorador detalhe rotas quando você precisa combinar um ID de volta para `primary_reference` ou metadados:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Os nós habilitados para exploradores também podem retornar projeções mais ricas:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Transferência com retenção temporária {#transfer-with-a-temporary-hold}

Use o gerado RWA ID devolvido pela cadeia. Este exemplo assume que `alice` é o proprietário e também é configurado como um controlador com `hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Soltar a retenção quando o processo fora da cadeia estiver concluído:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Adicionar Metadados de Controle e Auditoria {#add-controls-and-audit-metadata}

Os controles e os metadados são separados. Usar controles para a política do controlador e metadados para fatos que as aplicações ou auditores precisam exibir:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Quantidade de resgate ou aposentadoria {#redeem-or-retire-quantity}

Quantidade de resgate quando o ativo fora da cadeia representado foi entregue, consumido, retirado; O lote deve ter: `redeem_enabled`, e o signatário deve ser o proprietário ou um controlador.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Congelamento durante a revisão da conformidade {#freeze-during-compliance-review}

Congelar muito quando uma revisão fora da cadeia deve bloquear as operações normais do proprietário. O assinante deve ser um controlador e o lote deve ter: `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Descongelar quando passar a revisão:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Recebimento da fatura {#invoice-receivable}

Representa uma fatura como um lote RWA, armazenando o número da fatura em `primary_reference` e os metadados. Após o registo, utilize a ID gerada para transferência e resgate.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Quando o crédito for financiado ou pago, use a parte da fatura gerada ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Resgatar o montante representado após liquidação fora da cadeia:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Pensionamento de Crédito a Carbono {#carbon-credit-retirement}

Usar o resgate para retirar créditos depois de serem reclamados. Os metadados apontam para o certificado fora da cadeia ou a prova do registro:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Combinar dois lotes {#merge-two-lots}

Merger lotes quando duas posições fora da cadeia são consolidadas. Os pais devem estar no mesmo domínio e usar a mesma especificação de quantidade. O tempo de execução gera o lote filho ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Para obter o exemplo completo da transação Python, ver [Ativos do mundo real ](/pt/guide/tutorials/python.md#real-world-assets).

## Documentos relacionados {#related-docs}

- [Ativos](/pt/blockchain/assets.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Iroha Instruções especiais](/pt/blockchain/instructions.md)
- [Questões](/pt/reference/queries.md#assets-nfts-and-rwas)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md#app-and-sora-route-families)
