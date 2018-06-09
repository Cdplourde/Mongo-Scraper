document.querySelector('button').addEventListener('click', function(e) {
  e.preventDefault();
  loadData();
});
 
function loadData() {
  //create XHR object
  var xhr = new XMLHttpRequest();

  xhr.open('POST', '/scrape', true)

  xhr.onload = function() {
    if (this.status === 200) {
      console.log(this.responseText);
    }
    else {
      console.log("error!");
    }
  }

  xhr.send();
}