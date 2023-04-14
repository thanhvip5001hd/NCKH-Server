function cosineSimilarity(a, b) {
  const dotProduct = Object.keys(a).reduce(
    (acc, key) => acc + a[key] * (b[key] || 0),
    0
  );
  const aMagnitude = Math.sqrt(
    Object.keys(a).reduce((acc, key) => acc + a[key] ** 2, 0)
  );
  const bMagnitude = Math.sqrt(
    Object.keys(b).reduce((acc, key) => acc + (b[key] || 0) ** 2, 0)
  );

  if (aMagnitude === 0 || bMagnitude === 0) {
    return 0;
  } else {
    return dotProduct / (aMagnitude * bMagnitude);
  }
}

function getBagOfWords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ");
  const vector = {};
  for (const word of words) {
    vector[word] = 1;
  }
  return vector;
}

module.exports = {
  cosineSimilarity,
  getBagOfWords,
};
