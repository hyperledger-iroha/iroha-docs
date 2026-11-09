---
translation_locale: pt
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iniciar o Iroha 3 {#launch-iroha-3}

Execute quatro validadores do Iroha 3 em uma máquina virtual (VM) Linux para testar uma integração privada. Você enviará uma transação assinada, interromperá um validador e verificará se os outros três confirmam uma segunda transação. Isso cria um livro-razão independente com acesso restrito. Para conectá-lo à SORA Nexus como espaço de dados sujeito a governança, é necessário um provisionamento separado.

## Preparar a VM {#prepare-the-vm}

Use Linux x86_64 com Docker Engine, Buildx, Compose v2, Python 3.8 ou posterior e `unzip`. Sua conta precisa de acesso ao Docker. A primeira compilação requer acesso HTTPS de saída ao GitHub, ao Docker Hub, aos espelhos de pacotes do Debian e a crates.io.

Compilamos e testamos o kit em uma VM com seis vCPUs e 32 GiB de RAM, usando algumas transações sintéticas. Dimensione o armazenamento conforme a carga de trabalho e o período de retenção dos dados. Use uma cópia do kit por instância do Docker Engine e deixe livres as portas de loopback 18080–18083.

[Baixe o kit de quatro validadores](/downloads/iroha-trade-poc.zip). Ele contém o programa de inicialização, uma lista de dependências com versões fixas e os patches usados para compilar o validador e o cliente a partir da mesma revisão do Iroha. No diretório do download, confira a soma de verificação do arquivo e descompacte-o.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Iniciar e verificar os quatro validadores {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

Na primeira inicialização, a imagem é compilada e são gerados o identificador da cadeia, as chaves e o bloco gênese assinado na VM. Cada validador tem seu próprio volume persistente. A verificação assina uma transação de teste e aguarda até que os quatro validadores indiquem três pares conectados e o mesmo hash para o novo bloco. O bloco gênese inclui contas de exemplo. Use dados sintéticos e mantenha as APIs na interface de loopback.

Para consultar o estado do primeiro validador a partir da VM, solicite explicitamente o formato JSON.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Testar a falha de um validador {#test-a-validator-failure}

```sh
python3 poc.py failover
```

O teste interrompe um validador, envia uma nova transação e verifica o hash do bloco confirmado nos três validadores que continuam em execução. Em seguida, reinicia o quarto e aguarda até que ele alcance o mesmo bloco. A perda da VM interrompe os quatro validadores. Para testar a perda de um servidor físico, coloque um validador em cada um de quatro servidores independentes.

## Parar e retomar {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

Execute os dois comandos no mesmo diretório em que extraiu o kit. Mantenha o diretório `state/` e os quatro volumes do Docker juntos para que os validadores reiniciados possam abrir o mesmo livro-razão. Se a inicialização travar, execute `python3 poc.py logs` nesse diretório.

## Testar o acesso à API pública {#try-the-public-endpoint}

Uma aplicação pode ler o espaço de dados universal da SORA Nexus na Taira sem executar uma VM para o livro-razão. Em uma estação de trabalho com `curl` e `jq`, experimente esta solicitação de leitura à rede de testes.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

A resposta informa o número de pares conectados ao nó consultado, de blocos confirmados, de transações aprovadas e de transações em fila. Para planejar a implantação, consulte [Implantação de rede](/pt/guide/best-practices/network-deployment.md).
