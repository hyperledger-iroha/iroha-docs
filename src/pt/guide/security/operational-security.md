---
translation_locale: pt
translation_source: /guide/security/operational-security.md
translation_source_hash: 042673aca63962b4b3f91e59c29bc5030ada7d63f082991899951301cb1f6887
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Segurança Operacional {#operational-security}

A segurança operacional protege as pessoas, hosts, credenciais e procedimentos em torno de uma implantação Iroha. O livro razão da blockchain registra alterações de estado aceitas. Os operadores devem proteger separadamente suas estações de trabalho, chaves de assinatura e processo de resposta a incidentes.

Use os controles abaixo como uma linha de base para implantação. Ajuste-os ao valor em risco e aos requisitos da sua organização.

## Estabelecer uma Linha de Base Operacional {#establish-an-operational-baseline}

- Mantenha um inventário de hosts de validadores, identidades de pares da rede, responsáveis pela autorização de contas, dispositivos de assinatura, endpoints públicos API e pessoas responsáveis.
- Use credenciais separadas para desenvolvimento, teste e produção. Atribua cada signatário criptográfico, token portador e chave privada a um ambiente.
- Mantenha a automação de configuração e implantação em controle de versão revisável. Injete segredos em tempo de execução do software a partir de um armazenamento de segredos aprovado ou dispositivo de assinatura.
- Registre os hashes ou as assinaturas esperados dos artefatos de lançamento. Verifique-os antes da implantação. Limite quem pode substituir binários, material de gênese, configuração ou definições de serviço.
- Aplique o princípio do menor privilégio às contas do sistema operacional, permissões Iroha e administração de rede. Conceda a cada função apenas o principal de autorização que seu trabalho necessita.
- Teste os procedimentos de backup, restauração, substituição de chaves e recuperação de pares antes do lançamento em produção.

Revise [Princípios de Segurança](./security-principles.md) e [Preparação para Lançamento](../best-practices/release-readiness.md) ao definir a linha de base.

## Proteger chaves e signatários criptográficos {#protect-keys-and-signers}

- Mantenha chaves privadas, material de semente, tokens portadores, cabeçalhos de autorização e segredos de recuperação fora do controle de versão, rastreadores de problemas, transcrições de chat, capturas de tela e documentação pública.
- Use assinatura protegida por hardware ou isolada para principais de autorização de alto valor. Mantenha o material de chave bruto fora de navegadores e processos de aplicativos de uso geral quando um cliente puder delegar a assinatura.
- Use princípios de autorização separados para transações rotineiras, governança, implantação e recuperação.
- Criptografe o armazenamento secreto e seus backups. Aplique os mesmos controles de acesso a um backup da chave privada como à chave ativa.
- Mantenha um procedimento testado de substituição ou revogação. Substitua uma chave quando a política exigir ou quando houver suspeita de exposição.
- Exigir revisão independente para alterações na participação de validadores, funções privilegiadas ou ativos de alto valor.

Veja [Gerando Chaves Criptográficas](./generating-cryptographic-keys.md) e [Armazenando Chaves Criptográficas](./storing-cryptographic-keys.md) para orientações específicas da tecla.

## Endurecer Nós e Acesso de Operador {#harden-nodes-and-operator-access}

- Execute nós e ferramentas de operador em sistemas atualmente suportados pelo fornecedor e com patches aplicados. Desative serviços desnecessários.
- Conceda acesso administrativo a operadores nomeados apenas por meio de canais auditados e criptografados.
- Coloque interfaces não públicas em uma rede privada ou [VPN](./vpn.md).
- Exponha apenas os Torii, monitoramento e rotas de aplicação exigidos pela implantação.
- Proteja cada entrada pública com limites de taxa e segurança de transporte apropriados ao ambiente.
- Proteja arquivos de configuração e credenciais de serviço com permissões de arquivo restritivas. Mantenha segredos fora de linhas de comando, listas de processos e histórico do shell.
- Separe as funções de validador, cliente, monitoramento e backup quando o modelo de risco exigir controle independente.
- Sincronize o tempo a partir de fontes confiáveis. Preserve logs suficientes do sistema, serviços e rede para investigação.

## Navegador Seguro e Fluxos de Trabalho de Administração {#secure-browser-and-admin-workflows}

Para um operador que utiliza uma interface web:

- Use um navegador totalmente atualizado e atualmente suportado pelo fornecedor em uma estação de trabalho gerenciada.
- Use um perfil de operador dedicado ou dispositivo com apenas as extensões necessárias.
- Verifique a origem e o certificado antes de aprovar uma solicitação.
- Trate domínios semelhantes, redirecionamentos inesperados e solicitações de material de chave bruto como incidentes.
- Bloquear sites e extensões não relacionadas da sessão ativa do operador.
- Use sessões de curta duração. Exija nova autenticação para ações privilegiadas.
- Mostre os detalhes da transação ao signatário criptográfico. O operador deve ser capaz de verificar o titular da autorização, a rede, as instruções, os ativos e as taxas antes da aprovação.

O isolamento do navegador reduz a exposição. Os operadores ainda devem revisar as transações e usar assinatura segura.

## Monitorar e Responder {#monitor-and-respond}

Monitore estes sinais:

- alterações na composição de validadores e pares de rede
- falhas de autorização repetidas ou instruções privilegiadas incomuns
- alterações inesperadas de software, configuração ou rota
- falhas de assinatura, consulta e transação fora do padrão normal
- exaustão de recursos, consenso paralisado ou perda de pares de rede esperados
- alterações em ativos, permissões e contas que correspondam às regras de fraude

Envie alertas para um canal independente do host afetado. Preserve logs relevantes, visualizações de dados de ponto no tempo de configuração, eventos do livro-razão blockchain e hashes criptográficos de transações com carimbos de data/hora. Veja [Monitoramento de Fraudes](./fraud-monitoring.md) e [Desempenho e Métricas](../advanced/metrics.md).

## Plano de Recuperação {#recovery-plan}

Prepare o plano de recuperação antes do lançamento da produção. O plano de recuperação deve identificar:

- quem pode declarar e coordenar um incidente
- como entrar em contato com validadores, operadores de infraestrutura, proprietários de aplicativos e usuários afetados
- quais autoridades podem revogar permissões, substituir chaves ou alterar a composição dos pares da rede
- onde binários confiáveis, configuração, registros de gênese da blockchain, backups e inventários de chaves são armazenados
- como validar a rede e os aplicativos dependentes após a recuperação

Quando um incidente ocorrer:

1. Isole o host, credencial, rota ou principal de autorização afetado. Preserve as evidências.
2. Preserve os registros e as referências do livro-razão da blockchain. Registre toda ação de recuperação.
3. Revogar ou substituir credenciais e permissões expostas através do processo de governança aprovado.
4. Restaurar software e configuração a partir de artefatos verificados.
5. Confirme a composição dos pares, a integridade do consenso, as rotas públicas, o monitoramento e as leituras das aplicações. Retome as gravações somente após a aprovação dessas verificações.
6. Documente a causa raiz. Atualize os controles, a automação e os exercícios.

::: warning

Siga procedimentos pré-revisados para ações irreversíveis no livro-razão da blockchain. Exija as aprovações apropriadas ao principal de autorização e aos ativos afetados.

:::
