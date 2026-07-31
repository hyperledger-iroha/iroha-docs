---
translation_locale: zh-hant
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE 在"隨機接入機器狀函數評估"中,
Iroha, 這項政策是公共政策的隱藏函數層.
是連鎖上,但該評估器的逻辑,秘密或原始輸入不應該是
該書寫給世界國家. SORA Nexus 識別流程,例如:
也可以被曝為一般藥物. Torii
在一個節點圖像啟動應用程式面向的路徑時,

鎖存儲政策承諾和收件驗證的元數據.
解決器或 Torii 運行時間評估隱藏的程式,
支持工具,或
這項指令可以與注冊政策進行驗證.

## 命名 {#naming}

這項名稱分為:

| 年 月 日 | 含義 |
| --- | --- |
| `ram_lfe` | 外部隱藏函數抽象:程式政策,承諾,執行收件和收件驗證模式. |
| `BFV` | 使用加密輸入的Brakerski/Fan-Vercauteren同形加密方案 RAM-LFE 這樣的情況, |
| `ram_fhe_profile` | BFV- 針對編碼加密執行機的特定元數據. RAM-LFE. |

在數據模型中, `RamLfeProgramPolicy` 及其他 `RamLfeExecutionReceipt` 是
RAM-LFE 這樣的人. BFV 密碼文本封面,以及隱藏的
RAM-FHE 該程序配置文件屬於一個使用的加密執行後端
沒有任何問題.

## 記錄的內容 {#what-it-records}

其他國家 RAM-LFE 該計畫的政策在全球范围内已被註冊 `program_id`. 該政策
含有:

- 該帳戶可以激活,禁用或以其他方式突變
  政策
- 廣告給客戶的後端
- 收件驗證方式, `signed` 或是 `proof`
- 致力於隱藏的程序元數據和評估器秘密
- 已簽署的收件的公開關鍵
- 選擇性公開加密輸入元數據,如 BFV 參數和
  `ram_fhe_profile`
- 其他國家 `active` 檢查該政策是否能發行新收據

隱藏的秘密,直文識別值和隱藏的程式體系是
客戶應處理承諾,不透明的哈希,
接收哈希,密碼文本和程序消化為不透明的协议值.

## 背景報導 {#backends}

目前 RAM-LFE 支持以三個後端識別子為中心:

| 后端 | 使用 |
| --- | --- |
| `hkdf-sha3-512-prf-v1` | 必須承諾 PRF 評估. |
| `bfv-affine-sha3-256-v1` | BFV 支持於加密識別區域的機密表格評估. |
| `bfv-programmed-sha3-256-v1` | BFV 在加密帳簿和記憶路線上進行支持的編程執行. |

該項目的目標是: BFV 背端是重要的現代
導航路徑. 它讓錢包在本地加密正常輸入,
在交易中沒有看到公眾識別符的情況下,
收件將輸出哈希結合於註冊程式政策.

## 數學 {#math}

這部分描述了目前使用的實現級代數
RAM-LFE 這不是安全證據,
並加密評估模式,
我們同意.

### 標記 {#notation}

請選擇:

- 沒有任何問題. Iroha `Hash::new(m)`: 布萊克2B-32已結束 `m`, 最少的情況
  顯著部分的最終字節被迫 `1`.
- 沒有任何可能的改變. Norito 編碼的 `x`.
- \(a \parallel b\) 平均字节串連.
- 操作員名稱{le64} (i) \) 是 8 字節的小安代碼
  沒有簽名的整數.
- \(s\) 成為世界外國的解決機密.
- \(P\) 是公共政策參數.
- \(A\) 要求相關資料.
- \(x\) 必須是正常化輸入字節或 Norito-加密加密输入
  取決於後端.

RAM-LFE 使用域名分別的哈希. 下方的公式以
目的;其目前的字节字符串是:

| 標誌 | 域名字符串 |
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

### 政策承諾 {#policy-commitment}

政策承诺將公眾參數和隱藏的解決機密
首先,這個秘密是個別的任務:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

這項政策的完整抄錄是加碼的:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

且已公布的政策哈希是:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

在連鎖上 `PolicyCommitment` 是:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

該數據的數值是從運行時間秘密中重新計算出來的.
該項目的評估失败,

### HKDF-SHA3-512 后端 {#hkdf-sha3-512-backend}

於 `hkdf-sha3-512-prf-v1`, 輸出是正常化輸入本身,
不透明的識別碼和收件哈希是隱密的 PRF 這樣的產品,

要求的抄錄是:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

其他國家 HKDF 和偽隨機鍵是:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

形材料被擴展和加密:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

收件材料還將不透明的ID綁起來:

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

### BFV 排行榜 {#bfv-primer}

BFV 是基于格的同形加密方案.
程序可以加上和乘以加密值,
得到相同的結果,就像它完成了添加和乘法
在簡體文本值上.

於 RAM-LFE, BFV 使用為加密輸入機制:

1. 錢包將一個私人價值正常化, 例如電話號碼或電子郵件
   這裡的地址.
2. 錢包將字節轉化為小整數插槽.
3. 每個插槽都是用解決器的加密 BFV 公共關鍵.
4. 解決器的執行時間會透過這些加密文字來評估隱藏的程式.
5. 執行時間只會解密隱藏的程式輸出和標誌或證明
   收到的票.

BFV 這是正確的整數算法,而不是近似的算法.
較適合識別字節和小型模組計算,
該模型的推斷. Iroha 沒有任何問題 BFV 使用,每個都加密
插槽包含一個尺度值的模塊 \(t\), 通常是字节或字节长度
密碼文字本身是一個更大的整數的模組 \(q\). 其他國家
之間的差距 \(q\) 及其他 \(t\) 提供解密空間,
且引入 homomorphic操作.

其他國家 BFV 密碼文本有兩種多項式組件:

$$
c=(c_0,c_1)
$$

密钥是另一個多項式. \(s_k\). 解密將這些數字結合在一起
組成部分:

$$
v = c_0 + c_1s_k
$$

如果密碼文字是正确的形成,
\(v\) 圓形將清晰文本復原,
數量模組 \(t\). 這項功能很有用.
保持這個結構:

| 簡單的操作 | 密碼文本操作 |
| --- | --- |
| \(m+n\) | 添加密碼文本組件. |
| \(m+\alpha\) | 加入一個按尺度的直文常數 \(c_0\). |
| \(\alpha m\) | 這兩種加密文本組件的尺度是 \(\alpha\). |
| \(mn\) | 複乘密碼文字多項式, 再加上尺寸, |

乘法是一項昂貴的操作.
密碼文字自然會創造一個三組件的密碼文字,
\(1\), \(s_k\), 及其他 \(s_k^2\). 使用已發表的評估關鍵
折叠的 \(s_k^2\) 這種數字是一個很簡單的方法.
使用相同的密碼文本形狀,

BFV 也是"加密":每個加密操作都需要一些噪音預算.
這項實施並不啟動加密文本,
沒有任何問題. RAM-LFE 發布了一份小的 `ram_fhe_profile` 他只接受一個有限的人,
這使得評估保持在參數組的內
支持深度.目前的編程配置文件允许固定登記
數量,固定的記憶軌跡數量,最多是一個加密文字-加密文字
按程序步骤乘以.

在這裏, RAM-LFE 設計, BFV 隱藏客戶輸入的公共帳號資料,
只有看到交易或路線的有效載荷.
該連鎖自動執行任意的加密程式. Torii 解決器
運行時間仍然擁有 BFV 檢查了隱藏的資料,
這樣的數據會顯示,
檢查證據對連鎖政策承諾的證明,
解決公钥或證明元數據.

該識別子使用案例故意選擇簡單的表現.
標準化字符串以以下方式加碼:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

每個元素都被加密為自己的 BFV 這樣的形狀使得
標準化和封筒驗證明顯, 讓錢包建立加密
解決方案可以加нони化等效
已加密入口到穩定的收件抄錄中.

### BFV 環形模型 {#bfv-ring-model}

其他國家 BFV 背端使用否定式多項式環:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

並簡體文字環:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

在哪裡:

- \(n\) 是的 `polynomial_degree`, 兩次的功率
- \(q\) 是的 `ciphertext_modulus`
- \(t\) 是的 `plaintext_modulus`
- \(q > t\) 及其他 \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

單文字系數向量是透過縮小每個系數來編碼的:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

解密中心升降每個因數:

$$
v = c_0 + c_1 s_k \in R_q
$$

然後將它回放到 \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

這裡是 \(s_k\) 這是 BFV 密钥多項式,而不是外部的 RAM-LFE 解決器
秘密 \(s\).

### BFV 關鍵世代 {#bfv-key-generation}

關於加密識別子輸入, BFV 基本材料是每個
解決機的秘密與相關資料:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

其他國家 BFV RNG 種植如下:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

關鍵發電機樣本:

- \(s_k \in \{-1,0,1\}^n\), 代表的模組 \(q\)
- \(a \leftarrow R_q\) 均的情況
- \(e \in \{-1,0,1\}^n\)

公共關鍵是:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

在線化情況下, \(s_k^2\) 成為環子產品 \(R_q\). 每個國家
基本的\(B\) 數字 \(j\), 標本 \(a_j\) 均的情況和 \(e_j\) 來自小孩
發行,然後公布:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公眾 BFV 政策元數據包含公共鍵,
`max_input_bytes`. 其他國家 BFV 密钥和重新排列的關鍵留在
解決器運行時間.

### BFV 加密與運作 {#bfv-encryption-and-operations}

如何加密單字多項式 \(m\), 實施的種子是其他
ChaCha20 RNG 來自:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

這樣的樣品 \(u,e_1,e_2 \in \{-1,0,1\}^n\) 並計算:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

密碼文本是 \(c=(c_沒有任何問題_1)\).

單位的數值是相似的.

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

增加平文尺度 \(\alpha\) 只有零變化系數
\(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

乘以平文尺度 \(\alpha\) 這兩部件的尺度:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

兩種密碼文本_沒有任何問題_1) \) 和 \(d=_沒有任何問題_1) \),加密文本
乘法首先計算出一個三大字體文字,
數量回升 \(t/q\):

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

所有上述產品都是無循環環的產品 \(R_q\). 接著,
\(\tilde c_2\) 已分解成基層,\(B\) 多項式:

$$
\tilde c_2 = \sum_j B^j u_j
$$

並重新排列:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

這次的結果又是兩種因素. BFV 密碼文本.

### 密碼文本封面 {#identifier-ciphertext-envelope}

輸入字符串的識別子:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

已加碼成尺度插槽:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

剩下的所有插槽都是零到 `max_input_bytes + 1`. 每個尺度
插槽是以零系數直文多項式加密的 \([m_i]\).
每個插槽加密的種子是:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

密碼化識別子封面是:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

在哪裡 \(M=\mathrm{max\_input\_bytes}\).

### BFV 這樣的後果 {#bfv-affine-backend}

於 `bfv-affine-sha3-256-v1`, 運行時間首先導致 BFV 來自主要材料
\(s\) 及其他 \(A\). 這項公眾參數必須完全符合公眾的標準.
在連鎖上承諾的參數.

這種子是:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

這種種種子的運行時間標本, \(t\), 32 行的相連電路:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

在哪裡 \(m_i\) 這種數據是解密的識別子.
在密碼文本上相同的值:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

解決器將每個程式解密 \(C_j\), 要求所有後續簡體文字
必須為零的系數,將系數-零值轉換為字節,
形式:

$$
O=(y_0,\ldots,y_{31})
$$

接著:

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

### BFV 編程的後端 {#bfv-programmed-backend}

於 `bfv-programmed-sha3-256-v1`, 公共參數包括 BFV 标识符
加上隱藏程式消化:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

目前的 RAM-FHE 專案是:

| 區域 | 價值 |
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

已提交的簡體文字輸入 Torii 已加密成相同的 BFV 包裹
在執行前. 這個伺服器側加密的決定性種子是:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

在外部提供加密输入時, 解析器解密識別子
在執行前將它重新加密到這個決定性封面上.
這樣的加нони化讓收件哈希斯保持穩定,
BFV 密碼文本.

開始加密記憶路由來自:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

在 32 條車道中,_在 [0,t) \) 中, BFV
密碼文字加密 \(r_j\). 隱藏的程式則執行加密
記錄和加密記憶體:

| 指示時間 | 數學 |
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | 沒有任何問題._沒有任何樓盤符合您的搜尋 - |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\), 然後重新排列 |
| `SelectEqZero(dst, cond, z, nz)` | 解密方式 \(R_{\mathrm{cond}}\); 選擇 \(R_z\) 如果是零, \(R_{nz}\). |
| `Output(src)` | 附加 \(R_{\mathrm{src}}\) 在輸出帳號列表中. |

解決器解密了每個輸出
註冊,將零系數轉換為字節,並連接這些字節:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

根據此分類,

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

預設編程的識別帶有64個輸入插槽.
\(i\), 它加載輸入插槽,加载記憶路線 \(i \bmod 32\), 增加他們,
顯示結果:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 產品標籤和收單 {#output-hashes-and-receipts}

這種藥物 RAM-LFE 執行領取不簽字原始輸出.
输出哈希:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

於 Torii RAM-LFE 執行收據,相關數據是法典的
程序識別子字节:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

簽署的收件有效載荷為:

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

於 `signed` 方式:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

核查簽名, `resolver_public_key` 並拒絕了
除非所有這些等級都包含:

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

如果呼叫者提供 `output_hex`, 驗證人也檢查:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

於 `proof` 證書中包含了證明封筒,
檢查證據後端,電路識別碼,
公眾輸入方案哈希,驗證密碼哈希以及公開的實例
匹配證據驗證器的元數據和加碼的收件-付費負荷哈希.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

預期的公眾案例是四個單元列. \(j\)
包含字节 \(h_{8j}\ldots h_{8j+7}\) 接著是 24 個零字節:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 識別子投影 {#identifier-projection}

不使用通用后端的識別器解析度 `opaque_hash` 這樣的
顯示使用者面向不透明的帳戶識別碼. RAM-LFE 输出哈希
透過特定識別子域:

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

其他國家 `IdentifierResolutionReceipt` 簽署更高水平的有效載荷:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

對於簽名的識別碼收據:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier` 只有在簽名或證明時才接受收件
實行,嵌入式 RAM-LFE 執行有效載荷與參考的程式相匹配
這項政策, `uaid` 及其他 `account_id` 是被要求的束性.

## 執行流程 {#execution-flow}

這種藥物 RAM-LFE 執行方式如下:

1. 管理或運營商登記 `RamLfeProgramPolicy`.
2. 這項政策由所有者啟動.
3. 客戶閱讀公共政策的元數據 Torii.
4. 客戶端向解析器提交了一個輸入表格:
   `input_hex` 或是加密的 BFV 輸入封筒.
5. 執行時間評估隱藏的程式, `output_hex`,
   `output_hash`, `opaque_hash`, `receipt_hash`, 及一個
   `RamLfeExecutionReceipt`.
6. 客戶或後端會與公布的政策核實收件,
   選擇性檢查是否返回 `output_hex` 收取證件的哈希
   `output_hash`.
7. 提供更高水平的教學, `ClaimIdentifier`, 能嵌入到
   證明收件,而不是嵌入原始輸入.

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

## 識別方式政策 {#identifier-policies}

這項政策是實際使用的 RAM-LFE. 他們增加了商機.
在一般程序政策之上,

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

識別層使用了 RAM-LFE 收件必須結束:

- `policy_id`
- 由隱藏函數所取出的不透明識別符
- 決定性 `receipt_hash`
- 這份帳號是 UAID
- 經典 `account_id`
- 這種藥物 RAM-LFE 執行使用負荷

請將帳戶名稱與私人名稱分開.
姓氏是公眾名稱,電話號碼,電子郵件地址和
這項政策和收款應以類似的價值為例.

## Torii 航線 {#torii-routes}

在應用程式面向的路由家族啟動時, Torii 顯示性 RAM-LFE 及其他
識別器助手:

| 航行方式 | 目的 |
| --- | --- |
| `GET /v1/ram-lfe/program-policies` | 活跃和不活跃的列表 RAM-LFE 該項目的目標是: |
| `POST /v1/ram-lfe/programs/{program_id}/execute` | 執行一個程序 `input_hex` 或是 `encrypted_input` 並返回輸出哈希, |
| `POST /v1/ram-lfe/receipts/verify` | 檢查一個 `RamLfeExecutionReceipt` 比較與公布的政策, `output_hex` 必須 `output_hash`. |
| `GET /v1/identifier-policies` | 列出識別子政策,正常化模式,解決鍵和加密輸入元數據. |
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` | 發送使用者可以嵌入的收件 `ClaimIdentifier`. |
| `POST /v1/identifiers/resolve` | 在有活力索賠時,解決對結束帳戶的正常化識別子輸入. |
| `GET /v1/identifiers/receipts/{receipt_hash}` | 查找使用驗證碼哈希進行審核和支援工具的持久識別聲明. |

總是檢查目標節點的位置 `/openapi` 或是 `/openapi.json` 之前的文件
提供可用性取決於節點的建立和
網頁配置文件.

## 關節運行時間 {#node-runtime}

Torii 還在進行 RAM-LFE 運行時間設定在下列:
`torii.ram_lfe.programs[*]`, 按鍵輸入 `program_id`. 每個設定的程式
必須符合連鎖政策的承諾,
檢測資料需要評估和證明收件.
同樣的運行時間;他們不需要獨立的識別子-解析器配置
表面.

單獨註冊一項政策連鎖不夠.
也會顯示路線家族,並有相匹配的運行時間材料
這項計畫將會被執行.

## 運行防線 {#operational-guardrails}

- 檢查公眾傳統數據,
- 保護評估員的秘密, BFV 秘密
  資料來自文件,日志,交易和客戶包.
- 不要將原始識別子放入帳戶名稱,交易元數據中,
  或是世界國家的領域.
- 在提交高級指示之前, 客戶端檢查收據
  當該組織 SDK 顯示證實者.
- 使用過期欄位, 舊領取不應該永遠有效.
- 透過註冊新的程式或識別碼政策,
  在新的收益流動時,

## 有關議題 {#related-topics}

- [提供個人資料空間的贊助費用](/zh-hant/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii 目的地](/zh-hant/reference/torii-endpoints.md#app-and-sora-route-families)
- [匿名交易](/zh-hant/blockchain/anonymous-transactions.md)
