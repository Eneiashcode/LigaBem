// notificacoes.js
import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * 🔹 Busca todas as notificações do doador logado
 * e retorna também os dados do tomador (nome, telefone, preferências)
 */
export async function listarNotificacoesComTomador(doadorId) {
  try {
    const q = query(collection(db, "notificacoes"), where("doadorId", "==", doadorId));
    const snapshot = await getDocs(q);

    const notificacoes = [];

    for (const docSnap of snapshot.docs) {
      const notif = docSnap.data();

      // Buscar dados do tomador
      let tomadorInfo = {};
      if (notif.tomadorId) {
        const tomadorRef = doc(db, "usuarios", notif.tomadorId);
        const tomadorSnap = await getDoc(tomadorRef);
        if (tomadorSnap.exists()) {
          const dados = tomadorSnap.data();
          tomadorInfo = {
            nome: dados.nome || "Não informado",
            telefone: dados.telefone || "Sem telefone",
            aceitaWhatsApp: dados.aceitaContatoWhatsApp || false,
            aceitaLigacao: dados.aceitaContatoLigacao || false
          };
        }
      }

      notificacoes.push({
        id: docSnap.id,
        ...notif,
        tomador: tomadorInfo
      });
    }

    return notificacoes;
  } catch (e) {
    console.error("❌ Erro ao listar notificações:", e);
    return [];
  }
}
