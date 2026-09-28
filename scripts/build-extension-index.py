#!/usr/bin/env python3
"""Run at the root of the library repository: writes extensions/index.json and phrases/index.json.

Ghost Typist lists what each index lists and installs a package only if its SHA-256 matches, so run
this after every change and commit the packages with both indexes.
"""
import hashlib, json, pathlib

def count(n, noun):
    return f"{n} {noun}{'' if n == 1 else 's'}" if n else None

phrases = pathlib.Path("phrases")
phrases.mkdir(exist_ok=True)
entries = []
for path in sorted(phrases.glob("*.json")):
    if path.name == "index.json":
        continue
    data = path.read_bytes()
    package = json.loads(data)
    assert package.get("schemaVersion") == 1, f"{path}: phrases/ holds phrase packs"
    assert package["id"] not in {e["id"] for e in entries}, f"{path}: duplicate id"
    entry = {key: package[key] for key in ("id", "name", "description", "author", "version")}
    entry.update(path=path.as_posix(), sha256=hashlib.sha256(data).hexdigest(),
                 capabilities=[c for c in [count(len(package.get("phrases", [])), "phrase")] if c])
    if package.get("tags"):
        entry["tags"] = package["tags"]
    entries.append(entry)
entries.sort(key=lambda entry: entry["id"])
(phrases / "index.json").write_text(json.dumps({"schemaVersion": 1, "packages": entries}, indent=2, ensure_ascii=False) + "\n")
print(f"phrases/index.json: {len(entries)} package(s)")

extensions = pathlib.Path("extensions")
extensions.mkdir(exist_ok=True)
entries = []
for path in sorted(extensions.glob("*.js")):
    data = path.read_bytes()
    first = data.splitlines()[0].decode()
    assert first.startswith("// ghost "), f"{path}: missing // ghost header"
    header = json.loads(first[len("// ghost "):])
    source = data.decode()
    assert "detector" not in source and '"checks"' not in source, f"{path}: checks and detectors are host functions, not package fields"
    assert header["id"] not in {e["id"] for e in entries}, f"{path}: duplicate id"
    entry = {key: header[key] for key in ("id", "name", "description", "author", "version")}
    entry.update(path=path.as_posix(), sha256=hashlib.sha256(data).hexdigest(), capabilities=header.get("capabilities") or [])
    if header.get("tags"):
        entry["tags"] = header["tags"]
    entries.append(entry)
entries.sort(key=lambda entry: entry["id"])
(extensions / "index.json").write_text(json.dumps({"schemaVersion": 1, "packages": entries}, indent=2, ensure_ascii=False) + "\n")
print(f"extensions/index.json: {len(entries)} package(s)")
