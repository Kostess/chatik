let express = require('express');
let app = express();
let port = 3000;

const { v4: uuidv4 } = require('uuid');

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});

// Раздача статики
app.use(express.static('public'));

// Настройка handlebars
let hbs = require('hbs');
app.set('views', 'views');
app.set('view engine', 'hbs');

// Обработка POST-запросов
app.use(express.urlencoded({ extended: true }));

// Данные
let chats = [
    {
        nameUser: 'Admin',
        password: '1234',
        chats: [
            {
                idChat: uuidv4(),
                title: "test chat",
                message: [
                    {
                        author: 'Admin',
                        text: "Привет, мир!"
                    }
                ]
            }
        ]
    },
];

let currentUser = {};
let isOpenChat = false;
let isSignIn = false;
let currentChat = {};

const searchUser = (nameUser, password) => {
    return chats.find((item) => {
        return item.nameUser === nameUser && item.password === password;
    });
};

const checkingForUserAvailability = (currentUser) => {
    return !Object.keys(currentUser || {}).length;
};

const searchUserIndex = (nameUser, password) => {
    return chats.findIndex(user => user.nameUser === nameUser && user.password === password);
}

app.get('/', (req, res) => {
    res.render('index', {
        user: currentUser.nameUser,
        chats: currentUser.chats,
        chat: currentChat,
        message: currentChat.message,
        isOpenChat: isOpenChat,
        isSignIn: isSignIn,
    });
});

app.post('/auth', (req, res) => {
    const { nameUser, password } = req.body;
    currentUser = searchUser(nameUser, password);
    if (checkingForUserAvailability(currentUser)) {
        res.send('Пользователь не найден');
    } else {
        isSignIn = true;
        res.redirect('/');
    }
});

app.post('/registration', (req, res) => {
    const { nameUser, password } = req.body;

    if (checkingForUserAvailability(searchUser(nameUser, password))) {
        chats.push({
            nameUser,
            password,
            chats: []
        });
        currentUser = chats[chats.length - 1];
        isSignIn = true;
        res.redirect('/');
    } else {
        res.send('Такой пользователь уже есть');
    }
});

app.get('/exit', (req, res) => {
    isSignIn = false;
    isOpenChat = false;
    currentUser = {};
    res.redirect('/');
});

app.post('/add-post', (req, res) => {
    const title = req.body.titleChat;

    const indexUser = searchUserIndex(currentUser.nameUser, currentUser.password)
    if (searchUserIndex(currentUser.nameUser, currentUser.password) !== -1) {
        chats[indexUser].chats.push({
            idChat: uuidv4(),
            title,
            message: []
        });
        currentUser = chats[indexUser];
    }

    res.redirect('/');
});

app.get('/remove', (req, res) => {
    const idChat = req.query.id;

    const indexUser = searchUserIndex(currentUser.nameUser, currentUser.password)
    if (searchUserIndex(currentUser.nameUser, currentUser.password) !== -1) {
        const chatIndex = chats[indexUser].chats.findIndex(chat => chat.idChat === idChat);
        if (chatIndex !== -1) {
            chats[indexUser].chats.splice(chatIndex, 1);
            currentUser = chats[indexUser];
        }
    }

    res.redirect('/');
});

app.get('/open', (req, res) => {
    const idChat = req.query.id;

    currentChat = currentUser.chats.find(chat => chat.idChat === idChat)

    isOpenChat = !isOpenChat;
    res.redirect('/');
});

app.post('/add-message', (req, res) => {
    const indexUser = searchUserIndex(currentUser.nameUser, currentUser.password);
    if (indexUser !== -1) {
        const chatIndex = chats[indexUser].chats.findIndex(chat => chat.idChat === currentChat.idChat);
        if (chatIndex !== -1) {
            chats[indexUser].chats[chatIndex].message.push({
                author: currentUser.nameUser,
                text: req.body.message
            })
            currentUser = chats[indexUser];
        }
    }
    res.redirect('/');
});