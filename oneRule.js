const testData = require("./test_data.js");

function oneRule(trainingData, testData) {
  const rule = {};
  trainingData.forEach((data) => {
    const features = JSON.stringify(data["Q"]);
    const label = data["S"];
    if (!rule[features]) {
      rule[features] = { 0: 0, 1: 0 };
    }
    rule[features][label]++;
  });

  let bestRule = null;
  let bestCount = -1;
  Object.keys(rule).forEach((features) => {
    const counts = rule[features];
    const count = Math.max(...Object.values(counts));
    if (count > bestCount) {
      bestCount = count;
      bestRule = features;
    }
  });

  if (!bestRule) {
    return "No rule found";
  }

  return rule[bestRule];
}

testData.forEach((testSet, index) => {
  console.log(`Test Set ${index + 1}:`);
  const trainingData = testSet["training_data"];
  const testData = testSet["test_data"];
  const result = oneRule(trainingData, testData); // Передаем тестовые данные в функцию
  console.log(
    "Predicted class:",
    result === "No rule found for test data"
      ? result
      : Object.keys(result).reduce((a, b) => (result[a] > result[b] ? a : b))
  );
});
