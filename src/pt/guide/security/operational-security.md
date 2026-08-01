---
translation_locale: pt
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Segurança operacional {#operational-security}

A segurança operacional protege as pessoas, os anfitriões, credenciais e procedimentos em torno de uma implantação Iroha. Os registos de contabilidade aceitaram mudanças do estado. Os operadores devem assegurar separadamente as suas estações de trabalho, as chaves de assinatura e o processo de resposta a incidentes.

Use os controles abaixo como uma linha de base para a implantação. Ajuste-os ao valor em risco e aos requisitos da sua organização.

## Estabelecer uma linha de base operacional {#establish-an-operational-baseline}

- Manter um inventário dos anfitriões de validadores, identidades de pares, autoridades de conta, dispositivos de assinatura, endpoints públicos e pessoas responsáveis.
- Use credenciais separadas para desenvolvimento, teste e produção. atribuir cada assinante, token portador e chave privada a um ambiente.
- Mantenha a configuração e a automação da implementação no controle de versão revisavel. Injecte segredos em tempo de execução de uma loja secreta aprovada ou dispositivo de assinatura.
- Registre os hashes ou assinaturas esperados de artefatos de lançamento. Verifique-os antes da implantação. Limite quem pode substituir binários, material de geração, configuração ou definições de serviço.
- Aplicar menos privilégios para contas do sistema operacional, permissões Iroha e administração de rede. Concede a cada papel apenas a autoridade que o seu trabalho precisa.
- Teste os procedimentos de backup, restauração, substituição de chaves e recuperação de pares antes do lançamento em produção.

Revisão [Princípios de segurança](./security-principles.md) e [Preparação para a liberação](../best-practices/release-readiness.md) ao definir a linha de base.

## Proteja as chaves e os assinantes {#protect-keys-and-signers}

- Mantenha chaves privadas, material de semente, tokens do portador, cabeçalhos de autorização e segredos de recuperação fora do controle da fonte, rastreadores de emissões, transcrições de bate-papo, capturas de tela e documentação pública.
- Usar assinaturas de hardware ou isoladas para autoridades de alto valor. Mantenha a matéria-prima da chave fora dos navegadores e dos processos de aplicação de finalidade geral quando um cliente pode delegar assinaturas.
- Usar autoridades separadas para transações de rotina, governança, implantação e recuperação.
- Criptografar o armazenamento secreto e os seus backups. Aplicar os mesmos controles de acesso a um backup de chave privada como para a chave ao vivo.
- Manter um procedimento de substituição ou revogação testado. Substituir uma chave quando a política exigir ou quando suspeitar de exposição.
- Exigir uma revisão independente para alterações na adesão ao validador, funções privilegiadas ou ativos de alto valor.

Veja . [Geração de chaves criptográficas](./generating-cryptographic-keys.md) e [Armazenamento de chaves criptográficas](./storing-cryptographic-keys.md) para orientações específicas de chaves.

## Harden Nodes e Acesso do Operador {#harden-nodes-and-operator-access}

- Execute nós e ferramentas do operador em sistemas atualmente suportados pelo fornecedor. Desligue serviços desnecessários.
- Dar acesso administrativo aos operadores designados somente através de canais auditados e criptografados.
- Colocar interfaces não públicas em uma rede privada ou [VPN](./vpn.md).
- Expor apenas as rotas Torii, de monitoramento e de aplicação necessárias para a implantação.
- Proteger todas as entradas do público com limites de tarifas e segurança dos transportes adequados ao ambiente.
- Proteja arquivos de configuração e credenciais de serviço com permissões restritivas de arquivo. Mantenha segredos fora das linhas de comando, listagens de processos e histórico de shell.
- Funções de validador, cliente, monitoramento e backup separadas quando o modelo de risco requer um controlo independente.
- Sincronizar o tempo de fontes confiáveis. Preservar registos suficientes do sistema, serviço e rede para investigação.

## Fluxos de trabalho de navegador e administrador seguros {#secure-browser-and-admin-workflows}

Para um operador que utiliza uma interface web:

- Use um navegador totalmente atualizado com suporte de fornecedor em uma estação de trabalho gerenciada.
- Use um perfil ou dispositivo de operador dedicado com apenas extensões necessárias.
- Verificar a origem e o certificado antes de aprovar um pedido.
- Tratar domínios semelhantes, redirecionamentos inesperados e pedidos de matéria-prima chave como incidentes.
- Bloquear os sites e extensões não relacionados da sessão do operador ativo.
- Usar sessões de curta duração. Requer reautenticação para ações privilegiadas.
- Mostre os detalhes da transação ao signatário. O operador deve conseguir verificar a autoridade, a rede, as instruções, os ativos e as taxas antes da aprovação.

O isolamento do navegador reduz a exposição. Os operadores ainda devem rever as transações e usar assinaturas seguras.

## Monitoração e resposta {#monitor-and-respond}

Monitorar estes sinais:

- Mudanças no número de validadores e membros dos pares
- falhas de autorização repetidas ou instruções privilegiadas incomuns
- mudanças inesperadas de software, configuração ou rota
- falhas de assinatura, consulta e transação fora da linha de base normal
- Esgotamento de recursos, paralisação do consenso ou perda de colegas esperados
- mudanças de activos, permissões e contas que correspondam às regras de fraude

Enviar alertas para um canal independente do hospedeiro afetado. Preservar registros relevantes, instantâneos de configuração, eventos do livro maior e hashes de transações com timestamps. Veja [Monitorização de fraudes](./fraud-monitoring.md) e [Performance and Metrics ](../advanced/metrics.md).

## Plano de recuperação {#recovery-plan}

Preparar o plano de recuperação antes do lançamento da produção.

- Quem pode declarar e coordenar um incidente
- Como entrar em contato com os validadores, operadores de infraestrutura, proprietários de aplicações e utilizadores afetados
- que as autoridades podem revogar permissões, substituir chaves ou alterar a associação de pares
- onde são armazenados binários de confiança, configuração, registros genéticos, backups e inventários de chaves.
- como validar a rede e as aplicações dependentes após a recuperação

Quando ocorre um incidente:

1. Isole o host, a credencial, a rota ou a autoridade afetados. Preserve as provas.
2. Preserva registos e referências do livro, grava todas as ações de recuperação.
3. Revocar ou substituir as credenciais e autorizações expostas através do processo de governação aprovado.
4. Restaurar software e configuração a partir de artefatos verificados.
5. Confirme a associação de pares, a integridade do consenso, as rotas públicas, a monitorização e as leituras da aplicação. Retome as operações de escrita apenas depois de estas verificações passarem.
6. Documentar a causa raiz. Atualizar os controles, automação e exercícios.

::: warning

Seguir procedimentos previamente revisados para ações de contabilidade irreversíveis e exigir as aprovações adequadas à autoridade e aos activos afectados.

:::
