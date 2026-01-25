import { Suspense } from "react";
import ParentsGateClient from "./ParentsGateClient";

export default function KidsParentsGatePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm opacity-70">読み込み中…</div>
      }
    >
      <ParentsGateClient />
    </Suspense>
  );
}
