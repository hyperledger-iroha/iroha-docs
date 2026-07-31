---
translation_locale: pt
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 1f316d6a823b23e821d80fe8773df7469358b0e01057f9b76b113cafe4818f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Preparação para a Libertação {#release-readiness}

Antes de promover uma aplicação ou mudança de rede Iroha, comprovar o comportamento no menor ambiente que possa expor o risco relevante, e depois mover-se deliberadamente através da rede de testes compartilhada e das portas de produção.

## Portão de rede local {#localnet-gate}

- Lançar uma rede local descartável com a mesma pista Iroha e o conteúdo de validador prático mais próximo.
- Execute testes de unidade para construtores de transações, análise de consultas, manejo de rejeição e carregamento de configuração.
- Exercitar os menores caminhos de leitura e escrita bem sucedidos através da mesma forma SDK ou CLI que o aplicativo usará mais tarde.
- Capture hashes de transações esperadas, status, eventos e leituras de estado em artefatos de teste.

Ver [Lançamento Iroha 3](/pt/get-started/launch-iroha.md) e [SDK Tutoriais ](/pt/guide/tutorials/).

## Portão Compartilhada de Testnet {#shared-testnet-gate}

- Usar Taira ou outra rede de testes compartilhada para comportamentos, taxas, financiamento da conta, latência e ensaios operacionais.
- Keep live testnet escreve opt-in para que as corridas de teste ordinárias não dependam da disponibilidade da rede ou gastem fundos da testnet.
- Verificar o financiamento do signatário, os metadados dos ativos de taxas, as permissões da autoridade e o estado esperado antes de enviar cada transação de teste ao vivo.
- Aguarde um estado terminal, depois verifique o estado resultante com uma consulta somente para leitura.

Veja [Construir sobre SORA 3: Taira e Minamoto ](/pt/get-started/sora-nexus-dataspaces.md).

## A rede principal ou porta de produção {#mainnet-or-production-gate}

- Usar assinantes de produção separados, financiamento, domínios e caminhos de configuração.
- Confirmar a compatibilidade SDK, CLI, peer e network com a Matriz de Compatibilidade [ ](/pt/reference/compatibility-matrix.md).
- Permissões de revisão, patrocínio de taxas, limites de tarifas, monitoramento, status de backup e critérios de retrocesso antes da janela de lançamento.
- Exigir um plano de transacção ou migração por escrito para escritos de alto impacto.

## Rollback e recuperação {#rollback-and-recovery}

- Definir quais alterações podem ser revertidas através da implantação de código, que exigem uma transacção na cadeia e que não podem ser desfeitas diretamente.
- Para alterações de dados na cadeia, prepare as transações compensatórias ou os scripts de migração antes da primeira produção.
- Para alterações de rede, mantenha o binário anterior, o pacote de configuração, a gênese assinada e o runbook operacional disponíveis durante o lançamento.
- Defina um ponto de decisão para abortar a implantação com base em sinais objetivos, como taxa de rejeição, crescimento da fila, latência ou saúde dos pares.

## Lista de verificação final {#final-checklist}

- A configuração é específica do ambiente e não contém segredos apenas para testes.
- O comportamento de retestamento de transações é idempotente ou explicitamente limitado.
- O aplicativo pode distinguir a rejeição, expiração, prazo e falhas de disponibilidade do endpoint.
- A monitorização abrange o tráfego, a latência, a profundidade da fila, as rejeições, as alterações na visão e os eventos comerciais relevantes.
- Os operadores dispõem de manuais de execução para os modos de falha esperados.
- A revisão da segurança incluiu a custódia das chaves, as permissões, a exposição à rede e a autoridade de automação.
