"""MkDocs hooks: serve docs/ written for github.com unchanged."""

import re
import textwrap
from pathlib import Path

from mkdocs.structure.files import File


# GitHub renders markdown in any <details>, md_in_html only in a top-level one:
# a <details> in a list item stays raw. pymdownx.details nests anywhere.
DETAILS = re.compile(
    r"^(?P<indent>[ ]*)<details>\s*<summary>(?P<title>.*?)</summary>[ ]*\n(?P<body>.*?)^[ ]*</details>[ ]*$",
    re.S | re.M)


LIST_ITEM = re.compile(r"[ ]*(?:[-*+]|\d+\.)[ ]")


def _details(match: re.Match) -> str:
    # Indented under a list item: its content, at a multiple of the 2-space
    # list indent. Indented elsewhere: GitHub's leeway, top level.
    previous = match.string[:match.start()].rstrip().rpartition("\n")[2]
    in_list = previous.startswith(" ") or LIST_ITEM.match(previous)
    indent = " " * (len(match["indent"]) // 2 * 2) if in_list else ""
    title = re.sub(r"<[^>]+>|\s+", lambda m: " " if m[0].isspace() else "", match["title"]).strip()
    body = textwrap.indent(textwrap.dedent(match["body"]), indent + "    ")
    return f'\n{indent}??? note "{title.replace(chr(34), chr(39))}"\n\n{body}'


# The development-branch notice of docs/*.md, meaningless on the site itself.
DEV_BANNER = re.compile(r"<!-- dev-banner -->.*?<!-- /dev-banner -->\n?", re.S)


# <picture> follows the OS scheme, Material's toggle only hides #only-light/dark.
PICTURE = re.compile(
    r'<picture>\s*<source media="\(prefers-color-scheme: dark\)"\s+srcset="([^"]+)"\s*/?>\s*'
    r'<img src="([^"]+)"(.*?)/?>\s*</picture>', re.S)


def _local(markdown: str, repo_url: str, site_url: str) -> str:
    # Absolute links to this repo's docs (README.md is also read on HACS)
    # become site-relative.
    for prefix in (f"{repo_url}/blob/main/docs/", f"{repo_url}/tree/main/docs/"):
        markdown = markdown.replace(prefix, "")
    raw = repo_url.replace("https://github.com/", "https://raw.githubusercontent.com/")
    markdown = markdown.replace(f"{raw}/main/docs/", "")
    # The README links to the site (HACS shows it): back to the source pages.
    markdown = re.sub(re.escape(site_url) + r"([\w-]+)/", r"\1.md", markdown)
    return DETAILS.sub(_details, markdown)


def on_files(files, config):
    readme = Path(config.config_file_path).parent / config.extra.get("readme", "README.md")
    content = _local(readme.read_text(encoding="utf-8"), config.repo_url, config.site_url)
    files.append(File.generated(config, "index.md", content=content))
    return files


def on_page_markdown(markdown, page, config, files):
    markdown = DEV_BANNER.sub("", markdown)
    markdown = _local(markdown, config.repo_url, config.site_url).replace("../README.md", "index.md")
    markdown = PICTURE.sub(r'<img src="\2#only-light"\3/><img src="\1#only-dark"\3/>', markdown)
    # Raw HTML paths are not rewritten by MkDocs: a page is served one folder down.
    up = "../" * page.url.count("/")
    return re.sub(r'\b(src|srcset|href)="(?![a-z]+:|/|#|\.\./)', rf'\1="{up}', markdown)
