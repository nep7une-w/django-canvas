from django.test import TestCase
from django.urls import reverse


class CanvasHomeViewTests(TestCase):
    def test_home_page_renders_successfully(self):
        response = self.client.get(reverse("canvas_app:home"))

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "canvas_app/canvas.html")

    def test_home_page_contains_canvas_controls(self):
        response = self.client.get(reverse("canvas_app:home"))

        self.assertContains(response, 'id="aspect"')
        self.assertContains(response, 'option value="16:9" selected')
        self.assertContains(response, 'id="text-controls" class="is-hidden"')
        self.assertContains(response, 'button data-tool="text"')
        self.assertContains(response, 'canvas id="preview"')
