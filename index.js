const express = require("express")
const server = express()
const bodyparser = require("body-parser");
const axios = require('axios');

server.use(express.static("website"))

//server.use(bodyparser.urlencoded({ extended: false }))
server.use(bodyparser.json());

server.get("/", (req, res) => {
    res.redirect("/spa.html")
})

let restaurants = [
    {
        "id":       "lula",
        "name":     "LuLa am Markt",
        "subtitle": "Café",
        "img":      "https://lh5.googleusercontent.com/p/AF1QipMHUGKUTwadfNz-tuMr4OSbuH4ng5IKrqQoLk7w=w284-h160-k-no",
        "address":  "Lauterstraße 14, 12159 Berlin",
        "url":      "http://lula-berlin.de",
        "tel":      "030 12345678",
        "location": ["52.4723157", "13.3350244"]
    },
    {
        "id":       "kawa",
        "name":     "KAWA Cafe-Deli",
        "subtitle": "Veganes Restaurant",
        "img":      "https://lh5.googleusercontent.com/p/AF1QipOfkiCHPK6KAIMyrGtm-184QCauoIwmO6sTiRPK=w213-h160-k-no",
        "address":  "Moltkestraße 1, 12203 Berlin",
        "url":      "http://www.cafekawa.de",
        "tel":      "030 12345678",
        "location": ["52.4470755", "13.3061425"]
    },
    {
        "id":       "curry36",
        "name":     "Curry 36",
        "subtitle": "Snack Bar",
        "img":      "https://lh5.googleusercontent.com/p/AF1QipOTqap7-04d-rfhnlI8EgOvXWX_Z73ZE2B3ts2B=w213-h160-k-no",
        "address":  "Mehringdamm 36, 10961 Berlin",
        "url":      "http://www.curry36.de",
        "tel":      "030 12345678",
        "location": ["52.4935584", "13.3877282"]
    }
];

server.get("/restaurants", (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    res.send(restaurants)
});

server.post("/restaurants", (req, res, next) => {
    let { name, subtitle, address, img, url, tel } = req.body;

    res.setHeader("Content-Type", "application/json");
    let query = encodeURIComponent(address);

    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${query}&format=json`)
    .then(response => {
        if(response.data.length < 1) return Promise.reject({
            message: "Adresse ist falsch"
        })

        data = response.data[0]
        
        if(!data.lat || !data.lon) return Promise.reject({
            message: "Keine Koordinaten vorhanden"
        })
        
        let restaurant = {
            id: name.toLowerCase().split(" ").join("-").split(".").join(""),
            name: name, 
            subtitle: subtitle,
            address: address,
            img: img || "https://upload.wikimedia.org/wikipedia/commons/b/b5/MeterCat_no_photo.jpg",
            url: url,
            tel: tel,
            location: [data.lat, data.lon]
        }
        restaurants.push(restaurant)
        
        res.send(restaurant)
    })
    .catch(err => {
        res.status(400);
        res.send({
            message: err.message
        })
    })
});

server.delete("/restaurants/:id", (req, res, next) => {
    let id = req.params.id;
    let index = restaurants.findIndex( el => el.id == id);
    if(index > -1){
        restaurants.splice(index, 1);
        res.status(204)
        res.send();
    }
    else { 
        res.status(400)
        res.send();
    }
});

let port = 8080
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});