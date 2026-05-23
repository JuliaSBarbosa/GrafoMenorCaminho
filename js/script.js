const grid = document.getElementById("grid");
const botaoReset = document.getElementById("resetar");
const botaoBuscar = document.getElementById("buscar");
const botaoNovoLabirinto = document.getElementById("novo-labirinto");
const inputLinhas = document.getElementById("input-linhas");
const inputColunas = document.getElementById("input-colunas");
const selectAlgoritmo = document.getElementById("algoritmo");

let inicio = null;
let objetivo = null;
let linhas = 10;
let colunas = 10;
let matriz = [];

inicializar();

function inicializar() {
    linhas = parseInt(inputLinhas.value, 10) || 10;
    colunas = parseInt(inputColunas.value, 10) || 10;
    construirGrade(gerarLabirinto(linhas, colunas));
}

botaoNovoLabirinto.addEventListener("click", () => {
    linhas = clamp(parseInt(inputLinhas.value, 10) || 10, 5, 25);
    colunas = clamp(parseInt(inputColunas.value, 10) || 10, 5, 25);
    inputLinhas.value = linhas;
    inputColunas.value = colunas;

    resetarSelecao();
    limparMetricasPainel();
    construirGrade(gerarLabirinto(linhas, colunas));
});

botaoReset.addEventListener("click", () => {
    resetarSelecao();
    limparMetricasPainel();
    limparCaminhoVisual();
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
            ? aStar(
                  linhas,
                  colunas,
                  matriz,
                  inicioLinha,
                  inicioColuna,
                  objetivoLinha,
                  objetivoColuna
              )
            : dijkstraBusca(
                  linhas,
                  colunas,
                  matriz,
                  inicioLinha,
                  inicioColuna,
                  objetivoLinha,
                  objetivoColuna
              );

    const tempoMs = performance.now() - t0;

    if (!resultado.encontrou) {
        exibirMetricasPainel({
            algoritmo,
            tempoMs,
            nosVisitados: resultado.nosVisitados,
            nosExpandidos: resultado.nosExpandidos,
            tamanhoCaminho: 0,
            encontrou: false
        });
        document.getElementById("modal-erro").showModal();//alert("Nao existe caminho possivel");
        return;
    }

    const tamanho = aplicarCaminhoNaGrade(
        matriz,
        resultado.pais,
        objetivoLinha,
        objetivoColuna,
        inicio,
        objetivo
    );

    exibirMetricasPainel({
        algoritmo,
        tempoMs,
        nosVisitados: resultado.nosVisitados,
        nosExpandidos: resultado.nosExpandidos,
        tamanhoCaminho: tamanho,
        encontrou: true
    });
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
