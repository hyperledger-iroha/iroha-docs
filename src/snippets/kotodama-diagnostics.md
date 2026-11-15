## Lex {#lex}

### `E_BIDI_CONTROL_CHARACTER` {#e-bidi-control-character}

the source contains an invisible bidirectional control character

**Fix:** Delete the character; inside a string literal that genuinely needs it, write it as a `\u{...}` escape. Bidirectional controls make reviewed text read differently from what compiles.

Rejected:

```kotodama
// owner check <U+202E> disabled
```

Accepted:

```kotodama
// owner check disabled
```

### `E_CONFUSABLE_KEYWORD` {#e-confusable-keyword}

a Japanese word resembles a branded keyword but is not one

**Fix:** Write the keyword exactly: 誓約/seiyaku, 言挙げ/kotoage, 始まり/hajimari or 改善/kaizen. Both spellings of each keyword are the same token and may be mixed freely.

Rejected:

```kotodama
契約 Counter {
}
```

Accepted:

```kotodama
誓約 Counter {
}
```

### `E_DECIMAL_EXPONENT` {#e-decimal-exponent}

an exact decimal exponent has invalid spelling

**Fix:** Write at least one base-10 digit after `e` or `E`; a leading exponent sign is allowed.

### `E_DECIMAL_MALFORMED` {#e-decimal-malformed}

an exact decimal literal has invalid spelling

**Fix:** Use base-10 digits, at most one decimal point, an optional decimal exponent, and underscores only between digits.

### `E_FULLWIDTH_ASCII` {#e-fullwidth-ascii}

a full-width form of an ASCII character appears outside a string or comment

**Fix:** Replace it with the ASCII character; switch the input method to half-width (direct input) for code. The ideographic space U+3000 is accepted between tokens.

Rejected:

```kotodama
始まり（） {
}
```

Accepted:

```kotodama
始まり() {
}
```

### `E_KEYWORD_SPACING` {#e-keyword-spacing}

a kanji keyword is joined to the following word without a space

**Fix:** Insert a space after the keyword, for example `言挙げ fn`.

Rejected:

```kotodama
言挙げfn bump() authorize(anyone) {
}
```

Accepted:

```kotodama
言挙げ fn bump() authorize(anyone) {
}
```

### `E_NON_ASCII_WHITESPACE` {#e-non-ascii-whitespace}

a Unicode space other than U+3000 separates tokens

**Fix:** Replace it with an ASCII space; tokens are separated by ASCII whitespace or the ideographic space U+3000.

Rejected:

```kotodama
state<U+00A0>int total;
```

Accepted:

```kotodama
state int total;
```

### `E_RETIRED_NUMERIC_SUFFIX` {#e-retired-numeric-suffix}

a numeric literal uses a retired suffix

**Fix:** Use an unsuffixed literal in an explicit int, decimal, or quantity context; Kotodama V1 has no numeric literal suffixes.

### `E_UNICODE_LINE_SEPARATOR` {#e-unicode-line-separator}

the source contains U+2028, U+2029 or U+0085

**Fix:** Delete the character or use a normal line break; inside a string literal, write it as a `\u{...}` escape. These characters end a line in many viewers but not in Kotodama.

Rejected:

```kotodama
total = 0; // reset<U+2028>total = 1;
```

Accepted:

```kotodama
total = 0; // reset
total = 1;
```

### `E_UNSUPPORTED_OPERATOR` {#e-unsupported-operator}

`&`, `|`, `++` or a closure is used; Kotodama has no such operator

**Fix:** Boolean AND and OR are `&&` and `||`; increment with `+= 1`. Kotodama has no references, bitwise operators or closures; call a named `fn` instead of a closure.

Rejected:

```kotodama
count++;
```

Accepted:

```kotodama
count += 1;
```

### `K0000` {#k0000}

the requested source could not be read

**Fix:** Check that the path exists, is a regular readable file, and contains valid UTF-8.

### `K0001` {#k0001}

source exceeds the 1 MiB V1 limit

**Fix:** Split the source into typed modules and compile one deployable seiyaku per file.

### `K0002` {#k0002}

source exceeds the 250,000-token V1 limit

**Fix:** Reduce generated source or move reusable declarations into typed modules.

### `K0100` {#k0100}

the source contains an invalid token or character

**Fix:** Remove or replace the highlighted text; the message names what the lexer found.

## Parse {#parse}

### `E_AUTHORIZATION_STRING` {#e-authorization-string}

authorization was written as an arbitrary string

**Fix:** Declare `permission Admin;` and use `authorize(Admin)`, or explicitly choose `authorize(anyone)`.

### `E_AUTHORIZE_POSITION` {#e-authorize-position}

an authorization clause follows the return type

**Fix:** Write authorization before the return type: `kotoage fn name(params) authorize(Admin) -> Type { ... }`.

Rejected:

```kotodama
kotoage fn bump(int delta) -> int authorize(anyone) {
    return delta;
}
```

Accepted:

```kotodama
kotoage fn bump(int delta) authorize(anyone) -> int {
    return delta;
}
```

### `E_DECLARATION_SHAPE` {#e-declaration-shape}

a function, kotoage, view or lifecycle hook declaration has the wrong shape

**Fix:** Public functions are `kotoage fn name(...)` (also `言挙げ fn`) or `view fn name(...)`; the lifecycle hooks are written `hajimari() { ... }` and `kaizen() { ... }` with no `fn` and no name.

Rejected:

```kotodama
fn hajimari() {
    total = 0;
}
```

Accepted:

```kotodama
hajimari() {
    total = 0;
}
```

### `E_DUPLICATE_NAMED_ARGUMENT` {#e-duplicate-named-argument}

a named call argument is repeated

**Fix:** Supply each declared parameter exactly once.

### `E_DUPLICATE_STRUCT_FIELD` {#e-duplicate-struct-field}

a struct literal field is repeated

**Fix:** Supply each declared struct field exactly once.

### `E_DUPLICATE_STRUCT_PATTERN_FIELD` {#e-duplicate-struct-pattern-field}

a struct pattern names the same field more than once

**Fix:** Bind each struct field once; aliases must also use distinct local names.

### `E_ENGLISH_DECLARATION_WORD` {#e-english-declaration-word}

an English concept word is written where a branded keyword declares the concept

**Fix:** Use the branded keyword in either spelling: a deployable unit is `seiyaku`/`誓約`, an authorized state-changing function `kotoage fn`/`言挙げ fn`, the activation hook `hajimari`/`始まり` and the in-place replacement hook `kaizen`/`改善`.

Rejected:

```kotodama
contract Counter {
    init() {
    }
}
```

Accepted:

```kotodama
seiyaku Counter {
    hajimari() {
    }
}
```

### `E_ENUM_MESSAGE` {#e-enum-message}

ordinary enum variants cannot declare rejection messages

**Fix:** Use explicit named codes in an ordinary enum; use error enum only for raisable failures.

### `E_EVENT_PAYLOAD` {#e-event-payload}

emit requires a declared native event record

**Fix:** Write `emit Event { field: value };` with every declared field exactly once.

### `E_FORBIDDEN_SOURCE_IDENTIFIER` {#e-forbidden-source-identifier}

source uses an identifier spelling forbidden in every Kotodama V1 context

**Fix:** Choose a domain-specific identifier; lowercase `amount` remains an ordinary business identifier.

### `E_INT_LITERAL_OVERFLOW` {#e-int-literal-overflow}

an integer literal is outside the signed 512-bit domain

**Fix:** Use a value from -2^511 through 2^511 - 1.

### `E_KEYWORD_TYPO` {#e-keyword-typo}

an identifier is a near-miss spelling of a keyword

**Fix:** Correct the spelling; the suggestion is the closest keyword, and branded keywords are offered in both spellings.

Rejected:

```kotodama
kaizan() {
}
```

Accepted:

```kotodama
kaizen() {
}
```

### `E_KOTOAGE_AUTHORIZATION_MISSING` {#e-kotoage-authorization-missing}

a kotoage function does not name the permission its caller needs

**Fix:** Choose a declared permission with `authorize(Admin)` or explicitly allow every caller with `authorize(anyone)` before the return type.

Rejected:

```kotodama
kotoage fn bump() {
    total += 1;
}
```

Accepted:

```kotodama
kotoage fn bump() authorize(anyone) {
    total += 1;
}
```

### `E_LEGACY_JSON_GETTER` {#e-legacy-json-getter}

source uses a retired name for the quantity JSON getter

**Fix:** Use value.get\_quantity(key); typed JSON getters are receiver methods that return Option&lt;T&gt;.

### `E_LEGACY_SUM_CONSTRUCTOR` {#e-legacy-sum-constructor}

an Option or Result constructor or pattern is not spelled canonically

**Fix:** Use Option::some(value), contextual Option::none, Result::ok(value), or Result::err(value) in expressions and match patterns.

Rejected:

```kotodama
return Some(total);
```

Accepted:

```kotodama
return Option::some(total);
```

### `E_LET_MUT` {#e-let-mut}

a mutable local is written `let mut`

**Fix:** Declare mutable locals with `var`; `let` bindings are immutable.

Rejected:

```kotodama
let mut count = 0;
```

Accepted:

```kotodama
var count = 0;
```

### `E_LIFECYCLE_AUTHORIZATION` {#e-lifecycle-authorization}

a hajimari or kaizen declaration declares caller authorization

**Fix:** Remove `authorize(...)`; activation and in-place replacement are authorized by the runtime, not by the hook.

Rejected:

```kotodama
hajimari() authorize("Admin") {
}
```

Accepted:

```kotodama
hajimari() {
}
```

### `E_MATCH_WILDCARD` {#e-match-wildcard}

a match arm uses a `_` wildcard pattern

**Fix:** Name every variant: `Option::some(value)` and `Option::none`, or `Result::ok(value)` and `Result::err(error)`; bind an unused payload as `_`.

Rejected:

```kotodama
match maybe {
    Option::some(v) => v,
    _ => 0,
}
```

Accepted:

```kotodama
match maybe {
    Option::some(v) => v,
    Option::none => 0,
}
```

### `E_MISSING_DECLARATION_TYPE` {#e-missing-declaration-type}

a parameter, state, constant or field declaration names no type

**Fix:** Write the type before the name, for example `fn run(int value)` or `state int count;`.

Rejected:

```kotodama
fn run(value) {
}
```

Accepted:

```kotodama
fn run(int value) {
}
```

### `E_PACKAGE_BUDGET` {#e-package-budget}

a typed-module package graph exceeds a fixed V1 frontend budget

**Fix:** Reduce the package source count or aggregate source bytes before linking.

### `E_PERMISSION_DECLARATION` {#e-permission-declaration}

a permission declaration is invalid or outside a seiyaku

**Fix:** Declare an instance permission with `permission Admin;` or import a chain token explicitly; modules cannot declare permissions and `anyone` cannot be a permission name.

### `E_POSITIONAL_ARGUMENT_ORDER` {#e-positional-argument-order}

a positional argument follows a named argument

**Fix:** Supply the positional prefix first, then named arguments in any order.

### `E_POSITIONAL_PARAMETER_ORDER` {#e-positional-parameter-order}

a positional parameter follows a named parameter

**Fix:** Place every `Type _ name` parameter before the named `Type name` parameters.

### `E_RANGE_SYNTAX` {#e-range-syntax}

a loop uses an `a..b` range operator

**Fix:** Count with `range(N)`, which iterates 0 up to N - 1 with a compile-time bound; offset the index for other starting points.

Rejected:

```kotodama
for i in 0..10 {
}
```

Accepted:

```kotodama
for i in range(10) {
}
```

### `E_RETIRED_DECLARATION_ORDER` {#e-retired-declaration-order}

a typed declaration is written `name: Type` instead of the type-first `Type name`

**Fix:** Place the type before the name, for example `fn add(int lhs)`, `state int value;`, `const int limit = 1;` or `let int count = 0;`.

Rejected:

```kotodama
fn add(amount: int) {
}
```

Accepted:

```kotodama
fn add(int amount) {
}
```

### `E_RETIRED_NUMERIC_HELPER` {#e-retired-numeric-helper}

source calls a retired width-specific or generic numeric helper

**Fix:** Use exact operators, named int/decimal/quantity conversions, or native `json { ... }` construction.

### `E_RETIRED_NUMERIC_TYPE` {#e-retired-numeric-type}

a declaration uses a retired numeric type name

**Fix:** Use `int`, `decimal`, or the nominal non-negative `quantity` type.

### `E_RETIRED_TRIGGER_ALIAS` {#e-retired-trigger-alias}

source calls a non-canonical trigger lifecycle operation

**Fix:** Use ledger::trigger::register or ledger::trigger::unregister; the diagnostic provides an exact replacement.

### `E_STRUCT_PATTERN_REST` {#e-struct-pattern-rest}

a struct pattern places its rest marker before another field

**Fix:** Place one `..` marker at the end to explicitly discard unspecified fields.

### `E_SUM_CONSTRUCTOR_ARITY` {#e-sum-constructor-arity}

an active-only sum constructor has the wrong payload count

**Fix:** Supply exactly one active payload to Option::some, Result::ok, or Result::err.

### `E_SUM_CONSTRUCTOR_FORM` {#e-sum-constructor-form}

an active-only sum constructor has invalid source form

**Fix:** Write Option::none without parentheses and give active constructors exactly one positional payload.

### `E_TRIGGER_SCHEDULE_ARGUMENT` {#e-trigger-schedule-argument}

a schedule argument is positional, mislabelled, or out of order

**Fix:** Write `schedule(start_ms: START, period_ms: PERIOD)` using compile-time integer expressions in milliseconds; the period may be omitted for a one-shot schedule.

### `E_TRIGGER_TARGET_NAMESPACE` {#e-trigger-target-namespace}

a trigger callback names an unauthenticated remote namespace

**Fix:** Use a local kotoage/言挙げ function. A module import does not authenticate a deployed seiyaku interface.

### `E_UNSUPPORTED_LOOP` {#e-unsupported-loop}

a `while`, `loop` or three-clause `for (init; condition; step)` loop is used

**Fix:** Every loop is a `for` loop whose bound the compiler proves: iterate `range(N)` with a compile-time `N` or a bounded collection, and exit early with `break`.

Rejected:

```kotodama
while i < 10 {
    i += 1;
}
```

Accepted:

```kotodama
for i in range(10) {
}
```

### `E_VIEW_AUTHORIZATION_MISSING` {#e-view-authorization-missing}

a public view has no explicit caller policy

**Fix:** Choose a declared permission or `authorize(anyone)` before the return type.

### `K0003` {#k0003}

source exceeds the 256-level nesting limit

**Fix:** Flatten nested expressions, types, or blocks.

### `K0004` {#k0004}

the diagnostic fanout limit was reached

**Fix:** Fix the reported errors, then rerun the compiler to reveal any remaining failures.

### `K1001` {#k1001}

the source does not match the V1 grammar

**Fix:** Compare the highlighted code with the shape the message names; each declaration and statement form is listed in the V1 grammar.

### `K1004` {#k1004}

a source package or test graph exceeds a fixed V1 frontend budget

**Fix:** Reduce the number or aggregate byte size of the source files in the graph.

## Resolve {#resolve}

### `E_AMBIGUOUS_EXPORT` {#e-ambiguous-export}

multiple modules define the same declared package export

**Fix:** Keep exactly one module definition for each exported function.

### `E_CONFLICTING_ENUM_TYPE` {#e-conflicting-enum-type}

linked modules disagree on one ordinary enum identity

**Fix:** Use one exact declaration schema for each locked package, source unit and enum name.

### `E_CONFLICTING_ERROR_TYPE` {#e-conflicting-error-type}

one nominal error identity has conflicting variant schemas

**Fix:** Use the same exact error descriptor for a locked package identity; different schemas require distinct declared identities.

### `E_CONTRACT_IMPORT_INVALID` {#e-contract-import-invalid}

The imported compiled contract failed canonical artifact admission.

**Fix:** Build the contract with the current compiler and supply its complete authenticated .to artifact in the owning source inventory.

### `E_CONTRACT_IMPORT_NOT_FOUND` {#e-contract-import-not-found}

The declared compiled contract is absent from its source owner inventory.

**Fix:** Supply the referenced .to artifact through the owning project inventory and use its exact relative path in import seiyaku.

### `E_DEPENDENCY_MUST_BE_MODULE` {#e-dependency-must-be-module}

a reusable dependency is not a module source unit

**Fix:** Change the dependency to exactly one module declaration; only the package root may be deployable.

### `E_DUPLICATE_DECLARATION` {#e-duplicate-declaration}

a source-unit declaration name was repeated

**Fix:** Rename or remove the repeated declaration; V1 has one unambiguous namespace per source unit.

### `E_DUPLICATE_HIR_ID` {#e-duplicate-hir-id}

linked typed modules reused a compiler-owned HIR identity

**Fix:** Report this compiler defect with the complete source graph; source cannot assign HIR identities.

### `E_DUPLICATE_IMPORT` {#e-duplicate-import}

an import alias is repeated in one scope

**Fix:** Keep one explicit package binding for each import alias.

### `E_DUPLICATE_MESSAGE` {#e-duplicate-message}

linked modules define the same localization message key more than once

**Fix:** Keep one canonical message for each localization key in the linked graph.

### `E_DUPLICATE_MODULE` {#e-duplicate-module}

one package declares the same module name more than once

**Fix:** Give every module in the package a unique canonical name.

### `E_DUPLICATE_PACKAGE` {#e-duplicate-package}

the locked graph contains the same package identity more than once

**Fix:** Keep one canonical record for each package identity in the locked dependency graph.

### `E_DUPLICATE_SOURCE` {#e-duplicate-source}

a package graph contains duplicate normalized logical source paths

**Fix:** Remove the duplicate or give each source a unique normalized logical path.

### `E_DUPLICATE_SOURCE_ID` {#e-duplicate-source-id}

different logical sources received the same compiler-owned source identity

**Fix:** Report this compiler defect with the complete normalized source graph.

### `E_EMPTY_PACKAGE` {#e-empty-package}

a locked package contains no Kotodama modules

**Fix:** Add at least one module source or remove the empty package from the locked graph.

### `E_EMPTY_PACKAGE_GRAPH` {#e-empty-package-graph}

typed linking produced no root or reusable module program

**Fix:** Provide one seiyaku root and every explicitly imported non-empty module package.

### `E_INCLUDE_CYCLE` {#e-include-cycle}

source includes form a cycle

**Fix:** Remove an include edge so every fragment expands through an acyclic include graph.

### `E_INTERNAL_RESOLUTION` {#e-internal-resolution}

typed analysis received inconsistent or incomplete resolved-HIR metadata

**Fix:** Report this compiler defect with the source; resolution must assign stable identities and targets before typed analysis.

### `E_INVALID_IDENTIFIER` {#e-invalid-identifier}

a package, module, alias, or symbol name is not a strict V1 identifier

**Fix:** Use a valid unambiguous Kotodama V1 identifier in the reported graph location.

### `E_INVALID_MODULE_ITEM` {#e-invalid-module-item}

a reusable module contains a deployable-only declaration

**Fix:** Move state, triggers, `kotoage`/`言挙げ`, `view fn`, `hajimari`/`始まり`, or `kaizen`/`改善` declarations into the seiyaku root.

### `E_INVALID_SOURCE_PATH` {#e-invalid-source-path}

a logical module source path is non-canonical or escapes its package

**Fix:** Use a normalized relative logical path contained by the package source root.

### `E_LOCAL_IMPORT_CYCLE` {#e-local-import-cycle}

local module imports form a cycle

**Fix:** Remove an import edge so local modules have an acyclic dependency graph.

### `E_LOCAL_SHADOWING` {#e-local-shadowing}

a local binding duplicates or shadows another visible symbol

**Fix:** Rename the binding so every local and source-unit declaration remains unambiguous.

### `E_MISSING_EXPORT` {#e-missing-export}

a package export names no module function

**Fix:** Define the exported function in exactly one module or remove the stale export.

### `E_MULTIPLE_SEIYAKU_ROOTS` {#e-multiple-seiyaku-roots}

one diagnostics request contains more than one deployable seiyaku root

**Fix:** Keep one project root; check unrelated seiyaku roots in separate requests.

### `E_PACKAGE_IMPORT_CYCLE` {#e-package-import-cycle}

locked package imports form a dependency cycle

**Fix:** Break the cycle and keep the typed-module package graph acyclic.

### `E_PROJECT_MANIFEST` {#e-project-manifest}

a Musubi project manifest is malformed or unsafe

**Fix:** Use Musubi.toml with relative in-project source paths and a matching Musubi.lock.

### `E_PROJECT_MANIFEST_REQUIRED` {#e-project-manifest-required}

positional source paths cannot grant module linking authority

**Fix:** Use musubi check --manifest-path Musubi.toml with declared imports, modules, exports, and packages locked by Musubi.lock.

### `E_PROJECT_RELOAD` {#e-project-reload}

the Musubi project or locked dependency graph could not be reloaded

**Fix:** Fix and save Musubi.toml, then resolve dependency changes with musubi check before continuing project analysis.

### `E_PROJECT_TARGET_AMBIGUOUS` {#e-project-target-ambiguous}

a source module belongs to more than one contract target

**Fix:** Select the intended target with musubi lsp --manifest-path Musubi.toml --contract &lt;target&gt;.

### `E_RESERVED_DECLARATION` {#e-reserved-declaration}

a declaration collided with a reserved language or builtin name

**Fix:** Choose an ASCII identifier that is not a V1 keyword, type, namespace, or builtin.

### `E_RESERVED_IMPORT` {#e-reserved-import}

an import alias collides with a compiler-owned capability namespace

**Fix:** Choose a non-reserved explicit alias for the imported package.

### `E_ROOT_MUST_BE_SEIYAKU` {#e-root-must-be-seiyaku}

the deployable package root is not a seiyaku/誓約 source unit

**Fix:** Declare exactly one seiyaku/誓約 in the root and keep reusable dependencies as modules.

### `E_SOURCE_NOT_FOUND` {#e-source-not-found}

a declared source dependency is absent

**Fix:** Supply the referenced file inside the explicit source bundle and use its canonical relative path.

### `E_SOURCE_OWNERSHIP` {#e-source-ownership}

one fragment is assigned to multiple source units

**Fix:** Give each fragment a single owning contract or module; use exported module declarations for shared dependencies.

### `E_SOURCE_UNIT_KIND` {#e-source-unit-kind}

a source dependency has the wrong unit kind

**Fix:** Use a bare declaration fragment for include, a module for import, and a seiyaku as the contract entry file.

### `E_TEST_TARGET_MISMATCH` {#e-test-target-mismatch}

a standalone test module resolves to a different target source

**Fix:** Correct koto\_test.target so its normalized path names the graph's exact seiyaku target.

### `E_UNEXPORTED_SYMBOL` {#e-unexported-symbol}

a qualified call targets a function absent from the package export table

**Fix:** Export the exact function from one module or call a declared exported symbol.

### `E_UNEXPORTED_TYPE` {#e-unexported-type}

a named type is absent from the explicit package exports

**Fix:** Export the struct or error declaration from its locked package and use the configured import alias.

### `E_UNKNOWN_BUILTIN` {#e-unknown-builtin}

a call through a compiler-owned namespace names no builtin

**Fix:** Use a builtin of that namespace; the diagnostic suggests the closest spelling, including the branded spelling of English concept words such as `entrypoint` (kotoage/言挙げ).

Rejected:

```kotodama
let who = context::caller();
```

Accepted:

```kotodama
let who = context::authority();
```

### `E_UNKNOWN_ENUM_VARIANT` {#e-unknown-enum-variant}

the named variant is absent from the nominal enum

**Fix:** Use a variant declared by this exact enum; variant names are case-sensitive.

### `E_UNKNOWN_IMPORT_ALIAS` {#e-unknown-import-alias}

a qualified call uses an alias not imported by its source package

**Fix:** Add one explicit import binding for the alias or correct the qualified call.

### `E_UNKNOWN_PACKAGE` {#e-unknown-package}

an import names a package absent from the locked graph

**Fix:** Add the exact package identity to the lock graph or correct the import.

### `E_UNKNOWN_PERMISSION` {#e-unknown-permission}

authorization or a grant references an undeclared permission

**Fix:** Use a permission declared by this seiyaku or one of its included files. Chain tokens require an explicit `import permission` declaration.

### `E_WILDCARD_IMPORT` {#e-wildcard-import}

a module graph requests a wildcard import

**Fix:** Replace the wildcard with explicit package aliases and exported function names.

### `K2002` {#k2002}

a name, type, function, or import could not be resolved

**Fix:** Correct the spelling or add an explicit typed-module import/export.

### `K2099` {#k2099}

resolved-HIR construction or integrity validation failed

**Fix:** Report this compiler defect with the source; resolution stopped before typed/effect analysis.

## Semantic {#semantic}

### `E_ACCESS_INCOMPLETE` {#e-access-incomplete}

production access metadata could not be derived

**Fix:** For a literal trigger specification, supply an object with a valid `id` or a base64 JSON string containing a canonical Norito Trigger frame. Supported dynamic access uses conservative metadata; an undecodable literal is rejected in production.

### `E_ASSET_NAME_INVALID` {#e-asset-name-invalid}

an asset display name literal is not a valid asset name

**Fix:** Use a non-blank name of at most 128 characters without `#`, `@`, or control characters.

### `E_BALLOT_ELECTION_ID` {#e-ballot-election-id}

an inline ballot election selector is not canonical

**Fix:** Use 1-128 RFC 3986 unreserved ASCII characters (letters, digits, `-`, `.`, `_`, `~`), with no leading dot.

### `E_BALLOT_LITERAL_REQUIRED` {#e-ballot-literal-required}

the inline ballot builder received a runtime field

**Fix:** Supply compile-time string and byte literals, directly or through literal bindings and private helpers. The inline builder cannot embed fields received as entrypoint parameters.

### `E_BALLOT_NULLIFIER` {#e-ballot-nullifier}

an inline ballot nullifier has the wrong byte length

**Fix:** Supply exactly 32 bytes for the ballot nullifier; byte escapes each encode one byte.

### `E_BRANCH_TYPE_MISMATCH` {#e-branch-type-mismatch}

expression branches have different types

**Fix:** Make every if or match branch tail produce exactly the same type.

### `E_BREAK_OUTSIDE_LOOP` {#e-break-outside-loop}

break appeared outside an accepted bounded loop

**Fix:** Move break into the body of a compiler-proven bounded for loop.

### `E_CONST_CAPACITY_CONTEXT` {#e-const-capacity-context}

a compile-time integer appeared outside a bounded List capacity

**Fix:** Use the compile-time integer only as the second argument of List&lt;T, N&gt;.

### `E_CONST_INITIALIZER` {#e-const-initializer}

a const initializer depended on runtime evaluation

**Fix:** Initialize the const from literals and previously declared constants only.

### `E_CONTINUE_OUTSIDE_LOOP` {#e-continue-outside-loop}

continue appeared outside an accepted bounded loop

**Fix:** Move continue into the body of a compiler-proven bounded for loop.

### `E_CONTRACT_METHOD` {#e-contract-method}

the imported contract reference has no callable public method with this signature

**Fix:** Use the admitted interface method with its declared parameter labels. Lifecycle hooks are unavailable through imported references.

### `E_DECIMAL_MANTISSA_OVERFLOW` {#e-decimal-mantissa-overflow}

an exact decimal value exceeds the signed 512-bit mantissa limit

**Fix:** Reduce the magnitude so the unscaled canonical mantissa fits the signed 512-bit domain.

### `E_DECIMAL_SCALE_OVERFLOW` {#e-decimal-scale-overflow}

an exact decimal value exceeds the 28-digit canonical scale limit

**Fix:** Reduce the significant fractional precision to at most 28 digits. Trailing fractional zeros are canonicalized away before this limit is checked.

### `E_DIVERGING_EXPRESSION_CONTEXT` {#e-diverging-expression-context}

an expression whose branches all diverge lacks an exact result type

**Fix:** Provide an exact contextual type, or use the construct as a statement when every branch returns from the enclosing function.

### `E_DIVISION_BY_ZERO` {#e-division-by-zero}

a numeric divisor is zero

**Fix:** Use a nonzero divisor or validate it before the operation.

### `E_ENUM_SCHEMA` {#e-enum-schema}

the ordinary enum descriptor is not canonical

**Fix:** Declare between 1 and 256 uniquely named variants with distinct nonzero u32 codes.

### `E_ERROR_MESSAGE` {#e-error-message}

an error message violates the static message contract

**Fix:** Use one nonblank static UTF-8 message between 1 and 4096 bytes on each annotated error variant.

### `E_ERROR_SCHEMA` {#e-error-schema}

an error type has an invalid nominal schema

**Fix:** Declare one error enum identity with unique names and nonzero u32 variant codes.

### `E_EVENT_DECLARATION` {#e-event-declaration}

native events belong to their declaring seiyaku

**Fix:** Declare the event and emitting helpers in the seiyaku; modules export reusable value types and pure or explicit ledger helpers.

### `E_EVENT_SCHEMA` {#e-event-schema}

the native event payload or declaration inventory is invalid

**Fix:** Use canonical public value fields, excluding Json, StateCursor and private values recursively; declare at most 256 events within 65536 encoded bytes.

### `E_EVENT_VALUE` {#e-event-value}

an event declaration is not an ordinary value type

**Fix:** Use `emit Event { field: value };`; declare a struct for reusable values and use it as an event field.

### `E_EXACT_DIVISION_SCALE_OVERFLOW` {#e-exact-division-scale-overflow}

an exact terminating quotient needs more than 28 fractional digits

**Fix:** Use `div_round` with an explicit representable scale, or change the operands.

### `E_FOR_INITIALIZER` {#e-for-initializer}

a bounded for-loop initializer lowered to more than one operation

**Fix:** Use one simple let binding or expression as the for-loop initializer.

### `E_FOR_STEP` {#e-for-step}

a bounded for-loop step lowered to more than one operation

**Fix:** Use one simple let binding or expression as the for-loop step.

### `E_IF_EXPRESSION_ELSE` {#e-if-expression-else}

an expression-valued if omits its else branch

**Fix:** Add an else block whose tail has exactly the same type as the then block tail.

### `E_IF_LET_EXPRESSION_ELSE` {#e-if-let-expression-else}

an expression-valued if let omits its else branch

**Fix:** Add an else block, or use if let as a statement when no value is needed.

### `E_IMMUTABLE_ASSIGNMENT` {#e-immutable-assignment}

an immutable binding was assigned after declaration

**Fix:** Declare a mutable local with `var`, or compute the final immutable value before binding it.

### `E_IMPLICIT_NUMERIC_CONVERSION` {#e-implicit-numeric-conversion}

runtime int and decimal values were mixed without a named conversion

**Fix:** Convert the int with decimal::from\_int(value) before decimal arithmetic or comparison. Exact numeric literals may still infer their type contextually at compile time.

### `E_INEXACT_CONVERSION` {#e-inexact-conversion}

an exact numeric conversion would discard a fractional part

**Fix:** Use an explicitly truncating or rounded conversion when loss of precision is intentional.

### `E_INTERNAL_BUILTIN` {#e-internal-builtin}

source attempted to call a compiler-internal raw capability

**Fix:** Use the typed namespaced source API; allocation, pointers, raw syscalls, and opaque instructions are unavailable.

### `E_INTERNAL_NUMERIC_MATRIX` {#e-internal-numeric-matrix}

typed numeric operands violated the compiler's canonical operator matrix

**Fix:** Report this compiler defect with a minimal source reproducer; no artifact is emitted from inconsistent typed HIR.

### `E_INTRINSIC_CONTEXT` {#e-intrinsic-context}

a compiler intrinsic was used outside its declared operation context

**Fix:** Use the public namespaced operation that owns the intrinsic instead of referring to the compiler-owned value.

### `E_INT_OVERFLOW` {#e-int-overflow}

checked integer arithmetic overflowed

**Fix:** Change the inputs or use an explicit wrapping operation when modular arithmetic is intentional.

### `E_INVALID_ASSIGNMENT_TARGET` {#e-invalid-assignment-target}

an assignment targeted a non-assignable expression

**Fix:** Assign only to a `var` binding, a field of one, or `map[key] = value`. To change a StateMap entry, copy it with `var entry = Map.get(key).expect(Error::Missing);`, change `entry`, and store it back with `Map[key] = entry;`.

Rejected:

```kotodama
Positions[who].x = 3;
```

Accepted:

```kotodama
var position = Positions.get(who).expect(E::Missing);
position.x = 3;
Positions[who] = position;
```

### `E_INVALID_ID_LITERAL` {#e-invalid-id-literal}

a typed identifier literal is malformed or encoded for another network

**Fix:** Copy the identifier exactly as printed, or re-encode an account for this network with `iroha tools address convert`. Canonical account literals write katakana half-width, except ヰ and ヱ.

Rejected:

```kotodama
let ds = DataSpaceId::parse("zero");
```

Accepted:

```kotodama
let ds = DataSpaceId::parse("0");
```

### `E_INVALID_POINTER_LITERAL` {#e-invalid-pointer-literal}

an encoded pointer literal is malformed or internally inconsistent

**Fix:** Use the canonical Norito frame for the requested pointer type, encoded as an even-length `0x` hexadecimal string. AXT descriptors must contain valid data space/touch declarations; anchored spends must preserve their signed-payload bindings. Runtime authorization is still required.

### `E_INVALID_SCALE` {#e-invalid-scale}

an exact numeric operation received a scale outside zero through 28

**Fix:** Choose an int scale from 0 through 28.

### `E_ITERATION_LIMIT` {#e-iteration-limit}

a bounded collection operation exceeded the 64-item V1 limit

**Fix:** Reduce the collection or split the operation into deterministic calls of at most 64 items.

### `E_JSON_CAPACITY` {#e-json-capacity}

a native JSON object or array exceeds the per-node V1 bound

**Fix:** Use at most 64 object entries or array elements at each JSON node; split larger data into bounded nested nodes.

### `E_JSON_DUPLICATE_KEY` {#e-json-duplicate-key}

a native JSON object repeats a decoded key

**Fix:** Keep each decoded key exactly once; identifier and quoted spellings of the same key still collide.

### `E_JSON_LITERAL_INVALID` {#e-json-literal-invalid}

a Json::parse string literal is not valid JSON

**Fix:** Provide one valid JSON value and keep every decoded object key unique.

### `E_JSON_LITERAL_REQUIRED` {#e-json-literal-required}

Json::parse requires a direct string literal

**Fix:** Use a direct JSON string literal so it is validated at compile time, or construct dynamic typed values with native `json { ... }` and `json [ ... ]` syntax.

### `E_JSON_SCHEMA_LIMIT` {#e-json-schema-limit}

a native JSON construction exceeds a recursive V1 ABI bound

**Fix:** Reduce recursive object, array, Option, or List structure so the canonical construction schema fits its node, word, depth, and encoded-byte limits.

### `E_JSON_VALUE_TYPE` {#e-json-value-type}

a value cannot be converted by native JSON construction

**Fix:** Handle Result and arbitrary structs explicitly, and keep StateMap, Secret, and other resource handles outside JSON.

### `E_LIST_CAPACITY` {#e-list-capacity}

a List capacity is outside 1 through 64

**Fix:** Choose a compile-time capacity from 1 through 64.

### `E_LIST_CAPACITY_CONST` {#e-list-capacity-const}

a List capacity is not a compile-time integer

**Fix:** Use an integer capacity constant from 1 through 64.

### `E_LIST_COMPREHENSION_CAPACITY` {#e-list-comprehension-capacity}

a list comprehension may exceed its contextual or V1 capacity

**Fix:** Reduce the source capacity or use a context large enough for the full proven maximum, up to 64.

### `E_LIST_COMPREHENSION_FILTER` {#e-list-comprehension-filter}

a list comprehension filter is not boolean

**Fix:** Use a bool expression after if; filters do not reduce the proven capacity.

### `E_LIST_COMPREHENSION_SOURCE` {#e-list-comprehension-source}

a list comprehension source is not a bounded List

**Fix:** Iterate a List&lt;T, N&gt; so the compiler can prove the maximum result size.

### `E_LIST_CONTAINS_COMPARABILITY` {#e-list-contains-comparability}

List.contains requires canonically comparable elements

**Fix:** Use an element type with deterministic structural equality; resource handles and other non-comparable values cannot be searched with contains.

### `E_LIST_CONTEXT_TYPE` {#e-list-context-type}

a list expression conflicts with its contextual type

**Fix:** Use a matching List&lt;T, N&gt; context and exactly assignable element values.

### `E_LIST_EMPTY_CONTEXT` {#e-list-empty-context}

an empty list literal has no element or capacity context

**Fix:** Add a List&lt;T, N&gt; annotation to the binding, argument, or return position.

### `E_LIST_INDEX_TYPE` {#e-list-index-type}

a List index has the wrong type

**Fix:** Use an int index with get or try\_set.

### `E_LIST_LITERAL_CAPACITY` {#e-list-literal-capacity}

a list literal exceeds its contextual capacity

**Fix:** Increase the declared capacity up to 64 or reduce the literal element count.

### `E_LIST_METHOD_ARITY` {#e-list-method-arity}

a bounded List method has the wrong argument count

**Fix:** Use the declared method signature and account for the implicit receiver.

### `E_LIST_MUTABLE_RECEIVER` {#e-list-mutable-receiver}

a mutating List method was called on a non-mutable receiver

**Fix:** Bind the List with var before calling try\_set, try\_push, or pop.

### `E_LIST_PROVABLY_FULL` {#e-list-provably-full}

push follows initialization of a provably full List

**Fix:** Declare an explicit larger capacity at initialization, remove an element first, or handle the Result from try\_push. Unknown lengths and escaped aliases retain their runtime bounds checks.

### `E_LIST_RESOURCE_ELEMENT` {#e-list-resource-element}

a List element contains a resource handle

**Fix:** Keep StateMap, Secret, and other resource handles outside List elements.

### `E_LIST_TAKE_CONST` {#e-list-take-const}

List.take received a dynamic limit

**Fix:** Pass a compile-time integer limit so the result capacity remains proven.

### `E_LIST_TAKE_LIMIT` {#e-list-take-limit}

List.take received a limit outside its source capacity

**Fix:** Use a constant limit from 0 through the source List capacity.

### `E_LIST_TYPE_ARITY` {#e-list-type-arity}

List has an invalid number of type arguments

**Fix:** Declare List&lt;T, N&gt; with one element type and one capacity constant.

### `E_LIST_UNSAFE_INDEX` {#e-list-unsafe-index}

source attempted an unchecked List index operation

**Fix:** Use get(index) for reads and try\_set(index, value) for writes.

### `E_MALFORMED_CALL` {#e-malformed-call}

resolved call metadata was internally inconsistent

**Fix:** Report this compiler defect with a minimal source reproducer; malformed resolved calls never produce artifacts.

### `E_MATCH_DUPLICATE_PATTERN` {#e-match-duplicate-pattern}

a match expression repeats a variant pattern

**Fix:** Keep exactly one arm for each variant in the matched sum family.

### `E_MATCH_EMPTY` {#e-match-empty}

a match expression has no arms

**Fix:** Add the complete namespaced pattern set for the matched Option or Result.

### `E_MATCH_NON_EXHAUSTIVE` {#e-match-non-exhaustive}

a sum match omits an active or inactive variant

**Fix:** Cover both Option variants or both Result variants explicitly.

### `E_MISSING_NAMED_ARGUMENT` {#e-missing-named-argument}

a named call omits a required parameter

**Fix:** Supply every required argument, positionally where the call accepts it or as `label: value`.

### `E_MISSING_RETURN` {#e-missing-return}

a value-returning function does not return on every path

**Fix:** Return the declared type on every reachable path or use one final block-tail expression.

### `E_MISSING_STRUCT_FIELD` {#e-missing-struct-field}

a struct literal omits a declared field

**Fix:** Supply every declared field; field order in source is unrestricted.

### `E_MISSING_STRUCT_PATTERN_FIELD` {#e-missing-struct-pattern-field}

a struct pattern does not account for every field

**Fix:** Bind or explicitly discard each field, or add a final `..` marker.

### `E_NAMED_ARGUMENTS_REQUIRED` {#e-named-arguments-required}

a named parameter was supplied positionally

**Fix:** This builtin takes labelled arguments: write each one as `label: value`, or pass a variable spelled exactly like the label. Single-argument calls, receiver methods, and pure helpers accept positional arguments.

### `E_NAMED_ARGUMENT_HOLE` {#e-named-argument-hole}

a named call supplies a later optional parameter after omitting an earlier optional ABI slot

**Fix:** Supply the earlier optional parameter too, or omit the complete trailing optional suffix.

### `E_NEGATIVE_QUANTITY` {#e-negative-quantity}

a value converted to quantity is negative

**Fix:** Use decimal when the value may be negative, or prove the value non-negative before an explicit quantity conversion.

### `E_NEGATIVE_SQUARE_ROOT` {#e-negative-square-root}

integer square root requires a nonnegative operand

**Fix:** Pass a nonnegative int to math::isqrt; negative inputs fault instead of narrowing or changing sign.

### `E_NOMINAL_ARGUMENT` {#e-nominal-argument}

a NumericSpec, Mintable, or SignatureScheme argument is not a compile-time value

**Fix:** Write the value directly as the argument: `NumericSpec::unconstrained()`, `NumericSpec::integer()`, or `NumericSpec::fractional(scale)`; `Mintable::Infinitely`, `Mintable::Once`, `Mintable::Not`, or `Mintable::Limited(tokens)`; `SignatureScheme::Ed25519`, `SignatureScheme::Secp256k1`, or `SignatureScheme::MlDsa`.

### `E_NON_CANONICAL_BUILTIN` {#e-non-canonical-builtin}

source used a retired, flat, or compiler-internal builtin spelling

**Fix:** Use the canonical V1 namespaced builtin shown by the diagnostic.

### `E_NON_CANONICAL_NUMERIC` {#e-non-canonical-numeric}

a numeric value was not in canonical int, decimal, or quantity form

**Fix:** Construct the value with the exact canonical numeric type and representation.

### `E_NUMERIC_ROUNDING_MODE` {#e-numeric-rounding-mode}

an explicitly rounded numeric operation received an unknown rounding mode

**Fix:** Use one of the seven V1 modes: toward\_zero, away\_from\_zero, floor, ceil, nearest\_even, nearest\_away, or nearest\_toward\_zero.

### `E_NUMERIC_ROUND_ARITY` {#e-numeric-round-arity}

an explicitly rounded numeric operation has the wrong number of arguments

**Fix:** Pass every declared argument, positionally or by its declared label; rounded division requires divisor, scale, and mode.

### `E_NUMERIC_ROUND_RECEIVER` {#e-numeric-round-receiver}

an explicitly rounded numeric method was called on an unsupported receiver

**Fix:** Use decimal.div\_round, quantity.div\_round, or quantity.ratio\_round with the operand types declared by the V1 numeric matrix.

### `E_PATTERN_FAMILY` {#e-pattern-family}

a namespaced pattern belongs to the wrong sum family

**Fix:** Match Option values with Option::some/none and Result values with Result::ok/err.

### `E_PATTERN_PAYLOAD` {#e-pattern-payload}

a sum pattern binds a payload on an inactive variant or omits an active payload binding

**Fix:** Bind or explicitly ignore active payloads; write Option::none without a payload.

### `E_PATTERN_TYPE` {#e-pattern-type}

a sum pattern was applied to a non-Option/non-Result value

**Fix:** Use namespaced sum patterns only with Option&lt;T&gt; or Result&lt;T, E&gt;.

### `E_PATTERN_VARIANT` {#e-pattern-variant}

the pattern variant does not belong to the expected type

**Fix:** Match a variant from the exact nominal enum or sum type of the scrutinee.

### `E_PERMISSION_ARGUMENT` {#e-permission-argument}

a grant or revocation did not name an instance permission declaration

**Fix:** Pass a declared instance permission identifier as `permission:`. Chain imports, strings and dynamic Name values cannot be used for scoped grants.

### `E_POINTER_LITERAL_REQUIRED` {#e-pointer-literal-required}

a pointer constructor received runtime text instead of a compile-time literal

**Fix:** Use a compile-time string literal or accept the canonical typed identifier directly as the entrypoint parameter. Local literal bindings and private helpers with literal arguments remain supported.

### `E_POSITIONAL_ARGUMENT_REQUIRED` {#e-positional-argument-required}

a positional-only parameter was supplied by name

**Fix:** Omit the label for parameters declared as `Type _ name`.

### `E_POSITIONAL_STRUCT` {#e-positional-struct}

a struct uses retired positional construction

**Fix:** Use `Type { field: value, shorthand_field }`; apply the diagnostic fix when one is available.

### `E_POSITIONAL_STRUCT_PATTERN` {#e-positional-struct-pattern}

a struct is destructured by position

**Fix:** Use `let Type { field, other: alias, .. } = value;`; positional patterns are for tuples.

### `E_PROPAGATE_CONTEXT` {#e-propagate-context}

postfix propagation is used outside a matching sum-returning function

**Fix:** Return the same Option or Result family from the enclosing function, or handle the value explicitly.

### `E_PROPAGATE_ERROR_TYPE` {#e-propagate-error-type}

Result propagation would require implicit error conversion

**Fix:** Use the exact enclosing Result error type or convert the error explicitly before propagation.

### `E_PROPAGATE_TYPE` {#e-propagate-type}

postfix propagation was applied to a non-sum value

**Fix:** Apply ? only to Option&lt;T&gt; or Result&lt;T, E&gt;.

### `E_PUBLIC_PARAMETER_IDENTIFIER` {#e-public-parameter-identifier}

a public parameter name cannot be represented in the canonical call schema

**Fix:** Use an ordinary canonical identifier such as permission\_token; keyword spellings are not valid ABI field names.

### `E_QUANTITY_NEGATION` {#e-quantity-negation}

the nominal `quantity` type cannot be negated

**Fix:** Use `int` or `decimal` for signed values.

### `E_QUANTITY_REMAINDER` {#e-quantity-remainder}

quantity does not define a remainder operation

**Fix:** Use exact division, quantity.div\_round, or quantity.ratio\_round with an explicit scale and rounding mode.

### `E_QUANTITY_UNDERFLOW` {#e-quantity-underflow}

quantity subtraction would produce a negative result

**Fix:** Change the operands, or convert to decimal explicitly when a negative result is part of the domain.

### `E_QUERY_KEY_TYPE` {#e-query-key-type}

a typed core query received bytes or the wrong identifier type

**Fix:** Pass the exact AccountId, AssetId, AssetDefinitionId, DomainId, or NftId required by the query.

### `E_QUERY_LIMIT` {#e-query-limit}

a typed query page limit is outside 1 through 64

**Fix:** Choose a page limit from 1 through 64.

### `E_QUERY_OFFSET` {#e-query-offset}

a typed query page window is outside the non-negative signed 64-bit range

**Fix:** Use an offset in 0..=i64::MAX and ensure offset plus limit fits i64.

### `E_QUERY_PAGE_ARGUMENTS` {#e-query-page-arguments}

a typed query page has invalid offset or limit arguments

**Fix:** Pass named offset: int and limit: int arguments.

### `E_QUERY_PAGE_VIEW` {#e-query-page-view}

QueryPage was instantiated with a view outside the declared core query set

**Fix:** Use QueryPage only with a canonical core query view supported by ABI V1.

### `E_QUERY_RESULT_TYPE` {#e-query-result-type}

a typed core-query projection was assigned to an incompatible result type

**Fix:** Receive singular queries as Option&lt;View&gt; and plural queries as QueryPage&lt;View&gt;; raw byte compatibility is not part of the five V1 core-query families.

### `E_QUORUM_RANGE` {#e-quorum-range}

an account quorum is outside the protocol's nonzero 16-bit domain

**Fix:** Use an int from 1 through 65535. This is a protocol-field bound, not the range of Kotodama int.

### `E_REPEATING_DECIMAL` {#e-repeating-decimal}

exact decimal division has a nonterminating result

**Fix:** Choose decimal.div\_round, quantity.div\_round or ratio\_round, or mul\_div\_round for a fused product, with an explicit scale and rounding mode.

### `E_RESULT_MUST_USE` {#e-result-must-use}

a fallible Result value was left unhandled

**Fix:** Handle the Result with match, return, or propagation using ?, or explicitly discard it with let \_ = expression;.

### `E_RETIRED_VRF_VERIFY_ARGS` {#e-retired-vrf-verify-args}

source used the retired multi-argument VRF verification form

**Fix:** Encode one VrfVerifyRequest as bytes and pass it through the named request argument.

### `E_RETURN_TYPE_MISMATCH` {#e-return-type-mismatch}

a returned value does not exactly match the declared return type

**Fix:** Return the exact declared type; use an explicit conversion where the V1 API provides one.

### `E_SECRET_ARITHMETIC` {#e-secret-arithmetic}

secret data was used by an ordinary arithmetic operation

**Fix:** Use only an approved proof or commitment operation whose secret-flow contract is explicit.

### `E_SECRET_CONTROL_FLOW` {#e-secret-control-flow}

a secret value influenced public control flow

**Fix:** Remove the secret-dependent branch or loop.

### `E_SECRET_FULL_WIDTH_CRYPTO_REQUIRED` {#e-secret-full-width-crypto-required}

a scalar-register crypto operation attempted to consume Secret&lt;T&gt;

**Fix:** Use crypto::valcom or another approved full-width proof operation that declares a Secret&lt;T&gt; flow.

### `E_SECRET_HOST_SINK` {#e-secret-host-sink}

secret data reached a public host operation

**Fix:** Pass only approved public proof or commitment outputs to ledger, context, state, and debug APIs.

### `E_SECRET_LOG` {#e-secret-log}

a secret value flowed into a log

**Fix:** Remove the log or log only a public value independent of the secret.

### `E_SECRET_MIXED_COMMITMENT` {#e-secret-mixed-commitment}

a commitment mixed secret data with an unapproved public value

**Fix:** Use the exact approved commitment signature and explicitly public domain-separation inputs.

### `E_SECRET_PAYLOAD_TYPE` {#e-secret-payload-type}

a private input used a type outside the approved Secret&lt;T&gt; payload set

**Fix:** Choose a supported fixed-layout secret payload type accepted by the ZK proof interface.

### `E_SECRET_PRIVATE_INPUT_AMBIGUOUS` {#e-secret-private-input-ambiguous}

a private input had no inferable Secret&lt;T&gt; payload type

**Fix:** Use a type-first binding such as `let Secret<int> value = crypto::private_input(0);`.

### `E_SECRET_PRIVATE_INPUT_CONTEXT` {#e-secret-private-input-context}

a private-input operation did not initialize an approved Secret&lt;T&gt; binding

**Fix:** Initialize an explicit Secret&lt;int&gt;, Secret&lt;decimal&gt;, or Secret&lt;quantity&gt; binding.

### `E_SECRET_PRIVATE_INPUT_INDEX` {#e-secret-private-input-index}

a private-input index depended on secret or unbounded data

**Fix:** Use a public compile-time-bounded private-input index.

### `E_SECRET_PUBLIC_PARAMETER` {#e-secret-public-parameter}

a kotoage/view/hajimari/kaizen parameter was declared as Secret&lt;T&gt;

**Fix:** Read private inputs through the ZK-only private-input API; public ABI records cannot contain secrets.

### `E_SECRET_PUBLIC_RETURN` {#e-secret-public-return}

a secret value flowed into a public return

**Fix:** Return only an approved proof, commitment, or public value independent of the secret.

### `E_SECRET_REQUIRES_ZK` {#e-secret-requires-zk}

Secret&lt;T&gt; was used outside a ZK seiyaku build

**Fix:** Compile through a ZK-enabled project policy and keep the value inside approved proof or commitment operations.

### `E_SECRET_STATE_KEY` {#e-secret-state-key}

a secret value flowed into a durable-state key

**Fix:** Use a public canonical key independent of all private inputs.

### `E_SECRET_STATE_SINK` {#e-secret-state-sink}

secret-tainted data reached durable state

**Fix:** Persist only an approved public commitment or proof result independent of raw secret material.

### `E_SECRET_STATE_TYPE` {#e-secret-state-type}

durable state was declared with a secret-bearing type

**Fix:** Keep Secret&lt;T&gt; ephemeral and store only approved public commitments or proof outputs.

### `E_SECRET_STATE_WRITE` {#e-secret-state-write}

a secret value flowed directly into durable state

**Fix:** Persist only an approved commitment or proof output.

### `E_SECRET_UNAPPROVED_OPERATION` {#e-secret-unapproved-operation}

secret data reached an operation without an approved flow specification

**Fix:** Use an operation explicitly listed by the V1 secret-flow policy.

### `E_SECRET_UNKNOWN_CALL` {#e-secret-unknown-call}

secret data was passed through a call whose flow behavior is unknown

**Fix:** Pass secrets only to compiler-known proof and commitment functions with declared flow behavior.

### `E_STATE_HAJIMARI_INCOMPLETE` {#e-state-hajimari-incomplete}

scalar durable state is not initialized on every normal `hajimari`/`始まり` path

**Fix:** Assign every reported scalar state on all branches and before every early return; loop-only and short-circuited writes are not definite.

### `E_STATE_HAJIMARI_REQUIRED` {#e-state-hajimari-required}

scalar durable state was declared without a hajimari/始まり hook

**Fix:** Declare hajimari/始まり and initialize every scalar state value before any normal return or fallthrough.

### `E_STATE_MAP_ALIAS` {#e-state-map-alias}

a StateMap was treated as an in-memory first-class value

**Fix:** Access the declared StateMap directly through get, set, remove, or bounded iteration.

### `E_STATE_MAP_KEY_TYPE` {#e-state-map-key-type}

a StateMap key lacks a canonical deterministic Norito representation

**Fix:** Choose a supported scalar canonical-Norito key type.

### `E_STATE_MAP_OPTIONAL_READ` {#e-state-map-optional-read}

a StateMap read discarded the possibility that its key is absent

**Fix:** Use map.get(key), handle the returned Option&lt;V&gt;, and use map\[key\] = value only for writes.

### `E_STATE_SHADOWED` {#e-state-shadowed}

a local declaration shadowed durable state

**Fix:** Rename the local declaration; V1 rejects all shadowing.

### `E_STRUCT_PATTERN_TYPE` {#e-struct-pattern-type}

a named struct pattern has a different nominal type from its initializer

**Fix:** Use the initializer's declared struct type and bind its fields by name.

### `E_SUM_CONTEXT_TYPE` {#e-sum-context-type}

a sum constructor conflicts with its contextual type

**Fix:** Use the matching Option or Result constructor and an exactly assignable active payload.

### `E_SUM_MISSING_CONTEXT` {#e-sum-missing-context}

an inactive or partially inferred sum value lacks an exact type context

**Fix:** Add an Option&lt;T&gt; or Result&lt;T, E&gt; annotation so every generic payload type is known.

### `E_TAIL_TYPE_MISMATCH` {#e-tail-type-mismatch}

a block-tail expression does not exactly match its required type

**Fix:** Make the final expression the exact required type or terminate it with a semicolon when the block returns unit.

### `E_TEST_ACTOR_LITERAL` {#e-test-actor-literal}

a Kotodama test actor was not a static literal alias

**Fix:** Pass a string literal or Name::parse literal actor alias to the test helper.

### `E_TEST_ARGUMENT_RECORD` {#e-test-argument-record}

test invocation arguments do not match the target parameters

**Fix:** Pass a closed typed record, for example `arguments: { count: 7 }`, with exactly the target parameter names and types. Use `{}` for a target with no parameters. JSON values are not accepted.

### `E_TEST_BUILTIN_CONTEXT` {#e-test-builtin-context}

a `test::` builtin was called outside a test function or a test-module helper

**Fix:** Call `test::` builtins from a `#[test] fn` or from a private helper of a `*.test.ko` module that declares `koto_test { target: "..." }`; seiyaku code, including its private helpers, cannot call them.

### `E_TEST_ENTRYPOINT_KIND` {#e-test-entrypoint-kind}

a runtime test helper targeted a private function

**Fix:** Target a kotoage, view, hajimari, or kaizen declaration.

### `E_TEST_ENTRYPOINT_LITERAL` {#e-test-entrypoint-literal}

a runtime test helper target was not a static literal

**Fix:** Pass the kotoage, view, hajimari, or kaizen name as a string or Name::parse literal.

### `E_TEST_FUNCTION_SIGNATURE` {#e-test-function-signature}

a #\[test\] function has a public, parameterized, or value-returning signature

**Fix:** Declare each test as a local parameterless `#[test] fn` returning unit.

### `E_TEST_MODULE_ITEM` {#e-test-module-item}

a standalone Kotodama test module contains a deployable-only item

**Fix:** Keep standalone test modules limited to their target, fixtures, helpers, and #\[test\] functions.

### `E_TEST_MODULE_KIND` {#e-test-module-kind}

a standalone Kotodama test file did not declare a module

**Fix:** Declare a module source unit and identify the tested seiyaku with koto\_test.

### `E_TEST_ONLY_PRODUCTION` {#e-test-only-production}

test code reached a production check or build

**Fix:** Move #\[test\] functions, fixtures, and `test::` calls into a `<name>.test.ko` module that declares `koto_test { target: "..." }`, and run it with `koto test`; production checks and builds reject test code instead of stripping it, so the artifact always matches the reviewed source.

Rejected:

```kotodama
seiyaku Fees {
    view fn fee(int amount) authorize(anyone) -> int {
        return amount * 2;
    }

    #[test]
    fn doubles() {
        test::assert_eq(actual: fee(amount: 500), expected: 1000);
    }
}
```

Accepted:

```kotodama
// tests/fees.test.ko; contracts/fees.ko keeps only the seiyaku
module FeesTests {
    koto_test { target: "../contracts/fees.ko" }

    #[test]
    fn doubles() {
        let charged = test::invoke_kotoage(
            kotoage: "fee",
            arguments: { amount: 500 },
        );
        test::assert_eq(actual: charged, expected: 1000);
    }
}
```

### `E_TEST_REJECTION_EXPECTATION` {#e-test-rejection-expectation}

the exact rejection helper requires a typed error variant or rejection selector

**Fix:** Pass an ErrorEnum::Variant value or a test::Rejection selector to expected.

### `E_TEST_TARGET_REQUIRED` {#e-test-target-required}

a standalone Kotodama test module omitted its tested seiyaku

**Fix:** Add one koto\_test declaration naming the seiyaku under test.

### `E_TRIGGER_CALLBACK_PARAMETERS` {#e-trigger-callback-parameters}

a trigger event cannot supply the callback parameter record

**Fix:** Time, data, and pipeline callbacks take no parameters; read dynamic event data with `context::trigger_event()`. Execute-trigger callbacks may declare typed parameters validated against the explicit event arguments.

### `E_TRIGGER_FILTER_DUPLICATE_MATCHER` {#e-trigger-filter-duplicate-matcher}

a trigger data filter repeats one matcher key

**Fix:** Keep at most one matcher for each supported key in the trigger filter.

### `E_TRIGGER_FILTER_INVALID_LITERAL` {#e-trigger-filter-invalid-literal}

a trigger data-filter matcher contains an invalid typed identifier literal

**Fix:** Replace the matcher value with a canonical literal of the identifier type named by the diagnostic.

### `E_TRIGGER_FILTER_UNSUPPORTED_EVENT` {#e-trigger-filter-unsupported-event}

a trigger data family does not support the requested event kind

**Fix:** Choose one event kind supported by that data family or omit the event restriction.

### `E_TRIGGER_FILTER_UNSUPPORTED_MATCHER` {#e-trigger-filter-unsupported-matcher}

a trigger data family does not support the requested matcher

**Fix:** Remove the matcher or use a matcher supported by the selected data family.

### `E_TRIGGER_INVALID_AUTHORITY` {#e-trigger-invalid-authority}

a trigger authority is not a canonical AccountId

**Fix:** Use a canonical domainless AccountId for trigger authority.

### `E_TRIGGER_INVALID_ID` {#e-trigger-invalid-id}

an execute-trigger target is not a canonical TriggerId name

**Fix:** Use a valid canonical Name for the referenced trigger id.

### `E_TRIGGER_INVALID_METADATA_KEY` {#e-trigger-invalid-metadata-key}

a trigger metadata key is not a canonical Name

**Fix:** Replace the metadata key with a valid canonical Name.

### `E_TRIGGER_INVALID_NAME` {#e-trigger-invalid-name}

a trigger declaration name is not canonical

**Fix:** Rename the trigger using a valid canonical Name.

### `E_TRIGGER_METADATA_VALUE` {#e-trigger-metadata-value}

a trigger metadata expression cannot be represented as canonical JSON

**Fix:** Use an exactly representable literal or explicit native Json construction.

### `E_TRIGGER_SCHEDULE_CONSTANT` {#e-trigger-schedule-constant}

a schedule time is not a compile-time integer expression

**Fix:** Use integer constants and checked integer arithmetic for start\_ms and period\_ms; dynamic function calls are not schedule constants.

### `E_TRIGGER_SCHEDULE_PERIOD` {#e-trigger-schedule-period}

a schedule period is zero, negative, or out of range

**Fix:** Use period\_ms in 1..=18446744073709551615 milliseconds; omit period\_ms for a one-shot schedule.

### `E_TRIGGER_SCHEDULE_START` {#e-trigger-schedule-start}

a schedule start does not fit unsigned 64-bit milliseconds

**Fix:** Use start\_ms in 0..=18446744073709551615 milliseconds since the Unix epoch.

### `E_TRIGGER_TARGET_KIND` {#e-trigger-target-kind}

a trigger callback does not target a kotoage/言挙げ function

**Fix:** Point the trigger at a declared kotoage/言挙げ function.

### `E_TRIGGER_VIEW_TARGET` {#e-trigger-view-target}

a trigger callback targets a read-only view function

**Fix:** Point the trigger at a declared kotoage/言挙げ function instead.

### `E_TUPLE_INDEX` {#e-tuple-index}

a tuple member index is outside the tuple's declared fields

**Fix:** Use a zero-based tuple index smaller than the tuple length.

### `E_TYPE_ANNOTATION_MISMATCH` {#e-type-annotation-mismatch}

an explicitly typed binding received a value of another type

**Fix:** Keep type-first annotations exact and use only explicit V1 conversions.

### `E_UNBOUNDED_ITERATION` {#e-unbounded-iteration}

collection iteration is not compiler-proven bounded

**Fix:** Iterate a List with capacity at most 64; use map.page(after: cursor, limit: N) or map.take(N) with a compile-time integer expression in 1..=64.

### `E_UNBOUNDED_LOOP` {#e-unbounded-loop}

a loop bound is not compiler-proven

**Fix:** Use a static range or a collection operation whose 64-item cap is proven by the compiler.

### `E_UNKNOWN_EVENT` {#e-unknown-event}

emit names no declared native event

**Fix:** Declare the event in this seiyaku or an included declaration fragment, then supply its exact record fields.

### `E_UNKNOWN_NAMED_ARGUMENT` {#e-unknown-named-argument}

a named argument does not match a declared parameter

**Fix:** Use one of the callee's declared parameter names.

### `E_UNKNOWN_STRUCT` {#e-unknown-struct}

a struct literal refers to an unknown type

**Fix:** Declare the struct in this source unit or import its typed module declaration.

### `E_UNKNOWN_STRUCT_FIELD` {#e-unknown-struct-field}

a struct literal names an undeclared field

**Fix:** Use only fields declared by the struct type.

### `E_ZK_MODE_REQUIRED` {#e-zk-mode-required}

a ZK-only operation was retained without ZK compilation policy

**Fix:** Build the seiyaku with explicit ZK project policy or remove the ZK-only operation.

### `K2001` {#k2001}

a declaration duplicates or shadows another symbol

**Fix:** Give every declaration and binding a unique, non-reserved name.

### `K2003` {#k2003}

an expression violates the strict type rules

**Fix:** Use the exact declared type and an explicit conversion operation where one exists.

### `K2004` {#k2004}

authorization or view-effect policy was violated

**Fix:** Give every kotoage (言挙げ) an `authorize(Admin)` clause, and keep every function a `view fn` calls free of state writes, ledger instructions, and host effects.

Rejected:

```kotodama
view fn bump() authorize(anyone) -> int {
    count += 1;
    return count;
}
```

Accepted:

```kotodama
permission CanBump; kotoage fn bump() authorize(CanBump) -> int {
    count += 1;
    return count;
}
```

### `K2005` {#k2005}

durable-state rules were violated

**Fix:** Initialize scalar state in hajimari and access StateMap values through its typed API.

### `K2006` {#k2006}

a recursive call graph or recursive value type was found

**Fix:** Refactor the cycle into an iterative, compiler-proven bounded design.

### `K2007` {#k2007}

a function exceeds a V1 argument or result table bound

**Fix:** Reduce the recursively flattened argument or result representation to at most 8192 words per table.

### `K2008` {#k2008}

a named value type exceeds a fixed V1 resolution budget

**Fix:** Shorten deeply nested value types or replace repeatedly branching product fields with a flatter bounded schema.

### `K2098` {#k2098}

an accepted parameter type retained no bounded ABI representation

**Fix:** Report this compiler defect with the source; semantic analysis must assign every parameter an exact bounded V1 ABI representation.

### `K2100` {#k2100}

the program violates the deterministic on-chain profile

**Fix:** Remove test-only or non-deterministic behavior from the deployable seiyaku.

### `K5001` {#k5001}

durable state is declared but never used

**Fix:** Remove the declaration or read/write it from a reachable function.

### `K5002` {#k5002}

a declaration shadows durable state

**Fix:** Rename the declaration; strict V1 source should keep every binding unambiguous.

### `K5003` {#k5003}

a private function parameter is never used

**Fix:** Remove the parameter or use it in the function body; prefix its name with `_` to keep it deliberately. Parameters of kotoage, view, and lifecycle declarations are argument keys of the public interface and are not reported.

Rejected:

```kotodama
fn fee(int amount, int unused) -> int {
    return amount;
}
```

Accepted:

```kotodama
fn fee(int amount) -> int {
    return amount;
}
```

### `K5004` {#k5004}

a statement is unreachable after return

**Fix:** Delete the unreachable statement or move it before the terminating return.

### `K5005` {#k5005}

the same typed literal is repeated in one seiyaku

**Fix:** Declare the value once as a named `const` and refer to it by name, so every use is identical and reviewers can see what the literal stands for.

Rejected:

```kotodama
ledger::asset::mint(account: AccountId::parse("sorau…"), ...);
ledger::asset::burn(account: AccountId::parse("sorau…"), ...);
```

Accepted:

```kotodama
const AccountId TREASURY = AccountId::parse("sorau…");
ledger::asset::mint(account: TREASURY, ...);
ledger::asset::burn(account: TREASURY, ...);
```

### `K5006` {#k5006}

a constructed typed value is never used

**Fix:** Remove the constructor call or use its result.

### `K5007` {#k5007}

a trigger specification is not statically transparent

**Fix:** Use a canonical literal trigger specification so admission can derive its behavior.

### `K5008` {#k5008}

a state path is dynamic without complete access metadata

**Fix:** Use a canonical StateMap operation or a literal state path when scheduler precision matters.

### `K5009` {#k5009}

an opaque operation prevents precise access derivation

**Fix:** Prefer typed namespaced operations with derivable access; otherwise execution is serialized conservatively.

### `K5010` {#k5010}

a copy of durable state is changed but never written back

**Fix:** Reading a StateMap entry or a whole state value returns a copy. Store the changed copy with `Map[key] = value;` (or `state = value;`) after the last change, or the change is lost when the call ends.

Rejected:

```kotodama
var c = Configs.get(1).expect(E::Missing);
c.paused = true;
```

Accepted:

```kotodama
var c = Configs.get(1).expect(E::Missing);
c.paused = true;
Configs[1] = c;
```

### `K5011` {#k5011}

a kotoage performs no state, ledger, or host effects

**Fix:** Declare it `view fn` so callers can query it without a transaction or fee. A view may keep `authorize(Admin)` to restrict who may call it.

Rejected:

```kotodama
permission Entry; kotoage fn add(int a, int b) authorize(Entry) -> int {
    return a + b;
}
```

Accepted:

```kotodama
view fn add(int a, int b) authorize(anyone) -> int {
    return a + b;
}
```

### `K5012` {#k5012}

exact decimal or quantity division by a runtime value can revert

**Fix:** Exact `/` rejects quotients that do not terminate within 28 fractional digits, such as 1/3. Divide with an explicit rounding mode through `div_round`, `ratio_round`, or `mul_div_round`, choosing the scale and mode the seiyaku requires.

Rejected:

```kotodama
return total / parts;
```

Accepted:

```kotodama
return total.div_round(divisor: parts, scale: 6, mode: Rounding::floor);
```

### `K5013` {#k5013}

a local binding is never read

**Fix:** Remove the binding or use it; bind to `_` to evaluate an expression only for its effects.

Rejected:

```kotodama
let unused = compute();
```

Accepted:

```kotodama
let _ = compute();
```

### `K5014` {#k5014}

a stored value is overwritten before it is read

**Fix:** Remove the earlier store, or read the value before assigning the binding again.

Rejected:

```kotodama
var total = 0;
total = 5;
```

Accepted:

```kotodama
var total = 5;
```

### `K5015` {#k5015}

a public parameter name starts with an underscore

**Fix:** Public parameter names are the argument keys callers send, so a leading `_` becomes part of the interface. Rename the parameter; public parameters are never reported as unused, so the prefix silences nothing.

Rejected:

```kotodama
kaizen(int _new_impl) {
}
```

Accepted:

```kotodama
kaizen(int new_impl) {
}
```

### `K5016` {#k5016}

a `var` binding is never reassigned or mutated

**Fix:** Declare the binding with `let`; `var` marks a binding that a later assignment, compound assignment, field write, or mutating method changes.

Rejected:

```kotodama
var total = amount + fee;
return total;
```

Accepted:

```kotodama
let total = amount + fee;
return total;
```

### `K5017` {#k5017}

a private function is never called

**Fix:** Remove the function, call it, or prefix its name with `_` to keep it deliberately. In a module, declare it `export fn` when other units need it.

Rejected:

```kotodama
fn helper() -> int {
    return 1;
}
view fn value() authorize(anyone) -> int {
    return 7;
}
```

Accepted:

```kotodama
fn helper() -> int {
    return 1;
}
view fn value() authorize(anyone) -> int {
    return helper();
}
```

### `K5018` {#k5018}

a seiyaku declares no kotoage, view, or lifecycle function

**Fix:** Private `fn` helpers run only when a public function calls them, so nothing can call this seiyaku. Add a kotoage/言挙げ function with `authorize(Admin)` for state changes, or a `view fn` for queries.

Rejected:

```kotodama
seiyaku Quiet {
    fn helper() -> int { return 1; }
}
```

Accepted:

```kotodama
seiyaku Quiet {
    view fn value() authorize(anyone) -> int { return 1; }
}
```

### `K5099` {#k5099}

a linter finding lacked a dedicated unified diagnostic code

**Fix:** Report the finding so it can receive a stable K5000-series code and remediation.

## Lowering {#lowering}

### `K3001` {#k3001}

a typed construct has no V1 code-generation form

**Fix:** Use a supported V1 type or operation; this is a compiler defect if the grammar promises the construct.

### `K3003` {#k3003}

typed HIR could not be lowered to SSA MIR

**Fix:** Simplify the reported construct and report a compiler defect if valid V1 source triggered it.

### `K3004` {#k3004}

SSA optimization failed to preserve a valid deterministic control-flow graph

**Fix:** Report this compiler defect with a minimal source reproducer; no artifact is emitted after an optimizer failure.

### `K3005` {#k3005}

lowered IR could not be converted into validated SSA form

**Fix:** Report this compiler defect with a minimal source reproducer; valid typed HIR must always produce validated SSA.

### `K3006` {#k3006}

optimized SSA could not be converted back into validated lowering IR

**Fix:** Report this compiler defect with a minimal source reproducer; no bytecode is emitted from an invalid optimized program.

### `K3099` {#k3099}

bytecode generation failed

**Fix:** When the message names a source construct (for example an argument that must be a literal), fix that construct. Any other message describes a compiler defect, not a problem in the source: report it with a minimal source reproducer. Valid V1 programs always assemble deterministically.

## Artifact {#artifact}

### `E_UPGRADE_BASE_INVALID` {#e-upgrade-base-invalid}

the prior upgrade artifact failed canonical admission

**Fix:** Use the previously deployed complete .to artifact as the upgrade base.

### `E_UPGRADE_INCOMPATIBLE` {#e-upgrade-incompatible}

the replacement does not preserve the deployed durable state schema

**Fix:** Preserve every existing state name and complete type; new scalar state requires kaizen and initialized runtime values.

### `K4001` {#k4001}

compiler-owned artifact preparation failed

**Fix:** Report a compiler defect; source cannot override ABI or execution-header policy.

### `K4002` {#k4002}

manifest or deployable artifact construction failed

**Fix:** Report a compiler defect and do not deploy a partial output.

### `K4003` {#k4003}

a reusable module was requested as a deployable artifact

**Fix:** Link the module into exactly one seiyaku root and build that seiyaku.

### `W_PROVER_PRIVATE_INPUT` {#w-prover-private-input}

reachable private inputs require local prover witness transport unavailable in production

**Fix:** Separate local proof generation from the deployable contract; production hosts cannot supply private test witnesses.
