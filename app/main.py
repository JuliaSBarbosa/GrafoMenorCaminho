import json
import os
from pathlib import Path

import pandas as pd

from algorithms import a_estrela, dijkstra, gerar_grade
from graph_generator import gerar_graficos
from metrics import executar_medicao


TAMANHOS = (10, 20, 30, 40, 50)
REPETICOES = 3
ALGORITMOS = (("Dijkstra", dijkstra), ("A*", a_estrela))
DIRETORIO_SAIDA = Path(
    os.getenv("OUTPUT_DIR", Path(__file__).resolve().parent.parent / "output")
)


def executar_experimento():
    resultados = []
    DIRETORIO_SAIDA.mkdir(parents=True, exist_ok=True)

    print("\nIniciando analise de Dijkstra e A*...")

    for tamanho in TAMANHOS:
        for repeticao in range(1, REPETICOES + 1):
            # A mesma grade e usada pelos dois algoritmos para manter a comparacao justa.
            grade = gerar_grade(tamanho, semente=tamanho * 100 + repeticao)

            for nome, algoritmo in ALGORITMOS:
                medicao = executar_medicao(nome, algoritmo, grade, tamanho, repeticao)
                resultados.append(medicao)
                print(
                    f"{nome:8} | grade {tamanho:2}x{tamanho:2} | "
                    f"repeticao {repeticao} | {medicao['tempo_ms']:.6f} ms"
                )

    df = pd.DataFrame(resultados)
    df.to_csv(DIRETORIO_SAIDA / "metrics.csv", index=False)

    resumo = _criar_resumo(df)
    with open(DIRETORIO_SAIDA / "metrics.json", "w", encoding="utf-8") as arquivo:
        json.dump(resumo, arquivo, indent=4, ensure_ascii=False)

    _gerar_relatorio_markdown(df)
    gerar_graficos(df, DIRETORIO_SAIDA)

    print("\nArquivos gerados em /output:")
    print("- metrics.csv")
    print("- metrics.json")
    print("- metrics.md")
    print("- performance_graph.png")
    print("- iterations_graph.png")


def _criar_resumo(df):
    resumo = {
        "tamanhos_testados": list(TAMANHOS),
        "repeticoes_por_tamanho": REPETICOES,
        "algoritmos": {},
    }

    for algoritmo, dados in df.groupby("algoritmo"):
        resumo["algoritmos"][algoritmo] = {
            "tempo_medio_ms": round(dados["tempo_ms"].mean(), 6),
            "memoria_media_mb": round(dados["memoria_mb"].mean(), 6),
            "nos_visitados_media": round(dados["nos_visitados"].mean(), 2),
            "nos_expandidos_media": round(dados["nos_expandidos"].mean(), 2),
        }

    return resumo


def _gerar_relatorio_markdown(df):
    """Cria uma versao das metricas mais confortavel para leitura no VS Code."""
    medias_gerais = (
        df.groupby("algoritmo", as_index=False)
        .agg(
            tempo_ms=("tempo_ms", "mean"),
            memoria_mb=("memoria_mb", "mean"),
            nos_visitados=("nos_visitados", "mean"),
            nos_expandidos=("nos_expandidos", "mean"),
        )
    )
    medias_tamanho = (
        df.groupby(["algoritmo", "tamanho_grade"], as_index=False)
        .agg(
            tempo_ms=("tempo_ms", "mean"),
            nos_visitados=("nos_visitados", "mean"),
            nos_expandidos=("nos_expandidos", "mean"),
        )
    )

    linhas = [
        "# Relatorio de metricas",
        "",
        "Resultados dos algoritmos Dijkstra e A* executados pelo container Docker.",
        "",
        "## Resumo geral",
        "",
        "| Algoritmo | Tempo medio (ms) | Memoria media (MB) | Nos visitados | Nos expandidos |",
        "|---|---:|---:|---:|---:|",
    ]

    for registro in medias_gerais.itertuples(index=False):
        linhas.append(
            f"| {registro.algoritmo} | {registro.tempo_ms:.3f} | "
            f"{registro.memoria_mb:.6f} | {registro.nos_visitados:.2f} | "
            f"{registro.nos_expandidos:.2f} |"
        )

    linhas.extend(
        [
            "",
            "## Medias por tamanho da grade",
            "",
            "| Algoritmo | Grade | Tempo medio (ms) | Nos visitados | Nos expandidos |",
            "|---|---:|---:|---:|---:|",
        ]
    )

    for registro in medias_tamanho.itertuples(index=False):
        linhas.append(
            f"| {registro.algoritmo} | {registro.tamanho_grade}x{registro.tamanho_grade} | "
            f"{registro.tempo_ms:.3f} | {registro.nos_visitados:.2f} | "
            f"{registro.nos_expandidos:.2f} |"
        )

    linhas.extend(
        [
            "",
            "## Execucoes individuais",
            "",
            "| Algoritmo | Grade | Repeticao | Caminho | Custo | Tempo (ms) | Memoria (MB) | Visitados | Expandidos |",
            "|---|---:|---:|:---:|---:|---:|---:|---:|---:|",
        ]
    )

    for registro in df.itertuples(index=False):
        caminho = "Sim" if registro.encontrou_caminho else "Nao"
        linhas.append(
            f"| {registro.algoritmo} | {registro.tamanho_grade}x{registro.tamanho_grade} | "
            f"{registro.repeticao} | {caminho} | {registro.custo_total} | "
            f"{registro.tempo_ms:.6f} | {registro.memoria_mb:.6f} | "
            f"{registro.nos_visitados} | {registro.nos_expandidos} |"
        )

    arquivo = DIRETORIO_SAIDA / "metrics.md"
    arquivo.write_text("\n".join(linhas) + "\n", encoding="utf-8")


if __name__ == "__main__":
    executar_experimento()
