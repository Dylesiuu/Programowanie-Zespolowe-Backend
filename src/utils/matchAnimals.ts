function calculateScore(user, animal) {
  let score = 0;
  for (const tag of user.traits) {
    const index = tag.tagId;
    const priority = tag.priority;

    const animalTag = animal.traits.find((tag) => tag.tagId === index);

    if (animalTag) {
      score += priority;
    }
  }

  return score;
}

export function matchAnimals(user, animals) {
  const newAnimalsArray = animals.map((animal) => ({
    ...animal,
    score: calculateScore(user, animal),
  }));

  const sortedAnimalsArray = newAnimalsArray.sort((a, b) => b.score - a.score);

  const result = sortedAnimalsArray.map(({ score, ...animal }) => animal);

  return result;
}
