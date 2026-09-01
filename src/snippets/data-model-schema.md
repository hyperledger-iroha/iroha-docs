## `AbiVersion` {#abiversion}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `abi_version` | `u16` |

## `AbsoluteOutlier` {#absoluteoutlier}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_delta` | [`i128`](#i128) |

## `AccessSetHints` {#accesssethints}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `read_keys` | [`Vec<String>`](#vec-string) |
  | `write_keys` | [`Vec<String>`](#vec-string) |
  | `dynamic_reads` | [`Vec<DynamicAccessHint>`](#vec-dynamicaccesshint) |
  | `dynamic_writes` | [`Vec<DynamicAccessHint>`](#vec-dynamicaccesshint) |

## `Account` {#account}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AccountId`](#accountid) |
  | `metadata` | [`Metadata`](#metadata) |
  | `label` | [`Option<AccountAlias>`](#option-accountalias) |
  | `uaid` | [`Option<UniversalAccountId>`](#option-universalaccountid) |
  | `opaque_ids` | [`Vec<OpaqueAccountId>`](#vec-opaqueaccountid) |

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

## `AccountAlias` {#accountalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `label` | [`Name`](#name) |
  | `domain` | [`Option<AccountAliasDomain>`](#option-accountaliasdomain) |
  | `dataspace` | [`DataSpaceId`](#dataspaceid) |

## `AccountAliasBindingRecord` {#accountaliasbindingrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account_id` | [`AccountId`](#accountid) |
  | `alias` | `String` |
  | `dataspace` | `String` |
  | `domain` | [`Option<String>`](#option-string) |
  | `is_primary` | `bool` |
  | `status` | [`NameStatus`](#namestatus) |
  | `lease_expiry_ms` | [`Option<u64>`](#option-u64) |
  | `grace_until_ms` | [`Option<u64>`](#option-u64) |
  | `bound_at_ms` | `u64` |

## `AccountAliasDomain` {#accountaliasdomain}

**Type:** Alias

**To:** [`Name`](#name)

## `AccountController` {#accountcontroller}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Single` | [`PublicKey`](#publickey) | 0 |
  | `Multisig` | [`MultisigPolicy`](#multisigpolicy) | 1 |

## `AccountControllerReplaced` {#accountcontrollerreplaced}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `previous_account` | [`AccountId`](#accountid) |
  | `previous_controller` | [`AccountController`](#accountcontroller) |
  | `new_controller` | [`AccountController`](#accountcontroller) |

## `AccountCreated` {#accountcreated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`Account`](#account) |

## `AccountDomainLinkChanged` {#accountdomainlinkchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `account` | [`AccountId`](#accountid) |

## `AccountEvent` {#accountevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`AccountCreated`](#accountcreated) | 0 |
  | `Deleted` | [`AccountId`](#accountid) | 1 |
  | `ControllerReplaced` | [`AccountControllerReplaced`](#accountcontrollerreplaced) | 2 |
  | `PermissionAdded` | [`AccountPermissionChanged`](#accountpermissionchanged) | 3 |
  | `PermissionRemoved` | [`AccountPermissionChanged`](#accountpermissionchanged) | 4 |
  | `RoleGranted` | [`AccountRoleChanged`](#accountrolechanged) | 5 |
  | `RoleRevoked` | [`AccountRoleChanged`](#accountrolechanged) | 6 |
  | `MetadataInserted` | [`MetadataChanged<AccountId>`](#metadatachanged-accountid) | 7 |
  | `MetadataRemoved` | [`MetadataChanged<AccountId>`](#metadatachanged-accountid) | 8 |
  | `Recovery` | [`AccountRecoveryEvent`](#accountrecoveryevent) | 9 |
  | `Repo` | [`RepoAccountEvent`](#repoaccountevent) | 10 |

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

## `AccountPermissionChanged` {#accountpermissionchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `permission` | [`Permission`](#permission) |

## `AccountRecoveryApproved` {#accountrecoveryapproved}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `approver` | [`AccountId`](#accountid) |
  | `request` | [`AccountRecoveryRequest`](#accountrecoveryrequest) |

## `AccountRecoveryCancelled` {#accountrecoverycancelled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `cancelled_by` | [`AccountId`](#accountid) |
  | `request` | [`AccountRecoveryRequest`](#accountrecoveryrequest) |

## `AccountRecoveryEvent` {#accountrecoveryevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `PolicySet` | [`AccountRecoveryPolicySet`](#accountrecoverypolicyset) | 0 |
  | `PolicyCleared` | [`AccountRecoveryPolicyCleared`](#accountrecoverypolicycleared) | 1 |
  | `Proposed` | [`AccountRecoveryProposed`](#accountrecoveryproposed) | 2 |
  | `Approved` | [`AccountRecoveryApproved`](#accountrecoveryapproved) | 3 |
  | `Cancelled` | [`AccountRecoveryCancelled`](#accountrecoverycancelled) | 4 |
  | `Finalized` | [`AccountRecoveryFinalized`](#accountrecoveryfinalized) | 5 |

## `AccountRecoveryFinalized` {#accountrecoveryfinalized}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `previous_account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `request` | [`AccountRecoveryRequest`](#accountrecoveryrequest) |

## `AccountRecoveryPolicy` {#accountrecoverypolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `guardians` | [`Vec<RecoveryGuardian>`](#vec-recoveryguardian) |
  | `quorum` | `u16` |
  | `timelock_ms` | [`NonZero<u64>`](#nonzero-u64) |

## `AccountRecoveryPolicyCleared` {#accountrecoverypolicycleared}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |

## `AccountRecoveryPolicySet` {#accountrecoverypolicyset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `policy` | [`AccountRecoveryPolicy`](#accountrecoverypolicy) |

## `AccountRecoveryProposed` {#accountrecoveryproposed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `request` | [`AccountRecoveryRequest`](#accountrecoveryrequest) |

## `AccountRecoveryRequest` {#accountrecoveryrequest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`AccountAlias`](#accountalias) |
  | `active_account_id_at_proposal` | [`AccountId`](#accountid) |
  | `proposed_controller` | [`AccountController`](#accountcontroller) |
  | `approvals` | [`SortedVec<AccountId>`](#sortedvec-accountid) |
  | `invalidated_multisig_proposal_hashes` | [`Vec<HashOf<Vec<InstructionBox>>>`](#vec-hashof-vec-instructionbox) |
  | `proposed_by` | [`AccountId`](#accountid) |
  | `execute_after_ms` | `u64` |
  | `status` | [`AccountRecoveryStatus`](#accountrecoverystatus) |

## `AccountRecoveryStatus` {#accountrecoverystatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `pending` | &mdash; | 0 |
  | `cancelled` | &mdash; | 1 |
  | `finalized` | &mdash; | 2 |

## `AccountRoleChanged` {#accountrolechanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `role` | [`RoleId`](#roleid) |

## `Action` {#action}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `executable` | [`Executable`](#executable) |
  | `repeats` | [`Repeats`](#repeats) |
  | `authority` | [`AccountId`](#accountid) |
  | `filter` | [`EventFilterBox`](#eventfilterbox) |
  | `retry_policy` | [`Option<TimeTriggerRetryPolicy>`](#option-timetriggerretrypolicy) |
  | `metadata` | [`Metadata`](#metadata) |

## `AggregationRule` {#aggregationrule}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MedianMad` | `u16` | 0 |
  | `Percentile` | `u16` | 1 |

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

## `ArchiveId` {#archiveid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `Array<u16, 8>` {#array-u16-8}

**Type:** Array

**Length:** 8

**Value:** `u16`

## `Array<u64, 8>` {#array-u64-8}

**Type:** Array

**Length:** 8

**Value:** `u64`

## `Array<u8, 16>` {#array-u8-16}

**Type:** Array

**Length:** 16

**Value:** `u8`

## `Array<u8, 32>` {#array-u8-32}

**Type:** Array

**Length:** 32

**Value:** `u8`

## `Array<u8, 36>` {#array-u8-36}

**Type:** Array

**Length:** 36

**Value:** `u8`

## `Array<u8, 48>` {#array-u8-48}

**Type:** Array

**Length:** 48

**Value:** `u8`

## `Array<u8, 4>` {#array-u8-4}

**Type:** Array

**Length:** 4

**Value:** `u8`

## `Array<u8, 64>` {#array-u8-64}

**Type:** Array

**Length:** 64

**Value:** `u8`

## `ArtifactAbiHashMismatchInfo` {#artifactabihashmismatchinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`Hash`](#hash) |
  | `actual` | [`Hash`](#hash) |

## `Asset` {#asset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AssetId`](#assetid) |
  | `value` | [`Quantity`](#quantity) |

## `AssetBalancePolicy` {#assetbalancepolicy}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Global` | &mdash; | 0 |
  | `DataspaceRestricted` | &mdash; | 1 |

## `AssetBalanceScope` {#assetbalancescope}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Global` | &mdash; | 0 |
  | `Dataspace` | [`DataSpaceId`](#dataspaceid) | 1 |

## `AssetBatchTransferLegStatus` {#assetbatchtransferlegstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Applied` | &mdash; | 0 |
  | `Rejected` | [`AssetBatchTransferRejection`](#assetbatchtransferrejection) | 1 |

## `AssetBatchTransferOutcome` {#assetbatchtransferoutcome}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leg_index` | `u32` |
  | `leg_id` | `String` |
  | `asset` | [`AssetId`](#assetid) |
  | `destination` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `status` | [`AssetBatchTransferLegStatus`](#assetbatchtransferlegstatus) |

## `AssetBatchTransferRejection` {#assetbatchtransferrejection}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code` | [`AssetBatchTransferRejectionCode`](#assetbatchtransferrejectioncode) |
  | `message` | `String` |

## `AssetBatchTransferRejectionCode` {#assetbatchtransferrejectioncode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `InsufficientFunds` | &mdash; | 0 |
  | `HoldingLimitExceeded` | &mdash; | 1 |
  | `IncomingDisabled` | &mdash; | 2 |
  | `OutgoingDisabled` | &mdash; | 3 |
  | `Blacklisted` | &mdash; | 4 |
  | `PolicyRejected` | &mdash; | 5 |

## `AssetChanged` {#assetchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset` | [`AssetId`](#assetid) |
  | `amount` | [`Quantity`](#quantity) |

## `AssetConfidentialPolicy` {#assetconfidentialpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `mode` | [`ConfidentialPolicyMode`](#confidentialpolicymode) |
  | `vk_set_hash` | [`Option<Hash>`](#option-hash) |
  | `poseidon_params_id` | [`Option<u32>`](#option-u32) |
  | `pedersen_params_id` | [`Option<u32>`](#option-u32) |
  | `pending_transition` | [`Option<ConfidentialPolicyTransition>`](#option-confidentialpolicytransition) |

## `AssetDefinition` {#assetdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `name` | `String` |
  | `description` | [`Option<String>`](#option-string) |
  | `alias` | [`Option<AssetDefinitionAlias>`](#option-assetdefinitionalias) |
  | `spec` | [`NumericSpec`](#numericspec) |
  | `mintable` | [`Mintable`](#mintable) |
  | `logo` | [`Option<SorafsUri>`](#option-sorafsuri) |
  | `metadata` | [`Metadata`](#metadata) |
  | `balance_scope_policy` | [`AssetBalancePolicy`](#assetbalancepolicy) |
  | `owning_domain` | [`Option<DomainId>`](#option-domainid) |
  | `owned_by` | [`AccountId`](#accountid) |
  | `total_quantity` | [`Quantity`](#quantity) |
  | `confidential_policy` | [`AssetConfidentialPolicy`](#assetconfidentialpolicy) |

## `AssetDefinitionAlias` {#assetdefinitionalias}

**Type:** Alias

**To:** `String`

## `AssetDefinitionAliasPermissionScope` {#assetdefinitionaliaspermissionscope}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `domain` | [`DomainId`](#domainid) | 0 |
  | `dataspace` | [`DataSpaceId`](#dataspaceid) | 1 |
  | `alias` | [`ResolvedAssetDefinitionAliasV1`](#resolvedassetdefinitionaliasv1) | 2 |

## `AssetDefinitionEvent` {#assetdefinitionevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`AssetDefinition`](#assetdefinition) | 0 |
  | `Deleted` | [`AssetDefinitionId`](#assetdefinitionid) | 1 |
  | `MetadataInserted` | [`MetadataChanged<AssetDefinitionId>`](#metadatachanged-assetdefinitionid) | 2 |
  | `MetadataRemoved` | [`MetadataChanged<AssetDefinitionId>`](#metadatachanged-assetdefinitionid) | 3 |
  | `MintabilityChanged` | [`AssetDefinitionId`](#assetdefinitionid) | 4 |
  | `MintabilityChangedDetailed` | [`AssetDefinitionMintabilityChanged`](#assetdefinitionmintabilitychanged) | 5 |
  | `TotalQuantityChanged` | [`AssetDefinitionTotalQuantityChanged`](#assetdefinitiontotalquantitychanged) | 6 |
  | `OwnerChanged` | [`AssetDefinitionOwnerChanged`](#assetdefinitionownerchanged) | 7 |

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

## `AssetDefinitionMintabilityChanged` {#assetdefinitionmintabilitychanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `minted_amount` | [`Quantity`](#quantity) |
  | `authority` | [`AccountId`](#accountid) |

## `AssetDefinitionOwnerChanged` {#assetdefinitionownerchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `new_owner` | [`AccountId`](#accountid) |

## `AssetDefinitionTotalQuantityChanged` {#assetdefinitiontotalquantitychanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `total_amount` | [`Quantity`](#quantity) |

## `AssetEscrowDisputed` {#assetescrowdisputed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`AssetEscrowRecord`](#assetescrowrecord) |
  | `opened_by` | [`AccountId`](#accountid) |
  | `evidence_hashes` | [`Vec<Hash>`](#vec-hash) |

## `AssetEscrowKind` {#assetescrowkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Marketplace` | &mdash; | 0 |
  | `Lock` | &mdash; | 1 |
  | `Conditional` | &mdash; | 2 |

## `AssetEscrowRecord` {#assetescrowrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`EscrowId`](#escrowid) |
  | `seller` | [`AccountId`](#accountid) |
  | `buyer` | [`Option<AccountId>`](#option-accountid) |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `amount` | [`Quantity`](#quantity) |
  | `custody` | [`AccountId`](#accountid) |
  | `status` | [`AssetEscrowStatus`](#assetescrowstatus) |
  | `kind` | [`AssetEscrowKind`](#assetescrowkind) |
  | `remaining_amount` | [`Quantity`](#quantity) |
  | `release_authority` | [`Option<AccountId>`](#option-accountid) |
  | `expires_at_ms` | [`Option<u64>`](#option-u64) |
  | `evidence_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `conditions` | [`Vec<ConditionalEscrowConditionState>`](#vec-conditionalescrowconditionstate) |
  | `created_at_ms` | `u64` |
  | `accepted_at_ms` | [`Option<u64>`](#option-u64) |
  | `payment_sent_at_ms` | [`Option<u64>`](#option-u64) |
  | `disputed_at_ms` | [`Option<u64>`](#option-u64) |
  | `closed_at_ms` | [`Option<u64>`](#option-u64) |
  | `resolution` | [`Option<AssetEscrowResolution>`](#option-assetescrowresolution) |

## `AssetEscrowResolution` {#assetescrowresolution}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `resolver` | [`AccountId`](#accountid) |
  | `buyer_amount` | [`Quantity`](#quantity) |
  | `seller_amount` | [`Quantity`](#quantity) |
  | `evidence_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `resolved_at_ms` | `u64` |

## `AssetEscrowResolved` {#assetescrowresolved}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`AssetEscrowRecord`](#assetescrowrecord) |
  | `resolver` | [`AccountId`](#accountid) |
  | `buyer_amount` | [`Quantity`](#quantity) |
  | `seller_amount` | [`Quantity`](#quantity) |

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

## `AssetEvent` {#assetevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`Asset`](#asset) | 0 |
  | `Deleted` | [`AssetId`](#assetid) | 1 |
  | `Added` | [`AssetChanged`](#assetchanged) | 2 |
  | `Removed` | [`AssetChanged`](#assetchanged) | 3 |
  | `Transferred` | [`AssetTransferred`](#assettransferred) | 4 |
  | `MetadataInserted` | [`MetadataChanged<AssetId>`](#metadatachanged-assetid) | 5 |
  | `MetadataRemoved` | [`MetadataChanged<AssetId>`](#metadatachanged-assetid) | 6 |
  | `BatchTransferOutcome` | [`AssetBatchTransferOutcome`](#assetbatchtransferoutcome) | 7 |

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

## `AssetHandle` {#assethandle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `scope` | [`Vec<String>`](#vec-string) |
  | `subject` | [`HandleSubject`](#handlesubject) |
  | `budget` | [`HandleBudget`](#handlebudget) |
  | `handle_era` | `u64` |
  | `sub_nonce` | `u64` |
  | `group_binding` | [`GroupBinding`](#groupbinding) |
  | `target_lane` | [`LaneId`](#laneid) |
  | `axt_binding` | [`AxtBinding`](#axtbinding) |
  | `manifest_view_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `expiry_slot` | `u64` |
  | `max_clock_skew_ms` | [`Option<u32>`](#option-u32) |
  | `issuer_context` | [`AxtHandleIssuerContextV1`](#axthandleissuercontextv1) |
  | `issuer_signature` | [`Signature`](#signature) |

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

## `AssetTransferred` {#assettransferred}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source` | [`AssetId`](#assetid) |
  | `destination` | [`AssetId`](#assetid) |
  | `amount` | [`Quantity`](#quantity) |

## `AuthorityFeePayment` {#authorityfeepayment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `charge_limits` | [`Vec<FeeChargeLimit>`](#vec-feechargelimit) |
  | `gas_limit` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |

## `AutonomousLanePayloadEnvelopeV1` {#autonomouslanepayloadenvelopev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `epoch` | `u64` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `proposal_height` | `u64` |
  | `lane_block_height` | `u64` |
  | `lane_block_view` | `u64` |
  | `proposal_hash` | [`Hash`](#hash) |
  | `descriptor_hash` | [`Hash`](#hash) |
  | `payload_hash` | [`Hash`](#hash) |
  | `producer` | [`PeerId`](#peerid) |
  | `canonical_payload` | [`Vec<u8>`](#vec-u8) |

## `AxtBinding` {#axtbinding}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `AxtDescriptor` {#axtdescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsids` | [`Vec<DataSpaceId>`](#vec-dataspaceid) |
  | `touches` | [`Vec<AxtTouchSpec>`](#vec-axttouchspec) |

## `AxtEffectBinding` {#axteffectbinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `destination_domain` | [`Option<String>`](#option-string) |
  | `destination_account_id` | [`Option<String>`](#option-string) |
  | `vault_account_id` | [`Option<String>`](#option-string) |
  | `issuance_account_id` | [`Option<String>`](#option-string) |
  | `source_asset_definition_id` | [`Option<String>`](#option-string) |
  | `destination_asset_definition_id` | [`Option<String>`](#option-string) |
  | `source_amount_i64` | [`Option<i64>`](#option-i64) |
  | `destination_amount_i64` | [`Option<i64>`](#option-i64) |

## `AxtEnvelopeRecord` {#axtenveloperecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding` | [`AxtBinding`](#axtbinding) |
  | `lane` | [`LaneId`](#laneid) |
  | `descriptor` | [`AxtDescriptor`](#axtdescriptor) |
  | `touches` | [`Vec<AxtTouchFragment>`](#vec-axttouchfragment) |
  | `proofs` | [`Vec<AxtProofFragment>`](#vec-axtprooffragment) |
  | `handles` | [`Vec<AxtHandleFragment>`](#vec-axthandlefragment) |
  | `commit_height` | `u64` |

## `AxtFastpqBinding` {#axtfastpqbinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parameter` | `String` |
  | `source_dsid` | `u64` |
  | `source_dataspace` | `String` |
  | `source_receipt_id` | `String` |
  | `source_tx_commitment` | `String` |
  | `claim_type` | `String` |
  | `claim_digest` | `String` |
  | `witness_commitment` | `String` |
  | `policy_commitment` | `String` |
  | `verified_effect_type` | `String` |
  | `corridor` | `String` |
  | `verifier_id` | `String` |
  | `verifier_version` | `String` |
  | `target_dsids` | [`Vec<u64>`](#vec-u64) |
  | `effect_binding` | [`Option<AxtEffectBinding>`](#option-axteffectbinding) |
  | `remote_spend_intent_commitments` | [`Vec<Array<u8, 32>>`](#vec-array-u8-32) |

## `AxtHandleFragment` {#axthandlefragment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `handle` | [`AssetHandle`](#assethandle) |
  | `intent` | [`RemoteSpendIntent`](#remotespendintent) |
  | `proof` | [`Option<ProofBlob>`](#option-proofblob) |
  | `amount` | [`Option<Quantity>`](#option-quantity) |
  | `amount_commitment` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `AxtHandleIssuerContextV1` {#axthandleissuercontextv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `asset_dsid` | [`DataSpaceId`](#dataspaceid) |
  | `asset_definition_incarnation` | [`Hash`](#hash) |
  | `issuer` | [`UniversalAccountId`](#universalaccountid) |
  | `issuer_manifest_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `code_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `abi_version` | `u16` |
  | `abi_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `AxtPolicyBinding` {#axtpolicybinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsid` | [`DataSpaceId`](#dataspaceid) |
  | `policy` | [`AxtPolicyEntry`](#axtpolicyentry) |

## `AxtPolicyEntry` {#axtpolicyentry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `manifest_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `target_lane` | [`LaneId`](#laneid) |
  | `active_handle_era` | `u64` |
  | `next_handle_counter` | `u64` |
  | `current_slot` | `u64` |

## `AxtPolicySnapshot` {#axtpolicysnapshot}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u64` |
  | `entries` | [`Vec<AxtPolicyBinding>`](#vec-axtpolicybinding) |

## `AxtProofFragment` {#axtprooffragment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsid` | [`DataSpaceId`](#dataspaceid) |
  | `proof` | [`ProofBlob`](#proofblob) |

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

## `AxtTouchFragment` {#axttouchfragment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsid` | [`DataSpaceId`](#dataspaceid) |
  | `manifest` | [`TouchManifest`](#touchmanifest) |

## `AxtTouchSpec` {#axttouchspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsid` | [`DataSpaceId`](#dataspaceid) |
  | `read` | [`Vec<String>`](#vec-string) |
  | `write` | [`Vec<String>`](#vec-string) |

## `BackendTag` {#backendtag}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Halo2IpaPasta` | &mdash; | 0 |
  | `Stark` | &mdash; | 1 |

## `BallotAttemptId` {#ballotattemptid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `BallotAttemptStatusV1` {#ballotattemptstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Registration` | &mdash; | 0 |
  | `SurvivorFreeze` | &mdash; | 1 |
  | `TimedCommitment` | &mdash; | 2 |
  | `AwaitingRelease` | &mdash; | 3 |
  | `Opening` | &mdash; | 4 |
  | `Finalized` | &mdash; | 5 |
  | `NoResult` | &mdash; | 6 |
  | `Superseded` | &mdash; | 7 |

## `BigInt` {#bigint}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |

## `BlobDigest` {#blobdigest}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `BlockEvent` {#blockevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `header` | [`BlockHeader`](#blockheader) |
  | `status` | [`BlockStatus`](#blockstatus) |

## `BlockEventFilter` {#blockeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `status` | [`Option<BlockStatus>`](#option-blockstatus) |

## `BlockExecutionContextBundle` {#blockexecutioncontextbundle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `external` | [`Vec<ExternalExecutionContext>`](#vec-externalexecutioncontext) |
  | `autonomous_lane_payloads` | [`Vec<AutonomousLanePayloadEnvelopeV1>`](#vec-autonomouslanepayloadenvelopev1) |
  | `lane_payload_ownerships` | [`Vec<SumeragiLanePayloadOwnership>`](#vec-sumeragilanepayloadownership) |
  | `queue_plan_admissions` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `merge_entry` | [`Option<CertifiedMergeLedgerReference>`](#option-certifiedmergeledgerreference) |

## `BlockHeader` {#blockheader}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | [`NonZero<u64>`](#nonzero-u64) |
  | `prev_block_hash` | [`Option<HashOf<BlockHeader>>`](#option-hashof-blockheader) |
  | `merkle_root` | [`Option<HashOf<MerkleTree<TransactionEntrypoint>>>`](#option-hashof-merkletree-transactionentrypoint) |
  | `result_merkle_root` | [`Option<HashOf<MerkleTree<TransactionResult>>>`](#option-hashof-merkletree-transactionresult) |
  | `da_proof_policies_hash` | [`Option<HashOf<DaProofPolicyBundle>>`](#option-hashof-daproofpolicybundle) |
  | `da_commitments_hash` | [`Option<HashOf<DaCommitmentBundle>>`](#option-hashof-dacommitmentbundle) |
  | `da_pin_intents_hash` | [`Option<HashOf<DaPinIntentBundle>>`](#option-hashof-dapinintentbundle) |
  | `npos_effects_hash` | [`Option<HashOf<NposConsensusEffects>>`](#option-hashof-nposconsensuseffects) |
  | `sccp_commitment_root` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `creation_time_ms` | `u64` |
  | `view_change_index` | `u64` |
  | `confidential_features` | [`Option<ConfidentialFeatureDigest>`](#option-confidentialfeaturedigest) |
  | `execution_context_hash` | [`Option<HashOf<BlockExecutionContextBundle>>`](#option-hashof-blockexecutioncontextbundle) |

## `BlockMessage` {#blockmessage}

**Type:** Alias

**To:** [`SignedBlock`](#signedblock)

## `BlockParameter` {#blockparameter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MaxTransactions` | [`NonZero<u64>`](#nonzero-u64) | 0 |

## `BlockParameters` {#blockparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_transactions` | [`NonZero<u64>`](#nonzero-u64) |

## `BlockPayload` {#blockpayload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `header` | [`BlockHeader`](#blockheader) |
  | `external_entrypoints` | [`Vec<TransactionEntrypoint>`](#vec-transactionentrypoint) |
  | `da_commitments` | [`Option<DaCommitmentBundle>`](#option-dacommitmentbundle) |
  | `da_proof_policies` | [`Option<DaProofPolicyBundle>`](#option-daproofpolicybundle) |
  | `da_pin_intents` | [`Option<DaPinIntentBundle>`](#option-dapinintentbundle) |
  | `npos_consensus_effects` | [`Option<NposConsensusEffects>`](#option-nposconsensuseffects) |
  | `execution_context` | [`Option<BlockExecutionContextBundle>`](#option-blockexecutioncontextbundle) |

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
  | `SccpCommitmentRootMismatch` | &mdash; | 23 |

## `BlockResult` {#blockresult}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `time_triggers` | [`Vec<TimeTriggerEntrypoint>`](#vec-timetriggerentrypoint) |
  | `merkle` | [`MerkleTree<TransactionEntrypoint>`](#merkletree-transactionentrypoint) |
  | `result_merkle` | [`MerkleTree<TransactionResult>`](#merkletree-transactionresult) |
  | `transaction_results` | [`Vec<TransactionResult>`](#vec-transactionresult) |
  | `committed_fragment_count` | `u64` |
  | `fastpq_transcripts` | [`SortedMap<Hash, Vec<TransferTranscript>>`](#sortedmap-hash-vec-transfertranscript) |
  | `axt_envelopes` | [`Vec<AxtEnvelopeRecord>`](#vec-axtenveloperecord) |
  | `trigger_completions` | [`Vec<TriggerCompletedEvent>`](#vec-triggercompletedevent) |
  | `axt_policy_snapshot` | [`AxtPolicySnapshot`](#axtpolicysnapshot) |
  | `axt_transitioned_dataspaces` | [`SortedVec<DataSpaceId>`](#sortedvec-dataspaceid) |
  | `lane_finality_statements` | [`Vec<LaneFinalityStatement>`](#vec-lanefinalitystatement) |

## `BlockSignature` {#blocksignature}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `index` | `u64` |
  | `signature` | [`SignatureOf<BlockHeader>`](#signatureof-blockheader) |

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

## `BlockSubject` {#blocksubject}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parent_block_hash` | [`Option<HashOf<BlockHeader>>`](#option-hashof-blockheader) |
  | `block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `payload_hash` | [`Hash`](#hash) |

## `BlockSubscriptionRequest` {#blocksubscriptionrequest}

**Type:** Alias

**To:** [`NonZero<u64>`](#nonzero-u64)

## `BodyInstanceId` {#bodyinstanceid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `BodyInstanceStatusV1` {#bodyinstancestatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `AwaitingSortition` | &mdash; | 0 |
  | `AcceptingInvitations` | &mdash; | 1 |
  | `RosterSealed` | &mdash; | 2 |
  | `Deliberating` | [`DeliberationPhaseV1`](#deliberationphasev1) | 3 |
  | `Balloting` | &mdash; | 4 |
  | `Approved` | &mdash; | 5 |
  | `Rejected` | &mdash; | 6 |
  | `NoQuorum` | &mdash; | 7 |
  | `NoResult` | &mdash; | 8 |
  | `Superseded` | &mdash; | 9 |

## `BridgeEvent` {#bridgeevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Emitted` | [`BridgeReceipt`](#bridgereceipt) | 0 |
  | `ReplayDelta` | [`SccpReplayDeltaEventV1`](#sccpreplaydeltaeventv1) | 1 |

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
  | `ReplayDelta` | `0x2` |

## `BridgeHashFunction` {#bridgehashfunction}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Sha256` | &mdash; | 0 |
  | `Blake2b` | &mdash; | 1 |

## `BridgeIcsProof` {#bridgeicsproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `verifier_manifest_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `state_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `leaf_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `proof` | [`MerkleProof<Array<u8, 32>>`](#merkleproof-array-u8-32) |
  | `hash_function` | [`BridgeHashFunction`](#bridgehashfunction) |

## `BridgeNativeProofBackendV1` {#bridgenativeproofbackendv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ethereum_beacon_v1` | &mdash; | 0 |
  | `bsc_parlia_v1` | &mdash; | 1 |
  | `tron_dpos_v1` | &mdash; | 2 |
  | `ton_masterchain_v1` | &mdash; | 3 |

## `BridgeNativeProtocolProofV1` {#bridgenativeprotocolproofv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | [`BridgeNativeProofBackendV1`](#bridgenativeproofbackendv1) |
  | `route_configuration_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `encoded_envelope` | [`Vec<u8>`](#vec-u8) |

## `BridgeProof` {#bridgeproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `range` | [`BridgeProofRange`](#bridgeproofrange) |
  | `payload` | [`BridgeProofPayload`](#bridgeproofpayload) |

## `BridgeProofPayload` {#bridgeproofpayload}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Ics` | [`BridgeIcsProof`](#bridgeicsproof) | 0 |
  | `TransparentZk` | [`BridgeTransparentProof`](#bridgetransparentproof) | 1 |
  | `NativeProtocol` | [`BridgeNativeProtocolProofV1`](#bridgenativeprotocolproofv1) | 2 |
  | `SccpDestination` | [`BridgeSccpDestinationProofV1`](#bridgesccpdestinationproofv1) | 3 |

## `BridgeProofRange` {#bridgeproofrange}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `start_height` | `u64` |
  | `end_height` | `u64` |

## `BridgeProofRecord` {#bridgeproofrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proof` | [`BridgeProof`](#bridgeproof) |
  | `commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `size_bytes` | `u32` |

## `BridgeReceipt` {#bridgereceipt}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane` | [`LaneId`](#laneid) |
  | `direction` | [`Vec<u8>`](#vec-u8) |
  | `source_tx` | [`Array<u8, 32>`](#array-u8-32) |
  | `dest_tx` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `proof_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `amount` | [`Quantity`](#quantity) |
  | `asset_id` | [`Vec<u8>`](#vec-u8) |
  | `recipient` | [`Vec<u8>`](#vec-u8) |

## `BridgeSccpDestinationProofBackendV1` {#bridgesccpdestinationproofbackendv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `evm_groth16_bn254_v1` | &mdash; | 0 |
  | `tron_groth16_bn254_v1` | &mdash; | 1 |
  | `ton_groth16_bls12381_v1` | &mdash; | 2 |

## `BridgeSccpDestinationProofV1` {#bridgesccpdestinationproofv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | [`BridgeSccpDestinationProofBackendV1`](#bridgesccpdestinationproofbackendv1) |
  | `route_configuration_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `encoded_artifact` | [`Vec<u8>`](#vec-u8) |

## `BridgeTransparentProof` {#bridgetransparentproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `verifier_manifest_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `proof` | [`ProofBox`](#proofbox) |
  | `recursion_depth` | [`Option<u32>`](#option-u32) |

## `BuildStatus` {#buildstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `String` |
  | `git_commit_sha` | `String` |
  | `dpn_validator_release_commit` | `String` |
  | `cargo_features` | `String` |
  | `target_triple` | `String` |

## `CanBurnAsset` {#canburnasset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset` | [`AssetId`](#assetid) |

## `CanBurnAssetWithDefinition` {#canburnassetwithdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanExecuteTrigger` {#canexecutetrigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger` | [`TriggerId`](#triggerid) |

## `CanManageAssetDefinitionAlias` {#canmanageassetdefinitionalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `scope` | [`AssetDefinitionAliasPermissionScope`](#assetdefinitionaliaspermissionscope) |

## `CanManageAssetDefinitionConfidentialPolicy` {#canmanageassetdefinitionconfidentialpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanManageLaneRelayEmergency` {#canmanagelanerelayemergency}

**Type:** Zero-Size Type (unit type, null type)

## `CanManagePeers` {#canmanagepeers}

**Type:** Zero-Size Type (unit type, null type)

## `CanManageRoles` {#canmanageroles}

**Type:** Zero-Size Type (unit type, null type)

## `CanMintAssetToAccount` {#canmintassettoaccount}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `account` | [`AccountId`](#accountid) |

## `CanMintAssetWithDefinition` {#canmintassetwithdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanModifyAccountMetadata` {#canmodifyaccountmetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |

## `CanModifyAssetDefinitionMetadata` {#canmodifyassetdefinitionmetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanModifyDomainMetadata` {#canmodifydomainmetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |

## `CanModifyNftMetadata` {#canmodifynftmetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `nft` | [`NftId`](#nftid) |

## `CanModifyTrigger` {#canmodifytrigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger` | [`TriggerId`](#triggerid) |

## `CanModifyTriggerMetadata` {#canmodifytriggermetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger` | [`TriggerId`](#triggerid) |

## `CanRegisterAccount` {#canregisteraccount}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |

## `CanRegisterDomain` {#canregisterdomain}

**Type:** Zero-Size Type (unit type, null type)

## `CanRegisterNft` {#canregisternft}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |

## `CanRegisterSmartContractCode` {#canregistersmartcontractcode}

**Type:** Zero-Size Type (unit type, null type)

## `CanRegisterTrigger` {#canregistertrigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `authority` | [`AccountId`](#accountid) |

## `CanSetHijiriParameters` {#cansethijiriparameters}

**Type:** Zero-Size Type (unit type, null type)

## `CanSetParameters` {#cansetparameters}

**Type:** Zero-Size Type (unit type, null type)

## `CanTransferAsset` {#cantransferasset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset` | [`AssetId`](#assetid) |

## `CanTransferAssetWithDefinition` {#cantransferassetwithdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanTransferNft` {#cantransfernft}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `nft` | [`NftId`](#nftid) |

## `CanUnregisterAccount` {#canunregisteraccount}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |

## `CanUnregisterAssetDefinition` {#canunregisterassetdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |

## `CanUnregisterDomain` {#canunregisterdomain}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |

## `CanUnregisterNft` {#canunregisternft}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `nft` | [`NftId`](#nftid) |

## `CanUnregisterTrigger` {#canunregistertrigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger` | [`TriggerId`](#triggerid) |

## `CanUpgradeExecutor` {#canupgradeexecutor}

**Type:** Zero-Size Type (unit type, null type)

## `CancelSmartContractCodeUpload` {#cancelsmartcontractcodeupload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |

## `CanonicalHistoryError` {#canonicalhistoryerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `HeightOutsideSnapshot` | [`CanonicalHistorySnapshotHeightSchema`](#canonicalhistorysnapshotheightschema) | 0 |
  | `HashOnlyBodyUnavailable` | [`CanonicalHistoryHeightHashSchema`](#canonicalhistoryheighthashschema) | 1 |
  | `BodyUnavailable` | [`CanonicalHistoryHeightHashSchema`](#canonicalhistoryheighthashschema) | 2 |
  | `BlockHashMismatch` | [`CanonicalHistoryHashMismatchSchema`](#canonicalhistoryhashmismatchschema) | 3 |
  | `BlockHeightMismatch` | [`CanonicalHistoryHeightMismatchSchema`](#canonicalhistoryheightmismatchschema) | 4 |

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

## `CapacityDisputeId` {#capacitydisputeid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `CapacityDisputeOutcome` {#capacitydisputeoutcome}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Upheld` | &mdash; | 0 |
  | `Dismissed` | &mdash; | 1 |
  | `Withdrawn` | &mdash; | 2 |

## `CertPhase` {#certphase}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Prepare` | &mdash; | 1 |
  | `Commit` | &mdash; | 2 |
  | `NewView` | &mdash; | 3 |

## `CertifiedMergeLedgerReference` {#certifiedmergeledgerreference}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `entry_hash` | [`HashOf<MergeLedgerEntry>`](#hashof-mergeledgerentry) |
  | `encoded_len` | `u64` |
  | `epoch_id` | `u64` |
  | `execution_batch_hash` | [`Option<Hash>`](#option-hash) |
  | `entrypoint_count` | [`Option<u64>`](#option-u64) |
  | `entrypoint_merkle_root` | [`Option<HashOf<MerkleTree<TransactionEntrypoint>>>`](#option-hashof-merkletree-transactionentrypoint) |
  | `result_merkle_root` | [`Option<HashOf<MerkleTree<TransactionResult>>>`](#option-hashof-merkletree-transactionresult) |
  | `base_state_height` | [`Option<u64>`](#option-u64) |
  | `base_state_hash` | [`Option<HashOf<BlockHeader>>`](#option-hashof-blockheader) |
  | `merge_qc` | [`MergeQuorumCertificate`](#mergequorumcertificate) |

## `CertifiedMergeTransactionInclusion` {#certifiedmergetransactioninclusion}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `merge_entry_hash` | [`HashOf<MergeLedgerEntry>`](#hashof-mergeledgerentry) |
  | `merge_epoch_id` | `u64` |
  | `execution_batch_hash` | [`Hash`](#hash) |
  | `entrypoint_count` | `u64` |
  | `entrypoint_merkle_root` | [`HashOf<MerkleTree<TransactionEntrypoint>>`](#hashof-merkletree-transactionentrypoint) |
  | `result_merkle_root` | [`HashOf<MerkleTree<TransactionResult>>`](#hashof-merkletree-transactionresult) |

## `ChunkerProfileHandle` {#chunkerprofilehandle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `profile_id` | `u32` |
  | `namespace` | `String` |
  | `name` | `String` |
  | `semver` | `String` |
  | `multihash_code` | `u64` |

## `CitizenServiceEvent` {#citizenserviceevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `decline` | &mdash; | 0 |
  | `no-show` | &mdash; | 1 |
  | `misconduct` | &mdash; | 2 |

## `ClassRentRate` {#classrentrate}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `storage_class` | [`StorageClass`](#storageclass) |
  | `rent_per_gib_month` | [`XorQuantity`](#xorquantity) |

## `CommittedTransaction` {#committedtransaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `entrypoint_hash` | [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint) |
  | `entrypoint_proof` | [`MerkleProof<TransactionEntrypoint>`](#merkleproof-transactionentrypoint) |
  | `entrypoint` | [`TransactionEntrypoint`](#transactionentrypoint) |
  | `result_hash` | [`HashOf<TransactionResult>`](#hashof-transactionresult) |
  | `result_proof` | [`MerkleProof<TransactionResult>`](#merkleproof-transactionresult) |
  | `result` | [`TransactionResult`](#transactionresult) |
  | `merge_inclusion` | [`Option<CertifiedMergeTransactionInclusion>`](#option-certifiedmergetransactioninclusion) |

## `CommittedTxPredicate` {#committedtxpredicate}

**Type:** Zero-Size Type (unit type, null type)

## `Compact<u32>` {#compact-u32}

**Type:** Int

**Kind:** Compact

## `ConditionalEscrowAttestation` {#conditionalescrowattestation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `attestor` | [`AccountId`](#accountid) |
  | `value` | [`ConditionalEscrowValue`](#conditionalescrowvalue) |
  | `evidence_hash` | [`Option<Hash>`](#option-hash) |
  | `committed_at_ms` | `u64` |

## `ConditionalEscrowAttested` {#conditionalescrowattested}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`AssetEscrowRecord`](#assetescrowrecord) |
  | `condition_id` | [`Name`](#name) |
  | `attestor` | [`AccountId`](#accountid) |
  | `automatically_released` | `bool` |

## `ConditionalEscrowCondition` {#conditionalescrowcondition}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Oracle` | [`ConditionalEscrowOracleCondition`](#conditionalescroworaclecondition) | 0 |
  | `Within` | [`ConditionalEscrowWithinCondition`](#conditionalescrowwithincondition) | 1 |

## `ConditionalEscrowConditionState` {#conditionalescrowconditionstate}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `condition` | [`ConditionalEscrowCondition`](#conditionalescrowcondition) |
  | `attestation` | [`Option<ConditionalEscrowAttestation>`](#option-conditionalescrowattestation) |
  | `satisfied_at_ms` | [`Option<u64>`](#option-u64) |

## `ConditionalEscrowOracleCondition` {#conditionalescroworaclecondition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Name`](#name) |
  | `attestor` | [`AccountId`](#accountid) |
  | `predicate` | [`ConditionalEscrowPredicate`](#conditionalescrowpredicate) |
  | `sequence` | [`NonZero<u32>`](#nonzero-u32) |

## `ConditionalEscrowPredicate` {#conditionalescrowpredicate}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Equals` | [`ConditionalEscrowValue`](#conditionalescrowvalue) | 0 |
  | `QuantityAtMost` | [`Quantity`](#quantity) | 1 |

## `ConditionalEscrowValue` {#conditionalescrowvalue}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Bool` | `bool` | 0 |
  | `Text` | `String` | 1 |
  | `Quantity` | [`Quantity`](#quantity) | 2 |

## `ConditionalEscrowWithinCondition` {#conditionalescrowwithincondition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Name`](#name) |
  | `duration_ms` | [`NonZero<u64>`](#nonzero-u64) |

## `ConfidentialFeatureDigest` {#confidentialfeaturedigest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `vk_set_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `poseidon_params_id` | [`Option<u32>`](#option-u32) |
  | `pedersen_params_id` | [`Option<u32>`](#option-u32) |
  | `conf_rules_version` | [`Option<u32>`](#option-u32) |
  | `zk_policy_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `ConfidentialPolicyMode` {#confidentialpolicymode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `TransparentOnly` | &mdash; | 0 |
  | `ShieldedOnly` | &mdash; | 1 |
  | `Convertible` | &mdash; | 2 |

## `ConfidentialPolicyTransition` {#confidentialpolicytransition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `new_mode` | [`ConfidentialPolicyMode`](#confidentialpolicymode) |
  | `effective_height` | `u64` |
  | `previous_mode` | [`ConfidentialPolicyMode`](#confidentialpolicymode) |
  | `transition_id` | [`Hash`](#hash) |
  | `conversion_window` | [`Option<u64>`](#option-u64) |

## `ConfidentialStatus` {#confidentialstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Proposed` | &mdash; | 0 |
  | `Active` | &mdash; | 1 |
  | `Withdrawn` | &mdash; | 2 |

## `ConfigurationEvent` {#configurationevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Changed` | [`ParameterChanged`](#parameterchanged) | 0 |
  | `SccpRegistryChanged` | [`SccpRegistryChanged`](#sccpregistrychanged) | 1 |

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
  | `SccpRegistryChanged` | `0x2` |

## `ConsensusMode` {#consensusmode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `permissioned` | &mdash; | 0 |
  | `npos` | &mdash; | 1 |

## `ConsensusRound` {#consensusround}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `context_id` | [`HeightContextId`](#heightcontextid) |
  | `height` | `u64` |
  | `view` | `u64` |

## `ContractAddress` {#contractaddress}

**Type:** Alias

**To:** `String`

## `ContractArgumentRecord` {#contractargumentrecord}

**Type:** Alias

**To:** [`Vec<u8>`](#vec-u8)

## `ContractCodeRegistered` {#contractcoderegistered}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |
  | `registrar` | [`AccountId`](#accountid) |

## `ContractCodeRemoved` {#contractcoderemoved}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |
  | `removed_by` | [`AccountId`](#accountid) |
  | `reason` | [`Option<String>`](#option-string) |

## `ContractDeploymentOriginV1` {#contractdeploymentoriginv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Direct` | [`DirectContractDeploymentOriginV1`](#directcontractdeploymentoriginv1) | 0 |
  | `Parliament` | [`ParliamentContractDeploymentOriginV1`](#parliamentcontractdeploymentoriginv1) | 1 |

## `ContractEmergencyHoldPlaced` {#contractemergencyholdplaced}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `hold` | [`ContractEmergencyHoldV1`](#contractemergencyholdv1) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractEmergencyHoldRetrospectiveCompleted` {#contractemergencyholdretrospectivecompleted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `prior_hold` | [`ContractEmergencyHoldV1`](#contractemergencyholdv1) |
  | `retrospective_finding_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractEmergencyHoldV1` {#contractemergencyholdv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `incident_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `proposal_content_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `governance_attempt_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `reason` | `String` |
  | `imposed_at_height` | `u64` |
  | `expires_at_height` | `u64` |

## `ContractErrorCodeDescriptor` {#contracterrorcodedescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `namespace` | `String` |
  | `name` | `String` |
  | `code` | `u32` |

## `ContractInstanceActivated` {#contractinstanceactivated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `code_hash` | [`Hash`](#hash) |
  | `activated_by` | [`AccountId`](#accountid) |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractInstanceDeactivated` {#contractinstancedeactivated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `previous_code_hash` | [`Hash`](#hash) |
  | `deactivated_by` | [`AccountId`](#accountid) |
  | `reason` | [`Option<String>`](#option-string) |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractInvocation` {#contractinvocation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `expected_code_hash` | [`Hash`](#hash) |
  | `entrypoint` | `String` |
  | `arguments` | [`Option<ContractArgumentRecord>`](#option-contractargumentrecord) |

## `ContractLifecycleControlV1` {#contractlifecyclecontrolv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `origin` | [`ContractDeploymentOriginV1`](#contractdeploymentoriginv1) |
  | `owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `pending_owner` | [`Option<ContractLifecycleOwnerV1>`](#option-contractlifecycleownerv1) |
  | `parliament_delegation` | [`ContractParliamentDelegationV1`](#contractparliamentdelegationv1) |
  | `active_code_hash` | [`Option<Hash>`](#option-hash) |
  | `revision` | `u64` |
  | `emergency_hold` | [`Option<ContractEmergencyHoldV1>`](#option-contractemergencyholdv1) |

## `ContractLifecycleOwnerV1` {#contractlifecycleownerv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Account` | [`AccountId`](#accountid) | 0 |
  | `Parliament` | &mdash; | 1 |

## `ContractManifest` {#contractmanifest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `seiyaku_name` | [`Option<String>`](#option-string) |
  | `code_hash` | [`Option<Hash>`](#option-hash) |
  | `abi_hash` | [`Option<Hash>`](#option-hash) |
  | `compiler_fingerprint` | [`Option<String>`](#option-string) |
  | `features_bitmap` | [`Option<u64>`](#option-u64) |
  | `access_set_hints` | [`Option<AccessSetHints>`](#option-accesssethints) |
  | `entrypoints` | [`Option<Vec<EntrypointDescriptor>>`](#option-vec-entrypointdescriptor) |
  | `states` | [`Option<Vec<StateDescriptor>>`](#option-vec-statedescriptor) |
  | `error_codes` | [`Option<Vec<ContractErrorCodeDescriptor>>`](#option-vec-contracterrorcodedescriptor) |
  | `kotoba` | [`Option<Vec<KotobaTranslationEntry>>`](#option-vec-kotobatranslationentry) |
  | `provenance` | [`Option<ManifestProvenance>`](#option-manifestprovenance) |

## `ContractOwnershipTransferCancelled` {#contractownershiptransfercancelled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractOwnershipTransferOffered` {#contractownershiptransferoffered}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `current_owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `pending_owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractOwnershipTransferred` {#contractownershiptransferred}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `previous_owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `new_owner` | [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractParliamentDelegationChanged` {#contractparliamentdelegationchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | [`ContractAddress`](#contractaddress) |
  | `delegation` | [`ContractParliamentDelegationV1`](#contractparliamentdelegationv1) |
  | `changed_by` | [`AccountId`](#accountid) |
  | `revision` | `u64` |
  | `lifecycle` | [`ContractLifecycleControlV1`](#contractlifecyclecontrolv1) |

## `ContractParliamentDelegationV1` {#contractparliamentdelegationv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `None` | &mdash; | 0 |
  | `Lifecycle` | &mdash; | 1 |

## `ContractRejection` {#contractrejection}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract` | `String` |
  | `namespace` | `String` |
  | `name` | `String` |
  | `code` | `u32` |

## `CouncilDerivationKind` {#councilderivationkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Sortition` | &mdash; | 0 |
  | `Manual` | &mdash; | 1 |

## `CryptoStatus` {#cryptostatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sm_helpers_available` | `bool` |
  | `sm_openssl_preview_enabled` | `bool` |
  | `halo2` | [`Halo2Status`](#halo2status) |

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

## `DaCommitmentBundle` {#dacommitmentbundle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `commitments` | [`Vec<DaCommitmentRecord>`](#vec-dacommitmentrecord) |

## `DaCommitmentLocation` {#dacommitmentlocation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_height` | `u64` |
  | `index_in_bundle` | `u32` |

## `DaCommitmentRecord` {#dacommitmentrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `epoch` | `u64` |
  | `sequence` | `u64` |
  | `client_blob_id` | [`BlobDigest`](#blobdigest) |
  | `manifest_hash` | [`ManifestDigest`](#manifestdigest) |
  | `proof_scheme` | [`DaProofScheme`](#daproofscheme) |
  | `chunk_root` | [`Hash`](#hash) |
  | `proof_digest` | [`Option<Hash>`](#option-hash) |
  | `retention_class` | [`RetentionPolicy`](#retentionpolicy) |
  | `storage_ticket` | [`StorageTicketId`](#storageticketid) |
  | `acknowledgement_sig` | [`Signature`](#signature) |

## `DaIngestAuthorizationV1` {#daingestauthorizationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `owner` | [`AccountId`](#accountid) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `epoch` | `u64` |
  | `sequence` | `u64` |
  | `payload_hash` | [`BlobDigest`](#blobdigest) |
  | `payload_bytes` | `u64` |
  | `request_content_hash` | [`Hash`](#hash) |
  | `signatures` | [`Vec<DaIngestSignatureV1>`](#vec-daingestsignaturev1) |

## `DaIngestSignatureV1` {#daingestsignaturev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | [`PublicKey`](#publickey) |
  | `signature` | [`Signature`](#signature) |

## `DaPinIntent` {#dapinintent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `epoch` | `u64` |
  | `sequence` | `u64` |
  | `storage_ticket` | [`StorageTicketId`](#storageticketid) |
  | `manifest_hash` | [`ManifestDigest`](#manifestdigest) |
  | `alias` | [`Option<String>`](#option-string) |
  | `authorization` | [`DaIngestAuthorizationV1`](#daingestauthorizationv1) |
  | `pin_scope_authorization` | [`DaPinScopeAuthorizationV1`](#dapinscopeauthorizationv1) |

## `DaPinIntentBundle` {#dapinintentbundle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `intents` | [`Vec<DaPinIntent>`](#vec-dapinintent) |

## `DaPinIntentWithLocation` {#dapinintentwithlocation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `intent` | [`DaPinIntent`](#dapinintent) |
  | `location` | [`DaCommitmentLocation`](#dacommitmentlocation) |

## `DaPinScopeAuthorizationV1` {#dapinscopeauthorizationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `scope` | [`DaPinScopeV1`](#dapinscopev1) |
  | `signatures` | [`Vec<DaPinScopeSignatureV1>`](#vec-dapinscopesignaturev1) |

## `DaPinScopeSignatureV1` {#dapinscopesignaturev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | [`PublicKey`](#publickey) |
  | `signature` | [`Signature`](#signature) |

## `DaPinScopeV1` {#dapinscopev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `owner` | [`AccountId`](#accountid) |
  | `request_authorization_digest` | [`Hash`](#hash) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `epoch` | `u64` |
  | `sequence` | `u64` |
  | `storage_ticket` | [`StorageTicketId`](#storageticketid) |
  | `manifest_hash` | [`ManifestDigest`](#manifestdigest) |
  | `alias` | [`Option<String>`](#option-string) |

## `DaProofPolicy` {#daproofpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `alias` | `String` |
  | `proof_scheme` | [`DaProofScheme`](#daproofscheme) |

## `DaProofPolicyBundle` {#daproofpolicybundle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `policy_hash` | [`Hash`](#hash) |
  | `policies` | [`Vec<DaProofPolicy>`](#vec-daproofpolicy) |

## `DaProofScheme` {#daproofscheme}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MerkleSha256` | &mdash; | 0 |

## `DaReceiptCursorStatus` {#dareceiptcursorstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | `u32` |
  | `epoch` | `u64` |
  | `highest_sequence` | `u64` |

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

## `DataEvent` {#dataevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Peer` | [`PeerEvent`](#peerevent) | 0 |
  | `Domain` | [`DomainEvent`](#domainevent) | 1 |
  | `Account` | [`AccountEvent`](#accountevent) | 2 |
  | `Asset` | [`AssetEvent`](#assetevent) | 3 |
  | `AssetDefinition` | [`AssetDefinitionEvent`](#assetdefinitionevent) | 4 |
  | `Trigger` | [`TriggerEvent`](#triggerevent) | 5 |
  | `Role` | [`RoleEvent`](#roleevent) | 6 |
  | `Configuration` | [`ConfigurationEvent`](#configurationevent) | 7 |
  | `Executor` | [`ExecutorEvent`](#executorevent) | 8 |
  | `Proof` | [`ProofEvent`](#proofevent) | 9 |
  | `VerifyingKey` | [`VerifyingKeyEvent`](#verifyingkeyevent) | 10 |
  | `RuntimeUpgrade` | [`RuntimeUpgradeEvent`](#runtimeupgradeevent) | 11 |
  | `SmartContract` | [`SmartContractEvent`](#smartcontractevent) | 12 |
  | `Soradns` | [`SoradnsDirectoryEvent`](#soradnsdirectoryevent) | 13 |
  | `Sorafs` | [`SorafsGatewayEvent`](#sorafsgatewayevent) | 14 |
  | `Musubi` | [`MusubiEvent`](#musubievent) | 15 |
  | `SpaceDirectory` | [`SpaceDirectoryEvent`](#spacedirectoryevent) | 16 |
  | `Escrow` | [`EscrowEvent`](#escrowevent) | 17 |
  | `Oracle` | [`OracleEvent`](#oracleevent) | 18 |
  | `Governance` | [`GovernanceEvent`](#governanceevent) | 19 |
  | `Social` | [`SocialEvent`](#socialevent) | 20 |
  | `Bridge` | [`BridgeEvent`](#bridgeevent) | 21 |

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

## `DataSpaceId` {#dataspaceid}

**Type:** Alias

**To:** `u64`

## `DataTriggerStep` {#datatriggerstep}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |
  | `instructions` | [`ExecutionStep`](#executionstep) |

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

## `DefiOracleAttestation` {#defioracleattestation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`DefiOracleAttestationKey`](#defioracleattestationkey) |
  | `provider` | [`AccountId`](#accountid) |
  | `oracle_slot` | `u64` |
  | `status_flags` | `u32` |
  | `attestation_hash` | `u64` |
  | `oracle_payload` | [`Vec<u8>`](#vec-u8) |
  | `oracle_signature` | [`Vec<u8>`](#vec-u8) |
  | `signer_public_key` | [`Vec<u8>`](#vec-u8) |
  | `oracle_scheme` | `u32` |
  | `source_events` | [`Vec<DefiOracleAttestationSource>`](#vec-defioracleattestationsource) |

## `DefiOracleAttestationKey` {#defioracleattestationkey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | `u32` |
  | `subject_id` | `u64` |

## `DefiOracleAttestationRecorded` {#defioracleattestationrecorded}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `attestation` | [`DefiOracleAttestation`](#defioracleattestation) |

## `DefiOracleAttestationSource` {#defioracleattestationsource}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `slot` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `field` | `String` |

## `DeliberationPhaseV1` {#deliberationphasev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Orientation` | &mdash; | 0 |
  | `Evidence` | &mdash; | 1 |
  | `Questions` | &mdash; | 2 |
  | `Responses` | &mdash; | 3 |
  | `Deliberation` | &mdash; | 4 |
  | `Reflection` | &mdash; | 5 |
  | `Vote` | &mdash; | 6 |

## `DirectContractDeploymentOriginV1` {#directcontractdeploymentoriginv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `deployer` | [`AccountId`](#accountid) |

## `DirectoryDraftSubmittedEventV1` {#directorydraftsubmittedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `directory_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `car_cid` | [`IpfsPath`](#ipfspath) |
  | `builder_public_key` | [`PublicKey`](#publickey) |

## `DirectoryPolicyUpdatedEventV1` {#directorypolicyupdatedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`DirectoryRotationPolicyV1`](#directoryrotationpolicyv1) |

## `DirectoryPublishedEventV1` {#directorypublishedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `directory_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `previous_directory_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `directory_json_sha256` | [`Array<u8, 32>`](#array-u8-32) |
  | `car_cid` | [`IpfsPath`](#ipfspath) |
  | `block_height` | `u64` |

## `DirectoryReleaseSignerEventV1` {#directoryreleasesignereventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |

## `DirectoryRevokedEventV1` {#directoryrevokedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `resolver_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `reason` | [`RadRevokeReason`](#radrevokereason) |
  | `block_height` | `u64` |

## `DirectoryRotationPolicyV1` {#directoryrotationpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `min_interval_ms` | `u64` |
  | `max_skew_ms` | `u64` |
  | `require_change` | `bool` |
  | `council_threshold` | `u16` |

## `DirectoryUnrevokedEventV1` {#directoryunrevokedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `resolver_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `block_height` | `u64` |

## `Domain` {#domain}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`DomainId`](#domainid) |
  | `logo` | [`Option<SorafsUri>`](#option-sorafsuri) |
  | `metadata` | [`Metadata`](#metadata) |
  | `owned_by` | [`AccountId`](#accountid) |

## `DomainCommittee` {#domaincommittee}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `committee_id` | `String` |
  | `members` | [`Vec<PublicKey>`](#vec-publickey) |
  | `quorum` | `u16` |
  | `metadata` | [`Metadata`](#metadata) |

## `DomainEndorsement` {#domainendorsement}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `domain_id` | [`DomainId`](#domainid) |
  | `committee_id` | `String` |
  | `statement_hash` | [`Hash`](#hash) |
  | `issued_at_height` | `u64` |
  | `expires_at_height` | `u64` |
  | `scope` | [`DomainEndorsementScope`](#domainendorsementscope) |
  | `signatures` | [`Vec<DomainEndorsementSignature>`](#vec-domainendorsementsignature) |
  | `metadata` | [`Metadata`](#metadata) |

## `DomainEndorsementPolicy` {#domainendorsementpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `committee_id` | `String` |
  | `max_endorsement_age` | `u64` |
  | `required` | `bool` |

## `DomainEndorsementRecord` {#domainendorsementrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `endorsement` | [`DomainEndorsement`](#domainendorsement) |
  | `accepted_at_height` | `u64` |

## `DomainEndorsementScope` {#domainendorsementscope}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace` | [`Option<DataSpaceId>`](#option-dataspaceid) |
  | `block_start` | [`Option<u64>`](#option-u64) |
  | `block_end` | [`Option<u64>`](#option-u64) |

## `DomainEndorsementSignature` {#domainendorsementsignature}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | [`PublicKey`](#publickey) |
  | `signature` | [`Signature`](#signature) |

## `DomainEvent` {#domainevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`Domain`](#domain) | 0 |
  | `Deleted` | [`DomainId`](#domainid) | 1 |
  | `AssetDefinition` | [`ScopedAssetDefinition`](#scopedassetdefinition) | 2 |
  | `Asset` | [`ScopedAsset`](#scopedasset) | 3 |
  | `Nft` | [`NftEvent`](#nftevent) | 4 |
  | `Rwa` | [`RwaEvent`](#rwaevent) | 5 |
  | `Account` | [`ScopedAccount`](#scopedaccount) | 6 |
  | `AccountLinked` | [`AccountDomainLinkChanged`](#accountdomainlinkchanged) | 7 |
  | `AccountUnlinked` | [`AccountDomainLinkChanged`](#accountdomainlinkchanged) | 8 |
  | `MetadataInserted` | [`MetadataChanged<DomainId>`](#metadatachanged-domainid) | 9 |
  | `MetadataRemoved` | [`MetadataChanged<DomainId>`](#metadatachanged-domainid) | 10 |
  | `OwnerChanged` | [`DomainOwnerChanged`](#domainownerchanged) | 11 |
  | `KaigiRosterSummary` | [`KaigiRosterSummary`](#kaigirostersummary) | 12 |
  | `KaigiRelayRegistered` | [`KaigiRelayRegistrationSummary`](#kaigirelayregistrationsummary) | 13 |
  | `KaigiRelayManifestUpdated` | [`KaigiRelayManifestSummary`](#kaigirelaymanifestsummary) | 14 |
  | `KaigiUsageSummary` | [`KaigiUsageSummary`](#kaigiusagesummary) | 15 |
  | `KaigiRelayHealthUpdated` | [`KaigiRelayHealthSummary`](#kaigirelayhealthsummary) | 16 |
  | `StreamingTicketReady` | [`StreamingTicketReady`](#streamingticketready) | 17 |
  | `StreamingTicketRevoked` | [`StreamingTicketRevoked`](#streamingticketrevoked) | 18 |
  | `KaigiRelayUnregistered` | [`KaigiRelayUnregistrationSummary`](#kaigirelayunregistrationsummary) | 19 |
  | `KaigiStatusChanged` | [`KaigiStatusSummary`](#kaigistatussummary) | 20 |

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

## `DomainOwnerChanged` {#domainownerchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `new_owner` | [`AccountId`](#accountid) |

## `DualQuorum` {#dualquorum}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `min_signers` | `u32` |
  | `total_power` | `u64` |

## `DurationFactorSet` {#durationfactorset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `monthly_bps` | `u16` |
  | `quarterly_bps` | `u16` |
  | `annual_bps` | `u16` |

## `DynamicAccessHint` {#dynamicaccesshint}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `base_key` | `String` |
  | `key_type` | `String` |
  | `bound_kind` | `String` |
  | `max_keys` | `u32` |

## `EntryPointKind` {#entrypointkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Kotoage` | &mdash; | 0 |
  | `View` | &mdash; | 1 |
  | `Hajimari` | &mdash; | 2 |
  | `Kaizen` | &mdash; | 3 |

## `EntrypointArgumentFieldV1` {#entrypointargumentfieldv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `ty` | [`EntrypointValueTypeV1`](#entrypointvaluetypev1) |

## `EntrypointArgumentSchemaV1` {#entrypointargumentschemav1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `fields` | [`Vec<EntrypointArgumentFieldV1>`](#vec-entrypointargumentfieldv1) |

## `EntrypointDescriptor` {#entrypointdescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `kind` | [`EntryPointKind`](#entrypointkind) |
  | `params` | [`Vec<EntrypointParamDescriptor>`](#vec-entrypointparamdescriptor) |
  | `argument_schema` | [`Option<EntrypointArgumentSchemaV1>`](#option-entrypointargumentschemav1) |
  | `return_type` | [`Option<String>`](#option-string) |
  | `return_schema` | [`Option<EntrypointValueTypeV1>`](#option-entrypointvaluetypev1) |
  | `permission` | [`Option<String>`](#option-string) |
  | `read_keys` | [`Vec<String>`](#vec-string) |
  | `write_keys` | [`Vec<String>`](#vec-string) |
  | `access_hints_complete` | [`Option<bool>`](#option-bool) |
  | `access_hints_skipped` | [`Vec<String>`](#vec-string) |
  | `triggers` | [`Vec<TriggerDescriptor>`](#vec-triggerdescriptor) |

## `EntrypointListTypeNodeV1` {#entrypointlisttypenodev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `capacity` | `u8` |

## `EntrypointParamDescriptor` {#entrypointparamdescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `type_name` | `String` |

## `EntrypointStructTypeNodeV1` {#entrypointstructtypenodev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `fields` | [`Vec<String>`](#vec-string) |

## `EntrypointValueKindV1` {#entrypointvaluekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Int` | &mdash; | 0 |
  | `Decimal` | &mdash; | 1 |
  | `Quantity` | &mdash; | 2 |
  | `Bool` | &mdash; | 3 |
  | `String` | &mdash; | 4 |
  | `Json` | &mdash; | 5 |
  | `Name` | &mdash; | 6 |
  | `AccountId` | &mdash; | 7 |
  | `AssetDefinitionId` | &mdash; | 8 |
  | `AssetId` | &mdash; | 9 |
  | `DomainId` | &mdash; | 10 |
  | `NftId` | &mdash; | 11 |
  | `DataSpaceId` | &mdash; | 12 |
  | `Blob` | &mdash; | 13 |

## `EntrypointValueTypeNodeV1` {#entrypointvaluetypenodev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Struct` | [`EntrypointStructTypeNodeV1`](#entrypointstructtypenodev1) | 0 |
  | `Tuple` | `u16` | 1 |
  | `Option` | &mdash; | 2 |
  | `Result` | &mdash; | 3 |
  | `List` | [`EntrypointListTypeNodeV1`](#entrypointlisttypenodev1) | 4 |
  | `Leaf` | [`EntrypointValueKindV1`](#entrypointvaluekindv1) | 5 |

## `EntrypointValueTypeV1` {#entrypointvaluetypev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `nodes` | [`Vec<EntrypointValueTypeNodeV1>`](#vec-entrypointvaluetypenodev1) |

## `EscrowEvent` {#escrowevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Opened` | [`AssetEscrowRecord`](#assetescrowrecord) | 0 |
  | `Accepted` | [`AssetEscrowRecord`](#assetescrowrecord) | 1 |
  | `PaymentSent` | [`AssetEscrowRecord`](#assetescrowrecord) | 2 |
  | `Released` | [`AssetEscrowRecord`](#assetescrowrecord) | 3 |
  | `Cancelled` | [`AssetEscrowRecord`](#assetescrowrecord) | 4 |
  | `Expired` | [`AssetEscrowRecord`](#assetescrowrecord) | 5 |
  | `Attested` | [`ConditionalEscrowAttested`](#conditionalescrowattested) | 6 |
  | `Disputed` | [`AssetEscrowDisputed`](#assetescrowdisputed) | 7 |
  | `Resolved` | [`AssetEscrowResolved`](#assetescrowresolved) | 8 |

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

## `EventBox` {#eventbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pipeline` | [`PipelineEventBox`](#pipelineeventbox) | 0 |
  | `PipelineBatch` | [`Vec<PipelineEventBox>`](#vec-pipelineeventbox) | 1 |
  | `Data` | [`DataEvent`](#dataevent) | 2 |
  | `Time` | [`TimeEvent`](#timeevent) | 3 |
  | `ExecuteTrigger` | [`ExecuteTriggerEvent`](#executetriggerevent) | 4 |
  | `TriggerCompleted` | [`TriggerCompletedEvent`](#triggercompletedevent) | 5 |

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

## `EventMessage` {#eventmessage}

**Type:** Alias

**To:** [`EventBox`](#eventbox)

## `EventSubscriptionRequest` {#eventsubscriptionrequest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `filters` | [`Vec<EventFilterBox>`](#vec-eventfilterbox) |
  | `proof_backend` | [`Option<Vec<String>>`](#option-vec-string) |
  | `proof_call_hash` | [`Option<Vec<Array<u8, 32>>>`](#option-vec-array-u8-32) |
  | `proof_envelope_hash` | [`Option<Vec<Array<u8, 32>>>`](#option-vec-array-u8-32) |

## `ExecKv` {#execkv}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`Vec<u8>`](#vec-u8) |
  | `value` | [`Vec<u8>`](#vec-u8) |

## `ExecWitness` {#execwitness}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reads` | [`Vec<ExecKv>`](#vec-execkv) |
  | `writes` | [`Vec<ExecKv>`](#vec-execkv) |
  | `fastpq_transcripts` | [`Vec<TransferTranscriptBundle>`](#vec-transfertranscriptbundle) |
  | `fastpq_batches` | [`Vec<FastpqTransitionBatch>`](#vec-fastpqtransitionbatch) |

## `ExecWitnessMsg` {#execwitnessmsg}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `height` | `u64` |
  | `view` | `u64` |
  | `epoch` | `u64` |
  | `witness` | [`ExecWitness`](#execwitness) |

## `Executable` {#executable}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Instructions` | [`Vec<InstructionBox>`](#vec-instructionbox) | 0 |
  | `ContractCall` | [`ContractInvocation`](#contractinvocation) | 1 |
  | `Ivm` | [`IvmBytecode`](#ivmbytecode) | 2 |
  | `IvmProved` | [`IvmProved`](#ivmproved) | 3 |
  | `Batch` | [`Vec<ExecutableBatchItem>`](#vec-executablebatchitem) | 4 |

## `ExecutableBatchItem` {#executablebatchitem}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Instruction` | [`InstructionBox`](#instructionbox) | 0 |
  | `ContractCall` | [`ContractInvocation`](#contractinvocation) | 1 |

## `ExecuteTriggerEvent` {#executetriggerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`TriggerId`](#triggerid) |
  | `authority` | [`AccountId`](#accountid) |
  | `args` | [`Json`](#json) |

## `ExecuteTriggerEventFilter` {#executetriggereventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`Option<TriggerId>`](#option-triggerid) |
  | `authority` | [`Option<AccountId>`](#option-accountid) |

## `ExecutionCommitment` {#executioncommitment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parent_state_root` | [`Hash`](#hash) |
  | `post_state_root` | [`Hash`](#hash) |
  | `ordinary_writes_root` | [`Hash`](#hash) |
  | `topup_anchor_root` | [`Option<Hash>`](#option-hash) |
  | `topup_anchor_count` | `u32` |
  | `native_amx_application_manifest_version` | `u16` |
  | `native_amx_application_manifest_root` | [`Hash`](#hash) |
  | `native_amx_application_manifest_count` | `u32` |
  | `lane_finality_manifest` | [`Option<MerkleTreeCommitment<LaneFinalityStatement>>`](#option-merkletreecommitment-lanefinalitystatement) |
  | `merge_carrier` | [`Option<MergeCarrierCommitmentV1>`](#option-mergecarriercommitmentv1) |
  | `executed_block_wire_len` | `u64` |
  | `executed_block_wire_hash` | [`Hash`](#hash) |

## `ExecutionStep` {#executionstep}

**Type:** Alias

**To:** [`Vec<InstructionBox>`](#vec-instructionbox)

## `ExecutionTime` {#executiontime}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `PreCommit` | &mdash; | 0 |
  | `Schedule` | [`Schedule`](#schedule) | 1 |

## `ExecutorDataModel` {#executordatamodel}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parameters` | [`SortedMap<CustomParameterId, CustomParameter>`](#sortedmap-customparameterid-customparameter) |
  | `instructions` | [`SortedVec<String>`](#sortedvec-string) |
  | `permissions` | [`SortedVec<String>`](#sortedvec-string) |
  | `schema` | [`Json`](#json) |

## `ExecutorEvent` {#executorevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Upgraded` | [`ExecutorUpgrade`](#executorupgrade) | 0 |

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

## `ExecutorUpgrade` {#executorupgrade}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `new_data_model` | [`ExecutorDataModel`](#executordatamodel) |

## `ExternalExecutionContext` {#externalexecutioncontext}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `entrypoint_hash` | [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `routing_plan_digest` | [`Hash`](#hash) |
  | `routing_plan_legs` | [`Vec<ExternalExecutionRouteLeg>`](#vec-externalexecutionrouteleg) |
  | `native_amx_receipt` | [`Option<NativeAmxReceipt>`](#option-nativeamxreceipt) |

## `ExternalExecutionRouteLeg` {#externalexecutionrouteleg}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `role` | [`ExternalExecutionRouteRole`](#externalexecutionrouterole) |

## `ExternalExecutionRouteRole` {#externalexecutionrouterole}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `coordinator` | &mdash; | 0 |
  | `participant` | &mdash; | 1 |

## `FastpqOperationKind` {#fastpqoperationkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transfer` | &mdash; | 16 |
  | `MetaSet` | &mdash; | 17 |

## `FastpqPublicInputs` {#fastpqpublicinputs}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dsid` | [`Array<u8, 16>`](#array-u8-16) |
  | `slot` | `u64` |
  | `old_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `new_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `perm_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `tx_set_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `FastpqStateTransition` {#fastpqstatetransition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`Vec<u8>`](#vec-u8) |
  | `pre_value` | [`Vec<u8>`](#vec-u8) |
  | `post_value` | [`Vec<u8>`](#vec-u8) |
  | `operation` | [`FastpqOperationKind`](#fastpqoperationkind) |

## `FastpqTransitionBatch` {#fastpqtransitionbatch}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `parameter` | `String` |
  | `public_inputs` | [`FastpqPublicInputs`](#fastpqpublicinputs) |
  | `transitions` | [`Vec<FastpqStateTransition>`](#vec-fastpqstatetransition) |
  | `metadata` | [`SortedMap<String, Vec<u8>>`](#sortedmap-string-vec-u8) |

## `FeeChargeKind` {#feechargekind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `nexus` | &mdash; | 0 |
  | `pipeline_gas` | &mdash; | 1 |

## `FeeChargeLimit` {#feechargelimit}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`FeeChargeKind`](#feechargekind) |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `max_amount` | [`Quantity`](#quantity) |

## `FeeDebitSource` {#feedebitsource}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `account` | [`AccountId`](#accountid) | 0 |
  | `sponsor_program` | [`FeeSponsorProgramId`](#feesponsorprogramid) | 1 |

## `FeePaymentIntent` {#feepaymentintent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `authority` | [`AuthorityFeePayment`](#authorityfeepayment) | 0 |
  | `sponsor` | [`SponsorFeePayment`](#sponsorfeepayment) | 1 |

## `FeeSponsorProgram` {#feesponsorprogram}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`FeeSponsorProgramId`](#feesponsorprogramid) |
  | `payout_account` | [`AccountId`](#accountid) |
  | `lifecycle` | [`FeeSponsorProgramLifecycle`](#feesponsorprogramlifecycle) |
  | `active_revision` | [`Option<u64>`](#option-u64) |
  | `staged_revision` | [`Option<u64>`](#option-u64) |
  | `scheduled_activation` | [`Option<FeeSponsorProgramActivation>`](#option-feesponsorprogramactivation) |

## `FeeSponsorProgramActivation` {#feesponsorprogramactivation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `revision` | `u64` |
  | `activate_at_height` | `u64` |

## `FeeSponsorProgramId` {#feesponsorprogramid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sponsor` | [`AccountId`](#accountid) |
  | `name` | [`Name`](#name) |

## `FeeSponsorProgramLifecycle` {#feesponsorprogramlifecycle}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `staged` | &mdash; | 0 |
  | `paused` | &mdash; | 1 |
  | `active` | &mdash; | 2 |
  | `closing` | &mdash; | 3 |
  | `closed` | &mdash; | 4 |

## `FeedConfig` {#feedconfig}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `feed_config_version` | [`FeedConfigVersion`](#feedconfigversion) |
  | `providers` | [`Vec<AccountId>`](#vec-accountid) |
  | `connector_id` | `String` |
  | `connector_version` | `u32` |
  | `cadence_slots` | [`NonZero<u64>`](#nonzero-u64) |
  | `aggregation` | [`AggregationRule`](#aggregationrule) |
  | `outlier_policy` | [`OutlierPolicy`](#outlierpolicy) |
  | `min_signers` | `u16` |
  | `committee_size` | `u16` |
  | `risk_class` | [`RiskClass`](#riskclass) |
  | `max_observers` | `u16` |
  | `max_value_len` | `u16` |
  | `max_error_rate_bps` | `u16` |
  | `dispute_window_slots` | [`NonZero<u64>`](#nonzero-u64) |
  | `replay_window_slots` | [`NonZero<u64>`](#nonzero-u64) |

## `FeedConfigVersion` {#feedconfigversion}

**Type:** Alias

**To:** `u32`

## `FeedError` {#feederror}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code` | [`ObservationErrorCode`](#observationerrorcode) |

## `FeedEvent` {#feedevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `feed_config_version` | [`FeedConfigVersion`](#feedconfigversion) |
  | `slot` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `outcome` | [`FeedEventOutcome`](#feedeventoutcome) |

## `FeedEventOutcome` {#feedeventoutcome}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Success` | [`FeedSuccess`](#feedsuccess) | 0 |
  | `Error` | [`FeedError`](#feederror) | 1 |
  | `Missing` | &mdash; | 2 |

## `FeedEventRecord` {#feedeventrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `event` | [`FeedEvent`](#feedevent) |
  | `recorded_at_ms` | `u64` |
  | `evidence_hashes` | [`Vec<Hash>`](#vec-hash) |

## `FeedId` {#feedid}

**Type:** Alias

**To:** [`Name`](#name)

## `FeedSuccess` {#feedsuccess}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `value` | [`ObservationValue`](#observationvalue) |
  | `entries` | [`Vec<ReportEntry>`](#vec-reportentry) |

## `FetchSize` {#fetchsize}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `fetch_size` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |

## `FinalizeSmartContractCodeUpload` {#finalizesmartcontractcodeupload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |
  | `total_size` | `u64` |
  | `chunk_count` | `u32` |

## `FinalizedGlobalThresholdBeaconPulseV1` {#finalizedglobalthresholdbeaconpulsev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `session_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `roster_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `transcript_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `height` | `u64` |
  | `round` | `u64` |
  | `finalized_chain_anchor` | [`GlobalThresholdBeaconChainAnchorV1`](#globalthresholdbeaconchainanchorv1) |
  | `signature` | [`Array<u8, 48>`](#array-u8-48) |
  | `seed` | [`Array<u8, 32>`](#array-u8-32) |
  | `pulse_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FinalizedNextEpochSnapshot` {#finalizednextepochsnapshot}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `epoch` | `u64` |
  | `epoch_end_height` | `u64` |
  | `mode` | [`ConsensusMode`](#consensusmode) |
  | `roster` | [`Vec<ValidatorPower>`](#vec-validatorpower) |
  | `validator_set_pops` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `quorum` | [`DualQuorum`](#dualquorum) |
  | `leader_seed` | [`Array<u8, 32>`](#array-u8-32) |

## `FindAbiVersion` {#findabiversion}

**Type:** Zero-Size Type (unit type, null type)

## `FindAccountByAlias` {#findaccountbyalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`AccountAlias`](#accountalias) |

## `FindAccountById` {#findaccountbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AccountId`](#accountid) |

## `FindAccountRecoveryPolicyByAlias` {#findaccountrecoverypolicybyalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`AccountAlias`](#accountalias) |

## `FindAccountRecoveryRequestByAlias` {#findaccountrecoveryrequestbyalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`AccountAlias`](#accountalias) |

## `FindAliasesByAccountId` {#findaliasesbyaccountid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AccountId`](#accountid) |
  | `dataspace` | [`Option<String>`](#option-string) |
  | `domain` | [`Option<String>`](#option-string) |

## `FindAssetById` {#findassetbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AssetId`](#assetid) |

## `FindAssetDefinitionById` {#findassetdefinitionbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`AssetDefinitionId`](#assetdefinitionid) |

## `FindAssetEscrowById` {#findassetescrowbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow_id` | [`EscrowId`](#escrowid) |

## `FindContractManifestByCodeHash` {#findcontractmanifestbycodehash}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |

## `FindDaPinIntentByAlias` {#finddapinintentbyalias}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | `String` |

## `FindDaPinIntentByLaneEpochSequence` {#finddapinintentbylaneepochsequence}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `epoch` | `u64` |
  | `sequence` | `u64` |

## `FindDaPinIntentByManifest` {#finddapinintentbymanifest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `manifest_hash` | [`ManifestDigest`](#manifestdigest) |

## `FindDaPinIntentByTicket` {#finddapinintentbyticket}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `storage_ticket` | [`StorageTicketId`](#storageticketid) |

## `FindDataspaceNameOwnerById` {#finddataspacenameownerbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |

## `FindDomainById` {#finddomainbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`DomainId`](#domainid) |

## `FindDomainCommittee` {#finddomaincommittee}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `committee_id` | `String` |

## `FindDomainEndorsementPolicy` {#finddomainendorsementpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain_id` | [`DomainId`](#domainid) |

## `FindDomainEndorsements` {#finddomainendorsements}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain_id` | [`DomainId`](#domainid) |

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
  | `SorafsAnonymousServiceEscrow` | [`Array<u8, 32>`](#array-u8-32) | 42 |
  | `SorafsRepairTask` | `String` | 43 |
  | `SorafsRepairStatus` | &mdash; | 44 |
  | `SorafsProofOutcome` | [`SorafsProofOutcomeFindErrorV1`](#sorafsproofoutcomefinderrorv1) | 45 |
  | `SorafsReputationJournalAuthorityPolicy` | &mdash; | 46 |
  | `SorafsReputationJournalEvent` | [`ReputationJournalSourceIdV1`](#reputationjournalsourceidv1) | 47 |
  | `SorafsModerationPolicy` | &mdash; | 48 |
  | `SorafsModerationAppeal` | `String` | 49 |
  | `SorafsModerationJurorEligibility` | `String` | 50 |
  | `SorafsAnonymousJurorCandidacy` | [`Array<u8, 32>`](#array-u8-32) | 51 |
  | `SorafsModerationCase` | `String` | 52 |
  | `SorafsModerationCommit` | `String` | 53 |
  | `SorafsModerationReveal` | `String` | 54 |
  | `SorafsModerationChallenge` | `String` | 55 |
  | `SorafsModerationOutcome` | `String` | 56 |
  | `SorafsModerationNoShow` | `String` | 57 |
  | `SorafsModerationStatus` | &mdash; | 58 |

## `FindExecutorDataModel` {#findexecutordatamodel}

**Type:** Zero-Size Type (unit type, null type)

## `FindFeeSponsorProgramById` {#findfeesponsorprogrambyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`FeeSponsorProgramId`](#feesponsorprogramid) |

## `FindFxCorridorPolicyById` {#findfxcorridorpolicybyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy_id` | [`Name`](#name) |

## `FindFxCorridorPolicyRegistry` {#findfxcorridorpolicyregistry}

**Type:** Zero-Size Type (unit type, null type)

## `FindLaneRelayEnvelopeByRef` {#findlanerelayenvelopebyref}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `relay_ref` | [`LaneRelayEnvelopeRef`](#lanerelayenveloperef) |

## `FindLatestDefiOracleAttestation` {#findlatestdefioracleattestation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`DefiOracleAttestationKey`](#defioracleattestationkey) |

## `FindMusubiAliasHistoryV1` {#findmusubialiashistoryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiAliasQueryV1`](#musubialiasqueryv1) |

## `FindMusubiAliasV1` {#findmusubialiasv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiAliasQueryV1`](#musubialiasqueryv1) |

## `FindMusubiArchiveLocationsV1` {#findmusubiarchivelocationsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiArchiveLocationQueryV1`](#musubiarchivelocationqueryv1) |

## `FindMusubiArchiveRetentionV1` {#findmusubiarchiveretentionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiArchiveRetentionQueryV1`](#musubiarchiveretentionqueryv1) |

## `FindMusubiExactPackageV1` {#findmusubiexactpackagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiExactPackageQueryV1`](#musubiexactpackagequeryv1) |

## `FindMusubiExactReleaseV1` {#findmusubiexactreleasev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiExactReleaseQueryV1`](#musubiexactreleasequeryv1) |

## `FindMusubiMaintainersV1` {#findmusubimaintainersv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiPackagePageQueryV1`](#musubipackagepagequeryv1) |

## `FindMusubiOrderedPrefixV1` {#findmusubiorderedprefixv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiOrderedPrefixQueryV1`](#musubiorderedprefixqueryv1) |

## `FindMusubiProviderBundleAttestationV1` {#findmusubiproviderbundleattestationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`MusubiProviderBundleAttestationKeyV1`](#musubiproviderbundleattestationkeyv1) |

## `FindMusubiResolverIndexV1` {#findmusubiresolverindexv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiResolverIndexQueryV1`](#musubiresolverindexqueryv1) |

## `FindMusubiVersionsV1` {#findmusubiversionsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `request` | [`MusubiPackagePageQueryV1`](#musubipackagepagequeryv1) |

## `FindNftById` {#findnftbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`NftId`](#nftid) |

## `FindOracleChangeById` {#findoraclechangebyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `change_id` | [`OracleChangeId`](#oraclechangeid) |

## `FindOracleDisputeById` {#findoracledisputebyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dispute_id` | [`OracleDisputeId`](#oracledisputeid) |

## `FindOracleFeedById` {#findoraclefeedbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |

## `FindOracleProviderStatsByKey` {#findoracleproviderstatsbykey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`OracleProviderKey`](#oracleproviderkey) |

## `FindParameters` {#findparameters}

**Type:** Zero-Size Type (unit type, null type)

## `FindProofRecordById` {#findproofrecordbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`ProofId`](#proofid) |

## `FindSorafsAnonymousJurorCandidacy` {#findsorafsanonymousjurorcandidacy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `action_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsAnonymousServiceEscrowById` {#findsorafsanonymousserviceescrowbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsCitizenBondBySerialCommitment` {#findsorafscitizenbondbyserialcommitment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `serial_commitment` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsCitizenBondSnapshot` {#findsorafscitizenbondsnapshot}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsModerationAppeal` {#findsorafsmoderationappeal}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |

## `FindSorafsModerationCase` {#findsorafsmoderationcase}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |

## `FindSorafsModerationChallenge` {#findsorafsmoderationchallenge}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `challenge_id` | `String` |

## `FindSorafsModerationCommit` {#findsorafsmoderationcommit}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |

## `FindSorafsModerationEvents` {#findsorafsmoderationevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`ModerationFinalizedCursorV1`](#moderationfinalizedcursorv1) |
  | `after` | [`Option<ModerationFinalizedEventCursorV1>`](#option-moderationfinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsModerationJurorEligibility` {#findsorafsmoderationjuroreligibility}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |

## `FindSorafsModerationNoShow` {#findsorafsmoderationnoshow}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |

## `FindSorafsModerationOutcome` {#findsorafsmoderationoutcome}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |

## `FindSorafsModerationPolicy` {#findsorafsmoderationpolicy}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsModerationReveal` {#findsorafsmoderationreveal}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |

## `FindSorafsModerationSnapshot` {#findsorafsmoderationsnapshot}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_cases` | `u32` |
  | `max_events` | `u32` |

## `FindSorafsModerationStatus` {#findsorafsmoderationstatus}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsOrderbookCancellationByOrderId` {#findsorafsorderbookcancellationbyorderid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `order_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsOrderbookChannelById` {#findsorafsorderbookchannelbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `channel_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsOrderbookChannels` {#findsorafsorderbookchannels}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<OrderbookFinalizedCursorV1>`](#option-orderbookfinalizedcursorv1) |
  | `status` | [`Option<OrderbookSettlementChannelStatusV1>`](#option-orderbooksettlementchannelstatusv1) |
  | `after_channel_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsOrderbookEvents` {#findsorafsorderbookevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<OrderbookFinalizedCursorV1>`](#option-orderbookfinalizedcursorv1) |
  | `after` | [`Option<OrderbookFinalizedEventCursorV1>`](#option-orderbookfinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsOrderbookOrderById` {#findsorafsorderbookorderbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `order_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsOrderbookOrders` {#findsorafsorderbookorders}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<OrderbookFinalizedCursorV1>`](#option-orderbookfinalizedcursorv1) |
  | `status` | [`Option<OrderbookOrderStatusV1>`](#option-orderbookorderstatusv1) |
  | `after_order_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsOrderbookPolicy` {#findsorafsorderbookpolicy}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsOrderbookReceiptById` {#findsorafsorderbookreceiptbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `receipt_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsOrderbookReceipts` {#findsorafsorderbookreceipts}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<OrderbookFinalizedCursorV1>`](#option-orderbookfinalizedcursorv1) |
  | `channel_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `after_receipt_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsOrderbookStatus` {#findsorafsorderbookstatus}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsOrderbookTradeById` {#findsorafsorderbooktradebyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trade_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsOrderbookTrades` {#findsorafsorderbooktrades}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<OrderbookFinalizedCursorV1>`](#option-orderbookfinalizedcursorv1) |
  | `after_trade_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsPinManifest` {#findsorafspinmanifest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `digest` | [`ManifestDigest`](#manifestdigest) |
  | `expected_finalized_cursor` | [`Option<PinManifestFinalizedCursorV1>`](#option-pinmanifestfinalizedcursorv1) |

## `FindSorafsPinManifests` {#findsorafspinmanifests}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<PinManifestFinalizedCursorV1>`](#option-pinmanifestfinalizedcursorv1) |
  | `status` | [`Option<PinStatusKindV1>`](#option-pinstatuskindv1) |
  | `after_digest` | [`Option<ManifestDigest>`](#option-manifestdigest) |
  | `limit` | `u32` |
  | `max_bytes` | `u32` |

## `FindSorafsPopAuditDigestBySequence` {#findsorafspopauditdigestbysequence}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |

## `FindSorafsPopCommitmentRootByVersion` {#findsorafspopcommitmentrootbyversion}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `tree_version` | `u64` |

## `FindSorafsPopCredentialCommitmentByDigest` {#findsorafspopcredentialcommitmentbydigest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `credential_commitment` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsPopIssuerPolicy` {#findsorafspopissuerpolicy}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsPopRegistryStatus` {#findsorafspopregistrystatus}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsPopRevocationByNonceCommitment` {#findsorafspoprevocationbynoncecommitment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `revocation_nonce_commitment` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsPopRevocationPublicationByVersion` {#findsorafspoprevocationpublicationbyversion}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `list_version` | `u64` |

## `FindSorafsProofOutcome` {#findsorafsproofoutcome}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`ProofOutcomeKindV1`](#proofoutcomekindv1) |
  | `identity_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `expected_finalized_cursor` | [`Option<ProofOutcomeFinalizedCursorV1>`](#option-proofoutcomefinalizedcursorv1) |

## `FindSorafsProofOutcomeEvents` {#findsorafsproofoutcomeevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ProofOutcomeFinalizedCursorV1>`](#option-proofoutcomefinalizedcursorv1) |
  | `after` | [`Option<ProofOutcomeFinalizedEventCursorV1>`](#option-proofoutcomefinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsProviderOwner` {#findsorafsproviderowner}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_id` | [`ProviderId`](#providerid) |

## `FindSorafsRepairEvents` {#findsorafsrepairevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<RepairFinalizedCursorV1>`](#option-repairfinalizedcursorv1) |
  | `after` | [`Option<RepairFinalizedEventCursorV1>`](#option-repairfinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsRepairStatus` {#findsorafsrepairstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<RepairFinalizedCursorV1>`](#option-repairfinalizedcursorv1) |

## `FindSorafsRepairTask` {#findsorafsrepairtask}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `ticket_id` | `String` |
  | `expected_finalized_cursor` | [`Option<RepairFinalizedCursorV1>`](#option-repairfinalizedcursorv1) |

## `FindSorafsRepairTasks` {#findsorafsrepairtasks}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<RepairFinalizedCursorV1>`](#option-repairfinalizedcursorv1) |
  | `after_task_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsReputationJournalAuthorityPolicy` {#findsorafsreputationjournalauthoritypolicy}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsReputationJournalEventBySourceId` {#findsorafsreputationjournaleventbysourceid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source_id` | [`ReputationJournalSourceIdV1`](#reputationjournalsourceidv1) |
  | `expected_finalized_cursor` | [`Option<ReputationJournalFinalizedCursorV1>`](#option-reputationjournalfinalizedcursorv1) |

## `FindSorafsReputationJournalEvents` {#findsorafsreputationjournalevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ReputationJournalFinalizedCursorV1>`](#option-reputationjournalfinalizedcursorv1) |
  | `after` | [`Option<ReputationJournalFinalizedEventCursorV1>`](#option-reputationjournalfinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsReserveAppealById` {#findsorafsreserveappealbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `appeal_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsReserveAppeals` {#findsorafsreserveappeals}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ReserveFinalizedCursorV1>`](#option-reservefinalizedcursorv1) |
  | `after_appeal_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsReserveEvents` {#findsorafsreserveevents}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ReserveFinalizedCursorV1>`](#option-reservefinalizedcursorv1) |
  | `after` | [`Option<ReserveFinalizedEventCursorV1>`](#option-reservefinalizedeventcursorv1) |
  | `limit` | `u32` |

## `FindSorafsReserveMovementById` {#findsorafsreservemovementbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `movement_id` | [`Array<u8, 32>`](#array-u8-32) |

## `FindSorafsReserveMovements` {#findsorafsreservemovements}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ReserveFinalizedCursorV1>`](#option-reservefinalizedcursorv1) |
  | `after_movement_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `limit` | `u32` |

## `FindSorafsReservePolicy` {#findsorafsreservepolicy}

**Type:** Zero-Size Type (unit type, null type)

## `FindSorafsReserveProviderById` {#findsorafsreserveproviderbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_id` | [`ProviderId`](#providerid) |

## `FindSorafsReserveProviders` {#findsorafsreserveproviders}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected_finalized_cursor` | [`Option<ReserveFinalizedCursorV1>`](#option-reservefinalizedcursorv1) |
  | `after_provider_id` | [`Option<ProviderId>`](#option-providerid) |
  | `limit` | `u32` |

## `FindTriggerById` {#findtriggerbyid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |

## `FindTwitterBindingByHash` {#findtwitterbindingbyhash}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_hash` | [`KeyedHash`](#keyedhash) |

## `ForwardCursor` {#forwardcursor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | `String` |
  | `cursor` | [`NonZero<u64>`](#nonzero-u64) |
  | `gas_budget` | [`Option<u64>`](#option-u64) |

## `FxCorridorPolicy` {#fxcorridorpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy_id` | [`Name`](#name) |
  | `revision` | `u64` |
  | `owner` | [`AccountId`](#accountid) |
  | `source_dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `source_asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `destination_dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `destination_asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `allowed_destination_alias_domains` | [`SortedVec<DomainId>`](#sortedvec-domainid) |
  | `oracle_feed_id` | [`FeedId`](#feedid) |
  | `max_oracle_age_ms` | `u64` |
  | `max_source_amount_per_settlement` | [`Quantity`](#quantity) |
  | `max_destination_amount_per_settlement` | [`Quantity`](#quantity) |
  | `velocity_window_ms` | `u64` |
  | `max_settlements_per_window` | `u64` |
  | `max_source_amount_per_window` | [`Quantity`](#quantity) |
  | `max_destination_amount_per_window` | [`Quantity`](#quantity) |
  | `enabled` | `bool` |

## `FxCorridorPolicyRegistry` {#fxcorridorpolicyregistry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policies` | [`SortedMap<Name, FxCorridorPolicy>`](#sortedmap-name-fxcorridorpolicy) |
  | `usage` | [`SortedMap<Name, FxCorridorUsage>`](#sortedmap-name-fxcorridorusage) |

## `FxCorridorUsage` {#fxcorridorusage}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `window_start_ms` | `u64` |
  | `settlements` | `u64` |
  | `source_amount` | [`Quantity`](#quantity) |
  | `destination_amount` | [`Quantity`](#quantity) |

## `GlobalThresholdBeaconChainAnchorV1` {#globalthresholdbeaconchainanchorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |

## `GovernanceAttemptId` {#governanceattemptid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `GovernanceAttemptStatusV1` {#governanceattemptstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Active` | &mdash; | 0 |
  | `Certified` | &mdash; | 1 |
  | `Rejected` | &mdash; | 2 |
  | `Enacted` | &mdash; | 3 |
  | `Superseded` | &mdash; | 4 |
  | `ExecutionFailed` | &mdash; | 5 |

## `GovernanceBallotAccepted` {#governanceballotaccepted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `mode` | [`GovernanceBallotMode`](#governanceballotmode) |
  | `weight` | [`Option<u128>`](#option-u128) |

## `GovernanceBallotMode` {#governanceballotmode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Zk` | &mdash; | 0 |
  | `Plain` | &mdash; | 1 |

## `GovernanceBallotRejected` {#governanceballotrejected}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `reason` | `String` |

## `GovernanceCertificateId` {#governancecertificateid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `GovernanceCitizenRegistered` {#governancecitizenregistered}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |

## `GovernanceCitizenRevoked` {#governancecitizenrevoked}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |

## `GovernanceCitizenServiceRecorded` {#governancecitizenservicerecorded}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `owner` | [`AccountId`](#accountid) |
  | `epoch` | `u64` |
  | `role` | `String` |
  | `event` | [`CitizenServiceEvent`](#citizenserviceevent) |
  | `slashed` | [`Quantity`](#quantity) |
  | `cooldown_until` | `u64` |

## `GovernanceCouncilPersisted` {#governancecouncilpersisted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `epoch` | `u64` |
  | `members_count` | `u32` |
  | `alternates_count` | `u32` |
  | `candidates_count` | `u32` |
  | `derived_by` | [`CouncilDerivationKind`](#councilderivationkind) |

## `GovernanceEvent` {#governanceevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ProposalSubmitted` | [`GovernanceProposalSubmitted`](#governanceproposalsubmitted) | 0 |
  | `ProposalApproved` | [`GovernanceProposalApproved`](#governanceproposalapproved) | 1 |
  | `ProposalRejected` | [`GovernanceProposalRejected`](#governanceproposalrejected) | 2 |
  | `LockCreated` | [`GovernanceLockCreated`](#governancelockcreated) | 3 |
  | `LockExtended` | [`GovernanceLockExtended`](#governancelockextended) | 4 |
  | `ProposalEnacted` | [`GovernanceProposalEnacted`](#governanceproposalenacted) | 5 |
  | `BallotAccepted` | [`GovernanceBallotAccepted`](#governanceballotaccepted) | 6 |
  | `BallotRejected` | [`GovernanceBallotRejected`](#governanceballotrejected) | 7 |
  | `ReferendumOpened` | [`GovernanceReferendumOpened`](#governancereferendumopened) | 8 |
  | `ReferendumClosed` | [`GovernanceReferendumClosed`](#governancereferendumclosed) | 9 |
  | `LockUnlocked` | [`GovernanceLockUnlocked`](#governancelockunlocked) | 10 |
  | `CouncilPersisted` | [`GovernanceCouncilPersisted`](#governancecouncilpersisted) | 11 |
  | `ParliamentSelected` | [`GovernanceParliamentSelected`](#governanceparliamentselected) | 12 |
  | `ParliamentAttemptCreated` | [`GovernanceParliamentAttemptCreated`](#governanceparliamentattemptcreated) | 13 |
  | `ParliamentLifecycleTransitionApplied` | [`GovernanceParliamentLifecycleTransitionApplied`](#governanceparliamentlifecycletransitionapplied) | 14 |
  | `ParliamentAttemptTransitioned` | [`GovernanceParliamentAttemptTransitioned`](#governanceparliamentattempttransitioned) | 15 |
  | `ParliamentBodyTransitioned` | [`GovernanceParliamentBodyTransitioned`](#governanceparliamentbodytransitioned) | 16 |
  | `ParliamentBallotTransitioned` | [`GovernanceParliamentBallotTransitioned`](#governanceparliamentballottransitioned) | 17 |
  | `ParliamentConcentrationWarning` | [`GovernanceParliamentConcentrationWarning`](#governanceparliamentconcentrationwarning) | 18 |
  | `ParliamentAggregateFinalized` | [`GovernanceParliamentAggregateFinalized`](#governanceparliamentaggregatefinalized) | 19 |
  | `ThresholdKeyLifecycleApplied` | [`GovernanceThresholdKeyLifecycleAppliedV1`](#governancethresholdkeylifecycleappliedv1) | 20 |
  | `ParliamentCertificateIssued` | [`GovernanceParliamentCertificateIssued`](#governanceparliamentcertificateissued) | 21 |
  | `ParliamentApprovalRecorded` | [`GovernanceParliamentApprovalRecorded`](#governanceparliamentapprovalrecorded) | 22 |
  | `LockSlashed` | [`GovernanceLockSlashed`](#governancelockslashed) | 23 |
  | `LockRestituted` | [`GovernanceLockRestituted`](#governancelockrestituted) | 24 |
  | `CitizenRegistered` | [`GovernanceCitizenRegistered`](#governancecitizenregistered) | 25 |
  | `CitizenRevoked` | [`GovernanceCitizenRevoked`](#governancecitizenrevoked) | 26 |
  | `CitizenServiceRecorded` | [`GovernanceCitizenServiceRecorded`](#governancecitizenservicerecorded) | 27 |
  | `ReferendumDecided` | [`GovernanceReferendumDecided`](#governancereferendumdecided) | 28 |

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
  | `ProposalApproved` | `0x2` |
  | `ProposalRejected` | `0x4` |
  | `LockCreated` | `0x8` |
  | `LockExtended` | `0x10` |
  | `ProposalEnacted` | `0x20` |
  | `BallotAccepted` | `0x40` |
  | `BallotRejected` | `0x80` |
  | `ReferendumOpened` | `0x100` |
  | `ReferendumClosed` | `0x200` |
  | `LockUnlocked` | `0x400` |
  | `CouncilPersisted` | `0x800` |
  | `ParliamentSelected` | `0x1000` |
  | `ParliamentAttemptCreated` | `0x2000` |
  | `ParliamentLifecycleTransitionApplied` | `0x4000` |
  | `ParliamentAttemptTransitioned` | `0x8000` |
  | `ParliamentBodyTransitioned` | `0x10000` |
  | `ParliamentBallotTransitioned` | `0x20000` |
  | `ParliamentConcentrationWarning` | `0x40000` |
  | `ParliamentAggregateFinalized` | `0x80000` |
  | `ThresholdKeyLifecycleApplied` | `0x100000` |
  | `ParliamentCertificateIssued` | `0x200000` |
  | `ParliamentApprovalRecorded` | `0x400000` |
  | `LockSlashed` | `0x800000` |
  | `LockRestituted` | `0x1000000` |
  | `CitizenRegistered` | `0x2000000` |
  | `CitizenRevoked` | `0x4000000` |
  | `CitizenServiceRecorded` | `0x8000000` |
  | `ReferendumDecided` | `0x10000000` |

## `GovernanceExpectedHeadAbsentV1` {#governanceexpectedheadabsentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `subject_id` | [`Array<u8, 32>`](#array-u8-32) |

## `GovernanceExpectedHeadPresentV1` {#governanceexpectedheadpresentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `subject_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `version` | `u64` |
  | `head_root` | [`Array<u8, 32>`](#array-u8-32) |

## `GovernanceExpectedHeadV1` {#governanceexpectedheadv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Absent` | [`GovernanceExpectedHeadAbsentV1`](#governanceexpectedheadabsentv1) | 0 |
  | `Present` | [`GovernanceExpectedHeadPresentV1`](#governanceexpectedheadpresentv1) | 1 |

## `GovernanceLockCreated` {#governancelockcreated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `expiry_height` | `u64` |

## `GovernanceLockExtended` {#governancelockextended}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `expiry_height` | `u64` |

## `GovernanceLockRestituted` {#governancelockrestituted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `reason` | [`GovernanceSlashReason`](#governanceslashreason) |
  | `note` | `String` |

## `GovernanceLockSlashed` {#governancelockslashed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `reason` | [`GovernanceSlashReason`](#governanceslashreason) |
  | `destination` | [`AccountId`](#accountid) |
  | `note` | `String` |

## `GovernanceLockUnlocked` {#governancelockunlocked}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `owner` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |

## `GovernanceManifestActivation` {#governancemanifestactivation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `contract_address` | `String` |
  | `code_hash_hex` | `String` |
  | `abi_hash_hex` | [`Option<String>`](#option-string) |
  | `height` | `u64` |
  | `activated_at_ms` | `u64` |

## `GovernanceManifestAdmissionCounters` {#governancemanifestadmissioncounters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `total_checks` | `u64` |
  | `allowed` | `u64` |
  | `missing_manifest` | `u64` |
  | `non_validator_authority` | `u64` |
  | `quorum_rejected` | `u64` |
  | `protected_namespace_rejected` | `u64` |
  | `runtime_hook_rejected` | `u64` |

## `GovernanceManifestQuorumCounters` {#governancemanifestquorumcounters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `total_checks` | `u64` |
  | `satisfied` | `u64` |
  | `rejected` | `u64` |

## `GovernanceParliamentAggregateFinalized` {#governanceparliamentaggregatefinalized}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_content_id` | [`ProposalContentId`](#proposalcontentid) |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `body_instance_id` | [`BodyInstanceId`](#bodyinstanceid) |
  | `ballot_attempt_id` | [`BallotAttemptId`](#ballotattemptid) |
  | `tally` | [`ParliamentAggregateTallyV1`](#parliamentaggregatetallyv1) |
  | `outcome` | [`ParliamentAggregateOutcomeV1`](#parliamentaggregateoutcomev1) |
  | `requires_confirmation` | `bool` |
  | `at_height` | `u64` |

## `GovernanceParliamentApprovalRecorded` {#governanceparliamentapprovalrecorded}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `epoch` | `u64` |
  | `body` | [`ParliamentBody`](#parliamentbody) |
  | `approvals` | `u32` |
  | `required` | `u32` |

## `GovernanceParliamentAttemptCreated` {#governanceparliamentattemptcreated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_content_id` | [`ProposalContentId`](#proposalcontentid) |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `attempt_sequence` | `u32` |
  | `risk_tier` | [`RiskTierV1`](#risktierv1) |
  | `policy_version` | `u64` |
  | `effect_preimage_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `expected_head` | [`GovernanceExpectedHeadV1`](#governanceexpectedheadv1) |
  | `at_height` | `u64` |

## `GovernanceParliamentAttemptTransitioned` {#governanceparliamentattempttransitioned}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_content_id` | [`ProposalContentId`](#proposalcontentid) |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `stage` | [`GovernanceStageV1`](#governancestagev1) |
  | `status` | [`GovernanceAttemptStatusV1`](#governanceattemptstatusv1) |
  | `at_height` | `u64` |

## `GovernanceParliamentBallotTransitioned` {#governanceparliamentballottransitioned}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body_instance_id` | [`BodyInstanceId`](#bodyinstanceid) |
  | `ballot_attempt_id` | [`BallotAttemptId`](#ballotattemptid) |
  | `status` | [`BallotAttemptStatusV1`](#ballotattemptstatusv1) |
  | `at_height` | `u64` |

## `GovernanceParliamentBodyTransitioned` {#governanceparliamentbodytransitioned}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `body_instance_id` | [`BodyInstanceId`](#bodyinstanceid) |
  | `body` | [`ParliamentBody`](#parliamentbody) |
  | `status` | [`BodyInstanceStatusV1`](#bodyinstancestatusv1) |
  | `at_height` | `u64` |

## `GovernanceParliamentCertificateIssued` {#governanceparliamentcertificateissued}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `certificate_id` | [`GovernanceCertificateId`](#governancecertificateid) |
  | `proposal_content_id` | [`ProposalContentId`](#proposalcontentid) |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `certified_at_height` | `u64` |
  | `enact_at_height` | `u64` |

## `GovernanceParliamentConcentrationWarning` {#governanceparliamentconcentrationwarning}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `warning` | [`ParliamentConcentrationWarningV1`](#parliamentconcentrationwarningv1) |
  | `at_height` | `u64` |

## `GovernanceParliamentLifecycleTransitionApplied` {#governanceparliamentlifecycletransitionapplied}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_content_id` | [`ProposalContentId`](#proposalcontentid) |
  | `governance_attempt_id` | [`GovernanceAttemptId`](#governanceattemptid) |
  | `transition_kind` | [`ParliamentLifecycleTransitionKindV1`](#parliamentlifecycletransitionkindv1) |
  | `no_result_kind` | [`Option<ParliamentNoResultKindV1>`](#option-parliamentnoresultkindv1) |
  | `automatic_outcome` | [`Option<ParliamentAutomaticExecutionOutcomeV1>`](#option-parliamentautomaticexecutionoutcomev1) |
  | `transition_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `certificate_id` | [`Option<GovernanceCertificateId>`](#option-governancecertificateid) |
  | `at_height` | `u64` |

## `GovernanceParliamentSelected` {#governanceparliamentselected}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `selection_epoch` | `u64` |
  | `bodies` | [`ParliamentBodies`](#parliamentbodies) |

## `GovernanceProposalApproved` {#governanceproposalapproved}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Array<u8, 32>`](#array-u8-32) |

## `GovernanceProposalCounters` {#governanceproposalcounters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposed` | `u64` |
  | `rejected` | `u64` |
  | `enacted` | `u64` |
  | `superseded` | `u64` |
  | `execution_failed` | `u64` |

## `GovernanceProposalEnacted` {#governanceproposalenacted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Array<u8, 32>`](#array-u8-32) |

## `GovernanceProposalRejected` {#governanceproposalrejected}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Array<u8, 32>`](#array-u8-32) |

## `GovernanceProposalSubmitted` {#governanceproposalsubmitted}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`Array<u8, 32>`](#array-u8-32) |
  | `proposer` | [`AccountId`](#accountid) |
  | `contract_address` | [`Option<ContractAddress>`](#option-contractaddress) |

## `GovernanceProtectedNamespaceCounters` {#governanceprotectednamespacecounters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `total_checks` | `u64` |
  | `allowed` | `u64` |
  | `rejected` | `u64` |

## `GovernanceReferendumClosed` {#governancereferendumclosed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | `String` |
  | `at_height` | `u64` |

## `GovernanceReferendumDecided` {#governancereferendumdecided}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `referendum_id` | `String` |
  | `approve` | `u128` |
  | `reject` | `u128` |
  | `abstain` | `u128` |
  | `approved` | `bool` |

## `GovernanceReferendumOpened` {#governancereferendumopened}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | `String` |
  | `h_start` | `u64` |
  | `h_end` | `u64` |

## `GovernanceSlashReason` {#governanceslashreason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DoubleVote` | &mdash; | 0 |
  | `IneligibleProof` | &mdash; | 1 |
  | `Misconduct` | &mdash; | 2 |
  | `Manual` | &mdash; | 3 |
  | `Restitution` | &mdash; | 4 |

## `GovernanceStageV1` {#governancestagev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Qualification` | &mdash; | 0 |
  | `Rules` | &mdash; | 1 |
  | `Agenda` | &mdash; | 2 |
  | `Interest` | &mdash; | 3 |
  | `Review` | &mdash; | 4 |
  | `Coordination` | &mdash; | 5 |
  | `Mpc` | &mdash; | 6 |
  | `Fma` | &mdash; | 7 |
  | `Oversight` | &mdash; | 8 |
  | `PolicyJury` | &mdash; | 9 |
  | `ConfirmationJury` | &mdash; | 10 |
  | `Certification` | &mdash; | 11 |
  | `Enactment` | &mdash; | 12 |

## `GovernanceStatus` {#governancestatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposals` | [`GovernanceProposalCounters`](#governanceproposalcounters) |
  | `protected_namespace` | [`GovernanceProtectedNamespaceCounters`](#governanceprotectednamespacecounters) |
  | `manifest_admission` | [`GovernanceManifestAdmissionCounters`](#governancemanifestadmissioncounters) |
  | `manifest_quorum` | [`GovernanceManifestQuorumCounters`](#governancemanifestquorumcounters) |
  | `recent_manifest_activations` | [`Vec<GovernanceManifestActivation>`](#vec-governancemanifestactivation) |
  | `sealed_lanes_total` | `u32` |
  | `sealed_lane_aliases` | [`Vec<String>`](#vec-string) |
  | `citizens_total` | `u64` |

## `GovernanceTag` {#governancetag}

**Type:** Alias

**To:** `String`

## `GovernanceThresholdKeyLifecycleAppliedV1` {#governancethresholdkeylifecycleappliedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `action` | [`ThresholdKeyLifecycleActionV1`](#thresholdkeylifecycleactionv1) |
  | `session_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `transcript_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `effective_height` | `u64` |

## `GroupBinding` {#groupbinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `composability_group_id` | [`Vec<u8>`](#vec-u8) |
  | `epoch_id` | `u64` |

## `Halo2Status` {#halo2status}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `enabled` | `bool` |
  | `curve` | `String` |
  | `backend` | `String` |
  | `max_k` | `u32` |
  | `verifier_budget_ms` | `u64` |
  | `verifier_max_batch` | `u32` |

## `HandleBudget` {#handlebudget}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `remaining` | [`Quantity`](#quantity) |
  | `per_use` | [`Option<Quantity>`](#option-quantity) |

## `HandleSubject` {#handlesubject}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | `String` |
  | `origin_dsid` | [`Option<DataSpaceId>`](#option-dataspaceid) |

## `Hash` {#hash}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `HashOf<Array<u8, 32>>` {#hashof-array-u8-32}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<BlockExecutionContextBundle>` {#hashof-blockexecutioncontextbundle}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<BlockHeader>` {#hashof-blockheader}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<DaCommitmentBundle>` {#hashof-dacommitmentbundle}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<DaPinIntentBundle>` {#hashof-dapinintentbundle}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<DaProofPolicyBundle>` {#hashof-daproofpolicybundle}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<HeightContext>` {#hashof-heightcontext}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<LaneBlockCommitment>` {#hashof-laneblockcommitment}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<LaneFinalityStatement>` {#hashof-lanefinalitystatement}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<MergeLedgerEntry>` {#hashof-mergeledgerentry}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<MerkleTree<LaneFinalityStatement>>` {#hashof-merkletree-lanefinalitystatement}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<MerkleTree<TransactionEntrypoint>>` {#hashof-merkletree-transactionentrypoint}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<MerkleTree<TransactionResult>>` {#hashof-merkletree-transactionresult}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<NposConsensusEffects>` {#hashof-nposconsensuseffects}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<ObservationBody>` {#hashof-observationbody}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<SignedTransaction>` {#hashof-signedtransaction}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<TransactionEntrypoint>` {#hashof-transactionentrypoint}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<TransactionResult>` {#hashof-transactionresult}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<V2FinalityArtifact>` {#hashof-v2finalityartifact}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<Vec<InstructionBox>>` {#hashof-vec-instructionbox}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HashOf<Vec<PeerId>>` {#hashof-vec-peerid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `HeightContext` {#heightcontext}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `protocol_version` | `u16` |
  | `height` | `u64` |
  | `epoch` | `u64` |
  | `epoch_end_height` | `u64` |
  | `next_epoch_snapshot` | [`Option<FinalizedNextEpochSnapshot>`](#option-finalizednextepochsnapshot) |
  | `mode` | [`ConsensusMode`](#consensusmode) |
  | `parent_commit_qc` | [`Option<QuorumCertificate>`](#option-quorumcertificate) |
  | `snapshot_bootstrap` | [`Option<SnapshotBootstrapAnchor>`](#option-snapshotbootstrapanchor) |
  | `roster` | [`Vec<ValidatorPower>`](#vec-validatorpower) |
  | `quorum` | [`DualQuorum`](#dualquorum) |
  | `nexus_amx_context_hash` | [`Hash`](#hash) |
  | `execution_policy_hash` | [`Hash`](#hash) |
  | `da_layout` | [`DataAvailabilityLayout`](#dataavailabilitylayout) |
  | `leader_seed` | [`Array<u8, 32>`](#array-u8-32) |

## `HeightContextId` {#heightcontextid}

**Type:** Alias

**To:** [`HashOf<HeightContext>`](#hashof-heightcontext)

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

## `IpfsPath` {#ipfspath}

**Type:** Alias

**To:** `String`

## `Ipv4Addr` {#ipv4addr}

**Type:** Alias

**To:** [`Array<u8, 4>`](#array-u8-4)

## `Ipv6Addr` {#ipv6addr}

**Type:** Alias

**To:** [`Array<u16, 8>`](#array-u16-8)

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

## `IvmBytecode` {#ivmbytecode}

**Type:** Alias

**To:** [`Vec<u8>`](#vec-u8)

## `IvmExecutionFail` {#ivmexecutionfail}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |

## `IvmProved` {#ivmproved}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `bytecode` | [`IvmBytecode`](#ivmbytecode) |
  | `overlay` | [`Vec<InstructionBox>`](#vec-instructionbox) |
  | `events_commitment` | [`Hash`](#hash) |
  | `gas_policy_commitment` | [`Hash`](#hash) |

## `Json` {#json}

**Type:** Alias

**To:** `String`

## `KaigiId` {#kaigiid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain_id` | [`DomainId`](#domainid) |
  | `call_name` | [`Name`](#name) |

## `KaigiPrivacyMode` {#kaigiprivacymode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transparent` | &mdash; | 0 |
  | `ZkRosterV1` | &mdash; | 1 |

## `KaigiRelayHealthStatus` {#kaigirelayhealthstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Healthy` | &mdash; | 0 |
  | `Degraded` | &mdash; | 1 |
  | `Unavailable` | &mdash; | 2 |

## `KaigiRelayHealthSummary` {#kaigirelayhealthsummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `call` | [`KaigiId`](#kaigiid) |
  | `relay` | [`AccountId`](#accountid) |
  | `status` | [`KaigiRelayHealthStatus`](#kaigirelayhealthstatus) |
  | `reported_at_ms` | `u64` |

## `KaigiRelayManifestSummary` {#kaigirelaymanifestsummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `call` | [`KaigiId`](#kaigiid) |
  | `hop_count` | `u32` |
  | `expiry_ms` | `u64` |

## `KaigiRelayRegistrationSummary` {#kaigirelayregistrationsummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `relay` | [`AccountId`](#accountid) |
  | `bandwidth_class` | `u8` |
  | `hpke_fingerprint` | [`Hash`](#hash) |

## `KaigiRelayUnregistrationSummary` {#kaigirelayunregistrationsummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `relay` | [`AccountId`](#accountid) |

## `KaigiRosterSummary` {#kaigirostersummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `call` | [`KaigiId`](#kaigiid) |
  | `privacy_mode` | [`KaigiPrivacyMode`](#kaigiprivacymode) |
  | `participant_count` | `u32` |
  | `commitment_count` | `u32` |
  | `nullifier_count` | `u32` |
  | `roster_root` | [`Option<Hash>`](#option-hash) |

## `KaigiStatus` {#kaigistatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Active` | &mdash; | 0 |
  | `Ended` | &mdash; | 1 |

## `KaigiStatusSummary` {#kaigistatussummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `call` | [`KaigiId`](#kaigiid) |
  | `status` | [`KaigiStatus`](#kaigistatus) |
  | `ended_at_ms` | [`Option<u64>`](#option-u64) |

## `KaigiUsageSummary` {#kaigiusagesummary}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `call` | [`KaigiId`](#kaigiid) |
  | `total_duration_ms` | `u64` |
  | `total_billed_gas` | `u64` |
  | `segments_recorded` | `u32` |

## `KeyedHash` {#keyedhash}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `pepper_id` | `String` |
  | `digest` | [`Hash`](#hash) |

## `KotobaTranslation` {#kotobatranslation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lang` | `String` |
  | `text` | `String` |

## `KotobaTranslationEntry` {#kotobatranslationentry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `msg_id` | `String` |
  | `translations` | [`Vec<KotobaTranslation>`](#vec-kotobatranslation) |

## `LaneBlockCommitment` {#laneblockcommitment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_height` | `u64` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `tx_count` | `u64` |
  | `total_local_amount` | [`Quantity`](#quantity) |
  | `total_xor_due` | [`Quantity`](#quantity) |
  | `total_xor_after_haircut` | [`Quantity`](#quantity) |
  | `total_xor_variance` | [`Quantity`](#quantity) |
  | `swap_metadata` | [`Option<LaneSwapMetadata>`](#option-laneswapmetadata) |
  | `receipts` | [`Vec<LaneSettlementReceipt>`](#vec-lanesettlementreceipt) |
  | `nexus_fee_receipts` | [`Vec<NexusFeeReceipt>`](#vec-nexusfeereceipt) |
  | `native_amx_receipts` | [`Vec<NativeAmxReceipt>`](#vec-nativeamxreceipt) |

## `LaneBlockDescriptorV1` {#laneblockdescriptorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `proposal_height` | `u64` |
  | `previous_lane_block_height` | `u64` |
  | `previous_lane_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `lane_block_height` | `u64` |
  | `lane_block_view` | `u64` |
  | `subject_hash` | [`Hash`](#hash) |
  | `payload_ownership_hash` | [`Hash`](#hash) |
  | `rbc_instance_hash` | [`Hash`](#hash) |
  | `accepted_candidate_indices` | [`Vec<u64>`](#vec-u64) |
  | `accepted_transaction_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `validator_count` | `u32` |
  | `min_quorum` | `u32` |
  | `qc_mode_tag` | `String` |
  | `descriptor_hash` | [`Hash`](#hash) |

## `LaneBlockProposalPayloadHintV1` {#laneblockproposalpayloadhintv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_height` | `u64` |
  | `proposal_view` | `u64` |
  | `proposal_block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |

## `LaneBlockProposalV1` {#laneblockproposalv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `descriptor` | [`LaneBlockDescriptorV1`](#laneblockdescriptorv1) |
  | `proposal_hash` | [`Hash`](#hash) |
  | `payload_block_hint` | [`Option<LaneBlockProposalPayloadHintV1>`](#option-laneblockproposalpayloadhintv1) |

## `LaneBlockQcV1` {#laneblockqcv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`LaneBlockVoteBodyV1`](#laneblockvotebodyv1) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `signers_bitmap` | [`Vec<u8>`](#vec-u8) |
  | `bls_aggregate_signature` | [`Vec<u8>`](#vec-u8) |
  | `payload_availability_qc` | [`Option<LanePayloadAvailabilityQcV1>`](#option-lanepayloadavailabilityqcv1) |

## `LaneBlockVoteBodyV1` {#laneblockvotebodyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `phase` | [`CertPhase`](#certphase) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `proposal_height` | `u64` |
  | `lane_block_height` | `u64` |
  | `lane_block_view` | `u64` |
  | `proposal_hash` | [`Hash`](#hash) |
  | `descriptor_hash` | [`Hash`](#hash) |
  | `subject_hash` | [`Hash`](#hash) |
  | `payload_ownership_hash` | [`Hash`](#hash) |
  | `rbc_instance_hash` | [`Hash`](#hash) |
  | `accepted_candidate_indices` | [`Vec<u64>`](#vec-u64) |
  | `accepted_transaction_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_count` | `u32` |
  | `min_quorum` | `u32` |
  | `qc_mode_tag` | `String` |

## `LaneCommitmentId` {#lanecommitmentid}

**Type:** Alias

**To:** `u16`

## `LaneDrainCertificateBodyV1` {#lanedraincertificatebodyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `intent` | [`LaneDrainIntentV1`](#lanedrainintentv1) |
  | `final_frontier` | [`LaneDrainFrontierV1`](#lanedrainfrontierv1) |

## `LaneDrainCertificateV1` {#lanedraincertificatev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`LaneDrainCertificateBodyV1`](#lanedraincertificatebodyv1) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `signers_bitmap` | [`Vec<u8>`](#vec-u8) |
  | `signer_proofs` | [`Vec<MergeSignerProof>`](#vec-mergesignerproof) |
  | `aggregate_signature` | [`Vec<u8>`](#vec-u8) |

## `LaneDrainFrontierV1` {#lanedrainfrontierv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `lane_block_height` | `u64` |
  | `lane_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `native_application` | [`Option<LaneDrainNativeFrontierEvidenceV1>`](#option-lanedrainnativefrontierevidencev1) |
  | `unresolved_evidence_root` | [`Hash`](#hash) |

## `LaneDrainIntentV1` {#lanedrainintentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `close_global_height` | `u64` |
  | `initial_frontier` | [`LaneDrainFrontierV1`](#lanedrainfrontierv1) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `validator_count` | `u32` |
  | `min_quorum` | `u32` |

## `LaneDrainNativeFrontierEvidenceV1` {#lanedrainnativefrontierevidencev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `participant_view` | `u64` |
  | `predecessor_height` | `u64` |
  | `predecessor_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `participant_proposal_hash` | [`Hash`](#hash) |
  | `participant_settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `source_count` | `u32` |
  | `application_block_height` | `u64` |
  | `application_block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `executed_block_wire_hash` | [`Hash`](#hash) |
  | `finality_artifact_hash` | [`HashOf<V2FinalityArtifact>`](#hashof-v2finalityartifact) |
  | `application_manifest_root` | [`Hash`](#hash) |
  | `application_manifest_leaf_count` | `u32` |
  | `application_manifest_leaf_index` | `u32` |
  | `manifest_artifact_hash` | [`Hash`](#hash) |
  | `receipt_artifact_hash` | [`Hash`](#hash) |
  | `latest_index_artifact_hash` | [`Hash`](#hash) |

## `LaneFastpqProofMaterial` {#lanefastpqproofmaterial}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proof_digest` | [`Hash`](#hash) |
  | `verified_at_height` | `u64` |

## `LaneFinalityAuthorityV1` {#lanefinalityauthorityv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `global_block_height` | `u64` |
  | `finality_artifact_hash` | [`HashOf<V2FinalityArtifact>`](#hashof-v2finalityartifact) |
  | `statement_proof` | [`MerkleProof<LaneFinalityStatement>`](#merkleproof-lanefinalitystatement) |

## `LaneFinalityStatement` {#lanefinalitystatement}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `block_height` | `u64` |
  | `block_header_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `da_commitment_hash` | [`Option<HashOf<DaCommitmentBundle>>`](#option-hashof-dacommitmentbundle) |
  | `lane_block_descriptor_hash` | [`Hash`](#hash) |
  | `manifest_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `settlement_commitment` | [`LaneBlockCommitment`](#laneblockcommitment) |
  | `settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `rbc_bytes_total` | `u64` |

## `LaneId` {#laneid}

**Type:** Alias

**To:** `u32`

## `LaneLiquidityProfile` {#laneliquidityprofile}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Tier1` | &mdash; | 0 |
  | `Tier2` | &mdash; | 1 |
  | `Tier3` | &mdash; | 2 |

## `LanePayloadAvailabilityBodyV1` {#lanepayloadavailabilitybodyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `epoch` | `u64` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `proposal_height` | `u64` |
  | `lane_block_height` | `u64` |
  | `origin_lane_block_view` | `u64` |
  | `origin_proposal_hash` | [`Hash`](#hash) |
  | `origin_descriptor_hash` | [`Hash`](#hash) |
  | `current_lane_block_view` | `u64` |
  | `current_proposal_hash` | [`Hash`](#hash) |
  | `current_descriptor_hash` | [`Hash`](#hash) |
  | `current_subject_hash` | [`Hash`](#hash) |
  | `current_payload_ownership_hash` | [`Hash`](#hash) |
  | `current_rbc_instance_hash` | [`Hash`](#hash) |
  | `executable_payload_hash` | [`Hash`](#hash) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_count` | `u32` |
  | `min_quorum` | `u32` |
  | `qc_mode_tag` | `String` |

## `LanePayloadAvailabilityQcV1` {#lanepayloadavailabilityqcv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`LanePayloadAvailabilityBodyV1`](#lanepayloadavailabilitybodyv1) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `validator_set_pops` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `signers_bitmap` | [`Vec<u8>`](#vec-u8) |
  | `bls_aggregate_signature` | [`Vec<u8>`](#vec-u8) |

## `LanePrivacyMerkleWitness` {#laneprivacymerklewitness}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leaf` | [`Array<u8, 32>`](#array-u8-32) |
  | `proof` | [`MerkleProof<Array<u8, 32>>`](#merkleproof-array-u8-32) |

## `LanePrivacyProof` {#laneprivacyproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `commitment_id` | [`LaneCommitmentId`](#lanecommitmentid) |
  | `witness` | [`LanePrivacyWitness`](#laneprivacywitness) |

## `LanePrivacyWitness` {#laneprivacywitness}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `merkle` | [`LanePrivacyMerkleWitness`](#laneprivacymerklewitness) | 0 |

## `LaneRelayEnvelope` {#lanerelayenvelope}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `block_height` | `u64` |
  | `block_header` | [`BlockHeader`](#blockheader) |
  | `finality_authority` | [`Option<LaneFinalityAuthorityV1>`](#option-lanefinalityauthorityv1) |
  | `da_commitment_hash` | [`Option<HashOf<DaCommitmentBundle>>`](#option-hashof-dacommitmentbundle) |
  | `lane_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `settlement_commitment` | [`LaneBlockCommitment`](#laneblockcommitment) |
  | `settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `rbc_bytes_total` | `u64` |
  | `manifest_root` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `fastpq_proof` | [`Option<LaneFastpqProofMaterial>`](#option-lanefastpqproofmaterial) |

## `LaneRelayEnvelopeRef` {#lanerelayenveloperef}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `block_height` | `u64` |

## `LaneSettlementReceipt` {#lanesettlementreceipt}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `local_amount` | [`Quantity`](#quantity) |
  | `xor_due` | [`Quantity`](#quantity) |
  | `xor_after_haircut` | [`Quantity`](#quantity) |
  | `xor_variance` | [`Quantity`](#quantity) |
  | `timestamp_ms` | `u64` |

## `LaneSwapMetadata` {#laneswapmetadata}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `epsilon_bps` | `u16` |
  | `twap_window_seconds` | `u32` |
  | `liquidity_profile` | [`LaneLiquidityProfile`](#laneliquidityprofile) |
  | `twap_local_per_xor` | [`Numeric`](#numeric) |
  | `volatility_class` | [`LaneVolatilityClass`](#lanevolatilityclass) |

## `LaneVolatilityClass` {#lanevolatilityclass}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Stable` | &mdash; | 0 |
  | `Elevated` | &mdash; | 1 |
  | `Dislocated` | &mdash; | 2 |

## `ManifestAbiHashMismatchInfo` {#manifestabihashmismatchinfo}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`Hash`](#hash) |
  | `actual` | [`Hash`](#hash) |

## `ManifestAliasBinding` {#manifestaliasbinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `namespace` | `String` |
  | `proof` | [`Vec<u8>`](#vec-u8) |

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

## `ManifestProvenance` {#manifestprovenance}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | [`PublicKey`](#publickey) |
  | `signature` | [`Signature`](#signature) |

## `ManifestRootCid` {#manifestrootcid}

**Type:** Alias

**To:** [`Array<u8, 36>`](#array-u8-36)

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

## `MergeCarrierCommitmentV1` {#mergecarriercommitmentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `entry_hash` | [`HashOf<MergeLedgerEntry>`](#hashof-mergeledgerentry) |

## `MergeExecutionBatch` {#mergeexecutionbatch}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `base_state_height` | `u64` |
  | `base_state_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `application_block_header` | [`BlockHeader`](#blockheader) |
  | `lanes` | [`Vec<MergeLaneExecution>`](#vec-mergelaneexecution) |
  | `entrypoint_count` | `u64` |
  | `entrypoint_merkle_root` | [`HashOf<MerkleTree<TransactionEntrypoint>>`](#hashof-merkletree-transactionentrypoint) |
  | `result_merkle_root` | [`HashOf<MerkleTree<TransactionResult>>`](#hashof-merkletree-transactionresult) |
  | `execution_root` | [`Hash`](#hash) |
  | `application_write_set_root` | [`Hash`](#hash) |
  | `write_set_root` | [`Hash`](#hash) |
  | `expected_post_state_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `batch_hash` | [`Hash`](#hash) |

## `MergeLaneBinding` {#mergelanebinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_config_hash` | [`Hash`](#hash) |
  | `incarnation` | [`Hash`](#hash) |
  | `activation_height` | `u64` |

## `MergeLaneExecution` {#mergelaneexecution}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source_bundle` | [`Vec<u8>`](#vec-u8) |
  | `source_bundle_hash` | [`Hash`](#hash) |
  | `proposal` | [`LaneBlockProposalV1`](#laneblockproposalv1) |
  | `origin_proposal` | [`LaneBlockProposalV1`](#laneblockproposalv1) |
  | `prepare_qc` | [`LaneBlockQcV1`](#laneblockqcv1) |
  | `commit_qc` | [`LaneBlockQcV1`](#laneblockqcv1) |
  | `signer_proofs` | [`Vec<MergeLaneSignerProof>`](#vec-mergelanesignerproof) |
  | `autonomous_network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `autonomous_epoch` | `u64` |
  | `autonomous_payload_hash` | [`Hash`](#hash) |
  | `entrypoint_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `entrypoints` | [`Vec<TransactionEntrypoint>`](#vec-transactionentrypoint) |
  | `reservation_keys` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `routing_plans` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `native_amx_receipts` | [`Vec<Option<NativeAmxReceipt>>`](#vec-option-nativeamxreceipt) |
  | `result_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `results` | [`Vec<TransactionResult>`](#vec-transactionresult) |
  | `settlement_commitment` | [`LaneBlockCommitment`](#laneblockcommitment) |
  | `settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `fastpq_transcripts` | [`MergeLaneFastpqTranscripts`](#mergelanefastpqtranscripts) |

## `MergeLaneFastpqTranscripts` {#mergelanefastpqtranscripts}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `fastpq_transcripts` | [`Vec<TransferTranscriptBundle>`](#vec-transfertranscriptbundle) |

## `MergeLaneSignerProof` {#mergelanesignerproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |
  | `proof_of_possession` | [`Vec<u8>`](#vec-u8) |

## `MergeLaneSnapshot` {#mergelanesnapshot}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `incarnation_activation_height` | `u64` |
  | `proposal_height` | `u64` |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_block_height` | `u64` |
  | `tip_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `merge_hint_root` | [`Hash`](#hash) |
  | `settlement_commitment` | [`LaneBlockCommitment`](#laneblockcommitment) |
  | `settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `relay_envelope` | [`Option<LaneRelayEnvelope>`](#option-lanerelayenvelope) |

## `MergeLedgerEntry` {#mergeledgerentry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `epoch_id` | `u64` |
  | `lane_catalog_hash` | [`Hash`](#hash) |
  | `active_lanes` | [`Vec<MergeLaneBinding>`](#vec-mergelanebinding) |
  | `incarnation_root` | [`Hash`](#hash) |
  | `activation_root` | [`Hash`](#hash) |
  | `lane_snapshots` | [`Vec<MergeLaneSnapshot>`](#vec-mergelanesnapshot) |
  | `global_state_root` | [`Hash`](#hash) |
  | `merge_qc` | [`MergeQuorumCertificate`](#mergequorumcertificate) |
  | `execution_batch` | [`Option<MergeExecutionBatch>`](#option-mergeexecutionbatch) |
  | `lane_drain_certificates` | [`Vec<LaneDrainCertificateV1>`](#vec-lanedraincertificatev1) |

## `MergeLedgerEvent` {#mergeledgerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `entry` | [`MergeLedgerEntry`](#mergeledgerentry) |

## `MergeLedgerEventFilter` {#mergeledgereventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `epoch_id` | [`Option<u64>`](#option-u64) |

## `MergeQuorumCertificate` {#mergequorumcertificate}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `view` | `u64` |
  | `epoch_id` | `u64` |
  | `carrier_height` | `u64` |
  | `carrier_parent_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `signers_bitmap` | [`Vec<u8>`](#vec-u8) |
  | `signer_proofs` | [`Vec<MergeSignerProof>`](#vec-mergesignerproof) |
  | `aggregate_signature` | [`Vec<u8>`](#vec-u8) |
  | `message_digest` | [`Hash`](#hash) |

## `MergeSignerProof` {#mergesignerproof}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | `u32` |
  | `proof_of_possession` | [`Vec<u8>`](#vec-u8) |

## `MerkleProof<Array<u8, 32>>` {#merkleproof-array-u8-32}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leaf_index` | `u32` |
  | `audit_path` | [`Vec<Option<HashOf<Array<u8, 32>>>>`](#vec-option-hashof-array-u8-32) |

## `MerkleProof<LaneFinalityStatement>` {#merkleproof-lanefinalitystatement}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leaf_index` | `u32` |
  | `audit_path` | [`Vec<Option<HashOf<LaneFinalityStatement>>>`](#vec-option-hashof-lanefinalitystatement) |

## `MerkleProof<TransactionEntrypoint>` {#merkleproof-transactionentrypoint}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leaf_index` | `u32` |
  | `audit_path` | [`Vec<Option<HashOf<TransactionEntrypoint>>>`](#vec-option-hashof-transactionentrypoint) |

## `MerkleProof<TransactionResult>` {#merkleproof-transactionresult}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `leaf_index` | `u32` |
  | `audit_path` | [`Vec<Option<HashOf<TransactionResult>>>`](#vec-option-hashof-transactionresult) |

## `MerkleTree<SignedTransaction>` {#merkletree-signedtransaction}

**Type:** Tuple

**Values:** (`u8`, [`Vec<HashOf<SignedTransaction>>`](#vec-hashof-signedtransaction))

## `MerkleTree<TransactionEntrypoint>` {#merkletree-transactionentrypoint}

**Type:** Tuple

**Values:** (`u8`, [`Vec<HashOf<TransactionEntrypoint>>`](#vec-hashof-transactionentrypoint))

## `MerkleTree<TransactionResult>` {#merkletree-transactionresult}

**Type:** Tuple

**Values:** (`u8`, [`Vec<HashOf<TransactionResult>>`](#vec-hashof-transactionresult))

## `MerkleTreeCommitment<LaneFinalityStatement>` {#merkletreecommitment-lanefinalitystatement}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `root` | [`HashOf<MerkleTree<LaneFinalityStatement>>`](#hashof-merkletree-lanefinalitystatement) |
  | `leaf_count` | [`NonZero<u64>`](#nonzero-u64) |

## `Metadata` {#metadata}

**Type:** Alias

**To:** [`SortedMap<Name, Json>`](#sortedmap-name-json)

## `MetadataChanged<AccountId>` {#metadatachanged-accountid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`AccountId`](#accountid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<AssetDefinitionId>` {#metadatachanged-assetdefinitionid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<AssetId>` {#metadatachanged-assetid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`AssetId`](#assetid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<DomainId>` {#metadatachanged-domainid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`DomainId`](#domainid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<NftId>` {#metadatachanged-nftid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`NftId`](#nftid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<RwaId>` {#metadatachanged-rwaid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`RwaId`](#rwaid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MetadataChanged<TriggerId>` {#metadatachanged-triggerid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `target` | [`TriggerId`](#triggerid) |
  | `key` | [`Name`](#name) |
  | `value` | [`Json`](#json) |

## `MintabilityError` {#mintabilityerror}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MintUnmintable` | &mdash; | 0 |
  | `ForbidMintOnMintable` | &mdash; | 1 |
  | `InvalidMintabilityTokens` | `u32` | 2 |

## `MintabilityTokens` {#mintabilitytokens}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `value` | `u32` |

## `Mintable` {#mintable}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Infinitely` | &mdash; | 0 |
  | `Once` | &mdash; | 1 |
  | `Not` | &mdash; | 2 |
  | `Limited` | [`MintabilityTokens`](#mintabilitytokens) | 3 |

## `Mismatch<NumericSpec>` {#mismatch-numericspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `expected` | [`NumericSpec`](#numericspec) |
  | `actual` | [`NumericSpec`](#numericspec) |

## `ModerationAppealIntakeV1` {#moderationappealintakev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `appellant` | [`AccountId`](#accountid) |
  | `appealed_decision_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `proof_token_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `evidence_bundle_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `appeal_deposit_lock_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `appeal_finance_config_version` | `String` |
  | `policy_reference` | `String` |
  | `evidence_uri` | [`Option<String>`](#option-string) |
  | `panel_size` | `u16` |
  | `waitlist_size` | `u16` |
  | `quorum` | `u16` |
  | `exclusions` | [`Vec<AccountId>`](#vec-accountid) |
  | `registration_deadline_unix_ms` | `u64` |
  | `acceptance_deadline_unix_ms` | `u64` |
  | `commit_deadline_unix_ms` | `u64` |
  | `challenge_submission_deadline_unix_ms` | `u64` |
  | `challenge_resolution_deadline_unix_ms` | `u64` |
  | `reveal_deadline_unix_ms` | `u64` |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `ModerationAppealRecordV1` {#moderationappealrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `intake` | [`ModerationAppealIntakeV1`](#moderationappealintakev1) |
  | `intake_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `policy` | [`ModerationLedgerPolicyV1`](#moderationledgerpolicyv1) |
  | `pop_snapshot` | [`ModerationPoPRegistrySnapshotV1`](#moderationpopregistrysnapshotv1) |
  | `pop_snapshot_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `status` | [`ModerationAppealStatusV1`](#moderationappealstatusv1) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `submitted_at_unix_ms` | `u64` |
  | `eligible_jurors` | [`Vec<AccountId>`](#vec-accountid) |
  | `selection` | [`Option<ModerationPanelSelectionV1>`](#option-moderationpanelselectionv1) |
  | `accepted_jurors` | [`Vec<AccountId>`](#vec-accountid) |
  | `replacements` | [`Vec<ModerationJurorReplacementV1>`](#vec-moderationjurorreplacementv1) |
  | `activated_at_unix_ms` | [`Option<u64>`](#option-u64) |
  | `finalized_at_unix_ms` | [`Option<u64>`](#option-u64) |

## `ModerationAppealStatusV1` {#moderationappealstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `registering_jurors` | &mdash; | 0 |
  | `awaiting_acceptance` | &mdash; | 1 |
  | `ballot_open` | &mdash; | 2 |
  | `insufficient_eligible_pool` | &mdash; | 3 |
  | `failover_exhausted` | &mdash; | 4 |
  | `finalized` | &mdash; | 5 |

## `ModerationCaseRecordV1` {#moderationcaserecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `spec` | [`ModerationCaseSpecV1`](#moderationcasespecv1) |
  | `policy` | [`ModerationLedgerPolicyV1`](#moderationledgerpolicyv1) |
  | `status` | [`ModerationCaseStatusV1`](#moderationcasestatusv1) |
  | `opened_at_unix_ms` | `u64` |
  | `opened_by` | [`AccountId`](#accountid) |
  | `commitment_count` | `u32` |
  | `reveal_count` | `u32` |
  | `challenge_count` | `u32` |
  | `challenge_ids` | [`Vec<String>`](#vec-string) |
  | `pending_challenge_count` | `u32` |
  | `accepted_challenge_count` | `u32` |
  | `expired_challenge_count` | `u32` |

## `ModerationCaseSpecV1` {#moderationcasespecv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `context` | [`SoraFsModerationBallotContextV1`](#sorafsmoderationballotcontextv1) |
  | `round_id` | `String` |
  | `jurors` | [`Vec<AccountId>`](#vec-accountid) |
  | `quorum` | `u16` |
  | `commit_deadline_unix_ms` | `u64` |
  | `challenge_submission_deadline_unix_ms` | `u64` |
  | `challenge_resolution_deadline_unix_ms` | `u64` |
  | `reveal_deadline_unix_ms` | `u64` |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `ModerationCaseStatusV1` {#moderationcasestatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `open` | &mdash; | 0 |
  | `challenged` | &mdash; | 1 |
  | `finalized` | &mdash; | 2 |

## `ModerationChallengeBondV1` {#moderationchallengebondv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `amount` | [`Quantity`](#quantity) |
  | `escrow_account` | [`AccountId`](#accountid) |
  | `slash_receiver_account` | [`AccountId`](#accountid) |
  | `refunded_amount` | [`Quantity`](#quantity) |
  | `slashed_amount` | [`Quantity`](#quantity) |
  | `settled_at_unix_ms` | [`Option<u64>`](#option-u64) |

## `ModerationChallengeDecisionV1` {#moderationchallengedecisionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `rejected` | &mdash; | 0 |
  | `accepted` | &mdash; | 1 |
  | `expired` | &mdash; | 2 |

## `ModerationChallengeKindV1` {#moderationchallengekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `roster_mismatch` | &mdash; | 0 |
  | `duplicate_commit` | &mdash; | 1 |
  | `payload_mismatch` | &mdash; | 2 |
  | `juror_eligibility` | &mdash; | 3 |
  | `evidence_mismatch` | &mdash; | 4 |
  | `other` | &mdash; | 5 |

## `ModerationChallengeRecordV1` {#moderationchallengerecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `challenge_id` | `String` |
  | `challenger` | [`AccountId`](#accountid) |
  | `kind` | [`ModerationChallengeKindV1`](#moderationchallengekindv1) |
  | `target_juror` | [`Option<AccountId>`](#option-accountid) |
  | `evidence_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `reason` | `String` |
  | `raised_at_unix_ms` | `u64` |
  | `bond` | [`ModerationChallengeBondV1`](#moderationchallengebondv1) |
  | `decision` | [`Option<ModerationChallengeDecisionV1>`](#option-moderationchallengedecisionv1) |
  | `resolved_by` | [`Option<AccountId>`](#option-accountid) |
  | `resolved_at_unix_ms` | [`Option<u64>`](#option-u64) |

## `ModerationCommitRecordV1` {#moderationcommitrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |
  | `canonical_commit` | [`Vec<u8>`](#vec-u8) |
  | `accepted_at_unix_ms` | `u64` |

## `ModerationFinalizedAppealViewV1` {#moderationfinalizedappealviewv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `appeal` | [`ModerationAppealRecordV1`](#moderationappealrecordv1) |
  | `eligibility` | [`Vec<ModerationJurorEligibilityRecordV1>`](#vec-moderationjuroreligibilityrecordv1) |

## `ModerationFinalizedCaseViewV1` {#moderationfinalizedcaseviewv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case` | [`ModerationCaseRecordV1`](#moderationcaserecordv1) |
  | `commits` | [`Vec<ModerationCommitRecordV1>`](#vec-moderationcommitrecordv1) |
  | `reveals` | [`Vec<ModerationRevealRecordV1>`](#vec-moderationrevealrecordv1) |
  | `challenges` | [`Vec<ModerationChallengeRecordV1>`](#vec-moderationchallengerecordv1) |
  | `outcome` | [`Option<ModerationOutcomeRecordV1>`](#option-moderationoutcomerecordv1) |
  | `no_shows` | [`Vec<ModerationNoShowRecordV1>`](#vec-moderationnoshowrecordv1) |

## `ModerationFinalizedCursorV1` {#moderationfinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `ModerationFinalizedEventCursorV1` {#moderationfinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `ModerationFinalizedEventPageV1` {#moderationfinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ModerationFinalizedCursorV1`](#moderationfinalizedcursorv1) |
  | `events` | [`Vec<ModerationFinalizedEventV1>`](#vec-moderationfinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<ModerationFinalizedEventCursorV1>`](#option-moderationfinalizedeventcursorv1) |

## `ModerationFinalizedEventV1` {#moderationfinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `event` | [`SorafsModerationLedgerEvent`](#sorafsmoderationledgerevent) |

## `ModerationFinalizedLedgerSnapshotV1` {#moderationfinalizedledgersnapshotv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `finalized_height` | `u64` |
  | `finalized_block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `finalized_at_unix_ms` | `u64` |
  | `policy` | [`Option<ModerationLedgerPolicyRecord>`](#option-moderationledgerpolicyrecord) |
  | `status` | [`Option<ModerationLedgerStatusV1>`](#option-moderationledgerstatusv1) |
  | `appeals` | [`Vec<ModerationFinalizedAppealViewV1>`](#vec-moderationfinalizedappealviewv1) |
  | `cases` | [`Vec<ModerationFinalizedCaseViewV1>`](#vec-moderationfinalizedcaseviewv1) |
  | `events` | [`Vec<ModerationFinalizedEventV1>`](#vec-moderationfinalizedeventv1) |

## `ModerationJurorEligibilityClassV1` {#moderationjuroreligibilityclassv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `general` | &mdash; | 0 |
  | `regional` | &mdash; | 1 |
  | `expert` | &mdash; | 2 |
  | `emergency` | &mdash; | 3 |
  | `observer` | &mdash; | 4 |

## `ModerationJurorEligibilityRecordV1` {#moderationjuroreligibilityrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |
  | `eligibility_class` | [`ModerationJurorEligibilityClassV1`](#moderationjuroreligibilityclassv1) |
  | `proof_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `nullifier` | [`Array<u8, 32>`](#array-u8-32) |
  | `pop_snapshot_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `credential_expires_at_epoch` | `u64` |
  | `registered_at_unix_ms` | `u64` |

## `ModerationJurorReplacementV1` {#moderationjurorreplacementv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `absent_juror` | [`AccountId`](#accountid) |
  | `replacement_juror` | [`AccountId`](#accountid) |

## `ModerationLedgerPolicyRecord` {#moderationledgerpolicyrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`ModerationLedgerPolicyV1`](#moderationledgerpolicyv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `activated_at_unix_ms` | `u64` |
  | `activated_by` | [`AccountId`](#accountid) |

## `ModerationLedgerPolicyV1` {#moderationledgerpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `revision` | `u64` |
  | `predecessor_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `challenge_voting_asset_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `challenge_bond_amount` | [`Quantity`](#quantity) |
  | `challenge_escrow_account` | [`AccountId`](#accountid) |
  | `challenge_slash_receiver_account` | [`AccountId`](#accountid) |
  | `challenge_rejected_slash_bps` | `u16` |
  | `challenge_resolution_grace_ms` | `u64` |
  | `max_panel_size` | `u16` |
  | `max_candidate_pool_size` | `u16` |
  | `max_waitlist_size` | `u16` |
  | `max_exclusions_per_case` | `u16` |
  | `max_total_window_ms` | `u64` |
  | `max_challenges_per_case` | `u16` |
  | `missing_commit_penalty_points` | `u32` |
  | `unrevealed_commit_penalty_points` | `u32` |

## `ModerationLedgerStatusV1` {#moderationledgerstatusv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `appeal_intakes` | `u64` |
  | `eligibility_proofs` | `u64` |
  | `panel_selections` | `u64` |
  | `assignment_acceptances` | `u64` |
  | `failover_replacements` | `u64` |
  | `failed_panel_formations` | `u64` |
  | `open_cases` | `u64` |
  | `finalized_cases` | `u64` |
  | `commitments` | `u64` |
  | `reveals` | `u64` |
  | `challenges` | `u64` |
  | `outcomes` | `u64` |
  | `no_shows` | `u64` |
  | `updated_at_unix_ms` | `u64` |

## `ModerationNoShowKindV1` {#moderationnoshowkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `missing_commit` | &mdash; | 0 |
  | `unrevealed_commit` | &mdash; | 1 |

## `ModerationNoShowRecordV1` {#moderationnoshowrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |
  | `kind` | [`ModerationNoShowKindV1`](#moderationnoshowkindv1) |
  | `penalty_points` | `u32` |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `recorded_at_unix_ms` | `u64` |

## `ModerationOutcomeKindV1` {#moderationoutcomekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `decided` | [`SoraFsModerationVoteChoice`](#sorafsmoderationvotechoice) | 0 |
  | `contested` | &mdash; | 1 |
  | `quorum_not_met` | &mdash; | 2 |
  | `challenged` | &mdash; | 3 |

## `ModerationOutcomeRecordV1` {#moderationoutcomerecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `kind` | [`ModerationOutcomeKindV1`](#moderationoutcomekindv1) |
  | `counts` | [`ModerationVoteCountsV1`](#moderationvotecountsv1) |
  | `votes_total` | `u32` |
  | `quorum` | `u16` |
  | `no_show_count` | `u32` |
  | `finalized_at_unix_ms` | `u64` |
  | `finalized_by` | [`AccountId`](#accountid) |

## `ModerationPanelSelectionV1` {#moderationpanelselectionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `randomness_anchor` | [`Array<u8, 32>`](#array-u8-32) |
  | `seed_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `jurors` | [`Vec<AccountId>`](#vec-accountid) |
  | `waitlist` | [`Vec<AccountId>`](#vec-accountid) |
  | `sortition_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `selected_at_unix_ms` | `u64` |
  | `selected_by` | [`AccountId`](#accountid) |

## `ModerationPoPRegistrySnapshotV1` {#moderationpopregistrysnapshotv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `issuer_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `commitment_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `commitment_tree_version` | `u64` |
  | `revocation_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `revocation_list_version` | `u64` |
  | `registry_audit_sequence` | `u64` |
  | `registry_audit_head` | [`Array<u8, 32>`](#array-u8-32) |
  | `captured_at_unix_ms` | `u64` |

## `ModerationRevealRecordV1` {#moderationrevealrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_id` | `String` |
  | `round_id` | `String` |
  | `juror` | [`AccountId`](#accountid) |
  | `canonical_reveal` | [`Vec<u8>`](#vec-u8) |
  | `accepted_at_unix_ms` | `u64` |

## `ModerationVoteCountsV1` {#moderationvotecountsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `uphold` | `u32` |
  | `overturn` | `u32` |
  | `modify` | `u32` |
  | `escalate` | `u32` |

## `MultisigApprove` {#multisigapprove}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `instructions_hash` | [`HashOf<Vec<InstructionBox>>`](#hashof-vec-instructionbox) |

## `MultisigCancel` {#multisigcancel}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `instructions_hash` | [`HashOf<Vec<InstructionBox>>`](#hashof-vec-instructionbox) |

## `MultisigInstructionBox` {#multisiginstructionbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Register` | [`MultisigRegister`](#multisigregister) | 0 |
  | `Propose` | [`MultisigPropose`](#multisigpropose) | 1 |
  | `Approve` | [`MultisigApprove`](#multisigapprove) | 2 |
  | `Cancel` | [`MultisigCancel`](#multisigcancel) | 3 |
  | `InvalidateOutstanding` | [`MultisigInvalidateOutstanding`](#multisiginvalidateoutstanding) | 4 |

## `MultisigInvalidateOutstanding` {#multisiginvalidateoutstanding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |

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

## `MultisigProposalValue` {#multisigproposalvalue}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `instructions` | [`Vec<InstructionBox>`](#vec-instructionbox) |
  | `proposed_at_ms` | `u64` |
  | `expires_at_ms` | `u64` |
  | `approvals` | [`SortedVec<AccountId>`](#sortedvec-accountid) |
  | `is_relayed` | [`Option<bool>`](#option-bool) |

## `MultisigPropose` {#multisigpropose}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `instructions` | [`Vec<InstructionBox>`](#vec-instructionbox) |
  | `transaction_ttl_ms` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |

## `MultisigRegister` {#multisigregister}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `home_domain` | [`Option<DomainId>`](#option-domainid) |
  | `spec` | [`MultisigSpec`](#multisigspec) |

## `MultisigSignature` {#multisigsignature}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signer` | [`PublicKey`](#publickey) |
  | `signature` | [`SignatureOf<TransactionPayload>`](#signatureof-transactionpayload) |

## `MultisigSignatures` {#multisigsignatures}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signatures` | [`Vec<MultisigSignature>`](#vec-multisigsignature) |

## `MultisigSpec` {#multisigspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signatories` | [`SortedMap<AccountId, u8>`](#sortedmap-accountid-u8) |
  | `quorum` | [`NonZero<u16>`](#nonzero-u16) |
  | `transaction_ttl_ms` | [`NonZero<u64>`](#nonzero-u64) |

## `MusubiAbiBindingV1` {#musubiabibindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `abi_version` | `u16` |
  | `abi_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `MusubiAliasHistoryActionV1` {#musubialiashistoryactionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Registered` | &mdash; | 0 |
  | `ParliamentRetarget` | &mdash; | 1 |

## `MusubiAliasHistoryEntryV1` {#musubialiashistoryentryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`MusubiAliasNameV1`](#musubialiasnamev1) |
  | `revision` | `u64` |
  | `action` | [`MusubiAliasHistoryActionV1`](#musubialiashistoryactionv1) |
  | `previous_target` | [`Option<MusubiPackageIdV1>`](#option-musubipackageidv1) |
  | `target` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `governance_action` | [`Option<MusubiGovernanceActionDigestV1>`](#option-musubigovernanceactiondigestv1) |
  | `finalized_height` | `u64` |

## `MusubiAliasHistoryPageV1` {#musubialiashistorypagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | [`MusubiAliasQueryV1`](#musubialiasqueryv1) |
  | `items` | [`Vec<MusubiAliasHistoryEntryV1>`](#vec-musubialiashistoryentryv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiAliasNameV1` {#musubialiasnamev1}

**Type:** Alias

**To:** `String`

## `MusubiAliasQueryV1` {#musubialiasqueryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`MusubiAliasNameV1`](#musubialiasnamev1) |
  | `page` | [`MusubiPageRequestV1`](#musubipagerequestv1) |

## `MusubiAliasRecordV1` {#musubialiasrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`MusubiAliasNameV1`](#musubialiasnamev1) |
  | `target` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `registered_by` | [`AccountId`](#accountid) |
  | `pricing_revision` | `u64` |
  | `paid_xor` | `u64` |
  | `registered_at_height` | `u64` |
  | `history_revision` | `u64` |

## `MusubiArchiveAvailabilityV1` {#musubiarchiveavailabilityv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `availability` | [`MusubiStorageAvailabilityV1`](#musubistorageavailabilityv1) |
  | `healthy_replicas` | `u16` |
  | `active_locations` | `u8` |
  | `finalized_height` | `u64` |
  | `finalized_block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `index_revision` | `u64` |

## `MusubiArchiveCommitmentV1` {#musubiarchivecommitmentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `root_cid` | [`ManifestRootCid`](#manifestrootcid) |
  | `chunker` | [`ChunkerProfileHandle`](#chunkerprofilehandle) |
  | `chunk_plan_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `por_root` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `content_length` | `u64` |
  | `car_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `car_size` | `u64` |
  | `bundle_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `source_tree_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `descriptor_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `file_count` | `u32` |
  | `chunk_count` | `u32` |

## `MusubiArchiveLocationEventV1` {#musubiarchivelocationeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `location` | [`MusubiArchiveLocationKeyV1`](#musubiarchivelocationkeyv1) |
  | `pin_manifest` | [`ManifestDigest`](#manifestdigest) |
  | `replication_order` | [`ReplicationOrderId`](#replicationorderid) |
  | `provider_attestation_set_digest` | [`MusubiProviderBundleAttestationSetDigestV1`](#musubiproviderbundleattestationsetdigestv1) |
  | `provider_count` | `u8` |
  | `transition` | [`MusubiArchiveLocationTransitionV1`](#musubiarchivelocationtransitionv1) |
  | `state` | [`MusubiArchiveLocationStateV1`](#musubiarchivelocationstatev1) |
  | `revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiArchiveLocationIdV1` {#musubiarchivelocationidv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiArchiveLocationKeyV1` {#musubiarchivelocationkeyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `location_id` | [`MusubiArchiveLocationIdV1`](#musubiarchivelocationidv1) |

## `MusubiArchiveLocationPageV1` {#musubiarchivelocationpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `archive` | [`MusubiArchiveRecordV1`](#musubiarchiverecordv1) |
  | `items` | [`Vec<MusubiArchiveLocationV1>`](#vec-musubiarchivelocationv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiArchiveLocationQueryV1` {#musubiarchivelocationqueryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `page` | [`MusubiPageRequestV1`](#musubipagerequestv1) |

## `MusubiArchiveLocationStateV1` {#musubiarchivelocationstatev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Healthy` | &mdash; | 1 |
  | `Degraded` | &mdash; | 2 |
  | `Retired` | &mdash; | 3 |

## `MusubiArchiveLocationTransitionV1` {#musubiarchivelocationtransitionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Added` | &mdash; | 0 |
  | `Renewed` | &mdash; | 1 |
  | `Retired` | &mdash; | 2 |
  | `EvidenceRefreshed` | &mdash; | 3 |

## `MusubiArchiveLocationV1` {#musubiarchivelocationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `location_id` | [`MusubiArchiveLocationIdV1`](#musubiarchivelocationidv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `pin_manifest` | [`ManifestDigest`](#manifestdigest) |
  | `replication_order` | [`ReplicationOrderId`](#replicationorderid) |
  | `providers` | [`Vec<ProviderId>`](#vec-providerid) |
  | `provider_attestation_set_digest` | [`MusubiProviderBundleAttestationSetDigestV1`](#musubiproviderbundleattestationsetdigestv1) |
  | `renew_after_epoch` | `u64` |
  | `expires_at_epoch` | `u64` |
  | `finalized_height` | `u64` |
  | `revision` | `u64` |
  | `state` | [`MusubiArchiveLocationStateV1`](#musubiarchivelocationstatev1) |

## `MusubiArchiveRecordV1` {#musubiarchiverecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `commitment` | [`MusubiArchiveCommitmentV1`](#musubiarchivecommitmentv1) |
  | `staging_receipt` | [`MusubiSeedIngressReceiptV1`](#musubiseedingressreceiptv1) |
  | `registered_by` | [`AccountId`](#accountid) |
  | `registered_at_height` | `u64` |
  | `location_revision` | `u64` |
  | `location_ids` | [`Vec<MusubiArchiveLocationIdV1>`](#vec-musubiarchivelocationidv1) |

## `MusubiArchiveRegisteredEventV1` {#musubiarchiveregisteredeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `registered_by` | [`AccountId`](#accountid) |
  | `location_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiArchiveRetentionDecisionV1` {#musubiarchiveretentiondecisionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `disposition` | [`MusubiArchiveRetentionDispositionV1`](#musubiarchiveretentiondispositionv1) |
  | `active_releases` | `u16` |
  | `yanked_releases` | `u16` |
  | `taken_down_releases` | `u16` |
  | `storage` | [`Option<MusubiArchiveAvailabilityV1>`](#option-musubiarchiveavailabilityv1) |

## `MusubiArchiveRetentionDispositionV1` {#musubiarchiveretentiondispositionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `RetainUnknown` | &mdash; | 0 |
  | `RetainReferenced` | &mdash; | 1 |
  | `PruneUnreferenced` | &mdash; | 2 |
  | `PruneGovernedTakedown` | &mdash; | 3 |

## `MusubiArchiveRetentionPageV1` {#musubiarchiveretentionpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `items` | [`Vec<MusubiArchiveRetentionDecisionV1>`](#vec-musubiarchiveretentiondecisionv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |
  | `finalized_time_ms` | `u64` |

## `MusubiArchiveRetentionQueryV1` {#musubiarchiveretentionqueryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_ids` | [`Vec<ArchiveId>`](#vec-archiveid) |
  | `expected_snapshot` | [`Option<MusubiRegistrySnapshotV1>`](#option-musubiregistrysnapshotv1) |

## `MusubiArtifactGovernanceStateV1` {#musubiartifactgovernancestatev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Available` | &mdash; | 0 |
  | `TakenDown` | [`MusubiArtifactTakedownV1`](#musubiartifacttakedownv1) | 1 |

## `MusubiArtifactTakedownEventV1` {#musubiartifacttakedowneventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `action_digest` | [`MusubiGovernanceActionDigestV1`](#musubigovernanceactiondigestv1) |
  | `governance_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiArtifactTakedownV1` {#musubiartifacttakedownv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `action_digest` | [`MusubiGovernanceActionDigestV1`](#musubigovernanceactiondigestv1) |
  | `reason` | [`MusubiReasonV1`](#musubireasonv1) |
  | `applied_at_height` | `u64` |

## `MusubiComparatorOpV1` {#musubicomparatoropv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Greater` | &mdash; | 0 |
  | `GreaterOrEqual` | &mdash; | 1 |
  | `Less` | &mdash; | 2 |
  | `LessOrEqual` | &mdash; | 3 |
  | `Equal` | &mdash; | 4 |

## `MusubiContentDigestV1` {#musubicontentdigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiDependencyReqV1` {#musubidependencyreqv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `alias` | [`Name`](#name) |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `requirement` | [`MusubiVersionReqV1`](#musubiversionreqv1) |

## `MusubiDescriptionV1` {#musubidescriptionv1}

**Type:** Alias

**To:** `String`

## `MusubiDocumentRefV1` {#musubidocumentrefv1}

**Type:** Alias

**To:** `String`

## `MusubiEvent` {#musubievent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `NamespaceBound` | [`MusubiNamespaceBindingV1`](#musubinamespacebindingv1) | 0 |
  | `PackageClaimed` | [`MusubiPackageClaimedEventV1`](#musubipackageclaimedeventv1) | 1 |
  | `ReleasePublished` | [`MusubiReleasePublishedEventV1`](#musubireleasepublishedeventv1) | 2 |
  | `ReleaseYankChanged` | [`MusubiReleaseYankEventV1`](#musubireleaseyankeventv1) | 3 |
  | `PackageMetadataChanged` | [`MusubiPackageMetadataRecordV1`](#musubipackagemetadatarecordv1) | 4 |
  | `MaintainerInvited` | [`MusubiMaintainerInvitationV1`](#musubimaintainerinvitationv1) | 5 |
  | `MaintainerAccepted` | [`MusubiPackageMemberV1`](#musubipackagememberv1) | 6 |
  | `MaintainerInvitationExpired` | [`MusubiMaintainerInvitationLifecycleEventV1`](#musubimaintainerinvitationlifecycleeventv1) | 7 |
  | `MaintainerInvitationRevoked` | [`MusubiMaintainerInvitationLifecycleEventV1`](#musubimaintainerinvitationlifecycleeventv1) | 8 |
  | `MaintainerRoleChanged` | [`MusubiPackageMemberV1`](#musubipackagememberv1) | 9 |
  | `MaintainerRemoved` | [`MusubiPackageMemberRemovedEventV1`](#musubipackagememberremovedeventv1) | 10 |
  | `PackageRecovered` | [`MusubiPackageRecoveredEventV1`](#musubipackagerecoveredeventv1) | 11 |
  | `AliasRegistered` | [`MusubiAliasHistoryEntryV1`](#musubialiashistoryentryv1) | 12 |
  | `AliasRetargeted` | [`MusubiAliasHistoryEntryV1`](#musubialiashistoryentryv1) | 13 |
  | `ArchiveRegistered` | [`MusubiArchiveRegisteredEventV1`](#musubiarchiveregisteredeventv1) | 14 |
  | `ProviderBundleAttestationRegistered` | [`MusubiProviderBundleAttestationRegisteredEventV1`](#musubiproviderbundleattestationregisteredeventv1) | 15 |
  | `ArchiveLocationChanged` | [`MusubiArchiveLocationEventV1`](#musubiarchivelocationeventv1) | 16 |
  | `ArchiveAvailabilityChanged` | [`MusubiArchiveAvailabilityV1`](#musubiarchiveavailabilityv1) | 17 |
  | `ArtifactTakenDown` | [`MusubiArtifactTakedownEventV1`](#musubiartifacttakedowneventv1) | 18 |
  | `RegistryPolicyChanged` | [`MusubiRegistryPolicyEventV1`](#musubiregistrypolicyeventv1) | 19 |

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

## `MusubiExactPackageQueryV1` {#musubiexactpackagequeryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |

## `MusubiExactReleaseQueryV1` {#musubiexactreleasequeryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |

## `MusubiExactReleaseSnapshotV1` {#musubiexactreleasesnapshotv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |
  | `home_release` | [`MusubiReleaseRecordV1`](#musubireleaserecordv1) |
  | `universal_release` | [`MusubiResolverReleaseRowV1`](#musubiresolverreleaserowv1) |

## `MusubiFinalizedCursorV1` {#musubifinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |
  | `query_hash` | [`MusubiQueryHashV1`](#musubiqueryhashv1) |
  | `last_key` | `String` |
  | `caller` | [`Option<AccountId>`](#option-accountid) |

## `MusubiGovernanceActionDigestV1` {#musubigovernanceactiondigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiInvitationStateV1` {#musubiinvitationstatev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Accepted` | &mdash; | 1 |
  | `Revoked` | &mdash; | 2 |
  | `Expired` | &mdash; | 3 |

## `MusubiInviteIdV1` {#musubiinviteidv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiKeywordV1` {#musubikeywordv1}

**Type:** Alias

**To:** `String`

## `MusubiKotodamaEditionV1` {#musubikotodamaeditionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `V1` | &mdash; | 0 |

## `MusubiMaintainerDirectoryEntryV1` {#musubimaintainerdirectoryentryv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Accepted` | [`MusubiPackageMemberV1`](#musubipackagememberv1) | 0 |
  | `PendingInvitation` | [`MusubiMaintainerInvitationV1`](#musubimaintainerinvitationv1) | 1 |

## `MusubiMaintainerInvitationLifecycleEventV1` {#musubimaintainerinvitationlifecycleeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `invite_id` | [`MusubiInviteIdV1`](#musubiinviteidv1) |
  | `invited_account` | [`AccountId`](#accountid) |
  | `governance_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiMaintainerInvitationV1` {#musubimaintainerinvitationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `invite_id` | [`MusubiInviteIdV1`](#musubiinviteidv1) |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `invited_by` | [`AccountId`](#accountid) |
  | `invited_account` | [`AccountId`](#accountid) |
  | `role` | [`MusubiPackageRoleV1`](#musubipackagerolev1) |
  | `expected_governance_revision` | `u64` |
  | `expires_at_height` | `u64` |
  | `state` | [`MusubiInvitationStateV1`](#musubiinvitationstatev1) |

## `MusubiMaintainerPageV1` {#musubimaintainerpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | [`MusubiPackagePageQueryV1`](#musubipackagepagequeryv1) |
  | `items` | [`Vec<MusubiMaintainerDirectoryEntryV1>`](#vec-musubimaintainerdirectoryentryv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiMaintainerPermissionsV1` {#musubimaintainerpermissionsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `publish` | `bool` |
  | `yank` | `bool` |
  | `metadata` | `bool` |
  | `archive_locations` | `bool` |

## `MusubiMinorWildcardV1` {#musubiminorwildcardv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `major` | `u64` |
  | `minor` | `u64` |

## `MusubiNamespaceBindingDigestV1` {#musubinamespacebindingdigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiNamespaceBindingV1` {#musubinamespacebindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `namespace` | [`MusubiNamespaceV1`](#musubinamespacev1) |
  | `home_dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `scope` | [`MusubiPackageScopeV1`](#musubipackagescopev1) |
  | `generation` | `u64` |

## `MusubiNamespaceV1` {#musubinamespacev1}

**Type:** Alias

**To:** `String`

## `MusubiOrderedPackageEntryV1` {#musubiorderedpackageentryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `selector` | [`MusubiPackageSelectorV1`](#musubipackageselectorv1) |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `latest_selectable` | [`Option<MusubiVersionV1>`](#option-musubiversionv1) |
  | `metadata_revision` | `u64` |
  | `index_revision` | `u64` |

## `MusubiOrderedPackagePageV1` {#musubiorderedpackagepagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | [`MusubiOrderedPrefixQueryV1`](#musubiorderedprefixqueryv1) |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `namespace_binding` | [`MusubiNamespaceBindingV1`](#musubinamespacebindingv1) |
  | `items` | [`Vec<MusubiOrderedPackageEntryV1>`](#vec-musubiorderedpackageentryv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiOrderedPrefixQueryV1` {#musubiorderedprefixqueryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `prefix` | [`MusubiOrderedPrefixV1`](#musubiorderedprefixv1) |
  | `page` | [`MusubiPageRequestV1`](#musubipagerequestv1) |

## `MusubiOrderedPrefixV1` {#musubiorderedprefixv1}

**Type:** Alias

**To:** `String`

## `MusubiPackageClaimedEventV1` {#musubipackageclaimedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `namespace` | [`MusubiNamespaceV1`](#musubinamespacev1) |
  | `claimed_by` | [`AccountId`](#accountid) |
  | `governance_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiPackageIdV1` {#musubipackageidv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `home_dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `scope` | [`MusubiPackageScopeV1`](#musubipackagescopev1) |
  | `name` | [`MusubiPackageNameV1`](#musubipackagenamev1) |

## `MusubiPackageMemberRemovedEventV1` {#musubipackagememberremovedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `account` | [`AccountId`](#accountid) |
  | `previous_role` | [`MusubiPackageRoleV1`](#musubipackagerolev1) |
  | `governance_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiPackageMemberV1` {#musubipackagememberv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `account` | [`AccountId`](#accountid) |
  | `role` | [`MusubiPackageRoleV1`](#musubipackagerolev1) |
  | `accepted_at_height` | `u64` |
  | `governance_revision` | `u64` |

## `MusubiPackageMetadataRecordV1` {#musubipackagemetadatarecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `metadata` | [`MusubiReleaseMetadataV1`](#musubireleasemetadatav1) |
  | `revision` | `u64` |
  | `changed_by` | [`AccountId`](#accountid) |
  | `changed_at_height` | `u64` |

## `MusubiPackageNameV1` {#musubipackagenamev1}

**Type:** Alias

**To:** `String`

## `MusubiPackagePageQueryV1` {#musubipackagepagequeryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `page` | [`MusubiPageRequestV1`](#musubipagerequestv1) |

## `MusubiPackageRecordV1` {#musubipackagerecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `claimed_namespace` | [`MusubiNamespaceV1`](#musubinamespacev1) |
  | `claimed_namespace_binding` | [`MusubiNamespaceBindingDigestV1`](#musubinamespacebindingdigestv1) |
  | `owners` | [`Vec<AccountId>`](#vec-accountid) |
  | `member_accounts` | [`Vec<AccountId>`](#vec-accountid) |
  | `claimed_at_height` | `u64` |
  | `revisions` | [`MusubiPackageRevisionsV1`](#musubipackagerevisionsv1) |

## `MusubiPackageRecoveredEventV1` {#musubipackagerecoveredeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `action_digest` | [`MusubiGovernanceActionDigestV1`](#musubigovernanceactiondigestv1) |
  | `owner_count` | `u8` |
  | `governance_revision` | `u64` |
  | `finalized_height` | `u64` |

## `MusubiPackageRevisionsV1` {#musubipackagerevisionsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `governance` | `u64` |
  | `metadata` | `u64` |
  | `archive_locations` | `u64` |

## `MusubiPackageRoleV1` {#musubipackagerolev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Owner` | &mdash; | 0 |
  | `Maintainer` | [`MusubiMaintainerPermissionsV1`](#musubimaintainerpermissionsv1) | 1 |

## `MusubiPackageScopeV1` {#musubipackagescopev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DataspaceRoot` | &mdash; | 0 |
  | `Domain` | [`Name`](#name) | 1 |

## `MusubiPackageSelectorV1` {#musubipackageselectorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `namespace` | [`MusubiNamespaceV1`](#musubinamespacev1) |
  | `name` | [`MusubiPackageNameV1`](#musubipackagenamev1) |

## `MusubiPageRequestV1` {#musubipagerequestv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `limit` | `u32` |
  | `cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |

## `MusubiPrereleaseIdentifierV1` {#musubiprereleaseidentifierv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Numeric` | `u64` | 0 |
  | `AlphaNumeric` | `String` | 1 |

## `MusubiProviderBundleAttestationDigestV1` {#musubiproviderbundleattestationdigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiProviderBundleAttestationKeyV1` {#musubiproviderbundleattestationkeyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `replication_order` | [`ReplicationOrderId`](#replicationorderid) |
  | `provider_id` | [`ProviderId`](#providerid) |

## `MusubiProviderBundleAttestationRecordV1` {#musubiproviderbundleattestationrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`MusubiProviderBundleAttestationKeyV1`](#musubiproviderbundleattestationkeyv1) |
  | `attestation_digest` | [`MusubiProviderBundleAttestationDigestV1`](#musubiproviderbundleattestationdigestv1) |
  | `attestation` | [`MusubiProviderBundleVerificationAttestationV1`](#musubiproviderbundleverificationattestationv1) |
  | `registered_by` | [`AccountId`](#accountid) |
  | `registered_at_height` | `u64` |

## `MusubiProviderBundleAttestationRegisteredEventV1` {#musubiproviderbundleattestationregisteredeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`MusubiProviderBundleAttestationKeyV1`](#musubiproviderbundleattestationkeyv1) |
  | `attestation_digest` | [`MusubiProviderBundleAttestationDigestV1`](#musubiproviderbundleattestationdigestv1) |
  | `registered_by` | [`AccountId`](#accountid) |
  | `finalized_height` | `u64` |

## `MusubiProviderBundleAttestationSetDigestV1` {#musubiproviderbundleattestationsetdigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiProviderBundleVerificationApprovalV1` {#musubiproviderbundleverificationapprovalv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |
  | `signature` | [`SignatureOf<MusubiProviderBundleVerificationPayloadV1>`](#signatureof-musubiproviderbundleverificationpayloadv1) |

## `MusubiProviderBundleVerificationAttestationV1` {#musubiproviderbundleverificationattestationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `payload` | [`MusubiProviderBundleVerificationPayloadV1`](#musubiproviderbundleverificationpayloadv1) |
  | `approvals` | [`Vec<MusubiProviderBundleVerificationApprovalV1>`](#vec-musubiproviderbundleverificationapprovalv1) |

## `MusubiProviderBundleVerificationBindingV1` {#musubiproviderbundleverificationbindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `completed_by` | [`AccountId`](#accountid) |
  | `completion_authority` | [`ProviderIngestCompletionAuthorityV1`](#provideringestcompletionauthorityv1) |
  | `replication_order` | [`ReplicationOrderId`](#replicationorderid) |
  | `assignment_revision` | `u64` |
  | `completion_epoch` | `u64` |
  | `finalized_anchor` | [`ProviderIngestFinalizedAnchorV1`](#provideringestfinalizedanchorv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `bundle_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `descriptor_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `semantic_release_manifest_digest` | [`MusubiSemanticReleaseDigestV1`](#musubisemanticreleasedigestv1) |
  | `verification_lock_digest` | [`MusubiVerificationLockDigestV1`](#musubiverificationlockdigestv1) |
  | `source_tree_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |

## `MusubiProviderBundleVerificationPayloadV1` {#musubiproviderbundleverificationpayloadv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `binding` | [`MusubiProviderBundleVerificationBindingV1`](#musubiproviderbundleverificationbindingv1) |

## `MusubiQueryHashV1` {#musubiqueryhashv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiReasonV1` {#musubireasonv1}

**Type:** Alias

**To:** `String`

## `MusubiRegistryAdmissionModeV1` {#musubiregistryadmissionmodev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Closed` | &mdash; | 0 |
  | `Allowlisted` | &mdash; | 1 |
  | `Open` | &mdash; | 2 |

## `MusubiRegistryPolicyEventV1` {#musubiregistrypolicyeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `revision` | `u64` |
  | `mode` | [`MusubiRegistryAdmissionModeV1`](#musubiregistryadmissionmodev1) |
  | `alias_pricing_revision` | `u64` |
  | `allowlisted_dataspaces` | `u16` |
  | `action_digest` | [`MusubiGovernanceActionDigestV1`](#musubigovernanceactiondigestv1) |
  | `finalized_height` | `u64` |

## `MusubiRegistrySnapshotV1` {#musubiregistrysnapshotv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_height` | `u64` |
  | `finalized_block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `index_revision` | `u64` |

## `MusubiReleaseDigestV1` {#musubireleasedigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiReleaseIdV1` {#musubireleaseidv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `version` | [`MusubiVersionV1`](#musubiversionv1) |

## `MusubiReleaseManifestV1` {#musubireleasemanifestv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |
  | `edition` | [`MusubiKotodamaEditionV1`](#musubikotodamaeditionv1) |
  | `abi` | [`MusubiAbiBindingV1`](#musubiabibindingv1) |
  | `dependencies` | [`Vec<MusubiDependencyReqV1>`](#vec-musubidependencyreqv1) |
  | `exports` | [`Vec<Name>`](#vec-name) |
  | `interface_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `metadata` | [`MusubiReleaseMetadataV1`](#musubireleasemetadatav1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `verification_lock_digest` | [`MusubiVerificationLockDigestV1`](#musubiverificationlockdigestv1) |

## `MusubiReleaseMetadataV1` {#musubireleasemetadatav1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `description` | [`Option<MusubiDescriptionV1>`](#option-musubidescriptionv1) |
  | `readme` | [`Option<MusubiDocumentRefV1>`](#option-musubidocumentrefv1) |
  | `license` | [`Option<MusubiDocumentRefV1>`](#option-musubidocumentrefv1) |
  | `repository` | [`Option<MusubiDocumentRefV1>`](#option-musubidocumentrefv1) |
  | `keywords` | [`Vec<MusubiKeywordV1>`](#vec-musubikeywordv1) |

## `MusubiReleasePublishedEventV1` {#musubireleasepublishedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |
  | `release_digest` | [`MusubiReleaseDigestV1`](#musubireleasedigestv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `published_by` | [`AccountId`](#accountid) |
  | `finalized_height` | `u64` |

## `MusubiReleaseRecordV1` {#musubireleaserecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `manifest` | [`MusubiReleaseManifestV1`](#musubireleasemanifestv1) |
  | `release_digest` | [`MusubiReleaseDigestV1`](#musubireleasedigestv1) |
  | `published_by` | [`AccountId`](#accountid) |
  | `published_at_height` | `u64` |
  | `yank` | [`MusubiReleaseYankV1`](#musubireleaseyankv1) |
  | `artifact_governance` | [`MusubiArtifactGovernanceStateV1`](#musubiartifactgovernancestatev1) |
  | `revisions` | [`MusubiReleaseRevisionsV1`](#musubireleaserevisionsv1) |

## `MusubiReleaseRevisionsV1` {#musubireleaserevisionsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `yank` | `u64` |
  | `artifact_governance` | `u64` |

## `MusubiReleaseSelectionStateV1` {#musubireleaseselectionstatev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `yank` | [`MusubiReleaseYankV1`](#musubireleaseyankv1) |
  | `storage` | [`MusubiArchiveAvailabilityV1`](#musubiarchiveavailabilityv1) |
  | `governance` | [`MusubiArtifactGovernanceStateV1`](#musubiartifactgovernancestatev1) |

## `MusubiReleaseYankEventV1` {#musubireleaseyankeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `yank` | [`MusubiReleaseYankV1`](#musubireleaseyankv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |

## `MusubiReleaseYankV1` {#musubireleaseyankv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |
  | `yanked` | `bool` |
  | `reason` | [`MusubiReasonV1`](#musubireasonv1) |
  | `changed_by` | [`AccountId`](#accountid) |
  | `changed_at_height` | `u64` |
  | `revision` | `u64` |

## `MusubiResolverIndexPageV1` {#musubiresolverindexpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | [`MusubiResolverIndexQueryV1`](#musubiresolverindexqueryv1) |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `items` | [`Vec<MusubiResolverReleaseRowV1>`](#vec-musubiresolverreleaserowv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiResolverIndexQueryV1` {#musubiresolverindexqueryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `package` | [`MusubiPackageIdV1`](#musubipackageidv1) |
  | `requirement` | [`Option<MusubiVersionReqV1>`](#option-musubiversionreqv1) |
  | `page` | [`MusubiPageRequestV1`](#musubipagerequestv1) |

## `MusubiResolverReleaseRowV1` {#musubiresolverreleaserowv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `release` | [`MusubiReleaseIdV1`](#musubireleaseidv1) |
  | `release_digest` | [`MusubiReleaseDigestV1`](#musubireleasedigestv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `source_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `interface_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `abi` | [`MusubiAbiBindingV1`](#musubiabibindingv1) |
  | `dependencies` | [`Vec<MusubiDependencyReqV1>`](#vec-musubidependencyreqv1) |
  | `selection` | [`MusubiReleaseSelectionStateV1`](#musubireleaseselectionstatev1) |
  | `index_revision` | `u64` |

## `MusubiSeedIngressReceiptApprovalV1` {#musubiseedingressreceiptapprovalv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`PublicKey`](#publickey) |
  | `signature` | [`SignatureOf<MusubiSeedIngressReceiptPayloadV1>`](#signatureof-musubiseedingressreceiptpayloadv1) |

## `MusubiSeedIngressReceiptBindingV1` {#musubiseedingressreceiptbindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `publisher` | [`AccountId`](#accountid) |
  | `ingress_broker` | [`AccountId`](#accountid) |
  | `seed_provider` | [`ProviderId`](#providerid) |
  | `semantic_release_manifest_digest` | [`MusubiSemanticReleaseDigestV1`](#musubisemanticreleasedigestv1) |
  | `archive_id` | [`ArchiveId`](#archiveid) |
  | `car_body_digest` | [`MusubiContentDigestV1`](#musubicontentdigestv1) |
  | `car_body_length` | `u64` |
  | `nonce` | [`Array<u8, 32>`](#array-u8-32) |

## `MusubiSeedIngressReceiptPayloadV1` {#musubiseedingressreceiptpayloadv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `binding` | [`MusubiSeedIngressReceiptBindingV1`](#musubiseedingressreceiptbindingv1) |
  | `issued_at_ms` | `u64` |
  | `expires_at_ms` | `u64` |

## `MusubiSeedIngressReceiptV1` {#musubiseedingressreceiptv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `payload` | [`MusubiSeedIngressReceiptPayloadV1`](#musubiseedingressreceiptpayloadv1) |
  | `approvals` | [`Vec<MusubiSeedIngressReceiptApprovalV1>`](#vec-musubiseedingressreceiptapprovalv1) |

## `MusubiSemanticReleaseDigestV1` {#musubisemanticreleasedigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiStorageAvailabilityV1` {#musubistorageavailabilityv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Selectable` | &mdash; | 0 |
  | `BelowQuorum` | &mdash; | 1 |
  | `Unavailable` | &mdash; | 2 |

## `MusubiVerificationLockDigestV1` {#musubiverificationlockdigestv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `MusubiVersionComparatorV1` {#musubiversioncomparatorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `op` | [`MusubiComparatorOpV1`](#musubicomparatoropv1) |
  | `version` | [`MusubiVersionV1`](#musubiversionv1) |

## `MusubiVersionPageV1` {#musubiversionpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `query` | [`MusubiPackagePageQueryV1`](#musubipackagepagequeryv1) |
  | `items` | [`Vec<MusubiVersionV1>`](#vec-musubiversionv1) |
  | `next_cursor` | [`Option<MusubiFinalizedCursorV1>`](#option-musubifinalizedcursorv1) |
  | `snapshot` | [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1) |

## `MusubiVersionReqV1` {#musubiversionreqv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Any` | &mdash; | 0 |
  | `Caret` | [`MusubiVersionV1`](#musubiversionv1) | 1 |
  | `Tilde` | [`MusubiVersionV1`](#musubiversionv1) | 2 |
  | `MajorWildcard` | `u64` | 3 |
  | `MinorWildcard` | [`MusubiMinorWildcardV1`](#musubiminorwildcardv1) | 4 |
  | `Exact` | [`MusubiVersionV1`](#musubiversionv1) | 5 |
  | `Comparators` | [`Vec<MusubiVersionComparatorV1>`](#vec-musubiversioncomparatorv1) | 6 |

## `MusubiVersionV1` {#musubiversionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `major` | `u64` |
  | `minor` | `u64` |
  | `patch` | `u64` |
  | `prerelease` | [`Vec<MusubiPrereleaseIdentifierV1>`](#vec-musubiprereleaseidentifierv1) |

## `Name` {#name}

**Type:** Alias

**To:** `String`

## `NameFrozenStateV1` {#namefrozenstatev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |
  | `until_ms` | `u64` |

## `NameStatus` {#namestatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Active` | &mdash; | 0 |
  | `GracePeriod` | &mdash; | 1 |
  | `Redemption` | &mdash; | 2 |
  | `Frozen` | [`NameFrozenStateV1`](#namefrozenstatev1) | 3 |
  | `Tombstoned` | [`NameTombstoneStateV1`](#nametombstonestatev1) | 4 |

## `NameTombstoneStateV1` {#nametombstonestatev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |

## `NativeAmxAttestationBodyV2` {#nativeamxattestationbodyv2}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `epoch` | `u64` |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `source_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `tx_entrypoint_hash` | [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint) |
  | `plan_digest` | [`Hash`](#hash) |
  | `phase` | [`NativeAmxPhase`](#nativeamxphase) |
  | `coordinator_lane_id` | [`LaneId`](#laneid) |
  | `coordinator_dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `coordinator_lane_incarnation` | [`Hash`](#hash) |
  | `participant_lane_id` | [`LaneId`](#laneid) |
  | `participant_dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `participant_lane_incarnation` | [`Hash`](#hash) |
  | `participant_previous_block_height` | `u64` |
  | `participant_previous_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `participant_lane_block_height` | `u64` |
  | `participant_lane_block_view` | `u64` |
  | `participant_proposal_hash` | [`Hash`](#hash) |
  | `participant_settlement_commitment` | [`Hash`](#hash) |
  | `participant_validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `participant_validator_count` | `u32` |
  | `participant_min_quorum` | `u32` |
  | `authority_context_height` | `u64` |
  | `planned_coordinator_block_height` | `u64` |
  | `coordinator_lane_block_view` | `u64` |
  | `coordinator_proposal_hash` | [`Hash`](#hash) |

## `NativeAmxAttestationQcV2` {#nativeamxattestationqcv2}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`NativeAmxAttestationBodyV2`](#nativeamxattestationbodyv2) |
  | `validator_set_hash_version` | `u16` |
  | `validator_set_hash` | [`HashOf<Vec<PeerId>>`](#hashof-vec-peerid) |
  | `validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `validator_set_pops` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `signers_bitmap` | [`Vec<u8>`](#vec-u8) |
  | `bls_aggregate_signature` | [`Vec<u8>`](#vec-u8) |

## `NativeAmxLegRecordV2` {#nativeamxlegrecordv2}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `participant_proposal` | [`LaneBlockProposalV1`](#laneblockproposalv1) |
  | `participant_settlement` | [`LaneBlockCommitment`](#laneblockcommitment) |
  | `participant_settlement_hash` | [`HashOf<LaneBlockCommitment>`](#hashof-laneblockcommitment) |
  | `prepare_qc` | [`NativeAmxAttestationQcV2`](#nativeamxattestationqcv2) |
  | `commit_qc` | [`NativeAmxAttestationQcV2`](#nativeamxattestationqcv2) |

## `NativeAmxPhase` {#nativeamxphase}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `prepare` | &mdash; | 0 |
  | `commit` | &mdash; | 1 |

## `NativeAmxReceipt` {#nativeamxreceipt}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `source_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `plan_digest` | [`Hash`](#hash) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `authority_context_height` | `u64` |
  | `lane_block_height` | `u64` |
  | `lane_block_view` | `u64` |
  | `coordinator_proposal_hash` | [`Hash`](#hash) |
  | `legs` | [`Vec<NativeAmxLegRecordV2>`](#vec-nativeamxlegrecordv2) |

## `NexusDataspaceCatalogStatus` {#nexusdataspacecatalogstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | `u32` |
  | `lane_alias` | `String` |
  | `dataspace_id` | `u64` |
  | `alias` | `String` |
  | `visibility` | `String` |
  | `storage_profile` | `String` |
  | `manifest_required` | `bool` |
  | `manifest_ready` | `bool` |
  | `sealed` | `bool` |
  | `manifest_path` | [`Option<String>`](#option-string) |
  | `protected_namespaces` | [`Vec<String>`](#vec-string) |

## `NexusDataspaceTeuStatus` {#nexusdataspaceteustatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | `u32` |
  | `dataspace_id` | `u64` |
  | `fault_tolerance` | `u32` |
  | `backlog` | `u64` |
  | `age_slots` | `u64` |
  | `virtual_finish` | `u64` |
  | `tx_served` | `u64` |
  | `alias` | `String` |
  | `description` | [`Option<String>`](#option-string) |

## `NexusFeeReceipt` {#nexusfeereceipt}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `source_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `block_height` | `u64` |
  | `debit_source` | [`FeeDebitSource`](#feedebitsource) |
  | `fee_asset_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `program_revision` | [`Option<u64>`](#option-u64) |
  | `lease_id` | [`Option<Hash>`](#option-hash) |
  | `fee_amount` | [`Quantity`](#quantity) |
  | `schedule` | [`NexusFeeScheduleInputs`](#nexusfeescheduleinputs) |

## `NexusFeeScheduleInputs` {#nexusfeescheduleinputs}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `tx_bytes_len` | `u64` |
  | `instruction_count` | `u64` |
  | `gas_used` | `u64` |
  | `base_fee` | [`Quantity`](#quantity) |
  | `per_byte_fee` | [`Quantity`](#quantity) |
  | `per_instruction_fee` | [`Quantity`](#quantity) |
  | `per_gas_unit_fee` | [`Quantity`](#quantity) |

## `NexusLaneManifestValidatorBindingStatus` {#nexuslanemanifestvalidatorbindingstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `validator` | `String` |
  | `peer_id` | `String` |
  | `torii_url` | [`Option<String>`](#option-string) |

## `NexusLaneRuntimeUpgradeHookStatus` {#nexuslaneruntimeupgradehookstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `allow` | `bool` |
  | `require_metadata` | `bool` |
  | `metadata_key` | [`Option<String>`](#option-string) |
  | `allowed_ids` | [`Vec<String>`](#vec-string) |

## `NexusLaneTeuBuckets` {#nexuslaneteubuckets}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `floor` | `u64` |
  | `headroom` | `u64` |
  | `must_serve` | `u64` |
  | `circuit_breaker` | `u64` |

## `NexusLaneTeuDeferrals` {#nexuslaneteudeferrals}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `cap_exceeded` | `u64` |
  | `envelope_limit` | `u64` |
  | `quota` | `u64` |
  | `circuit_breaker` | `u64` |

## `NexusLaneTeuStatus` {#nexuslaneteustatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | `u32` |
  | `capacity` | `u64` |
  | `committed` | `u64` |
  | `buckets` | [`NexusLaneTeuBuckets`](#nexuslaneteubuckets) |
  | `deferrals` | [`NexusLaneTeuDeferrals`](#nexuslaneteudeferrals) |
  | `must_serve_truncations` | `u64` |
  | `trigger_level` | `u64` |
  | `starvation_bound_slots` | `u64` |
  | `block_height` | `u64` |
  | `finality_lag_slots` | `u64` |
  | `settlement_backlog_xor_micro` | `u128` |
  | `tx_vertices` | `u64` |
  | `tx_edges` | `u64` |
  | `overlay_count` | `u64` |
  | `overlay_instr_total` | `u64` |
  | `overlay_bytes_total` | `u64` |
  | `rbc_chunks` | `u64` |
  | `rbc_bytes_total` | `u64` |
  | `peak_layer_width` | `u64` |
  | `layer_count` | `u64` |
  | `avg_layer_width` | `u64` |
  | `median_layer_width` | `u64` |
  | `scheduler_utilization_pct` | `u64` |
  | `layer_width_buckets` | [`SchedulerLayerWidthBuckets`](#schedulerlayerwidthbuckets) |
  | `detached_prepared` | `u64` |
  | `detached_merged` | `u64` |
  | `detached_fallback` | `u64` |
  | `quarantine_executed` | `u64` |
  | `manifest_required` | `bool` |
  | `manifest_ready` | `bool` |
  | `alias` | `String` |
  | `dataspace_id` | `u64` |
  | `dataspace_alias` | [`Option<String>`](#option-string) |
  | `visibility` | [`Option<String>`](#option-string) |
  | `storage_profile` | `String` |
  | `lane_type` | [`Option<String>`](#option-string) |
  | `governance` | [`Option<String>`](#option-string) |
  | `settlement` | [`Option<String>`](#option-string) |
  | `scheduler_teu_capacity_override` | [`Option<u64>`](#option-u64) |
  | `scheduler_starvation_bound_override` | [`Option<u64>`](#option-u64) |
  | `manifest_path` | [`Option<String>`](#option-string) |
  | `manifest_validators` | [`Vec<String>`](#vec-string) |
  | `manifest_validator_bindings` | [`Vec<NexusLaneManifestValidatorBindingStatus>`](#vec-nexuslanemanifestvalidatorbindingstatus) |
  | `manifest_quorum` | [`Option<u32>`](#option-u32) |
  | `manifest_protected_namespaces` | [`Vec<String>`](#vec-string) |
  | `manifest_runtime_upgrade` | [`Option<NexusLaneRuntimeUpgradeHookStatus>`](#option-nexuslaneruntimeupgradehookstatus) |

## `NexusRoutingMatcherStatus` {#nexusroutingmatcherstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`Option<String>`](#option-string) |
  | `instruction` | [`Option<String>`](#option-string) |
  | `description` | [`Option<String>`](#option-string) |

## `NexusRoutingPolicyStatus` {#nexusroutingpolicystatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `default_lane` | `u32` |
  | `default_dataspace` | `u64` |
  | `rules` | [`Vec<NexusRoutingRuleStatus>`](#vec-nexusroutingrulestatus) |

## `NexusRoutingRuleStatus` {#nexusroutingrulestatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane` | `u32` |
  | `dataspace_id` | [`Option<u64>`](#option-u64) |
  | `matcher` | [`NexusRoutingMatcherStatus`](#nexusroutingmatcherstatus) |

## `NexusStatus` {#nexusstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `routing_policy` | [`NexusRoutingPolicyStatus`](#nexusroutingpolicystatus) |

## `Nft` {#nft}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`NftId`](#nftid) |
  | `content` | [`Metadata`](#metadata) |
  | `owned_by` | [`AccountId`](#accountid) |

## `NftEvent` {#nftevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`Nft`](#nft) | 0 |
  | `Deleted` | [`NftId`](#nftid) | 1 |
  | `MetadataInserted` | [`MetadataChanged<NftId>`](#metadatachanged-nftid) | 2 |
  | `MetadataRemoved` | [`MetadataChanged<NftId>`](#metadatachanged-nftid) | 3 |
  | `OwnerChanged` | [`NftOwnerChanged`](#nftownerchanged) | 4 |

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

## `NftOwnerChanged` {#nftownerchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `nft` | [`NftId`](#nftid) |
  | `new_owner` | [`AccountId`](#accountid) |

## `NonZero<u16>` {#nonzero-u16}

**Type:** Alias

**To:** `u16`

## `NonZero<u32>` {#nonzero-u32}

**Type:** Alias

**To:** `u32`

## `NonZero<u64>` {#nonzero-u64}

**Type:** Alias

**To:** `u64`

## `NposConsensusEffects` {#nposconsensuseffects}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_global_beacon_pulse` | [`Option<FinalizedGlobalThresholdBeaconPulseV1>`](#option-finalizedglobalthresholdbeaconpulsev1) |
  | `v2_evidence_admissions` | [`Vec<SumeragiV2EquivocationEvidence>`](#vec-sumeragiv2equivocationevidence) |
  | `penalty_actions` | [`Vec<NposPenaltyAction>`](#vec-npospenaltyaction) |

## `NposConsensusSlashAction` {#nposconsensusslashaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `evidence_key` | [`Vec<u8>`](#vec-u8) |
  | `signer` | `u32` |
  | `peer_id` | [`PeerId`](#peerid) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `validator` | [`AccountId`](#accountid) |
  | `slash_id` | [`Hash`](#hash) |
  | `amount` | [`Quantity`](#quantity) |

## `NposMarkConsensusEvidenceAppliedAction` {#nposmarkconsensusevidenceappliedaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `evidence_key` | [`Vec<u8>`](#vec-u8) |
  | `height` | `u64` |

## `NposPenaltyAction` {#npospenaltyaction}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `consensus_slash` | [`NposConsensusSlashAction`](#nposconsensusslashaction) | 0 |
  | `mark_consensus_evidence_applied` | [`NposMarkConsensusEvidenceAppliedAction`](#nposmarkconsensusevidenceappliedaction) | 1 |

## `Numeric` {#numeric}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `mantissa` | [`BigInt`](#bigint) |
  | `scale` | [`Compact<u32>`](#compact-u32) |

## `NumericSpec` {#numericspec}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `scale` | [`Option<u32>`](#option-u32) |

## `ObservationErrorCode` {#observationerrorcode}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ResourceUnavailable` | &mdash; | 0 |
  | `AuthFailed` | &mdash; | 1 |
  | `Timeout` | &mdash; | 2 |
  | `Missing` | &mdash; | 3 |
  | `Other` | `u16` | 4 |

## `ObservationValue` {#observationvalue}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `mantissa` | [`i128`](#i128) |
  | `scale` | `u32` |

## `OfflineStatus` {#offlinestatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `cash_handoff_capability` | `String` |
  | `required_bridge_abi_version` | `u32` |
  | `max_hops` | `u32` |
  | `ready` | `bool` |

## `OpaqueAccountId` {#opaqueaccountid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `Option<AccessSetHints>` {#option-accesssethints}

**Type:** Option

**Some:** [`AccessSetHints`](#accesssethints)

## `Option<AccountAlias>` {#option-accountalias}

**Type:** Option

**Some:** [`AccountAlias`](#accountalias)

## `Option<AccountAliasDomain>` {#option-accountaliasdomain}

**Type:** Option

**Some:** [`AccountAliasDomain`](#accountaliasdomain)

## `Option<AccountId>` {#option-accountid}

**Type:** Option

**Some:** [`AccountId`](#accountid)

## `Option<ArchiveId>` {#option-archiveid}

**Type:** Option

**Some:** [`ArchiveId`](#archiveid)

## `Option<Array<u8, 32>>` {#option-array-u8-32}

**Type:** Option

**Some:** [`Array<u8, 32>`](#array-u8-32)

## `Option<AssetDefinitionAlias>` {#option-assetdefinitionalias}

**Type:** Option

**Some:** [`AssetDefinitionAlias`](#assetdefinitionalias)

## `Option<AssetDefinitionId>` {#option-assetdefinitionid}

**Type:** Option

**Some:** [`AssetDefinitionId`](#assetdefinitionid)

## `Option<AssetEscrowResolution>` {#option-assetescrowresolution}

**Type:** Option

**Some:** [`AssetEscrowResolution`](#assetescrowresolution)

## `Option<AssetEscrowStatus>` {#option-assetescrowstatus}

**Type:** Option

**Some:** [`AssetEscrowStatus`](#assetescrowstatus)

## `Option<AssetId>` {#option-assetid}

**Type:** Option

**Some:** [`AssetId`](#assetid)

## `Option<AxtEffectBinding>` {#option-axteffectbinding}

**Type:** Option

**Some:** [`AxtEffectBinding`](#axteffectbinding)

## `Option<BlockExecutionContextBundle>` {#option-blockexecutioncontextbundle}

**Type:** Option

**Some:** [`BlockExecutionContextBundle`](#blockexecutioncontextbundle)

## `Option<BlockResult>` {#option-blockresult}

**Type:** Option

**Some:** [`BlockResult`](#blockresult)

## `Option<BlockStatus>` {#option-blockstatus}

**Type:** Option

**Some:** [`BlockStatus`](#blockstatus)

## `Option<BridgeProofRecord>` {#option-bridgeproofrecord}

**Type:** Option

**Some:** [`BridgeProofRecord`](#bridgeproofrecord)

## `Option<CertifiedMergeLedgerReference>` {#option-certifiedmergeledgerreference}

**Type:** Option

**Some:** [`CertifiedMergeLedgerReference`](#certifiedmergeledgerreference)

## `Option<CertifiedMergeTransactionInclusion>` {#option-certifiedmergetransactioninclusion}

**Type:** Option

**Some:** [`CertifiedMergeTransactionInclusion`](#certifiedmergetransactioninclusion)

## `Option<ConditionalEscrowAttestation>` {#option-conditionalescrowattestation}

**Type:** Option

**Some:** [`ConditionalEscrowAttestation`](#conditionalescrowattestation)

## `Option<ConfidentialFeatureDigest>` {#option-confidentialfeaturedigest}

**Type:** Option

**Some:** [`ConfidentialFeatureDigest`](#confidentialfeaturedigest)

## `Option<ConfidentialPolicyTransition>` {#option-confidentialpolicytransition}

**Type:** Option

**Some:** [`ConfidentialPolicyTransition`](#confidentialpolicytransition)

## `Option<ContractAddress>` {#option-contractaddress}

**Type:** Option

**Some:** [`ContractAddress`](#contractaddress)

## `Option<ContractArgumentRecord>` {#option-contractargumentrecord}

**Type:** Option

**Some:** [`ContractArgumentRecord`](#contractargumentrecord)

## `Option<ContractEmergencyHoldV1>` {#option-contractemergencyholdv1}

**Type:** Option

**Some:** [`ContractEmergencyHoldV1`](#contractemergencyholdv1)

## `Option<ContractLifecycleOwnerV1>` {#option-contractlifecycleownerv1}

**Type:** Option

**Some:** [`ContractLifecycleOwnerV1`](#contractlifecycleownerv1)

## `Option<DaCommitmentBundle>` {#option-dacommitmentbundle}

**Type:** Option

**Some:** [`DaCommitmentBundle`](#dacommitmentbundle)

## `Option<DaPinIntentBundle>` {#option-dapinintentbundle}

**Type:** Option

**Some:** [`DaPinIntentBundle`](#dapinintentbundle)

## `Option<DaProofPolicyBundle>` {#option-daproofpolicybundle}

**Type:** Option

**Some:** [`DaProofPolicyBundle`](#daproofpolicybundle)

## `Option<DataSpaceId>` {#option-dataspaceid}

**Type:** Option

**Some:** [`DataSpaceId`](#dataspaceid)

## `Option<DomainId>` {#option-domainid}

**Type:** Option

**Some:** [`DomainId`](#domainid)

## `Option<EntrypointArgumentSchemaV1>` {#option-entrypointargumentschemav1}

**Type:** Option

**Some:** [`EntrypointArgumentSchemaV1`](#entrypointargumentschemav1)

## `Option<EntrypointValueTypeV1>` {#option-entrypointvaluetypev1}

**Type:** Option

**Some:** [`EntrypointValueTypeV1`](#entrypointvaluetypev1)

## `Option<EscrowId>` {#option-escrowid}

**Type:** Option

**Some:** [`EscrowId`](#escrowid)

## `Option<FeeSponsorProgramActivation>` {#option-feesponsorprogramactivation}

**Type:** Option

**Some:** [`FeeSponsorProgramActivation`](#feesponsorprogramactivation)

## `Option<FeedId>` {#option-feedid}

**Type:** Option

**Some:** [`FeedId`](#feedid)

## `Option<FinalizedGlobalThresholdBeaconPulseV1>` {#option-finalizedglobalthresholdbeaconpulsev1}

**Type:** Option

**Some:** [`FinalizedGlobalThresholdBeaconPulseV1`](#finalizedglobalthresholdbeaconpulsev1)

## `Option<FinalizedNextEpochSnapshot>` {#option-finalizednextepochsnapshot}

**Type:** Option

**Some:** [`FinalizedNextEpochSnapshot`](#finalizednextepochsnapshot)

## `Option<ForwardCursor>` {#option-forwardcursor}

**Type:** Option

**Some:** [`ForwardCursor`](#forwardcursor)

## `Option<GovernanceCertificateId>` {#option-governancecertificateid}

**Type:** Option

**Some:** [`GovernanceCertificateId`](#governancecertificateid)

## `Option<Hash>` {#option-hash}

**Type:** Option

**Some:** [`Hash`](#hash)

## `Option<HashOf<Array<u8, 32>>>` {#option-hashof-array-u8-32}

**Type:** Option

**Some:** [`HashOf<Array<u8, 32>>`](#hashof-array-u8-32)

## `Option<HashOf<BlockExecutionContextBundle>>` {#option-hashof-blockexecutioncontextbundle}

**Type:** Option

**Some:** [`HashOf<BlockExecutionContextBundle>`](#hashof-blockexecutioncontextbundle)

## `Option<HashOf<BlockHeader>>` {#option-hashof-blockheader}

**Type:** Option

**Some:** [`HashOf<BlockHeader>`](#hashof-blockheader)

## `Option<HashOf<DaCommitmentBundle>>` {#option-hashof-dacommitmentbundle}

**Type:** Option

**Some:** [`HashOf<DaCommitmentBundle>`](#hashof-dacommitmentbundle)

## `Option<HashOf<DaPinIntentBundle>>` {#option-hashof-dapinintentbundle}

**Type:** Option

**Some:** [`HashOf<DaPinIntentBundle>`](#hashof-dapinintentbundle)

## `Option<HashOf<DaProofPolicyBundle>>` {#option-hashof-daproofpolicybundle}

**Type:** Option

**Some:** [`HashOf<DaProofPolicyBundle>`](#hashof-daproofpolicybundle)

## `Option<HashOf<LaneFinalityStatement>>` {#option-hashof-lanefinalitystatement}

**Type:** Option

**Some:** [`HashOf<LaneFinalityStatement>`](#hashof-lanefinalitystatement)

## `Option<HashOf<MerkleTree<TransactionEntrypoint>>>` {#option-hashof-merkletree-transactionentrypoint}

**Type:** Option

**Some:** [`HashOf<MerkleTree<TransactionEntrypoint>>`](#hashof-merkletree-transactionentrypoint)

## `Option<HashOf<MerkleTree<TransactionResult>>>` {#option-hashof-merkletree-transactionresult}

**Type:** Option

**Some:** [`HashOf<MerkleTree<TransactionResult>>`](#hashof-merkletree-transactionresult)

## `Option<HashOf<NposConsensusEffects>>` {#option-hashof-nposconsensuseffects}

**Type:** Option

**Some:** [`HashOf<NposConsensusEffects>`](#hashof-nposconsensuseffects)

## `Option<HashOf<SignedTransaction>>` {#option-hashof-signedtransaction}

**Type:** Option

**Some:** [`HashOf<SignedTransaction>`](#hashof-signedtransaction)

## `Option<HashOf<TransactionEntrypoint>>` {#option-hashof-transactionentrypoint}

**Type:** Option

**Some:** [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint)

## `Option<HashOf<TransactionResult>>` {#option-hashof-transactionresult}

**Type:** Option

**Some:** [`HashOf<TransactionResult>`](#hashof-transactionresult)

## `Option<KeyedHash>` {#option-keyedhash}

**Type:** Option

**Some:** [`KeyedHash`](#keyedhash)

## `Option<LaneBlockProposalPayloadHintV1>` {#option-laneblockproposalpayloadhintv1}

**Type:** Option

**Some:** [`LaneBlockProposalPayloadHintV1`](#laneblockproposalpayloadhintv1)

## `Option<LaneDrainNativeFrontierEvidenceV1>` {#option-lanedrainnativefrontierevidencev1}

**Type:** Option

**Some:** [`LaneDrainNativeFrontierEvidenceV1`](#lanedrainnativefrontierevidencev1)

## `Option<LaneFastpqProofMaterial>` {#option-lanefastpqproofmaterial}

**Type:** Option

**Some:** [`LaneFastpqProofMaterial`](#lanefastpqproofmaterial)

## `Option<LaneFinalityAuthorityV1>` {#option-lanefinalityauthorityv1}

**Type:** Option

**Some:** [`LaneFinalityAuthorityV1`](#lanefinalityauthorityv1)

## `Option<LaneId>` {#option-laneid}

**Type:** Option

**Some:** [`LaneId`](#laneid)

## `Option<LanePayloadAvailabilityQcV1>` {#option-lanepayloadavailabilityqcv1}

**Type:** Option

**Some:** [`LanePayloadAvailabilityQcV1`](#lanepayloadavailabilityqcv1)

## `Option<LanePrivacyProof>` {#option-laneprivacyproof}

**Type:** Option

**Some:** [`LanePrivacyProof`](#laneprivacyproof)

## `Option<LaneRelayEnvelope>` {#option-lanerelayenvelope}

**Type:** Option

**Some:** [`LaneRelayEnvelope`](#lanerelayenvelope)

## `Option<LaneSwapMetadata>` {#option-laneswapmetadata}

**Type:** Option

**Some:** [`LaneSwapMetadata`](#laneswapmetadata)

## `Option<ManifestAliasBinding>` {#option-manifestaliasbinding}

**Type:** Option

**Some:** [`ManifestAliasBinding`](#manifestaliasbinding)

## `Option<ManifestDigest>` {#option-manifestdigest}

**Type:** Option

**Some:** [`ManifestDigest`](#manifestdigest)

## `Option<ManifestProvenance>` {#option-manifestprovenance}

**Type:** Option

**Some:** [`ManifestProvenance`](#manifestprovenance)

## `Option<MergeCarrierCommitmentV1>` {#option-mergecarriercommitmentv1}

**Type:** Option

**Some:** [`MergeCarrierCommitmentV1`](#mergecarriercommitmentv1)

## `Option<MergeExecutionBatch>` {#option-mergeexecutionbatch}

**Type:** Option

**Some:** [`MergeExecutionBatch`](#mergeexecutionbatch)

## `Option<MerkleTreeCommitment<LaneFinalityStatement>>` {#option-merkletreecommitment-lanefinalitystatement}

**Type:** Option

**Some:** [`MerkleTreeCommitment<LaneFinalityStatement>`](#merkletreecommitment-lanefinalitystatement)

## `Option<ModerationChallengeDecisionV1>` {#option-moderationchallengedecisionv1}

**Type:** Option

**Some:** [`ModerationChallengeDecisionV1`](#moderationchallengedecisionv1)

## `Option<ModerationFinalizedEventCursorV1>` {#option-moderationfinalizedeventcursorv1}

**Type:** Option

**Some:** [`ModerationFinalizedEventCursorV1`](#moderationfinalizedeventcursorv1)

## `Option<ModerationLedgerPolicyRecord>` {#option-moderationledgerpolicyrecord}

**Type:** Option

**Some:** [`ModerationLedgerPolicyRecord`](#moderationledgerpolicyrecord)

## `Option<ModerationLedgerStatusV1>` {#option-moderationledgerstatusv1}

**Type:** Option

**Some:** [`ModerationLedgerStatusV1`](#moderationledgerstatusv1)

## `Option<ModerationOutcomeRecordV1>` {#option-moderationoutcomerecordv1}

**Type:** Option

**Some:** [`ModerationOutcomeRecordV1`](#moderationoutcomerecordv1)

## `Option<ModerationPanelSelectionV1>` {#option-moderationpanelselectionv1}

**Type:** Option

**Some:** [`ModerationPanelSelectionV1`](#moderationpanelselectionv1)

## `Option<MultisigSignatures>` {#option-multisigsignatures}

**Type:** Option

**Some:** [`MultisigSignatures`](#multisigsignatures)

## `Option<MusubiAliasNameV1>` {#option-musubialiasnamev1}

**Type:** Option

**Some:** [`MusubiAliasNameV1`](#musubialiasnamev1)

## `Option<MusubiArchiveAvailabilityV1>` {#option-musubiarchiveavailabilityv1}

**Type:** Option

**Some:** [`MusubiArchiveAvailabilityV1`](#musubiarchiveavailabilityv1)

## `Option<MusubiDescriptionV1>` {#option-musubidescriptionv1}

**Type:** Option

**Some:** [`MusubiDescriptionV1`](#musubidescriptionv1)

## `Option<MusubiDocumentRefV1>` {#option-musubidocumentrefv1}

**Type:** Option

**Some:** [`MusubiDocumentRefV1`](#musubidocumentrefv1)

## `Option<MusubiFinalizedCursorV1>` {#option-musubifinalizedcursorv1}

**Type:** Option

**Some:** [`MusubiFinalizedCursorV1`](#musubifinalizedcursorv1)

## `Option<MusubiGovernanceActionDigestV1>` {#option-musubigovernanceactiondigestv1}

**Type:** Option

**Some:** [`MusubiGovernanceActionDigestV1`](#musubigovernanceactiondigestv1)

## `Option<MusubiPackageIdV1>` {#option-musubipackageidv1}

**Type:** Option

**Some:** [`MusubiPackageIdV1`](#musubipackageidv1)

## `Option<MusubiRegistrySnapshotV1>` {#option-musubiregistrysnapshotv1}

**Type:** Option

**Some:** [`MusubiRegistrySnapshotV1`](#musubiregistrysnapshotv1)

## `Option<MusubiVersionReqV1>` {#option-musubiversionreqv1}

**Type:** Option

**Some:** [`MusubiVersionReqV1`](#musubiversionreqv1)

## `Option<MusubiVersionV1>` {#option-musubiversionv1}

**Type:** Option

**Some:** [`MusubiVersionV1`](#musubiversionv1)

## `Option<Name>` {#option-name}

**Type:** Option

**Some:** [`Name`](#name)

## `Option<NativeAmxReceipt>` {#option-nativeamxreceipt}

**Type:** Option

**Some:** [`NativeAmxReceipt`](#nativeamxreceipt)

## `Option<NexusLaneRuntimeUpgradeHookStatus>` {#option-nexuslaneruntimeupgradehookstatus}

**Type:** Option

**Some:** [`NexusLaneRuntimeUpgradeHookStatus`](#nexuslaneruntimeupgradehookstatus)

## `Option<NexusStatus>` {#option-nexusstatus}

**Type:** Option

**Some:** [`NexusStatus`](#nexusstatus)

## `Option<NftId>` {#option-nftid}

**Type:** Option

**Some:** [`NftId`](#nftid)

## `Option<NonZero<u32>>` {#option-nonzero-u32}

**Type:** Option

**Some:** [`NonZero<u32>`](#nonzero-u32)

## `Option<NonZero<u64>>` {#option-nonzero-u64}

**Type:** Option

**Some:** [`NonZero<u64>`](#nonzero-u64)

## `Option<NposConsensusEffects>` {#option-nposconsensuseffects}

**Type:** Option

**Some:** [`NposConsensusEffects`](#nposconsensuseffects)

## `Option<OfflineStatus>` {#option-offlinestatus}

**Type:** Option

**Some:** [`OfflineStatus`](#offlinestatus)

## `Option<Option<NonZero<u64>>>` {#option-option-nonzero-u64}

**Type:** Option

**Some:** [`Option<NonZero<u64>>`](#option-nonzero-u64)

## `Option<OracleChangeStageFailure>` {#option-oraclechangestagefailure}

**Type:** Option

**Some:** [`OracleChangeStageFailure`](#oraclechangestagefailure)

## `Option<OrderbookBidEscrowBindingV1>` {#option-orderbookbidescrowbindingv1}

**Type:** Option

**Some:** [`OrderbookBidEscrowBindingV1`](#orderbookbidescrowbindingv1)

## `Option<OrderbookFinalizedCursorV1>` {#option-orderbookfinalizedcursorv1}

**Type:** Option

**Some:** [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1)

## `Option<OrderbookFinalizedEventCursorV1>` {#option-orderbookfinalizedeventcursorv1}

**Type:** Option

**Some:** [`OrderbookFinalizedEventCursorV1`](#orderbookfinalizedeventcursorv1)

## `Option<OrderbookOrderStatusV1>` {#option-orderbookorderstatusv1}

**Type:** Option

**Some:** [`OrderbookOrderStatusV1`](#orderbookorderstatusv1)

## `Option<OrderbookSettlementChannelStatusV1>` {#option-orderbooksettlementchannelstatusv1}

**Type:** Option

**Some:** [`OrderbookSettlementChannelStatusV1`](#orderbooksettlementchannelstatusv1)

## `Option<ParliamentAutomaticExecutionOutcomeV1>` {#option-parliamentautomaticexecutionoutcomev1}

**Type:** Option

**Some:** [`ParliamentAutomaticExecutionOutcomeV1`](#parliamentautomaticexecutionoutcomev1)

## `Option<ParliamentNoResultKindV1>` {#option-parliamentnoresultkindv1}

**Type:** Option

**Some:** [`ParliamentNoResultKindV1`](#parliamentnoresultkindv1)

## `Option<PeerId>` {#option-peerid}

**Type:** Option

**Some:** [`PeerId`](#peerid)

## `Option<PinFeePayment>` {#option-pinfeepayment}

**Type:** Option

**Some:** [`PinFeePayment`](#pinfeepayment)

## `Option<PinManifestFinalizedCursorV1>` {#option-pinmanifestfinalizedcursorv1}

**Type:** Option

**Some:** [`PinManifestFinalizedCursorV1`](#pinmanifestfinalizedcursorv1)

## `Option<PinStatusKindV1>` {#option-pinstatuskindv1}

**Type:** Option

**Some:** [`PinStatusKindV1`](#pinstatuskindv1)

## `Option<ProofAttachmentList>` {#option-proofattachmentlist}

**Type:** Option

**Some:** [`ProofAttachmentList`](#proofattachmentlist)

## `Option<ProofBlob>` {#option-proofblob}

**Type:** Option

**Some:** [`ProofBlob`](#proofblob)

## `Option<ProofId>` {#option-proofid}

**Type:** Option

**Some:** [`ProofId`](#proofid)

## `Option<ProofOutcomeEd25519AttestationV1>` {#option-proofoutcomeed25519attestationv1}

**Type:** Option

**Some:** [`ProofOutcomeEd25519AttestationV1`](#proofoutcomeed25519attestationv1)

## `Option<ProofOutcomeFinalizedCursorV1>` {#option-proofoutcomefinalizedcursorv1}

**Type:** Option

**Some:** [`ProofOutcomeFinalizedCursorV1`](#proofoutcomefinalizedcursorv1)

## `Option<ProofOutcomeFinalizedEventCursorV1>` {#option-proofoutcomefinalizedeventcursorv1}

**Type:** Option

**Some:** [`ProofOutcomeFinalizedEventCursorV1`](#proofoutcomefinalizedeventcursorv1)

## `Option<ProviderId>` {#option-providerid}

**Type:** Option

**Some:** [`ProviderId`](#providerid)

## `Option<Quantity>` {#option-quantity}

**Type:** Option

**Some:** [`Quantity`](#quantity)

## `Option<QuorumCertificate>` {#option-quorumcertificate}

**Type:** Option

**Some:** [`QuorumCertificate`](#quorumcertificate)

## `Option<RepairFinalizedCursorV1>` {#option-repairfinalizedcursorv1}

**Type:** Option

**Some:** [`RepairFinalizedCursorV1`](#repairfinalizedcursorv1)

## `Option<RepairFinalizedEventCursorV1>` {#option-repairfinalizedeventcursorv1}

**Type:** Option

**Some:** [`RepairFinalizedEventCursorV1`](#repairfinalizedeventcursorv1)

## `Option<RepairLedgerAppealRecordV1>` {#option-repairledgerappealrecordv1}

**Type:** Option

**Some:** [`RepairLedgerAppealRecordV1`](#repairledgerappealrecordv1)

## `Option<RepairLedgerLeaseV1>` {#option-repairledgerleasev1}

**Type:** Option

**Some:** [`RepairLedgerLeaseV1`](#repairledgerleasev1)

## `Option<RepairLedgerSlashRecordV1>` {#option-repairledgerslashrecordv1}

**Type:** Option

**Some:** [`RepairLedgerSlashRecordV1`](#repairledgerslashrecordv1)

## `Option<RepairLedgerTerminalOutcomeV1>` {#option-repairledgerterminaloutcomev1}

**Type:** Option

**Some:** [`RepairLedgerTerminalOutcomeV1`](#repairledgerterminaloutcomev1)

## `Option<ReputationJournalEventIdV1>` {#option-reputationjournaleventidv1}

**Type:** Option

**Some:** [`ReputationJournalEventIdV1`](#reputationjournaleventidv1)

## `Option<ReputationJournalFinalizedCursorV1>` {#option-reputationjournalfinalizedcursorv1}

**Type:** Option

**Some:** [`ReputationJournalFinalizedCursorV1`](#reputationjournalfinalizedcursorv1)

## `Option<ReputationJournalFinalizedEventCursorV1>` {#option-reputationjournalfinalizedeventcursorv1}

**Type:** Option

**Some:** [`ReputationJournalFinalizedEventCursorV1`](#reputationjournalfinalizedeventcursorv1)

## `Option<ReserveFinalizedCursorV1>` {#option-reservefinalizedcursorv1}

**Type:** Option

**Some:** [`ReserveFinalizedCursorV1`](#reservefinalizedcursorv1)

## `Option<ReserveFinalizedEventCursorV1>` {#option-reservefinalizedeventcursorv1}

**Type:** Option

**Some:** [`ReserveFinalizedEventCursorV1`](#reservefinalizedeventcursorv1)

## `Option<ReserveLifecycleStage>` {#option-reservelifecyclestage}

**Type:** Option

**Some:** [`ReserveLifecycleStage`](#reservelifecyclestage)

## `Option<RoleId>` {#option-roleid}

**Type:** Option

**Some:** [`RoleId`](#roleid)

## `Option<RuntimeUpgradeId>` {#option-runtimeupgradeid}

**Type:** Option

**Some:** [`RuntimeUpgradeId`](#runtimeupgradeid)

## `Option<RwaId>` {#option-rwaid}

**Type:** Option

**Some:** [`RwaId`](#rwaid)

## `Option<SccpRouteKeyV1>` {#option-sccproutekeyv1}

**Type:** Option

**Some:** [`SccpRouteKeyV1`](#sccproutekeyv1)

## `Option<SnapshotBootstrapAnchor>` {#option-snapshotbootstrapanchor}

**Type:** Option

**Some:** [`SnapshotBootstrapAnchor`](#snapshotbootstrapanchor)

## `Option<SorafsGarPolicy>` {#option-sorafsgarpolicy}

**Type:** Option

**Some:** [`SorafsGarPolicy`](#sorafsgarpolicy)

## `Option<SorafsGarPolicyDetail>` {#option-sorafsgarpolicydetail}

**Type:** Option

**Some:** [`SorafsGarPolicyDetail`](#sorafsgarpolicydetail)

## `Option<SorafsUri>` {#option-sorafsuri}

**Type:** Option

**Some:** [`SorafsUri`](#sorafsuri)

## `Option<SortOrder>` {#option-sortorder}

**Type:** Option

**Some:** [`SortOrder`](#sortorder)

## `Option<StreamingSoranetRoute>` {#option-streamingsoranetroute}

**Type:** Option

**Some:** [`StreamingSoranetRoute`](#streamingsoranetroute)

## `Option<StreamingTicketPolicy>` {#option-streamingticketpolicy}

**Type:** Option

**Some:** [`StreamingTicketPolicy`](#streamingticketpolicy)

## `Option<String>` {#option-string}

**Type:** Option

**Some:** `String`

## `Option<SumeragiConsensusStatus>` {#option-sumeragiconsensusstatus}

**Type:** Option

**Some:** [`SumeragiConsensusStatus`](#sumeragiconsensusstatus)

## `Option<TicketEnvelopeV1>` {#option-ticketenvelopev1}

**Type:** Option

**Some:** [`TicketEnvelopeV1`](#ticketenvelopev1)

## `Option<TimeTriggerRetryPolicy>` {#option-timetriggerretrypolicy}

**Type:** Option

**Some:** [`TimeTriggerRetryPolicy`](#timetriggerretrypolicy)

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

## `Option<Vec<Array<u8, 32>>>` {#option-vec-array-u8-32}

**Type:** Option

**Some:** [`Vec<Array<u8, 32>>`](#vec-array-u8-32)

## `Option<Vec<ContractErrorCodeDescriptor>>` {#option-vec-contracterrorcodedescriptor}

**Type:** Option

**Some:** [`Vec<ContractErrorCodeDescriptor>`](#vec-contracterrorcodedescriptor)

## `Option<Vec<EntrypointDescriptor>>` {#option-vec-entrypointdescriptor}

**Type:** Option

**Some:** [`Vec<EntrypointDescriptor>`](#vec-entrypointdescriptor)

## `Option<Vec<KotobaTranslationEntry>>` {#option-vec-kotobatranslationentry}

**Type:** Option

**Some:** [`Vec<KotobaTranslationEntry>`](#vec-kotobatranslationentry)

## `Option<Vec<StateDescriptor>>` {#option-vec-statedescriptor}

**Type:** Option

**Some:** [`Vec<StateDescriptor>`](#vec-statedescriptor)

## `Option<Vec<String>>` {#option-vec-string}

**Type:** Option

**Some:** [`Vec<String>`](#vec-string)

## `Option<Vec<u8>>` {#option-vec-u8}

**Type:** Option

**Some:** [`Vec<u8>`](#vec-u8)

## `Option<VerifyingKeyBox>` {#option-verifyingkeybox}

**Type:** Option

**Some:** [`VerifyingKeyBox`](#verifyingkeybox)

## `Option<VerifyingKeyId>` {#option-verifyingkeyid}

**Type:** Option

**Some:** [`VerifyingKeyId`](#verifyingkeyid)

## `Option<ViralCampaignBudget>` {#option-viralcampaignbudget}

**Type:** Option

**Some:** [`ViralCampaignBudget`](#viralcampaignbudget)

## `Option<bool>` {#option-bool}

**Type:** Option

**Some:** `bool`

## `Option<i32>` {#option-i32}

**Type:** Option

**Some:** [`i32`](#i32)

## `Option<i64>` {#option-i64}

**Type:** Option

**Some:** [`i64`](#i64)

## `Option<u128>` {#option-u128}

**Type:** Option

**Some:** `u128`

## `Option<u16>` {#option-u16}

**Type:** Option

**Some:** `u16`

## `Option<u32>` {#option-u32}

**Type:** Option

**Some:** `u32`

## `Option<u64>` {#option-u64}

**Type:** Option

**Some:** `u64`

## `OracleChangeClass` {#oraclechangeclass}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Low` | &mdash; | 0 |
  | `Medium` | &mdash; | 1 |
  | `High` | &mdash; | 2 |

## `OracleChangeEvidence` {#oraclechangeevidence}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `stage` | [`OracleChangeStage`](#oraclechangestage) |
  | `evidence_hash` | [`Hash`](#hash) |
  | `note` | [`Option<String>`](#option-string) |

## `OracleChangeFailure` {#oraclechangefailure}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `stage` | [`OracleChangeStage`](#oraclechangestage) |
  | `reason` | [`OracleChangeStageFailure`](#oraclechangestagefailure) |
  | `at` | `u64` |

## `OracleChangeId` {#oraclechangeid}

**Type:** Alias

**To:** [`Hash`](#hash)

## `OracleChangeProposal` {#oraclechangeproposal}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`OracleChangeId`](#oraclechangeid) |
  | `feed` | [`FeedConfig`](#feedconfig) |
  | `class` | [`OracleChangeClass`](#oraclechangeclass) |
  | `payload_hash` | [`Hash`](#hash) |
  | `proposer` | [`AccountId`](#accountid) |
  | `created_at` | `u64` |
  | `evidence` | [`Vec<OracleChangeEvidence>`](#vec-oraclechangeevidence) |
  | `stages` | [`Vec<OracleChangeStageRecord>`](#vec-oraclechangestagerecord) |
  | `status` | [`OracleChangeStatus`](#oraclechangestatus) |

## `OracleChangeProposed` {#oraclechangeproposed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `change_id` | [`OracleChangeId`](#oraclechangeid) |
  | `feed_id` | [`FeedId`](#feedid) |
  | `class` | [`OracleChangeClass`](#oraclechangeclass) |
  | `payload_hash` | [`Hash`](#hash) |
  | `proposer` | [`AccountId`](#accountid) |

## `OracleChangeStage` {#oraclechangestage}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Intake` | &mdash; | 0 |
  | `RulesCommittee` | &mdash; | 1 |
  | `CopReview` | &mdash; | 2 |
  | `TechnicalAudit` | &mdash; | 3 |
  | `PolicyJury` | &mdash; | 4 |
  | `Enactment` | &mdash; | 5 |

## `OracleChangeStageFailure` {#oraclechangestagefailure}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DeadlineMissed` | &mdash; | 0 |
  | `Rejected` | &mdash; | 1 |
  | `EvidenceMissing` | &mdash; | 2 |
  | `Rollback` | `String` | 3 |

## `OracleChangeStageRecord` {#oraclechangestagerecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `stage` | [`OracleChangeStage`](#oraclechangestage) |
  | `approvals` | [`SortedVec<AccountId>`](#sortedvec-accountid) |
  | `rejections` | [`SortedVec<AccountId>`](#sortedvec-accountid) |
  | `evidence` | [`Vec<Hash>`](#vec-hash) |
  | `started_at` | [`Option<u64>`](#option-u64) |
  | `deadline` | [`Option<u64>`](#option-u64) |
  | `completed_at` | [`Option<u64>`](#option-u64) |
  | `failure` | [`Option<OracleChangeStageFailure>`](#option-oraclechangestagefailure) |

## `OracleChangeStageUpdated` {#oraclechangestageupdated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `change_id` | [`OracleChangeId`](#oraclechangeid) |
  | `stage` | [`OracleChangeStage`](#oraclechangestage) |
  | `status` | [`OracleChangeStatus`](#oraclechangestatus) |
  | `approvals` | `u32` |
  | `rejections` | `u32` |
  | `evidence_hashes` | [`Vec<Hash>`](#vec-hash) |

## `OracleChangeStatus` {#oraclechangestatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Enacted` | `u64` | 1 |
  | `Failed` | [`OracleChangeFailure`](#oraclechangefailure) | 2 |

## `OracleDispute` {#oracledispute}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`OracleDisputeId`](#oracledisputeid) |
  | `feed_id` | [`FeedId`](#feedid) |
  | `slot` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `challenger` | [`AccountId`](#accountid) |
  | `target` | [`AccountId`](#accountid) |
  | `bond` | [`Quantity`](#quantity) |
  | `evidence` | [`Vec<Hash>`](#vec-hash) |
  | `reason` | `String` |
  | `status` | [`OracleDisputeStatus`](#oracledisputestatus) |

## `OracleDisputeId` {#oracledisputeid}

**Type:** Alias

**To:** `u64`

## `OracleDisputeOutcome` {#oracledisputeoutcome}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Upheld` | &mdash; | 0 |
  | `Reduced` | &mdash; | 1 |
  | `Frivolous` | &mdash; | 2 |

## `OracleDisputeStatus` {#oracledisputestatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Open` | &mdash; | 0 |
  | `Resolved` | [`OracleDisputeOutcome`](#oracledisputeoutcome) | 1 |
  | `Dismissed` | &mdash; | 2 |

## `OracleEvent` {#oracleevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `FeedProcessed` | [`FeedEventRecord`](#feedeventrecord) | 0 |
  | `PenaltyApplied` | [`OraclePenalty`](#oraclepenalty) | 1 |
  | `RewardApplied` | [`OracleReward`](#oraclereward) | 2 |
  | `TwitterBindingRecorded` | [`TwitterBindingRecorded`](#twitterbindingrecorded) | 3 |
  | `TwitterBindingRevoked` | [`TwitterBindingRevoked`](#twitterbindingrevoked) | 4 |
  | `DisputeOpened` | [`OracleDispute`](#oracledispute) | 5 |
  | `DisputeResolved` | [`OracleDispute`](#oracledispute) | 6 |
  | `ChangeProposed` | [`OracleChangeProposed`](#oraclechangeproposed) | 7 |
  | `ChangeStageUpdated` | [`OracleChangeStageUpdated`](#oraclechangestageupdated) | 8 |
  | `DefiAttestationRecorded` | [`DefiOracleAttestationRecorded`](#defioracleattestationrecorded) | 9 |

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

## `OraclePenalty` {#oraclepenalty}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `feed_config_version` | [`FeedConfigVersion`](#feedconfigversion) |
  | `slot` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `oracle_id` | [`AccountId`](#accountid) |
  | `kind` | [`OraclePenaltyKind`](#oraclepenaltykind) |
  | `amount` | [`Quantity`](#quantity) |

## `OraclePenaltyKind` {#oraclepenaltykind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Outlier` | &mdash; | 0 |
  | `Error` | &mdash; | 1 |
  | `NoShow` | &mdash; | 2 |
  | `BadSignature` | &mdash; | 3 |
  | `Dispute` | &mdash; | 4 |

## `OracleProviderKey` {#oracleproviderkey}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `provider_id` | [`AccountId`](#accountid) |

## `OracleProviderStats` {#oracleproviderstats}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `inliers` | `u64` |
  | `outliers` | `u64` |
  | `errors` | `u64` |
  | `no_shows` | `u64` |
  | `rewards` | `u64` |
  | `slashes` | `u64` |

## `OracleProviderStatsRecord` {#oracleproviderstatsrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `key` | [`OracleProviderKey`](#oracleproviderkey) |
  | `stats` | [`OracleProviderStats`](#oracleproviderstats) |

## `OracleReward` {#oraclereward}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `feed_config_version` | [`FeedConfigVersion`](#feedconfigversion) |
  | `slot` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `oracle_id` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |

## `OrderbookAdmissionPolicyRecord` {#orderbookadmissionpolicyrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`OrderbookAdmissionPolicyV1`](#orderbookadmissionpolicyv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `activated_at_unix` | `u64` |
  | `activated_by` | [`AccountId`](#accountid) |

## `OrderbookAdmissionPolicyV1` {#orderbookadmissionpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `revision` | `u64` |
  | `predecessor_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `market_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `matcher_authority` | [`AccountId`](#accountid) |
  | `settlement_authority` | [`AccountId`](#accountid) |
  | `paused` | `bool` |
  | `min_order_gib` | `u64` |
  | `max_order_gib` | `u64` |
  | `price_tick_micro_xor` | `u64` |
  | `max_maker_fee_bps` | `u16` |
  | `max_taker_fee_bps` | `u16` |
  | `max_order_lifetime_secs` | `u64` |
  | `max_receipt_age_secs` | `u64` |
  | `max_clock_skew_secs` | `u64` |
  | `max_receipt_bytes` | `u64` |
  | `max_receipts_per_channel` | `u32` |

## `OrderbookBidEscrowBindingV1` {#orderbookbidescrowbindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow_id` | [`EscrowId`](#escrowid) |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `initial_xor_locked` | [`XorQuantity`](#xorquantity) |

## `OrderbookCancellationRecord` {#orderbookcancellationrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `order_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `owner` | [`AccountId`](#accountid) |
  | `canonical_cancel` | [`Vec<u8>`](#vec-u8) |
  | `cancelled_at_unix` | `u64` |
  | `cancelled_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `OrderbookFinalizedCursorV1` {#orderbookfinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `OrderbookFinalizedEventCursorV1` {#orderbookfinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `OrderbookFinalizedEventPageV1` {#orderbookfinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1) |
  | `events` | [`Vec<OrderbookFinalizedEventV1>`](#vec-orderbookfinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<OrderbookFinalizedEventCursorV1>`](#option-orderbookfinalizedeventcursorv1) |

## `OrderbookFinalizedEventV1` {#orderbookfinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `event` | [`SorafsOrderbookLedgerEvent`](#sorafsorderbookledgerevent) |

## `OrderbookLedgerStatusV1` {#orderbookledgerstatusv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `open_orders` | `u64` |
  | `partially_filled_orders` | `u64` |
  | `filled_orders` | `u64` |
  | `cancelled_orders` | `u64` |
  | `expired_orders` | `u64` |
  | `provider_revoked_orders` | `u64` |
  | `trades` | `u64` |
  | `settlement_receipts` | `u64` |
  | `settlement_channels` | `u64` |
  | `open_settlement_channels` | `u64` |
  | `book_revision` | `u64` |
  | `last_match_scan_book_revision` | `u64` |
  | `next_admission_sequence` | `u64` |
  | `next_trade_sequence` | `u64` |
  | `updated_at_unix` | `u64` |

## `OrderbookOrderPageV1` {#orderbookorderpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1) |
  | `orders` | [`Vec<OrderbookOrderRecord>`](#vec-orderbookorderrecord) |
  | `has_more` | `bool` |
  | `next_after_order_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `OrderbookOrderRecord` {#orderbookorderrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `order_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `owner` | [`AccountId`](#accountid) |
  | `canonical_order` | [`Vec<u8>`](#vec-u8) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `admitted_at_unix` | `u64` |
  | `admission_sequence` | `u64` |
  | `remaining_gib` | `u64` |
  | `bid_escrow` | [`Option<OrderbookBidEscrowBindingV1>`](#option-orderbookbidescrowbindingv1) |
  | `provider_id` | [`Option<ProviderId>`](#option-providerid) |
  | `status` | [`OrderbookOrderStatusV1`](#orderbookorderstatusv1) |
  | `updated_at_unix` | `u64` |
  | `canonical_cancel` | [`Option<Vec<u8>>`](#option-vec-u8) |
  | `cancelled_at_unix` | [`Option<u64>`](#option-u64) |
  | `cancelled_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `OrderbookOrderStatusV1` {#orderbookorderstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `open` | &mdash; | 0 |
  | `partially_filled` | &mdash; | 1 |
  | `filled` | &mdash; | 2 |
  | `cancelled` | &mdash; | 3 |
  | `expired` | &mdash; | 4 |
  | `provider_revoked` | &mdash; | 5 |

## `OrderbookSettlementChannelPageV1` {#orderbooksettlementchannelpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1) |
  | `channels` | [`Vec<OrderbookSettlementChannelRecord>`](#vec-orderbooksettlementchannelrecord) |
  | `has_more` | `bool` |
  | `next_after_channel_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `OrderbookSettlementChannelRecord` {#orderbooksettlementchannelrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `channel_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `trade_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `buyer` | [`AccountId`](#accountid) |
  | `provider` | [`AccountId`](#accountid) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `settlement_authority` | [`AccountId`](#accountid) |
  | `total_bytes` | `u64` |
  | `remaining_bytes` | `u64` |
  | `initial_xor_locked` | [`XorQuantity`](#xorquantity) |
  | `remaining_xor_locked` | [`XorQuantity`](#xorquantity) |
  | `initial_fee_xor_locked` | [`XorQuantity`](#xorquantity) |
  | `remaining_fee_xor_locked` | [`XorQuantity`](#xorquantity) |
  | `status` | [`OrderbookSettlementChannelStatusV1`](#orderbooksettlementchannelstatusv1) |
  | `opened_at_unix` | `u64` |
  | `expires_at_unix` | `u64` |
  | `updated_at_unix` | `u64` |

## `OrderbookSettlementChannelStatusV1` {#orderbooksettlementchannelstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `open` | &mdash; | 0 |
  | `closed` | &mdash; | 1 |
  | `expired` | &mdash; | 2 |

## `OrderbookSettlementReceiptPageV1` {#orderbooksettlementreceiptpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1) |
  | `receipts` | [`Vec<OrderbookSettlementReceiptRecord>`](#vec-orderbooksettlementreceiptrecord) |
  | `has_more` | `bool` |
  | `next_after_receipt_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `OrderbookSettlementReceiptRecord` {#orderbooksettlementreceiptrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `receipt_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `channel_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `trade_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `canonical_receipt` | [`Vec<u8>`](#vec-u8) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `admitted_at_unix` | `u64` |
  | `recorded_by` | [`AccountId`](#accountid) |

## `OrderbookTradePageV1` {#orderbooktradepagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`OrderbookFinalizedCursorV1`](#orderbookfinalizedcursorv1) |
  | `trades` | [`Vec<OrderbookTradeRecord>`](#vec-orderbooktraderecord) |
  | `has_more` | `bool` |
  | `next_after_trade_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `OrderbookTradeRecord` {#orderbooktraderecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trade_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `maker_order_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `taker_order_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `trade_sequence` | `u64` |
  | `canonical_trade` | [`Vec<u8>`](#vec-u8) |
  | `channel_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `book_revision` | `u64` |
  | `recorded_at_unix` | `u64` |

## `OutlierPolicy` {#outlierpolicy}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Mad` | `u16` | 0 |
  | `Absolute` | [`AbsoluteOutlier`](#absoluteoutlier) | 1 |

## `Pagination` {#pagination}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `limit` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `offset` | `u64` |

## `Parameter` {#parameter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Sumeragi` | [`SumeragiParameter`](#sumeragiparameter) | 0 |
  | `Block` | [`BlockParameter`](#blockparameter) | 1 |
  | `Transaction` | [`TransactionParameter`](#transactionparameter) | 2 |
  | `SmartContract` | [`SmartContractParameter`](#smartcontractparameter) | 3 |
  | `Executor` | [`SmartContractParameter`](#smartcontractparameter) | 4 |
  | `Custom` | [`CustomParameter`](#customparameter) | 5 |

## `ParameterChanged` {#parameterchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `old_value` | [`Parameter`](#parameter) |
  | `new_value` | [`Parameter`](#parameter) |

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
  | `custom` | [`SortedMap<CustomParameterId, CustomParameter>`](#sortedmap-customparameterid-customparameter) |

## `ParentCommitJustification` {#parentcommitjustification}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `certificate` | [`Option<QuorumCertificate>`](#option-quorumcertificate) |

## `ParliamentAggregateOutcomeV1` {#parliamentaggregateoutcomev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Approved` | &mdash; | 0 |
  | `Rejected` | &mdash; | 1 |
  | `NoQuorum` | &mdash; | 2 |
  | `NoResult` | &mdash; | 3 |

## `ParliamentAggregateTallyV1` {#parliamentaggregatetallyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `original_seats` | `u32` |
  | `accepted_ballots` | `u32` |
  | `aye` | `u32` |
  | `nay` | `u32` |
  | `abstain` | `u32` |

## `ParliamentAutomaticExecutionFailedV1` {#parliamentautomaticexecutionfailedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `effect_preimage_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `failure_root` | [`Array<u8, 32>`](#array-u8-32) |

## `ParliamentAutomaticExecutionOutcomeV1` {#parliamentautomaticexecutionoutcomev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Enacted` | &mdash; | 0 |
  | `Superseded` | [`ParliamentAutomaticSupersededV1`](#parliamentautomaticsupersededv1) | 1 |
  | `ExecutionFailed` | [`ParliamentAutomaticExecutionFailedV1`](#parliamentautomaticexecutionfailedv1) | 2 |

## `ParliamentAutomaticSupersededV1` {#parliamentautomaticsupersededv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `observed_head` | [`GovernanceExpectedHeadV1`](#governanceexpectedheadv1) |

## `ParliamentBodies` {#parliamentbodies}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `selection_epoch` | `u64` |
  | `rosters` | [`SortedMap<ParliamentBody, ParliamentRoster>`](#sortedmap-parliamentbody-parliamentroster) |

## `ParliamentBody` {#parliamentbody}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `RulesCommittee` | &mdash; | 0 |
  | `AgendaCouncil` | &mdash; | 1 |
  | `InterestPanel` | &mdash; | 2 |
  | `ReviewPanel` | &mdash; | 3 |
  | `CoordinationCouncil` | &mdash; | 4 |
  | `MpcCommittee` | &mdash; | 5 |
  | `FmaCommittee` | &mdash; | 6 |
  | `OversightCommittee` | &mdash; | 7 |
  | `PolicyJury` | &mdash; | 8 |
  | `ConfirmationJury` | &mdash; | 9 |

## `ParliamentConcentrationWarningV1` {#parliamentconcentrationwarningv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body_instance_id` | [`BodyInstanceId`](#bodyinstanceid) |
  | `body` | [`ParliamentBody`](#parliamentbody) |
  | `target_seats` | `u32` |
  | `sealed_seats` | `u32` |
  | `eligible_candidates` | `u32` |
  | `cross_body_assignment_cap` | `u32` |

## `ParliamentContractDeploymentOriginV1` {#parliamentcontractdeploymentoriginv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposer` | [`AccountId`](#accountid) |
  | `proposal_content_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `governance_attempt_id` | [`Array<u8, 32>`](#array-u8-32) |

## `ParliamentLifecycleTransitionKindV1` {#parliamentlifecycletransitionkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `EscalateRisk` | &mdash; | 0 |
  | `CompleteQualification` | &mdash; | 1 |
  | `RegisterSortitionRequest` | &mdash; | 2 |
  | `ConsumeSortitionPulseBatch` | &mdash; | 3 |
  | `BeginInvitationAcceptance` | &mdash; | 4 |
  | `FailBodyElectionNoRoster` | &mdash; | 5 |
  | `SealBodyRoster` | &mdash; | 6 |
  | `AdvanceBodyPhase` | &mdash; | 7 |
  | `RecordAttemptAbsence` | &mdash; | 8 |
  | `EndorsePublicFinding` | &mdash; | 9 |
  | `RegisterBallotAttempt` | &mdash; | 10 |
  | `CloseBallotRegistration` | &mdash; | 11 |
  | `FreezeBallotSurvivors` | &mdash; | 12 |
  | `FreezeTimedOvnCorpus` | &mdash; | 13 |
  | `BeginBallotOpeningBatch` | &mdash; | 14 |
  | `FailBallotNoResult` | &mdash; | 15 |
  | `FinalizeOpenedBallot` | &mdash; | 16 |
  | `MarkEnacted` | &mdash; | 17 |
  | `MarkSuperseded` | &mdash; | 18 |
  | `MarkExecutionFailed` | &mdash; | 19 |
  | `RecordInvitationResponse` | &mdash; | 20 |
  | `RegisterBallotParticipant` | &mdash; | 21 |
  | `RecordBallotDropout` | &mdash; | 22 |
  | `FailPublicFindingNoResult` | &mdash; | 23 |

## `ParliamentNoResultKindV1` {#parliamentnoresultkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `PublicFindingQuorumUnreachable` | &mdash; | 0 |
  | `PublicFindingDeadlineExpired` | &mdash; | 1 |
  | `BallotRegistrationDeadlineExpired` | &mdash; | 2 |
  | `BallotSurvivorDeadlineExpired` | &mdash; | 3 |
  | `BallotCommitmentDeadlineExpired` | &mdash; | 4 |
  | `BallotReleasePulseUnavailable` | &mdash; | 5 |
  | `BallotOpeningDeadlineExpired` | &mdash; | 6 |
  | `SortitionRetriesExhausted` | &mdash; | 7 |
  | `ConfirmationJuryCapacityUnavailable` | &mdash; | 8 |
  | `RandomnessRedrawBudgetExhausted` | &mdash; | 9 |

## `ParliamentRoster` {#parliamentroster}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`ParliamentBody`](#parliamentbody) |
  | `epoch` | `u64` |
  | `members` | [`Vec<AccountId>`](#vec-accountid) |
  | `alternates` | [`Vec<AccountId>`](#vec-accountid) |
  | `candidate_count` | `u32` |
  | `derived_by` | [`CouncilDerivationKind`](#councilderivationkind) |

## `PayloadEncoding` {#payloadencoding}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `reed_solomon16` | &mdash; | 0 |

## `PayloadManifest` {#payloadmanifest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `subject` | [`BlockSubject`](#blocksubject) |
  | `payload_size_bytes` | `u64` |
  | `layout` | [`DataAvailabilityLayout`](#dataavailabilitylayout) |
  | `chunk_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `chunk_root` | [`Hash`](#hash) |

## `PdpOutcomeProjectionV1` {#pdpoutcomeprojectionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source_sequence` | `u64` |
  | `epoch_id` | `u64` |
  | `status` | [`PdpOutcomeStatusV1`](#pdpoutcomestatusv1) |
  | `proof_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `provider_attestation` | [`Option<ProofOutcomeEd25519AttestationV1>`](#option-proofoutcomeed25519attestationv1) |
  | `sampled_segments` | `u16` |
  | `sampled_hot_leaves` | `u16` |
  | `sampled_bytes` | `u64` |
  | `issued_at_unix` | `u64` |
  | `response_deadline_unix` | `u64` |
  | `decided_at_unix` | `u64` |

## `PdpOutcomeStatusV1` {#pdpoutcomestatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `accepted` | &mdash; | 0 |
  | `deadline_expired` | &mdash; | 1 |
  | `submission_late` | &mdash; | 2 |
  | `future_timestamp` | &mdash; | 3 |
  | `invalid_proof` | &mdash; | 4 |
  | `admission_revoked` | &mdash; | 5 |
  | `admission_inactive` | &mdash; | 6 |
  | `storage_unavailable` | &mdash; | 7 |

## `Peer` {#peer}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `address` | [`SocketAddr`](#socketaddr) |
  | `id` | [`PeerId`](#peerid) |

## `PeerEvent` {#peerevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Added` | [`PeerId`](#peerid) | 0 |
  | `Removed` | [`PeerId`](#peerid) | 1 |

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

## `PinFeePayment` {#pinfeepayment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `paid_by` | [`AccountId`](#accountid) |
  | `fee_asset_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `treasury_account_id` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |

## `PinManifestFinalizedCursorV1` {#pinmanifestfinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `PinManifestFinalizedRecordV1` {#pinmanifestfinalizedrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`PinManifestFinalizedCursorV1`](#pinmanifestfinalizedcursorv1) |
  | `manifest` | [`PinManifestRecord`](#pinmanifestrecord) |

## `PinManifestPageV1` {#pinmanifestpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`PinManifestFinalizedCursorV1`](#pinmanifestfinalizedcursorv1) |
  | `charged_usage` | [`PinResourceUsage`](#pinresourceusage) |
  | `manifests` | [`Vec<PinManifestSummaryV1>`](#vec-pinmanifestsummaryv1) |
  | `has_more` | `bool` |
  | `next_after_digest` | [`Option<ManifestDigest>`](#option-manifestdigest) |

## `PinManifestRecord` {#pinmanifestrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `digest` | [`ManifestDigest`](#manifestdigest) |
  | `root_cid` | [`ManifestRootCid`](#manifestrootcid) |
  | `chunker` | [`ChunkerProfileHandle`](#chunkerprofilehandle) |
  | `chunk_digest_sha3_256` | [`Array<u8, 32>`](#array-u8-32) |
  | `por_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `content_length` | `u64` |
  | `policy` | [`PinPolicy`](#pinpolicy) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `submitted_epoch` | `u64` |
  | `approved_epoch` | [`Option<u64>`](#option-u64) |
  | `alias` | [`Option<ManifestAliasBinding>`](#option-manifestaliasbinding) |
  | `successor_of` | [`Option<ManifestDigest>`](#option-manifestdigest) |
  | `metadata` | [`Metadata`](#metadata) |
  | `status` | [`PinStatus`](#pinstatus) |
  | `retirement_reason` | [`Option<String>`](#option-string) |
  | `council_envelope_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `pin_fee_payment` | [`Option<PinFeePayment>`](#option-pinfeepayment) |

## `PinManifestSummaryV1` {#pinmanifestsummaryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `digest` | [`ManifestDigest`](#manifestdigest) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `submitted_epoch` | `u64` |
  | `approved_epoch` | [`Option<u64>`](#option-u64) |
  | `content_length` | `u64` |
  | `retention_epoch` | `u64` |
  | `status` | [`PinStatus`](#pinstatus) |
  | `successor_of` | [`Option<ManifestDigest>`](#option-manifestdigest) |

## `PinPolicy` {#pinpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `min_replicas` | `u16` |
  | `storage_class` | [`StorageClass`](#storageclass) |
  | `retention_epoch` | `u64` |

## `PinResourceUsage` {#pinresourceusage}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `manifest_count` | `u64` |
  | `content_bytes` | `u64` |

## `PinStatus` {#pinstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Approved` | `u64` | 1 |
  | `Retired` | `u64` | 2 |

## `PinStatusKindV1` {#pinstatuskindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `pending` | &mdash; | 0 |
  | `approved` | &mdash; | 1 |
  | `retired` | &mdash; | 2 |

## `PipelineEventBox` {#pipelineeventbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transaction` | [`TransactionEvent`](#transactionevent) | 0 |
  | `Block` | [`BlockEvent`](#blockevent) | 1 |
  | `Warning` | [`PipelineWarning`](#pipelinewarning) | 2 |
  | `Merge` | [`MergeLedgerEvent`](#mergeledgerevent) | 3 |
  | `Witness` | [`ExecWitnessMsg`](#execwitnessmsg) | 4 |

## `PipelineEventFilterBox` {#pipelineeventfilterbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Transaction` | [`TransactionEventFilter`](#transactioneventfilter) | 0 |
  | `Block` | [`BlockEventFilter`](#blockeventfilter) | 1 |
  | `Merge` | [`MergeLedgerEventFilter`](#mergeledgereventfilter) | 2 |
  | `Witness` | [`WitnessEventFilter`](#witnesseventfilter) | 3 |

## `PipelineWarning` {#pipelinewarning}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `header` | [`BlockHeader`](#blockheader) |
  | `kind` | `String` |
  | `details` | `String` |

## `PopCommitmentRootRecordV1` {#popcommitmentrootrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `root_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `tree_version` | `u64` |
  | `tree_size` | `u64` |
  | `canonical_root_payload` | [`Vec<u8>`](#vec-u8) |
  | `recorded_at_epoch` | `u64` |
  | `recorded_by` | [`AccountId`](#accountid) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `audit_sequence` | `u64` |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `PopCredentialCommitmentRecordV1` {#popcredentialcommitmentrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `commitment` | [`PopCredentialCommitmentV1`](#popcredentialcommitmentv1) |
  | `committed_at_epoch` | `u64` |
  | `committed_by` | [`AccountId`](#accountid) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `audit_sequence` | `u64` |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `PopCredentialCommitmentV1` {#popcredentialcommitmentv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `credential_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `revocation_nonce_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `commitment_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `commitment_tree_version` | `u64` |
  | `revocation_list_version` | `u64` |
  | `issued_at_epoch` | `u64` |
  | `expires_at_epoch` | `u64` |

## `PopIssuerPolicyRecordV1` {#popissuerpolicyrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`PopIssuerPolicyV1`](#popissuerpolicyv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `activated_at_epoch` | `u64` |
  | `activated_by` | [`AccountId`](#accountid) |
  | `audit_sequence` | `u64` |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `PopIssuerPolicyV1` {#popissuerpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `revision` | `u64` |
  | `predecessor_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `issuer_id` | `String` |
  | `issuer_account` | [`AccountId`](#accountid) |
  | `issuer_public_key` | [`Array<u8, 32>`](#array-u8-32) |
  | `max_credentials_per_batch` | `u16` |
  | `max_revocations_per_publication` | `u32` |
  | `max_credential_lifetime_secs` | `u64` |
  | `max_future_clock_skew_secs` | `u64` |
  | `paused` | `bool` |

## `PopRegistryAuditDigestRecordV1` {#popregistryauditdigestrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `kind` | [`PopRegistryAuditEventKindV1`](#popregistryauditeventkindv1) |
  | `payload_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `previous_audit_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `recorded_at_epoch` | `u64` |
  | `recorded_by` | [`AccountId`](#accountid) |

## `PopRegistryAuditEventKindV1` {#popregistryauditeventkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `policy_activated` | &mdash; | 0 |
  | `credential_batch_committed` | &mdash; | 1 |
  | `revocation_list_published` | &mdash; | 2 |

## `PopRegistryRevocationReasonV1` {#popregistryrevocationreasonv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `rotated` | &mdash; | 0 |
  | `holder_requested` | &mdash; | 1 |
  | `enrollment_invalid` | &mdash; | 2 |
  | `governance_suspension` | &mdash; | 3 |
  | `expired` | &mdash; | 4 |

## `PopRegistryStatusV1` {#popregistrystatusv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `active_root_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `active_tree_version` | `u64` |
  | `active_revocation_list_version` | `u64` |
  | `active_revocation_root` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `credential_commitment_count` | `u64` |
  | `revoked_credential_count` | `u64` |
  | `audit_sequence` | `u64` |
  | `audit_head` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `updated_at_epoch` | `u64` |

## `PopRevocationPublicationRecordV1` {#poprevocationpublicationrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `list_version` | `u64` |
  | `commitment_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `revocation_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `entry_count` | `u32` |
  | `canonical_revocation_list_payload` | [`Vec<u8>`](#vec-u8) |
  | `recorded_at_epoch` | `u64` |
  | `recorded_by` | [`AccountId`](#accountid) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `audit_sequence` | `u64` |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `PopRevocationRecordV1` {#poprevocationrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `revocation_nonce_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `credential_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `list_version` | `u64` |
  | `commitment_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `revoked_at_epoch` | `u64` |
  | `reason` | [`PopRegistryRevocationReasonV1`](#popregistryrevocationreasonv1) |
  | `recorded_at_epoch` | `u64` |
  | `recorded_by` | [`AccountId`](#accountid) |
  | `admitted_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `audit_sequence` | `u64` |
  | `audit_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `PorTerminalExcludedKindV1` {#porterminalexcludedkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `admission_revoked` | &mdash; | 0 |
  | `admission_inactive` | &mdash; | 1 |

## `PorTerminalFailureKindV1` {#porterminalfailurekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `deadline_expired` | &mdash; | 0 |
  | `submission_late` | &mdash; | 1 |
  | `invalid_proof` | &mdash; | 2 |
  | `storage_unavailable` | &mdash; | 3 |

## `PorTerminalOutcomeV1` {#porterminaloutcomev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `challenge_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `manifest_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `epoch_id` | `u64` |
  | `drand_round` | `u64` |
  | `forced` | `bool` |
  | `sample_count` | `u16` |
  | `failed_samples` | `u16` |
  | `issued_at_unix_ms` | `u64` |
  | `deadline_at_unix_ms` | `u64` |
  | `responded_at_unix_ms` | [`Option<u64>`](#option-u64) |
  | `decided_at_unix_ms` | `u64` |
  | `proof_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `repair_task_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `verifier_latency_ms` | [`Option<u32>`](#option-u32) |
  | `status` | [`PorTerminalStatusV1`](#porterminalstatusv1) |

## `PorTerminalStatusV1` {#porterminalstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `verified` | &mdash; | 0 |
  | `repaired` | &mdash; | 1 |
  | `failed` | [`PorTerminalFailureKindV1`](#porterminalfailurekindv1) | 2 |
  | `excluded` | [`PorTerminalExcludedKindV1`](#porterminalexcludedkindv1) | 3 |

## `PotrOutcomeProjectionV1` {#potroutcomeprojectionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `status` | [`PotrOutcomeStatusV1`](#potroutcomestatusv1) |
  | `deadline_ms` | `u32` |
  | `latency_ms` | `u32` |
  | `requested_at_ms` | `u64` |
  | `responded_at_ms` | `u64` |
  | `recorded_at_ms` | `u64` |
  | `range_start` | `u64` |
  | `range_end` | `u64` |
  | `gateway_public_key` | [`Array<u8, 32>`](#array-u8-32) |
  | `governed_provider_key_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `canonical_signed_receipt` | [`Vec<u8>`](#vec-u8) |

## `PotrOutcomeStatusV1` {#potroutcomestatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `success` | &mdash; | 0 |
  | `missed_deadline` | &mdash; | 1 |
  | `provider_error` | &mdash; | 2 |
  | `gateway_error` | &mdash; | 3 |
  | `client_cancelled` | &mdash; | 4 |

## `ProofAttachment` {#proofattachment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `proof` | [`ProofBox`](#proofbox) |
  | `vk_ref` | [`VerifyingKeyId`](#verifyingkeyid) |
  | `vk_commitment` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `envelope_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `lane_privacy` | [`Option<LanePrivacyProof>`](#option-laneprivacyproof) |

## `ProofAttachmentList` {#proofattachmentlist}

**Type:** Alias

**To:** [`Vec<ProofAttachment>`](#vec-proofattachment)

## `ProofBlob` {#proofblob}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `payload` | [`Vec<u8>`](#vec-u8) |
  | `expiry_slot` | [`Option<u64>`](#option-u64) |

## `ProofBox` {#proofbox}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `bytes` | [`Vec<u8>`](#vec-u8) |

## `ProofEvent` {#proofevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Verified` | [`ProofVerified`](#proofverified) | 0 |
  | `Rejected` | [`ProofRejected`](#proofrejected) | 1 |
  | `Pruned` | [`ProofPruned`](#proofpruned) | 2 |

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

## `ProofOutcomeEd25519AttestationV1` {#proofoutcomeed25519attestationv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `public_key` | [`Array<u8, 32>`](#array-u8-32) |
  | `signature` | [`Array<u8, 64>`](#array-u8-64) |

## `ProofOutcomeFinalizedCursorV1` {#proofoutcomefinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `ProofOutcomeFinalizedEventCursorV1` {#proofoutcomefinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `ProofOutcomeFinalizedEventPageV1` {#proofoutcomefinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ProofOutcomeFinalizedCursorV1`](#proofoutcomefinalizedcursorv1) |
  | `events` | [`Vec<ProofOutcomeFinalizedEventV1>`](#vec-proofoutcomefinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<ProofOutcomeFinalizedEventCursorV1>`](#option-proofoutcomefinalizedeventcursorv1) |

## `ProofOutcomeFinalizedEventV1` {#proofoutcomefinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `outcome` | [`ProofOutcomeRecordV1`](#proofoutcomerecordv1) |

## `ProofOutcomeFinalizedRecordV1` {#proofoutcomefinalizedrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ProofOutcomeFinalizedCursorV1`](#proofoutcomefinalizedcursorv1) |
  | `outcome` | [`ProofOutcomeRecordV1`](#proofoutcomerecordv1) |

## `ProofOutcomeKindV1` {#proofoutcomekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `pdp` | &mdash; | 0 |
  | `potr` | &mdash; | 1 |

## `ProofOutcomeProjectionV1` {#proofoutcomeprojectionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `pdp` | [`PdpOutcomeProjectionV1`](#pdpoutcomeprojectionv1) | 0 |
  | `potr` | [`PotrOutcomeProjectionV1`](#potroutcomeprojectionv1) | 1 |

## `ProofOutcomeRecordV1` {#proofoutcomerecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `identity_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `outcome_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `manifest_digest` | [`ManifestDigest`](#manifestdigest) |
  | `admission_envelope_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `committed_at_unix_ms` | `u64` |
  | `projection` | [`ProofOutcomeProjectionV1`](#proofoutcomeprojectionv1) |

## `ProofPruneOrigin` {#proofpruneorigin}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Insert` | &mdash; | 0 |
  | `Manual` | &mdash; | 1 |

## `ProofPruned` {#proofpruned}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `removed` | [`Vec<ProofId>`](#vec-proofid) |
  | `remaining` | `u64` |
  | `cap` | `u64` |
  | `grace_blocks` | `u64` |
  | `prune_batch` | `u64` |
  | `pruned_at_height` | `u64` |
  | `pruned_by` | [`AccountId`](#accountid) |
  | `origin` | [`ProofPruneOrigin`](#proofpruneorigin) |

## `ProofRecord` {#proofrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`ProofId`](#proofid) |
  | `vk_ref` | [`Option<VerifyingKeyId>`](#option-verifyingkeyid) |
  | `vk_commitment` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `status` | [`ProofStatus`](#proofstatus) |
  | `verified_at_height` | [`Option<u64>`](#option-u64) |
  | `bridge` | [`Option<BridgeProofRecord>`](#option-bridgeproofrecord) |

## `ProofRejected` {#proofrejected}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`ProofId`](#proofid) |
  | `vk_ref` | [`Option<VerifyingKeyId>`](#option-verifyingkeyid) |
  | `vk_commitment` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `call_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `envelope_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `ProofStatus` {#proofstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Submitted` | &mdash; | 0 |
  | `Verified` | &mdash; | 1 |
  | `Rejected` | &mdash; | 2 |

## `ProofVerified` {#proofverified}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`ProofId`](#proofid) |
  | `vk_ref` | [`Option<VerifyingKeyId>`](#option-verifyingkeyid) |
  | `vk_commitment` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `call_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `envelope_hash` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `Proposal` {#proposal}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `proposer` | `u32` |
  | `subject` | [`BlockSubject`](#blocksubject) |
  | `manifest` | [`PayloadManifest`](#payloadmanifest) |
  | `justification` | [`ProposalJustification`](#proposaljustification) |
  | `signature` | [`Vec<u8>`](#vec-u8) |

## `ProposalContentId` {#proposalcontentid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `ProposalJustification` {#proposaljustification}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `parent_commit` | [`ParentCommitJustification`](#parentcommitjustification) | 0 |
  | `timeout` | [`TimeoutJustification`](#timeoutjustification) | 1 |

## `ProviderDisputeEventV1` {#providerdisputeeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dispute_id` | [`CapacityDisputeId`](#capacitydisputeid) |
  | `kind` | [`ProviderDisputeKindV1`](#providerdisputekindv1) |
  | `evidence_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `submitted_at_unix_ms` | `u64` |
  | `status` | [`ProviderDisputeStatusV1`](#providerdisputestatusv1) |

## `ProviderDisputeKindV1` {#providerdisputekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `replication_shortfall` | &mdash; | 0 |
  | `uptime_breach` | &mdash; | 1 |
  | `proof_failure` | &mdash; | 2 |
  | `fee_dispute` | &mdash; | 3 |
  | `other` | &mdash; | 4 |

## `ProviderDisputeResolutionV1` {#providerdisputeresolutionv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `outcome` | [`CapacityDisputeOutcome`](#capacitydisputeoutcome) |
  | `resolved_at_unix_ms` | `u64` |
  | `decision_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `rationale` | [`Option<String>`](#option-string) |

## `ProviderDisputeStatusV1` {#providerdisputestatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `opened` | &mdash; | 0 |
  | `resolved` | [`ProviderDisputeResolutionV1`](#providerdisputeresolutionv1) | 1 |

## `ProviderId` {#providerid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `ProviderIngestCompletionAuthorityV1` {#provideringestcompletionauthorityv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_owner` | [`AccountId`](#accountid) |
  | `signer_policy` | [`ProviderIngestCompletionSignerPolicyV1`](#provideringestcompletionsignerpolicyv1) |

## `ProviderIngestCompletionSignerPolicyV1` {#provideringestcompletionsignerpolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `revision` | `u64` |
  | `predecessor_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `ProviderIngestFinalizedAnchorV1` {#provideringestfinalizedanchorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

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

## `QueryOutput` {#queryoutput}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `batch` | [`QueryOutputBatchBoxTuple`](#queryoutputbatchboxtuple) |
  | `remaining_items` | [`Option<u64>`](#option-u64) |
  | `has_more` | `bool` |
  | `continue_cursor` | [`Option<ForwardCursor>`](#option-forwardcursor) |

## `QueryOutputBatchBox` {#queryoutputbatchbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `PublicKey` | [`Vec<PublicKey>`](#vec-publickey) | 0 |
  | `String` | [`Vec<String>`](#vec-string) | 1 |
  | `Metadata` | [`Vec<Metadata>`](#vec-metadata) | 2 |
  | `Json` | [`Vec<Json>`](#vec-json) | 3 |
  | `Numeric` | [`Vec<Numeric>`](#vec-numeric) | 4 |
  | `Name` | [`Vec<Name>`](#vec-name) | 5 |
  | `DomainId` | [`Vec<DomainId>`](#vec-domainid) | 6 |
  | `Domain` | [`Vec<Domain>`](#vec-domain) | 7 |
  | `AccountId` | [`Vec<AccountId>`](#vec-accountid) | 8 |
  | `Account` | [`Vec<Account>`](#vec-account) | 9 |
  | `AssetId` | [`Vec<AssetId>`](#vec-assetid) | 10 |
  | `Asset` | [`Vec<Asset>`](#vec-asset) | 11 |
  | `AssetDefinitionId` | [`Vec<AssetDefinitionId>`](#vec-assetdefinitionid) | 12 |
  | `AssetDefinition` | [`Vec<AssetDefinition>`](#vec-assetdefinition) | 13 |
  | `RepoAgreement` | [`Vec<RepoAgreement>`](#vec-repoagreement) | 14 |
  | `NftId` | [`Vec<NftId>`](#vec-nftid) | 15 |
  | `Nft` | [`Vec<Nft>`](#vec-nft) | 16 |
  | `RwaId` | [`Vec<RwaId>`](#vec-rwaid) | 17 |
  | `Rwa` | [`Vec<Rwa>`](#vec-rwa) | 18 |
  | `Role` | [`Vec<Role>`](#vec-role) | 19 |
  | `Parameter` | [`Vec<Parameter>`](#vec-parameter) | 20 |
  | `Permission` | [`Vec<Permission>`](#vec-permission) | 21 |
  | `CommittedTransaction` | [`Vec<CommittedTransaction>`](#vec-committedtransaction) | 22 |
  | `TransactionResult` | [`Vec<TransactionResult>`](#vec-transactionresult) | 23 |
  | `TransactionResultHash` | [`Vec<HashOf<TransactionResult>>`](#vec-hashof-transactionresult) | 24 |
  | `TransactionEntrypoint` | [`Vec<TransactionEntrypoint>`](#vec-transactionentrypoint) | 25 |
  | `TransactionEntrypointHash` | [`Vec<HashOf<TransactionEntrypoint>>`](#vec-hashof-transactionentrypoint) | 26 |
  | `Peer` | [`Vec<PeerId>`](#vec-peerid) | 27 |
  | `RoleId` | [`Vec<RoleId>`](#vec-roleid) | 28 |
  | `TriggerId` | [`Vec<TriggerId>`](#vec-triggerid) | 29 |
  | `Trigger` | [`Vec<Trigger>`](#vec-trigger) | 30 |
  | `Action` | [`Vec<Action>`](#vec-action) | 31 |
  | `Block` | [`Vec<SignedBlock>`](#vec-signedblock) | 32 |
  | `BlockHeader` | [`Vec<BlockHeader>`](#vec-blockheader) | 33 |
  | `BlockHeaderHash` | [`Vec<HashOf<BlockHeader>>`](#vec-hashof-blockheader) | 34 |
  | `ProofRecord` | [`Vec<ProofRecord>`](#vec-proofrecord) | 35 |
  | `OracleFeedConfig` | [`Vec<FeedConfig>`](#vec-feedconfig) | 36 |
  | `OracleFeedEventRecord` | [`Vec<FeedEventRecord>`](#vec-feedeventrecord) | 37 |
  | `OracleProviderStatsRecord` | [`Vec<OracleProviderStatsRecord>`](#vec-oracleproviderstatsrecord) | 38 |
  | `OracleDispute` | [`Vec<OracleDispute>`](#vec-oracledispute) | 39 |
  | `OracleChangeProposal` | [`Vec<OracleChangeProposal>`](#vec-oraclechangeproposal) | 40 |
  | `TwitterBindingRecord` | [`Vec<TwitterBindingRecord>`](#vec-twitterbindingrecord) | 41 |
  | `DefiOracleAttestation` | [`Vec<DefiOracleAttestation>`](#vec-defioracleattestation) | 42 |
  | `AssetEscrowRecord` | [`Vec<AssetEscrowRecord>`](#vec-assetescrowrecord) | 43 |
  | `FeeSponsorProgram` | [`Vec<FeeSponsorProgram>`](#vec-feesponsorprogram) | 44 |
  | `FeeSponsorProgramId` | [`Vec<FeeSponsorProgramId>`](#vec-feesponsorprogramid) | 45 |

## `QueryOutputBatchBoxTuple` {#queryoutputbatchboxtuple}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `tuple` | [`Vec<QueryOutputBatchBox>`](#vec-queryoutputbatchbox) |

## `QueryParams` {#queryparams}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `pagination` | [`Pagination`](#pagination) |
  | `sorting` | [`Sorting`](#sorting) |
  | `fetch_size` | [`FetchSize`](#fetchsize) |

## `QueryRequest` {#queryrequest}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Singular` | [`SingularQueryBox`](#singularquerybox) | 0 |
  | `Start` | [`QueryWithParams`](#querywithparams) | 1 |
  | `Continue` | [`ForwardCursor`](#forwardcursor) | 2 |

## `QueryRequestWithAuthority` {#queryrequestwithauthority}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `authority` | [`AccountId`](#accountid) |
  | `creation_time_ms` | `u64` |
  | `time_to_live_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `nonce` | [`Array<u8, 32>`](#array-u8-32) |
  | `request` | [`QueryRequest`](#queryrequest) |

## `QueryResponse` {#queryresponse}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Singular` | [`SingularQueryOutputBox`](#singularqueryoutputbox) | 0 |
  | `Iterable` | [`QueryOutput`](#queryoutput) | 1 |

## `QuerySignature` {#querysignature}

**Type:** Alias

**To:** [`SignatureOf<QueryRequestWithAuthority>`](#signatureof-queryrequestwithauthority)

## `QueryWithParams` {#querywithparams}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `params` | [`QueryParams`](#queryparams) |

## `QuorumCertificate` {#quorumcertificate}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `proposal_round` | [`ConsensusRound`](#consensusround) |
  | `phase` | [`SumeragiV2GlobalPhase`](#sumeragiv2globalphase) |
  | `subject` | [`BlockSubject`](#blocksubject) |
  | `execution_commitment` | [`ExecutionCommitment`](#executioncommitment) |
  | `signers` | [`Vec<u32>`](#vec-u32) |
  | `aggregate_signature` | [`Vec<u8>`](#vec-u8) |

## `RadRevokeReason` {#radrevokereason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `OperatorRequest` | &mdash; | 0 |
  | `GovernanceAction` | &mdash; | 1 |
  | `IntegrityViolation` | &mdash; | 2 |

## `RecoveryGuardian` {#recoveryguardian}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `weight` | `u16` |

## `RemoteSpendIntent` {#remotespendintent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_dsid` | [`DataSpaceId`](#dataspaceid) |
  | `op` | [`SpendOp`](#spendop) |

## `RepairFinalizedCursorV1` {#repairfinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `RepairFinalizedEventCursorV1` {#repairfinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `RepairFinalizedEventPageV1` {#repairfinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`RepairFinalizedCursorV1`](#repairfinalizedcursorv1) |
  | `events` | [`Vec<RepairFinalizedEventV1>`](#vec-repairfinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<RepairFinalizedEventCursorV1>`](#option-repairfinalizedeventcursorv1) |

## `RepairFinalizedEventV1` {#repairfinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `event` | [`SorafsRepairLedgerEvent`](#sorafsrepairledgerevent) |

## `RepairFinalizedStatusV1` {#repairfinalizedstatusv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`RepairFinalizedCursorV1`](#repairfinalizedcursorv1) |
  | `status` | [`RepairLedgerStatusV1`](#repairledgerstatusv1) |

## `RepairFinalizedTaskV1` {#repairfinalizedtaskv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`RepairFinalizedCursorV1`](#repairfinalizedcursorv1) |
  | `task` | [`RepairLedgerTaskV1`](#repairledgertaskv1) |

## `RepairLedgerActionReceiptV1` {#repairledgeractionreceiptv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `idempotency_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `action_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `resulting_revision` | `u64` |

## `RepairLedgerAppealRecordV1` {#repairledgerappealrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `appeal_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `slash_proposal_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `appellant` | [`AccountId`](#accountid) |
  | `evidence_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `reason` | `String` |
  | `submitted_at_unix_ms` | `u64` |

## `RepairLedgerCompletedV1` {#repairledgercompletedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `evidence_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `RepairLedgerEscalatedV1` {#repairledgerescalatedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `slash_proposal_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `RepairLedgerFailedV1` {#repairledgerfailedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `failure_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `RepairLedgerLeaseV1` {#repairledgerleasev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `owner` | [`AccountId`](#accountid) |
  | `generation` | `u64` |
  | `acquired_at_unix_ms` | `u64` |
  | `renewed_at_unix_ms` | `u64` |
  | `expires_at_unix_ms` | `u64` |

## `RepairLedgerSlashRecordV1` {#repairledgerslashrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `canonical_proposal` | [`Vec<u8>`](#vec-u8) |
  | `proposal_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `submitted_at_unix_ms` | `u64` |

## `RepairLedgerStatusV1` {#repairledgerstatusv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `tasks` | `u64` |
  | `leased_tasks` | `u64` |
  | `terminal_outcomes` | `u64` |
  | `completed` | `u64` |
  | `failed` | `u64` |
  | `escalated` | `u64` |
  | `slash_proposals` | `u64` |
  | `appeals` | `u64` |
  | `updated_at_unix_ms` | `u64` |

## `RepairLedgerTaskPageV1` {#repairledgertaskpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`RepairFinalizedCursorV1`](#repairfinalizedcursorv1) |
  | `tasks` | [`Vec<RepairLedgerTaskV1>`](#vec-repairledgertaskv1) |
  | `has_more` | `bool` |
  | `next_after_task_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `RepairLedgerTaskV1` {#repairledgertaskv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `task_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `source_identity` | [`Array<u8, 32>`](#array-u8-32) |
  | `ticket_id` | `String` |
  | `canonical_report` | [`Vec<u8>`](#vec-u8) |
  | `manifest_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `submitted_at_unix_ms` | `u64` |
  | `revision` | `u64` |
  | `lease` | [`Option<RepairLedgerLeaseV1>`](#option-repairledgerleasev1) |
  | `terminal_outcome` | [`Option<RepairLedgerTerminalOutcomeV1>`](#option-repairledgerterminaloutcomev1) |
  | `slash` | [`Option<RepairLedgerSlashRecordV1>`](#option-repairledgerslashrecordv1) |
  | `appeal` | [`Option<RepairLedgerAppealRecordV1>`](#option-repairledgerappealrecordv1) |
  | `action_receipts` | [`Vec<RepairLedgerActionReceiptV1>`](#vec-repairledgeractionreceiptv1) |
  | `updated_at_unix_ms` | `u64` |

## `RepairLedgerTerminalKindV1` {#repairledgerterminalkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `completed` | [`RepairLedgerCompletedV1`](#repairledgercompletedv1) | 0 |
  | `failed` | [`RepairLedgerFailedV1`](#repairledgerfailedv1) | 1 |
  | `escalated` | [`RepairLedgerEscalatedV1`](#repairledgerescalatedv1) | 2 |

## `RepairLedgerTerminalOutcomeV1` {#repairledgerterminaloutcomev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`RepairLedgerTerminalKindV1`](#repairledgerterminalkindv1) |
  | `lease_generation` | `u64` |
  | `finalized_by` | [`AccountId`](#accountid) |
  | `finalized_at_unix_ms` | `u64` |

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

## `ReplicationOrderId` {#replicationorderid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `RepoAccountEvent` {#repoaccountevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Initiated` | [`RepoAccountInitiated`](#repoaccountinitiated) | 0 |
  | `Settled` | [`RepoAccountSettled`](#repoaccountsettled) | 1 |
  | `MarginCalled` | [`RepoAccountMarginCalled`](#repoaccountmargincalled) | 2 |

## `RepoAccountInitiated` {#repoaccountinitiated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `counterparty` | [`AccountId`](#accountid) |
  | `agreement` | [`RepoAgreement`](#repoagreement) |
  | `role` | [`RepoAccountRole`](#repoaccountrole) |

## `RepoAccountMarginCalled` {#repoaccountmargincalled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `counterparty` | [`AccountId`](#accountid) |
  | `agreement_id` | [`RepoAgreementId`](#repoagreementid) |
  | `margin_timestamp_ms` | `u64` |
  | `role` | [`RepoAccountRole`](#repoaccountrole) |

## `RepoAccountRole` {#repoaccountrole}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Initiator` | &mdash; | 0 |
  | `Counterparty` | &mdash; | 1 |
  | `Custodian` | &mdash; | 2 |

## `RepoAccountSettled` {#repoaccountsettled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `account` | [`AccountId`](#accountid) |
  | `counterparty` | [`AccountId`](#accountid) |
  | `agreement_id` | [`RepoAgreementId`](#repoagreementid) |
  | `cash_leg` | [`RepoCashLeg`](#repocashleg) |
  | `collateral_leg` | [`RepoCollateralLeg`](#repocollateralleg) |
  | `settled_timestamp_ms` | `u64` |
  | `role` | [`RepoAccountRole`](#repoaccountrole) |

## `RepoAgreement` {#repoagreement}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RepoAgreementId`](#repoagreementid) |
  | `initiator` | [`AccountId`](#accountid) |
  | `counterparty` | [`AccountId`](#accountid) |
  | `custodian` | [`Option<AccountId>`](#option-accountid) |
  | `cash_leg` | [`RepoCashLeg`](#repocashleg) |
  | `cash_source` | [`AssetId`](#assetid) |
  | `collateral_leg` | [`RepoCollateralLeg`](#repocollateralleg) |
  | `collateral_custody_asset` | [`AssetId`](#assetid) |
  | `rate_bps` | `u16` |
  | `maturity_timestamp_ms` | `u64` |
  | `initiated_timestamp_ms` | `u64` |
  | `last_margin_check_timestamp_ms` | `u64` |
  | `governance` | [`RepoGovernance`](#repogovernance) |
  | `settlement_timestamp_ms` | [`Option<u64>`](#option-u64) |

## `RepoAgreementId` {#repoagreementid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | [`Name`](#name) |

## `RepoCashLeg` {#repocashleg}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `quantity` | [`Quantity`](#quantity) |

## `RepoCollateralLeg` {#repocollateralleg}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `quantity` | [`Quantity`](#quantity) |
  | `metadata` | [`Metadata`](#metadata) |

## `RepoGovernance` {#repogovernance}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `haircut_bps` | `u16` |
  | `margin_frequency_secs` | `u64` |

## `ReportEntry` {#reportentry}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `oracle_id` | [`AccountId`](#accountid) |
  | `observation_hash` | [`HashOf<ObservationBody>`](#hashof-observationbody) |
  | `value` | [`ObservationValue`](#observationvalue) |
  | `outlier` | `bool` |

## `ReputationJournalAuthorityPolicyRecordV1` {#reputationjournalauthoritypolicyrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`ReputationJournalAuthorityPolicyV1`](#reputationjournalauthoritypolicyv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `activated_by` | [`AccountId`](#accountid) |
  | `activated_at_unix_ms` | `u64` |

## `ReputationJournalAuthorityPolicyV1` {#reputationjournalauthoritypolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `revision` | `u64` |
  | `predecessor_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `por_recorder_authority` | [`AccountId`](#accountid) |
  | `dispute_recorder_authority` | [`AccountId`](#accountid) |
  | `token_recorder_authority` | [`AccountId`](#accountid) |
  | `max_source_age_ms` | `u64` |

## `ReputationJournalEntryV1` {#reputationjournalentryv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `event_id` | [`ReputationJournalEventIdV1`](#reputationjournaleventidv1) |
  | `source_id` | [`ReputationJournalSourceIdV1`](#reputationjournalsourceidv1) |
  | `source_revision` | `u32` |
  | `predecessor_event_id` | [`Option<ReputationJournalEventIdV1>`](#option-reputationjournaleventidv1) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `authority_policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `recorded_by` | [`AccountId`](#accountid) |
  | `source_time_unix_ms` | `u64` |
  | `payload` | [`ReputationJournalPayloadV1`](#reputationjournalpayloadv1) |

## `ReputationJournalEventIdV1` {#reputationjournaleventidv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `ReputationJournalFinalizedCursorV1` {#reputationjournalfinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `finalized_at_unix_ms` | `u64` |

## `ReputationJournalFinalizedEventCursorV1` {#reputationjournalfinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `ReputationJournalFinalizedEventPageV1` {#reputationjournalfinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ReputationJournalFinalizedCursorV1`](#reputationjournalfinalizedcursorv1) |
  | `events` | [`Vec<ReputationJournalFinalizedEventV1>`](#vec-reputationjournalfinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<ReputationJournalFinalizedEventCursorV1>`](#option-reputationjournalfinalizedeventcursorv1) |

## `ReputationJournalFinalizedEventV1` {#reputationjournalfinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `recorded_at_unix_ms` | `u64` |
  | `entry` | [`ReputationJournalEntryV1`](#reputationjournalentryv1) |

## `ReputationJournalPayloadV1` {#reputationjournalpayloadv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `por_terminal` | [`PorTerminalOutcomeV1`](#porterminaloutcomev1) | 0 |
  | `provider_dispute` | [`ProviderDisputeEventV1`](#providerdisputeeventv1) | 1 |
  | `stream_token_validation` | [`StreamTokenValidationOutcomeV1`](#streamtokenvalidationoutcomev1) | 2 |

## `ReputationJournalSourceIdV1` {#reputationjournalsourceidv1}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `ReputationJournalSourceKindV1` {#reputationjournalsourcekindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `por` | &mdash; | 0 |
  | `provider_dispute` | &mdash; | 1 |
  | `stream_token` | &mdash; | 2 |

## `ReserveAppealPageV1` {#reserveappealpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ReserveFinalizedCursorV1`](#reservefinalizedcursorv1) |
  | `appeals` | [`Vec<ReserveAppealRecordV1>`](#vec-reserveappealrecordv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `ReserveAppealRecordV1` {#reserveappealrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `appeal_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `submitted_by` | [`AccountId`](#accountid) |
  | `requested_stage` | [`ReserveLifecycleStage`](#reservelifecyclestage) |
  | `reason` | `String` |
  | `evidence_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `expected_provider_revision` | `u64` |
  | `status` | [`ReserveAppealStatusV1`](#reserveappealstatusv1) |
  | `submitted_at_unix` | `u64` |
  | `decided_by` | [`Option<AccountId>`](#option-accountid) |
  | `decided_at_unix` | [`Option<u64>`](#option-u64) |
  | `rationale` | [`Option<String>`](#option-string) |

## `ReserveAppealStatusV1` {#reserveappealstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Accepted` | &mdash; | 1 |
  | `Rejected` | &mdash; | 2 |

## `ReserveAuthorityPolicyRecordV1` {#reserveauthoritypolicyrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`ReserveAuthorityPolicyV1`](#reserveauthoritypolicyv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `activated_by` | [`AccountId`](#accountid) |
  | `activated_at_unix` | `u64` |

## `ReserveAuthorityPolicyV1` {#reserveauthoritypolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `revision` | `u64` |
  | `predecessor_policy_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `economics` | [`ReservePolicyV1`](#reservepolicyv1) |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `custody_account` | [`AccountId`](#accountid) |
  | `treasury_account` | [`AccountId`](#accountid) |
  | `operations_authority` | [`AccountId`](#accountid) |
  | `decision_authority` | [`AccountId`](#accountid) |
  | `grace_period_days` | `u16` |
  | `default_after_days` | `u16` |
  | `max_provider_debt` | [`XorQuantity`](#xorquantity) |
  | `max_pending_movements_per_provider` | `u32` |
  | `max_open_appeals_per_provider` | `u32` |

## `ReserveDuration` {#reserveduration}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Monthly` | &mdash; | 0 |
  | `Quarterly` | &mdash; | 1 |
  | `Annual` | &mdash; | 2 |

## `ReserveFinalizedCursorV1` {#reservefinalizedcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |

## `ReserveFinalizedEventCursorV1` {#reservefinalizedeventcursorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |

## `ReserveFinalizedEventPageV1` {#reservefinalizedeventpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ReserveFinalizedCursorV1`](#reservefinalizedcursorv1) |
  | `events` | [`Vec<ReserveFinalizedEventV1>`](#vec-reservefinalizedeventv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<ReserveFinalizedEventCursorV1>`](#option-reservefinalizedeventcursorv1) |

## `ReserveFinalizedEventV1` {#reservefinalizedeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `block_height` | `u64` |
  | `block_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `event_index` | `u32` |
  | `event` | [`SorafsReserveLedgerEvent`](#sorafsreserveledgerevent) |

## `ReserveLifecycleStage` {#reservelifecyclestage}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Active` | &mdash; | 0 |
  | `Warning` | &mdash; | 1 |
  | `Grace` | &mdash; | 2 |
  | `Delinquent` | &mdash; | 3 |
  | `Default` | &mdash; | 4 |

## `ReserveMovementKindV1` {#reservemovementkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `TopUp` | &mdash; | 0 |
  | `Withdrawal` | &mdash; | 1 |

## `ReserveMovementPageV1` {#reservemovementpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ReserveFinalizedCursorV1`](#reservefinalizedcursorv1) |
  | `movements` | [`Vec<ReserveMovementRecordV1>`](#vec-reservemovementrecordv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |

## `ReserveMovementRecordV1` {#reservemovementrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `movement_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `kind` | [`ReserveMovementKindV1`](#reservemovementkindv1) |
  | `amount` | [`XorQuantity`](#xorquantity) |
  | `requested_by` | [`AccountId`](#accountid) |
  | `expected_provider_revision` | `u64` |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `status` | [`ReserveMovementStatusV1`](#reservemovementstatusv1) |
  | `requested_at_unix` | `u64` |
  | `decided_by` | [`Option<AccountId>`](#option-accountid) |
  | `decided_at_unix` | [`Option<u64>`](#option-u64) |
  | `rationale` | [`Option<String>`](#option-string) |

## `ReserveMovementStatusV1` {#reservemovementstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Pending` | &mdash; | 0 |
  | `Approved` | &mdash; | 1 |
  | `Rejected` | &mdash; | 2 |

## `ReservePolicyV1` {#reservepolicyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u8` |
  | `rent_rates` | [`Vec<ClassRentRate>`](#vec-classrentrate) |
  | `duration_factors` | [`DurationFactorSet`](#durationfactorset) |
  | `tiers` | [`Vec<ReserveTierConfig>`](#vec-reservetierconfig) |
  | `top_up_threshold_bps` | `u16` |

## `ReserveProviderAccountPageV1` {#reserveprovideraccountpagev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `finalized_cursor` | [`ReserveFinalizedCursorV1`](#reservefinalizedcursorv1) |
  | `accounts` | [`Vec<ReserveProviderAccountV1>`](#vec-reserveprovideraccountv1) |
  | `has_more` | `bool` |
  | `next_after` | [`Option<ProviderId>`](#option-providerid) |

## `ReserveProviderAccountV1` {#reserveprovideraccountv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `terms` | [`ReserveProviderTermsV1`](#reserveprovidertermsv1) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `revision` | `u64` |
  | `reserve_balance` | [`XorQuantity`](#xorquantity) |
  | `debt_principal` | [`XorQuantity`](#xorquantity) |
  | `accrued_interest` | [`XorQuantity`](#xorquantity) |
  | `credit_cap` | [`XorQuantity`](#xorquantity) |
  | `lifecycle_stage` | [`ReserveLifecycleStage`](#reservelifecyclestage) |
  | `days_past_due` | `u16` |
  | `pending_movements` | `u32` |
  | `open_appeals` | `u32` |
  | `rent_charged_through_unix` | `u64` |
  | `interest_accrued_at_unix` | `u64` |
  | `updated_at_unix` | `u64` |

## `ReserveProviderTermsV1` {#reserveprovidertermsv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `provider_account` | [`AccountId`](#accountid) |
  | `tier` | [`ReserveTier`](#reservetier) |
  | `storage_class` | [`StorageClass`](#storageclass) |
  | `duration` | [`ReserveDuration`](#reserveduration) |
  | `capacity_gib` | `u64` |

## `ReserveTier` {#reservetier}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `TierA` | &mdash; | 0 |
  | `TierB` | &mdash; | 1 |
  | `TierC` | &mdash; | 2 |

## `ReserveTierConfig` {#reservetierconfig}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `tier` | [`ReserveTier`](#reservetier) |
  | `underwriting_ratio_bps` | `u32` |
  | `credit_line_cap_bps` | [`Option<u32>`](#option-u32) |
  | `interest_apr_bps` | `u16` |

## `ResolvedAssetDefinitionAliasV1` {#resolvedassetdefinitionaliasv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `canonical_name` | [`AssetDefinitionAlias`](#assetdefinitionalias) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |

## `Result<Vec<DataTriggerStep>, TransactionRejectionReason>` {#result-vec-datatriggerstep-transactionrejectionreason}

**Type:** Result

**Ok:** [`Vec<DataTriggerStep>`](#vec-datatriggerstep)

**Err:** [`TransactionRejectionReason`](#transactionrejectionreason)

## `RetentionPolicy` {#retentionpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `hot_retention_secs` | `u64` |
  | `cold_retention_secs` | `u64` |
  | `required_replicas` | `u16` |
  | `storage_class` | [`StorageClass`](#storageclass) |
  | `governance_tag` | [`GovernanceTag`](#governancetag) |

## `RiskClass` {#riskclass}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Low` | &mdash; | 0 |
  | `Medium` | &mdash; | 1 |
  | `High` | &mdash; | 2 |

## `RiskTierV1` {#risktierv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Routine` | &mdash; | 0 |
  | `Standard` | &mdash; | 1 |
  | `Constitutional` | &mdash; | 2 |
  | `Emergency` | &mdash; | 3 |

## `Role` {#role}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RoleId`](#roleid) |
  | `permissions` | [`SortedVec<Permission>`](#sortedvec-permission) |
  | `permission_epochs` | [`SortedMap<Permission, u64>`](#sortedmap-permission-u64) |

## `RoleEvent` {#roleevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`Role`](#role) | 0 |
  | `Deleted` | [`RoleId`](#roleid) | 1 |
  | `PermissionAdded` | [`RolePermissionChanged`](#rolepermissionchanged) | 2 |
  | `PermissionRemoved` | [`RolePermissionChanged`](#rolepermissionchanged) | 3 |

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

## `RolePermissionChanged` {#rolepermissionchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `role` | [`RoleId`](#roleid) |
  | `permission` | [`Permission`](#permission) |

## `RuntimeUpgradeActivated` {#runtimeupgradeactivated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RuntimeUpgradeId`](#runtimeupgradeid) |
  | `abi_version` | `u16` |
  | `at_height` | `u64` |

## `RuntimeUpgradeCanceled` {#runtimeupgradecanceled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RuntimeUpgradeId`](#runtimeupgradeid) |

## `RuntimeUpgradeEvent` {#runtimeupgradeevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Proposed` | [`RuntimeUpgradeProposed`](#runtimeupgradeproposed) | 0 |
  | `Activated` | [`RuntimeUpgradeActivated`](#runtimeupgradeactivated) | 1 |
  | `Canceled` | [`RuntimeUpgradeCanceled`](#runtimeupgradecanceled) | 2 |

## `RuntimeUpgradeEventFilter` {#runtimeupgradeeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id_matcher` | [`Option<RuntimeUpgradeId>`](#option-runtimeupgradeid) |
  | `event_set` | [`RuntimeUpgradeEventSet`](#runtimeupgradeeventset) |

## `RuntimeUpgradeEventSet` {#runtimeupgradeeventset}

**Type:** Bitmap

**Repr:** u32

**Masks:**

  | Field name | Field value |
  | --: | :-- |
  | `Proposed` | `0x1` |
  | `Activated` | `0x2` |
  | `Canceled` | `0x4` |

## `RuntimeUpgradeId` {#runtimeupgradeid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `RuntimeUpgradeProposed` {#runtimeupgradeproposed}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RuntimeUpgradeId`](#runtimeupgradeid) |
  | `abi_version` | `u16` |
  | `start_height` | `u64` |
  | `end_height` | `u64` |

## `Rwa` {#rwa}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`RwaId`](#rwaid) |
  | `quantity` | [`Quantity`](#quantity) |
  | `spec` | [`NumericSpec`](#numericspec) |
  | `primary_reference` | `String` |
  | `status` | [`Option<Name>`](#option-name) |
  | `metadata` | [`Metadata`](#metadata) |
  | `parents` | [`Vec<RwaParentRef>`](#vec-rwaparentref) |
  | `controls` | [`RwaControlPolicy`](#rwacontrolpolicy) |
  | `owned_by` | [`AccountId`](#accountid) |
  | `is_frozen` | `bool` |
  | `held_quantity` | [`Quantity`](#quantity) |

## `RwaControlPolicy` {#rwacontrolpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `controller_accounts` | [`Vec<AccountId>`](#vec-accountid) |
  | `controller_roles` | [`Vec<RoleId>`](#vec-roleid) |
  | `freeze_enabled` | `bool` |
  | `hold_enabled` | `bool` |
  | `force_transfer_enabled` | `bool` |
  | `redeem_enabled` | `bool` |

## `RwaControlsChanged` {#rwacontrolschanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `rwa` | [`RwaId`](#rwaid) |
  | `controls` | [`RwaControlPolicy`](#rwacontrolpolicy) |

## `RwaEvent` {#rwaevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`Rwa`](#rwa) | 0 |
  | `MetadataInserted` | [`MetadataChanged<RwaId>`](#metadatachanged-rwaid) | 1 |
  | `MetadataRemoved` | [`MetadataChanged<RwaId>`](#metadatachanged-rwaid) | 2 |
  | `OwnerChanged` | [`RwaOwnerChanged`](#rwaownerchanged) | 3 |
  | `Split` | [`RwaSplit`](#rwasplit) | 4 |
  | `Merged` | [`RwaMerged`](#rwamerged) | 5 |
  | `Redeemed` | [`RwaQuantityChanged`](#rwaquantitychanged) | 6 |
  | `Frozen` | [`RwaId`](#rwaid) | 7 |
  | `Unfrozen` | [`RwaId`](#rwaid) | 8 |
  | `Held` | [`RwaHoldChanged`](#rwaholdchanged) | 9 |
  | `Released` | [`RwaHoldChanged`](#rwaholdchanged) | 10 |
  | `ForceTransferred` | [`RwaSplit`](#rwasplit) | 11 |
  | `ControlsChanged` | [`RwaControlsChanged`](#rwacontrolschanged) | 12 |

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

## `RwaHoldChanged` {#rwaholdchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `rwa` | [`RwaId`](#rwaid) |
  | `quantity` | [`Quantity`](#quantity) |

## `RwaId` {#rwaid}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `hash` | [`Hash`](#hash) |

## `RwaMerged` {#rwamerged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `child` | [`RwaId`](#rwaid) |
  | `parents` | [`Vec<RwaParentRef>`](#vec-rwaparentref) |

## `RwaOwnerChanged` {#rwaownerchanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `rwa` | [`RwaId`](#rwaid) |
  | `new_owner` | [`AccountId`](#accountid) |

## `RwaParentRef` {#rwaparentref}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `rwa` | [`RwaId`](#rwaid) |
  | `quantity` | [`Quantity`](#quantity) |

## `RwaQuantityChanged` {#rwaquantitychanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `rwa` | [`RwaId`](#rwaid) |
  | `quantity` | [`Quantity`](#quantity) |

## `RwaSplit` {#rwasplit}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source` | [`RwaId`](#rwaid) |
  | `child` | [`RwaId`](#rwaid) |
  | `quantity` | [`Quantity`](#quantity) |
  | `new_owner` | [`AccountId`](#accountid) |

## `SccpLaneIdV1` {#sccplaneidv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `source` | [`SccpNetworkV1`](#sccpnetworkv1) |
  | `target` | [`SccpNetworkV1`](#sccpnetworkv1) |

## `SccpNetworkV1` {#sccpnetworkv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `sora_taira` | &mdash; | 64 |
  | `ethereum_mainnet` | &mdash; | 65 |
  | `bsc_mainnet` | &mdash; | 66 |
  | `tron_mainnet` | &mdash; | 67 |
  | `ton_mainnet` | &mdash; | 68 |

## `SccpRegistryChanged` {#sccpregistrychanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `operation` | [`SccpRegistryOperation`](#sccpregistryoperation) |
  | `lane_id` | [`SccpLaneIdV1`](#sccplaneidv1) |
  | `route` | [`Option<SccpRouteKeyV1>`](#option-sccproutekeyv1) |
  | `old_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `new_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `SccpRegistryOperation` {#sccpregistryoperation}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `RegisterRoute` | &mdash; | 0 |
  | `SetRouteActivation` | &mdash; | 1 |
  | `SwitchRouteRevision` | &mdash; | 2 |
  | `InitializeLaneTrustAnchor` | &mdash; | 3 |
  | `AdvanceLaneTrustAnchor` | &mdash; | 4 |
  | `RemoveStagedRoute` | &mdash; | 5 |

## `SccpReplayAccumulatorIdV1` {#sccpreplayaccumulatoridv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `route_key` | [`SccpRouteKeyV1`](#sccproutekeyv1) |
  | `boundary` | [`SccpReplayBoundaryV1`](#sccpreplayboundaryv1) |

## `SccpReplayBoundaryV1` {#sccpreplayboundaryv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `SoraOutboundLock` | &mdash; | 1 |
  | `SoraInboundRelease` | &mdash; | 2 |
  | `EvmSourceBurn` | &mdash; | 16 |
  | `EvmDestinationMint` | &mdash; | 17 |
  | `TronSourceBurn` | &mdash; | 32 |
  | `TronDestinationMint` | &mdash; | 33 |
  | `TonBridgeInboundMint` | &mdash; | 48 |
  | `TonBridgeOutboundBurn` | &mdash; | 49 |
  | `TonMasterMint` | &mdash; | 50 |
  | `TonMasterBurn` | &mdash; | 51 |
  | `TonWalletMintCredit` | &mdash; | 52 |
  | `TonWalletBurnDebit` | &mdash; | 53 |
  | `TonWalletRefundDebit` | &mdash; | 54 |
  | `TonWalletRefundCredit` | &mdash; | 55 |

## `SccpReplayDeltaEventV1` {#sccpreplaydeltaeventv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane` | [`LaneId`](#laneid) |
  | `accumulator_id` | [`SccpReplayAccumulatorIdV1`](#sccpreplayaccumulatoridv1) |
  | `delta` | [`SccpReplayDeltaV1`](#sccpreplaydeltav1) |

## `SccpReplayDeltaV1` {#sccpreplaydeltav1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `shard` | `u8` |
  | `key` | [`Array<u8, 32>`](#array-u8-32) |
  | `record_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `old_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `new_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `leaf_count` | `u64` |
  | `update_sequence` | `u64` |

## `SccpRouteKeyV1` {#sccproutekeyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `lane_id` | [`SccpLaneIdV1`](#sccplaneidv1) |
  | `route_id` | `String` |
  | `asset_key` | `String` |
  | `revision` | `u32` |

## `Schedule` {#schedule}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `start_ms` | `u64` |
  | `period_ms` | [`Option<u64>`](#option-u64) |

## `SchedulerLayerWidthBuckets` {#schedulerlayerwidthbuckets}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `buckets` | [`Array<u64, 8>`](#array-u64-8) |

## `ScopedAccount` {#scopedaccount}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `event` | [`AccountEvent`](#accountevent) |

## `ScopedAsset` {#scopedasset}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `event` | [`AssetEvent`](#assetevent) |

## `ScopedAssetDefinition` {#scopedassetdefinition}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `event` | [`AssetDefinitionEvent`](#assetdefinitionevent) |

## `SealedTransactionCommitmentPayload` {#sealedtransactioncommitmentpayload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `network_id` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `authority` | [`AccountId`](#accountid) |
  | `commitment` | [`Hash`](#hash) |
  | `reveal_after_height` | `u64` |
  | `reveal_deadline_height` | `u64` |
  | `nonce` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |

## `SealedTransactionReveal` {#sealedtransactionreveal}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `commitment` | [`Hash`](#hash) |
  | `signed_transaction` | [`SignedTransaction`](#signedtransaction) |
  | `salt` | [`Array<u8, 32>`](#array-u8-32) |

## `Signature` {#signature}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `payload` | [`Vec<u8>`](#vec-u8) |

## `SignatureOf<BlockHeader>` {#signatureof-blockheader}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignatureOf<MusubiProviderBundleVerificationPayloadV1>` {#signatureof-musubiproviderbundleverificationpayloadv1}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignatureOf<MusubiSeedIngressReceiptPayloadV1>` {#signatureof-musubiseedingressreceiptpayloadv1}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignatureOf<QueryRequestWithAuthority>` {#signatureof-queryrequestwithauthority}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignatureOf<SealedTransactionCommitmentPayload>` {#signatureof-sealedtransactioncommitmentpayload}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignatureOf<TransactionPayload>` {#signatureof-transactionpayload}

**Type:** Alias

**To:** [`Signature`](#signature)

## `SignedBlock` {#signedblock}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signatures` | [`SortedVec<BlockSignature>`](#sortedvec-blocksignature) |
  | `payload` | [`BlockPayload`](#blockpayload) |
  | `result` | [`Option<BlockResult>`](#option-blockresult) |

## `SignedQuery` {#signedquery}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signature` | [`QuerySignature`](#querysignature) |
  | `payload` | [`QueryRequestWithAuthority`](#queryrequestwithauthority) |

## `SignedSealedTransactionCommitment` {#signedsealedtransactioncommitment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signature` | [`SignatureOf<SealedTransactionCommitmentPayload>`](#signatureof-sealedtransactioncommitmentpayload) |
  | `payload` | [`SealedTransactionCommitmentPayload`](#sealedtransactioncommitmentpayload) |

## `SignedTransaction` {#signedtransaction}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `signature` | [`TransactionSignature`](#transactionsignature) |
  | `payload` | [`TransactionPayload`](#transactionpayload) |
  | `multisig_signatures` | [`Option<MultisigSignatures>`](#option-multisigsignatures) |

## `SingularQueryBox` {#singularquerybox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `FindExecutorDataModel` | [`FindExecutorDataModel`](#findexecutordatamodel) | 0 |
  | `FindParameters` | [`FindParameters`](#findparameters) | 1 |
  | `FindAccountById` | [`FindAccountById`](#findaccountbyid) | 2 |
  | `FindAliasesByAccountId` | [`FindAliasesByAccountId`](#findaliasesbyaccountid) | 3 |
  | `FindAccountRecoveryPolicyByAlias` | [`FindAccountRecoveryPolicyByAlias`](#findaccountrecoverypolicybyalias) | 4 |
  | `FindAccountRecoveryRequestByAlias` | [`FindAccountRecoveryRequestByAlias`](#findaccountrecoveryrequestbyalias) | 5 |
  | `FindProofRecordById` | [`FindProofRecordById`](#findproofrecordbyid) | 6 |
  | `FindContractManifestByCodeHash` | [`FindContractManifestByCodeHash`](#findcontractmanifestbycodehash) | 7 |
  | `FindAbiVersion` | [`FindAbiVersion`](#findabiversion) | 8 |
  | `FindAssetById` | [`FindAssetById`](#findassetbyid) | 9 |
  | `FindAssetDefinitionById` | [`FindAssetDefinitionById`](#findassetdefinitionbyid) | 10 |
  | `FindAssetEscrowById` | [`FindAssetEscrowById`](#findassetescrowbyid) | 11 |
  | `FindTriggerById` | [`FindTriggerById`](#findtriggerbyid) | 12 |
  | `FindTwitterBindingByHash` | [`FindTwitterBindingByHash`](#findtwitterbindingbyhash) | 13 |
  | `FindOracleFeedById` | [`FindOracleFeedById`](#findoraclefeedbyid) | 14 |
  | `FindOracleDisputeById` | [`FindOracleDisputeById`](#findoracledisputebyid) | 15 |
  | `FindOracleChangeById` | [`FindOracleChangeById`](#findoraclechangebyid) | 16 |
  | `FindOracleProviderStatsByKey` | [`FindOracleProviderStatsByKey`](#findoracleproviderstatsbykey) | 17 |
  | `FindLatestDefiOracleAttestation` | [`FindLatestDefiOracleAttestation`](#findlatestdefioracleattestation) | 18 |
  | `FindDomainEndorsements` | [`FindDomainEndorsements`](#finddomainendorsements) | 19 |
  | `FindDomainEndorsementPolicy` | [`FindDomainEndorsementPolicy`](#finddomainendorsementpolicy) | 20 |
  | `FindDomainCommittee` | [`FindDomainCommittee`](#finddomaincommittee) | 21 |
  | `FindDaPinIntentByTicket` | [`FindDaPinIntentByTicket`](#finddapinintentbyticket) | 22 |
  | `FindDaPinIntentByManifest` | [`FindDaPinIntentByManifest`](#finddapinintentbymanifest) | 23 |
  | `FindDaPinIntentByAlias` | [`FindDaPinIntentByAlias`](#finddapinintentbyalias) | 24 |
  | `FindDaPinIntentByLaneEpochSequence` | [`FindDaPinIntentByLaneEpochSequence`](#finddapinintentbylaneepochsequence) | 25 |
  | `FindLaneRelayEnvelopeByRef` | [`FindLaneRelayEnvelopeByRef`](#findlanerelayenvelopebyref) | 26 |
  | `FindFeeSponsorProgramById` | [`FindFeeSponsorProgramById`](#findfeesponsorprogrambyid) | 27 |
  | `FindFxCorridorPolicyRegistry` | [`FindFxCorridorPolicyRegistry`](#findfxcorridorpolicyregistry) | 28 |
  | `FindFxCorridorPolicyById` | [`FindFxCorridorPolicyById`](#findfxcorridorpolicybyid) | 29 |
  | `FindSorafsProviderOwner` | [`FindSorafsProviderOwner`](#findsorafsproviderowner) | 30 |
  | `FindSorafsPinManifest` | [`FindSorafsPinManifest`](#findsorafspinmanifest) | 31 |
  | `FindSorafsPinManifests` | [`FindSorafsPinManifests`](#findsorafspinmanifests) | 32 |
  | `FindSorafsOrderbookPolicy` | [`FindSorafsOrderbookPolicy`](#findsorafsorderbookpolicy) | 33 |
  | `FindSorafsOrderbookOrderById` | [`FindSorafsOrderbookOrderById`](#findsorafsorderbookorderbyid) | 34 |
  | `FindSorafsOrderbookCancellationByOrderId` | [`FindSorafsOrderbookCancellationByOrderId`](#findsorafsorderbookcancellationbyorderid) | 35 |
  | `FindSorafsOrderbookReceiptById` | [`FindSorafsOrderbookReceiptById`](#findsorafsorderbookreceiptbyid) | 36 |
  | `FindSorafsOrderbookTradeById` | [`FindSorafsOrderbookTradeById`](#findsorafsorderbooktradebyid) | 37 |
  | `FindSorafsOrderbookChannelById` | [`FindSorafsOrderbookChannelById`](#findsorafsorderbookchannelbyid) | 38 |
  | `FindSorafsOrderbookStatus` | [`FindSorafsOrderbookStatus`](#findsorafsorderbookstatus) | 39 |
  | `FindSorafsOrderbookOrders` | [`FindSorafsOrderbookOrders`](#findsorafsorderbookorders) | 40 |
  | `FindSorafsOrderbookReceipts` | [`FindSorafsOrderbookReceipts`](#findsorafsorderbookreceipts) | 41 |
  | `FindSorafsOrderbookTrades` | [`FindSorafsOrderbookTrades`](#findsorafsorderbooktrades) | 42 |
  | `FindSorafsOrderbookChannels` | [`FindSorafsOrderbookChannels`](#findsorafsorderbookchannels) | 43 |
  | `FindSorafsOrderbookEvents` | [`FindSorafsOrderbookEvents`](#findsorafsorderbookevents) | 44 |
  | `FindSorafsReservePolicy` | [`FindSorafsReservePolicy`](#findsorafsreservepolicy) | 45 |
  | `FindSorafsReserveProviderById` | [`FindSorafsReserveProviderById`](#findsorafsreserveproviderbyid) | 46 |
  | `FindSorafsReserveMovementById` | [`FindSorafsReserveMovementById`](#findsorafsreservemovementbyid) | 47 |
  | `FindSorafsReserveAppealById` | [`FindSorafsReserveAppealById`](#findsorafsreserveappealbyid) | 48 |
  | `FindSorafsReserveProviders` | [`FindSorafsReserveProviders`](#findsorafsreserveproviders) | 49 |
  | `FindSorafsReserveMovements` | [`FindSorafsReserveMovements`](#findsorafsreservemovements) | 50 |
  | `FindSorafsReserveAppeals` | [`FindSorafsReserveAppeals`](#findsorafsreserveappeals) | 51 |
  | `FindSorafsReserveEvents` | [`FindSorafsReserveEvents`](#findsorafsreserveevents) | 52 |
  | `FindSorafsPopIssuerPolicy` | [`FindSorafsPopIssuerPolicy`](#findsorafspopissuerpolicy) | 53 |
  | `FindSorafsPopCredentialCommitmentByDigest` | [`FindSorafsPopCredentialCommitmentByDigest`](#findsorafspopcredentialcommitmentbydigest) | 54 |
  | `FindSorafsPopCommitmentRootByVersion` | [`FindSorafsPopCommitmentRootByVersion`](#findsorafspopcommitmentrootbyversion) | 55 |
  | `FindSorafsPopRevocationPublicationByVersion` | [`FindSorafsPopRevocationPublicationByVersion`](#findsorafspoprevocationpublicationbyversion) | 56 |
  | `FindSorafsPopRevocationByNonceCommitment` | [`FindSorafsPopRevocationByNonceCommitment`](#findsorafspoprevocationbynoncecommitment) | 57 |
  | `FindSorafsPopAuditDigestBySequence` | [`FindSorafsPopAuditDigestBySequence`](#findsorafspopauditdigestbysequence) | 58 |
  | `FindSorafsPopRegistryStatus` | [`FindSorafsPopRegistryStatus`](#findsorafspopregistrystatus) | 59 |
  | `FindSorafsCitizenBondBySerialCommitment` | [`FindSorafsCitizenBondBySerialCommitment`](#findsorafscitizenbondbyserialcommitment) | 60 |
  | `FindSorafsCitizenBondSnapshot` | [`FindSorafsCitizenBondSnapshot`](#findsorafscitizenbondsnapshot) | 61 |
  | `FindSorafsAnonymousServiceEscrowById` | [`FindSorafsAnonymousServiceEscrowById`](#findsorafsanonymousserviceescrowbyid) | 62 |
  | `FindSorafsRepairTask` | [`FindSorafsRepairTask`](#findsorafsrepairtask) | 63 |
  | `FindSorafsRepairTasks` | [`FindSorafsRepairTasks`](#findsorafsrepairtasks) | 64 |
  | `FindSorafsRepairStatus` | [`FindSorafsRepairStatus`](#findsorafsrepairstatus) | 65 |
  | `FindSorafsRepairEvents` | [`FindSorafsRepairEvents`](#findsorafsrepairevents) | 66 |
  | `FindSorafsProofOutcome` | [`FindSorafsProofOutcome`](#findsorafsproofoutcome) | 67 |
  | `FindSorafsProofOutcomeEvents` | [`FindSorafsProofOutcomeEvents`](#findsorafsproofoutcomeevents) | 68 |
  | `FindSorafsReputationJournalAuthorityPolicy` | [`FindSorafsReputationJournalAuthorityPolicy`](#findsorafsreputationjournalauthoritypolicy) | 69 |
  | `FindSorafsReputationJournalEventBySourceId` | [`FindSorafsReputationJournalEventBySourceId`](#findsorafsreputationjournaleventbysourceid) | 70 |
  | `FindSorafsReputationJournalEvents` | [`FindSorafsReputationJournalEvents`](#findsorafsreputationjournalevents) | 71 |
  | `FindSorafsModerationPolicy` | [`FindSorafsModerationPolicy`](#findsorafsmoderationpolicy) | 72 |
  | `FindSorafsModerationAppeal` | [`FindSorafsModerationAppeal`](#findsorafsmoderationappeal) | 73 |
  | `FindSorafsModerationJurorEligibility` | [`FindSorafsModerationJurorEligibility`](#findsorafsmoderationjuroreligibility) | 74 |
  | `FindSorafsAnonymousJurorCandidacy` | [`FindSorafsAnonymousJurorCandidacy`](#findsorafsanonymousjurorcandidacy) | 75 |
  | `FindSorafsModerationCase` | [`FindSorafsModerationCase`](#findsorafsmoderationcase) | 76 |
  | `FindSorafsModerationCommit` | [`FindSorafsModerationCommit`](#findsorafsmoderationcommit) | 77 |
  | `FindSorafsModerationReveal` | [`FindSorafsModerationReveal`](#findsorafsmoderationreveal) | 78 |
  | `FindSorafsModerationChallenge` | [`FindSorafsModerationChallenge`](#findsorafsmoderationchallenge) | 79 |
  | `FindSorafsModerationOutcome` | [`FindSorafsModerationOutcome`](#findsorafsmoderationoutcome) | 80 |
  | `FindSorafsModerationNoShow` | [`FindSorafsModerationNoShow`](#findsorafsmoderationnoshow) | 81 |
  | `FindSorafsModerationStatus` | [`FindSorafsModerationStatus`](#findsorafsmoderationstatus) | 82 |
  | `FindSorafsModerationSnapshot` | [`FindSorafsModerationSnapshot`](#findsorafsmoderationsnapshot) | 83 |
  | `FindSorafsModerationEvents` | [`FindSorafsModerationEvents`](#findsorafsmoderationevents) | 84 |
  | `FindDataspaceNameOwnerById` | [`FindDataspaceNameOwnerById`](#finddataspacenameownerbyid) | 85 |
  | `FindMusubiExactPackageV1` | [`FindMusubiExactPackageV1`](#findmusubiexactpackagev1) | 86 |
  | `FindMusubiExactReleaseV1` | [`FindMusubiExactReleaseV1`](#findmusubiexactreleasev1) | 87 |
  | `FindMusubiProviderBundleAttestationV1` | [`FindMusubiProviderBundleAttestationV1`](#findmusubiproviderbundleattestationv1) | 88 |
  | `FindMusubiResolverIndexV1` | [`FindMusubiResolverIndexV1`](#findmusubiresolverindexv1) | 89 |
  | `FindMusubiVersionsV1` | [`FindMusubiVersionsV1`](#findmusubiversionsv1) | 90 |
  | `FindMusubiMaintainersV1` | [`FindMusubiMaintainersV1`](#findmusubimaintainersv1) | 91 |
  | `FindMusubiArchiveLocationsV1` | [`FindMusubiArchiveLocationsV1`](#findmusubiarchivelocationsv1) | 92 |
  | `FindMusubiArchiveRetentionV1` | [`FindMusubiArchiveRetentionV1`](#findmusubiarchiveretentionv1) | 93 |
  | `FindMusubiAliasV1` | [`FindMusubiAliasV1`](#findmusubialiasv1) | 94 |
  | `FindMusubiAliasHistoryV1` | [`FindMusubiAliasHistoryV1`](#findmusubialiashistoryv1) | 95 |
  | `FindMusubiOrderedPrefixV1` | [`FindMusubiOrderedPrefixV1`](#findmusubiorderedprefixv1) | 96 |
  | `FindAccountByAlias` | [`FindAccountByAlias`](#findaccountbyalias) | 97 |
  | `FindDomainById` | [`FindDomainById`](#finddomainbyid) | 98 |
  | `FindNftById` | [`FindNftById`](#findnftbyid) | 99 |

## `SingularQueryOutputBox` {#singularqueryoutputbox}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ExecutorDataModel` | [`ExecutorDataModel`](#executordatamodel) | 0 |
  | `Parameters` | [`Parameters`](#parameters) | 1 |
  | `DomainIds` | [`Vec<DomainId>`](#vec-domainid) | 2 |
  | `Account` | [`Account`](#account) | 3 |
  | `AccountAliasBindingRecords` | [`Vec<AccountAliasBindingRecord>`](#vec-accountaliasbindingrecord) | 4 |
  | `AccountRecoveryPolicy` | [`AccountRecoveryPolicy`](#accountrecoverypolicy) | 5 |
  | `AccountRecoveryRequest` | [`AccountRecoveryRequest`](#accountrecoveryrequest) | 6 |
  | `AccountIds` | [`Vec<AccountId>`](#vec-accountid) | 7 |
  | `ProofRecord` | [`ProofRecord`](#proofrecord) | 8 |
  | `ContractManifest` | [`ContractManifest`](#contractmanifest) | 9 |
  | `AbiVersion` | [`AbiVersion`](#abiversion) | 10 |
  | `Asset` | [`Asset`](#asset) | 11 |
  | `AssetDefinition` | [`AssetDefinition`](#assetdefinition) | 12 |
  | `AssetEscrowRecord` | [`AssetEscrowRecord`](#assetescrowrecord) | 13 |
  | `Trigger` | [`Trigger`](#trigger) | 14 |
  | `TwitterBindingRecord` | [`TwitterBindingRecord`](#twitterbindingrecord) | 15 |
  | `OracleFeedConfig` | [`FeedConfig`](#feedconfig) | 16 |
  | `OracleDispute` | [`OracleDispute`](#oracledispute) | 17 |
  | `OracleChangeProposal` | [`OracleChangeProposal`](#oraclechangeproposal) | 18 |
  | `OracleProviderStats` | [`OracleProviderStats`](#oracleproviderstats) | 19 |
  | `DefiOracleAttestation` | [`DefiOracleAttestation`](#defioracleattestation) | 20 |
  | `DomainEndorsements` | [`Vec<DomainEndorsementRecord>`](#vec-domainendorsementrecord) | 21 |
  | `DomainEndorsementPolicy` | [`DomainEndorsementPolicy`](#domainendorsementpolicy) | 22 |
  | `DomainCommittee` | [`DomainCommittee`](#domaincommittee) | 23 |
  | `DaPinIntent` | [`DaPinIntentWithLocation`](#dapinintentwithlocation) | 24 |
  | `VerifiedLaneRelayRecord` | [`VerifiedLaneRelayRecord`](#verifiedlanerelayrecord) | 25 |
  | `FeeSponsorProgram` | [`FeeSponsorProgram`](#feesponsorprogram) | 26 |
  | `SorafsPinManifest` | [`PinManifestFinalizedRecordV1`](#pinmanifestfinalizedrecordv1) | 27 |
  | `SorafsPinManifestPage` | [`PinManifestPageV1`](#pinmanifestpagev1) | 28 |
  | `SorafsOrderbookPolicy` | [`OrderbookAdmissionPolicyRecord`](#orderbookadmissionpolicyrecord) | 29 |
  | `SorafsOrderbookOrder` | [`OrderbookOrderRecord`](#orderbookorderrecord) | 30 |
  | `SorafsOrderbookCancellation` | [`OrderbookCancellationRecord`](#orderbookcancellationrecord) | 31 |
  | `SorafsOrderbookReceipt` | [`OrderbookSettlementReceiptRecord`](#orderbooksettlementreceiptrecord) | 32 |
  | `SorafsOrderbookTrade` | [`OrderbookTradeRecord`](#orderbooktraderecord) | 33 |
  | `SorafsOrderbookChannel` | [`OrderbookSettlementChannelRecord`](#orderbooksettlementchannelrecord) | 34 |
  | `SorafsOrderbookStatus` | [`OrderbookLedgerStatusV1`](#orderbookledgerstatusv1) | 35 |
  | `SorafsOrderbookOrderPage` | [`OrderbookOrderPageV1`](#orderbookorderpagev1) | 36 |
  | `SorafsOrderbookReceiptPage` | [`OrderbookSettlementReceiptPageV1`](#orderbooksettlementreceiptpagev1) | 37 |
  | `SorafsOrderbookTradePage` | [`OrderbookTradePageV1`](#orderbooktradepagev1) | 38 |
  | `SorafsOrderbookChannelPage` | [`OrderbookSettlementChannelPageV1`](#orderbooksettlementchannelpagev1) | 39 |
  | `SorafsOrderbookEventPage` | [`OrderbookFinalizedEventPageV1`](#orderbookfinalizedeventpagev1) | 40 |
  | `SorafsReservePolicy` | [`ReserveAuthorityPolicyRecordV1`](#reserveauthoritypolicyrecordv1) | 41 |
  | `SorafsReserveProvider` | [`ReserveProviderAccountV1`](#reserveprovideraccountv1) | 42 |
  | `SorafsReserveMovement` | [`ReserveMovementRecordV1`](#reservemovementrecordv1) | 43 |
  | `SorafsReserveAppeal` | [`ReserveAppealRecordV1`](#reserveappealrecordv1) | 44 |
  | `SorafsReserveProviderPage` | [`ReserveProviderAccountPageV1`](#reserveprovideraccountpagev1) | 45 |
  | `SorafsReserveMovementPage` | [`ReserveMovementPageV1`](#reservemovementpagev1) | 46 |
  | `SorafsReserveAppealPage` | [`ReserveAppealPageV1`](#reserveappealpagev1) | 47 |
  | `SorafsReserveEventPage` | [`ReserveFinalizedEventPageV1`](#reservefinalizedeventpagev1) | 48 |
  | `SorafsPopIssuerPolicy` | [`PopIssuerPolicyRecordV1`](#popissuerpolicyrecordv1) | 49 |
  | `SorafsPopCredentialCommitment` | [`PopCredentialCommitmentRecordV1`](#popcredentialcommitmentrecordv1) | 50 |
  | `SorafsPopCommitmentRoot` | [`PopCommitmentRootRecordV1`](#popcommitmentrootrecordv1) | 51 |
  | `SorafsPopRevocationPublication` | [`PopRevocationPublicationRecordV1`](#poprevocationpublicationrecordv1) | 52 |
  | `SorafsPopRevocation` | [`PopRevocationRecordV1`](#poprevocationrecordv1) | 53 |
  | `SorafsPopAuditDigest` | [`PopRegistryAuditDigestRecordV1`](#popregistryauditdigestrecordv1) | 54 |
  | `SorafsPopRegistryStatus` | [`PopRegistryStatusV1`](#popregistrystatusv1) | 55 |
  | `SorafsCitizenBond` | [`SorafsCitizenBondV1`](#sorafscitizenbondv1) | 56 |
  | `SorafsCitizenBondSnapshot` | [`SorafsCitizenBondSnapshotV1`](#sorafscitizenbondsnapshotv1) | 57 |
  | `SorafsAnonymousServiceEscrow` | [`SorafsAnonymousServiceEscrowV1`](#sorafsanonymousserviceescrowv1) | 58 |
  | `SorafsRepairTask` | [`RepairFinalizedTaskV1`](#repairfinalizedtaskv1) | 59 |
  | `SorafsRepairTaskPage` | [`RepairLedgerTaskPageV1`](#repairledgertaskpagev1) | 60 |
  | `SorafsRepairStatus` | [`RepairFinalizedStatusV1`](#repairfinalizedstatusv1) | 61 |
  | `SorafsRepairEventPage` | [`RepairFinalizedEventPageV1`](#repairfinalizedeventpagev1) | 62 |
  | `SorafsProofOutcome` | [`ProofOutcomeFinalizedRecordV1`](#proofoutcomefinalizedrecordv1) | 63 |
  | `SorafsProofOutcomeEventPage` | [`ProofOutcomeFinalizedEventPageV1`](#proofoutcomefinalizedeventpagev1) | 64 |
  | `SorafsReputationJournalAuthorityPolicy` | [`ReputationJournalAuthorityPolicyRecordV1`](#reputationjournalauthoritypolicyrecordv1) | 65 |
  | `SorafsReputationJournalEvent` | [`ReputationJournalFinalizedEventV1`](#reputationjournalfinalizedeventv1) | 66 |
  | `SorafsReputationJournalEventPage` | [`ReputationJournalFinalizedEventPageV1`](#reputationjournalfinalizedeventpagev1) | 67 |
  | `SorafsModerationPolicy` | [`ModerationLedgerPolicyRecord`](#moderationledgerpolicyrecord) | 68 |
  | `SorafsModerationAppeal` | [`ModerationAppealRecordV1`](#moderationappealrecordv1) | 69 |
  | `SorafsModerationJurorEligibility` | [`ModerationJurorEligibilityRecordV1`](#moderationjuroreligibilityrecordv1) | 70 |
  | `SorafsAnonymousJurorCandidacy` | [`SorafsAnonymousJurorCandidacyRecordV1`](#sorafsanonymousjurorcandidacyrecordv1) | 71 |
  | `SorafsModerationCase` | [`ModerationCaseRecordV1`](#moderationcaserecordv1) | 72 |
  | `SorafsModerationCommit` | [`ModerationCommitRecordV1`](#moderationcommitrecordv1) | 73 |
  | `SorafsModerationReveal` | [`ModerationRevealRecordV1`](#moderationrevealrecordv1) | 74 |
  | `SorafsModerationChallenge` | [`ModerationChallengeRecordV1`](#moderationchallengerecordv1) | 75 |
  | `SorafsModerationOutcome` | [`ModerationOutcomeRecordV1`](#moderationoutcomerecordv1) | 76 |
  | `SorafsModerationNoShow` | [`ModerationNoShowRecordV1`](#moderationnoshowrecordv1) | 77 |
  | `SorafsModerationStatus` | [`ModerationLedgerStatusV1`](#moderationledgerstatusv1) | 78 |
  | `SorafsModerationSnapshot` | [`ModerationFinalizedLedgerSnapshotV1`](#moderationfinalizedledgersnapshotv1) | 79 |
  | `SorafsModerationEventPage` | [`ModerationFinalizedEventPageV1`](#moderationfinalizedeventpagev1) | 80 |
  | `FxCorridorPolicyRegistry` | [`FxCorridorPolicyRegistry`](#fxcorridorpolicyregistry) | 81 |
  | `FxCorridorPolicy` | [`FxCorridorPolicy`](#fxcorridorpolicy) | 82 |
  | `MusubiPackage` | [`MusubiPackageRecordV1`](#musubipackagerecordv1) | 83 |
  | `MusubiRelease` | [`MusubiExactReleaseSnapshotV1`](#musubiexactreleasesnapshotv1) | 84 |
  | `MusubiProviderBundleAttestation` | [`MusubiProviderBundleAttestationRecordV1`](#musubiproviderbundleattestationrecordv1) | 85 |
  | `MusubiResolverIndexPage` | [`MusubiResolverIndexPageV1`](#musubiresolverindexpagev1) | 86 |
  | `MusubiVersionPage` | [`MusubiVersionPageV1`](#musubiversionpagev1) | 87 |
  | `MusubiMaintainerPage` | [`MusubiMaintainerPageV1`](#musubimaintainerpagev1) | 88 |
  | `MusubiArchiveLocationPage` | [`MusubiArchiveLocationPageV1`](#musubiarchivelocationpagev1) | 89 |
  | `MusubiArchiveRetentionPage` | [`MusubiArchiveRetentionPageV1`](#musubiarchiveretentionpagev1) | 90 |
  | `MusubiAlias` | [`MusubiAliasRecordV1`](#musubialiasrecordv1) | 91 |
  | `MusubiAliasHistoryPage` | [`MusubiAliasHistoryPageV1`](#musubialiashistorypagev1) | 92 |
  | `MusubiOrderedPackagePage` | [`MusubiOrderedPackagePageV1`](#musubiorderedpackagepagev1) | 93 |
  | `AccountId` | [`AccountId`](#accountid) | 94 |
  | `Domain` | [`Domain`](#domain) | 95 |
  | `Nft` | [`Nft`](#nft) | 96 |

## `SmartContractEvent` {#smartcontractevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `CodeRegistered` | [`ContractCodeRegistered`](#contractcoderegistered) | 0 |
  | `CodeRemoved` | [`ContractCodeRemoved`](#contractcoderemoved) | 1 |
  | `InstanceActivated` | [`ContractInstanceActivated`](#contractinstanceactivated) | 2 |
  | `InstanceDeactivated` | [`ContractInstanceDeactivated`](#contractinstancedeactivated) | 3 |
  | `ParliamentDelegationChanged` | [`ContractParliamentDelegationChanged`](#contractparliamentdelegationchanged) | 4 |
  | `OwnershipTransferOffered` | [`ContractOwnershipTransferOffered`](#contractownershiptransferoffered) | 5 |
  | `OwnershipTransferCancelled` | [`ContractOwnershipTransferCancelled`](#contractownershiptransfercancelled) | 6 |
  | `OwnershipTransferred` | [`ContractOwnershipTransferred`](#contractownershiptransferred) | 7 |
  | `EmergencyHoldPlaced` | [`ContractEmergencyHoldPlaced`](#contractemergencyholdplaced) | 8 |
  | `EmergencyHoldRetrospectiveCompleted` | [`ContractEmergencyHoldRetrospectiveCompleted`](#contractemergencyholdretrospectivecompleted) | 9 |

## `SmartContractParameter` {#smartcontractparameter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Fuel` | [`NonZero<u64>`](#nonzero-u64) | 0 |
  | `Memory` | [`NonZero<u64>`](#nonzero-u64) | 1 |
  | `ExecutionDepth` | `u8` | 2 |
  | `MaxOutputItems` | [`NonZero<u64>`](#nonzero-u64) | 3 |
  | `MaxOutputBytes` | [`NonZero<u64>`](#nonzero-u64) | 4 |

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

## `SnapshotBootstrapAnchor` {#snapshotbootstrapanchor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `snapshot_height` | `u64` |
  | `snapshot_block_hash` | [`HashOf<BlockHeader>`](#hashof-blockheader) |
  | `snapshot_block_creation_time_ms` | `u64` |
  | `snapshot_state_hash` | [`Hash`](#hash) |

## `SocialEvent` {#socialevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `RewardPaid` | [`ViralRewardApplied`](#viralrewardapplied) | 0 |
  | `EscrowCreated` | [`ViralEscrowCreated`](#viralescrowcreated) | 1 |
  | `EscrowReleased` | [`ViralEscrowReleased`](#viralescrowreleased) | 2 |
  | `EscrowCancelled` | [`ViralEscrowCancelled`](#viralescrowcancelled) | 3 |

## `SocialEventFilter` {#socialeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_matcher` | [`Option<KeyedHash>`](#option-keyedhash) |

## `SocketAddr` {#socketaddr}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Ipv4` | [`SocketAddrV4`](#socketaddrv4) | 0 |
  | `Ipv6` | [`SocketAddrV6`](#socketaddrv6) | 1 |
  | `Host` | [`SocketAddrHost`](#socketaddrhost) | 2 |

## `SocketAddrHost` {#socketaddrhost}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `host` | `String` |
  | `port` | `u16` |

## `SocketAddrV4` {#socketaddrv4}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `ip` | [`Ipv4Addr`](#ipv4addr) |
  | `port` | `u16` |

## `SocketAddrV6` {#socketaddrv6}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `ip` | [`Ipv6Addr`](#ipv6addr) |
  | `port` | `u16` |

## `SoraFsModerationBallotContextV1` {#sorafsmoderationballotcontextv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `case_id` | `String` |
  | `evidence_bundle_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `appeal_finance_config_version` | `String` |
  | `panel_roster_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `policy_reference` | `String` |
  | `evidence_uri` | [`Option<String>`](#option-string) |

## `SoraFsModerationVoteChoice` {#sorafsmoderationvotechoice}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `uphold` | &mdash; | 0 |
  | `overturn` | &mdash; | 1 |
  | `modify` | &mdash; | 2 |
  | `escalate` | &mdash; | 3 |

## `SoradnsDirectoryEvent` {#soradnsdirectoryevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `DraftSubmitted` | [`DirectoryDraftSubmittedEventV1`](#directorydraftsubmittedeventv1) | 0 |
  | `Published` | [`DirectoryPublishedEventV1`](#directorypublishedeventv1) | 1 |
  | `Revoked` | [`DirectoryRevokedEventV1`](#directoryrevokedeventv1) | 2 |
  | `Unrevoked` | [`DirectoryUnrevokedEventV1`](#directoryunrevokedeventv1) | 3 |
  | `ReleaseSignerAdded` | [`DirectoryReleaseSignerEventV1`](#directoryreleasesignereventv1) | 4 |
  | `ReleaseSignerRemoved` | [`DirectoryReleaseSignerEventV1`](#directoryreleasesignereventv1) | 5 |
  | `PolicyUpdated` | [`DirectoryPolicyUpdatedEventV1`](#directorypolicyupdatedeventv1) | 6 |

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

## `SorafsAnonymousJurorCandidacyRecordV1` {#sorafsanonymousjurorcandidacyrecordv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `case_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `juror_tag` | [`Array<u8, 32>`](#array-u8-32) |
  | `session_public_key` | [`Array<u8, 32>`](#array-u8-32) |
  | `citizen_nullifier` | [`Array<u8, 32>`](#array-u8-32) |
  | `service_note_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `service_note_nullifier` | [`Array<u8, 32>`](#array-u8-32) |
  | `fee_tag` | [`Array<u8, 32>`](#array-u8-32) |
  | `citizen_snapshot_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `action_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `escrow_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `registered_at_finalized_height` | `u64` |
  | `expiry_finalized_height` | `u64` |

## `SorafsAnonymousServiceEscrowStateV1` {#sorafsanonymousserviceescrowstatev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `reserved` | &mdash; | 0 |
  | `refunded` | [`SorafsAnonymousServiceRefundV1`](#sorafsanonymousservicerefundv1) | 1 |
  | `slashed` | [`SorafsAnonymousServiceSlashV1`](#sorafsanonymousserviceslashv1) | 2 |

## `SorafsAnonymousServiceEscrowV1` {#sorafsanonymousserviceescrowv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `case_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `action_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `juror_tag` | [`Array<u8, 32>`](#array-u8-32) |
  | `note_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `note_nullifier` | [`Array<u8, 32>`](#array-u8-32) |
  | `fee_tag` | [`Array<u8, 32>`](#array-u8-32) |
  | `penalty_sink` | [`AccountId`](#accountid) |
  | `reserved_at_height` | `u64` |
  | `state` | [`SorafsAnonymousServiceEscrowStateV1`](#sorafsanonymousserviceescrowstatev1) |

## `SorafsAnonymousServiceRefundV1` {#sorafsanonymousservicerefundv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `refund_note_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `finalized_height` | `u64` |

## `SorafsAnonymousServiceSlashV1` {#sorafsanonymousserviceslashv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `evidence_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `adjudication_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `finalized_height` | `u64` |

## `SorafsCitizenBondExitPendingV1` {#sorafscitizenbondexitpendingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `requested_at_height` | `u64` |
  | `unlock_height` | `u64` |

## `SorafsCitizenBondSnapshotV1` {#sorafscitizenbondsnapshotv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `frozen_policy_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `active_membership_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `finalized_height` | `u64` |
  | `active_bond_count` | `u64` |

## `SorafsCitizenBondStateV1` {#sorafscitizenbondstatev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `active` | &mdash; | 0 |
  | `exit_pending` | [`SorafsCitizenBondExitPendingV1`](#sorafscitizenbondexitpendingv1) | 1 |

## `SorafsCitizenBondV1` {#sorafscitizenbondv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u16` |
  | `serial_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `authorization_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `authorization_revision` | `u64` |
  | `locked_value_commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `bond_asset` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `bond_atomic_units` | `u128` |
  | `frozen_policy_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `bonded_at_height` | `u64` |
  | `exit_delay_blocks` | `u64` |
  | `state` | [`SorafsCitizenBondStateV1`](#sorafscitizenbondstatev1) |

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

## `SorafsGarViolation` {#sorafsgarviolation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy` | [`SorafsGarPolicy`](#sorafsgarpolicy) |
  | `detail` | [`SorafsGarPolicyDetail`](#sorafsgarpolicydetail) |
  | `provider_id` | [`Option<ProviderId>`](#option-providerid) |
  | `manifest_digest` | [`Option<ManifestDigest>`](#option-manifestdigest) |
  | `manifest_cid_b64` | [`Option<String>`](#option-string) |
  | `client_fingerprint_hex` | `String` |
  | `remote_addr` | [`Option<String>`](#option-string) |
  | `retry_after_seconds` | [`Option<u64>`](#option-u64) |
  | `region` | [`Option<String>`](#option-string) |
  | `host` | [`Option<String>`](#option-string) |
  | `policy_labels` | [`Vec<String>`](#vec-string) |
  | `observed_ttl_seconds` | [`Option<u64>`](#option-u64) |
  | `rate_ceiling_rps` | [`Option<u64>`](#option-u64) |
  | `occurred_at_unix` | `u64` |

## `SorafsGatewayEvent` {#sorafsgatewayevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `GarViolation` | [`SorafsGarViolation`](#sorafsgarviolation) | 0 |
  | `ProofHealth` | [`SorafsProofHealthAlert`](#sorafsproofhealthalert) | 1 |
  | `RepairLedger` | [`SorafsRepairLedgerEvent`](#sorafsrepairledgerevent) | 2 |
  | `ModerationLedger` | [`SorafsModerationLedgerEvent`](#sorafsmoderationledgerevent) | 3 |
  | `OrderbookLedger` | [`SorafsOrderbookLedgerEvent`](#sorafsorderbookledgerevent) | 4 |
  | `ReserveLedger` | [`SorafsReserveLedgerEvent`](#sorafsreserveledgerevent) | 5 |
  | `ReputationJournal` | [`SorafsReputationJournalEvent`](#sorafsreputationjournalevent) | 6 |

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

## `SorafsModerationLedgerEvent` {#sorafsmoderationledgerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`SorafsModerationLedgerEventKind`](#sorafsmoderationledgereventkind) |
  | `case_id` | [`Option<String>`](#option-string) |
  | `round_id` | [`Option<String>`](#option-string) |
  | `authority` | [`AccountId`](#accountid) |
  | `occurred_at_unix_ms` | `u64` |

## `SorafsModerationLedgerEventKind` {#sorafsmoderationledgereventkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `policy_activated` | &mdash; | 0 |
  | `appeal_submitted` | &mdash; | 1 |
  | `eligibility_registered` | &mdash; | 2 |
  | `sortition_finalized` | &mdash; | 3 |
  | `sortition_failed` | &mdash; | 4 |
  | `assignment_accepted` | &mdash; | 5 |
  | `case_activated` | &mdash; | 6 |
  | `case_activation_failed` | &mdash; | 7 |
  | `commit_accepted` | &mdash; | 8 |
  | `challenge_raised` | &mdash; | 9 |
  | `challenge_resolved` | &mdash; | 10 |
  | `reveal_accepted` | &mdash; | 11 |
  | `case_finalized` | &mdash; | 12 |

## `SorafsOrderbookLedgerEvent` {#sorafsorderbookledgerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`SorafsOrderbookLedgerEventKind`](#sorafsorderbookledgereventkind) |
  | `order_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `trade_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `channel_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `receipt_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `provider_id` | [`Option<ProviderId>`](#option-providerid) |
  | `book_revision` | `u64` |
  | `authority` | [`AccountId`](#accountid) |
  | `occurred_at_unix_ms` | `u64` |

## `SorafsOrderbookLedgerEventKind` {#sorafsorderbookledgereventkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `policy_activated` | &mdash; | 0 |
  | `order_admitted` | &mdash; | 1 |
  | `order_cancelled` | &mdash; | 2 |
  | `trade_matched` | &mdash; | 3 |
  | `order_expired` | &mdash; | 4 |
  | `order_provider_revoked` | &mdash; | 5 |
  | `channel_expired` | &mdash; | 6 |
  | `receipt_recorded` | &mdash; | 7 |

## `SorafsProofHealthAlert` {#sorafsproofhealthalert}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `window_start_epoch` | `u64` |
  | `window_end_epoch` | `u64` |
  | `prior_strikes` | `u32` |
  | `strike_threshold` | `u32` |
  | `pdp_challenges` | `u32` |
  | `pdp_failures` | `u32` |
  | `potr_windows` | `u32` |
  | `potr_breaches` | `u32` |
  | `triggered_by_pdp` | `bool` |
  | `triggered_by_potr` | `bool` |
  | `max_pdp_failures` | `u32` |
  | `max_potr_breaches` | `u32` |
  | `penalty_bond_bps` | `u16` |
  | `penalty_applied` | [`Quantity`](#quantity) |
  | `cooldown_active` | `bool` |

## `SorafsProofOutcomeFindErrorV1` {#sorafsproofoutcomefinderrorv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`ProofOutcomeKindV1`](#proofoutcomekindv1) |
  | `identity_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `SorafsRepairLedgerEvent` {#sorafsrepairledgerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`SorafsRepairLedgerEventKind`](#sorafsrepairledgereventkind) |
  | `ticket_id` | `String` |
  | `task_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `manifest_digest` | [`ManifestDigest`](#manifestdigest) |
  | `revision` | `u64` |
  | `authority` | [`AccountId`](#accountid) |
  | `occurred_at_unix_ms` | `u64` |

## `SorafsRepairLedgerEventKind` {#sorafsrepairledgereventkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `task_submitted` | &mdash; | 0 |
  | `lease_claimed` | &mdash; | 1 |
  | `lease_renewed` | &mdash; | 2 |
  | `completed` | &mdash; | 3 |
  | `failed` | &mdash; | 4 |
  | `escalated` | &mdash; | 5 |
  | `appealed` | &mdash; | 6 |

## `SorafsReputationJournalEntryCommittedV1` {#sorafsreputationjournalentrycommittedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sequence` | `u64` |
  | `event_id` | [`ReputationJournalEventIdV1`](#reputationjournaleventidv1) |
  | `source_id` | [`ReputationJournalSourceIdV1`](#reputationjournalsourceidv1) |
  | `source_kind` | [`ReputationJournalSourceKindV1`](#reputationjournalsourcekindv1) |
  | `source_revision` | `u32` |
  | `provider_id` | [`ProviderId`](#providerid) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `authority` | [`AccountId`](#accountid) |
  | `source_time_unix_ms` | `u64` |
  | `recorded_at_unix_ms` | `u64` |

## `SorafsReputationJournalEvent` {#sorafsreputationjournalevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `policy_activated` | [`SorafsReputationJournalPolicyActivatedV1`](#sorafsreputationjournalpolicyactivatedv1) | 0 |
  | `entry_committed` | [`SorafsReputationJournalEntryCommittedV1`](#sorafsreputationjournalentrycommittedv1) | 1 |

## `SorafsReputationJournalPolicyActivatedV1` {#sorafsreputationjournalpolicyactivatedv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `revision` | `u64` |
  | `authority` | [`AccountId`](#accountid) |
  | `occurred_at_unix_ms` | `u64` |

## `SorafsReserveLedgerEvent` {#sorafsreserveledgerevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `kind` | [`SorafsReserveLedgerEventKind`](#sorafsreserveledgereventkind) |
  | `provider_id` | [`Option<ProviderId>`](#option-providerid) |
  | `operation_id` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `policy_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `provider_revision` | `u64` |
  | `resulting_lifecycle_stage` | [`Option<ReserveLifecycleStage>`](#option-reservelifecyclestage) |
  | `authority` | [`AccountId`](#accountid) |
  | `occurred_at_unix_ms` | `u64` |

## `SorafsReserveLedgerEventKind` {#sorafsreserveledgereventkind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `policy_activated` | &mdash; | 0 |
  | `provider_registered` | &mdash; | 1 |
  | `movement_requested` | &mdash; | 2 |
  | `movement_approved` | &mdash; | 3 |
  | `movement_rejected` | &mdash; | 4 |
  | `rent_charged` | &mdash; | 5 |
  | `lifecycle_advanced` | &mdash; | 6 |
  | `credit_drawn` | &mdash; | 7 |
  | `credit_repaid` | &mdash; | 8 |
  | `appeal_submitted` | &mdash; | 9 |
  | `appeal_accepted` | &mdash; | 10 |
  | `appeal_rejected` | &mdash; | 11 |

## `SorafsUri` {#sorafsuri}

**Type:** Alias

**To:** `String`

## `SortOrder` {#sortorder}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Asc` | &mdash; | 0 |
  | `Desc` | &mdash; | 1 |

## `SortedMap<AccountId, u8>` {#sortedmap-accountid-u8}

**Type:** Map

**Key:** [`AccountId`](#accountid)

**Value:** `u8`

## `SortedMap<CustomParameterId, CustomParameter>` {#sortedmap-customparameterid-customparameter}

**Type:** Map

**Key:** [`CustomParameterId`](#customparameterid)

**Value:** [`CustomParameter`](#customparameter)

## `SortedMap<Hash, Vec<TransferTranscript>>` {#sortedmap-hash-vec-transfertranscript}

**Type:** Map

**Key:** [`Hash`](#hash)

**Value:** [`Vec<TransferTranscript>`](#vec-transfertranscript)

## `SortedMap<Name, FxCorridorPolicy>` {#sortedmap-name-fxcorridorpolicy}

**Type:** Map

**Key:** [`Name`](#name)

**Value:** [`FxCorridorPolicy`](#fxcorridorpolicy)

## `SortedMap<Name, FxCorridorUsage>` {#sortedmap-name-fxcorridorusage}

**Type:** Map

**Key:** [`Name`](#name)

**Value:** [`FxCorridorUsage`](#fxcorridorusage)

## `SortedMap<Name, Json>` {#sortedmap-name-json}

**Type:** Map

**Key:** [`Name`](#name)

**Value:** [`Json`](#json)

## `SortedMap<ParliamentBody, ParliamentRoster>` {#sortedmap-parliamentbody-parliamentroster}

**Type:** Map

**Key:** [`ParliamentBody`](#parliamentbody)

**Value:** [`ParliamentRoster`](#parliamentroster)

## `SortedMap<Permission, u64>` {#sortedmap-permission-u64}

**Type:** Map

**Key:** [`Permission`](#permission)

**Value:** `u64`

## `SortedMap<String, Vec<u8>>` {#sortedmap-string-vec-u8}

**Type:** Map

**Key:** `String`

**Value:** [`Vec<u8>`](#vec-u8)

## `SortedVec<AccountId>` {#sortedvec-accountid}

**Type:** Vec

**Value:** [`AccountId`](#accountid)

## `SortedVec<BlockSignature>` {#sortedvec-blocksignature}

**Type:** Vec

**Value:** [`BlockSignature`](#blocksignature)

## `SortedVec<DataSpaceId>` {#sortedvec-dataspaceid}

**Type:** Vec

**Value:** [`DataSpaceId`](#dataspaceid)

## `SortedVec<DomainId>` {#sortedvec-domainid}

**Type:** Vec

**Value:** [`DomainId`](#domainid)

## `SortedVec<Permission>` {#sortedvec-permission}

**Type:** Vec

**Value:** [`Permission`](#permission)

## `SortedVec<String>` {#sortedvec-string}

**Type:** Vec

**Value:** `String`

## `Sorting` {#sorting}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `sort_by_metadata_key` | [`Option<Name>`](#option-name) |
  | `order` | [`Option<SortOrder>`](#option-sortorder) |

## `SpaceDirectoryEvent` {#spacedirectoryevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ManifestActivated` | [`SpaceDirectoryManifestActivated`](#spacedirectorymanifestactivated) | 0 |
  | `ManifestExpired` | [`SpaceDirectoryManifestExpired`](#spacedirectorymanifestexpired) | 1 |
  | `ManifestRevoked` | [`SpaceDirectoryManifestRevoked`](#spacedirectorymanifestrevoked) | 2 |

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

## `SpaceDirectoryManifestActivated` {#spacedirectorymanifestactivated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `manifest_hash` | [`Hash`](#hash) |
  | `activation_epoch` | `u64` |
  | `expiry_epoch` | [`Option<u64>`](#option-u64) |

## `SpaceDirectoryManifestExpired` {#spacedirectorymanifestexpired}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `manifest_hash` | [`Hash`](#hash) |
  | `expired_epoch` | `u64` |

## `SpaceDirectoryManifestRevoked` {#spacedirectorymanifestrevoked}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `dataspace` | [`DataSpaceId`](#dataspaceid) |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `manifest_hash` | [`Hash`](#hash) |
  | `revoked_epoch` | `u64` |
  | `reason` | [`Option<String>`](#option-string) |

## `SpendOp` {#spendop}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `asset_definition_id` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `kind` | `String` |
  | `from` | `String` |
  | `to` | `String` |
  | `amount` | [`Option<Quantity>`](#option-quantity) |

## `SponsorFeePayment` {#sponsorfeepayment}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `program_id` | [`FeeSponsorProgramId`](#feesponsorprogramid) |
  | `program_revision` | `u64` |
  | `charge_limits` | [`Vec<FeeChargeLimit>`](#vec-feechargelimit) |
  | `gas_limit` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |

## `StackStatus` {#stackstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `requested_scheduler_bytes` | `u64` |
  | `requested_prover_bytes` | `u64` |
  | `requested_guest_bytes` | `u64` |
  | `scheduler_bytes` | `u64` |
  | `prover_bytes` | `u64` |
  | `guest_bytes` | `u64` |
  | `gas_to_stack_multiplier` | `u64` |
  | `scheduler_clamped` | `bool` |
  | `prover_clamped` | `bool` |
  | `guest_clamped` | `bool` |
  | `pool_fallback_total` | `u64` |
  | `budget_hit_total` | `u64` |

## `StateDescriptor` {#statedescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `name` | `String` |
  | `type_name` | `String` |

## `Status` {#status}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `build` | [`BuildStatus`](#buildstatus) |
  | `observed_at_ms` | `u64` |
  | `peers` | `u64` |
  | `blocks` | `u64` |
  | `blocks_non_empty` | `u64` |
  | `commit_time_ms` | `u64` |
  | `txs_approved` | `u64` |
  | `txs_rejected` | `u64` |
  | `last_rejection_at_ms` | [`Option<u64>`](#option-u64) |
  | `txs_rejected_recent_5m` | `u64` |
  | `uptime` | [`Uptime`](#uptime) |
  | `view_changes` | `u32` |
  | `queue_size` | `u64` |
  | `queue_queued` | `u64` |
  | `queue_inflight` | `u64` |
  | `last_block_committed_at_ms` | `u64` |
  | `last_non_empty_block_committed_at_ms` | `u64` |
  | `time_since_last_block_ms` | `u64` |
  | `time_since_last_non_empty_block_ms` | `u64` |
  | `crypto` | [`CryptoStatus`](#cryptostatus) |
  | `stack` | [`StackStatus`](#stackstatus) |
  | `offline` | [`Option<OfflineStatus>`](#option-offlinestatus) |
  | `sumeragi` | [`Option<SumeragiConsensusStatus>`](#option-sumeragiconsensusstatus) |
  | `governance` | [`GovernanceStatus`](#governancestatus) |
  | `teu_lane_commit` | [`Vec<NexusLaneTeuStatus>`](#vec-nexuslaneteustatus) |
  | `teu_dataspace_backlog` | [`Vec<NexusDataspaceTeuStatus>`](#vec-nexusdataspaceteustatus) |
  | `dataspace_catalog` | [`Vec<NexusDataspaceCatalogStatus>`](#vec-nexusdataspacecatalogstatus) |
  | `nexus` | [`Option<NexusStatus>`](#option-nexusstatus) |
  | `tx_gossip` | [`TxGossipSnapshot`](#txgossipsnapshot) |
  | `taikai_alias_rotations` | [`Vec<TaikaiAliasRotationStatus>`](#vec-taikaialiasrotationstatus) |
  | `taikai_ingest` | [`Vec<TaikaiIngestStatus>`](#vec-taikaiingeststatus) |
  | `da_receipt_cursors` | [`Vec<DaReceiptCursorStatus>`](#vec-dareceiptcursorstatus) |

## `StorageClass` {#storageclass}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Hot` | &mdash; | 0 |
  | `Warm` | &mdash; | 1 |
  | `Cold` | &mdash; | 2 |

## `StorageTicketId` {#storageticketid}

**Type:** Alias

**To:** [`Array<u8, 32>`](#array-u8-32)

## `StreamTokenExcludedKindV1` {#streamtokenexcludedkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `missing_token` | &mdash; | 0 |
  | `malformed_encoding` | &mdash; | 1 |
  | `invalid_signature` | &mdash; | 2 |
  | `unsupported_key_version` | &mdash; | 3 |

## `StreamTokenValidationBindingV1` {#streamtokenvalidationbindingv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `gateway_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `gateway_sequence` | `u64` |
  | `request_context_digest` | [`Array<u8, 32>`](#array-u8-32) |

## `StreamTokenValidationOutcomeV1` {#streamtokenvalidationoutcomev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding` | [`StreamTokenValidationBindingV1`](#streamtokenvalidationbindingv1) |
  | `token_body_digest` | [`Option<Array<u8, 32>>`](#option-array-u8-32) |
  | `token_key_version` | [`Option<u32>`](#option-u32) |
  | `validated_at_unix_ms` | `u64` |
  | `status` | [`StreamTokenValidationStatusV1`](#streamtokenvalidationstatusv1) |

## `StreamTokenValidationStatusV1` {#streamtokenvalidationstatusv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `accepted` | &mdash; | 0 |
  | `provider_violation` | [`StreamTokenViolationKindV1`](#streamtokenviolationkindv1) | 1 |
  | `excluded` | [`StreamTokenExcludedKindV1`](#streamtokenexcludedkindv1) | 2 |

## `StreamTokenViolationKindV1` {#streamtokenviolationkindv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `expired` | &mdash; | 0 |
  | `future_issued_at` | &mdash; | 1 |
  | `manifest_mismatch` | &mdash; | 2 |
  | `profile_mismatch` | &mdash; | 3 |
  | `provider_mismatch` | &mdash; | 4 |
  | `concurrency_limit_exceeded` | &mdash; | 5 |
  | `request_quota_exceeded` | &mdash; | 6 |
  | `byte_rate_limit_exceeded` | &mdash; | 7 |
  | `identifier_policy_conflict` | &mdash; | 8 |

## `StreamingPrivacyRelay` {#streamingprivacyrelay}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `relay_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `endpoint` | `String` |
  | `key_fingerprint` | [`Array<u8, 32>`](#array-u8-32) |
  | `capabilities_bits` | `u32` |

## `StreamingPrivacyRoute` {#streamingprivacyroute}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `route_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `entry` | [`StreamingPrivacyRelay`](#streamingprivacyrelay) |
  | `exit` | [`StreamingPrivacyRelay`](#streamingprivacyrelay) |
  | `ticket_entry` | [`Vec<u8>`](#vec-u8) |
  | `ticket_exit` | [`Vec<u8>`](#vec-u8) |
  | `expiry_segment` | `u64` |
  | `soranet` | [`Option<StreamingSoranetRoute>`](#option-streamingsoranetroute) |
  | `ticket` | [`Option<TicketEnvelopeV1>`](#option-ticketenvelopev1) |

## `StreamingRouteBinding` {#streamingroutebinding}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `route` | [`StreamingPrivacyRoute`](#streamingprivacyroute) |
  | `valid_from_segment` | `u64` |
  | `valid_until_segment` | `u64` |
  | `acknowledged` | `bool` |

## `StreamingSoranetAccessKind` {#streamingsoranetaccesskind}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ReadOnly` | &mdash; | 0 |
  | `Authenticated` | &mdash; | 1 |

## `StreamingSoranetRoute` {#streamingsoranetroute}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `channel_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `exit_multiaddr` | `String` |
  | `padding_budget_ms` | [`Option<u16>`](#option-u16) |
  | `access_kind` | [`StreamingSoranetAccessKind`](#streamingsoranetaccesskind) |
  | `stream_tag` | [`StreamingSoranetStreamTag`](#streamingsoranetstreamtag) |

## `StreamingSoranetStreamTag` {#streamingsoranetstreamtag}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `NoritoStream` | &mdash; | 0 |
  | `Kaigi` | &mdash; | 1 |

## `StreamingTicketCapabilities` {#streamingticketcapabilities}

**Type:** Alias

**To:** `u32`

## `StreamingTicketPolicy` {#streamingticketpolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_relays` | `u16` |
  | `allowed_regions` | [`Vec<String>`](#vec-string) |
  | `max_bandwidth_kbps` | [`Option<u32>`](#option-u32) |

## `StreamingTicketReady` {#streamingticketready}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `stream_id` | [`Hash`](#hash) |
  | `ticket` | [`StreamingTicketRecord`](#streamingticketrecord) |
  | `routes` | [`Vec<StreamingRouteBinding>`](#vec-streamingroutebinding) |

## `StreamingTicketRecord` {#streamingticketrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `ticket_id` | [`Hash`](#hash) |
  | `owner` | [`AccountId`](#accountid) |
  | `dsid` | [`DataSpaceId`](#dataspaceid) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `settlement_bucket` | `u64` |
  | `start_slot` | `u64` |
  | `expire_slot` | `u64` |
  | `prepaid_teu` | `u128` |
  | `chunk_teu` | `u32` |
  | `fanout_quota` | `u16` |
  | `key_commitment` | [`Hash`](#hash) |
  | `nonce` | `u64` |
  | `contract_signature` | [`Array<u8, 64>`](#array-u8-64) |
  | `commitment` | [`Hash`](#hash) |
  | `nullifier` | [`Hash`](#hash) |
  | `proof_id` | [`Array<u8, 32>`](#array-u8-32) |
  | `issued_at` | `u64` |
  | `expires_at` | `u64` |
  | `policy` | [`Option<StreamingTicketPolicy>`](#option-streamingticketpolicy) |
  | `capabilities` | [`StreamingTicketCapabilities`](#streamingticketcapabilities) |

## `StreamingTicketRevoked` {#streamingticketrevoked}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`DomainId`](#domainid) |
  | `stream_id` | [`Hash`](#hash) |
  | `ticket_id` | [`Hash`](#hash) |
  | `nullifier` | [`Hash`](#hash) |
  | `reason_code` | `u16` |
  | `revocation_signature` | [`Array<u8, 64>`](#array-u8-64) |

## `String` {#string}

**Type:** Alias

**To:** `String`

## `SumeragiConsensusStatus` {#sumeragiconsensusstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `mode_tag` | `String` |
  | `leader_index` | `u64` |
  | `highest_qc_height` | `u64` |
  | `locked_qc_height` | `u64` |
  | `locked_qc_view` | `u64` |
  | `commit_signatures_present` | `u64` |
  | `commit_signatures_counted` | `u64` |
  | `commit_signatures_set_b` | `u64` |
  | `commit_signatures_required` | `u64` |
  | `commit_qc_height` | `u64` |
  | `commit_qc_view` | `u64` |
  | `commit_qc_epoch` | `u64` |
  | `commit_qc_signatures_total` | `u64` |
  | `commit_qc_validator_set_len` | `u64` |
  | `block_created_dropped_by_lock_total` | `u64` |
  | `block_created_hint_mismatch_total` | `u64` |
  | `block_created_proposal_mismatch_total` | `u64` |
  | `tx_queue_depth` | `u64` |
  | `tx_queue_capacity` | `u64` |
  | `tx_queue_retained_bytes` | `u64` |
  | `tx_queue_max_retained_bytes` | `u64` |
  | `tx_queue_saturated` | `bool` |
  | `tx_queue_saturated_by_count` | `bool` |
  | `tx_queue_saturated_by_bytes` | `bool` |
  | `tx_queue_saturated_by_age` | `bool` |
  | `tx_queue_oldest_queued_age_ms` | `u64` |
  | `epoch_length_blocks` | `u64` |
  | `epoch_commit_deadline_offset` | `u64` |
  | `epoch_reveal_deadline_offset` | `u64` |
  | `prf_epoch_seed` | [`Option<String>`](#option-string) |
  | `prf_height` | `u64` |
  | `prf_view` | `u64` |
  | `view_change_proof_accepted_total` | `u64` |
  | `view_change_proof_stale_total` | `u64` |
  | `view_change_proof_rejected_total` | `u64` |
  | `view_change_suggest_total` | `u64` |
  | `view_change_install_total` | `u64` |
  | `lane_governance_sealed_total` | `u32` |
  | `lane_governance_sealed_aliases` | [`Vec<String>`](#vec-string) |

## `SumeragiLanePayloadOwnership` {#sumeragilanepayloadownership}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `proposal_height` | `u64` |
  | `proposal_view` | `u64` |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `lane_incarnation` | [`Hash`](#hash) |
  | `lane_block_height` | `u64` |
  | `lane_block_view` | `u64` |
  | `subject_hash` | [`Hash`](#hash) |
  | `qc_mode_tag` | `String` |
  | `accepted_candidate_indices` | [`Vec<u64>`](#vec-u64) |
  | `accepted_transaction_hashes` | [`Vec<Hash>`](#vec-hash) |
  | `previous_lane_block_height` | `u64` |
  | `previous_lane_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `lane_block_descriptor_hash` | [`Option<Hash>`](#option-hash) |
  | `lane_block_descriptor_validator_set` | [`Vec<PeerId>`](#vec-peerid) |
  | `lane_block_descriptor_validator_count` | `u32` |
  | `lane_block_descriptor_min_quorum` | `u32` |
  | `payload_ownership_hash` | [`Hash`](#hash) |
  | `rbc_instance_hash` | [`Hash`](#hash) |

## `SumeragiParameter` {#sumeragiparameter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MaxClockDriftMs` | `u64` | 0 |

## `SumeragiParameters` {#sumeragiparameters}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_cadence_ms` | [`NonZero<u64>`](#nonzero-u64) |
  | `max_clock_drift_ms` | `u64` |
  | `key_activation_lead_blocks` | `u64` |
  | `key_overlap_grace_blocks` | `u64` |
  | `key_expiry_grace_blocks` | `u64` |
  | `key_require_hsm` | `bool` |
  | `key_allowed_algorithms` | [`Vec<Algorithm>`](#vec-algorithm) |
  | `key_allowed_hsm_providers` | [`Vec<String>`](#vec-string) |

## `SumeragiV2Equivocation` {#sumeragiv2equivocation}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `proposal` | [`SumeragiV2ProposalEquivocationSchema`](#sumeragiv2proposalequivocationschema) | 0 |
  | `phase_vote` | [`SumeragiV2PhaseVoteEquivocationSchema`](#sumeragiv2phasevoteequivocationschema) | 1 |
  | `timeout_vote` | [`SumeragiV2TimeoutVoteEquivocationSchema`](#sumeragiv2timeoutvoteequivocationschema) | 2 |

## `SumeragiV2EquivocationEvidence` {#sumeragiv2equivocationevidence}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `context` | [`HeightContext`](#heightcontext) |
  | `proofs_of_possession` | [`Vec<Vec<u8>>`](#vec-vec-u8) |
  | `conflict` | [`SumeragiV2Equivocation`](#sumeragiv2equivocation) |

## `SumeragiV2GlobalPhase` {#sumeragiv2globalphase}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Prepare` | &mdash; | 1 |
  | `Commit` | &mdash; | 2 |

## `SumeragiV2PhaseVoteEquivocationSchema` {#sumeragiv2phasevoteequivocationschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `first` | [`Vote`](#vote) |
  | `second` | [`Vote`](#vote) |

## `SumeragiV2ProposalEquivocationSchema` {#sumeragiv2proposalequivocationschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `first` | [`Proposal`](#proposal) |
  | `second` | [`Proposal`](#proposal) |

## `SumeragiV2TimeoutVoteEquivocationSchema` {#sumeragiv2timeoutvoteequivocationschema}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `first` | [`TimeoutVote`](#timeoutvote) |
  | `second` | [`TimeoutVote`](#timeoutvote) |

## `TaikaiAliasRotationStatus` {#taikaialiasrotationstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `cluster` | `String` |
  | `event` | `String` |
  | `stream` | `String` |
  | `alias_namespace` | `String` |
  | `alias_name` | `String` |
  | `window_start_sequence` | `u64` |
  | `window_end_sequence` | `u64` |
  | `manifest_digest_hex` | `String` |
  | `rotations_total` | `u64` |
  | `last_updated_unix` | `u64` |

## `TaikaiIngestErrorCounter` {#taikaiingesterrorcounter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `reason` | `String` |
  | `total` | `u64` |

## `TaikaiIngestStatus` {#taikaiingeststatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `cluster` | `String` |
  | `stream` | `String` |
  | `last_latency_ms` | [`Option<u32>`](#option-u32) |
  | `last_live_edge_drift_ms` | [`Option<i32>`](#option-i32) |
  | `error_counts` | [`Vec<TaikaiIngestErrorCounter>`](#vec-taikaiingesterrorcounter) |

## `ThresholdKeyLifecycleActionV1` {#thresholdkeylifecycleactionv1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `install_global_beacon_key` | &mdash; | 0 |
  | `retire_global_beacon_key` | &mdash; | 1 |
  | `install_parliament_tle_key` | &mdash; | 2 |
  | `retire_parliament_tle_key` | &mdash; | 3 |

## `TicketBodyV1` {#ticketbodyv1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `blinded_cid` | [`Array<u8, 32>`](#array-u8-32) |
  | `scope` | [`TicketScopeV1`](#ticketscopev1) |
  | `max_uses` | `u16` |
  | `valid_after` | `u64` |
  | `valid_until` | `u64` |
  | `issuer_id` | [`AccountId`](#accountid) |
  | `salt_epoch` | `u32` |
  | `policy_flags` | `u32` |
  | `metadata` | [`Metadata`](#metadata) |

## `TicketEnvelopeV1` {#ticketenvelopev1}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `body` | [`TicketBodyV1`](#ticketbodyv1) |
  | `commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `zk_proof` | [`Vec<u8>`](#vec-u8) |
  | `signature` | [`Signature`](#signature) |
  | `nullifier` | [`Array<u8, 32>`](#array-u8-32) |

## `TicketScopeV1` {#ticketscopev1}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Read` | &mdash; | 0 |
  | `Write` | &mdash; | 1 |
  | `Admin` | &mdash; | 2 |

## `TimeEvent` {#timeevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `interval` | [`TimeInterval`](#timeinterval) |

## `TimeEventFilter` {#timeeventfilter}

**Type:** Alias

**To:** [`ExecutionTime`](#executiontime)

## `TimeInterval` {#timeinterval}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `since_ms` | `u64` |
  | `length_ms` | `u64` |

## `TimeTriggerEntrypoint` {#timetriggerentrypoint}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |
  | `instructions` | [`ExecutionStep`](#executionstep) |
  | `authority` | [`AccountId`](#accountid) |

## `TimeTriggerRetryPolicy` {#timetriggerretrypolicy}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `max_retries` | [`NonZero<u32>`](#nonzero-u32) |
  | `retry_after_ms` | [`NonZero<u64>`](#nonzero-u64) |

## `TimeoutCertificate` {#timeoutcertificate}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `groups` | [`Vec<TimeoutVoteGroup>`](#vec-timeoutvotegroup) |

## `TimeoutJustification` {#timeoutjustification}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `timeout_certificate` | [`TimeoutCertificate`](#timeoutcertificate) |
  | `highest_prepare_qc` | [`Option<QuorumCertificate>`](#option-quorumcertificate) |

## `TimeoutVote` {#timeoutvote}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `highest_prepare_qc` | [`Option<QuorumCertificate>`](#option-quorumcertificate) |
  | `signer` | `u32` |
  | `signature` | [`Vec<u8>`](#vec-u8) |

## `TimeoutVoteGroup` {#timeoutvotegroup}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `highest_prepare_qc` | [`Option<QuorumCertificate>`](#option-quorumcertificate) |
  | `signers` | [`Vec<u32>`](#vec-u32) |
  | `aggregate_signature` | [`Vec<u8>`](#vec-u8) |

## `TouchManifest` {#touchmanifest}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `read` | [`Vec<String>`](#vec-string) |
  | `write` | [`Vec<String>`](#vec-string) |

## `TransactionAdmissionIntent` {#transactionadmissionintent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `ordinary` | &mdash; | 0 |
  | `queue_plan_synced` | &mdash; | 1 |

## `TransactionDomain` {#transactiondomain}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `network` | [`HashOf<BlockHeader>`](#hashof-blockheader) | 0 |
  | `genesis` | &mdash; | 1 |

## `TransactionEntrypoint` {#transactionentrypoint}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `External` | [`SignedTransaction`](#signedtransaction) | 0 |
  | `SealedCommitment` | [`SignedSealedTransactionCommitment`](#signedsealedtransactioncommitment) | 1 |
  | `SealedReveal` | [`SealedTransactionReveal`](#sealedtransactionreveal) | 2 |
  | `Time` | [`TimeTriggerEntrypoint`](#timetriggerentrypoint) | 3 |

## `TransactionEvent` {#transactionevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `hash` | [`HashOf<SignedTransaction>`](#hashof-signedtransaction) |
  | `block_height` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `lane_id` | [`LaneId`](#laneid) |
  | `dataspace_id` | [`DataSpaceId`](#dataspaceid) |
  | `status` | [`TransactionStatus`](#transactionstatus) |

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

## `TransactionParameter` {#transactionparameter}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `MaxSignatures` | [`NonZero<u64>`](#nonzero-u64) | 0 |
  | `MaxInstructions` | [`NonZero<u64>`](#nonzero-u64) | 1 |
  | `IvmBytecodeSize` | [`NonZero<u64>`](#nonzero-u64) | 2 |
  | `MaxTxBytes` | [`NonZero<u64>`](#nonzero-u64) | 3 |
  | `MaxDecompressedBytes` | [`NonZero<u64>`](#nonzero-u64) | 4 |
  | `MaxMetadataDepth` | [`NonZero<u16>`](#nonzero-u16) | 5 |
  | `MaxTimeToLiveMs` | [`NonZero<u64>`](#nonzero-u64) | 6 |
  | `RequireHeightTtl` | `bool` | 7 |
  | `RequireSequence` | `bool` | 8 |

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

## `TransactionPayload` {#transactionpayload}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `domain` | [`TransactionDomain`](#transactiondomain) |
  | `authority` | [`AccountId`](#accountid) |
  | `creation_time_ms` | `u64` |
  | `instructions` | [`Executable`](#executable) |
  | `time_to_live_ms` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `nonce` | [`Option<NonZero<u32>>`](#option-nonzero-u32) |
  | `fee_payment` | [`FeePaymentIntent`](#feepaymentintent) |
  | `admission_intent` | [`TransactionAdmissionIntent`](#transactionadmissionintent) |
  | `metadata` | [`Metadata`](#metadata) |
  | `attachments` | [`Option<ProofAttachmentList>`](#option-proofattachmentlist) |

## `TransactionRejectionReason` {#transactionrejectionreason}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `AccountDoesNotExist` | [`FindError`](#finderror) | 0 |
  | `LimitCheck` | [`TransactionLimitError`](#transactionlimiterror) | 1 |
  | `Validation` | [`ValidationFail`](#validationfail) | 2 |
  | `InstructionExecution` | [`InstructionExecutionFail`](#instructionexecutionfail) | 3 |
  | `IvmExecution` | [`IvmExecutionFail`](#ivmexecutionfail) | 4 |
  | `TriggerExecution` | [`TriggerExecutionFail`](#triggerexecutionfail) | 5 |

## `TransactionResult` {#transactionresult}

**Type:** Tuple

**Values:** ([`Result<Vec<DataTriggerStep>, TransactionRejectionReason>`](#result-vec-datatriggerstep-transactionrejectionreason), [`Vec<AssetBatchTransferOutcome>`](#vec-assetbatchtransferoutcome))

## `TransactionSignature` {#transactionsignature}

**Type:** Alias

**To:** [`SignatureOf<TransactionPayload>`](#signatureof-transactionpayload)

## `TransactionStatus` {#transactionstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Queued` | &mdash; | 0 |
  | `Expired` | &mdash; | 1 |
  | `Approved` | &mdash; | 2 |
  | `Rejected` | [`TransactionRejectionReason`](#transactionrejectionreason) | 3 |

## `TransferDeltaTranscript` {#transferdeltatranscript}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `from_account` | [`AccountId`](#accountid) |
  | `to_account` | [`AccountId`](#accountid) |
  | `asset_definition` | [`AssetDefinitionId`](#assetdefinitionid) |
  | `amount` | [`Quantity`](#quantity) |
  | `from_balance_before` | [`Quantity`](#quantity) |
  | `from_balance_after` | [`Quantity`](#quantity) |
  | `to_balance_before` | [`Quantity`](#quantity) |
  | `to_balance_after` | [`Quantity`](#quantity) |
  | `from_smt_witness` | [`TransferSmtWitness`](#transfersmtwitness) |
  | `to_smt_witness` | [`TransferSmtWitness`](#transfersmtwitness) |

## `TransferSmtWitness` {#transfersmtwitness}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `root_before` | [`Array<u8, 32>`](#array-u8-32) |
  | `root_after` | [`Array<u8, 32>`](#array-u8-32) |
  | `path_bits` | [`Vec<u8>`](#vec-u8) |
  | `siblings` | [`Vec<Array<u8, 32>>`](#vec-array-u8-32) |

## `TransferTranscript` {#transfertranscript}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `batch_hash` | [`Hash`](#hash) |
  | `deltas` | [`Vec<TransferDeltaTranscript>`](#vec-transferdeltatranscript) |
  | `authority_digest` | [`Hash`](#hash) |
  | `poseidon_preimage_digest` | [`Option<Hash>`](#option-hash) |

## `TransferTranscriptBundle` {#transfertranscriptbundle}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `entry_hash` | [`Hash`](#hash) |
  | `transcripts` | [`Vec<TransferTranscript>`](#vec-transfertranscript) |

## `Trigger` {#trigger}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |
  | `action` | [`Action`](#action) |

## `TriggerCallback` {#triggercallback}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `namespace` | [`Option<String>`](#option-string) |
  | `entrypoint` | `String` |

## `TriggerCompletedEvent` {#triggercompletedevent}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`TriggerId`](#triggerid) |
  | `trigger_execution_hash` | [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint) |
  | `step_index` | `u32` |
  | `outcome` | [`TriggerCompletedOutcome`](#triggercompletedoutcome) |

## `TriggerCompletedEventFilter` {#triggercompletedeventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger_id` | [`Option<TriggerId>`](#option-triggerid) |
  | `outcome_type` | [`Option<TriggerCompletedOutcomeType>`](#option-triggercompletedoutcometype) |

## `TriggerCompletedOutcome` {#triggercompletedoutcome}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Success` | &mdash; | 0 |
  | `Failure` | `String` | 1 |

## `TriggerCompletedOutcomeType` {#triggercompletedoutcometype}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Success` | &mdash; | 0 |
  | `Failure` | &mdash; | 1 |

## `TriggerDescriptor` {#triggerdescriptor}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`TriggerId`](#triggerid) |
  | `repeats` | [`Repeats`](#repeats) |
  | `filter` | [`EventFilterBox`](#eventfilterbox) |
  | `authority` | [`Option<AccountId>`](#option-accountid) |
  | `metadata` | [`Metadata`](#metadata) |
  | `callback` | [`TriggerCallback`](#triggercallback) |

## `TriggerEvent` {#triggerevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Created` | [`TriggerId`](#triggerid) | 0 |
  | `Deleted` | [`TriggerId`](#triggerid) | 1 |
  | `Extended` | [`TriggerNumberOfExecutionsChanged`](#triggernumberofexecutionschanged) | 2 |
  | `Shortened` | [`TriggerNumberOfExecutionsChanged`](#triggernumberofexecutionschanged) | 3 |
  | `MetadataInserted` | [`MetadataChanged<TriggerId>`](#metadatachanged-triggerid) | 4 |
  | `MetadataRemoved` | [`MetadataChanged<TriggerId>`](#metadatachanged-triggerid) | 5 |

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

## `TriggerNumberOfExecutionsChanged` {#triggernumberofexecutionschanged}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `trigger` | [`TriggerId`](#triggerid) |
  | `by` | `u32` |

## `TwitterBindingAttestation` {#twitterbindingattestation}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_hash` | [`KeyedHash`](#keyedhash) |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `status` | [`TwitterBindingStatus`](#twitterbindingstatus) |
  | `tweet_id` | [`Option<String>`](#option-string) |
  | `challenge_hash` | [`Option<Hash>`](#option-hash) |
  | `expires_at_ms` | `u64` |
  | `observed_at_ms` | `u64` |
  | `request_hash` | [`Hash`](#hash) |
  | `slot` | `u64` |
  | `feed_config_version` | [`FeedConfigVersion`](#feedconfigversion) |

## `TwitterBindingRecord` {#twitterbindingrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `feed_id` | [`FeedId`](#feedid) |
  | `provider` | [`AccountId`](#accountid) |
  | `attestation` | [`TwitterBindingAttestation`](#twitterbindingattestation) |
  | `recorded_at_ms` | `u64` |

## `TwitterBindingRecorded` {#twitterbindingrecorded}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `record` | [`TwitterBindingRecord`](#twitterbindingrecord) |

## `TwitterBindingRevoked` {#twitterbindingrevoked}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_hash` | [`KeyedHash`](#keyedhash) |
  | `revoked_by` | [`AccountId`](#accountid) |
  | `reason` | `String` |
  | `recorded_at_ms` | `u64` |

## `TwitterBindingStatus` {#twitterbindingstatus}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Following` | &mdash; | 0 |
  | `ChallengeMissing` | &mdash; | 1 |
  | `Denied` | &mdash; | 2 |

## `TxGossipCaps` {#txgossipcaps}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `frame_cap_bytes` | `u64` |
  | `public_target_cap` | [`Option<u64>`](#option-u64) |
  | `restricted_target_cap` | [`Option<u64>`](#option-u64) |
  | `public_target_reshuffle_ms` | [`Option<u64>`](#option-u64) |
  | `restricted_target_reshuffle_ms` | [`Option<u64>`](#option-u64) |
  | `drop_unknown_dataspace` | `bool` |
  | `restricted_fallback` | `String` |
  | `restricted_public_policy` | `String` |

## `TxGossipSnapshot` {#txgossipsnapshot}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `caps` | [`TxGossipCaps`](#txgossipcaps) |
  | `targets` | [`Vec<TxGossipStatus>`](#vec-txgossipstatus) |

## `TxGossipStatus` {#txgossipstatus}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `plane` | `String` |
  | `dataspace_id` | `u64` |
  | `dataspace_alias` | [`Option<String>`](#option-string) |
  | `lane_ids` | [`Vec<u32>`](#vec-u32) |
  | `targets` | `u64` |
  | `target_peers` | [`Vec<String>`](#vec-string) |
  | `outcome` | `String` |
  | `fallback_used` | `bool` |
  | `fallback_surface` | [`Option<String>`](#option-string) |
  | `reason` | [`Option<String>`](#option-string) |
  | `target_cap` | `u64` |
  | `batch_txs` | `u64` |
  | `frame_bytes` | `u64` |

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

## `UploadSmartContractCodeChunk` {#uploadsmartcontractcodechunk}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `code_hash` | [`Hash`](#hash) |
  | `total_size` | `u64` |
  | `chunk_index` | `u32` |
  | `chunk_count` | `u32` |
  | `chunk` | [`Vec<u8>`](#vec-u8) |

## `Uptime` {#uptime}

**Type:** Tuple

**Values:** (`u64`, `u32`)

## `ValidationFail` {#validationfail}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `NotPermitted` | `String` | 0 |
  | `IvmAdmission` | [`IvmAdmissionError`](#ivmadmissionerror) | 1 |
  | `InstructionFailed` | [`InstructionExecutionError`](#instructionexecutionerror) | 2 |
  | `ContractRejected` | [`ContractRejection`](#contractrejection) | 3 |
  | `QueryFailed` | [`QueryExecutionFail`](#queryexecutionfail) | 4 |
  | `AxtReject` | [`AxtRejectContext`](#axtrejectcontext) | 5 |
  | `TooComplex` | &mdash; | 6 |
  | `InternalError` | &mdash; | 7 |

## `ValidatorPower` {#validatorpower}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `validator` | [`PeerId`](#peerid) |
  | `power` | `u64` |

## `Vec<Account>` {#vec-account}

**Type:** Vec

**Value:** [`Account`](#account)

## `Vec<AccountAliasBindingRecord>` {#vec-accountaliasbindingrecord}

**Type:** Vec

**Value:** [`AccountAliasBindingRecord`](#accountaliasbindingrecord)

## `Vec<AccountId>` {#vec-accountid}

**Type:** Vec

**Value:** [`AccountId`](#accountid)

## `Vec<Action>` {#vec-action}

**Type:** Vec

**Value:** [`Action`](#action)

## `Vec<Algorithm>` {#vec-algorithm}

**Type:** Vec

**Value:** [`Algorithm`](#algorithm)

## `Vec<ArchiveId>` {#vec-archiveid}

**Type:** Vec

**Value:** [`ArchiveId`](#archiveid)

## `Vec<Array<u8, 32>>` {#vec-array-u8-32}

**Type:** Vec

**Value:** [`Array<u8, 32>`](#array-u8-32)

## `Vec<Asset>` {#vec-asset}

**Type:** Vec

**Value:** [`Asset`](#asset)

## `Vec<AssetBatchTransferOutcome>` {#vec-assetbatchtransferoutcome}

**Type:** Vec

**Value:** [`AssetBatchTransferOutcome`](#assetbatchtransferoutcome)

## `Vec<AssetDefinition>` {#vec-assetdefinition}

**Type:** Vec

**Value:** [`AssetDefinition`](#assetdefinition)

## `Vec<AssetDefinitionId>` {#vec-assetdefinitionid}

**Type:** Vec

**Value:** [`AssetDefinitionId`](#assetdefinitionid)

## `Vec<AssetEscrowRecord>` {#vec-assetescrowrecord}

**Type:** Vec

**Value:** [`AssetEscrowRecord`](#assetescrowrecord)

## `Vec<AssetId>` {#vec-assetid}

**Type:** Vec

**Value:** [`AssetId`](#assetid)

## `Vec<AutonomousLanePayloadEnvelopeV1>` {#vec-autonomouslanepayloadenvelopev1}

**Type:** Vec

**Value:** [`AutonomousLanePayloadEnvelopeV1`](#autonomouslanepayloadenvelopev1)

## `Vec<AxtEnvelopeRecord>` {#vec-axtenveloperecord}

**Type:** Vec

**Value:** [`AxtEnvelopeRecord`](#axtenveloperecord)

## `Vec<AxtHandleFragment>` {#vec-axthandlefragment}

**Type:** Vec

**Value:** [`AxtHandleFragment`](#axthandlefragment)

## `Vec<AxtPolicyBinding>` {#vec-axtpolicybinding}

**Type:** Vec

**Value:** [`AxtPolicyBinding`](#axtpolicybinding)

## `Vec<AxtProofFragment>` {#vec-axtprooffragment}

**Type:** Vec

**Value:** [`AxtProofFragment`](#axtprooffragment)

## `Vec<AxtTouchFragment>` {#vec-axttouchfragment}

**Type:** Vec

**Value:** [`AxtTouchFragment`](#axttouchfragment)

## `Vec<AxtTouchSpec>` {#vec-axttouchspec}

**Type:** Vec

**Value:** [`AxtTouchSpec`](#axttouchspec)

## `Vec<BlockHeader>` {#vec-blockheader}

**Type:** Vec

**Value:** [`BlockHeader`](#blockheader)

## `Vec<ClassRentRate>` {#vec-classrentrate}

**Type:** Vec

**Value:** [`ClassRentRate`](#classrentrate)

## `Vec<CommittedTransaction>` {#vec-committedtransaction}

**Type:** Vec

**Value:** [`CommittedTransaction`](#committedtransaction)

## `Vec<ConditionalEscrowConditionState>` {#vec-conditionalescrowconditionstate}

**Type:** Vec

**Value:** [`ConditionalEscrowConditionState`](#conditionalescrowconditionstate)

## `Vec<ContractErrorCodeDescriptor>` {#vec-contracterrorcodedescriptor}

**Type:** Vec

**Value:** [`ContractErrorCodeDescriptor`](#contracterrorcodedescriptor)

## `Vec<DaCommitmentRecord>` {#vec-dacommitmentrecord}

**Type:** Vec

**Value:** [`DaCommitmentRecord`](#dacommitmentrecord)

## `Vec<DaIngestSignatureV1>` {#vec-daingestsignaturev1}

**Type:** Vec

**Value:** [`DaIngestSignatureV1`](#daingestsignaturev1)

## `Vec<DaPinIntent>` {#vec-dapinintent}

**Type:** Vec

**Value:** [`DaPinIntent`](#dapinintent)

## `Vec<DaPinScopeSignatureV1>` {#vec-dapinscopesignaturev1}

**Type:** Vec

**Value:** [`DaPinScopeSignatureV1`](#dapinscopesignaturev1)

## `Vec<DaProofPolicy>` {#vec-daproofpolicy}

**Type:** Vec

**Value:** [`DaProofPolicy`](#daproofpolicy)

## `Vec<DaReceiptCursorStatus>` {#vec-dareceiptcursorstatus}

**Type:** Vec

**Value:** [`DaReceiptCursorStatus`](#dareceiptcursorstatus)

## `Vec<DataSpaceId>` {#vec-dataspaceid}

**Type:** Vec

**Value:** [`DataSpaceId`](#dataspaceid)

## `Vec<DataTriggerStep>` {#vec-datatriggerstep}

**Type:** Vec

**Value:** [`DataTriggerStep`](#datatriggerstep)

## `Vec<DefiOracleAttestation>` {#vec-defioracleattestation}

**Type:** Vec

**Value:** [`DefiOracleAttestation`](#defioracleattestation)

## `Vec<DefiOracleAttestationSource>` {#vec-defioracleattestationsource}

**Type:** Vec

**Value:** [`DefiOracleAttestationSource`](#defioracleattestationsource)

## `Vec<Domain>` {#vec-domain}

**Type:** Vec

**Value:** [`Domain`](#domain)

## `Vec<DomainEndorsementRecord>` {#vec-domainendorsementrecord}

**Type:** Vec

**Value:** [`DomainEndorsementRecord`](#domainendorsementrecord)

## `Vec<DomainEndorsementSignature>` {#vec-domainendorsementsignature}

**Type:** Vec

**Value:** [`DomainEndorsementSignature`](#domainendorsementsignature)

## `Vec<DomainId>` {#vec-domainid}

**Type:** Vec

**Value:** [`DomainId`](#domainid)

## `Vec<DynamicAccessHint>` {#vec-dynamicaccesshint}

**Type:** Vec

**Value:** [`DynamicAccessHint`](#dynamicaccesshint)

## `Vec<EntrypointArgumentFieldV1>` {#vec-entrypointargumentfieldv1}

**Type:** Vec

**Value:** [`EntrypointArgumentFieldV1`](#entrypointargumentfieldv1)

## `Vec<EntrypointDescriptor>` {#vec-entrypointdescriptor}

**Type:** Vec

**Value:** [`EntrypointDescriptor`](#entrypointdescriptor)

## `Vec<EntrypointParamDescriptor>` {#vec-entrypointparamdescriptor}

**Type:** Vec

**Value:** [`EntrypointParamDescriptor`](#entrypointparamdescriptor)

## `Vec<EntrypointValueTypeNodeV1>` {#vec-entrypointvaluetypenodev1}

**Type:** Vec

**Value:** [`EntrypointValueTypeNodeV1`](#entrypointvaluetypenodev1)

## `Vec<EventFilterBox>` {#vec-eventfilterbox}

**Type:** Vec

**Value:** [`EventFilterBox`](#eventfilterbox)

## `Vec<ExecKv>` {#vec-execkv}

**Type:** Vec

**Value:** [`ExecKv`](#execkv)

## `Vec<ExecutableBatchItem>` {#vec-executablebatchitem}

**Type:** Vec

**Value:** [`ExecutableBatchItem`](#executablebatchitem)

## `Vec<ExternalExecutionContext>` {#vec-externalexecutioncontext}

**Type:** Vec

**Value:** [`ExternalExecutionContext`](#externalexecutioncontext)

## `Vec<ExternalExecutionRouteLeg>` {#vec-externalexecutionrouteleg}

**Type:** Vec

**Value:** [`ExternalExecutionRouteLeg`](#externalexecutionrouteleg)

## `Vec<FastpqStateTransition>` {#vec-fastpqstatetransition}

**Type:** Vec

**Value:** [`FastpqStateTransition`](#fastpqstatetransition)

## `Vec<FastpqTransitionBatch>` {#vec-fastpqtransitionbatch}

**Type:** Vec

**Value:** [`FastpqTransitionBatch`](#fastpqtransitionbatch)

## `Vec<FeeChargeLimit>` {#vec-feechargelimit}

**Type:** Vec

**Value:** [`FeeChargeLimit`](#feechargelimit)

## `Vec<FeeSponsorProgram>` {#vec-feesponsorprogram}

**Type:** Vec

**Value:** [`FeeSponsorProgram`](#feesponsorprogram)

## `Vec<FeeSponsorProgramId>` {#vec-feesponsorprogramid}

**Type:** Vec

**Value:** [`FeeSponsorProgramId`](#feesponsorprogramid)

## `Vec<FeedConfig>` {#vec-feedconfig}

**Type:** Vec

**Value:** [`FeedConfig`](#feedconfig)

## `Vec<FeedEventRecord>` {#vec-feedeventrecord}

**Type:** Vec

**Value:** [`FeedEventRecord`](#feedeventrecord)

## `Vec<GovernanceManifestActivation>` {#vec-governancemanifestactivation}

**Type:** Vec

**Value:** [`GovernanceManifestActivation`](#governancemanifestactivation)

## `Vec<Hash>` {#vec-hash}

**Type:** Vec

**Value:** [`Hash`](#hash)

## `Vec<HashOf<BlockHeader>>` {#vec-hashof-blockheader}

**Type:** Vec

**Value:** [`HashOf<BlockHeader>`](#hashof-blockheader)

## `Vec<HashOf<SignedTransaction>>` {#vec-hashof-signedtransaction}

**Type:** Vec

**Value:** [`HashOf<SignedTransaction>`](#hashof-signedtransaction)

## `Vec<HashOf<TransactionEntrypoint>>` {#vec-hashof-transactionentrypoint}

**Type:** Vec

**Value:** [`HashOf<TransactionEntrypoint>`](#hashof-transactionentrypoint)

## `Vec<HashOf<TransactionResult>>` {#vec-hashof-transactionresult}

**Type:** Vec

**Value:** [`HashOf<TransactionResult>`](#hashof-transactionresult)

## `Vec<HashOf<Vec<InstructionBox>>>` {#vec-hashof-vec-instructionbox}

**Type:** Vec

**Value:** [`HashOf<Vec<InstructionBox>>`](#hashof-vec-instructionbox)

## `Vec<InstructionBox>` {#vec-instructionbox}

**Type:** Vec

**Value:** [`InstructionBox`](#instructionbox)

## `Vec<Json>` {#vec-json}

**Type:** Vec

**Value:** [`Json`](#json)

## `Vec<KotobaTranslation>` {#vec-kotobatranslation}

**Type:** Vec

**Value:** [`KotobaTranslation`](#kotobatranslation)

## `Vec<KotobaTranslationEntry>` {#vec-kotobatranslationentry}

**Type:** Vec

**Value:** [`KotobaTranslationEntry`](#kotobatranslationentry)

## `Vec<LaneDrainCertificateV1>` {#vec-lanedraincertificatev1}

**Type:** Vec

**Value:** [`LaneDrainCertificateV1`](#lanedraincertificatev1)

## `Vec<LaneFinalityStatement>` {#vec-lanefinalitystatement}

**Type:** Vec

**Value:** [`LaneFinalityStatement`](#lanefinalitystatement)

## `Vec<LaneSettlementReceipt>` {#vec-lanesettlementreceipt}

**Type:** Vec

**Value:** [`LaneSettlementReceipt`](#lanesettlementreceipt)

## `Vec<MergeLaneBinding>` {#vec-mergelanebinding}

**Type:** Vec

**Value:** [`MergeLaneBinding`](#mergelanebinding)

## `Vec<MergeLaneExecution>` {#vec-mergelaneexecution}

**Type:** Vec

**Value:** [`MergeLaneExecution`](#mergelaneexecution)

## `Vec<MergeLaneSignerProof>` {#vec-mergelanesignerproof}

**Type:** Vec

**Value:** [`MergeLaneSignerProof`](#mergelanesignerproof)

## `Vec<MergeLaneSnapshot>` {#vec-mergelanesnapshot}

**Type:** Vec

**Value:** [`MergeLaneSnapshot`](#mergelanesnapshot)

## `Vec<MergeSignerProof>` {#vec-mergesignerproof}

**Type:** Vec

**Value:** [`MergeSignerProof`](#mergesignerproof)

## `Vec<Metadata>` {#vec-metadata}

**Type:** Vec

**Value:** [`Metadata`](#metadata)

## `Vec<ModerationChallengeRecordV1>` {#vec-moderationchallengerecordv1}

**Type:** Vec

**Value:** [`ModerationChallengeRecordV1`](#moderationchallengerecordv1)

## `Vec<ModerationCommitRecordV1>` {#vec-moderationcommitrecordv1}

**Type:** Vec

**Value:** [`ModerationCommitRecordV1`](#moderationcommitrecordv1)

## `Vec<ModerationFinalizedAppealViewV1>` {#vec-moderationfinalizedappealviewv1}

**Type:** Vec

**Value:** [`ModerationFinalizedAppealViewV1`](#moderationfinalizedappealviewv1)

## `Vec<ModerationFinalizedCaseViewV1>` {#vec-moderationfinalizedcaseviewv1}

**Type:** Vec

**Value:** [`ModerationFinalizedCaseViewV1`](#moderationfinalizedcaseviewv1)

## `Vec<ModerationFinalizedEventV1>` {#vec-moderationfinalizedeventv1}

**Type:** Vec

**Value:** [`ModerationFinalizedEventV1`](#moderationfinalizedeventv1)

## `Vec<ModerationJurorEligibilityRecordV1>` {#vec-moderationjuroreligibilityrecordv1}

**Type:** Vec

**Value:** [`ModerationJurorEligibilityRecordV1`](#moderationjuroreligibilityrecordv1)

## `Vec<ModerationJurorReplacementV1>` {#vec-moderationjurorreplacementv1}

**Type:** Vec

**Value:** [`ModerationJurorReplacementV1`](#moderationjurorreplacementv1)

## `Vec<ModerationNoShowRecordV1>` {#vec-moderationnoshowrecordv1}

**Type:** Vec

**Value:** [`ModerationNoShowRecordV1`](#moderationnoshowrecordv1)

## `Vec<ModerationRevealRecordV1>` {#vec-moderationrevealrecordv1}

**Type:** Vec

**Value:** [`ModerationRevealRecordV1`](#moderationrevealrecordv1)

## `Vec<MultisigMember>` {#vec-multisigmember}

**Type:** Vec

**Value:** [`MultisigMember`](#multisigmember)

## `Vec<MultisigSignature>` {#vec-multisigsignature}

**Type:** Vec

**Value:** [`MultisigSignature`](#multisigsignature)

## `Vec<MusubiAliasHistoryEntryV1>` {#vec-musubialiashistoryentryv1}

**Type:** Vec

**Value:** [`MusubiAliasHistoryEntryV1`](#musubialiashistoryentryv1)

## `Vec<MusubiArchiveLocationIdV1>` {#vec-musubiarchivelocationidv1}

**Type:** Vec

**Value:** [`MusubiArchiveLocationIdV1`](#musubiarchivelocationidv1)

## `Vec<MusubiArchiveLocationV1>` {#vec-musubiarchivelocationv1}

**Type:** Vec

**Value:** [`MusubiArchiveLocationV1`](#musubiarchivelocationv1)

## `Vec<MusubiArchiveRetentionDecisionV1>` {#vec-musubiarchiveretentiondecisionv1}

**Type:** Vec

**Value:** [`MusubiArchiveRetentionDecisionV1`](#musubiarchiveretentiondecisionv1)

## `Vec<MusubiDependencyReqV1>` {#vec-musubidependencyreqv1}

**Type:** Vec

**Value:** [`MusubiDependencyReqV1`](#musubidependencyreqv1)

## `Vec<MusubiKeywordV1>` {#vec-musubikeywordv1}

**Type:** Vec

**Value:** [`MusubiKeywordV1`](#musubikeywordv1)

## `Vec<MusubiMaintainerDirectoryEntryV1>` {#vec-musubimaintainerdirectoryentryv1}

**Type:** Vec

**Value:** [`MusubiMaintainerDirectoryEntryV1`](#musubimaintainerdirectoryentryv1)

## `Vec<MusubiOrderedPackageEntryV1>` {#vec-musubiorderedpackageentryv1}

**Type:** Vec

**Value:** [`MusubiOrderedPackageEntryV1`](#musubiorderedpackageentryv1)

## `Vec<MusubiPrereleaseIdentifierV1>` {#vec-musubiprereleaseidentifierv1}

**Type:** Vec

**Value:** [`MusubiPrereleaseIdentifierV1`](#musubiprereleaseidentifierv1)

## `Vec<MusubiProviderBundleVerificationApprovalV1>` {#vec-musubiproviderbundleverificationapprovalv1}

**Type:** Vec

**Value:** [`MusubiProviderBundleVerificationApprovalV1`](#musubiproviderbundleverificationapprovalv1)

## `Vec<MusubiResolverReleaseRowV1>` {#vec-musubiresolverreleaserowv1}

**Type:** Vec

**Value:** [`MusubiResolverReleaseRowV1`](#musubiresolverreleaserowv1)

## `Vec<MusubiSeedIngressReceiptApprovalV1>` {#vec-musubiseedingressreceiptapprovalv1}

**Type:** Vec

**Value:** [`MusubiSeedIngressReceiptApprovalV1`](#musubiseedingressreceiptapprovalv1)

## `Vec<MusubiVersionComparatorV1>` {#vec-musubiversioncomparatorv1}

**Type:** Vec

**Value:** [`MusubiVersionComparatorV1`](#musubiversioncomparatorv1)

## `Vec<MusubiVersionV1>` {#vec-musubiversionv1}

**Type:** Vec

**Value:** [`MusubiVersionV1`](#musubiversionv1)

## `Vec<Name>` {#vec-name}

**Type:** Vec

**Value:** [`Name`](#name)

## `Vec<NativeAmxLegRecordV2>` {#vec-nativeamxlegrecordv2}

**Type:** Vec

**Value:** [`NativeAmxLegRecordV2`](#nativeamxlegrecordv2)

## `Vec<NativeAmxReceipt>` {#vec-nativeamxreceipt}

**Type:** Vec

**Value:** [`NativeAmxReceipt`](#nativeamxreceipt)

## `Vec<NexusDataspaceCatalogStatus>` {#vec-nexusdataspacecatalogstatus}

**Type:** Vec

**Value:** [`NexusDataspaceCatalogStatus`](#nexusdataspacecatalogstatus)

## `Vec<NexusDataspaceTeuStatus>` {#vec-nexusdataspaceteustatus}

**Type:** Vec

**Value:** [`NexusDataspaceTeuStatus`](#nexusdataspaceteustatus)

## `Vec<NexusFeeReceipt>` {#vec-nexusfeereceipt}

**Type:** Vec

**Value:** [`NexusFeeReceipt`](#nexusfeereceipt)

## `Vec<NexusLaneManifestValidatorBindingStatus>` {#vec-nexuslanemanifestvalidatorbindingstatus}

**Type:** Vec

**Value:** [`NexusLaneManifestValidatorBindingStatus`](#nexuslanemanifestvalidatorbindingstatus)

## `Vec<NexusLaneTeuStatus>` {#vec-nexuslaneteustatus}

**Type:** Vec

**Value:** [`NexusLaneTeuStatus`](#nexuslaneteustatus)

## `Vec<NexusRoutingRuleStatus>` {#vec-nexusroutingrulestatus}

**Type:** Vec

**Value:** [`NexusRoutingRuleStatus`](#nexusroutingrulestatus)

## `Vec<Nft>` {#vec-nft}

**Type:** Vec

**Value:** [`Nft`](#nft)

## `Vec<NftId>` {#vec-nftid}

**Type:** Vec

**Value:** [`NftId`](#nftid)

## `Vec<NposPenaltyAction>` {#vec-npospenaltyaction}

**Type:** Vec

**Value:** [`NposPenaltyAction`](#npospenaltyaction)

## `Vec<Numeric>` {#vec-numeric}

**Type:** Vec

**Value:** [`Numeric`](#numeric)

## `Vec<OpaqueAccountId>` {#vec-opaqueaccountid}

**Type:** Vec

**Value:** [`OpaqueAccountId`](#opaqueaccountid)

## `Vec<Option<HashOf<Array<u8, 32>>>>` {#vec-option-hashof-array-u8-32}

**Type:** Vec

**Value:** [`Option<HashOf<Array<u8, 32>>>`](#option-hashof-array-u8-32)

## `Vec<Option<HashOf<LaneFinalityStatement>>>` {#vec-option-hashof-lanefinalitystatement}

**Type:** Vec

**Value:** [`Option<HashOf<LaneFinalityStatement>>`](#option-hashof-lanefinalitystatement)

## `Vec<Option<HashOf<TransactionEntrypoint>>>` {#vec-option-hashof-transactionentrypoint}

**Type:** Vec

**Value:** [`Option<HashOf<TransactionEntrypoint>>`](#option-hashof-transactionentrypoint)

## `Vec<Option<HashOf<TransactionResult>>>` {#vec-option-hashof-transactionresult}

**Type:** Vec

**Value:** [`Option<HashOf<TransactionResult>>`](#option-hashof-transactionresult)

## `Vec<Option<NativeAmxReceipt>>` {#vec-option-nativeamxreceipt}

**Type:** Vec

**Value:** [`Option<NativeAmxReceipt>`](#option-nativeamxreceipt)

## `Vec<OracleChangeEvidence>` {#vec-oraclechangeevidence}

**Type:** Vec

**Value:** [`OracleChangeEvidence`](#oraclechangeevidence)

## `Vec<OracleChangeProposal>` {#vec-oraclechangeproposal}

**Type:** Vec

**Value:** [`OracleChangeProposal`](#oraclechangeproposal)

## `Vec<OracleChangeStageRecord>` {#vec-oraclechangestagerecord}

**Type:** Vec

**Value:** [`OracleChangeStageRecord`](#oraclechangestagerecord)

## `Vec<OracleDispute>` {#vec-oracledispute}

**Type:** Vec

**Value:** [`OracleDispute`](#oracledispute)

## `Vec<OracleProviderStatsRecord>` {#vec-oracleproviderstatsrecord}

**Type:** Vec

**Value:** [`OracleProviderStatsRecord`](#oracleproviderstatsrecord)

## `Vec<OrderbookFinalizedEventV1>` {#vec-orderbookfinalizedeventv1}

**Type:** Vec

**Value:** [`OrderbookFinalizedEventV1`](#orderbookfinalizedeventv1)

## `Vec<OrderbookOrderRecord>` {#vec-orderbookorderrecord}

**Type:** Vec

**Value:** [`OrderbookOrderRecord`](#orderbookorderrecord)

## `Vec<OrderbookSettlementChannelRecord>` {#vec-orderbooksettlementchannelrecord}

**Type:** Vec

**Value:** [`OrderbookSettlementChannelRecord`](#orderbooksettlementchannelrecord)

## `Vec<OrderbookSettlementReceiptRecord>` {#vec-orderbooksettlementreceiptrecord}

**Type:** Vec

**Value:** [`OrderbookSettlementReceiptRecord`](#orderbooksettlementreceiptrecord)

## `Vec<OrderbookTradeRecord>` {#vec-orderbooktraderecord}

**Type:** Vec

**Value:** [`OrderbookTradeRecord`](#orderbooktraderecord)

## `Vec<Parameter>` {#vec-parameter}

**Type:** Vec

**Value:** [`Parameter`](#parameter)

## `Vec<PeerId>` {#vec-peerid}

**Type:** Vec

**Value:** [`PeerId`](#peerid)

## `Vec<Permission>` {#vec-permission}

**Type:** Vec

**Value:** [`Permission`](#permission)

## `Vec<PinManifestSummaryV1>` {#vec-pinmanifestsummaryv1}

**Type:** Vec

**Value:** [`PinManifestSummaryV1`](#pinmanifestsummaryv1)

## `Vec<PipelineEventBox>` {#vec-pipelineeventbox}

**Type:** Vec

**Value:** [`PipelineEventBox`](#pipelineeventbox)

## `Vec<ProofAttachment>` {#vec-proofattachment}

**Type:** Vec

**Value:** [`ProofAttachment`](#proofattachment)

## `Vec<ProofId>` {#vec-proofid}

**Type:** Vec

**Value:** [`ProofId`](#proofid)

## `Vec<ProofOutcomeFinalizedEventV1>` {#vec-proofoutcomefinalizedeventv1}

**Type:** Vec

**Value:** [`ProofOutcomeFinalizedEventV1`](#proofoutcomefinalizedeventv1)

## `Vec<ProofRecord>` {#vec-proofrecord}

**Type:** Vec

**Value:** [`ProofRecord`](#proofrecord)

## `Vec<ProviderId>` {#vec-providerid}

**Type:** Vec

**Value:** [`ProviderId`](#providerid)

## `Vec<PublicKey>` {#vec-publickey}

**Type:** Vec

**Value:** [`PublicKey`](#publickey)

## `Vec<QueryOutputBatchBox>` {#vec-queryoutputbatchbox}

**Type:** Vec

**Value:** [`QueryOutputBatchBox`](#queryoutputbatchbox)

## `Vec<RecoveryGuardian>` {#vec-recoveryguardian}

**Type:** Vec

**Value:** [`RecoveryGuardian`](#recoveryguardian)

## `Vec<RepairFinalizedEventV1>` {#vec-repairfinalizedeventv1}

**Type:** Vec

**Value:** [`RepairFinalizedEventV1`](#repairfinalizedeventv1)

## `Vec<RepairLedgerActionReceiptV1>` {#vec-repairledgeractionreceiptv1}

**Type:** Vec

**Value:** [`RepairLedgerActionReceiptV1`](#repairledgeractionreceiptv1)

## `Vec<RepairLedgerTaskV1>` {#vec-repairledgertaskv1}

**Type:** Vec

**Value:** [`RepairLedgerTaskV1`](#repairledgertaskv1)

## `Vec<RepoAgreement>` {#vec-repoagreement}

**Type:** Vec

**Value:** [`RepoAgreement`](#repoagreement)

## `Vec<ReportEntry>` {#vec-reportentry}

**Type:** Vec

**Value:** [`ReportEntry`](#reportentry)

## `Vec<ReputationJournalFinalizedEventV1>` {#vec-reputationjournalfinalizedeventv1}

**Type:** Vec

**Value:** [`ReputationJournalFinalizedEventV1`](#reputationjournalfinalizedeventv1)

## `Vec<ReserveAppealRecordV1>` {#vec-reserveappealrecordv1}

**Type:** Vec

**Value:** [`ReserveAppealRecordV1`](#reserveappealrecordv1)

## `Vec<ReserveFinalizedEventV1>` {#vec-reservefinalizedeventv1}

**Type:** Vec

**Value:** [`ReserveFinalizedEventV1`](#reservefinalizedeventv1)

## `Vec<ReserveMovementRecordV1>` {#vec-reservemovementrecordv1}

**Type:** Vec

**Value:** [`ReserveMovementRecordV1`](#reservemovementrecordv1)

## `Vec<ReserveProviderAccountV1>` {#vec-reserveprovideraccountv1}

**Type:** Vec

**Value:** [`ReserveProviderAccountV1`](#reserveprovideraccountv1)

## `Vec<ReserveTierConfig>` {#vec-reservetierconfig}

**Type:** Vec

**Value:** [`ReserveTierConfig`](#reservetierconfig)

## `Vec<Role>` {#vec-role}

**Type:** Vec

**Value:** [`Role`](#role)

## `Vec<RoleId>` {#vec-roleid}

**Type:** Vec

**Value:** [`RoleId`](#roleid)

## `Vec<Rwa>` {#vec-rwa}

**Type:** Vec

**Value:** [`Rwa`](#rwa)

## `Vec<RwaId>` {#vec-rwaid}

**Type:** Vec

**Value:** [`RwaId`](#rwaid)

## `Vec<RwaParentRef>` {#vec-rwaparentref}

**Type:** Vec

**Value:** [`RwaParentRef`](#rwaparentref)

## `Vec<SignedBlock>` {#vec-signedblock}

**Type:** Vec

**Value:** [`SignedBlock`](#signedblock)

## `Vec<StateDescriptor>` {#vec-statedescriptor}

**Type:** Vec

**Value:** [`StateDescriptor`](#statedescriptor)

## `Vec<StreamingRouteBinding>` {#vec-streamingroutebinding}

**Type:** Vec

**Value:** [`StreamingRouteBinding`](#streamingroutebinding)

## `Vec<String>` {#vec-string}

**Type:** Vec

**Value:** `String`

## `Vec<SumeragiLanePayloadOwnership>` {#vec-sumeragilanepayloadownership}

**Type:** Vec

**Value:** [`SumeragiLanePayloadOwnership`](#sumeragilanepayloadownership)

## `Vec<SumeragiV2EquivocationEvidence>` {#vec-sumeragiv2equivocationevidence}

**Type:** Vec

**Value:** [`SumeragiV2EquivocationEvidence`](#sumeragiv2equivocationevidence)

## `Vec<TaikaiAliasRotationStatus>` {#vec-taikaialiasrotationstatus}

**Type:** Vec

**Value:** [`TaikaiAliasRotationStatus`](#taikaialiasrotationstatus)

## `Vec<TaikaiIngestErrorCounter>` {#vec-taikaiingesterrorcounter}

**Type:** Vec

**Value:** [`TaikaiIngestErrorCounter`](#taikaiingesterrorcounter)

## `Vec<TaikaiIngestStatus>` {#vec-taikaiingeststatus}

**Type:** Vec

**Value:** [`TaikaiIngestStatus`](#taikaiingeststatus)

## `Vec<TimeTriggerEntrypoint>` {#vec-timetriggerentrypoint}

**Type:** Vec

**Value:** [`TimeTriggerEntrypoint`](#timetriggerentrypoint)

## `Vec<TimeoutVoteGroup>` {#vec-timeoutvotegroup}

**Type:** Vec

**Value:** [`TimeoutVoteGroup`](#timeoutvotegroup)

## `Vec<TransactionEntrypoint>` {#vec-transactionentrypoint}

**Type:** Vec

**Value:** [`TransactionEntrypoint`](#transactionentrypoint)

## `Vec<TransactionResult>` {#vec-transactionresult}

**Type:** Vec

**Value:** [`TransactionResult`](#transactionresult)

## `Vec<TransferDeltaTranscript>` {#vec-transferdeltatranscript}

**Type:** Vec

**Value:** [`TransferDeltaTranscript`](#transferdeltatranscript)

## `Vec<TransferTranscript>` {#vec-transfertranscript}

**Type:** Vec

**Value:** [`TransferTranscript`](#transfertranscript)

## `Vec<TransferTranscriptBundle>` {#vec-transfertranscriptbundle}

**Type:** Vec

**Value:** [`TransferTranscriptBundle`](#transfertranscriptbundle)

## `Vec<Trigger>` {#vec-trigger}

**Type:** Vec

**Value:** [`Trigger`](#trigger)

## `Vec<TriggerCompletedEvent>` {#vec-triggercompletedevent}

**Type:** Vec

**Value:** [`TriggerCompletedEvent`](#triggercompletedevent)

## `Vec<TriggerDescriptor>` {#vec-triggerdescriptor}

**Type:** Vec

**Value:** [`TriggerDescriptor`](#triggerdescriptor)

## `Vec<TriggerId>` {#vec-triggerid}

**Type:** Vec

**Value:** [`TriggerId`](#triggerid)

## `Vec<TwitterBindingRecord>` {#vec-twitterbindingrecord}

**Type:** Vec

**Value:** [`TwitterBindingRecord`](#twitterbindingrecord)

## `Vec<TxGossipStatus>` {#vec-txgossipstatus}

**Type:** Vec

**Value:** [`TxGossipStatus`](#txgossipstatus)

## `Vec<ValidatorPower>` {#vec-validatorpower}

**Type:** Vec

**Value:** [`ValidatorPower`](#validatorpower)

## `Vec<Vec<u8>>` {#vec-vec-u8}

**Type:** Vec

**Value:** [`Vec<u8>`](#vec-u8)

## `Vec<u32>` {#vec-u32}

**Type:** Vec

**Value:** `u32`

## `Vec<u64>` {#vec-u64}

**Type:** Vec

**Value:** `u64`

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

## `VerifiedLaneRelayRecord` {#verifiedlanerelayrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `relay_ref` | [`LaneRelayEnvelopeRef`](#lanerelayenveloperef) |
  | `relay_envelope` | [`LaneRelayEnvelope`](#lanerelayenvelope) |
  | `proof_payload_hash` | [`Hash`](#hash) |
  | `fastpq_statement_digest` | [`Array<u8, 32>`](#array-u8-32) |
  | `lane_finality_statement_hash` | [`Hash`](#hash) |
  | `fastpq_old_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `fastpq_new_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `fastpq_tx_set_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `fastpq_proof_digest` | [`Hash`](#hash) |
  | `verified_at_height` | `u64` |
  | `manifest_root` | [`Array<u8, 32>`](#array-u8-32) |
  | `fastpq_binding` | [`AxtFastpqBinding`](#axtfastpqbinding) |

## `VerifyingKeyBox` {#verifyingkeybox}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `backend` | `String` |
  | `bytes` | [`Vec<u8>`](#vec-u8) |

## `VerifyingKeyEvent` {#verifyingkeyevent}

**Type:** Enum

**Variants:**

  | Variant name | Variant value | Discriminant |
  | --: | :-- | --- |
  | `Registered` | [`VerifyingKeyRegistered`](#verifyingkeyregistered) | 0 |
  | `Updated` | [`VerifyingKeyUpdated`](#verifyingkeyupdated) | 1 |

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

## `VerifyingKeyRecord` {#verifyingkeyrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `version` | `u32` |
  | `circuit_id` | `String` |
  | `owner_manifest_id` | [`Option<String>`](#option-string) |
  | `namespace` | `String` |
  | `backend` | [`BackendTag`](#backendtag) |
  | `curve` | `String` |
  | `public_inputs_schema_hash` | [`Array<u8, 32>`](#array-u8-32) |
  | `commitment` | [`Array<u8, 32>`](#array-u8-32) |
  | `vk_len` | `u32` |
  | `max_proof_bytes` | `u32` |
  | `gas_schedule_id` | [`Option<String>`](#option-string) |
  | `metadata_uri_cid` | [`Option<String>`](#option-string) |
  | `vk_bytes_cid` | [`Option<String>`](#option-string) |
  | `activation_height` | [`Option<u64>`](#option-u64) |
  | `withdraw_height` | [`Option<u64>`](#option-u64) |
  | `key` | [`Option<VerifyingKeyBox>`](#option-verifyingkeybox) |
  | `status` | [`ConfidentialStatus`](#confidentialstatus) |

## `VerifyingKeyRegistered` {#verifyingkeyregistered}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`VerifyingKeyId`](#verifyingkeyid) |
  | `record` | [`VerifyingKeyRecord`](#verifyingkeyrecord) |

## `VerifyingKeyUpdated` {#verifyingkeyupdated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `id` | [`VerifyingKeyId`](#verifyingkeyid) |
  | `record` | [`VerifyingKeyRecord`](#verifyingkeyrecord) |

## `ViralCampaignBudget` {#viralcampaignbudget}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `spent` | [`Quantity`](#quantity) |

## `ViralEscrowCancelled` {#viralescrowcancelled}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`ViralEscrowRecord`](#viralescrowrecord) |
  | `cancelled_at_ms` | `u64` |

## `ViralEscrowCreated` {#viralescrowcreated}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`ViralEscrowRecord`](#viralescrowrecord) |

## `ViralEscrowRecord` {#viralescrowrecord}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `binding_hash` | [`KeyedHash`](#keyedhash) |
  | `sender` | [`AccountId`](#accountid) |
  | `amount` | [`Quantity`](#quantity) |
  | `created_at_ms` | `u64` |

## `ViralEscrowReleased` {#viralescrowreleased}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `escrow` | [`ViralEscrowRecord`](#viralescrowrecord) |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `account` | [`AccountId`](#accountid) |
  | `bonus_paid` | `bool` |
  | `released_at_ms` | `u64` |

## `ViralRewardApplied` {#viralrewardapplied}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `uaid` | [`UniversalAccountId`](#universalaccountid) |
  | `account` | [`AccountId`](#accountid) |
  | `binding_hash` | [`KeyedHash`](#keyedhash) |
  | `amount` | [`Quantity`](#quantity) |
  | `budget` | [`ViralRewardBudget`](#viralrewardbudget) |
  | `campaign` | [`Option<ViralCampaignBudget>`](#option-viralcampaignbudget) |
  | `campaign_cap` | [`Quantity`](#quantity) |
  | `promo_active` | `bool` |
  | `halted` | `bool` |
  | `recorded_at_ms` | `u64` |

## `ViralRewardBudget` {#viralrewardbudget}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `day` | `u64` |
  | `spent` | [`Quantity`](#quantity) |

## `Vote` {#vote}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `round` | [`ConsensusRound`](#consensusround) |
  | `proposal_round` | [`ConsensusRound`](#consensusround) |
  | `phase` | [`SumeragiV2GlobalPhase`](#sumeragiv2globalphase) |
  | `subject` | [`BlockSubject`](#blocksubject) |
  | `execution_commitment` | [`ExecutionCommitment`](#executioncommitment) |
  | `signer` | `u32` |
  | `signature` | [`Vec<u8>`](#vec-u8) |

## `WitnessEventFilter` {#witnesseventfilter}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `block_hash` | [`Option<HashOf<BlockHeader>>`](#option-hashof-blockheader) |
  | `height` | [`Option<NonZero<u64>>`](#option-nonzero-u64) |
  | `view` | [`Option<u64>`](#option-u64) |

## `XorQuantity` {#xorquantity}

**Type:** Struct

**Declarations:**

  | Field name | Field value |
  | --: | :-- |
  | `value` | [`Quantity`](#quantity) |

## `bool` {#bool}

**Type:** Alias

**To:** `bool`

## `i128` {#i128}

**Type:** Int

**Kind:** FixedWidth

## `i32` {#i32}

**Type:** Int

**Kind:** FixedWidth

## `i64` {#i64}

**Type:** Int

**Kind:** FixedWidth

## `u128` {#u128}

**Type:** Int

**Kind:** FixedWidth

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
