const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = (request, response) => {
  const { email, password } = request.body
  console.log(email)
  supabase.auth
    .signIn({ email, password })
    .then(res => {
      console.log(res)
      if (res.error) throw res.error.message
      return supabase
        .from('users')
        .select('*')
        .eq('uuid', res.user.id) // res.user.id is the UUID in auth.users
    })
    .then(res => {
      console.log(res.data[0])
      if (res.error) throw res.error.message
      response.json(res.data[0])
    })
    .catch(error => response.json({ error }))
}