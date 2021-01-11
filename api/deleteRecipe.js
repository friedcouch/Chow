const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { recipeId } = request.body
  return supabase
    .from('recipes')
    .delete()
    .match({ id: recipeId })
    .then(res => {
      if (res.error) throw res.error.message
      response.json(res.data[0])
    })
    .catch(error => response.json({ error }))

}