---
translation_locale: pt
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Segurança operacional {#operational-security}

A Segurança Operacional (OPSEC) é uma abordagem sistemática da segurança e do gerenciamento de riscos, que consiste essencialmente em um conjunto de estratégias e conselhos adotados para casos específicos de utilização com o objetivo de prevenir o acesso não autorizado e a fuga de dados.

<abbr title="Operational Security">OPSEC</abbr> é a prática padrão da maioria das empresas para garantir a disponibilidade e estabilidade dos seus ativos. Isso inclui considerar fatores como segurança física (por exemplo, certificar-se de que as notas post-it não contêm dados confidenciais), Protocolos de comunicação seguros (por exemplo, não enviar dados sensíveis por meio de SMS não criptografado), análise de ameaças (por exemplo: determinar potenciais partes maliciosas, aprender sobre os mais recentes métodos de ataque), formação do pessoal (p. ex., sem que os funcionários sigam as medidas <abbr title="Operational Security">OPSEC</abbr>); Precocemente ou mais tarde, provam ser ineficazes), e reduzem os riscos (por exemplo, criptografando os seus discos rígidos e dispositivos USB.

Desde Iroha é susceptível de ser utilizado como um livro-razão financeiro, <abbr title="Operational Security">OPSEC</abbr> Este tópico descreve as estratégias e abordagens que os indivíduos e as organizações que utilizam Iroha No âmbito das suas operações, devem considerar-se como parte do seu amplo protocolo de segurança.

Seguir e adotar as diretrizes deste tópico é um passo necessário para alcançar a segurança total, no entanto, não é suficiente por si só. Para melhorar ainda mais a sua segurança, saiba mais ao longo do resto da seção [Segurança](./index.md) e especificamente os seguintes temas:

- [Princípios de segurança](./security-principles.md)
- [Segurança de senha](./password-security.md)

## Medidas recomendadas OPSEC {#recommended-opsec-measures}

- Mantenham-se vigilantes. [mais provável](https://arxiv.org/pdf/2209.08356.pdf) A maneira de perder os seus ativos numa cadeia de blocos é divulgando os seus detalhes sensíveis.

- Criptografar os seus discos. Criptografar dispositivos de inicialização permite que eles protejam seus dados mesmo que um invasor tenha acessado o hardware.

- Use software confiável. O software que é enviado através de construções binárias reprodutíveis, e que você constrói a partir da fonte, é o mais confiável. Software proprietário ou open source que não foi auditado é um risco potencial que deve ser levado a sério.

- Nunca deixe aparelhos portáteis com dados sensíveis sem supervisão.

- Verificar as assinaturas nos pacotes binários. Isto não é muito diferente da criptografia de chave pública usada dentro Iroha.

- Para evitar acesso não autorizado, sempre proteja seu computador eletrônico ou pessoal quando deixá-lo sem vigilância. Use senhas fortes, bloqueie a tela e siga as melhores práticas para proteger seus dispositivos.

- Estabelecer um seguro [com abertura de ar](https://en.wikipedia.org/wiki/Air_gap_(networking)Primeiro, encripta as chaves e depois armazená-las num dispositivo apenas offline. Idealmente, com proteção eletromagnética instalada. [Chaves de hardware](./storing-cryptographic-keys.md#using-a-hardware-key) são especificamente concebidos para este fim.

- Mantenha sempre o seu software atualizado para a sua versão mais recente em todos os dispositivos, incluindo computadores e telefones. Atualizações regulares ajudam a corrigir vulnerabilidades e minimizar riscos potenciais associados ao software desatualizado, mesmo antes que tais vulnerabilidades sejam divulgadas.

- Desenvolver uma rotina para a atualização periódica de senhas e chaves criptográficas.Esta abordagem proativa contribui significativamente para melhorar a postura geral de segurança, já que é muito mais difícil atingir um alvo em movimento.

## Usando os navegadores {#using-browsers}

Se um aplicativo conectado a Iroha possui uma web UI, o seu navegador pode ajudar na segurança ou representar uma ameaça potencial. É essencial ter cuidado, especialmente quando se trata dos plugins que você escolhe instalar.

Considere as seguintes medidas para aumentar a segurança da sua navegação:

- Evite usar navegadores que são conhecidos por terem maus modelos de segurança e por vazarem os dados dos seus usuários. Você pode procurar violações de privacidade e problemas de segurança para qualquer navegador. Por exemplo, [ este artigo sobre privacidade do navegador ](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) discute uma variedade de navegadores e o quão seguros eles são. Observe que os navegadores proprietários (como o Chrome, Safari, Opera, Vivaldi, Edge e outros) são geralmente muito mais difíceis de auditar devido ao seu código estar escondido do público, o que significa que você não pode ter certeza de quão seguros eles são.

- Dar preferência a navegadores com um histórico sólido de valorização e proteção da privacidade e segurança dos seus usuários:
  - [Librewolf](https://librewolf.net/), [Icecat](https://www.gnu.org/software/gnuzilla/), [Firedragon](https://github.com/dr460nf1r3/firedragon-browser), etc.  Forcas bem estabelecidas do Mozilla Firefox com recursos de segurança adicionais.
  - [O cromo não identificado ](https://github.com/ungoogled-software/ungoogled-chromium)  é uma versão de código aberto altamente auditada do Google Chrome, que é aprimorada com medidas de segurança adicionais e remove todos os serviços web relacionados ao Google.
  - [Corajoso .](https://brave.com/)  uma versão de código aberto altamente auditada de [Google Chromium](https://www.chromium.org/Home/) que é reforçada por medidas de segurança adicionais; possui um sistema integrado <abbr title="Virtual Private Network">VPN</abbr> e a funcionalidade de bloqueio de anúncios.
  - [Falkon](https://www.falkon.org/)  um navegador web de código aberto baseado em Qt (construído em `QtWebEngine`, uma embalagem para [Google Chromium](https://www.chromium.org/Home/)) com histórico conhecido de ser seguro; tem uma série de extensões disponíveis para download de sua página de loja [ KDE ](https://store.falkon.org/browse/).
  - [Qutebrowser](https://qutebrowser.org/)  um navegador web baseado em Qt de código aberto (construído em `QtWebEngine`, uma embalagem para [Google Chromium](https://www.chromium.org/Home/)) com histórico conhecido de ser seguro; tem uma abordagem única focada no teclado com minimalista GUI Considerado um navegador de escolha para muitos especialistas em segurança.

- Evitar ativar `JavaScript` a menos que seja necessário.

- Use o mecanismo de confinamento embutido do navegador para plugins para restringir os direitos de acesso que os plugins instalados têm.

- Limpe os cookies antes e depois de operações importantes. Tenha cuidado para não ativar o recurso Keep Me Signed In ou Remember me. Tenha em mente que alguns sites têm este recurso habilitado por padrão.

- Use um bloqueador de anúncios. Estes não só bloqueiam anúncios, mas também desativam as funcionalidades de rastreamento do site. Dependendo do navegador que você usa, um bloqueador pode não ser um recurso incorporado.

- Tenha em conta os caracteres semelhantes (por exemplo, `0`, `θ`, `O`, `О`, `ዐ` e `߀` Atenção a detalhes como este pode salvá-lo de um ataque de phishing.

- Evite os clientes de e-mail web UI em favor dos clientes desktop. Antes de usá-lo, configure o seu cliente de e-mails desktop para assinar e verificar as assinaturas das chaves GPG.

- Evite usar serviços de mensagens baseados na Web. Por exemplo, o Discord (construído com a infame estrutura `electron`) é suscetível a muitos dos mesmos ataques que uma janela do Google Chromium com a versão web do Discord aberta.

- Atualize seu navegador para a versão mais recente sempre que possível. As atualizações geralmente incluem patches de segurança críticos que resolvem vulnerabilidades.

- Tenha cuidado com as extensões de navegador que você instala. Use apenas extensões conhecidas e confiáveis de fontes respeitadas.

- Criar perfis de navegador separados para várias tarefas. Use um perfil para navegação diária e outro para atividades que envolvem alta segurança e dados sensíveis. Desta forma, as extensões instaladas no perfil para navegação diária não podem acessar os dados sensíveis do seguro.

- Use uma versão portátil do seu navegador copiada em uma unidade flash USB. Este método garante que, mesmo que um bug de segurança conceda a um dos plugins instalados com acesso aos dados entre os perfis, o seu perfil relacionado à segurança permanece em um dispositivo separado e removível.

- Limpar periodicamente o cache do seu navegador e os cookies para remover dados potencialmente sensíveis que podem ser armazenados acidentalmente no seu dispositivo.

## Plano de recuperação {#recovery-plan}

Em caso de emergência, como a perda de uma chave ou uma violação da segurança, um plano de recuperação bem estruturado e preparado antecipadamente é uma salvação essencial.

As organizações devem ter em conta os seguintes aspectos fundamentais ao elaborar o seu plano de recuperação:

- Descrever procedimentos passo a passo a serem seguidos em caso de perda de chaves ou outros incidentes de segurança e garantir que estes passos sejam facilmente acessíveis e compreensíveis aos utilizadores e/ou empregados.

- Estabelecer um canal de comunicação que possa ser utilizado para notificar prontamente violações à segurança e potenciais ameaças, tais como chaves criptográficas e senhas vazadas ou perdidas.

- Se você usar chaves de hardware (por exemplo, [YubiKey](https://www.yubico.com/products/) ou [SoloKeys Solo ](https://solokeys.com/collections/all)) como medida de segurança, considere adotar uma estratégia de redundancia. Mantenha duas chaves: uma para uso diário e outra armazenada em um local seguro. Esta precaução garante o acesso, mesmo que a chave primária seja comprometida ou perdida.

- Quando se relatam violações ou vazamentos de segurança, reage imediatamente substituindo ou desativando as chaves e senhas afetadas.

- Revisar e atualizar periodicamente o seu plano de recuperação, garantindo que o plano permaneça relevante e eficaz à medida que a sua paisagem de segurança evolui.

::: Aviso

Lembre-se de que um plano de recuperação não é apenas outro documento, mas sim uma linha de salvação que ajuda a navegar por desafios inesperados. reforça a sua segurança operacional e aumenta a sua preparação para responder eficazmente a qualquer incidente de segurança.

:::
