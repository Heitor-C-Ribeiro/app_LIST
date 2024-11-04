const { select } = require ('@inquirer/prompts')

const start = async() => {

    while(true){
       
        const opcao = await select({
            message: "menu >",
            choices: [
                {
                name: "Cadastrar Meta",
                value:"cadastrar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ],

        })

        switch(opcao) {
            case "cadastrar":
                console.log("vamos cadastrar")
                break
            case "listar":
                console.log("vamos listar")
                break
            case "sair":
                return
        }
    }
}