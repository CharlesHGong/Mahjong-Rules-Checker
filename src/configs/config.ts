export const defaultGame = {
  players: [
    {
      name: "Player 1",
      score: 0,
    },
    {
      name: "Player 2",
      score: 0,
    },
    {
      name: "Player 3",
      score: 0,
    },
    {
      name: "Player 4",
      score: 0,
    },
  ],
};

export const playerStyles = [
  {
    position: "absolute",
    top: 0,
    height: 20,
    width: "100vw",
  },
  {
    position: "absolute",
    right: 0,
    width: 20,
    height: "100vw",
  },
  {
    position: "absolute",
    bottom: 0,
    height: 20,
    width: "100vw",
  },
  {
    position: "absolute",
    right: 0,
    width: 20,
    height: "100vw",
  },
] as const;
