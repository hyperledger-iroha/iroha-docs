---
translation_locale: az
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İsti Yükləmə Iroha bir Docker Konteynerdə {#hot-reload-iroha-in-a-docker-container}

İsti yenidən yükləməni yalnız yerli sazlama üçün istifadə edin. Docker-də eyni reviziyadan yığılmış icra faylları ilə dörd təsdiqləyici qovşaq qurub işə salmaq üçün [Iroha 3-i işə sal](/az/get-started/launch-iroha.md) təlimatına əməl edin.

## Şəbəkə həmkarı Binary-i əvəz edin {#replace-the-peer-binary}

Yuxarı axın iş sahəsindən Linux-uyğun daemon binar faylı yaradın:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Bunu işləyən şəbəkə həmkarı konteynerinə kopyalayın, sonra həmin konteyneri yenidən başladın:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Konteyneri tapmaq üçün `docker ps` əmrindən istifadə edin. Demonu əvəz etməzdən əvvəl obrazdakı yolunu yoxlayın.

## Təklif olunmayan Şəbəkədə blok zənciri başlanğıcını yenidən öhdəsinə götürmək {#recommit-genesis-in-a-disposable-network}

Yeni genezis bloku üçün qovşağın yaddaşı boş olmalıdır. Eyni şəbəkəni yenidən işə salmaq üçün əvvəl `python3 poc.py down`, sonra `python3 poc.py up` əmrlərini işlədin. `state/` qovluğunu şəbəkənin dörd Docker yaddaş bölməsi ilə birlikdə saxlayın.

## Fərdi Konfiqurasiyadan İstifadə Et {#use-custom-configuration}

Cari şəbəkə həmkarı konfiqurasiyası TOML dir. Yaradılmış `config.toml`, `genesis.signed.nrt` və əlaqəli açar faylları konteynerdə gözlənilən yollarına bind mount edin və ya kopyalayın. şəkil, sonra isə şəbəkə həmkarını yenidən başladın. Yaradılmış faylları birlikdə saxlayın; müxtəlif Kagami işlərindən olan faylların qarışdırılması deserializasiya və ya konsensus uğursuzluqlarına səbəb ola bilər.
