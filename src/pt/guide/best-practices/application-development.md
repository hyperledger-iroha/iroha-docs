---
translation_locale: pt
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Desenvolvimento de aplicações {#application-development}

As aplicações Iroha devem tornar o comportamento das transações explícito, manter o estado da assinatura contido e usar consultas e eventos de forma fácil de observar na produção.

## Configuração do cliente {#client-setup}

- Armazenar a configuração do cliente fora do código-fonte da aplicação. Carregar a cadeia ID, Torii URL, conta de assinatura e configurações de transação a partir de configuração específica do ambiente.
- Mantenha os arquivos `client.toml` separados para as redes localnet, Taira, Minamoto e privadas. Um assinante de testnet copiado nunca deve se tornar um assinante da mainet.
- Estabelecer vidas de transações e temporadas de status deliberadamente. Uma vida muito curta pode expirar sob nervosismo normal da rede, enquanto uma muito longa pode tornar as apresentações duplicadas mais difíceis de raciocinar.
- Usar `nonce = true` apenas quando as transações repetidas devem ter hashes distintos. Para operações de negócios idempotentes, armazenar e reutilizar uma solicitação de aplicação ID para que as recorrências possam ser rastreáveis.

Ver [Configuração do cliente](/pt/guide/configure/client-configuration.md) para os campos atuais TOML.

## Transações {#transactions}

- Construa transações a partir de instruções tipografadas SDK, sempre que possível, em vez das cargas úteis brutas JSON ou montadas com cordas.
- Preflight importante escreve com consultas somente para leitura: existência da conta, saldos de ativos, estado de permissão, disponibilidade de ativos de taxas e estado do objeto alvo.
- Registre o hash da transação, a conta de autoridade, o resumo das instruções e as mudanças esperadas no estado antes de enviar.
- Tratar `Rejected`, `Expired`, e os resultados do prazo são diferentes. Um prazo significa que o cliente não observou um status final; não prova que a rede ignorou a transação.
- Após uma escrita bem-sucedida, verifique o estado resultante com um ponto de verificação de consulta ou evento que corresponda à operação do negócio.

Para a mecânica das transações, ver [Transações](/pt/blockchain/transactions.md).

## Perguntas e Eventos {#queries-and-events}

- Use consultas para os fluxos de estado e eventos atuais para notificações de mudança. Evite substituir a manipulação de eventos por consultas repetidas amplas.
- Paginear consultas iteráveis amplas, como contas, ativos e listagens de blocos.
- Preferem filtros estreitos para assinaturas e gatilhos. filtros largos são úteis para diagnóstico, mas podem adicionar execução desnecessária e processamento do lado cliente.
- Mantenha as verificações de fumo apenas para leitura separadas dos testes de transação assinados, para que a disponibilidade do ponto final seja mais fácil de diagnosticar.

Ver [Perguntas](/pt/blockchain/queries.md), [Eventos](/pt/blockchain/events.md) e [Filtros ](/pt/blockchain/filters.md).

## Desenvolvimento Assistido por Agentes {#agent-assisted-development}

- Deixe os agentes inspecionar documentos, código SDK, e estado de rede apenas para leitura antes de pedir-lhes para escrever o código da transação.
- Manter os testes de rede ao vivo opt-in atrás de uma bandeira ambiental, como `TAIRA_LIVE=1`.
- Não colar chaves privadas, material de recuperação de contas, tokens API ou cabeçalhos de autores encaminhados em instruções.
- Exigir um plano de transação antes que qualquer agente envie uma transação da rede de testes ao vivo. O plano deve nomear a rede, autoridade, instruções, ativo de taxas, leituras pré-voio, resultado esperado e comportamento de retest.

Para o fluxo de trabalho Taira MCP ver [Construir sobre SORA 3: Taira e Minamoto](/pt/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Higiene {#sdk-hygiene}

- Pin SDK e versões binárias juntas usando a Matriz de Compatibilidade [ ](/pt/reference/compatibility-matrix.md).
- Mantenha o código do cliente gerado, fragmentos e exemplos sincronizados com a revisão de espaço de trabalho upstream afixada.
- Adicione testes unitários para a construção de código de transações e testes de integração para os menores caminhos de leitura e escrita dos quais o seu aplicativo depende.
