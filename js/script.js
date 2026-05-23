const grid = document.getElementById("grid");
const botaoReset = document.getElementById("resetar");
const botaoBuscar = document.getElementById("buscar");
const botaoLimparCaminho = document.getElementById("limpar-caminho");
const botaoNovoLabirinto = document.getElementById("novo-labirinto");
const inputLinhas = document.getElementById("input-linhas");
const inputColunas = document.getElementById("input-colunas");
const selectAlgoritmo = document.getElementById("algoritmo");

let inicio = null;
let objetivo = null;
let linhas = 10;
let colunas = 10;
let matriz = [];
let pintando = false;

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
});

botaoLimparCaminho.addEventListener("click", () => {
    limparCaminhoVisual();
    limparMetricasPainel();
});

botaoBuscar.addEventListener("click", () => {
    if (!inicio || !objetivo) {
        exibirModalErro("Selecione uma celula de inicio e uma celula de fim antes de buscar.");
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
            custoTotal: resultado.custoTotal,
            encontrou: false
        });
        exibirModalErro("Nenhum caminho encontrado. Ajuste as paredes ou os pontos escolhidos.");
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
        custoTotal: resultado.custoTotal,
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

            celula.addEventListener("mousedown", (event) => {
                event.preventDefault();
                pintando = true;
                tratarCelula(celula);
            });

            celula.addEventListener("mouseenter", () => {
                if (pintando && modoPintura()) {
                    tratarCelula(celula);
                }
            });

            matriz[linha][coluna] = celula;
            grid.appendChild(celula);
        }
    }
}

document.addEventListener("mouseup", () => {
    pintando = false;
});

function tratarCelula(celula) {
    const modo = modoAtual();

    if (modo === "parede") {
        transformarEmParede(celula);
        return;
    }

    if (modo === "livre") {
        transformarEmLivre(celula);
        return;
    }

    if (modo === "lento") {
        transformarEmLento(celula);
        return;
    }

    if (modo === "inicio") {
        selecionarInicio(celula);
        return;
    }

    selecionarObjetivo(celula);
}

function selecionarInicio(celula) {
    if (celula.classList.contains("obstaculo")) {
        return;
    }

    limparCaminhoVisual();
    limparMetricasPainel();

    if (inicio) {
        inicio.classList.remove("inicio");
    }

    if (celula === objetivo) {
        objetivo = null;
        celula.classList.remove("objetivo");
    }

    inicio = celula;
    celula.classList.remove("lento");
    celula.classList.add("inicio");
}

function selecionarObjetivo(celula) {
    if (celula.classList.contains("obstaculo")) {
        return;
    }

    limparCaminhoVisual();
    limparMetricasPainel();

    if (objetivo) {
        objetivo.classList.remove("objetivo");
    }

    if (celula === inicio) {
        inicio = null;
        celula.classList.remove("inicio");
    }

    objetivo = celula;
    celula.classList.remove("lento");
    celula.classList.add("objetivo");
}

function transformarEmParede(celula) {
    limparCaminhoVisual();
    limparMetricasPainel();

    if (celula === inicio) {
        inicio = null;
    }

    if (celula === objetivo) {
        objetivo = null;
    }

    celula.classList.remove("inicio", "objetivo", "caminho", "lento");
    celula.classList.add("obstaculo");
}

function transformarEmLento(celula) {
    limparCaminhoVisual();
    limparMetricasPainel();

    if (celula === inicio) {
        inicio = null;
    }

    if (celula === objetivo) {
        objetivo = null;
    }

    celula.classList.remove("inicio", "objetivo", "obstaculo", "caminho");
    celula.classList.add("lento");
}

function transformarEmLivre(celula) {
    limparCaminhoVisual();
    limparMetricasPainel();
    celula.classList.remove("obstaculo", "lento", "caminho");
}

function modoAtual() {
    const selecionado = document.querySelector('input[name="modo-edicao"]:checked');
    return selecionado ? selecionado.value : "inicio";
}

function modoPintura() {
    return ["parede", "lento", "livre"].includes(modoAtual());
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

function exibirModalErro(mensagem) {
    const modal = document.getElementById("modal-erro");
    const texto = document.getElementById("modal-erro-mensagem");

    if (texto) {
        texto.textContent = mensagem;
    }

    modal.showModal();
}

function clamp(valor, min, max) {
    return Math.min(max, Math.max(min, valor));
}
