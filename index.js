require('events').EventEmitter.defaultMaxListeners = 30;

// Load telegraf library
const { Telegraf } = require('telegraf')

// Load message filters in the telegraf library
const { message } = require('telegraf/filters');

// Load ping library
const ping = require('ping');

// Load http library
const http = require('http');

// Load wol library
const wol = require('wol');

// Initialize bot with its token
const bot = new Telegraf(%BOT_TOKEN%)

// Initialize host IP
const hostIp = %HOST_IP%

// Initialize host MAC
const macAddress = %PC_MAC_ADDRESS%

// stickers On and Off
const stickerOn = 'CAACAgIAAxkBAAEe8QpkI142MHqW3Y2Mkere_FfRnDkVdAACRgADUomRI_j-5eQK1QodLwQ'
const stickerOff = 'CAACAgIAAxkBAAEe8QhkI11Qb2wuELp_3Vk-PQK_JwkkMAACUgADUomRI7eY2bSE0BYzLwQ'

// Initialize authorized id
const group = [%CHAT_ID%]

// On boot message
group.forEach(user => {
    bot.telegram.sendMessage(user, "Bro mi ero spento 😱\nOra però sono operativo 😁", {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Elimina messaggio 🗑️', callback_data: 'delete_me'}
                ]
            ]
        }
    })
});


// Start message text
function startTextMessage(context){
    return"Ciao "+context.chat.first_name+" 👋, come ti posso aiutare?\n\n➔Vuoi sapere l'<b>IP della rete</b>?\n➔Vuoi sapere se <b>il tuo PC è acceso</b>?\n➔Vuoi avere maggiori <b>info su di me</b>?\n➔Vuoi <b>accendere il tuo PC</b>?\n\nNon sforzarti a scrivere i vari comandi, anche perche non ce ne sono 😅, usa i bottoni qui sotto 👇"
}

// Ping pc (Sticker)
function pingPcSticker(context) {
    ping.sys.probe(hostIp, function(isAlive){
        context.deleteMessage()
        context.sendSticker(isAlive ? stickerOn : stickerOff, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '« Torna indietro', callback_data: 'start_by_sticker'}
                    ]
                ]
            }
        })
    })
}

// Ping pc
function pingPc(context) {
    ping.sys.probe(hostIp, function(isAlive){
        context.answerCbQuery()
        context.editMessageText(isAlive ? '👍' : '👎',{
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '« Torna indietro', callback_data: 'start'}
                    ]
                ]
            }
        })
    })
}

// Get ip
function getIp(context) {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
        resp.on('data', function(ip) {
            context.answerCbQuery()
            context.editMessageText("Per il momento l'indirizzo IP è " + ip,{
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: '« Torna indietro', callback_data: 'start'},
                            {text: 'Vai alla pagina web', url: %PEROSNAL_URL%}
                        ]
                    ]
                }
            })
        })
    })
}

// WOL request
function wolRequest(context) {
    context.answerCbQuery()
    context.editMessageText('Sei sicuro di voler inviare il Magic Packet?', {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'No', callback_data: 'start'},
                    {text: 'Si', callback_data: 'send_magic_packet'}
                ]
            ]
        }
    })
}

// Send Magic Packet
function sendMagicPacket(context) {
    wol.wake(macAddress, function(err, res) {
        if(res) {
            context.answerCbQuery()
            context.editMessageText('Pacchetto inviato con successo 😁', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: '🏠 Torna al menu', callback_data: 'start'}
                        ]
                    ]
                }
            })
        }
    })
}

// Start message
function startMessage(context) {
    if(group.includes(context.chat.id)) {
        bot.telegram.sendMessage(context.chat.id, startTextMessage(context), {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: 'Qual è l\'IP della rete?', callback_data: 'ip'},
                        {text: 'È accesso il PC?', callback_data: 'status'}
                    ],
                    [
                        {text: 'info', callback_data: 'info'},
                        {text: 'cookie', callback_data: 'cookie'}
                    ],
                    [
                        {text: 'Accendi PC', callback_data: 'turnon'}
                    ]
                ]
            }
        })
    }
}

// Info message
function infoMessage(context) {
            context.answerCbQuery()
            context.editMessageText("Cosa vuoi sapere su di me?\n\n➔Vuoi sapere <b>chi mi ha creato</b>?\n➔Vuoi sapere la <b>libreria che utilizzo</b>?\n➔Vuoi vedere <b>il mio stato</b>?",{
            parse_mode: 'HTML',
            reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Crediti', callback_data: 'crediti'},
                    {text: 'Libreria', callback_data: 'libreria'},
                ],
                [
                    {text: 'Dashboard', url: %PEROSNAL_URL%}
                ],
                [
                    {text: '« Torna indietro', callback_data: 'start'}
                ]
            ]
        }
    })
}

// -----------ACTION-----------

// Start action
bot.action('start', (context) => {
    context.answerCbQuery()
    context.editMessageText(startTextMessage(context), {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Qual è l\'IP della rete?', callback_data: 'ip'},
                    {text: 'È accesso il PC?', callback_data: 'status'}
                ],
                [
                    {text: 'info', callback_data: 'info'},
                    {text: 'cookie', callback_data: 'cookie'}
                ],
                [
                    {text: 'Accendi PC', callback_data: 'turnon'}
                ]
            ]
        }
    })
})

// Delete me action
bot.action('delete_me', (context) => {
    context.answerCbQuery()
    context.deleteMessage()
})

// Start by sticker action
bot.action('start_by_sticker', (context) => {
    context.answerCbQuery()
    context.deleteMessage()
    startMessage(context)
})

// Info action
bot.action('info', (context) => {
    infoMessage(context)
})

// Ip action
bot.action('ip', (context) => {
    getIp(context)
})

// WakeOnLan action
bot.action('turnon', (context) => {
    wolRequest(context)
})

// WakeOnLan action
bot.action('send_magic_packet', (context) => {
    sendMagicPacket(context)
})

// Status action
bot.action('status', (context) => {
    pingPc(context)
})

// Cookie action
bot.action('cookie', (context) => {
    context.answerCbQuery()
    context.editMessageText('🍪')
    setTimeout(function(){
        context.editMessageText('Ciao bro! io sono Cookie 🍪', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '« Torna indietro', callback_data: 'start'}
                    ]
                ]
            }
        })
    },3000)
})

// Crediti action
bot.action('crediti', (context) => {
    context.answerCbQuery()
    context.editMessageText('🤡')
    setTimeout(function(){
        context.editMessageText('Questo bot è stato creato da @gentil104', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '« Torna indietro', callback_data: 'info'},
                        {text: '🏠 Torna al menu', callback_data: 'start'}
                    ]
                ]
            }
        })
    },3000)
})

// Libreria action
bot.action('libreria', (context) => {
    context.answerCbQuery()
    context.editMessageText('🤖')
    setTimeout(function(){
        context.editMessageText('Questo bot utilizza la libreria <i><a href="https://telegraf.js.org/">Telegraf</a></i>', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '« Torna indietro', callback_data: 'info'},
                        {text: '🏠 Torna al menu', callback_data: 'start'}
                    ]
                ]
            }
        })
    },3000);
})


// -----------ON-----------

// On text message
bot.on(message('text'), (context) => {
    startMessage(context)
})


// -----------START/STOP-----------

// Launch bot
bot.launch()

// Stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
