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

    let fila = [[inicioLinha, inicioColuna]];
    const visitados = new Set([chave(inicioLinha, inicioColuna)]);
    const pais = new Map();

    let nosVisitados = 0;
    let nosExpandidos = 0;

    while (fila.length > 0) {
        const [linha, coluna] = fila.shift();
        nosExpandidos++;

        if (linha === objetivoLinha && coluna === objetivoColuna) {
            return {
                encontrou: true,
                pais,
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

            const id = chave(novaLinha, novaColuna);
            nosVisitados++;

            if (!visitados.has(id)) {
                fila.push([novaLinha, novaColuna]);
                visitados.add(id);
                pais.set(id, chave(linha, coluna));
            }
        }
    }

    return {
        encontrou: false,
        pais: null,
        nosVisitados,
        nosExpandidos
    };
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
