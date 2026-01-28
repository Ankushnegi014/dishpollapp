export default function DishCard({ dish, rank, onChangeRank }) {
    return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square bg-gray-100">
                <img
                    src={dish.image}
                    alt={dish.dishName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="font-semibold">{dish.dishName}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                            {dish.description}
                        </div>
                    </div>

                    <div className="shrink-0">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {rank ? `Rank ${rank}` : "No rank"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={rank ?? ""}
                        onChange={(e) => {
                            const v = e.target.value;
                            onChangeRank(v === "" ? null : Number(v));
                        }}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                    >
                        <option value="">No rank</option>
                        <option value="1">Rank 1 (30 pts)</option>
                        <option value="2">Rank 2 (20 pts)</option>
                        <option value="3">Rank 3 (10 pts)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
