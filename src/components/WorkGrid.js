import WorkCard from "./WorkCard";

export default function WorkGrid({ works }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((w) => (
        <WorkCard key={w.id} work={w} />
      ))}
    </div>
  );
}
