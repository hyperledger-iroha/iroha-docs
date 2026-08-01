---
translation_locale: pt
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Armazenamento de chaves criptográficas {#storing-cryptographic-keys}

Uma chave privada pode autorizar todas as ações permitidas à sua autoridade. Nunca compartilhe uma chave privada. Proteja material de semente, segredos de recuperação, tokens do portador e arquivos de chave exportados com o mesmo cuidado.

Escolha o modelo de custódia antes da entrada em produção. O modelo deve corresponder ao valor em risco, à política do controlador da conta e ao processo de recuperação da implantação.

## Defina o limite da custódia {#define-the-custody-boundary}

- Mantenha um inventário de cada autoridade, chave pública, algoritmo, ambiente, finalidade, custodiante, local de armazenamento, backup e procedimento de substituição.
- Use chaves separadas para desenvolvimento, testes, produção, transações rotineiras, governança, implantação e recuperação.
- Dê às pessoas e aos processos acesso apenas às chaves exigidas por suas funções.
- Exija aprovação independente para assinaturas de alto valor ou de governança quando o modelo de risco assim exigir.
- Registre qual rede e autoridade cada signatário pode usar. Um serviço de assinatura deve recusar solicitações fora desse escopo.

## Escolha um método adequado de armazenamento {#choose-an-appropriate-storage-method}

Para desenvolvimento local, testes controlados ou uma transferência segura para custódia, uma chave pode ser exportada para um arquivo com permissões restritas. Em uma plataforma Unix compatível, gere um novo diretório de chaves com `kagami`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

O diretório pai deve existir. O destino deve ser novo ou já pertencer ao usuário atual, ter o modo `0700`, não conter links simbólicos e estar vazio. O Kagami grava `public.key` e `private.key` com o modo `0600`; `--pop` também grava `pop.hex`. O comando falha em plataformas nas quais o Kagami não consegue aplicar as regras do sistema de arquivos que limitam o acesso ao proprietário.

O arquivo de chave privada é uma exportação não criptografada. Mantenha-o fora do controle de versão, de pastas compartilhadas, logs, tíquetes, chats e artefatos de compilação. Importe uma chave de produção para seu limite de custódia aprovado e remova a exportação de acordo com o procedimento da implantação. Não reutilize uma chave de desenvolvimento em produção.

Para produção, prefira um limite de custódia auditado, como:

- um módulo de segurança de hardware ou um armazenamento de chaves respaldado por hardware
- um armazenamento de chaves do sistema operacional ou de dispositivo móvel
- um serviço de assinatura isolado
- um gerenciador de segredos que libera uma chave apenas para uma carga de trabalho autorizada

Mantenha o material da chave não exportável quando a integração selecionada oferecer esse recurso. Confirme que o sistema de custódia oferece suporte ao algoritmo e à operação de assinatura exigidos pela autoridade do Iroha.

A criptografia em repouso protege uma cópia armazenada. Ela não protege a chave depois que um processo ou operador não autorizado obtém os bytes descriptografados. Reforce a segurança do host, restrinja o acesso em tempo de execução e monitore a atividade de assinatura.

## Proteja os fluxos de trabalho de assinatura {#protect-signing-workflows}

- Use identidades de operador nominais, autenticação forte e acesso auditado aos sistemas de assinatura.
- Mantenha as chaves brutas fora dos argumentos de linha de comando, do histórico do shell, dos despejos de ambiente, das listagens de processos, dos relatórios de falha e dos logs das aplicações.
- Desbloqueie um signatário apenas para a operação necessária. Feche a sessão ou deixe-a expirar após o uso.
- Mostre a autoridade, a rede, as instruções, os activos e as taxas antes da aprovação.
- Exigir confirmação explícita para transações de valor elevado ou privilegiadas.
- Mantenha as chaves privadas em bruto fora das páginas do navegador e dos processos de aplicação de finalidade geral quando uma integração de cliente personalizada pode delegar a assinatura.

A configuração do cliente em texto simples é adequada apenas para desenvolvimento local e testes controlados. Uma integração de produção deve obter assinaturas por meio de seu limite de custódia aprovado. A CLI padrão do Iroha lê uma chave privada da configuração do cliente e não fornece um adaptador genérico para signatários externos. Clientes personalizados podem construir o hash da carga útil da transação e anexar uma assinatura produzida por um signatário externo.

## Faça backup e recupere as chaves {#back-up-and-recover-keys}

- Faça backup apenas das chaves cuja política de recuperação o exigir.
- Criptografe os backups e mantenha-os separados do signatário ativo.
- Aplique aos backups os mesmos controles de acesso e aprovação usados para a chave ativa.
- Mantenha as credenciais de recuperação sob custódia independente quando for necessária a separação de funções.
- Teste a restauração sem expor o material das chaves de produção.
- Registre e revise cada criação, acesso, restauração e destruição de backup.

Não presuma que o formato mnemônico de uma carteira não relacionada possa representar uma chave privada do Iroha. Use apenas um formato de recuperação compatível e testado pelo sistema de custódia selecionado.

## Substituir as chaves expostas ou retiradas {#replace-exposed-or-retired-keys}

Prepare a substituição antes de um incidente. O procedimento deve identificar:

1. quem pode declarar uma chave exposta ou desativada
2. como o signatário afetado é isolado
3. como uma nova chave é gerada e colocada sob custódia aprovada
4. para uma conta, como a substituição autorizada do controlador ou a recuperação social cria o `AccountId` canônico substituto e migra o estado associado
5. para um nó ou par, como uma rotação ou desativação autorizada na cadeia da chave de consenso é coordenada com a BLS PoP, a política de ativação e sobreposição, a configuração da chave local, `trusted_peers_pop` e a topologia da implantação
6. como as configurações, aplicações e operadores dependentes adotam o novo `AccountId`, a chave pública ou a identidade do par
7. como a autoridade da chave antiga é removida e suas cópias são arquivadas ou destruídas
8. como a rede e as aplicações dependentes são verificadas posteriormente

::: warning

A criptografia ou uma nova senha não podem tornar a chave privada copiada segura novamente. Quando for suspeita de exposição, pare de usar a chave e siga o procedimento aprovado para substituição ou revogação.

:::

Veja [Generar Chaves Criptográficas](./generating-cryptographic-keys.md), [Segurança operacional](./operational-security.md) e [Princípios de segurança](./security-principles.md).
