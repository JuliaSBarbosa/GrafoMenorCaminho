const grid = document.getElementById("grid");
const botaoReset = document.getElementById("resetar");
const botaoBuscar = document.getElementById("buscar");
const botaoNovoLabirinto = document.getElementById("novo-labirinto");
const inputLinhas = document.getElementById("input-linhas");
const inputColunas = document.getElementById("input-colunas");

const metricas = document.getElementById("metricas");
const tamanhoCaminhoTexto = document.getElementById("tamanho-caminho");

let inicio = null;
let objetivo = null;
let linhas = 10;
let colunas = 10;
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
    dijkstra();
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

            if (mapaParedes[linha][coluna] === 1) {
                celula.classList.add("obstaculo");
            }

            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

            celula.addEventListener("click", () => {
                if (celula.classList.contains("obstaculo")) {
                    return;
                }

                if (!inicio) {
                    inicio = celula;
                    celula.classList.add("inicio");
                    return;
                }

                if (!objetivo && celula !== inicio) {
                    objetivo = celula;
                    celula.classList.add("objetivo");
                }
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

    document.querySelectorAll(".celula").forEach((celula) => {
        celula.classList.remove("inicio");
        celula.classList.remove("objetivo");
    });
}

function limparCaminhoVisual() {
    document.querySelectorAll(".celula").forEach((celula) => {
        celula.classList.remove("caminho");
    });
}

function clamp(valor, min, max) {
    return Math.min(max, Math.max(min, valor));
}

function dijkstra() {
    let fila = [];
    let visitados = new Set();
    let pais = new Map();
    let nosVisitados = 0;

    const inicioLinha = parseInt(inicio.dataset.linha, 10);
    const inicioColuna = parseInt(inicio.dataset.coluna, 10);
    const objetivoLinha = parseInt(objetivo.dataset.linha, 10);
    const objetivoColuna = parseInt(objetivo.dataset.coluna, 10);

    fila.push([inicioLinha, inicioColuna]);
    visitados.add(`${inicioLinha}-${inicioColuna}`);

    while (fila.length > 0) {
        const [linha, coluna] = fila.shift();
        nosVisitados++;

        if (linha === objetivoLinha && coluna === objetivoColuna) {
            const tamanho = mostrarCaminho(pais, objetivoLinha, objetivoColuna);
            metricas.innerText = `Nos visitados: ${nosVisitados}`;
            tamanhoCaminhoTexto.innerText = `Tamanho do caminho: ${tamanho}`;
            return;
        }

        const vizinhos = [
            [linha - 1, coluna],
            [linha + 1, coluna],
            [linha, coluna - 1],
            [linha, coluna + 1]
        ];

        for (const [novaLinha, novaColuna] of vizinhos) {
            if (
                novaLinha < 0 ||
                novaLinha >= linhas ||
                novaColuna < 0 ||
                novaColuna >= colunas
            ) {
                continue;
            }

            const vizinho = matriz[novaLinha][novaColuna];
            if (vizinho.classList.contains("obstaculo")) {
                continue;
            }

            const chave = `${novaLinha}-${novaColuna}`;
            if (!visitados.has(chave)) {
                fila.push([novaLinha, novaColuna]);
                visitados.add(chave);
                pais.set(chave, `${linha}-${coluna}`);
            }
        }
    }

    alert("Nao existe caminho possivel");
}

function mostrarCaminho(pais, linha, coluna) {
    let atual = `${linha}-${coluna}`;
    let tamanho = 0;

    while (pais.has(atual)) {
        const [linhaAtual, colunaAtual] = atual.split("-").map(Number);
        const celula = matriz[linhaAtual][colunaAtual];

        if (
            !celula.classList.contains("inicio") &&
            !celula.classList.contains("objetivo")
        ) {
            celula.classList.add("caminho");
        }

        atual = pais.get(atual);
        tamanho++;
    }

    return tamanho;
}
