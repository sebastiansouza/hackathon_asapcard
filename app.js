const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const INPUT_DIR = path.join(__dirname, 'INPUT');
const CONCILIATION_DIR = path.join(__dirname, 'CONCILIATION');
const INPUT_TREATED_DIR = path.join(__dirname, 'INPUT_TRATADOS');
const CONCILIATION_TREATED_DIR = path.join(__dirname, 'CONCILIATION_TRATADOS');

const SLEEP_INTERVAL = 5000; // 5 segundos

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function processInput() {
  const files = fs.readdirSync(INPUT_DIR);

  if (files.length > 0) {
    const inputFilePath = path.join(INPUT_DIR, files[0]);

    console.log(`Processing input file: ${inputFilePath}`);

    try {
      // Execute publish.js
      await executeCommand(`node publish.js ${inputFilePath}`);
      
      // Execute consume.js assincronamente
      exec('node consume.js', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing consume.js: ${error}`);
        }
        console.log(`consume.js output: ${stdout}`);
      });

      // Move the treated file to INPUT_TRATADOS
      const treatedFileName = `${path.basename(inputFilePath, '.csv')}_tratado.csv`;
      const treatedFilePath = path.join(INPUT_TREATED_DIR, treatedFileName);

      fs.renameSync(inputFilePath, treatedFilePath);

      console.log(`File processed and moved to INPUT_TRATADOS: ${treatedFilePath}`);
    } catch (error) {
      console.error(`Error processing input: ${error}`);
    }
  }
}

async function processConciliation() {
  const files = fs.readdirSync(CONCILIATION_DIR);

  if (files.length > 0) {
    const conciliationFilePath = path.join(CONCILIATION_DIR, files[0]);

    console.log(`Processing conciliation file: ${conciliationFilePath}`);

    try {
      // Execute publishConciliation.js
      await executeCommand(`node publishConciliation.js ${conciliationFilePath}`);

      // Move the treated file to CONCILIATION_TRATADOS
      const treatedFileName = `${path.basename(conciliationFilePath, '.csv')}_tratado.csv`;
      const treatedFilePath = path.join(CONCILIATION_TREATED_DIR, treatedFileName);

      fs.renameSync(conciliationFilePath, treatedFilePath);

      console.log(`File processed and moved to CONCILIATION_TRATADOS: ${treatedFilePath}`);
    } catch (error) {
      console.error(`Error processing conciliation: ${error}`);
    }
  }
}

async function mainLoop() {
  while (true) {
    await processInput();
    await processConciliation();

    console.log(`Waiting for ${SLEEP_INTERVAL / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, SLEEP_INTERVAL));
  }
}

mainLoop();