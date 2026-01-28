import React, { useEffect, useMemo, useState } from "react";
import { fetchDishes } from "../api/dish.api";
import { useAuth } from "../context/AuthContext";
import { usePoll } from "../context/PollContext";
import { pointsForRank } from "../utils";

function buildTotals({ dishes, votesByUser }) {
  const totals = new Map(); // dishId -> points
  for (const dish of dishes) totals.set(String(dish.id), 0);

  for (const userVotes of Object.values(votesByUser)) {
    for (const [dishId, rank] of Object.entries(userVotes ?? {})) {
      totals.set(dishId, (totals.get(dishId) ?? 0) + pointsForRank(rank));
    }
  }

  return totals;
}

export default function ResultsPage() {
  const { user } = useAuth();
  const { votesByUser } = usePoll();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const myVotes = votesByUser[user.id] ?? {};

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const list = await fetchDishes();
        if (!mounted) return;
        setDishes(list);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Failed to load dishes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    const totals = buildTotals({ dishes, votesByUser });

    return dishes
      .map((d) => {
        const id = String(d.id);
        const totalPoints = totals.get(id) ?? 0;
        const myRank = myVotes[id] ?? null;
        return { ...d, totalPoints, myRank };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints || a.dishName.localeCompare(b.dishName));
  }, [dishes, votesByUser, myVotes]);

  if (loading) return <div className="text-sm text-gray-600">Loading results…</div>;
  if (err)
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {err}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Results</h2>
        <p className="text-sm text-gray-600">
          Dishes are ranked by total points from all users’ votes. Your selected ranks are highlighted.
        </p>
      </div>

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left font-medium px-4 py-3">Dish</th>
              <th className="text-left font-medium px-4 py-3">Total points</th>
              <th className="text-left font-medium px-4 py-3">Your rank</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const isMine = Boolean(d.myRank);
              return (
                <tr
                  key={d.id}
                  className={[
                    "border-b last:border-b-0",
                    isMine ? "bg-indigo-50" : "bg-white",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.image}
                        alt={d.dishName}
                        className="h-10 w-10 rounded object-cover bg-gray-100"
                        loading="lazy"
                      />
                      <div>
                        <div className="font-medium">{d.dishName}</div>
                        <div className="text-xs text-gray-600 line-clamp-1">
                          {d.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{d.totalPoints}</td>
                  <td className="px-4 py-3">
                    {d.myRank ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                        Rank {d.myRank}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Note: Because there is no backend, “all users” here means all users who have voted on this browser/device.
      </div>
    </div>
  );
}
