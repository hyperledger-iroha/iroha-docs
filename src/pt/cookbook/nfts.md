---
translation_locale: pt
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Resultados {#outcome}

Inspecção Taira NFT registar, atualizar, transferir e consultar um único NFT O fluxo de trabalho utiliza um `name$domain.dataspace` NFT ID e canônica I105 proprietário IDs.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou mais tarde, e a corrente `iroha` CLI.
- Acesso somente de leitura Taira.
- Para escritos, uma rede local gerada a partir de [Lançamento Iroha](/pt/get-started/launch-iroha.md), com `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`.

## Passos {#steps}

### 1. Inspecionar a coleção pública Taira {#_1-inspect-the-public-taira-collection}

Uma página vazia é uma leitura bem-sucedida: significa que não há nenhuma NFTs visível na página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs são registros únicos, não saldos numéricos. Eles têm um ID, um proprietário e um mapa de metadados compacto `content`.

### Preparar o proprietário local IDs {#_2-prepare-local-owner-ids}

O exemplo de escrita usa o domínio `wonderland.universal` registrado. Derivar a autoridade configurada sem expor sua chave privada, em seguida, escolher uma outra conta registada como destino de transferência.

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

O separador `$` pertence ao formulário de texto NFT. Mantenha o sufixo completo do domínio `wonderland.universal` e espaço de dados.

### 3. Registrar o NFT com conteúdo inicial {#_3-register-the-nft-with-initial-content}

O CLI lê o objeto inicial JSON da entrada padrão. A autoridade atual torna-se o proprietário.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Atualizar o mapa de conteúdo {#_4-update-the-content-map}

Os valores de metadados são JSON. A configuração de uma chave inserta ou substitui essa entrada; não substitui todo o registo NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transferência de propriedade {#_5-transfer-ownership}

Fornecer ambas as contas canônicas I105 IDs. Um alias deve ser resolvido antes de ser usado como `--from` ou `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Limite de autorização

Em Taira, cada inscrição também precisa de `--metadata ./taira.tx-metadata.json` e um pagador explícito de taxas. Registro, transferência, remoção e atualizações de metadados são verificadas pelo tempo de execução ativo (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` e `CanModifyNftMetadata` na superfície de permissão padrão). Use um domínio atribuído ao seu aplicativo ou mantenha este walkthrough em localnet.

:::

Para os fluxos de trabalho de propriedade contratual, Kotodama expõe as chamadas host typed NFT. A seguinte é a fixação exata do ciclo de vida compilada e executada pelo teste de documentação fixado IVM:

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

Os dois são fixos. I105 Os valores são fixos de ensaio a montante; o arnes registra o destino antes da execução. `CURRENT_OWNER` e `NEW_OWNER` a partir do CLI Para um contrato de aplicação, forneça as suas contas canônicas reais, depois compile, teste, implante e ligue-o através do [Contratos inteligentes](./smart-contracts.md). Não enviar o código de byte não revisado para Taira, E lembre-se que a execução do contrato ainda passa pela autorização de tempo de execução.

## Verificar {#verify}

Leia diretamente a NFT e afirme que o seu proprietário mudou enquanto o seu conteúdo permaneceu anexado:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Se o CLI envolver o registro em um envelope de saída, inscreva o JSON uma vez e aplique a afirmação ao objeto NFT contido. As invariantes autorizadas são `id`, `owned_by` e `content`.

## Resolução de problemas {#troubleshooting}

- O `name$domain` pode ser utilizado como padrão para o espaço de dados universal em alguns aparelhos, mas o livro de cozinha e a aplicação IDs devem utilizar o formulário explícito `name$domain.dataspace`.
- É rejeitado um registo repetido do mesmo NFT ID. Utilize uma rede local nova ou escolha uma nova e estável ID para um registro distinto.
- A entrada de metadados deve ser válida JSON na entrada padrão. Uma cadeira shell sem a citação JSON não é um valor de metadatos.
- Uma transferência assinada por uma conta que não seja o titular atual precisa de uma autorização exata; a alteração do `--from` não muda o signatário.
- Após a transferência, o cliente original não pode mais ter permissão para alterar ou desinscrever o NFT. Usar a assinatura do novo proprietário ou um controlador autorizado.
- Taira pode devolver uma coleção vazia de NFT. Não trate `items: []` como prova de que as instruções NFT não estão disponíveis.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Ensaios de integração NFT no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT Testes de ligação host no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Fixação exacta do ciclo de vida Kotodama NFT no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko).
- [NFTs](/pt/blockchain/nfts.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Instruções ](/pt/blockchain/instructions.md)
- [Tokens de permissão ](/pt/reference/permissions.md)
