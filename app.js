const chalk = require("chalk")
const keypress = require("keypress")

class App {
    constructor(view) {
        this.current = 0;
        this.config();
        this.setView(view);
        this.previous = null
    }

    setView(view) {
        if (!view instanceof View) { "view debe ser una instancia de View" }
        this.previous = this.view
        this.view = view
        this.show()
    }

    show() {
        console.clear()
        if(!process.stdin.eventNames().includes("keypress")){
            this.runSelectListener()
        }
        if (this.view.head) {
            console.log(this.view.head)
        }
        this.view.options.forEach((option, index) => {
            if (index == this.current) {
                console.log("-", chalk.cyan(option.label));
            } else {
                console.log("-", option.label);
            }
        });
        if (this.view.footer) {
            console.log(this.view.footer)
        }
    }

    runSelectListener() {
        process.stdin.resume()
        process.stdin.on("keypress", (ch, key) => {
            if (key) {
                if (key.ctrl && key.name == "c") {
                    this.exit()
                }
                if (key.name.toLowerCase() == "up") {
                    this.up()
                }
                if (key.name.toLowerCase() == "down") {
                    this.down()
                }
                if (key.name.toLowerCase() == "return") {
                    this.execute()
                }
            }
        })
    }

    up() {
        if (this.current > 0) {
            this.current--
        }
        this.show()
    }

    down() {
        if (this.current < this.view.options.length - 1) {
            this.current++
        }
        this.show()
    }

    exit() {
        process.exit(0)
    }

    execute() {
        const option = this.view.options[this.current]
        if (option instanceof ActionOption) {
            option.action(this)
        }
    }

    back() {
        if (!this.previous) { throw new Error("no existe una vista previa") }
        this.current = 0
        this.view = this.previous
        this.show()
    }

    config() {
        process.stdin.setRawMode(true);
        keypress(process.stdin);
    }

    input(question) {
        return new Promise((resolve) => {
            function listener(ch, key) {
                if (ch) {
                    data += ch
                    process.stdout.write(ch)
                }
                if (key && key.name == "return") {
                    process.stdin.removeAllListeners("keypress")
                    process.stdin.pause()
                    resolve(data)
                }
            }
            let data = ""
            process.stdout.write(question)
            process.stdin.resume()
            process.stdin.removeAllListeners("keypress")
            process.stdin.on("keypress", listener)
        })
    }
}

class View {
    constructor({ head, options, footer }) {
        if (!options) {
            throw new Error("la propiedad options es obligatoria")
        }
        this.head = head || ""
        this.setOptions(options)
        this.footer = footer || ""
    }

    setOptions(options) {
        if (!Array.isArray(options)) { throw new Error("options debe ser un array") }
        if (!options.length > 0) { throw new Error("options.length debe ser mayor a 0") }
        this.options = options
    }
}

class ActionOption {
    constructor({ label, action }) {
        if (!label || !action) {
            throw new Error("falta la propiedad 'label' o 'action' en la clase ActionOption")
        }
        this.label = label
        this.action = action
    }
}

module.exports = {
    App,
    ActionOption,
    View
}

