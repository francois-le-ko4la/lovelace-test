"""MkDocs hooks: serve docs/ written for github.com unchanged."""

import re
from pathlib import Path

from mkdocs.structure.files import File


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
    # GitHub renders markdown inside <details>; md_in_html needs the opt-in.
    return markdown.replace("<details>", '<details markdown="1">')


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
