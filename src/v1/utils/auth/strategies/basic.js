const passport = require('passport')
const { BasicStrategy } = require('passport-http')

passport.use(
  new BasicStrategy((username, password, cb) => {
    if (!username || !password) {
      return cb('{"error": "No existen datos para la autenticación"}', false)
    }

    const user = {
      username: username,
      password: password
    }

    return cb(null, user)
  })
)
