const fs = require("fs");
const admin = require("firebase-admin");

// 🔥 Importa a chave privada do Firebase
const serviceAccount = require("./ativos-trans-firebase-adminsdk-fbsvc-d66831dc39.json");

// 🔥 Inicializa o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔔 Escuta mudanças na coleção "solicitacoes"
db.collection("solicitacoes").onSnapshot(snapshot => {
  console.log("⏳ Mudança detectada → Criando backup Firestore → JSON...");

  const dados = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!fs.existsSync("./backup")) fs.mkdirSync("./backup");

  const nomeArquivo = `./backup/solicitacoes_${Date.now()}.json`;
  fs.writeFileSync(nomeArquivo, JSON.stringify(dados, null, 2));

  console.log(`📁 Backup criado: ${nomeArquivo}`);
}, err => {
  console.error("❌ Erro no backup:", err.message);
});
