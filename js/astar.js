/**
 * RF06 — A* com heuristica de Manhattan em grade 4-direcoes.
 * Retorno alinhado ao modulo de busca (pais, metricas).
 */
function aStar(linhas, colunas, matriz, inicioLinha, inicioColuna, objetivoLinha, objetivoColuna) {
    const chave = (l, c) => `${l}-${c}`;

    const heuristica = (linha, coluna) =>
        Math.abs(linha - objetivoLinha) + Math.abs(coluna - objetivoColuna);

    const abertos = [[inicioLinha, inicioColuna]];
    const conjuntoAbertos = new Set([chave(inicioLinha, inicioColuna)]);
    const fechados = new Set();

    const gScore = new Map([[chave(inicioLinha, inicioColuna), 0]]);
    const pais = new Map();

    let nosExpandidos = 0;
    let nosVisitados = 0;

    const vizinhos4 = (linha, coluna) => [
        [linha - 1, coluna],
        [linha + 1, coluna],
        [linha, coluna - 1],
        [linha, coluna + 1]
    ];

    while (abertos.length > 0) {
        abertos.sort((a, b) => {
            const fa =
                gScore.get(chave(a[0], a[1])) + heuristica(a[0], a[1]);
            const fb =
                gScore.get(chave(b[0], b[1])) + heuristica(b[0], b[1]);
            return fa - fb;
        });

        const [linha, coluna] = abertos.shift();
        const atual = chave(linha, coluna);

        if (!conjuntoAbertos.has(atual)) {
            continue;
        }

        conjuntoAbertos.delete(atual);
        if (fechados.has(atual)) {
            continue;
        }

        fechados.add(atual);
        nosExpandidos++;

        if (linha === objetivoLinha && coluna === objetivoColuna) {
            return {
                encontrou: true,
                pais,
                custoTotal: gScore.get(atual),
                nosVisitados,
                nosExpandidos
            };
        }

        for (const [novaLinha, novaColuna] of vizinhos4(linha, coluna)) {
            if (
                novaLinha < 0 ||
                novaLinha >= linhas ||
                novaColuna < 0 ||
                novaColuna >= colunas
            ) {
                continue;
            }

            const celula = matriz[novaLinha][novaColuna];
            if (celula.classList.contains("obstaculo")) {
                continue;
            }

            nosVisitados++;

            const vizinho = chave(novaLinha, novaColuna);
            const custoTentativa = gScore.get(atual) + custoCelula(celula);

            if (
                !gScore.has(vizinho) ||
                custoTentativa < gScore.get(vizinho)
            ) {
                pais.set(vizinho, atual);
                gScore.set(vizinho, custoTentativa);

                if (!conjuntoAbertos.has(vizinho)) {
                    abertos.push([novaLinha, novaColuna]);
                    conjuntoAbertos.add(vizinho);
                }
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
