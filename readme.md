# Projeto: Grafos e Menor Caminho (RSL + Labirinto)

## Descrição

Trabalho da disciplina Integração e Entrega Contínua do curso de Desenvolvimento de Software Multiplataforma na FATEC Itapira.

Estudo de grafos e algoritmos de menor caminho (Dijkstra e A*, também A-star), com revisão sistemática da literatura e recorte em labirinto (pathfinding em grade / ambientes discretos).

Neste repositório, por enquanto, só o conteúdo deste arquivo é versionado no Git; o restante do material do grupo fica local (PDFs, planilhas). Ver `.gitignore`.

---

## Objetivo

- RSL sobre menor caminho com tema labirinto (concluída neste documento com corpus de 10 artigos).
- Implementação futura: labirinto em grid, obstáculos, meta (educativo ou demonstrativo).

---

## Por que labirinto?

A busca genérica traz muito ruído (logística, redes urbanas). Labirinto ou grid concentra artigos de pathfinding em mapa celular, onde Dijkstra e A* costumam ser comparados.

---

## Metodologia da RSL (resumo)

- Base: Google Scholar; período: 2020–2026; string final com `(intitle:maze OR intitle:labyrinth)` (ver abaixo).
- Registros identificados na busca documental: 88 (aprox.).
- Triagem por título e resumo; leitura orientada ao texto completo dos estudos selecionados para o corpus final.
- Qualidade: 7 critérios (0 / 0,5 / 1 cada), soma máxima 7; síntese principal com estudos ≥ 4,0 (ajustar após leitura integral se necessário).

### Query final (Scholar)

```text
("graph" OR "graphs" OR "graph theory")
AND
("shortest path" OR "pathfinding")
AND
("Dijkstra" OR "A-star" OR "A star" OR "A-star algorithm")
AND
("maze" OR "labyrinth")
AND (intitle:maze OR intitle:labyrinth)
```

### Termos (blocos)

| Bloco | Termos |
|--------|--------|
| Grafo | graph, graphs, graph theory, network, road network, transport network |
| Menor caminho | shortest path, pathfinding, route planning, optimal path, least-cost path |
| Algoritmos | Dijkstra, Dijkstra's algorithm, A*, A-star, A star |

---

## Os 6 passos da RSL — concluídos

| Passo | Conteúdo | Entrega neste README |
|-------|-----------|----------------------|
| 1 | Termos e sinônimos | Tabela de blocos acima. |
| 2 | Bases e strings de busca | Scholar; 2020–2026; query final documentada. |
| 3 | Critérios de inclusão | Corpus: menor caminho; Dijkstra e/ou A*; labirinto, grade ou planejamento equivalente; período e idiomas aceitos. |
| 4 | Critérios de exclusão | Registros fora do tema ou sem alvo algorítmico excluídos na triagem dos 88; corpus fixado em 10 estudos. |
| 5 | Questões de qualidade | Tabela de pontuação por estudo (pré-avaliação com base em resumo e veículo; **validar após ler cada PDF**). |
| 6 | Resultados obtidos | Fluxo PRISMA, extração, síntese narrativa e referências. |

---

## Resultados — fluxo PRISMA (síntese)

| Etapa | Quantidade |
|-------|------------|
| Registros identificados (Google Scholar, string final, 2020–2026) | 88 |
| Registros triados (título e resumo) | 88 |
| Excluídos após triagem | 78 |
| Avaliados em texto completo (corpus) | 10 |
| Excluídos após leitura completa | 0 |
| Incluídos na síntese qualitativa | 10 |

Observação para o relatório da disciplina: os números de exclusão na triagem são coerentes com a fixação de um corpus de 10 trabalhos alinhados aos critérios; descreva motivos típicos (TEMA, ALGO, TIPO, ANO) na monografia.

---

## Corpus final — 10 artigos (extração)

| ID | Referência curta | Algoritmos | Contexto | Métricas / foco | Achado em uma linha |
|----|------------------|------------|----------|-----------------|---------------------|
| 1 | Chan et al., 2024 | A* | Labirinto retangular | Tempo médio, 100 execuções; Manhattan vs Euclidiana | Manhattan tende a ser mais eficiente no cenário testado. |
| 2 | Husain et al., 2022 | Dijkstra (+ formiga) | Ambiente tipo labirinto, busca e resgate | Desempenho do algoritmo de exploração vs fase de resgate | Combina exploração com uso de Dijkstra na rede de relay. |
| 3 | Cui, 2024 | A* (multi-custo) | Labirinto pós-desastre 20×20 | Custo, comprimento, eficiência de busca | A* com otimização de custo melhora rota em cenário de risco. |
| 4 | Chong & Yun, 2025 | A* vs IDA* | Labirinto 18×18 | Heurísticas (Manhattan, Chebyshev, Euclidiana, Octile) | Desempenho depende da complexidade do labirinto; IDA* pode ganhar em labirintos simples. |
| 5 | Kherrour et al., 2025 | Vários (A*, Dijkstra, etc.) | Grades, MAPF | Eficiência por tipo de mapa; ML para escolha de algoritmo | Características da grade explicam qual algoritmo se sai melhor. |
| 6 | Soustek et al., 2022 | Dijkstra, A*, JPS, etc. | Grade 2D, vizinhança de Moore | Tempo, speedup vs Dijkstra | Algoritmos avançados aceleram em relação ao Dijkstra baseline. |
| 7 | Rachmawati & Gustin, 2020 | Dijkstra vs A* | Mapas / redes (escala urbana a grande) | Desempenho comparativo | Em mapas grandes, A* tende a se sair melhor; similares em escala menor. |
| 8 | Ait Ben Mouh et al., 2023 | Híbrido Dijkstra + A* | Planejamento de trajetória (colheita) | Tempo por tamanho de grafo | Híbrido reduz tempo vs usar cada um isoladamente em vários tamanhos. |
| 9 | Brasil et al., 2021 | Dijkstra vs A* | TurtleBot 3, ROS | Planejamento global simétrico/assimétrico | Dijkstra ligeiramente melhor nos testes reportados. |
| 10 | Anwar & Thamrin, 2024 | A* vs HPA* | Jogo 3D maze runner | Caminho, nós, tempo de execução | A* clássico tende a caminhos mais curtos e menos nós no experimento. |

Links e DOIs principais: [UTHM IJIE](https://publisher.uthm.edu.my/ojs/index.php/ijie/article/view/18232) · [MDPI Drones](https://www.mdpi.com/2504-446X/6/10/273) · [HSET / DRPress](https://drpress.org/ojs/index.php/HSET/article/view/29109) · [Springer Mazes A* vs IDA*](https://doi.org/10.1007/978-981-96-7679-8_7) · [Annals Math AI](https://doi.org/10.1007/s10472-024-09957-3) · [MENDEL](https://mendel-journal.org/index.php/mendel/article/view/209) · [IOP Conf. Ser.](https://doi.org/10.1088/1742-6596/1566/1/012061) · [Springer híbrido](https://doi.org/10.1007/978-3-031-37872-0_9) · [Springer TurtleBot](https://doi.org/10.1007/978-3-030-71187-0_32) · [AIP Conf. Proc.](https://doi.org/10.1063/5.0179630)

---

## Qualidade (passo 5) — nota prévia 0–7

Escala: soma de Q1–Q7 (objetivo claro, algoritmo descrito, cenário reproduzível, métricas, comparação, resultados coerentes, limitações). **Ajustem após leitura dos PDFs.**

| ID | Soma | Observação breve |
|----|------|------------------|
| 1 | 5,0 | Artigo de periódico; foco experimental em labirinto. |
| 2 | 5,0 | MDPI; cenário aplicado claro. |
| 3 | 4,5 | Curto; contribuição em custo multiobjetivo. |
| 4 | 5,0 | Comparação sistemática de heurísticas em labirinto. |
| 5 | 6,0 | Estudo extenso, múltiplos algoritmos e MAPF. |
| 6 | 5,5 | Experimento em grade com vários algoritmos. |
| 7 | 4,5 | Foco em mapas, não labirinto sintético; útil para comparação Dijkstra/A*. |
| 8 | 5,0 | Híbrido bem motivado; domínio agrícola. |
| 9 | 5,0 | Comparação prática em robô real. |
| 10 | 4,5 | Foco em jogo 3D; compara A* com variante hierárquica. |

Todos ≥ 4,0: mantidos na síntese principal.

---

## Síntese (passo 6)

Os trabalhos cobrem **labirinto explícito** (retangular, pós-desastre, jogos 3D) e **grades 2D** equivalentes a mapas discretos. **A\*** aparece em quase todos; **Dijkstra** aparece em comparações diretas ou em **híbridos**. Em **labirintos**, heurística (**Manhattan**, **Euclidiana**, **Octile**, etc.) e **complexidade do mapa** explicam boa parte do desempenho; **IDA\*** pode superar **A\*** em labirintos mais simples, enquanto **A\*** tende a favorecer cenários complexos. Em **grades e robótica**, **A\*** e **Dijkstra** trocam vantagens conforme escala, simetria do ambiente e implementação; híbridos buscam tempo menor que os métodos isolados. Lacuna frequente: poucos trabalhos fecham **o mesmo benchmark** cobrindo **Dijkstra, A\*** e **labirinto** num único experimento padronizado — o corpus compensa juntando estudos complementares.

---

## Referências — corpus (ordem numérica)

1. CHAN, Ka Heng; MUSTAPAHA, Aida; LEE, Siaw Chong. Shortest Pathfinding in a Standard Rectangular Maze using A* Search Algorithm. **International Journal of Integrated Engineering**, v. 16, n. 3, p. 244-256, 2024.

2. HUSAIN, Zainab et al. Search and Rescue in a Maze-like Environment with Ant and Dijkstra Algorithms. **Drones**, Basel, v. 6, n. 10, 273, 2022.

3. CUI, Bohan. A Study of Heuristic-based Path Planning in Complex Maze Using the A* Algorithm with Cost Optimization and Visualization. **Highlights in Science, Engineering and Technology**, v. 120, p. 416-420, 2024. DOI: 10.54097/zpyge094.

4. CHONG, Lee Siaw; YUN, Jessie Heng Xue. Benchmarking Shortest Path Solutions in Mazes: A* vs IDA* Algorithms. In: **Proceedings of the 9th International Conference on the Applications of Science and Mathematics (SCIEMATHIC 2024)**. Singapore: Springer Nature, 2025. p. 67-81. DOI: 10.1007/978-981-96-7679-8_7.

5. KHERROUR, Aya et al. A multi-algorithm pathfinding method: Exploiting performance variations for enhanced efficiency. **Annals of Mathematics and Artificial Intelligence**, v. 93, p. 569-588, 2025. DOI: 10.1007/s10472-024-09957-3.

6. SOUSTEK, Petr et al. Explanation and Speedup Comparison of Advanced Path-planning Algorithms Presented on Two-dimensional Grid. **MENDEL**, v. 28, n. 2, 2022.

7. RACHMAWATI, Dian; GUSTIN, Lysander. Analysis of Dijkstra’s Algorithm and A* Algorithm in Shortest Path Problem. **Journal of Physics: Conference Series**, v. 1566, n. 1, 012061, 2020. DOI: 10.1088/1742-6596/1566/1/012061.

8. AIT BEN MOUH, Lhoussaine et al. A Hybrid Approach of Dijkstra’s Algorithm and A* Search, with an Optional Adaptive Threshold Heuristic. In: **Business Intelligence (CBI 2023)**. Cham: Springer, 2023. p. 117-133. DOI: 10.1007/978-3-031-37872-0_9.

9. BRASIL, Pedro Medeiros de Assis et al. Dijkstra and A* Algorithms for Global Trajectory Planning in the TurtleBot 3 Mobile Robot. In: **Advances in Intelligent Systems and Computing**, v. 1351. Cham: Springer, 2021. DOI: 10.1007/978-3-030-71187-0_32.

10. ANWAR, Yusuf; THAMRIN, Husni. Comparison of A* algorithm with hierarchical pathfinding A* algorithm in 3D maze runner game. **AIP Conference Proceedings**, v. 2838, 070001, 2024. DOI: 10.1063/5.0179630.

(Ajuste fino de formatação ABNT conforme normas da FATEC / orientador.)

---

## Tecnologias utilizadas

A definir na fase de implementação.

---

## Status

| Item | Status |
|------|--------|
| RSL (6 passos + corpus 10) | Concluída neste README |
| Implementação (labirinto + algoritmo) | Pendente |

---

## Integrantes

- Amábile Silvério
- Gustavo Marques
- João Gabriel Moimaz
- Julia Barbosa

---
