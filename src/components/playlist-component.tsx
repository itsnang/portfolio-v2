import React from "react";

export const MyPlaylist = () => {
  return (
    <div className="pt-4 space-y-4">
      <h2 className="text-lg font-bold">My Favorite Playlist</h2>
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO2W75UR?utm_source=generator&theme=0"
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};
