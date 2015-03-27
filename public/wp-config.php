<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

require_once(dirname(__DIR__) . '/.env.config.php');

define('APP_ENV', getenv('APP_ENV') ?: 'local' );
define('APP_ROOT', dirname(__DIR__));

switch (APP_ENV) {

    case 'production':
        // define('WP_HOME', 'http://xxx');

        // define('DB_NAME', 'xxx');
        // define('DB_USER', 'xxx');
        // define('DB_PASSWORD', 'xxx');
        // define('DB_HOST', 'xxx');
        // define('DB_CHARSET', 'utf8');
        // define('DB_COLLATE', '');

        define('WP_DEBUG', false);
        break;
    default:
        define('WP_HOME', 'http://wordpress.app');

        define('DB_NAME', 'wp_wordpress');
        define('DB_USER', 'admin');
        define('DB_PASSWORD', '123');
        define('DB_HOST', 'db');
        define('DB_CHARSET', 'utf8');
        define('DB_COLLATE', '');

        define('WP_DEBUG', true);
        break;
}

define('WP_SITEURL', WP_HOME . '/wp');

define( 'WP_CONTENT_DIR', APP_ROOT . '/public/content' );
define( 'WP_CONTENT_URL', WP_HOME . '/content' );


/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'yz+q59(}TjZ*gUWjc/eOw+1w_}#pv55KZZ-Uk!e-w`U7QD|ENzqu+n#be+@0|@90');
define('SECURE_AUTH_KEY',  's@_7yq|y:-~o!s_pRdmS:U{@.KGv:.JfY)|Ag6=^B<B+-h7J<t$Hw!3Db%btq]?H');
define('LOGGED_IN_KEY',    'dd8wE)9t%X`/uafE ?):nYmnM$[<mpU!KemyCj+VU!ZDz6jZy6bmI%hoq7SnqG~7');
define('NONCE_KEY',        'e![ Ahey]uxZ%csqt 6*11u5D5|[[7$t5U+/fUdl6w*Sg7-9#]!Qk[T<sDNI?d4Q');
define('AUTH_SALT',        'lv./B52$Jw$o-E6to(j-&|7>S,*cK$mKSw{-JQu,Jy2BcvyrVC]!pyS.Oc!}^7X7');
define('SECURE_AUTH_SALT', 'jGDdQ4m;NuQaRS V0!>bP^aSktSj-< z/x.L&MKoc3#|!l-`Rfv,=BTA|2cIXnTu');
define('LOGGED_IN_SALT',   ']GbdMe7W[_P|-?sRU`rttk;mdP,:EYn{pme1`%D||*D,H]V:_KQJV1Ron_`owTk!');
define('NONCE_SALT',       'ibiD4#J{jX7hYqs8ELCBJQHo$PR-`,#,DQKgWD>G`HF)jSz1ro^GDJhz;m/da/}i');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
     define('ABSPATH', dirname(__FILE__) . '/wp/');

// if ( !defined('ABSPATH') )
//     define('ABSPATH', dirname(__FILE__) . '/wp/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
