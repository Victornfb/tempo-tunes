## 💻 Projeto

O projeto **TempoTunes** é uma API REST que traz a melhor playlist para cada momento. Atualmente, ela oferece um serviço onde você informa o nome da sua cidade e, com base na temperatura atual, entrega uma lista de músicas que combinam com o clima.

Você pode acessar a documentação do serviço [aqui](http://ec2-18-228-196-248.sa-east-1.compute.amazonaws.com/docs).

## 🧪 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node](https://nodejs.org/en/) e [TypeScript](https://www.typescriptlang.org/)

  Escolhido por seu alto poder de processamento quando aplicado corretamente. Em conjunto com o TypeScript, permite identificar previamente potenciais problemas de tipagem, tornando a aplicação mais robusta.
  
- [NestJS](https://nestjs.com/)

  Utilizado por sua facilidade de implementação rápida de soluções, oferecendo diversas funcionalidades como `transporters` para microserviços, `decorators` e injeção de dependências.

- [Swagger](https://swagger.io/)

  Ferramenta utilizada para documentação de APIs, que utiliza o padrão [OpenAPI](https://www.openapis.org/) 3.0, também utilizado para `collections` no Postman, por exemplo.

- [Docker](https://www.docker.com/)

  Utilizado para containerizar a aplicação, mitigando problemas relacionados ao ambiente de execução e mantendo um ambiente estável e homogêneo.

- [Redis](https://redis.io/)

  Escolhido para fazer o cache da aplicação, economizando consultas a APIs de terceiros, minimizando o tempo de resposta e os custos.

- [GitHub Actions](https://docs.github.com/pt/actions) e [AWS](https://aws.amazon.com/pt/)

  Utilizados como plataformas para gerenciar o processo de CI/CD, descrito mais detalhadamente nas seções abaixo.

## 🧩 Serviços externos

Foram utilizados os seguintes serviços para a funcionalidade do projeto:

- [OpenWeather API](https://openweathermap.org/api)

  Utilizada para fazer a consulta geográfica utilizando o termo buscado pelo usuário. O serviço foi escolhido por oferecer diversas funcionalidades geográficas e climáticas de forma gratuita, além de ter alta disponibilidade e confiabilidade.

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

  Utilizada para fazer a busca de categorias, playlists e músicas de acordo com o gênero. O serviço foi selecionado devido à vasta biblioteca de títulos. Além disso, a API é gratuita para ser utilizada e possui, assim como a anterior, alta disponibilidade e confiabilidade.

## 🚀 Processo de [CI/CD](https://unity.com/pt/solutions/what-is-ci-cd)

O processo de deployment do projeto consiste nos seguintes passos:

1. O pipeline de CI é acionado ao identificar um push para a branch `main`.

2. Usa as credenciais armazenadas para fazer login no DockerHub.

3. Realiza o build da imagem.

4. Envia a imagem para o [repositório](https://hub.docker.com/r/victornfb/tempo-tunes/tags) no DockerHub.

5. O pipeline de CD é acionado ao identificar que o processo de CI foi concluído.

6. Conecta via `ssh` na instância EC2.

7. Faz o pull e o build da imagem.

8. Inicia um novo container do projeto.

## 🏗️ Infraestrutura

A infraestrutura do projeto é composta pelos itens abaixo:

- Uma instância do EC2 na AWS, responsável por executar a aplicação.

- Um banco de dados Redis hospedado na RedisLabs, responsável por armazenar os dados em cache.

- Um servidor nginx para fazer o proxy reverso e servir a aplicação para a internet.

## 📱 Contato

[![Linkedin Badge](https://img.shields.io/badge/-Victor%20Nunes-0a66c2?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/victornfb/)](https://www.linkedin.com/in/victornfb/) [![Gmail Badge](https://img.shields.io/badge/-victornfb@outlook.com-0a66c2?style=flat-square&logo=Microsoft&logoColor=white&link=mailto:victornfb@outlook.com)](mailto:victornfb@outlook.com)
