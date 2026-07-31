---
translation_locale: kk
translation_source: /blockchain/metadata.md
translation_source_hash: 20e78492bf757147f2c9afed2d3b51639bc79913d3d8e4351193b6011f5469c2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Метамәліметтер {#metadata}

Метадеректер - кітапша объектілеріне қоса берілген тексерілген кілті-құндылық картасы. Кілттер `Name` мәндері, ал мәндер JSON (`Json`) пайдалы жүктемелер.

Келесі нысандар метамәліметтерді жеткізе алады:

- домендер
- есеп айырысу
- активтер
- активтер анықтамасы
- NFTs
- RWAs
- қозғалтқыштар
- операциялар

Кіші сипаттамалық немесе индекстеу өрістеріне арналған метамәдени деректерді пайдаланыңыз. WSV (Құранның) айтары мынау: URI, немесе SoraFS Жол.

Метамәліметтерді, активтерді таңдау жөніндегі нұсқаулар үшін NFTs, RWAs, немесе тізбектен тыс сақтау, қараңыз [Метамәліметтер мен бухгалтерлік есептерді сақтау](/kk/guide/configure/metadata-and-store-assets.md).

## Taira арқылы сынап көріңіз. {#try-it-on-taira}

Метамәліметтер әдеттегі ресурстарды оқу арқылы көрінеді. Бұл командада Taira активтердің анықтамалары бар:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Домендер мен тіркелгілер үшін бірдей үлгі қолданылсын:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'

curl -fsS 'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Бос шығысқа жарамды нәтиже ретінде қараңыз. Бұл Taira нысандарының ағымдағы беті метамәлімен қамтылмаған дегенді білдіреді, бірақ соңғы нүкте сәтсіздікке ұшыраған жоқ.

## Метамәдени деректерді жаңарту {#updating-metadata}

Метамәліметтер Iroha арнайы нұсқаулықпен ауыстырылады:

- [`SetKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) кілтті қосады немесе ауыстырады
- [`RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) кілтті алып тастайды

Транзакцияны ұсынған орган белсенді орындау уақытын растаушының талап еткен рұқсатына ие болуы керек. Әдетті рұқсат беті үшін [Permission Tokens ](/kk/reference/permissions.md) қараңыз.

## Оқиғалар {#events}

Деректер оқиғалары метамәдени деректердің өзгеруі кезінде жіберіледі. Жалпы оқиғаның пайдалы жүктемесі `MetadataChanged<Id>`:

```mermaid
classDiagram

class MetadataChanged~Id~ {
  target: Id
  key: Name
  value: Json
}

class AccountMetadataChanged
class AssetMetadataChanged
class AssetDefinitionMetadataChanged
class DomainMetadataChanged

MetadataChanged --> AccountMetadataChanged
MetadataChanged --> AssetMetadataChanged
MetadataChanged --> AssetDefinitionMetadataChanged
MetadataChanged --> DomainMetadataChanged
```

Пайдалану [деректер оқиғалары сүзгілері](/kk/blockchain/filters.md#data-event-filters) субъектінің түрі немесе объектісі үшін тек метамәдени оқиғаларға жазылу ID Бұл интеграция үшін маңызды.

## Сұрақтар {#queries}

Метамәліметтер сұралған объектінің бөлігі ретінде қайтарылады. Мысалы, [`FindAccountById`](/kk/reference/queries.md#accounts-and-permissions), [`FindDomainById`](/kk/reference/queries.md#domains-and-peers), немесе [`FindAssetDefinitionById`](/kk/reference/queries.md#assets-nfts-and-rwas). Пайдалану [`FindNfts`](/kk/reference/queries.md#assets-nfts-and-rwas) немесе [`FindNftsByAccountId`](/kk/reference/queries.md#assets-nfts-and-rwas) үшін NFTs, және [`FindRwas`](/kk/reference/queries.md#assets-nfts-and-rwas) үшін RWA Одан кейін объектінің метамәліметрі өрісін оқыңыз. NFT Сұрау салуға жауаптар NFT `content` картасы - жазудың метамәдени деректері.

Метамәліметтер кілтілері бухгалтерлік жазбаның бір бөлігі болып табылады, сондықтан оларды тұрақты ұстаңыз және JSON мәні сол нұсқаны айқын алып жүрсе, қолданбаға сәйкес нұсқаны кодтаудан аулақ болу керек.
