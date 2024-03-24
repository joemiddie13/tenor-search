// Require Libraries
const express = require('express');

// App Setup
const app = express();

// Middleware
// Allow Express (our web framework) to render HTML templates and send them back to the client using a new function
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        foo() { return 'FOO!'; },
        bar() { return 'BAR!'; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// // Require tenorjs near the top of the file
// const Tenor = require("tenorjs").client({
//   // Replace with your own key
//   "Key": "MY API KEY WOULD GO HERE", // https://tenor.com/developer/keyregistration
//   "Filter": "high", // "off", "low", "medium", "high", not case sensitive
//   "Locale": "en_US", // Your locale here, case-sensitivity depends on input
// });


// // Routes
// app.get('/', (req, res) => {
//   // Handle the home page when we haven't queried yet
//   term = ""
//   if (req.query.term) {
//       term = req.query.term
//   }
//   // Tenor.search.Query("SEARCH KEYWORD HERE", "LIMIT HERE")
//   Tenor.Search.Query(term, "10")
//       .then(response => {
//           // store the gifs we get back from the search
//           const gifs = response;
//           // pass the gifs as an object into the home page
//           res.render('home', { gifs })
//       }).catch(console.error);
// })

// Refactored Stretch Challenge
const https = require('https');

app.get('/', (req, res) => {
  const term = req.query.term || '';
  const limit = 10;
  const apiKey = 'MY API KEY WOULD GO HERE';
  const apiUrl = `https://tenor.googleapis.com/v2/search?q=${term}&key=${apiKey}&limit=${limit}`;

  https.get(apiUrl, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const gifs = JSON.parse(data).results;
      res.render('home', { gifs });
    });
  }).on('error', (err) => {
    console.error('Error:', err);
    res.status(500).send('An error occurred while fetching GIFs');
  });
});

app.get('/greetings/:name', (req, res) => {
  // grab the name from the path provided
  const name = req.params.name;
  // render the greetings view, passing along the name
  res.render('greetings', { name });
})

// Start Server

app.listen(3000, () => {
  console.log('Gif Search listening on port localhost:3000!');
});
