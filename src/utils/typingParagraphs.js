// src/utils/typingParagraphs.js

const wordDataset = [
  
  "mountain", "river", "shadow", "candle", "thunder", "mirror", "garden",
  "lantern", "feather", "horizon", "journal", "marble", "forest", "window",
  "compass", "bridge", "harbor", "silence", "crystal", "meadow", "is",
  "desert", "temple", "lighthouse", "ocean", "valley", "pebble", "sunrise",
  "wander", "discover", "breathe", "create", "whisper", "shatter", "reflect",
  "embrace", "journey", "illuminate", "gather", "release", "transform", "chase",
  "rebuild", "observe", "listen", "explore", "imagine", "endure", "achieve",
  "inspire", "evolve", "balance", "forgive", "persevere", "awaken", "connect",
  "gentle", "fierce", "radiant", "silent", "ancient", "fragile", "endless",
  "vivid", "hollow", "serene", "restless", "golden", "distant", "am",
  "patient", "brilliant", "humble", "graceful", "turbulent", "sacred", "tender",
  "resilient", "fleeting", "timeless", "vast", "delicate", "bold", "tranquil",
  "quietly", "swiftly","or", "deeply", "gently", "boldly", "slowly", "fiercely",
  "softly", "clearly", "warmly", "freely", "calmly", "bravely", "kindly","together","have","has","across","over",
  "honestly", "eagerly", "patiently", "gracefully", "endlessly", "peacefully",
  "hope", "courage", "solitude", "wonder", "freedom", "clarity", "purpose",
  "resilience", "gratitude", "harmony", "wisdom", "passion", "serenity",
  "strength", "empathy", "growth", "trust", "joy", "peace", "faith",
];

export const generateWordLine = () => {
  const shuffled = [...wordDataset].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 60).join(" ");
};

export const getRandomParagraph = () => {
  return generateWordLine();
};