import DestroyRoute from './resources/destroy_route'
import CreateRoute from './resources/create_route'
import UpdateRoute from './resources/update_route'
import ListRoute from './resources/list_route'
import ShowRoute from './resources/show_route'
import Collection from './collection'
import BackframeError from './error'
import _ from 'lodash'

class Resources extends Collection {

  collectionActions = null

  filterParams = null

  memberActions = null

  searchParams = null

  sortParams = null

  virtualFilters = null

  constructor(config = {}) {
    super(config)
    if(config.collectionActions) this.appendCollectionAction(config.collectionActions)
    if(config.filterParams) this.setFilterParams(config.filterParams)
    if(config.memberActions) this.appendMemberAction(config.memberActions)
    if(config.searchParams) this.setSearchParams(config.searchParams)
    if(config.sortParams) this.setSortParams(config.sortParams)
    if(config.virtualFilters) this.setVirtualFilters(config.virtualFilters)
  }

  setFilterParams(params) {
    this.filterParams = _.castArray(params)
  }

  setSearchParams(params) {
    this.searchParams = _.castArray(params)
  }

  setSortParams(params) {
    this.sortParams = _.castArray(params)
  }

  setVirtualFilters(virtualFilters) {
    this.virtualFilters = virtualFilters
  }

  setCollectionActions(actions) {
    this.collectionActions = _.castArray(actions)
  }

  appendCollectionAction(action) {
    this._appendItem('collectionActions', action)
  }

  prependCollectionAction(action) {
    this._prependItem('collectionActions', action)
  }

  setMemberActions(actions) {
    this.memberActions = _.castArray(actions)
  }

  appendMemberAction(action) {
    this._appendItem('memberActions', action)
  }

  prependMemberAction(action) {
    this._prependItem('memberActions', action)
  }

  render(options = {}) {

    return this._getRoutes().map(route => {

      if(this.path) route.prependPath(this.path)

      if(this.alterRequest) route.prependAlterRequest(this.alterRequest)

      if(this.beforeProcessor) route.prependBeforeProcessor(this.beforeProcessor)

      if(this.afterProcessor) route.prependAfterProcessor(this.afterProcessor)

      if(this.alterRecord) route.prependAlterRecord(this.alterRecord)

      if(this.beforeCommit) route.prependBeforeCommit(this.beforeCommit)

      if(this.afterCommit) route.prependAfterCommit(this.afterCommit)

      if(this.beforeRollback) route.prependBeforeRollback(this.beforeRollback)

      return route.render({
        ...options,
        ...this._getDestructuredOptions(this.customOptions, route.action)
      })

    })

  }

  async _fetchResource(req, trx, options) {

    req.resource = await options.model.where({
      id: req.params.id
    }).fetch({
      transacting: trx
    })

    if(req.resource) return req

    throw new BackframeError({
      code: 404,
      message: 'Unable to load record'
    })

  }

  _getRoutes() {

    const routes = []

    if(this._includeAction('list')) routes.push(this._getListRoute())

    if(this._includeAction('create')) routes.push(this._getCreateRoute())

    if(this.collectionActions) {

      this.collectionActions.map(route => routes.push(this._getCollectionRoute(route)))

    }

    if(this._includeAction('show')) routes.push(this._getShowRoute())

    if(this._includeAction('update')) routes.push(this._getUpdateRoute())

    if(this._includeAction('destroy')) routes.push(this._getDestroyRoute())

    if(this.memberActions) {

      this.memberActions.map(route => routes.push(this._getMemberRoute(route)))

    }

    return routes

  }

  _getListRoute() {
    return new ListRoute({
      defaultQuery: this._getDestructuredOption(this, 'defaultQuery', 'list'),
      defaultSort: this._getDestructuredOption(this, 'defaultSort', 'list'),
      filterParams: this._getDestructuredOption(this, 'filterParams', 'list'),
      model: this._getDestructuredOption(this, 'model', 'list'),
      serializer: this._getDestructuredOption(this, 'serializer', 'list'),
      searchParams: this._getDestructuredOption(this, 'searchParams', 'list'),
      sortParams: this._getDestructuredOption(this, 'sortParams', 'list'),
      withRelated: this._getDestructuredOption(this, 'withRelated', 'list')
    })
  }

  _getCreateRoute() {
    return new CreateRoute({
      allowedParams: this._getDestructuredOption(this, 'allowedParams', 'create'),
      model: this._getDestructuredOption(this, 'model', 'create'),
      serializer: this._getDestructuredOption(this, 'serializer', 'create'),
      virtualParams: this._getDestructuredOption(this, 'virtualParams', 'create')
    })
  }

  _getShowRoute() {
    return new ShowRoute({
      alterRequest: this._fetchResource,
      model: this._getDestructuredOption(this, 'model', 'show'),
      serializer: this._getDestructuredOption(this, 'serializer', 'show')
    })
  }

  _getUpdateRoute() {
    return new UpdateRoute({
      alterRequest: this._fetchResource,
      allowedParams: this._getDestructuredOption(this, 'allowedParams', 'update'),
      model: this._getDestructuredOption(this, 'model', 'update'),
      serializer: this._getDestructuredOption(this, 'serializer', 'update'),
      virtualParams: this._getDestructuredOption(this, 'virtualParams', 'update')
    })
  }

  _getDestroyRoute() {
    return new DestroyRoute({
      alterRequest: this._fetchResource,
      model: this._getDestructuredOption(this, 'model', 'destroy'),
      serializer: this._getDestructuredOption(this, 'serializer', 'destroy')
    })
  }

  _getCollectionRoute(route) {
    return route
  }

  _getMemberRoute(route) {
    route.prependPath('/:id')
    route.prependAlterRequest(this._fetchResource)
    return route
  }

}

export default Resources
