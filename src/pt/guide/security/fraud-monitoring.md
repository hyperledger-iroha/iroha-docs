---
translation_locale: pt
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Monitoramento da fraude {#fraud-monitoring}

O monitoramento de fraudes para uma implantação Iroha é um controle operacional construído em torno dos eventos do registro, consultas, permissões e contexto de aplicação. Iroha registra o que foi enviado, aceito, rejeitado e cometido. O seu sistema de monitorização decide quais padrões são suspeitos para o seu processo empresarial e encaminha esses casos para revisores ou controles automatizados de resposta.

Trate o monitoramento de fraudes como um serviço separado em vez de uma lógica incorporada num validador. O serviço deve subscrever a atividade do livro-razão, enriquecê-lo com um contexto de risco fora da cadeia, persistir na evidência e enviar transações de resposta apenas através de contas que tenham permissões explícitas.

## Modelo de acompanhamento {#monitoring-model}

A função de acompanhamento útil tem quatro etapas:

1. Recolher os sinais do livro principal e do operador a partir de fluxos, consultas e métricas de eventos Torii.
2. Enriquecer os eventos com contexto fora da cadeia, tais como status do cliente, listas de contrapartes, identificadores de sessões de aplicação, limites esperados e caso IDs.
3. Detectar comportamento suspeito com regras deterministas, filas de revisores ou pontuação de risco.
4. Responda alertando os operadores, interrompendo os fluxos de trabalho do lado das aplicações, revogando permissões desnecessárias ou apresentando transações compensatórias quando o seu processo de governança o permitir.

Mantenha as decisões de política fora do consenso, a menos que cada validador deva reproduzir a mesma decisão. A validação em tempo de execução deve impor permissões e validade das transações. O monitoramento da fraude deve explicar o risco, preservar evidências e ajudar os operadores a agir rapidamente.

## Os sinais a recolher {#signals-to-collect}

Comece com assinaturas estreitas e adicione fluxos mais amplos apenas para a investigação:

|O sinal .|Fonte |Utilização |
| --- | --- | --- |
|Estatuto da transacção |Eventos do gasoduto |Detetar rejeições repetidas, tentativas falhadas de autorização e padrões incomuns de submissão |
|Ciclo de vida da conta e metadados |Eventos de dados e consultas de contas |Detectar novas contas, alterações de alias, atualizações de identidade e edições inesperadas de metadados |
|Saldos de activos e transferências |Eventos de dados sobre activos e consultas de activos |Detectar movimentos de alto valor, ventilação rápida, esgotos de equilíbrio e contrapartes incomuns |
|Funções e permissões |Questões de função e permissão, eventos de dados de função |Detectar a escalada dos privilégios, as subvenções de emergência e o acesso ultrapassado de alto risco |
|Mudanças de desencadeamento e contrato |Eventos de desencadeamento, contrato e executor |Detectar nova automação, alterar os caminhos de execução e atividade suspeita de atualização |
|Configuração e mudanças de pares |Configuração e eventos entre pares |Detectar alterações de governança que afetem a validação, rede ou visibilidade do operador |
|Saúde do operador |As rotas de status `/metrics` e Sumeragi |Separar o comportamento suspeito do usuário da sobrecarga de nós, pressão na fila ou falhas da rede |

Utilização [filtros de eventos](/pt/blockchain/filters.md) Para evitar o processamento de todo o fluxo de eventos quando uma regra requer apenas contas, ativos, funções ou alterações de configuração. Para a reconciliação periódica, combine o fluxo com paginado [Questões](/pt/blockchain/queries.md) Para que o monitor se recupere depois do tempo de inatividade.

## Regras de detecção {#detection-rules}

As famílias de regras comuns incluem:

|Família de regras |Condição de exemplo |Resposta típica |
| --- | --- | --- |
|Velocidade .|Uma conta transfere mais do que o montante esperado ou contagem num curto período de tempo |Os revisores de alertas e a pausa das retiradas no lado da aplicação para essa conta |
|A expansão .|Os fundos são transferidos de uma conta para muitas contas recém-conhecidas |Requer a aprovação manual antes de permitir transferências adicionais |
|Desgaste de equilíbrio .|Uma grande parte do saldo da conta sai logo após uma alteração de chave, alias ou metadados |Escalada da possível aquisição de contas |
|Escalada de privilégios |Uma autorização ou um papel de alto risco é concedido fora de uma janela de mudança |Alerta os operadores e revisa a operação de subvenção |
|Rejeição explodiu |Um assinante ou cliente produz transações repetidas e rejeitadas |Verifique se há abuso de credenciais, erros de integração ou investigação |
|Mudança de automação |Um desencadeador, contrato ou executor-relacionado objecto muda inesperadamente |Pausa os fluxos de trabalho dependentes até que a alteração seja revisada |
|Mudanças sensíveis à governação |Mudanças no estado de peer, configuração ou tempo de execução ocorrem sem um bilhete aprovado |Comparar com o registo de governança e o processo de incidentes |

As regras devem ser explícitas sobre as provas que exigem, o período de tempo em que avaliam, a ação que tomam e a pessoa ou sistema que pode encerrar o caso. Os limites que dependem do risco do cliente, do tipo de ativo ou da jurisdição pertencem à configuração do seu serviço de monitorização e não aos scripts ad hoc.

## Controles de resposta {#response-controls}

Projetar ações de resposta antes de ativar as alertas. Um caso de fraude de elevada gravidade deve ter um caminho documentado desde a detecção até à contenção:

- notificar os titulares de valores mobiliários, operações e empresas responsáveis pela definição do domínio ou dos ativos afectados;
- preservar o cursor de evento, hash do bloco, hash da transação, autoridade, carga útil e imagem instantânea da consulta usada pela regra de detecção
- Pausa as ações do lado da aplicação que estão fora do livro, tais como fluxos de trabalho de checkout, retirada, assinatura, ponte ou liquidação.
- Revocar as funções ou permissões que não são mais justificadas pelo plano de resposta a incidentes
- somente apresentar transações de acompanhamento em contabilidade quando a política de governança ativa e o modelo de permissão os permitirem;
- rotar as chaves quando a evidência sugere um compromisso com o signatário

Evite dar ao serviço de monitorização um acesso de escrita amplo.Use uma conta técnica dedicada com o menor conjunto de permissões necessárias para as ações de resposta que lhe é permitido realizar. A aprovação humana deve continuar a fazer parte de qualquer fluxo de trabalho que possa mover ativos, alterar permissões ou alterar a configuração orientada para validador.

## Evidência e retenção {#evidence-and-retention}

Armazenar as evidências de monitorização num sistema exclusivo do apêndice, separado do diretório de dados do validador.

- Nome do fluxo de eventos e cursor
- altura do bloco ou hash de bloco, quando disponível
- hash de transação e autoridade
- Conta, domínio, ativo, função, desencadeador ou configuração afetada ID
- Carga útil de evento bruto ou um hash canônico dele
- Impressões de consulta usadas para enriquecer o alerta
- Nome da regra, versão, limite, pontuação e decisão do revisor

Não armazenar notas de investigação sensíveis como metadados do registro público, a menos que a política de governança de dados da rede o permita explicitamente. Se você precisar vincular um caso off-chain ao estado on-chain, prefira um identificador de caso, atestado assinado ou compromisso hash que não expõe detalhes privados.

## Lista de verificação da implementação {#implementation-checklist}

- Capacitar o perfil de telemetria necessário para as rotas `/metrics` e do operador.
- Subscreva-se a fluxos de eventos Torii com filtros estreitos para os objetos que monitorizas.
- Persistem os cursores de eventos para que o monitor possa retomar sem lacunas.
- Reconciliar fluxos com consultas em páginas em um cronograma regular.
- Manter limites de risco e permitir listas em configuração controlada por versões.
- Regras de alerta de ensaio contra blocos históricos antes de habilitar ações automatizadas.
- Utilização de contas técnicas específicas para ações de resposta.
- Revisão do papel e das concessões de permissão em calendário recorrente.
- Incluir alertas de monitorização de fraudes no processo de resposta a incidentes.

## Páginas relacionadas {#related-pages}

- [Eventos](/pt/blockchain/events.md)
- [Filtros](/pt/blockchain/filters.md)
- [Questões](/pt/blockchain/queries.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Desempenho e métricas](/pt/guide/advanced/metrics.md)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
- [Segurança operacional](/pt/guide/security/operational-security.md)
