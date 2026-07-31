---
translation_locale: pt
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: fd8bca2c8909c6dfead2e2f7f4f4711ab80339a98b7e227c02aa3ff965380718
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Criptografia de chaves públicas {#public-key-cryptography}

A criptografia de chaves públicas fornece os meios para uma comunicação segura e a proteção dos dados, permitindo atividades como transações on-line seguras, comunicações por e-mail encriptadas, etc.

A criptografia de chaves públicas emprega um par de chaves criptográficas - uma chave pública e uma chave privada - para criar um método altamente seguro de transmissão de informações através de redes on-line.

É fácil fazer uma chave pública a partir de uma chave privada, mas o oposto é bastante difícil, se não impossível. Isso mantém as coisas seguras. Você pode compartilhar livremente sua chave pública sem arriscar a sua chave privada, que permanece segura.

## Encriptação e assinaturas {#encryption-and-signatures}

A criptografia de chaves públicas permite que os indivíduos enviem mensagens e dados encriptados que só podem ser decifrados pelo destinatário pretendido possuindo sua chave privada correspondente. Em outras palavras, a chave pública funciona como um bloqueio e a chave privada serve como uma chave única que desbloqueia os dados criptografados.

Este processo de criptografia não só garante a privacidade e a confidencialidade das informações sensíveis, mas também estabelece a autenticidade do remetente. Esta assinatura serve como um selo digital de aprovação, verificando a identidade do remetente e a validade dos dados transferidos. Qualquer pessoa com a sua chave pública pode verificar que a pessoa que iniciou a transacção usou a sua chave privada.

## Chaves do lado do cliente {#keys-on-the-client-side}

Cada transacção deve ser assinada por uma autoridade de conta. A chave privada ou o material do controlador para essa autoridade devem permanecer secretos, portanto, o software cliente é responsável pelo armazenamento e assinatura seguros.

::: Aviso

Todos os clientes são diferentes, mas a configuração do cliente de texto simples é adequada apenas para desenvolvimento e testes controlados. As integrações de produção devem utilizar um gerenciador secreto, armazenamento de chaves suportado por hardware ou outro limite de assinatura auditado.

:::

O registo de uma nova conta envolve a geração de material do controlador, como um par de chaves Ed25519. e submetendo a parte pública à rede. As transacções posteriores da conta devem ser assinadas com a chave privada correspondente ou com a política de controlador de conta configurada.

Para a criptografia de chaves públicas funcionar eficazmente, evite reutilizar chaves quando precisar especificar uma nova chave. Embora não haja nada que impeça você de fazer isso, as chaves públicas são públicas, o que significa que se um atacante vê a mesma chave pública sendo usada, Saberão que as chaves privadas também são idênticas.

Embora as chaves privadas funcionem de acordo com princípios ligeiramente diferentes das senhas, aplica-se o conselho de torná-las tão aleatórias quanto possível, nunca armazená-las sem criptografia e nunca compartilhá-las com ninguém em qualquer circunstância.
