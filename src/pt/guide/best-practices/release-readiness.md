---
translation_locale: pt
translation_source: /guide/best-practices/release-readiness.md
translation_source_hash: 984957526424a4e0ec9f29a6da1bb64699245bb135e8157bbe684bc3d87de4cc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Preparação para Lançamento {#release-readiness}

Antes de promover uma aplicação ou mudança de rede Iroha, prove o comportamento no menor ambiente que possa expor o risco relevante, e então avance cuidadosamente através dos portões de testnet compartilhada e produção.

## Porta Localnet {#localnet-gate}

- Lance uma rede local descartável com o mesmo rastreamento Iroha e a contagem de validadores prática mais próxima.
- Execute testes unitários para construtores de transações, análise de consultas, tratamento de rejeições e carregamento de configuração.
- Exercite os menores caminhos bem-sucedidos de leitura e escrita através da mesma forma SDK ou CLI que o aplicativo usará mais tarde.
- Capture hashes criptográficos, status, eventos e leituras de estado de transações esperadas em artefatos de teste.

Veja [Iniciar Iroha 3](/pt/get-started/launch-iroha.md) e [Tutoriais de SDK](/pt/guide/tutorials/).

## Gateway de Testnet Compartilhada {#shared-testnet-gate}

- Use Taira ou outro testnet compartilhado para o comportamento do endpoint API, taxas, financiamento de conta, latência e ensaios operacionais.
- Mantenha as gravações na testnet ao vivo como opcional para que execuções de teste comuns não dependam da disponibilidade da rede nem gastem fundos da testnet.
- Antes de enviar cada transação de teste real, verifique os fundos do signatário, os metadados do ativo de taxa, as permissões da autoridade e o estado esperado.
- Aguarde um status terminal e, em seguida, verifique o estado resultante com uma consulta somente leitura.

Veja [Construir em SORA 3: Taira e Minamoto](/pt/get-started/sora-nexus-dataspaces.md).

## Gate da Mainnet ou Produção {#mainnet-or-production-gate}

- Use signatários, fundos, domínios e caminhos de configuração separados em produção. Não reutilize chaves da rede de testes nem pressupostos sobre o dispensador.
- Confirme os cenários necessários entre implementações de SDK com a [Matriz de Compatibilidade](/pt/reference/compatibility-matrix.md). Fixe e teste separadamente a CLI exata, o binário do par, a configuração e a versão da rede usadas na implantação.
- Revise permissões, patrocínio de taxas, limites de taxa, monitoramento, status de backup e critérios de reversão antes da janela de lançamento.
- Exigir um plano de transação ou migração por escrito para gravações de alto impacto.

## Reversão e Recuperação {#rollback-and-recovery}

- Defina quais alterações podem ser revertidas pelo deploy de código, quais exigem uma transação on-chain e quais não podem ser desfeitas diretamente.
- Para alterações de dados on-chain, prepare transações compensatórias ou scripts de migração antes da primeira gravação em produção.
- Para alterações na rede, mantenha o binário anterior, o pacote de configuração, o blockchain genesis assinado e o manual operacional disponíveis durante a implementação.
- Defina um ponto de decisão para abortar a implantação com base em sinais objetivos, como taxa de rejeição, crescimento da fila, latência ou integridade dos pares na rede.

## Lista de Verificação Final {#final-checklist}

- A configuração é específica do ambiente e não contém segredos apenas para testes.
- O comportamento de tentativa de transação é idempotente ou explicitamente limitado.
- O aplicativo pode distinguir falhas de rejeição, expiração, tempo limite e disponibilidade do endpoint API.
- O monitoramento abrange taxa de transferência, latência, profundidade da fila, rejeições, alterações de visualização e eventos comerciais relevantes.
- Os operadores têm livros de procedimentos para modos de falha esperados.
- A revisão de segurança abrangeu custódia de chaves, permissões, exposição de rede e principal de autorização de automação.
