#!/usr/bin/env python3
"""Parse HTML prototypes, inject stable CDD ids, and emit deduplication JSON."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}

SKIP_TAGS = {"html", "head", "meta", "link", "style", "script", "title"}
VISIBLE_TAGS = {
    "a",
    "article",
    "aside",
    "button",
    "div",
    "fieldset",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "img",
    "input",
    "label",
    "li",
    "main",
    "nav",
    "p",
    "section",
    "select",
    "span",
    "textarea",
    "ul",
}

PREFIX_BY_TAG = {
    "button": "atm-btn",
    "a": "atm-link",
    "input": "atm-input",
    "textarea": "atm-input",
    "select": "atm-input",
    "label": "atm-label",
    "img": "atm-img",
    "h1": "atm-text",
    "h2": "atm-text",
    "h3": "atm-text",
    "h4": "atm-text",
    "h5": "atm-text",
    "h6": "atm-text",
    "p": "atm-text",
    "span": "atm-text",
    "li": "mol-item",
    "form": "org-form",
    "nav": "org-nav",
    "header": "org-header",
    "footer": "org-footer",
    "main": "org-main",
    "section": "org-section",
    "article": "mol-card",
}


@dataclass
class Node:
    tag: str
    attrs: list[tuple[str, str | None]]
    start: str
    start_index: int
    end_index: int | None = None
    children: list["Node"] | None = None
    text_parts: list[str] | None = None
    cdd_id: str | None = None

    def __post_init__(self) -> None:
        self.children = []
        self.text_parts = []

    @property
    def text(self) -> str:
        return normalize_text(" ".join(self.text_parts or []))


class PrototypeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=False)
        self.root = Node("__root__", [], "", 0)
        self.stack = [self.root]
        self.nodes: list[Node] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        raw = self.get_starttag_text() or f"<{tag}>"
        node = Node(tag.lower(), attrs, raw, self.getpos()[1])
        self.stack[-1].children.append(node)
        self.nodes.append(node)
        if tag.lower() not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        raw = self.get_starttag_text() or f"<{tag}/>"
        node = Node(tag.lower(), attrs, raw, self.getpos()[1], self.getpos()[1] + len(raw))
        self.stack[-1].children.append(node)
        self.nodes.append(node)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                node = self.stack[index]
                node.end_index = self.getpos()[1]
                self.stack = self.stack[:index]
                break

    def handle_data(self, data: str) -> None:
        if self.stack:
            self.stack[-1].text_parts.append(data)


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def attr_map(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
    return {key.lower(): "" if value is None else value for key, value in attrs}


def has_hidden_marker(attrs: dict[str, str]) -> bool:
    joined = " ".join(attrs.get(name, "") for name in ("hidden", "aria-hidden", "style", "class"))
    hidden_tokens = ("display:none", "display: none", "visibility:hidden", "visibility: hidden", "sr-only")
    return attrs.get("hidden") == "" or attrs.get("aria-hidden") == "true" or any(token in joined for token in hidden_tokens)


def is_relevant(node: Node) -> bool:
    attrs = attr_map(node.attrs)
    if node.tag in SKIP_TAGS or node.tag not in VISIBLE_TAGS or has_hidden_marker(attrs):
        return False
    if node.tag in {"input", "img", "button", "select", "textarea"}:
        return True
    if attrs.get("role") in {"button", "link", "tab", "navigation"}:
        return True
    if node.text:
        return True
    return any(child.tag not in SKIP_TAGS for child in node.children or [])


def prefix_for(node: Node) -> str:
    attrs = attr_map(node.attrs)
    class_hint = attrs.get("class", "").lower()
    role = attrs.get("role", "").lower()
    if "card" in class_hint:
        return "mol-card"
    if "tab" in class_hint or role == "tab":
        return "mol-tab"
    if "field" in class_hint or node.tag == "label":
        return "mol-field" if node.children else "atm-label"
    return PREFIX_BY_TAG.get(node.tag, "mol-block")


def fingerprint(node: Node) -> str:
    attrs = attr_map(node.attrs)
    ignored = {"cdd-id", "data-agent-id", "id"}
    stable_attrs = {key: value for key, value in attrs.items() if key not in ignored and not key.startswith("data-")}
    child_tags = [child.tag for child in node.children or [] if child.tag not in SKIP_TAGS]
    payload = {
        "tag": node.tag,
        "attrs": stable_attrs,
        "text": node.text,
        "children": child_tags,
    }
    return hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def inject_id(start_tag: str, cdd_id: str, attr_name: str) -> str:
    if re.search(rf"\s{re.escape(attr_name)}=", start_tag):
        return re.sub(rf'{re.escape(attr_name)}="[^"]*"', f'{attr_name}="{cdd_id}"', start_tag, count=1)
    if start_tag.endswith("/>"):
        return f'{start_tag[:-2]} {attr_name}="{cdd_id}"/>'
    return f'{start_tag[:-1]} {attr_name}="{cdd_id}">'


def process_file(path: Path, source_root: Path, output_root: Path, counters: dict[str, int]) -> dict[str, Any]:
    html = path.read_text(encoding="utf-8")
    parser = PrototypeParser()
    parser.feed(html)

    replacements: list[tuple[str, str]] = []
    elements: list[dict[str, Any]] = []
    for node in parser.nodes:
        if not is_relevant(node):
            continue
        attrs = attr_map(node.attrs)
        existing = attrs.get("cdd-id") or attrs.get("data-agent-id")
        prefix = prefix_for(node)
        if existing:
            cdd_id = existing
        else:
            counters[prefix] = counters.get(prefix, 0) + 1
            cdd_id = f"{prefix}-{counters[prefix]:03d}"
        node.cdd_id = cdd_id
        replacements.append((node.start, inject_id(node.start, cdd_id, "data-agent-id")))
        elements.append(
            {
                "cdd_id": cdd_id,
                "source_file": str(path.relative_to(source_root)),
                "tag": node.tag,
                "text": node.text[:160],
                "class": attrs.get("class", ""),
                "role": attrs.get("role", ""),
                "hash": fingerprint(node),
                "child_tags": [child.tag for child in node.children or [] if child.tag not in SKIP_TAGS],
                "suggested_prefix": prefix,
            }
        )

    marked_html = html
    for old, new in replacements:
        marked_html = marked_html.replace(old, new, 1)

    target = output_root / path.relative_to(source_root)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(marked_html, encoding="utf-8")

    return {
        "file": str(path.relative_to(source_root)),
        "file_hash": hashlib.sha256(html.encode("utf-8")).hexdigest(),
        "marked_file_hash": hashlib.sha256(marked_html.encode("utf-8")).hexdigest(),
        "elements": elements,
    }


def deduplicate(files: list[dict[str, Any]]) -> dict[str, Any]:
    by_hash: dict[str, list[dict[str, Any]]] = {}
    for file_info in files:
        for element in file_info["elements"]:
            by_hash.setdefault(element["hash"], []).append(element)

    components = []
    duplicates = []
    for item_hash, group in sorted(by_hash.items()):
        canonical = group[0]
        refs = [entry["cdd_id"] for entry in group[1:]]
        components.append(
            {
                "canonical_cdd_id": canonical["cdd_id"],
                "hash": item_hash,
                "source_file": canonical["source_file"],
                "tag": canonical["tag"],
                "text": canonical["text"],
                "class": canonical["class"],
                "suggested_prefix": canonical["suggested_prefix"],
                "duplicate_cdd_ids": refs,
                "classification": "unclassified",
            }
        )
        if refs:
            duplicates.append({"canonical_cdd_id": canonical["cdd_id"], "duplicate_cdd_ids": refs, "hash": item_hash})
    return {"components": components, "duplicates": duplicates}


def build_workflow(progress_path: Path, parse_result: dict[str, Any], app_name: str, target_framework: str) -> dict[str, Any]:
    previous: dict[str, Any] = {}
    if progress_path.exists():
        previous = json.loads(progress_path.read_text(encoding="utf-8"))
    previous_hashes = previous.get("source_hashes", {})
    source_hashes = {entry["file"]: entry["file_hash"] for entry in parse_result["files"]}
    changed = sorted(path for path, value in source_hashes.items() if previous_hashes.get(path) != value)
    removed = sorted(path for path in previous_hashes if path not in source_hashes)

    return {
        "schema_version": "1.0",
        "app_name": app_name,
        "target_framework": target_framework,
        "current_state": "parsed",
        "last_run": parse_result["generated_at"],
        "source_hashes": source_hashes,
        "changed_files": changed,
        "removed_files": removed,
        "checkpoint_comment": (
            "Dependency tracking stores which molecule/organism references each atom. "
            "When a source hash changes, only affected canonical components and their dependents "
            "need classification or React Native regeneration; unchanged hashes stay reusable."
        ),
        "dependencies": {
            component["canonical_cdd_id"]: {
                "depends_on": [],
                "invalidates": component["duplicate_cdd_ids"],
                "status": "needs_classification" if component["source_file"] in changed else "unchanged",
            }
            for component in parse_result["deduplication"]["components"]
        },
        "next_actions": [
            "Classify canonical components using SKILL.md CDD rules.",
            "Consolidate duplicate_cdd_ids into component variants.",
            "Map approved components to React Native primitives.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("prototype_dir", type=Path)
    parser.add_argument("--out-dir", type=Path, default=Path("cdd-output/indexed-prototypes"))
    parser.add_argument("--json-out", type=Path, default=Path("cdd-output/deduplicated-components.json"))
    parser.add_argument("--workflow-out", type=Path, default=Path("workflow-progress.json"))
    parser.add_argument("--app-name", default="unknown-app")
    parser.add_argument("--target-framework", default="react-native")
    parser.add_argument("--zip-out", type=Path, default=Path("cdd-output/indexed-prototypes.zip"))
    args = parser.parse_args()

    source_root = args.prototype_dir.resolve()
    output_root = args.out_dir.resolve()
    if output_root.exists():
        shutil.rmtree(output_root)
    output_root.mkdir(parents=True, exist_ok=True)

    counters: dict[str, int] = {}
    files = [
        process_file(path, source_root, output_root, counters)
        for path in sorted(source_root.rglob("*.html"))
    ]
    result = {
        "schema_version": "1.0",
        "generated_at": __import__("datetime").datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "prototype_dir": str(source_root),
        "files": files,
        "deduplication": deduplicate(files),
    }

    args.json_out.parent.mkdir(parents=True, exist_ok=True)
    args.json_out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    workflow = build_workflow(args.workflow_out, result, args.app_name, args.target_framework)
    args.workflow_out.write_text(json.dumps(workflow, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    args.zip_out.parent.mkdir(parents=True, exist_ok=True)
    if args.zip_out.exists():
        args.zip_out.unlink()
    shutil.make_archive(str(args.zip_out.with_suffix("")), "zip", output_root)
    print(json.dumps({"files": len(files), "components": len(result["deduplication"]["components"]), "zip": str(args.zip_out)}, indent=2))


if __name__ == "__main__":
    main()
