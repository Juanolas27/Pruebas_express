const express = require('express');
const app = express();
const morgan = require('morgan');
let ejs = require('ejs');
app.use(morgan("dev"));

//motor de plantillas
app.set("view engine", "ejs")
app.set("views",__dirname+"/views")
app.use(express.static(__dirname+"/public"))


app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.post('/', function (req, res) {
    console.log(req.body);
    res.end();
});

app.get('/', function (req, res) {
    res.render("index", { titulo: "Hola amigos de youtube" });
})
app.get('/servicios', function (req, res) {
    res.render("servicios", { TituloServicios: "Soy los servicios" });
})

app.use((req, res, next)=>{
    res.status(404).render(__dirname + "/public/404.html")
})
 
app.listen(3000, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT 3000");
});
