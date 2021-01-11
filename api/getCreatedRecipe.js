const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { creatorId } = request.body
  supabase
    .from('recipes')
    .select('*')
    .eq('creator_id', creatorId)
    .then(res => {
      if (res.error) throw res.error.message
      response.json(res.data)
    })
    .catch(error => response.json({ error }))
}
