const testData = require("./test_data.js");

function calculateClassProbabilities(trainingData, testData) {
  const classes = {};
  trainingData.forEach((data) => {
    const label = data["S"];
    if (!classes[label]) {
      classes[label] = { count: 0, probabilities: {} };
    }
    classes[label].count++;
    const features = data["Q"];
    features.forEach((feature, index) => {
      if (!classes[label].probabilities[index]) {
        classes[label].probabilities[index] = {};
      }
      if (!classes[label].probabilities[index][feature]) {
        classes[label].probabilities[index][feature] = 0;
      }
      classes[label].probabilities[index][feature]++;
    });
  });

  Object.keys(classes).forEach((label) => {
    const totalCount = classes[label].count;
    Object.keys(classes[label].probabilities).forEach((index) => {
      Object.keys(classes[label].probabilities[index]).forEach((feature) => {
        classes[label].probabilities[index][feature] /= totalCount;
      });
    });
  });

  return classes;
}

function naiveBayes(trainingData, testData) {
  const classes = calculateClassProbabilities(trainingData, testData);
  const testFeatures = testData["Q"];
  let maxProbability = -1;
  let predictedClass = null;

  Object.keys(classes).forEach((label) => {
    const classProbabilities = classes[label].probabilities;
    let probability = 1;
    testFeatures.forEach((feature, index) => {
      if (classProbabilities[index] && classProbabilities[index][feature]) {
        probability *= classProbabilities[index][feature];
      } else {
        // Laplace smoothing for unseen features
        probability *= 1 / (classes[label].count + 1);
      }
    });

    if (probability > maxProbability) {
      maxProbability = probability;
      predictedClass = label;
    }
  });

  return predictedClass;
}

testData.forEach((testSet, index) => {
  console.log(`Test Set ${index + 1}:`);
  const trainingData = testSet["training_data"];
  const testData = testSet["test_data"];
  const result = naiveBayes(trainingData, testData);
  console.log("Predicted class:", result);
});
