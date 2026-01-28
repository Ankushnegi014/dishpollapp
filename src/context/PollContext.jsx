import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS, normalizeRanks } from "../utils";

const PollContext = createContext(null);

export function PollProvider({ children }) {
    const [votesByUser, setVotesByUser] = useLocalStorage(STORAGE_KEYS.votesByUser, {});

    const setUserRank = ({ userId, dishId, rank }) => {
        setVotesByUser((prev) => {
            const userVotes = prev[userId] ?? {};
            const nextUserVotes = normalizeRanks({
                ...userVotes,
                [dishId]: rank ?? null,
            });

            return { ...prev, [userId]: nextUserVotes, };
        });
    };

    const clearUserVotes = ({ userId }) => {
        setVotesByUser((prev) => {
            const next = { ...prev };
            next[userId] = {};
            return next;
        });
    };

    const value = useMemo(() => ({
        votesByUser,
        setUserRank,
        clearUserVotes,
    }), [votesByUser]);

    return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
}

export function usePoll() {
    const ctx = useContext(PollContext);
    if (!ctx) throw new Error("usePoll must be used within PollProvider");
    return ctx;
}
