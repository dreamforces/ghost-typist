#!/usr/bin/env python3
"""Run at the root of the library repository: writes extensions/index.json and phrases/index.json.

Ghost Typist lists what each index lists and installs a package only if its SHA-256 matches, so run
this after every change and commit the packages with both indexes.
"""
import hashlib, json, pathlib

def count(n, noun):
    return f"{n} {noun}{'' if n == 1 else 's'}" if n else None

# Each shelf holds one kind: phrase packs are schema 1, extensions schema 2.
for shelf, schema in (("extensions", 2), ("phrases", 1)):
    entries, folder = [], pathlib.Path(shelf)
    folder.mkdir(exist_ok=True)
    for path in sorted(folder.glob("*.json")):
        if path.name == "index.json":
            continue
        data = path.read_bytes()
        package = json.loads(data)
        assert package.get("schemaVersion") == schema, f"{path}: {shelf}/ holds schemaVersion {schema} packages"
        assert package["id"] not in {e["id"] for e in entries}, f"{path}: duplicate id {package['id']}"
        # The same summary the app shows for an installed package.
        detectors = {"repetition": "repetition", "passive": "passive voice", "long-sentence": "long sentences", "adverb": "adverbs"}
        if "detector" in package:
            assert package["detector"] in detectors, f"{path}: unknown detector"
        capabilities = [count(len(package.get("phrases", [])), "phrase"), "prompt style" if package.get("prompt") else None,
                        count(len(package.get("checks", [])), "check"), count(len(package.get("actions", [])), "action"),
                        detectors.get(package.get("detector")), "translation model" if package.get("model") else None]
        entry = {key: package[key] for key in ("id", "name", "description", "author", "version")}
        entry.update(path=path.as_posix(), sha256=hashlib.sha256(data).hexdigest(), capabilities=[c for c in capabilities if c])
        if package.get("tags"):
            entry["tags"] = package["tags"]
        entries.append(entry)
    entries.sort(key=lambda entry: entry["id"])
    (folder / "index.json").write_text(json.dumps({"schemaVersion": 1, "packages": entries}, indent=2, ensure_ascii=False) + "\n")
    print(f"{shelf}/index.json: {len(entries)} package(s)")
