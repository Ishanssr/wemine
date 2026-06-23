module.exports = {
  apps: [
    {
      name: 'wemine-api',
      script: 'dist/src/main.js',
      cwd: '/home/ubuntu/backend/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_file: '.env',
      max_memory_restart: '512M',
      error_file: '/home/ubuntu/logs/wemine-api-error.log',
      out_file: '/home/ubuntu/logs/wemine-api-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      kill_timeout: 5000,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
