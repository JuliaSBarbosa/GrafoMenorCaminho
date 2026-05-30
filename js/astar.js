/**
 * RF06 — A* com heuristica de Manhattan em grade 4-direcoes.
 * Retorno alinhado ao modulo de busca (pais, metricas).
 */
function aStar(linhas, colunas, matriz, inicioLinha, inicioColuna, objetivoLinha, objetivoColuna) {
    // O A* combina custo real ja percorrido com uma estimativa do que falta.
    // Por isso costuma visitar menos celulas que o Dijkstra em muitos mapas.
    // Assim como no Dijkstra, a chave identifica cada celula em Map e Set.
    const chave = (l, c) => `${l}-${c}`;

    // Distancia de Manhattan estima o caminho restante em uma grade 4-direcoes.
    const heuristica = (linha, coluna) =>
        Math.abs(linha - objetivoLinha) + Math.abs(coluna - objetivoColuna);

    // Abertos sao candidatos a explorar; fechados ja foram processados.
    const abertos = [[inicioLinha, inicioColuna]];
    // O Set permite verificar rapidamente se uma celula ainda esta aberta.
    const conjuntoAbertos = new Set([chave(inicioLinha, inicioColuna)]);
    // Fechados impede que uma celula ja concluida seja expandida novamente.
    const fechados = new Set();

    // gScore guarda o custo real desde o inicio ate cada celula.
    const gScore = new Map([[chave(inicioLinha, inicioColuna), 0]]);
    // pais armazena o caminho escolhido para reconstruir a rota ao final.
    const pais = new Map();

    let nosExpandidos = 0;
    let nosVisitados = 0;

    while (abertos.length > 0) {
        // A* escolhe o menor fScore: custo real + estimativa ate o objetivo.
        abertos.sort((a, b) => {
            const fa =
                gScore.get(chave(a[0], a[1])) + heuristica(a[0], a[1]);
            const fb =
                gScore.get(chave(b[0], b[1])) + heuristica(b[0], b[1]);
            return fa - fb;
        });

        const [linha, coluna] = abertos.shift();
        const atual = chave(linha, coluna);

        // Ignora entradas antigas que ficaram na lista depois de uma atualizacao.
        if (!conjuntoAbertos.has(atual)) {
            continue;
        }

        conjuntoAbertos.delete(atual);
        // Uma celula fechada ja teve seu melhor caminho processado.
        if (fechados.has(atual)) {
            continue;
        }

        fechados.add(atual);
        nosExpandidos++;

        // Ao encontrar o objetivo, retorna as metricas e o mapa de pais.
        if (linha === objetivoLinha && coluna === objetivoColuna) {
            return {
                encontrou: true,
                pais,
                custoTotal: gScore.get(atual),
                nosVisitados,
                nosExpandidos
            };
        }

        for (const [novaLinha, novaColuna] of obterVizinhosValidos(
            linhas,
            colunas,
            matriz,
            linha,
            coluna
        )) {
            const celula = matriz[novaLinha][novaColuna];

            // Conta os vizinhos avaliados durante a busca.
            nosVisitados++;

            const vizinho = chave(novaLinha, novaColuna);
            // custoTentativa e o custo para chegar ao vizinho passando pela celula atual.
            const custoTentativa = gScore.get(atual) + custoCelula(celula);

            // Se achou um caminho melhor para o vizinho, registra o novo pai.
            if (
                !gScore.has(vizinho) ||
                custoTentativa < gScore.get(vizinho)
            ) {
                pais.set(vizinho, atual);
                gScore.set(vizinho, custoTentativa);

                if (!conjuntoAbertos.has(vizinho)) {
                    // Se ainda nao estava para ser explorado, entra na lista de abertos.
                    abertos.push([novaLinha, novaColuna]);
                    conjuntoAbertos.add(vizinho);
                }
            }
        }
    }

    // Lista de abertos vazia significa que o objetivo nao foi alcancado.
    return {
        encontrou: false,
        pais: null,
        custoTotal: 0,
        nosVisitados,
        nosExpandidos
    };
}
