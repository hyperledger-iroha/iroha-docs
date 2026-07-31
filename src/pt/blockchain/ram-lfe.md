---
translation_locale: pt
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE significa Avaliação de Função Lacônica de Máquina de Acesso Aleatório. Em Iroha, é a camada genérica de função oculta para programas cuja política pública está em cadeia, mas cuja lógica de avaliador, segredo ou entrada crua não deve ser escrita para o estado mundial. É usado por fluxos de identificadores SORA Nexus, como pesquisa de telefone privado ou e-mail, e também pode ser exposto como um auxiliar genérico de execução do programa Torii quando um perfil de nó permite as rotas voltadas para o aplicativo.

A cadeia armazena os metadados de comprometimento da política e verificação do recibo. Um resolver ou Torii runtime avalia o programa oculto, retorna apenas a saída permitida e anexa um recibo que os clientes, ferramentas de suporte ou instruções de registro podem verificar em relação à política registrada.

## Nomeamento {#naming}

A divisão dos nomes é importante:

|Termo |Que significa ?|
| --- | --- |
|`ram_lfe` |A abstração externa de funções ocultas: políticas do programa, compromissos, recibos de execução e modo de verificação de recibo. |
|`BFV` |O esquema de encriptação homórfica Brakerski/Fan-Vercauteren utilizado pelos backends de entrada criptografada RAM-LFE. |
|`ram_fhe_profile` |Metadados específicos da BFV para a máquina de execução criptografada programada. Não é um segundo nome para RAM-LFE. |

No modelo de dados, `RamLfeProgramPolicy` e `RamLfeExecutionReceipt` são tipos RAM-LFE. Parâmetros BFV, envelopes de texto cifrado e o perfil do programa oculto RAM-FHE pertencem ao backend de execução criptografada usado por uma política.

## O que é registado {#what-it-records}

A política de programa RAM-LFE é registada globalmente por `program_id`.

- a conta do proprietário que pode ativar, desativar ou alterar de outra forma a política
- O backend anunciado aos clientes
- o modo de verificação do recibo, `signed` ou `proof`;
- um compromisso com os metadados ocultos do programa e o segredo do avaliador
- a chave pública do resolver para recibos assinados
- Metadados públicos criptografados de entrada opcionais, como os parâmetros BFV e `ram_fhe_profile`
- Uma bandeira `active` que controle se a política pode emitir novos recibos

O segredo oculto, o valor do identificador de texto claro e o corpo do programa escondido não são armazenados no estado mundial. Os clientes devem tratar compromissos, hashes opacos, hashes de recibo, ciphertexts e digests de programa como valores de protocolo opacos.

## Retrospectivas {#backends}

O suporte atual RAM-LFE é centrado em três identificadores de backend:

|Backend .|Utilização |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |Avaliação vinculada ao compromisso PRF. |
|`bfv-affine-sha3-256-v1` |Avaliação secreta de afines apoiada por BFV sobre espaços criptografados para identificadores. |
|`bfv-programmed-sha3-256-v1` |Execução programada apoiada por BFV através de registros criptografados e vias de memória. |

Para políticas de identificadores, o backend programado BFV é o caminho moderno importante. Ele permite que as carteiras criptografem entradas normalizadas localmente, permite que o resolutor avaliar sem ver um identificador público na transação, e devolve um recibo que vincula o hash de saída à política do programa registrado.

## Matemática {#math}

Esta seção descreve a álgebra de nível de implementação usada pelo código RAM-LFE atual. Não é uma prova de segurança; é o modelo determinista de transcrição e avaliação criptografada que políticas, recibos e clientes devem concordar com .

### Notação {#notation}

Deixe:

- \(H(m)\) ser Iroha `Hash::new(m)`: Blake2b-32 sobre `m`, com o bit menos significativo do byte final forçado a `1`.
- \(N(x)\) é a codificação canónica Norito de `x`.
- \(a \parallel b\) significa concatenação de cadeia em byte.
- \(\operatorname{le64}(i) \) ser a codificação de 8 bytes de pequeno endia de um número inteiro não assinado.
- \(s\) ser o segredo resolvedor mantido fora do estado mundo.
- \(P\) são os parâmetros de política pública.
- \(A\) ser solicitado dados associados.
- \(x\) são bytes de entrada normalizados ou um envelope de entrada criptografado codificado por Norito, dependendo do backend.

RAM-LFE usa hashes separados por domínio. As fórmulas abaixo nomeam os domínios por finalidade; suas cadeias de byte atuais são:

|Símbolo .|Faixa de domínio |
| --- | --- |
|\(D_{\mathrm{policy}}\) |`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{secret}}\) |`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{salt}}\) |`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_opaque}}\) |`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{hkdf\_receipt}}\) |`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{opaque}}\) |`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{receipt}}\) |`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
|\(D_{\mathrm{affine\_circuit}}\) |`iroha.ram_lfe.bfv_affine.circuit.v1` |
|\(D_{\mathrm{affine\_opaque}}\) |`iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
|\(D_{\mathrm{affine\_receipt}}\) |`iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
|\(D_{\mathrm{program\_memory}}\) |`iroha.ram_lfe.bfv_program.memory.v1` |
|\(D_{\mathrm{program\_opaque}}\) |`iroha.ram_lfe.bfv_program.opaque_hash.v1` |
|\(D_{\mathrm{program\_receipt}}\) |`iroha.ram_lfe.bfv_program.receipt_hash.v1` |
|\(D_{\mathrm{program\_digest}}\) |`iroha.ram_lfe.bfv_program.digest.v1` |
|\(D_{\mathrm{output}}\) |`iroha.ram_lfe.output_hash.v1` |
|\(D_{\mathrm{id\_opaque}}\) |`iroha.ram_lfe.identifier.opaque_hash.v1` |
|\(D_{\mathrm{id\_receipt}}\) |`iroha.ram_lfe.identifier.receipt_hash.v1` |
|\(D_{\mathrm{bfv\_keygen}}\) |`iroha.crypto.fhe.bfv.keygen.v1` |
|\(D_{\mathrm{bfv\_encrypt}}\) |`iroha.crypto.fhe.bfv.encrypt.v1` |
|\(D_{\mathrm{id\_keygen}}\) |`iroha.crypto.fhe.bfv.identifier.keygen.v1` |
|\(D_{\mathrm{id\_slot}}\) |`iroha.crypto.fhe.bfv.identifier.slot.v1` |

### Compromisso político {#policy-commitment}

Um compromisso de política liga os parâmetros públicos e o segredo oculto do resolvedor a um backend.

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Então, a transcrição completa da política é codificada:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

e o hash de política publicado é:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

O `PolicyCommitment` em cadeia é:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

A avaliação recalcula o mesmo valor do segredo de tempo de execução. Se o hash recalculado for diferente, a avaliação falha com um desajuste de compromisso.

### HKDF-SHA3-512 Retorno {#hkdf-sha3-512-backend}

Para `hkdf-sha3-512-prf-v1`, a saída é a entrada normalizada em si, mas o identificador opaco e o hash de recibo são as saídas secretas PRF.

A transcrição do pedido é:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

A chave HKDF de sal e pseudorandom são:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

O material opaco é expandido e hashed:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

O material de recibo liga ainda a identificação opaca:

$$
m_r =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK},
D_{\mathrm{hkdf\_receipt}} \parallel T_{\mathrm{req}}
\parallel \mathrm{opaque\_id}, 32)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{receipt}} \parallel m_r \parallel \mathrm{opaque\_id})
$$

O backend retorna:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV Primeiro {#bfv-primer}

BFV é um esquema de criptografia homomórfica baseado em rede. "Homomorf" significa que um programa pode adicionar e multiplicar valores criptografados e, após a descriptação, obter o mesmo resultado que se tivesse executado as adições e multiplicações nos valores do texto simples.

Para RAM-LFE, o BFV é utilizado como mecanismo de entrada criptografado:

1. A carteira normaliza um valor privado, como um número de telefone ou endereço de e-mail.
2. A carteira transforma os bytes em pequenos espaços de números inteiros.
3. Cada slot é criptografado com a chave pública BFV do resolver.
4. O resolutor de tempo de execução avalia o programa oculto sobre esses textos cifrados.
5. O runtime apenas descodifica a saída do programa oculto e sinaliza ou prova um recibo.

BFV É aritmética inteira exata, não aritmética aproximada. É por isso que é mais adequado para bytes identificadores e pequenos módulos Computações do que a inferência de um modelo de ponto flutuante. Iroha É a corrente BFV Utilização, cada slot criptografado carrega um modulo de valor escalar \(t\), geralmente um byte ou um campo de extensão de byte. o próprio texto cifrado vive modulo um inteiro muito maior \(q\). A diferença entre \(q\) e \(t\) dá espaço para a descodificação do ruído que são introduzidos pela criptografia e pelas operações homomorfas.

Um texto codificado BFV possui dois componentes polinómicos:

$$
c=(c_0,c_1)
$$

A chave secreta é outro polinômio \(s_k\). A descodificação combina os componentes:

$$
v = c_0 + c_1s_k
$$

Se o texto criptográfico foi formado corretamente e o ruído ainda é pequeno o suficiente, \(v\) está perto do texto simples escalado. A rodada recupera o coeficiente de texto simples modulo \(t\).

|Operação simples |Operação de texto codificado |
| --- | --- |
|\(m+n\) |Adicionar componentes de texto criptográfico. |
|\(m+\alpha\) |Adicionar uma constante de texto simples em escala para \(c_0\). |
|\(\alpha m\) |Escala os dois componentes do texto criptográfico por \(\alpha\). |
|\(mn\) |Multiplicar os polinômios de texto cifrado, reestilar, e depois relinearizar.|

Multiplicação é a operação cara. Um produto de dois textos criptográficos de dois componentes cria naturalmente um texto criptográfico de três componentes que decodifica com \(1\), \(s_k\) e \(s_k^2\). A relinearização usa uma chave de avaliação publicada para dobrar o termo \(s_k^2\) de volta em um texto codificado normal de dois componentes. Isso mantém adições e multiplicações posteriores usando a mesma forma do texto codificado.

BFV também é "leveled": cada operação criptografada consome algum orçamento de ruído. Esta implementação não inicializa textos cifrados para atualizar esse orçamento. Em vez disso, RAM-LFE publica um pequeno `ram_fhe_profile` e aceita apenas uma forma de programa oculta limitada. Isso mantém a avaliação dentro da profundidade suportada do conjunto de parâmetros. O perfil atual programado permite uma contagem fixa de registro, contagem fixo de faixa de memória e, no máximo, uma multiplicação ciphertext-ciphertext por passo programado.

Neste projeto RAM-LFE, o BFV esconde as entradas do cliente a partir de dados dos registros públicos e de observadores que só veem a transacção ou carga útil da rota. Isso não significa que a cadeia execute programas criptografados arbitrários por si mesma. O Torii resolver ainda possui o material secreto BFV, avalia o programa oculto configurado, Decodifica a saída permitida e atesta o resultado. O livro-razão verifica, em seguida, a certificação contra o compromisso da política on-chain e resolve os metadados de chave pública ou de prova.

O caso de uso do identificador escolhe uma representação simples a propósito. Uma string normalizada é codificada como:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Cada elemento é criptografado como seu próprio BFV texto cifrado escalar. Essa forma torna a normalização e validação de envelope explícita, permite que as carteiras construam solicitações criptografadas a partir de parâmetros públicos e permite que o resolvedor canonize entradas criptografados equivalentes em uma transcrição estável de recibo.

### Modelo de anel BFV {#bfv-ring-model}

Os backends BFV utilizam o anel de polinômio negaciclo:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

e anel de texto simples:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

onde:

- \(n\) é `polynomial_degree`, uma potência de dois
- O \(q\) é o `ciphertext_modulus`
- O \(t\) é o `plaintext_modulus`
- \(q > t\) e \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Os vetores dos coeficientes de texto simples são codificados escalando cada coeficiente:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

Decriptação central-lift cada coeficiente de:

$$
v = c_0 + c_1 s_k \in R_q
$$

em seguida, redonda-o novamente para \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Aqui \(s_k\) é o polinômio de chave secreta BFV, e não o segredo do resolvedor externo RAM-LFE \(s\).

### BFV Geração chave {#bfv-key-generation}

Para as entradas de identificadores criptografados, o material chave BFV é determinista por resolução de dados secretos e associados:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

O BFV RNG é semeado como:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

As amostras do gerador chave:

- \(s_k \in \{-1,0,1\}^n\), representado por modulo \(q\)
- \(a \leftarrow R_q\) uniformemente
- \(e \in \{-1,0,1\}^n\)

A chave pública é:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Para a relinearização, deixe \(s_k^2\) ser o produto do anel em \(R_q\). Para cada dígito base-\(B\) \(j\), mostre uniformemente \(a_j\) e \(e_j\) da distribuição pequena, depois publique:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

O público BFV Os metadados da política contêm \((n,q,t,B)\), a chave pública e `max_input_bytes`. A Comissão BFV A chave secreta e a chave de relinearização permanecem no tempo de execução do resolutor.

### BFV Encriptação e operações {#bfv-encryption-and-operations}

Para encriptar um polinômio de texto simples \(m\), a implementação cria outro ChaCha20 RNG a partir:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Proveira amostras \(u,e_1,e_2 \in \{-1,0,1\}^n\) e calcula:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

O texto de cifrado é \(c=(c_0,c_1)\).

A adição homomórfica é sensível em termos de componentes:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

A adição de um escalar de texto claro \(\alpha\) ao coeficiente de mudanças zero apenas \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplicação por um escalor de texto simples \(\alpha\) escalas os dois componentes:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Para dois textos cifrados \(c=(c_0,c_1)\) e \(d=(d_0,d _1)\), a multiplicação do texto cifrado primeiro calcula um texto cipheral de três tamanhos e escala cada coeficiente para trás por \(t/q\):

$$
\tilde c_0 = \left\lfloor \frac{t(c_0 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_1 =
\left\lfloor \frac{t(c_0 d_1 + c_1 d_0)}{q} \right\rceil \bmod q
$$

$$
\tilde c_2 = \left\lfloor \frac{t(c_1 d_1)}{q} \right\rceil \bmod q
$$

Todos os produtos acima são produtos de anéis negaciclicos em \(R_q\). Depois, \(\tilde c_2\) é decomposto em polinômios base-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

e redirecionado:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

O resultado é novamente um texto encriptado BFV de dois componentes.

### Identificador Envelope de texto codificado {#identifier-ciphertext-envelope}

Uma cadeia de byte de entrada de identificador:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

é codificada em espaços escalares:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

e todos os slots restantes são zero até `max_input_bytes + 1`. Cada slot escalar é criptografado como o polinômio de texto claro coefficiente-zero \([m_i]\). A semente de criptografia por slot é:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

O envelope do identificador criptografado é:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

onde \(M=\mathrm{max\_input\_bytes}\).

### BFV Afine Backend {#bfv-affine-backend}

Para `bfv-affine-sha3-256-v1`, o tempo de execução deve derivar primeiro o material chave BFV a partir do \(s\) e do \(A\). Os parâmetros públicos derivados devem corresponder exatamente aos parâmetres públicos comprometidos na cadeia.

A semente do circuito afino é:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

A partir desta semente, as amostras de tempo de execução, modulo \(t\), um circuito afim de 32 fileiras:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

onde \(m_i\) são os espaços identificadores descifrados. Homomorfamente, ele calcula o mesmo valor sobre textos criptografados:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

O resolvedor decodifica cada \(C_j\), exige que todos os coeficientes de texto em linha reta remanescente sejam zero, converte os valores do coeficiente-zero em bytes e forma:

$$
O=(y_0,\ldots,y_{31})
$$

Então:

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{affine\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash} =
H(D_{\mathrm{affine\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_id})
$$

### BFV Programação de Backend {#bfv-programmed-backend}

Para `bfv-programmed-sha3-256-v1`, os parâmetros públicos incluem o parâmetro de encriptação do identificador BFV mais uma digestão de programa oculto:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

O perfil atual RAM-FHE é:

|Campo |Valor |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

As entradas de texto em branco enviadas para Torii são criptografadas no mesmo envelope BFV antes da execução. A semente determinista para a criptografia do lado do servidor é:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Para entrada criptografada fornecida externamente, o resolvedor descifre o envelope do identificador e recripta-o neste envelope determinista antes de executar. Essa canonização mantém os hashes de receção estáveis em textos cifrados semanticamente iguais BFV.

As linhas iniciais de memória criptografadas são derivadas de:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Para cada uma das 32 faixas, as amostras de tempo de execução \(r_j \in [0,t)\) e armazena um texto cifrado BFV criptografando \(r_j\). O programa oculto executa então registros criptografados e memória criptografada:

|Instrução |Algebra .|
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftrow \operatorname{Enc}(a)\) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), em seguida, re-linearizar |
|`SelectEqZero(dst, cond, z, nz)` |Descifrar \(R_{\mathrm{cond}}\); escolher \(R_z\) quando for zero, caso contrário \(R_{nz}\). |
|`Output(src)` |Adicionar \(R_{\mathrm{src}}\) à lista do registo de saída. |

Após a fita de instrução terminar, o resolvedor descifrar cada registro de saída, converter o coeficiente zero em um byte e concatenar esses bytes:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Os hashes genéricos de backend programados são:

$$
\mathrm{opaque\_hash} =
H(D_{\mathrm{program\_opaque}}
\parallel \mathrm{policy\_hash} \parallel O)
$$

$$
\mathrm{receipt\_hash}_{\mathrm{program}} =
H(D_{\mathrm{program\_receipt}}
\parallel \mathrm{policy\_hash} \parallel O
\parallel \mathrm{opaque\_hash})
$$

A fita de identificação programada por padrão tem 64 slots de entrada. Para cada slot \(i\), ele carrega o slot de entrada, carrega faixa de memória \(i \bmod 32\), adiciona-os e emitirá o resultado:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Hashes de saída e recibos {#output-hashes-and-receipts}

O recibo de execução genérico RAM-LFE não assina a saída bruta.

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Para os recibos de execução Torii RAM-LFE, os dados associados são os bytes canônicos do identificador de programa:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

A carga útil do recibo assinado é:

$$
R =
(\mathrm{program\_id},
\mathrm{program\_digest},
\mathrm{backend},
\mathrm{verification\_mode},
\mathrm{output\_hash},
\mathrm{associated\_data\_hash},
\mathrm{executed\_at\_ms},
\mathrm{expires\_at\_ms})
$$

Para o modo `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

A verificação verifica a assinatura com `resolver_public_key` e rejeita o recibo, salvo que todas essas equivalências contenham:

$$
R.\mathrm{program\_id} = \mathrm{policy.program\_id}
$$

$$
R.\mathrm{backend} = \mathrm{policy.backend}
$$

$$
R.\mathrm{verification\_mode} = \mathrm{policy.verification\_mode}
$$

$$
R.\mathrm{program\_digest} =
\mathrm{policy.public\_parameters.hidden\_program\_digest}
$$

$$
R.\mathrm{associated\_data\_hash} =
H(N(\mathrm{policy.program\_id}))
$$

Se o solicitante fornecer `output_hex`, o verificador verifica também:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

Para o modo `proof`, a certificação carrega um envelope de prova em vez de uma assinatura. A verificação verifica que o backend da prova, o id do circuito, o hash do esquema de entrada pública, o hash da chave de verificação e as instâncias públicas expostas correspondem aos metadados do verificador de prova e ao hash codificado do recibo-carga útil.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

As instâncias públicas previstas são quatro colunas de um elemento. A coluna \(j\) contém bytes \(h_{8j}\ldots h_{8j+7}\) seguidas por 24 bytes zero:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Projeção de identificador {#identifier-projection}

A resolução do identificador não usa o backend genérico `opaque_hash` como o identificador de conta opaca para o usuário. Projeta o hash de saída RAM-LFE através de domínios específicos do identificador:

$$
\mathrm{opaque\_id}_{\mathrm{id}} =
H(D_{\mathrm{id\_opaque}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash})
$$

$$
\mathrm{receipt\_hash}_{\mathrm{id}} =
H(D_{\mathrm{id\_receipt}}
\parallel N(\mathrm{program\_id})
\parallel \mathrm{output\_hash}
\parallel \mathrm{opaque\_id}_{\mathrm{id}})
$$

Um `IdentifierResolutionReceipt` assina uma carga útil de nível mais elevado:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Para os recibos de identificação assinados:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

O `ClaimIdentifier` aceita o recibo somente quando a assinatura ou a prova é válida, a carga útil de execução embutida RAM-LFE corresponde à política do programa referida e os `uaid` e `account_id` são os elementos vinculativos que se pretendem.

## Fluxo de Execução {#execution-flow}

Uma execução genérica RAM-LFE segue a seguinte forma:

1. Registros de governança ou de operador `RamLfeProgramPolicy`.
2. O proprietário activa a apólice.
3. O cliente lê os metadados da política pública de Torii.
4. O cliente submete exatamente um formulário de entrada ao resolver: texto simples `input_hex` ou um envelope de entrada criptografado BFV.
5. O tempo de execução avalia o programa oculto e retorna `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` e um `RamLfeExecutionReceipt`.
6. O cliente ou o backend verifica o recibo com base na política publicada, verificando opcionalmente que o `output_hex` devolvido hash para o `output_hash` do recebimento.
7. Uma instrução de nível superior, como `ClaimIdentifier`, pode incorporar o recibo atestado em vez de incorporar a entrada bruta.

```mermaid
flowchart LR
    client["Wallet or application"] --> policy["Read program policy"]
    policy --> input["Normalize and optionally encrypt input"]
    input --> torii["Torii RAM-LFE runtime"]
    torii --> eval["Hidden evaluator"]
    eval --> receipt["Output and execution receipt"]
    receipt --> verify["Client or ledger verifies receipt"]
    verify --> claim["Use receipt in higher-level flow"]
```

## Políticas de identificação {#identifier-policies}

As políticas de identificação são um uso concreto do RAM-LFE. Eles adicionam um espaço de nome comercial e uma regra de normalização em cima de uma política genérica do programa:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "<POLICY_OWNER>",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "phone#team",
  owner = "<POLICY_OWNER>",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "phone#team")
```

A camada de identificação utiliza o recibo RAM-LFE para ligar:

- `policy_id`
- O identificador opaco derivado da função oculta
- a determinação `receipt_hash`
- a conta UAID
- O canónico `account_id`
- a carga útil de execução genérica RAM-LFE

Para a incorporação orientada para o usuário, mantenha os pseudónimos de conta separados dos identificadores privados. Os pseudônimos são nomes públicos; números de telefone, endereços de e-mail e valores similares devem fluir através das políticas de identificação e recibos.

## Roteiras Torii {#torii-routes}

Quando a família de rotas orientada para aplicativos estiver ativada, Torii expõe RAM-LFE e auxiliares identificadores:

|Rota .|Propósito |
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Lista das políticas de programa ativas e inativas RAM-LFE e dos metadados de execução pública. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |Executa um programa a partir de `input_hex` ou `encrypted_input` e retorna hashes de saída mais um recibo sem estado. |
|`POST /v1/ram-lfe/receipts/verify` |Verificar uma `RamLfeExecutionReceipt` em relação à política publicada e, opcionalmente, comparar `output_hex` a `output_hash`. |
|`GET /v1/identifier-policies` |Lista de políticas de identificador, modos de normalização, chaves resolvedoras e metadados de entrada criptografados. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Emitir o recibo que um utilizador pode inserir em `ClaimIdentifier`. |
|`POST /v1/identifiers/resolve` |Resolver uma entrada normalizada de identificador para a conta vinculada quando existe um crédito ativo. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Procure uma reclamação persistente de identificador por hash de recibo para ferramentas de auditoria e suporte. |

Verifique sempre o documento `/openapi` ou `/openapi.json` do nó-alvo antes de construir contra essas rotas. A disponibilidade depende da construção do nó e do perfil da rede.

## Tempo de execução do nó {#node-runtime}

Torii Está em processo . RAM-LFE O tempo de execução é configurado em `torii.ram_lfe.programs[*]`, teclado por `program_id`. Cada programa configurado deve corresponder ao compromisso da política on-chain e deve fornecer o material de execução necessário para avaliar e As rotas de identificação reutilizam este mesmo tempo de execução; não exigem uma superfície de configuração separada do identificador-resolvente.

O registro de uma política na cadeia não é suficiente por si só. Um nó-alvo também deve expor a família de rotas e ter material correspondente para o tempo de execução dos programas que ele espera executar.

## Relhas de guarda operacional {#operational-guardrails}

- Registre as políticas inativas, verifique os metadados públicos, e depois ative-os.
- Mantenha escondidos os segredos do avaliador, as chaves de assinatura do resolutor e o material secreto BFV fora dos documentos, registros, transações e pacotes de clientes.
- Não coloque identificadores brutos em pseudónimos de conta, metadados de transação, eventos ou campos de estado mundial.
- Verificar os recibos da parte do cliente antes de enviar instruções de nível superior quando o SDK expõe um verificador.
- Use campos de expiração em que os recibos obsoletos não devem permanecer válidos para sempre.
- Rotear registrando um novo programa ou política de identificação, migrar clientes e desativar a velha política assim que novos recibos estão fluindo.

## Tópicos relacionados {#related-topics}

- [Taxas de patrocínio para um espaço de dados privado](/pt/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Pontos finais](/pt/reference/torii-endpoints.md#app-and-sora-route-families)
- [Transações Anónimas](/pt/blockchain/anonymous-transactions.md)
