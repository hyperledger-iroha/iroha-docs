---
translation_locale: zh-hans
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE 机器随机获取机器的值函数评估.
Iroha, 它是公共政策的隐藏函数层
是连锁的,但该评估器逻辑,秘密或原始输入不应该是
国际国家. SORA Nexus 标识流,如
个人电话或电子邮件查询,也可以作为通用药物 Torii
当节点配置文件启用应用面向路线时,程序执行辅助器.

链存储政策承诺和收据验证的元数据.
解决器或 Torii 运行时间评估了隐藏的程序,只返回了
允许输出,并附加了客户端的收据,支持工具,或
本书说明可以与注册政策进行验证.

## 命名 {#naming}

名称分类是重要的:

| 术语 | 含义 |
| --- | --- |
| `ram_lfe` | 外部隐藏函数抽象:程序政策,承诺,执行收据和收件验证模式. |
| `BFV` | 通过加密输入使用的Brakerski/Fan-Vercauteren同形加密方案 RAM-LFE 背后. |
| `ram_fhe_profile` | BFV-用于编程加密执行机器的特定元数据. RAM-LFE. |

在数据模型中, `RamLfeProgramPolicy` 并且 `RamLfeExecutionReceipt` 是
RAM-LFE 这些类型. BFV 密码文本包裹,以及隐藏的
RAM-FHE 程序配置文件属于一个使用的加密执行后端
政策.

## 它所记录的内容 {#what-it-records}

一个 RAM-LFE 项目政策在全球范围内被注册 `program_id`. 政策
含有:

- 能激活,禁用或以其他方式改变用户帐户的所有者
  政策
- 向客户广告的后端
- 收据验证方式, `signed` 或 `proof`
- 承诺隐藏的程序元数据和评估者秘密
- 签名收据的解决器公钥
- 任意的公共加密输入元数据,如 BFV 参数和
  `ram_fhe_profile`
- 一个 `active` 控制政策是否可以发行新收据的旗

隐藏的秘密,直文识别值和隐藏的程序体是
客户应该处理承诺,不透明的哈希,
接收哈希,密码文本和程序消化作为不透明协议值.

## 背景 {#backends}

电流 RAM-LFE 支持集中在三个后端标识符上:

| 后端 | 使用 |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | 承诺约束 PRF 评估. |
| `bfv-affine-sha3-256-v1` | BFV- 通过加密识别区的秘密分析. |
| `bfv-programmed-sha3-256-v1` | BFV 通过加密注册表和内存路径进行编程执行. |

对于标识政策,编程的 BFV 后端是重要的现代
它允许钱包在本地加密正常输入,让解决器
在交易中没有看到公开标识符的情况下进行评估,并返回一个
收件将输出哈希绑定到注册程序政策.

## 数学 {#math}

本节描述了当前使用的实现级代数
RAM-LFE 这不是安全性证明,而是确定性的转录.
政策,收益和客户必须
我们同意.

### 标记 {#notation}

让:

- ,, Iroha `Hash::new(m)`: 布莱克2B-32结束 `m`, 最少的
  最终字节的重要部分被迫 `1`.
- 们都在做什么? Norito 的编码 `x`.
- \(a \parallel b\) 平均字节串连.
- 运营商名称{le64}
  没有签名的整数.
- \(s\) 成为世界外国家秘密的解决者.
- \(P\) 是公共政策参数.
- \(A\) 要求相关数据.
- \(x\) 是正常化输入字节或 Norito-加密加密输入
  根据后端.

RAM-LFE 下面的公式为域名命名
目的;它们的当前字节字符串是:

| 标志 | 域字符串 |
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

### 政策承诺 {#policy-commitment}

一项政策承诺将公开参数和隐藏的解决方案
首先,秘密是单独的:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

然后将整个政策转录编码为:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

发布的政策哈希是:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

在链上 `PolicyCommitment` 是:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

评估将从运行时间秘密中重新计算相同的值.
重新计算的哈希不同,评估失败与承诺不匹配.

### HKDF-SHA3-512 后端 {#hkdf-sha3-512-backend}

对于 `hkdf-sha3-512-prf-v1`, 输出是正常化输入本身,但
不透明的标识符和收件哈希是密封的 PRF 输出.

要求的转录是:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

其他 HKDF 盐和伪随机密钥是:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

不透明的材料扩大和化:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

收件材料还绑定了不透明的ID:

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

BFV 是基于网格的同形加密方案. "同形"是指
一个程序可以添加和乘以加密值,并在解码后,
得到相同的结果,就像它执行了加和乘法
在单文值上.

对于 RAM-LFE, BFV 作为加密输入机制使用:

1. 一个钱包将私人价值正常化,比如电话号码或电子邮件
   收到的地址
2. 钱包将字节转化为小整数槽.
3. 每个插槽都是用解决器的加密 BFV 公共钥匙
4. 解决器运行时间通过这些加密文本来评估隐藏的程序.
5. 运行时间仅解密了隐藏的程序输出和标志或证明一个
   收件.

BFV 这就是为什么它是正数算法,而不是近似算法.
更适合识别字节和小型模块计算,而不是
波动点模型推断. Iroha 电流 BFV 使用,每个加密
插槽载有一个尺度值模块 \(t\), 通常是字节或字节长度
密码文本本身是一个更大的整数的模块 \(q\). 其他
之间的差距 \(q\) 并且 \(t\) 给出了解密空间的噪音,
并且引入同形操作.

一个 BFV 密码文本有两个多项组件:

$$
c=(c_0,c_1)
$$

秘密密钥是另一个多项 \(s_k\). 解密组合了
组件:

$$
v = c_0 + c_1s_k
$$

如果密码文字是正确的形成,噪音仍然足够小,
\(v\) 轮回检索清晰文本
分数模块 \(t\). 值得注意的是,
保持这种结构:

| 简单操作 | 密码文本操作 |
| --- | --- |
| \(m+n\) | 添加密码文本组件. |
| \(m+\alpha\) | 添加一个扩展式直文常数到 \(c_0\). |
| \(\alpha m\) | 按数量测量两个加密文本组件 \(\alpha\). |
| \(mn\) | 乘以密码文本多项,重新扩展,然后再线性化. |

乘法是昂贵的操作.
密码文本自然会创建一个三组件的密码文档,
\(1\), \(s_k\), 并且 \(s_k^2\). 重新线性化使用已发表的评估密钥
折叠 \(s_k^2\) 这种字体可以将这个词转化为正常的两个元件加密文本.
使用相同的密码文本形状保存后续添加和乘法.

BFV 也是"级别化":每一个加密操作都需要一些噪音预算.
这种实施不会启动加密文本来更新预算.
而是, RAM-LFE 出版了一个小的 `ram_fhe_profile` 他只接受一个有限的,
这使得评估保持在参数集的内
目前的编程配置文件允许固定注册
计数,固定的内存轨道计数,最多一个密码文本-密码文字
每个编程步骤的乘法.

在这个 RAM-LFE 设计, BFV 隐藏客户端输入的公共账本数据,
只有看到交易或路线有效载荷的观察员.
链接自行执行任意的加密程序. Torii 解决器
运行时间仍然拥有 BFV 秘密材料,评估配置的隐藏
程序,解密允许的输出,并证明结果.
然后验证了对链上政策承诺的认证,
解决公钥或证明元数据.

标识符使用案例故意选择简单的表示.
标准化字符串编码为:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

每个元素都被加密为自己的 BFV 这种形状使得
允许钱包构建加密
解决器可以加нони化等级.
已加密输入到稳定的收据转录中.

### BFV 戒指模型 {#bfv-ring-model}

其他 BFV 后端使用否定式多项环:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

和简体文本环:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

在哪里:

- \(n\) 是 `polynomial_degree`, 一个功率为2
- \(q\) 是 `ciphertext_modulus`
- \(t\) 是 `plaintext_modulus`
- \(q > t\) 并且 \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

简体文本系数向量通过扩展每个系数进行编码:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

解密中心升降每一个因数:

$$
v = c_0 + c_1 s_k \in R_q
$$

然后将它回归到 \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

这里 \(s_k\) 是 BFV 密钥多项,而不是外部 RAM-LFE 解决器
秘密 \(s\).

### BFV 关键一代 {#bfv-key-generation}

对于加密识别器输入, BFV 关键材料是确定性
解决器的秘密和相关数据:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

其他 BFV RNG 种植为:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

关键发电机样本:

- \(s_k \in \{-1,0,1\}^n\), 代表的模块 \(q\)
- \(a \leftarrow R_q\) 均的
- \(e \in \{-1,0,1\}^n\)

公开的关键是:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

为了重新线性化,让 \(s_k^2\) 作为环产品 \(R_q\). 每个
基础\(B\) 数字 \(j\), 样本 \(a_j\) 均和 \(e_j\) 从小的
发行,然后发布:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公众 BFV 政策元数据包含公共密钥,
`max_input_bytes`. 其他 BFV 秘密钥匙和重新线性化钥匙
解决器运行时间.

### BFV 加密和操作 {#bfv-encryption-and-operations}

为了加密一个直文多项 \(m\), 实施种子
ChaCha20 RNG 来自:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

它的样本 \(u,e_1,e_2 \in \{-1,0,1\}^n\) 和计算器:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

密码文本是 \(c=(c_0,c_1)\).

同形的加算是组件理性的:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

添加一个直文尺度 \(\alpha\) 只有变化到零系数
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

乘以平文尺度 \(\alpha\) 两个组件的尺度:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

对于两个密码文本_0,c_1) \) 和\(d=_0,d_1) \),加密文本
乘法首先计算一个大小3个密码文本,每个字母都在
返回因数 \(t/q\):

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

上述所有产品均为 \(R_q\). 然后
\(\tilde c_2\) 已分解成基层\(B\) 多项式:

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

结果又是两个组成部分. BFV 密码文本.

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

所有剩余的插槽都是零到 `max_input_bytes + 1`. 每个尺度
插槽被加密为系数零直文多项式 \([m_i]\).
每个插槽的加密种子是:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

密码识别器包裹是:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

在哪里 \(M=\mathrm{max\_input\_bytes}\).

### BFV 完整的后果 {#bfv-affine-backend}

对于 `bfv-affine-sha3-256-v1`, 运行时间首先取出 BFV 关键材料
\(s\) 并且 \(A\). 衍生的公共参数必须与公众完全一致
在链上提交的参数.

这种芽的种子是:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

从这个种子中运行时间样本,模块 \(t\), 一个32行的相似电路:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

在哪里 \(m_i\) 它们是解密的识别区块.
在密码文本上相同的值:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

解决器将每个解密 \(C_j\), 要求所有后续单文本
为零的系数,将系数-零值转换为字节,
形式:

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

对于 `bfv-programmed-sha3-256-v1`, 公共参数包装 BFV 标识符
加密参数和隐藏程序消化:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

电流 RAM-FHE 个人资料是:

| 领域 | 价值 |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

提交给 Torii 已加密成相同的 BFV 包裹
在执行之前.该服务器边加密的决定性种子是:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

对于外部提供加密输入,解析器解码识别符
在执行之前将它重新加密到这个确定性包裹上.
这种加нони化使收件哈希在语义上保持稳定
BFV 密码文本.

最初的加密存储路由来源于:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

对于每条32条车道,运行时间样本_j \in [0,t)\) 并存储a BFV
密码文本加密 \(r_j\). 隐藏的程序然后执行加密
登记器和加密内存:

| 指示 | 算法 |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | 没有任何问题_现在,我们要做什么呢? |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), 然后重新排列 |
| `SelectEqZero(dst, cond, z, nz)` | 解密 \(R_{\mathrm{cond}}\); 选择 \(R_z\) 如果是零,否则 \(R_{nz}\). |
| `Output(src)` | 附录 \(R_{\mathrm{src}}\) 在输出注册表列中. |

在命令带完成后,解决器解密出口
注册,将零系数转换为字节,并连接这些字节:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

一般编程后端哈希是:

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

默认编程的识别带有64个输入插槽.
\(i\), 它加载输入口,加载内存路径 \(i \bmod 32\), 增加它们,
并且输出结果:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 输出标签和收据 {#output-hashes-and-receipts}

一般药物 RAM-LFE 执行收据没有签署原始输出.
输出哈希:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

对于 Torii RAM-LFE 执行收据,相关数据是正规的
程序识别器字节:

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

对于 `signed` 模式:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

验证检查签名 `resolver_public_key` 拒绝了
收件,除非所有这些等价均有:

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

如果调用者提供 `output_hex`, 验证者还检查:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

对于 `proof` 证书的形式,证明包含一个证据包裹而不是
验证证明后端,电路识别器,
公开输入方案哈希,验证密钥哈希和公开实例
匹配证据验证器的元数据和加密的收件付款哈希.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

预期的公共实例是四个单元列. \(j\)
包含字节 \(h_{8j}\ldots h_{8j+7}\) 接着是24个零字节:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 标识器投影 {#identifier-projection}

识别器分辨率不使用通用后端 `opaque_hash` 作为
用户面向的不透明帐户识别符. RAM-LFE 输出哈希
通过特定识别器域:

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

一个 `IdentifierResolutionReceipt` 签署一个更高水平的有效载荷:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

签署的身份证明收据:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` 只有签名或证明时才接受收据
有效的,嵌入式 RAM-LFE 执行有效载荷与引用的程序匹配
政策,以及 `uaid` 并且 `account_id` 是被要求的约束权.

## 执行流量 {#execution-flow}

一种通用药物 RAM-LFE 执行方式是这样的:

1. 管理或运营商注册表 `RamLfeProgramPolicy`.
2. 所有者会激活保险.
3. 客户阅读公共政策的元数据 Torii.
4. 客户端向解析器提交一个输入表格:
   `input_hex` 或加密 BFV 输入包裹.
5. 运行时间评估隐藏的程序,并返回 `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, 和一个
   `RamLfeExecutionReceipt`.
6. 客户或后端根据公布的政策验证收据,
   选择性检查返回的 `output_hex` 收据的哈希
   `output_hash`.
7. 一个更高层次的教学,如 `ClaimIdentifier`, 可以嵌入
   证实收据,而不是嵌入原始输入.

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

## 标识政策 {#identifier-policies}

确定性政策是具体的使用 RAM-LFE. 他们增加了业务.
在通用程序政策之上,名称空间和规范化规则:

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

识别层使用 RAM-LFE 收据将结合:

- `policy_id`
- 隐藏函数所衍生的不透明标识符
- 确定性 `receipt_hash`
- 账户的 UAID
- 圣经 `account_id`
- 一般药物 RAM-LFE 执行有效载荷

对于面向用户的登录,保持账户号与私人分开
姓氏是公众名字,电话号码,电子邮件地址和
类似的价值应通过识别政策和收益流动.

## Torii 航线 {#torii-routes}

当应用程序面向的路线家族被启用时, Torii 曝光 RAM-LFE 并且
标识器辅助员:

| 路线 | 目的 |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | 活跃和不活跃的列表 RAM-LFE 项目政策和公开执行元数据. |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | 执行一个程序 `input_hex` 或 `encrypted_input` 返回输出哈希,加上无国有收据. |
| `POST /v1/ram-lfe/receipts/verify` | 验证一个 `RamLfeExecutionReceipt` 与公布的政策相比,可选地进行比较 `output_hex` 在 `output_hash`. |
| `GET /v1/identifier-policies` | 列出识别器政策,正常化模式,解决键和加密输入元数据. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | 发行用户可以嵌入的收据 `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | 在有活力索赔的情况下,解决绑定账户的正常化识别器输入. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | 通过收据哈希查找持续的识别索引,用于审计和支持工具. |

总是检查目标节点 `/openapi` 或 `/openapi.json` 之前的文件
可用性取决于节点构建和
网络配置文件.

## 节点运行时间 {#node-runtime}

Torii 现在正在进行. RAM-LFE 运行时间设置为
`torii.ram_lfe.programs[*]`, 按键 `program_id`. 每个配置的程序
必须符合链上政策承诺,并且必须提供运行时间
鉴定路线重复使用
同样的运行时间;它们不需要单独的识别器-解决器配置
表面.

单独注册在链上的政策不够.
也暴露路线家族,并具有匹配的运行时间材料
预计会执行的程序.

## 运营护卫轨 {#operational-guardrails}

- 登记政策不活跃,验证公开的元数据,然后激活它们.
- 隐藏评估员的秘密,解决器签字密钥, BFV 秘密
  文件,日志,交易和客户包的材料.
- 不要将原始标识符放入账户姓名,交易元数据,
  其他国家或地区.
- 在提交更高层次的指示之前,向客户端验证收据
  在 SDK 暴露验证器.
- 使用过时收据不应永远有效的到期字段.
- 通过注册新的程序或识别政策,移动客户,
  在新的收益流动时,

## 相关主题 {#related-topics}

- [个人数据空间的赞助费用](/zh-hans/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md#app-and-sora-route-families)
- [匿名交易](/zh-hans/blockchain/anonymous-transactions.md)
