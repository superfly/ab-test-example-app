import { responseCache } from '@fly/cache'
import backends from './lib/backends'
import {orig, p, formOriginal, styleOriginal, divStyle} from './variants/original'
import {one, formOne, styleOne, divStyle1} from './variants/one'
import {two, formTwo, styleTwo, divStyle2} from './variants/two'
import {script, trackingCode, experimentCode} from './variants/tracking'

fly.http.respondWith( routeMounts )

// cache key
let key = 'a/b-variant: '

// proxy fetch request to your app
const backend = backends.generic("http://www.example.com/", {'host': "www.example.com"})

// mount backends onto paths
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
        // if there is a response in the cache, serve it
        let cacheKey = key + path
        let cache = await responseCache.get(cacheKey)
          if (cache) {
            console.log("from cache at key: ", cacheKey)
            return cache
          }
          // otherwise proxy fetch, create variant, set cache, and serve new
          req.headers.delete("accept-encoding")
          let response = await backend(req, basePath)
          let orig = await original(response)
          await responseCache.set(cacheKey, orig)
          return orig
      }
    }

    // serve variants
    if (url.pathname === path || url.pathname.startsWith(path + "/")) {
    	if (path === "/variation-one") {
        // if there is a response in the cache, serve it
        let cacheKey = key + path
        let cache = await responseCache.get(cacheKey)
          if (cache) {
            console.log("from cache at key: ", cacheKey)
            return cache
          }
          // otherwise proxy fetch, create variant, set cache, and serve new
          req.headers.delete("accept-encoding")
      		let response = await backend(req, basePath)
        	let variant = await createVariant(response, one, formOne, styleOne, divStyle1)
          await responseCache.set(cacheKey, variant)
        	return variant
    	}

    	if (path === "/variation-two") {
        // if there is a response in the cache, serve it
        let cacheKey = key + path
        let cache = await responseCache.get(cacheKey)
          if (cache) {
            console.log("from cache at key: ", cacheKey)
            return cache
          }
          // otherwise proxy fetch, create variant, set cache, and serve new
          req.headers.delete("accept-encoding")
      		let response = await backend(req, basePath)
        	let variant = await createVariant(response, two, formTwo, styleTwo, divStyle2)
          await responseCache.set(cacheKey, variant)
        	return variant
    	}
    }
  }
  return new Response("not found", { status: 404 })
}

// creates original version from './variants/original'
async function original(resp) {
  let body = await resp.text()
  resp = new Response(body, resp)
  resp.document = Document.parse(body)

  // insert Google tracking codes from './variants/tracking'
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

// creates variant one from './variants/one' ... and variant two from './variants/two'
async function createVariant(resp, variantHeader, variantForm, variantStyle, variantDiv) {
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
  header[0].replaceWith(variantHeader)

  let paragraph = resp.document.querySelectorAll("p")
  paragraph[0].replaceWith(variantForm)
  paragraph[1].replaceWith(" ")

  let style = resp.document.querySelector("style")
  style.appendChild(variantStyle)

  let div = resp.document.querySelectorAll("div")
  div[0].setAttribute("style", variantDiv)

  body = resp.document.documentElement.outerHTML
  resp = new Response(body, resp)

  resp.headers.delete("content-length")
  return resp
}