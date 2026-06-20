# Projeto: Grafos e Algoritmos de Menor Caminho

## 📖 Descrição

Projeto desenvolvido para a disciplina de Integração e Entrega Contínua, do curso de Desenvolvimento de Software Multiplataforma da FATEC Itapira.

O trabalho aborda algoritmos de menor caminho aplicados a problemas de pathfinding em labirintos e ambientes discretos, com foco nos algoritmos de Dijkstra e A*.

---

## Integracao Continua (CI)

O projeto usa GitHub Actions para automatizar verificacoes a cada push ou pull request na branch `main`.

O workflow esta em `.github/workflows/ci.yml` e executa:
- validacao de sintaxe dos arquivos JavaScript com `node --check`
- testes automatizados dos algoritmos em `tests/pathfinding.test.js`

Para executar localmente:

```bash
node tests/pathfinding.test.js
```

O CI tambem valida a sintaxe dos arquivos Python e constroi a imagem Docker do laboratorio de metricas.

---

## Laboratorio de metricas com Docker

Seguindo a estrutura proposta pelo professor, o projeto possui um ambiente Docker para comparar o desempenho dos algoritmos Dijkstra e A* em grades ponderadas.

O container executa os dois algoritmos em grades de diferentes tamanhos e coleta:

- tempo de execucao
- memoria utilizada
- quantidade de nos visitados
- quantidade de nos expandidos
- custo total do caminho encontrado

### Pre-requisitos

- Git
- Docker Desktop

### Execucao no Windows

```cmd
scripts\start.bat
```

Ou diretamente:

```bash
docker compose up --build
```

### Execucao no Linux ou macOS

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Arquivos gerados

Depois da execucao, a pasta `output/` recebe:

```text
output/
|-- metrics.csv
|-- metrics.json
|-- metrics.md
|-- performance_graph.png
`-- iterations_graph.png
```

O arquivo CSV contem cada medicao, o JSON apresenta um resumo por algoritmo e o `metrics.md` oferece tabelas formatadas para leitura no VS Code. Os graficos comparam tempo de execucao e nos expandidos.

---

## Continuous Delivery (CD)

O projeto tambem usa GitHub Actions para publicar automaticamente a aplicacao estatica no GitHub Pages.

O deploy esta no mesmo workflow de CI, em `.github/workflows/ci.yml`, e executa:
- validacao de sintaxe dos arquivos JavaScript com `node --check`
- testes automatizados dos algoritmos em `tests/pathfinding.test.js`
- preparacao dos arquivos estaticos do site
- deploy no ambiente `github-pages`

Em pull requests, o workflow executa apenas as validacoes. Em push na branch `main`, ele executa as validacoes e depois publica o site. O workflow tambem pode ser iniciado manualmente pela aba Actions do GitHub.

Para a publicacao funcionar, o repositorio deve estar configurado em:

`Settings > Pages > Build and deployment > Source > GitHub Actions`

Depois da primeira execucao com sucesso, o site ficara disponivel em:

`https://juliasbarbosa.github.io/GrafoMenorCaminho/`

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

Investigar aplicações de algoritmos de menor caminho em cenários de labirinto e desenvolver uma implementação prática utilizando grafos e pathfinding.

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
