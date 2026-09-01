---
translation_locale: pt
translation_source: /reference/norito.md
translation_source_hash: b3b7c03bc0df3f7fa3df7e44b0ec8d755d615f9edca66bbcfe5613c33c8afbfe
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Norito {#norito}

Norito é a camada de serialização canônica de Iroha. É o formato em bytes usado quando pares de rede, SDKs, ferramentas CLI, Torii, Kura e artefatos gerados precisam concordar exatamente com a mesma carga útil.

Use Norito quando os dados fizerem parte de consenso, assinatura, hashing, persistência ou interoperabilidade entre SDK. Use JSON quando um endpoint API oferecer explicitamente uma projeção legível por humanos para operadores, painéis ou depuração rápida.

## Onde Norito Aparece {#where-norito-appears}

|Superfície|Como Norito é usado|
| --- | --- |
|Transações e consultas|Transações assinadas e cargas de consulta enviadas através de Torii são codificadas como Norito.|
|gênese da blockchain| `kagami genesis sign` produz um bloco `.nrt` assinado que os pares da rede carregam na inicialização. |
|Torii respostas digitadas| API endpoints que suportam respostas binárias tipadas usam `Accept: application/x-norito`. |
| SDKs |Os clientes Rust, Python, JavaScript, Kotlin/Java, Swift e Android usam construtores ou bindings Norito em vez de bytes montados manualmente.|
|Armazenamento Kura|Cargas de blocos, anexos de recuperação, listas e marcadores de confirmação são armazenados em tramas Norito.|
|manifestos técnicos| Nexus, disponibilidade de dados, SoraFS, streaming e manifests técnicos voltados para o aplicativo usam Norito quando o manifest técnico deve ser assinado ou hasheado. |
| Transmissão | Norito Streaming utiliza manifestos Norito, cabeçalhos de segmento, quadros de controle e vetores de teste de conformidade. |

Norito não é uma linguagem de contrato inteligente. É o contêiner de dados determinístico e codec que carrega transações, chamadas de contrato, manifestos técnicos e cargas úteis tipadas API.

## Modelo de Carga {#payload-model}

Toda carga útil Norito transmitida pela rede ou armazenada em disco é estruturada por um cabeçalho seguido pelos bytes da carga útil codificada. Cargas úteis sem cabeçalho, ou nuas, são reservadas para hashing interno, benchmarks e APIs auxiliares que imediatamente envolvem o resultado em um cabeçalho antes do transporte.

|Campo de cabeçalho|Tamanho|Propósito|
| --- | ---: | --- |
|Magia| 4 bytes | ASCII `NRT0`, usado para rejeitar dados não-Norito cedo.|
|Importante|1 byte| Formatar versão principal. Os payloads atuais usam `0`. |
|Menor| 1 byte |Decodificar dica para v1. O valor atual é `0x00`. Flags descrevem o layout.|
|Hash do esquema|16 bytes|Identidade do tipo usada pelos decodificadores tipados para rejeitar cargas úteis inesperadas.|
|Compressão| 1 byte | `0 = None`, `1 = Zstd`. Valores desconhecidos são rejeitados. |
|Comprimento da carga| 8 bytes | Comprimento da carga útil não compactada em little-endian `u64`. |
| CRC64 | 8 bytes | CRC64-XZ soma de verificação do payload descomprimido. |
|Bandeiras| 1 byte |Bandeiras de layout para comprimentos compactos, sequências compactadas e estruturas compactadas.|

O cabeçalho tem 40 bytes. Os decodificadores validam o magic, a versão, a máscara de sinalizadores suportados, o comprimento do payload, o checksum e o hash criptográfico do esquema antes de reconstruir o valor tipado.

## Bandeiras de Layout {#layout-flags}

Norito armazena as escolhas de layout nas lojas no byte final do cabeçalho. Os helpers padrão da v1 emitem `COMPACT_LEN` (`0x02`) para prefixos de comprimento compactos por valor. Prefixos de comprimento de largura fixa explícitos permanecem legíveis quando os chamadores codificam com `flags = 0x00`.

|Bandeira|Hex|Status|Efeito|
| --- | ---: | --- | --- |
| `PACKED_SEQ` | `0x01` |Suportado|Codifica coleções de tamanho variável com uma tabela de deslocamento mais um bloco de dados contíguo.|
| `COMPACT_LEN` | `0x02` |Padrão|Usa varints não assinados canônicos para prefixos de comprimento por valor.|
| `PACKED_STRUCT` | `0x04` |Suportado|Codifica structs gerados pelo derive como cargas de campo empacotadas.|
| `VARINT_OFFSETS` | `0x08` |Reservado|Rejeitado na v1; os deslocamentos da sequência empacotada têm largura fixa `u64`.|
| `COMPACT_SEQ_LEN` | `0x10` |Reservado|Rejeitado na v1; os cabeçalhos de comprimento da sequência de nível superior são de largura fixa `u64`.|
| `FIELD_BITSET` | `0x20` |Apoiado com os requisitos|Adiciona um bitset para structs empacotadas, de modo que apenas os campos que precisam de tamanhos explícitos carreguem prefixos de tamanho. Requer `PACKED_STRUCT` e `COMPACT_LEN`.|

As bandeiras são explícitas. Os decodificadores não inferem o layout a partir da forma da carga útil, da versão secundária ou de heurísticas. Combinações desconhecidas ou inválidas são rejeitadas para que todos os pares de rede interpretem a carga útil da mesma maneira.

## Regras de Codificação {#encoding-rules}

Norito usa layouts determinísticos para os formatos de dados comuns que aparecem no modelo de dados Iroha:

- As strings são `[len][utf8-bytes]`; `len` segue `COMPACT_LEN` quando ativado.
- Quando `COMPACT_LEN` está definido, um comprimento por valor usa um varint compacto.
- Quando `COMPACT_LEN` está ausente, um comprimento por valor é um `u64` de 8 bytes em little-endian.
- Os cabeçalhos de comprimento de sequência são fixos em 8 bytes little-endian `u64` na v1.
- `Vec<u8>` é codificado como `[len_u64][raw-bytes]` em vez de um comprimento por byte.
- Sequências empacotadas usam deslocamentos monotônicos `u64` `(len + 1)` seguidos pelos payloads de elementos concatenados.
- Mapas codificam contagens de entradas com `u64` fixo e usam ordem de chave determinística. As entradas `HashMap` são ordenadas por chave antes da codificação; `BTreeMap` usa sua ordem natural.
- `BigInt` usa bytes little-endian em complemento de dois com um comprimento de byte de `u32` e um limite de 512 bits.
- `Numeric` é codificado como `(mantissa, scale)`, onde a mantissa armazena o valor inteiro e a escala armazena o número de dígitos fracionários.

Essas regras são importantes para assinaturas e hashes criptográficos. Dois SDKs que constroem a mesma transação lógica devem produzir os mesmos bytes canônicos.

## Hasheamentos criptográficos de esquema {#schema-hashes}

Payloads tipados Norito carregam um hash criptográfico de esquema de 16 bytes no cabeçalho. O hash criptográfico padrão é derivado do nome de tipo totalmente qualificado. Compilações que habilitam o hashing estrutural de esquemas derivam o hash criptográfico do esquema canônico em vez disso.

Decodificadores tipados rejeitam incompatibilidades de esquema. Isso protege os clientes de decodificar acidentalmente um quadro Norito válido como o tipo errado e é o modo de falha usual quando um pacote de artefato de teste SDK se desvia do modelo de dados do nó.

## Compressão e Aceleração {#compression-and-acceleration}

Norito suporta compressão explícita e adaptativa sem alterar o payload lógico:

|Característica|Propósito|
| --- | --- |
| `to_bytes` |Codifique um cabeçalho seguido por uma carga útil não comprimida.|
| `to_compressed_bytes` |Codifique com Zstd e registre a tag de compressão no cabeçalho.|
| `to_bytes_auto` |Aplique heurísticas determinísticas para decidir se a compressão vale a pena.|
|CRC64 aceleração|Usa CRC64-XZ portátil em todos os lugares, com CLMUL em x86_64 ou PMULL em aarch64 quando disponível.|
| GPU CRC64 e compressão |Metal opcional ou ajudantes CUDA podem acelerar grandes cargas úteis, depois retornar aos caminhos CPU.|

A aceleração de hardware nunca altera o conteúdo decodificado. Os aceleradores CRC e JSON devem corresponder à saída portátil bit a bit. Os bytes do quadro Zstd podem diferir entre os codificadores CPU e GPU, mas a carga decodificada e os metadados do cabeçalho Norito permanecem determinísticos para validação.

## JSON Suporte {#json-support}

Norito inclui uma stack nativa JSON para endpoints API e ferramentas que precisam de JSON sem sair do sistema de tipos Norito.

| JSON recurso |Caso de uso|
| --- | --- |
| `norito::json::{to_json, from_json}` |Codificação/decodificação tipada determinística JSON.|
|Bonito e ajudantes de escritor| CLI saída, artefatos de teste e integração de streaming `std::io`. |
| DOM valores |Manipulação programática através do modelo de valor JSON de Norito.|
|Digitado rapidamente JSON|Decodificação/encodificação baseada em fita estrutural para caminhos quentes DTO.|
|Leitor sem cópia|Varredura de tokens que aproveita strings da entrada sempre que possível.|
|Aceleradores de estágio 1|Indexação estrutural opcional AVX2, NEON, Metal ou CUDA com retorno ao escalar.|

O código Iroha deve preferir os helpers `norito::json` para payloads tipados API. Adicionar `serde_json` simples aos caminhos de produção representa o risco de divergência do esquema e do comportamento de manipulação de campos esperado pelos extratores SDKs e Torii.

## Gerar Suporte {#derive-support}

Rust os tipos de dados geralmente usam macros derive em vez de código de codec manual. A camada derive pode gerar Norito codecs binários, esquemas e JSON auxiliares.

Os atributos de campo comuns são:

|Atributo|Efeito|
| --- | --- |
| `#[norito(rename = "other")]` |Usa um nome serializado estável para o esquema e compatibilidade JSON.|
| `#[norito(skip)]` |O codificador omite o campo. O decodificador fornece seu valor `Default`.|
| `#[norito(default)]` |Usa `Default` quando um payload decodificado não contém o campo.|
| `#[norito(skip_serializing_if = "...")]` |Omitir campos de JSON quando o predicado corresponder, preservando os padrões de decodificação determinística.|

As derivações também expõem dicas de comprimento codificado e cálculos de comprimento exato sempre que possível. Os codificadores usam essas dicas para reservar buffers e evitar cópias extras.

## pacote de software Famílias de Recursos {#crate-feature-families}

Ao construir vinculações Iroha ou SDK a partir do código-fonte, os recursos Norito selecionam quais auxiliares e aceleradores estão disponíveis:

|Família de recursos|O que isso permite|
| --- | --- |
| `derive` |Macros procedurais reexportadas para binário, esquema e derivações JSON.|
| `compression` |Suporte Zstd para payloads com cabeçalho emoldurado.|
| `packed-seq` |Layouts de coleção compactada usando tabelas de deslocamento.|
| `packed-struct` |Layouts de struct gerados por derive compactados.|
| `compact-len` |Prefixos de comprimento por valor Varint.|
| `columnar` | Norito Blocos de Coluna, AoS/NCB codecs de linha adaptativos e visualizações emprestadas para caminhos com muitas leituras; incluído no conjunto de recursos padrão `node-codec`. |
| `strict-safe` |Converte falhas de decodificação em caminhos suscetíveis em erros estruturados.|
| `simd-accel` | CPU aceleração quando disponível, com retorno determinístico.|
| `json` |Analisador nativo JSON, gravador, DOM, derivações tipadas e caminhos rápidos.|
| `json-std-io` |Ajudantes de leitura e escrita sobrepostos na pilha JSON.|
| `metal-stage1`, `cuda-stage1` |Opcional GPU JSON backends de índice estrutural.|
| `metal-stage2` |Classificação opcional de metadados Metal para a fita estrutural JSON.|
| `metal-crc64`, `cuda-crc64` |Opcional GPU CRC64 auxiliares para cargas úteis grandes.|
| `gpu-compression` |Metal opcional ou aceleração Zstd CUDA para grandes cargas úteis.|
| `stage1-validate` |Depuração de validação que compara índices estruturais acelerados JSON com saída escalar.|

A disponibilidade de recursos pode diferir entre SDKs e perfis de lançamento. O formato de transmissão continua sendo governado pelo cabeçalho e pelo esquema, e não por flags de compilação locais.

## Torii e Norito RPC {#torii-and-norito-rpc}

Torii expõe JSON para muitas rotas de operador, mas rotas binárias tipadas usam Norito. O tipo de mídia para os corpos Norito HTTP tipados atuais é `application/x-norito`.

Use esses cabeçalhos quando um endpoint API aceitar ou retornar Norito tipado:

```http
Content-Type: application/x-norito
Accept: application/x-norito
```

Quando um endpoint API suporta ambas as representações, os clientes podem enviar uma lista de preferências explícita:

```http
Accept: application/x-norito, application/json
```

Falhas de decodificação são exibidas como erros digitados Torii e contabilizadas pela telemetria. Razões comuns incluem magia inválida, versão não suportada, flag de recurso não suportada, incompatibilidade de checksum, UTF-8 malformado, tag de enum inválida e incompatibilidade de esquema.

Norito RPC transporte é selecionado através da configuração de transporte. Os painéis do operador devem rastrear latência de solicitações, falhas, conexões ativas, bytes de resposta e `torii_norito_decode_failures_total` separadamente do tráfego JSON.

## Norito Transmissão {#norito-streaming}

Norito Streaming estende a mesma abordagem determinística para mídias e superfícies de transporte em tempo real. Seus principais componentes são:

|Recurso de streaming|Propósito|
| --- | --- |
|manifestos técnicos|Declarar compromissos de segmento, rotas de privacidade, capacidades, perfil de codec, suíte de criptografia e metadados da chave de conteúdo.|
|Cabeçalhos de segmento|Vincule número do segmento, duração, contagem de blocos, tempo, modo de entropia, resumo de áudio e raízes de Merkle.|
|Compromissos dos fragmentos|Permitem verificar os fragmentos da carga contra o manifesto antes que visualizadores e retransmissores os sirvam ou decodifiquem.|
|Quadros de controle|Transporte anúncios de manifesto técnico, feedback, atualizações importantes e negociação de capacidades.|
|HPKE atualizações de chave|Gire os segredos de transporte usando o conjunto negociado e contadores que aumentam monotonamente.|
|Negociação de capacidade|Interage com bits de recursos suportados, limites de datagramas, cadência de feedback e requisitos de privacidade.|
|FEC e feedback|Usa relatórios de receptor determinísticos e decisões de paridade para caminhos em tempo real com perda.|
|Vetores de conformidade|Os artefatos de teste entre idiomas provam que SDKs decodifica os mesmos manifestos técnicos, segmentos e fluxos de entropia.|

Codecs específicos para streaming e perfis de entropia são separados do formato principal de transação/consulta Norito, mas seus manifestos técnicos e dados de controle ainda usam Norito, de modo que roteamento, faturamento, reprodução e evidência de auditoria permanecem reproduzíveis.

## Orientação Operacional {#operational-guidance}

- Prefira construtores SDK e vinculações geradas em vez de bytes Norito feitos à mão.
- Trate a incompatibilidade de esquema como um problema de versão ou artefato de teste, não como uma falha de rede transitória.
- Arquive `.nrt`, `.norito` e os artefatos de manifesto no pacote de lançamento ou de incidente que os produziu.
- Use Norito como a fonte de verdade para dados assinados, hashados ou persistidos. Use projeções JSON para painéis e inspeção manual.
- Ao adicionar um novo endpoint tipado Torii API, documente se ele aceita JSON, Norito ou ambos, e exponha os tipos de conteúdo suportados em `/openapi.json`.
- Antes de ativar um acelerador, execute testes de paridade contra a saída escalar. Se um acelerador falhar, use a substituição escalar determinística. A semântica do payload deve permanecer inalterada.

## Páginas Relacionadas {#related-pages}

- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [referência de gênese da blockchain](/pt/reference/genesis.md)
- [Esquema do modelo de dados](/pt/reference/data-model-schema.md)
- [JavaScript / TypeScript SDK](/pt/guide/tutorials/javascript.md)
- [Python SDK](/pt/guide/tutorials/python.md)
- [Swift e iOS SDK](/pt/guide/tutorials/swift.md)

## Referências a Montante {#upstream-references}

- [Norito especificação de formato](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/norito.md)
- [Norito crate README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/norito/README.md)
