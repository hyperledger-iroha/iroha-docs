---
translation_locale: zh-hans
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE 代表随机访问机器性函数评估. 在 Iroha 中,它是公共政策在链上的程序的通用隐藏函数层,但其评价者逻辑,秘密或原始输入不应该被写给世界状态.它被 SORA Nexus 识别器流,如私人电话或电子邮件搜索所使用,并且也可以作为一个通用的 Torii 程序执行辅助器,当节点配置文件启用应用面向路径时.

链条存储了政策承诺和回执验证元数据.一个解决器或 Torii 运行时评估隐藏的程序,只返回允许输出,并附加了一个客户端,支持工具或账本说明可以与注册的政策进行验证的收据.

## 命名 {#naming}

命名分为重要:

|术语|含义|
| --- | --- |
|`ram_lfe`|外层隐藏函数抽象：包括程序策略、承诺、执行收据和收据验证模式。|
|`BFV`|通过加密输入 RAM-LFE 后台使用的Brakerski/Fan-Vercauteren同样式加密方案. |
|`ram_fhe_profile`|编程加密执行机器的 BFV 特定元数据. 它不是 RAM-LFE 的第二个名称. |

在数据模型中, `RamLfeProgramPolicy` 和 `RamLfeExecutionReceipt` 是 RAM-LFE 类型. BFV 参数,加密文本封装和隐藏的 RAM-FHE 程序配置文件属于一个政策使用的加密执行后端.

## 它所记录的内容 {#what-it-records}

一项 RAM-LFE 计划政策由 `program_id` 全球注册.该政策包含:

- 可激活,禁用或以其他方式改变政策的所有者帐户
- 广告给客户的后端
- 收据验证模式, `signed` 或 `proof`
- 致力于隐藏的程序元数据和评估者秘密
- 签署的收据的解决器公钥
- 可选的公开加密输入元数据,例如 BFV 参数和 `ram_fhe_profile`
- 一个 `active` 旗,控制该政策是否可以发行新收据

隐藏的秘密,清晰文本识别值和隐藏的程序体都不存储在世界状态中.客户应将承诺,不透明的哈希,回执哈希,密码文字和程序摘要视为不透明的协议价值.

## 背景 {#backends}

目前的 RAM-LFE 支持集中在三个后端识别符上:

|后端|使用|
| --- | --- |
|`hkdf-sha3-512-prf-v1`|承诺的评估 PRF. |
|`bfv-affine-sha3-256-v1`|通过 BFV 支持的加密识别区间进行秘密表达评估. |
|`bfv-programmed-sha3-256-v1`| BFV- 通过加密注册表和内存路径进行编程执行. |

对于识别器政策来说,编程的 BFV 后端是重要的现代路径.它允许钱包在本地加密正常输入,让解析器在交易中看不到公开识别器的情况下进行评估,返回一个收据,将输出哈希绑定到注册程序的政策.

## 数学 {#math}

本节描述了当前 RAM-LFE 代码所使用的实现级代数.它不是安全证明;这是政策,收据和客户必须同意的确定性转录和加密评估模型.

### 标记 {#notation}

让:

- \(H(m)\)是 Iroha `Hash::new(m)`:Blake2b-32在 `m`上,最后字节的最小显著位被迫到 `1`.
- \(N(x)\)是 `x`的规范 Norito 编码.
- \(a \parallel b\) 字节串连的平均值
- \(\operatorname{le64}(i)\) 是一个未签名整数的8字节小编码.
- \(s\) 成为世界外的秘密解决者.
- \(P\)是公共政策参数.
- \(A\) 要求相关数据.
- \(x\)是正常化输入字节或一个 Norito 编码的加密输入封装,取决于后端.

RAM-LFE 使用域分隔的哈希.下面的公式以目的命名域名;其当前字节字符串为:

|标志|域字符串|
| --- | --- |
|\(D_{\mathrm{policy}}\)|`iroha.ram_lfe.policy.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{secret}}\)|`iroha.ram_lfe.policy_secret.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{salt}}\)|`iroha.ram_lfe.hkdf_salt.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{hkdf\_opaque}}\)|`iroha.ram_lfe.opaque_info.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{hkdf\_receipt}}\)|`iroha.ram_lfe.receipt_info.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{opaque}}\)|`iroha.ram_lfe.opaque_hash.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{receipt}}\)|`iroha.ram_lfe.receipt_hash.hkdf_sha3_512_prf.v1`|
|\(D_{\mathrm{affine\_circuit}}\)|`iroha.ram_lfe.bfv_affine.circuit.v1`|
|\(D_{\mathrm{affine\_opaque}}\)|`iroha.ram_lfe.bfv_affine.opaque_hash.v1`|
|\(D_{\mathrm{affine\_receipt}}\)|`iroha.ram_lfe.bfv_affine.receipt_hash.v1`|
|\(D_{\mathrm{program\_memory}}\)|`iroha.ram_lfe.bfv_program.memory.v1`|
|\(D_{\mathrm{program\_opaque}}\)|`iroha.ram_lfe.bfv_program.opaque_hash.v1`|
|\(D_{\mathrm{program\_receipt}}\)|`iroha.ram_lfe.bfv_program.receipt_hash.v1`|
|\(D_{\mathrm{program\_digest}}\)|`iroha.ram_lfe.bfv_program.digest.v1`|
|\(D_{\mathrm{output}}\)|`iroha.ram_lfe.output_hash.v1`|
|\(D_{\mathrm{id\_opaque}}\)|`iroha.ram_lfe.identifier.opaque_hash.v1`|
|\(D_{\mathrm{id\_receipt}}\)|`iroha.ram_lfe.identifier.receipt_hash.v1`|
|\(D_{\mathrm{bfv\_keygen}}\)|`iroha.crypto.fhe.bfv.keygen.v1`|
|\(D_{\mathrm{bfv\_encrypt}}\)|`iroha.crypto.fhe.bfv.encrypt.v1`|
|\(D_{\mathrm{id\_keygen}}\)|`iroha.crypto.fhe.bfv.identifier.keygen.v1`|
|\(D_{\mathrm{id\_slot}}\)|`iroha.crypto.fhe.bfv.identifier.slot.v1`|

### 政策承诺 {#policy-commitment}

一项政策承诺将公开参数和隐藏的解决机密绑定到后端. 首先,秘密是单独的:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

然后将整个政策转录编码为:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

并且发布的政策哈希是:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

在链上 `PolicyCommitment` 是:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

评估从运行时秘密中重新计算相同的值.如果重新计算的哈希不同,评估失败了承诺不匹配.

### HKDF-SHA3-512 后端 {#hkdf-sha3-512-backend}

对于 `hkdf-sha3-512-prf-v1`,输出是正常化输入本身,但不透明的标识符和回执哈希是秘密绑定的 PRF 输出.

要求的转录是:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF 盐和伪随机密钥为:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

不透明的材料被扩大和化:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

回执材料还将不透明的ID绑定到:

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

后端返回:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV 头 {#bfv-primer}

BFV 是一个基于网格的同形加密方案. "同形"意味着程序可以添加和乘以加密值,并在解密后得到相同的结果,就像它对平文值进行了添加和倍增一样.

在 RAM-LFE 中, BFV 作为加密输入机制:

1. 一个钱包将一个私有价值正常化,例如电话号码或电子邮件地址.
2. 钱包将字节转化为小的整数槽.
3. 每个插槽都以解决器的公钥 BFV 加密.
4. 解决器运行时通过这些密码文本来评估隐藏的程序.
5. 运行时只会解密隐藏的程序输出,或证明收据.

BFV 执行精确整数运算，而不是近似运算。因此，与浮点模型推理相比，它更适合标识符字节和小型模运算。在 Iroha 当前的 BFV 用法中，每个加密槽携带一个模 \(t\) 的标量值，通常是一个字节或字节长度字段。密文本身位于一个大得多的整数模数 \(q\) 下。\(q\) 与 \(t\) 之间的差距为加密和同态运算引入的噪声留出了解密空间。

一个 BFV 密码文本具有两个多项组件:

$$
c=(c_0,c_1)
$$

密钥是另一个多项式 \(s_k\).解密组合了以下组件:

$$
v = c_0 + c_1s_k
$$

如果密码文本是正确的形成,并且噪音仍然足够小, \(v\)就接近了扩展的平文. 圆形恢复了平文系数modulo \(t\).有用的属性是,密码文档操作保留了这个结构:

|简单操作|密码文本操作|
| --- | --- |
|\(m+n\)|添加密码文本组件.|
|\(m+\alpha\)|在 \(c_0\) 中添加一个扩展的平文常数. |
|\(\alpha m\)|通过 \(\alpha\)来测量两个密码文本组件. |
|\(mn\)|乘以密码文本多项式,重新扩展,然后再线性化.|

乘法是开销较大的操作。两个双分量密文相乘后会自然产生一个三分量密文，该密文使用 \(1\)、\(s_k\) 和 \(s_k^2\) 解密。重线性化使用已发布的求值密钥，将 \(s_k^2\) 项折回普通的双分量密文，使后续加法和乘法可以继续使用相同的密文结构。

BFV 也"级别化":每个加密操作都消耗了一些噪音预算.这种实现不会启动加密文本来更新该预算.相反,RAM-LFE 发布了一个小的 `ram_fhe_profile` 并只接受一个局限的隐藏程序形状.这使得评估保持在参数集的支持深度内.当前编程配置文件允许固定注册表计数,固定的内存通道计数和每个编程步骤最多一个密码文字-密码文本乘法.

在这个 RAM-LFE 设计中,BFV 隐藏了客户端输入的公共账本数据和观察者只看到交易或路线有效载荷.这并不意味着链本身会执行任意加密程序.Torii 解析器运行时仍然拥有 BFV 秘密材料,评估配置的隐藏程序,解密允许输出,并证明结果.账本随后验证了对链上政策承诺的认证,并解决公钥或证明元数据.

标识符使用案例故意选择一个简单的表示.正常化字符串编码为:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

每个元素都被加密为其自己的 BFV skalar ciphertext. 这种形状使正常化和封装验证显而易见,允许钱包从公共参数构建加密请求,并让解析器将相当的加密输入纳入一个稳定的收据转录中.

### BFV 指环模型 {#bfv-ring-model}

在 BFV 后端使用了否定式多项环:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

和简体文本环:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

在哪里:

- \(n\)是`polynomial_degree`,一个功率为两个
- \(q\)是`ciphertext_modulus`
- \(t\)是`plaintext_modulus`
- \(q > t\)和\(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

简体文本系数向量通过扩展每个系数编码:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

解密中心升降每一个因数:

$$
v = c_0 + c_1 s_k \in R_q
$$

然后将其回归为 \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

这里 \(s_k\) 是 BFV 密钥多项,而不是外部 RAM-LFE 分辨机密 \(s\).

### BFV 关键世代 {#bfv-key-generation}

对于加密识别器输入, BFV 密钥材料对分辨器的秘密和相关数据是决定性的:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG 种子为:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

关键发电机样本:

- \(s_k \in \{-1,0,1\}^n\),表示为modulo \(q\)
- \(a \leftarrow R_q\)均
- \(e \in \{-1,0,1\}^n\)

公开关键是:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

为了重新线性化,让 \(s_k^2\) 作为环产品 \(R_q\). 每个基地...\(B\) 数字 \(j\), 样本 \(a_j\) 均和 \(e_j\) 从小分销,然后发布:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公众 BFV 政策元数据包含 \((n,q,t,B)\), 公共钥匙; `max_input_bytes`. 其他 BFV 秘密密钥和重新线性化密钥保持在解决器运行时.

### BFV 加密和运营 {#bfv-encryption-and-operations}

为了加密一个纯文本多项 \(m\), 实施种子另一个 ChaCha20 RNG 来自:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

它采集\(u,e_1,e_2 \in \{-1,0,1\}^n\)样本并计算:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

密码文本是 \(c=(c_0,c_1)\).

在组件方面,同样式的加算是:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

添加一个简体文本尺度 \(\alpha\) 只有变化到零系数 \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

乘以纯文本尺度 \(\alpha\)的尺度对两个组件进行了重复:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

对于两个密码文字 \(c=(c_0,c_1)\) 和 \(d=(d_0,d_1)\),密码文字乘法首先计算一个大小三的密码文本,并将每个系数回调到 \(t/q\):

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

上述所有产品都是 \(R_q\) 中的否定循环环产品.然后\(\tilde c_2\)被分解为基数-\(B\)多项式:

$$
\tilde c_2 = \sum_j B^j u_j
$$

和重新线性化:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

结果又是两个组成部分的 BFV 密码文本.

### 标识符密码文本包 {#identifier-ciphertext-envelope}

一个标识器输入字节字符串:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

编码为 skalar slots:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

所有剩余的插槽均为零到 `max_input_bytes + 1`.每一个 skalar 插槽都加密为系数-零直文多项式 \([m_i]\). 每个插槽加密种子为:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

密码识别器封装是:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

在 \(M=\mathrm{max\_input\_bytes}\) 中.

### BFV 简单的后果 {#bfv-affine-backend}

对于 `bfv-affine-sha3-256-v1`，运行时首先根据 \(s\) 和 \(A\) 派生 BFV 密钥材料。派生出的公共参数必须与链上承诺的公共参数完全一致。

圆的种子是:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

从此种子中运行时样本,modulo \(t\),一个32列的相似电路:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

在 \(m_i\) 是解密的标识符插槽.同形,它在加密文本上计算出相同值:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

解析器解密每个 \(C_j\),要求所有后续直文系数为零,将系数-零值转换为字节,并表达:

$$
O=(y_0,\ldots,y_{31})
$$

然后:

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

### BFV 编程后端 {#bfv-programmed-backend}

在 `bfv-programmed-sha3-256-v1` 中,公共参数包括 BFV 标识符加密参数以及隐藏程序摘要:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

目前的 RAM-FHE 档案是:

|领域|价值|
| --- | --- |
|`profile_version`| `1` |
|`register_count`| `4` |
|`memory_lane_count`| `32` |
|`ciphertext_mul_per_step`| `1` |
|`encrypted_input_mode`|`resolver_canonicalized_envelope_v1`|
|`min_ciphertext_modulus`| \(2^{52}\) |

在执行之前,向 Torii 提交的纯文本输入被加密在同一个 BFV 封装中.该服务器侧加密的确定性种子是:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

对于外部提供的加密输入,解析器将识别包解密码并在执行之前重新加密到这个决定性包中.该规范化使回执哈希保持在语义上同等的 BFV 加密文本中稳定.

最初的加密存储路由来源于:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

对于32条路径中的每一个,运行时样本 \(r_j \in [0,t)\) 并存储 BFV 密码文字加密 \(r_j\).隐藏的程序随后通过加密注册表和加密内存执行:

|指示|算法|
| --- | --- |
|`LoadInput(dst, i)`|\(R_{\mathrm{dst}} \leftarrow C_i\)|
|`LoadState(dst, j)`|\(R_{\mathrm{dst}} \leftarrow S_j\)|
|`StoreState(j, src)`|\(S_j \leftarrow R_{\mathrm{src}}\)|
|`LoadConst(dst, a)`|\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\)|
|`Add(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_a + R_b\)|
|`AddPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\)|
|`SubPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\)|
|`MulPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\)|
|`Mul(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_aR_b\),然后重新线性化|
|`SelectEqZero(dst, cond, z, nz)`|解密 \(R_{\mathrm{cond}}\);当它是零时,选择 \(R_z\);否则 \(R_{nz}\). |
|`Output(src)`|将 \(R_{\mathrm{src}}\)添加到输出注册表列中. |

命令带完成后,解析器将每个输出注册表解密,将零系数转换为字节,并连接这些字节:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

一般的编程后端哈希是:

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

默认编程识别带有64个输入插槽.对于每个插槽 \(i\),它加载输入插孔,加载内存通道 \(i \bmod 32\),添加它们,并输出结果:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 输出标签和收据 {#output-hashes-and-receipts}

总体的 RAM-LFE 执行收据不会签署原始输出. 它会签署输出哈希:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

对于 Torii RAM-LFE 执行收据,相关数据是规范程序识别器字节:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

签署的收据有效载荷是:

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

对于 `signed`模式:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

验证通过 `resolver_public_key`检查签名并拒绝回执,除非所有这些等价均具有:

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

如果调用者提供 `output_hex`,验证人还检查:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

在 `proof` 模式中,证明带有证明封装而不是签名.验证检查证明后端,电路ID,公开输入方案哈希,验证密钥哈希和暴露的公共实例是否与证明验证器元数据和加码的回执付费哈希相匹配.让:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

预期的公开实例是四个单元列. \(j\)列包含字节 \(h_{8j}\ldots h_{8j+7}\),其次是24个零字节:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 标识符投影 {#identifier-projection}

识别器分辨率不使用通用后端 `opaque_hash`作为面向用户的不透明帐户识别器.它通过特定识别器域进行投影 RAM-LFE 输出哈希:

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

一个 `IdentifierResolutionReceipt` 签署了更高水平的有效载荷:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

签署的标识符收据:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier`只接受收据,如果签名或证明是有效的,嵌入式 RAM-LFE 执行有效载荷符合引用的程序政策,并且`uaid`和 `account_id`是被索赔的绑定.

## 执行流程 {#execution-flow}

一个通用 RAM-LFE 执行方式是这样的:

1. 管理或运营商注册表 `RamLfeProgramPolicy`.
2. 车主会激活保险.
3. 客户从 Torii 读取公共政策的元数据.
4. 客户端向解决器提交一个输入形式:简体文本 `input_hex`或加密的输入封装 BFV.
5. 运行时评估隐藏的程序,并返回 `output_hex`, `output_hash`, `opaque_hash`,`receipt_hash`和`RamLfeExecutionReceipt`.
6. 客户端或后端会根据公布的政策验证收据,可选地检查返回的 `output_hex`与收据的 `output_hash`哈希.
7. 一个更高层次的指令,如 `ClaimIdentifier`,可以嵌入证实收据,而不是嵌入原始输入.

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

## 标识器政策 {#identifier-policies}

标识策略是具体使用 RAM-LFE.它们在通用程序政策之上添加了商业名称空间和规范化规则:

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

标识层使用 RAM-LFE 收据绑定:

- `policy_id`
- 隐藏函数所取出的不透明标识符
- 确定性 `receipt_hash`
- 账户的 UAID
- 规范 `account_id`
- 一般执行有效载荷 RAM-LFE

对于面向用户的登录,请将帐户号与私人标识符分开.号是公众名称;电话号码,电子邮件地址和类似值应通过标识符政策和收据流动.

## Torii 航线 {#torii-routes}

在启用应用程序面向的路线家族时, Torii 将 RAM-LFE 和识别辅助器曝光到:

|路线|目的|
| --- | --- |
|`GET /v1/ram-lfe/program-policies`|列出活跃和不活跃的 RAM-LFE 程序政策和公开执行元数据. |
|`POST /v1/ram-lfe/programs/{program_id}/execute`|执行一个程序从 `input_hex`或 `encrypted_input`,并返回输出哈希加上无状态收据. |
|`POST /v1/ram-lfe/receipts/verify`|根据公布的政策验证`RamLfeExecutionReceipt`并可选地比较`output_hex`和 `output_hash`. |
|`GET /v1/identifier-policies`|列出识别器政策,正常化模式,解决钥匙和加密输入元数据.|
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt`|发行用户可以嵌入到 `ClaimIdentifier` 的收据.|
|`POST /v1/identifiers/resolve`|当有活跃索赔时,解决对绑定账户的正常化识别器输入. |
|`GET /v1/identifiers/receipts/{receipt_hash}`|通过收据哈希查找持久识别索赔,用于审计和支持工具. |

在构建之前,总是检查目标节点的 `/openapi.json`文档.可用性取决于节点构建和网络配置文件.

## 节点运行时 {#node-runtime}

Torii 的进程中运行时 RAM-LFE 设置在 `torii.ram_lfe.programs[*]`下,按 `program_id`键.每个配置程序必须符合链上政策承诺,并且必须提供评估和证实收据所需的运行时材料.识别路线重复使用相同的运行时段;它们不需要单独的识别器-解析器配置表面.

仅在链上注册策略并不足够。目标节点还必须开放相应的路由族，并为预期执行的程序配备匹配的运行时材料。

## 运营监护轨道 {#operational-guardrails}

- 先将策略注册为非启用状态，验证公开元数据，然后再启用。
- 在文件,日志,交易和客户群中隐藏评估员的秘密,解决器签字密钥和 BFV 的秘密材料.
- 不要将原始标识符放入账户姓名,交易元数据,事件或世界状态字段中.
- 在 SDK 暴露验证器时,在提交更高层次指令之前,向客户端核实收据.
- 使用过时收据不应永远有效的到期字段.
- 通过注册一个新的程序或识别器政策,迁移客户,并在新收益流动时关闭旧的政策来旋转.

## 相关主题 {#related-topics}

- [个人数据空间的赞助费用](/zh-hans/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md#app-and-sora-route-families)
- [无名交易](/zh-hans/blockchain/anonymous-transactions.md)
