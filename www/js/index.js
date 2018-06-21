var colors = [
  {
    id: 'yellow',
    title: 'Amarelo',
    backgroundColor: 'yellow-300',
    buttonColor: 'yellow-800',
    points: 5
  },
  {
    id: 'green',
    title: 'Verde',
    backgroundColor: 'green-300',
    buttonColor: 'green-800',
    points: 10
  },
  {
    id: 'blue',
    title: 'Azul',
    backgroundColor: 'blue-300',
    buttonColor: 'blue-800',
    points: 35
  },
  {
    id: 'red',
    title: 'Vermelho',
    backgroundColor: 'red-300',
    buttonColor: 'red-800',
    points: 50
  },
  {
    id: 'black',
    title: 'Preto',
    backgroundColor: 'black',
    buttonColor: 'grey-300',
    points: 100
  }
]

var players = []

if (window.localStorage.getItem('players')) {
  players = JSON.parse(window.localStorage.getItem('players'))
}

MobileUI.getPlayerFirstLetter = function (name) {
  return name[0].toUpperCase()
}

MobileUI.getPlayerClass = function (active) {
  return (active) ? 'player active-player' : 'player'
}

function save () {
  window.localStorage.setItem('players', JSON.stringify(players))
}

function getColor (colorId) {
  return colors.filter(function (color) {
    return color.id === colorId
  })[0]
}

function getActivePlayer () {
  return players.filter(function (player) {
    return player.active
  })[0]
}

function setActive (index) {
  var i = 0
  players = players.map(function (player) {
    player.active = false
    if (i === index) {
      player.active = true
    }
    i++
    return player
  })
  document.getElementById('player-' + index).classList.add('active-player')
  document.getElementById('arrow-active-player').className = 'arrow-up arrow-' + index
}

function setTotal (player) {
  var totalPoints = 0
  for (var colorId in player.qty) {
    var qty = (player.qty[colorId] >= 0) ? player.qty[colorId] : 0
    var points = getColor(colorId).points
    document.getElementById('player-qty-' + colorId).innerHTML = qty
    totalPoints += (qty * points)
  }
  document.getElementById('player-total-points').innerHTML = totalPoints + ' pontos'
  save()
}

function loadPlayer (index) {
  var player = players[index]

  setTimeout(function () {
    setActive(index)
    setTotal(player)
  }, 100)

  document.getElementById('player-name').innerHTML = player.name
}

function removeItem (colorId) {
  var player = getActivePlayer()
  player.qty[colorId]--
  setTotal(player)
}

function addItem (colorId) {
  var player = getActivePlayer()
  player.qty[colorId]++
  setTotal(player)
}

function savePlayer (playerForm) {
  MobileUI.show('player-content')
  MobileUI.hide('no-player-content')

  players.push({
    name: playerForm.name,
    qty: {
      yellow: 0,
      green: 0,
      blue: 0,
      red: 0,
      black: 0
    },
    active: true
  })

  MobileUI.clearForm('player-form')

  loadPlayer(players.length - 1)
}

function addPlayer () {
  MobileUI.hide('button-delete-player')
  alert({
    title: 'Jogador',
    message: ' ',
    template: 'alert-player',
    buttons: [
      {
        label: 'Salvar',
        class: 'text-green',
        onclick: function () {
          var playerForm = MobileUI.objectByForm('player-form')
          if (!playerForm.name) {
            alert({
              message: 'Ei, você precisa dar um nome ao jogador.',
              class: 'red',
              buttons: [
                {
                  label: 'OK',
                  class: 'text-white',
                  onclick: function () {
                    closeAlert()
                  }
                }
              ]
            })
          } else {
            savePlayer(playerForm)
            closeAlert()
          }
        }
      },
      {
        label: 'Cancelar',
        class: 'text-gray-600',
        onclick: function () {
          closeAlert()
        }
      }
    ]
  })
}

window.onload = function () {
  var length = players.length
  if (length > 0) {
    loadPlayer(0)
    if (length === 6) {
      MobileUI.hide('button-add-player')
    }
  } else {
    MobileUI.hide('player-content')
    MobileUI.hide('no-player-content')
  }
}
