<?php
class Settings {
    private static $defaultSettingsFilename = '__default.settings.json';
    private static $settings = array();

    /**
     * Returns value for passed setting name.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @return mixed
     */
    public static function get($settingName) {
        if (empty(self::$settings)) self::read( self::$defaultSettingsFilename );

        if (array_key_exists($settingName, self::$settings)) {
            return self::$settings->$settingName;
        }

        die("UNDEFINED SETTING: $settingName");
    }

    /**
     *  Reads settings.
     * 
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param string $settingsFilename
     */
    private static function read($settingsFilename) {
        $file = dirname(__FILE__) . "/../settings/$settingsFilename";

        //read the contents of the file and remove extraneous whitespace
        $rawObject = file_get_contents($file);

        //decode it
        $encodedData = json_decode($rawObject, false);

        if ($encodedData === false || is_null($encodedData)) {
            throw new Exception ("INVALID JSON FORMAT IN FILE: $file");
        }

        self::$settings = $encodedData;
    }
}