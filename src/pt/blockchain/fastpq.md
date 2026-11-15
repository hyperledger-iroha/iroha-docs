---
translation_locale: pt
translation_source: /blockchain/fastpq.md
translation_source_hash: 98c258ab99bcc7d7d51b69ddd26e39b19ef4eb14d53001825f3737144d68f0e5
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ é o caminho de prova STARK do Iroha para efeitos de execução selecionados. Ele não substitui a execução normal de transações nem o consenso. As transações continuam passando por ISI, IVM e Sumeragi como de costume; o FastPQ prova depois os efeitos compatíveis a partir do registro de origem que a execução do bloco capturou.

A integração atual do host possui dois caminhos principais:

- efeitos sobre ativos numéricos de blocos finalizados, provados pela faixa de execução do provador do nó
- envelopes de prova AXT do SORA Nexus cujo `fastpq_binding` contém um vínculo FastPQ

## Caminho da Testemunha de Transferência {#transfer-witness-path}

Transferências numéricas transparentes criam uma transcrição de transferência estruturada quando a instrução altera os saldos. A transcrição registra:

- a conta de origem, a conta de destino, a definição do ativo e o valor
- saldos do remetente e do destinatário antes e depois da transferência
- o hash criptográfico do ponto de entrada da transação usado como o hash criptográfico do lote
- um resumo de autoridade derivado da conta que envia a transação
- um valor de resumo criptográfico Poseidon para transcrições de delta único
- testemunhas de atualização da árvore de Merkle esparsa para os saldos do remetente e do destinatário

Transferências em lotes usam uma transcrição com múltiplos deltas. Nesse caso, o valor do resumo criptográfico Poseidon de delta único está ausente.

A execução do bloco agrupa as transcrições pela chamada de execução que as emitiu e as mantém junto ao registro de origem FastPQ do bloco. Em um enunciado de transferência AXT, cada delta de transferência se torna duas linhas de transição:

| Linha | Chave | Pré-valor | Pós-valor |
| --------------- | --------------------------------------------------------------------- | ----------------------- | ---------------------- |
| Débito do remetente | `FastpqBalanceKeyV1` para a definição do ativo e a conta de origem | saldo do remetente antes | saldo do remetente depois |
| Crédito do destinatário | `FastpqBalanceKeyV1` para a definição do ativo e a conta de destino | saldo do destinatário antes | saldo do destinatário depois |

Cada chave é o quadro Norito canônico de `FastpqBalanceKeyV1`, construído por `transfer_balance_key` a partir da definição de ativo tipada e da conta sem domínio. Aliases de conta e formas de exibição nunca são material de chave.

## Efeitos de execução {#execution-effects}

A faixa de execução do provador prova enunciados completos de efeitos de execução. Cada enunciado abrange todos os efeitos de quantidade de uma entrada de execução, na ordem de execução:

| Efeito | Valores atualizados | Regra |
| -------- | ------------------------------ | ------------------------------------------------------------------- |
| Transferência | saldo de origem e de destino | o montante passa de um saldo para outro do mesmo ativo |
| Emissão | saldo e oferta | ambos aumentam no mesmo montante diferente de zero |
| Queima | saldo e oferta | ambos diminuem no mesmo montante |
| Retirada | oferta e ciclo de vida | a oferta permanece zero e a presença do ativo muda de um para zero |

A oferta nunca fica abaixo de um saldo. Cada chave é composta pelo domínio `iroha:fastpq:execution-quantity-key:v1`, um byte NUL e a codificação Norito de uma chave `FastpqExecutionQuantityKeyV1` de saldo, de oferta ou de ciclo de vida. Concessões de funções, revogações de funções e outras operações não são provadas.

Os valores nos enunciados de efeitos de execução e de transferência AXT são unidades inteiras não negativas exatas na escala decimal do ativo (`FastpqQuantityUnits`), portanto não estão limitados a `u64`. A construção do enunciado rejeita uma divergência de escala, uma diferença negativa e qualquer inconsistência aritmética ou de ordenação; ela nunca corrige um valor público.

## Entradas Públicas {#public-inputs}

Todo enunciado FastPQ carrega entradas públicas que vinculam a prova ao bloco e ao contexto de execução:

|Entrada|Significado|
| ------------- | ------------------------------------------------------------------------------------ |
| `dsid` | Identificador do espaço de dados: seu valor `u64` em ordem little-endian, seguido de oito bytes zero |
| `slot` | Horário de criação do bloco em nanossegundos, com precisão de milissegundos |
| `old_root` | Raiz da árvore de Merkle esparsa das chaves afetadas antes do enunciado |
| `new_root` | Raiz da árvore de Merkle esparsa das chaves afetadas depois do enunciado |
| `perm_root` | Compromisso com a tabela de permissões de funções do estado em execução |
| `tx_set_hash` | Compromisso com as transações do bloco em formato de transmissão, na ordem do bloco |

`old_root` e `new_root` abrangem apenas as chaves que o enunciado afeta. Elas não são a raiz persistida do estado mundial.

`perm_root` é o `Hash` de 32 bytes do Iroha calculado sobre o domínio `fastpq:v1:permission-table:blake2b-256`, a contagem de entradas como `u64` em little-endian e as entradas ordenadas. Cada entrada é composta pelo hash de um ID de função, pelo hash de uma de suas permissões e pela época dessa permissão como `u64` em little-endian. Uma tabela vazia se compromete com 32 bytes zero. Isso é apenas contexto de funções e permissões; não prova a associação de contas nem a autorização.

`tx_set_hash` é o `Hash` do Iroha calculado sobre o domínio `iroha:axt:ordered-transaction-wire-set:v1`, um byte NUL, a contagem de transações e, para cada transação na ordem do bloco, seu comprimento em formato de transmissão e todos os seus bytes nesse formato. A contagem e os comprimentos são valores `u64` em little-endian. As transações não são ordenadas nem desduplicadas, e as assinaturas permanecem na pré-imagem.

O `Hash` do Iroha é Blake2b-256 com o bit menos significativo do último byte definido como um. Um enunciado também carrega um hash de ordenação e todas as suas linhas canônicas e fatos de origem; a prova vincula todos eles.

## Protocolo de prova {#proof-protocol}

Os artefatos canônicos do FastPQ são provas DEEP mascaradas sobre o campo Goldilocks com uma extensão de grau 4. Sua relação exata, sua transcrição e sua geometria de consultas são definidas no [contrato fixado do protocolo DEEP do FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

Os chamadores escolhem um enunciado ordinário ou AXT e os limites de recursos. Eles não escolhem circuitos, chaves de verificação, contagens de consultas nem detalhes internos da transcrição. A rota ordinária é `offline_compact::prove_quantity_ordinary_artifact`; a rota AXT é `offline_compact::prove_quantity_axt_artifact`, que `prove_axt_bound_batch` encapsula para lotes vinculados. A API transparente de `Prover`, `Proof` e `verify` de reprodução existe apenas no código de testes e nas compilações `dev-tools`.

## O que a prova verifica {#what-the-proof-checks}

Antes de qualquer trabalho privado, o produtor prepara o enunciado público. Ele verifica contas, montantes, valores, contagens de ocorrências, a ordem estável das chaves e a alocação de chaves, e rejeita um enunciado cujos fatos públicos não estejam de acordo. Em seguida, a relação selada prova as duas atualizações completas da árvore de Merkle esparsa de 32 níveis de uma ocorrência de efeito ou de transferência por segmento. Os limites padrão permitem no máximo dois segmentos por artefato.

Cada traço tem 65,536 linhas. O produtor compromete 301 colunas privadas e o verificador reconstrói 41 colunas públicas de forma independente. Entropia criptográfica nova mascara as colunas do traço, o quociente e um polinômio de composição comprometido de forma independente. A divisão do quociente deve ser exata. O produtor verifica o próprio artefato antes de retorná-lo.

Os valores do enunciado público não são ocultados. A presença de uma operação no formato de transmissão não a admite: apenas os efeitos listados acima têm relações, e os enunciados AXT admitem apenas transferências com testemunha.

## Faixa de execução do provador {#prover-lane}

`iroha3d` inicia um processo de trabalho do provador FastPQ durante a inicialização do nó, antes que o Torii aceite envios, a menos que o Kura inicie com `init_mode = "fast"`. O processo de trabalho inicializa seu backend em segundo plano, de modo que a inicialização do nó continua se essa inicialização falhar; nesse caso, a faixa de execução permanece desativada.

O processo de trabalho consulta periodicamente o estado finalizado do nó e o armazenamento do Kura. Para cada bloco finalizado, ele obtém a origem autenticada, reproduzindo a execução nativa quando a origem não está armazenada, e prova os enunciados completos do bloco um de cada vez com a rota ordinária. Após uma reinicialização, ele reconstrói o prefixo autenticado a partir da gênese assinada fixada. Ele armazena cada artefato no armazenamento FastPQ limitado do Kura. Um artefato armazenado é apenas um anúncio: antes de prosseguir, o produtor autentica a origem e verifica o artefato novamente.

A produção de provas é local ao nó. Ela não é uma barreira de admissão de transações nem de consenso: a execução, a confirmação e a finalidade não esperam por uma prova. Uma falha passível de nova tentativa deixa o trabalho para uma tentativa posterior, e um único produtor é executado por processo.

## Verificação {#verification}

Um verificador confere um artefato com base em expectativas que deriva do próprio enunciado autenticado, nunca do artefato que está sendo conferido. A verificação decodifica cada segmento uma única vez dentro de limites, avalia a AIR uma vez no ponto fora do domínio, autentica cada linha aberta, folha do quociente e fibra FRI, bem como o terminal FRI completo, em relação às raízes comprometidas, e realiza no máximo 385 verificações de dobra. Ela não constrói nenhuma testemunha privada, traço ou extensão de baixo grau completa.

O sucesso estabelece a consistência com as expectativas do chamador. Ele não concede autoridade de execução, finalidade da origem, admissão de reprodução nem autorização de gasto AXT.

Limites padrão de `offline_compact::VerificationLimits`, que a rota ordinária também usa:

|Limite|Padrão|
| ------------------------------- | ------------: |
| Segmentos por artefato | 2 |
| Bytes de transmissão do artefato | 1 MiB |
| Quadro da prova filha | 500,084 bytes |
| Bytes do enunciado em todos os segmentos | 512 KiB |
| Consultas por segmento | 77 |
| Consultas em todos os segmentos | 154 |

A faixa de execução do nó limita ainda os bytes de transmissão do artefato a `zk.fastpq.proof_sidecar_max_bytes` e ao limite de objetos FastPQ do Kura. Antes da decodificação, um blob de prova AXT pode conter no máximo 2 MiB, e sua carga útil FastPQ incorporada, no máximo 1 MiB.

## Envelopes de prova AXT do SORA Nexus {#sora-nexus-axt-proof-envelopes}

Os envelopes de prova AXT do SORA Nexus podem incorporar um `AxtFastpqBinding`. A validação de blocos dos envelopes AXT, as verificações de envelopes AXT do host da IVM e `RegisterVerifiedFeeSponsorVaultAllocation` exigem o `fastpq_binding` do envelope, comparam-no com a declaração esperada e chamam o verificador FastPQ sobre o envelope e sua prova incorporada. Um vínculo ausente ou uma verificação malsucedida rejeita a operação.

O verificador aceita apenas declarações de transferência com testemunha, `tx_predicate` e `value_conservation`. Os tipos de declaração `authorization` e `compliance` são portadores opacos de efeitos sem relação de transferência, e a verificação os rejeita. A validação de blocos também rejeita envelopes que carregam gastos remotos, e o host da IVM rejeita a admissão autônoma de `AXT_VERIFY_DS_PROOF`. Ambos permanecem indisponíveis até que as raízes de origem finalizadas, o conjunto de transações e a autorização do emissor possam ser autenticados.

### Vínculo AXT {#axt-binding}

Nos envelopes AXT do SORA Nexus, `AxtFastpqBinding` é normalizado em forma canônica antes da geração da prova e da verificação:

- `parameter`, `source_dataspace`, `source_receipt_id` e `verified_effect_type` têm os espaços das extremidades removidos e não podem ficar vazios
- `source_tx_commitment`, `claim_digest`, `witness_commitment` e `policy_commitment` são convertidos para minúsculas e devem ser codificações hexadecimais de 32 bytes
- `verifier_id` deve ser `fastpq` e `verifier_version` deve ser `v1`
- `claim_type` tem os espaços das extremidades removidos, é convertido para minúsculas e deve nomear um dos quatro tipos de declaração acima
- `target_dsids` não pode estar vazio e deve estar em ordem estritamente crescente
- `remote_spend_intent_commitments` deve estar em ordem estritamente crescente e dentro do limite da primeira versão

A verificação exige a forma canônica exata; ela não normaliza um vínculo em nome do chamador.

O vínculo se anexa a um lote que a execução do bloco já capturou; ele não cria transições. O lote deve conter pelo menos uma transição de estado e nomear o conjunto de parâmetros do vínculo, `fastpq-state-transition-stark-v1`. Seus metadados `entry_hash` devem ser iguais a `source_tx_commitment`, e seu `dsid` público deve codificar o `source_dsid` do vínculo. Uma declaração de transferência deve carregar pelo menos uma transcrição de transferência, e o hash do lote de cada transcrição deve ser igual a `source_tx_commitment`.

Em seguida, a vinculação grava no lote metadados vinculados à prova: o vínculo canônico, seus quatro resumos, `source_receipt_id`, `target_dsids`, `verified_effect_type`, um `corridor` não vazio, a raiz do manifesto diferente de zero, o compromisso DA opcional, um montante comprometido opcional diferente de zero e o slot de expiração, em que zero significa sem expiração. Por fim, ela adiciona um selo sobre o vínculo e o lote sem o selo:

$$
\operatorname{seal} =
\operatorname{Hash}(
\texttt{fastpq:axt:batch-seal:v1}\|
E(\operatorname{binding})\|
E(\operatorname{batch})
)
$$

Aqui, $E$ é a codificação Norito canônica. Alterar o lote, o vínculo ou um valor vinculado à prova após a vinculação faz a verificação falhar. O verificador também compara o espaço de dados, a raiz do manifesto, o compromisso DA, o montante comprometido e a expiração do envelope com os valores vinculados à prova.

Um envelope verificado informa seus `old_root`, `new_root` e `tx_set_hash` provados, além de um resumo do enunciado. O resumo abrange o espaço de dados do envelope como `u64` em little-endian, sua raiz do manifesto, o compromisso DA quando presente, o vínculo e o enunciado:

$$
\operatorname{statement\_digest} =
\operatorname{Hash}(
\texttt{fastpq:axt:statement:v1}\|
\operatorname{le64}(\operatorname{dsid})\|
\operatorname{manifest\_root}\|
\operatorname{da\_commitment}\|
E(\operatorname{binding})\|
E(\operatorname{statement})
)
$$

O valor do resumo criptográfico do manifesto técnico do lote AXT é SHA-256 sobre a codificação Norito do vínculo canônico:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Conjuntos de Parâmetros {#parameter-sets}

A primeira versão tem exatamente um conjunto de parâmetros, `fastpq-state-transition-stark-v1`. Os lotes e os vínculos AXT o nomeiam, e a geração de provas AXT rejeita qualquer outro nome. O contrato do protocolo DEEP fixa a geometria dos artefatos da versão publicada:

| Item | Valor |
| -------------------------- | ----------------------------------------------------- |
| Campo | Goldilocks `p = 2^64 - 2^32 + 1`, extensão `u^4 - 7` |
| Linhas do traço | 65,536 |
| Linhas de avaliação | 8,388,608 (fator de expansão 128) |
| Aridades de dobra FRI | `[16, 16, 8, 8, 4]` |
| Consultas | 77 posições distintas |
| Grinding | nenhum |
| Compromissos e transcrição | SHA3-256 e SHAKE256 |

A qualificação para produção não está disponível. As revisões independentes de solidez, ocultação e Fiat-Shamir desta construção estão pendentes, e o [registro fixado de prontidão para produção](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_production_readiness.md) não faz nenhuma afirmação de segurança normalizada por trabalho.

## Configuração {#configuration}

A configuração FastPQ está aninhada sob `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"
proof_sidecar_queue_cap = 1024
proof_sidecar_max_retries = 16

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false

[zk.fastpq.producer]
poll_interval_ms = 1000
step_timeout_ms = 30000
max_native_steps = 16
max_source_entries = 65536
max_source_statements = 16384
```

Ambos os modos aceitam apenas `cpu` ou `gpu` e usam `cpu` por padrão. Definir qualquer um deles como `gpu` faz com que o cálculo de hashes das provas exija um dispositivo: Metal no macOS e CUDA nos demais sistemas. Se o suporte a GPU não estiver compilado ou o dispositivo falhar na verificação prévia, a faixa de execução do provador permanece desativada; ela nunca recorre à CPU. O dispositivo executa o cálculo de hashes em massa das folhas de Merkle e dos nós pais inferiores; a transcrição, a árvore superior ordenada e a aritmética do traço permanecem na CPU. Com `poseidon_mode = "gpu"`, o nó também agrupa em lotes os resumos Poseidon das transcrições na GPU quando uma verificação prévia separada é aprovada; caso contrário, ele os calcula na CPU.

`proof_sidecar_max_bytes` limita o artefato codificado que o nó persiste e verifica, e usa por padrão o quadro de prova máximo do provador. A tabela `producer` limita cada tentativa de geração de prova: seu intervalo de consulta, seu orçamento de tempo, os passos de reprodução nativa (de 1 a 64) e as entradas e enunciados de origem admitidos antes da alocação. `metal_queue_fanout` aceita de 1 a 4.

As configurações de modo e de rótulos de telemetria também podem ser substituídas a partir do `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

O `iroha3d` ignora variáveis de ambiente quando lê um arquivo de configuração; portanto, defina esses valores em TOML ou com as opções acima.

## Métricas {#metrics}

Quando a telemetria está ativada, o FastPQ exporta métricas de seleção de backend, persistência de provas e comportamento do Metal em tempo de execução:

|Métrica|Significado|
| ----------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de execução solicitado e resolvido por rótulos de back-end e dispositivo|
| `fastpq_poseidon_pipeline_total`  |Caminho da linha de processamento do Poseidon solicitado e resolvido|
| `fastpq_gpu_disable_total` | Eventos de desativação do acelerador de GPU por acelerador, motivo e rótulos de dispositivo |
| `fastpq_gpu_parity_failure_total` | Falhas de paridade de GPU amostradas por acelerador, motivo e rótulos de dispositivo |
| `fastpq_proof_sidecar_queue_depth` | Anexos sidecar de provas FastPQ na fila |
| `fastpq_proof_sidecar_events_total` | Eventos de persistência do sidecar de provas por evento |
| `fastpq_metal_queue_depth`        |Limite da fila do Metal, contagem máxima em andamento, contagem de despacho e janela de amostragem|
| `fastpq_metal_queue_ratio`        |Taxas de ocupação e de sobreposição da fila do Metal|
| `fastpq_zero_fill_duration_ms`    |Duração de preenchimento com zeros do host para execuções Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Largura de banda derivada com preenchimento de zeros|

As métricas de modo, de GPU, da fila do Metal e de preenchimento com zeros exigem o perfil de telemetria `extended` ou `full` e não são exportadas quando o Kura inicia com `init_mode = "fast"`. As métricas da fila do Metal e de preenchimento com zeros também exigem uma compilação `fastpq-gpu` no macOS.

Para a triagem geral de desempenho, use estes com os sinais de consenso e de fila listados em [Desempenho e Métricas](/pt/guide/advanced/metrics.md).

## Referência Relacionada {#related-reference}

- [Esquema do Modelo de Dados](/pt/reference/data-model-schema.md) para o instantâneo de tipos autoritativo do nó
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `FastpqPublicTransferStatementV1`
- `FastpqBalanceKeyV1`
- `FastpqExecutionQuantityKeyV1`
- `TransferTranscript`
- `AxtFastpqBinding`
- `AxtProofEnvelope`
- [Opções FastPQ do `iroha3d`](/pt/reference/iroha3d-cli.md#fastpq-overrides)
