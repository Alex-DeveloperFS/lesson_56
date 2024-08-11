import { notFoundTemplate, rootHtmlTemplate, todos, formTemplate, generateTodosTemplate } from './data.mjs'
import * as querystring from 'node:querystring'

const generateHtml = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  return res.end(rootHtmlTemplate)
}

const generateTodos = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  return res.end(generateTodosTemplate())
}

const generateForm = (req, res) => {
  if (!formTemplate) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain')
    res.end('Error: form template not loaded')
  } else {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    return res.end(formTemplate)
  }
}

const generateText = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  return res.end('Plain text HTTP server')
}

const generateJson = (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(todos))
}

const postData = (req, res) => {
  res.setHeader('Content-Type', 'text/plain')

  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let body = ''
    req.on('data', (chunk) => body += chunk.toString())
    req.on('end', () => {
      let todo = querystring.parse(body)
      todo = {
        id: +todo['id'],
        title: todo['title'],
        userId: +todo['userId'],
        completed: todo['completed'] === 'on'
      }
      todos.push(todo)
      res.statusCode = 201
      res.setHeader('Content-Type', 'text/html')
      res.end(generateTodosTemplate())
    })
  } else if (req.headers['content-type'] === 'application/json') {
    let dataJson = ''
    req.on('data', (chunk) => dataJson += chunk)
    req.on('end', () => {
      try {
        todos.push(JSON.parse(dataJson))
        res.statusCode = 201
        res.end('Todo data received')
      } catch (err) {
        res.statusCode = 400
        res.end('Todo data is not in JSON format')
      }
    })
  } else {
    res.statusCode = 400
    res.end('Todo data must be in JSON format')
  }
}

const generate404 = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  res.end(notFoundTemplate)
}

export { generateHtml, generateTodos, generateForm, generateJson, generateText, generate404, postData }