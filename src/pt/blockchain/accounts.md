---
translation_locale: pt
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contas {#accounts}

Uma conta é uma autoridade que pode assinar transações e o seu próprio estado de registro. No atual modelo de dados Iroha 3, `AccountId` é canônico e sem domínio: é derivado do controlador da conta e codificado canonicamente como I105. O contexto do domínio e espaço de dados legíveis ao ser humano pertence a vínculos separados entre contas alias.

## Estrutura {#structure}

Um `Account` registado contém:

- `id`: o canônico `AccountId`
- `metadata`: metadados arbitrários da conta
- `label`: um alias estável opcional
- `uaid`: uma conta universal opcional ID utilizada pelos fluxos Nexus
- `opaque_ids`: Identificadores opacos vinculados à conta UAID;

A carga útil da transação utilizada para criar uma conta é `NewAccount`. Ela contém os mesmos campos de identidade, metadados, etiqueta, UAID e opaco ID utilizados pela conta registada.

`uaid` complementa o canonico `AccountId`; Não o substitui. Nexus Serviços necessitam de um usuário ou organização estável em todos os espaços de dados, registos que preservam a privacidade. O tempo de execução mantém-se um a um UAID- índice de conta, requer que os identificadores opacos sejam anexados através de um UAID, e rejeita os identificadores opacos duplicados ou em colisão. [FHE e UAID](/pt/blockchain/sora-nexus-services.md#fhe-and-uaid) para o Nexus fluxo da camada de serviço.

## Controladores de contas {#account-controllers}

O controlador define como a conta autoriza ações. O fluxo de cliente padrão usa um par de chaves Ed25519, mas o modelo de dados também suporta controladores mais ricos, tais como controladores de políticas multisignatura.

A configuração do cliente armazena a autoridade de assinatura separadamente da configuração peer:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Veja . [configuração do cliente](/pt/guide/configure/client-configuration.md) e [geração de chaves](/pt/guide/security/generating-cryptographic-keys.md) para os formatos-chave atuais.

## Tente em Taira {#try-it-on-taira}

Lista de algumas contas canônicas IDs do testnet público Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Para inspecionar ativos da conta, copiar uma conta ID A partir da primeira chamada e URL-Codificar antes de colocá-lo no caminho. Python O snippet faz isso para a primeira conta listada:

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

Estas são leituras públicas. A criação ou atualização de uma conta é uma transação assinada e requer a configuração Taira financiada pela torneira descrita em [Conectar-se aos bancos de dados SORA Nexus ](/pt/get-started/sora-nexus-dataspaces.md).

## Registro e permissões {#registration-and-permissions}

As contas são registradas e não registradas com as instruções genéricas [`Register` e `Unregister`](/pt/blockchain/instructions.md#un-register). O validador ativo de tempo de execução decide quem pode criar contas e quais tokens ou papéis de permissão são necessários.

Após o registo, a conta pode:

- assinar transações
- possuir ativos
- Domínios próprios
- receber papéis e tokens de permissão
- armazenamento de metadados
- Participar em fluxos de alias, rekey, recuperação e identidade Nexus, quando esses recursos estiverem ativados.

## Resolução de problemas de identidade {#troubleshooting-identity-issues}

Se uma transacção for rejeitada inesperadamente, verifique se:

- A chave pública do cliente corresponde à chave privada utilizada para assinatura.
- A conta foi registada em gênese ou por uma transação comprometida.
- a autoridade tem as permissões exigidas pela instrução
- Os campos de conta rigorosa utilizam a conta canónica I105 ID, enquanto os nomes legíveis são resolvidos através de um alias de conta ativo vinculativo.

Veja também:

- [Permissões](/pt/blockchain/permissions.md)
- [Metadados ](/pt/blockchain/metadata.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Espaços de dados SORA Nexus](/pt/get-started/sora-nexus-dataspaces.md)
