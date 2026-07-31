---
translation_locale: pt
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Armazenamento de chaves criptográficas {#storing-cryptographic-keys}

Os seus dados confidenciais só permanecem privados se adotarem práticas <abbr title="Operational Security">OPSEC</abbr> para proteger as chaves criptográficas. Tenha sempre cuidado e evite compartilhar a sua chave privada, tratando-a como se as suas chaves de apartamento fossem reservadas apenas para pessoas de confiança.

Para obter mais informações sobre <abbr title="Operational Security">OPSEC</abbr> e as suas melhores práticas, ver [Segurança operacional ](./operational-security).

## Armazenamento digital de chaves criptográficas {#storing-cryptographic-keys-digitally}

Quando se trata de proteger as chaves criptográficas digitalmente, principalmente apenas duas abordagens[SSH](https://www.ssh.com/) e [GPG](https://www.gnupg.org/) estão disponíveis. Estes métodos fornecem camadas de segurança para evitar acesso não autorizado às suas chaves cripto.

Muitas decisões arquitetônicas Iroha foram influenciadas pelos princípios do protocolo Secure Shell (`SSH`, por isso, esta secção se concentra principalmente na abordagem `SSH`, Oferecer instruções sobre como implementar de forma eficaz o protocolo para armazenar as suas chaves criptográficas no ecossistema Iroha.

### Utilizando o agente SSH e SSH {#using-ssh-and-ssh-agent}

Secure Shell Protocol (`SSH`) é um protocolo de rede criptográfica que serve como um gateway virtual, permitindo acesso seguro a máquinas remotas através de redes potencialmente não tão seguras usando credenciais de acesso de chaves SSH. Proporciona uma maneira eficiente de interagir remotamente com os sistemas sem a necessidade de presença física. Neste contexto, `SSH` oferece dois mecanismos primários de autenticação: a abordagem convencional baseada em senhas e o método mais seguro do par de chaves público-privado.

Para obter mais informações sobre `SSH`, consulte [o tópico acadêmico relacionado SSH](https://www.ssh.com/academy/ssh).

Para simplificar o processo de login e evitar a necessidade de entrada repetitiva, é possível acoplar as teclas `SSH` com o Agente SSH (`ssh-agent`)o programa assistente que se lembra das suas teclas e/ou senha `SSH` durante a duração de uma sessão. Esta configuração permite que o gateway `SSH` acesse sem esforço as chaves sempre que se conecta a outras máquinas.

O fluxo de trabalho aqui é o seguinte: você tem a sua chave pública armazenada em um sistema remoto e mantém a sua chave privada segura. Sempre que quiser aceder a um sistema remoto, o `ssh-agent` O sistema remoto, em seguida, envia de volta um [desafio](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) Só a sua chave privada pode responder adequadamente. `ssh-agent` Envia a resposta correta para o sistema remoto. Se a resposta coincidir com o que o sistema esperava, é-lhe concedido acesso.

A beleza do `ssh-agent` é que ele mantém a sua chave privada durante a sessão, por isso não há necessidade de continuar inserindo sua senha ou frase de senha privada cada vez que você se conecta a um sistema remoto.

Para obter mais informações sobre o `ssh-agent`, ver [o tópico relacionado da Academia SSH ](https://www.ssh.com/academy/ssh/agent).

::: info Nota

Para obter uma visão geral detalhada do protocolo `SSH` e da ferramenta `ssh-agent`, ver os seguintes tópicos [SSH Academia ](https://www.ssh.com/academy):

  - [O que é SSH (Secure Shell)?](https://www.ssh.com/academy/ssh)
  - [ssh-agente: Como configurar ssh-agent, encaminhamento de agente e protocolo de agente](https://www.ssh.com/academy/ssh/agent)

:::

### Adição de um programa de gerenciamento de senhas {#adding-a-password-manager-program}

Recomenda-se reforçar a segurança das suas chaves `SSH` protegendo-as com uma senha, que atua como um obstáculo adicional ao acesso de partes maliciosas à sua informação sensível.

Uma variedade de gerenciadores de senhas pode ser usada para armazenar temporariamente senhas de usuário e chaves `SSH`. Por razões de clareza, [KeePass](https://keepass.info/) é usado como um exemplo de gerenciador de senhas, especificamente, a porta [KeePassXC](https://keepassxc.org/) executando em sistemas operacionais baseados em Linux.

Para obter instruções sobre como configurar KeePassXC, consulte a secção [Configurar KeePassXC](#configuring-keepassxc) abaixo.

![KeePassXC: tela `Main` UI ](../../../img/KeePassXC.png)

KeePassXC oferece maior segurança, flexibilidade e controle. Ele não só armazena senhas, mas também as chaves `SSH`. Quando usado para armazenamento de chaves, este gerenciador de senhas fornece o `ssh-agent` com as chaves armazenadas. que são imediatamente removidos da sua memória uma vez fechada a janela KeePassXC.

::: ponta

Teoricamente, qualquer um dos KeePass Portos [Listado no sítio web oficial](https://keepass.info/download.html) Recomendamos qualquer um dos seguintes elementos: [KeePassX](https://www.keepassx.org/) ou [KeePassXC](https://keepassxc.org/).

:::

#### Configuração KeePassXC {#configuring-keepassxc}

Para configurar KeePassXC, efetuar as seguintes etapas:

1. Lançar KeePassXC, em seguida, vá para Ferramentas > Configurações, ou selecione o botão Gear do painel de cima UI.

2. Na guia Configurações de Aplicação que aparece, selecione o SSH Agente no menu esquerdo e, em seguida, selecione a caixa de verificação Ativar SSH Integração do Agente.

   ::: info Mostre imagem de tela de referência

   ![Tab KeePassXC `SSH Agent`: Ativação do SSH Agente](../../../img/keepassxc_ssh_agent.png)

   :::

3. Criar uma nova base de dados KeePassXC. Para instruções, consulte [KeePassXC Guia do usuário > Criando sua primeira base de dados](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Para cada chave que você deseja armazenar na base de dados KeePassXC criada, execute as seguintes etapas:

   - Adicionar uma nova entrada na base de dados. Para instruções, consulte [KeePassXC Guia do usuário > Criando sua primeira base de dados ](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Ao adicionar uma nova entrada, anexe o arquivo que contém a chave fazendo o seguinte: selecione Avançado do menu esquerdo, em seguida, selecione Adicionar na seção Anexos, selecione o arquivos necessários na janela Selecionar arquivos que aparece.

   - Ao adicionar uma nova entrada, selecione SSH Agente no menu esquerdo e, em seguida, selecione o arquivo de chave que você adicionou no menu Anexo na seção Chave privada. Selecione as seguintes caixas de verificação:

      - Adicionar chave ao agente quando o banco de dados é aberto/desbloqueado.

      - Remover a chave do agente quando o banco de dados está fechado/bloqueado

      - Requer a confirmação do usuário quando esta chave é usada

   - Caso seja necessário, efetuar outras alterações na entrada.

   - Quando estiver pronto, selecione OK para guardar a entrada.

   ::: details Mostrar capturas de tela de referência

   ![Tab KeePassXC `Advanced`: Adição de um anexo de chave privada](../../../img/keepassxc_private_key.png).

   ![Tab KeePassXC `SSH Agent`: Adição de um anexo de chave privada ](../../../img/keepassxc_pk_agent.png)

   :::

##### Resultados Esperados {#expected-results}

- As chaves criptográficas e `shh` são armazenadas como entradas em um banco de dados KeePassXC que pode ser acessado enquanto a janela KeePassXC estiver aberta.

- As chaves criptográficas armazenadas e `ssh` podem ser utilizadas sempre que forem necessárias para a autorização.

- As chaves criptográficas armazenadas e `ssh` são removidas do `ssh-agent` uma vez fechada a janela de KeePassXC.

::: info Nota

Sem habilitar a opção Requer confirmação do usuário quando esta chave é usada, o `ssh-agent` pode não monitorar o processo que lhe forneceu uma chave. No caso de o processamento do gerenciador de senhas ser encerrado por malware ou um serviço do sistema através de um sinal `SIGKILL`, É provável que a chave permaneça no `ssh-agent`, uma vez que os programas do sistema Unix não podem interceptar o `SIGKILL`.

:::

## Armazenar as chaves criptográficas fisicamente {#storing-cryptographic-keys-physically}

Para aqueles que procuram o mais alto nível de segurança offline, a opção de armazenar chaves criptográficas fisicamente garante que as chaves permaneçam completamente desconectadas das redes digitais, minimizando assim o risco de acesso não autorizado. O reconhecimento da opção física sublinha o nosso compromisso em atender às diversas necessidades de segurança.

### Usando uma chave de hardware {#using-a-hardware-key}

A nossa equipe considera que as chaves de hardware são uma das melhores medidas de segurança. Uma chave de hardware é um dispositivo compacto que se conecta através de uma porta USB e tem o tamanho de uma unidade flash típica, apenas processa eventos relacionados à segurança quando está ligado a uma máquina. Isto permite desconectar facilmente o dispositivo em caso de violação da segurança, ou simplesmente reconectá-lo a uma máquina diferente sempre que for necessário.

No entanto, uma vez que existem muitas marcas de chaves de hardware, cada uma com a sua característica única APIs é importante pesquisar o mercado para encontrar a chave que melhor se adapte às suas necessidades.

Até agora, a nossa equipe testou internamente a chave de hardware [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) que provou ter muitos recursos positivos, incluindo a versátil funcionalidade API.

No entanto, há uma desvantagem potencial a considerar. [HMAC Autenticação de desafios e respostas](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) e armazenar uma chave privada correspondente para esta resposta poderia criar uma vulnerabilidade. Esta configuração pode inadvertidamente permitir que os atacantes façam suposições instruídas sobre as informações armazenadas dentro do YubiKey A memória do 5C, comprometendo assim a segurança geral.

Felizmente, esta vulnerabilidade pode ser mitigada adotando uma abordagem alternativa para utilizar a YubiKey 5C. A ideia é usar YubiKey 5C para acessar com segurança um banco de dados KeePassXC que armazena suas chaves criptográficas e `SSH`. Este método pode até ser considerado benéfico, uma vez que excede a segurança da maioria das senhas e torna necessário que a parte maliciosa esteja em posse da sua chave de hardware no caso do vazamento da base de dados KeePassXC.

::: Informações

Para ler mais sobre o método acima, veja a resposta de um dos desenvolvedores KeePassXC[Janek Bevendorff](https://github.com/phoerious)à seguinte pergunta StackExchange:

[É razoável utilizar KeePassXC com YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### Usando uma frase mnemônica {#using-a-mnemonic-phrase}

Alternativamente, você pode memorizar uma chave privada como uma série de palavras, conhecida como frase mnemônica. Este método, usado em muitas carteiras, requer lembrar cerca de 25 palavras específicas. A maioria dos gerentes de senhas, incluindo o anteriormente discutido KeePassXC, oferece geração de senhas mnemônicas.
