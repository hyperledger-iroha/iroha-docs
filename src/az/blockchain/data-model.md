---
translation_locale: az
translation_source: /blockchain/data-model.md
translation_source_hash: 147562d2286bf11e60a941969e6d52bffc1534c3cfc04d440e0bcf78598a1ca7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Məlumat modeli {#data-model}

Iroha `World` kitabının dövlətini saxlayır. Onun ilk buraxılış məlumat modeli aşağıdakı kanonik kimlikləri və qurumları istifadə edir:

- domenlər məlumat məkanına uyğunlaşdırılır, məsələn `payments.universal`
- Hesablar kanonik və domensizdir; hesab ID hesab nəzarətçidən alınır.
- aktiv tərifləri bir domen / ad proyeksiyasını saxlaya bilər, lakin onların kanoniki mətni ünvanı qeyri-aşkar Base58 identifikatorudur.
- aktivlər müəyyən bir aktiv təyinatı üzrə hesablarda saxlanan balanslardır.
- NFTs domen təsdiqlənmiş IDs və metadata məzmunlu xüsusi mülkiyyətdə olan qeydlərdir.
- RWAs mövcud sahib, miqdar, mənşəlilik, metadata, saxlama, dondurma və həyat dövrü nəzarətləri ilə zəncirdən kənarda olan aktivləri təmsil edən ID lotlar yaranır.

```mermaid
classDiagram

class World
class Domain {
  id: DomainId
  logo: Option<SorafsUri>
  metadata: Metadata
  owned_by: AccountId
}
class Account {
  id: AccountId
  metadata: Metadata
  label: Option<AccountAlias>
  uaid: Option<UniversalAccountId>
  opaque_ids: Vec<OpaqueAccountId>
}
class AccountController {
  key
  multisig policy
}
class AssetDefinition {
  id: AssetDefinitionId
  spec
  mintable
  metadata
}
class Asset {
  id: AssetId
  value
}
class Nft {
  id: NftId
  content: Metadata
  owned_by: AccountId
}
class Rwa {
  id: RwaId
  owned_by: AccountId
  quantity
  spec
  primary_reference
  status
  metadata
  parents
  controls
  is_frozen
  held_quantity
}

World *-- Domain : registers
World *-- Account : registers
World *-- AssetDefinition : registers
World *-- Asset : stores balances
World *-- Nft : registers
World *-- Rwa : registers lots
Account --> AccountController : authorized by
Domain --> Account : owned_by
AssetDefinition --> Domain : optional projection
Asset --> AssetDefinition : definition
Asset --> Account : held by
Nft --> Domain : scoped by
Nft --> Account : owned_by
Rwa --> Account : owned_by
```

## Misal {#example}

Bir Iroha 3 şəbəkə, `wonderland.universal` daxilində bir domendir `universal` Bu nümunədəki kanonik hesablar öz açarları və ya siyasətləri ilə idarə olunur və domensiz kimi kodlanır I105 hesab IDs. Oxucu etiketlər: `alice@wonderland.universal` olan şəxslərə bağlı ayrı-ayrı adlar IDs. Proqnozlaşdırılmış aktiv təyinatı hələ də bir domen və addan qurula bilər, məsələn `rose` ədəd `wonderland.universal`, Qəzetdə istifadə olunan kanonik aktiv təyinatının ünvanı generated Base58 adresidir.

```mermaid
classDiagram

class domain_wonderland {
  id = "wonderland.universal"
}
class account_alice {
  id = "AccountId(controller=alice_key)"
  label = "alice"
}
class account_rabbit {
  id = "AccountId(controller=rabbit_key)"
  label = "rabbit"
}
class asset_rose {
  name projection = "rose"
  domain projection = "wonderland.universal"
}

domain_wonderland --> account_alice : owned_by
asset_rose --> domain_wonderland : projected under
account_alice --> asset_rose : holds balance
account_rabbit --> asset_rose : may receive balance
```

## Əlifbalar {#aliases}

API, CLI, cüzdan və kəşfçi sərhədlərində faydalıdırlar, lakin kanonik IDs ciddi kitab sahələrində saxlanan sabit identifikatorlardır.

|Hədəf |Kanonik hədəf |Alias əslən |Dəstəklənmə modeli |
| -------------- | --------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
|İstifadəçi hesabı |I105 ünvanı kimi kodlanmış domensiz `AccountId` |`name@domain.dataspace` və ya `name@dataspace` |`AccountAlias`; əsas alias `Account.label`, əlavə aliases bağlayıcıdır |
|Mülkiyyətin təyinatı|`AssetDefinitionId` Base58-ci ünvanı |`name#domain.dataspace` və ya `name#dataspace` |`AssetDefinitionAlias` bir aktiv tərifinə bağlıdır |
|Müqavilə |canonical Bech32m `ContractAddress` |`name::domain.dataspace` və ya `name::dataspace` |`ContractAlias` tətbiq olunan müqavilə ünvanına bağlanmışdır |
|Domen adı |`DomainId` `domain.dataspace` formasında |`domain.dataspace` |SNS `domain` ad məkanının qeyd edilməsi |
|Məlumat sahəsi adı |aktiv Nexus kataloqundan sayı `DataSpaceId` |`universal`, `paynet` və ya `zk` kimi məlumat məkanı aliləri |SNS `dataspace` ad məkanı qeydləri və aktiv məlumat məkanı kataloqları |

Hesab aliasları istifadəçiyə qarşı hesab adlarıdır. Onlar aktiv hesabı ID dünya dövləti indeksləri və hesab rekay qeydləri vasitəsilə göstərdiyi üçün hesab geri qaytarılmasına davam edirlər. Hesabın əsas etiketi üçün `SetPrimaryAccountAlias`, əlavə qeyri-başlı adlar üçün `SetAccountAliasBinding` və oxunmalar üçün `FindAccountByAlias` və ya `FindAliasesByAccountId` istifadə edin. Hesab aliasları normal olaraq `AcquireAccountAliasLease` ilə əldə edilmiş və `RenewAccountAliasLease` ilə yenilənmiş aktiv SNS hesab alias kirayəsi tələb edir.

Əmlak aliases, ayrı-ayrı hesab balansları deyil, ad aktivləri tərifləridir. Əsasnamə aliases `SetAssetDefinitionAlias` ilə təyin edilir; alias adı bölməsi aktivin tərif göstərici adına və ya proqnozlaşdırılmış tərif adına uyğun olmalıdır. Müqavilə aliases, `SetContractAlias` ilə təyin olunur; alias məlumat boşluğu müqavilə ünvanında kodlanmış məlumat boşluğuna uyğun olmalıdır. Hər iki bağlama `lease_expiry_ms` daşıya bilər; müddəti bitdikdən sonra zəiflik pəncərəsi keçdikdə həllini dayandırır və dünya dövlətləri indekslərindən silinir.

Domenlərin ayrı bir `DomainAlias` obyekti yoxdur. Bir domen tanıtıcısı artıq `payments.universal` kimi məlumat məkanına uyğun bir addır. SNS `domain` ad sahəsindəki domen adları üçün və `dataspace` ad sahəsində olan məlumat məkanı aliasları üçün icarə mülkiyyətini izləyir. Qeydiyyatlı `universal` məlumat məkanı aliyi müəyyənləşdirilməməlidir.

## Əlaqəli sənədlər {#related-docs}

|Mövzu |Haraya getmək lazımdır?|
| -------------------------------------- | ------------------------------------------- |
|Domenlər | [Domenlər](/az/blockchain/domains.md) |
|Hesablar | [Hesablar](/az/blockchain/accounts.md) |
|Əmlaklar | [Əmlaklar](/az/blockchain/assets.md) |
|NFTs | [NFTs](/az/blockchain/nfts.md) |
|Real dünya aktivləri | [Əsl dünya aktivləri](/az/blockchain/rwas.md) |
|Metadata | [Metadata](/az/blockchain/metadata.md) |
|qeydiyyat və köçürmə təlimatları | [Təlimatlar](/az/blockchain/instructions.md) |
|İndirmə vaxtı icazələri | [icazələr](/az/blockchain/permissions.md) |
|Adlandırma qaydaları | [Adlandırma qaydaları](/az/reference/naming.md) |
