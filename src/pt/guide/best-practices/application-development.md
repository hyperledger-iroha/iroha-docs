---
translation_locale: pt
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Desenvolvimento de Aplicativos {#application-development}

Iroha as aplicações devem tornar o comportamento de transação explícito, manter o estado de assinatura contido e usar consultas e eventos de maneiras que sejam fáceis de observar em produção.

## Configuração do Cliente {#client-setup}

- Armazene a configuração do cliente fora do código-fonte da aplicação. Carregue o ID da cadeia, Torii URL, a conta de assinatura e as configurações de transação a partir da configuração específica do ambiente.
- Mantenha os arquivos `client.toml` separados para localnet, Taira, Minamoto e redes privadas. Um signatário criptográfico do testnet copiado nunca deve se tornar um signatário criptográfico do mainnet.
- Defina os tempos de vida das transações e os tempos limite de status deliberadamente. Um tempo de vida muito curto pode expirar com oscilações normais da rede, enquanto um muito longo pode dificultar a compreensão de envios duplicados.
- Use `nonce = true` apenas quando transações repetidas devem ter hashes criptográficos distintos. Para operações comerciais idempotentes, armazene e reutilize um ID de solicitação de aplicativo para que as tentativas possam ser rastreadas.

Consulte [Configuração do Cliente](/pt/guide/configure/client-configuration.md) para os campos atuais de TOML.

## Transações {#transactions}

- Construa transações a partir de instruções digitadas SDK sempre que possível, em vez de cargas JSON brutas ou montadas em strings.
- Preflight importante escreve com consultas somente de leitura: existência da conta, saldos de ativos, estado de permissão, disponibilidade de ativo de taxa e estado do objeto alvo.
- Registre o hash criptográfico da transação, a conta principal de autorização, o resumo da instrução e a mudança de estado esperada antes de enviar.
- Trate `Rejected`, `Expired` e resultados de tempo esgotado de maneira diferente. Um tempo esgotado significa que o cliente não observou um status final; isso não prova que a rede ignorou a transação.
- Após uma gravação bem-sucedida, verifique o estado resultante com uma consulta ou ponto de verificação de evento que corresponda à operação comercial.

Para a mecânica da transação, veja [Transações](/pt/blockchain/transactions.md).

## Consultas e Eventos {#queries-and-events}

- Use consultas para o estado atual e fluxos de eventos para notificações de mudança. Evite substituir o tratamento de eventos por consultas amplas repetidas.
- Paginar consultas iteráveis amplas, como listagens de contas, ativos e blocos.
- Prefira filtros estreitos para assinaturas e gatilhos. Filtros amplos são úteis para diagnóstico, mas podem adicionar execução desnecessária e processamento no lado do cliente.
- Mantenha as verificações rápidas somente leitura separadas dos testes de transações assinadas para facilitar o diagnóstico da disponibilidade do endpoint da API.

Veja [Consultas](/pt/blockchain/queries.md), [Eventos](/pt/blockchain/events.md) e [Filtros](/pt/blockchain/filters.md).

## Desenvolvimento Assistido por Agente {#agent-assisted-development}

- Permita que os agentes inspecionem documentos, código SDK e o estado da rede apenas leitura antes de pedir que escrevam código de transação.
- Mantenha os testes em rede ao vivo como opt-in atrás de uma flag de ambiente, como `TAIRA_LIVE=1`.
- Não cole chaves privadas, material de recuperação de conta, tokens API ou cabeçalhos de autenticação encaminhados nos prompts.
- Exigir um plano de transação antes que qualquer agente envie uma transação de teste ao vivo na testnet. O plano deve nomear a rede, o principal de autorização, as instruções, o ativo de taxa, as leituras prévias, o resultado esperado e o comportamento de nova tentativa.

Para o fluxo de trabalho Taira MCP, veja [Construir em SORA 3: Taira e Minamoto](/pt/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Higiene {#sdk-hygiene}

- Fixe SDK e versões binárias juntas usando o [Matriz de Compatibilidade](/pt/reference/compatibility-matrix.md).
- Mantenha o código do cliente gerado, trechos e exemplos sincronizados com a revisão de workspace upstream fixada.
- Adicione testes de unidade para o código de construção de transações e testes de integração para os menores caminhos de leitura e escrita dos quais sua aplicação depende.
