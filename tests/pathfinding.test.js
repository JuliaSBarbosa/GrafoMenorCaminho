const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Simula o classList do navegador para testar os algoritmos no Node.js.
class FakeClassList {
    constructor(classes = []) {
        // Set facilita consultar se uma classe existe sem depender do DOM real.
        this.classes = new Set(classes);
    }

    contains(name) {
        // Imita classList.contains usado pelo codigo da aplicacao.
        return this.classes.has(name);
    }

    add(name) {
        // Imita classList.add para permitir testar pintura de caminho se necessario.
        this.classes.add(name);
    }
}

function criarCelula(classes = []) {
    // Cria uma celula minima com as classes usadas pelos algoritmos.
    return {
        classList: new FakeClassList(classes)
    };
}

function criarMatriz(linhas, colunas, configuracao = {}) {
    // Monta uma matriz de celulas e aplica classes nas coordenadas informadas.
    return Array.from({ length: linhas }, (_, linha) =>
        Array.from({ length: colunas }, (_, coluna) => {
            const chave = `${linha}-${coluna}`;
            return criarCelula(configuracao[chave] || []);
        })
    );
}

function carregarAlgoritmos() {
    // Executa os arquivos em um contexto isolado para acessar funcoes globais.
    const contexto = { console };
    vm.createContext(contexto);

    // pathfinding precisa ser carregado antes porque o A* usa funcoes dele.
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
    // Obstaculos devem ser ignorados na lista de vizinhos validos.
    const matriz = criarMatriz(3, 3, {
        "0-1": ["obstaculo"]
    });

    const vizinhos = obterVizinhosValidos(3, 3, matriz, 0, 0);
    // Saindo do canto superior esquerdo, direita esta bloqueada e baixo esta livre.
    assert.deepStrictEqual(JSON.parse(JSON.stringify(vizinhos)), [[1, 0]]);
}

{
    // Dijkstra deve preferir o desvio quando a celula direta e lenta.
    const matriz = criarMatriz(3, 3, {
        "0-1": ["lento"]
    });

    const resultado = dijkstraBusca(3, 3, matriz, 0, 0, 0, 2);
    // O algoritmo deve encontrar caminho e evitar a celula lenta de custo 5.
    assert.strictEqual(resultado.encontrou, true);
    // O desvio pelo caminho normal custa 4 passos, menor que passar direto pelo lento.
    assert.strictEqual(resultado.custoTotal, 4);
}

{
    // A* deve manter o mesmo custo otimo esperado para o mesmo mapa.
    const matriz = criarMatriz(3, 3, {
        "0-1": ["lento"]
    });

    const resultado = aStar(3, 3, matriz, 0, 0, 0, 2);
    // A* deve chegar ao mesmo resultado otimo do Dijkstra.
    assert.strictEqual(resultado.encontrou, true);
    // Este teste garante que a heuristica nao sacrifica o menor custo.
    assert.strictEqual(resultado.custoTotal, 4);
}

{
    // Se o inicio estiver bloqueado por obstaculos, nao existe caminho.
    const matriz = criarMatriz(3, 3, {
        "0-1": ["obstaculo"],
        "1-0": ["obstaculo"]
    });

    const resultado = dijkstraBusca(3, 3, matriz, 0, 0, 2, 2);
    // Como as duas saidas do inicio estao bloqueadas, a busca deve falhar.
    assert.strictEqual(resultado.encontrou, false);
}

console.log("Todos os testes de pathfinding passaram.");
