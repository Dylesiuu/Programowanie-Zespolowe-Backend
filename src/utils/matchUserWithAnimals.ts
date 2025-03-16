function calculateScore(userTraits, animalTraits) {
  let score = 0;

  for (const animalTrait of animalTraits) {
    score -= animalTrait.priority;
  }

  for (const userTrait of userTraits) {
    for (const animalTraitIndex of userTrait.animalTraits) {
      const matchingAnimalTrait = animalTraits.find((animalTrait) =>
        animalTrait._id.equals(animalTraitIndex),
      );

      if (matchingAnimalTrait) {
        score += matchingAnimalTrait.priority;
      }
    }
  }

  return score;
}

export function matchUserWithAnimals(user, allAnimals) {
  const newAnimalsArray = allAnimals
    .map((animal) => ({
      ...animal,
      score: calculateScore(user.traits, animal.traits),
    }))
    .filter((animal) => animal.score >= -15);

  const sortedAnimalsArray = newAnimalsArray.sort((a, b) => b.score - a.score);

  const result = sortedAnimalsArray.map(({ score, ...animal }) => animal);

  return result;
}
