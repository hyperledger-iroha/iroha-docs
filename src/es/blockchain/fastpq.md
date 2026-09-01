---
translation_locale: es
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ es la ruta de prueba STARK de Iroha para los efectos de ejecución seleccionados. No reemplaza la ejecución normal de transacciones ni el consenso. Las transacciones aún ejecuta ISI, IVM y Sumeragi como de costumbre; FastPQ consume el testigo de ejecución determinista y convierte los efectos soportados en lotes de pruebas.

La integración actual del host tiene tres caminos principales:

- transferencias de activos numéricos transparentes registradas durante la ejecución del bloque
- Nexus verificó los relés de carril de ejecución cuyo contenedor de datos de prueba AXT lleva un enlace FastPQ
- SCCP asistentes de prueba de mensajes transparentes que envuelven una prueba FastPQ en un contenedor de datos de verificación abierta

## Ruta de transferencia de testigos {#transfer-witness-path}

Las transferencias numéricas transparentes crean una transcripción de transferencia estructurada cuando la instrucción altera los saldos. La transcripción registra:

- la cuenta de origen, la cuenta de destino, la definición del activo y el monto
- saldos del remitente y del receptor antes y después de la transferencia
- el hash criptográfico del punto de entrada de la transacción utilizado como el hash criptográfico del lote
- un valor de resumen criptográfico principal de autorización derivado de la cuenta que envía
- un resumen Poseidon para transcripciones de delta único

Las transferencias por lotes usan una transcripción con múltiples deltas. En ese caso, el valor del digestio criptográfico Poseidon de un solo delta está ausente.

En la finalización del bloque, Iroha agrupa estas transcripciones por el hash criptográfico del punto de entrada. El testigo de ejecución luego lleva tanto los paquetes originales de transcripciones como los lotes de transición FastPQ preparados para el demostrador.

Cada delta de transferencia se convierte en dos filas de transición:

|Fila|Forma de llave|Pre-valor| Posvalor |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|Débito del remitente| `asset/<asset-definition>/<source-account>`      |saldo del remitente antes| saldo del remitente después de |
|Crédito del receptor| `asset/<asset-definition>/<destination-account>` |saldo del receptor antes|saldo del receptor después|

Los valores numéricos se normalizan en unidades testigo enteras. Un valor se rechaza para el procesamiento por lotes FastPQ si no puede representarse como un `u64` no negativo en la escala decimal seleccionada.

## Entradas públicas {#public-inputs}

Cada lote de transición FastPQ lleva entradas públicas que vinculan la prueba al bloque y al contexto de ejecución:

|entrada|Significado|
| ------------- | --------------------------------------------------------------- |
| `dsid`        |Identificador de espacio de datos codificado como bytes en orden little-endian|
| `slot`        |Tiempo de creación del bloque convertido a nanosegundos|
| `old_root`    |Raíz del estado principal derivada del testigo de ejecución|
| `new_root`    |Raíz del estado posterior derivada del testigo de ejecución|
| `perm_root`   |Compromiso Poseidon sobre permisos de roles activos|
| `tx_set_hash` |hash criptográfico sobre la transacción ordenada y el punto de entrada activado por tiempo hashes criptográficos|

El anfitrión utiliza `fastpq-lane-balanced` como el conjunto de parámetros canónico para estos lotes.

## Modelo Matemático {#mathematical-model}

Esta sección describe la aritmética implementada por el actual verificador y probador Rust. Todas las operaciones de campo a continuación son sobre el campo primo Goldilocks:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ utiliza Poseidon2 sobre `F` para compromisos de campo. La esponja tiene un ancho de `t = 3`, una tasa de `r = 2` y una capacidad de `1`. El hash criptográfico absorbe elementos de campo en bloques de tasa 2 y añade un único elemento de campo `1` antes de la permutación final:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

Las cadenas de bytes se empaquetan en extremidades de 7 bytes en little-endian, de modo que cada extremidad está estrictamente por debajo de `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

Los hashes criptográficos de campos separados por dominio se representan como:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

Para los hashes criptográficos que comienzan a partir de resúmenes criptográficos en el dominio de bytes, FastPQ asigna los primeros ocho bytes en little-endian al campo:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

Aquí `Hash` significa el `iroha_crypto::Hash::new` de Iroha, un valor de resumen criptográfico de 32 bytes Blake2bVar, a menos que una fórmula nombre explícitamente Poseidon2 o SHA-256.

### Aritmética de campo {#field-arithmetic}

El código Rust representa los elementos del campo como valores canónicos `u64` en `[0,p)`. La suma y la resta son:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

La multiplicación primero calcula el producto de 128 bits:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

La reducción de Ricitos de Oro luego usa la identidad:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

Si:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

entonces el reductor calcula:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

La implementación agrega o resta condicionalmente `p` hasta que el resultado sea canónico. Los enteros con signo, como los cambios de saldo, se incorporan mediante:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### Permutación Poseidon2 {#poseidon2-permutation}

El estado de permutación de Poseidon2 es:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

Su S-box es:

$$
S(x)=x^5
$$

FastPQ utiliza cuatro rondas completas, cincuenta y siete rondas parciales, y luego cuatro rondas completas más. Una ronda completa con constantes de ronda `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` es:

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

Todas las sumas y multiplicaciones están en `F`. La matriz canónica MDS es:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

El hash criptográfico de campo comienza desde el estado cero. Para cada bloque completo de tasa 2 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

El bloque final añade el elemento de relleno `1` antes de una última permutación. La salida es `x_0`.

### Vinculación de Entrada Pública {#public-input-binding}

El anfitrión codifica un ID de espacio de datos escribiendo su valor `u64` en los primeros ocho bytes en formato little-endian del campo de 16 bytes:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

El tiempo de creación del bloque se convierte de milisegundos a nanosegundos:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

El hash del conjunto de transacciones se calcula en el dominio de bytes a partir de los hashes de los puntos de entrada ordenados:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

donde `h_i` son hashes criptográficos de puntos de entrada de transacciones ordenadas y activadas por tiempo. En la prueba pública IO, si `perm_root` o `tx_set_hash` son todos ceros, el demostrador completa con valores de reemplazo:

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

### Normalización Numérica {#numeric-normalization}

Para cada delta de transferencia, la escala decimal objetivo es la escala recortada máxima entre el monto y ambas vistas de datos de saldo en un punto en el tiempo:

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

Un valor `Numeric` con mantisa `m` y escala `q` se acepta solo cuando `m >= 0` y `q <= s`. Su valor testigo FastPQ es:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

El resultado normalizado debe caber en `u64`.

### Orden Canónico {#canonical-ordering}

Antes de la construcción de la traza, el lote se ordena por clave de transición, rango de operación e índice de inserción original:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

El compromiso de ordenamiento es un hash criptográfico de campo Poseidon2 sobre el dominio `fastpq:v1:ordering` y la codificación Norito de las transiciones ordenadas:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

donde `P` es un empaquetado de 7 bytes, `E` es la codificación Norito, `D_o` es `fastpq:v1:ordering`, y `T*` es la lista de transiciones ordenada.

### Ecuaciones de transferencia {#transfer-equations}

Para una cantidad de transferencia `a`, saldo del remitente `f` y saldo del receptor `t`, FastPQ valida los valores normalizados del testigo antes de construir la traza:

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

Dentro del rastro, los deltas con signo se reducen a `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

El valor de resumen criptográfico de transferencia de delta único opcional compromete la preimagen de transferencia codificada:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

Para las transcripciones de transferencia multi-delta, el formato actual requiere que este valor de resumen criptográfico de nivel superior esté ausente.

El valor del resumen criptográfico principal de autorización del anfitrión para las transcripciones de transferencia es:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### Filas de trazo {#trace-rows}

Deje que la lista de transición ordenada contenga `n` filas reales. La longitud del rastro es la siguiente potencia de dos:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

Las filas `0..n-1` están activas; las filas `n..N-1` son filas de relleno. Cada fila real tiene un selector de operación configurado:

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

Las filas de búsqueda de permisos son exactamente filas de concesión de roles y filas de revocación de roles:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

Para filas de operación numérica:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

El constructor también rastrea las diferencias por activo en ejecución:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

Solo las filas de emisión y quema actualizan el contador de suministro:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Las columnas de trazado de metadatos y espacio de datos son hashes criptográficos de campo derivados antes de la materialización de filas:

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

El hash de los metadatos, el del espacio de datos y la ranura se mantienen estables entre filas de traza adyacentes:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Columnas de Merkle de Transferencia {#transfer-merkle-columns}

Las filas de transferencia llevan un camino Merkle disperso de 32 niveles. Si falta una prueba del host, el demostrador sintetiza un camino determinista a partir de la clave de la fila, el saldo previo y si la fila corresponde al lado del remitente o del receptor.

Para rutas sintéticas, la sal de sabor es `fastpq:smt:from` para filas de remitente y `fastpq:smt:to` para filas de receptor:

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

El rastreo registra el bit `b_l`, el hermano `s_l`, el nodo de entrada `x_l` y el nodo de salida `x_{l+1}` en cada nivel. Con la convención de ramas del código:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### Permiso de hashes criptográficos {#permission-hashes}

Conceder y revocar filas de roles hash criptográfico el permiso testigo:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

La tabla de permisos del host root ordena las entradas por bytes de rol, bytes de permisos y bytes de época, luego construye un árbol Merkle Poseidon2:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

Los niveles de ancho impar duplican el elemento final.

### Compromiso de trazabilidad {#trace-commitment}

Para cada columna de traza `c`, FastPQ primero interpola los valores de la columna sobre el dominio de la traza y genera un hash criptográfico del vector de coeficientes:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

La raíz de traza es una raíz Merkle de Poseidon2 sobre los compromisos de columna:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

El compromiso final de la traza es un hash de bytes del dominio, el conjunto de parámetros, la forma de la traza, los resúmenes de las columnas y la raíz de la traza:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

donde `D_c` es `fastpq:v1:trace_commitment`.

### AIR Composición {#air-composition}

El valor de composición V1 AIR es una combinación lineal de residuos locales por fila. La transcripción toma muestras de dos desafíos:

$$
\alpha_0,\alpha_1 \in F
$$

Para cada par de filas adyacentes `(i,i+1)`, el demostrador calcula:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

Los residuos `rho` son, en orden de código:

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

Y para columnas de contexto de lote estables:

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

El verificador recalcula `A_i` para las aperturas de filas muestreadas y lo verifica contra el valor de composición comprometido bajo la raíz Merkle de composición AIR.

### Buscar producto {#lookup-product}

El acumulador de búsqueda de permisos utiliza el desafío Fiat-Shamir `gamma`. Sobre las evaluaciones de extensión de bajo grado de `s_perm` y `perm_hash`, el producto en ejecución es:

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

El registro de la prueba:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### Extensión de bajo grado {#low-degree-extension}

Sea `omega_T` el generador del dominio de trazas, `omega_E` el generador del dominio de evaluación, y `g` el desplazamiento de coset configurado. Para una columna de trazas con valores `v_i`, la interpolación produce coeficientes `a_j` tales que:

$$
f(\omega_T^i)=v_i
$$

La extensión de bajo grado evalúa el mismo polinomio en el coset:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

La implementación calcula esto multiplicando los coeficientes por las potencias del desplazamiento del coset antes de FFT:

$$
a'_j = a_j g^j
$$

y luego evaluando `a'` en el dominio de evaluación.

La transformada CPU FFT es una transformada Cooley-Tukey de radix-2 iterativa sobre entradas con bits invertidos. En la longitud de etapa `L`, la mitad de longitud `H=L/2`, y la raíz de etapa:

$$
\omega_L=\omega^{N/L}
$$

cada mariposa calcula:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

El inverso FFT ejecuta la misma transformación con `omega^{-1}` y se escala por el tamaño inverso del dominio:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

Las raíces del catálogo se validan antes de su uso:

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

### Resúmenes criptográficos de fila y hoja {#row-and-leaf-hashes}

Después de LDE, FastPQ calcula hashes criptográficos de cada fila a través de todas las columnas LDE. Para `m` columnas:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

Si los hashes criptográficos de las filas todavía están en el dominio de trazas en lugar del dominio de evaluación, el probador interpola y extiende esa única columna de hash de fila con el mismo proceso de coset LDE.

### Aperturas de Merkle {#merkle-openings}

Los valores de LDE se agrupan en bloques de:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

Cada hoja de fragmento es:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

Los padres de Merkle son:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

Los niveles impares duplican el último nodo. Los caminos de consulta se verifican mediante el hash de la izquierda o la derecha según la paridad del índice de la hoja de consulta en cada nivel.

Para una hoja en el índice `i`, una ruta `(s_0,\ldots,s_{d-1})` se verifica contra la raíz `R` mediante la recurrencia:

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

La verificación pasa solo cuando:

$$
y_d=R
$$

AIR las hojas de la fila de seguimiento son:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR las hojas de composición son:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

La apertura de la consulta LDE también verifica que el valor abierto en el índice de evaluación `i` esté presente en su fragmento autenticado:

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

FRI se compromete con las evaluaciones de composición de AIR. Para cada ronda `l`, la transcripción toma como muestra un desafío `beta_l`. La capa se rellena hasta un múltiplo de la aridad repitiendo el último valor. Cada grupo del tamaño de la aridad se pliega en:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

donde `a` es la aridad de FRI. El verificador comprueba, para cada cadena de consulta muestreada, que:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

y autentica cada grupo FRI abierto contra la raíz de capa correspondiente FRI.

### Transcripción Fiat-Shamir {#fiat-shamir-transcript}

El catálogo de parámetros canónicos etiqueta el hash criptográfico de la transcripción como SHA3-256. La implementación actual de probador y verificador deriva bytes de desafío con `iroha_crypto::Hash::new`, que es un valor de digest criptográfico Blake2bVar de 32 bytes, luego reduce los primeros ocho bytes en orden little-endian a `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

Las llamadas de desafío agregan el valor completo del resumen criptográfico al estado de la transcripción. El orden de repetición es:

1. público IO, versión del protocolo, versión del parámetro y nombre del parámetro
2. LDE raíz y raíz cuadrada
3. `gamma`
4. AIR desafíos de composición `alpha_0`, `alpha_1`
5. AIR raíz de traza y AIR raíz de composición
6. buscar gran producto
7. FRI capas de raíces y `beta_l` desafíos
8. índices de consulta muestreados

El muestreo de consultas sigue extrayendo resúmenes criptográficos de desafío de 32 bytes y leyéndolos como bloques little-endian `u64` hasta que tenga el número solicitado de índices únicos:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

El conjunto muestreado se devuelve en orden ordenado.

### Reproducción del verificador {#verifier-replay}

El verificador primero vuelve a calcular el compromiso del lote:

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

Cada campo debe coincidir con los IO públicos de la prueba byte por byte. Luego, el verificador reconstruye la misma transcripción y obtiene lo mismo:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

Para cada consulta muestreada `q`, se verifica:

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

La apertura de la composición AIR debe autenticarse bajo `R_air_composition`. La cadena FRI luego comienza desde el mismo `A_q` y debe terminar en una hoja final FRI autenticada bajo la raíz terminal FRI.

## Lo Que Verifica el Verificador {#what-the-prover-checks}

Antes de construir la traza, el verificador FastPQ normaliza el orden del lote en forma canónica por clave de transición, rango de operación y orden de inserción. Las filas de transferencia también requieren metadatos de transcripción. Un lote con filas de transferencia pero sin transcripciones de transferencia es inválido.

Para las transcripciones de transferencia, las verificaciones por parte del proveedor incluyen:

- el saldo del remitente no debe desbordarse
- `sender_after` debe ser igual a `sender_before - amount`
- `receiver_after` debe ser igual a `receiver_before + amount`
- La transcripción debe cubrir cada fila de transferencia en el lote
- cuando exista, el resumen Poseidon de delta único debe coincidir con la preimagen de la transcripción
- las pruebas de Merkle dispersas proporcionadas deben decodificarse como versión 1; los caminos faltantes se rellenan con pruebas sintéticas deterministas

La traza contiene columnas de selector para filas de transferencia, emisión, quema, concesión de roles, revocación de roles, configuración de metadatos y consulta de permisos. Las filas de operaciones numéricas también llevan deltas con signo, deltas acumulativos por activo y contadores de suministro.

## Carril de ejecución del verificador {#prover-lane}

`iroha3d` inicia la línea de ejecución del probador FastPQ al arrancar si se puede inicializar el backend del probador. La línea de ejecución es una tarea en segundo plano con una cola limitada. Después de que un bloque produce un testigo de ejecución, la ruta de confirmación envía un trabajo de demostrador que contiene el hash criptográfico del bloque, la altura, la vista y el testigo.

Si la línea de ejecución no está funcionando o la cola está llena, el trabajo se omite y el procesamiento normal del bloque continúa. Esto significa que la línea de ejecución del probador en segundo plano no es una puerta de admisión de transacciones ni de consenso. Es una vía de producción de pruebas sobre un estado que ya ha sido ejecutado.

El carril de ejecución construye un verificador con:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Ambas configuraciones predeterminan a `cpu`. Seleccionar `gpu` es una solicitud explícita de cierre por fallo: si el soporte de GPU no está compilado o se solicita un backend GPU falla la verificación previa, la línea de ejecución del demostrador permanece deshabilitada. La primera versión no tiene valor `auto` y no retrocede de un modo GPU solicitado a CPU.

## Verificación {#verification}

FastPQ La verificación de la prueba reconstruye el compromiso de lote canónico y reproduce la transcripción pública. El verificador comprueba la versión del protocolo, la versión del conjunto de parámetros, los límites de repetición, el compromiso de trazas, las entradas públicas, las aperturas Merkle muestreadas, AIR aperturas, y la cadena de consultas FRI.

Los límites de repetición predeterminados incluyen:

| Límite |predeterminada|
| ------------------ | ------: |
|Filas de transición|     256 |
|Tamaño de la carga por lote| 256 KiB |
| FRI capas         |      16 |
|Consultas abiertas|     128 |

## Nexus Relevadores Verificados {#nexus-verified-relays}

Nexus AXT los contenedores de datos de prueba pueden incrustar un `AxtFastpqBinding`. Cuando `RegisterVerifiedLaneRelay` se ejecuta, Iroha:

1. verifica el contenedor de datos del relé de la vía de ejecución y el material de prueba FastPQ
2. verifica el espacio de datos y la raíz del manifiesto técnico
3. decodifica el contenedor de datos de prueba AXT
4. requiere un `fastpq_binding`
5. reconstruye el lote FastPQ de esa vinculación
6. decodifica la prueba incrustada FastPQ
7. llama al verificador FastPQ en el lote reconstruido y la prueba

Si la verificación tiene éxito, Iroha almacena un `VerifiedLaneRelayRecord` que contiene la referencia de retransmisión, el contenedor de datos original, el hash criptográfico de la carga útil de prueba, la altura de verificación, la raíz del manifiesto técnico y la vinculación FastPQ.

Los contenedores de datos del relé de la vía de ejecución también llevan material de prueba compacto FastPQ. El material es un valor de resumen criptográfico sobre el id de la vía de ejecución, id del espacio de datos, altura del bloque, altura de verificación, hash criptográfico del encabezado del bloque, hash criptográfico de liquidación y raíz del manifiesto técnico. Un relé solo es admisible para fusión cuando tiene tanto un QC como un material de prueba FastPQ válido.

### AXT Matemáticas Vinculantes {#axt-binding-math}

Para los contenedores de datos Nexus AXT, `AxtFastpqBinding` se normaliza en forma canónica antes de repetir la prueba. Los valores de parámetros vacíos por defecto son `fastpq-lane-balanced`; el identificador y la versión del verificador vacíos por defecto son `fastpq` y `v1`; el tipo de declaración se recorta y se convierte a minúsculas.

Los AXT FastPQ insumos públicos son hashes criptográficos de bytes deterministas:

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

AXT las claves de transición son:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

La reclamación `authorization` inserta una fila de concesión de rol:

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

y una fila de metadatos que vincula la política de autorización. La reclamación `compliance` inserta dos filas de metadatos: una para la política y otra para los espacios de datos de destino.

Para `tx_predicate` y `value_conservation`, se utiliza una cantidad de efecto explícita cuando la vinculación contiene una cantidad positiva de origen o destino. De lo contrario, el código deriva una cantidad determinista limitada:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Luego se utilizan las mismas ecuaciones de transferencia:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Los identificadores de cuenta del remitente y del receptor sintéticos se generan a partir de semillas clave:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

El hash criptográfico del lote de transferencia es:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

El valor del resumen criptográfico del manifiesto técnico del lote AXT es SHA-256 sobre la codificación Norito de la vinculación canónica:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP Pruebas de Mensajes Transparentes {#sccp-transparent-message-proofs}

El paquete de software auxiliar SCCP también utiliza FastPQ para pruebas de mensajes inter-cadena transparentes. Esta ruta es independiente de la vía de ejecución del demostrador en segundo plano `iroha3d`. Construye un lote FastPQ directamente a partir de un paquete de prueba de mensaje SCCP y un manifiesto técnico, luego envuelve la prueba resultante para verificación abierta.

El lote SCCP utiliza `fastpq-lane-balanced` y tres transiciones de metadatos:

|Llave|Operación|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

Sus entradas públicas se derivan de la prueba interna transparente SCCP:

| FastPQ entrada | SCCP fuente                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |Primeros 16 bytes de un valor de digestión criptográfica Blake2b sobre el hash criptográfico de la declaración|
| `slot`        |Altura de la finalidad|
| `old_root`    |Hash criptográfico de la carga útil|
| `new_root`    |Compromiso raíz|
| `perm_root`   |Hash criptográfico del bloque de finalidad|
| `tx_set_hash` |Declaración de hash criptográfico|

Los codificadores canónicos SCCP escriben enteros en little-endian y codifican arrays de bytes de longitud variable como:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

La cadena de bytes de entrada pública transparente es:

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

Los bytes de la declaración transparente son la concatenación de la versión, familia de cadenas, dominios local y de la contraparte, modelo de seguridad, gobernanza del anclaje, códec de cuenta, modelo de finalidad, objetivo del verificador, familia de backend del verificador, campos de cadena/backend/manifiesto con prefijo de longitud, vinculación de destino hash criptográfico, clave de códec de cuenta, tipo de carga útil, bytes de entrada pública y hash criptográfico de la carga útil. El hash criptográfico de la declaración es:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

El identificador de espacio de datos FastPQ para este camino de prueba son los primeros dieciséis bytes de otro valor de resumen criptográfico Blake2b con prefijo:

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

luego ordenado según la misma regla de ordenamiento FastPQ.

El compromiso del verificador OpenVerify es SHA-256 sobre el nombre del backend del mensaje SCCP y el descriptor del verificador canónico FastPQ:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

La prueba en bruto FastPQ se codifica en Norito dentro de un `StarkFriOpenProofV1`, y luego se envuelve en un `OpenVerifyEnvelope` con backend `Stark`. La verificación SCCP reconstruye lo mismo FastPQ lote del paquete y manifiesto técnico, verifica los metadatos del contenedor de datos de verificación abierto, y llama al verificador FastPQ en el lote reconstruido y la prueba.

## Conjuntos de parámetros {#parameter-sets}

El catálogo de parámetros canónico expone dos conjuntos de parámetros. La vía de ejecución del verificador anfitrión actualmente utiliza `fastpq-lane-balanced`.

|Parámetro|Propósito|Campo|hashes criptográficos| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |rendimiento equilibrado del verificador|Extensión cuadrática Ricitos de Oro|Compromisos Poseidon2, catálogo etiqueta SHA3|aridad 8, explosión 8, 46 consultas|
|`fastpq-lane-latency`|carriles de ejecución sensibles a la latencia|Extensión cuadrática Ricitos de Oro|Compromisos Poseidon2, catálogo etiqueta SHA3|aridad 16, explosión 16, 34 consultas|

Ambos apuntan a una seguridad de 128 bits y utilizan un tamaño de dominio de traza de `2^16`. El código de reanudación de transcripción Rust V1 actualmente deriva los bytes de desafío de Fiat-Shamir con `iroha_crypto::Hash::new` en lugar de invocar directamente SHA3-256.

Las constantes exactas del catálogo utilizadas por el demostrador Rust son:

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

## Configuración {#configuration}

La configuración FastPQ está anidada bajo `zk.fastpq`.

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

Las mismas etiquetas de ejecución y telemetría pueden ser sobrescritas desde `iroha3d`:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

También se admiten variables de entorno para los campos de configuración. Las variables específicas de FastPQ incluyen:

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

Cuando la telemetría está habilitada, FastPQ exporta métricas para la selección de backend y el comportamiento en tiempo de ejecución del software Metal:

|métrica|Significado|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |Modo de ejecución solicitado y resuelto por las etiquetas del backend y del dispositivo|
|`fastpq_poseidon_pipeline_total`|Ruta solicitada y resuelta del canal Poseidon|
| `fastpq_metal_queue_depth`        |Límite de cola de metal, recuento máximo en curso, recuento de envío y ventana de muestreo|
| `fastpq_metal_queue_ratio`        |Cola de metal ocupada y ratios de superposición|
| `fastpq_zero_fill_duration_ms`    |Duración de llenado con ceros en el host para ejecuciones de Metal|
| `fastpq_zero_fill_bandwidth_gbps` |Ancho de banda derivado con relleno de ceros|

Para la evaluación general del rendimiento, utilice estos con las señales de consenso y de cola listadas en [Rendimiento y Métricas](/es/guide/advanced/metrics.md).

## Referencia relacionada {#related-reference}

- [Esquema del Modelo de Datos](/es/reference/data-model-schema.md) para la vista de datos de tipo nodo-autoritativo en un momento determinado
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ opciones](/es/reference/iroha3d-cli.md#fastpq-overrides)
