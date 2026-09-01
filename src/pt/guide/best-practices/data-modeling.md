---
translation_locale: pt
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Modelagem de Dados {#data-modeling}

Os dados do livro-razão da blockchain devem ser modelados em torno da propriedade, comportamento de transferência, limites de permissão e padrões de consulta. Escolha a menor representação on-chain que possa suportar auditabilidade e execução determinística.

## Domínios e Contas {#domains-and-accounts}

- Use domínios para representar limites administrativos e de políticas. Mantenha os nomes dos domínios estáveis, pois eles aparecem em identificadores de contas e ativos.
- Evite sobrecarregar uma única conta com responsabilidades não relacionadas. Use contas separadas para usuários, serviços, gatilhos, operadores e patrocinadores de taxas.
- Use identificadores de conta e domínio canônicos na configuração e nos testes. Os nomes Iroha diferenciam maiúsculas de minúsculas após a análise canônica.
- Mantenha as identidades de teste e produção visivelmente distintas nos nomes, domínios e caminhos dos arquivos de configuração.

Veja [Domínios](/pt/blockchain/domains.md), [Contas](/pt/blockchain/accounts.md) e [Nomeação](/pt/reference/naming.md).

## Ativos e NFTs {#assets-and-nfts}

- Use ativos numéricos para saldos fungíveis e quantidades transferíveis.
- Use NFTs ou objetos específicos do domínio para registros de propriedade única.
- Evite codificar estado portador de valor apenas em metadados. Ativos e NFTs fornecem eventos de ciclo de vida, semântica de transferência e verificações de permissão que os metadados não fornecem.
- Defina precisão, política de fornecimento, responsabilidade do emissor e principal de autorização de queima/mint antes de expor um ativo a aplicações.

Veja [Ativos](/pt/blockchain/assets.md), [NFTs](/pt/blockchain/nfts.md) e [RWAs](/pt/blockchain/rwas.md).

## Metadados {#metadata}

- Use metadados para atributos compactos de objetos do livro-razão blockchain, como rótulos, IDs de integração, sinalizadores de política, hashes criptográficos, URIs ou referências endereçadas por conteúdo.
- Mantenha as chaves de metadata estáveis e documentadas. Mudar os nomes das chaves depois que os clientes dependem delas cria um problema de migração.
- Não armazene documentos grandes, registros, dados privados de usuários ou estado de aplicativo de alta rotatividade diretamente nos metadados.
- Quando os metadados apontarem para dados fora da cadeia, armazene uma referência verificável, como um hash criptográfico de conteúdo, caminho URI, SoraFS, referência de manifesto técnico ou compromisso compacto.

Veja [Metadados e Escolhas de Armazenamento de Livro-Razão em Blockchain](/pt/guide/configure/metadata-and-store-assets.md) e [Metadados](/pt/blockchain/metadata.md).

## Permissões por Modelo {#permissions-by-model}

- Projete funções em torno das operações de negócios, não em torno de conveniências de implementação. Um cargo nomeado a partir de um trabalho ou serviço é mais fácil de auditar do que um cargo nomeado a partir de uma ampla capacidade técnica.
- Limite os tokens de permissão ao menor objeto que satisfaça o fluxo de trabalho.
- Trate permissões para emissão, queima, gerenciamento de pares da rede, alterações de executor, gerenciamento de gatilhos e mutação de metadados como permissões de alto impacto.
- Adicione procedimentos explícitos de revogação e rotação para permissões temporárias.

Veja [Permissões](/pt/blockchain/permissions.md) e [Tokens de Permissão](/pt/reference/permissions.md).

## Forma da Consulta {#query-shape}

- Escolha identificadores e chaves de metadados que suportem as consultas que seu aplicativo precisará com mais frequência.
- Paginar conjuntos de resultados amplos e evitar interfaces de usuário que exijam varreduras irrestritas em todo o livro-razão para ações normais.
- Mantenha índices fora da cadeia reconstruíveis a partir dos dados do livro-razão da blockchain e eventos sempre que eles forem usados para comportamento crítico da aplicação.
