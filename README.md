# HACKATON ASAPCARD

Este projeto consiste em desenvolver um sistema para processar transações financeiras a partir de arquivos CSV. A aplicação recebe um arquivo de entrada, faz o parse das transações e publica mensagens JSON. Posteriormente, outro programa consome essas mensagens, persistindo os dados em um banco de dados relacional com tabelas de transações, parcelas e informações pessoais. Além disso, o sistema foi evoluído para lidar com um segundo arquivo de conciliação, atualizando o status das transações e permitindo a execução contínua ao observar diretórios específicos para novos arquivos de entrada e conciliação.

## Status do Projeto

Em desenvolvimento / fase de testes

## Tecnologias Utilizadas

- Node.js
- PostgreSQL
- RabbitMQ

## Configuração do Ambiente

### PostgreSQL

1. Faça o download e instale o PostgreSQL a partir do [site oficial](https://www.postgresql.org/download/).
2. Durante a instalação, defina a senha do usuário `admin` e o nome do banco de dados, se necessário para DB_HACKATON
3. Inicie o serviço do PostgreSQL.

### RabbitMQ

1. Faça o download e instale o RabbitMQ a partir do [site oficial](https://www.rabbitmq.com/download.html).
2. Inicie o serviço do RabbitMQ.

### Dependências do Projeto

1. Abra o terminal na pasta do projeto.
2. Execute o comando `npm install` para instalar as dependências do projeto.

### Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente necessárias.

## Configuração 

Antes de iniciar o programa premeiro vamos ter certeza de que criamos nossa tabela.

Abra um terminal na pasta do projeto e digite os seguintes comandos:

Comando para criar o Banco de dados
npx sequelize-cli db:create

Comando para instalar as extensões necessárias do BD
psql -U postgres -d DB_HACKATON -a -f create_extension.sql

Comando para executar as migrations
npx sequelize-cli db:migrate


## Run APP

Após as configurações iniciais você está pronto.

Na pasta do arquivo,  abra um terminal e digite o comando:

"node app.js"

Após isso o sistema ficará em loop esperando os arquivos na pasta INPUT e CONCILIATION.


Se você copiar o arquivo input-data.csv para a pasta INPUT ele vai tratar ela para o banco de dados e mandar o arquivo para INPUT_TRATADOS

O mesmo acontece com conciliation-data.csv




## Agradecimentos

Agradecemos a empresa Asapcard pela oportunidade de participar do hackathon que nos proporcionou grande crescimento tanto pessoal como profissional.

Agradecimento a todos envolvidos do grupo pela grande realização.
