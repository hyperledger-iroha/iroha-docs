---
translation_locale: pt
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
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

- Use signatários de produção, financiamento, domínios e caminhos de configuração separados. Não promova chaves da testnet nem pressupostos de faucet para produção.
- Confirmar o requisito cruzado.SDK Scenários com o [Matriz de compatibilidade](/pt/reference/compatibility-matrix.md). Separadamente pin e testar o exato CLI, binário de pares, configuração e liberação da rede utilizada pela implantação.
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
