function save(id) {
  fetch('/saved', {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"id": id})
    }).then((res) => {
      console.log("this is res", res)
    }).catch((err) => {
      console.log(err)
    })
}

function unsave(id) {
  fetch('/unsave', {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"id": id})
  }).then((res) => {
    console.log("this is res", res)
  }).catch((err) => {
    console.log(err)
  })
}

function getNotes(id) {
  //create XHR object
  var xhr = new XMLHttpRequest();
  var listBtn = document.querySelector('.notes-list');
  listBtn.innerHTML = "";

  xhr.onload = function() {
    // document.querySelector('.loading').style.display = "none"
    if (this.status === 200) {
      var res = JSON.parse(this.responseText);
      console.log(res);
      for (var i = 0; i < res.note.length; i++) {
        listBtn.innerHTML += `<li class='py-3'>${res.note[i]}<button class='btn btn-danger remove-note float-right mr-2' data-id='${res.id}'>x</button></li>`
      }
      document.querySelectorAll('.remove-note').forEach(function(btn, i) {
        btn.addEventListener("click", function(e) {
          e.preventDefault();
          var id = btn.getAttribute("data-id");
          var note = btn.parentElement.innerText;
          note = note.substr(0, note.length - 1);
          var sentObj = {id: id, note: note}
          btn.parentElement.remove();
          deleteNote(sentObj);
        });
      });
    }
    else {
      console.log("error!");
    }
  }

  xhr.open('GET', '/notes/' + id, true)

  xhr.send();
}

// function saveNote(userInput, id) {
//   var xhr = new XMLHttpRequest();

//   xhr.onload = function() {
//     if(this.status === 200) {
//       var res = JSON.parse(this.responseText);
//       console.log(res);
//     }
//   }

//   xhr.onerror = function() {
//     console.log("request error");
//   }

//   xhr.open("PUT", "/notes/add", true);

//   xhr.send({"note": userInput, "id": id});
// }
function saveNote(userInput, id) {
  fetch('/notes/add', {
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"note": userInput, "id": id})
  }).then((res) => {

    res.json()
    .then(body => {
      var listBtn = document.querySelector('.notes-list');
      listBtn.innerHTML += `<li class='py-3'>${body.note}<button class='btn btn-danger remove-note float-right mr-2' data-id='${body.id}'>x</button></li>` 
      document.querySelector('.remove-note').addEventListener('click', function(e) {
        e.preventDefault();
        var id = this.getAttribute("data-id");
        var note = this.parentElement.innerText;
        note = note.substr(0, note.length - 1);
        var sentObj = {id: id, note: note}
        this.parentElement.remove();
        deleteNote(sentObj);
      })     
    })
  }).catch((err) => {
    console.log(err)
  })
}

function deleteNote(sentObj) {
  fetch('/notes/delete', {
    method: "DELETE",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sentObj)
  }).then((res) => {
    console.log("this is res", res)
  }).catch((err) => {
    console.log(err)
  }) 
}
 
function scrape() {
  //create XHR object
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 1) {
      document.querySelector(".loading").style.display = "inline";
    }
    
    else if (xhr.readyState === 4) {
      document.querySelector(".loading").style.display = "none";
    }
  }

  xhr.onload = function() {
    // document.querySelector('.loading').style.display = "none"
    if (this.status === 200) {
      if (Number(this.responseText) === 0) {
        alert("No new articles found")
        window.location.reload();
      }
      else {
        alert(`${this.responseText} new article${this.responseText > 0 ? 's' : ''} found`);
        window.location.reload();        
      }

    }
    else {
      console.log("error!");
    }
  }

  xhr.open('POST', '/scrape', true)

  xhr.send();
}

if (document.querySelector('.save-note')) {
  document.querySelector('.save-note').addEventListener('click', function(e) {
    e.preventDefault();
    var userInput = document.querySelector('textarea').value.trim();
    document.querySelector('textarea').value = "";
    var id = document.querySelector('.save-note').getAttribute('data-id')
    if (userInput !== "") {
      saveNote(userInput, id);
    }
  });  
}


document.querySelectorAll('.save').forEach(function(btn, i) {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    btn.setAttribute("disabled", true);
    var id = btn.getAttribute("data-id");
    save(id);
    btn.innerText = "Saved"
  });
});

document.querySelectorAll('.destroy').forEach(function(btn, i) {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    btn.setAttribute("disabled", true);
    var id = btn.getAttribute("data-id");
    unsave(id);
    btn.innerText = "Deleted"
  })
});

document.querySelectorAll('.notes').forEach(function(btn, i) {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    var id = btn.getAttribute("data-id");
    var modalTitle = document.querySelector('.modal-title')
    var addNoteBtn = document.querySelector('.save-note');
    addNoteBtn.setAttribute("data-id", id)
    modalTitle.innerText = "Notes for Article: " + id
    getNotes(id);
  })
})

document.querySelector('.scrape').addEventListener('click', function(e) {
  e.preventDefault();
  this.setAttribute('disabled', true);
  scrape();
});