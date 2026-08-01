---
translation_locale: pt
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operações {#operations}

A prontidão operacional significa que a rede pode ser observada, alterada, feita backup e recuperada sem contar com o acesso improvisado aos hospedeiros de validadores.

## Observabilidade {#observability}

- Capacitar intencionalmente os perfis de telemetria. Utilize `extended` quando for necessário `/metrics` e `full` durante as corridas de ensaio que necessitem de rotas detalhadas do operador Sumeragi.
- O painel aceitou o rendimento, rejeitou o rendimentos, comprometeu a latência, profundidade da fila, saturação da fila, visualiza mudanças, deixou cair as mensagens de consenso e pressão de armazenamento.
- Mantenha snapshots de status, raspagens de métricas, registros e configuração de implantação no mesmo conjunto de incidentes ou artefatos de referência.
- Alerta sobre crescimento sustentado da fila, picos inesperados de rejeição, altura parada do bloco, mudança de visão e mudanças na saúde dos colegas.

Veja [Performance and Metrics ](/pt/guide/advanced/metrics.md).

## Livros de execução {#runbooks}

- Escreva runbooks para reinicialização por pares, degradação Torii, compromisso de chaves, erros de permissão, esgotamento do patrocinador de taxas, filas bloqueadas e sintomas de partição da rede.
- Incluir verificações exatas de somente leitura antes das operações de escrita, especialmente para registro entre pares, concessão de permissões e mudanças de parâmetros.
- Mantenha os contactos de emergência e as regras de escalada fora do repo dos documentos, se incluirem dados operacionais privados.
- Revisão de runbooks após cada incidente, ensaio ou grande atualização.

Veja [Segurança operacional ](/pt/guide/security/operational-security.md).

## Backup e recuperação {#backups-and-recovery}

- Faça backup do armazenamento peer de acordo com o ponto de recuperação exigido pela implantação.
- Mantenha a gênese assinada, liberte metadados, configuração de pares e registos de custódia de chaves recuperáveis mesmo que um host validador não esteja disponível.
- Documentar se um procedimento de recuperação reconstrui a partir da gênese, restaura a partir de uma instantânea ou substitui um colega fracassado por uma nova identidade.
- Nunca teste os procedimentos de restauração pela primeira vez durante um incidente de produção.

## Gerenciamento das mudanças {#change-management}

- Trate as alterações de configuração na cadeia como transações que exigem revisão, leituras pré-voio, autorização e verificação pós-mudança.
- Implementar atualizações binárias entre pares com um plano de compatibilidade e um ponto de decisão para o retrocesso.
- Evite alterar a topologia de pares, o calendário de consenso e a carga de trabalho das aplicações na mesma janela de manutenção, a menos que o plano de migração exija isso.
- Registrar os hashes de transacção e as alturas dos blocos para alterações operacionais.

Veja [Recarga de calor ](/pt/guide/advanced/hot-reload.md) e [ Matriz de compatibilidade ](/pt/reference/compatibility-matrix.md).

## Revisões de Capacidade {#capacity-reviews}

- Re-exercer verificações de carga quando a contagem do validador, o hardware, a colocação da rede, a mistura de carga de trabalho ou os parâmetros de consenso mudam.
- Medir o aquecimento, o estado estável e a carga máxima esperada em vez de confiar numa amostra curta de potência do melhor caso.
- Comparar a capacidade de transferência aceita com a capacidade de transmissão comprometida e a profundidade da fila. Se o TPS enviado exceder o TPS comprometido e as filas crescerem, a rede ultrapassará o seu alcance sustentável.
