Clementine = require 'clementine'

MultiView = Clementine.View.extend

  initialize: (config = {}) ->
    @super config
    @views = {}

  activate: (view) ->
    if @views.hasOwnProperty view
      @target.replace @views[view].target
    else if @config.views?.hasOwnProperty view
      @views[view] = new @config.views[view]
      @target.replace @views[view].target

  activateDefault: ->
    @activate @config.defaultView if @config.hasOwnProperty 'defaultView'

module.exports = MultiView