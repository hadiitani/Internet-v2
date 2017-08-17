var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIO = require("forecastio");

var app = express();
var weather = new ForecastIO("233bb0c2eba6077a7cf3c39fa8a49a25");

var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

var viewPath = path.resolve(__dirname, "views");
app.set("views", viewPath);
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);

    if (!location.zipcode) {
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    weather.forecast(latitude, longitude, function(err, data) {
        if (err) {
            next();
            return;
        }

        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });
});

app.use(function(req, res) {
    res.status(404).render("404");
});

app.listen(3000);