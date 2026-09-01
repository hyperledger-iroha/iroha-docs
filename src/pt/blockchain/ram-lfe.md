---
translation_locale: pt
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE significa Avaliação de Função Lacônica de Máquina de Acesso Aleatório. Em Iroha, é a camada genérica de função oculta para programas cuja política pública está na blockchain, mas cuja lógica do avaliador, segredo ou entrada bruta não deve ser escrita no estado mundial. Ele é usado por fluxos de identificador SORA Nexus, como consulta de telefone ou e-mail privados, e também pode ser exposto como um assistente genérico de execução de programa Torii quando um perfil de nó habilita as rotas voltadas para o aplicativo.

A cadeia armazena o compromisso da política e os metadados de verificação do recibo. Um resolvedor ou ambiente de execução Torii avalia o programa oculto, retorna apenas a saída permitida e anexa um recibo que clientes, ferramentas de suporte ou instruções do livro-razão da blockchain podem verificar em relação à política registrada.

## Nomeação {#naming}

A divisão de nomenclatura importa:

|Termo|Significado|
| --- | --- |
| `ram_lfe` |A abstração de função oculta externa: políticas do programa, compromissos, recibos de execução e modo de verificação de recibos.|
| `BFV` |O esquema de criptografia homomórfica Brakerski/Fan-Vercauteren usado pelos backends de entrada criptografada RAM-LFE.|
| `ram_fhe_profile` |Metadados específicos de BFV para a máquina de execução criptografada programada. Não é um segundo nome para RAM-LFE.|

No modelo de dados, `RamLfeProgramPolicy` e `RamLfeExecutionReceipt` são tipos RAM-LFE. Parâmetros BFV, contêineres de dados cifrados e o perfil de programa oculto RAM-FHE pertencem ao backend de execução criptografada usado por uma política.

## O Que Ele Registra {#what-it-records}

Uma política de programa RAM-LFE é registrada globalmente por `program_id`. A política contém:

- a conta do proprietário que pode ativar, desativar ou de outra forma modificar a política
- o backend anunciado para os clientes
- o modo de verificação do recibo, seja `signed` ou `proof`
- um compromisso com os metadados do programa oculto e o segredo do avaliador
- a chave pública do resolvedor para registros de resultados de protocolo assinados
- metadados opcionais de entrada criptografada pública, como parâmetros BFV e `ram_fhe_profile`
- uma bandeira `active` que controla se a política pode emitir novos registros de resultado de protocolo

O segredo oculto, o valor do identificador em texto simples e o corpo do programa oculto não são armazenados no estado mundial. Os clientes devem tratar compromissos, hashes opacos, hashes de recibos, textos cifrados e resumos do programa como valores opacos do protocolo.

## Backends {#backends}

O suporte atual RAM-LFE está centrado em três identificadores de backend:

|Backend| Usar |
| --- | --- |
| `hkdf-sha3-512-prf-v1` |Avaliação vinculada ao compromisso PRF.|
| `bfv-affine-sha3-256-v1` |BFV-apoiada avaliação afim secreta sobre slots de identificador criptografados.|
| `bfv-programmed-sha3-256-v1` |BFV-executou a execução programada sobre registradores criptografados e pistas de execução de memória.|

Para políticas de identificador, o backend programado BFV é o caminho moderno importante. Ele permite que as carteiras criptografem a entrada normalizada localmente, permite que o resolvedor avalie sem ver um identificador público na transação, e retorna um recibo que vincula o hash de saída à política do programa registrada.

## Matemática {#math}

Esta seção descreve a álgebra em nível de implementação usada pelo código atual RAM-LFE. Não é uma prova de segurança; é a transcrição determinística e o modelo de avaliação criptografada com os quais políticas, recibos e clientes devem concordar.

### Notação {#notation}

Vamos supor:

- \(H(m)\) ser Iroha `Hash::new(m)`: Blake2b-32 sobre `m`, com o bit menos significativo do byte final forçado a `1`.
- \(N(x)\) seja a codificação canônica Norito de `x`.
- \(a \parallel b\) significa concatenação de strings de bytes.
- \(\operatorname{le64}(i)\) seja a codificação little-endian de 8 bytes de um número inteiro sem sinal.
- \(s\) seja o segredo do resolvedor mantido fora do estado mundial.
- \(P\) seja parâmetros de política pública.
- \(A\) ser solicitado dados associados.
- \(x\) podem ser bytes de entrada normalizados ou um contêiner de dados de entrada criptografados codificado em Norito, dependendo do backend.

RAM-LFE usa hashes separados por domínio. As fórmulas abaixo nomeiam os domínios por finalidade; suas strings de bytes atuais são:

|Símbolo|String de domínio|
| --- | --- |
| \(D_{\mathrm{policy}}\) | `iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{secret}}\) | `iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{salt}}\) | `iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_opaque}}\) | `iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{hkdf\_receipt}}\) | `iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{opaque}}\) | `iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{receipt}}\) | `iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1` |
| \(D_{\mathrm{affine\_circuit}}\) | `iroha.ram_lfe.bfv_affine.circuit.v1` |
| \(D_{\mathrm{affine\_opaque}}\) | `iroha.ram_lfe.bfv_affine.opaque_hash.v1` |
| \(D_{\mathrm{affine\_receipt}}\) | `iroha.ram_lfe.bfv_affine.receipt_hash.v1` |
| \(D_{\mathrm{program\_memory}}\) | `iroha.ram_lfe.bfv_program.memory.v1` |
| \(D_{\mathrm{program\_opaque}}\) | `iroha.ram_lfe.bfv_program.opaque_hash.v1` |
| \(D_{\mathrm{program\_receipt}}\) | `iroha.ram_lfe.bfv_program.receipt_hash.v1` |
| \(D_{\mathrm{program\_digest}}\) | `iroha.ram_lfe.bfv_program.digest.v1` |
| \(D_{\mathrm{output}}\) | `iroha.ram_lfe.output_hash.v1` |
| \(D_{\mathrm{id\_opaque}}\) | `iroha.ram_lfe.identifier.opaque_hash.v1` |
| \(D_{\mathrm{id\_receipt}}\) | `iroha.ram_lfe.identifier.receipt_hash.v1` |
| \(D_{\mathrm{bfv\_keygen}}\) | `iroha.crypto.fhe.bfv.keygen.v1` |
| \(D_{\mathrm{bfv\_encrypt}}\) | `iroha.crypto.fhe.bfv.encrypt.v1` |
| \(D_{\mathrm{id\_keygen}}\) | `iroha.crypto.fhe.bfv.identifier.keygen.v1` |
| \(D_{\mathrm{id\_slot}}\) | `iroha.crypto.fhe.bfv.identifier.slot.v1` |

### Compromisso com a Política {#policy-commitment}

Um compromisso de política vincula os parâmetros públicos e o segredo oculto do resolvedor a um backend. Primeiro, o segredo é comprometido separadamente:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Então a transcrição completa da política é codificada:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

e o hash da política publicada é:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

O `PolicyCommitment` on-chain é:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

A avaliação recalcula o mesmo valor a partir do segredo do ambiente de execução. Se o hash recalculado for diferente, a avaliação falha por incompatibilidade do compromisso.

### Motor HKDF-SHA3-512 {#hkdf-sha3-512-backend}

Para `hkdf-sha3-512-prf-v1`, a saída é a própria entrada normalizada, mas o identificador opaco e o hash do recibo são saídas vinculadas ao segredo da PRF.

A transcrição da solicitação é:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

O sal HKDF e a chave pseudorrandômica são:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

Material opaco é expandido e hash:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

O material do recibo também vincula o ID opaco:

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

### Introdução ao BFV {#bfv-primer}

BFV é um esquema de criptografia homomórfica baseado em treliça. "Homomórfico" significa que um programa pode somar e multiplicar valores criptografados e, após a descriptografia, obter o mesmo resultado como se tivesse realizado as somas e multiplicações nos valores em texto simples.

Para RAM-LFE, BFV é usado como um mecanismo de entrada criptografada:

1. Uma carteira normaliza um valor privado, como um número de telefone ou endereço de e-mail.
2. A carteira transforma os bytes em pequenos espaços inteiros.
3. Cada slot é criptografado com a chave pública BFV do resolvedor.
4. O ambiente de execução do resolvedor avalia o programa oculto sobre esses textos cifrados.
5. O ambiente de execução descriptografa somente a saída do programa oculto e assina ou prova um recibo.

BFV é aritmética inteira exata, não aritmética aproximada. É por isso que é mais adequado para identificar bytes e pequenas computações modulares do que para inferência de modelo em ponto flutuante. No uso atual de BFV de Iroha, cada slot criptografado carrega um valor escalar módulo \(t\), geralmente um byte ou um campo de comprimento de byte. O próprio texto criptografado vive módulo um inteiro muito maior \(q\). A diferença entre \(q\) e \(t\) dá espaço de descriptografia para o ruído que a criptografia e as operações homomórficas introduzem.

Uma cifra BFV possui dois componentes polinomiais:

$$
c=(c_0,c_1)
$$

A chave secreta é outro polinômio \(s_k\). A descriptografia combina os componentes:

$$
v = c_0 + c_1s_k
$$

Se o texto cifrado foi formado corretamente e o ruído ainda é pequeno o suficiente, \(v\) está próximo do texto plano escalonado. O arredondamento recupera o coeficiente do texto plano módulo \(t\). A propriedade útil é que as operações com o texto cifrado preservam essa estrutura:

|Operação simples|Operação de texto cifrado|
| --- | --- |
| \(m+n\) |Adicionar componentes de texto cifrado.|
| \(m+\alpha\) |Adicione uma constante de texto simples escalonada em \(c_0\).|
| \(\alpha m\) |Escale ambos os componentes do texto cifrado por \(\alpha\).|
| \(mn\) |Multiplique os polinômios de texto cifrado, reescalone e depois relinearize.|

A multiplicação é a operação cara. Um produto de dois cifrados de dois componentes naturalmente cria um cifrado de três componentes que decifra com \(1\), \(s_k\) e \(s_k^2\). A relinearização usa uma chave de avaliação publicada para dobrar o termo \(s_k^2\) de volta em um texto cifrado normal de dois componentes. Isso mantém adições e multiplicações posteriores usando a mesma forma de texto cifrado.

BFV também é "nivelado": toda operação criptografada consome algum orçamento de ruído. Esta implementação não realiza o bootstrap dos textos cifrados para renovar esse orçamento. Em vez disso, RAM-LFE publica um pequeno `ram_fhe_profile` e aceita apenas uma forma de programa oculto limitada. Isso mantém a avaliação dentro da profundidade suportada pelo conjunto de parâmetros. O perfil programado atual permite um número fixo de registradores, um número fixo de canais de memória e, no máximo, uma multiplicação de texto criptografado por texto criptografado por etapa programada.

Nesta concepção de RAM-LFE, BFV oculta a entrada do cliente dos dados públicos da cadeia e dos observadores que veem apenas a transação ou a carga útil da rota. Isso não significa que a cadeia execute por conta própria programas criptografados arbitrários. O ambiente de execução do resolvedor Torii continua a deter o material secreto BFV, avalia o programa oculto configurado, decifra a saída permitida e atesta o resultado. O registro distribuído verifica então a atestação em relação ao compromisso de política na cadeia e à chave pública do resolvedor ou aos metadados da prova.

O caso de uso do identificador escolhe uma representação simples de propósito. Uma string normalizada é codificada como:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Cada elemento é criptografado como seu próprio texto cifrado escalar BFV. Essa forma torna explícitas a normalização e a validação do contêiner de dados, permite que carteiras construam solicitações criptografadas a partir de parâmetros públicos e permite que o resolvedor normalize entradas criptografadas equivalentes em uma transcrição estável do registro de resultados do protocolo.

### BFV Modelo de Anel {#bfv-ring-model}

Os backends BFV utilizam o anel polinomial negaciclico:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

e anel de texto simples:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

onde:

- \(n\) é `polynomial_degree`, uma potência de dois
- \(q\) é `ciphertext_modulus`
- \(t\) é `plaintext_modulus`
- \(q > t\) e \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Os vetores de coeficientes em texto simples são codificados escalando cada coeficiente:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

O centro de descriptografia eleva cada coeficiente de:

$$
v = c_0 + c_1 s_k \in R_q
$$

então arredonda de volta para \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Aqui \(s_k\) está o polinômio da chave secreta BFV, não o segredo do resolvedor externo RAM-LFE \(s\).

### BFV Geração de Chave {#bfv-key-generation}

Para entrada de identificador criptografado, o material da chave BFV é determinístico por segredo do resolvedor e dados associados:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

O BFV RNG é semeado como:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Exemplos do gerador de chaves:

- \(s_k \in \{-1,0,1\}^n\), representado módulo \(q\)
- \(a \leftarrow R_q\) uniformemente
- \(e \in \{-1,0,1\}^n\)

A chave pública é:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Para a relinearização, seja \(s_k^2\) o produto de anel em \(R_q\). Para cada dígito na base \(B\) \(j\), amostre \(a_j\) uniformemente e \(e_j\) da pequena distribuição, então publique:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Os metadados da política pública BFV contêm \((n,q,t,B)\), a chave pública, e `max_input_bytes`. A chave secreta BFV e a chave de relinearização permanecem no ambiente de execução resolvedor.

### BFV Criptografia e Operações {#bfv-encryption-and-operations}

Para criptografar um polinômio em texto simples \(m\), a implementação gera outra ChaCha20 RNG a partir de:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Ele amostra \(u,e_1,e_2 \in \{-1,0,1\}^n\) e calcula:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

O texto cifrado é \(c=(c_0,c_1)\).

A adição homomórfica é componente por componente:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Adicionar um escalar em texto simples \(\alpha\) ao coeficiente zero altera apenas \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplicar por um escalar em texto simples \(\alpha\) escala ambos os componentes:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Para dois textos cifrados \(c=(c_0,c_1)\) e \(d=(d_0,d_1)\), a multiplicação de textos cifrados primeiro calcula um texto cifrado de tamanho três e reescala cada coeficiente por \(t/q\):

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

Todos os produtos acima são produtos de anel negaciclico em \(R_q\). Então \(\tilde c_2\) é decomposto em polinômios de base-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

e relinearizado:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

O resultado é novamente um texto cifrado BFV de dois componentes.

### Contêiner de dados de texto cifrado de identificador {#identifier-ciphertext-envelope}

Uma string de bytes de entrada do identificador:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

é codificado em slots escalares:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

e todos os slots restantes são zero até `max_input_bytes + 1`. Cada slot escalar é criptografado como o polinômio de texto simples coeficiente-zero \([m_i]\). A semente de criptografia por slot é:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

O contêiner de dados de identificador criptografado é:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

onde \(M=\mathrm{max\_input\_bytes}\).

### BFV Backend Afine {#bfv-affine-backend}

Para `bfv-affine-sha3-256-v1`, o ambiente de execução primeiro deriva o material de chave BFV de \(s\) e \(A\). Os parâmetros públicos derivados devem corresponder exatamente aos parâmetros públicos comprometidos na blockchain.

A semente do circuito afim é:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

A partir desta semente, o ambiente de execução amostra, módulo \(t\), um circuito afim de 32 linhas:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

onde \(m_i\) são os slots de identificador descriptografados. Homomorficamente, ele computa o mesmo valor sobre os cifrados:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

O resolvedor descriptografa cada \(C_j\), requer que todos os coeficientes de texto simples finais sejam zero, converte os valores de coeficiente zero em bytes e forma:

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

### BFV Backend Programado {#bfv-programmed-backend}

Para `bfv-programmed-sha3-256-v1`, os parâmetros públicos reúnem os parâmetros BFV de criptografia do identificador e um resumo do programa oculto:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

O perfil atual RAM-FHE é:

|Campo|Valor|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

A entrada de texto simples enviada para Torii é criptografada no mesmo contêiner de dados BFV antes da execução. A semente determinística para essa criptografia do lado do servidor é:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Para entradas criptografadas fornecidas externamente, o resolvedor decifra o contêiner de dados do identificador e o recriptografa neste contêiner de dados determinístico antes de executar. Essa normalização canônica mantém os hashes do recibo estáveis entre textos cifrados BFV semanticamente equivalentes.

As rotas iniciais de execução de memória criptografada são derivadas de:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Para cada uma das 32 linhas de execução, o ambiente de execução amostra \(r_j \in [0,t)\) e armazena um ciphertext BFV criptografando \(r_j\). O programa oculto então executa sobre registradores criptografados e memória criptografada:

|Instrução|Álgebra|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), então relinearizar |
| `SelectEqZero(dst, cond, z, nz)` |Descriptografar \(R_{\mathrm{cond}}\); escolha \(R_z\) quando for zero, caso contrário \(R_{nz}\).|
| `Output(src)` |Anexe \(R_{\mathrm{src}}\) à lista de registradores de saída.|

Após a fita de instrução terminar, o resolvedor descriptografa cada registrador de saída, converte o coeficiente zero em um byte e concatena esses bytes:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Os hashes genéricos programados do backend são:

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

A fita identificadora programada padrão possui 64 slots de entrada. Para cada slot \(i\), ela carrega o slot de entrada, carrega a linha de execução da memória \(i \bmod 32\), os soma e fornece o resultado:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Hashes e recibos de saída {#output-hashes-and-receipts}

O recibo genérico de execução RAM-LFE não assina a saída bruta. Ele assina o hash da saída:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Para os recibos de execução Torii RAM-LFE, os dados associados são os bytes do identificador canônico do programa:

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

A verificação confere a assinatura com `resolver_public_key` e rejeita o recibo a menos que todas essas igualdades sejam verdadeiras:

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

Se o chamador fornecer `output_hex`, o verificador também verifica:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

No modo `proof`, a atestação transporta um envelope de prova em vez de uma assinatura. A verificação confere se o backend de prova, o ID do circuito, o hash do esquema de entradas públicas, o hash da chave de verificação e as instâncias públicas expostas correspondem aos metadados do verificador e ao hash da carga útil codificada do recibo. Seja:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

As instâncias públicas esperadas são quatro colunas de um elemento. A coluna \(j\) contém bytes \(h_{8j}\ldots h_{8j+7}\) seguidos por 24 bytes zero:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Projeção de Identificador {#identifier-projection}

A resolução de identificador não utiliza o backend genérico `opaque_hash` como o identificador de conta opaco voltado ao usuário. Ele projeta o hash de saída RAM-LFE por meio de domínios específicos do identificador:

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

Um `IdentifierResolutionReceipt` assina um payload de nível superior:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Para registros de resultado de protocolo de identificador assinado:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` aceita o recibo apenas quando a assinatura ou prova é válida, a carga de execução incorporada RAM-LFE corresponde à política do programa referenciada, e `uaid` e `account_id` são a vinculação sendo reivindicada.

## Fluxo de Execução {#execution-flow}

Uma execução genérica RAM-LFE segue este formato:

1. Governança ou um operador registra `RamLfeProgramPolicy`.
2. O proprietário ativa a política.
3. O cliente lê os metadados de políticas públicas de Torii.
4. O cliente envia exatamente um formulário de entrada para o resolvedor: texto simples `input_hex` ou um contêiner de dados de entrada criptografado BFV.
5. O ambiente de execução avalia o programa oculto e retorna `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` e um `RamLfeExecutionReceipt`.
6. O cliente ou o backend verifica o recibo em relação à política publicada, verificando opcionalmente se os hashes retornados `output_hex` correspondem ao `output_hash` do recibo.
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

## Políticas de Identificador {#identifier-policies}

Políticas de identificador são um uso concreto de RAM-LFE. Elas adicionam um namespace de negócios e uma regra de normalização sobre uma política de programa genérica:

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

A camada de identificador usa o recibo RAM-LFE para vincular:

- `policy_id`
- o identificador opaco derivado pela função oculta
- o determinístico `receipt_hash`
- a conta UAID
- o `account_id` canônico
- o payload de execução genérico RAM-LFE

Para o onboarding voltado ao usuário, mantenha os aliases de conta separados dos identificadores privados. Aliases são nomes públicos; números de telefone, endereços de e-mail e valores semelhantes devem passar por políticas de identificador e registros de resultado de protocolo.

## Torii Rotas {#torii-routes}

Quando a família de rotas voltada para o aplicativo é ativada, Torii expõe RAM-LFE e auxiliares de identificador:

|Rota|Propósito|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |Liste políticas de programa RAM-LFE ativas e inativas e metadados de execução pública.|
| `POST /v1/ram-lfe/programs/{program_id}/execute` |Execute um programa de `input_hex` ou `encrypted_input` e retorne os hashes de saída e um recibo sem estado.|
| `POST /v1/ram-lfe/receipts/verify` |Verifique um `RamLfeExecutionReceipt` em relação à política publicada e, opcionalmente, compare `output_hex` com `output_hash`.|
| `GET /v1/identifier-policies` |Liste políticas de identificador, modos de normalização, chaves de resolvedor e metadados de entrada criptografada.|
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Emita o recibo que um usuário pode inserir em `ClaimIdentifier`.|
| `POST /v1/identifiers/resolve` |Resolve uma entrada de identificador normalizado para a conta vinculada quando existir uma reivindicação ativa.|
| `GET /v1/identifiers/receipts/{receipt_hash}` |Consulte uma declaração de identificador persistente pelo hash do recibo para fins de auditoria e suporte.|

Sempre verifique o documento `/openapi.json` do nó de destino antes de construir contra essas rotas. A disponibilidade depende da construção do nó e do perfil da rede.

## Tempo de execução do software Node {#node-runtime}

O ambiente de execução RAM-LFE integrado à Torii é configurado em `torii.ram_lfe.programs[*]`, com `program_id` como chave. Cada programa configurado deve corresponder ao compromisso de política na cadeia e fornecer o material de execução necessário para avaliar e atestar recibos. As rotas de identificador reutilizam esse mesmo ambiente; não exigem uma superfície de configuração separada para o resolvedor de identificadores.

Registrar uma política na blockchain não é suficiente por si só. Um nó alvo também deve expor a família de rotas e ter o material de ambiente de execução correspondente para os programas que se espera que execute.

## Diretrizes Operacionais {#operational-guardrails}

- Políticas de registro inativas, verifique os metadados públicos e então ative-as.
- Mantenha segredos do avaliador, chaves de assinatura do resolvedor e material secreto BFV fora de documentos, registros, transações e pacotes do cliente.
- Não coloque identificadores brutos em apelidos de conta, metadados de transações, eventos ou campos de estado mundial.
- Verifique os recibos no lado do cliente antes de enviar instruções de nível superior quando o SDK expuser um verificador.
- Use campos de expiração para impedir que recibos obsoletos permaneçam válidos indefinidamente.
- Rotacione registrando um novo programa ou política de identificador, migrando clientes e desativando a política antiga assim que os novos registros de resultados de protocolo estiverem fluindo.

## Tópicos Relacionados {#related-topics}

- [Taxas de Patrocinador para um Espaço de Dados Privado](/pt/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md#app-and-sora-route-families)
- [Transações Anônimas](/pt/blockchain/anonymous-transactions.md)
