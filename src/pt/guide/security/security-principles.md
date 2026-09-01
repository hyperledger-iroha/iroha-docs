---
translation_locale: pt
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Princípios de Segurança {#security-principles}

Um livro-razão blockchain Iroha verifica instruções assinadas e aplica permissões. Ele não protege chaves privadas, hosts, aplicativos, estações de trabalho do operador ou procedimentos de governança. A implementação deve proteger esses sistemas.

Use estes princípios ao projetar e operar uma rede Iroha.

## Tratar o principal de autorização como uma Fronteira de Segurança {#treat-authority-as-a-security-boundary}

- Uma pessoa ou processo que controla uma chave privada pode agir com o princípio de autorização atribuído a essa chave.
- Dê a cada ambiente e função operacional um principal de autorização separado.
- Mantenha as chaves de produção e chaves de recuperação separadas das credenciais de desenvolvimento e teste de rotina.
- Registre quem controla cada autoridade, onde seu signatário é mantido e como ele pode ser substituído ou revogado.

Veja [Criptografia de Chave Pública](./public-key-cryptography.md) e [Armazenando Chaves Criptográficas](./storing-cryptographic-keys.md).

## Aplicar o Princípio do Menor Privilégio {#apply-least-privilege}

- Conceda apenas as permissões Iroha, acesso ao host e acesso à rede necessários para uma função.
- Separe a assinatura de transações de rotina do principal de autorização de governança, implantação e recuperação.
- Exigir aprovação independente para mudanças que possam afetar a participação de validadores, permissões privilegiadas ou ativos de alto valor.
- Reveja o acesso após alterações de função e remova o acesso que não é mais necessário.

## Use Camadas de Proteção {#use-layers-of-protection}

- Proteja signatários criptográficos, aplicativos, sistemas operacionais, redes e acesso físico. Não dependa de um único controle.
- Exponha apenas as rotas Torii, de pares de rede, de monitoramento e de aplicação necessárias para a implantação.
- Use canais autenticados e criptografados para acesso administrativo e dados sensíveis.
- Mantenha os sistemas atualizados e desative os serviços que a implantação não utiliza.
- Mantenha segredos fora do controle de versão, linhas de comando, logs, tickets, chat e documentação pública.

## Tornar os Deployments Revisáveis {#make-deployments-reviewable}

- Mantenha a configuração não secreta e a automação de implantação no controle de versão.
- Revise alterações em binários, configuração, material de gênese da blockchain, associação de validadores, permissões e rotas públicas.
- Verifique os artefatos de lançamento antes da implantação. Registre as versões aprovadas e os hashes criptográficos.
- Teste a combinação exata de binário e configuração que será executada em produção.
- Preserve o comportamento determinístico da rede. A aceleração de hardware não deve alterar os resultados visíveis pelos pares.

## Monitorar e Preservar Evidências {#monitor-and-preserve-evidence}

- Monitore a saúde dos pares da rede, o progresso do consenso, alterações de permissão, instruções privilegiadas, falhas de autenticação e mudanças inesperadas de configuração.
- Envie alertas importantes para um sistema que não dependa do host afetado.
- Preserve logs relevantes, referências do registro distribuído, instantâneos da configuração e hashes de transações com marcas de tempo confiáveis.
- Trate dados de monitoramento faltantes como um problema operacional que requer investigação.

## Prepare a Recuperação Antes do Lançamento {#prepare-recovery-before-launch}

- Defina quem pode declarar um incidente e quem pode aprovar ações de recuperação.
- Testar procedimentos de backup, restauração, substituição de chave, revogação de permissões e recuperação de pares de rede.
- Mantenha artefatos de lançamento confiáveis, configurações, registros gênesis da blockchain e inventários disponíveis durante um incidente.
- Restaure leituras e monitoramento primeiro. Retome gravações apenas depois que a rede recuperada e os aplicativos dependentes passarem em suas verificações.
- Revise cada incidente e atualize controles, automação e exercícios.

::: warning

As ações no livro razão da blockchain podem ser irreversíveis. Use procedimentos previamente revisados e as aprovações necessárias antes de enviar uma transação de recuperação ou governança.

:::

Continue com [Segurança Operacional](./operational-security.md) e [Preparação para Lançamento](../best-practices/release-readiness.md).
