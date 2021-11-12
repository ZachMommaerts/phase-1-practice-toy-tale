let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const submitToyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.querySelector('#toy-collection');
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => toys.forEach(renderToy))
  .catch(error => errorMessage(error));

  function errorMessage(error) {
    alert(error);
  };

  function renderToy (toy) {
      const toyContainer = document.createElement('div');
      toyContainer.className = 'card';
      toyContainer.innerHTML = 
      `<h2>${toy.name}</h2>
      <img src = ${toy.image} class = toy-avatar></img>
      <p class=amountOfLikes>${toy.likes} likes</p>
      <button class =like-btn id = ${toy.id}>Like</button>`
      toyCollection.appendChild(toyContainer);
  }

  submitToyForm.addEventListener('submit', e => createNewToy(e));

  function createNewToy (e) {
    e.preventDefault();

    const toyName = document.querySelector('#nameId').value;
    const toyURL = document.querySelector('#imageURLId').value;
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        'name': `${toyName}`,
        'image': `${toyURL}`,
        'likes': 0
      })
    })
    .then(resp => resp.json())
    .then(toy => renderToy(toy))
    .catch(error => errorMessage(error));

    submitToyForm.reset();
  }

  toyCollection.addEventListener('click', e => addLike(e))


  function addLike (e) {
    if(e.target && e.target.className === 'like-btn') {
      const totalLikesSent = parseInt(e.target.previousElementSibling.textContent.split(' ')[0], 10) + 1;
      fetch(`http://localhost:3000/toys/${e.target.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify ({
          'likes': totalLikesSent
        })
      })
      .then(resp => resp.json())
      .then(toy => e.target.previousElementSibling.textContent = `${toy.likes} likes`)
      .catch(error => errorMessage(error))
    }
  }

});

// }
// {
//   "id": 4,
//   "name": "Slinky Dog",
//   "image": "https://www.freeiconspng.com/uploads/slinky-png-transparent-1.png",
//   "likes": 4
// },