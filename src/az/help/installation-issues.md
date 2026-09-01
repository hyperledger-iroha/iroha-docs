---
translation_locale: az
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Quraşdırma Problemlərinin Həlli {#troubleshooting-installation-issues}

Bu bölmə Iroha 3 quraşdırılması üçün problem həll etmə məsləhətləri təklif edir. Əgər yaşadığınız problem burada təsvir edilməyibsə, bizə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə müraciət edin.

## Tez yoxlamalar {#quick-checks}

Quraşdırmanın uğursuz olmasının əksəriyyəti dörd yerdən birindən baş verir:

- upstream iş sahəsi tərəfindən təyin edilmiş versiyadan daha köhnə Rust alət zənciri
- `cargo` və ya `rustc` `rustup`-dən fərqli bir quraşdırmaya həll olunur
- C tərtibatçısı, `pkg-config` və ya CMake kimi sistem tikinti vasitələri çatışmır
- mənbə dəyişikliklərindən sonra köhnəlmiş yaradılmış parçalar və ya yerli quruluş artefaktları

Iroha mənbə kodunun işlək nüsxəsindən başlamaq:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Əgər `cargo metadata` uğursuz olarsa, `pnpm refresh:iroha --source /path/to/iroha`-i işə salmazdan əvvəl yerli alət zəncirini düzəldin, çünki yeniləmə mövcud məlumat modeli sxemini yaratmaq üçün Kagami-ni işə sala bilər.

## Problemlərin aradan qaldırılması Rust Alət zənciri {#troubleshooting-rust-toolchain}

Bəzən işlər planlandığı kimi getmir. Xüsusilə də əgər bir müddət əvvəl sisteminizdə `rust` olmuşdusa, amma yeniləməsəydiniz. Oxşar bir problem Python-də də baş verə bilər: XKCD-nin bunun necə görsənə biləcəyinə dair məşhur bir nümunəsi var:

<div class="flex justify-center">

![Python mühit problemlərinin həlli komik](/img/install-troubles.png)

</div>

### Rust versiyasını yoxlayın {#check-rust-version}

Həm sizin, həm də bizim ağlımızı qorumaq məqsədilə, `cargo`-ın doğru versiyasının `rustc`-in doğru versiyası ilə uyğunlaşdırıldığından əmin olun. Cari yuxarı axın iş sahəsi `rust-version = "1.92"`-ni elan edir və `rust-toolchain.toml`-də alət zənciri kanalını sabitləyir. Versiyaları göstərmək üçün bunu edin

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

və sonra

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Əgər sizdə daha yüksək versiyalar varsa, hər şey qaydasındadır. Əgər sizdə daha aşağı versiyalar varsa, onu güncəlləmək üçün aşağıdakı əmri işlədə bilərsiniz:

```bash
$ rustup toolchain update stable
```

### Quraşdırma yerini yoxlayın {#check-installation-location}

Əgər daha aşağı versiya nömrələri əldə edirsinizsə və siz alət dəstini yeniləmisinizsə və işləmədisə… deyək ki, bu ümumi bir problemdir, amma onun ümumi bir həlli yoxdur.

Əvvəlcə istifadə etmək istədiyiniz versiyanın harada quraşdırıldığını müəyyən etməlisiniz:

```bash
$ rustup which rustc
$ rustup which cargo
```

Alət zəncirlərinin istifadəçi tərəfindən quraşdırılması adətən `~/.rustup/toolchains/stable-*/bin/` ünvanında olur. Əgər belədirsə, siz işə sala bilməlisiniz

```bash
$ rustup toolchain update stable
```

və bu sizin problemlərinizi həll etməlidir.

### Varsayılan Rust versiyasını yoxlayın {#check-the-default-rust-version}

Başqa bir seçim də odur ki, sizdə güncəllənmiş `stable` alət zənciri var, amma o, standart olaraq təyin edilməyib. İşə salın:

```bash
$ rustup default stable
```

`nightly` versiyasını quraşdırmaq və ya müəyyən bir Rust versiyasını təyin edib sonradan onu ləğv etməmək bu problemi yarada bilər.

### Başqa Rust versiyaların olub-olmadığını yoxlayın {#check-if-there-are-other-rust-versions}

Problemlərin həll edilməsi yolunda davam edərkən, bizdə shell alias-ları ola bilər:

```bash
$ type rustc
$ type cargo
```

Əgər bunlar `rustup which *` işlədərkən gördüyünüz yerdən başqa yerlərə işarə edirsə, onda problem var. Qeyd edin ki, belə ləqəblər əlavə etmək kifayət etmir:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

Daxili məntiq, sən kabuk əvəzləmələrini necə tərtib etməyindən asılı olmayaraq, hələ də poza bilər.

Ən sadə həll, istifadə etmədiyiniz versiyaları silmək olardı.

Ancaq bunu etmək demək etməkdən daha çətindir, çünki bu, sizin quraşdırdığınız və istifadəyə verilən bütün rustup versiyalarını izləməyi tələb edir. Adətən yalnız iki versiya var: sistem paket meneceri versiyası və bu dərsliyə başladığınız zaman komandayı işlədərkən ev qovluğunuzun standart yerinə quraşdırılan versiya. Birincisi üçün, (Linux) paylamanızın təlimatına baxın, (`apt remove rust`). İkincisi üçün, işlədin:

```bash
$ rustup toolchain list
```

Və sonra, hər bir `<toolchain>` üçün (əlbəttə ki, bucaqlı mötərizələrsiz):

```bash
$ rustup remove <toolchain>
```

Alət zəncirləri silindikdən sonra bu əmr komanda tapılmadı səhvini bildirməlidir:

```bash
$ cargo --help
```

O səhv heç bir aktiv Rust alət zəncirinin quraşdırılmadığını təsdiqləyir. Sonra çalışdırın:

```bash
$ rustup toolchain install stable
```

## Problemlərin aradan qaldırılması Python alət zənciri {#troubleshooting-python-toolchain}

[Python müştəri qurulumu](/az/guide/tutorials/python.md) zamanı pip vasitəsilə Python Wheel paketini quraşdırarkən siz belə bir xəta ilə üzləşə bilərsiniz: "iroha_python-*.whl bu platformada dəstəklənən bir wheel deyil".

Bu səhv o deməkdir ki, pip köhnəlib, buna görə də onu yeniləməlisiniz. İlk növbədə, OS üçün yeniləmələri yoxlamaq və sisteminizi yeniləmək tövsiyə olunur.

Əgər bu işə yaramasa, istifadəçi kataloqunuz üçün `pip`-ı yeniləməyə cəhd edə bilərsiniz.

`python -m pip install --upgrade pip`

Əmin olun ki, `pip` ev qovluğunuzda quraşdırılıb. Bunu etmək üçün `whereis pip` əmri işlədin və yoxlayın ki, `/home/username/.local/bin/pip` yollar arasında olsun. Əgər yoxdursa, shell-inizin `PATH` dəyişənini yeniləyin.

Əgər problem davam edirsə, xahiş edirik [bizimlə əlaqə saxlayın](/az/help/) və çıxışları bildirəsiniz.

```
python --version
python3 --version
pip --version
pip3 --version
```
