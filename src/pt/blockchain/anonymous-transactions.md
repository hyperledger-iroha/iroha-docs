---
translation_locale: pt
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Transações Anônimas {#anonymous-transactions}

Transações anônimas em Iroha são construídas a partir de operações de ativos confidenciais. Em vez de registrar transferências públicas de conta para conta com valores públicos, uma carteira move o valor para um livro-razão blockchain protegido e, em seguida, gasta notas opacas com provas de conhecimento zero.

O livro razão público da blockchain ainda registra que uma operação confidencial ocorreu. Ele registra compromissos, anuladores, hashes criptográficos de prova e eventos, mas não registra o proprietário da nota, o destinatário ou o valor para movimentações de protegido para protegido. O contêiner de dados de transação normal ainda pode revelar a conta que está submetendo, então "anônimo" aqui significa movimento de ativos anônimo, não anonimato automático em nível de rede ou de conta.

## Blocos de Construção {#building-blocks}

|Conceito|representação de livro-razão em blockchain|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Nota protegida|Um registro de carteira privada contendo um ativo, valor, dados do proprietário e aleatoriedade.|
|Compromisso|Um valor público de 32 bytes que se compromete com uma nota sem revelar seus campos.|
|Anulador|Um valor público de 32 bytes derivado quando uma nota é gasta. Iroha rejeita nullifiers repetidos para prevenir gasto duplo.|
|Raiz de Merkle|Uma raiz recente da árvore de compromisso do ativo. Provas a utilizam para mostrar que notas gastas existem.|
|Anexo de prova|Um `ProofAttachment` contendo bytes de prova mais uma referência à chave de verificação ou chave de verificação inline.|
|Evento confidencial|Um evento de registro em blockchain como `ConfidentialEvent::Shielded`, `Transferred` ou `Unshielded`.|

As instruções principais são:

- `RegisterZkAsset`: registra um ativo como capaz de ZK e vincula as chaves de verificação de transferência, proteção e desproteção.
- `Shield`: debita um saldo público e adiciona um compromisso de nota protegido.
- `ZkTransfer`: gasta notas protegidas em novos compromissos de notas protegidas.
- `Unshield`: gasta notas protegidas e credita um saldo de conta pública.
- `ScheduleConfidentialPolicyTransition` e `CancelConfidentialPolicyTransition`: alterar a política confidencial de um ativo por meio da governança.

Uma definição de ativo também carrega um [`AssetConfidentialPolicy`](/pt/reference/data-model-schema.md). O modo de política controla quais fluxos são válidos:

|Modo|Significado|
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` |Apenas saldos e transferências públicas normais são aceitos.|
| `Convertible`     |Os usuários podem transferir valores entre saldos públicos e notas protegidas.|
| `ShieldedOnly`    |A emissão e a transferência de ativos devem permanecer no registro blockchain protegido.|

## Como Usá-los {#how-to-use-them}

1. Habilite suporte confidencial nos nós validadores. Os validadores devem concordar com o backend do verificador, chaves de verificação ativas, IDs dos parâmetros Poseidon/Pedersen e versão das regras confidenciais. Os nós rejeitam pares de rede ou blocos com resumos criptográficos de recursos confidenciais divergentes.
2. Publique ou registre as chaves de verificação e conjuntos de parâmetros usados pelos circuitos. Carteiras e operadores devem se referir às chaves por `VerifyingKeyId`, por exemplo `halo2/ipa:vk_transfer`.
3. Registre o ativo como capaz de ZK com `RegisterZkAsset`, ou realize uma transição de política de `TransparentOnly` para `Convertible` ou `ShieldedOnly`.
4. Proteja os fundos públicos com `Shield`. A carteira cria um compromisso de nota e um payload criptografado para o destinatário antes de enviar a transação.
5. Transfira privadamente com `ZkTransfer`. A carteira cria uma prova de que possui as notas de entrada, de que os valores de entrada e saída estão equilibrados e de que cada nota gasta está ancorada em uma árvore de compromissos recente.
6. Desproteja apenas quando a política do ativo permitir. `Unshield` revela o valor público e a conta do destinatário, gasta o anulador da nota privada e pode criar saídas de troco privadas.
7. Auditoria lendo eventos confidenciais, registros de provas, status do anulador e registros de custódia anônima por meio de consultas digitadas e endpoints Torii API.

## CLI Exemplos {#cli-examples}

Os comandos ZK CLI destinam-se a fluxos de operador e testes. Carteiras de produção devem gerar compromissos, cargas criptografadas e provas com uma biblioteca de carteira/provedor antes de enviar as instruções resultantes.

Registrar um ativo capaz de hybrid ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construa um contêiner de dados de payload criptografado versionado para a nota protegida:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

O CLI prepara a política de ativos, verificando referências-chave e o contêiner de dados de notas criptografadas. Ele não expõe os subcomandos de transação `shield` ou `unshield`. Construa essas instruções com um SDK e envie-as como uma transação comum com tarifa cotada e assinada.

Um anexo de prova sem proteção tem esta forma:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON
```

## SDK Exemplo {#sdk-example}

Os bytes exatos da prova vêm do backend de prova configurado. A carga útil da transação precisa apenas das entradas públicas e do anexo da prova:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## Escrow de Ativos Anônimo {#anonymous-asset-escrow}

O escrow de ativos anônimo usa o mesmo mecanismo de transferência protegido para valor em escrow. As partes e o estado do escrow ainda são registrados no registro do escrow, mas os estágios de financiamento, liberação, cancelamento e resolução usam anuladores e compromissos de saída protegidos.

Para detalhes sobre o comportamento e exemplos de escrow ISI, consulte [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#anonymous-escrow).

O ciclo de vida é:

1. `OpenAnonymousAssetEscrow` gasta notas de financiamento protegidas e cria um compromisso de custódia.
2. `AcceptAnonymousAssetEscrow` registra o comprador.
3. `MarkAnonymousEscrowPaymentSent` registra que o comprador enviou o pagamento fora da cadeia.
4. `ReleaseAnonymousAssetEscrow` gasta o compromisso de depósito em garantia nos compromissos de saída do comprador.
5. `CancelAnonymousAssetEscrow` devolve o compromisso de caução para os compromissos de saída do vendedor quando o pagamento não foi marcado.
6. `OpenAnonymousEscrowDispute` e `ResolveAnonymousEscrowDispute` lidam com depósitos em disputa com provas de hashes criptográficos e uma divisão controlada por um resolvedor.

Use as consultas de custódia anônimas listadas em [Consultas](/pt/reference/queries.md#escrow-and-proof-records) para inspecionar registros e status de custódia.

## Matemática {#math}

A notação abaixo descreve o fluxo de ativos confidenciais. As implementações usam o circuito ativo e os IDs de parâmetros da política de ativos e do registro de verificadores, portanto os clientes devem tratar compromissos, aniquiladores e bytes de prova como saídas opacas da carteira/provedor.

Uma nota protegida pode ser descrita como:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

onde `owner` é derivado do material de visualização ou gasto do destinatário e `rho` é aleatoriedade de notas.

O compromisso da nota é um compromisso de ocultação:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Para os atuais circuitos de transferência confidenciais, as entradas públicas incluem compromissos de nota, anuladores, uma raiz de Merkle, uma etiqueta de ativo e uma etiqueta de cadeia. O circuito impõe uma relação de compromisso desta forma:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Quando uma nota é gasta, a carteira deriva um anulador:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` é público. Ele não revela a nota, mas é estável para essa nota e cadeia, então Iroha pode rejeitar um segundo gasto com o mesmo nulificador.

A árvore de compromisso prova a existência da nota. Se uma carteira gasta o compromisso `C_i`, a prova inclui um caminho Merkle privado de `C_i` até uma raiz pública recente:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Para uma transferência de protegido para protegido, a prova também garante a conservação do valor:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Para um não protegido, o valor público está incluído:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

A prova submetida pode ser resumida da seguinte forma:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

onde `public_inputs` estão os compromissos, anuladores, raiz, etiqueta de ativo, etiqueta de cadeia e qualquer valor público não protegido. A testemunha contém os valores das notas, aleatoriedade, gastar material e caminhos de Merkle. Os validadores verificam a prova e então alteram o estado do registro do blockchain adicionando compromissos de saída e marcando os anuladores de entrada como gastos.

## O Que É Público {#what-is-public}

Transações anônimas não tornam todos os fatos observáveis privados. Os seguintes dados ainda podem ser públicos:

- o hash criptográfico da transação, altura do bloco e ordenação
- o principal de autorização de envio de transação, a menos que a aplicação utilize um ponto de entrada privado ou padrão de retransmissor
- a definição de ativo que está sendo usada
- anuladores e compromissos de saída
- provas de hashes criptográficos, referências de chaves de verificação e hashes criptográficos de contêineres de dados opcionais
- valor público e conta do destinatário para `Unshield`
- vendedor de escrow anônimo, comprador, status, carimbos de data e hora e hashes criptográficos de evidência

Projete aplicativos de forma que esses metadados públicos não revelem o relacionamento comercial que você está tentando proteger.

## Referência Relacionada {#related-reference}

- [`AssetConfidentialPolicy`](/pt/reference/data-model-schema.md)
- [`ConfidentialEvent`](/pt/reference/data-model-schema.md)
- [`ProofAttachment`](/pt/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/pt/reference/data-model-schema.md)
- [Consultas de caução e prova](/pt/reference/queries.md#escrow-and-proof-records)
