type AuroraProps = {
  ifLanding?: boolean;
  className?: string;
};

export default function Aurora({
  ifLanding = true,
  className = "",
}: AuroraProps) {
  return (
    <div
      className={`nebula-scene pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="nebula-base absolute inset-0" />
      <div className="nebula-stars absolute inset-0" />
      <div className="nebula-grid absolute inset-0" />
      <div className="nebula-orb nebula-orb-one" />
      <div className="nebula-orb nebula-orb-two" />
      <div className="nebula-orb nebula-orb-three" />
      {ifLanding && <div className="nebula-orb nebula-orb-four" />}
      <div className="nebula-vignette absolute inset-0" />
    </div>
  );
}
