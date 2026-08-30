---
translation_locale: pt
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Execute Atomo Private Data-Cross-Space Settlement {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordena uma etapa de liquidação confidencial em cada um dos 2 a 255 espaços de dados SORA Nexus e finaliza cada etapa em uma transação de estado global. Um pacote rejeitado, expirado ou abortado não aplica nenhuma etapa. Nativo transparente AMX DvP/PvP continua sendo um caminho de protocolo separado.

::: warning Status de lançamento Esta funcionalidade é regida, desativada por padrão,
Não ativá-lo para o valor real CBDC até que os portões funcionais, de privacidade, falha, desempenho, construção reprodutível, revisão criptográfica independente e publicação de artefatos tenham sido todos aprovados para a liberação exata.

## O que o protocolo esconde {#what-the-protocol-hides}

Cada perna usa uma prova de nota privada fixa de duas entradas e três saídas. Os validadores do comitê verificam a prova e uma transição de estado opaco; eles não recebem as partes de texto simples, ativo, valor, memorando ou resultado de negócios. Um auditor local autorizado decodifica a cápsula de auditoria revestida, verifica esse conteúdo e assina uma aprovação separada para o propósito.

O transporte público e o recibo revelam deliberadamente:

- Identificadores de rede e pacotes
- rotas de espaço de dados dos participantes e contagem de participantes
- Horário e altura de expiração
- Identificadores estáveis opacos, raízes, anuladores, compromissos e slots de texto criptográfico fixo.
- Autoridades do comitê e disponibilidade exata de 3 em 4 certificados, Prepare e Commit
- patrocinador, taxa de rede pública e status do terminal

Esta é a confidencialidade do conteúdo, não o anonimato do fluxo de tráfego. O tempo, a contagem de participantes, a identidade do espaço de dados e a atividade do pool estável permanecem públicas. Um espaço de dados que hospeda apenas um CBDC também pode fazer com que o ativo seja deduzível da rota mesmo que nenhum identificador literal de ativo seja publicado.

## Requisitos de implantação {#deployment-requirements}

Antes da ativação, os operadores precisam de todos os seguintes elementos:

1. Exatamente quatro validadores para cada espaço de dados participante, com chaves de consenso e provas de posse distintas BLS
2. obrigatório Sumeragi DA/RBC habilitado para cada altura.
3. um grupo de liquidação confidencial governado e raiz inicial em cada espaço de dados
4. uma capacidade de nota privada ativa V1 e o perfil separado de prova de liquidação
5. pelo menos um local `PrivateSettlementAuditPolicyV1` regido, incluindo chaves de assinatura e de criptografia híbrida distintas do auditor, uma época chave, validade de altura e um limiar de aprovação
6. um armazenamento privado suficiente para o período de retenção configurado
7. Uma conta patrocinadora neutra capaz de apresentar a transportadora pública final

O auditor também pode operar um validador, mas deve utilizar chaves de consenso, assinatura do auditor e criptografia do auditor separadas. Manter as chaves de desciframento retiradas para o período de retenção regulatório, ou reger e reenrolar a cápsula de ensaio antes de retirá-las.

A autoridade de quatro validadores é ancorada no estado, não fornecida pelo cliente. No manifesto `authority_context_height`, cada validador resolve a lista exata ordenada de faixa/espaço de dados e encarnação ativa de faixa desde o estado de consenso, requer que a altura resolvida coincida e verifica as quatro chaves BLS e provas de posse.

## Configuração de admissão {#configure-admission}

Todos os comportamentos de produção provêm da configuração do nó. As variáveis ambientais não podem ativar esse caminho. O padrão enviado é `enabled = false`; deixando o recurso desativado, não é necessária nenhuma configuração específica de acordo com a configuração.

Após a governança ter registado a capacidade necessária e escolhido uma altura de ativação com aviso adequado, configure todos os nós relevantes de forma consistente:

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

O exemplo utiliza os limites V1 enviados, não uma recomendação de desempenho. o hardware previsto antes de escolher os limites operacionais. As três temporadas de fase devem inserir-se no `max_expiry_blocks`, e a retenção do veículo lateral deve ser, pelo menos, essa janela de validade.

`max_capsule_bytes` limita a codificação canônica Norito de todo o `PrivateSettlementAuditCapsuleV1`: AAD, nonce, texto cifrado, enquadramento vetorial, identidades do auditor e cada linha envolta-DEK. Não é um limite apenas para o texto cifrador. Cada classe de revestimento configurada deve caber no envelope da cápsula inteira conservadora para pelo menos os auditores `default_min_auditor_approvals`. Torii também rejeita uma política recém-admitida cuja `min_approvals` está abaixo desse piso regido, e rejeita qualquer cápsula real cuja codificação canônica completa é muito grande.

`max_carrier_bytes` limita a transação canônica completa assinada pelo patrocinador, não apenas o pacote certificado. A contagem inclui o enquadramento de instruções registradas, a autoridade da transação e os metadados, a intenção da taxa e a assinatura. Os limites ordinários das transações na rede ainda se aplicam como um limite superior independente.

A ativação não é fechada a menos que o recurso regulado seja ativo, seu estado e altitudes de ativação satisfaçam o período de notificação, o perfil da prova compilado coincida com V1, e os registros de auditoria e pool na cadeia sejam atualizados.

## Fluxo de trabalho de liquidação {#settlement-workflow}

O cliente constrói provas e cápsulas criptografadas localmente. As testemunhas secretas devem permanecer na carteira nativa ou no trabalhador nativo; não serializá-las em registros de aplicativos, objetos Python, solicitações HTTP ou registros duráveis de coordenação.

Os dados autenticados por cápsula e por auditor DEK incluem o digesto do comité ancorado pelo Estado exato e `authority_context_height`, bem como a rede. Uma chave embalada não pode ser transferida para uma lista ou um contexto de autoridade histórica diferente.

Para cada perna canônica, o coordenador realiza a seguinte sequência:

1. Faça o upload do material criptografado provisório para todos os quatro validadores e obtenha um certificado de disponibilidade canônico exato de 3 em 4.
2. Faça com que um auditor autorizado traga e decodifique sua cápsula, recalcule as obrigações públicas, aplique a política local e apresente uma aprovação.
3. Request Prepare votos dos quatro validadores. Cada validador verifica de forma independente e fasea duradouros o delta antes da votação. Permaneça o certificado canônico 3-de-4 Prepare em cada responder escalonado.
4. Depois de cada perna ter um certificado Prepare, construam a barreira completa Imutável Prepare. Solicitação e persistência de certificados canônicos de Comit 3 a 4. Se o coordenador reiniciar, consulte os nós participantes sobre seus certificados Prepare e Commit armazenados localmente de forma durável, selecione um certificado canônico equivalente ao quórum e redistribua-o antes de continuar; nunca reconstrua um certificado a partir de um cache local não autenticado.
5. Ter a assinatura do patrocinador manifesto e enviar exatamente uma transportadora global. A transportadora contém uma instrução `FinalizeAtomicPrivateSettlementV1` e o pacote completo certificado exato. Coordenador e WSV pré-voio medem a instrução completa de finalização em caixa, incluindo enquadramento de instruções registradas. O Torii e a obrigação de carregador principal de um só tiro aplicam o `max_carrier_bytes` sobre a transacção canónica exata assinada pelo patrocinador, incluindo autoridade, metadados, intenção da taxa e assinatura. O Torii rejeita uma transportadora antes do seu contexto de autoridade, na última altura de entrada ou depois dela que poderia atingir a finalidade no prazo de vencimento, ou além do período de vencimento regulado.
6. Pergunte o status do pacote público e receção até a finalidade global. Tratar o estado local de sidecar como provisório até que reconciliar esse imutável registro global do terminal.

O cliente Rust expõe esse fluxo através de métodos que incluem `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` e `submit_private_settlement_bundle_v1`. A coordenação segura contra reinicializações usa `recover_or_prepare_private_settlement_bundle_v1` e `recover_or_commit_private_settlement_bundle_v1`. As chamadas de comitês e auditores exigem credenciais explícitas de função; não reutilizam o assinante comum da conta.

## Rotear com segurança uma política de auditor {#rotate-an-auditor-policy-safely}

Use a instrução de governança de privacidade `RotatePrivateSettlementPoolPolicyV1` autorizada. Deve indicar o digesto de governança actual exato, manter a mesma rota, pool e compromisso de vinculação de ativos, avançar a revisão de governança por um, usar uma época chave estritamente mais nova e diferentes digestos de política / governação, O limite da piscina, raízes, anuladores, saídas, conjuntos de repetição e recibos finalizados são conservados. Não inclua um recibo que toque a mesma rota / piscina na altura de ativação da rotação; a instrução rejeita esse limite.

A projeção do pool público mantém a linhagem completa de revisão da política substituída. Um recibo finalizado antes da rotação permanece, portanto, válido após a reinicialização e a repetição desse recibo exato permanece idempotente. A linhagem não autoriza o trabalho inacabado: qualquer pacote de políticas antigas que atravesse a fronteira de ativação falha em fechar antes das mudanças do estado global.

## Família de rotas Torii {#torii-route-family}

Estas rotas utilizam os objectos de solicitação e resposta canônicos Norito. As respostas autenticadas e restritas utilizam um comportamento de cache privado `no-store`.

|Operação |Método e caminho |Diretor .|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Carregar perna |`POST /v1/nexus/private-settlements/legs` |assinatura da conta canônica |
|Parte da disponibilidade |`POST /v1/nexus/private-settlements/legs/availability-shares` |assinatura da conta canônica |
|Preparem-se para votar .|`POST /v1/nexus/private-settlements/phases/prepare-votes` |assinatura da conta canônica |
|Comprometo de votação |`POST /v1/nexus/private-settlements/phases/commit-votes` |assinatura da conta canônica |
|Fase persistente QC |`POST /v1/nexus/private-settlements/phases/certificates` |assinatura da conta canônica |
| Recuperar QCs de fase | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | patrocinador manifesto |
|Status das pernas |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |assinatura da conta canônica |
|Prova da Comissão |`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |Validador da lista exacta |
|cápsula de auditoria |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |Auditor governado |
|Autorização do auditor |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |Auditor governado |
|Enviar o pacote |`POST /v1/nexus/private-settlements/bundles` |patrocinador manifesto |
|Status do pacote |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |público .|
|Recebimento ou cancelamento|`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |público .|

O estatuto público e o recibo APIs exporão apenas os campos públicos documentados. Em especial, o estatuto normal da perna não revela os números de aprovação ou o limiar do auditor regido. Leituras restritas colapso intencional desaparecido, não autorizado, e Material expirado na retenção para a mesma classe de resposta indisponível.

## Falha e recuperação {#failure-and-recovery}

As aprovações dos auditores faltantes ou ultrapassadas, menos de três votos validadores, raízes ou épocas erradas, anuladores duplicados, provas ou cápsulas substituídas, ordem não-canônica das pernas, pacotes expirados e termos de reembolso incompatíveis falham antes da mutação global. Os certificados de compromisso nunca mudam o estado privado.

Os validadores sincronizam carros laterais, deltas encenadas e certificados de fase antes de reconhecê-los. Ao reiniciar, eles reconstruem reservas a partir de registos canônicos duráveis, depois reconciliam recibos globais imutáveis, marcadores de abortos ou expiração. O reconciliador supervisionado também realiza a poda de retenção terminal na altura autorizada observada sincronicamente, mesmo quando não existe um candidato terminal para conciliar; E não é fechado por um erro de poda. Somente um registro terminal global autorizado libera bloqueios em fase. Reproduzir um recibo final idêntico é impotente; uma repetição conflituosa falha deterministicamente.

A identidade de reserva inclui a rota completa. As cabeças da piscina utilizam `(route, pool_id, epoch, root)`, os anuladores usam `(route, pool_id, nullifier)` e as saídas usam `(route, pool_id, commitment)`. Os valores opacos iguais em outra rota são independentes; uma colisão de rota exata permanece bloqueada durante o reinicio.

Os alertas operacionais devem usar apenas campos opacos de pacote, rota, fase, digest, altura e classe racional. Nunca coloque cápsulas descifradas, identificadores de contas ou ativos, quantidades, memorandos, dados de visualização, testemunhas de prova ou cargas úteis do analisador em registros, eventos, etiquetas de métricas ou intervalos de rastreamento.

## Qualificação antes do valor real {#qualification-before-real-value}

Para a construção e configuração exatas que pretende implementar, arquive evidências que cobrem:

- Prova de adversidade, cápsula, política, rotação de chaves, reembolso e casos de repetição.
- Processos reais de quatro validadores para bancos de dados 2, 3, 4, 8 e 16, incluindo reinicialização do validador e coordenador, perda de mensagem autenticada de 5%, 10% e 20%, partições de fase, recuperação e falhas de limites de persistência.
- Análise de vazamento canário e diferencial em Torii, P2P, blocos, Kura, instantâneos, consultas, eventos, registos e telemetria.
- Pelo menos cinco aquecimentos e trinta pacotes medidos por conta de participantes da rede real, com p50, p95, p99, intervalos de confiança, recursos, tráfego, tamanhos de provas e recibos, e transparente AMX como controle
- Testes rigorosos de espaço de trabalho, verificações de fibras e formatos, sementes aleatórias, remoção, construções reprodutíveis, SBOMs, e hashes de artefatos assinados
- As duas camadas formais: as verificações de simetria de contagem de 3/255 pernas e a exata configuração de expiração/repetição N=3, com orçamentos de falhas independentes por comissão, indexados pelo comité de quatro validadores.
- Revisão independente da relação de prova, dos selectores de fantasia, das ligações entre activos e cápsulas, da relação de reembolso, da criptografia e da máquina de estado do espaço de dados cruzado

Publicar a evidência bruta e desinfetada, o modelo de ameaça, o argumento do protocolo, as limitações, o compromisso ID, a descrição de hardware e os relatórios de auditoria em um artefato imutável apoiado por DOI. Os testes de repositório sozinhos não transformam a característica num sistema de liquidação qualificado para produção CBDC.

Cada corrida de falha bruta e cada amostra de latência devem vincular o compromisso completo de liberação, a SHA-256 de uma descrição estruturada de hardware fixado e a SHA-256 da sua configuração exata de número de participantes. Arquivar um manifesto de configuração canônica que cobre N = 2,3,4,8,16; cada entrada deve referir-se aos bytes de configuração conservados e afirmar exatamente quatro validadores por espaço de dados, um quórum de 3 a 4 e assinado obrigatório RS16 DA/RBC. O verificador de lançamento rejeita resumos produzidos em uma construção, perfil de hardware ou configuração de rede diferente. Cada linha de perda individual, corte de fase e persistência-crash deve também nomear referências de registro JSONL exatas não reutilizáveis globalmente dentro de SHA-256 -bound Controladores autenticados e artefatos de captura de atomicidade. O verificador de libertação resolve essas digestões e exige que as linhas correspondam à identidade da execução, ao índice e aos parâmetros de ensaio, ao resultado de reconhecimento ou recuperação do controlador, à contagem contínua de verificação; As comparações p95/p99 da versão posterior também rejeitam uma linha de base assinada cujo hardware, configuração ou requisitos de medição diferem do candidato. O verificador final regenera todos os percentiis relatados, MADs, e os intervalos de confiança deterministas das amostras brutas arquivadas em vez de confiar num resumo de referência separado. Ele também recarrega o manifesto canário e independentemente revisa todas as superfícies de privacidade arquivadas, por isso um relatório não pode suprimir um hit secreto plantado após a religação de digestões de arquivo. O arquivo também deve incluir um manifesto de par diferencial canônico que liga os caminhos exatos do arquivo esquerdo e direito, tipos, comprimentos de byte e digestões SHA-256 para cada superfície de privacidade necessária. As raízes declaradas devem conter exatamente o inventário de arquivo emparelhado. O verificador final requer independentemente tamanhos iguais e recalcula as formas públicas JSON, de modo que um vazamento estrutural do mesmo tamanho ou um arquivo diferencial não emparelhado não podem ser ocultados reescrevendo o relatório de fuga.
