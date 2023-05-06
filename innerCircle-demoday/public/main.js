var edit = document.querySelectorAll("fa-pencil");
var trash = document.getElementsByClassName("fa-trash");

edit.forEach(button => {
  button.addEventListener('click', () =>{
   // Get the journal entry element and text
   const entryElement = button.parentElement.querySelector('span:nth-of-type(2)');
   const entryText = entryElement.textContent.trim();
   // Replace the entry text with a textarea element
   entryElement.innerHTML = `<textarea>${entryText}</textarea>`;

   // Replace the edit button with a save button
   button.classList.remove('fa-pencil');
   button.classList.add('fa-save');
   button.addEventListener('click', saveHandler);
  })
})

// Save button click handler
function saveHandler(event) {
  // Get the journal entry element and textarea
  const entryElement = event.target.parentElement.querySelector('span:nth-of-type(2)');
  const textarea = entryElement.querySelector('textarea');

  // Get the new entry text
  const newEntryText = textarea.value.trim();

  // Make a PUT request to update the entry on the server
  fetch('/emotionsJournal', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: entryElement.dataset.id,
      entry: newEntryText
    })
  })
  .then(response => {
    if (response.ok) {
      // Update the entry text and replace the save button with the edit button
      entryElement.innerHTML = newEntryText;
      event.target.classList.remove('fa-save');
      event.target.classList.add('fa-pencil');
      event.target.removeEventListener('click', saveHandler);
    } else {
      throw new Error('Failed to update journal entry');
    }
  })
  .catch(error => {
    console.error(error);
  });
}


// Array.from(thumbUp).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const date = this.parentNode.parentNode.childNodes[1].innerText
        const entry = this.parentNode.parentNode.childNodes[3].innerText
        fetch('/emotionsJournal', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            entry: entry,
            date: date
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
