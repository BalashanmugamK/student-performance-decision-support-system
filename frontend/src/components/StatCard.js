const colors = {
  red: "bg-red-500/10 text-red-400",
  yellow: "bg-yellow-500/10 text-yellow-400",
  green: "bg-green-500/10 text-green-400",
};

function StatCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;
