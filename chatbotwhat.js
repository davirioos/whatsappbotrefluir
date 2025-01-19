const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Configuração do Express
const app = express();
const port = process.env.PORT || 3000; // Porta padrão

// Novo diretório para autenticação
const authPath = path.join(__dirname, '.wwebjs_auth');
if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath);
}

// Configuração do cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});


// Função para enviar mensagem pelo WhatsApp
async function sendWhatsAppMessage(to, ...messages) {
    try {
        for (const message of messages) {
            await client.sendMessage(to, message);
        }
        console.log('Mensagens enviadas com sucesso pelo WhatsApp!');
    } catch (error) {
        console.error('Erro ao enviar mensagens pelo WhatsApp:', error);
    }
}

// Armazena o estado da conversa para cada contato
let conversaEstado = {};
let timers = {}; // Armazena os temporizadores para cada contato
let debounceTimers = {}; // Armazena temporizadores de debounce para cada contato
const debounceDelay = 3000; // 3 segundos de delay para debounce

client.on('message', async message => {
    const contato = message.from;
    const texto = message.body.trim();

    // Cancela o temporizador se houver
    if (timers[contato]) {
        clearTimeout(timers[contato]);
    }

    // Verifica o estado da conversa do contato
    let estado = conversaEstado[contato] || 'saudacao';

    let resposta = '';
    let respostadois = '';
    let respostatres = '';
    let respostaquadro = '';
    let respostacinco = '';
    let respostaseis = '';
    let respostasete = '';
    let revendedorlink = '';
    let respostacontinua = '';


    // Debounce para evitar múltiplos envios rápidos
    if (debounceTimers[contato]) {
        clearTimeout(debounceTimers[contato]);
    }

    //Opção para zera condição do cliente e pode volta pro menu inicial.
    if(texto === '0'){
        resposta = "Por favor, escolha uma das opções abaixo para começar:\n\n" +
                    "1. Explorar nossos Produtos\n" +
                    "2. Produtos Personalizados\n" +
                    "3. Informações sobre Divisórias e Instalações\n" +
                    "4. Produtos 3D\n" +
                    "5. Revenda de Produtos\n" +
                    "Para uma experiência rápida, basta digitar o número da opção desejada. Caso queira voltar ao menu principal, digite '0'. Estou aqui para ajudar em cada etapa! 😊";
        estado === 'aguardando'
        conversaEstado[contato] = 'aguardando';
        await sendWhatsAppMessage(contato, resposta );
    }
    else{
        if(estado === 'aguardando'){
            resposta = "Por favor, digite apenas os números apresentados no menu."
            await sendWhatsAppMessage(contato, resposta );   
        }
        
    }

    debounceTimers[contato] = setTimeout(async () => {
        if (estado === 'saudacao') {
            if (texto && texto !== '0') {
                resposta = "Olá! 😊 Eu sou a Lumi, sua assistente virtual aqui na Refluir Personalizados. Estou aqui para te ajudar com tudo o que precisar e tornar sua experiência incrível! 💖";
                respostadois = "Que bom ter você por aqui! Para facilitar, é só escolher uma das opções abaixo e me dizer o número correspondente. Assim, eu te ajudo rapidinho! 🧡\n\n" +
                    "1. Explorar nossos Produtos 🖼️\n" +
                    "2. Produtos Personalizados ✨\n" +
                    "3. Informações sobre Divisórias e Instalações 🔧\n" +
                    "4. Produtos 3D 🖋️\n" +
                    "5. Revenda de Produtos 🤝\n" +
                    "6. Redes Sociais 🌐\n\n" +
                    "Digite o número da opção desejada para continuar. Se precisar voltar ao menu inicial, é só digitar '0'. Estou aqui para te ajudar em cada etapa! 🌟";

                
                conversaEstado[contato] = 'aguardando';
                await sendWhatsAppMessage(contato, resposta, respostadois);

                timers[contato] = setTimeout(async () => {
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                    await sendWhatsAppMessage(contato, lembrete);
                }, 3600000); // 1 hora em milissegundos
            }
        }
        
        
        
        else if (estado === 'aguardando' || estado === "ProdutosPersonalizados" || estado === "modulos") {

            if (texto === '1' && estado === 'aguardando') {
                resposta = "Bem-vindo(a)! 🌟 Que bom te ver por aqui! Explore nossa categoria de Produtos e descubra todos os itens disponíveis, com detalhes sobre tamanhos e preços: \n\n👉 [Acesse nosso catalogo aqui](https://wa.me/c/557191193419)";

                respostadois = "Escolha seus produtos favoritos, adicione ao carrinho 🛒 e envie o pedido diretamente pelo WhatsApp da loja! É simples e rápido. 😉\n\nSe precisar de ajuda, estou aqui para te auxiliar com qualquer dúvida! 😊";

                respostaquadro = "Estamos quase lá! 🖼️ Aguarde um de nossos atendentes para finalizar seu pedido e garantir que tudo fique perfeito. 😊";
                respostaseis = "⏰ **Qual o prazo ideal para a entrega? São 3 dias úteis podendo variar conforme a quantidade (sem contar o sábado e o domingo). Ou seja, só consideramos os dias da semana, de segunda a sexta-feira, para o cálculo** Queremos garantir que seu pedido chegue no momento certo.😊";


                respostatres = "*Caso queira voltar ao Menu Principal, é só digitar '0'. Estou aqui para ajudar sempre que precisar!* 🌟";


                conversaEstado[contato] = 'finalizado';
                
                await sendWhatsAppMessage(contato, resposta, respostadois,respostaquadro, respostaseis, respostatres);
                
                timers[contato] = setTimeout(async () => {
                
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                
                    await sendWhatsAppMessage(contato, lembrete);
                
                }, 3600000); // 1 hora em milissegundos
            }
            
            
            
            
            else if (texto === '2' && estado === 'aguardando' || estado === "ProdutosPersonalizados") {
                // Respostas de parte um dos produtos personalizados
                let resposta = "🎨✨ **Personalize seu produto!** 😍 Temos opções incríveis como *chaveiro*, *porta-celular*, *camisa*, *caneca* e muito mais! Qual item você gostaria de personalizar? Basta digitar o nome do produto que você deseja! 😄\n\nPara voltar ao menu, digite '0'.";
                let respostadois = "🎨✨ **Quer adicionar algo especial?** Se deseja incluir *texto personalizado* ou *um logotipo*, descreva ou envie uma imagem! Faremos tudo com muito carinho. 💖";
                let respostaquadro = "🎨✨ **Quantos você gostaria de encomendar?** Fique à vontade para pedir a quantidade que precisar, estamos aqui para atender suas necessidades! 😄";
                let respostacontinua = "*Para continuar, digite 9 e vamos te ajudar a fazer o pedido!*";

                // Parte dois dos produtos personalizados
                if (texto === "9" && estado === "ProdutosPersonalizados") {
                    respostaquadro = "🚚 **Entrega super prática para você!* A entrega pode ser feita na *estação de metrô* da sua preferência ou, se preferir, você pode retirar diretamente em *Boca da mata, Barragem 300*.\n\nAlém disso, oferecemos a opção de envio via *Uber*, com o custo por conta do cliente. Super rápido e seguro! 😉";
                    respostaseis = "⏰ **Qual o prazo ideal para a entrega? São 3 dias úteis podendo variar conforme a quantidade (sem contar o sábado e o domingo). Ou seja, só consideramos os dias da semana, de segunda a sexta-feira, para o cálculo** Queremos garantir que seu pedido chegue no momento certo.😊";
                    respostasete = "✅ **Pedido Finalizado!** Agora é só aguardar! Um de nossos atendentes entrará em contato em breve para finalizar o seu pedido e garantir que tudo seja feito com qualidade e carinho. Estamos prontos para tornar seus produtos personalizados ainda mais especiais! 🎉";

                    // Atualizando o estado para 'finalizado', aguardando o atendimento
                    conversaEstado[contato] = 'finalizado'; 
                    await sendWhatsAppMessage(contato, respostacinco, respostaseis, respostasete);
                }
                // Envio das mensagens dos produtos personalizados e trocando o status do cliente
                if (estado != "ProdutosPersonalizados") {
                    conversaEstado[contato] = 'ProdutosPersonalizados'
                    await sendWhatsAppMessage(contato,resposta, respostadois, respostaquadro, respostacontinua);
                }
            
                // Caso o cliente demore 1 hora ou mais para responder, envio de lembrete
                timers[contato] = setTimeout(async () => {
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                    await sendWhatsAppMessage(contato, lembrete);
                }, 3600000); // 1 hora em milissegundos
            }
            // Divisorais e Instalação 
            else if (texto === '3' || estado === "modulos" ) {
                let linkmensagem = 'Video de ajuda : https://www.youtube.com/watch?v=_yXdACkMIHI'
                resposta = `📏✨ *Disponibilizamos módulos MDF nos tamanhos 20x20 cm e 40x40 cm.*\n\n😊 Dê uma olhada em todos os nossos modelos e escolha o que melhor atende às suas necessidades em nosso catalogo: [Clique aqui para ver todos os modelos](https://wa.me/c/557191193419).`;
                respostadois = `🔧 **Escolha uma das opções abaixo para prosseguir:**
                1. *Prefere instalar o módulo sozinho?*
                2. *Gostaria de agendar uma instalação com nossos profissionais?**
                3. *Há algo específico que você gostaria de saber sobre nossos módulos ou a instalação?* (Fale com o atendente)

                Digite o número correspondente à sua opção para seguir. 😊`;
                
                if (texto === '1' && estado === "modulos") {
                    const resposta = `
                🛠️ *Guia de Instalação do Módulo MDF:*

                *Materiais Necessários:*
                - Módulos de MDF
                - Parafusos e buchas
                - Furadeira
                - Chave de fenda
                - Nível
                - Fita métrica
                - Lápis

                *Passos de Instalação:*
                1. **Planeje**: Defina a posição e disposição dos módulos na parede.
                2. **Marque**: Utilize o lápis para fazer as marcações no local.
                3. **Fure**: Faça os furos nas marcações com a furadeira.
                4. **Insira**: Coloque as buchas nos furos feitos.
                5. **Fixe**: Coloque os módulos e prenda-os com os parafusos.
                6. **Cheque**: Verifique se os módulos estão nivelados e bem fixados.

                📞 *Qualquer dúvida, estamos à disposição!* Aproveite sua nova divisória! 🎉`;

                    respostatres = "📏 Por gentileza, informe a quantidade de módulos que você deseja para seu projeto.";
                    respostadois = "Se você não tiver certeza sobre a quantidade ou precisar de ajuda, um de nossos atendentes estará disponível para auxiliar. Aguardamos sua confirmação! 😊";
                    
                    await sendWhatsAppMessage(contato,resposta,respostatres,respostadois, linkmensagem)
                    conversaEstado[contato] = 'finalizado';
                }

                // Modulos pro Cliente
                if(texto === '2' && estado === "modulos"){
                    resposta = "Por gentileza, informe apenas a quantidade de módulos que você deseja.";
                    respostadois = "Se você não tiver certeza sobre a quantidade, um atendente entrará em contato para ajudar. Enquanto isso, por favor, informe também o tamanho da área do local.";

                    await sendWhatsAppMessage(contato,resposta,respostadois, linkmensagem)
                    conversaEstado[contato] = 'finalizado';

                }
                if(texto === '3' && estado === "modulos"){
                    resposta = "Ótimo! Agora, é só aguardar, e um de nossos atendentes estará pronto para ajudá-lo com o que for necessário. 😊";
                    await sendWhatsAppMessage(contato, resposta, linkmensagem)
                    conversaEstado[contato] = 'finalizado';
                    
                }
                if(estado != "modulos"){
                    await sendWhatsAppMessage(contato, resposta, respostadois), linkmensagem;
                    conversaEstado[contato] = 'modulos';
                }
            
                timers[contato] = setTimeout(async () => {
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                    await sendWhatsAppMessage(contato, lembrete);
                }, 3600000); // 1 hora em milissegundos
            } 

            //Final dos Modulos
            
            //4. Produtos 3D
            else if (texto === '4') {
                resposta = "\n🌟 Bem-vindo(a) à nossa incrível categoria de Produtos 3D! Explore todos os nossos itens exclusivos, com detalhes sobre tamanhos, preços e mais. Não perca a chance de conferir: [Clique aqui para ver as opções!](https://wa.me/c/557191193419)";
                respostatres = "Para retornar ao menu principal a qualquer momento, digite '0'.";


                conversaEstado[contato] = 'finalizado';
                await sendWhatsAppMessage(contato, resposta, respostatres);
                timers[contato] = setTimeout(async () => {
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                    await sendWhatsAppMessage(contato, lembrete);
                }, 3600000); // 1 hora em milissegundos
            }
            //"5. Revenda de Produtos\n"
            else if (texto === '5') {
                resposta = "🌟 Olá! Você tem interesse em se tornar um revendedor(a) dos nossos produtos? Na Refluir personalizados, oferecemos itens de alta qualidade que certamente conquistarão seus clientes! 🚀";

                revendedorlink = "Em breve, mais informações! Para voltar ao menu principal, digite '0'.";

                conversaEstado[contato] = 'finalizado';
                await sendWhatsAppMessage(contato, resposta, revendedorlink);
                timers[contato] = setTimeout(async () => {
                    const lembrete = "Oi! 🌟 Só passando para lembrar que estamos aguardando sua resposta com muito carinho. Se precisar de mais tempo, sem problemas, estou por aqui! 😊\n\nCaso queira voltar ao menu inicial, é só digitar '0'. Vamos juntos encontrar o que você precisa! 💖";
                    await sendWhatsAppMessage(contato, lembrete);
                }, 3600000); // 1 hora em milissegundos
            }
            
        }
        //Tratamento de error
        else{
            if(estado === 'aguardando'){
                resposta = "Por favor, digite apenas os números apresentados no menu."
                await sendWhatsAppMessage(contato, resposta );   
            }
            
        }
    }, debounceDelay);
});

// Configuração do cliente WhatsApp
client.on('qr', async qr => {
    console.log('QR Code gerado:', qr);
    await qrcode.toFile('qrcode.png', qr);
    console.log('QR Code salvo como qrcode.png');
});

client.on('ready', () => {
    console.log('Cliente WhatsApp pronto!');
});

// Rota para exibir QR Code
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/qrcode', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qrcode.png'));
});


const stateFilePath = path.join(__dirname, 'conversa_estado.json');
if (fs.existsSync(stateFilePath)) {
    conversaEstado = JSON.parse(fs.readFileSync(stateFilePath));
} else {
    // Se o arquivo não existir, cria um novo com um objeto vazio
    fs.writeFileSync(stateFilePath, JSON.stringify({}, null, 2));
    conversaEstado = {}; // Inicializa o estado da conversa como um objeto vazio
}

// Salvar estado da conversa em um arquivo JSON
process.on('exit', () => {
    fs.writeFileSync(stateFilePath, JSON.stringify(conversaEstado, null, 2));
});

// Inicia o cliente WhatsApp e o servidor Express
client.initialize();
app.listen(port, () => {
    console.log(`Servidor Express rodando na porta ${port}`);
});
