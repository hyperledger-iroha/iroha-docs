---
translation_locale: pt
translation_source: /blockchain/consensus.md
translation_source_hash: 06b3589a71dcb08aed5589290f4c9af9cb46b5cee0f875ae542043543360f623
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Consenso {#consensus}

As transações entram em uma fila antes que Sumeragi as proponha em um bloco. Os validadores validam e executam a proposta de forma independente, e então assinam apenas a transição de estado que conseguem reproduzir. Um bloco é confirmado após o quórum necessário de validadores concordar com esse resultado e a carga correspondente estar disponível.

Todas as redes Iroha 3 usam manifestos técnicos de disponibilidade de dados assinados RS16 e fragmentos, além de recuperação por organismo certificado. A disponibilidade de dados é um requisito de consenso, não um recurso opcional de implantação.

## Sumeragi {#sumeragi}

Sumeragi é o motor de consenso tolerante a falhas bizantinas de Iroha. Ele pega transações da fila, faz com que os pares da rede de validadores concordem em um mesmo bloco ordenado e finaliza esse bloco apenas depois que validadores suficientes tiverem reproduzido o mesmo resultado e assinado o certificado de commit de consenso.

### Proposta e caminho de commit {#proposal-and-commit-path}

Sumeragi faz o registro avançar uma altura de bloco por vez. Em cada altura, um validador atua como proponente na visão atual. O proponente retira transações elegíveis da fila, constrói um bloco candidato e anuncia a proposta ao conjunto ativo de validadores. Cadeias ociosas não produzem blocos vazios.

O mesmo pipeline de processamento Sumeragi é usado em implantações tanto permissionadas quanto de Prova de Participação Nomeada (NPoS):

1. Um validador propõe um bloco a partir de transações enfileiradas.
2. Os validadores validam a proposta executando as transações contra o mesmo estado do mundo.
3. Os validadores trocam votos e certificados de quórum de consenso para a altura e visão atuais.
4. Uma vez que o quórum de commit é alcançado, os pares da rede confirmam o bloco e atualizam seu estado mundial.

Os validadores assinam apenas os dados que podem reproduzir localmente. Antes de votar, um validador verifica se a proposta pertence à cadeia, altura e visão esperadas; se as assinaturas e limites das transações satisfazem as regras do protocolo; se o roteamento da via de execução e a validação do executor são determinísticos; e que a execução do payload produz a transição de estado esperada. Se o resultado local for diferente, o validador rejeita a proposta em vez de votar nela.

Votos são pequenas mensagens de consenso assinadas. Eles se referem ao bloco proposto, à altura, à visão e à identidade do validador. Assinaturas verificadas formam certificados de quórum de preparação e de confirmação do consenso. Um certificado de commit de consenso é a prova durável de que validadores suficientes observaram o mesmo resultado para o mesmo bloco. Cada validador envia seus votos de Preparação e Commit para o comitê completo; qualquer validador pode agregar os votos iguais necessários e transmitir o certificado resultante.

### Quórum e observadores {#quorum-and-observers}

O protocolo da primeira versão admite apenas um comitê votante com exatamente `3f + 1` membros, de 4 a 31 validadores. Portanto, os tamanhos válidos são 4, 7, 10 e assim por diante, até 31. Para `n = 3f + 1`, o limite de falhas bizantinas é `f` e o quórum de confirmação é `2f + 1`. A geração da gênese e a validação na inicialização rejeitam qualquer outra composição de comitê. Cada PrepareQC, CommitQC e TimeoutCert contém exatamente `q = n - f` votos de validadores com o mesmo peso; conjuntos com signatários adicionais são rejeitados.

Os pares observadores da rede podem sincronizar blocos confirmados, mas eles não propõem, votam ou contam para o quórum de confirmação. Use observadores quando uma implantação precisar de capacidade de consulta local, indexação, monitoramento ou replicação regional de blocos sem aumentar o número de validadores votantes.

### Visualizar alterações e recuperação {#view-changes-and-recovery}

Uma visão é a tentativa do Sumeragi de finalizar uma altura com um proponente e uma programação específicos. Se o avanço da proposta, da carga, da votação ou da confirmação travar, o temporizador do consenso pode mover a altura para uma visão posterior. A mudança de visão não reescreve um bloco confirmado: ela altera como os validadores tentam concluir a altura pendente e leva adiante o quórum ou a prova de confirmação mais altos conhecidos para evitar blocos contraditórios.

A recuperação da carga útil é separada da decisão de finalização. Um par da rede pode receber um certificado de quórum ou de commit de consenso antes de ter a carga útil completa do bloco. Nesse caso, o par da rede solicita pedaços de carga útil assinados RS16 ou um corpo certificado, verifica os bytes recuperados em relação aos hashes criptográficos anunciados e somente então aplica o bloco ao estado do mundo e Kura.

### Modos de consenso {#consensus-modes}

O modo selecionado controla como o conjunto de validadores é formado e operado. Ele é declarado na gênese assinada por meio de [`consensus_mode`](/pt/reference/genesis.md) e fixado no contexto de cada altura. A configuração local `[sumeragi]` seleciona a função do nó, a custódia das chaves de assinatura, os caminhos dos registros de segurança e os ajustes documentados de tempo limite e sincronização. Os limites de blocos e transações, o modo de consenso e a cadência vêm da gênese assinada e do estado confirmado. Os validadores precisam da mesma gênese assinada, topologia, dados de pares confiáveis e parâmetros efetivos de Sumeragi.

|Modo|Melhor ajuste|Conjunto de validadores|Foco operacional|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Com permissão|Redes privadas, de consórcio e gerenciadas por operadores|Os validadores vêm da topologia de pares confiáveis acordada para a implantação|Mantenha iguais em todos os validadores a gênese assinada, os pares confiáveis, as chaves dos pares e os parâmetros do Sumeragi|
| NPoS | Redes públicas ou orientadas ao SORA Nexus nas quais a validação segue políticas de nomeação e stake | Os validadores são selecionados pelo perfil NPoS, geralmente por épocas, e exigem chaves BLS e provas de posse | Mantenha alinhados em toda a rede os instantâneos de stake, as entradas assinadas de época e eleição, as PoPs dos validadores e a cadência imutável dos blocos |

::: tip Modo com permissão

Use o modo com permissão quando a lista de validadores for uma escolha operacional explícita. Este é o ponto de partida usual para redes Iroha auto-hospedadas, porque as mudanças de membro são ações deliberadas de governança ou do administrador. A regra operacional importante é que todo validador deve operar com a mesma visão do gênese da blockchain, pares de rede confiáveis, BLS Provas de Posse e Sumeragi parâmetros. Um único par de rede com uma topologia diferente ou um blockchain genesis assinado pode impedir que a rede se comprometa.

:::

::: tip modo NPoS

Use o modo NPoS quando o perfil de implantação espera que a participação do validador seja determinada pela nomeação e pelo estado da participação. Implantações públicas SORA Nexus usam NPoS, e seus perfis gerados incluem as identidades de validadores BLS, Provas de Posse, configurações de época, e os parâmetros NPoS Sumeragi necessários na inicialização. Mudanças de época podem substituir o conjunto de validadores ativo em alturas definidas, portanto, os operadores precisam monitorar tanto a saúde do consenso quanto o estado de participação ou nomeação que alimenta a próxima lista.

:::

## Consenso multilinha {#multilane-consensus}

Espaços de dados definem ambientes para dados, autoridade, políticas e aplicações. Suas faixas de execução acrescentam capacidade de disseminação e certificação. Os catálogos são separados: `nexus.dataspace_catalog` define espaços de dados, e `nexus.lane_catalog` define faixas de execução, cada uma vinculada a um espaço de dados. Várias faixas de execução podem compartilhar o mesmo espaço de dados.

Para a execução global pública, a faixa de execução `0` é sequenciada pela instância global de Sumeragi. Cada outra encarnação ativa de uma faixa de execução opera uma instância separada do mesmo núcleo Sumeragi, com seu comitê e parâmetros de consenso fixados. Seu bloco certificado contém um lote ordenado de transações cuja admissão é verificada em relação a uma âncora global confirmada. A certificação da faixa de execução não altera o State global.

A cadeia global mescla os próximos blocos certificados contíguos de cada faixa de execução. A execução do bloco global resultante aplica essas transações em ordem canônica, e o CommitQC global finaliza essa execução. Portanto, um certificado de faixa de execução, por si só, é insuficiente para afirmar que uma transação alterou o State global. A identidade e a encarnação da faixa de execução, a atualidade da âncora, a custódia da fonte e as fronteiras contíguas de mesclagem continuam sendo verificadas durante toda a recuperação e execução.

A política confirmada `sumeragi_lane_policy` rege faixas de execução fixas, rotas, comitês e escalonamento automático. Um catálogo de configuração, por si só, não ativa uma faixa de execução de consenso. Destinos concretos de espaço de dados devem corresponder a uma faixa de execução admitida; uma rota privada indisponível é rejeitada, em vez de ser executada como trabalho universal. Lotes completos do plano de controle são encaminhados pela faixa de execução `0` para permitir o avanço das transições de catálogo e ativação.

Uma raiz de espaço de dados assinada de forma independente constitui um limite separado de execução, com seu próprio State e finalização local. Registrar uma entrada no catálogo de espaços de dados não cria essa raiz. A atomicidade entre raízes usa o protocolo AMX separado. A qualificação monetária e de toda a rede para esse caminho permanece em aberto no candidato fixado.

Consulte a [implementação das faixas](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs), o [contrato das faixas](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_lanes.md), o [contrato dos espaços de dados independentes](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) e o [status de qualificação](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi_goals.md) no commit fixado.

## Disponibilidade de dados e recuperação de carga {#data-availability-and-payload-recovery}

Sumeragi V1 fornece disponibilidade global da carga útil por meio das mensagens RS16 assinadas `PayloadManifest` e `PayloadChunk`. O líder envia o manifesto assinado a todo o comitê e distribui inicialmente fragmentos determinísticos ao Conjunto A. Um validador só pode emitir um voto Prepare após reconstruir o corpo canônico, validar o manifesto e os hashes dos fragmentos, armazenar o corpo de forma durável e concluir a validação determinística. Se o caminho rápido parar de avançar, a recuperação amplia a entrega de fragmentos para o Conjunto B. A recuperação de corpos certificados e a sincronização de blocos fornecem um caminho de recuperação com limites definidos quando um par toma conhecimento da finalização antes de receber o corpo.

Cada instância de faixa de execução usa seu próprio contexto autenticado de disponibilidade e certificados. As verificações de mesclagem global vinculam o lote certificado e a carga útil original à encarnação e à âncora esperadas. Um par só aplica a finalização global quando dispõe localmente da carga útil global correspondente e de um CommitQC válido.

Use as superfícies do operador autenticado em vez de um endpoint separado RBC API:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` relata a altura, visão, fase, certificados e estado de vivacidade autoritativos.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` apresenta diagnósticos da fila, do pipeline, de NPoS, das faixas e dos espaços de dados, incluindo a propriedade da carga útil de cada faixa. Esses diagnósticos não constituem uma fonte autoritativa.
- Sinais do Prometheus, como `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` e `sumeragi_da_gate_satisfied_total`, separam a recuperação de corpo ausente, portões de disponibilidade de dados e o manuseio de mensagens; veja [Desempenho e métricas](/pt/guide/advanced/metrics.md).

Os repositórios de blocos das faixas de execução retêm os lotes certificados e os registros de origem necessários para mesclagem e recuperação. Seu ciclo de vida acompanha a encarnação confirmada da faixa de execução; o nome de um diretório de armazenamento não autoriza uma nova faixa de execução nem uma nova raiz de execução.
