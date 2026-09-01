---
translation_locale: pt
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuração e Gerenciamento {#configuration-and-management}

Iroha configuração possui duas camadas autoritativas:

- configuração de cliente e par de rede local, armazenada em arquivos TOML e lida na inicialização do processo
- configuração on-chain, alterada por transações através de [`SetParameter`](/pt/blockchain/instructions.md#setparameter)

Use configuração local para identidade do nó, endereços, registro de atividades, armazenamento e chaves de assinatura de clientes. Use configuração on-chain para valores que devem ser acordados pela rede e reproduzidos de forma determinística.

O comportamento de produção deve vir dessas camadas de configuração. Variáveis de ambiente podem ser convenientes para fornecer entradas de teste para ferramentas locais, mas elas não são controles de recurso de produção e não substituem a configuração comprometida.

Os principais pontos de entrada da configuração são:

- [gênese da blockchain](/pt/guide/configure/genesis.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Chaves para implantação de rede](/pt/guide/configure/keys-for-network-deployment.md)
- [Executando em metal puro](/pt/guide/advanced/running-iroha-on-bare-metal.md)
- [referência de configuração de par de rede](/pt/reference/peer-config/index.md)
