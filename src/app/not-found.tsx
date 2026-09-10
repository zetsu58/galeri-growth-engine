import Link from "next/link";
export default function NotFound() {
  return (
    <main className="center">
      <section className="authCard">
        <h1>Sayfa bulunamadı</h1>
        <Link href="/">Satış kokpitine dön</Link>
      </section>
    </main>
  );
}
