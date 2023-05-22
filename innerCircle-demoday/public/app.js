import {AgoraRTC} from "agora-rtc-sdk-ng"
const APP_ID = "dd946348bfdf4cf697001d7da66e625b"
const TOKEN = "007eJxTYDhx5v9pz5kHD5+wSuU+cSxiwZvPH04vOnrn4rKob4FJ7jbbFBhSUixNzIxNLJLSUtJMktPMLM0NDAxTzFMSzcxSzYxMk7TLslMaAhkZ3iroszIyQCCIz8KQkpqbz8AAANXpI48="
const CHANNEL = "demo"
const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []// current users video/audio tracks
let remoteUsers = {}//other users video/audio tracks

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)


//trying to do a different code to see if it works
// //const config={
//   mode:'rtc',
//   codec: 'vp8'
// }
// const client = AgoraRTC.createClient(config);

// let options = {
//   appid: null,
//   channel: null,
//   uid: null,
//   token: null
// }
// let localTracks = {
//   videoTrack: null,
//   audioTrack: null
// }
// let remoteUsers = {};

// $("#join").click(async function(e){
//   try {
//     options.appid = $("#appid").val()
//     options.token = $("#token").val()
//     options.channel = $("#channel").val()
//   }catch(error){
//     console.error(error)
//   }finally {
//     $("#leave").attr("disabled", false)
//     $("#join").attr("disabled", true)
//   }
// })
// async function join (){
//   client.on("user-published", handleUserPublished)
//   client.on("user-unpublished", handleUserUnpublished)

//   [ options.uid, localTracks.audioTrack, localTracks.videoTrack ] = await Promise.all([
//     client.join(options.appid, options.channel, options.token || null),
//     AgoraRTC.createMicrophoneAudioTrack(),
//     AgoraRTC.createCameraVideoTrack()

//   ])

// }

// async function subscribe(){}
// async function leave() {}


// function handleUserPublished(user, mediaType) {}
// function handleUserUnpublished(user) {}