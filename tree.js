const testData = require("./test_data.js");

// Функція для обчислення ентропії
function calculateEntropy(data) {
  const totalCount = data.length;
  const classes = {};
  data.forEach((entry) => {
    const label = entry["S"];
    if (!classes[label]) {
      classes[label] = 0;
    }
    classes[label]++;
  });

  let entropy = 0;
  Object.values(classes).forEach((count) => {
    const probability = count / totalCount;
    entropy -= probability * Math.log2(probability);
  });

  return entropy;
}

// Функція для розбиття даних за певним признаком та значенням
function splitData(data, featureIndex, value) {
  return data.filter((entry) => entry["Q"][featureIndex] === value);
}

// Функція для обчислення приросту інформації
function calculateInformationGain(data, featureIndex) {
  const entropyBeforeSplit = calculateEntropy(data);
  const uniqueValues = new Set(data.map((entry) => entry["Q"][featureIndex]));
  let entropyAfterSplit = 0;
  uniqueValues.forEach((value) => {
    const subset = splitData(data, featureIndex, value);
    const subsetEntropy = calculateEntropy(subset);
    const probability = subset.length / data.length;
    entropyAfterSplit += probability * subsetEntropy;
  });
  return entropyBeforeSplit - entropyAfterSplit;
}

// Функція для вибору найкращого признака для розбиття
function chooseBestFeature(data) {
  const numFeatures = data[0]["Q"].length;
  let bestFeatureIndex = -1;
  let maxInformationGain = -1;
  for (let i = 0; i < numFeatures; i++) {
    const informationGain = calculateInformationGain(data, i);
    if (informationGain > maxInformationGain) {
      maxInformationGain = informationGain;
      bestFeatureIndex = i;
    }
  }
  return bestFeatureIndex;
}

// Функція для побудови дерева рішень
function buildDecisionTree(data, depth = 0) {
  if (calculateEntropy(data) === 0 || depth >= 10) {
    // Додано обмеження на глибину дерева
    return data[0]["S"];
  }

  if (data[0]["Q"].length === 0) {
    // Якщо більше не залишилось признаків для розгляду
    const classes = {};
    data.forEach((entry) => {
      const label = entry["S"];
      if (!classes[label]) {
        classes[label] = 0;
      }
      classes[label]++;
    });
    return Object.keys(classes).reduce((a, b) => (classes[a] > classes[b] ? a : b));
  }

  const bestFeatureIndex = chooseBestFeature(data);
  const tree = {};
  const uniqueValues = new Set(data.map((entry) => entry["Q"][bestFeatureIndex]));
  uniqueValues.forEach((value) => {
    const subset = splitData(data, bestFeatureIndex, value);
    tree[value] = buildDecisionTree(subset, depth + 1);
  });
  return tree;
}

// Функція для класифікації тестового набору даних
function classify(tree, testData) {
  if (typeof tree === "object") {
    const keys = Object.keys(tree);
    const featureValue = testData["Q"][keys[0]]; // Перший (і єдиний) ключ
    const subTree = tree[featureValue];
    return classify(subTree, testData);
  } else {
    return tree;
  }
}

// Побудова дерева рішень та класифікація тестових даних
testData.forEach((testSet, index) => {
  console.log(`Test Set ${index + 1}:`);
  const trainingData = testSet["training_data"];
  const testData = testSet["test_data"];
  const decisionTree = buildDecisionTree(trainingData);
  const result = classify(decisionTree, testData);
  console.log("Predicted class:", result);
});
