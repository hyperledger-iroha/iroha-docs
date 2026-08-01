---
translation_locale: pt
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolução de problemas de implantação {#troubleshooting-deployment-issues}

Esta seção oferece dicas de solução de problemas para implementações Iroha 3. Se o problema que você está experimentando não for descrito aqui, entre em contato conosco através do [Telegram](https://t.me/hyperledgeriroha).

## Comece com artefatos gerados . {#start-with-generated-artifacts}

Para implementações locais e de teste, prefira-se artefatos gerados por Kagami em vez de arquivos peer escritos à mão:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

O diretório gerado contém configurações de pares, material genético, scripts de início e um README para a linha de construção Iroha 3.

## Peer não começa {#peer-does-not-start}

Verifique estes itens primeiro:

- `irohad --config <path>` pontos no próprio arquivo TOML do compartilhador.
- O `public_key` e o `private_key` na configuração de pares pertencem ao mesmo par de chaves.
- O `genesis.public_key` corresponde à chave usada para assinar a transacção de Gênesis.
- As identidades dos pares de validador utilizam BLS-Chaves normais, e `trusted_peers_pop` contém entradas de prova de posse para a chave local e os pares confiáveis.
- Os portos de Torii e P2P não estão já vinculados por outro processo.
- O diretório de lojas Kura pertence à mesma cadeia e não foi copiado a partir de um perfil de rede diferente.

Utilize o rastreamento de configuração quando o daemon lê mais de uma camada TOML:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker e Compose {#docker-and-compose}

Gerar Compõe a partir da saída localnet atual Kagami para que os argumentos de linha de comando e os arquivos de configuração correspondam ao código chequeado:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Se uma implantação de composição começar e depois parar, inspecione os registos daemon para:

- Descoincidência `chain`
- um par usando uma transação ou manifesto de gênese diferente
- Endereços publicitados P2P que só funcionam dentro da rede de contêineres
- reutilização do volume local após a regeneração da genese

Ao testar uma nova gênese, remova os volumes antigos Kura antes de reiniciar a pilha. Mantendo o armazenamento de blocos antigos com uma nova génese fará que a repetição falhe.

## Kubernetes {#kubernetes}

Para a Kubernetes, trate cada validador como infraestrutura com estado:

- dar a cada igual uma chave de identidade estável e um volume persistente estável
- Expor endereços P2P que outros pares possam resolver a partir do interior do cluster.
- montar arquivos de configuração e gênesis como configuração imutável para uma implantação
- implementar deliberadamente todas as alterações de gênese ou topologia, e não como uma atualização automática do mapa de configuração

Se um módulo reiniciar repetidamente, compare a configuração representada no módulo com o esperado [`peer.template.toml`](/pt/reference/peer-config/index.md#template) e verifique se o peer está reproduzindo dados antigos Kura.

## Perfil de Sora {#sora-profile}

As instalações Iroha 3 que utilizem fluxos Nexus, SoraFS ou de várias vias devem iniciar o daemon com o perfil Sora habilitado:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Usar o mesmo perfil de forma consistente entre os validadores da mesma rede.
