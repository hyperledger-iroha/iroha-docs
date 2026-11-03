## `AccountAdmissionDefaultRoleError` {#accountadmissiondefaultroleerror}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `role` | [`RoleId`](#roleid) |
  | `reason` | `String` |

## `AccountAdmissionError` {#accountadmissionerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ImplicitAccountCreationDisabled` | &mdash; | 0 |
  | `InvalidPolicy` | [`AccountAdmissionInvalidPolicy`](#accountadmissioninvalidpolicy) | 1 |
  | `DefaultRoleError` | [`AccountAdmissionDefaultRoleError`](#accountadmissiondefaultroleerror) | 2 |
  | `QuotaExceeded` | [`AccountAdmissionQuotaExceeded`](#accountadmissionquotaexceeded) | 3 |
  | `AlgorithmNotAllowed` | [`Algorithm`](#algorithm) | 4 |
  | `GenesisDomainForbidden` | &mdash; | 5 |
  | `FeeUnsatisfied` | [`AccountAdmissionFeeUnsatisfied`](#accountadmissionfeeunsatisfied) | 6 |
  | `MinInitialAmountUnsatisfied` | [`AccountAdmissionMinInitialAmountUnsatisfied`](#accountadmissionmininitialamountunsatisfied) | 7 |

## `AccountAdmissionFeeUnsatisfied` {#accountadmissionfeeunsatisfied}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `required` | [`Quantity`](#quantity) |
  | `available` | [`Quantity`](#quantity) |

## `AccountAdmissionInvalidPolicy` {#accountadmissioninvalidpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |

## `AccountAdmissionMinInitialAmountUnsatisfied` {#accountadmissionmininitialamountunsatisfied}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `required` | [`Quantity`](#quantity) |
  | `provided` | [`Quantity`](#quantity) |

## `AccountAdmissionQuotaExceeded` {#accountadmissionquotaexceeded}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `scope` | [`AccountAdmissionQuotaScope`](#accountadmissionquotascope) |
  | `created` | `u32` |
  | `cap` | `u32` |

## `AccountAdmissionQuotaScope` {#accountadmissionquotascope}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transaction` | &mdash; | 0 |
  | `Block` | &mdash; | 1 |

## `AccountController` {#accountcontroller}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Single` | [`PublicKey`](#publickey) | 0 |
  | `Multisig` | [`MultisigPolicy`](#multisigpolicy) | 1 |

## `AccountEventFilter` {#accounteventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<AccountId>`](#option-accountid) |
  | `event_set` | [`AccountEventSet`](#accounteventset) |

## `AccountEventSet` {#accounteventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `ControllerReplaced` | `0x4` |
  | `PermissionAdded` | `0x8` |
  | `PermissionRemoved` | `0x10` |
  | `RoleGranted` | `0x20` |
  | `RoleRevoked` | `0x40` |
  | `MetadataInserted` | `0x80` |
  | `MetadataRemoved` | `0x100` |
  | `AnyRecovery` | `0x200` |
  | `AnyRepo` | `0x400` |

## `AccountId` {#accountid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `controller` | [`AccountController`](#accountcontroller) |

## `Algorithm` {#algorithm}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Ed25519` | &mdash; | 0 |
  | `Secp256k1` | &mdash; | 1 |
  | `BlsNormal` | &mdash; | 2 |
  | `BlsSmall` | &mdash; | 3 |
  | `MlDsa` | &mdash; | 4 |
  | `Gost3410_2012_256ParamSetA` | &mdash; | 5 |
  | `Gost3410_2012_256ParamSetB` | &mdash; | 6 |
  | `Gost3410_2012_256ParamSetC` | &mdash; | 7 |
  | `Gost3410_2012_512ParamSetA` | &mdash; | 8 |
  | `Gost3410_2012_512ParamSetB` | &mdash; | 9 |
  | `Sm2` | &mdash; | 10 |

## `AnonymousBallotRejectionV1` {#anonymousballotrejectionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `outside_casting_window` | &mdash; | 0 |
  | `duplicate_nullifier` | &mdash; | 1 |

## `ArchiveId` {#archiveid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `Array<u8, 16>` {#array-u8-16}

**Type:** Array

**Length:** 16

**Value:** `u8`

## `Array<u8, 32>` {#array-u8-32}

**Type:** Array

**Length:** 32

**Value:** `u8`

## `ArtifactAbiHashMismatchInfo` {#artifactabihashmismatchinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`Hash`](#hash) |
  | `actual` | [`Hash`](#hash) |

## `AssetBalanceScope` {#assetbalancescope}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Global` | &mdash; | 0 |
  | `Dataspace` | [`DataSpaceId`](#dataspaceid) | 1 |

## `AssetDefinitionEventFilter` {#assetdefinitioneventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<AssetDefinitionId>`](#option-assetdefinitionid) |
  | `event_set` | [`AssetDefinitionEventSet`](#assetdefinitioneventset) |

## `AssetDefinitionEventSet` {#assetdefinitioneventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `MetadataInserted` | `0x4` |
  | `MetadataRemoved` | `0x8` |
  | `MintabilityChanged` | `0x10` |
  | `MintabilityChangedDetailed` | `0x20` |
  | `TotalQuantityChanged` | `0x40` |
  | `OwnerChanged` | `0x80` |

## `AssetDefinitionId` {#assetdefinitionid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `aid_bytes` | [`Array<u8, 16>`](#array-u8-16) |

## `AssetEscrowStatus` {#assetescrowstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Open` | &mdash; | 0 |
  | `Accepted` | &mdash; | 1 |
  | `PaymentSent` | &mdash; | 2 |
  | `Disputed` | &mdash; | 3 |
  | `Released` | &mdash; | 4 |
  | `Cancelled` | &mdash; | 5 |
  | `Resolved` | &mdash; | 6 |
  | `Locked` | &mdash; | 7 |
  | `DrawnDown` | &mdash; | 8 |
  | `Expired` | &mdash; | 9 |

## `AssetEventFilter` {#asseteventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<AssetId>`](#option-assetid) |
  | `asset_definition_matcher` | [`Option<AssetDefinitionId>`](#option-assetdefinitionid) |
  | `transfer_source_account_matcher` | [`Option<AccountId>`](#option-accountid) |
  | `transfer_destination_account_matcher` | [`Option<AccountId>`](#option-accountid) |
  | `event_set` | [`AssetEventSet`](#asseteventset) |

## `AssetEventSet` {#asseteventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `Added` | `0x4` |
  | `Removed` | `0x8` |
  | `Transferred` | `0x10` |
  | `MetadataInserted` | `0x20` |
  | `MetadataRemoved` | `0x40` |
  | `BatchTransferOutcome` | `0x80` |

## `AssetId` {#assetid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `scope` | [`AssetBalanceScope`](#assetbalancescope) |

## `AssetTransferAdmissionError` {#assettransferadmissionerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `HoldingLimitExceeded` | `String` | 0 |
  | `IncomingDisabled` | `String` | 1 |
  | `OutgoingDisabled` | `String` | 2 |
  | `AvailabilityRevisionMismatch` | `String` | 3 |
  | `Blacklisted` | `String` | 4 |
  | `PolicyRejected` | `String` | 5 |

## `AxtRejectContext` {#axtrejectcontext}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | [`AxtRejectReason`](#axtrejectreason) |
  | `dataspace` | [`Option<DataSpaceId>`](#option-dataspaceid) |
  | `lane` | [`Option<LaneId>`](#option-laneid) |
  | `snapshot_version` | [`Option<u64>`](#option-u64) |
  | `detail` | `String` |
  | `active_handle_era` | [`Option<u64>`](#option-u64) |
  | `next_handle_counter` | [`Option<u64>`](#option-u64) |

## `AxtRejectReason` {#axtrejectreason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Lane` | &mdash; | 0 |
  | `Manifest` | &mdash; | 1 |
  | `HandleEra` | &mdash; | 2 |
  | `SubNonce` | &mdash; | 3 |
  | `Expiry` | &mdash; | 4 |
  | `MissingPolicy` | &mdash; | 5 |
  | `PolicyDenied` | &mdash; | 6 |
  | `Proof` | &mdash; | 7 |
  | `Descriptor` | &mdash; | 8 |
  | `Budget` | &mdash; | 9 |
  | `ReplayCache` | &mdash; | 10 |
  | `Duplicate` | &mdash; | 11 |

## `BigInt` {#bigint}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |

## `BlockEventFilter` {#blockeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `status` | [`Option<BlockStatus>`](#option-blockstatus) |

## `BlockParameters` {#blockparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_transactions` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_time_trigger_invocations` | [`NonZero<u32>`](#nonzero-u32) |
  | `execution_output` | [`ExecutionOutputPolicyV1`](#executionoutputpolicyv1) |
  | `fastpq_source` | [`FastpqSourcePolicyV1`](#fastpqsourcepolicyv1) |

## `BlockRejectionReason` {#blockrejectionreason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ConsensusBlockRejection` | &mdash; | 0 |
  | `ContainsCommittedTransactions` | &mdash; | 1 |
  | `EmptyBlock` | &mdash; | 2 |
  | `PrevBlockHashMismatch` | &mdash; | 3 |
  | `PrevBlockHeightMismatch` | &mdash; | 4 |
  | `MerkleRootMismatch` | &mdash; | 5 |
  | `TransactionValidationFailed` | &mdash; | 6 |
  | `TopologyMismatch` | &mdash; | 7 |
  | `InsufficientBlockSignatures` | &mdash; | 8 |
  | `UnknownBlockSignatory` | &mdash; | 9 |
  | `InactiveConsensusKey` | &mdash; | 10 |
  | `InvalidBlockSignature` | &mdash; | 11 |
  | `ProxyTailSignatureMissing` | &mdash; | 12 |
  | `LeaderSignatureMissing` | &mdash; | 13 |
  | `OtherSignatureError` | &mdash; | 14 |
  | `InvalidGenesis` | &mdash; | 15 |
  | `BlockInThePast` | &mdash; | 16 |
  | `BlockInTheFuture` | &mdash; | 17 |
  | `TransactionInTheFuture` | &mdash; | 18 |
  | `ConfidentialFeatureDigestMismatch` | &mdash; | 19 |
  | `DaProofPolicyMismatch` | &mdash; | 20 |
  | `DaShardCursorViolation` | &mdash; | 21 |
  | `NposEffectsMismatch` | &mdash; | 22 |

## `BlockStatus` {#blockstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | &mdash; | 0 |
  | `Approved` | &mdash; | 1 |
  | `Rejected` | [`BlockRejectionReason`](#blockrejectionreason) | 2 |
  | `Committed` | &mdash; | 3 |
  | `Applied` | &mdash; | 4 |

## `BridgeEventFilter` {#bridgeeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<LaneId>`](#option-laneid) |
  | `event_set` | [`BridgeEventSet`](#bridgeeventset) |

## `BridgeEventSet` {#bridgeeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Emitted` | `0x1` |

## `CanonicalHistoryError` {#canonicalhistoryerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `HeightOutsideSnapshot` | [`CanonicalHistorySnapshotHeightSchema`](#canonicalhistorysnapshotheightschema) | 0 |
  | `BodyUnavailable` | [`CanonicalHistoryHeightHashSchema`](#canonicalhistoryheighthashschema) | 1 |
  | `BlockHashMismatch` | [`CanonicalHistoryHashMismatchSchema`](#canonicalhistoryhashmismatchschema) | 2 |
  | `BlockHeightMismatch` | [`CanonicalHistoryHeightMismatchSchema`](#canonicalhistoryheightmismatchschema) | 3 |

## `CanonicalHistoryHashMismatchSchema` {#canonicalhistoryhashmismatchschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `expected_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `actual_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |

## `CanonicalHistoryHeightHashSchema` {#canonicalhistoryheighthashschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `expected_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |

## `CanonicalHistoryHeightMismatchSchema` {#canonicalhistoryheightmismatchschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `actual_height` | `u64` |

## `CanonicalHistorySnapshotHeightSchema` {#canonicalhistorysnapshotheightschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `committed_height` | `u64` |

## `ChainId` {#chainid}

**Type:** Alias

**To:** `String`

## `ChangeSetId` {#changesetid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `Compact<u32>` {#compact-u32}

**Type:** Int

**Kind:** Compact

## `ConfigurationEventFilter` {#configurationeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `event_set` | [`ConfigurationEventSet`](#configurationeventset) |

## `ConfigurationEventSet` {#configurationeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Changed` | `0x1` |

## `ConsensusFingerprint` {#consensusfingerprint}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `ContractRejection` {#contractrejection}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract` | `String` |
  | `error_type` | `String` |
  | `schema_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `name` | `String` |
  | `code` | `u32` |
  | `message` | [`Option<String>`](#option-string) |

## `CryptoAdmissionPolicyV1` {#cryptoadmissionpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `allowed_algorithms` | [`Vec<Algorithm>`](#vec-algorithm) |

## `CustomParameter` {#customparameter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`CustomParameterId`](#customparameterid) |
  | `payload` | [`Json`](#json) |

## `CustomParameterId` {#customparameterid}

**Type:** Alias

**To:** [`Name`](#name)

## `CustomParameters` {#customparameters}

**Type:** Map

**Key:** [`CustomParameterId`](#customparameterid)

**Value:** [`CustomParameter`](#customparameter)

## `DataAvailabilityLayout` {#dataavailabilitylayout}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `encoding` | [`PayloadEncoding`](#payloadencoding) |
  | `chunk_size_bytes` | `u32` |
  | `data_shards` | `u16` |
  | `parity_shards` | `u16` |
  | `max_payload_size_bytes` | `u64` |
  | `max_chunk_count` | `u32` |

## `DataEventFilter` {#dataeventfilter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Any` | &mdash; | 0 |
  | `Peer` | [`PeerEventFilter`](#peereventfilter) | 1 |
  | `Domain` | [`DomainEventFilter`](#domaineventfilter) | 2 |
  | `Account` | [`AccountEventFilter`](#accounteventfilter) | 3 |
  | `Asset` | [`AssetEventFilter`](#asseteventfilter) | 4 |
  | `AssetDefinition` | [`AssetDefinitionEventFilter`](#assetdefinitioneventfilter) | 5 |
  | `Nft` | [`NftEventFilter`](#nfteventfilter) | 6 |
  | `Rwa` | [`RwaEventFilter`](#rwaeventfilter) | 7 |
  | `Trigger` | [`TriggerEventFilter`](#triggereventfilter) | 8 |
  | `Role` | [`RoleEventFilter`](#roleeventfilter) | 9 |
  | `Configuration` | [`ConfigurationEventFilter`](#configurationeventfilter) | 10 |
  | `Executor` | [`ExecutorEventFilter`](#executoreventfilter) | 11 |
  | `Proof` | [`ProofEventFilter`](#proofeventfilter) | 12 |
  | `VerifyingKey` | [`VerifyingKeyEventFilter`](#verifyingkeyeventfilter) | 13 |
  | `RuntimeUpgrade` | [`RuntimeUpgradeEventFilter`](#runtimeupgradeeventfilter) | 14 |
  | `Soradns` | [`SoradnsDirectoryEventFilter`](#soradnsdirectoryeventfilter) | 15 |
  | `Sorafs` | [`SorafsGatewayEventFilter`](#sorafsgatewayeventfilter) | 16 |
  | `Musubi` | [`MusubiEventFilter`](#musubieventfilter) | 17 |
  | `SpaceDirectory` | [`SpaceDirectoryEventFilter`](#spacedirectoryeventfilter) | 18 |
  | `Escrow` | [`EscrowEventFilter`](#escroweventfilter) | 19 |
  | `Oracle` | [`OracleEventFilter`](#oracleeventfilter) | 20 |
  | `Social` | [`SocialEventFilter`](#socialeventfilter) | 21 |
  | `Bridge` | [`BridgeEventFilter`](#bridgeeventfilter) | 22 |
  | `Governance` | [`GovernanceEventFilter`](#governanceeventfilter) | 23 |
  | `GameSession` | [`Option<Hash>`](#option-hash) | 24 |
  | `Sccp` | [`SccpEventFilter`](#sccpeventfilter) | 25 |
  | `KagemushaLoadCommitted` | [`Option<Array<u8, 32>>`](#option-array-u8-32) | 26 |
  | `Bond` | [`Option<AssetDefinitionId>`](#option-assetdefinitionid) | 27 |

## `DataSpaceId` {#dataspaceid}

**Type:** Alias

**To:** `u64`

## `DecodedCodeSizeLimitInfo` {#decodedcodesizelimitinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `decoded_bytes` | `u64` |
  | `limit` | `u64` |

## `DecodedInstructionLimitInfo` {#decodedinstructionlimitinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `decoded_instructions` | `u64` |
  | `limit` | `u64` |

## `DefiOracleAttestationKey` {#defioracleattestationkey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | `u32` |
  | `subject_id` | `u64` |

## `DefinitionId` {#definitionid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `DomainEventFilter` {#domaineventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<DomainId>`](#option-domainid) |
  | `event_set` | [`DomainEventSet`](#domaineventset) |

## `DomainEventSet` {#domaineventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `AssetDefinition` | `0x4` |
  | `Asset` | `0x8` |
  | `AnyNft` | `0x10` |
  | `AnyRwa` | `0x20` |
  | `Account` | `0x40` |
  | `AccountLinked` | `0x80` |
  | `AccountUnlinked` | `0x100` |
  | `MetadataInserted` | `0x200` |
  | `MetadataRemoved` | `0x400` |
  | `OwnerChanged` | `0x800` |
  | `KaigiRosterSummary` | `0x1000` |
  | `KaigiRelayRegistered` | `0x2000` |
  | `KaigiRelayManifestUpdated` | `0x4000` |
  | `KaigiUsageSummary` | `0x8000` |
  | `KaigiRelayHealthUpdated` | `0x10000` |
  | `StreamingTicketReady` | `0x20000` |
  | `StreamingTicketRevoked` | `0x40000` |
  | `KaigiRelayUnregistered` | `0x80000` |
  | `KaigiStatusChanged` | `0x100000` |

## `DomainId` {#domainid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | [`Name`](#name) |
  | `dataspace` | [`Name`](#name) |

## `EscrowEventFilter` {#escroweventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow_matcher` | [`Option<EscrowId>`](#option-escrowid) |
  | `seller_matcher` | [`Option<AccountId>`](#option-accountid) |
  | `buyer_matcher` | [`Option<AccountId>`](#option-accountid) |
  | `status_matcher` | [`Option<AssetEscrowStatus>`](#option-assetescrowstatus) |
  | `event_set` | [`EscrowEventSet`](#escroweventset) |

## `EscrowEventSet` {#escroweventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Opened` | `0x1` |
  | `Accepted` | `0x2` |
  | `PaymentSent` | `0x4` |
  | `Released` | `0x8` |
  | `Cancelled` | `0x10` |
  | `Expired` | `0x20` |
  | `Attested` | `0x40` |
  | `Disputed` | `0x80` |
  | `Resolved` | `0x100` |

## `EscrowId` {#escrowid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `EventFilterBox` {#eventfilterbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pipeline` | [`PipelineEventFilterBox`](#pipelineeventfilterbox) | 0 |
  | `Data` | [`DataEventFilter`](#dataeventfilter) | 1 |
  | `Time` | [`TimeEventFilter`](#timeeventfilter) | 2 |
  | `ExecuteTrigger` | [`ExecuteTriggerEventFilter`](#executetriggereventfilter) | 3 |
  | `TriggerCompleted` | [`TriggerCompletedEventFilter`](#triggercompletedeventfilter) | 4 |

## `ExecuteTriggerEventFilter` {#executetriggereventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`Option<TriggerId>`](#option-triggerid) |
  | `authority` | [`Option<AccountId>`](#option-accountid) |

## `ExecutionOutputPolicyV1` {#executionoutputpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_outputs` | `u32` |
  | `max_output_bytes` | `u64` |
  | `max_total_output_bytes` | `u64` |
  | `max_executed_wire_bytes` | `u64` |
  | `max_pipeline_triggers` | `u32` |
  | `max_time_triggers` | `u32` |
  | `max_time_invocations` | `u32` |

## `ExecutionTime` {#executiontime}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `PreCommit` | &mdash; | 0 |
  | `Schedule` | [`Schedule`](#schedule) | 1 |

## `ExecutorEventFilter` {#executoreventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `event_set` | [`ExecutorEventSet`](#executoreventset) |

## `ExecutorEventSet` {#executoreventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Upgraded` | `0x1` |

## `FastpqMandatorySourcePolicyV1` {#fastpqmandatorysourcepolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_retained_obligations` | `u32` |
  | `per_obligation` | [`FastpqSourceLimitsV1`](#fastpqsourcelimitsv1) |

## `FastpqSourceLimitsV1` {#fastpqsourcelimitsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_executed_entries` | `u32` |
  | `max_transcripts` | `u32` |
  | `max_deltas` | `u32` |
  | `max_input_transcript_bytes` | `u64` |
  | `max_statement_bytes` | `u64` |
  | `max_total_statement_bytes` | `u64` |

## `FastpqSourcePolicyV1` {#fastpqsourcepolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `intrinsic` | [`FastpqSourceLimitsV1`](#fastpqsourcelimitsv1) |
  | `block` | [`FastpqSourceLimitsV1`](#fastpqsourcelimitsv1) |
  | `max_native_maintenance_invocations` | `u32` |
  | `mandatory` | [`FastpqMandatorySourcePolicyV1`](#fastpqmandatorysourcepolicyv1) |

## `FeedId` {#feedid}

**Type:** Alias

**To:** [`Name`](#name)

## `FindError` {#finderror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Asset` | [`AssetId`](#assetid) | 0 |
  | `AssetDefinition` | [`AssetDefinitionId`](#assetdefinitionid) | 1 |
  | `Nft` | [`NftId`](#nftid) | 2 |
  | `Rwa` | [`RwaId`](#rwaid) | 3 |
  | `Account` | [`AccountId`](#accountid) | 4 |
  | `Domain` | [`DomainId`](#domainid) | 5 |
  | `MetadataKey` | [`Name`](#name) | 6 |
  | `Block` | [`HashOf<BlockHeader>`](#hashof-blockheader) | 7 |
  | `Transaction` | [`HashOf<SignedTransaction>`](#hashof-signedtransaction) | 8 |
  | `Peer` | [`PeerId`](#peerid) | 9 |
  | `Trigger` | [`TriggerId`](#triggerid) | 10 |
  | `Role` | [`RoleId`](#roleid) | 11 |
  | `Permission` | [`Permission`](#permission) | 12 |
  | `PublicKey` | [`PublicKey`](#publickey) | 13 |
  | `TwitterBinding` | [`KeyedHash`](#keyedhash) | 14 |
  | `OracleFeed` | [`FeedId`](#feedid) | 15 |
  | `OracleDispute` | [`OracleDisputeId`](#oracledisputeid) | 16 |
  | `OracleChange` | [`OracleChangeId`](#oraclechangeid) | 17 |
  | `OracleProviderStats` | [`OracleProviderKey`](#oracleproviderkey) | 18 |
  | `DefiOracleAttestation` | [`DefiOracleAttestationKey`](#defioracleattestationkey) | 19 |
  | `AssetEscrow` | [`EscrowId`](#escrowid) | 20 |
  | `SorafsPinManifest` | [`ManifestDigest`](#manifestdigest) | 21 |
  | `SorafsOrderbookPolicy` | &mdash; | 22 |
  | `SorafsOrderbookOrder` | [`Array<u8, 32>`](#array-u8-32) | 23 |
  | `SorafsOrderbookCancellation` | [`Array<u8, 32>`](#array-u8-32) | 24 |
  | `SorafsOrderbookReceipt` | [`Array<u8, 32>`](#array-u8-32) | 25 |
  | `SorafsOrderbookTrade` | [`Array<u8, 32>`](#array-u8-32) | 26 |
  | `SorafsOrderbookChannel` | [`Array<u8, 32>`](#array-u8-32) | 27 |
  | `SorafsOrderbookStatus` | &mdash; | 28 |
  | `SorafsReservePolicy` | &mdash; | 29 |
  | `SorafsReserveProvider` | [`ProviderId`](#providerid) | 30 |
  | `SorafsReserveMovement` | [`Array<u8, 32>`](#array-u8-32) | 31 |
  | `SorafsReserveAppeal` | [`Array<u8, 32>`](#array-u8-32) | 32 |
  | `SorafsPopIssuerPolicy` | &mdash; | 33 |
  | `SorafsPopCredentialCommitment` | [`Array<u8, 32>`](#array-u8-32) | 34 |
  | `SorafsPopCommitmentRoot` | `u64` | 35 |
  | `SorafsPopRevocationPublication` | `u64` | 36 |
  | `SorafsPopRevocation` | [`Array<u8, 32>`](#array-u8-32) | 37 |
  | `SorafsPopAuditDigest` | `u64` | 38 |
  | `SorafsPopRegistryStatus` | &mdash; | 39 |
  | `SorafsCitizenBond` | [`Array<u8, 32>`](#array-u8-32) | 40 |
  | `SorafsCitizenBondSnapshot` | &mdash; | 41 |
  | `SorafsRepairTask` | `String` | 42 |
  | `SorafsRepairStatus` | &mdash; | 43 |
  | `SorafsProofOutcome` | [`SorafsProofOutcomeFindErrorV1`](#sorafsproofoutcomefinderrorv1) | 44 |
  | `SorafsReputationJournalAuthorityPolicy` | &mdash; | 45 |
  | `SorafsReputationJournalEvent` | [`ReputationJournalSourceIdV1`](#reputationjournalsourceidv1) | 46 |
  | `SorafsModerationPolicy` | &mdash; | 47 |
  | `SorafsModerationAppeal` | `String` | 48 |
  | `SorafsModerationJurorEligibility` | `String` | 49 |
  | `SorafsModerationCase` | `String` | 50 |
  | `SorafsModerationCommit` | `String` | 51 |
  | `SorafsModerationReveal` | `String` | 52 |
  | `SorafsModerationChallenge` | `String` | 53 |
  | `SorafsModerationOutcome` | `String` | 54 |
  | `SorafsModerationNoShow` | `String` | 55 |
  | `SorafsModerationStatus` | &mdash; | 56 |
  | `GameSession` | [`Hash`](#hash) | 57 |
  | `ExecutionProofVerification` | [`Hash`](#hash) | 58 |
  | `SettlementReceipt` | [`SettlementId`](#settlementid) | 59 |
  | `Bond` | [`AssetDefinitionId`](#assetdefinitionid) | 60 |

## `GenesisIvmAction` {#genesisivmaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `executable` | `String` |
  | `repeats` | [`Repeats`](#repeats) |
  | `authority` | [`AccountId`](#accountid) |
  | `filter` | [`EventFilterBox`](#eventfilterbox) |

## `GenesisIvmTrigger` {#genesisivmtrigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |
  | `action` | [`GenesisIvmAction`](#genesisivmaction) |

## `GenesisTopologyEntry` {#genesistopologyentry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `peer` | [`PeerId`](#peerid) |
  | `pop_hex` | [`Option<String>`](#option-string) |

## `GovernanceEventFilter` {#governanceeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `referendum_id` | [`Option<String>`](#option-string) |
  | `event_set` | [`GovernanceEventSet`](#governanceeventset) |

## `GovernanceEventSet` {#governanceeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `ProposalSubmitted` | `0x1` |
  | `ProposalRejected` | `0x2` |
  | `LockCreated` | `0x4` |
  | `LockExtended` | `0x8` |
  | `ProposalEnacted` | `0x10` |
  | `BallotAccepted` | `0x20` |
  | `BallotRejected` | `0x40` |
  | `ReferendumOpened` | `0x80` |
  | `ReferendumClosed` | `0x100` |
  | `LockUnlocked` | `0x200` |
  | `ParliamentAttemptCreated` | `0x400` |
  | `ParliamentLifecycleTransitionApplied` | `0x800` |
  | `ThresholdKeyLifecycleApplied` | `0x1000` |
  | `LockSlashed` | `0x2000` |
  | `LockRestituted` | `0x4000` |
  | `CitizenRegistered` | `0x8000` |
  | `CitizenRevoked` | `0x10000` |
  | `ReferendumDecided` | `0x20000` |

## `Hash` {#hash}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `HashOf<BlockHeader>` {#hashof-blockheader}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<SignedTransaction>` {#hashof-signedtransaction}

**Type:** Alias

**To:** [`Hash`](#hash)

## `IdBox` {#idbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DomainId` | [`DomainId`](#domainid) | 0 |
  | `AccountId` | [`AccountId`](#accountid) | 1 |
  | `AssetDefinitionId` | [`AssetDefinitionId`](#assetdefinitionid) | 2 |
  | `AssetId` | [`AssetId`](#assetid) | 3 |
  | `NftId` | [`NftId`](#nftid) | 4 |
  | `RwaId` | [`RwaId`](#rwaid) | 5 |
  | `PeerId` | [`PeerId`](#peerid) | 6 |
  | `LaneId` | [`LaneId`](#laneid) | 7 |
  | `TriggerId` | [`TriggerId`](#triggerid) | 8 |
  | `RoleId` | [`RoleId`](#roleid) | 9 |
  | `Permission` | [`Permission`](#permission) | 10 |
  | `CustomParameterId` | [`CustomParameterId`](#customparameterid) | 11 |
  | `RepoAgreementId` | [`RepoAgreementId`](#repoagreementid) | 12 |

## `InstructionBox` {#instructionbox}

**Type:** Zero-Size Type (unit type, null type)

## `InstructionEvaluationError` {#instructionevaluationerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Unsupported` | [`InstructionType`](#instructiontype) | 0 |
  | `PermissionParameter` | `String` | 1 |
  | `Type` | [`TypeError`](#typeerror) | 2 |

## `InstructionExecutionError` {#instructionexecutionerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Evaluate` | [`InstructionEvaluationError`](#instructionevaluationerror) | 0 |
  | `Query` | [`QueryExecutionFail`](#queryexecutionfail) | 1 |
  | `Conversion` | `String` | 2 |
  | `Find` | [`FindError`](#finderror) | 3 |
  | `Repetition` | [`RepetitionError`](#repetitionerror) | 4 |
  | `Mintability` | [`MintabilityError`](#mintabilityerror) | 5 |
  | `Math` | [`MathError`](#matherror) | 6 |
  | `InvalidParameter` | [`InvalidParameterError`](#invalidparametererror) | 7 |
  | `AccountAdmission` | [`AccountAdmissionError`](#accountadmissionerror) | 8 |
  | `AssetTransferAdmission` | [`AssetTransferAdmissionError`](#assettransferadmissionerror) | 9 |
  | `InvariantViolation` | `String` | 10 |
  | `Runtime` | [`RuntimeRejectionV1`](#runtimerejectionv1) | 11 |

## `InstructionExecutionFail` {#instructionexecutionfail}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `instruction` | [`InstructionBox`](#instructionbox) |
  | `reason` | `String` |

## `InstructionType` {#instructiontype}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `SetParameter` | &mdash; | 0 |
  | `SetKeyValue` | &mdash; | 1 |
  | `RemoveKeyValue` | &mdash; | 2 |
  | `Register` | &mdash; | 3 |
  | `Unregister` | &mdash; | 4 |
  | `Mint` | &mdash; | 5 |
  | `Burn` | &mdash; | 6 |
  | `Transfer` | &mdash; | 7 |
  | `Grant` | &mdash; | 8 |
  | `Revoke` | &mdash; | 9 |
  | `Upgrade` | &mdash; | 10 |
  | `ExecuteTrigger` | &mdash; | 11 |
  | `Log` | &mdash; | 12 |
  | `Custom` | &mdash; | 13 |

## `InvalidParameterError` {#invalidparametererror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `SmartContract` | `String` | 0 |
  | `TimeTriggerInThePast` | &mdash; | 1 |

## `IvmAdmissionError` {#ivmadmissionerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MissingMaxCycles` | &mdash; | 0 |
  | `UnsupportedVersion` | [`UnsupportedVersionInfo`](#unsupportedversioninfo) | 1 |
  | `UnsupportedFeatureBits` | `u8` | 2 |
  | `UnsupportedAbiVersion` | `u8` | 3 |
  | `AbiVersionNotActive` | `u8` | 4 |
  | `VectorLengthTooLarge` | [`VectorLengthTooLargeInfo`](#vectorlengthtoolargeinfo) | 5 |
  | `MaxCyclesExceedsUpperBound` | [`MaxCyclesExceedsUpperBoundInfo`](#maxcyclesexceedsupperboundinfo) | 6 |
  | `MaxCyclesExceedsFuel` | [`MaxCyclesExceedsFuelInfo`](#maxcyclesexceedsfuelinfo) | 7 |
  | `DecodedInstructionCountExceeded` | [`DecodedInstructionLimitInfo`](#decodedinstructionlimitinfo) | 8 |
  | `DecodedCodeSizeExceeded` | [`DecodedCodeSizeLimitInfo`](#decodedcodesizelimitinfo) | 9 |
  | `BytecodeDecodingFailed` | `String` | 10 |
  | `ManifestCodeHashMismatch` | [`ManifestCodeHashMismatchInfo`](#manifestcodehashmismatchinfo) | 11 |
  | `ManifestAbiHashMismatch` | [`ManifestAbiHashMismatchInfo`](#manifestabihashmismatchinfo) | 12 |
  | `ManifestCodeHashMissing` | &mdash; | 13 |
  | `ManifestAbiHashMissing` | &mdash; | 14 |
  | `ManifestMalformed` | &mdash; | 15 |
  | `ArtifactAbiHashMismatch` | [`ArtifactAbiHashMismatchInfo`](#artifactabihashmismatchinfo) | 16 |
  | `GenericSyscallNotAllowed` | `u32` | 17 |

## `IvmFaultKindV1` {#ivmfaultkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `OutOfGas` | &mdash; | 0 |
  | `MemoryLimitExceeded` | &mdash; | 1 |
  | `MemoryAccessViolation` | &mdash; | 2 |
  | `MisalignedAccess` | &mdash; | 3 |
  | `MemoryOutOfBounds` | &mdash; | 4 |
  | `DecodeError` | &mdash; | 5 |
  | `InvalidOpcode` | &mdash; | 6 |
  | `UnknownSyscall` | &mdash; | 7 |
  | `UnsupportedSyscall` | &mdash; | 8 |
  | `GasCostOverflow` | &mdash; | 9 |
  | `Numeric` | [`NumericFaultV1`](#numericfaultv1) | 10 |
  | `PointerAbi` | [`PointerAbiFaultV1`](#pointerabifaultv1) | 11 |
  | `AssertionFailed` | &mdash; | 12 |
  | `ExceededMaxCycles` | &mdash; | 13 |
  | `InvalidMetadata` | &mdash; | 14 |
  | `InvalidVectorLength` | &mdash; | 15 |
  | `MissingHalt` | &mdash; | 16 |
  | `VectorExtensionDisabled` | &mdash; | 17 |
  | `ZkExtensionDisabled` | &mdash; | 18 |
  | `NullifierAlreadyUsed` | &mdash; | 19 |
  | `PermissionDenied` | &mdash; | 20 |
  | `PrivacyViolation` | &mdash; | 21 |
  | `RegisterOutOfBounds` | &mdash; | 22 |
  | `NoritoInvalid` | &mdash; | 23 |
  | `AbiTypeNotAllowed` | &mdash; | 24 |
  | `HostOutputItemsExceeded` | &mdash; | 25 |
  | `HostOutputBytesExceeded` | &mdash; | 26 |
  | `AmxBudgetExceeded` | &mdash; | 27 |
  | `ReentrantCall` | &mdash; | 28 |
  | `CallDepthExceeded` | &mdash; | 29 |

## `IvmFaultPositionV1` {#ivmfaultpositionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Initialization` | &mdash; | 0 |
  | `Execute` | [`IvmFaultPositionV1::Execute`](#ivmfaultpositionv1-execute) | 1 |
  | `ReturnValidation` | &mdash; | 2 |

## `IvmFaultPositionV1::Execute` {#ivmfaultpositionv1-execute}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `pc_offset` | `u64` |

## `IvmFaultSiteV1` {#ivmfaultsitev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |
  | `selector` | [`IvmInvocationSelectorV1`](#ivminvocationselectorv1) |
  | `position` | [`IvmFaultPositionV1`](#ivmfaultpositionv1) |

## `IvmFaultV1` {#ivmfaultv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`IvmFaultKindV1`](#ivmfaultkindv1) |
  | `site` | [`IvmFaultSiteV1`](#ivmfaultsitev1) |

## `IvmInvocationSelectorV1` {#ivminvocationselectorv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Generic` | &mdash; | 0 |
  | `Entrypoint` | `u32` | 1 |

## `Json` {#json}

**Type:** Alias

**To:** `String`

## `KeyedHash` {#keyedhash}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `pepper_id` | `String` |
  | `digest` | [`Hash`](#hash) |

## `LaneId` {#laneid}

**Type:** Alias

**To:** `u32`

## `ManifestAbiHashMismatchInfo` {#manifestabihashmismatchinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`Hash`](#hash) |
  | `actual` | [`Hash`](#hash) |

## `ManifestCodeHashMismatchInfo` {#manifestcodehashmismatchinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`Hash`](#hash) |
  | `actual` | [`Hash`](#hash) |

## `ManifestDigest` {#manifestdigest}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MathError` {#matherror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Overflow` | &mdash; | 0 |
  | `NotEnoughQuantity` | &mdash; | 1 |
  | `DivideByZero` | &mdash; | 2 |
  | `NegativeValue` | &mdash; | 3 |
  | `DomainViolation` | &mdash; | 4 |
  | `Unknown` | &mdash; | 5 |
  | `FixedPointConversion` | `String` | 6 |

## `MaxCyclesExceedsFuelInfo` {#maxcyclesexceedsfuelinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_cycles` | `u64` |
  | `fuel_limit` | `u64` |

## `MaxCyclesExceedsUpperBoundInfo` {#maxcyclesexceedsupperboundinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_cycles` | `u64` |
  | `upper_bound` | `u64` |

## `MintabilityError` {#mintabilityerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MintUnmintable` | &mdash; | 0 |
  | `ForbidMintOnMintable` | &mdash; | 1 |
  | `InvalidMintabilityTokens` | `u32` | 2 |

## `Mismatch<NumericSpec>` {#mismatch-numericspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`NumericSpec`](#numericspec) |
  | `actual` | [`NumericSpec`](#numericspec) |

## `MultisigMember` {#multisigmember}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |
  | `weight` | `u16` |

## `MultisigPolicy` {#multisigpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `threshold` | `u16` |
  | `members` | [`Vec<MultisigMember>`](#vec-multisigmember) |

## `MusubiAliasNameV1` {#musubialiasnamev1}

**Type:** Alias

**To:** `String`

## `MusubiEventFilter` {#musubieventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package_matcher` | [`Option<MusubiPackageIdV1>`](#option-musubipackageidv1) |
  | `archive_matcher` | [`Option<ArchiveId>`](#option-archiveid) |
  | `alias_matcher` | [`Option<MusubiAliasNameV1>`](#option-musubialiasnamev1) |
  | `event_set` | [`MusubiEventSet`](#musubieventset) |

## `MusubiEventSet` {#musubieventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `NamespaceBound` | `0x1` |
  | `PackageClaimed` | `0x2` |
  | `ReleasePublished` | `0x4` |
  | `ReleaseYankChanged` | `0x8` |
  | `PackageMetadataChanged` | `0x10` |
  | `MaintainerInvited` | `0x20` |
  | `MaintainerAccepted` | `0x40` |
  | `MaintainerInvitationExpired` | `0x80` |
  | `MaintainerInvitationRevoked` | `0x100` |
  | `MaintainerRoleChanged` | `0x200` |
  | `MaintainerRemoved` | `0x400` |
  | `PackageRecovered` | `0x800` |
  | `AliasRegistered` | `0x1000` |
  | `AliasRetargeted` | `0x2000` |
  | `ArchiveRegistered` | `0x4000` |
  | `ProviderBundleAttestationRegistered` | `0x8000` |
  | `ArchiveLocationChanged` | `0x10000` |
  | `ArchiveAvailabilityChanged` | `0x20000` |
  | `ArtifactTakenDown` | `0x40000` |
  | `RegistryPolicyChanged` | `0x80000` |

## `MusubiPackageIdV1` {#musubipackageidv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `home_dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `scope` | [`MusubiPackageScopeV1`](#musubipackagescopev1) |
  | `name` | [`MusubiPackageNameV1`](#musubipackagenamev1) |

## `MusubiPackageNameV1` {#musubipackagenamev1}

**Type:** Alias

**To:** `String`

## `MusubiPackageScopeV1` {#musubipackagescopev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DataspaceRoot` | &mdash; | 0 |
  | `Domain` | [`Name`](#name) | 1 |

## `Name` {#name}

**Type:** Alias

**To:** `String`

## `NftEventFilter` {#nfteventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<NftId>`](#option-nftid) |
  | `event_set` | [`NftEventSet`](#nfteventset) |

## `NftEventSet` {#nfteventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `MetadataInserted` | `0x4` |
  | `MetadataRemoved` | `0x8` |
  | `OwnerChanged` | `0x10` |

## `NftId` {#nftid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `name` | [`Name`](#name) |

## `NonZero<u16>` {#nonzero-u16}

**Type:** Alias

**To:** `u16`

## `NonZero<u32>` {#nonzero-u32}

**Type:** Alias

**To:** `u32`

## `NonZero<u64>` {#nonzero-u64}

**Type:** Alias

**To:** `u64`

## `Numeric` {#numeric}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `mantissa` | [`BigInt`](#bigint) |
  | `scale` | [`Compact<u32>`](#compact-u32) |

## `NumericFaultV1` {#numericfaultv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MantissaOverflow` | &mdash; | 1 |
  | `ScaleOverflow` | &mdash; | 2 |
  | `DivisionByZero` | &mdash; | 3 |
  | `RepeatingDecimal` | &mdash; | 4 |
  | `ExactDivisionScaleOverflow` | &mdash; | 5 |
  | `InvalidScale` | &mdash; | 6 |
  | `InexactConversion` | &mdash; | 7 |
  | `NegativeQuantity` | &mdash; | 8 |
  | `QuantityUnderflow` | &mdash; | 9 |
  | `InvalidRoundingMode` | &mdash; | 10 |
  | `InvalidFailureMode` | &mdash; | 11 |
  | `ReservedRegisterNonZero` | &mdash; | 12 |
  | `NegativeSquareRoot` | &mdash; | 13 |

## `NumericSpec` {#numericspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `scale` | [`Option<u32>`](#option-u32) |

## `Option<AccountId>` {#option-accountid}

**Type:** Option

**Some:** [`AccountId`](#accountid)

## `Option<ArchiveId>` {#option-archiveid}

**Type:** Option

**Some:** [`ArchiveId`](#archiveid)

## `Option<Array<u8, 32>>` {#option-array-u8-32}

**Type:** Option

**Some:** [`Array<u8, 32>`](#array-u8-32)

## `Option<AssetDefinitionId>` {#option-assetdefinitionid}

**Type:** Option

**Some:** [`AssetDefinitionId`](#assetdefinitionid)

## `Option<AssetEscrowStatus>` {#option-assetescrowstatus}

**Type:** Option

**Some:** [`AssetEscrowStatus`](#assetescrowstatus)

## `Option<AssetId>` {#option-assetid}

**Type:** Option

**Some:** [`AssetId`](#assetid)

## `Option<BlockStatus>` {#option-blockstatus}

**Type:** Option

**Some:** [`BlockStatus`](#blockstatus)

## `Option<ChangeSetId>` {#option-changesetid}

**Type:** Option

**Some:** [`ChangeSetId`](#changesetid)

## `Option<ConsensusFingerprint>` {#option-consensusfingerprint}

**Type:** Option

**Some:** [`ConsensusFingerprint`](#consensusfingerprint)

## `Option<DataSpaceId>` {#option-dataspaceid}

**Type:** Option

**Some:** [`DataSpaceId`](#dataspaceid)

## `Option<DomainId>` {#option-domainid}

**Type:** Option

**Some:** [`DomainId`](#domainid)

## `Option<EscrowId>` {#option-escrowid}

**Type:** Option

**Some:** [`EscrowId`](#escrowid)

## `Option<FeedId>` {#option-feedid}

**Type:** Option

**Some:** [`FeedId`](#feedid)

## `Option<Hash>` {#option-hash}

**Type:** Option

**Some:** [`Hash`](#hash)

## `Option<HashOf<BlockHeader>>` {#option-hashof-blockheader}

**Type:** Option

**Some:** [`HashOf<BlockHeader>`](#hashof-blockheader)

## `Option<HashOf<SignedTransaction>>` {#option-hashof-signedtransaction}

**Type:** Option

**Some:** [`HashOf<SignedTransaction>`](#hashof-signedtransaction)

## `Option<KeyedHash>` {#option-keyedhash}

**Type:** Option

**Some:** [`KeyedHash`](#keyedhash)

## `Option<LaneId>` {#option-laneid}

**Type:** Option

**Some:** [`LaneId`](#laneid)

## `Option<ManifestDigest>` {#option-manifestdigest}

**Type:** Option

**Some:** [`ManifestDigest`](#manifestdigest)

## `Option<MusubiAliasNameV1>` {#option-musubialiasnamev1}

**Type:** Option

**Some:** [`MusubiAliasNameV1`](#musubialiasnamev1)

## `Option<MusubiPackageIdV1>` {#option-musubipackageidv1}

**Type:** Option

**Some:** [`MusubiPackageIdV1`](#musubipackageidv1)

## `Option<NftId>` {#option-nftid}

**Type:** Option

**Some:** [`NftId`](#nftid)

## `Option<NonZero<u64>>` {#option-nonzero-u64}

**Type:** Option

**Some:** [`NonZero<u64>`](#nonzero-u64)

## `Option<Option<NonZero<u64>>>` {#option-option-nonzero-u64}

**Type:** Option

**Some:** [`Option<NonZero<u64>>`](#option-nonzero-u64)

## `Option<Parameters>` {#option-parameters}

**Type:** Option

**Some:** [`Parameters`](#parameters)

## `Option<PeerId>` {#option-peerid}

**Type:** Option

**Some:** [`PeerId`](#peerid)

## `Option<ProofId>` {#option-proofid}

**Type:** Option

**Some:** [`ProofId`](#proofid)

## `Option<ProviderId>` {#option-providerid}

**Type:** Option

**Some:** [`ProviderId`](#providerid)

## `Option<RoleId>` {#option-roleid}

**Type:** Option

**Some:** [`RoleId`](#roleid)

## `Option<RwaId>` {#option-rwaid}

**Type:** Option

**Some:** [`RwaId`](#rwaid)

## `Option<SccpNetworkV1>` {#option-sccpnetworkv1}

**Type:** Option

**Some:** [`SccpNetworkV1`](#sccpnetworkv1)

## `Option<SorafsGarPolicy>` {#option-sorafsgarpolicy}

**Type:** Option

**Some:** [`SorafsGarPolicy`](#sorafsgarpolicy)

## `Option<SorafsGarPolicyDetail>` {#option-sorafsgarpolicydetail}

**Type:** Option

**Some:** [`SorafsGarPolicyDetail`](#sorafsgarpolicydetail)

## `Option<String>` {#option-string}

**Type:** Option

**Some:** `String`

## `Option<TransactionStatus>` {#option-transactionstatus}

**Type:** Option

**Some:** [`TransactionStatus`](#transactionstatus)

## `Option<TriggerCompletedOutcomeType>` {#option-triggercompletedoutcometype}

**Type:** Option

**Some:** [`TriggerCompletedOutcomeType`](#triggercompletedoutcometype)

## `Option<TriggerId>` {#option-triggerid}

**Type:** Option

**Some:** [`TriggerId`](#triggerid)

## `Option<UniversalAccountId>` {#option-universalaccountid}

**Type:** Option

**Some:** [`UniversalAccountId`](#universalaccountid)

## `Option<VerifyingKeyId>` {#option-verifyingkeyid}

**Type:** Option

**Some:** [`VerifyingKeyId`](#verifyingkeyid)

## `Option<u32>` {#option-u32}

**Type:** Option

**Some:** `u32`

## `Option<u64>` {#option-u64}

**Type:** Option

**Some:** `u64`

## `OracleChangeId` {#oraclechangeid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `OracleDisputeId` {#oracledisputeid}

**Type:** Alias

**To:** `u64`

## `OracleEventFilter` {#oracleeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_matcher` | [`Option<FeedId>`](#option-feedid) |
  | `event_set` | [`OracleEventSet`](#oracleeventset) |

## `OracleEventSet` {#oracleeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `FeedProcessed` | `0x1` |
  | `PenaltyApplied` | `0x2` |
  | `RewardApplied` | `0x4` |
  | `TwitterBindingRecorded` | `0x8` |
  | `TwitterBindingRevoked` | `0x10` |
  | `DisputeOpened` | `0x20` |
  | `DisputeResolved` | `0x40` |
  | `ChangeProposed` | `0x80` |
  | `ChangeStageUpdated` | `0x100` |
  | `DefiAttestationRecorded` | `0x200` |

## `OracleProviderKey` {#oracleproviderkey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `provider_id` | [`AccountId`](#accountid) |

## `Parameters` {#parameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sumeragi` | [`SumeragiParameters`](#sumeragiparameters) |
  | `block` | [`BlockParameters`](#blockparameters) |
  | `transaction` | [`TransactionParameters`](#transactionparameters) |
  | `executor` | [`SmartContractParameters`](#smartcontractparameters) |
  | `smart_contract` | [`SmartContractParameters`](#smartcontractparameters) |
  | `custom` | [`CustomParameters`](#customparameters) |

## `PayloadEncoding` {#payloadencoding}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `reed_solomon16` | &mdash; | 0 |

## `PeerEventFilter` {#peereventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<PeerId>`](#option-peerid) |
  | `event_set` | [`PeerEventSet`](#peereventset) |

## `PeerEventSet` {#peereventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Added` | `0x1` |
  | `Removed` | `0x2` |

## `PeerId` {#peerid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |

## `Permission` {#permission}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `payload` | [`Json`](#json) |

## `PipelineEventFilterBox` {#pipelineeventfilterbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transaction` | [`TransactionEventFilter`](#transactioneventfilter) | 0 |
  | `Block` | [`BlockEventFilter`](#blockeventfilter) | 1 |
  | `Witness` | [`WitnessEventFilter`](#witnesseventfilter) | 2 |

## `PointerAbiFaultV1` {#pointerabifaultv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `InvalidAddress` | &mdash; | 1 |
  | `UnknownType` | &mdash; | 2 |
  | `TypeNotAllowed` | &mdash; | 3 |
  | `WrongType` | &mdash; | 4 |
  | `InvalidEnvelopeVersion` | &mdash; | 5 |
  | `OversizedLength` | &mdash; | 6 |
  | `TruncatedEnvelope` | &mdash; | 7 |
  | `PayloadHashMismatch` | &mdash; | 8 |
  | `MalformedFrame` | &mdash; | 9 |
  | `SchemaMismatch` | &mdash; | 10 |
  | `NonCanonical` | &mdash; | 11 |

## `ProofEventFilter` {#proofeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<ProofId>`](#option-proofid) |
  | `event_set` | [`ProofEventSet`](#proofeventset) |

## `ProofEventSet` {#proofeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Verified` | `0x1` |
  | `Rejected` | `0x2` |
  | `Pruned` | `0x4` |

## `ProofId` {#proofid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `proof_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `ProofOutcomeKindV1` {#proofoutcomekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `pdp` | &mdash; | 0 |
  | `potr` | &mdash; | 1 |

## `ProviderId` {#providerid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `PublicKey` {#publickey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `algorithm` | [`Algorithm`](#algorithm) |
  | `payload` | [`Vec<u8>`](#vec-u8) |

## `Quantity` {#quantity}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `value` | [`Numeric`](#numeric) |

## `QueryExecutionFail` {#queryexecutionfail}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Find` | [`FindError`](#finderror) | 0 |
  | `CanonicalHistory` | [`CanonicalHistoryError`](#canonicalhistoryerror) | 1 |
  | `Conversion` | `String` | 2 |
  | `NotFound` | &mdash; | 3 |
  | `CursorMismatch` | &mdash; | 4 |
  | `CursorDone` | &mdash; | 5 |
  | `FetchSizeTooBig` | &mdash; | 6 |
  | `GasBudgetExceeded` | &mdash; | 7 |
  | `InvalidSingularParameters` | &mdash; | 8 |
  | `CapacityLimit` | &mdash; | 9 |
  | `Expired` | &mdash; | 10 |
  | `AuthorityQuotaExceeded` | &mdash; | 11 |

## `RawGenesisTransaction` {#rawgenesistransaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `chain` | [`ChainId`](#chainid) |
  | `chain_discriminant` | `u16` |
  | `executor` | [`Option<String>`](#option-string) |
  | `ivm_dir` | `String` |
  | `transactions` | [`Vec<RawGenesisTx>`](#vec-rawgenesistx) |
  | `consensus_mode` | [`SumeragiConsensusMode`](#sumeragiconsensusmode) |
  | `wire_protocol_version` | `u32` |
  | `consensus_fingerprint` | [`Option<ConsensusFingerprint>`](#option-consensusfingerprint) |
  | `sumeragi_context` | [`SumeragiGenesisContextParameters`](#sumeragigenesiscontextparameters) |
  | `crypto_admission_policy` | [`CryptoAdmissionPolicyV1`](#cryptoadmissionpolicyv1) |

## `RawGenesisTx` {#rawgenesistx}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parameters` | [`Option<Parameters>`](#option-parameters) |
  | `instructions` | [`Vec<InstructionBox>`](#vec-instructionbox) |
  | `ivm_triggers` | [`Vec<GenesisIvmTrigger>`](#vec-genesisivmtrigger) |
  | `topology` | [`Vec<GenesisTopologyEntry>`](#vec-genesistopologyentry) |

## `Repeats` {#repeats}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Indefinitely` | &mdash; | 0 |
  | `Exactly` | `u32` | 1 |

## `RepetitionError` {#repetitionerror}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `instruction` | [`InstructionType`](#instructiontype) |
  | `id` | [`IdBox`](#idbox) |

## `RepoAgreementId` {#repoagreementid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | [`Name`](#name) |

## `ReputationJournalSourceIdV1` {#reputationjournalsourceidv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `RestrictionV1` {#restrictionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Deprecated` | `u64` | 0 |
  | `AdmissionClosed` | `u64` | 1 |
  | `CompletionOnly` | `u64` | 2 |
  | `Disabled` | `u64` | 3 |

## `RoleEventFilter` {#roleeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<RoleId>`](#option-roleid) |
  | `event_set` | [`RoleEventSet`](#roleeventset) |

## `RoleEventSet` {#roleeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `PermissionAdded` | `0x4` |
  | `PermissionRemoved` | `0x8` |

## `RoleId` {#roleid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | [`Name`](#name) |

## `RuntimeRejectionV1` {#runtimerejectionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DefinitionInactive` | [`RuntimeRejectionV1::DefinitionInactive`](#runtimerejectionv1-definitioninactive) | 0 |
  | `DefinitionRestricted` | [`RuntimeRejectionV1::DefinitionRestricted`](#runtimerejectionv1-definitionrestricted) | 1 |
  | `ExpectationMismatch` | [`RuntimeRejectionV1::ExpectationMismatch`](#runtimerejectionv1-expectationmismatch) | 2 |
  | `MalformedPayload` | [`RuntimeRejectionV1::MalformedPayload`](#runtimerejectionv1-malformedpayload) | 3 |

## `RuntimeRejectionV1::DefinitionInactive` {#runtimerejectionv1-definitioninactive}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `wire_id` | `String` |

## `RuntimeRejectionV1::DefinitionRestricted` {#runtimerejectionv1-definitionrestricted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `definition` | [`DefinitionId`](#definitionid) |
  | `restriction` | [`RestrictionV1`](#restrictionv1) |

## `RuntimeRejectionV1::ExpectationMismatch` {#runtimerejectionv1-expectationmismatch}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `wire_id` | [`Option<String>`](#option-string) |

## `RuntimeRejectionV1::MalformedPayload` {#runtimerejectionv1-malformedpayload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `wire_id` | `String` |

## `RuntimeUpgradeEventFilter` {#runtimeupgradeeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<ChangeSetId>`](#option-changesetid) |
  | `event_set` | [`RuntimeUpgradeEventSet`](#runtimeupgradeeventset) |

## `RuntimeUpgradeEventSet` {#runtimeupgradeeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Scheduled` | `0x1` |
  | `Attested` | `0x2` |
  | `Activated` | `0x4` |
  | `Lapsed` | `0x8` |
  | `Canceled` | `0x10` |
  | `Contained` | `0x20` |
  | `ContainmentExpired` | `0x40` |
  | `ContainmentReviewed` | `0x80` |
  | `ContainmentResolved` | `0x100` |

## `RwaEventFilter` {#rwaeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<RwaId>`](#option-rwaid) |
  | `event_set` | [`RwaEventSet`](#rwaeventset) |

## `RwaEventSet` {#rwaeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `MetadataInserted` | `0x2` |
  | `MetadataRemoved` | `0x4` |
  | `OwnerChanged` | `0x8` |
  | `Split` | `0x10` |
  | `Merged` | `0x20` |
  | `Redeemed` | `0x40` |
  | `Frozen` | `0x80` |
  | `Unfrozen` | `0x100` |
  | `Held` | `0x200` |
  | `Released` | `0x400` |
  | `ForceTransferred` | `0x800` |
  | `ControlsChanged` | `0x1000` |

## `RwaId` {#rwaid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `hash` | [`Hash`](#hash) |

## `SccpEventFilter` {#sccpeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_matcher` | [`Option<SccpNetworkV1>`](#option-sccpnetworkv1) |
  | `event_set` | [`SccpEventSet`](#sccpeventset) |

## `SccpEventSet` {#sccpeventset}

**Type:** Bitmap

**Repr:** u64

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `MessageRecorded` | `0x1` |
  | `BlockCommitted` | `0x2` |
  | `InboundProven` | `0x4` |
  | `RecipientRegistered` | `0x8` |
  | `InboundReleased` | `0x10` |
  | `InboundBounced` | `0x20` |
  | `InboundLiabilityShortfall` | `0x40` |
  | `OutboundVoided` | `0x80` |
  | `OutboundRefunded` | `0x100` |
  | `OutboundStranded` | `0x200` |
  | `StrandedReleased` | `0x400` |
  | `LightClientAdvanced` | `0x800` |
  | `LightClientFrozen` | `0x1000` |
  | `LightClientInitialized` | `0x2000` |
  | `TrustedCheckpointInstalled` | `0x4000` |
  | `RevisionActivationChanged` | `0x8000` |
  | `ControlRecorded` | `0x10000` |
  | `GovernanceEnacted` | `0x20000` |
  | `CommitteeGenerationCreated` | `0x40000` |
  | `GenerationMemberUnslashable` | `0x80000` |
  | `CommitteeResync` | `0x100000` |
  | `GenerationDestinationCleared` | `0x200000` |
  | `FinalityDegraded` | `0x400000` |
  | `FastPauseLapsed` | `0x800000` |
  | `ForgeryEvidenceRecorded` | `0x1000000` |
  | `ForgeryOffenderUnslashable` | `0x2000000` |
  | `RevisionForgeryHeld` | `0x4000000` |
  | `RevisionForgeryReleased` | `0x8000000` |
  | `RevisionQuarantined` | `0x10000000` |
  | `ReconciliationOpened` | `0x20000000` |
  | `ForgedMintProven` | `0x40000000` |
  | `ReconciliationSettled` | `0x80000000` |
  | `ReconciledClaimSettled` | `0x100000000` |
  | `InboundStranded` | `0x200000000` |
  | `PausePanelSeated` | `0x400000000` |
  | `PausePanelUnavailable` | `0x800000000` |
  | `PausePanelSeatAccepted` | `0x1000000000` |
  | `FastPauseEndorsed` | `0x2000000000` |
  | `FastPauseNoResult` | `0x4000000000` |
  | `FastPauseEnacted` | `0x8000000000` |
  | `FastPauseRetained` | `0x10000000000` |
  | `FastPauseCleared` | `0x20000000000` |

## `SccpNetworkV1` {#sccpnetworkv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `sora_taira` | &mdash; | 64 |
  | `ethereum_mainnet` | &mdash; | 65 |
  | `bsc_mainnet` | &mdash; | 66 |
  | `ton_mainnet` | &mdash; | 68 |

## `Schedule` {#schedule}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `start_ms` | `u64` |
  | `period_ms` | [`Option<u64>`](#option-u64) |

## `SettlementId` {#settlementid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `owner` | [`AccountId`](#accountid) |
  | `reference` | [`Name`](#name) |

## `SettlementReplayDispositionV1` {#settlementreplaydispositionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `AlreadySettled` | &mdash; | 0 |
  | `ConflictingIntent` | &mdash; | 1 |

## `SettlementReplayV1` {#settlementreplayv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `settlement_id` | [`SettlementId`](#settlementid) |
  | `disposition` | [`SettlementReplayDispositionV1`](#settlementreplaydispositionv1) |
  | `committed_block_height` | `u64` |
  | `committed_block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |

## `SmartContractParameters` {#smartcontractparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `fuel` | [`NonZero<u64>`](#nonzero-u64) |
  | `memory` | [`NonZero<u64>`](#nonzero-u64) |
  | `execution_depth` | `u8` |
  | `max_output_items` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_output_bytes` | [`NonZero<u64>`](#nonzero-u64) |

## `SocialEventFilter` {#socialeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_matcher` | [`Option<KeyedHash>`](#option-keyedhash) |

## `SoradnsDirectoryEventFilter` {#soradnsdirectoryeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `directory_matcher` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `resolver_matcher` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `event_set` | [`SoradnsDirectoryEventSet`](#soradnsdirectoryeventset) |

## `SoradnsDirectoryEventSet` {#soradnsdirectoryeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `DraftSubmitted` | `0x1` |
  | `Published` | `0x2` |
  | `Revoked` | `0x4` |
  | `Unrevoked` | `0x8` |
  | `ReleaseSignerAdded` | `0x10` |
  | `ReleaseSignerRemoved` | `0x20` |
  | `PolicyUpdated` | `0x40` |

## `SorafsGarPolicy` {#sorafsgarpolicy}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ManifestEnvelope` | &mdash; | 0 |
  | `Provider` | &mdash; | 1 |
  | `Admission` | &mdash; | 2 |
  | `GatewayCompliance` | &mdash; | 3 |
  | `RateLimit` | &mdash; | 4 |
  | `Cdn` | &mdash; | 5 |

## `SorafsGarPolicyDetail` {#sorafsgarpolicydetail}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ManifestEnvelopeMissing` | &mdash; | 0 |
  | `ProviderIdMissing` | &mdash; | 1 |
  | `AdmissionUnavailable` | &mdash; | 2 |
  | `ProviderNotAdmitted` | &mdash; | 3 |
  | `GatewayComplianceDenied` | &mdash; | 4 |
  | `RateLimitExceeded` | &mdash; | 5 |
  | `RateLimitBanned` | &mdash; | 6 |
  | `CdnTtlExceeded` | &mdash; | 7 |
  | `CdnPurgeRequired` | &mdash; | 8 |
  | `CdnModerationBlocked` | &mdash; | 9 |
  | `CdnRateCeilingExceeded` | &mdash; | 10 |
  | `CdnGeofenceDenied` | &mdash; | 11 |
  | `CdnLegalHoldActive` | &mdash; | 12 |

## `SorafsGatewayEventFilter` {#sorafsgatewayeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_matcher` | [`Option<ProviderId>`](#option-providerid) |
  | `manifest_digest_matcher` | [`Option<ManifestDigest>`](#option-manifestdigest) |
  | `policy_matcher` | [`Option<SorafsGarPolicy>`](#option-sorafsgarpolicy) |
  | `detail_matcher` | [`Option<SorafsGarPolicyDetail>`](#option-sorafsgarpolicydetail) |
  | `event_set` | [`SorafsGatewayEventSet`](#sorafsgatewayeventset) |

## `SorafsGatewayEventSet` {#sorafsgatewayeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `GarViolation` | `0x1` |
  | `ProofHealth` | `0x2` |
  | `AnyRepairLedger` | `0x4` |
  | `AnyModerationLedger` | `0x8` |
  | `AnyOrderbookLedger` | `0x10` |
  | `AnyReserveLedger` | `0x20` |
  | `AnyReputationJournal` | `0x40` |

## `SorafsProofOutcomeFindErrorV1` {#sorafsproofoutcomefinderrorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`ProofOutcomeKindV1`](#proofoutcomekindv1) |
  | `identity_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `SpaceDirectoryEventFilter` {#spacedirectoryeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace_matcher` | [`Option<DataSpaceId>`](#option-dataspaceid) |
  | `uaid_matcher` | [`Option<UniversalAccountId>`](#option-universalaccountid) |
  | `event_set` | [`SpaceDirectoryEventSet`](#spacedirectoryeventset) |

## `SpaceDirectoryEventSet` {#spacedirectoryeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `ManifestActivated` | `0x1` |
  | `ManifestExpired` | `0x2` |
  | `ManifestRevoked` | `0x4` |

## `String` {#string}

**Type:** Alias

**To:** `String`

## `SumeragiConsensusMode` {#sumeragiconsensusmode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Permissioned` | &mdash; | 0 |
  | `Npos` | &mdash; | 1 |

## `SumeragiGenesisContextParameters` {#sumeragigenesiscontextparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `root_scope` | [`SumeragiRootScope`](#sumeragirootscope) |
  | `da_layout` | [`DataAvailabilityLayout`](#dataavailabilitylayout) |
  | `nexus_amx_context_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `execution_policy_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `SumeragiParameters` {#sumeragiparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_cadence_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_clock_drift_ms` | `u64` |
  | `due_work_max_lag_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `key_activation_lead_blocks` | `u64` |
  | `key_overlap_grace_blocks` | `u64` |
  | `key_expiry_grace_blocks` | `u64` |
  | `key_allowed_algorithms` | [`Vec<Algorithm>`](#vec-algorithm) |
  | `payload_retry_interval_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `exec_budget_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `apply_budget_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_block_bytes` | [`NonZero<u32>`](#nonzero-u32) |
  | `epoch_length_blocks` | [`NonZero<u64>`](#nonzero-u64) |
  | `demotion_window` | [`NonZero<u64>`](#nonzero-u64) |

## `SumeragiRootScope` {#sumeragirootscope}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `global` | &mdash; | 0 |
  | `dataspace` | [`SumeragiRootScope::Dataspace`](#sumeragirootscope-dataspace) | 1 |

## `SumeragiRootScope::Dataspace` {#sumeragirootscope-dataspace}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parent_network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |

## `TimeEventFilter` {#timeeventfilter}

**Type:** Alias

**To:** [`ExecutionTime`](#executiontime)

## `TransactionEventFilter` {#transactioneventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `hash` | [`Option<HashOf<SignedTransaction>>`](#option-hashof-signedtransaction) |
  | `block_height` | [`Option<Option<NonZero<u64>>>`](#option-option-nonzero-u64) |
  | `lane_id` | [`Option<LaneId>`](#option-laneid) |
  | `dataspace_id` | [`Option<DataSpaceId>`](#option-dataspaceid) |
  | `status` | [`Option<TransactionStatus>`](#option-transactionstatus) |

## `TransactionLimitError` {#transactionlimiterror}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |

## `TransactionParameters` {#transactionparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_signatures` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_instructions` | [`NonZero<u64>`](#nonzero-u64) |
  | `ivm_bytecode_size` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_tx_bytes` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_decompressed_bytes` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_metadata_depth` | [`NonZero<u16>`](#nonzero-u16) |
  | `max_time_to_live_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `require_height_ttl` | `bool` |
  | `require_sequence` | `bool` |

## `TransactionRejectionReason` {#transactionrejectionreason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `AccountDoesNotExist` | [`FindError`](#finderror) | 0 |
  | `LimitCheck` | [`TransactionLimitError`](#transactionlimiterror) | 1 |
  | `Validation` | [`ValidationFail`](#validationfail) | 2 |
  | `InstructionExecution` | [`InstructionExecutionFail`](#instructionexecutionfail) | 3 |
  | `TriggerExecution` | [`TriggerExecutionFail`](#triggerexecutionfail) | 4 |
  | `AnonymousBallot` | [`AnonymousBallotRejectionV1`](#anonymousballotrejectionv1) | 5 |

## `TransactionStatus` {#transactionstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Queued` | &mdash; | 0 |
  | `Expired` | &mdash; | 1 |
  | `Approved` | &mdash; | 2 |
  | `Rejected` | [`TransactionRejectionReason`](#transactionrejectionreason) | 3 |

## `TriggerCompletedEventFilter` {#triggercompletedeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`Option<TriggerId>`](#option-triggerid) |
  | `outcome_type` | [`Option<TriggerCompletedOutcomeType>`](#option-triggercompletedoutcometype) |

## `TriggerCompletedOutcomeType` {#triggercompletedoutcometype}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Success` | &mdash; | 0 |
  | `Failure` | &mdash; | 1 |

## `TriggerEventFilter` {#triggereventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<TriggerId>`](#option-triggerid) |
  | `event_set` | [`TriggerEventSet`](#triggereventset) |

## `TriggerEventSet` {#triggereventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Created` | `0x1` |
  | `Deleted` | `0x2` |
  | `Extended` | `0x4` |
  | `Shortened` | `0x8` |
  | `MetadataInserted` | `0x10` |
  | `MetadataRemoved` | `0x20` |

## `TriggerExecutionFail` {#triggerexecutionfail}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MaxDepthExceeded` | &mdash; | 0 |

## `TriggerId` {#triggerid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | [`Name`](#name) |

## `TypeError` {#typeerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `AssetNumericSpec` | [`Mismatch<NumericSpec>`](#mismatch-numericspec) | 0 |

## `UniversalAccountId` {#universalaccountid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `UnsupportedVersionInfo` {#unsupportedversioninfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `major` | `u8` |
  | `minor` | `u8` |

## `ValidationFail` {#validationfail}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `NotPermitted` | `String` | 0 |
  | `IvmAdmission` | [`IvmAdmissionError`](#ivmadmissionerror) | 1 |
  | `InstructionFailed` | [`InstructionExecutionError`](#instructionexecutionerror) | 2 |
  | `ContractRejected` | [`ContractRejection`](#contractrejection) | 3 |
  | `IvmFault` | [`IvmFaultV1`](#ivmfaultv1) | 4 |
  | `QueryFailed` | [`QueryExecutionFail`](#queryexecutionfail) | 5 |
  | `AxtReject` | [`AxtRejectContext`](#axtrejectcontext) | 6 |
  | `SettlementReplay` | [`SettlementReplayV1`](#settlementreplayv1) | 7 |
  | `TooComplex` | &mdash; | 8 |
  | `InternalError` | &mdash; | 9 |

## `Vec<Algorithm>` {#vec-algorithm}

**Type:** Vec

**Value:** [`Algorithm`](#algorithm)

## `Vec<GenesisIvmTrigger>` {#vec-genesisivmtrigger}

**Type:** Vec

**Value:** [`GenesisIvmTrigger`](#genesisivmtrigger)

## `Vec<GenesisTopologyEntry>` {#vec-genesistopologyentry}

**Type:** Vec

**Value:** [`GenesisTopologyEntry`](#genesistopologyentry)

## `Vec<InstructionBox>` {#vec-instructionbox}

**Type:** Vec

**Value:** [`InstructionBox`](#instructionbox)

## `Vec<MultisigMember>` {#vec-multisigmember}

**Type:** Vec

**Value:** [`MultisigMember`](#multisigmember)

## `Vec<RawGenesisTx>` {#vec-rawgenesistx}

**Type:** Vec

**Value:** [`RawGenesisTx`](#rawgenesistx)

## `Vec<u8>` {#vec-u8}

**Type:** Vec

**Value:** `u8`

## `VectorLengthTooLargeInfo` {#vectorlengthtoolargeinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `vector_length` | `u8` |
  | `max_allowed` | `u8` |

## `VerifyingKeyEventFilter` {#verifyingkeyeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<VerifyingKeyId>`](#option-verifyingkeyid) |
  | `event_set` | [`VerifyingKeyEventSet`](#verifyingkeyeventset) |

## `VerifyingKeyEventSet` {#verifyingkeyeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Registered` | `0x1` |
  | `Updated` | `0x2` |

## `VerifyingKeyId` {#verifyingkeyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `name` | `String` |

## `WitnessEventFilter` {#witnesseventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_hash` | [`Option<HashOf<BlockHeader>>`](#option-hashof-blockheader) |
  | `height` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `view` | [`Option<u64>`](#option-u64) |

## `bool` {#bool}

**Type:** Alias

**To:** `bool`

## `u16` {#u16}

**Type:** Int

**Kind:** FixedWidth

## `u32` {#u32}

**Type:** Int

**Kind:** FixedWidth

## `u64` {#u64}

**Type:** Int

**Kind:** FixedWidth

## `u8` {#u8}

**Type:** Int

**Kind:** FixedWidth
