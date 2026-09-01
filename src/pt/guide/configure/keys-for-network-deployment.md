---
translation_locale: pt
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Chaves para Implantação de Rede {#keys-for-network-deployment}

Toda rede precisa de material chave distinto para clientes, pares de rede, assinatura do gênesis da blockchain e, para NPoS ou perfis Nexus, identidades de validadores BLS.

## Onde as Chaves São Usadas {#where-keys-are-used}

- As chaves de assinatura do cliente são armazenadas em `client.toml` sob `[account]`.
- As chaves de identidade dos pares de rede são armazenadas em cada par de rede `config.toml` como `public_key` e `private_key`.
- a descoberta de pares de rede usa a chave pública de cada par de rede em `trusted_peers`.
- BLS provas de posse do validador são armazenadas em `trusted_peers_pop` para perfis NPoS.
- A assinatura da gênese usa o `[genesis].public_key` na configuração do par de rede e a chave privada correspondente ao assinar o manifesto.

Para implantações locais ou de teste, deixe Kagami gerar todos esses arquivos juntos:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Para uma rede ou perfil existente, use o fluxo guiado:

```bash
cargo run --bin kagami -- wizard
```

## Gerar pares de chaves individuais {#generate-individual-key-pairs}

Use `kagami keys` para material de chave independente:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

Para o material de validador BLS, inclua uma Prova de Posse:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` somente com um segredo hexadecimal exato de 32 bytes para casos de teste de desenvolvimento reproduzíveis. Para implantação em produção, omita-o para que Kagami use a aleatoriedade do sistema operacional, em seguida, mova a exportação da chave privada não criptografada para o limite de custódia aprovado. O comando nunca imprime chaves privadas.

## Consistência de par de rede {#peer-consistency}

Todos os validadores devem concordar com a mesma transação gênese da blockchain, topologia, chaves públicas de pares confiáveis da rede e validador PoPs. Uma única chave de par da rede ausente ou incompatível pode impedir que a rede seja iniciada ou atinja consenso.

Para uma implantação mínima tolerante a falhas bizantinas, use pelo menos quatro pares de rede. Cada par de rede deve ter sua própria chave privada, mas toda configuração de par de rede precisa do mesmo conjunto de pares de rede confiáveis.

## Contas de Clientes {#client-accounts}

A conta do cliente em `client.toml` já deve existir na blockchain. Ela pode ser registrada pelo manifesto técnico de gênese da blockchain ou por uma transação posterior. Evite usar a identidade de assinatura da gênese da blockchain como uma conta de aplicativo de longa duração; os privilégios da gênese da blockchain aplicam-se apenas durante a rodada de gênese da blockchain, e os clientes em produção devem usar suas próprias contas e funções.
