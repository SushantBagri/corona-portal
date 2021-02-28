
function initialize() {
    let input = document.getElementById('search_input');
    let options = {
        types: ['address'],
        componentRestrictions: {
            country: 'IND'
        }
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        let place = autocomplete.getPlace();
        for (let i = 0; i < place.address_components.length; i++) {
            for (let j = 0; j < place.address_components[i].types.length; j++) {
                if (place.address_components[i].types[j] == "postal_code") {
                    document.getElementById('postal_code').value = place.address_components[i].long_name;

                }
            }
        }
    })
}
google.maps.event.addDomListener(window, "load", initialize);