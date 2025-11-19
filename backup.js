const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./ativos-trans-firebase-adminsdk-fbsvc-d66831dc39.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let ultimaBackup = null;

async function criarBackupSeMudou() {
  const snapshot = await db.collection("solicitacoes").get();
  const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const novoJSON = JSON.stringify(dados, null, 2);

  // Só salva se o JSON mudou
  if (novoJSON !== ultimaBackup) {
    if (!fs.existsSync("./backup")) fs.mkdirSync("./backup");

    const nomeArquivo = `./backup/solicitacoes_${Date.now()}.json`;
    fs.writeFileSync(nomeArquivo, novoJSON);
    ultimaBackup = novoJSON;

    console.log(`📁 Backup criado: ${nomeArquivo}`);
  } else {
    console.log("⚡ Sem alterações. Backup não criado.");
  }
}

// Checa a cada 1 minuto (você pode ajustar)
setInterval(criarBackupSeMudou, 60 * 1000);
