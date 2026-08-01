---
translation_locale: pt
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Um Iroha NFT é um objeto de livro-razão único com um proprietário. Use NFTs quando um registro precisa de sua própria identidade, metadados, eventos do ciclo de vida e semântica de transferência de propriedade, mas não precisa de um equilíbrio numérico.

Ao contrário de um ativo numérico [](/pt/blockchain/assets.md), um NFT não tem precisão, mintabilidade ou quantidades por conta. O NFT existe como um objeto registrado e a propriedade é rastreada diretamente nesse objeto.

## Estrutura {#structure}

Um `Nft` registado contém:

- `id`: um `NftId`
- `content`: metadados que descrevem o NFT
- `owned_by`: a conta que detém o NFT;

O campo `content` é um mapa `Metadata`. Mantenha-o compacto: armazenar campos descritivos, referências estáveis, hashes, caminhos URIs ou SoraFS lá. Armazenar documentos grandes, mídia ou estado de aplicação de alta frequência fora da cadeia e manter apenas uma referência verificável no NFT.

## Tente em Taira {#try-it-on-taira}

Verifique se a rede de teste pública Taira possui atualmente registos NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Verifique o documento OpenAPI ao vivo para as rotas NFT expostas pelo nó:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Uma matriz vazia `items` é uma resposta válida em uma rede de teste pública. Isso significa que não há nenhuma NFTs na página atual, não que as instruções NFT não estejam disponíveis.

## NFT IDs {#nft-ids}

O `NftId` utiliza o seguinte formulário:

```text
name$domain
name$domain.dataspace
```

Por exemplo, `badge$docs.universal` identifica o `badge` NFT no domínio `docs.universal`. Se o espaço de dados for omitido, o analisador atual usa o espaço de data `universal`, por isso `badge$docs` resolve-se para `badge$docs.universal`.

Use nomes estáveis para NFT IDs. A identidade de objeto utilizada por instruções, consultas, permissões, filtros de eventos e referências de aplicativos é a ID.

## Ciclo de vida {#lifecycle}

Utilização de operações do ciclo de vida NFT Iroha Instruções especiais:

- [O `Register`](/pt/blockchain/instructions.md#un-register) cria o NFT com inicial `content`.
- [O `Unregister`](/pt/blockchain/instructions.md#un-register) remove o NFT.
- [`Transfer`](/pt/blockchain/instructions.md#transfer) alterações `owned_by`.
- [Metadados `SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue) atualização NFT.

## Tente localmente {#try-it-locally}

Estes exemplos assumem que você lançou uma rede local e tem a configuração do cliente gerada a partir do guia [CLI ](/pt/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

A rede local gerada já se configura `wonderland.universal` e do seu SNS Para usar um domínio diferente, criá-lo primeiro com o declarativo `app alias setup plan` e `app alias setup apply` fluxo de trabalho descrito em [Domínios](/pt/blockchain/domains.md#registration).

Registre um NFT. O registo lê o conteúdo inicial JSON a partir da entrada padrão:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspectar diretamente o NFT e, em seguida, listar todos os NFTs com entradas completas:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Adicionar uma chave de metadados e ler a NFT novamente:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Retire a chave de metadados:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Transferir opcionalmente o NFT. Utilize o `ledger nft get` para ler o proprietário atual do `owned_by` e use o `ledger account list all` para encontrar uma conta de destino ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Remova o exemplo NFT após a passagem. Se você o transferir, transfira-o de volta ou envie o comando de não registrar com a configuração da conta do proprietário atual.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Perguntas e Eventos {#queries-and-events}

Use [`FindNfts`](/pt/reference/queries.md#assets-nfts-and-rwas) para listar NFTs e [`FindNftsByAccountId`](/pt/reference/queries.md#assets-nfts-and-rwas) para listar a NFTs de propriedade de uma conta.

As atualizações de registro, exclusão, transferência e metadados NFT emitem eventos de dados NFT. Use o filtro de eventos de dados de `Nft` ao se inscrever em alterações no livro-razão ou criar gatilhos que reagem a eventos do ciclo de vida NFT.

## Permissões {#permissions}

A superfície de permissão padrão inclui tokens específicos do NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Os controles de permissão são executados pelo validador ativo do tempo de execução, para que uma rede possa personalizar a autorização atualizando o executor. Veja [Permission Tokens](/pt/reference/permissions.md) para a lista atual de tokens padrão.

## A escolha NFTs {#choosing-nfts}

Usar um NFT para registos em que a singularidade e a propriedade sejam importantes:

- Certificados, crachetes, licenças e atestados
- registos de adesão ou acesso
- Registros de inscrições vinculados à identidade ou em conta
- Referências a mídias, documentos ou manifestos fora da cadeia

Use um ativo numérico para saldos fungíveis, e use metadados [ simples ](/pt/blockchain/metadata.md) quando os dados são apenas um atributo compacto de um objeto do livro-razão existente.

Veja também:

- [Ativos](/pt/blockchain/assets.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Instruções ](/pt/blockchain/instructions.md)
- [Questões](/pt/blockchain/queries.md)
