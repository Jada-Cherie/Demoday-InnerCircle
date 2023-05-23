const ObjectId = require('mongodb').ObjectId
// const { analyzeEmotions } = require('./utils');
module.exports = function(app, passport, db,) {
  // list of emotion keywords
const emotionKeywords = {
  // define a list of emotions and associated keywords
  // e.g., 'sad' is associated with keywords like 'sad', 'unhappy', 'depressed', etc.
  // the same is done for other emotions
  //started with writing down 15 words for each and then used chatgpt to expand on the assocaiated words (about 50 words in each array)
  sad: ['sad', 'unhappy', 'depressed', 'miserable', 'gloomy', 'heartbroken', 'tearful', 'downcast', 'despair', 'sorrowful', 'blue', 'melancholy', 'desolate', 'lonely', 'weepy', 'disappointed', 'devastated', 'troubled', 'hurt', 'painful', 'grief', 'wretched', 'forlorn', 'regretful', 'angst', 'bereaved', 'somber', 'dejected', 'lamenting', 'pessimistic', 'despondent', 'downhearted', 'heavy-hearted', 'morose', 'sullen', 'grieved', 'distressed', 'brokenhearted', 'woeful', 'pathetic', 'dismal', 'unfortunate', 'down', 'mournful', 'weeping', 'glum', 'tragic', 'dreary', 'upset', 'inconsolable'],
  happy: ['happy', 'joyful', 'excited', 'delighted', 'gleeful', 'content', 'thrilled', 'cheerful', 'joyous', 'ecstatic', 'upbeat', 'elated', 'jubilant', 'smiling', 'grateful', 'satisfied', 'blissful', 'euphoric', 'overjoyed', 'radiant', 'pride', 'prideful', 'pleased', 'merry', 'mirthful', 'gratified', 'fulfilled', 'exhilarated', 'cheery', 'beaming', 'glad', 'buoyant', 'exultant', 'animated', 'uplifted', 'festive', 'jovial', 'sunny', 'triumphant', 'delirious', 'ecstatic', 'triumphal', 'enthusiastic', 'bouncy', 'jolly', 'vibrant', 'rejoicing', 'glee', 'carefree', 'satisfied'],
  excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'animated', 'pumped', 'energized', 'passionate', 'fired up', 'exhilarated', 'amped', 'raring', 'frenzied', 'electric', 'dynamic', 'enthralling', 'intense', 'vibrant', 'rousing', 'roused', 'enthusiasm', 'anticipation', 'ardent', 'zealous', 'spirited', 'fervent', 'ecstatic', 'lively', 'overwhelmed', 'enthralling', 'rapturous', 'thrilling', 'exultant', 'delirious', 'passion', 'fanatical', 'wild', 'exuberant', 'vigorous', 'elevated', 'jubilant', 'delighted', 'triumphant', 'fired', 'dynamic', 'animated', 'blazing', 'enlivened', 'vivacious', 'passionate', 'bubbling', 'electrified'],
  angry: ['angry', 'frustrated', 'irritated', 'furious', 'enraged', 'infuriated', 'livid', 'outraged', 'incensed', 'aggravated', 'annoyed', 'resentful', 'hostile', 'irate', 'tempestuous', 'provoked', 'exasperated', 'mad', 'fuming', 'indignant', 'rage', 'wrath', 'ire', 'vexed', 'infuriate', 'agitated', 'boiling', 'irascible', 'angry', 'cross', 'offended', 'miffed', 'bitter', 'displeased', 'hateful', 'resentful', 'sore', 'worked up', 'incensed', 'provoked', 'riled', 'sulky', 'splenetic', 'outraged', 'enraged', 'spiteful', 'livid', 'outright', 'furious', 'angry', 'infuriating'],
  fear: ['fear', 'scared', 'anxious', 'afraid', 'terrified', 'nervous', 'panicked', 'startled', 'horrified', 'dreadful', 'petrified', 'worried', 'uneasy', 'tense', 'phobic', 'paranoid', 'frightened', 'apprehensive', 'fearful', 'anxiously', 'terror', 'dread', 'panic', 'horror', 'unease', 'distress', 'shock', 'anxiety', 'trepidation', 'terror-stricken', 'jittery', 'trembling', 'quaking', 'shivering', 'aghast', 'spooked', 'hysterical', 'scared stiff', 'timid', 'alarmed', 'startled', 'spooked', 'shaky', 'tremulous', 'insecure', 'edgy', 'uncomfortable', 'creeped out'],
  bored: ['bored', 'uninterested', 'indifferent', 'apathetic', 'listless', 'uninspired', 'tedious', 'weary', 'fatigued', 'mundane', 'monotonous', 'lifeless', 'stagnant', 'dull', 'unexciting', 'dreary', 'tiresome', 'lethargic', 'blah', 'unmotivated', 'tedium', 'ennui', 'apathy', 'weariness', 'yawn', 'snooze', 'drowsy', 'sluggish', 'unenthused', 'drab', 'drear', 'wearisome', 'humdrum', 'tiring', 'stale', 'bland', 'unstimulating', 'insipid', 'colorless', 'lackluster', 'unremarkable', 'unvaried', 'mind-numbing', 'stifling', 'stultifying', 'sleepy', 'dragging', 'ho-hum']
  }

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('indextwo.ejs');
    });
    app.get('/about', function(req, res) {
      res.render('about.ejs');
    });
    app.get('/videoChat', function(req, res) {
      res.render('video.ejs');
    });
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('journalEntry').find({name: req.user.local.email} ).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            journal: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });
// data for emoptions API ===============================================================
//got advice from R%y on how to solve the scope issue and get the back end and clienbt side to talk with each other
//retrieving all the emotions
app.get('/api/allData', (req, res) => {
  res.json(emotionKeywords)
})

app.post('/analyze-emotions', (req, res) => {
  const {entry} = req.body; // Assuming the text is sent in the request body as JSON

  // Perform emotion analysis using the analyzeEmotions function
  const emotionAnalysisResult = analyzeEmotions(text);

  // Send the emotion analysis result as the response
  res.json(emotionAnalysisResult);
})


// journal board routes ===============================================================

    app.post('/emotionsJournal', (req, res) => {
      const text = req.body.text
      const emotionResult = analyzeEmotions(text)
      db.collection('journalEntry').save({
        name: req.user.local.email,
        prompt: req.body.prompt,
        entry: req.body.entry,
        date: req.body.date,
        emotionScores: emotionResult
       }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.json(emotionResult)
        res.redirect('/profile')
      })
    })

    app.put('/updateJournal', (req, res) => {
      console.log(req.body)
      const {entry, id} = req.body
      console.log(id)
      db.collection('journalEntry')
        .findOneAndUpdate({
          "_id":ObjectId(id) 
        }, {
          $set: {
            entry: entry
          }
        }, {
          // sort: { _id: -1 },
          returnOriginal : false
          // upsert: true //if record not found then create one
        }, (err, result) => {
          if (err) return res.send(err)
          console.log(result)
          res.send(result)
        })
    })

    app.delete('/emotionsJournal', (req, res) => {
      console.log('it works', req.body)
      db.collection('journalEntry').findOneAndDelete(
        {
        entry: req.body.entry,
        date: req.body.date 
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
