---
translation_locale: am
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ትኩስ ዳግም ጫን Iroha በ Docker መያዣ ውስጥ {#hot-reload-iroha-in-a-docker-container}

ወዲያውኑ መልሶ መጫንን ለአካባቢያዊ ማረም ብቻ ይጠቀሙ። ከአንድ የምንጭ ኮድ ስሪት በተገነቡ ሁለትዮሽ ፋይሎች አራት አረጋጋጭ አንጓዎችን በDocker ለማስኬድ የ[አስጀምር Iroha 3](/am/get-started/launch-iroha.md) መመሪያን ይከተሉ።

## የአውታረ መረብ አቻውን ይተኩ ሁለትዮሽ {#replace-the-peer-binary}

ከላይኛው የስራ ቦታ ከሊኑክስ ጋር ተኳሃኝ የሆነ ዴሞን ሁለትዮሽ ይገንቡ -

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

ወደ ሩጫ የአውታረ መረብ አቻ ኮንቴይነር ይቅዱት እና ከዚያ ያንን መያዣ እንደገና ያስጀምሩት -

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

መያዣውን ለማግኘት `docker ps` ይጠቀሙ። የዳራ ፕሮግራሙን ከመተካትዎ በፊት በምስሉ ውስጥ ያለውን ዱካ ያረጋግጡ።

## ሊጣል በሚችል አውታረ መረብ ውስጥ የብሎክቼይን ጀነሲስን እንደገና ይፈጽሙ {#recommit-genesis-in-a-disposable-network}

ለአዲስ የመነሻ ብሎክ የአንጓው ማከማቻ ባዶ መሆን አለበት። ተመሳሳዩን አውታረ መረብ እንደገና ለማስኬድ `python3 poc.py down` እና ከዚያ `python3 poc.py up` ያሂዱ። `state/` ከአራቱ የDocker ማከማቻ ጥራዞች ጋር ያስቀምጡ።

## ብጁ ውቅረትን ተጠቀም {#use-custom-configuration}

የአሁኑ የአውታረ መረብ አቻ ውቅር TOML ነው። የመነጨውን `config.toml`፣ `genesis.signed.nrt` እና ተዛማጅ ቁልፍ ፋይሎችን በ በሚጠበቀው የእቃ መያዣ ዱካዎች ውስጥ ይጫኑ ወይም ይቅዱ ምስል፣ ከዚያ የአውታረ መረብ አቻውን እንደገና ያስጀምሩ። የተፈጠሩትን ፋይሎች አንድ ላይ ያስቀምጡ; ከተለያዩ Kagami ሩጫዎች ፋይሎችን መቀላቀል ተከታታይ ወይም የጋራ መግባባት ውድቀቶችን ሊያስከትል ይችላል።
