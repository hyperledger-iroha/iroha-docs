---
translation_locale: pt
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

Um Iroha NFT é um objeto de registro de blockchain único com um único proprietário. Use NFTs quando um registro precisar de sua própria identidade, metadados, eventos de ciclo de vida e semântica de transferência de propriedade, mas não precisar de um saldo numérico.

Ao contrário de um [ativo](/pt/blockchain/assets.md) numérico, um NFT não possui precisão, política de emissão de ativos ou quantidades por conta. O NFT existe como um único objeto registrado, e a propriedade é rastreada diretamente nesse objeto.

## Estrutura {#structure}

Um `Nft` registrado contém:

- `id`: um `NftId`
- `content`: metadados que descrevem o NFT
- `owned_by`: a conta que possui o NFT

O campo `content` é um mapa `Metadata`. Mantenha-o compacto: armazene campos descritivos, referências estáveis, hashes criptográficos, URIs ou caminhos SoraFS nele. Armazene documentos grandes, mídias ou estado de aplicação de alta rotatividade fora da cadeia e mantenha apenas uma referência verificável no NFT.

## Experimente em Taira {#try-it-on-taira}

Verifique se a testnet pública Taira atualmente possui NFT registros:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Verifique o documento ao vivo OpenAPI para as rotas NFT expostas pelo nó:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Um array vazio `items` é uma resposta válida em uma testnet pública. Isso significa que não há NFTs na página atual, e não que as instruções NFT estejam indisponíveis.

## NFT IDs {#nft-ids}

`NftId` usa este formulário de texto:

```text
name$domain
name$domain.dataspace
```

Por exemplo, `badge$docs.universal` identifica o `badge` NFT no domínio `docs.universal`. Se o espaço de dados for omitido, o analisador atual usa o espaço de dados `universal`, então `badge$docs` é resolvido para `badge$docs.universal`.

Use nomes estáveis para IDs NFT. O ID é a identidade do objeto usada por instruções, consultas, permissões, filtros de eventos e referências de aplicativos.

## Ciclo de vida {#lifecycle}

NFT operações de ciclo de vida usam Iroha operações de instrução:

- [`Register`](/pt/blockchain/instructions.md#un-register) cria o NFT com inicial `content`.
- [`Unregister`](/pt/blockchain/instructions.md#un-register) remove o NFT.
- [`Transfer`](/pt/blockchain/instructions.md#transfer) mudanças `owned_by`.
- [`SetKeyValue` e `RemoveKeyValue`](/pt/blockchain/instructions.md#setkeyvalue-removekeyvalue) atualizar NFT metadados.

## Experimente Localmente {#try-it-locally}

Estes exemplos assumem que você lançou uma rede local e possui a configuração do cliente gerada a partir do [CLI guia](/pt/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

A localnet gerada já configura `wonderland.universal` e seu contrato SNS. Para usar um domínio diferente, crie-o primeiro com o fluxo de trabalho declarativo `app alias setup plan` e `app alias setup apply` descrito em [Domínios](/pt/blockchain/domains.md#registration).

Registre um NFT. O registro lê o conteúdo inicial JSON da entrada padrão:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspecione o NFT diretamente e, em seguida, liste todos os NFTs com entradas completas:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Adicione uma chave de metadados e leia o NFT novamente:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Remova a chave de metadados:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Opcionalmente, transfira o NFT. Use `ledger nft get` para ler o proprietário atual de `owned_by`, e use `ledger account list all` para encontrar um ID de conta de destino.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Remova o exemplo NFT após o passo a passo. Se você o transferiu, transfira de volta ou envie o comando de cancelamento de registro com a configuração da conta do proprietário atual.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Consultas e Eventos {#queries-and-events}

Usar [`FindNfts`](/pt/reference/queries.md#assets-nfts-and-rwas) listar NFTs e [`FindNftsByAccountId`](/pt/reference/queries.md#assets-nfts-and-rwas) listar NFTs pertencente a uma conta.

NFT registro, exclusão, transferência e atualizações de metadados emitem eventos de dados NFT. Use o filtro de eventos de dados `Nft` ao se inscrever em alterações do livro contábil da blockchain ou ao criar gatilhos que reagem a eventos de ciclo de vida NFT.

## Permissões {#permissions}

A superfície de permissão padrão inclui tokens específicos de NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

As verificações de permissão são impostas pelo validador de tempo de execução de software ativo, portanto, uma rede pode personalizar a autorização ao atualizar o executor. Veja [Tokens de Permissão](/pt/reference/permissions.md) para a lista de tokens padrão atual.

## Escolhendo NFTs {#choosing-nfts}

Use um NFT para registros onde a exclusividade e a propriedade são importantes:

- certificados, distintivos, licenças e atestados
- registros de associação ou de acesso
- registros de aplicativos vinculados à identidade ou pertencentes à conta
- referências a mídias fora da cadeia, documentos ou manifestos técnicos

Use um ativo numérico para saldos fungíveis, e use [metadados](/pt/blockchain/metadata.md) simples quando os dados forem apenas um atributo compacto de um objeto existente do livro-razão da blockchain.

Veja também:

- [Ativos](/pt/blockchain/assets.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Consultas](/pt/blockchain/queries.md)
