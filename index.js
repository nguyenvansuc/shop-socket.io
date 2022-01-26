// const io = require('socket.io')(process.env.PORT||5000, {
//     cors: {
//       origin: 'https://shop-frontend-seven.vercel.app',
//     },
//   });
var app=require('express')();
var http=require('http').createServer(app);
var io=require('socket.io')(http,{
      cors: {
        origin: ['https://shop-frontend-seven.vercel.app','http://localhost:3000'],
      },
    })

app.get('/',(req,res)=>{
  res.status(200).json('success')
})

  let users = [{ idUser: 'default', socketId: 'default',rules:'default' }];
  const addUser = (idUser,rules, socketId) => {
    if(!users.some((user) => user.idUser === idUser)) {
      users.push({ idUser, rules,socketId });
    }
  };
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  const getUser = (user_id) => {
    return users.find((user) => user.userId === user_id);
  };

  // nhan ve
  io.on('connection', (socket) => {
    console.log('xin chao');
    socket.on('addUser',({idUser,rules})=>{
      addUser(idUser,rules,socket.id);
      console.log(users)
    })
    socket.on('clientDeleteOrder',(idOrder)=>{   
      const admin=users.find(user=>user.rules==='admin')
      if(admin){
        socket.to(admin.socketId).emit('serverDeleteOrder',idOrder)
      }
    })
    socket.on('clientAcceptOrder',({idOrder,idUser})=>{
      console.log(idOrder,idUser)
      const user=users.find(user=>user.idUser=== idUser)
      console.log(user)
      if(user){
        socket.to(user.socketId).emit('serverAcceptOrder',idOrder)
      }
    })
    socket.on('clientCreateOrder',(order) => {
      const admin=users.find(user=>user.rules==='admin')
      if(admin){
        socket.to(admin.socketId).emit('serverCreateOrder',{...order,statusOrder:'waiting'})
      }
    })
    socket.on('connect',() =>{
      socket.emit('reConnected')
    })
    socket.on('disconnect', () => {
      console.log('disconnect Socket');
      removeUser(socket.id);
      console.log(users,'dis')
    });
  });

  http.listen(process.env.PORT||5000,()=>{
    console.log('listening in 3000')
  })

// var socketIO=require('socket.io');
// let io =socketIO();
