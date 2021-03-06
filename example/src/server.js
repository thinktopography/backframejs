import './services/environment'
import Backframe from 'backframe'
import { BackframeError, Plugin, Resources, Resource, Route, Segment, ExpressTransport } from 'backframe'
import UserSerializer from './serializers/user_serializer'
import knex from './services/knex'
import User from './models/user'

const authenticator = new Plugin({
  name: 'authenticator',
  alterRequest: async (req, trx, options) => {

    if(!options.authenticated) return

    if(!req.headers.authorization) {
      throw new BackframeError({
        code: 401,
        message: 'Unauthenticated request'
      })
    }

    const [,id] = req.headers.authorization.match(/Bearer (.*)/)

    const user = await User.where({ id }).fetch({
      transacting: trx
    })

  }
})

const activate = new Route({
  method: 'patch',
  path: '/activate',
  processor: (req, trx) => 'route2'
})

const users = new Resources({
  authenticated: {
    list: true,
    all: false
  },
  allowedParams: ['first_name','last_name','email','created_at'],
  filterParams: ['id','first_name','last_name','email','created_at'],
  model: User,
  path: '/users',
  memberActions: [
    activate
  ],
  serializer: UserSerializer,
  sortParams: ['id','first_name','last_name','email'],
  withRelated: ['photo']
})

const user = new Resource({
  allowedParams: ['first_name','last_name','email','created_at'],
  model: User,
  path: '/user',
  actions: [
    activate
  ],
  serializer: UserSerializer
})

const nestedRoute1 = new Route()
nestedRoute1.setMethod('get')
nestedRoute1.setPath('/three')
nestedRoute1.setProcessor((req, trx, options) => {
  return {
    records: [
      'one',
      'two',
      'three'
    ]
  }
})

const nestedRoute2 = new Route()
nestedRoute2.setMethod('get')
nestedRoute2.setPath('/four')
nestedRoute2.setProcessor((req, trx, options) => {
  return 'one'
})

const nestedSegment2 = new Segment()
nestedSegment2.setPath('/two')
nestedSegment2.addRoute([
  nestedRoute1,
  nestedRoute2
])

const nestedSegment1 = new Segment()
nestedSegment1.setPath('/one')
nestedSegment1.addRoute(nestedSegment2)

const authenticated = new Segment({
  routes: [
    users,
    user,
    nestedSegment1
  ]
})

const api = new Backframe({
  knex,
  path: '/api',
  plugins: [
    authenticator
  ],
  routes: [
    authenticated
  ]
})

const routes = api.render()

const transport = new ExpressTransport(routes)

transport.listen(3000, () => {

  console.log('Listening on 3000')

})
