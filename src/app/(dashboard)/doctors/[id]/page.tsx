import { Suspense } from "react";

async function DoctorDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1 className="text-2xl font-semibold">Doctor {id}</h1>
      <p className="mt-2 text-zinc-500">TODO: doctor details &amp; patients</p>
    </>
  );
}

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <section>
      <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
        <DoctorDetail params={params} />
      </Suspense>
    </section>
  );
}
