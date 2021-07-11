const db = require('quick.db');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function AddFruta() {
    console.clear();
    rl.question('Qual o nome da fruta que deseja adionar ? ', async (resposta) => {
        let nome = resposta.replace(/\n/, "").replace(/\r/, "").toLowerCase();
        if (await db.get(`frutas.${nome}`) != null) {
            console.log('Essa fruta ja existe em nosso banco de dados.')
            await sleep(2500);
            Menu();
        } else {
            rl.question(`Qual a quantidade que deseja adicionar dessa fruta? `, async (resposta) => {
                let quantidade = resposta.replace(/\n/, "").replace(/\r/, "");
                if (!isNaN(parseFloat(quantidade)) && isFinite(quantidade)) {
                    rl.question(`Qual o preço dessa fruta? `, async (resposta) => {
                        let valor = resposta.replace(/\n/, "").replace(/\r/, "");
                        if (!isNaN(parseFloat(quantidade)) && isFinite(quantidade)) {
                            await db.set(`frutas.${nome}`, {
                                "quantidade": parseFloat(quantidade),
                                "valor": parseFloat(valor),
                                "nome": nome
                            });
                            console.log('Fruta adicionada com sucesso.');
                            await sleep(2500);
                            Menu();
                        } else {
                            console.log('A quantidade deve ser inserida como numero.');
                            await sleep(2500);
                            Menu();
                        }
                    })
                } else {
                    console.log('A quantidade deve ser inserida como numero.');
                    await sleep(2500);
                    Menu();
                }
            })
        }
    })
}

async function AddQuantidade() {
    console.clear();
    rl.question('Qual nome da fruta que deseja adicionar ? ', async (resposta) => {
        let nome = resposta.replace(/\n/, "").replace(/\r/, "").toLowerCase();
        if (await db.get(`frutas.${nome}`) == null) {
            console.log('Essa fruta não existe');
            await sleep(2500);
            Menu();
        } else {
            rl.question('Qual a quantidade que deseja adicionar ? ', async (resposta) => {
                let qtd = resposta.replace(/\n/, "").replace(/\r/, "").toLowerCase();
                if (!isNaN(parseFloat(qtd)) && isFinite(qtd)) {
                    await db.add(`frutas.${nome}.quantidade`, qtd);
                    console.log('Quantidade adicionado');
                    await sleep(2000);
                    Menu();
                } else {
                    console.log('Apenas numeros podem ser adicionado');
                    await sleep(2500);
                    Menu();
                }
            })
        }
    })
}

async function Subtrair() {
    console.clear();
    rl.question('Qual nome da fruta que deseja remover ? ', async (resposta) => {
        let nome = resposta.replace(/\n/, "").replace(/\r/, "").toLowerCase();
        if (await db.get(`frutas.${nome}`) == null) {
            console.log('Essa fruta não existe');
            await sleep(2500);
            Menu();
        } else {
            rl.question('Qual a quantidade que deseja remover ? ', async (resposta) => {
                let qtd = resposta.replace(/\n/, "").replace(/\r/, "").toLowerCase();
                if (!isNaN(parseFloat(qtd)) && isFinite(qtd)) {
                    let fqtd = await db.get(`frutas.${nome}.quantidade`);
                    fqtd = fqtd - qtd;
                    if (fqtd > -1) {
                        await db.subtract(`frutas.${nome}.quantidade`, qtd);
                        console.log('Quantidade removida');
                        await sleep(2000);
                        Menu();
                    } else {
                        console.log('Quantidade removida');
                        await sleep(2000);
                        Menu();
                    }
                } else {
                    console.log('Apenas numeros podem ser removido');
                    await sleep(2500);
                    Menu();
                }
            })
        }
    })
}

async function Listar() {
    if (await db.get('frutas') != null) {
        let jsonString = JSON.stringify(await db.get('frutas'));
        let frutas = JSON.parse(jsonString);
        for (var f in frutas) {
            console.log(`---------------------`);
            console.log(`Fruta: ${frutas[f].nome}`);
            console.log(`Quantidade: ${frutas[f].quantidade}`);
            console.log(`Valor: ${frutas[f].valor}`);
        }
        console.log(`---------------------`);
        rl.question('Digite qualquer coisa para voltar ao menu: ', (resoista) => {
            Menu();
        })
    } else {
        console.clear();
        console.log('Ainda não possui nenhuma fruta no banco de dados');
        await sleep(2500);
        Menu();
    }
}

async function Menu() {
    console.clear();
    console.log('Escolha a opção que deseja utilizar:');
    console.log('[1] Adicionar uma nova fruta.');
    console.log('[2] Adicionar quantidade.');
    console.log('[3] Subtrair quantidade.');
    console.log('[4] Listar estoque.');
    console.log('[5] Sair do sistema.');
    rl.question('Digite o numero da função deseja: ', async (answer) => {
        let res = answer;
        switch (res) {
            case '1':
                await AddFruta();
                break;
            case '2':
                await AddQuantidade();
                break;
            case '3':
                await Subtrair();
                break;
            case '4':
                await Listar();
                break;
            case '5':
                console.log('Obrigado por usar o nosso sistema.');
                await sleep(2500);
                process.exit();
                break;
            default:
                console.log('Entrade invalida');
                await sleep(2000);
                break;
        }
    });
};

Menu();
