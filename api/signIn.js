const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { email, password } = request.body
  supabase.auth
    .signIn({ email, password })
    .then(res => {
      if (res.error) throw res.error.message
      return supabase
        .from('users')
        .select('*')
        .eq('uuid', res.user.id) // res.user.id is the UUID in auth.users
    })
    .then(res => {
      if (res.error) throw res.error.message
      response.json({
        user: res.data[0],
        authToken: supabase.auth.session()
      })
    })
    .catch(error => response.json({ error }))
}