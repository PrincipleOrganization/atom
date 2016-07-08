'use strict';

const gulp = require('gulp');
const notify = require("gulp-notify");

const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');
const del = require('del');
const fs = require('fs');
const pkg = require('./package.json');


// *** SERVER ***//


const cnf = {
  "port": {
    "dev": 4000,
    "prod": 4001
  },
  "db": {
    "vendor": "rethinkdb",
    "host": "127.0.0.1",
    "port": "30000",
    "base": {
      "dev": "test",
      "prod": "local"
    },
    "maxCount": 1000000
  },
  "sockets": {
    "use": true,
    "port": 4002
  },
  "intervalCommands": {
    "use": true,
    "interval": 1000
  }
};

var showLog = true;
var production = false;

gulp.task('prepare', function() {
  showLog = true;

  makeDirsInDir('.');
  generateDevicesFile('.');
  generateConfigDB();

  return;
});

gulp.task('clean-test', function() {
  return del('_test');
});

gulp.task('clean-dist', function() {
  return del('dist');
});

gulp.task('clean', ['clean-dist', 'clean-test']);

gulp.task('store', function() {
  generateConfigDB(null, "Test");
});

gulp.task('test', ['clean-test'], function() {
  showLog = true;
  production = false;

  const dir = '_test';

  makeDir(dir);
  moveAll(dir);
  makeDirsInDir(dir);
  generateMongoDB2File(dir);
  generateRethinkDBFile(dir);
  generateConfigDB(dir, "Test");

  notify("Gulp have builded '_test'.");

  return;
});

gulp.task('build', ['clean-dist'], function() {
  showLog = false;
  production = true;

  const dir = 'dist';
  const startDate = new Date();

  makeDir(dir);
  moveAll(dir);
  makeDirsInDir(dir);
  generateMongoDB2File(dir);
  generateRethinkDBFile(dir);
  generateBulidFIle(startDate, dir);
  generateConfigDB(dir, "Pantheon");

  notify("Gulp have builded 'dist'.");

  return;
});


///////////////////////////////////////////////////////////
/* FUNCTIONS                                             */

function generateBulidFIle(startDate, dir) {
  let buildInfo = `StartedAt: ${startDate}; FinishedAt: ${new Date()}; Node: ${process.version}; Arch: ${process.arch}; Platform: ${process.platform}; Author: ${process.env.USERNAME}; OS: ${process.env.OS}`;

  fs.writeFile(dir + '/build.txt', JSON.stringify(buildInfo), function(err) {
    if (err) {
      console.log(err);
    } else {
      log('Generated build file.');
    }
  });
}

function generateMongoDB2File(dir) {
  var path = `${__dirname}\\${dir}`;

  let confPath = `${path}\\config\\mongodb.conf`;

  let dbPath = `${path}\\db\\m_prod`;
  if (production) {
    dbPath = `$\\home\\.atom\\db\\m_prod`;
  }

  let conf = 'dbpath = ' +  dbPath
    + '\nport =' + cnf.db.port;

  fs.writeFile(confPath, conf, function(err) {
    if (err) {
      console.log(err);
    } else {
      log('Generated config file for MonogDB.');
    }
  });
}

function generateRethinkDBFile(dir) {
  var path = `${__dirname}\\${dir}`;

  let confPath = `${path}\\config\\rethinkdb.conf`;

  let dbPath = `${path}\\db\\r_prod`;
  if (production) {
    dbPath = `$\\home\\.atom\\db\\r_prod`;
  }

  let conf = 'bind=' + cnf.db.host
    + '\ndriver-port=' + cnf.db.port
    + '\ndirectory=' + dbPath;

  fs.writeFile(confPath, conf, function(err) {
    if (err) {
      console.log(err);
    } else {
      log('Generated config file for RethinkDB.');
    }
  });
}

function generateConfigDB(dir, productName) {
  let path = `${__dirname}\\config\\store.ac`;
  if (dir) {
    path = `${__dirname}\\${dir}\\config\\store.ac`;
  }

  let db = new sqlite3.Database(path);

  db.serialize(function() {
    // Configs
    db.run(`CREATE TABLE IF NOT EXISTS configs (
      name TEXT UNIQUE NOT NULL,
      port_dev TEXT NOT NULL,
      port_prod TEXT NOT NULL,
      db_vendor TEXT NOT NULL,
      db_host TEXT NOT NULL,
      db_port TEXT NOT NULL,
      db_base_dev TEXT NOT NULL,
      db_base_prod TEXT NOT NULL,
      db_maxcount TEXT NOT NULL,
      socket_use TEXT NOT NULL,
      socket_port TEXT NOT NULL,
      intervalCommands_use TEXT NOT NULL,
      intervalCommands_interval TEXT NOT NULL,
      use INTEGER NOT NULL DEFAULT 0,
      canBeDeleted INTEGER NOT NULL DEFAULT 1
    )`);

    let _configs = db.prepare('INSERT OR REPLACE INTO configs (name, port_dev, port_prod, db_vendor, db_host, db_port, db_base_dev, db_base_prod, db_maxcount, socket_use, socket_port, intervalCommands_use, intervalCommands_interval, use, canBeDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    _configs.run(
      'default',
      cnf.port.dev,
      cnf.port.prod,
      cnf.db.vendor,
      cnf.db.host,
      cnf.db.port,
      cnf.db.base.dev,
      cnf.db.base.prod,
      cnf.db.maxCount,
      cnf.sockets.use,
      cnf.sockets.port,
      cnf.intervalCommands.use,
      cnf.intervalCommands.interval,
      true,
      false
    );
    _configs.finalize();

    // Devices
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      name TEXT NOT NULL,
      path TEXT UNIQUE NOT NULL,
      tableName TEXT NOT NULL,
      vendor TEXT NOT NULL,
      model TEXT NOT NULL,
      units TEXT NOT NULL,
      baudRate INTEGER DEFAULT 9600,
      dataBits INTEGER DEFAULT 8,
      stopBits INTEGER DEFAULT 1,
      parity TEXT DEFAULT none,
      rtscts INTEGER DEFAULT 0,
      xon INTEGER DEFAULT 0,
      xoff INTEGER DEFAULT 0,
      xany INTEGER DEFAULT 0,
      flowControl INTEGER DEFAULT 0,
      bufferSize INTEGER DEFAULT 65536,
      use INTEGER NOT NULL DEFAULT 1
    )`);

    // Plugins
    db.run(`CREATE TABLE IF NOT EXISTS plugins (
      name TEXT UNIQUE NOT NULL,
      params TEXT NOT NULL
    )`);

    // Info
    let info = {
      product: productName,
      atom: {
        version: pkg.version
      },
      author: pkg.author,
      license: pkg.license,
      bugs: pkg.bugs.url,
      homepage: pkg.homepage
    };

    db.run(`CREATE TABLE IF NOT EXISTS info (
      product TEXT UNIQUE NOT NULL,
      atom_version TEXT NOT NULL,
      author TEXT NOT NULL,
      license TEXT NOT NULL,
      bugs TEXT NOT NULL,
      homepage TEXT NOT NULL
    )`);

    let _info = db.prepare('INSERT OR REPLACE INTO info (product, atom_version, author, license, bugs, homepage) VALUES (?, ?, ?, ?, ?, ?)');
    _info.run(
      info.product,
      info.atom.version,
      info.author,
      info.license,
      info.bugs,
      info.homepage
    );
    _info.finalize();
  });

  db.close();

  log('Generated store fo configs.');
}

function makeDir(dir) {
  mkdirp(dir, function (err) {
    if (err) {
      console.error(err)
    }
    else {
      log(`Directory ${dir} created.`);
    }
  });
}

function makeDirsInDir(dir) {
  makeDir(dir + '/db');
  makeDir(dir +'/db/r_prod');
  makeDir(dir +'/db/m_prod');
  makeDir(dir + '/plugins');
  makeDir(dir + '/info');
  makeDir(dir + '/config');
}

function moveAll(dir) {
  gulp.src('./start')
    .pipe(gulp.dest(dir));

  gulp.src('./app.js')
    .pipe(gulp.dest(dir));

  gulp.src('./api/**/*.*')
    .pipe(gulp.dest(dir + '/api'));

  gulp.src('./config/config.json')
    .pipe(gulp.dest(dir + '/config'));

  gulp.src('./lib/**/*.*')
    .pipe(gulp.dest(dir + '/lib'));

  gulp.src('./node_modules/**/*.*')
    .pipe(gulp.dest(dir + '/node_modules'));

  gulp.src('./vendor/**/*.*')
    .pipe(gulp.dest(dir + '/vendor'));
}

function log(msg) {
  if (showLog) {
    console.log(msg);
  }
}


// *** CLIENT ***//

gulp.task('clean', function(){
  // del('dist');
  return;
});

gulp.task('css', function() {
  return gulp.src('./client/src/css/*.*')
    .pipe(gulp.dest('./client/public/'));
});

gulp.task('img', function() {
  return gulp.src('./client/src/img/*.*')
    .pipe(gulp.dest('./client/public/img/'));
});

gulp.task('vendor', function() {
  return gulp.src('./client/src/vendor/**/*.*')
    .pipe(gulp.dest('./client/public/vendor/'));
});

gulp.task('html', function() {
  return gulp.src('./client/src/html/*.*')
    .pipe(gulp.dest('./client/'));
});

gulp.task('watch', function () {
  return gulp.watch('./client/src/css/**/*.css', ['css']);
});

gulp.task('client.build', ['html', 'vendor', 'img', 'css']);
