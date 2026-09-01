---
translation_locale: pt
translation_source: /blockchain/consensus.md
translation_source_hash: fdc9a35ac2e43acda076104063b5a364feb5060a70473b51cf016b8adb1306d3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consenso {#consensus}

As transações entram em uma fila antes que Sumeragi as proponha em um bloco. Os validadores validam e executam a proposta de forma independente, e então assinam apenas a transição de estado que conseguem reproduzir. Um bloco é confirmado após o quórum necessário de validadores concordar com esse resultado e a carga correspondente estar disponível.

Todas as redes Iroha 3 usam manifestos técnicos de disponibilidade de dados assinados RS16 e fragmentos, além de recuperação por organismo certificado. A disponibilidade de dados é um requisito de consenso, não um recurso opcional de implantação.

## Sumeragi {#sumeragi}

Sumeragi é o motor de consenso tolerante a falhas bizantinas de Iroha. Ele pega transações da fila, faz com que os pares da rede de validadores concordem em um mesmo bloco ordenado e finaliza esse bloco apenas depois que validadores suficientes tiverem reproduzido o mesmo resultado e assinado o certificado de commit de consenso.

### Proposta e caminho de commit {#proposal-and-commit-path}

Sumeragi avança o registro do blockchain um bloco de cada vez. Em cada altura, um validador atua como proponente para a visão atual. O proponente retira transações elegíveis da fila, constrói um bloco candidato e anuncia a proposta ao conjunto de validadores ativos.

O mesmo pipeline de processamento Sumeragi é usado em implantações tanto permissionadas quanto de Prova de Participação Nomeada (NPoS):

1. Um validador propõe um bloco a partir de transações enfileiradas.
2. Os validadores validam a proposta executando as transações contra o mesmo estado do mundo.
3. Os validadores trocam votos e certificados de quórum de consenso para a altura e visão atuais.
4. Uma vez que o quórum de commit é alcançado, os pares da rede confirmam o bloco e atualizam seu estado mundial.

Os validadores assinam apenas os dados que podem reproduzir localmente. Antes de votar, um validador verifica se a proposta pertence à cadeia, altura e visão esperadas; se as assinaturas e limites das transações satisfazem as regras do protocolo; se o roteamento da via de execução e a validação do executor são determinísticos; e que a execução do payload produz a transição de estado esperada. Se o resultado local for diferente, o validador rejeita a proposta em vez de votar nela.

Votos são pequenas mensagens de consenso assinadas. Eles se referem ao bloco proposto, à altura, à visão e à identidade do validador. Assinaturas verificadas formam certificados de quórum de preparação e de confirmação do consenso. Um certificado de commit de consenso é a prova durável de que validadores suficientes observaram o mesmo resultado para o mesmo bloco. Cada validador envia seus votos de Preparação e Commit para o comitê completo; qualquer validador pode agregar os votos iguais necessários e transmitir o certificado resultante.

### Quórum e observadores {#quorum-and-observers}

O protocolo da primeira versão admite apenas um comitê de votação exato `3f + 1`, de 4 a 31 validadores. Os tamanhos válidos são, portanto, 4, 7, 10, e assim por diante, até 31. Para `n = 3f + 1`, o orçamento de falhas bizantino é `f` e o quórum de aprovação é `2f + 1`. A geração do gênesis da blockchain e a validação de inicialização rejeitam qualquer outra geometria de comitê.

Os pares observadores da rede podem sincronizar blocos confirmados, mas eles não propõem, votam ou contam para o quórum de confirmação. Use observadores quando uma implantação precisar de capacidade de consulta local, indexação, monitoramento ou replicação regional de blocos sem aumentar o número de validadores votantes.

### Visualizar alterações e recuperação {#view-changes-and-recovery}

Uma visão é a tentativa do Sumeragi de finalizar uma altura com um proponente e uma programação específicos. Se o avanço da proposta, da carga, da votação ou da confirmação travar, o temporizador do consenso pode mover a altura para uma visão posterior. A mudança de visão não reescreve um bloco confirmado: ela altera como os validadores tentam concluir a altura pendente e leva adiante o quórum ou a prova de confirmação mais altos conhecidos para evitar blocos contraditórios.

A recuperação da carga útil é separada da decisão de finalização. Um par da rede pode receber um certificado de quórum ou de commit de consenso antes de ter a carga útil completa do bloco. Nesse caso, o par da rede solicita pedaços de carga útil assinados RS16 ou um corpo certificado, verifica os bytes recuperados em relação aos hashes criptográficos anunciados e somente então aplica o bloco ao estado do mundo e Kura.

### Modos de consenso {#consensus-modes}

O modo selecionado determina como o conjunto de validadores é formado e operado. Ele é declarado por [`consensus_mode`](/pt/reference/genesis.md) na gênese assinada e fica fixo no contexto de cada altura. A configuração local `[sumeragi]` escolhe somente o papel do nó e os limites finitos de blocos, fila, ambiente de execução, armazenamento e política de chaves; ela não pode substituir o modo nem a cadência dos blocos. Todos os validadores precisam da mesma gênese assinada, topologia, dados de pares confiáveis e parâmetros efetivos do Sumeragi.

|Modo|Melhor ajuste|Conjunto de validadores|Foco operacional|
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Com permissão|Redes privadas, de consórcio e gerenciadas por operadores|Os validadores vêm da topologia de pares confiáveis acordada para a implantação|Mantenha iguais em todos os validadores a gênese assinada, os pares confiáveis, as chaves dos pares e os parâmetros do Sumeragi|
| NPoS |Redes públicas ou orientadas ao Nexus, cuja validação segue políticas de nomeação e participação|O perfil NPoS seleciona os validadores, normalmente entre épocas, e exige chaves BLS e provas de posse|Mantenha alinhados em toda a rede os instantâneos de participação, as entradas assinadas de época e eleição, as PoPs dos validadores e a cadência imutável dos blocos|

::: tip Modo com permissão

Use o modo com permissão quando a lista de validadores for uma escolha operacional explícita. Este é o ponto de partida usual para redes Iroha auto-hospedadas, porque as mudanças de membro são ações deliberadas de governança ou do administrador. A regra operacional importante é que todo validador deve operar com a mesma visão do gênese da blockchain, pares de rede confiáveis, BLS Provas de Posse e Sumeragi parâmetros. Um único par de rede com uma topologia diferente ou um blockchain genesis assinado pode impedir que a rede se comprometa.

:::

::: tip modo NPoS

Use o modo NPoS quando o perfil de implantação espera que a participação do validador seja determinada pela nomeação e pelo estado da participação. Implantações públicas SORA Nexus usam NPoS, e seus perfis gerados incluem as identidades de validadores BLS, Provas de Posse, configurações de época, e os parâmetros NPoS Sumeragi necessários na inicialização. Mudanças de época podem substituir o conjunto de validadores ativo em alturas definidas, portanto, os operadores precisam monitorar tanto a saúde do consenso quanto o estado de participação ou nomeação que alimenta a próxima lista.

:::

## Consenso multilinha {#multilane-consensus}

O caminho de consenso multilane de Iroha é implementado através da pista de execução Nexus e da configuração de espaço de dados. Ele não inicia uma instância de consenso separada para cada pista de execução. Sumeragi ainda finaliza um fluxo de bloco ordenado; as pistas de execução descrevem como as transações são roteadas, agendadas, contabilizadas e armazenadas dentro desse fluxo.

A configuração de tempo de execução do software constrói três partes do estado da pista de execução:

- `nexus.lane_catalog`: as pistas de execução configuradas, cada uma com um `LaneId` numérico, alias, espaço de dados, visibilidade, perfil de armazenamento, esquema de prova e metadados.
- `nexus.dataspace_catalog`: os espaços de dados configurados, cada um com um `DataSpaceId` numérico e um valor de tolerância a falhas usado para dimensionamento do comitê de retransmissão.
- `nexus.routing_policy`: o par padrão de pista/espaço de dados e as regras de roteamento ordenadas que podem corresponder a contas ou caminhos de instrução.

Quando uma transação entra na fila, o roteador da pista de execução a resolve para um `RoutingDecision { lane_id, dataspace_id }`. No modo de pista única, isto é sempre a pista de execução `0` e o espaço de dados universal. No modo Nexus, o roteador configurado aplica regras com escopo no espaço de dados, roteamento de liquidação, regras de conta, regras de roteamento explícitas e, finalmente, a rota padrão. A pista de execução resolvida e o espaço de dados devem existir em seus catálogos, e a pista de execução deve estar vinculada ao espaço de dados resolvido; caso contrário, a transação é rejeitada antes de ser enfileirada.

A fila mantém essa decisão de roteamento com o hash criptográfico da transação para que os estágios posteriores não precisem inferi-la novamente. A construção da proposta então usa os metadados da linha de execução de duas maneiras:

- Ele intercala transações por pista de execução para que uma pista de execução não domine o bloco apenas porque suas transações foram enfileiradas primeiro.
- Aplica limites por unidade de execução de transação por faixa (TEU). As transações que excederiam a capacidade configurada de uma faixa de execução são adiadas e reenfileiradas, exceto que a primeira transação com excesso de peso para uma faixa de execução pode ser admitida para evitar livelock.

Durante a preparação do candidato, Sumeragi agrega a carga útil proposta por pista de execução e espaço de dados e deriva as identidades de disponibilidade de dados locais da pista. Os totais registrados incluem contagem de transações, blocos, bytes da carga útil e TEU. Após o commit, esses totais se tornam a pista de execução e os pontos de compromisso do espaço de dados em visualizações de dados no momento expostas por meio de diagnósticos autenticados Sumeragi. Se um bloco contiver registros de resultados do protocolo de liquidação da pista de execução, o processamento do bloco também cria compromissos de liquidação da pista de execução e dados de retransmissão contenedores que vinculam o cabeçalho do bloco, certificado de compromisso de consenso, hash criptográfico de compromisso de disponibilidade de dados, prova de liquidação e tamanho da carga útil da via de execução.

## Disponibilidade de dados e recuperação de carga {#data-availability-and-payload-recovery}

Sumeragi v2 carrega a disponibilidade global de payload através de mensagens assinadas RS16 `PayloadManifest` e `PayloadChunk`. O líder envia o manifesto técnico assinado para o comitê completo e inicialmente distribui fragmentos determinísticos para o Conjunto A. Um validador pode preparar-voto apenas após reconstruir o corpo canônico, validar o manifesto técnico e os hashes criptográficos dos fragmentos, armazenando o corpo de forma durável, e completando a validação determinística. Se o caminho rápido falhar, a recuperação expande a entrega de blocos para o Conjunto B. A recuperação com corpo certificado e a sincronização de blocos fornecem o caminho de recuperação limitado quando um par da rede aprende a finalização antes de receber o corpo.

A execução multilane também deriva um hash criptográfico determinístico de propriedade de payload e um hash criptográfico de instância RBC local na lane para cada sujeito da lane de execução. Essas identidades vinculam propostas e certificados de pista de execução à transação global do operador; elas não são uma sessão de consenso global separada. Um bloco ainda é finalizado apenas quando o par da rede possui um certificado de confirmação de consenso válido e a carga correspondente localmente.

Use as superfícies do operador autenticado em vez de um endpoint separado RBC API:

- `iroha --operator-private-key-file <path> --output-format text ops sumeragi status` relata a altura, visão, fase, certificados e estado de vivacidade autoritativos.
- `iroha --operator-private-key-file <path> --output-format text ops sumeragi diagnostics` mostra diagnósticos não vinculantes da fila, do pipeline, de NPoS, das vias de execução e dos espaços de dados, inclusive a propriedade da carga útil de cada via.
- Sinais do Prometheus, como `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total` e `sumeragi_da_gate_satisfied_total`, separam a recuperação de corpo ausente, portões de disponibilidade de dados e o manuseio de mensagens; veja [Desempenho e métricas](/pt/guide/advanced/metrics.md).

Kura usa a configuração de pista de execução derivada para o layout de armazenamento. Cada pista de execução recebe nomes de armazenamento determinísticos, como `blocks/lane_000_core` e `merge_ledger/lane_000_core_merge.log`; mudanças no ciclo de vida da pista de execução podem provisionar, desativar ou renomear esses segmentos sem alterar a ordem global dos blocos.
