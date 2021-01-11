const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { name, ingredients, instructions, creatorId } = request.body
  supabase
    .from('recipes')
    .insert({
      name: name,
      ingredients: ingredients,
      instructions: instructions,
      creator_id: creatorId
    })
    .then(res => {
      if (res.error) response.json({ error: res.error.message})
      response.json(res.data[0])
    })
}
