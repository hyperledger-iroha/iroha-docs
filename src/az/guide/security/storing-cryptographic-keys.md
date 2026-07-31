---
translation_locale: az
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kriptografik açarların saxlanması {#storing-cryptographic-keys}

Həssas məlumatlarınız yalnız kriptografik açarları qorumaq üçün <abbr title="Operational Security">OPSEC</abbr> üsullarını tətbiq etsəniz məxfi qalacaq. Sosial mühəndislik təhdidləri, kiminsə nüfuzlu bir şəxsiyyət kimi özünü göstərərək sizi manipulyasiya etməyə çalışır ki, onlara sizin hüququnuzu versin. özəl kriptografik açar, realdır. Həmişə ehtiyatlı olun və şəxsi açarınızı bölüşməkdən çəkinin, ona dairənizin açarlarını etibarlı insanlar üçün saxladığınız kimi davranın. Yalnız fərdlər.

<abbr title="Operational Security">OPSEC</abbr> və onun ən yaxşı təcrübələri haqqında daha ətraflı məlumat üçün bax: [Əməliyyat təhlükəsizliyi ](./operational-security)

## Kriptografik açarların rəqəmsal şəkildə saxlanması {#storing-cryptographic-keys-digitally}

Kriptografik açarları rəqəmsal şəkildə qorumağa gəldikdə, əsasən yalnız iki yanaşma mövcuddur[SSH](https://www.ssh.com/) və [GPG](https://www.gnupg.org/). Bu üsullar kriptografik açarlarınıza icazəsiz girişinin qarşısını almaq üçün təhlükəsizlik təbəqələrini təmin edir.

Bir çox Iroha memarlıq qərarları Secure Shell (`SSH`) protokolunun prinsiplərindən təsirlənir, buna görə də bu bölmə əsasən `SSH` yanaşmasına diqqət yetirir. Iroha ekosistemində kriptografik açarlarınızı saxlamaq üçün protokolun necə effektiv şəkildə tətbiq ediləcəyi barədə təlimatlar təqdim etmək.

### SSH və SSH Agentindən istifadə etməklə {#using-ssh-and-ssh-agent}

Secure Shell Protocol (`SSH`) bir virtual qapı kimi xidmət edən kriptografik şəbəkə protokoludur. SSH açarlarından istifadə edərək uzaqdan qurulan maşınlara təhlükəsiz giriş imkanı təmin etmək. Bu, fiziki mövcudluğun lazımsızlığı olmadan sistemlərlə uzaqdan ünsiyyət qurmaq üçün səmərəli bir yol təmin edir. Bu baxımdan `SSH` iki əsas etibarlaşdırma mexanizmini təklif edir: Ənənəvi şifrə əsaslı yanaşma və daha təhlükəsiz ictimai-xüsusi açar cütü metodu.

`SSH` haqqında daha ətraflı məlumat üçün [-ə baxın, əlaqəli SSH Akademiyanın mövzusunda](https://www.ssh.com/academy/ssh).

Giriş prosesini asanlaşdırmaq və təkrarlanan giriş ehtiyacını aradan qaldırmaq üçün, `SSH` açarları SSH Agent (`ssh-agent`)İşinizi xatırlayan köməkçi proqramı `SSH` Bir iclasın müddəti üçün açar və/və ya şifrə. Bu quruluş `SSH` digər maşınlara qoşulduğu zaman açarları asanlıqla əldə etmək üçün qapı.

Burada iş axını aşağıdakı kimidir: ictimai açarınız uzaqdan bir sistemdə saxlanılır və şəxsi açarınızı təhlükəsiz saxlayırsınız. Uzaq sistemə daxil olmaq istədiyiniz zaman, `ssh-agent` İctimai açarınızı daxil olan sistemə çatdırmaq üçün addımlar atır. [Çətinlik](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) Yalnız şəxsi açarınız düzgün cavab verə bilər. `ssh-agent` Bu problemi özəl açarınızdan istifadə edərək həll edir və düzgün cavabı uzaq sistemə göndərir. Əgər reaksiya sistemin gözlədiyi ilə uyğunlaşırsa, sizə giriş verilir.

`ssh-agent` -in gözəlliyi odur ki, seans zamanı şəxsi açarınızı saxlayır, buna görə də uzaqdan bir sistemə qoşulduğunuzda hər dəfə şifrənizi və ya şəxsi açarı daxil etməyinizə ehtiyac yoxdur.

Bu barədə daha ətraflı məlumat üçün `ssh-agent`, baxın [əlaqəli SSH Akademik mövzu](https://www.ssh.com/academy/ssh/agent).

::: info Qeyd

`SSH` protokolunun və `ssh-agent` vasitəsinin ətraflı nəzərdən keçirilməsi üçün aşağıdakı [SSH Akademiyası ](https://www.ssh.com/academy) mövzularına baxın:

  - [Bu nə idi? SSH (Secure Shell)?](https://www.ssh.com/academy/ssh)
  - [ssh-agent: Ssh-agent, agent göndərilməsi və agent protokolunu necə konfiqurasiya etmək olar](https://www.ssh.com/academy/ssh/agent)

:::

### Password Manager Proqramı əlavə etmək {#adding-a-password-manager-program}

`SSH` açarlarınızın təhlükəsizliyini bir şifrə ilə qorumaq tövsiyə olunur, bu da sizin həssas məlumatlarınızı əldə etmək istəyən zərərli tərəflərin yoluna əlavə maneə kimi çıxış edir.

Müxtəlif şifrə menecerləri istifadəçi şifrələri saxlamaq üçün istifadə edilə bilər və `SSH` Açıqlıq naminə, [KeePass](https://keepass.info/) bir nümunə şifrə idarəçisi kimi istifadə olunur, xüsusilə də [KeePassXC](https://keepassxc.org/) Linux əsaslı əməliyyat sistemlərində işləyən port.

KeePassXC'nin necə qurulması barədə təlimatlar üçün aşağıdakı [Konfiqurasiya KeePassXC](#configuring-keepassxc) bölməsinə bax:

![KeePassXC: `Main` ekran UI](../../../img/KeePassXC.png)

KeePassXC gücləndirilmiş təhlükəsizlik, çeviklik və nəzarət təklif edir. Yalnız şifrələri yox, `SSH` açarlarını da saxlayır. Anahtar saxlama üçün istifadə edildikdə, bu şifrə meneceri `ssh-agent`-yə saxlanan açarları təmin edir. KeePassXC pəncərəsi bağlandıqdan sonra tezliklə yaddaşından çıxarılır.

::: xəsarət

Nəzəri olaraq, hər hansı bir KeePass limanlar [rəsmi saytda göstərilmişdir.](https://keepass.info/download.html) Aşağıdakılardan birini tövsiyə edirik: [KeePassX](https://www.keepassx.org/) və ya [KeePassXC](https://keepassxc.org/).

:::

#### Konfiqurasiya KeePassXC {#configuring-keepassxc}

KeePassXC konfigurasiyası üçün aşağıdakı addımları yerinə yetirin:

1. KeePassXC başlatın, sonra Tools > Settings'a gedin və ya yuxarıda olan UI panelindən Gear düyməsini seçin.

2. Göstərilən Tətbiq Ayarları tabında sol menyudan SSH Agent seçin və sonra "Məhdudlaşdır SSH Agent inteqrasiyası" yoxlama qutusu seçin.

   ::: info Referent ekran görüntüsünü göstərin

   ![KeePassXC `SSH Agent` səhifəsi: SSH Agentinin aktivləşdirilməsi](../../../img/keepassxc_ssh_agent.png)

   :::

3. Yeni KeePassXC verilənlər bazası yaratın. Təlimatlar üçün [KeePassXC İstifadəçi bələdçisi > İlk verilənlər bazasını yaratmaq](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database) səhifəsini baxın.

4. Yaraddığınız KeePassXC verilənlər bazasında saxlamaq istədiyiniz hər bir açar üçün aşağıdakı addımları yerinə yetirin:

   - Verilənlər bazasına yeni bir giriş əlavə edin. Təlimatlar üçün [KeePassXC İstifadəçi təlimatını baxın > İlk verilənlər bazası yaratmaq](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Yeni bir giriş əlavə edərkən açarı ehtiva edən faylı aşağıdakıları etməklə əlavə edin: sol menyudan Əlavə seçin, sonra Qoşulmalar bölməsində əlavə seçin və görünən Seçir sənədlər pəncərəsindən tələb olunan faylı seçin.

   - Yeni bir giriş əlavə edərkən sol menyudan SSH Agent seçin, sonra xüsusi açar bölməsində Qoşulma menyusundan əlavə etdiyiniz açar faylını seçin; sonra aşağıdakı yoxlama qutusu seçin:

      - Verilənlər bazasının açılması və/və ya açılması zamanı agentə açar əlavə edin.

      - Verilənlər bazasının bağlandığı / kilidli olduğu zaman agentdən açar çıxarın

      - Bu açarı istifadə edərkən istifadəçi təsdiqini tələb edin

   - Lazım gəlsə, girişdə başqa dəyişikliklər edin.

   - Hazır olduqda, giriş saxlamaq üçün OK seçin.

   ::: details Referensiyalı ekran görüntülərini göstər

   ![KeePassXC `Advanced` səhifəsi: Xüsusi açar əlavə edilməsi](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` səhifəsi: Xüsusi açar əlavə edilməsi](../../../img/keepassxc_pk_agent.png)

   :::

##### Gözlənilən nəticələr {#expected-results}

- Kriptografik və `shh` açarları KeePassXC pəncərəsinin açıq olduğu müddətdə daxil edilə bilən KeePassXC verilənlər bazasında girişlər kimi saxlanılır.

- Saxlanan kriptografik və `ssh` açarları icazə üçün tələb olunduğu zaman istifadə edilə bilər.

- saxlanan kriptografik və `ssh` açarları `ssh-agent` pəncərəsinin bağlandıqdan sonra KeePassXC pəncərəsindən çıxarılır.

::: info Qeyd

Bu açar istifadə edildikdə istifadəçi təsdiqini tələb etməyi təmin etmədən, `ssh-agent` şifrə idarəetmə prosesi zərərli proqram tərəfindən dayandırılırsa. və ya sistem xidməti vasitəsilə `SIGKILL` siqnal, açar ehtimal ki, qalır `ssh-agent`, Unix sistem proqramları intercept edə bilməz `SIGKILL`.

:::

## Kriptografik açarların saxlanması {#storing-cryptographic-keys-physically}

Offline təhlükəsizliyin ən yüksək səviyyəsini istəyənlər üçün kriptografik açarları saxlama seçimi fiziki olaraq əsasların rəqəmsal şəbəkələrdən tamamilə bağlı qalmasını təmin edir və bununla da icazəsiz giriş riskini minimuma endirir. Fiziki variantın tanınması müxtəlif təhlükəsizlik ehtiyaclarına cavab verməkdə olan öhdəliyimizi vurğulayır.

### Hardver açarından istifadə etmək {#using-a-hardware-key}

Komandamız hardver açarlarını ən yaxşı təhlükəsizlik tədbirlərindən biri hesab edir. Hardver açarı USB portu vasitəsilə bağlanan və tipik bir flash sürücünün ölçüsündə olan kompakt qurğudur. Yalnız bir maşına qoşulduğunda təhlükəsizliklə bağlı hadisələri işlənir. Bu, təhlükəsizlik pozuntuları halında cihazı asanlıqla bağlamağınıza və ya lazım olduqda sadəcə başqa bir maşına yenidən qoşmağınıza imkan verir.

Bununla birlikdə, hər biri özünəməxsus APIs keyləri olan bir çox markalı donanım açarları olduğundan ehtiyaclarınıza ən uyğun açarı tapmaq üçün bazarda araşdırma aparmaq vacibdir.

İndiyə qədər komandamız [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) donanım açarını daxili olaraq sınadı ki, bu da çox yönlü API funksiyasına daxil olmaqla bir çox müsbət xüsusiyyətə malik olduğunu sübut etdi.

Bununla birlikdə, nəzərə alınması lazım olan bir mənfi cəhət var. [HMAC Çətinlik və cavab təsdiqlənməsi](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) və bu cavab üçün müvafiq bir xüsusi açar saxlamaq zəiflik yarada bilər. Bu quruluş, təxribatçıların bilə-bilə saxlanılan məlumatlar haqqında məlumatlı güman etmələrini təmin edə bilər. YubiKey 5C-nin yaddaşı, bununla da ümumi təhlükəsizliyi məhdudlaşdırır.

Xoşbəxtlikdən, bu zəifliyi YubiKey 5C-ni istifadə etməklə alternativ bir yanaşma tətbiq edərək aradan qaldırmaq olar. Fikir YubiKey 5C-dən kriptografik və `SSH` açarlarınızı saxlayan KeePassXC verilənlər bazasına etibarlı şəkildə daxil olmaq üçün istifadə etməkdir. Bu üsul hətta faydalı hesab edilə bilər, çünki əksər şifrələrin təhlükəsizliyini aşırır və KeePassXC verilənlər bazasının sızması halında zərərli tərəfin donanım açarınızın saxlanılması lazım olur.

::: məlumat

Yuxarıda göstərilən üsul haqqında daha çox məlumat almaq üçün KeePassXC inkişaf etdiricilərindən birinin [Janek Bevendorff](https://github.com/phoerious) aşağıdakı StackExchange sualına verdiyi cavabı baxın:

[KeePassXC ilə YubiKey birlikdə istifadə etmək məntiqlidirmi?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### Mnemonik ifadədən istifadə etmək {#using-a-mnemonic-phrase}

Alternativ olaraq, mnemonik ifadə kimi tanınan bir sözlər seriyası kimi özəl açarı yadda saxlaya bilərsiniz. Bir çox cüzdanlarda istifadə olunan bu üsul 25 xüsusi sözün ətrafında yadda saxlamağı tələb edir. Əvvəllər müzakirə edilən KeePassXC da daxil olmaqla əksər şifrə menecerləri mnemonik şifrə nəslinin yaradılmasını təklif edirlər.
