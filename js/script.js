const grid = document.getElementById("grid");
const botaoReset = document.getElementById("resetar");
const botaoBuscar = document.getElementById("buscar");
const botaoLimparCaminho = document.getElementById("limpar-caminho");
const botaoNovoLabirinto = document.getElementById("novo-labirinto");
const inputLinhas = document.getElementById("input-linhas");
const inputColunas = document.getElementById("input-colunas");
const selectAlgoritmo = document.getElementById("algoritmo");

// Este arquivo controla a interacao da tela: botoes, grade, selecao
// de inicio/fim, pintura de obstaculos e chamada dos algoritmos.

// Estado atual da grade e das celulas escolhidas pelo usuario.
let inicio = null;
let objetivo = null;
let linhas = 10;
let colunas = 10;
let matriz = [];

// Indica se o usuario esta segurando o mouse para pintar varias celulas.
let pintando = false;

inicializar();

function inicializar() {
    // Le os valores iniciais dos inputs e cria o primeiro labirinto.
    linhas = parseInt(inputLinhas.value, 10) || 10;
    colunas = parseInt(inputColunas.value, 10) || 10;
    construirGrade(gerarLabirinto(linhas, colunas));
}

botaoNovoLabirinto.addEventListener("click", () => {
    // Limita o tamanho para manter a grade usavel na tela.
    linhas = clamp(parseInt(inputLinhas.value, 10) || 10, 5, 25);
    colunas = clamp(parseInt(inputColunas.value, 10) || 10, 5, 25);
    inputLinhas.value = linhas;
    inputColunas.value = colunas;

    // Novo labirinto tambem limpa selecoes e metricas antigas.
    resetarSelecao();
    limparMetricasPainel();
    construirGrade(gerarLabirinto(linhas, colunas));
});

botaoReset.addEventListener("click", () => {
    // Reset limpa apenas inicio, objetivo e caminho, sem recriar paredes.
    resetarSelecao();
    limparMetricasPainel();
});

botaoLimparCaminho.addEventListener("click", () => {
    // Permite apagar o resultado visual sem alterar a grade montada.
    limparCaminhoVisual();
    limparMetricasPainel();
});

botaoBuscar.addEventListener("click", () => {
    if (!inicio || !objetivo) {
        // A busca precisa de um ponto de partida e um destino.
        exibirModalErro("Selecione uma celula de inicio e uma celula de fim antes de buscar.");
        return;
    }

    limparCaminhoVisual();

    // As coordenadas ficam gravadas no dataset de cada div da grade.
    const inicioLinha = parseInt(inicio.dataset.linha, 10);
    const inicioColuna = parseInt(inicio.dataset.coluna, 10);
    const objetivoLinha = parseInt(objetivo.dataset.linha, 10);
    const objetivoColuna = parseInt(objetivo.dataset.coluna, 10);

    const algoritmo = selectAlgoritmo.value;
    const t0 = performance.now();

    // Executa o algoritmo escolhido mantendo o mesmo contrato de retorno.
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

    // Se nao houver rota, mostra metricas da tentativa e avisa o usuario.
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

    // Quando encontra rota, pinta o caminho e calcula o comprimento.
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
    // Recria a grade visual e guarda as referencias das celulas em matriz.
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${colunas}, 55px)`;
    matriz = [];

    for (let linha = 0; linha < linhas; linha++) {
        matriz[linha] = [];

        for (let coluna = 0; coluna < colunas; coluna++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");

            // No mapa do labirinto, 1 significa parede e 0 significa area livre.
            if (mapaParedes[linha][coluna] === 1) {
                celula.classList.add("obstaculo");
            }

            // Guarda a posicao da celula para recuperar depois na busca.
            celula.dataset.linha = linha;
            celula.dataset.coluna = coluna;

            // Mousedown permite editar uma celula e iniciar pintura por arraste.
            celula.addEventListener("mousedown", (event) => {
                event.preventDefault();
                pintando = true;
                tratarCelula(celula);
            });

            celula.addEventListener("mouseenter", () => {
                // Ao arrastar, somente modos de pintura alteram varias celulas.
                if (pintando && modoPintura()) {
                    tratarCelula(celula);
                }
            });

            // A matriz espelha a grade visual para os algoritmos acessarem por linha/coluna.
            matriz[linha][coluna] = celula;
            grid.appendChild(celula);
        }
    }
}

document.addEventListener("mouseup", () => {
    // Soltar o mouse em qualquer lugar encerra o modo de pintura.
    pintando = false;
});

function tratarCelula(celula) {
    // Direciona a acao da celula conforme o modo selecionado nos radios.
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
    // Inicio e objetivo nunca podem ser paredes.
    if (celula.classList.contains("obstaculo")) {
        return;
    }

    limparCaminhoVisual();
    limparMetricasPainel();

    if (inicio) {
        // Remove o marcador anterior para existir apenas um inicio.
        inicio.classList.remove("inicio");
    }

    if (celula === objetivo) {
        // A mesma celula nao pode ser inicio e objetivo ao mesmo tempo.
        objetivo = null;
        celula.classList.remove("objetivo");
    }

    inicio = celula;
    celula.classList.remove("lento");
    celula.classList.add("inicio");
}

function selecionarObjetivo(celula) {
    // Objetivo segue as mesmas regras do inicio.
    if (celula.classList.contains("obstaculo")) {
        return;
    }

    limparCaminhoVisual();
    limparMetricasPainel();

    if (objetivo) {
        // Remove o marcador anterior para existir apenas um objetivo.
        objetivo.classList.remove("objetivo");
    }

    if (celula === inicio) {
        // A mesma celula nao pode ser objetivo e inicio ao mesmo tempo.
        inicio = null;
        celula.classList.remove("inicio");
    }

    objetivo = celula;
    celula.classList.remove("lento");
    celula.classList.add("objetivo");
}

function transformarEmParede(celula) {
    // Transformar em parede remove qualquer papel especial da celula.
    limparCaminhoVisual();
    limparMetricasPainel();

    if (celula === inicio) {
        // Se virar parede, deixa de ser ponto inicial.
        inicio = null;
    }

    if (celula === objetivo) {
        // Se virar parede, deixa de ser ponto final.
        objetivo = null;
    }

    celula.classList.remove("inicio", "objetivo", "caminho", "lento");
    celula.classList.add("obstaculo");
}

function transformarEmLento(celula) {
    // Celulas lentas continuam transitaveis, mas custam mais no algoritmo.
    limparCaminhoVisual();
    limparMetricasPainel();

    if (celula === inicio) {
        // Celula lenta nao pode continuar marcada como inicio.
        inicio = null;
    }

    if (celula === objetivo) {
        // Celula lenta nao pode continuar marcada como objetivo.
        objetivo = null;
    }

    celula.classList.remove("inicio", "objetivo", "obstaculo", "caminho");
    celula.classList.add("lento");
}

function transformarEmLivre(celula) {
    // Limpa estados editaveis e deixa a celula pronta para passagem normal.
    limparCaminhoVisual();
    limparMetricasPainel();
    celula.classList.remove("obstaculo", "lento", "caminho");
}

function modoAtual() {
    // Se nada estiver marcado, o modo padrao e selecionar inicio.
    const selecionado = document.querySelector('input[name="modo-edicao"]:checked');
    return selecionado ? selecionado.value : "inicio";
}

function modoPintura() {
    // Apenas modos de desenho podem ser aplicados arrastando o mouse.
    return ["parede", "lento", "livre"].includes(modoAtual());
}

function resetarSelecao() {
    // Mantem paredes e pesos, mas remove inicio, objetivo e caminho calculado.
    inicio = null;
    objetivo = null;
    limparCaminhoVisual();

    document.querySelectorAll(".celula").forEach((celula) => {
        celula.classList.remove("inicio");
        celula.classList.remove("objetivo");
    });
}

function limparCaminhoVisual() {
    // Remove somente o caminho desenhado, preservando paredes, pesos e selecoes.
    document.querySelectorAll(".celula").forEach((celula) => {
        celula.classList.remove("caminho");
    });
}

function exibirModalErro(mensagem) {
    // Centraliza mensagens de erro para todos os fluxos de validacao.
    const modal = document.getElementById("modal-erro");
    const texto = document.getElementById("modal-erro-mensagem");

    if (texto) {
        texto.textContent = mensagem;
    }

    modal.showModal();
}

function clamp(valor, min, max) {
    // Garante que os valores digitados fiquem dentro do intervalo aceito.
    return Math.min(max, Math.max(min, valor));
}
