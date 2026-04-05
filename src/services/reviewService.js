import axios from 'axios';

const API_URL = '/api/Reviews';
const LOCAL_KEY = 'sbc_reviews_v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function readLocalReviews() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalReviews(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}

function normalizeReview(r) {
  const sid = r.sitterProfileId?._id || r.sitterProfileId;
  const pid = r.parentId?._id || r.parentId;
  return {
    ...r,
    sitterProfileId: sid ? String(sid) : undefined,
    parentId: pid ? String(pid) : r.parentId ? String(r.parentId) : undefined,
  };
}

/** Fusionne avis API + cache local, filtrés par baby-sitter */
function mergeForSitter(apiList, sitterId, localList) {
  const sid = String(sitterId);
  const fromApi = (apiList || [])
    .map(normalizeReview)
    .filter((r) => r.sitterProfileId && String(r.sitterProfileId) === sid);
  const fromLocal = (localList || [])
    .map(normalizeReview)
    .filter((r) => r.sitterProfileId && String(r.sitterProfileId) === sid);
  const seen = new Set();
  const merged = [];
  for (const r of [...fromApi, ...fromLocal]) {
    const key = r._id ? String(r._id) : `${r.auteur}-${r.date}-${r.commentaire}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(r);
  }
  merged.sort((a, b) => {
    const da = new Date(a.createdAt || a.date).getTime();
    const db = new Date(b.createdAt || b.date).getTime();
    return db - da;
  });
  return merged;
}

export const reviewService = {
  getReviews: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Avis pour un profil baby-sitter (API si champs présents + cache local).
   */
  getReviewsForSitter: async (sitterProfileId) => {
    let apiList = [];
    try {
      apiList = await reviewService.getReviews();
    } catch {
      apiList = [];
    }
    const localList = readLocalReviews();
    return mergeForSitter(apiList, sitterProfileId, localList);
  },

  /**
   * Historique des avis laissés par un parent (connecté).
   */
  getParentReviewHistory: async (parentUserId) => {
    const pid = String(parentUserId);
    let apiList = [];
    try {
      apiList = await reviewService.getReviews();
    } catch {
      apiList = [];
    }
    const fromApi = (apiList || [])
      .map(normalizeReview)
      .filter((r) => r.parentId && String(r.parentId) === pid);
    const fromLocal = readLocalReviews()
      .map(normalizeReview)
      .filter((r) => r.parentId && String(r.parentId) === pid);
    const seen = new Set();
    const merged = [];
    for (const r of [...fromApi, ...fromLocal]) {
      const key = r._id ? String(r._id) : `${r.sitterProfileId}-${r.date}-${r.commentaire}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(r);
    }
    merged.sort((a, b) => {
      const da = new Date(a.createdAt || a.date).getTime();
      const db = new Date(b.createdAt || b.date).getTime();
      return db - da;
    });
    return merged;
  },

  /**
   * Crée un avis lié à un profil baby-sitter + parent courant.
   * Persiste aussi en local pour affichage immédiat même si l'API ignore des champs.
   */
  createReview: async (reviewData) => {
    const payload = {
      note: reviewData.note,
      commentaire: reviewData.commentaire,
      auteur: reviewData.auteur,
      date: reviewData.date || new Date(),
      sitterProfileId: reviewData.sitterProfileId,
      sitterName: reviewData.sitterName,
      parentId: reviewData.parentId,
    };

    let created = null;
    try {
      const response = await axios.post(`${API_URL}/ajouter`, payload, getAuthHeaders());
      created = response.data;
    } catch (err) {
      console.error('Erreur createReview API:', err);
    }

    const localEntry = normalizeReview({
      _id: created?._id || created?.id || `local_${Date.now()}`,
      note: payload.note,
      commentaire: payload.commentaire,
      auteur: payload.auteur,
      date: payload.date,
      createdAt: new Date().toISOString(),
      sitterProfileId: payload.sitterProfileId,
      sitterName: payload.sitterName,
      parentId: payload.parentId,
    });

    const all = readLocalReviews().filter(
      (r) => String(r._id) !== String(localEntry._id)
    );
    all.unshift(localEntry);
    writeLocalReviews(all);

    return { ...localEntry, synced: !!created };
  },
};

export default reviewService;
