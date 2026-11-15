# Relic Finder

Static site. Models/textures are fetched, so serve over HTTP (file:// will not work):

    python3 -m http.server 8000

then open http://localhost:8000

Scripts are classic (non-module) and share globals, so the load order in index.html matters.
