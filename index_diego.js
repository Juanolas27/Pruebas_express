const express = require('express')
const app = express()
const morgan = require('morgan')


app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const dotenv = require("dotenv")
dotenv.config()

const mysql = require('mysql2')
let conexion

try {
    conexion = mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME
    })
} catch(error){
    console.log("Error al conectar a la base de datos")
}



const cons_select = "SELECT * FROM lista_prod"




app.get('/', (req, res) => {
    res.send("Bienvenido a la página completa")
})

app.get('/productos', (req, res) => {
    conexion.query("SELECT * FROM lista_prod",
    (error, result) => {
        if (error){
            console.log(error)
        }
        res.status(200).json(result)
    })
})

app.post('/productos', (req, res) => {
    const {nombre, precio} = req.body
    conexion.query("INSERT INTO lista_prod (nombre, precio) VALUES (?,?)", [nombre, precio],
    (error, results) => {
        if(error){
            console.log(error)
        }
        conexion.query("SELECT * FROM lista_prod", (error, resultado) => {
            if (error) {
                console.log(error)
                return
            }

            res.json({
                "Producto añadido correctamente": results.affectedRows,
                Productos: resultado,
            })
        })
    })
})


app.delete('/productos/:id', (req, res) => {
    const id = req.params.id
    conexion.query("DELETE FROM lista_prod WHERE id = ?", [id],
    (error, results) => {
        if (error){
            console.log(error)
        }
        conexion.query("SELECT * FROM lista_prod", 
        (error, resultado) => {
            if (error) {
                console.log(error)
                return
            }
            res.json({
                "Producto eliminado correctamente": results.affectedRows,
                Productos: resultado
            })
        })
    })
})


// PRIMERA PRUBEA DE PUT

// app.put('/productos/:id', (req, res) => {
//     const id = req.params.id
//     const { nombre, precio } = req.body

//     conexion.query("UPDATE lista_prod SET nombre = ?, precio = ? WHERE id = ?", [nombre, precio, id],
//     (error, results) => {
//         if (error) {
//             console.log(error)
//             return
//         }
//         conexion.query(cons_select, 
//         (error, resultado) => {
//             if (error) {
//                 console.log(error)
//                 return
//             }
//             res.json({
//                 "Producto modificado correctamente": results.affectedRows,
//                 Productos: resultado
//             })
//         })
//     })
// })


// SEGUNDA PRUEBA DE PUT SIN OPTIMIZAR

app.put('/productos/:id/:mod_op', (req, res) => {
    const id = req.params.id
    const mod_op = req.params.mod_op
    
    if ( parseInt(mod_op) === 1 ){
        const nombre = req.body.nombre
        conexion.query("UPDATE lista_prod SET nombre = ? WHERE id = ?", [nombre, id],
        (error, results) => {
            if (error) {
                console.log(error)
                return
            }
            conexion.query(cons_select, (error, resultado) => {
                if (error) {
                    console.log("Error: ", error)
                    return
                }
                res.json({
                    "Producto modificado correctamente": results.affectedRows,
                    Productos: resultado
                })
            })
        })
    } else if ( parseInt(mod_op) === 2 ){
        const precio = req.body.precio
        conexion.query("UPDATE lista_prod SET precio = ? WHERE id = ?", [precio, id],
        ( error, results ) => {
            if (error) {
                console.log("Error: ", error)
                return
            }
            conexion.query(cons_select, (error, resultado) => {
                if ( error ){
                    console.log("Error: ", error)
                    return
                }
                res.json({
                    "Producto modificado correctamente": results.affectedRows,
                    Productos: resultado
                })
            })
        })
    } else if ( parseInt(mod_op) === 3 ){
        const { nombre, precio } = req.body
        conexion.query("UPDATE lista_prod SET nombre = ?, precio = ? WHERE id = ?", [nombre, precio, id],
        ( error, results ) => {
            if (error) {
                console.log("Error: ", error)
                return
            }
            conexion.query(cons_select, (error, resultado) => {
                if ( error ){
                    console.log("Error: ", error)
                    return
                }
                res.json({
                    "Producto modificado correctamente": results.affectedRows,
                    Productos: resultado
                })
            })
        })
    } else {
        res.json("Si la opcion eleccionada no está entre las 3 opciones permitidas (1, 2, 3), No se va a poder realizar la operacion")
        console.log("opcion no soportada")
        return
    }
})





app.listen(process.env.PORT||3000,() => {
    console.log("Servidor funcionando en el puerto 3000")
})

module.exports = app
