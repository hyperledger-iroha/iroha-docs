---
translation_locale: pt
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Segurança de senhas {#password-security}

As senhas podem proteger os consoles do operador, lojas secretas, backups e arquivos de chaves locais. Uma senha é apenas um controlo. Usá-lo juntamente com a custódia de chaves segura, controles de acesso e autenticação multifatorial quando disponível.

## Use senhas únicas e geradas {#use-unique-generated-passwords}

- Gerar uma senha diferente para cada conta e ambiente.
- Use um gerenciador de senhas para criar e armazenar senhas aleatórias longas.
- Use uma senha de várias palavras somente quando as suas palavras são selecionadas aleatoriamente de uma lista suficientemente grande.
- Mantenha nomes, datas, endereços, citações, padrões de teclado e fragmentos reutilizados fora das senhas.
- Usar um token ou chave criptográfica gerada pelo serviço em vez de uma senha inserida por humanos quando o serviço suportar esse método.

O comprimento e a imprevisibilidade são mais importantes do que as substituições decorativas. A adição de um símbolo a uma palavra previsível não torna o resultado seguro.

## Proteja as contas baseadas em senhas {#protect-password-based-accounts}

- Permitir a autenticação multifatorial resistente ao phishing, sempre que disponível.
- Aplicar limites de taxas, política de bloqueio e alertas para falhas repetidas de autenticação.
- Enviar senhas apenas através de canais autenticados e criptografados.
- Mantenha senhas e códigos de recuperação fora de logs, linhas de comando, repositórios de fontes, arquivos de configuração, bilhetes e chat.
- Armazenar os verificadores de senhas do lado do servidor com uma função de hashing de senha salgada e rígida em memória e parâmetros adequados à implantação.

## Armazenamento, recuperação e substituição {#storage-recovery-and-replacement}

- Usar um gerenciador de senhas auditado com backups criptografados e testados.
- Guarde os códigos de recuperação separadamente do dispositivo que eles recuperam. Uma cópia de papel offline protegida pode ser adequada para o material de recuperação.
- Limitar o acesso às exportações do gerenciador de senhas e aos meios de backup.
- Substitua uma senha após suspeita exposição, reutilização não autorizada ou um evento de política que requer substituição.
- Testar os procedimentos de recuperação das contas antes do lançamento da produção.

::: warning

Uma senha que desbloqueie uma chave privada não pode fazer de uma cópia exposta dessa chave um cofre. Se houver suspeita de exposição à chave privada, siga o procedimento de substituição ou revogação da chave para a implementação.

:::

Veja [Segurança operacional](./operational-security.md) e [Clives criptográficas de armazenamento ](./storing-cryptographic-keys.md).
