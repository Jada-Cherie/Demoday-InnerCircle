var editBtn = document.querySelectorAll(".fa-pencil");
var saveBtn = document.querySelectorAll(".ph-upload-simple")
var trash = document.getElementsByClassName("fa-trash");
var editInput = document.querySelectorAll(".editEntry")
var inputEntry = document.querySelector("#entry")

Array.from(saveBtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const entry = this.parentNode.parentNode.childNodes[5].value
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
        const entry = this.parentNode.parentNode.childNodes[3]
        // entry.innerText = data.value.entry
        const cloud = this.parentNode
        const pencil = this.parentNode.parentNode.childNodes[7]
        const editInput = this.parentNode.parentNode.childNodes[5]
        pencil.classList.remove('hide')
        entry.classList.remove('hide')
        cloud.classList.add('hide')
        editInput.classList.add('hide')
      })
  });
});

Array.from(editBtn).forEach(function (element) {
  element.addEventListener('click', function () {
    const entry = this.parentNode.parentNode.childNodes[3]
    const pencil = this.parentNode
    const cloud = this.parentNode.parentNode.childNodes[9]
    const editInput = this.parentNode.parentNode.childNodes[5]
    pencil.classList.add('hide')
    entry.classList.add('hide')
    cloud.classList.remove('hide')
    editInput.classList.remove('hide')
    console.log(this.dataset)
  });
});


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
