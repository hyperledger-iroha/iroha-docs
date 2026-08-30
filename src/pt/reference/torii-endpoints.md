---
translation_locale: pt
translation_source: /reference/torii-endpoints.md
translation_source_hash: 995701cfca9594b88a0da73a5b582c75c5962449a9ccf150e65738d3656d4f02
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii Pontos finais {#torii-endpoints}

Torii é o HTTP, SSE, e WebSocket porta de entrada Iroha 3. Serve tanto para o livro-razão APIs e pontos finais do operador.

As regras do protocolo em vigor são as seguintes:

- O formato binário canônico é Norito
- Muitos endpoints também suportam JSON quando você envia `Accept: application/json`
- As métricas são expostas no formato Prometheus

Para detalhes de formato, negociação de conteúdo, bandeiras de layout, hashes de esquema e Norito RPC orientação, ver o [Norito Referência](/pt/reference/norito.md).

## Pontos finais comuns {#common-endpoints}

|Ponto final |Formatar |Propósito |
| ------------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions` |Norito |Submeter uma transacção assinada |
|`POST /v1/query` |Norito |Enviar uma consulta assinada |
|`GET /v1/events/ws` |WebSocket |Subscreva os fluxos de eventos |
|`GET /v1/events/sse` |SSE |Subscrever-se a fluxos de eventos em SSE |
|`GET /v1/blocks/stream` |WebSocket |Fluxo de blocos comprometidos |
|`GET /v1/peers` |JSON |Lista de pares expostas por Torii |
|`GET /livez` |Texto |A viabilidade só de processo; não implica a prontidão de protocolo |
|`GET /readyz` |JSON |Preparação completa do nó, incluindo as verificações obrigatórias de caixa offline |
|`GET /health` |JSON |Análise de prontidão com a mesma invariante offline-cash |
|`GET /v1/api/version` |Texto |Versão atual do bloco de cabeçalhos |
|`GET /status` |Norito ou JSON |Estatuto de diagnóstico de alto nível; solicitação expressa JSON |
|`GET /metrics` |Prometheus |Prometheus , ponto final de arranque .|
|`GET /v1/schema` |JSON |Impressão do esquema de modelo de dados servido pelo nó quando habilitado |
|`GET /openapi` ou `GET /openapi.json` |JSON |Documento OpenAPI para as rotas ativas Torii HTTP |
|`GET /v1/parameters` |JSON |Impressão de parâmetro do nó |
|`GET /v1/node/capabilities` |JSON |Capacidade do nodo e metadados do modelo de dados |
|`GET /v1/time/now` |JSON |Snapshot do nó de relógio de parede |
|`GET /v1/time/status` |JSON |Situação de sincronização do tempo |

Para uma solicitação SSE, anunciar o fluxo nativo mais um fallback digitado:

```http
Accept: text/event-stream, application/json
```

Torii primeiro negocia um JSON ou Norito representação na camada de solicitação, em seguida, valida o nativo `text/event-stream` Resposta. Envio apenas `text/event-stream` é, portanto, rejeitada com `406`; O [Receita para eventos de streaming](/pt/cookbook/stream-events.md) usa o cabeçalho completo.

`/openapi` É o contrato primário gerado para as rotas representadas no esquema, Não é um inventário completo da sonda operacional. `/livez` e `/readyz`, e do seu `/health` Descrição pode atrasar o processador de prontidão. Gerar clientes de rota a partir do documento ao vivo, Mas validar a vitalidade e prontidão diretamente contra o nó de corrida e os manipuladores apertados. A superfície exata ainda depende das características da construção e da configuração do tempo de execução. [Torii API consola](/pt/reference/torii-api-console.md) para carregar o documento ao vivo, teste JSON rotas, cópia curl solicitações, e gerar código do cliente a partir do esquema atual.

## Experimente as rotas ao vivo Taira {#try-live-taira-routes}

A rede de teste pública Taira expõe a mesma superfície Torii JSON que os clientes de aplicações usam para exploração somente leitura. Estes comandos não exigem chaves:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

Experimente o recurso diz contra a atual situação mundial:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Se uma rota de testnet pública retornar `502`, temporizar ou relatar uma fila saturada, trate-a como um problema de disponibilidade do endpoint e tente novamente mais tarde antes de depurar o código do cliente.

## Consenso e pontos finais do tempo de execução {#consensus-and-runtime-endpoints}

|Ponto final .|Formatar |Propósito |
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates` |JSON |Resumos recentes dos certificados de compromisso |
|`GET /v1/sumeragi/validator-sets` |JSON |Histórico de configuração do validador |
|`GET /v1/sumeragi/validator-sets/{height}` |JSON |Validador definido a uma altura de bloco |
|`GET /v1/sumeragi/status` |Norito ou JSON |Imagem detalhada do estado de consenso |
|`GET /v1/sumeragi/status/sse` |SSE |Fluxo contínuo de status de consenso |
|`GET /v1/sumeragi/leader` |JSON |Informações atuais sobre os líderes |
|`GET /v1/sumeragi/qc` |Norito ou JSON |Último resumo do certificado de quórum |
|`GET /v1/sumeragi/checkpoints` |JSON |Resumo de pontos de controlo de consenso |
|`GET /v1/sumeragi/consensus-keys` |JSON |Chaves de consenso ativas |
|`GET /v1/sumeragi/bls_keys` |JSON |Técnicas de consenso activas BLS |
|`GET /v1/sumeragi/phases` |JSON |Última amostra de latência por fase |
|`GET /v1/sumeragi/rbc` |JSON |RBC métricas de sessão e de tráfego |
|`GET /v1/sumeragi/rbc/sessions` |JSON |Impressão de sessão ativa RBC |
|`GET /v1/sumeragi/pacemaker` |JSON |Estatuto do pacemaker |
|`GET /v1/sumeragi/params` |JSON |Parâmetros de corrente em cadeia Sumeragi |
|`GET /v1/sumeragi/collectors` |JSON |Impressão do plano de colecionador determinista |
|`GET /v1/sumeragi/key-lifecycle` |JSON |Status do ciclo de vida da chave de consenso |
|`GET /v1/sumeragi/telemetry` |JSON |Imagem de telemetria de consenso |
|`GET /v1/sumeragi/evidence` |JSON |Registros de provas, opcionalmente filtrados por cadeia de consulta |
|`GET /v1/sumeragi/evidence/count` |JSON |Contagem dos registos de evidências .|
|`POST /v1/sumeragi/evidence/submit` |JSON |Submeter provas de consenso |
|`GET /v1/sumeragi/commit_qc/{hash}` |Norito ou JSON |Cometer QC registro para um hash de bloco |
|`GET /v1/runtime/abi/active` |JSON |Descrição do tempo de execução ativo ABI |
|`GET /v1/runtime/abi/hash` |JSON |Atividade de execução ABI hash |
|`GET /v1/runtime/metrics` |JSON |Impressão de métricas de tempo de execução |
|`GET /v1/runtime/upgrades` |JSON |Lista de atualização do tempo de execução |
|`POST /v1/runtime/upgrades/propose` |JSON |Proponha uma atualização do tempo de execução .|
|`POST /v1/runtime/upgrades/activate/{id}` |JSON |Ativar uma proposta de atualização do tempo de execução |
|`POST /v1/runtime/upgrades/cancel/{id}` |JSON |Cancelar uma atualização de tempo de execução proposta |

## Aplicativo e SORA Famílias de rota {#app-and-sora-route-families}

Quando Torii é construído com o conjunto de recursos voltados para aplicativos, ele expõe famílias adicionais JSON para exploradores, serviços SORA, fluxos de pontes, provas e armazenamento.

`/openapi` descreve as rotas registadas no catálogo da app-API gerada; é autorizado para as entradas que contém, não para todas as rotas montadas Em particular, as rotas locais públicas SoraFS CID e conhecidas são montadas fora do documento gerado e devem ser examinadas diretamente.

|Família da rota |Propósito |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/`, `/v1/domains/`, `/v1/assets/*` |JSON leituras, auxiliares de consulta, auxiliares para embarque e visualizações do portfólio ou dos titulares |
|`/v1/nfts/`, `/v1/rwas/`, `/v1/confidential/*` |NFT, ativos do mundo real e visões confidenciais de activos |
|`/v1/aliases/`, `/v1/assets/aliases/`, `/v1/sns/`, `/v1/identifiers/` |Nome, alias e resolução do identificador |
|`/v1/explorer/*` |Contas, ativos, blocos, transações, instruções, métricas e visualizações de fluxo orientadas para exploradores |
|`/v1/transactions/`, `/v1/pipeline/`, `/v1/iso20022/*` |Histórico de transacções, recuperação ou estado do gasoduto e ISO 20022 auxiliares |
|`/v1/contracts/*` |Código de contrato, implantação, pacote, chamada, visualização, evento, atividade, roll-up e rotas de estado |
|`/v1/multisig/`, `/v1/controls/` |Propostas, aprovações e auxiliares de controlo das transferências multisig |
|`/v1/bridge/`, `/v1/ledger/`, `/v1/proofs/*` |Finalidade, prova de estado, prova de bloco, retenção de provas e rotas de consulta de provas |
|`/v1/da/*` |A ingestão de dados disponíveis, os manifestos, as políticas de prova, os compromissos e as intenções específicas |
|`/v1/zk/*` |ZK raízes, verificação de provas, comprovação de IVM, contagem de votos, chaves de verificação, registos de provas e anexos |
|`/v1/gov/`, `/v1/ministry/` |Propostas de governança, folhetos de votação, estado do conselho, espaços de nome protegidos, propostas de ordem do dia, promulgação e finalização.|
|`/v1/nexus/`, `/v1/sccp/` |Nexus faixa, espaço de dados, e auxiliares de prova cruzada.|
|`/v1/musubi/*` |Musubi leituras do registo de pacotes e construção de instruções |
|`/v1/subscriptions/*` |Planejamento de assinatura, ciclo de vida da assinatura, utilização e cobrança de assistentes |
|`/v1/sorafs/`, `/sorafs/`, `/.well-known/sorafs/*` |SoraFS descoberta do fornecedor, comprovação de capacidade, fixação, recolha de armazenamento e serviço público de conteúdo |
|`/v1/soracloud/`, `/v1/soradns/`, `/soradns/`, `/api/` |SoraCloud ciclo de vida do serviço, fluxos de computação privada/modelo, descoberta pública e roteamento de aplicativos hospedados |
|`/v1/connect/`, `/v1/vpn/` | Iroha Conectar sessões, WebSocket Transportes, VPN sessões, perfis e recibos                                         |
|`/v1/app-api/`, `/v1/api/`, `/v1/content/*` |Aplicações API ligações e pacotes / roteamento de conteúdo apoiado por CID |
|`/v1/operator/*`, `/v1/mcp` |A autenticação do operador e a ponte nativa MCP JSON-RPC |
|`/v1/offline/`, `/v1/repo/`, `/v1/space-directory/`, `/v1/ram-lfe/` |Preparação offline, acordos de repositório, manifestos do espaço de dados e assistentes [RAM-LFE ](/pt/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`, `/v1/notify/`, `/v1/telemetry/` |Colaboração, webhook, notificação push e integrações de telemetria ao vivo |

## Cursores de autenticação de contas, visibilidade e explorador {#account-authentication-visibility-and-explorer-cursors}

### Protocolo de Solicitação de Conta no App {#app-account-request-protocol}

As rotas orientadas para aplicativos não aceitam cabeçalhos de autenticação, uma prova direta de chave única ou um testemunho multisig.

Para uma prova direta, envia os quatro cabeçalhos juntos:

- `X-Iroha-Account`: o hex de endereço de conta canônico exato `0x` ou um alias ativo da conta canônica ASCII. O texto I105 não é seguro como valor do campo HTTP; use a ortografia canônica do hex para essa conta.
- `X-Iroha-Signature`: a carga útil de assinatura com padded-base64 rigorosa.
- `X-Iroha-Timestamp-Ms`: uma marca de tempo decimal Unix canónica sem assinatura em milissegundos, dentro da janela de desvio configurada.
- `X-Iroha-Nonce`: de 1 a 256 bytes impressíveis ASCII (`0x21` até `0x7e`), únicos na janela de reprodução.

O controlador de chave única registrado assina estes bytes exatos:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

A construção de consultas canônicas analisa a consulta em bruto como `application/x-www-form-urlencoded` (`+` significa espaço), por cento decodifica seus pares, os classifica por `(key, value)` e codifica-os novamente no formulário. O protocolo admite no máximo 64 pares decodificados e 64 KiB de texto bruto da consulta. Hash os bytes do corpo exatamente como transmitido. Não inserir um separador entre a rede fixa de 32 bytes ID e o método em maiúsculas.

O verificador V1 também limita o token do método a 32 bytes, o caminho de solicitação codificado em porcentagem a 64 KiB, e uma identidade da conta direta a 36 KiB antes da análise. Os pseudónimos de conta têm o limite estrutural mais rígido de três segmentos de nome mais os seus separadores.

Em vez disso, um controlador multisig deve enviar `X-Iroha-Witness` como estritamente padded-base64 canônica Norito e omitir `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms`, e `X-Iroha-Nonce`. `X-Iroha-Account` é facultativo nesta forma; quando presente, deve ser igual à testemunha. `subject_account`. A Comissão `CanonicalRequestWitnessV1` contém `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, um Iroha `Hash` do requisito de rede exata bytes através da digestão do corpo, mas sem Os campos de frescura e o máximo de 64 assinaturas dos membros. Norito A codificação da mesma carga útil sem a matriz de assinaturas. O testemunho codificado tem um limite de 1 MiB.

Não fornecer cabeçalhos de autenticação seleciona o acesso anônimo. O fornecimento de qualquer prova parcial, misturada, repetida, malformada, obsoleta ou reproduzida falha na autenticação; nunca volta à visibilidade anónima.

### Protocolo de solicitação do operador {#operator-request-protocol}

As rotas marcadas como autenticadas pelo operador exigem todos os quatro cabeçalhos individuais:

- `x-iroha-operator-public-key`: a chave pública canónica Iroha multihash.
- `x-iroha-operator-timestamp-ms`: o selo de tempo Unix decimal não assinado canônico em milissegundos.
- `x-iroha-operator-nonce`: de 1 a 256 bytes impressíveis ASCII, únicos para essa chave na janela de reprodução.
- `x-iroha-operator-signature`: a carga útil de assinatura com padded-base64 rigorosa.

Os valores dos cabeçalhos não devem conter espaço branco circundante.

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

As regras de caminho, consulta, corpo, timestamp e nonce são as mesmas regras canônicas usadas pelo protocolo do aplicativo. A chave também deve ser admitida por `[torii.operator_signatures]`: listá-la em `allowed_public_keys`, ou ativar explicitamente `allow_node_key` ao usar a chave do nó. Quando o cache de repetição está saturado, Torii rejeita a solicitação com `503 Service Unavailable`. A autenticação opcional do operador WebAuthn ou mTLS é um fator adicional e nunca substitui essa assinatura exata.

As rotas ISO 20022 aplicam duas verificações independentes. O pedido deve primeiro passar por este protocolo de autorização e assinatura do operador; o manipulador ISO requer, em seguida, a mesma chave para ocupar o papel exato de participante ou auditoria descrito abaixo.

### Visibilidade do Ledger e cursores do explorador {#ledger-visibility-and-explorer-cursors}

As leituras do livro-razão de aplicativos usam o limite opcional da conta do aplicativo acima. Uma solicitação não assinada recebe apenas bancos de dados configurados como públicos. Espaços de dados vinculados à corrente UAID do chamador, cada espaço de dados restrito designado por uma permissão exata `CanReadRestrictedDataspace { dataspace }`, ou todas as rotas quando a conta possui `CanReadAllLedgerData`.

O mesmo objeto de visibilidade filtra conta, domínio, definição de ativo, ativo, NFT, RWA, detentor e Explorer. Um objeto ausente e um objeto que está fora das rotas visíveis do chamador são intencionalmente indistinguíveis. O histórico de transações e instruções comprometidas só é mostrado quando cada etapa de rota registrada para a transação é visível. Portanto, oculta quando até mesmo uma perna do participante está fora do escopo da chamada; o contexto de roteamento faltante, obsoleto ou mal formado é visível apenas para um leitor global.

As seis coleções do Explorer com suporte mundial usam cursores de conjunto de teclas base64url canônicos opacos. O limite padrão da página é 25, o máximo é 100, e uma página inspeciona no máximo 512 chaves candidatas. Cada cursor está ligado à sua coleção, filtros, última chave canônica e digest de rota-set visível do chamador, por isso não pode ser reproduzido em outra consulta ou depois que a visibilidade do chamador muda.

Os cursores de bloco, transação, última transação, instrução e histórico de instruções mais recentes também identificam a altura do snapshot comprometido e o hash do bloco. As respostas expõem `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` e `pagination.has_more`. Torii rejeita um cursor para outra rota ou conjunto de filtros, um digesto de visibilidade alterado ou um snapshot que o nó não pode mais validar. A digitalização do histórico permanece dentro da permissão de admissão de consulta do Torii enquanto o trabalhador bloqueador executa.

Os fluxos de explorador WebSocket emitem resumos filtrados e recomputam a visibilidade à medida que as permissões do livro-razão mudam. A rota nativa `GET /v1/blocks/stream` é diferente: emite completa blocos assinados, requer `CanReadAllLedgerData` durante o aperto de mão, e fecha se essa permissão for revogada mais tarde. Não use o fluxo nativo para um explorador com espaço de dados.

## Ponte ISO 20022 {#iso-20022-bridge}

Torii expõe a ponte ISO 20022 sob `/v1/iso20022/*` quando estiver ativada a aplicação voltada para API e o tempo de execução da ponte. A ponte tem um alcance intencional: Não é um gateway de compensação ISO 20022 de finalidade geral, mas um subconjunto suportado para a transformação de mensagens de pagamento selecionadas em transferências assinadas Iroha e para o acompanhamento do seu status no livro-razão.

Configure um local duradouro `torii.iso_bridge.store_dir` antes de admitir qualquer submissão. O campo de configuração é opcional apenas para que um nó possa iniciar para uso somente de leitura ou diagnóstico: Todas as apresentações autenticadas ISO requerem o diretório e retornam retryable `503 Service Unavailable` quando a persistência estiver ausente ou uma pedra-tombstone de repetição ou gravação de registos ricos falhar.

### Endpoints ISO 20022 do Torii {#torii-iso-20022-endpoints}

| Método e endpoint | Finalidade |
| --- | --- |
| `POST /v1/iso20022/pacs008` | Enviar uma transferência de crédito de cliente FI para FI e construir a transferência de ativos Iroha correspondente |
| `POST /v1/iso20022/pacs009` | Enviar uma transferência de crédito FI para FI usada para PvP ou financiamento em dinheiro relacionado a valores mobiliários |
|`POST /v1/iso20022/pacs002` |Submeter um relatório de estado de pagamento pertencente à contraparte; necessidades de liquidação Evidências de transacções comprometidas |
|`POST /v1/iso20022/pacs004` |Enviar uma declaração de pagamento pertencente à contraparte |
|`POST /v1/iso20022/camt056` |Submeter um pedido de anulação do pagamento pertencente ao originador |
| `POST /v1/iso20022/sese023` | Enviar uma instrução de liquidação de valores mobiliários |
|`POST /v1/iso20022/sese024` |Enviar uma mensagem sobre o status da liquidação de valores mobiliários pertencentes à contraparte |
|`POST /v1/iso20022/sese025` |Submeter uma confirmação de liquidação de títulos pertencentes a contrapartes |
| `POST /v1/iso20022/colr012` | Enviar uma mensagem de substituição de garantias |
| `GET /v1/iso20022/messages/{msg_id}` | Ler o registro canônico da ponte para uma mensagem |
| `GET /v1/iso20022/audit/messages` | Ler o manifesto de auditoria de mensagens com evidência de adulteração |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | Gerar o status de pagamento atual como XML `pacs.002` |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | Gerar a devolução de pagamento atual como XML `pacs.004` |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | Gerar a resolução de cancelamento atual como XML `camt.029` |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | Gerar o status de liquidação atual como XML `sese.024` |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | Gerar a confirmação de liquidação atual como XML `sese.025` |

As submissões `pacs.008` devem fornecer o ID da mensagem, o valor da liquidação
interbancária, a moeda, a data de liquidação, os IBANs do devedor e do credor e
seus BICs. Quando há dados de referência configurados, a ponte também verifica
os mapeamentos de BIC, IBAN e moeda ISO 4217 antes de a transação gerada entrar
no pipeline.

As submissões `pacs.009` devem fornecer o ID da mensagem de negócio, o ID da
definição da mensagem, o horário de criação, o valor da liquidação
interbancária, a moeda, a data de liquidação, os BICs dos agentes instrutor e
instruído e os IBANs do devedor e do credor. Se a mensagem incluir `Purp`, a
ponte só aceita financiamento destinado a valores mobiliários: `Purp=SECU`.

Os endpoints de submissão `pacs.008` e `pacs.009` aceitam envelopes XML ISO ou
o formato de campos simples usado pelos testes da ponte. Os campos opcionais
`SplmtryData` podem fixar o livro-razão Iroha de destino, os IDs ou endereços das
contas de origem e destino e o ID da definição de ativo. A resposta é
`202 Accepted` e inclui `message_id`, `transaction_hash`, `status`,
`pacs002_code` e o contexto resolvido do livro-razão, das contas e do ativo.

### Autorização do participante e propriedade do ciclo de vida {#participant-authorization-and-lifecycle-ownership}

Cada ponte habilitada possui um catálogo de participantes. Cada entrada de participante tem um participante único ID, uma ou mais chaves públicas do operador, um ou mais identificadores financeiros, um conjunto de perfis permitidos e o `originator`, `counterparty`, ou ambas as funções. As chaves de operador e os identificadores financeiros não podem pertencer a mais de um participante. Configure separadamente `audit_admin_keys`; uma chave de auditoria-admin também não pode ser uma chave de mutação de participante.

Todas as rotas ISO exigem uma nova assinatura do operador. Para uma apresentação inicial de `pacs.008`, `pacs.009`, `sese.023` ou `colr.012`, o operador autenticado deve pertencer ao participante identificado pela identidade financeira do cabeçalho da inscrição `From` . A identidade `To` deve ser resolvida para um participante configurado com o papel de `counterparty` e o perfil selecionado deve ser permitido para ambas as partes. A admissão duradoura registra o originador, a contraparte, o participante admitido e a chave do operador, bem como o perfil original e a política de assinatura embutida.

A autorização do ciclo de vida é derivada desse registro imutável em vez de valores selecionados pelo chamador:

|Mensagem do ciclo de vida |Participante requerido |
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`, `sese.024`, `sese.025` |Contraparte original com o papel de `counterparty` |
|`camt.056` |Originário com o papel de `originator` |

O perfil original e a política de assinatura permanecem fixados para todo o período ciclo de vida, para que o chamador não possa selecionar um perfil mais fraco para uma atualização. A `pacs.002` Código que representa liquidação (`ACSC`, `ACCP`, `SETT`, ou `SETTLED`) altera o registo original para liquidado apenas quando: Torii Comprometeu provas de transacção.

Qualquer parte original pode ler o seu registo de mensagens e os documentos da caixa de saída gerados. O ponto final de auditoria retorna apenas registros em que o participante autenticado é o originador ou contraparte. Um administrador de auditoria configurado separadamente recebe uma visão global de auditoria apenas para leitura e não pode enviar ou alterar mensagens.

### Identidade de reprodução duradoura e documentos de caixa externa assinados {#durable-replay-identity-and-signed-outbox-documents}

Replay tombstones são o limite estrito de admissão. Torii aborta a inicialização para uma lápide ilegível, excessivamente grande, malformada, com nome errado, conflitante ou explícitamente incompatível. Ele também aborta para um registro rico com uma versão de esquema explicitamente incompatível, um participante, perfil ou política de assinatura ausente da configuração atual, ou uma lápide ao vivo faltante ou incomparável.

Outros danos em registros ricos são tratados de forma diferente: arquivos ilegíveis ou de tamanho excessivo, ficheiros inválidos JSON, registros inválidos de esquemas de corrente, nomes de arquivos não-canônicos e identidades de repetição conflitantes são registrados ou ignorados. Um índice de auditoria da versão atual não legível ou inválido é regenerado dos registos mantidos; apenas uma versão do índice de auditoria explicitamente incompatível aborta a inicialização. Monitore os registos de inicialização e conciliar o manifesto de auditoria regenerado em vez de supor que cada arquivo corrupto de registro rico impede o nodo de servir.

Cada registro rico manteve a proveniência imutável dos participantes. Uma lápide durável separada mantém a mensagem ID, hash de carga útil, mensagem de negócios ID e UETR para a deduplicação completa TTL mesmo após os detalhes do registro rico serem podados.

Torii persiste admissão de reprodução antes de assinar ou processar uma mensagem do ciclo de vida. Nunca despeja uma identidade de reprodução não expirada. é inteiramente ocupada por registos protegidos ou identidades de repetição não expiradas, as apresentações recebem `503 Service Unavailable` retrievable sem mutação do ciclo de vida ou estado contabilístico.

Cada geração `pacs.002`, `pacs.004`, `camt.029`, `sese.024`, ou `sese.025` O documento é devolvido como `application/xml` com os seguintes cabeçalhos de resposta:

|Cabeça|Que significa ?|
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain` |Sempre `iroha.iso20022.outbound.v2` |
|`X-Iroha-Iso-Signer` |A chave pública canônica para a assinatura do ponte configurada |
|`X-Iroha-Iso-Signature` |Base64 assinatura sobre os bytes XML separados por domínio |

Verificar a assinatura sobre o UTF-8 sequência de byte `iroha.iso20022.outbound.v2`, Não reformate ou normalize a resposta. XML antes da verificação.

### Suporte adicional de parceria e mapeamento {#additional-parser-and-mapping-support}

A Comissão IVM ISO A assistente também valida e materializa as seguintes famílias de mensagens para envelope a validação, o mapeamento de liquidações ou a reconciliação para baixo. Torii rotas.

|Família de mensagens |Apoio atual |
| --- | --- |
|`head.001` |Validação do cabeçalho da aplicação de negócios para os envelopes ISO, incluindo os campos `BizMsgIdr`, `MsgDefIdr`, tempo de criação e remetente/receptor opcionais BIC|
|`pacs.007`, `pacs.028`, `pacs.029` |Reversão do pagamento, pedido de status e resolução/análise do estado da investigação |
|`pain.001`, `pain.002` |Iniciação de pagamento do cliente e validação do relatório de estado de pagamento |
|`camt.052`, `camt.053`, `camt.054` |Relatório da conta, declaração e validação de notificações |

## Sessões Kaigi {#kaigi-sessions}

Kaigi fornece salas de áudio / vídeo em tempo real pagas no SORA Nexus. Use-o quando um aplicativo precisa da criação de sessões apoiadas por contabilidade, mudanças de listagem, manifestos de relevo, sinalização criptografada e medição de uso em vez de manter todo o estado de conferência off-chain.

O ciclo de vida orientado para a contabilidade é:

- `CreateKaigi`: criar uma chamada sob um domínio e armazenar a sua política, cronograma, metadados e manifesto opcional de relay.
- `JoinKaigi` e `LeaveKaigi`: atualizar a lista de chamadas. No modo privado, os participantes utilizam compromissos, anuladores e provas da lista em vez de expô-las diretamente à conta do participante IDs.
- `RecordKaigiUsage`: adicionar a duração medida e os totais dos gases.
- `EndKaigi`: fechar a sessão e registar o tempo final.

Torii expõe a telemetria de relevo no `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, e `/v1/kaigi/relays/events` quando o aplicativo API O estado da sessão é reflectido através do Kaigi eventos de domínio tais como `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, e `KaigiUsageSummary`.

### Teste de fumo CLI {#cli-smoke-test}

Em primeiro lugar, o `iroha kaigi` CLI deve ser utilizado para verificar se um ponto final Torii aceita transações Kaigi antes de ligar um UI. O comando quickstart cria uma sala temporária contra o endpoint ativo Torii e imprime um resumo com o identificador de chamada, o comando juntar-se e a sugestão do spool SoraNet:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

Para fluxos scripted, gerenciar o ciclo de vida da sala explicitamente:

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

Utilização `--room-policy public` para salas que os relés possam expor sem ingressos de espectador, ou `--room-policy authenticated` Quando as saídas devem exigir a autenticação do espectador. `--privacy-mode zk-roster-v1` Só depois que a rede tiver Kaigi Chaves de verificação da lista e do uso configuradas; juntas, folhas, e os registos privados de utilização falham durante a verificação determinista.

### Testes com a demonstração JavaScript {#testing-with-the-javascript-demo}

Use a demonstração de desktop [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) para um teste de carteira de ponta a ponta. A demonstração é uma aplicação Electron e Vue que conversa diretamente com Torii através da ligação local `@iroha/iroha-js` e inclui uma rota `/kaigi` para mídia nativa do navegador de um a um .

Use a demonstração com [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) do repositório de origem Iroha. Os pinos da demonstração são SDK até `file:../iroha/javascript/iroha_js`, então mantenha ambos os cheques neste layout:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

Use Node.js 20 ou mais recente e uma cadeia de ferramentas Rust para que o módulo nativo `iroha_js_host` possa ser construído. Reconstruir a SDK na caixa irmã Iroha após mudar sua fonte; o layout do pacote limpo não contém o espaço de trabalho Cargo necessário por `npm run build:native`.

Para um ensaio controlado, aponte a demonstração para um ponto final Kaigi capaz de Torii:

1. Inicie um nó Iroha com o aplicativo SORA/Kaigi voltado para APIs habilitado, ou use um ponto final público que expõe as superfícies Kaigi de que precisa.
2. Verifique a acessibilidade básica com `/health`, em seguida, verifique a superfície da rota ao vivo com `/openapi` ou `/openapi.json`. Algumas implementações também expõem `/v1/health`, mas `/health` é o controle de vida portátil. .
3. Para TAIRA, verifique as rotas de telemetria do relevo antes de tentar uma reunião ao vivo:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

Estas verificações comprovam que a telemetria de relevo Torii e Kaigi são acessíveis. Não criam uma reunião; `CreateKaigi` e `JoinKaigi` ainda precisam de carteiras financiadas e apresentação assinada de transacções.
4. Abra a demonstração, vá para Configurações, configure o Torii URL e deixe que o aplicativo carregue a cadeia ID e prefixo de rede do ponto final.
5. Criar ou restaurar duas carteiras locais na demonstração. Use janelas de aplicativos separadas, perfis ou máquinas para que o anfitrião e o convidado tenham estado de carteira separado.

Para testar o Kaigi UI:

1. Na janela de hospedagem, abra Kaigi, selecione Comece reunião, defina um título e escolha Convite Privado ou Convite Transparente.
2. Selecione Ligue a câmera e o microfone para que WebRTC tenha mídia local.
3. Selecione Criar um link de reunião. Uma carteira ao vivo envia `CreateKaigi`; o aplicativo mostra então um convite `iroha://kaigi/join?call=...&secret=...` e uma rota de retorno `#/kaigi?...`.
4. Mantenha a janela do anfitrião aberta e compartilhe o convite com o convidado.
5. Na janela de convidados, abra o convite ou coje-o na reunião Join, ative a mídia local e selecione Join meeting. Uma carteira ao vivo retira a oferta criptografada do host da Torii e envia a `JoinKaigi` com metadados criptografados da resposta.
6. O anfitrião deve aplicar automaticamente a primeira resposta através da transmissão ou pesquisa de sinais de chamada Kaigi. Ambas as janelas devem mostrar mídia conectada e detalhes de conexão atualizados.
7. Terminar a sessão do anfitrião, ou usar o comando CLI `iroha kaigi end` para a mesma ligação ID.

As necessidades privadas Kaigi protegidas XOR para pagar a taxa do ponto de entrada privado. Se a demonstração relatar que as necessidades privativas Kaigi protegidas XOR, use o prompt auto-proteção no aplicativo e tente novamente a ação criar ou participar. Se a geração de provas, financiamento privado ou sinalização ao vivo não estiver disponível, a demonstração pode voltar para um fluxo transparente / manual. Nesse caso, abra a sinalização avançada, copie a oferta crua ou o pacote de resposta e colete-o na outra janela.

Para verificações automatizadas no repo de demonstração, executar:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

As suítes Vitest focadas cobrem a criação de links de reunião Kaigi, carregamento compacto de convites, chamadas privadas de ponte de criação / junção / final, pedidos de auto-escudo, fallbacks manuais e pesquisas de resposta. O teste de fumaça UI inclui a rota `/kaigi` em portos de vista de desktop e móveis. Os meios de comunicação ao vivo entre duas carteiras ainda precisam de um teste manual de duas janelas porque as permissões da câmera/microfone do navegador e os fluxos de mídia peer são específicos para o ambiente.

Para o código de integração da amostra, veja [Embed Kaigi em um aplicativo JavaScript ](/pt/guide/tutorials/kaigi.md).

## Estatuto e métricas {#status-and-metrics}

Os endpoints de status e métricas são as primeiras coisas a ser incorporadas em painéis de controlo:

- `/status` expõe campos de peer, bloco, fila e consenso de nível superior
- `/metrics` expõe contadores Prometheus, medidores e histogramas

Em nós habilitados para Nexus, a saída de status também inclui seções conscientes da faixa e do espaço de dados. Quando `nexus.enabled = false`, essas secções são omitidas.

## JSON versus Norito {#json-vs-norito}

Vários endpoints do operador retornam Norito por padrão. Quando o endpoint suporta JSON, envie:

```http
Accept: application/json
```

Isto é especialmente útil para:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

Quando um ponto final aceita ou retorna digitado Norito diretamente, utilização `application/x-norito` como o tipo de conteúdo ou preferido `Accept` valor. Veja [Norito](/pt/reference/norito.md#torii-and-norito-rpc) para os pormenores de transporte.

## Perfis de telemetria {#telemetry-profiles}

A visibilidade do ponto final depende da configuração `telemetry.profile` do nó. A configuração atual expõe cinco níveis de perfil:

|Perfil .|`/status` |`/metrics` |Roteiras de desenvolvimento |
| --- | --- | --- | --- |
|`disabled` |- Não .|- Não .|- Não .|
|`operator` |Sim , sim .|- Não .|- Não .|
|`extended` |Sim , sim .|Sim , sim .|- Não .|
|`developer` |Sim , sim .|- Não .|Sim , sim .|
|`full` |Sim , sim .|Sim , sim .|Sim , sim .|

## CLI Curta-metragens {#cli-shortcuts}

O `iroha` CLI já envolve muitos destes pontos finais:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## Referências a montante {#upstream-references}

- [README API e visão geral da observabilidade ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO Implementação da ponte de 20022](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Desempenho e métricas](/pt/guide/advanced/metrics.md)
