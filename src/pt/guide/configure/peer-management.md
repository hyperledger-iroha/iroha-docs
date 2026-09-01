---
translation_locale: pt
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Gerenciamento de pares de rede {#peer-management}

Se você seguiu qualquer um dos guias específicos de idioma, agora você tem uma rede bem funcional que as pessoas vão querer entrar.

## Blockchain Público {#public-blockchain}

Em uma rede aberta, a admissão de pares de rede ainda é uma decisão de política da cadeia. Um nó pode executar o software correto e se conectar a Torii, mas só participa do consenso depois que a rede admite sua identidade de par de rede.

## Blockchain Privada {#private-blockchain}

Em um ambiente bancário, permitir que todos participem à vontade é um risco de segurança. Para segurança, implantações privadas Iroha geralmente fixam a topologia dos pares da rede na configuração e no gênese do blockchain em vez de confiar na descoberta aberta.

### Registrando pares de rede {#registering-peers}

Para adicionar um par à rede, registre-o manualmente. Veja a seguir as etapas necessárias para concluir esse processo.

#### 1. Conceda permissões ao usuário {#_1-grant-the-user-permissions}

A conta que registra o par de rede deve ter o `Permission` apropriado. Isso pode ser concedido através de um `Role` ou como uma concessão direta de permissão.

Conceda uma função quando uma conta gerenciar pares de rede ao longo do tempo. Use uma concessão de permissão direta para um registro único por uma conta que não gerencia pares de rede de outra forma.

::: info

O executor padrão usa o token de permissão `CanManagePeers` para registrar e desregistrar pares de rede.

:::

Discutimos permissões e funções com mais detalhes em um [capítulo separado](/pt/blockchain/permissions.md).

#### 2. Configurar um par de rede {#_2-set-up-a-peer}

Após um novo par de rede receber permissões, ele deve ser configurado.

Solicite a configuração atual de pares da rede antes de admitir um nó. Torii expõe o parâmetro do nó e os endpoints de capacidade API para esse propósito. A inicialização do par de rede não negocia esses valores automaticamente: os operadores devem verificar se os tempos limite, tamanhos de lote e outras configurações relevantes para o consenso correspondem à rede.

Para simplificar o processo, você pode pedir ao administrador da rede uma versão editada de `config.toml`, que exclui informações privilegiadas, como chaves privadas de pares da rede.

#### 3. Enviar a instrução {#_3-submit-the-instruction}

Depois que seu par de rede estiver em execução, você deve enviar a instrução de registro do par. O par de rede passará pelo processo de handshake e começará a se comunicar com a rede.

::: tip

Enviar uma instrução de registro de par de rede não cria (e não pode criar) um novo processo de par de rede.

:::

### Cancelando o registro de pares de rede {#unregistering-peers}

E quanto a cancelar o registro de pares de rede? Por razões de segurança, esse processo é unilateral. A rede chega a um consenso de que quer remover um par de rede, mas o próprio par de rede não sabe muito sobre por que ninguém está falando com ele.

Na maioria das circunstâncias, se você quer cancelar o registro de um par de rede, você quer fazer isso porque ele é uma falha bizantina. Apenas 'ignorar' este par de rede torna a vida do ator malicioso na rede mais difícil.
