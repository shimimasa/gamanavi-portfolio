import KidsWorkCard from "./KidsWorkCard";

export default function KidsWorkGrid({ works }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => (
        <KidsWorkCard key={work.id} work={work} />
      ))}
    </div>
  );
}
