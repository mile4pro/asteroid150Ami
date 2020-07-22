import InitGame from './InitGame.js';


window.onload = function()
{
    fetch('script/config/config.json')
        .then(response => response.json())
        .then(response => new InitGame(response.config))
}
