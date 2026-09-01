---
translation_locale: pt
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de Problemas na Instalação {#troubleshooting-installation-issues}

Esta seção oferece dicas de solução de problemas para a instalação de Iroha 3. Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## Verificações rápidas {#quick-checks}

A maioria das falhas de instalação vem de um dos quatro lugares:

- uma cadeia de ferramentas Rust mais antiga do que a versão fixada pelo workspace upstream
- `cargo` ou `rustc` resolvendo para uma instalação diferente de `rustup`
- ferramentas de compilação do sistema ausentes, como um compilador C, `pkg-config` ou CMake
- trechos gerados obsoletos ou artefatos de compilação local após alterar as revisões do código-fonte

A partir da cópia de trabalho do código-fonte Iroha, comece com:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Se `cargo metadata` falhar, corrija a cadeia de ferramentas local antes de executar `pnpm refresh:iroha --source /path/to/iroha`, porque a atualização pode invocar Kagami para gerar o esquema do modelo de dados atual.

## Solução de problemas Rust Toolchain {#troubleshooting-rust-toolchain}

Às vezes, as coisas não saem como planejado. Especialmente se você teve `rust` no seu sistema há algum tempo, mas não atualizou. Um problema semelhante pode ocorrer em Python: XKCD tem um exemplo famoso de como isso poderia ser:

<div class="flex justify-center">

![Python história em quadrinhos de solução de problemas de ambiente](/img/install-troubles.png)

</div>

### Verifique a versão Rust {#check-rust-version}

No interesse de preservar tanto a sua sanidade quanto a nossa, certifique-se de que você tem a versão correta de `cargo` combinada com a versão correta de `rustc`. O workspace upstream atual declara `rust-version = "1.92"` e fixa o canal da ferramenta em `rust-toolchain.toml`. Para mostrar as versões, faça

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

e então

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Se você tiver versões mais altas, está tudo bem. Se você tiver versões mais baixas, pode executar o seguinte comando para atualizá-la:

```bash
$ rustup toolchain update stable
```

### Verificar local de instalação {#check-installation-location}

Se você obtiver números de versão mais baixos e atualizou o conjunto de ferramentas e isso não funcionou... digamos apenas que é um problema comum, mas não tem uma solução comum.

Primeiramente, você deve determinar onde a versão que deseja usar está instalada:

```bash
$ rustup which rustc
$ rustup which cargo
```

As instalações do usuário das toolchains geralmente estão em `~/.rustup/toolchains/stable-*/bin/`. Se for esse o caso, você deve conseguir executar

```bash
$ rustup toolchain update stable
```

e isso deve resolver seus problemas.

### Verifique a versão padrão Rust {#check-the-default-rust-version}

Outra opção é que você tenha o conjunto de ferramentas `stable` atualizado, mas ele não está definido como padrão. Execute:

```bash
$ rustup default stable
```

Instalar uma versão `nightly` ou definir uma versão específica Rust sem depois desfazê-la pode causar esse problema.

### Verifique se existem outras versões Rust {#check-if-there-are-other-rust-versions}

Continuando pelo buraco do coelho da solução de problemas, poderíamos ter aliases de shell:

```bash
$ type rustc
$ type cargo
```

Se estes apontarem para locais diferentes daquele que você viu ao executar `rustup which *`, então você tem um problema. Note que adicionar aliases como estes não é suficiente:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

A lógica interna ainda pode quebrar independentemente de como você organiza seus aliases de shell.

A solução mais simples seria remover as versões que você não usa.

É mais fácil falar do que fazer, no entanto, já que isso envolve rastrear todas as versões de rustup instaladas e disponíveis para você. Normalmente, existem apenas duas: a versão do gerenciador de pacotes do sistema e aquela que foi instalada no local padrão na sua pasta home quando você executou o comando no início deste tutorial. Para a primeira, consulte o manual da sua distribuição (Linux), (`apt remove rust`). Para a segunda, execute:

```bash
$ rustup toolchain list
```

E então, para cada `<toolchain>` (sem os colchetes angulares, é claro):

```bash
$ rustup remove <toolchain>
```

Após remover as toolchains, este comando deve informar um erro de comando não encontrado:

```bash
$ cargo --help
```

Esse erro confirma que nenhuma toolchain Rust ativa permanece instalada. Então execute:

```bash
$ rustup toolchain install stable
```

## Solução de problemas da cadeia de ferramentas Python {#troubleshooting-python-toolchain}

Quando você instala o pacote Python Wheel usando pip durante [Python configuração do cliente](/pt/guide/tutorials/python.md), você pode encontrar um erro como: "iroha_python-*.whl não é um wheel compatível com esta plataforma".

Este erro significa que o pip está desatualizado, então você precisa atualizá-lo. Primeiro de tudo, é recomendado verificar seu OS por atualizações e realizar uma atualização do sistema.

Se isso não funcionar, você pode tentar atualizar `pip` para o seu diretório de usuário.

`python -m pip install --upgrade pip`

Certifique-se de que `pip` esteja instalado no seu diretório pessoal. Para fazer isso, execute `whereis pip` e verifique se `/home/username/.local/bin/pip` está entre os caminhos. Caso contrário, atualize a variável `PATH` do seu shell.

Se o problema persistir, por favor [contate-nos](/pt/help/) e reporte os resultados.

```
python --version
python3 --version
pip --version
pip3 --version
```
