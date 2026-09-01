---
translation_locale: pt
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operações {#operations}

Prontidão operacional significa que a rede pode ser observada, alterada, copiada e recuperada sem depender de acesso improvisado aos hosts validadores.

## Observabilidade {#observability}

- Ative perfis de telemetria intencionalmente. Use `extended` quando `/metrics` for necessário e `full` durante execuções de teste que precisam de rotas operacionais detalhadas Sumeragi.
- Painel de controle aceitou taxa de transferência, taxa de transferência rejeitada, latência de commit, profundidade da fila, saturação da fila, alterações de visualização, mensagens de consenso descartadas e pressão de armazenamento.
- Mantenha visualizações de dados de ponto no tempo de status, coleta de métricas, logs e configuração de implantação no mesmo conjunto de artefatos de incidente ou benchmark.
- Alerta sobre crescimento contínuo da fila, picos inesperados de rejeição, altura de bloco parada, mudança de visualização frequente e alterações na saúde dos pares da rede.

Veja [Desempenho e Métricas](/pt/guide/advanced/metrics.md).

## Guia de execução {#runbooks}

- Escreva procedimentos operacionais para reiniciar pares de rede e tratar degradação da Torii, comprometimento de chaves, erros de permissão, esgotamento do patrocinador de taxas, filas travadas e sintomas de partição da rede.
- Inclua verificações exatas de somente leitura antes das operações de escrita, especialmente para registro de pares de rede, concessão de permissões e alterações de parâmetros.
- Mantenha os contatos de emergência e as regras de escalonamento fora do repositório de documentos se incluírem dados operacionais privados.
- Revise os runbooks após cada incidente, ensaio ou grande atualização.

Veja [Segurança Operacional](/pt/guide/security/operational-security.md).

## Backups e Recuperação {#backups-and-recovery}

- Faça backup do armazenamento de pares da rede de acordo com o ponto de recuperação exigido pela implantação. Valide as restaurações em hosts não produtivos.
- Mantenha recuperáveis a gênese assinada, os metadados da versão, a configuração dos pares e os registros de custódia de chaves, mesmo que um host validador fique indisponível.
- Documente se o procedimento de recuperação reconstrói o estado desde a gênese, restaura um instantâneo ou substitui um par com falha por uma nova identidade.
- Nunca teste procedimentos de restauração pela primeira vez durante um incidente de produção.

## Gestão de Mudanças {#change-management}

- Trate as alterações de configuração on-chain como transações que exigem revisão, leituras preliminares, autorização e verificação após a alteração.
- Implante atualizações binárias de pares de rede com um plano de compatibilidade e um ponto de decisão de reversão.
- Evite alterar a topologia dos pares de rede, o tempo de consenso e a carga de trabalho do aplicativo na mesma janela de manutenção, a menos que o plano de migração exija.
- Registre os hashes criptográficos da transação e as alturas dos blocos para mudanças operacionais.

Veja [Recarga Rápida](/pt/guide/advanced/hot-reload.md) e [Matriz de Compatibilidade](/pt/reference/compatibility-matrix.md).

## Revisões de Capacidade {#capacity-reviews}

- Execute novamente as verificações de carga quando a contagem de validadores, hardware, posicionamento na rede, mix de carga de trabalho ou parâmetros de consenso mudarem.
- Meça o aquecimento, o estado estacionário e a carga máxima esperada em vez de confiar em uma amostra curta de melhor desempenho.
- Compare a taxa de transferência aceita com a taxa de transferência comprometida e a profundidade da fila. Se o valor enviado TPS exceder o comprometido TPS e as filas crescerem, a rede ultrapassou seu limite operacional sustentável.
