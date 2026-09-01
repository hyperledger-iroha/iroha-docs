---
translation_locale: ja
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# イベントトリガーの例 {#event-trigger-example}

この例では、Iroha 3 データモデルにおいて、正規化されたドメインなしアカウントIDと予測資産定義を使用します。

ネットワークに以下があると仮定します:

- Alice の鍵によって制御される正典的なアカウント
- Mad Hatter の鍵で管理された正規のアカウント
- `wonderland.universal`の下で`tea`として予測された資産定義
- 各アカウントが保有するその資産の残高

目標は、Alice のティーバランスを監視し、一致するデータイベントが発生したときに Mad Hatter アカウントからの送金を提出するトリガーを登録することです。

## 1. 口座と資産を準備する {#_1-prepare-accounts-and-assets}

まず、参加するアカウントと資産の定義を登録します。現在の Iroha では、アカウントIDはアカウントコントローラーから取得される一方、予測されるドメインは `domain.dataspace` フォームを使用します:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

資産の定義には依然として標準的な不透明アドレスがあります。そのアドレスを登録後に保存または照会し、トリガーアクションで使用してください。

## 2. トリガー認証プリンシパルを選択する {#_2-choose-the-trigger-authority}

可能な場合は、トリガーの技術アカウントを専用のアカウントに設定してください。専用アカウントは、トリガーの実行に必要な権限を明確にし、トリガーをオペレーターの個人署名キーに結びつけることを避けます。

技術用アカウントはすでに存在している必要があり、トリガー実行可能ファイルで指示を送信する権限を持っていなければなりません。

## 3. 実行可能ファイルを定義する {#_3-define-the-executable}

実行可能ファイルは、イベントフィルターが一致したときにトリガーが送信する命令のシーケンスです。この例では、1つの転送が含まれています：

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

最終トランザクションペイロードには SDK の現在の型付きビルダーを使用してください。トリガーコード内で古いテキストIDをハードコーディングせず、実行可能ファイルを構築する前に正規のIDを解析またはクエリしてください。

## 4. イベントフィルターを定義する {#_4-define-the-event-filter}

関心のあるオブジェクトにイベントを絞り込むデータイベントフィルターを使用します:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

フィルターは実用的な範囲でできるだけ具体的にしてください。`AcceptAll` フィルターはデバッグに便利ですが、すべての一致するイベントがトリガー評価のコストを負担することになります。

## 5. トリガーを登録する {#_5-register-the-trigger}

トリガーを次に登録してください:

- 安定した`TriggerId`
- 実行可能な命令列
- `Repeats::Indefinitely` または `Repeats::Exactly(n)`
- 技術アカウント
- イベントフィルター
- オプションのメタデータ

トリガーの登録自体は通常のトランザクションなので、登録するアカウントはトリガーを登録する権限が必要です。技術的なアカウントは、トリガー実行可能ファイルに必要な権限が必要です。

## 実行順序 {#execution-order}

ブロックが実行されるとき:

1. 通常の取引指示が最初に実行されます。
2. それらの指示によって生成されたデータイベントは収集されます。
3. そのイベントにフィルターが一致するトリガーはスケジュールされます。
4. トリガーによって生成される効果は、無制限の再帰的トリガー実行を許可することなく、ブロック実行ソフトウェアの処理ワークフローで扱われます。

もしトリガーが`Repeats::Exactly(n)`を使用している場合、カウントが使い果たされたときに新しいトリガーを登録し、同じ挙動が再度必要な場合に備えます。
