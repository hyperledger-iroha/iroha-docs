---
translation_locale: kk
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Сәйкестік матрицасы {#compatibility-matrix}

Сәйкестік матрицасы өзара SDK ағымдағы сценарийді қамту Iroha 3 құжаттар орнатылды. Әдепкі бойынша, бет бекітілген деректерден жасалған жинақталған нүкте уақыты көрінісін жүктейді [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) қайта қарау.

Матрица мыналардан тұрады:

- Бірінші бағандағылар әңгімелер
- SDKs қалған бағандардың барлығында
- Жабылған, сәтсіз және жоқ деректерге арналған статус символдары

Тек жаңарту жұмыс үрдісімен расталған нәтижелер қамтылған немесе сәтсіз деп хабарланады. Бекітілген нұсқаның дәлелі жоқ сценарийлер деректер жоқ ретінде көрсетіледі, басқа көз нұсқасынан нәтиже мұрагерленбейді.

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` тек үйлесімді тікелей серверді қолдана отырып қамтылған уақыт нүктесі деректер көрінісін қайта жазу үшін орнатыңыз. Сол айнымалы болмаған жағдайда, бет `src/public/compat-matrix.json` жүктеледі.
:::
