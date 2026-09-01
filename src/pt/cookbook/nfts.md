---
translation_locale: pt
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Resultado {#outcome}

Inspecione o estado de Taira NFT, depois registre, atualize, transfira e consulte um único NFT em uma rede local gerada. O fluxo de trabalho usa um ID de `name$domain.dataspace` NFT totalmente qualificado e IDs de proprietário canônicos I105.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e o atual `iroha` CLI.
- Acesso somente leitura Taira.
- Para gravações, uma rede local gerada a partir de [Iniciar Iroha](/pt/get-started/launch-iroha.md), com `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`.

## Passos {#steps}

### 1. Inspecionar a coleção pública Taira {#_1-inspect-the-public-taira-collection}

Uma página vazia é uma leitura bem-sucedida: significa que não há NFTs visíveis na página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs são registros únicos, não saldos numéricos. Eles têm um ID, um proprietário e um mapa de metadados compacto `content`.

### 2. Prepare os IDs dos proprietários locais {#_2-prepare-local-owner-ids}

O exemplo escrito usa o domínio registrado `wonderland.universal`. Derive o principal de autorização configurado sem expor sua chave privada e, em seguida, escolha outra conta registrada como destino da transferência.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

O separador `$` pertence ao formulário de texto NFT. Mantenha o domínio completo `wonderland.universal` e o sufixo do espaço de dados.

### 3. Registre o NFT com conteúdo inicial {#_3-register-the-nft-with-initial-content}

O CLI lê o objeto JSON inicial da entrada padrão. O principal de autorização atual se torna o proprietário.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Atualize o mapa de conteúdo {#_4-update-the-content-map}

Os valores de metadados são JSON. Definir uma chave insere ou substitui essa entrada; não substitui o registro inteiro NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transferir propriedade {#_5-transfer-ownership}

Forneça ambos os IDs de conta canônicos I105. Um alias deve ser resolvido antes de ser usado como `--from` ou `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Limite de permissão

Em Taira, toda escrita também precisa de `--metadata ./taira.tx-metadata.json` e de um pagador de taxas explícito. Registro, transferência, remoção e atualizações de metadados são verificados pelo software ativo tempo de execução (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` e `CanModifyNftMetadata` na superfície de permissão padrão). Use um domínio atribuído à sua aplicação ou mantenha este guia no localnet.

:::

Para fluxos de trabalho de propriedade de contrato, Kotodama expõe chamadas de host tipadas NFT. O seguinte é o artefato de teste de ciclo de vida exato compilado e executado pelo teste de documentação IVM fixado:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Os dois valores fixos I105 são artefatos de teste a montante; o executor de testes registra o destino antes da execução. Eles não são `CURRENT_OWNER` e `NEW_OWNER` do walkthrough CLI. Para um contrato de aplicativo, forneça suas contas canônicas reais, depois compile, teste, implemente e chame-o através de [Contratos inteligentes](./smart-contracts.md). Não envie bytecode não revisado para Taira, e lembre-se de que a execução do contrato ainda passa pela autorização de tempo de execução do software.

## Verificar {#verify}

Leia o NFT diretamente e afirme que seu proprietário mudou enquanto seu conteúdo permaneceu anexado:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Se o CLI envolver o registro em um contêiner de dados de saída, inspecione o JSON uma vez e aplique a asserção ao objeto NFT contido. Os invariantes autoritativos são `id`, `owned_by` e `content`.

## Solução de problemas {#troubleshooting}

- `name$domain` pode usar o espaço de dados universal por padrão em alguns analisadores, mas IDs de livros de receitas e aplicativos devem usar a forma explícita `name$domain.dataspace`.
- Um registro repetido do mesmo ID NFT é rejeitado. Use uma nova rede local ou escolha um novo ID estável para um registro distinto.
- A entrada de metadados deve ser válida JSON na entrada padrão. Uma string de shell sem citação JSON não é um valor de metadados.
- Uma transferência assinada por uma conta que não seja a do proprietário atual precisa de uma permissão exata; mudar `--from` não altera o signatário criptográfico.
- Após a transferência, o cliente original pode não ter mais permissão para alterar ou cancelar o registro do NFT. Use o signatário criptográfico do novo proprietário ou um controlador autorizado.
- Taira pode retornar uma coleção NFT vazia. Não trate `items: []` como prova de que as instruções NFT estão indisponíveis.

## Fonte e documentos relacionados {#source-and-related-docs}

- [NFT testes de integração no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT testes de chamadas de host no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Artefato de teste de ciclo de vida exato Kotodama NFT no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/pt/blockchain/nfts.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Tokens de permissão](/pt/reference/permissions.md)
