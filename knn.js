function euclideanDistance(point1, point2) {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    sum += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sum);
}

function kNN(trainingData, testData, k) {
  const predictions = [];
  for (let i = 0; i < testData.length; i++) {
    const testPoint = testData[i].Q;
    const distances = [];
    for (let j = 0; j < trainingData.length; j++) {
      const trainPoint = trainingData[j].Q;
      const distance = euclideanDistance(testPoint, trainPoint);
      distances.push({ index: j, distance: distance });
    }
    distances.sort((a, b) => a.distance - b.distance);
    const kNearestNeighbors = distances.slice(0, k);
    const counts = {};
    for (let neighbor of kNearestNeighbors) {
      const label = trainingData[neighbor.index].S;
      counts[label] = (counts[label] || 0) + 1;
    }
    let maxCount = -1;
    let predictedClass = null;
    for (let label in counts) {
      if (counts[label] > maxCount) {
        maxCount = counts[label];
        predictedClass = label;
      }
    }
    predictions.push(predictedClass);
  }
  return predictions;
}

// Приклад використання:
const testData = require("./test_data.js");

testData.forEach((testSet, index) => {
  console.log(`Test Set ${index + 1}:`);
  const trainingData = testSet.training_data;
  const testData = [testSet.test_data];
  const k = 3; // Виберіть бажане значення k
  const predictions = kNN(trainingData, testData, k);
  console.log("Predicted class:", predictions[0]);
});
