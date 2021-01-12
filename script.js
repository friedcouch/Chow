window.userToken = null
localStorage.recipes = ''

const signUpForm = $('#form-sign-up')
const signInForm = $('#form-sign-in')
const formBg = $('#form-bg')
const recipes = $('#recipes')
const recipeEditor = $('#edit-recipe')

$('#btn-sign-up').click(() => openPopup(signUpForm))
$('#btn-sign-in').click(() => openPopup(signInForm))
$('#btn-sign-out').click(() => {
  localStorage.clear()
  window.location.reload()
})

formBg.click(event => {
  for (element of $('.popup'))
    closePopup($(element))
  if ($(recipeEditor).data('isOpen') === 'true') {
    $('#ingredients ul li').remove()
    $('#instructions ul li').remove()
    $(recipeEditor).data('isOpen', 'false')
  }
  $('[name="email"], [name="username"], [name="password"]').val('')
  $('.error').text('')
  closePopup(formBg)
})

signUpForm.submit(event => {
  event.preventDefault()
  const username = event.target[0].value
  const email = event.target[1].value
  const password = event.target[2].value
  signUp(email, password, username)
    .then(res => {
      console.log(res)
      if (res.error) throw res.error
      localStorage.user = JSON.stringify(res)
      window.location.reload()
    })
    .catch(err => $('#form-sign-up .error').text(err))
})

signInForm.submit(async (event) => {
  event.preventDefault()
  const email = event.target[0].value
  const password = event.target[1].value
  signIn(email, password)
    .then(res => {
      console.log(res)
      if (res.error) throw res.error
      localStorage.user = JSON.stringify(res)
      window.location.reload()
      return getCreatedRecipe(res.user.id)
    })
    .then(recipeArr => {
      const recipeObjs = Object.fromEntries(recipeArr.map(r => [r.id, r]))
      displayRecipes(recipeObjs)
      localStorage.recipes = JSON.stringify(recipeObjs)
    })
    .catch(err => $('#form-sign-in .error').text(err))
})

// Adds new input fields
$('#ingredients').on('click', '.add', event => addInput('ingredient', ''))
$('#instructions').on('click', '.add', event => addInput('instruction', ''))

// Deletes list item
$('#ingredients').on('click', '.delete', event => $(event.target).closest('li').remove())
$('#instructions').on('click', '.delete', event => $(event.target).closest('li').remove())

recipes.on('click', '.delete', event => {
  recipes.attr('data-delete-target', $(event.target).closest('li').attr('id'))
  openPopup($('#delete-recipe'))
})

$('#delete-recipe .cancel').click(() => {
  closePopup($('#delete-recipe'))
  closePopup(formBg)
})

$('#delete-recipe .continue').click(() => {
  recipeId = +$(recipes).attr('data-delete-target')
  deleteRecipe(recipeId)
    .then(res => {
      $(`li#${recipeId}`).remove()
      $(recipes).removeAttr('data-delete-target')
      closePopup($('#delete-recipe'))
      closePopup(formBg)
    })
})

recipes.on('click', '.edit', event => {
  const recipeId = $(event.target).closest('li').attr('id')
  const recipe = JSON.parse(localStorage.recipes)[recipeId]

  openPopup(recipeEditor)
  $(recipeEditor).data('isOpen', 'true')
  $(recipeEditor).data('isNew', 'false')
  $(recipeEditor).data('recipeId', recipeId)

  $('#recipe-name').val(recipe.name)
  // for some reason, when I've just edited/added a recipe and submit,
  // the next time I click on 'edit'/'new recipe', the input fields are duplicated
  // if 'justOpened' is false, it will not run the for loops, preventing duplicates
  console.log($(recipeEditor).data('justOpened') === false)
  if ($(recipeEditor).data('justOpened') === false) {
    if (recipe.ingredients.length) {
      for (const ingredient of recipe.ingredients) addInput('ingredient', ingredient)
    }    
    else {
      addInput('ingredient', '')
    }    
    if (recipe.ingredients.length) {
      for (const instruction of recipe.instructions) addInput('instruction', instruction)
    } else {
      addInput('isntruction', '')
    }
  }
  $(recipeEditor).data('justOpened', false)
})

$('#add-recipe').click(event => {
  $(recipeEditor).data('isOpen', 'true')
  $(recipeEditor).data('isNew', 'true')
  openPopup(recipeEditor)

  addInput('ingredient', '')
  addInput('instruction', '')
  $('#recipe-name').val('')
})

recipeEditor.submit(event => {
  event.preventDefault()

  $(recipeEditor).data('justOpened', true)

  const name = $('#recipe-name').val()
  const ingredients = $.map($('#ingredients ul li input'), element => element.value)
  const instructions = $.map($('#instructions ul li textarea'), element => element.value)
  
  if ($(recipeEditor).data('isNew') === 'true') {
    const userId = JSON.parse(localStorage.user).id
    createRecipe(userId, name, ingredients, instructions)
    .then(recipe => {
      updateRecipeInfo(recipe)
      displayRecipe(recipe)
      closePopup(recipeEditor)
      closePopup(formBg)
    })
  } else {
    const recipeId = $(recipeEditor).data('recipeId')
    console.log(recipeId)
    updateRecipe(recipeId, name, ingredients, instructions)
      .then(recipe => {
        console.log(recipe)
        $(`#${recipeId} a`).text(recipe.name)
        updateRecipeInfo(recipe)
        closePopup(recipeEditor)
        closePopup(formBg)
      })
  }
  $(recipeEditor).data('isOpen', 'false')
})

recipes.on('click', '.nutrition', event => {
  const recipeId = $(event.target).closest('li').attr('id')
  openPopup($('#nutrition-facts'))
  searchIngredients(JSON.parse(localStorage.recipes)[recipeId].ingredients, false)
    .then(ingredientsArr => displayNutrition(ingredientsArr))
})

const showBtn = (btn) => btn.css('display', 'initial')
const hideBtn = (btn) => btn.css('display', 'none')
const openPopup = (element) => {
  element.css('display', 'flex')
  formBg.css('display', 'flex')
}

const closePopup = (element) => element.css('display', 'none')

const addInput = (inputName, inputVal) => {
  if (inputName === 'ingredient')
    $(`#${inputName}s ul`).append(`
    <li>
      <input type="text" placeholder="${inputName}" value="${inputVal}">
      <button type="button" class="delete">delete</button>
    </li>
    `)
  else
    $(`#${inputName}s ul`).append(`
    <li>
      <textarea cols="28" rows="3" placeholder="${inputName}">${inputVal}</textarea>
      <button type="button" class="delete">delete</button>
    </li>
    `)
}

const displayRecipes = (recipeObjs) => {
  for (const [_, recipe] of Object.entries(recipeObjs))
    displayRecipe(recipe)
}

const displayRecipe = (recipe) =>
  recipes.append(`
    <li id="${recipe.id}">
      <span>${recipe.name}</span>
      <button type="button" class="edit">edit</button>
      <button type="button" class="delete">delete</button>
      <button type="button" class="nutrition">nutrition</button>
    </li>
  `)

const updateRecipeInfo = (recipe) => {
  let recipeObjs = JSON.parse(localStorage.recipes)
  recipeObjs[recipe.id] = recipe
  localStorage.recipes = JSON.stringify(recipeObjs)
}

closePopup($('#nutrition-facts'))

const searchIngredients = (ingredientsArr, isForDisplay) => {
  const ingredients = ingredientsArr.join(' ')
  return request('searchIngredients', { ingredients })
    .then(res => res.items)
}

const displayNutrition = async (ingredientsArr) => {
  $('#nutrition-facts div#ingredient-container').text('')
  for (i of ingredientsArr)
    $('#nutrition-facts div#ingredient-container').append(`
      <div class="column">
        <span class="header">${i.name}</span>
        <span class="serving-size">${+i.serving_size_g.toFixed(2)}</span>
        <span class="calories">${+i.calories.toFixed(2)}</span>
        <span class="protein">${+i.protein_g.toFixed(2)}</span>
        <span class="fat-total">${+i.fat_total_g.toFixed(2)}</span>
        <span class="fat-saturated">${+i.fat_saturated_g.toFixed(2)}</span>
        <span class="cholesterol">${+i.cholesterol_mg.toFixed(2)}</span>
        <span class="carbs-total">${+i.carbohydrates_total_g.toFixed(2)}</span>
        <span class="fiber">${+i.fiber_g.toFixed(2)}</span>
        <span class="sugar">${+i.sugar_g.toFixed(2)}</span>
        <span class="sodium">${+i.sodium_mg.toFixed(2)}</span>
        <span class="potassium">${+i.potassium_mg.toFixed(2)}</span>
      </div>
    `)
}

// Logs in the user and returns the user
// The select is needed because signIn() returns data 
// from auth.users, but we need data from public.users
const signIn = async (email, password) =>
  request('signIn', { email, password })

const signUp = async (email, password, username) =>
  request('signUp', { email, password, username })

const createRecipe = async (creatorId, name, ingredients, instructions) =>
  request('createRecipe', { creatorId, name, ingredients, instructions })

const getCreatedRecipe = async (creatorId) =>
  request('getCreatedRecipe', { creatorId })

const deleteRecipe = async (recipeId) =>
  request('deleteRecipe', { recipeId })

const updateRecipe = async (recipeId, name, ingredients, instructions) => {
  let row = {}
  // Adds keys to newRow if the values are truthy i.e. they have some form of value
  name && (row.name = name)
  ingredients && (row.ingredients = ingredients)
  instructions && (row.instructions = instructions)

  return request('updateRecipe', { recipeId, row })
}

const request = (path, data) => {
  return fetch(`/.netlify/functions/${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
}

if (localStorage.user !== '') {
  getCreatedRecipe(JSON.parse(localStorage.user).id)
    .then(recipeArr => {
      const recipeObjs = Object.fromEntries(recipeArr.map(r => [r.id, r]))
      displayRecipes(recipeObjs)
      localStorage.recipes = JSON.stringify(recipeObjs)
      hideBtn($('#btn-sign-in'))
      hideBtn($('#btn-sign-up'))
      showBtn($('#btn-sign-out'))
      showBtn($('#add-recipe'))
    })
} else {
  localStorage.clear()
}