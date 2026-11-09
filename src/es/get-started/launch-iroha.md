---
translation_locale: es
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iniciar Iroha 3 {#launch-iroha-3}

Ejecute cuatro validadores de Iroha 3 en una máquina virtual (VM) Linux para probar una integración privada. Enviará una transacción firmada, detendrá un validador y comprobará que los otros tres confirmen una segunda transacción. Así se crea un registro independiente con acceso restringido. Para conectarlo a SORA Nexus como espacio de datos sujeto a gobernanza, hace falta un aprovisionamiento adicional.

## Preparar la VM {#prepare-the-vm}

Utilice Linux x86_64 con Docker Engine, Buildx, Compose v2, Python 3.8 o posterior y `unzip`. Su cuenta necesita acceso a Docker. La primera compilación requiere acceso HTTPS saliente a GitHub, Docker Hub, los servidores de réplica de paquetes de Debian y crates.io.

Compilamos y probamos el kit en una VM con seis vCPU y 32 GiB de RAM, utilizando unas pocas transacciones sintéticas. Dimensione el almacenamiento según la carga de trabajo y el plazo de conservación de los datos. Use una copia del kit por cada instancia de Docker Engine y deje libres los puertos 18080–18083 de la interfaz de loopback.

[Descargue el kit de cuatro validadores](/downloads/iroha-trade-poc.zip). Incluye el programa de inicio, una lista de dependencias con versiones fijadas y los parches para compilar el validador y el cliente a partir de la misma revisión de Iroha. Desde el directorio de descarga, compruebe la suma de verificación del archivo y descomprímalo.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Iniciar y verificar los cuatro validadores {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

En el primer arranque se compila la imagen y se generan el identificador de la cadena, las claves y el bloque génesis firmado en la VM. Cada validador tiene su propio volumen persistente. La verificación firma una transacción de prueba y espera a que los cuatro validadores indiquen que tienen tres pares conectados y que el hash del nuevo bloque es idéntico. El bloque génesis incluye cuentas de ejemplo. Use datos sintéticos y mantenga las APIs en la interfaz de loopback.

Para consultar el estado del primer validador desde la VM, solicite explícitamente el formato JSON.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Probar el fallo de un validador {#test-a-validator-failure}

```sh
python3 poc.py failover
```

La prueba detiene un validador, envía una nueva transacción y comprueba el hash del bloque confirmado en los tres validadores que siguen activos. A continuación, reinicia el cuarto y espera a que alcance el mismo bloque. Si falla la VM, se detienen los cuatro validadores. Para probar la pérdida de un servidor físico, instale un validador en cada uno de cuatro servidores independientes.

## Detener y reanudar {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

Ejecute ambos comandos desde el mismo directorio en el que descomprimió el kit. Conserve juntos el directorio `state/` y los cuatro volúmenes de Docker para que los validadores puedan volver a abrir el mismo registro tras el reinicio. Si el arranque se bloquea, ejecute `python3 poc.py logs` en ese directorio.

## Probar el acceso público a la API {#try-the-public-endpoint}

Una aplicación puede leer el espacio de datos universal de SORA Nexus en Taira sin ejecutar una VM para el registro. Desde una estación de trabajo con `curl` y `jq`, pruebe esta solicitud de solo lectura en la red de pruebas.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

La respuesta indica cuántos pares están conectados al nodo consultado, cuántos bloques se han confirmado y cuántas transacciones se han aprobado o permanecen en cola. Para planificar el despliegue, consulte [Despliegue de la red](/es/guide/best-practices/network-deployment.md).
