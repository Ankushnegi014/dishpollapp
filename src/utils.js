export const STORAGE_KEYS = {
  auth: "dishpoll.auth",
  votesByUser: "dishpoll.votesByUser",
};

export const RANK_POINTS = {
  1: 30,
  2: 20,
  3: 10,
};

export function pointsForRank(rank) {
  if (!rank) return 0;
  return RANK_POINTS[rank] ?? 0;
}

export function normalizeRanks(votesByDishId) {
  const seenRank = new Map();
  const normalized = { ...votesByDishId };

  for (const [dishId, rank] of Object.entries(votesByDishId)) {
    if (!rank) continue;

    if (!seenRank.has(rank)) {
      seenRank.set(rank, dishId);
      continue;
    }

    const prevDishId = seenRank.get(rank);
    normalized[prevDishId] = null;
    seenRank.set(rank, dishId);
  }

  return normalized;
}

export function selectionCount(votesByDishId) {
  return Object.values(votesByDishId).filter(Boolean).length;
}

export function isValidSelection(votesByDishId) {
  return selectionCount(votesByDishId) === 3;
}