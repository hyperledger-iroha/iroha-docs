---
translation_locale: az
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Virtual Özəl Şəbəkələr {#virtual-private-networks}

Bir <abbr title="Virtual Private Network">VPN</abbr> şəbəkə nəzarətidir ki, kimlərin Iroha xidmətlərinə çata biləcəyini məhdudlaşdırır. Bu, əsasən özəl və konsorsium yerləşdirmələrində faydalıdır, burada doğrulayıcılar, tətbiq arxa planları və operatorlar açıq internet marşrutları əvəzinə özəl ünvanlar üzərindən əlaqə qurmalıdırlar.

A VPN Iroha şəbəkə bərabər açarlarını, hesab açarlarını, icazələri, firewall qaydalarını, monitorinqi və ya təhlükəsiz açar saxlamağı əvəz etmir. Bunu bir qat kimi qiymətləndirin idaəetmə sərhədi: VPN şəbəkə mövcudluğunu daraldır, Iroha konfiqurasiyası və idarəçiliyi isə hansı şəbəkə tərəfdaşlarının və hesabların etibarlı olduğunu müəyyən edir.

## VPN-dən Nə Zaman İstifadə Etməli {#when-to-use-a-vpn}

İstifadə edin VPN aşağıdakı hallarda:

- təsdiqləyicilər müxtəlif təşkilatlar tərəfindən və ya müxtəlif hosting mühitlərində işlədilir
- Torii yalnız tətbiq arxa ucları, operatorlar və ya etibarlı müştərilər vasitəsilə əlçatan olmalıdır
- metriklər, qeydiyyatlar, SSH və ya digər idarəetmə API son nöqtələri özəl operator şəbəkəsində qalmalıdır
- sınaq və ya hazırlıq şəbəkəsi istehsal giriş nəzarətlərinə bənzəməlidir, lakin ictimai API son nöqtələrini açmamalıdır

Hər yerləşdirmə üçün VPN tələb olunmur. İctimai şəbəkələr Torii-ni ictimai şlüz, yük balanslaşdırıcısı və ya tərs proksi vasitəsilə qəsdən açıq edə bilər. Hətta bu halda da təsdiqləyicilərarası trafiki və idarəetmə API son nöqtələrini mümkün olduqda məhdud şəbəkədə saxlayın.

::: tip

Bir brauzer VPN yalnız həmin brauzerdən gələn trafiki qoruyur. O, `iroha3d`, CLI, SDK, SSH, metrikləri və ya ehtiyat nüsxə trafiki qorumur, əgər həmin proseslər eyni xüsusi şəbəkədən yönləndirilməyibsə.

:::

## Yerləşdirmə Naxışı {#deployment-pattern}

Şəxsi valyidator şəbəkəsi üçün hər bir valyidatora sabit VPN ünvanı və ya şəxsi DNS adı verin. Şəbəkə tərəfdaşlarını elə qurun ki, onların reklam olunan bərabərhüquqlu şəbəkə ünvanları həmin şəbəkədən digər valyidatorlar tərəfindən əldə edilə bilsin:

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

Hazırkı şəbəkə dostuna `network.address` və `network.public_address` daxil edilmiş ünvanı istifadə edin. Hər bir şəbəkə dostu eyni etibarlı şəbəkə dostu şəxsiyyətlərini siyahıda göstərməlidir, lakin ünvanlar öz VPN marşrut cədvəlindən çatılabilir olmalıdır.

Müştəri və CLI konfiqurasiyaları VPN vasitəsilə və ya nəzarətli daxili şlüz vasitəsilə əldə edilə bilən Torii API son nöqtəsinə işarə etməlidir:

```toml
torii_url = "http://10.20.0.11:8080"
```

Əgər Torii VPN-in xaricində mövcud olmalıdırsa, onu TLS, autentifikasiya, limit tətbiqi və qeydiyyat təmin edən bir tərs proxy və ya yük balanslayıcı arxasında yerləşdirin. Xam bərabərhüquqlu şəbəkə portlarını və ya inzibati API uç nöqtələrini birbaşa ictimai İnternetə açmaqdan çəkinin.

## Firewall Qaydaları {#firewall-rules}

Bir VPN mövcud olduqda belə host və bulud firewall qaydalarından istifadə edin:

|Xidmət|Tövsiyə olunan giriş|
| --- | --- |
|Şəbəkə üzvləri arasında port|Digər doğrulayıcı VPN yalnız ünvanlar|
| Torii |Tətbiq arxa hissələri, operatorlar və ya etibarlı müştəri VPN diapazonları|
|Metriklər və sağlamlıq yoxlamaları|Operator şəbəkəsində monitorinq sistemləri|
|SSH və inzibati işlər|Bastion host, imtiyazlı operator VPN diapazonu və ya təcili giriş prosesi|
|Ehtiyat nüsxələr və saxlama təkrarlanması|Şəxsi şəbəkədə ehtiyat nüsxə sistemləri|

Default-deny qaydaları geniş allow qaydalarından daha asan yoxlanılır. Yeni bir şəbəkə tərəfdaşı şəbəkəyə qoşulduqda, VPN üzvlük, firewall icazə siyahısı və Iroha etibarlı şəbəkə tərəfdaşı konfiqurasiyasını birgə koordinasiya olunmuş dəyişiklik olaraq yeniləyin.

## Əməliyyat Yoxlama Siyahısı {#operational-checklist}

- Auditorlardan keçmiş və aktiv şəkildə saxlanılan VPN implementasiyasını seçin, məsələn, WireGuard, IPsec və ya təşkilat tərəfindən təsdiqlənmiş idarə olunan özəl şəbəkə.
- Hər bir host və operator üçün unikal VPN giriş məlumatlarından istifadə edin. Təsdiqləyicilər arasında VPN açarlarını paylaşmayın.
- VPN etimadnamələrini Iroha şəxsi açarları və blokçeyn yaradılma imzalama materialından ayrı saxlayın.
- Latensiyanı, paket itkisini, yenidən qoşulmaları və marşrut dəyişikliklərini izləyin VPN. Konsensus davamlı şəbəkə qeyri-sabitliyinə həssasdır.
- Effektiv MTU-i sınaqdan keçirin. Paket parçalanması ara-sıra şəbəkə həmkarı və ya Torii çatışmazlıqları kimi görünə bilər.
- Sənəd hansı VPN diapazonlarının bərabərhüquqlu şəbəkə, Torii, metriklər, SSH və ehtiyat nüsxə API son nöqtələrinə çatmasına icazə verildiyini göstərir.
- Bir host, operator hesabı və ya təşkilat şəbəkədən çıxdıqda VPN şəhadətnamələrini dəyişdirin.
- Tək VPN qapısını doğrulayıcılar arasında yeganə yol kimi istifadə etməkdən çəkinin. İstehsal şəbəkələri üçün ehtiyatlı qapılar və ya saytlararası yollar planlaşdırın.
- Operatorların bir şəbəkə bölünməsini Iroha prosesin uğursuzluğundan ayırd etməyi bilməsi üçün insident cavab məşqlərinə VPN uğursuzluqları daxil edin.

## Əlaqəli Səhifələr {#related-pages}

- [Təhlükəsizlik Prinsipləri](/az/guide/security/security-principles.md)
- [Əməliyyat Təhlükəsizliyi](/az/guide/security/operational-security.md)
- [Şəbəkə Yerləşdirilməsi üçün Açarlar](/az/guide/configure/keys-for-network-deployment.md)
- [şəbəkə tərəfdaşının idarə edilməsi](/az/guide/configure/peer-management.md)
- [şəbəkə həmkarı Konfiqurasiya Referansı](/az/reference/peer-config/index.md)
