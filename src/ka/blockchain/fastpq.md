---
translation_locale: ka
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ არის Iroha STARK დამტკიცების გზა არჩეული შესრულების ეფექტებისთვის. ის არ შეცვლის ჩვეულებრივი ტრანზაქციის განხორციელებას ან კონსენსუსს. ტრანზაკციები ჯერ კიდევ ჩვეულებრივ, ISI, IVM და Sumeragi-ის გავლით; FastPQ მოხმარებს დეტერმინისტური განხორციელების მოწმეს და მხარდაჭერილი ეფექტების გადაქცევას მტკიცებულებების პარტიებად.

ამჟამინდელი მასპინძელი ინტეგრაცია სამი ძირითადი გზა აქვს:

- ბლოკის შესრულების დროს დაფიქსირებული ციფრული აქტივების გამჭვირვალე ტრანსფერები
- Nexus შემოწმებული ზოლის რელიეები, რომელთა AXT მტკიცებულების კონვერტშია FastPQ ბმული.
- SCCP გამჭვირვალე შეტყობინების მტკიცებულებების დამხმარეები, რომლებიც ღია შემოწმების კონვერტში ამოტრიალებენ FastPQ მტკიცებულებას

## საქმის კურსის გადაცემა {#transfer-witness-path}

გამჭვირვალე ციფრული ტრანსფერები ქმნიან სტრუქტურირებულ ტრანსფორმას, როდესაც ინსტრუქცია ბალანსებს მუტაციას ახდენს.

- საწყისი ანგარიში, დანიშნულების ანგარიში, აქტივების განსაზღვრა და თანხა
- გამგზავრისა და მიმღების ბალანსი გადაცემის წინ და შემდეგ
- ტრანზაქციის შესასვლელი პუნქტის ჰეში, რომელიც გამოიყენება როგორც პარტიის ჰეში
- საანგარიშო ანგარიშიდან მიღებული ავტორიტეტული მონაცემები
- პოსეიდონის დიჟესი ერთდელისანი ტრანსკრიპტებისათვის.

ნაწილის ტრანსფერში გამოიყენება ერთი გადმოწერა მრავალ დელტასთან ერთად. ამ შემთხვევაში პოეზიდონის ცალკეული დელტა დიგესტი არ არსებობს.

ბლოკის დასრულებისას, Iroha ამ ტრანსკრიპტებს შეყვანის წერტილის ჰეშის მიხედვით აჯგუფებს. განხორციელების მოწმე შემდეგ ატარებს ორიგინალურ ტრანსკრეპტის ბუნდებსა და FastPQ გარდამავალი პარტებს, რომლებიც მომზადებულია პროვერისთვის.

თითოეული გადაადგილების დელტა ხდება ორი გარდამავალი რიგები:

|რიგები |მთავარი ფორმა |წინასწარი ღირებულება |შემდგომ ღირებულება |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
|გამგზავრებელი დებეტი |`asset/<asset-definition>/<source-account>` |გამგზავნელის ბალანსი ადრე |გამგზავნის ბალანსი შემდეგ |
|მიმღები კრედიტი |`asset/<asset-definition>/<destination-account>` |მიმღებთა ბალანსი ადრე |მიმღებთა ბალანსი შემდეგ |

ციფრული მნიშვნელობები ნორმალიზებულია მთლიანი რიცხვების მოწმეთა ერთეულებად. FastPQ პარტიისათვის უარყოფითია ღირებულება, თუ ის არ შეიძლება წარმოდგენილი იყოს როგორც არა-ნეგატიური `u64` შერჩეული დეციმალური მასშტაბის მიხედვით.

## საჯარო შემოტანები {#public-inputs}

თითოეული FastPQ გარდამავალი პარტია შეიცავს საჯარო შეყვანებს, რომლებიც ამტკიცებენ ბლოკის და შესრულების კონტექსტს:

|შემოტანა |მნიშვნელობა.|
| ------------- | --------------------------------------------------------------- |
|`dsid` |მონაცემთა სივრცის იდენტიფიკატორი, კოდირებული როგორც მცირე ბაიტები |
|`slot` |ბლოკების შექმნის დრო ნანოსეკონდებად გადაკეთებულია |
|`old_root` |მშობლიური სახელმწიფოს ფესვი აღსრულების მოწმედან გამომდინარე |
|`new_root` |პოსტსახელმწიფოდან გამომდინარე ფესვები აღსრულების მოწმეზე |
|`perm_root` |პოსეიდონის ვალდებულება აქტიური როლების ნებართვებზე |
|`tx_set_hash` |hash over sorted transaction and time-trigger entrypoint hashes  გაფორმებული ტრანზაქცია და დროის გამომწვევი შესასვლელი პუნქტის hashes|

მასპინძელი იყენებს `fastpq-lane-balanced` როგორც ამ პარტიების კანონიკული პარამეტრი.

## მათემატიკური მოდელი. {#mathematical-model}

ეს განყოფილება აღწერს არითმეტიკას, რომელსაც ახორციელებს მიმდინარე Rust პროვერი და ვერიფიკატორი. ყველა საველე ოპერაცია ქვემოთ არის Goldilocks პირველადი ველზე:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ გამოიყენება Poseidon2 ზე `F` საველე ვალდებულებებისათვის. სპონგს აქვს სიგანე `t = 3`, განაკვეთი `r = 2`, და სიმძლავრე `1`. ჰეში ათვისებს ველის ელემენტებს rate-2 ბლოკებში და ამატებს ერთი ველი ელემენტის. `1` საბოლოო პერმუტაციის წინ:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

ბაიტების სიმძლავრეები შეფუთულია 7-ბაიტიან პატარა ენდიანულ კიდურებში, ასე რომ თითოეული კიდე მკაცრად არის `p` ქვემოთ:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

დომენისგან განცალკევებული ველების ჰეშები წარმოდგენილია:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

ჰეშებისათვის, რომლებიც დაიწყება ბაიტ-დომენის დიგესტით, FastPQ ასახავს პირველი რვა პატარა ენდიანული ბაიტს ველში:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

აქ `Hash` ნიშნავს Iroha-ს `iroha_crypto::Hash::new` 32-ბაიტიან Blake2bVar დიგესტს, თუ ფორმულაში არ არის ნათლად დასახელებული Poseidon2 ან SHA-256.

### საველე არითმეტიკა {#field-arithmetic}

Rust კოდი წარმოადგენს ველის ელემენტებს, როგორც კანონიკური `u64` ღირებულებები `[0,p)`-ში. დამატება და მოხსნა არის:

$$
a +_F b = (a+b)\bmod p
$$

$$
a -_F b = (a-b)\bmod p
$$

გამრავლება პირველ რიგში ითვლის 128-ბიტის პროდუქტს:

$$
a\cdot b = \operatorname{lo} + 2^{64}\operatorname{hi}
$$

Goldilocks შემცირება შემდეგ იყენებს იდენტობას:

$$
2^{64}\equiv2^{32}-1\pmod p
$$

თუ:

$$
\operatorname{hi}=\operatorname{hi}_{lo}+2^{32}\operatorname{hi}_{hi}
$$

შემდეგ შემცირებელი ითვლის:

$$
\operatorname{lo}
+2^{32}\operatorname{hi}_{lo}
-\operatorname{hi}_{lo}
-\operatorname{hi}_{hi}
\pmod p
$$

განხორციელება პირობითად ემატება ან ამცირებს `p`, სანამ შედეგი არ იქნება კანონიკური. ხელმოწერილი მთლიანი რიცხვები, როგორიცაა ბალანს დელტები, ჩაშენებულია შემდეგით:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### პოსეიდონის 2 პერმუტაცია {#poseidon2-permutation}

პოსეიდონის 2 პერმუტაციის მდგომარეობაა:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

მის S-ბოქსშია:

$$
S(x)=x^5
$$

FastPQ იყენებს ოთხ სრულ რაუნდს, 57 ნაწილობრივ რაუნდს და შემდეგ კიდევ ოთხ სრულ რუნდს. სრული რაუნდი მრგვალი კონსტანტებით `c_r = (c_{r,0}, c_{r,1}, c_{r,2})` არის:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
S(x_1+c_{r,1})\\
S(x_2+c_{r,2})
\end{bmatrix}
$$

ნაწილობრივი რაუნდია:

$$
\mathbf{x}' =
M\cdot
\begin{bmatrix}
S(x_0+c_{r,0})\\
x_1+c_{r,1}\\
x_2+c_{r,2}
\end{bmatrix}
$$

ყველა დამატება და გამრავლება არის `F`. კანონიკური MDS მატრიცაა:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

ველის ჰეში იწყება ნულოვანი მდგომარეობიდან. თითოეული სრული rate-2 ბლოკისათვის `(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

საბოლოო ბლოკი შეავსებს `1` საფარის ელემენტს ბოლო პერმუტაციის წინ. გამოსავალი არის `x_0`.

### საჯარო შემოტანის ვალდებულება {#public-input-binding}

მასპინძელი კოდირებს მონაცემთა სივრცის ID- ს დაწერით მისი `u64` ღირებულება 16-ბაიტიანი ველის პირველი რვა მცირე ბაიტის ბაიტს:

$$
\operatorname{dsid\_bytes}(d)[0..8]=\operatorname{le64}(d),
\qquad
\operatorname{dsid\_bytes}(d)[8..16]=0
$$

ბლოკის შექმნის დრო მილისეკონდებიდან ნანოსეკონდებად იქცევა:

$$
\operatorname{slot}=\operatorname{saturating\_mul}
(\operatorname{creation\_time\_ms},1{,}000{,}000)
$$

ტრანზაქციის ნაკრების ჰეში არის ბაიტ-დომენის ჰეში შეკვეთილი შესასვლელი პუნქტის ჰეშებზე:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

სადაც `h_i` არის განლაგებული ტრანზაქციის და დროის გამოწვევის შესასვლელი პუნქტის ჰეშები. საჯარო მტკიცებულებაში IO, თუ `perm_root` ან `tx_set_hash` ყველა ნულოვანია, პროვერი აკმაყოფილებს უკან დაბრუნების მნიშვნელობებს:

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

### ციფრული ნორმალიზაცია {#numeric-normalization}

თითოეული გადაცემის დელტისთვის მიზნობრივი დეციმალური მასშტაბი არის მაქსიმალურად მოჭრილი მასშტატი მთლიანი რაოდენობის და ორივე ბალანსის კადრების მიხედვით:

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

ა `Numeric` ღირებულება mantissa- ით `m` და მასშტაბი `q` მიიღება მხოლოდ მაშინ, როდესაც: `m >= 0` და `q <= s`. მისი FastPQ მოწმეების ღირებულება არის:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

ნორმალიზებული შედეგი უნდა შეესაბამებოდეს `u64`.

### კანონიკური ბრძანება {#canonical-ordering}

ტრეის კონსტრუქციის წინ, პარტია ხდება გადასვლის გასაღების, ოპერაციის რანგისა და ორიგინალური ჩასმის ინდექსის მიხედვით:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

შეკვეთის ვალდებულება არის Poseidon2- ის ველის ჰეში დომენის `fastpq:v1:ordering` და Norito კოდირების შესახებ განლაგებული გადასვლის:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

სად `P` არის 7-ბაიტიანი შეფუთვა, `E` არის Norito კოდირება, `D_o` არის `fastpq:v1:ordering`, და `T*` არის დალაგებული გადასვლის სია.

### გადარიცხვის განტოლებები {#transfer-equations}

გადარიცხვის თანხის `a`, გამგზავრებლის ბალანსის `f` და მიმღებელის ბალანდის `t`ათვის, FastPQ ადასტურებს ნორმალიზებულ მოწმეთა მნიშვნელობებს კვალიფიკაციის შექმნის წინ:

$$
f_0 \geq a
$$

$$
f_1 = f_0 - a
$$

$$
t_1 = t_0 + a
$$

შემდეგ გადასვლის რიგები კოდირდება:

$$
\Delta_{\text{sender}} = f_1 - f_0 = -a
$$

$$
\Delta_{\text{receiver}} = t_1 - t_0 = a
$$

კვალიფიკაციის შიგნით, ხელმოწერილი დელტები შემცირებულია `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

ვარიანტური ერთდელის გადაცემის დიგესტი აძლევს კოდირებული გადაცემის წინასწარი გამოსახულებას:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

მულტი-დელტას გადაცემის ტრანსკრიპტებისათვის, ამჟამინდელი ფორმატი მოითხოვს, რომ ეს უმაღლესი დონის დიგესტი არ იყოს.

მასპინძელი ორგანოს მიერ გადაცემის ტრანსკრიპტებისთვის განთავსებული მონაცემები:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### საძიებო რიგები {#trace-rows}

უნდა შეიცავდეს `n` რეალური რიგები. კვალი სიგრძე არის შემდეგი ძალა ორი:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

რიგები `0..n-1` აქტიურია; რიგების `n..N-1` შეფუთვის რიგებია. თითოეულ რეალურ რიგში არის ერთი ოპერაციის შერჩევითი კომპლექტი:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

ყველა სელექტორის კოლონა არის ბულიური:

$$
s(s-1)=0
$$

ნებართვის შესწავლის რიგები ზუსტად არის როლების მინიჭებისა და როლების გაუქმების რიგები:

$$
s_{\text{perm}} =
s_{\text{role\_grant}} + s_{\text{role\_revoke}}
$$

ციფრული ოპერაციების რიგებისთვის:

$$
\delta_i = \operatorname{value\_new}_{i,0} - \operatorname{value\_old}_{i,0}
$$

მშენებელი ასევე ადევნებს თვალყურს აქტივზე განსაზღვრული დელტას:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

მხოლოდ მენტისა და დამწვრობის რიგები განახორციელებენ მიწოდების მაჩვენებელს:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

Metadata და მონაცემთა სივრცის კვალი კოლონები არის ველების ჰეშები მიღებული წინა რიგების მატერიალიზაციის:

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

მეტა მონაცემების ჰეში, მონაცემთა სივრცის ჰეში და სლოტი სტაბილურია მიმდებარე კვალიან რიგებში:

$$
\operatorname{metadata\_hash}_i=\operatorname{metadata\_hash}_{i+1}
$$

$$
\operatorname{dsid}_i=\operatorname{dsid}_{i+1}
$$

$$
\operatorname{slot}_i=\operatorname{slot}_{i+1}
$$

### გადასვლა Merkle კოლონები {#transfer-merkle-columns}

გადაცემის რიგები ატარებენ 32 დონის იშვიათი მერკლის გზას. თუ მასპინძელი მტკიცებულება აკლია, პროვერი სინთეზებს დეტერმინისტულ გზას რიგის გასაღებიდან, წინასწარი ბალანსიდან და არის თუ არა რიგი გამგზავნელის ან მიმღებელის მხარე.

სინთეტიკური გზებისათვის არომატური მარილი არის `fastpq:smt:from` გამგზავნელის რიგებისთვის და `fastpq:smt:to` მიმღებელის რიგისთვის:

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

სინთეზური ფოთლი და შიდა კვანძები არის:

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

ტრეიკ აღნიშნავს ბიტს `b_l`, ძმები `s_l`, შეყვანილი კვანძები `x_l`, და გამონადენი კვანძი `x_{l+1}` ყოველ დონეზე. კოდექსის ფილიალის კონვენციით:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ნებართვის ჰეშები {#permission-hashes}

Role grant და revocate რიგები hash ნებართვის მოწმე:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

მასპინძელი ნებართვის ცხრილის ფესვური sorts შეტყობინებები როლი bytes, ნებართვა bytes და ეპოქის bytes, შემდეგ აშენებს Poseidon2 Merkle ხე:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

საწინააღმდეგო სიგანის დონე ორჯერ ასახელებს ბოლო ელემენტს.

### კვალიფიკაციის ვალდებულება {#trace-commitment}

თითოეული კოლონისთვის `c`, FastPQ პირველ რიგში ინტერპოლებს კოლონის ღირებულებებს კოლონის დომენზე და ჰეშავს კოეფიციენტის ვექტორს:

$$
C_c =
H_F(
\operatorname{seed}(\texttt{fastpq:v1:trace:column:}c),
\operatorname{coeffs}(c)
)
$$

კვალიანი ფესვი არის Poseidon2 Merkle ფესვი სვეტის ვალდებულებებზე:

$$
R_{\text{trace}} = \operatorname{MerkleRoot}(C_0,\ldots,C_{m-1})
$$

საბოლოო კვალიფიკაციის ვალდებულება არის ბაიტის ჰეში დომენის, პარამეტრების ნაკრებების, კვალიფიკის ფორმის, კოლონების დიგესტებისა და კვალიფიკური ძირის შესახებ:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

სადაც `D_c` არის `fastpq:v1:trace_commitment`.

### AIR შემადგენლობა {#air-composition}

V1 AIR შემადგენლობის მნიშვნელობა არის ხაზოვანი ნაშთების ადგილობრივი ნაშთის კომბინაცია. ტრანსკრიპტის ნიმუშები ორი გამოწვევაა:

$$
\alpha_0,\alpha_1 \in F
$$

თითოეული მიმდებარე რიგის წყვილისათვის `(i,i+1)`, პროვერი ითვლის:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ნარჩენები `rho` არის, კოდის რიგით:

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

ციფრული სვეტების მქონე რიგებისთვის:

$$
\rho =
(s_{\text{transfer}}+s_{\text{mint}}+s_{\text{burn}})
\cdot
((\operatorname{value\_new}_{0}-\operatorname{value\_old}_{0})-\delta)
$$

და სტაბილური პარტიის კონტექსტის სვეტებისათვის:

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

მამოწმებელი `A_i` შეადგენს ნიმუშით გამოტანილი რიგების ღია ადგილებისთვის და შეამოწმებს მას AIR კომპოზიციის Merkle ფესვის შესაბამისად ვალდებულებული შემადგენლობის ღირებულებით.

### საძიებო პროდუქტი {#lookup-product}

ნებართვის მოძიების აკუმულატორში გამოიყენება Fiat-Shamir გამოწვევა `gamma`. დაბალი ხარისხის გაფართოების შეფასებებისას `s_perm` და `perm_hash`, მიმდინარე პროდუქტი არის:

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

მტკიცებულების ჩანაწერები:

$$
\operatorname{lookup\_grand\_product}=H_F(z_0,z_1,\ldots)
$$

### დაბალი დონის გაფართოება {#low-degree-extension}

უნდა იყოს `omega_T` ტრეის-დომენის გენერატორი, `omega_E` შეფასების დომენის გენსერატორი და `g` კონფიგურირებული კოსეტური ოფსეტი. ტრეის სვეტისათვის, რომლის ღირებულებებიც არის `v_i`, ინტერპოლაცია წარმოქმნის კოეფიციენტებს `a_j` ისეთი, რომ:

$$
f(\omega_T^i)=v_i
$$

დაბალი ხარისხის გაფართოება აფასებს იმავე პოლინომს კოსეტზე:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

აღნიშნულის განხორციელება ხდება კოეფიციენტების გამრავლებით კოსეტის კომპენსაციის უფლებამოსილებებით FFT:

$$
a'_j = a_j g^j
$$

და შემდეგ შეფასება `a'` შეფასების დომენზე.

CPU FFT არის iterative radix-2 Cooley-Tukey ტრანსფორმაცია ბიტ-გაცრუებული შესასვლელებზე. სცენის სიგრძეზე `L`, ნახევარი სიგრძე `H=L/2` და ეტაპის ფესვზე:

$$
\omega_L=\omega^{N/L}
$$

თითოეული ფეხსაცმელი ითვლის:

$$
u=x_j
$$

$$
v=x_{j+H}\cdot\omega_L^j
$$

$$
x_j'=u+v,\qquad x_{j+H}'=u-v
$$

ინვერსი FFT იგივე ტრანსფორმაციას ახორციელებს, როგორც `omega^{-1}` და მასშტაბობს ინვერსული დომენის ზომით:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

კატალოგის ფესვების გამოყენებამდე ვალიდირება:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

კატალოგის ფესვიდან გამომდინარე უფრო მცირე დომენებისათვის გენერატორი არის:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### რიგის და ფოთლის ჰაშები {#row-and-leaf-hashes}

LDE-ის შემდეგ, FastPQ ყველა რიგს აჰეშებს LDE სვეტზე. `m` სვეტებისათვის:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

თუ რიგების ჰეშები კვლავ არის კვალი დომენის ნაცვლად შეფასების დომენის, prover interpolates და გაფართოებს ამ ერთი რიგის-ჰეშ სვეტი იგივე coset LDE პროცესი.

### მერკლის ღილაკები {#merkle-openings}

LDE ღირებულებები დაჯგუფებულია შემდეგ ნაწილებად:

$$
B_{\text{lde}}=8\cdot\operatorname{fri\_arity}
$$

თითოეული ნაჭერი ფოთლია:

$$
L_j=H_D(j\|v_{jB}\|\cdots\|v_{jB+B-1})
$$

მერკლის მშობლები არიან:

$$
P_j =
H_F(\operatorname{seed}(\texttt{fastpq:v1:trace:node}),L_{2j},L_{2j+1})
$$

უცნაური დონეები ორჯერ ასახელებენ ბოლო კვანძს. გამოკითხვის გზები შემოწმდება მარცხენა ან მარჯვენა ჰეშით შესაბამისად გამოკითხვის ფოთლის ინდექსის პარტიას თითოეულ დონეზე.

ინდექსის ფოთლისთვის `i`, გზა `(s_0,\ldots,s_{d-1})` შეამოწმებს ფესვის წინააღმდეგ `R` განმეორებით:

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

გადახდა ხდება მხოლოდ მაშინ, როდესაც:

$$
y_d=R
$$

AIR კვალიანი რიგის ფოთლებია:

$$
L^{\text{air}}_i =
H_D(i\|m\|x_{i,0}\|\cdots\|x_{i,m-1})
$$

AIR შემადგენლობის ფოთლებია:

$$
L^{\text{comp}}_i = H_D(i\|A_i)
$$

LDE გამოკითხვის გახსნა ასევე ადასტურებს, რომ შეფასების ინდექსზე გახსნილი ღირებულება `i` მის ავთენტიფიცირებულ ნაწილში არის:

$$
\operatorname{chunk\_index}=\left\lfloor\frac{i}{B_{\text{lde}}}\right\rfloor
$$

$$
\operatorname{chunk\_offset}=i\bmod B_{\text{lde}}
$$

$$
\operatorname{chunk}[\operatorname{chunk\_offset}]=v_i
$$

### FRI დახურვა {#fri-folding}

FRI ვალდებულია შეასრულოს AIR შემადგენლობის შეფასებები. თითოეული რაუნდისთვის `l`, ტრანსკრიპტის ნიმუშები გამოწვევაა `beta_l`. ფენა დაფარულია არიტეტის მრავლობით, ბოლო ღირებულების განმეორებით. თითოეული არიტეტის ზომის ჯგუფი იხება შემდეგამდე:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

სადაც `a` არის FRI სიმაღლე. ვერიფიკატორი თითოეული ნიმუშით გამოტანილი შეკითხვის ჯაჭვისთვის აკონტროლებს, რომ:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

და ამტკიცებს თითოეულ გახსნილ FRI ჯგუფს შესაბამისი FRI ფენის ძირის წინააღმდეგ.

### Fiat-Shamir-ის გადაწერა {#fiat-shamir-transcript}

კანონიკური პარამეტრების კატალოგი აღნიშნავს ტრანსკრიპტის ჰეშს, როგორც SHA3-256. ამჟამინდელი პროვერი და ვერიფიკატორის განხორციელება გამოწვევის ბაიტებს გამოიყოფა `iroha_crypto::Hash::new`, რომელიც არის 32-ბაიტიანი Blake2bVar დიგესტი, შემდეგ კი პირველი რვა პატარა ენდიანული ბაიტს შეამცირებს `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

გამოწვევის ზარები შეავსებს მთლიან დიჟესს ტრანსკრიპტის მდგომარეობაში. განმეორების რიგით არის:

1. საჯარო IO, პროტოკოლის ვერსია, პარამეტრის ვერსია და პარამეტრების სახელი.
2. LDE ფესვი და კვალიანი ფესვი
3. `gamma`
4. AIR შემადგენლობითი გამოწვევები `alpha_0`, `alpha_1`
5. AIR კვალიანი ფესვი და AIR შემადგენლობის ფესვი
6. საძიებო grand პროდუქტი
7. FRI ფენის ფესვები და `beta_l` გამოწვევები
8. შეკითხვის ინდექსების ნიმუში

გამოკითხული ნიმუშების აღება გრძელდება 32-ბაიტიანი გამოწვევის დიგესტების მოხაზვას და მათ წაკითხვას მცირე ზომის `u64` ნაჭრების სახით, სანამ მას არ ექნება მოთხოვნილი უნიკალური ინდექსების რაოდენობა:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

ნიმუშების შერჩეული კომპლექტი დაბრუნდება დალაგებულ რიგში.

### შემოწმების გადათამაშება {#verifier-replay}

მამოწმებელი პირველ რიგში გადაითვლის პარტიის ვალდებულებას:

$$
\operatorname{commitment}_{expected}
=\operatorname{trace\_commitment}(\operatorname{params},\operatorname{batch})
$$

და მოითხოვს:

$$
\operatorname{commitment}_{expected}
=\operatorname{proof.trace\_commitment}
$$

ასევე აღდგება საჯარო IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

თითოეული ველი უნდა შეესაბამებოდეს დასტურის საჯარო IO ბაიტზე ბაიტი. შემდეგ ვერიფიკატორი აღადგენს იმავე ტრანსკრიპტს და იღებს იგივე:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

თითოეული შანსიანი გამოკითხვისთვის `q`, ის ამოწმებს:

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

და:

$$
A_q =
\operatorname{AIRComposition}(
\operatorname{row}_q,\operatorname{row}_{q+1},\alpha_0,\alpha_1
)
$$

სააგენტო AIR კომპოზიციის გახსნა უნდა ავთენტიფიცირდეს ქვემოთ `R_air_composition`. სააგენტო FRI ჯაჭვი მაშინ იწყება იმავე `A_q` და უნდა დასრულდეს დამოწმებული საბოლოო FRI ფოთლი ტერმინალის ქვეშ FRI ფესვი.

## რას შეამოწმებს ანდაზა {#what-the-prover-checks}

FastPQ პროვერი ტრეის შესაქმნელამდე კანონიზირებს პარტიის რიგს გარდაქმნის გასაღების, ოპერაციის რანგისა და ჩასმის რიგით. გადაცემის რიგები ასევე საჭიროებს ტრანსკრიპტის მეტა მონაცემებს. პარტია გადაცემის რიგით, მაგრამ არანაირი გადაცემის ტრანსკრუტებით არასწორია .

გადარიცხვის ტრანსკრიპტებისათვის, პროვოკატორის გვერდითი შემოწმებები მოიცავს:

- გამგზავნელის ბალანსი არ უნდა იყოს ნაკადის ქვემოთ
- `sender_after` უნდა იყოს იგივე, რაც `sender_before - amount`
- `receiver_after` უნდა იყოს იგივე, რაც `receiver_before + amount`
- ტრანსკრიპტი უნდა მოიცავდეს პარტიის თითოეულ გადაცემულ რიგს
- პოსეიდონის ცალკეული დელტა დიგესტი, როდესაც არსებობს, უნდა შეესაბამებოდეს გადაწერის წინასწარი გამოსახულებას.
- გათვალისწინებით, იშვიათი მარკლის მტკიცებულებების დეკოდირება უნდა მოხდეს 1 ვერსიით; დაკარგული გზები აღსავსებულია დეტერმინისტური სინთეტიკური მტკიცებულებებით.

კვალი შეიცავს შერჩევით სვეტებს გადაცემის, მონეტის, წვის, როლების მინიჭების, როლის გაუქმების, მეტა მონაცემთა ნაკრებისა და ნებართვების ძიების რიგებისთვის. ციფრული ოპერაციის რიგები ასევე ატარებენ ხელმოწერილი დელტაებს, გაშვებულ დელტებს აქტივზე და მიწოდების გამრიცხავებს.

## პრობერ ლეინი {#prover-lane}

`irohad` იწყებს FastPQ prover lane startup- ში, თუ prover backend შეიძლება ინიციალიზდეს. Lane არის ფონის ამოცანა შეზღუდული რიგით. მას შემდეგ, რაც ბლოკი წარმოქმნის შესრულების მოწმეს, commit path წარუდგენს prover სამუშაო, რომელიც შეიცავს ბლოკის ჰეშის, სიმაღლის, ნახვის და მოწმე.

თუ ბილიკი არ მუშაობს ან რიგები სავსეა, სამუშაო გადაწყდება და ჩვეულებრივი ბლოკის დამუშავება გრძელდება. ეს ნიშნავს, რომ ფონზე პროვორი ბილიკი ტრანზაქციის მიღების ან კონსენსუსის კარიბჭე არ არის. ეს არის პროფი-პროდუქციის გზა სახელმწიფოსთვის, რომელიც უკვე შესრულებულია.

მარშრუტი აშენებს პროვერს:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` საშუალებას აძლევს მკვლევარს აირჩიოს ხელმისაწვდომი უკანასკნელი. `cpu` pin განხორციელება CPU. `gpu` ურჩევნია GPU აღსრულება, CPU ჩავარდნა, როდესაც უკანა მხარეს არ შეუძლია გამოიყენოს მოთხოვნილი ბირთვები.

## შემოწმება {#verification}

FastPQ მტკიცებულების შემოწმება აღადგენს კანონიკური პარტიის ვალდებულებას და ასახავს საჯარო ტრანსკრიპტს. შემოწმებელი ამოწმებს პროტოკოლის ვერსიას, პარამეტრების შედგენილ ვერსიაზე, განმეორებითი ლიმიტებზე, ტრეის ვალდებულებაზე, საჯარო შესავალებზე, ნიმუშური Merkle-ის გახსნაზე, AIR გახსნაზე და FRI გამოკითხვის ჯაჭვზე.

გათვალისწინებული შეზღუდვებია:

|საზღვარი|დეფოლტი |
| ------------------ | ------: |
|გარდამავალი რიგები |     256 |
|პარტიის სასარგებლო ტვირთის ზომა |256 KiB |
|FRI ფენები |      16 |
|შეკითხვების გახსნა |     128 |

## Nexus შემოწმებული რელეები {#nexus-verified-relays}

Nexus AXT მტკიცებულების კონვერტებს შეუძლიათ ჩასვათ `AxtFastpqBinding`. როდესაც `RegisterVerifiedLaneRelay` ამოქმედდება, Iroha:

1. ადასტურებს ზოლის რელეის კონვერტსა და FastPQ საგამძლეო მასალას;
2. შეამოწმებს მონაცემთა სივრცეს და მანიფესტის ძირს
3. AXT მტკიცებულების კონვერტის დეკოდირება;
4. საჭიროებს `fastpq_binding`
5. აღდგება FastPQ პარტიის აღდგენა ამ ბმულიდან.
6. დისკოდირება ჩაშენებული FastPQ მტკიცებულების
7. მოუწოდებს FastPQ შემოწმებელს განახლებული პარტიის და მტკიცებულების შესახებ

იმ შემთხვევაში, თუ შემოწმება წარმატებით დასრულდა, Iroha ინახავს `VerifiedLaneRelayRecord`, რომელიც შეიცავს რელე რეფერენციას, ორიგინალურ კონვერტს, დამტკიცების სასარგებლო ტვირთის ჰეშს, შემოწმების სიმაღლეს, მანიფესტის ძირს და FastPQ ბმულებს.

მარშრუტის რელე კონვერტები ასევე ატარებენ კომპაქტური FastPQ საწინააღმდეგო მასალას. მასალა წარმოადგენს მარშრუტი ID, მონაცემთა სივრცე ID, ბლოკის სიმაღლე, შემოწმების სიმაღლის გადამოწმებას, ბლოკის სათაურის ჰეში, ანგარიშსწორების ჰეში და manifest root. რელიე დასაშვებია მხოლოდ მაშინ, როდესაც მას აქვს როგორც QC, ასევე ვალიდური FastPQ მტკიცებულების მასალა.

### AXT დამაკავშირებელი მათემატიკური {#axt-binding-math}

Nexus AXT კონვერტებისათვის, `AxtFastpqBinding` კანონიზირებულია მტკიცებულების განმეორებამდე. ცარიელი პარამეტრის მნიშვნელობები გათვალისწინებულია `fastpq-lane-balanced`; ცარიელი შემოწმებლის ID და ვერსია გათვალისწინებული არის `fastpq` და `v1`; პრეტენზიის ტიპი გადაჭრილია და ქვედა კატეგორიითაა შედგენილი.

AXT FastPQ საჯარო შესასვლელები არის დეტერმინისტური ბაიტების ჰაშები:

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

AXT გარდამავალი გასაღები არის:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` მოთხოვნაში შედის როლიანი დაფინანსების რიგები:

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

ნებართვის პოლიტიკის დამაკავშირებელი მეტა მონაცემების რიგით. `compliance` მოთხოვნაში შედის ორი მეტა მონაცემთა რიგები: ერთი პოლიტიკისა და მეორე სამიზნე მონაცემთა სფეროსთვის.

`tx_predicate` და `value_conservation`-ისათვის გამოიყენება გამოხატული ეფექტით გათვალისწინებული რაოდენობა, როდესაც ბმული შეიცავს პოზიტიურ წყარო ან მიმართულების რაოდენობას. წინააღმდეგ შემთხვევაში კოდი იღებს შეზღუდული დეტერმინისტური რაოდენობის:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

შემდეგ გამოიყენება იგივე გადაცემული განტოლებები:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

გამგზავნისა და მიმღების ანგარიშის სინთეტიკური ID-ები წარმოიქმნება საკვანძო მარცვლებიდან:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

გადარიცხვის პარტიის ჰეში არის:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT პარტიის მანიფესტის დიაგესი არის SHA-256 კანონიკური კავშირის კოდირების Norito ზე:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP გამჭვირვალე შეტყობინების მტკიცებულებები {#sccp-transparent-message-proofs}

SCCP დამხმარე ყუთში ასევე გამოიყენება FastPQ გამჭვირვალე ჯაჭვური შეტყობინებების დასამტკიცებლად. ეს გზა განცალკევებულია `irohad` ფონის პროვერიდან . Line. იგი აშენებს FastPQ პარტიას უშუალოდ SCCP შეტყობინების მტკიცებულების ბუნდიდან და manifesto- სგან, შემდეგ კი გახსნის შემოწმებისთვის მოიცავს მიღებულ მტკიცებულებას.

SCCP პარტიაში გამოიყენება `fastpq-lane-balanced` და სამი მეტადიტური გადასვლა:

|გასაღები |ოპერაცია |
| ------------------------------- | --------- |
|`sccp:transparent:v1:statement` |`MetaSet` |
|`sccp:transparent:v1:context` |`MetaSet` |
|`sccp:transparent:v1:payload` |`MetaSet` |

მისი საჯარო შეყვანილია SCCP გამჭვირვალე შიგნით მტკიცებულების მიხედვით:

|FastPQ შეყვანა | SCCP წყარო                                                |
| ------------- | ---------------------------------------------------------- |
|`dsid` |პირველი 16 ბიტი ბლეიკ2ბ-ის დიგესტზე განცხადების hash |
|`slot` |საბოლოო სიმაღლე |
|`old_root` |სასარგებლო ტვირთის ჰაში |
|`new_root` |ვალდებულების საფუძველი |
|`perm_root` |საბოლოო ბლოკი ჰაში |
|`tx_set_hash` |განცხადების ჰეში |

SCCP კანონიკური კოდერები წერენ მთელ რიცხვებს მცირე ზომის და კოდირებენ ცვლადი სიგრძის ბაიტების არეებს, როგორც:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

გამჭვირვალე საჯარო შესასვლელი ბაიტის სტრიკი არის:

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

გამჭვირვალე განცხადების ბაიტები არის ვერსიის კონკეტინაცია, ჯაჭვის ოჯახი, ადგილობრივი და პარტნიორი დომენები, უსაფრთხოების მოდელი, ანხრის მმართველობა, ანგარიშის კოდექი, საბოლოოობის მოდელი, ვერიფიკატორის მიზანი, ვერიფიკატორის უკანასკნელი ოჯახი, სიგრძის წინამდებარე ჯაჭვი / უკანასკნელი/მანიფესტული ველები, დანიშნულების შემაკავებელი ჰეში, ანგარიშის კოდექის გასაღები, სასარგებლო ტვირთის ტიპი, საჯარო შესვლის ბაიტები და სასარგებლოტვირთის ჰეში. განცხადების ჰეში არის:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

FastPQ მონაცემთა სივრცის ID ამ დამტკიცების გზა არის პირველი 16 ბაიტი სხვა prefixed Blake2b digest:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

SCCP FastPQ პარტია არის ზუსტად:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

შემდეგ განლაგებულია იმავე FastPQ ბრძანების წესით.

სააგენტო OpenVerify შემოწმების ვალდებულება: SHA-256 ზემოდან SCCP შეტყობინების უკანასკნელი სახელი და კანონიკური FastPQ შემოწმების დისკრიპტორი:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

ნედლეული FastPQ მტკიცებულება არის კოდირებული Norito-ში `StarkFriOpenProofV1`, შემდეგ შეფუთულია `OpenVerifyEnvelope`-ში backend-ით `Stark`. SCCP შემოწმება აღადგენს იგივე FastPQ პარტია ბუნთიდან და მანიფესტიდან, ამოწმებს ღია შემოწმების კონვერტის მეტა მონაცემებს და მოუწოდებს FastPQ შემოწმებელს განახლებული პარტისა და დამტკიცებულების შესახებ.

## პარამეტრების კომპლექტები {#parameter-sets}

კანონიკური პარამეტრების კატალოგი გამოყოფს ორი პარამეტრის ნაკრებს. მასპინძელი prover lane ამჟამად იყენებს `fastpq-lane-balanced`.

|პარამეტრი |მიზანი |სფერო |ჰაშები |FRI |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
|`fastpq-lane-balanced` |გაწონასწორებული პროვო-გასვლა |კვადრატული გაგრძელება Goldilocks |პოსეიდონის2 ვალდებულებები, კატალოგი SHA3  |მუხლი 8, აფეთქება 8, 46 შეკითხვა |
|`fastpq-lane-latency` |ლეტენციის მიმართულებით მგრძნობიარე ზოლები |კვადრატული გაგრძელება Goldilocks |პოსეიდონის2 ვალდებულებები, კატალოგი SHA3  |სარკე 16, გაფეთქება 16, 34 შეკითხვა |

ორივე სამიზნე 128-ბიტიანი უსაფრთხოება და გამოიყენოს ტრეის დომენის ზომა `2^16`. Rust V1 ტრანსკრიპტის განმეორების კოდი ამჟამად იღებს Fiat-Shamir გამოწვევის ბაიტები `iroha_crypto::Hash::new` ნაცვლად იმისა, რომ პირდაპირ მოითხოვოს SHA3-256.

კატალოგის ზუსტი კონსტანტები, რომლებიც გამოიყენება Rust პრეზერვატორით, არის:

|მუდმივი |`fastpq-lane-balanced` |`fastpq-lane-latency` |
| -------------------- | ---------------------: | --------------------: |
|`target_security` |                    128 |                   128 |
|`grinding_bits` |                     23 |                    21 |
|`trace_log_size` |                     16 |                    16 |
|`trace_root` |`0x002a247f81c6f850` |`0x6a9f4eb38fb9b892` |
|`lde_log_size` |                     19 |                    20 |
|`lde_root` |`0x60263388dbbf9b2a` |`0x9c9c3a571b6f89ac` |
|`permutation_size` |                 65,536 |                65,536 |
|`lookup_log_size` |                     19 |                    20 |
|`omega_coset` |`0x6af325e825ad5c18` |`0x3a5fd4171e3c3a4d` |
|`fri_arity` |                      8 |                    16 |
|`fri_blowup` |                      8 |                    16 |
|`fri_max_reductions` |                      8 |                     6 |
|`fri_queries` |                     46 |                    34 |

## კონფიგურაცია {#configuration}

FastPQ კონფიგურაცია განთავსებულია `zk.fastpq` ქვეშ.

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

ამავე განხორციელებისა და ტელემეტრიის ეტიკეტების გადატანა შესაძლებელია `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

გარემოს ცვლადი ასევე მხარდაჭერილია კონფიგურაციის ველებისათვის. FastPQ-ს სპეციფიკური ცვლადი მოიცავს:

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

## მაჩვენებლები {#metrics}

ტელემეტრიის ჩართვისას FastPQ ექსპორტებს ბეიკენდის შერჩევისა და Metal runtime ქცევების მაჩვენებლებს:

|მეტრიკული |მნიშვნელობა.|
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |მოთხოვნილი და გადაჭრილი შესრულების რეჟიმი ბეიკენდის და მოწყობილობის ეტიკეტების მიხედვით |
|`fastpq_poseidon_pipeline_total` |მოთხოვნილი და გადაჭრილი პოსეიდონის მილსადენის გზა |
|`fastpq_metal_queue_depth` |მეტალის რიგის ლიმიტი, მაქსიმალური რაოდენობა ფრენის დროს, გამგზავრების რაოდენობა და ნიმუშების აღება |
|`fastpq_metal_queue_ratio` |ლითონის რიგები დატვირთული და გადახრილების შედარებები |
|`fastpq_zero_fill_duration_ms` |მასპინძელი ნულოვანი შევსების ხანგრძლივობა მეტალის run |
|`fastpq_zero_fill_bandwidth_gbps` |გამოთვლილი ნულოვანი შეავსების ზღვრის სიგანე |

ზოგადი შესრულების განსაზღვრისთვის, გამოიყენეთ ისინი კონსენსუსის და რიგითი სიგნალებით, რომლებიც მოცემულია [შესრულება და მაჩვენებლები](/ka/guide/advanced/metrics.md).

## დაკავშირებული რეფერენცია {#related-reference}

- [გენერირებული ტიპის დეტალების მონაცემთა მოდელის სქემა ](/ka/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ ვარიანტები](/ka/reference/irohad-cli.md#arg-fastpq-execution-mode)
