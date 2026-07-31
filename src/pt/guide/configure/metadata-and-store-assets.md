---
translation_locale: pt
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadados e opções de armazenamento do Ledger {#metadata-and-ledger-storage-choices}

O modelo de dados Iroha 3 não possui um tipo de ativo `Store` separado para os dados arbitrários de valor-chave.

## Metadados {#metadata}

Usar [metadados](/pt/blockchain/metadata.md) para pequenos campos JSON que pertencem a um objeto de contabilidade:

- Exibir nomes e rótulos
- integração IDs
- Pequenas bandeiras políticas
- hashes, caminhos URIs, CIDs ou SoraFS que apontam para cargas úteis maiores

Os metadados fazem parte do estado mundial e são devolvidos com o objeto que os possui. Mantenha as chaves estáveis, os valores compactos e as permissões explícitas. Não armazene documentos grandes, registros ou um estado de aplicação de alta frequência diretamente em metadados.

## Ativos numéricos e NFTs {#numeric-assets-and-nfts}

Utilize os ativos [](/pt/blockchain/assets.md) e [NFTs](/pt/blockchain/nfts.md) quando o estado é valorizado:

- Ativos numéricos para saldos fungíveis
- NFTs para registos de propriedade exclusiva
- [RWAs](/pt/blockchain/rwas.md) e outros objectos específicos de domínio quando o modelo de dados ativo os expõe.

Os ativos e NFTs têm os seus próprios IDs, eventos do ciclo de vida, comportamento de transferência e verificações de permissões. Eles são melhores que metadados quando a propriedade, a escassez ou o histórico de transferência são importantes.

## Dados fora da cadeia {#off-chain-data}

Utilize armazenamento fora da cadeia para cargas úteis grandes ou mutáveis.

- um hash de conteúdo
- a URI
- um caminho ou referência manifesto SoraFS
- Um compromisso compatível utilizado por uma prova de pedido

Isto mantém o WSV pequeno, permitindo ao mesmo tempo que as aplicações verifiquem se a carga útil fora da cadeia corresponde à referência na cadeia.

## A escolha de um local {#choosing-a-location}

Usar esta regra geral:

- Se for um atributo compacto de um objeto do livro, utilize metadados.
- Se for carregável de valor ou transferível, modela-o como um ativo NFT, ou objeto específico do domínio.
- Se for grande, de alta densidade ou de aplicações particulares, armazená-lo fora do WSV e coloque uma referência verificável na cadeia.

Para as permissões de metadados, ver [Permissão Tokens ](/pt/reference/permissions.md).
