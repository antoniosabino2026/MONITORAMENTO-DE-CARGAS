const lampCard = document.getElementById("lampCard");

const lampButton = document.getElementById("lampButton");

const lampState = document.getElementById("lampState");

const lampDescription =
    document.getElementById("lampDescription");

const timer =
    document.getElementById("timer");

// Estado inicial
let lampadaLigada = false;

async function obterEstadoEsp() {
    const resposta = await fetch("/api/state");
    const dados = await resposta.json();
    console.log(dados);
    let estado = dados.lampState;
   
    if (estado === true){
        
        console.log("Está ON", estado);
        lampCard.classList.add("ligada");

        lampState.textContent = "LIGADA";

        lampDescription.textContent =
            "A lâmpada está ligada";

        lampButton.textContent =
            "Desligar lâmpada";
        lampadaLigada = lampadaLigada;
        LigarEsp();
    }
    else{
        lampCard.classList.remove("ligada");

        lampState.textContent = "DESLIGADA";

        lampDescription.textContent =
            "A lâmpada está desligada";

        lampButton.textContent =
            "Ligar lâmpada";
            lampadaLigada = !lampadaLigada;
        DesligarEsp();
        console.log("Está OFF", estado);
    }
    return estado;
}
//console.log("HELLO WORLD", obterEstadoEsp());
/*const estado =  obterEstadoEsp().lampState;
    if (estado == true){
        inverterEstado();
        atualizarInterface();
    console.log("Funcionando");
    }


async function estadoEsp(){
    let lampadaLigada = await obterEstadoEsp();
    console.log(lampadaLigada);
    
    return lampadaLigada;
}*/


// Tempo em segundos
let tempoLigada = 0;


// =========================
// ATUALIZAR INTERFACE
// =========================

function atualizarInterface() {


    if (lampadaLigada) {

        lampCard.classList.add("ligada");

        lampState.textContent = "LIGADA";

        lampDescription.textContent =
            "A lâmpada está ligada";

        lampButton.textContent =
            "Desligar lâmpada";

    } else {

        lampCard.classList.remove("ligada");

        lampState.textContent = "DESLIGADA";

        lampDescription.textContent =
            "A lâmpada está desligada";

        lampButton.textContent =
            "Ligar lâmpada";
    }
}

function inverterEstado(){
    lampadaLigada = !lampadaLigada;
}

// =========================
// BOTÃO
// =========================
/*lampButton.addEventListener("click", () => {

    lampadaLigada = !lampadaLigada;

    atualizarInterface();

});*/
lampButton.addEventListener("click", () => {

    inverterEstado();

    if (lampState.textContent == "LIGADA") {
        DesligarEsp();
        atualizarInterface();
    }
    else if (lampState.textContent == "DESLIGADA") {
        LigarEsp();
        atualizarInterface();
    }
    else {
        console.log("Erro ao obter o estado da lâmpada");
    }

});


// =========================
// CRONÓMETRO
// =========================

function atualizarTimer() {

    if (lampadaLigada) {

        tempoLigada++;

    }

    const horas =
        Math.floor(tempoLigada / 3600);

    const minutos =
        Math.floor((tempoLigada % 3600) / 60);

    const segundos =
        tempoLigada % 60;


    timer.textContent =
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}`;
}

async function LigarEsp() {
    const resposta = await fetch("/api/lamp/on");
    const dados = await resposta.json();

    console.log("O estado da lâmpada ligada é: ", dados.lampState);


}
async function DesligarEsp() {
    const resposta = await fetch("/api/lamp/off");
    const dados = await resposta.json();

    console.log("O estado da lâmpada desligada é: ", dados.lampState);

}
setInterval(obterEstadoEsp, 1500);


// Atualiza a cada segundo

setInterval(atualizarTimer, 1000);

//setInterval(estadoEsp, 1000);
// Estado inicial

atualizarInterface();
