
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');

    initExampleUi();
    initScanbotSdk();
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }

};

app.initialize();


function initExampleUi() {
  document.getElementById('start-camera-ui-button').onclick = function(e) {
    startCameraUi();
  };
}

function initScanbotSdk() {
  var options = {
    loggingEnabled: true,
    licenseKey: ''
  };

  ScanbotSdk.initializeSdk(
      function(result) {
        console.log(result);
      },
      sdkErrorCallback, options
  );
}

function sdkErrorCallback(error) {
  console.log('Error from Scanbot SDK: ' + error);
  alert('Error from Scanbot SDK: ' + error);
}

function startCameraUi() {
  var options = {
    edgeColor: '#0000ff'
  };

  ScanbotSdkUi.startCamera(
      function(result) {
        console.log('Camera result: ' + JSON.stringify(result));
      },
      sdkErrorCallback, options
  );
}
