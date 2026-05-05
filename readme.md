# Projeto: Grafos e Menor Caminho (RSL + Labirinto)

## Descrição

Trabalho da disciplina Integração e Entrega Contínua do curso de Desenvolvimento de Software Multiplataforma na FATEC Itapira.

O foco é estudar grafos e algoritmos de menor caminho (Dijkstra e A*, também escrito A-star), com uma revisão sistemática da literatura e um recorte em labirinto: pathfinding em grade e ambientes discretos.

---

## Objetivo

- Fazer a RSL sobre menor caminho em grafos com tema labirinto.
- Depois, implementar algo alinhado a isso (labirinto em grid, obstáculos, ponto de chegada; pode ser algo educativo ou demonstrativo).

---

## Por que labirinto?

A primeira busca genérica puxa muita coisa que não interessa (logística em rede urbana, etc.). Labirinto ou grid ajuda a filtrar artigos que falam de caminho em mapa tipo grade, que é onde Dijkstra e A* costumam aparecer juntos em tutorial e comparação.

Também facilita montar uma parte visual no projeto (desenhar o labirinto e o caminho encontrado).

---

## Revisão sistemática da literatura

### Query inicial (busca ampla)

Primeira varredura nas bases:

```text
("graph" OR "graphs" OR "graph theory" OR "network" OR "road network" OR "transport network")
AND
("shortest path" OR "shortest-path" OR "path finding" OR "pathfinding" OR "route planning" OR "optimal path" OR "least-cost path")
AND
("Dijkstra" OR "Dijkstra's algorithm" OR "A-star" OR "A star" OR "A-star algorithm")
```

### Termos e sinônimos (blocos)

| Bloco | Termos |
|--------|--------|
| Grafo | graph, graphs, graph theory, network, road network, transport network |
| Menor caminho | shortest path, pathfinding, route planning, optimal path, least-cost path |
| Algoritmos | Dijkstra, Dijkstra's algorithm, A*, A-star, A star |
| Contexto (opcional) | urban mobility, logistics, robotics, navigation, GIS, traffic, indoor navigation |

### Resultados brutos da query inicial (aproximado)

| Base | Registros |
|------|-----------|
| Google Scholar | ~18.000 |
| ScienceDirect | 9.102 |
| IEEE Xplore | 2.272 |
| ACM Digital Library | 5.484 |
| SpringerLink | 4.230 |

Os números mudam conforme a data da busca e os filtros (ano, tipo de documento). Vale anotar na wiki quando rodou e o que filtrou.

### Query refinada (recorte labirinto)

Mesmos três blocos de cima, mais um quarto bloco para maze / grid:

```text
("graph" OR "graphs" OR "graph theory" OR "network" OR "road network" OR "transport network")
AND
("shortest path" OR "shortest-path" OR "path finding" OR "pathfinding" OR "route planning" OR "optimal path" OR "least-cost path")
AND
("Dijkstra" OR "Dijkstra's algorithm" OR "A-star" OR "A star" OR "A-star algorithm")
AND
("maze" OR "labyrinth" OR "grid world" OR "grid-based" OR "grid map" OR "maze solving")
```

Se em alguma base vier pouco resultado, dá para afrouxar o último bloco (tirar um sinônimo de cada vez) e registrar na wiki o que mudou.

---

## Tecnologias utilizadas

A definir (linguagem, libs de grafo, interface, etc.).

---

## Status do projeto

| Item | Status |
|------|--------|
| RSL — query ampla | Feita |
| RSL — refinamento (labirinto) | Em andamento |
| Implementação (labirinto + algoritmo) | Pendente |

---

## Estrutura do repositório

| Caminho | Conteúdo |
|---------|----------|
| README.md | Resumo do projeto e strings de busca |
| Wiki do GitHub | RSL (critérios, triagem, PRISMA, extração) |

---

## Documentação

O detalhe da RSL fica na Wiki: termos, bases, inclusão/exclusão, qualidade, resultados.

---

## Integrantes

- Amábile Silvério
- Gustavo Marques
- João Gabriel Moimaz
- Julia Barbosa

---
