---
translation_locale: zh-hans
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# FastPQ {#fastpq}

FastPQ 是 Iroha 对选定的执行效果的 STARK 证明路径.它不取代正常的交易执行或共识.通过 ISI,IVM 和 Sumeragi 进行正常运行; FastPQ 消耗了确定性执行证明,并将支持的效果转化为证明批次.

目前的主机集成有三个主要途径:

- 在区块执行期间记录的透明数值资产转移
- Nexus 经过验证的通道继电器,其 AXT 证明包装载有 FastPQ 绑定
- SCCP 透明信息证明辅助器,将 FastPQ 证明包装在一个开放的验证封装中

## 转移证人的路径 {#transfer-witness-path}

当指令突变余额时,透明的数值转移会产生结构化转移记录. 转录记录:

- 来源账户,目的地账户,资产定义和金额
- 转移前和后的发送者和接收者的余额
- 作为批量哈希所使用的交易入口点哈希
- 从提交账户中获取的授权主体信息
- 一个多尔塔转录的Poseidon摘要

批量转移使用多个海域的转录. 在这种情况下,一个海域的波西登摘要是缺失的.

在区块完成时, Iroha 将这些转录按输入点哈希组分.执行证人然后携带原始转录捆绑和为检测器准备的 FastPQ 过渡批次.

每个转移三角形变成两个过渡行:

|排列|关键形状|预估值|后值|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|发送人借款|`asset/<asset-definition>/<source-account>`|之前的发送人余额|之后的发送人余额|
|收件人信贷|`asset/<asset-definition>/<destination-account>`|之前的收件人余额|接收者余额之后|

数值将正常化为整数目击单位.如果不能在选定的十分数尺度中表示为非负的 `u64`,则对 FastPQ 批量来说,一个值被拒绝

## 公共输入 {#public-inputs}

每个 FastPQ 过渡批量都包含了将证明绑定到区块和执行环境的公开输入:

|输入|这意味着|
| ------------- | --------------------------------------------------------------- |
|`dsid`|数据空间标识符编码为小字节.|
|`slot`|区块创建时间转换为纳秒.|
|`old_root`|来自执行证人的父母状态根源|
|`new_root`|从执行证人中得到的后状态根源|
|`perm_root`|西顿对活跃角色许可的承诺|
|`tx_set_hash`|按顺序的交易和时间触发入口点 hashs|

主机使用 `fastpq-lane-balanced` 为这些批量的定律参数.

## 数学模型 {#mathematical-model}

本节描述了当前 Rust 检测器和验证器所实施的算法.下面的所有场操作都在金等级字段上:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ 使用Poseidon2而不是 `F`用于场地承诺. 子具有宽度 `t = 3`,速率 `r = 2`和容量 `1`.哈希在最终变换之前吸收了速度-2块中的场地元素并添加了一个单个场地元素 `1`:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

字节字符串被包装成7字节的小单元端子,所以每个端子都在 `p`以下:

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

对于从字节域摘要开始的哈希, FastPQ 将第八个小字节在该领域内映射:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

在此 `Hash` 意思是 Iroha 的`iroha_crypto::Hash::new`,一个32字节的Blake2bVar摘要,除非公式明确命名Poseidon2或 SHA-256.

### 字段算法 {#field-arithmetic}

Rust 代码表示`[0,p)`中的范式元素是加值和减值的规范 `u64`值:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

乘法首先计算了128位的产量:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

然后使用"黄金"的身份:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

如果:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

然后减速器计算:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

实现的条件是添加或减去 `p`直到结果成为正义.签署的整数,如余额德尔塔等,由:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### 西顿2变量 {#poseidon2-permutation}

波西顿2变量状态是:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

它的S-box是:

$$
S(x)=x^5
$$

FastPQ 采用四个全轮,五十七个部分轮,然后再使用四次全轮.一个全轮与圆定数 `c_r = (c_{r,0}, c_{r,1}, c_{r,2})`是:

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

所有添加和乘法都在 `F`.规范的 MDS 矩阵为:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

字段哈希从零状态开始.对于每一个完整的速度-2块 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最后的块在最后一次变换之前添加`1`填充元素.输出为 `x_0`.

### 公共输入的约束力 {#public-input-binding}

主机通过将其 `u64` 值写入16字节字段的第八个小byte字节来编码一个数据空间 id:

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

交易设置哈希是对序列入口点哈希的字节域哈希:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

在 `h_i`是分类的交易和时间触发器入口点哈希.在证明公开 IO 中,如果`perm_root`或 `tx_set_hash`全部为零,则检测器填写了倒退值:

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

对于每个转移三角形,目标十进制尺度是对数量和两个余额快照的最大剪切尺度:

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

一个 `Numeric` 价值与 mantissa `m` 和规模 `q` 只有在 `m >= 0` 和 `q <= s`. 它的 FastPQ 见证数据价值为:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

正常化结果必须符合 `u64`.

### 规范性命令 {#canonical-ordering}

在轨迹构造之前,按过渡键,操作级别和原始插入索引进行分类:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

订单承诺是对分类过渡域 `fastpq:v1:ordering` 和 Norito 编码的Poseidon2字段哈希:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

在哪里 `P` 是7字节的包装, `E` 是 Norito 编码, `D_o` 是 `fastpq:v1:ordering`, 和 `T*` 是分类过渡列表.

### 转移方程 {#transfer-equations}

对于转移金额 `a`, 发送者余额 `f`, 和收件人余额 `t`, FastPQ 在构建痕迹之前验证了正常化的见证数据值:

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

在痕迹内,签署的海域被减少到 `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

可选的单-德尔塔转移摘要将编码的转移预图提交:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

对于多德尔塔传输转录,当前格式要求此顶级摘要不存在.

接待机关对转移记录的摘要是:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### 追踪行列 {#trace-rows}

令排序后的转换列表包含 `n` 个实际数据行。跟踪长度是下一个 2 的幂次：

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

列 `0..n-1`是活跃的;列 `n..N-1`是填充行.每个实行都有一个操作选择器设置:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

所有选择器列都是布尔语:

$$
s(s-1)=0
$$

权限查找行是完全授予角色和撤销角色的行:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

对于数值运算行:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

构建器还追踪每资产的运行地带:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

只有铸造和销毁行更新供应计量器:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

数字元数据和数据空间跟踪列是从行物质化之前获得的场地哈希:

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

在相邻的跟踪行中,元数据哈希,数据空间哈希和插槽是稳定的:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### 转移Merkle列 {#transfer-merkle-columns}

传输行带有32级稀疏的Merkle路径.如果缺少主机证明,检测器从行键合成一个确定性路径,预余额,以及该行是否是发送者或接收者的侧面.

对于合成路径,口味盐为发送行 `fastpq:smt:from`和接收行 `fastpq:smt:to`:

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

合成叶子和内部节点是:

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

追踪记录每一个级别的位 `b_l`,兄弟姐妹 `s_l`,输入节点 `x_l`和输出节点 `x_{l+1}`.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### 允许的 Hash {#permission-hashes}

函数授予和撤销行 哈希权证:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

主机许可表根按角色字节,允许字节和时代字节分类输入,然后构建一个Poseidon2 Merkle树:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

不同宽度的水平复制了最后元素.

### 追踪承诺 {#trace-commitment}

对于每个轨迹列 `c`, FastPQ 首先将列值插入了轨迹域,并对系数向量进行哈希:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

痕迹根是Poseidon2 Merkle根在列承诺:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

最后的跟踪承诺是对域,参数集,跟踪形状,列摘要和跟踪根的字节哈希:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

在 `D_c`为 `fastpq:v1:trace_commitment`.

### AIR 组成 {#air-composition}

V1 AIR 组合值是一个线性排行本地残留的组合. 转录样本展示了两个挑战:

$$
\alpha_0,\alpha_1 \in F
$$

对于每个相邻的行对 `(i,i+1)`,检查器计算:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

剩余物 `rho`以代码顺序是:

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

对于稳定批次文本列:

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

验证者重新计算`A_i`对采样列开口,并与 AIR 组合 Merkle 根所承诺的组合值进行检查.

### 搜索产品 {#lookup-product}

权限搜索蓄积器使用菲亚特-沙米尔挑战 `gamma`. 在低程度的扩展评估中 `s_perm` 和 `perm_hash`, 运行产品是:

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

证明记录:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 较低程度的扩展 {#low-degree-extension}

令 `omega_T` 为 trace-domain generator、`omega_E` 为 evaluation-domain generator，且 `g` 为已配置的 coset offset。对于值为 `v_i` 的 trace column，插值会产生系数 `a_j`，使得：

$$
f(\omega_T^i)=v_i
$$

低度扩展评估了科塞特上的相同多项式:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

执行通过乘以前 FFT 之前的 coset抵消权力的系数来计算此次:

$$
a'_j = a_j g^j
$$

然后对 `a'`进行评估.

其他 CPU FFT 是一个迭代式基数-2的Cooley-Tukey变化,在位逆输入. `L`, 半长度 `H=L/2`, 和阶段根:

$$
\omega_L=\omega^{N/L}
$$

每一只蝶计算:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

逆方 FFT 与 `omega^{-1}`进行相同的转换,并根据反方域大小进行扩展:

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

对于从目录根中获得的较小域名,生成器是:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### 排列和叶子 {#row-and-leaf-hashes}

在 LDE 之后,FastPQ 将所有 LDE 列中的每一行哈希.对于 `m`列:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

如果排列哈希仍然存在于追踪域而不是评估域,则检查器使用相同的 coset LDE 过程插入和扩展该单行哈希列.

### 梅克尔开口 {#merkle-openings}

LDE 值将分为以下部分:

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

奇数级别复制了最后一个节点.查询路径通过按每个级别的查询叶索引等值进行左或右哈希验证.

在索引 `i` 的叶子中,一个路径 `(s_0,\ldots,s_{d-1})`通过重复验证对根 `R`:

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

检查只有当:

$$
y_d=R
$$

AIR 痕迹排叶是:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR 组合叶是:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

在 LDE 查询开放时,还检查在求值索引 `i` 上打开的值是否存在于其验证部分中:

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

FRI 承诺进行 AIR 组合评估.对于每个轮 `l`,转录样本采用一个挑战 `beta_l`.通过重复最后一项值,层被填充到度的倍数.每个度大小组折叠为:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

在 `a` 为 FRI 值时,验证器对每一个采样查询链进行检查,确认:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

并对每一个打开的 FRI 组进行验证,并与相应的 FRI 层根进行验证.

### 菲亚特-沙米尔转录 {#fiat-shamir-transcript}

规范参数目录标记转录哈希为 SHA3-256.当前的检查器和验证器实现将挑战字节从 `iroha_crypto::Hash::new`中导出,这是一个32字节的Blake2bVar摘要,然后将第八个小字节缩小到`F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

每次 challenge 调用都会把完整 digest 追加到 transcript state。重放顺序如下：

1. 公开 IO,协议版本,参数版本和参数名称
2. LDE 根和痕迹根
3. `gamma`
4. AIR 构成挑战 `alpha_0`, `alpha_1`
5. AIR 痕迹根和 AIR 组成根
6. 搜索大产品
7. FRI 层根和`beta_l`挑战
8. 采样查询索引

查询采样将继续绘制32字节的挑战摘录,并将其读取为小单元 `u64` 分片,直到获得所需数量的独特索引:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

取样组以分类顺序返回.

### 验证器重播 {#verifier-replay}

验证者首先重新计算批量承诺:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

要求:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

它还重建公众 IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

每个字段都必须与证明的公开 IO 字节对字节相匹配.然后验证器重建相同的转录并得出相同的:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

对于每次采样查询 `q`,检查:

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

其他 AIR 组合开放必须验证 `R_air_composition`. 其他 FRI 链接从同一个开始 `A_q` 并且必须以认证的最终结尾 FRI 终端下面的叶子 FRI 根源.

## 箴言所检查的内容 {#what-the-prover-checks}

在构建跟踪之前, FastPQ 检测器通过过渡键,操作级别和插入序来定制批量顺序.传输行还需要转录元数据.具有转录行但没有转录的批量是无效的.

转移记录时,检查人员的检查包括:

- 发送者余额不得发生下溢
- `sender_after` 必须等于 `sender_before - amount`
- `receiver_after` 必须等于 `receiver_before + amount`
- 转录必须涵盖分批中的每一行转移
- 一个多尔塔波西登摘要,当存在时,必须与转录前图相匹配
- 条件是稀疏的Merkle证明必须被解码为版本 1;缺失的路径由确定性合成证明填充

追踪包含转移,铸造,销毁,角色授予,角色撤销,元数据集和权限搜索行的选择列. 数字操作行还载有签名的分数,每个资产的分数以及供应计数.

## 经验者林 {#prover-lane}

`iroha3d`在启动时启动 FastPQ 检查路径,如果可以初始化检查后端.该路径是一个带有界限的队列的背景任务.一个区块生成执行证人之后,提交路径会提交包含区块哈希,高度,视图和证人的检查路程.

如果通道没有运行或排队满,工作将被跳过,正常的区块处理继续.这意味着背景检查通道不是一个交易录取或共识门.它是一个已经执行的状态上的证明生产路径.

通道构建一个具有:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

两个设置均默认为 `cpu`。选择 `gpu` 是显式的 fail-closed 请求：如果未编译 GPU 支持，或所请求的 GPU 后端未通过预检，证明器通道将保持禁用。首个版本没有 `auto` 值，也不会从请求的 GPU 模式回退到 CPU。

## 验证 {#verification}

FastPQ 证明验证重建了规范批量承诺,并重复了公开转录.验证器检查了协议版本,参数设置版本,重播限制,追踪承诺,公开输入,采样的Merkle打开口,AIR 打开口和 FRI 查询链.

默认重播限制包括:

|限制|默认方式|
| ------------------ | ------: |
|过渡行|     256 |
|批量有效载荷大小|256 KiB |
|FRI 层|      16 |
|查询开放时间|     128 |

## Nexus 经过验证的继电器 {#nexus-verified-relays}

Nexus AXT 证明封装可以嵌入一个 `AxtFastpqBinding`.当 `RegisterVerifiedLaneRelay`执行时, Iroha:

1. 验证通道继电器封装和 FastPQ 防材料
2. 检查数据空间和清单根
3. 清除 AXT 证明封装
4. 需要一个 `fastpq_binding`
5. 从该绑定中重建 FastPQ 批量
6. 解码嵌入式证明 FastPQ
7. 调用 FastPQ 验证器对重建的批量和证明

如果验证成功, Iroha 将存储一个包含继电器参考,原始封装,证明有效载荷哈希,验证高度,清单根和 FastPQ 绑定的 `VerifiedLaneRelayRecord`.

Lane relay envelope 还携带紧凑的 FastPQ 证明材料。该材料是根据 lane ID、dataspace ID、区块高度、验证高度、区块头哈希、结算哈希和 manifest root 计算的摘要。只有同时具有 QC 和有效 FastPQ 证明材料的 relay 才允许合并。

### AXT 绑定数学 {#axt-binding-math}

对于 Nexus AXT 封,在验证重播之前,`AxtFastpqBinding`被规范化.空参数默认值为 `fastpq-lane-balanced`;空验证器 id 和版本默认值是 `fastpq`和 `v1`;索赔类型被剪切并降级.

AXT FastPQ 公共输入是确定性字节哈希:

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

AXT 过渡键是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

在 `authorization` 索赔中插入了授予资金的行:

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

在 `compliance` 索赔中,插入两个元数据行:一个用于政策和另一个用于目标数据区.

对于 `tx_predicate` 和 `value_conservation`,当结合物包含正源或目的量时,使用明确效果数值.否则代码将获得有限的确定性数值:

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

合成发送者和接收者账户ID由关键种子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

转让批量哈希是:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT 批量清单摘要是对规范绑定的 Norito 编码计算出的 SHA-256：

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明信息证明 {#sccp-transparent-message-proofs}

SCCP 辅助crate还使用 FastPQ 用于透明的跨链信息证明.该路径与`iroha3d`背景检查器分开.它直接从 SCCP 信息证明捆绑和清单中构建 FastPQ 批量,然后将结果的证明包装为开放验证.

SCCP 批量使用`fastpq-lane-balanced`和三个元数据过渡:

|钥匙|行动|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement`|`MetaSet`|
|`sccp:transparent:v1:context`|`MetaSet`|
|`sccp:transparent:v1:payload`|`MetaSet`|

它的公开输入来源于透明的内部证明 SCCP:

|FastPQ 输入 |SCCP 来源|
| ------------- | ---------------------------------------------------------- |
|`dsid`|语句哈希的 Blake2b 摘要的前 16 个字节|
|`slot`|端点高度|
|`old_root`|有效载荷哈希|
|`new_root`|承诺的根|
|`perm_root`|端点区块哈希|
|`tx_set_hash`|陈述哈希|

SCCP 法规编码器写成数小数,并将变长字节阵列编码为:

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

透明声明字节是版本的连环,链接家族,本地域和对方域,安全模型, ancor治理,帐户代码,最终性模型,验证器目标,验证器后端家族,长度先决链/后端/显现字段,目的地绑定哈希,帐户编程密钥,有效载荷类型,公开输入字节和有效载荷哈希.说明哈希是:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

这个证明路径的 FastPQ 数据空间ID是另一个前置Blake2b字段的第十六个字节:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ 批量是:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

然后按相同的 FastPQ 订单规则进行排序.

OpenVerify 验证器的承诺是 SHA-256 对 SCCP 消息后端名称和规范的 FastPQ 验证器描述符:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

原料 FastPQ 证明是 Norito- 编码成一个 `StarkFriOpenProofV1`, 然后封装在一个 `OpenVerifyEnvelope` 有后端 `Stark`. SCCP 验证重建相同的 FastPQ 检查开放的验证包元数据,并调用了 FastPQ 在重建批量上的验证器和证明.

## 参数组件 {#parameter-sets}

规范参数目录揭示了两个参数集合. 主机供应路由目前使用 `fastpq-lane-balanced`.

|参数|目的|领域|子|FRI|
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced`|平衡的证明器吞吐量|Goldilocks 二次扩展|Poseidon2 commitments、目录 SHA3 标签|arity 8、blowup 8、46 queries|
|`fastpq-lane-latency`|延迟敏感的 lane|Goldilocks 二次扩展|Poseidon2 commitments、目录 SHA3 标签|arity 16、blowup 16、34 queries|

这两个目标是128位的安全性,并且使用了 `2^16` 的追踪域大小.目前 Rust V1 转录重播代码采用`iroha_crypto::Hash::new`而不是直接调用 SHA3-256 来提取Fiat-Shamir挑战字节.

Rust 测试器使用的确切目录常数是:

|持续|`fastpq-lane-balanced`|`fastpq-lane-latency`|
| -------------------- | ---------------------: | --------------------: |
|`target_security`|                    128 |                   128 |
|`grinding_bits`|                     23 |                    21 |
|`trace_log_size`|                     16 |                    16 |
|`trace_root`|`0x002a247f81c6f850`|`0x6a9f4eb38fb9b892`|
|`lde_log_size`|                     19 |                    20 |
|`lde_root`|`0x60263388dbbf9b2a`|`0x9c9c3a571b6f89ac`|
|`permutation_size`|                 65,536 |                65,536 |
|`lookup_log_size`|                     19 |                    20 |
|`omega_coset`|`0x6af325e825ad5c18`|`0x3a5fd4171e3c3a4d`|
|`fri_arity`|                      8 |                    16 |
|`fri_blowup`|                      8 |                    16 |
|`fri_max_reductions`|                      8 |                     6 |
|`fri_queries`|                     46 |                    34 |

## 配置 {#configuration}

FastPQ 配置嵌入`zk.fastpq`下方.

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

同样的执行和远程测量标签可以在 `iroha3d` 中取消:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

环境变量也支持配置字段. FastPQ 特定的变量包括:

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

在启用远程测量时, FastPQ 将对后端选择和金属运行时行为进行出口:

|计量|这意味着|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|根据后端和设备标签的要求和解决执行模式 |
|`fastpq_poseidon_pipeline_total`|索取和解决了Poseidon管道的路径|
|`fastpq_metal_queue_depth`|Metal 队列限制、最大并发数、调度数量和采样窗口|
|`fastpq_metal_queue_ratio`|金属队列繁忙和重叠比例 |
|`fastpq_zero_fill_duration_ms`|为金属运行提供零填充持续时间 |
|`fastpq_zero_fill_bandwidth_gbps`|产生的零填充带宽|

在 [ 性能和指标](/zh-hans/guide/advanced/metrics.md)中列出的共识和队列信号中使用一般的绩效分类.

## 相关参考 {#related-reference}

- [节点授权类型快照数据模型方案](/zh-hans/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ 的选项](/zh-hans/reference/iroha3d-cli.md#fastpq-overrides)
