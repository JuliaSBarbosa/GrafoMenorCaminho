const grid = document.getElementById("grid");

let inicio = null;
let objetivo = null;

// Cria 100 células
for (let i = 0; i < 100; i++) {

    const celula = document.createElement("div");
    celula.classList.add("celula");

    // obstáculos de exemplo
    if (i === 22 || i === 45 || i === 67) {
        celula.classList.add("obstaculo");
    }

    celula.addEventListener("click", () => {

        // Impede selecionar obstáculos
        if (celula.classList.contains("obstaculo")) {
            return;
        }

        // Define início
        if (!inicio) {
            inicio = celula;
            celula.classList.add("inicio");
        }

        // Define objetivo
        else if (!objetivo && celula !== inicio) {
            objetivo = celula;
            celula.classList.add("objetivo");
        }
    });

    grid.appendChild(celula);
}

const botaoReset = document.getElementById("resetar");

botaoReset.addEventListener("click", () => {

    inicio = null;
    objetivo = null;

    const celulas = document.querySelectorAll(".celula");

    celulas.forEach(celula => {
        celula.classList.remove("inicio");
        celula.classList.remove("objetivo");
    });

});