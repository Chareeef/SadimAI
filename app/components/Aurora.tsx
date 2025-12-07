export default function Aurora({ ifLanding = true }) {
  const colorsIndices = ifLanding ? [0, 1, 2, 3, 4] : [4, 5, 6];

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black" />

      {colorsIndices.map((i, index) => (
        <div
          key={i}
          className="absolute top-0 left-0 w-full h-full opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, var(--color-${i}) 50%, transparent)`,
            filter: "blur(80px)",
            transform: `rotate(${index * 22}deg) scale(1.5)`, // slightly more spread
            animation: `aurora-move-${index} ${24 + index * 6}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
