Clementine = require 'clementine'
ToolbarView = require './toolbar'
MultiView = require './multi'

ActivityView = require './activity'
PortfolioView = require './portfolio'
PerformanceView = require './performance'

AppView = Clementine.View.extend

  initialize: (config = {}) ->
    @super(config)

    @toolbarView = new ToolbarView
      'selected': 'portfolio'

    @multiView = new MultiView
      'defaultView': 'portfolio'
      'views':
        'activity': ActivityView
        'portfolio': PortfolioView
        'performance': PerformanceView

  events: ->
    'toolbarView': 'goto': -> @onGoto

  outlets: ->
    'toolbar': '.toolbar',
    'content': '.content'

  render: ->
    @toolbar.replaceWith @toolbarView.target
    @content.replaceWith @mutliView.target
    do @mutliView.activateDefault

  onGoto: (e, view) ->
    do e.stopPropagation
    @multiView.activate view

module.exports = AppView;