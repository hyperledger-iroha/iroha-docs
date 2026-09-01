---
translation_locale: pt
translation_source: /guide/security/fraud-monitoring.md
translation_source_hash: 4739a0bfe80f14545a51c804abbe6a2dfa5497d546192f76096f938a0af70184
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Monitoramento de Fraudes {#fraud-monitoring}

O monitoramento de fraudes para uma implementação Iroha é um controle operacional construído em torno de eventos do livro-razão blockchain, consultas, permissões e contexto do aplicativo. Iroha registra o que foi enviado, aceito, rejeitado e compromissado. Seu sistema de monitoramento decide quais padrões são suspeitos para o seu processo de negócios e encaminha esses casos para revisores ou controles de resposta automatizados.

Trate o monitoramento de fraudes como um serviço separado, em vez de lógica incorporada em um validador. O serviço deve se inscrever na atividade do livro razão da blockchain, enriquecê-la com contexto de risco fora da cadeia, persistir evidências e enviar transações de resposta apenas por meio de contas que tenham permissões explícitas.

## Modelo de Monitoramento {#monitoring-model}

Um pipeline de processamento de monitoramento útil possui quatro estágios:

1. Coletar registros de blockchain e sinais de operadores de fluxos de eventos, consultas e métricas de Torii.
2. Enriqueça eventos com contexto fora da cadeia, como status do cliente, listas de contrapartes, identificadores de sessão de aplicativo, limites esperados e IDs de caso.
3. Detecte comportamentos suspeitos com regras determinísticas, filas de revisores ou pontuação de risco.
4. Responda alertando os operadores, pausando fluxos de trabalho do lado do aplicativo, revogando permissões desnecessárias ou submetendo transações compensatórias quando seu processo de governança permitir.

Mantenha as decisões de política fora do consenso, a menos que todos os validadores precisem reproduzir a mesma decisão. A validação em tempo de execução do software deve impor permissões e a validade das transações. O monitoramento de fraudes deve explicar o risco, preservar evidências e ajudar os operadores a agir rapidamente.

## Sinais para Coletar {#signals-to-collect}

Comece com assinaturas restritas e adicione fluxos mais amplos apenas para investigação:

|Sinal|Fonte| Usar |
| --- | --- | --- |
|Status da transação|eventos do pipeline de processamento|Detectar rejeições repetidas, tentativas de autorização falhadas e padrões de envio incomuns|
|Ciclo de vida da conta e metadados|Eventos de dados e consultas de conta|Detectar novas contas, alterações de alias, atualizações de identidade e edições inesperadas de metadados|
|Saldos e transferências de ativos|Eventos de dados de ativos e consultas de ativos|Detectar movimentações de alto valor, rápida dispersão, drenagens de saldo e contrapartes incomuns|
|Funções e permissões|Consultas de funções e permissões, eventos de dados de funções|Detectar escalonamento de privilégios, concessões de emergência e acessos de alto risco obsoletos|
|Alterações de gatilho e contrato|Eventos de gatilho, contrato e executor|Detectar novas automações, caminhos de execução alterados e atividades suspeitas de atualização|
|Configuração e alterações de pares de rede|Configuração e eventos de pares de rede|Detectar mudanças na governança que afetam validação, rede ou visibilidade do operador|
|Saúde do operador|rotas de status `/metrics` e Sumeragi|Separe o comportamento suspeito do usuário de sobrecarga do nó, pressão na fila ou falhas na rede|

Use [filtros de eventos](/pt/blockchain/filters.md) para evitar processar todo o fluxo de eventos quando uma regra precisa apenas de contas, ativos, funções ou alterações de configuração. Para reconciliação periódica, combine o fluxo com [consultas](/pt/blockchain/queries.md) paginado para que o monitor possa se recuperar após um período de inatividade.

## Regras de Detecção {#detection-rules}

As famílias de regras comuns incluem:

|Família de regras|Condição de exemplo|Resposta típica|
| --- | --- | --- |
|Velocidade|Uma conta transfere mais do que a quantia ou a quantidade esperada em um curto período|Alertar os avaliadores e pausar os saques do lado do aplicativo para essa conta|
|Distribuição|Os fundos se movem de uma conta para muitas contas recém-vistas|Exigir aprovação manual antes de permitir transferências adicionais|
|Drenagem de saldo|Uma grande parte do saldo de uma conta é retirada logo após uma mudança de chave, pseudônimo ou metadados|Escalar como possível tomada de conta de conta|
|Escalada de privilégios|Uma permissão ou função de alto risco é concedida fora de uma janela de mudança|Alertar os operadores e revisar a transação de concessão|
|Explosão de rejeição|Um signatário criptográfico ou cliente produz transações repetidamente rejeitadas|Verifique abuso de credenciais, erros de integração ou sondagem|
|Mudança na automação|Um gatilho, contrato ou objeto relacionado ao executor muda inesperadamente|Pausar fluxos de trabalho dependentes até que a mudança seja revisada|
|Mudança sensível à governança|ocorrem alterações em par de rede, configuração ou estado de execução do software sem um ticket aprovado|Compare com o registro de governança e o processo de incidentes|

As regras devem ser explícitas sobre as evidências que exigem, a janela de tempo que avaliam, a ação que realizam e a pessoa ou sistema que pode finalizar o caso. Limiares que dependem do risco do cliente, tipo de ativo ou jurisdição pertencem à configuração do seu serviço de monitoramento, e não a scripts ad hoc.

## Controles de Resposta {#response-controls}

Projete ações de resposta antes de ativar alertas. Um caso de fraude de alta gravidade deve ter um caminho documentado desde a detecção até a contenção:

- notificar a segurança, operações e os responsáveis pelo negócio pela definição do domínio ou ativo afetado
- preserve o cursor de eventos, o hash do bloco, o hash da transação, a autoridade, a carga útil e o instantâneo de consulta usados pela regra de detecção
- pausar ações do lado do aplicativo que estão fora do registro da blockchain, como checkout, saque, assinatura, ponte ou fluxos de trabalho de liquidação
- revogar funções ou permissões que não sejam mais justificadas pelo plano de resposta a incidentes
- envie transações de registro em blockchain de acompanhamento apenas quando a política de governança ativa e o modelo de permissões permitirem
- gire as chaves quando as evidências sugerirem comprometimento do signatário criptográfico

Evite dar ao serviço de monitoramento um amplo acesso de escrita. Use uma conta técnica dedicada com o menor conjunto de permissões necessárias para as ações de resposta é permitido realizar. A aprovação humana deve permanecer parte de qualquer fluxo de trabalho que possa mover ativos, alterar permissões ou modificar a configuração voltada para o validador.

## Evidência e Retenção {#evidence-and-retention}

Armazene evidências de monitoramento em um sistema somente de acréscimo que seja separado do diretório de dados do validador. Cada alerta deve incluir:

- nome do fluxo de eventos e cursor
- altura do bloco ou hash criptográfico do bloco quando disponível
- hash criptográfico da transação e principal de autorização
- conta, domínio, ativo, função, gatilho ou ID de configuração afetados
- payload de evento bruto ou um hash criptográfico canônico dele
- consultar visualizações de dados em um ponto no tempo usadas para enriquecer o alerta
- nome da regra, versão, limite, pontuação e decisão do revisor

Não armazene notas de investigação sensíveis como metadados do livro-razão público da blockchain, a menos que a política de governança de dados da rede permita explicitamente. Se você precisar vincular um caso off-chain ao estado on-chain, preferencialmente um identificador de caso, atestado assinado ou compromisso de hash criptográfico que não exponha detalhes privados.

## Lista de Verificação de Implementação {#implementation-checklist}

- Ative o perfil de telemetria necessário para `/metrics` e rotas do operador.
- Assine os fluxos de eventos Torii com filtros estreitos para os objetos que você monitora.
- Persistir cursores de eventos para que o monitor possa retomar sem lacunas.
- Conciliar fluxos com consultas paginadas em uma programação regular.
- Mantenha os limites de risco e as listas de permissão em configuração controlada por versão.
- Teste as regras de alerta contra blocos históricos antes de habilitar ações automatizadas.
- Use contas técnicas dedicadas para ações de resposta.
- Reveja funções e concessões de permissão em uma programação recorrente.
- Inclua alertas de monitoramento de fraude no processo de resposta a incidentes.

## Páginas Relacionadas {#related-pages}

- [Eventos](/pt/blockchain/events.md)
- [Filtros](/pt/blockchain/filters.md)
- [Consultas](/pt/blockchain/queries.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Desempenho e Métricas](/pt/guide/advanced/metrics.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [Segurança Operacional](/pt/guide/security/operational-security.md)
