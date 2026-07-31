---
translation_locale: pt
translation_source: /guide/best-practices/security-and-access.md
translation_source_hash: f0163734d618d91337b437da703743014d01c57c4cb603fbc2e66316f3654779
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Segurança e acesso {#security-and-access}

As práticas de segurança em Iroha devem basear-se na autoridade restrita, na custódia controlada das chaves, na exposição explícita à rede e nas alterações auditáveis.

## Custódia-chave {#key-custody}

- Gerar chaves de produção com entropia de nível de produção e armazenar chaves privadas fora dos repositórios, emitir rastreadores, pedidos, logs de bate-papo e saída CI.
- Use material de chave separado para clientes, colegas, assinatura da Gênesis, validadores, patrocinadores de taxas e contas técnicas.
- Rodar as teclas de acordo com um processo escrito e ensaio de recuperação antes de um incidente ao vivo.
- Utilize armazenamento suportado por hardware ou por sistema operacional para chaves de assinatura de alto valor quando o risco de implantação o justifique.

Veja [Generar Chaves Criptográficas](/pt/guide/security/generating-cryptographic-keys.md) e [ armazenar Chaves Cryptográficas ](/pt/guide/security/storing-cryptographic-keys.md).

## Permissões {#permissions}

- Concede o menor token ou papel de permissão que suporta o fluxo de trabalho.
- Preferir contas técnicas dedicadas para serviços, gatilhos, agentes e automação. Evite executar automação de longa duração através de uma conta de operador pessoal.
- Permissões de revisão para gestão por pares, mutação de metadados, moagem, queima, registo do gatilho, mudanças no executor e governança SORA/Nexus antes do lançamento da produção.
- Revocar as autorizações temporárias após a janela de manutenção ou a migração que as exigia.

Veja [Permissões](/pt/blockchain/permissions.md) e [Token de Permissão](/pt/reference/permissions.md).

## Exposição à rede {#network-exposure}

- Restringir as rotas de peer-to-peer, Torii, telemetria e operador de acordo com o ambiente.
- Utilize VPNs, firewalls, proxies reversais, terminação TLS e limites de taxa quando apropriado para a implantação.
- Mantenha as credenciais de autor básicas, os tokens proxy e os cabeçalhos encaminhados fora da configuração comprometida.
- Teste de que os clientes não autorizados não podem chegar a rotas restritas.

Ver [Redes privadas virtuais ](/pt/guide/security/vpn.md) e [Torii Pontos de fim ](/pt/reference/torii-endpoints.md).

## Monitorização de fraudes e abusos {#fraud-and-abuse-monitoring}

- Monitorar eventos do livro-razão e sinais operacionais para movimentos inesperados de ativos, concessões de permissões, alterações de desencadeamento, mudanças de pares e transações repetidas rejeitadas.
- Preserve evidências com hashes de transação, altitudes de blocos, registros de eventos, logs e snapshots de status.
- Alertas de rota para os responsáveis pela segurança, operações e empresários pelos ativos ou fluxos de trabalho afectados.

Ver [Monitorização de fraudes ](/pt/guide/security/fraud-monitoring.md).

## Rodas de vigilância de agentes e de automação {#agent-and-automation-guardrails}

- Inicie a automação com permissões somente para leitura e adicione autorização de escrita apenas após o fluxo de trabalho ser revisto.
- Exigir a aprovação humana explícita para mutações em rede ao vivo, salvo se a automação for um serviço de produção deliberadamente implantado.
- Não exponha as chaves privadas às solicitações do agente. Use o código local que carrega segredos de variáveis ambientais, cadeias de chaves, assinantes de hardware ou arquivos de configuração ignorados.
- As decisões de automação do registro de uma forma que apoie as auditorias sem vazamento de material secreto.
