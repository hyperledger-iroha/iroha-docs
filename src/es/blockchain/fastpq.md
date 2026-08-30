---
translation_locale: es
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ es Iroha¿ Qué es ? STARK no sustituye a la ejecución normal de transacciones o al consenso. Las transacciones aún se ejecutan ISI, IVM, y Sumeragi como de costumbre; FastPQ Consume el testigo de ejecución determinista y convierte los efectos apoyados en lotes de pruebas.

La integración actual del host tiene tres vías principales:

- Transferencias numéricas transparentes de activos registradas durante la ejecución del bloque
- Relées de vía Nexus verificados cuyo envase de prueba AXT lleva una unión FastPQ
- SCCP auxiliares transparentes de prueba de mensaje que envuelven una prueba FastPQ en un sobre de verificación abierto.

## Trasladar el camino del testimonio {#transfer-witness-path}

Las transferencias numéricas transparentes crean una transcripción de transferencia estructurada cuando la instrucción muta los equilibrios.

- la cuenta de origen, la cuenta de destino, la definición del activo y el importe
- Saldos del remitente y el receptor antes y después de la transferencia
- el hash del punto de entrada de la transacción utilizado como el hash del lote
- un registro de la autoridad derivado de la cuenta de presentación
- Una digestión de Poseidon para transcripciones de un solo delta

Las transferencias de lotes utilizan una transcripción con múltiples deltas. en ese caso la digestión de Poseidón de un solo delta está ausente

En la finalización del bloque, Iroha agrupa estas transcripciones por hash de punto de entrada. El testigo de ejecución lleva entonces tanto los paquetes originales de transcripción como los lotes de transición FastPQ preparados para el prover.

Cada delta de transferencia se convierte en dos filas de transición:

|La fila |Forma de la llave|Prevalor |Después del valor |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Debito del remitente |`asset/<asset-definition>/<source-account>` |el saldo del remitente antes |el saldo del remitente después |
|Crédito del receptor |`asset/<asset-definition>/<destination-account>` |el saldo del receptor antes |saldo del receptor después de |

Los valores numéricos se normalizan en unidades de testigos enteras. Un valor es rechazado para el lote FastPQ si no puede ser representado como un `u64` no negativo en la escala decimal seleccionada.

## Ingresos públicos {#public-inputs}

Cada lote de transición FastPQ contiene entradas públicas que vinculan la prueba al contexto del bloque y la ejecución:

|Entradas |El significado .|
| ------------- | --------------------------------------------------------------- |
|`dsid` |Identificador de espacio de datos codificado como pequeños bytes indianos |
|`slot` |El tiempo de creación del bloque convertido en nanosegundos |
|`old_root` |Raíz del estado de origen derivada del testigo de la ejecución |
|`new_root` |Raíz post-estado derivada del testigo de la ejecución |
|`perm_root` |El compromiso de Poseidón con los permisos para el papel activo |
|`tx_set_hash` |Hash sobre las transacciones ordenadas y los hashes de puntos de entrada del trigger de tiempo |

El host utiliza `fastpq-lane-balanced` como el parámetro canónico establecido para estos lotes.

## Modelo matemático {#mathematical-model}

Esta sección describe la aritmética implementada por el probador y verificador corriente Rust. Todas las operaciones de campo a continuación se realizan sobre el campo primario Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ utiliza Poseidon2 sobre `F` para los compromisos de campo. La esponja tiene ancho `t = 3`, tasa `r = 2` y capacidad `1`. El hash absorbe elementos de campo en bloques de tasa-2 y añade un solo elemento de campo `1` antes de la permutación final:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Las cadenas de byte están empaquetadas en extremidades pequeñas de 7 bytes para que cada miembro esté estrictamente por debajo de `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Los hashes de campo separados por dominio se representan como:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Para hashes que comienzan a partir de digestos de dominio byte, FastPQ mapea los primeros ocho bytes pequeños en el campo:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Aquí `Hash` significa el `iroha_crypto::Hash::new` de Iroha, un digesto Blake2bVar de 32 bytes, a menos que una fórmula nombre explícitamente Poseidon2 o SHA-256.

### La aritmética de campo {#field-arithmetic}

El Consejo Rust el código representa los elementos de campo como canónicos `u64` los valores en `[0,p)`. La adición y la subtracción son:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

La multiplicación calcula primero el producto de 128 bits:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

La reducción de Goldilocks entonces utiliza la identidad:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Si:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

entonces el reducidor calcula:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

La implementación añade o subtrae condicionalmente `p` hasta que el resultado sea canónico. Los números enteros firmados, como los deltas de equilibrio, están incrustados por:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Poseidón 2 Permutación {#poseidon2-permutation}

El estado de permutación Poseidon2 es:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Su S-box es:

$$
S(x)=x^5
$$

FastPQ utiliza cuatro rondas completas, cincuenta y siete rondas parciales, luego otras cuatro rondas. Una ronda completa con constantes redondas `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` es:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

Una ronda parcial es:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

Todas las adiciones y multiplicaciones están en `F`. La matriz canónica MDS es:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

El hash de campo comienza a partir del estado cero. Para cada bloque completo de tasa-2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

El bloque final añade el elemento relleno `1` antes de una última permutación. La salida es `x_0`.

### Obligatoriedad de las entradas públicas {#public-input-binding}

El host codifica una identificación del espacio de datos escribiendo su valor `u64` en los primeros ocho bytes de pequeño índice del campo de 16 bytes:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

El tiempo de creación de bloques se convierte de milisegundos a nanosegundos:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

El hash del conjunto de transacciones es un hash del dominio byte sobre los hashes del punto de entrada ordenados:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

donde `h_i` son hashes de transacciones ordenadas y puntos de entrada del tiempo desencadenante. En la prueba pública IO, si `perm_root` o `tx_set_hash` es todo cero, el proveedor llena los valores fallback:

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

### Normalización numérica {#numeric-normalization}

Para cada delta de transferencia, la escala decimal objetivo es la escala máxima recortada a través de la cantidad y ambos instantáneos de equilibrio:

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

Un valor `Numeric` con mantissa `m` y escala `q` sólo se acepta cuando `m >= 0` y `q <= s`. Su valor testigo FastPQ es:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

El resultado normalizado debe ajustarse a `u64`.

### Ordenamiento canónico {#canonical-ordering}

Antes de la construcción del rastro, el lote se clasifica por llave de transición, rango de operación e índice de inserción original:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

El compromiso de orden es un hash del campo Poseidon2 sobre el dominio `fastpq:v1:ordering` y la codificación Norito de las transiciones clasificadas:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

donde `P` es un embalaje de 7 bytes, `E` es Norito codificación, `D_o` es `fastpq:v1:ordering`, y `T*` es la lista de transición ordenada.

### Las ecuaciones de transferencia {#transfer-equations}

Para un importe de transferencia `a`, balance del remitente `f` y balance del receptor `t`, FastPQ valida los valores normalizados de testigos antes de construir el rastro:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

Las filas de transición luego codifican:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

En el interior del rastro, los deltas firmados se reducen a `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

El digesto de transferencia de un solo delta opcional compromete la preimagen de transferencia codificada:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Para las transcripciones de transferencia multi-delta, el formato actual requiere que este digesto de nivel superior esté ausente.

La autoridad de acogida digesta para las transcripciones de transferencia es:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Las filas de rastreo {#trace-rows}

Que la lista de transición ordenada contenga filas reales `n`. La longitud del rastro es el siguiente poder de dos:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Las filas `0..n-1` son activas; las filas `n..N-1` son filas de relleno. Cada fila real tiene un conjunto de selectores de operación:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

Todas las columnas de selector son booleanas:

$$
s(s-1)=0
$$

Las filas de búsqueda de permisos son exactamente las filas de concesión de funciones y revocación de funciones:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Para las filas de operaciones numéricas:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

El constructor también realiza un seguimiento de los deltas por activo:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Solo las filas de menta y quemadura actualizan el contador de suministro:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metadatos y columnas de rastreo del espacio de datos son hashes de campos derivados antes de la materialización de filas:

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

El hash de metadatos, el hash del espacio de datos y la ranura son estables en las filas adyacentes de rastros:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Transferencia de las columnas de Merkle {#transfer-merkle-columns}

Las filas de transferencia llevan una trayectoria Merkle escasa de 32 niveles. Si falta una prueba host, el probador sintetiza un camino determinista desde la llave de fila, pre-equilibrio y si la fila es el lado del remitente o receptor.

Para las vías sintéticas, la sal de sabor es `fastpq:smt:from` para las filas remitentes y `fastpq:smt:to` para las filaes receptoras:

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

La hoja sintética y los nodos internos son:

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

El rastro registra el bit `b_l`, hermano `s_l`, nodo de entrada `x_l` y nodo de salida `x_{l+1}` en todos los niveles. Con la convención rama del código:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Hashes de permisos {#permission-hashes}

Las filas de asignación y revocación de roles hash el testigo de permisos:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

La tabla de permisos host clasifica las entradas por bytes de roles, bytes de permisos y bytes de épocas, luego construye un árbol Poseidon2 Merkle:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Los niveles de ancho impar duplican el elemento final.

### El compromiso de rastrear {#trace-commitment}

Para cada columna de trazas `c`, FastPQ interpola primero los valores de la columna sobre el dominio de trazas y hashes el vector del coeficiente:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

La raíz de rastro es una raíz Poseidon2 Merkle sobre los compromisos de columna:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

El compromiso de rastreo final es un hash de byte sobre el dominio, conjunto de parámetros, forma de rastreo, digestos de columnas y raíz de rastreo:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

en el que `D_c` es `fastpq:v1:trace_commitment`.

### AIR Composición {#air-composition}

El valor de composición V1 AIR es una combinación lineal de residuos locales en filas. La transcripción muestra dos retos:

$$
\alpha_0,\alpha_1 \in F
$$

Para cada par de filas `(i,i+1)` adyacente, el prover calcula:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Los residuos `rho` se encuentran en orden de código:

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

Para filas con columnas numéricas:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

Y para columnas de contexto de lotes estables:

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

El verificador recalcula `A_i` para las aberturas de filas incluidas en la muestra y lo comproba con el valor de composición comprometido en virtud de la raíz Merkle de composición AIR.

### Producto de búsqueda {#lookup-product}

El acumulador de búsqueda de permisos utiliza el desafío Fiat-Shamir `gamma`. En las evaluaciones de extensión de bajo grado de `s_perm` y `perm_hash`, el producto en funcionamiento es:

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

Los registros de prueba:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extensión de bajo grado {#low-degree-extension}

Que `omega_T` sea el generador de dominio de rastreo, `omega_E` el generador del dominio de evaluación y `g` el desvio coseto configurado. Para una columna de rastreo con valores `v_i`, la interpolación produce coeficientes `a_j` tales que:

$$
f(\omega_T^i)=v_i
$$

La extensión de bajo grado evalúa el mismo polinomio en el coseto:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

La implementación calcula esto multiplicando los coeficientes por las potencias del coset compensado antes de FFT:

$$
a'_j = a_j g^j
$$

y luego evaluar `a'` en el dominio de evaluación.

El Consejo CPU FFT es una transformación iterativa de radix-2 Cooley-Tukey sobre entradas invertidas en bits. `L`, media longitud `H=L/2`, y raíz de etapa:

$$
\omega_L=\omega^{N/L}
$$

Cada mariposa calcula:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

El inversor FFT realiza la misma transformación con el `omega^{-1}` y se escala por el tamaño del dominio inverso:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Las raíces de catálogo se validarán antes del uso:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

Para dominios más pequeños derivados de la raíz del catálogo, el generador es:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### Haches de fila y hojas {#row-and-leaf-hashes}

Después de LDE, FastPQ hashes cada fila en todas las columnas LDE. Para las columnaras `m`:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Si los hashes de filas están todavía en el dominio trace en lugar del dominio de evaluación, el prover interpola y extiende esa columna de hash de fila única con el mismo proceso coset LDE.

### Las aberturas de Merkle {#merkle-openings}

Los valores de LDE se agrupan en trozos de:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Cada trozo de hoja es:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Los padres de Merkle son:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Los niveles impares duplican el último nodo. Las vías de consulta se verifican hashando izquierda o derecha según la paridad del índice de hoja de consulta en cada nivel.

Para una hoja con índice `i`, un sendero `(s_0,\ldots,s_{d-1})` se verifica contra la raíz `R` por la recidiva:

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

El cheque sólo se aprobará cuando:

$$
y_d=R
$$

Las hojas de las filas AIR son:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

Las hojas de composición AIR son:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

La apertura de la consulta LDE también comprueba que el valor abierto en el índice de evaluación `i` está presente en su parte autenticada:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI Plegado {#fri-folding}

FRI se compromete a evaluar la composición de AIR. Para cada ronda `l`, las muestras de transcripción son un desafío `beta_l`. La capa es empolvada hasta un múltiplo de la aridad repitiendo el último valor. Cada grupo del tamaño de la aredad se pliega a:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

donde `a` es la magnitud de FRI. El verificador comprueba, para cada cadena de consultas recogida en muestra, que:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

y autentica cada grupo FRI abierto con la raíz de capa correspondiente FRI.

### Transcripción de Fiat-Shamir {#fiat-shamir-transcript}

El catálogo de parámetros canónicos etiqueta el hash de la transcripción como SHA3-256. La implementación actual del prover y verificador deriva los bytes de desafío con `iroha_crypto::Hash::new`, que es un digesto de Blake2bVar de 32 bits, luego reduce los primeros ocho bytes pequeños enendianos a `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Las llamadas de desafío añaden el texto completo al estado de la transcripción.

1. público IO, versión del protocolo, versión del parámetro y nombre de parámetro.
2. LDE raíz y raíz de rastro
3. `gamma`
4. Los desafíos de la composición AIR `alpha_0`, `alpha_1`
5. raíz de rastro AIR y raíz de composición AIR
6. gran producto de búsqueda
7. Las raíces de las capas FRI y los desafíos `beta_l`
8. Indices de consulta recogidos en muestra

El muestreo de consulta sigue dibujando digestos de desafío de 32 bytes y los lee como trozos de `u64` pequeños hasta que tenga el número requerido de índices únicos:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

El conjunto de muestras se devuelve en orden ordenado.

### Repetición del verificador {#verifier-replay}

En primer lugar, el verificador recalcula el compromiso de lote:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

y requiere:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

También reconstruye el público IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

Cada campo debe coincidir con el público IO byte-for-byte de la prueba. El verificador luego reconstruye la misma transcripción y deriva la misma:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Para cada consulta incluida en la muestra `q`, se comprueba:

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

y:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

La apertura de la composición AIR debe autenticarse bajo `R_air_composition`. La cadena FRI comienza a partir del mismo `A_q` y termina en una hoja final FRI autenticada debajo de la raíz terminal FRI.

## Lo que comprueba el proverbio {#what-the-prover-checks}

Antes de construir el rastro, el proveedor FastPQ canoniza el orden del lote por clave de transición, rango de operación y orden de inserción. Las filas de transferencia también requieren metadatos de transcripción. Un lote con filas de transmisión pero ninguna transcripción de transferencia es inválido.

En el caso de las transcripciones de transferencia, los controles del lado proveedor incluyen:

- El saldo del remitente no debe fluir por debajo
- `sender_after` debe ser igual a `sender_before - amount`
- `receiver_after` debe ser igual a `receiver_before + amount`
- La transcripción deberá cubrir cada fila de transferencia del lote.
- una digestión de Poseidon de un solo delta, cuando esté presente, deberá coincidir con la preimagen de la transcripción.
- siempre que las pruebas de Merckle escasas se decodifiquen como versión 1; los caminos faltantes se llenan con pruebas sintéticas deterministas.

El rastro contiene columnas selector para transferencia, moneda, quemar, otorgar funciones, revocar funciones, conjunto de metadatos y filas de búsqueda de permisos. Las filas de operaciones numéricas también llevan deltas firmadas, delta por activo y contadores de suministro.

## Probable Lane {#prover-lane}

`iroha3d` inicia la vía de verificación FastPQ en el inicio si se puede iniciar el backend de verificación. La vía es una tarea de fondo con una cola limitada. Después de que un bloque produce un testigo de ejecución, el camino de compromiso presenta un trabajo de verificación que contiene el hash del bloque, altura, vista y testigo.

Si el carril no está funcionando o la cola está llena, se omite el trabajo y continúa el procesamiento normal de bloques. Esto significa que el carril de provedor de fondo no es una entrada de transacción o puerta de consenso. Es un camino de prueba de producción sobre el estado que ya ha sido ejecutado.

El carril construye un provedor con:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` dejará que el proveedor elija el backend disponible. `cpu` ejecución de pines a la CPU. `gpu` las preferencias GPU la ejecución, con CPU fallback donde el backend no puede utilizar los núcleos solicitados.

## Verificación {#verification}

La verificación de prueba FastPQ reconstruye el compromiso canónico del lote y reemplaza la transcripción pública. El verificador verifica la versión del protocolo, la versión con parámetros definidos, los límites de reproducción, el compromiso de rastreo, las entradas públicas, las aberturas de Merkle muestras, las abertas AIR y la cadena de consultas FRI.

Los límites de reproducción por defecto incluyen:

|El límite .|Por defecto .|
| ------------------ | ------: |
|Líneas de transición |     256 |
|Tamaño de carga útil del lote |256 KiB |
|Las capas FRI |      16 |
|Aberturas de consultas |     128 |

## Nexus Relajes verificados {#nexus-verified-relays}

Nexus AXT los sobres de prueba pueden incorporar un `AxtFastpqBinding`. ¿Cuándo? `RegisterVerifiedLaneRelay` ejecuta, Iroha:

1. verifique el envoltorio del relé de vía y el material de prueba FastPQ
2. comprueba el espacio de datos y la raíz del manifiesto
3. Decodifica el envase de prueba AXT
4. Requiere un `fastpq_binding`
5. reconstruye el lote FastPQ a partir de esa unión.
6. decodifica la prueba incrustada FastPQ
7. Llama al verificador FastPQ sobre el lote reconstruido y la prueba

Si la verificación tiene éxito, Iroha almacena un `VerifiedLaneRelayRecord` que contiene la referencia del relé, el sobre original, el hash de carga útil de prueba, la altura de la verificación, la raíz del manifiesto y el enlace FastPQ.

Las envolturas de relé del carril también llevan material comprobante compacto FastPQ. El material es un digesto sobre el identificador del carril, el identificador de espacio de datos, la altura del bloque, la altura de verificación, el hash del encabezado del bloque, el hash de asentamiento y la raíz del manifestos. Un relevo sólo es admisible si posee un material de prueba QC y válido FastPQ.

### AXT Matemáticas vinculadas {#axt-binding-math}

Para los sobres Nexus AXT, `AxtFastpqBinding` se canoniza antes de reproducir la prueba. Los valores del parámetro vacío por defecto a `fastpq-lane-balanced`; id del verificador vacío y versión por defecto para `fastpq` y `v1`; el tipo de reclamación se recorta y baja en categorías.

Las entradas públicas AXT FastPQ son hashes deterministas de byte:

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

Las claves de transición AXT son:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

En la solicitud `authorization` se inserta una fila de asignación de rol:

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

y una fila de metadatos vinculativa a la política de autorización. La solicitud de `compliance` inserta dos filas de metadatos: una para las políticas y otra para los espacios de datos objetivo.

Para `tx_predicate` y `value_conservation`, se utilizará un valor de efecto explícito cuando la vinculación contenga una fuente o cantidad de destino positiva. De lo contrario, el código derivará una cantidad determinista limitada:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Entonces se utilizan las mismas ecuaciones de transferencia:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Las identidades de la cuenta del remitente y del receptor sintéticas se generan a partir de semillas clave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

El hash del lote de transferencia es:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

El manifiesto del lote AXT se digestará en SHA-256 sobre la codificación Norito de la unión canónica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Pruebas de mensajes transparentes {#sccp-transparent-message-proofs}

La caja auxiliar SCCP también utiliza FastPQ para pruebas transparentes de mensajes en cadena cruzada. Este camino está separado del carril de provisión de fondo `iroha3d`. Construye un lote FastPQ directamente a partir de un paquete y manifiesto de prueba de mensaje SCCP, y luego envuelve la prueba resultante para una verificación abierta.

El lote SCCP utiliza el `fastpq-lane-balanced` y tres transiciones de metadatos:

|La llave .|Operación |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

Sus entradas públicas se derivan de la prueba interna transparente SCCP:

|FastPQ entrada |Fuente SCCP |
| ------------- | ---------------------------------------------------------- |
|`dsid` |Los primeros 16 bytes de un Blake2b digest sobre la declaración hash |
|`slot` |Alteza de finalidad |
|`old_root` |Hash de carga útil |
|`new_root` |Raíz del compromiso |
|`perm_root` |El bloque de finalidad hash |
|`tx_set_hash` |Hacienda de declaración |

Los codificadores canónicos SCCP escriben números enteros de pequeña longitud y codifican matrices de byte de longitud variable:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

La cadena de byte de entrada pública transparente es:

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

Los bytes transparentes de las declaraciones son la concatenación de versiones, familia de cadenas, dominios locales y contrapartes, modelo de seguridad, gobernanza de anclaje, códec de cuenta, modelo de finalidad, objetivo del verificador, familia de verificadores backend, campos de cadena/backend/manifiesto prefixados por longitud, hash vinculativo de destino. clave de codec de la cuenta, tipo de carga útil, bytes de entrada pública y hash de carga útil.

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

La identificación del espacio de datos FastPQ para esta ruta de prueba es los primeros dieciséis bytes de otro prefijo de Blake2b digest:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

El lote SCCP FastPQ es exactamente:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

Luego se clasificará por la misma regla de orden FastPQ.

El Consejo OpenVerify el compromiso del verificador es SHA-256 sobre el SCCP el nombre de backend del mensaje y el canonical FastPQ Descriptor del verificador:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

El crudo FastPQ la prueba es Norito- codificado en un `StarkFriOpenProofV1`, y luego envuelto en un `OpenVerifyEnvelope` con backend `Stark`. SCCP la verificación reconstruye el mismo FastPQ el lote del paquete y el manifiesto, verifica los metadatos de la envoltura de verificación abierta y llama al FastPQ el verificador del lote reconstruido y la prueba.

## Los conjuntos de parámetros {#parameter-sets}

El catálogo de parámetros canónicos expone dos conjuntos de parámetros. El carril proveedor de acogida utiliza actualmente `fastpq-lane-balanced`.

|Parámetro |Propósito |El campo |Los hashes |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |un rendimiento de proveedor equilibrado |Goldilocks extensión cuadrática |Los compromisos de Poseidon2, etiqueta del catálogo SHA3 |Arity 8, explosión 8, 46 consultas |
|`fastpq-lane-latency` |rutas sensibles a la latencia |Goldilocks extensión cuadrática |Los compromisos de Poseidon2, etiqueta del catálogo SHA3 |Arity 16, explosión 16, 34 consultas |

Ambos tienen como objetivo la seguridad de 128 bits y utilizan un tamaño de dominio de rastreo de `2^16`. El código de repetición de transcripción Rust V1 actualmente deriva los bytes de desafío Fiat-Shamir con `iroha_crypto::Hash::new` en lugar de invocar directamente SHA3-256.

Las constantes exactas del catálogo utilizadas por el proveedor Rust son:

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

## Configuración {#configuration}

La configuración FastPQ está ubicada debajo de `zk.fastpq`.

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

Las mismas etiquetas de ejecución y telemetría se pueden anotar desde `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

También se admiten variables ambientales para los campos de configuración. Las variables específicas FastPQ incluyen:

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

## Las métricas {#metrics}

Cuando esté habilitada la telemetría, FastPQ exportará métricas para la selección de backend y el comportamiento en el tiempo de ejecución de Metal:

|Métrica .|El significado .|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Modo de ejecución solicitado y resuelto por etiquetas de backend y dispositivo |
|`fastpq_poseidon_pipeline_total` |La ruta del oleoducto Poseidon solicitada y resuelta |
|`fastpq_metal_queue_depth` |Límites de colas metálicas, número máximo en vuelo, número de expediciones y ventana de muestreo |
|`fastpq_metal_queue_ratio` |Cuentas de metales ocupadas y relaciones de superposición |
|`fastpq_zero_fill_duration_ms` |Duración de relleno cero para las carreras de metales |
|`fastpq_zero_fill_bandwidth_gbps` |Ancho de banda de relleno cero derivado |

Para la triaje general del rendimiento, utilice estos con las señales de consenso y filas enumeradas en [Performance and Metrics ](/es/guide/advanced/metrics.md).

## Referencia relacionada {#related-reference}

- [Esquema de modelo de datos ](/es/reference/data-model-schema.md) para los detalles del tipo generados
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [Opciones `iroha3d` FastPQ ](/es/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
