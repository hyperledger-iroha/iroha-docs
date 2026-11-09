---
translation_locale: az
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3-i işə sal {#launch-iroha-3}

Qapalı mühitdə inteqrasiyanı sınaqdan keçirmək üçün bir Linux virtual maşınında (VM) dörd Iroha 3 təsdiqləyicisini işə salın. İmzalanmış tranzaksiya göndərin, bir təsdiqləyicini dayandırın və qalan üçünün növbəti tranzaksiyanı təsdiqlədiyini yoxlayın. Beləliklə, iştirak üçün icazə tələb edən müstəqil reyestr yaranır. Onu idarə olunan məlumat məkanı kimi SORA Nexus şəbəkəsinə qoşmaq üçün ayrıca konfiqurasiya tələb olunur.

## VM-i hazırlayın {#prepare-the-vm}

Linux x86_64 sistemində Docker Engine, Buildx, Compose v2, Python 3.8 və ya daha yeni versiya, həmçinin `unzip` istifadə edin. Hesabınızın Docker-ə çıxışı olmalıdır. İlk yığım üçün GitHub, Docker Hub, Debian paket güzgüləri və crates.io ilə çıxış HTTPS bağlantısı tələb olunur.

Biz dəsti altı vCPU və 32 GiB RAM olan VM-də bəzi süni əməliyyatlarla qurub sınaqdan keçirdik. Öz iş yükünüz və saxlama müddətiniz üçün yaddaş ölçüsünü təyin edin. Hər Docker mühərriki üçün dəstin bir nüsxəsini istifadə edin və loopback portlarını 18080–18083 açıq saxlayın.

[Dörd-təsdiqləyici dəstini yükləyin](/downloads/iroha-trade-poc.zip). Buna işə salıcı, kilidli asılılıqlar siyahısı və eyni pinlənmiş Iroha versiyasından təsdiqləyiciu və müştərini yaratmaq üçün istifadə olunan yamalar daxildir. Yükləməni ehtiva edən kataloqdan onu yoxlayın və açın.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Bütün dörd təsdiqləyicini işə salın və yoxlayın {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

İlk işəsalma zamanı konteyner obrazı yığılır və virtual maşında (VM) zəncir identifikatoru, açarlar və imzalanmış başlanğıc bloku yaradılır. Hər təsdiqləyicinin öz daimi saxlama həcmi var. Yoxlama proqramı sınaq tranzaksiyasını imzalayır və dörd təsdiqləyicinin hər biri üç qonşu qovşağa qoşulduğunu və yeni blok üçün eyni heş aldığını bildirənədək gözləyir. Başlanğıc blokuna nümunə hesablar daxildir. Sintetik məlumatlardan istifadə edin və APIs-ləri yalnız yerli loopback interfeysində açın.

VM-dan ilk yoxlayıcının statusunu oxumaq üçün JSON-i açıq şəkildə tələb edin.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Təsdiqləyici uğursuzluğunu sınaqdan keçirin {#test-a-validator-failure}

```sh
python3 poc.py failover
```

Sınaq bir təsdiqləyicini dayandırır, yeni tranzaksiya göndərir və işləyən üç təsdiqləyicidə təsdiqlənmiş blokun heşini yoxlayır. Sonra dördüncü təsdiqləyicini yenidən işə salır və onun da həmin bloka çatmasını gözləyir. Virtual maşın (VM) sıradan çıxsa, dörd təsdiqləyicinin hamısı dayanır. Bir fiziki hostun sıradan çıxmasını sınaqdan keçirmək üçün dörd müstəqil hostun hər birində bir təsdiqləyici yerləşdirin.

## Dayandır və davam et {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

Hər iki əmri dəsti açdığınız eyni qovluqda icra edin. Yenidən başladıqda validatorların əvvəlki reyestri aça bilməsi üçün `state/` qovluğunu və dörd Docker həcmini birlikdə saxlayın. İşəsalma dayanarsa, həmin qovluqda `python3 poc.py logs` əmrini icra edin.

## İctimai API son nöqtəsini sınayın {#try-the-public-endpoint}

Tətbiq reyestr üçün virtual maşın (VM) işlətmədən Taira şəbəkəsində SORA Nexus universal məlumat məkanını oxuya bilər. `curl` və `jq` quraşdırılmış iş stansiyasından sınaq şəbəkəsinə bu yalnız oxuma sorğusunu göndərin.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Cavab soruşulan node-un bağlı şəbəkə yoldaşlarını, tamamlanmış blokları, təsdiqlənmiş əməliyyatları və növbədəki əməliyyatları bildirir. Dağıtım planlaması üçün baxın [Şəbəkə İstismarı](/az/guide/best-practices/network-deployment.md).
