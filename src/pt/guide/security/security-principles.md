---
translation_locale: pt
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Princípios de segurança {#security-principles}

Um livro-razão Iroha verifica instruções assinadas e aplica permissões. Não protege chaves privadas, hosts, aplicativos, estações de trabalho do operador ou procedimentos de governança. A implantação deve proteger esses sistemas.

Usar estes princípios na concepção e operação de uma rede Iroha.

## Trate a autoridade como um limite de segurança {#treat-authority-as-a-security-boundary}

- Uma pessoa ou um processo que controla uma chave privada pode agir com a autoridade atribuída a essa chave.
- Dar a cada ambiente e a cada função operacional uma autoridade separada.
- Manter as chaves de produção e de recuperação separadas das credenciais de desenvolvimento de rotina e de ensaio.
- Registre quem é o titular de cada autoridade, onde seu signatário é mantido e como essa autoridade pode ser substituída ou revogada.

Consulte [Criptografia de chave pública](./public-key-cryptography.md) e [Armazenamento de chaves criptográficas](./storing-cryptographic-keys.md).

## Aplique o mínimo de privilégio {#apply-least-privilege}

- Conceder apenas as permissões Iroha, o acesso ao host e o acesso à rede necessários para um papel.
- Separe a assinatura de transações rotineiras das autoridades de governança, implantação e recuperação.
- Exija aprovação independente para alterações que possam afetar a composição dos validadores, permissões privilegiadas ou ativos de alto valor.
- Revisar o acesso após mudanças de função e remover o acesso que não é mais necessário.

## Usar camadas de proteção {#use-layers-of-protection}

- Proteja os signatários, os aplicativos, os sistemas operacionais, as redes e o acesso físico. Não dependa de um único controle.
- Expor apenas as rotas Torii, peer, monitoramento e aplicação necessárias para a implantação.
- Use canais autenticados e criptografados para acesso administrativo e dados confidenciais.
- Mantenha os sistemas parcheados e desative os serviços que a implantação não utiliza.
- Mantenha os segredos fora do controle de código-fonte, das linhas de comando, dos registros, dos tíquetes, do chat e da documentação pública.

## Faça com que as implementações sejam revistas {#make-deployments-reviewable}

- Mantenha a configuração não secreta e a automação da implantação no controle de versão.
- Revise alterações em binários, configuração, material de gênese, composição dos validadores, permissões e rotas públicas.
- Verifique os artefatos de liberação antes da implantação. Registre as versões aprovadas e hashes.
- Teste a combinação binária e de configuração exata que será executada na produção.
- Preservar o comportamento determinista da rede. A aceleração do hardware não deve alterar os resultados visíveis aos pares.

## Supervisão e preservação de provas {#monitor-and-preserve-evidence}

- Monitorar a saúde dos pares, o progresso do consenso, mudanças de permissões, instruções privilegiadas, falhas de autenticação e alterações inesperadas de configuração.
- Enviar alertas importantes a um sistema que não dependa do hospedeiro afetado.
- Preserve registros relevantes, referências do livro-razão, instantâneos de configuração e hashes de transações com carimbos de tempo confiáveis.
- Tratar os dados de monitoramento faltantes como um problema operacional que exige investigação.

## Prepare a recuperação antes do lançamento {#prepare-recovery-before-launch}

- Definir quem pode declarar um incidente e quem pode aprovar ações de recuperação.
- Teste backup, restauração, substituição de chaves, revogação de permissões e procedimentos de recuperação por pares.
- Mantenha artefatos de libertação confiáveis, configuração, registros de gênese e inventários disponíveis durante um incidente.
- Restaure primeiro as leituras e o monitoramento. Retome as escritas somente depois que a rede recuperada e os aplicativos dependentes passarem por suas verificações.
- Revise cada incidente e atualize os controles, a automação e os exercícios.

::: warning

As acções do livro-razão podem ser irreversíveis. Utilize procedimentos previamente revisados e as aprovações necessárias antes de apresentar uma transacção de recuperação ou governança.

:::

Continuar com [Segurança operacional](./operational-security.md) e [Readiness de libertação](../best-practices/release-readiness.md).
