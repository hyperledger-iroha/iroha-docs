---
translation_locale: es
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE significa Evaluación de Funciones Lacónicas de Máquina de Acceso Aleatorio. En Iroha, es la capa genérica de funciones ocultas para programas cuya política pública está en la cadena, pero cuya lógica de evaluador, secreta, o entrada en bruto no debe escribirse en el estado mundial. Se utiliza en los flujos de identificador SORA Nexus, como la búsqueda de teléfono o correo electrónico privado, y también puede exponerse como un ayudante genérico de ejecución de programas Torii cuando un perfil de nodo habilita las rutas orientadas a la aplicación.

La cadena almacena el compromiso de la política y los metadatos de verificación del registro de resultados del protocolo. Un resolutor o Torii tiempo de ejecución de software evalúa el programa oculto, solo devuelve la salida permitida y adjunta un registro de resultado del protocolo que los clientes, las herramientas de soporte o las instrucciones del libro mayor de la blockchain pueden verificar contra la política registrada.

## Nombrando {#naming}

La división de nombres importa:

|Término|Significado|
| --- | --- |
| `ram_lfe` |La abstracción de función oculta externa: políticas del programa, compromisos, registros de resultados del protocolo de ejecución y modo de verificación de registros de resultados del protocolo.|
| `BFV` |El esquema de cifrado homomórfico Brakerski/Fan-Vercauteren utilizado por los backends de entrada cifrada RAM-LFE.|
| `ram_fhe_profile` |Metadatos específicos de BFV para la máquina de ejecución encriptada programada. No es un segundo nombre para RAM-LFE.|

En el modelo de datos, `RamLfeProgramPolicy` y `RamLfeExecutionReceipt` son tipos RAM-LFE. Los parámetros BFV, los contenedores de datos cifrados y el perfil de programa RAM-FHE oculto pertenecen al backend de ejecución cifrada utilizado por una política.

## Lo que graba {#what-it-records}

Una política del programa RAM-LFE está registrada a nivel mundial por `program_id`. La política contiene:

- la cuenta del propietario que puede activar, desactivar o de otro modo modificar la política
- el backend anunciado a los clientes
- el modo de verificación del registro de resultados del protocolo, ya sea `signed` o `proof`
- un compromiso con los metadatos del programa oculto y el secreto del evaluador
- la clave pública del resolvedor para los registros de resultados de protocolo firmados
- metadatos opcionales de entrada cifrada pública, como parámetros BFV y `ram_fhe_profile`
- una bandera `active` que controla si la política puede emitir nuevos registros de resultados del protocolo

El secreto oculto, el identificador en texto plano y el cuerpo oculto del programa no se almacenan en el estado mundial. Los clientes deben tratar los compromisos, los hashes opacos, los hashes de recibos, los textos cifrados y los resúmenes del programa como valores opacos del protocolo.

## Backends {#backends}

El soporte actual RAM-LFE se centra en tres identificadores de backend:

|Backend|Usar|
| --- | --- |
| `hkdf-sha3-512-prf-v1` |Evaluación vinculada al compromiso PRF.|
| `bfv-affine-sha3-256-v1` |BFV-respaldada evaluación afín secreta sobre espacios de identificadores cifrados.|
| `bfv-programmed-sha3-256-v1` |BFV-respaldo de ejecución programada sobre registros encriptados y carriles de ejecución de memoria.|

Para las políticas de identificador, el backend programado BFV es el camino moderno importante. Permite que las billeteras cifren la entrada normalizada localmente, permite que el resolvedor evalúe sin ver un identificador público en la transacción, y devuelve un registro de resultado del protocolo que vincula el hash criptográfico de salida con la política del programa registrado.

## Matemáticas {#math}

Esta sección describe el álgebra a nivel de implementación utilizada por el código actual RAM-LFE. No es una prueba de seguridad; es la transcripción determinista y el modelo de evaluación cifrada con los que las políticas, los registros de resultados del protocolo y los clientes deben estar de acuerdo.

### Notación {#notation}

Sea:

- \(H(m)\) ser Iroha `Hash::new(m)`: Blake2b-32 sobre `m`, con el bit menos significativo del byte final forzado a `1`.
- \(N(x)\) sea la codificación canónica Norito de `x`.
- \(a \parallel b\) significa concatenación de cadenas de bytes.
- \(\operatorname{le64}(i)\) sea la codificación en little-endian de 8 bytes de un número entero sin signo.
- \(s\) sea el secreto del resolutor guardado fuera del estado mundial.
- \(P\) ser parámetros de política pública.
- \(A\) solicitar datos asociados.
- \(x\) puede ser bytes de entrada normalizados o un contenedor de datos de entrada cifrada codificado en Norito, dependiendo del backend.

RAM-LFE utiliza hashes criptográficos separados por dominio. Las fórmulas a continuación nombran los dominios según su propósito; sus cadenas de bytes actuales son:

|Símbolo| Cadena de dominio |
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

### Compromiso de la política {#policy-commitment}

Un compromiso de política vincula los parámetros públicos y el secreto del resolver oculto a un backend. Primero, el secreto se compromete por separado:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Luego se codifica la transcripción completa de la política:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

y el hash criptográfico de la política publicada es:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

El `PolicyCommitment` en la cadena es:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

La evaluación recalcula el mismo valor a partir del secreto en tiempo de ejecución del software. Si el hash criptográfico recalculado difiere, la evaluación falla con un desajuste de compromiso.

### Motor HKDF-SHA3-512 {#hkdf-sha3-512-backend}

Para `hkdf-sha3-512-prf-v1`, la salida es la propia entrada normalizada, pero el identificador opaco y el registro de resultados del protocolo con el hash criptográfico están vinculados a secretos PRF.

La transcripción de la solicitud es:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

La sal HKDF y la clave pseudorrandom son:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

El material opaco se expande y se dispersa:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

el registro de resultado del protocolo material además vincula el id opaco:

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

El backend devuelve:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### Introducción a BFV {#bfv-primer}

BFV es un esquema de cifrado homomórfico basado en retículos. "Homomórfico" significa que un programa puede sumar y multiplicar valores cifrados y, después de la descifrado, obtener el mismo resultado como si hubiera realizado las sumas y multiplicaciones sobre los valores en texto plano.

Para RAM-LFE, BFV se utiliza como un mecanismo de entrada cifrada:

1. Una billetera normaliza un valor privado, como un número de teléfono o una dirección de correo electrónico.
2. La billetera convierte los bytes en pequeños espacios de enteros.
3. Cada ranura está encriptada con la clave pública BFV del resolvedor.
4. El tiempo de ejecución del software del resolver evalúa el programa oculto sobre esos textos cifrados.
5. El tiempo de ejecución del software descifra solo la salida del programa oculta y firma o prueba un registro de resultado de protocolo.

BFV es aritmética de enteros exacta, no aritmética aproximada. Por eso es más adecuada para identificar bytes y realizar cálculos modulares pequeños que para la inferencia de modelos de punto flotante. En el uso actual de BFV de Iroha, cada ranura cifrada contiene un valor escalar módulo \(t\), usualmente un byte o un campo de longitud de byte. El propio texto cifrado vive módulo a un número entero mucho mayor \(q\). La diferencia entre \(q\) y \(t\) da espacio de descifrado para el ruido que la encriptación y las operaciones homomórficas introducen.

Un texto cifrado BFV tiene dos componentes polinómicas:

$$
c=(c_0,c_1)
$$

La clave secreta es otro polinomio \(s_k\). La descifrado combina los componentes:

$$
v = c_0 + c_1s_k
$$

Si el texto cifrado se formó correctamente y el ruido todavía es lo suficientemente pequeño, \(v\) está cerca del texto plano escalado. El redondeo recupera el coeficiente del texto plano módulo \(t\). La propiedad útil es que las operaciones con el texto cifrado preservan esta estructura:

|Operación sencilla|Operación de texto cifrado|
| --- | --- |
| \(m+n\) |Agregar componentes de texto cifrado.|
| \(m+\alpha\) |Agregue una constante de texto sin formato escalada en \(c_0\).|
| \(\alpha m\) |Escale ambos componentes del texto cifrado por \(\alpha\).|
| \(mn\) |Multiplica los polinomios cifrados, reescala y luego relineariza.|

La multiplicación es la operación costosa. El producto de dos cifrados de dos componentes crea naturalmente un cifrado de tres componentes que se descifra con \(1\), \(s_k\) y \(s_k^2\). La relinearización utiliza una clave de evaluación publicada para plegar el término \(s_k^2\) de nuevo en un cifrado normal de dos componentes. Eso mantiene las sumas y multiplicaciones posteriores usando la misma forma de cifrado.

BFV también está "nivelado": cada operación cifrada consume parte del presupuesto de ruido. Esta implementación no reinicia los cifrados para renovar ese presupuesto. En su lugar, RAM-LFE publica un pequeño `ram_fhe_profile` y acepta solo una forma de programa oculta limitada. Eso mantiene la evaluación dentro de la profundidad soportada por el conjunto de parámetros. El perfil programado actual permite un número fijo de registros, un número fijo de canales de memoria y como máximo una multiplicación de texto cifrado por texto cifrado por paso programado.

En este diseño RAM-LFE, BFV oculta la entrada del cliente de los datos del libro mayor público de la blockchain y de los observadores que solo ven la transacción o la carga del recorrido. No significa que la cadena ejecute programas cifrados arbitrarios por sí misma. El tiempo de ejecución del software resolutor Torii todavía posee el material secreto BFV, evalúa el programa oculto configurado, descifra la salida permitida, y certifica el resultado. Luego, el libro mayor de la blockchain verifica la certificación contra el compromiso de política en la cadena y la clave pública del resolutor o los metadatos de prueba.

El caso de uso del identificador elige una representación simple a propósito. Una cadena normalizada se codifica como:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Cada elemento se cifra como su propio texto cifrado escalar BFV. Esa forma hace que la normalización y la validación del contenedor de datos sean explícitas, y permite que las billeteras construyan solicitudes encriptadas a partir de parámetros públicos, y permite que el resolvedor canonice entradas encriptadas equivalentes en una transcripción de registro de resultados del protocolo estable.

### BFV Modelo de Anillo {#bfv-ring-model}

Los backends BFV utilizan el anillo de polinomios negaciclico:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

y anillo de texto plano:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

dónde:

- \(n\) es `polynomial_degree`, una potencia de dos
- \(q\) es `ciphertext_modulus`
- \(t\) es `plaintext_modulus`
- \(q > t\) y \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Los vectores de coeficientes en texto plano se codifican escalando cada coeficiente:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

El centro de descifrado eleva cada coeficiente de:

$$
v = c_0 + c_1 s_k \in R_q
$$

luego lo redondea de nuevo a \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Aquí \(s_k\) está el polinomio de clave secreta BFV, no el secreto del resolutor exterior RAM-LFE \(s\).

### BFV Generación de Claves {#bfv-key-generation}

Para la entrada de identificador encriptado, el material clave BFV es determinista por el secreto del resolvedor y los datos asociados:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

El BFV RNG se siembra como:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Las muestras del generador de claves:

- \(s_k \in \{-1,0,1\}^n\), representado módulo \(q\)
- \(a \leftarrow R_q\) uniformemente
- \(e \in \{-1,0,1\}^n\)

La clave pública es:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Para la relinearización, sea \(s_k^2\) el producto de anillo en \(R_q\). Para cada dígito en base-\(B\) \(j\), muestree \(a_j\) uniformemente y \(e_j\) de la distribución pequeña, luego publique:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

Los metadatos de la política pública BFV contienen \((n,q,t,B)\), la clave pública, y `max_input_bytes`. La clave secreta BFV y la clave de relinearización permanecen en el tiempo de ejecución del software del resolvedor.

### BFV Cifrado y Operaciones {#bfv-encryption-and-operations}

Para encriptar un polinomio en texto plano \(m\), la implementación inicializa otro ChaCha20 RNG desde:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Toma muestras de \(u,e_1,e_2 \in \{-1,0,1\}^n\) y calcula:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

El texto cifrado es \(c=(c_0,c_1)\).

La adición homomórfica es componente por componente:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Agregar un escalar de texto plano \(\alpha\) al coeficiente cero cambia solo \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplicar por un escalar en texto plano \(\alpha\) escala ambos componentes:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Para dos textos cifrados \(c=(c_0,c_1)\) y \(d=(d_0,d_1)\), la multiplicación de textos cifrados primero calcula un texto cifrado de tamaño tres y escala cada coeficiente nuevamente por \(t/q\):

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

Todos los productos anteriores son productos de anillo negaciclico en \(R_q\). Luego, \(\tilde c_2\) se descompone en polinomios en base-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

y relinearizado:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

El resultado es nuevamente un cifrado BFV de dos componentes.

### Contenedor de datos de identificador cifrado {#identifier-ciphertext-envelope}

Una cadena de bytes de entrada de identificador:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

está codificado en ranuras escalares:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

y todos los espacios restantes son cero hasta `max_input_bytes + 1`. Cada espacio escalar está cifrado como el polinomio de texto plano de coeficiente cero \([m_i]\). La semilla de cifrado por espacio es:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

El contenedor de datos de identificador cifrado es:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

dónde \(M=\mathrm{max\_input\_bytes}\).

### BFV Backend Afin {#bfv-affine-backend}

Para `bfv-affine-sha3-256-v1`, el tiempo de ejecución del software primero deriva el material clave BFV a partir de \(s\) y \(A\). Los parámetros públicos derivados deben coincidir exactamente con los parámetros públicos comprometidos en la cadena.

La semilla del circuito afín es:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

A partir de esta semilla, el tiempo de ejecución del software toma muestras, módulo \(t\), de un circuito afín de 32 filas:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

donde \(m_i\) son las ranuras de identificador descifradas. Homomórficamente, calcula el mismo valor sobre los cifrados:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

El resolutor descifra cada \(C_j\), requiere que todos los coeficientes de texto plano restantes sean cero, convierte los valores de coeficientes cero a bytes y forma:

$$
O=(y_0,\ldots,y_{31})
$$

Entonces:

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

Para `bfv-programmed-sha3-256-v1`, los parámetros públicos incluyen los parámetros de encriptación del identificador BFV más un valor de resumen criptográfico de programa oculto:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

El perfil actual RAM-FHE es:

|Campo|Valor|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

La entrada de texto sin formato enviada a Torii se cifra en el mismo contenedor de datos BFV antes de la ejecución. La semilla determinista para ese cifrado del lado del servidor es:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Para la entrada cifrada suministrada externamente, el resolvedor descifra el contenedor de datos del identificador y lo vuelve a cifrar en este contenedor de datos determinista antes de ejecutar. Esa normalización canónica mantiene estables los hashes criptográficos de los registros de resultados del protocolo entre textos cifrados BFV semánticamente equivalentes.

Las líneas de ejecución de memoria cifrada inicial se derivan de:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Para cada una de las 32 líneas de ejecución, el tiempo de ejecución del software muestrea \(r_j \in [0,t)\) y almacena un texto cifrado BFV que encripta \(r_j\). El programa oculto luego se ejecuta sobre registros cifrados y memoria cifrada:

|Instrucción|Álgebra|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), luego volver a linearizar |
| `SelectEqZero(dst, cond, z, nz)` |Descifra \(R_{\mathrm{cond}}\); elige \(R_z\) cuando sea cero, de lo contrario \(R_{nz}\).|
| `Output(src)` |Agregue \(R_{\mathrm{src}}\) a la lista del registro de salida.|

Después de que la cinta de instrucciones termina, el resolver descifra cada registro de salida, convierte el coeficiente cero en un byte y concatena esos bytes:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Los hashes criptográficos de backend programados genéricamente son:

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

La cinta identificadora programada por defecto tiene 64 ranuras de entrada. Para cada ranura \(i\), carga la ranura de entrada, carga la línea de ejecución de memoria \(i \bmod 32\), las suma y produce el resultado:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Generar registros de resultados de protocolo y hashes criptográficos {#output-hashes-and-receipts}

El registro de resultados del protocolo de ejecución genérico RAM-LFE no firma la salida sin procesar. Firma el hash criptográfico de la salida:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Para los registros de resultados del protocolo de ejecución Torii RAM-LFE, los datos asociados son los bytes del identificador canónico del programa:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

La carga útil del registro de resultados del protocolo firmado es:

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

Para el modo `signed`:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

La verificación comprueba la firma con `resolver_public_key` y rechaza el registro de resultado del protocolo a menos que se cumplan todas estas igualdades:

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

Si el llamante proporciona `output_hex`, el verificador también verifica:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

Para el modo `proof`, la atestación contiene un contenedor de datos de prueba en lugar de una firma. La verificación comprueba que el backend de prueba, el id del circuito, el esquema de entrada pública hash criptográfico, hash criptográfico de clave de verificación y las instancias públicas expuestas coinciden con los metadatos del verificador de pruebas y el hash criptográfico del contenido del recibo codificado. Sea:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Se esperan cuatro instancias públicas de una sola columna. La columna \(j\) contiene bytes \(h_{8j}\ldots h_{8j+7}\) seguidos de 24 bytes cero:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Proyección de identificador {#identifier-projection}

La resolución de identificadores no utiliza el backend genérico `opaque_hash` como el identificador de cuenta opaco visible para el usuario. Proyecta el hash criptográfico de salida RAM-LFE a través de dominios específicos del identificador:

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

Un `IdentifierResolutionReceipt` firma una carga útil de nivel superior:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Para registros de resultados de protocolo de identificador firmado:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` acepta el registro de resultado del protocolo solo cuando la firma o prueba es válida, la carga útil de ejecución RAM-LFE incorporada coincide con la política del programa referenciada, y `uaid` y `account_id` son el vínculo que se está reclamando.

## Flujo de ejecución {#execution-flow}

Una ejecución genérica RAM-LFE sigue esta forma:

1. La gobernanza o un operador registra `RamLfeProgramPolicy`.
2. El propietario activa la póliza.
3. El cliente lee los metadatos de la política pública de Torii.
4. El cliente envía exactamente un formulario de entrada al resolvedor: datos de entrada en texto plano `input_hex` o un contenedor de datos de entrada cifrado BFV.
5. El tiempo de ejecución del software evalúa el programa oculto y devuelve `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` y un `RamLfeExecutionReceipt`.
6. El cliente o el backend verifica el recibo según la política publicada y, si lo desea, comprueba que el `output_hex` devuelto produzca el `output_hash` del recibo.
7. Una instrucción de nivel superior, como `ClaimIdentifier`, puede incrustar el registro de resultados del protocolo certificado en lugar de incrustar la entrada sin procesar.

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

## Políticas de identificador {#identifier-policies}

Las políticas de identificador son un uso concreto de RAM-LFE. Añaden un espacio de nombres empresarial y una regla de normalización encima de una política de programa genérica:

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

La capa identificadora utiliza el registro de resultados del protocolo RAM-LFE para vincular:

- `policy_id`
- el identificador opaco derivado por la función oculta
- el determinista `receipt_hash`
- la cuenta UAID
- el `account_id` canónico
- la carga útil de ejecución genérica RAM-LFE

Para la incorporación de usuarios, mantenga los alias de cuenta separados de los identificadores privados. Los alias son nombres públicos; los números de teléfono, direcciones de correo electrónico y valores similares deben seguir las políticas de identificación y los registros de resultados del protocolo.

## Torii Rutas {#torii-routes}

Cuando la familia de rutas orientada a la aplicación está habilitada, Torii expone RAM-LFE y auxiliares de identificador:

|Ruta|Propósito|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |Enumere las políticas de programas RAM-LFE activas e inactivas y los metadatos de ejecución pública.|
| `POST /v1/ram-lfe/programs/{program_id}/execute` |Ejecute un programa de `input_hex` o `encrypted_input` y devuelva los hashes de salida junto con un recibo sin estado.|
| `POST /v1/ram-lfe/receipts/verify` |Verifique un `RamLfeExecutionReceipt` según la política publicada y, opcionalmente, compare `output_hex` con `output_hash`.|
| `GET /v1/identifier-policies` |Enumere las políticas de identificador, los modos de normalización, las claves del resolutor y los metadatos de entrada cifrada.|
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Emita el registro de resultado del protocolo que un usuario puede insertar en `ClaimIdentifier`.|
| `POST /v1/identifiers/resolve` |Resuelva una entrada de identificador normalizado a la cuenta vinculada cuando exista un reclamo activo.|
| `GET /v1/identifiers/receipts/{receipt_hash}` |Consulta una declaración de identificador persistente mediante el hash del recibo para tareas de auditoría y soporte.|

Siempre verifica el documento `/openapi.json` del nodo de destino antes de construir con estas rutas. La disponibilidad depende de la construcción del nodo y del perfil de la red.

## Entorno de ejecución de software Node {#node-runtime}

El tiempo de ejecución del software RAM-LFE en proceso de Torii está configurado bajo `torii.ram_lfe.programs[*]`, con clave `program_id`. Cada programa configurado debe coincidir con el compromiso de la política en cadena y debe proporcionar el material de tiempo de ejecución de software necesario para evaluar y certificar los registros de resultados del protocolo. Las rutas de identificador reutilizan este mismo tiempo de ejecución de software; no requieren una superficie de configuración de resolutor de identificador separada.

Registrar una política en la cadena no es suficiente por sí mismo. Un nodo objetivo también debe exponer la familia de rutas y tener material de ejecución de software coincidente para los programas que se espera que ejecute.

## Directrices Operativas {#operational-guardrails}

- Las políticas del registro están inactivas, verifique los metadatos públicos y luego actívelas.
- Mantenga los secretos ocultos del evaluador, las claves de firma del resolutor y el material secreto BFV fuera de documentos, registros, transacciones y paquetes de clientes.
- No coloque identificadores sin procesar en alias de cuentas, metadatos de transacciones, eventos o campos del estado mundial.
- Verifica los registros de resultados del protocolo del lado del cliente antes de enviar instrucciones de nivel superior cuando el SDK expone un verificador.
- Use campos de caducidad para impedir que los recibos obsoletos sigan siendo válidos indefinidamente.
- Gire registrando un nuevo programa o política de identificador, migrando clientes y desactivando la política antigua una vez que los registros de resultados del nuevo protocolo estén fluyendo.

## Temas relacionados {#related-topics}

- [Tarifas de patrocinador para un espacio de datos privado](/es/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API puntos finales](/es/reference/torii-endpoints.md#app-and-sora-route-families)
- [Transacciones anónimas](/es/blockchain/anonymous-transactions.md)
