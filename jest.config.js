/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: { //necessary for aliased import resolution using "@"
		"^@/(.*)$": "<rootDir>/src/$1"
	}
};