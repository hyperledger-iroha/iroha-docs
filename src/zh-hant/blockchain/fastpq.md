---
translation_locale: zh-hant
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ 是 Iroha 對選定的執行效果的 STARK 證明路徑.它不取代正常的交易執行或共識.通過 ISI,IVM 和 Sumeragi 進行正常運行; FastPQ 消耗了確定性執行證據,並將支持的效果轉化爲證明批次.

目前的主機集成有三個主要途徑:

- 在區塊執行期間記錄的透明數值資產轉移
- Nexus 經過驗證的車道繼電器,其 AXT 證明包裝載有 FastPQ 綁定
- SCCP 透明信息證明輔助器,將 FastPQ 證據包裝在一個開放的驗證封面中

## 轉移證人的路徑 {#transfer-witness-path}

當指令突變平衡時,透明的數值轉移會產生結構化轉移記錄. 轉錄記錄:

- 來源賬戶,目的地賬戶,資產定義和金額
- 轉移前和後的發送者和接收者的餘額
- 作爲批量哈希所使用的交易入口點哈希
- 從提交賬戶中獲取的權威信息
- 一個多爾塔轉錄的Poseidon消化器

批量轉移使用多個海域的轉錄. 在這種情況下,一個海域的波西登消化器是缺失的.

在區塊完成時, Iroha 將這些轉錄按輸入點哈希組分.執行證人然後攜帶原始轉錄捆綁和爲檢測器準備的 FastPQ 過渡批次.

每個轉移三角形變成兩個過渡行:

|排列|關鍵形狀|預估值|後值|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|發送人借款|`asset/<asset-definition>/<source-account>`|之前的發送人平衡|之後的發送人餘額|
|收件人信貸|`asset/<asset-definition>/<destination-account>`|之前的收件人餘額|接收者餘額之後|

數值將正常化爲整數目擊單位.如果不能在選定的十分數尺度中表示爲非負的 `u64`,則對 FastPQ 批量來說,一個值被拒絕

## 公共輸入 {#public-inputs}

每個 FastPQ 過渡批量都包含了將證明綁定到區塊和執行環境的公開輸入:

|輸入|這意味着|
| ------------- | --------------------------------------------------------------- |
|`dsid`|數據空間標識符編碼爲小字節.|
|`slot`|區塊創建時間轉換爲納秒.|
|`old_root`|來自執行證人的父母狀態根源|
|`new_root`|從執行證人中得到的後狀態根源|
|`perm_root`|西頓對活躍角色許可的承諾|
|`tx_set_hash`|按順序的交易和時間觸發入口點 hashs|

主機使用 `fastpq-lane-balanced` 爲這些批量的定律參數.

## 數學模型 {#mathematical-model}

本節描述了當前 Rust 檢測器和驗證器所實施的算法.下面的所有場操作都在金等級字段上:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ 使用Poseidon2而不是 `F`用於場地承諾. 子具有寬度 `t = 3`,速率 `r = 2`和容量 `1`.哈希在最終變換之前吸收了速度-2塊中的場地元素並添加了一個單個場地元素 `1`:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

字節字符串被包裝成7字節的小單元端子,所以每個端子都在 `p`以下:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

域分區的字段哈希表示爲:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

對於從字節域消化開始的哈希, FastPQ 將第八個小字節在該領域內映射:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

在此 `Hash` 意思是 Iroha 的`iroha_crypto::Hash::new`,一個32字節的Blake2bVar消化器,除非公式明確命名Poseidon2或 SHA-256.

### 字段算法 {#field-arithmetic}

Rust 代碼表示`[0,p)`中的範式元素是加值和減值的正規 `u64`值:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

乘法首先計算了128位的產量:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

然後使用"黃金"的身份:

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

實現的條件是添加或減去 `p`直到結果成爲正義.簽署的整數,如平衡德爾塔等,由:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### 西頓2變量 {#poseidon2-permutation}

波西頓2變量狀態是:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

它的S-box是:

$$
S(x)=x^5
$$

FastPQ 採用四個全輪,五十七個部分輪,然後再使用四次全輪.一個全輪與圓定數 `c_r = (c_{r,0}, c_{r,1}, c_{r,2})`是:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

一個部分輪是:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

所有添加和乘法都在 `F`.正規的 MDS 矩陣爲:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

字段哈希從零狀態開始.對於每一個完整的速度-2塊 `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最後的塊在最後一次變換之前添加`1`填充元素.輸出爲 `x_0`.

### 公共輸入的約束力 {#public-input-binding}

主機通過將其 `u64` 值寫入16字節字段的第八個小byte字節來編碼一個數據空間 id:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

區塊創建時間從毫秒轉換爲納米秒:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

交易設置哈希是對序列入口點哈希的字節域哈希:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

在 `h_i`是分類的交易和時間觸發器入口點哈希.在證據公開 IO 中,如果`perm_root`或 `tx_set_hash`全部爲零,則檢測器填寫了倒退值:

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

對於每個轉移三角形,目標十進制尺度是對數量和兩個平衡快照的最大剪切尺度:

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

一個 `Numeric` 價值與 mantissa `m` 和規模 `q` 只有在 `m >= 0` 和 `q <= s`. 它的 FastPQ 證人價值爲:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

正常化結果必須符合 `u64`.

### 規範性命令 {#canonical-ordering}

在跟蹤施工之前,按過渡鍵,操作級別和原始插入指數進行分類:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

訂單承諾是對分類過渡域 `fastpq:v1:ordering` 和 Norito 編碼的Poseidon2字段哈希:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

在哪裏 `P` 是7字節的包裝, `E` 是 Norito 編碼, `D_o` 是 `fastpq:v1:ordering`, 和 `T*` 是分類過渡列表.

### 轉移方程 {#transfer-equations}

對於轉移金額 `a`, 發送者餘額 `f`, 和收件人餘額 `t`, FastPQ 在構建痕跡之前驗證了正常化的證人值:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

然後,過渡行編碼:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

在痕跡內,簽署的海域被減少到 `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

可選的單-德爾塔轉移消化將編碼的轉移預圖提交:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

對於多德爾塔傳輸轉錄,當前格式要求此頂級消化不存在.

接待機關對轉移記錄的消化器是:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### 追蹤行列 {#trace-rows}

讓分類過渡列表包含 `n` 的真行.

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

列 `0..n-1`是活躍的;列 `n..N-1`是填充行.每個實行都有一個操作選擇器設置:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

所有選擇器列都是布爾語:

$$
s(s-1)=0
$$

權限查找行是完全授予角色和撤銷角色的行:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

對於數值運算行:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

施工商還追蹤每資產的運行地帶:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

只有薄荷和燃燒行更新供應計量器:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

數字元數據和數據空間跟蹤列是從行物質化之前獲得的場地哈希:

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

在相鄰的跟蹤行中,元數據哈希,數據空間哈希和插槽是穩定的:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### 轉移Merkle列 {#transfer-merkle-columns}

傳輸行帶有32級稀疏的Merkle路徑.如果缺少主機證明,檢測器從行鍵合成一個確定性路徑,預平衡,以及該行是否是發送者或接收者的側面.

對於合成路徑,口味鹽爲發送行 `fastpq:smt:from`和接收行 `fastpq:smt:to`:

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

合成葉子和內部節點是:

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

追蹤記錄每一個級別的位 `b_l`,兄弟姐妹 `s_l`,輸入節點 `x_l`和輸出節點 `x_{l+1}`.

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### 允許的 Hash {#permission-hashes}

函數授予和撤銷行 哈希權證:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

主機許可表根按角色字節,允許字節和時代字節分類輸入,然後構建一個Poseidon2 Merkle樹:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

不同寬度的水平復制了最後元素.

### 追蹤承諾 {#trace-commitment}

對於每個軌跡列 `c`, FastPQ 首先將列值插入了軌跡域,並對係數向量進行哈希:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

痕跡根是Poseidon2 Merkle根在列承諾:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

最後的跟蹤承諾是對域,參數集,跟蹤形狀,列消化和跟蹤根的字節哈希:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

在 `D_c`爲 `fastpq:v1:trace_commitment`.

### AIR 組成 {#air-composition}

V1 AIR 組合值是一個線性排行本地殘留的組合. 轉錄樣本展示了兩個挑戰:

$$
\alpha_0,\alpha_1 \in F
$$

對於每個相鄰的行對 `(i,i+1)`,檢查器計算:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

剩餘物 `rho`以代碼順序是:

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

對於有數列的行:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

對於穩定批次文本列:

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

驗證者重新計算`A_i`對採樣列開口,並與 AIR 組合 Merkle 根所承諾的組合值進行檢查.

### 搜索產品 {#lookup-product}

權限搜索蓄積器使用菲亞特-沙米爾挑戰 `gamma`. 在低程度的擴展評估中 `s_perm` 和 `perm_hash`, 運行產品是:

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

證據記錄:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 較低程度的擴展 {#low-degree-extension}

讓我們 `omega_T` 成爲追蹤域生成器, `omega_E` 評估域生成器,以及 `g` 對於具有值的跟蹤列, `v_i`, 插射產生係數 `a_j` 這樣:

$$
f(\omega_T^i)=v_i
$$

低度擴展評估了科塞特上的相同多項式:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

執行通過乘以前 FFT 之前的 coset抵消權力的係數來計算此次:

$$
a'_j = a_j g^j
$$

然後對 `a'`進行評估.

其他 CPU FFT 是一個反轉基因-2的Cooley-Tukey變化,在位逆輸入. `L`, 半長度 `H=L/2`, 和階段根:

$$
\omega_L=\omega^{N/L}
$$

每一隻蝶計算:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

逆方 FFT 與 `omega^{-1}`進行相同的轉換,並根據反方域大小進行擴展:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

在使用前驗證目錄根:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

對於從目錄根中獲得的較小域名,生成器是:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### 排列和葉子 {#row-and-leaf-hashes}

在 LDE 之後,FastPQ 將所有 LDE 列中的每一行哈希.對於 `m`列:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

如果排列哈希仍然存在於追蹤域而不是評估域,則檢查器使用相同的 coset LDE 過程插入和擴展該單行哈希列.

### 梅克爾開口 {#merkle-openings}

LDE 值將分爲以下部分:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

每個片葉是:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

梅克爾的父母是:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

奇數級別複製了最後一個節點.查詢路徑通過按每個級別的查詢葉索引等值進行左或右哈希驗證.

在指數 `i` 的葉子中,一個路徑 `(s_0,\ldots,s_{d-1})`通過重複驗證對根 `R`:

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

檢查只有當:

$$
y_d=R
$$

AIR 痕跡排葉是:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR 組合葉是:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

在 LDE 查詢開放時,還檢查在評估指數 `i` 上打開的值是否存在於其驗證部分中:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI 摺疊 {#fri-folding}

FRI 承諾進行 AIR 組合評估.對於每個輪 `l`,轉錄樣本採用一個挑戰 `beta_l`.通過重複最後一項值,層被填充到度的倍數.每個度大小組摺疊爲:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

在 `a` 爲 FRI 值時,驗證器對每一個採樣查詢鏈進行檢查,確認:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

並對每一個打開的 FRI 組進行驗證,並與相應的 FRI 層根進行驗證.

### 菲亞特-沙米爾轉錄 {#fiat-shamir-transcript}

常規參數目錄標記轉錄哈希爲 SHA3-256.當前的檢查器和驗證器實現將挑戰字節從 `iroha_crypto::Hash::new`中導出,這是一個32字節的Blake2bVar消化,然後將第八個小字節縮小到`F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

挑戰呼叫將全文添加到轉錄狀態.

1. 公開 IO,協議版本,參數版本和參數名稱
2. LDE 根和痕跡根
3. `gamma`
4. AIR 構成挑戰 `alpha_0`, `alpha_1`
5. AIR 痕跡根和 AIR 組成根
6. 搜索大產品
7. FRI 層根和`beta_l`挑戰
8. 採樣查詢指數

查詢採樣將繼續繪製32字節的挑戰摘錄,並將其讀取爲小單元 `u64` 分片,直到獲得所需數量的獨特索引:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

取樣組以分類順序返回.

### 驗證器重播 {#verifier-replay}

驗證者首先重新計算批量承諾:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

要求:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

它還重建公衆 IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

每個字段都必須與證據的公開 IO 字節對字節相匹配.然後驗證器重建相同的轉錄並得出相同的:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

對於每次採樣查詢 `q`,檢查:

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

其他 AIR 組合開放必須驗證 `R_air_composition`. 其他 FRI 鏈接從同一個開始 `A_q` 並且必須以認證的最終結尾 FRI 終端下面的葉子 FRI 根源.

## 箴言所檢查的內容 {#what-the-prover-checks}

在構建跟蹤之前, FastPQ 檢測器通過過渡鍵,操作級別和插入序來定製批量順序.傳輸行還需要轉錄元數據.具有轉錄行但沒有轉錄的批量是無效的.

轉移記錄時,檢查人員的檢查包括:

- 發送器的餘額不能下流
- `sender_after` 必須等於 `sender_before - amount`
- `receiver_after` 必須等於 `receiver_before + amount`
- 轉錄必須涵蓋分批中的每一行轉移
- 一個多爾塔波西登消化器,當存在時,必須與轉錄前圖相匹配
- 條件是稀疏的Merkle證明必須被解碼爲版本 1;缺失的路徑由確定性合成證明填充

追蹤包含轉移,硬幣,燃燒,角色授予,角色撤銷,元數據集和權限搜索行的選擇列. 數字操作行還載有簽名的分數,每個資產的分數以及供應計數.

## 經驗者林 {#prover-lane}

`iroha3d`在啓動時啓動 FastPQ 檢查路徑,如果可以初始化檢查後端.該路徑是一個帶有界限的隊列的背景任務.一個區塊生成執行證人後,提交路徑會提交包含區塊哈希,高度,視圖和證人的檢查路程.

如果車道沒有運行或排隊滿,工作將被跳過,正常的區塊處理繼續.這意味着背景檢查車道不是一個交易錄取或共識門.它是一個已經執行的狀態上的證明生產路徑.

車道構建一個具有:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` 讓檢查員選擇可用的後端. `cpu` 執行 pins到 CPU. `gpu` 喜歡的 GPU 執行, CPU 後端無法使用所需的內核.

## 驗證 {#verification}

FastPQ 證據驗證重建了常規批量承諾,並重復了公開轉錄.驗證器檢查了協議版本,參數設置版本,重播限制,追蹤承諾,公開輸入,採樣的Merkle打開口,AIR 打開口和 FRI 查詢鏈.

默認重播限制包括:

|限制|默認方式|
| ------------------ | ------: |
|過渡行|     256 |
|批量有效載荷大小|256 KiB |
|FRI 層|      16 |
|查詢開放時間|     128 |

## Nexus 經過驗證的繼電器 {#nexus-verified-relays}

Nexus AXT 證明包裹可以嵌入一個 `AxtFastpqBinding`.當 `RegisterVerifiedLaneRelay`執行時, Iroha:

1. 驗證車道繼電器包裹和 FastPQ 防材料
2. 檢查數據空間和表格根
3. 清除 AXT 證據包裹
4. 需要一個 `fastpq_binding`
5. 從該綁定中重建 FastPQ 批量
6. 解碼嵌入式證據 FastPQ
7. 調用 FastPQ 驗證器對重建的批量和證明

如果驗證成功, Iroha 將存儲一個包含繼電器參考,原始包裹,證明有效載荷哈希,驗證高度,表格根和 FastPQ 綁定的 `VerifiedLaneRelayRecord`.

車道繼電信封面還載有緊的 FastPQ 證明材料.該材料是對車道ID,數據空間ID,區塊高度,驗證高度進行測試,區塊標題哈希,結算哈希和表格根.如果連接器具有 QC 和有效的 FastPQ 證明材料,則只能合併.

### AXT 綁定數學 {#axt-binding-math}

對於 Nexus AXT 封,在驗證重播之前,`AxtFastpqBinding`被加нони化.空參數默認值爲 `fastpq-lane-balanced`;空驗證器 id 和版本默認值是 `fastpq`和 `v1`;索賠類型被剪切並降級.

AXT FastPQ 公共輸入是確定性字節哈希:

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

AXT 過渡鍵是:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

在 `authorization` 索賠中插入了授予資金的行:

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

在 `compliance` 索賠中,插入兩個元數據行:一個用於政策和另一個用於目標數據區.

對於 `tx_predicate` 和 `value_conservation`,當結合物包含正源或目的量時,使用明確效果數值.否則代碼將獲得有限的確定性數值:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

然後使用相同的轉移方程:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成發送者和接收者賬戶ID由關鍵種子生成:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

轉讓批量哈希是:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT 批量表格消化是 SHA-256 加上法定結合的 Norito 編碼:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明信息證明 {#sccp-transparent-message-proofs}

SCCP 輔助箱還使用 FastPQ 用於透明的跨鏈信息證明.該路徑與`iroha3d`背景檢查器分開.它直接從 SCCP 信息證明捆綁和表格中構建 FastPQ 批量,然後將結果的證據包裝爲開放驗證.

SCCP 批量使用`fastpq-lane-balanced`和三個元數據過渡:

|鑰匙|行動|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement`|`MetaSet`|
|`sccp:transparent:v1:context`|`MetaSet`|
|`sccp:transparent:v1:payload`|`MetaSet`|

它的公開輸入來源於透明的內部證明 SCCP:

|FastPQ 輸入 |SCCP 來源|
| ------------- | ---------------------------------------------------------- |
|`dsid`|布萊克2B的第16個字節通過聲明哈希.|
|`slot`|終點高度|
|`old_root`|有效載荷哈希|
|`new_root`|承諾的根|
|`perm_root`|終點區塊哈希|
|`tx_set_hash`|陳述哈希|

SCCP 法規編碼器寫成數小數,並將變長字節陣列編碼爲:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

透明的公共輸入字節字符串是:

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

透明聲明字節是版本的連環,鏈接家族,本地域和對方域,安全模型, ancor治理,帳戶代碼,最終性模型,驗證器目標,驗證器後端家族,長度先決鏈/後端/顯現字段,目的地綁定哈希,帳戶編程密鑰,有效載荷類型,公開輸入字節和有效載荷哈希.說明哈希是:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

這個證明路徑的 FastPQ 數據空間ID是另一個前置Blake2b字段的第十六個字節:

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

然後按相同的 FastPQ 訂單規則進行排序.

OpenVerify 驗證器的承諾是 SHA-256 對 SCCP 消息後端名稱和正規的 FastPQ 驗證器描述符:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

原料 FastPQ 證據是 Norito- 編碼成一個 `StarkFriOpenProofV1`, 然後包裹在一個 `OpenVerifyEnvelope` 有後端 `Stark`. SCCP 驗證重建相同的 FastPQ 檢查開放的驗證包元數據,並調用了 FastPQ 在重建批量上的驗證器和證明.

## 參數組件 {#parameter-sets}

常規參數目錄揭示了兩個參數集合. 主機供應路由目前使用 `fastpq-lane-balanced`.

|參數|目的|領域|子|FRI|
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced`|均衡的供應器吞吐量|黃金的方形延伸|西頓2承諾,目錄 SHA3 標籤 |8,爆發8,46個問題|
|`fastpq-lane-latency`|對於延遲敏感的車道|黃金的方形延伸|西頓2承諾,目錄 SHA3 標籤 |第十六節,第16節,第34節.|

這兩個目標是128位的安全性,並且使用了 `2^16` 的追蹤域大小.目前 Rust V1 轉錄重播代碼採用`iroha_crypto::Hash::new`而不是直接調用 SHA3-256 來提取Fiat-Shamir挑戰字節.

Rust 測試器使用的確切目錄常數是:

|持續|`fastpq-lane-balanced`|`fastpq-lane-latency`|
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

同樣的執行和遠程測量標籤可以在 `iroha3d` 中取消:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

環境變量也支持配置字段. FastPQ 特定的變量包括:

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

## 計量 {#metrics}

在啓用遠程測量時, FastPQ 將對後端選擇和金屬運行時間行爲進行出口:

|計量|這意味着|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|根據後端和設備標籤的要求和解決執行模式 |
|`fastpq_poseidon_pipeline_total`|索取和解決了Poseidon管道的路徑|
|`fastpq_metal_queue_depth`|金屬隊列限制,飛行中最多的數量,發送數量和樣本抽取窗口|
|`fastpq_metal_queue_ratio`|金屬隊列繁忙和重疊比例 |
|`fastpq_zero_fill_duration_ms`|爲金屬運行提供零填充持續時間 |
|`fastpq_zero_fill_bandwidth_gbps`|產生的零填充帶寬|

在 [ 性能和指標](/zh-hant/guide/advanced/metrics.md)中列出的共識和隊列信號中使用一般的績效分類.

## 相關參考 {#related-reference}

- [生成的類型細節數據模型方案](/zh-hant/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ 的選項](/zh-hant/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
