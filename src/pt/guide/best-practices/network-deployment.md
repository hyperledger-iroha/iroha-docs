---
translation_locale: pt
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Implantação de Rede {#network-deployment}

Trate uma rede Iroha como um sistema coordenado. Os validadores devem concordar com o gênesis da blockchain, topologia, pares de rede confiáveis e configuração relevante para o consenso antes que a rede possa iniciar e continuar finalizando blocos.

## Separação de Ambiente {#environment-separation}

- Mantenha pacotes de configuração separados para desenvolvimento local, testnet compartilhada, staging e produção.
- Gere chaves novas para cada ambiente que não seja descartável. Não reutilize material de chave localnet ou Taira na produção.
- Mantenha juntos a configuração dos pares e do cliente, a gênese assinada, os scripts e as notas de implantação como um artefato de versão.
- Armazene chaves privadas fora de repositórios e modelos de implantação.

Veja [Chaves para Implantação de Rede](/pt/guide/configure/keys-for-network-deployment.md).

## gênese da blockchain e Topologia {#genesis-and-topology}

- Faça com que todos os validadores usem a mesma transação gênese da blockchain assinada, o conjunto de nós confiáveis da rede, a topologia e as Provas de Possessão do validador quando o perfil exigir.
- Use pelo menos quatro validadores para uma implantação mínima tolerante a falhas bizantinas.
- Separe os validadores dos observadores no planejamento de capacidade. Observadores não votam, propõem ou coletam, mas ainda assim consomem armazenamento, sincronização de blocos e largura de banda da rede.
- Trate as alterações de gênese, executor e topologia da blockchain como migrações coordenadas, em vez de edições de um único nodo.

Veja [gênese da blockchain](/pt/reference/genesis.md), [Gerenciamento de pares de rede](/pt/guide/configure/peer-management.md) e [Desempenho e Métricas](/pt/guide/advanced/metrics.md#node-count-and-quorum).

## Torii e Acesso à Rede {#torii-and-network-access}

- Coloque Torii atrás de um proxy reverso ou firewall quando estiver exposto fora do host ou da rede privada.
- Interrompa TLS e aplique autenticação básica, limitação de taxa e controles de tamanho de solicitação na borda quando a implantação exigir.
- Publique apenas os endpoints API necessários pelo ambiente. Rotas de operador e telemetria devem ser mais restritas do que rotas públicas somente leitura.
- Vincule endereços de escuta a interfaces locais do host quando os pares de rede não devem aceitar tráfego remoto diretamente.

Veja [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md) e [Redes Privadas Virtuais](/pt/guide/security/vpn.md).

## Consenso e Capacidade {#consensus-and-capacity}

- Meça a implantação antes de ajustar os temporizadores de consenso. Tempos de espera menores podem reduzir a latência apenas enquanto as camadas de rede, armazenamento e execução acompanharem.
- Observe a direção da fila, não apenas pequenas amostras de taxa de transferência. Uma fila que cresce durante uma carga constante significa que a rede está sobrecarregada.
- Registre os parâmetros efetivos Sumeragi, perfil de telemetria, contagem de validadores, rede RTT, forma de carga de trabalho e detalhes de hardware para cada benchmark.
- Altere um limite de fila limitada ou de recuperação de carga de cada vez, e mantenha as evidências de latência, tráfego, memória e contrapressão antes e depois.

Veja [Desempenho e Métricas](/pt/guide/advanced/metrics.md).

## Gerenciamento de Bare-Metal e Processos {#bare-metal-and-process-management}

- Mantenha separados o `config.toml`, a chave privada, o diretório de armazenamento e as portas de cada par de rede.
- Use gerenciadores de processos como systemd com reinício explícito, registro e políticas de recursos.
- Preserve os comandos gerados README e de início dos pacotes localnet Kagami ao traduzir uma topologia de teste para hosts gerenciados.

Veja [Executando Iroha em Hardware Nativo](/pt/guide/advanced/running-iroha-on-bare-metal.md).
