import { db } from "./firebase-config.js";
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


// ===== Criar Doação =====
export async function cadastrarDoacao(doacao) {
  try {
    const docRef = await addDoc(collection(db, "doacoes"), {
      ...doacao,
      status: "disponivel",
      criadoEm: new Date().toISOString()
    });
    console.log("✅ Doação cadastrada com ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Erro ao cadastrar doação:", e);
    throw e;
  }
}


// ===== Listar Doações Disponíveis =====
export async function listarDoacoesDisponiveis() {
  try {
    const q = query(collection(db, "doacoes"), where("status", "==", "disponivel"));
    const snapshot = await getDocs(q);

    let doacoes = [];
    snapshot.forEach((docItem) => {
      doacoes.push({ id: docItem.id, ...docItem.data() });
    });

    return doacoes;
  } catch (e) {
    console.error("❌ Erro ao listar doações:", e);
    return [];
  }
}


// ===== Registrar Interesse (Match) =====
export async function registrarMatch(doacaoId, tomadorId) {
  try {
    const docRef = await addDoc(collection(db, "matches"), {
      doacaoId,
      tomadorId,
      status: "pendente",
      manifestadoEm: new Date().toISOString()
    });

    const doacaoRef = doc(db, "doacoes", doacaoId);
    await updateDoc(doacaoRef, { status: "agarrada" });

    console.log("✅ Match registrado:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Erro ao registrar match:", e);
    throw e;
  }
}


// ===== Listar Doações de um Usuário =====
export async function listarMinhasDoacoes(userId) {
  try {
    const q = query(collection(db, "doacoes"), where("doadorId", "==", userId));
    const snapshot = await getDocs(q);

    let doacoes = [];
    snapshot.forEach((docItem) => {
      doacoes.push({ id: docItem.id, ...docItem.data() });
    });

    return doacoes;
  } catch (e) {
    console.error("❌ Erro ao listar minhas doações:", e);
    return [];
  }
}


// ===== Atualizar Doação =====
export async function atualizarDoacao(doacaoId, novosDados) {
  try {
    const doacaoRef = doc(db, "doacoes", doacaoId);
    await updateDoc(doacaoRef, {
      ...novosDados,
      atualizadoEm: new Date().toISOString()
    });
    console.log("✅ Doação atualizada:", doacaoId);
    return true;
  } catch (e) {
    console.error("❌ Erro ao atualizar doação:", e);
    throw e;
  }
}


// ===== Excluir Doação =====
export async function excluirDoacao(doacaoId) {
  try {
    const doacaoRef = doc(db, "doacoes", doacaoId);
    await deleteDoc(doacaoRef);
    console.log("🗑️ Doação excluída:", doacaoId);
    return true;
  } catch (e) {
    console.error("❌ Erro ao excluir doação:", e);
    throw e;
  }
}
