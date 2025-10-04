// db.js
import { db, auth, storage } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ===== Cadastrar nova doação =====
export async function cadastrarDoacao(doacao, fotoFile = null) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    let fotoURL = null;

    // Se tiver imagem, faz upload no Storage
    if (fotoFile) {
      const storageRef = ref(
        storage,
        `doacoes/${user.uid}/${Date.now()}_${fotoFile.name}`
      );
      await uploadBytes(storageRef, fotoFile);
      fotoURL = await getDownloadURL(storageRef);
    }

    // Salva no Firestore
    const docRef = await addDoc(collection(db, "doacoes"), {
      ...doacao,
      fotoURL,
      status: "disponivel",
      criadoEm: new Date().toISOString(),
      userId: user.uid,
    });

    console.log("✅ Doação cadastrada:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("❌ Erro ao cadastrar doação:", e);
    throw e;
  }
}

// ===== Listar doações disponíveis =====
export async function listarDoacoesDisponiveis() {
  try {
    const q = query(
      collection(db, "doacoes"),
      where("status", "==", "disponivel")
    );
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

// ===== Excluir doação =====
export async function excluirDoacao(id) {
  try {
    const refDoacao = doc(db, "doacoes", id);
    await deleteDoc(refDoacao);
    console.log("🗑️ Doação excluída:", id);
  } catch (e) {
    console.error("❌ Erro ao excluir doação:", e);
    throw e;
  }
}

// ===== Registrar interesse (match) =====
export async function registrarMatch(doacaoId, tomadorId, tituloDoacao, doadorId) {
  try {
    // Busca dados do tomador
    const tomadorRef = doc(db, "usuarios", tomadorId);
    const tomadorSnap = await getDoc(tomadorRef);

    let contato = {};
    if (tomadorSnap.exists()) {
      const dados = tomadorSnap.data();
      contato = {
        tomadorNome: dados.nome || "",
        tomadorTelefone: dados.telefone || "",
        aceitaContatoWhatsApp: dados.aceitaContatoWhatsApp || false,
        aceitaContatoLigacao: dados.aceitaContatoLigacao || false,
      };
    }

    // Cria registro do match
    const matchRef = await addDoc(collection(db, "matches"), {
      doacaoId,
      tomadorId,
      status: "em_andamento",
      manifestadoEm: new Date().toISOString(),
    });

    // Atualiza a doação
    const doacaoRef = doc(db, "doacoes", doacaoId);
    await updateDoc(doacaoRef, { status: "em_andamento" });

    // Notifica o doador
    await addDoc(collection(db, "notificacoes"), {
      doadorId,
      tomadorId,
      doacaoId,
      mensagem: `🎁 Sua doação "${tituloDoacao}" foi agarrada! Entre em contato com o interessado.`,
      status: "novo",
      criadoEm: new Date().toISOString(),
      ...contato,
    });

    console.log("✅ Match registrado e notificação enviada:", matchRef.id);
    return matchRef.id;
  } catch (e) {
    console.error("❌ Erro ao registrar match:", e);
    throw e;
  }
}

// ===== Listar notificações do doador =====
export async function listarNotificacoes(doadorId) {
  try {
    const q = query(collection(db, "notificacoes"), where("doadorId", "==", doadorId));
    const snapshot = await getDocs(q);

    let notificacoes = [];
    snapshot.forEach((docSnap) => {
      notificacoes.push({ id: docSnap.id, ...docSnap.data() });
    });

    return notificacoes;
  } catch (e) {
    console.error("❌ Erro ao listar notificações:", e);
    return [];
  }
}

export async function editarDoacao(id, novosDados) {
  try {
    const refDoacao = doc(db, "doacoes", id);
    await updateDoc(refDoacao, {
      ...novosDados,
      atualizadoEm: new Date().toISOString()
    });
    console.log("✅ Doação atualizada:", id);
  } catch (e) {
    console.error("❌ Erro ao editar doação:", e);
    throw e;
  }
}

