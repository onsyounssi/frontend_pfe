import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordChange } from "../services/authService";

export default function PasswordResetSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const confirmedRef = useRef(false);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    const runConfirm = async () => {
      if (!token || !email) {
        setStatus("error");
        setMessage("Lien invalide. Paramètres manquants (token ou email).");
        return;
      }

      try {
        const data = await confirmPasswordChange(email, token);
        setFirstName(data.firstName || "");
        setMessage(
          data.message ||
            "Votre mot de passe a bien été modifié par l'administrateur."
        );
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Ce lien est invalide ou a expiré. Vérifiez l'email ou contactez l'administrateur."
        );
      }
    };

    runConfirm();
  }, [token, email]);

  return (
    <main>
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 w-full">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-10 text-center">
            {status === "loading" && (
              <div className="space-y-4">
                <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h2 className="text-xl font-bold text-gray-800">Vérification en cours...</h2>
                <p className="text-gray-500 text-sm">
                  Confirmation de la modification du mot de passe.
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
                  ✓
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Modification confirmée !
                  </h2>
                  {firstName && (
                    <p className="text-pink-600 font-medium mb-2">Bonjour {firstName},</p>
                  )}
                  <p className="text-gray-600">{message}</p>
                  <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-xl text-left text-sm text-green-800">
                    <p className="font-semibold mb-1">Prochaine étape</p>
                    <p>
                      Ouvrez l&apos;email envoyé par SmartBabyCare : votre{" "}
                      <strong>nouveau mot de passe (8 caractères)</strong> s&apos;y trouve.
                      Utilisez-le sur la page de connexion.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-bold rounded-2xl transition shadow-lg"
                >
                  Aller à la connexion
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
                  !
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Lien invalide</h2>
                  <p className="text-gray-600">{message}</p>
                  <p className="text-gray-500 text-sm mt-3">
                    Le mot de passe est visible dans l&apos;email « Votre mot de passe a été
                    modifié ». Si le lien ne fonctionne pas, connectez-vous quand même avec ce
                    mot de passe.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl transition"
                  >
                    Essayer de se connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition"
                  >
                    Nouvelle demande à l&apos;admin
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
