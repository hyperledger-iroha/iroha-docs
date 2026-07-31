---
translation_locale: az
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Virtual özəl şəbəkələr {#virtual-private-networks}

<abbr title="Virtual Private Network">VPN</abbr> - Iroha xidmətlərinə kim daxil ola biləcəyini məhdudlaşdıran bir şəbəkə nəzarətidir. Validatorların, tətbiq arxa planlarının və operatorların açıq internet marşrutu əvəzinə özəl ünvanlar vasitəsilə ünsiyyət qurduğu xüsusi və konsorsium tətbiqetmələri üçün ən faydalıdır.

VPN Iroha həmyaşıd açarlarını, hesab açarlarını, icazələri, yanğın divarı qaydalarını, monitorinq və ya təhlükəsiz açar saxlamalarını əvəz etmir. VPN şəbəkənin əldə edilmə qabiliyyətini daraldır, Iroha konfiqurasiyası və idarəetməsi isə hansı rəqiblərə və hesablara güvəniləcəyini müəyyən edir.

## VPN -dən nə vaxt istifadə etmək lazımdır? {#when-to-use-a-vpn}

VPN istifadə edin:

- Validatorlar müxtəlif təşkilatlar tərəfindən və ya fərqli hosting mühitlərində idarə olunur.
- Torii yalnız tətbiq arxa tərəfləri, operatorlar və ya etibarlı müştərilər tərəfindən əldə edilə bilər
- Metriklər, loglar, SSH və ya digər idarəetmə son nöqtələri özəl operator şəbəkəsində qalmalıdır.
- Test və ya mərhələlənmə şəbəkəsi ictimai son nöqtələri açıqlamadan istehsal giriş nəzarətlərinə bənzəməlidir.

Hər bir tətbiq üçün VPN tələb olunmur. İctimai şəbəkələr ictimai bir qapı, yük balanseri və ya geri proxy vasitəsilə Torii niyyətli şəkildə ifşa edə bilərlər. O halda belə olsa da, mümkün olduqda təsdiqçi peer-to-peer trafikini və idarəetmə son nöqtələrini məhdud şəbəkədə saxlayın.

::: xəsarət

Bir brauzer VPN yalnız bu brauzerdən trafik qoruyur. Bu proseslər eyni özəl şəbəkə vasitəsilə yönləndirilmədiyi təqdirdə, `irohad`, CLI, SDK, SSH, ölçülər və ya ehtiyat trafikinin qorunmamasıdır.

:::

## İstifadə nümunəsi {#deployment-pattern}

Xüsusi təsdiqçi şəbəkəsi üçün hər bir təsdiqçiyə sabit VPN ünvanı və ya xüsusi DNS adını verin. Tərəfdaşları reklamlaşdırılan peer-to-peer ünvanlarına digər təsdiqçilərdən bu şəbəkə vasitəsilə daxil olmaq üçün qurun:

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

`network.address` və `network.public_address` səhifələrindəki mövcud həmyaşıdlara təyin edilmiş ünvanı istifadə edin. Hər bir həmyaşıda eyni etibarlı həmyaşıdı kimlikləri qeyd etmək lazımdır, lakin özünün VPN marşrut cədvəlindən əldə edilə bilən ünvanlar ilə.

Müştəri və CLI konfiqurasiyaları Torii son nöqtəsinə, VPN vasitəsilə və ya idarə olunan daxili qapı vasitəsilə əldə edilə bilən bir [PH000000) endpoint-a yönəlməlidir:

```toml
torii_url = "http://10.20.0.11:8080"
```

Əgər Torii VPN-dən kənarda mövcud olmalıdırsa, onu TLS -ni təsdiqləmək, tarif məhdudlaşdırmaq və qeydiyyatdan keçirməyi təmin edən bir geri proxy və ya yük balanseri arxasına qoyun.

## Firewall Qaydaları {#firewall-rules}

VPN mövcud olsa da, host və bulud yanğın duvarı qaydalarından istifadə edin:

|Xidmət |Tələb olunan giriş |
| --- | --- |
|Peer-to-peer port |Yalnız digər təsdiqçi VPN ünvanları |
|Torii |Tətbiq arxa planları, operatorlar və ya etibarlı müştərilər VPN aralığı |
|Metriklər və sağlamlıq yoxlamaları |Operator şəbəkəsindəki monitorinq sistemləri |
|SSH və idarəetmə |Bastion host, imtiyazlı operator VPN məsafəsi və ya şüşə qırma prosesi |
|Yedekləmə və saxlama replikasiyası |Özəl şəbəkədə yedek sistemləri |

Standart imtina qaydaları geniş icazə qaydalarından daha asan nəzarət edilir. Yeni bir həmyaşıd şəbəkəyə qoşulduqda, VPN üzvlüyünü yeniləyin, yanğın divarı icazə siyahısı və Iroha etibarlı həmyaşıda konfigurasiyası koordinasiya edilmiş bir dəyişiklik kimi.

## Əməliyyat yoxlama siyahısı {#operational-checklist}

- VPN tətbiqini seçin, məsələn WireGuard, IPsec və ya təşkilat tərəfindən təsdiqlənmiş idarə olunan özəl şəbəkə.
- Unikal istifadə edin VPN Hər bir aparıcı və operator üçün etibarnamələr. Paylaşmayın VPN Validatorlar arasındakı açarlar.
- VPN etibarnamələrini Iroha şəxsi açarlarından və genesis imzalanması materialından ayırın.
- VPN gecikmə, paket itkisi, yenidən əlaqə və marşrut dəyişikliklərini izləyin. Konsensus davamlı şəbəkə qeyri-sabitliyinə həssasdır.
- Güclü MTU testi. Paket parçalanması intermitent peer və ya Torii çatışmazlıqlara bənzəyə bilər.
- VPN aralıqlarının peer-to-peer, Torii, metriklər, SSH və yedek son nöqtələrə çatmasına icazə verilən sənəd.
- Ev sahibi, operator hesabı və ya təşkilat şəbəkəni tərk edərkən VPN etibarnamələrini fırlatın.
- Validyatorlar arasındakı yeganə marşrut olaraq tək bir VPN qapıdan çəkinin. İstehsalat şəbəkələri üçün redundant qapılar və ya saytdan sayta marşrutları planlaşdırın.
- Hadisə cavabı təlimlərində VPN çatışmazlıqları daxil edin ki, operatorlar şəbəkə partisiyasını Iroha prosesi çatışmazlığından nə vaxt ayırmalı olduğunu bilsinlər.

## Əlaqəli səhifələr {#related-pages}

- [Təhlükəsizlik prinsipləri](/az/guide/security/security-principles.md)
- [Əməliyyat təhlükəsizliyi](/az/guide/security/operational-security.md)
- [Şəbəkənin tətbiqi üçün açarlar ](/az/guide/configure/keys-for-network-deployment.md)
- [Peer Management](/az/guide/configure/peer-management.md)
- [Peer Configuration Reference ](/az/reference/peer-config/index.md)
