---
translation_locale: kk
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Үйлестіру матрицасы {#compatibility-matrix}

Қосылмалылық матрицасы SDK ағымдағы сценарийлерді қамту Iroha 3 Документтер жиынтығы. Әдеттегідей, беттің түймеленген кескінді жүктеуі [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) Тексеру.

Матрица мыналардан тұрады:

- Бірінші бағандағы әңгімелер
- SDKs қалған бағандар бойынша
- Қапшықталған, сәтсіздікке ұшыраған және жоғалған деректер үшін мәртебе символдары

Тек жаңарту жұмыс тетігімен тексерілген нәтижелер қамтылған немесе сәтсіздікке ұшыраған деп есептеледі. Қосылған қайталанудың дәлелі жоқ сценарийлер басқа көзді қайталаудан алынған нәтижелерді мұра етудің орнына, жоғалған деректер ретінде көрсетіледі.

<CompatibilityMatrixTable />

::: ақпарат
`VITE_COMPAT_MATRIX_URL` дегенді үйлесімді тіршілік тетігімен жиынтықталған кескінді өшіру үшін ғана орнату. Бұл ауытқушы болмаса, бетте `src/public/compat-matrix.json` жүктеледі
:::
