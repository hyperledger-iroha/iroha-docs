---
translation_locale: pt
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Pacotes {#musubi-kotodama-packages}

Musubi é o gerenciador de pacotes de primeira versão para pacotes de origem Kotodama. Ele resolve um gráfico de dependências exato na cadeia, autentica SoraFS arquiva fontes, compila e testa o espaço de trabalho selecionado, constrói arquivos canônicos CAR e publica versões imutáveis através do Iroha.

Use Musubi quando você precisar:

- publicar bibliotecas de funções reutilizáveis Kotodama
- fixar um grafo transitivo exato em `Musubi.lock`
- reconstruir a fonte de dependência a partir dos compromissos de arquivo finalizados SoraFS
- construir e testar um pacote ou um espaço de trabalho com vários pacotes
- inspecionar, publicar, puxar, manter ou criar alias de pacotes através do registro on-chain

## Nomes de Pacotes {#package-names}

Os seletores de pacotes canônicos usam:

```text
namespace/package
```

Identificadores exatos de lançamento adicionam uma versão:

```text
namespace/package@version
```

Não há `@` à frente de um namespace. Um namespace é ou uma raiz de espaço de dados, como `universal`, ou um espaço de dados qualificado por domínio, como `dex.universal`. O livro-razão da blockchain vincula esse namespace estrutural a um espaço de dados doméstico estável antes que um pacote possa ser reivindicado.

## manifesto técnico e Lockfile {#manifest-and-lockfile}

Um pacote utiliza o esquema fechado da primeira versão `Musubi.toml`. O manifesto técnico deve declarar `manifest-version = 1`, Kotodama edição `"1"`, e IVM ABI versão `1`; não há manifesto técnico alternativo ou modo ABI.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Dependências podem usar versões exatas, requisitos com caret ou tilde, curingas como `1.*`, e conjuntos de comparadores separados por vírgula como `>=1.0.0,<2.0.0`. A chave da tabela de dependências é o alias de importação local do pai; `package` é sempre o seletor de registro canônico.

`Musubi.lock` vincula o grafo ao `NetworkId` exato derivado da gênese e a um instantâneo finalizado do registro. Ele registra as raízes selecionadas do espaço de trabalho e os nós de lançamento imutáveis, incluindo versão, código-fonte, interface, arquivo, ABI e os compromissos exatos das arestas de dependência. Versões paralelas são permitidas quando o grafo resolvido as exige.

## Configurar Taira SoraFS Buscando {#configure-taira-sorafs-fetching}

Taira é a testnet pública deste fluxo de trabalho. Comece com uma configuração de cliente Taira que contenha a cadeia registrada e a identidade de rede atualmente fixada e derivada da gênese; depois, adicione abaixo os vínculos de busca autenticada específicos do provedor. Uma reinicialização da Taira pode alterar o `NetworkId`; atualize-o pelo perfil de implantação assinado, em vez de inferi-lo pelo UUID estável da cadeia. O material de assinatura da conta e as chaves do operador do provedor devem permanecer em arquivos do ambiente de execução acessíveis somente pelo proprietário.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Descubra os provedores admitidos de Taira a partir da raiz da testnet pública:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

O catálogo de provedores fornece identidades de provedores e endpoints anunciados API. Obtenha a autorização correspondente do operador junto ao provedor escolhido. O tempo de execução do software usa essa chave para solicitar tokens de stream limitados; os tokens não são argumentos CLI nem conteúdo de arquivo de bloqueio.

Não use um pino de validador Taira URL como `url`. Os validadores registrados têm o armazenamento incorporado SoraFS desativado. Seus pontos de extremidade `https://taira-validator-{1,2,3,4}.sora.org` API aceitam registro de pino, enquanto leituras de arquivo usam a origem HTTPS do provedor admitido selecionado.

## Fluxo de Trabalho Local {#local-workflow}

A partir do diretório raiz do workspace Iroha upstream, crie ou entre no diretório do pacote e execute Musubi através do Cargo:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` resolve o gráfico de registro finalizado, atualiza `Musubi.lock` quando permitido e preenche o cache local imutável a partir de locais SoraFS autenticados. `check`, `build`, `test` e `package` realizam as mesmas verificações de gráfico e cache antes do seu próprio trabalho.

Use `--locked` para rejeitar qualquer alteração no arquivo de bloqueio. Use `--offline` apenas quando tanto o índice do registro quanto todos os arquivos necessários já estiverem em cache. `--frozen` combina essas duas restrições. Uma falta de cache offline falha; Musubi nunca escreve um arquivo de bloqueio não resolvido.

As fontes de dependência são vinculadas reescrevendo chamadas qualificadas, como `math::add()`, para nomes internos determinísticos Kotodama. Uma chamada de dependência para uma função não exportada é rejeitada. Bibliotecas importadas expõem funções; os alvos locais `[[contract]]` e `[[test]]` permanecem como alvos de pacote explícitos.

## Verificação e Reparação de Cache {#cache-verification-and-repair}

Os comandos de cache público operam em arquivos imutáveis, registrados no registro:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` coloca em quarentena descendentes confiáveis corrompidos e busca novamente arquivos exatos quando as evidências do provedor finalizado o permitem. A poda é deliberadamente projetada para falhar fechada em mutações ativas e não vazias; use `--dry-run` para inspecionar os candidatos classificados.

## Empacotamento e Publicação {#packaging-and-publishing}

Inspecione o conjunto de arquivos positivos limpos antes de escrever um arquivo, e então construa o pacote canônico:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` grava `target/package/<namespace>-<name>-<version>.car`. O CAR vincula o manifesto canônico do pacote, o manifesto de versão semântica, o bloqueio exato de verificação, a árvore de origem, o resumo da interface e o compromisso do arquivo SoraFS. A CLI da primeira versão não oferece comandos separados `pack`, `--car-out`, `--sorafs-manifest-out` ou `--source-plan-out`.

A publicação é um fluxo de trabalho de rede assinado e retomável. O `client.toml` selecionado deve conter as ligações obrigatórias `[musubi.publication]`, bem como a conta e a configuração de rede Taira. Empacote exatamente um membro do espaço de trabalho:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Use `--detach` para retornar após o diário de operação e o limite de entrada de semente serem duráveis. Continue uma operação durável com `publish --resume <operation-id> --config client.toml`. O caminho mais estreito `--recover <operation-id>` apenas reconstrói faltando registros auxiliares imutáveis para um diário pré-ingresso intacto. Não há publicação `--dry-run` nem fallback genérico de upload público; execute `package --list` e `package` para verificação prévia local.

## Consultas de Registro e Ciclo de Vida {#registry-queries-and-lifecycle}

Pesquisar e inspecionar o registro finalizado com a mesma configuração de cliente Taira:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Yanking exclui uma versão imutável de novas resoluções enquanto bloqueios exatos existentes permanecem reproduzíveis. Leia a revisão atual do yank primeiro, então envie uma mutação de comparar e definir:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Use `unyank` com o mesmo pacote, versão e revisão recém-lida para reverter esse estado. A propriedade do pacote e os papéis de mantenedor controlam publicação, remoção, metadados, e permissões de localização de arquivo. Alias globais têm seu próprio registro com preço, histórico de retarget e revisões de comparar-e-definir; eles não são atalhos de propriedade de pacote.

## Iroha Superfícies {#iroha-surfaces}

Musubi usa instruções e consultas V1 de primeira versão:

|Superfície|Propósito|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Vincule um namespace ao seu espaço de dados estável.|
| `RegisterMusubiArchiveV1`                            |Registrar um compromisso de arquivo de origem autenticado imutável.|
| `AddMusubiArchiveLocationV1`                         |Adicionar ou renovar um local de arquivo comprovado SoraFS.|
| `PublishMusubiReleaseV1`                             |Reivindique ou atualize um pacote e publique uma versão imutável.|
| `SetMusubiReleaseYankV1`                             |Compare e defina o estado removido de uma versão exata.|
| `InviteMusubiPackageMaintainerV1`                    |Inicie o fluxo de convite de função de pacote explícito.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Registrar ou redirecionar um alias global governado.|
| `AssertMusubiReleaseDigestV1`                        |Afirme o valor exato e imutável do resumo criptográfico da versão.|
| `FindMusubiExactPackageV1`                           |Leia um pacote exato e suas revisões.|
| `FindMusubiExactReleaseV1`                           |Leia um instantâneo exato de lançamento.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Resolva ou liste os candidatos a lançamento finalizados.|
| `FindMusubiArchiveLocationsV1`                       |Leia locais de arquivo finalizados suportados pelo provedor.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Leia o alvo do alias atual ou seu histórico imutável.|

Torii expõe a família de rotas do aplicativo sob `/v1/musubi/*`. As ferramentas MCP usam os nomes atuais de `iroha.musubi.queries.*` e `iroha.musubi.instructions.*`. Veja [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md) e o [referência de consulta](/pt/reference/queries.md) para o mapa mais amplo de API.
