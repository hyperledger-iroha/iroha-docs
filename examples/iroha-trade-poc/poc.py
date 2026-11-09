#!/usr/bin/env python3
"""Run the four-validator trade PoC on a single Linux Docker Engine."""
import argparse
import binascii
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parent
STATE = ROOT / "state"
PEERS = ["peer0", "peer1", "peer2", "peer3"]
IMAGE = "iroha-trade-poc:dc7fdbcbbe-poc1"
PROJECT = "trade-iroha-poc"
API_PORT = 18080
P2P_PORT = 19337
PLATFORM = "linux/amd64"


def docker(*args, **kwargs):
    return subprocess.run(["docker", *args], check=True, **kwargs)


def compose(*args, **kwargs):
    return docker("compose", "--project-name", PROJECT, "--file", str(ROOT / "compose.json"), *args, **kwargs)


def image_available(image):
    return subprocess.run(["docker", "image", "inspect", image],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0


def ensure_images():
    if not image_available(IMAGE):
        print("Building the pinned PoC image on first use. Later starts reuse it.", flush=True)
        docker("buildx", "build", "--load", "--platform", PLATFORM, "-t", IMAGE,
               str(ROOT / "build-support"))


def write_compose():
    services = {}
    for i, peer in enumerate(PEERS):
        api_port = API_PORT + i
        services[peer] = {
            "image": IMAGE, "platform": PLATFORM, "pull_policy": "never",
            "entrypoint": ["/usr/local/bin/irohad"], "command": ["--config", "/network/peer.toml"],
            "environment": {"IROHA_BUILD_LINE": "iroha3", "KURA_STORE_DIR": "/storage",
                            "SNAPSHOT_STORE_DIR": "/storage/snapshot"},
            "init": True,
            "volumes": [f"./state/{peer}:/network:ro", f"data-{peer}:/storage"],
            "ports": [f"127.0.0.1:{api_port}:{api_port}"],
        }
    # The helper joins only the local bridge. Its account file is mounted read-only.
    services["client"] = {
        "image": IMAGE, "platform": PLATFORM, "pull_policy": "never", "profiles": ["tools"],
        "entrypoint": ["/usr/local/bin/iroha"], "volumes": ["./state/client:/client:ro"],
    }
    cfg = {"services": services, "volumes": {f"data-{p}": {} for p in PEERS}}
    compose_path = ROOT / "compose.json"
    content = json.dumps(cfg, indent=2) + "\n"
    if not compose_path.exists() or compose_path.read_text() != content:
        compose_path.write_text(content)


def socket_literal(host, port):
    # The public Iroha 3 wire format protects tagged socket literals with CRC16-CCITT.
    body = f"addr:{host}:{port}"
    return f"{body}#{binascii.crc_hqx(body.encode(), 0xFFFF):04X}"


def initialize():
    if STATE.exists():
        if not (STATE / "chain-id").is_file():
            raise RuntimeError("state is incomplete; move it aside or restore the entire previous state before starting.")
        return
    if subprocess.check_output(["docker", "volume", "ls", "--filter",
                                f"label=com.docker.compose.project={PROJECT}", "-q"], text=True).strip():
        raise RuntimeError("Existing PoC ledger volumes were found. Restore their matching state directory before starting.")
    chain_id = str(uuid.uuid4())
    with tempfile.TemporaryDirectory(prefix=".initialize-", dir=ROOT) as staging:
        stage = Path(staging)
        built = stage / "generated"
        built.mkdir()
        # Mounted at its final in-container path: Kagami signs genesis before the bind and peer addresses are adapted.
        docker("run", "--rm", "--platform", PLATFORM, "--network", "none",
               "--user", f"{os.getuid()}:{os.getgid()}", "--mount", f"type=bind,src={built},dst=/network",
               "-e", f"IROHA_LOCALNET_CHAIN_ID={chain_id}", "--entrypoint", "/bin/sh", IMAGE, "-ec",
               'umask 077; seed=$(od -An -N32 -tx1 /dev/urandom | tr -d " \\n"); '
               'exec kagami localnet --build-line iroha3 --consensus-mode permissioned --peers 4 '
               f'--bind-host 0.0.0.0 --public-host 127.0.0.1 --base-api-port {API_PORT} '
               f'--base-p2p-port {P2P_PORT} --out-dir /network --seed "$seed"')
        final = stage / "ready"
        final.mkdir()
        for i, peer in enumerate(PEERS):
            dest = final / peer
            dest.mkdir()
            config = (built / f"{peer}.toml").read_text()
            for j, neighbor in enumerate(PEERS):
                port = P2P_PORT + j
                old = socket_literal("127.0.0.1", port)
                if old not in config:
                    raise RuntimeError(f"Expected generated P2P address {old} in {peer}")
                config = config.replace(old, socket_literal(neighbor, port))
                config = config.replace(f"http://127.0.0.1:{API_PORT + j}", f"http://{neighbor}:{API_PORT + j}")
            config = config.replace(f"/network/storage/{peer}", "/storage")
            if "/network/storage/" in config or f"{peer}:{P2P_PORT + i}" not in config:
                raise RuntimeError(f"Unexpected generated paths or peer addresses in {peer}")
            (dest / "peer.toml").write_text(config)
            shutil.copyfile(built / "genesis.signed.nrt", dest / "genesis.signed.nrt")
            # The daemon runs as its image UID. The state parent remains owner-only on the VM.
            dest.chmod(0o755)
            (dest / "peer.toml").chmod(0o444)
            (dest / "genesis.signed.nrt").chmod(0o444)
        clientdir = final / "client"
        clientdir.mkdir()
        clientdir.chmod(0o755)
        client_config = (built / "client.toml").read_text().replace(
            f"127.0.0.1:{API_PORT}", f"peer0:{API_PORT}")
        (clientdir / "client.toml").write_text(client_config)
        (clientdir / "client.toml").chmod(0o444)
        (final / "chain-id").write_text(chain_id + "\n")
        final.rename(STATE)
    print(f"Created private PoC chain {chain_id}.", flush=True)


def read_peer(peer, route):
    port = API_PORT + PEERS.index(peer)
    raw = subprocess.run(
        ["docker", "compose", "-p", PROJECT, "-f", str(ROOT / "compose.json"), "exec", "-T", peer,
         "curl", "-fsS", "--max-time", "3", "-H", "Accept: application/json", f"http://127.0.0.1:{port}/{route}"],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=12)
    if raw.returncode == 0:
        return json.loads(raw.stdout)
    return {}


def wait_for(peers, baseline=None):
    until = time.monotonic() + 180
    while time.monotonic() < until:
        states = [read_peer(p, "status") for p in peers]
        if all(s.get("peers", -1) == len(peers) - 1 and s.get("blocks", 0) > 0 for s in states):
            heights = {s["blocks"] for s in states}
            if len(heights) == 1 and (baseline is None or min(heights) > baseline):
                height = min(heights)
                hashes = [read_peer(p, f"v1/explorer/blocks/{height}").get("hash") for p in peers]
                if all(hashes) and len(set(hashes)) == 1:
                    print("  ".join(f"{p}: block {s['blocks']}, peers {s['peers']}" for p, s in zip(peers, states)))
                    print(f"Committed block hash: {hashes[0]}")
                    return height
        time.sleep(2)
    raise RuntimeError("Peers did not reach the expected block height and peer count within 180s. Run python3 poc.py logs.")


def transact():
    compose("run", "--rm", "--no-deps", "-T", "client", "--config", "/client/client.toml",
            "tx", "ping", "--msg", "trade-poc-check-" + uuid.uuid4().hex[:12], timeout=120)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["up", "status", "verify", "failover", "logs", "down"])
    action = parser.parse_args().action
    os.umask(0o077)
    write_compose()
    if action == "up":
        ensure_images()
        initialize()
        compose("up", "-d", *PEERS)
        wait_for(PEERS)
    elif action == "status":
        wait_for(PEERS)
    elif action in ("verify", "failover"):
        peers = PEERS
        if action == "failover":
            wait_for(PEERS)
            compose("stop", PEERS[-1])
            peers = PEERS[:-1]
        try:
            height = wait_for(peers)
            transact()
            wait_for(peers, height)
        finally:
            if action == "failover":
                compose("start", PEERS[-1])
                wait_for(PEERS)
    elif action == "logs":
        compose("logs", "--tail", "100", *PEERS)
    else:
        compose("down")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, subprocess.SubprocessError, ValueError) as exc:
        sys.exit(str(exc))
