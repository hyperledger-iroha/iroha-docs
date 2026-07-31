---
translation_locale: pt
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transações Anônimas {#anonymous-transactions}

As transações anônimas em Iroha são construídas a partir de operações confidenciais de ativos. Em vez de escrever transferências de conta para conta públicas com valores públicos, uma carteira muda o valor para um livro-razão protegido e, em seguida, gasta notas opacas com provas de conhecimento zero.

O livro-razão público ainda registra que uma operação confidencial ocorreu. Ele registra compromissos, anulações, hashes de prova e eventos, mas não registra o proprietário da nota, destinatário ou quantia para movimento protegido a protegido. O envelope de transação normal pode ainda revelar a conta que submete, por isso "anônimo" significa aqui o movimento anónimo dos activos, e não o anonimato automático no nível da rede ou do nível da conta.

## Blocos de construção {#building-blocks}

|Conceptos|Representação do Ledger |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Nota protegida |Um registro de carteira privada contendo um ativo, montante, dados do proprietário e aleatoriedade.|
|Compromisso |Um valor público de 32 bytes que compromete-se a uma nota sem revelar seus campos. |
|Anulador |Um valor público de 32 bytes derivado quando uma nota é gasto. Iroha rejeita anuladores repetidos para evitar o duplo gasto. |
|Raiz de Merkle |Uma raiz recente da árvore de compromisso do activo.|
|Ficha de prova |Um `ProofAttachment` que contenha bytes de prova mais uma referência da chave de verificação ou a chave de verificación em linha. |
|Evento confidencial .|Um evento do livro de conta, tal como `ConfidentialEvent::Shielded`, `Transferred` ou `Unshielded`. |

As principais instruções são:

- `RegisterZkAsset`: registra um ativo como ZK-capaz e liga as chaves de verificação de transferência, escudo e não escudo.
- `Shield`: depõe um saldo público e anexa um compromisso de notas protegidas.
- `ZkTransfer`: gasta notas protegidas em novos compromissos de notas protegidas.
- `Unshield`: gasta notas protegidas e acredita um saldo da conta pública.
- `ScheduleConfidentialPolicyTransition` e `CancelConfidentialPolicyTransition`: alterar a política de confidencialidade de um ativo através da governação.

Uma definição de ativo também contém um [`AssetConfidentialPolicy`](/pt/reference/data-model-schema.md). Os controles do modo de política que controlam os fluxos são válidos:

|Modo |Que significa ?|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Só são aceitos saldos públicos normais e transferências. |
|`Convertible` |Os utilizadores podem mover o valor entre os saldos públicos e as notas protegidas. |
|`ShieldedOnly` |A emissão de activos e as transferências devem permanecer no livro-razão protegido. |

## Como usá-las {#how-to-use-them}

1. Habilitar suporte confidencial em nós validadores. Os validadores devem concordar no backend do verificador, as chaves de verificação ativas, o parâmetro Poseidon/Pedersen IDs, e a versão das regras confidenciais. Os nós rejeitam pares ou blocos com digestões confidenciais incompatíveis.
2. Publicar ou registar as chaves de verificação e os conjuntos de parâmetros utilizados pelos circuitos. As carteiras e os operadores devem referir-se às chaves em `VerifyingKeyId`, por exemplo, `halo2/ipa:vk_transfer`.
3. Registrar o activo como ZK-Capaz de `RegisterZkAsset`, ou realizar uma transição política de `TransparentOnly` para `Convertible` ou `ShieldedOnly`.
4. Proteger os fundos públicos com `Shield`. A carteira cria um compromisso de nota e carga útil criptografada para o destinatário antes de enviar a transação.
5. Transferir em privado com `ZkTransfer`. A carteira constrói uma prova de que possui as notas de entrada, que os valores de entrada e saída são equilibrados e que cada nota gastada está ancorada em uma árvore de compromisso recente.
6. Desbloquear apenas quando a política de activos o permitir. `Unshield` revela o montante público e a conta do destinatário, gasta o anulador de notas privadas e pode criar saídas de troca privadas.
7. Auditoria por meio da leitura de eventos confidenciais, registos de prova, status de anulador e registos de garantia anônimos através de consultas digitadas e endpoints Torii.

## CLI exemplos {#cli-examples}

Os comandos ZK CLI são destinados aos fluxos de operação e testes. As carteiras de produção devem gerar compromissos, cargas úteis criptografadas e provas com uma biblioteca de carteira/provador antes de enviar as instruções resultantes.

Registrar um ativo com capacidade híbrida ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construir um envelope de carga útil criptografado versão para a nota protegida:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Proteção de fundos públicos no livro-razão protegido do activo:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Desbloqueado com uma fixação de prova JSON:

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

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK {#sdk-example}

Os bytes de prova exatos vêm do backend de prova configurado. A carga útil da transação só precisa das entradas públicas e do anexo de prova:

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

## Escrow de ativos anônimos {#anonymous-asset-escrow}

O escrow de ativos anônimos usa a mesma máquina de transferência protegida para o valor depositado. As partes e o estado do escrow ainda são registrados no registro do escrow, mas as pernas de financiamento, liberação, cancelamento e resolução usam anuladores protegidos e compromissos de saída.

Para obter informações detalhadas sobre o comportamento e os exemplos do escrow ISI, ver [Native Asset Escrow](/pt/blockchain/escrow.md#anonymous-escrow).

O ciclo de vida é:

1. `OpenAnonymousAssetEscrow` gasta notas de financiamento protegidas e cria um compromisso de custódia.
2. `AcceptAnonymousAssetEscrow` registar o comprador.
3. `MarkAnonymousEscrowPaymentSent` constata que o comprador enviou um pagamento fora da cadeia.
4. O `ReleaseAnonymousAssetEscrow` gasta o compromisso de garantia para os compromissos de saída do comprador.
5. `CancelAnonymousAssetEscrow` gasta o compromisso de garantia de volta para os compromissos de saída do vendedor quando o pagamento não tiver sido marcado.
6. O `OpenAnonymousEscrowDispute` e o `ResolveAnonymousEscrowDispute` tratam de depósitos controversos com hashes de evidências e uma divisão controlada por um resolvedor.

Utilize as consultas anônimas de garantia enumeradas em [Questions](/pt/reference/queries.md#escrow-and-proof-records) para inspecionar os registos e status de garantia.

## Matemática {#math}

A notação abaixo descreve o fluxo de ativos confidenciais. As implementações usam o circuito ativo e o parâmetro IDs da política de ativos e do registro de verificadores, por isso os clientes devem tratar compromissos, anuladores e bytes de prova como saídas opacas da carteira / provador.

Uma nota de escudo pode ser descrita como:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

onde `owner` é derivado do material de visualização ou gastos do destinatário e `rho` é nota aleatoriedade.

O compromisso de nota é um compromisso oculto:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Para os circuitos de transferência confidenciais atuais, as entradas públicas incluem compromissos de notas, anuladores, uma raiz Merkle, uma etiqueta de ativo e uma etiqueta da cadeia.

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Quando uma nota é gastada, a carteira obtém um anulador:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` é público. Não revela a nota, mas é estável para essa nota e cadeia, de modo que Iroha pode rejeitar um segundo gasto com o mesmo anulador .

A árvore de compromissos prova a existência da nota. Se uma carteira gasta compromisso `C_i`, a prova inclui um caminho Merkle privado de `C_i` para uma raiz pública recente:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Para uma transferência protegida para protegida, a prova impõe também a conservação do valor:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

No caso de um produto sem escudo, o montante público é incluído:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

A prova apresentada pode ser resumida como:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

onde `public_inputs` são os compromissos, anuladores, raiz, etiqueta de ativo, etiqueta da cadeia e qualquer montante público não protegido. A testemunha contém os montantes das notas, aleatoriedade, material gasto e caminhos Merkle. Os validadores verificam a prova e, em seguida, mutam o estado do livro-razão adicionando compromissos de saída e marcando os anuladores de entrada como gastos.

## O que é público {#what-is-public}

As transacções anônimas não tornam privadas todos os fatos observáveis.

- o hash da transação, a altura do bloco e a ordem
- A autoridade de transação submetente, a menos que o pedido utilize um padrão privado de entrada ou relayer.
- A definição de ativo utilizada
- Anuladores e compromissos de saída
- hashes de prova, referências de chave de verificação e hashes opcionais de envelope
- montante público e conta do destinatário para `Unshield`
- Vendedor, comprador, status, timestamps e hashes de evidências anônimos

Projetar aplicações para que estes metadados públicos não revelem o relacionamento de negócios que você está a tentar proteger.

## Referência Relacionada {#related-reference}

- [`AssetConfidentialPolicy`](/pt/reference/data-model-schema.md)
- [`ConfidentialEvent`](/pt/reference/data-model-schema.md)
- [`ProofAttachment`](/pt/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/pt/reference/data-model-schema.md)
- [Questões de garantia e prova](/pt/reference/queries.md#escrow-and-proof-records)
