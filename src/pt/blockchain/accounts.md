---
translation_locale: pt
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Contas {#accounts}

Uma conta é um principal de autorização que pode assinar transações e possuir estado no registro. No modelo de dados atual do Iroha 3, o `AccountId` é canônico e não contém domínio: ele deriva do controlador da conta e é codificado de forma canônica como [I105](/pt/reference/i105.md). O domínio legível e o contexto do espaço de dados pertencem a vínculos separados de alias da conta.

## Estrutura {#structure}

Um `Account` registrado contém:

- `id`: o `AccountId` canônico
- `metadata`: metadados arbitrários da conta
- `label`: um alias estável opcional
- `uaid`: um ID de Conta Universal opcional usado pelos fluxos Nexus
- `opaque_ids`: identificadores opacos vinculados à UAID da conta

O payload da transação usado para criar uma conta é `NewAccount`. Ele carrega a mesma identidade, metadados, rótulo, UAID e os campos de ID opaco usados pela conta registrada.

`uaid` complementa o `AccountId` canônico; ele não o substitui. Use-o quando os serviços Nexus precisarem de um identificador estável de usuário ou organização entre espaços de dados, de registro com preservação de privacidade ou de consulta de capacidades do serviço. O ambiente de execução mantém um índice individual entre UAID e conta, exige que os identificadores opacos sejam anexados por meio de um UAID e rejeita identificadores opacos duplicados ou conflitantes. Consulte [FHE e UAID](/pt/blockchain/sora-nexus-services.md#fhe-and-uaid) para conhecer o fluxo da camada de serviços Nexus.

## Controladores de contas {#account-controllers}

O controlador define como a conta autoriza ações. O fluxo padrão do cliente usa um par de chaves Ed25519, mas o modelo de dados também suporta controladores mais complexos, como controladores de política de múltiplas assinaturas.

A configuração do cliente armazena o principal de autorização de assinatura separadamente da configuração do par de rede:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Veja [configuração do cliente](/pt/guide/configure/client-configuration.md) e [geração de chave](/pt/guide/security/generating-cryptographic-keys.md) para os formatos de chave atuais.

## Experimente em Taira {#try-it-on-taira}

Liste algumas IDs de conta canônicas da testnet pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
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

Estas são leituras públicas. Criar ou atualizar uma conta é uma transação assinada e requer a configuração financiada pela testnet Taira descrita em [Conectar-se aos Dataspaces SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md).

## Cadastro e permissões {#registration-and-permissions}

As contas são registradas e não registradas com o genérico [`Register` e `Unregister`](/pt/blockchain/instructions.md#un-register) instruções. O validador de tempo de execução do software ativo decide quem pode criar contas e quais tokens de permissão ou funções são necessários.

Após o registro, uma conta pode:

- assinar transações
- possuir ativos
- domínios próprios
- receber funções e tokens de permissão
- armazenar metadados
- participar dos fluxos de alias, rekey, recuperação e identidade Nexus quando esses recursos estiverem ativados

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
- [SORA Nexus espaços de dados](/pt/get-started/sora-nexus-dataspaces.md)
