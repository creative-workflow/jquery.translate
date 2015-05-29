##Issues

- Report issues or feature requests on [GitHub Issues](https://github.com/creative-workflow/jquery.language/issues).
- If reporting a bug, please add a [simplified example](http://sscce.org/).

##Pull requests
- Create a new topic branch for every separate change you make.
- Create a test case if you are fixing a bug or implementing an important feature.
- Make sure the build runs successfully.

## Development

###Tools
We use the following tools for development:

- [Jasmine](http://jasmine.github.io) for tests.
- [NodeJS](http://nodejs.org/download/) required to run grunt.
- [Grunt](http://gruntjs.com/getting-started) for task management.

###Getting started
Install [NodeJS](http://nodejs.org/).  
Install globally grunt-cli using the following command:

    $ npm install -g grunt-cli

Browse to the project root directory and install the dev dependencies:

    $ npm install -d

To execute the build and tests run the following command in the root of the project:

    $ grunt

You should see a green message in the console:

    Done, without errors.

###Automatic build
You can build automatically after a file change using the following command:

    $ grunt watch
