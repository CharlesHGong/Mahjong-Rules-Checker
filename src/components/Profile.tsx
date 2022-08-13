type ProfileProps = {
  direction: "row" | "column";
  score: number;
  name: string;
};
export const Profile = ({ direction, score, name }: ProfileProps) => {
  return (
    <div style={{ display: "flex", flexDirection: direction }}>
      <div>Pic</div>
      <div>{name}</div>
      <div>Score: {score}</div>
    </div>
  );
};
