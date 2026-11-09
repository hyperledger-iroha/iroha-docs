---
translation_locale: pt
translation_source: /help/deployment-issues.md
translation_source_hash: 3ac88d01410d26915299d64cf0a4fa0693ad92373f6a172acb67edc4fcbefe85
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solução de Problemas de Implantação {#troubleshooting-deployment-issues}

Esta seção oferece dicas de solução de problemas para implantações Iroha 3. Se o problema que você está enfrentando não estiver descrito aqui, entre em contato conosco via [Telegram](https://t.me/hyperledgeriroha).

## Comece com artefatos gerados {#start-with-generated-artifacts}

Para implantações locais e de teste, prefira artefatos gerados por Kagami em vez de arquivos de pares de rede escritos à mão:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

O diretório gerado contém configurações dos pares de rede, material de gênese, scripts de inicialização e um README para a linha de compilação da Iroha 3.

## par do sistema de rede não inicia {#peer-does-not-start}

Verifique estes itens primeiro:

- `iroha3d --config <path>` aponta para o arquivo TOML do próprio par de rede.
- `public_key` e `private_key` na configuração de pares de rede pertencem ao mesmo par de chaves.
- `genesis.public_key` corresponde à chave usada para assinar a transação gênese da blockchain.
- As identidades dos pares da rede de validadores usam chaves BLS-Normais, e `trusted_peers_pop` contém entradas de prova de posse para a chave local e para os pares confiáveis da rede.
- as portas para Torii e P2P não estão já vinculadas a outro processo.
- o diretório de lojas Kura pertence à mesma rede e não foi copiado de um perfil de rede diferente.

Use o rastreamento de configuração quando o daemon ler mais de uma camada TOML:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker e Docker Compose {#docker-and-compose}

Siga o guia [Iniciar Iroha 3](/pt/get-started/launch-iroha.md) para compilar e executar quatro validadores no Docker com binários da mesma revisão.

No diretório do kit, execute `python3 poc.py logs` para consultar os logs dos validadores.

Se uma implantação do compose iniciar e depois travar, inspecione os logs do daemon para:

- incompatível `chain`
- um par de rede usando uma transação gênese de blockchain diferente ou manifesto técnico
- endereços anunciados P2P que só funcionam dentro da rede do contêiner
- reutilização de volume local após regenerar o génesis da blockchain

Um novo bloco gênese exige que o armazenamento do nó esteja vazio. Use `python3 poc.py down` e `python3 poc.py up` para reiniciar a mesma rede. Mantenha `state/` junto aos quatro volumes do Docker.

## Kubernetes {#kubernetes}

Para o Kubernetes, trate cada validador como infraestrutura com estado:

- fornecer a cada par de rede uma chave de identidade estável e um volume persistente estável
- expor endereços P2P que outros pares de rede podem resolver de dentro do cluster
- montar arquivos de configuração e de gênese da blockchain como configuração imutável para uma implantação
- implantar deliberadamente todas as mudanças de gênese ou topologia, não como uma atualização automática do mapa de configuração

Se um pod reiniciar repetidamente, compare a configuração gerada no pod com a prevista em [`peer.template.toml`](/pt/reference/peer-config/index.md#template) e verifique se o par está reproduzindo dados antigos do Kura.

## Perfil de Sora {#sora-profile}

Implantações privadas ou locais Iroha 3 que utilizam Nexus, SoraFS ou fluxos de múltiplas faixas devem iniciar o daemon padrão com o perfil Sora habilitado:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Use o mesmo perfil de forma consistente entre os validadores na mesma rede.

Os validadores públicos Taira usam o inicializador dedicado, que aplica a cadeia exata de Taira, a lista, o armazenamento incorporado-SoraFS desativado e o perfil de assinante em tempo de execução. Valide a configuração renderizada Taira antes de iniciá-la:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Não comece um público Taira validador com genérico `iroha3d`; ver o [`iroha3d` CLI referência](/pt/reference/iroha3d-cli.md) para o perfil aplicado.
