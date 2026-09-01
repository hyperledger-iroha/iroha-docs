---
translation_locale: zh-hant
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE 代表隨機訪問機器性函式評估. 在 Iroha 中,它是公共政策在鏈上的程式的通用隱藏函式層,但其評價者邏輯,秘密或原始輸入不應該被寫給世界狀態.它被 SORA Nexus 識別器流,如私人電話或電子郵件搜尋所使用,並且也可以作為一個通用的 Torii 程式執行輔助器,當節點配置檔案啟用應用面向路徑時.

鏈條儲存了政策承諾和回執驗證後設資料.一個解決器或 Torii 執行階段評估隱藏的程式,只返回允許輸出,並附加了一個客戶端,支援工具或賬本說明可以與註冊的政策進行驗證的收據.

## 命名 {#naming}

命名分為重要:

|術語|含義|
| --- | --- |
|`ram_lfe`|外層隱藏函式抽象：包括程式策略、承諾、執行收據和收據驗證模式。|
|`BFV`|透過加密輸入 RAM-LFE 後臺使用的Brakerski/Fan-Vercauteren同樣式加密方案. |
|`ram_fhe_profile`|程式設計加密執行機器的 BFV 特定後設資料. 它不是 RAM-LFE 的第二個名稱. |

在資料模型中, `RamLfeProgramPolicy` 和 `RamLfeExecutionReceipt` 是 RAM-LFE 型別. BFV 引數,加密文字封裝和隱藏的 RAM-FHE 程式配置檔案屬於一個政策使用的加密執行後端.

## 它所記錄的內容 {#what-it-records}

一項 RAM-LFE 計劃政策由 `program_id` 全球註冊.該政策包含:

- 可啟用,禁用或以其他方式改變政策的所有者帳戶
- 廣告給客戶的後端
- 收據驗證模式, `signed` 或 `proof`
- 致力於隱藏的程式後設資料和評估者秘密
- 簽署的收據的解決器公鑰
- 可選的公開加密輸入後設資料,例如 BFV 引數和 `ram_fhe_profile`
- 一個 `active` 旗,控制該政策是否可以發行新收據

隱藏的秘密,清晰文字識別值和隱藏的程式體都不儲存在世界狀態中.客戶應將承諾,不透明的雜湊,回執雜湊,密碼文字和程式摘要視為不透明的協議價值.

## 背景 {#backends}

目前的 RAM-LFE 支援集中在三個後端識別符上:

|後端|使用|
| --- | --- |
|`hkdf-sha3-512-prf-v1`|承諾的評估 PRF. |
|`bfv-affine-sha3-256-v1`|透過 BFV 支援的加密識別區間進行秘密表達評估. |
|`bfv-programmed-sha3-256-v1`| BFV- 透過加密登錄檔和記憶體路徑進行程式設計執行. |

對於識別器政策來說,程式設計的 BFV 後端是重要的現代路徑.它允許錢包在本地加密正常輸入,讓解析器在交易中看不到公開識別器的情況下進行評估,返回一個收據,將輸出雜湊繫結到註冊程式的政策.

## 數學 {#math}

本節描述了當前 RAM-LFE 程式碼所使用的實現級代數.它不是安全證明;這是政策,收據和客戶必須同意的確定性轉錄和加密評估模型.

### 標記 {#notation}

讓:

- \(H(m)\)是 Iroha `Hash::new(m)`:Blake2b-32在 `m`上,最後位元組的最小顯著位被迫到 `1`.
- \(N(x)\)是 `x`的規範 Norito 編碼.
- \(a \parallel b\) 位元組串連的平均值
- \(\operatorname{le64}(i)\) 是一個未簽名整數的8位元組小編碼.
- \(s\) 成為世界外的秘密解決者.
- \(P\)是公共政策引數.
- \(A\) 要求相關資料.
- \(x\)是正常化輸入位元組或一個 Norito 編碼的加密輸入封裝,取決於後端.

RAM-LFE 使用域分隔的雜湊.下面的公式以目的命名域名;其當前位元組字串為:

|標誌|域字串|
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

### 政策承諾 {#policy-commitment}

一項政策承諾將公開引數和隱藏的解決機密繫結到後端. 首先,秘密是單獨的:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

然後將整個政策轉錄編碼為:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

並且釋出的政策雜湊是:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

在鏈上 `PolicyCommitment` 是:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

評估從執行階段秘密中重新計算相同的值.如果重新計算的雜湊不同,評估失敗了承諾不匹配.

### HKDF-SHA3-512 後端 {#hkdf-sha3-512-backend}

對於 `hkdf-sha3-512-prf-v1`,輸出是正常化輸入本身,但不透明的識別符號和回執雜湊是秘密繫結的 PRF 輸出.

要求的轉錄是:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF 鹽和偽隨機金鑰為:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

不透明的材料被擴大和化:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

回執材料還將不透明的ID繫結到:

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

後端返回:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV 頭 {#bfv-primer}

BFV 是一個基於網格的同形加密方案. "同形"意味著程式可以新增和乘以加密值,並在解密後得到相同的結果,就像它對平文值進行了新增和倍增一樣.

在 RAM-LFE 中, BFV 作為加密輸入機制:

1. 一個錢包將一個私有價值正常化,例如電話號碼或電子郵件地址.
2. 錢包將位元組轉化為小的整數槽.
3. 每個插槽都以解決器的公鑰 BFV 加密.
4. 解決器執行階段透過這些密碼文字來評估隱藏的程式.
5. 執行階段只會解密隱藏的程式輸出,或證明收據.

BFV 執行精確整數運算，而不是近似運算。因此，與浮點模型推論相比，它更適合識別碼位元組和小型模數運算。在 Iroha 目前的 BFV 用法中，每個加密槽攜帶一個模 \(t\) 的純量值，通常是一個位元組或位元組長度欄位。密文字身位於一個大得多的整數模數 \(q\) 下。\(q\) 與 \(t\) 之間的差距為加密和同態運算引入的雜訊留出瞭解密空間。

一個 BFV 密碼文字具有兩個多項元件:

$$
c=(c_0,c_1)
$$

金鑰是另一個多項式 \(s_k\).解密組合了以下元件:

$$
v = c_0 + c_1s_k
$$

如果密碼文字是正確的形成,並且噪音仍然足夠小, \(v\)就接近了擴充套件的平文. 圓形恢復了平文係數modulo \(t\).有用的屬性是,密碼文件操作保留了這個結構:

|簡單操作|密碼文字操作|
| --- | --- |
|\(m+n\)|新增密碼文字元件.|
|\(m+\alpha\)|在 \(c_0\) 中新增一個擴充套件的平文常數. |
|\(\alpha m\)|透過 \(\alpha\)來測量兩個密碼文字元件. |
|\(mn\)|乘以密碼文字多項式,重新擴充套件,然後再線性化.|

乘法是開銷較大的操作。兩個雙分量密文相乘後會自然產生一個三分量密文，該密文使用 \(1\)、\(s_k\) 和 \(s_k^2\) 解密。重線性化使用已發布的求值金鑰，將 \(s_k^2\) 項折回一般的雙分量密文，使後續加法和乘法可以繼續使用相同的密文結構。

BFV 也"級別化":每個加密操作都消耗了一些噪音預算.這種實現不會啟動加密文字來更新該預算.相反,RAM-LFE 釋出了一個小的 `ram_fhe_profile` 並只接受一個侷限的隱藏程式形狀.這使得評估保持在引數集的支援深度內.當前程式設計配置檔案允許固定登錄檔計數,固定的記憶體通道計數和每個程式設計步驟最多一個密碼文字-密碼文字乘法.

在這個 RAM-LFE 設計中,BFV 隱藏了客戶端輸入的公共賬本資料和觀察者只看到交易或路線有效載荷.這並不意味著鏈本身會執行任意加密程式.Torii 解析器執行階段仍然擁有 BFV 秘密材料,評估配置的隱藏程式,解密允許輸出,並證明結果.帳本隨後驗證了對鏈上政策承諾的認證,並解決公鑰或證明後設資料.

識別符號使用案例故意選擇一個簡單的表示.正常化字串編碼為:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

每個元素都被加密為其自己的 BFV skalar ciphertext. 這種形狀使正常化和封裝驗證顯而易見,允許錢包從公共引數構建加密請求,並讓解析器將相當的加密輸入納入一個穩定的收據轉錄中.

### BFV 指環模型 {#bfv-ring-model}

在 BFV 後端使用了否定式多項環:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

和簡體文字環:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

在哪裡:

- \(n\)是`polynomial_degree`,一個功率為兩個
- \(q\)是`ciphertext_modulus`
- \(t\)是`plaintext_modulus`
- \(q > t\)和\(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

簡體文字系數向量透過擴充套件每個係數編碼:

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

解密中心升降每一個因數:

$$
v = c_0 + c_1 s_k \in R_q
$$

然後將其迴歸為 \(R_t\):

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

這裡 \(s_k\) 是 BFV 金鑰多項,而不是外部 RAM-LFE 分辨機密 \(s\).

### BFV 關鍵世代 {#bfv-key-generation}

對於加密識別器輸入, BFV 金鑰材料對分辨器的秘密和相關資料是決定性的:

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG 種子為:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

關鍵發電機樣本:

- \(s_k \in \{-1,0,1\}^n\),表示為modulo \(q\)
- \(a \leftarrow R_q\)均
- \(e \in \{-1,0,1\}^n\)

公開關鍵是:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

為了重新線性化,讓 \(s_k^2\) 作為環產品 \(R_q\). 每個基地...\(B\) 數字 \(j\), 樣本 \(a_j\) 均和 \(e_j\) 從小分銷,然後釋出:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公眾 BFV 政策後設資料包含 \((n,q,t,B)\), 公共鑰匙; `max_input_bytes`. 其他 BFV 秘密金鑰和重新線性化金鑰保持在解決器執行階段.

### BFV 加密和運營 {#bfv-encryption-and-operations}

為了加密一個純文字多項 \(m\), 實施種子另一個 ChaCha20 RNG 來自:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

它採集\(u,e_1,e_2 \in \{-1,0,1\}^n\)樣本並計算:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

密碼文字是 \(c=(c_0,c_1)\).

在元件方面,同樣式的加算是:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

新增一個簡體文字尺度 \(\alpha\) 只有變化到零係數 \(c_0\):

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

乘以純文字尺度 \(\alpha\)的尺度對兩個元件進行了重複:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

對於兩個密碼文字 \(c=(c_0,c_1)\) 和 \(d=(d_0,d_1)\),密碼文字乘法首先計算一個大小三的密碼文字,並將每個係數回撥到 \(t/q\):

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

上述所有產品都是 \(R_q\) 中的否定迴圈環產品.然後\(\tilde c_2\)被分解為基數-\(B\)多項式:

$$
\tilde c_2 = \sum_j B^j u_j
$$

和重新線性化:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

結果又是兩個組成部分的 BFV 密碼文字.

### 識別符號密碼文字包 {#identifier-ciphertext-envelope}

一個標識器輸入位元組字串:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

編碼為 skalar slots:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

所有剩餘的插槽均為零到 `max_input_bytes + 1`.每一個 skalar 插槽都加密為係數-零直文多項式 \([m_i]\). 每個插槽加密種子為:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

密碼識別器封裝是:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

在 \(M=\mathrm{max\_input\_bytes}\) 中.

### BFV 簡單的後果 {#bfv-affine-backend}

對於 `bfv-affine-sha3-256-v1`，執行階段會先根據 \(s\) 和 \(A\) 衍生 BFV 金鑰材料。衍生出的公開參數必須與鏈上承諾的公開參數完全一致。

圓的種子是:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

從此種子中執行階段樣本,modulo \(t\),一個32列的相似電路:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

在 \(m_i\) 是解密的識別符號插槽.同形,它在加密文字上計算出相同值:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

解析器解密每個 \(C_j\),要求所有後續直文係數為零,將係數-零值轉換為位元組,並表達:

$$
O=(y_0,\ldots,y_{31})
$$

然後:

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

### BFV 程式設計後端 {#bfv-programmed-backend}

在 `bfv-programmed-sha3-256-v1` 中,公共引數包括 BFV 識別符號加密引數以及隱藏程式摘要:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

目前的 RAM-FHE 檔案是:

|領域|價值|
| --- | --- |
|`profile_version`| `1` |
|`register_count`| `4` |
|`memory_lane_count`| `32` |
|`ciphertext_mul_per_step`| `1` |
|`encrypted_input_mode`|`resolver_canonicalized_envelope_v1`|
|`min_ciphertext_modulus`| \(2^{52}\) |

在執行之前,向 Torii 提交的純文字輸入被加密在同一個 BFV 封裝中.該伺服器側加密的確定性種子是:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

對於外部提供的加密輸入,解析器將識別包解密碼並在執行之前重新加密到這個決定性包中.該規範化使回執雜湊保持在語義上同等的 BFV 加密文字中穩定.

最初的加密儲存路由來源於:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

對於32條路徑中的每一個,執行階段樣本 \(r_j \in [0,t)\) 並儲存 BFV 密碼文字加密 \(r_j\).隱藏的程式隨後透過加密登錄檔和加密記憶體執行:

|指示|演算法|
| --- | --- |
|`LoadInput(dst, i)`|\(R_{\mathrm{dst}} \leftarrow C_i\)|
|`LoadState(dst, j)`|\(R_{\mathrm{dst}} \leftarrow S_j\)|
|`StoreState(j, src)`|\(S_j \leftarrow R_{\mathrm{src}}\)|
|`LoadConst(dst, a)`|\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\)|
|`Add(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_a + R_b\)|
|`AddPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\)|
|`SubPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\)|
|`MulPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\)|
|`Mul(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_aR_b\),然後重新線性化|
|`SelectEqZero(dst, cond, z, nz)`|解密 \(R_{\mathrm{cond}}\);當它是零時,選擇 \(R_z\);否則 \(R_{nz}\). |
|`Output(src)`|將 \(R_{\mathrm{src}}\)新增到輸出登錄檔列中. |

命令帶完成後,解析器將每個輸出登錄檔解密,將零係數轉換為位元組,並連線這些位元組:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

一般的程式設計後端雜湊是:

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

預設程式設計識別帶有64個輸入插槽.對於每個插槽 \(i\),它載入輸入插孔,載入記憶體通道 \(i \bmod 32\),新增它們,並輸出結果:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 輸出標籤和收據 {#output-hashes-and-receipts}

總體的 RAM-LFE 執行收據不會簽署原始輸出. 它會簽署輸出雜湊:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

對於 Torii RAM-LFE 執行收據,相關資料是規範程式識別器位元組:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

簽署的收據有效載荷是:

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

對於 `signed`模式:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

驗證透過 `resolver_public_key`檢查簽名並拒絕回執,除非所有這些等價均具有:

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

如果呼叫者提供 `output_hex`,驗證人還檢查:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

在 `proof` 模式中,證明帶有證明封裝而不是簽名.驗證檢查證明後端,電路ID,公開輸入方案雜湊,驗證金鑰雜湊和暴露的公共例項是否與證明驗證器後設資料和加碼的回執付費雜湊相匹配.讓:

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

預期的公開例項是四個單元列. \(j\)列包含位元組 \(h_{8j}\ldots h_{8j+7}\),其次是24個零位元組:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 識別符號投影 {#identifier-projection}

識別器解析度不使用通用後端 `opaque_hash`作為面向使用者的不透明帳戶識別器.它透過特定識別器域進行投影 RAM-LFE 輸出雜湊:

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

一個 `IdentifierResolutionReceipt` 簽署了更高水平的有效載荷:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

簽署的識別符號收據:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier`只接受收據,如果簽名或證明是有效的,嵌入式 RAM-LFE 執行有效載荷符合引用的程式政策,並且`uaid`和 `account_id`是被索賠的繫結.

## 執行流程 {#execution-flow}

一個通用 RAM-LFE 執行方式是這樣的:

1. 管理或運營商登錄檔 `RamLfeProgramPolicy`.
2. 車主會啟用保險.
3. 客戶從 Torii 讀取公共政策的後設資料.
4. 客戶端向解決器提交一個輸入形式:簡體文字 `input_hex`或加密的輸入封裝 BFV.
5. 執行階段評估隱藏的程式,並返回 `output_hex`, `output_hash`, `opaque_hash`,`receipt_hash`和`RamLfeExecutionReceipt`.
6. 客戶端或後端會根據公佈的政策驗證收據,可選地檢查返回的 `output_hex`與收據的 `output_hash`雜湊.
7. 一個更高層次的指令,如 `ClaimIdentifier`,可以嵌入證實收據,而不是嵌入原始輸入.

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

## 標識器政策 {#identifier-policies}

標識策略是具體使用 RAM-LFE.它們在通用程式政策之上新增了商業名稱空間和規範化規則:

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

標識層使用 RAM-LFE 收據繫結:

- `policy_id`
- 隱藏函式所取出的不透明識別符號
- 確定性 `receipt_hash`
- 帳戶的 UAID
- 規範 `account_id`
- 一般執行有效載荷 RAM-LFE

對於面向使用者的登入,請將帳戶號與私人識別符號分開.號是公眾名稱;電話號碼,電子郵件地址和類似值應透過識別符號政策和收據流動.

## Torii 航線 {#torii-routes}

在啟用應用程式面向的路線家族時, Torii 將 RAM-LFE 和識別輔助器曝光到:

|路線|目的|
| --- | --- |
|`GET /v1/ram-lfe/program-policies`|列出活躍和不活躍的 RAM-LFE 程式政策和公開執行後設資料. |
|`POST /v1/ram-lfe/programs/{program_id}/execute`|執行一個程式從 `input_hex`或 `encrypted_input`,並返回輸出雜湊加上無狀態收據. |
|`POST /v1/ram-lfe/receipts/verify`|根據公佈的政策驗證`RamLfeExecutionReceipt`並可選地比較`output_hex`和 `output_hash`. |
|`GET /v1/identifier-policies`|列出識別器政策,正常化模式,解決鑰匙和加密輸入後設資料.|
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt`|發行使用者可以嵌入到 `ClaimIdentifier` 的收據.|
|`POST /v1/identifiers/resolve`|當有活躍索賠時,解決對繫結帳戶的正常化識別器輸入. |
|`GET /v1/identifiers/receipts/{receipt_hash}`|透過收據雜湊查詢持久識別索賠,用於審計和支援工具. |

在構建之前,總是檢查目標節點的 `/openapi.json`文件.可用性取決於節點構建和網路配置檔案.

## 節點執行階段 {#node-runtime}

Torii 的程序中執行階段 RAM-LFE 設定在 `torii.ram_lfe.programs[*]`下,按 `program_id`鍵.每個配置程式必須符合鏈上政策承諾,並且必須提供評估和證實收據所需的執行階段材料.識別路線重複使用相同的執行時段;它們不需要單獨的識別器-解析器配置表面.

僅在鏈上註冊政策並不足夠。目標節點還必須開放相應的路由族，並為預期執行的程式配備相符的執行階段材料。

## 運營監護軌道 {#operational-guardrails}

- 先將政策註冊為非啟用狀態，驗證公開中繼資料，然後再啟用。
- 在檔案,日誌,交易和客戶群中隱藏評估員的秘密,解決器簽字金鑰和 BFV 的秘密材料.
- 不要將原始識別符號放入帳戶姓名,交易後設資料,事件或世界狀態欄位中.
- 在 SDK 暴露驗證器時,在提交更高層次指令之前,向客戶端核實收據.
- 使用過時收據不應永遠有效的到期欄位.
- 透過註冊一個新的程式或識別器政策,遷移客戶,並在新收益流動時關閉舊的政策來旋轉.

## 相關主題 {#related-topics}

- [個人資料空間的贊助費用](/zh-hant/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md#app-and-sora-route-families)
- [無名交易](/zh-hant/blockchain/anonymous-transactions.md)
