// db.js
import { db, auth } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===== Cadastrar nova doação =====
export async function cadastrarDoacao(doacao) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const docRef = await addDoc(collection(db, "doacoes"), {
      ...doacao,
      status: "disponivel",
      criadoEm: new Date().toISOString(),
      userId: user.uid
    });

    console.log("✅ Doação cadastrada:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Erro ao cadastrar doação:", e);
    throw e;
  }
}


// ===== Listar doações disponíveis (para todos os usuários) =====
export async function listarDoacoesDisponiveis() {
  try {
    const q = query(collection(db, "doacoes"), where("status", "==", "disponivel"));
    const snapshot = await getDocs(q);

    let doacoes = [];
    snapshot.forEach((docSnap) => {
      doacoes.push({ id: docSnap.id, ...docSnap.data() });
    });

    return doacoes;
  } catch (e) {
    console.error("❌ Erro ao listar doações disponíveis:", e);
    return [];
  }
}


// ===== Listar doações do usuário logado =====
export async function listarMinhasDoacoes() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const q = query(collection(db, "doacoes"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    let doacoes = [];
    snapshot.forEach((docSnap) => {
      doacoes.push({ id: docSnap.id, ...docSnap.data() });
    });

    return doacoes;
  } catch (e) {
    console.error("❌ Erro ao listar minhas doações:", e);
    return [];
  }
}


// ===== Editar doação =====
export async function editarDoacao(id, novosDados) {
  try {
    const ref = doc(db, "doacoes", id);
    await updateDoc(ref, {
      ...novosDados,
      atualizadoEm: new Date().toISOString()
    });
    console.log("✅ Doação atualizada:", id);
  } catch (e) {
    console.error("❌ Erro ao editar doação:", e);
    throw e;
  }
}


// ===== Excluir doação =====
export async function excluirDoacao(id) {
  try {
    const ref = doc(db, "doacoes", id);
    await deleteDoc(ref);
    console.log("🗑️ Doação excluída:", id);
  } catch (e) {
    console.error("❌ Erro ao excluir doação:", e);
    throw e;
  }
}


// ===== Registrar interesse (match) em uma doação =====
export async function registrarMatch(doacaoId, tomadorId) {
  try {
    // Cria o registro de match
    const docRef = await addDoc(collection(db, "matches"), {
      doacaoId,
      tomadorId,
      status: "pendente",
      manifestadoEm: new Date().toISOString()
    });

    // Atualiza a doação para "agarrada"
    const doacaoRef = doc(db, "doacoes", doacaoId);
    await updateDoc(doacaoRef, { status: "agarrada" });

    console.log("✅ Match registrado:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Erro ao registrar match:", e);
    throw e;
  }
}
