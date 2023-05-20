var editBtn = document.querySelectorAll(".fa-pencil");
var saveBtn = document.querySelectorAll(".ph-upload-simple")
var trash = document.getElementsByClassName("fa-trash");
var editInput = document.querySelectorAll(".editEntry")
var inputEntry = document.querySelector("#entry")

Array.from(saveBtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const entry = this.parentNode.parentNode.childNodes[7].value
    console.log(entry)
    console.log(this.dataset.id)
    fetch('/updateJournal', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entry,
        id: this.dataset.id
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        
        // window.location.reload(true)
        const entry = this.parentNode.parentNode.childNodes[5]
        entry.innerText = data.value.entry
        const cloud = this.parentNode
        const pencil = this.parentNode.parentNode.childNodes[9]
        const editInput = this.parentNode.parentNode.childNodes[7]
        pencil.classList.remove('hide')
        entry.classList.remove('hide')
        cloud.classList.add('hide')
        editInput.classList.add('hide')
      })
  });
});

Array.from(editBtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const entry = this.parentNode.parentNode.childNodes[5]
    const pencil = this.parentNode
    const cloud = this.parentNode.parentNode.childNodes[11]
    const editInput = this.parentNode.parentNode.childNodes[7]
    pencil.classList.add('hide')
    entry.classList.add('hide')
    cloud.classList.remove('hide')
    editInput.classList.remove('hide')
    console.log(this.dataset)
  });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const date = this.parentNode.parentNode.childNodes[1].innerText
        const prompt = this.parentNode.parentNode.childNodes[3].innerText
        const entry = this.parentNode.parentNode.childNodes[5].innerText
        fetch('/emotionsJournal', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entry: entry,
            prompt: prompt,
            date: date
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
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
  
  // Function to analyze emotions in text
  function analyzeEmotions(text) {
    // Preprocess the text (remove punctuation, convert to lowercase, etc.)
    // Convert text to lowercase
    // Remove punctuation from text
    text = text.toLowerCase().replace(/[^\w\s]/g, '')
  
    // Initialize emotion scores
    //Create an object to hold the emotion scores, initializing each score to 0
    const emotionScores = {
      sad: 0,
      happy: 0,
      excited: 0,
      angry: 0,
      fear: 0,
      bored: 0
    }
  
    // Iterate over the emotion keywords and calculate scores
    // Loop through each emotion in emotionKeywords
    Object.keys(emotionKeywords).forEach(emotion => {
        // Loop through each keyword associated with the current emotion
      emotionKeywords[emotion].forEach(keyword => {
        // Use a regular expression to match the keyword in the text
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        // Count the number of matches for the keyword in the text
        const matches = text.match(regex);
        // Add the count to the score of the current emotion
        if (matches) {
          emotionScores[emotion] += matches.length;
        }
      })
    })
  
    // Calculate total score
    // Sum up all the scores from the emotion scores object
    const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score)
  
    // Calculate emotion percentages
    // Create an object to hold the emotion percentages
    const emotionPercentages = {}
    // Loop through each emotion in emotionScores
    Object.keys(emotionScores).forEach(emotion => {
      const score = emotionScores[emotion]
      // Calculate the percentage by dividing the score of the emotion by the total score and multiplying by 100
      const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0
      // Round the percentage to 2 decimal places
      // Add the percentage to the emotion percentages object
      emotionPercentages[emotion] = percentage.toFixed(2)
    })
    // Return the emotion percentages object
    return emotionPercentages;
  }
  
// Function to handle form submission
function handleSubmit(event) {
    //Prevent the default form submission behavior
    event.preventDefault()
    // Get the entered text from the input field
    const text = document.getElementById('entry').value
    // Call the analyzeEmotions function with the entered text to get the emotion percentages
    const emotionResult = analyzeEmotions(text)
    
    // Display the emotion percentages
    // Get the result container element
    const resultContainer = document.getElementById('result-container')
    // Clear any existing content in the result container
    resultContainer.innerHTML = ''

    // Loop through each emotion in the emotion percentages object
    Object.keys(emotionResult).forEach(emotion => {
      const percentage = emotionResult[emotion]
      // Create a new paragraph element
      const p = document.createElement('p')
      // Set the inner text of the paragraph to display the emotion and percentage
      p.innerText = `${emotion}: ${percentage}%`
      // Append the paragraph to the result container
      resultContainer.appendChild(p)
    })
  }

