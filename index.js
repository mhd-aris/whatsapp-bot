const { create, Client } = require('@open-wa/wa-automate')
const fetch = require('node-fetch')

const { getIdVideo, tiktokVideo } = require('./tiktok')



const options = require('./options')





const start = async (client = new Client()) => {
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage(async message => {
            const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
            let { body } = message
            const prefix = '#'
            body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const arg = body.substring(body.indexOf(' ') + 1)
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)
            const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
            const url = args.length !== 0 ? args[0] : ''
            const uaOverride = process.env.UserAgent


            if (message.body === 'P') {
             try {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
                .then(res => res.text())
                .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.sendText(message.from, randombijak, message.id)
                
              })
              .catch(() => {
                client.sendText(message.from, 'Ada yang Error!', id)
            })
            }
            catch (err){
            console.log(err)
            }
          }

          switch ( command ) {

            case 'tiktok' :

                body.slice(1).trim().split(/ +/).shift().toLowerCase()
                body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
                const args = body.trim().split(/ +/).slice(1)
                const url = args.length !== 0 ? args[0] : ''
                const isUrl = (url) => {
                    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
                }
                console.log(body);
                if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
                if (!isUrl(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
                await client.reply(from, `_Sabar sob, lagi diproses_`, id)
                await getIdVideo(url).then((id) =>{
                    tiktokVideo(id).then((vidTiktok)=>{
                        console.log('Send data ...')
                        client.sendFileFromUrl(from, vidTiktok, '', 'Berhasil sob! \n _By : Ris-test WA-bot_', id)
                    }).catch((err) => {
                        console.log('Error from tiktokVideo', err)
                        client.reply(from, `gagal Mendownload video!`, id)
                    })
                }).catch((err) => {
                    console.log('Error from getIdVideo', err)
                    client.reply(from, `gagal Mendapat id video!`, id)
                })
                break
            }   
        });
       
    }

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))