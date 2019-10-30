const users =[];

const addUser = ({id,username,room})=>{

     username = username.trim().toLowerCase();
     room = room.trim().toLowerCase();

     if(!username||!room){
         return {error:"username required"}
     }

     const existingUser = users.find((user)=>{
         return user.room===room&&user.username===username
     })
     if(existingUser){
         return {error: "user present in the room with this username"}
     }

     const user = {id,username,room};
     users.push(user);
     console.log(users)
     return {error:undefined,user}
}

const removeUser=(id)=>{
     const index = users.findIndex((user)=>{
         return user.id===id
     })
     if(index>0){const user = users.splice(index,1)[0];
     return user;}
}

const getUser= (id)=>{
    const index = users.findIndex((user)=>{
            return user.id===id
        
    })
    if(index!=-1){
    return users[index];
    }
}

const getUsersInRoom = (room)=>{
    const collection =[]
     users.find((user)=>{
         console.log(user)
        if(user.room===room){
            console.log("yo")
            collection.push(user)
        }
    })
    return collection;
}


module.exports = {
    getUser,
    getUsersInRoom,
    addUser,
    removeUser
}

// const yo= addUser({id:21,username:"aniket",room:"o"})
// const yo0= addUser({id:32,username:"da",room:"ds"})