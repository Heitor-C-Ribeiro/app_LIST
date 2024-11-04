
const { select, input, checkbox } = require ("@inquirer/prompts")

const fs = require("fs").promises

let mensagem = "Bem vindo";


 let metas

 const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
 }

 const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
 }
 
const registerMeta = async() => {
    const meta = await input({message:"->"})

        if(meta.length == 0) {
            mensagem = "VAZIA"
            return
        }
    metas.push(
        {value:meta, checked: false}
) 
mensagem = "cadastrado"
}

const listMetas = async () => {
    if(metas.length == 0) {
        mensagem = "não há metas"
        return
    }
    const respostas = await checkbox({
        message:"mark or desmark,press enter to leave",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if (respostas.length == 0) {
            mensagem = "nada selecionado"
            return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    
    mensagem = "meta(s)concluída(s)"
}

const metasRealizadas = async() => {
    if(metas.length == 0) {
        mensagem = "não há metas"
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    
    if(realizadas.length == 0) {
        mensagem = "sem metas realizadas"
        return
    }
    await select({
        message: "Metas realizadas" +  realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async() => {
    if(metas.length == 0) {
        mensagem = "não há metas"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    if(abertas.length == 0) {
        mensagem = "não existem metas abertas :)"
        return
    }
    
    await select({
        message:"Metas Abertas" +  abertas.length,
        choices:[...abertas]
    })
}

const deletarMetas = async() => {
    if(metas.length == 0) {
        mensagem = "não há metas"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked:false}
    })
    const itemsADeletar= await checkbox({
        message:"mark to delete",
        choices: [...metasDesmarcadas],
        instructions: false,
    })
    if(itemsADeletar == 0) {
        mensagem = "nenhum item selecionado!"
        return;
    }
    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensagem = "Deletado com sucesso!"
}

mostrarMensagens = () => {
    console.clear()
    if(mensagem != "") {
        console.log(mensagem)
        console.log("")

    }
}

const start = async () => {
    await carregarMetas()

    while(true){
       
        mostrarMensagens()
        await salvarMetas()

    
        const opcao = await select({
            message: "menu >",
            choices: [
                {
                name: "Cadastrar Meta",
                value:"cadastrar"
                },
                {
                name: "listar metas",
                value: "listar"
                },
                {
                    name: "metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "metas abertas",
                    value: "abertas"
                },    
                {
                    name: "deletar metas",
                    value: "deletar"
                },    
                {
                    name: "Sair",
                    value: "sair"
                }
            ],

        })

        switch(opcao) {
            case "cadastrar":
                await registerMeta()
                break
            case "listar":
                await listMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("FECHADO!!!")
                return
        }
    }
}
start()





