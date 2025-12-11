𝗡𝗢𝗧𝗘 !!! - 𝗨𝗦𝗘 𝗧𝗛𝗜𝗦 𝗪𝗢𝗥𝗞𝗙𝗟𝗢𝗪 𝗖𝗢𝗗𝗘 𝗧𝗢 𝗗𝗘𝗣𝗟𝗢𝗬 𝗤𝗨𝗘𝗘𝗡_𝗠𝗔𝗬𝗔_𝗠𝗗 
𝗖𝗢𝗗𝗘 -  name: Node.js Cl

on:
  push:
    branches:
      - V-2
  pull_request:
    branches:
      - V-2

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install --legacy-peer-deps

    - name: Start application
      run: npm start
