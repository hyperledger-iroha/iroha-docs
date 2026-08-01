---
translation_locale: pt
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Geração de chaves criptográficas {#generating-cryptographic-keys}

Utilize `kagami keys` para gerar o material de chave do cliente, do peer e do validador para Iroha 3.

## Utilização básica {#basic-usage}

A partir de uma cópia do código-fonte do Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

A saída JSON é geralmente mais fácil de copiar para a TOML ou automatizar:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

O comando imprime uma chave pública e uma chave privada exposta. Trate a chave privada como material secreto; não adicione ao repositório as chaves de produção geradas.

Para uma exportação local segura ou transferência para custódia em uma plataforma Unix compatível, grave um novo par de chaves em um diretório vazio acessível apenas pelo proprietário, em vez de imprimir a chave privada:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

O diretório pai já deve existir. O diretório de destino deve ser novo ou já pertencer ao usuário atual, ter o modo `0700`, não conter links simbólicos e estar vazio. `kagami` grava `public.key` e `private.key` com o modo `0600` e não imprime a chave privada. Com `--pop`, também grava `pop.hex`.

`--out-dir` falha de modo seguro nas plataformas em que o Kagami não consegue aplicar essas regras do sistema de arquivos que limitam o acesso ao proprietário. O arquivo de chave privada é uma exportação não criptografada, e não um signatário de produção respaldado por hardware ou não exportável. Importe-o para o limite de custódia aprovado e remova a exportação de acordo com o procedimento de implantação.

## Algoritmos {#algorithms}

Algoritmos comuns são:

- `ed25519` para contas de clientes e identidades de streaming.
- `secp256k1` quando uma conta de cliente requer uma identidade secp256k1.
- `bls_normal` para a identidade de consenso de cada nó ou par quando a compilação habilitar o suporte a BLS.

Verifique os algoritmos exatos suportados pela sua compilação com:

```bash
cargo run --bin kagami -- keys --help
```

## Chaves de Desenvolvimento Determinista {#deterministic-development-keys}

Para fixtures reproduzíveis, forneça uma semente de 32 bytes codificada como 64 caracteres hexadecimais. Um prefixo `0x` opcional é aceito:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

A semente é material de chave privada. Use sementes deterministas apenas para desenvolvimento local e testes. Omita `--seed-hex` para gerar uma chave de produção a partir da aleatoriedade do sistema operacional.

## Chaves de consenso BLS e provas de posse {#bls-consensus-keys-and-proofs-of-possession}

As identidades de consenso dos nós e pares do Iroha 3 usam chaves BLS normais. Gere uma chave BLS normal e uma prova de posse (PoP) com:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` é válido apenas com `bls_normal`. A saída JSON inclui `pop_hex`. A gênese assinada exige uma PoP correspondente para cada validador com direito a voto. Na configuração de pares, um mapa `trusted_peers_pop` não vazio seleciona o subconjunto de validadores; os pares confiáveis omitidos desse mapa não vazio são observadores. Se o mapa estiver vazio, todos os pares confiáveis com chaves BLS normais entram no conjunto inicial de candidatos, e as PoPs dos validadores com voto continuam sendo fornecidas pela gênese assinada.

## Formatos de saída {#output-formats}

Usar a saída padrão para a inspeção do terminal, `--json` para automação e `--compact` quando outro script precisar de valores orientados em linha simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Para a ajuda Kagami gerada na totalidade:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
