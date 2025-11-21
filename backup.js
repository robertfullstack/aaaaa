const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./ativos-trans-firebase-adminsdk-fbsvc-b752c3570d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function iniciarBackup() {
  console.log("⏳ Iniciando listener...");

  db.collection("solicitacoes")
    .onSnapshot(
      (snapshot) => {
        console.log("🔄 Mudança detectada → Gerando backup...");

        const dados = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (!fs.existsSync("./backup")) fs.mkdirSync("./backup");

        const nomeArquivo = `./backup/solicitacoes_${Date.now()}.json`;
        fs.writeFileSync(nomeArquivo, JSON.stringify(dados, null, 2));

        console.log(`📁 Backup criado: ${nomeArquivo}`);
      },
      (error) => {
        console.error("❌ Listener falhou:", error);
      }
    );
}

iniciarBackup();
