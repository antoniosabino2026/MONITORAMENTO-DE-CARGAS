//ANTÓNIO SABINO - CEO DA BEENOUS
const lampCard = document.getElementById("lampCard");
const lampButton = document.getElementById("lampButton");
const lampState = document.getElementById("lampState");
const lampDescription = document.getElementById("lampDescription");
const timer = document.getElementById("timer");
const tensao = document.getElementById("tensao");
// O estado visual será atualizado a partir do ESP32.
let lampadaLigada = false;
let tempoLigada = 0;
let volt = 0.0;
let socket;
let reconexaoAgendada = false;

// ====================================
// ATUALIZAR INTERFACE COM DADOS DO ESP32
// ====================================
/*"async function atualizarTensao() {
    const resposta = await fetch("/api/state");
    const date = await resposta.json;
    tensao.textContent = date.Tensao, "V";
    console.log(date.Tensao);
}"
*/
function atualizarDashboard(dados) {
    lampadaLigada = dados.lampState;
    volt = dados.Tensao;
    if (volt < 50.0 || volt > 230.0){
        volt = 0.0
    } 
        if (lampadaLigada) {
            lampCard.classList.add("ligada");
            lampState.textContent = "LIGADA";
            lampDescription.textContent = "A lâmpada está ligada";
            lampButton.textContent = "Desligar lâmpada";
            tensao.textContent = volt + "V";
        } else {
            lampCard.classList.remove("ligada");
            lampState.textContent = "DESLIGADA";
            lampDescription.textContent = "A lâmpada está desligada";
            lampButton.textContent = "Ligar lâmpada";
            tensao.textContent = volt + "V";
        }

    console.log("Estado recebido do ESP32:", dados);
}

// ====================================
// LIGAÇÃO WEBSOCKET
// ====================================

function conectarWebSocket() {
    socket = new WebSocket(`ws://${location.hostname}:81/`);

    socket.onopen = function () {
        console.log("WebSocket conectado ao ESP32.");
        reconexaoAgendada = false;
    };

    socket.onmessage = function (evento) {
        try {
            const dados = JSON.parse(evento.data);
            atualizarDashboard(dados);
        } catch (erro) {
            console.error("Erro ao interpretar JSON:", erro);
        }
    };

    socket.onerror = function (erro) {
        console.error("Erro na ligação WebSocket:", erro);
    };

    socket.onclose = function () {
        console.log("WebSocket desconectado.");

        if (!reconexaoAgendada) {
            reconexaoAgendada = true;

            setTimeout(function () {
                reconexaoAgendada = false;
                conectarWebSocket();
            }, 2000);
        }
    };
}

// ====================================
// ENVIAR COMANDO AO ESP32
// ====================================

async function enviarComando(acao) {
    try {
        const resposta = await fetch(`/api/lamp/${acao}`);

        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log("Resposta HTTP do ESP32:", dados);

        // A interface será atualizada pela mensagem WebSocket.
    } catch (erro) {
        console.error("Falha ao enviar comando:", erro);
    }
}

lampButton.addEventListener("click", function () {
    const acao = lampadaLigada ? "off" : "on";
    enviarComando(acao);
});

// ====================================
// CRONÓMETRO
// ====================================

function atualizarTimer() {
    if (lampadaLigada) {
        tempoLigada++;
    }

    const horas = Math.floor(tempoLigada / 3600);
    const minutos = Math.floor((tempoLigada % 3600) / 60);
    const segundos = tempoLigada % 60;

    timer.textContent =
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}`;
}

// Iniciar as funcionalidades.
conectarWebSocket();
setInterval(atualizarTimer, 1000);
