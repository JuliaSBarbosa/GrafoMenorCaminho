const grid = document.getElementById("grid");

const botaoReset =
    document.getElementById("resetar");

const botaoBuscar =
    document.getElementById("buscar");

const metricas =
    document.getElementById("metricas");

const tamanhoCaminhoTexto =
    document.getElementById("tamanho-caminho");

let inicio = null;
let objetivo = null;

const linhas = 10;
const colunas = 10;

const matriz = [];

// CRIA GRID
for (let linha = 0; linha < linhas; linha++) {

    matriz[linha] = [];

    for (let coluna = 0; coluna < colunas; coluna++) {

        const celula =
            document.createElement("div");

        celula.classList.add("celula");

        // obstáculos de exemplo
        if (
            (linha === 2 && coluna === 2) ||
            (linha === 4 && coluna === 5) ||
            (linha === 6 && coluna === 7)
        ) {

            celula.classList.add("obstaculo");
        }

        celula.dataset.linha = linha;
        celula.dataset.coluna = coluna;

        // CLICK
        celula.addEventListener("click", () => {

            // impede selecionar obstáculos
            if (
                celula.classList.contains("obstaculo")
            ) {
                return;
            }

            // define início
            if (!inicio) {

                inicio = celula;

                celula.classList.add("inicio");
            }

            // define objetivo
            else if (
                !objetivo &&
                celula !== inicio
            ) {

                objetivo = celula;

                celula.classList.add("objetivo");
            }
        });

        matriz[linha][coluna] = celula;

        grid.appendChild(celula);
    }
}

// RESET
botaoReset.addEventListener("click", () => {

    inicio = null;
    objetivo = null;

    metricas.innerText = "";

    tamanhoCaminhoTexto.innerText = "";

    const celulas =
        document.querySelectorAll(".celula");

    celulas.forEach(celula => {

        celula.classList.remove("inicio");

        celula.classList.remove("objetivo");

        celula.classList.remove("caminho");
    });
});

// BUSCAR CAMINHO
botaoBuscar.addEventListener("click", () => {

    if (!inicio || !objetivo) {

        alert(
            "Selecione início e objetivo"
        );

        return;
    }

    // limpa caminho antigo
    const celulas =
        document.querySelectorAll(".celula");

    celulas.forEach(celula => {

        celula.classList.remove("caminho");
    });

    dijkstra();
});

// ALGORITMO
function dijkstra() {

    let fila = [];

    let visitados = new Set();

    let pais = new Map();

    let nosVisitados = 0;

    const inicioLinha =
        parseInt(inicio.dataset.linha);

    const inicioColuna =
        parseInt(inicio.dataset.coluna);

    const objetivoLinha =
        parseInt(objetivo.dataset.linha);

    const objetivoColuna =
        parseInt(objetivo.dataset.coluna);

    fila.push([
        inicioLinha,
        inicioColuna
    ]);

    visitados.add(
        `${inicioLinha}-${inicioColuna}`
    );

    while (fila.length > 0) {

        const [linha, coluna] =
            fila.shift();

        nosVisitados++;

        // chegou no objetivo
        if (
            linha === objetivoLinha &&
            coluna === objetivoColuna
        ) {

            const tamanho =
                mostrarCaminho(
                    pais,
                    objetivoLinha,
                    objetivoColuna
                );

            metricas.innerText =
                `Nós visitados: ${nosVisitados}`;

            tamanhoCaminhoTexto.innerText =
                `Tamanho do caminho: ${tamanho}`;

            return;
        }

        // vizinhos
        const vizinhos = [

            [linha - 1, coluna], // cima

            [linha + 1, coluna], // baixo

            [linha, coluna - 1], // esquerda

            [linha, coluna + 1]  // direita
        ];

        for (const [
            novaLinha,
            novaColuna
        ] of vizinhos) {

            // limites
            if (
                novaLinha < 0 ||
                novaLinha >= linhas ||
                novaColuna < 0 ||
                novaColuna >= colunas
            ) {

                continue;
            }

            const vizinho =
                matriz[novaLinha][novaColuna];

            // obstáculo
            if (
                vizinho.classList.contains(
                    "obstaculo"
                )
            ) {

                continue;
            }

            const chave =
                `${novaLinha}-${novaColuna}`;

            // ainda não visitado
            if (
                !visitados.has(chave)
            ) {

                fila.push([
                    novaLinha,
                    novaColuna
                ]);

                visitados.add(chave);

                pais.set(
                    chave,
                    `${linha}-${coluna}`
                );
            }
        }
    }

    // sem caminho
    alert(
        "Não existe caminho possível"
    );
}

// MOSTRAR CAMINHO
function mostrarCaminho(
    pais,
    linha,
    coluna
) {

    let atual = `${linha}-${coluna}`;

    let tamanho = 0;

    while (pais.has(atual)) {

        const [
            linhaAtual,
            colunaAtual
        ] =
            atual
            .split("-")
            .map(Number);

        const celula =
            matriz[linhaAtual][colunaAtual];

        // NÃO pinta início nem objetivo
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