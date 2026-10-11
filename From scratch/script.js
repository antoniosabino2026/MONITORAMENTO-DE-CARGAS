const lampCard = document.getElementById("lampCard");

const lampButton = document.getElementById("lampButton");

const lampState = document.getElementById("lampState");

const lampDescription =
    document.getElementById("lampDescription");

const timer =
    document.getElementById("timer");


// Estado inicial
let lampadaLigada = false;


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


// =========================
// BOTÃO
// =========================

lampButton.addEventListener("click", () => {

    lampadaLigada = !lampadaLigada;

    atualizarInterface();

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


// Atualiza a cada segundo

setInterval(atualizarTimer, 1000);


// Estado inicial

atualizarInterface();