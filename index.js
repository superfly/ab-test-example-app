import backends from './lib/backends'
import {orig, p, formOriginal, styleOriginal, divStyle} from './variants/original'
import {one, formOne, styleOne, divStyle1} from './variants/one'
import {two, formTwo, styleTwo, divStyle2} from './variants/two'
import {script, trackingCode, experimentCode} from './variants/tracking'

fly.http.respondWith( routeMounts )

const backend = backends.generic("http://www.example.com/", {'host': "www.example.com"})

const mounts = {
	'/variation-two': backend,
	'/variation-one': backend,
	'/': backend
}

async function routeMounts(req) {
  const url = new URL(req.url)
  for (const path of Object.getOwnPropertyNames(mounts)) {
    const trailingSlash = path[path.length - 1] === '/'
    const backend = mounts[path]
    const basePath = path + (!trailingSlash && "/" || "")

    // serve original version
    if (trailingSlash && url.pathname.startsWith(path)) {
      if (path === "/") {
        req.headers.delete("accept-encoding")
        let response = await backend(req, basePath)
        let orig = await original(response)
        return orig
      }
    }

    // serve variants
    if (url.pathname === path || url.pathname.startsWith(path + "/")) {
    	if (path === "/variation-one") {
        req.headers.delete("accept-encoding")
    		let response = await backend(req, basePath)
      	let variant = await variationOne(response)
      	return variant
    	}
    	if (path === "/variation-two") {
        req.headers.delete("accept-encoding")
    		let response = await backend(req, basePath)
      	let variant = await variationTwo(response)
      	return variant
    	}
    }
  }
  return new Response("not found", { status: 404 })
}

async function original(resp, encoding) {
  let body = await resp.text()
  resp = new Response(body, resp)
  resp.document = Document.parse(body)

  let head = resp.document.querySelector("head")
  let headValue = head.outerHTML
  head.replaceWith(`<head>${experimentCode}</head>`)
  head = resp.document.querySelector("head")
  head.appendChild(script)
  head.appendChild(`<script>${trackingCode}</script>`)
  head.appendChild(headValue)

  let header = resp.document.querySelectorAll("h1")
  header[0].replaceWith(orig)

  let paragraph = resp.document.querySelectorAll("p")
  paragraph[0].replaceWith(formOriginal)
  paragraph[1].replaceWith(p)

  let style = resp.document.querySelector("style")
  style.appendChild(styleOriginal)

  let div = resp.document.querySelectorAll("div")
  div[0].setAttribute("style", divStyle)

  body = resp.document.documentElement.outerHTML
  resp = new Response(body, resp)

  resp.headers.delete("content-length")
  return resp
}


async function variationOne(resp, encoding) {
  let body = await resp.text()
  resp = new Response(body, resp)
  resp.document = Document.parse(body)

  let head = resp.document.querySelector("head")
  let headValue = head.outerHTML
  head.replaceWith(`<head>${script}</head>`)
  head = resp.document.querySelector("head")
  head.appendChild(`<script>${trackingCode}</script>`)
  head.appendChild(headValue)

  let header = resp.document.querySelectorAll("h1")
  header[0].replaceWith(one)

  let paragraph = resp.document.querySelectorAll("p")
  paragraph[0].replaceWith(formOne)
  paragraph[1].replaceWith(" ")

  let style = resp.document.querySelector("style")
  style.appendChild(styleOne)

  let div = resp.document.querySelectorAll("div")
  div[0].setAttribute("style", divStyle1)

  body = resp.document.documentElement.outerHTML
  resp = new Response(body, resp)

  resp.headers.delete("content-length")
  return resp
}

async function variationTwo(resp, encoding) {
  let body = await resp.text()
  resp = new Response(body, resp)
  resp.document = Document.parse(body)

  let head = resp.document.querySelector("head")
  let headValue = head.outerHTML
  head.replaceWith(`<head>${script}</head>`)
  head = resp.document.querySelector("head")
  head.appendChild(`<script>${trackingCode}</script>`)
  head.appendChild(headValue)

  let header = resp.document.querySelectorAll("h1")
  header[0].replaceWith(two)

  let paragraph = resp.document.querySelectorAll("p")
  paragraph[0].replaceWith(formTwo)
  paragraph[1].replaceWith(" ")

  let style = resp.document.querySelector("style")
  style.appendChild(styleTwo)

  let div = resp.document.querySelectorAll("div")
  div[0].setAttribute("style", divStyle2)

  body = resp.document.documentElement.outerHTML
  resp = new Response(body, resp)

  resp.headers.delete("content-length")
  return resp
}


