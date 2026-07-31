---
translation_locale: pt
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Segurança de senhas {#password-security}

No domínio da segurança blockchain, a proteção de senhas é primordial. Para garantir que os seus dados e tudo o que representam permaneçam impermeáveis ao acesso não autorizado, vamos aprofundar-nos nos matizes da segurança de senha.

## Força de senha {#password-strength}

É provável que você tenha encontrado anteriormente recomendações sobre como criar uma senha forte. Estas podem implicar conselhos como o comprimento mínimo da senha, adição de caracteres especiais, etc. Tais recomendações visam aumentar a força da sua senha que depende da entropia, ou seja, A aleatoriedade da senha.

Então, o que define uma senha forte? Uma senha forte é uma senha com alta entropia.

Para calcular a entropia de uma senha, podemos seguir a fórmula da Entropy:

::: tip Fórmula de entropia

$L$  Comprimento da senha; número de símbolos na senha.\ $S$  Conjunto de caracteres; tamanho do conjunto de símbolos possíveis únicos.\ $S^L$  Número de combinações possíveis.

$$Entropy=log_2(S^L)$$

O número resultante é a quantidade de bits de entropia em uma senha. Quanto maior o número, mais difícil é quebrar a senha.

Conhecendo o valor de entropia, a quantidade de tentativas necessárias para forçar uma senha com essa entropia pode ser derivada usando a seguinte fórmula:

$$S^L=2^Entropy$$

Não há resposta universal sobre quão alta deve ser a entropia de uma senha. Para as organizações financeiras, é aconselhável manter a entropie de suas senhas na faixa de `64` a `127` bits (`128` bits ou mais são geralmente considerados um excesso). No entanto, tenha em mente que <abbr title="Graphics Processing Unit">GPU</abbr>s continuam a evoluir constantemente e o tempo necessário para o craqueamento de senhas continua diminuindo ao longo do tempo.

:::

Seguindo a fórmula da entropia, vamos comparar os dois exemplos seguintes:

  1. Uma senha de 16 caracteres com o conjunto de caracteres utilizando apenas letras minúsculas do alfabeto inglês moderno (26 caracteres) produz aproximadamente 43 sextillion ($43*10^21$) combinações possíveis.

$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. Uma senha de 16 caracteres com o conjunto de caracteres expandido para 96, incluindo letras maiúsculas e símbolos especiais, aumenta o número de combinações possíveis para um impressionante 52 não-milhões ($52*10^30$), melhorando significativamente a entropia.

$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Como se pode ver, mesmo que apenas expandindo o conjunto de caracteres de 26 para 96 símbolos, o número de combinações possíveis que uma parte maliciosa precisaria de bruteforce aumentou em $1.1933*10^9$ vezes.

Além disso, o aumento do comprimento da senha aumentará ainda mais o número de combinações possíveis, melhorando assim a entropia e a força da senha.

No entanto, em vez de lutar com complexidades, aconselhamos o uso de um programa de gerenciador de senhas como [KeePassXC](https://keepassxc.org/) (para mais detalhes, veja [ Adição de um Programa de Gerenciador de Senhas ](./storing-cryptographic-keys.md#adding-a-password-manager-program) e [Configurar KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc))  para gerar e armazenar suas senhas de forma segura.

::: ponta

Certos sites limitam a entropia máxima possível de senhas, ou seja, limitam o comprimento máximo da senha ou o conjunto de caracteres aceitos, ou ambos.

Tenha isso em mente quando usar esses sites e tenha como objetivo atualizar suas senhas periodicamente.

:::

## Vulnerabilidades de senhas {#password-vulnerabilities}

As senhas podem ser vítimas de ataques de força bruta, geralmente executados usando poderosos GPUs em conjunto com dicionários ou iteração exaustiva através de todas as possibilidades. Para impedir essas tentativas, crie uma senha única sem informações pessoais, como aniversários, endereços, números de telefone ou números de segurança social.

Então, quão difícil é decifrar uma senha moderna? Depende mesmo de quem você pergunta.

Com um arranjo como [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)O que é isso ? [Configuração do cluster](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) Habitação 24 NVIDIA® GeForce RTX 4090's e 6 NVIDIA® GeForce RTX 2080s, todos eles correndo [Hachtopolis](https://github.com/hashtopolis) Software, ele usava para quebrar senhas que deveriam demorar um ano em apenas meia semana.

No entanto, vamos agora compará-lo a um único RTX 4090, capaz de processar até 300 <abbr title="Hashes per second">H/s</abbr> a utilização [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) e 200 <abbr title="Hashes per second">H/s</abbr> a utilização [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), tal como descrito em [Este tuíte](https://twitter.com/Chick3nman512/status/1580712040179826688).

Como uma extensão dos nossos cálculos anteriores de entropia, vamos agora examinar os seguintes tempos de craqueamento projetados:

  1. Há $31,540,000$ segundos em um ano normal sem pistas. Supondo-se que o pior cenário seja com `NTLM`, à velocidade de $300*10^9$ <abbr title="Hashes per second">H/s</abbr> levaria um único RTX 4090 aproximadamente $4,608.83$ anos para decifrar uma senha de 16 caracteres com um conjunto de caracteres de 26 letras do alfabeto inglês moderno.

  2. Se em vez de `NTLM` usarmos `bcrypt`, reduzindo assim a velocidade de iteração para $200*10^3$ <abbr title="Hashes per second">H/s</abbr>, ao mesmo tempo que expandimos o conjunto de caracteres para 96, incluindo letras maiúsculas e símbolos especiais, o tempo para quebrar sobe para cerca de $8,249,887,835,549,662,270.456$ anos, muito superior à idade do universo.

Assim, simplesmente escolher entropia mais alta aumentou o tempo necessário para quebrar uma senha em números incompreensíveis. Sim, o processo pode ser acelerado usando múltiplos GPUs, no entanto este método palidece em comparação com a abordagem [XKCD](https://xkcd.com/538/) .

É importante notar que um conjunto extenso de caracteres não é sempre necessário para alcançar alta entropia. Pode ser obtido usando senhas de várias palavras, ou frases longas em particular. O clássico [XKCD quadrinhos ](https://xkcd.com/936/) ilustra este conceito eloquentemente.

::: Aviso

Evite escrever sua senha em qualquer lugar. Guarde a frase de recuperação de senha com segurança. Se a frase for muito longa, você pode escrevê-la, garantindo que possa lê-la e digitá-la mais tarde. Guarde uma cópia física da frase em um local seguro e/ou recipiente.

:::
