/**
 * Pet Finder
 *
 * Author: Irina Hallinan
 * Date: 03/21/2022
 *
 * This program  allows the user to interact with the animal shelter via the command-line interface and see available pets, search for pets of the given type and breed, and adopt a pet.
 *
 * The program assumes the Node.js is installed with a package "prompt". To run the program, in the terminal type:
 * $ node pet_finder.js
 *
 * When the program is running, it repeatedly prints the following options to the console:
 * Press 1 to see available pets
 * Press 2 to search for a pet by type and breed
 * Press 3 to adopt the pet by name
 * Press 4 to exit
 *
 */

/**
 * To accept user input from NodeJS console repeatedly, add the "prompt" npm module.
 * As a pre-requisite, the prompt package needs to be installed with "npm install prompt".
 */
const prompt = require('prompt');

/**
 * Class UserInterface contains a single method called interact that takes the AnimalShelter reference as a parameter, and allows the user to interact with the shelter using the keyboard input. As described above, this method should repeatedly print the four options until the user selects "4" to quit; it should take the user's input and perform some action on the shelter (such as print available pets, search for a pet etc).
 */
class UserInterface {
    constructor(animal_shelter) {
        this.animal_shelter = animal_shelter;
    }
    interact() {
        console.log();
        console.log(`*** Welcome to Pet Finder! ***`);
        const animal_shelter = this.animal_shelter;
        const instructions = "\n* Enter 1 to see available pets\n* Enter 2 to search for a pet by type and breed\n* Enter 3 to adopt the pet by name\n* Enter 4 to exit\n";
        ask();

        /**
         * Function ask prompts the user for input.
         */
        function ask() {
            // Ask for name until user inputs "4" to exit the program.
            console.log(instructions);
            prompt.get(['input'], function(err, result) {
                if ( result ) {
                    let selection = result.input;
                    if ( selection === '1' ) {
                        displayShelterAnimals();
                        // Show the main prompt again
                        ask();
                    }
                    else if ( selection === '2' ) {
                        console.log("Enter the type of pet (dog or cat):");
                        // ask for pet type
                        askType();
                    }
                    else if ( selection === '3' ) {
                        // ask to adopt a pet by name
                        askName();
                    }
                    else if ( selection === '4' ) {
                        console.log('Exiting the program.');
                    } else {
                        // Any other input - display the main prompt
                        ask();
                    }
                } else {
                    // Input is undefined - display the main prompt
                    ask();
                }
            });
        }

        /**
         * Function askType prompts the user for the type of pets to search for.
         */
        function askType() {
            console.log('Enter the type:');
            prompt.get(['type'], function(err, result) {
                let type = result.type;
                if ( type === 'cat' || type === 'dog') {
                    askBreed(type);
                }
                 else {
                    // Type is neither cat nor dog (empty or unknown/invalid type).
                    askBreed('');
                }
            });
        }

        /**
         * Function askBreed prompts the user for the breed of pets to search for.
         * @param type {string} Optional, type of the pet to search for.
         */
        function askBreed( type ) {
            prompt.get(['breed'], function( err, result ) {
                let breed = result.breed;
                let pets = animal_shelter.search( type, breed );
                if ( pets && pets.length > 0 ) {
                    for (let i = 0; i < pets.length; i++ ) {
                        let pet = pets[i];
                        if ( pet.is_available ) {
                            console.log(`${pet.name}, ${pet.type}, ${pet.breed}`);
                        }
                    }
                } else if ( type && breed) {
                    console.log(`No pets are available for selected type (${type} and breed ${breed}.`);
                } else if ( type && !breed ) {
                    console.log(`No pets are available for selected type (${type}.`);
                } else if ( !type && breed ) {
                    console.log(`No pets are available for selected breed (${breed}.`);
                } else if ( !type && !breed ) {
                    console.log(`No pets are available.`);
                }
                // Show the main prompt again
                ask();
            });
        }

        /**
         * Function displayShelterAnimals prints all available pets to the console.
         */
        function displayShelterAnimals() {
            console.log("\nPets available for adoption:");
            const pets = animal_shelter.pets;
            const count = animal_shelter.count;
            if ( count === 0 ) {
                console.log("No pets are currently available.");
            } else {
                for (let i = 0; i < count; i++ ) {
                    let pet = pets[i];
                    if ( pet.is_available ) {
                        console.log(`${pet.name}, ${pet.type}, ${pet.breed}`);
                    }
                }
            }
        }

        /**
         * Function askName prompts user for the name of the pet to adopt.
         */
        function askName() {
            console.log('Enter the name of the pet you want to adopt:');
            prompt.get(['name'], function(err, result) {
                if ( result ) {
                    let name = result.name;
                    if ( name ) {
                        let is_adopted = animal_shelter.adopt( name );
                        if ( is_adopted ) {
                            console.log(`Congratulations! You adopted ${name}.`);
                        } else {
                            console.log(`Something went wrong. Please check that the name is spelled correctly.`);
                            console.log(`Pet trying to adopt is ${name}.`);
                        }
                    } else {
                        console.log(`You must specify a valid name in order to adopt a pet. Please try again.`);
                    }
                    ask();
                }
            });
        }
    }
}

/**
 * AnimalShelter stores an array of pets and has methods to search for pets by type and breed,  adopt a pet with the given name, show available pets etc.
 *
 * Class AnimalShelter stores an array of Pet references, and a variable called count that tells us how many pets we currently added to the shelter. It also has methods to add a pet to the shelter, to search for a pet given the type and the breed, as well as adopt a particular pet given the name (as mentioned above, we assume the names are unique). Read the comments inside the class and fill in code as necessary.
 */
class AnimalShelter {
    constructor(pets, count) {
        this.pets = pets;
        this.count = count;
    }

    /**
     * Add a new pet to the shelter. Assume pet has a unique name.
     * @param pet {object}
     */
    add( pet ) {
        this.pets.push( pet )
    }

    /**
     * Search methods checks in the shelters pets property for the specified type and breed of a pet. Pets returned are available pets.
     * @param type {string} Optional type of pet to look for.
     * @param breed {string} Optional breed of pet to look for.
     * @returns {*[]} Array of pets that match the search criteria. If neither breed nor type is specified, returns all available pets.
     */
    search( type, breed ) {
        let results = [];
        if ( type && breed ) {
            // Both type and breed are defined
            for (let i = 0; i < this.count; i++ ) {
                let pet = this.pets[i];
                if ( pet.type === type && pet.breed === breed && pet.is_available ) {
                    results.push(pet);
                }
            }

        } else if ( type && ! breed ) {
            // Type is defined but breed is not
            for (let i = 0; i < this.count; i++ ) {
                let pet = this.pets[i];
                if ( pet.type === type && pet.is_available ) {
                    results.push(pet);
                }
            }

        } else if ( !type && breed ) {
            // Breed is defined but type is not
            for (let i = 0; i < this.count; i++ ) {
                let pet = this.pets[i];
                if ( pet.breed === breed && pet.is_available ) {
                    results.push(pet);
                }
            }
        } else {
            // Type and breed are undefined - return all available pets
            for (let i = 0; i < this.count; i++ ) {
                let pet = this.pets[i];
                if ( pet.is_available ) {
                    results.push(pet);
                }
            }
        }
        return results;
    }

    /**
     * Adopt method sets the availability of a specified pet to false, so that it is not available for adoption anymore. Name is case-insensitive.
     * @param name {string} The unique name of the pet to adopt.
     * @returns {boolean} true if successfully adopted and false otherwise.
     */
    adopt( name ) {
        let result = false;
        for (let i = 0; i < this.count; i++ ) {
            let pet = this.pets[i];
            if ( name && pet.name.toLowerCase() === name.toLowerCase() && pet.is_available ) {
                pet.is_available = false;
                result = true;
            }
        }
        return result;
    }
}

/**
 * Class Pet represents a single pet in the shelter. It should store the attributes of the pet as instance variables: name, type, breed, as well as the boolean flag that tells us whether the pet is available for adoption or not. After the pet has been adopted, this boolean flag should be set to false.
 */
class Pet {
    constructor( name, type, breed, is_available ) {
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.is_available = is_available;
    }
}

/**
 * Main functionality of the program.
 */
class ProjectDriver {
    run() {
        const Luna = new Pet("Luna", "dog", "Golden Retriever", true );
        const Teddy = new Pet("Teddy", "dog", "Labrador", true );
        const Charlie = new Pet("Charlie", "dog", "Golden Retriever", true );
        const Aster = new Pet("Aster", "dog", "Husky", true );
        const Goldie = new Pet("Goldie", "cat", "Shorthair", true );
        const Lisa = new Pet("Lisa", "cat", "Longhair", true );
        const Timmy = new Pet("Timmy", "cat", "Siamese", true );
        const Oliver = new Pet("Oliver", "cat", "Shorthair", true );

        const pets = [];
        pets.push(Luna, Teddy, Charlie, Aster, Goldie, Lisa, Timmy, Oliver);

        const animal_shelter = new AnimalShelter(pets, pets.length);
        const ui = new UserInterface(animal_shelter);
        ui.interact();
    }
}
const project = new ProjectDriver();
project.run();



