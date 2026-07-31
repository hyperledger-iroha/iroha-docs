---
translation_locale: pt
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Implementação da rede {#network-deployment}

Tratar uma rede Iroha como um sistema coordenado. Os validadores devem concordar na gênese, topologia, pares de confiança e configuração relevante para o consenso antes que a rede possa iniciar e continuar a finalizar blocos.

## Separação do ambiente {#environment-separation}

- Manter conjuntos de configuração separados para o desenvolvimento local, testnet compartilhado, faseamento e produção.
- Gerar chaves novas para todos os ambientes não descartáveis. Não reutilizar o localnet ou Taira material chave na produção.
- Mantenha a configuração de pares, a configuração do cliente, a gênese assinada, os scripts e as notas de implantação juntos como um artefato de lançamento versão.
- Armazenar chaves privadas fora de repositórios e modelos de implantação.

Ver [Chaves para a implantação da rede ](/pt/guide/configure/keys-for-network-deployment.md).

## Gênesis e Topologia {#genesis-and-topology}

- Faça com que todos os validadores usem a mesma transação genésica assinada, conjunto de pares confiáveis, topologia e validador Proofs-of-Possessão quando o perfil exigir.
- Usar pelo menos quatro validadores para uma implantação mínima de tolerância por falhas bizantinas.
- Os observadores não votam, propõem ou recolhem, mas ainda consomem armazenamento, sincronização de blocos e largura de banda da rede.
- Tratar mudanças de gênese, executor e topologia como migrações coordenadas ao invés de edições individuais.

Ver [Gênesis](/pt/reference/genesis.md), [ Gerenciamento entre pares](/pt/guide/configure/peer-management.md) e [Performance and Metrics ](/pt/guide/advanced/metrics.md#node-count-and-quorum).

## Torii e acesso à rede {#torii-and-network-access}

- Colocar Torii atrás de um proxy ou firewall inverso quando estiver exposto fora do host ou da rede privada.
- Terminar TLS e aplicar controles básicos de autenticação, limitação de taxa e tamanho do pedido na borda quando a implantação os exigir.
- Publicar apenas os pontos finais necessários para o ambiente. As rotas de operador e de telemetria deverão ser mais restritas do que as rotas públicas de leitura única.
- Ligue os endereços do ouvinte às interfaces host-locais quando os pares não devem aceitar o tráfego remoto diretamente.

Veja [Torii Pontos finais](/pt/reference/torii-endpoints.md) e [ Redes privadas virtuais ](/pt/guide/security/vpn.md).

## Consenso e capacidade {#consensus-and-capacity}

- Medir a implantação antes de ajustar os temporizadores de consenso. Timeouts mais baixos podem reduzir a latência apenas enquanto as camadas de rede, armazenamento e execução mantêm o ritmo.
- Observe a direcção da fila, não apenas amostras curtas de transferência. Uma fila que cresce durante uma carga constante significa que a rede está sobrecarregada.
- Registrar os parâmetros efetivos Sumeragi, o perfil de telemetria, a contagem dos validadores, a rede RTT, a forma da carga de trabalho e os detalhes do hardware para cada referência.
- Aumentar a capacidade do coletor somente depois de comparar os sinais de latência, tráfego e contrapressão.

Veja [Performance and Metrics ](/pt/guide/advanced/metrics.md).

## Gerenciamento do metal e dos processos {#bare-metal-and-process-management}

- Mantenha separados os `config.toml`, a chave privada, o diretório de armazenamento e as portas de cada igual.
- Use gerenciadores de processos como systemd com políticas explícitas de reinicialização, registro e recursos.
- Preservar os comandos gerados README e iniciar a partir de pacotes de localnet Kagami ao traduzir uma topologia de ensaio para hosts gerenciados.

Veja [Running Iroha em Bare Metal](/pt/guide/advanced/running-iroha-on-bare-metal.md).
