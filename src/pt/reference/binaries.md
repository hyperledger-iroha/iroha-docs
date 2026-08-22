---
translation_locale: pt
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Trabalhando com Iroha Binários {#working-with-iroha-binaries}

O Iroha 3 o fluxo de trabalho do operador gira em torno de três binários principais:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) para executar um daemon de mesmo nível
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) para CLI e comandos do operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) para chaves, gênese, redes locais e perfis

## Construir a partir da fonte {#build-from-source}

Na raiz do espaço de trabalho upstream:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Os binários de lançamento estão então disponíveis em `target/release/`.

Para inspecionar a superfície de comando:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Execute diretamente do repositório {#run-directly-from-the-repository}

Se você não deseja instalar nada globalmente, use `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Imagem {#docker-image}

O espaço de trabalho upstream usa `kagami localnet` e `kagami docker` gerar
Docker Compose arquivos que correspondem ao código verificado.O `hyperledger/iroha:dev`
A imagem pode ser usada com esses arquivos gerados.

Execute o CLI em um contêiner:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Correr Kagami em um contêiner:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para inicialização peer, gere primeiro um arquivo localnet e Compose:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Qual binário devo usar? {#which-binary-should-i-use}

- Usar `irohad` quando você está iniciando ou operando pares.
- Usar `iroha` quando você precisar consultar o razão, enviar transações ou inspecionar os terminais do operador.
- Usar `kagami` quando você precisar de chaves, manifestos genesis, pacotes de perfis ou ativos de rede local.

## Publicação e lançamento do lançamento do Kagemusha {#kagemusha-release-publication-and-rollout}

Kagemusha V4 publicação e ativação cruzam limites protegidos separados:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` é o
  Editor somente macOS e somente root.Ele autentica o fixado Kagami binário e
  o candidato exato de dezesseis arquivos, publica o ausente
  `promotion-record-v4.norito` sem substituição e relata sucesso apenas
  após a verificação do lançamento exato promovido de dezessete arquivos.
- `iroha offline kagemusha rollout-v4 create-expectations` verifica o assinado
  reserva, quatro selos de qualificação de validador solicitados, o exato
  transferência de transação já autorizada e a âncora finalizada confiável antes
  publicar expectativas assinadas sem reposição.
- `iroha offline kagemusha rollout-v4 submit` requer explícito
  `--write-authorized` consentimento.Ele registra de forma duradoura e verifica novamente o exato
  expectativas antes de uma rede escrever ou tentar novamente.Um `Applied` estado não é
  suficiente: o comando também verifica o bloco confirmado, sucessor de finalidade
  cadeia e transferência completa de transação com autorização.
- `iroha offline kagemusha rollout-v4 finalize-receipt` coleta a mesma
  evidência ancorada em prova somente depois que o diário exato de submissão é
  verificado novamente, assina-a com o emissor independente do recibo e publica
  o recibo canônico sem substituição.

O fluxo de trabalho de preparação para produção do Kagemusha com check-in é apenas para verificação.
Não chama o editor autenticado, publica a qualificação do validador
selos, enviar uma ativação ou criar um recibo de finalização.Um fluxo de trabalho bem-sucedido
run, portanto, não prova nem promoção nem lançamento ao vivo.

Esses comandos são primitivos locais, não substitutos de evidências vivas.UM
a implementação de produção permanece bloqueada sem o App Attest físico real e
artefatos candidatos, todos os quatro selos de host protegidos, governança de tempo de execução e
assinatura de entradas, submissão ao vivo de quatro validadores e evidências de finalidade, e o
projeção canônica de configuração efetiva.Mantenha as chaves privadas,
material de autenticação e identificadores específicos da promoção em locais protegidos
custódia em tempo de execução;não os copie em documentação controlada pela fonte ou
bilhetes da operadora.
