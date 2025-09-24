// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "appObjetivos",
      script: "serve",
      args: "-s dist -l 5000",
      interpreter: "none" // 👈 fuerza a PM2 a no usar node
    }
  ]
}
