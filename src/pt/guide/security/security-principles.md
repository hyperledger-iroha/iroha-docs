---
translation_locale: pt
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Princípios de segurança {#security-principles}

As organizações e os utilizadores individuais têm de trabalhar em conjunto para garantir interações seguras com as instalações Iroha. Este tópico explica os princípios básicos da cooperação.

## Princípios gerais de segurança {#general-security-principles}

1. Utilize uma rede privada virtual [ ](./vpn.md) (VPN):

    - Sempre que acessar dados ou recursos sensíveis, especialmente através de redes públicas, utilize uma <abbr title="Virtual Private Network">VPN</abbr> para estabelecer uma conexão segura que proteja as suas informações.

2. Use um firewall para a proteção da rede:

    - Fortalecer as redes domésticas e/ou de escritório criando um firewall que ajuda a combater o acesso não autorizado e proteger os dispositivos conectados contra vírus e malware.

3. Informações físicas e digitais seguras:

    - Proteger documentos físicos que contenham informações confidenciais num local seguro e garantir que os documentos digitais sejam criptografados e armazenados em pastas protegidas por senha.

4. Manter um backup regular de dados:

    - Tenha sempre cópias de suas informações importantes armazenadas em um lugar seguro. Dessa forma, se você perder seus dados ou algo der errado, você pode rapidamente recuperar tudo no caminho certo. Mantenha esses backups em um lugar diferente e seguro do que normalmente mantém os seus dados.

## Princípios de segurança para usuários individuais {#security-principles-for-individual-users}

1. Adotar regras robustas de autenticação:

    - Use senhas fortes e únicas para todas as contas.

    - Nunca reutilize senhas.

    - Configure o <abbr title="Two-Factor Authentication">2FA</abbr> sempre que possível. O <abbr title="Two-Factor Authentication">2FA</abbr> melhora a segurança geral, não só exigindo uma senha, mas também um fator adicional como um <abbr title="One-Time Password">OTP </abbr>, impressão digital ou uma autenticação baseada em aplicativos de terceiros (por exemplo, Google Authenticator).

    - Evite usar a autenticação SMS como segundo fator. Não há garantia de que o software malicioso não esteja monitorando todas as suas mensagens SMS. Por exemplo, os aplicativos Android não podem limitar-se apenas ao acesso às mensagens especificamente destinadas para eles.

2. Exerça precaução na comunicação digital: - Configure um cliente de e-mail para assinar e verificar as assinaturas de todos os emails recebidos. - Desativar ambas as mensagens HTML e o carregamento de recursos externos a partir de endereços desconhecidos ou não verificados.

    - Aprenda sobre técnicas de phishing comuns para reconhecer e evitar emails suspeitos, links e solicitações de informações pessoais.

    - Configure um cliente de e-mail para assinar e verificar as assinaturas de todos os e-mails recebidos. Embora seja possível simular o endereço do remetente e até mesmo fingir ser um banco, não é possível falsificar uma assinatura.

3. Proteção das informações pessoais:

    - Quando se comunica com pessoas desconhecidas, especialmente por telefone ou on-line, tenha cuidado em não compartilhar informações privadas.

    - Considere pesquisar independentemente os indivíduos ou organizações com quem você está se comunicando para confirmar a legitimidade de sua identidade.

    - Tenha cuidado com as informações pessoais que compartilha nas redes sociais, pois partes maliciosas podem explorar essas informações.

## Princípios de segurança para as organizações {#security-principles-for-organisations}

1. Estabelecer políticas e procedimentos de segurança claros:

    - Desenvolver políticas e protocolos de segurança bem definidos para todos os funcionários que lidam com dados confidenciais. Treinar minuciosamente os funcionários a respeitar estas diretrizes, mitigando o risco de ações negligentes.

    - Assegurar que as políticas de segurança sejam acessíveis a todos os funcionários e que sejam revisadas e atualizadas regularmente para refletir as mudanças no panorama da segurança.

    - Fornecer às políticas de segurança exemplos e cenários para torná-las mais compreensíveis e práticas para os funcionários.

2. Cultivar a conscientização dos empregados:

    - Educar os funcionários sobre dados e medidas de segurança operacional.A conscientização aumentada e uma formação abrangente são fundamentais para reforçar a segurança organizacional.

    - Incentive os funcionários a relatarem imediatamente quaisquer atividades suspeitas ou preocupações com a segurança.

3. Proteger a infraestrutura física:

    - Restringir o acesso físico aos servidores e infraestruturas. Configurar controles de acesso que permitam apenas a entrada de pessoal autorizado em áreas restritas.

    - Assegurar que as medidas de controlo de acesso sejam revisadas e atualizadas regularmente para se adaptarem às necessidades em constante evolução da segurança.

    - Considere implementar controles de acesso biométricos para áreas sensíveis, a fim de aumentar a segurança física.

4. Implementar o controlo da segurança:

    - Implementar um sistema abrangente de monitorização da segurança que examine as atividades e identifique possíveis violações à segurança.

    - Implementar alertas automatizadas para notificar imediatamente o pessoal de segurança sobre quaisquer atividades incomuns ou não autorizadas.

    - Considere o uso de algoritmos de aprendizagem automática para melhorar a capacidade do sistema de detectar anomalias e potenciais ameaças.

    - Empregar pessoal ou designar pessoal para supervisionar a segurança da base de dados, identificar, rastrear e resolver vulnerabilidades do software e realizar verificações regulares em máquinas críticas para verificar a presença de software não autorizado não incluído na lista aprovada.

5. Realizar auditorias de segurança recorrentes:

    - Realizar auditorias de segurança rotineiras para avaliar as vulnerabilidades e confirmar que as medidas de segurança estabelecidas estão alinhadas com as normas e regulamentos comuns.

    - Considere contratar especialistas externos em segurança para avaliações periódicas, a fim de obter uma avaliação imparcial da condição de segurança da organização.

6. Implementar um sistema de controlo de acesso:

    - Estabelecer um sistema de controlo de acesso baseado em funções para garantir que os trabalhadores tenham apenas acesso aos recursos e informações necessários às suas funções.

7. Abraçem a melhoria contínua:

    - Reconhecer que a segurança é um processo contínuo. Manter uma avaliação contínua das medidas de segurança e reforçá-las proativamente para abordar as ameaças e desafios emergentes.

    - Considere estabelecer um ciclo de feedback que encoraje os funcionários a contribuir com sugestões de melhoria da segurança, promovendo a cultura do melhoramento contínuo.
