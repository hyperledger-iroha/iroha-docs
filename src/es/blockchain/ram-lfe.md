---
translation_locale: es
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE La evaluación de la función lacónica de la máquina de acceso aleatorio. Iroha, Es la capa genérica de función oculta para programas cuya política pública está en cadena pero cuya lógica evaluadora, secreto, No se debe escribir a los estados del mundo, es utilizado por SORA Nexus flujos de identificadores, como la búsqueda por teléfono privado o correo electrónico, y también pueden ser expuestos como un genérico Torii auxiliar de ejecución del programa cuando un perfil de nodo habilita las rutas orientadas a la aplicación.

La cadena almacena los metadatos de compromiso de la política y verificación de recibos. Un resolver o Torii runtime evalúa el programa oculto, devuelve solo la salida permitida y adjunta un recibo que los clientes, herramientas de soporte o instrucciones del libro mayor pueden verificar con respecto a la política registrada.

## Nombramiento {#naming}

La división de nombres es importante:

|Término |El significado .|
| --- | --- |
|`ram_lfe` |La abstracción externa de las funciones ocultas: políticas del programa, compromisos, recibos de ejecución y modo de verificación de recibo. |
|`BFV` |El esquema de cifrado homórfico Brakerski/Fan-Vercauteren utilizado por los retrocesos de entrada encriptada RAM-LFE. |
|`ram_fhe_profile` |Metadatos específicos de BFV para la máquina de ejecución codificada programada. No es un segundo nombre de RAM-LFE. |

En el modelo de datos, `RamLfeProgramPolicy` y `RamLfeExecutionReceipt` son los tipos RAM-LFE. Los parámetros BFV, envelopes de texto cifrado y el perfil oculto del programa RAM-FHE pertenecen al backend de ejecución cifrada utilizado por una política.

## Lo que registra {#what-it-records}

Una política del programa RAM-LFE está registrada en todo el mundo por `program_id`.

- la cuenta del propietario que puede activar, desactivar o cambiar de otra manera la política.
- el backend anunciado a los clientes
- el modo de verificación del recibo, `signed` o `proof`.
- un compromiso con los metadatos del programa oculto y el secreto del evaluador
- la clave pública del resolver para los recibos firmados
- Metadatos públicos encriptados de entrada opcionales, como los parámetros BFV y `ram_fhe_profile`
- una bandera `active` que controle si la póliza puede emitir nuevos recibos;

El secreto oculto, el valor del identificador de texto en blanco y el cuerpo del programa oculto no se almacenan en estado mundial. Los clientes deben tratar los compromisos, hashes opacos, hashes de recibo, textos cifrados y digestos de programas como valores de protocolo opacos.

## Los retrospectivos {#backends}

El soporte actual de RAM-LFE se centra en tres identificadores backend:

|El retroceso .|Usar |
| --- | --- |
|`hkdf-sha3-512-prf-v1` |Evaluación vinculada al compromiso PRF. |
|`bfv-affine-sha3-256-v1` |BFV respaldado por la evaluación de afines secretos sobre las ranuras de identificadores cifradas. |
|`bfv-programmed-sha3-256-v1` |BFV respaldado ejecución programada a través de registros cifrados y vías de memoria.|

Para las políticas de identificadores, el backend programado BFV es el camino moderno importante. Permite a las billeteras cifrar entradas normalizadas localmente, permite al resolver evaluar sin ver un identificador público en la transacción, y devuelve un recibo que une el hash de salida a la política del programa registrado.

## Las matemáticas {#math}

Esta sección describe el álgebra de nivel de implementación utilizada por el código actual RAM-LFE. No es una prueba de seguridad; es la transcripción determinista y el modelo de evaluación encriptada que las políticas, recibos y clientes deben acordar.

### Notación {#notation}

Deje que:

- \(H(m)\) ser Iroha `Hash::new(m)`: Blake2b-32 sobre `m`, con el bit menos significativo del byte final obligado a `1`.
- \(N(x)\) debe ser la codificación canónica Norito de `x`.
- \(a \parallel b\) significa concatenación de cadenas en byte.
- \(\operatorname{le64}(i)\) sea la codificación de 8 bytes de un número entero sin firmar.
- \(s\) ser el resolver secreto que se mantiene fuera del estado mundial.
- \(P\) ser parámetros de política pública.
- \(A\) se solicitarán los datos asociados.
- \(x\) pueden ser bytes de entrada normalizados o un envase de entrada cifrado codificado con Norito, según el backend.

RAM-LFE utiliza hashes separados por dominio. Las fórmulas a continuación nombran los dominios por propósito; sus cadenas de byte actuales son:

|Símbolo .|La cadena de dominio |
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

### Compromiso político {#policy-commitment}

Un compromiso político une los parámetros públicos y resolver secreto oculto a un backend. primero, el secreto se compromete por separado:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

Luego se codifica la transcripción completa de las políticas:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

y el hash de política publicado es:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

El `PolicyCommitment` en cadena es:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

La evaluación recalcula el mismo valor del secreto de tiempo de ejecución. Si el hash recalculado difiere, la evaluación falla con una incompatibilidad de compromiso.

### HKDF-SHA3-512 Retroceso {#hkdf-sha3-512-backend}

Para `hkdf-sha3-512-prf-v1`, la salida es la entrada normalizada en sí misma, pero el identificador opaco y el hash de recibo son las salidas PRF vinculadas secretamente.

La transcripción de la solicitud es:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

La llave HKDF de sal y pseudorandom son:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

El material opaco se expande y se hacha:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

El material del recibo también une la identificación opaca:

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

### BFV Primer {#bfv-primer}

BFV es un esquema de encriptación homomorfa basado en una red. "Homomorfo" significa que un programa puede agregar y multiplicar valores cifrados y, después de la descifrada, obtener el mismo resultado que si hubiera realizado las adiciones y multiplicaciones en los valores del texto plano.

Para RAM-LFE, BFV se utiliza como mecanismo de entrada encriptado:

1. Una billetera normaliza un valor privado, como un número de teléfono o una dirección de correo electrónico.
2. La billetera convierte los bytes en pequeñas ranuras de números enteros.
3. Cada ranura está cifrada con la clave pública BFV del resolver.
4. El tiempo de ejecución del resolver evalúa el programa oculto sobre esos textos codificados.
5. El tiempo de ejecución sólo descifre la salida del programa oculto y señala o prueba un recibo.

BFV es la aritmética exacta de números enteros, no aritmética aproximada. Es por eso que es más adecuado para los bytes identificadores y pequeños módulos En el caso de las computadoras, los resultados son más claros. Iroha La corriente . BFV uso, cada ranura cifrada tiene un valor escalar modulo \(t\), generalmente un byte o un campo de longitud de un byte. el texto cifrado en sí vive modulo un número entero mucho mayor \(q\). La brecha entre \(q\) y \(t\) da espacio de descifrado al ruido que introducen el cifrado y las operaciones homórficas.

Un texto de cifrado BFV tiene dos componentes polinomial:

$$
c=(c_0,c_1)
$$

La clave secreta es otro polinomio \(s_k\). El descifrado combina los componentes:

$$
v = c_0 + c_1s_k
$$

Si el texto cifrado se formó correctamente y el ruido es todavía lo suficientemente pequeño, \(v\) está cerca del texto plano escalado. La redondeación recupera el coeficiente de texto claro modulo \(t\).

|Operación simple |Operación de cifrado de texto |
| --- | --- |
|\(m+n\) |Añadir componentes de texto cifrado. |
|\(m+\alpha\) |Añadir una constante de texto en blanco escalada a \(c_0\). |
|\(\alpha m\) |Escala los dos componentes del texto cifrado por \(\alpha\). |
|\(mn\) |Multiplica los polinomios de texto cifrado, recalque y luego relinea. |

La multiplicación es una operación costosa. Un producto de dos textos cifrados de dos componentes crea naturalmente un texto cifrado de tres componentes que se descifra con \(1\), \(s_k\) y \(s_k^2\). La relinarización utiliza una clave de evaluación publicada para doblar el término \(s_k^2\) de nuevo en un texto cifrado normal de dos componentes. Eso mantiene adiciones y multiplicaciones posteriores utilizando la misma forma del texto cifrada.

BFV también es "nivelado": cada operación cifrada consume algún presupuesto de ruido. Esta implementación no inicializa los textos cifrados para actualizar ese presupuesto. En su lugar, RAM-LFE publica un pequeño `ram_fhe_profile` y acepta solo una forma oculta del programa limitada. Esto mantiene la evaluación dentro de la profundidad admitida del conjunto de parámetros. El perfil programado actual permite un recuento fijo del registro, el recuento fijado de vías de memoria y, como máximo, una multiplicación del texto cifrado-cifrado por paso programado.

En esto RAM-LFE el diseño, BFV oculta la entrada del cliente de los datos del libro mayor público y de los observadores que sólo ven la carga útil de la transacción o de la ruta. No significa que la cadena ejecute por sí misma programas cifrados arbitrarios. Torii Resolver runtime todavía posee el BFV material secreto, evalúa el programa oculto configurado, descifre la salida permitida y atestigua el resultado. El libro mayor luego verifica la certificación contra el compromiso de política en cadena y resuelve los metadatos de llave pública o prueba.

El caso de uso del identificador elige a propósito una representación simple. Una cadena normalizada se codifica como:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

Cada elemento está encriptado como su propio BFV texto de cifrado escalar. Esa forma hace que la normalización y la validación del sobre sean explícitas, permite a las billeteras construir solicitudes cifradas a partir de parámetros públicos y permite al resolver canonizar entradas cifradas equivalentes en una transcripción estable de recibo.

### Modelo de anillo BFV {#bfv-ring-model}

Los respaldos BFV utilizan el anillo polinómico negaciclo:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

y anillo de texto simple:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

donde:

- \(n\) es `polynomial_degree`, una potencia de dos
- \(q\) es `ciphertext_modulus`
- \(t\) es `plaintext_modulus`
- \(q > t\) y \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

Los vectores de coeficientes de texto en blanco se codifican mediante la escalación de cada coeficiente:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

El descifrador central eleva cada coeficiente de:

$$
v = c_0 + c_1 s_k \in R_q
$$

a continuación, lo redondea en \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

Aquí \(s_k\) es el polinomio de llave secreta BFV, no el secreto del resolver externo RAM-LFE \(s\).

### BFV Generación clave {#bfv-key-generation}

Para la entrada de un identificador cifrado, el material clave BFV es determinista por resolver y los datos secretos asociados:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

El BFV RNG se siembra en la siguiente forma:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

Las muestras de los generadores clave:

- \(s_k \in \{-1,0,1\}^n\), representado en el módulo \(q\)
- \(a \leftarrow R_q\) uniformemente
- \(e \in \{-1,0,1\}^n\)

La clave pública es:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

Para la relinearización, permita que \(s_k^2\) sea el producto del anillo en \(R_q\). Para cada base-\(B\) dígito \(j\), muestre \(a_j\) de forma uniforme y \(e_j\) de la pequeña distribución, luego publique:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

El público BFV Los metadatos de la política contienen \((n,q,t,B)\), la clave pública y `max_input_bytes`. El Consejo BFV La clave secreta y la llave de redireccionamiento permanecen en el tiempo de ejecución del resolver.

### Encriptación y operaciones BFV {#bfv-encryption-and-operations}

Para cifrar un polinomio de texto simple \(m\), la implementación emitió otro ChaCha20 RNG de:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

Se muestran \(u,e_1,e_2 \in \{-1,0,1\}^n\) y se calculan:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

El texto en cifrado es \(c=(c_0,c_1)\).

La adición homórfica es en función de los componentes:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

Añadir un escalar de texto claro \(\alpha\) al coeficiente de cambios cero solamente \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

Multiplicando por un escalar de texto plano \(\alpha\) las escalas de los dos componentes:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

Para dos textos cifrados \(c=(c_0,c_1)\) y \(d=(d_0,d _1)\), la multiplicación del texto cifrado primero calcula un texto de cifrado de tres dimensiones y escala cada coeficiente de nuevo por \(t/q\):

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

Todos los productos anteriores son productos de anillos negaciclicos en \(R_q\). Luego, \(\tilde c_2\) se descomponen en polinomios base-\(B\):

$$
\tilde c_2 = \sum_j B^j u_j
$$

y redireccionado:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

El resultado es otra vez un texto cifrado de dos componentes BFV.

### Identificador Envase de texto cifrado {#identifier-ciphertext-envelope}

Una cadena de byte de entrada del identificador:

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

y todas las ranuras restantes son cero hasta `max_input_bytes + 1`. Cada ranura escalar está cifrada como el polinomio de texto en blanco con coeficiente cero \([m_i]\). La semilla de cifrado por ranura es:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

El envase del identificador cifrado es:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

donde \(M=\mathrm{max\_input\_bytes}\).

### BFV Afine Backend {#bfv-affine-backend}

Para `bfv-affine-sha3-256-v1`, el tiempo de ejecución primero deriva el material clave BFV de \(s\) y \(A\). Los parámetros públicos derivados deben coincidir exactamente con los parámetres públicos comprometidos en la cadena.

La semilla del circuito afino es:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

A partir de esta semilla las muestras de tiempo de ejecución, modulo \(t\), un circuito afino de 32 filas:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

donde \(m_i\) son las ranuras de identificador descifradas. Homomorfamente, calcula el mismo valor en los textos cifrados:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

El resolver descifre cada \(C_j\), requiere que todos los coeficientes de texto en blanco posteriores sean cero, convierte los valores del coeficiente-cero en bytes y forma:

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

### BFV Programación de Backend {#bfv-programmed-backend}

Para `bfv-programmed-sha3-256-v1`, los parámetros públicos incluyen el parámetro de encriptación del identificador BFV más un digesto de programa oculto:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

El perfil actual RAM-FHE es el siguiente:

|El campo |El valor |
| --- | --- |
|`profile_version` | `1` |
|`register_count` | `4` |
|`memory_lane_count` | `32` |
|`ciphertext_mul_per_step` | `1` |
|`encrypted_input_mode` |`resolver_canonicalized_envelope_v1` |
|`min_ciphertext_modulus` | \(2^{52}\) |

La entrada de texto en blanco presentada a Torii se cifrará en el mismo sobre BFV antes de su ejecución.

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

Para las entradas cifradas suministradas externamente, el resolver descifre la envoltura del identificador y lo vuelve a cifrar en este Esta canonización mantiene los hashes de recibo estables a través de semánticamente igual BFV los textos cifrados.

Las vías de memoria inicialmente cifradas se derivan de:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

Para cada uno de los 32 carriles, las muestras de tiempo de ejecución \(r_j \in [0,t)\) y almacena un texto cifrado BFV encriptando \(r_j\). El programa oculto luego se ejecuta sobre registros cifrados y memoria encriptada:

|Instrucciones |Algebra .|
| --- | --- |
|`LoadInput(dst, i)` |\(R_{\mathrm{dst}} \leftarrow C_i\) |
|`LoadState(dst, j)` |\(R_{\mathrm{dst}} \leftarrow S_j\) |
|`StoreState(j, src)` |\(S_j \leftarrow R_{\mathrm{src}}\) |
|`LoadConst(dst, a)` |\(R_{\mathrm{dst}} \leftrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
|`AddPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
|`SubPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
|`MulPlain(dst, src, a)` |\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
|`Mul(dst, a, b)` |\(R_{\mathrm{dst}} \leftarrow R_aR_b\), luego volver a alinear |
|`SelectEqZero(dst, cond, z, nz)` |Descifrar \(R_{\mathrm{cond}}\); elegir \(R_z\) cuando es cero, de lo contrario \(R_{nz}\). |
|`Output(src)` |Añadir \(R_{\mathrm{src}}\) a la lista de registros de salida. |

Después de que finalice la cinta de instrucciones, el resolver descifrará cada registro de salida, convertirá el coeficiente cero en un byte y concatenará esos bytes:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

Los hashes de backend programados genéricos son:

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

La cinta de identificación programada por defecto tiene 64 ranuras de entrada. Para cada ranura \(i\), carga la ranura de entrada, carga el carril de memoria \(i \bmod 32\), las agrega y da el resultado:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### Los hashes y recibos de salida {#output-hashes-and-receipts}

El recibo de ejecución genérico RAM-LFE no firma la salida en bruto, sino el hash de salida:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Para los recibos de ejecución Torii RAM-LFE, los datos asociados son los bytes canónicos del identificador de programa:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

La carga útil del recibo firmado es:

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

La verificación comprobará la firma con `resolver_public_key` y rechazará el recibo a menos que todas estas equivalencias sean:

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

En caso de que el solicitante entregue `output_hex`, el verificador también comprueba:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

Para el modo `proof`, la certificación lleva un sobre de prueba en lugar de una firma. La verificación comprueba que el backend de prueba, el id del circuito, el hash de esquema de entrada pública, el hash con clave de verificación y las instancias públicas expuestas coinciden con los metadatos del verificador de pruebas y el hash codificado de recibo-carga útil.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

Las instancias públicas previstas son cuatro columnas de un elemento. La columna \(j\) contiene bytes \(h_{8j}\ldots h_{8j+7}\) seguidas por 24 bytes cero:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### Proyección del identificador {#identifier-projection}

La resolución del identificador no utiliza el backend genérico `opaque_hash` como el identificador opaco de la cuenta para el usuario. Proyecta el hash de salida RAM-LFE a través de dominios específicos del identificador:

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

Una `IdentifierResolutionReceipt` firmará una carga útil de nivel superior:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

Para los recibos de identificación firmados:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` sólo acepta el recibo cuando la firma o prueba sea válida, la carga útil de ejecución incrustada en RAM-LFE coincida con la política del programa a que se hace referencia, y los `uaid` y `account_id` son el vinculante que se reclama.

## Flujo de ejecución {#execution-flow}

Una ejecución genérica RAM-LFE tiene la siguiente forma:

1. Registro de gobierno o de un operador `RamLfeProgramPolicy`.
2. El propietario activa la póliza.
3. El cliente lee los metadatos de las políticas públicas en Torii.
4. El cliente envía exactamente un formulario de entrada al resolver: texto simple `input_hex` o una envoltura de entrada cifrada BFV.
5. El tiempo de ejecución evalúa el programa oculto y devuelve `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash` y un `RamLfeExecutionReceipt`.
6. El cliente o el backend verifica el recibo con arreglo a la política publicada, verificando opcionalmente que el `output_hex` devuelto se ajusta al `output_hash` del recibo.
7. Una instrucción de nivel superior, como `ClaimIdentifier`, puede incorporar el recibo certificado en lugar de incorporar la entrada en bruto.

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

## Políticas de identificación {#identifier-policies}

Las políticas de identificación son un uso concreto de RAM-LFE. Añaden un espacio de nombres de negocios y una regla de normalización encima de una política de programa genérica:

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

La capa de identificación utiliza el recibo RAM-LFE para vincular:

- `policy_id`
- el identificador opaco derivado de la función oculta
- la determinación `receipt_hash`
- la cuenta es UAID
- el canónico `account_id`
- la carga útil de ejecución genérica RAM-LFE

Para la incorporación orientada al usuario, mantenga los alias de cuenta separados de los identificadores privados. Los alias son nombres públicos; números de teléfono, direcciones de correo electrónico y valores similares deben fluir a través de las políticas de identificación y recibos.

## Las rutas Torii {#torii-routes}

Cuando esté habilitada la familia de rutas orientadas a las aplicaciones, Torii expone RAM-LFE y los auxiliares de identificación:

|Rutas |El propósito .|
| --- | --- |
|`GET /v1/ram-lfe/program-policies` |Enumera las políticas del programa RAM-LFE activas e inactivas y los metadatos de ejecución pública. |
|`POST /v1/ram-lfe/programs/{program_id}/execute` |Ejecutar un programa de `input_hex` o `encrypted_input` y devolver los hashes de salida más un recibo sin estado. |
|`POST /v1/ram-lfe/receipts/verify` |Verifique un `RamLfeExecutionReceipt` con respecto a la política publicada y, opcionalmente, compare el `output_hex` con el `output_hash`.|
|`GET /v1/identifier-policies` |Enumera las políticas de identificación, los modos de normalización, las claves del resolver y los metadatos de entrada cifrados. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt` |Emitir el recibo que un usuario pueda incrustar en `ClaimIdentifier`. |
|`POST /v1/identifiers/resolve` |Resolver una entrada de identificador normalizado a la cuenta vinculada cuando existe un reclamo activo. |
|`GET /v1/identifiers/receipts/{receipt_hash}` |Busque una reclamación persistente de identificación mediante un hash de recibo para herramientas de auditoría y apoyo. |

Siempre revise el documento `/openapi` o `/openapi.json` del nodo objetivo antes de construir contra estas rutas. La disponibilidad depende de la construcción del nodo y del perfil de red.

## Tiempo de ejecución del nodo {#node-runtime}

Torii Está en proceso . RAM-LFE el tiempo de ejecución está configurado en `torii.ram_lfe.programs[*]`, teclado por `program_id`. Cada programa configurado debe coincidir con el compromiso de la política en cadena y debe proporcionar el material necesario para evaluar y Las rutas de identificación reutilican este mismo tiempo de ejecución; no requieren una superficie de configuración separada del identificador-resolvente.

El registro de una política en cadena no es suficiente por sí solo. Un nodo objetivo también debe exponer la familia de rutas y tener el material de tiempo de ejecución correspondiente para los programas que se espera ejecutar.

## Carrillas de vigilancia operativas {#operational-guardrails}

- Registre las políticas inactivas, verifique los metadatos públicos y luego activelos.
- Mantenga ocultos los secretos del evaluador, las claves de firma de resolver y el material secreto BFV fuera de los documentos, registros, transacciones y paquetes de clientes.
- No coloque identificadores crudos en los alias de cuentas, metadatos de transacciones, eventos o campos de estado mundial.
- Verificar los recibos del lado del cliente antes de enviar instrucciones de nivel superior cuando el SDK expone un verificador.
- Utilice campos de vencimiento en los que los recibos obsoletos no deben permanecer válidos para siempre.
- Rotate registrando un nuevo programa o una nueva política de identificación, migrando clientes y desactivando la vieja política una vez que fluyen nuevos recibos

## Temas relacionados {#related-topics}

- [Tarifas de patrocinio para un espacio de datos privado ](/es/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii Puntos finales](/es/reference/torii-endpoints.md#app-and-sora-route-families)
- [Las transacciones anónimas ](/es/blockchain/anonymous-transactions.md)
