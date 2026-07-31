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

ტოკი

## ფესვების დონე {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ჯაჭვი ID, რომელიც უნდა იყოს ჩართული თითოეულ ტრანზაქციაში. გამოიყენება თავდასხმის თავიდან ასაცილებლად.

განმეორებითი თავდასხმა არის მცდელობა წარუდგინოს ვალიდური ტრანზაქცია სხვა ქსელში, ვიდრე ის იყო განკუთვნილი. იმის გამო, რომ `chain` ხელმოწერილი ტრანზაკციის სასარგებლო ტვირთის ნაწილია, ერთი ჯაჭვისთვის გაფორმებული ტრანზუქცია უარყოფენ პარტნიორები, რომლებიც იყენებენ სხვა ჯაჭვს ID.

<param-table type=string env=CHAIN />

::: კოდის ჯგუფი

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

პარტნიორის საჯარო გასაღები. კონსენსუსის დამტკიცების პარტნიორებმა უნდა გამოიყენონ BLS-ნორმალური გასაღებები.

<param-table type="public-key" env="PUBLIC_KEY" />

::: კოდის ჯგუფი

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

პარტნიორის კერძო გასაღები. იგი უნდა შეესაბამებოდეს `public_key`; კონსენსუსის ვალიდატორების პარტნიორებმა უნდა გამოიყენონ BLS- ნორმალური გასაღებები.

<param-table type="private-key" env="PRIVATE_KEY" />

::: კოდის ჯგუფი

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

ნდობის მქონე თანატოლების სია.

კონსენსუსის ვალიდატორებმა უნდა გამოიყენონ BLS-Normal peer keys. თითოეული ვალიდატორისთვის, ასევე მიუთითეთ შესაბამისი [`trusted_peers_pop`](#param-trusted-peers-pop) შეტყობინება.

<param-table env="TRUSTED_PEERS">
<template #type>

პარტნიორების რიგები. გამოიყენეთ `PUBLIC_KEY@ADDRESS` როდესაც ცნობილია P2P მისამართი; ასევე მიღებულია შიშველი `PUBLIC_KEY` და საშუალებას აძლევს პარტნიორის მისამართს აღმოაჩინოს ჭორიდან .

</template>
</param-table>

::: კოდის ჯგუფი

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

BLS მტკიცებულების დამადასტურებელი მითითებები ვალიდენტორის სანდო თანატოლებისთვის.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

`public_key` და `pop_hex` ველების მქონე საგნების რიგები

</template>
</param-table>

::: კოდის ჯგუფი

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

ფაილი გზა ხელმოწერილი genesis ბლოკის სასარგებლო დატვირთვა გენერირებული `kagami genesis sign`. გენერაციული პროფილები ჩვეულებრივ წერენ ეს როგორც Norito `.nrt` ფაილი.

<param-table type="file-path" env="GENESIS" />

::: კოდის ჯგუფი

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

საჯარო გასაღები გენეზისის გასაღების წყვილის.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: კოდის ჯგუფი

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

მისამართი კონსენსუსის (sumeragi) და ბლოკის სინქრონიზაციის (ბლოკი_sync) მიზნით p2p კომუნიკაციისთვის.

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: კოდის ჯგუფი

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

თანატოლური მისამართი (გარეგანი, როგორც ამას ხედავენ სხვა თანატოლები).

გაჟღერდება დაკავშირებულ თანატოლებს, რათა მათაც შეძლონ სხვა თანატოლებისათვის.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: კოდის ჯგუფი

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

::: კოდის ჯგუფი

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

დროის ინტერვალი თანატოლებს შორის ბოლო ბლოკის შესახებ.

უფრო ხშირი ჭორაობა შეამცირებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: კოდის ჯგუფი

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

მაქსიმალური რაოდენობა ტრანზაქციები ჭორების შეტყობინებაში.

უფრო პატარა ზომა იწვევს ხანგრძლივ სინქრონიზაციის დროს, მაგრამ სასარგებლოა, თუ თქვენ გაქვთ მაღალი პაკეტის დაკარგვა.

<param-table type=number default-value=500 />

::: კოდის ჯგუფი

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

თანატოლებს შორის მიმდინარე ტრანზაქციის მოლოდინში ჭორაობის პერიოდი.

უფრო ხშირი ჭორაობა შეამცირებს სინქრონიზაციის დროს, მაგრამ შეიძლება გადატვირთოს ქსელი.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: კოდის ჯგუფი

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

დროის ხანგრძლივობა, რომლის შემდეგაც თანატოლთან კავშირი წყდება, თუ თანატოლი უმოქმედია.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: კოდის ჯგუფი

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

მისამართი, რომელსაც Torii სერვერმა უნდა მოუსმინოს და რომელზეც კლიენტები თავიანთ თხოვნებს აკეთებენ.

<param-table type=socket-addr env=API_ADDRESS />

::: კოდის ჯგუფი

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

[Torii საბოლოო წერტილების ](/ka/reference/torii-endpoints.md) მიერ მიღებული ნედლი მოთხოვნის ორგანოში ბითების მაქსიმალური რაოდენობა.

ეს ლიმიტი გამოიყენება DOS თავდასხმების თავიდან ასაცილებლად.

<param-table>
<template #type>

რაოდენობა (ბაიტების)

</template>
<template #default-value>

`64_000_000` (64 მლნ ბაიტი)

</template>
</param-table>

::: კოდის ჯგუფი

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

დრო, რომლის დროსაც მაღაზიაში შეკითხვა შეიძლება დარჩეს, თუ მისაღებად არ არის.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: კოდის ჯგუფი

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

ცოცხალი გამოკითხვების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: კოდის ჯგუფი

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

ერთი მომხმარებლისთვის პირდაპირი გამოკითხვების რაოდენობის ზედა ზღვარი.

<param-table type=number default-value=128 />

::: კოდის ჯგუფი

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## ხე-ტყის დამჭერი {#logger}

### `logger.level` {#param-logger-level}

ზოგადი ჩანაწერის ვერბოზობა (იხილეთ [`logger.filter`](#param-logger-filter) დახვეწილი კონფიგურაციისათვის).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `TRACE`: ყველა ღონისძიება, მათ შორის დაბალი დონის ოპერაციები.
- `DEBUG`: დებოგის დონეზე შეტყობინებები, სასარგებლო დიაგნოსტიკისთვის.
- `INFO`: ზოგადი ინფორმაციული შეტყობინებები.
- `WARN`: გაფრთხილებები, რომლებიც მიუთითებს პოტენციურ პრობლემებზე.
- `ERROR`: შეცდომები, რომლებიც შეფერხებენ ნორმალურ ფუნქციას, მაგრამ საშუალებას აძლევენ გაგრძელდეს მუშაობა.

აირჩიეთ დონე, რომელიც საუკეთესო შეესაბამება თქვენს გამოყენების შემთხვევაში. იხილეთ [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) დამატებითი დეტალებისთვის, თუ როგორ უნდა გამოიყენოთ სხვადასხვა ლოგის დონეები.

</template>
</param-table>

::: კოდის ჯგუფი

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip გაშვების დროის განახლება

აღნიშნული პარამეტრი განთავსების დროის კონფიგურაციის განახლებაზე ექვემდებარება Torii ოპერატორის საბოლოო წერტილების საშუალებით.

:::

### `logger.filter` {#param-logger-filter}

დახვეწილი ჩანაწერის ფილტრები გარდა [`logger.level`](#param-logger-level). საშუალებას აძლევს მორგებული ჩანაწერი verbosity თითო სამიზნეზე.

<param-table type=string env=LOG_FILTER>
<template #type>

სტრინგი შედგება ერთი ან რამდენიმე კომით გამოყოფილი დირექტივიდან. თითოეულ დირექტივას შეიძლება ჰქონდეს შესაბამისი მაქსიმალური ვერბოზობის დონე, რომელიც საშუალებას აძლევს (მაგალითად, შერჩევა) შესაბამის სიგრძეს და მოვლენებს. Iroha მიიჩნევს, რომ ნაკლებად ექსკლუზიური დონეები (მაგალითად `trace` ან `info`) უფრო ლექსიკურია, ვიდრე უფრო ექსკლოზიური დონეები (მაგ jaaka `error` ან `warn`).

უმაღლეს დონეზე, დირექტივების სინტაქსი რამდენიმე ნაწილისგან შედგება:

```
target[span{field=value}]=level
```

დამატებითი დეტალებისთვის იხილეთ [`tracing-subscriber` დოკუმენტაცია ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: კოდის ჯგუფი

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info [`logger.level`](#param-logger-level)-თან თავსებადობა

`logger.filter` მუშაობს ერთობლივად [`logger.level`](#param-logger-level) და არც ერთი არ გადაწერს მეორე.

მაგალითად, თუ: `logger.level` დადგენილია: `INFO` და `logger.filter` დადგენილია: `iroha_core=debug`, მიღებული ფილტრის კომპლექტი იქნება: `info,iroha_core=debug` (მაგალითად, `info` ყველა მოდულისათვის, `debug` სამედიცინო `iroha_core`).

:::

::: tip გაშვების დროის განახლება

აღნიშნული პარამეტრი განთავსების დროის კონფიგურაციის განახლებაზე ექვემდებარება Torii ოპერატორის საბოლოო წერტილების საშუალებით.

:::

### `logger.format` {#param-logger-format}

ლოგის ფორმატი.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `full`: დეფოლტური ფორმატორი. ეს გამოიყოფა ადამიანის მიერ წაკითხული, ერთი ხაზის ლოგები თითოეული მოვლენისთვის, რომელიც ხდება, მიმდინარე სიგრძის კონტექსტი გამოჩნდება მოვლენის ფორმატირებულ წარმოდგენას წინ.
- `compact`: დეფოლტური ფორმატორის ვარიანტი, ოპტიმიზირებული მოკლე ხაზის სიგრძეებისთვის. მიმდინარე სფეროს კონტექსტის ველები ჩართულია ფორმატირებული მოვლენის ველებთან და არ არის ნაჩვენები სფეროს სახელები; სიტყვიერობის დონე შეკუმშულია ერთი პერსონაჟით.
- `pretty`: გადაჭარბებულად ლამაზი, მრავალხაზოვანი დღიურების გამოგზავნა, ოპტიმიზირებული ადამიანის წაკითხვისთვის. ეს ძირითადად განკუთვნილია ადგილობრივი განვითარებისა და დებეგინგისათვის ან ბრძანების ხაზის პროგრამებისთვის, სადაც დღიურების ავტომატიზებული ანალიზი და კომპაქტური შენახვა ნაკლებად პრიორიტეტულია, ვიდრე მისაღებადობა და ვიზუალური მიმზიდველობა.
- `json`: გამოიყოფა ახალი ხაზით განსაზღვრული JSON ლოგები. ეს განკუთვნილია საწარმოო გამოყენებისთვის სისტემებთან, სადაც სტრუქტურირებული ლოგები ანალიზისა და ნახვის საშუალებების მეშვეობით გამოიყენება, როგორც JSON. JSON გამოსავალი არ არის ოპტიმიზირებული ადამიანური წაკითხვისთვის.

დამატებითი დეტალებისა და ნიმუშის გამომუშავების შესახებ იხილეთ [`tracing-subscriber` დოკუმენტაცია ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: კოდის ჯგუფი

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

::: კოდის ჯგუფი

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

მავთულხლართები, შესაძლო მნიშვნელობები:

- `strict`: ყველა ბლოკის მკაცრი დამტკიცება
- `fast`: სწრაფი ინიციალიზაცია მხოლოდ ძირითადი შემოწმებით

</template>
</param-table>

::: კოდის ჯგუფი

```toml [Config File]
[kura]
init_mode = "fast"
```

```shell [Environment]
KURA_INIT_MODE=fast
```

:::

### `kura.store_dir` {#param-kura-store-dir}

მითითებს დირექტორი[^paths] სადაც ბლოკები ინახება.

იხ. ასევე: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: კოდის ჯგუფი

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

::: კოდის ჯგუფი

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

რიგში მყოფი ოპერაციების რაოდენობის ზედა საზღვარი.

<param-table type=number default-value=65_536 />

::: კოდის ჯგუფი

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

ერთი მომხმარებლისთვის რიგში მყოფი ტრანზაქციების რაოდენობის ზედა ზღვარი.

გამოიყენეთ ეს ვარიანტი გაჟონვისას.

<param-table type=number default-value=65_536 />

::: კოდის ჯგუფი

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

ამ დროის შემდეგ ტრანზაქცია გათავისუფლდება, თუ ის ჯერ კიდევ რიგშია.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: კოდის ჯგუფი

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Sumeragi რბილი ღობეების მართვის გზების განხორციელებისთვის მხოლოდ დებოგის გადართვა. დატოვეთ ეს გამორთული კონტროლირებადი ტესტების გარეთ; მისი შეცვლა მიმდინარე საწარმოო ქსელში შეიძლება გამოიწვიოს თანატოლთა აზრთა სხვადასხვაობა კონსენსუსის ქცევაში.

<param-table type=bool default-value=false />

::: კოდის ჯგუფი

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## გადაღება {#snapshot}

ეს მოდული პასუხისმგებელია [World State View](/ka/blockchain/world#world-state-view-wsv)-ის გადაღებების კითხვისა და წერისათვის.

სნაპშოტები ინახავს World State View- ის სერიალიზებულ გამშვებ პუნქტს, რათა თანატოლმა შეძლოს ყველა ბლოკის განახლება Kura. Kura რჩება მდგრადი ბლოკის ისტორიისა და სიმართლის წყაროს განახლებისთვის; სნაპშეტები არის გაჩქარების გზა. დაწყებისას, Iroha შეამოწმებს გადაღებების მეტა მონაცემებს კონფიგურირებული ჯაჭვისა და შენახული ბლოკების წინააღმდეგ, სანამ გადაწყვეტს ატვირთოს თუ არა გადაღება ან დაუბრუნდეს განმეორებას.

::: tip წაშალეთ სურათები

იმ შემთხვევაში, თუ რაღაც არასწორია სურათების სისტემაში და გსურთ დაიწყოთ ცარიელი გვერდიდან (შურათების თვალსაზრისით), შეგიძლიათ ამოიღოთ დირექტორი მითითებული [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

რეჟიმი, რომელშიც Snapshot სისტემა მუშაობს.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

მავთულხლართები, შესაძლო მნიშვნელობები:

- `read_write`: Iroha ქმნის სურათებს, რომელთა პერიოდიც მითითებულია [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). დაწყებისას, Iroha კითხულობს არსებულ სურათს (თუ არსებობს) და ადასტურებს, რომ იგი არის განახლებული ბლოკების შენახვის შესახებ.
- `readonly`: იგივეა, რაც `read_write` მაგრამ Iroha არ ქმნის რაიმე კადრებს.
- `disabled`: Iroha არც ახალ სურათებს ქმნის და არც უკვე არსებულს კითხულობს სტარტაპზე.

</template>
</param-table>

::: კოდის ჯგუფი

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

ფოტოების სიხშირე.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: კოდის ჯგუფი

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

კადრი, საიდანაც უნდა შეინახოთ ფოტოები.

იხ. ასევე: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: კოდის ჯგუფი

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## ტელემეტრიები {#telemetry}

ტელემეტრიის ექსპორტი თანატოლთა დიაგნოსტიკას საგარეო ტელემეტრის კოლექტორში. კონფიგურირეთ როგორც `telemetry.name` ისე `telemetry.url`, როდესაც თანატოლმა უნდა მოუწოდოს ანგარიშს კოლექტორს; გამორიცხეთ განყოფილება, როდესაც ტელემეტრია არ გამოიყენება.

`name` და `url` უნდა იყოს შეკრული.

ყველა `telemetry` მონაკვეთი არ არის ნებადართული.

### `telemetry.name` {#param-telemetry-name}

კვანძის სახელი უნდა გამოჩნდეს ტელემეტრიაში.

<param-table type=string />

::: კოდის ჯგუფი

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

ტელემეტრიის კოლექტორის WebSocket URL.

<param-table type=string />

::: კოდის ჯგუფი

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

მინიმალური დრო, რომელიც უნდა დაველოდოთ რეკავშირამდე.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: კოდის ჯგუფი

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

2 მაქსიმალური ექსპონენტი, რომელიც გამოიყენება გაზრდის დაგვიანებით შორის reconnections.

<param-table type=number default-value=4 />

::: კოდის ჯგუფი

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

საფაილო გზა დეველოპერული ტელემეტრიის დაწერისთვის

<param-table type=file-path />

::: კოდის ჯგუფი

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
