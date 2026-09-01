---
translation_locale: ja
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 66436bfdcdfea9bcd52834436dc8b6abe9812549583e6bfca06cbe73d5f75d35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# RAM-LFE {#ram-lfe}

RAM-LFE はランダムアクセスマシンラコニック関数評価を意味します。Iroha では、公開ポリシーがオンチェーンにあるが、評価者のロジック、秘密、または生の入力がワールドステートに書き込まれるべきでないプログラムの汎用隠し関数レイヤーです。これは、プライベート電話やメールの照会など、SORA Nexus 識別子フローで使用されるものであり、ノードプロファイルがアプリ向けルートを有効にすると、一般的な Torii プログラム実行ヘルパーとしても公開される可能性があります。

チェーンは、ポリシーの暗号化コミットメント値およびプロトコル結果の記録検証メタデータを格納します。リゾルバーまたは Torii ソフトウェアランタイムは、隠されたプログラムを評価します、許可された出力のみを返し、クライアント、サポートツール、またはブロックチェーン台帳の指示が登録されたポリシーと照合して検証できるプロトコル結果記録を添付します。

## 命名 {#naming}

名前の分割は重要です:

|用語|意味|
| --- | --- |
| `ram_lfe` |外部の隠れ機能抽象化：プログラムポリシー、暗号的コミットメント値、実行プロトコル結果記録、およびプロトコル結果記録検証モード。|
| `BFV` |暗号化入力 RAM-LFE バックエンドで使用される Brakerski/Fan-Vercauteren ホモモルフィック暗号化方式。|
| `ram_fhe_profile` |プログラム化された暗号化実行機の BFV 固有のメタデータです。RAM-LFE の別名ではありません。|

データモデルでは、`RamLfeProgramPolicy` と `RamLfeExecutionReceipt` は RAM-LFE 型です。BFV パラメータ、暗号化データコンテナ、および隠された RAM-FHE プログラムプロファイルは、ポリシーによって使用される暗号化実行バックエンドに属します。

## 何を記録するか {#what-it-records}

A RAM-LFE プログラム方針は `program_id` によってグローバルに登録されています。方針には以下が含まれます：

- ポリシーを有効化、無効化、またはその他変更できる所有者アカウント
- クライアントに宣伝されたバックエンド
- プロトコル結果記録検証モード、`signed` または `proof`
- 隠されたプログラムのメタデータと評価者の秘密への暗号学的コミットメント値
- 署名付きプロトコル結果レコードのリゾルバ公開鍵
- 任意の公開暗号化入力メタデータ、例えば BFV パラメータや `ram_fhe_profile`
- ポリシーが新しいプロトコル結果レコードを発行できるかどうかを制御する`active`フラグ

隠された秘密、プレーンテキスト識別子の値、および隠されたプログラム本体はワールドステートに保存されません。クライアントは暗号学的コミットメント値、不透明な暗号ハッシュ、プロトコル結果記録の暗号ハッシュ、暗号文を取り扱うべきです。そして暗号ダイジェストを不透明なプロトコル値としてプログラムする。

## バックエンド {#backends}

現在の RAM-LFE のサポートは、3つのバックエンド識別子に集中しています:

|バックエンド|使用する|
| --- | --- |
| `hkdf-sha3-512-prf-v1` |コミットメントに基づく PRF 評価。|
| `bfv-affine-sha3-256-v1` |暗号化された識別子スロット上での BFV 支援の秘密アフィン評価。|
| `bfv-programmed-sha3-256-v1` | BFV によってサポートされる暗号化されたレジスタおよびメモリエグゼキューションレーン上でのプログラム済み実行。|

識別子ポリシーの場合、プログラムされた BFV バックエンドが重要な最新の経路です。これにより、ウォレットは正規化された入力をローカルで暗号化でき、リゾルバは評価することができます取引で公開識別子を確認することなく、出力の暗号ハッシュを登録されたプログラムポリシーに結び付けるプロトコル結果レコードを返します。

## 数学 {#math}

このセクションでは、現在の RAM-LFE コードで使用される実装レベルの代数について説明します。これはセキュリティ証明ではなく、ポリシー、プロトコル結果記録、およびクライアントが同意しなければならない決定論的なトランスクリプトおよび暗号化評価モデルです。

### 表記 {#notation}

次のようにする:

- \(H(m)\) は Iroha `Hash::new(m)` です: 最後のバイトの最下位ビットを `1` に強制した、`m` 上の Blake2b-32。
- \(N(x)\) は `x` の正格な Norito エンコーディングです。
- \(a \parallel b\) はバイト列の連結を意味します。
- \(\operatorname{le64}(i)\) は、符号なし整数の8バイトのリトルエンディアン表現であること。
- \(s\) はワールドステートの外部に保持されるリゾルバシークレットです。
- \(P\) は公共政策のパラメータである。
- \(A\) に関連するデータを要求してください。
- \(x\) は正規化された入力バイト、またはバックエンドに応じて Norito でエンコードされた暗号化入力データコンテナになります。

RAM-LFE はドメイン分離された暗号ハッシュを使用します。以下の式では目的によってドメインに名前を付けています。現在のバイト列は次の通りです：

|シンボル|ドメイン文字列|
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

### ポリシー暗号化コミットメント値 {#policy-commitment}

ポリシー暗号コミットメント値は、公開パラメータと隠されたリゾルバー秘密をバックエンドに結び付けます。まず、秘密は個別に暗号的に結び付けられます：

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

それから、完全なポリシーの記録がエンコードされます:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

そして公開されたポリシーの暗号ハッシュは次の通りです:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

オンチェーンの`PolicyCommitment`は:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

評価はソフトウェア実行時の秘密から同じ値を再計算します。再計算された暗号ハッシュが異なる場合、評価は暗号コミットメント値の不一致で失敗します。

### HKDF-SHA3-512 バックエンド {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1`については、出力は正規化された入力自体ですが、不透明な識別子とプロトコル結果レコードの暗号ハッシュは秘密に紐付いた PRF の出力です。

要求された記録は次の通りです:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF のソルトと疑似乱数キーは次の通りです:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

不透明な材料は展開され、ハッシュ化されます:

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

プロトコル結果記録マテリアルは、追加で不透明なIDに結合します:

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

バックエンドは次のものを返します:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV プライマー {#bfv-primer}

BFV は格子に基づく準同型暗号方式です。「準同型」とは、プログラムが暗号化された値を加算および乗算でき、復号後に、平文の値に対して加算や乗算を行った場合と同じ結果を得られることを意味します。

RAM-LFE の場合、BFV は暗号化入力メカニズムとして使用されます：

1. ウォレットは、電話番号やメールアドレスなどの個人情報を正規化します。
2. そのウォレットはバイトを小さな整数スロットに変換します。
3. 各スロットはリゾルバの BFV 公開鍵で暗号化されています。
4. リゾルバソフトウェアの実行時は、それらの暗号文に対して隠されたプログラムを評価します。
5. ソフトウェアランタイムは、隠されたプログラム出力のみを復号化し、プロトコル結果の記録を署名または証明します。

BFV は近似計算ではなく、正確な整数演算です。このため、浮動小数点モデルの推論よりも、バイトの識別や小規模なモジュラー計算に適しています。 Iroha の現在の BFV の使用では、各暗号化スロットは\(t\)を法とする1つのスカラー値を保持しており、通常は1バイトまたはバイト長のフィールドです。暗号文自体は\(q\) よりはるかに大きい整数での剰余。 \(q\) と \(t\) の間の差は、暗号化および準同型演算によって導入されるノイズの復号処理の余地を提供する。

A BFV 暗号文は二つの多項式成分を持っています:

$$
c=(c_0,c_1)
$$

秘密鍵は別の多項式 \(s_k\) です。復号は成分を組み合わせて行います：

$$
v = c_0 + c_1s_k
$$

もし暗号文が正しく形成され、ノイズが十分に小さいままであれば、\(v\) はスケーリングされた平文に近くなります。丸め操作により、平文の係数を \(t\) での剰余として回復できます。便利な特性は、暗号文の演算がこの構造を保持することです:

|単純操作|暗号文操作|
| --- | --- |
| \(m+n\) |暗号文の構成要素を追加する。|
| \(m+\alpha\) |スケーリングされた平文の定数を \(c_0\) に追加してください。|
| \(\alpha m\) |両方の暗号文の要素を \(\alpha\) でスケーリングする。|
| \(mn\) |暗号文の多項式を掛け、再スケーリングした後、再線形化します。|

乗算は高コストな操作です。2つの2成分暗号文の積は、自然に3成分暗号文を生成し、\(1\)、\(s_k\)、および\(s_k^2\)で復号されます。リリニアライゼーションは、公開されている評価鍵を使用して \(s_k^2\) 項を通常の二成分暗号文に折りたたみます。これにより、同じ暗号文の形を使用した後の加算や乗算が維持されます。

BFV も「レベリング」されています：すべての暗号化操作はあるノイズ予算を消費します。この実装では、その予算を更新するために暗号文をブートストラップしません。その代わりに、RAM-LFE は小さな `ram_fhe_profile` を公開し、制限された隠れプログラムの形状のみを受け入れます。それにより、評価はパラメーターセットのサポートされている深さ内に収まります。現在のプログラムされたプロファイルでは、固定のレジスタ数、固定のメモリレーン数、そしてプログラムされた各ステップごとに最大1回の暗号文同士の乗算が可能です。

これの中で RAM-LFE デザイン BFV クライアントの入力を公開ブロックチェーンの台帳データや、取引やルートのペイロードしか見ない観察者から隠します。 それは、チェーンが任意の暗号化されたプログラムを自ら実行することを意味するわけではありません。その Torii リゾルバソフトウェアのランタイムはまだ所有しています BFV 秘密の資料は、構成された隠されたプログラムを評価し、許可された出力を復号し、結果を証明します。 その後、ブロックチェーン台帳は、オンチェーンに対する証明を検証します ポリシーの暗号化コミットメント値およびリゾルバ公開鍵または証明メタデータ。

識別子のユースケースは、あえて単純な表現を選びます。正規化された文字列は次のようにエンコードされます:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

各要素はそれぞれ独自の BFV スカラー暗号文として暗号化されます。その形状により正規化とデータコンテナの検証が明示され、ウォレットが構築できるようになります公開パラメータからの暗号化されたリクエストを処理し、リゾルバーが同等の暗号化された入力を安定したプロトコル結果レコードの記録トランスクリプトに正規化できるようにします。

### BFV リングモデル {#bfv-ring-model}

BFV バックエンドはネガサイクリック多項式環を使用します:

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

そしてプレーンテキストリング：

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

どこ:

- \(n\) は `polynomial_degree`、二の累乗です
- \(q\) は `ciphertext_modulus` です
- \(t\) は `plaintext_modulus` です
- \(q > t\) と \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

平文の係数ベクトルは、各係数をスケーリングすることで符号化されます：

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

復号センターは次の各係数を持ち上げます:

$$
v = c_0 + c_1 s_k \in R_q
$$

それからそれを \(R_t\) に戻して丸めます:

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

ここで \(s_k\) は BFV の秘密鍵多項式であり、外側の RAM-LFE リゾルバ秘密 \(s\) ではありません。

### BFV 鍵生成 {#bfv-key-generation}

暗号化された識別子入力の場合、BFV キー材料はリゾルバーのシークレットと関連データごとに決定論的です：

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG は次のようにシードされます:

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

キー生成器のサンプル:

- \(s_k \in \{-1,0,1\}^n\) を \(q\) で割った余りで表したもの
- \(a \leftarrow R_q\) 均一に
- \(e \in \{-1,0,1\}^n\)

公開鍵は次の通りです:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

リリニアライズのために、\(R_q\) における環の積を \(s_k^2\) とします。各 base-\(B\) の桁 \(j\) について、\(a_j\) を一様にサンプリングし、小さい分布から \(e_j\) をサンプリングして、次のように公開します:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公開 BFV ポリシーメタデータには\((n,q,t,B)\)、公開鍵、および`max_input_bytes`が含まれます。BFV 秘密鍵と再線形化鍵はリゾルバソフトウェアの実行時に保持されます。

### BFV 暗号化と操作 {#bfv-encryption-and-operations}

平文多項式 \(m\) を暗号化するために、実装は別の ChaCha20 RNG を以下からシードします:

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

これは \(u,e_1,e_2 \in \{-1,0,1\}^n\) をサンプリングして計算します:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

暗号文は\(c=(c_0,c_1)\)です。

準同型加算は要素ごとです:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

係数ゼロにプレーンテキストスカラー\(\alpha\)を追加すると、\(c_0\)だけが変わります:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

平文スカラー \(\alpha\) を掛けると、両方の成分がスケーリングされます:

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

2つの暗号文 \(c=(c_0,c_1)\) と \(d=(d_0,d_1)\) に対して、暗号文の乗算は最初にサイズ3の暗号文を計算し、各係数を \(t/q\) で元に戻します:

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

上記のすべての製品は \(R_q\) におけるネガサイクリック環の積です。次に \(\tilde c_2\) は基底 \(B\) 多項式に分解されます:

$$
\tilde c_2 = \sum_j B^j u_j
$$

そして再線形化された:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

結果は再び二成分の BFV 暗号文です。

### 識別子 暗号文データコンテナ {#identifier-ciphertext-envelope}

識別子入力バイト列:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

スカラーのスロットにエンコードされます:

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

そして、残りのすべてのスロットは`max_input_bytes + 1`までゼロです。各スカラー・スロットは係数ゼロの平文多項式\([m_i]\)として暗号化されます。スロットごとの暗号化シードは次の通りです:

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

暗号化された識別子データコンテナは次の通りです:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\)はどこですか。

### BFV アフィンバックエンド {#bfv-affine-backend}

`bfv-affine-sha3-256-v1`の場合、ソフトウェアのランタイムはまず\(s\)と\(A\)から BFV キー材料を導出します。導出された公開パラメータは、オンチェーンで暗号的に結び付けられた公開パラメータと正確に一致する必要があります。

アフィン回路のシードは次の通りです:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

このシードから、ソフトウェアランタイムは \(t\) で割った余りを取り、32行のアフィン回路をサンプリングします:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

ここで \(m_i\) は復号された識別子スロットです。準同型的に、暗号文上で同じ値を計算します：

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

リゾルバは各 \(C_j\) を復号し、すべての後続する平文係数がゼロであることを要求し、係数ゼロの値をバイトに変換し、次を形成します:

$$
O=(y_0,\ldots,y_{31})
$$

それから：

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

### BFV プログラムされたバックエンド {#bfv-programmed-backend}

〜のために `bfv-programmed-sha3-256-v1`, パブリックパラメータがラップする BFV 識別子暗号化パラメータと隠されたプログラムの暗号学的ダイジェスト値:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

現在の RAM-FHE プロファイルは次のとおりです:

|フィールド|価値|
| --- | --- |
| `profile_version` | `1` |
| `register_count` | `4` |
| `memory_lane_count` | `32` |
| `ciphertext_mul_per_step` | `1` |
| `encrypted_input_mode` | `resolver_canonicalized_envelope_v1` |
| `min_ciphertext_modulus` | \(2^{52}\) |

Torii に送信されたプレーンテキスト入力は、実行前に同じ BFV データコンテナに暗号化されます。そのサーバー側暗号化の決定論的シードは次のとおりです:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

外部から提供された暗号化入力に対して、リゾルバは識別子データコンテナを復号し、実行する前にこれをこの決定的データコンテナに再暗号化します。この正規化により、プロトコル結果レコードの暗号ハッシュが意味的に等しい BFV 暗号文間で安定します。

初期暗号化メモリ実行レーンは次から導出されます:

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32本の実行レーンそれぞれについて、ソフトウェア実行時は\(r_j \in [0,t)\)をサンプリングし、\(r_j\)を暗号化した BFV の暗号文を保存します。その後、隠されたプログラムは暗号化されたレジスタと暗号化されたメモリ上で実行されます:

|指示|代数学|
| --- | --- |
| `LoadInput(dst, i)` | \(R_{\mathrm{dst}} \leftarrow C_i\) |
| `LoadState(dst, j)` | \(R_{\mathrm{dst}} \leftarrow S_j\) |
| `StoreState(j, src)` | \(S_j \leftarrow R_{\mathrm{src}}\) |
| `LoadConst(dst, a)` | \(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a)\) |
| `Add(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_a + R_b\) |
| `AddPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\) |
| `SubPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\) |
| `MulPlain(dst, src, a)` | \(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\) |
| `Mul(dst, a, b)` | \(R_{\mathrm{dst}} \leftarrow R_aR_b\)、その後再線形化する|
| `SelectEqZero(dst, cond, z, nz)` | \(R_{\mathrm{cond}}\) を復号する。ゼロの場合は \(R_z\) を選び、そうでなければ \(R_{nz}\) を選ぶ。|
| `Output(src)` |出力レジスタリストに \(R_{\mathrm{src}}\) を追加します。|

指示テープが終了した後、リゾルバは各出力レジスタを復号し、係数ゼロをバイトに変換し、それらのバイトを連結します:

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

一般的にプログラムされたバックエンドの暗号ハッシュは次のとおりです：

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

デフォルトのプログラム済み識別テープには64個の入力スロットがあります。各スロット\(i\)について、入力スロットを読み込み、メモリ実行レーン\(i \bmod 32\)を読み込み、それらを加算し、結果を出力します：

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 暗号ハッシュとプロトコル結果レコードを出力する {#output-hashes-and-receipts}

一般的な RAM-LFE 実行プロトコル結果記録は、生の出力に署名しません。出力の暗号ハッシュに署名します:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE 実行プロトコル結果記録の場合、関連データは標準プログラム識別子のバイトです:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

署名付きプロトコル結果レコードのペイロードは次のとおりです:

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

`signed`モードの場合:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

検証は`resolver_public_key`で署名を確認し、次のすべての等式が成立しない限りプロトコル結果の記録を拒否します:

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

もし発信者が`output_hex`を提供した場合、検証者は次も確認します:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof`モードでは、証明書は署名の代わりに証明データコンテナを持ちます。検証では、証明バックエンド、回路ID、公開入力スキーマがチェックされます。暗号ハッシュ、検証キー暗号ハッシュ、および公開されている公開インスタンスが、証明検証メタデータおよびエンコードされたレシートペイロードの暗号ハッシュと一致することを確認します。次のとおりです：

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

予想される公開インスタンスは4つの1要素の列です。列 \(j\) にはバイト \(h_{8j}\ldots h_{8j+7}\) の後に24個のゼロバイトが続きます:

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 識別子投影 {#identifier-projection}

識別子の解決は、ユーザー向けの不透明なアカウント識別子としてジェネリックバックエンド `opaque_hash` を使用しません。識別子固有のドメインを通して RAM-LFE 出力の暗号ハッシュを投影します:

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

An `IdentifierResolutionReceipt` が上位のペイロードに署名します:

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

署名付き識別子プロトコル結果レコードの場合:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier`は、署名または証明が有効であり、埋め込まれた RAM-LFE 実行ペイロードが参照されるプログラムポリシーと一致し、`uaid`および`account_id`が請求されているバインディングである場合にのみ、プロトコル結果レコードを受け入れます。

## 実行フロー {#execution-flow}

一般的な RAM-LFE の実行は、次の形に従います：

1. ガバナンスまたはオペレーターが`RamLfeProgramPolicy`を登録します。
2. オーナーがポリシーを有効にする。
3. クライアントは Torii から公開ポリシーメタデータを読み取ります。
4. クライアントは、リゾルバにちょうど一つの入力フォームを提出します：プレーンテキスト `input_hex` または暗号化された BFV 入力データコンテナ。
5. ソフトウェアのランタイムは隠されたプログラムを評価し、`output_hex`、`output_hash`、`opaque_hash`、`receipt_hash`、および`RamLfeExecutionReceipt`を返します。
6. クライアントまたはバックエンドは、公開されているポリシーに対してプロトコル結果レコードを検証し、必要に応じて返された`output_hex`の暗号ハッシュがプロトコル結果レコードの`output_hash`に一致するかを確認します。
7. より高レベルの命令、例えば `ClaimIdentifier` は、生の入力を埋め込む代わりに、認証されたプロトコル結果記録を埋め込むことができます。

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

## 識別子ポリシー {#identifier-policies}

識別子ポリシーは RAM-LFE の具体的な使用例です。これらは、汎用プログラムポリシーの上にビジネスネームスペースと正規化ルールを追加します。

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

識別レイヤーは、RAM-LFE プロトコル結果レコードを使用してバインドします:

- `policy_id`
- 隠された関数によって導出される不透明な識別子
- 決定論的な `receipt_hash`
- アカウントの UAID
- 正典の `account_id`
- 汎用の RAM-LFE 実行ペイロード

ユーザー向けのオンボーディングでは、アカウントのエイリアスを個人識別子とは分けて保持してください。エイリアスは公開名であり、電話番号、メールアドレス、その他の類似の値は識別子ポリシーやプロトコル結果記録を通して扱うべきです。

## Torii ルート {#torii-routes}

アプリ向けルートファミリーが有効になると、Torii は RAM-LFE と識別子ヘルパーを公開します:

|ルート|目的|
| --- | --- |
| `GET /v1/ram-lfe/program-policies` |アクティブおよび非アクティブな RAM-LFE プログラム方針と公開実行メタデータの一覧を作成します。|
| `POST /v1/ram-lfe/programs/{program_id}/execute` |`input_hex` または `encrypted_input` のいずれかのプログラムを実行し、出力の暗号ハッシュとステートレスプロトコル結果記録を返します。|
| `POST /v1/ram-lfe/receipts/verify` |公開されているポリシーに対して`RamLfeExecutionReceipt`を確認し、必要に応じて`output_hex`を`output_hash`と比較します。|
| `GET /v1/identifier-policies` |識別子ポリシー、正規化モード、リゾルバキー、および暗号化入力メタデータを一覧表示します。|
| `POST /v1/accounts/{account_id}/identifiers/claim-receipt` |ユーザーが`ClaimIdentifier`に埋め込むことができるプロトコル結果記録を発行します。|
| `POST /v1/identifiers/resolve` |有効なクレームが存在する場合、正規化された識別子入力を関連付けられたアカウントに解決する。|
| `GET /v1/identifiers/receipts/{receipt_hash}` |監査およびサポートツールのために、プロトコル結果レコードの暗号ハッシュによって永続化された識別子の主張を検索します。|

これらのルートに対して構築する前に、常にターゲットノードの`/openapi.json`ドキュメントを確認してください。可用性はノードのビルドおよびネットワークプロファイルによって異なります。

## ノードソフトウェアランタイム {#node-runtime}

Torii の進行中の RAM-LFE ソフトウェアランタイムは、`torii.ram_lfe.programs[*]`の下で構成され、`program_id`によってキー化されます。構成された各プログラムは、チェーン上のポリシー暗号コミットメント値と一致する必要があります。プロトコル結果記録を評価および証明するために必要なソフトウェアランタイム素材を提供します。識別子ルートはこの同じソフトウェアランタイムを再利用します。別の識別子リゾルバ構成サーフェスは必要ありません。

ポリシーをオンチェーンで登録するだけでは十分ではありません。ターゲットノードは、ルートファミリーを公開し、実行が期待されるプログラム用のソフトウェア実行環境も一致している必要があります。

## 運用ガードレール {#operational-guardrails}

- 登録ポリシーが無効になっています。公開メタデータを確認してから、有効化してください。
- 評価者の秘密、リゾルバの署名鍵、および BFV の秘密資料を、ドキュメント、ログ、トランザクション、クライアントバンドルに含めないようにしてください。
- アカウントのエイリアス、取引のメタデータ、イベント、またはワールドステートのフィールドに生の識別子を使用しないでください。
- SDK が検証器を提供する場合、高レベルの指示を送信する前に、クライアント側でプロトコル結果を確認してください。
- 期限切れフィールドを使用して、古いプロトコル結果の記録が永遠に有効にならないようにします。
- 新しいプログラムや識別子ポリシーを登録し、クライアントを移行し、新しいプロトコル結果レコードが流れ始めたら古いポリシーを無効化することでローテーションします。

## 関連するトピック {#related-topics}

- [プライベートデータスペースのスポンサー料金](/ja/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md#app-and-sora-route-families)
- [匿名取引](/ja/blockchain/anonymous-transactions.md)
