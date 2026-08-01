---
translation_locale: pt
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuração e gestão {#configuration-and-management}

A configuração Iroha possui duas camadas de autoridade:

- Configuração local de peer e cliente, armazenada em arquivos TOML e lida no início do processo
- Configuração na cadeia, alterada por transações através de [`SetParameter`](/pt/blockchain/instructions.md#setparameter)

Use configuração local para identidade de nós, endereços, registro, armazenamento e chaves de assinatura do cliente. Use configuração on-chain para valores que devem ser concordados pela rede e reproduzidos deterministicamente.

O comportamento de produção deve vir dessas camadas de configuração. As variáveis ambientais podem ser convenientes para fornecer entradas de teste para ferramentas locais, mas elas não são portas de características de produção e não substituem a configuração comprometida.

Os principais pontos de entrada da configuração são:

- [Gênesis ](/pt/guide/configure/genesis.md)
- [Configuração do cliente](/pt/guide/configure/client-configuration.md)
- [Chaves de implantação da rede ](/pt/guide/configure/keys-for-network-deployment.md)
- [Correndo em metal nu](/pt/guide/advanced/running-iroha-on-bare-metal.md)
- [Referência de configuração entre pares ](/pt/reference/peer-config/index.md)
