---
translation_locale: pt
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ativos do Mundo Real {#real-world-assets}

Ativos do mundo real (RWAs) modelam ativos off-chain cuja propriedade ou controle é rastreado on-chain. Em Iroha, um RWA é um lote registrado em um livro-razão blockchain com um identificador gerado, uma conta de proprietário, uma quantidade, metadados de negócios, proveniência e controles de ciclo de vida opcionais.

RWAs são diferentes dos saldos de ativos numéricos:

- um ativo numérico é um saldo fungível mantido por uma conta
- um NFT é um registro único na blockchain com um proprietário
- um RWA é um lote que pode carregar metadados de negócios, quantidade, retenções, congelamentos, estado de resgate, proveniência e política do controlador

Use RWAs quando o livro-razão da blockchain precisar representar um lote específico fora da cadeia em vez de apenas um saldo fungível.

## RWA Lote {#rwa-lot}

Um lote RWA contém:

- `id`: o identificador canônico gerado RWA, exibido como `<hash>$<domain>`
- `owned_by`: a conta que atualmente possui o lote
- `quantity`: a quantidade pendente representada pelo lote
- `spec`: especificação de quantidade, como escala decimal
- `primary_reference`: o principal registro de resultado do protocolo off-chain, certificado, fatura ou referência de registro
- `status`: texto opcional sobre o status do negócio
- `metadata`: campos compactos JSON usados para contexto de negócios e indexação
- `parents`: lotes de origem usados para derivar este lote
- `controls`: contas de controlador, funções de controlador e operações de controlador habilitadas
- `is_frozen` e `held_quantity`: estado do ciclo de vida imposto pelo tempo de execução do software

Mantenha a carga útil na cadeia compacta. Armazene grandes documentos jurídicos, relatórios de inspeção e pacotes de auditoria fora do WSV, depois coloque um valor de resumo criptográfico, URI, caminho SoraFS ou referência de manifesto técnico nos metadados RWA.

## Identificadores {#identifiers}

`RegisterRwa` não aceita um `id` escolhido pelo chamador, e não aceita um campo `owner`. O principal de autorização de transação se torna a conta `owned_by` inicial, e o tempo de execução do software gera o `RwaId` no domínio de destino.

A forma textual de um ID RWA é:

```text
<generated-hash>$<domain>
```

Por exemplo:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

As aplicações devem armazenar seu identificador de negócio em `primary_reference` ou `metadata`, e então descobrir o `RwaId` gerado a partir de `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ou da rota do explorador definida após a confirmação da transação.

## Ciclo de vida {#lifecycle}

Fluxos de trabalho comuns RWA incluem:

|Operação|Comportamento implementado|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |Criar um lote de ID gerado em um domínio; o principal de autorização de transação se torna `owned_by`.|
| `TransferRwa`                              |Mover a quantidade para outra conta. Uma transferência completa pode alterar `owned_by`. Uma transferência parcial cria um lote filho separado com um ID gerado.|
| `HoldRwa`                                  |Reservar quantidade. Requer um controlador configurado e `hold_enabled`.|
| `ReleaseRwa`                               |Remover quantidade retida. Requer um controlador configurado e `hold_enabled`.|
| `FreezeRwa`                                |Bloquear operações normais do proprietário. Requer um controlador configurado e `freeze_enabled`.|
| `UnfreezeRwa`                              |Reativar operações normais do proprietário. Requer um controlador configurado e `freeze_enabled`.|
| `RedeemRwa`                                |Subtrair permanentemente a quantidade de circulação. O proprietário ou um controlador pode enviá-la quando `redeem_enabled` for verdadeiro.|
| `MergeRwas`                                |Combine quantidades de lotes principais com o mesmo domínio e especificação em um lote filho gerado.|
| `ForceTransferRwa`                         |Mover quantidade através de um fluxo de controlador. Requer um controlador configurado e `force_transfer_enabled`.|
| `SetRwaControls`                           |Substitua a política de controle de lote. Requer o proprietário ou um controlador.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Atualizar metadados do lote. Requer o proprietário ou um controlador; lotes congelados exigem um controlador.|

Não há instrução `UnregisterRwa` no código atual. descomissionar um lote off-chain com `RedeemRwa` quando a quantidade representada for entregue, consumida, liquidada ou de outra forma removida de circulação.

## Metadados e Controles {#metadata-and-controls}

Use metadados para fatos compactos que ajudam os aplicativos a identificar e verificar o lote:

- classe de ativo, emissor, custodiante ou referência de registro
- armazém, cofre, ISIN, fatura ou identificadores de certificado
- hashes criptográficos de conteúdo para atestados e documentos legais
- SoraFS caminhos ou referências de manifesto técnico para pacotes de evidências maiores
- maturidade, jurisdição ou etiquetas de conformidade usadas por serviços fora da cadeia

O `RwaControlPolicy` implementado possui estes campos:

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

Contas e funções do controlador podem realizar apenas as operações habilitadas pelas flags booleanas correspondentes. O payload de controle atual contém identidades de controladores e flags de operação. Listas de permissão de transferência e regras aninhadas `transfers` estão fora deste payload.

## Consultas, Eventos e APIs {#queries-events-and-apis}

Usar [`FindRwas`](/pt/reference/queries.md#assets-nfts-and-rwas) listar registrado RWA muitos. Aplicativos que precisam de atualizações em tempo real podem se inscrever em [`Rwa` eventos de dados](/pt/blockchain/filters.md#data-event-filters) para criado, proprietário-alterado, dividido, mesclado, resgatado, congelado, descongelado, eventos de mantido, liberado, transferido por força, controle alterado e metadados.

Torii expõe rotas do estado da cadeia, tais como `/v1/rwas` e `/v1/rwas/query`, mais explorar rotas como `/v1/explorer/rwas` e `/v1/explorer/rwas/{rwa_id}` quando essa família de rotas estiver habilitada. Os clientes gerados devem preferir a versão ao vivo [`/openapi.json`](/pt/reference/torii-endpoints.md#common-endpoints) documento para o formato exato de resposta exposto por um nó.

### Experimente em Taira {#try-it-on-taira}

Verifique se o público Taira atualmente possui lotes registrados RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Liste as rotas RWA expostas pelo documento Taira OpenAPI ao vivo:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

A saída vazia `items` é esperada quando nenhum lote público foi registrado ainda. Registro, transferência, retenção, congelamento e resgate são transações assinadas.

## Experimente {#try-it}

Os exemplos abaixo usam as superfícies Python SDK de [Configuração Compartilhada](/pt/guide/tutorials/python.md#shared-setup). Substitua os IDs de conta, chaves privadas e IDs de lote gerados por valores da sua própria rede antes de enviar uma transação.

### Descubra as Rotas RWA API {#discover-rwa-api-routes}

Este exemplo somente leitura pergunta a um nó Torii em execução quais rotas RWA voltadas para o aplicativo estão habilitadas:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Se a lista estiver vazia, o nó ainda pode suportar instruções e consultas RWA através de outros Torii APIs, mas não está expondo a família de rotas opcional JSON.

### Registrar um registro de resultado de protocolo de armazém {#register-a-warehouse-receipt}

Use um rascunho quando uma ação comercial deve se tornar uma transação assinada. O número do registro do resultado do protocolo comercial vai em `primary_reference`; o ID do livro razão do blockchain é gerado após a confirmação da transação.

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

Após a transação ser confirmada, liste os IDs gerados RWA. As rotas do estado da cadeia expõem os IDs canônicos; use eventos ou rotas de detalhes do explorador quando precisar corresponder um ID de volta para `primary_reference` ou metadados:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Nós com suporte ao Explorer também podem retornar projeções mais ricas:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Transferência com Retenção Temporária {#transfer-with-a-temporary-hold}

Use o ID gerado RWA retornado pela cadeia. Este exemplo assume que `alice` é o proprietário e também está configurado como um controlador com `hold_enabled`.

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

Envie `ReleaseRwa` após o processo off-chain ser bem-sucedido:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Adicionar Controles e Metadados de Auditoria {#add-controls-and-audit-metadata}

Controles e metadados são separados. Use controles para a política do controlador e metadados para fatos que aplicativos ou auditores precisam exibir:

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

### Resgatar ou desativar Quantidade {#redeem-or-retire-quantity}

Envie `RedeemRwa` após o ativo off-chain representado ser entregue, consumido, descomissionado ou removido de circulação. Isso subtrai permanentemente a quantidade enviada do lote. O lote deve ter `redeem_enabled`. O signatário criptográfico deve ser o proprietário ou um controlador.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Congelar Durante Revisão de Conformidade {#freeze-during-compliance-review}

Envie `FreezeRwa` quando uma revisão off-chain deve bloquear operações normais do proprietário. O signatário criptográfico deve ser um controlador. O lote deve ter `freeze_enabled`.

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

Envie `UnfreezeRwa` após a aprovação da revisão:

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

### Fatura a Receber {#invoice-receivable}

Represente uma fatura como um lote RWA armazenando o número da fatura em `primary_reference` e os metadados. Após o registro, use o ID gerado para transferência e resgate.

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

Quando o recebível for financiado ou pago, use o ID do lote de fatura gerado:

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

Resgatar o valor representado após a liquidação fora da cadeia:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Cancelamento de créditos de carbono {#carbon-credit-retirement}

Envie `RedeemRwa` para remover créditos de carbono reivindicados da circulação. Armazene o certificado fora da cadeia ou a prova de registro nos metadados:

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

### Mesclar Dois Lotes {#merge-two-lots}

Combine lotes quando duas posições off-chain são consolidadas. Os pais devem estar no mesmo domínio e usar a mesma especificação de quantidade. O tempo de execução do software gera o ID do lote filho.

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

Para o exemplo completo de transação Python, veja [Ativos do Mundo Real](/pt/guide/tutorials/python.md#real-world-assets).

## Documentos Relacionados {#related-docs}

- [Ativos](/pt/blockchain/assets.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Iroha Operações de instrução](/pt/blockchain/instructions.md)
- [Consultas](/pt/reference/queries.md#assets-nfts-and-rwas)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md#app-and-sora-route-families)
