Act as a senior technical translator and security reviewer. Translate the two English Markdown sections below into Amharic (am), Bashkir (ba), Dzongkha (dz), and Armenian (hy). Return complete replacement Markdown for all eight sections, grouped by locale and route. Preserve every inline code identifier exactly, preserve the explicit anchors {#data-trigger-scope-and-capacity} and {#moderation-challenges}, preserve Western numerals and punctuation in 64, 4,096, 256, 150, 24, 25%, and do not omit or weaken any negation or invariant. Use natural technical language, but semantic fidelity is more important than stylistic elegance. Especially preserve: every enumerated entity kind; only Parliament may grant; grant is direct to the exact account, not role-inherited, revocable; CanRegisterTrigger is still required; all gas-charged items; atomic rollback of both trigger effects and originating transaction; exact bond; all duplicate types; separate deadlines and exactly 24 hours; accepted/rejected/unresolved outcomes; 25% rounded down; permissionless idempotent expiry; finalization backstop; atomic settlement; and first-release fail-fast with no inference from legacy state.

ENGLISH TRIGGERS:
### Data-trigger scope and capacity

An ordinary data trigger must bind its filter to one exact subject owned by its
trigger authority. Account filters must name that exact account. Asset, asset
definition, domain, NFT, RWA, and trigger filters must likewise name an exact
entity owned by the authority. `Any`, an unbound matcher, a foreign subject, and
system or governance event families are not ordinary account-scoped triggers.

Only Parliament can grant `CanRegisterGlobalDataTrigger`. The grant is stored
directly on one exact account, names that same exact trigger authority, and can
be revoked through the same Parliament lifecycle. It is not inherited through
a role and does not waive `CanRegisterTrigger` when one account registers a
trigger for another authority.

Consensus admits at most 64 data triggers for one authority and 4,096 data
triggers globally. Exact subject and event-family indexes select candidates in
canonical identifier order. One originating transaction can cause at most 256
data-trigger firings, including cascades. Every indexed filter check, firing,
native instruction, and VM instruction consumes the same block gas budget.

Trigger execution is atomic with the transaction that emitted the matching
event. If an authorized trigger fails, exceeds its firing or execution-depth
bound, or exhausts gas, Iroha rolls back both the trigger effects and the
originating transaction.

ENGLISH MODERATION:
### Moderation challenges

SoraFS moderation challenge economics are consensus state. The active policy
names the governance voting asset and the governance accounts used for escrow
and slashing. Every challenge requires exactly 150 units of that
asset; raising it atomically moves the bond into escrow. A case rejects a
duplicate challenge identifier, a second challenge by the same account, or a
reused evidence digest without changing balances or challenge counters.

The challenge-submission deadline and challenge-resolution deadline are
distinct. Governance receives exactly 24 hours after submissions close to
accept or reject a pending challenge. Pending challenges block ballot reveals
only through that resolution deadline:

- an accepted challenge stops the case and refunds the complete bond;
- a rejected challenge lets the case continue, sends 25% of the bond to the
  slash receiver (rounded down at the voting asset's precision), and refunds
  the remainder; and
- an unresolved challenge expires after the grace window, fails open, and
  refunds the complete bond.

`ExpireSorafsModerationChallenge` is permissionless and idempotent for a
challenge that has already expired. Case finalization performs the same expiry
settlement as a backstop, so an absent keeper cannot leave funds locked or keep
reveals blocked. Each settlement is atomic: if any refund or slash leg fails,
the complete settlement rolls back.

The moderation policy and case records use the first-release schema directly.
Nodes reject pre-cut persisted layouts during genesis/state initialization or
snapshot restoration; regenerate those fixtures instead of inferring the
voting asset, custody accounts, deadlines, or economics from legacy state.