"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
type Data = {
  dealership: { name: string };
  vehicles: Array<Record<string, unknown>>;
  leads: Array<Record<string, unknown>>;
  contents: Array<Record<string, unknown>>;
  videoJobs: Array<Record<string, unknown>>;
};
const initial = {
  brand: "BMW",
  model: "320i",
  trim: "M Sport",
  year: 2022,
  mileage: 48000,
  price: 2150000,
  minimumPrice: 2000000,
  transmission: "Otomatik",
  fuel: "Benzin",
  color: "Siyah",
  condition: "İkinci El",
  damageInfo: "Boya/değişen yok",
  exchangeAvailable: true,
  financingInfo: "Finansman seçenekleri görüşülür",
  notes: "Bakımlı",
  status: "active",
};
export function App() {
  const [data, setData] = useState<Data | null>(null),
    [view, setView] = useState("dashboard"),
    [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null),
    [content, setContent] = useState<Record<string, unknown> | null>(null),
    [notice, setNotice] = useState("");
  async function refresh() {
    const r = await fetch("/api/dashboard");
    if (r.ok) setData(await r.json());
  }
  useEffect(() => {
    refresh();
  }, []);
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget),
      payload = { ...initial, ...Object.fromEntries(form) };
    const r = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const v = await r.json();
    setVehicle(v);
    setView("vehicle");
    await refresh();
  }
  async function generate() {
    setNotice("İçerik hazırlanıyor…");
    const r = await fetch(`/api/vehicles/${vehicle?.id}/content`, {
        method: "POST",
      }),
      x = await r.json();
    setContent(x.data);
    setNotice("İçerik kaydedildi");
  }
  async function video() {
    setNotice("Video işi kuyruğa alındı…");
    const r = await fetch(`/api/vehicles/${vehicle?.id}/video`, {
        method: "POST",
      }),
      x = await r.json();
    setNotice(x.output);
    await refresh();
  }
  async function message() {
    const r = await fetch("/api/messages/mock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId: crypto.randomUUID(),
        from: "905551112233",
        text: "BMW hâlâ duruyor mu? 2020 Passat'ım var takas düşünüyorum. Bugün gelebilirim.",
      }),
    });
    setNotice(r.ok ? "Mesaj işlendi" : "Mesaj işlenemedi");
    await refresh();
    setView("dashboard");
  }
  const nav = [
    ["dashboard", "Genel Bakış"],
    ["new", "Yeni Araç"],
    ["messages", "Mesajlar"],
  ];
  return (
    <main>
      <aside>
        <div className="logo">
          G<span>GE</span>
        </div>
        <nav>
          {nav.map(([id, label]) => (
            <button key={id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <section className="content">
        <header>
          <div>
            <p className="eyebrow">{data?.dealership?.name ?? "YÜKLENİYOR"}</p>
            <h1>
              {view === "new"
                ? "Yeni Araç"
                : view === "messages"
                  ? "Mesajlar"
                  : "Satış Kokpiti"}
            </h1>
            <p>Aracı ekle. AI müşterisini bulsun.</p>
          </div>
          <button onClick={() => setView("new")}>+ Yeni Araç</button>
        </header>
        {notice && (
          <div role="status" className="notice">
            {notice}
          </div>
        )}
        {view === "new" && <VehicleForm onSubmit={create} />}{" "}
        {view === "vehicle" && vehicle && (
          <VehicleDetail
            vehicle={vehicle}
            content={content}
            generate={generate}
            video={video}
            message={message}
          />
        )}{" "}
        {view === "dashboard" && (
          <Dashboard
            data={data}
            onVehicle={(v) => {
              setVehicle(v);
              setView("vehicle");
            }}
          />
        )}
        {view === "messages" && <Messages data={data} refresh={refresh} />}
      </section>
    </main>
  );
}
function VehicleForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="form" onSubmit={onSubmit}>
      {Object.entries(initial)
        .filter(([k]) => !["exchangeAvailable", "status"].includes(k))
        .map(([k, v]) => (
          <label key={k}>
            {
              (
                {
                  brand: "Marka",
                  model: "Model",
                  trim: "Paket",
                  year: "Model yılı",
                  mileage: "Kilometre",
                  price: "Satış fiyatı",
                  minimumPrice: "İç minimum fiyat",
                  transmission: "Vites",
                  fuel: "Yakıt",
                  color: "Renk",
                  condition: "Durum",
                  damageInfo: "Hasar / boya",
                  financingInfo: "Finansman",
                  notes: "Notlar",
                } as Record<string, string>
              )[k]
            }
            <input
              name={k}
              defaultValue={String(v)}
              type={typeof v === "number" ? "number" : "text"}
              required
            />
          </label>
        ))}
      <button>Araç oluştur</button>
    </form>
  );
}
function VehicleDetail({
  vehicle,
  content,
  generate,
  video,
  message,
}: {
  vehicle: Record<string, unknown>;
  content: Record<string, unknown> | null;
  generate: () => void;
  video: () => void;
  message: () => void;
}) {
  const [media, setMedia] = useState<Array<Record<string, unknown>>>(
    (vehicle.media as Array<Record<string, unknown>>) ?? [],
  );
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    for (const file of Array.from(e.target.files ?? [])) {
      const form = new FormData();
      form.set("file", file);
      form.set("cover", String(media.length === 0));
      const r = await fetch(`/api/vehicles/${vehicle.id}/media`, {
        method: "POST",
        body: form,
      });
      if (r.ok) {
        const uploaded = (await r.json()) as Record<string, unknown>;
        setMedia((old) => [...old, uploaded]);
      }
    }
  }
  return (
    <div className="detail">
      <div className="carArt">
        <span>{String(vehicle.year)}</span>
        <b>
          {String(vehicle.brand)} {String(vehicle.model)}
        </b>
      </div>
      <h2>
        {String(vehicle.brand)} {String(vehicle.model)} {String(vehicle.trim)}
      </h2>
      <p>
        {Number(vehicle.price).toLocaleString("tr-TR")} ₺ •{" "}
        {Number(vehicle.mileage).toLocaleString("tr-TR")} km
      </p>
      <label className="upload">
        Araç fotoğrafları (JPEG, PNG veya WebP; en fazla 5 MB)
        <input
          aria-label="Araç fotoğrafları"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={upload}
        />
      </label>
      <div className="gallery">
        {media.map((m) => (
          <Image
            unoptimized
            width={640}
            height={480}
            key={String(m.id)}
            src={String(m.path)}
            alt="Yüklenen araç görünümü"
          />
        ))}
      </div>
      <div className="actions">
        <button onClick={generate}>✦ AI ile Sat</button>
        <button onClick={video}>Video oluştur</button>
        <button onClick={message}>Demo WhatsApp mesajı</button>
      </div>
      {content && (
        <section className="generated">
          <h2>AI Satış İçerikleri</h2>
          {Object.entries(content).map(([k, v]) => (
            <label key={k}>
              {k}
              <textarea
                defaultValue={Array.isArray(v) ? v.join(" ") : String(v)}
              />
            </label>
          ))}
        </section>
      )}
    </div>
  );
}
function Dashboard({
  data,
  onVehicle,
}: {
  data: Data | null;
  onVehicle: (v: Record<string, unknown>) => void;
}) {
  const hot = data?.leads.filter((x) => x.classification === "HOT") ?? [];
  return (
    <>
      <div className="kpis">
        <K label="Aktif Araç" value={String(data?.vehicles.length ?? 0)} />
        <K label="Yeni Müşteri" value={String(data?.leads.length ?? 0)} />
        <K label="Sıcak Müşteri" value={String(hot.length)} hot />
        <K label="Video" value={String(data?.videoJobs.length ?? 0)} />
      </div>
      {!data?.vehicles.length ? (
        <div className="empty">
          <h2>İlk aracınızı ekleyin</h2>
          <p>Satış akışını başlatmak için Yeni Araç&apos;a dokunun.</p>
        </div>
      ) : (
        <div className="cards">
          {data.vehicles.map((v) => (
            <button
              className="vehicleCard"
              key={String(v.id)}
              onClick={() => onVehicle(v)}
            >
              <b>
                {String(v.brand)} {String(v.model)} {String(v.trim)}
              </b>
              <span>{Number(v.price).toLocaleString("tr-TR")} ₺</span>
            </button>
          ))}
        </div>
      )}
      <section className="leads">
        <h2>Sıcak Müşteriler</h2>
        {hot.length === 0 ? (
          <p className="muted">Henüz sıcak müşteri yok.</p>
        ) : (
          hot.map((l) => (
            <div className="lead" key={String(l.id)}>
              <span className="fire">🔥</span>
              <div>
                <b>
                  WhatsApp Müşterisi •{" "}
                  {String((l.vehicle as Record<string, unknown>).brand)}{" "}
                  {String((l.vehicle as Record<string, unknown>).model)}{" "}
                  {String((l.vehicle as Record<string, unknown>).trim)}
                </b>
                <p>
                  Takas: {String(l.tradeIn)} • Ziyaret: {String(l.visitIntent)}
                </p>
                <small>{String(l.reason)} • Hemen arayın</small>
              </div>
              <div className="score">
                {String(l.score)}
                <small>/100 HOT</small>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
function Messages({
  data,
  refresh,
}: {
  data: Data | null;
  refresh: () => void;
}) {
  return (
    <section className="leads">
      {data?.leads.map((l) => {
        const c = l.conversation as Record<string, unknown>;
        return (
          <div className="lead" key={String(l.id)}>
            <div>
              <b>WhatsApp Müşterisi</b>
              <p>{String(c.state)}</p>
              <small>{String((c.messages as unknown[]).length)} mesaj</small>
            </div>
            <button
              onClick={async () => {
                await fetch(`/api/conversations/${c.id}`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ action: "takeover" }),
                });
                refresh();
              }}
            >
              Devral
            </button>
          </div>
        );
      })}
    </section>
  );
}
function K({
  label,
  value,
  hot = false,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className={`kpi ${hot ? "hot" : ""}`}>
      <span>{label}</span>
      <b>{value}</b>
      <small>Canlı veri</small>
    </div>
  );
}
