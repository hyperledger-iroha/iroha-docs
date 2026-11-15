---
translation_locale: pt
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Contas {#accounts}

Uma conta é uma autoridade que pode assinar transações e possuir estado no registro. No modelo de dados atual do Iroha 3, `AccountId` é canônico e não contém domínio: ele deriva do controlador da conta e é codificado de forma canônica como [I105](/pt/reference/i105.md). O contexto de domínio e de espaço de dados legível por humanos pertence a vínculos separados de alias de conta.

## Estrutura {#structure}

Um `Account` registrado contém:

- `id`: o `AccountId` canônico
- `metadata`: metadados arbitrários da conta
- `label`: um alias estável opcional
- `uaid`: um ID de Conta Universal opcional usado pelos fluxos SORA Nexus
- `opaque_ids`: identificadores opacos vinculados à UAID da conta

O payload da transação usado para criar uma conta é `NewAccount`. Ele carrega a mesma identidade, metadados, rótulo, UAID e os campos de ID opaco usados pela conta registrada.

`uaid` complementa o `AccountId` canônico; não o substitui. Use-o quando os serviços SORA Nexus precisarem de um identificador estável de usuário ou organização entre espaços de dados, de cadastro com preservação de privacidade ou de consulta de capacidades do serviço. O ambiente de execução mantém um índice de correspondência um a um entre UAID e conta, exige que os identificadores opacos sejam vinculados por meio de um UAID e rejeita identificadores opacos duplicados ou conflitantes. Consulte [FHE e UAID](/pt/blockchain/sora-nexus-services.md#fhe-and-uaid) para conhecer o fluxo da camada de serviços SORA Nexus.

## Controladores de contas {#account-controllers}

O controlador define como a conta autoriza ações. O fluxo padrão do cliente usa um par de chaves Ed25519, mas o modelo de dados também suporta controladores mais complexos, como controladores de política de múltiplas assinaturas.

A configuração do cliente armazena o principal de autorização de assinatura separadamente da configuração do par de rede:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

Veja [configuração do cliente](/pt/guide/configure/client-configuration.md) e [geração de chave](/pt/guide/security/generating-cryptographic-keys.md) para os formatos de chave atuais.

## Experimente em Taira {#try-it-on-taira}

Liste algumas IDs de conta canônicas da testnet pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

Para inspecionar os ativos da conta, copie um ID de conta da primeira chamada e codifique-o em URL antes de colocá-lo no caminho. Este trecho Python faz isso para a primeira conta listada:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Estas são leituras públicas. Criar ou atualizar uma conta é uma transação assinada e requer a configuração de Taira com fundos obtidos pelo faucet descrita em [Desenvolver na SORA Nexus com Taira e Minamoto](/pt/get-started/sora-nexus-dataspaces.md).

## Cadastro e permissões {#registration-and-permissions}

As contas são registradas e não registradas com o genérico [`Register` e `Unregister`](/pt/blockchain/instructions.md#un-register) instruções. O validador de tempo de execução do software ativo decide quem pode criar contas e quais tokens de permissão ou funções são necessários.

Após o registro, uma conta pode:

- assinar transações
- possuir ativos
- domínios próprios
- receber funções e tokens de permissão
- armazenar metadados
- participar dos fluxos de alias, troca de chaves, recuperação e identidade do SORA Nexus quando esses recursos estiverem ativados

## Solução de problemas de identidade {#troubleshooting-identity-issues}

Se uma transação for rejeitada inesperadamente, verifique se:

- a chave pública do cliente corresponde à chave privada usada para assinatura
- a conta foi registrada na gênese da blockchain ou por uma transação confirmada
- o principal de autorização possui as permissões exigidas pela instrução
- campos de conta estritos usam o ID de conta canônico I105, enquanto nomes legíveis são resolvidos através de uma vinculação ativa de alias de conta

Veja também:

- [Permissões](/pt/blockchain/permissions.md)
- [Metadados](/pt/blockchain/metadata.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Espaços de dados do SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md)
