## MonoRepo Spike
Trying out mono repo with [lerna](https://github.com/lerna/lerna) and [conventional commits](https://conventionalcommits.org/)

## How to try out
- Install lerna using `npm install --global lerna`
- Run `yarn bootstrap`
- Make a change in any of the packages/services. Remember to follow conventional commit style(feat, fix, refactor etc)
- Commit your change
- Run `lerna ls` to see current version of packages/services
- Run `lerna updated` to see packages/services that has an update
- Run `yarn publish` to bump version of updated packages/services
- Run `lerna ls` to see new version of packages/services

