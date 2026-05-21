/**
 * RF02 — Gera labirinto em grade (0 = livre, 1 = parede).
 * Algoritmo: backtracking recursivo (paredes entre celulas).
 * Funciona melhor com dimensoes impares; pares sao ajustadas para o maior impar <= N.
 */
function gerarLabirinto(linhas, colunas) {
    const rows = ajustarDimensaoImpar(linhas);
    const cols = ajustarDimensaoImpar(colunas);

    const grade = Array.from({ length: rows }, () =>
        Array(cols).fill(1)
    );

    const pilha = [[1, 1]];
    grade[1][1] = 0;

    const direcoes = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];

    while (pilha.length > 0) {
        const [linha, coluna] = pilha[pilha.length - 1];
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
            pilha.pop();
            continue;
        }

        const [novaLinha, novaColuna] = vizinhos[0];
        const meioLinha = linha + (novaLinha - linha) / 2;
        const meioColuna = coluna + (novaColuna - coluna) / 2;

        grade[meioLinha][meioColuna] = 0;
        grade[novaLinha][novaColuna] = 0;
        pilha.push([novaLinha, novaColuna]);
    }

    return redimensionarGrade(grade, linhas, colunas);
}

function ajustarDimensaoImpar(n) {
    if (n < 5) return 5;
    return n % 2 === 0 ? n - 1 : n;
}

function redimensionarGrade(grade, linhasAlvo, colunasAlvo) {
    const resultado = Array.from({ length: linhasAlvo }, () =>
        Array(colunasAlvo).fill(1)
    );

    for (let r = 0; r < linhasAlvo; r++) {
        for (let c = 0; c < colunasAlvo; c++) {
            if (r < grade.length && c < grade[0].length) {
                resultado[r][c] = grade[r][c];
            }
        }
    }

    resultado[0][0] = 0;
    resultado[linhasAlvo - 1][colunasAlvo - 1] = 0;

    return resultado;
}

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}
