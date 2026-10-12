const mapContainer = document.getElementById('library-map');

if (mapContainer) {
    const apiKey = mapContainer.dataset.apiKey;
    const mapStatus = document.getElementById('map-status');
    const coordinateForm = document.getElementById('coordinate-form');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const coordinateMessage = document.getElementById('coordinate-message');
    let map;
    let marker;
    let initializationTimeout;

    function showMapError(message) {
        if (!mapContainer) {
            return;
        }

        let errorMessage = document.getElementById('map-error');
        if (!errorMessage) {
            errorMessage = document.createElement('p');
            errorMessage.id = 'map-error';
            errorMessage.className = 'map-status';
            errorMessage.setAttribute('role', 'alert');
            mapContainer.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    window.initLibraryMap = function () {
        window.clearTimeout(initializationTimeout);
        const center = {
            lat: Number(mapContainer.dataset.lat),
            lng: Number(mapContainer.dataset.lng),
        };

        if (!window.google || !google.maps) {
            showMapError('Google Maps loaded without its map library. Check the Maps JavaScript API settings and browser console.');
            return;
        }

        if (mapStatus) {
            mapStatus.remove();
        }

        try {
            map = new google.maps.Map(mapContainer, {
                center,
                zoom: Number(mapContainer.dataset.zoom),
                mapTypeControl: false,
                streetViewControl: false,
            });

            marker = new google.maps.Marker({
                map,
                position: center,
                title: 'Local Library (placeholder location)',
            });
        } catch (error) {
            showMapError('Google Maps could not be initialized. Check the browser console for details.');
            console.error('Google Maps initialization failed:', error);
        }
    };

    coordinateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        coordinateMessage.textContent = '';

        if (!map || !marker) {
            coordinateMessage.textContent = 'The map is not ready yet. Please wait and try again.';
            return;
        }

        const lat = Number(latitudeInput.value);
        const lng = Number(longitudeInput.value);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            coordinateMessage.textContent = 'Enter a latitude from -90 to 90 and longitude from -180 to 180.';
            return;
        }

        const position = { lat, lng };
        marker.setPosition(position);
        map.panTo(position);
        coordinateMessage.textContent = `Map pin moved to ${lat}, ${lng}.`;
    });

    window.gm_authFailure = function () {
        window.clearTimeout(initializationTimeout);
        showMapError('Google rejected the Maps API key. Check that it is valid, billing is enabled, Maps JavaScript API is enabled, and your website referrer is allowed.');
    };

    window.showMapLoadError = function () {
        window.clearTimeout(initializationTimeout);
        if (mapStatus) {
            mapStatus.textContent = 'The Google Maps script could not be downloaded. Check your internet connection, content blockers, and browser console.';
        }
    };

    const script = document.createElement('script');
    const mapsUrl = new URL('https://maps.googleapis.com/maps/api/js');
    mapsUrl.search = new URLSearchParams({
        key: apiKey,
        callback: 'initLibraryMap',
        v: 'weekly',
    }).toString();
    script.src = mapsUrl.toString();
    script.async = true;
    script.onerror = window.showMapLoadError;
    document.head.appendChild(script);

    initializationTimeout = window.setTimeout(() => {
        if (!map) {
            showMapError('Google Maps did not finish loading. Check the browser console for API key, billing, API enablement, or referrer restriction errors.');
        }
    }, 12000);
}
