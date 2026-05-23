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
    const painel = document.getElementById("painel-metricas");
    if (!painel) return;

    if (!encontrou) {
        painel.innerHTML = `
            <p class="metrica-alerta">Nenhum caminho encontrado.</p>
            <p><strong>Algoritmo:</strong> ${nomeAlgoritmo(algoritmo)}</p>
            <p><strong>Tempo:</strong> ${tempoMs.toFixed(2)} ms</p>
            <p><strong>Nos visitados:</strong> ${nosVisitados}</p>
            <p><strong>Nos expandidos:</strong> ${nosExpandidos}</p>
            <p><strong>Custo total:</strong> ${custoTotal}</p>
        `;
        return;
    }

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
    const painel = document.getElementById("painel-metricas");
    if (painel) painel.innerHTML = "";
}

function nomeAlgoritmo(id) {
    if (id === "astar") return "A* (Manhattan)";
    return "Dijkstra";
}
