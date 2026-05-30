/**
 * RF02 — Gera labirinto em grade (0 = livre, 1 = parede).
 * Algoritmo: backtracking recursivo (paredes entre celulas).
 * Funciona melhor com dimensoes impares; pares sao ajustadas para o maior impar <= N.
 */
function gerarLabirinto(linhas, colunas) {
    // Ajusta as dimensoes usadas internamente para o algoritmo do labirinto.
    const rows = ajustarDimensaoImpar(linhas);
    const cols = ajustarDimensaoImpar(colunas);

    // Comeca com tudo como parede e abre caminhos durante o backtracking.
    const grade = Array.from({ length: rows }, () =>
        Array(cols).fill(1)
    );

    const pilha = [[1, 1]];
    // A posicao inicial interna e aberta para comecar a escavacao.
    grade[1][1] = 0;

    // Os passos sao de 2 em 2 para deixar uma parede entre duas celulas.
    const direcoes = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    while (pilha.length > 0) {
        const [linha, coluna] = pilha[pilha.length - 1];
        // Procura vizinhos ainda fechados pulando de dois em dois para manter paredes entre celulas.
        const vizinhos = embaralhar(direcoes)
            .map(([dl, dc]) => [linha + dl, coluna + dc])
            .filter(([nl, nc]) =>
                nl > 0 &&
                nl < rows - 1 &&
                nc > 0 &&
                nc < cols - 1 &&
                grade[nl][nc] === 1
            );

        if (vizinhos.length === 0) {
            // Sem vizinhos livres para abrir, volta para a celula anterior.
            pilha.pop();
            continue;
        }

        const [novaLinha, novaColuna] = vizinhos[0];
        // Abre a parede intermediaria e depois a nova celula do labirinto.
        const meioLinha = linha + (novaLinha - linha) / 2;
        const meioColuna = coluna + (novaColuna - coluna) / 2;

        grade[meioLinha][meioColuna] = 0;
        grade[novaLinha][novaColuna] = 0;
        // A nova celula entra na pilha para continuar abrindo caminhos a partir dela.
        pilha.push([novaLinha, novaColuna]);
    }

    // Depois de gerar internamente, adapta para o tamanho pedido pelo usuario.
    return redimensionarGrade(grade, linhas, colunas);
}

function ajustarDimensaoImpar(n) {
    // O algoritmo precisa de bordas e funciona melhor com dimensoes impares.
    if (n < 5) return 5;
    return n % 2 === 0 ? n - 1 : n;
}

function redimensionarGrade(grade, linhasAlvo, colunasAlvo) {
    // Copia o labirinto gerado para o tamanho solicitado pela interface.
    const resultado = Array.from({ length: linhasAlvo }, () =>
        Array(colunasAlvo).fill(1)
    );

    for (let r = 0; r < linhasAlvo; r++) {
        for (let c = 0; c < colunasAlvo; c++) {
            // Copia so as posicoes que existem na grade original.
            if (r < grade.length && c < grade[0].length) {
                resultado[r][c] = grade[r][c];
            }
        }
    }

    resultado[0][0] = 0;
    resultado[linhasAlvo - 1][colunasAlvo - 1] = 0;

    // Garante que os cantos possam ser usados como pontos livres.
    return resultado;
}

function embaralhar(lista) {
    // Fisher-Yates: muda a ordem das direcoes para gerar labirintos variados.
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Troca dois itens de posicao para embaralhar sem perder valores.
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}
