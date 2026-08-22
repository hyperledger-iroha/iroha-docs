---
translation_locale: ka
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# მუშაობა Iroha ორობითი {#working-with-iroha-binaries}

The Iroha 3 ოპერატორის სამუშაო ნაკადი ტრიალებს სამი ძირითადი ბინარის გარშემო:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) თანატოლების დემონის გასაშვებად
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) ამისთვის CLI და ოპერატორის ბრძანებები
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) გასაღებებისთვის, გენეზის, ლოკალური ქსელებისთვის და პროფილებისთვის

## აშენება წყაროდან {#build-from-source}

ზედა დინების სამუშაო სივრცის ფესვიდან:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

გამოშვების ორობითი ფაილები შემდეგ ხელმისაწვდომია `target/release/`.

ბრძანების ზედაპირის შესამოწმებლად:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## გაუშვით პირდაპირ საცავიდან {#run-directly-from-the-repository}

თუ არ გსურთ გლობალურად არაფრის დაყენება, გამოიყენეთ `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker გამოსახულება {#docker-image}

ზედა დინების სამუშაო სივრცე იყენებს `kagami localnet` და `kagami docker` გენერირება
Docker Compose ფაილები, რომლებიც ემთხვევა შემოწმებულ კოდს.The `hyperledger/iroha:dev`
სურათი შეიძლება გამოყენებულ იქნას იმ გენერირებულ ფაილებთან.

გაუშვით CLI კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

გაიქეცი Kagami კონტეინერში:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

თანატოლების გაშვებისთვის, ჯერ შექმენით ლოკალური ქსელი და შეადგინეთ ფაილი:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## რომელი ორობითი გამოვიყენო? {#which-binary-should-i-use}

- გამოყენება `irohad` როდესაც თქვენ იწყებთ ან მუშაობთ თანატოლებთან.
- გამოყენება `iroha` როდესაც გჭირდებათ წიგნის კითხვა, ტრანზაქციების წარდგენა ან ოპერატორის საბოლოო წერტილების შემოწმება.
- გამოყენება `kagami` როცა გჭირდებათ გასაღებები, გენეზის მანიფესტები, პროფილის პაკეტები ან ლოკალური ქსელის აქტივები.

## Kagemusha Release Publication და Rollout {#kagemusha-release-publication-and-rollout}

კაგემუშა V4 გამოქვეყნება და გააქტიურება კვეთს ცალკეულ დაცულ საზღვრებს:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` არის
  მხოლოდ macOS-ზე, მხოლოდ root-გამომცემელი.ის ამოწმებს დამაგრებულს Kagami ორობითი და
  ზუსტად თექვსმეტი ფაილის კანდიდატი აქვეყნებს არარსებულს
  `promotion-record-v4.norito` ჩანაცვლების გარეშე და მხოლოდ წარმატებას აცნობებს
  ზუსტად ჩვიდმეტი ფაილის დაწინაურებული გამოშვების გადამოწმების შემდეგ.
- `iroha offline kagemusha rollout-v4 create-expectations` ამოწმებს ხელმოწერილს
  დაჯავშნა, ოთხი შეკვეთილი ვალიდატორის საკვალიფიკაციო ბეჭდები, ზუსტი
  უკვე ავტორიზებული ტრანზაქციის მავთული და სანდო დასრულებული წამყვანი მანამდე
  ხელმოწერილი მოლოდინების გამოქვეყნება ჩანაცვლების გარეშე.
- `iroha offline kagemusha rollout-v4 submit` მოითხოვს მკაფიო
  `--write-authorized` თანხმობა.ის მუდმივად იწერს და ხელახლა ამოწმებს ზუსტს
  მოლოდინი ქსელის დაწერამდე ან ხელახლა ცდამდე.ან `Applied` სტატუსი არ არის
  საკმარისია: ბრძანება ასევე ამოწმებს ჩადენილ ბლოკს, საბოლოო მემკვიდრეს
  ჯაჭვი და სრული ავტორიზაციის მატარებელი გარიგების მავთული.
- `iroha offline kagemusha rollout-v4 finalize-receipt` აგროვებს იმავე
  მტკიცებულებით მიბმულ მასალას მხოლოდ მას შემდეგ, რაც ზუსტი წარდგენის ჟურნალი
  ხელახლა დადასტურდება, ხელს აწერს მას დამოუკიდებელი ქვითრის გამომცემლით და
  აქვეყნებს კანონიკურ ქვითარს ჩანაცვლების გარეშე.

რეგისტრირებული კაგემუშას საწარმოო მზადყოფნის სამუშაო პროცესი მხოლოდ დადასტურებაა.
ის არ უწოდებს ავტორიზებულ გამომცემელს, აქვეყნებს ვალიდატორის კვალიფიკაციას
დალუქავს, წარადგინეთ აქტივაცია ან შექმენით საბოლოო ქვითარი.წარმატებული სამუშაო პროცესი
შესაბამისად, გაშვება არ ადასტურებს არც დაწინაურებას და არც პირდაპირ გაშვებას.

ეს ბრძანებები ადგილობრივი პრიმიტივებია და არა ცოცხალი მტკიცებულებების შემცვლელი.ა
წარმოების გაშვება რჩება დაბლოკილი რეალური ფიზიკური აპლიკაციის ატესტისა და
კანდიდატის არტეფაქტები, ოთხივე დაცული მასპინძელი ბეჭდები, მუშაობის დროის მართვა და
ხელმოწერის შენატანები, ცოცხალი ოთხი ვალიდიატორის წარდგენა და საბოლოო მტკიცებულება და
კანონიკური ეფექტური კონფიგურაციის პროექცია.შეინახეთ პირადი გასაღებები,
ავთენტიფიკაციის მასალა და პრომო-სპეციფიკური იდენტიფიკატორები დაცულია
Runtime პატიმრობა;არ დააკოპიროთ ისინი წყაროს მიერ კონტროლირებად დოკუმენტაციაში ან
ოპერატორის ბილეთები.
