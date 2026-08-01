---
translation_locale: pt
translation_source: /guide/security/public-key-cryptography.md
translation_source_hash: 3d317c00e75525d70f6cb9ef7f8eeec6911e2f124af8052cd2fc719b264d43f9
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Criptografia de chaves públicas {#public-key-cryptography}

A criptografia de chaves públicas usa uma chave pública relacionada e a chave privada. A chave pública pode ser compartilhada. A chave privada deve permanecer sob o controle da autoridade. A segurança depende do uso de um algoritmo suportado, gerando chaves com aleatoriedade segura e protegendo a chave privada

## As assinaturas digitais {#digital-signatures}

Um assinante cria uma assinatura digital com uma chave privada e um verificador verifica a assinatura com a chave pública correspondente.

Uma assinatura válida mostra que os bytes assinados não foram alterados e que o titular da chave privada os aprovou. Não identifica uma pessoa por si só. A identidade depende de como a chave pública ou o controlador da conta foi registrada e regida.

As assinaturas fornecem evidência de integridade e autorização, não criptografam o conteúdo assinado.

## Encriptação de Chave Pública {#public-key-encryption}

Alguns esquemas de chaves públicas criptografam dados para a chave pública de um destinatário. O destinatário decripta esses dados com a chave privada correspondente. Criptografia e assinaturas são operações separadas e podem usar diferentes chaves ou algoritmos.

A assinatura da transacção Iroha não torna os dados do livro-razão público confidenciais. Usar o mecanismo de confidencialidade aprovado da implantação quando o conteúdo da carga útil deve permanecer privado.

## Chaves do lado do cliente {#keys-on-the-client-side}

Cada transacção deve satisfazer a política configurada do controlador de conta. Uma conta simples pode usar uma chave de assinatura. Uma conta regida pode utilizar uma política de controlador mais complexa.

O software do cliente deve proteger as chaves privadas e outros materiais do controlador. A configuração do cliente em texto simples é adequada apenas para desenvolvimento local e testes controlados. As integrações de produção devem utilizar um gestor de segredos, armazenamento de chaves suportado por hardware, um serviço de assinatura isolado ou outro limite de assinatura auditado.

Usar chaves separadas para ambientes e finalidades separados. A reutilização de uma chave liga esses usos e aumenta o impacto da exposição.

Veja . [Geração de chaves criptográficas](./generating-cryptographic-keys.md), [Armazenamento de chaves criptográficas](./storing-cryptographic-keys.md), e [Segurança operacional](./operational-security.md).
