/* RF06: copie sobre js/script.js apos RF02 mergeado na main.
   Usa metricas simples (p#metricas) ate RF09. */
const grid = document.getElementById("grid");
const botaoReset = document.getElementById("resetar");
const botaoBuscar = document.getElementById("buscar");
const botaoNovoLabirinto = document.getElementById("novo-labirinto");
const inputLinhas = document.getElementById("input-linhas");
const inputColunas = document.getElementById("input-colunas");
const selectAlgoritmo = document.getElementById("algoritmo");
const metricas = document.getElementById("metricas");
const tamanhoCaminhoTexto = document.getElementById("tamanho-caminho");

let inicio = null;
let objetivo = null;
let linhas = 11;
let colunas = 11;
let matriz = [];

inicializar();

function inicializar() {
    linhas = parseInt(inputLinhas.value, 10) || 11;
    colunas = parseInt(inputColunas.value, 10) || 11;
    construirGrade(gerarLabirinto(linhas, colunas));
}

botaoNovoLabirinto.addEventListener("click", () => {
    linhas = clamp(parseInt(inputLinhas.value, 10) || 11, 5, 25);
    colunas = clamp(parseInt(inputColunas.value, 10) || 11, 5, 25);
    inputLinhas.value = linhas;
    inputColunas.value = colunas;
    resetarSelecao();
    metricas.innerText = "";
    tamanhoCaminhoTexto.innerText = "";
    construirGrade(gerarLabirinto(linhas, colunas));
});

botaoReset.addEventListener("click", () => {
    resetarSelecao();
    metricas.innerText = "";
    tamanhoCaminhoTexto.innerText = "";
});

botaoBuscar.addEventListener("click", () => {
    if (!inicio || !objetivo) {
        alert("Selecione inicio e objetivo");
        return;
    }
    limparCaminhoVisual();

    const inicioLinha = parseInt(inicio.dataset.linha, 10);
    const inicioColuna = parseInt(inicio.dataset.coluna, 10);
    const objetivoLinha = parseInt(objetivo.dataset.linha, 10);
    const objetivoColuna = parseInt(objetivo.dataset.coluna, 10);
    const algoritmo = selectAlgoritmo.value;
    const t0 = performance.now();

    const resultado =
        algoritmo === "astar"
            ? aStar(linhas, colunas, matriz, inicioLinha, inicioColuna, objetivoLinha, objetivoColuna)
            : dijkstraBusca(linhas, colunas, matriz, inicioLinha, inicioColuna, objetivoLinha, objetivoColuna);

    const tempoMs = performance.now() - t0;

    if (!resultado.encontrou) {
        metricas.innerText = `Algoritmo: ${algoritmo === "astar" ? "A*" : "Dijkstra"} | Tempo: ${tempoMs.toFixed(2)} ms`;
        tamanhoCaminhoTexto.innerText = "Sem caminho";
        alert("Nao existe caminho possivel");
        return;
    }

    const tamanho = aplicarCaminhoNaGrade(matriz, resultado.pais, objetivoLinha, objetivoColuna, inicio, objetivo);
    metricas.innerText = `Algoritmo: ${algoritmo === "astar" ? "A*" : "Dijkstra"} | Visitados: ${resultado.nosVisitados} | Expandidos: ${resultado.nosExpandidos} | Tempo: ${tempoMs.toFixed(2)} ms`;
    tamanhoCaminhoTexto.innerText = `Tamanho do caminho: ${tamanho}`;
});

function construirGrade(mapaParedes) {
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${colunas}, 55px)`;
    matriz = [];
    for (let linha = 0; linha < linhas; linha++) {
        matriz[linha] = [];
        for (let coluna = 0; coluna < colunas; coluna++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            if (mapaParedes[linha][coluna] === 1) celula.classList.add("obstaculo");
            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;
            celula.addEventListener("click", () => {
                if (celula.classList.contains("obstaculo")) return;
                if (!inicio) { inicio = celula; celula.classList.add("inicio"); return; }
                if (!objetivo && celula !== inicio) { objetivo = celula; celula.classList.add("objetivo"); }
            });
            matriz[linha][coluna] = celula;
            grid.appendChild(celula);
        }
    }
}

function resetarSelecao() {
    inicio = null;
    objetivo = null;
    limparCaminhoVisual();
    document.querySelectorAll(".celula").forEach((c) => {
        c.classList.remove("inicio");
        c.classList.remove("objetivo");
    });
}

function limparCaminhoVisual() {
    document.querySelectorAll(".celula").forEach((c) => c.classList.remove("caminho"));
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}
