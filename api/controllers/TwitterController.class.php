<?php
require_once dirname(__FILE__) . '/../libs/Twitter.php';

/**
 * Handles Twitter API interaction and OAuth flow.
 *
 * @author Alberto Miranda <alberto.php@gmail.com>
 */
class TwitterController {
    private $consumerKey = null;
    private $consumerSecret = null;
    private $callback = null;

    /* @var Twitter $connection */
    private $connection = null;

    public function __construct() {
        $settings = Settings::get('twitter');
        $this->consumerKey = $settings->consumerKey;
        $this->consumerSecret = $settings->consumerSecret;
        $this->callback = $settings->oauthCallback;

        //set Twitter connection object
        //it will be used to run each API call
        $oauthParams = array(
            'oauth_token' => $settings->accessToken,
            'oauth_token_secret' => $settings->accessTokenSecret
        );
        $this->setConnection($oauthParams);
    }

    /**
     * Sets a Twitter connection object.
     * If OAuth params are not sent the connection is initialized with
     * consumer_key and consumer_secret only, which allows us to get the
     * request_token and the authorize url from Twitter.
     * OAuth params may contain oauth_token and oauth_token_secret, the ones
     * obtained after a User gives permission to the app to act on his behalf.
     * If sent they'll be used to sign request to Twitter API, effectively
     * letting us act on behalf of the User.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param array $oauthParams
     */
    private function setConnection($oauthParams = null){
        $oauthToken = null;
        $oauthTokenSecret = null;
        if (!empty($oauthParams['oauth_token']) and !empty($oauthParams['oauth_token_secret'])) {
            $oauthToken = $oauthParams['oauth_token'];
            $oauthTokenSecret = $oauthParams['oauth_token_secret'];
        }

        /* Build TwitterOAuth object with client credentials. */
        $connection = new Twitter($this->consumerKey, $this->consumerSecret, $oauthToken, $oauthTokenSecret);
        $this->connection = $connection;
    }

    /**
     * Main API hook.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param array $request
     */
    public function api($request) {
        //api params
        //print_r($request); exit;

        //method
        if (empty($request['method'])) throw new Exception(__METHOD__ . ": Twitter 'method' NOT SPECIFIED");
        $method = $request['method'];

        //params
        $params = null;
        if (!empty($request['params'])) $params = $request['params'];

        //make Twitter API call and return response
        if ($method == 'get') {
            //queries a full URL with optional params
            $response = $this->connection->oAuthRequest($params['uri'], 'GET', $params['params']);
        } else {
            //queries a Twitter method with optional params
            $response = $this->connection->oAuthRequest($method, 'GET', $params);
        }
        return $response;
    }

    /**
     * Returns request token.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @return array
     */
    public function getRequestToken() {
        /* Get temporary credentials. */
        $requestToken = $this->connection->getRequestToken($this->callback);
        //die("REQUEST TOKEN: " . print_r($requestToken, true));
        return $requestToken;
    }

    /**
     * Returns authorization url.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param array $params
     * @return array
     */
    public function getAuthorizeUrl($params) {
        if ( empty($params['oauth_token']) ) {
            throw new Exception(__METHOD__ . ": REQUIRED PARAMS NOT SENT: oauth_token");
        }

        $token = $params['oauth_token'];
        $url = $this->connection->getAuthorizeURL($token);
        $response = array('url' => $url);
        return $response;
    }

    /**
     * Returns access token response.
     *
     * @author Alberto Miranda <alberto.php@gmail.com>
     * @param array $params
     * @return array
     */
    public function getAccessToken($params) {
        //echo "GET ACCESS TOKEN PARAMS: "; print_r($params); exit;

        if (empty($params['oauth_token']) or empty($params['oauth_token_secret']) or empty($params['oauth_verifier'])) {
            throw new Exception(__METHOD__ . ": REQUIRED PARAMS NOT SENT: oauth_token, oauth_token_secret, oauth_verifier");
        }

        /* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
        //$connection = new Twitter($consumerSecret, $consumerSecret, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
        $this->setConnection($params);

        /* Request access tokens from twitter */
        $accessToken = $this->connection->getAccessToken($params['oauth_verifier']);
        $profile = $this->getProfile($accessToken['screen_name']);
        $accessToken['profile'] = json_decode($profile);
        return $accessToken;
    }
}