# Speedy A/B testing with an Edge App + Google Analytics

The Edge is a *great* place to solve certain categories of problems. For example: A/B testing - comparing multiple versions of a web page to see which one performs better.

A/B testing allows you to make the most out of your existing traffic. It's backed by **real** data from **real** users. This means you get crystal clear solutions for growing your business through app optimizations. You can test metrics such as session duration, bounce rate, conversions (and more), on features such as opt-in forms, pricing schemes, calls to action (and more). Almost *anything* that affects visitor behavior can be A/B tested. 

**WARNING**: Proper A/B testing can lead to: better resonance with your audience, boosted conversion rates and increased ROI.

The idea is that you take a subset of your users (or 100%, why not? go for it!) and break them up into randomly assigned groups. Each one of these groups simultaneously sees a slightly different version of your app during the testing period (usually at least 7 days). Then you can observe how each group interacts with each variant. From there, you can make an informed decision about which variation proves most effective for your business goals.

We think it’s important for you to be able to easily get started with an A/B test, assess your results and help you understand if the results you’re seeing are truly meaningful. So, we built an example using an Edge app + Google Analytics to help you do just that.

## A/B testing at the Edge

One of the benefits of a Fly Edge App is the speed at which you can deploy new features, and the flexibility in how you build them. Serving your app via Fly gives you many valuable CDN features - such as proxying, routing, and middleware. Taking advantage of these features means you can quickly serve cached versions of your app *straight* from Fly’s Edge servers (located all around the world). *And* you’re able to completely customize your caching and routing, directly at the Edge.

At Fly, we believe doing A/B testing at the Edge is the *best* way to get real data from your users without compromising performance. Edge Apps allow you to run your logic closer to your users. This example app uses a Fly Edge App to create test variations, and then deploys those variations to Edge servers across the globe. This ensures that visitors will receive your web page from whichever server they are closest to geographically. This helps to reduce latency and provides a smooth user experience. We then integrated Google Analytics tracking codes which helps us segment users into groups, observe conversion data and eventually pick a winner.

### How app speed affects A/B tests

Speed matters. A LOT. Obviously for your business as a whole, but especially in A/B testing. But what exactly does performance have to do with A/B testing? I'm glad you asked. If app performance is lagging for certain users during your test period, key metrics like conversion rate, bounce rate and revenue per user will be influenced. Even a *slight* delay to the page performance may impact these metrics. If you've been unsuccessful with A/B testing in the past, misunderstanding and mismanaging performance could well have been skewing the results of your tests. This Edge app ensures that results are authentic and reliable, because pages are coming directly from the cache stored on Edge servers.

## How it works

This app is simple for you to set up for your own experimental purposes. And although it's easy-to-use and understand, it's accomplishing *a lot* for you. Here's what its doing:

* Using Fly's proxy library to generate a fetch-like function that makes a request to an origin (your app)
* Sets your origin as the "original" version and then creates variants based on new code you provide in `/variants`
* Mounts each variant onto a different pathname (`/variation-one`, /`variation-two`, etc...)
* Checks `fly.cache` for response objects to serve to the user. If nothing is cached, make a request to the origin, create variant, and cache the response for faster loading in the future
* Deploy to Fly's Edge servers all over the world using one command (`fly deploy`)
* Adds Google Analytics tracking codes to the `<HEAD>` of your pages (`/variants/tracking.js`)
* Google takes care of user segmentation + conversion tracking
* Watch your experiment results and when concluded, Google picks a winner for you
* Implement the winning variant and......
* Grow your business *knowing* you've done everything right

## Set it up yourself

1. Install Fly globally: `npm install -g @fly/fly`
2. Clone this repository and open it: `git clone https://github.com/superfly/ab-test-example-app.git`, `cd ab-test-example-app`
3. Start the Fly server: `fly server`
4. Open http://localhost:3000 and you'll see the original version, open http://localhost:3000/variation-one and http://localhost:3000/variation-two to see the variants (if you open localhost and see one of the variants, this means the test is still live and this is the version that was randomly chosen for you to see)
5. Change `const backend` ([index.js#L14](https://github.com/superfly/ab-test-example-app/blob/master/index.js#L14)) to match your own app's domain
6. Feel free to add more variants (this app has 2 variants on top of the original)
7. Modify code in [`/variants/`](https://github.com/superfly/ab-test-example-app/tree/master/variants) to whatever app changes you want to test (this app tests 3 different sign up forms)
8. You'll also need to modify the `createVariant` function ([index.js#L123](https://github.com/superfly/ab-test-example-app/blob/master/index.js#L123)) to coincide with your own app's placement of DOM elements
9. When you're happy with your variants, it's time to deploy!
10. [Create a Fly account](https://fly.io/app/sign-up) if you don't already have one, and from the command line run:
	* `fly login`
	* `fly apps create <name-of-app>`
	* `fly deploy`
11. Then visit www.name-of-app.edgeapp.net to see it instantly!
	* `fly hostnames add <your-custom-hostname.com>` to add a custom domain name to your new Fly Edge app (and don't forget to visit your DNS provider (Cloudflare, DigitalOcean, WordPress, etc...) to make a record that we can use for your domain/hostname)
12. Sign into [Google Analytics](https://analytics.google.com/analytics/web/) (or create an account) and select **Behavior** > **Experiments** > **Create Experiment** ([click here for detailed instructions](https://support.google.com/analytics/answer/1745216?hl=en&ref_topic=1745208))
13. Select an objective (this example uses "Bounce Rate") and then specify which URL's to use for original + variants (this will be www.yourapp.com + www.yourapp.com/variation-one, www.yourapp.com/variation-two, etc...)
14. Add provided tracking codes to the `<HEAD>` of your app pages. This can be done by simply changing what's in [`/variants/tracking.js`](https://github.com/superfly/ab-test-example-app/blob/master/variants/tracking.js) to match your own codes
15. `fly deploy` again, and click "Start Experiment"
16. Hurray! Your A/B test is now live!

## What else can you do?

Since Google only allows you to test one domain name per experiment, this Edge app would be especially useful for A/B testing multiple backends. You can do this by "mounting" different backends onto different paths and then serving them all under [one hostname](https://fly.io/articles/one-hostname-to-rule-them-all-updated-version/). For example:

```javascript
const mounts = {
	'/variation-two': backends.generic("http://www.kittens.com/", {'host': "www.kittens.com"}),
	'/variation-one': backends.generic("http://www.dogs.com/", {'host': "www.dogs.com"}),
	'/': backends.generic("http://www.unicorns.com/", {'host': "www.unicorns.com"})
}
```