---
translation_locale: az
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiqurasiya Iroha {#configuring-iroha}

Yerli həmyaşıd konfigurasiyası TOML fayllarında müəyyən edilir. Bu, [`SetParameter`](/az/blockchain/instructions.md#setparameter) təlimatları vasitəsilə dəyişdirilən zəncirdəki konfigurassiyadan fərqlənir. İstehsal davranışı bir konfigurassiya sənədində və ya zəncir üzərindəki parametrdə təmsil edilməlidir; ətraf mühit dəyişiklikləri xüsusiyyət qapıları deyil.

Konfigurasiya faylına yol göstərmək üçün [`--config`](../irohad-cli#arg-config) CLI argumentindən istifadə edin.

## Şablon {#template}

Hər bir parametr haqqında ətraflı məlumat üçün [Parameterlər ](./params.md) istinadına baxın.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Konfiqurasiya fayllarını tərtib etmək {#composing-configuration-files}

TOML konfiqurasiya faylları digər TOML fayllarını göstərən əlavə `extends` sahəsinə malikdirlər. Bu bir yol və ya çox yol ola bilər:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha `extends` -də göstərilən bütün sənədləri təkrar oxuyacaq və onları qatlara tərtib edəcək, burada sonrakılar əvvəlkiləri parametr səviyyəsində üstələyəcək. Məsələn, əgər `config.toml` -də oxunan:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

Nəticədə quruluş olacaq `chain` üçün `a.toml`, `max_content_len` üçün `b.toml`, və `torii.address` üçün `config.toml` (qeyri-müvafiq yazılar) `b.toml`).

## Problemlərin həlli {#troubleshooting}

Konfiqurasiyanın necə oxunması və təhlil edilməsinin izini görmək üçün [`--trace-config`](../irohad-cli#arg-trace-config) CLI bayrağını keç.
