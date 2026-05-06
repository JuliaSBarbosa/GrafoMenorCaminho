# Projeto: Grafos e Menor Caminho (RSL + Labirinto)

## Descrição

Trabalho da disciplina Integração e Entrega Contínua do curso de Desenvolvimento de Software Multiplataforma na FATEC Itapira.

Estudo de grafos e algoritmos de menor caminho (Dijkstra e A*, também A-star), com revisão sistemática da literatura e recorte em labirinto (pathfinding em grade / ambientes discretos).

Neste repositório, por enquanto, só o conteúdo deste arquivo é versionado no Git; o restante do material do grupo fica local (planilhas, PDFs, rascunhos). Ver `.gitignore`.

---

## Objetivo

- Conduzir a RSL sobre menor caminho com tema labirinto.
- Depois, implementar solução alinhada (grid, obstáculos, meta; uso educativo ou demonstrativo).

---

## Por que labirinto?

A busca genérica traz muito ruído (logística, redes urbanas). Labirinto ou grid concentra artigos de pathfinding em mapa celular, onde Dijkstra e A* costumam ser comparados. Facilita também uma parte visual no projeto.

---

## Revisão sistemática da literatura

### Bases e período

- Busca principal: Google Scholar (literatura não é exaurida; limitação aceita no relatório).
- Anos: 2020 a 2026 (filtro de datas na busca avançada).

### Query inicial (exploratória, ampla)

```text
("graph" OR "graphs" OR "graph theory" OR "network" OR "road network" OR "transport network")
AND
("shortest path" OR "shortest-path" OR "path finding" OR "pathfinding" OR "route planning" OR "optimal path" OR "least-cost path")
AND
("Dijkstra" OR "Dijkstra's algorithm" OR "A-star" OR "A star" OR "A-star algorithm")
```

Resultados aproximados que o grupo registrou (sem o mesmo recorte de ano em todos os casos): Scholar ~18.000; ScienceDirect 9.102; IEEE 2.272; ACM 5.484; Springer 4.230.

### Termos (blocos)

| Bloco | Termos |
|--------|--------|
| Grafo | graph, graphs, graph theory, network, road network, transport network |
| Menor caminho | shortest path, pathfinding, route planning, optimal path, least-cost path |
| Algoritmos | Dijkstra, Dijkstra's algorithm, A*, A-star, A star |
| Contexto (opcional) | urban mobility, logistics, robotics, navigation, GIS, traffic, indoor navigation |

### Query final (Scholar, 2020–2026)

Variante compacta + labirinto no título (`intitle`), para lista curta: cerca de 88 registros (número exato varia com o índice).

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

Limitação: trabalhos com labirinto só no resumo/corpo, sem maze ou labyrinth no título, podem ficar de fora.

### Protocolo do grupo (decisões fechadas)

- Idiomas na triagem: português e inglês.
- Tipos aceitos: artigo de periódico ou conferência com texto completo; preprint com PDF e método claro; tese/dissertação se bater no tema e tiver PDF.
- Triagem dos ~88: uma pessoa classifica; outra revisa dúvidas e amostra de exclusões; conflitos em grupo.
- Após leitura completa: checklist de qualidade 0 / 0,5 / 1 em 7 itens (soma máxima 7). Síntese principal: nota ≥ 4,0; faixa 3,0–3,9 como evidência limitada; abaixo de 3,0 fora da síntese. Se faltar estudo com nota alta, pode-se usar corte ≥ 3,5 uma vez, com justificativa escrita.
- Motivos de exclusão na planilha local: DUP, ALGO, TEMA, TXT, TIPO, ANO, IDI, QUAL (este último após leitura, por qualidade).

### Próximos passos da RSL

1. Registrar data exata da busca no relatório ou wiki.
2. Popular planilha local com os 88 (título, ano, URL, decisão, código de exclusão).
3. Ler na íntegra os incluídos; notas de qualidade e tabela de extração (algoritmo, métricas, resultado, limitações).
4. Fechar fluxo tipo PRISMA e texto da síntese.

---

## Tecnologias utilizadas

A definir (linguagem, bibliotecas, interface).

---

## Status

| Item | Status |
|------|--------|
| RSL — busca ampla | Feita |
| RSL — lista final Scholar | ~88 registros (query com intitle); triagem em andamento |
| Implementação | Pendente |

---

## Integrantes

- Amábile Silvério
- Gustavo Marques
- João Gabriel Moimaz
- Julia Barbosa

---
