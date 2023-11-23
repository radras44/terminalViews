const {App,View,ActionOption,input} = require("./app")

const secondaryViewOptions = [
    new ActionOption({
        name : "buscar",action : () => {console.log("buscando...")}
    }),
    new ActionOption({
        name : "solicitar datos", action : async() => {
            const password = await input("ingrese su contraseña")
            if(password === "123"){
                console.log("contraseña correcta")
            }else{
                console.log("contraseña incorrecta")
            }
        }
    }),
    new ActionOption({
        name : "salir",
        action : () => {process.exit(0)}
    })
]

const secondaryView = new View({
    head : "salida",
    options : secondaryViewOptions
})

const mainViewoptions = [
    new ActionOption({
        name : "ingresar",
        action : async(parent) => {
            const edad = await input("ingresa tu edad")
            console.log(edad)
            const nombre = await input("ingrese su nombre")
            console.log(nombre)
            parent.setView(secondaryView)
        }
    })
]

const mainView = new View({
    head : "app de prueba",
    options : mainViewoptions
})
function run () {
    new App(mainView)
}

run()