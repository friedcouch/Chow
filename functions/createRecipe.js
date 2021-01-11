const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

exports.handler = async (event, context) => {
  const { name, ingredients, instructions, creatorId } = JSON.parse(event.body)
  supabase
    .from('recipes')
    .insert({
      name: name,
      ingredients: ingredients,
      instructions: instructions,
      creator_id: creatorId
    })
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
