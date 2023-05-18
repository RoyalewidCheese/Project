const express = require("express")
const {pool,verifyToken} = require("../Security.js")

const dashboardRoute= express.Router()

dashboardRoute.get("/tabledata",(req,res)=>{
    
})

dashboardRoute.get("/",verifyToken,(req,res)=>{


    pool.getConnection(function(err, conn) {
        console.log(err);
        if(err) return 
        conn.query("SELECT * FROM Project.Category;",(err,result)=>{
          res.render('dashboard', { isAdmin: req.isAdmin ,result});
        })
        pool.releaseConnection(conn);
    })
    
})

module.exports=dashboardRoute