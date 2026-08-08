export function Skel({ w, h, className = "" }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`wf-skel ${className}`}
      style={{ width: w ?? "100%", height: h ?? "16px" }}
    />
  );
}

export function WireframeHomeSkeleton() {
  return (
    <div className="sketch-page" style={{ minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(251,250,245,.9)", backdropFilter: "blur(4px)", borderBottom: "2px solid #25252a" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <Skel w="32px" h="26px" />
          <div style={{ display: "flex", gap: 20 }}>
            {[80, 60, 72, 70, 56, 52].map((w, i) => <Skel key={i} w={`${w}px`} h="14px" />)}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr .9fr", gap: 40, alignItems: "center", padding: "70px 0 40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Skel w="120px" h="13px" />
            <Skel w="80%" h="72px" />
            <Skel w="60%" h="72px" />
            <Skel w="55%" h="22px" />
            <Skel w="90%" h="14px" />
            <Skel w="75%" h="14px" />
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <Skel w="148px" h="40px" />
              <Skel w="110px" h="40px" />
            </div>
          </div>
          <Skel h="340px" />
        </div>

        {/* Skills */}
        <div style={{ padding: "84px 0 40px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
            <Skel w="24px" h="18px" />
            <Skel w="100px" h="36px" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 11 }}>
            {[90, 110, 80, 130, 95, 75, 115, 88, 102, 70, 120].map((w, i) => (
              <Skel key={i} w={`${w}px`} h="36px" />
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #a7a59c" }} />

        {/* Experience */}
        <div style={{ padding: "84px 0 40px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
            <Skel w="24px" h="18px" />
            <Skel w="200px" h="36px" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#ede9de", padding: "22px 26px", display: "flex", gap: 16, alignItems: "center" }}>
                <Skel w="46px" h="46px" className="flex-shrink-0" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Skel w="45%" h="20px" />
                  <Skel w="30%" h="14px" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  <Skel w="120px" h="12px" />
                  <Skel w="14px" h="14px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px dashed #a7a59c" }} />

        {/* Projects */}
        <div style={{ padding: "84px 0 40px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
            <Skel w="24px" h="18px" />
            <Skel w="140px" h="36px" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: "#ede9de", display: "flex", flexDirection: "column" }}>
                <Skel h="188px" />
                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skel w="60%" h="22px" />
                  <Skel h="13px" />
                  <Skel w="80%" h="13px" />
                  <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                    {[50, 60, 55].map((w, j) => <Skel key={j} w={`${w}px`} h="12px" />)}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                    <Skel w="90px" h="34px" />
                    <Skel w="60px" h="34px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
