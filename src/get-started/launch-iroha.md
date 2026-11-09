# Launch Iroha 3

Run four Iroha 3 validators on one Linux VM to test a private integration. You will submit a signed transaction, stop one validator, and check that the other three commit another transaction. This creates a standalone permissioned ledger. Connecting it to SORA Nexus as a governed data space requires separate provisioning.

## Prepare the VM

Use Linux x86_64 with Docker Engine, Buildx, Compose v2, Python 3.8 or later, and `unzip`. Your account needs Docker access. The first build needs outbound HTTPS access to GitHub, Docker Hub, Debian package mirrors and crates.io.

We built and tested the kit on a VM with six vCPUs and 32 GiB RAM using a few synthetic transactions. Size storage for your own workload and retention period. Use one copy of the kit per Docker engine and keep loopback ports 18080–18083 available.

[Download the four-validator kit](/downloads/iroha-trade-poc.zip). It includes the launcher, a locked dependency list and the patches used to build the validator and client from the same pinned Iroha revision. From the directory containing the download, verify and unpack it.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Start and verify all four validators

```sh
python3 poc.py up
python3 poc.py verify
```

The first start builds the image and generates the chain ID, keys and signed genesis on your VM. Each validator has its own persistent volume. The verification signs a test transaction and waits for all four validators to report three connected peers and the same new block hash. The genesis includes sample accounts. Use synthetic data and keep the APIs on loopback.

To read the first validator's status from the VM, request JSON explicitly.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Test a validator failure

```sh
python3 poc.py failover
```

The test stops one validator, submits a new transaction and checks the committed block hash on the three survivors. It then restarts the fourth validator and waits for it to reach the same block. Loss of the VM stops all four validators. To test loss of any one physical host, place one validator on each of four independent hosts.

## Stop and resume

```sh
python3 poc.py down
python3 poc.py up
```

Run both commands from the same extracted directory. Keep its `state/` directory and the four Docker volumes together so the restarted validators can open the same ledger. If startup stalls, run `python3 poc.py logs` there.

## Try the public endpoint

An application can read the SORA Nexus universal data space on Taira without running a ledger VM. From a workstation with `curl` and `jq`, try this read-only testnet request.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

The response reports the queried node's connected peers, committed blocks, approved transactions and queued transactions. For deployment planning, see [Network Deployment](/guide/best-practices/network-deployment.md).
