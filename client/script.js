import bot from './assets/bot.svg'
import user from './assets/user.svg'
import axios from 'axios'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator  
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it  
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile"> 
                    <img   
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>  
        </div>
    `
    )
}

const mydata = [];


const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    const chatPrompt = {
        role: 'user',
        content: data.get('prompt'),
    };
    mydata.push(chatPrompt);
    form.reset()

    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId)

    loader(messageDiv)

    const messages = mydata

    const res = await axios.post("https://tfyxhyp2fc.execute-api.us-east-1.amazonaws.com/default/chatgpt-bot", {messages}).then((res) => {
        clearInterval(loadInterval)
        messageDiv.innerHTML = ""
        if (res.data) {
            const reply = res.data.reply;
            const assChatPrompt = {
                role: 'assistant',
                content:  reply,
            };
            mydata.push(assChatPrompt);
            typeText(messageDiv, reply)
        }
    })   
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
