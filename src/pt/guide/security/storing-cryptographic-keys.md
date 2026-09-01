---
translation_locale: pt
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: 168ee24e84f9225e81365658018717155476ae1508fefba5e0234e0bf6feefbd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Armazenando Chaves Criptográficas {#storing-cryptographic-keys}

Uma chave privada pode autorizar toda ação permitida ao seu principal de autorização. Nunca compartilhe uma chave privada. Proteja material de semente, segredos de recuperação, tokens portadores e arquivos de chave exportados com o mesmo cuidado.

Escolha o modelo de custódia antes do lançamento da produção. O modelo deve corresponder ao valor em risco, à política do controlador da conta e ao processo de recuperação da implantação.

## Definir o Limite de Custódia {#define-the-custody-boundary}

- Mantenha um inventário de cada principal de autorização, chave pública, algoritmo, ambiente, finalidade, responsável, local de armazenamento, backup e procedimento de substituição.
- Use chaves separadas para desenvolvimento, teste, produção, transações de rotina, governança, implantação e recuperação.
- Dê às pessoas e aos processos acesso apenas às chaves exigidas pelo seu papel.
- Exigir aprovação independente para assinaturas de alto valor ou de governança quando o modelo de risco assim exigir.
- Registre qual rede e principal de autorização um signatário criptográfico pode usar. Um serviço de assinatura deve rejeitar solicitações fora desse escopo.

## Escolha um Método de Armazenamento Apropriado {#choose-an-appropriate-storage-method}

Para desenvolvimento local, testes controlados ou uma transferência segura de custódia, uma chave pode ser exportada para um arquivo com permissão restrita. Em uma plataforma Unix suportada, gere um novo diretório de chaves com `kagami`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

O diretório pai deve existir. O destino deve ser novo ou já ser de propriedade do usuário atual, modo `0700`, livre de links simbólicos e vazio. Kagami grava `public.key` e `private.key` com o modo `0600`; `--pop` também escreve `pop.hex`. O comando falha em plataformas onde Kagami não pode impor as regras do sistema de arquivos apenas para o proprietário.

O arquivo de chave privada é uma exportação não criptografada. Mantenha-o fora do controle de versão, pastas compartilhadas, logs, tickets, chats e artefatos de compilação. Importe uma chave de produção em seu limite de custódia aprovado e, em seguida, remova a exportação de acordo com o procedimento de implantação. Não reutilize uma chave de desenvolvimento em produção.

Para produção, prefira uma fronteira de custódia auditada, como:

- um módulo de segurança de hardware ou cofre de chaves com suporte de hardware
- um sistema operacional ou cofre de chaves móvel
- um serviço de assinatura isolado
- um gerenciador de segredos que libera uma chave apenas para uma carga de trabalho autorizada

Mantenha o material de chave não exportável quando a integração selecionada suportar essa propriedade. Confirme que o sistema de custódia suporta o algoritmo e a operação de assinatura exigidos pelo principal de autorização Iroha.

A criptografia em repouso protege uma cópia armazenada. Ela não protege uma chave depois que um processo ou operador não autorizado obtém os bytes descriptografados. Reforce a segurança do host, restrinja o acesso em tempo de execução ao software e monitore a atividade de assinatura.

## Proteger Fluxos de Trabalho de Assinatura {#protect-signing-workflows}

- Use identidades de operadores nomeados, autenticação forte e acesso auditado aos sistemas de assinatura.
- Mantenha chaves brutas fora dos argumentos da linha de comando, histórico do shell, despejos de ambiente, listagens de processos, relatórios de falhas e logs de aplicativos.
- Desbloqueie um signatário criptográfico apenas para a operação necessária. Feche ou expire a sessão após o uso.
- Mostre o principal de autorização, rede, instruções, ativos e taxas antes da aprovação.
- Exigir confirmação explícita para transações privilegiadas ou de alto valor.
- Mantenha chaves privadas brutas fora das páginas do navegador e dos processos de aplicativos de uso geral quando uma integração de cliente personalizada puder delegar a assinatura.

A configuração de cliente em texto simples é adequada apenas para desenvolvimento local e testes controlados. Uma integração em produção deve obter assinaturas por meio de seu limite de custódia aprovado. O estoque Iroha CLI lê uma chave privada da configuração do cliente e não fornece um adaptador genérico para assinante externo. Clientes personalizados podem construir o hash criptográfico da carga da transação e anexar uma assinatura produzida por um signatário criptográfico externo.

## Fazer backup e recuperar chaves {#back-up-and-recover-keys}

- Faça backup apenas das chaves cuja política de recuperação exija um backup.
- Criptografe os backups e mantenha-os separados do signatário criptográfico ativo.
- Aplique os mesmos controles de acesso e aprovação a um backup como à chave ativa.
- Mantenha as credenciais de recuperação sob custódia independente quando a separação de funções for necessária.
- Testar a restauração sem expor o material-chave de produção.
- Registre e revise toda criação, acesso, restauração e destruição de backups.

Não presuma que um formato de mnemônico de carteira não relacionado possa representar uma chave privada Iroha. Use apenas um formato de recuperação suportado e testado pelo sistema de custódia selecionado.

## Substituir Chaves Expostas ou Desativadas {#replace-exposed-or-retired-keys}

Prepare a substituição antes de um incidente. O procedimento deve identificar:

1. quem pode declarar uma chave exposta ou desativada
2. como o signatário criptográfico afetado é isolado
3. como uma nova chave é gerada e colocada em custódia aprovada
4. para uma conta, como a substituição autorizada do controlador ou a recuperação social cria o `AccountId` canônico de substituição e migra o estado vinculado
5. para um nó ou par de rede, como uma rotação ou desativação de chave de consenso autorizada on-chain é coordenada com o BLS PoP, política de ativação e sobreposição, configuração de chave local, `trusted_peers_pop` e topologia de implantação
6. como configurações, aplicações e operadores dependentes adotam o novo `AccountId`, chave pública ou identidade do par de rede
7. como o principal de autorização da chave antiga é removido e suas cópias são arquivadas ou destruídas
8. como a rede e os aplicativos dependentes são verificados posteriormente

::: warning

A criptografia ou uma nova senha não podem tornar uma chave privada copiada segura novamente. Quando houver suspeita de exposição, pare de usar a chave e siga o procedimento aprovado de substituição ou revogação.

:::

Veja [Gerando Chaves Criptográficas](./generating-cryptographic-keys.md), [Segurança Operacional](./operational-security.md) e [Princípios de Segurança](./security-principles.md).
