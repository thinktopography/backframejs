import checkit from  'checkit'
import bookshelf from 'platform/services/bookshelf'
import ExpenseType from  './expense_type'
import Project from  './project'
import User from  'platform/models/user'

export default bookshelf.Model.extend({

  tableName: 'expenses_advances',

  hasTimestamps: ['created_at', 'updated_at'],

  rules: {
    name: ['required']
  },

  expense_type: function() {
    return this.belongsTo(ExpenseType, 'expense_type_id')
  },

  project: function() {
    return this.belongsTo(Project, 'project_id')
  },

  user: function() {
    return this.belongsTo(User, 'user_id')
  },

  initialize: function(attrs, opts) {
    this.on('saving', this.validateSave)
  },

  validateSave: function() {
    return new checkit(this.rules).run(this.attributes)
  }

})
