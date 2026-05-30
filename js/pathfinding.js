/**
 * Dijkstra e utilitarios compartilhados (reconstrucao de caminho).
 *
 * A ideia do Dijkstra e testar primeiro os caminhos mais baratos.
 * Como cada celula pode ter custo diferente, ele nao olha somente a
 * quantidade de passos, mas sim o custo acumulado ate cada posicao.
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
    // A chave transforma uma coordenada (linha, coluna) em texto.
    // Isso facilita guardar posicoes dentro de Map e Set.
    const chave = (l, c) => `${l}-${c}`;

    // A fila guarda posicoes candidatas no formato [linha, coluna, custo].
    let fila = [[inicioLinha, inicioColuna, 0]];
    // distancias guarda o menor custo conhecido ate cada celula.
    const distancias = new Map([[chave(inicioLinha, inicioColuna), 0]]);
    // visitados evita processar novamente uma celula ja finalizada.
    const visitados = new Set();
    // pais guarda de onde cada celula veio, permitindo reconstruir o caminho.
    const pais = new Map();

    // Metricas exibidas no painel para comparar algoritmos.
    let nosVisitados = 0;
    let nosExpandidos = 0;

    while (fila.length > 0) {
        // Dijkstra sempre expande primeiro o menor custo conhecido.
        fila.sort((a, b) => a[2] - b[2]);
        const [linha, coluna, custoAtual] = fila.shift();
        const atual = chave(linha, coluna);

        // Se a mesma celula entrou na fila mais de uma vez, processa so a primeira valida.
        if (visitados.has(atual)) {
            continue;
        }

        visitados.add(atual);
        nosExpandidos++;

        // Ao chegar no objetivo, o custo atual ja e o menor possivel pelo Dijkstra.
        if (linha === objetivoLinha && coluna === objetivoColuna) {
            return {
                encontrou: true,
                pais,
                custoTotal: custoAtual,
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
            const vizinho = matriz[novaLinha][novaColuna];

            // Conta cada vizinho analisado, mesmo que ele nao melhore o caminho.
            nosVisitados++;
            const id = chave(novaLinha, novaColuna);
            const novoCusto = custoAtual + custoCelula(vizinho);

            // Atualiza o caminho ate o vizinho apenas se ele for o melhor encontrado.
            if (!distancias.has(id) || novoCusto < distancias.get(id)) {
                distancias.set(id, novoCusto);
                fila.push([novaLinha, novaColuna, novoCusto]);
                pais.set(id, atual);
            }
        }
    }

    // Se a fila acabou, nao existe rota livre entre inicio e objetivo.
    return {
        encontrou: false,
        pais: null,
        custoTotal: 0,
        nosVisitados,
        nosExpandidos
    };
}

function custoCelula(celula) {
    // Celulas lentas representam terrenos com maior custo de passagem.
    if (celula.classList.contains("lento")) {
        return 5;
    }

    // Celulas comuns custam 1, que equivale a um passo normal.
    return 1;
}

function obterVizinhosValidos(linhas, colunas, matriz, linha, coluna) {
    // Movimento permitido apenas nas quatro direcoes principais.
    const direcoes = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    return direcoes
        // Converte deslocamentos em coordenadas reais na grade.
        .map(([deltaLinha, deltaColuna]) => [
            linha + deltaLinha,
            coluna + deltaColuna
        ])
        .filter(([novaLinha, novaColuna]) => {
            // Descarta coordenadas fora dos limites da matriz.
            if (
                novaLinha < 0 ||
                novaLinha >= linhas ||
                novaColuna < 0 ||
                novaColuna >= colunas
            ) {
                return false;
            }

            // Obstaculos funcionam como paredes e nao entram na lista de vizinhos.
            return !matriz[novaLinha][novaColuna].classList.contains("obstaculo");
        });
}

function reconstruirCaminho(pais, linha, coluna) {
    let atual = `${linha}-${coluna}`;
    let tamanho = 0;

    // Volta do objetivo ate o inicio seguindo o mapa de pais.
    while (pais.has(atual)) {
        const [linhaAtual, colunaAtual] = atual.split("-").map(Number);
        tamanho++;
        atual = pais.get(atual);
    }

    // O tamanho representa quantas ligacoes existem entre inicio e objetivo.
    return tamanho;
}

function aplicarCaminhoNaGrade(matriz, pais, linha, coluna, inicio, objetivo) {
    // Usa o mesmo mapa de pais para pintar o caminho encontrado na interface.
    let atual = `${linha}-${coluna}`;

    // Marca visualmente somente as celulas intermediarias do caminho.
    while (pais.has(atual)) {
        const [linhaAtual, colunaAtual] = atual.split("-").map(Number);
        const celula = matriz[linhaAtual][colunaAtual];

        if (
            celula !== inicio &&
            celula !== objetivo &&
            !celula.classList.contains("inicio") &&
            !celula.classList.contains("objetivo")
        ) {
            // Inicio e objetivo nao recebem a classe caminho para manter cores proprias.
            celula.classList.add("caminho");
        }

        atual = pais.get(atual);
    }

    return reconstruirCaminho(pais, linha, coluna);
}
