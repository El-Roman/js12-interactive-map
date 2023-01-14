const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},

    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 11,
        });
        // add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '13',
        }).addTo(this.map)
        // location marker
        const marker = L.marker(this.coordinates)
        marker.addTo(this.map).bindPopup('<p1><b>This where I be</b><br></p1>').openPopup()
    },

    // business locations
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
                .bindPopup(`<p1>${this.businesses[i].name}</p1>`).addTo(this.map)
        }
    },
}

// get coordinates
async function getCoords() {
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}

//foursquare
async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3ATzZbmcGhdeFafr73wZcnJ+LlN6bK+4dh19a7ClS4u8='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}

function getBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return location
    })
    return businesses
}



window.onload = async () => {
    const coords = await getCoords()
    myMap.coordinates = coords
    myMap.buildMap()
}


document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await getFoursquare(business)
    myMap.businesses = getBusinesses(data)
    myMap.addMarkers()
})

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(elMap);

// // get user's coord

// // async function getCoords() {
// //     pos = await new Promise((resolve, reject) => {
// //         navigator.geolocation.getCurrentPosition(resolve, reject)
// //     })
// //     return [pos.coords.latitude, pos.coords.longitude]
// // }

// // console.log(getCoords())

// if (!navigator.geolocation) {
//     console.log("Your browser doesn't support geolocation")
// } else {
//     navigator.geolocation.getCurrentPosition(getPosition)
// }


// function getPosition(position) {
//     var lat = position.coords.latitude
//     var long = position.coords.longitude
//     var accuracy = position.coords.accuracy

//     var marker = L.marker([lat, long]).addTo(elMap).bindPopup('<p1><b>This where I be at</b><br></p1>').openPopup()
// }


// // async function placeSearch() {
// //     try {
// //         const searchParams = new URLSearchParams({
// //             query: 'coffee',
// //             ll: '41.8781,-87.6298',
// //             open_now: 'true',
// //             sort: 'DISTANCE'
// //         });
// //         const results = await fetch(
// //             `https://api.foursquare.com/v3/places/search?${searchParams}`,
// //             {
// //                 method: 'GET',
// //                 headers: {
// //                     Accept: 'application/json',
// //                     Authorization: 'fsq3Qf2uHKyPkifnh2Ygjll9b/Kl4c32v+ai1U0sLpNZU0Q=',
// //                 }
// //             }
// //         );
// //         const data = await results.json();
// //         return data;
// //     } catch (err) {
// //         console.error(err);
// //     }
// // }



// async function getFoursquare(business) {
//     const options = {
//         method: 'GET',
//         headers: {
//             Accept: 'application/json',
//             Authorization: 'fsq3Qf2uHKyPkifnh2Ygjll9b/Kl4c32v+ai1U0sLpNZU0Q='
//         }
//     }
//     let limit = 5
//     var lat = elMap.coordinates[0]
//     var long = elMap.coordinates[1]
//     let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${long}`, options)
//     let data = await response.text()
//     let parsedData = JSON.parse(data)
//     let businesses = parsedData.results
//     return businesses
// }


// function processBusinesses(data) {
//     let businesses = data.map((element) => {
//         let location = {
//             name: element.name,
//             lat: element.geocodes.main.latitude,
//             long: element.geocodes.main.longitude
//         };
//         return location
//     })
//     return businesses
// }











// document.getElementById('submit').addEventListener('click', async (event) => {
//     event.preventDefault()
//     let business = document.getElementById('business').value
//     let data = await getFoursquare(business)
//     elMap.businesses = processBusinesses(data)
//     elMap.addMarkers()
// })


// // L.marker([36.2868413, -115.2049962]).addTo(elMap)
// //     .bindPopup('Where I be at.')
// //     .openPopup();