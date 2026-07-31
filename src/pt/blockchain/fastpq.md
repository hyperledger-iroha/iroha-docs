---
translation_locale: pt
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ é Iroha O que é ? STARK Proof path para efeitos de execução selecionados. Não substitui a execução normal da transacção ou o consenso. As transacções continuam a ser executadas ISI, IVM, e Sumeragi Como de costume; FastPQ Consuma o testemunho de execução determinista e transforma os efeitos apoiados em lotes de prova.

A integração do anfitrião atual tem três principais caminhos:

- Transferências numéricas transparentes de ativos registadas durante a execução do bloco
- Relais de faixa Nexus verificados cujo envelope de prova AXT contém uma ligação FastPQ
- Auxiliares transparentes de prova de mensagem SCCP que envolvem uma prova FastPQ em um envelope aberto de verificação

## Transferir o caminho da testemunha {#transfer-witness-path}

Transferências numéricas transparentes criam uma transcrição de transferência estruturada quando a instrução muda os balanços.

- a conta de origem, a conta de destino, a definição do ativo e o montante
- Saldos do remetente e do destinatário antes e depois da transferência
- o hash do ponto de entrada da transação utilizado como hash do lote
- Digest de autoridade derivado da conta de apresentação
- uma digestão de Poseidon para transcrições em delta único

As transferências de lote utilizam uma transcrição com múltiplos deltas. Nesse caso, a digestão Poseidon de delta único está ausente.

Na finalização do bloco, Iroha agrupa essas transcrições por hash de ponto de entrada. A testemunha de execução então carrega tanto os pacotes de transcrição originais quanto os lotes de transição FastPQ preparados para o prover.

Cada delta de transferência torna-se em duas linhas de transição:

|Em fila .|Forma da chave|Pre-valor |Pós-valor |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Emissor de débito |`asset/<asset-definition>/<source-account>` |balanço do remetente antes |saldo do remetente após |
|Crédito do destinatário |`asset/<asset-definition>/<destination-account>` |Balanço do destinatário antes |saldo do destinatário após |

Os valores numéricos são normalizados em unidades inteiras testemunhas. Um valor é rejeitado para lotes FastPQ se não puder ser representado como um `u64` não negativo na escala decimal selecionada.

## Contribuições públicas {#public-inputs}

Cada lote de transição FastPQ contém entradas públicas que vinculam a prova ao contexto do bloco e da execução:

|Introdução|Que significa ?|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Identificador de espaço de dados codificado como bytes de pequeno índice |
|`slot` |Tempo de criação do bloco convertido em nanossegundos |
|`old_root` |Raiz do estado dos pais derivada da testemunha de execução |
|`new_root` |A raiz pós-estado derivada da testemunha de execução .|
|`perm_root` |O compromisso de Poseidon com as autorizações para o papel ativo |
|`tx_set_hash` |Hash sobre transacção ordenada e hashes de ponto de entrada do time-trigger |

O anfitrião utiliza `fastpq-lane-balanced` como o parâmetro canônico definido para esses lotes.

## Modelo matemático {#mathematical-model}

Esta seção descreve a aritmética implementada pelo provador e verificador Rust atual. Todas as operações de campo abaixo são sobre o campo prime Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ usa Poseidon2 em vez de `F` para compromissos de campo. A esponja tem largura `t = 3`, taxa `r = 2` e capacidade `1`. O hash absorve elementos de campo em blocos de taxa-2 e anexa um único elemento de campo `1` antes da permutação final:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

As cordas de byte são empacotadas em membros pequenos endianos de 7 bytes para que cada membro seja estritamente inferior a `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Os hashes de campo separados por domínio são representados como:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Para hashes que começam a partir de digestões em byte-domain, FastPQ mapeia os primeiros oito bytes do pequeno endian no campo:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Aqui `Hash` significa o `iroha_crypto::Hash::new` de Iroha, um digesto Blake2bVar de 32 bytes, a menos que uma fórmula nomee explícitamente Poseidon2 ou SHA-256.

### Aritmética de campo {#field-arithmetic}

O código Rust representa os elementos de campo como valores canônicos `u64` no `[0,p)`.

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

A multiplicação calcula primeiro o produto de 128 bits:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

A redução de Goldilocks utiliza então a identidade:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Se:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

Em seguida, o redutor calcula:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

A implementação adiciona ou subtrai condicionalmente `p` até que o resultado seja canônico. Os números inteiros assinados, tais como os deltas do balanço, são incorporados por:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidon2 Permutação {#poseidon2-permutation}

O estado de permutação Poseidon2 é:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

A sua caixa S é:

$$
S(x)=x^5
$$

FastPQ utiliza quatro rodadas completas, cinquenta e sete rodadas parciais, em seguida, mais quatro rodadas. Uma rodada completa com constantes redondas `c_r = (c_{r,0}, c_{r,1}, c_{r,2})`:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Uma rodada parcial é:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Todas as adições e multiplicações são em `F`. A matriz canónica MDS é:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

O hash do campo começa a partir do estado zero. Para cada bloco de taxa completa-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

O bloco final acrescenta o `1` Elemento de enchimento antes de uma última permutação. `x_0`.

### A entrada pública é obrigatória {#public-input-binding}

O host codifica uma identificação de espaço de dados escrevendo seu valor `u64` nos primeiros oito bytes do campo de 16bytes:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

O tempo de criação do bloco é convertido de milissegundos em nanosegundos:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

O hash do conjunto de transações é um hash de domínio de byte sobre os hashes do ponto de entrada ordenados:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

onde `h_i` são classificados hashes de transações e pontos de entrada do time-trigger. Na prova pública IO, se `perm_root` ou `tx_set_hash` for tudo zero, o prover preenche os valores de fallback:

$$
\operatorname{perm\_root} =
\begin{cases}
0^{32},& \text{if there are no permission hashes}\\
\operatorname{Hash}(\texttt{fastpq:v1:perm\_root}\|p_0\|\cdots\|p_{n-1}),
& \text{otherwise}
\end{cases}
$$

$$
\operatorname{tx\_set\_hash}_{fallback} =
\operatorname{Hash}(\texttt{fastpq:v1:tx\_set}\|\operatorname{ordering\_hash})
$$

### Normalização numérica {#numeric-normalization}

Para cada delta de transferência, a escala decimal-alvo é a escala máxima cortada ao longo da quantidade e ambos os instantâneos de equilíbrio:

$$
s =
\max(
\operatorname{scale}(a),
\operatorname{scale}(f_0),
\operatorname{scale}(f_1),
\operatorname{scale}(t_0),
\operatorname{scale}(t_1)
)
$$

A. `Numeric` Valor com mantissa `m` e escala `q` só é aceita quando `m >= 0` e `q <= s`. O seu FastPQ O valor do testemunho é:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

O resultado normalizado deve corresponder a `u64`.

### Ordenamento canônico {#canonical-ordering}

Antes da construção do rastro, o lote é classificado por chave de transição, grau de operação e índice de inserção original:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

O compromisso de encomenda é um hash do campo Poseidon2 sobre o domínio `fastpq:v1:ordering` e a codificação Norito das transições ordenadas:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

onde `P` é embalagem de 7 bytes, `E` é Norito codificação, `D_o` é `fastpq:v1:ordering`, e `T*` É a lista de transição ordenada.

### Equações de transferência {#transfer-equations}

Para um montante de transferência `a`, saldo do remetente `f` e saldo do destinatário `t`, FastPQ valida os valores normalizados dos testemunhos antes da construção do rastreamento:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

As linhas de transição então codificam:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

No interior do rastro, os deltas assinados são reduzidos para `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

A digestão opcional de transferência single-delta compromete a pré-imagem de transferência codificada:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Para transcrições de transferência multi-delta, o formato atual exige que este digestamento de nível superior esteja ausente.

A digestão da autoridade de acolhimento para transcrições de transferência é:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Linhas de rastreamento {#trace-rows}

Deixe a lista de transição ordenada conter `n` linhas reais. O comprimento do rastro é o próximo poder de dois:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

As filas `0..n-1` são ativas; as fileiras `n..N-1` são fileiras de enchimento. Cada linha real possui um conjunto de selectores de operação:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Todas as colunas de selector são booleanas:

$$
s(s-1)=0
$$

As linhas de pesquisa de permissão são exatamente as linhas de atribuição e revogação de funções:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Para as linhas de operação numérica:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

O construtor acompanha também os delta por ativo:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Só as filas de menta e queimadura atualizam o contador de abastecimento:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metadados e colunas de rastreamento do espaço de dados são hashes de campo derivados antes da materialização de linha:

$$
\operatorname{metadata\_hash} =
\begin{cases}
0,& \text{if metadata is empty}\\
H_D(E(\text{metadata})),& \text{otherwise}
\end{cases}
$$

$$
\operatorname{dsid\_trace}=H_D(\operatorname{public\_input\_dsid})
$$

O hash de metadados, o hash do espaço de dados e o slot são estáveis em linhas adjacentes de traços:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Transferir colunas de Merkle {#transfer-merkle-columns}

As linhas de transferência carregam um caminho Merkle escasso de 32 níveis. Se uma prova host estiver faltando, o prover sintetiza um caminho determinista a partir da chave de linha, pré-equilíbrio e se a linha é o lado do remetente ou do receptor.

Para os caminhos sintéticos, o sal de sabor é `fastpq:smt:from` para as linhas de remetente e `fastpq:smt:to` para as linhagens de receptor:

$$
K =
\operatorname{Hash}(\texttt{fastpq:smt:key|}\|\operatorname{salt}\|\operatorname{key})
$$

$$
V =
\operatorname{Hash}(\texttt{fastpq:smt:value|}\|\operatorname{salt}\|\operatorname{le64}(\operatorname{balance}))
$$

$$
b_\ell = \operatorname{bit}_\ell(K)
$$

$$
s_\ell =
\operatorname{Hash}(
\texttt{fastpq:smt:sibling|}\|
\operatorname{le64}(\ell)\|K\|\operatorname{le64}(\operatorname{balance})\|\operatorname{salt}
)
$$

As folhas sintéticas e os nós internos são:

$$
L = \operatorname{Hash}(
\texttt{fastpq:smt:leaf|}\|
K\|V
)
$$

$$
N_{\ell+1} =
\operatorname{Hash}(
\texttt{fastpq:smt:node|}\|
\operatorname{left}_\ell\|
\operatorname{right}_\ell
)
$$

O rastreamento registra o bit `b_l`, irmão `s_l`, nó de entrada `x_l` e nodo de saída `x_{l+1}` em todos os níveis. Com a convenção do ramo do código:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Hashes de permissão {#permission-hashes}

As linhas de atribuição e revogação da função hash o testemunho de permissão:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

A tabela de permissão host classifica as entradas por bytes de papel, bytes de permissões e bytes de época, então constrói uma árvore de Poseidon2 Merkle:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Os níveis de largura ímpar duplicam o elemento final.

### O compromisso de rastrear {#trace-commitment}

Para cada coluna de traços `c`, FastPQ primeiro interpola os valores da coluna sobre o domínio de traços e hashes o vetor do coeficiente:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

A raiz de rastreamento é uma raiz de Poseidon2 Merkle sobre compromissos de coluna:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

O compromisso de rastreamento final é um hash em byte sobre o domínio, conjunto de parâmetros, forma do rastreamento, digestões de colunas e raiz do rastreador:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

onde `D_c` é `fastpq:v1:trace_commitment`.

### Composição AIR {#air-composition}

O valor de composição V1 AIR é uma combinação linear de resíduos locais em filas. A transcrição mostra dois desafios:

$$
\alpha_0,\alpha_1 \in F
$$

Para cada par de linhas adjacentes `(i,i+1)`, o provador calcula:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Os resíduos `rho` são, na ordem do código:

$$
\rho=s(s-1)
\quad\text{for each selector column}
$$

$$
\rho =
s_{\text{active}} -
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}}+
s_{\text{role\_grant}}+s_{\text{role\_revoke}}+s_{\text{meta\_set}})
$$

$$
\rho =
s_{\text{perm}}-(s_{\text{role\_grant}}+s_{\text{role\_revoke}})
$$

$$
\rho =
s_{\text{active},i+1}(1-s_{\text{active},i})
$$

Para as linhas com colunas numéricas:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

E para colunas de contexto de lote estável:

$$
\rho =
\operatorname{metadata\_hash}_i-\operatorname{metadata\_hash}_{i+1}
$$

$$
\rho =
\operatorname{dsid}_i-\operatorname{dsid}_{i+1}
$$

$$
\rho =
\operatorname{slot}_i-\operatorname{slot}_{i+1}
$$

O verificador recalcula o `A_i` para as aberturas de filas recolhidas na amostra e verifica-o em relação ao valor da composição comprometido no âmbito da raiz Merkle da composição AIR.

### Produto de pesquisa {#lookup-product}

O acumulador de pesquisa de permissões utiliza o desafio Fiat-Shamir `gamma`. Nas avaliações de extensão de baixo grau de `s_perm` e `perm_hash`, o produto em execução é:

$$
z_0=1
$$

$$
z_{i+1}=
\begin{cases}
z_i\cdot(w_i+\gamma),& s_{\text{perm},i}\ne0\\
z_i,& s_{\text{perm},i}=0
\end{cases}
$$

Os registos de prova:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extensão de baixo grau {#low-degree-extension}

Que `omega_T` seja o gerador de domínio de rastreamento, `omega_E` o gerador do domínio de avaliação e `g` a compensação dos cosetos configurados. Para uma coluna de rastreio com valores `v_i`, a interpolação produz coeficientes `a_j` tais que:

$$
f(\omega_T^i)=v_i
$$

A extensão de baixo grau evalua o mesmo polinômio no coseto:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

A implementação calcula isto multiplicando os coeficientes por poderes do coset compensado antes de FFT:

$$
a'_j = a_j g^j
$$

e, em seguida, a avaliação `a'` no domínio de avaliação.

A Comissão CPU FFT é uma transformação iterativa de radix-2 Cooley-Tukey sobre entradas invertidas em bits. `L`, Meio comprimento `H=L/2`, e raiz de estágio:

$$
\omega_L=\omega^{N/L}
$$

Cada borboleta calcula:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

O inverso FFT realiza a mesma transformação com o `omega^{-1}` e escala pelo tamanho do domínio inverso:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

As raízes do catálogo devem ser validadas antes da utilização:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Para domínios menores derivados da raiz do catálogo, o gerador é:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Haches de filas e folhas {#row-and-leaf-hashes}

Após LDE, FastPQ hashes de cada linha em todos LDE Colunas. para `m` Colunas:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Se os hashes de linha ainda estiverem no domínio trace, em vez do domínio de avaliação, o prover interpola e estende essa coluna de hash de linha única com o mesmo processo coset LDE.

### Aberturas de Merkle {#merkle-openings}

Os valores LDE são agrupados em pedaços de:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Cada pedaço de folha é:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Os pais de Merkle são:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Níveis ímpares duplicam o último nó. Os caminhos de consulta são verificados por hashing à esquerda ou à direita de acordo com a paridade do índice da folha de consulta em cada nível.

Para uma folha com índice `i`, o caminho `(s_0,\ldots,s_{d-1})` é verificado contra a raiz `R` pela recorrência:

$$
y_0=L_i
$$

$$
y_{k+1}=
\begin{cases}
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),y_k,s_k),
& \lfloor i/2^k\rfloor \equiv 0 \pmod 2\\
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),s_k,y_k),
& \lfloor i/2^k\rfloor \equiv 1 \pmod 2
\end{cases}
$$

O cheque só é aprovado quando:

$$
y_d=R
$$

As folhas de linha AIR são:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

As folhas de composição AIR são:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

A abertura da consulta LDE também verifica se o valor aberto no índice de avaliação `i` está presente na sua peça autenticada:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Pulsão {#fri-folding}

FRI compromete-se a AIR Avaliações da composição. `l`, As amostras de transcrição são um desafio `beta_l`. A camada é empolhada para um múltiplo da aridade repetindo o último valor. Cada grupo de tamanho da aridade se dobra para:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

onde `a` é a aridade de FRI. O verificador verifica, para cada cadeia de consultas amostrada, que:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

e autentica cada grupo FRI aberto contra a raiz de camada FRI correspondente.

### Transcrição de Fiat-Shamir {#fiat-shamir-transcript}

O catálogo de parâmetros canônicos rotula o hash da transcrição como SHA3-256. A implementação atual do prover e verificador deriva bytes de desafio com `iroha_crypto::Hash::new`, que é um digesto Blake2bVar de 32 bytes, depois reduz os primeiros oito bytes de pequena endea para `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

As chamadas de desafio adicionam o texto completo ao estado da transcrição.

1. público IO, versão de protocolo, versão de parâmetro e nome do parâmetre
2. LDE raiz e raiz de rastro
3. `gamma`
4. Desafios de composição AIR `alpha_0`, `alpha_1`
5. Raiz de traço AIR e raiz de composição AIR
6. lookup grande produto
7. Roteiras de camadas FRI e desafios `beta_l`
8. índices de consulta tomados em amostra

A amostragem de consulta continua a desenhar digestões de desafio de 32 bytes e a lê-las como pequenos fragmentos `u64` até obter o número solicitado de índices únicos:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

O conjunto de amostras é devolvido em ordem ordenada.

### Reprodução do verificador {#verifier-replay}

O verificador recalcula, em primeiro lugar, o compromisso do lote:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

e requer:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Reconstrui também o público IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Cada campo deve corresponder ao público da prova IO byte-for-byte. O verificador reconstrui a mesma transcrição e obtém a mesma:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Para cada consulta tomada pela amostra `q`, verifica-se:

$$
\operatorname{MerkleVerify}(
R_{\text{lde}},
L_{\lfloor q/B_{\text{lde}}\rfloor},
\lfloor q/B_{\text{lde}}\rfloor,
\pi_{\text{lde}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_q,
q,
\pi_{\text{air,current}}
)
$$

$$
\operatorname{MerkleVerify}(
R_{\text{air}},
L^{\text{air}}_{q+1\bmod N_{\text{eval}}},
q+1\bmod N_{\text{eval}},
\pi_{\text{air,next}}
)
$$

e:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

A Comissão AIR A abertura da composição deve ser autenticada no `R_air_composition`. A Comissão FRI A cadeia começa a partir da mesma `A_q` e deve terminar num final autenticado FRI Folha debaixo do terminal FRI A raiz.

## O que o Provérbio verifica {#what-the-prover-checks}

Antes de construir o rastreamento, o provador FastPQ canoniza a ordem do lote por chave de transição, grau de operação e ordem de inserção. As linhas de transferência também exigem metadados transcritos.

Para as transcrições de transferência, os controlos no lado do provedor incluem:

- O saldo do remetente não deve fluir para baixo
- `sender_after` deve ser igual a `sender_before - amount`
- `receiver_after` deve ser igual a `receiver_before + amount`
- A transcrição deve abranger todas as linhas de transferência do lote.
- uma digestão de Poseidon com um único delta, quando presente, deve corresponder à imagem prévia da transcrição
- desde que as provas de Merckle raras sejam decodificadas como versão 1; os caminhos faltantes são preenchidos com provas sintéticas deterministas.

O rastreamento contém colunas de selector para transferência, moeda, queima, atribuição de papéis, revogação de papéis , conjunto de metadados e linhas de pesquisa de permissões.

## Provérbio Lane {#prover-lane}

`irohad` inicia a faixa de prover FastPQ na inicialização se o backend do prover pode ser iniciado. A faixa é uma tarefa de fundo com uma fila limitada. Depois que um bloco produz um testemunho de execução, o caminho de commit apresenta um trabalho de prover contendo o hash do bloco, altura, vista e testemunho.

Se a faixa não estiver em execução ou a fila estiver cheia, o trabalho é ignorado e o processamento normal do bloco continua. Isso significa que a faixa de verificação de fundo não é uma entrada de transação ou um portal de consenso. É um caminho de produção de prova sobre estado que já foi executado.

A faixa constrói um provedor com:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` Deixa o provador escolher o backend disponível. `cpu` Execução de pins para o CPU. `gpu` preferências GPU Execução, com CPU fallback em que o backend não pode utilizar os kernels solicitados.

## Verificação {#verification}

A verificação de prova FastPQ reconstitui o compromisso canônico do lote e repõe a transcrição pública. O verificador verifica a versão do protocolo, a versão definida por parâmetros, os limites de reprodução, o compromisso de rastreamento, as entradas públicas, as aberturas Merkle da amostra, as abertura AIR e a cadeia de consultas FRI.

Os limites de repetição por defeito incluem:

|Limite .|Default .|
| ------------------ | ------: |
|Linhas de transição |     256 |
|Tamanho da carga útil do lote |256 KiB |
|FRI camadas |      16 |
|Questões abertas |     128 |

## Nexus Relais verificados {#nexus-verified-relays}

Nexus AXT Os envelopes de prova podem incorporar um `AxtFastpqBinding`. Quando `RegisterVerifiedLaneRelay` Executa, Iroha:

1. Verifica o envelope de relevo da faixa e o material de prova FastPQ
2. verifica o espaço de dados e a raiz do manifesto
3. Decodifica o envelope de prova AXT
4. Requer um `fastpq_binding`
5. Reconstrui o lote FastPQ a partir dessa ligação.
6. Decodifica a prova embutida FastPQ
7. liga ao verificador FastPQ sobre o lote e a prova reconstruídos

Se a verificação for bem-sucedida, Iroha armazena um `VerifiedLaneRelayRecord` contendo a referência do relevo, o envelope original, o hash da carga útil de prova, a altura da verificação, a raiz do manifesto e a ligação à FastPQ.

Os envelopes de relevo de faixa também carregam material de prova compacto FastPQ. O material é um digesto sobre o ID da faixa, id do espaço de dados, altura do bloco, altura de verificação, hash de cabeçalho de bloco, hash de liquidação e raiz do manifesto. Um relevo só é admissível quando contém um material de prova QC e válido FastPQ.

### AXT Matemática vinculativa {#axt-binding-math}

Para os envelopes Nexus AXT, `AxtFastpqBinding` é canonizado antes da repetição de prova. Valores padrão do parâmetro vazio para `fastpq-lane-balanced`; id e versão padrão de verificador vazio para`fastpq` e `v1`; o tipo de reivindicação é recortado e reduzido.

As entradas públicas AXT FastPQ são hashes de byte deterministas:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

As chaves de transição AXT são:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

No pedido de `authorization` é inserida uma linha relativa à concessão de títulos:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

A reivindicação `compliance` inserir duas linhas de metadados: uma para a política e outra para os espaços de dados alvo.

Para `tx_predicate` e `value_conservation`, é utilizado um valor de efeito explícito quando a ligação contém uma quantidade fonte ou destino positiva. Caso contrário, o código deriva um valor determinístico limitado:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Em seguida, usam-se as mesmas equações de transferência:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Os IDs de conta do remetente e do destinatário sintéticos são gerados a partir de sementes-chave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

O hash do lote de transferência é:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

O manifesto de lote AXT é digestado por SHA-256 sobre a codificação Norito da ligação canônica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Prova de mensagem transparente {#sccp-transparent-message-proofs}

A caixa auxiliar SCCP também usa FastPQ para provas transparentes de mensagens transversais. Este caminho é separado da faixa de provedor de fundo `irohad`. Ele constrói um lote FastPQ diretamente a partir de um pacote e manifesto de prova de mensagem SCCP, em seguida, enrola a prova resultante para verificação aberta.

O lote SCCP utiliza o `fastpq-lane-balanced` e três transições de metadados:

|A chave .|Operação |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

As suas entradas públicas são derivadas da prova interna transparente SCCP:

|Introdução FastPQ |SCCP fonte |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Os primeiros 16 bytes de uma digestão Blake2b sobre a declaração hash |
|`slot` |Altura da finalidade |
|`old_root` |Hash de carga útil |
|`new_root` |Raiz de compromisso |
|`perm_root` |O bloqueio de finalidade hash |
|`tx_set_hash` |Hash de declaração |

Os codificadores canônicos SCCP escrevem números inteiros pequenos e codificam matrizes de bytes de comprimento variável como:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

A cadeia de byte de entrada pública transparente é:

$$
P =
\operatorname{version}\|
\operatorname{message\_id}\|
\operatorname{payload\_hash}\|
\operatorname{le32}(\operatorname{target\_domain})\|
\operatorname{commitment\_root}\|
\operatorname{le64}(\operatorname{finality\_height})\|
\operatorname{finality\_block\_hash}
$$

Os bytes de declaração transparentes são a concatenação da versão, família de cadeias, domínios locais e contrapartes, modelo de segurança, governança de âncora, codec de conta, modelo de finalidade, alvo do verificador, família de backend do verificador; campos de cadeia/backend/manifesto prefixados em comprimento; hash vinculativo de destino; A chave de codec da conta, tipo de carga útil, bytes de entrada pública e hash da carga útil.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

O id do espaço de dados FastPQ para este caminho de prova é os primeiros dezesseis bytes de outro digestão Blake2b pré-fixado:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

O lote de SCCP FastPQ é exatamente:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

em seguida, ordenado pela mesma regra de encomenda FastPQ.

O compromisso com o verificador OpenVerify é SHA-256 em relação ao nome do backend da mensagem SCCP e ao descritivo canônico do verificador FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

O crudo FastPQ A prova é Norito- codificado em um `StarkFriOpenProofV1`, em seguida, embrulhado em um `OpenVerifyEnvelope` com backend `Stark`. SCCP A verificação reconstrói a mesma FastPQ a colheita do pacote e do manifesto, verifica os metadados do envelope de verificação aberto e chama o FastPQ Verificador e prova do lote reconstruído.

## Setos de parâmetros {#parameter-sets}

O catálogo dos parâmetros canônicos expõe dois conjuntos de parâmetres. `fastpq-lane-balanced`.

|Parâmetro |Propósito |Campo |Hashes |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |transmissão de provedor equilibrada |Goldilocks extensão quadrática |Compromissos de Poseidon2, catálogo SHA3 etiqueta |Arity 8, blowup 8, 46 consultas |
|`fastpq-lane-latency` |rotas sensíveis à latência |Goldilocks extensão quadrática |Compromissos de Poseidon2, catálogo SHA3 etiqueta |Arity 16, explosão 16, 34 consultas |

Ambos visam segurança de 128-bit e usam um tamanho de domínio rastreado de `2^16`. O código de repetição da transcrição Rust V1 atualmente deriva bytes de desafio Fiat-Shamir com `iroha_crypto::Hash::new` em vez de invocar diretamente SHA3-256.

As constantes exatas do catálogo utilizadas pelo provador Rust são:

|Constantemente .|`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## Configuração {#configuration}

A configuração FastPQ está inserida em `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "auto"
poseidon_mode = "auto"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
metal_debug_fused = false
```

Os mesmos rótulos de execução e telemetria podem ser substituídos a partir do `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

As variáveis ambientais são também suportadas para os campos de configuração. FastPQ- as variáveis específicas incluem:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`
- `FASTPQ_DEBUG_FUSED`

## Métricas {#metrics}

Quando a telemetria está habilitada, FastPQ exporta métricas para seleção de backend e comportamento de execução do Metal:

|Metrica .|Que significa ?|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Modo de execução solicitado e resolvido por backend e rótulos do dispositivo |
|`fastpq_poseidon_pipeline_total` |Pedido e resolvido caminho do oleoduto de Poseidon |
|`fastpq_metal_queue_depth` |Limite de fila de metal, contagem máxima no voo, número de expedição e janela de amostragem |
|`fastpq_metal_queue_ratio` |As filas de metais ocupadas e as proporções de sobreposição |
|`fastpq_zero_fill_duration_ms` |Durada de enchimento zero para corridas de Metal |
|`fastpq_zero_fill_bandwidth_gbps` |Largura de banda derivada zero-fill |

Para triagem geral de desempenho, utilize-as com os sinais de consenso e filas listados em [Performance and Metrics ](/pt/guide/advanced/metrics.md).

## Referência relacionada {#related-reference}

- [Esquema de modelo de dados ](/pt/reference/data-model-schema.md) para os detalhes do tipo gerados
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [Opções `irohad` FastPQ ](/pt/reference/irohad-cli.md#arg-fastpq-execution-mode)
