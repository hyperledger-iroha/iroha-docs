---
translation_locale: pt
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ é o caminho de prova STARK de Iroha para os efeitos de execução selecionados. Ele não substitui a execução normal de transações ou o consenso. As transações ainda execute ISI, IVM e Sumeragi como de costume; FastPQ consome a prova de execução determinística e transforma efeitos suportados em lotes de prova.

A integração atual do host possui três caminhos principais:

- transferências numéricas de ativos transparentes registradas durante a execução do bloco
- Nexus relés de faixa de execução verificados cujo contêiner de dados de prova AXT carrega uma ligação FastPQ
- SCCP auxiliares de prova de mensagem transparente que envolvem uma prova FastPQ em um contêiner de dados de verificação aberta

## Caminho da Testemunha de Transferência {#transfer-witness-path}

Transferências numéricas transparentes criam uma transcrição de transferência estruturada quando a instrução altera os saldos. A transcrição registra:

- a conta de origem, a conta de destino, a definição do ativo e o valor
- saldos do remetente e do destinatário antes e depois da transferência
- o hash criptográfico do ponto de entrada da transação usado como o hash criptográfico do lote
- um valor principal de resumo criptográfico de autorização derivado da conta que está enviando
- um valor de resumo criptográfico Poseidon para transcrições de delta único

Transferências em lotes usam uma transcrição com múltiplos deltas. Nesse caso, o valor do resumo criptográfico Poseidon de delta único está ausente.

Na finalização do bloco, Iroha agrupa essas transcrições pelo hash criptográfico de entrada. A testemunha de execução então carrega tanto os pacotes de transcrições originais quanto os lotes de transição FastPQ preparados para o provador.

Cada delta de transferência se torna duas linhas de transição:

|Linha|Formato da chave|Pré-valor|Pós-valor|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débito do remetente| `asset/<asset-definition>/<source-account>`      |saldo do remetente antes|saldo do remetente após|
|Crédito do receptor| `asset/<asset-definition>/<destination-account>` |saldo do receptor antes|saldo do receptor após|

Valores numéricos são normalizados em unidades testemunhas inteiras. Um valor é rejeitado para o lote FastPQ se não puder ser representado como um `u64` não negativo na escala decimal selecionada.

## Entradas Públicas {#public-inputs}

Cada lote de transição FastPQ carrega entradas públicas que vinculam a prova ao bloco e ao contexto de execução:

|Entrada|Significado|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Identificador de espaço de dados codificado como bytes em little-endian|
| `slot`        |Tempo de criação do bloco convertido para nanossegundos|
| `old_root`    |Raiz do estado pai derivada da testemunha de execução|
| `new_root`    |Raiz pós-estado derivada da testemunha de execução|
| `perm_root`   |Compromisso de Poseidon sobre permissões de funções ativas|
| `tx_set_hash` |hash criptográfico sobre transação ordenada e entrada de acionamento por tempo hashes criptográficos|

O host usa `fastpq-lane-balanced` como o conjunto de parâmetros canônicos para esses lotes.

## Modelo Matemático {#mathematical-model}

Esta seção descreve a aritmética implementada pelo atual provador e verificador Rust. Todas as operações de campo abaixo são sobre o campo primo Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ usa Poseidon2 em vez de `F` para compromissos de campo. A esponja tem largura `t = 3`, taxa `r = 2` e capacidade `1`. O hash criptográfico absorve elementos de campo em blocos de taxa 2 e adiciona um único elemento de campo `1` antes da permutação final:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

As sequências de bytes são agrupadas em segmentos little-endian de 7 bytes, todos estritamente menores que `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Hashes criptográficos de campo separados por domínio são representados como:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Para hashes derivados de resumos no domínio de bytes, FastPQ mapeia os primeiros oito bytes little-endian para o campo:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Aqui, `Hash` significa o `iroha_crypto::Hash::new` da Iroha: um resumo Blake2bVar de 32 bytes, salvo quando uma fórmula mencionar explicitamente Poseidon2 ou SHA-256.

### Aritmética de Campo {#field-arithmetic}

O código Rust representa elementos de campo como valores `u64` canônicos em `[0,p)`. A adição e subtração são:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

A multiplicação primeiro calcula o produto de 128 bits:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

A redução Goldilocks então usa a identidade:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Se:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

então o redutor calcula:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

A implementação adiciona ou subtrai condicionalmente `p` até que o resultado seja canônico. Inteiros com sinal, como deltas de saldo, são incorporados por:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Permutação Poseidon2 {#poseidon2-permutation}

O estado da permutação Poseidon2 é:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Sua S-box é:

$$
S(x)=x^5
$$

FastPQ usa quatro rodadas completas, cinquenta e sete rodadas parciais, e depois mais quatro rodadas completas. Uma rodada completa com constantes de rodada `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` é:

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

Todas as adições e multiplicações estão em `F`. A matriz canônica MDS é:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

O campo hash criptográfico começa a partir do estado zero. Para cada bloco completo de taxa-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

O bloco final adiciona o elemento de preenchimento `1` antes de uma última permutação. A saída é `x_0`.

### Vinculação de Entrada Pública {#public-input-binding}

O host codifica um ID de espaço de dados escrevendo seu valor `u64` nos primeiros oito bytes little-endian do campo de 16 bytes:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

O tempo de criação do bloco é convertido de milissegundos para nanossegundos:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

O hash do conjunto de transações é calculado no domínio de bytes a partir dos hashes dos pontos de entrada ordenados:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

onde `h_i` são hashes criptográficas de transações ordenadas e de pontos de entrada acionados por tempo. Na prova pública IO, se `perm_root` ou `tx_set_hash` forem todos zeros, o provador preenche valores de contingência:

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

### Normalização Numérica {#numeric-normalization}

Para cada delta de transferência, a escala decimal alvo é a escala aparada máxima entre o valor e ambas as visualizações de dados de saldo no ponto no tempo:

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

Um valor `Numeric` com mantissa `m` e escala `q` é aceito apenas quando `m >= 0` e `q <= s`. Seu valor de testemunho FastPQ é:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

O resultado normalizado deve caber em `u64`.

### Ordenação Canônica {#canonical-ordering}

Antes da construção do traço, o lote é ordenado pela chave de transição, pela classificação da operação e pelo índice de inserção original:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

O compromisso de ordenação é um hash criptográfico de campo do Poseidon2 sobre o domínio `fastpq:v1:ordering` e a codificação Norito das transições ordenadas:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

onde `P` é empacotamento de 7 bytes, `E` é codificação Norito, `D_o` é `fastpq:v1:ordering`, e `T*` é a lista de transições ordenada.

### Equações de Transferência {#transfer-equations}

Para um valor de transferência `a`, saldo do remetente `f` e saldo do destinatário `t`, FastPQ valida os valores normalizados da testemunha antes de construir o rastreamento:

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

Dentro do rastreamento, os deltas assinados são reduzidos em `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

O resumo opcional da transferência com delta único vincula a pré-imagem codificada da transferência:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Para transcrições de transferência multi-delta, o formato atual exige que este valor de resumo criptográfico de nível superior esteja ausente.

O valor do resumo criptográfico principal de autorização do host para transferências de transcrição é:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Rastrear Linhas {#trace-rows}

Deixe a lista de transição ordenada conter `n` linhas reais. O comprimento do traço é a próxima potência de dois:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

As linhas `0..n-1` estão ativas; as linhas `n..N-1` são linhas de preenchimento. Cada linha real tem um seletor de operação definido:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Todas as colunas de seletor são Booleanas:

$$
s(s-1)=0
$$

As linhas de pesquisa de permissão são exatamente linhas de concessão de função e revogação de função:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Para linhas de operação numérica:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

O construtor também acompanha os deltas por ativo em execução:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Apenas emitir e queimar linhas atualiza o contador de suprimentos:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Colunas de rastreamento de metadados e dataspace são hashes criptográficos de campo derivados antes da materialização da linha:

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

O hash dos metadados, o do espaço de dados e o slot permanecem estáveis entre linhas adjacentes do traço:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Colunas de Merkle de Transferência {#transfer-merkle-columns}

As linhas de transferência carregam um caminho de Merkle esparso de 32 níveis. Se uma prova do host estiver faltando, o provador sintetiza um caminho determinístico a partir da chave da linha, saldo prévio e se a linha é do lado do remetente ou do destinatário.

Para caminhos sintéticos, o sal de sabor é `fastpq:smt:from` para linhas de remetente e `fastpq:smt:to` para linhas de receptor:

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

A folha sintética e os nós internos são:

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

O rastreamento registra o bit `b_l`, o irmão `s_l`, o nó de entrada `x_l` e o nó de saída `x_{l+1}` em cada nível. Com a convenção de ramificação do código:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Permissão de hashes criptográficos {#permission-hashes}

Conceder e revogar funções linhas hash criptográfico a permissão de testemunha:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

A tabela de permissões do host root classifica as entradas por bytes de função, bytes de permissão e bytes de época, e então constrói uma árvore Merkle Poseidon2:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Níveis de largura ímpar duplicam o último elemento.

### Rastrear Compromisso {#trace-commitment}

Para cada coluna de traço `c`, FastPQ, primeiro interpola os valores da coluna sobre o domínio do traço e calcula o hash criptográfico do vetor de coeficientes:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

A raiz de rastreamento é uma raiz Merkle Poseidon2 sobre compromissos de coluna:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

O compromisso final do traço é um hash de bytes do domínio, do conjunto de parâmetros, do formato do traço, dos resumos das colunas e da raiz do traço:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

onde `D_c` é `fastpq:v1:trace_commitment`.

### AIR Composição {#air-composition}

O valor de composição V1 AIR é uma combinação linear de resíduos locais por linha. A transcrição amostra dois desafios:

$$
\alpha_0,\alpha_1 \in F
$$

Para cada par de linhas adjacentes `(i,i+1)`, o provador calcula:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Os resíduos `rho` são, em ordem de código:

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

Para linhas com colunas numéricas:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

E para colunas de contexto de lote estáveis:

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

O verificador recalcula `A_i` para aberturas de linha amostradas e verifica-o em relação ao valor de composição comprometido sob a raiz Merkle de composição AIR.

### Consultar Produto {#lookup-product}

O acumulador de verificação de permissões usa o desafio Fiat-Shamir `gamma`. Sobre as avaliações da extensão de baixo grau de `s_perm` e `perm_hash`, o produto em execução é:

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

O registro da prova:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extensão de Baixo Grau {#low-degree-extension}

Seja `omega_T` o gerador do domínio de traço, `omega_E` o gerador do domínio de avaliação e `g` o deslocamento de coset configurado. Para uma coluna de traço com valores `v_i`, a interpolação produz coeficientes `a_j` tais que:

$$
f(\omega_T^i)=v_i
$$

A extensão de baixo grau avalia o mesmo polinômio no cosseno:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

A implementação calcula isso multiplicando os coeficientes pelas potências do deslocamento do coset antes de FFT:

$$
a'_j = a_j g^j
$$

e então avaliando `a'` no domínio de avaliação.

O CPU FFT é uma transformada iterativa radix-2 de Cooley-Tukey sobre entradas com bits invertidos. No comprimento do estágio `L`, metade do comprimento `H=L/2`, e raiz do estágio:

$$
\omega_L=\omega^{N/L}
$$

cada borboleta calcula:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

O inverso FFT executa a mesma transformação com `omega^{-1}` e escala pelo tamanho do domínio inverso:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

As raízes do catálogo são validadas antes do uso:

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

### Hashes criptográficos de linha e folha {#row-and-leaf-hashes}

Após LDE, FastPQ faz hash criptográfico de cada linha em todas as LDE colunas. Para `m` colunas:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Se os hashes criptográficos de linha ainda estiverem no domínio do traço em vez do domínio de avaliação, o provador interpola e estende essa coluna de hash de linha única com o mesmo processo de coset LDE.

### Aberturas de Merkle {#merkle-openings}

Os valores LDE são agrupados em blocos de:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Cada folha de pedaço é:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Os pais de Merkle são:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Níveis ímpares duplicam o último nó. Caminhos de consulta são verificados calculando o hash à esquerda ou à direita de acordo com a paridade do índice da folha da consulta em cada nível.

Para uma folha no índice `i`, um caminho `(s_0,\ldots,s_{d-1})` verifica-se em relação à raiz `R` pela recorrência:

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

A verificação passa apenas quando:

$$
y_d=R
$$

AIR as folhas de traço são:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR folhas de composição são:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

A abertura da consulta LDE também verifica se o valor aberto no índice de avaliação `i` está presente em seu bloco autenticado:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Dobrando {#fri-folding}

FRI se compromete com as avaliações de composição de AIR. Para cada rodada `l`, a transcrição amostra um desafio `beta_l`. A camada é preenchida até um múltiplo da aridade repetindo o último valor. Cada grupo do tamanho da aridade se dobra para:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

onde `a` é a aridade FRI. O verificador verifica, para cada cadeia de consulta amostrada, que:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

e autentica cada grupo FRI aberto contra a raiz da camada FRI correspondente.

### Transcrição Fiat-Shamir {#fiat-shamir-transcript}

O catálogo de parâmetros canônicos rotula o hash criptográfico da transcrição como SHA3-256. A implementação atual do provador e verificadora deriva os bytes de desafio com `iroha_crypto::Hash::new`, que é um valor de digest criptográfico Blake2bVar de 32 bytes, então reduz os primeiros oito bytes em little-endian para `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Chamadas de desafio adicionam o valor completo do resumo criptográfico ao estado da transcrição. A ordem de repetição é:

1. público IO, versão do protocolo, versão do parâmetro e nome do parâmetro
2. LDE raiz e rastro da raiz
3. `gamma`
4. AIR desafios de composição `alpha_0`, `alpha_1`
5. AIR raíz de rastreamento e AIR raíz de composição
6. procurar produto principal
7. FRI camadas de raízes e `beta_l` desafios
8. índices de consulta amostrados

A amostragem de consulta continua gerando resumos criptográficos de desafio de 32 bytes e lendo-os como blocos little-endian `u64` até que tenha o número solicitado de índices únicos:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

O conjunto amostrado é retornado em ordem classificada.

### Repetição do Verificador {#verifier-replay}

O verificador primeiro recalcula o compromisso do lote:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

e requer:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

Também reconstrói o público IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Cada campo deve corresponder, byte a byte, ao IO público da prova. O verificador então reconstrói a mesma transcrição e deriva o mesmo:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Para cada consulta amostrada `q`, ele verifica:

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

A abertura da composição AIR deve ser autenticada sob `R_air_composition`. A cadeia FRI então começa a partir do mesmo `A_q` e deve terminar em uma folha final FRI autenticada sob a raiz terminal FRI.

## O Que o Verificador Confere {#what-the-prover-checks}

Antes de construir o rastreamento, o provador FastPQ canoniciza a ordem do lote por chave de transição, classificação da operação e ordem de inserção. As linhas de transferência também exigem metadados da transcrição. Um lote com linhas de transferência mas sem transcrições de transferência é inválido.

Para a transferência de históricos escolares, as verificações do lado do provedor incluem:

- o saldo do remetente não deve ficar negativo
- `sender_after` deve ser igual a `sender_before - amount`
- `receiver_after` deve ser igual a `receiver_before + amount`
- a transcrição deve cobrir cada linha de transferência no lote
- um resumo Poseidon de delta único, quando presente, deve corresponder à pré-imagem da transcrição
- provas de Merkle esparsas fornecidas devem decodificar como versão 1; caminhos ausentes são preenchidos com provas sintéticas determinísticas

O rastreamento contém colunas de seletor para transferência, emissão, queima, concessão de função, revogação de função, definição de metadados e linhas de consulta de permissão. As linhas de operação numérica também carregam deltas com sinal, deltas acumulados por ativo e contadores de suprimento.

## Prover pista de execução {#prover-lane}

`iroha3d` inicia a linha de execução do provador FastPQ na inicialização se o backend do provador puder ser inicializado. A linha de execução é uma tarefa em segundo plano com uma fila limitada. Após um bloco produzir uma prova de execução, o caminho de confirmação envia um trabalho de provador contendo o hash criptográfico do bloco, altura, visualização e prova.

Se a fila de execução não estiver funcionando ou a fila estiver cheia, o trabalho é ignorado e o processamento normal do bloco continua. Isso significa que a fila de execução do provedor de background não é um portão de admissão de transações ou de consenso. É um caminho de produção de provas sobre um estado que já foi executado.

A pista de execução constrói um verificador com:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Ambas as configurações padrão para `cpu`. Selecionar `gpu` é uma solicitação explícita de falha segura: se o suporte a GPU não estiver compilado ou um backend GPU solicitado falha na verificação prévia, a linha de execução do provador permanece desativada. A primeira versão não possui valor `auto` e não retorna de um modo GPU solicitado para CPU.

## Verificação {#verification}

FastPQ a verificação da prova reconstrói o compromisso de lote canônico e reproduz a transcrição pública. O verificador verifica a versão do protocolo, a versão do conjunto de parâmetros, os limites de reprodução, o compromisso de rastreamento, as entradas públicas, as aberturas de Merkle amostradas, AIR aberturas e a cadeia de consultas FRI.

Os limites padrão de repetição incluem:

|Limite|Padrão|
| ------------------ | ------: |
|Linhas de transição|     256 |
|Tamanho da carga do lote|256 KiB|
| FRI camadas         |      16 |
|Aberturas de consulta|     128 |

## Nexus Relés Verificados {#nexus-verified-relays}

Nexus AXT os contêineres de dados de prova podem incorporar um `AxtFastpqBinding`. Quando `RegisterVerifiedLaneRelay` é executado, Iroha:

1. verifica o contêiner de dados do relé da pista de execução e o material de prova FastPQ
2. verifica o espaço de dados e o root do manifesto técnico
3. decodifica o contêiner de dados de prova AXT
4. requer um `fastpq_binding`
5. reconstrói o lote FastPQ a partir dessa vinculação
6. decodifica a prova incorporada FastPQ
7. chama o verificador FastPQ no lote reconstruído e na prova

Se a verificação for bem-sucedida, Iroha armazena um `VerifiedLaneRelayRecord` contendo a referência do relé, o contêiner de dados original, o hash criptográfico da carga de prova, a altura de verificação, a raiz do manifesto técnico e a vinculação FastPQ.

Os envelopes de retransmissão das vias também transportam material compacto de prova FastPQ. Esse material resume o ID da via, o ID do espaço de dados, a altura do bloco, a altura de verificação, o hash do cabeçalho do bloco, o hash de liquidação e a raiz do manifesto. Uma retransmissão só pode ser mesclada quando contém um QC e material de prova FastPQ válido.

### AXT Vinculação Matemática {#axt-binding-math}

Para os contêineres de dados Nexus AXT, `AxtFastpqBinding` é normalizado em forma canônica antes da repetição da prova. Valores de parâmetros vazios usam `fastpq-lane-balanced` por padrão; identificador e versão vazios do verificador usam `fastpq` e `v1`; o tipo de declaração é aparado e convertido para minúsculas.

Os AXT FastPQ inputs públicos são hashes criptográficos de bytes determinísticos:

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

AXT as chaves de transição são:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

A reivindicação `authorization` insere uma linha de concessão de função:

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

e uma linha de metadados vinculando a política de autorização. A reivindicação `compliance` insere duas linhas de metadados: uma para a política e outra para os dataspaces de destino.

Para `tx_predicate` e `value_conservation`, um valor explícito de efeito é usado quando a vinculação contém um valor de origem ou destino positivo. Caso contrário, o código deriva um valor determinístico limitado:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Então as mesmas equações de transferência são usadas:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Os IDs de conta do remetente e do destinatário sintéticos são gerados a partir de sementes de chave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

O hash criptográfico do lote de transferência é:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

O valor do resumo criptográfico do manifesto técnico do lote AXT é SHA-256 sobre a codificação Norito da vinculação canônica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Provas de Mensagem Transparente {#sccp-transparent-message-proofs}

O pacote de software auxiliar SCCP também utiliza FastPQ para provas de mensagem entre cadeias de forma transparente. Este caminho é separado da linha de execução do provedor de fundo `iroha3d`. Ele cria um lote FastPQ diretamente a partir de um pacote de prova de mensagem SCCP e manifesto técnico, e então embala a prova resultante para verificação aberta.

O lote SCCP usa `fastpq-lane-balanced` e três transições de metadados:

|Tecla|Operação|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Seus insumos públicos são derivados da prova interna transparente SCCP:

| FastPQ entrada | SCCP fonte                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Primeiros 16 bytes de um valor de resumo criptográfico Blake2b sobre o resumo criptográfico da declaração|
| `slot`        |Altura de Finalidade|
| `old_root`    |Hash criptográfico da carga útil|
| `new_root`    |Raiz do compromisso|
| `perm_root`   |Hash criptográfico do bloco de finalização|
| `tx_set_hash` |Declaração de hash criptográfico|

Os codificadores canônicos SCCP escrevem inteiros em little-endian e codificam arrays de bytes de comprimento variável como:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

A sequência de bytes de entrada pública transparente é:

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

Os bytes da declaração transparente são a concatenação de versão, família da cadeia, domínios local e da contraparte, modelo de segurança, governança da âncora, codec da conta, modelo de finalização, alvo do verificador, família do backend do verificador, campos de cadeia/backend/manifestações com comprimento prefixado, vinculação de destino, hash criptográfico, chave de codec da conta, tipo de carga útil, bytes de entrada pública e hash criptográfico da carga útil. O hash criptográfico da declaração é:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

O identificador de espaço de dados FastPQ desse caminho de prova corresponde aos primeiros dezesseis bytes de outro resumo Blake2b prefixado:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

O lote SCCP FastPQ é exatamente:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

então ordenados pela mesma regra de ordenação FastPQ.

O compromisso do verificador OpenVerify é SHA-256 sobre o nome do backend da mensagem SCCP e o descritor canônico do verificador FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

A prova bruta FastPQ é codificada em Norito em um `StarkFriOpenProofV1`, depois envolvida em um `OpenVerifyEnvelope` com backend `Stark`. A verificação SCCP reconstrói o mesmo FastPQ lote do pacote e manifesto técnico, verifica os metadados do contêiner de dados de verificação aberto e chama o verificador FastPQ no lote reconstruído e na prova.

## Conjuntos de Parâmetros {#parameter-sets}

O catálogo canônico de parâmetros expõe dois conjuntos de parâmetros. O canal de execução do provador anfitrião atualmente usa `fastpq-lane-balanced`.

|Parâmetro|Propósito|Campo                          |hashes criptográficos| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |throughput equilibrado do provedor|Extensão quadrática de Cachinhos Dourados|Compromissos do Poseidon2, catálogo SHA3 etiqueta|aritidade 8, explosão 8, 46 consultas|
| `fastpq-lane-latency`  |linhas de execução sensíveis à latência|Extensão quadrática de Cachinhos Dourados|Compromissos do Poseidon2, catálogo SHA3 etiqueta|aritmética 16, explosão 16, 34 consultas|

Ambos têm como alvo segurança de 128 bits e usam um tamanho de domínio de rastreamento de `2^16`. O código de reprodução de transcrição Rust V1 atualmente deriva bytes de desafio Fiat-Shamir com `iroha_crypto::Hash::new` em vez de invocar diretamente SHA3-256.

As constantes de catálogo exatas usadas pelo provador Rust são:

|Constante| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
| `trace_root`         |   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## Configuração {#configuration}

A configuração FastPQ está aninhada sob `zk.fastpq`.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

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

Os mesmos rótulos de execução e telemetria podem ser substituídos a partir de `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Variáveis de ambiente também são suportadas para os campos de configuração. As variáveis específicas do FastPQ incluem:

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

Quando a telemetria é habilitada, FastPQ exporta métricas para a seleção de backend e o comportamento do tempo de execução do software Metal:

|Métrica|Significado|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de execução solicitado e resolvido por rótulos de back-end e dispositivo|
| `fastpq_poseidon_pipeline_total`  |Caminho da linha de processamento do Poseidon solicitado e resolvido|
| `fastpq_metal_queue_depth`        |Limite de fila de metal, contagem máxima em voo, contagem de despacho e janela de amostragem|
| `fastpq_metal_queue_ratio`        |Fila de metal ocupada e taxas de sobreposição|
| `fastpq_zero_fill_duration_ms`    |Duração de preenchimento com zeros do host para execuções Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Largura de banda derivada com preenchimento de zeros|

Para a triagem geral de desempenho, use estes com os sinais de consenso e de fila listados em [Desempenho e Métricas](/pt/guide/advanced/metrics.md).

## Referência Relacionada {#related-reference}

- [Esquema do Modelo de Dados](/pt/reference/data-model-schema.md) para a visualização de dados ponto no tempo do tipo autoritativo do nó
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ opções](/pt/reference/iroha3d-cli.md#fastpq-overrides)
