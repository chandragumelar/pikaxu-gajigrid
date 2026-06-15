module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'chore', 'test', 'docs', 'perf', 'ci', 'build', 'style'],
    ],
  },
}
