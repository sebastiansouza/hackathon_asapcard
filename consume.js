const amqp = require("amqplib");
const Person = require("./models/person");
const Transaction = require("./models/transaction");
const Installment = require("./models/installment");
const { Sequelize } = require("sequelize");

const sequelize = require("./config/sequelize");

// Função para processar mensagens de transações
async function processTransactionMessage(message) {
  try {
    // Verificar se a pessoa já existe na tabela Person
    let person;

    if (message.document) {
      person = await Person.findOne({ where: { id: message.document } });
    }

    // Iniciar uma transação Sequelize
    const t = await sequelize.transaction();

    try {
      // Se não existir, criar uma nova pessoa
      if (!person) {
        person = await Person.create(
          {
            id: message.document, // Definir id como document
            name: message.name,
            age: message.age,
          },
          { transaction: t }
        );
      }

      // Criar uma nova transação
      const transaction = await Transaction.create(
        {
          id: message.transactionId,
          transactionDate: message.transactionDate,
          amount: message.amount,
          numInstallments: message.numInstallments,
          personId: person.id,
          status: message.status || 'pendente', // Adicionar o status da mensagem à transação
        },
        { transaction: t }
      );

      // Calcular e criar parcelas
      const installmentValue = message.amount / message.numInstallments;

      for (let i = 1; i <= message.numInstallments; i++) {
        await Installment.create(
          {
            id: Sequelize.fn("uuid_generate_v4"),
            transactionId: transaction.id,
            installmentNumber: i,
            value: installmentValue,
          },
          { transaction: t }
        );
      }

      // Confirmar a transação Sequelize
      await t.commit();

      console.log(`Mensagem de transação processada: ${JSON.stringify(message)}`);
    } catch (error) {
      // Reverter a transação em caso de erro
      await t.rollback();
      console.error("Erro ao processar mensagem de transação:", error);
    }
  } catch (error) {
    console.error("Erro ao parsear mensagem JSON de transação:", error);
  }
}

// Função para processar mensagens de conciliação
async function processConciliationMessage(message) {
  try {
    // Encontrar a transação correspondente no banco de dados
    const existingTransaction = await Transaction.findOne({
      where: {
        id: message.transactionId,
        transactionDate: message.transactionDate,
        personId: message.document,
      },
    });

    if (existingTransaction) {
      // Atualizar o status da transação
      existingTransaction.status = message.status;
      await existingTransaction.save();

      console.log(`Mensagem de conciliação processada: ${JSON.stringify(message)}`);
    } else {
      console.log("Transação correspondente não encontrada para a mensagem de conciliação.");
    }
  } catch (error) {
    console.error("Erro ao processar mensagem de conciliação:", error);
  }
}

// Função principal para consumir mensagens
async function consumeMessages(queueName) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  console.log(`Aguardando mensagens na fila: ${queueName}`);

  // Consumir mensagens da fila
  channel.consume(
    queueName,
    async (msg) => {
      if (!msg) {
        console.log("Nenhuma mensagem na fila.");
        return;
      }

      const message = JSON.parse(msg.content.toString());

      if (queueName === "transactions_queue") {
        // Processar mensagem de transação
        await processTransactionMessage(message);
      } else if (queueName === "conciliation_queue") {
        // Processar mensagem de conciliação
        await processConciliationMessage(message);
      }

      // Acknowledge da mensagem
      channel.ack(msg);
    },
    { noAck: false }
  );
}

// Consumir mensagens da fila de transações
consumeMessages("transactions_queue");

// Consumir mensagens da fila de conciliação
consumeMessages("conciliation_queue");
