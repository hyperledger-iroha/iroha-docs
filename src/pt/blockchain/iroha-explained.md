---
translation_locale: pt
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Explicado {#iroha-explained}

Iroha 3 é a plataforma Hyperledger Iroha de primeira versão. O mesmo núcleo suporta redes auto-hospedadas e o modelo de execução SORA Nexus para espaços de dados e roteamento multi-pista.

## Blocos de Construção Principais {#core-building-blocks}

- `iroha3d` executa pares de rede
- Torii é o gateway do cliente e do operador
- Sumeragi lida com consenso
- Norito é o [formato binário canônico](/pt/reference/norito.md)
- IVM executa contratos inteligentes portáteis e bytecode
- Kotodama compila contratos `.ko` de alto nível para bytecode `.to` IVM
- Kagami prepara chaves, gênesis da blockchain, perfis e redes locais
- SORA Nexus planos de serviço adicionam Soracloud, Inrou, SoraNet, SoraFS e SoraDNS para hospedagem de aplicativos, transporte de privacidade, armazenamento e nomenclatura

## Modelo de Execução {#execution-model}

Cada mudança no estado do mundo ainda acontece por meio de transações. As transações carregam instruções ou bytecode IVM, e Torii é a principal forma como os clientes as enviam ou observam seus efeitos.

- Configurações conscientes de Nexus podem definir múltiplas faixas de execução
- os espaços de dados isolam cargas de trabalho sem deixar de fazer parte do mesmo modelo de livro-razão
- A política de roteamento decide qual pista de execução e espaço de dados lidam com uma classe de trabalho

## Arquitetura Multi-Espaço de Dados {#multi-dataspace-architecture}

Um espaço de dados é uma fronteira de roteamento e namespace, não uma blockchain separada. O tempo de execução do software ainda possui um `World`, um modelo de transação e um consenso pipeline de processamento. Nexus adiciona catálogos que informam ao nó como particionar o trabalho entre as linhas de execução e como nomear os espaços de dados que essas linhas de execução atendem.

Em tempo de execução do software, um espaço de dados é representado por um número `DataSpaceId` e metadados de catálogo. `DataSpaceId::UNIVERSAL` é reservado como `0`; o catálogo padrão contém o espaço de dados `universal`. Cada espaço de dados configurado possui:

- um identificador numérico único
- um alias único como `universal`, `governance` ou `zk`
- uma descrição opcional para superfícies do operador
- um valor `fault_tolerance` diferente de zero usado para dimensionar comitês de retransmissão

as pistas de execução são as rotas de execução e armazenamento vinculadas a esses espaços de dados. Uma entrada de pista de execução carrega um `LaneId`, o `DataSpaceId` que ela serve, um alias, visibilidade (`public` ou `restricted`), perfil de armazenamento (`full_replica`, `commitment_only` ou `split_replica`), esquema de prova e governança opcional, assentamento e metadados do agendador. O tempo de execução do software deriva a geometria de armazenamento por faixa a partir deste catálogo, incluindo nomes de segmentos Kura e prefixos de chave determinísticos.

O caminho de roteamento é:

1. A configuração constrói um `DataSpaceCatalog`, `LaneCatalog` e `LaneRoutingPolicy` validados. Várias pistas de execução, múltiplos espaços de dados ou roteamento não padrão requerem `nexus.enabled = true`.
2. A fila de transações solicita ao roteador da pista de execução ativa um `RoutingDecision` contendo um ID da pista de execução e um ID do espaço de dados.
3. Regras de roteamento explícitas podem corresponder por autoridade/conta ou por rótulo de instrução. Sem uma regra correspondente, o roteador pode derivar o espaço de dados a partir de IDs de domínio, projeções de definição de ativo, permissões com escopo de espaço de dados, partes de transferência de liquidação ou do escopo de conta vinculado ao principal de autorização.
4. A rota resolvida é verificada em ambos os catálogos. Faixas de execução desconhecidas, espaços de dados desconhecidos e incompatibilidades entre faixa/espaço de dados são erros de roteamento determinísticos. Se uma transação escreve em dois alvos de espaço de dados diferentes, ela é rejeitada como uma rota conflitante; a liquidação entre espaços de dados DVP/PVP é direcionada pela via de execução do coordenador universal.
5. Sumeragi e a telemetria mantêm a atribuição visível como faixa de execução e atividade do espaço de dados, instantâneos de backlog e comprometimento.

É por isso que os identificadores de objetos são importantes. Os domínios incluem o alias do espaço de dados em seu ID, por exemplo `payments.universal`, para que gravações com escopo de domínio possam ser roteadas. As contas permanecem canônicas e sem domínio, para que a mesma conta possa ser vinculada a diferentes escopos de aplicação sem alterar seu `AccountId`. As definições de ativos podem carregar uma projeção de domínio/espaco de dados, o que permite que as operações de ativos herdem a rota correta do espaço de dados.

Sem os substitutos Nexus, o nó utiliza uma única pista de execução e o espaço de dados `universal`. O perfil SORA incluído substitui isso por um catálogo de três pistas: `core` para a pista de execução pública universal, `governance` para o tráfego de governança e `zk` para o tráfego de anexos e implantação de contratos com zero conhecimento.

Esses três padrões existem para separar classes de carga de trabalho:

|Espaço de dados|pista de execução|Por que existe|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       |Espaço de dados padrão reservado (`DataSpaceId::UNIVERSAL == 0`) para tráfego comum de livro-razão de blockchain público e roteamento de reserva.|
| `governance` | `governance` |Faixa de execução restrita para tráfego de governança e parlamento, para que a atividade do plano de controle não seja misturada com gravações de aplicativos gerais.|
| `zk`         | `zk`         |Faixa de execução restrita para provas de conhecimento zero, anexos e roteamento de implantação de contratos, mantendo os fluxos de trabalho pesados em provas separados das gravações normais.|

Apenas `universal` é a linha de base reservada. `governance` e `zk` são escolhas de perfil SORA codificadas no catálogo incluído e na política de roteamento; os operadores podem definir um catálogo diferente quando precisarem de limites de espaço de dados diferentes.

Sumeragi sempre usa disponibilidade de dados e transmissão confiável. Esses caminhos fazem parte do protocolo de consenso Iroha 3 e não podem ser desativados por um perfil de implantação.

O comportamento em tempo de execução do software é originado de arquivos de configuração e parâmetros on-chain. Variáveis de ambiente não são portões de recurso de produção.

## Leia Em Seguido {#read-next}

- [SORA Nexus serviços](/pt/blockchain/sora-nexus-services.md)
- [Iniciar Iroha 3](/pt/get-started/launch-iroha.md)
- [Mundo, WSV, e armazenamento Kura](/pt/blockchain/world.md)
- [referência de gênese da blockchain](/pt/reference/genesis.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
