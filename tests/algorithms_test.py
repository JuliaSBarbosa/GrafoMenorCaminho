import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "app"))

from algorithms import a_estrela, dijkstra, gerar_grade


class AlgoritmosTest(unittest.TestCase):
    """Valida os algoritmos usados pelo laboratorio Docker."""

    def test_dijkstra_e_a_estrela_encontram_o_mesmo_custo(self):
        grade = gerar_grade(20, semente=2001)

        resultado_dijkstra = dijkstra(grade)
        resultado_a_estrela = a_estrela(grade)

        self.assertTrue(resultado_dijkstra["encontrou"])
        self.assertTrue(resultado_a_estrela["encontrou"])
        self.assertEqual(
            resultado_dijkstra["custo_total"],
            resultado_a_estrela["custo_total"],
        )

    def test_algoritmos_respeitam_celulas_lentas(self):
        grade = [
            ["livre", "lento", "livre"],
            ["livre", "livre", "livre"],
            ["obstaculo", "obstaculo", "livre"],
        ]

        self.assertEqual(dijkstra(grade)["custo_total"], 4)
        self.assertEqual(a_estrela(grade)["custo_total"], 4)


if __name__ == "__main__":
    unittest.main()
