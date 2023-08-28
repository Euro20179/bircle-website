import express from 'express'

import fs from 'fs'

const app = express()

app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/home.html")
})

app.get("/robots.txt", (_req, res) => {
    res.writeHead(200)
    res.end("User-agent: *\nDisallow: /")
})

app.get("/:file.js", (req, res) => {
    let filePath = `${__dirname}/js/${req.params.file}.js`
    if (!fs.existsSync(filePath)) {
        res.writeHead(404)
        res.end()
        return
    }
    res.setHeader("Content-Type", "application/javascript")
    res.sendFile(filePath)
})

app.get("/:file.css", (req, res) => {
    let filePath = `${__dirname}/css/${req.params.file}.css`
    if (!fs.existsSync(filePath)) {
        res.writeHead(404)
        res.end()
        return
    }
    res.setHeader("Content-Type", "text/css")
    res.sendFile(filePath)
})

app.get("/discord", (_req, res) => {
    res.sendFile(__dirname + "/discord-login.html")
})

app.get("/:file", (req, res) => {
    if (req.params.file === "custom") {
        fetch("http://localhost:8222/custom").then(res => res.text())
            .then(html => {
                res.writeHead(200)
                res.end(html)
            })
        return
    }
    else if(req.params.file === "garbage"){
        fetch("http://localhost:8222/garbage").then(res => res.text())
            .then(html => {
                res.writeHead(200)
                res.end(html)
            })
        return
    }
    let filePath = `${__dirname}/${req.params.file}.html`
    if (!fs.existsSync(filePath)) {
        res.writeHead(404)
        res.end()
        return
    }
    res.setHeader("Content-Type", "text/html")
    res.sendFile(filePath)
})

app.get("/garbage/:path", (req, res) => {
    fetch(`http://localhost:8222/garbage/${req.params.path}`).then(res => res.text())
        .then(html => {
            res.writeHead(200)
            res.end(html)
        })
})

app.get("/custom/:path", (req, res) => {
    fetch(`http://localhost:8222/custom/${req.params.path}`).then(res => res.text())
        .then(html => {
            res.writeHead(200)
            res.end(html)
        })
})

//backwards compat for the ico on /home
app.get("/api/profile/by-name/yeah/pfp", (_req, res) => {
    fetch("http://localhost:8222/api/profile/by-name/yeah/pfp").then(res => res.arrayBuffer())
        .then(buf => {
            res.setHeader("Content-Type", "image/webp")
            res.writeHead(200)
            res.end(Buffer.from(buf))
        })
})

app.listen(8080)
