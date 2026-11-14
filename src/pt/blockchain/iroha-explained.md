---
translation_locale: pt
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 426adbea88da36cd92da17d8665c956a57b9d4cebfa0d2f35bc75469cccf84ee
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

- espaços de dados oferecem ambientes para dados institucionais, autoridade, políticas e aplicações
- faixas de execução oferecem capacidade de roteamento e certificação nesses ambientes
- uma raiz de espaço de dados assinada de forma independente possui seu próprio State e finalização local

## Espaços de dados e raízes de execução {#multi-dataspace-architecture}

Uma entrada no catálogo de espaços de dados define um ambiente e sua identidade. Uma entrada no catálogo, por si só, não estabelece uma raiz de execução independente. Faixas de execução públicas certificam lotes de transações para execução pela cadeia global; uma raiz de espaço de dados assinada de forma independente tem seu próprio State, comitê e finalização local.

`DataSpaceCatalog` define espaços de dados, enquanto `LaneCatalog` define faixas de execução. Cada faixa de execução faz referência a exatamente um espaço de dados por meio de `dataspace_id`; um espaço de dados pode conter várias faixas de execução. `DataSpaceId` e `LaneId` são identidades distintas, e um alias de faixa de execução não cria outro espaço de dados.

Em tempo de execução, um espaço de dados é representado por um `DataSpaceId` numérico e metadados do catálogo. `DataSpaceId::UNIVERSAL` é reservado como `0`; o catálogo padrão contém o espaço de dados `universal`. Cada espaço de dados configurado tem:

- um identificador numérico único
- um apelido único como `universal` ou um nome institucional registrado explicitamente
- uma descrição opcional para superfícies do operador
- um valor `fault_tolerance` diferente de zero usado para dimensionar comitês de retransmissão

Faixas de execução são os recursos de roteamento e certificação vinculados a esses espaços de dados. Uma entrada de faixa de execução contém um `LaneId`, o `DataSpaceId` que atende, um alias, visibilidade (`public` ou `restricted`), perfil de armazenamento (`full_replica`, `commitment_only` ou `split_replica`), esquema de prova e metadados opcionais de governança, liquidação e agendamento. O ambiente de execução deriva desse catálogo a estrutura de armazenamento de cada faixa de execução, incluindo nomes de segmentos Kura e prefixos determinísticos de chaves.

O caminho de roteamento é:

1. A configuração constrói `DataSpaceCatalog`, `LaneCatalog` e `LaneRoutingPolicy` validados. O roteamento do SORA Nexus é obrigatório. Vários espaços de dados, várias faixas de execução ou roteamento diferente do padrão usam o perfil SORA Nexus (`--sora`) e NPoS.
2. A fila de transações resolve um `RoutingPlan` a partir da transação e do estado confirmado. Cada rota de coordenador ou participante contém um ID de faixa de execução e um ID de espaço de dados; planos Native AMX mantêm o conjunto completo de participantes.
3. Na execução global, lotes completos do plano de controle e coordenadores entre espaços de dados usam a faixa de execução `0`. Destinos concretos não universais de instrução ou endereço de contrato selecionam uma faixa de execução fixa admitida, com o espaço de dados e o comitê correspondentes, antes das regras de conta ou rótulo de instrução. Os demais trabalhos seguem as regras explícitas confirmadas e a distribuição padrão em fragmentos; destinos universais concretos permanecem em faixas de execução universais.
4. Cada rota é verificada em relação aos catálogos e ao estado ativo das faixas de execução. IDs desconhecidos e incompatibilidades entre faixa de execução e espaço de dados são rejeitados; um destino privado indisponível não pode recorrer à execução universal. Vários destinos de espaço de dados podem produzir um plano Native AMX. Os metadados de transação `amx_policy` definidos como `reject_cross_dataspace` rejeitam planos entre espaços de dados. Um plano de roteamento, por si só, não autoriza nem conclui a liquidação entre raízes independentes.
5. Sumeragi e a telemetria mantêm a atribuição visível por meio da atividade, do trabalho pendente e dos instantâneos de compromissos criptográficos das faixas e dos espaços de dados.

É por isso que os identificadores de objetos importam. Domínios incluem o alias do espaço de dados em seu ID, por exemplo `payments.universal`, para permitir o roteamento de operações de escrita com escopo de domínio. Contas permanecem canônicas e sem domínio, permitindo que a mesma conta seja vinculada a diferentes escopos de aplicação sem alterar seu `AccountId`. Definições de ativos podem conter uma projeção de domínio/espaço de dados, permitindo que as operações de ativos herdem a rota correta do espaço de dados.

Sem ajustes específicos do SORA Nexus, o nó usa uma única faixa de execução e o espaço de dados `universal`. O perfil SORA Nexus incluído substitui essa configuração por um catálogo de três faixas de execução: `core` para a faixa de execução pública universal, `governance` para o tráfego de governança e `zk` para o tráfego de anexos de conhecimento zero e de implantação de contratos.

As três faixas de execução incluídas são públicas e fazem referência ao mesmo espaço de dados `universal`. Elas separam classes de carga de trabalho:

| Espaço de dados | Faixa de execução | Por que existe |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Tráfego normal do registro público e roteamento padrão. |
| `universal` | `governance` | Governança pública e tráfego do SORA Parliament. |
| `universal` | `zk` | Tráfego público de anexos de conhecimento zero e de implantação de contratos. |

`DataSpaceId::UNIVERSAL == 0` é a base reservada. Os nomes `governance` e `zk` acima identificam faixas de execução, não espaços de dados separados. Limites institucionais diferentes exigem entradas explícitas de espaço de dados; a execução independente exige, adicionalmente, uma raiz autenticada de forma independente.

Essas relações são definidas pelos [construtores de perfil](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs), pela [implementação das faixas de execução](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs) e pelo [contrato das raízes independentes](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) no commit fixado.

Sumeragi sempre usa disponibilidade de dados e transmissão confiável. Esses caminhos fazem parte do protocolo de consenso Iroha 3 e não podem ser desativados por um perfil de implantação.

O comportamento em tempo de execução do software é originado de arquivos de configuração e parâmetros on-chain. Variáveis de ambiente não são portões de recurso de produção.

## Leia Em Seguido {#read-next}

- [SORA Nexus serviços](/pt/blockchain/sora-nexus-services.md)
- [Iniciar Iroha 3](/pt/get-started/launch-iroha.md)
- [Mundo, WSV, e armazenamento Kura](/pt/blockchain/world.md)
- [referência de gênese da blockchain](/pt/reference/genesis.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
