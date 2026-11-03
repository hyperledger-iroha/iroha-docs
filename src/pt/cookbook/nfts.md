---
translation_locale: pt
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Resultado {#outcome}

Inspecione o estado de Taira NFT, depois registre, atualize, transfira e consulte um único NFT em uma rede local gerada. O fluxo de trabalho usa um ID de `name$domain.dataspace` NFT totalmente qualificado e IDs de proprietário canônicos I105.

## Pré-requisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 ou posterior, e o atual `iroha` CLI.
- Acesso somente leitura Taira.
- Para gravações, uma rede local criada com `kagami localnet generate --peers 4 --out-dir ./localnet` como em [Iniciar Iroha](/pt/get-started/launch-iroha.md), com `./localnet/client.toml` e Torii em `http://127.0.0.1:8080`, além de um domínio NFT de propriedade do seu signatário (veja o passo 2).

## Passos {#steps}

### 1. Inspecionar a coleção pública Taira {#_1-inspect-the-public-taira-collection}

Uma página vazia é uma leitura bem-sucedida: significa que não há NFTs visíveis na página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs são registros únicos, não saldos numéricos. Eles têm um ID, um proprietário e um mapa de conteúdo compacto, que as linhas de coleção do Torii retornam como `metadata` e `ledger nft get` retorna como `content`.

### 2. Prepare os IDs dos proprietários locais {#_2-prepare-local-owner-ids}

O exemplo de escrita precisa de um domínio de propriedade da conta signatária, ou de uma concessão de `CanRegisterNft` para ele. Uma rede local gerada não registra nenhum domínio de aplicação para o seu cliente, e o registro direto de domínios é reservado à gênese, então defina `NFT_DOMAIN` como um domínio `name.dataspace` que seu signatário controle. Derive o principal de autorização configurado sem expor sua chave privada e, em seguida, escolha outra conta registrada como destino da transferência.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

O separador `$` pertence à forma textual do NFT. Mantenha o domínio `name.dataspace` completo no ID.

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

Na Taira, toda escrita usa `--fee-payer authority`; o CLI cota a taxa exata, no ativo de taxa da Taira, antes de assinar. Registro, transferência, remoção e atualizações de metadados são verificados pelo ambiente de execução ativo (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` e `CanModifyNftMetadata` na superfície de permissão padrão). Use um domínio de propriedade da sua conta ou um para o qual ela tenha essas concessões.

:::

Para fluxos de trabalho de propriedade de contrato, Kotodama expõe chamadas de host tipadas NFT. O seguinte é o artefato de teste de ciclo de vida exato compilado e executado pelo teste de documentação IVM fixado:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

O CLI imprime o próprio registro do NFT. Os invariantes autoritativos são `id`, `owned_by` e `content`.

## Solução de problemas {#troubleshooting}

- `name$domain` pode usar o espaço de dados universal por padrão em alguns analisadores, mas IDs de livros de receitas e aplicativos devem usar a forma explícita `name$domain.dataspace`.
- Um registro repetido do mesmo ID NFT é rejeitado. Use uma nova rede local ou escolha um novo ID estável para um registro distinto.
- A entrada de metadados deve ser válida JSON na entrada padrão. Uma string de shell sem citação JSON não é um valor de metadados.
- Uma transferência assinada por uma conta que não seja a do proprietário atual precisa da propriedade do domínio do NFT ou de uma concessão exata de `CanTransferNft`; mudar `--from` não altera o signatário criptográfico.
- A transferência altera apenas `owned_by`. Atualizações de metadados e o cancelamento do registro continuam com o proprietário do domínio ou com uma conta que tenha `CanModifyNftMetadata` ou `CanUnregisterNft` para esse NFT; o novo proprietário pode transferi-lo adiante.
- Taira pode retornar uma coleção NFT vazia. Não trate `items: []` como prova de que as instruções NFT estão indisponíveis.

## Fonte e documentos relacionados {#source-and-related-docs}

- [NFT testes de integração no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT testes de chamadas de host no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Artefato de teste de ciclo de vida exato Kotodama NFT no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Testes dos exemplos de documentação do Kotodama no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/pt/blockchain/nfts.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Tokens de permissão](/pt/reference/permissions.md)
