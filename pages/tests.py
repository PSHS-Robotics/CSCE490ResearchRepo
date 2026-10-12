from django.test import TestCase, override_settings
from django.urls import reverse


class HomePageTests(TestCase):
    def test_home_page_loads(self):
        response = self.client.get(reverse('pages:home'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Find your next')
        self.assertContains(response, 'The collection')
        self.assertContains(response, 'Books to explore')
        self.assertContains(response, 'Connect your Google Maps API key')
        self.assertContains(response, 'name="latitude"')
        self.assertContains(response, 'name="longitude"')
        self.assertContains(response, 'Move map pin')

    @override_settings(GOOGLE_MAPS_API_KEY='test-map-key')
    def test_map_api_is_loaded_when_key_is_configured(self):
        response = self.client.get(reverse('pages:home'))

        self.assertContains(response, 'pages/maps.js')
        self.assertContains(response, 'data-api-key="test-map-key"')
        self.assertContains(response, 'test-map-key')

    def test_unconfigured_key_does_not_render_an_example_api_key(self):
        response = self.client.get(reverse('pages:home'))

        self.assertNotContains(response, 'AIzaSy')
