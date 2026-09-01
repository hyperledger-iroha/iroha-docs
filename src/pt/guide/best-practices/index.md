---
translation_locale: pt
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Melhores Práticas {#best-practices}

Esta seção coleta orientações voltadas para a produção para aplicações e redes Iroha. Ela está organizada pela decisão que você precisa tomar, e não pelo recurso que por acaso a implementa.

Use-o como uma lista de verificação antes de um ensaio de testnet compartilhado, um lançamento de produção ou uma grande liberação para clientes.

## Categorias {#categories}

|Categoria|Foco|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Desenvolvimento de Aplicativos](./application-development.md) |Configuração do cliente, envio de transações, tentativas, eventos, consultas e desenvolvimento assistido por agente|
| [Modelagem de Dados](./data-modeling.md)                     |Domínios, contas, ativos, NFTs, metadados, dados fora da cadeia e convenções de nomenclatura|
| [Implantação de Rede](./network-deployment.md)           |gênese da blockchain, topologia, chaves de pares da rede, exposição Torii, configurações de consenso e separação de ambientes|
| [Operações](./operations.md)                           |Observabilidade, runbooks, backups, gerenciamento de mudanças, verificações de capacidade e manejo de incidentes|
| [Segurança e Acesso](./security-and-access.md)         |Manuseio de segredos, permissões, contas técnicas, acesso à rede e trilhas de auditoria|
| [Preparação para Lançamento](./release-readiness.md)             |Localnet, Taira, Minamoto, verificações de compatibilidade, salvaguardas da rede ao vivo e planejamento de reversão|

## Regras Transversais {#cross-cutting-rules}

- Mantenha a configuração de desenvolvimento local, testnet compartilhada e produção separadas.
- Trate o gênese da blockchain, a topologia de pares da rede, a política do executor e o material de chave como artefatos de implantação controlados.
- Modele intencionalmente o estado do livro-razão blockchain durável. Não use metadados como um depósito para dados grandes, privados ou de alta rotatividade.
- Envie transações através de fluxos de trabalho idempotentes que possam lidar com rejeição, expiração, tentativas e status atrasado.
- Prefira permissões restritas, contas técnicas dedicadas e manuais operacionais explícitos em vez de acesso amplo de administrador.
- Prove o comportamento em uma rede local descartável primeiro, depois ensaie em Taira ou em outro testnet compartilhado antes de qualquer operação na mainnet.

## Referências Relacionadas {#related-references}

- [Configuração e Gerenciamento](/pt/guide/configure/overview.md)
- [Segurança](/pt/guide/security/)
- [Desempenho e Métricas](/pt/guide/advanced/metrics.md)
- [Matriz de Compatibilidade](/pt/reference/compatibility-matrix.md)
- [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md)
- [Tokens de Permissão](/pt/reference/permissions.md)
