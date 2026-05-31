import { getAppConfig } from "@/app/action";
import { Skel } from "@/components/wireframe-home-skeleton";

function WireframeProjectDetailSkeleton() {
  return (
    <div className="sketch-page" style={{ minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(251,250,245,.9)", backdropFilter: "blur(4px)", borderBottom: "2px solid #25252a" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <Skel w="32px" h="26px" />
          <Skel w="60px" h="14px" />
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 28px 0" }}>
        <Skel w="120px" h="14px" />
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center", padding: "28px 0 30px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Skel w="100px" h="14px" />
            <Skel w="75%" h="56px" />
            <Skel w="50%" h="56px" />
            <Skel w="55%" h="16px" />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Skel w="110px" h="38px" />
              <Skel w="90px" h="38px" />
            </div>
          </div>
          <Skel h="300px" />
        </div>

        <div style={{ borderTop: "1px dashed #a7a59c", margin: "30px 0 50px" }} />

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .9fr", gap: 48, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Skel w="160px" h="28px" />
            <Skel h="15px" />
            <Skel h="15px" />
            <Skel w="85%" h="15px" />
            <Skel w="90%" h="15px" />
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Skel w="200px" h="28px" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Skel w="22px" h="22px" />
                  <Skel h="14px" />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#ede9de", padding: "24px" }}>
            <Skel w="120px" h="22px" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 14 }}>
              {[90, 110, 80, 100, 95, 75, 115].map((w, i) => (
                <Skel key={i} w={`${w}px`} h="34px" />
              ))}
            </div>
          </div>
        </div>

        {/* More views */}
        <div style={{ marginTop: 64 }}>
          <Skel w="140px" h="28px" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 22 }}>
            {[1, 2, 3].map((i) => <Skel key={i} h="200px" />)}
          </div>
        </div>

        {/* Prev / Next */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #25252a", marginTop: 60, padding: "34px 0 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Skel w="40px" h="11px" />
            <Skel w="160px" h="22px" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <Skel w="40px" h="11px" />
            <Skel w="160px" h="22px" />
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: "2px solid #25252a", padding: "46px 0 60px", marginTop: 70 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Skel w="160px" h="13px" />
          <Skel w="280px" h="38px" />
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            {[80, 90, 80].map((w, i) => <Skel key={i} w={`${w}px`} h="38px" />)}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default async function Loading() {
  const config = await getAppConfig();

  if (config.theme === "wireframe") {
    return <WireframeProjectDetailSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
      </div>
    </div>
  );
}
