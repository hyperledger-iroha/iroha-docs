---
translation_locale: ja
translation_source: /blockchain/fastpq.md
translation_source_hash: 55b57e6aeeef2aefa1c8359d9b9487029b106eaebed12a58268b61dc583e97f6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ は,選択された実行効果に対する Iroha の STARK 証明経路である.通常のトランザクション実行またはコンセンサスを置き換えない.トランザクションはまだ通常のように ISI, IVM,および Sumeragi で実行されます.FastPQ は決定的な実行証人を消費し,サポートされた効果を証明パッチに変換します.

現在のホスト統合には3つの主要な経路があります:

- ブロック実行中に記録された透明な数値資産移転
- Nexus 確認されたレーンリレーが AXT 証拠封筒には, FastPQ 拘束力
- SCCP 透明なメッセージ証明のヘルパーで,開いた検証封筒に FastPQ 証明を包む

## 証人の 道 を 移転 する {#transfer-witness-path}

指示がバランスを変異させる時,透明な数値転送は構造化されたトランスクリプトを作成します. 記録は:

- ソースアカウント,目的口座,資産定義,および金額
- 送金前および送金後の送信者と受信者のバランス
- バッチハッシュとして使用されるトランザクションエントリーポイントハッシュ
- 提出する口座から得られた権限の証明書
- シングルデルタ・トランスクリプトのためのポセイドン消化

配送は複数のデルタを持つ1つのトランスクリプトを使用します その場合,単一のデルタポセイドンの消化物は欠けている.

ブロック最終化時に, Iroha はエントリーポイントハッシュによってこれらのトランスクリプトをグループ化します.実行証人は元のトランスクリートバンドルとプロバーのために準備された FastPQ 移行パッチの両方を運びます.

各転送デルタが 2 つの移行行になります:

|列|キー形|前値 |後の価値|
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|送信者デビット|`asset/<asset-definition>/<source-account>`|送信元のバランス|送信者のバランス|
|受信者のクレジット |`asset/<asset-definition>/<destination-account>`|前の受領者バランス|受信者の余分 |

数値は整数目証単位に正常化されます.選択した十桁スケールで非負の `u64` として表現できない場合, FastPQ バッチングでは値が拒否されます.

## 公的な入口 {#public-inputs}

FastPQ 移行バッチごとに,ブロックと実行コンテキストに証明を結びつける公開入力が含まれます.

|入力|意味|
| ------------- | --------------------------------------------------------------- |
|`dsid`|小規模バイトとしてコードされたデータスペース識別子 |
|`slot`|ブロック作成時間をナノ秒に変換する|
|`old_root`|処刑の目撃者からの親国の根源|
|`new_root`|処刑の目撃者から派生された|
|`perm_root`|積極的な役割の許可に対するポセイドンのコミットメント|
|`tx_set_hash`|ハッシュは,並べられたトランザクションとタイムトリガーエントリーポイントハッシュを|

ホストは `fastpq-lane-balanced` をこれらのパッチのカノニカルパラメータとして設定する.

## 数学モデル {#mathematical-model}

このセクションでは,現在の Rust プロバーと検証で実装された算数を記述します.下記のフィールド操作はすべて,ゴールドリックス素数場の上にあります:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ は,フィールドコミットメントのために`F` に対してPoseidon2を使用します.スポンジは幅 `t = 3`,速率 `r = 2`,および容量 `1`があります.ハッシュは,最終的な変異前にレート-2ブロックでフィールド要素を吸収し,単一のフィールド要素 `1` を添加します.

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

バイト文字列は7バイトの小さなエンディアン端に詰め込まれ,各端が厳密に `p` 以降です.

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

ドメインに分離されたフィールドハッシュは,次のように表現されます.

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

FastPQ はバイトドメインのダイジェストから始まるハッシュの場合,最初の8つの小エンディアンバイトをフィールドに映し出します.

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

ここで, `Hash` は Iroha の `iroha_crypto::Hash::new` を意味し,公式が明示的に Poseidon2 または SHA-256 という名前がない限り,32バイトの Blake2bVar ダイジェストです.

### フィールド算術 {#field-arithmetic}

Rust コードは,フィールド要素を`[0,p)` のカノニカル `u64`値として表す. 追加と引き算は:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

マルチプレーションは最初に128ビット製品を計算します:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks の 減少 は その 識別 を 使っ て い ます.

$$
2^{64}\equiv2^{32}-1\pmod p
$$

もし:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

その後,減速器が計算する.

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

実行は,結果がカノニカルになるまで条件的に `p` を追加または引く.バランスデルタなどの署名された整数には,以下のように埋め込まれます:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### ポーゼイドン2 変異 {#poseidon2-permutation}

ポーゼイドン2変異状態は:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

そのS箱は:

$$
S(x)=x^5
$$

FastPQ は4回フル・ラウンド,57回パーシャル・ラウンドおよびさらに4回フルラウンドを使用する.丸定数 `c_r = (c_{r,0}, c_{r,1}, c_{r,2})`を有する完全なラウンドは:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

パーシャルラウンドは:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

すべての加算および倍数は `F` であります.法典的な MDS 行列は:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

フィールドハッシュはゼロ状態から始まる. すべての完全なレート-2ブロック `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

最終ブロックは,最後の変異前に `1` 填料要素を添加する.出力値は `x_0`.

### 公の入力 拘束力 {#public-input-binding}

ホストは,その `u64` 値を16バイトのフィールドの最初の8つの小さなエンディアンバイットに書き込み,データスペース id を暗号化します:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

ブロック作成時間はミリ秒からナノ秒に変換されます:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

トランザクションセットハッシュは,並べられたエントリーポイントハッシュのバイトドメインハッシュです:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

`h_i`がソートされたトランザクションとタイムトリガーエントリーポイントハッシュである.公開証明書 IO では,`perm_root`または `tx_set_hash`がすべてゼロであれば,プロバーはバックバック値を記入します:

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

### 数値的正常化 {#numeric-normalization}

移転デルタごとに,ターゲットデシマルのスケールは,金額を最大限切断したスケールであり,両バランスインシュートである.

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

`m`とスケール`q`のマントissa `Numeric` の値は, `m >= 0`と `q <= s` の場合にのみ受け入れられる.その証人の値である FastPQ は:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

標準化結果は `u64` に一致する.

### カノニカル・オーダー {#canonical-ordering}

痕跡構築前に,パッチは移行キー,操作ランク,および元の挿入指数によって分類されます.

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

オーダーコミットメントは,ソードされた移行のドメイン `fastpq:v1:ordering` と Norito のエンコード上のPoseidon2フィールドハッシュです:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

`P`が7バイトのパッケージである場合, `E`は Norito のコードであり, `D_o`は `fastpq:v1:ordering`であり, `T*`は分類された移行リストである.

### 移転方程式 {#transfer-equations}

送金額について `a`, 送信者のバランス `f`, そして受信者のバランス `t`, FastPQ 痕跡の構築前に標準化された証人の値を検証する:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

移行行は次のようにコードされます.

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

追跡中の署名されたデルタは `F`に縮小されます.

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

オプションのシングルデルタ転送ダイジェストは,暗号化された転送プリ画像をコミットします.

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

マルチデルタ転送トランスクリプトの場合,現在のフォーマットはこのトップレベルのダイジェストが欠けていることを要求します.

転送トランスクリプトのホスト当局が消化するのは:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### 追跡行 {#trace-rows}

`n` の実際の行列を並べて下さい. 追跡長さは次の2の力です:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

列 `0..n-1` がアクティブで,列 `n..N-1` はパッディング列である.すべての実際の列には1つの操作セレクターセットがある.

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

すべての選択列はブール式です:

$$
s(s-1)=0
$$

許可の検索行は,ちょうど役割授与と役割撤回行です.

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

数値操作行については:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

建設者はまた,資産ごとに走行するデルタを追跡します.

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

供給カウンタを更新するのはミント・バーン行のみです.

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

メタデータとデータスペースの追跡列は,行物化前のフィールドハッシュである.

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

メタデータハッシュ,データスペースハッシュ,スロットは隣接するトラース行で安定している.

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### メークル列を転送する {#transfer-merkle-columns}

転送行には32レベルの稀なメルクル経路があります.ホスト証明が欠けている場合,プロバーは行鍵から決定的な経路を合成し,前バランス,そして行が送信者または受信者の側かどうかです.

合成パスの場合は,発送列の味塩は `fastpq:smt:from` と受信列の場合は `fastpq:smt:to` です.

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

合成葉と内部ノードは:

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

痕跡はビットを記録する `b_l`, 兄弟 `s_l`, 輸入ノード `x_l`, そして出力ノード `x_{l+1}` すべてのレベルで,コードの分岐条約:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### 許可のハッシュ {#permission-hashes}

Role grant と revoke の行は, permission witness をハッシュする:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

ホスト許可表のルーツは,役割バイト,許可バイト,時代バイトによってエントリを分類し,その後ポセイドン2 メークル木を作成します:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

奇数幅のレベルは最終要素を倍にする.

### 痕跡のコミットメント {#trace-commitment}

各追跡列 `c` に対して, FastPQ は最初に追跡領域上の列値をインターポレーションし,系数ベクトルをハッシュする.

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

痕跡根は,列のコミットメント上のポセイドン2 メークル根です:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

最終的なトラースコミットメントはドメイン,パラメータセット,トラース形,列消化およびトラースルーツのバイトハッシュです:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

`D_c`が `fastpq:v1:trace_commitment`である.

### AIR 構成 {#air-composition}

V1 AIR 構成値は,行本部残留の線形組み合わせである.トランスクリプトサンプルには二つの課題がある:

$$
\alpha_0,\alpha_1 \in F
$$

隣接する列ペア `(i,i+1)` に対して,プロバーは計算します.

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

残留品 `rho`は,コード順に次のとおりである.

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

数字列の行については:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

安定したパッチコンテキスト列については:

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

検証者は,サンプリングされた行開きについて `A_i` を再計算し, AIR の組成メークルルーツで約束した構成値と比較してチェックします.

### 検索製品 {#lookup-product}

許可検索蓄積機では,フィアット-シャミールチャレンジ `gamma` を使用している. `s_perm` と `perm_hash` の低度の拡張評価において,実行される製品は:

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

証拠記録:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### 低レベルの拡張 {#low-degree-extension}

放っておいて `omega_T` 追跡ドメインの生成器である `omega_E` 評価ドメイン生成器,および `g` 設定されたコセットオフセット.値を持つ追跡列 `v_i`, インターポレーションは系数を生成する `a_j` そのように:

$$
f(\omega_T^i)=v_i
$$

低度の拡張は,コセット上の同じ多項式を評価する.

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

実行は, FFT 以前のコセットオフセットの権限で系数を掛けることでこれを計算する.

$$
a'_j = a_j g^j
$$

そして,評価領域で `a'` を評価する.

CPU FFT は,ビット逆入力上の再変性ラディックス-2 クーリー・トゥキ変換である.ステージ長さ `L`,半長さ `H=L/2`,およびステージ根では:

$$
\omega_L=\omega^{N/L}
$$

各蝶が計算する:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

逆の FFT は, `omega^{-1}` と同じ変換を実行し,逆域サイズでスケールする.

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

カタログの根は使用前に検証される.

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

カタログルーツから派生されたより小さなドメインについては,発電機は:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### ローと葉のハッシュ {#row-and-leaf-hashes}

LDE の後, FastPQ はすべての LDE コラムの各行をハッシュする. `m` コラムについては:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

列ハッシュが評価ドメインではなく,トラスドメインにまだ存在している場合,プロバーは同じコセット LDE プロセスで単行列ハッシュ列をインターポラして拡張します.

### メークル・オープン {#merkle-openings}

LDE 値は,以下の部分に分類される.

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

片葉はそれぞれ:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

メークルの両親は:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

奇数レベルは最後のノードを複製する.クエリパスは,各レベルのクエリ葉インデックス等価に応じて左または右にハッシュして確認します.

インデックスした葉のために `i`, 道路 `(s_0,\ldots,s_{d-1})` ルーツに対して検証する `R` 繰り返しによって:

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

チェックは以下の場合にのみ行われます

$$
y_d=R
$$

AIR 痕跡の行葉は:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR の組成葉は:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE 查询開設は,評価指数 `i` で開いた値がその認証された部分に存在していることを確認する.

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI 折る {#fri-folding}

FRI 約束する AIR 組成評価 各ラウンドごとに `l`, トランスクリプトのサンプルが挑戦 `beta_l`. 層は,最後の値を繰り返して arity の倍数に敷き詰められます.各 arity の大きさのグループが:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

`a` が FRI の数値である.検証者は,サンプル採取されたすべてのクエリチェーンに対して,次のことを確認します:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

そして,それぞれ開いた FRI グループを対応する FRI 層根と認証します.

### フィアット・シャミール・トランスクリプト {#fiat-shamir-transcript}

カノニカルパラメータカタログでは,トランスクリプトハッシュを SHA3-256 とラベル付けます.現在のプロバーと検証器実装は,`iroha_crypto::Hash::new`でチャレンジバイトを生成し,最初の8つの小さなエンディアンバイトを`F`に減らします.

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

チャレンジの呼び出しは,トランスクリプト状態に完全なダイジェストを添加します.再弾順は:

1. 公開 IO,プロトコルのバージョン,パラメータのバージョン,およびパラメータ名
2. LDE 根と痕跡の根
3. `gamma`
4. AIR 構成の課題 `alpha_0`, `alpha_1`
5. AIR 痕跡根と AIR 組成根
6. 検索グランド製品
7. FRI 層の根と`beta_l`課題
8. 採取した查询指数

クエリサンプリングは32バイトのチャレンジ・ダイジェストを描き,要求された単一のインデックス数を得るまで,小さなエンディアン `u64` パーツとして読み続けます.

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

採取されたサンプルセットは順序で返品されます.

### 検証器を再現する {#verifier-replay}

検証者は,最初にパッチのコミットメントを再計算します.

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

要求する:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

また,公共の IO を再建する

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

すべてのフィールドは,証明の公開 IO バイト対バイトと一致する必要があります.検証者は同じトランスクリプトを再構築し,同じ結果を出します:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

採取されたすべての查询 `q` に対して,この検査は:

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

そして:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

AIR 組成の開口は, `R_air_composition` で認証しなければならない.その後, FRI チェーンが同じ `A_q` から始まり,端末 FRI の根の下にある認証された最終的な FRI 葉で終了する必要があります.

## 箴言 の 確認 {#what-the-prover-checks}

FastPQ プロバーは,トラスを作成する前に,移行キー,操作ランク,挿入順によってバッチの順序をカノニカル化します.転送行にはレコーディングメタデータも必要です.転送行が付いているが,転送レコーディングがないバッチは無効です.

移転トランスクリプトについては,プロバーサイドのチェックには:

- 送信者のバランスは,下流してはならない
- `sender_after` は `sender_before - amount` に等しくなければならない.
- `receiver_after` は `receiver_before + amount` に等しくなければならない.
- トランスクリプトは,配合中のすべての転送行をカバーしなければならない.
- シングルデルタポセイドン消化器が存在すると,トランスクリプト前画像と一致しなければならない.
- 稀少メークル証明はバージョン1として解読する必要があります.

追跡には,転送,ミント,バーン,ロール授与,ロール撤回,メタデータセット,許可検索行のための選択列が含まれています.数値操作行はまた署名されたデルタ,資産ごとに実行されるデルタ,供給カウンターを含みます.

## プロバー・レーン {#prover-lane}

`iroha3d` は,プロバーバックエンドを初期化できる場合,起動時に FastPQ プロバーレーンを開始します. レーンは,境界線のあるフォロータスクです.ブロックが実行証人を生成した後,コンビートパスではブロックハッシュ,高度,ビュー,および証明を含むプロバーワークを提出します.

レーンが動かないか,列が満員である場合,作業はスキップされ,通常のブロック処理が継続されます. つまり,背景のプロバーレーンは取引受付やコンセンサスのゲートではありません. これは既に実行されている 州上の証明生産経路です

レーンは,以下のようなプロバーを構成する:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` プロバーが利用可能なバックエンドを選択します. `cpu` ピン実行を CPU. `gpu` 好きなこと GPU 執行, CPU バックエンドが要求されたカーネルを使用できない場合.

## 検証 {#verification}

FastPQ 証明検証は,カノニカルバッチコミットメントを再構築し,公開トランスクリプトを再現します.検証者はプロトコルバージョン,パラメータセットバージョン,再生制限,追跡コミットメント,公開入力,サンプルメークル開口, AIR 開口,および FRI クエリチェーンをチェックします.

デフォルトリプレイ制限は:

|制限|デフォルト|
| ------------------ | ------: |
|移行行|     256 |
|バッチ用荷物のサイズ |256 KiB |
|FRI 層|      16 |
|問い合わせの開設|     128 |

## Nexus 検証されたリレー {#nexus-verified-relays}

Nexus AXT 証拠封筒は, `AxtFastpqBinding`. 何時か `RegisterVerifiedLaneRelay` 執行する Iroha:

1. レーンリレーの封筒と防弾材料 FastPQ を検証する.
2. データスペースとマニストルーツをチェックします.
3. AXT 証明封筒を解読する
4. `fastpq_binding` を要求する
5. FastPQ パッチをその結合から再構築する
6. 埋め込まれた FastPQ 証明を解読する
7. FastPQ の検証者に再構築されたパッチと証明を呼び出す

確認が成功した場合, Iroha はリレー参照,オリジナルの封筒,証明用荷ハッシュ,検証高度,マニフェストルーツ,および FastPQ 結合を含む `VerifiedLaneRelayRecord` を保存します.

レーンリレー包装には,コンパクト FastPQ の証明材料も含まれています.その素材はレーンID,データスペースID,ブロック高度,検証高度,ブロックヘッダーハッシュ,決済ハッシュ,マニフェストルーツの消化です.QC と有効な FastPQ の証明材料がある場合にのみ,リレーが合併することが許容される.

### AXT 拘束力のある数学 {#axt-binding-math}

Nexus AXT 封筒では,証明を再現する前に `AxtFastpqBinding` がカノニ化されます.空のパラメータ値はデフォルトで `fastpq-lane-balanced`;空の検証器 id とバージョンデフォルトは `fastpq` および `v1`;クレームタイプが切り替えられ,下行です.

AXT FastPQ の公開入力は,決定的なバイトハッシュである.

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

AXT 移行鍵は:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization`請求書には,役割補助の行が挿入されます.

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

許可政策を拘束するメタデータ行.`compliance`請求書には,2つのメタデータ行が挿入されます. 1つは政策と1つはターゲットデータパースです

`tx_predicate`および `value_conservation`については,結合が正的源または目的値を含む場合,明示的な効果量を使用します.そうでなければコードは制限された決定性値を生成する:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

そして,同じ転送方程式を使用します.

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

合成送信者と受信者のアカウントIDは,キー種から生成されます:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

移転パッチハッシュは:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT パッチマニフェストは,カノニック結合の SHA-256 コード上の Norito である.

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP 透明なメッセージ証明 {#sccp-transparent-message-proofs}

SCCP ヘルパーキャストは,透明なクロスチェーンメッセージ証明のために FastPQ を使用します.この経路は, `iroha3d` 背景プロバーレーンから分離されています.SCCP メッセージ証明バンドルとマニフェストから直接 FastPQ バッチを構築し,その結果となる証明をオープン検証のために巻きます.

SCCP バッチは, `fastpq-lane-balanced`と3つのメタデータ移行を使用する.

|鍵|作戦|
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement`|`MetaSet`|
|`sccp:transparent:v1:context`|`MetaSet`|
|`sccp:transparent:v1:payload`|`MetaSet`|

公開入力は,透明な内部証明 SCCP から得られる.

|FastPQ 入力 |SCCP ソース |
| ------------- | ---------------------------------------------------------- |
|`dsid`|"Blake2b"の最初の16バイトは 声明をハッシュする|
|`slot`|終結の高度|
|`old_root`|パイロードハッシュ |
|`new_root`|コミットメントの根|
|`perm_root`|終結ブロックハッシュ|
|`tx_set_hash`|声明ハッシュ|

SCCP のカノニカルエンコーダーは,小数値整数を書き込み,変数の長さのバイト配列を次のようにコードします.

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

透明な公共入力バイト文字列は:

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

透明な声明バイトはバージョンの連鎖,チェーンファミリー,ローカルおよびコントラストドメイン,セキュリティモデル,アンカーガバナンス,アカウントコデック,ファイナリティモデル,検証者のターゲット,検証者のバックエンドファミリー,長さ先定のチェーン/バックエンド/マニフェストフィールド,目的地結合ハッシュです.アカウントコデックキー,ペイルロードタイプ,パブリック入力バイト,ペイルলোডハッシュ. ステートメントハッシュは:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

FastPQ この証明経路のデータスペースIDは,別のプレフィックスされたBlake2bダイジェストの最初の16バイトです:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ バッチは,正確に:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

その後,同じ FastPQ オーダー規則によって分類される.

労働組合 OpenVerify 検証者のコミットメントは SHA-256 その上 SCCP メッセージのバックエンド名とカノニカル FastPQ 検証器の記述符:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

原産物 FastPQ 証拠は Norito- 暗号化された `StarkFriOpenProofV1`, その後, `OpenVerifyEnvelope` バックエンド `Stark`. SCCP 検証は同じものを再構築する FastPQ バンドルとマニフェストからバッチを出し,開いた検証包のメタデータをチェックし, FastPQ 再建されたパッチの検証と証明.

## パラメーターセット {#parameter-sets}

カノニカルパラメータ・カタログは2つのパラメーターセットを暴露している.ホストプロバーレーンは現在 `fastpq-lane-balanced` を使用しています.

|パラメーター|目的|フィールド|ハッシュ|FRI|
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced`|バランスの取れたプロバーループット|ゴールドリックスの方形拡張|ポセイドン2のコミットメント,カタログ SHA3 ラベル |第8話 爆発 第8話 46件の質問|
|`fastpq-lane-latency`|遅延に敏感な路線|ゴールドリックスの方形拡張|ポセイドン2のコミットメント,カタログ SHA3 ラベル |第16話 爆発 第16話 34話|

両方とも128-ビットセキュリティをターゲットとし,追跡ドメインサイズ `2^16` を使用している.現在, Rust V1 トランスクリプトリプレイコードは,直接 SHA3-256 を呼び出すのではなく,フィアット-シャミールチャレンジバイットを `iroha_crypto::Hash::new` で引き出しています.

Rust プロバーが使用する正確なカタログ定数は:

|絶えず|`fastpq-lane-balanced`|`fastpq-lane-latency`|
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

## 構成 {#configuration}

FastPQ 設定は, `zk.fastpq` の下に埋め込まれています.

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

`iroha3d`から同じ実行およびテレメトリラベルを覆すことができる.

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

環境変数は構成フィールドにもサポートされています. FastPQ 特定の変数は以下のとおりです:

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

## メトリックス {#metrics}

テレメトリが有効である場合, FastPQ はバックエンドの選択および金属実行時間の行動のための指標を輸出します.

|メトリック|意味|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total`|バックエンドおよびデバイスラベルによって要求された実行モードと解決された動作方式 |
|`fastpq_poseidon_pipeline_total`|要求され解決されたポセイドンパイプライン路線|
|`fastpq_metal_queue_depth`|メタルキュー制限,飛行中の最大数,発送数,サンプリングウィンドウ|
|`fastpq_metal_queue_ratio`|メタルキューの繁忙と重複率 |
|`fastpq_zero_fill_duration_ms`|メタルランスのホスト 0 填充期間|
|`fastpq_zero_fill_bandwidth_gbps`|ゼロフィール帯域幅を誘導する|

一般的なパフォーマンスのトリエージのために, [パフォーマンスとメトリック](/ja/guide/advanced/metrics.md)に記載されているコンセンサスおよびキューシグナルでそれらを使用してください.

## 関連参照 {#related-reference}

- [生成されたタイプの詳細に関するデータモデル・スケーマ](/ja/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`iroha3d` FastPQ オプション](/ja/reference/iroha3d-cli.md#arg-fastpq-execution-mode)
