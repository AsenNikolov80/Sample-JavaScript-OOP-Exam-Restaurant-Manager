function processRestaurantManagerCommands(commands) {
    'use strict';

    var RestaurantEngine = (function () {
        var _restaurants, _recipes;

        function initialize() {
            _restaurants = [];
            _recipes = [];
        }

        var Restaurant = (function () {
            function Restaurant(name, location) {
                this.setName(name);
                this.setLocation(location);
                this._recipes = [];
            }

            Restaurant.prototype.getName = function () {
                return this._name;
            };
            Restaurant.prototype.setName = function (name) {
                if (name === '' || name === null) {
                    throw new Error("The " + name + " is required.");
                }
                this._name = name;
            };

            Restaurant.prototype.getLocation = function () {
                return this._location;
            };
            Restaurant.prototype.setLocation = function (location) {
                if (location === '' || location === null) {
                    throw new Error("The " + location + " is required.");
                }
                this._location = location;
            };

            Restaurant.prototype.addRecipe = function (recipe) {
                this._recipes.push(recipe);
            };
            Restaurant.prototype.removeRecipe = function (recipe) {
                var index = this._recipes.indexOf(recipe);
                this._recipes.splice(index, 1);
            };

            Restaurant.prototype.printRestaurantMenu = function () {
                var result = "***** " + this._name + " - " + this._location + " *****\n";
                if (this._recipes.length === 0) {
                    result += "No recipes... yet\n";
                    return result;
                }

                var drinks = this._recipes.filter(function (recipe) {
                    return recipe instanceof Drink;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                var mainCourses = this._recipes.filter(function (recipe) {
                    return recipe instanceof MainCourse;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                var salads = this._recipes.filter(function (recipe) {
                    return recipe instanceof Salad;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });
                var desserts = this._recipes.filter(function (recipe) {
                    return recipe instanceof Dessert;
                }).sort(function (a, b) {
                    return a.getName().localeCompare(b.getName());
                });

                if (drinks.length > 0) {
                    result += "~~~~~ DRINKS ~~~~~\n";
                    for (var i = 0; i < drinks.length; i++) {
                        result += drinks[i].toString();
                    }
                }
                if (salads.length > 0) {
                    result += "~~~~~ SALADS ~~~~~\n";
                    for (var i = 0; i < salads.length; i++) {
                        result += salads[i].toString();
                    }
                }
                if (mainCourses.length > 0) {
                    result += "~~~~~ MAIN COURSES ~~~~~\n";
                    for (var i = 0; i < mainCourses.length; i++) {
                        result += mainCourses[i].toString();
                    }
                }
                if (desserts.length > 0) {
                    result += "~~~~~ DESSERTS ~~~~~\n";
                    for (var i = 0; i < desserts.length; i++) {
                        result += desserts[i].toString();
                    }
                }
                return result;
            };

            return Restaurant;
        })();

        var Recipe = (function () {
            function Recipe(name, price, calories, quantity, prepareTime) {
                if (this.constructor === Recipe) {
                    throw new Error("can't create class Recipe!");
                }
                this.setName(name);
                this.setPrice(price);
                this.setCalories(calories);
                this.setQuantity(quantity);
                this.setPrepareTime(prepareTime);
            }

            Recipe.prototype.getName = function () {
                return this._name;
            };
            Recipe.prototype.setName = function (name) {
                if (name === '' || name === null) {
                    throw new Error("The " + name + " is required.");
                }
                this._name = name;
            };

            Recipe.prototype.getPrice = function () {
                return this._price;
            };
            Recipe.prototype.setPrice = function (price) {
                if (price <= 0) {
                    throw new Error("The " + price + " must be positive.");
                }
                this._price = price.toFixed(2);
            };

            Recipe.prototype.getCalories = function () {
                return this._calories;
            };
            Recipe.prototype.setCalories = function (calories) {
                if (calories <= 0) {
                    throw new Error("The " + calories + " must be positive.");
                }
                this._calories = calories;
            };

            Recipe.prototype.getQuantity = function () {
                return this._quantity;
            };
            Recipe.prototype.setQuantity = function (quantity) {
                if (quantity <= 0) {
                    throw new Error("The " + quantity + " must be positive.");
                }
                this._quantity = quantity;
            };

            Recipe.prototype.getPrepareTime = function () {
                return this._prepareTime;
            };
            Recipe.prototype.setPrepareTime = function (prepareTime) {
                if (prepareTime <= 0) {
                    throw new Error("The " + prepareTime + " must be positive.");
                }
                this._prepareTime = prepareTime;
            };

            Recipe.prototype.toString = function () {
                var unit;
                if (this instanceof Drink) {
                    unit = "ml";
                } else if (this instanceof Meal) {
                    unit = "g";
                }
                return "==  " + this._name + " == $" + this._price +
                        "\nPer serving: " + this._quantity + " " + unit + ", " + this._calories + " kcal\n" +
                        "Ready in " + this._prepareTime + " minutes";
            };

// ==  <name> == $<price>
// Per serving: <quantity> <unit>, <calories> kcal
// Ready in <time_to_prepare> minutes
            return Recipe;
        })();

        var Drink = (function () {
            function Drink(name, price, calories, quantity, prepareTime, isCarbonated) {
                if (calories > 100) {
                    throw new Error("too much calories!");
                }
                if (prepareTime > 20) {
                    throw new Error("too much time for prepare!");
                }

                Recipe.call(this, name, price, calories, quantity, prepareTime);
                this.setIsCarbonated(isCarbonated);

            }

            Drink.prototype = Object.create(Recipe.prototype);
            Drink.prototype.constructor = Drink;

            Drink.prototype.getIsCarbonated = function () {
                return this._isCarbonated;
            };
            Drink.prototype.setIsCarbonated = function (isCarbonated) {
                this._isCarbonated = isCarbonated;
            };

            Drink.prototype.toString = function () {
                var isCarbonated = this.getIsCarbonated() ? 'yes' : 'no';
                return Recipe.prototype.toString.call(this) + "\nCarbonated: " + isCarbonated + "\n";
            };

            return Drink;
        })();

        var Meal = (function () {
            function Meal(name, price, calories, quantity, prepareTime, isVegan) {
                if (this.constructor === Meal) {
                    throw new Error("can't create class Meal!");
                }
                Recipe.apply(this, arguments);
                this.setVegan(isVegan);
            }
            Meal.prototype = Object.create(Recipe.prototype);
            Meal.prototype.constructor = Meal;

            Meal.prototype.getVegan = function () {
                return this._isVegan;
            };
            Meal.prototype.setVegan = function (isVegan) {
                this._isVegan = isVegan;
            };

            Meal.prototype.toggleVegan = function () {
                this._isVegan = !this._isVegan;
            };

            Meal.prototype.toString = function () {
                var vegan = this.getVegan() ? "[VEGAN] " : "";
                return vegan + Recipe.prototype.toString.call(this);
            };

            return Meal;
        })();

        var Dessert = (function () {
            function Dessert(name, price, calories, quantity, prepareTime, isVegan) {
                Meal.apply(this, arguments);
                this._withSugar = true;
            }
            Dessert.prototype = Object.create(Meal.prototype);
            Dessert.prototype.constructor = Dessert;

            Dessert.prototype.toggleSugar = function () {
                this._withSugar = !this._withSugar;
            };
            Dessert.prototype.toString = function () {
                var haveSugar = this._withSugar ? "" : "[NO SUGAR] ";
                return haveSugar + Meal.prototype.toString.call(this)+"\n";
            };
            return Dessert;
        })();

        var MainCourse = (function () {
            function MainCourse(name, price, calories, quantity, prepareTime, isVegan, type) {
                Meal.call(this, name, price, calories, quantity, prepareTime, isVegan);
                this.setType(type);
            }
            MainCourse.prototype = Object.create(Meal.prototype);
            MainCourse.prototype.constructor = MainCourse;

            MainCourse.prototype.getType = function () {
                return this._type;
            };
            MainCourse.prototype.setType = function (type) {
                this._type = type;
            };
            MainCourse.prototype.toString = function () {
                return Meal.prototype.toString.call(this) + "\nType: " + this._type+"\n";
            };
            return MainCourse;
        })();

        var Salad = (function () {
            function Salad(name, price, calories, quantity, prepareTime, havePasta) {
                Meal.call(this, name, price, calories, quantity, prepareTime, true);
                this.setgetHavePasta(havePasta);
            }

            Salad.prototype = Object.create(Meal.prototype);
            Salad.prototype.constructor = Salad;

            Salad.prototype.getHavePasta = function () {
                return this._pasta;
            };
            Salad.prototype.setgetHavePasta = function (havePasta) {
                this._pasta = havePasta;
            };
            Salad.prototype.toString = function () {
                var havePasta = this._pasta ? 'yes' : 'no';
                return Meal.prototype.toString.call(this) + "\nContains pasta: " + havePasta + "\n";
            };
            return Salad;
        })();

        var Command = (function () {

            function Command(commandLine) {
                this._params = new Array();
                this.translateCommand(commandLine);
            }

            Command.prototype.translateCommand = function (commandLine) {
                var self, paramsBeginning, name, parametersKeysAndValues;
                self = this;
                paramsBeginning = commandLine.indexOf("(");

                this._name = commandLine.substring(0, paramsBeginning);
                name = commandLine.substring(0, paramsBeginning);
                parametersKeysAndValues = commandLine
                        .substring(paramsBeginning + 1, commandLine.length - 1)
                        .split(";")
                        .filter(function (e) {
                            return true
                        });

                parametersKeysAndValues.forEach(function (p) {
                    var split = p
                            .split("=")
                            .filter(function (e) {
                                return true;
                            });
                    self._params[split[0]] = split[1];
                });
            }

            return Command;
        }());

        function createRestaurant(name, location) {
            _restaurants[name] = new Restaurant(name, location);
            return "Restaurant " + name + " created\n";
        }

        function createDrink(name, price, calories, quantity, timeToPrepare, isCarbonated) {
            _recipes[name] = new Drink(name, price, calories, quantity, timeToPrepare, isCarbonated);
            return "Recipe " + name + " created\n";
        }

        function createSalad(name, price, calories, quantity, timeToPrepare, containsPasta) {
            _recipes[name] = new Salad(name, price, calories, quantity, timeToPrepare, containsPasta);
            return "Recipe " + name + " created\n";
        }

        function createMainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type) {
            _recipes[name] = new MainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type);
            return "Recipe " + name + " created\n";
        }

        function createDessert(name, price, calories, quantity, timeToPrepare, isVegan) {
            _recipes[name] = new Dessert(name, price, calories, quantity, timeToPrepare, isVegan);
            return "Recipe " + name + " created\n";
        }

        function toggleSugar(name) {
            var recipe;

            if (!_recipes.hasOwnProperty(name)) {
                throw new Error("The recipe " + name + " does not exist");
            }
            recipe = _recipes[name];

            if (recipe instanceof Dessert) {
                recipe.toggleSugar();
                return "Command ToggleSugar executed successfully. New value: " + recipe._withSugar.toString().toLowerCase() + "\n";
            } else {
                return "The command ToggleSugar is not applicable to recipe " + name + "\n";
            }
        }

        function toggleVegan(name) {
            var recipe;

            if (!_recipes.hasOwnProperty(name)) {
                throw new Error("The recipe " + name + " does not exist");
            }

            recipe = _recipes[name];
            if (recipe instanceof Meal) {
                recipe.toggleVegan();
                return "Command ToggleVegan executed successfully. New value: " +
                        recipe._isVegan.toString().toLowerCase() + "\n";
            } else {
                return "The command ToggleVegan is not applicable to recipe " + name + "\n";
            }
        }

        function printRestaurantMenu(name) {
            var restaurant;

            if (!_restaurants.hasOwnProperty(name)) {
                throw new Error("The restaurant " + name + " does not exist");
            }

            restaurant = _restaurants[name];
            return restaurant.printRestaurantMenu();
        }

        function addRecipeToRestaurant(restaurantName, recipeName) {
            var restaurant, recipe;

            if (!_restaurants.hasOwnProperty(restaurantName)) {
                throw new Error("The restaurant " + restaurantName + " does not exist");
            }
            if (!_recipes.hasOwnProperty(recipeName)) {
                throw new Error("The recipe " + recipeName + " does not exist");
            }

            restaurant = _restaurants[restaurantName];
            recipe = _recipes[recipeName];
            restaurant.addRecipe(recipe);
            return "Recipe " + recipeName + " successfully added to restaurant " + restaurantName + "\n";
        }

        function removeRecipeFromRestaurant(restaurantName, recipeName) {
            var restaurant, recipe;

            if (!_recipes.hasOwnProperty(recipeName)) {
                throw new Error("The recipe " + recipeName + " does not exist");
            }
            if (!_restaurants.hasOwnProperty(restaurantName)) {
                throw new Error("The restaurant " + restaurantName + " does not exist");
            }

            restaurant = _restaurants[restaurantName];
            recipe = _recipes[recipeName];
            restaurant.removeRecipe(recipe);
            return "Recipe " + recipeName + " successfully removed from restaurant " + restaurantName + "\n";
        }

        function executeCommand(commandLine) {
            var cmd, params, result;
            cmd = new Command(commandLine);
            params = cmd._params;

            switch (cmd._name) {
                case 'CreateRestaurant':
                    result = createRestaurant(params["name"], params["location"]);
                    break;
                case 'CreateDrink':
                    result = createDrink(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                            parseInt(params["quantity"]), params["time"], parseBoolean(params["carbonated"]));
                    break;
                case 'CreateSalad':
                    result = createSalad(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                            parseInt(params["quantity"]), params["time"], parseBoolean(params["pasta"]));
                    break;
                case "CreateMainCourse":
                    result = createMainCourse(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                            parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]), params["type"]);
                    break;
                case "CreateDessert":
                    result = createDessert(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
                            parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]));
                    break;
                case "ToggleSugar":
                    result = toggleSugar(params["name"]);
                    break;
                case "ToggleVegan":
                    result = toggleVegan(params["name"]);
                    break;
                case "AddRecipeToRestaurant":
                    result = addRecipeToRestaurant(params["restaurant"], params["recipe"]);
                    break;
                case "RemoveRecipeFromRestaurant":
                    result = removeRecipeFromRestaurant(params["restaurant"], params["recipe"]);
                    break;
                case "PrintRestaurantMenu":
                    result = printRestaurantMenu(params["name"]);
                    break;
                default:
                    throw new Error('Invalid command name: ' + cmdName);
            }

            return result;
        }

        function parseBoolean(value) {
            switch (value) {
                case "yes":
                    return true;
                case "no":
                    return false;
                default:
                    throw new Error("Invalid boolean value: " + value);
            }
        }

        return {
            initialize: initialize,
            executeCommand: executeCommand
        };
    }());


    // Process the input commands and return the results
    var results = '';
    RestaurantEngine.initialize();
    commands.forEach(function (cmd) {
        if (cmd != "") {
            try {
                var cmdResult = RestaurantEngine.executeCommand(cmd);
                results += cmdResult;
            } catch (err) {
                results += err.message + "\n";
            }
        }
    });

    return results.trim();
}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------

//(function () {
//    var arr = [];
//    if (typeof (require) == 'function') {
//        // We are in node.js --> read the console input and process it
//        require('readline').createInterface({
//            input: process.stdin,
//            output: process.stdout
//        }).on('line', function (line) {
//            arr.push(line);
//        }).on('close', function () {
//            console.log(processRestaurantManagerCommands(arr));
//        });
//    }
//})();

