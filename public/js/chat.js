const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML


const {username, room}= Qs.parse(location.search,{ ignoreQueryPrefix:true })
socket.emit('join',{username,room},(error)=>{
     if(error){
         location.href="/"
         alert(error)      
        }
})

socket.on('roomData',({room,users})=>{
     const html= Mustache.render(sidebarTemplate,{
         room,
         users
     })
     document.querySelector('#sidebar').innerHTML = html
})

const autoscroll = ()=>{
    const newMessage = $messages.lastElementChild;
    const newMessageStyles  = getComputedStyle(newMessage)
    const margin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight+ margin;
    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop+ visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }


}
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username:message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})