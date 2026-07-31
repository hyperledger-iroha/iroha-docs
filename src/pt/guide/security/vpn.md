---
translation_locale: pt
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Redes privadas virtuais {#virtual-private-networks}

Um <abbr title="Virtual Private Network">VPN</abbr> é um controle de rede que limita quem pode acessar os serviços Iroha. É mais útil para implementações privadas e de consórcios onde validadores, backends de aplicativos e operadores devem se comunicar através de endereços privados em vez de rotas abertas de internet.

A. VPN não substitui Iroha Chaves de peer, chaves de conta, permissões, regras de firewall, monitoramento ou armazenamento seguro de chaves. Tratá-lo como uma camada no limite de implantação: o VPN Reduz a acessibilidade da rede, enquanto Iroha Configuração e governança decidem em quais pares e contas são confiáveis.

## Quando utilizar um VPN {#when-to-use-a-vpn}

Use um VPN quando:

- Os validadores são operados por diferentes organizações ou em ambientes de hospedagem diferentes
- O Torii só deve ser acessível por backend de aplicações, operadores ou clientes de confiança
- As métricas, registos, SSH ou outros pontos finais de administração devem permanecer numa rede de operadores privados.
- Uma rede de ensaio ou fase deve parecer com controles de acesso à produção sem expor pontos finais públicos.

Uma VPN não é necessária para cada implantação. As redes públicas podem expor intencionalmente a Torii através de um gateway público, balanceador de carga ou proxy inverso. Mesmo nesse caso, mantenha o tráfego peer-to-peer e os endpoints de administração do validador em uma rede restrita sempre que possível.

::: ponta

Um navegador VPN só protege o tráfego desse navegador. Não protege `irohad`, CLI, SDK, SSH, métricas ou tráfego de backup a menos que esses processos sejam encaminhados através da mesma rede privada.

:::

## Padrão de implantação {#deployment-pattern}

Para uma rede de validadores privados, indique a cada validador um endereço estável VPN ou nome privado DNS. Configure os pares para que os seus endereços peer-to-peer anunciados sejam acessíveis dos outros validadores através dessa rede:

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

Use o endereço atribuído ao peer atual em `network.address` e `network.public_address`. Cada peer deve enumerar as mesmas identidades de pares confiáveis, mas com endereços acessíveis a partir da sua própria tabela de rotas VPN.

As configurações do cliente e CLI devem apontar para um ponto final Torii acessível através do VPN ou através de um gateway interno controlado:

```toml
torii_url = "http://10.20.0.11:8080"
```

Se o Torii for disponível fora do VPN, coloque-o atrás de um proxy inverso ou balançador de carga que forneça a autenticação, limitação de taxa e registro TLS. Evite expor as portas peer-to-peer cruas ou os pontos finais da administração diretamente à internet pública.

## Regras de Firewall {#firewall-rules}

Use as regras do firewall host e da nuvem mesmo quando estiver presente um VPN:

|Serviço |Acesso recomendado |
| --- | --- |
|Portos de peer-to-peer|Outros validadores VPN só têm endereços |
|Torii |Backend de aplicação, operadores ou clientes confiáveis VPN rangos |
|Métricas e verificações de saúde |Sistemas de monitorização na rede do operador |
|SSH e administração |Bastion host, privileged operator VPN range, ou processamento de quebra-vidro |
|Backups e replicação de armazenamento |Sistemas de backup numa rede privada |

As regras de negação por defeito são mais fáceis de auditar do que as regras gerais de permissão. Quando um novo peer se junta à rede, atualize a lista de permissões VPN, o firewall e a configuração de peer confiável Iroha como uma mudança coordenada.

## Lista de verificação operacional {#operational-checklist}

- Escolher uma implementação VPN auditada e mantida ativamente, como WireGuard, IPsec ou uma rede privada gerenciada aprovada pela organização.
- Use credenciais únicas VPN para cada hospedeiro e operador. Não compartilhe chaves VPN entre validadores.
- Manter as credenciais VPN separadas das chaves privadas Iroha e do material de assinatura da gênese.
- Monitorar VPN latência, perda de pacotes, reconectas e mudanças de rota. Consenso é sensível à instabilidade da rede sustentada.
- Teste a efetiva MTU. A fragmentação de pacotes pode parecer falhas intermitentes entre pares ou Torii.
- Documentos que permitem atingir os intervalos VPN peer-to-peer, Torii, métricas, SSH e pontos finais de backup.
- Rotear as credenciais VPN quando um host, conta de operador ou organização deixar a rede.
- Evite um único portal VPN como única rota entre os validadores. Planeje gateways redundantes ou rotas site-to-site para redes de produção.
- Incluir falhas VPN em exercícios de resposta a incidentes para que os operadores saibam quando distinguir uma partição de rede de uma falha de processo Iroha.

## Páginas relacionadas {#related-pages}

- [Princípios de segurança](/pt/guide/security/security-principles.md)
- [Segurança operacional](/pt/guide/security/operational-security.md)
- [Chaves para a implantação da rede ](/pt/guide/configure/keys-for-network-deployment.md)
- [Gerenciamento entre pares ](/pt/guide/configure/peer-management.md)
- [Referência de configuração entre pares ](/pt/reference/peer-config/index.md)
