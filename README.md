<p align="center"><img src="https://s3.postimg.org/cmp7ymz2b/chat.jpg"></p>

# Javascript-SupportChat-Module
This nice simple chat will take advantage of the socket.io libary

### Initialize the chat with your custom look on the client side
```javascript
new SupportChat({
  title: 'Support Chat',
  titleColor: '#ffffff',
  background: '#009688',
  event: '',
}).create();
```
## Or
### init it in another script and call on your chat instance create
```javascript
// could be done in different scripts for convinient.
var myChat = new SupportChat({
  title: 'Support Chat',
  titleColor: '#ffffff',
  background: '#009688',
  event: '',
})
```
And on the other script call:
```javascript
myChat.create();
```

## Please note: 
this chat-app is still in developing..so it's not yet fully functionally, if you wish to help get this going feel free to send me a pull request. thanks! :)
