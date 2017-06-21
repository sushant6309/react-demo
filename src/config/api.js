/**
 * Created by Sushant on 17/06/17.
 *
 * API Config
 *
 * React app
 */

export default {
  // The URL we're connecting to
  hostname: 'https://frontend-challenge-2.herokuapp.com/',

  // Map shortnames to the actual endpoints, so that we can
  // use them like so: AppAPI.ENDPOINT_NAME.METHOD()
  //  NOTE: They should start with a /
  //    eg.
  //    - AppAPI.recipes.get()
  //    - AppAPI.users.post()
  //    - AppAPI.favourites.patch()
  //    - AppAPI.blog.delete()
  endpoints: new Map([
    ['register', 'register/'], // If you change the key, update the reference below
    ['login', 'rest-auth/login/'],
    ['reminders', 'reminders/'],
  ]),

  // Which 'endpoint' key deals with our tokens?
  tokenKey: 'login',
};