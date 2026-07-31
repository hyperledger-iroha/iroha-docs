---
translation_locale: ka
translation_source: /blockchain/fastpq.md
translation_source_hash: f1dc55e4b2146de009203e19adb5cc1e9ce5302bc0ee27fe0b442693c5112c22
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# FastPQ {#fastpq}

FastPQ არის Iroha ეს არის STARK გამონათქვამები.
არ შეიცავს ტრანზაქციის ჩვეულებრივ შესრულებას ან კონსენსუსს.
გაქცევა ISI, IVM, და Sumeragi როგორც ყოველთვის; FastPQ მოიხმარს
დეტერმინისტური აღსრულების მოწმე და ბრუნდება მხარდაჭერილი ეფექტები მტკიცებულებად
ბარათები.

მიმდინარე მასპინძელი ინტეგრაცია აქვს სამი ძირითადი გზა:

- ბლოკის შესრულების დროს დაფიქსირებული გამჭვირვალე ციფრული აქტივების ტრანსფერები
- Nexus დადასტურებული ზოლის რელიეები, რომელთა AXT მტკიცებულების კონვერტში ა.შ. FastPQ
  დამაკავშირებელი
- SCCP გამჭვირვალე შეტყობინების დამტკიცების დამხმარეები, რომლებიც ა FastPQ მტკიცებულება
  ღია შემოწმების ჩარჩო

## საქმის კურსის გადაცემა {#transfer-witness-path}

გამჭვირვალე ციფრული ტრანსფერები ქმნის სტრუქტურირებულ ტრანსფერს, როდესაც
მუტაციური ინსტრუქცია ბალანსებს აცვლის.

- საწყისი ანგარიში, მიზნობრივი ანგარიში, აქტივების განსაზღვრა და თანხა
- გამგზავრისა და მიმღების ბალანსი გადაცემის წინასა და შემდეგ
- ტრანზაქციის შესასვლელი პუნქტის ჰეში, რომელიც გამოიყენება პარტიის ჰეშად
- საანგარიშო ანგარიშიდან მიღებული ავტორიტეტის დეგესტი
- პოსეიდონის დიჟეტი ერთდელის ტრანსკრიპტებისთვის

პარტიების გადაცემებში გამოიყენება ერთი ტრანსკრიპტი მრავალ დელტასთან ერთად.
პოსეიდონის ერთ-დელტური დეგესტი არ არსებობს.

ბლოკის ფინალიზაციისას, Iroha ამ ტრანსკრიპტებს შესასვლელი პუნქტის ჰეშით დააკომპლექტეთ.
სიკვდილით დასჯის მოწმე შემდეგ ატარებს ორიგინალური ტრანსკრიპტის ბუნდებს და
დასახელება FastPQ სატრანზიტო პარკები, რომლებიც მზადდება პროვერისთვის.

თითოეული გადაცემის დელტა ხდება ორი გარდამავალი რიგები:

| რიგები             | მთავარი ფორმა                                        | წინასწარი ღირებულება               | შემდგომ ღირებულება             |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| გამგზავრებელი დებითი    | `asset/<asset-definition>/<source-account>`      | გამგზავნის ბალანსი ადრე   | გამგზავნის ბალანსის შემდეგ   |
| მიმღების კრედიტი | `asset/<asset-definition>/<destination-account>` | მიმღების ბალანსი ადრე | მიმღების ბალანსი შემდეგ |

ციფრული მნიშვნელობები ნორმალიზებულია მთელი რიცხვების ერთეულებად.
უარი FastPQ პარტინგი, თუ იგი არ შეიძლება იყოს წარმოდგენილი როგორც ნეგატიური
`u64` შერჩეული დეციმალური მასშტაბით.

## საჯარო შემოტანები {#public-inputs}

ყველა FastPQ გარდამავალი პარტია ატარებს საჯარო შეყვანას, რომელიც ამტკიცებს
ბლოკისა და შესრულების კონტექსტი:

| შემოტანა         | მნიშვნელობა                                                         |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | მონაცემთა სივრცის იდენტიფიკატორი კოდირებული როგორც მცირე ზომის ბაიტები             |
| `slot`        | ბლოკის შექმნის დრო ნანოსეკონდებად გარდაიქმნა                    |
| `old_root`    | მშობლიური სახელმწიფოს ფესვი აღსრულების მოწმისგან            |
| `new_root`    | საგარეო საქმეთა სამინისტრო              |
| `perm_root`   | პოსეიდონის ვალდებულება აქტიური როლის ნებართვის შესახებ                |
| `tx_set_hash` | ჰაში დარიგებული ტრანზაქციისა და დროის გამოწვევის შესასვლელი პუნქტის ჰაშები |

მასპინძელი იყენებს `fastpq-lane-balanced` როგორც კანონიკური პარამეტრი დადგენილი
ეს პარკები.

## მათემატიკური მოდელი {#mathematical-model}

ამ განყოფილებაში აღწერილია არითმეტიკის დანერგვა მიმდინარე Rust
ყველა საველე ოპერაცია ქვემოთ არის ოქროს თხევადზე
ძირითადი ველი:

$$
F = \mathbb{F}_p,\qquad p = 2^{64} - 2^{32} + 1
$$

FastPQ გამოიყენება Poseidon2 ზე `F` საველე ვალდებულებებისათვის. სპონგს აქვს სიგანე
`t = 3`, განაკვეთი `r = 2`, და სიმძლავრე `1`. ჰეში შეწევს ველის ელემენტებს
rate-2 ბლოკები და დამატება ერთი ველის ელემენტი `1` ფინალამდე
პერმუტაცია:

$$
H_F(x_0,\ldots,x_{m-1}) =
\operatorname{Poseidon2}_F(x_0,\ldots,x_{m-1},1)
$$

ბაიტური სიმბოლოები შეფუთულია 7-ბაიტიან პატარა ენდიანულ კიდურებში, ასე რომ თითოეული კიდეა
მკაცრად ქვემოთ `p`:

$$
\operatorname{pack}(b)_j =
\sum_{i=0}^{6} b_{7j+i}2^{8i},\qquad 0 \leq \operatorname{pack}(b)_j < p
$$

დომენებით გამოყოფილი ველების ჰეშები წარმოდგენილია, როგორც:

$$
H_D(m) =
H_F(
|\operatorname{pack}(D)|,\operatorname{pack}(D),
|\operatorname{pack}(m)|,\operatorname{pack}(m)
)
$$

ბაიტ-დომენის დიჟეტებისგან დაწყებული ჰეშისათვის, FastPQ რუკა პირველი რვა
პატარა ენდიანული ბაიტები ველში:

$$
\operatorname{seed}(D)=
\operatorname{le64}(\operatorname{Hash}(D)[0..8])\bmod p
$$

აქ. `Hash` საშუალებები Iroha ეს არის `iroha_crypto::Hash::new`, 32-ბაიტიანი Blake2bVar
აღჭურვილი, თუ ფორმულაში არ არის გამოხატული Poseidon2 ან SHA-256.

### სფეროს არითმეტიკა {#field-arithmetic}

სააგენტო Rust კოდი წარმოადგენს ველის ელემენტებს როგორც კანონიკურ `u64` ღირებულებები
`[0,p)`. დამატება და გამოყოფა არის:

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

Goldilocks შემცირება შემდეგ იყენებს იდენტობა:

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

განხორციელება პირობითად ამატებს ან ამცირებს `p` სანამ შედეგი არ იქნება
კანონიკური. ხელმოწერილი მთლიანი რიცხვები, როგორიცაა ბალანს დელტა, ჩასმულია:

$$
\operatorname{field}(x)=x\bmod p,\qquad 0\leq\operatorname{field}(x)<p
$$

### პოსეიდონის 2 პერმუტაცია {#poseidon2-permutation}

პოსეიდონის2 პერმუტაციის მდგომარეობაა:

$$
\mathbf{x}=(x_0,x_1,x_2)\in F^3
$$

მის S-ბოქსშია:

$$
S(x)=x^5
$$

FastPQ ოთხი სრული რაუნდი, 57 ნაწილობრივი რაუნდი და კიდევ ოთხი.
მთლიანი ტურები. სრული ტური მრგვალი კონსტანტებით
`c_r = (c_{r,0}, c_{r,1}, c_{r,2})` არის:

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

ყველა დამატება და გამრავლება შედის `F`. კანონიკური MDS მატრიცა არის:

$$
M=
\begin{bmatrix}
\texttt{0x982513a23d22b592} & \texttt{0xa3115db8cf1d9c90} & \texttt{0x46ba684b9eee84b7}\\
\texttt{0xbe3dce25491db768} & \texttt{0xfb0a6f731943519f} & \texttt{0xfce5bd953cde1896}\\
\texttt{0xe624719c41eb1a09} & \texttt{0xd2221b0f1aa2ebc4} & \texttt{0x1ab5e60d03ad44bc}
\end{bmatrix}
$$

ველის ჰეში იწყება ნულოვანი მდგომარეობიდან. თითოეული სრული ბლოკი - 2
`(u,v)`:

$$
(x_0,x_1,x_2)\leftarrow
\operatorname{Poseidon2}(x_0+u,x_1+v,x_2)
$$

საბოლოო ბლოკი შედის `1` საფარის ელემენტი ბოლო ერთის წინ
პერმუტაცია. გამოსავალი არის `x_0`.

### საჯარო შეღწევების ვალდებულება {#public-input-binding}

მასპინძელი კოდირებს მონაცემთა სივრცის ID დაწერით მისი `u64` ღირებულება პირველში
16 ბაიტის ველის 8 პატარა ენდიანული ბიტი:

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

ტრანზაქციის ნაკრები ჰეში არის ბაიტ-დომენის ჰეში შეკვეთილ შესასვლელ პუნქტზე
ჰაშები:

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq:v1:tx\_set}\|h_0\|\cdots\|h_{n-1}
)
$$

სად `h_i` არის დალაგებული ტრანზაქცია და დროის გამოწვევის შესასვლელი წერტილი hashes.
საჯარო მტკიცებულება IO, თუ `perm_root` ან `tx_set_hash` არის ყველა ნული,
პროვერი შეავსებს ჩამოვარდნის მნიშვნელობებს:

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

თითოეული გადაცემის დელტისთვის მიზნობრივი დეციმალური მასშტაბი არის მაქსიმალურად მოჭრილი
სარეკლამო მოცულობა თანხის მასშტაბით და ორივე ბალანსის სურათები:

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

ა `Numeric` ღირებულება mantissa- ით `m` და მასალა `q` მიიღება მხოლოდ მაშინ, როდესაც
`m >= 0` და `q <= s`. მისი FastPQ მოწმეების ღირებულება არის:

$$
\operatorname{norm}_s(m,q)=m\cdot10^{s-q}
$$

ნორმალიზებული შედეგი უნდა შეესაბამებოდეს `u64`.

### კანონიკური ბრძანება {#canonical-ordering}

ტრეის კონსტრუქციის წინ, პარტია გადასვლის გასაღების მიხედვით ხდება დალაგება, მუშაობა
რანგის და ორიგინალური ჩასმის ინდექსის მიხედვით:

$$
r(\operatorname{Transfer})=0,\quad
r(\operatorname{Mint})=1,\quad
r(\operatorname{Burn})=2,\quad
r(\operatorname{RoleGrant})=3,\quad
r(\operatorname{RoleRevoke})=4,\quad
r(\operatorname{MetaSet})=5
$$

ოჲჟეიდჲნ2 ფჲლზეა ჰაჟი დომენზე
`fastpq:v1:ordering` და Norito დალაგებული გადასვლის კოდირება:

$$
\operatorname{ordering\_hash} =
H_F(
|P(D_o)|,P(D_o),|P(E(T^\star))|,P(E(T^\star))
)
$$

სად `P` არის 7-ბაიტიანი შეფუთვა, `E` არის Norito კოდირება, `D_o` არის
`fastpq:v1:ordering`, და `T*` არის დალაგებული გადასვლის სია.

### ტრანსფერული თანაბარიანებები {#transfer-equations}

გადარიცხვის თანხისათვის `a`, გამგზავნის ბალანსი `f`, და მიმღების ბალანსი `t`,
FastPQ ადასტურებს ნორმალიზებული მოწმეების ღირებულებებს, სანამ კვალი შედგება:

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

კვალზე, ხელმოწერილი დელტა შემცირებულია `F`:

$$
\delta_i = (\operatorname{post}_i - \operatorname{pre}_i)\bmod p
$$

ამომრჩეველი ერთი დელტური გადაცემის დიგესტი აპირებს კოდირებულ გადაცემას
წინასწარი სურათი:

$$
d_{\text{transfer}} =
\operatorname{PoseidonHashBytes}(
E(\text{from})\|E(\text{to})\|E(\text{asset})\|E(a)\|\text{batch\_hash}
)
$$

მულტი-დელტას გადაცემის ტრანსკრიპტებისათვის, მიმდინარე ფორმატი მოითხოვს:
უმაღლესი დონის საჭმლის მონელება არ უნდა იყოს.

მასპინძელი ორგანო გადაცემის ტრანსკრიპტებისთვის:

$$
d_{\text{authority}} =
\operatorname{Hash}(\texttt{iroha:fastpq:v1:authority|}\|E(\text{authority\_account}))
$$

### საძიებო რიგები {#trace-rows}

შეავსეთ გადასვლის ჩამონათვალი `n` რეალური რიგები. კვალი სიგრძე არის
შემდეგი ორის ძალა:

$$
N = 2^{\lceil\log_2(\max(1,n))\rceil}
$$

რიგები `0..n-1` აქტიური; რიგები `n..N-1` ყველა რეალურ რიგში არის
ერთი ოპერაციის სელექტორის კომპლექტი:

$$
s_{\text{active}} =
s_{\text{transfer}}+
s_{\text{mint}}+
s_{\text{burn}}+
s_{\text{role\_grant}}+
s_{\text{role\_revoke}}+
s_{\text{meta\_set}}
$$

ყველა სელექტორის კოლონა არის ბულური:

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

მშენებელი ასევე აკონტროლებს დელტას გატარებას აქტივზე:

$$
R_i(a)=R_{i-1}(a)+\delta_i
\quad\text{for transfer, mint, and burn rows of asset }a
$$

მხოლოდ მენტისა და დამწვარი რიგების განახლება მიწოდების მაჩვენებლის:

$$
S_i(a)=S_{i-1}(a)+
\begin{cases}
\delta_i,& \text{if row }i\text{ is mint or burn}\\
0,& \text{otherwise}
\end{cases}
$$

მეტა მონაცემები და მონაცემთა სივრცის ტრეის კოლონები არის ველების ჰეშები, რომლებიც გამოიყვანეს რიგამდე
მატერიალიზაცია:

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

მეტა მონაცემთა ჰაში, მონაცემთა სივრცეების ჰაში და სლოტი სტაბილურია მიმდებარე
კვალიფიკაციის რიგები:

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

სატრანსფერო რიგები ატარებენ 32 დონეზე იშვიათი Merkle გზა. თუ მასპინძელი მტკიცებულება არის
დაკარგული, პროვერი სინთეზებს დეტერმინისტურ გზას რიგის გასაღებიდან,
წინასწარი ბალანსი და არის თუ არა რიგები გამგზავნელის ან მიმღების მხარე.

სინთეტიკური გზებისათვის, არომატური მარილი არის `fastpq:smt:from` გამგზავრებელი რიგებისათვის
და `fastpq:smt:to` მიმღები რიგებისათვის:

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

სინთეზური ფოთლი და შიდა კვანძები:

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

ტრეკ-ი აღნიშნავს ბიტს. `b_l`, ძმები `s_l`, შესასვლელი კვანძი `x_l`, და
გამონადენი კვანძი `x_{l+1}` ყოველ დონეზე. კოდის ფილიალის კონვენციით:

$$
(\operatorname{left}_\ell,\operatorname{right}_\ell)=
\begin{cases}
(s_\ell,x_\ell),& b_\ell=0\\
(x_\ell,s_\ell),& b_\ell=1
\end{cases}
$$

### ნებართვის ჰაშები {#permission-hashes}

როლების მინიჭება და მოხსნა ხაზები hash ნებართვის მოწმე:

$$
h_{\text{perm}} =
H_F(P(\operatorname{role\_id}\|\operatorname{permission\_id}\|\operatorname{epoch}_{le}))
$$

მასპინძელი ნებართვების ცხრილის ფესვის sorts შესავალები როლების ბაიტების, ნებართვა
ბაიტები და ეპოქის ბაიტები, შემდეგ აშენებს პოსეიდონ2 მერკლის ხეს:

$$
M_0[j]=h_{\text{perm},j}
$$

$$
M_{k+1}[j] =
H_F(\operatorname{seed}(\texttt{fastpq:v1:poseidon\_node}),M_k[2j],M_k[2j+1])
$$

საწინააღმდეგო სიგანის დონე ორჯერ აღადგენს ბოლო ელემენტს.

### კვალიფიკაციის ვალდებულება {#trace-commitment}

თითოეული კვალიანი სვეტისათვის `c`, FastPQ პირველი ინტერპოლებს სვეტის ღირებულებები over
კოეფიციენტის დომენი და ჰაშები:

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

საბოლოო კვალიფიკაციის ვალდებულება არის ბაიტის ჰეში დომენის, პარამეტრების ნაკრებში,
კვალიანი ფორმა, სვეტის დიგესტები და კვალიანი ძირი:

$$
\operatorname{commitment} =
\operatorname{Hash}(
\operatorname{len}(D_c)\|D_c\|
\operatorname{len}(\text{parameter})\|\text{parameter}\|
n\|N\|m\|C_0\|\cdots\|C_{m-1}\|R_{\text{trace}}
)
$$

სად `D_c` არის `fastpq:v1:trace_commitment`.

### AIR შემადგენლობა {#air-composition}

სააგენტო V1 AIR შემადგენლობის მნიშვნელობა არის ხაზოვანი ნაშთების ადგილობრივი ნაშთის კომბინაცია.
ტრანსკრიპტის ნიმუშები ორ გამოწვევას წარმოადგენს:

$$
\alpha_0,\alpha_1 \in F
$$

თითოეული მიმდებარე რიგის წყვილისათვის `(i,i+1)`, პროვერი ითვლის:

$$
A_i=\sum_j \alpha_{j\bmod2}\rho_{i,j}
$$

ნარჩენები `rho` არის, კოდური რიგით:

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

და სტაბილური პარტიის კონტექსტის სვეტები:

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

მამოწმებელი გადაანგარიშებს `A_i` შაბლონური ნომრის გახსნისთვის და მისი შემოწმებისათვის
შედგენილობის ღირებულებასთან მიმართებით, AIR შემადგენლობა Merkle
ფესვი.

### საძიებო პროდუქტი {#lookup-product}

ნებართვის ძიების აკუმულატორი იყენებს Fiat-Shamir გამოწვევას `gamma`.
მცირე ხარისხის გაფართოების შეფასებებზე `s_perm` და `perm_hash`, დასახელება
მიმდინარე პროდუქტი არის:

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

### დაბალი ხარისხის გაფართოება {#low-degree-extension}

დაუშვათ `omega_T` იყოს ტრეის-დომენის გენერატორი, `omega_E` დასახელება
შეფასების დომენის გენერატორი და `g` კონფიგურირებული კოსეტური ოფსეტი.
კვალიფიკაციური სვეტი ღირებულებებით `v_i`, ინტერპოლაცია წარმოქმნის კოეფიციენტებს `a_j`
ისეთი, რომ:

$$
f(\omega_T^i)=v_i
$$

დაბალი ხარისხის გაფართოება შეაფასებს იმავე პოლინომს კოსეტზე:

$$
\operatorname{LDE}_f(i)=f(g\cdot\omega_E^i)
$$

განხორციელებისას ამ კოეფიციენტების გამრავლება
კოსეტის კომპენსაცია ადრე FFT:

$$
a'_j = a_j g^j
$$

და შემდეგ შეფასება `a'` შეფასების სფეროში.

სააგენტო CPU FFT არის რადიქს-2 Cooley-Tukey ტრანსფორმაცია
ბიტისგან გადამხდარი შესასვლელები. სტადიის სიგრძეზე `L`, ნახევარი სიგრძე `H=L/2`, და სცენა
ფესვი:

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

პირიქით FFT აწარმოებს იგივე ტრანსფორმაცია `omega^{-1}` და წონილი,
ინვერსიული დომენის ზომა:

$$
\operatorname{IFFT}(x)=N^{-1}\cdot\operatorname{FFT}_{\omega^{-1}}(x)
$$

კატალოგის ფესვები გამოყენებამდე დამტკიცდება:

$$
\omega^{2^k}=1
$$

$$
\omega^{2^{k-1}}\ne1\qquad(k>0)
$$

კატალოგის ფესვიდან მიღებული უფრო მცირე დომენებისათვის გენერატორი არის:

$$
\omega_{\ell}=\omega_{\max}^{2^{k_{\max}-\ell}}
$$

### რიგის და ფოთლის ჰეშები {#row-and-leaf-hashes}

შემდეგ LDE, FastPQ hashes თითოეული რიგის ყველა LDE კოლონები. `m` სვეტები:

$$
r_i =
H_F(i,m,x_{i,0},x_{i,1},\ldots,x_{i,m-1})
$$

თუ რიგების ჰაშები კვლავ არის კვალი დომენზე, ვიდრე შეფასება
დომენი, პროვორი ინტერპოლებს და გაგრძელებს ამ ერთი რიგის hash კოლონა
იგივე კოსეტით LDE პროცესი.

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

უცნაური დონეების ორმაგი ბოლო კვანძი. შეკითხვის გზები შემოწმება hashing მარცხენა ან
სწორი მიხედვით შეკითხვის ფურცლის ინდექსის პარიტეტა თითოეულ დონეზე.

ფოთლისთვის ინდექსზე `i`, გზა `(s_0,\ldots,s_{d-1})` ადასტურებს
ფესვი `R` განმეორებით:

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

ჩექი გაიცემა მხოლოდ მაშინ, როდესაც:

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

სააგენტო LDE შეკითხვის გახსნა ასევე ამოწმებს, რომ ღირებულება გახსნილია შეფასების ინდექსზე
`i` არის მის დამოწმებულ ნაწილში:

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

FRI აპირებს AIR შემადგენლობის შეფასებები. თითოეული რაუნდისათვის `l`, დასახელება
ტრანსკრიპტის ნიმუშები გამოწვევა `beta_l`. ფენა არის დაფარული მრავალჯერადი
არითის ბოლო მნიშვნელობის განმეორებით. თითოეული არითის ზომის ჯგუფი ამცირებს:

$$
y_{l+1,j} =
\sum_{k=0}^{a-1} y_{l,ja+k}\beta_l^k
$$

სად `a` ეს არის FRI არიტეტი. მამოწმებელი ყველა შანსიანი შეკითხვისთვის ამოწმებს
ჯაჭვი, რომელიც:

$$
y_{l+1,\lfloor i/a\rfloor}
=
\sum_{k=0}^{a-1} y_{l,\lfloor i/a\rfloor a+k}\beta_l^k
$$

და ადასტურებს თითოეული გახსნილი FRI ჯგუფის წინააღმდეგ FRI ფენა
ფესვი.

### Fiat-Shamir გადაწერა {#fiat-shamir-transcript}

კანონიკური პარამეტრების კატალოგი ტაბლეტებს ტრანსკრიპტის hash როგორც SHA3-256.
ამჟამინდელი პროვერისა და ვერიფიკატორის დანერგვა გამოწვევის ბაიტების მიღება
`iroha_crypto::Hash::new`, რომელიც არის 32-ბაიტიანი Blake2bVar digest, მაშინ
შეამცირებს პირველ რვა პატარა ენდიან ბაიტს `F`:

$$
\chi(\text{tag}) =
\operatorname{le64}(\operatorname{Hash}(\text{state}\|\operatorname{len}(\text{tag})\|\text{tag})[0..8])
\bmod p
$$

რთული ზარები მთლიანად შეავსებს დეგესტს ტრანსკრიპტის მდგომარეობაში.
რიგითი შედგება:

1. საზოგადოება IO, პროტოკოლის ვერსია, პარამეტრის ვერსია და პარამეტრების სახელი
2. LDE ფესვი და კვალი
3. `gamma`
4. AIR კომპოზიციის გამოწვევები `alpha_0`, `alpha_1`
5. AIR კვალიანი ფესვი და AIR შემადგენლობის ფესვი
6. საძიებო grand პროდუქტი
7. FRI ფენის ფესვები და `beta_l` გამოწვევები
8. შეკითხვის ინდექსების შანსი

შეკითხვის ნიმუშების მიღება აგრძელებს 32-ბაიტიანი გამოწვევის დიჟეტების დათვალიერებას და კითხვას როგორც
პატარა ენდიანი `u64` ცირკულები, სანამ მას არ აქვს მოთხოვნილი უნიკალური ნომერი
ინდექსი:

$$
q = \operatorname{le64}(\text{digest chunk})\bmod N_{\text{eval}}
$$

ნიმუშების შერჩეული კომპლექტი დაბრუნდება დალაგებული რიგით.

### გადათამაშება {#verifier-replay}

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

აგრეთვე აღადგენს საზოგადოებას IO:

$$
\operatorname{PublicIO}=
(\operatorname{dsid},\operatorname{slot},\operatorname{old\_root},
\operatorname{new\_root},\operatorname{perm\_root},
\operatorname{tx\_set\_hash},\operatorname{ordering\_hash},
\operatorname{permission\_hashes})
$$

თითოეული ველი უნდა შეესაბამებოდეს მტკიცებულების საჯარო IO ბაიტი-ბაიტზე.
შემდეგ იგი იმავე ტრანსკრიპტის რეკონსტრუქციას ახდენს და იმავეს იღებს:

$$
\gamma,\quad \alpha_0,\alpha_1,\quad
\beta_0,\ldots,\beta_{\ell-1},\quad
q_0,\ldots,q_{t-1}
$$

თითოეული შანსიანი გამოკითხვისთვის `q`, ეს შეამოწმებს:

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

სააგენტო AIR კომპოზიციის გახსნა უნდა ავთენტიფიცირდეს `R_air_composition`.
სააგენტო FRI ჯაჭვი მაშინ იწყება იგივე `A_q` და უნდა დასრულდეს
დამადასტურებელი საბოლოო FRI ფოთლი ტერმინალის ქვეშ FRI ფესვი.

## რას შეამოწმებს ანდაზა {#what-the-prover-checks}

მანამდე, სანამ კვალი დადგება, FastPQ პროვირი კანონიზებს პარტიის წესრიგს
გადასვლის გასაღების, ოპერაციის რანგისა და ჩასმის რეჟიმით. გადაცემის რიგები ასევე
მოითხოვს გადაწერის მეტა მონაცემებს. პარტია, რომელსაც აქვს გადაცემის რიგები, მაგრამ არ აქვს გადაცემა
თარგმანი არასწორია.

გადარიცხვის ტრანსკრიპტებისათვის, პროვოკატორის გვერდითი შემოწმებები მოიცავს:

- გამგზავნის ბალანსი არ უნდა იყოს ნაკადის ქვემოთ
- `sender_after` უნდა იყოს თანაბარი `sender_before - amount`
- `receiver_after` უნდა იყოს თანაბარი `receiver_before + amount`
- ტრანსკრიპტი უნდა მოიცავდეს პარტიის თითოეულ გადაცემულ რიგს.
- ერთი დელტაში მყოფი პოსეიდონის დიგესტი, როდესაც არსებობს, უნდა შეესაბამებოდეს ტრანსკრიპს
  წინასწარი სურათი
- გათვალისწინებით, იშვიათი მარკლის მტკიცებულებების დეკოდირება უნდა მოხდეს ვერსიით 1; დაკარგული გზები არის:
  დამზადებულია დეტერმინისტური სინთეტიკური მტკიცებულებებით

კვალი შეიცავს სელექტორულ კოლონებს გადასატანად, მენტისთვის, წვისთვის, როლების მინიჭებისთვის,
როლების გაუქმება, მეტა მონაცემთა ნაკრები და ნებართვის ძიების რიგები. ციფრული ოპერაცია
რიგები ასევე ატარებენ ხელმოწერილ დელტებს, რომლებიც ფუნქციონირებს აქტივზე დელტებზე და მიწოდებას
მაჩვენებლები.

## პრობერ ლეინი {#prover-lane}

`irohad` იწყება FastPQ პროვერი ლეინი startup თუ პროვერი backend შეუძლია
ინიციალიზებული უნდა იყოს. ზოლი არის ფონის ამოცანა, რომელსაც აქვს შეზღუდული რიგები.
ბლოკი წარმოადგენს სიკვდილით დასჯის მოწმე, დანაშაულის გზა წარუდგენს დამტკიცების სამუშაოს
რომელიც შეიცავს ბლოკის ჰეშს, სიმაღლეს, ხედვას და მოწმეებს.

თუ ზოლი არ მუშაობს ან რიგები სავსეა, სამუშაო გადაიდება და
ნორმალური ბლოკების დამუშავება გრძელდება. ეს ნიშნავს, რომ ფონის პროვორსის ზოლი არის
ეს არ არის ტრანზაქციის მიღება ან კონსენსუსის კარი. ეს არის მტკიცებულების წარმოება
საფეხურზე მოძრაობა, რომელიც უკვე განხორციელდა.

ზოლი აშენებს პროვერს:

```text
parameter = "fastpq-lane-balanced"
execution_mode = auto | cpu | gpu
poseidon_mode = auto | cpu | gpu
```

`auto` საშუალებას აძლევს მკვლევარს აირჩიოს ხელმისაწვდომი ბაქტენდი. `cpu` პინების შესრულება
სააგენტო CPU. `gpu` უპირატესობა GPU აღსრულება, CPU შემოვარდნა, სადაც
backend ვერ იყენებს მოთხოვნილ ბირთვებს.

## შემოწმება {#verification}

FastPQ მტკიცებულების შემოწმება აღადგენს კანონიკური პარტიის ვალდებულებას და
საჯარო ტრანსკრიპტის გადაცემა. შემოწმება პროტოკოლის ვერსიას,
პარამეტრების დადგმული ვერსია, განმეორების ლიმიტები, კვალიფიკაციის ჩართულობა, საჯარო შეყვანები,
ნიმუშით გამოტანილი მერკლის ღია კედლები, AIR ღილაკები და FRI შეკითხვის ქსელი.

გათვალისწინებული შეზღუდვები მოიცავს:

| ლიმიტი              | დეფოლტი |
| ------------------ | ------: |
| გადასვლის რიგები    |     256 |
| პარტიის სასარგებლო ტვირთის ზომა | 256 KiB |
| FRI ფენები         |      16 |
| გამოკითხვის ღია ადგილები     |     128 |

## Nexus შემოწმებული რელეები {#nexus-verified-relays}

Nexus AXT მტკიცებულების კონვერტებს შეუძლიათ ჩასვათ `AxtFastpqBinding`. როდესაც
`RegisterVerifiedLaneRelay` აღსრულებს, Iroha:

1. ადასტურებს ზოლის რელეის კონვერტს და FastPQ მტკიცებულების მასალა
2. შეამოწმებს მონაცემთა სივრცე და ღილაკის ფესვი
3. დეკოდირება AXT მტკიცებულების ფურცელი
4. მოითხოვს `fastpq_binding`
5. აღდგება FastPQ ამ ბმულიდან მიღებული პარტია
6. დეკოდირება ჩასმული FastPQ მტკიცებულება
7. ეძახიან FastPQ აღდგენილი პარტიის შემოწმება და დამტკიცება

თუ შემოწმება წარმატებით დასრულდა, Iroha ინახება `VerifiedLaneRelayRecord`
რომელიც შეიცავს რელე რეფერენციას, ორიგინალურ კონვერტს, მტკიცებულების სასარგებლო ტვირთის ჰეშს;
შემოწმების სიმაღლე, მანიფესტური ფესვი და FastPQ მკაცრი.

ბილიკის რელე კონვერტები ასევე ატარებენ კომპაქტურ FastPQ მტკიცებულების მასალა.
არის მარშრუტის ID, მონაცემთა სივრცის ID, ბლოკის სიმაღლე, შემოწმება
სიმაღლე, ბლოკის სათაურის ჰაში, დასახლებაში ჰაში და manifest root.
შეკრება დასაშვებია მხოლოდ მაშინ, როდესაც მას აქვს ორივე QC და მოქმედი FastPQ მტკიცებულება
მასალა.

### AXT დამაკავშირებელი მათემატიკური {#axt-binding-math}

სამედიცინო Nexus AXT კონვერტები, `AxtFastpqBinding` მტკიცებულებამდე კანონიზებულია
გამეორება. ცარიელი პარამეტრის მნიშვნელობები `fastpq-lane-balanced`; ცარიელი
შემოწმების ID და ვერსია `fastpq` და `v1`; მოთხოვნის ტიპი გადაჭრილია
და შემცირებული.

სააგენტო AXT FastPQ საჯარო შეყვანები არის დეტერმინისტური ბაიტების ჰაშები:

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

სააგენტო `authorization` პრეტენზიის შემადგენლობაში შედის როლ-გარდნის რიგები:

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

და metadata რიგით, რომელიც binding ავტორიზაციის პოლიტიკა. `compliance` პრეტენზია
ჩასვამს ორი მეტა მონაცემების რიგები: ერთი პოლიტიკისა და მეორე სამიზნე მონაცემთა პალატებისთვის.

სამედიცინო `tx_predicate` და `value_conservation`, ზეპირი ეფექტიანი თანხა:
გამოიყენება მაშინ, როდესაც ბმული შეიცავს დადებით წყაროს ან მიმართულების რაოდენობას.
სხვა შემთხვევაში კოდი იღებს დაზღვეული დეტერმინისტური რაოდენობა:

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

შემდეგ გამოიყენება იგივე გადაცემის განტოლებები:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

გამგზავნისა და მიმღების ანგარიშის სინთეტიკური ID-ები წარმოიქმნება საკვანძო თესლიდან:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

გადაცემის პარტიის ჰეში არის:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

სააგენტო AXT პარტიის მანიფესტური დიგესი არის: SHA-256 ზემოდან Norito კოდირება
კანონიკური კავშირი:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## SCCP გამჭვირვალე შეტყობინებების მტკიცებულება {#sccp-transparent-message-proofs}

სააგენტო SCCP დამხმარე ყუთი ასევე გამოიყენება FastPQ გამჭვირვალე ჯაჭვური შეტყობინებისათვის
ეს გზა გამოყოფილია `irohad` ფონზე პროვ. ლეინი
აწარმოებს FastPQ უშუალოდ ერთ-ერთი SCCP შეტყობინების დამტკიცების ბუნდი და
გამოხატავს, შემდეგ მოიცავს მიღებულ მტკიცებულებას ღია შემოწმებისთვის.

სააგენტო SCCP პარტიების გამოყენება `fastpq-lane-balanced` და სამი მეტა მონაცემების გადასვლა:

| გასაღები                             | ოპერაცია |
| ------------------------------- | --------- |
| `sccp:transparent:v1:statement` | `MetaSet` |
| `sccp:transparent:v1:context`   | `MetaSet` |
| `sccp:transparent:v1:payload`   | `MetaSet` |

მისი საჯარო შემოტანები წარმოიშობა SCCP გამჭვირვალე შიდა მტკიცებულება:

| FastPQ შემოტანა  | SCCP წყარო                                                |
| ------------- | ---------------------------------------------------------- |
| `dsid`        | პირველი 16 ბაიტი Blake2b დიგესტის ზე განცხადება hash |
| `slot`        | საბოლოო სიმაღლე                                            |
| `old_root`    | სასარგებლო ტვირთის ჰეში                                               |
| `new_root`    | ვალდებულების საფუძველი                                            |
| `perm_root`   | საბოლოო ბლოკის ჰეში                                        |
| `tx_set_hash` | განცხადების ჰეში                                             |

სააგენტო SCCP კანონიკური კოდერები წერენ მთლიანი რიცხვები პატარა-endian და კოდირება
ცვლადი სიგრძის ბაიტების მასაჟები, როგორიცაა:

$$
\operatorname{vec}(x)=\operatorname{le32}(|x|)\|x
$$

გამჭვირვალე საჯარო შესასვლელი ბაიტების სტრიკი არის:

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

გამჭვირვალე განცხადების ბაიტები არის ვერსიის კონკეტინაცია, ჯაჭვი
ოჯახური, ადგილობრივი და საპასუხო მხარეების დომენები, უსაფრთხოების მოდელი, ანკერული მმართველობა;
ანგარიშის კოდექი, საბოლოოობის მოდელი, ვერიფიკატორის სამიზნე, ვერიფიტორის ბაქენდის ოჯახი;
სიგრძის წინასწარი ჯაჭვის/გვერდის/მანიფესტის ველები, მიზნების დამაკავშირებელი ჰაში;
ანგარიშის კოდეკის გასაღები, სასარგებლო ტვირთის ტიპი, საჯარო შეყვანის ბაიტები და სასარგებლოტვირთის ჰაში.
განცხადება hash არის:

$$
\operatorname{statement\_hash} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:statement:v1}\|\operatorname{statement}
)
$$

სააგენტო FastPQ მონაცემთა სივრცის ID ამ მტკიცებულების გზა არის პირველი 16 bytes
კიდევ ერთი ბლეიკ2ბ-ის პრეფექციური დიგესტი:

$$
\operatorname{dsid} =
\operatorname{Blake2bVar}_{32}(
\texttt{sccp:transparent:fastpq:dsid:v1}\|\operatorname{statement\_hash}
)[0..16]
$$

სააგენტო SCCP FastPQ პარტია ზუსტად:

$$
(\texttt{sccp:transparent:v1:statement},\varnothing,\operatorname{statement},\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:context},\varnothing,E(\operatorname{inner\_proof}),\operatorname{MetaSet})
$$

$$
(\texttt{sccp:transparent:v1:payload},\varnothing,\operatorname{canonical\_payload},\operatorname{MetaSet})
$$

შემდეგ დალაგებული იგივე FastPQ ბრძანების წესი.

სააგენტო OpenVerify შემოწმების ვალდებულება SHA-256 ზემოდან SCCP შეტყობინების უკანასკნელი
სახელი და კანონიკური FastPQ შემოწმების დისკრეპტორი:

$$
\operatorname{vk\_hash} =
\operatorname{SHA256}(
\operatorname{message\_backend}\|\operatorname{verifier\_descriptor}
)
$$

ნედლეული FastPQ მტკიცებულება არის Norito-კოდირებულია `StarkFriOpenProofV1`, მაშინ
შეფუთული `OpenVerifyEnvelope` ბეიკ-ენდთან `Stark`. SCCP შემოწმება
აღდგება იგივე FastPQ პარტიიდან და მანიფესტში, შეამოწმებს
ღია გადამოწმების ეკიპაჟის მეტა მონაცემები და მოწოდებები FastPQ მტკიცებულების დამტკიცება
აღდგენილი პარტია და მტკიცებულება.

## პარამეტრების კომპლექტები {#parameter-sets}

კანონიკური პარამეტრების კატალოგი გამოყოფს ორი პარამეტრის ნაკრებს.
prover lane ამჟამად გამოიყენება `fastpq-lane-balanced`.

| პარამეტრი              | მიზანი                    | მინდორები                          | ხაშები                                      | FRI                             |
| ---------------------- | -------------------------- | ------------------------------ | ------------------------------------------- | ------------------------------- |
| `fastpq-lane-balanced` | გაწონასწორებული პროვერის გამტარობა | Goldilocks კვადრატული გაფართოება | პოსეიდონის2 ვალდებულებები, კატალოგი SHA3 ეტიკეტი | მუხლი 8, გაფეთქება 8, 46 კითხვა   |
| `fastpq-lane-latency`  | ლატენციურზე მგრძნობიარე ზოლები    | Goldilocks კვადრატული გაფართოება | პოსეიდონის2 ვალდებულებები, კატალოგი SHA3 ეტიკეტი | სეზონი 16, აფეთქება 16, 34 შეკითხვა |

ორივე სამიზნე 128-bit უსაფრთხოება და გამოიყენოს ტრეის დომენის ზომა `2^16`. სააგენტო
Rust V1 transcript replay კოდი ამჟამად იღებს Fiat-Shamir გამოწვევა
ბაიტები `iroha_crypto::Hash::new` ვიდრე პირდაპირ მოითხოვოს
SHA3-256.

კატალოგის ზუსტი კონსტანტები, რომლებიც გამოიყენება Rust პრეპარატებია:

| მუდმივი             | `fastpq-lane-balanced` | `fastpq-lane-latency` |
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

## კონფიგურაცია {#configuration}

FastPQ კონფიგურაცია არის ჩაფლული ქვემოთ `zk.fastpq`.

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

ამავე განხორციელებისა და ტელემეტრიის ეტიკეტების გადადება შესაძლებელია `irohad`:

```shell
irohad --fastpq-execution-mode auto
irohad --fastpq-poseidon-mode cpu
irohad --fastpq-device-class apple-m4
irohad --fastpq-chip-family m4
irohad --fastpq-gpu-kind integrated
```

კონფიგურაციის ველებისთვისაც მხარდაჭერა აქვს გარემოს ცვლადებს.
FastPQ-კერძო ცვლადი მოიცავს:

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

როდესაც ტელემეტრია ჩართულია, FastPQ ექსპორტის მონაცემები უკანა მხარის შერჩევისთვის და
მეტალის გამშვები დროის ქცევა:

| მეტრიკა                            | მნიშვნელობა                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| `fastpq_execution_mode_total`     | მოთხოვნილი და გადაჭრილი შესრულების რეჟიმი ბეიკენდის და მოწყობილობის ეტიკეტებით          |
| `fastpq_poseidon_pipeline_total`  | მოთხოვნილი და გადაჭრილი პოსეიდონის მილსადენის გზა                               |
| `fastpq_metal_queue_depth`        | ლითონის რიგის ზღვარი, მაქსიმალური რაოდენობა ფრენის დროს, გამგზავრების რაოდენობა და ნიმუშების აღება |
| `fastpq_metal_queue_ratio`        | ლითონის რიგის დატვირთვა და გადახვევის შედარებები                                         |
| `fastpq_zero_fill_duration_ms`    | მასპინძელი ნულოვანი სავსეობის ხანგრძლივობა მეტალური მიწოდებისათვის                                      |
| `fastpq_zero_fill_bandwidth_gbps` | წარმოშობითი ნულოვანი სავსების ზღვრის სიგანე                                                 |

ზოგადი შესრულების ტრიალაციისათვის გამოიყენეთ ისინი კონსენსუსთან და რიგით
სიგნალები, რომლებიც მოცემულია [შესრულება და მაჩვენებლები](/ka/guide/advanced/metrics.md).

## დაკავშირებული რეფერენცია {#related-reference}

- [მონაცემთა მოდელის სქემა](/ka/reference/data-model-schema.md) წარმოქმნილი ტიპისათვის
  დეტალი
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- `LaneFastpqProofMaterial`
- [`irohad` FastPQ არჩევანი](/ka/reference/irohad-cli.md#arg-fastpq-execution-mode)
