import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html_path = root / "index.html"
uri_path = root / "src" / "assets" / "Logos" / "loaderLogoUri.js"

content = uri_path.read_text(encoding="utf-8")
uri = re.search(r"export const LOADER_LOGO_URI = '(.+?)';", content, re.DOTALL).group(1)

splash = f"""    <div id="initial-loader" role="status" aria-label="Loading" style="position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1c1c1c">
      <img src="{uri}" alt="EDO" width="72" height="72" decoding="sync" fetchpriority="high" style="width:4rem;height:4rem;object-fit:contain;filter:brightness(0) invert(1);opacity:.9" />
      <p style="margin-top:1.5rem;font-family:Georgia,serif;color:rgba(232,228,221,.8);font-size:.875rem;letter-spacing:.25em;text-transform:uppercase">EDO</p>
    </div>
"""

html = html_path.read_text(encoding="utf-8")
if 'id="initial-loader"' not in html:
    html = html.replace('<div id="root"></div>', splash + '    <div id="root"></div>')
    html_path.write_text(html, encoding="utf-8")
    print("index.html updated")
else:
    print("initial-loader already present")
