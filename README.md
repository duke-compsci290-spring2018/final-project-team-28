# Basic Information
* Names: Gordon Huynh, Asa Royal
* NetIDs: ghh6, ajr74
* Date started: 4/22/18
* Date completed: 4/29/18
* Joint hour estimate: 76 hrs
* Student discussions: none
* Resources consulted: d3 github wiki, stackoverflow, vue documentation

# Assets
* Image assets
  * We dynamically pull album covers and mp3 tracks from the Spotify API but do not store them
  * We also have self-created images located in the "images" folder of our repo.
* Code assets
  * d3 (datviz)
  * axios (backend API request)
  * bootstrap-vue
  * express (backend server)
  * file-saver (json dump generation)
  * firebase (data persistance)
  * vuefire (firebase vue integration)
  * request (api requests)


# Bugs
We were not able to get d3 to work properly with Vue and Webpack. Whenever any sort of polygon was formed in our visualization, it was shaded black, obscuring the entire SVG. Unfortunately that kept us from putting our initially planned visualization on to the final website (we have a version of it on Github that works outside of webpack). Even in the d3 viz we have currently, the polygon effect manifests itself in an unchangeable black background.

# Site usefulness

Since the 1950s, Billboard has maintained the definitive list of every week’s most popular songs in the United States. Yet despite the existence of numerous archival music resources (most prominent among them, streaming site playlists), there are no widespread public sources that allow music lovers to audibly explore historical Billboard charts. Billboard publishes the historical lists on their website, but they neither maintain an API nor give people a way to listen to the playlist of hits. Spotify, Tidal, and Apple Music maintain lists of current Billboard hits (i.e. those from the current week), but those lists are dynamic and do not create permanent records. The final place one might turn for the ability to listen to historical billboard chart hits is to an “oldies” radio stations. Unfortunately, radio stations do not allow play on demand and often focus only on popular decades of music. Enter Sonquest. Using our app, music lovers can not only see the top weekly Billboard hits  since 1965, but also listen to the top-ranked song for the week. When users find an "oldie" they like — or a new song! — they can add it to one of their personal site playlists and later export the playlist for browsing.

# Special instructions: 
## Public use
Anyone can use the site by simply visiting the Heroku link. They are free to create/log in to accounts, but are not required to. Other than that, there is no set up. One existing example user account can be logged into with the following credentials: (Username: a; Password: a)

## Running locally

1. clone the github repository.
2. Install the package with `npm install`
3. Run a local server with `npm run dev`
4. Navigate to localhost:8080 (or to whatever port you're using)

# Data references: 
* [Song info (Spotify)](https://open.spotify.com/browse/featured) 
* [Chart rankings (Billboard)](https://www.billboard.com/charts/hot-100)

# Framework choices:

Our decision to use Vue really came down to a fifty-fifty coin toss with Angular. Gordon used Angular for his explore project and felt that the ease with which it allowed swapping data between components would be very useful considering that we wanted to move information of music player screens to user playlist screens. After completing an Angular tutorial, Asa had little preference as to whether to use Vue or Angular. We ultimately decided to use Vue because we were both very familiar with it from the project manager assignment. Over time we grew to regret that decision (Vue + webpack wouldn't play nice with d3), but we believe the project should have been doable with any two-way binding framework.
