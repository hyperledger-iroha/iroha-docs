---
translation_locale: pt
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Modelagem de dados {#data-modeling}

Os dados do Ledger devem ser modelados em torno da propriedade, comportamento de transferência, limites de permissão e padrões de consulta. Escolha a menor representação na cadeia que possa suportar auditoria e execução determinista.

## Domínios e Contas {#domains-and-accounts}

- Use domínios para representar fronteiras administrativas e políticas. Mantenha os nomes de domínio estáveis porque aparecem nos identificadores de contas e ativos.
- Evite sobrecarregar uma única conta com responsabilidades não relacionadas. Use contas separadas para usuários, serviços, gatilhos, operadores e patrocinadores de taxas.
- Usar identificadores de conta e domínio canônicos em configurações e testes. Os nomes Iroha são sensíveis ao caso após a análise canônica.
- Manter as identidades de teste e produção visívelmente distintas em nomes, domínios e caminhos de arquivo de configuração.

Veja [Domains](/pt/blockchain/domains.md), [Contos](/pt/blockchain/accounts.md) e [Nomenclatura ](/pt/reference/naming.md).

## Ativos e NFTs {#assets-and-nfts}

- Utilização de activos numéricos para saldos fungíveis e quantidades transferíveis.
- Usar NFTs ou objetos específicos de domínio para registros de propriedade única.
- Evite codificar o estado de valor apenas em metadados. Os ativos e NFTs fornecem eventos do ciclo de vida, semântica de transferência e verificações de permissões que os metadados não fazem.
- Definir a precisão, a política de abastecimento, a responsabilidade do emitente e a autoridade de queima/menda antes da exposição de um ativo a aplicações.

Veja . [Ativos](/pt/blockchain/assets.md), [NFTs](/pt/blockchain/nfts.md), e [RWAs](/pt/blockchain/rwas.md).

## Metadados {#metadata}

- Utilize metadados para atributos compactos de objetos do livro-razão, tais como rótulos, integração IDs, bandeiras políticas, hashes, URIs ou referências direcionadas ao conteúdo.
- Mantenha as chaves de metadados estáveis e documentadas. Alterar os nomes das chaves após os clientes dependerem delas cria um problema de migração.
- Não armazenar documentos grandes, registros, dados privados de usuários ou estados de aplicações com alta frequência diretamente em metadados.
- Quando os metadados apontam para dados fora da cadeia, armazenar uma referência verificável, como um hash de conteúdo, URI, SoraFS caminho, referência manifesto ou compromisso compacto.

Veja [Metadados e opções de armazenamento do ledger](/pt/guide/configure/metadata-and-store-assets.md) e [Metadados ](/pt/blockchain/metadata.md).

## Permissões por modelo {#permissions-by-model}

- As funções de design envolvem as operações empresariais, não a conveniência da implementação. Uma função com o nome de um trabalho ou serviço é mais fácil de auditar do que uma função com um amplo conhecimento técnico.
- Expandir os tokens de permissão para o menor objeto que satisfaz o fluxo de trabalho.
- Trate as permissões para minar, queimar, gerenciar pares, alterações de executor, gerenciamento do gatilho e mutação de metadados como permissões de alto impacto.
- Adicionar procedimentos de revogação e rotação explícitos para permissões temporárias.

Veja [Permissões](/pt/blockchain/permissions.md) e [Token de Permissão](/pt/reference/permissions.md).

## Forma da consulta {#query-shape}

- Escolha identificadores e chaves de metadados que suportam as consultas que o seu aplicativo precisará com mais frequência.
- Paginar grandes conjuntos de resultados e evitar interfaces de usuário que exigem escaneamento sem restrições em todo o livro para ações normais.
- Mantenha os índices fora da cadeia reconstituíveis a partir de dados e eventos do livro-razão sempre que forem utilizados para o comportamento crítico das aplicações.
