// ===== Importa dependências do Firebase =====
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===== Cadastro de Usuário =====
export function cadastrarUsuario(email, senha) {
  return createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      console.log("✅ Usuário cadastrado:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("❌ Erro no cadastro:", error.message);
      throw error;
    });
}

// ===== Login de Usuário =====
export function loginUsuario(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      console.log("✅ Login realizado:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("❌ Erro no login:", error.message);
      throw error;
    });
}

// ===== Logout =====
export function logoutUsuario() {
  return signOut(auth)
    .then(() => {
      console.log("✅ Logout realizado com sucesso");
    })
    .catch((error) => {
      console.error("❌ Erro no logout:", error.message);
    });
}
