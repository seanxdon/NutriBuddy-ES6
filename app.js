//-------ss---------------------------------------------------------------
// --------------- Food Class: constructor for food items --------------
//----------------------------------------------------------------------

class Food {
    constructor(item, calories, protein, carb, fat) {
      this.item = item;
      this.calories = calories;
      this.protein = protein;
      this.carb = carb;
      this.fat = fat;
    }
}

//---------------------------------------------------------
// --------------- UI Class: handle UI Tasks --------------
//---------------------------------------------------------

class UI {
    static displayFood() {
        const foods = Store.getFoods();
        foods.forEach((food) => UI.addFoodToList(food));    
        // foods.forEach((food) => UI.addFoodTotals(food));  
    }

    static addFoodToList(food) {
        const list = document.querySelector('#food-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${food.item}</td>
        <td>${food.calories}</td>
        <td>${food.protein}</td>
        <td>${food.carb}</td>
        <td>${food.fat}</td>
        <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

        list.appendChild(row);
    }
    static addFoodTotals(food) {
      const list = document.querySelector('#total-list');
      const row = document.createElement('tr');

      row.innerHTML = `
      <td>${food.totalCalories}</td>
      <td>${food.totalProtein}</td>
      <td>${food.totalCarb}</td>
      <td>${food.totalFat}</td>
      <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
      `;

      list.appendChild(row);
  }

    static deleteFood(el) {
        //if class list contains delete,
        //select the parent, then the parent of that parent and remove it
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#item').value = '';
        document.querySelector('#calories').value = '';
        document.querySelector('#protein').value = '';
        document.querySelector('#carb').value = '';
        document.querySelector('#fat').value = '';
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#food-form');
        container.insertBefore(div, form);
        //alert disappears in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
}

//------------------------------------------------------------------------------
// --------------- Local Storage : Store items locally in browser --------------
//------------------------------------------------------------------------------

class Store {
    static getFoods() {
      let foods;
      if(localStorage.getItem('foods') === null) {
        foods = [];
      } else {
        foods = JSON.parse(localStorage.getItem('foods'));
      }
  
      return foods;
    }
  
    static addFood(food) {
      const foods = Store.getFoods();
      foods.push(food);
      localStorage.setItem('foods', JSON.stringify(foods));
    }
  
    static removeFood(fat) {
      const foods = Store.getFoods();
  
      foods.forEach((food, index) => {
        if(food.fat === fat) {
          foods.splice(index, 1);
        }
      });
  
      localStorage.setItem('foods', JSON.stringify(foods));
    }
  }

//----------------------------------------------------
// --------------- Event: Display Items --------------
//----------------------------------------------------

document.addEventListener('DOMContentLoaded', UI.displayFood);

//----------------------------------------------------
// --------------- Event: Add Item -------------------
//----------------------------------------------------

document.querySelector('#food-form').addEventListener('submit', (e) => {
    
    //prevent actual submit 
    e.preventDefault();

    //Get form values
    const item = document.querySelector('#item').value;
    const calories = document.querySelector('#calories').value;
    const protein = document.querySelector('#protein').value;
    const carb = document.querySelector('#carb').value;
    const fat = document.querySelector('#fat').value;

    //Validate form fields 
    if (item ==='' || calories === '' || protein ==='' || carb ==='' || fat ==='') {
        UI.showAlert('Please fill in the required fields', 'danger')
    } else {
        //Set food values to constructor
        const food = new Food(item, calories, protein, carb, fat);
        
        //Add food to UI
        UI.addFoodToList(food);

        //Add food to local storage 
        Store.addFood(food);

        //Show Success alert 
        UI.showAlert('Item Added', 'success');

        //Clear input fields after something is submitted
        UI.clearFields();
        console.log(food);
    }

});
  
//-------------------------------------------------------
// --------------- Event: Remove Food -------------------
//-------------------------------------------------------

document.querySelector('#food-list').addEventListener('click', (e) => {
    //Remove food from UI
    UI.deleteFood(e.target);

    // Remove food from storage 
    Store.removeFood(e.target.parentElement.previousElementSibling.textContent);

    //Show remove  alert 
    UI.showAlert('Item Removed', 'warning');
});

