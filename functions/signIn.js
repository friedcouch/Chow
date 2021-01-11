const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/* module.exports = (request, response) => {
  const { email, password } = request.body
  console.log(email)
  supabase.auth
    .signIn({ email: 'b@b.b', password: 'ccc' })
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
} */

exports.handler = async (event, context) => {
  const { email, password } = JSON.parse(event.body)
  const data = await supabase.auth
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
      return res.data[0]
    })
    .catch(err => err)
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}