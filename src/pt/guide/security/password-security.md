---
translation_locale: pt
translation_source: /guide/security/password-security.md
translation_source_hash: 093be5b91700b9a6f85b45dc873c8c29d90397d5c9e3c842a77bfb03e97b37da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Segurança de Senha {#password-security}

Senhas podem proteger consoles de operadores, armazenamentos secretos, backups e arquivos de chave locais. Uma senha é apenas um controle. Use-a junto com a custódia segura de chaves, controles de acesso e autenticação multifator onde estiver disponível.

## Use senhas únicas e geradas {#use-unique-generated-passwords}

- Gere uma senha diferente para cada conta e ambiente.
- Use um gerenciador de senhas para criar e armazenar senhas longas e aleatórias.
- Use uma frase-senha de várias palavras apenas quando suas palavras forem selecionadas aleatoriamente de uma lista suficientemente grande.
- Mantenha nomes, datas, endereços, citações, padrões de teclado e fragmentos reutilizados fora das senhas.
- Use um token gerado pelo serviço ou uma chave criptográfica em vez de uma senha digitada por um humano quando o serviço suportar esse método.

O comprimento e a imprevisibilidade importam mais do que substituições decorativas. Adicionar um símbolo a uma palavra previsível não torna o resultado seguro.

## Proteger Contas Baseadas em Senha {#protect-password-based-accounts}

- Ative a autenticação multifator resistente a phishing onde estiver disponível.
- Aplique limites de taxa, política de bloqueio e alertas para falhas de autenticação repetidas.
- Envie senhas apenas por canais autenticados e criptografados.
- Mantenha senhas e códigos de recuperação fora de logs, linhas de comando, repositórios de código-fonte, arquivos de configuração, tickets e chats.
- Armazene verificadores de senha do lado do servidor com uma função de hash de senha com sal e difícil de processar na memória, e parâmetros apropriados para a implantação.

## Armazenamento, Recuperação e Substituição {#storage-recovery-and-replacement}

- Use um gerenciador de senhas auditado com backups criptografados e testados.
- Armazene os códigos de recuperação separadamente do dispositivo que eles recuperam. Uma cópia em papel protegida offline pode ser apropriada para o material de recuperação.
- Limite o acesso às exportações do gerenciador de senhas e mídias de backup.
- Substitua uma senha após suspeita de exposição, reutilização não autorizada ou um evento de política que exija substituição.
- Teste os procedimentos de recuperação de conta antes do lançamento em produção.

::: warning

Uma senha que desbloqueia uma chave privada não pode tornar segura uma cópia exposta dessa chave. Se houver suspeita de exposição da chave privada, siga o procedimento de substituição ou revogação de chave da implantação.

:::

Veja [Segurança Operacional](./operational-security.md) e [Armazenando Chaves Criptográficas](./storing-cryptographic-keys.md).
