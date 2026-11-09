---
translation_locale: fr
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Démarrer Iroha 3 {#launch-iroha-3}

Exécutez quatre validateurs Iroha 3 sur une machine virtuelle (VM) Linux pour tester une intégration privée. Vous enverrez une transaction signée, arrêterez un validateur et vérifierez que les trois autres valident une deuxième transaction. Vous obtiendrez un registre autonome à accès restreint. Son raccordement à SORA Nexus en tant qu’espace de données soumis à des règles de gouvernance exige un provisionnement distinct.

## Préparer la VM {#prepare-the-vm}

Utilisez Linux x86_64 avec Docker Engine, Buildx, Compose v2, Python 3.8 ou version ultérieure, et `unzip`. Votre compte doit avoir accès à Docker. La première compilation nécessite un accès HTTPS sortant à GitHub, Docker Hub, aux miroirs de paquets Debian et à crates.io.

Nous avons compilé et testé le kit sur une VM dotée de six vCPU et de 32 GiB de RAM, avec quelques transactions synthétiques. Dimensionnez le stockage en fonction de la charge et de la durée de conservation des données. Utilisez une seule copie du kit par moteur Docker et laissez libres les ports 18080 à 18083 sur l’interface de bouclage.

[Téléchargez le kit de quatre validateurs](/downloads/iroha-trade-poc.zip). Il contient le lanceur, la liste des versions exactes des dépendances et les correctifs utilisés pour compiler le validateur et le client à partir de la même révision d’Iroha. Depuis le répertoire de téléchargement, vérifiez la somme de contrôle de l’archive et décompressez-la.

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## Démarrer et vérifier les quatre validateurs {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

Au premier démarrage, le lanceur construit l’image et génère sur la VM l’identifiant de la chaîne, les clés et le bloc de genèse signé. Chaque validateur dispose d’un volume persistant distinct. La vérification signe une transaction de test et attend que les quatre validateurs signalent trois pairs connectés et la même empreinte pour le nouveau bloc. Le bloc de genèse contient des comptes d’exemple. Utilisez des données synthétiques et gardez les APIs sur l’interface de bouclage.

Pour consulter l’état du premier validateur depuis la VM, demandez explicitement une réponse au format JSON.

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## Tester la panne d’un validateur {#test-a-validator-failure}

```sh
python3 poc.py failover
```

Le test arrête un validateur, soumet une nouvelle transaction et vérifie l’empreinte du bloc validé par les trois validateurs restants. Il redémarre ensuite le quatrième et attend que celui-ci atteigne le même bloc. La perte de la VM arrête les quatre validateurs. Pour simuler la perte d’un hôte physique, installez un validateur sur chacun de quatre hôtes indépendants.

## Arrêter et reprendre {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

Exécutez les deux commandes depuis le même répertoire d’extraction. Conservez le répertoire `state/` avec les quatre volumes Docker pour que les validateurs puissent rouvrir le même registre après leur redémarrage. Si le démarrage se bloque, exécutez `python3 poc.py logs` dans ce répertoire.

## Tester le point d’accès public {#try-the-public-endpoint}

Une application peut lire l’espace de données universel de SORA Nexus sur Taira sans exploiter de VM pour le registre. Depuis un poste de travail équipé de `curl` et de `jq`, essayez cette requête en lecture seule sur le réseau de test.

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

La réponse indique le nombre de pairs connectés au nœud interrogé, de blocs validés, de transactions approuvées et de transactions en attente. Pour préparer le déploiement, consultez [Déploiement du réseau](/fr/guide/best-practices/network-deployment.md).
