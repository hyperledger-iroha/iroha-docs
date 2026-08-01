---
translation_locale: ja
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# イベントトリガー例 {#event-trigger-example}

この例では, Iroha 3 データモデルにおける標準的なドメインレスアカウント IDs と予測された資産定義を使用します.

ネットワークは:

- アリスの鍵によって制御される法典的なアカウント
- 狂った帽子屋の鍵によって制御される法典的なアカウント
- `wonderland.universal` の下にある`tea`と予測される資産定義
- 各口座に保有されているその資産の余分

マッド・ハッターアカウントから転送を送信する トイガーを 登録することです

## 1. 口座と資産を準備する {#_1-prepare-accounts-and-assets}

まず参加口座と資産定義を登録する.現在の Iroha では,アカウント IDs はアカウントコントローラから来るが,予測ドメインは `domain.dataspace` 形式を使用している.

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

アセットの定義にはまだカノニカルな不透明なアドレスがあります.登録後にそのアドレスを保存またはクエリし,トリガーアクションで使用します.

## 2. 引き起こす権限を選択する {#_2-choose-the-trigger-authority}

Triggerの技術的なアカウントを可能な限り専用アカウントに設定します.専用のアカウントは,トリガーを実行するために必要な権限を明確にし,トリガーをオペレーターの個人サインキーに接続することを避ける.

テクニカルアカウントは既に存在し,実行可能なトリガーで指示を提出する許可がある必要があります.

## 3. 実行可能なものを定義する {#_3-define-the-executable}

実行可能は,イベントフィルターが一致するときにトリガーが送信する指示配列です.この例では,1 つの転送が含まれます:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

最終的なトランザクション用荷のために,現在の SDK のタイピングビルダーを使用します.トリガーコードで古いテキスト IDs をハードコーディングするのを避ける.実行可能なものを構築する前に解析またはクエリカノニカル IDs を使用してください.

## 4. イベントフィルタを定義する {#_4-define-the-event-filter}

データ イベント フィルタを使用して,イベントを関心のあるオブジェクトに絞ります:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

`AcceptAll` フィルターはデバッグに役立つが,すべての匹配イベントはトリガー評価のコストを支払うようにします.

## 5. スイッチを登録する {#_5-register-the-trigger}

スイッチを:

- ステイブル `TriggerId`
- 実行可能な指示配列
- `Repeats::Indefinitely` または `Repeats::Exactly(n)`
- テクニカルアカウント
- イベントフィルター
- 任意のメタデータ

トリガー登録自体は通常の取引であるため,登録アカウントはトリガーを登録する許可が必要です.技術的なアカウントにはトリガーの実行可能で要求される権限が必要です.

## 執行命令 {#execution-order}

ブロックが実行される時:

1. 通常の取引指示は最初に実行します.
2. これらの指示によって生成されたデータイベントは収集されます.
3. これらのイベントに フィルターが一致するトリガーが予定されている.
4. トリガーで発生する効果は,ブロック実行パイプラインで処理され,制限のないリクッシブ・トリガーの実行を許さない.

トイガーが `Repeats::Exactly(n)` を使っている場合は,カウントが終了し,同じ動作が再び必要であるときに新しいトイガーを登録する.
