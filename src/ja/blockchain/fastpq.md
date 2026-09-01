---
translation_locale: ja
translation_source: /blockchain/fastpq.md
translation_source_hash: d8dd61390f5df3dae09b70399e04e8f71716a912ef5dea9010feaf60573ed261
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# FastPQ {#fastpq}

FastPQ は、選択された実行効果に対する Iroha の STARK 証明パスです。これは通常のトランザクション実行やコンセンサスを置き換えるものではありません。トランザクションは依然として通常どおり ISI、IVM、および Sumeragi を実行してください；FastPQ は決定論的実行証人を消費し、サポートされている効果を証明バッチに変換します。

現在のホスト統合には、主に3つの方法があります：

- ブロック実行中に記録された透明な数値資産の移転
- Nexus 検証済み実行レーンリレーで、AXT 証明データコンテナが FastPQ バインディングを保持しているもの
- SCCP オープン検証データコンテナ内で FastPQ 証明をラップする透明なメッセージ証明ヘルパー

## 証人移送経路 {#transfer-witness-path}

透過的な数値の転送は、指示が残高を変動させるときに構造化された転送記録を作成します。この記録には以下が記録されます:

- 送金元アカウント、送金先アカウント、資産の定義、そして金額
- 送信者と受信者の残高、送金前と送金後
- バッチ暗号ハッシュとして使用されるトランザクションエントリーポイント暗号ハッシュ
- 提出するアカウントから派生した認可プリンシパルの暗号学的ダイジェスト値
- 単一デルタ転写のためのポセイドン暗号ダイジェスト値

バッチ転送は、複数のデルタを含む1つのトランスクリプトを使用します。その場合、単一デルタのPoseidon暗号ダイジェスト値は存在しません。

ブロックの確定時に、Iroha はこれらのトランスクリプトをエントリポイントの暗号ハッシュごとにグループ化します。その後、実行の証人は、元のトランスクリプトバンドルと、証明者用に準備された FastPQ トランジションバッチの両方を保持します。

各転送デルタは2つの遷移行になります:

|行|鍵の形|事前設定値| ポストバリュー |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|送信者デビット| `asset/<asset-definition>/<source-account>`      |送信者の残高（前）|送信者の残高あと|
|受取人の信用| `asset/<asset-definition>/<destination-account>` |受信者の残高前|受信者の残高後|

数値は整数の証人単位に正規化されます。選択された小数スケールで非負の `u64` として表現できない場合、FastPQ バッチ処理のためにその値は拒否されます。

## 公開入力 {#public-inputs}

すべての FastPQ トランジションバッチには、証明をブロックおよび実行コンテキストに結びつける公開入力が含まれています:

|入力|意味|
| ------------- | --------------------------------------------------------------- |
|`dsid`|リトルエンディアンバイトとしてエンコードされたデータスペース識別子|
| `slot`        |ブロック作成時間をナノ秒に変換|
| `old_root`    |実行証明から派生した親状態ルート|
| `new_root`    |実行証明から導出された後状態ルート|
| `perm_root`   |アクティブな役割の権限に対するポセイドン暗号コミットメント値|
| `tx_set_hash` |ソートされたトランザクションおよび時間トリガーエントリーポイントの暗号ハッシュに対する暗号ハッシュ|

ホストは、これらのバッチの標準パラメータセットとして`fastpq-lane-balanced`を使用します。

## 数理モデル {#mathematical-model}

このセクションでは、現在の Rust 証明者および検証者によって実装されている算術について説明します。以下のすべての体演算は、ゴルディロックス素数体上で行われます:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ は `F` よりもフィールド暗号化コミットメント値のために Poseidon2 を使用します。スポンジの幅は `t = 3`、レートは `r = 2`、容量は `1` です。暗号ハッシュはフィールド要素をレート 2 ブロックで吸収し、最終的な置換の前に単一のフィールド要素 `1` を追加します:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

バイト列は7バイトのリトルエンディアン肢にパックされるため、各肢は厳密に `p` 未満です:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

ドメイン分離フィールドの暗号ハッシュは次のように表されます：

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

バイト領域の暗号化ダイジェストから始まる暗号ハッシュについて、FastPQ は最初の8バイトのリトルエンディアンをフィールドにマッピングします:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

ここで `Hash` は、明示的に Poseidon2 または SHA-256 が名前で指定されていない限り、32バイトの Blake2bVar 暗号ダイジェスト値である Iroha の `iroha_crypto::Hash::new` を意味します。

### 体算術 {#field-arithmetic}

Rust コードはフィールド要素を `[0,p)` 内の正規の `u64` 値として表します。加算と減算は次の通りです：

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

乗算はまず128ビットの積を計算します:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

ゴルディロックス削減は次の恒等式を使用します:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

もし：

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

その後、リデューサーは次を計算します:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

実装は、結果が正規形になるまで条件付きで `p` を加算または減算します。残高の差分などの符号付き整数は、次のように埋め込まれます:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### ポセイドン2 パーミュテーション {#poseidon2-permutation}

Poseidon2 のパーミュテーション状態は次の通りです:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

そのSボックスは次の通りです:

$$
S(x)=x^5
$$

FastPQ は、4回の完全ラウンド、57回の部分ラウンド、その後さらに4回の完全ラウンドを使用します。`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` のラウンド定数を用いた完全ラウンドは次の通りです:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

一部のラウンドは次の通りです：

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

すべての加算および乗算は `F` 内で行われます。正準 MDS 行列は次の通りです：

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

フィールド暗号ハッシュはゼロ状態から始まります。各完全なレート2ブロック `(u,v)` に対して:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最後のブロックは、最後の置換の前に`1`のパディング要素を追加します。出力は`x_0`です。

### パブリック入力バインディング {#public-input-binding}

ホストは16バイトフィールドの最初の8バイト（リトルエンディアン）にその`u64`の値を書き込むことで、データスペースIDをエンコードします:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

ブロック作成時間はミリ秒からナノ秒に変換されます：

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

取引セットの暗号ハッシュは、ソートされたエントリーポイント暗号ハッシュに対するバイト領域の暗号ハッシュです:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i` はソート済みのトランザクションおよび時間トリガーされたエントリーポイントの暗号ハッシュです。証明の公開 IO において、`perm_root` または `tx_set_hash` がすべてゼロの場合、証明者はフォールバック値を入力します。

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

### 数値の正規化 {#numeric-normalization}

各トランスファーデルタについて、対象の小数スケールは、金額および両方の残高データスナップショットに跨る最大のトリムされたスケールです：

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

`m`の仮数と`q`のスケールを持つ`Numeric`値は、`m >= 0`および`q <= s`の場合にのみ受け入れられます。その FastPQ の証人値は次のとおりです:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

正規化された結果は `u64` に収まる必要があります。

### 標準順序 {#canonical-ordering}

トレースの作成前に、バッチは遷移キー、操作ランク、および元の挿入インデックスでソートされます：

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

順序付け暗号コミットメント値は、ドメイン `fastpq:v1:ordering` とソートされた遷移の Norito エンコーディングに対する Poseidon2 フィールド暗号ハッシュです:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

ここで、`P`は7バイトのパッキング、`E`は Norito エンコーディング、`D_o`は`fastpq:v1:ordering`、そして`T*`はソートされた遷移リストです。

### 伝達方程式 {#transfer-equations}

転送金額 `a`、送信者残高 `f`、受信者残高 `t` の場合、FastPQ はトレースを構築する前に正規化されたウィットネス値を検証します。

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

その後、遷移行は次をエンコードします:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

トレース内で、符号付きデルタは `F` に縮小されます:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

オプションの単一デルタ転送暗号ダイジェスト値が、エンコードされた転送プレイメージを最終化します：

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

マルチデルタ転送のトランスクリプトでは、現在の形式ではこのトップレベルの暗号ダイジェスト値が存在しないことが要求されます。

転送記録のホスト認証プリンシパル暗号ダイジェスト値は次の通りです：

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### トレース行 {#trace-rows}

ソートされた遷移リストには `n` の実際の行を含めます。トレースの長さは次の2の累乗です:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

行 `0..n-1` はアクティブです；行 `n..N-1` はパディング行です。各実際の行には、1つの操作セレクターが設定されています：

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

すべてのセレクタ列はブール値です:

$$
s(s-1)=0
$$

権限検索の行は、まさにロール付与行とロール取り消し行です：

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

数値操作の行の場合:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

ビルダーはまた、実行中の各アセットごとのデルタも追跡します:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

供給カウンターを更新するのは、発行と破棄の行のみです：

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

メタデータおよびデータスペーストレース列は、行の具現化前に導出されたフィールド暗号ハッシュです:

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

メタデータの暗号ハッシュ、データスペースの暗号ハッシュ、およびスロットは、隣接するトレース行間で安定しています:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### Merkle カラムを転送 {#transfer-merkle-columns}

転送行は32レベルのスパースMerkleパスを保持します。ホスト証明が欠落している場合、証明者は行キー、事前残高、および行が送信者側か受信者側かに基づいて決定論的なパスを合成します。

合成経路の場合、フレーバー塩は送信者行で`fastpq:smt:from`、受信者行で`fastpq:smt:to`です:

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

合成葉と内部ノードは次の通りです:

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

このトレースは、各レベルでビット `b_l`、兄弟 `s_l`、入力ノード `x_l`、および出力ノード `x_{l+1}` を記録します。コードの分岐規則では：

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### アクセス許可の暗号ハッシュ {#permission-hashes}

役割の付与および剥奪行は、権限の証人を暗号化ハッシュ化する:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

ホスト権限テーブルのルートは、エントリをロールバイト、権限バイト、エポックバイトで並べ替えた後、Poseidon2 マークルツリーを構築します:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

奇数幅のレベルは最後の要素を複製します。

### 暗号コミットメント値を追跡する {#trace-commitment}

各トレース列 `c`、FastPQ について、まずトレース領域にわたって列の値を補間し、係数ベクトルを暗号的ハッシュします:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

トレースルートは、列の暗号コミットメント値に対するPoseidon2メルクルルートです。

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

最終のトレース暗号コミットメント値は、ドメイン、パラメータセット、トレース形状、カラム暗号ダイジェスト、およびトレースルートに対するバイト単位の暗号ハッシュです:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c` は `fastpq:v1:trace_commitment` です。

### AIR 作文 {#air-composition}

V1 AIR の組成値は、行単位の残差の線形結合です。転写は2つのチャレンジをサンプリングします：

$$
\alpha_0,\alpha_1 \in F
$$

隣接する各行ペア `(i,i+1)` について、証明者は次を計算します:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

残基 `rho` は、コード順に次の通りです：

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

数値の列を持つ行の場合:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

そして安定したバッチコンテキスト列の場合:

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

検証者は、サンプリングされた行のオープニングに対して `A_i` を再計算し、それを AIR 組成メルクルルートの下で暗号的に結合された組成値と照合します。

### 商品を検索 {#lookup-product}

権限照会アキュムレータは、フィアット・シャミールのチャレンジ `gamma` を使用します。`s_perm` および `perm_hash` の低次数拡張評価に渡って、実行中の積は次の通りです:

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

証拠には次のように記録されている：

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 低次拡張 {#low-degree-extension}

`omega_T` をトレースドメインの生成元、`omega_E` を評価ドメインの生成元、`g` を構成されたコセットオフセットとする。値が `v_i` のトレース列に対して、補間は次のような係数 `a_j` を生成する:

$$
f(\omega_T^i)=v_i
$$

低次拡張は、コセット上で同じ多項式を評価します：

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

実装では、これを FFT の前に係数をコセットオフセットのべき乗で乗算することによって計算します:

$$
a'_j = a_j g^j
$$

そして評価ドメインで`a'`を評価します。

CPU FFT は、ビット反転入力に対する反復ラディックス2のクーリ―・テュキー変換です。ステージ長さ`L`、半分の長さ`H=L/2`、およびステージルート：

$$
\omega_L=\omega^{N/L}
$$

それぞれの蝶は計算する:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

逆 FFT は `omega^{-1}` で同じ変換を実行し、逆のドメインサイズでスケーリングします:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

カタログのルートは使用前に検証されます:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

カタログのルートから派生した小さなドメインの場合、ジェネレーターは次の通りです:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### 行と葉の暗号ハッシュ {#row-and-leaf-hashes}

LDE の後、FastPQ はすべての LDE 列にわたって各行の暗号ハッシュを計算します。`m`列の場合：

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

もし行の暗号ハッシュが評価ドメインではなくトレースドメイン上にある場合、証明者は同じコセット LDE のプロセスを使って、その単一の行ハッシュ列を補間し拡張します。

### マークルオープニング {#merkle-openings}

LDE の値は、次の塊にまとめられます:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

各チャンクの葉は:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

マークル親ノードは次の通りです：

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

奇数レベルは最後のノードを複製します。クエリパスは、各レベルでクエリのリーフのインデックスの偶奇に従って左または右をハッシュすることで検証されます。

インデックス`i`のリーフに対して、パス`(s_0,\ldots,s_{d-1})`は次の再帰によってルート`R`に対して検証されます:

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

チェックは次の場合にのみ通ります:

$$
y_d=R
$$

AIR トレース行のリーフは次のとおりです:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR 構成葉は次の通りです:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE クエリのオープンは、評価インデックス `i` で開かれた値が認証済みチャンクに存在することも確認します:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI 折りたたみ {#fri-folding}

FRI は AIR の構成評価に暗号学的に結びつけられます。各ラウンド `l` では、トランスクリプトがチャレンジ `beta_l` をサンプリングします。レイヤーは、最後の値を繰り返すことでアリティの倍数にパディングされます。各アリティサイズのグループは次のように折りたたまれます:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

どこ `a` です FRI 項数。検証者は、サンプリングされた各クエリチェーンについて、次のことを確認します：

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

そして、開かれた各 FRI グループを対応する FRI レイヤーのルートに対して認証します。

### フィアット・シャミールの記録 {#fiat-shamir-transcript}

標準的なパラメータカタログは、トランスクリプトの暗号ハッシュを SHA3-256 としてラベル付けしています。現在の証明者および検証者の実装では、チャレンジバイトを`iroha_crypto::Hash::new`で導出しており、これは32バイトのBlake2bVar暗号ダイジェスト値です。それから最初の8バイトのリトルエンディアンを `F` に縮小します:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

チャレンジ技術的呼び出しは、トランスクリプト状態に完全な暗号ダイジェスト値を追加します。リプレイの順序は次の通りです:

1. 公開 IO、プロトコルバージョン、パラメータバージョン、およびパラメータ名
2. LDE ルートと平方根
3. `gamma`
4. AIR の構成上の課題 `alpha_0`, `alpha_1`
5. AIR トレースルートと AIR コンポジションルート
6. 総積を調べる
7. FRI 層の根と `beta_l` の課題
8. サンプル化されたクエリのインデックス

クエリサンプリングは、要求された数の一意のインデックスが得られるまで、32バイトのチャレンジ暗号ダイジェストを引き続け、リトルエンディアンの `u64` チャンクとして読み取ります:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

サンプリングされたセットは、ソートされた順序で返されます。

### 検証者リプレイ {#verifier-replay}

検証者はまず、バッチの暗号化コミットメント値を再計算します：

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

そして必要とする:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

また、公共の IO も再建します：

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

すべてのフィールドは、証明の公開 IO とバイト単位で一致しなければなりません。検証者はその後、同じトランスクリプトを再構築し、同じものを導出します:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

各サンプリングされたクエリ `q` について、次を確認します:

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

そして：

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

その AIR 作曲の開始は認証されなければなりません `R_air_composition`. その FRI チェーンは同じところから始まります `A_q` そして認証された最終版で終わらなければなりません FRI 端末の下の葉 FRI ルート。

## 証明者が確認するもの {#what-the-prover-checks}

トレースを構築する前に、FastPQ プルーファーはバッチ順序を遷移キー、操作ランク、および挿入順で正規化します。転送行もトランスクリプトのメタデータを必要とします。転送行はあるが転送トランスクリプトがないバッチは無効です。

単位移行の成績証明書について、証明側の確認項目は以下の通りです:

- 送信者の残高はアンダーフローしてはいけません
- `sender_after` は `sender_before - amount` と等しくなければなりません
- `receiver_after` は `receiver_before + amount` と等しくなければなりません
- トランスクリプトは、バッチ内のすべての転送行を網羅する必要があります
- 単一デルタのポセイドン暗号ダイジェスト値が存在する場合、それは記録のプレイメージと一致しなければなりません
- 提供されたスパースメルクル証明はバージョン1としてデコードされなければならない；欠落しているパスは決定論的な合成証明で補完される

トレースには、転送、発行、破棄、役割付与、役割剥奪、メタデータ設定、権限検索行のためのセレクタ列が含まれています。数値操作行も符号付きデルタ、資産ごとの累積デルタ、および供給カウンターを持っています。

## プロバー実行レーン {#prover-lane}

`iroha3d` は、証明バックエンドを初期化できる場合、起動時に FastPQ 証明者実行レーンを開始します。実行レーンは、上限付きキューを持つバックグラウンドタスクです。ブロックが実行ウィットネスを生成した後、コンセンサスの確定経路は、ブロックの暗号ハッシュ、高さ、ビュー、およびウィットネスを含むプロバージョブを提出します。

実行レーンが稼働していない場合やキューが満杯の場合、ジョブはスキップされ、通常のブロック処理が続行されます。これは、バックグラウンドのプルーフ実行レーンがトランザクションの受け入れやコンセンサスゲートではないことを意味します。それは、すでに実行された状態に対するプルーフ生成パスです。

実行レーンは次の要素でプルーフ作成者を構築します:

```text
parameter = "fastpq-lane-balanced"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

両方の設定はデフォルトで`cpu`になっています。`gpu`を選択することは明示的なフェイルクローズ要求です: もし GPU のサポートがコンパイルされていない場合、または要求された GPU バックエンドがプリフライトに失敗すると、証明者の実行レーンは無効のままになります。最初のリリースには `auto` の値がなく、要求された GPU モードから CPU にフォールバックしません。

## 確認 {#verification}

FastPQ 証明検証は、標準的なバッチ暗号コミットメント値を再構築し、公開トランスクリプトを再生します。検証者はプロトコルのバージョンを確認します。パラメータセットのバージョン、リプレイ制限、暗号化コミットメント値の追跡、公開入力、サンプリングされたメルクルオープニング、AIR オープニング、および FRI クエリチェーン。

デフォルトのリプレイ制限には以下が含まれます:

|制限|デフォルト|
| ------------------ | ------: |
|遷移行|     256 |
|バッチペイロードサイズ|256 KiB|
| FRI レイヤー|      16 |
|求人情報の照会|     128 |

## Nexus 確認済みリレー {#nexus-verified-relays}

Nexus AXT 証明データコンテナは `AxtFastpqBinding` を埋め込むことができます。`RegisterVerifiedLaneRelay` が実行されると、Iroha:

1. 実行レーンリレーデータコンテナおよび FastPQ 証明資料を検証します
2. データスペースと技術マニフェストのルートをチェックする
3. AXT 証明データコンテナをデコードします
4. には`fastpq_binding`が必要です
5. そのバインディングから FastPQ バッチを再構築します
6. 埋め込まれた FastPQ 証明をデコードする
7. 再構築されたバッチと証明に対して FastPQ 検証器を呼び出します

検証が成功した場合、Iroha はリレー参照、元のデータコンテナ、証明ペイロードの暗号ハッシュ、検証高さ、技術マニフェストルート、および FastPQ バインディングを含む `VerifiedLaneRelayRecord` を保存します。

実行レーンのリレーデータコンテナには、コンパクトな FastPQ 証拠資料も含まれます。この資料は、実行レーンID、データスペースID、ブロック高、検証高に対する暗号学的ダイジェスト値です。ブロックヘッダーの暗号化ハッシュ、金融取引決済の暗号化ハッシュ、および技術的マニフェストルート。リレーは、QC および有効な FastPQ 証明資料の両方を持っている場合にのみマージ可能です。

### AXT バインディング数学 {#axt-binding-math}

Nexus AXT データコンテナについて、証明の再生前に `AxtFastpqBinding` が正規化されます。空のパラメータ値はデフォルトで `fastpq-lane-balanced` となります。空の検証者IDおよびバージョンはそれぞれデフォルトで `fastpq` および `v1` となります。クレームタイプはトリムされ、小文字に変換されます。

AXT FastPQ の公開入力は決定論的なバイト暗号ハッシュです：

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

AXT トランジションキーは次の通りです:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` クレームはロール付与の行を挿入します:

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

および認可ポリシーをバインドするメタデータ行。`compliance` クレームは、ポリシー用とターゲットデータスペース用の2つのメタデータ行を挿入します。

〜のために `tx_predicate` そして `value_conservation`, 結合に正のソースが含まれている場合、明示的な効果量が使用されます 宛先の金額。そうでなければ、コードは制限付きの決定的な金額を導き出します:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

次に、同じ伝達方程式が使用されます：

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成送信者および受信者アカウントIDは、キーシードから生成されます：

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

転送バッチの暗号ハッシュは次の通りです:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT バッチ技術マニフェストの暗号ダイジェスト値は、標準結合の Norito エンコーディング上で SHA-256 です。

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明なメッセージ証明 {#sccp-transparent-message-proofs}

SCCP ヘルパーソフトウェアパッケージは、透過的なクロスチェーンメッセージ証明のために FastPQ も使用します。この経路は `iroha3d` のバックグラウンドプローバー実行レーンとは別です。それは SCCP メッセージ証明バンドルと技術マニフェストから直接 FastPQ バッチを構築し、その後生成された証明をオープン検証のためにラップします。

バッチ SCCP は`fastpq-lane-balanced`と3つのメタデータ遷移を使用します：

|キー|操作|
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

その公開入力は、SCCP 透明な内部証明から導かれます:

| FastPQ 入力 | SCCP ソース                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        |ステートメントの暗号ハッシュに対するBlake2b暗号ダイジェスト値の最初の16バイト|
| `slot`        |最終的な高さ|
| `old_root`    |ペイロードの暗号学的ハッシュ|
|`new_root`|暗号化コミットメント値ルート|
| `perm_root`   |最終ブロック暗号ハッシュ|
| `tx_set_hash` |ステートメント暗号ハッシュ|

SCCP 標準エンコーダは整数をリトルエンディアンで書き、可変長バイト配列を次のようにエンコードします:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

透過的な公開入力バイト列は次の通りです:

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

透過的なステートメントバイトは、バージョン、チェーンファミリー、ローカルおよびカウンターパーティドメイン、セキュリティモデル、アンカーガバナンス、アカウントコーデック、最終性モデル、検証者ターゲット、検証者バックエンドファミリー、長さ接頭辞付きチェーン/バックエンド/マニフェストフィールドの連結です。宛先バインディング暗号ハッシュ、アカウントコーデックキー、ペイロードの種類、公開入力バイト、およびペイロード暗号ハッシュ。ステートメント暗号ハッシュは次の通りです:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

この証明パスの FastPQ データスペース ID は、別のプレフィックス付き Blake2b 暗号ダイジェスト値の最初の16バイトです：

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ バッチは正確に次の通りです:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

その後、同じ FastPQ の順序ルールで並べ替えられます。

OpenVerify 検証者の暗号コミットメント値は、SCCP メッセージバックエンド名および正規の FastPQ 検証者記述子に対して SHA-256 です:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

生の FastPQ 証明は Norito でエンコードされて`StarkFriOpenProofV1`になり、その後バックエンド`Stark`で`OpenVerifyEnvelope`にラップされます。SCCP の検証は同じものを再構築します FastPQ バンドルと技術マニフェストからバッチを取得し、オープン検証データコンテナのメタデータを確認し、再構築されたバッチと証明に対して FastPQ 検証器を呼び出します。

## パラメータセット {#parameter-sets}

標準のパラメータカタログは、2つのパラメータセットを公開しています。ホストプロバーの実行レーンは現在 `fastpq-lane-balanced` を使用しています。

|パラメータ|目的|フィールド|暗号ハッシュ| FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` |バランスの取れたプルーバースループット|ゴルディロックス二次拡大|Poseidon2 暗号コミットメント値、カタログ SHA3 ラベル|項数 8、ブロウアップ 8、46 クエリ|
| `fastpq-lane-latency` |レイテンシに敏感な実行レーン|ゴルディロックス二次拡大|Poseidon2 暗号コミットメント値、カタログ SHA3 ラベル|項数 16、ブロウアップ 16、34 クエリ|

どちらも128ビットのセキュリティを目標としており、トレースドメインのサイズは`2^16`を使用します。Rust V1 トランスクリプト再生コードは現在、SHA3-256 を直接呼び出すのではなく、`iroha_crypto::Hash::new`でフィアット・シャミールのチャレンジバイトを導出しています。

Rust 証明器で使用される正確なカタログ定数は次のとおりです:

|定数| `fastpq-lane-balanced` | `fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
| `target_security`    |                    128 |                   128 |
| `grinding_bits`      |                     23 |                    21 |
| `trace_log_size`     |                     16 |                    16 |
|`trace_root`|   `0x002a247f81c6f850` |  `0x6a9f4eb38fb9b892` |
| `lde_log_size`       |                     19 |                    20 |
| `lde_root`           |   `0x60263388dbbf9b2a` |  `0x9c9c3a571b6f89ac` |
| `permutation_size`   |                 65,536 |                65,536 |
| `lookup_log_size`    |                     19 |                    20 |
| `omega_coset`        |   `0x6af325e825ad5c18` |  `0x3a5fd4171e3c3a4d` |
| `fri_arity`          |                      8 |                    16 |
| `fri_blowup`         |                      8 |                    16 |
| `fri_max_reductions` |                      8 |                     6 |
| `fri_queries`        |                     46 |                    34 |

## 構成 {#configuration}

FastPQ の設定は `zk.fastpq` の下にネストされています。

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

同じ実行およびテレメトリラベルは、`iroha3d` から上書きすることができます。

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

環境変数は、構成フィールドでもサポートされています。FastPQ 固有の変数には以下が含まれます:

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

## 指標 {#metrics}

テレメトリが有効な場合、FastPQ はバックエンドの選択と Metal ランタイムの動作に関するメトリクスをエクスポートします。

|メートリック|意味|
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     |バックエンドおよびデバイスラベルによって要求および解決された実行モード|
| `fastpq_poseidon_pipeline_total` |要求され、解決されたポセイドンソフトウェア処理ワークフローパス|
| `fastpq_metal_queue_depth`        |メタルキューの制限、最大インフライト数、ディスパッチカウント、サンプリングウィンドウ|
| `fastpq_metal_queue_ratio`        |メタルキューのビジーおよびオーバーラップ比率|
| `fastpq_zero_fill_duration_ms`    |Metal の実行におけるホストのゼロフィル期間|
| `fastpq_zero_fill_bandwidth_gbps` |導出ゼロフィルバンド幅|

一般的なパフォーマンスのトリアージには、[パフォーマンスと指標](/ja/guide/advanced/metrics.md) に記載されているコンセンサスおよびキューの信号と一緒にこれらを使用してください。

## 関連参考 {#related-reference}

- [データモデルスキーマ](/ja/reference/data-model-schema.md) ノード権威型データスナップショット用
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ オプション](/ja/reference/iroha3d-cli.md#fastpq-overrides)
