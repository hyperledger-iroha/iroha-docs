---
translation_locale: pt
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Torii API pontos de extremidade {#torii-endpoints}

Torii é o gateway HTTP, SSE e WebSocket para Iroha 3. Ele atende tanto os endpoints APIs voltados para o ledger quanto os endpoints API do operador.

As regras do protocolo atual são:

- o formato binário canônico é Norito
- muitos endpoints API também suportam JSON quando você envia `Accept: application/json`
- as métricas são expostas no formato Prometheus

Para detalhes de formato, negociação de conteúdo, sinalizadores de layout, hashes criptográficos de esquema e orientação Norito RPC, veja o [Norito referência](/pt/reference/norito.md).

## Endpoints comuns API {#common-endpoints}

| API ponto de extremidade                         |Formato         |Propósito|
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POST /v1/pipeline/transactions` | Norito         |Enviar uma transação assinada|
| `POST /v1/query`                 | Norito         |Enviar uma consulta assinada|
| `GET /v1/events/ws`              | WebSocket      |Inscrever-se em fluxos de eventos|
| `GET /v1/events/sse`             | SSE            |Inscrever-se em fluxos de eventos SSE|
| `GET /v1/blocks/stream`          | WebSocket      |Transmitir blocos comprometidos|
| `GET /v1/peers`                  | JSON           |Lista de pares da rede exposta pelo Torii|
| `GET /livez`                     | Texto           |Liveness apenas do processo; não implica prontidão do protocolo|
| `GET /readyz`                    | JSON           |Preparação completa do nó, incluindo verificações obrigatórias de caixa offline|
| `GET /health`                    | JSON           |Sonda de prontidão com o mesmo invariante de caixa offline|
| `GET /v1/api/version`            | Texto           |Versão atual do cabeçalho do bloco|
| `GET /status`                    | Norito ou JSON |Status de diagnóstico de alto nível; solicite JSON explicitamente|
| `GET /metrics`                   | Prometheus     |Endpoint de coleta do Prometheus|
| `GET /v1/schema`                 | JSON           |Visualização de dados em ponto no tempo do esquema do modelo de dados fornecida pelo nó quando ativada|
| `GET /openapi.json`              | JSON           |Documento OpenAPI das rotas HTTP ativas do Torii|
| `GET /v1/parameters`             | JSON           |Visualização de dados pontuais do parâmetro do nó|
| `GET /v1/node/capabilities`      | JSON           |Capacidade do nó e metadados do modelo de dados|
| `GET /v1/time/now`               | JSON           | Instantâneo do relógio do sistema do nó |
| `GET /v1/time/status`            | JSON           |Status de sincronização de tempo|

Para uma solicitação SSE, anuncie o fluxo nativo e um fallback tipado:

```http
Accept: text/event-stream, application/json
```

O Torii primeiro negocia uma representação JSON ou Norito na camada da solicitação e depois valida a resposta nativa `text/event-stream`. Por isso, enviar apenas `text/event-stream` resulta em `406`; a [receita de streaming de eventos](/pt/cookbook/stream-events.md) usa o cabeçalho completo.

`/openapi.json` é o contrato gerado para as rotas representadas no esquema, não um inventário completo das sondas operacionais. O documento atual omite `/livez` e `/readyz`, e sua descrição de `/health` pode estar defasada em relação ao manipulador de prontidão. Gere clientes de rota a partir do documento ativo, mas valide vivacidade e prontidão diretamente no nó em execução e nos manipuladores fixados. A superfície exata ainda depende dos recursos de compilação e da configuração do ambiente de execução. Use a [ferramenta interativa da API Torii](/pt/reference/torii-api-console.md) para carregar esse documento ativo, testar rotas JSON, copiar solicitações curl e gerar código de cliente a partir do esquema atual.

Toda operação OpenAPI baseada em catálogo inclui um objeto `x-iroha-route-auth`. Ferramentas MCP baseadas em catálogo expõem o mesmo contrato que `_meta["iroha/routeAuth"]`. Ambas as projeções carregam `schemaVersion`, `stableRouteId`, `authentication` e `admission`. Trate a versão `1` como um contrato exato: rejeite um `schemaVersion` não suportado em vez de tentar adivinhar como seus rótulos de autenticação ou admissão devem ser interpretados. Os metadados da rota descrevem o limite da solicitação; eles não substituem as credenciais exigidas por esse limite.

## Tentar Rotas Ao Vivo Taira {#try-live-taira-routes}

A testnet pública Taira expõe a mesma superfície Torii JSON que os clientes de aplicação usam para exploração apenas de leitura. Esses comandos não requerem chaves:

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

Tente leituras de recursos contra o estado atual do mundo:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Se uma rota de testnet pública retornar `502`, expirar o tempo de resposta ou reportar uma fila saturada, trate-a como um problema de disponibilidade de endpoint API e tente novamente mais tarde antes de depurar seu código cliente.

## Endpoints de consenso e do ambiente de execução {#consensus-and-runtime-endpoints}

Cada rota Sumeragi abaixo requer assinatura de solicitação do operador. As rotas de status, diagnósticos, fluxo, líder, chave, QC e parâmetro também requerem uma versão com telemetria habilitada.

| Endpoint                                  |Formato         |Finalidade|
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
| `GET /v1/sumeragi/status`                 | Norito ou JSON |Status de consenso autoritário pertencente ao redutor|
| `GET /v1/sumeragi/diagnostics`            | JSON           |Diagnósticos não autoritativos do pipeline, da fila e da via de execução|
| `GET /v1/sumeragi/status/sse`             | SSE            |Fluxo contínuo de status de consenso autoritário|
| `GET /v1/sumeragi/leader`                 | JSON           |Informações sobre o líder atual|
| `GET /v1/sumeragi/qc`                     | Norito ou JSON |Instantâneos dos certificados de quórum mais alto e bloqueado|
| `GET /v1/sumeragi/consensus-keys`         | JSON           |Chaves de consenso ativas|
| `GET /v1/sumeragi/bls-keys`               | JSON           |Chaves de consenso ativas BLS|
| `GET /v1/sumeragi/params`                 | JSON           |Parâmetros atuais na cadeia Sumeragi|
| `GET /v1/sumeragi/evidence`               | JSON           | Registros de evidências, opcionalmente filtrados por string de consulta |
| `GET /v1/sumeragi/evidence/count`         | JSON           |Contagem de registros de evidência|
| `GET /v1/runtime/abi/active`              | JSON           |Descritor de tempo de execução de software ativo ABI|
| `GET /v1/runtime/abi/hash`                | JSON           |Hash da ABI do ambiente de execução ativo|
| `GET /v1/runtime/metrics`                 | JSON           |Instantâneo das métricas do ambiente de execução|
| `GET /v1/runtime/upgrades`                | JSON           |Lista de atualizações do ambiente de execução|
| `POST /v1/runtime/upgrades/propose`       | JSON           |Propor uma atualização do tempo de execução do software|
| `POST /v1/runtime/upgrades/activate/{id}` | JSON           |Ativar uma atualização proposta do tempo de execução do software|
| `POST /v1/runtime/upgrades/cancel/{id}`   | JSON           |Cancelar uma atualização proposta do tempo de execução do software|

## App e Famílias de Rotas SORA {#app-and-sora-route-families}

Quando Torii é construído com o conjunto de recursos voltados para o aplicativo, ele expõe famílias adicionais de JSON para exploradores, serviços SORA, fluxos de ponte, provas e armazenamento. Nem todas essas famílias estão habilitadas em cada perfil de rede.

`/openapi.json` descreve as rotas registradas no catálogo app-API gerado; ele é autoritativo para as entradas que contém, não para todas as rotas montadas pelo processo. Em particular, os SoraFS CID locais públicos e rotas bem conhecidas são montados fora desse documento gerado e devem ser examinados diretamente.

|Família de rotas|Propósito|
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*`                         | JSON lê, auxiliares de consulta, auxiliares de integração e visualizações de portfólio ou titular|
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*`                          |NFT, ativo do mundo real e visualizações de ativos confidenciais|
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` |Resolução de nome, alias e identificador|
| `/v1/explorer/*`                                                          |Visualizações de conta, ativo, bloco, transação, instrução, métrica e fluxo voltadas para explorador|
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*`                  |Histórico de transações, recuperação ou status do pipeline de processamento, e auxiliares ISO 20022|
| `/v1/contracts/*`                                                         |Código do contrato, implantar, agrupar, chamar, visualizar, evento, atividade, rollup e rotas de estado|
| `/v1/multisig/*`, `/v1/controls/*`                                        |Propostas multisig, aprovações e auxiliares de controle de transferência|
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*`                            |Finalidade, prova de estado, prova de bloco, retenção de prova e rotas de consulta de prova|
| `/v1/da/*`                                                                |Ingestão de disponibilidade de dados, manifestos técnicos, políticas de prova, compromissos e intenções de fixação|
| `/v1/zk/*`                                                                |ZK raízes, verificação de provas, IVM prova, contagem de votos, chaves de verificação, registros de provas e anexos|
| `/v1/gov/*`, `/v1/ministry/*`                                             |Propostas de governança, cédulas, estado do conselho, namespaces protegidos, propostas de agenda, promulgação e finalização|
| `/v1/nexus/*`, `/v1/sccp/*`                                               | Nexus pista de execução, espaço de dados e auxiliares de prova entre cadeias|
| `/v1/musubi/*`                                                            | Musubi registros de pacotes e construtores de instrução |
| `/v1/subscriptions/*`                                                     |Planos de assinatura, ciclo de vida da assinatura, uso e auxiliares de cobrança|
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*`                      |SoraFS descoberta de provedores, provas de capacidade, fixação, buscas de armazenamento e fornecimento de conteúdo público|
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*`                | SoraCloud ciclo de vida do serviço, fluxos privados de computação/modelo, descoberta pública e roteamento de aplicativos hospedados                        |
| `/v1/connect/*`, `/v1/vpn/*`                                              |Iroha Conectar sessões, WebSocket transporte, VPN sessões, perfis e registros de resultados de protocolo|
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*`                             |Vinculações do aplicativo API e roteamento de conteúdo baseado em pacote/CID|
| `/v1/operator/*`, `/v1/mcp`                                               |Autenticação do operador e ponte nativa MCP JSON-RPC|
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*`   |Prontidão offline, acordos de repositório, manifestos técnicos de espaço de dados e [RAM-LFE ajudantes](/pt/blockchain/ram-lfe.md#torii-routes)|
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*`        |Colaboração, webhook, notificação push e integrações de telemetria ao vivo|

## Autenticação de Conta, Visibilidade e Cursores do Explorador {#account-authentication-visibility-and-explorer-cursors}

### Protocolo de Solicitação de Conta do App {#app-account-request-protocol}

As rotas voltadas para o aplicativo aceitam ou nenhum cabeçalho de autenticação, ou uma prova direta de chave única, ou uma testemunha multisig. Cada cabeçalho de autenticação deve aparecer no máximo uma vez.

Para uma prova direta, envie todos os quatro cabeçalhos juntos:

- `X-Iroha-Account`: o endereço de conta hexadecimal `0x` canônico exato em minúsculas ou um alias de conta ASCII canônico ativo. O texto I105 não é seguro como valor de campo HTTP; use a grafia hexadecimal canônica para essa conta.
- `X-Iroha-Signature`: a carga útil de assinatura em base64 preenchida estrita.
- `X-Iroha-Timestamp-Ms`: um timestamp decimal Unix não assinado canônico em milissegundos, dentro da janela de desvio configurada.
- `X-Iroha-Nonce`: 1 a 256 bytes imprimíveis ASCII (`0x21` até `0x7e`), únicos dentro da janela de repetição.

O controlador registrado de tecla única assina estes bytes exatos:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

A construção de consulta canônica analisa a consulta bruta como `application/x-www-form-urlencoded` (`+` significa espaço), decodifica em porcentagem seus pares, os ordena por `(key, value)` e os codifica novamente no formato de formulário. O protocolo admite no máximo 64 pares decodificados e 64 KiB de texto de consulta bruto. Faça o hash criptográfico dos bytes do corpo exatamente como transmitidos. Não insira um separador entre o ID de rede fixo de 32 bytes e o método em maiúsculas.

O verificador V1 também limita o token do método a 32 bytes, o caminho da solicitação codificado em percentual a 64 KiB, e a identidade direta da conta a 36 KiB antes da análise. Os apelidos de conta têm o limite estrutural mais restrito de três segmentos de nome mais seus separadores. Ultrapassar esse limite faz com que a autenticação falhe antes da verificação da assinatura ou da alocação do tamanho da fonte.

Um controlador multisig deve, em vez disso, enviar `X-Iroha-Witness` como Norito canônico em base64 estritamente preenchido e omitir `X-Iroha-Signature`, `X-Iroha-Timestamp-Ms` e `X-Iroha-Nonce`. `X-Iroha-Account` é opcional neste formulário; quando presente, deve ser igual à testemunha `subject_account`. O `CanonicalRequestWitnessV1` contém `schema_version`, `subject_account`, `timestamp_ms`, `nonce`, um Iroha `Hash` dos bytes de requisição da rede exata através do valor do resumo criptográfico do corpo, mas sem campos de novidade, e no máximo 64 assinaturas de membros. Cada membro assina a codificação canônica Norito desse mesmo payload sem o array de assinaturas. Os membros verificados devem satisfazer a política multisig atual da conta. A testemunha codificada é limitada a 1 MiB.

Fornecer nenhum cabeçalho de autenticação seleciona o acesso anônimo. Fornecer qualquer prova parcial, mista, repetida, malformada, obsoleta ou reproduzida falha na autenticação; nunca retorna à visibilidade anônima.

### Protocolo de Solicitação de Operador {#operator-request-protocol}

Rotas marcadas como autenticadas pelo operador exigem todos os quatro cabeçalhos singleton:

- `x-iroha-operator-public-key`: a chave pública multihash Iroha canônica.
- `x-iroha-operator-timestamp-ms`: o timestamp decimal Unix canônico sem sinal em milissegundos.
- `x-iroha-operator-nonce`: 1 a 256 bytes imprimíveis ASCII, únicos para essa chave dentro da janela de repetição.
- `x-iroha-operator-signature`: a carga útil de assinatura em base64 preenchida estrita.

Os valores do cabeçalho não devem conter espaços em branco ao redor. Os sinais da tecla do operador:

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

As regras para caminho, consulta, corpo, timestamp e valor nonce criptográfico são as mesmas regras canônicas usadas pelo protocolo do aplicativo. A chave também deve ser admitida por `[torii.operator_signatures]`: liste-a em `allowed_public_keys`, ou habilite explicitamente `allow_node_key` ao usar a chave do nó. A saturação do cache de replay falha fechada com `503 Service Unavailable`.

A assinatura exata da solicitação é sempre obrigatória. Quando `[torii.operator_auth].enabled = true`, cada rota de operador comum também requer um `x-iroha-operator-session` válido; quando `require_mtls = true`, ela adicionalmente requer `x-forwarded-client-cert` de um ingresso confiável. Nenhum dos fatores substitui a assinatura da solicitação.

WebAuthn inscrição e login usam estes quatro JSON API endpoints:

|Método e API endpoint|Propósito|
| --------------------------------------------- | ---------------------------------------- |
| `POST /v1/operator/auth/registration/options` |Iniciar inscrição de credencial WebAuthn|
| `POST /v1/operator/auth/registration/verify`  |Verifique e persista a credencial|
| `POST /v1/operator/auth/login/options`        |Iniciar autenticação WebAuthn|
| `POST /v1/operator/auth/login/verify`         |Verifique a afirmação e emita uma sessão|

Configure `torii.operator_auth.tokens` com valores de bootstrap dedicados. Antes de qualquer credencial existir, envie um como `x-iroha-operator-token` para iniciar o primeiro registro. Esse token nunca autoriza uma rota de operador comum, e os valores do listener `x-api-token` nunca são reutilizados para esse fluxo. Uma vez que uma credencial exista, registrar outra credencial requer uma sessão autenticada. A verificação de login retorna o token de sessão para enviar junto a cada nova assinatura de solicitação do operador da rede exata. As credenciais persistem sob `<torii.data_dir>/operator_auth/operator_webauthn.json`.

ISO 20022 rotas aplicam duas verificações independentes. A solicitação deve primeiro passar por esta lista de permissão do operador e pelo protocolo de assinatura; o manipulador ISO então requer a mesma chave para ocupar exatamente o papel de participante ou auditor descrito abaixo.

### Visibilidade do livro-razão blockchain e cursores do explorador {#ledger-visibility-and-explorer-cursors}

As leituras do registro em blockchain voltadas para o aplicativo usam o limite opcional da conta do aplicativo acima. Uma solicitação não assinada recebe apenas os espaços de dados configurados como públicos. Uma solicitação assinada válida adiciona espaços de dados vinculados ao UAID atual do chamador, cada espaço de dados restrito nomeado por uma permissão exata `CanReadRestrictedDataspace { dataspace }`, ou todas as rotas quando a conta possui `CanReadAllLedgerData`.

Use a rota que corresponda ao principal de autorização do chamador:

|Método e endpoint API|Autenticação e visibilidade|
| ------------------------------------- | --------------------------------------------------------------- |
| `POST /v1/transactions/visible/query` |Assinatura de conta canônica; aplica a visibilidade do chamador|
| `POST /v1/transactions/query`         |Assinatura de solicitação do operador; permite a visualização global do operador|
| `GET /v1/triggers/completed`          |Assinatura de solicitação do operador; lê registros de conclusão locais do nó|

O mesmo objeto de visibilidade filtra conta, domínio, definição de ativo, ativo, NFT, RWA, titular e leituras do Explorer. Um objeto ausente e um objeto que está fora das rotas visíveis do chamador são intencionalmente indistinguíveis. O histórico de transações e instruções confirmadas é exibido apenas quando cada etapa da rota registrada para a transação está visível. Uma transação de espaço de dados misto é portanto oculto quando mesmo uma etapa do participante está fora do escopo do chamador; contexto de roteamento ausente, desatualizado ou malformado é visível apenas para um leitor global.

As seis coleções Explorer apoiadas mundialmente usam cursores de conjunto de chaves base64url canônicos opacos. O limite de página padrão é 25, o máximo é 100, e uma página inspeciona no máximo 512 chaves candidatas. Cada cursor está vinculado à sua coleção, filtros, última chave canônica e ao valor de resumo criptográfico do conjunto de rotas visível do chamador, portanto, não pode ser reproduzido em outra consulta ou após as alterações na visibilidade do chamador.

Os cursores de histórico de bloco, transação, última transação, instrução e última instrução adicionalmente fixam a altura da visualização de dados no ponto no tempo comprometido e o hash criptográfico do bloco. As respostas expõem `pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor` e `pagination.has_more`. Um cursor para outra rota ou conjunto de filtros, um valor de resumo criptográfico de visibilidade alterado, ou uma visualização de dados em um ponto no tempo que o nó não pode mais validar falha fechado. A varredura do histórico continua dentro da permissão de admissão de consulta de Torii enquanto o trabalhador bloqueador está em execução.

Os fluxos do Explorer WebSocket emitem resumos filtrados e recalculam a visibilidade à medida que as permissões do livro-razão da blockchain mudam. A rota nativa `GET /v1/blocks/stream` é diferente: ele emite blocos completos assinados, requer `CanReadAllLedgerData` durante o handshake e fecha se essa permissão for posteriormente revogada. Não use o fluxo nativo para um explorador com escopo em dataspace.

## ISO Ponte 20022 {#iso-20022-bridge}

Torii expõe a ponte ISO 20022 sob `/v1/iso20022/*` quando o API voltado para o aplicativo e o tempo de execução do software da ponte estão habilitados. A ponte é propositalmente delimitada: não é um gateway de compensação ISO 20022 de uso geral, mas um subconjunto suportado para transformar mensagens de pagamento selecionadas em transferências Iroha assinadas e para rastrear o status de ledger de blockchain delas.

Configure um `torii.iso_bridge.store_dir` local durável antes de admitir qualquer submissão. O campo de configuração é opcional apenas para que um nó possa iniciar para uso somente leitura ou diagnóstico: cada envio autenticado ISO requer o diretório, e retorna `503 Service Unavailable` reenviável quando a persistência está ausente ou quando uma escrita de replay-tombstone ou rich-record falha.

### Torii ISO 20022 API endpoints {#torii-iso-20022-endpoints}

|Método e endpoint API|Propósito|
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST /v1/iso20022/pacs008`                  |Envie uma transferência de crédito de cliente de FI para FI e crie a correspondente transferência de ativo Iroha|
| `POST /v1/iso20022/pacs009`                  |Enviar crédito de uma FI a outra FI para PvP ou financiamento em dinheiro de valores mobiliários|
| `POST /v1/iso20022/pacs002`                  |Enviar um relatório de status de pagamento de propriedade da contraparte; a liquidação precisa de evidência de transação comprometida|
| `POST /v1/iso20022/pacs004`                  |Enviar uma devolução de pagamento de propriedade da contraparte|
| `POST /v1/iso20022/camt056`                  |Enviar uma solicitação de cancelamento de pagamento de propriedade do originador|
| `POST /v1/iso20022/sese023`                  |Enviar uma instrução de liquidação de valores mobiliários|
| `POST /v1/iso20022/sese024`                  |Enviar uma mensagem de status de liquidação de valores mobiliários de propriedade da contraparte|
| `POST /v1/iso20022/sese025`                  |Enviar uma confirmação de liquidação de valores mobiliários de propriedade da contraparte|
| `POST /v1/iso20022/colr012`                  |Enviar uma mensagem de substituição de garantia|
| `GET /v1/iso20022/messages/{msg_id}`         |Leia o registro canônico da ponte para uma mensagem|
| `GET /v1/iso20022/audit/messages`            |Leia o manifesto técnico de auditoria de mensagens à prova de violação|
| `GET /v1/iso20022/messages/{msg_id}/pacs002` |Renderize o status de pagamento atual como `pacs.002` XML|
| `GET /v1/iso20022/messages/{msg_id}/pacs004` |Renderize o retorno do pagamento atual como `pacs.004` XML|
| `GET /v1/iso20022/messages/{msg_id}/camt029` |Renderize a resolução de cancelamento atual como `camt.029` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese024` |Renderize o status atual do acordo como `sese.024` XML|
| `GET /v1/iso20022/messages/{msg_id}/sese025` |Renderize a confirmação do acordo atual como `sese.025` XML|

`pacs.008` os envios devem fornecer o ID da mensagem, o valor de liquidação interbancária, a moeda, a data de liquidação, devedor e credor IBANs, e devedor e credor BICs. Quando os dados de referência são configurados, a ponte também verifica os crosswalks de moeda 4217 BIC, IBAN e ISO antes que a transação gerada entre no pipeline de processamento.

`pacs.009` as submissões devem fornecer o ID da mensagem de negócios, ID da definição da mensagem, hora de criação, valor de liquidação interbancária, moeda, data de liquidação, instruindo e agente instruído BICs, e devedor e credor IBANs. Se a mensagem incluir `Purp`, a ponte atualmente aceita financiamento com finalidade de títulos apenas: `Purp=SECU`.

Os endpoints de submissão API de `pacs.008` e `pacs.009` aceitam contêineres de dados XML ISO ou o formato de campo plano usado pelos testes de ponte. Os campos opcionais `SplmtryData` podem fixar o livro razão da blockchain de destino Iroha, os IDs ou endereços das contas de origem e destino, e o ID da definição do ativo. A resposta é `202 Accepted` com `message_id`, `transaction_hash`, `status`, `pacs002_code` e o contexto resolvido do livro razão/conta/ativo.

### Autorização do Participante e Propriedade do Ciclo de Vida {#participant-authorization-and-lifecycle-ownership}

Cada ponte habilitada possui um catálogo de participantes. Cada entrada de participante possui um ID de participante único, uma ou mais chaves públicas do operador, um ou mais identificadores financeiros, um conjunto de perfis permitidos e os papéis `originator`, `counterparty` ou ambos. As chaves de operador e os identificadores financeiros não podem pertencer a mais de um participante. Configure `audit_admin_keys` separadamente; uma chave de administrador de auditoria não pode ser também uma chave de mutação de participante.

Todas as rotas ISO exigem uma nova assinatura do operador. Para uma submissão inicial `pacs.008`, `pacs.009`, `sese.023` ou `colr.012`, o operador autenticado deve pertencer ao participante identificado pela identidade financeira `From` no cabeçalho da aplicação. A identidade `To` deve ser resolvida para um participante configurado com a função `counterparty`, e o perfil selecionado deve ser permitido para ambas as partes. O registro de admissão durável registra o originador, a contraparte, o participante que admite e a chave do operador, bem como o perfil original e a política de assinatura embutida.

A autorização do ciclo de vida é derivada desse registro imutável em vez de valores selecionados pelo chamador:

|Mensagem de ciclo de vida|Participante obrigatório|
| ---------------------------------------------- | -------------------------------------------------- |
| `pacs.002`, `pacs.004`, `sese.024`, `sese.025` |Contraparte original com o papel `counterparty`|
| `camt.056`                                     |Originador original com o papel `originator`|

O perfil original e a política de assinatura permanecem fixados durante todo o ciclo de vida, de modo que um chamador não pode selecionar um perfil mais fraco para uma atualização. Um código `pacs.002` que representa a liquidação (`ACSC`, `ACCP`, `SETT` ou `SETTLED`) altera o registro original para liquidado apenas quando Torii tiver evidência de transação confirmada.

Qualquer das partes originais pode ler seu registro de mensagens e os documentos de saída gerados. O endpoint de auditoria API retorna apenas registros nos quais o participante autenticado é o originador ou a contraparte. Um administrador de auditoria configurado separadamente recebe uma visão de auditoria global somente leitura e não pode enviar ou alterar mensagens. Participantes desconhecidos e identificadores de mensagens não relacionados não são divulgados.

### Identidade de Repetição Durável e Documentos de Saída Assinados {#durable-replay-identity-and-signed-outbox-documents}

Marcadores de exclusão durável de replay são o limite estrito de admissão. Torii aborta a inicialização para um marcador de exclusão durável ilegível, superdimensionado, malformado, com nome incorreto, conflitante ou explicitamente incompatível. Ele também aborta para um registro rico com uma versão de esquema explicitamente incompatível, um participante, perfil ou política de assinatura ausente da configuração atual, ou um marcador de exclusão durável ativo ausente ou incompatível.

Outros danos em registros ricos são tratados de forma diferente: arquivos ilegíveis ou de tamanho exagerado, JSON inválido, registros de esquema atual inválidos, nomes de arquivos não canônicos e identidades de replay conflitantes são registrados ou ignorados. Um índice de auditoria da versão atual ilegível ou inválido é regenerado a partir dos registros retidos; apenas uma versão de índice de auditoria explicitamente incompatível aborta a inicialização. Monitore os logs de inicialização e reconcilie o manifesto técnico de auditoria regenerado, em vez de assumir que todo arquivo rico-corrompido impede o nó de servir.

Cada registro rico retido mantém a proveniência do participante imutável. Um marcador de exclusão durável separado mantém o ID da mensagem, o hash criptográfico da carga útil, o ID da mensagem de negócios e UETR para a deduplicação completa TTL mesmo após os detalhes do registro rico serem podados.

Torii persiste na admissão de repetição antes de assinar ou processar uma mensagem de ciclo de vida. Ele nunca expulsa uma identidade de repetição não expirada. Se a capacidade configurada está inteiramente ocupado por registros protegidos ou identidades de replay não expiradas, as submissões recebem `503 Service Unavailable` retryable sem modificar o estado do ciclo de vida ou da contabilidade.

Cada documento gerado `pacs.002`, `pacs.004`, `camt.029`, `sese.024` ou `sese.025` é retornado como `application/xml` com estes cabeçalhos de resposta:

|Cabeçalho|Significado|
| ------------------------------ | ----------------------------------------------------- |
| `X-Iroha-Iso-Signature-Domain` |Sempre `iroha.iso20022.outbound.v2`|
| `X-Iroha-Iso-Signer`           |Chave pública canônica para o signatário criptográfico de ponte configurado|
| `X-Iroha-Iso-Signature`        |Assinatura Base64 sobre os XML bytes separados por domínio|

Verifique a assinatura sobre a sequência de bytes UTF-8 `iroha.iso20022.outbound.v2`, um byte zero, e o corpo exato da resposta. Não reformate ou normalize o XML antes da verificação.

### Suporte Adicional de Parser e Mapeamento {#additional-parser-and-mapping-support}

O ajudante IVM ISO também valida e materializa as seguintes famílias de mensagens para validação de contêineres de dados, mapeamento de liquidação ou reconciliação a jusante. Eles não possuem rotas Torii independentes.

|Mensagem para a família|Suporte atual|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `head.001`                         |Validação de cabeçalho de aplicação empresarial para contêineres de dados ISO, incluindo `BizMsgIdr`, `MsgDefIdr`, tempo de criação e campos opcionais do remetente/destinatário BIC|
| `pacs.007`, `pacs.028`, `pacs.029` |Reversão de pagamento, solicitação de status e resolução de investigação/análise de status|
| `pain.001`, `pain.002`             |Iniciação de pagamento do cliente e validação do relatório de status de pagamento|
| `camt.052`, `camt.053`, `camt.054` |Validação de relatório de conta, extrato e notificação|

## Kaigi Sessões {#kaigi-sessions}

Kaigi fornece salas de áudio/vídeo em tempo real pagas em SORA Nexus. Use-o quando um aplicativo precisar de criação de sessões com registro em ledger, alterações de lista de participantes, envio de manifestos técnicos, sinalização criptografada e medição de uso, em vez de manter todo o estado da conferência fora da cadeia.

O ciclo de vida voltado para o livro-razão é:

- `CreateKaigi`: criar uma chamada sob um domínio e armazenar sua política, cronograma, metadados e manifesto técnico de retransmissão opcional.
- `JoinKaigi`: atualize a lista de chamadas. No modo `zk-roster-v1`, a visualização pública de chamadas exibe contagens de compromissos e anuladores em vez de IDs de conta dos participantes.
- `LeaveKaigi`: remover um participante de uma chamada transparente. A saída em modo privado é off-chain no protocolo da primeira versão.
- `RecordKaigiUsage`: anexar duração medida e totais de custos de execução de transação.
- `EndKaigi`: feche a sessão e registre o carimbo de data/hora final.

Torii expõe as seguintes leituras voltadas para o aplicativo:

| Rota                               |Autenticação|Propósito|
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
| `/v1/kaigi/calls/{call_id}`         |público|registro de chamada atual|
| `/v1/kaigi/calls/{call_id}/signals` |solicitação de conta de rede exata canônica|metadados de sinalização comprometidos paginados|
| `/v1/kaigi/calls/{call_id}/events`  |solicitação de conta de rede exata canônica|fluxo do ciclo de vida da chamada|
| `/v1/kaigi/relays`                  |solicitação de operador na lista permitida|resumo do relé|
| `/v1/kaigi/relays/{relay_id}`       |solicitação de operador na lista permitida|registro e detalhes de saúde de um relé|
| `/v1/kaigi/relays/health`           |solicitação de operador na lista de permissões|saúde do relé agregado|
| `/v1/kaigi/relays/events`           |solicitação de conta de rede exata canônica|registro de retransmissão e fluxo de eventos de saúde|

A API do aplicativo deve estar habilitada. As rotas de resumo e integridade dos relés são superfícies do operador, embora sejam somente leitura; uma solicitação `curl` não assinada não é uma verificação de disponibilidade válida. O estado da sessão também é refletido por eventos de domínio Kaigi como `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated` e `KaigiUsageSummary`.

### CLI Teste de Fumaça {#cli-smoke-test}

Comece com o `iroha app kaigi` CLI quando quiser verificar se um endpoint Torii API aceita transações Kaigi antes de conectar um UI. O comando quickstart cria uma sala no endpoint API configurado e imprime seu identificador de chamada e metadados de entrada:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

Para fluxos roteirizados, gerencie explicitamente o ciclo de vida da sala:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

Use `--room-policy public` para salas que os retransmissores podem expor sem ingressos de visualizador, ou `--room-policy authenticated` quando as saídas devem exigir autenticação do visualizador. Use `--privacy-mode zk-roster-v1` somente após o a rede possui o elenco Kaigi e as chaves de verificação de uso configuradas; caso contrário, entradas, saídas e registros de uso privados falham durante a verificação determinística.

### JavaScript Integração {#javascript-integration}

O atual [Iroha JavaScript demonstração](https://github.com/soramitsu/iroha-demo-javascript) implementar um perfil de reunião um-a-um transparente e autenticado. Ele não expõe o protocolo `zk-roster-v1` fluxo de prova. Seu renderizador cria WebRTC ofertas e respostas, enquanto uma ponte privilegiada usa a local [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) finalizar para cotar, assinar, enviar e aguardar a finalização Kaigi transações.

Consulte [Incorporar Kaigi em um App JavaScript](/pt/guide/tutorials/kaigi.md) para a autenticação exata da rota, formato de convite, limite da ponte e os comandos de teste de demonstração atuais.

## Status e Métricas {#status-and-metrics}

Os endpoints de status e métricas API são as primeiras coisas a serem conectadas aos dashboards:

- `/status` expõe campos de rede de nível superior, bloco, fila e consenso
- `/metrics` expõe contadores, medidores e histogramas do Prometheus

Em nós com Nexus ativado, a saída de status também inclui seções conscientes de pista de execução e espaço de dados. Quando `nexus.enabled = false`, essas seções são omitidas.

## JSON versus Norito {#json-vs-norito}

Vários endpoints do operador API retornam Norito por padrão. Quando o endpoint API suportar JSON, envie:

```http
Accept: application/json
```

Isso é especialmente útil para:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

Quando um endpoint API aceita ou retorna Norito digitado diretamente, use `application/x-norito` como o tipo de conteúdo ou o valor `Accept` preferido. Veja [Norito](/pt/reference/norito.md#torii-and-norito-rpc) para os detalhes do transporte.

## Perfis de Telemetria {#telemetry-profiles}

API a visibilidade do endpoint depende da configuração `telemetry.profile` do nó. A configuração atual expõe cinco níveis de perfil:

|Perfil| `/status` | `/metrics` |Rotas de desenvolvedor|
| ----------- | --------- | ---------- | ---------------- |
| `disabled`  |não        |não|não|
| `operator`  |sim|não|não|
| `extended`  |sim|sim|não|
| `developer` |sim|não|sim|
| `full`      |sim|sim|sim|

## CLI Atalhos {#cli-shortcuts}

O `iroha` CLI já envolve muitos desses endpoints API:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## Referências a Montante {#upstream-references}

- [README API e visão geral de observabilidade](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO implementação da ponte 20022](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [Desempenho e métricas](/pt/guide/advanced/metrics.md)
