# Contribution Guide

<hr>

First off, thank you for considering contributing to Box. It's people like you that make Box such a great tool.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/halukajs/box/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

If you have a general question about Box, you can post it on [Stack Overflow](http://stackoverflow.com/questions/tagged/haluka-box) or find someone to help on our [Discord Server](https://discord.gg/4kXAZe6), the issue tracker is only for bugs and feature requests.

## Fork & Create a branch

If this is something you think you can fix, then [fork Box](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue `#69` is the ticket you're working on):

```bash
git checkout -b 69-add-new-methods
```

## Get the tests runnning

You need to install development dependencies to get the test runner up. Box uses [Jest](https://jestjs.io/) testing framework and [ESLint](https://eslint.org/) linter.

```bash
npm install
```
or, if you use `yarn`
```bash
yarn install
```

Now you'll be able to run test suites by running:
```bash
npm test
#or,
yarn test
```

## Implement your fix or feature
At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first 😸

## Get the style right
Your patch should follow the same conventions & pass the same code quality checks as the rest of the project. `npm run lint` will give you feedback in this regard. You can check & fix style issues by running the linter.

## Add a changelog entry
If your PR includes user-observable changes, you'll be asked to add a changelog entry following the existing changelog format.

The changelog format is the following:

One line per PR describing your fix or enhancement.
Entries end with a dot, followed by "[#pr-number] by [@github-username]".
Entries are added under the "Unreleased" section at the top of the file, under the "Bug Fixes" or "Enhancements" subsection.
References to github usernames and pull requests use shortcut reference links.
Your github username reference definition is included in the correct alphabetical position at the bottom of the file.

## Make a Pull Request
At this point, you should switch back to your master branch and make sure it's up to date with Box's master branch:
```bash
git remote add upstream git@github.com:halukajs/haluka.git
git checkout master
git pull upstream master
```
Then update your feature branch from your local copy of master, and push it!
```bash
git checkout 69-add-new-methods
git rebase master
git push --set-upstream origin 69-add-new-methods
```
Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) :D

CircleCI will run our test suite against all supported Node.js versions. We care about quality, so your PR won't be merged until all tests pass. It's unlikely, but it's possible that your changes pass tests in one Node.js version but fail in another. In that case, you'll have to setup your development environment (as explained in step 3) to use the problematic Node.js version, and investigate what's going on!

## Keeping your Pull Request updated
If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good](http://git-scm.com/book/en/Git-Branching-Rebasing) [resources](https://help.github.com/en/github/using-git/about-git-rebase) but here's the suggested workflow:
```bash
git checkout 69-add-new-methods
git pull --rebase upstream master
git push --force-with-lease 69-add-new-methods
```
