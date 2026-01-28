import { useEffect, useMemo, useState } from "react";
import { fetchDishes } from "../api/dish.api";
import DishCard from "../components/DishCard";
import { useAuth } from "../context/AuthContext";
import { usePoll } from "../context/PollContext";
import { isValidSelection, selectionCount } from "../utils";

export default function PollPage() {
  const { user } = useAuth();
  const { votesByUser, setUserRank } = usePoll();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const userVotes = votesByUser[user.id] ?? {};

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

  const pickedCount = useMemo(() => selectionCount(userVotes), [userVotes]);
  const valid = useMemo(() => isValidSelection(userVotes), [userVotes]);

  const onChangeRank = (dishId, rank) => {
    setUserRank({ userId: user.id, dishId: String(dishId), rank });
  };

  if (loading) return <div className="text-sm text-gray-600">Loading dishes…</div>;
  if (err)
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        {err}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Vote for your top 3 dishes</h2>
          <p className="text-sm text-gray-600">
            Pick exactly 3 ranks: Rank 1 = 30 points, Rank 2 = 20, Rank 3 = 10.
          </p>
        </div>

        <div className="text-sm">
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 border",
              valid
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-yellow-50 border-yellow-200 text-yellow-700",
            ].join(" ")}
          >
            Selected: {pickedCount}/3
          </span>
        </div>
      </div>

      {!valid ? (
        <div className="text-sm text-gray-700 bg-gray-100 border rounded-md px-3 py-2">
          You can keep editing anytime, but results will be meaningful once you select all 3 ranks.
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            rank={userVotes[String(dish.id)] ?? null}
            onChangeRank={(rank) => onChangeRank(dish.id, rank)}
          />
        ))}
      </div>
    </div>
  );
}
