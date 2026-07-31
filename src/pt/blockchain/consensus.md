---
translation_locale: pt
translation_source: /blockchain/consensus.md
translation_source_hash: a4c59672f20f0a3363fdd098852a7e0e8159fa082e88825d6346731733ecdcb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Consenso {#consensus}

As transações entram em fila antes que Sumeragi as propor em um bloco. Validadores validam e executam independentemente a proposta, depois assinam apenas a transição de estado que podem reproduzir. Um bloco compromete-se após o quórum de validador necessário concordar com esse resultado e a carga útil correspondente estiver disponível.

Todas as redes Iroha 3 utilizam os caminhos de disponibilidade de dados e de difusão confiáveis. São requisitos de consenso, não características opcionais de implantação.

## Sumeragi {#sumeragi}

Sumeragi é o motor de consenso tolerante a falhas bizantinas do Iroha. Ele leva transações da fila, faz com que os pares de validadores concordam sobre o mesmo bloco ordenado e finaliza esse bloco somente depois que suficientes validadores tenham reproduzido o mesmo resultado e assinado o certificado de compromisso.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Proposta e caminho de compromissos {#proposal-and-commit-path}

Sumeragi corre o livro-razão para a frente uma altura de blocos por vez. A cada altura, um validador atua como proponente da visão atual. O proponente elimina transações elegíveis da fila, constrói um bloco candidato e anuncia a proposta ao conjunto ativo de validadores.

O mesmo Sumeragi é utilizado tanto em instalações autorizadas como em instalações de prova de participação (NPoS):

1. Um validador propõe um bloqueio de transações em fila.
2. Os validadores validam a proposta executando as transacções contra o mesmo Estado mundial.
3. Os validadores trocam votos e certificados de quórum pela altura e visão atuais.
4. Uma vez alcançado o quórum de compromisso, os pares comprometem o bloqueio e atualizam seu estado mundial.

Os validadores assinam apenas dados que podem reproduzir localmente. Antes de votar, um validador verifica se a proposta pertence à cadeia, altura e visualização esperadas; se as assinaturas e os limites da transação são válidos; se o roteamento de faixa e a validação do executor são deterministas; Se o resultado local for diferente, o validador rejeita a proposta em vez de votar para ela.

Os votos são pequenas mensagens de consenso assinadas. Eles se referem ao bloco proposto, a altura, a visão e a identidade do validador. O certificado é a prova duradoura de que um número suficiente de validadores observou o mesmo resultado para o mesmo bloco.

### Quórum, coletores e observadores {#quorum-collectors-and-observers}

A contagem de validadores de voto `n` define o orçamento de falhas bizantinas. Para redes com pelo menos quatro validadores, o orçamento é `f = floor((n - 1) / 3)` e o quórum de compromissos é `2f + 1`. Para um a três validadores, todos os validadores são necessários para o compromisso, que é útil para o desenvolvimento, mas não tem nenhum atraso prático offline.

Os coletores são uma otimização de fanout. Em vez de cada validador enviar todos os votos para todos os outros validadores, Sumeragi pode selecionar um ou mais coletores para uma altura. Os colectores reunem votos, publicam o progresso do quórum e reduzem a quantidade de tráfego de voto duplicado. As configurações efetivas do colector são expostas através de `GET /v1/sumeragi/collectors`; a imagem instantânea `ops sumeragi telemetry` da CLI relata o conteúdo atual do colector.

Os colegas observadores podem sincronizar os blocos comprometidos, mas eles não propõem, votam, coletam votos ou contam para o quórum do comitê. - Não . Usar observadores quando uma implantação precisa de capacidade local de consulta, indexação, monitoramento. - a replicação de blocos regionais sem aumentar o número de validadores de voto.

### Visualizar alterações e recuperação {#view-changes-and-recovery}

Uma visão é a tentativa de Sumeragi de finalizar uma altura com um determinado proponente e plano de cronometragem. Se a proposta, carga útil, votação ou compromissos de progresso interromperem, o pacemaker pode mover a altura para uma visão posterior. Ele muda a forma como os validadores tentam terminar a altura não comprometida, levando adiante o quórum mais alto conhecido ou comprovando para que os pares não finalizem blocos conflitantes.

A recuperação da carga útil é separada da decisão de finalidade. Um peer pode receber um quórum ou certificado de compromisso antes de ter a carga útil total do bloco. Nesse caso, o peer usa uma transmissão confiável (RBC) ou sincronização de bloco para recuperar a carga útil, verifica-a contra os hashes anunciados, e só então aplica-se o bloco ao estado mundial e Kura.

### Modalidades de consenso {#consensus-modes}

O modo selecionado controla a forma como o conjunto de validador é formado e operado. É declarado em gênese através [`consensus_mode`](/pt/reference/genesis.md) e na configuração peer através `sumeragi.consensus_mode`. Trate-o como um estado em toda a rede: os validadores precisam da mesma gênese assinada, topologia, dados de confiança entre pares e parâmetros eficazes Sumeragi.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

|Modo .|O melhor ajuste .|Conjunto de validador |Foco operacional |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Permissão .|Redes privadas, de consórcio e geridas pelo operador |Os validadores vêm da topologia de confiança dos pares acordada pela implantação |Mantenha todos os validadores na mesma genética assinada, pares de confiança, chaves de pares e parâmetros Sumeragi |
|NPOS |Redes públicas ou orientadas a Nexus em que a validação siga a política de nomeação e participação |Os validadores são selecionados pelo perfil do NPoS, geralmente em diferentes épocas, e exigem chaves BLS mais provas de posses |Mantenha as instantâneas de jogo, os parâmetros da época, o validador PoPs, e os tempos de fase NPoS alinhados em toda a rede |

::: tip Modo permitido

Utilize o modo autorizado quando a lista de validadores for uma escolha operacional explícita. Este é o ponto de partida habitual para auto-hosting Iroha redes porque as mudanças de associação são ações deliberadas de governança ou de administradores. A importante regra operacional é que cada validador deve executar com a mesma visão da gênese, colegas de confiança, BLS Prova de posse, e Sumeragi Uma única peer com uma topologia diferente ou genesis assinada pode impedir a rede de se comprometer.

:::

::: tip Modo de NPOS

Usar o modo NPoS quando o perfil de implantação espera que a participação do validador seja impulsionada pela nomeação e estado da participação. As implementações públicas SORA Nexus usam o NPoS, e os perfis gerados incluem as identidades do validador BLS, provas de posse, configurações de época, e Sumeragi Parâmetros NPoS necessários no início. As mudanças de época podem substituir o validador ativo definido em alturas definidas, por isso os operadores precisam monitorar tanto a saúde do consenso quanto o estado da participação ou indicação que alimenta a próxima lista.

:::

## Consenso multiláneo {#multilane-consensus}

O caminho de consenso multilaneiro do Iroha é implementado através da configuração Nexus de faixa e espaço de dados. Não inicia uma instância de consenso separada para cada faixa. Sumeragi ainda finaliza um fluxo de blocos ordenado; linhas descrevem como as transações são encaminhadas, programadas, contabilizadas e armazenadas dentro desse fluxo.

A configuração de tempo de execução constrói três pedaços do estado da faixa:

- `lane_catalog`: as faixas configuradas, cada uma com um número `LaneId`, alias, espaço de dados, visibilidade, perfil de armazenamento, esquema de prova e metadados.
- `dataspace_catalog`: os espaços de dados configurados, cada um com um valor numérico `DataSpaceId` e um valor de tolerância a falhas utilizado para o dimensionamento do comité de relevo.
- `routing_policy`: o par padrão de faixa/espaço de dados e regras de roteamento ordenadas que possam corresponder a contas ou aos caminhos de instruções.

Quando uma transação entra na fila, o roteador de faixa resolve-a para um `RoutingDecision { lane_id, dataspace_id }`. No modo de linha única, este é sempre a faixa `0` e o espaço de dados universal. No modo Nexus, o roteador configurado aplica regras em escala de espaço de dados, roteamento de liquidação, regras de conta, regras explícitas de roteamento e, finalmente, a rota padrão. A faixa resolvida e o espaço de dados devem existir nos seus catálogos, e a faixa deve estar ligada ao espaço de dados resolvido; caso contrário, a transação é rejeitada antes de ser colocada em fila.

A fila mantém esta decisão de roteamento com o hash da transação para que os estágios posteriores não tenham de inferir novamente. A construção da proposta utiliza, em seguida, os metadados do carril de duas formas:

- Intercede as transações por faixa, de modo que uma faixa não domine o bloco só porque as suas transações foram colocadas em fila primeiro.
- Aplica-se limites de unidade de execução de transações por faixa (TEU). As transações que excedessem a capacidade configurada de uma faixa são adiadas e requeued, exceto que a primeira transação com sobrepeso para uma faixa pode ser admitida para evitar o livelock.

Durante a transmissão confiável, Sumeragi agrega a carga útil proposta por faixa e espaço de dados. Os totais registados incluem o número de transações, blocos de transmissão, bytes de carga útil e TEU. Após o compromisso, esses totais tornam-se os snapshots do compromisso com faixa e espacio de dados expostos através do status Sumeragi. Se um bloco contém recibos de liquidação de faixa, o processamento de blocos também cria compromissos de liquidações de faixa e envelopes de relevo que vinculam o cabeçalho do bloco, certificado de compromisso, hash de compromisso de disponibilidade de dados, prova de liquidacao e tamanho da carga útil da faixa.

## Transmissão confiável (RBC) {#reliable-broadcast-rbc}

Transmissão confiável (RBC) é o caminho de disseminação e recuperação da carga útil do Sumeragi. Ele ajuda os validadores e observadores a obterem o corpo de bloco que pertence a uma proposta ou um certificado de compromisso, especialmente quando uma mensagem `BlockCreated`, atualização de sincronização de bloco ou transferência direta de carga útil são atrasadas ou perdidas.

RBC funciona no nível de carga útil. O proponente anuncia uma sessão RBC para um hash de altura de bloco, visualização e carga útil, em seguida, envia pedaços de carga útil através da topologia de commit. Os peers rastream o recebimento de pedaços, validam a carga útil recuperada contra o hash anunciado e trocam sinais `READY` e `DELIVER` uma vez que suficientes validadores tenham observado a mesma carga útil. As sessões são limitadas por TTL, pedaço, fanout, pending-stash e persistentes limites de armazenamento para o tráfego de recuperação não pode crescer sem limite.

RBC não é uma decisão de consenso separada e não substitui o certificado de compromisso. Um bloco ainda se finaliza apenas quando o peer tem um certificado válido de compromisso e a carga útil correspondente localmente. O RBC contribui com evidências obrigatórias de disponibilidade e recuperação da carga útil, enquanto o progresso do commit é impulsionado pelo certificado commit mais carga útil local. Se o certificado chegar antes da carga útil , o peer pode recuperar a carga útil através de RBC ou sincronização de bloco e, em seguida, comprometer-se.

Operativamente, RBC é útil para o diagnóstico de gargalos de carga útil faltantes e de disponibilidade de dados:

- `iroha --output-format text ops sumeragi telemetry` mostra os votos de disponibilidade agregados, a contagem atual dos colecionadores e as sessões pendentes RBC.
- `GET /v1/sumeragi/rbc` e `GET /v1/sumeragi/rbc/sessions` expõem dados detalhados da sessão agregada e ativa sobre Torii, incluindo o progresso das partes, a prontidão, o estado de entrega e os atrasos na faixa ou no espaço de dados; ver pontos finais [Torii](/pt/reference/torii-endpoints.md).
- Os sinais Prometheus, como `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` e os medidores de backlog por faixa ou espaço de dados RBC ajudam a separar a perda da rede, a recuperação de pedaços e a pressão de armazenamento; ver [Performance and metrics](/pt/guide/advanced/metrics.md).

Kura utiliza a configuração de faixa derivada para o layout de armazenamento. Cada faixa recebe nomes de armazenagem deterministas, como `blocks/lane_000_core` e `merge_ledger/lane_000_core_merge.log`; mudanças no ciclo de vida da faixa podem fornecer, retirar ou reetiquetar esses segmentos sem mudar a ordem global dos blocos.
