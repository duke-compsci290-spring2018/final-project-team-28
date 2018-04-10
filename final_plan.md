# Sonquest
Sonquest is a music exploration tool fit for a world in which services like Spotify Explore and last.fm already exist. Rather than trying to design cutting edge (TM) machine algorithms to suggest new tracks to users, it lets them explore the musical hits of history, building their own playlists from their favorite tracks. Sonquest shows unique data visualizations for each song playing, letting the user get to know music beyond humdrum metadata.   
### Landing page
![alt text](https://duke-compsci290-spring2018.github.io/final-project-team-28/images/landing.png \"Landing page\")
### History of music timeline
The first major component of Sonquest is a historical music exploration tool. On the landing page, users will be able to click years labeled on an interactive d3 timeline. When they do so, they will open up the history of music timeline for that specific year and be able to explore the year's top musical hits (according to Billboard).

The music timeline page for a specific year will alllow them to play samples of the year's top hits, visualize changes in the music charts for the time period, and view visualizations of song details.
Upon opening, a music timeline page will spend 20 seconds visualizing/playing tracks for each week of the year. The page will display a music player which allows users to navigate back and forwards through weeks (and thus songs), pause/play songs, change volume, and view upcoming/recently played tracks that topped the charts during previous weeks. The player will also allow the user to switch between playing any of the top 5 billboard tracks for the week instead of solely sticking with the #1 hit. This feature should be especially nice when users run into patches during which one song sticks on the top of the chart for many weeks at a time.

Directly below the media player, the page will include metadata about the song including artists details, contributor credits, release date, and album affiliation. If available, it will also present links to purchase/stream the music on popular platforms including Google Play Music, Spotify, and Tidal.  

Below the standard metadata box, the *timeline* section of the history of music timeline will display. The timeline will be a dyanamically moving line graph that shows the top five Billboard hits during the last five weeks. Each line will represent the chart path of an individual song and will be demarcated by a nearby image of the album art for the song it represents. The line's color will be coded according to the song's genre.

Finally, underneath the dyanmic timeline, the page will display d3 visualizations modelled around the current song. Such visualizations might include a scatterplot showing the song's performance relative to others in the same genre over the last 50 years, as well as word clouds and markov-generated new lyrics. 

![alt text](https://duke-compsci290-spring2018.github.io/final-project-team-28/images/playlist.png \"Timeline Page\")
### Personalized playlists
Users who log into the website will get to go beyond exploring music timelines and gain the ability to create playlists of songs they like, which they can play back at their leisure while exploring data visualizations as described above for each track. Users who choose not to log in (and those who do) will have free access to global playlists of music created by site adminsitrators. These playlists might be seasonal (e.g. Easter music or Thanksgiving music) or timely (e.g. President Obama's annuals best songs list), but either way, visualizations of their songs might offer interesting insights or reveal cool patterns.

The music player for playlists will mirror that of the history timeline's; the visualizations will be largely the same, too. One new visualization we might add would be a graph comparing the currently playing song's performance to other songs in the playlist.
### Technologies
- **d3.js**: We will use d3.js for all song data visualizations as well as for the interactive timeline on the landding page.
- **vue.js**: We will construct the music player, as well as each individual visualization wrapper using vue components. In addition, we will pass song/timeline data to our web template by using vue data bindings.
- **firebase**: User details, user playlist information, and global playist information will all be stored in firebase. Depending on data load times, we may also store timeline data in firebase. If, for some reason, we decide Firebase is not meeting our persistent data storage needs, we may switch to using PostgreSQL or MongoDB. 
- **showdown.js**: I accidentally typed this document in Markdown and needed to convert it to html.

### Resources
- **napster.js**: We will use the napster SDK to acquire song audio samples.
- **last.fm API**: We will use the last.fm API to get scrobble numbers for tracks as another gauge of popularity. We also plan to use it to get track metainformation.
![alt text](https://duke-compsci290-spring2018.github.io/final-project-team-28/images/lastfmapi.PNG \"last.fm API response\")
- **Unofficial Billboard API**: Billboard does not maintain its API any longer, so we plan to use a third party API to access its historical chart rankings 

![alt text](https://duke-compsci290-spring2018.github.io/final-project-team-28/images/billboardapi.PNG \"Bilboard API response\")
- **Genius API**: We plan to use this API to source song lyrics for markov prediction
### Additional website mockup pictures 
![alt text](https://duke-compsci290-spring2018.github.io/final-project-team-28/images/account.png \"User playlist page\")