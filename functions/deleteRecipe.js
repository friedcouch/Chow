const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

exports.handler = async (event, context) => {
  const { recipeId } = JSON.parse(event.body)
  const data = await supabase
    .from('recipes')
    .delete()
    .match({ id: recipeId })
    .then(res => {
      if (res.error) throw res.error.message
      return res.data[0]
    })
    .catch(err => err)
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}