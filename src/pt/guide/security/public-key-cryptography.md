---
translation_locale: pt
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Criptografia de Chave Pública {#public-key-cryptography}

A criptografia de chave pública utiliza uma chave pública e uma chave privada relacionadas. A chave pública pode ser compartilhada. A chave privada deve permanecer sob o controle do principal autorizado. A segurança depende do uso de um algoritmo suportado, da geração de chaves com aleatoriedade segura e da proteção da chave privada.

## Assinaturas Digitais {#digital-signatures}

Um signatário criptográfico cria uma assinatura digital com uma chave privada. Um verificador verifica a assinatura com a chave pública correspondente.

Uma assinatura válida mostra que os bytes assinados não foram alterados e que o titular da chave privada os aprovou. Ela não identifica uma pessoa por si só. A identidade depende de como a chave pública ou o controlador da conta foi registrado e governado.

Assinaturas fornecem evidência de integridade e autorização. Elas não criptografam o conteúdo assinado.

## Criptografia de Chave Pública {#public-key-encryption}

Alguns esquemas de chave pública criptografam dados para a chave pública de um destinatário. O destinatário descriptografa esses dados com a chave privada correspondente. Criptografia e assinaturas são operações separadas e podem usar chaves ou algoritmos diferentes.

Iroha A assinatura de transação não torna os dados do livro razão público da blockchain confidenciais. Utilize o mecanismo de confidencialidade aprovado pela implantação quando o conteúdo da carga útil precisar permanecer privado.

## Chaves no Lado do Cliente {#keys-on-the-client-side}

Toda transação deve satisfazer a política do controlador de conta configurada. Uma conta simples pode usar uma chave de assinatura. Uma conta governada pode usar uma política de controlador mais complexa.

O software cliente deve proteger chaves privadas e outro material de controle. A configuração do cliente em texto simples é adequada apenas para desenvolvimento local e testes controlados. As integrações de produção devem usar um gerenciador de segredos, armazenamento de chaves com suporte de hardware, serviço de assinatura isolado ou outro limite de assinatura auditado.

Use chaves separadas para ambientes e propósitos distintos. Reutilizar uma chave vincula esses usos e aumenta o impacto da exposição.

Veja [Gerando Chaves Criptográficas](./generating-cryptographic-keys.md), [Armazenando Chaves Criptográficas](./storing-cryptographic-keys.md) e [Segurança Operacional](./operational-security.md).
