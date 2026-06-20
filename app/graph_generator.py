import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt


def gerar_graficos(df, diretorio_saida):
    """Gera os dois graficos definidos na orientacao do laboratorio."""
    medias = (
        df.groupby(["algoritmo", "tamanho_grade"], as_index=False)
        .agg(tempo_ms=("tempo_ms", "mean"), nos_expandidos=("nos_expandidos", "mean"))
    )

    _gerar_grafico(
        medias,
        "tempo_ms",
        "Tempo medio (ms)",
        "Tempo de execucao por tamanho da grade",
        diretorio_saida / "performance_graph.png",
    )
    _gerar_grafico(
        medias,
        "nos_expandidos",
        "Nos expandidos",
        "Nos expandidos por tamanho da grade",
        diretorio_saida / "iterations_graph.png",
    )


def _gerar_grafico(df, coluna, rotulo_y, titulo, arquivo):
    plt.figure(figsize=(10, 6))

    for algoritmo, dados in df.groupby("algoritmo"):
        dados = dados.sort_values("tamanho_grade")
        plt.plot(dados["tamanho_grade"], dados[coluna], marker="o", label=algoritmo)

    plt.title(titulo)
    plt.xlabel("Tamanho da grade (N x N)")
    plt.ylabel(rotulo_y)
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    plt.savefig(arquivo)
    plt.close()
