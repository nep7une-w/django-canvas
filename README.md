# Django Canvas Playground

A small Django project that exposes a single-page canvas playground. Users can draw with the mouse or touch, switch between pen and eraser, fill the canvas with a color, clear it, and download the artwork as a PNG image.

## Prerequisites

- Python 3.10+
- pip / venv (recommended)

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Apply the initial migrations (creates the SQLite database used by Django's admin/auth scaffolding):

```bash
python manage.py migrate
```

## Run the development server

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/ to use the canvas app. The toolbar lets you pick a color, brush width, toggle between tools, clear the canvas, fill it, or download your drawing as a PNG.

## Project structure

```
.
├── canvas_app/        # Django app containing views/templates/static assets
├── canvas_site/       # Project settings and URL routing
├── manage.py          # Django management utility
├── requirements.txt   # Python dependencies
└── README.md
```

Because this is a standard Django project you can use any additional Django tooling, settings, or deployment steps as needed.
