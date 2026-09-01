---
translation_locale: pt
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Redes Privadas Virtuais {#virtual-private-networks}

Um <abbr title="Virtual Private Network">VPN</abbr> é um controle de rede que limita quem pode acessar os serviços Iroha. Ele é mais útil para implantações privadas e de consórcio, onde validadores, backends de aplicativos e operadores devem se comunicar por endereços privados em vez de rotas pela internet aberta.

Um VPN não substitui as chaves de pares de rede Iroha, chaves de conta, permissões, regras de firewall, monitoramento ou armazenamento seguro de chaves. Trate-o como uma camada dentro do limite de implantação: o VPN restringe a acessibilidade da rede, enquanto a configuração e governança do Iroha decidem quais pares de rede e contas são confiáveis.

## Quando Usar um VPN {#when-to-use-a-vpn}

Use um VPN quando:

- os validadores são operados por diferentes organizações ou em diferentes ambientes de hospedagem
- Torii deve ser acessível apenas pelos backends da aplicação, operadores ou clientes confiáveis
- métricas, logs, SSH ou outros endpoints de administração API devem permanecer em uma rede privada do operador
- uma rede de teste ou de preparo deve se assemelhar aos controles de acesso de produção sem expor endpoints públicos API

Um VPN não é necessário para cada implantação. Redes públicas podem intencionalmente expor Torii por meio de um gateway público, balanceador de carga ou proxy reverso. Mesmo nesse caso, mantenha o tráfego peer-to-peer de validadores e os endpoints de administração API em uma rede restrita sempre que possível.

::: tip

Um navegador VPN protege apenas o tráfego desse navegador. Ele não protege `iroha3d`, CLI, SDK, SSH, métricas ou tráfego de backup, a menos que esses processos sejam roteados através da mesma rede privada.

:::

## Padrão de Implantação {#deployment-pattern}

Para uma malha de validadores privada, dê a cada validador um endereço estável VPN ou um nome privado DNS. Configure os pares da rede para que seus endereços de ponto a ponto anunciados sejam alcançáveis pelos outros validadores através dessa rede:

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

Use o endereço atribuído ao par de rede atual em `network.address` e `network.public_address`. Cada par de rede deve listar as mesmas identidades de pares de rede confiáveis, mas com endereços que sejam acessíveis a partir de sua própria tabela de rotas VPN.

As configurações do Cliente e CLI devem apontar para um endpoint API Torii acessível através do VPN ou através de um gateway interno controlado:

```toml
torii_url = "http://10.20.0.11:8080"
```

Se Torii precisar estar disponível fora do VPN, coloque-o atrás de um proxy reverso ou balanceador de carga que forneça TLS, autenticação, limitação de taxa e registro de logs. Evite expor portas peer-to-peer brutas ou endpoints de administração API diretamente à internet pública.

## Regras de Firewall {#firewall-rules}

Use regras de firewall do host e da nuvem mesmo quando um VPN estiver presente:

|Serviço|Acesso recomendado|
| --- | --- |
|Porta ponto a ponto|Outros endereços de validador VPN apenas|
| Torii |Backends de aplicação, operadores ou clientes confiáveis VPN intervalos|
|Métricas e verificações de saúde|Sistemas de monitoramento na rede do operador|
|SSH e administração|Host bastião, operador privilegiado VPN faixa, ou processo de quebra de vidro|
|Backups e replicação de armazenamento|Sistemas de backup em uma rede privada|

Regras de negação padrão são mais fáceis de auditar do que regras amplas de permissão. Quando um novo par de rede se junta à rede, atualize a associação VPN, a lista de permissões do firewall e a configuração do par de rede confiável Iroha como uma alteração coordenada.

## Lista de Verificação Operacional {#operational-checklist}

- Escolha uma implementação VPN auditada e ativamente mantida, como WireGuard, IPsec, ou uma rede privada gerenciada aprovada pela organização.
- Use credenciais VPN únicas para cada host e operador. Não compartilhe chaves VPN entre validadores.
- Mantenha as credenciais VPN separadas das chaves privadas Iroha e do material de assinatura do blockchain genesis.
- Monitore a latência VPN, perda de pacotes, reconexões e alterações de rota. O consenso é sensível à instabilidade contínua da rede.
- Teste o MTU eficaz. A fragmentação de pacotes pode parecer falhas intermitentes no par de rede ou Torii.
- Documento que especifica quais intervalos VPN podem se conectar ponto a ponto, Torii, métricas, SSH, e pontos de extremidade de backup API.
- Gire as credenciais VPN quando um host, conta de operador ou organização sair da rede.
- Evite um único gateway VPN como a única rota entre os validadores. Planeje gateways redundantes ou rotas site a site para redes de produção.
- Inclua falhas VPN nos exercícios de resposta a incidentes para que os operadores saibam quando distinguir uma partição de rede de uma falha de processo Iroha.

## Páginas Relacionadas {#related-pages}

- [Princípios de Segurança](/pt/guide/security/security-principles.md)
- [Segurança Operacional](/pt/guide/security/operational-security.md)
- [Chaves para Implantação de Rede](/pt/guide/configure/keys-for-network-deployment.md)
- [Gerenciamento de pares de rede](/pt/guide/configure/peer-management.md)
- [Referência de Configuração de Par de Rede](/pt/reference/peer-config/index.md)
