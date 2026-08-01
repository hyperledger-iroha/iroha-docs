---
translation_locale: pt
translation_source: /reference/norito.md
translation_source_hash: 4297b0ff795a5cdb6556424e89de7191522271519aa36720ed45a695ad402211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Norito {#norito}

Norito é Iroha É o formato de byte usado quando peers, SDKs, CLI Ferramentas, Torii, Kura, E os artefatos gerados precisam concordar na mesma carga útil.

Utilização Norito Quando os dados fazem parte de um consenso, assinatura, hashing, persistência ou SDK Interoperabilidade. Uso JSON Quando um endpoint oferece explícitamente uma projeção legível por humanos para operadores, painéis de controlo ou depuração rápida.

## Onde aparece o Norito {#where-norito-appears}

|Superfície .|Como é utilizado o Norito |
| --- | --- |
|Transações e consultas |As cargas úteis de transações e consultas assinadas enviadas através do Torii são codificadas como Norito. |
|Gênesis |`kagami genesis sign` produz um bloco assinado `.nrt` que é comparável à carga no início. |
|Torii respostas digitadas |Os pontos finais que suportam respostas binárias digitalizadas usam `Accept: application/x-norito`. |
|SDKs | Rust, Python, JavaScript, Kotlin- Java. Swift, e Android Clientes utilizam Norito Construtores ou ligações em vez de bytes montados à mão. |
|Armazenamento Kura |As cargas úteis de bloco, os sidecars de recuperação, as listas e os marcadores de compromissos são armazenados como dados em formato Norito. |
|Manifestações |Nexus, disponibilidade de dados, SoraFS, streaming e manifestos voltados para aplicativos usar Norito quando o manifesto deve ser assinado ou hashed. |
|Transmissão .|Norito O streaming utiliza manifestos Norito, cabeçalhos de segmentos, quadros de controlo e aparelhos de conformidade. |

Norito não é uma linguagem de contrato inteligente. É o envelope determinista e codec que transporta transações, chamadas de contrato, manifestações e cargas úteis API digitalizadas.

## Modelo de carga útil {#payload-model}

Cada carga útil on-wire ou on-disk Norito é enquadrada por um cabeçalho seguido pelos bytes de carga útil codificados. Cargas úteis sem cabeçalhos, ou nuas, são reservadas para hashing interno, referências e auxiliar APIs que envolvem imediatamente o resultado em uma cabeçalha antes do transporte.

|Campo de cabeçalho |Tamanho .|Propósito |
| --- | ---: | --- |
|Magia .|4 bytes |ASCII `NRT0`, utilizado para rejeitar precocemente os dados não relacionados com o Norito. |
|Major .|1 byte |Formatar a versão principal. As cargas úteis atuais usam `0`. |
|Menor .|1 byte |Indicação de decodificação para v1. O valor atual é `0x00`.|
|Schema hash |16 bytes |Identidade de tipo utilizada por decodificadores digitais para rejeitar cargas úteis inesperadas. |
|Compressão |1 byte |`0 = None`, `1 = Zstd`. Valores desconhecidos são rejeitados. |
|Comprimento da carga útil |8 bytes |Comprimento de carga útil não comprimido como pequeno endio `u64`. |
|CRC64 |8 bytes |CRC64-XZ soma de controlo da carga útil não comprimida. |
|Banderas .|1 byte |Bandeiras de layout para comprimentos compactos, sequências embaladas e traços embalados. |

O cabeçalho é de 40 bytes. Os decodificadores validam a magia, versão, máscara de bandeira suportada, comprimento da carga útil, soma de verificação e hash do esquema antes de reconstruir o valor digitado.

## Bandeiras de Layout {#layout-flags}

Norito armazena as opções de layout no byte final do cabeçalho. Os auxiliares padrão v1 emitem `COMPACT_LEN` (`0x02`) para prefixos de comprimento por valor compactos. Prefixos explícitos de comprimento fixo permanecem legíveis quando os chamadores codificam com `flags = 0x00`.

|Bandeira|Hex |Estatuto |Efeito |
| --- | ---: | --- | --- |
|`PACKED_SEQ` |`0x01` |Apoio |Encode coleções de tamanho variável com uma tabela offset mais um bloco de dados contíguo. |
|`COMPACT_LEN` |`0x02` |Default .|Utiliza variantes canônicas não assinadas para prefixos de comprimento por valor. |
|`PACKED_STRUCT` |`0x04` |Apoio |Codifica estruturas geradas por derivados como cargas úteis de campo embaladas. |
|`VARINT_OFFSETS` |`0x08` |Reservado .|Rejeitado no v1; as compensações de sequência embalada são de largura fixa `u64`. |
|`COMPACT_SEQ_LEN` |`0x10` |Reservado .|Rejeitado no v1; os cabeçalhos de comprimento de sequência de nível superior são de largura fixa `u64`. |
|`FIELD_BITSET` |`0x20` |Suporte com requisitos |Adiciona um conjunto de bits para estruturas embaladas para que apenas os campos que precisam de tamanhos explícitos tenham prefixos de tamanho. Requer `PACKED_STRUCT` e `COMPACT_LEN`. |

As bandeiras são explícitas. Os decodificadores não deduzem o layout a partir da forma da carga útil, versão menor ou heurísticas. As combinações desconhecidas ou inválidas são rejeitadas para que todos os pares interpretem uma carga útil da mesma maneira.

## Regras de codificação {#encoding-rules}

O Norito utiliza layouts deterministas para as formas de dados comuns que aparecem no modelo de dados Iroha:

- As cordas são `[len][utf8-bytes]`; `len` segue a `COMPACT_LEN` quando ativada.
- Quando o `COMPACT_LEN` for definido, um comprimento por valor utiliza uma varinga compacta.
- Quando `COMPACT_LEN` estiver ausente, um comprimento por valor é um pequeno endia `u64` de 8 bytes.
- Os cabeçalhos de comprimento da sequência são fixos em `u64` de 8 bytes de pequeno endio no v1.
- O `Vec<u8>` é codificado como `[len_u64][raw-bytes]` em vez de um comprimento por byte.
- As sequências embaladas utilizam deslocamentos `(len + 1)` monotónicos `u64` seguidos pelas cargas úteis de elementos concatenados.
- Os mapas codificam as contagens de entrada com fixa `u64` e usam a ordem da chave determinista. As entradas `HashMap` são ordenadas por chave antes da codificação; `BTreeMap` usa sua ordem natural.
- O `BigInt` utiliza bytes complementares de dois bits com um comprimento de byte de `u32` e um limite de 512 bits.
- O `Numeric` é codificado como `(mantissa, scale)`, onde a mantissa armazena o valor de um número inteiro e a escala armazena os números fraccionais.

Estas regras são importantes para assinaturas e hashes. Dois SDKs que constroem a mesma transação lógica devem produzir os mesmos bytes canônicos.

## Hashes de esquema {#schema-hashes}

As cargas úteis de tipo Norito contêm um hash de esquema de 16 bytes no cabeçalho. O hash padrão é derivado do nome de tipo totalmente qualificado. Os builds que permitem o hashing de esquema estrutural derivam o hash do esquema canônico em vez disso.

Os decodificadores de tipo rejeitam as incompatibilidades do esquema. Isso protege os clientes de descodificar acidentalmente um quadro válido Norito como o tipo errado e é o modo de falha habitual quando um pacote de dispositivos SDK deriva do modelo de dados do nó.

## A compressão e a aceleração {#compression-and-acceleration}

O Norito suporta compressão explícita e adaptativa sem alterar a carga útil lógica:

|Características |Propósito |
| --- | --- |
|`to_bytes` |Encode um cabeçalho seguido de uma carga útil não comprimida. |
|`to_compressed_bytes` |Encode com Zstd e grave a etiqueta de compressão no cabeçalho. |
|`to_bytes_auto` |Aplique a heurística determinista para decidir se a compressão vale a pena. |
|Aceleração CRC64 |Utiliza CRC64-XZ portátil em todos os lugares, com CLMUL no x86_64 ou PMULL no aarch64, quando disponível |
|GPU CRC64 e compressão|Metal opcional ou auxiliares CUDA podem acelerar grandes cargas úteis, em seguida, cair de volta para os caminhos CPU. |

A aceleração do hardware nunca muda o conteúdo decodificado. CRC e JSON Os aceleradores devem corresponder a bits por bits portáteis de saída. os bytes do quadro Zstd podem diferir entre CPU e GPU codificadores, mas a carga útil decodificada e Norito Os metadados do cabeçalho continuam a ser determinantes para a validação

## JSON Apoio {#json-support}

O Norito inclui uma pilha nativa JSON para pontos finais e ferramentas que necessitam de JSON sem sair do sistema de tipo Norito.

|Função JSON |Caso de utilização |
| --- | --- |
|`norito::json::{to_json, from_json}` |Deterministic typed JSON code/decode. |
|Pretty e escritores ajudantes |Output CLI, fixações e integração de streaming `std::io`. |
|Valores DOM |Manipulação programática através do modelo de valor JSON do Norito. |
|Tipo rápido JSON |Decodificação/codificação baseada em fita estrutural para caminhos DTO quentes. |
|Leitor de cópia zero |Escanagem de tokens que empresta cordas da entrada quando possível. |
|Aceleradores de fase 1 |Indicadores estruturais opcionais AVX2, NEON, Metal ou CUDA com retrocesso escalar. |

Iroha código deve preferir `norito::json` Auxiliares de tipografia API Cargas úteis. Adição de simples `serde_json` para os caminhos de produção riscos que divergem do esquema e comportamento de manuseio em campo esperados por SDKs e Torii Extractores.

## Apoio derivado {#derive-support}

Os tipos de dados Rust geralmente usam macros derivados em vez de código manual de codec. A camada derivada pode gerar codecs binários Norito, esquemas e auxiliares JSON.

Os atributos de campo comuns são:

|Atributo .|Efeito |
| --- | --- |
|`#[norito(rename = "other")]` |Utiliza um nome serializado estável para a compatibilidade do esquema e JSON. |
|`#[norito(skip)]` |O codificador omite o campo. O decodificador fornece o valor `Default`. |
|`#[norito(default)]` |Utiliza `Default` quando uma carga útil decodificada não carregar o campo. |
|`#[norito(skip_serializing_if = "...")]` |Omite campos de JSON quando o predicado coincide, preservando os padrões de decodificação determinista. |

Os derivados também expõem sugestões de comprimento codificado e cálculos de comprimento exato quando possível. Os codificadores usam essas dicas para reservar tampões e evitar cópias extras.

## Famílias com caixa {#crate-feature-families}

Quando se construem ligações Iroha ou SDK a partir da fonte, os recursos Norito selecionam quais auxiliares e aceleradores estão disponíveis:

|Família de características |O que isso permite .|
| --- | --- |
|`derive` |Macros processuais reexportados para derivados binários, esquemas e JSON. |
|`compression` |Zstd suporte para cargas úteis de cabeçalho. |
|`packed-seq` |Planejamento de coleção embalado usando tabelas offset. |
|`packed-struct` |Planejamento estrutural embalado gerado por derivados.|
|`compact-len` |Prefixos Varint por valor de comprimento. |
|`columnar` |Blocos de coluna Norito, codecs adaptativos de linha AoS/NCB e visualizações emprestadas para caminhos pesados em digitalização; incluídos no conjunto de características padrão `node-codec`. |
|`strict-safe` |Converte os pânicos de decodificação em caminhos falíveis em erros estruturados. |
|`simd-accel` |CPU aceleração, quando disponível, com retrocesso determinístico. |
|`json` |Parser nativo JSON, escritor, DOM, derivações digitalizadas e caminhos rápidos. |
|`json-std-io` |Auxiliadores de leitores e escritores em camadas na pilha JSON. |
|`metal-stage1`, `cuda-stage1` |Opcionais backends GPU JSON de índice estrutural. |
|`metal-stage2` |Classificação de metadados metálicos opcional para a fita estrutural JSON. |
|`metal-crc64`, `cuda-crc64` |Auxiliares opcionais GPU CRC64 para grandes cargas úteis. |
|`gpu-compression` |Aceleração opcional Metal ou CUDA Zstd para grandes cargas úteis. |
|`stage1-validate` |Validação de defeitos que compara índices estruturais acelerados JSON com a saída escalar. |

A disponibilidade de recursos pode diferir entre SDKs e perfis de lançamento. O formato do arame permanece regido pelo cabeçalho e esquema, não por bandeiras locais de construção.

## Torii e Norito RPC {#torii-and-norito-rpc}

Torii expõe JSON para muitas rotas de operador, mas as rotas binárias tipografadas usam Norito. O tipo de mídia para os corpos de corrente tipografada Norito HTTP é `application/x-norito`.

Utilize estes cabeçalhos quando um ponto final aceita ou retorna o Norito:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Quando um endpoint suporta ambas as representações, os clientes podem enviar uma lista explícita de preferências:

```http
Accept: application/x-norito, application/json
```

As falhas de decodificação aparecem como erros de digitação Torii e contadas por telemetria. Razões comuns incluem magia inválida, versão não suportada, bandeira de recursos não suportados, desmatch da soma de verificação, malformado UTF-8, tag enum inválido e desmatch do esquema.

Norito RPC O transporte é selecionado através da configuração do transporte. deve acompanhar a latência de solicitação, falhas, conexões ativas, bytes de resposta e `torii_norito_decode_failures_total` separadamente de JSON O trânsito.

## Norito Transmissão {#norito-streaming}

Norito O streaming estende a mesma abordagem determinista para mídia e superfícies de transporte em tempo real. As suas principais peças são:

|Função de streaming |Propósito |
| --- | --- |
|Manifestações |Declarar compromissos do segmento, rotas de privacidade, capacidades, perfil de codec, suite de criptografia e metadados chave do conteúdo. |
|Cabeças de segmentos |Bind número de segmento, duração, contagem de pedaços, tempo, modo entropia, resumo de áudio e raízes Merkle. |
|Compromissos em pedaços |Deixe os telespectadores e relés verificarem as peças de carga útil contra o manifesto antes de servir ou decifrar. |
|Quadros de controlo |Portar anúncios manifestos, feedback, atualizações-chave e negociação de capacidades. |
|HPKE atualizações principais |Rotear segredos de transporte usando a suíte negociada e contadores aumentando monotonicamente. |
|Negociação sobre a capacidade |Intercepta bits de recursos suportados, limites de datagramas, cadência de feedback e requisitos de privacidade. |
|FEC e o feedback |Utiliza relatórios deterministas de receptores e decisões de paridade para caminhos em tempo real de perdas. |
|Vectores de conformidade |Fixtures de linguagem cruzada provam SDKs decodificar os mesmos manifestos, segmentos e fluxos de entropia. |

Os codecs e perfis de entropia específicos do streaming são separados do formato central Norito de transação/questão, mas os seus manifestos e dados de controlo ainda usam Norito para que o encaminhamento, a faturamento, a reprodução e as evidências de auditoria permaneçam reprodutíveis.

## Orientações operacionais {#operational-guidance}

- Preferir os construtores SDK e as ligações geradas em vez dos bytes Norito manuais.
- Tratar o desajuste de esquema como um problema de versão ou fixação, não como uma falha transitória da rede.
- Arquivo `.nrt`, `.norito`, e artefatos manifestos no pacote de liberação ou incidente que os produziu.
- Use Norito como fonte de verdade para dados assinados, hashed ou persistidos. Use projeções JSON para painéis e inspeção manual.
- Ao adicionar um novo ponto final Torii, documentar se ele aceita JSON, Norito ou ambos, e expor os tipos de conteúdo suportados no `/openapi`.
- Antes de ativar um acelerador, execute testes de paridade em relação à saída escalar. Se um acelerator falhar, use a queda escalística determinista. A semântica da carga útil deve permanecer inalterada.

## Páginas relacionadas {#related-pages}

- [Pontos finais Torii](/pt/reference/torii-endpoints.md)
- [Referência de Gênesis](/pt/reference/genesis.md)
- [Esquema de modelo de dados](/pt/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK ](/pt/guide/tutorials/javascript.md)
- [Python SDK](/pt/guide/tutorials/python.md)
- [Swift e iOS SDK](/pt/guide/tutorials/swift.md)

## Referências a montante {#upstream-references}

- [Especificação do formato Norito](https://github.com/hyperledger-iroha/iroha/blob/main/norito.md)
- [Caixa Norito README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/norito/README.md)
