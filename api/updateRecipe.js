const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { recipeId, row } = request.body
  supabase
    .from('recipes')
    .update(row)
    .eq('id', recipeId)
    .then(res => {
      if (res.error) response.json({ error: res.error.message })
      response.json(res.data[0])
    })
}