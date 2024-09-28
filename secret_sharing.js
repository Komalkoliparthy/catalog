const fs = require('fs');

// Gaussian Elimination Function
function gaussianElimination(matrix) {
    const n = matrix.length;

    for (let i = 0; i < n; i++) {
        // Make the diagonal element 1
        let maxEl = Math.abs(matrix[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > maxEl) {
                maxEl = Math.abs(matrix[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row
        [matrix[maxRow], matrix[i]] = [matrix[i], matrix[maxRow]];

        // Make all rows below this one 0 in the current column
        for (let k = i + 1; k < n; k++) {
            let c = -matrix[k][i] / matrix[i][i];
            for (let j = i; j < n + 1; j++) {
                if (i === j) {
                    matrix[k][j] = 0;
                } else {
                    matrix[k][j] += c * matrix[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b
    let solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = matrix[i][n] / matrix[i][i];
        for (let k = i - 1; k >= 0; k--) {
            matrix[k][n] -= matrix[k][i] * solution[i];
        }
    }

    return solution;
}

// Function to decode y-value from the given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Main function to process the test case
function findConstantTerm(testCase) {
    const { keys, ...roots } = testCase;
    const n = keys.n;
    const k = keys.k;

    // Parse the input to get (x, y) pairs
    const points = [];
    for (let key in roots) {
        const x = parseInt(key);
        const y = decodeValue(roots[key].value, parseInt(roots[key].base));
        points.push({ x, y });
    }

    // Ensure we have at least k points
    if (points.length < k) {
        throw new Error('Not enough points to solve the polynomial');
    }

    // Build the system of equations (matrix)
    const matrix = [];
    for (let i = 0; i < k; i++) {
        const row = [];
        for (let j = k - 1; j >= 0; j--) {
            row.push(Math.pow(points[i].x, j));  // x^j term
        }
        row.push(points[i].y);  // y-value (RHS of the equation)
        matrix.push(row);
    }

    // Solve using Gaussian Elimination
    const solution = gaussianElimination(matrix);

    // The constant term is the last element of the solution array
    return solution[k - 1];
}

// Read the test cases from the JSON file
fs.readFile('test.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const jsonInput = JSON.parse(data);
    
    // Assuming the file contains an object, we loop through its keys
    Object.keys(jsonInput).forEach((testKey, index) => {
        const testCase = jsonInput[testKey];
        const constantTerm = findConstantTerm(testCase);
        console.log(`The constant term (c) for test case ${index + 1} is:`, constantTerm);
    });
});

