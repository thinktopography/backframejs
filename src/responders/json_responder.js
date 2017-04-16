import _ from 'lodash'
import { succeed } from '../utils/response'

export default (message, pagination, data, req, res, resolve, reject) => {

  const extra = (!_.isEmpty(pagination)) ? { pagination, data } : { data }

  succeed(res, 200, message, extra)

  resolve()

}