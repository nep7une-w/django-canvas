from __future__ import annotations

from django.shortcuts import render


def home(request):
    """Render the canvas playground."""
    return render(
        request,
        "canvas_app/canvas.html",
        {
            "tools": [
                {"name": "Pen", "mode": "draw"},
                {"name": "Eraser", "mode": "erase"},
                {"name": "Fill", "mode": "fill"},
            ]
        },
    )
