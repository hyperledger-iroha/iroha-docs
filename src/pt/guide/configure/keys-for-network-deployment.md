---
translation_locale: pt
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Chaves para a implantação da rede {#keys-for-network-deployment}

Cada rede precisa de material-chave distinto para clientes, pares, assinatura da gênese e, para perfis NPoS ou Nexus, identidades de validador de BLS.

## Onde as chaves são usadas {#where-keys-are-used}

- As chaves de assinatura do cliente são armazenadas em `client.toml` sob `[account]`.
- As chaves de identidade de pares são armazenadas em cada igual `config.toml` como `public_key` e `private_key`.
- A peer discovery utiliza a chave pública de cada peer em `trusted_peers`.
- Validador BLS As provas de posse são armazenadas em `trusted_peers_pop` para perfis de NPoS.
- A assinatura da Gênesis utiliza a `[genesis].public_key` em configuração de pares e a chave privada correspondente ao assinar o manifesto.

Para implementações locais ou de teste, deixe Kagami gerar todos estes arquivos juntos:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Para uma rede ou perfil existente, use o fluxo guiado:

```bash
cargo run --bin kagami -- wizard
```

## Gerar pares de chaves individuais {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Consistência entre pares {#peer-consistency}

Todos os validadores devem concordar na mesma transação de gênese, topologia, chaves públicas confiáveis e validador PoPs. Uma única chave perdida ou incomparável pode impedir a rede de iniciar ou alcançar consenso.

Para uma implantação mínima tolerante às falhas bizantinas, use pelo menos quatro pares. Cada pares deve ter sua própria chave privada, mas cada configuração de pares precisa do mesmo conjunto de pares confiável.

## Contas de clientes {#client-accounts}

A conta do cliente em `client.toml` deve já existir na cadeia. Pode ser registrada pelo manifesto genético ou por uma transação posterior. Evite usar a identidade de assinatura genética como uma conta de aplicação de longa duração; Os privilégios da Gênesis só se aplicam durante a rodada da Gênese, e os clientes de produção devem utilizar as suas próprias contas e papéis.
