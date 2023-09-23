- I used the API URL rather than the provided JSON file, this caused a few hiccups as the references in the JSON file are simplified when compared to the actual objects returned from the API.

- I should have declared more variables globally as this caused headached throughout the code, once i was in deep I just pushed on, though i think some refactoring would help to remove excess variable declarations.

- More functions could be made to handle smaller tasks, this would enable them to be called with different event listeners and render some extra code obsolete.

- I still need to get a grasp on async, await principles in order to not have to repeat eventListeners to dynamically added components (this could also be overcome by the defining more reusable functions at the start of the code and calling them as they are needed)

- The CSS is quite basic but was not my learning goals in this project, though I think the simple approach worked ok as it yielded for minimal media queries.

- the filter by area dropdown is not styled, this could be done in the future, but no one is going to look at this project anyway.

___ Overall I learnt to declare more global variables, create more reusable functions and try to declare the JSON data from the API into variables that can be used globally rather then constantly needing to try and relocate the index of the given item(country).