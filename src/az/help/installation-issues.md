---
translation_locale: az
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# quraşdırma problemlərinin həllinə {#troubleshooting-installation-issues}

Bu bölmədə problemlərin aradan qaldırılması üçün məsləhətlər təqdim olunur Iroha 3 Əgər sizin yaşadığınız problem burada təsvir edilmirsə, bizimlə əlaqə saxlayın. [Teleqram](https://t.me/hyperledgeriroha).

## Sürətli yoxlamalar {#quick-checks}

Ən çox quraşdırma uğursuzluqları dörd yerdən birindən gəlir:

- bir Rust vasitə zənciri yuxarı axını iş sahəsi tərəfindən bağlanmış versiyadan daha qədimdir
- `cargo` və ya `rustc` başqa bir qurğuda həll edilən `rustup`
- C kompileri, `pkg-config` və ya CMake kimi sistem qurma alətləri yoxdur.
- mənbə düzəlişlərinin dəyişdirilməsindən sonra köhnə istehsal olunan parçalar və ya yerli inşaat əşyaları

Iroha mənbə hesabından aşağıdakılarla başlayın:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Əgər `cargo metadata` uğursuz olarsa, `pnpm refresh:iroha --source /path/to/iroha` işlətmədən əvvəl yerli alət zəncirini düzəldin, çünki yeniləmə mövcud məlumat modelləri sxeminin yaradılması üçün Kagami-ni çağırmaq mümkündür.

## Problemlərin aradan qaldırılması Rust Əsər silsiləsi {#troubleshooting-rust-toolchain}

Bəzən işlər planlandığı kimi getmir, xüsusən də əgər `rust` bir müddət əvvəl sisteminizdə, lakin yeniləmədi. Python: XKCD Bunun necə göründüyünü göstərən məşhur bir nümunə var:

<div class="flex justify-center">

![Python ətraf mühitdə problemlərin aradan qaldırılması komik](/img/install-troubles.png)

</div>

### Rust versiyasını yoxlayın. {#check-rust-version}

Həm sizin, həm də bizim sağlamlığımızın qorunması məqsədi ilə düzgün versiyaya sahib olduğunuza əmin olun. `cargo` düzgün versiyası ilə cütləşdirilir `rustc`. Hal-hazırda yuxarı axın iş məkanı elan edir `rust-version = "1.92"` və vasitə zəncirinin kanalını bağlayır `rust-toolchain.toml`. Versiyaları göstərmək üçün,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

və sonra

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Əgər daha yüksək versiyalarınız varsa, yaxşısınız. Daha aşağı versiyalarınız varsa, onu yeniləmək üçün aşağıdakı əmrini icra edə bilərsiniz:

```bash
$ rustup toolchain update stable
```

### quraşdırma yerini yoxlayın {#check-installation-location}

Əgər aşağı versiya nömrələrini əldə etsəniz və vasitə zəncirini yeniləyirsəniz və bu işləməsəydi... deyək ki, bu ümumi bir problemdir, lakin ümumi həll yolu yoxdur.

Birincisi, istifadə etmək istədiyiniz versiyanın yerləşdiyi yeri müəyyənləşdirməlisiniz:

```bash
$ rustup which rustc
$ rustup which cargo
```

Əməliyyat silsilələrinin istifadəçi quraşdırmaları adətən `~/.rustup/toolchains/stable-*/bin/` -dədir.

```bash
$ rustup toolchain update stable
```

Bu da sizin problemlərinizi həll etməlidir.

### Standart Rust versiyasını yoxlayın. {#check-the-default-rust-version}

Başqa bir seçim, yenilənmiş `stable` vasitə zəncirinin olmasıdır, lakin standart olaraq təyin olunmur.

```bash
$ rustup default stable
```

Bu, `nightly` versiyasını quraşdırsanız və ya müəyyən Rust versiyasını təyin etsəniz, amma onu un-set etməyi unutduğunuz təqdirdə baş verə bilər.

### Digər Rust versiyalarının olub olmadığını yoxlayın. {#check-if-there-are-other-rust-versions}

Qonaq çuxurunun problemlərinin həlli ilə davam edərək, şal adı da ola bilər:

```bash
$ type rustc
$ type cargo
```

Əgər bunlar `rustup which *` işləyərkən gördüyünüzdən başqa yerlərə göstərirsə, onda bir probleminiz var.

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

Çünki şell adlarını necə yenidən düzəltdiyindən asılı olmayaraq, pozula biləcək daxili bir məntiq var.

Ən sadə həll, istifadə etmədiyiniz versiyaları çıxarmaqdır.

Bununla belə, rustup-nin bütün quraşdırılmış və sizin üçün mövcud olan versiyalarının izləməsini nəzərdə tutur. Adətən yalnız iki var: Bu təlimatın əvvəlində komandanı icra etdiyiniz zaman sistem paketləri menecerinin versiyası və ev qovluğunuzda standart yerə quraşdırılan bir versiya. Birincisi üçün (Linux) paylama kitabınıza baxın, `apt remove rust`).

```bash
$ rustup toolchain list
```

Və sonra, hər `<toolchain>` üçün (təbii ki açı bracketləri olmadan):

```bash
$ rustup remove <toolchain>
```

Bundan sonra əmin olun ki,

```bash
$ cargo --help
```

bir əmr tapılmamış səhvə səbəb olur, yəni aktiv Rust vasitə zəncirinin quraşdırılmadığı. Sonra:

```bash
$ rustup toolchain install stable
```

## Problemlərin aradan qaldırılması Python alət silsiləsi {#troubleshooting-python-toolchain}

Tətbiqini quraşdırarkən Python Döyüş zamanı pipi istifadə edən təkər paketi [Python müştərinin quruluşu](/az/guide/tutorials/python.md), "İroha" kimi səhvə yol aça bilərsiniz._Piton-*.whl bu platformada dəstəklənmiş təkər deyil".

Bu səhv pip-in köhnə olduğu deməkdir, buna görə də onu yeniləməlisiniz. İlk növbədə OS -ni yeniləmələr üçün yoxlamaq və sistem təkmilləşdirilməsi etmək tövsiyə olunur.

Əgər bu işə yaramırsa, istifadəçi dizini üçün `pip` yeniləməsini cəhd edə bilərsiniz.

`python -m pip install --upgrade pip`

Əmin olun ki, `pip` Bunu etmək üçün işlətmək lazımdır. `whereis pip` və yoxlayın: `/home/username/.local/bin/pip` Əgər yoxdursa, qabığınızı yeniləyin. `PATH` dəyişən.

Əgər problem davam edərsə, xahiş edirik [ ilə əlaqə saxlayıb ](/az/help/) çıxışlarını bildirin.

```
python --version
python3 --version
pip --version
pip3 --version
```
