---
translation_locale: pt
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Explicado {#iroha-explained}

Iroha 3 é a plataforma de primeira versão Hyperledger Iroha. O mesmo núcleo suporta redes auto-hospedadas e o modelo de execução SORA Nexus para espaços de dados e roteamento multilaneal.

## Blocos de construção centrais {#core-building-blocks}

- `irohad` corre pares
- Torii é o portão de entrada do cliente e do operador
- Sumeragi lida com o consenso
- O Norito é o formato binário canônico [](/pt/reference/norito.md)
- IVM executa contratos portáteis inteligentes e código de byte
- O Kotodama compõe os contratos de alto nível `.ko` para o código de byte IVM `.to`
- Kagami prepara chaves, gênese, perfis e redes locais
- SORA Nexus aviões de serviço adicionar Soracloud, Inrou, SoraNet, SoraFS, e SoraDNS para hospedagem de aplicativos, transporte de privacidade, armazenamento e nomeação

## Modelo de execução {#execution-model}

Todas as mudanças no estado mundial ainda ocorrem através de transações. As transações carregam instruções ou IVM código de byte, e Torii é a principal maneira como os clientes enviam ou observam seus efeitos.

- As configurações Nexus conscientes podem definir várias pistas.
- Espaços de dados isolam cargas de trabalho enquanto continuam a fazer parte do mesmo modelo de contabilidade
- A política de roteamento decide qual faixa e espaço de dados lidar com uma classe de trabalho

## Arquitetura do espaço de dados multi- {#multi-dataspace-architecture}

Um espaço de dados é um limite de roteamento e namespace, não um blockchain separado. O tempo de execução ainda tem um `World`, um modelo de transação e um pipeline de consenso. Nexus adiciona catálogos que dizem ao nó como particionar o trabalho entre linhas e como nomear os espaços de dados que essas linhas servem.

No tempo de execução, um espaço de dados é representado por um metadados numérico `DataSpaceId` e catálogo. `DataSpaceId::UNIVERSAL` é reservado como `0`; o catálogo padrão contém o espaço de dados `universal`. Cada espaço de dados configurado tem:

- Um número único ID
- um alias único, como `universal`, `governance` ou `zk`;
- Uma descrição opcional para as superfícies do operador
- um valor não zero `fault_tolerance` utilizado para dimensionar os comitês de relevo.

Lanes são as rotas de execução e armazenamento ligadas a esses espaços de dados. Uma entrada em linha contém um `LaneId`, o `DataSpaceId` que serve, um alias, visibilidade (`public` ou `restricted`), perfil de armazenamento (`full_replica`, `commitment_only`, ou `split_replica`), esquema de prova e governança opcional, liquidação, O tempo de execução deriva a geometria de armazenamento por faixa deste catálogo, incluindo os nomes dos segmentos Kura e os prefixos das chaves deterministas.

O caminho de roteamento é:

1. Configuração constrói um validado `DataSpaceCatalog`, `LaneCatalog`, e `LaneRoutingPolicy`. Múltiples pistas, múltiplos espaços de dados ou roteamento não padrão exigem `nexus.enabled = true`.
2. A fila de transações solicita ao roteador da faixa ativa um `RoutingDecision` contendo uma faixa ID e espaço de dados ID.
3. Regras explícitas de roteamento podem corresponder por autoridade/conto ou por rótulo de instrução. Sem uma regra de correspondência, o roteador pode derivar o espaço de dados a partir do domínio IDs, projeções de definição de ativo, permissões dimensionadas pelo espaço de dados, pernas de liquidação ou o escopo da conta vinculada da entidade.
4. A rota resolvida é verificada em relação a ambos os catálogos. Linhas desconhecidas, espaços de dados desconhecidos e desajustes de linha/espaço de dados são erros deterministas de envio. Se uma transação for encaminhada para dois alvos diferentes do espaço de dados, é rejeitada como uma rota conflitante; a liquidação entre espaços de dados DVP/PVP é encaminhada através da faixa do coordenador universal.
5. Sumeragi e telemetria mantêm a atribuição visível como atividade de faixa e espaço de dados, backlog e snapshots do compromisso.

É por isso que os identificadores de objetos importam. Os domínios incluem o alias de espaço de dados em seu ID, por exemplo `payments.universal`, para que as gravações com escala de domínio possam ser encaminhadas. As contas permanecem canônicas e sem domínio, então a mesma conta pode ser ligada a diferentes escopes de aplicação sem alterar sua `AccountId`. As definições de ativos podem conter uma projeção de domínio/espaço de dados, o que permite que as operações de ativos herdem a rota correta do espaço de dados.

Sem Nexus sobrepassados, o nó usa uma única faixa e o espaço de dados `universal`. O perfil SORA agrupado substitui esse por um catálogo de três faixas: `core` para a faixa pública universal, `governance` para o tráfego de governança e `zk` para o tráfico de ligação com conhecimento zero e de implantação por contrato.

Esses três padrões existem para classes de carga de trabalho separadas:

|Espaço de dados |Lane .|Por que existe ?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal` |`core` |Espaço de dados padrão reservado (`DataSpaceId::UNIVERSAL == 0`) para o tráfego de contabilidade pública ordinário e roteamento de volta. |
|`governance` |`governance` |Estrada restrita para governança e tráfego parlamentar, por isso a atividade no plano de controle não é misturada com aplicações gerais. |
|`zk` |`zk` |Faixa restrita para provas de conhecimento zero, anexos e roteamento de implantação de contrato, mantendo fluxos de trabalho pesados em prova separados dos escritos normais. |

Apenas `universal` é a linha de base reservada. `governance` e `zk` são as opções de perfil SORA codificadas no catálogo em conjunto e na política de roteamento; os operadores podem definir um catálogo diferente quando precisam de diferentes limites do espaço de dados.

Sumeragi utiliza sempre a disponibilidade de dados e uma transmissão confiável. Estes caminhos fazem parte do protocolo de consenso Iroha 3 e não podem ser desativados por um perfil de implantação.

O comportamento do tempo de execução é obtido a partir de arquivos de configuração e parâmetros na cadeia.

## Leia Próximo {#read-next}

- [Serviços SORA Nexus](/pt/blockchain/sora-nexus-services.md)
- [Lançamento Iroha 3](/pt/get-started/launch-iroha.md)
- [Mundo, WSV e armazenamento Kura ](/pt/blockchain/world.md)
- [Referência de Gênesis](/pt/reference/genesis.md)
- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
