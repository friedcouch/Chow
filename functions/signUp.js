const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

exports.handler = async (event, context) => {
  const { email, password, username } = JSON.parse(event.body)
  const data = await supabase
    .from('users')
    .select('username')
    .eq('username', username) // Checks if the username exists
    .then(res => {
      if (res.data[0]) throw 'Username taken'
      return supabase.auth
        .signUp({ email, password })
    })
    .then(res => {
      if (res.error) throw res.error.message
      return supabase
        .from('users')
        .insert({ username: username, uuid: res.user.id })
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