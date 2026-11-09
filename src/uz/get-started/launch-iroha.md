---
translation_locale: uz
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ishga tushurish Iroha 3 {#launch-iroha-3}

Yopiq muhitda integratsiyani tekshirish uchun bitta Linux virtual mashinasida (VM) to‘rtta Iroha 3 validatorini ishga tushiring. Imzolangan tranzaksiyani yuboring, bitta validatorni to‘xtating va qolgan uchtasi keyingi tranzaksiyani tasdiqlashini tekshiring. Shu tariqa ishtirok etish uchun ruxsat talab qiladigan mustaqil reyestr yaratiladi. Uni boshqariladigan ma’lumotlar makoni sifatida SORA Nexus tarmog‘iga ulash uchun alohida sozlash talab etiladi.

## VM ni tayyorlang {#prepare-the-vm}

Linux x86_64 tizimida Docker Engine, Buildx, Compose v2, Python 3.8 yoki undan yangi versiya hamda `unzip` dasturidan foydalaning. Hisobingiz Docker bilan ishlash huquqiga ega bo‘lishi kerak. Birinchi yig‘ish uchun GitHub, Docker Hub, Debian paketlarining ko‘zgu serverlari va crates.io manziliga HTTPS orqali chiquvchi ulanish kerak.

Biz to‘plamni VM da, olti vCPU va 32 ta GiB RAM bilan bir necha sun’iy tranzaksiyalar yordamida qurdik va sinovdan o‘tkazdik. O‘z ish yukingiz va saqlash muddatingiz uchun xotira hajmini aniqlang. Har bir Docker dvigateli uchun to‘plamning bitta nusxasini ishlating va loopback portlari 18080–18083 ni mavjud holda saqlang.

[To'rt-tasdiqlovchi to'plamini yuklab oling](/downloads/iroha-trade-poc.zip). Bu ishga tushirish dasturini, qulflangan bog‘liqliklar ro‘yxatini va bir xil qayd qilingan Iroha versiyasidan validator va klientni yaratishda ishlatilgan patchlarni o‘z ichiga oladi. Yuklab olingan fayl joylashgan papkadan, tekshirib ko‘ring va arxivdan chiqaring.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Toʻrtta validatorni ishga tushiring va tekshiring {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

Birinchi ishga tushirishda konteyner obrazi yig‘iladi, virtual mashinada (VM) zanjir identifikatori, kalitlar va imzolangan boshlang‘ich blok yaratiladi. Har bir validatorning o‘z doimiy saqlash tomi bor. Tekshiruv dasturi sinov tranzaksiyasini imzolaydi va to‘rtta validatorning har biri uchta qo‘shni tugunga ulanganini hamda yangi blokning xeshi bir xil ekanini bildirishini kutadi. Boshlang‘ich blokda namunaviy hisoblar bor. Sun’iy ma’lumotlardan foydalaning va APIs faqat mahalliy loopback interfeysi orqali ochiq bo‘lsin.

Birinchi validatorning holatini VM dan o‘qish uchun, JSON ni aniq so‘rang.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Validatorning muvaffaqiyatsizligini sinash {#test-a-validator-failure}

```sh
python3 poc.py failover
```

Sinov bitta validatorni to‘xtatadi, yangi tranzaksiya yuboradi va qolgan uchta validatorda tasdiqlangan blok xeshini solishtiradi. Keyin to‘rtinchi validatorni qayta ishga tushirib, uning ham o‘sha blokka yetishini kutadi. Virtual mashina (VM) ishdan chiqsa, to‘rtta validator ham to‘xtaydi. Bitta jismoniy xostning ishdan chiqishini sinash uchun to‘rtta mustaqil xostning har biriga bittadan validator joylashtiring.

## To'xtatish va davom ettirish {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

Ikkala buyrug‘ni ham bir xil chiqarilgan katalogdan ishlating. Uning `state/` katalogini va to‘rt Docker hajmini birga saqlang, shunda qayta ishga tushirilgan validatorlar bir xil blokcheyn ledjerini ochishi mumkin. Agar ishga tushirish to‘xtab qolsa, u yerda `python3 poc.py logs` ni ishga tushiring.

## Jamoat API endpointini sinab ko‘ring {#try-the-public-endpoint}

Ilova reyestr uchun virtual mashina (VM) ishga tushirmasdan Taira tarmog‘idagi SORA Nexus universal ma’lumotlar makonini o‘qishi mumkin. `curl` va `jq` o‘rnatilgan ish stansiyasidan sinov tarmog‘iga quyidagi faqat o‘qish uchun so‘rovni yuboring.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Javob so'ralgan tugunning ulanayotgan tarmoq tengdoshlarini, yakunlangan bloklarni, tasdiqlangan tranzaksiyalarni va navbatdagi tranzaksiyalarni bildiradi. Joylashtirish rejalashtirish uchun [Tarmoqni joylashtirish](/uz/guide/best-practices/network-deployment.md) ga qarang.
