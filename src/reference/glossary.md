# Glossary <!-- omit in toc -->

Here you can find definitions of all Iroha-related entities.

- [Peer](#peer)
- [Asset](#asset)
- [Byzantine fault-tolerance (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Components](#iroha-components)
  - [Sumeragi (Emperor)](#sumeragi-emperor)
  - [Torii (Gate)](#torii-gate)
  - [Kura (Warehouse)](#kura-warehouse)
  - [Kagami(Teacher and Exemplar and/or looking glass)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle tree (hash tree)](#merkle-tree-hash-tree)
  - [Smart contracts](#smart-contracts)
  - [Triggers](#triggers)
  - [Versioning](#versioning)
  - [Hijiri (peer reputation system)](#hijiri-peer-reputation-system)
- [Iroha Modules](#iroha-modules)
- [Iroha Special Instructions (ISI)](#iroha-special-instructions-isi)
  - [Utility Iroha Special Instructions](#utility-iroha-special-instructions)
  - [Core Iroha Special Instructions](#core-iroha-special-instructions)
  - [Domain-specific Iroha Special Instructions](#domain-specific-iroha-special-instructions)
  - [Custom Iroha Special Instruction](#custom-iroha-special-instruction)
- [Iroha Query](#iroha-query)
- [View change](#view-change)
- [World state view (WSV)](#world-state-view-wsv)
- [Leader](#leader)

## Blockchain ledgers

Blockchain ledgers are digital record-keeping systems that use blockchain technology to keep financial records. These are named after old-fashioned books that were used for financial records such as prices, news, and transaction information.

During medieval times, ledger books were open for public viewing and accuracy verification. This idea is reflected in the blockchain-based systems that can check the stored data for validity.

## Peer

A peer is an Iroha node process that accepts connections from other peers and client applications. A machine can host multiple peers with separate configuration and storage. Each peer starting consensus from an empty state authenticates and applies the network's signed genesis; peers restored from authenticated snapshots resume from that state.

Other blockchains may refer to the same concept as a node or a validator.

A peer can be a process on its host system. It also can be contained in a Docker container and a Kubernetes pod.

## Asset

In the context of blockchains, an asset is the representation of a valuable object on the blockchain.

Additional information on assets is available [here](/blockchain/assets.md).

### Fungible assets

Such assets can be easily swapped for other assets of the same type because they are interchangeable.

As an example, all units of the same currency are equal in their value and can be used to purchase goods. Typically, fungible assets are identical in appearance, aside from the wear of banknotes and coins.

### Non-fungible assets

Non-fungible assets are unique and valuable due to their specific characteristics and rarity; their value cannot be compared to other assets.

- A painting's value can vary based on the artist, the time period it was painted, and the public's interest in it.
- Two houses on the same street may have differing levels of maintenance.
- Jewellery manufacturers typically offer a range of different designs.

### Mintable assets

An asset is mintable if more of the same type can be issued.

### Non-mintable assets

If the initial amount of an asset is specified once and doesn't change, it is considered non-mintable.

The [Genesis block](/guide/configure/genesis.md) sets this information for the Iroha configuration.

## Byzantine fault-tolerance (BFT)

The property of being able to properly function with a network containing a certain percentage of malicious actors. A Sumeragi committee has exactly `3f + 1` validators and tolerates up to `f` Byzantine validators, fewer than one third of the committee.

## Iroha Components

Rust modules containing Iroha functionality.

### Sumeragi (Emperor)

The Iroha module responsible for consensus.

### Torii (Gate)

Module with the incoming request handling logic for the [peer](#peer). It is used to receive, accept and route incoming instructions, HTTP queries, and operator configuration inspection.

### Kura (Warehouse)

Persistent block storage. Kura stores signed blocks, block hashes, height indexes, recovery sidecars, and commit-roster metadata on disk. The [World State View](#world-state-view-wsv) is rebuilt from Kura blocks when a state snapshot is unavailable or behind the local block store. See [Kura storage](/blockchain/world.md#kura-storage).

### Kagami(Teacher and Exemplar and/or looking glass)

Generator for commonly used data. It can generate cryptographic key pairs, genesis blocks, documentation, etc.

### Merkle tree (hash tree)

A data structure used to validate and verify the state at each block height. Iroha's current implementation is a binary tree. See [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) for more details.

### Smart contracts

Smart contracts are blockchain-based programs that run when a specific set of conditions is met. In Iroha 3, smart contracts are written in Kotodama and compiled to IVM bytecode (`.to`); a contract changes state by issuing [Iroha special instructions](#core-iroha-special-instructions) through host calls.

### Triggers

An event type that allows invoking an Iroha special instruction at specific block commit, time (with some caveats), etc. More on triggers [here](/blockchain/triggers.md).

### Versioning

Iroha 3's first release supports one canonical block-wire version. The `/v1/api/version` endpoint reports `SignedBlock::WIRE_VERSION` after genesis is applied and returns an unavailable response before then. This reports the supported wire format; it does not negotiate compatibility between different protocol layouts or authorize a network upgrade.

### Hijiri (peer reputation system)

Iroha's peer and account reputation system. Its consensus-owned parameters hold the Hijiri fee policy and account-risk records, and governed observer registries issue account attestations that adjust an account's risk score.

## Iroha Modules

Third party extensions to Iroha that provide custom functionality.

## Iroha Special Instructions (ISI)

A library of smart contracts provided with Iroha. These can be invoked via either transactions or registered event listeners. More on ISI [here](/blockchain/instructions.md).

#### Utility Iroha Special Instructions

This set of [isi](#iroha-special-instructions-isi) contains instructions that do not change a domain-specific entity, such as `Log`, `ExecuteTrigger`, `SetParameter`, and `Upgrade`. Iroha 3 has no `If`, `Notify`, or `Sequence` instructions.

### Core Iroha Special Instructions

[Special instructions](#iroha-special-instructions-isi) provided with every Iroha deployment. These include some [domain-specific](#domain-specific-iroha-special-instructions) as well as [utility instructions](#utility-iroha-special-instructions).

### Domain-specific Iroha Special Instructions

Instructions related to domain-specific activities: assets, accounts, domains, peer management). These provide the tools necessary to make changes to the [World State View](#world-state-view-wsv) in a secure and safe manner.

### Custom Iroha Special Instruction

Instructions provided in [Iroha Modules](#iroha-modules), by clients or 3rd parties. These can only be built using [the Core Instructions](#core-iroha-special-instructions). Forking and modifying the Iroha source code is not recommended, as special instructions not agreed-upon by [peers](#peer) in an Iroha deployment will be treated as faults, thus [peers](#peer) running a modified instance will have their access revoked.

## Iroha Query

A request to read the World State View without modifying said view. More on queries [here](/blockchain/queries.md).

## View change

A process that takes place in case of a failed attempt at consensus. Usually this entails the election of a new [Leader](#leader).

## World state view (WSV)

In-memory representation of the current blockchain state. The WSV contains the `World`, committed block hashes, transaction indexes, consensus topology, and derived indexes used by queries. It is updated only through committed blocks and can be reconstructed from [Kura](#kura-warehouse). See [World State View](/blockchain/world.md#world-state-view-wsv).

## Leader

For each height and view, Sumeragi derives the proposer deterministically from the committee, authenticated leader seed, and committed skipped-leader history. A [view change](#view-change) rotates to the next eligible committee member under the same [Byzantine fault tolerance](#byzantine-fault-tolerance-bft) rules.
