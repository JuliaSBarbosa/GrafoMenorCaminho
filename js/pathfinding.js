/**
 * Dijkstra e utilitarios compartilhados (reconstrucao de caminho).
 */
function dijkstraBusca(
    linhas,
    colunas,
    matriz,
    inicioLinha,
    inicioColuna,
    objetivoLinha,
    objetivoColuna
) {
    const chave = (l, c) => `${l}-${c}`;

    let fila = [[inicioLinha, inicioColuna, 0]];
    const distancias = new Map([[chave(inicioLinha, inicioColuna), 0]]);
    const visitados = new Set();
    const pais = new Map();

    let nosVisitados = 0;
    let nosExpandidos = 0;

    while (fila.length > 0) {
        fila.sort((a, b) => a[2] - b[2]);
        const [linha, coluna, custoAtual] = fila.shift();
        const atual = chave(linha, coluna);

        if (visitados.has(atual)) {
            continue;
        }

        visitados.add(atual);
        nosExpandidos++;

        if (linha === objetivoLinha && coluna === objetivoColuna) {
            return {
                encontrou: true,
                pais,
                custoTotal: custoAtual,
                nosVisitados,
                nosExpandidos
            };
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

            nosVisitados++;
            const id = chave(novaLinha, novaColuna);
            const novoCusto = custoAtual + custoCelula(vizinho);

            if (!distancias.has(id) || novoCusto < distancias.get(id)) {
                distancias.set(id, novoCusto);
                fila.push([novaLinha, novaColuna, novoCusto]);
                pais.set(id, atual);
            }
        }
    }

    return {
        encontrou: false,
        pais: null,
        custoTotal: 0,
        nosVisitados,
        nosExpandidos
    };
}

function custoCelula(celula) {
    if (celula.classList.contains("lento")) {
        return 5;
    }

    return 1;
}

function reconstruirCaminho(pais, linha, coluna) {
    let atual = `${linha}-${coluna}`;
    let tamanho = 0;

    while (pais.has(atual)) {
        const [linhaAtual, colunaAtual] = atual.split("-").map(Number);
        tamanho++;
        atual = pais.get(atual);
    }

    return tamanho;
}

function aplicarCaminhoNaGrade(matriz, pais, linha, coluna, inicio, objetivo) {
    let atual = `${linha}-${coluna}`;

    while (pais.has(atual)) {
        const [linhaAtual, colunaAtual] = atual.split("-").map(Number);
        const celula = matriz[linhaAtual][colunaAtual];

        if (
            celula !== inicio &&
            celula !== objetivo &&
            !celula.classList.contains("inicio") &&
            !celula.classList.contains("objetivo")
        ) {
            celula.classList.add("caminho");
        }

        atual = pais.get(atual);
    }

    return reconstruirCaminho(pais, linha, coluna);
}
