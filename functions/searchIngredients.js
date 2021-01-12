const fetch = require('node-fetch')
const CALORIE_NINJA_KEY = process.env.CALORIE_NINJA_KEY

exports.handler = async (event, context) => {
  const { ingredients } = JSON.parse(event.body)
  const data = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${ingredients}`, {
    headers: { 'x-api-key': CALORIE_NINJA_KEY }
  })
    .then(res => res.json())
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}