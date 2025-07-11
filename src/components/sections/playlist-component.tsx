import React from "react";

export const MyPlaylist = () => {
  return (
    <section className="pt-4 space-y-4">
      <h2 className="text-lg font-bold">My Favorite Song</h2>
      <iframe
        src="https://open.spotify.com/embed/track/5VBjyOQzqlPNgdRPMM6prF?utm_source=generator&theme=0"
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </section>
  );
};
