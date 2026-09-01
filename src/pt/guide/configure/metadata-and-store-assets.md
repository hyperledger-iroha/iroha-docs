---
translation_locale: pt
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metadados e Escolhas de Armazenamento de Livro-Razão em Blockchain {#metadata-and-ledger-storage-choices}

O modelo de dados Iroha 3 não possui um tipo de ativo `Store` separado para dados arbitrários de chave-valor. Use as seguintes opções de armazenamento.

## Metadados {#metadata}

Use [metadados](/pt/blockchain/metadata.md) para pequenos campos JSON que pertencem a um objeto de livro razão de blockchain:

- nomes de exibição e rótulos
- IDs de integração
- pequenas bandeiras de política
- hashes criptográficos, URIs, CIDs ou SoraFS caminhos que apontam para cargas úteis maiores

Metadados fazem parte do estado mundial e são retornados com o objeto que os possui. Mantenha as chaves estáveis, os valores compactos e as permissões explícitas. Não armazene documentos grandes, logs ou estado de aplicação com alta rotatividade diretamente em metadados.

## Ativos Numéricos e NFTs {#numeric-assets-and-nfts}

Use [ativos](/pt/blockchain/assets.md) e [NFTs](/pt/blockchain/nfts.md) quando o estado tiver valor:

- ativos numéricos para saldos fungíveis
- NFTs para registros de propriedade única
- [RWAs](/pt/blockchain/rwas.md) e outros objetos específicos de domínio quando o modelo de dados ativo os expõe

Ativos e NFTs têm seus próprios IDs, eventos de ciclo de vida, comportamento de transferência e verificações de permissão. Eles são melhores do que metadados quando a propriedade, escassez ou histórico de transferência importa.

## Dados Off-Chain {#off-chain-data}

Use armazenamento off-chain para cargas grandes ou mutáveis. Armazene apenas uma referência estável on-chain, como:

- um hash criptográfico de conteúdo
- uma URI
- um caminho SoraFS ou referência de manifesto técnico
- um compromisso compacto usado por uma prova de aplicação

Isso mantém o WSV pequeno, enquanto ainda permite que os aplicativos verifiquem se a carga útil fora da cadeia corresponde à referência na cadeia.

## Escolhendo um Local {#choosing-a-location}

Use esta regra prática:

- Se for um atributo compacto de um objeto do livro-razão da blockchain, use metadados.
- Se for portador de valor ou transferível, modele-o como um ativo, NFT, ou objeto específico do domínio.
- Se for grande, de alta rotatividade ou privado de aplicativo, armazene-o fora do WSV e coloque uma referência verificável na blockchain.

Para permissões de metadados, consulte [Tokens de Permissão](/pt/reference/permissions.md).
