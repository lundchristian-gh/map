# README

### Guide: Run Locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
npx tsc
python3 src/app.py
```

### Guide: Run Local Container

```bash
docker build -t map_app .
docker run -d -p 5000:5000 map_app
```

### Guide: Deploy

```bash

```

### Cloud Solution

-   Render
-   Fly

### MapBox Docs

-   [Map](https://docs.mapbox.com/mapbox-gl-js/api/map/)
-   [Sky](https://docs.mapbox.com/mapbox-gl-js/guides/globe/)
-   [3D](https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/)
-   [Popup](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup)
-   [Marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker)
