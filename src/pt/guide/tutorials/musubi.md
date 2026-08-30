---
translation_locale: pt
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Embalagens Musubi Kotodama {#musubi-kotodama-packages}

Musubi é o gerenciador de pacotes de primeira versão para os pacotes-fonte Kotodama. Resolve um gráfico exato de dependência na cadeia, autentica SoraFS Arquivos de origem, compila e testa o espaço de trabalho selecionado, constrói arquivos canônicos CAR e publica versões imutáveis através do Iroha.

Use Musubi quando for necessário:

- Publicar bibliotecas de funções Kotodama reutilizáveis
- Aplicar um gráfico transitivo exato em `Musubi.lock`
- Reconstruir a fonte de dependência dos compromissos de arquivo SoraFS definidos.
- Construir e testar um pacote ou um espaço de trabalho com vários pacotes
- inspeccionar, publicar, retirar, manter ou alias pacotes através do registo on-chain

## Nome do pacote {#package-names}

Os selectores de embalagens canônicos utilizam:

```text
namespace/package
```

Os identificadores de lançamento exatos adicionam uma versão:

```text
namespace/package@version
```

Não há um líder `@` antes de um espaço de nomes. Um espaço de nomes é ou uma raiz do espaço de dados como o `universal` ou um espaço de dados qualificado por domínio como o `dex.universal`. O livro conta que liga esse espaço de nomes estrutural a um local estável espaço de dados antes de um pacote pode ser reivindicado.

## Manifesto e ficheiro de fechamento {#manifest-and-lockfile}

Um pacote utiliza o primeiro lançamento fechado `Musubi.toml` O manifesto deve declarar `manifest-version = 1`, Kotodama Edição `"1"`, e IVM ABI versão `1`; Não há um manifesto alternativo ou ABI modo.

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

As dependências podem usar versões exatas, requisitos de cuidado ou tilde, wildcards como `1.*`, e conjuntos de comparador separados por vírgula como `>=1.0.0,<2.0.0`. A chave da tabela de dependência é o alias de importação local-mãe; `package` é sempre o selector do registo canônico.

`Musubi.lock` liga o gráfico ao exato derivado da gênese `NetworkId` e um instantâneo de registro finalizado. Ele registra as raízes do espaço de trabalho selecionadas e os nós de liberação imutáveis, Incluindo liberação, fonte, interface, arquivo, ABI e compromissos exatos de dependência. versões paralelas são permitidas quando o gráfico resolvido exigir.

## Configuração Taira SoraFS Tracking {#configure-taira-sorafs-fetching}

Taira é a rede de teste pública para este fluxo de trabalho. Comece a partir de uma configuração do cliente Taira com a cadeia e a identidade da rede verificadas, depois adicione as ligações de buscas autenticadas específicas para o provedor abaixo. O material de assinatura da conta e as chaves do operador do fornecedor devem permanecer em arquivos de tempo de execução exclusivos dos proprietários.

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

Descubra os provedores admitidos da Taira a partir da raiz pública da rede de teste:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

O catálogo fornecedor fornece identidades do provedor e endpoints anunciados. Obtenha a autorização do operador correspondente do provedor escolhido. O runtime usa essa chave para solicitar tokens de fluxo limitado; tokens não são argumentos CLI nem conteúdo de arquivo de bloqueio.

Não utilizar um Taira pin de validação URL como `url`. Os validadores registados incorporaram: SoraFS O armazenamento foi desativado. `https://taira-validator-{1,2,3,4}.sora.org` Os endpoints aceitam o registro de pin, enquanto as leituras de arquivo usam a assinatura do provedor admitido selecionado. HTTPS Origem.

## Fluxo de trabalho local {#local-workflow}

A partir da raiz do espaço de trabalho Iroha ascendente, criar ou inserir o diretório de pacotes e executar Musubi através de Cargo:

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

`fetch` Resolve o gráfico de registro final, atualizações `Musubi.lock` quando permitido, e preenche o caché local imutável de autenticado SoraFS localizações. `check`, `build`, `test`, e `package` Realizar as mesmas verificações de gráficos e cache antes do seu próprio trabalho.

Use `--locked` para rejeitar qualquer alteração do arquivo de bloqueio. Use `--offline` somente quando tanto o índice de registro quanto todos os arquivos necessários já estiverem em cache. `--frozen` combina essas duas restrições. Um cache offline falha; Musubi nunca escreve um arquivo não resolvido.

As fontes de dependência são ligadas reescrevendo chamadas qualificadas, como `math::add()` a nomes internos deterministas Kotodama. Uma chamada de dependência para uma função não exportada é rejeitada. Bibliotecas importadas expõem funções; os alvos locais `[[contract]]` e `[[test]]` permanecem objetivos explícitos do pacote .

## Verificação e Reparação do Cache {#cache-verification-and-repair}

Os comandos do cache público operam em arquivos imutáveis e comprometidos com o registo:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` A quarentena corrompe descendentes confiáveis e remete arquivos precisos quando a prova do fornecedor o permite. Musubi Rejeita uma mutação viva de poda não vazia. `--dry-run` inspeccionar os candidatos classificados.

## Embalagens e publicações {#packaging-and-publishing}

Inscreva o conjunto de arquivo positivo limpo antes de escrever um arquivo, e depois construa o pacote canônico:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` escreve `target/package/<namespace>-<name>-<version>.car`. A Comissão CAR liga o manifesto canônico do pacote, o manifesto de libertação semântica, a fechadura de verificação exata, a árvore fonte, a digestão da interface, e SoraFS O compromisso com o arquivo não existe `pack`, `--car-out`, `--sorafs-manifest-out`, ou `--source-plan-out` comandos na primeira versão CLI.

A publicação é um fluxo de trabalho de rede assinado e reiniciável. O `client.toml` selecionado deve conter as ligações de produção `[musubi.publication]`, bem como a configuração da conta e da rede Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Use `--detach` para retornar depois que o diário de operação e a fronteira de entrada da semente são duráveis. Continuar uma operação durável com `publish --resume <operation-id> --config client.toml`. O caminho mais estreito `--recover <operation-id>` apenas reconstrui Não há publicação `--dry-run` ou download público genérico fallback; executar `package --list` e `package` para pré-voio local.

## Questões de registro e ciclo de vida {#registry-queries-and-lifecycle}

Pesquisar e inspecionar o registo final com a mesma configuração do cliente Taira:

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

O Yanking exclui uma libertação imutável de novas resoluções enquanto os bloqueios exatos existentes permanecem reprodutíveis. Leia a revisão de yank atual primeiro, e depois envie uma mutação comparada:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Use `unyank` com o mesmo pacote, versão e revisão recém-leita para reverter esse estado. Papéis de propriedade e manutenção do pacote controle publicar, tirar, metadados Os pseudónimos globais têm o seu próprio registo a preços, histórico de retargeting e revisões de comparação e definição; eles não são atalhos de propriedade do pacote.

## Superfícies Iroha {#iroha-surfaces}

Musubi utiliza instruções e consultas de primeira edição V1:

|Superfície .|Propósito |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Ligue um espaço de nomes ao seu local estável. |
|`RegisterMusubiArchiveV1` |Registre um compromisso de arquivo fonte autenticado imutável. |
|`AddMusubiArchiveLocationV1` |Adicionar ou renovar um local de arquivo comprovado SoraFS. |
|`PublishMusubiReleaseV1` |Clamar ou atualizar um pacote e publicar uma versão imutável. |
|`SetMusubiReleaseYankV1` |Comparar e definir o estado arrastado de uma liberação exata. |
|`InviteMusubiPackageMaintainerV1` |Iniciar o fluxo de convites para papéis de pacote explícito. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Registar ou retargar um alias global governado. |
|`AssertMusubiReleaseDigestV1` |Afirma a digestão exacta da liberação imutável. |
|`FindMusubiExactPackageV1` |Leia um pacote exato e suas revisões. |
|`FindMusubiExactReleaseV1` |Leia uma imagem exata. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Resolver ou listar os candidatos a libertação finais. |
|`FindMusubiArchiveLocationsV1` |Leia as localizações de arquivo finalizadas apoiadas pelo provedor. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Leia o alvo do alias atual ou a sua história imutável. |

Torii expõe a família de rotas do aplicativo no `/v1/musubi/`. MCP as ferramentas usam a corrente `iroha.musubi.queries.` e `iroha.musubi.instructions.*` Os nomes. [Torii pontos finais](/pt/reference/torii-endpoints.md) e o [Referência de consulta](/pt/reference/queries.md) para o mais amplo API O mapa.
