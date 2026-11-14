---
translation_locale: hy
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Rust {#rust}

Rust իրականացումը գործում է հիմնական աշխատանքային տարածքում եւ շարունակում է մնալ Iroha 3 կոդային բազայի հետ աշխատելու ամենաուղղակի միջոցը:

## Ի՞նչ եք ստանում {#what-you-get}

Ներկայումս վերածնային պահեստը բացահայտում է.

- `iroha` Rust հաճախորդի տուփ
- `iroha` CLI որպես ամենատարածված հղումային հաճախորդ
- փոխանակված տվյալների մոդել, կրիպտո եւ Norito տուփեր, որոնք օգտագործվում են SDK շերտով:

## Առաջարկվող մեկնարկային կետ {#recommended-starting-point}

Նախագծի ներկայիս վիճակի համար սկսեք CLI հղումից եւ աշխատանքային տարածքից:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Գործարկեք հղումային հաճախորդը ստուգված կանխարգելված հաճախորդի կոնֆիգերի միջոցով.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## Փորձեք Taira Միայն կարդալ {#try-taira-read-only}

Նույն աշխատատեղի ստուգման վայրից փորձեք հանրային Taira ախտորոշման օգնականը.

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Ճանապարհային մակարդակի ստուգումների համար ուղղակիորեն օգտագործեք Torii JSON API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml`-ը ստեղծելուց հետո նույն երկուական ֆայլը կարող է `iroha taira account`-ով գրանցել և ֆինանսավորել հաշիվ, ինչպես նաև Taira-ում ներկայացնել մատյանի սովորական ստորագրված հրամաններ։ Դրանք պահեք սովորական միավորային թեստերից առանձին, քանի որ դրանք պահանջում են փորձնական միջոցների տրամադրման ծառայությամբ ֆինանսավորված հաշիվ և կենդանի փորձնական ցանցի հասանելիություն։

## Օգտագործելով Rust հաճախորդի վարկանիշը {#using-the-rust-client-crate}

Պին Iroha Git- ի վերանայման, որը օգտագործվում է ձեր ցանցում.

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Եթե դուք ցանկանում եք առավել ամբողջական օրինակներ այն մասին, թե ինչպես են Rust մակերեսները գործնականում օգտագործվում, ստուգեք.

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Մատյանի կողմից կառավարվող էսկրոուի աշխատանքային հոսքերի համար տես [Ակտիվների բնիկ էսկրոու](/hy/blockchain/escrow.md#rust-sdk)։ Rust-ի տվյալների մոդելը ներկայումս ունի ամենաամբողջական տիպավորված ծածկույթը շուկայական էսկրոուի, ակտիվների ընդհանուր արգելափակումների, պայմանական էսկրոուի, հարցումների և իրադարձությունների համար։

Դուք կարող եք վերականգնել տեղական CLI օգնության snapshot հետ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Նշումներ {#notes}

- CLI ներկայումս ավելի լավ ծավալ է տալիս, քան ինքնուրույն տուփային փաստաթղթերը:
- Օպերատորային ոճի հոսքերի համար CLI փաստաթղթերն են ամենավերջին աղբյուրը:
