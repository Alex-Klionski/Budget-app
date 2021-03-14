// TIME
function showTime(){
    var today = new Date()
    var h = today.getHours()
    var m = today.getMinutes()
    var s = today.getSeconds()
    var session = "AM"

    if (h === 0){
        h = 12;
    }
    if (h > 12) {
        h -= 12;
        session = "PM";
    }
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = h + ":" + m + ":" + s + session;
    dateTime = `${date} ${time}`
    document.getElementById('clockDisplay').innerHTML = dateTime;
    document.getElementById('clockDisplay').textContent = dateTime;
    setTimeout(showTime, 1000)
    return dateTime
}
var time = showTime()


// GOOGLE STATISTICS

google.load("visualization", "1", {packages:["corechart"]});

function drawChart(data) {
    var options = {
        title: 'Бюджет',
        is3D: true,
        pieResidueSliceLabel: 'Остальное'
    };
    var chart = new google.visualization.PieChart(document.getElementById('air'));
        chart.draw(data, options);
}

function drawChart2(data) {
    var options = {
        title: 'Траты/Доход',
        hAxis: {title: 'День недели'},
        vAxis: {title: 'Бел. рубли'}
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('oil'));
        chart.draw(data, options);
}


// BUDGET CONTROLLLER
var budgetController = (function () {

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }, 
        budget: 0,
        percentage: -1
    };
            
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {   
            this.percentage = -1;   
        }
    };
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;        
    };
    
    var Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(currentElement){
            sum += currentElement.value;
        });
        data.totals[type] = sum;
    };
    var arrs =[['День недели', 'Траты', 'Доход']];
    return {
        addItem: function (type, desc, val) {
            var newItem, ID;
            // ID = last ID + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === "exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;

        },
        
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            
            if (data.totals.inc > 0){ 
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(currentVar){
                currentVar.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function() {
          
            var allPercentages = data.allItems.exp.map(function(currentEl){
                return currentEl.getPercentage();
            });
            
            return allPercentages;
            
        },
        
        getBudget: function(){ 
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
            
        },
        
        testing: function () {
            console.log(data);
        },

    
        getExpArrays: function() {
            var arrs = [["", ""]];
            data.allItems['exp'].forEach(item => {
                console.log(item.value);
                arrs.push([item.description, item.value])
            })
            return arrs;
        },

        getTotalArrays: function(){
            arrs.push([showTime(), data.totals.exp, data.totals.inc])
            return arrs
        }
    }
})();

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        inputButton: '.add-btn',
        incomeContainer: '.income-list',
        expenseContainer: '.expenses-list',
        budgetLabel: '.budget-value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item-percentage',
    }; 
      
    var formatNumber = function(num, type) {
        var numSplit, int, dec;
 
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 

    };
    
    var nodeListForEach = function(list, callbackFn) {    
        for (var i = 0; i < list.length; i++) {
            callbackFn(list[i], i);            
        }                      
    };

    return {
        getInput: function () {
            return { 
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            };

        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } 
            else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'         
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);        
        },
                
        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(currentValue, index, array){
                currentValue.value = "";
            });
            fieldsArray[0].focus();
        },
        
        displayBudget: function(obj) {
            var type;
            if (obj.budget > 0) {
                type = 'inc';
            } else {
                type = 'exp';
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentagesArr) {
            var fields = document.querySelectorAll(DOMstrings.expPercentageLabel); 
            
            nodeListForEach(fields, function(current, index){ 
                if (percentagesArr[index] > 0) {
                    current.textContent = percentagesArr[index] + '%';
                } 
                else {          
                    current.textContent = '---';
                }     
            });       
        },
               
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);
            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

// GLOBAL APP CONTROLLER 
var controller = (function (budgetCntrl, UICntrl) {

    var setUpEventListeners = function () {
        var DOM = UICntrl.getDOMstrings();       
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);    
        // Change color type    
        document.querySelector(DOM.inputType).addEventListener('change', UICntrl.changedType);
    };
    
     var updateBudget = function(){
        budgetCntrl.calculateBudget();
        var budget = budgetCntrl.getBudget();
        UICntrl.displayBudget(budget);        
    };

    var updateExpPercentages = function() {
        budgetCntrl.calculatePercentages();
        var percentages = budgetCntrl.getPercentages();
        UICntrl.displayPercentages(percentages);     
    };

    var controlAddItem = function () {
        var input, newItem;

        input = UICntrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            UICntrl.addListItem(newItem, input.type);
            UICntrl.clearFields();
            updateBudget();
            updateExpPercentages();
        }
        var data = google.visualization.arrayToDataTable(budgetController.getExpArrays());
        var data2 = google.visualization.arrayToDataTable(budgetController.getTotalArrays());
        google.setOnLoadCallback(drawChart(data));
        google.setOnLoadCallback(drawChart2(data2));
    };

    return {
        init: function () {
            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();