---
translation_locale: ka
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# კონფიგურაციის პარამეტრები {#configuration-parameters}

ტოკი

## ფესვის დონე {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ქაჟის ID, რომელიც უნდა იყოს ჩართული თითოეულ ტრანზაქციაში. გამოიყენება თავდასხმების თავიდან ასაცილებლად.

განმეორებითი თავდასხმა არის მცდელობა წარუდგინოს ვალიდური ტრანზაქცია სხვა ქსელში, ვიდრე ის იყო განკუთვნილი. იმის გამო, რომ `chain` ხელმოწერილი ტრანზაკციის დატვირთვის ნაწილია, ერთი ჯაჭვისთვის გაფორმებული ტრანსაქცია უარყოფენ ქსელის კვანძები, რომლებიც იყენებენ სხვა ჯაჭვების ID- ს.

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

ქსელის კვანძის საჯარო გასაღები. კონსენსუსის ვალიდატორი კვანძები BLS-ჩვეულებრივი გასაღებებს უნდა იყენებდეს.

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

ქსელის კვანძის პირადი გასაღები. ის `public_key`-ს უნდა ემთხვეოდეს; კონსენსუსის ვალიდატორი კვანძები BLS-ჩვეულებრივი გასაღებებს უნდა იყენებდეს.

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

წინასწარ განსაზღვრული საიმედო ქსელის კვანძების სია.

კონსენსუსის დამტკიცებლებმა უნდა გამოიყენონ BLS- ნორმალური ქსელის თანაბარი გასაღები. თითოეული ვალიდატორისთვის, ასევე მიუთითეთ შედარებითი [`trusted_peers_pop`](#param-trusted-peers-pop) შესვლა.

<param-table env="TRUSTED_PEERS">
<template #type>

ქსელის კვანძების სტრიქონების რიგები. გამოიყენეთ `PUBLIC_KEY@ADDRESS` როდესაც ცნობილია P2P მისამართი; ასევე მიღებულია შიშველი `PUBLIC_KEY` და საშუალებას აძლევს აღმოაჩინოს ქსელის თანათოლების მისამართი ჭორიდან .

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

BLS ვალდიტორის მიერ ნდობის მქონე ქსელის კვანძეებისათვის საკუთრების დამტკიცების მითითებები.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` და `pop_hex` ველების მქონე საგნების რიგები

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

## ბლოკჩეინის გენეზისი {#genesis}

### `genesis.file` {#param-genesis-file}

ფაილი გზა ხელმოწერილი ბლოკჩეინის გენეზისი ბლოკის სასარგებლო დატვირთვა გენერირებული `kagami genesis sign`. გენერაციული პროფილები ჩვეულებრივ წერენ ეს როგორც Norito `.nrt` ფაილი.

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

საჯარო გასაღები ბლოკჩეინის გენეზისის გასაღების წყვილი.

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

მისამართი კონსენსუსის (sumeragi) და ბლოკის სინქრონიზაციის (ბლოკი_სინქრონიზაცია) მიზნით p2p კომუნიკაციისთვის.

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

თანასწორთა შორის მისამართი (გარეგანი, როგორც ჩანს სხვა ქსელის კვანძების მიერ).

გაჟღერდება კავშირში მყოფი ქსელის კვანძებისთვის, რათა მათაც შეძლონ სხვა ქსელური თანატოლებისათვის ეს ჭორაობა.

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

დროის ინტერვალი ქსელური თანატოლების მოთხოვნებს შორის უახლესი ბლოკისათვის.

უფრო ხშირი ჭორაობა შეამცირებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

მაქსიმალური რაოდენობა ტრანზაქციები ჭორების შეტყობინებაში.

უფრო პატარა ზომა იწვევს ხანგრძლივ სინქრონიზაციის დროს, მაგრამ სასარგებლოა, თუ თქვენ გაქვთ მაღალი პაკეტის დაკარგვა.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

ქსელის კვანძებს შორის ტრანზაქციის მოლოდინში ჭორების პერიოდი.

უფრო ხშირი ჭორაობა შეამცირებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

დროის ხანგრძლივობა, რომლის შემდეგაც ქსელის პართან კავშირი წყდება, თუ ქსელის პარ არ მუშაობს.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

მისამართი, რომელსაც Torii სერვერმა უნდა მოუსმინოს და რომელზეც კლიენტები თავიანთ თხოვნებს აკეთებენ.

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

მაქსიმალური რაოდენობა ბაიტები ნედლეულის მოთხოვნის ორგანოში, რომელიც მიიღეს [Torii API საბოლოო ნიშნები](/ka/reference/torii-endpoints.md).

ეს ლიმიტი გამოიყენება DOS თავდასხმების თავიდან ასაცილებლად.

<param-table>
<template #type>

რაოდენობა (ბაიტების)

</template>
<template #default-value>

`64_000_000` (64 მლნ ბაიტი)

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

ცოცხალი მოთხოვნების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ერთი მომხმარებლისთვის პირდაპირი მოთხოვნების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ხე-ტყის დამჭერი {#logger}

### `logger.level` {#param-logger-level}

ზოგადი რეგისტრაციის ვერბოზობა (იხ. [`logger.filter`](#param-logger-filter) დამუშავებული კონფიგურაციისათვის).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `TRACE`: ყველა ღონისძიება, მათ შორის დაბალი დონის ოპერაციები.
- `DEBUG`: დებოგის დონეზე შეტყობინებები, სასარგებლო დიაგნოსტიკისთვის.
- `INFO`: ზოგადი ინფორმაციული შეტყობინებები.
- `WARN`: გაფრთხილებები, რომლებიც მიუთითებს პოტენციურ პრობლემებზე.
- `ERROR`: შეცდომები, რომლებიც შეფერხებენ ნორმალურ ფუნქციას, მაგრამ საშუალებას აძლევენ გაგრძელდეს მუშაობა.

აირჩიეთ დონე, რომელიც საუკეთესო შეესაბამება თქვენს გამოყენების შემთხვევას. იხილეთ [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) დამატებითი დეტალებისთვის, თუ როგორ გამოიყენოთ სხვადასხვა ლოგის დონეები.

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

::: tip შესრულების გარემოს განახლება

ამ პარამეტრის შესრულების გარემოს კონფიგურაცია Torii-ს ოპერატორის საბოლოო წერტილებით შეიძლება განახლდეს.

:::

### `logger.filter` {#param-logger-filter}

რეფინირებული დღიურების ფილტრები გარდა [`logger.level`](#param-logger-level). საშუალებას გაძლევთ დააკომპლექტოთ ჩანაწერის სიტყვიერება თითოეული მიზნის მიხედვით.

<param-table type=string env=LOG_FILTER>
<template #type>

სტრიკი შედგება ერთი ან რამდენიმე კომით გამოყოფილი დირექტივიდან. თითოეულ დირექტივას შეიძლება ჰქონდეს შესაბამისი მაქსიმალური ვერბოზობის დონე, რომელიც საშუალებას აძლევს (მაგალითად, შერჩევს) შესაბამის სიგრძეს და მოვლენებს. Iroha მიიჩნევს, რომ ნაკლებად ექსკლუზიური დონეები (მაგალითად, `trace` ან `info`) უფრო ლექსიკურია, ვიდრე უფრო ექსკლოზიური დონეები (მაგარია, `error` ან `warn`).

უმაღლეს დონეზე, დირექტივების სინტაქსი რამდენიმე ნაწილისგან შედგება:

```
target[span{field=value}]=level
```

დამატებითი დეტალებისთვის იხილეთ [`tracing-subscriber` დოკუმენტაცია](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

::: info შემადგენლობა: [`logger.level`](#param-logger-level)

`logger.filter` მუშაობს ერთობლივად [`logger.level`](#param-logger-level) და არცერთი მათგანი ერთმანეთს არ უთმობს.

მაგალითად, თუ: `logger.level` დადგენილია: `INFO` და `logger.filter` დადგენილია: `iroha_core=debug`, მიღებული ფილტრის კომპლექტი იქნება: `info,iroha_core=debug` (მაგალითად, `info` ყველა მოდულისათვის, `debug` სამედიცინო `iroha_core`).

:::

::: tip შესრულების გარემოს განახლება

ამ პარამეტრის შესრულების გარემოს კონფიგურაცია Torii-ს ოპერატორის საბოლოო წერტილებით შეიძლება განახლდეს.

:::

### `logger.format` {#param-logger-format}

ლოგის ფორმატი.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `full`: დეფოლტური ფორმატორი. ეს გამოიყოფა ადამიანის მიერ წაკითხული, ერთი ხაზის ლოგები თითოეული მოვლენისთვის, რომელიც ხდება, მიმდინარე სიგრძის კონტექსტი გამოჩნდება მოვლენის ფორმატირებული წარმოდგენაზე ადრე.
- `compact`: შერჩეული ფორმატორის ვარიანტი, ოპტიმიზირებული მოკლე ხაზების სიგრძისთვის. მიმდინარე სფეროს კონტექსტის ველები დამატებულია ფორმატირებული მოვლენის ველებთან და არ არის ნაჩვენები სფეროს სახელები; სიტყვიერობის დონე შეკუმშულია ერთი ასოზე.
- `pretty`: გამოიყოფა ზედმეტად ლამაზი, მრავალხაზოვანი დღიურები, რომელიც ოპტიმიზირებულია ადამიანის წაკითხვისთვის. ეს ძირითადად განკუთვნილია ადგილობრივი განვითარებისთვის და დებეგირება ან ბრძანების ხაზის პროგრამებისთვის, სადაც დღიურების ავტომატიზებული ანალიზი და კომპაქტური შენახვა ნაკლებად არის პრიორიტეტი, ვიდრე კითხულობა და ვიზუალური მიმზიდველობა.
- `json`: გამოიყოფა ახალი ხაზით განსაზღვრული JSON ლოგები. ეს განკუთვნილია საწარმოო გამოყენებისთვის სისტემებით, სადაც სტრუქტურირებული ლოგები გამოიყენება როგორც JSON ანალიზის და ნახვის ინსტრუმენტების მეშვეობით. JSON გამოშვება არ არის ოპტიმიზებული ადამიანის წაკითხვისთვის.

დამატებითი დეტალებისა და ნიმუშის შედეგებისათვის იხილეთ: [`tracing-subscriber` დოკუმენტაცია](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

Kura არის Iroha-ის მუდმივი შენახვის ძრავი (იაპონური საწყობისთვის).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

მაქსიმუმ N ბოლო ბლოკები შენახული იქნება მეხსიერებაში.

ძველი ბლოკები ხვდება მეხსიერებიდან და დაიტვირთება დისკიდან, თუ საჭიროა.

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

Kura ინიცირების რეჟიმი. `strict` არის ნორმალური და დეფოლტური რეჟიმი: ის ვალიდატირებს კანონიკური ისტორიას, აღდგენის არტეფაქტებს, დამხმარე ინდექსებსა და შენახვის ანგარიშსწორებას სანამ კვანძი აქტიურდება.

`fast` არის საგანგებო მდგომარეობის დეგრადირებული მომსახურების რეჟიმი ოპერატიული ხილვადობის აღდგენისათვის, როდესაც სრული სტარტაპ აუდიტი რისკი გათიშვის. ეს მოითხოვს შენახვა ადრე ინიციალიზებული `strict` და ამჟამინდელი დროის მონაცემთა ნახვის გენერაცია, რომელიც შეიცავს ზუსტად ხუთ არტეფაქტს: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, და `snapshot.merkle.json`. დომენისგან განცალკევებული ოპერატორის ხელმოწერა აკავშირებს რეკლამირებულ დატვირთვის კრიპტოგრაფიულ დიჯესტს და შეზღუდული ტექნიკური მანიფესტს. ტექნიკური მანიფესტი აკავშირებს დატვირთვის სიგრძეს, ჯაჭვის/მათობრივი ქსელის იდენტობას, ტერმინალის სიმაღლეს/ჰეშს; SCCP პოლიტიკა კრიპტოგრაფიული ჰეში, და საწყისი გამართვა-წარმომავლობა ყოფნა. სწრაფი უარყოფითი საწყისი გამართვა წარმომავლობა და მოითხოვს იგივე ზუსტი მარკერი / რაოდენობა / tip საზღვარი მდგრადი Kura. პირველი გამოშვების კვანძები იღებენ ზუსტად ამ ხუთი არტეფაქტს და უარყოფენ ყველა სხვა არტეფაკტის რაოდენობას ან ფაილების სახელის ნაკრებებს.

სწრაფი ინვენტარიზაცია ამ ხუთი სახელისა და მეტამონაცემების - უკავშირდება დატვირთვას და Merkle ფაილებს, მაგრამ არ კითხულობს, კრიპტოგრაფიული hash, ანალიზი, ან დეკოდი მათი შინაარსი. იგი აშენებს მინიმალურ სამყაროს / Nexus ხელმოწერილი ტექნიკური მანიფესტიდან, გადმოსცემს ზუსტ Kura კრიპტოგრაფიულ ჰეშის პრეფიქსს მხოლოდ წაკითხვით და არ გახსნის პუნქტის დროში მონაცემების ნახვას მსოფლიო, ბლოკ-ჰეშის მასაჟი, ტრანზაქციის ისტორია, წარმოშობითი ინდექსი და გამძლე აღდგენის ჟურნალები. Merkle, კანონიკური და სემანტიკური წერტილ-დროში მონაცემთა ხედვის აუდიტები, ისტორიული ბლოკი/შედეგობა/SCCP შეთანხმება, Sumeragi აქტიური სიმაღლის აღდგენა, შერწყმისა და მოთხოვნის ჟურნალები, შესრულების მარშრუტის მანიფესტ / შესაბამისობის წყაროები, Kura-ს მიერ მხარდაჭერილი არქივები SoraFS; რეკურსიული შენახვის ანგარიშსწორება და ვარიანტური მომსახურების შეთანხმებლები კვლავ გადავადებულია. ადგილობრივი ტრანზაქციების მიღება, წინადადებები, ხმის მიცემა, კანონიკური წერილები და დამხმარე მწარმოებლები კვლავ შეზღუდულია. Kura თავისთავად უარყოფს მწერლის დაწყებასა და მდგრადი მუტაციებს; დამუშავების კონვეიერი და FASTPQ პერმანსიულობის რიგები დაუყოვნებლივ უარყოფენ სამუშაოს, იმის ნაცვლად, რომ შეინარჩუნონ ან კოდირონ იგი; Kura წაიკითხეთ APIs ასევე გამორთეთ სარემონტო და მდგრადობის სინქრონიზაციის ქცევა: დროებითი დამხმარე ჩანაწერები არ არის ხელშეწყობილი, დაკარგული შესრულების ზოლის არტეფაქტები არ არის გამოქვეყნებული და პროგრესის ბარიერები არ არის შეთანხმებული. Sumeragi და ტრანზაქციის ჭორი არ იწყება. Torii გამოფენს მხოლოდ ჯანმრთელობას, სიცოცხლეს, მზადყოფნას, ქსელის კვანძებს და კონფიგურაციის ოპერაციებს; API- ვერსია, სტატუსი, მეტრიკები და ყველა ჩვეულებრივი მდგომარეობის / ისტორიის მარშრუტები არ არის ხელმისაწვდომი. მზადყოფნა რჩება ხელმისაწვდომი სანამ მკაცრი განახლება.

გამოიყენეთ `fast` მხოლოდ ინციდენტისთვის. მას შემდეგ, რაც სერვისი სტაბილურია, შეაჩერეთ კვანძი, აღადგინეთ `strict` და განახორციელეთ რეაბილიტაცია, ასე რომ ყველა გადავადებული შემოწმება და ინდექსის რეაბილიტირება დაიწყება სანამ წარმოება განაახლებს. სწრაფი რეჟიმი არ საჭიროებს გადადებული შერწყმის ლოგის შექმნას და არ ქმნის, აღადგენს, ამცირებს ან იმპორტირებს კანონიკურ შენახვას; გამოქვეყნებელი სათაურები და მოქმედ დამხმარე აღდგენის ეტაპები იგნორირდება კითხვის გარეშე ან მუტაციის გარეშე, შემდეგ კი რჩება მკაცრი აღდგენა- ისთვის. იმპორტირებული მხოლოდ ჰეშ-ის მონაცემთა ხედვის პუნქტი დროში არ არის ხელმისაწვდომი. დაკარგული ან არასწორი ამჟამინდელი მონაცემთა ხედი დროში დაუყოვნებლივ ჩავარდება; სწრაფი არასდროს დაბრუნდება ცარიელი სამყაროს ან ისტორიული განახლების რეაბილიტაციაზე.

<param-table default-value=strict>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `strict`: სრული მოწმობა და ჩვეულებრივი წარმოება.
- `fast`: შეზღუდული საგანგებო დაწყება წარმოების კარანტინით, სანამ მკაცრი განახლება არ მოხდება

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

მითითებულია დირექტორი [^paths], სადაც ბლოკები ინახება.

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

დროშა, რომელიც საშუალებას აძლევს დაბეჭდოს ახალი ბლოკები კონსოლაში.

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

რიგში მყოფი ოპერაციების რაოდენობის ზედა ზღვარი.

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

ამ დროის შემდეგ ტრანზაქცია გათავისუფლდება, თუ ის ჯერ კიდევ რიგშია.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

მხოლოდ გამართვისთვის განკუთვნილი გადამრთველი, რომლითაც Sumeragi-ის რბილი ფორკის დამუშავების გზები მოწმდება. კონტროლირებული ტესტების გარეთ იგი გამორთული დატოვეთ; მოქმედ საწარმოო ქსელში მისმა შეცვლამ შეიძლება კვანძებს შორის კონსენსუსის ქცევაზე უთანხმოება გამოიწვიოს.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Atomic კერძო ფინანსური ოპერაციების ანგარიშსწორება {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` განაპირობებს ცალკეულ `AtomicPrivateSettlementV1` გზას. იგი დეფოლუტურად არის გამორთული. `enabled = true`-ის დაყენება ასევე საჭიროებს `activation_height`; მიღება კვლავ ვერ დაიხურება, თუ არ არის აქტიური ქსელზე შესაძლებლობა, შეტყობინების ვადა, ფიქსირებული მტკიცებულების პროფილი და აუდიტის მართვა / აუდიტი

ძირითადი საზღვრები: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, და `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` უნდა იყოს მკაცრად მზარდი ქვეჯგუფი V1 კალაპოტის გაკვეთილები. `permitted_policy_versions` იღებს მხოლოდ V1.

`max_capsule_bytes` აზომავს სრული `PrivateSettlementAuditCapsuleV1` ბაიტების ერთიანი პროტოკოლური სტანდარტის Norito ბიტებს, მათ შორის AAD, კრიპტოგრაფიული ნონსის ღირებულებას, ციფრულ ტექსტს, ვექტორულ ჩარჩოს და თითოეულ აუდიტორს, რომელიც შეფუთულია DEK რიგში; ეს არ არის მხოლოდ შიფროტექსტის საზღვარი. ყველა ჩართული საფენი კლასი უნდა შეესაბამებოდეს კონსერვატიულ მონაცემთა კონტეინერს მთელი კაფსულა მინიმუმ `default_min_auditor_approvals` აუდიტორებისთვის. ამ დამტკიცების პარამეტრი ასევე არის განსაზღვრული სართული: Torii უარყოფს ახლად მიღებულ პოლიტიკას, რომელსაც აქვს უფრო დაბალი `min_approvals` ღირებულება და უარყოფს ნებისმიერ ფაქტობრივ კაფსულას კანონიკური ბაიტების ლიმიტის გადაცილებისას.

აღნიშნული პარამეტრები არ გააჩნიათ საწარმოო გარემოს ცვლადი აქტივაციის შემოვლით. იხილეთ [ატომური კერძო ფინანსური ტრანზაქციების გადახდა მონაცემთა სივრცეში](/ka/get-started/atomic-private-settlement) კონფიგურაციის სრული მაგალითისა და ოპერაციული მოთხოვნებისათვის. გზა არ არის წარმოების კვალიფიციური სანამ დოკუმენტირებული გარე გამშვები კარები არ გაივლის.

## დროის წერტილის მონაცემების ნახვა {#snapshot}

ამ მოდულზე პასუხისმგებელია [მსოფლიო მდგომარეობის შეხედულება](/ka/blockchain/world#world-state-view-wsv) მონაცემთა წერტილოვანი დროის ხედვის წაკითხვა და დაწერა.

წერტილი-in-დრო მონაცემების ნახვა ინახავს მსოფლიო მდგომარეობის ხედი- ის სერიალიზებულ საკონტროლო წერტილს, რათა ქსელის კვანძმა შეძლოს ყველა ბლოკის Kura გადათამაშების გარეშე განახლება. Kura რჩება მდგრადი ბლოკის ისტორიისა და სიმართლის წყაროს გათამაშებისთვის; წერტილი-in დრო მონაცემების ნახვები არის დაჩქარების გზა. დაწყებისას, Iroha კონფიგურირებული ჯაჭვისა და შენახული ბლოკების მიმართ შეამოწმებს წერტილ-დროში მონაცემთა ხედვის მეტადატალებს, სანამ გადაწყვეტს ატვირთავს თუ არა წერტილზე დროში მონაცემთა ნახვა ან გადახდის შემდეგ.

::: tip წაშალეთ მონაცემთა პუნქტის დროის ნახვა

თუ რამე არასწორია წერტილოვან მონაცემთა ხედვის სისტემაში, და გსურთ დაიწყოს ცარიელი გვერდიდან (პუნქტის დროში მონაცემების ნახვის თვალსაზრისით), შეგიძლიათ წაშალოთ დირექტორი მითითებული მიერ [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

რეჟიმი წერტილი-in-დრო მონაცემთა ხედვის სისტემის ფუნქციონირება.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `read_write`: Iroha ქმნის მონაცემთა პუნქტის დროის ხედვას, რომელიც განსაზღვრულია [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). დაწყებისას, Iroha კითხულობს არსებულ მონაცემთა პუნქტის დროის ნახვას (თუ არსებობს) და ადასტურებს, რომ ის ბლოკების შენახვის შესახებ განახლებულია.
- `readonly`: იგივეა, რაც `read_write` მაგრამ Iroha არ ქმნის რაიმე კადრებს.
- `disabled`: Iroha არ ქმნის ახალ მონაცემთა წერტილოვან დროში ნახვებს და არც კითხულობს არსებულს სტარტაპზე.

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

მდგომარეობის ანაბეჭდების შექმნის სიხშირე.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

კატალოგი, სადაც მდგომარეობის ანაბეჭდები ინახება.

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

## ტელემეტრიები {#telemetry}

ტელემეტრია ექსპორტებს ქსელის კვანძების დიაგნოსტიკას გარე ტელემეტრიის კოლექტორში. კონფიგურირება როგორც `telemetry.name` და `telemetry.url` როდესაც ქსელის თანათოლიკე უნდა ანგარიშსწორდეს კოლექტორს; გამორიცხა სექცია, როდესაც ტელემეტრა არ გამოიყენება .

`name` და `url` უნდა იყოს შეკრული.

ყველა `telemetry` მონაკვეთი არ არის ნებადართული.

### `telemetry.name` {#param-telemetry-name}

კვანძის სახელი უნდა გამოჩნდეს ტელემეტრიაში.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

ტელემეტრიის კოლექტორის WebSocket URL.

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

2 მაქსიმალური ექსპონენტი, რომელიც გამოიყენება გაზრდის დაგვიანებით შორის ხელახალი დაკავშირებები.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

საფაილო გზა დეველოპერული ტელემეტრიის დაწერისთვის

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
