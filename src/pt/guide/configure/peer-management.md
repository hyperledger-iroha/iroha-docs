---
translation_locale: pt
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Gerenciamento entre pares {#peer-management}

Se você seguiu qualquer um dos guias específicos da língua, agora tem uma rede bem funcionando que as pessoas vão querer juntar-se.

## Blockchain Pública {#public-blockchain}

Em uma rede aberta, a admissão de pares ainda é uma decisão de política de cadeia. Um nó pode executar o software correto e se conectar a Torii, mas só participa do consenso depois que a rede admite sua identidade de pares.

## Blockchain privada {#private-blockchain}

Em um ambiente bancário, permitir que todos se juntem ao seu tempo livre é um risco de segurança. Para a segurança, as implementações privadas Iroha geralmente definem a topologia peer em configuração e gênese em vez de confiar na descoberta aberta.

### Registo de pares {#registering-peers}

Para adicionar um peer à rede, deve ser registrado manualmente. Vamos discutir os passos que devem ser tomados para completar este processo.

#### 1. Conceder permissões ao usuário {#_1-grant-the-user-permissions}

A conta que registra o peer deve ter a correspondente `Permission`, que pode ser concedida através de uma `Role` ou como autorização direta.

Como decidir se é preciso conceder um papel? A concessão de papéis faz sentido se um usuário deve servir como um tipo de administrador, onde é sua responsabilidade manter os colegas na rede a longo prazo. Uma concessão de permissão única é útil quando a parte que registra o peer não é responsável pelo registro dos pares em geral, mas o administrador da rede não precisa (ou quer) gastar tempo na criação de um novo peer.

::: Informações

O executor padrão utiliza o token de permissão `CanManagePeers` para registrar e não registrar pares.

:::

Discutiremos as permissões e os papéis com mais detalhes em um capítulo separado [ ](/pt/blockchain/permissions.md).

#### 2. Criar um grupo de colegas {#_2-set-up-a-peer}

Depois de um novo colega ter recebido as permissões, deve ser criado.

Requer a configuração de peer atual antes de admitir um nó. Torii expõe o parâmetro do nó e os pontos finais da capacidade para este fim. Os operadores devem verificar que os timeouts, os tamanhos dos lotes e outras configurações pertinentes para o consenso correspondem à rede.

Para simplificar o processo, pode solicitar ao administrador da rede uma versão editada do `config.toml`, que exclui informações privilegiadas, como chaves privadas de pares.

#### 3. Enviar a instrução {#_3-submit-the-instruction}

Depois que o seu colega estiver a correr, deve apresentar a instrução para o registro. O colega irá passar pelo processo de aperto de mão e começar a conversar com a rede.

::: ponta

A apresentação de uma instrução de registo por pares não (e não pode) iniciar um novo processo por pares.

:::

### Pessoas sem registo {#unregistering-peers}

Por razões de segurança, este processo é unilateral. A rede chega ao consenso de que quer remover um peer, mas o próprio peer não sabe muito sobre por que ninguém está falando com ele.

Na maioria das circunstâncias, se você quiser desinscrever um colega, quer fazê-lo porque é uma falha bizantina. O simples "fantasma" deste colega torna a vida do ator malicioso da rede mais difícil.
