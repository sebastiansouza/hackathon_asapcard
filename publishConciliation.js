const fs = require('fs');
const readline = require('readline');
const amqp = require('amqplib');

async function processConciliation() {
  const conciliationData = [];

  // Leitura do arquivo CSV de conciliação
  try {
    const readInterface = readline.createInterface({
      input: fs.createReadStream('conciliation-data.csv'),
      crlfDelay: Infinity,
    });

    readInterface
      .on('line', (line) => {
        const [transactionId, transactionDate, document, status] = line.split(';');

        const conciliation = {
          transactionId,
          transactionDate,
          document,
          status,
        };

        conciliationData.push(conciliation);
        console.log(conciliation);
      })
      .on('close', async () => {
        try {
          // Conectar ao RabbitMQ
          const connection = await amqp.connect('amqp://localhost');
          const channel = await connection.createChannel();

          // Declarar uma fila para as mensagens de conciliação
          const conciliationQueue = 'conciliation_queue';
          await channel.assertQueue(conciliationQueue, { durable: false });

          // Publicar cada mensagem de conciliação na fila
          conciliationData.forEach((conciliation) => {
            channel.sendToQueue(conciliationQueue, Buffer.from(JSON.stringify(conciliation)));
          });

          console.log('Conciliação processada e mensagens publicadas no RabbitMQ');

          // Fechar a conexão
          await channel.close();
          await connection.close();
        } catch (error) {
          console.error('Erro ao conectar ao RabbitMQ:', error);
        }
      });
  } catch (error) {
    console.error('Erro ao ler o arquivo CSV de conciliação:', error);
  }
}

processConciliation();
