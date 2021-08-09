const { getVideoMeta } = require('tiktok-scraper');
const fetch = require('node-fetch');
// let url = 'https://vt.tiktok.com/ZGJSTj9nR/'

const getIdVideo = async (url) => {
    try {
        const videoMeta = await getVideoMeta(url);
        const id = videoMeta.collector[0].id
        return id
    } catch (error) {
        console.log(error);
    }
}
const tiktokVideo = async (id) => new Promise((resolve, reject) => {
    fetch(`https://api.areltiyan.xyz/tiktokwm?idVideo=${id}`)
    .then(res => res.json())
    .then((data) => {
	    const grabData = data.no_watermark_link
        resolve(grabData)
    })
    .catch((err) => {
        reject(err)
    })
})



// getIdVideo(url).then(async (id) => {
//     tiktokVideo(id).then(data => console.log(data)).catch(err =>console.log(`Error from tiktok ${err}`))
// }).catch(err => console.log(`Error from getIdVideo ${err}`))

module.exports = { getIdVideo, tiktokVideo}
