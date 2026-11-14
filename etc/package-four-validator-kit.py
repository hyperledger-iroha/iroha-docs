"""Build or check the downloadable example used by the Launch Iroha 3 guide."""
import argparse
import hashlib
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / "examples" / "iroha-trade-poc"
ARCHIVE = ROOT / "src" / "public" / "downloads" / "iroha-trade-poc.zip"
# Keep generated keys, Docker state and ledger volumes out of the download.
FILES = (
    "README.md", "poc.py", "LICENSE", "build-support/Dockerfile",
    "build-support/Cargo.lock", "build-support/fresh-client.patch",
    "build-support/lane-preimages.patch",
)


def package():
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    temporary = ARCHIVE.with_suffix(".tmp")
    with ZipFile(temporary, "w") as archive:
        for name in FILES:
            entry = ZipInfo(f"{EXAMPLE.name}/{name}", (2026, 11, 9, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, (EXAMPLE / name).read_bytes())
    temporary.replace(ARCHIVE)


def check(digest):
    with ZipFile(ARCHIVE) as archive:
        expected = [f"{EXAMPLE.name}/{name}" for name in FILES]
        if sorted(archive.namelist()) != sorted(expected):
            raise SystemExit("The public ZIP contains unexpected or missing files.")
        for name, member in zip(FILES, expected):
            if archive.read(member) != (EXAMPLE / name).read_bytes():
                raise SystemExit(f"Rebuild the public ZIP after changing {name}.")
    guide = (ROOT / "src/get-started/launch-iroha.md").read_text(encoding="utf-8")
    if f"{digest}  {ARCHIVE.name}" not in guide:
        raise SystemExit("Update the SHA-256 in the launch guide and its translations.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate the checked-in ZIP and guide")
    args = parser.parse_args()
    if not args.check:
        package()
    digest = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
    print(f"{digest}  {ARCHIVE.name}")
    if args.check:
        check(digest)
