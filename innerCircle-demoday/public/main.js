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

// Function to analyze emotions in text
function analyzeEmotions(text) {
  // Preprocess the text (remove punctuation, convert to lowercase, etc.)
  // Convert text to lowercase
  // Remove punctuation from text
  text = text.toLowerCase().replace(/[^\w\s]/g, '');

  // Initialize emotion scores
  // Create an object to hold the emotion scores, initializing each score to 0
  const emotionScores = {
    sad: 0,
    happy: 0,
    excited: 0,
    angry: 0,
    fear: 0,
    bored: 0
  };

  // Fetch the emotionKeywords object from the server
  fetch('/api/allData') // Assuming the server is running on the same host
    .then(response => response.json())
    .then(emotionKeywords => {
      console.log(emotionKeywords)
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
        });
      });

      // Calculate total score
      // Sum up all the scores from the emotion scores object
      const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score);

      // Calculate emotion percentages
      // Create an object to hold the emotion percentages
      const emotionPercentages = {};
      // Loop through each emotion in emotionScores
      Object.keys(emotionScores).forEach(emotion => {
        const score = emotionScores[emotion];
        // Calculate the percentage by dividing the score of the emotion by the total score and multiplying by 100
        const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;
        // Round the percentage to 2 decimal places
        // Add the percentage to the emotion percentages object
        emotionPercentages[emotion] = percentage.toFixed(2);
      });
      // Handle the emotion percentages object
      console.log(emotionPercentages); 
    })
    .catch(error => {
      // Handle any errors that occur during the fetch request
      console.error('Error:', error);
    });
}
console.log(analyzeEmotions)

function presentData () {
  const text = document.querySelector('.entry').value
  const emotionResult = analyzeEmotions(text)

  const result = document.querySelector('.emotions') 
  result.innerHTML = ''

  Object.keys(emotionResult).forEach(emotion => {
    const percentage = emotionResult[emotion]

    const p = document.createElement('p')
    p.innerText = `${emotion}: ${percentage}%`

    result.appendChild(p)
  })
}

// // Function to make a fetch request and analyze emotions
// function fetchEmotionAnalysis() {
//   const url = '/emotionsJournal'; // Replace with the actual URL of your server-side endpoint

//   // Get the text input value
//   const text = document.getElementById('entry').value;

//   // Make a POST request to your server-side endpoint
//   fetch(url, {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ text: text })
//   })
//     .then(response => response.json())
//     .then(data => {
//       // Handle the response data
//       console.log(data); // You can do further processing or display the data on the client side
//     })
//     .catch(error => {
//       // Handle any errors that occur during the fetch request
//       console.error('Error:', error);
//     })
// }

// // Attach event listener to the form submission
// document.getElementById('formInput').addEventListener('submit', function(event) {
//   event.preventDefault(); // Prevent the form from submitting normally
//   fetchEmotionAnalysis(); // Call the fetchEmotionAnalysis function to perform emotion analysis
// })






