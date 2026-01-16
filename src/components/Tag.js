export function Tag({ label }) {
  const tagColors = {
    vegan: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "gluten-free": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const colorClass = tagColors[label] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
      {label.replace("-", " ")}
    </span>
  );
}
