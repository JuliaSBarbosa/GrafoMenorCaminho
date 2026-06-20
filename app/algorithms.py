import heapq
import random


DIRECOES = ((-1, 0), (1, 0), (0, -1), (0, 1))


def gerar_grade(tamanho, semente, chance_obstaculo=0.20, chance_lento=0.15):
    """Gera uma grade reproduzivel e preserva uma rota entre inicio e objetivo."""
    gerador = random.Random(semente)
    grade = []

    for linha in range(tamanho):
        nova_linha = []
        for coluna in range(tamanho):
            sorteio = gerador.random()
            if sorteio < chance_obstaculo:
                nova_linha.append("obstaculo")
            elif sorteio < chance_obstaculo + chance_lento:
                nova_linha.append("lento")
            else:
                nova_linha.append("livre")
        grade.append(nova_linha)

    # Mantem a primeira linha e a ultima coluna livres para garantir uma rota.
    for coluna in range(tamanho):
        grade[0][coluna] = "livre"
    for linha in range(tamanho):
        grade[linha][tamanho - 1] = "livre"

    return grade


def custo_celula(celula):
    return 5 if celula == "lento" else 1


def obter_vizinhos(grade, linha, coluna):
    linhas = len(grade)
    colunas = len(grade[0])

    for delta_linha, delta_coluna in DIRECOES:
        nova_linha = linha + delta_linha
        nova_coluna = coluna + delta_coluna
        dentro_da_grade = 0 <= nova_linha < linhas and 0 <= nova_coluna < colunas

        if dentro_da_grade and grade[nova_linha][nova_coluna] != "obstaculo":
            yield nova_linha, nova_coluna


def dijkstra(grade, inicio=(0, 0), objetivo=None):
    """Calcula o menor caminho considerando celulas comuns e lentas."""
    objetivo = objetivo or (len(grade) - 1, len(grade[0]) - 1)
    fila = [(0, inicio)]
    distancias = {inicio: 0}
    visitados = set()
    nos_visitados = 0
    nos_expandidos = 0

    while fila:
        custo_atual, atual = heapq.heappop(fila)
        if atual in visitados:
            continue

        visitados.add(atual)
        nos_expandidos += 1

        if atual == objetivo:
            return _resultado(True, custo_atual, nos_visitados, nos_expandidos)

        for vizinho in obter_vizinhos(grade, *atual):
            nos_visitados += 1
            novo_custo = custo_atual + custo_celula(grade[vizinho[0]][vizinho[1]])

            if novo_custo < distancias.get(vizinho, float("inf")):
                distancias[vizinho] = novo_custo
                heapq.heappush(fila, (novo_custo, vizinho))

    return _resultado(False, 0, nos_visitados, nos_expandidos)


def a_estrela(grade, inicio=(0, 0), objetivo=None):
    """Executa A* usando distancia de Manhattan como heuristica."""
    objetivo = objetivo or (len(grade) - 1, len(grade[0]) - 1)
    fila = [(_manhattan(inicio, objetivo), 0, inicio)]
    custos = {inicio: 0}
    fechados = set()
    nos_visitados = 0
    nos_expandidos = 0

    while fila:
        _, custo_atual, atual = heapq.heappop(fila)
        if atual in fechados:
            continue

        fechados.add(atual)
        nos_expandidos += 1

        if atual == objetivo:
            return _resultado(True, custo_atual, nos_visitados, nos_expandidos)

        for vizinho in obter_vizinhos(grade, *atual):
            nos_visitados += 1
            novo_custo = custo_atual + custo_celula(grade[vizinho[0]][vizinho[1]])

            if novo_custo < custos.get(vizinho, float("inf")):
                custos[vizinho] = novo_custo
                prioridade = novo_custo + _manhattan(vizinho, objetivo)
                heapq.heappush(fila, (prioridade, novo_custo, vizinho))

    return _resultado(False, 0, nos_visitados, nos_expandidos)


def _manhattan(posicao, objetivo):
    return abs(posicao[0] - objetivo[0]) + abs(posicao[1] - objetivo[1])


def _resultado(encontrou, custo_total, nos_visitados, nos_expandidos):
    return {
        "encontrou": encontrou,
        "custo_total": custo_total,
        "nos_visitados": nos_visitados,
        "nos_expandidos": nos_expandidos,
    }
