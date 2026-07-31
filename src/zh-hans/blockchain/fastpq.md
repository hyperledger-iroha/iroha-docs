---
translation_locale: zh-hans
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ 是 Iroha 现在 STARK 对于选定的执行效果的验证路径.
不取代正常的交易执行或共识.
经过 ISI, IVM, 并且 Sumeragi 像往常一样; FastPQ 消费者
确定性执行证据,并将支持的效果转化为证明
一些批量.

目前的主机集成有三个主要途径:

- 在区块执行过程中记录的透明数值资产转移
- Nexus 经过验证的车道继电器 AXT 证据包装载有 FastPQ
  具有约束力
- SCCP 透明的信息证明辅助器, FastPQ 证据
  开放核实包

## 转移证人的路径 {#transfer-witness-path}

透明数值转移创建一个结构化转移转录,
命令改变了平衡.

- 来源账户,目的地账户,资产定义和金额
- 转移前和后的发送人和接收者的余额
- 作为批量哈希所使用的交易入口点哈希
- 从提交账户中获取的权威摘要
- 一个多尔塔转录的波西顿消化器

批发转移使用一个多个分域的转录.
没有单达特拉波西顿消化器.

在完成区块时, Iroha 按输入点哈希组分这些转录.
执行证人然后携带原始的抄录捆绑和
在 FastPQ 适用于检测器的过渡批量.

每个转移三角形变成两个过渡行:

| 排列             | 关键形状                                        | 预值               | 后值             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| 发送人借款    | `asset/<asset-definition>/<source-account>`      | 发送者前的余额   | 发送人余额之后   |
| 收件人信用 | `asset/<asset-definition>/<destination-account>` | 接收者前的余额 | 接收者余额之后 |

数值将正常化为整数证实单位.
拒绝 FastPQ 如果不能被表示为非负数,则批量
`u64` 在选择的数分级上.

## 公共输入 {#public-inputs}

每一个 FastPQ 过渡批量载有公共输入,将证明绑定到
区块和执行环境:

| 输入         | 含义                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | 编码为小单元字节的数据空间标识符             |
| `slot`        | 区块创建时间转换为纳秒                    |
| `old_root`    | 从执行证人中获得的父母状态根            |
| `new_root`    | 从执行证人的后状态根源              |
| `perm_root`   | 西顿对主动角色许可的承诺                |
| `tx_set_hash` | 排序交易和时间触发入口点的哈希 |

主机使用 `fastpq-lane-balanced` 作为设置为
这些批量.

## 数学模型 {#mathematical-model}

这一节描述了当前运行的算法 Rust
下面所有的现场行动都在黄金上.
基本场:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ 使用Poseidon2 `F` 子的宽度
`t = 3`, 利率 `r = 2`, 和容量 `1`. 哈希吸收在
速度-2块,并添加一个单个场元素 `1` 在决赛之前
变量:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

字节链被包装成7字节的小子肢体,所以每个肢体都是
严格下 `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

域分区的字段哈希表示为:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

对于从字节域中开始的哈希, FastPQ 绘制了第八个
在该领域中输入小英字节

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

这里 `Hash` 的意思 Iroha 现在 `iroha_crypto::Hash::new`, 一个32字节的Blake2bVar
消化,除非公式明确命名Poseidon2或 SHA-256.

### 领域算术 {#field-arithmetic}

其他 Rust 代码表示字段元素是正规的 `u64` 在
`[0,p)`. 加入和减去是:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

乘法首先计算了128位产量:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

然后使用身份:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

如果:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

然后减小器计算:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

实施条件地增加或减去 `p` 直到结果是
签署的整数,如平衡德尔塔,由:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### 波西顿2变量 {#poseidon2-permutation}

波西顿2变量状态是:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

它的S-box是:

$$
S(x)=x^5
$$

FastPQ 用了四个全轮,五十七个部分轮,然后再用四个
一个圆满的轮子,有圆形常数
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` 是:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

一个部分轮是:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

所有的添加和乘法都在 `F`. 圣经 MDS 矩阵是:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

对于每一个完整的速度-2块
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最后一块添加了 `1` 在最后一个之前的填充元素
输出是 `x_0`.

### 公众输入的约束力 {#public-input-binding}

主机编码一个数据空间ID,通过写其 `u64` 在第一个
16 字段的8个小安字节:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

区块创建时间从毫秒转换为纳米秒:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

交易设置哈希是对分类入口点的字节域哈希
哈希:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

在哪里 `h_i` 它们是分类的交易和时间触发入口点哈希.
证据公开 IO, 如果 `perm_root` 或 `tx_set_hash` 只有零,
提示符填写后退值:

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

### 数字正常化 {#numeric-normalization}

每个转移三角形,目标十进制尺度是最大切割的
通过数量和两个平衡快照:

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

一个 `Numeric` 值与 mantissa `m` 和规模 `q` 只有在
`m >= 0` 并且 `q <= s`. 它的 FastPQ 证人价值为:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

正常化结果必须符合 `u64`.

### 规范性订单 {#canonical-ordering}

在跟踪施工之前,按过渡键进行分类,操作
排名和原始插入指数:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

订单承诺是Poseidon2域的哈希
`fastpq:v1:ordering` 和 Norito 排序过渡的编码:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

在哪里 `P` 是7字节的包装, `E` 是 Norito 编码, `D_o` 是
`fastpq:v1:ordering`, 并且 `T*` 是排序过渡列表.

### 转移方程 {#transfer-equations}

转账金额 `a`, 发送人平衡 `f`, 和收件人余额 `t`,
FastPQ 在建立痕迹之前验证了正常化的证人值:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

然后,过渡行编码:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

在痕迹内,签署的海域被降低为 `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

选择性单-德尔塔转移消化承诺编码转移
预览:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

对于多达传输转录,当前格式要求:
没有高水平的消化.

接待机关对转移转录的消化器是:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### 追踪行 {#trace-rows}

让排序过渡列表包含 `n` 实行. 痕迹长度是
接下来的两个功率:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

排列 `0..n-1` 活动;行 `n..N-1` 每一个真正的行都有
一个操作选择器组:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

所有选择器列都是布尔式:

$$
s(s-1)=0
$$

许可查找行是完全授予角色和撤销角色的行:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

对于数值运算行:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

建筑师还追踪每资产的运行地带:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

只有薄荷和燃烧行更新供应计数器:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

转数据和数据空间跟踪列是从行前获得的字段哈希
现实化:

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

数据空间和插槽均稳定在相邻的区块上
追踪行:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### 转移 Merkle 列 {#transfer-merkle-columns}

如果一个主机证明是
缺失,检查器从行键合成一个确定性路径,
前平衡,以及列是否是发送方或接收方.

对于合成路径,味道盐是 `fastpq:smt:from` 对于发送行
并且 `fastpq:smt:to` 对于接收器行:

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

合成叶片和内部节点是:

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

追踪记录了这一点 `b_l`, 兄弟姐妹 `s_l`, 输入节点 `x_l`, 并且
输出节点 `x_{l+1}` 在每一个层面上.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### 允许的 Hash {#permission-hashes}

角色授予和撤销行 哈希权证:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

主机权限表根分类条目按角色字节,许可
然后构建一个Poseidon2 Merkle树:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

奇数宽度水平复制了最后的元素.

### 追踪承诺 {#trace-commitment}

对于每一个痕迹列 `c`, FastPQ 首先将列值插入
追踪域和哈希的系数向量:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

痕迹根是Poseidon2 Merkle根在列承诺上:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

最后的追踪承诺是对域,参数集合,
痕迹形状,列消化和痕迹根:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

在哪里 `D_c` 是 `fastpq:v1:trace_commitment`.

### AIR 组成 {#air-composition}

其他 V1 AIR 组合值是排位残留的线性组合.
转录样本展示了两个挑战:

$$
\alpha_0,\alpha_1 \in F
$$

对于每个相邻的行对 `(i,i+1)`, 检查器计算:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

剩余物 `rho` 在代码顺序下:

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

对于有数列的行:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

对于稳定批量背景列:

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

验证器重新计算 `A_i` 对采样行径开口和检查
根据 AIR 组成 Merkle
根源.

### 搜索产品 {#lookup-product}

允许搜索的积累器使用了菲亚特-沙米尔挑战 `gamma`.
在低级扩展评估中, `s_perm` 并且 `perm_hash`, 在
运行产品是:

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

证据记录:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 较低程度的延伸 {#low-degree-extension}

让我们 `omega_T` 成为追踪域生成器, `omega_E` 在
评估领域生成器,以及 `g` 设置的可塞特偏移.
有值的跟踪列 `v_i`, 插射产生系数 `a_j`
这样:

$$
f(\omega_T^i)=v_i
$$

低度扩展评估了科塞特上的相同多项式:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

执行通过乘以权限的系数来计算这一数字
之前的可塞特抵消 FFT:

$$
a'_j = a_j g^j
$$

然后评估 `a'` 在评估领域.

其他 CPU FFT 是一个反复的基径-2Cooley-Tukey转换
在阶段长度 `L`, 半长度 `H=L/2`, 和舞台
根:

$$
\omega_L=\omega^{N/L}
$$

每只蝶计算:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

逆转 FFT 运行相同的转换 `omega^{-1}` 和子的尺度,
逆域大小:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

在使用前验证目录根:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

对于来自目录根的较小域名,生成器是:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### 排列和叶子 {#row-and-leaf-hashes}

之后 LDE, FastPQ 每一行在所有 LDE 列表 `m` 列:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

如果排列哈希仍然在追踪域中,而不是评估
域,查询器插入并扩展该单行hash列
具有相同的可塞特 LDE 过程.

### 梅克尔开口 {#merkle-openings}

LDE 值分为:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

每个片叶是:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

梅克尔的父母是:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

奇数级别复制了最后一个节点.查询路径通过左或
根据每个级别的查询页面指数平衡.

对于指标的叶子 `i`, 一条路径 `(s_0,\ldots,s_{d-1})` 检测到
根 `R` 通过重复:

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

只有:

$$
y_d=R
$$

AIR 痕迹行叶是:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR 组合叶是:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

其他 LDE 查询开放也检查了在评估指数上开放的值
`i` 在其认证部分中存在:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI 折叠 {#fri-folding}

FRI 承诺 AIR 对于每轮的组合评估 `l`, 在
转录样本是一个挑战 `beta_l`. 层面被成多个
每个 arity 尺寸组折叠为:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

在哪里 `a` 是 FRI 验证器对每一个采样查询进行检查
链,即:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

每个打开的 FRI 集团对应的 FRI 层
根源.

### 菲亚特-沙米尔转录 {#fiat-shamir-transcript}

标准参数目录标记了转录哈希为 SHA3-256.
目前的检查器和验证器实现中,挑战字节为
`iroha_crypto::Hash::new`, 这是一个32字节的Blake2bVar消化,
将第一个8个小位字节降低为 `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

挑战呼叫将完整的摘录添加到转录状态.
顺序是:

1. 公众 IO, 协议版本,参数版本和参数名称
2. LDE 根和痕迹根
3. `gamma`
4. AIR 构成挑战 `alpha_0`, `alpha_1`
5. AIR 痕迹根和 AIR 组合根
6. 搜索大产品
7. FRI 层根和 `beta_l` 挑战
8. 采样查询指数

查询样本将继续绘制32字节的挑战摘录,并读取它们为
小子 `u64` 片,直到它获得要求的唯一数量
指数:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

取样组以分类顺序返回.

### 验证器重播 {#verifier-replay}

验证者首先重新计算批次承诺:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

要求:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

它还重建了公共 IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

每个领域都必须与证据的公众一致 IO 验证器
然后重建相同的转录并获得相同的结果:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

每个采样查询 `q`, 检查:

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

和:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

其他 AIR 组合开放必须验证 `R_air_composition`.
其他 FRI 链接然后从相同的开始 `A_q` 必须以一个
证实最终 FRI 在终端下面的叶子 FRI 根源.

## 箴言所检查的内容 {#what-the-prover-checks}

在建立痕迹之前, FastPQ 供应器将批量顺序定制.
通过过渡键,操作排名和插入顺序.
需要转录元数据. 一批传输行,但没有传输
转录是无效的.

转移记录的检查包括:

- 发送器平衡不能下流
- `sender_after` 必须等于 `sender_before - amount`
- `receiver_after` 必须等于 `receiver_before + amount`
- 转录必须涵盖批量中的每一行转移
- 如果存在,一个单德尔塔的Poseidon消化必须与转录相匹配
  预示图
- 提供稀疏Merkle证明必须被解码为版本 1;缺失的路径是
  装满了定性合成证明

痕包含转移,硬币,燃烧,角色授予的选号列
取消角色,元数据集和权限搜索行. 数字操作
排列还载有签署的海域,每资产运行的海域和供应
计数器.

## 博场 {#prover-lane}

`irohad` 开始了 FastPQ 启动时,如果可使用后端
路径是一个背景任务,有界限的排队.
区块产生了执行证人,提交路径提交了一个检查工作
包含区块哈希,高度,视图和证人.

如果车道没有运行或排队满,工作被跳过
这意味着后台供应路线是
不是交易录取或共识门.
已经执行的状态.

车道构建一个具有:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` 让检查员选择可用的后端. `cpu` 执行脚本
在 CPU. `gpu` 最喜欢的 GPU 执行, CPU 落后时,
后端不能使用所需的内核.

## 验证 {#verification}

FastPQ 证据验证重建了法定批量承诺,
验证器检查协议版本,
设置参数版本,重播限制,追踪承诺,公共输入
采样的Merkle开口, AIR 开口,以及 FRI 查询链.

默认重播限制包括:

| 限制              | 默认 |
| ------------------ | ------: |
| 过渡行    |     256 |
| 批量有效载荷大小 | 256 KiB |
| FRI 层         |      16 |
| 查询开放时间     |     128 |

## Nexus 经过验证的继电器 {#nexus-verified-relays}

Nexus AXT 证据包裹可以嵌入一个 `AxtFastpqBinding`. 当
`RegisterVerifiedLaneRelay` 执行, Iroha:

1. 验证车道继电信封, FastPQ 证明材料
2. 检查数据空间和表格根
3. 解码 AXT 证据包裹
4. 需要一个 `fastpq_binding`
5. 修建了 FastPQ 从这种结合的批量
6. 解码嵌入式 FastPQ 证据
7. 呼叫 FastPQ 重建批量验证器和证明

如果验证成功, Iroha 存储一个 `VerifiedLaneRelayRecord`
包含继电器引用,原始包装,证明有效载荷哈希
验证高度,表达根,以及 FastPQ 具有约束力.

车道继电信封面也具有紧的 FastPQ 证据材料.
是路径ID,数据空间ID,区块高度,验证的消化
一个继电器是
合并只能在拥有两者 QC 且有效 FastPQ 证据
材料.

### AXT 有关数学 {#axt-binding-math}

对于 Nexus AXT 包裹, `AxtFastpqBinding` 在证据之前被定为神圣.
默认的空参数值为 `fastpq-lane-balanced`; 空白
验证器 id 和版本默认到 `fastpq` 并且 `v1`; 索赔类型被剪切
且被降低.

其他 AXT FastPQ 公共输入是确定性字节哈希:

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

AXT 过渡关键是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

其他 `authorization` 索赔插入了授予角色的行:

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

授权政策的结合性. `compliance` 索赔
插入两个元数据行:一个用于政策,另一个用于目标数据库.

对于 `tx_predicate` 并且 `value_conservation`, 显而易见的效果数量为
使用当结合物含有正源或目的量时.
否则,代码将获得有限的确定性值:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

然后使用相同的转移方程:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成发送和接收账户ID由关键种子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

转移批量哈希是:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

其他 AXT 批量表格消化是 SHA-256 在 Norito 的编码
圣经的约束:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明的信息证据 {#sccp-transparent-message-proofs}

其他 SCCP 助手盒也使用 FastPQ 透明链交叉信息
这条路线与 `irohad` 后台检查车道.
构建一个 FastPQ 直接从一批 SCCP 信息证明包和
证明,然后将结果的证据包装为开放验证.

其他 SCCP 批量使用 `fastpq-lane-balanced` 和三个元数据过渡:

| 关键                             | 行动 |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

它的公共输入来源于 SCCP 透明的内部证明:

| FastPQ 输入  | SCCP 来源                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | 在语句hash上,Blake2b的第16字节消化 |
| `slot`        | 终点高度                                            |
| `old_root`    | 有效载荷哈希                                               |
| `new_root`    | 承诺的根                                            |
| `perm_root`   | 终点区块哈希                                        |
| `tx_set_hash` | 语句哈希                                             |

其他 SCCP 常规编码器写整数小编码
变长字节阵列如:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

透明的公共输入字节字符串是:

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

透明语句字节是版本,链接的连锁
家庭,本地和对方领域,安全模式,基层治理
账户代码,终结性模型,验证器目标,验证者后端家族
长度预定链/后端/显现字段,目的地绑定哈希
账户编程密钥,有效载荷类型,公共输入字节和有效载荷哈希.
语句哈希是:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

其他 FastPQ 这个证明路径的数据空间ID是第十六个字节
另一个前置Blake2b消化:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

其他 SCCP FastPQ 批量是:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

然后由相同的排序 FastPQ 命令规则.

其他 OpenVerify 验证人承诺是 SHA-256 在 SCCP 消息后端
名称和法典 FastPQ 验证器描述符:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

料 FastPQ 证据是 Norito- 编码成一个 `StarkFriOpenProofV1`, 然后
包装在一个 `OpenVerifyEnvelope` 有后端 `Stark`. SCCP 验证
修复了相同的 FastPQ 批量从包装和表格,检查
开放的验证包装元数据,并调用 FastPQ 验证器在
复制的批量和证据.

## 参数组 {#parameter-sets}

常规参数目录揭示了两个参数集合.
目前使用的 prover lane `fastpq-lane-balanced`.

| 参数              | 目的                    | 领域                          | 子                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | 均衡的传输量 | 黄金的方形扩展 | 波西顿2承诺,目录 SHA3 标签 | 8,爆炸 8,46个问题   |
| `fastpq-lane-latency`  | 延迟敏感的车道    | 黄金的方形扩展 | 波西顿2承诺,目录 SHA3 标签 | 第十六节,第十六节. |

这两个目标是128位的安全性,并且使用了 `2^16`. 其他
Rust V1 目前,FiaT-Shamir的重播代码
的字节 `iroha_crypto::Hash::new` 而不是直接调用
SHA3-256.

已使用的列表常数 Rust 检测器是:

| 持续             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## 配置 {#configuration}

FastPQ 配置在下面嵌入 `zk.fastpq`.

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

同样的执行和远程测量标签可以被取消 `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

环境变量也支持配置字段.
FastPQ-具体变量包括:

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

## 计量 {#metrics}

在电力测量启用时, FastPQ 出口后端选择指标和
金属运行时间行为:

| 计量                            | 含义                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | 根据后端和设备标签的请求和解决执行模式          |
| `fastpq_poseidon_pipeline_total`  | 索取和解决的波西顿管道路径                               |
| `fastpq_metal_queue_depth`        | 金属队列限制,飞行中最多的数量,发送数量和抽样窗口 |
| `fastpq_metal_queue_ratio`        | 金属队列繁忙和重叠的比例                                         |
| `fastpq_zero_fill_duration_ms`    | 管道零填充时间为金属跑                                      |
| `fastpq_zero_fill_bandwidth_gbps` | 产生的零填充带宽                                                 |

对于一般的性能分类,使用这些与共识和队列
在 [绩效和指标](/zh-hans/guide/advanced/metrics.md).

## 相关参考 {#related-reference}

- [数据模型方案](/zh-hans/reference/data-model-schema.md) 对于产生型号
  详细信息
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ 选择](/zh-hans/reference/irohad-cli.md#arg-fastpq-execution-mode)
