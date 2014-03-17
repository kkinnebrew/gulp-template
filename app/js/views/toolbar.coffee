Clementine = require 'clementine'

ToolbarView = Clementine.View.extend

  initialize: (config = {}) ->
    @super(config)

  events: ->
    'logo': 'click': @onHome
    'navigation-item': 'click': @onNavigate
    'settings-btn': 'click': @onSettings

  outlets: ->
    'logo': '#logo'
    'menu-item': '.navigation(.navigation-item)'
    'settings-btn': '.settings-btn'
    'user-label': '.user-label'

  setUser: (user) ->
    @userLabel.text user.name

  onHome: (e) ->
    do e.stopPropagation
    @fire 'goto', 'home'

  onNavigate: (e, payload) ->
    do e.stopPropagation
    @fire 'goto', payload

  onSettings: (e) ->
    do e.stopPropagation
    @fire 'goto', 'settings'

module.exports = ToolbarView;