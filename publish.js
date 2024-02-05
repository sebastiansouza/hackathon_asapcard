const fs = require('fs');
const readline = require('readline');
const amqp = require('amqplib');

async function publishMessages() {
  const messages = [];

  // Leitura do arquivo CSV
  try {
    const readInterface = readline.createInterface({
      input: fs.createReadStream('input-data.csv'),
      crlfDelay: Infinity,
    });

    readInterface
      .on('line', (line) => {
        const [transactionId, transactionDate, document, name, age, amount, numInstallments] = line.split(';');

        const message = {
          transactionId,
          transactionDate,
          document,
          name,
          age,
          amount,
          numInstallments,
          status: 'pendente', // Adicionando o status pendente como padrão
        };

        messages.push(message);
        console.log(message);
      })
      .on('close', async () => {
        try {
          // Conectar ao RabbitMQ
          const connection = await amqp.connect('amqp://localhost');
          const channel = await connection.createChannel();

          // Declarar uma fila para as mensagens
          const queue = 'transactions_queue';
          await channel.assertQueue(queue, { durable: false });

          // Publicar cada mensagem na fila
          messages.forEach((message) => {
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
          });

          console.log('Mensagens publicadas no RabbitMQ');

          // Fechar a conexão
          await channel.close();
          await connection.close();
        } catch (error) {
          console.error('Erro ao conectar ao RabbitMQ:', error);
        }
      });
  } catch (error) {
    console.error('Erro ao ler o arquivo CSV:', error);
  }
}

publishMessages();
