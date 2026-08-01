---
translation_locale: pt
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Embalagens Musubi Kotodama {#musubi-kotodama-packages}

Musubi é o gerenciador de pacotes para os pacotes-fonte Kotodama. Ele oferece aos desenvolvedores um fluxo de trabalho similar ao Cargo para compartilhar funções compostas Kotodama, mantendo a identidade do pacote ligada aos espaços de nomes SORA e Iroha em vez de uma tabela global de nomes de primeira chegada.

Use Musubi quando for necessário:

- Publicar bibliotecas de fontes Kotodama reutilizáveis
- As dependências de fontes transitivas exatas em `Musubi.lock`
- Reconstruir a fonte de dependência dos compromissos verificados no arquivo SoraFS
- Conectar um espaço de nomes do pacote para alias de contrato dapp no mesmo espaço de nomes
- inspeccionar, publicar, tirar ou alias pacotes através do registo na cadeia

## Nome do pacote {#package-names}

Identificadores de pacotes canônicos:

```text
namespace/package
```

Referências de liberação exatas:

```text
namespace/package@version
```

Não há liderança . `@` antes de um espaço de nomes. `@` O separador é reservado para o sufixo de versão.

O segmento do espaço de nome corresponde ao sufixo utilizado pelos pseudónimos dos contratos dapp Kotodama:

|Identificação do pacote |Forma do alias de contrato relacionado |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Os espaços de nome têm o formulário `<dataspace>` ou `<domain>.<dataspace>`. Quando um pacote possui um link dapp, Musubi verifica que todos os alias de contrato vinculados usam o mesmo sufixo do espaço de nomes que o pacote.

## Manifestação {#manifest}

O pacote começa com `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

As dependências podem utilizar versões exatas, requisitos de cuidado, requisitos de tilde, wildcards como `1.*`, ou listas de comparação como `>=1.0.0,<2.0.0`.

`Musubi.lock` registra o gráfico transitório selecionado do registro na cadeia. Cada nó bloqueado armazena seu pacote canônico ref, requisito selecionado, SoraFS digest manifesto, hash de arquivo fonte, contagem de bytes, conteúdo de arquivos, funções exportadas, plano determinístico de arquibo de origem e alias de dependência. Os pseudónimos curtos são resolvidos antes de entrarem no arquivo de fechamento.

## Fluxo de trabalho local {#local-workflow}

A partir da raiz do espaço de trabalho Iroha a montante, executar Musubi através do Cargo:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

Use `install --offline` para escrever um arquivo de bloqueio não resolvido para dependências de versão exata sem consultar um nó. Use `install --locked` em CI para rejeitar um arquifo de bloqueio obsoleto.

`build` liga fontes de dependência armazenadas em cache, reescrevendo chamadas como `math::add()` para nomes de funções internas deterministas Kotodama. Rejeita chamadas para funções que a dependência não exportou. As bibliotecas Musubi v1 são apenas funcionais: fontes de dependência que contêm declarações de estado, gatilhos, blocos kotoba, constantes ou outros itens de contrato não funcionais são rejeitados.

## Arquivo da fonte {#fetching-source-archives}

Musubi pode buscar fontes de dependência faltantes enquanto resolve ou posteriormente através dos subcomandos do cache:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Os receptores de gateway em directo utilizam uma ou mais especificações do fornecedor de gateway SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Os arquivos de carga útil do fornecedor e os fornecedores de gateway são mutuamente exclusivos para uma única operação de captura. Se faltarem mais de um pacote bloqueado, escopo cada fornecedor de gateway com `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` ou `manifest=<64-hex SoraFS manifest digest>`.

Porta de entrada `base-url` e `privacy-url` Os valores devem ser utilizados `https://` por padrão. gateways de teste locais podem usar `http://localhost`, `http://127.0.0.1`, ou `http://[::1]` apenas com `--gateway-allow-insecure-localhost`. Tokens de fluxo são credenciais de tempo de execução e não são escritos em `Musubi.lock`.

## Publicação {#publishing}

`pack` computa o determinista BLAKE3-256 hash do arquivo fonte mais o byte da fonte e os números de arquivos. Quando `--car-out`, `--sorafs-manifest-out`, ou `--source-plan-out` é fornecido, ele também constrói o determinista SoraFS CAR Carga útil, SoraFS Manifestação, e Musubi Plano de arquivo-fonte do mesmo conjunto de ficheiros-fonte.

Usar uma corrida seca antes da publicação:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Sem `--dry-run`, `publish` escreve artefatos padrão em `.musubi/dist/<namespace>/<name>/<version>/`, opcionalmente carrega o manifesto e a carga útil através Torii- Não , não . SoraFS ponto final do pin de armazenamento com `--upload`, regista os dados gerados SoraFS Pin, e submetem `PublishMusubiRelease` através da configuração Iroha Um cliente.

Os comunicados publicados devem incluir:

- um arquivo de fontes canônicas não vazio
- um plano de arquivo de fonte determinista
- Pelo menos uma função Kotodama exportada
- Registros de dependência que não selecionam libertações retiradas
- um link dapp, quando presente, cujos pseudónimos contratuais correspondem ao espaço de nomes do pacote

## Questões de registro e ciclo de vida {#registry-queries-and-lifecycle}

Pesquisar e inspecionar o registo com:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

O Yanking esconde uma liberação de nova resolução, mas mantém os arquivos existentes reprodutíveis:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi Evitar o nome global ao fazer `namespace/package` A publicação num espaço de nomes deve ser autorizada pelo mesmo modelo de propriedade ou de autorização delegada utilizados para esse efeito Kotodama Os pseudónimos curtos globais são separados da propriedade do pacote: `SetMusubiShortAlias` Requer o `CanSetMusubiShortAlias` Permissão, e o pacote-alvo deve já ter pelo menos uma liberação activa.

## Superfícies Iroha {#iroha-surfaces}

A Musubi utiliza instruções e consultas de primeira classe Iroha:

|Superfície .|Propósito |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Publicar um pacote imutável. |
|`YankMusubiRelease` |Marque um lançamento existente como arrastado. |
|`SetMusubiShortAlias` |Ligue um alias global curado a uma identificação de pacote. |
|`AssertMusubiReleaseExists` |Exigir uma versão concreta do pacote para existir. |
|`FindMusubiReleaseByRef` |Traz uma libertação por referência exata do pacote. |
|`FindMusubiPackageVersions` |Lista de versões para uma identificação do pacote. |
|`FindMusubiPackageReleases` |Lista de resumos de lançamento para uma identificação do pacote. |
|`SearchMusubiPackages` |Buscar resumos de pacotes por espaço de nomes e texto. |
|`FindMusubiShortAliasByName` |Resolva um alias curado.|

Torii expõe o Musubi HTTP A família de rotas `/v1/musubi/`. Em frente a um agente MCP as ferramentas são expostas como `iroha.musubi.` Alias. [Torii pontos finais](/pt/reference/torii-endpoints.md) e [Referência de consulta](/pt/reference/queries.md) para o mais amplo API O mapa.
