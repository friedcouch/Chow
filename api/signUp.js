const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { email, password, username } = request.body
  supabase
    .from('users')
    .select('username')
    .eq('username', username) // Checks if the username exists
    .then(res => {
      if (res.data[0]) response.json({ error: 'Username taken' })
      return supabase.auth.signUp({ email, password })
    })
    .then(res => {
      if (res.error) {
        response.json({ error: res.error.message })
        return
      }
      return supabase
        .from('users')
        .insert({ username: username, uuid: res.user.id })
        .then(res => {
          response.json({
            user: res.data[0],
            authToken: supabase.auth.session()
          })
        })
    })
}
