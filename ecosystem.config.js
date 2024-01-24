module.exports = {
  apps: [
    {
      name: 'nest-kafka',
      script: 'dist/main.js',
      args: 'start', 
      watch: false,
    },
  ],
};
