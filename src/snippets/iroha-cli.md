# Command-Line Help for `iroha`

This document contains the help content for the `iroha` command-line program.

**Command Overview:**

* [`iroha`↴](#iroha)
* [`iroha account`↴](#iroha-account)
* [`iroha account role`↴](#iroha-account-role)
* [`iroha account role list`↴](#iroha-account-role-list)
* [`iroha account role grant`↴](#iroha-account-role-grant)
* [`iroha account role revoke`↴](#iroha-account-role-revoke)
* [`iroha account permission`↴](#iroha-account-permission)
* [`iroha account permission list`↴](#iroha-account-permission-list)
* [`iroha account permission grant`↴](#iroha-account-permission-grant)
* [`iroha account permission revoke`↴](#iroha-account-permission-revoke)
* [`iroha account list`↴](#iroha-account-list)
* [`iroha account list all`↴](#iroha-account-list-all)
* [`iroha account list filter`↴](#iroha-account-list-filter)
* [`iroha account get`↴](#iroha-account-get)
* [`iroha account register`↴](#iroha-account-register)
* [`iroha account unregister`↴](#iroha-account-unregister)
* [`iroha account meta`↴](#iroha-account-meta)
* [`iroha account meta get`↴](#iroha-account-meta-get)
* [`iroha account meta set`↴](#iroha-account-meta-set)
* [`iroha account meta remove`↴](#iroha-account-meta-remove)
* [`iroha tx`↴](#iroha-tx)
* [`iroha tx status`↴](#iroha-tx-status)
* [`iroha tx get`↴](#iroha-tx-get)
* [`iroha tx ping`↴](#iroha-tx-ping)
* [`iroha tx ivm`↴](#iroha-tx-ivm)
* [`iroha tx stdin`↴](#iroha-tx-stdin)
* [`iroha tx signed-size`↴](#iroha-tx-signed-size)
* [`iroha ledger`↴](#iroha-ledger)
* [`iroha ledger domain`↴](#iroha-ledger-domain)
* [`iroha ledger domain list`↴](#iroha-ledger-domain-list)
* [`iroha ledger domain list all`↴](#iroha-ledger-domain-list-all)
* [`iroha ledger domain list filter`↴](#iroha-ledger-domain-list-filter)
* [`iroha ledger domain get`↴](#iroha-ledger-domain-get)
* [`iroha ledger domain unregister`↴](#iroha-ledger-domain-unregister)
* [`iroha ledger domain transfer`↴](#iroha-ledger-domain-transfer)
* [`iroha ledger domain meta`↴](#iroha-ledger-domain-meta)
* [`iroha ledger domain meta get`↴](#iroha-ledger-domain-meta-get)
* [`iroha ledger domain meta set`↴](#iroha-ledger-domain-meta-set)
* [`iroha ledger domain meta remove`↴](#iroha-ledger-domain-meta-remove)
* [`iroha ledger account`↴](#iroha-ledger-account)
* [`iroha ledger account role`↴](#iroha-ledger-account-role)
* [`iroha ledger account role list`↴](#iroha-ledger-account-role-list)
* [`iroha ledger account role grant`↴](#iroha-ledger-account-role-grant)
* [`iroha ledger account role revoke`↴](#iroha-ledger-account-role-revoke)
* [`iroha ledger account permission`↴](#iroha-ledger-account-permission)
* [`iroha ledger account permission list`↴](#iroha-ledger-account-permission-list)
* [`iroha ledger account permission grant`↴](#iroha-ledger-account-permission-grant)
* [`iroha ledger account permission revoke`↴](#iroha-ledger-account-permission-revoke)
* [`iroha ledger account list`↴](#iroha-ledger-account-list)
* [`iroha ledger account list all`↴](#iroha-ledger-account-list-all)
* [`iroha ledger account list filter`↴](#iroha-ledger-account-list-filter)
* [`iroha ledger account get`↴](#iroha-ledger-account-get)
* [`iroha ledger account register`↴](#iroha-ledger-account-register)
* [`iroha ledger account unregister`↴](#iroha-ledger-account-unregister)
* [`iroha ledger account meta`↴](#iroha-ledger-account-meta)
* [`iroha ledger account meta get`↴](#iroha-ledger-account-meta-get)
* [`iroha ledger account meta set`↴](#iroha-ledger-account-meta-set)
* [`iroha ledger account meta remove`↴](#iroha-ledger-account-meta-remove)
* [`iroha ledger asset`↴](#iroha-ledger-asset)
* [`iroha ledger asset definition`↴](#iroha-ledger-asset-definition)
* [`iroha ledger asset definition list`↴](#iroha-ledger-asset-definition-list)
* [`iroha ledger asset definition list all`↴](#iroha-ledger-asset-definition-list-all)
* [`iroha ledger asset definition list filter`↴](#iroha-ledger-asset-definition-list-filter)
* [`iroha ledger asset definition get`↴](#iroha-ledger-asset-definition-get)
* [`iroha ledger asset definition register`↴](#iroha-ledger-asset-definition-register)
* [`iroha ledger asset definition unregister`↴](#iroha-ledger-asset-definition-unregister)
* [`iroha ledger asset definition transfer`↴](#iroha-ledger-asset-definition-transfer)
* [`iroha ledger asset definition meta`↴](#iroha-ledger-asset-definition-meta)
* [`iroha ledger asset definition meta get`↴](#iroha-ledger-asset-definition-meta-get)
* [`iroha ledger asset definition meta set`↴](#iroha-ledger-asset-definition-meta-set)
* [`iroha ledger asset definition meta remove`↴](#iroha-ledger-asset-definition-meta-remove)
* [`iroha ledger asset get`↴](#iroha-ledger-asset-get)
* [`iroha ledger asset list`↴](#iroha-ledger-asset-list)
* [`iroha ledger asset list all`↴](#iroha-ledger-asset-list-all)
* [`iroha ledger asset list filter`↴](#iroha-ledger-asset-list-filter)
* [`iroha ledger asset mint`↴](#iroha-ledger-asset-mint)
* [`iroha ledger asset burn`↴](#iroha-ledger-asset-burn)
* [`iroha ledger asset transfer`↴](#iroha-ledger-asset-transfer)
* [`iroha ledger nft`↴](#iroha-ledger-nft)
* [`iroha ledger nft get`↴](#iroha-ledger-nft-get)
* [`iroha ledger nft list`↴](#iroha-ledger-nft-list)
* [`iroha ledger nft list all`↴](#iroha-ledger-nft-list-all)
* [`iroha ledger nft list filter`↴](#iroha-ledger-nft-list-filter)
* [`iroha ledger nft register`↴](#iroha-ledger-nft-register)
* [`iroha ledger nft unregister`↴](#iroha-ledger-nft-unregister)
* [`iroha ledger nft transfer`↴](#iroha-ledger-nft-transfer)
* [`iroha ledger nft meta`↴](#iroha-ledger-nft-meta)
* [`iroha ledger nft meta get`↴](#iroha-ledger-nft-meta-get)
* [`iroha ledger nft meta set`↴](#iroha-ledger-nft-meta-set)
* [`iroha ledger nft meta remove`↴](#iroha-ledger-nft-meta-remove)
* [`iroha ledger rwa`↴](#iroha-ledger-rwa)
* [`iroha ledger rwa get`↴](#iroha-ledger-rwa-get)
* [`iroha ledger rwa list`↴](#iroha-ledger-rwa-list)
* [`iroha ledger rwa list all`↴](#iroha-ledger-rwa-list-all)
* [`iroha ledger rwa list filter`↴](#iroha-ledger-rwa-list-filter)
* [`iroha ledger rwa register`↴](#iroha-ledger-rwa-register)
* [`iroha ledger rwa transfer`↴](#iroha-ledger-rwa-transfer)
* [`iroha ledger rwa merge`↴](#iroha-ledger-rwa-merge)
* [`iroha ledger rwa redeem`↴](#iroha-ledger-rwa-redeem)
* [`iroha ledger rwa freeze`↴](#iroha-ledger-rwa-freeze)
* [`iroha ledger rwa unfreeze`↴](#iroha-ledger-rwa-unfreeze)
* [`iroha ledger rwa hold`↴](#iroha-ledger-rwa-hold)
* [`iroha ledger rwa release`↴](#iroha-ledger-rwa-release)
* [`iroha ledger rwa force-transfer`↴](#iroha-ledger-rwa-force-transfer)
* [`iroha ledger rwa set-controls`↴](#iroha-ledger-rwa-set-controls)
* [`iroha ledger rwa meta`↴](#iroha-ledger-rwa-meta)
* [`iroha ledger rwa meta get`↴](#iroha-ledger-rwa-meta-get)
* [`iroha ledger rwa meta set`↴](#iroha-ledger-rwa-meta-set)
* [`iroha ledger rwa meta remove`↴](#iroha-ledger-rwa-meta-remove)
* [`iroha ledger peer`↴](#iroha-ledger-peer)
* [`iroha ledger peer list`↴](#iroha-ledger-peer-list)
* [`iroha ledger peer list all`↴](#iroha-ledger-peer-list-all)
* [`iroha ledger peer register`↴](#iroha-ledger-peer-register)
* [`iroha ledger peer unregister`↴](#iroha-ledger-peer-unregister)
* [`iroha ledger role`↴](#iroha-ledger-role)
* [`iroha ledger role permission`↴](#iroha-ledger-role-permission)
* [`iroha ledger role permission list`↴](#iroha-ledger-role-permission-list)
* [`iroha ledger role permission grant`↴](#iroha-ledger-role-permission-grant)
* [`iroha ledger role permission revoke`↴](#iroha-ledger-role-permission-revoke)
* [`iroha ledger role list`↴](#iroha-ledger-role-list)
* [`iroha ledger role list all`↴](#iroha-ledger-role-list-all)
* [`iroha ledger role register`↴](#iroha-ledger-role-register)
* [`iroha ledger role unregister`↴](#iroha-ledger-role-unregister)
* [`iroha ledger parameter`↴](#iroha-ledger-parameter)
* [`iroha ledger parameter list`↴](#iroha-ledger-parameter-list)
* [`iroha ledger parameter list all`↴](#iroha-ledger-parameter-list-all)
* [`iroha ledger parameter set`↴](#iroha-ledger-parameter-set)
* [`iroha ledger trigger`↴](#iroha-ledger-trigger)
* [`iroha ledger trigger list`↴](#iroha-ledger-trigger-list)
* [`iroha ledger trigger list all`↴](#iroha-ledger-trigger-list-all)
* [`iroha ledger trigger get`↴](#iroha-ledger-trigger-get)
* [`iroha ledger trigger register`↴](#iroha-ledger-trigger-register)
* [`iroha ledger trigger unregister`↴](#iroha-ledger-trigger-unregister)
* [`iroha ledger trigger mint`↴](#iroha-ledger-trigger-mint)
* [`iroha ledger trigger burn`↴](#iroha-ledger-trigger-burn)
* [`iroha ledger trigger enable`↴](#iroha-ledger-trigger-enable)
* [`iroha ledger trigger disable`↴](#iroha-ledger-trigger-disable)
* [`iroha ledger trigger execute`↴](#iroha-ledger-trigger-execute)
* [`iroha ledger trigger inspect`↴](#iroha-ledger-trigger-inspect)
* [`iroha ledger trigger completed`↴](#iroha-ledger-trigger-completed)
* [`iroha ledger trigger completed list`↴](#iroha-ledger-trigger-completed-list)
* [`iroha ledger trigger completed watch`↴](#iroha-ledger-trigger-completed-watch)
* [`iroha ledger trigger meta`↴](#iroha-ledger-trigger-meta)
* [`iroha ledger trigger meta get`↴](#iroha-ledger-trigger-meta-get)
* [`iroha ledger trigger meta set`↴](#iroha-ledger-trigger-meta-set)
* [`iroha ledger trigger meta remove`↴](#iroha-ledger-trigger-meta-remove)
* [`iroha ledger query`↴](#iroha-ledger-query)
* [`iroha ledger query stdin`↴](#iroha-ledger-query-stdin)
* [`iroha ledger query stdin-raw`↴](#iroha-ledger-query-stdin-raw)
* [`iroha ledger transaction`↴](#iroha-ledger-transaction)
* [`iroha ledger transaction status`↴](#iroha-ledger-transaction-status)
* [`iroha ledger transaction get`↴](#iroha-ledger-transaction-get)
* [`iroha ledger transaction ping`↴](#iroha-ledger-transaction-ping)
* [`iroha ledger transaction ivm`↴](#iroha-ledger-transaction-ivm)
* [`iroha ledger transaction stdin`↴](#iroha-ledger-transaction-stdin)
* [`iroha ledger transaction signed-size`↴](#iroha-ledger-transaction-signed-size)
* [`iroha ledger multisig`↴](#iroha-ledger-multisig)
* [`iroha ledger multisig list`↴](#iroha-ledger-multisig-list)
* [`iroha ledger multisig list all`↴](#iroha-ledger-multisig-list-all)
* [`iroha ledger multisig register`↴](#iroha-ledger-multisig-register)
* [`iroha ledger multisig propose`↴](#iroha-ledger-multisig-propose)
* [`iroha ledger multisig approve`↴](#iroha-ledger-multisig-approve)
* [`iroha ledger multisig cancel`↴](#iroha-ledger-multisig-cancel)
* [`iroha ledger multisig inspect`↴](#iroha-ledger-multisig-inspect)
* [`iroha ledger events`↴](#iroha-ledger-events)
* [`iroha ledger events state`↴](#iroha-ledger-events-state)
* [`iroha ledger events governance`↴](#iroha-ledger-events-governance)
* [`iroha ledger events transaction`↴](#iroha-ledger-events-transaction)
* [`iroha ledger events block`↴](#iroha-ledger-events-block)
* [`iroha ledger events trigger-execute`↴](#iroha-ledger-events-trigger-execute)
* [`iroha ledger events trigger-complete`↴](#iroha-ledger-events-trigger-complete)
* [`iroha ledger blocks`↴](#iroha-ledger-blocks)
* [`iroha trigger`↴](#iroha-trigger)
* [`iroha trigger list`↴](#iroha-trigger-list)
* [`iroha trigger list all`↴](#iroha-trigger-list-all)
* [`iroha trigger get`↴](#iroha-trigger-get)
* [`iroha trigger register`↴](#iroha-trigger-register)
* [`iroha trigger unregister`↴](#iroha-trigger-unregister)
* [`iroha trigger mint`↴](#iroha-trigger-mint)
* [`iroha trigger burn`↴](#iroha-trigger-burn)
* [`iroha trigger enable`↴](#iroha-trigger-enable)
* [`iroha trigger disable`↴](#iroha-trigger-disable)
* [`iroha trigger execute`↴](#iroha-trigger-execute)
* [`iroha trigger inspect`↴](#iroha-trigger-inspect)
* [`iroha trigger completed`↴](#iroha-trigger-completed)
* [`iroha trigger completed list`↴](#iroha-trigger-completed-list)
* [`iroha trigger completed watch`↴](#iroha-trigger-completed-watch)
* [`iroha trigger meta`↴](#iroha-trigger-meta)
* [`iroha trigger meta get`↴](#iroha-trigger-meta-get)
* [`iroha trigger meta set`↴](#iroha-trigger-meta-set)
* [`iroha trigger meta remove`↴](#iroha-trigger-meta-remove)
* [`iroha ops`↴](#iroha-ops)
* [`iroha ops executor`↴](#iroha-ops-executor)
* [`iroha ops executor data-model`↴](#iroha-ops-executor-data-model)
* [`iroha ops executor upgrade`↴](#iroha-ops-executor-upgrade)
* [`iroha ops runtime`↴](#iroha-ops-runtime)
* [`iroha ops runtime abi`↴](#iroha-ops-runtime-abi)
* [`iroha ops runtime abi active`↴](#iroha-ops-runtime-abi-active)
* [`iroha ops runtime abi active-query`↴](#iroha-ops-runtime-abi-active-query)
* [`iroha ops runtime abi hash`↴](#iroha-ops-runtime-abi-hash)
* [`iroha ops runtime upgrade`↴](#iroha-ops-runtime-upgrade)
* [`iroha ops runtime upgrade list`↴](#iroha-ops-runtime-upgrade-list)
* [`iroha ops runtime upgrade propose`↴](#iroha-ops-runtime-upgrade-propose)
* [`iroha ops runtime upgrade activate`↴](#iroha-ops-runtime-upgrade-activate)
* [`iroha ops runtime upgrade cancel`↴](#iroha-ops-runtime-upgrade-cancel)
* [`iroha ops runtime status`↴](#iroha-ops-runtime-status)
* [`iroha ops runtime capabilities`↴](#iroha-ops-runtime-capabilities)
* [`iroha ops sumeragi`↴](#iroha-ops-sumeragi)
* [`iroha ops sumeragi status`↴](#iroha-ops-sumeragi-status)
* [`iroha ops sumeragi diagnostics`↴](#iroha-ops-sumeragi-diagnostics)
* [`iroha ops sumeragi leader`↴](#iroha-ops-sumeragi-leader)
* [`iroha ops sumeragi params`↴](#iroha-ops-sumeragi-params)
* [`iroha ops sumeragi qc`↴](#iroha-ops-sumeragi-qc)
* [`iroha ops sumeragi evidence`↴](#iroha-ops-sumeragi-evidence)
* [`iroha ops sumeragi evidence list`↴](#iroha-ops-sumeragi-evidence-list)
* [`iroha ops sumeragi evidence count`↴](#iroha-ops-sumeragi-evidence-count)
* [`iroha ops audit`↴](#iroha-ops-audit)
* [`iroha ops audit witness`↴](#iroha-ops-audit-witness)
* [`iroha ops connect`↴](#iroha-ops-connect)
* [`iroha ops connect queue`↴](#iroha-ops-connect-queue)
* [`iroha ops connect queue inspect`↴](#iroha-ops-connect-queue-inspect)
* [`iroha ops bridge`↴](#iroha-ops-bridge)
* [`iroha ops bridge emit-receipt`↴](#iroha-ops-bridge-emit-receipt)
* [`iroha ops bridge sccp`↴](#iroha-ops-bridge-sccp)
* [`iroha ops bridge sccp capabilities`↴](#iroha-ops-bridge-sccp-capabilities)
* [`iroha ops bridge sccp registry`↴](#iroha-ops-bridge-sccp-registry)
* [`iroha ops bridge sccp recent`↴](#iroha-ops-bridge-sccp-recent)
* [`iroha ops bridge sccp bundle`↴](#iroha-ops-bridge-sccp-bundle)
* [`iroha ops bridge sccp proof-request`↴](#iroha-ops-bridge-sccp-proof-request)
* [`iroha ops bridge sccp submit-destination-proof`↴](#iroha-ops-bridge-sccp-submit-destination-proof)
* [`iroha ops bridge sccp submit-native-message`↴](#iroha-ops-bridge-sccp-submit-native-message)
* [`iroha app`↴](#iroha-app)
* [`iroha app gov`↴](#iroha-app-gov)
* [`iroha app gov deploy`↴](#iroha-app-gov-deploy)
* [`iroha app gov deploy propose`↴](#iroha-app-gov-deploy-propose)
* [`iroha app gov deploy meta`↴](#iroha-app-gov-deploy-meta)
* [`iroha app gov deploy audit`↴](#iroha-app-gov-deploy-audit)
* [`iroha app gov vote`↴](#iroha-app-gov-vote)
* [`iroha app gov proposal`↴](#iroha-app-gov-proposal)
* [`iroha app gov proposal get`↴](#iroha-app-gov-proposal-get)
* [`iroha app gov locks`↴](#iroha-app-gov-locks)
* [`iroha app gov locks get`↴](#iroha-app-gov-locks-get)
* [`iroha app gov unlock`↴](#iroha-app-gov-unlock)
* [`iroha app gov unlock stats`↴](#iroha-app-gov-unlock-stats)
* [`iroha app gov referendum`↴](#iroha-app-gov-referendum)
* [`iroha app gov referendum get`↴](#iroha-app-gov-referendum-get)
* [`iroha app gov tally`↴](#iroha-app-gov-tally)
* [`iroha app gov tally get`↴](#iroha-app-gov-tally-get)
* [`iroha app gov protected`↴](#iroha-app-gov-protected)
* [`iroha app gov protected set`↴](#iroha-app-gov-protected-set)
* [`iroha app gov protected apply`↴](#iroha-app-gov-protected-apply)
* [`iroha app gov protected get`↴](#iroha-app-gov-protected-get)
* [`iroha app gov parliament`↴](#iroha-app-gov-parliament)
* [`iroha app gov parliament draft-attempt`↴](#iroha-app-gov-parliament-draft-attempt)
* [`iroha app gov parliament draft-transition`↴](#iroha-app-gov-parliament-draft-transition)
* [`iroha app gov parliament get-attempt`↴](#iroha-app-gov-parliament-get-attempt)
* [`iroha app gov parliament finalize-opened-ballot`↴](#iroha-app-gov-parliament-finalize-opened-ballot)
* [`iroha app zk`↴](#iroha-app-zk)
* [`iroha app zk roots`↴](#iroha-app-zk-roots)
* [`iroha app zk verify-batch`↴](#iroha-app-zk-verify-batch)
* [`iroha app zk schema-hash`↴](#iroha-app-zk-schema-hash)
* [`iroha app zk attachments`↴](#iroha-app-zk-attachments)
* [`iroha app zk attachments upload`↴](#iroha-app-zk-attachments-upload)
* [`iroha app zk attachments list`↴](#iroha-app-zk-attachments-list)
* [`iroha app zk attachments get`↴](#iroha-app-zk-attachments-get)
* [`iroha app zk attachments delete`↴](#iroha-app-zk-attachments-delete)
* [`iroha app zk attachments cleanup`↴](#iroha-app-zk-attachments-cleanup)
* [`iroha app zk register-asset`↴](#iroha-app-zk-register-asset)
* [`iroha app zk vk`↴](#iroha-app-zk-vk)
* [`iroha app zk vk register`↴](#iroha-app-zk-vk-register)
* [`iroha app zk vk update`↴](#iroha-app-zk-vk-update)
* [`iroha app zk vk get`↴](#iroha-app-zk-vk-get)
* [`iroha app zk proofs`↴](#iroha-app-zk-proofs)
* [`iroha app zk proofs list`↴](#iroha-app-zk-proofs-list)
* [`iroha app zk proofs count`↴](#iroha-app-zk-proofs-count)
* [`iroha app zk proofs get`↴](#iroha-app-zk-proofs-get)
* [`iroha app zk proofs retention`↴](#iroha-app-zk-proofs-retention)
* [`iroha app zk proofs prune`↴](#iroha-app-zk-proofs-prune)
* [`iroha app zk ivm`↴](#iroha-app-zk-ivm)
* [`iroha app zk ivm derive`↴](#iroha-app-zk-ivm-derive)
* [`iroha app zk ivm prove`↴](#iroha-app-zk-ivm-prove)
* [`iroha app zk ivm get`↴](#iroha-app-zk-ivm-get)
* [`iroha app zk ivm delete`↴](#iroha-app-zk-ivm-delete)
* [`iroha app zk ivm derive-pk`↴](#iroha-app-zk-ivm-derive-pk)
* [`iroha app zk vote`↴](#iroha-app-zk-vote)
* [`iroha app zk vote tally`↴](#iroha-app-zk-vote-tally)
* [`iroha app zk envelope`↴](#iroha-app-zk-envelope)
* [`iroha app confidential`↴](#iroha-app-confidential)
* [`iroha app confidential create-keys`↴](#iroha-app-confidential-create-keys)
* [`iroha app confidential gas`↴](#iroha-app-confidential-gas)
* [`iroha app confidential gas get`↴](#iroha-app-confidential-gas-get)
* [`iroha app taikai`↴](#iroha-app-taikai)
* [`iroha app taikai bundle`↴](#iroha-app-taikai-bundle)
* [`iroha app taikai cek-rotate`↴](#iroha-app-taikai-cek-rotate)
* [`iroha app taikai rpt-attest`↴](#iroha-app-taikai-rpt-attest)
* [`iroha app taikai ingest`↴](#iroha-app-taikai-ingest)
* [`iroha app taikai ingest watch`↴](#iroha-app-taikai-ingest-watch)
* [`iroha app taikai ingest edge`↴](#iroha-app-taikai-ingest-edge)
* [`iroha app content`↴](#iroha-app-content)
* [`iroha app content publish`↴](#iroha-app-content-publish)
* [`iroha app content pack`↴](#iroha-app-content-pack)
* [`iroha app da`↴](#iroha-app-da)
* [`iroha app da submit`↴](#iroha-app-da-submit)
* [`iroha app da get`↴](#iroha-app-da-get)
* [`iroha app da get-blob`↴](#iroha-app-da-get-blob)
* [`iroha app da prove`↴](#iroha-app-da-prove)
* [`iroha app da prove-availability`↴](#iroha-app-da-prove-availability)
* [`iroha app da proof-policies`↴](#iroha-app-da-proof-policies)
* [`iroha app da proof-policy-snapshot`↴](#iroha-app-da-proof-policy-snapshot)
* [`iroha app da commitments-list`↴](#iroha-app-da-commitments-list)
* [`iroha app da commitments-prove`↴](#iroha-app-da-commitments-prove)
* [`iroha app da commitments-verify`↴](#iroha-app-da-commitments-verify)
* [`iroha app da pin-intents-list`↴](#iroha-app-da-pin-intents-list)
* [`iroha app da pin-intents-prove`↴](#iroha-app-da-pin-intents-prove)
* [`iroha app da pin-intents-verify`↴](#iroha-app-da-pin-intents-verify)
* [`iroha app da rent-quote`↴](#iroha-app-da-rent-quote)
* [`iroha app da rent-ledger`↴](#iroha-app-da-rent-ledger)
* [`iroha app streaming`↴](#iroha-app-streaming)
* [`iroha app streaming fingerprint`↴](#iroha-app-streaming-fingerprint)
* [`iroha app streaming suites`↴](#iroha-app-streaming-suites)
* [`iroha app nexus`↴](#iroha-app-nexus)
* [`iroha app nexus lane-report`↴](#iroha-app-nexus-lane-report)
* [`iroha app nexus public-lane`↴](#iroha-app-nexus-public-lane)
* [`iroha app nexus public-lane validators`↴](#iroha-app-nexus-public-lane-validators)
* [`iroha app nexus public-lane stake`↴](#iroha-app-nexus-public-lane-stake)
* [`iroha app nexus private-settlement`↴](#iroha-app-nexus-private-settlement)
* [`iroha app nexus private-settlement availability-share`↴](#iroha-app-nexus-private-settlement-availability-share)
* [`iroha app nexus private-settlement prepare-vote`↴](#iroha-app-nexus-private-settlement-prepare-vote)
* [`iroha app nexus private-settlement commit-vote`↴](#iroha-app-nexus-private-settlement-commit-vote)
* [`iroha app nexus private-settlement phase-certificate`↴](#iroha-app-nexus-private-settlement-phase-certificate)
* [`iroha app nexus private-settlement phase-certificates`↴](#iroha-app-nexus-private-settlement-phase-certificates)
* [`iroha app nexus private-settlement leg-upload`↴](#iroha-app-nexus-private-settlement-leg-upload)
* [`iroha app nexus private-settlement leg-status`↴](#iroha-app-nexus-private-settlement-leg-status)
* [`iroha app nexus private-settlement committee-proof`↴](#iroha-app-nexus-private-settlement-committee-proof)
* [`iroha app nexus private-settlement audit-capsule`↴](#iroha-app-nexus-private-settlement-audit-capsule)
* [`iroha app nexus private-settlement audit-approval`↴](#iroha-app-nexus-private-settlement-audit-approval)
* [`iroha app nexus private-settlement bundle-submit`↴](#iroha-app-nexus-private-settlement-bundle-submit)
* [`iroha app nexus private-settlement bundle-status`↴](#iroha-app-nexus-private-settlement-bundle-status)
* [`iroha app nexus private-settlement bundle-receipt`↴](#iroha-app-nexus-private-settlement-bundle-receipt)
* [`iroha app staking`↴](#iroha-app-staking)
* [`iroha app staking register`↴](#iroha-app-staking-register)
* [`iroha app staking rebind`↴](#iroha-app-staking-rebind)
* [`iroha app staking activate`↴](#iroha-app-staking-activate)
* [`iroha app staking exit`↴](#iroha-app-staking-exit)
* [`iroha app subscriptions`↴](#iroha-app-subscriptions)
* [`iroha app subscriptions plan`↴](#iroha-app-subscriptions-plan)
* [`iroha app subscriptions plan create`↴](#iroha-app-subscriptions-plan-create)
* [`iroha app subscriptions plan list`↴](#iroha-app-subscriptions-plan-list)
* [`iroha app subscriptions subscription`↴](#iroha-app-subscriptions-subscription)
* [`iroha app subscriptions subscription create`↴](#iroha-app-subscriptions-subscription-create)
* [`iroha app subscriptions subscription list`↴](#iroha-app-subscriptions-subscription-list)
* [`iroha app subscriptions subscription get`↴](#iroha-app-subscriptions-subscription-get)
* [`iroha app subscriptions subscription pause`↴](#iroha-app-subscriptions-subscription-pause)
* [`iroha app subscriptions subscription resume`↴](#iroha-app-subscriptions-subscription-resume)
* [`iroha app subscriptions subscription cancel`↴](#iroha-app-subscriptions-subscription-cancel)
* [`iroha app subscriptions subscription keep`↴](#iroha-app-subscriptions-subscription-keep)
* [`iroha app subscriptions subscription charge-now`↴](#iroha-app-subscriptions-subscription-charge-now)
* [`iroha app subscriptions subscription usage`↴](#iroha-app-subscriptions-subscription-usage)
* [`iroha app endorsement`↴](#iroha-app-endorsement)
* [`iroha app endorsement prepare`↴](#iroha-app-endorsement-prepare)
* [`iroha app endorsement submit`↴](#iroha-app-endorsement-submit)
* [`iroha app endorsement list`↴](#iroha-app-endorsement-list)
* [`iroha app endorsement policy`↴](#iroha-app-endorsement-policy)
* [`iroha app endorsement committee`↴](#iroha-app-endorsement-committee)
* [`iroha app endorsement register-committee`↴](#iroha-app-endorsement-register-committee)
* [`iroha app endorsement set-policy`↴](#iroha-app-endorsement-set-policy)
* [`iroha app jurisdiction`↴](#iroha-app-jurisdiction)
* [`iroha app jurisdiction verify`↴](#iroha-app-jurisdiction-verify)
* [`iroha app compute`↴](#iroha-app-compute)
* [`iroha app compute simulate`↴](#iroha-app-compute-simulate)
* [`iroha app compute invoke`↴](#iroha-app-compute-invoke)
* [`iroha app social`↴](#iroha-app-social)
* [`iroha app social claim-twitter-follow-reward`↴](#iroha-app-social-claim-twitter-follow-reward)
* [`iroha app social send-to-twitter`↴](#iroha-app-social-send-to-twitter)
* [`iroha app social cancel-twitter-escrow`↴](#iroha-app-social-cancel-twitter-escrow)
* [`iroha app space-directory`↴](#iroha-app-space-directory)
* [`iroha app space-directory manifest`↴](#iroha-app-space-directory-manifest)
* [`iroha app space-directory manifest publish`↴](#iroha-app-space-directory-manifest-publish)
* [`iroha app space-directory manifest encode`↴](#iroha-app-space-directory-manifest-encode)
* [`iroha app space-directory manifest revoke`↴](#iroha-app-space-directory-manifest-revoke)
* [`iroha app space-directory manifest expire`↴](#iroha-app-space-directory-manifest-expire)
* [`iroha app space-directory manifest audit-bundle`↴](#iroha-app-space-directory-manifest-audit-bundle)
* [`iroha app space-directory manifest fetch`↴](#iroha-app-space-directory-manifest-fetch)
* [`iroha app space-directory manifest scaffold`↴](#iroha-app-space-directory-manifest-scaffold)
* [`iroha app space-directory bindings`↴](#iroha-app-space-directory-bindings)
* [`iroha app space-directory bindings fetch`↴](#iroha-app-space-directory-bindings-fetch)
* [`iroha app kaigi`↴](#iroha-app-kaigi)
* [`iroha app kaigi create`↴](#iroha-app-kaigi-create)
* [`iroha app kaigi quickstart`↴](#iroha-app-kaigi-quickstart)
* [`iroha app kaigi register-relay`↴](#iroha-app-kaigi-register-relay)
* [`iroha app kaigi unregister-relay`↴](#iroha-app-kaigi-unregister-relay)
* [`iroha app kaigi set-relay-manifest`↴](#iroha-app-kaigi-set-relay-manifest)
* [`iroha app kaigi join`↴](#iroha-app-kaigi-join)
* [`iroha app kaigi leave`↴](#iroha-app-kaigi-leave)
* [`iroha app kaigi end`↴](#iroha-app-kaigi-end)
* [`iroha app kaigi record-usage`↴](#iroha-app-kaigi-record-usage)
* [`iroha app kaigi report-relay-health`↴](#iroha-app-kaigi-report-relay-health)
* [`iroha app sorafs`↴](#iroha-app-sorafs)
* [`iroha app sorafs pin`↴](#iroha-app-sorafs-pin)
* [`iroha app sorafs pin list`↴](#iroha-app-sorafs-pin-list)
* [`iroha app sorafs pin show`↴](#iroha-app-sorafs-pin-show)
* [`iroha app sorafs pin register`↴](#iroha-app-sorafs-pin-register)
* [`iroha app sorafs alias`↴](#iroha-app-sorafs-alias)
* [`iroha app sorafs alias list`↴](#iroha-app-sorafs-alias-list)
* [`iroha app sorafs replication`↴](#iroha-app-sorafs-replication)
* [`iroha app sorafs replication list`↴](#iroha-app-sorafs-replication-list)
* [`iroha app sorafs storage`↴](#iroha-app-sorafs-storage)
* [`iroha app sorafs storage token`↴](#iroha-app-sorafs-storage-token)
* [`iroha app sorafs storage token issue`↴](#iroha-app-sorafs-storage-token-issue)
* [`iroha app sorafs gateway`↴](#iroha-app-sorafs-gateway)
* [`iroha app sorafs gateway template-config`↴](#iroha-app-sorafs-gateway-template-config)
* [`iroha app sorafs gateway generate-hosts`↴](#iroha-app-sorafs-gateway-generate-hosts)
* [`iroha app sorafs gateway route-plan`↴](#iroha-app-sorafs-gateway-route-plan)
* [`iroha app sorafs gateway cache-invalidate`↴](#iroha-app-sorafs-gateway-cache-invalidate)
* [`iroha app sorafs gateway direct-mode`↴](#iroha-app-sorafs-gateway-direct-mode)
* [`iroha app sorafs gateway direct-mode plan`↴](#iroha-app-sorafs-gateway-direct-mode-plan)
* [`iroha app sorafs gateway direct-mode enable`↴](#iroha-app-sorafs-gateway-direct-mode-enable)
* [`iroha app sorafs gateway direct-mode rollback`↴](#iroha-app-sorafs-gateway-direct-mode-rollback)
* [`iroha app sorafs incentives`↴](#iroha-app-sorafs-incentives)
* [`iroha app sorafs incentives compute`↴](#iroha-app-sorafs-incentives-compute)
* [`iroha app sorafs incentives open-dispute`↴](#iroha-app-sorafs-incentives-open-dispute)
* [`iroha app sorafs incentives dashboard`↴](#iroha-app-sorafs-incentives-dashboard)
* [`iroha app sorafs incentives service`↴](#iroha-app-sorafs-incentives-service)
* [`iroha app sorafs incentives service init`↴](#iroha-app-sorafs-incentives-service-init)
* [`iroha app sorafs incentives service process`↴](#iroha-app-sorafs-incentives-service-process)
* [`iroha app sorafs incentives service record`↴](#iroha-app-sorafs-incentives-service-record)
* [`iroha app sorafs incentives service dispute`↴](#iroha-app-sorafs-incentives-service-dispute)
* [`iroha app sorafs incentives service dispute file`↴](#iroha-app-sorafs-incentives-service-dispute-file)
* [`iroha app sorafs incentives service dispute resolve`↴](#iroha-app-sorafs-incentives-service-dispute-resolve)
* [`iroha app sorafs incentives service dispute reject`↴](#iroha-app-sorafs-incentives-service-dispute-reject)
* [`iroha app sorafs incentives service dashboard`↴](#iroha-app-sorafs-incentives-service-dashboard)
* [`iroha app sorafs incentives service audit`↴](#iroha-app-sorafs-incentives-service-audit)
* [`iroha app sorafs incentives service shadow-run`↴](#iroha-app-sorafs-incentives-service-shadow-run)
* [`iroha app sorafs incentives service reconcile`↴](#iroha-app-sorafs-incentives-service-reconcile)
* [`iroha app sorafs incentives service daemon`↴](#iroha-app-sorafs-incentives-service-daemon)
* [`iroha app sorafs handshake`↴](#iroha-app-sorafs-handshake)
* [`iroha app sorafs handshake show`↴](#iroha-app-sorafs-handshake-show)
* [`iroha app sorafs handshake update`↴](#iroha-app-sorafs-handshake-update)
* [`iroha app sorafs handshake token`↴](#iroha-app-sorafs-handshake-token)
* [`iroha app sorafs handshake token issue`↴](#iroha-app-sorafs-handshake-token-issue)
* [`iroha app sorafs handshake token id`↴](#iroha-app-sorafs-handshake-token-id)
* [`iroha app sorafs handshake token fingerprint`↴](#iroha-app-sorafs-handshake-token-fingerprint)
* [`iroha app sorafs toolkit`↴](#iroha-app-sorafs-toolkit)
* [`iroha app sorafs toolkit pack`↴](#iroha-app-sorafs-toolkit-pack)
* [`iroha app sorafs guard-directory`↴](#iroha-app-sorafs-guard-directory)
* [`iroha app sorafs guard-directory fetch`↴](#iroha-app-sorafs-guard-directory-fetch)
* [`iroha app sorafs guard-directory verify`↴](#iroha-app-sorafs-guard-directory-verify)
* [`iroha app sorafs guard-directory inspect`↴](#iroha-app-sorafs-guard-directory-inspect)
* [`iroha app sorafs reserve`↴](#iroha-app-sorafs-reserve)
* [`iroha app sorafs reserve quote`↴](#iroha-app-sorafs-reserve-quote)
* [`iroha app sorafs reserve ledger`↴](#iroha-app-sorafs-reserve-ledger)
* [`iroha app sorafs reserve lifecycle`↴](#iroha-app-sorafs-reserve-lifecycle)
* [`iroha app sorafs appeals`↴](#iroha-app-sorafs-appeals)
* [`iroha app sorafs appeals pricing`↴](#iroha-app-sorafs-appeals-pricing)
* [`iroha app sorafs appeals pricing config`↴](#iroha-app-sorafs-appeals-pricing-config)
* [`iroha app sorafs appeals pricing status`↴](#iroha-app-sorafs-appeals-pricing-status)
* [`iroha app sorafs appeals pricing quote`↴](#iroha-app-sorafs-appeals-pricing-quote)
* [`iroha app sorafs appeals finance`↴](#iroha-app-sorafs-appeals-finance)
* [`iroha app sorafs appeals finance deposits`↴](#iroha-app-sorafs-appeals-finance-deposits)
* [`iroha app sorafs appeals finance deposits create`↴](#iroha-app-sorafs-appeals-finance-deposits-create)
* [`iroha app sorafs appeals finance deposits confirm`↴](#iroha-app-sorafs-appeals-finance-deposits-confirm)
* [`iroha app sorafs appeals finance deposits get`↴](#iroha-app-sorafs-appeals-finance-deposits-get)
* [`iroha app sorafs appeals finance deposits settle`↴](#iroha-app-sorafs-appeals-finance-deposits-settle)
* [`iroha app sorafs appeals finance deposits reconcile`↴](#iroha-app-sorafs-appeals-finance-deposits-reconcile)
* [`iroha app sorafs appeals finance deposits submit-settlement`↴](#iroha-app-sorafs-appeals-finance-deposits-submit-settlement)
* [`iroha app sorafs appeals finance reports`↴](#iroha-app-sorafs-appeals-finance-reports)
* [`iroha app sorafs appeals finance weekly-rollups`↴](#iroha-app-sorafs-appeals-finance-weekly-rollups)
* [`iroha app sorafs appeals finance settlement-receipts`↴](#iroha-app-sorafs-appeals-finance-settlement-receipts)
* [`iroha app sorafs gar`↴](#iroha-app-sorafs-gar)
* [`iroha app sorafs gar receipt`↴](#iroha-app-sorafs-gar-receipt)
* [`iroha app sorafs transparency`↴](#iroha-app-sorafs-transparency)
* [`iroha app sorafs transparency cycles`↴](#iroha-app-sorafs-transparency-cycles)
* [`iroha app sorafs transparency cycles list`↴](#iroha-app-sorafs-transparency-cycles-list)
* [`iroha app sorafs transparency cycles get`↴](#iroha-app-sorafs-transparency-cycles-get)
* [`iroha app sorafs transparency cycles entry`↴](#iroha-app-sorafs-transparency-cycles-entry)
* [`iroha app sorafs transparency explorer`↴](#iroha-app-sorafs-transparency-explorer)
* [`iroha app sorafs transparency explorer-canary`↴](#iroha-app-sorafs-transparency-explorer-canary)
* [`iroha app sorafs transparency publication-canary`↴](#iroha-app-sorafs-transparency-publication-canary)
* [`iroha app sorafs transparency tokens`↴](#iroha-app-sorafs-transparency-tokens)
* [`iroha app sorafs transparency token-issuance`↴](#iroha-app-sorafs-transparency-token-issuance)
* [`iroha app sorafs transparency token-issuance submit`↴](#iroha-app-sorafs-transparency-token-issuance-submit)
* [`iroha app sorafs transparency token-issuance canary`↴](#iroha-app-sorafs-transparency-token-issuance-canary)
* [`iroha app sorafs transparency privacy-aggregate`↴](#iroha-app-sorafs-transparency-privacy-aggregate)
* [`iroha app sorafs transparency privacy-aggregate source-event`↴](#iroha-app-sorafs-transparency-privacy-aggregate-source-event)
* [`iroha app sorafs transparency privacy-aggregate publish-due`↴](#iroha-app-sorafs-transparency-privacy-aggregate-publish-due)
* [`iroha app sorafs transparency privacy-aggregate canary`↴](#iroha-app-sorafs-transparency-privacy-aggregate-canary)
* [`iroha app sorafs moderation`↴](#iroha-app-sorafs-moderation)
* [`iroha app sorafs moderation ballots`↴](#iroha-app-sorafs-moderation-ballots)
* [`iroha app sorafs moderation ballots list`↴](#iroha-app-sorafs-moderation-ballots-list)
* [`iroha app sorafs moderation ballots get`↴](#iroha-app-sorafs-moderation-ballots-get)
* [`iroha app sorafs moderation ballots no-show-plan`↴](#iroha-app-sorafs-moderation-ballots-no-show-plan)
* [`iroha app sorafs moderation ballots events`↴](#iroha-app-sorafs-moderation-ballots-events)
* [`iroha app sorafs moderation ballots commit`↴](#iroha-app-sorafs-moderation-ballots-commit)
* [`iroha app sorafs moderation ballots reveal`↴](#iroha-app-sorafs-moderation-ballots-reveal)
* [`iroha app sorafs moderation ballots tally`↴](#iroha-app-sorafs-moderation-ballots-tally)
* [`iroha app sorafs moderation ballots execute`↴](#iroha-app-sorafs-moderation-ballots-execute)
* [`iroha app sorafs moderation ballots executor-bundle`↴](#iroha-app-sorafs-moderation-ballots-executor-bundle)
* [`iroha app sorafs moderation ballots executor-canary`↴](#iroha-app-sorafs-moderation-ballots-executor-canary)
* [`iroha app sorafs moderation registry`↴](#iroha-app-sorafs-moderation-registry)
* [`iroha app sorafs moderation registry list`↴](#iroha-app-sorafs-moderation-registry-list)
* [`iroha app sorafs moderation registry submit-repro`↴](#iroha-app-sorafs-moderation-registry-submit-repro)
* [`iroha app sorafs moderation registry submit-corpus`↴](#iroha-app-sorafs-moderation-registry-submit-corpus)
* [`iroha app sorafs moderation screening`↴](#iroha-app-sorafs-moderation-screening)
* [`iroha app sorafs moderation screening list`↴](#iroha-app-sorafs-moderation-screening-list)
* [`iroha app sorafs moderation screening submit`↴](#iroha-app-sorafs-moderation-screening-submit)
* [`iroha app sorafs moderation quarantine`↴](#iroha-app-sorafs-moderation-quarantine)
* [`iroha app sorafs moderation quarantine list`↴](#iroha-app-sorafs-moderation-quarantine-list)
* [`iroha app sorafs moderation quarantine object`↴](#iroha-app-sorafs-moderation-quarantine-object)
* [`iroha app sorafs moderation quarantine object store`↴](#iroha-app-sorafs-moderation-quarantine-object-store)
* [`iroha app sorafs moderation quarantine object read`↴](#iroha-app-sorafs-moderation-quarantine-object-read)
* [`iroha app sorafs moderation quarantine notifications`↴](#iroha-app-sorafs-moderation-quarantine-notifications)
* [`iroha app sorafs moderation quarantine notifications deliver`↴](#iroha-app-sorafs-moderation-quarantine-notifications-deliver)
* [`iroha app sorafs moderation quarantine notifications canary`↴](#iroha-app-sorafs-moderation-quarantine-notifications-canary)
* [`iroha app sorafs moderation quarantine review`↴](#iroha-app-sorafs-moderation-quarantine-review)
* [`iroha app sorafs moderation quarantine release`↴](#iroha-app-sorafs-moderation-quarantine-release)
* [`iroha app sorafs moderation quarantine appeal-handoff`↴](#iroha-app-sorafs-moderation-quarantine-appeal-handoff)
* [`iroha app sorafs moderation quarantine operator-panel`↴](#iroha-app-sorafs-moderation-quarantine-operator-panel)
* [`iroha app sorafs moderation quarantine bridge-plan`↴](#iroha-app-sorafs-moderation-quarantine-bridge-plan)
* [`iroha app sorafs moderation quarantine operator-serve`↴](#iroha-app-sorafs-moderation-quarantine-operator-serve)
* [`iroha app sorafs moderation quarantine operator-canary`↴](#iroha-app-sorafs-moderation-quarantine-operator-canary)
* [`iroha app sorafs repair`↴](#iroha-app-sorafs-repair)
* [`iroha app sorafs repair list`↴](#iroha-app-sorafs-repair-list)
* [`iroha app sorafs repair claim`↴](#iroha-app-sorafs-repair-claim)
* [`iroha app sorafs repair renew`↴](#iroha-app-sorafs-repair-renew)
* [`iroha app sorafs repair complete`↴](#iroha-app-sorafs-repair-complete)
* [`iroha app sorafs repair fail`↴](#iroha-app-sorafs-repair-fail)
* [`iroha app sorafs repair escalate`↴](#iroha-app-sorafs-repair-escalate)
* [`iroha app sorafs billing`↴](#iroha-app-sorafs-billing)
* [`iroha app sorafs billing status`↴](#iroha-app-sorafs-billing-status)
* [`iroha app sorafs billing statements`↴](#iroha-app-sorafs-billing-statements)
* [`iroha app sorafs billing statement`↴](#iroha-app-sorafs-billing-statement)
* [`iroha app sorafs billing acknowledge`↴](#iroha-app-sorafs-billing-acknowledge)
* [`iroha app sorafs billing reconciliation`↴](#iroha-app-sorafs-billing-reconciliation)
* [`iroha app sorafs hedging`↴](#iroha-app-sorafs-hedging)
* [`iroha app sorafs hedging exposure`↴](#iroha-app-sorafs-hedging-exposure)
* [`iroha app sorafs hedging intents`↴](#iroha-app-sorafs-hedging-intents)
* [`iroha app sorafs gc`↴](#iroha-app-sorafs-gc)
* [`iroha app sorafs gc inspect`↴](#iroha-app-sorafs-gc-inspect)
* [`iroha app sorafs gc dry-run`↴](#iroha-app-sorafs-gc-dry-run)
* [`iroha app sorafs fetch`↴](#iroha-app-sorafs-fetch)
* [`iroha app soracles`↴](#iroha-app-soracles)
* [`iroha app soracles tx`↴](#iroha-app-soracles-tx)
* [`iroha app soracles tx register`↴](#iroha-app-soracles-tx-register)
* [`iroha app soracles tx submit`↴](#iroha-app-soracles-tx-submit)
* [`iroha app soracles tx aggregate`↴](#iroha-app-soracles-tx-aggregate)
* [`iroha app soracles tx open-dispute`↴](#iroha-app-soracles-tx-open-dispute)
* [`iroha app soracles tx resolve-dispute`↴](#iroha-app-soracles-tx-resolve-dispute)
* [`iroha app soracles tx propose-change`↴](#iroha-app-soracles-tx-propose-change)
* [`iroha app soracles tx vote-change-stage`↴](#iroha-app-soracles-tx-vote-change-stage)
* [`iroha app soracles tx rollback-change`↴](#iroha-app-soracles-tx-rollback-change)
* [`iroha app soracles tx attest-defi`↴](#iroha-app-soracles-tx-attest-defi)
* [`iroha app soracles tx record-twitter-binding`↴](#iroha-app-soracles-tx-record-twitter-binding)
* [`iroha app soracles tx revoke-twitter-binding`↴](#iroha-app-soracles-tx-revoke-twitter-binding)
* [`iroha app soracles query`↴](#iroha-app-soracles-query)
* [`iroha app soracles query feeds`↴](#iroha-app-soracles-query-feeds)
* [`iroha app soracles query feed`↴](#iroha-app-soracles-query-feed)
* [`iroha app soracles query history`↴](#iroha-app-soracles-query-history)
* [`iroha app soracles query provider-stats`↴](#iroha-app-soracles-query-provider-stats)
* [`iroha app soracles query disputes`↴](#iroha-app-soracles-query-disputes)
* [`iroha app soracles query dispute`↴](#iroha-app-soracles-query-dispute)
* [`iroha app soracles query changes`↴](#iroha-app-soracles-query-changes)
* [`iroha app soracles query change`↴](#iroha-app-soracles-query-change)
* [`iroha app soracles query twitter-bindings`↴](#iroha-app-soracles-query-twitter-bindings)
* [`iroha app soracles query defi-attestation`↴](#iroha-app-soracles-query-defi-attestation)
* [`iroha app soracles bundle`↴](#iroha-app-soracles-bundle)
* [`iroha app soracles catalog`↴](#iroha-app-soracles-catalog)
* [`iroha app soracles evidence-gc`↴](#iroha-app-soracles-evidence-gc)
* [`iroha app sns`↴](#iroha-app-sns)
* [`iroha app sns registration`↴](#iroha-app-sns-registration)
* [`iroha app sns policy`↴](#iroha-app-sns-policy)
* [`iroha app alias`↴](#iroha-app-alias)
* [`iroha app alias doctor`↴](#iroha-app-alias-doctor)
* [`iroha app alias setup`↴](#iroha-app-alias-setup)
* [`iroha app alias setup plan`↴](#iroha-app-alias-setup-plan)
* [`iroha app alias setup apply`↴](#iroha-app-alias-setup-apply)
* [`iroha app alias lease`↴](#iroha-app-alias-lease)
* [`iroha app alias lease renew`↴](#iroha-app-alias-lease-renew)
* [`iroha app alias lease renew plan`↴](#iroha-app-alias-lease-renew-plan)
* [`iroha app alias lease renew apply`↴](#iroha-app-alias-lease-renew-apply)
* [`iroha app alias auto-renew`↴](#iroha-app-alias-auto-renew)
* [`iroha app alias auto-renew plan`↴](#iroha-app-alias-auto-renew-plan)
* [`iroha app alias auto-renew apply`↴](#iroha-app-alias-auto-renew-apply)
* [`iroha app alias resolve`↴](#iroha-app-alias-resolve)
* [`iroha app alias resolve-index`↴](#iroha-app-alias-resolve-index)
* [`iroha app alias by-account`↴](#iroha-app-alias-by-account)
* [`iroha app repo`↴](#iroha-app-repo)
* [`iroha app repo initiate`↴](#iroha-app-repo-initiate)
* [`iroha app repo unwind`↴](#iroha-app-repo-unwind)
* [`iroha app repo query`↴](#iroha-app-repo-query)
* [`iroha app repo query list`↴](#iroha-app-repo-query-list)
* [`iroha app repo query get`↴](#iroha-app-repo-query-get)
* [`iroha app repo margin`↴](#iroha-app-repo-margin)
* [`iroha app repo margin-call`↴](#iroha-app-repo-margin-call)
* [`iroha app settlement`↴](#iroha-app-settlement)
* [`iroha app settlement dvp`↴](#iroha-app-settlement-dvp)
* [`iroha app settlement pvp`↴](#iroha-app-settlement-pvp)
* [`iroha app settlement set-fx-corridor-policy`↴](#iroha-app-settlement-set-fx-corridor-policy)
* [`iroha app settlement fund-fx-corridor-escrow`↴](#iroha-app-settlement-fund-fx-corridor-escrow)
* [`iroha app settlement refund-fx-corridor-escrow`↴](#iroha-app-settlement-refund-fx-corridor-escrow)
* [`iroha app settlement settle-fx-corridor`↴](#iroha-app-settlement-settle-fx-corridor)
* [`iroha app settlement get-fx-corridor-policy`↴](#iroha-app-settlement-get-fx-corridor-policy)
* [`iroha app settlement list-fx-corridor-policies`↴](#iroha-app-settlement-list-fx-corridor-policies)
* [`iroha contract`↴](#iroha-contract)
* [`iroha contract app`↴](#iroha-contract-app)
* [`iroha contract app build`↴](#iroha-contract-app-build)
* [`iroha contract dev`↴](#iroha-contract-dev)
* [`iroha contract dev check`↴](#iroha-contract-dev-check)
* [`iroha contract dev build`↴](#iroha-contract-dev-build)
* [`iroha contract dev test`↴](#iroha-contract-dev-test)
* [`iroha contract dev doctor`↴](#iroha-contract-dev-doctor)
* [`iroha contract dev schema`↴](#iroha-contract-dev-schema)
* [`iroha contract dev call`↴](#iroha-contract-dev-call)
* [`iroha contract dev view`↴](#iroha-contract-dev-view)
* [`iroha contract dev smoke`↴](#iroha-contract-dev-smoke)
* [`iroha contract code`↴](#iroha-contract-code)
* [`iroha contract code get`↴](#iroha-contract-code-get)
* [`iroha contract alias`↴](#iroha-contract-alias)
* [`iroha contract alias lease`↴](#iroha-contract-alias-lease)
* [`iroha contract alias release`↴](#iroha-contract-alias-release)
* [`iroha contract alias resolve`↴](#iroha-contract-alias-resolve)
* [`iroha contract derive-address`↴](#iroha-contract-derive-address)
* [`iroha contract call`↴](#iroha-contract-call)
* [`iroha contract view`↴](#iroha-contract-view)
* [`iroha contract debug-view`↴](#iroha-contract-debug-view)
* [`iroha contract debug-call`↴](#iroha-contract-debug-call)
* [`iroha contract manifest`↴](#iroha-contract-manifest)
* [`iroha contract manifest get`↴](#iroha-contract-manifest-get)
* [`iroha contract manifest build`↴](#iroha-contract-manifest-build)
* [`iroha contract simulate`↴](#iroha-contract-simulate)
* [`iroha tools`↴](#iroha-tools)
* [`iroha tools address`↴](#iroha-tools-address)
* [`iroha tools address convert`↴](#iroha-tools-address-convert)
* [`iroha tools address audit`↴](#iroha-tools-address-audit)
* [`iroha tools address normalize`↴](#iroha-tools-address-normalize)
* [`iroha tools crypto`↴](#iroha-tools-crypto)
* [`iroha tools crypto sm2`↴](#iroha-tools-crypto-sm2)
* [`iroha tools crypto sm2 keygen`↴](#iroha-tools-crypto-sm2-keygen)
* [`iroha tools crypto sm2 import`↴](#iroha-tools-crypto-sm2-import)
* [`iroha tools crypto sm2 export`↴](#iroha-tools-crypto-sm2-export)
* [`iroha tools crypto sm3`↴](#iroha-tools-crypto-sm3)
* [`iroha tools crypto sm3 hash`↴](#iroha-tools-crypto-sm3-hash)
* [`iroha tools crypto sm4`↴](#iroha-tools-crypto-sm4)
* [`iroha tools crypto sm4 gcm-seal`↴](#iroha-tools-crypto-sm4-gcm-seal)
* [`iroha tools crypto sm4 gcm-open`↴](#iroha-tools-crypto-sm4-gcm-open)
* [`iroha tools crypto sm4 ccm-seal`↴](#iroha-tools-crypto-sm4-ccm-seal)
* [`iroha tools crypto sm4 ccm-open`↴](#iroha-tools-crypto-sm4-ccm-open)
* [`iroha tools ivm`↴](#iroha-tools-ivm)
* [`iroha tools ivm abi-hash`↴](#iroha-tools-ivm-abi-hash)
* [`iroha tools ivm syscalls`↴](#iroha-tools-ivm-syscalls)
* [`iroha tools ivm manifest-gen`↴](#iroha-tools-ivm-manifest-gen)
* [`iroha tools markdown-help`↴](#iroha-tools-markdown-help)
* [`iroha tools version`↴](#iroha-tools-version)
* [`iroha taira`↴](#iroha-taira)
* [`iroha taira doctor`↴](#iroha-taira-doctor)
* [`iroha taira public-reset`↴](#iroha-taira-public-reset)
* [`iroha taira public-reset preflight`↴](#iroha-taira-public-reset-preflight)
* [`iroha taira public-reset apply`↴](#iroha-taira-public-reset-apply)
* [`iroha taira write-canary`↴](#iroha-taira-write-canary)
* [`iroha taira inrou-workspace`↴](#iroha-taira-inrou-workspace)
* [`iroha taira inrou-stage`↴](#iroha-taira-inrou-stage)
* [`iroha taira inrou-canary`↴](#iroha-taira-inrou-canary)
* [`iroha taira inrou-check`↴](#iroha-taira-inrou-check)
* [`iroha offline`↴](#iroha-offline)
* [`iroha offline kagemusha`↴](#iroha-offline-kagemusha)
* [`iroha offline kagemusha lifecycle-v4`↴](#iroha-offline-kagemusha-lifecycle-v4)
* [`iroha offline kagemusha lifecycle-v4 prepare`↴](#iroha-offline-kagemusha-lifecycle-v4-prepare)
* [`iroha offline kagemusha lifecycle-v4 sign-fee-quote`↴](#iroha-offline-kagemusha-lifecycle-v4-sign-fee-quote)
* [`iroha offline kagemusha lifecycle-v4 finalize-fee-quote`↴](#iroha-offline-kagemusha-lifecycle-v4-finalize-fee-quote)
* [`iroha offline kagemusha lifecycle-v4 sign-transaction`↴](#iroha-offline-kagemusha-lifecycle-v4-sign-transaction)
* [`iroha offline kagemusha lifecycle-v4 assemble-transaction`↴](#iroha-offline-kagemusha-lifecycle-v4-assemble-transaction)
* [`iroha offline kagemusha lifecycle-v4 submit-transaction`↴](#iroha-offline-kagemusha-lifecycle-v4-submit-transaction)
* [`iroha offline kagemusha rollout-v4`↴](#iroha-offline-kagemusha-rollout-v4)
* [`iroha offline kagemusha rollout-v4 create-expectations`↴](#iroha-offline-kagemusha-rollout-v4-create-expectations)
* [`iroha offline kagemusha rollout-v4 submit`↴](#iroha-offline-kagemusha-rollout-v4-submit)
* [`iroha offline kagemusha rollout-v4 finalize-receipt`↴](#iroha-offline-kagemusha-rollout-v4-finalize-receipt)
* [`iroha offline kagemusha rollout-v4 create-canary-authorization`↴](#iroha-offline-kagemusha-rollout-v4-create-canary-authorization)
* [`iroha offline kagemusha rollout-v4 submit-canary-authorization`↴](#iroha-offline-kagemusha-rollout-v4-submit-canary-authorization)
* [`iroha offline kagemusha rollout-v4 submit-canary`↴](#iroha-offline-kagemusha-rollout-v4-submit-canary)
* [`iroha offline kagemusha rollout-v4 finalize-canary-evidence`↴](#iroha-offline-kagemusha-rollout-v4-finalize-canary-evidence)
* [`iroha offline kagemusha rollout-v4 finalize-validator-liveness`↴](#iroha-offline-kagemusha-rollout-v4-finalize-validator-liveness)
* [`iroha offline petal`↴](#iroha-offline-petal)
* [`iroha offline petal encode`↴](#iroha-offline-petal-encode)
* [`iroha offline petal eval-capture`↴](#iroha-offline-petal-eval-capture)
* [`iroha offline petal simulate-realtime`↴](#iroha-offline-petal-simulate-realtime)
* [`iroha offline petal score-styles`↴](#iroha-offline-petal-score-styles)
* [`iroha soracloud`↴](#iroha-soracloud)
* [`iroha soracloud app`↴](#iroha-soracloud-app)
* [`iroha soracloud app init`↴](#iroha-soracloud-app-init)
* [`iroha soracloud app plan`↴](#iroha-soracloud-app-plan)
* [`iroha soracloud app doctor`↴](#iroha-soracloud-app-doctor)
* [`iroha soracloud app dev`↴](#iroha-soracloud-app-dev)
* [`iroha soracloud app build`↴](#iroha-soracloud-app-build)
* [`iroha soracloud app simulate`↴](#iroha-soracloud-app-simulate)
* [`iroha soracloud app preseed`↴](#iroha-soracloud-app-preseed)
* [`iroha soracloud app release`↴](#iroha-soracloud-app-release)
* [`iroha soracloud app status`↴](#iroha-soracloud-app-status)
* [`iroha soracloud service`↴](#iroha-soracloud-service)
* [`iroha soracloud service init`↴](#iroha-soracloud-service-init)
* [`iroha soracloud service bundle-pack`↴](#iroha-soracloud-service-bundle-pack)
* [`iroha soracloud service plan`↴](#iroha-soracloud-service-plan)
* [`iroha soracloud service dev`↴](#iroha-soracloud-service-dev)
* [`iroha soracloud service build`↴](#iroha-soracloud-service-build)
* [`iroha soracloud service deploy-workspace`↴](#iroha-soracloud-service-deploy-workspace)
* [`iroha soracloud service upgrade-workspace`↴](#iroha-soracloud-service-upgrade-workspace)
* [`iroha soracloud service sync-manifests`↴](#iroha-soracloud-service-sync-manifests)
* [`iroha soracloud service preseed`↴](#iroha-soracloud-service-preseed)
* [`iroha soracloud service deploy`↴](#iroha-soracloud-service-deploy)
* [`iroha soracloud service status`↴](#iroha-soracloud-service-status)
* [`iroha soracloud service config-set`↴](#iroha-soracloud-service-config-set)
* [`iroha soracloud service config-delete`↴](#iroha-soracloud-service-config-delete)
* [`iroha soracloud service config-status`↴](#iroha-soracloud-service-config-status)
* [`iroha soracloud service secret-set`↴](#iroha-soracloud-service-secret-set)
* [`iroha soracloud service secret-delete`↴](#iroha-soracloud-service-secret-delete)
* [`iroha soracloud service secret-status`↴](#iroha-soracloud-service-secret-status)
* [`iroha soracloud service upgrade`↴](#iroha-soracloud-service-upgrade)
* [`iroha soracloud service rollback`↴](#iroha-soracloud-service-rollback)
* [`iroha soracloud service rollout`↴](#iroha-soracloud-service-rollout)
* [`iroha soracloud model`↴](#iroha-soracloud-model)
* [`iroha soracloud model training-job-start`↴](#iroha-soracloud-model-training-job-start)
* [`iroha soracloud model training-job-checkpoint`↴](#iroha-soracloud-model-training-job-checkpoint)
* [`iroha soracloud model training-job-retry`↴](#iroha-soracloud-model-training-job-retry)
* [`iroha soracloud model training-job-status`↴](#iroha-soracloud-model-training-job-status)
* [`iroha soracloud model artifact-register`↴](#iroha-soracloud-model-artifact-register)
* [`iroha soracloud model artifact-status`↴](#iroha-soracloud-model-artifact-status)
* [`iroha soracloud model weight-register`↴](#iroha-soracloud-model-weight-register)
* [`iroha soracloud model weight-promote`↴](#iroha-soracloud-model-weight-promote)
* [`iroha soracloud model weight-rollback`↴](#iroha-soracloud-model-weight-rollback)
* [`iroha soracloud model weight-status`↴](#iroha-soracloud-model-weight-status)
* [`iroha soracloud model upload-register`↴](#iroha-soracloud-model-upload-register)
* [`iroha soracloud model upload-status`↴](#iroha-soracloud-model-upload-status)
* [`iroha soracloud hf`↴](#iroha-soracloud-hf)
* [`iroha soracloud hf join`↴](#iroha-soracloud-hf-join)
* [`iroha soracloud hf status`↴](#iroha-soracloud-hf-status)
* [`iroha soracloud hf lease-leave`↴](#iroha-soracloud-hf-lease-leave)
* [`iroha soracloud hf lease-renew`↴](#iroha-soracloud-hf-lease-renew)
* [`iroha soracloud agent`↴](#iroha-soracloud-agent)
* [`iroha soracloud agent deploy`↴](#iroha-soracloud-agent-deploy)
* [`iroha soracloud agent lease-renew`↴](#iroha-soracloud-agent-lease-renew)
* [`iroha soracloud agent restart`↴](#iroha-soracloud-agent-restart)
* [`iroha soracloud agent status`↴](#iroha-soracloud-agent-status)
* [`iroha soracloud agent wallet-spend`↴](#iroha-soracloud-agent-wallet-spend)
* [`iroha soracloud agent wallet-approve`↴](#iroha-soracloud-agent-wallet-approve)
* [`iroha soracloud agent policy-revoke`↴](#iroha-soracloud-agent-policy-revoke)
* [`iroha soracloud agent message-send`↴](#iroha-soracloud-agent-message-send)
* [`iroha soracloud agent message-ack`↴](#iroha-soracloud-agent-message-ack)
* [`iroha soracloud agent mailbox-status`↴](#iroha-soracloud-agent-mailbox-status)
* [`iroha soracloud agent artifact-allow`↴](#iroha-soracloud-agent-artifact-allow)
* [`iroha soracloud agent autonomy-status`↴](#iroha-soracloud-agent-autonomy-status)

## `iroha`

Iroha Client CLI provides a simple way to interact with the Iroha Web API

**Usage:** `iroha [OPTIONS] <COMMAND>`

###### **Subcommands:**

* `account` — Canonical account reads and account mutations
* `tx` — Typed transaction status and transaction helpers
* `ledger` — Ledger data and transaction helpers
* `trigger` — Read, write, and execute triggers
* `ops` — Node and operator helpers
* `app` — App API helpers and product tooling
* `contract` — Contract app bundles, deploys, calls, and alias tooling
* `tools` — Developer utilities and diagnostics
* `taira` — SORA Taira public testnet diagnostics and canaries
* `offline` — Offline encoders, reports, and diagnostics
* `soracloud` — Soracloud app platform helpers

###### **Options:**

* `-c`, `--config <PATH>` — Path to the configuration file.

   By default, `iroha` reads `client.toml`; runtime commands require it to be present and readable. `taira doctor` and the runtime-authorized `taira public-reset` surface never read client configuration or ledger signing material.
* `--operator-private-key-file <ABSOLUTE_PATH>` — Absolute path to an owner-only operator private-key file for operator reads.

   This runtime-only credential is never inferred from the account key, environment, or client TOML. The selected node must allowlist its public key for the configured exact NetworkId.
* `-v`, `--verbose` — Print configuration details to stderr
* `-m`, `--metadata <PATH>` — Path to a JSON file for attaching transaction metadata (optional)
* `-i`, `--input` — Reads instructions from stdin and appends new ones.

   Example usage:

   `echo "[]" | iroha -io asset definition register --id "66owaQmAQMuHxPzxUN3bqZ6FJfDa" --name "USD" --scale 0`
* `-o`, `--output` — Outputs instructions to stdout without submitting them.

   Example usage:

   `iroha -o asset definition register --id "66owaQmAQMuHxPzxUN3bqZ6FJfDa" --name "USD" --scale 0 | iroha transaction stdin`
* `--output-format <OUTPUT_FORMAT>` — Output format for command responses

  Default value: `json`

  Possible values:
  - `json`:
    Emit JSON only
  - `text`:
    Emit human-readable text when available

* `--language <LANG>` — Language code for messages, overrides system language
* `--machine` — Enable deterministic machine mode (no startup chatter; strict loading for commands that require client config)
* `--fee-payer <FEE_PAYER>` — Required fee source for every submitted transaction

  Possible values:
  - `authority`:
    Charge the transaction authority directly
  - `sponsor`:
    Charge one exact immutable sponsor-program revision

* `--fee-program <PROGRAM_ID>` — Exact sponsor program (`<canonical-I105>/<name>`); valid only with `--fee-payer sponsor`
* `--fee-program-revision <NONZERO_U64>` — Exact immutable sponsor-program revision; valid only with `--fee-payer sponsor`



## `iroha account`

Canonical account reads and account mutations

**Usage:** `iroha account <COMMAND>`

###### **Subcommands:**

* `role` — Read and write account roles
* `permission` — Read and write account permissions
* `list` — List accounts
* `get` — Retrieve details of a specific account
* `register` — Register an account
* `unregister` — Unregister an account
* `meta` — Read and write metadata



## `iroha account role`

Read and write account roles

**Usage:** `iroha account role <COMMAND>`

###### **Subcommands:**

* `list` — List account role IDs
* `grant` — Grant a role to an account
* `revoke` — Revoke a role from an account



## `iroha account role list`

List account role IDs

**Usage:** `iroha account role list [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha account role grant`

Grant a role to an account

**Usage:** `iroha account role grant --id <ID> --role <ROLE>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `-r`, `--role <ROLE>` — Role name



## `iroha account role revoke`

Revoke a role from an account

**Usage:** `iroha account role revoke --id <ID> --role <ROLE>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `-r`, `--role <ROLE>` — Role name



## `iroha account permission`

Read and write account permissions

**Usage:** `iroha account permission <COMMAND>`

###### **Subcommands:**

* `list` — List account permissions
* `grant` — Grant an account permission using JSON input from stdin
* `revoke` — Revoke an account permission using JSON input from stdin



## `iroha account permission list`

List account permissions

**Usage:** `iroha account permission list [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha account permission grant`

Grant an account permission using JSON input from stdin

**Usage:** `iroha account permission grant [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha account permission revoke`

Revoke an account permission using JSON input from stdin

**Usage:** `iroha account permission revoke [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha account list`

List accounts

**Usage:** `iroha account list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha account list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha account list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha account list filter`

Filter by a given predicate

**Usage:** `iroha account list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha account get`

Retrieve details of a specific account

**Usage:** `iroha account get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)



## `iroha account register`

Register an account

**Usage:** `iroha account register [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Canonical global account identifier for registration (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha account unregister`

Unregister an account

**Usage:** `iroha account unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)



## `iroha account meta`

Read and write metadata

**Usage:** `iroha account meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha account meta get`

Retrieve a value from the key-value store

**Usage:** `iroha account meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha account meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha account meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha account meta remove`

Delete an entry from the key-value store

**Usage:** `iroha account meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha tx`

Typed transaction status and transaction helpers

**Usage:** `iroha tx <COMMAND>`

###### **Subcommands:**

* `status` — Read the typed pipeline status of a submitted transaction
* `get` — Retrieve details of a specific transaction
* `ping` — Send an empty transaction that logs a message
* `ivm` — Send a transaction using IVM bytecode
* `stdin` — Send a transaction using JSON input from stdin
* `signed-size` — Build and sign stdin instructions locally, then print their exact framed size without submitting



## `iroha tx status`

Read the typed pipeline status of a submitted transaction

**Usage:** `iroha tx status [OPTIONS] --hash <HASH>`

###### **Options:**

* `-H`, `--hash <HASH>` — Hash of the signed transaction to inspect
* `--scope <SCOPE>` — Explicit status routing scope for a one-shot read. `--wait` always uses exact global status and succeeds only on state-resolved Applied

  Possible values:
  - `local`:
    Query only the configured Torii peer
  - `global`:
    Permit Torii's global/fanout status lookup

* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha tx get`

Retrieve details of a specific transaction

**Usage:** `iroha tx get --hash <HASH>`

###### **Options:**

* `-H`, `--hash <HASH>` — Hash of the transaction to retrieve



## `iroha tx ping`

Send an empty transaction that logs a message

**Usage:** `iroha tx ping [OPTIONS] --msg <MSG>`

###### **Options:**

* `-l`, `--log-level <LOG_LEVEL>` — Log levels: TRACE, DEBUG, INFO, WARN, ERROR (in increasing order of visibility)

  Default value: `DEBUG`
* `-m`, `--msg <MSG>` — Log message
* `--count <COUNT>` — Number of ping transactions to send

  Default value: `1`
* `--parallel <PARALLEL>` — Number of parallel workers to use when sending multiple pings

  Default value: `1`
* `--parallel-cap <PARALLEL_CAP>` — Maximum number of parallel workers (0 disables the cap)

  Default value: `1024`
* `--no-wait` — Submit without waiting for confirmation
* `--no-index` — Do not suffix message with "-<index>" when count > 1



## `iroha tx ivm`

Send a transaction using IVM bytecode

**Usage:** `iroha tx ivm [OPTIONS]`

###### **Options:**

* `-p`, `--path <PATH>` — Path to the IVM bytecode file. If omitted, reads from stdin
* `--gas-limit <U64>` — Signature-bound transaction gas limit for this IVM submit



## `iroha tx stdin`

Send a transaction using JSON input from stdin

**Usage:** `iroha tx stdin`



## `iroha tx signed-size`

Build and sign stdin instructions locally, then print their exact framed size without submitting

**Usage:** `iroha tx signed-size`



## `iroha ledger`

Ledger data and transaction helpers

**Usage:** `iroha ledger <COMMAND>`

###### **Subcommands:**

* `domain` — Read and write domains
* `account` — Read and write accounts
* `asset` — Read and write assets
* `nft` — Read and write NFTs
* `rwa` — Read and write RWA lots
* `peer` — Read and write peers
* `role` — Read and write roles
* `parameter` — Read and write system parameters
* `trigger` — Read and write triggers
* `query` — Read various data
* `transaction` — Read transactions and write various data
* `multisig` — Read and write multi-signature accounts and transactions
* `events` — Subscribe to events: state changes, transaction/block/trigger progress
* `blocks` — Subscribe to blocks



## `iroha ledger domain`

Read and write domains

**Usage:** `iroha ledger domain <COMMAND>`

###### **Subcommands:**

* `list` — List domains
* `get` — Retrieve details of a specific domain
* `unregister` — Unregister a domain
* `transfer` — Transfer ownership of a domain
* `meta` — Read and write metadata



## `iroha ledger domain list`

List domains

**Usage:** `iroha ledger domain list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger domain list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger domain list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger domain list filter`

Filter by a given predicate

**Usage:** `iroha ledger domain list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger domain get`

Retrieve details of a specific domain

**Usage:** `iroha ledger domain get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Domain name



## `iroha ledger domain unregister`

Unregister a domain

**Usage:** `iroha ledger domain unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Domain name



## `iroha ledger domain transfer`

Transfer ownership of a domain

**Usage:** `iroha ledger domain transfer --id <ID> --from <FROM> --to <TO>`

###### **Options:**

* `-i`, `--id <ID>` — Domain name
* `-f`, `--from <FROM>` — Source account identifier (canonical I105 literal)
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)



## `iroha ledger domain meta`

Read and write metadata

**Usage:** `iroha ledger domain meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger domain meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger domain meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger domain meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger domain meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger domain meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger domain meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger account`

Read and write accounts

**Usage:** `iroha ledger account <COMMAND>`

###### **Subcommands:**

* `role` — Read and write account roles
* `permission` — Read and write account permissions
* `list` — List accounts
* `get` — Retrieve details of a specific account
* `register` — Register an account
* `unregister` — Unregister an account
* `meta` — Read and write metadata



## `iroha ledger account role`

Read and write account roles

**Usage:** `iroha ledger account role <COMMAND>`

###### **Subcommands:**

* `list` — List account role IDs
* `grant` — Grant a role to an account
* `revoke` — Revoke a role from an account



## `iroha ledger account role list`

List account role IDs

**Usage:** `iroha ledger account role list [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha ledger account role grant`

Grant a role to an account

**Usage:** `iroha ledger account role grant --id <ID> --role <ROLE>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `-r`, `--role <ROLE>` — Role name



## `iroha ledger account role revoke`

Revoke a role from an account

**Usage:** `iroha ledger account role revoke --id <ID> --role <ROLE>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `-r`, `--role <ROLE>` — Role name



## `iroha ledger account permission`

Read and write account permissions

**Usage:** `iroha ledger account permission <COMMAND>`

###### **Subcommands:**

* `list` — List account permissions
* `grant` — Grant an account permission using JSON input from stdin
* `revoke` — Revoke an account permission using JSON input from stdin



## `iroha ledger account permission list`

List account permissions

**Usage:** `iroha ledger account permission list [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha ledger account permission grant`

Grant an account permission using JSON input from stdin

**Usage:** `iroha ledger account permission grant [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger account permission revoke`

Revoke an account permission using JSON input from stdin

**Usage:** `iroha ledger account permission revoke [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger account list`

List accounts

**Usage:** `iroha ledger account list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger account list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger account list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger account list filter`

Filter by a given predicate

**Usage:** `iroha ledger account list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger account get`

Retrieve details of a specific account

**Usage:** `iroha ledger account get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)



## `iroha ledger account register`

Register an account

**Usage:** `iroha ledger account register [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Canonical global account identifier for registration (canonical I105 literal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger account unregister`

Unregister an account

**Usage:** `iroha ledger account unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Account identifier (canonical I105 literal)



## `iroha ledger account meta`

Read and write metadata

**Usage:** `iroha ledger account meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger account meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger account meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger account meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger account meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger account meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger account meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger asset`

Read and write assets

**Usage:** `iroha ledger asset <COMMAND>`

###### **Subcommands:**

* `definition` — Read and write asset definitions
* `get` — Retrieve details of a specific asset
* `list` — List assets
* `mint` — Increase the quantity of an asset
* `burn` — Decrease the quantity of an asset
* `transfer` — Transfer an asset between accounts



## `iroha ledger asset definition`

Read and write asset definitions

**Usage:** `iroha ledger asset definition <COMMAND>`

###### **Subcommands:**

* `list` — List asset definitions
* `get` — Retrieve details of a specific asset definition
* `register` — Register an asset definition
* `unregister` — Unregister an asset definition
* `transfer` — Transfer ownership of an asset definition
* `meta` — Read and write metadata



## `iroha ledger asset definition list`

List asset definitions

**Usage:** `iroha ledger asset definition list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger asset definition list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger asset definition list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger asset definition list filter`

Filter by a given predicate

**Usage:** `iroha ledger asset definition list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger asset definition get`

Retrieve details of a specific asset definition

**Usage:** `iroha ledger asset definition get [OPTIONS]`

###### **Options:**

* `-i`, `--id <ID>` — Asset definition identifier (unprefixed Base58 address)
* `--alias <ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`)



## `iroha ledger asset definition register`

Register an asset definition

**Usage:** `iroha ledger asset definition register [OPTIONS] --id <ID> --name <NAME>`

###### **Options:**

* `-i`, `--id <ID>` — Asset definition identifier (unprefixed Base58 address)
* `--name <NAME>` — Human-readable asset name
* `--description <DESCRIPTION>` — Optional human-readable description
* `--alias <ALIAS>` — Optional explicit alias literal (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`)
* `--alias-domain <ALIAS_DOMAIN>` — Optional alias owner/domain segment used to build `<name>#<domain>.<dataspace>`
* `--alias-dataspace <ALIAS_DATASPACE>` — Optional alias dataspace segment used to build `<name>#<domain>.<dataspace>` or `<name>#<dataspace>`
* `--logo <LOGO>` — Optional logo URI. Must use `sorafs://...`
* `-m`, `--mint-once` — Disables minting after the first instance
* `-s`, `--scale <SCALE>` — Numeric scale of the asset. No value means unconstrained



## `iroha ledger asset definition unregister`

Unregister an asset definition

**Usage:** `iroha ledger asset definition unregister [OPTIONS]`

###### **Options:**

* `-i`, `--id <ID>` — Asset definition identifier (unprefixed Base58 address)
* `--alias <ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`)



## `iroha ledger asset definition transfer`

Transfer ownership of an asset definition

**Usage:** `iroha ledger asset definition transfer [OPTIONS] --from <FROM> --to <TO>`

###### **Options:**

* `-i`, `--id <ID>` — Asset definition identifier (unprefixed Base58 address)
* `--alias <ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`)
* `-f`, `--from <FROM>` — Source account identifier (canonical I105 literal)
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)



## `iroha ledger asset definition meta`

Read and write metadata

**Usage:** `iroha ledger asset definition meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger asset definition meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger asset definition meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger asset definition meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger asset definition meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger asset definition meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger asset definition meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger asset get`

Retrieve details of a specific asset

**Usage:** `iroha ledger asset get [OPTIONS]`

###### **Options:**

* `--definition <DEFINITION>` — Canonical asset definition id (unprefixed Base58 address) used with `--account`
* `--definition-alias <DEFINITION_ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`) used with `--account`
* `--account <ACCOUNT>` — Account identifier (canonical I105), required with asset selectors
* `--scope <SCOPE>` — Optional balance scope (`global` or `dataspace:<id>`)



## `iroha ledger asset list`

List assets

**Usage:** `iroha ledger asset list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger asset list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger asset list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger asset list filter`

Filter by a given predicate

**Usage:** `iroha ledger asset list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger asset mint`

Increase the quantity of an asset

**Usage:** `iroha ledger asset mint [OPTIONS] --quantity <QUANTITY>`

###### **Options:**

* `--definition <DEFINITION>` — Canonical asset definition id (unprefixed Base58 address) used with `--account`
* `--definition-alias <DEFINITION_ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`) used with `--account`
* `--account <ACCOUNT>` — Account identifier (canonical I105), required with asset selectors
* `--scope <SCOPE>` — Optional balance scope (`global` or `dataspace:<id>`)
* `-q`, `--quantity <QUANTITY>` — Amount of change (integer or decimal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger asset burn`

Decrease the quantity of an asset

**Usage:** `iroha ledger asset burn [OPTIONS] --quantity <QUANTITY>`

###### **Options:**

* `--definition <DEFINITION>` — Canonical asset definition id (unprefixed Base58 address) used with `--account`
* `--definition-alias <DEFINITION_ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`) used with `--account`
* `--account <ACCOUNT>` — Account identifier (canonical I105), required with asset selectors
* `--scope <SCOPE>` — Optional balance scope (`global` or `dataspace:<id>`)
* `-q`, `--quantity <QUANTITY>` — Amount of change (integer or decimal)
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger asset transfer`

Transfer an asset between accounts

**Usage:** `iroha ledger asset transfer [OPTIONS] --to <TO> --quantity <QUANTITY>`

###### **Options:**

* `--definition <DEFINITION>` — Canonical asset definition id (unprefixed Base58 address) used with `--account`
* `--definition-alias <DEFINITION_ALIAS>` — Asset definition alias (`<name>#<domain>.<dataspace>` or `<name>#<dataspace>`) used with `--account`
* `--account <ACCOUNT>` — Source account identifier (canonical I105), required with asset selectors
* `--scope <SCOPE>` — Optional balance scope (`global` or `dataspace:<id>`)
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)
* `-q`, `--quantity <QUANTITY>` — Transfer amount (integer or decimal)
* `--ensure-destination` — Attempt to register the destination when implicit receive is disabled
* `--no-wait` — Submit without waiting for confirmation



## `iroha ledger nft`

Read and write NFTs

**Usage:** `iroha ledger nft <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve details of a specific NFT
* `list` — List NFTs
* `register` — Register NFT with content provided from stdin in JSON format
* `unregister` — Unregister NFT
* `transfer` — Transfer ownership of NFT
* `meta` — Read and write metadata



## `iroha ledger nft get`

Retrieve details of a specific NFT

**Usage:** `iroha ledger nft get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — NFT in the format "name$domain"



## `iroha ledger nft list`

List NFTs

**Usage:** `iroha ledger nft list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger nft list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger nft list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger nft list filter`

Filter by a given predicate

**Usage:** `iroha ledger nft list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger nft register`

Register NFT with content provided from stdin in JSON format

**Usage:** `iroha ledger nft register --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — NFT in the format "name$domain"



## `iroha ledger nft unregister`

Unregister NFT

**Usage:** `iroha ledger nft unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — NFT in the format "name$domain"



## `iroha ledger nft transfer`

Transfer ownership of NFT

**Usage:** `iroha ledger nft transfer --id <ID> --from <FROM> --to <TO>`

###### **Options:**

* `-i`, `--id <ID>` — NFT in the format "name$domain"
* `-f`, `--from <FROM>` — Source account identifier (canonical I105 literal)
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)



## `iroha ledger nft meta`

Read and write metadata

**Usage:** `iroha ledger nft meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger nft meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger nft meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger nft meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger nft meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger nft meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger nft meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger rwa`

Read and write RWA lots

**Usage:** `iroha ledger rwa <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve details of a specific RWA lot
* `list` — List RWA lots
* `register` — Register an RWA lot using `NewRwa` JSON from stdin
* `transfer` — Transfer quantity from an existing lot
* `merge` — Merge parent lots using `MergeRwas` JSON from stdin
* `redeem` — Redeem quantity from an existing lot
* `freeze` — Freeze an existing lot
* `unfreeze` — Unfreeze an existing lot
* `hold` — Hold quantity on an existing lot
* `release` — Release held quantity from an existing lot
* `force-transfer` — Force-transfer quantity from an existing lot
* `set-controls` — Replace the lot control policy using `RwaControlPolicy` JSON from stdin
* `meta` — Read and write metadata



## `iroha ledger rwa get`

Retrieve details of a specific RWA lot

**Usage:** `iroha ledger rwa get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`



## `iroha ledger rwa list`

List RWA lots

**Usage:** `iroha ledger rwa list <COMMAND>`

###### **Subcommands:**

* `all` — List all IDs, or full entries when `--verbose` is specified
* `filter` — Filter by a given predicate



## `iroha ledger rwa list all`

List all IDs, or full entries when `--verbose` is specified

**Usage:** `iroha ledger rwa list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger rwa list filter`

Filter by a given predicate

**Usage:** `iroha ledger rwa list filter [OPTIONS] <PREDICATE>`

###### **Arguments:**

* `<PREDICATE>` — Filtering condition specified as a JSON string

###### **Options:**

* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger rwa register`

Register an RWA lot using `NewRwa` JSON from stdin

**Usage:** `iroha ledger rwa register`



## `iroha ledger rwa transfer`

Transfer quantity from an existing lot

**Usage:** `iroha ledger rwa transfer --id <ID> --from <FROM> --quantity <QUANTITY> --to <TO>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`
* `-f`, `--from <FROM>` — Source account identifier (canonical I105 literal)
* `-q`, `--quantity <QUANTITY>` — Quantity to transfer
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)



## `iroha ledger rwa merge`

Merge parent lots using `MergeRwas` JSON from stdin

**Usage:** `iroha ledger rwa merge`



## `iroha ledger rwa redeem`

Redeem quantity from an existing lot

**Usage:** `iroha ledger rwa redeem --id <ID> --quantity <QUANTITY>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`
* `-q`, `--quantity <QUANTITY>` — Quantity for the operation



## `iroha ledger rwa freeze`

Freeze an existing lot

**Usage:** `iroha ledger rwa freeze --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`



## `iroha ledger rwa unfreeze`

Unfreeze an existing lot

**Usage:** `iroha ledger rwa unfreeze --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`



## `iroha ledger rwa hold`

Hold quantity on an existing lot

**Usage:** `iroha ledger rwa hold --id <ID> --quantity <QUANTITY>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`
* `-q`, `--quantity <QUANTITY>` — Quantity for the operation



## `iroha ledger rwa release`

Release held quantity from an existing lot

**Usage:** `iroha ledger rwa release --id <ID> --quantity <QUANTITY>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`
* `-q`, `--quantity <QUANTITY>` — Quantity for the operation



## `iroha ledger rwa force-transfer`

Force-transfer quantity from an existing lot

**Usage:** `iroha ledger rwa force-transfer --id <ID> --quantity <QUANTITY> --to <TO>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`
* `-q`, `--quantity <QUANTITY>` — Quantity to transfer
* `-t`, `--to <TO>` — Destination account identifier (canonical I105 literal)



## `iroha ledger rwa set-controls`

Replace the lot control policy using `RwaControlPolicy` JSON from stdin

**Usage:** `iroha ledger rwa set-controls --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — RWA identifier in the format `hash$domain`



## `iroha ledger rwa meta`

Read and write metadata

**Usage:** `iroha ledger rwa meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger rwa meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger rwa meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger rwa meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger rwa meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger rwa meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger rwa meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger peer`

Read and write peers

**Usage:** `iroha ledger peer <COMMAND>`

###### **Subcommands:**

* `list` — List registered peers expected to connect with each other
* `register` — Register a peer
* `unregister` — Unregister a peer



## `iroha ledger peer list`

List registered peers expected to connect with each other

**Usage:** `iroha ledger peer list <COMMAND>`

###### **Subcommands:**

* `all` — List all registered peers



## `iroha ledger peer list all`

List all registered peers

**Usage:** `iroha ledger peer list all [OPTIONS]`

###### **Options:**

* `-v`, `--verbose` — Display detailed entry information instead of just IDs (when supported)
* `--sort-by-metadata-key <SORT_BY_METADATA_KEY>` — Sort by metadata key
* `--order <ORDER>` — Sort order (asc or desc)

  Possible values: `asc`, `desc`

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries
* `--select <SELECT>` — Experimental selector (JSON). Currently ignored; reserved for future server-side projection



## `iroha ledger peer register`

Register a peer

**Usage:** `iroha ledger peer register --key <KEY> --pop <HEX>`

###### **Options:**

* `-k`, `--key <KEY>` — Peer's public key in multihash format (must be BLS-normal)
* `--pop <HEX>` — Proof-of-possession bytes as hex (with or without 0x prefix)



## `iroha ledger peer unregister`

Unregister a peer

**Usage:** `iroha ledger peer unregister --key <KEY>`

###### **Options:**

* `-k`, `--key <KEY>` — Peer's public key in multihash format



## `iroha ledger role`

Read and write roles

**Usage:** `iroha ledger role <COMMAND>`

###### **Subcommands:**

* `permission` — Read and write role permissions
* `list` — List role IDs
* `register` — Register a role and grant it to the registrant
* `unregister` — Unregister a role



## `iroha ledger role permission`

Read and write role permissions

**Usage:** `iroha ledger role permission <COMMAND>`

###### **Subcommands:**

* `list` — List role permissions
* `grant` — Grant role permission using JSON input from stdin
* `revoke` — Revoke role permission using JSON input from stdin



## `iroha ledger role permission list`

List role permissions

**Usage:** `iroha ledger role permission list [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Role name
* `--limit <LIMIT>` — Maximum number of items to return (client-side for now)
* `--offset <OFFSET>` — Offset into the result set (client-side for now)

  Default value: `0`



## `iroha ledger role permission grant`

Grant role permission using JSON input from stdin

**Usage:** `iroha ledger role permission grant --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Role name



## `iroha ledger role permission revoke`

Revoke role permission using JSON input from stdin

**Usage:** `iroha ledger role permission revoke --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Role name



## `iroha ledger role list`

List role IDs

**Usage:** `iroha ledger role list <COMMAND>`

###### **Subcommands:**

* `all` — List all role IDs



## `iroha ledger role list all`

List all role IDs

**Usage:** `iroha ledger role list all [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha ledger role register`

Register a role and grant it to the registrant

**Usage:** `iroha ledger role register --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Role name



## `iroha ledger role unregister`

Unregister a role

**Usage:** `iroha ledger role unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Role name



## `iroha ledger parameter`

Read and write system parameters

**Usage:** `iroha ledger parameter <COMMAND>`

###### **Subcommands:**

* `list` — List system parameters
* `set` — Set a system parameter using JSON input from stdin



## `iroha ledger parameter list`

List system parameters

**Usage:** `iroha ledger parameter list <COMMAND>`

###### **Subcommands:**

* `all` — List all system parameters



## `iroha ledger parameter list all`

List all system parameters

**Usage:** `iroha ledger parameter list all`



## `iroha ledger parameter set`

Set a system parameter using JSON input from stdin

**Usage:** `iroha ledger parameter set`



## `iroha ledger trigger`

Read and write triggers

**Usage:** `iroha ledger trigger <COMMAND>`

###### **Subcommands:**

* `list` — List trigger IDs
* `get` — Retrieve details of a specific trigger
* `register` — Register a trigger
* `unregister` — Unregister a trigger
* `mint` — Increase the number of trigger executions
* `burn` — Decrease the number of trigger executions
* `enable` — Enable a trigger by setting metadata key `__enabled=true`
* `disable` — Disable a trigger by setting metadata key `__enabled=false`
* `execute` — Execute a by-call trigger with optional JSON arguments
* `inspect` — Inspect trigger declaration and optional live completion evidence
* `completed` — Collect or watch trigger completion events
* `meta` — Read and write metadata



## `iroha ledger trigger list`

List trigger IDs

**Usage:** `iroha ledger trigger list <COMMAND>`

###### **Subcommands:**

* `all` — List registered trigger IDs



## `iroha ledger trigger list all`

List registered trigger IDs

**Usage:** `iroha ledger trigger list all [OPTIONS]`

###### **Options:**

* `--active` — Only list active trigger IDs
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha ledger trigger get`

Retrieve details of a specific trigger

**Usage:** `iroha ledger trigger get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name



## `iroha ledger trigger register`

Register a trigger

**Usage:** `iroha ledger trigger register [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-p`, `--path <PATH>` — Path to the compiled IVM bytecode to execute
* `--instructions-stdin` — Read JSON array of instructions from stdin instead of bytecode path Example: echo "[ {\"Log\": {\"level\": \"INFO\", \"message\": \"hi\"}} ]" | iroha trigger register -i `my_trig` --instructions-stdin
* `--instructions <PATH>` — Read JSON array of instructions from a file instead of bytecode path
* `-r`, `--repeats <REPEATS>` — Number of permitted executions (default: indefinitely)
* `--authority <AUTHORITY>` — Account executing the trigger (canonical I105 literal)
* `--filter <FILTER>` — Filter type for the trigger

  Default value: `execute`

  Possible values: `execute`, `time`, `data`

* `--time-start-ms <TIME_START_MS>` — Start time in milliseconds since UNIX epoch for time filter
* `--time-period-ms <TIME_PERIOD_MS>` — Period in milliseconds for time filter (optional)
* `--data-filter <JSON>` — JSON for a `DataEventFilter` to use as filter
* `--data-domain <DATA_DOMAIN>` — Data filter preset: events within a domain
* `--data-account <DATA_ACCOUNT>` — Data filter preset: events for an account (canonical I105 literal)
* `--data-asset <DATA_ASSET>` — Data filter preset: events for a specific asset definition; use with `--data-asset-account` for a concrete ownership bucket
* `--data-asset-account <DATA_ASSET_ACCOUNT>` — Data filter preset: account owning the selected asset bucket (canonical I105 literal)
* `--data-asset-scope <DATA_ASSET_SCOPE>` — Data filter preset: balance scope for the selected asset bucket (`global` or `dataspace:<id>`)
* `--data-asset-definition <DATA_ASSET_DEFINITION>` — Data filter preset: events for an asset definition
* `--data-role <DATA_ROLE>` — Data filter preset: events for a role
* `--data-trigger <DATA_TRIGGER>` — Data filter preset: events for a trigger
* `--data-verifying-key <BACKEND:NAME>` — Data filter preset: events for a verifying key (format: `<backend>:<name>`)
* `--data-proof <BACKEND:HEX>` — Data filter preset: events for a proof (format: `<backend>:<64-hex-proof-hash>`)
* `--data-proof-only <PRESET>` — Restrict proof events to a preset when using `--data-proof`. Presets: `verified`, `rejected`, `all` (default)

  Possible values:
  - `all`:
    All proof events (default)
  - `verified`:
    Only Verified events
  - `rejected`:
    Only Rejected events

* `--data-vk-only <PRESET>` — Restrict verifying key events to a preset when using `--data-verifying-key`. Presets: `registered`, `updated`, `all` (default)

  Possible values:
  - `all`:
    All verifying key events (default)
  - `registered`:
    Only Registered events
  - `updated`:
    Only Updated events

* `--time-start <DURATION>` — Human-readable offset for time start (e.g., "5m", "1h"), added to current time
* `--time-start-rfc3339 <RFC3339>` — RFC3339 timestamp for time filter start (e.g., 2025-01-01T00:00:00Z)



## `iroha ledger trigger unregister`

Unregister a trigger

**Usage:** `iroha ledger trigger unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name



## `iroha ledger trigger mint`

Increase the number of trigger executions

**Usage:** `iroha ledger trigger mint --id <ID> --repetitions <REPETITIONS>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-r`, `--repetitions <REPETITIONS>` — Amount of change (integer)



## `iroha ledger trigger burn`

Decrease the number of trigger executions

**Usage:** `iroha ledger trigger burn --id <ID> --repetitions <REPETITIONS>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-r`, `--repetitions <REPETITIONS>` — Amount of change (integer)



## `iroha ledger trigger enable`

Enable a trigger by setting metadata key `__enabled=true`

**Usage:** `iroha ledger trigger enable <ID>`

###### **Arguments:**

* `<ID>` — Trigger name



## `iroha ledger trigger disable`

Disable a trigger by setting metadata key `__enabled=false`

**Usage:** `iroha ledger trigger disable <ID>`

###### **Arguments:**

* `<ID>` — Trigger name



## `iroha ledger trigger execute`

Execute a by-call trigger with optional JSON arguments

**Usage:** `iroha ledger trigger execute [OPTIONS] <ID>`

###### **Arguments:**

* `<ID>` — Trigger name

###### **Options:**

* `--args-json <ARGS_JSON>` — JSON object passed as trigger execution arguments

  Default value: `{}`
* `--trace` — Include runtime completion and pipeline diagnostics from Torii after finality
* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha ledger trigger inspect`

Inspect trigger declaration and optional live completion evidence

**Usage:** `iroha ledger trigger inspect [OPTIONS] <ID>`

###### **Arguments:**

* `<ID>` — Trigger name

###### **Options:**

* `--completion-timeout-ms <COMPLETION_TIMEOUT_MS>` — Also collect recent live completion evidence for this duration

  Default value: `0`
* `--completion-limit <COMPLETION_LIMIT>` — Maximum live completion events to include when completion collection is enabled

  Default value: `5`



## `iroha ledger trigger completed`

Collect or watch trigger completion events

**Usage:** `iroha ledger trigger completed <COMMAND>`

###### **Subcommands:**

* `list` — List matching trigger completions from committed block history
* `watch` — Stream matching trigger completion events until interrupted, timed out, or limited



## `iroha ledger trigger completed list`

List matching trigger completions from committed block history

**Usage:** `iroha ledger trigger completed list [OPTIONS]`

###### **Options:**

* `--id <ID>` — Optional trigger ID filter
* `--outcome <OUTCOME>` — Optional completion outcome filter

  Default value: `all`

  Possible values: `all`, `success`, `failure`

* `--limit <LIMIT>` — Maximum completion records to return

  Default value: `10`
* `--from-height <FROM_HEIGHT>` — First block height to scan. Defaults to the recent bounded window
* `--to-height <TO_HEIGHT>` — Last block height to scan. Defaults to the current committed height
* `--scan-limit-blocks <SCAN_LIMIT_BLOCKS>` — Hard cap on blocks scanned, including when --from-height is supplied

  Default value: `1000`



## `iroha ledger trigger completed watch`

Stream matching trigger completion events until interrupted, timed out, or limited

**Usage:** `iroha ledger trigger completed watch [OPTIONS]`

###### **Options:**

* `--id <ID>` — Optional trigger ID filter
* `--outcome <OUTCOME>` — Optional completion outcome filter

  Default value: `all`

  Possible values: `all`, `success`, `failure`

* `--limit <LIMIT>` — Optional maximum events to emit before returning
* `--timeout-ms <TIMEOUT_MS>` — Optional maximum live-stream watch time



## `iroha ledger trigger meta`

Read and write metadata

**Usage:** `iroha ledger trigger meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha ledger trigger meta get`

Retrieve a value from the key-value store

**Usage:** `iroha ledger trigger meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger trigger meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha ledger trigger meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger trigger meta remove`

Delete an entry from the key-value store

**Usage:** `iroha ledger trigger meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ledger query`

Read various data

**Usage:** `iroha ledger query <COMMAND>`

###### **Subcommands:**

* `stdin` — Query using JSON input from stdin
* `stdin-raw` — Query using raw `SignedQuery` (base64 or hex) from stdin



## `iroha ledger query stdin`

Query using JSON input from stdin

**Usage:** `iroha ledger query stdin`



## `iroha ledger query stdin-raw`

Query using raw `SignedQuery` (base64 or hex) from stdin

**Usage:** `iroha ledger query stdin-raw`



## `iroha ledger transaction`

Read transactions and write various data

**Usage:** `iroha ledger transaction <COMMAND>`

###### **Subcommands:**

* `status` — Read the typed pipeline status of a submitted transaction
* `get` — Retrieve details of a specific transaction
* `ping` — Send an empty transaction that logs a message
* `ivm` — Send a transaction using IVM bytecode
* `stdin` — Send a transaction using JSON input from stdin
* `signed-size` — Build and sign stdin instructions locally, then print their exact framed size without submitting



## `iroha ledger transaction status`

Read the typed pipeline status of a submitted transaction

**Usage:** `iroha ledger transaction status [OPTIONS] --hash <HASH>`

###### **Options:**

* `-H`, `--hash <HASH>` — Hash of the signed transaction to inspect
* `--scope <SCOPE>` — Explicit status routing scope for a one-shot read. `--wait` always uses exact global status and succeeds only on state-resolved Applied

  Possible values:
  - `local`:
    Query only the configured Torii peer
  - `global`:
    Permit Torii's global/fanout status lookup

* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha ledger transaction get`

Retrieve details of a specific transaction

**Usage:** `iroha ledger transaction get --hash <HASH>`

###### **Options:**

* `-H`, `--hash <HASH>` — Hash of the transaction to retrieve



## `iroha ledger transaction ping`

Send an empty transaction that logs a message

**Usage:** `iroha ledger transaction ping [OPTIONS] --msg <MSG>`

###### **Options:**

* `-l`, `--log-level <LOG_LEVEL>` — Log levels: TRACE, DEBUG, INFO, WARN, ERROR (in increasing order of visibility)

  Default value: `DEBUG`
* `-m`, `--msg <MSG>` — Log message
* `--count <COUNT>` — Number of ping transactions to send

  Default value: `1`
* `--parallel <PARALLEL>` — Number of parallel workers to use when sending multiple pings

  Default value: `1`
* `--parallel-cap <PARALLEL_CAP>` — Maximum number of parallel workers (0 disables the cap)

  Default value: `1024`
* `--no-wait` — Submit without waiting for confirmation
* `--no-index` — Do not suffix message with "-<index>" when count > 1



## `iroha ledger transaction ivm`

Send a transaction using IVM bytecode

**Usage:** `iroha ledger transaction ivm [OPTIONS]`

###### **Options:**

* `-p`, `--path <PATH>` — Path to the IVM bytecode file. If omitted, reads from stdin
* `--gas-limit <U64>` — Signature-bound transaction gas limit for this IVM submit



## `iroha ledger transaction stdin`

Send a transaction using JSON input from stdin

**Usage:** `iroha ledger transaction stdin`



## `iroha ledger transaction signed-size`

Build and sign stdin instructions locally, then print their exact framed size without submitting

**Usage:** `iroha ledger transaction signed-size`



## `iroha ledger multisig`

Read and write multi-signature accounts and transactions

**Usage:** `iroha ledger multisig <COMMAND>`

###### **Subcommands:**

* `list` — List pending multisig proposals for explicitly selected authorities
* `register` — Register a multisig account
* `propose` — Propose a multisig transaction using JSON input from stdin
* `approve` — Approve a multisig transaction
* `cancel` — Propose cancellation of an existing multisig transaction
* `inspect` — Inspect a multisig account controller and print the CTAP2 payload + digest



## `iroha ledger multisig list`

List pending multisig proposals for explicitly selected authorities

**Usage:** `iroha ledger multisig list <COMMAND>`

###### **Subcommands:**

* `all` — List pending proposals for an explicit finite set of multisig authorities



## `iroha ledger multisig list all`

List pending proposals for an explicit finite set of multisig authorities

**Usage:** `iroha ledger multisig list all [OPTIONS] --multisig-selector <MULTISIG_SELECTORS>`

###### **Options:**

* `--multisig-selector <MULTISIG_SELECTORS>` — Exact multisig account id or canonical alias to query; repeat for each authority
* `--limit <LIMIT>` — Maximum number of proposals to emit after server ordering (client-side cap)
* `--offset <OFFSET>` — Number of ordered proposals to skip after fetching cursor pages

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Cursor page size for each remote proposals query request



## `iroha ledger multisig register`

Register a multisig account

**Usage:** `iroha ledger multisig register [OPTIONS] --quorum <QUORUM>`

###### **Options:**

* `-s`, `--signatories <SIGNATORIES>` — List of signatories for the multisig account (canonical I105 literal)
* `-w`, `--weights <WEIGHTS>` — Relative weights of signatories' responsibilities
* `-q`, `--quorum <QUORUM>` — Threshold of total weight required for authentication
* `--account <ACCOUNT>` — Account id to use for the multisig controller. If omitted, a new random domainless account id is generated locally, the private key is discarded, and the registration defaults to a domainless home-domain policy
* `-t`, `--transaction-ttl <TRANSACTION_TTL>` — Time-to-live for multisig transactions. Example: "1y 6M 2w 3d 12h 30m 30s"

  Default value: `1h`



## `iroha ledger multisig propose`

Propose a multisig transaction using JSON input from stdin

**Usage:** `iroha ledger multisig propose [OPTIONS] --account <ACCOUNT>`

###### **Options:**

* `-a`, `--account <ACCOUNT>` — Multisig authority managing the proposed transaction
* `-t`, `--transaction-ttl <TRANSACTION_TTL>` — Overrides the default time-to-live for this transaction. Example: "1y 6M 2w 3d 12h 30m 30s" Must not exceed the multisig policy TTL; the CLI will preview the effective expiry and reject overrides above the policy cap



## `iroha ledger multisig approve`

Approve a multisig transaction

**Usage:** `iroha ledger multisig approve --account <ACCOUNT> --instructions-hash <INSTRUCTIONS_HASH>`

###### **Options:**

* `-a`, `--account <ACCOUNT>` — Multisig authority of the transaction
* `-i`, `--instructions-hash <INSTRUCTIONS_HASH>` — Hash of the instructions to approve



## `iroha ledger multisig cancel`

Propose cancellation of an existing multisig transaction

**Usage:** `iroha ledger multisig cancel [OPTIONS] --account <ACCOUNT> --instructions-hash <INSTRUCTIONS_HASH>`

###### **Options:**

* `-a`, `--account <ACCOUNT>` — Multisig authority of the transaction
* `-i`, `--instructions-hash <INSTRUCTIONS_HASH>` — Hash of the target proposal instructions to cancel
* `-t`, `--transaction-ttl <TRANSACTION_TTL>` — Overrides the default time-to-live for the cancel proposal itself



## `iroha ledger multisig inspect`

Inspect a multisig account controller and print the CTAP2 payload + digest

**Usage:** `iroha ledger multisig inspect [OPTIONS] --account <ACCOUNT>`

###### **Options:**

* `-a`, `--account <ACCOUNT>` — Multisig account identifier to inspect
* `--json` — Emit JSON instead of human-readable output



## `iroha ledger events`

Subscribe to events: state changes, transaction/block/trigger progress

**Usage:** `iroha ledger events [OPTIONS] <COMMAND>`

###### **Subcommands:**

* `state` — Notify when the world state undergoes certain changes
* `governance` — Notify governance lifecycle events
* `transaction` — Notify when a transaction reaches specific stages
* `block` — Notify when a block reaches specific stages
* `trigger-execute` — Notify when a trigger execution is ordered
* `trigger-complete` — Notify when a trigger execution is completed

###### **Options:**

* `-t`, `--timeout <TIMEOUT>` — Duration to listen for events. Example: "1y 6M 2w 3d 12h 30m 30s"



## `iroha ledger events state`

Notify when the world state undergoes certain changes

**Usage:** `iroha ledger events state`



## `iroha ledger events governance`

Notify governance lifecycle events

**Usage:** `iroha ledger events governance [OPTIONS]`

###### **Options:**

* `--proposal-id <ID_HEX>` — Filter by proposal id (hex)
* `--referendum-id <RID>` — Filter by referendum id



## `iroha ledger events transaction`

Notify when a transaction reaches specific stages

**Usage:** `iroha ledger events transaction`



## `iroha ledger events block`

Notify when a block reaches specific stages

**Usage:** `iroha ledger events block`



## `iroha ledger events trigger-execute`

Notify when a trigger execution is ordered

**Usage:** `iroha ledger events trigger-execute`



## `iroha ledger events trigger-complete`

Notify when a trigger execution is completed

**Usage:** `iroha ledger events trigger-complete`



## `iroha ledger blocks`

Subscribe to blocks

**Usage:** `iroha ledger blocks [OPTIONS] <HEIGHT>`

###### **Arguments:**

* `<HEIGHT>` — Block height from which to start streaming blocks

###### **Options:**

* `-t`, `--timeout <TIMEOUT>` — Duration to listen for events. Example: "1y 6M 2w 3d 12h 30m 30s"



## `iroha trigger`

Read, write, and execute triggers

**Usage:** `iroha trigger <COMMAND>`

###### **Subcommands:**

* `list` — List trigger IDs
* `get` — Retrieve details of a specific trigger
* `register` — Register a trigger
* `unregister` — Unregister a trigger
* `mint` — Increase the number of trigger executions
* `burn` — Decrease the number of trigger executions
* `enable` — Enable a trigger by setting metadata key `__enabled=true`
* `disable` — Disable a trigger by setting metadata key `__enabled=false`
* `execute` — Execute a by-call trigger with optional JSON arguments
* `inspect` — Inspect trigger declaration and optional live completion evidence
* `completed` — Collect or watch trigger completion events
* `meta` — Read and write metadata



## `iroha trigger list`

List trigger IDs

**Usage:** `iroha trigger list <COMMAND>`

###### **Subcommands:**

* `all` — List registered trigger IDs



## `iroha trigger list all`

List registered trigger IDs

**Usage:** `iroha trigger list all [OPTIONS]`

###### **Options:**

* `--active` — Only list active trigger IDs
* `--limit <LIMIT>` — Maximum number of items to return (server-side limit)
* `--offset <OFFSET>` — Offset into the result set (server-side offset)

  Default value: `0`
* `--fetch-size <FETCH_SIZE>` — Batch fetch size for iterable queries



## `iroha trigger get`

Retrieve details of a specific trigger

**Usage:** `iroha trigger get --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name



## `iroha trigger register`

Register a trigger

**Usage:** `iroha trigger register [OPTIONS] --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-p`, `--path <PATH>` — Path to the compiled IVM bytecode to execute
* `--instructions-stdin` — Read JSON array of instructions from stdin instead of bytecode path Example: echo "[ {\"Log\": {\"level\": \"INFO\", \"message\": \"hi\"}} ]" | iroha trigger register -i `my_trig` --instructions-stdin
* `--instructions <PATH>` — Read JSON array of instructions from a file instead of bytecode path
* `-r`, `--repeats <REPEATS>` — Number of permitted executions (default: indefinitely)
* `--authority <AUTHORITY>` — Account executing the trigger (canonical I105 literal)
* `--filter <FILTER>` — Filter type for the trigger

  Default value: `execute`

  Possible values: `execute`, `time`, `data`

* `--time-start-ms <TIME_START_MS>` — Start time in milliseconds since UNIX epoch for time filter
* `--time-period-ms <TIME_PERIOD_MS>` — Period in milliseconds for time filter (optional)
* `--data-filter <JSON>` — JSON for a `DataEventFilter` to use as filter
* `--data-domain <DATA_DOMAIN>` — Data filter preset: events within a domain
* `--data-account <DATA_ACCOUNT>` — Data filter preset: events for an account (canonical I105 literal)
* `--data-asset <DATA_ASSET>` — Data filter preset: events for a specific asset definition; use with `--data-asset-account` for a concrete ownership bucket
* `--data-asset-account <DATA_ASSET_ACCOUNT>` — Data filter preset: account owning the selected asset bucket (canonical I105 literal)
* `--data-asset-scope <DATA_ASSET_SCOPE>` — Data filter preset: balance scope for the selected asset bucket (`global` or `dataspace:<id>`)
* `--data-asset-definition <DATA_ASSET_DEFINITION>` — Data filter preset: events for an asset definition
* `--data-role <DATA_ROLE>` — Data filter preset: events for a role
* `--data-trigger <DATA_TRIGGER>` — Data filter preset: events for a trigger
* `--data-verifying-key <BACKEND:NAME>` — Data filter preset: events for a verifying key (format: `<backend>:<name>`)
* `--data-proof <BACKEND:HEX>` — Data filter preset: events for a proof (format: `<backend>:<64-hex-proof-hash>`)
* `--data-proof-only <PRESET>` — Restrict proof events to a preset when using `--data-proof`. Presets: `verified`, `rejected`, `all` (default)

  Possible values:
  - `all`:
    All proof events (default)
  - `verified`:
    Only Verified events
  - `rejected`:
    Only Rejected events

* `--data-vk-only <PRESET>` — Restrict verifying key events to a preset when using `--data-verifying-key`. Presets: `registered`, `updated`, `all` (default)

  Possible values:
  - `all`:
    All verifying key events (default)
  - `registered`:
    Only Registered events
  - `updated`:
    Only Updated events

* `--time-start <DURATION>` — Human-readable offset for time start (e.g., "5m", "1h"), added to current time
* `--time-start-rfc3339 <RFC3339>` — RFC3339 timestamp for time filter start (e.g., 2025-01-01T00:00:00Z)



## `iroha trigger unregister`

Unregister a trigger

**Usage:** `iroha trigger unregister --id <ID>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name



## `iroha trigger mint`

Increase the number of trigger executions

**Usage:** `iroha trigger mint --id <ID> --repetitions <REPETITIONS>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-r`, `--repetitions <REPETITIONS>` — Amount of change (integer)



## `iroha trigger burn`

Decrease the number of trigger executions

**Usage:** `iroha trigger burn --id <ID> --repetitions <REPETITIONS>`

###### **Options:**

* `-i`, `--id <ID>` — Trigger name
* `-r`, `--repetitions <REPETITIONS>` — Amount of change (integer)



## `iroha trigger enable`

Enable a trigger by setting metadata key `__enabled=true`

**Usage:** `iroha trigger enable <ID>`

###### **Arguments:**

* `<ID>` — Trigger name



## `iroha trigger disable`

Disable a trigger by setting metadata key `__enabled=false`

**Usage:** `iroha trigger disable <ID>`

###### **Arguments:**

* `<ID>` — Trigger name



## `iroha trigger execute`

Execute a by-call trigger with optional JSON arguments

**Usage:** `iroha trigger execute [OPTIONS] <ID>`

###### **Arguments:**

* `<ID>` — Trigger name

###### **Options:**

* `--args-json <ARGS_JSON>` — JSON object passed as trigger execution arguments

  Default value: `{}`
* `--trace` — Include runtime completion and pipeline diagnostics from Torii after finality
* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha trigger inspect`

Inspect trigger declaration and optional live completion evidence

**Usage:** `iroha trigger inspect [OPTIONS] <ID>`

###### **Arguments:**

* `<ID>` — Trigger name

###### **Options:**

* `--completion-timeout-ms <COMPLETION_TIMEOUT_MS>` — Also collect recent live completion evidence for this duration

  Default value: `0`
* `--completion-limit <COMPLETION_LIMIT>` — Maximum live completion events to include when completion collection is enabled

  Default value: `5`



## `iroha trigger completed`

Collect or watch trigger completion events

**Usage:** `iroha trigger completed <COMMAND>`

###### **Subcommands:**

* `list` — List matching trigger completions from committed block history
* `watch` — Stream matching trigger completion events until interrupted, timed out, or limited



## `iroha trigger completed list`

List matching trigger completions from committed block history

**Usage:** `iroha trigger completed list [OPTIONS]`

###### **Options:**

* `--id <ID>` — Optional trigger ID filter
* `--outcome <OUTCOME>` — Optional completion outcome filter

  Default value: `all`

  Possible values: `all`, `success`, `failure`

* `--limit <LIMIT>` — Maximum completion records to return

  Default value: `10`
* `--from-height <FROM_HEIGHT>` — First block height to scan. Defaults to the recent bounded window
* `--to-height <TO_HEIGHT>` — Last block height to scan. Defaults to the current committed height
* `--scan-limit-blocks <SCAN_LIMIT_BLOCKS>` — Hard cap on blocks scanned, including when --from-height is supplied

  Default value: `1000`



## `iroha trigger completed watch`

Stream matching trigger completion events until interrupted, timed out, or limited

**Usage:** `iroha trigger completed watch [OPTIONS]`

###### **Options:**

* `--id <ID>` — Optional trigger ID filter
* `--outcome <OUTCOME>` — Optional completion outcome filter

  Default value: `all`

  Possible values: `all`, `success`, `failure`

* `--limit <LIMIT>` — Optional maximum events to emit before returning
* `--timeout-ms <TIMEOUT_MS>` — Optional maximum live-stream watch time



## `iroha trigger meta`

Read and write metadata

**Usage:** `iroha trigger meta <COMMAND>`

###### **Subcommands:**

* `get` — Retrieve a value from the key-value store
* `set` — Create or update an entry in the key-value store using JSON input from stdin
* `remove` — Delete an entry from the key-value store



## `iroha trigger meta get`

Retrieve a value from the key-value store

**Usage:** `iroha trigger meta get --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha trigger meta set`

Create or update an entry in the key-value store using JSON input from stdin

**Usage:** `iroha trigger meta set --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha trigger meta remove`

Delete an entry from the key-value store

**Usage:** `iroha trigger meta remove --id <ID> --key <KEY>`

###### **Options:**

* `-i`, `--id <ID>`
* `-k`, `--key <KEY>`



## `iroha ops`

Node and operator helpers

**Usage:** `iroha ops <COMMAND>`

###### **Subcommands:**

* `executor` — Read and write the executor
* `runtime` — Runtime ABI/upgrades
* `sumeragi` — Sumeragi helpers (status)
* `audit` — Audit helpers (debug endpoints)
* `connect` — Connect diagnostics helpers (queue inspection, evidence export)
* `bridge` — Bridge tools (feature: bridge)



## `iroha ops executor`

Read and write the executor

**Usage:** `iroha ops executor <COMMAND>`

###### **Subcommands:**

* `data-model` — Retrieve the executor data model
* `upgrade` — Upgrade the executor



## `iroha ops executor data-model`

Retrieve the executor data model

**Usage:** `iroha ops executor data-model`



## `iroha ops executor upgrade`

Upgrade the executor

**Usage:** `iroha ops executor upgrade --path <PATH>`

###### **Options:**

* `-p`, `--path <PATH>` — Path to the compiled IVM bytecode file



## `iroha ops runtime`

Runtime ABI/upgrades

**Usage:** `iroha ops runtime <COMMAND>`

###### **Subcommands:**

* `abi` — Runtime ABI helpers
* `upgrade` — Runtime upgrade management
* `status` — Show runtime metrics/status summary
* `capabilities` — Fetch node capability advert (ABI + crypto manifest)



## `iroha ops runtime abi`

Runtime ABI helpers

**Usage:** `iroha ops runtime abi <COMMAND>`

###### **Subcommands:**

* `active` — Fetch the active ABI version from the node
* `active-query` — Fetch the active ABI version via signed Norito query (core /query)
* `hash` — Fetch the node's canonical ABI hash for the active policy



## `iroha ops runtime abi active`

Fetch the active ABI version from the node

**Usage:** `iroha ops runtime abi active`



## `iroha ops runtime abi active-query`

Fetch the active ABI version via signed Norito query (core /query)

**Usage:** `iroha ops runtime abi active-query`



## `iroha ops runtime abi hash`

Fetch the node's canonical ABI hash for the active policy

**Usage:** `iroha ops runtime abi hash`



## `iroha ops runtime upgrade`

Runtime upgrade management

**Usage:** `iroha ops runtime upgrade <COMMAND>`

###### **Subcommands:**

* `list` — List proposed/activated runtime upgrades
* `propose` — Build a `ProposeRuntimeUpgrade` instruction skeleton via Torii
* `activate` — Build an `ActivateRuntimeUpgrade` instruction skeleton via Torii
* `cancel` — Build a `CancelRuntimeUpgrade` instruction skeleton via Torii



## `iroha ops runtime upgrade list`

List proposed/activated runtime upgrades

**Usage:** `iroha ops runtime upgrade list`



## `iroha ops runtime upgrade propose`

Build a `ProposeRuntimeUpgrade` instruction skeleton via Torii

**Usage:** `iroha ops runtime upgrade propose --file <PATH>`

###### **Options:**

* `--file <PATH>` — Path to a JSON file with `RuntimeUpgradeManifest` fields



## `iroha ops runtime upgrade activate`

Build an `ActivateRuntimeUpgrade` instruction skeleton via Torii

**Usage:** `iroha ops runtime upgrade activate --id <HEX>`

###### **Options:**

* `--id <HEX>` — Upgrade id (hex)



## `iroha ops runtime upgrade cancel`

Build a `CancelRuntimeUpgrade` instruction skeleton via Torii

**Usage:** `iroha ops runtime upgrade cancel --id <HEX>`

###### **Options:**

* `--id <HEX>` — Upgrade id (hex)



## `iroha ops runtime status`

Show runtime metrics/status summary

**Usage:** `iroha ops runtime status`



## `iroha ops runtime capabilities`

Fetch node capability advert (ABI + crypto manifest)

**Usage:** `iroha ops runtime capabilities`



## `iroha ops sumeragi`

Sumeragi helpers (status)

**Usage:** `iroha ops sumeragi <COMMAND>`

###### **Subcommands:**

* `status` — Show consensus status snapshot (leader, `HighestQC`, `LockedQC`)
* `diagnostics` — Show non-authoritative pipeline, queue, election, and lane diagnostics
* `leader` — Show leader index (and PRF context when available)
* `params` — Show on-chain Sumeragi parameters snapshot
* `qc` — Show HighestQC/LockedQC snapshot
* `evidence` — Evidence audit helpers (list/count)



## `iroha ops sumeragi status`

Show consensus status snapshot (leader, `HighestQC`, `LockedQC`)

**Usage:** `iroha ops sumeragi status`



## `iroha ops sumeragi diagnostics`

Show non-authoritative pipeline, queue, election, and lane diagnostics

**Usage:** `iroha ops sumeragi diagnostics`



## `iroha ops sumeragi leader`

Show leader index (and PRF context when available)

**Usage:** `iroha ops sumeragi leader`



## `iroha ops sumeragi params`

Show on-chain Sumeragi parameters snapshot

**Usage:** `iroha ops sumeragi params`



## `iroha ops sumeragi qc`

Show HighestQC/LockedQC snapshot

**Usage:** `iroha ops sumeragi qc`



## `iroha ops sumeragi evidence`

Evidence audit helpers (list/count)

**Usage:** `iroha ops sumeragi evidence <COMMAND>`

###### **Subcommands:**

* `list` — List persisted evidence entries
* `count` — Show evidence count



## `iroha ops sumeragi evidence list`

List persisted evidence entries

**Usage:** `iroha ops sumeragi evidence list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of entries to return
* `--offset <OFFSET>` — Offset into the evidence list
* `--kind <KIND>` — Filter by evidence kind

  Possible values: `SumeragiV2Equivocation`




## `iroha ops sumeragi evidence count`

Show evidence count

**Usage:** `iroha ops sumeragi evidence count`



## `iroha ops audit`

Audit helpers (debug endpoints)

**Usage:** `iroha ops audit <COMMAND>`

###### **Subcommands:**

* `witness` — Fetch current execution witness snapshot from Torii debug endpoints



## `iroha ops audit witness`

Fetch current execution witness snapshot from Torii debug endpoints

**Usage:** `iroha ops audit witness [OPTIONS]`

###### **Options:**

* `--binary` — Fetch Norito-encoded binary instead of JSON
* `--out <PATH>` — Output path for binary; if omitted with --binary, hex is printed to stdout
* `--decode <PATH>` — Decode a Norito-encoded `ExecWitness` from a file and print with human-readable keys
* `--filter <PREFIXES>` — Filter decoded entries by key namespace prefix (comma-separated). Shorthand groups supported: - roles => [role, role.binding, perm.account, perm.role] - assets => [asset, `asset_def.total`] - `all_assets` => [asset, `asset_def.total`, `asset_def.detail`] - metadata => [account.detail, domain.detail, nft.detail, `asset_def.detail`] - `all_meta` => [account.detail, domain.detail, nft.detail, `asset_def.detail`] (alias of metadata) - perm | perms | permissions => [perm.account, perm.role] Examples: "assets,metadata", "roles", "account.detail,domain.detail". Applied only with --decode; prefixes match the human-readable key labels.

   Matching on the identifier segment supports: - exact (e.g., `account.detail:sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV`) - partial substring (e.g., `account.detail:6cmzPVPX`) - glob wildcards `*` and `?` (e.g., `asset:rose#*#6cmz*`) - regex-like syntax `/.../` (treated as a glob pattern inside the slashes)
* `--fastpq-batches` — Include FASTPQ transition batches recorded in the witness when decoding (enabled by default)

  Default value: `true`
* `--no-fastpq-batches` — Disable FASTPQ batches to shrink the decoded output
* `--fastpq-parameter <NAME>` — Expected FASTPQ parameter set name; errors if batches use a different value

  Default value: `fastpq-state-transition-stark-v1`



## `iroha ops connect`

Connect diagnostics helpers (queue inspection, evidence export)

**Usage:** `iroha ops connect <COMMAND>`

###### **Subcommands:**

* `queue` — Queue inspection tooling



## `iroha ops connect queue`

Queue inspection tooling

**Usage:** `iroha ops connect queue <COMMAND>`

###### **Subcommands:**

* `inspect` — Inspect on-disk queue diagnostics for a Connect session



## `iroha ops connect queue inspect`

Inspect on-disk queue diagnostics for a Connect session

**Usage:** `iroha ops connect queue inspect [OPTIONS]`

###### **Options:**

* `--sid <SID>` — Connect session identifier (base64url, no padding). Required unless `--snapshot` is provided
* `--snapshot <SNAPSHOT>` — Path to an explicit snapshot JSON file (defaults to `<root>/<sid>/state.json`)
* `--root <ROOT>` — Root directory containing Connect queue state (defaults to `connect.queue.root` or `~/.iroha/connect`)
* `--metrics` — Include metrics summary derived from `metrics.ndjson`
* `--format <FORMAT>` — Output format for text mode (`table` or `json`).

   Ignored when `--output-format json` is used.

  Default value: `table`

  Possible values: `table`, `json`




## `iroha ops bridge`

Bridge tools (feature: bridge)

**Usage:** `iroha ops bridge <COMMAND>`

###### **Subcommands:**

* `emit-receipt` — Emit a bridge receipt as a typed event
* `sccp` — Inspect the exact transfer-only SCCP registry and proof inputs



## `iroha ops bridge emit-receipt`

Emit a bridge receipt as a typed event

**Usage:** `iroha ops bridge emit-receipt [OPTIONS] --lane <LANE> --direction <DIRECTION> --source-tx <SOURCE_TX> --amount <QUANTITY> --asset-id <ASSET_ID> --recipient <RECIPIENT>`

###### **Options:**

* `--lane <LANE>` — Bridge lane id (numeric)
* `--direction <DIRECTION>` — Direction: lock|mint|burn|release
* `--source-tx <SOURCE_TX>` — Source transaction hash (hex, 32 bytes)
* `--amount <QUANTITY>` — Exact non-negative asset quantity
* `--asset-id <ASSET_ID>` — Canonical Iroha asset id
* `--recipient <RECIPIENT>` — Iroha account id or external address payload
* `--dest-tx <DEST_TX>` — Optional destination transaction hash (hex, 32 bytes)
* `--proof-hash <PROOF_HASH>` — Proof hash (hex, 32 bytes)



## `iroha ops bridge sccp`

Inspect the exact transfer-only SCCP registry and proof inputs

**Usage:** `iroha ops bridge sccp <COMMAND>`

###### **Subcommands:**

* `capabilities` — Fetch the closed first-release SCCP HTTP surface
* `registry` — Fetch the authoritative typed SCCP route registry
* `recent` — Discover newest-first finalized SORA-origin messages
* `bundle` — Fetch one finalized canonical SCCP message bundle
* `proof-request` — Fetch the exact state-derived Groth16 prover request for one message
* `submit-destination-proof` — Prepare or directly submit one closed destination-proof artifact
* `submit-native-message` — Prepare or directly submit one protocol-native inbound proof



## `iroha ops bridge sccp capabilities`

Fetch the closed first-release SCCP HTTP surface

**Usage:** `iroha ops bridge sccp capabilities`



## `iroha ops bridge sccp registry`

Fetch the authoritative typed SCCP route registry

**Usage:** `iroha ops bridge sccp registry`



## `iroha ops bridge sccp recent`

Discover newest-first finalized SORA-origin messages

**Usage:** `iroha ops bridge sccp recent [OPTIONS]`

###### **Options:**

* `--from <FROM>` — Inclusive block height through which to scan backwards
* `--after-index <AFTER_INDEX>` — Last commitment index already consumed at `--from` (inclusive range `0..=511`)
* `--limit <LIMIT>` — Maximum number of messages to return (inclusive range `1..=50`)



## `iroha ops bridge sccp bundle`

Fetch one finalized canonical SCCP message bundle

**Usage:** `iroha ops bridge sccp bundle --message-id <HEX>`

###### **Options:**

* `--message-id <HEX>` — Nonzero SCCP message id (hex, 32 bytes)



## `iroha ops bridge sccp proof-request`

Fetch the exact state-derived Groth16 prover request for one message

**Usage:** `iroha ops bridge sccp proof-request --message-id <HEX>`

###### **Options:**

* `--message-id <HEX>` — Nonzero SCCP message id (hex, 32 bytes)



## `iroha ops bridge sccp submit-destination-proof`

Prepare or directly submit one closed destination-proof artifact

**Usage:** `iroha ops bridge sccp submit-destination-proof [OPTIONS] --artifact <PATH>`

###### **Options:**

* `--artifact <PATH>` — File containing one canonical Norito closed SCCP destination-proof envelope
* `--transaction-payload-b64-file <PATH>` — File containing the exact canonical padded-base64 transaction payload returned by prepare
* `--signature-b64-file <PATH>` — File containing one canonical padded-base64 detached signature over the prepared payload hash
* `--creation-time-ms <CREATION_TIME_MS>` — Positive transaction creation timestamp in Unix milliseconds.

   Direct submission must repeat the value returned by preparation.



## `iroha ops bridge sccp submit-native-message`

Prepare or directly submit one protocol-native inbound proof

**Usage:** `iroha ops bridge sccp submit-native-message [OPTIONS] --proof <PATH> --replay-witness <PATH>`

###### **Options:**

* `--proof <PATH>` — File containing one canonical Norito protocol-native SCCP inbound proof
* `--replay-witness <PATH>` — File containing one canonical Norito sparse replay non-membership witness
* `--transaction-payload-b64-file <PATH>` — File containing the exact canonical padded-base64 transaction payload returned by prepare
* `--signature-b64-file <PATH>` — File containing one canonical padded-base64 detached signature over the prepared payload hash
* `--creation-time-ms <CREATION_TIME_MS>` — Positive transaction creation timestamp in Unix milliseconds.

   Direct submission must repeat the value returned by preparation.



## `iroha app`

App API helpers and product tooling

**Usage:** `iroha app <COMMAND>`

###### **Subcommands:**

* `gov` — Governance helpers (app API convenience)
* `zk` — Zero-knowledge helpers (roots, etc.)
* `confidential` — Confidential asset tooling helpers
* `taikai` — Taikai publisher tooling (CAR bundler, envelopes)
* `content` — Content hosting helpers
* `da` — Data availability helpers (ingest tooling)
* `streaming` — Streaming helpers (HPKE fingerprints, suite listings)
* `nexus` — Nexus helpers (lanes, governance)
* `staking` — Public-lane staking helpers (register/activate/exit)
* `subscriptions` — Subscription plan and billing helpers
* `endorsement` — Domain endorsement helpers (committees, policies, submissions)
* `jurisdiction` — Jurisdiction Data Guardian helpers (attestations and SDN registries)
* `compute` — Compute lane simulation helpers
* `social` — Social incentive helpers (viral follow rewards and escrows)
* `space-directory` — Space Directory helpers (UAID capability manifests)
* `kaigi` — Kaigi session helpers
* `sorafs` — SoraFS helpers (pin registry, aliases, replication orders, storage)
* `soracles` — Soracles helpers (evidence bundling)
* `sns` — Sora Name Service helpers (registrar + policy tooling)
* `alias` — Alias resolution and declarative setup helpers
* `repo` — Repo settlement helpers
* `settlement` — Delivery-versus-payment and payment-versus-payment helpers



## `iroha app gov`

Governance helpers (app API convenience)

**Usage:** `iroha app gov <COMMAND>`

###### **Subcommands:**

* `deploy` — Deployment helpers (propose/meta/audit). Propose deployment of IVM bytecode
* `vote` — Submit a standalone referendum ballot; auto-detects its mode unless overridden
* `proposal` — Proposal helpers
* `locks` — Lock helpers
* `unlock` — Get the latest explicitly persisted council roster. Unlock helpers (expired lock stats)
* `referendum` — Referendum helpers
* `tally` — Tally helpers
* `protected` — Protected namespace helpers
* `parliament` — Attempt-based private SORA Parliament helpers



## `iroha app gov deploy`

Deployment helpers (propose/meta/audit). Propose deployment of IVM bytecode

**Usage:** `iroha app gov deploy <COMMAND>`

###### **Subcommands:**

* `propose` — Propose deployment of IVM bytecode by code/abi hash via governance (build-only; server returns instruction skeleton)
* `meta` — Build deploy metadata JSON for protected namespace admission
* `audit` — Audit stored manifests against governance proposals and code storage



## `iroha app gov deploy propose`

Propose deployment of IVM bytecode by code/abi hash via governance (build-only; server returns instruction skeleton)

**Usage:** `iroha app gov deploy propose [OPTIONS] --code-hash <CODE_HASH> --abi-hash <ABI_HASH>`

###### **Options:**

* `--contract-address <CONTRACT_ADDRESS>`
* `--contract-alias <CONTRACT_ALIAS>`
* `--code-hash <CODE_HASH>`
* `--abi-hash <ABI_HASH>`
* `--abi-version <ABI_VERSION>`

  Default value: `1`



## `iroha app gov deploy meta`

Build deploy metadata JSON for protected namespace admission

**Usage:** `iroha app gov deploy meta [OPTIONS]`

###### **Options:**

* `--contract-address <CONTRACT_ADDRESS>`
* `--contract-alias <CONTRACT_ALIAS>`
* `--approver <ACCOUNT>` — Optional validator account IDs (canonical I105 account literals) authorizing the deployment alongside the authority



## `iroha app gov deploy audit`

Audit stored manifests against governance proposals and code storage

**Usage:** `iroha app gov deploy audit [OPTIONS]`

###### **Options:**

* `--contract-address <CONTRACT_ADDRESS>`
* `--contract-alias <CONTRACT_ALIAS>`



## `iroha app gov vote`

Submit a standalone referendum ballot; auto-detects its mode unless overridden

**Usage:** `iroha app gov vote [OPTIONS] --referendum-id <REFERENDUM_ID>`

###### **Options:**

* `--referendum-id <REFERENDUM_ID>`
* `--mode <MODE>` — Voting mode override. Defaults to auto-detect via GET /v1/gov/referenda/{id}

  Default value: `auto`

  Possible values:
  - `auto`:
    Automatically detect the referendum mode from the node
  - `plain`:
    Force plain (non-ZK) voting mode
  - `zk`:
    Force zero-knowledge voting mode

* `--backend <BACKEND>` — Exact proof backend tag for ZK voting mode
* `--envelope-b64 <ENVELOPE_B64>` — Base64-encoded proof envelope for ZK voting mode
* `--public <PATH>` — Optional JSON file containing public inputs for ZK voting mode
* `--owner <OWNER>` — Owner account id for plain voting mode (canonical I105 account literal; must equal transaction authority)
* `--amount <AMOUNT>` — Locked amount for plain voting mode (string to preserve large integers)
* `--duration-blocks <DURATION_BLOCKS>` — Lock duration (in blocks) for plain voting mode
* `--direction <DIRECTION>` — Ballot direction for plain voting mode: Aye, Nay, or Abstain
* `--nullifier <NULLIFIER>` — Optional 32-byte nullifier hint for ZK ballots (hex)



## `iroha app gov proposal`

Proposal helpers

**Usage:** `iroha app gov proposal <COMMAND>`

###### **Subcommands:**

* `get` — Get a governance proposal by id (hex)



## `iroha app gov proposal get`

Get a governance proposal by id (hex)

**Usage:** `iroha app gov proposal get --id <ID_HEX>`

###### **Options:**

* `--id <ID_HEX>`



## `iroha app gov locks`

Lock helpers

**Usage:** `iroha app gov locks <COMMAND>`

###### **Subcommands:**

* `get` — Get locks for a referendum id



## `iroha app gov locks get`

Get locks for a referendum id

**Usage:** `iroha app gov locks get --referendum-id <REFERENDUM_ID>`

###### **Options:**

* `--referendum-id <REFERENDUM_ID>`



## `iroha app gov unlock`

Get the latest explicitly persisted council roster. Unlock helpers (expired lock stats)

**Usage:** `iroha app gov unlock <COMMAND>`

###### **Subcommands:**

* `stats` — Show governance unlock sweep stats (expired locks at current height)



## `iroha app gov unlock stats`

Show governance unlock sweep stats (expired locks at current height)

**Usage:** `iroha app gov unlock stats`



## `iroha app gov referendum`

Referendum helpers

**Usage:** `iroha app gov referendum <COMMAND>`

###### **Subcommands:**

* `get` — Get a referendum by id



## `iroha app gov referendum get`

Get a referendum by id

**Usage:** `iroha app gov referendum get --referendum-id <REFERENDUM_ID>`

###### **Options:**

* `--referendum-id <REFERENDUM_ID>`



## `iroha app gov tally`

Tally helpers

**Usage:** `iroha app gov tally <COMMAND>`

###### **Subcommands:**

* `get` — Get a tally snapshot by referendum id



## `iroha app gov tally get`

Get a tally snapshot by referendum id

**Usage:** `iroha app gov tally get --referendum-id <REFERENDUM_ID>`

###### **Options:**

* `--referendum-id <REFERENDUM_ID>`



## `iroha app gov protected`

Protected namespace helpers

**Usage:** `iroha app gov protected <COMMAND>`

###### **Subcommands:**

* `set` — Set protected namespaces (custom parameter `gov_protected_namespaces`)
* `apply` — Apply protected namespaces on the server (requires API token if configured)
* `get` — Get protected namespaces (custom parameter `gov_protected_namespaces`)



## `iroha app gov protected set`

Set protected namespaces (custom parameter `gov_protected_namespaces`)

**Usage:** `iroha app gov protected set --namespaces <NAMESPACES>`

###### **Options:**

* `--namespaces <NAMESPACES>` — Comma-separated namespaces (e.g., apps,system)



## `iroha app gov protected apply`

Apply protected namespaces on the server (requires API token if configured)

**Usage:** `iroha app gov protected apply --namespaces <NAMESPACES>`

###### **Options:**

* `--namespaces <NAMESPACES>` — Comma-separated namespaces (e.g., apps,system)



## `iroha app gov protected get`

Get protected namespaces (custom parameter `gov_protected_namespaces`)

**Usage:** `iroha app gov protected get`



## `iroha app gov parliament`

Attempt-based private SORA Parliament helpers

**Usage:** `iroha app gov parliament <COMMAND>`

###### **Subcommands:**

* `draft-attempt` — Draft one canonical attempt creation instruction
* `draft-transition` — Draft one exact lifecycle transition instruction
* `get-attempt` — Read one exact committed attempt projection
* `finalize-opened-ballot` — Verify signer-peer shares and submit `FinalizeOpenedBallot` normally



## `iroha app gov parliament draft-attempt`

Draft one canonical attempt creation instruction

**Usage:** `iroha app gov parliament draft-attempt [OPTIONS] --proposal-json <PATH>`

###### **Options:**

* `--proposal-json <PATH>` — JSON file containing one exact tagged `ProposalKind` value
* `--attempt-sequence <ATTEMPT_SEQUENCE>` — Zero-based retry sequence for the exact proposal content

  Default value: `0`



## `iroha app gov parliament draft-transition`

Draft one exact lifecycle transition instruction

**Usage:** `iroha app gov parliament draft-transition --governance-attempt-id <GOVERNANCE_ATTEMPT_ID> --transition-json <PATH>`

###### **Options:**

* `--governance-attempt-id <GOVERNANCE_ATTEMPT_ID>` — Canonical lowercase identifier of the existing Parliament attempt
* `--transition-json <PATH>` — JSON file containing one exact tagged lifecycle transition



## `iroha app gov parliament get-attempt`

Read one exact committed attempt projection

**Usage:** `iroha app gov parliament get-attempt --governance-attempt-id <GOVERNANCE_ATTEMPT_ID>`

###### **Options:**

* `--governance-attempt-id <GOVERNANCE_ATTEMPT_ID>` — Canonical lowercase attempt identifier



## `iroha app gov parliament finalize-opened-ballot`

Verify signer-peer shares and submit `FinalizeOpenedBallot` normally

**Usage:** `iroha app gov parliament finalize-opened-ballot --ballot-attempt-id <BALLOT_ATTEMPT_ID> --peer <TORII_URL>`

###### **Options:**

* `--ballot-attempt-id <BALLOT_ATTEMPT_ID>` — Canonical lowercase identifier of the ballot attempt in `Opening`
* `--peer <TORII_URL>` — Root URL of one signer peer exposing release-context and partial-release routes.

   Supply every configured signer peer. The coordinator sorts and bounds the URLs, verifies every public proof locally, de-duplicates equal seats, and combines the lowest canonical threshold of valid participant indices.



## `iroha app zk`

Zero-knowledge helpers (roots, etc.)

**Usage:** `iroha app zk <COMMAND>`

###### **Subcommands:**

* `roots` — Get recent shielded roots for an asset (JSON). Posts to /v1/zk/roots
* `verify-batch` — Verify a batch of ZK `OpenVerify` envelopes (Norito vector) via /v1/zk/verify-batch
* `schema-hash` — Compute the Blake2b-32 hash required for `public_inputs_schema_hash` and print it
* `attachments` — Manage ZK attachments in the app API
* `register-asset` — Register a ZK-capable asset (Hybrid mode) with policy and VK ids
* `vk` — Verifying-key registry lifecycle (register/update/get)
* `proofs` — Inspect proof registry (list/count/get)
* `ivm` — IVM prove helpers (non-consensus, app API)
* `vote` — ZK Vote helpers (tally)
* `envelope` — Encode a confidential encrypted payload (memo) into Norito bytes/base64



## `iroha app zk roots`

Get recent shielded roots for an asset (JSON). Posts to /v1/zk/roots

**Usage:** `iroha app zk roots [OPTIONS] --asset-id <ASSET_ID>`

###### **Options:**

* `--asset-id <ASSET_ID>` — Canonical unprefixed Base58 `AssetDefinitionId`
* `--max <MAX>` — Maximum number of roots to return (0 = server cap)

  Default value: `0`



## `iroha app zk verify-batch`

Verify a batch of ZK `OpenVerify` envelopes (Norito vector) via /v1/zk/verify-batch

**Usage:** `iroha app zk verify-batch [OPTIONS]`

###### **Options:**

* `--norito <PATH>` — Path to a Norito-encoded Vec<OpenVerifyEnvelope> (mutually exclusive with --json)
* `--json <PATH>` — Path to a JSON array of base64-encoded Norito `OpenVerifyEnvelope` items (mutually exclusive with --norito)



## `iroha app zk schema-hash`

Compute the Blake2b-32 hash required for `public_inputs_schema_hash` and print it

**Usage:** `iroha app zk schema-hash [OPTIONS]`

###### **Options:**

* `--norito <PATH>` — Path to a Norito-encoded `OpenVerifyEnvelope`
* `--public-inputs-hex <HEX>` — Hex-encoded public inputs (when not using --norito)



## `iroha app zk attachments`

Manage ZK attachments in the app API

**Usage:** `iroha app zk attachments <COMMAND>`

###### **Subcommands:**

* `upload` — Upload a file as an attachment. Returns JSON metadata
* `list` — List stored attachments (JSON array of metadata)
* `get` — Download an attachment by id to a file
* `delete` — Delete an attachment by id
* `cleanup` — Cleanup attachments by filters (age/content-type/ids). Deletes individually via API



## `iroha app zk attachments upload`

Upload a file as an attachment. Returns JSON metadata

**Usage:** `iroha app zk attachments upload [OPTIONS] --file <PATH>`

###### **Options:**

* `--file <PATH>` — Path to the file to upload
* `--content-type <MIME>` — Content-Type to send with the file

  Default value: `application/octet-stream`



## `iroha app zk attachments list`

List stored attachments (JSON array of metadata)

**Usage:** `iroha app zk attachments list`



## `iroha app zk attachments get`

Download an attachment by id to a file

**Usage:** `iroha app zk attachments get --id <ID> --out <PATH>`

###### **Options:**

* `--id <ID>` — Attachment id (hex)
* `--out <PATH>` — Output path to write the downloaded bytes



## `iroha app zk attachments delete`

Delete an attachment by id

**Usage:** `iroha app zk attachments delete --id <ID>`

###### **Options:**

* `--id <ID>` — Attachment id (hex)



## `iroha app zk attachments cleanup`

Cleanup attachments by filters (age/content-type/ids). Deletes individually via API

**Usage:** `iroha app zk attachments cleanup [OPTIONS]`

###### **Options:**

* `--yes` — Proceed without confirmation
* `--all` — Delete all attachments (dangerous). Requires --yes
* `--content-type <MIME>` — Filter by content-type substring (e.g., application/x-norito)
* `--before-ms <MS>` — Filter attachments created strictly before this UNIX epoch in milliseconds
* `--older-than-secs <SECS>` — Filter attachments older than N seconds (relative to now)
* `--id <ID>` — Filter by specific id(s); may be repeated
* `--limit <N>` — Maximum number of attachments to delete (applied after filtering)
* `--ids-only` — Preview only: list matching ids instead of full metadata
* `--summary` — Preview only: print a summary table (id, `content_type`, size, `created_ms`)



## `iroha app zk register-asset`

Register a ZK-capable asset (Hybrid mode) with policy and VK ids

**Usage:** `iroha app zk register-asset [OPTIONS] --asset <ASSET_ID>`

###### **Options:**

* `--asset <ASSET_ID>` — Canonical unprefixed Base58 `AssetDefinitionId`
* `--vk-unshield <BACKEND:NAME>` — Verifying key id for unshield proofs (format: `<backend>:<name>`)
* `--vk-shield <BACKEND:NAME>` — Canonical Kagemusha top-up shield verifying key id (format: `<backend>:<name>`)



## `iroha app zk vk`

Verifying-key registry lifecycle (register/update/get)

**Usage:** `iroha app zk vk <COMMAND>`

###### **Subcommands:**

* `register` — Register a verifying key record with the configured account and key
* `update` — Update an existing verifying key record (version must increase)
* `get` — Get a verifying key record by backend and name



## `iroha app zk vk register`

Register a verifying key record with the configured account and key

**Usage:** `iroha app zk vk register --json <PATH>`

###### **Options:**

* `--json <PATH>` — Path to a JSON DTO file for register (backend, name, version, optional `vk_bytes` (base64) or `commitment_hex`). The configured client account and key sign the transaction. Optional `namespace` defaults to `core` and must be non-empty without leading or trailing whitespace



## `iroha app zk vk update`

Update an existing verifying key record (version must increase)

**Usage:** `iroha app zk vk update --json <PATH>`

###### **Options:**

* `--json <PATH>` — Path to a JSON DTO file for update (backend, name, version, optional `vk_bytes` or `commitment_hex`). The configured client account and key sign the transaction. Optional `namespace` defaults to `core` and must be non-empty without leading or trailing whitespace



## `iroha app zk vk get`

Get a verifying key record by backend and name

**Usage:** `iroha app zk vk get --backend <BACKEND> --name <NAME>`

###### **Options:**

* `--backend <BACKEND>` — Backend identifier (e.g., "halo2/ipa")
* `--name <NAME>` — Verifying key name



## `iroha app zk proofs`

Inspect proof registry (list/count/get)

**Usage:** `iroha app zk proofs <COMMAND>`

###### **Subcommands:**

* `list` — List proof records maintained by Torii
* `count` — Count proof records matching the filters
* `get` — Fetch a proof record by backend and proof hash (hex)
* `retention` — Inspect proof retention configuration and live counters
* `prune` — Submit a pruning transaction to enforce proof retention immediately



## `iroha app zk proofs list`

List proof records maintained by Torii

**Usage:** `iroha app zk proofs list [OPTIONS]`

###### **Options:**

* `--backend <BACKEND>` — Filter by backend identifier (e.g., `halo2/ipa`)
* `--status <STATUS>` — Filter by verification status (`Submitted`, `Verified`, `Rejected`)
* `--has-tag <TAG>` — Require a ZK1 TLV tag (4 ASCII characters, e.g., `PROF`)
* `--verified-from-height <HEIGHT>` — Minimum verification height (inclusive)
* `--verified-until-height <HEIGHT>` — Maximum verification height (inclusive)
* `--limit <LIMIT>` — Limit result size (server caps at 1000)
* `--offset <OFFSET>` — Offset for server-side pagination
* `--order <ORDER>` — Sort order (`asc` or `desc`) by verification height
* `--ids-only` — Return only `{ backend, hash }` identifiers



## `iroha app zk proofs count`

Count proof records matching the filters

**Usage:** `iroha app zk proofs count [OPTIONS]`

###### **Options:**

* `--backend <BACKEND>` — Filter by backend identifier (e.g., `halo2/ipa`)
* `--status <STATUS>` — Filter by verification status (`Submitted`, `Verified`, `Rejected`)
* `--has-tag <TAG>` — Require a ZK1 TLV tag (4 ASCII characters, e.g., `PROF`)
* `--verified-from-height <HEIGHT>` — Minimum verification height (inclusive)
* `--verified-until-height <HEIGHT>` — Maximum verification height (inclusive)
* `--limit <LIMIT>` — Limit result size (server caps at 1000)
* `--offset <OFFSET>` — Offset for server-side pagination
* `--order <ORDER>` — Sort order (`asc` or `desc`) by verification height



## `iroha app zk proofs get`

Fetch a proof record by backend and proof hash (hex)

**Usage:** `iroha app zk proofs get --backend <BACKEND> --hash <HASH>`

###### **Options:**

* `--backend <BACKEND>` — Backend identifier (e.g., `halo2/ipa`)
* `--hash <HASH>` — Proof hash (hex, with or without `0x` prefix)



## `iroha app zk proofs retention`

Inspect proof retention configuration and live counters

**Usage:** `iroha app zk proofs retention`



## `iroha app zk proofs prune`

Submit a pruning transaction to enforce proof retention immediately

**Usage:** `iroha app zk proofs prune [OPTIONS]`

###### **Options:**

* `--backend <BACKEND>` — Restrict pruning to a single backend (e.g., `halo2/ipa`). Omit to prune all backends



## `iroha app zk ivm`

IVM prove helpers (non-consensus, app API)

**Usage:** `iroha app zk ivm <COMMAND>`

###### **Subcommands:**

* `derive` — Derive an `IvmProved` payload via `/v1/zk/ivm/derive`
* `prove` — Submit a prove job for an `IvmProved` payload via `/v1/zk/ivm/prove`
* `get` — Get a prove job status via `/v1/zk/ivm/prove/{job_id}`
* `delete` — Delete a prove job via `/v1/zk/ivm/prove/{job_id}`
* `derive-pk` — Derive a circuit/vk-bound proving key archive (.pk) from verifying key bytes (.vk) for the Halo2 IPA IVM bind circuit



## `iroha app zk ivm derive`

Derive an `IvmProved` payload via `/v1/zk/ivm/derive`

**Usage:** `iroha app zk ivm derive --json <PATH>`

###### **Options:**

* `--json <PATH>` — Path to a JSON request DTO `{ vk_ref, authority, metadata, bytecode }`



## `iroha app zk ivm prove`

Submit a prove job for an `IvmProved` payload via `/v1/zk/ivm/prove`

**Usage:** `iroha app zk ivm prove [OPTIONS] --json <PATH>`

###### **Options:**

* `--json <PATH>` — Path to a JSON request DTO `{ vk_ref, authority, metadata, bytecode, proved? }`
* `--wait` — Poll the job until it reaches `done` or `error`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval (milliseconds) when using --wait

  Default value: `250`
* `--timeout-secs <TIMEOUT_SECS>` — Optional timeout (seconds) when using --wait (0 = no timeout)

  Default value: `0`



## `iroha app zk ivm get`

Get a prove job status via `/v1/zk/ivm/prove/{job_id}`

**Usage:** `iroha app zk ivm get --job-id <JOB_ID>`

###### **Options:**

* `--job-id <JOB_ID>` — Prove job id returned by `iroha zk ivm prove`



## `iroha app zk ivm delete`

Delete a prove job via `/v1/zk/ivm/prove/{job_id}`

**Usage:** `iroha app zk ivm delete --job-id <JOB_ID>`

###### **Options:**

* `--job-id <JOB_ID>` — Prove job id returned by `iroha zk ivm prove`



## `iroha app zk ivm derive-pk`

Derive a circuit/vk-bound proving key archive (.pk) from verifying key bytes (.vk) for the Halo2 IPA IVM bind circuit

**Usage:** `iroha app zk ivm derive-pk [OPTIONS] --vk <PATH> --out <PATH>`

###### **Options:**

* `--backend <BACKEND>` — Backend label for the verifying key bytes (must match Torii `vk_ref.backend`), e.g. `halo2/ipa`

  Default value: `halo2/ipa`
* `--vk <PATH>` — Path to verifying key bytes (`.vk`) in Halo2 "processed" format
* `--out <PATH>` — Output path for circuit/vk-bound Norito proving key archive (`.pk`)



## `iroha app zk vote`

ZK Vote helpers (tally)

**Usage:** `iroha app zk vote <COMMAND>`

###### **Subcommands:**

* `tally` — Get election tally (JSON)



## `iroha app zk vote tally`

Get election tally (JSON)

**Usage:** `iroha app zk vote tally --election-id <ELECTION_ID>`

###### **Options:**

* `--election-id <ELECTION_ID>` — Election identifier



## `iroha app zk envelope`

Encode a confidential encrypted payload (memo) into Norito bytes/base64

**Usage:** `iroha app zk envelope [OPTIONS] --envelope-json <PATH>`

###### **Options:**

* `--envelope-json <PATH>` — Path to one typed `ConfidentialMemoEnvelopeV1` JSON object
* `--output <PATH>` — Optional output path for Norito bytes
* `--print-base64` — Print base64 of the encoded envelope (default when no output file is provided)

  Default value: `false`
* `--print-hex` — Print hexadecimal representation of the encoded envelope

  Default value: `false`
* `--print-json` — Print JSON representation of the envelope

  Default value: `false`



## `iroha app confidential`

Confidential asset tooling helpers

**Usage:** `iroha app confidential <COMMAND>`

###### **Subcommands:**

* `create-keys` — Derive confidential key hierarchy (nk/ivk/ovk/fvk) from a spend key
* `gas` — Inspect the confidential gas schedule



## `iroha app confidential create-keys`

Derive confidential key hierarchy (nk/ivk/ovk/fvk) from a spend key

**Usage:** `iroha app confidential create-keys [OPTIONS]`

###### **Options:**

* `--seed-hex <HEX32>` — 32-byte spend key in hex (if omitted, a random key is generated)
* `--output <PATH>` — Write the derived keyset JSON to a file
* `--quiet` — Do not print the generated JSON to stdout



## `iroha app confidential gas`

Inspect the confidential gas schedule

**Usage:** `iroha app confidential gas <COMMAND>`

###### **Subcommands:**

* `get` — Fetch the current confidential gas schedule



## `iroha app confidential gas get`

Fetch the current confidential gas schedule

**Usage:** `iroha app confidential gas get`



## `iroha app taikai`

Taikai publisher tooling (CAR bundler, envelopes)

**Usage:** `iroha app taikai <COMMAND>`

###### **Subcommands:**

* `bundle` — Bundle a Taikai segment into a CAR archive and Norito envelope
* `cek-rotate` — Emit a CEK rotation receipt for a Taikai stream
* `rpt-attest` — Generate a replication proof token (RPT) attestation
* `ingest` — Taikai ingest helpers (watchers, automation)



## `iroha app taikai bundle`

Bundle a Taikai segment into a CAR archive and Norito envelope

**Usage:** `iroha app taikai bundle [OPTIONS] --payload <PATH> --car-out <PATH> --envelope-out <PATH> --event-id <NAME> --stream-id <NAME> --rendition-id <NAME> --track-kind <TRACK_KIND> --codec <CODEC> --bitrate-kbps <KBPS> --segment-sequence <SEGMENT_SEQUENCE> --segment-start-pts <SEGMENT_START_PTS> --segment-duration <SEGMENT_DURATION> --wallclock-unix-ms <WALLCLOCK_UNIX_MS> --manifest-hash <HEX> --storage-ticket <HEX>`

###### **Options:**

* `--payload <PATH>` — Path to the CMAF fragment or segment payload to ingest
* `--car-out <PATH>` — Where to write the generated `CARv2` archive
* `--envelope-out <PATH>` — Where to write the Norito-encoded Taikai segment envelope
* `--indexes-out <PATH>` — Optional path for a JSON file containing the time/CID index keys
* `--ingest-metadata-out <PATH>` — Optional path for the ingest metadata JSON map consumed by `/v1/da/ingest`
* `--event-id <NAME>` — Identifier of the Taikai event
* `--stream-id <NAME>` — Logical stream identifier within the event
* `--rendition-id <NAME>` — Rendition identifier (ladder rung)
* `--track-kind <TRACK_KIND>` — Track kind carried by the segment

  Possible values: `video`, `audio`, `data`

* `--codec <CODEC>` — Codec identifier (`avc-high`, `hevc-main10`, `av1-main`, `aac-lc`, `opus`, or `custom:<name>`)
* `--bitrate-kbps <KBPS>` — Average bitrate in kilobits per second
* `--resolution <RESOLUTION>` — Video resolution (`WIDTHxHEIGHT`). Required for `video` tracks
* `--audio-layout <AUDIO_LAYOUT>` — Audio layout (`mono`, `stereo`, `5.1`, `7.1`, or `custom:<channels>`). Required for `audio` tracks
* `--segment-sequence <SEGMENT_SEQUENCE>` — Monotonic segment sequence number
* `--segment-start-pts <SEGMENT_START_PTS>` — Presentation timestamp (start) in microseconds since stream origin
* `--segment-duration <SEGMENT_DURATION>` — Presentation duration in microseconds
* `--wallclock-unix-ms <WALLCLOCK_UNIX_MS>` — Wall-clock reference (Unix milliseconds) when the segment was finalised
* `--manifest-hash <HEX>` — Deterministic manifest hash emitted by the ingest pipeline (hex)
* `--storage-ticket <HEX>` — Storage ticket identifier assigned by the orchestrator (hex)
* `--ingest-latency-ms <INGEST_LATENCY_MS>` — Optional encoder-to-ingest latency in milliseconds
* `--live-edge-drift-ms <LIVE_EDGE_DRIFT_MS>` — Optional live-edge drift measurement in milliseconds (negative = stream ahead of ingest)
* `--ingest-node-id <INGEST_NODE_ID>` — Optional identifier for the ingest node that sealed the segment
* `--metadata-json <PATH>` — Optional JSON file describing additional metadata entries



## `iroha app taikai cek-rotate`

Emit a CEK rotation receipt for a Taikai stream

**Usage:** `iroha app taikai cek-rotate [OPTIONS] --event-id <NAME> --stream-id <NAME> --kms-profile <KMS_PROFILE> --new-wrap-key-label <NEW_WRAP_KEY_LABEL> --effective-segment <SEQ> --out <PATH>`

###### **Options:**

* `--event-id <NAME>` — Identifier of the Taikai event
* `--stream-id <NAME>` — Stream identifier within the event
* `--kms-profile <KMS_PROFILE>` — Named KMS profile (e.g., `nitro:prod`)
* `--new-wrap-key-label <NEW_WRAP_KEY_LABEL>` — Label of the new wrap key minted by the KMS
* `--previous-wrap-key-label <PREVIOUS_WRAP_KEY_LABEL>` — Optional label for the previously active wrap key
* `--effective-segment <SEQ>` — Segment sequence where the new CEK becomes active
* `--hkdf-salt <HEX>` — Optional HKDF salt (hex). Generated randomly when omitted
* `--issued-at-unix <ISSUED_AT_UNIX>` — Optional Unix timestamp override for the issued-at field
* `--notes <NOTES>` — Optional operator or governance notes
* `--out <PATH>` — Path to the Norito-encoded receipt output
* `--json-out <PATH>` — Optional JSON summary output path



## `iroha app taikai rpt-attest`

Generate a replication proof token (RPT) attestation

**Usage:** `iroha app taikai rpt-attest [OPTIONS] --event-id <NAME> --stream-id <NAME> --rendition-id <NAME> --gar <PATH> --cek-receipt <PATH> --bundle <PATH> --out <PATH>`

###### **Options:**

* `--event-id <NAME>` — Identifier of the Taikai event
* `--stream-id <NAME>` — Stream identifier within the event
* `--rendition-id <NAME>` — Rendition identifier (ladder rung)
* `--gar <PATH>` — Path to the GAR JWS payload (used for digest computation)
* `--cek-receipt <PATH>` — Path to the CEK rotation receipt referenced by the rollout
* `--bundle <PATH>` — Path to the rollout evidence bundle (directory or single archive)
* `--out <PATH>` — Output path for the Norito-encoded RPT
* `--json-out <PATH>` — Optional JSON summary output path
* `--valid-from-unix <VALID_FROM_UNIX>` — Optional attestation validity start (Unix seconds)
* `--valid-until-unix <VALID_UNTIL_UNIX>` — Optional attestation validity end (Unix seconds)
* `--policy-label <LABEL>` — Optional telemetry labels to embed in the attestation (repeatable)
* `--notes <NOTES>` — Optional governance notes or ticket reference



## `iroha app taikai ingest`

Taikai ingest helpers (watchers, automation)

**Usage:** `iroha app taikai ingest <COMMAND>`

###### **Subcommands:**

* `watch` — Watch a directory for CMAF fragments and bundle them into CAR + Norito artifacts
* `edge` — Prototype edge receiver that emits CMAF fragments and drift logs for the watcher



## `iroha app taikai ingest watch`

Watch a directory for CMAF fragments and bundle them into CAR + Norito artifacts

**Usage:** `iroha app taikai ingest watch [OPTIONS] --source-dir <PATH> --event-id <NAME> --stream-id <NAME> --rendition-id <NAME>`

###### **Options:**

* `--source-dir <PATH>` — Directory that receives CMAF fragments (e.g., `.m4s` files)
* `--output-root <PATH>` — Optional output root; defaults to `./artifacts/taikai/ingest_run_<timestamp>/`
* `--summary-out <PATH>` — Optional NDJSON summary file containing one entry per processed segment
* `--event-id <NAME>` — Identifier of the Taikai event
* `--stream-id <NAME>` — Logical stream identifier within the event
* `--rendition-id <NAME>` — Rendition identifier (ladder rung)
* `--segment-duration <MICROS>` — CMAF segment duration in microseconds (defaults to 2 s)

  Default value: `2000000`
* `--first-segment-pts <MICROS>` — Presentation timestamp (start) in microseconds for the first processed segment

  Default value: `0`
* `--sequence-start <SEQUENCE_START>` — Sequence number to use for the first processed segment

  Default value: `0`
* `--ladder-preset <LADDER_PRESET>` — Optional ladder preset identifier (see `fixtures/taikai/ladder_presets.json`)
* `--ladder-presets <PATH>` — Optional override path for the ladder preset JSON catalog
* `--track-kind <TRACK_KIND>` — Override for the track kind when not using a preset

  Possible values: `video`, `audio`, `data`

* `--codec <CODEC>` — Override for the codec identifier
* `--bitrate-kbps <BITRATE_KBPS>` — Override for the average bitrate in kilobits per second
* `--resolution <RESOLUTION>` — Override for the video resolution (`WIDTHxHEIGHT`)
* `--audio-layout <AUDIO_LAYOUT>` — Override for the audio layout (`mono`, `stereo`, etc.)
* `--ingest-latency-ms <INGEST_LATENCY_MS>` — Optional encoder-to-ingest latency in milliseconds (computed from file timestamps when omitted)
* `--ingest-node-id <INGEST_NODE_ID>` — Optional identifier for the ingest node that sealed the segment
* `--metadata-json <PATH>` — Optional JSON file describing additional metadata entries to attach to each envelope
* `--match-ext <EXT>` — File extensions to watch (repeat the flag to add more)

  Default value: `m4s`
* `--max-segments <COUNT>` — Optional limit on the number of processed segments before exiting
* `--poll-interval-ms <MILLIS>` — Poll interval in milliseconds between directory scans

  Default value: `1000`
* `--drift-warn-ms <MILLIS>` — Drift warning threshold in milliseconds

  Default value: `1500`
* `--da-lane <DA_LANE>` — Lane identifier supplied in DA ingest requests (default: 0 / single-lane)

  Default value: `0`
* `--da-epoch <DA_EPOCH>` — Epoch identifier for DA ingest requests

  Default value: `0`
* `--da-blob-class <DA_BLOB_CLASS>` — Blob-class label (`taikai_segment`, `nexus_lane_sidecar`, `governance_artifact`, `custom:<id>`)

  Default value: `taikai_segment`
* `--da-blob-codec <DA_BLOB_CODEC>` — Codec label recorded in DA ingest requests (default `taikai.cmaf`)

  Default value: `taikai.cmaf`
* `--da-chunk-size <BYTES>` — Chunk size in bytes used for DA ingest requests

  Default value: `262144`
* `--da-data-shards <DA_DATA_SHARDS>` — Number of data shards for the erasure profile (default 10)

  Default value: `10`
* `--da-parity-shards <DA_PARITY_SHARDS>` — Number of parity shards for the erasure profile (default 4)

  Default value: `4`
* `--da-chunk-alignment <DA_CHUNK_ALIGNMENT>` — Chunk alignment (chunks per availability slice)

  Default value: `10`
* `--da-fec-scheme <DA_FEC_SCHEME>` — FEC scheme label (`rs12_10`, `rswin14_10`, `rs18_14`, `custom:<id>`)

  Default value: `rs12_10`
* `--da-hot-retention-secs <DA_HOT_RETENTION_SECS>` — Hot-retention period in seconds

  Default value: `604800`
* `--da-cold-retention-secs <DA_COLD_RETENTION_SECS>` — Cold-retention period in seconds

  Default value: `7776000`
* `--da-required-replicas <DA_REQUIRED_REPLICAS>` — Required replica count for DA retention

  Default value: `3`
* `--da-storage-class <DA_STORAGE_CLASS>` — Storage class label for DA retention (`hot`, `warm`, `cold`)

  Default value: `hot`
* `--da-governance-tag <DA_GOVERNANCE_TAG>` — Governance tag recorded in the retention policy (default `da.taikai.live`)

  Default value: `da.taikai.live`
* `--publish-da` — Toggle automatic publishing to `/v1/da/ingest` using the CLI config
* `--da-endpoint <URL>` — Override the Torii DA ingest endpoint (defaults to `$TORII/v1/da/ingest`)



## `iroha app taikai ingest edge`

Prototype edge receiver that emits CMAF fragments and drift logs for the watcher

**Usage:** `iroha app taikai ingest edge [OPTIONS] --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — Path to a sample fragment payload (treated as CMAF bytes)
* `--output-root <PATH>` — Optional output root; defaults to `./artifacts/taikai/ingest_edge_run_<timestamp>/`
* `--segments <SEGMENTS>` — Number of fragments to emit into the watcher source directory

  Default value: `4`
* `--first-segment-pts <MICROS>` — Presentation timestamp (start) in microseconds for the first emitted segment

  Default value: `0`
* `--segment-interval-ms <MILLIS>` — Interval between segments in milliseconds (controls PTS and wallclock spacing)

  Default value: `2000`
* `--drift-ms <MILLIS>` — Base drift in milliseconds applied to every segment (positive = ingest behind live edge)

  Default value: `0`
* `--drift-jitter-ms <MILLIS>` — Jitter window in milliseconds applied around the base drift

  Default value: `0`
* `--drift-seed <SEED>` — Optional RNG seed for drift jitter so CI runs stay deterministic
* `--start-unix-ms <UNIX_MS>` — Optional Unix timestamp for the first emitted segment; defaults to now
* `--ingest-node-id <INGEST_NODE_ID>` — Optional identifier for the ingest edge node recorded in drift logs
* `--protocol <PROTOCOL>` — Protocol label attached to the emitted fragments

  Default value: `srt`

  Possible values: `srt`, `rtmp`




## `iroha app content`

Content hosting helpers

**Usage:** `iroha app content <COMMAND>`

###### **Subcommands:**

* `publish` — Publish a content bundle (tar archive) to the content lane
* `pack` — Pack a directory into a deterministic tarball + manifest without submitting it



## `iroha app content publish`

Publish a content bundle (tar archive) to the content lane

**Usage:** `iroha app content publish [OPTIONS]`

###### **Options:**

* `--bundle <PATH>` — Path to a tar archive containing the static bundle
* `--root <DIR>` — Directory to pack into a tarball before publishing
* `--expires-at-height <HEIGHT>` — Optional block height when the bundle expires
* `--dataspace <ID>` — Optional dataspace id override for the bundle manifest
* `--lane <ID>` — Optional lane id override for the bundle manifest
* `--auth <MODE>` — Auth mode (`public`, `role:<role_id>`, `sponsor:<uaid>`)
* `--cache-max-age-secs <SECS>` — Cache-Control max-age override (seconds)
* `--immutable` — Mark bundle as immutable (adds `immutable` to Cache-Control)
* `--bundle-out <PATH>` — Optional path to write the packed tarball when using `--root`
* `--manifest-out <PATH>` — Optional path to write the generated manifest JSON



## `iroha app content pack`

Pack a directory into a deterministic tarball + manifest without submitting it

**Usage:** `iroha app content pack [OPTIONS] --root <DIR> --bundle-out <PATH> --manifest-out <PATH>`

###### **Options:**

* `--root <DIR>` — Directory to pack into a tarball
* `--bundle-out <PATH>` — Path to write the tarball
* `--manifest-out <PATH>` — Path to write the generated manifest JSON
* `--dataspace <ID>` — Optional dataspace id override for the bundle manifest
* `--lane <ID>` — Optional lane id override for the bundle manifest
* `--auth <MODE>` — Auth mode (`public`, `role:<role_id>`, `sponsor:<uaid>`)
* `--cache-max-age-secs <SECS>` — Cache-Control max-age override (seconds)
* `--immutable` — Mark bundle as immutable (adds `immutable` to Cache-Control)



## `iroha app da`

Data availability helpers (ingest tooling)

**Usage:** `iroha app da <COMMAND>`

###### **Subcommands:**

* `submit` — Submit a raw blob to `/v1/da/ingest` and capture the signed receipt
* `get` — Fetch blobs via the multi-source orchestrator (thin wrapper over `sorafs fetch`)
* `get-blob` — Download manifest + chunk plan artifacts for an existing DA storage ticket
* `prove` — Generate Proof-of-Retrievability witnesses for a manifest/payload pair
* `prove-availability` — Download + verify availability for a storage ticket using a Torii manifest
* `proof-policies` — Fetch the current DA proof-policy bundle from Torii
* `proof-policy-snapshot` — Fetch the DA proof-policy snapshot from Torii
* `commitments-list` — List DA commitments with optional filters
* `commitments-prove` — Build a DA commitment proof with optional filters
* `commitments-verify` — Verify a DA commitment proof from a JSON file
* `pin-intents-list` — List DA pin intents with optional filters
* `pin-intents-prove` — Build a DA pin intent proof with optional filters
* `pin-intents-verify` — Verify a DA pin intent proof from a JSON file
* `rent-quote` — Quote rent/incentive breakdown for a blob size/retention combo
* `rent-ledger` — Convert a rent quote into deterministic ledger transfer instructions



## `iroha app da submit`

Submit a raw blob to `/v1/da/ingest` and capture the signed receipt

**Usage:** `iroha app da submit [OPTIONS] --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — Path to the blob payload (CAR, manifest bundle, governance file, etc.)
* `--lane-id <LANE_ID>` — Lane identifier recorded in the DA request

  Default value: `0`
* `--epoch <EPOCH>` — Epoch identifier recorded in the DA request

  Default value: `0`
* `--sequence <SEQUENCE>` — Monotonic sequence scoped to (lane, epoch)

  Default value: `0`
* `--blob-class <BLOB_CLASS>` — Blob-class label (`taikai_segment`, `nexus_lane_sidecar`, `governance_artifact`, `custom:<id>`)

  Default value: `nexus_lane_sidecar`
* `--blob-codec <BLOB_CODEC>` — Codec label describing the payload

  Default value: `custom.binary`
* `--chunk-size <CHUNK_SIZE>` — Chunk size in bytes used for DA chunking

  Default value: `262144`
* `--data-shards <DATA_SHARDS>` — Number of data shards in the erasure profile

  Default value: `10`
* `--parity-shards <PARITY_SHARDS>` — Number of parity shards in the erasure profile

  Default value: `4`
* `--chunk-alignment <CHUNK_ALIGNMENT>` — Chunk alignment (chunks per availability slice)

  Default value: `10`
* `--fec-scheme <FEC_SCHEME>` — FEC scheme label (`rs12_10`, `rswin14_10`, `rs18_14`, `custom:<id>`)

  Default value: `rs12_10`
* `--hot-retention-secs <HOT_RETENTION_SECS>` — Hot retention in seconds

  Default value: `604800`
* `--cold-retention-secs <COLD_RETENTION_SECS>` — Cold retention in seconds

  Default value: `7776000`
* `--required-replicas <REQUIRED_REPLICAS>` — Required replica count enforced by retention policy

  Default value: `3`
* `--storage-class <STORAGE_CLASS>` — Storage-class label (`hot`, `warm`, `cold`)

  Default value: `warm`
* `--governance-tag <GOVERNANCE_TAG>` — Governance tag recorded in the retention policy

  Default value: `da.generic`
* `--metadata-json <PATH>` — Optional metadata JSON file providing string key/value pairs
* `--manifest <PATH>` — Optional pre-generated Norito manifest to embed in the request
* `--endpoint <URL>` — Override for the Torii DA ingest endpoint (defaults to `$TORII/v1/da/ingest`)
* `--client-blob-id <HEX>` — Override the caller-supplied blob identifier (hex). Defaults to BLAKE3(payload)
* `--artifact-dir <PATH>` — Directory for storing Norito/JSON artefacts (defaults to `artifacts/da/submission_<timestamp>`)
* `--no-submit` — Skip HTTP submission and only emit the signed request artefacts



## `iroha app da get`

Fetch blobs via the multi-source orchestrator (thin wrapper over `sorafs fetch`)

**Usage:** `iroha app da get [OPTIONS] --gateway-provider <SPEC>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded manifest (`.to`) describing the payload layout
* `--plan <PATH>` — Path to a canonical payload-bound `sorafs.chunk_fetch_plan.v1` JSON envelope
* `--manifest-id <HEX>` — Hex-encoded manifest hash used as the manifest identifier on gateways
* `--gateway-provider <SPEC>` — Gateway provider descriptor (`name=... , provider-id=... , base-url=... , stream-token=...`)
* `--storage-ticket <HEX>` — Storage ticket identifier to fetch manifest + chunk plan automatically from Torii
* `--manifest-endpoint <URL>` — Optional override for the Torii manifest endpoint used with `--storage-ticket`
* `--manifest-cache-dir <PATH>` — Directory for storing manifest/chunk-plan artefacts fetched via `--storage-ticket`
* `--client-id <STRING>` — Optional client identifier forwarded to the gateway for auditing
* `--manifest-envelope <PATH>` — Optional path to a Norito-encoded manifest envelope to satisfy gateway policy checks
* `--manifest-cid <HEX>` — Override the expected manifest CID (defaults to the manifest digest)
* `--blinded-cid <BASE64>` — Canonical blinded CID (base64url, no padding) forwarded via `SoraNet` headers
* `--salt-epoch <EPOCH>` — Salt epoch corresponding to the blinded CID headers
* `--salt-hex <HEX>` — Hex-encoded 32-byte salt used to derive the canonical blinded CID (computes `--blinded-cid`)
* `--chunker-handle <STRING>` — Override the chunker handle advertised to gateways
* `--max-peers <COUNT>` — Limit the number of providers participating in the session
* `--retry-budget <COUNT>` — Maximum retry attempts per chunk (0 disables the cap)
* `--transport-policy <POLICY>` — Override the default `soranet-first` transport policy (`soranet-first`, `soranet-strict`, or `direct-only`). Supply `direct-only` only when staging a downgrade or rehearsing the compliance drills captured in `roadmap.md`
* `--anonymity-policy <POLICY>` — Override the anonymity policy with an exact V1 label (`anon-guard-pq`, `anon-majority-pq`, or `anon-strict-pq`)
* `--write-mode <MODE>` — Hint that tightens PQ expectations for write paths (`read-only` or `upload-pq-only`)
* `--transport-policy-override <POLICY>` — Force the orchestrator to stay on a specific transport stage (`soranet-first`, `soranet-strict`, or `direct-only`)
* `--anonymity-policy-override <POLICY>` — Force the orchestrator to stay on an exact V1 anonymity policy
* `--guard-cache <PATH>` — Path to the persisted guard cache (Norito-encoded guard set)
* `--guard-cache-key-file <PATH>` — Owner-private file containing the exact 32 raw bytes used to authenticate the guard cache
* `--guard-directory <PATH>` — Path to a Norito guard directory snapshot used to refresh guard selections
* `--guard-directory-digest <HEX>` — Trusted domain-separated BLAKE3 digest of the exact guard directory bytes
* `--guard-target <COUNT>` — Target number of entry guards to pin (defaults to 3 when the guard directory is provided)
* `--guard-retention-days <DAYS>` — Guard retention window in days (defaults to 30 when the guard directory is provided)
* `--output <PATH>` — Write the assembled payload to a file
* `--json-out <PATH>` — Override the summary JSON path (defaults to `artifacts/sorafs_orchestrator/latest/summary.json`)
* `--scoreboard-out <PATH>` — Override the scoreboard JSON path (defaults to `artifacts/sorafs_orchestrator/latest/scoreboard.json`)
* `--scoreboard-now <UNIX_SECS>` — Override the Unix timestamp used when evaluating provider adverts
* `--telemetry-source-label <LABEL>` — Label describing the telemetry stream captured alongside the scoreboard (persisted in metadata)
* `--telemetry-region <LABEL>` — Optional telemetry region label persisted in both the scoreboard metadata and summary JSON



## `iroha app da get-blob`

Download manifest + chunk plan artifacts for an existing DA storage ticket

**Usage:** `iroha app da get-blob [OPTIONS] --storage-ticket <HEX>`

###### **Options:**

* `--storage-ticket <HEX>` — Storage ticket identifier (hex string) issued by Torii
* `--endpoint <URL>` — Optional override for the Torii manifest endpoint (defaults to `$TORII/v1/da/manifests/`)
* `--output-dir <PATH>` — Directory for storing the fetched manifest + chunk plan artefacts



## `iroha app da prove`

Generate Proof-of-Retrievability witnesses for a manifest/payload pair

**Usage:** `iroha app da prove [OPTIONS] --manifest <PATH> --payload <PATH>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded manifest describing the chunk layout
* `--payload <PATH>` — Path to the assembled payload bytes that match the manifest
* `--json-out <PATH>` — Optional JSON output path; defaults to stdout only
* `--sample-count <SAMPLE_COUNT>` — Number of random leaves to sample for `PoR` proofs (0 disables sampling)

  Default value: `8`
* `--sample-seed <SAMPLE_SEED>` — Seed used for deterministic `PoR` sampling

  Default value: `0`
* `--leaf-index <INDEX>` — Explicit `PoR` leaf indexes to prove (0-based flattened index)



## `iroha app da prove-availability`

Download + verify availability for a storage ticket using a Torii manifest

**Usage:** `iroha app da prove-availability [OPTIONS] --storage-ticket <HEX> --gateway-provider <SPEC>`

###### **Options:**

* `--storage-ticket <HEX>` — Storage ticket issued by Torii (hex string)
* `--gateway-provider <SPEC>` — Gateway provider descriptor reused by `sorafs fetch` (name=... , provider-id=... , base-url=... , stream-token=...)
* `--manifest-endpoint <URL>` — Optional override for Torii manifest endpoint
* `--manifest-cache-dir <PATH>` — Directory where manifests and plans downloaded from Torii are cached (defaults to `artifacts/da/fetch_<ts>`)
* `--json-out <PATH>` — JSON output path for the combined proof summary (defaults to stdout)
* `--scoreboard-out <PATH>` — Path to persist the orchestrator scoreboard (defaults to temp dir if omitted)
* `--max-peers <COUNT>` — Optional limit on concurrent provider downloads
* `--sample-count <SAMPLE_COUNT>` — Proof sampling count for `PoR` verification (defaults to 8, set 0 to disable random sampling)

  Default value: `8`
* `--sample-seed <SAMPLE_SEED>` — Seed used for deterministic `PoR` sampling during verification

  Default value: `0`
* `--leaf-index <INDEX>` — Explicit `PoR` leaf indexes to verify in addition to sampled values
* `--artifact-dir <PATH>` — Directory for storing assembled payload/artefacts (defaults to `artifacts/da/prove_availability_<ts>`)



## `iroha app da proof-policies`

Fetch the current DA proof-policy bundle from Torii

**Usage:** `iroha app da proof-policies`



## `iroha app da proof-policy-snapshot`

Fetch the DA proof-policy snapshot from Torii

**Usage:** `iroha app da proof-policy-snapshot`



## `iroha app da commitments-list`

List DA commitments with optional filters

**Usage:** `iroha app da commitments-list [OPTIONS]`

###### **Options:**

* `--manifest-hash <HEX>` — Optional manifest hash filter (32-byte hex)
* `--lane-id <U32>` — Optional lane id filter (requires epoch + sequence for direct lookup)
* `--epoch <U64>` — Optional epoch filter (requires lane-id + sequence for direct lookup)
* `--sequence <U64>` — Optional sequence filter (requires lane-id + epoch for direct lookup)
* `--limit <U64>` — Optional list limit (`>0`)
* `--cursor-json <PATH>` — Path to a JSON cursor returned by a preceding list page



## `iroha app da commitments-prove`

Build a DA commitment proof with optional filters

**Usage:** `iroha app da commitments-prove [OPTIONS]`

###### **Options:**

* `--manifest-hash <HEX>` — Optional manifest hash filter (32-byte hex)
* `--lane-id <U32>` — Optional lane id filter (requires epoch + sequence for direct lookup)
* `--epoch <U64>` — Optional epoch filter (requires lane-id + sequence for direct lookup)
* `--sequence <U64>` — Optional sequence filter (requires lane-id + epoch for direct lookup)
* `--limit <U64>` — Optional list limit (`>0`)
* `--cursor-json <PATH>` — Path to a JSON cursor returned by a preceding list page



## `iroha app da commitments-verify`

Verify a DA commitment proof from a JSON file

**Usage:** `iroha app da commitments-verify --proof-json <PATH>`

###### **Options:**

* `--proof-json <PATH>` — Path to a JSON-encoded `DaCommitmentProof`



## `iroha app da pin-intents-list`

List DA pin intents with optional filters

**Usage:** `iroha app da pin-intents-list [OPTIONS]`

###### **Options:**

* `--manifest-hash <HEX>` — Optional manifest hash filter (32-byte hex)
* `--storage-ticket <HEX>` — Optional storage ticket filter (32-byte hex)
* `--alias <TEXT>` — Optional alias filter
* `--lane-id <U32>` — Optional lane id filter (requires epoch + sequence for direct lookup)
* `--epoch <U64>` — Optional epoch filter (requires lane-id + sequence for direct lookup)
* `--sequence <U64>` — Optional sequence filter (requires lane-id + epoch for direct lookup)
* `--limit <U64>` — Optional list limit (`>0`)
* `--cursor-json <PATH>` — Path to a JSON cursor returned by a preceding list page



## `iroha app da pin-intents-prove`

Build a DA pin intent proof with optional filters

**Usage:** `iroha app da pin-intents-prove [OPTIONS]`

###### **Options:**

* `--manifest-hash <HEX>` — Optional manifest hash filter (32-byte hex)
* `--storage-ticket <HEX>` — Optional storage ticket filter (32-byte hex)
* `--alias <TEXT>` — Optional alias filter
* `--lane-id <U32>` — Optional lane id filter (requires epoch + sequence for direct lookup)
* `--epoch <U64>` — Optional epoch filter (requires lane-id + sequence for direct lookup)
* `--sequence <U64>` — Optional sequence filter (requires lane-id + epoch for direct lookup)
* `--limit <U64>` — Optional list limit (`>0`)
* `--cursor-json <PATH>` — Path to a JSON cursor returned by a preceding list page



## `iroha app da pin-intents-verify`

Verify a DA pin intent proof from a JSON file

**Usage:** `iroha app da pin-intents-verify --proof-json <PATH>`

###### **Options:**

* `--proof-json <PATH>` — Path to a JSON-encoded `DaPinIntentProof`



## `iroha app da rent-quote`

Quote rent/incentive breakdown for a blob size/retention combo

**Usage:** `iroha app da rent-quote [OPTIONS] --gib <GIB> --months <MONTHS>`

###### **Options:**

* `--gib <GIB>` — Logical GiB stored in the blob (post-chunking)
* `--months <MONTHS>` — Retention duration measured in months
* `--policy-json <PATH>` — Optional path to a JSON-encoded `DaRentPolicyV1`
* `--policy-norito <PATH>` — Optional path to a Norito-encoded `DaRentPolicyV1`
* `--policy-label <TEXT>` — Optional human-readable label recorded in the quote metadata (defaults to source path)
* `--quote-out <PATH>` — Optional path for persisting the rendered quote JSON



## `iroha app da rent-ledger`

Convert a rent quote into deterministic ledger transfer instructions

**Usage:** `iroha app da rent-ledger --quote <PATH> --payer-account <ACCOUNT_ID> --treasury-account <ACCOUNT_ID> --protocol-reserve-account <ACCOUNT_ID> --provider-account <ACCOUNT_ID> --pdp-bonus-account <ACCOUNT_ID> --potr-bonus-account <ACCOUNT_ID> --asset-definition <AID>`

###### **Options:**

* `--quote <PATH>` — Path to the rent quote JSON file (output of `iroha da rent-quote`)
* `--payer-account <ACCOUNT_ID>` — Account responsible for paying the rent and funding bonus pools
* `--treasury-account <ACCOUNT_ID>` — Treasury or escrow account receiving the base rent before distribution
* `--protocol-reserve-account <ACCOUNT_ID>` — Protocol reserve account that receives the configured reserve share
* `--provider-account <ACCOUNT_ID>` — Provider payout account that receives the base rent remainder
* `--pdp-bonus-account <ACCOUNT_ID>` — Account earmarked for PDP bonus payouts
* `--potr-bonus-account <ACCOUNT_ID>` — Account earmarked for `PoTR` bonus payouts
* `--asset-definition <AID>` — Asset definition identifier used for transfers (canonical unprefixed Base58 address)



## `iroha app streaming`

Streaming helpers (HPKE fingerprints, suite listings)

**Usage:** `iroha app streaming <COMMAND>`

###### **Subcommands:**

* `fingerprint` — Compute the ML-KEM fingerprint advertised in `EncryptionSuite::Kyber*`
* `suites` — List supported ML-KEM suite identifiers



## `iroha app streaming fingerprint`

Compute the ML-KEM fingerprint advertised in `EncryptionSuite::Kyber*`

**Usage:** `iroha app streaming fingerprint [OPTIONS] --public-key <HEX>`

###### **Options:**

* `--suite <NAME>` — ML-KEM suite to use (e.g., `mlkem512`, `mlkem768`, `mlkem1024`)
* `--public-key <HEX>` — Hex-encoded ML-KEM public key



## `iroha app streaming suites`

List supported ML-KEM suite identifiers

**Usage:** `iroha app streaming suites`



## `iroha app nexus`

Nexus helpers (lanes, governance)

**Usage:** `iroha app nexus <COMMAND>`

###### **Subcommands:**

* `lane-report` — Show governance manifest status per lane
* `public-lane` — Inspect public-lane validator lifecycle and stake state
* `private-settlement` — Coordinate and inspect atomic private cross-dataspace settlement



## `iroha app nexus lane-report`

Show governance manifest status per lane

**Usage:** `iroha app nexus lane-report [OPTIONS]`

###### **Options:**

* `--summary` — Print a compact table instead of JSON

  Default value: `false`
* `--only-missing` — Show only lanes that require a manifest but remain sealed

  Default value: `false`
* `--fail-on-sealed` — Exit with non-zero status if any manifest is missing

  Default value: `false`



## `iroha app nexus public-lane`

Inspect public-lane validator lifecycle and stake state

**Usage:** `iroha app nexus public-lane <COMMAND>`

###### **Subcommands:**

* `validators` — List validators for a public lane with lifecycle hints
* `stake` — List bonded stake and pending unbonds for a public lane



## `iroha app nexus public-lane validators`

List validators for a public lane with lifecycle hints

**Usage:** `iroha app nexus public-lane validators [OPTIONS]`

###### **Options:**

* `--lane <LANE>` — Public lane identifier (defaults to SINGLE lane)

  Default value: `0`
* `--summary` — Render a compact table instead of raw JSON

  Default value: `false`



## `iroha app nexus public-lane stake`

List bonded stake and pending unbonds for a public lane

**Usage:** `iroha app nexus public-lane stake [OPTIONS]`

###### **Options:**

* `--lane <LANE>` — Public lane identifier (defaults to SINGLE lane)

  Default value: `0`
* `--validator <ACCOUNT_ID>` — Filter for a specific validator account (optional)
* `--summary` — Render a compact table instead of raw JSON

  Default value: `false`



## `iroha app nexus private-settlement`

Coordinate and inspect atomic private cross-dataspace settlement

**Usage:** `iroha app nexus private-settlement <COMMAND>`

###### **Subcommands:**

* `availability-share` — Persist provisional material on one validator and request its availability share
* `prepare-vote` — Ask one validator to verify, durably stage, and vote Prepare
* `commit-vote` — Ask one validator to verify the complete Prepare barrier and vote Commit
* `phase-certificate` — Persist one exact Prepare or Commit certificate on a validator
* `phase-certificates` — Recover locally durable Prepare and Commit certificates as the sponsor
* `leg-upload` — Upload one certified encrypted leg
* `leg-status` — Read one authenticated redacted leg status
* `committee-proof` — Fetch the restricted proof view as an exact committee identity
* `audit-capsule` — Fetch the encrypted capsule as an exact governed auditor identity
* `audit-approval` — Submit one purpose-separated auditor approval
* `bundle-submit` — Submit the exact sponsor-signed global finalization carrier
* `bundle-status` — Read the public bundle lifecycle
* `bundle-receipt` — Read the public terminal receipt or pending marker



## `iroha app nexus private-settlement availability-share`

Persist provisional material on one validator and request its availability share

**Usage:** `iroha app nexus private-settlement availability-share --endpoint <ENDPOINT> --material <PATH>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Exact participant Torii root URL
* `--material <PATH>` — Bounded Norito JSON `PrivateSettlementProvisionalLegMaterialV1` file



## `iroha app nexus private-settlement prepare-vote`

Ask one validator to verify, durably stage, and vote Prepare

**Usage:** `iroha app nexus private-settlement prepare-vote --endpoint <ENDPOINT> --manifest <PATH> --payload-digest <PAYLOAD_DIGEST> --authority <PATH>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Exact participant Torii root URL
* `--manifest <PATH>` — Bounded Norito JSON `AtomicPrivateSettlementV1` file
* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest
* `--authority <PATH>` — Bounded Norito JSON four-validator authority file



## `iroha app nexus private-settlement commit-vote`

Ask one validator to verify the complete Prepare barrier and vote Commit

**Usage:** `iroha app nexus private-settlement commit-vote --endpoint <ENDPOINT> --payload-digest <PAYLOAD_DIGEST> --barrier <PATH> --authority <PATH>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Exact participant Torii root URL
* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest
* `--barrier <PATH>` — Bounded Norito JSON complete Prepare barrier file
* `--authority <PATH>` — Bounded Norito JSON four-validator authority file



## `iroha app nexus private-settlement phase-certificate`

Persist one exact Prepare or Commit certificate on a validator

**Usage:** `iroha app nexus private-settlement phase-certificate --endpoint <ENDPOINT> --manifest <PATH> --payload-digest <PAYLOAD_DIGEST> --certificate <PATH>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Exact participant Torii root URL
* `--manifest <PATH>` — Bounded Norito JSON `AtomicPrivateSettlementV1` file
* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest
* `--certificate <PATH>` — Bounded Norito JSON Prepare or Commit certificate file



## `iroha app nexus private-settlement phase-certificates`

Recover locally durable Prepare and Commit certificates as the sponsor

**Usage:** `iroha app nexus private-settlement phase-certificates [OPTIONS] --payload-digest <PAYLOAD_DIGEST>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Optional participant Torii root; defaults to the configured Torii URL
* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest



## `iroha app nexus private-settlement leg-upload`

Upload one certified encrypted leg

**Usage:** `iroha app nexus private-settlement leg-upload [OPTIONS] --request <PATH>`

###### **Options:**

* `--endpoint <ENDPOINT>` — Optional participant Torii root; defaults to the configured Torii URL
* `--request <PATH>` — Bounded Norito JSON `PrivateSettlementLegUploadRequestV1` file



## `iroha app nexus private-settlement leg-status`

Read one authenticated redacted leg status

**Usage:** `iroha app nexus private-settlement leg-status --payload-digest <PAYLOAD_DIGEST>`

###### **Options:**

* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest



## `iroha app nexus private-settlement committee-proof`

Fetch the restricted proof view as an exact committee identity

**Usage:** `iroha app nexus private-settlement committee-proof --payload-digest <PAYLOAD_DIGEST>`

###### **Options:**

* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest



## `iroha app nexus private-settlement audit-capsule`

Fetch the encrypted capsule as an exact governed auditor identity

**Usage:** `iroha app nexus private-settlement audit-capsule --payload-digest <PAYLOAD_DIGEST>`

###### **Options:**

* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest



## `iroha app nexus private-settlement audit-approval`

Submit one purpose-separated auditor approval

**Usage:** `iroha app nexus private-settlement audit-approval --payload-digest <PAYLOAD_DIGEST> --request <PATH>`

###### **Options:**

* `--payload-digest <PAYLOAD_DIGEST>` — Exact leg payload digest
* `--request <PATH>` — Bounded Norito JSON `PrivateSettlementAuditApprovalRequestV1` file



## `iroha app nexus private-settlement bundle-submit`

Submit the exact sponsor-signed global finalization carrier

**Usage:** `iroha app nexus private-settlement bundle-submit --request <PATH>`

###### **Options:**

* `--request <PATH>` — Bounded Norito JSON request file



## `iroha app nexus private-settlement bundle-status`

Read the public bundle lifecycle

**Usage:** `iroha app nexus private-settlement bundle-status --bundle-id <BUNDLE_ID>`

###### **Options:**

* `--bundle-id <BUNDLE_ID>` — Exact public bundle identifier



## `iroha app nexus private-settlement bundle-receipt`

Read the public terminal receipt or pending marker

**Usage:** `iroha app nexus private-settlement bundle-receipt --bundle-id <BUNDLE_ID>`

###### **Options:**

* `--bundle-id <BUNDLE_ID>` — Exact public bundle identifier



## `iroha app staking`

Public-lane staking helpers (register/activate/exit)

**Usage:** `iroha app staking <COMMAND>`

###### **Subcommands:**

* `register` — Register a stake-elected validator on a public lane
* `rebind` — Rebind an existing validator to a replacement consensus peer
* `activate` — Activate a pending validator once its activation epoch is reached
* `exit` — Schedule or finalize a validator exit



## `iroha app staking register`

Register a stake-elected validator on a public lane

**Usage:** `iroha app staking register [OPTIONS] --lane-id <LANE_ID> --validator <ACCOUNT_ID> --peer-id <PEER_ID> --initial-stake <QUANTITY>`

###### **Options:**

* `--lane-id <LANE_ID>` — Lane id to register against
* `--validator <ACCOUNT_ID>` — Validator account identifier (canonical I105 account literal)
* `--peer-id <PEER_ID>` — Peer identity that will participate in consensus for this validator
* `--stake-account <ACCOUNT_ID>` — Optional staking account (defaults to validator)
* `--initial-stake <QUANTITY>` — Exact initial self-bond quantity
* `--metadata <PATH>` — Optional metadata JSON (Norito JSON object)



## `iroha app staking rebind`

Rebind an existing validator to a replacement consensus peer

**Usage:** `iroha app staking rebind --lane-id <LANE_ID> --validator <ACCOUNT_ID> --peer-id <PEER_ID>`

###### **Options:**

* `--lane-id <LANE_ID>` — Lane id containing the validator
* `--validator <ACCOUNT_ID>` — Validator account identifier (canonical I105 account literal)
* `--peer-id <PEER_ID>` — Replacement peer identity that will participate in consensus for this validator



## `iroha app staking activate`

Activate a pending validator once its activation epoch is reached

**Usage:** `iroha app staking activate --lane-id <LANE_ID> --validator <ACCOUNT_ID>`

###### **Options:**

* `--lane-id <LANE_ID>` — Lane id containing the pending validator
* `--validator <ACCOUNT_ID>` — Validator account identifier (canonical I105 account literal)



## `iroha app staking exit`

Schedule or finalize a validator exit

**Usage:** `iroha app staking exit --lane-id <LANE_ID> --validator <ACCOUNT_ID> --release-at-ms <MILLIS>`

###### **Options:**

* `--lane-id <LANE_ID>` — Lane id containing the validator
* `--validator <ACCOUNT_ID>` — Validator account identifier (canonical I105 account literal)
* `--release-at-ms <MILLIS>` — Release timestamp in milliseconds (must not precede current block timestamp)



## `iroha app subscriptions`

Subscription plan and billing helpers

**Usage:** `iroha app subscriptions <COMMAND>`

###### **Subcommands:**

* `plan` — Manage subscription plans (asset definition metadata)
* `subscription` — Manage subscriptions and billing actions



## `iroha app subscriptions plan`

Manage subscription plans (asset definition metadata)

**Usage:** `iroha app subscriptions plan <COMMAND>`

###### **Subcommands:**

* `create` — Register a subscription plan on an asset definition
* `list` — List subscription plans, optionally filtered by provider



## `iroha app subscriptions plan create`

Register a subscription plan on an asset definition

**Usage:** `iroha app subscriptions plan create [OPTIONS] --authority <ACCOUNT_ID> --plan-id <ASSET_DEF_ID>`

###### **Options:**

* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--plan-id <ASSET_DEF_ID>` — Asset definition id where the plan metadata is stored
* `--plan-json <PATH>` — Path to JSON plan payload (reads stdin when omitted)



## `iroha app subscriptions plan list`

List subscription plans, optionally filtered by provider

**Usage:** `iroha app subscriptions plan list [OPTIONS]`

###### **Options:**

* `--provider <ACCOUNT_ID>` — Filter by plan provider (account id)
* `--limit <LIMIT>` — Limit number of results
* `--offset <OFFSET>` — Offset for pagination (default 0)

  Default value: `0`



## `iroha app subscriptions subscription`

Manage subscriptions and billing actions

**Usage:** `iroha app subscriptions subscription <COMMAND>`

###### **Subcommands:**

* `create` — Create a subscription and billing trigger
* `list` — List subscriptions with optional filters
* `get` — Fetch a subscription by id
* `pause` — Pause billing for a subscription
* `resume` — Resume billing for a subscription
* `cancel` — Cancel a subscription and remove its billing trigger
* `keep` — Undo a scheduled period-end cancellation
* `charge-now` — Execute billing immediately
* `usage` — Record usage for a subscription usage plan



## `iroha app subscriptions subscription create`

Create a subscription and billing trigger

**Usage:** `iroha app subscriptions subscription create [OPTIONS] --authority <ACCOUNT_ID> --subscription-id <NFT_ID> --plan-id <ASSET_DEF_ID>`

###### **Options:**

* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--subscription-id <NFT_ID>` — Subscription NFT id to register
* `--plan-id <ASSET_DEF_ID>` — Subscription plan asset definition id
* `--billing-trigger-id <BILLING_TRIGGER_ID>` — Optional billing trigger id to use
* `--usage-trigger-id <USAGE_TRIGGER_ID>` — Optional usage trigger id to use (usage plans only)
* `--first-charge-ms <FIRST_CHARGE_MS>` — Optional first charge timestamp in UTC milliseconds
* `--grant-usage-to-provider <GRANT_USAGE_TO_PROVIDER>` — Grant usage reporting permission to the plan provider

  Possible values: `true`, `false`




## `iroha app subscriptions subscription list`

List subscriptions with optional filters

**Usage:** `iroha app subscriptions subscription list [OPTIONS]`

###### **Options:**

* `--owned-by <ACCOUNT_ID>` — Filter by subscriber account
* `--provider <ACCOUNT_ID>` — Filter by plan provider account
* `--status <STATUS>` — Filter by status (active, paused, `past_due`, canceled, suspended)
* `--limit <LIMIT>` — Limit number of results
* `--offset <OFFSET>` — Offset for pagination (default 0)

  Default value: `0`



## `iroha app subscriptions subscription get`

Fetch a subscription by id

**Usage:** `iroha app subscriptions subscription get --subscription-id <NFT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id



## `iroha app subscriptions subscription pause`

Pause billing for a subscription

**Usage:** `iroha app subscriptions subscription pause [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--charge-at-ms <CHARGE_AT_MS>` — Optional charge time override in UTC milliseconds
* `--cancel-at-period-end` — Cancel at the end of the current billing period (cancel only)



## `iroha app subscriptions subscription resume`

Resume billing for a subscription

**Usage:** `iroha app subscriptions subscription resume [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--charge-at-ms <CHARGE_AT_MS>` — Optional charge time override in UTC milliseconds
* `--cancel-at-period-end` — Cancel at the end of the current billing period (cancel only)



## `iroha app subscriptions subscription cancel`

Cancel a subscription and remove its billing trigger

**Usage:** `iroha app subscriptions subscription cancel [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--charge-at-ms <CHARGE_AT_MS>` — Optional charge time override in UTC milliseconds
* `--cancel-at-period-end` — Cancel at the end of the current billing period (cancel only)



## `iroha app subscriptions subscription keep`

Undo a scheduled period-end cancellation

**Usage:** `iroha app subscriptions subscription keep [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--charge-at-ms <CHARGE_AT_MS>` — Optional charge time override in UTC milliseconds
* `--cancel-at-period-end` — Cancel at the end of the current billing period (cancel only)



## `iroha app subscriptions subscription charge-now`

Execute billing immediately

**Usage:** `iroha app subscriptions subscription charge-now [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--charge-at-ms <CHARGE_AT_MS>` — Optional charge time override in UTC milliseconds
* `--cancel-at-period-end` — Cancel at the end of the current billing period (cancel only)



## `iroha app subscriptions subscription usage`

Record usage for a subscription usage plan

**Usage:** `iroha app subscriptions subscription usage [OPTIONS] --subscription-id <NFT_ID> --authority <ACCOUNT_ID> --unit-key <UNIT_KEY> --delta <DELTA>`

###### **Options:**

* `--subscription-id <NFT_ID>` — Subscription NFT id
* `--authority <ACCOUNT_ID>` — Authority account identifier (canonical I105 account literal)
* `--unit-key <UNIT_KEY>` — Usage counter key to update
* `--delta <DELTA>` — Non-negative usage increment
* `--usage-trigger-id <USAGE_TRIGGER_ID>` — Optional usage trigger id override



## `iroha app endorsement`

Domain endorsement helpers (committees, policies, submissions)

**Usage:** `iroha app endorsement <COMMAND>`

###### **Subcommands:**

* `prepare` — Build a domain endorsement (optionally signing it) and emit JSON to stdout
* `submit` — Submit a domain endorsement into the chain state for later reuse
* `list` — List recorded endorsements for a domain
* `policy` — Fetch the endorsement policy for a domain
* `committee` — Fetch a registered endorsement committee
* `register-committee` — Register an endorsement committee (quorum + members)
* `set-policy` — Set or replace the endorsement policy for a domain



## `iroha app endorsement prepare`

Build a domain endorsement (optionally signing it) and emit JSON to stdout

**Usage:** `iroha app endorsement prepare [OPTIONS] --domain <DOMAIN> --issued-at-height <HEIGHT> --expires-at-height <HEIGHT>`

###### **Options:**

* `--domain <DOMAIN>` — Domain identifier being endorsed
* `--committee-id <COMMITTEE_ID>` — Committee identifier backing this endorsement

  Default value: `default`
* `--issued-at-height <HEIGHT>` — Block height when the endorsement was issued
* `--expires-at-height <HEIGHT>` — Block height when the endorsement expires
* `--block-start <BLOCK_START>` — Optional block height (inclusive) when the endorsement becomes valid
* `--block-end <BLOCK_END>` — Optional block height (inclusive) after which the endorsement is invalid
* `--dataspace <DATASPACE>` — Optional dataspace binding for the endorsement
* `--metadata <PATH>` — Optional metadata payload (Norito JSON file) to embed
* `--signer-key <PRIVATE_KEY>` — Private keys to sign the endorsement body (multiple allowed)



## `iroha app endorsement submit`

Submit a domain endorsement into the chain state for later reuse

**Usage:** `iroha app endorsement submit [OPTIONS]`

###### **Options:**

* `--file <PATH>` — Path to the endorsement JSON. If omitted, read from stdin



## `iroha app endorsement list`

List recorded endorsements for a domain

**Usage:** `iroha app endorsement list --domain <DOMAIN>`

###### **Options:**

* `--domain <DOMAIN>` — Domain to query



## `iroha app endorsement policy`

Fetch the endorsement policy for a domain

**Usage:** `iroha app endorsement policy --domain <DOMAIN>`

###### **Options:**

* `--domain <DOMAIN>` — Domain to query



## `iroha app endorsement committee`

Fetch a registered endorsement committee

**Usage:** `iroha app endorsement committee --committee-id <COMMITTEE_ID>`

###### **Options:**

* `--committee-id <COMMITTEE_ID>` — Committee identifier to fetch



## `iroha app endorsement register-committee`

Register an endorsement committee (quorum + members)

**Usage:** `iroha app endorsement register-committee [OPTIONS] --committee-id <COMMITTEE_ID> --quorum <QUORUM> --member <PUBLIC_KEY>`

###### **Options:**

* `--committee-id <COMMITTEE_ID>` — New committee identifier
* `--quorum <QUORUM>` — Quorum required to accept an endorsement
* `--member <PUBLIC_KEY>` — Member public keys allowed to sign endorsements (string form)
* `--metadata <PATH>` — Optional metadata payload (Norito JSON file) to attach



## `iroha app endorsement set-policy`

Set or replace the endorsement policy for a domain

**Usage:** `iroha app endorsement set-policy [OPTIONS] --domain <DOMAIN> --committee-id <COMMITTEE_ID> --max-endorsement-age <BLOCKS>`

###### **Options:**

* `--domain <DOMAIN>` — Domain requiring endorsements
* `--committee-id <COMMITTEE_ID>` — Committee identifier to trust
* `--max-endorsement-age <BLOCKS>` — Maximum age (in blocks) allowed between issuance and acceptance
* `--required` — Whether an endorsement is required for the domain

  Default value: `true`



## `iroha app jurisdiction`

Jurisdiction Data Guardian helpers (attestations and SDN registries)

**Usage:** `iroha app jurisdiction <COMMAND>`

###### **Subcommands:**

* `verify` — Validate a JDG attestation (structural + SDN commitments)



## `iroha app jurisdiction verify`

Validate a JDG attestation (structural + SDN commitments)

**Usage:** `iroha app jurisdiction verify [OPTIONS]`

###### **Options:**

* `--attestation <PATH>` — Path to the JDG attestation payload (Norito JSON or binary). Reads stdin when omitted
* `--sdn-registry <PATH>` — Optional SDN registry payload (Norito JSON or binary)
* `--require-sdn-commitments` — Whether SDN commitments are mandatory for this attestation

  Default value: `false`
* `--dual-publish-blocks <DUAL_PUBLISH_BLOCKS>` — Number of blocks the previous SDN key remains valid after rotation

  Default value: `0`
* `--current-height <HEIGHT>` — Current block height for expiry/block-window checks
* `--expect-dataspace <ID>` — Expected dataspace id; validation fails if it does not match



## `iroha app compute`

Compute lane simulation helpers

**Usage:** `iroha app compute <COMMAND>`

###### **Subcommands:**

* `simulate` — Simulate a compute call offline and emit the receipt/response
* `invoke` — Invoke a running compute gateway using the shared fixtures



## `iroha app compute simulate`

Simulate a compute call offline and emit the receipt/response

**Usage:** `iroha app compute simulate [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to the compute manifest to validate against

  Default value: `fixtures/compute/manifest_compute_payments.json`
* `--call <PATH>` — Path to the canonical compute call fixture

  Default value: `fixtures/compute/call_compute_payments.json`
* `--payload <PATH>` — Path to the payload to send (ignored when --payload-inline is supplied)

  Default value: `fixtures/compute/payload_compute_payments.json`
* `--payload-inline <BYTES>` — Inline payload bytes (UTF-8) (mutually exclusive with --payload)
* `--json-out <PATH>` — Optional JSON output path (stdout when omitted)



## `iroha app compute invoke`

Invoke a running compute gateway using the shared fixtures

**Usage:** `iroha app compute invoke [OPTIONS]`

###### **Options:**

* `--endpoint <URL>` — Base endpoint for the compute gateway (without the route path)

  Default value: `http://127.0.0.1:8088`
* `--manifest <PATH>` — Path to the compute manifest used for validation

  Default value: `fixtures/compute/manifest_compute_payments.json`
* `--call <PATH>` — Path to the compute call fixture

  Default value: `fixtures/compute/call_compute_payments.json`
* `--payload <PATH>` — Path to the payload to send with the call

  Default value: `fixtures/compute/payload_compute_payments.json`



## `iroha app social`

Social incentive helpers (viral follow rewards and escrows)

**Usage:** `iroha app social <COMMAND>`

###### **Subcommands:**

* `claim-twitter-follow-reward` — Claim a promotional reward for a verified Twitter follow binding
* `send-to-twitter` — Send funds to a Twitter handle; funds are escrowed until a follow binding appears
* `cancel-twitter-escrow` — Cancel an existing escrow created by `send-to-twitter`



## `iroha app social claim-twitter-follow-reward`

Claim a promotional reward for a verified Twitter follow binding

**Usage:** `iroha app social claim-twitter-follow-reward --binding-hash-json <PATH>`

###### **Options:**

* `--binding-hash-json <PATH>` — Path to a JSON file containing a `KeyedHash` (binding hash) payload.

   The JSON shape must match `iroha_data_model::oracle::KeyedHash`.



## `iroha app social send-to-twitter`

Send funds to a Twitter handle; funds are escrowed until a follow binding appears

**Usage:** `iroha app social send-to-twitter --binding-hash-json <PATH> --amount <AMOUNT>`

###### **Options:**

* `--binding-hash-json <PATH>` — Path to a JSON file containing a `KeyedHash` (binding hash) payload.

   The JSON shape must match `iroha_data_model::oracle::KeyedHash`.
* `--amount <AMOUNT>` — Amount to escrow or deliver immediately when the binding is already active.

   Parsed as a canonical non-negative `Quantity` using the standard string format.



## `iroha app social cancel-twitter-escrow`

Cancel an existing escrow created by `send-to-twitter`

**Usage:** `iroha app social cancel-twitter-escrow --binding-hash-json <PATH>`

###### **Options:**

* `--binding-hash-json <PATH>` — Path to a JSON file containing a `KeyedHash` (binding hash) payload.

   The JSON shape must match `iroha_data_model::oracle::KeyedHash`.



## `iroha app space-directory`

Space Directory helpers (UAID capability manifests)

**Usage:** `iroha app space-directory <COMMAND>`

###### **Subcommands:**

* `manifest` — Manage UAID capability manifests
* `bindings` — Inspect UAID bindings surfaced by Torii



## `iroha app space-directory manifest`

Manage UAID capability manifests

**Usage:** `iroha app space-directory manifest <COMMAND>`

###### **Subcommands:**

* `publish` — Publish or replace a capability manifest (.to payload)
* `encode` — Encode manifest JSON into Norito bytes and record its hash
* `revoke` — Revoke a manifest for a UAID/dataspace pair
* `expire` — Expire a manifest that reached its scheduled end-of-life
* `audit-bundle` — Produce an audit bundle for an existing capability manifest + dataspace profile
* `fetch` — Fetch manifests for a UAID via Torii
* `scaffold` — Scaffold manifest/profile templates for a UAID + dataspace pair



## `iroha app space-directory manifest publish`

Publish or replace a capability manifest (.to payload)

**Usage:** `iroha app space-directory manifest publish [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded `AssetPermissionManifest` (.to)
* `--manifest-json <PATH>` — Path to the JSON `AssetPermissionManifest` (encoded on submit)
* `--reason <TEXT>` — Optional CLI-level reason used when publishing a new manifest (added to metadata)



## `iroha app space-directory manifest encode`

Encode manifest JSON into Norito bytes and record its hash

**Usage:** `iroha app space-directory manifest encode [OPTIONS] --json <PATH>`

###### **Options:**

* `--json <PATH>` — Path to the JSON `AssetPermissionManifest`
* `--out <PATH>` — Target path for the Norito `.to` payload (defaults to `<json>.manifest.to`)
* `--hash-out <PATH>` — Optional file for the manifest hash (defaults to `<out>.hash`)



## `iroha app space-directory manifest revoke`

Revoke a manifest for a UAID/dataspace pair

**Usage:** `iroha app space-directory manifest revoke [OPTIONS] --uaid <UAID> --dataspace <ID> --revoked-epoch <EPOCH>`

###### **Options:**

* `--uaid <UAID>` — UAID whose manifest should be revoked
* `--dataspace <ID>` — Dataspace identifier hosting the manifest
* `--revoked-epoch <EPOCH>` — Epoch (inclusive) when the revocation takes effect
* `--reason <TEXT>` — Optional reason recorded with the revocation



## `iroha app space-directory manifest expire`

Expire a manifest that reached its scheduled end-of-life

**Usage:** `iroha app space-directory manifest expire --uaid <UAID> --dataspace <ID> --expired-epoch <EPOCH>`

###### **Options:**

* `--uaid <UAID>` — UAID whose manifest should be expired
* `--dataspace <ID>` — Dataspace identifier hosting the manifest
* `--expired-epoch <EPOCH>` — Epoch (inclusive) when the expiry occurred



## `iroha app space-directory manifest audit-bundle`

Produce an audit bundle for an existing capability manifest + dataspace profile

**Usage:** `iroha app space-directory manifest audit-bundle [OPTIONS] --profile <PATH> --out-dir <DIR>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded `AssetPermissionManifest` (.to)
* `--manifest-json <PATH>` — Path to the JSON `AssetPermissionManifest` (encoded on export)
* `--profile <PATH>` — Dataspace profile JSON used to capture governance/audit hooks
* `--out-dir <DIR>` — Directory where the bundle (manifest/profile/hash/audit metadata) will be written
* `--notes <TEXT>` — Optional operator note recorded inside the bundle metadata



## `iroha app space-directory manifest fetch`

Fetch manifests for a UAID via Torii

**Usage:** `iroha app space-directory manifest fetch [OPTIONS] --uaid <UAID>`

###### **Options:**

* `--uaid <UAID>` — UAID literal whose manifests should be fetched
* `--dataspace <ID>` — Optional dataspace id filter
* `--status <STATUS>` — Manifest lifecycle status filter (active, inactive, all)

  Default value: `all`

  Possible values: `active`, `inactive`, `all`

* `--limit <N>` — Maximum number of manifests to return
* `--offset <N>` — Offset for pagination
* `--json-out <PATH>` — Optional path where the JSON response will be stored



## `iroha app space-directory manifest scaffold`

Scaffold manifest/profile templates for a UAID + dataspace pair

**Usage:** `iroha app space-directory manifest scaffold [OPTIONS] --uaid <UAID> --dataspace <ID> --activation-epoch <EPOCH>`

###### **Options:**

* `--uaid <UAID>` — Exact canonical universal account identifier (`uaid:<64-lowercase-hex>`, LSB=1)
* `--dataspace <ID>` — Dataspace identifier the manifest targets
* `--activation-epoch <EPOCH>` — Activation epoch recorded in the manifest
* `--expiry-epoch <EPOCH>` — Optional expiry epoch recorded in the manifest
* `--issued-ms <MS>` — Override the issued timestamp (milliseconds since UNIX epoch)
* `--notes <TEXT>` — Optional notes propagated to scaffolded entries
* `--manifest-out <PATH>` — Output path for the manifest JSON (defaults to `artifacts/space_directory/scaffold/<timestamp>/manifest.json`)
* `--profile-out <PATH>` — Optional output path for the dataspace profile skeleton (defaults beside the manifest)
* `--allow-dataspace <ID>` — Optional dataspace override for the allow entry scope
* `--allow-program <PROGRAM>` — Program identifier (`contract.name`) for the allow entry
* `--allow-method <NAME>` — Method/entry-point for the allow entry
* `--allow-asset <ASSET-ID>` — Asset identifier (e.g. `61CtjvNd9T3THAR65GsMVHr82Bjc`) for the allow entry
* `--allow-role <ROLE>` — AMX role enforced by the allow entry (`initiator` or `participant`)
* `--allow-max-amount <DECIMAL>` — Deterministic allowance cap (decimal string)
* `--allow-window <WINDOW>` — Allowance window (`per-slot`, `per-minute`, or `per-day`)
* `--allow-notes <TEXT>` — Optional operator note stored alongside the entry
* `--deny-dataspace <ID>` — Optional dataspace override for the deny entry scope
* `--deny-program <PROGRAM>` — Program identifier (`contract.name`) for the deny entry
* `--deny-method <NAME>` — Method/entry-point for the deny entry
* `--deny-asset <ASSET-ID>` — Asset identifier (e.g. `61CtjvNd9T3THAR65GsMVHr82Bjc`) for the deny entry
* `--deny-role <ROLE>` — AMX role enforced by the deny entry
* `--deny-reason <TEXT>` — Optional reason recorded for the deny directive
* `--deny-notes <TEXT>` — Optional operator note stored alongside the entry
* `--profile-id <ID>` — Dataspace profile identifier (default `profile.<dataspace>.v1`)
* `--profile-activation-epoch <EPOCH>` — Epoch recorded in the profile metadata
* `--profile-governance-issuer <ACCOUNT_ID>` — Dataspace governance issuer account
* `--profile-governance-ticket <TEXT>` — Governance ticket/evidence label
* `--profile-governance-quorum <N>` — Governance quorum threshold
* `--profile-validator <ACCOUNT_ID>` — Validator account identifiers
* `--profile-validator-quorum <N>` — Validator quorum threshold
* `--profile-protected-namespace <NAME>` — Protected namespace entries
* `--profile-da-class <TEXT>` — DA class label (default `A`)
* `--profile-da-quorum <N>` — DA attester quorum
* `--profile-da-attester <ACCOUNT_ID>` — DA attester identifiers
* `--profile-da-rotation-epochs <EPOCHS>` — DA rotation cadence in epochs
* `--profile-composability-group <HEX>` — Composability group identifier (hex string)
* `--profile-audit-log-schema <TEXT>` — Optional audit log schema hint
* `--profile-pagerduty-service <TEXT>` — Optional `PagerDuty` service label



## `iroha app space-directory bindings`

Inspect UAID bindings surfaced by Torii

**Usage:** `iroha app space-directory bindings <COMMAND>`

###### **Subcommands:**

* `fetch` — Fetch UAID dataspace bindings via Torii



## `iroha app space-directory bindings fetch`

Fetch UAID dataspace bindings via Torii

**Usage:** `iroha app space-directory bindings fetch [OPTIONS] --uaid <UAID>`

###### **Options:**

* `--uaid <UAID>` — UAID literal whose bindings should be fetched
* `--json-out <PATH>` — Optional path where the JSON response will be stored



## `iroha app kaigi`

Kaigi session helpers

**Usage:** `iroha app kaigi <COMMAND>`

###### **Subcommands:**

* `create` — Create a new Kaigi session
* `quickstart` — Bootstrap a Kaigi session for demos and shareable testing metadata
* `register-relay` — Register or update a Kaigi relay descriptor
* `unregister-relay` — Retire a Kaigi relay descriptor and its retained health feedback
* `set-relay-manifest` — Replace or clear the relay manifest for an existing Kaigi session
* `join` — Join a Kaigi session
* `leave` — Leave a Kaigi session
* `end` — End an active Kaigi session
* `record-usage` — Record usage statistics for a Kaigi session
* `report-relay-health` — Report the health status of a relay used by a Kaigi session



## `iroha app kaigi create`

Create a new Kaigi session

**Usage:** `iroha app kaigi create [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME> --host <ACCOUNT-ID>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call (e.g. `kaigi.universal`)
* `--call-name <NAME>` — Call name within the domain (e.g. `daily-sync`)
* `--host <ACCOUNT-ID>` — Host account identifier responsible for the call (canonical I105 account literal)
* `--title <TITLE>` — Optional human friendly title
* `--description <DESCRIPTION>` — Optional description for participants
* `--max-participants <U32>` — Maximum concurrent participants excluding the host (1..=4096)
* `--gas-rate-per-minute <U64>` — Gas rate charged per minute (defaults to 0)

  Default value: `0`
* `--billing-account <ACCOUNT-ID>` — Optional host billing account that will cover usage (canonical I105 account literal). Third-party delegated billing is not supported in the first release
* `--scheduled-start-ms <U64>` — Optional scheduled start timestamp (milliseconds since epoch)
* `--privacy-mode <PRIVACY_MODE>` — Privacy mode for the session (defaults to `transparent`)

  Default value: `transparent`

  Possible values: `transparent`, `zk-roster-v1`

* `--room-policy <ROOM_POLICY>` — Room access policy controlling viewer authentication

  Default value: `authenticated`

  Possible values: `public`, `authenticated`

* `--relay-manifest <PATH>` — Path to a JSON file describing the relay manifest (optional)
* `--metadata-json <PATH>` — Path to a JSON file providing additional metadata (object with string keys)
* `--commitment-hex <HEX>` — Commitment hash (hex) for privacy mode creation
* `--commitment-alias <COMMITMENT_ALIAS>` — Reserved on-chain alias tag; must be omitted to avoid ledger disclosure
* `--nullifier-hex <HEX>` — Nullifier hash (hex) preventing proof replay (privacy mode)
* `--nullifier-issued-at-ms <U64>` — Reserved on-chain timing field; must be omitted or zero
* `--roster-root-hex <HEX>` — Roster Merkle root bound into the proof transcript (privacy mode)
* `--proof-hex <HEX>` — Proof bytes attesting ownership (hex encoding of raw bytes)



## `iroha app kaigi quickstart`

Bootstrap a Kaigi session for demos and shareable testing metadata

**Usage:** `iroha app kaigi quickstart [OPTIONS]`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call

  Default value: `wonderland.universal`
* `--call-name <NAME>` — Call name within the domain (defaults to a timestamp-based identifier)
* `--host <ACCOUNT-ID>` — Host account identifier responsible for the call (canonical I105 account literal)
* `--privacy-mode <PRIVACY_MODE>` — Privacy mode for the session (defaults to `transparent`)

  Default value: `transparent`

  Possible values: `transparent`, `zk-roster-v1`

* `--room-policy <ROOM_POLICY>` — Room access policy controlling viewer authentication

  Default value: `authenticated`

  Possible values: `public`, `authenticated`

* `--relay-manifest <PATH>` — Path to a JSON file describing the relay manifest (optional)
* `--metadata-json <PATH>` — Path to a JSON file providing additional metadata (object with string keys)
* `--summary-out <PATH>` — File path where the JSON summary should be written (defaults to stdout only)



## `iroha app kaigi register-relay`

Register or update a Kaigi relay descriptor

**Usage:** `iroha app kaigi register-relay --relay <ACCOUNT-ID> --hpke-public-key-b64 <BASE64> --bandwidth-class <U8>`

###### **Options:**

* `--relay <ACCOUNT-ID>` — Relay account identifier advertising relay capabilities (canonical I105 account literal). The account must have a live domain-qualified primary alias, which selects the governance domain where the descriptor is stored
* `--hpke-public-key-b64 <BASE64>` — HPKE public key bytes advertised by the relay (base64-encoded raw bytes)
* `--bandwidth-class <U8>` — Relative bandwidth class advertised by the relay



## `iroha app kaigi unregister-relay`

Retire a Kaigi relay descriptor and its retained health feedback

**Usage:** `iroha app kaigi unregister-relay --relay <ACCOUNT-ID>`

###### **Options:**

* `--relay <ACCOUNT-ID>` — Relay account identifier whose descriptor should be retired



## `iroha app kaigi set-relay-manifest`

Replace or clear the relay manifest for an existing Kaigi session

**Usage:** `iroha app kaigi set-relay-manifest [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--relay-manifest <PATH>` — Path to a JSON file describing the relay manifest
* `--clear` — Clear the stored relay manifest entirely



## `iroha app kaigi join`

Join a Kaigi session

**Usage:** `iroha app kaigi join [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME> --participant <ACCOUNT-ID>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--participant <ACCOUNT-ID>` — Participant account joining the call (canonical I105 account literal)
* `--commitment-hex <HEX>` — Commitment hash (hex) for privacy mode joins
* `--commitment-alias <COMMITMENT_ALIAS>` — Reserved on-chain alias tag; must be omitted to avoid ledger disclosure
* `--nullifier-hex <HEX>` — Nullifier hash (hex) preventing duplicate joins (privacy mode)
* `--nullifier-issued-at-ms <U64>` — Reserved on-chain timing field; must be omitted or zero
* `--roster-root-hex <HEX>` — Roster Merkle root bound into the proof transcript (privacy mode)
* `--proof-hex <HEX>` — Proof bytes attesting ownership (hex encoding of raw bytes)



## `iroha app kaigi leave`

Leave a Kaigi session

**Usage:** `iroha app kaigi leave [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME> --participant <ACCOUNT-ID>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--participant <ACCOUNT-ID>` — Participant account leaving the call (canonical I105 account literal)
* `--commitment-hex <HEX>` — Reserved privacy-leave commitment; must be omitted because privacy-mode leave is off-chain
* `--nullifier-hex <HEX>` — Reserved privacy-leave nullifier; must be omitted because privacy-mode leave is off-chain
* `--nullifier-issued-at-ms <U64>` — Reserved privacy-leave timing field; must be omitted
* `--roster-root-hex <HEX>` — Reserved privacy-leave roster root; must be omitted
* `--proof-hex <HEX>` — Reserved privacy-leave proof; must be omitted



## `iroha app kaigi end`

End an active Kaigi session

**Usage:** `iroha app kaigi end [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--ended-at-ms <U64>` — Optional end timestamp between call creation and the current block time
* `--commitment-hex <HEX>` — Commitment hash (hex) for privacy mode end requests
* `--commitment-alias <COMMITMENT_ALIAS>` — Reserved on-chain alias tag; must be omitted to avoid ledger disclosure
* `--nullifier-hex <HEX>` — Nullifier hash (hex) preventing proof replay (privacy mode)
* `--nullifier-issued-at-ms <U64>` — Reserved on-chain timing field; must be omitted or zero
* `--roster-root-hex <HEX>` — Roster Merkle root bound into the proof transcript (privacy mode)
* `--proof-hex <HEX>` — Proof bytes attesting ownership (hex encoding of raw bytes)



## `iroha app kaigi record-usage`

Record usage statistics for a Kaigi session

**Usage:** `iroha app kaigi record-usage [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME> --duration-ms <U64>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--duration-ms <U64>` — Duration in milliseconds for this usage segment
* `--billed-gas <U64>` — Gas billed for this segment

  Default value: `0`
* `--usage-commitment-hex <HEX>` — Optional usage commitment hash (privacy mode)
* `--proof-hex <HEX>` — Optional proof bytes attesting the usage delta (privacy mode)



## `iroha app kaigi report-relay-health`

Report the health status of a relay used by a Kaigi session

**Usage:** `iroha app kaigi report-relay-health [OPTIONS] --domain <DOMAIN-ID> --call-name <NAME> --relay <ACCOUNT-ID> --status <STATUS> --reported-at-ms <U64>`

###### **Options:**

* `--domain <DOMAIN-ID>` — Domain identifier hosting the call
* `--call-name <NAME>` — Call name within the domain
* `--relay <ACCOUNT-ID>` — Relay account identifier being reported (canonical I105 account literal)
* `--status <STATUS>` — Observed health status for the relay

  Possible values: `healthy`, `degraded`, `unavailable`

* `--reported-at-ms <U64>` — Observation timestamp in milliseconds, no later than the current block time
* `--notes <NOTES>` — Optional notes capturing failure or recovery context



## `iroha app sorafs`

SoraFS helpers (pin registry, aliases, replication orders, storage)

**Usage:** `iroha app sorafs <COMMAND>`

###### **Subcommands:**

* `pin` — Interact with the pin registry
* `alias` — List alias bindings
* `replication` — List replication orders
* `storage` — Storage token helpers
* `gateway` — Gateway policy and configuration helpers
* `incentives` — Offline helpers for relay payouts, disputes, and dashboards
* `handshake` — Observe or modify the Torii `SoraNet` handshake configuration
* `toolkit` — Local tooling for packaging manifests and payloads
* `guard-directory` — Guard directory helpers (fetch/verify snapshots)
* `reserve` — Reserve + rent policy helpers
* `appeals` — Appeal pricing and finance handoff helpers
* `gar` — GAR policy evidence helpers
* `transparency` — Transparency ledger readback and source-entry ingest helpers
* `moderation` — Moderation queue and quarantine workflow helpers
* `repair` — Repair queue helpers (list, claim, close, escalate)
* `billing` — Authenticated billing statement and reconciliation reads
* `hedging` — Authenticated finalized hedging projection reads
* `gc` — GC inspection helpers (no manual deletions)
* `fetch` — Orchestrate multi-provider chunk fetches via gateways



## `iroha app sorafs pin`

Interact with the pin registry

**Usage:** `iroha app sorafs pin <COMMAND>`

###### **Subcommands:**

* `list` — List manifests registered in the pin registry
* `show` — Fetch a single manifest, aliases, and replication orders
* `register` — Register a manifest in the pin registry via Torii



## `iroha app sorafs pin list`

List manifests registered in the pin registry

**Usage:** `iroha app sorafs pin list [OPTIONS]`

###### **Options:**

* `--status <STATUS>` — Optional closed lifecycle filter

  Possible values:
  - `pending`:
    Manifests awaiting governance approval
  - `approved`:
    Approved manifests charged for replication
  - `retired`:
    Retired manifests retained as lifecycle evidence

* `--limit <LIMIT>` — Maximum number of bounded summaries to return (1 through 256)
* `--max-bytes <MAX_BYTES>` — Maximum canonical encoded page bytes (1024 through 262144)
* `--after-digest-hex <HEX>` — Exact non-zero lowercase 32-byte exclusive manifest-digest cursor
* `--expected-finalized-height <EXPECTED_FINALIZED_HEIGHT>` — Non-zero finalized block height anchoring this page
* `--expected-finalized-block-hash-hex <HEX>` — Canonical lowercase finalized block hash anchoring this page



## `iroha app sorafs pin show`

Fetch a single manifest, aliases, and replication orders

**Usage:** `iroha app sorafs pin show --digest <HEX>`

###### **Options:**

* `--digest <HEX>` — Exact non-zero lowercase 32-byte manifest digest



## `iroha app sorafs pin register`

Register a manifest in the pin registry via Torii

**Usage:** `iroha app sorafs pin register [OPTIONS] --manifest <PATH>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded manifest (`.to`) file
* `--alias-namespace <ALIAS_NAMESPACE>` — Optional alias namespace to bind alongside the manifest
* `--alias-name <ALIAS_NAME>` — Optional alias name to bind alongside the manifest
* `--alias-proof <PATH>` — Optional path to the alias proof payload (binary)
* `--successor-of <HEX>` — Optional predecessor manifest digest (hex)



## `iroha app sorafs alias`

List alias bindings

**Usage:** `iroha app sorafs alias <COMMAND>`

###### **Subcommands:**

* `list` — List alias bindings exposed via Torii



## `iroha app sorafs alias list`

List alias bindings exposed via Torii

**Usage:** `iroha app sorafs alias list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of aliases to return
* `--offset <OFFSET>` — Offset for pagination
* `--namespace <NAMESPACE>` — Restrict aliases to an exact canonical lowercase namespace
* `--manifest-digest <HEX>` — Restrict aliases to an exact non-zero lowercase 32-byte manifest digest



## `iroha app sorafs replication`

List replication orders

**Usage:** `iroha app sorafs replication <COMMAND>`

###### **Subcommands:**

* `list` — List replication orders



## `iroha app sorafs replication list`

List replication orders

**Usage:** `iroha app sorafs replication list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of orders to return
* `--offset <OFFSET>` — Offset for pagination
* `--status <STATUS>` — Optional exact lifecycle filter

  Possible values:
  - `pending`:
    Orders still awaiting their required provider completions
  - `completed`:
    Orders whose required provider completions are committed
  - `cancelled`:
    Orders cancelled when their target pin was retired
  - `expired`:
    Incomplete orders expired after their inclusive deadline

* `--manifest-digest <HEX>` — Restrict orders to an exact non-zero lowercase 32-byte manifest digest



## `iroha app sorafs storage`

Storage token helpers

**Usage:** `iroha app sorafs storage <COMMAND>`

###### **Subcommands:**

* `token` — Issue and inspect stream tokens for chunk-range gateways



## `iroha app sorafs storage token`

Issue and inspect stream tokens for chunk-range gateways

**Usage:** `iroha app sorafs storage token <COMMAND>`

###### **Subcommands:**

* `issue` — Issue a stream token for a manifest/provider pair



## `iroha app sorafs storage token issue`

Issue a stream token for a manifest/provider pair

**Usage:** `iroha app sorafs storage token issue [OPTIONS] --manifest-id <HEX> --provider-id <HEX> --client-id <STRING>`

###### **Options:**

* `--manifest-id <HEX>` — Hex-encoded manifest identifier stored on the gateway
* `--provider-id <HEX>` — Hex-encoded provider identifier authorised to serve the manifest
* `--client-id <STRING>` — Logical client identifier used for quota accounting
* `--nonce <STRING>` — Optional nonce to send in the request headers (auto-generated when omitted)
* `--ttl-secs <SECONDS>` — Override the default TTL expressed in seconds
* `--max-streams <COUNT>` — Override the maximum concurrent stream count
* `--rate-limit-bytes <BYTES>` — Override the sustained throughput limit in bytes per second
* `--requests-per-minute <COUNT>` — Override the allowed number of refresh requests per minute



## `iroha app sorafs gateway`

Gateway policy and configuration helpers

**Usage:** `iroha app sorafs gateway <COMMAND>`

###### **Subcommands:**

* `template-config` — Emit a TOML snippet with gateway configuration defaults
* `generate-hosts` — Derive canonical/vanity hostnames for a provider
* `route-plan` — Render the headers + route binding plan for a manifest rollout
* `cache-invalidate` — Generate a cache invalidation payload and curl snippet for GAR/SoraFS gateways
* `direct-mode` — Direct-mode planning and configuration helpers



## `iroha app sorafs gateway template-config`

Emit a TOML snippet with gateway configuration defaults

**Usage:** `iroha app sorafs gateway template-config [OPTIONS]`

###### **Options:**

* `--host <HOSTNAME>` — Hostname to include in the ACME / gateway sample (repeatable)



## `iroha app sorafs gateway generate-hosts`

Derive canonical/vanity hostnames for a provider

**Usage:** `iroha app sorafs gateway generate-hosts [OPTIONS] --provider-id <HEX>`

###### **Options:**

* `--provider-id <HEX>` — Provider identifier (hex, 32 bytes)
* `--chain-id <CHAIN_ID>` — Chain id (network identifier)

  Default value: `nexus`



## `iroha app sorafs gateway route-plan`

Render the headers + route binding plan for a manifest rollout

**Usage:** `iroha app sorafs gateway route-plan [OPTIONS] --manifest-json <PATH> --hostname <HOSTNAME>`

###### **Options:**

* `--manifest-json <PATH>` — Manifest JSON path for the route being promoted
* `--hostname <HOSTNAME>` — Hostname that serves the manifest after promotion
* `--alias <NAMESPACE:NAME>` — Optional alias binding (`namespace:name`) to embed in the headers
* `--route-label <LABEL>` — Optional logical label applied to the rendered `Sora-Route-Binding`
* `--proof-status <STATUS>` — Optional proof-status string for the generated `Sora-Proof-Status`
* `--release-tag <STRING>` — Optional release tag stored alongside the plan
* `--cutover-window <WINDOW>` — Optional cutover window (RFC3339 interval or freeform note)
* `--out <PATH>` — Path where the JSON plan will be written

  Default value: `artifacts/sorafs_gateway/route_plan.json`
* `--headers-out <PATH>` — Optional path storing the primary header block
* `--rollback-manifest-json <PATH>` — Optional rollback manifest path (renders a secondary header block)
* `--rollback-headers-out <PATH>` — Optional path for the rollback header block
* `--rollback-route-label <LABEL>` — Optional label applied to the rollback binding
* `--rollback-release-tag <STRING>` — Optional release tag for the rollback binding metadata
* `--no-csp` — Skip emitting the default Content-Security-Policy header
* `--no-permissions-policy` — Skip emitting the default Permissions-Policy header
* `--no-hsts` — Skip emitting the default `Strict-Transport-Security` header



## `iroha app sorafs gateway cache-invalidate`

Generate a cache invalidation payload and curl snippet for GAR/SoraFS gateways

**Usage:** `iroha app sorafs gateway cache-invalidate [OPTIONS] --endpoint <URL> --alias <NAMESPACE:NAME> --manifest-digest <HEX>`

###### **Options:**

* `--endpoint <URL>` — Cache invalidation API endpoint (HTTP/S)
* `--alias <NAMESPACE:NAME>` — Alias bindings (`namespace:name`) that should be purged (repeatable)
* `--manifest-digest <HEX>` — Manifest digest (hex, 32 bytes) associated with the release
* `--car-digest <HEX>` — Optional CAR digest (hex, 32 bytes) to attach to the request
* `--release-tag <STRING>` — Optional release tag metadata included in the payload
* `--auth-env <ENV>` — Environment variable that stores the cache purge bearer token

  Default value: `CACHE_PURGE_TOKEN`
* `--output <PATH>` — Optional path where the JSON payload will be written



## `iroha app sorafs gateway direct-mode`

Direct-mode planning and configuration helpers

**Usage:** `iroha app sorafs gateway direct-mode <COMMAND>`

###### **Subcommands:**

* `plan` — Analyse manifest/admission data and emit a direct-mode readiness plan
* `enable` — Emit a configuration snippet enabling direct-mode overrides from a plan
* `rollback` — Emit a configuration snippet restoring default gateway security settings



## `iroha app sorafs gateway direct-mode plan`

Analyse manifest/admission data and emit a direct-mode readiness plan

**Usage:** `iroha app sorafs gateway direct-mode plan [OPTIONS] --manifest <PATH>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded manifest (`.to`) file to analyse
* `--admission-envelope <PATH>` — Optional provider admission envelope (`.to`) for capability detection
* `--provider-id <HEX>` — Override provider identifier (hex) when no admission envelope is supplied
* `--chain-id <CHAIN_ID>` — Override chain id (defaults to the CLI configuration chain id)
* `--scheme <SCHEME>` — URL scheme to use for generated direct-CAR endpoints (default: https)

  Default value: `https`



## `iroha app sorafs gateway direct-mode enable`

Emit a configuration snippet enabling direct-mode overrides from a plan

**Usage:** `iroha app sorafs gateway direct-mode enable --plan <PATH>`

###### **Options:**

* `--plan <PATH>` — Path to the JSON output produced by `sorafs gateway direct-mode plan`



## `iroha app sorafs gateway direct-mode rollback`

Emit a configuration snippet restoring default gateway security settings

**Usage:** `iroha app sorafs gateway direct-mode rollback`



## `iroha app sorafs incentives`

Offline helpers for relay payouts, disputes, and dashboards

**Usage:** `iroha app sorafs incentives <COMMAND>`

###### **Subcommands:**

* `compute` — Compute a relay reward instruction from metrics and bond state
* `open-dispute` — Open a dispute against an existing reward instruction
* `dashboard` — Summarise reward instructions into an earnings dashboard
* `service` — Manage the persistent treasury payout state and disputes



## `iroha app sorafs incentives compute`

Compute a relay reward instruction from metrics and bond state

**Usage:** `iroha app sorafs incentives compute [OPTIONS] --config <PATH> --metrics <PATH> --bond <PATH> --beneficiary <ACCOUNT_ID>`

###### **Options:**

* `--config <PATH>` — Path to the reward configuration JSON
* `--metrics <PATH>` — Norito-encoded relay metrics (`RelayEpochMetricsV1`)
* `--bond <PATH>` — Norito-encoded bond ledger entry (`RelayBondLedgerEntryV1`)
* `--beneficiary <ACCOUNT_ID>` — Account ID that will receive the payout
* `--norito-out <PATH>` — Optional path where the Norito-encoded reward instruction will be written
* `--pretty` — Emit pretty-printed JSON.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives open-dispute`

Open a dispute against an existing reward instruction

**Usage:** `iroha app sorafs incentives open-dispute [OPTIONS] --instruction <PATH> --treasury-account <ACCOUNT_ID> --submitted-by <ACCOUNT_ID> --requested-amount <QUANTITY> --reason <TEXT>`

###### **Options:**

* `--instruction <PATH>` — Norito-encoded reward instruction (`RelayRewardInstructionV1`)
* `--treasury-account <ACCOUNT_ID>` — Treasury account initiating the dispute
* `--submitted-by <ACCOUNT_ID>` — Account ID submitting the dispute
* `--requested-amount <QUANTITY>` — Requested adjustment quantity
* `--reason <TEXT>` — Reason provided by the operator
* `--submitted-at <SECONDS>` — Optional UNIX timestamp when the dispute is filed
* `--norito-out <PATH>` — Optional path where the Norito-encoded dispute will be written
* `--pretty` — Emit pretty-printed JSON.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives dashboard`

Summarise reward instructions into an earnings dashboard

**Usage:** `iroha app sorafs incentives dashboard --instruction <PATH>...`

###### **Options:**

* `--instruction <PATH>` — Reward instruction payloads to include in the dashboard



## `iroha app sorafs incentives service`

Manage the persistent treasury payout state and disputes

**Usage:** `iroha app sorafs incentives service <COMMAND>`

###### **Subcommands:**

* `init` — Initialise a new payout ledger state file
* `process` — Evaluate metrics, record the payout, and persist the updated state
* `record` — Record an externally prepared reward instruction into the state
* `dispute` — Manage payout disputes recorded in the state
* `dashboard` — Render an earnings dashboard sourced from the persisted ledger
* `audit` — Audit bond/payout governance readiness for relay incentives
* `shadow-run` — Run a shadow simulation across relay metrics and summarise fairness
* `reconcile` — Reconcile recorded payouts against XOR ledger exports
* `daemon` — Run the treasury daemon against a metrics spool



## `iroha app sorafs incentives service init`

Initialise a new payout ledger state file

**Usage:** `iroha app sorafs incentives service init [OPTIONS] --state <PATH> --config <PATH> --treasury-account <ACCOUNT_ID>`

###### **Options:**

* `--state <PATH>` — Path where the incentives state JSON will be stored
* `--config <PATH>` — Reward configuration JSON consumed by the payout engine
* `--treasury-account <ACCOUNT_ID>` — Treasury account debited when materialising payouts
* `--force` — Overwrite an existing state file if it already exists

  Default value: `false`



## `iroha app sorafs incentives service process`

Evaluate metrics, record the payout, and persist the updated state

**Usage:** `iroha app sorafs incentives service process [OPTIONS] --state <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--metrics <PATH>` — Norito-encoded relay metrics (`RelayEpochMetricsV1`)
* `--bond <PATH>` — Norito-encoded bond ledger entry (`RelayBondLedgerEntryV1`)
* `--beneficiary <ACCOUNT_ID>` — Beneficiary account that receives the payout
* `--instruction-out <PATH>` — Write the Norito-encoded reward instruction to this path
* `--transfer-out <PATH>` — Write the Norito-encoded transfer instruction to this path
* `--submit-transfer` — Submit the resulting transfer to Torii after recording the payout

  Default value: `false`
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service record`

Record an externally prepared reward instruction into the state

**Usage:** `iroha app sorafs incentives service record [OPTIONS] --state <PATH> --instruction <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--instruction <PATH>` — Norito-encoded reward instruction to record
* `--transfer-out <PATH>` — Write the Norito-encoded transfer instruction to this path if non-zero
* `--submit-transfer` — Submit the transfer to Torii after recording the payout

  Default value: `false`
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service dispute`

Manage payout disputes recorded in the state

**Usage:** `iroha app sorafs incentives service dispute <COMMAND>`

###### **Subcommands:**

* `file` — File a new dispute against a recorded payout
* `resolve` — Resolve a dispute with the supplied outcome
* `reject` — Reject a dispute without altering the ledger



## `iroha app sorafs incentives service dispute file`

File a new dispute against a recorded payout

**Usage:** `iroha app sorafs incentives service dispute file [OPTIONS] --state <PATH> --relay-id <HEX> --epoch <EPOCH> --submitted-by <ACCOUNT_ID> --requested-amount <QUANTITY> --reason <TEXT>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--relay-id <HEX>` — Hex-encoded relay identifier (32 bytes, 64 hex chars)
* `--epoch <EPOCH>` — Epoch number associated with the disputed payout
* `--submitted-by <ACCOUNT_ID>` — Account ID submitting the dispute
* `--requested-amount <QUANTITY>` — Requested payout quantity
* `--reason <TEXT>` — Free-form reason describing the dispute
* `--filed-at <SECONDS>` — Optional UNIX timestamp indicating when the dispute was filed (defaults to now)
* `--adjust-credit <QUANTITY>` — Credit adjustment requested by the operator
* `--adjust-debit <QUANTITY>` — Debit adjustment requested by the operator
* `--norito-out <PATH>` — Write the Norito-encoded dispute payload to this path
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service dispute resolve`

Resolve a dispute with the supplied outcome

**Usage:** `iroha app sorafs incentives service dispute resolve [OPTIONS] --state <PATH> --dispute-id <ID> --resolution <RESOLUTION> --notes <TEXT>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--dispute-id <ID>` — Dispute identifier to resolve
* `--resolution <RESOLUTION>` — Resolution kind (`no-change`, `credit`, or `debit`)

  Possible values: `no-change`, `credit`, `debit`

* `--amount <QUANTITY>` — Amount applied when resolving with `credit` or `debit`
* `--notes <TEXT>` — Resolution notes recorded in the dispute metadata
* `--resolved-at <SECONDS>` — Optional UNIX timestamp when the dispute was resolved (defaults to now)
* `--transfer-out <PATH>` — Write the Norito-encoded transfer instruction generated by the resolution (if any)
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service dispute reject`

Reject a dispute without altering the ledger

**Usage:** `iroha app sorafs incentives service dispute reject [OPTIONS] --state <PATH> --dispute-id <ID> --notes <TEXT>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--dispute-id <ID>` — Dispute identifier to reject
* `--notes <TEXT>` — Rejection notes captured in the dispute metadata
* `--rejected-at <SECONDS>` — Optional UNIX timestamp when the dispute was rejected (defaults to now)
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service dashboard`

Render an earnings dashboard sourced from the persisted ledger

**Usage:** `iroha app sorafs incentives service dashboard --state <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON



## `iroha app sorafs incentives service audit`

Audit bond/payout governance readiness for relay incentives

**Usage:** `iroha app sorafs incentives service audit [OPTIONS] --state <PATH> --config <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--config <PATH>` — Daemon configuration describing relay beneficiaries and bond sources
* `--scope <SCOPES>` — Audit scopes to evaluate (repeat to combine); defaults to bond checks

  Default value: `bond`

  Possible values: `bond`, `budget`, `all`

* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service shadow-run`

Run a shadow simulation across relay metrics and summarise fairness

**Usage:** `iroha app sorafs incentives service shadow-run [OPTIONS] --state <PATH> --config <PATH> --metrics-dir <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--config <PATH>` — Shadow simulation configuration mapping relays to beneficiaries and bonds
* `--metrics-dir <PATH>` — Directory containing Norito-encoded relay metrics snapshots (`relay-<id>-epoch-<n>.to`)
* `--report-out <PATH>` — Optional path to write the shadow simulation report JSON
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service reconcile`

Reconcile recorded payouts against XOR ledger exports

**Usage:** `iroha app sorafs incentives service reconcile [OPTIONS] --state <PATH> --ledger-export <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--ledger-export <PATH>` — Norito-encoded XOR ledger export to reconcile against
* `--pretty` — Emit pretty JSON instead of a compact payload.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs incentives service daemon`

Run the treasury daemon against a metrics spool

**Usage:** `iroha app sorafs incentives service daemon [OPTIONS] --state <PATH> --config <PATH> --metrics-dir <PATH>`

###### **Options:**

* `--state <PATH>` — Path to the persisted incentives state JSON
* `--config <PATH>` — Daemon configuration describing relay beneficiaries and bond sources
* `--metrics-dir <PATH>` — Directory containing Norito-encoded relay metrics snapshots
* `--instruction-out-dir <PATH>` — Directory where reward instructions will be written
* `--transfer-out-dir <PATH>` — Directory where transfer instructions will be written
* `--archive-dir <PATH>` — Directory where processed metrics snapshots will be archived
* `--poll-interval <SECONDS>` — Poll interval (seconds) when running continuously

  Default value: `30`
* `--once` — Process the spool once and exit (do not watch for changes)

  Default value: `false`
* `--pretty` — Emit JSON summaries instead of plain-text logs.

   Ignored when `--output-format json` is used.

  Default value: `false`



## `iroha app sorafs handshake`

Observe or modify the Torii `SoraNet` handshake configuration

**Usage:** `iroha app sorafs handshake <COMMAND>`

###### **Subcommands:**

* `show` — Display the current `SoraNet` handshake summary as reported by Torii
* `update` — Update one or more `SoraNet` handshake parameters via `/v1/config`
* `token` — Admission token helpers (issuance, fingerprinting, revocation digests)



## `iroha app sorafs handshake show`

Display the current `SoraNet` handshake summary as reported by Torii

**Usage:** `iroha app sorafs handshake show`



## `iroha app sorafs handshake update`

Update one or more `SoraNet` handshake parameters via `/v1/config`

**Usage:** `iroha app sorafs handshake update [OPTIONS]`

###### **Options:**

* `--descriptor-commit <HEX>` — Override the descriptor commitment advertised during handshake (hex)
* `--client-capabilities <HEX>` — Override the client capability TLV vector (hex)
* `--relay-capabilities <HEX>` — Override the relay capability TLV vector (hex)
* `--kem-id <KEM_ID>` — Override the negotiated ML-KEM identifier
* `--sig-id <SIG_ID>` — Override the negotiated signature suite identifier
* `--resume-hash <HEX>` — Override the resume hash advertised to peers (64 hex chars)
* `--clear-resume-hash` — Clear the configured resume hash
* `--pow-difficulty <POW_DIFFICULTY>` — Override the proof-of-work difficulty
* `--pow-max-future-skew <POW_MAX_FUTURE_SKEW>` — Override the maximum clock skew accepted on `PoW` tickets (seconds)
* `--pow-min-ttl <POW_MIN_TTL>` — Override the minimum `PoW` ticket TTL (seconds)
* `--pow-ttl <POW_TTL>` — Override the `PoW` ticket TTL (seconds)
* `--pow-puzzle-memory <POW_PUZZLE_MEMORY>` — Override the puzzle memory cost (KiB)
* `--pow-puzzle-time <POW_PUZZLE_TIME>` — Override the puzzle time cost (iterations)
* `--pow-puzzle-lanes <POW_PUZZLE_LANES>` — Override the puzzle parallelism (lanes)
* `--require-sm-handshake-match` — Require peers to match SM helper availability
* `--require-sm-openssl-preview-match` — Require peers to match the OpenSSL preview flag



## `iroha app sorafs handshake token`

Admission token helpers (issuance, fingerprinting, revocation digests)

**Usage:** `iroha app sorafs handshake token <COMMAND>`

###### **Subcommands:**

* `issue` — Issue an ML-DSA admission token bound to a relay and transcript hash
* `id` — Compute the canonical revocation identifier for an admission token
* `fingerprint` — Compute the issuer fingerprint from an ML-DSA public key



## `iroha app sorafs handshake token issue`

Issue an ML-DSA admission token bound to a relay and transcript hash

**Usage:** `iroha app sorafs handshake token issue [OPTIONS] --issuer-secret-key <PATH> --relay-id <HEX> --transcript-hash <HEX> --output <PATH>`

###### **Options:**

* `--suite <SUITE>` — ML-DSA suite used to sign the token (mldsa44, mldsa65, mldsa87)

  Default value: `mldsa44`

  Possible values: `mldsa44`, `mldsa65`, `mldsa87`

* `--issuer-secret-key <PATH>` — Path to the issuer ML-DSA secret key (raw bytes).

   The file must be owner-private, single-link, and opened without following symbolic links. Secret key bytes are never accepted directly on argv.
* `--issuer-public-key <PATH>` — Path to the issuer ML-DSA public key (raw bytes)
* `--issuer-public-hex <HEX>` — Hex-encoded issuer ML-DSA public key
* `--relay-id <HEX>` — Hex-encoded 32-byte relay identifier bound into the token
* `--transcript-hash <HEX>` — Hex-encoded 32-byte transcript hash bound into the token
* `--issued-at <RFC3339>` — RFC3339 issuance timestamp (defaults to current UTC time)
* `--expires-at <RFC3339>` — RFC3339 expiry timestamp
* `--ttl <SECONDS>` — Token lifetime in seconds (defaults to 600s when --expires-at is omitted)
* `--flags <FLAGS>` — Token flags (reserved; must be 0 for v1 tokens)
* `--output <PATH>` — New path to write the encoded token as an owner-private file.

   Existing paths are never overwritten, and the bearer token is not printed to standard output.
* `--token-encoding <TOKEN_ENCODING>` — Encoding used when writing the token to --output (base64, hex, binary)

  Default value: `base64`

  Possible values: `base64`, `hex`, `binary`




## `iroha app sorafs handshake token id`

Compute the canonical revocation identifier for an admission token

**Usage:** `iroha app sorafs handshake token id --token <PATH>`

###### **Options:**

* `--token <PATH>` — Path to the admission token frame (binary).

   The bearer token must be supplied through an owner-private, single-link file and is never accepted directly on argv.



## `iroha app sorafs handshake token fingerprint`

Compute the issuer fingerprint from an ML-DSA public key

**Usage:** `iroha app sorafs handshake token fingerprint [OPTIONS]`

###### **Options:**

* `--public-key <PATH>` — Path to the ML-DSA public key (raw bytes)
* `--public-key-hex <HEX>` — Hex-encoded ML-DSA public key



## `iroha app sorafs toolkit`

Local tooling for packaging manifests and payloads

**Usage:** `iroha app sorafs toolkit <COMMAND>`

###### **Subcommands:**

* `pack` — Package a payload into a CAR + manifest bundle using the canonical tooling



## `iroha app sorafs toolkit pack`

Package a payload into a CAR + manifest bundle using the canonical tooling

**Usage:** `iroha app sorafs toolkit pack [OPTIONS] <INPUT>`

###### **Arguments:**

* `<INPUT>` — Payload path (file or directory) to package into a CAR archive

###### **Options:**

* `--manifest-out <PATH>` — Path to write the Norito manifest (`.to`). If omitted, no manifest file is emitted
* `--car-out <PATH>` — Path to write the CAR archive
* `--json-out <PATH>` — Path to write the JSON report (defaults to stdout)
* `--hybrid-envelope-out <PATH>` — Path to write the hybrid payload envelope (binary)
* `--hybrid-envelope-json-out <PATH>` — Path to write the hybrid payload envelope (JSON)
* `--hybrid-recipient-x25519 <HEX>` — Hex-encoded X25519 public key used for hybrid envelope encryption
* `--hybrid-recipient-kyber <HEX>` — Hex-encoded Kyber public key used for hybrid envelope encryption



## `iroha app sorafs guard-directory`

Guard directory helpers (fetch/verify snapshots)

**Usage:** `iroha app sorafs guard-directory <COMMAND>`

###### **Subcommands:**

* `fetch` — Fetch a guard directory snapshot over HTTPS, verify it, and emit a summary
* `verify` — Authenticate a guard directory snapshot stored on disk
* `inspect` — Inspect snapshot structure without claiming authenticity or freshness



## `iroha app sorafs guard-directory fetch`

Fetch a guard directory snapshot over HTTPS, verify it, and emit a summary

**Usage:** `iroha app sorafs guard-directory fetch [OPTIONS] --url <URL> --expected-snapshot-digest <HEX>`

###### **Options:**

* `--url <URL>` — URLs publishing the guard directory snapshot (first success wins)
* `--output <PATH>` — Path where the verified snapshot will be stored (optional)
* `--expected-snapshot-digest <HEX>` — Trusted domain-separated BLAKE3 digest of the exact snapshot bytes
* `--timeout-secs <SECS>` — HTTP timeout in seconds (defaults to 30s)

  Default value: `30`
* `--overwrite` — Allow overwriting an existing file at --output



## `iroha app sorafs guard-directory verify`

Authenticate a guard directory snapshot stored on disk

**Usage:** `iroha app sorafs guard-directory verify --path <PATH> --expected-snapshot-digest <HEX>`

###### **Options:**

* `--path <PATH>` — Path to the guard directory snapshot to verify
* `--expected-snapshot-digest <HEX>` — Trusted domain-separated BLAKE3 digest of the exact snapshot bytes



## `iroha app sorafs guard-directory inspect`

Inspect snapshot structure without claiming authenticity or freshness

**Usage:** `iroha app sorafs guard-directory inspect --path <PATH>`

###### **Options:**

* `--path <PATH>` — Path to the guard directory snapshot to inspect



## `iroha app sorafs reserve`

Reserve + rent policy helpers

**Usage:** `iroha app sorafs reserve <COMMAND>`

###### **Subcommands:**

* `quote` — Quote reserve requirements and effective rent for a given tier/capacity
* `ledger` — Convert a reserve quote into rent/reserve transfer instructions
* `lifecycle` — Project reserve lifecycle stage and automatic credit draw state



## `iroha app sorafs reserve quote`

Quote reserve requirements and effective rent for a given tier/capacity

**Usage:** `iroha app sorafs reserve quote [OPTIONS] --storage-class <STORAGE_CLASS> --tier <TIER> --gib <GIB>`

###### **Options:**

* `--storage-class <STORAGE_CLASS>` — Storage class targeted by the commitment (hot, warm, cold)

  Possible values: `hot`, `warm`, `cold`

* `--tier <TIER>` — Provider tier (tier-a, tier-b, tier-c)

  Possible values: `tier-a`, `tier-b`, `tier-c`

* `--duration <DURATION>` — Commitment duration (`monthly`, `quarterly`, `annual`)

  Default value: `monthly`

  Possible values: `monthly`, `quarterly`, `annual`

* `--gib <GIB>` — Logical GiB covered by the quote
* `--reserve-balance <XOR>` — Canonical XOR reserve balance applied while computing effective rent (up to 9 fractional digits)

  Default value: `0`
* `--policy-json <PATH>` — Optional path to a JSON-encoded reserve policy (`ReservePolicyV1`)
* `--policy-norito <PATH>` — Optional path to a Norito-encoded reserve policy (`ReservePolicyV1`)
* `--quote-out <PATH>` — Optional path for persisting the rendered quote JSON



## `iroha app sorafs reserve ledger`

Convert a reserve quote into rent/reserve transfer instructions

**Usage:** `iroha app sorafs reserve ledger --quote <PATH> --provider-account <ACCOUNT_ID> --treasury-account <ACCOUNT_ID> --reserve-account <ACCOUNT_ID> --asset-definition <AID>`

###### **Options:**

* `--quote <PATH>` — Path to the reserve quote JSON (output of `sorafs reserve quote`)
* `--provider-account <ACCOUNT_ID>` — Provider account paying the rent and reserve top-ups
* `--treasury-account <ACCOUNT_ID>` — Treasury account receiving the rent payment
* `--reserve-account <ACCOUNT_ID>` — Reserve escrow account receiving the reserve top-up
* `--asset-definition <AID>` — Asset definition identifier used for transfers (canonical unprefixed Base58 address)



## `iroha app sorafs reserve lifecycle`

Project reserve lifecycle stage and automatic credit draw state

**Usage:** `iroha app sorafs reserve lifecycle [OPTIONS] --quote <PATH>`

###### **Options:**

* `--quote <PATH>` — Path to the reserve quote JSON (output of `sorafs reserve quote`)
* `--days-past-due <DAYS>` — Days since rent became due

  Default value: `0`
* `--grace-days <DAYS>` — Grace window before delinquency

  Default value: `7`
* `--default-after-days <DAYS>` — Default threshold after the due date

  Default value: `30`



## `iroha app sorafs appeals`

Appeal pricing and finance handoff helpers

**Usage:** `iroha app sorafs appeals <COMMAND>`

###### **Subcommands:**

* `pricing` — Appeal pricing helpers
* `finance` — Appeal finance helpers



## `iroha app sorafs appeals pricing`

Appeal pricing helpers

**Usage:** `iroha app sorafs appeals pricing <COMMAND>`

###### **Subcommands:**

* `config` — Print the active local appeal pricing config
* `status` — Print appeal pricing status and supported classes
* `quote` — Quote a deposit from a Torii pricing quote JSON payload



## `iroha app sorafs appeals pricing config`

Print the active local appeal pricing config

**Usage:** `iroha app sorafs appeals pricing config`



## `iroha app sorafs appeals pricing status`

Print appeal pricing status and supported classes

**Usage:** `iroha app sorafs appeals pricing status`



## `iroha app sorafs appeals pricing quote`

Quote a deposit from a Torii pricing quote JSON payload

**Usage:** `iroha app sorafs appeals pricing quote --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON quote request payload path



## `iroha app sorafs appeals finance`

Appeal finance helpers

**Usage:** `iroha app sorafs appeals finance <COMMAND>`

###### **Subcommands:**

* `deposits` — Runtime asset-lock deposit helpers
* `reports` — List published appeal finance reports
* `weekly-rollups` — List published weekly appeal finance rollups
* `settlement-receipts` — List published appeal finance settlement receipts



## `iroha app sorafs appeals finance deposits`

Runtime asset-lock deposit helpers

**Usage:** `iroha app sorafs appeals finance deposits <COMMAND>`

###### **Subcommands:**

* `create` — Build a runtime asset-lock deposit transaction request
* `confirm` — Confirm a runtime asset-lock deposit after ledger submission
* `get` — Fetch one visible appeal deposit status
* `settle` — Settle a confirmed deposit locally
* `reconcile` — Reconcile a confirmed deposit against runtime ledger state
* `submit-settlement` — Submit the next settlement transaction step



## `iroha app sorafs appeals finance deposits create`

Build a runtime asset-lock deposit transaction request

**Usage:** `iroha app sorafs appeals finance deposits create --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON deposit request payload path



## `iroha app sorafs appeals finance deposits confirm`

Confirm a runtime asset-lock deposit after ledger submission

**Usage:** `iroha app sorafs appeals finance deposits confirm --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON deposit confirmation payload path



## `iroha app sorafs appeals finance deposits get`

Fetch one visible appeal deposit status

**Usage:** `iroha app sorafs appeals finance deposits get --escrow-id <HEX>`

###### **Options:**

* `--escrow-id <HEX>` — Hex-encoded asset-lock escrow id



## `iroha app sorafs appeals finance deposits settle`

Settle a confirmed deposit locally

**Usage:** `iroha app sorafs appeals finance deposits settle --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON deposit settlement payload path



## `iroha app sorafs appeals finance deposits reconcile`

Reconcile a confirmed deposit against runtime ledger state

**Usage:** `iroha app sorafs appeals finance deposits reconcile --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON deposit settlement reconciliation payload path



## `iroha app sorafs appeals finance deposits submit-settlement`

Submit the next settlement transaction step

**Usage:** `iroha app sorafs appeals finance deposits submit-settlement --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON deposit settlement submission payload path



## `iroha app sorafs appeals finance reports`

List published appeal finance reports

**Usage:** `iroha app sorafs appeals finance reports [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of report entries to return



## `iroha app sorafs appeals finance weekly-rollups`

List published weekly appeal finance rollups

**Usage:** `iroha app sorafs appeals finance weekly-rollups [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of rollup entries to return



## `iroha app sorafs appeals finance settlement-receipts`

List published appeal finance settlement receipts

**Usage:** `iroha app sorafs appeals finance settlement-receipts [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of settlement receipt entries to return



## `iroha app sorafs gar`

GAR policy evidence helpers

**Usage:** `iroha app sorafs gar <COMMAND>`

###### **Subcommands:**

* `receipt` — Render a GAR enforcement receipt artefact (JSON + optional Norito bytes)



## `iroha app sorafs gar receipt`

Render a GAR enforcement receipt artefact (JSON + optional Norito bytes)

**Usage:** `iroha app sorafs gar receipt [OPTIONS] --gar-name <LABEL> --canonical-host <HOST> --operator <ACCOUNT_ID> --reason <TEXT>`

###### **Options:**

* `--gar-name <LABEL>` — Registered GAR name (`SoraDNS` label, e.g., `docs.sora`)
* `--canonical-host <HOST>` — Canonical host affected by the enforcement action
* `--action <ACTION>` — Enforcement action recorded in the receipt

  Default value: `audit-notice`

  Possible values: `purge-static-zone`, `cache-bypass`, `ttl-override`, `rate-limit-override`, `geo-fence`, `legal-hold`, `moderation`, `audit-notice`, `custom`

* `--custom-action-slug <SLUG>` — Slug recorded when `--action custom` is selected
* `--receipt-id <HEX16>` — Optional receipt identifier (32 hex chars / 16 bytes). Defaults to a random ULID-like value
* `--triggered-at <RFC3339|@UNIX>` — Override the triggered timestamp (RFC3339 or `@unix_seconds`). Defaults to `now`
* `--expires-at <RFC3339|@UNIX>` — Optional expiry timestamp (RFC3339 or `@unix_seconds`)
* `--policy-version <STRING>` — Policy version label recorded in the receipt
* `--policy-digest <HEX32>` — Policy digest (64 hex chars / 32 bytes) referenced by the receipt
* `--operator <ACCOUNT_ID>` — Operator account that executed the action
* `--reason <TEXT>` — Human-readable reason for the enforcement action
* `--notes <TEXT>` — Optional notes captured for auditors
* `--evidence-uri <URI>` — Evidence URIs (repeatable) recorded with the receipt
* `--label <TAG>` — Machine-readable labels (repeatable) applied to the receipt
* `--json-out <PATH>` — Path for persisting the JSON artefact (pretty-printed)
* `--norito-out <PATH>` — Path for persisting the Norito-encoded receipt (`.to` bytes)



## `iroha app sorafs transparency`

Transparency ledger readback and source-entry ingest helpers

**Usage:** `iroha app sorafs transparency <COMMAND>`

###### **Subcommands:**

* `cycles` — Inspect published transparency cycles and entry proofs
* `explorer` — Fetch the explorer-ready transparency snapshot
* `explorer-canary` — Probe deployed transparency explorer routes and emit payload-free rollout evidence
* `publication-canary` — Probe deployed transparency publication readback and emit payload-free evidence
* `tokens` — List published proof-token issuance summaries
* `token-issuance` — Submit proof-token issuance feed payloads and rollout canaries
* `privacy-aggregate` — Submit privacy aggregate source events and trigger configured due publication



## `iroha app sorafs transparency cycles`

Inspect published transparency cycles and entry proofs

**Usage:** `iroha app sorafs transparency cycles <COMMAND>`

###### **Subcommands:**

* `list` — List locally published transparency cycle summaries
* `get` — Fetch and verify one published transparency cycle
* `entry` — Fetch and verify one published transparency entry proof



## `iroha app sorafs transparency cycles list`

List locally published transparency cycle summaries

**Usage:** `iroha app sorafs transparency cycles list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of cycle summaries to return



## `iroha app sorafs transparency cycles get`

Fetch and verify one published transparency cycle

**Usage:** `iroha app sorafs transparency cycles get [OPTIONS] --cycle-id <HEX>`

###### **Options:**

* `--cycle-id <HEX>` — 16-byte cycle id encoded as hexadecimal
* `--limit <LIMIT>` — Maximum number of publication proofs to return



## `iroha app sorafs transparency cycles entry`

Fetch and verify one published transparency entry proof

**Usage:** `iroha app sorafs transparency cycles entry --cycle-id <HEX> --entry-id <HEX>`

###### **Options:**

* `--cycle-id <HEX>` — 16-byte cycle id encoded as hexadecimal
* `--entry-id <HEX>` — 16-byte entry id encoded as hexadecimal



## `iroha app sorafs transparency explorer`

Fetch the explorer-ready transparency snapshot

**Usage:** `iroha app sorafs transparency explorer [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of cycle summaries and token issuance entries per array



## `iroha app sorafs transparency explorer-canary`

Probe deployed transparency explorer routes and emit payload-free rollout evidence

**Usage:** `iroha app sorafs transparency explorer-canary [OPTIONS]`

###### **Options:**

* `--torii-url <URL>` — Base URL of the deployed Torii or public explorer gateway
* `--limit <LIMIT>` — Maximum number of cycle and proof-token summaries to request
* `--timeout-secs <TIMEOUT_SECS>` — HTTP timeout in seconds

  Default value: `30`
* `--out <PATH>` — Optional path where the canary evidence JSON will be written



## `iroha app sorafs transparency publication-canary`

Probe deployed transparency publication readback and emit payload-free evidence

**Usage:** `iroha app sorafs transparency publication-canary [OPTIONS]`

###### **Options:**

* `--torii-url <URL>` — Base URL of the deployed Torii or public transparency gateway
* `--cycle-id <HEX>` — Published cycle id to verify through the cycle detail route
* `--limit <LIMIT>` — Maximum number of cycle summaries or publication proofs to request
* `--timeout-secs <TIMEOUT_SECS>` — HTTP timeout in seconds

  Default value: `30`
* `--out <PATH>` — Optional path where the canary evidence JSON will be written



## `iroha app sorafs transparency tokens`

List published proof-token issuance summaries

**Usage:** `iroha app sorafs transparency tokens [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of proof-token issuance entries to return



## `iroha app sorafs transparency token-issuance`

Submit proof-token issuance feed payloads and rollout canaries

**Usage:** `iroha app sorafs transparency token-issuance <COMMAND>`

###### **Subcommands:**

* `submit` — Submit one proof-token issuance JSON payload
* `canary` — Probe deployed proof-token issuance producer feed routes



## `iroha app sorafs transparency token-issuance submit`

Submit one proof-token issuance JSON payload

**Usage:** `iroha app sorafs transparency token-issuance submit --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — JSON proof-token issuance payload path



## `iroha app sorafs transparency token-issuance canary`

Probe deployed proof-token issuance producer feed routes

**Usage:** `iroha app sorafs transparency token-issuance canary [OPTIONS]`

###### **Options:**

* `--issuance <PATH>` — Proof-token issuance JSON payload path to submit
* `--out <PATH>` — Optional path where payload-free canary evidence JSON is written



## `iroha app sorafs transparency privacy-aggregate`

Submit privacy aggregate source events and trigger configured due publication

**Usage:** `iroha app sorafs transparency privacy-aggregate <COMMAND>`

###### **Subcommands:**

* `source-event` — Submit one privacy aggregate source-event JSON payload
* `publish-due` — Trigger configured due privacy aggregate publication
* `canary` — Probe deployed privacy aggregate producer/scheduler routes



## `iroha app sorafs transparency privacy-aggregate source-event`

Submit one privacy aggregate source-event JSON payload

**Usage:** `iroha app sorafs transparency privacy-aggregate source-event --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — JSON payload path



## `iroha app sorafs transparency privacy-aggregate publish-due`

Trigger configured due privacy aggregate publication

**Usage:** `iroha app sorafs transparency privacy-aggregate publish-due --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — JSON payload path



## `iroha app sorafs transparency privacy-aggregate canary`

Probe deployed privacy aggregate producer/scheduler routes

**Usage:** `iroha app sorafs transparency privacy-aggregate canary [OPTIONS]`

###### **Options:**

* `--source-event <PATH>` — Privacy aggregate source-event JSON payload path to submit
* `--publish-due <PATH>` — Privacy aggregate publish-due JSON payload path to submit
* `--out <PATH>` — Optional path where payload-free canary evidence JSON is written



## `iroha app sorafs moderation`

Moderation queue and quarantine workflow helpers

**Usage:** `iroha app sorafs moderation <COMMAND>`

###### **Subcommands:**

* `ballots` — Inspect finalized moderation cases and submit native ledger actions
* `registry` — Admit and inspect local moderation model registry records
* `screening` — Submit and inspect deterministic local moderation screening results
* `quarantine` — Inspect and advance local moderation quarantine records



## `iroha app sorafs moderation ballots`

Inspect finalized moderation cases and submit native ledger actions

**Usage:** `iroha app sorafs moderation ballots <COMMAND>`

###### **Subcommands:**

* `list` — List finalized chain-authoritative moderation case projections
* `get` — Get one finalized chain-authoritative moderation case projection
* `no-show-plan` — Get the payload-free no-show plan for one closed moderation ballot
* `events` — List typed committed moderation events
* `commit` — Submit a juror commit as an exact caller-signed native transaction
* `reveal` — Submit a juror reveal as an exact caller-signed native transaction
* `tally` — Submit governed native moderation finalization
* `execute` — Execute pending commit/reveal/tally actions from a coordination status
* `executor-bundle` — Generate supervised commit/reveal executor deployment artifacts
* `executor-canary` — Verify a deployed commit/reveal executor bundle and captured run summary



## `iroha app sorafs moderation ballots list`

List finalized chain-authoritative moderation case projections

**Usage:** `iroha app sorafs moderation ballots list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of ballots, commits, and reveals to return



## `iroha app sorafs moderation ballots get`

Get one finalized chain-authoritative moderation case projection

**Usage:** `iroha app sorafs moderation ballots get [OPTIONS] --case-id <TEXT> --round-id <TEXT>`

###### **Options:**

* `--case-id <TEXT>` — Moderation or appeal case identifier
* `--round-id <TEXT>` — Moderation ballot round identifier
* `--limit <LIMIT>` — Maximum number of commits and reveals to return



## `iroha app sorafs moderation ballots no-show-plan`

Get the payload-free no-show plan for one closed moderation ballot

**Usage:** `iroha app sorafs moderation ballots no-show-plan --case-id <TEXT> --round-id <TEXT>`

###### **Options:**

* `--case-id <TEXT>` — Moderation or appeal case identifier
* `--round-id <TEXT>` — Moderation ballot round identifier



## `iroha app sorafs moderation ballots events`

List typed committed moderation events

**Usage:** `iroha app sorafs moderation ballots events [OPTIONS]`

###### **Options:**

* `--since <SINCE>` — Optional event sequence to resume from
* `--limit <LIMIT>` — Maximum number of events to return



## `iroha app sorafs moderation ballots commit`

Submit a juror commit as an exact caller-signed native transaction

**Usage:** `iroha app sorafs moderation ballots commit [OPTIONS] --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — Commit payload path
* `--format <FORMAT>` — Input format: json or norito

  Default value: `json`



## `iroha app sorafs moderation ballots reveal`

Submit a juror reveal as an exact caller-signed native transaction

**Usage:** `iroha app sorafs moderation ballots reveal [OPTIONS] --payload <PATH>`

###### **Options:**

* `--payload <PATH>` — Reveal payload path
* `--format <FORMAT>` — Input format: json or norito

  Default value: `json`



## `iroha app sorafs moderation ballots tally`

Submit governed native moderation finalization

**Usage:** `iroha app sorafs moderation ballots tally --case-id <TEXT> --round-id <TEXT>`

###### **Options:**

* `--case-id <TEXT>` — Moderation or appeal case identifier
* `--round-id <TEXT>` — Moderation ballot round identifier



## `iroha app sorafs moderation ballots execute`

Execute pending commit/reveal/tally actions from a coordination status

**Usage:** `iroha app sorafs moderation ballots execute [OPTIONS] --status <PATH>`

###### **Options:**

* `--status <PATH>` — Payload-free commit/reveal status JSON from the operator workflow service
* `--commit-payload <PATH>` — Commit payload path to submit if the status says the juror is pending
* `--reveal-payload <PATH>` — Reveal payload path to submit if the status says the juror is pending
* `--commit-format <COMMIT_FORMAT>` — Commit input format: json or norito

  Default value: `json`
* `--reveal-format <REVEAL_FORMAT>` — Reveal input format: json or norito

  Default value: `json`
* `--submit-tally` — Submit tally requests for ballots already marked ready in the status



## `iroha app sorafs moderation ballots executor-bundle`

Generate supervised commit/reveal executor deployment artifacts

**Usage:** `iroha app sorafs moderation ballots executor-bundle [OPTIONS] --status <PATH> --bundle-out <DIR>`

###### **Options:**

* `--status <PATH>` — Runtime path to the payload-free commit/reveal status JSON
* `--bundle-out <DIR>` — Directory to write deployment artifacts into
* `--commit-payload <PATH>` — Runtime commit payload path to submit if the status says the juror is pending
* `--reveal-payload <PATH>` — Runtime reveal payload path to submit if the status says the juror is pending
* `--commit-format <COMMIT_FORMAT>` — Commit input format: json or norito

  Default value: `json`
* `--reveal-format <REVEAL_FORMAT>` — Reveal input format: json or norito

  Default value: `json`
* `--submit-tally` — Submit tally requests for ballots already marked ready in the status
* `--iroha-bin <PATH>` — Iroha CLI binary path used by the generated runner

  Default value: `iroha`
* `--service-name <SERVICE_NAME>` — Service label used for generated systemd and launchd artifacts

  Default value: `org.sora.sorafs.ballots-executor`
* `--service-user <SERVICE_USER>` — Service user for the generated systemd unit

  Default value: `sorafs-moderation`
* `--service-group <SERVICE_GROUP>` — Service group for the generated systemd unit

  Default value: `sorafs-moderation`
* `--interval-secs <INTERVAL_SECS>` — Scheduler interval for the generated systemd timer and launchd job

  Default value: `60`



## `iroha app sorafs moderation ballots executor-canary`

Verify a deployed commit/reveal executor bundle and captured run summary

**Usage:** `iroha app sorafs moderation ballots executor-canary [OPTIONS] --bundle <DIR>`

###### **Options:**

* `--bundle <DIR>` — Executor bundle directory produced by `executor-bundle`
* `--execution-summary <PATH>` — Optional payload-free `ballots execute` summary captured from a deployed job run
* `--out <PATH>` — Optional path to write canary evidence JSON



## `iroha app sorafs moderation registry`

Admit and inspect local moderation model registry records

**Usage:** `iroha app sorafs moderation registry <COMMAND>`

###### **Subcommands:**

* `list` — List local moderation model registry records
* `submit-repro` — Admit a governance-signed reproducibility manifest
* `submit-corpus` — Admit an adversarial corpus manifest



## `iroha app sorafs moderation registry list`

List local moderation model registry records

**Usage:** `iroha app sorafs moderation registry list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of records to return from each registry section



## `iroha app sorafs moderation registry submit-repro`

Admit a governance-signed reproducibility manifest

**Usage:** `iroha app sorafs moderation registry submit-repro [OPTIONS] --manifest <PATH>`

###### **Options:**

* `--manifest <PATH>` — Reproducibility manifest path
* `--format <FORMAT>` — Input format: json or norito

  Default value: `json`



## `iroha app sorafs moderation registry submit-corpus`

Admit an adversarial corpus manifest

**Usage:** `iroha app sorafs moderation registry submit-corpus [OPTIONS] --manifest <PATH>`

###### **Options:**

* `--manifest <PATH>` — Adversarial corpus manifest path
* `--format <FORMAT>` — Input format: json or norito

  Default value: `json`



## `iroha app sorafs moderation screening`

Submit and inspect deterministic local moderation screening results

**Usage:** `iroha app sorafs moderation screening <COMMAND>`

###### **Subcommands:**

* `list` — List local moderation screening records
* `submit` — Submit one deterministic local screening result JSON file



## `iroha app sorafs moderation screening list`

List local moderation screening records

**Usage:** `iroha app sorafs moderation screening list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of screening records to return



## `iroha app sorafs moderation screening submit`

Submit one deterministic local screening result JSON file

**Usage:** `iroha app sorafs moderation screening submit --input <PATH>`

###### **Options:**

* `--input <PATH>` — JSON request containing canonical signed-result or committee authority



## `iroha app sorafs moderation quarantine`

Inspect and advance local moderation quarantine records

**Usage:** `iroha app sorafs moderation quarantine <COMMAND>`

###### **Subcommands:**

* `list` — List local moderation quarantine records
* `object` — Store or read local encrypted quarantine payload objects
* `notifications` — Deliver payload-free juror notification manifests
* `review` — Mark a local moderation quarantine record reviewed
* `release` — Release a reviewed local moderation quarantine record
* `appeal-handoff` — Build a reviewed quarantine appeal finance handoff
* `operator-panel` — Read one role-gated local quarantine operator-panel workflow view
* `bridge-plan` — Build a payload-free bridge automation plan from the operator-panel view
* `operator-serve` — Run a local payload-free operator-panel workflow service
* `operator-canary` — Probe a deployed operator workflow service and emit payload-free evidence



## `iroha app sorafs moderation quarantine list`

List local moderation quarantine records

**Usage:** `iroha app sorafs moderation quarantine list [OPTIONS]`

###### **Options:**

* `--limit <LIMIT>` — Maximum number of quarantine records to return



## `iroha app sorafs moderation quarantine object`

Store or read local encrypted quarantine payload objects

**Usage:** `iroha app sorafs moderation quarantine object <COMMAND>`

###### **Subcommands:**

* `store` — Seal payload bytes into the local encrypted quarantine object store
* `read` — Read and verify one local encrypted quarantine object



## `iroha app sorafs moderation quarantine object store`

Seal payload bytes into the local encrypted quarantine object store

**Usage:** `iroha app sorafs moderation quarantine object store [OPTIONS] --quarantine-id <HEX> --payload-file <PATH>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--payload-file <PATH>` — Path to the quarantined payload bytes to seal
* `--captured-at <RFC3339|@UNIX>` — Capture timestamp (RFC3339 or `@unix_seconds`; defaults to local now)
* `--content-type <TEXT>` — Optional content type label recorded with the object
* `--notes <TEXT>` — Optional object-store notes recorded with the object



## `iroha app sorafs moderation quarantine object read`

Read and verify one local encrypted quarantine object

**Usage:** `iroha app sorafs moderation quarantine object read --quarantine-id <HEX>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal



## `iroha app sorafs moderation quarantine notifications`

Deliver payload-free juror notification manifests

**Usage:** `iroha app sorafs moderation quarantine notifications <COMMAND>`

###### **Subcommands:**

* `deliver` — Deliver one payload-free juror notification manifest
* `canary` — Probe a deployed juror notification transport and emit payload-free evidence



## `iroha app sorafs moderation quarantine notifications deliver`

Deliver one payload-free juror notification manifest

**Usage:** `iroha app sorafs moderation quarantine notifications deliver [OPTIONS] --manifest <PATH>`

###### **Options:**

* `--manifest <PATH>` — Payload-free juror notification manifest JSON
* `--out-dir <DIR>` — Directory where canonical notification JSON files are written
* `--webhook-url <URL>` — Optional webhook endpoint that receives each notification JSON
* `--timeout-secs <TIMEOUT_SECS>` — Webhook request timeout in seconds

  Default value: `10`



## `iroha app sorafs moderation quarantine notifications canary`

Probe a deployed juror notification transport and emit payload-free evidence

**Usage:** `iroha app sorafs moderation quarantine notifications canary [OPTIONS] --manifest <PATH> --webhook-url <URL>`

###### **Options:**

* `--manifest <PATH>` — Payload-free juror notification manifest JSON used as the canary probe
* `--webhook-url <URL>` — Deployed webhook endpoint to probe
* `--out <PATH>` — Optional path where payload-free canary evidence JSON is written
* `--timeout-secs <TIMEOUT_SECS>` — Webhook request timeout in seconds

  Default value: `10`



## `iroha app sorafs moderation quarantine review`

Mark a local moderation quarantine record reviewed

**Usage:** `iroha app sorafs moderation quarantine review [OPTIONS] --quarantine-id <HEX>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--reviewed-by <TEXT>` — Operator identity recorded in the checkpoint (defaults to the CLI account)
* `--reviewed-at <RFC3339|@UNIX>` — Review timestamp (RFC3339 or `@unix_seconds`; defaults to local now)
* `--notes <TEXT>` — Optional review notes recorded with the transition



## `iroha app sorafs moderation quarantine release`

Release a reviewed local moderation quarantine record

**Usage:** `iroha app sorafs moderation quarantine release [OPTIONS] --quarantine-id <HEX>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--release-authority <TEXT>` — Release authority recorded in the checkpoint (defaults to the CLI account)
* `--released-at <RFC3339|@UNIX>` — Release timestamp (RFC3339 or `@unix_seconds`; defaults to local now)
* `--notes <TEXT>` — Optional release notes recorded with the transition



## `iroha app sorafs moderation quarantine appeal-handoff`

Build a reviewed quarantine appeal finance handoff

**Usage:** `iroha app sorafs moderation quarantine appeal-handoff --quarantine-id <HEX> --input <PATH>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--input <PATH>` — JSON appeal handoff request payload path



## `iroha app sorafs moderation quarantine operator-panel`

Read one role-gated local quarantine operator-panel workflow view

**Usage:** `iroha app sorafs moderation quarantine operator-panel [OPTIONS] --quarantine-id <HEX>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--limit <LIMIT>` — Maximum number of matching ballots to return



## `iroha app sorafs moderation quarantine bridge-plan`

Build a payload-free bridge automation plan from the operator-panel view

**Usage:** `iroha app sorafs moderation quarantine bridge-plan [OPTIONS] --quarantine-id <HEX>`

###### **Options:**

* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--limit <LIMIT>` — Maximum number of matching ballots to inspect



## `iroha app sorafs moderation quarantine operator-serve`

Run a local payload-free operator-panel workflow service

**Usage:** `iroha app sorafs moderation quarantine operator-serve [OPTIONS]`

###### **Options:**

* `--listen <LISTEN>` — Local host:port for the operator workflow service

  Default value: `127.0.0.1:9201`
* `--limit <LIMIT>` — Default ballot limit for operator-panel and bridge-plan reads
* `--max-body-bytes <MAX_BODY_BYTES>` — Maximum accepted HTTP request body bytes

  Default value: `1048576`



## `iroha app sorafs moderation quarantine operator-canary`

Probe a deployed operator workflow service and emit payload-free evidence

**Usage:** `iroha app sorafs moderation quarantine operator-canary [OPTIONS] --operator-url <URL> --quarantine-id <HEX>`

###### **Options:**

* `--operator-url <URL>` — Base URL of the deployed operator workflow service
* `--quarantine-id <HEX>` — 16-byte local quarantine id encoded as hexadecimal
* `--limit <LIMIT>` — Maximum number of matching ballots to request from readback routes
* `--timeout-secs <TIMEOUT_SECS>` — HTTP timeout in seconds

  Default value: `30`
* `--out <PATH>` — Optional path where the canary evidence JSON will be written



## `iroha app sorafs repair`

Repair queue helpers (list, claim, close, escalate)

**Usage:** `iroha app sorafs repair <COMMAND>`

###### **Subcommands:**

* `list` — List finalized chain-authoritative repair tasks
* `claim` — Claim a queued repair task with a native ledger action
* `renew` — Renew the current repair lease with a native ledger action
* `complete` — Commit a successful terminal repair outcome
* `fail` — Commit an unsuccessful terminal repair outcome
* `escalate` — Atomically escalate a repair task into a terminal slash proposal



## `iroha app sorafs repair list`

List finalized chain-authoritative repair tasks

**Usage:** `iroha app sorafs repair list [OPTIONS]`

###### **Options:**

* `--ticket-id <ID>` — Fetch one canonical repair ticket instead of a page
* `--limit <COUNT>` — Bounded task page size (1 through 500)
* `--expected-finalized-height <HEIGHT>` — Optional finalized block height; requires `--expected-finalized-block-hash`
* `--expected-finalized-block-hash <HEX>` — Optional finalized block hash; requires `--expected-finalized-height`
* `--after-task-id <HEX>` — Optional exclusive immutable task-id cursor



## `iroha app sorafs repair claim`

Claim a queued repair task with a native ledger action

**Usage:** `iroha app sorafs repair claim [OPTIONS] --ticket-id <ID> --expected-revision <REVISION>`

###### **Options:**

* `--ticket-id <ID>` — Repair ticket identifier (e.g., `REP-401`)
* `--expected-revision <REVISION>` — Exact task revision observed before claiming
* `--lease-duration-ms <LEASE_DURATION_MS>` — Requested lease duration measured from the committing block time

  Default value: `60000`
* `--idempotency-key <KEY>` — Optional idempotency key (auto-generated when omitted)



## `iroha app sorafs repair renew`

Renew the current repair lease with a native ledger action

**Usage:** `iroha app sorafs repair renew [OPTIONS] --ticket-id <ID> --expected-revision <REVISION> --lease-generation <GENERATION>`

###### **Options:**

* `--ticket-id <ID>` — Repair ticket identifier (e.g., `REP-401`)
* `--expected-revision <REVISION>` — Exact task revision observed before renewing
* `--lease-generation <GENERATION>` — Exact current lease generation
* `--lease-duration-ms <LEASE_DURATION_MS>` — Requested lease duration measured from the committing block time

  Default value: `60000`
* `--idempotency-key <KEY>` — Optional idempotency key (auto-generated when omitted)



## `iroha app sorafs repair complete`

Commit a successful terminal repair outcome

**Usage:** `iroha app sorafs repair complete [OPTIONS] --ticket-id <ID> --expected-revision <REVISION> --lease-generation <GENERATION> --evidence-digest <HEX>`

###### **Options:**

* `--ticket-id <ID>` — Repair ticket identifier (e.g., `REP-401`)
* `--expected-revision <REVISION>` — Exact task revision observed before completion
* `--lease-generation <GENERATION>` — Exact current lease generation
* `--evidence-digest <HEX>` — Digest of external completion evidence
* `--idempotency-key <KEY>` — Optional idempotency key (auto-generated when omitted)



## `iroha app sorafs repair fail`

Commit an unsuccessful terminal repair outcome

**Usage:** `iroha app sorafs repair fail [OPTIONS] --ticket-id <ID> --expected-revision <REVISION> --lease-generation <GENERATION> --failure-digest <HEX>`

###### **Options:**

* `--ticket-id <ID>` — Repair ticket identifier (e.g., `REP-401`)
* `--expected-revision <REVISION>` — Exact task revision observed before failure
* `--lease-generation <GENERATION>` — Exact current lease generation
* `--failure-digest <HEX>` — Digest of the external failure reason or evidence
* `--idempotency-key <KEY>` — Optional idempotency key (auto-generated when omitted)



## `iroha app sorafs repair escalate`

Atomically escalate a repair task into a terminal slash proposal

**Usage:** `iroha app sorafs repair escalate [OPTIONS] --ticket-id <ID> --expected-revision <REVISION> --lease-generation <GENERATION> --manifest-digest <HEX> --provider-id <HEX> --penalty <QUANTITY> --rationale <TEXT>`

###### **Options:**

* `--ticket-id <ID>` — Repair ticket identifier (e.g., `REP-401`)
* `--expected-revision <REVISION>` — Exact task revision observed before escalation
* `--lease-generation <GENERATION>` — Exact current lease generation
* `--manifest-digest <HEX>` — Manifest digest bound to the ticket (hex-encoded)
* `--provider-id <HEX>` — Provider identifier owning the ticket (hex-encoded)
* `--penalty <QUANTITY>` — Proposed exact XOR-denominated penalty
* `--rationale <TEXT>` — Escalation rationale for governance review
* `--auditor <ACCOUNT_ID>` — Optional auditor account (defaults to the CLI account)
* `--submitted-at <RFC3339|@UNIX>` — Optional timestamp for the proposal (RFC3339 or `@unix_seconds`)
* `--idempotency-key <KEY>` — Optional idempotency key (auto-generated when omitted)



## `iroha app sorafs billing`

Authenticated billing statement and reconciliation reads

**Usage:** `iroha app sorafs billing <COMMAND>`

###### **Subcommands:**

* `status` — Fetch the supervised billing projector status and current anchor
* `statements` — List owner-isolated published statements from an exact checkpoint
* `statement` — Fetch one exact published statement as canonical Norito
* `acknowledge` — Submit an externally authenticated owner acknowledgement
* `reconciliation` — Fetch payload-free delivery reconciliation status



## `iroha app sorafs billing status`

Fetch the supervised billing projector status and current anchor

**Usage:** `iroha app sorafs billing status`



## `iroha app sorafs billing statements`

List owner-isolated published statements from an exact checkpoint

**Usage:** `iroha app sorafs billing statements [OPTIONS] --expected-checkpoint-fingerprint <HEX> --limit <COUNT>`

###### **Options:**

* `--expected-checkpoint-fingerprint <HEX>` — Exact non-zero lowercase checkpoint fingerprint from billing status
* `--after-statement-id <HEX>` — Optional exclusive non-zero lowercase statement identifier
* `--limit <COUNT>` — Required page size in the inclusive range 1 through 100



## `iroha app sorafs billing statement`

Fetch one exact published statement as canonical Norito

**Usage:** `iroha app sorafs billing statement --statement-id <HEX> --expected-checkpoint-fingerprint <HEX> --output <PATH>`

###### **Options:**

* `--statement-id <HEX>` — Exact non-zero lowercase statement identifier
* `--expected-checkpoint-fingerprint <HEX>` — Exact non-zero lowercase checkpoint fingerprint from billing status
* `--output <PATH>` — Destination for the canonical Norito statement bytes



## `iroha app sorafs billing acknowledge`

Submit an externally authenticated owner acknowledgement

**Usage:** `iroha app sorafs billing acknowledge --statement-id <HEX> --expected-checkpoint-fingerprint <HEX> --request-nonce <HEX> --authentication-proof <PATH>`

###### **Options:**

* `--statement-id <HEX>` — Exact non-zero lowercase statement identifier
* `--expected-checkpoint-fingerprint <HEX>` — Exact non-zero lowercase checkpoint fingerprint from billing status
* `--request-nonce <HEX>` — Non-zero lowercase 32-byte idempotency nonce authenticated by the external proof
* `--authentication-proof <PATH>` — Binary external-authority authentication proof, bounded to 64 KiB



## `iroha app sorafs billing reconciliation`

Fetch payload-free delivery reconciliation status

**Usage:** `iroha app sorafs billing reconciliation`



## `iroha app sorafs hedging`

Authenticated finalized hedging projection reads

**Usage:** `iroha app sorafs hedging <COMMAND>`

###### **Subcommands:**

* `exposure` — List finalized XOR exposure, including below-threshold periods
* `intents` — List deterministic governed hedge intents without executing them



## `iroha app sorafs hedging exposure`

List finalized XOR exposure, including below-threshold periods

**Usage:** `iroha app sorafs hedging exposure [OPTIONS] --expected-checkpoint-fingerprint <HEX> --limit <COUNT>`

###### **Options:**

* `--expected-checkpoint-fingerprint <HEX>` — Exact non-zero lowercase checkpoint fingerprint from billing status
* `--after <HEX>` — Optional exclusive non-zero lowercase opaque cursor
* `--limit <COUNT>` — Required page size in the inclusive range 1 through 100



## `iroha app sorafs hedging intents`

List deterministic governed hedge intents without executing them

**Usage:** `iroha app sorafs hedging intents [OPTIONS] --expected-checkpoint-fingerprint <HEX> --limit <COUNT>`

###### **Options:**

* `--expected-checkpoint-fingerprint <HEX>` — Exact non-zero lowercase checkpoint fingerprint from billing status
* `--after <HEX>` — Optional exclusive non-zero lowercase opaque cursor
* `--limit <COUNT>` — Required page size in the inclusive range 1 through 100



## `iroha app sorafs gc`

GC inspection helpers (no manual deletions)

**Usage:** `iroha app sorafs gc <COMMAND>`

###### **Subcommands:**

* `inspect` — Inspect retained manifests and retention deadlines
* `dry-run` — Report which manifests would be evicted by GC (dry-run only)



## `iroha app sorafs gc inspect`

Inspect retained manifests and retention deadlines

**Usage:** `iroha app sorafs gc inspect [OPTIONS]`

###### **Options:**

* `--data-dir <PATH>` — Root directory for SoraFS storage data (defaults to the node config default)
* `--now <RFC3339|@UNIX>` — Override the reference timestamp (RFC3339 or `@unix_seconds`)
* `--grace-secs <SECONDS>` — Override the retention grace window in seconds



## `iroha app sorafs gc dry-run`

Report which manifests would be evicted by GC (dry-run only)

**Usage:** `iroha app sorafs gc dry-run [OPTIONS]`

###### **Options:**

* `--data-dir <PATH>` — Root directory for SoraFS storage data (defaults to the node config default)
* `--now <RFC3339|@UNIX>` — Override the reference timestamp (RFC3339 or `@unix_seconds`)
* `--grace-secs <SECONDS>` — Override the retention grace window in seconds



## `iroha app sorafs fetch`

Orchestrate multi-provider chunk fetches via gateways

**Usage:** `iroha app sorafs fetch [OPTIONS] --gateway-provider <SPEC>`

###### **Options:**

* `--manifest <PATH>` — Path to the Norito-encoded manifest (`.to`) describing the payload layout
* `--plan <PATH>` — Path to a canonical payload-bound `sorafs.chunk_fetch_plan.v1` JSON envelope
* `--manifest-id <HEX>` — Hex-encoded manifest hash used as the manifest identifier on gateways
* `--gateway-provider <SPEC>` — Gateway provider descriptor (`name=... , provider-id=... , base-url=... , stream-token=...`)
* `--storage-ticket <HEX>` — Storage ticket identifier to fetch manifest + chunk plan automatically from Torii
* `--manifest-endpoint <URL>` — Optional override for the Torii manifest endpoint used with `--storage-ticket`
* `--manifest-cache-dir <PATH>` — Directory for storing manifest/chunk-plan artefacts fetched via `--storage-ticket`
* `--client-id <STRING>` — Optional client identifier forwarded to the gateway for auditing
* `--manifest-envelope <PATH>` — Optional path to a Norito-encoded manifest envelope to satisfy gateway policy checks
* `--manifest-cid <HEX>` — Override the expected manifest CID (defaults to the manifest digest)
* `--blinded-cid <BASE64>` — Canonical blinded CID (base64url, no padding) forwarded via `SoraNet` headers
* `--salt-epoch <EPOCH>` — Salt epoch corresponding to the blinded CID headers
* `--salt-hex <HEX>` — Hex-encoded 32-byte salt used to derive the canonical blinded CID (computes `--blinded-cid`)
* `--chunker-handle <STRING>` — Override the chunker handle advertised to gateways
* `--max-peers <COUNT>` — Limit the number of providers participating in the session
* `--retry-budget <COUNT>` — Maximum retry attempts per chunk (0 disables the cap)
* `--transport-policy <POLICY>` — Override the default `soranet-first` transport policy (`soranet-first`, `soranet-strict`, or `direct-only`). Supply `direct-only` only when staging a downgrade or rehearsing the compliance drills captured in `roadmap.md`
* `--anonymity-policy <POLICY>` — Override the anonymity policy with an exact V1 label (`anon-guard-pq`, `anon-majority-pq`, or `anon-strict-pq`)
* `--write-mode <MODE>` — Hint that tightens PQ expectations for write paths (`read-only` or `upload-pq-only`)
* `--transport-policy-override <POLICY>` — Force the orchestrator to stay on a specific transport stage (`soranet-first`, `soranet-strict`, or `direct-only`)
* `--anonymity-policy-override <POLICY>` — Force the orchestrator to stay on an exact V1 anonymity policy
* `--guard-cache <PATH>` — Path to the persisted guard cache (Norito-encoded guard set)
* `--guard-cache-key-file <PATH>` — Owner-private file containing the exact 32 raw bytes used to authenticate the guard cache
* `--guard-directory <PATH>` — Path to a Norito guard directory snapshot used to refresh guard selections
* `--guard-directory-digest <HEX>` — Trusted domain-separated BLAKE3 digest of the exact guard directory bytes
* `--guard-target <COUNT>` — Target number of entry guards to pin (defaults to 3 when the guard directory is provided)
* `--guard-retention-days <DAYS>` — Guard retention window in days (defaults to 30 when the guard directory is provided)
* `--output <PATH>` — Write the assembled payload to a file
* `--json-out <PATH>` — Override the summary JSON path (defaults to `artifacts/sorafs_orchestrator/latest/summary.json`)
* `--scoreboard-out <PATH>` — Override the scoreboard JSON path (defaults to `artifacts/sorafs_orchestrator/latest/scoreboard.json`)
* `--scoreboard-now <UNIX_SECS>` — Override the Unix timestamp used when evaluating provider adverts
* `--telemetry-source-label <LABEL>` — Label describing the telemetry stream captured alongside the scoreboard (persisted in metadata)
* `--telemetry-region <LABEL>` — Optional telemetry region label persisted in both the scoreboard metadata and summary JSON



## `iroha app soracles`

Soracles helpers (evidence bundling)

**Usage:** `iroha app soracles <COMMAND>`

###### **Subcommands:**

* `tx` — Build and submit oracle transactions
* `query` — Run oracle queries
* `bundle` — Build an audit bundle containing oracle feed events and evidence files
* `catalog` — Show the oracle rejection/error catalog for SDK parity
* `evidence-gc` — Garbage-collect evidence bundles and prune unreferenced artifacts



## `iroha app soracles tx`

Build and submit oracle transactions

**Usage:** `iroha app soracles tx <COMMAND>`

###### **Subcommands:**

* `register` — Register an oracle feed from a Norito JSON feed config file
* `submit` — Submit a provider-signed observation from a Norito JSON file
* `aggregate` — Aggregate a feed window
* `open-dispute` — Open an oracle dispute anchored to retained feed history
* `resolve-dispute` — Resolve an oracle dispute
* `propose-change` — Propose an oracle feed change
* `vote-change-stage` — Vote in the active stage of an oracle feed change
* `rollback-change` — Roll back the active stage of an oracle feed change
* `attest-defi` — Submit a native DeFi oracle attestation
* `record-twitter-binding` — Record a Twitter binding attestation
* `revoke-twitter-binding` — Revoke a Twitter binding



## `iroha app soracles tx register`

Register an oracle feed from a Norito JSON feed config file

**Usage:** `iroha app soracles tx register --feed-json <PATH>`

###### **Options:**

* `--feed-json <PATH>` — Norito JSON file containing `FeedConfig`



## `iroha app soracles tx submit`

Submit a provider-signed observation from a Norito JSON file

**Usage:** `iroha app soracles tx submit --observation-json <PATH>`

###### **Options:**

* `--observation-json <PATH>` — Norito JSON file containing `Observation`



## `iroha app soracles tx aggregate`

Aggregate a feed window

**Usage:** `iroha app soracles tx aggregate [OPTIONS] --feed-id <FEED_ID> --slot <SLOT> --request-hash <REQUEST_HASH>`

###### **Options:**

* `--feed-id <FEED_ID>` — Feed identifier
* `--slot <SLOT>` — Slot to aggregate
* `--request-hash <REQUEST_HASH>` — Request hash for the window
* `--evidence-hash <EVIDENCE_HASHES>` — Evidence hashes to anchor on the resulting feed event



## `iroha app soracles tx open-dispute`

Open an oracle dispute anchored to retained feed history

**Usage:** `iroha app soracles tx open-dispute [OPTIONS] --feed-id <FEED_ID> --slot <SLOT> --request-hash <REQUEST_HASH> --target <TARGET>`

###### **Options:**

* `--feed-id <FEED_ID>` — Feed identifier
* `--slot <SLOT>` — Disputed slot
* `--request-hash <REQUEST_HASH>` — Request hash for the disputed window
* `--target <TARGET>` — Provider being challenged
* `--bond <BOND>` — Optional bond amount; defaults to oracle economics config
* `--evidence-hash <EVIDENCE_HASHES>` — Evidence hashes backing the dispute
* `--reason <REASON>` — Human-readable reason for the dispute

  Default value: ``



## `iroha app soracles tx resolve-dispute`

Resolve an oracle dispute

**Usage:** `iroha app soracles tx resolve-dispute [OPTIONS] --dispute-id <DISPUTE_ID> --outcome <OUTCOME>`

###### **Options:**

* `--dispute-id <DISPUTE_ID>` — Dispute identifier
* `--outcome <OUTCOME>` — Resolution outcome

  Possible values: `upheld`, `reduced`, `frivolous`

* `--notes <NOTES>` — Optional notes retained by clients/auditors

  Default value: ``



## `iroha app soracles tx propose-change`

Propose an oracle feed change

**Usage:** `iroha app soracles tx propose-change [OPTIONS] --change-id <CHANGE_ID> --feed-json <PATH> --class <CLASS> --payload-hash <PAYLOAD_HASH>`

###### **Options:**

* `--change-id <CHANGE_ID>` — Change id hash
* `--feed-json <PATH>` — Norito JSON file containing proposed `FeedConfig`
* `--class <CLASS>` — Governance class for the proposal

  Possible values: `low`, `medium`, `high`

* `--payload-hash <PAYLOAD_HASH>` — Hash of the off-chain change manifest
* `--evidence-hash <EVIDENCE_HASHES>` — Evidence hashes attached to intake



## `iroha app soracles tx vote-change-stage`

Vote in the active stage of an oracle feed change

**Usage:** `iroha app soracles tx vote-change-stage [OPTIONS] --change-id <CHANGE_ID> --stage <STAGE>`

###### **Options:**

* `--change-id <CHANGE_ID>` — Change id hash
* `--stage <STAGE>` — Stage being voted. Must be the active stage

  Possible values: `intake`, `rules-committee`, `cop-review`, `technical-audit`, `policy-jury`, `enactment`

* `--approve` — Approve the stage; pass `false` to reject

  Default value: `true`
* `--evidence-hash <EVIDENCE_HASHES>` — Evidence hashes attached to this stage vote



## `iroha app soracles tx rollback-change`

Roll back the active stage of an oracle feed change

**Usage:** `iroha app soracles tx rollback-change [OPTIONS] --change-id <CHANGE_ID> --reason <REASON>`

###### **Options:**

* `--change-id <CHANGE_ID>` — Change id hash
* `--stage <STAGE>` — Optional stage to roll back. If omitted, rolls back the active stage

  Possible values: `intake`, `rules-committee`, `cop-review`, `technical-audit`, `policy-jury`, `enactment`

* `--reason <REASON>` — Human-readable rollback reason



## `iroha app soracles tx attest-defi`

Submit a native DeFi oracle attestation

**Usage:** `iroha app soracles tx attest-defi --attestation-json <PATH>`

###### **Options:**

* `--attestation-json <PATH>` — Norito JSON file containing `DefiOracleAttestation`



## `iroha app soracles tx record-twitter-binding`

Record a Twitter binding attestation

**Usage:** `iroha app soracles tx record-twitter-binding --attestation-json <PATH> --feed-id <FEED_ID>`

###### **Options:**

* `--attestation-json <PATH>` — Norito JSON file containing `TwitterBindingAttestation`
* `--feed-id <FEED_ID>` — Feed identifier for the binding feed



## `iroha app soracles tx revoke-twitter-binding`

Revoke a Twitter binding

**Usage:** `iroha app soracles tx revoke-twitter-binding [OPTIONS] --binding-hash-json <PATH>`

###### **Options:**

* `--binding-hash-json <PATH>` — Norito JSON file containing the keyed binding hash
* `--reason <REASON>` — Human-readable revocation reason

  Default value: ``



## `iroha app soracles query`

Run oracle queries

**Usage:** `iroha app soracles query <COMMAND>`

###### **Subcommands:**

* `feeds` — List all registered oracle feeds
* `feed` — Fetch one oracle feed
* `history` — List retained feed history
* `provider-stats` — List provider stats for a feed or fetch one provider stats record
* `disputes` — List oracle disputes, optionally filtered by feed id
* `dispute` — Fetch one oracle dispute
* `changes` — List oracle changes
* `change` — Fetch one oracle change
* `twitter-bindings` — List Twitter bindings by UAID from a Norito JSON UAID file
* `defi-attestation` — Fetch latest DeFi oracle attestation by domain and subject id



## `iroha app soracles query feeds`

List all registered oracle feeds

**Usage:** `iroha app soracles query feeds`



## `iroha app soracles query feed`

Fetch one oracle feed

**Usage:** `iroha app soracles query feed --feed-id <FEED_ID>`

###### **Options:**

* `--feed-id <FEED_ID>` — Feed identifier



## `iroha app soracles query history`

List retained feed history

**Usage:** `iroha app soracles query history --feed-id <FEED_ID>`

###### **Options:**

* `--feed-id <FEED_ID>` — Feed identifier



## `iroha app soracles query provider-stats`

List provider stats for a feed or fetch one provider stats record

**Usage:** `iroha app soracles query provider-stats [OPTIONS] --feed-id <FEED_ID>`

###### **Options:**

* `--feed-id <FEED_ID>` — Feed identifier
* `--provider <PROVIDER>` — Optional provider account id for a singular lookup



## `iroha app soracles query disputes`

List oracle disputes, optionally filtered by feed id

**Usage:** `iroha app soracles query disputes [OPTIONS]`

###### **Options:**

* `--feed-id <FEED_ID>` — Optional feed identifier filter



## `iroha app soracles query dispute`

Fetch one oracle dispute

**Usage:** `iroha app soracles query dispute --dispute-id <DISPUTE_ID>`

###### **Options:**

* `--dispute-id <DISPUTE_ID>` — Dispute identifier



## `iroha app soracles query changes`

List oracle changes

**Usage:** `iroha app soracles query changes`



## `iroha app soracles query change`

Fetch one oracle change

**Usage:** `iroha app soracles query change --change-id <CHANGE_ID>`

###### **Options:**

* `--change-id <CHANGE_ID>` — Change id hash



## `iroha app soracles query twitter-bindings`

List Twitter bindings by UAID from a Norito JSON UAID file

**Usage:** `iroha app soracles query twitter-bindings --uaid-json <PATH>`

###### **Options:**

* `--uaid-json <PATH>` — Norito JSON file containing `UniversalAccountId`



## `iroha app soracles query defi-attestation`

Fetch latest DeFi oracle attestation by domain and subject id

**Usage:** `iroha app soracles query defi-attestation --domain <DOMAIN> --subject-id <SUBJECT_ID>`

###### **Options:**

* `--domain <DOMAIN>` — DeFi oracle domain (`1=perps_market`, `2=options_series`, `3=options_shout`, `4=cover_policy`)
* `--subject-id <SUBJECT_ID>` — Domain subject id (`market_id`, `series_id`, `position_id`, or `policy_id`)



## `iroha app soracles bundle`

Build an audit bundle containing oracle feed events and evidence files

**Usage:** `iroha app soracles bundle [OPTIONS] --events <PATH> --output <DIR>`

###### **Options:**

* `--events <PATH>` — Path to a JSON file containing `FeedEventRecord` values (array or single record)
* `--output <DIR>` — Directory where the bundle (manifest + hashed artefacts) will be written
* `--observations <DIR>` — Directory of observation JSON files to include (hashed and copied into the bundle)
* `--reports <DIR>` — Directory of report JSON files to include
* `--responses <DIR>` — Directory of connector response JSON files to include
* `--disputes <DIR>` — Directory of dispute evidence JSON files to include
* `--telemetry <PATH>` — Optional telemetry snapshot (JSON) to include in the bundle



## `iroha app soracles catalog`

Show the oracle rejection/error catalog for SDK parity

**Usage:** `iroha app soracles catalog [OPTIONS]`

###### **Options:**

* `--format <FORMAT>` — Output format (`json` for machine consumption, `markdown` for docs/runbooks).

   Ignored when `--output-format json` is used.

  Default value: `json`

  Possible values: `json`, `markdown`




## `iroha app soracles evidence-gc`

Garbage-collect evidence bundles and prune unreferenced artifacts

**Usage:** `iroha app soracles evidence-gc [OPTIONS]`

###### **Options:**

* `--root <DIR>` — Root directory containing soracles evidence bundles (each with `bundle.json`)

  Default value: `artifacts/soracles`
* `--retention-days <DAYS>` — Retention period in days; bundles older than this are removed

  Default value: `180`
* `--dispute-retention-days <DAYS>` — Retention period for bundles containing dispute evidence (defaults to a longer window)

  Default value: `365`
* `--report <PATH>` — Emit a GC summary report to this path (defaults to `<root>/gc_report.json`)
* `--prune-unreferenced` — Remove artifact files that are not referenced by `bundle.json`
* `--dry-run` — Perform a dry run and only report what would be removed



## `iroha app sns`

Sora Name Service helpers (registrar + policy tooling)

**Usage:** `iroha app sns <COMMAND>`

###### **Subcommands:**

* `registration` — Fetch one committed SNS name record
* `policy` — Fetch the live policy for one numeric suffix identifier



## `iroha app sns registration`

Fetch one committed SNS name record

**Usage:** `iroha app sns registration --namespace <NAMESPACE> --literal <LITERAL>`

###### **Options:**

* `--namespace <NAMESPACE>` — Explicit SNS namespace; no embedded suffix catalog is consulted

  Possible values:
  - `account-alias`:
    Full account-alias key such as `merchant@banka.paynet`
  - `domain`:
    Domain name literal
  - `dataspace`:
    Dataspace alias literal

* `--literal <LITERAL>` — Exact canonical literal within the selected namespace



## `iroha app sns policy`

Fetch the live policy for one numeric suffix identifier

**Usage:** `iroha app sns policy --suffix-id <U16>`

###### **Options:**

* `--suffix-id <U16>` — Numeric on-chain suffix identifier



## `iroha app alias`

Alias resolution and declarative setup helpers

**Usage:** `iroha app alias <COMMAND>`

###### **Subcommands:**

* `doctor` — Inspect authenticated account-onboarding readiness
* `setup` — Plan or apply one atomic declarative alias setup transaction
* `lease` — Manage explicit alias lease lifecycle operations
* `auto-renew` — Configure deterministic native alias auto-renew
* `resolve` — Resolve an alias by its canonical name
* `resolve-index` — Resolve an alias by deterministic index
* `by-account` — List aliases bound to a canonical account id



## `iroha app alias doctor`

Inspect authenticated account-onboarding readiness

**Usage:** `iroha app alias doctor --token-file <PATH>`

###### **Options:**

* `--token-file <PATH>` — File containing the dedicated onboarding API token



## `iroha app alias setup`

Plan or apply one atomic declarative alias setup transaction

**Usage:** `iroha app alias setup <COMMAND>`

###### **Subcommands:**

* `plan` — Plan an intent against live state without mutating it
* `apply` — Verify, locally sign, and submit one exact plan as a normal transaction



## `iroha app alias setup plan`

Plan an intent against live state without mutating it

**Usage:** `iroha app alias setup plan [OPTIONS] --intent-file <PATH>`

###### **Options:**

* `--intent-file <PATH>` — Secret-free JSON file containing `AliasSetupPlanRequestV1`
* `--plan-file <PATH>` — Optional path at which to write the verified, secret-free plan JSON



## `iroha app alias setup apply`

Verify, locally sign, and submit one exact plan as a normal transaction

**Usage:** `iroha app alias setup apply --plan-file <PATH>`

###### **Options:**

* `--plan-file <PATH>` — Secret-free JSON plan returned by `setup plan`



## `iroha app alias lease`

Manage explicit alias lease lifecycle operations

**Usage:** `iroha app alias lease <COMMAND>`

###### **Subcommands:**

* `renew` — Plan or apply an absolute-expiry lease renewal CAS



## `iroha app alias lease renew`

Plan or apply an absolute-expiry lease renewal CAS

**Usage:** `iroha app alias lease renew <COMMAND>`

###### **Subcommands:**

* `plan` — Plan a renewal against live state without mutating it
* `apply` — Verify, locally sign, and submit one exact renewal plan



## `iroha app alias lease renew plan`

Plan a renewal against live state without mutating it

**Usage:** `iroha app alias lease renew plan [OPTIONS] --intent-file <PATH>`

###### **Options:**

* `--intent-file <PATH>` — Secret-free JSON file containing `AliasLeaseRenewPlanRequestV1`
* `--plan-file <PATH>` — Optional path at which to write the verified, secret-free plan JSON



## `iroha app alias lease renew apply`

Verify, locally sign, and submit one exact renewal plan

**Usage:** `iroha app alias lease renew apply --plan-file <PATH>`

###### **Options:**

* `--plan-file <PATH>` — Secret-free JSON plan returned by `lease renew plan`



## `iroha app alias auto-renew`

Configure deterministic native alias auto-renew

**Usage:** `iroha app alias auto-renew <COMMAND>`

###### **Subcommands:**

* `plan` — Plan a configuration CAS against live state without mutating it
* `apply` — Verify, locally sign, and submit one exact configuration plan



## `iroha app alias auto-renew plan`

Plan a configuration CAS against live state without mutating it

**Usage:** `iroha app alias auto-renew plan [OPTIONS] --intent-file <PATH>`

###### **Options:**

* `--intent-file <PATH>` — Secret-free JSON file containing `AliasAutoRenewPlanRequestV1`
* `--plan-file <PATH>` — Optional path at which to write the verified, secret-free plan JSON



## `iroha app alias auto-renew apply`

Verify, locally sign, and submit one exact configuration plan

**Usage:** `iroha app alias auto-renew apply --plan-file <PATH>`

###### **Options:**

* `--plan-file <PATH>` — Secret-free JSON plan returned by `auto-renew plan`



## `iroha app alias resolve`

Resolve an alias by its canonical name

**Usage:** `iroha app alias resolve [OPTIONS] --alias <ALIAS>`

###### **Options:**

* `--alias <ALIAS>` — Alias name to resolve
* `--dry-run` — Print only validation result (skip future network call)

  Default value: `false`



## `iroha app alias resolve-index`

Resolve an alias by deterministic index

**Usage:** `iroha app alias resolve-index --index <INDEX>`

###### **Options:**

* `--index <INDEX>` — Alias Merkle index to resolve



## `iroha app alias by-account`

List aliases bound to a canonical account id

**Usage:** `iroha app alias by-account [OPTIONS] --account-id <ACCOUNT_ID>`

###### **Options:**

* `--account-id <ACCOUNT_ID>` — Canonical I105 account id
* `--dataspace <DATASPACE>` — Optional dataspace alias filter such as `centralbank`
* `--domain <DOMAIN>` — Optional exact domain filter such as `banka`



## `iroha app repo`

Repo settlement helpers

**Usage:** `iroha app repo <COMMAND>`

###### **Subcommands:**

* `initiate` — Initiate or roll a repo agreement between two counterparties
* `unwind` — Unwind an active repo agreement (reverse repo leg)
* `query` — Inspect repo agreements stored on-chain
* `margin` — Compute the next margin checkpoint for an agreement
* `margin-call` — Record a margin call for an active repo agreement



## `iroha app repo initiate`

Initiate or roll a repo agreement between two counterparties

**Usage:** `iroha app repo initiate [OPTIONS] --agreement-id <AGREEMENT_ID> --initiator <INITIATOR> --counterparty <COUNTERPARTY> --cash-asset <CASH_ASSET> --cash-quantity <CASH_QUANTITY> --collateral-asset <COLLATERAL_ASSET> --collateral-quantity <COLLATERAL_QUANTITY> --rate-bps <RATE_BPS> --maturity-timestamp-ms <MATURITY_TIMESTAMP_MS> --haircut-bps <HAIRCUT_BPS> --margin-frequency-secs <MARGIN_FREQUENCY_SECS>`

###### **Options:**

* `--agreement-id <AGREEMENT_ID>` — Stable identifier assigned to the repo agreement lifecycle
* `--initiator <INITIATOR>` — Initiating account submitting the repo
* `--counterparty <COUNTERPARTY>` — Counterparty receiving the repo cash leg
* `--custodian <CUSTODIAN>` — Optional custodian account holding pledged collateral in tri-party agreements
* `--cash-asset <CASH_ASSET>` — Cash asset definition identifier
* `--cash-quantity <CASH_QUANTITY>` — Cash quantity exchanged at initiation (integer or decimal)
* `--collateral-asset <COLLATERAL_ASSET>` — Collateral asset definition identifier
* `--collateral-quantity <COLLATERAL_QUANTITY>` — Collateral quantity pledged at initiation (integer or decimal)
* `--rate-bps <RATE_BPS>` — Fixed interest rate in basis points
* `--maturity-timestamp-ms <MATURITY_TIMESTAMP_MS>` — Unix timestamp (milliseconds) when the repo matures
* `--haircut-bps <HAIRCUT_BPS>` — Haircut applied to the collateral leg, in basis points
* `--margin-frequency-secs <MARGIN_FREQUENCY_SECS>` — Cadence between margin checks, in seconds (0 disables margining)



## `iroha app repo unwind`

Unwind an active repo agreement (reverse repo leg)

**Usage:** `iroha app repo unwind --agreement-id <AGREEMENT_ID>`

###### **Options:**

* `--agreement-id <AGREEMENT_ID>` — Stable identifier to settle at maturity as any recorded participant



## `iroha app repo query`

Inspect repo agreements stored on-chain

**Usage:** `iroha app repo query <COMMAND>`

###### **Subcommands:**

* `list` — List all repo agreements recorded on-chain
* `get` — Fetch a single repo agreement by identifier



## `iroha app repo query list`

List all repo agreements recorded on-chain

**Usage:** `iroha app repo query list`



## `iroha app repo query get`

Fetch a single repo agreement by identifier

**Usage:** `iroha app repo query get --id <ID>`

###### **Options:**

* `--id <ID>` — Stable identifier assigned to the repo agreement lifecycle



## `iroha app repo margin`

Compute the next margin checkpoint for an agreement

**Usage:** `iroha app repo margin [OPTIONS] --agreement-id <AGREEMENT_ID>`

###### **Options:**

* `--agreement-id <AGREEMENT_ID>` — Stable identifier assigned to the repo agreement lifecycle
* `--at-timestamp-ms <AT_TIMESTAMP_MS>` — Timestamp (ms) used when evaluating margin schedule (defaults to current time)



## `iroha app repo margin-call`

Record a margin call for an active repo agreement

**Usage:** `iroha app repo margin-call --agreement-id <AGREEMENT_ID>`

###### **Options:**

* `--agreement-id <AGREEMENT_ID>` — Stable identifier assigned to the repo agreement lifecycle



## `iroha app settlement`

Delivery-versus-payment and payment-versus-payment helpers

**Usage:** `iroha app settlement <COMMAND>`

###### **Subcommands:**

* `dvp` — Create a delivery-versus-payment instruction
* `pvp` — Create a payment-versus-payment instruction
* `set-fx-corridor-policy` — Register or replace a governed native FX corridor policy
* `fund-fx-corridor-escrow` — Fund a corridor's isolated reserve from its immutable owner
* `refund-fx-corridor-escrow` — Refund an inactive corridor reserve to its immutable owner
* `settle-fx-corridor` — Execute one policy-backed native FX corridor settlement
* `get-fx-corridor-policy` — Read one governed native FX corridor policy
* `list-fx-corridor-policies` — Read the complete governed native FX corridor policy registry



## `iroha app settlement dvp`

Create a delivery-versus-payment instruction

**Usage:** `iroha app settlement dvp [OPTIONS] --settlement-id <SETTLEMENT_ID> --delivery-asset <DELIVERY_ASSET> --delivery-quantity <DELIVERY_QUANTITY> --delivery-from <DELIVERY_FROM> --delivery-to <DELIVERY_TO> --payment-asset <PAYMENT_ASSET> --payment-quantity <PAYMENT_QUANTITY> --payment-from <PAYMENT_FROM> --payment-to <PAYMENT_TO>`

###### **Options:**

* `--settlement-id <SETTLEMENT_ID>` — Stable identifier shared across the settlement lifecycle
* `--delivery-asset <DELIVERY_ASSET>` — Asset definition delivered in exchange
* `--delivery-quantity <DELIVERY_QUANTITY>` — Quantity delivered (integer or decimal)
* `--delivery-from <DELIVERY_FROM>` — Account delivering the asset
* `--delivery-to <DELIVERY_TO>` — Account receiving the delivery leg
* `--delivery-instrument-id <DELIVERY_INSTRUMENT_ID>` — Regulated identifier (ISIN or CUSIP) for the delivery instrument when producing ISO previews
* `--iso-reference-crosswalk <ISO_REFERENCE_CROSSWALK>` — Optional path to an ISIN↔CUSIP crosswalk used to validate `--delivery-instrument-id`
* `--payment-asset <PAYMENT_ASSET>` — Payment asset definition completing the settlement
* `--payment-quantity <PAYMENT_QUANTITY>` — Payment quantity (integer or decimal)
* `--payment-from <PAYMENT_FROM>` — Account sending the payment leg
* `--payment-to <PAYMENT_TO>` — Account receiving the payment leg
* `--order <ORDER>` — Execution order for the two legs

  Default value: `delivery-then-payment`

  Possible values: `delivery-then-payment`, `payment-then-delivery`

* `--atomicity <ATOMICITY>` — Atomicity policy for partial failures (currently only all-or-nothing)

  Default value: `all-or-nothing`

  Possible values: `all-or-nothing`, `commit-first-leg`, `commit-second-leg`

* `--place-of-settlement-mic <PLACE_OF_SETTLEMENT_MIC>` — Optional MIC to emit under PlcOfSttlm/MktId
* `--partial-indicator <PARTIAL_INDICATOR>` — Settlement partial indicator for SttlmParams/PrtlSttlmInd (NPAR/PART/PARQ/PARC)

  Default value: `npar`

  Possible values: `npar`, `part`, `parq`, `parc`

* `--hold-indicator` — Whether to set SttlmParams/HldInd=true in the generated ISO preview
* `--settlement-condition <SETTLEMENT_CONDITION>` — Optional settlement condition code for SttlmParams/SttlmTxCond/Cd
* `--linkage <LINKAGE>` — Optional settlement linkage (TYPE:REFERENCE, TYPE = WITH|BEFO|AFTE). May be repeated
* `--iso-settlement-date <ISO_SETTLEMENT_DATE>` — Explicit ISO settlement date (YYYY-MM-DD) for deterministic sese.023 previews
* `--iso-xml-out <ISO_XML_OUT>` — Optional path to emit a sese.023 XML preview of the settlement



## `iroha app settlement pvp`

Create a payment-versus-payment instruction

**Usage:** `iroha app settlement pvp [OPTIONS] --settlement-id <SETTLEMENT_ID> --primary-asset <PRIMARY_ASSET> --primary-quantity <PRIMARY_QUANTITY> --primary-from <PRIMARY_FROM> --primary-to <PRIMARY_TO> --counter-asset <COUNTER_ASSET> --counter-quantity <COUNTER_QUANTITY> --counter-from <COUNTER_FROM> --counter-to <COUNTER_TO>`

###### **Options:**

* `--settlement-id <SETTLEMENT_ID>` — Stable identifier shared across the settlement lifecycle
* `--primary-asset <PRIMARY_ASSET>` — Primary currency leg asset definition
* `--primary-quantity <PRIMARY_QUANTITY>` — Quantity of the primary currency (integer or decimal)
* `--primary-from <PRIMARY_FROM>` — Account delivering the primary currency
* `--primary-to <PRIMARY_TO>` — Account receiving the primary currency
* `--counter-asset <COUNTER_ASSET>` — Counter currency leg asset definition
* `--counter-quantity <COUNTER_QUANTITY>` — Quantity of the counter currency (integer or decimal)
* `--counter-from <COUNTER_FROM>` — Account delivering the counter currency
* `--counter-to <COUNTER_TO>` — Account receiving the counter currency
* `--order <ORDER>` — Execution order for the two legs

  Default value: `delivery-then-payment`

  Possible values: `delivery-then-payment`, `payment-then-delivery`

* `--atomicity <ATOMICITY>` — Atomicity policy for partial failures (currently only all-or-nothing)

  Default value: `all-or-nothing`

  Possible values: `all-or-nothing`, `commit-first-leg`, `commit-second-leg`

* `--place-of-settlement-mic <PLACE_OF_SETTLEMENT_MIC>` — Optional MIC to emit under PlcOfSttlm/MktId
* `--partial-indicator <PARTIAL_INDICATOR>` — Settlement partial indicator for SttlmParams/PrtlSttlmInd (NPAR/PART/PARQ/PARC)

  Default value: `npar`

  Possible values: `npar`, `part`, `parq`, `parc`

* `--hold-indicator` — Whether to set SttlmParams/HldInd=true in the generated ISO preview
* `--settlement-condition <SETTLEMENT_CONDITION>` — Optional settlement condition code for SttlmParams/SttlmTxCond/Cd
* `--iso-settlement-date <ISO_SETTLEMENT_DATE>` — Explicit ISO settlement date (YYYY-MM-DD) for deterministic sese.025 previews
* `--iso-xml-out <ISO_XML_OUT>` — Optional path to emit a sese.025 XML preview of the settlement



## `iroha app settlement set-fx-corridor-policy`

Register or replace a governed native FX corridor policy

**Usage:** `iroha app settlement set-fx-corridor-policy [OPTIONS] --policy-id <POLICY_ID> --revision <REVISION> --owner <OWNER> --source-dataspace <SOURCE_DATASPACE> --source-asset <SOURCE_ASSET> --destination-dataspace <DESTINATION_DATASPACE> --destination-asset <DESTINATION_ASSET> --allowed-destination-alias-domain <ALLOWED_DESTINATION_ALIAS_DOMAINS> --oracle-feed-id <ORACLE_FEED_ID> --max-oracle-age-ms <MAX_ORACLE_AGE_MS> --max-source-amount-per-settlement <MAX_SOURCE_AMOUNT_PER_SETTLEMENT> --max-destination-amount-per-settlement <MAX_DESTINATION_AMOUNT_PER_SETTLEMENT> --velocity-window-ms <VELOCITY_WINDOW_MS> --max-settlements-per-window <MAX_SETTLEMENTS_PER_WINDOW> --max-source-amount-per-window <MAX_SOURCE_AMOUNT_PER_WINDOW> --max-destination-amount-per-window <MAX_DESTINATION_AMOUNT_PER_WINDOW>`

###### **Options:**

* `--policy-id <POLICY_ID>` — Stable policy identifier
* `--revision <REVISION>` — Monotonic policy revision (first revision is 1)
* `--owner <OWNER>` — Immutable owner that funds reserve liquidity and receives source currency
* `--source-dataspace <SOURCE_DATASPACE>` — Private dataspace holding the source balance
* `--source-asset <SOURCE_ASSET>` — Source-currency asset definition
* `--destination-dataspace <DESTINATION_DATASPACE>` — Private dataspace holding the destination reserve
* `--destination-asset <DESTINATION_ASSET>` — Destination-currency asset definition
* `--allowed-destination-alias-domain <ALLOWED_DESTINATION_ALIAS_DOMAINS>` — Allowed destination account-alias domain (repeat for each FI domain)
* `--oracle-feed-id <ORACLE_FEED_ID>` — Governed oracle feed supplying the destination/source rate
* `--max-oracle-age-ms <MAX_ORACLE_AGE_MS>` — Maximum accepted oracle-event age in milliseconds
* `--max-source-amount-per-settlement <MAX_SOURCE_AMOUNT_PER_SETTLEMENT>` — Maximum source amount per settlement
* `--max-destination-amount-per-settlement <MAX_DESTINATION_AMOUNT_PER_SETTLEMENT>` — Maximum destination amount per settlement
* `--velocity-window-ms <VELOCITY_WINDOW_MS>` — Fixed velocity-window length in milliseconds
* `--max-settlements-per-window <MAX_SETTLEMENTS_PER_WINDOW>` — Maximum settlements per velocity window
* `--max-source-amount-per-window <MAX_SOURCE_AMOUNT_PER_WINDOW>` — Maximum source amount per velocity window
* `--max-destination-amount-per-window <MAX_DESTINATION_AMOUNT_PER_WINDOW>` — Maximum destination amount per velocity window
* `--disabled` — Register the policy disabled



## `iroha app settlement fund-fx-corridor-escrow`

Fund a corridor's isolated reserve from its immutable owner

**Usage:** `iroha app settlement fund-fx-corridor-escrow --policy-id <POLICY_ID> --expected-policy-revision <EXPECTED_POLICY_REVISION> --destination-asset <DESTINATION_ASSET> --amount <AMOUNT>`

###### **Options:**

* `--policy-id <POLICY_ID>` — Stable corridor policy identifier
* `--expected-policy-revision <EXPECTED_POLICY_REVISION>` — Exact active policy revision
* `--destination-asset <DESTINATION_ASSET>` — Exact destination asset from the active policy
* `--amount <AMOUNT>` — Positive reserve quantity



## `iroha app settlement refund-fx-corridor-escrow`

Refund an inactive corridor reserve to its immutable owner

**Usage:** `iroha app settlement refund-fx-corridor-escrow --policy-id <POLICY_ID> --expected-policy-revision <EXPECTED_POLICY_REVISION> --destination-asset <DESTINATION_ASSET> --amount <AMOUNT>`

###### **Options:**

* `--policy-id <POLICY_ID>` — Stable corridor policy identifier
* `--expected-policy-revision <EXPECTED_POLICY_REVISION>` — Exact active policy revision
* `--destination-asset <DESTINATION_ASSET>` — Exact destination asset from the active policy
* `--amount <AMOUNT>` — Positive reserve quantity



## `iroha app settlement settle-fx-corridor`

Execute one policy-backed native FX corridor settlement

**Usage:** `iroha app settlement settle-fx-corridor --policy-id <POLICY_ID> --expected-policy-revision <EXPECTED_POLICY_REVISION> --source-asset <SOURCE_ASSET> --destination-asset <DESTINATION_ASSET> --settlement-id <SETTLEMENT_ID> --recipient <RECIPIENT> --source-amount <SOURCE_AMOUNT> --expected-destination-amount <EXPECTED_DESTINATION_AMOUNT> --oracle-feed-id <ORACLE_FEED_ID> --oracle-feed-config-version <ORACLE_FEED_CONFIG_VERSION> --oracle-slot <ORACLE_SLOT> --oracle-request-hash <ORACLE_REQUEST_HASH> --oracle-event-hash <ORACLE_EVENT_HASH>`

###### **Options:**

* `--policy-id <POLICY_ID>` — Stable corridor policy identifier
* `--expected-policy-revision <EXPECTED_POLICY_REVISION>` — Exact active policy revision expected by the signer
* `--source-asset <SOURCE_ASSET>` — Expected source asset from the referenced policy
* `--destination-asset <DESTINATION_ASSET>` — Expected destination asset from the referenced policy
* `--settlement-id <SETTLEMENT_ID>` — Globally unique settlement/replay identifier
* `--recipient <RECIPIENT>` — Destination-currency recipient account or alias
* `--source-amount <SOURCE_AMOUNT>` — Positive source-currency quantity
* `--expected-destination-amount <EXPECTED_DESTINATION_AMOUNT>` — Exact destination amount expected from the selected oracle event
* `--oracle-feed-id <ORACLE_FEED_ID>` — Exact oracle feed identifier
* `--oracle-feed-config-version <ORACLE_FEED_CONFIG_VERSION>` — Exact active oracle feed configuration version
* `--oracle-slot <ORACLE_SLOT>` — Exact oracle slot
* `--oracle-request-hash <ORACLE_REQUEST_HASH>` — Exact oracle request hash
* `--oracle-event-hash <ORACLE_EVENT_HASH>` — Typed hash of the complete retained oracle event



## `iroha app settlement get-fx-corridor-policy`

Read one governed native FX corridor policy

**Usage:** `iroha app settlement get-fx-corridor-policy --policy-id <POLICY_ID>`

###### **Options:**

* `--policy-id <POLICY_ID>` — Stable policy identifier



## `iroha app settlement list-fx-corridor-policies`

Read the complete governed native FX corridor policy registry

**Usage:** `iroha app settlement list-fx-corridor-policies`



## `iroha contract`

Contract app bundles, deploys, calls, and alias tooling

**Usage:** `iroha contract <COMMAND>`

###### **Subcommands:**

* `app` — Contract app bundle helpers
* `dev` — First-release contract developer workflow
* `code` — Contract code helpers
* `alias` — Contract alias helpers
* `derive-address` — Derive a canonical contract address locally from exact network identity, authority, nonce, and dataspace
* `call` — Submit a contract call through Torii (POST /v1/contracts/call)
* `view` — Execute a read-only contract view through Torii (POST /v1/contracts/view)
* `debug-view` — Execute a read-only contract view locally against compiled bytecode and optional fixtures
* `debug-call` — Execute a public contract entrypoint locally against compiled bytecode and optional fixtures
* `manifest` — Contract manifest helpers
* `simulate` — Run an offline simulation of IVM bytecode to see the queued ISIs and header metadata



## `iroha contract app`

Contract app bundle helpers

**Usage:** `iroha contract app <COMMAND>`

###### **Subcommands:**

* `build` — Build an `iroha.contracts.toml` manifest into a compiled deployable bundle



## `iroha contract app build`

Build an `iroha.contracts.toml` manifest into a compiled deployable bundle

**Usage:** `iroha contract app build [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the contract app manifest (`iroha.contracts.toml`)

  Default value: `iroha.contracts.toml`
* `--out <OUT>` — Optional output path for the compiled bundle JSON



## `iroha contract dev`

First-release contract developer workflow

**Usage:** `iroha contract dev <COMMAND>`

###### **Subcommands:**

* `check` — Lint, build interfaces, and run Kotodama tests from a contract manifest
* `build` — Build all contract artifacts and generated interface files
* `test` — Run Kotodama test suites declared or discovered for the manifest
* `doctor` — Validate local developer prerequisites for a contract manifest
* `schema` — Generate Markdown schema docs and sample payloads from interfaces
* `call` — Call a named manifest contract with typed payload validation
* `view` — View a named manifest contract with typed payload validation
* `smoke` — Run smoke assertions declared by the manifest



## `iroha contract dev check`

Lint, build interfaces, and run Kotodama tests from a contract manifest

**Usage:** `iroha contract dev check [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--locked` — Fail if generated interface files differ from checked-in files



## `iroha contract dev build`

Build all contract artifacts and generated interface files

**Usage:** `iroha contract dev build [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--locked` — Fail if generated interface files differ from checked-in files



## `iroha contract dev test`

Run Kotodama test suites declared or discovered for the manifest

**Usage:** `iroha contract dev test [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--path-filter <PATH_FILTER>` — Only run test source paths containing this text
* `--filter <FILTER>` — Only run test function names containing this text
* `--exact` — Match the complete test function name supplied by `--filter`
* `--format <FORMAT>` — Emit text or JSON from the native test runner when supported

  Default value: `text`
* `--coverage` — Run coverage mode instead of normal test mode
* `--profile-mode` — Run profile mode instead of normal test mode



## `iroha contract dev doctor`

Validate local developer prerequisites for a contract manifest

**Usage:** `iroha contract dev doctor [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy



## `iroha contract dev schema`

Generate Markdown schema docs and sample payloads from interfaces

**Usage:** `iroha contract dev schema [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--out <OUT>` — Output Markdown path. Omit to print Markdown to stdout



## `iroha contract dev call`

Call a named manifest contract with typed payload validation

**Usage:** `iroha contract dev call [OPTIONS] --contract <CONTRACT> --draft-intent-file <PATH> --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--contract <CONTRACT>` — Manifest contract name, for example `dlmm.dlmm_pool`
* `--authority <AUTHORITY>` — Authority account identifier. Defaults to the configured client authority
* `--private-key <HEX>` — Hex-encoded private key override used to sign and submit the call directly
* `--draft-only` — Request the exact unsigned transaction payload instead of direct submission
* `--draft-intent-file <PATH>` — Secret-free JSON file containing the exact invocation and final metadata authorized for the unsigned draft
* `--entrypoint <ENTRYPOINT>` — Contract entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Signature-bound gas limit. Defaults to the manifest profile value
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value
* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha contract dev view`

View a named manifest contract with typed payload validation

**Usage:** `iroha contract dev view [OPTIONS] --contract <CONTRACT> --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--contract <CONTRACT>` — Manifest contract name, for example `n3x.n3x_hub`
* `--authority <AUTHORITY>` — Authority account identifier used as the read context. Defaults to the configured client authority
* `--entrypoint <ENTRYPOINT>` — Contract view entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Gas limit applied to the view execution. Defaults to the manifest profile value
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value



## `iroha contract dev smoke`

Run smoke assertions declared by the manifest

**Usage:** `iroha contract dev smoke [OPTIONS]`

###### **Options:**

* `--manifest <MANIFEST>` — Path to the Iroha-first contract manifest

  Default value: `iroha.contracts.toml`
* `--profile <PROFILE>` — Named profile inside the manifest

  Default value: `local`
* `--zk` — Compile and validate with the explicit Kotodama ZK policy
* `--authority <AUTHORITY>` — Authority account identifier used for smoke views/calls. Defaults to the profile client config
* `--private-key <HEX>` — Hex-encoded private key override used for smoke call scenarios
* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha contract code`

Contract code helpers

**Usage:** `iroha contract code <COMMAND>`

###### **Subcommands:**

* `get` — Fetch on-chain contract code bytes by code hash and write to a file



## `iroha contract code get`

Fetch on-chain contract code bytes by code hash and write to a file

**Usage:** `iroha contract code get --code-hash <HEX64> --out <PATH>`

###### **Options:**

* `--code-hash <HEX64>` — Hex-encoded 32-byte code hash (0x optional)
* `--out <PATH>` — Output path to write the `.to` bytes



## `iroha contract alias`

Contract alias helpers

**Usage:** `iroha contract alias <COMMAND>`

###### **Subcommands:**

* `lease` — Lease or renew an on-chain contract alias for a contract address
* `release` — Release the current on-chain alias binding for a contract address
* `resolve` — Resolve an on-chain contract alias to its current canonical contract address



## `iroha contract alias lease`

Lease or renew an on-chain contract alias for a contract address

**Usage:** `iroha contract alias lease [OPTIONS] --contract-address <CONTRACT_ADDRESS> --contract-alias <CONTRACT_ALIAS>`

###### **Options:**

* `--contract-address <CONTRACT_ADDRESS>` — Canonical contract address to bind
* `--contract-alias <CONTRACT_ALIAS>` — Alias literal in `name::domain.dataspace` or `name::dataspace` format
* `--lease-expiry-ms <LEASE_EXPIRY_MS>` — Optional lease expiry timestamp in unix milliseconds. Omit for a permanent binding



## `iroha contract alias release`

Release the current on-chain alias binding for a contract address

**Usage:** `iroha contract alias release --contract-address <CONTRACT_ADDRESS>`

###### **Options:**

* `--contract-address <CONTRACT_ADDRESS>` — Canonical contract address whose alias binding should be cleared



## `iroha contract alias resolve`

Resolve an on-chain contract alias to its current canonical contract address

**Usage:** `iroha contract alias resolve <CONTRACT_ALIAS>`

###### **Arguments:**

* `<CONTRACT_ALIAS>` — Alias literal in `name::domain.dataspace` or `name::dataspace` format



## `iroha contract derive-address`

Derive a canonical contract address locally from exact network identity, authority, nonce, and dataspace

**Usage:** `iroha contract derive-address [OPTIONS] --authority <AUTHORITY> --deploy-nonce <DEPLOY_NONCE> --network-id <NETWORK_ID>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier (canonical I105 account literal)
* `--dataspace <DATASPACE>` — Target dataspace alias or numeric dataspace id (defaults to `universal`)

  Default value: `universal`
* `--deploy-nonce <DEPLOY_NONCE>` — Successful deploy nonce consumed for address derivation
* `--network-id <NETWORK_ID>` — Exact genesis-derived network identity committed into the contract address
* `--profile <PROFILE>` — Public network profile used to decode the authority account literal
* `--chain-discriminant <CHAIN_DISCRIMINANT>` — Explicit chain discriminant used to decode the authority account literal
* `--dataspace-id <DATASPACE_ID>` — Optional numeric dataspace id override for non-default dataspaces



## `iroha contract call`

Submit a contract call through Torii (POST /v1/contracts/call)

**Usage:** `iroha contract call [OPTIONS] --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier. Defaults to the configured client authority
* `--private-key <HEX>` — Hex-encoded private key override used to sign and submit the call directly
* `--draft-only` — Request the exact unsigned transaction payload instead of direct submission
* `--draft-intent-file <PATH>` — Secret-free JSON file containing the exact invocation and final metadata authorized for the unsigned draft
* `--simulate` — Simulate the contract call locally on Torii without submitting a transaction
* `--trace` — Run Torii simulation first and include the server-side execution trace in the submit response
* `--entrypoint <ENTRYPOINT>` — Contract entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Signature-bound gas limit forwarded to the contract call

  Default value: `1500000`
* `--contract-address <CONTRACT_ADDRESS>` — Canonical contract address
* `--contract-alias <CONTRACT_ALIAS>` — On-chain contract alias (`name::domain.dataspace` or `name::dataspace`)
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value
* `--wait` — Poll exact global status until state-resolved Applied finality
* `--submit-only` — Submit the transaction without waiting for finality
* `--timeout-ms <TIMEOUT_MS>` — Maximum time to wait before failing

  Default value: `30000`
* `--poll-interval-ms <POLL_INTERVAL_MS>` — Poll interval used while waiting

  Default value: `500`



## `iroha contract view`

Execute a read-only contract view through Torii (POST /v1/contracts/view)

**Usage:** `iroha contract view [OPTIONS] --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier used as the read context. Defaults to the configured client authority
* `--entrypoint <ENTRYPOINT>` — Contract view entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Gas limit applied to the local view execution

  Default value: `1500000`
* `--contract-address <CONTRACT_ADDRESS>` — Canonical contract address
* `--contract-alias <CONTRACT_ALIAS>` — On-chain contract alias (`name::domain.dataspace` or `name::dataspace`)
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value



## `iroha contract debug-view`

Execute a read-only contract view locally against compiled bytecode and optional fixtures

**Usage:** `iroha contract debug-view [OPTIONS] --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier used as the local read context. Defaults to the configured client authority
* `--code-file <CODE_FILE>` — Path to compiled `.to` file (mutually exclusive with --code-b64)
* `--code-b64 <CODE_B64>` — Base64-encoded code (mutually exclusive with --code-file)
* `--entrypoint <ENTRYPOINT>` — Contract view entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Gas limit applied to the local view execution

  Default value: `1500000`
* `--source-file <PATH>` — Optional source file used to render snippet context for trapped debug locations
* `--source-map-file <PATH>` — Hash-bound Kotodama source-map sidecar used to resolve trapped debug locations. Relative source paths in the sidecar are read from the current working directory
* `--accounts-json <JSON>` — Optional JSON array of canonical account ids available to iterator helpers
* `--accounts-file <PATH>` — File containing a JSON array of canonical account ids available to iterator helpers
* `--durable-state-json <JSON>` — Optional JSON object mapping durable state keys to encoded values (`0x...` hex or base64)
* `--durable-state-file <PATH>` — File containing a JSON object mapping durable state keys to encoded values (`0x...` hex or base64)
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value



## `iroha contract debug-call`

Execute a public contract entrypoint locally against compiled bytecode and optional fixtures

**Usage:** `iroha contract debug-call [OPTIONS] --entrypoint <ENTRYPOINT>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier used as the local call context. Defaults to the configured client authority
* `--code-file <CODE_FILE>` — Path to compiled `.to` file (mutually exclusive with --code-b64)
* `--code-b64 <CODE_B64>` — Base64-encoded code (mutually exclusive with --code-file)
* `--entrypoint <ENTRYPOINT>` — Contract entrypoint selector
* `--gas-limit <GAS_LIMIT>` — Gas limit applied to the local call execution

  Default value: `1500000`
* `--source-file <PATH>` — Optional source file used to render snippet context for trapped debug locations
* `--source-map-file <PATH>` — Hash-bound Kotodama source-map sidecar used to resolve trapped debug locations. Relative source paths in the sidecar are read from the current working directory
* `--accounts-json <JSON>` — Optional JSON array of canonical account ids available to iterator helpers
* `--accounts-file <PATH>` — File containing a JSON array of canonical account ids available to iterator helpers
* `--durable-state-json <JSON>` — Optional JSON object mapping durable state keys to encoded values (`0x...` hex or base64)
* `--durable-state-file <PATH>` — File containing a JSON object mapping durable state keys to encoded values (`0x...` hex or base64)
* `--payload-json <JSON>` — Inline Norito JSON payload object or value
* `--payload-file <PATH>` — File containing a Norito JSON payload object or value



## `iroha contract manifest`

Contract manifest helpers

**Usage:** `iroha contract manifest <COMMAND>`

###### **Subcommands:**

* `get` — Fetch on-chain contract manifest by code hash and either print or save (if --out is provided)
* `build` — Inspect the manifest embedded in compiled bytecode (with optional signing)



## `iroha contract manifest get`

Fetch on-chain contract manifest by code hash and either print or save (if --out is provided)

**Usage:** `iroha contract manifest get [OPTIONS] --code-hash <HEX64>`

###### **Options:**

* `--code-hash <HEX64>` — Hex-encoded 32-byte code hash (0x optional)
* `--out <PATH>` — Optional output path; if provided, writes JSON manifest to file, otherwise prints to stdout



## `iroha contract manifest build`

Inspect the manifest embedded in compiled bytecode (with optional signing)

**Usage:** `iroha contract manifest build [OPTIONS]`

###### **Options:**

* `--code-file <CODE_FILE>` — Path to compiled `.to` file (mutually exclusive with --code-b64)
* `--code-b64 <CODE_B64>` — Base64-encoded code (mutually exclusive with --code-file)
* `--sign-with <HEX>` — Hex-encoded private key for signing the manifest (optional)
* `--out <PATH>` — Optional output path; if omitted, prints to stdout



## `iroha contract simulate`

Run an offline simulation of IVM bytecode to see the queued ISIs and header metadata

**Usage:** `iroha contract simulate [OPTIONS] --authority <AUTHORITY> --private-key <HEX> --gas-limit <GAS_LIMIT>`

###### **Options:**

* `--authority <AUTHORITY>` — Authority account identifier for an ABI-bound generic IVM program
* `--private-key <HEX>` — Hex-encoded private key used to sign the simulated transaction
* `--code-file <CODE_FILE>` — Path to a generic (non-CNTR) compiled `.to` file (mutually exclusive with --code-b64)
* `--code-b64 <CODE_B64>` — Base64-encoded generic program (mutually exclusive with --code-file)
* `--gas-limit <GAS_LIMIT>` — Required executable gas bound in the typed fee payment intent



## `iroha tools`

Developer utilities and diagnostics

**Usage:** `iroha tools <COMMAND>`

###### **Subcommands:**

* `address` — Account address helpers (canonical I105 conversions)
* `crypto` — Cryptography helpers (SM2/SM3/SM4)
* `ivm` — IVM/ABI helpers (e.g., compute ABI hash)
* `markdown-help` — Output CLI documentation in Markdown format
* `version` — Show versions and git SHA of client and server



## `iroha tools address`

Account address helpers (canonical I105 conversions)

**Usage:** `iroha tools address <COMMAND>`

###### **Subcommands:**

* `convert` — Convert account addresses between supported textual encodings
* `audit` — Scan a list of addresses and emit conversion summaries
* `normalize` — Rewrite newline-separated addresses into canonical encodings



## `iroha tools address convert`

Convert account addresses between supported textual encodings

**Usage:** `iroha tools address convert [OPTIONS] <ADDRESS>`

###### **Arguments:**

* `<ADDRESS>` — Address literal to parse (canonical I105 or public key)

###### **Options:**

* `--expect-prefix <PREFIX>` — Require I105 inputs to match the provided network prefix
* `--profile <PROFILE>` — Public network profile to use for I105 parsing/rendering
* `--network-prefix <PREFIX>` — Network prefix to use when emitting i105 output
* `--format <FORMAT>` — Desired output format (defaults to I105)

  Default value: `i105`

  Possible values: `i105`, `canonical-hex`, `json`




## `iroha tools address audit`

Scan a list of addresses and emit conversion summaries

**Usage:** `iroha tools address audit [OPTIONS]`

###### **Options:**

* `--input <PATH>` — Path to a file containing newline-separated addresses (defaults to STDIN)
* `--expect-prefix <PREFIX>` — Require I105 inputs to match the provided network prefix
* `--profile <PROFILE>` — Public network profile to use for I105 parsing/rendering
* `--network-prefix <PREFIX>` — Network prefix to use when emitting i105 output
* `--allow-errors` — Succeed even if parse errors were encountered (allow auditing large dumps)
* `--format <FORMAT>` — Output format (`json` for structured reports, `csv` for spreadsheet ingestion)

  Default value: `json`

  Possible values: `json`, `csv`




## `iroha tools address normalize`

Rewrite newline-separated addresses into canonical encodings

**Usage:** `iroha tools address normalize [OPTIONS]`

###### **Options:**

* `--input <PATH>` — Path to a file containing newline-separated addresses (defaults to STDIN)
* `--output <PATH>` — Write the converted addresses to a file (defaults to STDOUT)
* `--expect-prefix <PREFIX>` — Require I105 inputs to match the provided network prefix
* `--profile <PROFILE>` — Public network profile to use for I105 parsing/rendering
* `--network-prefix <PREFIX>` — Network prefix to use when emitting i105 output
* `--format <FORMAT>` — Desired output format (defaults to I105)

  Default value: `i105`

  Possible values: `i105`, `canonical-hex`, `json`

* `--allow-errors` — Succeed even if parse errors were encountered (allow auditing large dumps)



## `iroha tools crypto`

Cryptography helpers (SM2/SM3/SM4)

**Usage:** `iroha tools crypto <COMMAND>`

###### **Subcommands:**

* `sm2` — SM2 key management helpers
* `sm3` — SM3 hashing helpers
* `sm4` — SM4 AEAD helpers (GCM/CCM modes)



## `iroha tools crypto sm2`

SM2 key management helpers

**Usage:** `iroha tools crypto sm2 <COMMAND>`

###### **Subcommands:**

* `keygen` — Generate a new SM2 key pair (distinguishing ID aware)
* `import` — Import an existing SM2 private key and derive metadata
* `export` — Export SM2 key material with config snippets



## `iroha tools crypto sm2 keygen`

Generate a new SM2 key pair (distinguishing ID aware)

**Usage:** `iroha tools crypto sm2 keygen [OPTIONS]`

###### **Options:**

* `--distid <DISTID>` — Distinguishing identifier embedded into SM2 signatures (defaults to `1234567812345678`)
* `--seed-hex <HEX>` — Optional seed (hex) for deterministic key generation. Helpful for tests/backups
* `--output <PATH>` — Write the generated JSON payload to a file instead of stdout
* `--quiet` — Suppress stdout printing of the JSON payload



## `iroha tools crypto sm2 import`

Import an existing SM2 private key and derive metadata

**Usage:** `iroha tools crypto sm2 import [OPTIONS]`

###### **Options:**

* `--private-key-hex <HEX>` — Existing SM2 private key in hex (32 bytes)
* `--private-key-file <PATH>` — Path to a file containing a hex-encoded SM2 private key (32 bytes)
* `--private-key-pem <PEM>` — Existing SM2 private key encoded as PKCS#8 PEM
* `--private-key-pem-file <PATH>` — Path to a PKCS#8 PEM file containing an SM2 private key
* `--public-key-pem <PEM>` — Optional SM2 public key in PEM (verified against derived public key)
* `--public-key-pem-file <PATH>` — Path to a PEM file containing an SM2 public key to verify against the derived key
* `--distid <DISTID>` — Distinguishing identifier used by the signer (defaults to `1234567812345678`)
* `--output <PATH>` — Write the derived JSON payload to a file instead of stdout
* `--quiet` — Suppress stdout printing of the JSON payload



## `iroha tools crypto sm2 export`

Export SM2 key material with config snippets

**Usage:** `iroha tools crypto sm2 export [OPTIONS]`

###### **Options:**

* `--private-key-hex <HEX>` — Existing SM2 private key in hex (32 bytes)
* `--private-key-file <PATH>` — Path to a file containing a hex-encoded SM2 private key (32 bytes)
* `--private-key-pem <PEM>` — PKCS#8 PEM-encoded SM2 private key
* `--private-key-pem-file <PATH>` — Path to a PKCS#8 PEM SM2 private key
* `--distid <DISTID>` — Distinguishing identifier used by the signer (defaults to `1234567812345678`)
* `--snippet-output <PATH>` — Write the TOML snippet to a file
* `--emit-json` — Emit the JSON key material alongside the config snippet
* `--quiet` — Suppress stdout output



## `iroha tools crypto sm3`

SM3 hashing helpers

**Usage:** `iroha tools crypto sm3 <COMMAND>`

###### **Subcommands:**

* `hash` — Hash input data with SM3



## `iroha tools crypto sm3 hash`

Hash input data with SM3

**Usage:** `iroha tools crypto sm3 hash [OPTIONS]`

###### **Options:**

* `--data <STRING>` — UTF-8 string to hash (mutually exclusive with other inputs)
* `--data-hex <HEX>` — Raw bytes to hash provided as hex
* `--file <PATH>` — Path to a file whose contents will be hashed
* `--output <PATH>` — Write the digest JSON to a file
* `--quiet` — Suppress stdout printing of the digest JSON



## `iroha tools crypto sm4`

SM4 AEAD helpers (GCM/CCM modes)

**Usage:** `iroha tools crypto sm4 <COMMAND>`

###### **Subcommands:**

* `gcm-seal` — Encrypt data with SM4-GCM
* `gcm-open` — Decrypt data with SM4-GCM
* `ccm-seal` — Encrypt data with SM4-CCM
* `ccm-open` — Decrypt data with SM4-CCM



## `iroha tools crypto sm4 gcm-seal`

Encrypt data with SM4-GCM

**Usage:** `iroha tools crypto sm4 gcm-seal [OPTIONS] --key-hex <HEX32> --nonce-hex <HEX24>`

###### **Options:**

* `--key-hex <HEX32>` — SM4 key (16 bytes hex)
* `--nonce-hex <HEX24>` — GCM nonce (12 bytes hex)
* `--aad-hex <HEX>` — Additional authenticated data (hex, optional)

  Default value: ``
* `--plaintext-hex <HEX>` — Plaintext to encrypt (hex, mutually exclusive with file)
* `--plaintext-file <PATH>` — Path to plaintext bytes to encrypt
* `--ciphertext-file <PATH>` — Write the ciphertext bytes to a file
* `--tag-file <PATH>` — Write the authentication tag bytes to a file
* `--quiet` — Suppress stdout JSON output



## `iroha tools crypto sm4 gcm-open`

Decrypt data with SM4-GCM

**Usage:** `iroha tools crypto sm4 gcm-open [OPTIONS] --key-hex <HEX32> --nonce-hex <HEX24>`

###### **Options:**

* `--key-hex <HEX32>` — SM4 key (16 bytes hex)
* `--nonce-hex <HEX24>` — GCM nonce (12 bytes hex)
* `--aad-hex <HEX>` — Additional authenticated data (hex, optional)

  Default value: ``
* `--ciphertext-hex <HEX>` — Ciphertext to decrypt (hex, mutually exclusive with file)
* `--ciphertext-file <PATH>` — Path to ciphertext bytes
* `--tag-hex <HEX>` — Authentication tag (hex, mutually exclusive with file)
* `--tag-file <PATH>` — Path to authentication tag bytes
* `--plaintext-file <PATH>` — Write the decrypted plaintext to a file
* `--quiet` — Suppress stdout JSON output



## `iroha tools crypto sm4 ccm-seal`

Encrypt data with SM4-CCM

**Usage:** `iroha tools crypto sm4 ccm-seal [OPTIONS] --key-hex <HEX32> --nonce-hex <HEX14-26>`

###### **Options:**

* `--key-hex <HEX32>` — SM4 key (16 bytes hex)
* `--nonce-hex <HEX14-26>` — CCM nonce (7–13 bytes hex)
* `--aad-hex <HEX>` — Additional authenticated data (hex, optional)

  Default value: ``
* `--plaintext-hex <HEX>` — Plaintext to encrypt (hex, mutually exclusive with file)
* `--plaintext-file <PATH>` — Path to plaintext bytes to encrypt
* `--tag-len <BYTES>` — CCM authentication tag length (bytes). Supported: 4,6,8,10,12,14,16. Defaults to 16

  Default value: `16`
* `--ciphertext-file <PATH>` — Write the ciphertext bytes to a file
* `--tag-file <PATH>` — Write the authentication tag bytes to a file
* `--quiet` — Suppress stdout JSON output



## `iroha tools crypto sm4 ccm-open`

Decrypt data with SM4-CCM

**Usage:** `iroha tools crypto sm4 ccm-open [OPTIONS] --key-hex <HEX32> --nonce-hex <HEX14-26>`

###### **Options:**

* `--key-hex <HEX32>` — SM4 key (16 bytes hex)
* `--nonce-hex <HEX14-26>` — CCM nonce (7–13 bytes hex)
* `--aad-hex <HEX>` — Additional authenticated data (hex, optional)

  Default value: ``
* `--ciphertext-hex <HEX>` — Ciphertext to decrypt (hex, mutually exclusive with file)
* `--ciphertext-file <PATH>` — Path to ciphertext bytes
* `--tag-hex <HEX>` — Authentication tag (hex, mutually exclusive with file)
* `--tag-file <PATH>` — Path to authentication tag bytes
* `--tag-len <BYTES>` — Expected CCM tag length (bytes). If omitted, inferred from the tag input
* `--plaintext-file <PATH>` — Write the decrypted plaintext to a file
* `--quiet` — Suppress stdout JSON output



## `iroha tools ivm`

IVM/ABI helpers (e.g., compute ABI hash)

**Usage:** `iroha tools ivm <COMMAND>`

###### **Subcommands:**

* `abi-hash` — Print the current ABI hash for a given policy (default: v1)
* `syscalls` — Print the canonical syscall list (min or markdown table)
* `manifest-gen` — Generate a minimal manifest (`code_hash` + `abi_hash`) from a compiled .to file



## `iroha tools ivm abi-hash`

Print the current ABI hash for a given policy (default: v1)

**Usage:** `iroha tools ivm abi-hash [OPTIONS]`

###### **Options:**

* `--policy <POLICY>` — Policy: v1

  Default value: `v1`
* `--uppercase` — Uppercase hex output (default: lowercase)



## `iroha tools ivm syscalls`

Print the canonical syscall list (min or markdown table)

**Usage:** `iroha tools ivm syscalls [OPTIONS]`

###### **Options:**

* `--format <FORMAT>` — Output format: 'min' (one per line) or 'markdown'

  Default value: `min`



## `iroha tools ivm manifest-gen`

Generate a minimal manifest (`code_hash` + `abi_hash`) from a compiled .to file

**Usage:** `iroha tools ivm manifest-gen --file <PATH>`

###### **Options:**

* `--file <PATH>` — Path to compiled IVM bytecode (.to)



## `iroha tools markdown-help`

Output CLI documentation in Markdown format

**Usage:** `iroha tools markdown-help`



## `iroha tools version`

Show versions and git SHA of client and server

**Usage:** `iroha tools version`



## `iroha taira`

SORA Taira public testnet diagnostics and canaries

**Usage:** `iroha taira <COMMAND>`

###### **Subcommands:**

* `doctor` — Check Taira read-side health and MCP route posture
* `public-reset` — Preflight or execute the strictly authorized compiled public reset
* `write-canary` — Prepare, submit, or recover exactly one authorized public-reset child
* `inrou-workspace` — Generate the canonical deploy-mode Inrou canary workspace from AArch64 guest assets
* `inrou-stage` — Build the canonical offline artifact stage that operators preseed into all validators
* `inrou-canary` — Register an exact preseeded stage, mutate explicitly, and verify the four-replica Inrou canary
* `inrou-check` — Revalidate an exact retained stage and verify its live four-replica service without mutation



## `iroha taira doctor`

Check Taira read-side health and MCP route posture

**Usage:** `iroha taira doctor [OPTIONS]`

###### **Options:**

* `--public-root <PUBLIC_ROOT>` — Public Torii root URL

  Default value: `https://taira.sora.org`
* `--json` — Emit a stable JSON report



## `iroha taira public-reset`

Preflight or execute the strictly authorized compiled public reset

**Usage:** `iroha taira public-reset <COMMAND>`

###### **Subcommands:**

* `preflight` — Verify the signed reset inventory and pinned local inputs without contacting any host
* `apply` — Execute the admitted reset with pinned SSH and runtime signing inputs



## `iroha taira public-reset preflight`

Verify the signed reset inventory and pinned local inputs without contacting any host

**Usage:** `iroha taira public-reset preflight --inventory <PATH> --authorization <PATH> --trusted-public-key <PATH> --ssh-identity <PATH> --known-hosts <PATH>`

###### **Options:**

* `--inventory <PATH>` — Exact V1 executor inventory
* `--authorization <PATH>` — Exact V1 authorization envelope
* `--trusted-public-key <PATH>` — Separately trusted exact V1 authorization public-key file
* `--ssh-identity <PATH>` — Runtime-only owner-private OpenSSH identity
* `--known-hosts <PATH>` — Runtime-only owner-private pinned OpenSSH known-hosts file



## `iroha taira public-reset apply`

Execute the admitted reset with pinned SSH and runtime signing inputs

**Usage:** `iroha taira public-reset apply [OPTIONS] --inventory <PATH> --authorization <PATH> --trusted-public-key <PATH> --ssh-identity <PATH> --known-hosts <PATH>`

###### **Options:**

* `--inventory <PATH>` — Exact V1 executor inventory
* `--authorization <PATH>` — Exact V1 authorization envelope
* `--trusted-public-key <PATH>` — Separately trusted exact V1 authorization public-key file
* `--ssh-identity <PATH>` — Runtime-only owner-private OpenSSH identity
* `--known-hosts <PATH>` — Runtime-only owner-private pinned OpenSSH known-hosts file
* `--runtime-client-config <PATH>` — Owner-private signing config for forward work or read-only mutation recovery
* `--validator-client-config <PATH>` — Four ordered validator read configs for forward work or RestartProof recovery
* `--onboarding-token <PATH>` — Owner-private account-onboarding token required only for forward work
* `--inrou-stage-dir <DIR>` — Exact deploy-mode Inrou stage directory required only for forward work



## `iroha taira write-canary`

Prepare, submit, or recover exactly one authorized public-reset child

**Usage:** `iroha taira write-canary [OPTIONS] --operation <OPERATION> --authorization-sha256 <AUTHORIZATION_SHA256> --authorization-nonce <AUTHORIZATION_NONCE> --mutation-phase <MUTATION_PHASE> --idempotency-key <IDEMPOTENCY_KEY> --execution-expires-at-unix-ms <EXECUTION_EXPIRES_AT_UNIX_MS> <--prepare-envelope|--submit-prepared-envelope-fd <FD>|--recover-prepared-envelope-fd <FD>>`

###### **Options:**

* `--public-root <PUBLIC_ROOT>` — Public Torii root URL

  Default value: `https://taira.sora.org`
* `--faucet-authority <FAUCET_AUTHORITY>` — Independently trusted faucet authority; required for the faucet child
* `--faucet-asset-id <FAUCET_ASSET_ID>` — Independently trusted exact faucet asset definition; required for the faucet child
* `--faucet-amount <FAUCET_AMOUNT>` — Independently trusted exact faucet transfer amount; required for the faucet child
* `--onboarding-token-file <PATH>` — Owner-only onboarding token; required only while preparing or submitting the envelope
* `--operation <OPERATION>` — Exact ordered child operation; each invocation handles one transaction only

  Possible values:
  - `onboarding`:
    Prepare, submit, or recover the sponsored account/alias onboarding transaction
  - `faucet`:
    Prepare, submit, or recover the faucet funding transaction
  - `final-canary`:
    Prepare, submit, or recover the final authority-signed log canary transaction

* `--authorization-sha256 <AUTHORIZATION_SHA256>` — Exact admitted public-reset authorization digest
* `--authorization-nonce <AUTHORIZATION_NONCE>` — Exact admitted public-reset authorization nonce
* `--mutation-phase <MUTATION_PHASE>` — Exact write-canary phase (`pre_edge` or `post_edge`)
* `--idempotency-key <IDEMPOTENCY_KEY>` — Exact lowercase SHA-256 idempotency key bound into the canary transaction
* `--execution-expires-at-unix-ms <EXECUTION_EXPIRES_AT_UNIX_MS>` — Exact signed execution expiry; preparation and submission are barred at this instant
* `--prepare-envelope` — Quote and sign one exact envelope without performing any ledger mutation
* `--prepared-output-fd <FD>` — Inherited writable numeric descriptor receiving canonical envelope JSON
* `--submit-prepared-envelope-fd <FD>` — Submit only exact bytes read from this inherited numeric envelope descriptor
* `--recover-prepared-envelope-fd <FD>` — Read-only classify exact bytes read from this inherited numeric envelope descriptor
* `--prerequisite-envelope-fd <FD>` — Inherited descriptor for the exact Applied predecessor envelope during preparation
* `--json` — Emit a stable JSON receipt



## `iroha taira inrou-workspace`

Generate the canonical deploy-mode Inrou canary workspace from AArch64 guest assets

**Usage:** `iroha taira inrou-workspace [OPTIONS] --kernel <PATH> --rootfs <PATH> --initrd <PATH> --output-dir <PATH>`

###### **Options:**

* `--kernel <PATH>` — Direct regular AArch64 kernel image prepared for PortableVM
* `--rootfs <PATH>` — Direct regular AArch64 ext4 root filesystem image prepared for PortableVM
* `--initrd <PATH>` — Direct regular AArch64 initrd image prepared for PortableVM
* `--output-dir <PATH>` — Fresh owner-only directory to create with the exact canonical workspace layout
* `--json` — Emit a stable JSON report



## `iroha taira inrou-stage`

Build the canonical offline artifact stage that operators preseed into all validators

**Usage:** `iroha taira inrou-stage [OPTIONS] --mode <MODE> --container <PATH> --service <PATH> --bundle-file <PATH> --sorafs-retention-epoch <UNIX_SECONDS> --stage-dir <PATH> --bind-validator-config-dir <PATH>`

###### **Options:**

* `--mode <MODE>` — Build the exact deploy or upgrade revision; no mutation mode is inferred

  Possible values:
  - `deploy`:
    Register a new canary service
  - `upgrade`:
    Replace an already-deployed canary revision

* `--container <PATH>` — Path to the canonical strict-null, unpublished four-replica Inrou source manifest
* `--service <PATH>` — Path to the matching public HttpService manifest
* `--bundle-file <PATH>` — Canonical service bundle bytes to preseed
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second SoraFS retention boundary embedded in both staged manifests. Retain and reuse this value when reproducing the same release stage
* `--placement-target <VALIDATOR,PEER>` — Exact validator account and peer identity eligible for one staged replica. Supply exactly four `VALIDATOR,PEER` values matching the public-reset inventory
* `--stage-dir <PATH>` — Fresh owner-only directory that will contain exact manifests and payloads
* `--bind-validator-config-dir <PATH>` — Owner-private directory containing exactly peer0.toml through peer3.toml to bind
* `--json` — Emit a stable JSON receipt



## `iroha taira inrou-canary`

Register an exact preseeded stage, mutate explicitly, and verify the four-replica Inrou canary

**Usage:** `iroha taira inrou-canary [OPTIONS] --stage-dir <PATH> --mode <MODE> --operation <OPERATION> --authorization-sha256 <AUTHORIZATION_SHA256> --authorization-nonce <AUTHORIZATION_NONCE> --mutation-phase <MUTATION_PHASE> --idempotency-key <IDEMPOTENCY_KEY> --execution-expires-at-unix-ms <EXECUTION_EXPIRES_AT_UNIX_MS> <--prepare-envelope|--submit-prepared-envelope-fd <FD>|--recover-prepared-envelope-fd <FD>>`

###### **Options:**

* `--public-root <PUBLIC_ROOT>` — Public Torii root URL used for mutation, status, and route probes

  Default value: `https://taira.sora.org`
* `--stage-dir <PATH>` — Owner-only stage created by `iroha taira inrou-stage` and preseeded into all validators
* `--mode <MODE>` — Submit an explicit deploy or upgrade mutation; conflicts are never retried as another mode

  Possible values:
  - `deploy`:
    Register a new canary service
  - `upgrade`:
    Replace an already-deployed canary revision

* `--operation <OPERATION>` — Exact ordered child operation; each invocation handles one transaction only

  Possible values:
  - `bundle-pin`:
    Register the canonical service-bundle manifest
  - `guest-pin`:
    Register the canonical AArch64 guest-image manifest
  - `discovery-pin`:
    Register the canonical public-discovery manifest
  - `service-mutation`:
    Deploy or upgrade the service after all three manifests are Approved

* `--authorization-sha256 <AUTHORIZATION_SHA256>` — Exact admitted public-reset authorization digest
* `--authorization-nonce <AUTHORIZATION_NONCE>` — Exact admitted public-reset authorization nonce
* `--mutation-phase <MUTATION_PHASE>` — Exact mutation phase; Inrou V1 is admitted only in `pre_edge`
* `--idempotency-key <IDEMPOTENCY_KEY>` — Exact child-kind-derived idempotency key bound into the signed transaction
* `--execution-expires-at-unix-ms <EXECUTION_EXPIRES_AT_UNIX_MS>` — Exact signed execution expiry; preparation and submission are barred at this instant
* `--prepare-envelope` — Quote and sign one exact transaction envelope without submitting it
* `--prepared-output-fd <FD>` — Inherited writable descriptor receiving canonical envelope JSON
* `--submit-prepared-envelope-fd <FD>` — Submit only exact bytes read from this inherited descriptor
* `--recover-prepared-envelope-fd <FD>` — Read-only classify exact bytes read from this inherited descriptor
* `--prerequisite-envelope-fd <FD>` — Inherited exact Applied predecessor envelope, required only while preparing
* `--timeout-secs <SECS>` — Maximum convergence time for adverts, placements, runtime health, and all four routes

  Default value: `180`
* `--json` — Emit a stable redacted JSON receipt



## `iroha taira inrou-check`

Revalidate an exact retained stage and verify its live four-replica service without mutation

**Usage:** `iroha taira inrou-check [OPTIONS] --stage-dir <PATH> --mode <MODE>`

###### **Options:**

* `--public-root <PUBLIC_ROOT>` — Public Torii root URL used for network preflight and public route reads.

   Signed Soracloud status reads continue to use the Torii URL from the selected client configuration so validator-specific restart checks cannot collapse onto the public edge.

  Default value: `https://taira.sora.org`
* `--stage-dir <PATH>` — Owner-only stage created by `iroha taira inrou-stage` and retained after deployment
* `--mode <MODE>` — Exact revision mode encoded by the retained stage

  Possible values:
  - `deploy`:
    Register a new canary service
  - `upgrade`:
    Replace an already-deployed canary revision

* `--timeout-secs <SECS>` — Maximum convergence time for signed status and all four route identities

  Default value: `180`
* `--json` — Emit a stable JSON evidence receipt



## `iroha offline`

Offline encoders, reports, and diagnostics

**Usage:** `iroha offline <COMMAND>`

###### **Subcommands:**

* `kagemusha` — Governed Kagemusha recursive-release operations
* `petal` — Petal Stream optical handoff tooling



## `iroha offline kagemusha`

Governed Kagemusha recursive-release operations

**Usage:** `iroha offline kagemusha <COMMAND>`

###### **Subcommands:**

* `lifecycle-v4` — Prepare, independently sign, assemble, and submit one exact lifecycle transaction
* `rollout-v4` — Execute the phase-separated, exact-byte Kagemusha V4 rollout corridor



## `iroha offline kagemusha lifecycle-v4`

Prepare, independently sign, assemble, and submit one exact lifecycle transaction

**Usage:** `iroha offline kagemusha lifecycle-v4 <COMMAND>`

###### **Subcommands:**

* `prepare` — Prepare the exact ordinary transaction and a 60-second authenticated fee-quote draft
* `sign-fee-quote` — Produce one detached member signature for the exact fee-quote request
* `finalize-fee-quote` — Verify the fee-quote quorum, obtain the quote, and freeze the exact payload
* `sign-transaction` — Produce one detached member signature for the exact frozen payload
* `assemble-transaction` — Verify and assemble at least two detached signatures into exact transaction wire
* `submit-transaction` — Submit the exact assembled wire without rebuilding or re-signing it



## `iroha offline kagemusha lifecycle-v4 prepare`

Prepare the exact ordinary transaction and a 60-second authenticated fee-quote draft

**Usage:** `iroha offline kagemusha lifecycle-v4 prepare [OPTIONS] --kind <KIND> --governance-authority <I105_ACCOUNT> --instruction-json <PATH> --output <PATH>`

###### **Options:**

* `--kind <KIND>` — Required lifecycle kind; Stage maps to the native Activate instruction

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Canonical I105 multisig account that authorizes the transition
* `--trusted-anchor-height <HEIGHT>` — Already-finalized anchor height; required only for Stage to bind its receipt horizon
* `--instruction-json <PATH>` — Kagami's exact JSON array containing one native lifecycle instruction
* `--output <PATH>` — Absent destination for the canonical fee-quote draft; never replaced



## `iroha offline kagemusha lifecycle-v4 sign-fee-quote`

Produce one detached member signature for the exact fee-quote request

**Usage:** `iroha offline kagemusha lifecycle-v4 sign-fee-quote --kind <KIND> --governance-authority <I105_ACCOUNT> --expected-network-id <NETWORK_ID> --expected-draft-sha256 <64_HEX> --draft <PATH> --output <PATH>`

###### **Options:**

* `--kind <KIND>` — Lifecycle kind expected in the draft

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Independently expected canonical I105 multisig authority
* `--expected-network-id <NETWORK_ID>` — Independently expected NetworkId embedded in the draft; does not consult client config
* `--expected-draft-sha256 <64_HEX>` — Independently expected lowercase or uppercase 64-hex SHA-256 of the exact draft file
* `--draft <PATH>` — Exact canonical fee-quote draft; stale or excessively future-dated drafts are rejected
* `--output <PATH>` — Absent destination for this signer's canonical detached signature



## `iroha offline kagemusha lifecycle-v4 finalize-fee-quote`

Verify the fee-quote quorum, obtain the quote, and freeze the exact payload

**Usage:** `iroha offline kagemusha lifecycle-v4 finalize-fee-quote [OPTIONS] --kind <KIND> --governance-authority <I105_ACCOUNT> --draft <PATH> --output <PATH>`

###### **Options:**

* `--kind <KIND>` — Lifecycle kind expected in the draft

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Independently expected canonical I105 multisig authority
* `--draft <PATH>` — Exact canonical fee-quote draft; all signatures and finalization must fit its 60-second window
* `--signature <PATH>` — At least two independently produced fee-quote signatures
* `--output <PATH>` — Absent destination for the exact quoted transaction payload



## `iroha offline kagemusha lifecycle-v4 sign-transaction`

Produce one detached member signature for the exact frozen payload

**Usage:** `iroha offline kagemusha lifecycle-v4 sign-transaction --kind <KIND> --governance-authority <I105_ACCOUNT> --expected-network-id <NETWORK_ID> --expected-payload-sha256 <64_HEX> --payload <PATH> --output <PATH>`

###### **Options:**

* `--kind <KIND>` — Lifecycle kind expected in the payload

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Independently expected canonical I105 multisig authority
* `--expected-network-id <NETWORK_ID>` — Independently expected NetworkId embedded in the payload; does not consult client config
* `--expected-payload-sha256 <64_HEX>` — Independently expected lowercase or uppercase 64-hex SHA-256 of the exact payload file
* `--payload <PATH>` — Exact frozen TransactionPayload archive
* `--output <PATH>` — Absent destination for this signer's canonical detached signature



## `iroha offline kagemusha lifecycle-v4 assemble-transaction`

Verify and assemble at least two detached signatures into exact transaction wire

**Usage:** `iroha offline kagemusha lifecycle-v4 assemble-transaction [OPTIONS] --kind <KIND> --governance-authority <I105_ACCOUNT> --payload <PATH> --output <PATH>`

###### **Options:**

* `--kind <KIND>` — Lifecycle kind expected in the payload

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Independently expected canonical I105 multisig authority
* `--payload <PATH>` — Exact frozen TransactionPayload archive
* `--signature <PATH>` — At least two independently produced transaction signatures
* `--output <PATH>` — Absent destination for canonical versioned SignedTransaction wire



## `iroha offline kagemusha lifecycle-v4 submit-transaction`

Submit the exact assembled wire without rebuilding or re-signing it

**Usage:** `iroha offline kagemusha lifecycle-v4 submit-transaction --kind <KIND> --governance-authority <I105_ACCOUNT> --transaction <PATH> --expected-receipt-signer <PUBLIC_KEY> --receipt-output <PATH> --write-authorized`

###### **Options:**

* `--kind <KIND>` — Lifecycle kind expected in the signed wire

  Possible values:
  - `stage`:
    Stage the governed release (`ActivateKagemushaRecursiveReleaseV4` on wire)
  - `enable`:
    Enable issuance after the staged release closes its canary gates
  - `cancel`:
    Cancel a staged release
  - `deactivate`:
    Deactivate issuance for an enabled release

* `--governance-authority <I105_ACCOUNT>` — Independently expected canonical I105 multisig authority
* `--transaction <PATH>` — Exact canonical versioned SignedTransaction wire
* `--expected-receipt-signer <PUBLIC_KEY>` — Independently pinned Torii receipt signer public key
* `--receipt-output <PATH>` — Absent destination for the verified canonical submission receipt
* `--write-authorized` — Explicit authorization for this production lifecycle write



## `iroha offline kagemusha rollout-v4`

Execute the phase-separated, exact-byte Kagemusha V4 rollout corridor

**Usage:** `iroha offline kagemusha rollout-v4 <COMMAND>`

###### **Subcommands:**

* `create-expectations` — Root-sign and immutably publish pre-submission expectations
* `submit` — Submit the exact transaction embedded in authenticated expectations
* `finalize-receipt` — Collect finalized evidence and immutably publish the issuer-signed receipt
* `create-canary-authorization` — Construct and controller-authorize one promotion-bound canary transaction
* `submit-canary-authorization` — Finalize the on-chain reservation for the exact authorized canary transaction
* `submit-canary` — Journal and submit the exact controller-authorized canary transaction
* `finalize-canary-evidence` — Collect the canary's post-activation finality extension and publish full evidence
* `finalize-validator-liveness` — Challenge all four qualified validators and publish issuer-signed liveness evidence



## `iroha offline kagemusha rollout-v4 create-expectations`

Root-sign and immutably publish pre-submission expectations

**Usage:** `iroha offline kagemusha rollout-v4 create-expectations [OPTIONS] --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --activation-transaction <ABSOLUTE_PATH> --trusted-finality-anchor <ABSOLUTE_PATH> --receipt-issuer <PUBLIC_KEY> --controller-private-key-file <ABSOLUTE_PATH> --output <ABSOLUTE_PATH>`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--validator-seal <ABSOLUTE_PATH>` — Exactly four root-owned validator qualification seals
* `--activation-transaction <ABSOLUTE_PATH>` — Complete, already-authorized versioned SignedTransaction wire
* `--trusted-finality-anchor <ABSOLUTE_PATH>` — Independently governed, already-finalized anchor proof
* `--receipt-issuer <PUBLIC_KEY>` — Independent durable-receipt issuer public key
* `--controller-private-key-file <ABSOLUTE_PATH>` — Runtime-only owner-private promotion-controller key file
* `--output <ABSOLUTE_PATH>` — Exact absent promotion-keyed expectations destination; it is never replaced



## `iroha offline kagemusha rollout-v4 submit`

Submit the exact transaction embedded in authenticated expectations

**Usage:** `iroha offline kagemusha rollout-v4 submit --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --write-authorized`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--write-authorized` — Explicit authorization for this network write



## `iroha offline kagemusha rollout-v4 finalize-receipt`

Collect finalized evidence and immutably publish the issuer-signed receipt

**Usage:** `iroha offline kagemusha rollout-v4 finalize-receipt --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --issuer-private-key-file <ABSOLUTE_PATH> --output <ABSOLUTE_PATH>`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--issuer-private-key-file <ABSOLUTE_PATH>` — Runtime-only owner-private receipt-issuer key file
* `--output <ABSOLUTE_PATH>` — Exact absent promotion-keyed receipt destination; it is never replaced



## `iroha offline kagemusha rollout-v4 create-canary-authorization`

Construct and controller-authorize one promotion-bound canary transaction

**Usage:** `iroha offline kagemusha rollout-v4 create-canary-authorization --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --activation-receipt <ABSOLUTE_PATH> --canary-ttl-ms <MILLISECONDS> --canary-expires-at-height <HEIGHT> --controller-private-key-file <ABSOLUTE_PATH> --output <ABSOLUTE_PATH>`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--activation-receipt <ABSOLUTE_PATH>` — Exact immutable issuer-signed activation-finality receipt
* `--canary-ttl-ms <MILLISECONDS>` — Short authorization lifetime; the transaction TTL reserves 30 seconds for construction
* `--canary-expires-at-height <HEIGHT>` — Exact exclusive consensus-height expiry embedded in the canary transaction
* `--controller-private-key-file <ABSOLUTE_PATH>` — Runtime-only owner-private promotion-controller key file
* `--output <ABSOLUTE_PATH>` — Exact absent promotion-keyed authorization destination; it is never replaced



## `iroha offline kagemusha rollout-v4 submit-canary-authorization`

Finalize the on-chain reservation for the exact authorized canary transaction

**Usage:** `iroha offline kagemusha rollout-v4 submit-canary-authorization --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --activation-receipt <ABSOLUTE_PATH> --canary-authorization <ABSOLUTE_PATH> --write-authorized`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--activation-receipt <ABSOLUTE_PATH>` — Exact immutable issuer-signed activation-finality receipt
* `--canary-authorization <ABSOLUTE_PATH>` — Exact controller-signed canary authorization to reserve on-chain
* `--write-authorized` — Explicit authorization for this production reservation write



## `iroha offline kagemusha rollout-v4 submit-canary`

Journal and submit the exact controller-authorized canary transaction

**Usage:** `iroha offline kagemusha rollout-v4 submit-canary --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --activation-receipt <ABSOLUTE_PATH> --canary-authorization <ABSOLUTE_PATH> --write-authorized`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--activation-receipt <ABSOLUTE_PATH>` — Exact immutable issuer-signed activation-finality receipt
* `--canary-authorization <ABSOLUTE_PATH>` — Exact controller-signed canary authorization
* `--write-authorized` — Explicit authorization for this production canary network write



## `iroha offline kagemusha rollout-v4 finalize-canary-evidence`

Collect the canary's post-activation finality extension and publish full evidence

**Usage:** `iroha offline kagemusha rollout-v4 finalize-canary-evidence --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --activation-receipt <ABSOLUTE_PATH> --canary-authorization <ABSOLUTE_PATH> --issuer-private-key-file <ABSOLUTE_PATH> --output <ABSOLUTE_PATH>`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--activation-receipt <ABSOLUTE_PATH>` — Exact immutable issuer-signed activation-finality receipt
* `--canary-authorization <ABSOLUTE_PATH>` — Exact controller-signed canary authorization
* `--issuer-private-key-file <ABSOLUTE_PATH>` — Runtime-only owner-private receipt-issuer key file
* `--output <ABSOLUTE_PATH>` — Exact absent promotion-keyed canary-evidence destination; it is never replaced



## `iroha offline kagemusha rollout-v4 finalize-validator-liveness`

Challenge all four qualified validators and publish issuer-signed liveness evidence

**Usage:** `iroha offline kagemusha rollout-v4 finalize-validator-liveness [OPTIONS] --promotion-controller <PUBLIC_KEY> --promotion-reservation <ABSOLUTE_PATH> --expectations <ABSOLUTE_PATH> --activation-receipt <ABSOLUTE_PATH> --canary-authorization <ABSOLUTE_PATH> --canary-evidence <ABSOLUTE_PATH> --issuer-private-key-file <ABSOLUTE_PATH> --output <ABSOLUTE_PATH>`

###### **Options:**

* `--promotion-controller <PUBLIC_KEY>` — Independently pinned promotion-controller public key
* `--promotion-reservation <ABSOLUTE_PATH>` — Root-owned canonical promotion reservation
* `--expectations <ABSOLUTE_PATH>` — Root-owned canonical activation expectations
* `--activation-receipt <ABSOLUTE_PATH>` — Exact immutable issuer-signed activation-finality receipt
* `--canary-authorization <ABSOLUTE_PATH>` — Exact controller-signed canary authorization
* `--canary-evidence <ABSOLUTE_PATH>` — Exact immutable issuer-signed canary evidence
* `--validator <PEER_ID=HTTPS_ORIGIN>` — Four exact `PEER_ID=https://dns-origin[:port]` mappings
* `--collection-ttl-ms <MILLISECONDS>` — Lifetime of the precommitted collection challenge, at most five minutes

  Default value: `300000`
* `--issuer-private-key-file <ABSOLUTE_PATH>` — Runtime-only owner-private receipt-issuer key file
* `--output <ABSOLUTE_PATH>` — Exact absent promotion-keyed liveness-evidence destination



## `iroha offline petal`

Petal Stream optical handoff tooling

**Usage:** `iroha offline petal <COMMAND>`

###### **Subcommands:**

* `encode` — Encode one payload into a deterministic Petal PNG and manifest
* `eval-capture` — Evaluate rendered Petal PNG frames through the deterministic decoder
* `simulate-realtime` — Replay rendered Petal PNG frames in deterministic realtime loop order
* `score-styles` — Score the published Petal style set against deterministic capture gates



## `iroha offline petal encode`

Encode one payload into a deterministic Petal PNG and manifest

**Usage:** `iroha offline petal encode [OPTIONS] --input <PATH> --output <DIR>`

###### **Options:**

* `--input <PATH>` — Payload bytes to encode into the Petal Stream grid
* `--output <DIR>` — Output directory for rendered frames and manifest
* `--format <FORMAT>` — Output format. PNG is implemented for all deterministic Petal channels

  Default value: `png`

  Possible values:
  - `png`:
    Single-frame PNG output
  - `gif`:
    Animated GIF output is implemented for the binary grid channel

* `--style <STYLE>` — Renderer style. Binary grid uses `sora-temple`; Katakana uses `sora-temple-command`

  Default value: `sora-temple`

  Possible values:
  - `sora-temple`:
    Decode-critical SORA temple grid layer
  - `sora-temple-command`:
    Katakana command styling for the deterministic Katakana-base94 channel

* `--channel <CHANNEL>` — Visual channel

  Default value: `binary-grid`

  Possible values:
  - `binary-grid`:
    Binary luminance grid suitable for scanner bring-up
  - `katakana-base94`:
    Deterministic Katakana command-tile rendering with Petal luminance anchors

* `--katakana-preset <KATAKANA_PRESET>` — Katakana layout preset. Defaults to balanced for katakana-base94

  Possible values:
  - `balanced`:
    Balanced command-tile density for ordinary camera distances
  - `distance-safe`:
    Larger cells for longer-distance camera capture

* `--dimension <DIMENSION>` — Square output dimension in pixels

  Default value: `1024`
* `--fps <FPS>` — Frames per second metadata for downstream animation tooling

  Default value: `24`
* `--animation-frames <ANIMATION_FRAMES>` — Number of deterministic animation frames to render

  Default value: `1`
* `--grid-size <GRID_SIZE>` — Override the Petal grid size. Zero keeps automatic sizing

  Default value: `0`
* `--border <BORDER>` — Override the Petal grid border thickness

  Default value: `1`
* `--anchor-size <ANCHOR_SIZE>` — Override the Petal grid anchor size

  Default value: `3`



## `iroha offline petal eval-capture`

Evaluate rendered Petal PNG frames through the deterministic decoder

**Usage:** `iroha offline petal eval-capture [OPTIONS] --input-dir <DIR>`

###### **Options:**

* `--input-dir <DIR>` — Directory containing rendered PNG frames, or an encode output directory with manifest.json
* `--channel <CHANNEL>` — Visual channel used by the rendered input

  Default value: `binary-grid`

  Possible values:
  - `binary-grid`:
    Binary luminance grid suitable for scanner bring-up
  - `katakana-base94`:
    Deterministic Katakana command-tile rendering with Petal luminance anchors

* `--profile <PROFILE>` — Deterministic capture profile label recorded in the report

  Default value: `default`

  Possible values:
  - `default`:
    Default production deterministic capture profile

* `--perturb-capture` — Apply deterministic profile luminance perturbation before decoding

  Default value: `false`
* `--capture-seed <SEED>` — Deterministic seed mixed into capture perturbation

  Default value: `0`
* `--capture-attempts <ATTEMPTS>` — Override perturbed capture attempt count per rendered source frame
* `--capture-dark-luma <DARK_LUMA>` — Override perturbed dark-cell luminance
* `--capture-light-luma <LIGHT_LUMA>` — Override perturbed light-cell luminance
* `--capture-luminance-jitter <LUMINANCE_JITTER>` — Override perturbed deterministic luminance jitter
* `--capture-downscale-cells <DOWNSCALE_CELLS>` — Average capture samples into cell blocks before decoding

  Default value: `1`
* `--capture-blur-radius <BLUR_RADIUS>` — Apply deterministic box blur over capture samples before decoding

  Default value: `0`
* `--capture-motion-blur-cells <MOTION_BLUR_CELLS>` — Apply deterministic horizontal motion blur over capture samples before decoding

  Default value: `0`
* `--capture-noise-amplitude <NOISE_AMPLITUDE>` — Apply deterministic per-cell sensor noise before decoding

  Default value: `0`
* `--capture-exposure-offset <EXPOSURE_OFFSET>` — Add a deterministic exposure offset to capture samples before decoding

  Default value: `0`
* `--min-success-ratio <RATIO>` — Minimum success ratio as a decimal in [0, 1], e.g. 0.95
* `--min-success-ratio-bps <MIN_SUCCESS_RATIO_BPS>` — Minimum success ratio in basis points
* `--output-report <PATH>` — Optional JSON report path. The full report is printed to stdout when omitted
* `--grid-size <GRID_SIZE>` — Petal grid size for manifest-free directories. Zero requires a manifest

  Default value: `0`
* `--border <BORDER>` — Petal grid border thickness for manifest-free directories

  Default value: `1`
* `--anchor-size <ANCHOR_SIZE>` — Petal grid anchor size for manifest-free directories

  Default value: `3`



## `iroha offline petal simulate-realtime`

Replay rendered Petal PNG frames in deterministic realtime loop order

**Usage:** `iroha offline petal simulate-realtime [OPTIONS] --input-dir <DIR>`

###### **Options:**

* `--input-dir <DIR>` — Directory containing rendered PNG frames, or an encode output directory with manifest.json
* `--channel <CHANNEL>` — Visual channel used by the rendered input

  Default value: `binary-grid`

  Possible values:
  - `binary-grid`:
    Binary luminance grid suitable for scanner bring-up
  - `katakana-base94`:
    Deterministic Katakana command-tile rendering with Petal luminance anchors

* `--profile <PROFILE>` — Deterministic capture profile label recorded in the report

  Default value: `default`

  Possible values:
  - `default`:
    Default production deterministic capture profile

* `--perturb-capture` — Apply deterministic profile luminance perturbation before decoding

  Default value: `false`
* `--capture-seed <SEED>` — Deterministic seed mixed into capture perturbation

  Default value: `0`
* `--capture-attempts <ATTEMPTS>` — Override perturbed capture attempt count per rendered source frame
* `--capture-dark-luma <DARK_LUMA>` — Override perturbed dark-cell luminance
* `--capture-light-luma <LIGHT_LUMA>` — Override perturbed light-cell luminance
* `--capture-luminance-jitter <LUMINANCE_JITTER>` — Override perturbed deterministic luminance jitter
* `--capture-downscale-cells <DOWNSCALE_CELLS>` — Average capture samples into cell blocks before decoding

  Default value: `1`
* `--capture-blur-radius <BLUR_RADIUS>` — Apply deterministic box blur over capture samples before decoding

  Default value: `0`
* `--capture-motion-blur-cells <MOTION_BLUR_CELLS>` — Apply deterministic horizontal motion blur over capture samples before decoding

  Default value: `0`
* `--capture-noise-amplitude <NOISE_AMPLITUDE>` — Apply deterministic per-cell sensor noise before decoding

  Default value: `0`
* `--capture-exposure-offset <EXPOSURE_OFFSET>` — Add a deterministic exposure offset to capture samples before decoding

  Default value: `0`
* `--simulate-fps <SIMULATE_FPS>` — Replayed frame rate metadata

  Default value: `24`
* `--realtime-loops <REALTIME_LOOPS>` — Number of deterministic playback loops

  Default value: `1`
* `--output-payload <PATH>` — Optional path for the first successfully decoded payload
* `--output-report <PATH>` — Optional JSON report path. The full report is printed to stdout when omitted
* `--grid-size <GRID_SIZE>` — Petal grid size for manifest-free directories. Zero requires a manifest

  Default value: `0`
* `--border <BORDER>` — Petal grid border thickness for manifest-free directories

  Default value: `1`
* `--anchor-size <ANCHOR_SIZE>` — Petal grid anchor size for manifest-free directories

  Default value: `3`



## `iroha offline petal score-styles`

Score the published Petal style set against deterministic capture gates

**Usage:** `iroha offline petal score-styles [OPTIONS] --input <PATH>`

###### **Options:**

* `--input <PATH>` — Payload bytes to encode into the Petal Stream grid
* `--output-report <PATH>` — Optional JSON report path. The full report is printed to stdout when omitted
* `--style-set <STYLE_SET>` — Published style set to score

  Default value: `sora-temple-default`

  Possible values:
  - `sora-temple-default`:
    Current production Petal style family
  - `sora-temple-expanded`:
    Production Petal style family plus deterministic hardening variants

* `--channel <CHANNEL>` — Visual channel to score

  Default value: `binary-grid`

  Possible values:
  - `binary-grid`:
    Binary luminance grid suitable for scanner bring-up
  - `katakana-base94`:
    Deterministic Katakana command-tile rendering with Petal luminance anchors

* `--katakana-preset <KATAKANA_PRESET>` — Katakana layout preset. Defaults to balanced for katakana-base94

  Possible values:
  - `balanced`:
    Balanced command-tile density for ordinary camera distances
  - `distance-safe`:
    Larger cells for longer-distance camera capture

* `--profile <PROFILE>` — Deterministic capture profile to apply

  Default value: `default`

  Possible values:
  - `default`:
    Default production deterministic capture profile

* `--seed <SEED>` — Deterministic seed mixed into luminance jitter

  Default value: `0`
* `--fps <FPS>` — Frames per second used for the effective-payload rate estimate

  Default value: `24`
* `--target-effective-bps <TARGET_EFFECTIVE_BPS>` — Target effective payload bits per second for throughput scoring

  Default value: `3000`
* `--min-success-ratio-bps <MIN_SUCCESS_RATIO_BPS>` — Minimum capture success ratio, in basis points

  Default value: `9500`
* `--grid-size <GRID_SIZE>` — Override the Petal grid size. Zero keeps automatic sizing

  Default value: `0`
* `--border <BORDER>` — Override the Petal grid border thickness

  Default value: `1`
* `--anchor-size <ANCHOR_SIZE>` — Override the Petal grid anchor size

  Default value: `3`
* `--attempts <ATTEMPTS>` — Override capture attempt count
* `--dark-luma <DARK_LUMA>` — Override dark-cell luminance
* `--light-luma <LIGHT_LUMA>` — Override light-cell luminance
* `--luminance-jitter <LUMINANCE_JITTER>` — Override deterministic luminance jitter



## `iroha soracloud`

Soracloud app platform helpers

**Usage:** `iroha soracloud <COMMAND>`

###### **Subcommands:**

* `app` — Scaffold and deploy multi-service Soracloud apps
* `service` — Single-service Soracloud manifest and control-plane helpers
* `model` — Soracloud model-training and model-registry helpers
* `hf` — Inert Hugging Face source metadata and shared storage-lease helpers
* `agent` — Persistent Soracloud agent/apartment helpers



## `iroha soracloud app`

Scaffold and deploy multi-service Soracloud apps

**Usage:** `iroha soracloud app <COMMAND>`

###### **Subcommands:**

* `init` — Scaffold a buildable single-service or split-plane Soracloud app workspace
* `plan` — Validate a mixed app manifest and print the local split-plane route/runtime plan
* `doctor` — Fail-closed validation for a scaffolded app workspace before release
* `dev` — Run the manifest-adjacent local dev entrypoint for a scaffolded app workspace
* `build` — Run the manifest-adjacent app build and manifest-sync entrypoint
* `simulate` — Simulate a prod-like release locally without live Torii mutation
* `preseed` — Qualify every hosted Inrou artifact offline and emit one durable app receipt
* `release` — Build, validate, deploy, and live-verify every service referenced by an app manifest
* `status` — Show app-scoped Soracloud service status from the control plane



## `iroha soracloud app init`

Scaffold a buildable single-service or split-plane Soracloud app workspace

**Usage:** `iroha soracloud app init [OPTIONS]`

###### **Options:**

* `--output-dir <DIR>` — Directory where the app manifest and starter service manifests will be created

  Default value: `.soracloud-app`
* `--app-name <NAME>` — Logical app name used in the scaffolded manifest

  Default value: `sora_app`
* `--app-version <VERSION>` — Version string used in the scaffolded service manifest set

  Default value: `0.1.0`
* `--template <TEMPLATE>` — App template to scaffold

  Default value: `single-api`

  Possible values:
  - `single-api`:
    Generate a root-bound app with a static frontend and one deterministic API service
  - `split-app`:
    Generate a split app with a static frontend, an Inrou live API, and an IVM vault API

* `--public-host <HOST>` — Optional public hostname used for the app URL and service routes
* `--static-site-dist-dir <PATH>` — Optional static frontend dist directory recorded in the app manifest
* `--existing-repo` — Emit only control-plane manifests plus minimal root scripts for wiring the app into an existing repo
* `--overwrite` — Overwrite existing files in the output directory



## `iroha soracloud app plan`

Validate a mixed app manifest and print the local split-plane route/runtime plan

**Usage:** `iroha soracloud app plan [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`



## `iroha soracloud app doctor`

Fail-closed validation for a scaffolded app workspace before release

**Usage:** `iroha soracloud app doctor [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`



## `iroha soracloud app dev`

Run the manifest-adjacent local dev entrypoint for a scaffolded app workspace

**Usage:** `iroha soracloud app dev [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--dry-run` — Print the resolved dev command plan without executing it

  Default value: `false`



## `iroha soracloud app build`

Run the manifest-adjacent app build and manifest-sync entrypoint

**Usage:** `iroha soracloud app build [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--dry-run` — Print the resolved build-and-sync command plan without executing it

  Default value: `false`



## `iroha soracloud app simulate`

Simulate a prod-like release locally without live Torii mutation

**Usage:** `iroha soracloud app simulate [OPTIONS] --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary used to reproduce release manifest identities



## `iroha soracloud app preseed`

Qualify every hosted Inrou artifact offline and emit one durable app receipt

**Usage:** `iroha soracloud app preseed [OPTIONS] --sorafs-retention-epoch <UNIX_SECONDS> --receipt-out <PATH>`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention identity reused by the later online release
* `--inrou-preseed-target <VALIDATOR,PEER,PATH>` — Exact validator account, active peer identity, and offline SoraFS store root
* `--inrou-preseed-max-capacity-bytes <BYTES>` — Exact common configured capacity of every selected store
* `--inrou-preseed-helper <PATH>` — Absolute path to the exact offline `sorafs-node` helper
* `--inrou-preseed-helper-sha256 <HEX>` — Lowercase SHA-256 of the exact offline helper
* `--receipt-out <PATH>` — Absolute owner-only output path for the immutable online qualification
* `--timeout-secs <SECS>` — Positive helper readiness/release timeout

  Default value: `10`



## `iroha soracloud app release`

Build, validate, deploy, and live-verify every service referenced by an app manifest

**Usage:** `iroha soracloud app release [OPTIONS] --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary embedded in every SoraFS manifest in this release. Reuse the same value for every retry; it must remain ahead of consensus time
* `--torii-url <URL>` — Torii base URL for the canonical app-infra release mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — Positive timeout for Torii requests

  Default value: `10`
* `--dry-run` — Print the resolved release plan without executing it

  Default value: `false`
* `--inrou-preseed-receipt <PATH>` — Absolute owner-only ingest qualification from `soracloud app preseed`



## `iroha soracloud app status`

Show app-scoped Soracloud service status from the control plane

**Usage:** `iroha soracloud app status [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document

  Default value: `app_manifest.json`
* `--torii-url <URL>` — Torii base URL for authoritative Soracloud status
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane status query

  Default value: `10`



## `iroha soracloud service`

Single-service Soracloud manifest and control-plane helpers

**Usage:** `iroha soracloud service <COMMAND>`

###### **Subcommands:**

* `init` — Scaffold baseline container/service manifests
* `bundle-pack` — Pack one regular file into a deterministic canonical Inrou bundle
* `plan` — Validate one service pair locally and print the local runtime/workspace plan
* `dev` — Run the manifest-adjacent local dev entrypoint for a single service workspace
* `build` — Run the manifest-adjacent build and sync entrypoint for a single service workspace
* `deploy-workspace` — Run the manifest-adjacent deploy entrypoint for a single service workspace
* `upgrade-workspace` — Run the manifest-adjacent upgrade entrypoint for a single service workspace
* `sync-manifests` — Recompute Soracloud manifest hashes after local edits or bundle rebuilds
* `preseed` — Qualify exact Inrou artifacts in offline validator stores and emit a durable receipt
* `deploy` — Validate manifests and register a new service deployment
* `status` — Show authoritative Soracloud service state (all services or one service)
* `config-set` — Record or replace an authoritative service config entry
* `config-delete` — Delete an authoritative service config entry
* `config-status` — Query authoritative service config state
* `secret-set` — Record or replace an authoritative service secret entry
* `secret-delete` — Delete an authoritative service secret entry
* `secret-status` — Query authoritative service secret state
* `upgrade` — Validate manifests and upgrade an existing deployed service
* `rollback` — Roll back a deployed service to an explicitly selected admitted version
* `rollout` — Advance or fail a rollout step using health-gated canary controls



## `iroha soracloud service init`

Scaffold baseline container/service manifests

**Usage:** `iroha soracloud service init [OPTIONS]`

###### **Options:**

* `--output-dir <DIR>` — Directory where manifests and template artifacts will be created

  Default value: `.soracloud`
* `--service-name <NAME>` — Logical service name used in the scaffolded service manifest

  Default value: `web_portal`
* `--service-version <VERSION>` — Version string used in the scaffolded service manifest

  Default value: `0.1.0`
* `--template <TEMPLATE>` — Scaffolding template to generate in addition to control-plane manifests

  Default value: `baseline`

  Possible values:
  - `baseline`:
    Generate only Soracloud control-plane manifests
  - `http-service`:
    Generate a hosted HTTP Soracloud starter that targets Inrou
  - `site`:
    Generate a Vue3/Vite static SPA starter with SoraFS publish workflow
  - `webapp`:
    Generate a Vue3 SPA + API starter with deterministic challenge-signature auth
  - `pii-app`:
    Generate a private PII app starter with consent + retention workflows
  - `hayahi-app`:
    Generate a Hayahi app starter with wallet sessions and Soracloud-backed state

* `--overwrite` — Overwrite existing files in the output directory



## `iroha soracloud service bundle-pack`

Pack one regular file into a deterministic canonical Inrou bundle

**Usage:** `iroha soracloud service bundle-pack [OPTIONS] --source <PATH> --archive-path <ARCHIVE_PATH> --output <PATH>`

###### **Options:**

* `--source <PATH>` — Regular file, up to 511 MiB, whose bytes become the sole archive member
* `--archive-path <ARCHIVE_PATH>` — Canonical relative path assigned to the file inside the bundle
* `--output <PATH>` — Destination for the deterministic canonical gzip/USTAR archive (at most 512 MiB)
* `--executable` — Store the archive member with canonical executable mode 0755

  Default value: `false`



## `iroha soracloud service plan`

Validate one service pair locally and print the local runtime/workspace plan

**Usage:** `iroha soracloud service plan [OPTIONS]`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`



## `iroha soracloud service dev`

Run the manifest-adjacent local dev entrypoint for a single service workspace

**Usage:** `iroha soracloud service dev [OPTIONS]`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--dry-run` — Print the resolved dev command plan without executing it

  Default value: `false`



## `iroha soracloud service build`

Run the manifest-adjacent build and sync entrypoint for a single service workspace

**Usage:** `iroha soracloud service build [OPTIONS]`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--dry-run` — Print the resolved build-and-sync command plan without executing it

  Default value: `false`



## `iroha soracloud service deploy-workspace`

Run the manifest-adjacent deploy entrypoint for a single service workspace

**Usage:** `iroha soracloud service deploy-workspace [OPTIONS] --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary forwarded unchanged to the workspace release script. Reuse the same value for every retry of one release
* `--initial-configs <PATH>` — Optional JSON file containing a map of inline config values committed atomically with deploy or upgrade
* `--initial-secrets <PATH>` — Optional JSON file containing a map of inline secret envelopes committed atomically with deploy or upgrade
* `--torii-url <URL>` — Torii base URL forwarded to the workspace entrypoint through `TORII_URL`
* `--api-token <TOKEN>` — Optional API token forwarded to the workspace entrypoint through `API_TOKEN`
* `--timeout-secs <SECS>` — HTTP timeout forwarded to the underlying deploy or upgrade command

  Default value: `10`
* `--dry-run` — Print the resolved deploy or upgrade command plan without executing it

  Default value: `false`



## `iroha soracloud service upgrade-workspace`

Run the manifest-adjacent upgrade entrypoint for a single service workspace

**Usage:** `iroha soracloud service upgrade-workspace [OPTIONS] --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary forwarded unchanged to the workspace release script. Reuse the same value for every retry of one release
* `--initial-configs <PATH>` — Optional JSON file containing a map of inline config values committed atomically with deploy or upgrade
* `--initial-secrets <PATH>` — Optional JSON file containing a map of inline secret envelopes committed atomically with deploy or upgrade
* `--torii-url <URL>` — Torii base URL forwarded to the workspace entrypoint through `TORII_URL`
* `--api-token <TOKEN>` — Optional API token forwarded to the workspace entrypoint through `API_TOKEN`
* `--timeout-secs <SECS>` — HTTP timeout forwarded to the underlying deploy or upgrade command

  Default value: `10`
* `--dry-run` — Print the resolved deploy or upgrade command plan without executing it

  Default value: `false`



## `iroha soracloud service sync-manifests`

Recompute Soracloud manifest hashes after local edits or bundle rebuilds

**Usage:** `iroha soracloud service sync-manifests [OPTIONS]`

###### **Options:**

* `--app-manifest <PATH>` — Path to a `SoracloudAppManifestV1` JSON document. When set, every referenced service manifest pair is synchronized
* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--bundle-file <PATH>` — Optional compiled IVM/native bundle file used to refresh `container.bundle_hash`



## `iroha soracloud service preseed`

Qualify exact Inrou artifacts in offline validator stores and emit a durable receipt

**Usage:** `iroha soracloud service preseed [OPTIONS] --bundle-file <PATH> --sorafs-retention-epoch <UNIX_SECONDS> --receipt-out <PATH>`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--bundle-file <PATH>` — Canonical service bundle bytes to qualify in every target store
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention identity reused by the later online publication
* `--inrou-preseed-target <VALIDATOR,PEER,PATH>` — Exact validator account, active peer identity, and offline SoraFS store root
* `--inrou-preseed-max-capacity-bytes <BYTES>` — Exact common configured capacity of every selected store
* `--inrou-preseed-helper <PATH>` — Absolute path to the exact offline `sorafs-node` helper
* `--inrou-preseed-helper-sha256 <HEX>` — Lowercase SHA-256 of the exact offline helper
* `--receipt-out <PATH>` — Absolute owner-only output path for the immutable online qualification
* `--timeout-secs <SECS>` — Positive helper readiness/release timeout

  Default value: `10`



## `iroha soracloud service deploy`

Validate manifests and register a new service deployment

**Usage:** `iroha soracloud service deploy [OPTIONS] --bundle-file <PATH> --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--bundle-file <PATH>` — Canonical service bundle bytes to publish before submitting the deployment
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary embedded in every SoraFS manifest in this release. Reuse the same value for every retry; it must remain ahead of consensus time
* `--initial-configs <PATH>` — Optional JSON file containing a map of inline config values committed atomically with deploy
* `--initial-secrets <PATH>` — Optional JSON file containing a map of inline secret envelopes committed atomically with deploy
* `--inrou-preseed-receipt <PATH>` — Absolute owner-only ingest qualification produced by `soracloud service preseed`
* `--torii-url <URL>` — Torii base URL to execute deploy against authoritative control-plane APIs
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — Positive timeout for each Torii request; the durable Inrou qualification is reread before online side effects

  Default value: `10`



## `iroha soracloud service status`

Show authoritative Soracloud service state (all services or one service)

**Usage:** `iroha soracloud service status [OPTIONS]`

###### **Options:**

* `--service-name <NAME>` — Optional service name filter
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service filter
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service filter
* `--torii-url <URL>` — Torii base URL (for example `http://127.0.0.1:8080/`) to query `/v1/soracloud/status` from the authoritative control plane
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying Torii
* `--timeout-secs <SECS>` — HTTP timeout for Torii status requests

  Default value: `10`



## `iroha soracloud service config-set`

Record or replace an authoritative service config entry

**Usage:** `iroha soracloud service config-set [OPTIONS] --config-name <NAME>`

###### **Options:**

* `--service-name <NAME>` — Service name owning the config entry
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--config-name <NAME>` — Stable service-scoped config name
* `--value-json <JSON>` — Inline JSON value for the config entry
* `--value-file <PATH>` — Path to a JSON document used as the config value
* `--torii-url <URL>` — Torii base URL for authoritative `service/config/set`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud service config-delete`

Delete an authoritative service config entry

**Usage:** `iroha soracloud service config-delete [OPTIONS] --config-name <NAME>`

###### **Options:**

* `--service-name <NAME>` — Service name owning the config entry
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--config-name <NAME>` — Stable service-scoped config name
* `--torii-url <URL>` — Torii base URL for authoritative `service/config/delete`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud service config-status`

Query authoritative service config state

**Usage:** `iroha soracloud service config-status [OPTIONS]`

###### **Options:**

* `--service-name <NAME>` — Service name owning the config entries
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--config-name <NAME>` — Optional config name filter
* `--torii-url <URL>` — Torii base URL for authoritative `service/config/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane queries

  Default value: `10`



## `iroha soracloud service secret-set`

Record or replace an authoritative service secret entry

**Usage:** `iroha soracloud service secret-set [OPTIONS] --secret-name <NAME> --secret-file <PATH>`

###### **Options:**

* `--service-name <NAME>` — Service name owning the secret entry
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--secret-name <NAME>` — Stable service-scoped secret name
* `--secret-file <PATH>` — Path to a `SecretEnvelopeV1` JSON document
* `--torii-url <URL>` — Torii base URL for authoritative `service/secret/set`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud service secret-delete`

Delete an authoritative service secret entry

**Usage:** `iroha soracloud service secret-delete [OPTIONS] --secret-name <NAME>`

###### **Options:**

* `--service-name <NAME>` — Service name owning the secret entry
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--secret-name <NAME>` — Stable service-scoped secret name
* `--torii-url <URL>` — Torii base URL for authoritative `service/secret/delete`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud service secret-status`

Query authoritative service secret state

**Usage:** `iroha soracloud service secret-status [OPTIONS]`

###### **Options:**

* `--service-name <NAME>` — Service name owning the secret entries
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--secret-name <NAME>` — Optional secret name filter
* `--torii-url <URL>` — Torii base URL for authoritative `service/secret/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane queries

  Default value: `10`



## `iroha soracloud service upgrade`

Validate manifests and upgrade an existing deployed service

**Usage:** `iroha soracloud service upgrade [OPTIONS] --bundle-file <PATH> --sorafs-retention-epoch <UNIX_SECONDS>`

###### **Options:**

* `--container <PATH>` — Path to an unpublished Soracloud container workspace JSON document

  Default value: `fixtures/soracloud/sora_container_manifest_v1.json`
* `--service <PATH>` — Path to a `SoraServiceManifestV1` JSON document

  Default value: `fixtures/soracloud/sora_service_manifest_v1.json`
* `--bundle-file <PATH>` — Canonical service bundle bytes to publish before submitting the upgrade
* `--sorafs-retention-epoch <UNIX_SECONDS>` — Exact Unix-second retention boundary embedded in every SoraFS manifest in this release. Reuse the same value for every retry; it must remain ahead of consensus time
* `--initial-configs <PATH>` — Optional JSON file containing a map of inline config values committed atomically with upgrade
* `--initial-secrets <PATH>` — Optional JSON file containing a map of inline secret envelopes committed atomically with upgrade
* `--inrou-preseed-receipt <PATH>` — Absolute owner-only ingest qualification produced by `soracloud service preseed`
* `--torii-url <URL>` — Torii base URL to execute upgrade against authoritative control-plane APIs
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — Positive timeout for each Torii request; the durable Inrou qualification is reread before online side effects

  Default value: `10`



## `iroha soracloud service rollback`

Roll back a deployed service to an explicitly selected admitted version

**Usage:** `iroha soracloud service rollback [OPTIONS] --target-version <VERSION>`

###### **Options:**

* `--service-name <NAME>` — Service name to roll back
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--target-version <VERSION>` — Already-admitted target version to restore
* `--torii-url <URL>` — Torii base URL to execute rollback against authoritative control-plane APIs
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for Torii mutation requests

  Default value: `10`



## `iroha soracloud service rollout`

Advance or fail a rollout step using health-gated canary controls

**Usage:** `iroha soracloud service rollout [OPTIONS] --rollout-handle <HANDLE> --governance-tx-hash <HASH>`

###### **Options:**

* `--service-name <NAME>` — Deterministic IVM service name with an active rollout
* `--container <PATH>` — Optional unpublished deterministic IVM workspace used to resolve the service name
* `--service <PATH>` — Optional path to its `SoraServiceManifestV1` JSON document
* `--rollout-handle <HANDLE>` — Rollout handle emitted by `upgrade` output (`rollout_handle`)
* `--health <HEALTH>` — Health signal for this rollout step

  Default value: `healthy`

  Possible values: `healthy`, `unhealthy`

* `--promote-to-percent <PERCENT>` — Explicit target traffic percentage; required for healthy steps and forbidden otherwise
* `--governance-tx-hash <HASH>` — Governance transaction hash linked to this rollout action
* `--torii-url <URL>` — Torii base URL to execute a deterministic IVM rollout against authoritative control-plane APIs
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for Torii mutation requests

  Default value: `10`



## `iroha soracloud model`

Soracloud model-training and model-registry helpers

**Usage:** `iroha soracloud model <COMMAND>`

###### **Subcommands:**

* `training-job-start` — Start a distributed training job in live Torii control-plane mode
* `training-job-checkpoint` — Record a training checkpoint in live Torii control-plane mode
* `training-job-retry` — Submit a training retry request in live Torii control-plane mode
* `training-job-status` — Query training job status in live Torii control-plane mode
* `artifact-register` — Register model-artifact metadata in live Torii control-plane mode
* `artifact-status` — Query model-artifact status in live Torii control-plane mode
* `weight-register` — Register a model weight version in live Torii control-plane mode
* `weight-promote` — Promote a model weight version in live Torii control-plane mode
* `weight-rollback` — Roll back a model weight version in live Torii control-plane mode
* `weight-status` — Query model weight status in live Torii control-plane mode
* `upload-register` — Register a SoraFS-backed uploaded-model bundle into the model registry
* `upload-status` — Query SoraFS-backed uploaded-model storage and registry status



## `iroha soracloud model training-job-start`

Start a distributed training job in live Torii control-plane mode

**Usage:** `iroha soracloud model training-job-start [OPTIONS] --model-name <NAME> --job-id <ID> --target-steps <STEPS> --checkpoint-interval-steps <STEPS> --step-compute-units <UNITS> --compute-budget-units <UNITS> --storage-budget-bytes <BYTES>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the training job
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name for the training job
* `--job-id <ID>` — Deterministic training job identifier
* `--worker-group-size <COUNT>` — Worker-group size for the distributed training run

  Default value: `1`
* `--target-steps <STEPS>` — Target number of steps to complete the training job
* `--checkpoint-interval-steps <STEPS>`
* `--max-retries <COUNT>` — Maximum allowed retries for the training job

  Default value: `3`
* `--step-compute-units <UNITS>` — Compute units charged per step
* `--compute-budget-units <UNITS>` — Total compute budget units for the training job
* `--storage-budget-bytes <BYTES>` — Total storage budget bytes for checkpoints
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model training-job-checkpoint`

Record a training checkpoint in live Torii control-plane mode

**Usage:** `iroha soracloud model training-job-checkpoint [OPTIONS] --job-id <ID> --completed-step <STEP> --checkpoint-size-bytes <BYTES> --metrics-hash <HASH>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the training job
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--job-id <ID>` — Training job identifier
* `--completed-step <STEP>` — Completed step represented by this checkpoint
* `--checkpoint-size-bytes <BYTES>` — Checkpoint payload size in bytes
* `--metrics-hash <HASH>` — Hash of metrics/telemetry emitted for this checkpoint
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model training-job-retry`

Submit a training retry request in live Torii control-plane mode

**Usage:** `iroha soracloud model training-job-retry [OPTIONS] --job-id <ID> --reason <TEXT>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the training job
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--job-id <ID>` — Training job identifier
* `--reason <TEXT>` — Human-readable retry reason recorded in audit logs
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model training-job-status`

Query training job status in live Torii control-plane mode

**Usage:** `iroha soracloud model training-job-status [OPTIONS] --job-id <ID>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the training job
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--job-id <ID>` — Training job identifier
* `--torii-url <URL>` — Torii base URL for live control-plane query
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane query

  Default value: `10`



## `iroha soracloud model artifact-register`

Register model-artifact metadata in live Torii control-plane mode

**Usage:** `iroha soracloud model artifact-register [OPTIONS] --model-name <NAME> --training-job-id <ID> --weight-artifact-hash <HASH> --dataset-ref <REF> --training-config-hash <HASH> --reproducibility-hash <HASH> --provenance-attestation-hash <HASH>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name
* `--training-job-id <ID>` — Training job identifier backing this artifact registration
* `--weight-artifact-hash <HASH>` — Weight artifact hash
* `--dataset-ref <REF>` — Dataset reference identifier
* `--training-config-hash <HASH>` — Hash of training config used for the run
* `--reproducibility-hash <HASH>` — Reproducibility metadata hash
* `--provenance-attestation-hash <HASH>` — Provenance attestation hash
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model artifact-status`

Query model-artifact status in live Torii control-plane mode

**Usage:** `iroha soracloud model artifact-status [OPTIONS] --training-job-id <ID>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model artifact
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--training-job-id <ID>` — Training job identifier associated with the artifact
* `--torii-url <URL>` — Torii base URL for live control-plane query
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane query

  Default value: `10`



## `iroha soracloud model weight-register`

Register a model weight version in live Torii control-plane mode

**Usage:** `iroha soracloud model weight-register [OPTIONS] --model-name <NAME> --weight-version <VERSION> --training-job-id <ID> --weight-artifact-hash <HASH> --dataset-ref <REF> --training-config-hash <HASH> --reproducibility-hash <HASH> --provenance-attestation-hash <HASH>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name
* `--weight-version <VERSION>` — New weight version identifier
* `--training-job-id <ID>` — Training job identifier backing this weight version
* `--parent-version <VERSION>` — Optional lineage parent version
* `--weight-artifact-hash <HASH>` — Weight artifact hash
* `--dataset-ref <REF>` — Dataset reference identifier
* `--training-config-hash <HASH>` — Hash of training config used for the run
* `--reproducibility-hash <HASH>` — Reproducibility metadata hash
* `--provenance-attestation-hash <HASH>` — Provenance attestation hash
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model weight-promote`

Promote a model weight version in live Torii control-plane mode

**Usage:** `iroha soracloud model weight-promote [OPTIONS] --model-name <NAME> --weight-version <VERSION> --gate-report-hash <HASH>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name
* `--weight-version <VERSION>` — Weight version to promote
* `--gate-approved` — Gate approval flag
* `--gate-report-hash <HASH>` — Hash of gate report/evidence for this promotion decision
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model weight-rollback`

Roll back a model weight version in live Torii control-plane mode

**Usage:** `iroha soracloud model weight-rollback [OPTIONS] --model-name <NAME> --target-version <VERSION> --reason <TEXT>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name
* `--target-version <VERSION>` — Target version to roll back to
* `--reason <TEXT>` — Human-readable rollback reason
* `--torii-url <URL>` — Torii base URL for live control-plane mutation
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model weight-status`

Query model weight status in live Torii control-plane mode

**Usage:** `iroha soracloud model weight-status [OPTIONS] --model-name <NAME>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--model-name <NAME>` — Model name
* `--torii-url <URL>` — Torii base URL for live control-plane query
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane query

  Default value: `10`



## `iroha soracloud model upload-register`

Register a SoraFS-backed uploaded-model bundle into the model registry

**Usage:** `iroha soracloud model upload-register [OPTIONS] --bundle-file <PATH> --request-file <PATH>`

###### **Options:**

* `--bundle-file <PATH>` — Path to a `SoraUploadedModelBundleV1` JSON document with an approved SoraFS digest
* `--request-file <PATH>` — Path to an `UploadedModelFinalizePayload` JSON document describing registry metadata
* `--service-name <NAME>` — Service name that owns the uploaded model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--torii-url <URL>` — Torii base URL for authoritative `model/upload/register`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutation

  Default value: `10`



## `iroha soracloud model upload-status`

Query SoraFS-backed uploaded-model storage and registry status

**Usage:** `iroha soracloud model upload-status [OPTIONS] --weight-version <VERSION>`

###### **Options:**

* `--service-name <NAME>` — Service name that owns the uploaded model
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--weight-version <VERSION>` — Uploaded-model pinned weight version
* `--model-id <ID>` — Optional uploaded-model identifier
* `--model-name <NAME>` — Optional logical model name used to resolve the uploaded-model record
* `--bundle-root <HASH>` — Optional bundle-root filter
* `--torii-url <URL>` — Torii base URL for authoritative `model/upload/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token`
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane query

  Default value: `10`



## `iroha soracloud hf`

Inert Hugging Face source metadata and shared storage-lease helpers

**Usage:** `iroha soracloud hf <COMMAND>`

###### **Subcommands:**

* `join` — Register immutable source metadata and join or create its shared storage lease
* `status` — Query immutable source metadata and shared storage-lease status
* `lease-leave` — Leave an immutable source's shared storage lease
* `lease-renew` — Renew an immutable source's expired or drained shared storage-lease window



## `iroha soracloud hf join`

Register immutable source metadata and join or create its shared storage lease

**Usage:** `iroha soracloud hf join [OPTIONS] --repo-id <REPO> --revision <COMMIT_OID> --storage-class <STORAGE_CLASS> --lease-term-ms <MS> --lease-asset-definition <ASSET> --base-fee <QUANTITY>`

###### **Options:**

* `--repo-id <REPO>` — Hugging Face repository identifier (for example `openai/gpt-oss`)
* `--revision <COMMIT_OID>` — Full 40-character lowercase Hugging Face commit OID
* `--service-name <NAME>` — Soracloud service name recorded as inert lease-membership metadata
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--apartment-name <NAME>` — Optional agent apartment name recorded as inert lease-membership metadata
* `--storage-class <STORAGE_CLASS>` — Shared-lease storage tier

  Possible values: `hot`, `warm`, `cold`

* `--lease-term-ms <MS>` — Shared-lease window length in milliseconds
* `--lease-asset-definition <ASSET>` — Settlement asset definition identifier
* `--base-fee <QUANTITY>` — Exact, positive base lease fee in the settlement asset
* `--torii-url <URL>` — Torii base URL for authoritative `hf/lease/join`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud hf status`

Query immutable source metadata and shared storage-lease status

**Usage:** `iroha soracloud hf status [OPTIONS] --repo-id <REPO> --revision <COMMIT_OID> --storage-class <STORAGE_CLASS> --lease-term-ms <MS>`

###### **Options:**

* `--repo-id <REPO>` — Hugging Face repository identifier (for example `openai/gpt-oss`)
* `--revision <COMMIT_OID>` — Full 40-character lowercase Hugging Face commit OID
* `--storage-class <STORAGE_CLASS>` — Shared-lease storage tier

  Possible values: `hot`, `warm`, `cold`

* `--lease-term-ms <MS>` — Shared-lease window length in milliseconds
* `--account-id <ACCOUNT>` — Optional account filter for membership-specific status
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to project the local service plan
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to project the local service plan
* `--torii-url <URL>` — Torii base URL for authoritative `hf/lease/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane queries

  Default value: `10`



## `iroha soracloud hf lease-leave`

Leave an immutable source's shared storage lease

**Usage:** `iroha soracloud hf lease-leave [OPTIONS] --repo-id <REPO> --revision <COMMIT_OID> --storage-class <STORAGE_CLASS> --lease-term-ms <MS>`

###### **Options:**

* `--repo-id <REPO>` — Hugging Face repository identifier
* `--revision <COMMIT_OID>` — Full 40-character lowercase Hugging Face commit OID
* `--storage-class <STORAGE_CLASS>` — Shared-lease storage tier

  Possible values: `hot`, `warm`, `cold`

* `--lease-term-ms <MS>` — Shared-lease window length in milliseconds
* `--service-name <NAME>` — Optional inert service association to include in the signed leave request
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--apartment-name <NAME>` — Optional inert apartment association to include in the signed leave request
* `--torii-url <URL>` — Torii base URL for authoritative `hf/lease/leave`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud hf lease-renew`

Renew an immutable source's expired or drained shared storage-lease window

**Usage:** `iroha soracloud hf lease-renew [OPTIONS] --repo-id <REPO> --revision <COMMIT_OID> --storage-class <STORAGE_CLASS> --lease-term-ms <MS> --lease-asset-definition <ASSET> --base-fee <QUANTITY>`

###### **Options:**

* `--repo-id <REPO>` — Hugging Face repository identifier
* `--revision <COMMIT_OID>` — Full 40-character lowercase Hugging Face commit OID
* `--service-name <NAME>` — Soracloud service name recorded as inert renewed-membership metadata
* `--container <PATH>` — Optional unpublished Soracloud container workspace used to resolve the service name
* `--service <PATH>` — Optional path to a `SoraServiceManifestV1` JSON document used to resolve the service name
* `--apartment-name <NAME>` — Optional agent apartment name recorded as inert renewed-membership metadata
* `--storage-class <STORAGE_CLASS>` — Shared-lease storage tier

  Possible values: `hot`, `warm`, `cold`

* `--lease-term-ms <MS>` — Shared-lease window length in milliseconds
* `--lease-asset-definition <ASSET>` — Settlement asset definition identifier
* `--base-fee <QUANTITY>` — Exact, positive base lease fee in the settlement asset
* `--torii-url <URL>` — Torii base URL for authoritative `hf/lease/renew`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent`

Persistent Soracloud agent/apartment helpers

**Usage:** `iroha soracloud agent <COMMAND>`

###### **Subcommands:**

* `deploy` — Register a persistent AI apartment manifest in the live control plane
* `lease-renew` — Renew an apartment lease in the live control plane
* `restart` — Request deterministic apartment restart in the live control plane
* `status` — Show authoritative apartment runtime status
* `wallet-spend` — Submit an apartment wallet spend request under policy guardrails
* `wallet-approve` — Approve a pending apartment wallet spend request
* `policy-revoke` — Revoke an apartment policy capability
* `message-send` — Send a deterministic mailbox message between apartments
* `message-ack` — Acknowledge (consume) a mailbox message from an apartment queue
* `mailbox-status` — Inspect mailbox queue state for an apartment
* `artifact-allow` — Add an artifact hash (and optional provenance hash) to autonomy allowlist
* `autonomy-status` — Show autonomous-run policy state for an apartment



## `iroha soracloud agent deploy`

Register a persistent AI apartment manifest in the live control plane

**Usage:** `iroha soracloud agent deploy [OPTIONS]`

###### **Options:**

* `--manifest <PATH>` — Path to an `AgentApartmentManifestV1` JSON document

  Default value: `fixtures/soracloud/agent_apartment_manifest_v1.json`
* `--lease-ticks <TICKS>` — Lease length, measured in deterministic control-plane sequence ticks

  Default value: `120`
* `--autonomy-budget-units <UNITS>` — Initial autonomy execution budget units

  Default value: `10000`
* `--torii-url <URL>` — Torii base URL for authoritative `agent/deploy`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent lease-renew`

Renew an apartment lease in the live control plane

**Usage:** `iroha soracloud agent lease-renew [OPTIONS] --apartment-name <NAME>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name to renew
* `--lease-ticks <TICKS>` — Lease extension ticks

  Default value: `120`
* `--torii-url <URL>` — Torii base URL for authoritative `agent/lease/renew`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent restart`

Request deterministic apartment restart in the live control plane

**Usage:** `iroha soracloud agent restart [OPTIONS] --apartment-name <NAME> --reason <TEXT>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name to restart
* `--reason <TEXT>` — Human-readable reason captured in scheduler events
* `--torii-url <URL>` — Torii base URL for authoritative `agent/restart`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent status`

Show authoritative apartment runtime status

**Usage:** `iroha soracloud agent status [OPTIONS]`

###### **Options:**

* `--apartment-name <NAME>` — Optional apartment name filter
* `--torii-url <URL>` — Torii base URL for authoritative `agent/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane status query

  Default value: `10`



## `iroha soracloud agent wallet-spend`

Submit an apartment wallet spend request under policy guardrails

**Usage:** `iroha soracloud agent wallet-spend [OPTIONS] --apartment-name <NAME> --request-id <REQUEST> --asset-definition <ASSET> --amount <QUANTITY>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name issuing the spend request
* `--request-id <REQUEST>` — Caller-selected unique wallet request identifier committed by the signed V1 request
* `--asset-definition <ASSET>` — Asset definition identifier (canonical unprefixed Base58 address)
* `--amount <QUANTITY>` — Exact, positive spend amount
* `--torii-url <URL>` — Torii base URL for authoritative `agent/wallet/spend`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent wallet-approve`

Approve a pending apartment wallet spend request

**Usage:** `iroha soracloud agent wallet-approve [OPTIONS] --apartment-name <NAME> --request-id <REQUEST>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name owning the request
* `--request-id <REQUEST>` — Caller-selected wallet request identifier supplied to the original `agent wallet-spend`
* `--torii-url <URL>` — Torii base URL for authoritative `agent/wallet/approve`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent policy-revoke`

Revoke an apartment policy capability

**Usage:** `iroha soracloud agent policy-revoke [OPTIONS] --apartment-name <NAME> --capability <CAPABILITY>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name whose policy should be updated
* `--capability <CAPABILITY>` — Capability identifier to revoke (for example `wallet.sign`)
* `--reason <TEXT>` — Optional reason included in audit events
* `--torii-url <URL>` — Torii base URL for authoritative `agent/policy/revoke`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent message-send`

Send a deterministic mailbox message between apartments

**Usage:** `iroha soracloud agent message-send [OPTIONS] --from-apartment <NAME> --to-apartment <NAME> --payload <TEXT>`

###### **Options:**

* `--from-apartment <NAME>` — Sender apartment name
* `--to-apartment <NAME>` — Recipient apartment name
* `--channel <CHANNEL>` — Logical mailbox channel

  Default value: `default`
* `--payload <TEXT>` — Message payload (UTF-8 text)
* `--torii-url <URL>` — Torii base URL for authoritative `agent/message/send`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent message-ack`

Acknowledge (consume) a mailbox message from an apartment queue

**Usage:** `iroha soracloud agent message-ack [OPTIONS] --apartment-name <NAME> --message-id <MESSAGE>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name consuming the message
* `--message-id <MESSAGE>` — Message identifier emitted by `agent message-send`
* `--torii-url <URL>` — Torii base URL for authoritative `agent/message/ack`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent mailbox-status`

Inspect mailbox queue state for an apartment

**Usage:** `iroha soracloud agent mailbox-status [OPTIONS] --apartment-name <NAME>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name to inspect
* `--torii-url <URL>` — Torii base URL for authoritative `agent/mailbox/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane status query

  Default value: `10`



## `iroha soracloud agent artifact-allow`

Add an artifact hash (and optional provenance hash) to autonomy allowlist

**Usage:** `iroha soracloud agent artifact-allow [OPTIONS] --apartment-name <NAME> --artifact-hash <HASH>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name whose allowlist should be updated
* `--artifact-hash <HASH>` — Artifact hash identifier
* `--provenance-hash <HASH>` — Optional provenance hash required for this artifact
* `--torii-url <URL>` — Torii base URL for authoritative `agent/autonomy/allow`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when mutating live control-plane APIs
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane mutations

  Default value: `10`



## `iroha soracloud agent autonomy-status`

Show autonomous-run policy state for an apartment

**Usage:** `iroha soracloud agent autonomy-status [OPTIONS] --apartment-name <NAME>`

###### **Options:**

* `--apartment-name <NAME>` — Apartment name to inspect
* `--torii-url <URL>` — Torii base URL for authoritative `agent/autonomy/status`
* `--api-token <TOKEN>` — Optional API token sent as `x-api-token` when querying Torii
* `--timeout-secs <SECS>` — HTTP timeout for live control-plane query

  Default value: `10`



<hr/>

<small><i>
    This document was generated automatically by
    <a href="https://crates.io/crates/clap-markdown"><code>clap-markdown</code></a>.
</i></small>
