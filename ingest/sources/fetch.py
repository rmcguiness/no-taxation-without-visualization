"""Fetch raw source files into data/raw/{source}/{date}/ with sha256 hashes.

Raw files are immutable: an existing file is never overwritten. Each file gets
a JSON sidecar ({filename}.meta.json) recording url, retrieved_at, and
content_hash, so a snapshot can be registered in the database later even if
the DB was down at fetch time.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import httpx

from sources.registry import SOURCES, Source

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_ROOT = REPO_ROOT / "data" / "raw"

USER_AGENT = (
    "NTwV-ingest/0.1 (github.com; civic data project; contact via repo) "
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
)

SCHEMA_VERSION = 1


@dataclass(frozen=True)
class RawFile:
    source: Source
    path: Path
    content_hash: str
    retrieved_at: str  # ISO-8601


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _meta_path(path: Path) -> Path:
    return path.with_name(path.name + ".meta.json")


def fetch_source(source_id: str, *, raw_root: Path = RAW_ROOT) -> RawFile:
    """Download one source, or reuse today's already-downloaded copy."""
    source = SOURCES[source_id]
    today = datetime.now(timezone.utc).date().isoformat()
    filename = Path(urlparse(source.url).path).name
    dest_dir = raw_root / source_id / today
    dest = dest_dir / filename

    if dest.exists():
        meta = json.loads(_meta_path(dest).read_text())
        stored = sha256_file(dest)
        if stored != meta["content_hash"]:
            raise RuntimeError(
                f"{dest} does not match its recorded hash; raw files are "
                "immutable — delete the day directory and re-fetch."
            )
        return RawFile(source, dest, stored, meta["retrieved_at"])

    dest_dir.mkdir(parents=True, exist_ok=True)
    with httpx.Client(follow_redirects=True, timeout=60.0) as client:
        resp = client.get(source.url, headers={"User-Agent": USER_AGENT})
        resp.raise_for_status()
        content = resp.content

    retrieved_at = datetime.now(timezone.utc).isoformat()
    tmp = dest.with_suffix(dest.suffix + ".part")
    tmp.write_bytes(content)
    content_hash = sha256_file(tmp)
    tmp.rename(dest)

    _meta_path(dest).write_text(
        json.dumps(
            {
                "source_id": source_id,
                "url": source.url,
                "retrieved_at": retrieved_at,
                "content_hash": content_hash,
                "schema_version": SCHEMA_VERSION,
                "size_bytes": len(content),
            },
            indent=2,
        )
        + "\n"
    )
    return RawFile(source, dest, content_hash, retrieved_at)


def latest_raw(source_id: str, *, raw_root: Path = RAW_ROOT) -> RawFile | None:
    """Most recently fetched raw file for a source, if any."""
    source_dir = raw_root / source_id
    if not source_dir.exists():
        return None
    candidates = sorted(source_dir.glob("*/*.meta.json"), reverse=True)
    if not candidates:
        return None
    meta = json.loads(candidates[0].read_text())
    path = candidates[0].with_name(candidates[0].name.removesuffix(".meta.json"))
    return RawFile(SOURCES[source_id], path, meta["content_hash"], meta["retrieved_at"])
