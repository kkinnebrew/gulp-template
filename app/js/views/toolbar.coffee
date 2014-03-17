Clementine = require 'clementine'

ToolbarView = Clementine.View.extend

  initialize: (config = {}) ->
    @super config

  events: ->
    'logo': 'click': @onHome
    'navigationItem': 'click': @onNavigate
    'settingsBtn': 'click': @onSettings

  outlets: ->
    'logo': '#logo'
    'menuItem': '.navigation(.navigation-item)'
    'settingsBtn': '.settings-btn'
    'userLabel': '.user-label'

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