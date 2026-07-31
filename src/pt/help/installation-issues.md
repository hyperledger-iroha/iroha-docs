---
translation_locale: pt
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolução de problemas de instalação {#troubleshooting-installation-issues}

Esta seção oferece dicas de solução de problemas para a instalação do Iroha 3. Se o problema que você está experimentando não for descrito aqui, entre em contato conosco através do [Telegram](https://t.me/hyperledgeriroha).

## Verificações rápidas {#quick-checks}

A maior parte das falhas de instalação ocorrem em um dos quatro lugares:

- Uma cadeia de ferramentas Rust mais velha do que a versão fixada pelo espaço de trabalho ascendente
- `cargo` ou `rustc` de resolução em uma instalação diferente da `rustup`;
- Falta ferramentas de construção do sistema, como um compilador C, `pkg-config`, ou CMake
- Esneptos ou artefatos de construção local gerados obsoletos após mudança de revisões da fonte

A partir do checkout da fonte Iroha, comece com:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Se `cargo metadata` falhar, corrija a cadeia de ferramentas local antes de executar `pnpm refresh:iroha --source /path/to/iroha`, porque a atualização pode invocar Kagami para gerar o esquema atual do modelo de dados.

## Resolução de problemas Rust Cadeia de ferramentas {#troubleshooting-rust-toolchain}

Às vezes, as coisas não vão como planejado. Especialmente se você tinha `rust` no seu sistema há algum tempo, mas não atualizou. Um problema similar pode ocorrer em Python: XKCD tem um exemplo famoso do que isso poderia parecer:

<div class="flex justify-center">

![Python ambiente de solução de problemas comics](/img/install-troubles.png)

</div>

### Verificação da versão Rust {#check-rust-version}

No interesse de preservar tanto a sua como a nossa sanidade, certifique-se de que você tem a versão certa de `cargo` emparelhada com a versão correta de `rustc`. O espaço de trabalho upstream atual declara `rust-version = "1.92"` e pin o canal da cadeia de ferramentas em `rust-toolchain.toml`. Para mostrar as versões, fazer

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

E depois ...

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Se você tem versões mais altas, você está bem. Se você tiver versões mais baixas, você pode executar o seguinte comando para atualizar:

```bash
$ rustup toolchain update stable
```

### Verificar o local da instalação {#check-installation-location}

Se você conseguir números de versão mais baixos e você atualizar a cadeia de ferramentas e não funcionou... vamos dizer que é um problema comum, mas não tem uma solução comum.

Em primeiro lugar, você deve estabelecer onde a versão que deseja usar está instalada:

```bash
$ rustup which rustc
$ rustup which cargo
```

As instalações do usuário das cadeias de ferramentas são geralmente em `~/.rustup/toolchains/stable-*/bin/`.

```bash
$ rustup toolchain update stable
```

E isso vai resolver os teus problemas.

### Verifique a versão padrão Rust {#check-the-default-rust-version}

Outra opção é que você tem a corrente de ferramentas `stable` atualizada, mas não está definida como padrão.

```bash
$ rustup default stable
```

Isto pode acontecer se você instalou uma versão `nightly`, ou definir uma versão específica Rust, mas esqueceu-se de desinstala-la.

### Verificar se existem outras versões Rust {#check-if-there-are-other-rust-versions}

Continuando a solucionar problemas no buraco do coelho, poderíamos ter alias de conchas:

```bash
$ type rustc
$ type cargo
```

Se estes apontam para outros locais que não o que você viu ao executar `rustup which *`, então você tem um problema.

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

porque há uma lógica interna que pode romper, independentemente de como reorganizar os seus alias shell.

A solução mais simples seria remover as versões que não usam.

No entanto, é mais fácil dizer do que fazer, uma vez que implica o acompanhamento de todas as versões de rustup instaladas e disponíveis para você. A versão do gerenciador de pacotes do sistema e a que foi instalada no local padrão em sua pasta inicial quando você executou o comando no início deste tutorial. Para o primeiro, consulte seu manual de distribuição (Linux), `apt remove rust` .

```bash
$ rustup toolchain list
```

E, em seguida, para cada `<toolchain>` (sem as parênteses de ângulo claro):

```bash
$ rustup remove <toolchain>
```

Depois disso, certifique-se de que

```bash
$ cargo --help
```

resulta em um erro de comando não encontrado, ou seja, que você não tem nenhuma cadeia de ferramentas Rust ativa instalada.

```bash
$ rustup toolchain install stable
```

## Solução de problemas Python cadeia de ferramentas {#troubleshooting-python-toolchain}

Quando instalar o Python Embalagem de rodas com tubo durante [Python configuração do cliente](/pt/guide/tutorials/python.md), Você pode encontrar um erro como: "iroha_Pitão...*.Não é uma roda com suporte nesta plataforma".

Este erro significa que o pip está desatualizado, por isso você precisa atualizá-lo. Primeiro de tudo, recomenda-se verificar a sua OS para atualizações e executar uma atualização do sistema.

Se isto não funcionar, você pode tentar atualizar `pip` para o seu diretório de usuários.

`python -m pip install --upgrade pip`

Certifique-se de que `pip` está instalado no seu diretório doméstico. Para fazer isso, execute `whereis pip` e verifique se `/home/username/.local/bin/pip` está entre os caminhos. Se não, atualize a variável `PATH` do seu shell.

Se o problema persistir, por favor. [Contacte-nos .](/pt/help/) e relatar os resultados.

```
python --version
python3 --version
pip --version
pip3 --version
```
