---
translation_locale: pt
translation_source: /guide/best-practices/index.md
translation_source_hash: c463a3ca8fdef5c852746a7fdcfd6a1f7be5f95f88a5cf443c989ec0a458cd7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Melhores Práticas {#best-practices}

Esta secção recolhe orientações orientadas para a produção de aplicações e redes Iroha.

Usá-lo como uma lista de verificação antes de um ensaio compartilhado da rede de testes, um lançamento de produção ou um grande lançamento do cliente.

## Categorias {#categories}

|Categoria |Concentra-te .|
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Desenvolvimento de aplicações ](./application-development.md) |Configuração do cliente, submissão de transações, retestes, eventos, consultas e desenvolvimento assistido por agentes |
| [Modelagem de dados ](./data-modeling.md) |Domínios, contas, ativos, NFTs, metadados, dados fora da cadeia e convenções de denominação |
| [Implementação da rede ](./network-deployment.md) |Gênesis, topologia, teclas peer, exposição a Torii, configurações de consenso e separação do ambiente |
| [Operações](./operations.md) |Observabilidade, runbooks, backups, gestão de mudanças, verificações de capacidade e manejo de incidentes |
| [Segurança e Acesso ](./security-and-access.md) |Tratamento secreto, permissões, contas técnicas, acesso à rede e vias de auditoria |
| [Preparação de liberação ](./release-readiness.md) |Localnet, Taira, Minamoto, verificações de compatibilidade, salvaguardas da rede ao vivo e planejamento do retrocesso |

## Regras de corte cruzado {#cross-cutting-rules}

- Mantenha o desenvolvimento local, a rede de testes compartilhada e a configuração da produção separados.
- Tratar a gênese, topologia de pares, política do executor e material-chave como artefatos de implantação controlada.
- Não utilize metadados como ponto de dumping para dados grandes, privados ou com alto rendimento.
- Enviar transações por meio de fluxos de trabalho idempotent que podem lidar com rejeição, expiração, retrospectivas e estado atrasado.
- Preferir permissões estreitas, contas técnicas dedicadas e runbooks operacionais explícitos ao longo de um acesso administrador amplo.
- Prove primeiro o comportamento numa rede local descartável, em seguida ensaie-se na Taira ou noutra rede de teste compartilhada antes de qualquer operação da rede principal.

## Referências Relacionadas {#related-references}

- [Configuração e Gestão ](/pt/guide/configure/overview.md)
- [Segurança](/pt/guide/security/)
- [Desempenho e métricas](/pt/guide/advanced/metrics.md)
- [Matriz de compatibilidade ](/pt/reference/compatibility-matrix.md)
- [Torii Pontos finais](/pt/reference/torii-endpoints.md)
- [Tokens de autorização ](/pt/reference/permissions.md)
