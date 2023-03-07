const express = require("express");
 const mongoose = require("mongoose");
const authRouter = require ("./routes/authRouter");
const homeRouter = require ("./routes/homePageRouter");
const app = express();

app.use(express.json());

app.use( "/", homeRouter);
app.use("/auth", authRouter);

app.use (function (req,res, next){
    res.status(404).send("NotFound");
});

//connect to DB
async function main(){
    try {
        await mongoose.connect("mongodb+srv://NAMEBASE:PASSWORD/?retryWrites=true&w=majority");
        app.listen(3000, ()=> console.log("Server started"));
    }catch (err){
        console.log(err);
    }
}
main();

process.on("SIGINT", async ()=>{
    await mongoose.disconnect();
    console.log("Disconnect");
    process.exit();
})