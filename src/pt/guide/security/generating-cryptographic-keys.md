---
translation_locale: pt
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Gerando Chaves Criptográficas {#generating-cryptographic-keys}

Use `kagami keys` para gerar material de chave de cliente, par de rede e validador para Iroha 3.

## Uso Básico {#basic-usage}

Da cópia de trabalho do código-fonte Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

O diretório pai deve já existir. O destino deve ser novo ou já pertencente ao usuário atual, modo `0700`, livre de links simbólicos e vazio. `kagami` escreve `public.key` e `private.key` com modo `0600` e não imprime material de chave. Com `--pop`, ele também escreve `pop.hex`.

`--out-dir` falha de forma fechada nas plataformas em que o Kagami não consegue aplicar essas regras de sistema de arquivos exclusivas do proprietário. O arquivo de chave privada é uma exportação não criptografada, não um signatário criptográfico de hardware para produção nem um signatário não exportável. Importe-o para o perímetro de custódia aprovado e remova a exportação conforme o procedimento de implantação.

## Algoritmos {#algorithms}

Algoritmos comuns são:

- `ed25519` para contas de clientes e identidades de streaming.
- `secp256k1` quando uma conta de cliente requer uma identidade secp256k1.
- `bls_normal` para cada nó ou identidade de consenso de par de rede.

Verifique os algoritmos exatos suportados pela sua versão com:

```bash
cargo run --bin kagami -- keys --help
```

## Chaves de Desenvolvimento Determinístico {#deterministic-development-keys}

Para artefatos de teste reproduzíveis, passe uma semente de 32 bytes codificada como 64 caracteres hexadecimais. Um prefixo opcional `0x` é aceito:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

A semente é material de chave privada. Use sementes determinísticas apenas para desenvolvimento local e testes. Omitir `--seed-hex` para gerar uma chave de produção a partir da aleatoriedade do sistema operacional.

## Chaves de consenso BLS e provas de posse {#bls-consensus-keys-and-proofs-of-possession}

As identidades de consenso dos nós e pares do Iroha 3 usam chaves BLS-normal. Gere uma chave BLS-normal e uma prova de posse (PoP) com:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` é válido apenas com `bls_normal`; ele adiciona `pop.hex` ao diretório de custódia. A blockchain de gênese assinada requer um PoP correspondente para cada validador de votação. Na configuração de pares de rede, um mapa `trusted_peers_pop` não vazio seleciona o subconjunto de validadores; os pares de rede confiáveis omitidos desse mapa não vazio são observadores. Se o mapa estiver vazio, todos os pares de rede confiáveis BLS-normais entram no conjunto de candidatos a bootstrap, com o votante PoPs ainda sendo fornecido pelo blockchain genesis assinado.

## Resultado da Custódia {#custody-output}

`kagami keys` requer `--out-dir` e nunca grava material da chave privada na saída padrão. Leia `public.key`, `private.key` e opcionalmente `pop.hex` do diretório gerado. Cada arquivo contém um valor canônico seguido de uma nova linha, o que torna a automação baseada em arquivos explícita e direta:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

Para obter ajuda completa gerada Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
