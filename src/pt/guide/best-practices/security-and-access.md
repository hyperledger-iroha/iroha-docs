---
translation_locale: pt
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Segurança e Acesso {#security-and-access}

A prática de segurança em Iroha deve ser baseada no princípio de autorização restrita, custódia controlada de chaves, exposição de rede explícita e alterações auditáveis.

## Guarda de Chave {#key-custody}

- Gere chaves de produção com entropia de nível de produção e armazene as chaves privadas fora de repositórios, rastreadores de problemas, prompts, registros de chat e saída CI.
- Use material de chave separado para clientes, pares de rede, assinatura de gênese da blockchain, validadores, patrocinadores de taxa e contas técnicas.
- Gire as chaves de acordo com um processo escrito e ensaie a recuperação antes de um incidente real.
- Use armazenamento com suporte de hardware ou suporte do sistema operacional para chaves de assinatura de alto valor quando o risco de implantação justificar.

Veja [Gerando Chaves Criptográficas](/pt/guide/security/generating-cryptographic-keys.md) e [Armazenando Chaves Criptográficas](/pt/guide/security/storing-cryptographic-keys.md).

## Permissões {#permissions}

- Conceda o menor token de permissão ou função que suporte o fluxo de trabalho.
- Prefira contas técnicas dedicadas para serviços, gatilhos, agentes e automação. Evite executar automação de longa duração através de uma conta de operador pessoal.
- Revise as permissões para gerenciamento de pares de rede, mutação de metadados, emissão, queima, registro de gatilhos, alterações de executor e governança SORA/Nexus antes do lançamento em produção.
- Revogar permissões temporárias após a janela de manutenção ou migração que as exigiu.

Veja [Permissões](/pt/blockchain/permissions.md) e [Tokens de Permissão](/pt/reference/permissions.md).

## Exposição de Rede {#network-exposure}

- Restringir peer-to-peer, Torii, telemetria e rotas do operador de acordo com o ambiente. O acesso público de leitura não implica acesso público de escrita ou de operador.
- Use VPNs, firewalls, proxies reversos, terminação TLS e limites de taxa onde apropriado para a implantação.
- Mantenha credenciais de autenticação básica, tokens de proxy e cabeçalhos encaminhados fora da configuração comprometida.
- Teste que clientes não autorizados não podem acessar rotas restritas.

Veja [Redes Privadas Virtuais](/pt/guide/security/vpn.md) e [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md).

## Monitoramento de Fraude e Abuso {#fraud-and-abuse-monitoring}

- Monitore eventos do livro-razão da blockchain e sinais operacionais para movimentação inesperada de ativos, concessões de permissões, alterações de gatilho, mudanças de pares na rede e transações rejeitadas repetidas.
- Preserve evidências com hashes criptográficos de transações, alturas de blocos, registros de eventos, logs e snapshots de status.
- Encaminhe alertas para a segurança, operações e proprietários de negócios responsáveis pelos ativos ou fluxos de trabalho afetados.

Veja [Monitoramento de Fraudes](/pt/guide/security/fraud-monitoring.md).

## Diretrizes de Agente e Automação {#agent-and-automation-guardrails}

- Inicie a automação com permissões somente de leitura e adicione o principal de autorização de escrita apenas após a revisão do fluxo de trabalho.
- Exigir aprovação humana explícita para mutações em rede ao vivo, a menos que a automação seja um serviço de produção deliberadamente implantado.
- Não exponha chaves privadas a prompts de agentes. Use código local que carregue segredos de variáveis de ambiente, chaveiros, signatários criptográficos de hardware ou arquivos de configuração ignorados.
- Registre decisões de automação de maneira que apoie auditorias sem vazar material secreto.
