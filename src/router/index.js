const UserRouter = require('./user')
const ProfileRouter = require('./profile')
const PostRouter = require('./post')
const GroupRouter = require('./group')
const ConversationRouter = require('./conversation')

function router(app){
    app.use("/user",UserRouter)
    app.use("/profile",ProfileRouter)
    app.use("/post",PostRouter)
    app.use("/group",GroupRouter)
    app.use("/conversation",ConversationRouter)
}

module.exports = router