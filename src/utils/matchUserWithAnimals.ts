function calculateScore(userTraits, animalTraits) {
  let score = 0;
  let addedPoints = 0;

  for (const animalTrait of animalTraits) {
    score -= animalTrait.priority;
  }

  const borderValue = Math.abs(score * 0.4);

  for (const userTrait of userTraits) {
    for (const animalTraitIndex of userTrait.animalTraits) {
      const matchingAnimalTrait = animalTraits.find((animalTrait) =>
        animalTrait._id.equals(animalTraitIndex),
      );

      if (matchingAnimalTrait) {
        score += matchingAnimalTrait.priority * 2;
        addedPoints += matchingAnimalTrait.priority;
      }
    }
  }

  const isValid = addedPoints >= borderValue;

  return { score, isValid };
}

export function matchUserWithAnimals(user, allAnimals) {
  const newAnimalsArray = allAnimals
    .map((animal) => {
      const { score, isValid } = calculateScore(user.traits, animal.traits);

      return {
        ...animal,
        score,
        isValid,
      };
    })
    .filter((animal) => animal.isValid);

  const sortedAnimalsArray = newAnimalsArray.sort((a, b) => b.score - a.score);

  const result = sortedAnimalsArray.map(
    ({ score, isValid, ...animal }) => animal,
  );

  return result;
}
