---
translation_locale: ka
translation_source: /reference/peer-config/params.md
translation_source_hash: d9fa3775e65b26b4eda726b27e54d167097b8bbd5bb766c27d7eeefdbc7ef10b
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# კონფიგურაციის პარამეტრები {#configuration-parameters}

საფეხურები

## ფესვის დონე {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ჯაჭვი ID ეს უნდა იყოს ჩართული თითოეულ ტრანზაქციაში. გამოიყენება თავდასხმების თავიდან ასაცილებლად.

განმეორებითი თავდასხმა არის მცდელობა წარუდგინოს ვალიდური ტრანზაქცია სხვა
ქსელი ვიდრე ის, რომლისთვისაც ეს იყო განკუთვნილი. `chain` შედის
ხელმოწერილი ტრანზაქციის სასარგებლო ტვირთი, ერთი ჯაჭვისთვის ხელმოწერილია ტრანზაკცია უარყოფითად
თანატოლების მიერ, რომლებიც იყენებენ სხვა ჯაჭვს ID.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

პარტნიორის საჯარო გასაღები. კონსენსუსის დამტკიცებელი პარტნიორები უნდა გამოიყენონ BLS- ნორმალური გასაღები.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

კერძო გასაღები უნდა შეესაბამებოდეს `public_key`; კონსენსუსის დამტკიცების თანატოლები
უნდა გამოიყენოს BLS- ნორმალური გასაღები.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

წინასწარ განსაზღვრული სანდო თანატოლების სია.

კონსენსუსის დამტკიცებლებმა უნდა გამოიყენონ BLS- ნორმალური პარტნიორული გასაღები. თითოეული ვალიდატორისთვის, ასევე
უზრუნველყოს შედარება [`trusted_peers_pop`](#param-trusted-peers-pop) შესვლა.

<param-table env="TRUSTED_PEERS">
<template #type>

ჟრანჟა ჟრანჯა. `PUBLIC_KEY@ADDRESS` როდესაც P2P ცნობილია მისამართი;
შიშველი `PUBLIC_KEY` ასევე მიღებულია და საშუალებას აძლევს, რომ თანატოლთა მისამართი აღმოაჩინოს
ბაგრატიონები.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS მტკიცებულების დამადასტურებელი ჩანაწერები ვალიდატორის სანდო თანატოლებისთვის.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

საგნების რიგები `public_key` და `pop_hex` ველები

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## იანესისი {#genesis}

### `genesis.file` {#param-genesis-file}

ფაილების გზა ხელმოწერილი genesis ბლოკის სასარგებლო ტვირთის მიერ შექმნილი `kagami genesis sign`.
გენერირებული პროფილები ჩვეულებრივ წერენ ამას როგორც Norito `.nrt` ფაილი.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

გენეზიის საკვანძო წყვილის საჯარო გასაღები.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## ქსელი {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

მისამართი კონსენსუსისათვის (sumeragi) და ბლოკის სინქრონიზაციისთვის (ბლოკი) p2p კომუნიკაციისთვის_სინქრონიზაციის მიზნები.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

თანატოლური მისამართი (გარეგანი, როგორც სხვა თანატოლები ხედავენ).

გაჟღერდება დაკავშირებულ თანატოლებს, რათა მათაც შეძლონ სხვა თანატოლებისთვის.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

ბლოკების რაოდენობა, რომელიც შეიძლება გამოგზავნოთ ერთ სინქრონიზაციის შეტყობინებაში.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

დროის ინტერვალი, რომელიც შედის ბლოკის ყველაზე ახლახანდელ ბლოკზე თანატოლების მოთხოვნებს შორის

უფრო ხშირი ჭორები აკლებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

ოპერაციების მაქსიმალური რაოდენობა ჭორაობის შეტყობინებაში.

უფრო მცირე ზომა იწვევს ხანგრძლივ სინქრონიზაციის დროს, მაგრამ სასარგებლოა, თუ თქვენ გაქვთ მაღალი პაკეტის დაკარგვა.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

თანატოლებს შორის ჩატარებული ოპერაციის მოლოდინში ჭორების პერიოდი.

უფრო ხშირი ჭორები აკლებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

დროის ხანგრძლივობა, რომლის შემდეგაც თანატოლთან კავშირი წყდება, თუ თანატოლი უმოქმედია.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

მისამართი, რომელზეც Torii სერვერმა უნდა მოუსმინოს და რომელ კლიენტსაც უნდა მიმართოს მისი თხოვნა.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

მაქსიმალური რაოდენობა ბაიტები ნედლეულის მოთხოვნის ორგანოში, რომელიც მიღებულია
[Torii საბოლოო წერტილები](/ka/reference/torii-endpoints.md).

ეს ლიმიტი გამოიყენება თავიდან ასაცილებლად DOS თავდასხმები.

<param-table>
<template #type>

რაოდენობა (ბაიტები)

</template>
<template #default-value>

`64_000_000` (64 მილიონი ბაიტი)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

დრო, რომლის დროსაც მაღაზიაში შეკითხვა შეიძლება დარჩეს, თუ მისაღწევად არ არის.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

პირდაპირი გამოკითხვების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ერთი მომხმარებლისთვის ცოცხალი გამოკითხვების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ხე-ტყის დამჭერი {#logger}

### `logger.level` {#param-logger-level}

_გენერალი_ რეგისტრირების სიხშირე (იხ. [`logger.filter`](#param-logger-filter) გაუმჯობესებული კონფიგურაციისათვის).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

ძრავი, შესაძლო მნიშვნელობები:

- `TRACE`: ყველა ღონისძიება, მათ შორის დაბალი დონის ოპერაციები.
- `DEBUG`: დეგობრაციის დონეზე გაგზავნილი შეტყობინებები, სასარგებლოა დიაგნოსტიკისთვის.
- `INFO`: ზოგადი ინფორმაციული შეტყობინებები.
- `WARN`: გაფრთხილებები, რომლებიც მიუთითებს პოტენციურ პრობლემებზე.
- `ERROR`: შეცდომები, რომლებიც შეფერხებენ ნორმალურ ფუნქციას, მაგრამ საშუალებას აძლევენ გაგრძელდეს მუშაობა.

აირჩიეთ დონე, რომელიც საუკეთესო შეესაბამება თქვენს გამოყენების შემთხვევაში.
[საფარის გადატვირთვა](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) დამატებითი
დეტალები, თუ როგორ უნდა გამოიყენოთ სხვადასხვა ლოგის დონე.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip გაშვების დროის განახლება

ამ პარამეტრს განახლება აქვს ჩატარების დროს Torii ოპერატორის საბოლოო წერტილები.

:::

### `logger.filter` {#param-logger-filter}

დახვეწილი დღიური ფილტრები გარდა [`logger.level`](#param-logger-level). საშუალებას აძლევს დააკონფიგუროს logging verbosity
თითოეული..._მიზანი_.

<param-table type=string env=LOG_FILTER>
<template #type>

Line, შედგება ერთი ან რამდენიმე კომით გამოყოფილი დირექტივიდან. თითოეულ დირექტივას შეუძლია ჰქონდეს შესაბამისი მაქსიმალური ვერბოზობა
_დონე_ რომელიც საშუალებას იძლევა (მაგალითად, _შერჩევა_) ფარგლებში და შესაბამისი ღონისძიებები. Iroha ითვალისწინებს ნაკლებად ექსკლუზიურ დონეებზე (მაგალითად:
`trace` ან `info`) უფრო ლექსიკონიანი იყოს, ვიდრე ექსკლუზიური დონეები (მაგალითად: `error` ან `warn`).

მაღალი დონის დირექტივების სინტაქსი შედგება რამდენიმე ნაწილისგან:

```
target[span{field=value}]=level
```

დამატებითი დეტალებისთვის იხილეთ
[`tracing-subscriber` დოკუმენტაცია](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info შედარებით [`logger.level`](#param-logger-level)

`logger.filter` სამუშაოები _ერთად_ მქონე [`logger.level`](#param-logger-level) და არც ერთი არ გადაწერს ერთმანეთს.

მაგალითად, თუ `logger.level` განისაზღვრება `INFO` და `logger.filter` განისაზღვრება `iroha_core=debug`, მიღებული ფილტრი
შედგება `info,iroha_core=debug` (მაგალითად, `info` ყველა მოდულისათვის, `debug` სამედიცინო `iroha_core`).

:::

::: tip გაშვების დროის განახლება

ამ პარამეტრს განახლება აქვს ჩატარების დროს Torii ოპერატორის საბოლოო წერტილები.

:::

### `logger.format` {#param-logger-format}

ფორმატში.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

ძრავი, შესაძლო მნიშვნელობები:

- `full`: დეფოლტური ფორმატორი. ეს გადის ადამიანის მიერ წაკითხული, ერთი ხაზის ჩანაწერები თითოეული მოვლენა, რომელიც ხდება,
  მიმდინარე სიგრძის კონტექსტი, რომელიც გამოჩნდება მოვლენის ფორმატირებული წარმოდგენის წინ.
- `compact`: ვარიანტი შერჩეული ფორმატორის, ოპტიმიზირებული მოკლე ხაზის სიგრძეებისთვის. ველები მიმდინარე მანძილზე კონტექსტიდან
  ფორმატირებული მოვლენის ველებს ემატება, და სფეროს სახელები არ არის ნაჩვენები; ვადობრივი დონე შეკუმშულია:
  ერთი პერსონაჟი.
- `pretty`: გამოდის ზედმეტად ლამაზი, მრავალხაზოვანი ჩანაწერები, ოპტიმიზირებული ადამიანის წაკითხვისთვის. ეს ძირითადად განკუთვნილია
  გამოიყენება ადგილობრივ განვითარებაში და დებუგინგში ან ბრძანების ხაზის პროგრამებში, სადაც ავტომატიზებული ანალიზი და კომპაქტური
  ლოგების შენახვა ნაკლებად პრიორიტეტულია, ვიდრე კითხულობა და ვიზუალური მიმზიდველობა.
- `json`: გამონადენი ახალი ხაზით განსაზღვრული JSON ეს განკუთვნილია წარმოების გამოყენებისთვის სისტემებთან, სადაც სტრუქტურირებული ლოგები
  გამოიყენება როგორც JSON ანალიზის და ხედვის ინსტრუმენტებით. JSON გამოსავალი არ არის ოპტიმიზირებული ადამიანისთვის გასაკითხად.

დამატებითი დეტალებისა და ნიმუშის გამოსახულებისათვის იხილეთ
[`tracing-subscriber` დოკუმენტაცია](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

_კურა_ არის მუდმივი შენახვის ძრავი Iroha (იაპონური _საწყობი_).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

მაქსიმუმ N ბოლო ბლოკები იქნება შენახული მეხსიერებაში.

უფრო ძველი ბლოკები ხვდება მეხსიერებიდან და დაიტვირთება დისკიდან, თუ საჭიროა.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura ინიცირების რეჟიმი

<param-table  default-value=strict env=KURA_INIT_MODE>
<template #type>

ძრავი, შესაძლო მნიშვნელობები:

- `strict`: ყველა ბლოკის მკაცრი დამტკიცება
- `fast`: სწრაფი ინიცირება მხოლოდ ძირითადი შემოწმებით

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

განსაზღვრავს დირექტორი[^paths] სადაც ბლოკები ინახება.

იხილეთ ასევე: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

დროშა, რათა შესაძლებელი იყოს ახალი ბლოკების დაბეჭდვა კონსოლაში.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## რიგები {#queue}

### `queue.capacity` {#param-queue-capacity}

რეჟიმში მოლოდინში მყოფი ოპერაციების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ერთი მომხმარებლისთვის რიგში მყოფი ტრანზაქციების რაოდენობის ზედა ზღვარი.

გამოიყენეთ ეს ვარიანტი გაჟონვისას.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ამ დროის შემდეგ ტრანზაქცია შეწყდება, თუ ის კვლავ რიგშია.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

მხოლოდ დებუგის გამორთვა ვარჯიშისთვის Sumeragi რბილი ფორკების სათავსო გზები. დატოვეთ ეს
აკრძალულია კონტროლირებადი ტესტების გარეთ; მისი შეცვლა მიმდინარე საწარმოო ქსელში
შეიძლება გამოიწვიოს თანატოლების აზრთა სხვადასხვაობა კონსენსუსული ქცევის შესახებ.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## სურათი {#snapshot}

ეს მოდული პასუხისმგებელია
[მსოფლიო მდგომარეობის შეხედულება](/ka/blockchain/world#world-state-view-wsv).

სურათები ინახავს World State View-ის სერიალიზებულ გამშვებ პუნქტს, რათა თანატოლმა შეძლოს
განახორციელოს ყველა ბლოკის გადახდა Kura. Kura რჩება მდგრადი ბლოკი
ისტორია და სიმართლის წყარო განმეორებისთვის; სურათები არის აჩქარების გზა.
ოპვჟრთნაჲ, Iroha კონფიგურირებული ჯაჭვი და
შენახული ბლოკები, სანამ გადაწყვიტავთ ატვირთოთ თუ არა სურათი ან დაბრუნდით განმეორებით.

::: tip წაშალეთ სურათები

იმ შემთხვევაში, თუ რაღაც არასწორია snapshots სისტემა, და გსურთ დაიწყოს ცარიელი გვერდიდან (შესაბამისად
snapshots), შეგიძლიათ წაშალოთ დირექტორი მითითებული [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

სნაპშოტის სისტემის ფუნქციონირების რეჟიმი.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

ძრავი, შესაძლო მნიშვნელობები:

- `read_write`: Iroha ქმნის სურათებს, რომლებიც განსაზღვრულია:
  [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). ოპვჟრთნაჲ, Iroha წაიკითხავს არსებულ სურათს (თუ არსებობს)
  და ადასტურებს, რომ იგი განახლებულია ბლოკების შენახვის შესახებ.
- `readonly`: მსგავსი: `read_write` მაგრამ Iroha არ ქმნის არცერთ კადრს.
- `disabled`: Iroha არც ახალ სურათებს ქმნის და არც არსებულს კითხულობს სტარტაპზე.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

სურათების სიხშირე.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

კადრი, საიდანაც უნდა შეინახოთ სურათები.

იხილეთ ასევე: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## ტელემეტრიის {#telemetry}

ტელემეტრიის ექსპორტი თანატოლთა დიაგნოსტიკას გარე ტელემეტრის კოლექტორზე. კონფიგურაცია
ორივე `telemetry.name` და `telemetry.url` როდესაც თანატოლმა უნდა მიმართოს
კოლექტორი; გამორიცხეთ განყოფილება, როდესაც ტელემეტრიის გამოყენება არ ხდება.

`name` და `url` უნდა იყოს გაერთიანებული.

ყველა `telemetry` სექცია ვარიანტია.

### `telemetry.name` {#param-telemetry-name}

კვანძის სახელწოდება, რომელიც უნდა გამოჩნდეს ტელემეტრიაში.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

სააგენტო WebSocket URL ტელემეტრიის კოლექტორის.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

მინიმალური დრო, რომელიც უნდა დაველოდოთ რეკავშირამდე.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 მაქსიმალური ექსპონენტი, რომელიც გამოიყენება გაზრდის დაგვიანებით შორის reconnections.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

ფაილაპაზი, რომ დაწეროს dev-telemetry to

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
