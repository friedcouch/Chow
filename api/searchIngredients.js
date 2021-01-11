const fetch = require('node-fetch')
const CALORIE_NINJA_KEY = process.env.CALORIE_NINJA_KEY

module.exports = (request, response) => {
  const { ingredients } = request.body
  return fetch(`https://api.calorieninjas.com/v1/nutrition?query=${ingredients}`, {
    headers: { 'x-api-key': CALORIE_NINJA_KEY }
  })
    .then(res => res.json())
    .then(res => response.json(res))
}
