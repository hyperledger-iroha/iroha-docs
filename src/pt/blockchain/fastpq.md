---
translation_locale: pt
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ é o caminho de prova STARK de Iroha para os efeitos de execução selecionados. Ele não substitui a execução normal de transações ou o consenso. As transações ainda execute ISI, IVM e Sumeragi como de costume; FastPQ consome a prova de execução determinística e transforma efeitos suportados em lotes de prova.

A integração atual do host possui dois caminhos principais:

- transferências numéricas de ativos transparentes registradas durante a execução do bloco
- envelopes de prova AXT do SORA Nexus cujo `fastpq_binding` contém um vínculo FastPQ

## Caminho da Testemunha de Transferência {#transfer-witness-path}

Transferências numéricas transparentes criam uma transcrição de transferência estruturada quando a instrução altera os saldos. A transcrição registra:

- a conta de origem, a conta de destino, a definição do ativo e o valor
- saldos do remetente e do destinatário antes e depois da transferência
- o hash criptográfico do ponto de entrada da transação usado como o hash criptográfico do lote
- um valor principal de resumo criptográfico de autorização derivado da conta que está enviando
- um valor de resumo criptográfico Poseidon para transcrições de delta único

Transferências em lotes usam uma transcrição com múltiplos deltas. Nesse caso, o valor do resumo criptográfico Poseidon de delta único está ausente.

Na finalização do bloco, Iroha agrupa essas transcrições pelo hash criptográfico de entrada. A testemunha de execução então carrega tanto os pacotes de transcrições originais quanto os lotes de transição FastPQ preparados para o provador.

Cada delta de transferência se torna duas linhas de transição:

|Linha|Formato da chave|Pré-valor|Pós-valor|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débito do remetente| `asset/<asset-definition>/<source-account>`      |saldo do remetente antes|saldo do remetente após|
|Crédito do receptor| `asset/<asset-definition>/<destination-account>` |saldo do receptor antes|saldo do receptor após|

Valores numéricos são normalizados em unidades testemunhas inteiras. Um valor é rejeitado para o lote FastPQ se não puder ser representado como um `u64` não negativo na escala decimal selecionada.

## Entradas Públicas {#public-inputs}

Cada lote de transição FastPQ carrega entradas públicas que vinculam a prova ao bloco e ao contexto de execução:

|Entrada|Significado|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Identificador de espaço de dados codificado como bytes em little-endian|
| `slot`        |Tempo de criação do bloco convertido para nanossegundos|
| `old_root`    |Raiz do estado pai derivada da testemunha de execução|
| `new_root`    |Raiz pós-estado derivada da testemunha de execução|
| `perm_root`   |Compromisso de Poseidon sobre permissões de funções ativas|
| `tx_set_hash` |hash criptográfico sobre transação ordenada e entrada de acionamento por tempo hashes criptográficos|

O host usa o único conjunto de parâmetros da primeira versão, `fastpq-state-transition-stark-v1`, para esses lotes.

## Protocolo de prova {#proof-protocol}

Os artefatos canônicos de transferência são provas DEEP mascaradas sobre o campo Goldilocks com uma extensão de grau 4. Sua relação exata, sua transcrição e sua geometria de consultas são definidas no [contrato fixado do protocolo DEEP do FastPQ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md).

## O Que o Verificador Confere {#what-the-prover-checks}

Antes de construir o rastreamento, o provador FastPQ canoniciza a ordem do lote por chave de transição, classificação da operação e ordem de inserção. As linhas de transferência também exigem metadados da transcrição. Um lote com linhas de transferência mas sem transcrições de transferência é inválido.

Para a transferência de históricos escolares, as verificações do lado do provedor incluem:

- o saldo do remetente não deve ficar negativo
- `sender_after` deve ser igual a `sender_before - amount`
- `receiver_after` deve ser igual a `receiver_before + amount`
- a transcrição deve cobrir cada linha de transferência no lote
- um resumo Poseidon de delta único, quando presente, deve corresponder à pré-imagem da transcrição
- provas de Merkle esparsas fornecidas devem decodificar como versão 1; caminhos ausentes são preenchidos com provas sintéticas determinísticas

O rastreamento contém colunas de seletor para transferência, emissão, queima, concessão de função, revogação de função, definição de metadados e linhas de consulta de permissão. As linhas de operação numérica também carregam deltas com sinal, deltas acumulados por ativo e contadores de suprimento.

## Prover pista de execução {#prover-lane}

`iroha3d` inicia a linha de execução do provador FastPQ na inicialização se o backend do provador puder ser inicializado. A linha de execução é uma tarefa em segundo plano com uma fila limitada. Após um bloco produzir uma prova de execução, o caminho de confirmação envia um trabalho de provador contendo o hash criptográfico do bloco, altura, visualização e prova.

Se a fila de execução não estiver funcionando ou a fila estiver cheia, o trabalho é ignorado e o processamento normal do bloco continua. Isso significa que a fila de execução do provedor de background não é um portão de admissão de transações ou de consenso. É um caminho de produção de provas sobre um estado que já foi executado.

A pista de execução constrói um verificador com:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Ambas as configurações padrão para `cpu`. Selecionar `gpu` é uma solicitação explícita de falha segura: se o suporte a GPU não estiver compilado ou um backend GPU solicitado falha na verificação prévia, a linha de execução do provador permanece desativada. A primeira versão não possui valor `auto` e não retorna de um modo GPU solicitado para CPU.

## Verificação {#verification}

FastPQ a verificação da prova reconstrói o compromisso de lote canônico e reproduz a transcrição pública. O verificador verifica a versão do protocolo, a versão do conjunto de parâmetros, os limites de reprodução, o compromisso de rastreamento, as entradas públicas, as aberturas de Merkle amostradas, AIR aberturas e a cadeia de consultas FRI.

Os limites padrão de repetição incluem:

|Limite|Padrão|
| ------------------ | ------: |
|Linhas de transição|     256 |
|Tamanho da carga do lote|256 KiB|
| FRI camadas         |      16 |
|Aberturas de consulta|     128 |

## Envelopes de prova AXT do SORA Nexus {#sora-nexus-axt-proof-envelopes}

Os envelopes de prova AXT do SORA Nexus podem incorporar um `AxtFastpqBinding`. A validação de blocos dos envelopes AXT, as verificações de envelopes AXT do host da IVM e `RegisterVerifiedFeeSponsorVaultAllocation` exigem o `fastpq_binding` do envelope, comparam-no com a declaração esperada e chamam o verificador FastPQ sobre o envelope e sua prova incorporada. Um vínculo ausente ou uma verificação malsucedida rejeita a operação.

### AXT Vinculação Matemática {#axt-binding-math}

Nos envelopes AXT do SORA Nexus, `AxtFastpqBinding` é normalizado em forma canônica antes da reexecução da prova. Valores vazios de `parameter`, `verifier_id` ou `verifier_version` são rejeitados; o ID do verificador deve ser `fastpq` e a versão `v1`, e os fluxos AXT mantidos usam `fastpq-state-transition-stark-v1`. O tipo de declaração tem os espaços em branco das extremidades removidos e é convertido para minúsculas.

Os AXT FastPQ inputs públicos são hashes criptográficos de bytes determinísticos:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT as chaves de transição são:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

A reivindicação `authorization` insere uma linha de concessão de função:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

e uma linha de metadados que vincula a política de autorização. A declaração `compliance` insere duas linhas de metadados: uma para a política e outra para os espaços de dados de destino.

Para `tx_predicate` e `value_conservation`, um valor explícito de efeito é usado quando a vinculação contém um valor de origem ou destino positivo. Caso contrário, o código deriva um valor determinístico limitado:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Então as mesmas equações de transferência são usadas:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Os IDs de conta do remetente e do destinatário sintéticos são gerados a partir de sementes de chave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

O hash criptográfico do lote de transferência é:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

O valor do resumo criptográfico do manifesto técnico do lote AXT é SHA-256 sobre a codificação Norito da vinculação canônica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Conjuntos de Parâmetros {#parameter-sets}

A primeira versão tem exatamente um conjunto canônico de parâmetros, `fastpq-state-transition-stark-v1`. Ele visa segurança de 128 bits sobre o campo Goldilocks com uma extensão de grau 4 (`X^4 - 7`) e usa tamanho de traço `2^16`, tamanho de LDE `2^19`, aridade FRI 2, fator de expansão 8, no máximo 17 reduções e 136 consultas.

## Configuração {#configuration}

A configuração FastPQ está aninhada sob `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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
```

Os mesmos rótulos de execução e telemetria podem ser substituídos a partir de `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Variáveis de ambiente também são suportadas para os campos de configuração. As variáveis específicas do FastPQ incluem:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Métricas {#metrics}

Quando a telemetria é habilitada, FastPQ exporta métricas para a seleção de backend e o comportamento do tempo de execução do software Metal:

|Métrica|Significado|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de execução solicitado e resolvido por rótulos de back-end e dispositivo|
| `fastpq_poseidon_pipeline_total`  |Caminho da linha de processamento do Poseidon solicitado e resolvido|
| `fastpq_metal_queue_depth`        |Limite de fila de metal, contagem máxima em voo, contagem de despacho e janela de amostragem|
| `fastpq_metal_queue_ratio`        |Fila de metal ocupada e taxas de sobreposição|
| `fastpq_zero_fill_duration_ms`    |Duração de preenchimento com zeros do host para execuções Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Largura de banda derivada com preenchimento de zeros|

Para a triagem geral de desempenho, use estes com os sinais de consenso e de fila listados em [Desempenho e Métricas](/pt/guide/advanced/metrics.md).

## Referência Relacionada {#related-reference}

- [Esquema do Modelo de Dados](/pt/reference/data-model-schema.md) para a visualização de dados ponto no tempo do tipo autoritativo do nó
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ opções](/pt/reference/iroha3d-cli.md#fastpq-overrides)
