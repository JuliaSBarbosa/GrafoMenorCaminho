# Projeto: Grafos e Algoritmos de Menor Caminho

## 📖 Descrição

Projeto desenvolvido para a disciplina de Integração e Entrega Contínua, do curso de Desenvolvimento de Software Multiplataforma da FATEC Itapira.

O trabalho aborda algoritmos de menor caminho aplicados a problemas de pathfinding em labirintos e ambientes discretos, com foco nos algoritmos de Dijkstra e A*.

---

## Modelo da Grade (RF01)

O labirinto e representado como uma matriz MxN, armazenada em `matriz`, onde cada posicao corresponde a uma celula da grade.

Estados usados pelas celulas:
- livre: pode ser percorrida com custo 1
- obstaculo: bloqueia a passagem
- lento: pode ser percorrida com custo 5
- inicio: ponto inicial da busca
- objetivo: ponto final da busca

A vizinhanca de cada celula usa 4 direcoes: cima, baixo, esquerda e direita. A funcao `obterVizinhosValidos` retorna apenas vizinhos dentro dos limites da matriz e que nao sejam obstaculos.

---

## 🎯 Objetivo

Investigar aplicações de algoritmos de menor caminho em cenários de labirinto e desenvolver futuramente uma implementação prática utilizando grafos e pathfinding.

---

## 📚 Revisão Sistemática da Literatura

A Revisão Sistemática da Literatura (RSL) foi realizada seguindo etapas de:
- definição de termos
- construção de strings de busca
- critérios de inclusão e exclusão
- avaliação de qualidade
- análise dos resultados

A documentação completa da RSL está disponível na Wiki do projeto.

---

## 🚧 Status

| Etapa | Status |
|---|---|
| Revisão Sistemática | ✅ Concluída |
| Implementação | 🔄 Em andamento |

---

## 👥 Integrantes

- Amábile Silvério
- Gustavo Marques
- João Gabriel Moimaz
- Julia Barbosa
