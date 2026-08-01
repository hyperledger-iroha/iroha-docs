---
translation_locale: ja
translation_source: /blockchain/ram-lfe.md
translation_source_hash: 69c4dc0e01539f3ab1ffffaf9aee4859a7cdd507c42f78e6f10237678ac0b43f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# RAM-LFE {#ram-lfe}

RAM-LFE はランダムアクセスマシンラコニック関数評価を表します. Iroha では,公的方針がチェーン上のプログラムのための一般的な隠された関数層ですが,評価者論理,秘密または原始入力が世界状態に書き込まなくてもよい.SORA Nexus 識別子フロー,例えばプライベート電話または電子メール検索によって使用され,ノードプロフィールによりアプリ面の経路が有効になった場合,一般的な Torii プログラム実行支援者としても利用される.

チェーンはポリシーコミットメントと領収検証メタデータを保存します.Reserverまたは Torii ランタイムは,隠されたプログラムを評価し,許容される輸出のみを返して,クライアントやサポートツール,レジャー指示が登録したポリシーに対して確認できる領収書を添付します.

## 名前付け {#naming}

名称の分割は問題です

|期間|意味|
| --- | --- |
|`ram_lfe`|外部隠された機能抽象:プログラムポリシー,コミットメント,実行領収書,領収書の確認モード. |
|`BFV`|暗号化された入力 RAM-LFE バックエンドで使用する Brakerski/Fan-Vercauteren 同形暗号化計画. |
|`ram_fhe_profile`|BFV - プログラムされた暗号化された実行マシンに関する特定メタデータ.これは RAM-LFE の2番目の名前ではありません. |

データモデルでは, `RamLfeProgramPolicy` と `RamLfeExecutionReceipt` は RAM-LFE タイプである. BFV パラメータ,暗号文字封筒,および隠された RAM-FHE プログラムプロファイルはポリシーで使用される暗号化された実行バックエンドに属します.

## 記録 する こと {#what-it-records}

RAM-LFE プログラム方針は,世界的に `program_id` によって登録されています.このポリシーには以下が含まれています:

- ポリシーを有効にしたり,無効にしたり,または他の方法で変異させることができる所有者アカウント
- 顧客に広告されたバックエンド
- `signed`または `proof`の領収確認モード
- 隠されたプログラムメタデータと評価者の秘密へのコミットメント
- 署名された領収書の公開鍵
- BFV パラメータや `ram_fhe_profile`などのオプションの公開暗号化された入力メタデータ
- `active`の旗で,ポリシーが新しい領収を発行できるかどうかを制御する.

隠された秘密,直文識別子値,および隠れたプログラムボディは世界状態に保存されません.クライアントはコミットメント,不透明なハッシュ,領収書ハッシュ,暗号文字,プログラムの消化を不透明のプロトコル値として扱うべきです.

## バックエンド {#backends}

現在の RAM-LFE サポートは,3つのバックエンド識別子に焦点を当てています.

|バックエンド|使用する|
| --- | --- |
|`hkdf-sha3-512-prf-v1`| コミットメントを拘束する PRF 評価 |
|`bfv-affine-sha3-256-v1`|BFV 暗号化された識別子スロットの秘密アファイン評価がサポートされています. |
|`bfv-programmed-sha3-256-v1`|BFV がサポートする 暗号化されたレジスタやメモリ経路でプログラムされた実行です.|

BFV バックエンドは重要な近代的なパスです. ウォレットがローカルに標準化された入力を暗号化させ,解析者がトランザクションで公開識別子を見ずに評価できるようにします.そして出力ハッシュを登録されたプログラムポリシーに結合する領収書を返します.

## 数学 {#math}

このセクションでは,現在の RAM-LFE コードで使用される実装レベルの代数を記述します.これはセキュリティ証明ではありません.それはポリシー,領収,クライアントが合意しなければならない決定的なトランスクリプトと暗号化された評価モデルです.

### 記号 {#notation}

放っておく

- \(H(m)\) は Iroha `Hash::new(m)`:Blake2b-32 を `m` において,最終バイトの最小値が `1` に強制される.
- \(N(x)\) は `x` のカノニカルな Norito コードである.
- \(a \parallel b\) はバイト文字列の連鎖を意味する.
- \(\ operatorname{le64}(i) \) は未記号整数の8バイトの小エンディアンコードである.
- \(s\) 世界外国の秘密の解決者になる
- \(P\)は公共政策のパラメータである.
- \(A\) に関連するデータを要求します.
- \(x\) は標準化された入力バイトまたは Norito 暗号化された入力封筒であり,バックエンドによって異なります.

RAM-LFE はドメインによって分離されたハッシュを使用します.下記の公式は,目的に応じてドメインを命名します.その現在のバイト文字列は:

|シンボル|ドメインの文字列|
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

### 政策のコミットメント {#policy-commitment}

政策のコミットメントは,公開パラメータと隠された解決機密をバックエンドに結びつける. まず,秘密は別々にコミットされる:

$$
C_s = H(D_{\mathrm{secret}} \parallel s)
$$

その後,ポリシーの完全なトランスクリプトが暗号化されます:

$$
T_{\mathrm{policy}} = N(\mathrm{backend}, P, C_s)
$$

そして公開されたポリシーハッシュは:

$$
\mathrm{policy\_hash} =
H(D_{\mathrm{policy}} \parallel T_{\mathrm{policy}})
$$

チェーン上の `PolicyCommitment` は:

$$
(\mathrm{backend}, \mathrm{policy\_hash}, P)
$$

評価は実行時間の秘密から同じ値を再計算します 再計算されたハッシュが異なる場合,評価はコミットメント不一致で失敗します.

### HKDF-SHA3-512 バックエンド {#hkdf-sha3-512-backend}

`hkdf-sha3-512-prf-v1` に対して,輸出は標準化された入力そのものであるが,不透明な識別子と領収書ハッシュは秘密結合した PRF 輸出である.

要求のレコーディングは:

$$
T_{\mathrm{req}} =
N(\mathrm{policy\_hash}, P, A, x)
$$

HKDF 塩とシュードランダムキーとは:

$$
\mathrm{salt} = D_{\mathrm{salt}} \parallel \mathrm{policy\_hash}
$$

$$
\mathrm{PRK} = \operatorname{HKDF\text{-}Extract}_{\mathrm{SHA3\text{-}512}}
(\mathrm{salt}, s)
$$

不透明な材料は拡張され,ハッシュされます.

$$
m_o =
\operatorname{HKDF\text{-}Expand}_{\mathrm{SHA3\text{-}512}}
(\mathrm{PRK}, D_{\mathrm{hkdf\_opaque}} \parallel T_{\mathrm{req}}, 32)
$$

$$
\mathrm{opaque\_id} =
H(D_{\mathrm{opaque}} \parallel m_o)
$$

領収書の材料は,不透明なIDをさらに結合します.

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

バックエンドは:

$$
(\mathrm{output}, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
= (x, \mathrm{opaque\_id}, \mathrm{receipt\_hash})
$$

### BFV パーマー {#bfv-primer}

BFV は格子ベースの同形暗号化計画である. "同形"とは,プログラムが加密された値を追加し,倍増することができ,解読後,素文字の値に添加と倍増を行った場合と同じ結果が得られるという意味です.

RAM-LFE に対して, BFV は暗号化された入力メカニズムとして使用されます.

1. 財布は電話番号やメールアドレスなどのプライベート値を標準化する.
2. 財布はバイトを小さな整数スロットに変換します
3. 各スロットは,解析器の公钥 BFV で暗号化されます.
4. 暗号文字で隠されたプログラムを解析する.
5. 実行時間は隠されたプログラム出力を解読し,サインまたは領収書を証明するだけです.

BFV 正確な整数算法であって,近似算法ではない.それゆえ識別子バイトと小さなモジュール型により適しています浮動点モデルによる推論よりも計算です Iroha 動いている BFV 暗号化された各スロットには1つのスケール値モジュールがあります. \(t\), 暗号文字自体は,はるかに大きな整数で生じる. \(q\). ギャップは \(q\) そして \(t\) 暗号化と同形操作がもたらす騒音に解読する余地を与えます.

BFV 暗号文字には2つの多項式構成要素がある.

$$
c=(c_0,c_1)
$$

秘密鍵は別の多項式 \(s_k\) です.解読には以下の要素が結合します:

$$
v = c_0 + c_1s_k
$$

暗号文字が正しく形成され,騒音がまだ小さい場合, \(v\) はスケールされた平文に近い.ラウンドは平文系数modulo \(t\) を回復します.有用な性質は,暗号文字操作によりこの構造を維持されます:

|シンプルな操作|暗号文字操作|
| --- | --- |
|\(m+n\)|暗号文字のコンポーネントを追加する.|
|\(m+\alpha\)|\(c_0\) にスケールされた平文定数を追加する. |
|\(\alpha m\)|\(\alpha\) で両暗号文字の構成要素をスケールする. |
|\(mn\)|暗号文字の多項式を倍増し 再スケールして再直線化します|

複製は高価な操作である. 2つの2つの構成要素の暗号文字の生成は,自然に \(1\), \(s_k\),および \(s_k^2\)で解読する3つの構成要素的暗号テキストを作成します.Relinearization は \(s_k^2\) 項目を通常の2つの構成要素の暗号文字に折り畳むために公開された評価キーを使用します.これは同じ暗号文字形を使用した後の追加と倍数を保持します.

BFV はまた"レベル化"される.暗号化されたすべての操作は,いくつかのノイズ予算を消費する.この実装では,その予算をリフレッシュするために暗号文字を起動しない.代わりに, RAM-LFE は小さな `ram_fhe_profile` を公開し,制限された隠れたプログラム形のみを受け入れます.これはパラメータセットのサポートされた深さの内での評価を維持します.現在のプログラミングプロフィールでは,固定レジスタ数値,固定メモリレーン数値,およびプログラムステップごとに最大で1つの暗号文字-数字テキスト倍数が可能です.

この RAM-LFE デザインでは,BFV はクライアントの入力を公的なレジーのデータから隠し,トランザクションまたはルート用荷しか見えない観察者から隠します.これはチェーンが任意の暗号化されたプログラムを自分で実行することを意味しません.Torii resolver runtime は,まだ BFV の秘密資料を所有し,設定された隠れたプログラムを評価し,許可された出力を解読し,結果を証明する.その後,レジャーは,チェーン上のポリシーコミットメントに対する認証を確認し,公開鍵または証明メタデータを解決します.

識別子用例は,意図的に単純な表現を選択します.標準化された文字列は以下のようにコードされます:

```text
[length, byte_0, byte_1, ..., byte_n, 0, 0, ...]
```

各要素は独自の BFV スカラー暗号文字として暗号化されます.その形状により,標準化と封筒認証が明示され,財布は公開パラメータから暗号化されたリクエストを作成し,解析者が相当の暗号化された入力を安定した領収書トランスクリプトにキャノニカル化することができます.

### BFV リングモデル {#bfv-ring-model}

BFV バックエンドはネガサイクリック多項式リングを使用する.

$$
R_q = \mathbb{Z}_q[X] / (X^n + 1)
$$

シンプルテキストリング:

$$
R_t = \mathbb{Z}_t[X] / (X^n + 1)
$$

その場合:

- \(n\) は `polynomial_degree`, 2 の力
- \(q\)は `ciphertext_modulus`である
- \(t\)は `plaintext_modulus`である
- \(q > t\)と \(t \mid q\)
- \(\Delta = q/t\)
- \(B = 2^{\mathrm{decomposition\_base\_log}}\)

素文字系数ベクトルは,各系数をスケールすることによってコードされます.

$$
\operatorname{EncPlain}(m)_i = \Delta m_i \bmod q
$$

解読センター-リフトは,次の各因数

$$
v = c_0 + c_1 s_k \in R_q
$$

その後, \(R_t\) に返回します.

$$
\operatorname{Dec}(c)_i =
\left\lfloor \frac{t \cdot \operatorname{center}_q(v_i)}{q}
\right\rceil \bmod t
$$

ここで \(s_k\) は BFV の秘密鍵多項式であり,外部 RAM-LFE 解析機の秘密 \(s\) でありません.

### BFV キー世代 {#bfv-key-generation}

暗号化された識別子入力では, BFV キー素材は,分辨機秘密および関連データごとに決定性がある.

$$
\sigma_{\mathrm{id}} =
H(D_{\mathrm{id\_keygen}} \parallel A \parallel s)
$$

BFV RNG は,次のように種付けます.

$$
\operatorname{ChaCha20Rng}(H(D_{\mathrm{bfv\_keygen}} \parallel \sigma_{\mathrm{id}}))
$$

キージェネレーターのサンプル:

- \(s_k \in \{-1,0,1\}^n\),表示されたモジュール \(q\)
- \(a \leftarrow R_q\) 均等
- \(e \in \{-1,0,1\}^n\)

公的な鍵は:

$$
\mathrm{pk}=(b,a),\qquad b = -a s_k - e \pmod q
$$

再線化のために, \(s_k^2\) を \(R_q\) のリング製品とする.各ベース-\(B\) 桁 \(j\) に対して,小分布から均等で \(a_j\) と \(e_j\) のサンプルを採取し,次に次のように公表する:

$$
\mathrm{rlk}_j=(b_j,a_j),\qquad
b_j = -a_j s_k - e_j + B^j s_k^2 \pmod q
$$

公開 BFV ポリシーメタデータには \(((n,q,t,B)\),公共鍵,および `max_input_bytes`が含まれます. BFV 秘密鍵と relinearization鍵は, resolverの実行時に保持されます.

### BFV 暗号化と操作 {#bfv-encryption-and-operations}

単純文字多項式 \(m\) を暗号化するには,実装は次の ChaCha20 RNG から別の種子を生成します.

$$
H(D_{\mathrm{bfv\_encrypt}} \parallel \mathrm{seed})
$$

\(u,e_1,e_2 \in \{-1,0,1\}^n\)を採取し,計算する:

$$
c_0 = b u + e_1 + \operatorname{EncPlain}(m) \pmod q
$$

$$
c_1 = a u + e_2 \pmod q
$$

暗号文字は \(c=(c_0,c_1)\).

ホモモルフな加算は,構成要素の観点から:

$$
c+d=(c_0+d_0,\ c_1+d_1)\pmod q
$$

素文字スケラー \(\alpha\) を,系数 0 の変更のみ \(c_0\) に追加する:

$$
c+\alpha = (c_0 + \Delta\alpha,\ c_1)\pmod q
$$

\(\alpha\) の平文スケーラーで倍増すると,両構成要素をスケールする.

$$
\alpha c = (\alpha c_0,\ \alpha c_1)\pmod q
$$

2つの暗号文字\(c=(c_0,c_1)\) と \(d=(d_0,d_1)\) に対して,暗号文字の倍増は最初に3サイズの暗号文字を計算し,各系数を \(t/q\) で戻します.

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

上記のすべての製品は \(R_q\) のネガサイクリックリング製品である.その後, \(\tilde c_2\) はベース-\(B\) 多項式に分解される.

$$
\tilde c_2 = \sum_j B^j u_j
$$

そして再直線化:

$$
c'_0 = \tilde c_0 + \sum_j u_j b_j \pmod q
$$

$$
c'_1 = \tilde c_1 + \sum_j u_j a_j \pmod q
$$

結果は再び2つの要素の BFV 暗号文字です.

### 識別子 暗号文字 封筒 {#identifier-ciphertext-envelope}

識別子入力バイト文字列:

$$
x=(x_0,\ldots,x_{\ell-1})
$$

スカラースロットにコードされています.

$$
m_0 = \ell
$$

$$
m_{i+1}=x_i,\qquad 0 \le i < \ell
$$

そして残りのすべてのスロットは,ゼロから `max_input_bytes + 1`までである.各スケラースロットが,系数ゼロの素文字多項式 \([m_i]\) として暗号化されます.

$$
\sigma_i =
H(D_{\mathrm{id\_slot}} \parallel \mathrm{seed} \parallel \operatorname{le64}(i))
$$

暗号化された識別子封筒は:

$$
(\operatorname{BFV.Enc}_{\mathrm{pk}}([m_0];\sigma_0),\ldots,
\operatorname{BFV.Enc}_{\mathrm{pk}}([m_M];\sigma_M))
$$

\(M=\mathrm{max\_input\_bytes}\)

### BFV アフェイン バックエンド {#bfv-affine-backend}

`bfv-affine-sha3-256-v1`では,実行時間は最初に BFV キー材料を \(s\) と \(A\) から抽出する.抽出された公共パラメータは,チェーン上でコミットした公共パラメーターと正確に一致しなければならない.

アフェイン・サーキットの種は:

$$
\sigma_{\mathrm{affine}} =
H(D_{\mathrm{affine\_circuit}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A)
$$

この種子から実行時のサンプル,modulo \(t\),32列のアファイン回路:

$$
y_j = b_j + \sum_i w_{j,i} m_i \pmod t,
\qquad 0 \le j < 32
$$

\(m_i\)が解読された識別子スロットである.同形的に,暗号文字に対して同じ値を計算する:

$$
C_j = b_j + \sum_i w_{j,i} C_i
$$

解析機は,それぞれ \(C_j\) を解読し,すべての後に続く素文字系数がゼロであることを要求し,系数-零値をバイトに変換し,次のように表す:

$$
O=(y_0,\ldots,y_{31})
$$

そして...

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

### BFV プログラミングバックエンド {#bfv-programmed-backend}

`bfv-programmed-sha3-256-v1` に対して,公共のパラメータは, BFV 識別子暗号化パラメータと隠されたプログラム消化を含みます:

$$
\mathrm{program\_digest}
= H(D_{\mathrm{program\_digest}} \parallel N(\mathrm{program}))
$$

現在の RAM-FHE プロファイルは:

|フィールド|価値|
| --- | --- |
|`profile_version`| `1` |
|`register_count`| `4` |
|`memory_lane_count`| `32` |
|`ciphertext_mul_per_step`| `1` |
|`encrypted_input_mode`|`resolver_canonicalized_envelope_v1`|
|`min_ciphertext_modulus`| \(2^{52}\) |

Torii に送信された素文入力は実行前に同じ BFV 封筒に暗号化されます.そのサーバーサイド暗号化の決定的な種は:

$$
H(
\texttt{"iroha.ram\_lfe.execute.plaintext\_bfv.v1"}
\parallel N(\mathrm{program\_id}) \parallel x
)
$$

外で提供された暗号化された入力では,解析機は識別子封筒を解読し,実行する前にこの決定的な封筒に再加密します.そのカノニ化により,セマンティック的に等しい BFV 暗号文字の間で受信ハッシュが安定している.

初期暗号化されたメモリ経路は,以下のものから得られます.

$$
\sigma_{\mathrm{mem}} =
H(D_{\mathrm{program\_memory}} \parallel s
\parallel \mathrm{policy\_hash} \parallel A
\parallel \operatorname{le64}(0))
$$

32 つのレーンのそれぞれに,実行時間サンプル \(r_j \in [0,t)\) と暗号文字 BFV の加密テキスト \(r_j\) を保存します.隠されたプログラムは,その後暗号化されたレジスタと暗号化されたメモリで実行されます.

|指示|代数|
| --- | --- |
|`LoadInput(dst, i)`|\(R_{\mathrm{dst}} \leftarrow C_i\)|
|`LoadState(dst, j)`|\(R_{\mathrm{dst}} \leftarrow S_j\)|
|`StoreState(j, src)`|\(S_j \leftarrow R_{\mathrm{src}}\)|
|`LoadConst(dst, a)`|\(R_{\mathrm{dst}} \leftarrow \operatorname{Enc}(a) \) |
|`Add(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_a + R_b\)|
|`AddPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} + a\)|
|`SubPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow R_{\mathrm{src}} - a\)|
|`MulPlain(dst, src, a)`|\(R_{\mathrm{dst}} \leftarrow aR_{\mathrm{src}}\)|
|`Mul(dst, a, b)`|\(R_{\mathrm{dst}} \leftarrow R_aR_b\),そして再直線化する|
|`SelectEqZero(dst, cond, z, nz)`|暗号解読 \(R_{\mathrm{cond}}\);ゼロで \(R_z\) を選択する,否なら \(R_{nz}\). |
|`Output(src)`|出力レジスタリストに \(R_{\mathrm{src}}\) を追加する. |

指示テープが完成した後,解析機は各出力レジスタを解読し, 0 の系数をバイトに変換し,それらのバイトを連鎖する.

$$
O = \operatorname{bytes}(\operatorname{Dec}(R_{o_0})_0,\ldots,
\operatorname{Dec}(R_{o_k})_0)
$$

一般的なプログラムされたバックエンドハッシュは:

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

デフォルトプログラムされた識別テープには64つの入力スロットがあります.各スロット \(i\) に対して,入力スロットをロードし,メモリレーン \(i \bmod 32\) をロードし,それらを追加し,結果を出力します:

$$
R_0 \leftarrow C_i,\qquad
R_1 \leftarrow S_{i\bmod 32},\qquad
R_2 \leftarrow R_0 + R_1,\qquad
\operatorname{Output}(R_2)
$$

### 輸出ハッシュと領収 {#output-hashes-and-receipts}

一般的な RAM-LFE 実行領収書では,原始出力が署名されません. 出力ハッシュをサインします:

$$
\mathrm{output\_hash} =
H(D_{\mathrm{output}} \parallel O)
$$

Torii RAM-LFE 実行領収書については,関連するデータは,カノニカルプログラム識別子バイトである:

$$
A = N(\mathrm{program\_id})
$$

$$
\mathrm{associated\_data\_hash}=H(A)
$$

署名された領収書用荷は:

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

`signed`モードでは:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(R))
$$

検証は `resolver_public_key` で署名を確認し,これらのすべての等価が該当しない限り,領収書を拒否する.

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

呼び出し者が `output_hex` を提供する場合は,検証者はまた:

$$
H(D_{\mathrm{output}} \parallel \operatorname{bytes}(\mathrm{output\_hex}))
= R.\mathrm{output\_hash}
$$

`proof`モードでは,証明書には署名ではなく証拠封筒が含まれます.検証は,証明バックエンド,回路ID,公開入力スキーマハッシュ,確認鍵ハッシュ,および公開インスタンスの証明証明書の認証メタデータと暗号化された領収・ペイロードハッシュに一致していることをチェックします.

$$
h_R = H(N(R)) = (h_0,\ldots,h_{31})
$$

予想される公開インスタンスは4つの1要素の列である. \(j\) の列には\(h_{8j}\ldots h_{8j+7}\) のバイトがあり,その後は24 のゼロ・バイトがあります.

$$
\mathrm{instance}_j =
h_{8j}\parallel\cdots\parallel h_{8j+7}\parallel 0^{24},
\qquad 0 \le j < 4
$$

### 識別子 プロジェクション {#identifier-projection}

識別子解像度は,通用バックエンド `opaque_hash` をユーザ面の不透明なアカウント識別子として使用しない. RAM-LFE 出力ハッシュを識別子特有のドメインでプロジェクタする:

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

`IdentifierResolutionReceipt`は,より高いレベルの役に立たない負荷に署名する.

$$
I =
(\mathrm{policy\_id},
R,
\mathrm{opaque\_id}_{\mathrm{id}},
\mathrm{receipt\_hash}_{\mathrm{id}},
\mathrm{uaid},
\mathrm{account\_id})
$$

署名された識別証明書の領収書:

$$
\mathrm{attestation} =
\operatorname{Sign}_{\mathrm{resolver}}(N(I))
$$

`ClaimIdentifier`は,署名または証明が有効である場合のみ,埋め込まれた RAM-LFE 実行用荷が参照されたプログラムポリシーに一致し, `uaid`と `account_id`が要求される拘束力がある場合にのみ領収を受け取ります.

## 実行流 {#execution-flow}

一般的な RAM-LFE の実行は,次の形をとる.

1. 管理者または事業者の登録 `RamLfeProgramPolicy`.
2. オーナーがポリシーを有効にする
3. 顧客は Torii から公共政策のメタデータを読み取ります.
4. クライアントは,解決器にちょうど1つの入力フォームを提出します. 素文 `input_hex` または暗号化された BFV 入力封筒です.
5. 実行時間は隠されたプログラムを評価し,返却します `output_hex`, `output_hash`, `opaque_hash`, `receipt_hash`, と a `RamLfeExecutionReceipt`.
6. クライアントまたはバックエンドは,発行されたポリシーに対して領収を検証し,返還した `output_hex` が領収の `output_hash` にハッシュされているかどうかを選択的に確認します.
7. `ClaimIdentifier`のようなより高いレベルの指示は,原始入力を埋め込む代わりに証明された領収書を組み込みることができる.

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

## 識別子政策 {#identifier-policies}

識別策は RAM-LFE の具体的な使用である.彼らは一般的なプログラムポリシーにビジネス名空と標準化規則を追加します:

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

識別層は, RAM-LFE 領収書を使用して:

- `policy_id`
- 隠された関数による不透明な識別子
- 決定的な値 `receipt_hash`
- 口座は UAID
- `account_id`
- 汎用式 RAM-LFE 実行用荷

ユーザー向けオンボードでは,個人識別子とは別々のアカウント・アライアスを保持します. アライアスは公共の名前です.電話番号,電子メールアドレス,および類似した値は識別子ポリシーと領収書を通して流出する必要があります.

## Torii 経路 {#torii-routes}

アップ面のルートファミリーが有効になった場合, Torii は RAM-LFE および識別補助者を暴露する.

|経路|目的|
| --- | --- |
|`GET /v1/ram-lfe/program-policies`|RAM-LFE プログラムポリシーおよび公開実行メタデータをリストする.|
|`POST /v1/ram-lfe/programs/{program_id}/execute`|`input_hex`または `encrypted_input`から1つのプログラムを実行し,出力ハッシュと無国籍領収書を返します.|
|`POST /v1/ram-lfe/receipts/verify`|公開されたポリシーに対して `RamLfeExecutionReceipt` を検証し,選択的に `output_hex` と `output_hash` を比較する. |
|`GET /v1/identifier-policies`|識別子ポリシー,標準化モード,解決鍵,暗号化された入力メタデータをリストします. |
|`POST /v1/accounts/{account_id}/identifiers/claim-receipt`|利用者が `ClaimIdentifier` に埋め込むことができる領収書を発行する.|
|`POST /v1/identifiers/resolve`|アクティブクレームが存在する場合,結束されたアカウントに標準化識別子入力を解決する. |
|`GET /v1/identifiers/receipts/{receipt_hash}`|監査およびサポートツールのための受付ハッシュを使用して持続的な識別子請求を検索します. |

`/openapi` または `/openapi.json` ドキュメントは,これらのルートに対して構築する前に常にチェックします.利用可能性はノードビルドとネットワークプロフィールに依存します.

## ノード実行時間 {#node-runtime}

Torii 進行中です RAM-LFE 実行時間は以下に設定されます. `torii.ram_lfe.programs[*]`, キー付き `program_id`. 各構成されたプログラムは,オンチェーン政策のコミットメントと一致し,評価および実行時に必要な資料を提供しなければならない. ID路は同じ実行時間を再利用し,個別のID-resolver設定表を必要としない.

ネットワーク上のポリシーを登録するだけでは不十分です.ターゲットノードはルートファミリーも暴露し,実行される予定のプログラムに一致するランタイム資料を持つ必要があります.

## オペレーショナル・ガードレイル {#operational-guardrails}

- 公開されたメタデータを確認し,それを有効にします.
- 文書,ログ,トランザクション,クライアントバンドから隠された評価者の秘密, リズルバーサインキー,そして BFV の秘密資料を保持します
- アカウント・アライス,トランザクション・メタデータ,イベント,または世界状態のフィールドに原始識別子を入れない.
- SDK が検証者を暴露する際に,より高いレベルの指示を提出する前にクライアント側から領収書を確認します.
- 時代遅れの領収書が永久に有効であるはずがない時,期限切れ欄を使用.
- 新しいプログラムまたは識別子ポリシーを登録し,クライアントを移行し,新しい領収が流れると古いポリシーを無効にします.

## 関連話題 {#related-topics}

- [プライベートデータスペースのスポンサー料金は](/ja/get-started/private-dataspace-fee-sponsor.md#_4-register-phone-and-email-privately-with-fhe)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md#app-and-sora-route-families)
- [匿名取引](/ja/blockchain/anonymous-transactions.md)
