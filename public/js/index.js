document.querySelectorAll('.save').forEach(function(btn, i) {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    btn.setAttribute("disabled", true);
    var id = btn.getAttribute("data-id");
    save(id);
    btn.innerText = "Saved"
  })
})


document.querySelector('.scrape').addEventListener('click', function(e) {
  e.preventDefault();
  this.setAttribute('disabled', true);
  scrape();
});

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
      console.log(this.responseText);
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