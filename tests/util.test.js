// just an example will be deleted later
// with npx jest you can start unit test
// utils.test.js
// const { add } = require('./utils'); would look like normal
add = (a, b) => a + b

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3)
})

// utils.test.js
describe('add function', () => {
  test('adds positive numbers', () => {
    expect(add(1, 2)).toBe(3)
  })

  test('adds negative numbers', () => {
    expect(add(-1, -2)).toBe(-3)
  })
})

// strings.test.js
test('string matches', () => {
  expect('hello').toMatch(/hello/)
})

// arrays.test.js
test('array contains value', () => {
  expect(['apple', 'orange']).toContain('apple')
})

// objects.test.js
test('object has property', () => {
  expect({ name: 'John' }).toHaveProperty('name')
})

// exceptions.test.js
function throwError () {
  throw new Error('Test Error')
}

test('throws an error', () => {
  expect(throwError).toThrow('Test Error')
})

function add (a, b) {
  return a + b
}

// Code to be tested
async function fetchData (callback) {
  // Simulate fetching data asynchronously
  const data = 'Some data'
  callback(data)
}

// Test
test('fetchData calls callback with the correct data', () => {
  const callback = jest.fn()
  fetchData(callback)
  expect(callback).toHaveBeenCalledWith('Some data')
})
