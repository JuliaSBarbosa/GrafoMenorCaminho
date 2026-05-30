/**
 * RF09 — Painel de metricas da busca de caminho.
 */
function exibirMetricasPainel({
    algoritmo,
    tempoMs,
    nosVisitados,
    nosExpandidos,
    tamanhoCaminho,
    custoTotal,
    encontrou
}) {
    // O painel fica no HTML e recebe o resultado da ultima busca.
    const painel = document.getElementById("painel-metricas");

    // Se a pagina nao tiver o painel, a funcao simplesmente nao faz nada.
    if (!painel) return;

    // Quando nao ha caminho, o painel mostra somente metricas da tentativa.
    if (!encontrou) {
        painel.innerHTML = `
            <p class="metrica-alerta">Nenhum caminho encontrado.</p>
            <p><strong>Algoritmo:</strong> ${nomeAlgoritmo(algoritmo)}</p>
            <p><strong>Tempo:</strong> ${tempoMs.toFixed(2)} ms</p>
            <p><strong>Nos visitados:</strong> ${nosVisitados}</p>
            <p><strong>Nos expandidos:</strong> ${nosExpandidos}</p>
            <p><strong>Custo total:</strong> ${custoTotal}</p>
        `;
        // O return evita renderizar o bloco de sucesso logo abaixo.
        return;
    }

    // Quando ha caminho, inclui tambem comprimento e custo final.
    painel.innerHTML = `
        <p><strong>Algoritmo:</strong> ${nomeAlgoritmo(algoritmo)}</p>
        <p><strong>Tempo de execucao:</strong> ${tempoMs.toFixed(2)} ms</p>
        <p><strong>Nos visitados:</strong> ${nosVisitados}</p>
        <p><strong>Nos expandidos:</strong> ${nosExpandidos}</p>
        <p><strong>Comprimento do caminho:</strong> ${tamanhoCaminho} celulas</p>
        <p><strong>Custo total:</strong> ${custoTotal}</p>
    `;
}

function limparMetricasPainel() {
    // Remove resultados antigos quando a grade ou a selecao muda.
    const painel = document.getElementById("painel-metricas");
    // A verificacao evita erro caso o elemento nao exista no HTML.
    if (painel) painel.innerHTML = "";
}

function nomeAlgoritmo(id) {
    // Converte o id usado no select para um nome amigavel no painel.
    if (id === "astar") return "A* (Manhattan)";
    return "Dijkstra";
}
