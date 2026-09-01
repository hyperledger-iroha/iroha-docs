---
translation_locale: pt
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: d4c2c1a4e29e0352ac20be5320f79a2686527d55a19d65a6154aedcd63fa447e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Executar Liquidação Privada Atômica entre Espaços de Dados {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordena uma parte de transferência de acordo confidencial em cada um dos 2 a 255 SORA Nexus espaços de dados e finaliza cada etapa em um estado global transação. Um pacote rejeitado, expirado ou abortado não aplica nenhum trecho. Nativo Transparente AMX DvP/PvP permanece como um caminho de protocolo separado.

::: warning Status de lançamento
Este recurso está sujeito à governança, vem desativado por padrão e ainda não está qualificado para produção. Não o ative para valor real de CBDC até que todos os critérios publicados de funcionalidade, privacidade, tolerância a falhas, desempenho, builds reproduzíveis, revisão criptográfica independente e publicação de artefatos tenham sido atendidos para a versão exata.
:::

## O que o protocolo esconde {#what-the-protocol-hides}

Cada etapa utiliza uma prova de nota privada fixa de duas entradas e três saídas. Os validadores do comitê verificam a prova e uma transição de estado opaca; eles não recebem as partes em texto claro, ativo, quantidade, memorando ou resultado comercial. Um auditor local autorizado descriptografa a cápsula de auditoria preenchida, verifica seu conteúdo e assina uma aprovação separada por finalidade. A política padrão aceita uma aprovação do conjunto de auditores governados.

A transação portadora pública e o recibo revelam deliberadamente:

- os identificadores de rede e pacote
- rotas de espaço de dados do participante e contagem de participantes
- tempos e alturas de expiração
- identificadores estáveis e opacos de pool, raízes, anuladores, compromissos e slots fixos de texto cifrado
- principais de autorização do comitê e disponibilidade exata de 3 de 4, certificados de Preparar e Confirmar
- patrocinador, taxa de rede pública e status do terminal

Esta é a confidencialidade do conteúdo, não o anonimato do fluxo de tráfego. Tempo, contagem de participantes, identidade do espaço de dados e atividade do pool estável permanecem públicos. Um espaço de dados que hospeda apenas um CBDC também pode tornar o ativo inferível a partir da rota, mesmo que nenhum identificador literal do ativo seja publicado.

## Requisitos de implantação {#deployment-requirements}

Antes da ativação, os operadores precisam de todos os seguintes:

1. exatamente quatro validadores para cada espaço de dados participante, com chaves de consenso BLS distintas e provas de posse
2. obrigatório Sumeragi DA/RBC ativado para cada altura
3. um pool de liquidação confidencial governado e raiz inicial em cada espaço de dados
4. uma capacidade de nota privada V1 ativa e o perfil de prova de liquidação separado
5. pelo menos um `PrivateSettlementAuditPolicyV1` local governado, incluindo assinatura distinta do auditor e chaves de criptografia híbrida, uma época de chave, validade de altura e um limite de aprovação
6. armazenamento auxiliar privado suficiente para o período de retenção configurado
7. uma conta patrocinadora neutra capaz de enviar a transação pública portadora final

Um auditor também pode operar um validador, mas deve usar chaves separadas de consenso, assinatura de auditor e criptografia do auditor. Mantenha as chaves de criptografia desativadas pelo período de retenção regulamentar, ou governe e teste o reembalamento da cápsula antes de desativá-las.

A autoridade de quatro validadores é ancorada no estado; não é fornecida pelo cliente. No `authority_context_height` do manifesto, cada validador obtém do estado de consenso a lista ordenada exata de vias e espaços de dados e a encarnação ativa da via, exige que a altura obtida corresponda e verifica as quatro chaves BLS e suas provas de posse. O upload, a preparação e a admissão do recibo final usam a mesma autoridade histórica.

## Configurar admissão {#configure-admission}

Todo comportamento de produção vem da configuração do nó. Variáveis de ambiente não podem ativar esse caminho. O padrão fornecido é `enabled = false`; deixar o recurso desativado não requer configuração específica da liquidação.

Depois que a governança registrar a capacidade necessária e escolher uma altura de ativação com aviso adequado, configure cada nó relevante de forma consistente:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

O exemplo usa os limites V1 fornecidos, não uma recomendação de desempenho. Meça armazenamento, prova, cápsula, transação do transportador e contêineres de dados de latência em hardware pretendido antes de escolher os limites operacionais. Os três tempos limite de fase devem caber dentro de `max_expiry_blocks`, e a retenção de registros auxiliares deve ser pelo menos igual à janela de expiração.

`max_capsule_bytes` limita a codificação canônica Norito de todo o `PrivateSettlementAuditCapsuleV1`: AAD, valor nonce criptográfico, texto cifrado, estrutura de vetor, identidades de auditores e cada linha DEK envolvida. Não é um limite apenas de texto cifrado. Cada classe de preenchimento configurada deve se ajustar ao contêiner de dados de cápsula inteira conservadora para pelo menos `default_min_auditor_approvals` auditores. Torii também rejeita uma política recém-admitida cujo `min_approvals` está abaixo do limite estabelecido, e rejeita qualquer cápsula real cuja codificação canônica completa seja muito grande.

`max_carrier_bytes` limita a transação canônica completa assinada pelo patrocinador, não apenas o pacote certificado. A contagem inclui a estrutura de instrução registrada, autorização da transação principal e metadados, intenção de taxa e assinatura. Os limites comuns de transação na rede ainda se aplicam como um limite superior independente.

A ativação falha fechada a menos que a capacidade governada esteja ativa, seu estado e alturas de ativação satisfaçam o período de aviso, o perfil de prova compilado corresponda a V1, e os registros de pool e auditoria na cadeia estejam atualizados. Habilitar apenas a bandeira de configuração é insuficiente.

## Fluxo de trabalho de liquidação {#settlement-workflow}

O cliente constrói provas e cápsulas criptografadas localmente. Testemunhas secretas devem permanecer na carteira nativa ou no trabalhador nativo; não as serialize nos logs da aplicação, objetos Python, solicitações HTTP ou registros de coordenação duráveis.

A cápsula e os dados autenticados per-auditor DEK-wrap incluem o valor do resumo criptográfico do comitê exatamente ancorado ao estado e `authority_context_height`, assim como a rede, rota/encarnação, pacote, etapa, política, época chave e compromisso em texto simples. Uma chave encapsulada não pode ser movida para um registro diferente ou contexto de principal de autorização histórica.

Para cada etapa canônica, o coordenador então executa esta sequência:

1. Envie o material criptografado provisório para todos os quatro validadores e obtenha um certificado de disponibilidade canônico exato 3-de-4.
2. Solicite a um auditor autorizado que busque e descriptografe sua cápsula, recalcule as vinculações públicas, aplique a política local e envie uma aprovação.
3. Solicite a preparação de votos dos quatro validadores. Cada validador verifica de forma independente e registra de forma durável o delta antes de votar. Persista o certificado canônico 3-de-4 de Preparação em cada respondedor registrado.
4. Após cada etapa ter um certificado Prepare, construa a barreira Prepare completa e imutável. Solicite e persista os certificados Commit canônicos 3-de-4. Se o coordenador reiniciar, consulte os nós participantes sobre seus certificados Prepare e Commit localmente duráveis. selecione um certificado equivalente a quórum canônico e distribua-o novamente antes de continuar; nunca reconstrua um certificado a partir de um cache local não autenticado.
5. Faça com que o patrocinador do manifesto técnico assine e envie exatamente uma transação portadora global. A transação portadora contém uma instrução `FinalizeAtomicPrivateSettlementV1` e o pacote certificado completo exato. Coordenador e WSV medem previamente a instrução de finalização completa apagada por tipo, incluindo a estrutura de instrução registrada. Torii e a vinculação central da transação portadora de uso único aplicam `max_carrier_bytes` sobre a transação exata assinada pelo patrocinador canônico. incluindo autorização principal, metadados, intenção de taxa e assinatura. Torii rejeita uma transação portadora antes do seu contexto de autorização principal, no ou após a última altura de ingresso que poderia alcançar a finalização por expiração, ou além do período de expiração governado.
6. Consulte o status do pacote público e o registro de resultado do protocolo até a finalidade global. Trate o estado do registro auxiliar local como provisório até que ele se reconcilie com aquele registro terminal global imutável.

O cliente Rust expõe este fluxo através de métodos incluindo `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` e `submit_private_settlement_bundle_v1`. A coordenação segura para reinício utiliza `recover_or_prepare_private_settlement_bundle_v1` e `recover_or_commit_private_settlement_bundle_v1`. Chamadas de comitê e auditor requerem credenciais de função explícitas; elas não reutilizam o signatário criptográfico da conta comum.

## Gire uma política de auditor com segurança {#rotate-an-auditor-policy-safely}

Use a instrução autorizada de governança de privacidade `RotatePrivateSettlementPoolPolicyV1`. Ela deve nomear o valor exato atual do resumo criptográfico da governança, manter a mesma rota, o mesmo conjunto e compromisso de vinculação de ativos, avançar a revisão da governança em um, use uma época de chave estritamente mais nova e diferentes resumos criptográficos de política/governança, e ative no bloco que contém a rotação. A fronteira do conjunto, raízes, nulificadores, saídas, conjuntos de repetição, e os registros de resultado do protocolo finalizados são preservados. Não inclua um registro de resultado do protocolo que toque a mesma rota/conjunto na altura de ativação da rotação; a instrução rejeita esse limite.

A projeção do conjunto público mantém toda a linhagem completa de revisões de políticas substituídas. Um registro de resultado de protocolo finalizado antes da rotação, portanto, permanece válido após a reinicialização, e reproduzir exatamente esse registro de resultado de protocolo continua sendo idempotente. A linhagem não autoriza trabalho inacabado: qualquer pacote de política antiga que atravesse o limite de ativação falha fechado antes de alterações no estado global. Retenha todas as chaves de descriptografia antigas necessárias para abrir cápsulas armazenadas, ou complete um reembrulho de cápsula governado e testado antes de destruí-la.

## Torii família de rotas {#torii-route-family}

Essas rotas usam objetos de requisição e resposta canônicos Norito. Respostas autenticadas e restritas usam comportamento de cache privado `no-store`.

|Operação          |Método e caminho|Principal|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Carregar etapa| `POST /v1/nexus/private-settlements/legs`                                  |assinatura de conta canônica|
|Compartilhamento de disponibilidade| `POST /v1/nexus/private-settlements/legs/availability-shares`              |assinatura de conta canônica|
|Preparar voto| `POST /v1/nexus/private-settlements/phases/prepare-votes`                  |assinatura de conta canônica|
|Confirmar voto| `POST /v1/nexus/private-settlements/phases/commit-votes`                   |assinatura de conta canônica|
|Persistir fase QC| `POST /v1/nexus/private-settlements/phases/certificates`                   |assinatura de conta canônica|
|Fase de recuperação QCs| `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` |patrocinador técnico de manifesto|
|Status da etapa| `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           |assinatura de conta canônica|
|Prova do comitê| `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`  |validador de lista exata|
|Cápsula de auditoria| `GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`    |auditor governado|
|Aprovação do auditor| `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |auditor governado|
|Enviar final/abort| `POST /v1/nexus/private-settlements/bundles`                               |patrocinador técnico de manifesto|
|Status do pacote| `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    |público|
|registro de resultado de protocolo ou abortar| `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            |público|

O registro de protocolo e status público APIs expõe apenas os campos públicos documentados. Em particular, o status ordinário da etapa não revela contagens de aprovação ou o limite do auditor governante. Leituras restritas colapsam intencionalmente materiais ausentes, não autorizados e expirados por retenção na mesma classe de resposta indisponível. A rota de envio aceita exatamente uma instrução de finalização ou cancelamento assinada diretamente pelo patrocinador. Sua resposta `202` contém apenas o ID do pacote, a altura observada de admissão e o hash criptográfico da transação do transportador; não afirma que uma interrupção em fila já é final. Os SDKs exigem que ambos os identificadores sejam literais Norito `Hash` JSON com soma de verificação canônica e que a altura seja um inteiro não assinado de 64 bits exato; campos ausentes, adicionais, digitados incorretamente, não canônicos, com soma de verificação inválida, negativos, zero-negativos, fracionários ou que tenham transbordado falham de forma fechada. Use o status do pacote ou o registro de resultado do protocolo para o estado terminal autorizado. O código de status também é exato: esta rota de admissão de transação da operadora requer `202`, enquanto toda outra resposta de sucesso de liquidação privada V1 requer `200`. Os clientes rejeitam códigos alternativos bem-sucedidos `2xx` como desvio de contrato sem refletir o corpo de resposta inesperado através de erros do cliente. Eles expõem apenas um código de rejeição do servidor quando corresponder a `[A-Za-z0-9_.:-]{1,128}` e descartar causas do analisador/validador de respostas, impedindo que o conteúdo do corpo ou nomes de campos JSON escolhidos por atacantes reapareçam através de logs conscientes das causas.

## Falha e recuperação {#failure-and-recovery}

Aprovações de auditor ausentes ou desatualizadas, menos de três votos de validadores, raízes ou épocas incorretas, nulificadores duplicados, provas ou cápsulas substituídas, ordem de etapas não canônica, pacotes expirados e termos de reembolso incompatíveis falham todos antes da mutação global. Certificados de commit nunca alteram o estado privado.

Os validadores fazem o fsync de registros auxiliares, deltas em estágio e certificados de fase antes de reconhecê-los. Ao reiniciar, eles reconstruem reservas a partir de registros duráveis canônicos e, em seguida, conciliam registros imutáveis de resultados do protocolo global, marcadores de aborto ou expiração. O reconciliador supervisionado também executa a poda de retenção terminal na altura autorizada observada de forma síncrona, mesmo quando não há candidato terminal para reconciliar, e ele falha fechado em um erro de poda. Apenas um registro terminal global autoritário libera bloqueios em estágio. Reproduzir um registro de resultado de protocolo finalizado idêntico é idempotente; uma reprodução conflitante falha de forma determinística.

A identidade da reserva inclui a rota completa. Pontos de grupo usam `(route, pool_id, epoch, root)`, anuladores usam `(route, pool_id, nullifier)` e saídas usam `(route, pool_id, commitment)`. Valores opacos iguais em outra rota são independentes; uma colisão em rota exata permanece bloqueada após a reinicialização.

Alertas operacionais devem usar apenas os campos de pacote opaco, rota, fase, valor de resumo criptográfico, altura e classe de motivo. Nunca coloque cápsulas descriptografadas, identificadores de conta ou ativo, valores, memorandos, dados de visualização, testemunhas de prova ou cargas úteis de analisador em registros, eventos, rótulos de métricas ou intervalos de rastreamento.

## Qualificação antes do valor real {#qualification-before-real-value}

Para a construção e configuração exatas que você pretende implantar, arquive evidências que cubram:

- prova adversarial, cápsula, política, rotação de chaves, reembolso e casos de repetição
- processos reais de quatro validadores para 2, 3, 4, 8 e 16 espaços de dados, incluindo reinicializações de validadores e coordenadores, perda de mensagens autenticada de 5%, 10% e 20%, partições de fase, recuperação e falhas no limite de persistência
- análise de vazamento canário e diferencial através de Torii, P2P, blocos, Kura, visualizações de dados em um ponto no tempo, consultas, eventos, registros e telemetria
- pelo menos cinco aquecimentos e trinta pacotes medidos por contagem de participantes da rede real, com p50, p95, p99, intervalos de confiança, recursos, tráfego, tamanhos de registro de prova e resultado do protocolo, e AMX transparente como o controle
- testes rigorosos de espaço de trabalho, verificação de lint e formatação, sementes aleatórias, soak, builds reproduzíveis, SBOMs e hashes criptográficos de artefatos assinados
- ambas as camadas formais: as verificações de simetria de contagem de etapas 3/255 e a configuração precisa do comitê de quatro validadores indexados N=2 focados em validadores mais falhas totalmente limitadas, falha principal de papel N=3, N=4 limpa e N=3 de expiração/replay, com orçamentos de falha independentes por comitê
- revisão independente da relação de prova, seletores de slot fictício, vinculações de ativos e cápsulas, relação de reembolso, criptografia e máquina de estado de espaço de dados cruzado

Publique as evidências brutas e saneadas, o modelo de ameaças, o argumento do protocolo, as limitações, o ID de commit, a descrição do hardware e os relatórios de auditoria em um artefato imutável respaldado por DOI. Apenas os testes do repositório não transformam o recurso em um sistema de liquidação CBDC qualificado para produção.

A partir do checkout final limpo Iroha, gere o inventário da fonte de lançamento e sele dentro de uma raiz de pacote pré-existente fora desse checkout:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

O produtor falha em arquivos preparados, não preparados, não rastreados ou não mesclados e em qualquer alteração de fonte durante a captura. Ele retém o objeto de commit bruto, inventário de árvore Git canônica, lista exata de caminhos binários, selo de origem determinístico e `Cargo.lock`; incluir toda declaração de artefato do seu resultado JSON no manifesto técnico final de lançamento. Isso não renuncia ao verificador final do pacote DOI ou a qualquer porta de liberação externa.

O selo de origem é portátil e falha ao fechar: o produtor e o verificador final resolvem todo o grafo de links simbólicos arquivado, então um link que aparece na raiz mas escapa através de outro link, um ciclo, a travessia `.git`, ou um alvo no estilo Windows é rejeitado antes que os links sejam criados. Relatórios estruturados de origem e de gateway são analisados apenas a partir de arquivos estáveis limitados cujo valor de resumo criptográfico e comprimento correspondam ao manifesto técnico de lançamento, e cada tipo de carga útil de origem deve ocorrer exatamente uma vez.

Cada execução de falha bruta e amostra de latência deve vincular o commit completo da versão, o SHA-256 de uma descrição de hardware fixo estruturada, e o SHA-256 de sua configuração de contagem exata de participantes. Arquivar um manifesto técnico de configuração canônica cobrindo N=2,3,4,8,16; cada entrada deve referenciar os bytes de configuração retidos e afirmar exatamente quatro validadores por espaço de dados, um quórum de 3 em 4, e RS16 DA/RBC obrigatórios assinados. O verificador de lançamento rejeita resumos produzidos em uma compilação, perfil de hardware ou configuração de rede diferente. Cada perda individual, corte de fase e linha de falha de persistência deve, adicionalmente, nomear referências de registro exatas JSONL globalmente não reutilizáveis dentro do limite SHA-256 artefatos de controlador autenticado e captura de atomicidade. O verificador de lançamento resolve esses resumos criptográficos e exige que as linhas correspondam à identidade da execução, índice do teste e parâmetros, reconhecimento do controlador ou resultado de recuperação, contagem de verificação contínua, e zero observações de visibilidade parcial e gastabilidade. Comparações p95/p99 de lançamentos posteriores também rejeitam uma linha de base assinada cujo hardware, configurações ou requisitos de medição diferem do candidato. O verificador final regenera todos os percentis relatados, MADs, e intervalos de confiança determinísticos a partir das amostras brutas arquivadas em vez de confiar em um resumo de benchmark separado. Ele também recarrega o manifesto técnico canário e reescaneia independentemente cada superfície de privacidade arquivada, de modo que um relatório não pode suprimir uma detecção secreta plantada após a reatribuição dos resumos criptográficos dos arquivos. Cada execução apenas-para-secretos deve reter seu loopback pcap não filtrado apenas para o proprietário, stderr bruto do tcpdump e estatísticas sem perda, manifesto técnico de porta canônica, arquivo de origem restrita empacotado e observações de atomicidade de todos os pares. O verificador final reroda a divisão de pacotes ligada à porta, as projeções de origem e as verificações de atomicidade de base para terminal a partir desses bytes arquivados, em vez de confiar nos resumos publicados.

O arquivo também deve incluir manifestos técnicos canônicos de contagem de tráfego pareado e de pares diferenciais vinculando os caminhos de arquivos esquerdo e direito exatos, tipos, comprimentos em bytes e resumos criptográficos SHA-256 para cada superfície de privacidade necessária. Suas raízes declaradas devem conter exatamente o inventário de arquivos emparelhados. O verificador requer tamanhos de arquivo inteiros iguais e JSON formas públicas para superfícies comuns. A captura bruta de loopback portadora de entropia e o arquivo restrito de origem compactado são exceções de tamanho explícitas; ele compara, em vez disso, o tipo de link do pacote e os comprimentos por pacote, as identidades de origem restrita e os comprimentos de linha de forma fixa. Cada solicitação/resposta Torii, pacote público/restrito P2P, bloco, consulta, evento, registro e contagem de tráfego de telemetria também devem corresponder. Uma mudança na forma do pacote, vazamento estrutural de mesmo tamanho, reivindicação falsa de procedência, ou arquivo não emparelhado não pode ser ocultado reescrevendo o relatório de vazamento e seus hashes criptográficos.
