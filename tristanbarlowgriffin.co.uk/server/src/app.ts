import express from 'express'
import { CONFIG } from './env'
import { imageUploadHandler, getImageHandler, getAllImageHandler, deleteImageHandler } from './images'
import { createHandler, getProjects, deleteProjectHandler, } from './projects'
import { validateKeyBody, validateKeyHeader } from './auth/auth'
import { resolve } from 'path'
import cors from 'cors'

export const app = express()
app
  .use(cors({
    allowedHeaders: '*',
    origin: '*'
  }))
  .use(express.json())
  .use((req, res, next) => {
    console.log('PATH: ', req.path, 'METHOD: ', req.method, ' QUERY: ', req.query, ' IP: ', req.ip)
    next()
  })


app.get('/api/projects', getProjects)
app.get('/api/image/:id', getImageHandler)

app.post('/api/validate', validateKeyBody)
app.get('/api/images', validateKeyHeader, getAllImageHandler)
app.post('/api/image/:id', validateKeyHeader, imageUploadHandler)
app.delete('/api/image/:id', validateKeyHeader, deleteImageHandler)
app.post('/api/projects/create', validateKeyHeader, createHandler)
app.delete('/api/projects/:id', validateKeyHeader, deleteProjectHandler)

app.use(express.static(resolve(__dirname, '..', 'build')))
app.use((req, res) => res.sendFile(resolve(__dirname, '..', 'build', 'index.html')))