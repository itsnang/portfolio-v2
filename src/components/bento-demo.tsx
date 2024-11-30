const test = [
  "https://picbucket.vercel.app/images/6725a6ef6baabf8d07a9b09d",
  "https://picbucket.vercel.app/images/6725bcf34c2b077103604e4e",
  "https://picbucket.vercel.app/images/6725a7116baabf8d07a9b0aa",
  "https://picbucket.vercel.app/images/6725bcc94c2b077103604e41",
  "https://picbucket.vercel.app/images/6725a65b6baabf8d07a9b07f",
  "https://picbucket.vercel.app/images/674a9ba1ae8b9c6725920125",
];

export function BlurFadeDemo() {
  return (
    <div className="columns-2 gap-4 sm:columns-3">
      {test.map((imageUrl, idx) => (
        <img
          key={idx}
          className="mb-4 size-full rounded-lg object-contain"
          src={imageUrl}
          alt={`Random stock image ${idx + 1}`}
        />
      ))}
    </div>
  );
}
