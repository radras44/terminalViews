
# r-terminal-view

## instalacion

```npm install r-terminal-view```

## Uso

Este Modulo funciona a travez de vistas y acciones

Para iniciar el programa debe hacerse uso de la clase App, pueden renombrarla como quieran

```javascript 
const {App} = require("r-terminal-view")

new App()
```

se debera crear una vista inicia, la clase View tiene 3 argumentos
- header (texto que se pondra como encabezado)
- options
- footer (texto que se pondra como pie de pagina)

```javascript
const {App,View} = require("r-terminal-view")

const mainView = new View({
    header : "my header",
    options : [],
    footer : "my footer",
})

new App(mainView)
```

finalmente deberemos crear las opciones, que no son nada mas que un objeto con un nombre y una funcion.

```javascript
const {App,View,input,ActionOption} = require("r-terminal-view")

const mainViewOptions = [
    new ActionOption({
        name : "print hello world",
        action : () => {
            console.log("hello world")
            }
    }),
    new ActionOption({
        name : "terminar proceso",
        action : () => {
            process.exit(0)
        }
    })
]

const mainView = new View({
    header : "my header",
    options : mainViewOptions,
    footer : "my footer",
})

new App(mainView)
```

## Input

puedes importar la funcion input si necesitas solicitar informacion el usuario por escrito.

```javascript
const {App,View,input,ActionOption} = require("r-terminal-view")

const mainViewOptions = [
    new ActionOption({
        name : "ingresar contraseña",
        action : async() => {
            const userInput = await inputAction("Ingrese la contraseña")
        
        if(userInput == "123"){
            console.log("contraseña correcto")
        }else{
            //alguna otra accion, para obtener ideas vea la opcion parentView
        }
        }
    })
]
```


## parentView

todas las funciones en el atributo "action" de la clase ActionOptions reciben el objeto View padre como argumento, esto permite hacer uso de varias funciones de la clase View como:

### reload(header,footer)

Este metodo recarga la vista actual, pueden cambiarse el header y el footer, por ejemplo para dar un mensaje de error en caso de que el usuario se equivoque con alguna respuesta o genere algun tipo de error al escribir alguna palabra y recargar la vista actual.

```javascript
const {App,View,input,ActionOption} = require("r-terminal-view")

const mainViewOptions = [
    new ActionOption({
        name : "ingresar contraseña",
        action : async(parentVIew) => {
            const userInput = await inputAction("Ingrese la contraseña")
        
        if(userInput == "123"){
            console.log("contraseña correcto")
        }else{
            //uso de reload
           parentView.reload("contraseña incorrecta")
        }
        }
    })
]
```

### back(header,footer)

Este metodo es similar, solo que no te envia de vuelta la vista actual, te envia a la vista anterior, esto significa que tiene que existir una vista anterior, en caso contrario se generara un error.

PD: tambien recibi los argumentos header y footer por si se quiere cambiar alguno

```javascript
const {App,View,input,ActionOption} = require("r-terminal-view")

const mainViewOptions = [
    new ActionOption({
        name : "imprimir hello world",
        action : () => {console.log("hello world")}
    }),
    new ActionOption({
        name : "volver",
        action : (parentView) => {
            //usar back
            parentView.back("este es un nuevo headerer")
        }
    })
]
```

### setView(view)

Este es un metodo muy importante ya que nos permitira cambiar de una vista a otra, o cambiar de vista como resultado de una autenticacion o accion

```javascript
const {App,View,ActionOption} = require("r-terminal-view")

const secondViewOptions = [
    new ActionOption({
        name : "imprimir hello world",
        action : () => {
            console.log("hello world")
        }
    }),
    new ActionOption({
        name : "volver",
        action : (parentView) => {
            parentView.back()
        }
    })
]

const secondView = new View({
    header : "esta es una vista secundaria",
    options : secondViewOptions
})

const mainOptions = [
    new ActionOption({
        name : "ir a la segunda vista",
        action : (parentView) => {
            parentView.setView(secondView)
        }
    }),
    new ActionOption({
        name : "salir",
        action : (parentView) => {
            parentView.close()
        }
    })
]

const mainView = new View({
    header : "my header",
    options : mainOptions
})

new App(mainView)
```
