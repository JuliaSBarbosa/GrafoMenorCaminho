const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

class FakeClassList {
    constructor(classes = []) {
        this.classes = new Set(classes);
    }

    contains(name) {
        return this.classes.has(name);
    }

    add(name) {
        this.classes.add(name);
    }
}

function criarCelula(classes = []) {
    return {
        classList: new FakeClassList(classes)
    };
}

function criarMatriz(linhas, colunas, configuracao = {}) {
    return Array.from({ length: linhas }, (_, linha) =>
        Array.from({ length: colunas }, (_, coluna) => {
            const chave = `${linha}-${coluna}`;
            return criarCelula(configuracao[chave] || []);
        })
    );
}

function carregarAlgoritmos() {
    const contexto = { console };
    vm.createContext(contexto);

    for (const arquivo of ["js/pathfinding.js", "js/astar.js"]) {
        const conteudo = fs.readFileSync(
            path.join(__dirname, "..", arquivo),
            "utf8"
        );
        vm.runInContext(conteudo, contexto, { filename: arquivo });
    }

    return contexto;
}

const {
    obterVizinhosValidos,
    dijkstraBusca,
    aStar
} = carregarAlgoritmos();

{
    const matriz = criarMatriz(3, 3, {
        "0-1": ["obstaculo"]
    });

    const vizinhos = obterVizinhosValidos(3, 3, matriz, 0, 0);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(vizinhos)), [[1, 0]]);
}

{
    const matriz = criarMatriz(3, 3, {
        "0-1": ["lento"]
    });

    const resultado = dijkstraBusca(3, 3, matriz, 0, 0, 0, 2);
    assert.strictEqual(resultado.encontrou, true);
    assert.strictEqual(resultado.custoTotal, 4);
}

{
    const matriz = criarMatriz(3, 3, {
        "0-1": ["lento"]
    });

    const resultado = aStar(3, 3, matriz, 0, 0, 0, 2);
    assert.strictEqual(resultado.encontrou, true);
    assert.strictEqual(resultado.custoTotal, 4);
}

{
    const matriz = criarMatriz(3, 3, {
        "0-1": ["obstaculo"],
        "1-0": ["obstaculo"]
    });

    const resultado = dijkstraBusca(3, 3, matriz, 0, 0, 2, 2);
    assert.strictEqual(resultado.encontrou, false);
}

console.log("Todos os testes de pathfinding passaram.");
