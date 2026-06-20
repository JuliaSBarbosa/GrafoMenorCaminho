import os
import time

import psutil


def executar_medicao(nome_algoritmo, algoritmo, grade, tamanho, repeticao):
    """Executa um algoritmo e coleta as metricas usadas no laboratorio."""
    processo = psutil.Process(os.getpid())
    memoria_antes = processo.memory_info().rss / 1024 / 1024
    inicio = time.perf_counter()

    resultado = algoritmo(grade)

    tempo_ms = (time.perf_counter() - inicio) * 1000
    memoria_depois = processo.memory_info().rss / 1024 / 1024

    return {
        "algoritmo": nome_algoritmo,
        "tamanho_grade": tamanho,
        "repeticao": repeticao,
        "encontrou_caminho": resultado["encontrou"],
        "custo_total": resultado["custo_total"],
        "tempo_ms": round(tempo_ms, 6),
        "memoria_mb": round(max(0, memoria_depois - memoria_antes), 6),
        "nos_visitados": resultado["nos_visitados"],
        "nos_expandidos": resultado["nos_expandidos"],
    }
