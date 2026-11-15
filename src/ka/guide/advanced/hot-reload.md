---
translation_locale: ka
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ცხელი გადატვირთვა Iroha Docker კონტეინერში. {#hot-reload-iroha-in-a-docker-container}

ცხელი გადატვირთვა გამოიყენეთ მხოლოდ ლოკალური გამართვისთვის. Docker-ში ერთი და იმავე რევიზიის ბინარული ფაილებით ოთხი ვალიდატორის ასაწყობად და გასაშვებად მიჰყევით სახელმძღვანელოს [გაშვება Iroha 3](/ka/get-started/launch-iroha.md).

## შეცვალეთ ქსელის კვანძი ორობითი ფაილი {#replace-the-peer-binary}

შექმენით Linux- ით თავსებადი daemon ორობითი ფაილი ძირითადი სამუშაო სივრცედან:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

გადაწერეთ იგი მიმდინარე ქსელის თანაბარი კონტეინერში, შემდეგ განახორციელეთ კონტეინერი:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

კონტეინერის საპოვნელად გამოიყენეთ `docker ps`. დემონის შეცვლამდე შეამოწმეთ მისი ბილიკი იმიჯში.

## რეკომენდირებული ბლოკჩეინის გენეზისი ერთჯერადი ქსელში {#recommit-genesis-in-a-disposable-network}

ახალი გენეზისის ბლოკისთვის კვანძის საცავი ცარიელი უნდა იყოს. იმავე ქსელის ხელახლა გასაშვებად გამოიყენეთ `python3 poc.py down` და შემდეგ `python3 poc.py up`. შეინახეთ `state/` მის ოთხ Docker ტომთან ერთად.

## გამოიყენეთ პერსონალური კონფიგურაცია {#use-custom-configuration}

ქსელის კვანძის მიმდინარე კონფიგურაცია TOML ფორმატშია. Kagami თითოეული ვალიდატორისთვის წერს ერთ `peerN.toml`-ს `genesis.signed.nrt`-თან, `genesis.public_key`-სა და `genesis.expected_hash`-თან ერთად; `kagami docker`-ის მიერ შექმნილი Compose ფაილი მათ კონტეინერში ამონტაჟებს. ფაილების ხელით კოპირების ნაცვლად ხელახლა დააგენერირეთ იგი, შემდეგ კი კვანძი ხელახლა გაუშვით. გენერირებული ფაილები ერთად შეინახეთ; Kagami-ს სხვადასხვა გაშვებებიდან ფაილების შერევამ შეიძლება დესერიალიზაციის ან კონსენსუსის შეცდომები გამოიწვიოს.
