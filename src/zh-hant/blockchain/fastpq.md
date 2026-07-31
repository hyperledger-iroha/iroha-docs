---
translation_locale: zh-hant
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ 是的 Iroha 沒有任何問題 STARK 這樣的效果,
沒有取代正常的交易執行或共識.
走過 ISI, IVM, 及其他 Sumeragi 像往常一樣; FastPQ 消耗的
決定性執行證據,並將支持的效果轉化為證明
這樣的產品,

目前的主機集成有三大途徑:

- 在區塊執行過程中記錄的透明數字資產轉移
- Nexus 已驗證的行徑連接, AXT 證明包裝上有 FastPQ
  必須的
- SCCP 透明的訊息證明輔助器 FastPQ 證明在一個
  公開驗證封筒

## 轉移證人的路徑 {#transfer-witness-path}

透過透明數字轉移,
這項指令改變了平衡.

- 來源帳戶,目的地帳戶,資產定義和額度
- 在轉移前和後的發送者與接收者的余分
- 交易入口點哈希使用為批量哈希
- 來自提交帳戶的權威資料
- 針對單次德爾塔轉錄的波西頓消化器

這種情況下,
沒有一本多爾塔波西頓消化器.

在完成區塊時, Iroha 按入口點的哈希組成這些抄錄.
執行證人將原始的抄錄包裹和
這項政策 FastPQ 為檢測器準備的過渡批量.

每個轉移德爾塔都變成兩行過渡:

| 排列             | 關鍵的形狀                                        | 預值               | 后值             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| 發送者借款    | `asset/<asset-definition>/<source-account>`      | 之前的發送者平衡   | 發送者平衡後   |
| 收件人信用 | `asset/<asset-definition>/<destination-account>` | 之前的收件人平衡 | 接收者餘額後 |

數值將正常化成整數目證據單位.
拒絕使用 FastPQ 如果不能被表達為非負的批量
`u64` 在所選的數分尺度上.

## 公眾輸入 {#public-inputs}

每個國家 FastPQ 轉型批量包含公共輸入,
區塊和執行背景:

| 輸入方式         | 含義                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | 數據區域識別子加碼為小單位字體             |
| `slot`        | 轉換為納秒的區塊生成時間                    |
| `old_root`    | 來自執行證人的親子國家根            |
| `new_root`    | 來自執行證人的後國家根              |
| `perm_root`   | 西頓對積極角色許可的承諾                |
| `tx_set_hash` | 排序交易及時間引擎入口點的哈希 |

主機使用 `fastpq-lane-balanced` 根據法規參數為
這些批量.

## 數學模型 {#mathematical-model}

這部分描述了目前實現的數學 Rust
檢查者和驗證人.
主角欄位:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ 使用Poseidon2 `F` 子有寬度,
`t = 3`, 年 月 日 `r = 2`, 及容量 `1`. 哈希吸收在
數量-2區塊,並添加一個字段元素 `1` 在決賽之前
變量:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

字节串被包裝成7字節的小子肢體,
嚴格下面 `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

區域分別的欄位hashes表示為:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

該數字的數值為: FastPQ 圖表顯示第八個國家
在這個字段中,

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

這裡是 `Hash` 的意思 Iroha 沒有任何問題 `iroha_crypto::Hash::new`, 沒有任何其他方法
除非配方明顯命名Poseidon2或 SHA-256.

### 實地數學 {#field-arithmetic}

其他國家 Rust 代碼表示欄位元素是法典的 `u64` 在
`[0,p)`. 增加和減分是:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

乘法首先計算了128位的產品:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

這樣就算是"黃金"的減少,

$$
2^{64}\equiv2^{32}-1\pmod p
$$

如果:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

然後減速器計算:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

實現條件加或減 `p` 直到結果是
簽名整數,如平衡德爾塔,由:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### 波西頓2變化 {#poseidon2-permutation}

波西頓2的變化狀態是:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

這裡的 S-box是:

$$
S(x)=x^5
$$

FastPQ 使用了四次全程, 57次部分,
整個圈子,一個圓形常數.
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

部分回合是:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

所有的加算和乘法都在 `F`. 經典 MDS 矩阵是:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

數值-2 的每個完整區塊,
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最后一塊附加了 `1` 在最後一次之前,
這樣的數據是: `x_0`.

### 公眾輸入必須 {#public-input-binding}

接待者透過寫其資料區域ID編碼 `u64` 在第一個價值
16 字段的 8 個小安字節:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

區塊的創建時間從毫秒轉換為納秒:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

交易集合哈希是排序入口點上的字节域哈希
哈希:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

在哪裡 `h_i` 該數字是按次序排列的交易和時間引擎入口點.
公眾的證據 IO, 如果 `perm_root` 或是 `tx_set_hash` 這樣的數字是零,
檢測器填寫後退值:

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

### 數字正常化 {#numeric-normalization}

每個轉移三角形,目標十數尺度是最大的切割
數量及平衡的快照:

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

其他國家 `Numeric` 含子的價值 `m` 及規模 `q` 只有在
`m >= 0` 及其他 `q <= s`. 這種情況 FastPQ 證人的價值為:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

標準化結果必須符合 `u64`.

### 傳統法規 {#canonical-ordering}

在跟踪施工之前, 批量按过渡鍵排序,操作
排名和原始插入指數:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

這項訂單的承諾是 Poseidon2 域上的哈希
`fastpq:v1:ordering` 這種情況 Norito 編碼排序過渡:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

在哪裡 `P` 是 7 字段的包裝, `E` 是的 Norito 編碼, `D_o` 是的
`fastpq:v1:ordering`, 及其他 `T*` 這是排序過渡列表.

### 轉移方程 {#transfer-equations}

對於轉移金額 `a`, 發送者平衡 `f`, 和收件人平衡 `t`,
FastPQ 在建立痕跡之前, 核實正常證人值:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

接下來,轉行將加碼為:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

印記的德爾塔被降低到 `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

選擇性單-德爾塔傳輸消化承諾加碼的傳輸
預覽:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

關於多德爾塔傳輸抄錄,目前的格式要求:
沒有高級的消化器.

接待者權威對轉移抄錄的消化是:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### 追蹤行列 {#trace-rows}

讓排序的過渡列表包含 `n` 實在的行列.
接下來的兩項功率:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

排列 `0..n-1` 活跃;行列 `n..N-1` 每個真正的行都有
一套操作選擇器:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

所有選項列都是布爾式的:

$$
s(s-1)=0
$$

許可查詢行列是提供角色和取消角色的行列:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

在數字操作行中:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

這項計畫的目標是:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

只有薄荷和燃燒行更新供應計:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

數據區域跟踪列是從行前取出的欄位哈希
實現性:

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

數據空間和插槽均穩定,
追蹤行:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### 轉移 Merkle 的列 {#transfer-merkle-columns}

傳輸行列具有32級稀疏的Merkle路徑.
檢測器會從行鍵合成一個決定性路徑,
預計平衡,並知道排列是否是發送者或接收者側.

合成路徑的味道是 `fastpq:smt:from` 對於發送行
及其他 `fastpq:smt:to` 接收器行:

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

合成葉子和內部結節是:

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

追蹤記錄了部分 `b_l`, 兄弟姐妹 `s_l`, 输入节点 `x_l`, 及其他
輸出結 `x_{l+1}` 在每個層面上.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### 授權 Hash {#permission-hashes}

授權和撤回角色行:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

接待者許可表根按角色字节排序入口,權限
這樣就算是子,也就是子.

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

數量較小的數值將最終元素複製.

### 追蹤承諾 {#trace-commitment}

每個痕跡欄位 `c`, FastPQ 首先將列值插入
追蹤域和系數向量的哈希:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

標籤根為Poseidon2 Merkle根,

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

這項指令是:
痕跡形狀,柱子消化和痕跡根:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

在哪裡 `D_c` 是的 `fastpq:v1:trace_commitment`.

### AIR 組成 {#air-composition}

其他國家 V1 AIR 組成值是線性排行本地残留的組合.
這兩項挑戰:

$$
\alpha_0,\alpha_1 \in F
$$

對於每個相鄰的行對 `(i,i+1)`, 檢查員計算:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

剩余物 `rho` 在編碼順序下:

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

數字列的行:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

及穩定批量背景列:

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

檢查者重新計算 `A_i` 採樣的行,並檢查它
該項目的規定是: AIR 組成 Merkle
根源.

### 搜尋產品 {#lookup-product}

該網站使用FiaT-Shamir挑戰. `gamma`.
在低級擴展評估中, `s_perm` 及其他 `perm_hash`, 這項政策
運行產品是:

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

證明證件:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 低級延伸 {#low-degree-extension}

讓我們 `omega_T` 成為追蹤域的發電機, `omega_E` 這項政策
評估領域生成器, `g` 設定的 coset 抵消.
有值的痕跡列 `v_i`, 插射產生系數 `a_j`
這樣的:

$$
f(\omega_T^i)=v_i
$$

低度延伸在 coset 上評估相同的多項式:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

實施的方法是乘以
之前的代價 FFT:

$$
a'_j = a_j g^j
$$

然後評估 `a'` 在評估領域.

其他國家 CPU FFT 是一個反復的基徑-2 Cooley-Tukey 轉變
在階段長度上, `L`, 半長度 `H=L/2`, 及舞台
根:

$$
\omega_L=\omega^{N/L}
$$

每個蝶都會計算:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

這樣的情況 FFT 運行相同的變化 `omega^{-1}` 並按的尺度,
逆域大小:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

在使用之前,該目錄根核實:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

該產品的生成器為:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### 排列和葉子 {#row-and-leaf-hashes}

在此後, LDE, FastPQ 在每一行上, LDE 列表 `m` 列表:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

如果排列哈希仍在追蹤域上,而不是評估
在這個域中, prover 插入並延伸那個單行hash列
具有相同的可塞特 LDE 這項程序.

### 梅克爾的開口 {#merkle-openings}

LDE 數值被組成以下部分:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

每一片葉都是:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

梅克爾的父母是:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

奇數層次複製了最後一個結.
在每個層面的查詢單位指數平衡度上.

在指數上, `i`, 一條路 `(s_0,\ldots,s_{d-1})` 檢查對象
根 `R` 在重複情況下:

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

只有在:

$$
y_d=R
$$

AIR 痕跡排行葉是:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR 組成葉是:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

其他國家 LDE 查詢開啟也檢查在評估指數上打開的值
`i` 在其認證部分中存在:

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

FRI 致力於 AIR 每次的組成評估. `l`, 這項政策
檢測試驗是一項挑戰 `beta_l`. 這層面被到多重
每個 arity 尺寸的小組折起來為:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

在哪裡 `a` 這是 FRI 檢查器對每個採取樣本的訊息進行檢查
這種連鎖:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

並認證每個開啟的 FRI 該集團對應 FRI 層次
根源.

### 菲亞特-沙米爾抄本 {#fiat-shamir-transcript}

這項標籤是: SHA3-256.
目前的檢查器和驗證器實施中,
`iroha_crypto::Hash::new`, 這是一份32字段的Blake2bVar消化,
減少第八個小位字節到 `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

挑戰呼叫將全文添加到截圖狀態.
這樣的順序是:

1. 公眾 IO, 协议版本,參數版本和參數名稱
2. LDE 根和痕跡根
3. `gamma`
4. AIR 組成問題 `alpha_0`, `alpha_1`
5. AIR 痕跡根和 AIR 組成根
6. 搜尋大產品
7. FRI 層根和 `beta_l` 面臨的挑戰
8. 取樣查詢指數

查詢取樣會繼續繪製32字節的挑戰摘要,
小子 `u64` 片,直到它得到要求的獨特數量
指數:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

採取樣本的組件以排序順序返回.

### 檢查器重播 {#verifier-replay}

驗證人首先重新計算批量承諾:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

並要求:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

這也使公眾重建. IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

每個欄位都必須符合證據的公眾數目 IO 檢查器的數量為byte
然後重建相同的抄本,

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

每次採樣查詢 `q`, 檢查:

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

及:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

其他國家 AIR 必須在 `R_air_composition`.
其他國家 FRI 鎖由同一條開始. `A_q` 必須以
證實的最終 FRI 底部下的葉子 FRI 根源.

## 箴言所檢查的內容 {#what-the-prover-checks}

之前, 在建立痕跡之前, FastPQ 檢查器將批量順序進行加нони化
按過渡鍵,操作排名和插入序列.
需要抄錄的元數據. 有傳輸行,但沒有傳輸
這項文件是無效的.

轉移抄錄的檢查包括:

- 發送者平衡不能下流
- `sender_after` 必須等於 `sender_before - amount`
- `receiver_after` 必須等於 `receiver_before + amount`
- 截圖必須覆蓋每個分批中的轉移行
- 如果存在, 單德拉波西頓消化器必須符合轉錄
  預覽
- 提供稀少的Merkle證據,必須解碼為版本 1;
  填滿了定性合成證據

該標籤包含轉移,幣,燃燒,角色授予的選項列表.
取消角色,元數據集和許可搜索行.
列上也有簽名的delta,每股運行的delta和供應
這裡有數據.

## 關於我們 {#prover-lane}

`irohad` 開始了 FastPQ 如果檢查器後端可以啟動
線路是一個背景任務,
該區域提供執行證人,
包含區塊哈希,高度,視野和證人.

如果車道不行或排隊滿足,
這意味著背景檢測路線是
這不是交易入口或共識通道.
已被執行的國家之路.

這條車道是用:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` 讓檢查員選擇可用的後端. `cpu` 針對的執行
在 CPU. `gpu` 喜歡 GPU 執行, CPU 在哪裡?
后端無法使用所需的核心.

## 檢查 {#verification}

FastPQ 證據驗證重建了法典批量承諾,
核查者檢查协议版本,
參數設定版本,重播限制,追蹤承諾,公共輸入,
採取樣本的 Merkle 開口, AIR 打開機,以及 FRI 詢問連鎖.

預設重播限制包括:

| 限制              | 預設方式 |
| ------------------ | ------: |
| 變遷行    |     256 |
| 批量使用負荷的尺寸 | 256 KiB |
| FRI 層次         |      16 |
| 詢問時間     |     128 |

## Nexus 已驗證的連接 {#nexus-verified-relays}

Nexus AXT 證據封筒可以嵌入 `AxtFastpqBinding`. 什麼時候
`RegisterVerifiedLaneRelay` 執行, Iroha:

1. 檢查車道連接包裹, FastPQ 證明材料
2. 檢查資料空間和顯示根
3. 解釋了 AXT 證明包裹
4. 需要一個 `fastpq_binding`
5. 修建了 FastPQ 來自這個結合的批量
6. 解密嵌入式 FastPQ 證明
7. 呼叫他們 FastPQ 在重建批量上的驗證碼和證明

如果核查成功, Iroha 存儲一個 `VerifiedLaneRelayRecord`
包含連接參考,原始包裹,證明有效載荷哈希,
檢測高度,顯示根; FastPQ 必須遵守.

路線連接封筒也具有紧的功能 FastPQ 證明材料.
是對行徑ID,數據空間ID,區塊高度,驗證的消化
顯示根,區塊標題哈希,決算哈希和顯示根.
只有當它有兩者之間的合并才可接受 QC 且有效 FastPQ 證明
其他材料.

### AXT 必須的數學 {#axt-binding-math}

於 Nexus AXT 封筒, `AxtFastpqBinding` 在證明之前被加нони化
數據顯示為: `fastpq-lane-balanced`; 沒有使用
檢查器 id 和版本預設 `fastpq` 及其他 `v1`; 要求的類型是剪切的
並將他們降低.

其他國家 AXT FastPQ 公眾輸入是決定性字节哈希:

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

AXT 轉換鍵是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

其他國家 `authorization` 要求插入授予角色的行:

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

授權政策的聯繫. `compliance` 索赔
插入兩行元數據:一個為政策,另一個為目標資料區.

於 `tx_predicate` 及其他 `value_conservation`, 有明顯的效果量是
使用在結合中含有陽性來源或目的額時.
否則該代碼會導致一個有限的決定性數值:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

然後使用相同的轉移方程式:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成發送者和接收者的帳戶ID由關鍵種子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

轉換批量哈希為:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

其他國家 AXT 批量表格消化是 SHA-256 在 Norito 編碼的
經典的結束:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明的訊息證據 {#sccp-transparent-message-proofs}

其他國家 SCCP 助手盒也使用 FastPQ 透明的連鎖交叉訊息
這條路由與 `irohad` 這裡有許多人,
建立一個 FastPQ 直接從一批 SCCP 提供訊息證明包,
顯示,然後將結果的證據包裹成公開驗證.

其他國家 SCCP 批量使用 `fastpq-lane-balanced` 以及三次傳輸數據:

| 關鍵                             | 活動 |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

它的公共投入源自 SCCP 透明的內部證據:

| FastPQ 输入  | SCCP 來源                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | 首先,Blake2b的第16字节在语句hash上消化 |
| `slot`        | 終結高度                                            |
| `old_root`    | 使用負荷哈希                                               |
| `new_root`    | 承諾的根源                                            |
| `perm_root`   | 終點區塊哈希                                        |
| `tx_set_hash` | 聲明哈希                                             |

其他國家 SCCP 常識編碼器寫整數小數字,並編碼
變長字節列如下:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

透明的公共輸入字節串是:

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

透明的說明字節是版本,連鎖的連鎖
家庭,地方和對方領域,安全模式,基治理
帳戶代碼,終結性模型,驗證人目標,驗證者後端家族,
長度預定的連鎖/後端/顯示字段,目的地绑定哈希,
該系統的使用方式是:
表示哈希是:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

其他國家 FastPQ 這個證據路徑的數據空間ID是第十六字節
另一個預設Blake2b消化:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

其他國家 SCCP FastPQ 批量是正確的:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

然後按相同的排序排列 FastPQ 這就是命令規則.

其他國家 OpenVerify 驗證人承諾是 SHA-256 在 SCCP 訊息後端
姓名和法典 FastPQ 檢測器描述符:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

這種原料 FastPQ 證據是 Norito- 編碼成一個 `StarkFriOpenProofV1`, 接著,
包裝在一個 `OpenVerifyEnvelope` 有後端 `Stark`. SCCP 核查
還是重建相同的 FastPQ 檢查包裝和表格,
檢查封筒開啟, FastPQ 核查器在
還是重新建成的批量和證據.

## 參數組件 {#parameter-sets}

這裡有兩組參數.
prover lane 目前使用 `fastpq-lane-balanced`.

| 參數              | 目的                    | 區域                          | 子                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | 有平衡的檢測器通量 | 黃金的方形延伸 | 西頓2的承諾,目錄 SHA3 標籤 | 數量 8,爆炸 8, 46 個問題   |
| `fastpq-lane-latency`  | 延遲敏感的行徑    | 黃金的方形延伸 | 西頓2的承諾,目錄 SHA3 標籤 | 數量 16 分,爆炸 16, 34 分 |

這兩者都針對128位的安全性, `2^16`. 其他國家
Rust V1 現在FiaT-Shamir的重播代碼
字符串 `iroha_crypto::Hash::new` 而不是直接呼籲
SHA3-256.

已使用的列表常數 Rust 檢查者是:

| 沒有變化             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## 配置方式 {#configuration}

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

執行和遠隔測量標籤可以被取消 `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

設定欄位也支持環境變量.
FastPQ- 具体的變量包括:

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

## 數據 {#metrics}

當電視測量啟用時, FastPQ 輸出數據為後端選項,
鋼鐵運行時間行為:

| 數量表                            | 含義                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | 按后端和裝置標籤要求和解決執行模式          |
| `fastpq_poseidon_pipeline_total`  | 要求和解決的波西頓管道路徑                               |
| `fastpq_metal_queue_depth`        | 金屬排隊限制,飛行中最多的數量,發送數量和抽樣窗口 |
| `fastpq_metal_queue_ratio`        | 金屬排隊的繁忙和重複比例                                         |
| `fastpq_zero_fill_duration_ms`    | 管道零填充時間                                      |
| `fastpq_zero_fill_bandwidth_gbps` | 導致零填充頻寬                                                 |

在一般的性能分別中, 使用這些與共識和排隊
在列出的訊號 [性能與指標](/zh-hant/guide/advanced/metrics.md).

## 有關參考資料 {#related-reference}

- [數據模型方案](/zh-hant/reference/data-model-schema.md) 產生的類型
  細節
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ 選擇](/zh-hant/reference/irohad-cli.md#arg-fastpq-execution-mode)
